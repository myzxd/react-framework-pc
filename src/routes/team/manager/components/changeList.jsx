/**
 * 业主管理 - 编辑页 - 变更记录 组件
 */
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Popconfirm, Table } from 'antd';
import React, { Component } from 'react';

import { CoreContent } from '../../../../components/core';
import { DistrictState, ChangeAction, CoachEffectState } from '../../../../application/define';


class ChangeList extends Component {
  static propTypes = {
    teamManagerChangeList: PropTypes.object, // 变更记录
  };

  static defaultProps = {
    teamManagerChangeList: {},
  };

  // 获取列表数据
  componentDidMount() {
    const { id } = this.props;
    const params = { id };
    this.props.dispatch({ type: 'teamManager/fetchOwnerChangeLog', payload: params });
  }

  // 成功回调
  onSuccessCallBack = () => {
    this.props.onSearch();
  }
//  取消操作
  onChangeCancel = (rowData) => {
    const payload = {
      id: rowData._id,
      state: CoachEffectState.lose,        // 传递已失效状态
      onSuccessCallBack: this.onSuccessCallBack,
    };
    this.props.dispatch({ type: 'teamManager/fetchOwnerChangeCancel', payload });
  }

  //  生效状态判定
  displayState = (text) => {
    let dom = '';
    switch (text) {
      case CoachEffectState.effected:
        dom = <span className="app-global-compoments-color1">{CoachEffectState.description(text)}</span>;
        break;
      case CoachEffectState.effectBefore:
        dom = <span className="app-global-compoments-color2">{CoachEffectState.description(text)}</span>;
        break;
      case CoachEffectState.lose:
        dom = <span className="app-global-compoments-color3">{CoachEffectState.description(text)}</span>;
        break;
      default:
        dom = '--';
        break;
    }
    return dom;
  }


  // 渲染承揽范围
  renderScope = () => {
    // 变更记录
    const { teamManagerChangeList: logData = {} } = this.props;
    const data = logData.data || [];
    const total = logData._meta ? logData._meta.result_count : 0;
    const { page, limit, onChangePage, onShowSizeChange } = this.props;

    const columns = [
      {
        title: '平台',
        dataIndex: ['biz_district_info', 'platform_name'],
        key: 'biz_district_info.platform_name',
        render: text => text || '--',
      },
      {
        title: '供应商',
        dataIndex: ['biz_district_info', 'supplier_name'],
        key: 'biz_district_info.supplier_name',
        render: text => text || '--',
      },
      {
        title: '城市',
        dataIndex: ['biz_district_info', 'city_name'],
        key: 'biz_district_info.city_name',
        render: text => text || '--',
      },
      {
        title: '商圈',
        dataIndex: ['biz_district_info', 'name'],
        key: 'biz_district_info.name',
        render: text => text || '--',
      },
      {
        title: '商圈状态',
        dataIndex: ['biz_district_info', 'state'],
        key: 'biz_district_info.state',
        render: text => DistrictState.description(text),
      },
      {
        title: '最新操作人',
        dataIndex: ['operator_info', 'name'],
        key: 'operator_info.name',
        render: text => text || '--',
      },
      {
        title: '操作时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '动作',
        dataIndex: 'event',
        key: 'event',
        render: text => ChangeAction.description(text),
      },
      {
        title: '生效状态',
        dataIndex: 'state',
        key: 'state',
        render: text => this.displayState(text),
      },
      {
        title: '生效日期',
        dataIndex: 'plan_done_date',
        key: 'plan_done_date',
        render: text => (text ? moment(`${text}`).format('YYYY年MM月DD日') : '--'),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 80,
        render: (text, rowData) => {
          // 没有状态 || 状态数据是已启用
          if (rowData.state !== CoachEffectState.effectBefore) {
            return '--';
          }
          return (
            <React.Fragment>

              <Popconfirm
                title="是否确认取消本次变更记录?"
                onConfirm={this.onChangeCancel.bind(this, rowData)}
                okText="确定"
                cancelText="取消"
              >
                <span className="app-global-compoments-cursor">取消</span>
              </Popconfirm>
            </React.Fragment>
          );
        },
      },
    ];

    // 分页
    const pagination = {
      current: page,
      defaultPageSize: 30,                      // 默认数据条数
      pageSize: limit,                          // 每页展示条数
      onChange: onChangePage,              // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange,  // 展示每页数据数
      showTotal: showTotal => `总共${showTotal}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total, // 数据总条数
    };
    const title = <span>变更记录&emsp;&emsp;注：以下<span className="app-global-compoments-color4">待生效</span>的数据次月1号开始生效</span>;
    return (
      <CoreContent
        title={title}
      >
        <Table
          rowKey={(record, index) => {
            return index;
          }}
          pagination={pagination}
          dataSource={data}
          columns={columns}
          bordered
        />
      </CoreContent>
    );
  }

  render() {
    return this.renderScope();
  }
}

const mapStateToProps = ({ teamManager: { teamManagerChangeList } }) => {
  return { teamManagerChangeList };
};

export default connect(mapStateToProps)(ChangeList);
