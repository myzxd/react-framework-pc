/**
 * 业主管理 - 业主详情
 */
import dot from 'dot-prop';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table } from 'antd';
import React, { Component } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import { ChangeAction, DistrictState, CoachEffectState } from '../../../application/define';
import ComponentUpdateOwnerList from './components/updateOwnerList';


class Index extends Component {
  static propTypes = {
    teamManagerDetail: PropTypes.object, // 业主详情
    teamManagerScopeList: PropTypes.object, // 承揽范围列表
    teamManagerChangeList: PropTypes.object, // 变更记录列表
  };

  static defaultProps = {
    teamManagerDetail: {},
    teamManagerScopeList: {},
    teamManagerChangeList: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.private = {
      // 搜索的参数
      searchParamsScope: {
        meta: { page: 1, limit: 30 },
      },
      // 搜索的参数
      searchParamsChange: {
        meta: { page: 1, limit: 30 },
      },
    };
  }

  componentDidMount() {
    const { id } = this.props.location.query;
    const params = { id };
    this.props.dispatch({ type: 'teamManager/fetchTeamManagerDetail', payload: params });
    this.props.dispatch({ type: 'teamManager/fetchOwnerScopeList', payload: params });
    this.props.dispatch({ type: 'teamManager/fetchOwnerChangeLog', payload: params });
  }

  // 修改分页
  onChangePageScope = (page, limit) => {
    const { searchParamsScope } = this.private;
    searchParamsScope.meta.page = page;
    searchParamsScope.meta.limit = limit;
    this.onSearch(searchParamsScope);
  }

  // 改变每页展示条数
  onShowSizeChangeScope = (page, limit) => {
    const { searchParamsScope } = this.private;
    searchParamsScope.meta.page = page;
    searchParamsScope.meta.limit = limit;
    this.onSearch(searchParamsScope);
  }
  // 搜索
  onSearch = (params) => {
    const { id } = this.props.location.query;
    // 保存搜索的参数
    const { searchParamsScope } = this.private;
    this.private.searchParamsScope = {
      ...searchParamsScope,
      ...params,
      id,
    };
    this.props.dispatch({
      type: 'teamManager/fetchOwnerScopeList',
      payload: this.private.searchParamsScope,
    });
  }


  // 修改分页
  onChangePageChange = (page, limit) => {
    const { searchParamsChange } = this.private;
    searchParamsChange.meta.page = page;
    searchParamsChange.meta.limit = limit;
    this.onSearchChange(searchParamsChange);
  }

