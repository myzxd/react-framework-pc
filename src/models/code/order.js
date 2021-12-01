/* eslint-disable guard-for-in */
/**
 *  CODE - 审批单
 * @module model/code/order
 */
import is from 'is_js';
import dot from 'dot-prop';
import {
  message,
} from 'antd';
import moment from 'moment';

import {
  Unit,
  CodeApproveOrderCostState,
  CodeApproveOrderTabKey,
} from '../../application/define';
import { authorize } from '../../application';
import {
  getApproveOrderList, // 审批单列表
  getProjectList, // 获取项目列表
  getFlowLinkList, // 事项链接列表
  deleteOrder, // 删除审批单
  recallOrder, // 撤回审批单
  closeOrder, // 关闭审批单
  getApproveOrderDetail, // 审批单详情
  saveOrderThemeTags, // 保存主题标签
  createOrder,
  agreeApproveOrder, // 同意审批单
  disallowanceApproveOrder, // 驳回审批单
  getRejectNodeList, // 可驳回节点列表
  createSubmitOrder,
  fetchAssociatedAccount,
  deleteAssociatedAccount,
  markApproveOrderAbnormal, // 标记付款异常
  fetchOrderCostItem, // 费用单详情
  fetchTravelOrder,   // 差旅单详情
  createOrderCostItem, // 创建费用单
  removeOrderCostItem, // 删除费用单
  updateOrderCostItem, // 编辑费用单
  updateOrderCostcostTravelOrder, // 编辑差旅报销
  createOrderCostcostTravelOrder, // 创建差旅报销
  addApproveOrderExtra, // 添加补充意见
  deleteApproveOrderExtra, // 删除补充意见
  markApproveOrderPayDone, // 标记付款
  markApproveOrderPayCancel, // 标记不付款
  setOrderTicket, // 打验票标签
  getTicketCheck, // 获取验票校验结果
  markOrderBillAbnormal, // 标记验票异常
  markCostOrderBillDone, // 标记验票完成
  pushRedCostOrder, // 红冲
  getOrderFlowRecordList, // 流转记录列表
  getCostOrderList, // 获取审批单下相关费用单
  addCostOrderInvoice, // 添加发票
  deleteOrderInvoice, // 删除发票
  getOriginOrderList, // 获取原有审批单列表
  getRelationOrderList, // 关联审批单
  getDraftOrder, // 获取当前账户草稿状态的审批单
  onSubmitBuriedPoint, // 提报链接埋点
  getBookMonthList, // 获取记账月份list
  addIntelligentGroup, // 加入智能分组
  onUpdateOrderMoney, // 修改费用单金额
  onDeleteGroup, // 删除审批单查询条件分组
  getOrderSearchGroupList, // 获取审批单查询条件分组
  onSetDefaultGroup, // 设置默认分组
  fetchTravelMoneyExceedingStandard, // 获取差旅补助|住宿金额是否超标
  fetchApprovalFind,  // 创建页面 查询时：审批单列表数据 *这个返回的是单个对象
  fetchApprovalLists, // 编辑页面 审批单列表数据  *这个返回的是所有的已关联的审批单列表
} from '../../services/code/order';

import {
  getRecordList,
} from '../../services/code/record';

