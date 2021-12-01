/**
 * 审批单详情页面 Expense/Manage/ExamineOrder/Detail
 */
import _ from 'lodash';
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Tag, Row, Col, Collapse, Button, Select } from 'antd';
import { Form } from '@ant-design/compatible';

import ApproveModal from './approve'; // 审核同意弹窗
import RejectModal from './reject';   // 审核驳回弹窗
import PaymentExceptionModal from './paymentException'; // 标记付款异常弹窗
import SupplementOpinion from './supplementOpinion';   // 补充意见弹窗
import ExpenseProcessComponent from '../common/process';  // 流转记录时间轴
import HouseInfo from '../../common/houseInfo';    // 房屋信息
import CostOrderItem from './costOrderItem';            // 费用单组件
import BorrowingInfo from './borrowingInfo';            // 借款信息
import RepaymentsInfo from './repaymentsInfo';          // 还款信息
import BusinessInfo from './business';                  // 出差详情信息
import TravelInfo from './travel';                      // 差旅报销详情
import SalaryPlanVersionInfo from './salaryPlanVersionInfo';
import SalarySummary from './salarySummary';
import TakeLeaveInfo from './takeLeaveInfo';            // 请假折叠组件
import OverTime from './components/overTime';           // 加班
import Turnover from './turnover';                      // 人员异动
import AddTicketTag from './components/addTicketTag'; // 打验票标签
import CheckTicket from './components/checkTicket'; // 完成验票
import TicketAbnormal from './components/ticketAbnormal'; // 验票异常
import ExternalApprove from './components/externalApprove';
import PayeeTable from './components/payeeTable'; // 付款明细 - 表格
import aoaoBossTools from '../../../../../utils/util';
import {
  ExpenseExamineOrderProcessState,
  Unit,
  ExpenseExamineOrderPaymentState,
  OaApplicationOrderType,
  InvoiceAjustAction,
  OaApplicationFlowTemplateApproveMode,
  ExpenseApprovalType,
  ExpenseTicketState,
  OAExtra,
} from '../../../../../application/define';
import { authorize } from '../../../../../application';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import Modules from '../../../../../application/define/modules';
import styles from './style.less';
import { PagesHelper } from '../../../../oa/document/define';

import { OADocumentDetail } from '../../../../oa/document/components/index';
import ComponentRelatedApproval from '../../../../oa/document/components/relatedApproval';

const Panel = Collapse.Panel;

class SummaryDetailRent extends Component {
  static propTypes = {
    examineOrderDetail: PropTypes.object, // 审批单的详情数据
    examineOrdersData: PropTypes.object,  // 关联审批单数据
    businessTripData: PropTypes.object,   // 出差详情数据
  }
  static defaultProps = {
    examineOrderDetail: {},
    examineOrdersData: {},
    businessTripData: {},
  }

