/**
 * 私教管理 - 私教指导
 */
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Table, Button, Popover } from 'antd';

import { CoreContent } from '../../../../components/core';
import Operate from '../../../../application/define/operate';
import CreateMessageModal from './components/createMessageModal';
import Search from './search';
import styles from './style/index.less';

const canOperateTeamTeacherMessageButton = Operate.canOperateTeamTeacherMessageButton();
class Index extends Component {
  static propTypes = {
    teamMessages: PropTypes.object, // 私教指导列表
  }

  static defaultProps = {
    teamMessages: {
      data: [],
      _meta: {},
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false, // 是否显示新增私教指导弹窗
    };
    this.private = {
      // 搜索的参数
      searchParams: {
        meta: { page: 1, limit: 30 },
      },
    };
  }

  componentDidMount() {
    const { searchParams } = this.private;
    this.props.dispatch({
      type: 'teamMessage/fetchTeamMessage',
      payload: searchParams,
    });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch(searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.meta.page = page;
    searchParams.meta.limit = limit;
    this.onSearch(searchParams);
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    const { searchParams } = this.private;
    this.private.searchParams = {
      ...searchParams,
      ...params,
    };
    this.props.dispatch({
      type: 'teamMessage/fetchTeamMessage',
      payload: this.private.searchParams,
    });
  }

  onDistrictsSuccessCallback = () => {
    this.setState({
      isShowModal: true,
    });
  }

  // 显示私教指导Modal
  showModal = () => {
    const payload = {
      onSuccessCallback: this.onDistrictsSuccessCallback,
    };
    this.props.dispatch({
      type: 'teamMessage/fetchTeamAccountDistricts',
      payload,
    });
  }

  // 隐藏私教指导Modal
  hideModal = () => {
    this.setState({
      isShowModal: false,
    });
  }

  // 渲染指导意见
  renderAdvise = (text) => {
    if (text.length < 15) return text;
    return (
      <Popover
        content={<div
          className={styles['app-comp-team-message-word-break']}
        >
          {text}
        </div>}
      >
        {`${text.substring(0, 15)}...`}
      </Popover>
    );
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch } = this;
    const operations = [
      <Button
        type="primary"
        key="createTeamMessage"
        onClick={this.showModal}
      >
        新增指导意见
      </Button>,
    ];
    return (
      <Search
        onSearch={onSearch}
        operations={canOperateTeamTeacherMessageButton ? operations : []}
      />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { page } = this.private.searchParams.meta;
    const { data, _meta } = this.props.teamMessages;

    const columns = [
      {
        title: '平台',
        dataIndex: 'biz_district_info',
        key: 'platform',
        render: (text) => {
          return text && text.platform_name
                ? text.platform_name
                : '--';
        },
      },
      {
        title: '供应商',
        dataIndex: 'biz_district_info',
        key: 'supplier',
        render: (text) => {
          return text && text.supplier_name
                ? text.supplier_name
                : '--';
        },
      },
      {
        title: '城市',
        dataIndex: 'biz_district_info',
        key: 'city',
        render: (text) => {
          return text && text.city_name
                ? text.city_name
                : '--';
        },
      },
      {
        title: '商圈',
        dataIndex: 'biz_district_info',
        key: 'district',
        render: (text) => {
          return text && text.name
                ? text.name
                : '--';
        },
      },
      {
        title: '指导意见',
        dataIndex: 'advise',
        key: 'advise',
        render: this.renderAdvise,
      },
      {
        title: '创建人',
        dataIndex: 'creator_info',
        key: 'creator_name',
        render: (text) => {
          return text && text.name
                ? text.name
                : '--';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
    ];

    // 分页
    const pagination = {
      current: page,
      defaultPageSize: 30,                       // 默认数据条数
      onChange: this.onChangePage,               // 切换分页
      showQuickJumper: true,                     // 显示快速跳转
      showSizeChanger: true,                     // 显示分页
      onShowSizeChange: this.onShowSizeChange,   // 展示每页数据数
      showTotal: total => `总共${total}条`,       // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: _meta.result_count || 0,            // 数据总条数
    };

    return (
      <CoreContent>
        {/* 数据 */}
        <Table
          rowKey={(record, index) => { return index; }}
          dataSource={data}
          columns={columns}
          pagination={pagination}
          bordered
        />
      </CoreContent>
    );
  }

  // 渲染新增指导意见Modal
  renderTeachMessageModal = () => {
    const { isShowModal } = this.state;
    return (
      <CreateMessageModal
        onSearch={this.onSearch}
        isShowModal={isShowModal}
        hideModal={this.hideModal}
      />
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染搜索 */}
        {this.renderSearch()}

        {/* 渲染内容 */}
        {this.renderContent()}

        {/* 渲染新增指导意见Modal */}
        {this.renderTeachMessageModal()}
      </div>
    );
  }
}

const mapStateToProps = ({ teamMessage: { teamMessages } }) => {
  return { teamMessages };
};

export default connect(mapStateToProps)(Index);