// 处理审批单查询参数
const dealSearchValues = (payload = {}) => {
  const {
    attribution, // 归属
    // project, // 项目
    approveType, // 审批类型
    accountCenter, // 核算中心
    flowId, // 审批流
    orderId, // 审批单号
    payStatus, // 付款状态
    reportAt, // 提报日期
    payAt, // 付款日期
    belongTime, // 归属周期
    ticketStatus, // 验票状态
    isTicketTag, // 是否有验票标签
    ticketTag, // 验票标签
    themeTag, // 主题标签
    costMoney, // 费用金额
    processStatus, // 流程状态
    applicant, // 申请人
    relationApplicationOrderIds, // 关联审批单ids
    invoiceTitleList, // 发票抬头
    supplierIds, // 主体ids
    industryIds, // 场景ids
    platformIds, // 平台ids
    projectIds, // 项目id
    cityCodes, // 城市ids
    costAccountingIds, // 科目ids
    paidMoneyLow, // 费用金额min
    paidMoneyTop, // 费用金额max
  } = payload;
  const params = {};
  // 归属
  attribution && (params.cost_center_type = Number(attribution));
  // 项目
  // project && (params.project_id = project);
  // 审批类型
  approveType && (params.approveType = approveType);
  // 核算中心
  accountCenter && (params.accountCenter = accountCenter);
  // 审批流
  flowId && (params.flow_id = flowId);
  // 审批单号字符串
  orderId && !Array.isArray(orderId) && (params.order_ids = [orderId]);
  // 审批单数组
  Array.isArray(orderId) && orderId.length > 0 && (params.order_ids = orderId);
  // 付款状态
  payStatus && (params.paid_state = payStatus);
  // 提报日期开始时间
  dot.has(reportAt, '0') && (
    params.submit_from_date = Number(moment(reportAt[0]).format('YYYYMMDD'))
  );
  // 提报日期结束时间
  dot.has(reportAt, '1') && (
    params.submit_end_date = Number(moment(reportAt[1]).format('YYYYMMDD'))
  );
  // 付款日期结束时间
  dot.has(payAt, '0') && (
    params.paid_start_date = Number(moment(payAt[0]).format('YYYYMMDD'))
  );
   // 付款日期结束时间
  dot.has(payAt, '1') && (
    params.paid_end_date = Number(moment(payAt[1]).format('YYYYMMDD'))
  );
  // 归属周期
  belongTime && (params.belong_month = Number(moment(belongTime).format('YYYYMM')));
  // 验票状态
  ticketStatus && (params.inspect_bill_state = Number(ticketStatus));
  // 是否有验票标签
  typeof isTicketTag === 'boolean' && (params.has_inspect_bill_label_ids = isTicketTag);
  // 验票标签
  ticketTag && (params.inspect_bill_label_ids = ticketTag);
  // 主题标签
  themeTag && (params.theme_label = themeTag);
  // 费用金额
  costMoney && (params.costMoney = Number(costMoney) * 100);
  // 流程状态
  processStatus && (params.state = Number(processStatus));
  // 申请人
  applicant && (params.apply_account_name = applicant);
  // 关联单id
  relationApplicationOrderIds && (params.order_ids = relationApplicationOrderIds);

  // 发票抬头
  Array.isArray(invoiceTitleList) && invoiceTitleList.length > 0 && (
    params.invoice_title_list = invoiceTitleList
  );
  // 主体ids
  Array.isArray(supplierIds) && supplierIds.length > 0 && (
    params.supplier_ids = supplierIds
  );
   // 场景ids
  Array.isArray(industryIds) && industryIds.length > 0 && (
    params.industry_ids = industryIds
  );
   // 平台
  Array.isArray(platformIds) && platformIds.length > 0 && (
    params.platform_ids = platformIds
  );
   // 项目ids
  Array.isArray(projectIds) && projectIds.length > 0 && (
    params.project_ids = projectIds
  );
   // 城市ids
  Array.isArray(cityCodes) && cityCodes.length > 0 && (
    params.city_codes = cityCodes
  );
   // 科目ids
  Array.isArray(costAccountingIds) && costAccountingIds.length > 0 && (
    params.cost_accounting_ids = costAccountingIds
  );

  // 费用金额min
  paidMoneyLow && (params.paid_money_low = paidMoneyLow * 100);
  // 费用金额min
  paidMoneyTop && (params.paid_money_top = paidMoneyTop * 100);

  return params;
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'codeOrder',

  /**
   * 状态树
   */
  state: {
    approveOrderList: {}, // 审批单列表
    projectList: {}, // 项目列表
    flowLinkList: [], // 审批流链接列表
    approveOrderDetail: {}, // 审批单详情
    approveOrderThemeTags: {}, // 审批单详情 - 主题标签
    rejectNodeList: {}, // 可驳回节点list
    orderCostItem: {},    // 审批单下的费用单
    travelOrder: {},      // 审批单下的差旅单
    flowRecordList: [], // 流转记录列表
    costOrderList: [], // 审批单下费用单列表
    originOrderList: {}, // 原有审批单列表
    relationOrderList: {}, // 关联审批单列表
    reportOrderCount: 0, // 我待审批单数量
    submitOrderCount: 0, // 我待提报单数量
    printOrderList: [], // 打印审批单信息
    bookMonthList: [], // 记账月份list
    orderSearchGroup: [], // 审批单查询条件分组
    approvalObjects: {},   // 互联审批单列表对象 创建页面
    approvalLists: {},     // 互联审批单列表对象 编辑页面
    prePageAction: {},     // 存储用户操作的行为
  },

  /**
   * @namespace code/order/effects
   */
  effects: {

    /**
     * 上个页面用户的行为
     */
    *updateUserAction({ payload = {} }, { put }) {
      const { tabKey, page, pageSize } = payload;
      const params = {};

      // tab key
      if (is.existy(tabKey) && is.not.empty(tabKey)) {
        params.tabKey = tabKey;
      }
      // page
      if (is.existy(page) && is.not.empty(page)) {
        params.page = page;
      }
      // pageSize
      if (is.existy(pageSize) && is.not.empty(pageSize)) {
        params.pageSize = pageSize;
      }

      yield put({ type: 'reduceUserAction', payload: params });
    },
    /**
     * 审批单list
     * @memberof module:model/code/order~code/order/effects
     */
    getApproveOrderList: [
      function*({ payload }, { call, put }) {
        const {
          page = 1,
          limit = 30,
          tabKey,
          setLoading, // 设置列表loading状态
        } = payload;

        const params = {
          _meta: { page, limit },
          ...dealSearchValues(payload),
        };

        if (tabKey) {
          Number(tabKey) !== CodeApproveOrderTabKey.all && (
            params.tab_type = Number(tabKey)
          );
        }
        const res = yield call(getApproveOrderList, params);

        setLoading && setLoading();

        if (res && res.data) {
          yield put({ type: 'reduceApproveList', payload: res });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 优化：关联审批单查询
     */
    *fetchApprovalFind({ payload = {} }, { call, put }) {
      const params = {};
      if (is.not.existy(payload.associatedId) || is.empty(payload.associatedId)) {
        return message.error('请添加审批单id');
      }
      if (is.existy(payload.associatedId) && is.not.empty(payload.associatedId)) {
        params.order_id = payload.associatedId;
      }
      const result = yield call(fetchApprovalFind, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      if (result && result._id) {
        yield put({ type: 'reduceApprovalFindLists', payload: result });
        // 处理返回的对象数据
        if (payload.onProcessApprovalData) {
          payload.onProcessApprovalData(result);
        }
        return result;
      }
    },

    /**
     * 获取互联审批单列表数据 编辑页面
     */
    *fetchApprovalLists({ payload = {} }, { call, put }) {
      const params = {};
      if (is.existy(payload.orderId) && is.not.empty(payload.orderId)) {
        params.order_id = payload.orderId;
      }
      const result = yield call(fetchApprovalLists, params);
      if (result && result.data) {
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result.data);
        }
        yield put({ type: 'reduceApprovalData', payload: result });
      }
    },
    /**
     * 审批单list
     * @memberof module:model/code/order~code/order/effects
     */
    *getRelationOrderList({ payload }, { call, put }) {
      // 审批单id
      if (is.not.existy(payload.orderId) || is.empty(payload.orderId)) {
        return message.error('请添加审批单id');
      }
      const params = {
        _id: payload.orderId,
      };

      const result = yield call(getRelationOrderList, params);
      if (result && result.data) {
        yield put({ type: 'reduceRelationOrderList', payload: result });
      }
    },

    /**
     * 重置审批单list
     */
    *resetApproveOrderList({ payload }, { put }) {
      yield put({ type: 'reduceApproveList', payload: {} });
    },

    /**
     * 项目list
     * @memberof module:model/code/order~code/order/effects
     */
    *getProjectList({ payload }, { call, put }) {
      const res = yield call(getProjectList, {});

      if (res) {
        yield put({ type: 'reduceProjectList', payload: res });
      }
    },

    /**
     * 重置项目list
     */
    *resetProjectList({ payload }, { put }) {
      yield put({ type: 'reduceProjectList', payload: {} });
    },

    /**
     * 审批流链接list
     * @memberof module:model/code/order~code/order/effects
     */
    *getFlowLinkList({ payload }, { call, put }) {
      const { page = 1, limit = 9999 } = payload;
      const params = { _meta: { page, limit } };

      const res = yield call(getFlowLinkList, params);

      if (res) {
        yield put({ type: 'reduceFlowLinkList', payload: res });
      }
    },

    /**
     * 重置审批流链接list
     */
    *resetFlowLinkList({ payload }, { put }) {
      yield put({ type: 'reduceFlowLinkList', payload: {} });
    },

    /**
     * 删除审批单
     */
    *deleteOrder({ payload }, { call }) {
      const { orderId } = payload;
      if (!orderId) return message.error('缺少审批单id');
      const params = { _id: orderId };
      const res = yield call(deleteOrder, params);
      return res;
    },

    /**
     * 撤回审批单
     */
    *recallOrder({ payload }, { call }) {
      const { orderId } = payload;
      if (!orderId) return message.error('缺少审批单id');
      const params = { order_id: orderId };
      const res = yield call(recallOrder, params);
      return res;
    },

    /**
     * 关闭审批单
     */
    *closeOrder({ payload }, { call }) {
      const { orderId } = payload;
      if (!orderId) return message.error('缺少审批单id');
      const params = { order_id: orderId };
      const res = yield call(closeOrder, params);
      return res;
    },

    /**
     * 审批单详情
     * @memberof module:model/code/order~code/order/effects
     */
    *getApproveOrderDetail({ payload }, { call, put }) {
      const { orderId } = payload;
      if (!orderId) {
        return message.error('缺少审批单id');
      }
      const params = { _id: orderId };
      const res = yield call(getApproveOrderDetail, params);

      if (res) {
        yield put({ type: 'reduceApproveOrderDetail', payload: res });
      }
    },

    /**
     * 审批单详情 - 主题标签
     * @memberof module:model/code/order~code/order/effects
     */
    *getApproveOrderThemeTags({ payload }, { call, put }) {
      const { orderId } = payload;
      if (!orderId) return message.error('缺少审批单id');
      const params = { _id: orderId };
      const res = yield call(getApproveOrderDetail, params);

      if (res) {
        yield put({ type: 'reduceApproveOrderThemeTags', payload: res });
      }
    },

    /**
     * 更新审批单详情
     */
    *resetApproveOrderDetail({ payload }, { put }) {
      yield put({ type: 'reduceApproveOrderDetail', payload: {} });
    },

    /**
     * 保存主题标签
     */
    *saveOrderThemeTags({ payload }, { call }) {
      const { orderId, tags } = payload;
      if (!orderId) return message.error('缺少审批单id');
      const params = {
        _id: orderId,
        theme_label_list: [],
      };
      // 标签
      if (is.existy(tags) && is.not.empty(tags)) {
        params.theme_label_list = tags;
      }
      const res = yield call(saveOrderThemeTags, params);
      if (res.zh_message) {
        return message.error(`请求错误：${res.zh_message}`);
      }
      if (res._id) {
        if (payload.onSucessCallback) {
          payload.onSucessCallback();
        }
      }
    },

    /**
    * 审批单关联账号
    * @param {string}   associatedId 关联id
    * @param {string}   orderId 审批单id
    * @param {function} onSuccessCallback  成功回调
    * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
    */
    * updateAssociatedAccount({ payload = {} }, { call }) {
      // 请求参数
      const params = {};
      // 关联的审批单id
      if (is.existy(payload.params.associatedId) && is.not.empty(payload.params.associatedId)) {
        params.relation_application_order_id = payload.params.associatedId;
      }
      // 审批单id
      if (is.existy(payload.params.orderId) && is.not.empty(payload.params.orderId)) {
        params._id = payload.params.orderId;
      }
      const res = yield call(fetchAssociatedAccount, params);
      if (res.zh_message) {
        return message.error(`请求错误：${res.zh_message}`);
      }
      if (res._id) {
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      }
    },
    /**
     * 删除关联审批单
     * @param {string}   associatedId 关联审批单id
     * @param {string}   id 审批单id
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    *deleteAssociatedAccount({ payload = {} }, { call }) {
      const { associatedId, id } = payload;
      if (!associatedId) {
        return message('关联审批单id缺失');
      }
      // 请求参数
      const params = { _id: associatedId };
      // 关联的审批单id
      if (is.existy(id) && is.not.empty(id)) {
        params.relation_application_order_id = id;
      }

      const res = yield call(deleteAssociatedAccount, params);

      if (res.zh_message) {
        return message.error(`请求错误：${res.zh_message}`);
      }
      if (res._id) {
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      }
    },

    /**
     * 创建审批单
     */
    *createOrder({ payload }, { call }) {
      const { sceneLinkId } = payload;
      if (!sceneLinkId) return message.error('缺少审批流链接id');
      const params = {
        scene_link_id: sceneLinkId,
        apply_account_id: authorize.account.id,
        real_apply_account_id: authorize.account.id,
      };
      // 部门id
      if (is.existy(payload.departmentId) && is.not.empty(payload.departmentId)) {
        params.department_id = payload.departmentId;
      }
      // 申请人对应部门岗位关系id
      if (is.existy(payload.departmentJobId) && is.not.empty(payload.departmentJobId)) {
        params.department_job_id = payload.departmentJobId;
      }
      const res = yield call(createOrder, params);
      // 错误提示
      if (res.zh_message) {
        return message.error(`请求错误：${res.zh_message}`);
      }
      if (res._id) {
        // 成功回调
        if (payload.onSucessCallback) {
          payload.onSucessCallback(res);
        }
      }
    },

    /**
     * 同意审批
     */
    *agreeApproveOrder({ payload }, { call }) {
      const {
        orderId,
        recordId,
        note,
        belongTime,
        flexibleDep, // 灵活抄送部门/岗位信息
        flexibleUser, // 灵活抄送成员信息
      } = payload;
      const params = {};
      // 审批单id
      orderId && (params._id = orderId);
      // 流转记录id
      recordId && (params.order_node_record_id = recordId);
      // 备注
      note && (params.note = note);
      // 记账月份
      belongTime && (params.book_month = belongTime);
      if (Array.isArray(flexibleDep) && flexibleDep.length > 0) {
        // 灵活抄送部门ids
        params.flexible_department_ids = flexibleDep.filter(item => item.departmentId).map(item => item.departmentId);
        // 灵活抄送部门岗位关系ids
        params.flexible_department_job_ids = flexibleDep.filter(item => item.departmentJobid).map(item => item.departmentJobid);
      }
      if (Array.isArray(flexibleUser) && flexibleUser.length > 0) {
        // 灵活抄送账户ids
        params.flexible_account_ids = flexibleUser;
      }
      const res = yield call(agreeApproveOrder, params);
      return res;
    },


    /**
     * 可驳回节点列表
     */
    *getRejectNodeList({ payload }, { call, put }) {
      const { orderId, recordId } = payload;
      const params = {};
      // 审批单id
      orderId && (params._id = recordId);

      const res = yield call(getRejectNodeList, params);

      if (res) {
        yield put({ type: 'reduceRejectNodeList', payload: res });
      }
    },

    /**
     * 可驳回节点列表
     */
    *resetRejectNodeList(_, { put }) {
      yield put({ type: 'reduceRejectNodeList' });
    },

    /**
     * 驳回审批
     */
    *disallowanceApproveOrder({ payload }, { call }) {
      const { orderId, recordId, rejectNodeId, note } = payload;
      if (!orderId) return message.error('缺少审批单id');
      const params = { order_id: orderId };
      // 流转记录id
      recordId && (params.order_node_record_id = recordId);
      // 驳回节点id
      rejectNodeId && rejectNodeId !== 'null' && (params.reject_to_node_id = rejectNodeId);
      // 备注
      note && (params.note = note);
      const res = yield call(disallowanceApproveOrder, params);
      return res;
    },

    /**
     * 标记付款异常审批
     */
    *markApproveOrderAbnormal({ payload }, { call }) {
      const { orderId, note } = payload;
      if (!orderId) return message.error('缺少审批单id');
      const params = { oa_order_id: orderId };
      // 备注
      note && (params.note = note);
      const res = yield call(markApproveOrderAbnormal, params);
      return res;
    },

    /**
     * 审批单下的单个费用单
     */
    *fetchOrderCostItem({ payload }, { call, put }) {
      const { id, orderId, namespace } = payload;

      if (!id) {
        return message.error('缺少费用单id');
      }

      if (!orderId) {
        return message.error('缺少审批单id');
      }

      const params = { _id: id, oa_order_id: orderId };
      const result = yield call(fetchOrderCostItem, params);
      if (result.zh_message) {
        return message.error(`请求错误：${result.zh_message}`);
      }
      if (result) {
        yield put({ type: 'reduceOrderCostItem', payload: { result, namespace } });
      }
    },

    /**
     * 审批单下的单个差旅单
     */
    *fetchTravelOrder({ payload }, { call, put }) {
      const { id, orderId, namespace } = payload;
      if (!orderId) {
        return message.error('缺少审批单id');
      }
      const params = { _id: id, oa_order_id: orderId };
      const result = yield call(fetchTravelOrder, params);
      if (result.zh_message) {
        return message.error(`请求错误：${result.zh_message}`);
      }
      if (result) {
        yield put({ type: 'reduceTravelOrder', payload: { result, namespace } });
      }
    },

    /**
     * 删除审批单下的单个费用单
     */
    *removeOrderCostItem({ payload }, { call }) {
      const { id } = payload;
      if (!id) return message.error('缺少审批单id');
      const params = { };
      // 费用单id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      const result = yield call(removeOrderCostItem, params);
      if (result.zh_message) {
        return message.error(`请求错误：${result.zh_message}`);
      }
      if (result && result._id) {
        message.success('移除成功');
        if (payload.onSucessCallback) {
          payload.onSucessCallback();
        }
      }
    },
    /**
     * 创建审批单下的单个费用单
     */
    *createOrderCostItem({ payload }, { call }) {
      const { orderId } = payload;
      if (!orderId) return message.error('缺少审批单id');
      const params = { oa_order_id: orderId };
      // 科目
      if (is.existy(payload.subjectId) && is.not.empty(payload.subjectId)) {
        params.cost_accounting_id = payload.subjectId;
      }
      // 核算中心
      if (is.existy(payload.codeBusinessAccount) && is.not.empty(payload.codeBusinessAccount)) {
        params.cost_target_id = payload.codeBusinessAccount;
      }
      // 金额
      if (is.existy(payload.money) && is.not.empty(payload.money)) {
        params.total_money = Unit.dynamicExchange(payload.money, Unit.priceYuan);
      }
      // 发票抬头
      if (is.existy(payload.invoiceTitle) && is.not.empty(payload.invoiceTitle)) {
        params.invoice_title = payload.invoiceTitle;
      }

      // 事由
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.note = payload.note;
      }
      // 附件
      if (is.existy(payload.assets) && is.not.empty(payload.assets)) {
        params.attachments = payload.assets.map(v => Object.values(v)[0]);
      }

      // 支付明细
      if (is.existy(payload.bankList) && !is.empty(payload.bankList)) {
        params.payee_list = payload.bankList.map((v) => {
          const item = {
            card_name: String(v.card_name).replace(/\s*/g, ''),       // 收款人姓名
            card_num: v.card_num,         // 收款人卡号
            bank_details: v.bank_details, // 开户行
            payee_type: v.payee_type,     // 收款方式
            money: Unit.exchangePriceToCent(Number(v.money)),               // 金额
            payee_employee_id: v.payee_employee_id,                   // 档案id
          };
          // 手机号
          if (is.existy(v.card_phone) && !is.empty(v.card_phone)) {
            item.card_phone = v.card_phone;
          }
          return item;
        });
      }
      const result = yield call(createOrderCostItem, params);
      if (result.zh_message) {
        if (payload.onErrorCallback) {
          payload.onErrorCallback();
        }
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 成功
      if (is.existy(result) && is.not.empty(result) && result._id) {
        if (payload.onSucessCallback) {
          payload.onSucessCallback(result);
        }
      }
    },
    /**
     * 编辑审批单下的单个费用单
     */
    *updateOrderCostItem({ payload }, { call, put }) {
      const { id, namespace } = payload;
      if (!id) return message.error('缺少费用单id');
      const params = {};
      // 费用单id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 科目
      if (is.existy(payload.subjectId) && is.not.empty(payload.subjectId)) {
        params.cost_accounting_id = payload.subjectId;
      }
      // 核算中心
      if (is.existy(payload.codeBusinessAccount) && is.not.empty(payload.codeBusinessAccount)) {
        params.cost_target_id = payload.codeBusinessAccount;
      }
      // 金额
      if (is.existy(payload.money) && is.not.empty(payload.money)) {
        params.total_money = Unit.dynamicExchange(payload.money, Unit.priceYuan);
      }
      // 发票抬头
      if (is.existy(payload.invoiceTitle) && is.not.empty(payload.invoiceTitle)) {
        params.invoice_title = payload.invoiceTitle;
      }

      // 事由
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.note = payload.note;
      } else {
        params.note = '';
      }

      // 附件
      if (is.existy(payload.assets)) {
        params.attachments = payload.assets.map(v => Object.values(v)[0]);
      } else {
        params.attachments = [];
      }

      // 支付明细
      if (is.existy(payload.bankList) && !is.empty(payload.bankList)) {
        params.payee_list = payload.bankList.map((v) => {
          const item = {
            card_name: String(v.card_name).replace(/\s*/g, ''),       // 收款人姓名
            card_num: v.card_num,         // 收款人卡号
            bank_details: v.bank_details, // 开户行
            payee_type: v.payee_type,     // 收款方式
            money: Unit.exchangePriceToCent(Number(v.money)),               // 金额
            payee_employee_id: v.payee_employee_id,                   // 档案id
          };
          // 手机号
          if (is.existy(v.card_phone) && !is.empty(v.card_phone)) {
            item.card_phone = v.card_phone;
          }
          return item;
        });
      }
      const result = yield call(updateOrderCostItem, params);
      if (result.zh_message) {
        if (payload.onErrorCallback) {
          payload.onErrorCallback();
        }
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 成功
      if (is.existy(result) && is.not.empty(result) && result._id) {
        if (payload.onSucessCallback) {
          payload.onSucessCallback(result);
        }

        // 清除当前费用单数据
        yield put({ type: 'reduceOrderCostItem', payload: { result: {}, namespace } });
      }
    },

    /**
     * 创建审批单下的单个差旅
     */
    *createOrderCostcostTravelOrder({ payload }, { call }) {
      const { orderId } = payload;
      if (!orderId) return message.error('缺少审批单id');
      const params = { oa_order_id: orderId };
      // 科目
      if (is.existy(payload.subjectId) && is.not.empty(payload.subjectId)) {
        params.cost_accounting_id = payload.subjectId;
      }
      // 归属team/code
      if (is.existy(payload.costTargetId) && is.not.empty(payload.costTargetId)) {
        params.cost_target_id = payload.costTargetId;
      }
      // 关联的出差单id
      if (is.existy(payload.businessTravelId) && is.not.empty(payload.businessTravelId)) {
        params.travel_order_id = payload.businessTravelId;
      }

      // 实际出差时间
      if (is.existy(payload.date) && is.not.empty(payload.date)) {
        params.actual_start_at = moment(payload.date[0]).format('YYYY-MM-DD HH:00:00');
        params.actual_done_at = moment(payload.date[1]).format('YYYY-MM-DD HH:00:00');
      }
      // 实际出差天数
      if (is.existy(payload.dateDay) && is.not.empty(payload.dateDay)) {
        params.actual_apply_days = payload.dateDay;
      }
      // 核算中心
      if (is.existy(payload.codeBusinessAccount) && is.not.empty(payload.codeBusinessAccount)) {
        params.cost_target_id = payload.codeBusinessAccount;
      }
      // 金额
      if (is.existy(payload.money) && is.not.empty(payload.money)) {
        params.total_money = Unit.dynamicExchange(Number(payload.money), Unit.priceYuan);
      }

      // 差旅明细
      if (is.existy(payload.bizExtraData) && is.not.empty(payload.bizExtraData)) {
        // 补助
        params.subsidy_fee = Unit.dynamicExchange(payload.bizExtraData.subsidy_fee, Unit.priceYuan);
        // 住宿费
        params.stay_fee = Unit.dynamicExchange(payload.bizExtraData.stay_fee, Unit.priceYuan);
        // 市内交通费
        params.urban_transport_fee = Unit.dynamicExchange(payload.bizExtraData.urban_transport_fee, Unit.priceYuan);
        if (payload.bizExtraData.transport_fee) {
          // 往返交通费
          params.transport_fee = Unit.dynamicExchange(payload.bizExtraData.transport_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.other_fee) {
          // 其他费用
          params.other_fee = Unit.dynamicExchange(payload.bizExtraData.other_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.high_speed_train_fee) {
          // 动车/高铁交通费
          params.high_speed_train_fee = Unit.dynamicExchange(payload.bizExtraData.high_speed_train_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.aircraft_fee) {
          // 飞机交通费
          params.aircraft_fee = Unit.dynamicExchange(payload.bizExtraData.aircraft_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.train_ordinary_soft_sleeper_fee) {
          // 普通软卧交通费
          params.train_ordinary_soft_sleeper_fee = Unit.dynamicExchange(payload.bizExtraData.train_ordinary_soft_sleeper_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.bus_fee) {
          // 客车交通费
          params.bus_fee = Unit.dynamicExchange(payload.bizExtraData.bus_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.self_driving_fee) {
          // 自驾交通费
          params.self_driving_fee = Unit.dynamicExchange(payload.bizExtraData.self_driving_fee, Unit.priceYuan);
        }
      }
      // 事由
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.note = payload.note;
      }
      // 附件
      if (is.existy(payload.assets) && is.not.empty(payload.assets)) {
        params.attachments = payload.assets.map(v => Object.values(v)[0]);
      }
      // 发票抬头
      if (is.existy(payload.invoiceTitle) && is.not.empty(payload.invoiceTitle)) {
        params.invoice_title = payload.invoiceTitle;
      }

      // 出差单类型
      if (is.existy(payload.travelState) && is.not.empty(payload.travelState)) {
        params.travel_order_type = payload.travelState;
      }

      // 支付明细
      if (is.existy(payload.bankList) && !is.empty(payload.bankList)) {
        params.payee_list = payload.bankList.map((v) => {
          const item = {
            card_name: String(v.card_name).replace(/\s*/g, ''),       // 收款人姓名
            card_num: v.card_num,         // 收款人卡号
            bank_details: v.bank_details, // 开户行
            payee_type: v.payee_type,     // 收款方式
            money: Unit.exchangePriceToCent(Number(v.money)),               // 金额
            payee_employee_id: v.payee_employee_id,                   // 档案id
          };
          // 手机号
          if (is.existy(v.card_phone) && !is.empty(v.card_phone)) {
            item.card_phone = v.card_phone;
          }
          return item;
        });
      }
      const result = yield call(createOrderCostcostTravelOrder, params);
      if (result.zh_message) {
        if (payload.onErrorCallback) {
          payload.onErrorCallback();
        }
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 成功
      if (is.existy(result) && is.not.empty(result) && result._id) {
        if (payload.onSucessCallback) {
          payload.onSucessCallback(result);
        }
      }
    },
    /**
     * 编辑审批单下的单个差旅
     */
    *updateOrderCostcostTravelOrder({ payload }, { call }) {
      const { id } = payload;
      if (!id) return message.error('缺少费用单id');
      const params = {};
      // 费用单id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 科目
      if (is.existy(payload.subjectId) && is.not.empty(payload.subjectId)) {
        params.cost_accounting_id = payload.subjectId;
      }
      // 归属team/code
      if (is.existy(payload.costTargetId) && is.not.empty(payload.costTargetId)) {
        params.cost_target_id = payload.costTargetId;
      }
      // 关联的出差单id
      if (is.existy(payload.businessTravelId) && is.not.empty(payload.businessTravelId)) {
        params.travel_order_id = payload.businessTravelId;
      }

      // 实际出差时间
      if (is.existy(payload.date) && is.not.empty(payload.date)) {
        params.actual_start_at = moment(payload.date[0]).format('YYYY-MM-DD HH:00:00');
        params.actual_done_at = moment(payload.date[1]).format('YYYY-MM-DD HH:00:00');
      }
      // 实际出差天数
      if (is.existy(payload.dateDay) && is.not.empty(payload.dateDay)) {
        params.actual_apply_days = payload.dateDay;
      }
      // 核算中心
      if (is.existy(payload.codeBusinessAccount) && is.not.empty(payload.codeBusinessAccount)) {
        params.cost_target_id = payload.codeBusinessAccount;
      }
      // 金额
      if (is.existy(payload.money) && is.not.empty(payload.money)) {
        params.total_money = Unit.dynamicExchange(Number(payload.money), Unit.priceYuan);
      }

      // 差旅明细
      if (is.existy(payload.bizExtraData) && is.not.empty(payload.bizExtraData)) {
        // 补助
        params.subsidy_fee = Unit.dynamicExchange(payload.bizExtraData.subsidy_fee, Unit.priceYuan);
        // 住宿费
        params.stay_fee = Unit.dynamicExchange(payload.bizExtraData.stay_fee, Unit.priceYuan);
        // 市内交通费
        params.urban_transport_fee = Unit.dynamicExchange(payload.bizExtraData.urban_transport_fee, Unit.priceYuan);
        if (payload.bizExtraData.transport_fee) {
          // 往返交通费
          params.transport_fee = Unit.dynamicExchange(payload.bizExtraData.transport_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.other_fee) {
          // 其他费用
          params.other_fee = Unit.dynamicExchange(payload.bizExtraData.other_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.high_speed_train_fee) {
          // 动车/高铁交通费
          params.high_speed_train_fee = Unit.dynamicExchange(payload.bizExtraData.high_speed_train_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.aircraft_fee) {
          // 飞机交通费
          params.aircraft_fee = Unit.dynamicExchange(payload.bizExtraData.aircraft_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.train_ordinary_soft_sleeper_fee) {
          // 普通软卧交通费
          params.train_ordinary_soft_sleeper_fee = Unit.dynamicExchange(payload.bizExtraData.train_ordinary_soft_sleeper_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.bus_fee) {
          // 客车交通费
          params.bus_fee = Unit.dynamicExchange(payload.bizExtraData.bus_fee, Unit.priceYuan);
        }
        if (payload.bizExtraData.self_driving_fee) {
          // 自驾交通费
          params.self_driving_fee = Unit.dynamicExchange(payload.bizExtraData.self_driving_fee, Unit.priceYuan);
        }
      }
      // 事由
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.note = payload.note;
      }
      // 附件
      if (is.existy(payload.assets) && is.not.empty(payload.assets)) {
        params.attachments = payload.assets.map(v => Object.values(v)[0]);
      } else {
        params.attachments = [];
      }
      // 发票抬头
      if (is.existy(payload.invoiceTitle) && is.not.empty(payload.invoiceTitle)) {
        params.invoice_title = payload.invoiceTitle;
      }
      // 出差单类型
      if (is.existy(payload.travelState) && is.not.empty(payload.travelState)) {
        params.travel_order_type = payload.travelState;
      }

      // 支付明细
      if (is.existy(payload.bankList) && !is.empty(payload.bankList)) {
        params.payee_list = payload.bankList.map((v) => {
          const item = {
            card_name: String(v.card_name).replace(/\s*/g, ''),       // 收款人姓名
            card_num: v.card_num,         // 收款人卡号
            bank_details: v.bank_details, // 开户行
            payee_type: v.payee_type,     // 收款方式
            money: Unit.exchangePriceToCent(Number(v.money)),               // 金额
            payee_employee_id: v.payee_employee_id,                   // 档案id
          };
          // 手机号
          if (is.existy(v.card_phone) && !is.empty(v.card_phone)) {
            item.card_phone = v.card_phone;
          }
          return item;
        });
      }

      const result = yield call(updateOrderCostcostTravelOrder, params);
      // 错误提示
      if (result.zh_message) {
        if (payload.onErrorCallback) {
          payload.onErrorCallback();
        }
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 成功
      if (is.existy(result) && is.not.empty(result) && result._id) {
        if (payload.onSucessCallback) {
          payload.onSucessCallback(result);
        }
      }
    },

    /**
     * 获取差旅补助金额是否超标
     */
    fetchTravelMoneyExceedingStandard: [
      function*({ payload }, { call }) {
        const params = {
          travel_order_type: payload.travelState,
          travel_order_id: payload.travelOrderId,
        };
        // 补助
        if (typeof payload.bizExtraData.subsidy_fee === 'number' && payload.bizExtraData.subsidy_fee >= 0) {
          params.subsidy_fee = Unit.exchangePriceToCent(payload.bizExtraData.subsidy_fee);
        }
        // 住宿
        if (typeof payload.bizExtraData.stay_fee === 'number' && payload.bizExtraData.stay_fee >= 0) {
          params.stay_fee = Unit.exchangePriceToCent(payload.bizExtraData.stay_fee);
        }
        const result = yield call(fetchTravelMoneyExceedingStandard, params);
        // 错误提示
        if (result.zh_message) {
          if (payload.onErrorCallback) {
            payload.onErrorCallback();
          }
          return message.error(`请求错误：${result.zh_message}`);
        }
        // 成功
        if (is.existy(result) && is.not.empty(result)) {
          if (payload.onSucessCallback) {
            payload.onSucessCallback(result);
          }
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 创建审批单
     */
    *createSubmitOrder({ payload }, { call }) {
      const { orderId } = payload;
      if (!orderId) return message.error('缺少审批单id');
      const params = { order_id: orderId };
      const res = yield call(createSubmitOrder, params);
      // 错误提示
      if (res.zh_message) {
        if (payload.onErrorCallback) {
          payload.onErrorCallback();
        }
        return message.error(`请求错误：${res.zh_message}`);
      }
      if (res._id) {
        // 成功回调
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      }
    },

    /**
     * 添加补充意见
     */
    *addApproveOrderExtra({ payload }, { call }) {
      const { orderId, recordId, fileList, note } = payload;
      const params = {};
      // 审批单id
      orderId && (params._id = orderId);
      // 流转记录id
      recordId && (params.order_node_record_id = recordId);
      // 附件
      fileList && (params.file_list = fileList.map(v => Object.values(v)[0]));
      // 意见
      note && (params.content = note);
      const res = yield call(addApproveOrderExtra, params);
      // 错误提示
      if (res.zh_message) {
        return message.error(`请求错误：${res.zh_message}`);
      }
      // 成功回调
      if (res && res._id) {
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      }
    },

    /**
     * 删除补充意见
     */
    *deleteApproveOrderExtra({ payload }, { call }) {
      const { extraId } = payload;
      if (!extraId) return message.error('缺少意见id');
      const params = { _id: extraId };
      const res = yield call(deleteApproveOrderExtra, params);
      if (res.zh_message) {
        return message.error(`请求错误：${res.zh_message}`);
      }
      return res;
    },

    /**
     * 标记付款
     */
    *markApproveOrderPayDone({ payload }, { call }) {
      const { orderId, payeeList, note } = payload;
      const params = {};
      // 审批单id
      orderId && (params.oa_order_id = orderId);
      // 付款信息
      payeeList && (params.payee_list = payeeList);
      note && (params.note = note);
      const res = yield call(markApproveOrderPayDone, params);
      return res;
    },

    /**
     * 标记不付款
     */
    *markApproveOrderPayCancel({ payload }, { call }) {
      const { orderId, note } = payload;
      const params = {};
      // 审批单id
      orderId && (params.oa_order_id = orderId);
      // 备注
      note && (params.note = note);
      const res = yield call(markApproveOrderPayCancel, params);
      return res;
    },

    /**
     * 打验票标签
     */
    *setOrderTicket({ payload }, { call }) {
      const { orderId, recordId, tags } = payload;
      const params = {};
      // 审批单id
      orderId && (params.oa_order_id = orderId);
      // 流转记录id
      recordId && (params.order_node_record_id = recordId);
      // 标签
      tags && (params.oa_label_ids = tags);
      const res = yield call(setOrderTicket, params);
      return res;
    },

    /**
     * 获取验票校验结果
     */
    *getTicketCheck({ payload }, { call }) {
      const { orderId, recordId } = payload;
      const params = {};
      // 审批单id
      orderId && (params.oa_order_id = orderId);
      // 流转记录id
      recordId && (params.order_node_record_id = recordId);
      const res = yield call(getTicketCheck, params);
      return res;
    },

    /**
     * 标记验票异常
     */
    *markOrderBillAbnormal({ payload }, { call }) {
      const { orderId, recordId, note } = payload;
      const params = {};
      // 审批单id
      orderId && (params.oa_order_id = orderId);
      // 流转记录id
      recordId && (params.order_node_record_id = recordId);
      // 备注
      note && (params.note = note);
      const res = yield call(markOrderBillAbnormal, params);
      return res;
    },

    /**
     * 标记验票完成
     */
    *markCostOrderBillDone({ payload }, { call }) {
      const { orderId, recordId, note } = payload;
      const params = {};
      // 审批单id
      orderId && (params.oa_order_id = orderId);
      // 流转记录id
      recordId && (params.order_node_record_id = recordId);
      // 备注
      note && (params.note = note);
      const res = yield call(markCostOrderBillDone, params);
      return res;
    },

    /**
     * 红冲
     */
    *pushRedCostOrder({ payload }, { call }) {
      // 费用单id
      const { costOrderId, orderId } = payload;
      if (!costOrderId) return message.error('缺少费用单id');
      if (!orderId) return message.error('缺少审批单id');
      const params = { cost_order_id: costOrderId, oa_order_id: orderId };
      const res = yield call(pushRedCostOrder, params);
      return res;
    },

    /**
     * 审批单流转记录列表
     * @memberof module:model/code/order~code/order/effects
     */
    *getOrderFlowRecordList({ payload }, { call, put }) {
      const {
        orderId, // 审批单id
      } = payload;
      if (!orderId) return message.error('缺少审批单id');

      const params = {
        order_id: orderId,
        _meta: { page: 1, limit: 9999 },
      };

      const res = yield call(getOrderFlowRecordList, params);

      if (res && res.data) {
        yield put({ type: 'reduceOrderFlowRecordList', payload: res });
      }
    },

    /**
     * 重置审批单流转记录列表
     */
    *resetOrderFolwRecoedList({ payload }, { put }) {
      yield put({ type: 'reduceOrderFlowRecordList', payload: {} });
    },

    /**
     * 审批单下相关费用单
     * @memberof module:model/code/order~code/order/effects
     */
    *getCostOrderList({ payload }, { call, put }) {
      const {
        orderId, // 审批单id
      } = payload;
      if (!orderId) return message.error('缺少审批单id');

      const params = {
        oa_order_id: orderId,
        state: [ // 状态
          CodeApproveOrderCostState.toReport, // 待提报
          CodeApproveOrderCostState.conduct, // 审批进行中
          CodeApproveOrderCostState.complete, // 审批完成
          CodeApproveOrderCostState.close, // 关闭
        ],
        _meta: { page: 1, limit: 9999 },
      };

      const res = yield call(getCostOrderList, params);

      if (res) {
        yield put({ type: 'reduceCostOrderList', payload: res });
      }
    },

    /**
     * 重置审批单流转记录列表
     */
    *resetCostOrderList({ payload }, { put }) {
      yield put({ type: 'reduceCostOrderList', payload: {} });
    },

    /**
     * 费用单添加发票
     */
    *addCostOrderInvoice({ payload }, { call }) {
      // 费用单id
      const {
        costOrderId = undefined,
        type,
        code,
        money,
        taxRate,
        tax,
        noTax,
        orderId, // 审批单id
      } = payload;
      const params = { cost_order_id: costOrderId };

      code && (params.code = code);
      type && (params.type = type);
      money && (params.money = Unit.exchangePriceToCent(Number(money)));
      taxRate && (params.tax_rate = taxRate);
      // 审批单id
      orderId && (params.oa_order_id = orderId);
      tax && (params.tax_amount = Unit.exchangePriceToCent(Number(tax)));
      noTax && (params.tax_deduction = Unit.exchangePriceToCent(Number(noTax)));

      const res = yield call(addCostOrderInvoice, params);
      return res;
    },

    /**
     * 费用单删除发票
     */
    *deleteOrderInvoice({ payload }, { call }) {
      const { id, costOrderId, orderId } = payload;
      if (!id) return message('缺少发票id');
      if (!costOrderId) return message('缺少费用单id');

      const params = {
        _id: id,
        cost_order_id: costOrderId,
      };

      // 审批单id
      orderId && (params.oa_order_id = orderId);

      const res = yield call(deleteOrderInvoice, params);
      return res;
    },

    /**
     * 获取原有审批流list
     */
    *getOriginOrderList({ payload }, { call, put }) {
      const { orderIds = [], page = 1, limit = 30 } = payload;
      if (!Array.isArray(orderIds) || orderIds.length < 1) return message.error('缺少审批流ids');

      const params = {
        relation_application_order_ids: orderIds,
        _meta: { page, limit },
      };

      const res = yield call(getOriginOrderList, params);
      if (res && res.data) {
        yield put({ type: 'reduceOriginOrderList', payload: res });
      }
    },

    /**
     * 获取当前账户待提报code/team审批单
     */
    *getOrderCount({ payload }, { call, put }) {
      const { tabKey } = payload;
      const params = {
        _meta: { page: 1, limit: 9999 },
        ...dealSearchValues(payload),
      };

      tabKey && (params.tab_type = Number(tabKey));

      const res = yield call(getApproveOrderList, params);

      if (res && res._meta) {
        yield put({ type: 'reduceOrderCount', payload: { ...res, tabKey } });
      }
    },

    /**
     * 审批单下相关费用单（打印）
     * @memberof module:model/code/order~code/order/effects
     */
    *getPrintCostOrderList({ payload }, { call }) {
      const {
        orderId, // 审批单id
      } = payload;
      if (!orderId) return message.error('缺少审批单id');

      const params = {
        oa_order_id: orderId,
        state: [
          CodeApproveOrderCostState.conduct,
          CodeApproveOrderCostState.complete,
          CodeApproveOrderCostState.close,
        ],
        _meta: { page: 1, limit: 9999 },
      };

      const res = yield call(getRecordList, params);

      if (res && res.data) {
        return res.data;
      }
    },

    /**
     * 审批单流转记录（打印）
     * @memberof module:model/code/order~code/order/effects
     */
    *getPrintRecordList({ payload }, { call }) {
      const {
        orderId, // 审批单id
      } = payload;
      if (!orderId) return message.error('缺少审批单id');

      const params = {
        order_id: orderId,
        _meta: { page: 1, limit: 9999 },
      };

      const res = yield call(getOrderFlowRecordList, params);

      if (res && res.data) {
        return res.data;
      }
    },

    /**
     * 审批单详情（打印）
     * @memberof module:model/code/order~code/order/effects
     */
    *getPrintOrderList({ payload }, { call, put }) {
      const { orderId } = payload;
      if (!orderId) return message.error('缺少审批单id');
      const params = { _id: orderId };
      // 审批单信息
      const orderDetail = yield call(getApproveOrderDetail, params);
      // 流转记录
      const orderRecordList = yield put.resolve({
        type: 'getPrintRecordList',
        payload: { orderId },
      });
      const costOrderList = yield put.resolve({
        type: 'getPrintCostOrderList',
        payload: { orderId },
      });


      if (orderDetail && costOrderList) {
        yield put({ type: 'reducePrintOrderList', payload: { orderDetail, costOrderList, orderRecordList } });
      }
    },

    /**
     * 重置审批单打印数据
     */
    *resetPrintOrderList({ payload }, { put }) {
      yield put({ type: 'reducePrintOrderList', payload: { isReset: true } });
    },

    /**
     * 获取当前账户草稿状态的审批单
     * @memberof module:model/code/order~code/order/effects
     */
    *getDraftOrder({ payload }, { call }) {
      const { linkId } = payload;
      const params = { link_id: linkId };

      const res = yield call(getDraftOrder, params);
      return res;
    },

    /**
     * 获取当前账户草稿状态的审批单
     * @memberof module:model/code/order~code/order/effects
     */
    *onSubmitBuriedPoint({ payload }, { call }) {
      const { linkId, action } = payload;
      const params = { link_id: linkId, action };

      yield call(onSubmitBuriedPoint, params);
    },

    /**
     * 获取记账月份list
     * @memberof module:model/code/order~code/order/effects
     */
    *getBookMonthList({ payload }, { call, put }) {
      const { orderId } = payload;
      const params = {
        _id: orderId,
      };

      const res = yield call(getBookMonthList, params);

      if (res && Array.isArray(res)) {
        yield put({ type: 'reduceBookMonthList', payload: res });
      }
    },

    /**
     * 重置记账月份
     * @memberof module:model/code/order~code/order/effects
     */
    *resetBookMonthList({ payload }, { put }) {
      yield put({ type: 'reduceBookMonthList', payload: {} });
    },

    /**
     * 加入智能分组
     * @memberof module:model/code/order~code/order/effects
     */
    *addIntelligentGroup({ payload }, { call }) {
      const {
        groupName,
        isDefault,
      } = payload;
      const params = {
        name: groupName,
        is_default: Array.isArray(isDefault) && isDefault.length > 0, // 是否为默认智能分组
        filter_params: { ...dealSearchValues(payload) }, // 筛选条件
      };

      payload.tabKey && (params.tab_type = Number(payload.tabKey));

      const res = yield call(addIntelligentGroup, params);
      return res;
    },

    /**
     * 修改费用单金额
     * @memberof module:model/code/order~code/order/effects
     */
    *onUpdateOrderMoney({ payload }, { call }) {
      const {
        orderId, // 审批单id
        costOrderId, // 费用单id
        payeeList = {},
      } = payload;

      if (!orderId) return message.error('缺少审批单id');
      if (!costOrderId) return message.error('缺少费用单id');

      const targetPayeeList = {};
      for (const p in payeeList) {
        targetPayeeList[p] = {
          ...payeeList[p],
          money: payeeList[p].money * 100,
        };
      }

      const params = {
        order_id: orderId,
        cost_order_id: costOrderId,
        payee_money_dict: targetPayeeList,
      };

      const res = yield call(onUpdateOrderMoney, params);
      return res;
    },

    /**
     * 删除审批单查询条件分组
     * @memberof module:model/code/order~code/order/effects
     */
    *onDeleteGroup({ payload }, { call }) {
      const {
        groupId,
      } = payload;
      if (!groupId) return message.error('缺少分组id');
      const params = { _id: groupId };
      const res = yield call(onDeleteGroup, params);
      return res;
    },

    /**
     * 获取审批单查询条件分组
     * @memberof module:model/code/order~code/order/effects
     */
    *getOrderSearchGroupList({ payload }, { call, put }) {
      const {
        tabKey,
      } = payload;
      const params = {
        state: 100, // 状态（正常）
      };
      tabKey && (params.tab_type = Number(tabKey));

      const res = yield call(getOrderSearchGroupList, params);
      if (res) {
        yield put({ type: 'reduceOrderSearchGroup', payload: res });
      }

      if (res && res.data) {
        return res.data;
      } else {
        return [];
      }
    },

    /**
     * 设置默认分组
     * @memberof module:model/code/order~code/order/effects
     */
    *onSetDefaultGroup({ payload }, { call }) {
      const {
        groupId,
        isDefault,
      } = payload;
      if (!groupId) return message.error('缺少分组id');
      const params = {
        _id: groupId,
        is_default: isDefault,
      };
      const res = yield call(onSetDefaultGroup, params);
      return res;
    },
  },

  /**
   * @namespace code/order/reducers
   */
  reducers: {
    /**
     * 存储用户操作行为
     */
    reduceUserAction(state, action) {
      return { ...state, prePageAction: action.payload };
    },
    /**
     * 更新审批单list
     * @returns {object} 更新 approveOrderList
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceApproveList(state, action) {
      let approveOrderList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        approveOrderList = action.payload;
      }
      return { ...state, approveOrderList };
    },
    /**
     * 更新关联审批单list
     * @returns {object} 更新 relationOrderList
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceRelationOrderList(state, action) {
      return { ...state, relationOrderList: action.payload };
    },

    /**
     *
     * @returns {object} 互联审批单列表  创建页面
     */
    reduceApprovalFindLists(state, action) {
      return { ...state, approvalObjects: action.payload };
    },
    /**
     *
     * @returns {object} 获取互联审批单列表 编辑页面
     */
    reduceApprovalData(state, action) {
      return { ...state, approvalLists: action.payload };
    },


    /**
     * 更新项目list
     * @returns {object} 更新 projectList
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceProjectList(state, action) {
      let projectList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        projectList = action.payload;
      }
      return { ...state, projectList };
    },

    /**
     * 更新审批流链接list
     * @returns {object} 更新 flowLinkList
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceFlowLinkList(state, action) {
      let flowLinkList = [];
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        flowLinkList = action.payload;
      }
      return { ...state, flowLinkList };
    },

    /**
     * 更新审批单详情
     * @returns {object} 更新 approveOrderDetail
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceApproveOrderDetail(state, action) {
      let approveOrderDetail = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        approveOrderDetail = action.payload;
      }
      return { ...state, approveOrderDetail };
    },
    /**
     * 更新审批单详情 - 主题标签
     * @returns {object} 更新 approveOrderThemeTags
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceApproveOrderThemeTags(state, action) {
      let approveOrderThemeTags = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        approveOrderThemeTags = action.payload;
      }
      return { ...state, approveOrderThemeTags };
    },

    /**
     * 更新可驳回节点列表
     * @returns {object} 更新 rejectNodeList
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceRejectNodeList(state, action) {
      let rejectNodeList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        rejectNodeList = action.payload;
      }
      return { ...state, rejectNodeList };
    },

    /**
     * 审批单下的单个费用单
     * @returns {object} 更新 orderCostItem
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceOrderCostItem(state, action) {
      const { namespace, result } = action.payload;
      return {
        ...state,
        orderCostItem: {
          ...state.orderCostItem,
          [namespace]: result,
        },
      };
    },
    /**
     * 审批单下的单个差旅单
     * @returns {object} 更新 travelOrder
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceTravelOrder(state, action) {
      const { namespace, result } = action.payload;
      return {
        ...state,
        travelOrder: {
          ...state.travelOrder,
          [namespace]: result,
        },
      };
    },

    /**
     * 审批单流转记录列表
     * @returns {object} 更新 flowRecordList
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceOrderFlowRecordList(state, action) {
      let flowRecordList = [];
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        flowRecordList = action.payload;
      }
      return { ...state, flowRecordList };
    },

    /**
     * 审批单下相关费用单
     * @returns {object} 更新 flowRecordList
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceCostOrderList(state, action) {
      let costOrderList = [];
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        costOrderList = action.payload;
      }
      return { ...state, costOrderList };
    },

    /**
     * 更新原有审批单列表
     * @returns {object} 更新 originOrderList
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceOriginOrderList(state, action) {
      let originOrderList = [];
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        originOrderList = action.payload;
      }
      return { ...state, originOrderList };
    },

    /**
     * 更新我待办审批单数量
     * @returns {object} 更新 reportOrderCount
     * @returns {object} 更新 submitOrderCount
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceOrderCount(state, action) {
      let { reportOrderCount, submitOrderCount } = state;
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        const tabKey = dot.get(action, 'payload.tabKey');
        // 待审批
        tabKey === CodeApproveOrderTabKey.upcoming && (
          reportOrderCount = dot.get(action, 'payload._meta.result_count', 0)
        );
        // 待提报
        tabKey === CodeApproveOrderTabKey.awaitReport && (
          submitOrderCount = dot.get(action, 'payload._meta.result_count', 0)
        );
      }
      return { ...state, reportOrderCount, submitOrderCount };
    },

    /**
     * 更新打印审批单信息
     * @returns {object} 更新 printOrderList
     * @memberof module:model/code/order~code/order/reducers
     */
    reducePrintOrderList(state, action) {
      const { printOrderList = [] } = state;
      if (action.payload) {
        const {
          orderDetail,
          costOrderList,
          orderRecordList,
          isReset,
        } = action.payload;
        if (isReset) {
          return {
            ...state,
            printOrderList: [],
          };
        }
        return {
          ...state,
          printOrderList: [
            ...printOrderList,
            { ...orderDetail, costOrderList, orderRecordList },
          ],
        };
      }
      return { ...state, printOrderList };
    },

    /**
     * 更新记账月份
     */
    reduceBookMonthList(state, action) {
      let bookMonthList = [];
      if (action.payload && Array.isArray(action.payload)) {
        bookMonthList = action.payload;
      }
      return { ...state, bookMonthList };
    },

    /**
     * 更新审批单查询条件分组
     */
    reduceOrderSearchGroup(state, action) {
      let orderSearchGroup = [];
      if (action.payload && action.payload.data) {
        orderSearchGroup = action.payload.data;
      }
      return { ...state, orderSearchGroup };
    },
  },
};