  static getDerivedStateFromProps(props, state) {
    if (props.examineOrderDetail !== state.examineOrderDetail) {
      const flowRecordItem = dot.get(props, 'examineOrderDetail.flowRecordList.0', {});
      // 外部审批单标签
      const pluginThemeLabelList = dot.get(props, 'examineOrderDetail.pluginExtraMeta.theme_label_list', []);
      return {
        examineOrderDetail: dot.get(props, 'examineOrderDetail', {}),
        themeTags: [...dot.get(props, 'examineOrderDetail.themeLabelList', []), ...pluginThemeLabelList],
        copyGiveValues: {
          userNames: dot.get(flowRecordItem, 'flexibleCcAccountInfoList', []),
          departmentNames: dot.get(flowRecordItem, 'flexibleCcDepartmentInfoList', []),
        },
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      examineOrderDetail: {},

      copyGiveValues: {}, // 抄送信息
      data: [], // 金额调整
      activeKey: [],       // 展开的面板key
      themeTags: [], // 主题标签
    };
    this.private = {
      orderId: dot.get(props, 'location.query.orderId'), // 审批单id
    };
  }

  // 默认加载数据
  componentDidMount() {
    const { orderId } = this.private;
    // 如果审批单id不为空，则获取审批单详情数据
    if (orderId !== undefined) {
      this.props.dispatch({
        type: 'expenseExamineOrder/fetchExamineOrderDetail',
        payload: {
          id: orderId,
          flag: true,
          onFailureCallback: this.onFailureCallback,
          onSuccessCallback: this.onSuccessCallbackExamineOrderDetail,
        },
      });
      this.props.dispatch({
        type: 'expenseCostOrder/fetchOriginalCostOrder',
        payload: {
          orderId,
        },
      });
    }
  }

  // 离开页面后自动清空详情数据
  componentWillUnmount() {
    const { orderId } = this.private;
    if (orderId !== undefined) {
      this.props.dispatch({ type: 'expenseHouseContract/resetHouseContractDetail' });
      this.props.dispatch({ type: 'expenseExamineOrder/resetExamineOrderDetail' });
    }
  }

  // 成功回调
  onSuccessCallbackExamineOrderDetail = (result) => {
    const { orderId } = this.private;
    // 关联的出差单id
    const costOrderId = dot.get(result, 'business_travel_order_id');

    // 审批单类型（事务性出差为601）
    const applicationOrderType = dot.get(result, 'application_order_type');

    const flowId = dot.get(result, 'flow_id');
    if (is.existy(costOrderId) && is.not.empty(costOrderId) && applicationOrderType !== 601) {
      const param = {
        costOrderId,
      };
      if (!dot.get(result, 'plugin_extra_meta.is_plugin_order', false)) {
        this.props.dispatch({ type: 'expenseExamineOrder/fetchBusinessTrip', payload: param });
      }
    }

    flowId && this.props.dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id: flowId, orderId } });
  }

  // 失败回调
  onFailureCallback = (result) => {
    // 判断是否有查看这条审批单的权限, 没有跳404页面
    if (result.zh_message === '您没有查看这条审批单的权限') {
      window.location.href = '/#/404';
    }
  }

  // 修改抄送信息
  onChangeCopyGiveValues = (values) => {
    this.setState({
      copyGiveValues: values,
    });
  }

  // 修改主题标签
  onChangeThemeTags = (newValue) => {
    const noSpaceValue = newValue;
    const newLength = noSpaceValue.length;
    // 当新增标签时去除新增标签的空格
    if (newLength > this.state.themeTags.length) {
      const tmp = noSpaceValue[newLength - 1].replace(/\s+/g, '');
      if (tmp === '') return;
      noSpaceValue[newLength - 1] = tmp;
    }
    this.setState({ themeTags: noSpaceValue });
  }

  // 保存主题标签
  onSaveThemeTags = () => {
    const { orderId } = this.private;
    const { themeTags } = this.state;

      // 外部审批单标签
    const pluginThemeLabelList = dot.get(this.props, 'examineOrderDetail.pluginExtraMeta.theme_label_list', []);
    // 过滤外部审批单标签
    const themeTagsExternal = [...new Set([...themeTags, '外部审批单'])].filter(v => !pluginThemeLabelList.includes(v));
    // 兼容外部审批单主题标签添加逻辑
    const params = {
      themeTags: this.getPluginOrder() ? themeTagsExternal :
        // 过滤外部审批单标签
        themeTags.filter(v => !pluginThemeLabelList.includes(v)), // 主题标签
      orderId, // 审批单id
    };
    this.props.dispatch({
      type: 'expenseExamineOrder/fetchCostApprovalThemeTag',
      payload: {
        params,
        onSuccessCallback: (res) => {
          const { record = {} } = res;
          const { theme_label_list: themeLabelList = [] } = record;
          // 外部审批单标签
          const recordPluginThemeLabelList = dot.get(record, 'plugin_extra_meta.theme_label_list', []);
          this.setState({ themeTags: [...themeLabelList, ...recordPluginThemeLabelList] });
        },
        onFailureCallback: this.onFailureAssociatedCallback,
      },
    });
  }

  // 下载结算单
  onDownloadPayroll = (id) => {
    const payload = { id };
    this.props.dispatch({ type: 'financeSummaryManage/downloadSalaryStatement', payload });
  }

  // 审批成功后重新刷新数据
  onSuccessCallback = () => {
    const { orderId } = this.private;
    // 如果审批单id不为空，则获取审批单详情数据
    if (orderId !== undefined) {
      this.props.dispatch({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: orderId } });
    }
  }

  // 展开/收起全部
  onChangeCollapse = () => {
    const { examineOrderDetail } = this.props;
    const { activeKey } = this.state;
    const { costOrderIds } = examineOrderDetail;
    // 定义需要更新的折叠面板key
    const key = [];
    // 判断，如果当前折叠面板没有全部打开，那么更新key为全部值(此时，按钮显示为 全部打开)
    if (activeKey.length !== costOrderIds.length) {
      costOrderIds.forEach((item, index) => {
        key.push(`${index}`);
      });
    }
    // 否则，折叠面板key数组置为空(此时，按钮显示为 全部收起)
    this.setState({ activeKey: key });
  }

  // 定义退款,红冲展开/收起全部
  onChangeInvoiceAjustCollapse = () => {
    const { activeKey } = this.state;
    const { originalCostOrder } = this.props;
    // 定义需要更新的折叠面板key
    const key = [];
    // 判断，如果当前折叠面板没有全部打开，那么更新key为全部值(此时，按钮显示为 全部打开)
    if (activeKey.length !== originalCostOrder.length) {
      originalCostOrder.forEach((item, index) => {
        key.push(`${index}`);
      });
    }
    // 否则，折叠面板key数组置为空(此时，按钮显示为 全部收起)
    this.setState({ activeKey: key });
  }

  // 折叠面板的onChange
  onChangePanel = (key) => {
    this.setState({ activeKey: key });
  }

  // 关联审批折叠面板的onChange
  onChangeAssociatedPanel = () => {
    // 关联审批单列表
    const { examineOrdersData } = this.props;

    // 数据存在，不用更新数据
    if (dot.get(examineOrdersData, 'data', []).length > 0) return;

    // 审批单详情
    const { examineOrderDetail, dispatch } = this.props;

    // 关联审批单的id
    const associatedId = dot.get(examineOrderDetail, 'relationApplicationOrderIds');

    // 请求参数
    const params = {
      associatedId, // 关联审批单id
      limit: 9999,
      state: [ // 状态
        ExpenseExamineOrderProcessState.pendding,
        ExpenseExamineOrderProcessState.processing,
        ExpenseExamineOrderProcessState.finish,
      ],
    };

    associatedId && dispatch({ type: 'expenseExamineOrder/fetchExamineOrders', payload: params });
  }

  // 判断不为原有审批类型
  getExpenseType = (type) => {
    switch (type) {
      case OaApplicationOrderType.cost:
      case OaApplicationOrderType.supplies:
      case OaApplicationOrderType.housing:
      case OaApplicationOrderType.borrowing:
      case OaApplicationOrderType.repayments:
      case OaApplicationOrderType.business:
      case OaApplicationOrderType.overTime:
      case OaApplicationOrderType.takeLeave:
      case OaApplicationOrderType.travel:
        return true;
      default: false;
    }
  }

  // 获取外部审批单字段（判断是否为外部审批单）
  getPluginOrder = () => {
    const { examineOrderDetail = {} } = this.props;
    const { pluginExtraMeta = {} } = examineOrderDetail;

    if (is.existy(pluginExtraMeta) && pluginExtraMeta.is_plugin_order === true) {
      return true;
    }

    return false;
  }

  // 去打印预览页面
  goPrint = (id) => {
    const idArray = [id];
    const selectedRowKeys = JSON.stringify(idArray);
    aoaoBossTools.popUpCompatible(`/#/Expense/Manage/ExamineOrder/print?selectedRowKeys=${selectedRowKeys}`);
    // window.open(`/#/Expense/Manage/ExamineOrder/print?selectedRowKeys=${selectedRowKeys}`);
  }

  // 渲染操作
  renderOperates = () => {
    const { examineOrderDetail } = this.props;
    // 审批单类型
    const { applicationOrderType } = examineOrderDetail;

    // 审批流详情
    const { examineDetail } = this.props;

    // 如果详情数据为空，则直接返回
    if (is.empty(examineOrderDetail) || is.not.existy(examineOrderDetail)) {
      return '';
    }

    // 判断当前节点可审核操作（通过/驳回）的人员列表
    const { currentPendingAccounts = [] } = examineOrderDetail;
    if (currentPendingAccounts.indexOf(authorize.account.id) === -1) {
      return '';
    }

    // 判断是否有付款审批的审核/驳回操作权限，事务审批的类型值 < 100
    if (authorize.canOperate(Modules.OperateExpenseManageApprovalButton) === false && applicationOrderType < 100) {
      return '';
    }

    // 判断是否有事务性审批单的审核/驳回操作权限，事务审批的类型值 >= 100
    if (authorize.canOperate(Modules.OperateExpenseManageOAOrderEditButton) === false && applicationOrderType >= 100) {
      return '';
    }

    // 审批单id
    const orderId = examineOrderDetail.id;
    // 审批记录id
    const {
      currentRecordIds = [],
      currentFlowNode = undefined, // 当前节点id
      currentRecordList = [], // 当前流转记录列表
    } = examineOrderDetail;

    // 当亲操作的流转记录id
    let orderRecordId = '';

    // 标记付款状态
    const paidState = dot.get(examineOrderDetail, 'paidState');

    // 审批流节点
    const nodeList = dot.get(examineDetail, 'nodeList', []);

    // 当前节点信息
    const currentNodeInfo = nodeList.filter(item => item.id === currentFlowNode)[0] || {};

    const {
      approveMode, // 审批规则
      isPaymentNode = false,
      isInspectBillNode = false,
    } = currentNodeInfo;

    // 任一
    if (approveMode === OaApplicationFlowTemplateApproveMode.any && currentRecordIds.length === 1) {
      orderRecordId = currentRecordIds[0];
    }

    // 全部
    if (approveMode === OaApplicationFlowTemplateApproveMode.all) {
      currentRecordList.forEach((item = {}) => {
        const {
          operateAccounts = [],
        } = item;
        operateAccounts.forEach((account) => {
          if (account === authorize.account.id) {
            orderRecordId = item.id;
          }
        });
      });
    }

    // 流转记录数据列表
    const flowRecordList = dot.get(examineOrderDetail, 'flowRecordList', []);
    // 默认显示补充意见、驳回、通过按钮
    const operations = [
      <SupplementOpinion
        key={'SupplementOpinion'}
        orderId={orderId}
        recordId={orderRecordId}
        isPaymentNode={isPaymentNode}
        dispatch={this.props.dispatch}
        onSuccessCallback={this.onSuccessCallback}
      />,
      <RejectModal
        key={'RejectModal'}
        orderId={orderId}
        orderRecordId={orderRecordId}
        currentFlowNode={currentFlowNode}
        flowRecordList={flowRecordList}
        nodeList={nodeList}
        dispatch={this.props.dispatch}
        examineDetail={examineDetail}
      />,
      <ApproveModal
        key={'ApproveModal'}
        orderId={orderId}
        orderRecordId={orderRecordId}
        examineOrderDetail={examineOrderDetail}
        currentFlowNode={currentFlowNode}
        isPaymentNode={isPaymentNode}
        dispatch={this.props.dispatch}
        examineDetail={examineDetail}
      />,

    ];

    // 标记付款节点 && 未付款状态下，显示标记付款操作
    if (is.truthy(isPaymentNode) && paidState === ExpenseExamineOrderPaymentState.waiting) {
      operations.push(
        <PaymentExceptionModal
          key={'PaymentExceptionModal'}
          orderId={orderId}
          orderRecordId={orderRecordId}
          dispatch={this.props.dispatch}
        />,
      );
    }

    const ticketProps = {
      orderId,
      orderRecordId,
    };

    // 验票操作
    const ticketOptions = [
      <AddTicketTag {...ticketProps} />,
      <CheckTicket />,
      <TicketAbnormal {...ticketProps} />,
    ];

    return (
      <Col className={styles['app-comp-expense-detail-operate-wrap']} span={3} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
          {operations.map((item, index) => {
            return (
              <div key={index} className={styles['app-comp-expense-detail-operate-item']}>{item}</div>
            );
          })}
        </div>
        <div style={{ display: 'flex', marginTop: 10 }}>
          {isInspectBillNode ? ticketOptions.map((item, index) => {
            return (
              <div key={index} className={styles['app-comp-expense-detail-operate-item']}>{item}</div>
            );
          }) : null}
        </div>
      </Col>
    );
  }

  // 渲染基本信息
  renderBaseInfo = () => {
    const { examineOrderDetail } = this.props;
    const {
      applicationOrderType, // 审批单类型
      inspectBillLabelList = [],
      inspectBillErrNote = undefined, // 验票异常说明
      inspectBillState = undefined, // 验票状态
      inspectBillNote = undefined, // 完成验票说民
      costOrderList = [],         // 所有费用单据
    } = examineOrderDetail;

    // 验票说明
    let inspectNote = '--';
    // 完成验票说明
    inspectBillNote && (inspectNote = inspectBillNote);
    // 验票异常说明
    inspectBillErrNote && (inspectNote = inspectBillErrNote);

    // 判断是否可以打印
    let printAble = false;
    if (examineOrderDetail.applicationOrderType === 1
      || examineOrderDetail.applicationOrderType === 4
      || examineOrderDetail.applicationOrderType === 5
      || examineOrderDetail.applicationOrderType === 6
      || examineOrderDetail.applicationOrderType === 7
      || examineOrderDetail.applicationOrderType === 8
      || examineOrderDetail.applicationOrderType === 9
      || examineOrderDetail.applicationOrderType === 10
      || examineOrderDetail.applicationOrderType === 11
      || examineOrderDetail.applicationOrderType === OaApplicationOrderType.overTime) {
      printAble = true;
    }

    // 外部审批单不能打印
    this.getPluginOrder() && (printAble = false);

    const isReset = true;

    // 审批单类型
    const type = applicationOrderType < 100
      ? OaApplicationOrderType.description(applicationOrderType)
      : PagesHelper.titleByKey(applicationOrderType);

    const formCollapsePanelHeaders = [
      {
        label: '审批单号',
        form: dot.get(examineOrderDetail, 'id', '--'),
      },
      {
        label: '申请人',
        form: dot.get(examineOrderDetail, 'applyAccountInfo.name', '--'),
      }, {
        label: '审批流程',
        form: dot.get(examineOrderDetail, 'flowInfo.name', '--'),
      }, {
        label: '审批类型',
        form: type,
      },
    ];
    const formItemsBase = [];
    // 当审批类型为人员异动并且红冲,退款不显示标记付款,异常说明
    if (applicationOrderType !== OaApplicationOrderType.turnover && InvoiceAjustAction.refund !== dot.get(examineOrderDetail, 'applicationSubType') && InvoiceAjustAction.invoiceAdjust !== dot.get(examineOrderDetail, 'applicationSubType')) {
      formItemsBase.push(
        {
          label: '标记付款状态',
          form: `${ExpenseExamineOrderPaymentState.description(dot.get(examineOrderDetail, 'paidState'))}`,
        }, {
          label: '付款异常说明',
          form: dot.get(examineOrderDetail, 'paidNote', '--'),
        },
      );
    }
    // 由于外部审批单目前不能判定是中台还是兴达插件，产品（@李彩燕）要求先隐藏这两个字段
    // 判断审批类型是否等于外部审批管理
    // if (applicationOrderType === OaApplicationOrderType.externalApproval) {
    //   // 查找总金额下标
    //   const index = formItemsBase.findIndex(item => item.label === '总金额');
    //   // 数组删除总金额
    //   formItemsBase.splice(index, 1);
    //   // 获取原始提报人姓名
    //   const accountName = dot.get(pluginExtraMeta, 'origin_apply_account_name', undefined);
    //   // 获取原始提报人手机号
    //   const accountPhone = dot.get(pluginExtraMeta, 'origin_apply_account_phone', undefined);
    //   if (accountName) {
    //     formItemsBase.push(
    //       {
    //         label: '原始提报人',
    //         form: accountName,
    //       },
    //     );
    //   }
    //   if (accountPhone) {
    //     formItemsBase.push(
    //       {
    //         label: '手机号',
    //         form: accountPhone,
    //       },
    //     );
    //   }
    // }
    const isCost = applicationOrderType === OaApplicationOrderType.cost;     // 是否是费用单子
    const isTravel = applicationOrderType === OaApplicationOrderType.travel;     // 是否是差旅单子
    const isHouse = applicationOrderType === OaApplicationOrderType.housing;     // 是否是房屋单子
    const isBorrowing = applicationOrderType === OaApplicationOrderType.borrowing;    // 是否是借款单子
    const isRepayments = applicationOrderType === OaApplicationOrderType.repayments;  // 是否是还款单子

    // 审批单为费用或差旅报销，显示验票信息
    // 更改头部基础信息费用总金额与总税金
    if (isCost || isTravel) {
      const sum = costOrderList.reduce((pre, current) => pre + current.totalTaxAmountAmount, 0);
      const payMoney = costOrderList.reduce((pre, current) => (current.type === 1 ? (pre + current.totalMoney) : pre), 0);
      formItemsBase[formItemsBase.length] = {
        label: '验票状态',
        form: inspectBillState ? ExpenseTicketState.description(inspectBillState) : '--',
      };
      formItemsBase[formItemsBase.length] = {
        label: '验票说明',
        form: inspectNote,
      };
      formItemsBase.splice(2, 0, ...[
        {
          label: '付款金额',
          form: Unit.exchangePriceCentToMathFormat(payMoney),
        },
        {
          label: '费用总金额',
          form: this.getPluginOrder() ? Unit.exchangePriceCentToMathFormat(dot.get(examineOrderDetail, 'pluginExtraMeta.total_money', 0)) : Unit.exchangePriceCentToMathFormat(dot.get(examineOrderDetail, 'totalMoney', 0)),
        },
        {
          label: '总税金',
          form: Unit.exchangePriceCentToMathFormat(sum),
        },
      ]);
    } else if (isHouse || isBorrowing || isRepayments) {
      // 房屋、借款、还款
      formItemsBase.splice(2, 0, {
        label: '付款金额',
        form: this.getPluginOrder() ? Unit.exchangePriceCentToMathFormat(dot.get(examineOrderDetail, 'pluginExtraMeta.total_money', 0)) : Unit.exchangePriceCentToMathFormat(dot.get(examineOrderDetail, 'totalMoney', 0)),
      });
    } else {
      // 其它单子显示总金额
      formItemsBase.splice(2, 0, {
        label: '总金额',
        form: Unit.exchangePriceCentToMathFormat(dot.get(examineOrderDetail, 'totalMoney', 0)),
      });
    }

    // 验票标签
    const ticketTags = [
      {
        label: '验票标签',
        form: <div>
          {
            inspectBillLabelList.map(i => <Tag key={i._id}>{i.name}</Tag>)
          }
        </div>,
      },
    ];

    const layoutBase = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    // tags布局
    const layoutTags = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };

    // 审批单类型
    const orderType = dot.get(examineOrderDetail, 'applicationOrderType');

    return (
      <CoreContent>
        <Collapse bordered={false}>
          <Panel
            header={
              <Row>
                {
                formCollapsePanelHeaders.map((item, i) => {
                  return (
                    <Col span={6} key={i}>{item.label}: {item.form}</Col>
                  );
                })
              }
              </Row>
          }
          >
            <Row type="flex" align="middle">
              <Col span={printAble ? 22 : 24}>
                <DeprecatedCoreForm items={formItemsBase} cols={4} layout={layoutBase} />
                <DeprecatedCoreForm items={ticketTags} cols={1} layout={layoutTags} />
              </Col>
              {
                printAble
                  ? <Col span={2}><Button type="primary" onClick={this.goPrint.bind(this, examineOrderDetail.id)}>打印</Button></Col>
                  : ''
              }
            </Row>
            {/* 判断是否是房屋审批单，如果是，则显示对应房屋信息 */}
            {
              Number(orderType) === OaApplicationOrderType.housing
                ?
                  <HouseInfo
                    contractId={dot.get(examineOrderDetail, 'bizExtraHouseContractId', '')}
                    isReset={isReset}
                    isExternal={this.getPluginOrder()}
                  />
                :
                ''
            }
          </Panel>
        </Collapse>
      </CoreContent>
    );
  }

  // 渲染审批流列表数据 - 服务费规则
  renderFinanceListInfo = () => {
    const { examineOrderDetail } = this.props;

    // 薪资版本id （薪资规则组件）
    const { salaryPlanVersionId } = examineOrderDetail;

    // 数据为空，返回null
    if (!salaryPlanVersionId) return null;

    return (
      <SalaryPlanVersionInfo
        salaryPlanVersionId={salaryPlanVersionId}
      />
    );
  }

  // 渲染审批流列表 - 服务费发放
  renderSalaryLssue = () => {
    const { examineOrderDetail } = this.props;
    // 判断是否是服务费发放的审批单
    const orderType = dot.get(examineOrderDetail, 'applicationOrderType');
    // 只渲染服务费发放
    if (orderType !== OaApplicationOrderType.salaryIssue) {
      return null;
    }

    // 结算单id
    const { payrollStatementId } = examineOrderDetail;

    return (
      <SalarySummary
        payrollStatementId={payrollStatementId}
      />
    );
  }

  // 渲染审批单详情信息
  renderExamineOrderInfo = () => {
    const { businessTripData } = this.props;
    const { activeKey } = this.state;
    const { examineOrderDetail, examineDetail, originalCostOrder, location } = this.props;

    // const {
    // pluginExtraMeta,
    // } = examineOrderDetail;
    // 审批单号
    const applicationOrderId = dot.get(examineOrderDetail, 'id');

    // 外部审批meta
    const { pluginExtraMeta = {} } = examineOrderDetail;

    // 数据为空，返回null（外部审批单不展示）
    if (Object.keys(examineOrderDetail).length === 0 || Object.keys(examineDetail).length === 0 || this.getPluginOrder()) return null;

    const { costOrderIds, applicationOrderType } = examineOrderDetail;
    const contents = [];
    const businessDetails = [];
    // 判断出差审批单是否有数据
    if (businessTripData) {
      businessDetails.push(businessTripData);
    }
    // 判断如果是服务费相关审批单，则不渲染
    if (examineOrderDetail.payrollStatementId || examineOrderDetail.salaryPlanVersionId || applicationOrderType === OaApplicationOrderType.overTime || applicationOrderType === OaApplicationOrderType.turnover) {
      return;
    }
    // 定义扩展操作
    const ext = (
      <span
        onClick={this.onChangeCollapse}
        className={styles['app-comp-expense-detail-order-info-ext']}
      >
        {/* 判断显示文本，如果折叠面板全部展开，则显示 全部收起，否则显示 全部展开 */}
        {activeKey.length !== costOrderIds.length ? '全部展开' : '全部收起'}
      </span>);

    // 定义红冲,退款的扩展
    const invoiceAjustExt = (
      <span
        onClick={this.onChangeInvoiceAjustCollapse}
        className={styles['app-comp-expense-detail-order-info-ext']}
      >
        {/* 判断显示文本，如果折叠面板全部展开，则显示 全部收起，否则显示 全部展开 */}
        {activeKey.length !== originalCostOrder.length ? '全部展开' : '全部收起'}
      </span>);

    if (OaApplicationOrderType.borrowing === dot.get(examineOrderDetail, 'applicationOrderType')) {
      // 借款单id列表
      const ids = dot.get(examineOrderDetail, 'costOrderIds');
      const loanOrderList = dot.get(examineOrderDetail, 'loanOrderList');
      contents.push(
        <span key="borrowing">
          <BorrowingInfo
            orderIds={ids}
            pluginExtraMeta={pluginExtraMeta}
            loanOrderList={loanOrderList}
            dispatch={this.props.dispatch}
            examineDetail={examineDetail}
          />
        </span>,
      );
    } else if (OaApplicationOrderType.repayments === dot.get(examineOrderDetail, 'applicationOrderType')) {
      // 还款单id列表
      const ids = dot.get(examineOrderDetail, 'costOrderIds');
      contents.push(
        <span key="repayments">
          <RepaymentsInfo orderIds={ids} dispatch={this.props.dispatch} />
        </span>,
      );
    } else if (OaApplicationOrderType.business === dot.get(examineOrderDetail, 'applicationOrderType')) {
      contents.push(<span key="business"><BusinessInfo businessDetail={businessDetails} /></span>);
    } else if (OaApplicationOrderType.takeLeave === dot.get(examineOrderDetail, 'applicationOrderType')) {
      // 请假id列表
      const {
        extraWorkOrLeaveId, // 加班单详情
      } = examineOrderDetail;
      contents.push(<span key="takeLeave"><TakeLeaveInfo extraWorkOrLeaveId={extraWorkOrLeaveId} dispatch={this.props.dispatch} /></span>);
    } else if (OaApplicationOrderType.travel === dot.get(examineOrderDetail, 'applicationOrderType')) {
      // 需要有值才显示费用单
      if (costOrderIds && costOrderIds.length > 0) {
        contents.push(
          <CoreContent key="travel" title="费用单" titleExt={ext}>
            <Collapse bordered={false} activeKey={activeKey} onChange={this.onChangePanel}>
              {
                costOrderIds.map((costOrder, costOrderIndex) => {
                  // 定义折叠面板每项的header
                  const header = `费用单号: ${costOrder}`;
                  return (
                    <Panel header={header} key={`${costOrderIndex}`}>
                      <TravelInfo
                        location={location}
                        recordId={costOrder}
                        // data={costOrder}
                        examineOrderDetail={examineOrderDetail}
                        examineDetail={examineDetail}
                      />
                    </Panel>
                  );
                })
              }
            </Collapse>
          </CoreContent>,
        );
      }
      // } else if (OaApplicationOrderType.externalApproval === dot.get(examineOrderDetail, 'applicationOrderType')) { // 判断是否是中台的审批单
      // 暂时隐藏
      // contents.push(
      //   <CoreContent key="externalApproval" title="审批单据">
      //     <div>
      //       <iframe width="100%" src={`${pluginExtraMeta.url}`} />
      //     </div>
      //   </CoreContent>,
      // );
      // 如果是正常的费用单
    } else if (InvoiceAjustAction.normal === dot.get(examineOrderDetail, 'applicationSubType')) {
      // 需要有值才显示费用单
      if (costOrderIds && costOrderIds.length > 0) {
        contents.push(<CoreContent key="salaryRules" title="费用单" titleExt={ext}>
          <Collapse bordered={false} activeKey={activeKey} onChange={this.onChangePanel}>
            {
              costOrderIds.map((costOrderId, costOrderIndex) => {
                // 定义折叠面板每项的header
                const header = `费用单号: ${costOrderId}`;
                return (
                  <Panel header={header} key={`${costOrderIndex}`}>
                    <CostOrderItem
                      location={location}
                      recordId={costOrderId}
                      examineOrderDetail={examineOrderDetail}
                      examineDetail={examineDetail}
                      applicationOrderId={applicationOrderId}
                    />
                  </Panel>
                );
              })
            }
          </Collapse>
        </CoreContent>);
      }
      // 如果不是正常费用单，是为红冲，退款单
    } else if (InvoiceAjustAction.normal !== dot.get(examineOrderDetail, 'applicationSubType')) {
      // 需要有值才显示费用单
      if (originalCostOrder && originalCostOrder.length > 0) {
        contents.push(<CoreContent key="salaryRules" title="费用单" titleExt={invoiceAjustExt}>
          <Collapse bordered={false} activeKey={activeKey} onChange={this.onChangePanel}>
            {
              originalCostOrder.map((costOrderId, costOrderIndex) => {
                // 详情数据中的类型与原费用单的类型进行对比
                if (dot.get(examineOrderDetail, 'applicationSubType') === costOrderId.costOrderExistsRefoundRedRush) {
                  // 定义折叠面板每项的header
                  const header = `费用单号: ${costOrderId.id}`;
                  return (
                    <Panel header={header} key={`${costOrderIndex}`}>
                      <CostOrderItem
                        location={location}
                        recordId={costOrderId.id}
                        originalCostOrder={costOrderId}
                        examineOrderDetail={examineOrderDetail}
                        examineDetail={examineDetail}
                        applicationOrderId={applicationOrderId}
                      />
                    </Panel>
                  );
                }
                return null;
              })
            }
          </Collapse>
        </CoreContent>);
      }
    }
    return (
      <div>
        {contents}
      </div>
    );
  }

  // 加班
  renderOverTime = () => {
    const { examineOrderDetail } = this.props;
    const {
      applicationOrderType, // 审批单类型
    } = examineOrderDetail;

    // 渲染加班单（外部审批单不展示）
    if (applicationOrderType !== OaApplicationOrderType.overTime || this.getPluginOrder()) return null;

    return <OverTime examineOrderDetail={examineOrderDetail} />;
  }

  // 人员异动
  renderTurnover = () => {
    const { examineOrderDetail } = this.props;
    const {
      applicationOrderType, // 审批单类型
    } = examineOrderDetail;

    // 渲染加班单
    if (applicationOrderType !== OaApplicationOrderType.turnover) return null;
    return <Turnover examineOrderDetail={examineOrderDetail} />;
  }


  // 渲染审核记录列表
  renderExpenseProcess = () => {
    const { orderId } = this.private;
    const { examineDetail, examineOrderDetail, location: { query } } = this.props;
    const ext = this.renderOperates();
    let isTitleExt = false;
    // 类型不能与抄送时，显示扩展信息：审批流节点信息
    if (Number(dot.get(query, 'approvalKey', undefined)) === ExpenseApprovalType.copyGive) {
      isTitleExt = true;
    }
    // 深克隆数据@TODO 下层会修改数据
    const dataSource = _.cloneDeep(examineOrderDetail);
    const examineDetailClone = _.cloneDeep(examineDetail);
    // 标记付款状态
    const paidState = dot.get(examineOrderDetail, 'paidState');

    return (
      <ExpenseProcessComponent
        query={query}
        isTitleExt={isTitleExt}
        paidState={paidState}
        examineDetail={examineDetailClone}
        dataSource={dataSource}
        applyAccountId={examineOrderDetail.applyAccountId}
        isSupportCc={examineOrderDetail.isSupportCc}
        orderId={orderId}
        data={examineOrderDetail.flowRecordList}
        currentFlowNode={examineOrderDetail.currentFlowNode}
        extension={ext}
        dispatch={this.props.dispatch}
        accountList={examineOrderDetail.operateAccounts}
        fileUrlList={examineOrderDetail.fileUrlList}
        onChangeCopyGiveValues={this.onChangeCopyGiveValues}
        copyGiveValues={this.state.copyGiveValues}
      />
    );
  }

  // 事务性单据详情
  renderAffair = () => {
    const { examineOrderDetail = {} } = this.props;
    const { applicationOrderType, bizExtraWorkflowIds = [] } = examineOrderDetail;

    // 外部审批单不展示
    if (this.getPluginOrder()) return;
    const list = bizExtraWorkflowIds.map((i) => {
      return { id: i, key: applicationOrderType };
    });
    return <OADocumentDetail list={list} examineOrderDetail={examineOrderDetail} />;
  }
  // 事务性：显示关联审批列表和主题标签
  renderRelatedApprovalDetail=() => {
    // 外部审批单不展示
    if (this.getPluginOrder()) return;

    const { orderId } = this.private;
    const formItemsTags = [
      <Form.Item
        label="主题标签"
        name="themeTag"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
      >
        <div>
          <Select
            value={this.state.themeTags}
            mode="tags"
            notFoundContent=""
            onChange={this.onChangeThemeTags}
            tokenSeparators={[',', '，']}
            className={styles['app-comp-expense-detail-tag-selector']}
            disabled
          />
          <Button disabled type="primary" onClick={this.onSaveThemeTags}>
            保存
          </Button>
        </div>
      </Form.Item>,
    ];

    return <ComponentRelatedApproval isType="detail" formItemsTags={formItemsTags} orderId={orderId} />;
  }

  // 外部审批单据组件
  renderExternalApprove = () => {
    const {
      examineOrderDetail = {}, // 审批单详情
      examineDetail = {}, // 审批流详情
      location = {},
    } = this.props;

    // 只展示外部审批单（内部审批单不显示）
    if (!this.getPluginOrder()) return;
    console.log('只展示外部审批单（内部审批单不显示）');
    return (
      <ExternalApprove
        examineDetail={examineDetail}
        examineOrderDetail={examineOrderDetail}
        location={location}
      />
    );
  }


  // 外部审批单据-事务审批组件
  renderExternalAffair = () => {
    const {
      examineOrderDetail = {}, // 审批单详情
    } = this.props;

    // 外部审批单 与 事务审批类型
    const { applicationOrderType } = examineOrderDetail;

    // 不是外部审批单 || 没有审批单类型 || 原审批类型（OA25种类型展示）
    if (!this.getPluginOrder()
      || !applicationOrderType
      || this.getExpenseType(applicationOrderType)
    ) return;

    const orderTypeStr = OAExtra[applicationOrderType];
    const oaDetail = examineOrderDetail[orderTypeStr] ? examineOrderDetail[orderTypeStr] : {};
    const list = [
      { id: oaDetail._id, key: applicationOrderType },
    ];
    return <OADocumentDetail list={list} oaDetail={oaDetail} examineOrderDetail={examineOrderDetail} />;
  }

  // 付款明细表格
  renderPayeeTable() {
    const { examineOrderDetail } = this.props;
        // 标记付款状态
    const paidState = dot.get(examineOrderDetail, 'paidState');
        // 审批单类型
    const { applicationOrderType } = examineOrderDetail;
        // 总金额
    let totalMoney = dot.get(examineOrderDetail, 'totalMoney', undefined);
        // 付款明细表格
    let actualPayeeList = dot.get(examineOrderDetail, 'actualPayeeList', []);
    const pluginExtraMeta = dot.get(examineOrderDetail, 'pluginExtraMeta', {});
        // 外部审批单字段
    if (is.existy(pluginExtraMeta.is_plugin_order)) {
      actualPayeeList = dot.get(examineOrderDetail, 'pluginExtraMeta.actual_payee_list', []);
      totalMoney = dot.get(examineOrderDetail, 'pluginExtraMeta.total_money', []);
    }
    return (
      <React.Fragment>
        {/* 费用|房屋|差旅单子显示付款明细表格是已付款的情况下显示付款明细记录 */}
        { (applicationOrderType === OaApplicationOrderType.cost
          || applicationOrderType === OaApplicationOrderType.housing ||
          applicationOrderType === OaApplicationOrderType.travel) && paidState === ExpenseExamineOrderPaymentState.paid ? (
            <PayeeTable
              isDetail
              dataSource={actualPayeeList}
              money={totalMoney}
            />
       ) : null}
      </React.Fragment>
    );
  }

  render = () => {
    const { examineOrderDetail, examineDetail } = this.props;

    // 数据为空，返回null
    if (Object.keys(examineOrderDetail).length === 0 || Object.keys(examineDetail) === 0) return <div />;
    return (
      <div>
        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}

        {/* 渲染列表数据 非成本类 服务费规则 */}
        {this.renderFinanceListInfo()}

        {/* 渲染列表数据 非成本类 服务费发放 */}
        {this.renderSalaryLssue()}

        {/* 渲染折叠面板 */}
        {this.renderExamineOrderInfo()}

        {/* 加班 */}
        {this.renderOverTime()}

        {/* 人员异动 */}
        {this.renderTurnover()}

        {/* 事务性：显示关联审批列表和主题标签 */}
        {this.renderRelatedApprovalDetail()}
        {/* 事务性 */}
        {this.renderAffair()}


        {/* 外部审批单 */}
        {this.renderExternalApprove()}

        {/* 外部审批单-事务审批类 */}
        {this.renderExternalAffair()}

        {/* 付款明细表格 */}
        {this.renderPayeeTable()}

        {/* 渲染审核记录列表 */}
        {this.renderExpenseProcess()}
      </div>
    );
  }
}

function mapStateToProps({
  expenseExamineOrder: { examineOrderDetail, examineOrdersData, businessTripData },
  expenseExamineFlow: { examineDetail },
  expenseCostOrder: { originalCostOrder },
}) {
  return {
    examineOrderDetail,
    examineOrdersData,
    examineDetail,
    businessTripData,
    originalCostOrder,
  };
}

export default connect(mapStateToProps)(SummaryDetailRent);
