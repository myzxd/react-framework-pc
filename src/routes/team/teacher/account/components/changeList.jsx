/**
 * 私教账户 - 编辑页 - 变更记录 组件
 */
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Table, Popconfirm } from 'antd';
import React, { Component } from 'react';

import { CoreContent } from '../../../../../components/core';
import { ChangeAction, DistrictState, EffectState } from '../../../../../application/define';


class ChangeList extends Component {
  static propTypes = {
    teamCoachChangeList: PropTypes.array, // 变更记录列表
  }
  static defaultProps = {
    teamCoachChangeList: [],
  }
  constructor(props) {
    super(props);
    this.private = {
      // 搜索的参数
      searchParams: {
        meta: { page: 1, limit: 30 },
      },
    };
  }

  // 获取详情数据
  componentDidMount() {
    const { id } = this.props;
    const params = { id };
    this.props.dispatch({ type: 'teamAccount/fetchCoachChangeLog', payload: params });
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
    const { id } = this.props;
    this.private.searchParams = {
      ...searchParams,
      ...params,
      id,
    };
    this.props.dispatch({
      type: 'teamAccount/fetchCoachChangeLog',
      payload: this.private.searchParams,
    });
  }
  // 成功回调
  onSuccessCallBack = () => {
    const { id } = this.props;
    const params = { id };
    this.props.dispatch({ type: 'teamAccount/fetchCoachChangeLog', payload: params });
  }

  //  取消操作
  onChangeCancel = (rowData) => {
    const payload = {
      id: rowData._id,
      state: -101,        // 必为-101
      onSuccessCallBack: this.onSuccessCallBack,
    };
    this.props.dispatch({ type: 'teamAccount/fetchCoachChangeCancel', payload });
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

  // 渲染承揽范围
  renderScope = () => {
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
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 80,
        render: (text, rowData) => {
          // 没有状态 || 状态数据是已启用
          if (!rowData.state || rowData.state === EffectState.effected) {
            return '';
          }
          return (
            <React.Fragment>
              <Popconfirm
                title="是否确认取消本次变更记录?"
                onConfirm={this.onChangeCancel.bind(this, rowData)}
                okText="确定"
                cancelText="取消"
              >
                <span
                  className="app-global-compoments-cursor"
                >取消</span>
              </Popconfirm>
            </React.Fragment>
          );
        },
      },
    ];
    // 分页
    const pagination = {
      current: dot.get(logData, '_meta.page', 1),
      defaultPageSize: 30,                      // 默认数据条数
      onChange: this.onChangePage,              // 切换分页
      showQuickJumper: true,                    // 显示快速跳转
      showSizeChanger: true,                    // 显示分页
      onShowSizeChange: this.onShowSizeChange,  // 展示每页数据数
      showTotal: total => `总共${total}条`,      // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(logData, '_meta.result_count', 0), // 数据总条数
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
          dataSource={logData.data}
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

const mapStateToProps = ({ teamAccount: { teamCoachChangeList } }) => {
  return { teamCoachChangeList };
};

export default connect(mapStateToProps)(ChangeList);
