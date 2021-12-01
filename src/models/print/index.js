/**
 * 审批单打印
 * @module model/print/index
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';

import { fetchExamineOrderDetail } from '../../services/expense/examineOrder';
import { fetchAmountSummary, fetchCostOrders, fetchSubmitSummary } from '../../services/expense/costOrder';
import { fetchHouseContractDetail } from '../../services/expense/houseContract';
import { getOverTimeDetail } from '../../services/expense/overTime';
import { fetchExpenseTakeLeaveDetail } from '../../services/expense/takeLeave';

import { ExpenseCostCenterType, ExpenseCostOrderState, ExpenseExamineOrderProcessState, OaApplicationOrderType } from '../../application/define';

import { CostBookMonthbrief, CostOrderSubmitBrief, RequestMeta } from '../../application/object';


const arrayPrint = [];
// 根据类型返回成本归属id
function getCostTargetId(costCenter, value) {
  const {
    staff_info: staffInfo = {},
    team_id: teamId,
  } = value;
  if (costCenter === ExpenseCostCenterType.project) return value.platform_code;
  if (costCenter === ExpenseCostCenterType.headquarter) return value.supplier_id;
  if (costCenter === ExpenseCostCenterType.city) return value.city_code;
  if (costCenter === ExpenseCostCenterType.district) return value.biz_district_id;
  if (costCenter === ExpenseCostCenterType.knight) return value.biz_district_id;
  if (costCenter === ExpenseCostCenterType.team) return teamId;
  if (costCenter === ExpenseCostCenterType.person) return staffInfo.identity_card_id;
  if (costCenter === ExpenseCostCenterType.asset) return value.biz_district_id;
}

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'printData',

  /**
   * 状态树
   */
  state: [],
  /**
   * @namespace print/index/reducers
   */
  reducers: {
    /**
     * 获取审批单打印内容
     * @return {array} 更新 state
     * @memberof module:model/print/index~print/index/reducers
     */
    reduceOrderDetail(state, { payload }) {
      let detailObj = {};
      detailObj = payload;
      arrayPrint.push(detailObj);
      return [...arrayPrint];
    },
  },

  /**
   * @namespace print/index/effects
   */
  effects: {
    /**
     * 获取审批单打印内容
     * @param {object} examineOrder   审批单
     * @param {array} costOrder       费用单列表
     * @param {object} houseDetail     房屋详情
     * @param {array} houseCostOrders 房屋费用申请记录列表
     * @memberof module:model/print/index~print/index/effects
     */
    * fetchOrderDetail({ payload = {} }, { call, put }) {
      const params = {
        id: payload.id,
      };
      let houseCostOrders;    //  房屋费用申请记录列表
      let houseDetail;        //  房屋详情
      let amountSummaryMap;   //  每一个费用单的已付款金额
      let submitSummaryMap;   //  每一个费用单的提报金额
      let overTimeDetail; // 加班
      let takeLeaveDetail; // 请假
      const examineOrder = yield call(fetchExamineOrderDetail, params);
      const costOrder = yield put.resolve({ type: 'fetchOrdersCard', payload: { examineOrderId: params.id } });
      const houseId = examineOrder.biz_extra_house_contract_id;

      // 加班
      const overTimeId = examineOrder.extra_work_or_leave_id;
      // 审批类型
      const type = examineOrder.application_order_type;

      // 请假id
      const takeLeaveId = examineOrder.extra_work_or_leave_id;
      if (takeLeaveId && OaApplicationOrderType.takeLeave === type) {
        takeLeaveDetail = yield call(fetchExpenseTakeLeaveDetail, { apply_order_id: overTimeId }); // 请假单
      }

      // 加班
      if (overTimeId && OaApplicationOrderType.overTime === type) {
        overTimeDetail = yield call(getOverTimeDetail, { apply_order_id: overTimeId });
      }

      if (houseId) {
        houseDetail = yield call(fetchHouseContractDetail, { id: houseId });
        houseCostOrders = yield put.resolve({ type: 'fetchHouseOrders', payload: { bizExtraHouseContractId: houseId, limit: 9999 } });
      }
      // 循环每个费用单
      for (let i = 0; i < costOrder.length; i += 1) {
        // 已付款金额参数
        const {
          cost_allocation_list: costAllocationList,
          cost_center_type: costCenterType,
          cost_accounting_id: costAccountingId,
          application_order_id: applicationOrderId,
        } = costOrder[i];
        const { submit_at: submitAt } = examineOrder;

        // 循环费用单的成本分摊获得对应的已付款金额与提报金额
        for (let j = 0; j < costAllocationList.length; j += 1) {
          const paramsAmountSummary = {
            costCenter: costCenterType,
            costTargetId: getCostTargetId(costCenterType, costAllocationList[j]),
            subjectId: costAccountingId,
            applicationOrderId,
            submitAt,
          };
          const v = costAllocationList[j];
          const {
            staff_info: staffInfo = {},
          } = v;
          // 提报金额参数
          const SubmitSummaryParams = {
            cost_center: costCenterType,
            application_order_id: applicationOrderId,               // 审批单id
            accounting_id: costAccountingId,   // 科目id
            cost_target_id: getCostTargetId(costCenterType, v),                     // 成本归属id
            platform_code: v.platform_code,           // 平台
            supplier_id: v.supplier_id,               // 供应商
            city_code: v.city_code,                   // 城市
            biz_district_id: v.biz_district_id,          // 商圈
            submit_at: submitAt,
            team_id: v.team_id,
            identity_card_id: staffInfo.identity_card_id,
            assets_id: v.assets_id,                       // 私教团队管理
          };
          amountSummaryMap = yield put.resolve({ type: 'fetchAmountSummaryEffect', payload: paramsAmountSummary });
          costAllocationList[j].costOrderAmountSummary = amountSummaryMap;
          submitSummaryMap = yield put.resolve({ type: 'fetchSubmitSummaryEffect', payload: SubmitSummaryParams });
          costAllocationList[j].costOrderSubmitSummary = submitSummaryMap;
        }
      }
      // examineOrder, costOrder, houseDetail, houseCostOrders 为一个审批单的详情的所有信息
      yield put({ type: 'reduceOrderDetail', payload: { examineOrder, costOrder, houseDetail, houseCostOrders, overTimeDetail, takeLeaveDetail } });
    },
    /**
     * 获取费用单详情
     * @param {object} examineOrderId   费用单id
     * @param {array} platforms   平台数据
     * @param {array} suppliers  供应商数据
     * @param {array} cities   城市数据
     * @param {array} districts   商圈数据
     * @param {string} applyAccountId   申请人id
     * @param {array} flowAccountId   当前审批流已经手操作的人员账号列表（包括审批和补充）
     * @param {array} currentPendingAccount   当前等待处理的人员账号列表
     * @param {array} examineFlowId   审批流id查询
     * @param {string} paidState   付款状态
     * @param {string} orderId   审批单子id
     * @param {string} submitStartAt   提报日期开始
     * @param {string} submitEndAt   提报日期结束
     * @param {string} paidStartAt   付款日期开始
     * @param {string} paidEndAt   付款日期结束
     * @param {string} belongTime   归属周期
     * @memberof module:model/print/index~print/index/effects
     */
    * fetchOrdersCard({ payload = {} }, { call }) {
        // 请求列表的meta信息
      const params = {
            // _meta: RequestMeta.mapper(payload),
      };
      if (is.existy(payload.examineOrderId) && is.not.empty(payload.examineOrderId)) {
        params.application_order_id = payload.examineOrderId;
      }
        // 流程状态
      if (is.not.empty(payload.state) && is.existy(payload.state)) {
        params.state = is.not.array(payload.state) ? [Number(payload.state)] : payload.state;
      } else {
        params.state = [
          ExpenseExamineOrderProcessState.processing,  // 审批单流程状态 进行中
          ExpenseExamineOrderProcessState.finish,  // 审批单流程状态 完成
          ExpenseExamineOrderProcessState.close, // 审批单流程状态 关闭
          ExpenseCostOrderState.pendding,
        ];
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
        params.flow_id = [payload.examineFlowId];
      }

        // 付款状态
      if (is.not.empty(payload.paidState) && is.existy(payload.paidState)) {
        params.paid_state = [Number(payload.paidState)];
      }

        // 申请人
      if (is.not.empty(payload.applyAccountId) && is.existy(payload.applyAccountId)) {
        params.apply_account_id = payload.applyAccountId;
      }

        // 审批单子id
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
      const result = yield call(fetchCostOrders, params);
      if (is.existy(result.data)) {
        return result.data;
      }
    },
    /**
     * 获取房屋费用申请记录表
     * @param {object} meta 页码、条数
     * @param {string} examineOrderId   审批单id
     * @param {array} platforms   平台数据
     * @param {array} suppliers  供应商数据
     * @param {array} cities   城市数据
     * @param {array} districts   商圈数据
     * @param {string} payload.type 费用分组
     * @param {string} subjects 科目
     * @param {string} approval 费用单号
     * @param {string} attribution 归属周期
     * @param {string} bizExtraHouseContractId 合同id
     * @memberof module:model/print/index~print/index/effects
     */
    * fetchHouseOrders({ payload = {} }, { call }) {
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      // 审批单id
      if (is.existy(payload.examineOrderId) && is.not.empty(payload.examineOrderId)) {
        params.application_order_id = payload.examineOrderId;
      }

      // 费用单状态（默认状态中不包含已删除数据）
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = [Number(payload.state)];
      } else {
        params.state = [ExpenseCostOrderState.pendding, ExpenseCostOrderState.processing, ExpenseCostOrderState.done, ExpenseCostOrderState.close];
      }
      // 根据供应商获取数据
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_ids = payload.suppliers;
      }
      // 根据城市获取数据
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_codes = payload.cities;
      }
      // 根据平台获取数据
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_codes = payload.platforms;
      }
      // 根据商圈获取数据
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_ids = payload.districts;
      }
      // 根据费用分组获取数据
      if (is.existy(payload.type) && is.not.empty(payload.type)) {
        params.cost_group_id = payload.type;
      }
      // 根据科目获取数据
      if (is.existy(payload.subjects) && is.not.empty(payload.subjects)) {
        params.cost_accounting_id = payload.subjects;
      }
      // 根据审批单号获取数据
      if (is.existy(payload.approval) && is.not.empty(payload.approval)) {
        params.application_order_id = payload.approval;
      }
      // 根据费用单号获取数据
      if (is.existy(payload.cost) && is.not.empty(payload.cost)) {
        params._id = payload.cost;
      }
      // 根据归属周期获取数据
      if (is.existy(payload.attribution) && is.not.empty(payload.attribution)) {
        params.belong_time = Number(payload.attribution);
      }
      // 合同id
      if (is.existy(payload.bizExtraHouseContractId) && is.not.empty(payload.bizExtraHouseContractId)) {
        params.biz_extra_house_contract_id = [payload.bizExtraHouseContractId];
      }
      const result = yield call(fetchCostOrders, params);
      if (is.existy(result.data)) {
        return result.data;
      }
    },
    /**
     * 获取费用金额汇总
     * @param {string} subjectId 科目id
     * @param {string} costTargetId 归属对象id
     * @param {string} applicationOrderId 申请单id
     * @param {string} costCenter 归属中心
     * @param {string} submitAt 提报时间
     * @memberof module:model/print/index~print/index/effects
     */
    * fetchAmountSummaryEffect({ payload = {} }, { call, put, select }) {
      const {
        subjectId,
        costTargetId,
        applicationOrderId,
        costCenter,
        submitAt,
      } = payload;
      const params = {};

      // subjectId required
      if (is.existy(subjectId) && is.not.empty(subjectId)) {
        params.accounting_id = subjectId;
      } else {
        // message.error('缺少科目ID');
        return;
      }

      // costTargetId required
      if (is.existy(costTargetId) && is.not.empty(costTargetId)) {
        params.cost_target_id = String(costTargetId);
      } else {
        // message.error('缺少归属对象ID');
        return;
      }

      // costCenter required
      if (is.existy(costCenter) && is.not.empty(costCenter)) {
        params.cost_center_type = Number(costCenter);
      } else {
        // message.error('缺少归属对象ID');
        return;
      }

      // application order id required
      if (is.not.existy(applicationOrderId) || is.empty(applicationOrderId)) {
        return;
      }

      // 定义提报时间
      let firstCreatedTime;

      // 判断提报时间是否传入，如果传入，直接使用；如果没有，则需要调用审批单详情获取
      if (is.existy(submitAt) && is.not.empty(submitAt)) {
        firstCreatedTime = submitAt;
      } else {
        yield put.resolve({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: applicationOrderId } });
        const examineOrderDetail = yield select(state => state.expenseExamineOrder.examineOrderDetail);
        firstCreatedTime = dot.get(examineOrderDetail, 'submitAt', undefined);
      }

      // bookMonth required int:YYYYMM
      if (firstCreatedTime) {
        params.book_month = Number(moment(firstCreatedTime).format('YYYYMM'));
      } else {
        params.book_month = Number(moment().format('YYYYMM'));
      }

      // request server
      const result = yield call(fetchAmountSummary, params);

      // dispatch reducer
      if (is.existy(result) && is.not.empty(result)) {
        return CostBookMonthbrief.mapper(result, CostBookMonthbrief);
      }
    },
    /**
     * 获取已提报金额汇总
     * @param {string} costTargetId 归属对象id
     * @param {string} platformCode 平台id
     * @param {string} supplierId 供应商id
     * @param {string} cityCode 城市id
     * @param {string} bizDistrictId 商圈id
     * @param {string} applicationOrderId 申请单id
     * @param {string} submitAt 提报时间
     * @memberof module:model/print/index~print/index/effects
     */
    * fetchSubmitSummaryEffect({ payload = {} }, { call, put, select }) {
      const {
        cost_center: costCenter,
        application_order_id: applicationOrderId,
        accounting_id: accountingId,
        cost_target_id: costTargetId,
        platform_code: platformCode,
        supplier_id: supplierId,
        city_code: cityCode,
        biz_district_id: bizDistrictId,
        submit_time: submitTime,
        team_id: teamId,
        assets_id: assetsId,
      } = payload;
      const params = {};
      // costTargetId required
      if (is.existy(costTargetId) && is.not.empty(costTargetId)) {
        params.cost_target_id = costTargetId;
      } else {
        // 如果没有成本归属中心，则return
        return;
      }

      // costCenter required
      if (is.existy(costCenter) && is.not.empty(costCenter)) {
        params.cost_center_type = Number(costCenter);
      } else {
        // message.error('缺少归属对象ID');
        return;
      }

      // accounting_id required
      if (is.existy(accountingId) && is.not.empty(accountingId)) {
        params.accounting_id = accountingId;
      } else {
        return;
      }

       // 团队id
      if (is.existy(teamId) && is.not.empty(teamId)) {
        params.team_id = teamId;
      }
      // 资产id
      if (is.existy(assetsId) && is.not.empty(assetsId)) {
        params.assets_id = assetsId;
      }

      // 平台id
      if (is.existy(platformCode) && is.not.empty(platformCode)) {
        params.platform_code = platformCode;
      }

      // 供应商id
      if (is.existy(supplierId) && is.not.empty(supplierId)) {
        params.supplier_id = supplierId;
      }

      // 城市id
      if (is.existy(cityCode) && is.not.empty(cityCode)) {
        params.city_code = cityCode;
      }

      // 商圈id
      if (is.existy(bizDistrictId) && is.not.empty(bizDistrictId)) {
        params.biz_district_id = bizDistrictId;
      }
      // application order id required
      if (is.not.existy(applicationOrderId) || is.empty(applicationOrderId)) {
        return;
      }

      // 定义提报时间
      let firstCreatedTime;

      // 提报时间 required(如果有值直接使用，否则需要获取)
      if (is.existy(submitTime) && is.not.empty(submitTime)) {
        firstCreatedTime = submitTime;
      } else {
        yield put.resolve({ type: 'expenseExamineOrder/fetchExamineOrderDetail', payload: { id: applicationOrderId } });
        const examineOrderDetail = yield select(state => state.expenseExamineOrder.examineOrderDetail);
        firstCreatedTime = dot.get(examineOrderDetail, 'submitAt', undefined);
      }
      // bookMonth required int:YYYYMM
      if (firstCreatedTime) {
        params.submit_at = moment(firstCreatedTime).format('YYYY-MM-DD');
      } else {
        params.submit_at = moment().format('YYYY-MM-DD');
      }
      // request server
      const result = yield call(fetchSubmitSummary, params);
      // dispatch reducer
      if (is.existy(result) && is.not.empty(result)) {
        return CostOrderSubmitBrief.mapper(result, CostOrderSubmitBrief);
      }
    },
  },
};
