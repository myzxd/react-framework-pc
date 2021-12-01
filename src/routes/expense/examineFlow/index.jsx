/**
 * 审批流程设置 /Expense/ExamineFlow/Process
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Table, Popconfirm, Popover, message } from 'antd';

import Search from './search';
import { CoreContent } from '../../../components/core';
import {
  OaApplicationFlowTemplateState,
  ExpenseCostOrderBizType,
  AffairsFlowSpecifyApplyType,
} from '../../../application/define';
import { authorize, system, utils } from '../../../application';
import Operate from '../../../application/define/operate';
import CreateModal from './modal/create';
import style from './style.less';

const SearchStorageKey = 'old-flow-list-search';

class Index extends Component {
  constructor(props) {
    super(props);

    const isSetStorageSearchValue = utils.dotOptimal(this.props, 'location.query.isSetStorageSearchValue', false);

    this.state = {
      newVisible: true,     // 弹窗
    };
    this.private = {
      searchParams: isSetStorageSearchValue ?
        system.searchParams(SearchStorageKey)
        : {
          page: 1,
          limit: 30,
          bizType: [
            ExpenseCostOrderBizType.transactional,
          ],
          nodeApproalType: AffairsFlowSpecifyApplyType.post,
          state: '*', // 状态默认全部
        },
      isSubmit: true, // 防止多次点击
    };
  }

  // 默认加载数据
  componentDidMount() {
    // 是否从缓存获取查询参数
    const isSetStorageSearchValue = utils.dotOptimal(this.props, 'location.query.isSetStorageSearchValue', false);

    // 不从缓存中获取，则重置缓存
    if (!isSetStorageSearchValue) {
      system.setSearchParams(SearchStorageKey, {
        bizType: [ExpenseCostOrderBizType.transactional],
      });
    }

    this.props.dispatch({
      type: 'expenseExamineFlow/fetchExamineFlows',
      payload: isSetStorageSearchValue ?
        system.searchParams(SearchStorageKey)
        : this.private.searchParams,
    });
    // this.props.dispatch({
      // type: 'applicationCommon/getEnumeratedValue',
      // payload: {
        // enumeratedType: 'examineFlowApplyApplicationTypes',
      // },
    // });
    // this.props.dispatch({
      // type: 'applicationCommon/getEnumeratedValue',
      // payload: {
        // enumeratedType: 'subjectScense',
      // },
    // });
  }

  // 默认加载数据
  componentWillUnmount() {
    // this.props.dispatch({ type: 'applicationCommon/resetEnumeratedValue', payload: {} });
  }

  // 查询
  onSearch = (params) => {
    // 设置查询参数缓存
    system.setSearchParams(SearchStorageKey, { ...params });

    this.private.searchParams = { ...params };
    this.props.dispatch({ type: 'expenseExamineFlow/fetchExamineFlows', payload: this.private.searchParams });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 回调
  onSuccessCallback = () => {
    this.props.dispatch({ type: 'expenseExamineFlow/fetchExamineFlows', payload: this.private.searchParams });
  }

  // 禁用审批流
  onUpdateExamineFlowByDisable = (flowId) => {
    const params = {
      flowId,
      onSuccessCallback: this.onSuccessCallback, // 成功回调
    };
    this.props.dispatch({ type: 'expenseExamineFlow/updateExamineFlowByDisable', payload: params });
  }

  // 启用审批流
  onUpdateExamineFlowByEnable = (flow, flowId) => {
    const params = {
      flowId,
      onSuccessCallback: this.onSuccessCallback,
    };
    // 判断该审批流节点设置为空 如果为空 无法启用
    if (flow.flowNodes.length === 0) {
      return message.error('无法启用:该审批流节点设置为空,请设置审批流节点');
    }
    this.props.dispatch({ type: 'expenseExamineFlow/updateExamineFlowByEnable', payload: params });
  }

  // 删除审批流
  onDeleteExamineFlow = (flowId) => {
    const params = {
      flowId,
      onSuccessCallback: this.onSuccessCallback, // 成功回调
    };
    this.props.dispatch({ type: 'expenseExamineFlow/deleteExamineFlow', payload: params });
  }

  // 去编辑
  onClickEdit = (id) => {
    window.location.href = `/#/Expense/ExamineFlow/Form?flowId=${id}`; // 带上ID去编辑页面
  }

  // 分页
  onChangePage = (page, size) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = size;
    this.onSearch(this.private.searchParams);
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch } = this;
    const { searchParams } = this.private;
    return (
      <Search
        onSearch={onSearch}
        searchParams={searchParams}
        isSetStorageSearchValue={utils.dotOptimal(this.props, 'location.query.isSetStorageSearchValue', false)}
      />
    );
  }

  // 渲染表单
  renderTable = () => {
    const {
      examineList = {},
      allEnumerated = {},
    } = this.props;

    const { page = 1, limit = 30 } = utils.dotOptimal(examineList, 'meta', {});

    const {
      cost_application_types: costOfData = {}, // 成本类适用类型
      none_cost_application_types: noCostOfData = {}, // 非成本适用类型
      work_flow_application_types: workData = {}, // 事务适用类型
      industry_codes: industryCodes = {}, // 适用场景
    } = allEnumerated;

    // 适用类型汇总
    const applicationTypesData = {
      ...costOfData,
      ...noCostOfData,
      ...workData,
    };

    const dataSource = examineList.data || [];
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        render: (text, record, index) => {
          const num = (limit * (page - 1)) + index + 1;
          return <div>{num}</div>;
        },
      },
      {
        title: '审批流名称',
        dataIndex: 'name',
      },
      {
        title: '适用类型',
        dataIndex: 'applyApplicationTypes',
        render: (text) => {
          if (!text || text.length === 0) {
            return '--';
          }

          const nameList = text.map(i => applicationTypesData[i]);

          if (nameList.length <= 0) return '--';

          if (nameList.length <= 3) return nameList.join('、');
          return (
            <Popover
              content={(
                <div
                  className={style['app-comp-expense-flow-note']}
                >
                  {nameList.join('、')}
                </div>
              )}
              trigger="hover"
            >
              <div>{nameList.slice(0, 3).join('、')}...</div>
            </Popover>
          );
        },
      },
      {
        title: '适用场景',
        dataIndex: 'industryCodes',
        render: (text = 2000) => {
          if (!text || text.length !== 1) return '--';
          return industryCodes[text];
        },
      },
      {
        title: '适用范围',
        dataIndex: 'platformCodes',
        render: (text) => {
          if (text.length === 0) {
            return '--';
          }
          return authorize.platformFilter(text);
        },
      },
      {
        title: '费用分组',
        dataIndex: 'costCatalogScopeList',
        render: (text) => {
          let expenseType = '';
          text.forEach((item) => {
            expenseType += `${item.name},`;
          });
          if (text.length === 0) {
            return '--';
          }
          if (text.length <= 1) {
            return text[0].name;
          }
          const arr = expenseType.split(',');
          // 如果数据长度大于1就气泡展示
          return (
            <Popover content={<p className={style['app-comp-expense-examine-flow-grouping']}>{expenseType.slice(0, expenseType.length - 1)}</p>} trigger="hover">
              <div>{arr.slice(0, 1).join(',')}等</div>
            </Popover>
          );
        },
      },
      {
        title: '创建日期',
        dataIndex: 'createdAt',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD') : '--';
        },
      },
      {
        title: '创建人',
        dataIndex: 'creatorInfo',
        render: (text) => {
          // 判断是否有值
          if (text) {
            return text.name ? text.name : '--';
          }
          return '--';
        },
      },
      {
        title: '描述',
        dataIndex: 'note',
        render: (text) => {
          if (text === '' || !text) {
            return '--';
          }
          return (
            // 秒速长度大于8个字要气泡显示
            <div>{text.length <= 8 ? text :
            <Popover
              content={(
                <div
                  className={style['app-comp-expense-flow-note']}
                >
                  {text}
                </div>
              )}
              title="审批流描述"
              trigger="hover"
            >
              <div>{text.length <= 8 ? text : text.substr(0, 8)}</div>
            </Popover>}
            </div>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (text) => {
          return <div>{OaApplicationFlowTemplateState.description(text)}</div>;
        },
      },
      {
        title: '最近更新时间',
        dataIndex: 'updatedAt',
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
      {
        title: '操作',
        render: (text, record) => {
           // 状态值为删除时，显示‘--’
          if (Number(record.state) === OaApplicationFlowTemplateState.delete) {
            return '--';
          }
          // 创建人的id不是当前账号就不显示操作
          // if (record.creatorId !== authorize.account.id) {
          //   return (
          //     Operate.canOperateExpenseExamineUpdate() ?
          //       <a
          //         href={`/#/Expense/ExamineFlow/Detail?flowId=${record.id}`}
          //         className={style['app-comp-expense-flow-operate-detail']}
          //       >查看</a>
          //   : '--');
          // }

          switch (Number(record.state)) {
            // 审批流状态是启用才能选停用
            case OaApplicationFlowTemplateState.normal:
              return (
                <div>
                  {
                    Operate.canOperateExpenseExamineUpdate() && <Popconfirm title="您是否确定停用该审批流" onConfirm={() => { this.onUpdateExamineFlowByDisable(record.id); }} okText="确定" cancelText="取消">
                      <a>停用</a>
                    </Popconfirm>
                  }
                  {Operate.canOperateExpenseExamineFlowDetail() && <a href={`/#/Expense/ExamineFlow/Detail?flowId=${record.id}`} className={style['app-comp-expense-flow-operate-detail']}>查看</a>}
                </div>
              );
            case OaApplicationFlowTemplateState.disable:
              return (
                <div>
                  {Operate.canOperateExpenseExamineUpdate() && <a onClick={() => { this.onClickEdit(record.id); }} className={style['app-comp-expense-flow-operate-update']}>编辑</a>}
                  {
                    Operate.canOperateExpenseExamineUpdate() && <Popconfirm title="您是否确定启用该审批流" onConfirm={() => { this.onUpdateExamineFlowByEnable(record, record.id); }} okText="确定" cancelText="取消">
                      <a className={style['app-comp-expense-flow-operate-enable']}>启用</a>
                    </Popconfirm>
                  }
                  {
                    Operate.canOperateExpenseExamineUpdate() && <Popconfirm title="您是否确定删除该审批流" onConfirm={() => { this.onDeleteExamineFlow(record.id); }} okText="确定" cancelText="取消">
                      <a>删除</a>
                    </Popconfirm>
                  }
                  {Operate.canOperateExpenseExamineFlowDetail() && <a href={`/#/Expense/ExamineFlow/Detail?flowId=${record.id}`} className={style['app-comp-expense-flow-operate-detail']}>查看</a>}
                </div>
              );
            case OaApplicationFlowTemplateState.draft:
              return (
                <div>
                  {Operate.canOperateExpenseExamineUpdate() && <a onClick={() => { this.onClickEdit(record.id); }} className={style['app-comp-expense-flow-operate-update']}>编辑</a>}
                  {
                    Operate.canOperateExpenseExamineUpdate() && <Popconfirm title="您是否确定删除该审批流" onConfirm={() => { this.onDeleteExamineFlow(record.id); }} okText="确定" cancelText="取消">
                      <a className={style['app-comp-expense-flow-operate-detele']}>删除</a>
                    </Popconfirm>
                  }
                  {
                    Operate.canOperateExpenseExamineUpdate() && <Popconfirm title="您是否确定启用该审批流" onConfirm={() => { this.onUpdateExamineFlowByEnable(record, record.id); }} okText="确定" cancelText="取消">
                      <a>启用</a>
                    </Popconfirm>
                  }
                  {Operate.canOperateExpenseExamineFlowDetail() && <a href={`/#/Expense/ExamineFlow/Detail?flowId=${record.id}`} className={style['app-comp-expense-flow-operate-detail']}>查看</a>}
                </div>
              );
            case OaApplicationFlowTemplateState.delete:
              return <div>--</div>;
            default:
              return (
                <div className={style['app-comp-expense-flow-operate']}>
                  {
                    Operate.canOperateExpenseExamineFlowDetail()
                    ? <a href={`/#/Expense/ExamineFlow/Detail?flowId=${record.id}`} className={style['app-comp-expense-flow-operate-detail']}>查看</a>
                    : '--'
                  }
                </div>
              );
          }
        },
      },
    ];

    // 分页
    const pagination = {
      current: this.private.searchParams.page,
      pageSize: this.private.searchParams.limit || 30,
      onChange: this.onChangePage,
      total: dot.get(examineList, 'meta.count', 0),
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true,
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
    };

    // 扩展标题
    let titleExt = '';
    if (Operate.canOperateExpenseExamineUpdate()) {
      titleExt = (
        <CreateModal dispatch={this.props.dispatch} />
      );
    }

    return (
      <CoreContent title={'审批流列表'} titleExt={titleExt}>
        <Table columns={columns} dataSource={dataSource} rowKey={record => record.id} pagination={pagination} />
      </CoreContent>
    );
  }

  render = () => {
    return (
      <div>
        {/* <Debug /> */}

        {/* 渲染搜索条件及新建按钮 */}
        {this.renderSearch()}

        {/* 渲染表格 */}
        {this.renderTable()}
      </div>
    );
  }
}

function mapStateToProps({
  expenseExamineFlow: { examineList },
  applicationCommon: { allEnumerated },
}) {
  return { examineList, allEnumerated };
}
export default connect(mapStateToProps)(Index);
