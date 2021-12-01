/**
 * 审批流设置
 * @module model/expense/examineFlow
 **/
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';

import {
  fetchExamineFlows,
  updateExamineFlowState,
  deleteExamineFlow,
  updateExamineFlowNode,
  deleteExamineFlowNode,
  updateExamineFlow,
  createExamineFlowNode,
  createExamineFlow,
  fetchExamineDetail,
  fetchExamineFlowConfig,
  updateExamineFlowConfig,
  updateSalaryPlanConfig,
  fetchSalaryPlanConfig,
  fetchSalaryDistribute,
  updateSalaryDistribute,
  fetchExaminePost,
  createPost,
  updatePost,
  managementPost,
  enableAndDisablePost,
  setApplicationNodeCC,
  fetchContractType,
  fetchContractChildType,
  getNewExamineFlows,
  fetchExamineFlowsApplyFind,
} from '../../services/expense';

import {
  RequestMeta,
  ResponseMeta,
  ApplicationFlowTemplateDetail,
  ApplicationFlowNodeBrief,
} from '../../application/object/';
import {
  OaApplicationFlowTemplateState,
  ExpenseCostOrderBizType,
  AffairsFlowCooperationSpecify,
  AffairsFlowCooperationPerson,
  OaApplicationFlowTemplateApproveMode,
  AffairsFlowSpecifyApplyType,
} from '../../application/define';