  // 改变每页展示条数
  onShowSizeChangeLog = (page, limit) => {
    const { searchParamsChange } = this.private;
    searchParamsChange.meta.page = page;
    searchParamsChange.meta.limit = limit;
    this.onSearchChange(searchParamsChange);
  }
  // 搜索
  onSearchChange = (params) => {
    const { id } = this.props.location.query;
    // 保存搜索的参数
    const { searchParamsChange } = this.private;
    this.private.searchParamsChange = {
      ...searchParamsChange,
      ...params,
      id,
    };
    this.props.dispatch({
      type: 'teamManager/fetchOwnerChangeLog',
      payload: this.private.searchParamsChange,
    });
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

  // 列表数据
  renderList = () => {
    const { teamManagerScopeList: scopeData = {} } = this.props;
    const { data = [] } = scopeData;
    const { page } = this.private.searchParamsScope.meta;

    const columns = [
      {
        title: '平台',
        dataIndex: ['biz_district_info', 'platform_name'],
        key: 'biz_district_info.platform_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '供应商',
        dataIndex: ['biz_district_info', 'supplier_name'],
        key: 'biz_district_info.supplier_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '城市',
        dataIndex: ['biz_district_info', 'city_name'],
        key: 'biz_district_info.city_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '商圈',
        dataIndex: ['biz_district_info', 'name'],
        key: 'biz_district_info.name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '商圈状态',
        dataIndex: ['biz_district_info', 'state'],
        key: 'biz_district_info.state',
        render: (text) => {
          return DistrictState.description(text);
        },
      },
      {
        title: '归属月份',
        dataIndex: 'month',
        key: 'month',
        render: text => (text ? moment(`${text}01`).format('YYYY年MM月') : '--'),
      },
    ];

    // 分页
    const pagination = {
      current: page,
      defaultPageSize: 30,                      // 默认数据条数
      onChange: this.onChangePageScope,              // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange: this.onShowSizeChangeScope,  // 展示每页数据数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(scopeData, '_meta.result_count', 0), // 数据总条数
    };

    return (
      <CoreContent title={'承揽范围'}>
        {/* 数据 */}
        <Table rowKey={(record, index) => { return index; }} dataSource={data} columns={columns} pagination={pagination} bordered />
      </CoreContent>
    );
  }


  // 变更记录
  renderChangeLog = () => {
    const { page } = this.private.searchParamsChange.meta;
    const { teamManagerChangeList: logData = {} } = this.props;
    const { data = [] } = logData;

    const columns = [
      {
        title: '平台',
        dataIndex: ['biz_district_info', 'platform_name'],
        key: 'biz_district_info.platform_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '供应商',
        dataIndex: ['biz_district_info', 'supplier_name'],
        key: 'biz_district_info.supplier_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '城市',
        dataIndex: ['biz_district_info', 'city_name'],
        key: 'biz_district_info.city_name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '商圈',
        dataIndex: ['biz_district_info', 'name'],
        key: 'biz_district_info.name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '商圈状态',
        dataIndex: ['biz_district_info', 'state'],
        key: 'biz_district_info.state',
        render: (text) => {
          return DistrictState.description(text);
        },
      },
      {
        title: '最新操作人',
        dataIndex: ['operator_info', 'name'],
        key: 'operator_info.name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '操作时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (text) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '动作',
        dataIndex: 'event',
        key: 'event',
        render: (text) => {
          return ChangeAction.description(text);
        },
      },
      {
        title: '生效状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return this.displayState(text);
        },
      },
      {
        title: '生效日期',
        dataIndex: 'plan_done_date',
        key: 'plan_done_date',
        render: (text) => {
          return text ? moment(`${text}`).format('YYYY年MM月DD日') : '--';
        },
      },
    ];

    // 分页
    const pagination = {
      current: page,
      defaultPageSize: 30,                      // 默认数据条数
      onChange: this.onChangePageChange,              // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange: this.onShowSizeChangeLog,  // 展示每页数据数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(logData, '_meta.result_count', 0), // 数据总条数
    };

    return (
      <CoreContent title={'变更范围'}>
        {/* 数据 */}
        <Table rowKey={(record, index) => { return index; }} dataSource={data} columns={columns} pagination={pagination} bordered />
      </CoreContent>
    );
  }

  // 基础信息
  renderInfo = () => {
    const { teamManagerDetail = {} } = this.props;
    const formItems = [
      {
        label: '业主团队ID',
        form: dot.get(teamManagerDetail, '_id', '--'),
      }, {
        label: '业主姓名',
        form: dot.get(teamManagerDetail, 'staff_info.name', '--'),
      }, {
        label: '手机号',
        form: dot.get(teamManagerDetail, 'staff_info.phone', '--'),
      }, {
        label: '身份证号',
        form: dot.get(teamManagerDetail, 'staff_info.identity_card_id', '--'),
      }, {
        label: '业主ID',
        form: dot.get(teamManagerDetail, 'staff_id', '--'),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title={'业主信息'}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />

      </CoreContent>
    );
  }

  render() {
    const { teamManagerDetail } = this.props;
    return (
      <div>
        {/* 基础信息 */}
        {this.renderInfo()}

        {/* 业主团队变更记录 */}
        <ComponentUpdateOwnerList
          ownerId={teamManagerDetail._id}
          isDetail
        />
        {/* 列表数据 */}
        {this.renderList()}

        {/* 变更记录 */}
        {this.renderChangeLog()}

      </div>
    );
  }
}

const mapStateToProps = ({ teamManager: { teamManagerDetail, teamManagerScopeList, teamManagerChangeList } }) => {
  return { teamManagerDetail, teamManagerScopeList, teamManagerChangeList };
};

export default connect(mapStateToProps)(Index);
