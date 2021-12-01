/**
 * 审批单
 * @module model/expense/examineOrder
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import dot from 'dot-prop';
import { message } from 'antd';

import {
  fetchExamineOrders,
  fetchPCExamineOrderDetail,
  fetchBorrowingOrderDetail,
  fetchRepaymentOrderDetail,
  createExamineOrder,
  submitExamineOrder,
  checkExamineDepartmentOrder,
  updateExamineOrderByApprove,
  updateExamineOrderByReject,
  updateExamineOrderByDelete,
  updateExamineOrderByMarkPaid,
  updateExamineOrderByRecall,
  updateExamineOrderByClose,
  updataSupplementOpinion,
  deleteSupplementOpinion,
  fetchAssociatedAccount,
  fetchTravelApplicationLists,
  createBusinessTrip,
  updateBusinessTrip,
  fetchBusinessTrip,
  deleteAssociatedAccount,
  fetchCostApprovalThemeTag,
  fetchExpenseTakeLeaveDetail,
  getStaffMember,
} from '../../services/expense/examineOrder';

import {
  ExpenseExamineOrderProcessState,
  ExpenseTicketExistState,
  OaApplicationOrderType,
  ExpenseCostOrderBizType,
  ExpenseApprovalType,
} from '../../application/define';
import { RequestMeta, ResponseMeta, ApplicationOrderListItem, ApplicationOrderDetail } from '../../application/object/';
import { authorize } from '../../application';

export default {
  /**
  * 命名空间
  * @default
  */
  namespace: 'expenseExamineOrder',
  /**
   * 状态树
   * @prop {object} examineOrdersData 审批单列表
   * @prop {object} examineOrderDetail 审批单详情
   * @prop {object} borrowingOrderDetail 借款单详情
   * @prop {object} repaymentOrderDetail 还款单详情
   * @prop {object} travelApplicationLists 出差申请单列表
   */
  state: {
    // 审批单列表
    examineOrdersData: {},
    // 审批单详情
    examineOrderDetail: {},
    // 借款单详情
    borrowingOrderDetail: {},
    // 还款单详情
    repaymentOrderDetail: {},
    // 出差申请单列表
    travelApplicationLists: {},
    // 出差申请单
    businessTripData: {},
    // 请假管理详情
    takeLeaveDetail: {},
    // 人员列表
    staffMember: {},
    affairsReportOrderCount: 0, // 我待审批事务单数量
    affairsSubmitOrderCount: 0, // 我待提报事务单数量
    borrowingCount: 0, // 待审批借款单数量
    repaymentCount: 0, // 待审批还款单数量
  },
  /**
   * @namespace expense/examineOrder/effects
   */
  effects: {

    /**
     * 获取审批单列表
     * @param {string} applyAccountId  申请人id
     * @param {array}  flowAccountId   当前审批流已经手操作的人员账号列表
     * @param {array}  payload.currentPendingAccount 当前等待处理的人员账号列表
     * @param {array} examineFlowId   审批流id查询
     * @param {array} costCatalogScope  限定仅用于本审批流的费用分组类型id列表
     * @param {array} excludeCostCatalogScope  限定仅用于本审批流的费用分组类型id列表
     * @param {array} platforms    供应商
     * @param {array} suppliers    平台
     * @param {array} cities       城市
     * @param {array} districts    商圈
     * @param {number} template      默认模版
     * @param {string}  paidState       付款状态
     * @param {string} submitStartAt  提报日期 开始
     * @param {string} submitEndAt    提报日期 结束
     * @param {string} paidStartAt    付款日期 开始
     * @param {string} paidEndAt      付款日期 结束
     * @param {string} belongTime     归属周期
     * @param {number} approvalType   审批类型
     * @param {array}  tags    主题标签
     * @param {string} associatedId 关联id
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * fetchExamineOrders({ payload = {} }, { call, put }) {
      const { ticketTag = undefined, ticketState = undefined, existState = undefined, setLoading } = payload;
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };

      // 流程状态
      if (is.not.empty(payload.state) && is.existy(payload.state)) {
        params.state = is.not.array(payload.state) ? [Number(payload.state)] : payload.state;
      } else {
        params.state = [
          ExpenseExamineOrderProcessState.processing,  // 审批单流程状态 进行中
          ExpenseExamineOrderProcessState.finish,  // 审批单流程状态 完成
          ExpenseExamineOrderProcessState.close, // 审批单流程状态 关闭
        ];
      }

      // 审批单类型【成本审批流/非成本审批流/事务性审批流】,默认不传，服务器获取【成本审批流/非成本审批流】
      if (is.existy(payload.type) && is.not.empty(payload.type)) {
        params.biz_type = payload.type;
      }
      // 根据平台获取数据
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_codes = is.not.array(payload.platforms) ? [payload.platforms] : payload.platforms;
      }
      // 根据供应商获取数据
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_ids = is.not.array(payload.suppliers) ? [payload.suppliers] : payload.suppliers;
      }
      // 根据城市获取数据
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_codes = is.not.array(payload.cities) ? [payload.cities] : payload.cities;
      }
      // 根据商圈获取数据
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_ids = is.not.array(payload.districts) ? [payload.districts] : payload.districts;
      }

      // 申请人ID
      if (is.not.empty(payload.applyAccountId) && is.existy(payload.applyAccountId)) {
        params.apply_account_id = payload.applyAccountId;
      }

      // 实际申请人ID
      if (is.not.empty(payload.actualApplyAccountId) && is.existy(payload.actualApplyAccountId)) {
        params.actual_apply_account_id = payload.actualApplyAccountId;
      }

      // 当前审批流已经手操作的人员账号列表（包括审批和补充）
      if (is.not.empty(payload.flowAccountId) && is.existy(payload.flowAccountId)) {
        params.flow_accounts = [payload.flowAccountId];
      }

      // 当前等待处理的人员账号列表
      if (is.not.empty(payload.currentPendingAccount) && is.existy(payload.currentPendingAccount)) {
        params.current_pending_accounts = [payload.currentPendingAccount];
      }

      // 审批流id查询
      if (is.not.empty(payload.examineFlowId) && is.existy(payload.examineFlowId)) {
        params.flow_id = Array.isArray(payload.examineFlowId) ? payload.examineFlowId : [payload.examineFlowId];
      }

      // 付款状态
      if (is.not.empty(payload.paidState) && is.existy(payload.paidState)) {
        params.paid_state = [Number(payload.paidState)];
      }

      // 申请人
      if (is.not.empty(payload.applyAccountId) && is.existy(payload.applyAccountId)) {
        params.apply_account_id = payload.applyAccountId;
      }

      // 审批单id
      if (is.not.empty(payload.orderId) && is.existy(payload.orderId)) {
        // eslint-disable-next-line no-underscore-dangle
        params._id = payload.orderId;
      }

      // 提报日期 开始
      if (is.not.empty(payload.submitStartAt) && is.existy(payload.submitStartAt)) {
        params.submit_start_at = payload.submitStartAt;
      }

      // 提报日期 结束
      if (is.not.empty(payload.submitEndAt) && is.existy(payload.submitEndAt)) {
        params.submit_end_at = payload.submitEndAt;
      }

      // 付款日期 开始
      if (is.not.empty(payload.paidStartAt) && is.existy(payload.paidStartAt)) {
        params.paid_start_at = payload.paidStartAt;
      }

      // 付款日期 结束
      if (is.not.empty(payload.paidEndAt) && is.existy(payload.paidEndAt)) {
        params.paid_end_at = payload.paidEndAt;
      }

      // 归属周期
      if (is.not.empty(payload.belongTime) && is.existy(payload.belongTime)) {
        params.belong_time = Number(payload.belongTime);
      }

      // 审批单类型
      if (is.not.empty(payload.approvalType) && is.existy(payload.approvalType)) {
        params.application_order_type = payload.approvalType;
      }

      // 主题标签
      if (is.not.empty(payload.themeTags) && is.existy(payload.themeTags)) {
        params.theme_label_list = payload.themeTags;
      }

      // 关联id
      if (is.array(payload.associatedId) || (is.not.empty(payload.associatedId) && is.existy(payload.associatedId))) {
        params.relation_application_order_ids = is.not.array(payload.associatedId) ? [payload.associatedId] : payload.associatedId;
      }

      // 抄送
      if (is.not.empty(payload.cc_accounts) && is.existy(payload.cc_accounts)) {
        params.cc_accounts = payload.cc_accounts;
      }

      // 费用总金额
      if (is.not.empty(payload.totalMoney) && is.existy(payload.totalMoney)) {
        params.total_money = Number(payload.totalMoney) * 100;
      }

      // 是否筛选审批单列表，只能查看到当前人创建的&关联当前人的数据
      if (is.existy(payload.flag)) {
        params.flag = payload.flag;
      }

      ticketState && (params.inspect_bill_state = ticketState);
      ticketTag && (params.inspect_bill_label_ids = ticketTag);
      existState === ExpenseTicketExistState.have && (params.is_bill_label = true);
      existState === ExpenseTicketExistState.no && (params.is_bill_label = false);

      const result = yield call(fetchExamineOrders, params);

      setLoading && setLoading();

      if (is.existy(result.data)) {
        yield put({ type: 'reduceExamineOrders', payload: result });
      }
    },
    /**
     * 重置审批单列表
     * @todo 接口需升级优化
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * resetExamineOrders({ payload }, { put }) {
      yield put({ type: 'reduceExamineOrders', payload: {} });
    },

    /**
     * 获取审批单详情
     * @param {string}   id           审批单id
     * @param {function} onSuccessCallback  成功回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * fetchExamineOrderDetail({ payload = {} }, { call, put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('获取审批单详情错误，审批单id不能为空');
      }

      const params = {
        id: payload.id,
      };
      // 筛选审批单数据
      if (is.existy(payload.flag) && is.not.empty(payload.flag)) {
        params.flag = payload.flag;
      }
      const result = yield call(fetchPCExamineOrderDetail, params);

      // 错误信息
      if (result.zh_message) {
        // 失败回调
        if (payload.onFailureCallback) {
          payload.onFailureCallback(result);
        }
        return message.error(result.zh_message);
      }

      // 调用回调
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result);
      }

      const {
        application_order_type: orderType, // 审批单类型
        cost_order_list: costOrderList = [], // 费用申请单list
        plugin_extra_meta: pluginExtraMeta = {},
        oa_leave_order_info: oaLeaveOrderInfo = {}, // 请假
        oa_extra_work_order_info: oaExtraWorkOrderInfo = {}, // 加班
        biz_extra_house_contract_info: bizExtraHouseContractInfo = {}, // 房屋
      } = result;

      // 外部审批单字段
      let isPluginOrder = false;
      if (is.existy(pluginExtraMeta)) {
        isPluginOrder = pluginExtraMeta.is_plugin_order;
      }

      // 费用申请
      if (isPluginOrder && orderType === OaApplicationOrderType.cost) {
        // eslint-disable-next-line guard-for-of
        for (const i of costOrderList) {
          const { _id: id } = i;
          yield put({ type: 'expenseCostOrder/reduceNamespaceCostOrderDetail', payload: { data: i, namespace: id } });
        }
      }

      // 房屋
      if (isPluginOrder && orderType === OaApplicationOrderType.housing) {
        yield put({ type: 'expenseHouseContract/reduceHouseContractDetail', payload: bizExtraHouseContractInfo });
        // eslint-disable-next-line guard-for-of
        for (const i of costOrderList) {
          const { _id: id } = i;
          yield put({ type: 'expenseCostOrder/reduceNamespaceCostOrderDetail', payload: { data: i, namespace: id } });
        }
      }

      // 请假
      if (isPluginOrder && orderType === OaApplicationOrderType.takeLeave) {
        yield put({ type: 'expenseTakeLeave/reduceExpenseTakeLeaveDetail', payload: oaLeaveOrderInfo });
      }

      // 加班
      if (isPluginOrder && orderType === OaApplicationOrderType.overTime) {
        yield put({ type: 'expenseOverTime/reduceOverTimeDetail', payload: oaExtraWorkOrderInfo });
      }

      if (is.existy(result)) {
        yield put({ type: 'reduceExamineOrderDetail', payload: result });
      }
    },

    /**
     * 获取借款单详情
     * @param {string}   id           借款单id
     * @param {function} onSuccessCallback  成功回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * fetchBorrowingOrderDetail({ payload = {} }, { call, put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('获取借款单详情错误，借款单id不能为空');
      }

      const params = {
        id: payload.id,
      };
      const result = yield call(fetchBorrowingOrderDetail, params);
      // 错误信息
      if (result.zh_message) {
        // 失败回调
        if (payload.onFailureCallback) {
          payload.onFailureCallback(result);
        }
        return message.error(result.zh_message);
      }
      // 调用回调
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result);
      }

      if (is.existy(result)) {
        yield put({ type: 'reduceBorrowingOrderDetail', payload: result });
      }
    },

    /**
     * 获取请假管理详情
     * @param {string}   id           请假id
     * @param {function} onSuccessCallback  成功回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * fetchExpenseTakeLeaveDetail({ payload = {} }, { call, put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('获取借款单详情错误，借款单id不能为空');
      }

      const params = {
        id: payload.id,
      };
      const result = yield call(fetchExpenseTakeLeaveDetail, params);
      // 错误信息
      if (result.zh_message) {
        // 失败回调
        if (payload.onFailureCallback) {
          payload.onFailureCallback(result);
        }
        return message.error(result.zh_message);
      }
      // 调用回调
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result);
      }

      if (is.existy(result)) {
        yield put({ type: 'reduceExpenseTakeLeaveDetail', payload: result });
      }
    },
    /**
     * 获取还款单详情
     * @param {string}   id           还款单id
     * @param {function} onSuccessCallback  成功回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * fetchRepaymentOrderDetail({ payload = {} }, { call, put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('获取借款单详情错误，借款单id不能为空');
      }

      const params = {
        id: payload.id,
      };
      // 筛选审批单数据
      if (is.existy(payload.flag) && is.not.empty(payload.flag)) {
        params.flag = payload.flag;
      }
      const result = yield call(fetchRepaymentOrderDetail, params);
      // 错误信息
      if (result.zh_message) {
        // 失败回调
        if (payload.onFailureCallback) {
          payload.onFailureCallback(result);
        }
        return message.error(result.zh_message);
      }
      // 调用回调
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result);
      }

      if (is.existy(result)) {
        yield put({ type: 'reduceRepaymentOrderDetail', payload: result });
      }
    },

    /**
     * 获取出差申请单列表
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * fetchTravelApplicationLists({ payload }, { call, put }) {
      const params = {
        _meta: { page: 1, limit: 999 },
      };
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      // 报销状态
      if (is.existy(payload.bizState) && is.not.empty(payload.bizState)) {
        params.biz_state = payload.bizState;
      }
      // 当前账号id
      if (is.existy(payload.applyAccountId) && is.not.empty(payload.applyAccountId)) {
        params.apply_account_id = payload.applyAccountId;
      }
      const result = yield call(fetchTravelApplicationLists, params);
      // 判断数据是否存在
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceTravelApplicationLists', payload: result });
      }
    },

    /**
     * 获取出差申请单详情
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * fetchBusinessTrip({ payload = {} }, { call, put }) {
      const { costOrderId } = payload;
      if (is.empty(costOrderId) || is.not.existy(costOrderId)) {
        return message.error('请求错误，缺少出差申请单id');
      }
      const params = {
        travel_apply_order_id: costOrderId,
      };
      const result = yield call(fetchBusinessTrip, params);
      // 判断数据是否存在
      if (is.existy(result) && !result.zh_message) {
        yield put({ type: 'reduceBusinessTrip', payload: result });
      } else if (result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 创建出差申请单
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * createBusinessTrip({ payload = {} }, { call, put }) {
      const {
        applicationOrderId,   // 审批单id
        businessTraveler,     // 实际出差人姓名
        phone,                // 联系方式
        peer,                 // 同行人员姓名
        businessTripType,     // 出差类别
        businessTripWay,      // 出差方式（复选框无限制）
        departure,            // 出发地
        departureAddress,     // 出发地详细地址
        destination,          // 目的地
        destinationAddress,   // 目的地详细地址
        businessTripTime,     // 预计出差时间
        businessTripCountDay, // 出差天数（包括工作日）
        reason,               // 原由及说明
        arrangement,          // 工作安排
        onCreateSuccessCallBack,    // 请求成功回调
      } = payload;

      if (is.empty(applicationOrderId) || is.not.existy(applicationOrderId)) {
        return message.error('请求错误，审批单id不能为空');
      }
      if (is.empty(businessTraveler) || is.not.existy(businessTraveler)) {
        return message.error('请求错误，实际出差人姓名不能为空');
      }
      if (is.empty(businessTripType) || is.not.existy(businessTripType)) {
        return message.error('请求错误，出差类别不能为空');
      }
      if (is.empty(businessTripWay) || is.not.existy(businessTripWay)) {
        return message.error('请求错误，出差方式不能为空');
      }
      if (is.empty(businessTripTime) || is.not.existy(businessTripTime)) {
        return message.error('请求错误，预计出差时间不能为空');
      }

      const params = {
        apply_application_order_id: applicationOrderId,
        apply_user_name: businessTraveler,
        biz_type: businessTripType,
        transport_kind: businessTripWay,
        departure: { ...departure, detailed_address: departureAddress },
        destination: { ...destination, detailed_address: destinationAddress },
        expect_start_at: businessTripTime[0],
        expect_done_at: businessTripTime[1],
        expect_apply_days: businessTripCountDay,
      };

      if (is.not.empty(phone) && is.existy(phone)) {
        params.apply_user_phone = phone;
      }
      if (is.not.empty(peer) && is.existy(peer)) {
        params.together_user_names = peer;
      }
      if (is.not.empty(reason) && is.existy(reason)) {
        params.note = reason;
      }
      if (is.not.empty(arrangement) && is.existy(arrangement)) {
        params.working_plan = arrangement;
      }

      const result = yield call(createBusinessTrip, params);
      // 判断数据是否存在
      if (result.ok) {
        yield put({ type: 'reduceBusinessTrip', payload: result.record });
        onCreateSuccessCallBack && onCreateSuccessCallBack();
        return message.success('创建成功');
      } else if (result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 编辑出差申请单
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * updateBusinessTrip({ payload = {} }, { call }) {
      const {
        costOrderId,          // 审批单id
        businessTraveler,     // 实际出差人姓名
        phone,                // 联系方式
        peer,                 // 同行人员姓名
        businessTripType,     // 出差类别
        businessTripWay,      // 出差方式（复选框无限制）
        departure,            // 出发地
        departureAddress,     // 出发地详细地址
        destination,          // 目的地
        destinationAddress,   // 目的地详细地址
        businessTripTime,     // 预计出差时间
        businessTripCountDay, // 出差天数（包括周六日）
        reason,               // 原由及说明
        arrangement,          // 工作安排
        onSuccessCallBack,    // 请求成功回调
      } = payload;

      if (is.empty(costOrderId) || is.not.existy(costOrderId)) {
        return message.error('请求错误，申请单id不能为空');
      }
      if (is.empty(businessTraveler) || is.not.existy(businessTraveler)) {
        return message.error('请求错误，实际出差人姓名不能为空');
      }
      if (is.empty(businessTripType) || is.not.existy(businessTripType)) {
        return message.error('请求错误，出差类别不能为空');
      }
      if (is.empty(businessTripWay) || is.not.existy(businessTripWay)) {
        return message.error('请求错误，出差方式不能为空');
      }
      if (is.empty(businessTripTime) || is.not.existy(businessTripTime)) {
        return message.error('请求错误，预计出差时间不能为空');
      }

      const params = {
        travel_apply_order_id: costOrderId,
        apply_user_name: businessTraveler,
        biz_type: businessTripType,
        transport_kind: businessTripWay,
        departure: { ...departure, detailed_address: departureAddress },
        destination: { ...destination, detailed_address: destinationAddress },
        expect_start_at: businessTripTime[0],
        expect_done_at: businessTripTime[1],
        expect_apply_days: businessTripCountDay,
      };

      if (is.not.empty(phone) && is.existy(phone)) {
        params.apply_user_phone = phone;
      }
      if (is.not.empty(peer) && is.existy(peer)) {
        params.together_user_names = peer;
      }
      if (is.not.empty(reason) && is.existy(reason)) {
        params.note = reason;
      }
      if (is.not.empty(arrangement) && is.existy(arrangement)) {
        params.working_plan = arrangement;
      }
      const result = yield call(updateBusinessTrip, params);
      // 判断数据是否存在
      if (result.ok) {
        onSuccessCallBack && onSuccessCallBack();
        return message.success('编辑成功');
      } else if (result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 重置审批单详情
     * @todo 接口需升级优化
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * resetExamineOrderDetail({ payload }, { put }) {
      yield put({ type: 'reduceExamineOrderDetail', payload: {} });
    },

    /**
     * 创建审批单
     * @param {string}   examineFlowId      审批流id
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * createExamineOrder({ payload = {} }, { put }) {
      // 审批流id
      if (is.empty(payload.examineFlowId) || is.not.existy(payload.examineFlowId)) {
        return message.error('创建审批单错误，请选择审批流');
      }
      // 审批类型
      if (is.empty(payload.approvalType) || is.not.existy(payload.approvalType)) {
        return message.error('创建审批单错误，请选择审批类型 ');
      }

      // 请求参数
      const params = {
        flow_id: payload.examineFlowId,  // 审批流id
        application_order_type: payload.approvalType,  // 审批类型
      };
      // 如果红冲退款审批单号不为空且存在
      if (is.not.empty(payload.orderId) && is.existy(payload.orderId)) {
        params.application_order_id = payload.orderId;
      }
      // 如果红冲(20)和退款(10)的标识不为空且存在
      if (is.not.empty(payload.actionType) && is.existy(payload.actionType)) {
        params.action = payload.actionType;
      }
      // 业务请求
      const request = {
        params, // 接口参数
        service: createExamineOrder,  // 接口
        onVerifyCallback: result => is.existy(result) && is.not.empty(result),  // 数据校验
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 提交审批单
     * @param {string}   id                 审批单id
     * @param {string}   person             指派下一个审批人
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @param {Array}    postIds            指派下一个审批岗位
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * submitExamineOrder({ payload = {} }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('提交审批单错误，请填写审批单id');
      }
      // 请求参数
      const params = {
        id: payload.id,  // 审批单id
      };

      // 指派下一个审批人
      if (is.existy(payload.person) && is.not.empty(payload.person)) {
        params.next_node_account_id = payload.person;
      }

      // 指派审批岗位
      if (is.existy(payload.postIds) && is.not.empty(payload.postIds)) {
        params.next_node_post_id = payload.postIds;
      }

      // 红冲/退款类型
      if (is.existy(payload.action) && is.not.empty(payload.action)) {
        params.action = payload.action;
      }
      // 抄送信息 - 岗位
      if (is.existy(payload.copyGivedepartments) && is.not.empty(payload.copyGivedepartments)) {
        params.cc_department_ids = payload.copyGivedepartments.map(v => v._id);
      }
      // 抄送信息 - 用户
      if (is.existy(payload.copyGiveusers) && is.not.empty(payload.copyGiveusers)) {
        params.cc_account_ids = payload.copyGiveusers.map(v => v._id);
      }

      // 业务请求
      const request = {
        params, // 接口参数
        service: submitExamineOrder,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 校验部门审批单
     * @param {string}   id                 审批单id
     * @param {string}   person             指派下一个审批人
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @param {Array}    postIds            指派下一个审批岗位
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * checkExamineDepartmentOrder({ payload = {} }, { call }) {
      // 请求参数
      const params = {};

      // 审批单id
      if (is.existy(payload.orderId) && is.not.empty(payload.orderId)) {
        params.oa_application_order_id = payload.orderId;
      }

      // 部门/编制子类型
      if (is.existy(payload.subType) && is.not.empty(payload.subType)) {
        params.organization_sub_type = payload.subType;
      }

      // 当前父部门id
      if (is.existy(payload.targetParentDepartmentId) && is.not.empty(payload.targetParentDepartmentId)) {
        params.target_parent_department_id = payload.targetParentDepartmentId;
      }

      // 调整后的上级部门ID
      if (is.existy(payload.updateParentDepartmentId) && is.not.empty(payload.updateParentDepartmentId)) {
        params.update_parent_department_id = payload.updateParentDepartmentId;
      }

      // 调整部门ID
      if (is.existy(payload.departmentId) && is.not.empty(payload.departmentId)) {
        params.department_id = payload.departmentId;
      }

      // 岗位id
      if (is.existy(payload.jobId) && is.not.empty(payload.jobId)) {
        params.job_id = payload.jobId;
      }

      const result = yield call(checkExamineDepartmentOrder, params);
      if (result.ok === true) {
        // 成功回调
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      }
      if (result.ok === false) {
        // 成功回调
        if (payload.onFailureCallback) {
          payload.onFailureCallback(result);
        }
      }
    },

    /**
     * 审批通过
     * @param {string}   id                 审批单id
     * @param {string}   orderRecordId      审批流转记录ID
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * updateExamineOrderByApprove({ payload = {} }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('操作审批单错误，请填写审批单id');
      }
      if (is.empty(payload.orderRecordId) || is.not.existy(payload.orderRecordId)) {
        return message.error('操作审批单错误，请填写流转记录id');
      }

      // 请求参数
      const params = {
        order_id: payload.id, // 审批单id
        order_record_id: payload.orderRecordId,  // 审批流转记录ID
      };

      // 操作意见
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.note = payload.note;
      }
      // 付款明细
      if (is.existy(payload.payeeList) && is.not.empty(payload.payeeList)) {
        params.payee_list = payload.payeeList;
      }
      // 指派审批人
      if (is.existy(payload.person) && is.not.empty(payload.person)) {
        params.next_node_account_id = payload.person;
      }

      // 指派审批岗位
      if (is.existy(payload.postIds) && is.not.empty(payload.postIds)) {
        params.next_node_post_id = payload.postIds;
      }

      // 抄送信息 - 用户
      if (is.existy(payload.copyGiveusers) && is.not.empty(payload.copyGiveusers)) {
        params.cc_account_ids = payload.copyGiveusers.map(v => v._id);
      }

      // 抄送信息 - 岗位
      if (is.existy(payload.copyGivedepartments) && is.not.empty(payload.copyGivedepartments)) {
        params.cc_department_ids = payload.copyGivedepartments.map(v => v._id);
      }

      // 业务请求
      const request = {
        params, // 接口参数
        service: updateExamineOrderByApprove,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 审批驳回
     * @param {string}   id                 审批单id
     * @param {string}   orderRecordId      审批流转记录ID
     * @param {string}   rejectToNodeId  退回节点, 不指定则默认退回提报人
     * @param {string}   accountId        指派驳回的审批人
     * @param {string}   note             操作意见
     * @param {Array}    postIds            指派下一个审批岗位
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @param {Array}    postIds            指派下一个审批岗位
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * updateExamineOrderByReject({ payload = {} }, { call }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('操作审批单错误，请填写审批单id');
      }
      if (is.empty(payload.orderRecordId) || is.not.existy(payload.orderRecordId)) {
        return message.error('操作审批单错误，请填写流转记录id');
      }

      // 请求参数
      const params = {
        order_id: payload.id, // 审批单id
        order_record_id: payload.orderRecordId,  // 审批流转记录ID
      };

      // 退回节点, 不指定则默认退回提报人
      if (is.existy(payload.rejectToNodeId) && is.not.empty(payload.rejectToNodeId)) {
        params.reject_to_node_id = payload.rejectToNodeId;
      }

      // 指定驳回审批人, 不指定则默认该节点默认审批人
      if (is.existy(payload.accountId) && is.not.empty(payload.accountId)) {
        params.reject_to_account_id = payload.accountId;
      }

      // 指派审批岗位
      if (is.existy(payload.postIds) && is.not.empty(payload.postIds)) {
        params.reject_to_post_id = payload.postIds;
      }

      // 操作意见
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.note = payload.note;
      }

      // 抄送信息 - 用户
      if (is.existy(payload.copyGiveusers) && is.not.empty(payload.copyGiveusers)) {
        params.cc_account_ids = payload.copyGiveusers.map(v => v._id);
      }

      // 抄送信息 - 岗位
      if (is.existy(payload.copyGivedepartments) && is.not.empty(payload.copyGivedepartments)) {
        params.cc_department_ids = payload.copyGivedepartments.map(v => v._id);
      }

      // 业务请求
      const result = yield call(updateExamineOrderByReject, params);

      /**
       * 这里成功之后 返回的是ok字段
       */
      if (result.ok && payload.onSuccessCallback) {
        payload.onSuccessCallback();
      }
      /**
       * 特别注意：这个的错误消息被转换过 不需要写错误消息提示 并且zh_message转化为了message 切记
       */
      if (result.message && payload.onFailureCallback) {
        payload.onFailureCallback();
      }
    },

    /**
    * 标记付款
    * @param {string}   id                 审批单id
    * @param {string}   orderRecordId      审批流转记录ID
    * @param {string}   rejectToNodeId     退回节点, 不指定则默认退回提报人
    * @param {string}   note               操作意见
    * @param {number}   state              付款状态
    * @param {function} onSuccessCallback  成功回调
    * @param {function} onFailureCallback  失败回调
    * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
    */
    * updateExamineOrderByMarkPaid({ payload = {} }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('操作审批单错误，请填写审批单id');
      }
      if (is.empty(payload.orderRecordId) || is.not.existy(payload.orderRecordId)) {
        return message.error('操作审批单错误，请填写流转记录id');
      }

      // 请求参数
      const params = {
        order_id: payload.id,          // 审批单id
        order_record_id: payload.orderRecordId,  // 审批流转记录ID
      };

      // 操作意见
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.note = payload.note;
      }

      // 付款状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.paid_state = payload.state;
      }

      // 业务请求
      const request = {
        params, // 接口参数
        service: updateExamineOrderByMarkPaid,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 删除
     * @param {string}   id                 审批单id
     * @param {object}   searchParams          搜索的参数
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * deleteExamineOrder({ payload = {} }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('操作审批单错误，请填写审批单id');
      }
      // 请求参数
      const params = {
        id: payload.id,          // 审批单id
      };

      // 业务请求
      const request = {
        params, // 接口参数
        service: updateExamineOrderByDelete,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 审批单撤回
     * @param {string}   id                 审批单id
     * @param {object}   searchParams          搜索的参数
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * recallExamineOrder({ payload = {} }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('操作审批单错误，请填写审批单id');
      }
      // 请求参数
      const params = {
        order_id: payload.id,          // 审批单id
      };

      // 业务请求
      const request = {
        params, // 接口参数
        service: updateExamineOrderByRecall,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 审批单关闭
     * @param {string}   id                 审批单id
     * @param {object}   searchParams          搜索的参数
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * closeExamineOrder({ payload = {} }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('操作审批单错误，请填写审批单id');
      }
      // 请求参数
      const params = {
        order_id: payload.id,          // 审批单id
      };

      // 业务请求
      const request = {
        params, // 接口参数
        service: updateExamineOrderByClose,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 补充意见
     * @param {string}   id                 审批单id
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * updataSupplementOpinion({ payload = {} }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('操作审批单错误，请填写审批单id');
      }
      if (is.empty(payload.recordId) || is.not.existy(payload.recordId)) {
        return message.error('操作审批单错误，请填写流转记录id');
      }
      // 请求参数
      const params = {
        order_id: payload.id,          // 审批单id
        record_id: payload.recordId,  // 审批流转记录ID
        storage_type: 3, // 上传文件的类型
      };

      // 补充意见
      if (is.existy(payload.note) && is.not.empty(payload.note)) {
        params.content = payload.note;
      }

      // 上传文件
      if (is.existy(payload.fileList) && is.not.empty(payload.fileList)) {
        params.file_list = payload.fileList;
      }

      // 业务请求
      const request = {
        params, // 接口参数
        service: updataSupplementOpinion,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 删除补充意见
     * @param {string}   id                 审批单id
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * deleteSupplementOpinion({ payload = {} }, { put }) {
      // 请求参数
      const params = {};

      // 补充意见id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.id = payload.id;
      }

      // 业务请求
      const request = {
        params, // 接口参数
        service: deleteSupplementOpinion,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },
    /**
    * 审批单关联账号
    * @param {string}   associatedId 关联id
    * @param {string}   orderId 审批单id
    * @param {array}    themeTags 主题标签
    * @param {function} onSuccessCallback  成功回调
    * @param {function} onFailureCallback  失败回调
    * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
    */
    * updateAssociatedAccount({ payload = {} }, { put }) {
      // 请求参数
      const params = {};
      // 关联的审批单id
      if (is.existy(payload.params.associatedId) && is.not.empty(payload.params.associatedId)) {
        params.relation_application_order_id = payload.params.associatedId;
      }
      // 审批单id
      if (is.existy(payload.params.orderId) && is.not.empty(payload.params.orderId)) {
        // eslint-disable-next-line no-underscore-dangle
        params._id = payload.params.orderId;
      }
      // 业务请求
      const request = {
        params, // 接口参数
        service: fetchAssociatedAccount,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
    * 主题标签
    * @param {string}   orderId 审批单id
    * @param {array}    themeTags 主题标签
    * @param {function} onSuccessCallback  成功回调
    * @param {function} onFailureCallback  失败回调
    * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
    */
    * fetchCostApprovalThemeTag({ payload = {} }, { put }) {
      // 请求参数
      const params = {};
      // 审批单id
      if (is.existy(payload.params.orderId) && is.not.empty(payload.params.orderId)) {
        // eslint-disable-next-line no-underscore-dangle
        params._id = payload.params.orderId;
      }

      // 主题标签
      if (is.existy(payload.params.themeTags) && payload.params.themeTags !== undefined) {
        params.theme_label_list = payload.params.themeTags;
      }

      // 业务请求
      const request = {
        params, // 接口参数
        service: fetchCostApprovalThemeTag,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 删除关联审批单
     * @param {string}   associatedId 关联审批单id
     * @param {string}   id 审批单id
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    *deleteAssociatedAccount({ payload = {} }, { put }) {
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

      // 业务请求
      const request = {
        params, // 接口参数
        service: deleteAssociatedAccount,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取岗位下成员列表
     * @param {string} staffId 岗位id
     * @memberof module:model/organization/manage/staffs~organization/manage/staffs/effects
     */
    * getStaffMember({ payload = {} }, { call, put }) {
      const { staffId = undefined, page = 1, limit = 999, state } = payload;

      // 岗位id
      if (!is.existy(staffId) || is.empty(staffId)) {
        return message.error('缺少岗位id');
      }
      const params = {
        department_ids: [staffId],
        _meta: { page, limit },
        profile_type: 30,
      };

      if (state) {
        params.state = state;
      }

      const result = yield call(getStaffMember, params);
      if (is.existy(result)) {
        yield put({ type: 'reduceStaffMember', payload: result });
      }
    },
    /**
     * 重置岗位下成员列表
     */
    * resetStaffMember({ payload = {} }, { put }) {
      yield put({ type: 'reduceStaffMember', payload });
    },

    /**
     * 获取事务我待办审批单数量
     */
    *getAffairsOrderCount({ payload }, { call, put }) {
      const { tabKey, approveType } = payload;
      const params = {
        _meta: { page: 1, limit: 9999 },
        biz_type: ExpenseCostOrderBizType.transactional,
      };

      // 我待提报
      if (tabKey === ExpenseApprovalType.penddingSubmit) {
        params.apply_account_id = authorize.account.id;
        params.state = [ExpenseExamineOrderProcessState.pendding];
      }

      // 我待审批
      if (tabKey === ExpenseApprovalType.penddingVerify) {
        params.current_pending_accounts = [authorize.account.id];
        params.state = [ExpenseExamineOrderProcessState.processing];
        approveType && (params.application_order_type = approveType);
      }

      const res = yield call(fetchExamineOrders, params);

      if (res && res._meta) {
        yield put({ type: 'reduceOrderCount', payload: { ...res, tabKey, approveType } });
      }
    },
  },

  /**
    * @namespace expense/examineOrder/reducers
    */
  reducers: {
    /**
     * 审批单列表
     * @returns {object} 更新 examineOrdersData
     * @memberof module:model/expense/examineOrder~expense/examineOrder/reducers
     */
    reduceExamineOrders(state, action) {
      let examineOrdersData = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        examineOrdersData = {
          meta: ResponseMeta.mapper(action.payload._meta),
          data: ApplicationOrderListItem.mapperEach(action.payload.data, ApplicationOrderListItem),
        };
      }
      return { ...state, examineOrdersData };
    },

    /**
     * 审批单详情数据
     * @returns {object} 更新 examineOrderDetail
     * @memberof module:model/expense/examineOrder~expense/examineOrder/reducers
     */
    reduceExamineOrderDetail(state, action) {
      let examineOrderDetail = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        examineOrderDetail = ApplicationOrderDetail.mapper(action.payload, ApplicationOrderDetail);
      }
      return { ...state, examineOrderDetail };
    },

    /**
     * 借款单详情数据
     * @returns {object} 更新 borrowingOrderDetail
     * @memberof module:model/expense/examineOrder~expense/examineOrder/reducers
     */
    reduceBorrowingOrderDetail(state, action) {
      let borrowingOrderDetail = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        borrowingOrderDetail = action.payload;
      }
      return { ...state, borrowingOrderDetail };
    },

    /**
     * 还款单详情数据
     * @returns {object} 更新 repaymentOrderDetail
     * @memberof module:model/expense/examineOrder~expense/examineOrder/reducers
     */
    reduceRepaymentOrderDetail(state, action) {
      let repaymentOrderDetail = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        repaymentOrderDetail = action.payload;
      }
      return { ...state, repaymentOrderDetail };
    },

    /**
     * 出差申请单列表
     * @returns {object} 更新 travelApplicationLists
     * @memberof module:model/expense/examineOrder~expense/examineOrder/reducers
     */
    reduceTravelApplicationLists(state, action) {
      return {
        ...state,
        travelApplicationLists: action.payload,
      };
    },

    /**
     * 出差申请单详情
     * @returns {object} 更新 businessTripData
     * @memberof module:model/expense/examineOrder~expense/examineOrder/reducers
     */
    reduceBusinessTrip(state, action) {
      return {
        ...state,
        businessTripData: action.payload,
      };
    },
    /**
    * 请假管理详情
    * @returns {object} 更新 takeLeaveDetail
    * @memberof module:model/expense/examineOrder~expense/examineOrder/reducers
    */
    reduceExpenseTakeLeaveDetail(state, action) {
      return {
        ...state,
        takeLeaveDetail: action.payload,
      };
    },
    /**
     * 岗位下成员列表
     * @returns {object} 更新 staffList
     * @memberof module:model/organization/manage/staffs/deductions~organization/manage/staffs/reducers
     */
    reduceStaffMember(state, action) {
      let staffMember = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        staffMember = action.payload;
      }
      return { ...state, staffMember };
    },

    /**
     * 更新我待办审批单数量
     * @returns {object} 更新 affairsSubmitOrderCount
     * @returns {object} 更新 affairsReportOrderCount
     * @memberof module:model/code/order~code/order/reducers
     */
    reduceOrderCount(state, action) {
      let { affairsReportOrderCount, affairsSubmitOrderCount, borrowingCount, repaymentCount } = state;
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        const tabKey = dot.get(action, 'payload.tabKey');
        const approveType = dot.get(action, 'payload.approveType');
        // 待审批借款单
        tabKey === ExpenseApprovalType.penddingVerify && approveType === OaApplicationOrderType.borrowing && (
          borrowingCount = dot.get(action, 'payload._meta.result_count', 0)
        );
        // 待审批还款单
        tabKey === ExpenseApprovalType.penddingVerify && approveType === OaApplicationOrderType.repayments && (
          repaymentCount = dot.get(action, 'payload._meta.result_count', 0)
        );
        // 待审批
        tabKey === ExpenseApprovalType.penddingVerify && (
          affairsReportOrderCount = dot.get(action, 'payload._meta.result_count', 0)
        );
        // 待提报
        tabKey === ExpenseApprovalType.penddingSubmit && (
          affairsSubmitOrderCount = dot.get(action, 'payload._meta.result_count', 0)
        );
      }
      return { ...state, affairsReportOrderCount, affairsSubmitOrderCount, borrowingCount, repaymentCount };
    },
  },
};