// 事务性审批流节点设置按汇报关系获取organization_approve_type
const affairsReportValue = [
  { reportOne: 1, reportTwo: 1, value: AffairsFlowCooperationSpecify.actualPerson },
  { reportOne: 1, reportTwo: 2, value: AffairsFlowCooperationSpecify.actualPersonT },
  { reportOne: 2, reportTwo: 1, value: AffairsFlowCooperationSpecify.supPerson },
  { reportOne: 2, reportTwo: 2, value: AffairsFlowCooperationSpecify.supPersonT },
];

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'expenseExamineFlow',
  /**
   * 状态树
   * @prop {object} examineList 审批流列表
   * @prop {array} examineName 申请人名字
   * @prop {array} examineTree 申请人名字树
   * @prop {array} storeExamineTree 保存搜索之前
   * @prop {object} salaryPlanConfig 审批流配置数据 - 服务费发放
   * @prop {object} examineDetail     审批流详情
   * @prop {object} examineFlowConfig 审批流配置数据 - 服务费方案
   * @prop {object} salaryDistribute 审批流配置数据 - 服务费发放
   * @prop {object} examineFlowDetail 审批流数据(使用命名空间隔离数据，防止相同组件的数据影响)
   * @prop {object} examinePostData 审批岗位列表信息
   */
  state: {
    // 审批流列表
    examineList: {},
    // 审批流列表
    newOaExamineList: {},
    // 申请人名字
    examineName: [],
    // 申请人名字树
    examineTree: [],
    // 保存搜索之前
    storeExamineTree: [],
    // 审批流详情
    examineDetail: {},
    // 审批流设置数据
    examineFlowConfig: {},
    // 审批流配置数据 - 服务费方案
    salaryPlanConfig: {},
    // 审批流配置数据 - 服务费发放
    salaryDistribute: {},
    // 审批流数据(使用命名空间隔离数据，防止相同组件的数据影响)
    examineFlowDetail: {},
    // 审批岗位列表信息
    examinePostData: {
      data: [],
      _meta: {},
    },
    // 合同类型数据
    contractTypeData: {},
    // 合同子类型
    contractChildTypeData: {},
    // 类型： 工作交接/部门招聘 新的审批流接口
    examineApplayList: [],
  },
  /**
   * @namespace expense/examineFlow/effects
   */
  effects: {

    /**
     *
     * @param {合同子类型}
     * @returns
     */
    *fetchContractChildType({ payload }, { call, put }) {
      const res = yield call(fetchContractChildType, payload);
      if (is.existy(res) && is.not.empty(res)) {
        yield put({ type: 'reduceContractChildTypeSuccess', payload: { contractChildTypeData: res } });
      }
    },
    /**
     *
     * @param {合同类型}
     * @returns
     */
    *fetchContractType({ payload }, { call, put }) {
      const res = yield call(fetchContractType, payload);
      if (is.existy(res) && is.not.empty(res)) {
        yield put({ type: 'reduceContractTypeSuccess', payload: { contractTypeData: res } });
      }
    },
    /**
     * 获取审批流列表
     * @param {number}  bizType        业务成本类型
     * @param {number}  platformCodes  状态
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * fetchExamineFlows({ payload }, { call, put }) {
      const {
        isNewInterface = true, // 是否为新接口
        isNewOaReduce = false, // 新的reduce
      } = payload;

      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
        state: [ // 默认展示不删除的数据
          OaApplicationFlowTemplateState.normal,
          OaApplicationFlowTemplateState.disable,
          OaApplicationFlowTemplateState.draft,
        ],
      };
      // 状态
      if (is.not.empty(payload.state) && is.existy(payload.state)) {
        // 判断是否是全部
        if (payload.state === '*') {
          params.state = [ // 默认展示不删除的数据
            OaApplicationFlowTemplateState.normal,
            OaApplicationFlowTemplateState.disable,
            OaApplicationFlowTemplateState.draft,
          ];
        } else {
          params.state = [Number(payload.state)];
        }
      }
      // 平台codes
      if (is.existy(payload.platformCodes) && is.not.empty(payload.platformCodes)) {
        params.platform_codes = Array.isArray(payload.platformCodes) ? payload.platformCodes : [payload.platformCodes];
      }
      // 业务类型 成本或非成本
      if (is.not.empty(payload.bizType) && is.existy(payload.bizType)) {
        params.biz_type = Array.isArray(payload.bizType) ? payload.bizType : [payload.bizType];
      }
      // 费用分组id
      if (is.not.empty(payload.expenseTypeIds) && is.existy(payload.expenseTypeIds)) {
        params.cost_catalog_scope = payload.expenseTypeIds;
      }

      // 审批单类型
      if (is.existy(payload.pageType) && is.not.empty(payload.pageType)) {
        params.apply_application_types = [payload.pageType];
      }

      // 部门id
      if (is.existy(payload.departmentId) && is.not.empty(payload.departmentId)) {
        params.apply_department_id = payload.departmentId;
      }

      // 职级
      if (is.existy(payload.rankName) && is.not.empty(payload.rankName)) {
        params.apply_rank = payload.rankName;
      }

      // 请假时长
      if (is.existy(payload.leaveDayType) && is.not.empty(payload.leaveDayType)) {
        params.leave_day_type = payload.leaveDayType;
      }

      // 证照借用
      if (is.existy(payload.borrowType) && is.not.empty(payload.borrowType)) {
        params.display_type = Number(payload.borrowType);
      }

      // 借阅类型
      if (is.existy(payload.contractBorrowType) && is.not.empty(payload.contractBorrowType)) {
        params.pact_borrow_type = payload.contractBorrowType;
      }

      // 适用类型
      if (is.existy(payload.approvalType) && is.not.empty(payload.approvalType)) {
        params.apply_application_types = [payload.approvalType];
      }
      // 印章类型
      payload.sealType && (params.seal_type = payload.sealType);
      // 盖章类型
      payload.stampType && (params.stamp_type = Number(payload.stampType));
       // 合同类型
      payload.pact_apply_types && (params.pact_apply_type = Number(payload.pact_apply_types));
      // 合同子类型
      payload.pact_sub_types && (params.pact_sub_type = Number(payload.pact_sub_types));
      // 适用场景
      if (is.existy(payload.scense) && is.not.empty(payload.scense)) {
        params.industry_codes = [payload.scense];
      }

      // 审批流名称
      payload.name && (params.name = payload.name);

      // 适用部门
      Array.isArray(payload.applianceDepartmentId) && payload.applianceDepartmentId.length > 0 && (
        params.apply_department_ids = payload.applianceDepartmentId
      );

      // 节点审批岗位（成本或非成本）
      Array.isArray(payload.postIds) && payload.postIds.length > 0 && (
        params.post_ids = payload.postIds
      );

      // 节点审批岗位（事务性）
      Array.isArray(payload.approveDepartmentJobIds) && payload.approveDepartmentJobIds.length > 0 && payload.nodeApproalType === AffairsFlowSpecifyApplyType.post && (
        params.approve_department_job_ids = payload.approveDepartmentJobIds
      );

      // 节点审批部门（事务性）
      Array.isArray(payload.approveDepartmentIds) && payload.approveDepartmentIds.length > 0 && payload.nodeApproalType === AffairsFlowSpecifyApplyType.principal && (
        params.approve_department_ids = payload.approveDepartmentIds
      );

      // 可见部门
      Array.isArray(payload.viewDepartmentId) && payload.viewDepartmentId.length > 0 && (
        params.view_department_ids = payload.viewDepartmentId
      );

      // 节点审批类型
      payload.nodeApproalType &&
        ((Array.isArray(payload.bizType) && payload.bizType.includes(ExpenseCostOrderBizType.transactional)) || (!Array.isArray(payload.bizType) && payload.bizType === ExpenseCostOrderBizType.transactional)) &&
        (params.approve_department_account_type = payload.nodeApproalType);

      const result = isNewInterface ?
        yield call(getNewExamineFlows, params)
        : yield call(fetchExamineFlows, params);
      if (is.not.existy(result) || is.empty(result)) {
        // 失败回调
        if (payload.onFailureCallback()) {
          payload.onFailureCallback();
        }
      }
      if (isNewOaReduce) {
        // 命名空间
        yield put({ type: 'reduceNewExamineFlows', payload: result });
      }
      // 命名空间
      yield put({ type: 'reduceExamineFlows', payload: result });
      // 成功回调
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result);
      }
    },
    /**
     *类型： 工作交接/部门招聘/资金调拨 新的审批流接口
     */
    * fetchExamineFlowsApplyFind({ payload = {} }, { call, put }) {
      const params = {};
      // 部门id
      if (is.existy(payload.departmentId) && is.not.empty(payload.departmentId)) {
        params.apply_department_id = payload.departmentId;
      }
      // 审批单类型
      if (is.existy(payload.pageType) && is.not.empty(payload.pageType)) {
        params.apply_application_type = payload.pageType;
      }
      // 适用类型
      if (is.existy(payload.approvalType) && is.not.empty(payload.approvalType)) {
        params.apply_application_type = [payload.approvalType];
      }
      // 岗位
      if (is.existy(payload.applyJobId) && is.not.empty(payload.applyJobId)) {
        params.apply_job_id = payload.applyJobId;
      }

      const result = yield call(fetchExamineFlowsApplyFind, params);
      if (is.not.existy(result.data) || is.empty(result.data) || is.empty(result.data[0] || is.empty(result.data[0].flow_template_records))) {
        // 失败回调
        if (payload.onNewFailureCallback) {
          payload.onNewFailureCallback();
        }
        return;
      }

      // 命名空间
      yield put({ type: 'reduceExamineFlowsApplayFind', payload: result });
      // 成功回调
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result.data[0]);
      }
    },

    /**
     * 获取审批流详情
     * @param {string}  id       审批单id
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * fetchExamineDetail({ payload }, { call, put }) {
      // 审批单id
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('无法获取审批流详情，审批流id不能为空');
      }
      const { orderId } = payload;
      const params = {
        id: payload.id, // 审批流id
      };

      orderId && (params.order_id = orderId);

      const result = yield call(fetchExamineDetail, params);
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceExamineDetail', payload: result });
      }

      // 事务性审批流
      if (result
        && result.biz_type
        && result.biz_type === ExpenseCostOrderBizType.transactional) {
        yield put({ type: 'reduceAffairsFlowNodeList', payload: result });
      }
    },

    /**
     * 获取审批流详情 oa
     * @param {string}  id       审批单id
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * getExamineDetail({ payload }, { call }) {
      // 审批单id
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('无法获取审批流详情，审批流id不能为空');
      }
      const params = {
        id: payload.id, // 审批流id
      };
      const result = yield call(fetchExamineDetail, params);
      // eslint-disable-next-line no-underscore-dangle
      if (result && result._id) {
        return result;
      }
    },

    /**
     * 新建审批流
     * @param {string}   name      审批流名称
     * @param {string}   bizType   业务分类
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * createExamineFlow({ payload }, { put }) {
      if (is.not.existy(payload.name) || is.empty(payload.name)) {
        return message.error('审批流名称不能为空');
      }
      if (is.not.existy(payload.bizType) || is.empty(payload.bizType)) {
        return message.error('业务分类参数不能为空');
      }
      const params = {
        record: {
          name: payload.name,
          biz_type: payload.bizType,
        },
      };
      // 业务请求
      const request = {
        params, // 接口参数
        service: createExamineFlow,  // 接口
        onVerifyCallback: result => is.existy(result) && is.not.empty(result),
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 编辑审批流
     * @param {string}   id        审批单id
     * @param {string}   name      审批流名称
     * @param {string}   bizType   业务分类
     * @param {string}   note      说明
     * @param {array} costCatalogScope  限定仅用于本审批流的费用分组类型id列表
     * @param {array} excludeCostCatalogScope  限定仅用于本审批流的费用分组类型id列表
     * @param {array} supplierIds    供应商
     * @param {array} platformCodes  平台
     * @param {array} cityCodes      城市
     * @param {array} bizDistrictIds 商圈
     * @param {number} template      默认模版
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * updateExamineFlow({ payload }, { call }) {
      // 审批流ID
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('审批流ID不能为空，无法创建审批流节点');
      }
      const params = {
        id: payload.id, // 审批流ID
        record: {},
      };

      const { bizType, scense } = payload;
      // 审批流名称
      if (is.not.empty(payload.name) && is.existy(payload.name)) {
        params.record.name = payload.name;
      }
      // 业务分类  1 成本审批流  90 非成本审批流
      if (is.not.empty(payload.bizType) && is.existy(payload.bizType)) {
        params.record.biz_type = Number(payload.bizType);
      }
      // 适用场景
      if (is.not.empty(payload.applyApplicationTypes) && is.existy(payload.applyApplicationTypes) && Array.isArray(payload.applyApplicationTypes)) {
        params.record.apply_application_types = payload.applyApplicationTypes.map(i => Number(i));
      }
      // 说明
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.record.note = payload.note;
      }
      // 限定仅用于本审批流的费用分组类型id列表
      if (is.not.empty(payload.costCatalogScope) && is.existy(payload.costCatalogScope)) {
        params.record.cost_catalog_scope = payload.costCatalogScope;
      }
      // 限定不可用于本审批流的费用分组类型id列表
      if (is.not.empty(payload.excludeCostCatalogScope) && is.existy(payload.excludeCostCatalogScope)) {
        params.record.exclude_cost_catalog_scope = payload.excludeCostCatalogScope;
      }
      // 平台
      if (is.not.empty(payload.platformCodes) && is.existy(payload.platformCodes)) {
        params.record.platform_codes = [payload.platformCodes];
      }
      // 供应商
      if (is.not.empty(payload.supplierIds) && is.existy(payload.supplierIds)) {
        params.record.supplier_ids = [payload.supplierIds];
      }
      // 城市
      if (is.not.empty(payload.cityCodes) && is.existy(payload.cityCodes)) {
        params.record.city_codes = [payload.cityCodes];
      }
      // 商圈
      if (is.not.empty(payload.bizDistrictIds) && is.existy(payload.bizDistrictIds)) {
        params.record.biz_district_ids = [payload.bizDistrictIds];
      }
      // 默认模版
      if (is.not.empty(payload.template) && is.existy(payload.template)) {
        params.record.extra_ui_options = { form_template: payload.template };
      }

      bizType && (params.record.biz_type = bizType);
      // 适用场景
      scense && (params.record.industry_codes = [Number(scense)]);
      const result = yield call(updateExamineFlow, params);
      // 失败
      if (result.zh_message) {
        payload.onFailureCallback && payload.onFailureCallback();
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 成功
      if (result.ok) {
        payload.onSuccessCallback && payload.onSuccessCallback();
        message.success('请求成功');
      }
    },

    /**
    * 删除审批流
    * @param {string}   flowId       审批流id
    * @param {function} onSuccessCallback  成功回调
    * @param {function} onFailureCallback  失败回调
    * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
    */
    * deleteExamineFlow({ payload }, { put }) {
      // 审批流id
      if (is.empty(payload.flowId) || is.not.existy(payload.flowId)) {
        return message.error('无法删除，审批流id不能为空');
      }

      const params = {
        id: payload.flowId, // 审批流id
      };

      // 业务请求
      const request = {
        params, // 接口参数
        service: deleteExamineFlow,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 启用审批流
     * @param {string}   flowId       审批流id
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * updateExamineFlowByEnable({ payload }, { put }) {
      const params = {
        flowId: payload.flowId,
        flag: true,
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'updateExamineFlowState', payload: params });
    },

    /**
     * 禁用审批流
     * @param {string}   flowId       审批流id
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * updateExamineFlowByDisable({ payload }, { put }) {
      const params = {
        flowId: payload.flowId,
        flag: false,
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'updateExamineFlowState', payload: params });
    },

    // 更新审批流状态（似有函数）
    * updateExamineFlowState({ payload }, { call }) {
      // 审批流id
      if (is.empty(payload.flowId) || is.not.existy(payload.flowId)) {
        return message.error('无法更新，审批流id不能为空');
      }
      // true: 启用 false: 停用
      if (is.empty(payload.flag) || is.not.existy(payload.flag)) {
        return message.error('无法更新，审批流状态不能为空');
      }

      const params = {
        id: payload.flowId, // 审批流id
        flag: payload.flag, // 启用|禁用
      };

      const result = yield call(updateExamineFlowState, params);
      // 失败
      if (result.zh_message) {
        payload.onFailureCallback && payload.onFailureCallback();
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 成功
      if (result.ok) {
        payload.onSuccessCallback && payload.onSuccessCallback();
        message.success('请求成功');
      }
    },

    /**
     * 添加审批流节点
     * @param {string}   id        审批单id
     * @param {number}   indexNum  流程节点索引序号
     * @param {string}   name      节点名字
     * @param {string}   accountIds 审批人
     * @param {string}   postIds 岗位ids
     * @param {string}   approveMode 审批规则
     * @param {number}   pickMode    节点审批指派
     * @param {string}   isPaymentNode 付款节点
     * @param {string}   canUpdateCostRecord 特殊节点
     * @param {number}   costUpdateRule     金额调整规则
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * createExamineFlowNode({ payload }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('审批流id不能为空，无法添加审批流节点');
      }
      const { record = {} } = payload;

      // 标记验票
      const { isInspectBillNode = undefined } = record;

      const params = {
        flow_id: payload.id,
        record: {},  // 节点信息
      };

      const { level, levelNum } = payload.record;
      // 流程节点索引序号
      if (is.not.empty(payload.record.indexNum) && is.existy(payload.record.indexNum)) {
        params.record.index_num = payload.record.indexNum;
      }
      // 节点名字
      if (is.not.empty(payload.record.name) && is.existy(payload.record.name)) {
        params.record.name = payload.record.name;
      }
      // 审批人
      if (is.not.empty(payload.record.accountIds) && is.existy(payload.record.accountIds)) {
        params.record.account_ids = payload.record.accountIds;
      }
      // 岗位节点
      if (is.not.empty(payload.record.postIds) && is.existy(payload.record.postIds)) {
        params.record.post_ids = payload.record.postIds;
      }
      // 审批规则
      if (is.not.empty(payload.record.approveMode) && is.existy(payload.record.approveMode)) {
        params.record.approve_mode = Number(payload.record.approveMode);
      }
      // 审批指派
      if (is.not.empty(payload.record.pickMode) && is.existy(payload.record.pickMode)) {
        params.record.pick_mode = Number(payload.record.pickMode);
      }
      // 付款节点
      if (is.not.empty(payload.record.isPaymentNode) && is.existy(payload.record.isPaymentNode)) {
        params.record.is_payment_node = payload.record.isPaymentNode;
      }
      // 特殊节点
      if (is.not.empty(payload.record.canUpdateCostRecord) && is.existy(payload.record.canUpdateCostRecord)) {
        params.record.can_update_cost_record = payload.record.canUpdateCostRecord;
      }
      // 金额调整规则
      if (is.not.empty(payload.record.costUpdateRule) && is.existy(payload.record.costUpdateRule)) {
        params.record.cost_update_rule = Number(payload.record.costUpdateRule);
      }

      isInspectBillNode !== undefined && (params.record.is_inspect_bill_node = isInspectBillNode);
      level && (params.record.approve_level_type = level);
      levelNum && (params.record.approve_level_num = levelNum);

      const request = {
        params, // 接口参数
        service: createExamineFlowNode,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
    * 修改审批流节点
    * @param {string}   id        审批单id
    * @param {number}   indexNum  流程节点索引序号
    * @param {string}   name      节点名字
    * @param {string}   accountIds 审批人
    * @param {string}   postIds 岗位ids
    * @param {string}   approveMode 审批规则
    * @param {string}   isPaymentNode 付款节点
    * @param {string}   canUpdateCostRecord 特殊节点
    * @param {number}   costUpdateRule     费用记录修改规则 金额调整
    * @param {number}   approveMode        节点审批模式
    * @param {number}   pickMode           节点审批指派
    * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
    */
    * updateExamineFlowNode({ payload }, { put }) {
      // 审批节点id
      if (is.empty(payload.nodeId) || is.not.existy(payload.nodeId)) {
        return message.error('审批节点ID不能为空，无法更新审批流节点');
      }
      // 审批流ID
      if (is.empty(payload.flowId) || is.not.existy(payload.flowId)) {
        return message.error('审批流ID不能为空，无法更新审批流节点');
      }

      const { record = {} } = payload;

      // 标记验票
      const { isInspectBillNode = undefined } = record;

      const params = {
        id: payload.nodeId,       // 审批节点id
        flow_id: payload.flowId,  // 审批流ID
        record: {},
      };

      const { level, levelNum } = payload.record;
      // 流程节点索引序号
      if (is.not.empty(payload.record.indexNum) && is.existy(payload.record.indexNum)) {
        params.record.index_num = payload.record.indexNum;
      }
      // 节点名称
      if (is.not.empty(payload.record.name) && is.existy(payload.record.name)) {
        params.record.name = payload.record.name;
      }

      // 岗位节点
      if (is.not.empty(payload.record.accountIds) && is.existy(payload.record.accountIds)) {
        params.record.account_ids = payload.record.accountIds;
      }
      // 岗位节点
      if (is.not.empty(payload.record.postIds) && is.existy(payload.record.postIds)) {
        params.record.post_ids = payload.record.postIds;
      }
      // 节点审批模式
      if (is.not.empty(payload.record.approveMode) && is.existy(payload.record.approveMode)) {
        params.record.approve_mode = Number(payload.record.approveMode);
      }
      // 审批指派
      if (is.not.empty(payload.record.pickMode) && is.existy(payload.record.pickMode)) {
        params.record.pick_mode = Number(payload.record.pickMode);
      }
      // 付款节点
      if (is.not.empty(payload.record.isPaymentNode) && is.existy(payload.record.isPaymentNode)) {
        params.record.is_payment_node = payload.record.isPaymentNode;
      }
      // 特殊节点
      if (is.not.empty(payload.record.canUpdateCostRecord) && is.existy(payload.record.canUpdateCostRecord)) {
        params.record.can_update_cost_record = !!payload.record.canUpdateCostRecord;
      }
      // 费用记录修改规则 金额调整
      if (is.not.empty(payload.record.costUpdateRule) && is.existy(payload.record.costUpdateRule)) {
        params.record.cost_update_rule = Number(payload.record.costUpdateRule);
      }

      isInspectBillNode !== undefined && (params.record.is_inspect_bill_node = isInspectBillNode);
      level && (params.record.approve_level_type = level);
      levelNum && (params.record.approve_level_num = levelNum);

      const request = {
        params, // 接口参数
        service: updateExamineFlowNode,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 删除审批流节点
     * @param {string}   flowId       审批流id
     * @param {string}   nodeId       节点id
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * deleteExamineFlowNode({ payload }, { put }) {
      // 审批节点id
      if (is.empty(payload.nodeId) || is.not.existy(payload.nodeId)) {
        return message.error('审批节点ID不能为空，无法更新审批流节点');
      }
      // 审批流ID
      if (is.empty(payload.flowId) || is.not.existy(payload.flowId)) {
        return message.error('审批流ID不能为空，无法更新审批流节点');
      }

      const params = {
        id: payload.flowId,       // 审批流ID
        node_id: payload.nodeId,  // 节点id
      };
      const request = {
        params, // 接口参数
        service: deleteExamineFlowNode,  // 接口
        onSuccessCallback: payload.onSuccessRemoveCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取审批流相关设置
     * @todo 接口需升级优化
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * fetchExamineFlowConfig({ payload = {} }, { call, put }) {
      // 平台
      if (is.not.existy(payload.platforms) || is.empty(payload.platforms)) {
        return message.error('操作失败，平台不能为空');
      }
      const params = {
        platform_codes: payload.platforms,
      };

      // 特性, 默认为house_contract
      if (is.existy(payload.feature) && is.not.empty(payload.feature)) {
        params.feature = payload.feature;
      }

      const result = yield call(fetchExamineFlowConfig, params);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'reduceExamineFlowsConfig', payload: result });
    },

    /**
     * 更新审批流相关设置
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * updateExamineFlowConfig({ payload }, { put }) {
      // 平台
      if (is.not.existy(payload.platforms) || is.empty(payload.platforms)) {
        return message.error('操作失败，平台不能为空');
      }
      const params = {
        options: payload.options,
        platform_codes: payload.platforms,
      };
      // 特性, 默认为house_contract
      if (is.existy(payload.feature) && is.not.empty(payload.feature)) {
        params.feature = payload.feature;
      }
      const request = {
        params, // 接口参数
        service: updateExamineFlowConfig,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取审批流配置 - 服务费方案
     * @todo 接口需升级优化
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * fetchSalaryPlanConfig({ payload = {} }, { call, put }) {
      // 平台
      if (is.not.existy(payload.platforms) || is.empty(payload.platforms)) {
        return message.error('操作失败，平台不能为空');
      }
      const params = {
        feature: 'salary_plan',
        platform_codes: payload.platforms,
      };
      const result = yield call(fetchSalaryPlanConfig, params);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'reduceSalaryPlanConfig', payload: result });
    },

    /**
     * 重置审批流配置 - 服务费方案
     * @todo 接口需升级优化
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */

    * resetSalaryPlanConfig({ payload = {} }, { put }) {
      yield put({ type: 'reduceSalaryPlanConfig', payload });
    },

    /**
     * 更新审批流相关设置 - 服务费方案
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * updateSalaryPlanConfig({ payload }, { put }) {
      // 平台
      if (is.not.existy(payload.platforms) || is.empty(payload.platforms)) {
        return message.error('操作失败，平台不能为空');
      }
      const params = {
        feature: 'salary_plan',
        options: payload.options,
        platform_codes: payload.platforms,
      };
      const request = {
        params,   // 接口参数
        service: updateSalaryPlanConfig, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
    *  获取审批流配置 - 服务费发放
    * @todo 接口需升级优化
    * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
    */
    * fetchSalaryDistribute({ payload = {} }, { call, put }) {
      // 平台
      if (is.not.existy(payload.platforms) || is.empty(payload.platforms)) {
        return message.error('操作失败，平台不能为空');
      }
      const params = {
        feature: 'salary_payment',
        platform_codes: payload.platforms,
      };
      const result = yield call(fetchSalaryDistribute, params);
      if (result === undefined) {
        return;
      }
      yield put({ type: 'reduceSalaryDistribute', payload: result });
    },

    /**
    *  重置审批流配置 - 服务费发放
    * @todo 接口需升级优化
    * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
    */
    * resetSalaryDistribute({ payload = {} }, { put }) {
      yield put({ type: 'reduceSalaryDistribute', payload });
    },

    /**
    * 更新审批流相关配置 - 服务费发放
    * @param {function} onSuccessCallback  成功回调
    * @param {function} onFailureCallback  失败回调
    * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
    */
    * updateSalaryDistribute({ payload }, { put }) {
      // 平台
      if (is.not.existy(payload.platforms) || is.empty(payload.platforms)) {
        return message.error('操作失败，平台不能为空');
      }
      const params = {
        feature: 'salary_payment',
        options: payload.options,
        platform_codes: payload.platforms,
      };
      const request = {
        params,   // 接口参数
        service: updateSalaryDistribute, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取审批流详情(使用命名空间隔离数据，防止相同组件的数据影响)
     * @param {string}  id       审批流id
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * fetchExamineFlowDetail({ payload }, { call, put }) {
      // 审批单id
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return;
      }
      const params = {
        id: payload.id, // 审批流id
      };
      const result = yield call(fetchExamineDetail, params);
      const namespace = payload.namespace ? payload.namespace : 'default';
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceexamineFlowDetail', payload: { namespace, result } });
      }
    },

    /**
     * 获取审批岗位列表
     * @param {string}  postId       岗位ID
     * @param {string}  memberName   成员姓名
     * @param {number}  memberName   状态
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * fetchExaminePost({ payload }, { call, put }) {
      const {
        postId,
        memberName,
        meta,
        state,
        postNum,                // 岗位号
      } = payload;
      const params = {
        _meta: RequestMeta.mapper(meta),
      };
      if (is.existy(postId) && is.not.empty(postId)) {
        params.post_id = postId;
      }
      if (is.existy(memberName) && is.not.empty(memberName)) {
        params.name = memberName;
      }

      if (is.existy(state) && is.not.empty(state)) {
        params.state = Array.isArray(state) ? state : [state];
      }
      // 岗位号
      if (is.existy(postNum) && is.not.empty(postNum)) {
        params.post_id = postNum;
      }
      const result = yield call(fetchExaminePost, params);
      if (result.data) {
        yield put({ type: 'reduceExaminePostData', payload: result });
      } else if (result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 重置审批流详情
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * resetExamineFlowDetail({ payload }, { put }) {
      yield put({ type: 'reduceExamineDetail', payload: {} });
    },

    /**
     * 添加岗位
     * @param {string} name    岗位名称
     * @param {array} member   岗位成员
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * createPost({ payload }, { put }) {
      const {
        name,
        member,
      } = payload;

      // 岗位名称
      if (is.not.existy(name) || is.empty(name)) {
        return message.error('岗位名称不能为空');
      }

      const params = {
        post_name: name,
        account_ids: member,
      };

      const request = {
        params,   // 接口参数
        service: createPost, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 编辑岗位（草稿状态下的编辑）
     * @param {string} name    岗位名称
     * @param {array} member   岗位成员
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * updatePost({ payload }, { put }) {
      const {
        name,
        member,
        id,
      } = payload;
      // 岗位id
      if (is.not.existy(id) || is.empty(id)) {
        return message.error('岗位名称不能为空');
      }

      // 岗位名称
      if (is.not.existy(name) || is.empty(name)) {
        return message.error('岗位名称不能为空');
      }

      const params = {
        post_name: name,
        account_ids: member,
        id,
      };

      const request = {
        params,   // 接口参数
        service: updatePost, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 编辑岗位（正常状态下的编辑）
     * @param {string} name    岗位名称
     * @param {array} member   岗位成员
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * managementPost({ payload }, { put }) {
      const {
        member,
        id,
      } = payload;

      const params = {
        account_ids: member,
        id,
      };

      const request = {
        params,   // 接口参数
        service: managementPost, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 岗位启用/停用
     * @param {string} id 岗位id
     * @param {array} member   岗位成员
     * @memberof module:model/expense/examineFlow~expense/examineFlow/effects
     */
    * enableAndDisablePost({ payload }, { put }) {
      const {
        id,
        flag,
      } = payload;

      // 岗位名称
      if (is.not.existy(id) || is.empty(id)) {
        return message.error('岗位id不能为空');
      }

      const params = {
        id,
        flag,
      };

      const request = {
        params,   // 接口参数
        service: enableAndDisablePost, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 事务性审批流创建节点
     */
    *createAffairsFlowNode({ payload }, { call }) {
      if (!payload.flow_id) return message.error('审批流id不能为空，无法添加审批流节点');
      const params = {
        flow_id: payload.flow_id,
        record: {
          name: payload.name,
          node_approve_type: payload.node_approve_type,
        },
      };

      // 按汇报关系：按部门
      if (payload.organization_approve_type === AffairsFlowCooperationSpecify.department
        || payload.organization_approve_type === AffairsFlowCooperationSpecify.fieldDep
      ) {
        params.record.organization_approve_type = payload.organization_approve_type;
      }

      // 按汇报关系：按审批人
      if (payload.organization_approve_type === AffairsFlowCooperationSpecify.fieldAccount
        || payload.organization_approve_type === AffairsFlowCooperationSpecify.actualAccount
      ) {
        params.record.account_approve_type = payload.organization_approve_type;
      }

      // 协作关系，指定value
      payload.specified_department_type && (params.record.specified_department_type = payload.specified_department_type);

      // 协作关系，指定部门，部门
      payload.approve_department_id && (params.record.approve_department_id = payload.approve_department_id);

      // 协作关系，指定部门，部门审批人类型
      payload.approve_department_account_type && (params.record.approve_department_account_type = payload.approve_department_account_type);

      // 协作关系，指定部门，部门审批人，岗位
      payload.approve_job_id && (params.record.approve_job_id = payload.approve_job_id);

      // 协作关系，指定字段部门
      payload.specified_department_type && (params.record.specified_department_type = payload.specified_department_type);
      // 协作关系，指定字段部门
      payload.specified_department_type && (params.record.specified_department_type = payload.specified_department_type);
      // 协作关系，指定字段相关人
      payload.specified_field_type && (params.record.specified_field_type = payload.specified_field_type);

      // 事务性审批流节点设置按汇报关系获取organization_approve_type
      if (payload.reportOne && payload.reportTwo) {
        params.record.organization_approve_type = affairsReportValue.find((i) => {
          return (i.reportOne === payload.reportOne && i.reportTwo === payload.reportTwo);
        }).value;
      }

      const res = yield call(createExamineFlowNode, params);

      return res;
    },

    /**
     * 事务性审批流编辑节点
     */
    *updateAffairsFlowNode({ payload }, { call }) {
      if (!payload.flow_id) return message.error('审批流id不能为空，无法添加审批流节点');
      // if (!payload.id) return message.error('审批节点ID不能为空，无法更新审批流节点');

      const params = {
        flow_id: payload.flow_id,
        record: {
          flexible_cc_account: [],
          flexible_cc_department_job_relation_ids: [],
          flexible_cc_departments: [],
          fixed_cc_account: [],
          fixed_cc_department_job_relation_ids: [],
          fixed_cc_departments: [],
        },
      };

      // 节点id
      payload.nodeId && (params.id = payload.nodeId);
      payload.name && (params.record.name = payload.name);
      payload.node_approve_type && (params.record.node_approve_type = payload.node_approve_type);
      // payload.isCc !== undefined && (params.record.is_cc = payload.isCc);

      // 审批规则（目前只存在「任一」值，写死）
      params.record.approve_mode = OaApplicationFlowTemplateApproveMode.any;
      // 指派规则
      payload.pickMode && (params.record.pick_mode = Number(payload.pickMode));

      // 按协作关系：按部门
      if (payload.organization_approve_type === AffairsFlowCooperationSpecify.department
        || payload.organization_approve_type === AffairsFlowCooperationSpecify.fieldDep
      ) {
        params.record.organization_approve_type = payload.organization_approve_type;
      }

      // 按协作关系：按审批人
      if (payload.organization_approve_type === AffairsFlowCooperationPerson.fieldAccount
        || payload.organization_approve_type === AffairsFlowCooperationPerson.actualAccount
      ) {
        params.record.account_approve_type = payload.organization_approve_type;
      }

      // 协作关系，指定value
      payload.specified_department_type && (params.record.specified_department_type = payload.specified_department_type);

      // 协作关系，指定部门，部门
      payload.approve_department_id && (params.record.approve_department_id = payload.approve_department_id);

      // 协作关系，指定部门，部门审批人类型
      payload.approve_department_account_type && (params.record.approve_department_account_type = payload.approve_department_account_type);

      // 协作关系，指定部门，部门审批人，岗位
      payload.approve_job_id && (params.record.approve_job_id = payload.approve_job_id);

      // 协作关系，指定字段部门
      payload.specified_department_type && (params.record.specified_department_type = payload.specified_department_type);
      // 协作关系，指定字段部门
      payload.specified_department_type && (params.record.specified_department_type = payload.specified_department_type);
      // 协作关系，指定字段相关人
      payload.specified_field_type && (params.record.specified_field_type = payload.specified_field_type);

      // 事务性审批流节点设置按汇报关系获取organization_approve_type
      if (payload.reportOne && payload.reportTwo) {
        params.record.organization_approve_type = affairsReportValue.find((i) => {
          return (i.reportOne === payload.reportOne && i.reportTwo === payload.reportTwo);
        }).value;
      }

      // 灵活抄送 - 成员
      Array.isArray(payload.flexibleUser) && payload.flexibleUser.length > 0 && (
        params.record.flexible_cc_account = payload.flexibleUser
      );

      // 灵活抄送 - 部门/岗位
      if (Array.isArray(payload.flexibleDep) && payload.flexibleDep.length > 0) {
        // 部门与岗位关联id
        params.record.flexible_cc_department_job_relation_ids = payload.flexibleDep.filter(i => i.jobId).map(i => i._id);
        // 部门id
        params.record.flexible_cc_departments = payload.flexibleDep.filter(i => !i.jobId).map(i => i._id);
      }

      // 固定抄送 - 成员
      Array.isArray(payload.fixedUser) && payload.fixedUser.length > 0
        && (params.record.fixed_cc_account = payload.fixedUser);

      // 固定抄送 - 部门/岗位
      if (Array.isArray(payload.fixedDep) && payload.fixedDep.length > 0) {
         // 部门与岗位关联id
        params.record.fixed_cc_department_job_relation_ids = payload.fixedDep.filter(i => i.jobId).map(i => i._id);
        // 部门id
        params.record.fixed_cc_departments = payload.fixedDep.filter(i => !i.jobId).map(i => i._id);
      }

      const res = payload.nodeId ?
        yield call(updateExamineFlowNode, params)
        : yield call(createExamineFlowNode, params);

      return res;
    },

    /**
     * 事务性审批流申请节点设置抄送
     */
    *setApplicationNodeCC({ payload }, { call }) {
      const {
        flowId,
        nodeId,
        fixedDep, // 固定抄送 - 部门/岗位
        flexibleDep, // 灵活抄送 - 部门/岗位
        fixedUser, // 固定抄送 - 成员
        flexibleUser, // 灵活抄送 - 成员
      } = payload;
      // 审批流id
      if (!flowId) return message.error('审批流id不能为空，无法添加审批流节点');
      const params = {
        parent_template_id: flowId,
        flexible_cc_account: [],
        flexible_cc_department_job_relation_ids: [],
        flexible_cc_departments: [],
        fixed_cc_account: [],
        fixed_cc_department_job_relation_ids: [],
        fixed_cc_departments: [],
      };

      // 节点id
      nodeId && (params.flow_node_id = nodeId);
      // 灵活抄送 - 成员
      Array.isArray(flexibleUser) && flexibleUser.length > 0 && (
        params.flexible_cc_account = flexibleUser
      );

      // 灵活抄送 - 部门/岗位
      if (Array.isArray(flexibleDep) && flexibleDep.length > 0) {
        // 部门与岗位关联id
        params.flexible_cc_department_job_relation_ids = flexibleDep.filter(i => i.jobId).map(i => i._id);
        // 部门id
        params.flexible_cc_departments = flexibleDep.filter(i => !i.jobId).map(i => i._id);
      }

      // 固定抄送 - 成员
      Array.isArray(fixedUser) && fixedUser.length > 0
        && (params.fixed_cc_account = fixedUser);

      // 固定抄送 - 部门/岗位
      if (Array.isArray(fixedDep) && fixedDep.length > 0) {
         // 部门与岗位关联id
        params.fixed_cc_department_job_relation_ids = fixedDep.filter(i => i.jobId).map(i => i._id);
        // 部门id
        params.fixed_cc_departments = fixedDep.filter(i => !i.jobId).map(i => i._id);
      }

      const res = yield call(setApplicationNodeCC, params);

      return res;
    },

    /**
     * 编辑事务性审批流
     */
    *updateAffairsFlow({ payload }, { call }) {
      const {
        flowId,
        name,
        bizType = ExpenseCostOrderBizType.transactional,
        scense,
        applicationRule,
        applyRanks,
        // range,
        departmentSubtype, // 调整子类型
        note,
        highestPost = {},
        selfDep, // 适用部门（本部门）
        allDep, // 适用部门（本加子部门）
        viewSelfDep, // 可见范围（本部门）
        viewAllDep, // 可见范围（本加子部门）
        viewRelaJobId, // 可见范围（岗位关系id）
        sealType, // 印章类型（用章提报用）
        licenseType, // 证照借用类型（证照借用提报用）
        contractType, // 合同借阅类型（合同借阅提报用）
        stampType, // 盖章类型（合同会审提报用）
      } = payload;
      // 审批流ID
      if (is.empty(flowId) || is.not.existy(flowId)) {
        return message.error('审批流ID不能为空，无法创建审批流节点');
      }

      const params = {
        id: flowId,
        record: {
          name,
          biz_type: Number(bizType),
          apply_application_types: [Number(scense)], // 类型
          application_rule: applicationRule, // 合并审批规则
        },
      };
      // 适用部门（本部门）
      selfDep && (params.record.apply_department_ids = selfDep);
      // 适用部门（本加子部门）
      allDep && (params.record.apply_department_sub_ids = allDep);
      // 可见范围（本部门）
      viewSelfDep && (params.record.view_department_ids = viewSelfDep);
      // 可见范围（本加子部门）
      viewAllDep && (params.record.view_department_sub_ids = viewAllDep);
      // 可见范围（岗位关系id）
      viewRelaJobId && (params.record.view_department_job_ids = viewRelaJobId);
       // 印章类型（用章提报用）
      sealType && (params.record.seal_types = sealType);
      // 证照借用类型（证照借用提报用）
      licenseType && (params.record.cert_nature = licenseType);
      // 合同借阅类型（合同借阅提报用）
      contractType && (params.record.pact_borrow_type = contractType);
      // 盖章类型（合同会审提报用）
      stampType && (params.record.stamp_type = stampType.map(item => Number(item)));
      // 调整子类型
      if (departmentSubtype) {
        params.record.organization_sub_types = departmentSubtype.map(item => Number(item));
        params.record.apply_ranks = [];
      }

      // 描述
      params.record.note = note || '';

      // 职级
      applyRanks ? params.record.apply_ranks = applyRanks : params.record.apply_ranks = [];
      // 最高岗位
      if (highestPost && Object.keys(highestPost).length > 0) {
        params.record.final_type = highestPost.type;
        // 标签
        params.record.final_approval_job_tags = highestPost.tags || [];
        // 岗位
        params.record.final_approval_job_ids = highestPost.post || [];
      }


      // 合同类型
      if (is.existy(payload.pactApplyTypes) && is.not.empty(payload.pactApplyTypes)) {
        const contractTypeArr = [];
        payload.pactApplyTypes.map((item) => {
          contractTypeArr.push(Number(item));
        });
        params.record.pact_apply_types = contractTypeArr;
      }
      // 合同子类型
      if (is.existy(payload.pactSubTypes) && is.not.empty(payload.pactSubTypes)) {
        const contractChildArr = [];
        payload.pactSubTypes.map((item) => {
          contractChildArr.push(Number(item));
        });
        params.record.pact_sub_types = contractChildArr;
      }

      const res = yield call(updateExamineFlow, params);

      return res;
    },

    /**
     * 获取审批流节点列表
     */
    *getAffairsFlowNodeList({ payload }, { call, put }) {
      const { flowId } = payload;
      if (!flowId) return message.error('审批流ID为空，无法获取数据');
      const res = yield call(fetchExamineDetail, { id: flowId });
      if (is.existy(res) && is.not.empty(res)) {
        yield put({ type: 'reduceAffairsFlowNodeList', payload: res });
        // 重新赋值审批流详情数据
        yield put({ type: 'reduceExamineDetail', payload: res });
      }
    },
  },
  /**
    * @namespace expense/examineFlow/reducers
    */
  reducers: {

    /**
     *
     * @param {合同子类型数据}
     * @param {*} 获取合同子类型数据
     */
    reduceContractChildTypeSuccess(state, action) {
      const { contractChildTypeData } = action.payload;
      return {
        ...state,
        contractChildTypeData,
      };
    },
    /**
     *
     * @param {合同类型数据}
     * @param {*} 获取合同类型数据
     */
    reduceContractTypeSuccess(state, action) {
      const { contractTypeData } = action.payload;
      return {
        ...state,
        contractTypeData,
      };
    },
    /**
     * 获取审批流列表
     * @returns {object} 更新 examineList
     * @memberof module:model/expense/examineFlow~expense/examineFlow/reducers
     */
    reduceExamineFlows(state, action) {
      const examineList = {
        meta: ResponseMeta.mapper(action.payload._meta),
        data: ApplicationFlowTemplateDetail.mapperEach(action.payload.data, ApplicationFlowTemplateDetail),
      };
      return { ...state, examineList };
    },
    /**
     * 工作交接/部门招聘 获取审批流列表
     */
    reduceExamineFlowsApplayFind(state, action) {
      return { ...state, examineApplayList: action.payload.data };
    },

    /**
     * 获取审批流列表
     * @returns {object} 更新 newOaExamineList
     * @memberof module:model/expense/examineFlow~expense/examineFlow/reducers
     */
    reduceNewExamineFlows(state, action) {
      const newOaExamineList = {
        meta: ResponseMeta.mapper(action.payload._meta),
        data: ApplicationFlowTemplateDetail.mapperEach(action.payload.data, ApplicationFlowTemplateDetail),
      };
      return { ...state, newOaExamineList };
    },

    /**
     * 获取审批流详情
     * @returns {object} 更新 examineDetail
     * @memberof module:model/expense/examineFlow~expense/examineFlow/reducers
     */
    reduceExamineDetail(state, action) {
      let examineDetail = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        examineDetail = ApplicationFlowTemplateDetail.mapper(action.payload, ApplicationFlowTemplateDetail);
      }
      return { ...state, examineDetail };
    },

    /**
     * 获取审批流详情
     * @returns {object} 更新 examineFlowConfig
     * @memberof module:model/expense/examineFlow~expense/examineFlow/reducers
     */
    reduceExamineFlowsConfig(state, action) {
      const examineFlowConfig = action.payload;
      return { ...state, examineFlowConfig };
    },

    /**
    * 获取审批流配置数据 - 服务费方案
    * @returns {object} 更新 salaryPlanConfig
    * @memberof module:model/expense/examineFlow~expense/examineFlow/reducers
    */
    reduceSalaryPlanConfig(state, action) {
      let salaryPlanConfig = {};

      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        salaryPlanConfig = action.payload;
      }
      return { ...state, salaryPlanConfig };
    },

    /**
    * 获取审批流配置数据 - 服务费方案
    * @returns {object} 更新 salaryDistribute
    * @memberof module:model/expense/examineFlow~expense/examineFlow/reducers
    */
    reduceSalaryDistribute(state, action) {
      const salaryDistribute = action.payload;
      return { ...state, salaryDistribute };
    },

    /**
     * 获取审批流数据列表(使用命名空间隔离数据，防止相同组件的数据影响)
     * @returns {object} 更新 examineFlowDetail
     * @memberof module:model/expense/examineFlow~expense/examineFlow/reducers
     */
    reduceexamineFlowDetail(state, action) {
      const { examineFlowDetail } = state;
      const { namespace } = action.payload;
      const data = ApplicationFlowTemplateDetail.mapper(action.payload.result, ApplicationFlowTemplateDetail);
      examineFlowDetail[namespace] = data;
      return { ...state, examineFlowDetail: { ...examineFlowDetail } };
    },

    /**
     * 审批岗位列表
     * @returns {object} 更新 examinePostData
     * @memberof module:model/expense/examineFlow~expense/examineFlow/reducers
     */
    reduceExaminePostData(state, action) {
      const examinePostData = action.payload;
      return {
        ...state,
        examinePostData,
      };
    },

    /**
     * 更新事务性审批流节点数据
     */
    reduceAffairsFlowNodeList(state, action) {
      let affairsNodeList = [];
      if (action.payload) {
        const { node_list: nodeList } = action.payload;
        affairsNodeList = nodeList.map(i => ApplicationFlowNodeBrief.mapper(i, ApplicationFlowNodeBrief));
      }
      return { ...state, affairsNodeList };
    },
  },
};
