/**
 * 商圈变更记录 - 页面
*/
import moment from 'moment';
import React from 'react';
import { Table, Tooltip } from 'antd';
import { connect } from 'dva';

import { CoreContent } from '../../../../../components/core';

import { DistrictChangeType } from '../../../../../application/define';

import Styles from '../style/index.less';

class Index extends React.Component {

  constructor() {
    super();
    this.private = {
      pageConfig: {
        page: 1,
        limit: 30,
      },
    };
  }

  componentDidMount() {
    // 获取列表数据
    this.fetchTableData();
  }

  // 改变页码
  onPaginationChange = (page, pageSize) => {
    this.private.pageConfig.page = page;
    this.private.pageConfig.limit = pageSize;
    this.fetchTableData();
  }
  // 每页条数改变
  onSizeChange = (current, size) => {
    this.private.pageConfig.page = 1;
    this.private.pageConfig.limit = size;
    this.fetchTableData();
  }

  // 获取列表数据
  fetchTableData = () => {
    const { id } = this.props.location.query;
    if (!id) {
      return false;
    }
    this.props.dispatch({
      type: 'districtManage/fetchAssetsChangLog',
      payload: {
        pageConfig: this.private.pageConfig,
        id,
      },
    });
  }

  renderTableData = () => {
    const { page, limit } = this.private.pageConfig;
    const {
      data: dataSource = [],
      _meta: {
        result_count: total = 0,
      } = {},
    } = this.props.assetsChangeLog;
    const columns = [
      {
        title: '变更时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: text => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'),
      },
      {
        title: '变更类型',
        dataIndex: 'domain',
        key: 'domain',
        render: text => (text ? DistrictChangeType.description(text) : '--'),
      },
      {
        title: '变更前信息',
        dataIndex: 'raw_change_info',
        key: 'raw_change_info',
        render: (text) => {
          if (text && text.length > 0) {
            return text.map((item, index) => {
              if (item.length > 30) {
                return (<Tooltip title={item}>
                  <p className={Styles['app-comp-assets-change-log-p']} key={index}>{item.slice(0, 20)}...</p>
                </Tooltip>);
              }
              return <p className={Styles['app-comp-assets-change-log-p']} key={index}>{item}</p>;
            });
          }
          return '--';
        },
      },
      {
        title: '变更后信息',
        dataIndex: 'now_change_info',
        key: 'now_change_info',
        render: (text) => {
          if (text && text.length > 0) {
            return text.map((item, index) => {
              if (item.length > 30) {
                return (<Tooltip title={item}>
                  <p className={Styles['app-comp-assets-change-log-p']} key={index}>{item.slice(0, 20)}...</p>
                </Tooltip>);
              }
              return <p className={Styles['app-comp-assets-change-log-p']} key={index}>{item}</p>;
            });
          }
          return '--';
        },
      },
      {
        title: '操作人',
        dataIndex: 'creator_info',
        key: 'creator_info.name',
        render: text => (text && text.name ? text.name : '--'),
      },
    ];
    const pagination = {
      current: page,
      pageSize: limit,
      onChange: this.onPaginationChange,
      showSizeChanger: true,
      onShowSizeChange: this.onSizeChange,
      pageSizeOptions: ['10', '20', '30', '40'],
      total,
    };
    return (<Table
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      bordered
      rowKey={(record, index) => { return record._id || index; }}
    />);
  }
  render() {
    return (
      <CoreContent title="变更记录">
        {this.renderTableData()}
      </CoreContent>
    );
  }
}

const mapStateToProps = ({ districtManage: { assetsChangeLog } }) => ({ assetsChangeLog });

export default connect(mapStateToProps)(Index);
