/**
 * 私教管理 - 私教账户 - 私教团队详情
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import { ChangeAction, DistrictState, EffectState, Gender } from '../../../../application/define';

class Index extends Component {
  static propTypes = {
    teamAccountDetail: PropTypes.object, // 私教账户详情
    teamCoachScopeList: PropTypes.object,
    teamCoachChangeList: PropTypes.object, // 变更记录列表
  }

  static defaultProps = {
    teamAccountDetail: {},
    teamCoachScopeList: {},
    teamCoachChangeList: {},
    accountDistrict: {
      data: [],
      _meta: {},
    },
  }

  constructor(props) {
    super(props);
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
    const payload = {
      id,
    };
    this.props.dispatch({
      type: 'teamAccount/fetchTeamAccountDetail',
      payload,
    });
    this.props.dispatch({
      type: 'teamAccount/fetchTeamAccountDistrict',
      payload,
    });
    this.props.dispatch({ type: 'teamAccount/fetchCoachScopeList', payload });
    this.props.dispatch({ type: 'teamAccount/fetchCoachChangeLog', payload });
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
    // 保存搜索的参数
    const { searchParamsScope } = this.private;
    const { id } = this.props.location.query;
    this.private.searchParamsScope = {
      ...searchParamsScope,
      ...params,
      id,
    };
    this.props.dispatch({
      type: 'teamAccount/fetchCoachScopeList',
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
    // 保存搜索的参数
    const { searchParamsChange } = this.private;
    const { id } = this.props.location.query;
    this.private.searchParamsChange = {
      ...searchParamsChange,
      ...params,
      id,
    };
    this.props.dispatch({
      type: 'teamAccount/fetchCoachChangeLog',
      payload: this.private.searchParamsChange,
    });
  }

  //  生效状态判定
  displayState = (text) => {
    let dom = '';
    switch (text) {
      case EffectState.effected:
        dom = <span className="app-global-compoments-color1">{EffectState.description(text)}</span>;
        break;
      case EffectState.effectBefore:
        dom = <span className="app-global-compoments-color2">{EffectState.description(text)}</span>;
        break;
      case EffectState.lose:
        dom = <span className="app-global-compoments-color3">{EffectState.description(text)}</span>;
        break;
      default:
        dom = '--';
        break;
    }
    return dom;
  }

  // 渲染所属私教团队
  renderCoachTeamInfo = (info) => {
    if (!info || !Array.isArray(info)) return '--';
    return info.reduce((acc, cur, idx) => {
      if (idx === 0) {
        return cur.name;
      }
      return `${acc}, ${cur.name}`;
    }, '');
  }

  // 列表数据
  renderList = () => {
    const { page } = this.private.searchParamsScope.meta;
    const { teamCoachScopeList: scopeData } = this.props;

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
        title: '业主姓名',
        dataIndex: ['owner_info', 'name'],
        key: 'owner_info.name',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '业主身份证号',
        dataIndex: ['owner_info', 'intentity_id'],
        key: 'owner_info.intentity_id',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '开始时间',
        dataIndex: 'start_month',
        key: 'start_month',
        render: (text) => {
          return text ? moment(`${text}01`).format('YYYY年MM月DD日') : '--';
        },
      },
      {
        title: '结束时间',
        dataIndex: 'end_month',
        key: 'end_month',
        render: (text) => {
          return text ? moment(`${text}01`).format('YYYY年MM月DD日') : '--';
        },
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
      <CoreContent title={'业务范围'}>
        {/* 数据 */}
        <Table
          rowKey={(record, index) => { return index; }}
          dataSource={scopeData.data}
          columns={columns}
          pagination={pagination}
          bordered
        />
      </CoreContent>
    );
  }


  // 变更记录
  renderChangeLog = () => {
    const { page } = this.private.searchParamsChange.meta;
    const { teamCoachChangeList: logData } = this.props;

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
          return Gender.description(text);
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
        dataIndex: 'action',
        key: 'action',
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
        dataIndex: 'month',
        key: 'month',
        render: (text) => {
          return text ? moment(`${text}01`).format('YYYY年MM月DD日') : '--';
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
      <CoreContent title={'变更记录'}>
        {/* 数据 */}
        <Table rowKey={(record, index) => { return index; }} dataSource={logData.data} columns={columns} pagination={pagination} bordered />
      </CoreContent>
    );
  }

  // 基础信息
  renderInfo = () => {
    const {
      _id: id = '',  // 私教id
      name = '',     // 私教姓名
      coach_account_info: { phone } = {},       // 系统用户
      coach_team_info: coachTeamInfo = {},      // 所属私教团队
      biz_district_count: bizDistrictCount = 0, // 业务范围数量
    } = this.props.teamAccountDetail;
    const formItems = [
      {
        label: '私教ID',
        form: <span>{id || '--'}</span>,
      },
      {
        label: '私教姓名',
        form: <span>{name || '--'}</span>,
      },
      {
        label: '系统用户',
        form: <span>{phone || '--'}</span>,
      },
      {
        label: '所属私教团队',
        form: <span>{this.renderCoachTeamInfo(coachTeamInfo)}</span>,
      },
      {
        label: '业务范围数量',
        form: <span>{bizDistrictCount || `${bizDistrictCount}` === '0' ? bizDistrictCount : '--'}</span>,
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title={'私教信息'}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 基础信息 */}
        {this.renderInfo()}

        {/* 列表数据 */}
        {this.renderList()}

        {/* 变更记录 */}
        {this.renderChangeLog()}
      </div>
    );
  }
}

const mapStateToProps = ({ teamAccount: { teamAccountDetail, accountDistrict, teamCoachScopeList, teamCoachChangeList } }) => {
  return { teamAccountDetail, accountDistrict, teamCoachScopeList, teamCoachChangeList };
};

export default connect(mapStateToProps)(Index);
