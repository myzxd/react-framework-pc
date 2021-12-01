/**
 * 账户相关，常用数据（职位，供应商，平台，城市，商圈）
 *
 * @module model/application/common
 */
import is from 'is_js';
import _ from 'lodash';
import { message } from 'antd';

import {
  fetchExamineFlows,
  fetchSearchExamineFlows,
  fetchAllAccountName,
  fetchExpenseTypes,
  fetchCompanies,
  fetchPositions,
  fetchSuppliers,
  fetchPlatforms,
  fetchCities,
  fetchDistricts,
  fetchRecommendCompany,
  fetchRecommendApprovalJobs,
  fetchMembersInfo,
  fetchContractBelong,
  fetchBankName,
  fetchDepartments,
  fetchStaffs,
  fetchDepartmentEmployees,
  fetchJobHandovers,
  getEnumeratedValue,
  fetchCopyGiveInfo,
  getDepAndPost,
} from '../../services/common';

import {
  fetchTeamMembers,
  fetchTeam,
} from '../../services/employee';

import {
  fetchExpenseSubjects,
  getNewExamineFlows,
} from '../../services/expense';
import {
  ExpenseCostGroupState,
  OaCostAccountingState,
  ExpenseExaminePostType,
  ExpenseCostOrderBizType,
} from '../../application/define';

import Modules from '../../application/define/modules';
import { RequestMeta, ResponseMeta, ApplicationFlowTemplateDetail, CostAccountingDetail } from '../../application/object/';
import { authorize } from '../../application';

// 树状结构扁平处理
const flatTree = (data) => {
  const res = [];
  if (Array.isArray(data) && data.length > 0) {
    data.forEach((i) => {
      const assignment = (n) => {
        res[res.length] = {
          name: n.node.name,
          _id: n.node._id,
          pid: n.node.pid,
        };
        const leaf = n.leaf;
        if (leaf && Array.isArray(leaf)) {
          leaf.forEach(l => assignment(l));
        }
      };

      assignment(i);
    });
  }
  return res;
};

// 处理枚举值
const dealEnumerateVal = (action, enumeratedType) => {
  const enumeratedValue = {};
  let pendingData = {};
  if (action.payload) {
    const {
      examineFlowBiz,
      cost_application_types: costData = {},
      none_cost_application_types: noneCostData = {},
      work_flow_application_types: workData = {},
      seal_types: sealType = {},
      employment_apply_types: employmentApplyTypes = {},
      capital_allocate_order_reasons: capitalAllocateOrderReasons = {},
      industry_codes: industryCodes = {},
      flow_cert_nature: licenseData = {},
      flow_pact_borrow_type: contractData = {},
      seal_types: flowSealTypes = {},
      team_invoice_titles: teamInvoiceTitles = {},
      code_invoice_titles: codeInvoiceTitles = {},
    } = action.payload;
    // 全部审批流适用类型
    enumeratedType === 'examineFlowApplyApplicationTypes'
      && (pendingData = { ...costData, ...noneCostData, ...workData });

    // 成本类审批流适用类型
    enumeratedType === 'examineFlowApplyApplicationTypes'
      && Number(examineFlowBiz) === ExpenseCostOrderBizType.costOf
      && (pendingData = costData);

    // 非成本类审批流适用类型
    enumeratedType === 'examineFlowApplyApplicationTypes'
      && Number(examineFlowBiz) === ExpenseCostOrderBizType.noCostOf
      && (pendingData = noneCostData);

    // 事务性审批流适用类型
    enumeratedType === 'affairs'
      && (pendingData = workData);

    // 印章类型（用章、借章提报用）
    enumeratedType === 'sealType'
      && (pendingData = sealType);

    // 证照借用类型（证照借用提报用）
    enumeratedType === 'license'
      && (pendingData = licenseData);

    // 合同借阅类型（合同借阅提报用）
    enumeratedType === 'contract'
      && (pendingData = contractData);

    // 印章类型（用章、借章提报用）
    enumeratedType === 'flowSealType'
      && (pendingData = flowSealTypes);

    // 事务性审批oa入职申请，入职方式对应的枚举
    enumeratedType === 'oaInductionApplyType'
        && examineFlowBiz === ExpenseCostOrderBizType.transactional
      && (pendingData = employmentApplyTypes);

    // 事务性审批oa资金调拨，调拨事由对应的枚举
    enumeratedType === 'fundTransferCause'
        && examineFlowBiz === ExpenseCostOrderBizType.transactional
      && (pendingData = capitalAllocateOrderReasons);

    // 科目适用场景
    (enumeratedType === 'subjectScense' || enumeratedType === 'industry')
      && (pendingData = industryCodes);
    // 科目适用场景
    (enumeratedType === 'teamInvoiceTitles')
      && (pendingData = teamInvoiceTitles);

    // 科目适用场景
    (enumeratedType === 'codeInvoiceTitles')
      && (pendingData = codeInvoiceTitles);

    // 枚举值
    const dataKey = Object.keys(pendingData);

    // 枚举名
    const dataVal = Object.values(pendingData);

    enumeratedValue[enumeratedType] = dataKey.map((i, key) => {
      return { name: dataVal[key], value: Number(i) };
    });
  }

  return enumeratedValue;
};


export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'applicationCommon',
  /**
   * 状态树
   * @prop {array} companies 第三方公司
   * @prop {array} positions 职位数据
   * @prop {array} examineFlows 审批流数据
   * @prop {array} expenseTypes 费用分组
   * @prop {object} suppliers 供应商数据
   * @prop {object} platforms 平台数据
   * @prop {object} cities 城市数据
   * @prop {object} districts 区域数据
   * @prop {object} allAccount 所有的账号
   * @prop {object} approvalJobs 审批岗位数据
   * @prop {object}  membersData 成员数据
   * @prop {object}  copyGiveInfo 抄送信息
   */
  state: {
    companies: [],    // 第三方公司
    positions: [],    // 职位数据
    examineFlows: [], // 审批流数据
    expenseTypes: [], // 费用分组

    suppliers: {},    // 供应商数据(使用命名空间隔离数据，防止相同组件的数据影响)
    platforms: {},    // 平台数据(使用命名空间隔离数据，防止相同组件的数据影响)
    cities: {},       // 城市数据(使用命名空间隔离数据，防止相同组件的数据影响)
    districts: {},    // 区域数据(使用命名空间隔离数据，防止相同组件的数据影响)

    allAccount: {    // 所有的账号
      name: [],      // 账号姓名
      nameTree: [],  // 账号树
    },
    subjectsData: {},    // 科目列表
    recommendCompanyData: [], // 推荐公司列表
    industryData: [],    // 所属场景
    approvalJobs: {},    // 审批岗位数据
    membersData: {},     // 成员数据
    contractBelong: {}, // 合同甲方（新接口）
    bankName: {},  // 开户行信息

    teamMembers: {}, // 人员（命名空间）
    teamList: {}, // 团队id

    departments: {},  // 部门树结构
    staffs: {},       // 部门职位
    flatDepartment: [], // 扁平化树
    departmentEmployees: [], // 部门下职员列表
    jobHandovers: {}, // 工作交接单下拉
    enumeratedValue: {}, // 枚举值
    copyGiveInfo: {}, // 抄送信息
    depAndPostTree: [], // 部门及岗位树
  },

  /**
   * @namespace application/common/effects
   */
  effects: {
    /**
     * 获取工作交接单下拉
     */
    * fetchJobHandovers({ payload = {} }, { call, put }) {
      const params = {};
      const { employeeId } = payload;

      // 员工id
      if (is.not.existy(employeeId) || is.empty(employeeId)) {
        return false;
      }
      params.order_account_id = employeeId;

      // 请求服务器
      const res = yield call(fetchJobHandovers, params);
      // 判断数据是否为空
      if (res && res.data) {
        yield put({
          type: 'reduceJobHandovers',
          payload: { employeeId, res },
        });
        return true;
      }
      return false;
    },
    /**
     * 审批流数据
     * @param {number} state 状态
     * @param {array} platformCodes 平台
     * @param {number} bizType 业务类型
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchExamineFlows({ payload = {} }, { call, put }) {
      const {
        isNewInterface = false, // 是否为新接口
      } = payload;
      // 请求列表的meta信息
      // limit为0，可以获取全部的数据@罗贤鹏
      const params = {
        _meta: RequestMeta.mapper({ page: 1, limit: 0 }),
      };
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      // 平台
      if (is.existy(payload.platformCodes) && is.not.empty(payload.platformCodes)) {
        params.platform_codes = Array.isArray(payload.platformCodes) ? payload.platformCodes : [payload.platformCodes];
      }

      // 业务类型
      if (is.existy(payload.bizType) && is.not.empty(payload.bizType)) {
        params.biz_type = [payload.bizType];
      }

      // oa单据类型
      if (is.existy(payload.oaTypes) && is.not.empty(payload.oaTypes)) {
        params.apply_application_types = payload.oaTypes;
      }

      // oa单据类型
      if (is.existy(payload.approvalType) && is.not.empty(payload.approvalType)) {
        params.apply_application_types = [payload.approvalType];
      }

      const result = isNewInterface ?
        yield call(getNewExamineFlows, params)
        : yield call(fetchExamineFlows, params);

      // 判断数据是否为空
      if (is.existy(result.data)) {
        // 命名空间
        const namespace = payload.namespace ? payload.namespace : 'default';
        yield put({ type: 'reduceExamineFlows', payload: { data: result, namespace } });
      }
    },
    /**
     * 审批流查询数据
     * @param {string} name 名称
     * @memberof module:model/application/common~application/common/effects
     */
    fetchSearchExamineFlows: [
      function*({ payload = {} }, { call }) {
        const params = {};
        // 名称
        if (is.existy(payload.name) && is.not.empty(payload.name)) {
          params.name = payload.name;
        }

        const result = yield call(fetchSearchExamineFlows, params);

        // 判断数据是否为空
        if (is.existy(result) && Array.isArray(result.data)) {
          payload.onSuccessCallback && payload.onSuccessCallback(result.data);
        }
      },
    { type: 'takeLatest' },
    ],

    /**
     * 获取所有的账号
     * @memberof module:model/application/common~application/common/effects
     */
    fetchAllAccountName: [
      function*({ payload = {} }, { call, put }) {
        const params = {};
        // 状态
        if (is.existy(payload.state) && is.not.empty(payload.state)) {
          params.state = payload.state;
        }
        // 请求服务器
        const result = yield call(fetchAllAccountName, params);
        // 判断数据是否为空
        if (is.existy(result)) {
          yield put({ type: 'reduceAllAccountName', payload: result });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 费用类型
     * @param {number} state 状态
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchExpenseTypes({ payload = {} }, { call, put }) {
      const params = {
        state: [ExpenseCostGroupState.enable], // 默认显示正常的状态
        _meta: { page: 1, limit: 10000 },
      };
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = [payload.state];
      }

      // 适用场景
      payload.scense && (params.industry_codes = [Number(payload.scense)]);

      // 请求服务器
      const result = yield call(fetchExpenseTypes, params);

      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceExpenseTypes', payload: result });
      }
    },

    /**
     * 获取科目列表
     * @param {string}  costCenterType 成本中心
     * @param {string}  level   科目级别
     * @param {number}  state   状态
     * @memberof module:model/expense/subject~expense/subject/effects
     */
    * fetchExpenseSubjects({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        _meta: { page: 1, limit: 10000 },
        state: [OaCostAccountingState.normal],
      };
      const result = yield call(fetchExpenseSubjects, params);
      if (is.existy(result.data)) {
        yield put({ type: 'reduceExpenseSubjects', payload: result });
      }
    },

    /**
     * 第三方公司
     * @param {array} suppliers 供应商
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchCompanies({ payload = {} }, { call, put }) {
      const params = {
        permission_id: Modules.ModuleAccount.id,
        _meta: {
          page: 1,
          limit: 500,
        },
      };
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      // 三方公司类型
      if (is.existy(payload.type) && is.not.empty(payload.type)) {
        params.type = Number(payload.type);
      }
      // 是否是电子签约
      if (is.existy(payload.isElectronicSign) && is.not.empty(payload.isElectronicSign)) {
        params.is_electronic_sign = payload.isElectronicSign;
      }
      // 平台
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_codes = payload.platforms;
      }
      // 供应商
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_ids = payload.suppliers;
      }

      // 请求服务器
      const result = yield call(fetchCompanies, params);

      // 判断数据是否为空
      if (is.existy(result.data)) {
        yield put({ type: 'reduceCompanies', payload: result.data });
      }
    },

    /**
     * 获取职位信息
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchPositions({ payload = {} }, { call, put }) {
      const params = {};
      // 请求服务器
      const result = yield call(fetchPositions, params);

      // 判断数据是否为空
      if (is.not.empty(result.result) && is.existy(result.result)) {
        yield put({ type: 'reducePositions', payload: result.result });
      }
    },

    /**
     * 获取平台信息
     * @param {string} namespace 命名空间
     * @param {array} suppliers 供应商
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchPlatforms({ payload = {} }, { call, put }) {
      const params = {};

      // 根据供应商获取平台
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_list = is.not.array(payload.suppliers) ? [payload.suppliers] : payload.suppliers;
      }

      // 适用场景
      payload.scense && (params.industry_code = Number(payload.scense));

      // 请求服务器
      const result = yield call(fetchPlatforms, params);

      // 判断数据是否为空
      if (is.existy(result.platform_list)) {
        // 命名空间
        const namespace = payload.namespace ? payload.namespace : 'default';
        yield put({ type: 'reducePlatforms', payload: { namespace, data: result.platform_list } });
      }
    },

    /**
     * 获取供应商信息
     * @param {string} namespace 命名空间
     * @param {array} platforms 供应商
     * @param {number} state 供应商状态
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchSuppliers({ payload = {} }, { call, put }) {
      const params = {};

      // 根据平台获取供应商
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_code_list = is.not.array(payload.platforms) ? [payload.platforms] : payload.platforms;
      }

      // 供应商状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }

      // 请求服务器
      const result = yield call(fetchSuppliers, params);

      // 判断数据是否为空
      if (is.not.truthy(payload.isCascade) && is.existy(result.supplier_list)) {
        // 命名空间
        const namespace = payload.namespace ? payload.namespace : 'default';
        yield put({ type: 'reduceSuppliers', payload: { namespace, data: result.supplier_list } });
      }
    },

    /**
     * 获取城市信息
     * @param {string} namespace 命名空间
     * @param {array} platforms 平台
     * @param {array} suppliers 供应商
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchCities({ payload = {} }, { call, put }) {
      const params = {};

      if (is.empty(payload.platforms) && is.empty(payload.suppliers)) {
        // console.log('DEBUG: fetchCities 参数为空，不获取城市数据。 数据重置为空');
        const namespace = payload.namespace ? payload.namespace : 'default';
        yield put({ type: 'resetCities', payload: { namespace } });
        return;
      }

      // 根据平台获取城市
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_code_list = is.not.array(payload.platforms) ? [payload.platforms] : payload.platforms;
      }

      // 根据供应商获取城市
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_list = is.not.array(payload.suppliers) ? [payload.suppliers] : payload.suppliers;
      }

      // 请求服务器
      const result = yield call(fetchCities, params);

      // 判断数据是否为空
      if (is.not.truthy(payload.isCascade) && is.existy(result.city_list)) {
        // 命名空间
        const namespace = payload.namespace ? payload.namespace : 'default';
        // 城市数据去重,防止相同城市key产生的问题（清空操作）
        const cityList = _.uniqWith(result.city_list, _.isEqual);
        yield put({ type: 'reduceCities', payload: { namespace, data: cityList } });
      }
    },

    /**
     * 获取商圈信息
     * @param {string} namespace 命名空间
     * @param {array} suppliers 供应商
     * @param {array} platforms 平台
     * @param {array} cities 城市
     * @param {number} state 状态
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchDistricts({ payload = {} }, { call, put }) {
      // 命名空间
      const namespace = payload.namespace ? payload.namespace : 'default';
      const params = {};

      if ((is.empty(payload.platforms) && is.empty(payload.suppliers)) || is.empty(payload.cities)) {
        // console.log('DEBUG: fetchDistricts 参数为空，不获取城市信息');
        yield put({ type: 'resetDistricts', payload: { namespace } });
        return;
      }

      // 根据平台获取商圈
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_code_list = is.not.array(payload.platforms) ? [payload.platforms] : payload.platforms;
      }

      // 根据供应商获取商圈
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_list = is.not.array(payload.suppliers) ? [payload.suppliers] : payload.suppliers;
      }

      // 根据城市获取商圈
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_list = is.not.array(payload.cities) ? [payload.cities] : payload.cities;
      }

      // 根据状态获取商圈
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = is.array(payload.state) ? payload.state : [payload.state];
      }

      // 是否查询未分配的商圈
      if (is.existy(payload.onlyNotAllocate) && is.truthy(payload.onlyNotAllocate)) {
        params.not_allot = 1;
      }

      // 请求服务器
      const result = yield call(fetchDistricts, params);

      // 判断数据是否为空
      if (is.not.truthy(payload.isCascade) && is.existy(result.biz_district_list)) {
        yield put({ type: 'reduceDistricts', payload: { namespace, data: result.biz_district_list } });
      }
    },

    /**
     * 获取推荐公司信息
     * @param {array} suppliers 供应商
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchRecommendCompany({ payload = {} }, { call, put }) {
      const { suppliers } = payload;
      const params = {
        _meta: { page: 1, limit: 9999 },
      };
      // 供应商列表
      if (is.existy(suppliers) && is.not.empty(suppliers)) {
        params.supplier_id = suppliers;
      }
      const result = yield call(fetchRecommendCompany, params);
      if (result.data) {
        yield put({ type: 'reduceRecommendCompany', payload: result.data });
      }
    },

    /**
     * 获取所属场景信息
     * @memberof module:model/application/common~application/common/effects
     */
    // *fetchIndustry({ payload = {} }, { call, put }) {
    //   const params = {
    //     _meta: { page: 1, limit: 9999 },
    //   };
    //   const result = yield call(fetchIndustry, params);
    //   if (result.data) {
    //     yield put({ type: 'reduceIndustry', payload: result.data });
    //   }
    // },
    /**
     * 获取审批岗位数据
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchRecommendApprovalJobs({ payload = {} }, { call, put }) {
      const params = {
        _meta: { page: 1, limit: 9999 },
        state: [ExpenseExaminePostType.normal],
      };

      const result = yield call(fetchRecommendApprovalJobs, params);
      if (result) {
        yield put({ type: 'reduceRecommendApprovalJobs', payload: result });
      }
    },

    /**
     * 合同甲方
     * @param {array} platforms 平台
     * @param {array} suppliers 供应商
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchContractBelong({ payload = {} }, { call, put }) {
      // 所属场景
      if (!payload.industryCode
        || payload.supplierId.length === 0
        || !payload.supplierId[0]
        || !payload.cityCode
      ) {
        yield put({ type: 'reduceContractBelong', payload: {} });
        return;
      }

      // 参数
      const params = {
        industry_code: Number(payload.industryCode), // 后端int类型
        supplier_id: payload.supplierId[0], // 后端string类型
        city_code: payload.cityCode,
      };

      // 请求服务器
      const result = yield call(fetchContractBelong, params);

      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceContractBelong', payload: result });
      }
    },

    /**
     * 开户行
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchBankName({ payload = {} }, { call, put }) {
      // 请求服务器
      const result = yield call(fetchBankName);

      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceBankName', payload: result });
      }
    },

    /**
      * 重置开户行
      * @memberof module:model/application/common~application/common/effects
      */
    *resetBankName({ payload }, { put }) {
      yield put({ type: 'reduceBankName', payload: {} });
    },

    /**
     * 重置合同甲方
     * @memberof module:model/application/common~application/common/effects
     */
    *resetContractBelong({ payload }, { put }) {
      yield put({ type: 'reduceContractBelong', payload: {} });
    },

    /**
     * 重置账户列表
     * @memberof module:model/application/common~application/common/effects
     */
    *resetAllAccountName({ payload }, { put }) {
      yield put({ type: 'reduceAllAccountName', payload: {} });
    },

    /**
     * 重置审批岗位
     * @memberof module:model/application/common~application/common/effects
     */
    *resetRecommendApprovalJobs({ payload }, { put }) {
      yield put({ type: 'reduceRecommendApprovalJobs', payload: {} });
    },

    /**
     * 重置审批流
     * @memberof module:model/application/common~application/common/effects
     */
    *resetExamineFlows({ payload }, { put }) {
      yield put({ type: 'reduceExamineFlows', payload: {} });
    },

    /**
     * 重置费用分组
     * @memberof module:model/application/common~application/common/effects
     */
    *resetExpenseTypes({ payload }, { put }) {
      yield put({ type: 'reduceExpenseTypes', payload: [] });
    },

    /**
     * 重置费用科目
     * @memberof module:model/application/common~application/common/effects
     */
    *resetExpenseSubject({ payload }, { put }) {
      yield put({ type: 'reduceExpenseSubjects', payload: {} });
    },

    /**
     * 重置第三方公司
     * @memberof module:model/application/common~application/common/effects
     */
    *resetCompanies({ payload }, { put }) {
      yield put({ type: 'reduceCompanies', payload: [] });
    },

    /**
     * 重置职位数据
     * @memberof module:model/application/common~application/common/effects
     */
    *resetPositions({ payload }, { put }) {
      yield put({ type: 'reducePositions', payload: [] });
    },

    /**
     * 重置供应商数据
     * @param {string} namespace 命名空间
     * @memberof module:model/application/common~application/common/effects
     */
    *resetSuppliers({ payload }, { put }) {
      // 命名空间
      const namespace = payload.namespace ? payload.namespace : 'default';
      yield put({ type: 'reduceSuppliers', payload: { namespace, data: [] } });
    },

    /**
     * 重置平台数据
     * @param {string} namespace 命名空间
     * @memberof module:model/application/common~application/common/effects
     */
    *resetPlatforms({ payload }, { put }) {
      // 命名空间
      const namespace = payload.namespace ? payload.namespace : 'default';
      yield put({ type: 'reducePlatforms', payload: { namespace, data: [] } });
    },

    /**
     * 重置城市数据
     * @param {string} namespace 命名空间
     * @memberof module:model/application/common~application/common/effects
     */
    *resetCities({ payload = {} }, { put }) {
      // 命名空间
      const namespace = payload.namespace ? payload.namespace : 'default';
      yield put({ type: 'reduceCities', payload: { namespace, data: [] } });
    },

    /**
     * 重置商圈数据
     * @param {string} namespace 命名空间
     * @memberof module:model/application/common~application/common/effects
     */
    *resetDistricts({ payload }, { put }) {
      // 命名空间
      const namespace = payload.namespace ? payload.namespace : 'default';
      yield put({ type: 'reduceDistricts', payload: { namespace, data: [] } });
    },

    /**
     * 重置推荐公司数据
     * @memberof module:model/application/common~application/common/effects
     */
    *resetRecommendCompany({ payload }, { put }) {
      yield put({ type: 'reduceRecommendCompany', payload: [] });
    },

    /**
     * 获取成员数据
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchMembersInfo({ payload = {} }, { call, put }) {
      // 默认参数
      const params = {
        permission_id: Modules.ModuleSystemAccountManage.id,
        account_id: authorize.account.id,
        limit: 30,
        page: 1,
      };
      // 条数限制
      if (is.existy(payload.limit) && is.not.empty(payload.limit)) {
        params.limit = payload.limit;
      }
      // 分页
      if (is.existy(payload.page) && is.not.empty(payload.page)) {
        params.page = payload.page;
      }
      // 职位列表
      if (is.existy(payload.positions) && is.not.empty(payload.positions)) {
        const positions = Number(payload.positions);
        params.gid_list = [positions];
      }
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      // 请求服务器
      const result = yield call(fetchMembersInfo, params);
      // 判断数据是否为空
      if (is.existy(result.data)) {
        yield put({ type: 'reduceMembersInfo', payload: result });
      }
    },

    /**
     * 重置成员信息数据
     * @memberof module:model/application/common~application/common/effects
     */
    * resetMembersInfo({ payload }, { put }) {
      yield put({ type: 'reduceMembersInfo', payload: {} });
    },

    /**
     * 获取人员列表
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *fetchTeamMembers({ payload }, { call, put }) {
      // 公共文本参数
      const {
        namespace, // 命名空间
      } = payload;

      // 默认参数
      const params = {
      };

      // 请求服务器
      const result = yield call(fetchTeamMembers, params);

      // 过滤team_name
      const data = result.data.map(item => _.omit(item, ['team_name']));

      // 去重
      const filterData = _.uniqWith(data, _.isEqual);
      // 判断数据是否为空
      if (is.existy(result.data)) {
        yield put({ type: 'reduceTeamMembers', payload: { result: { data: [...filterData] }, namespace } });
      }
    },

    /**
     * 重置员工
     * @memberof module:model/application/common~application/common/effects
     */
    *resetTeamMembers({ payload }, { put }) {
      yield put({ type: 'reduceTeamMembers', payload: {} });
    },

    /**
     * 获取团队id
     * @param {array}   platforms  平台
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *fetchTeam({ payload }, { call, put }) {
      // 公共文本参数
      const {
        page,
        limit,
        platform,
        vendor,
        city,
        district,
        // supplier, // 供应商
        namespace, // 命名空间
        // teamType, // 团队类型
      } = payload;

      // 默认参数
      const params = {
        _meta: RequestMeta.mapper({ page: page || 1, limit: limit || 30 }),
      };

      // // 供应商
      // if (is.existy(supplier) && is.not.empty(supplier)) {
      //   params.supplier_id = supplier;
      // }

      // 平台
      if (is.existy(platform) && is.not.empty(platform)) {
        params.platform_code = [platform];
      }
      // 供应商
      if (is.existy(vendor) && is.not.empty(vendor)) {
        params.supplier_id = [vendor];
      }
      // 城市
      if (is.existy(city) && is.not.empty(city)) {
        params.city_code = [city];
      }
      // 商圈
      if (is.existy(district) && is.not.empty(district)) {
        params.biz_district_id = [district];
      }
      // 请求服务器
      const result = yield call(fetchTeam, params);

      // 判断数据是否为空
      if (is.existy(result.data)) {
        yield put({ type: 'reduceTeam', payload: { result, namespace } });
      }
    },

    /**
     * 重置团队id
     * @memberof module:model/application/common~application/common/effects
     */
    *resetTeamId({ payload }, { put }) {
      yield put({ type: 'reduceTeam', payload: {} });
    },

    /**
     * 获取部门树结构
     * @memberof module:model/application/common~application/common/effects
     */
    fetchDepartments: [
      function*({ payload = {} }, { call, put }) {
        const {
          isAuth = false,
          isAuthorized,
        } = payload;
        // 参数
        const params = {
        };

        // 判断是否获只取授权数据
        if (is.existy(isAuthorized) && is.truthy(isAuthorized)) {
          params.is_authorized = true;
        }

        // 是否包含已裁撤部门
        isAuth && (params.is_auth = isAuth);

        // 请求服务器
        const result = yield call(fetchDepartments, params);

        // 判断数据是否为空
        if (is.existy(result)) {
          // 命名空间
          const namespace = payload.namespace ? payload.namespace : 'default';
          yield put({ type: 'reduceDepartments', payload: { namespace, data: result.data } });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 重置部门树数据
     * @param {string} namespace 命名空间
     * @memberof module:model/application/common~application/common/effects
     */
    *resetDepartments({ payload }, { put }) {
      // 命名空间
      const namespace = payload.namespace ? payload.namespace : 'default';
      yield put({ type: 'reduceDepartments', payload: { namespace, data: [] } });
    },

    /**
     * 获取部门相关的岗位
     * @memberof module:model/application/common~application/common/effects
     */
    *fetchStaffs({ payload = {} }, { call, put }) {
      const { state } = payload;
      // 部门id
      if (is.not.existy(payload.departmentId) || is.empty(payload.departmentId)) {
        return;
      }

      // 参数
      const params = {
        _meta: RequestMeta.mapper({ page: 1, limit: 1000 }),
        department_id: payload.departmentId,
      };

      state && !Array.isArray(state) && (params.state = [state]);
      state && Array.isArray(state) && (params.state = state);

      // 请求服务器
      const result = yield call(fetchStaffs, params);

      // 判断数据是否为空
      if (is.existy(result)) {
        // 命名空间
        const namespace = payload.namespace ? payload.namespace : 'default';
        yield put({ type: 'reduceStaffs', payload: { namespace, data: result } });
      }
    },

    /**
     * 重置岗位数据
     * @param {string} namespace 命名空间
     * @memberof module:model/application/common~application/common/effects
     */
    *resetStaffs({ payload }, { put }) {
      // 命名空间
      const namespace = payload.namespace ? payload.namespace : 'default';
      yield put({ type: 'reduceStaffs', payload: { namespace, data: {} } });
    },

    /**
     * 获取部门下职员列表
     */
    *fetchDepartmentEmployees({ payload }, { call, put }) {
      const { departmentId, postId } = payload;
      const params = {
        is_current_department: payload.is_current_department,
      };

      // 部门id
      if (is.existy(departmentId) && is.not.empty(departmentId)) {
        params.department_id = departmentId;
      }

      // 岗位id
      if (is.existy(postId) && is.not.empty(postId)) {
        params.job_id = postId;
      }

      // 请求接口
      const res = yield call(fetchDepartmentEmployees, params);

      // 判断数据是否为空
      if (res && res.data && Array.isArray(res.data)) {
        yield put({
          type: 'reduceDepartmentEmployees',
          payload: res.data,
        });
      }
    },

    /**
     * 获取抄送信息
     */
    *fetchCopyGiveInfo({ payload }, { call, put }) {
      // 审批流id
      if (is.not.existy(payload.flowId) || is.empty(payload.flowId)) {
        return message.error('审批流ID不存在');
      }
      const params = {
        flow_id: payload.flowId,
      };
      // 审批单id
      if (is.existy(payload.orderId) && is.not.empty(payload.orderId)) {
        params.application_order_id = payload.orderId;
      }
      const res = yield call(fetchCopyGiveInfo, params);
      if (res) {
        yield put({
          type: 'reduceCopyGiveInfo',
          payload: res,
        });
      }
    },

    /**
     * 获取所有枚举值
     */
    // eslint-disable-next-line no-shadow
    * getEnumeratedType(_, { call }) {
      const res = yield call(getEnumeratedValue, {});
      if (!res || (res && res.message)) return;
      return res;
    },

    /**
     * 枚举值
     */
    * getEnumeratedValue({ payload }, { call, put }) {
      const { enumeratedType, examineFlowBiz = undefined } = payload;
      const result = yield call(getEnumeratedValue, payload);
      if (result) {
        yield put({ type: 'reduceEnumeratedValue', payload: { ...result, enumeratedType, examineFlowBiz } });
      }
    },

    /**
     * 枚举值
     */
    * resetEnumeratedValue({ payload }, { put }) {
      yield put({ type: 'reduceEnumeratedValue', payload: {} });
    },

    /**
     * 获取部门&岗位树结构
     * @memberof module:model/application/common~application/common/effects
     */
    getDepAndPost: [
      function*({ payload = {} }, { call, put }) {
        // 请求服务器
        const result = yield call(getDepAndPost, {});

        // 判断数据是否为空
        if (result) {
          // 命名空间
          yield put({ type: 'reduceDepAndPost', payload: result });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 枚举值
     */
    getAllEnumerated: [
      function*({ payload }, { call, put }) {
        const res = yield call(getEnumeratedValue, {});
        if (res) {
          yield put({ type: 'reduceAllEnumerated', payload: res });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 重置枚举值
     */
    * resetAllEnumerated({ payload }, { put }) {
      yield put({ type: 'reduceAllEnumerated', payload: {} });
    },
  },

  /**
   * @namespace application/common/reducers
   */
  reducers: {
    /**
     * 审批流
     * @return {object} 更新 examinFlows
     * @memberof module:model/application/common~application/common/reducers
     */
    reduceExamineFlows(state, action) {
      const examineFlows = Object.assign({}, state.examineFlows);
      const { namespace, data } = action.payload;
      if (is.not.empty(data) && is.existy(data)) {
        examineFlows[namespace] = {
          // eslint-disable-next-line no-underscore-dangle
          meta: ResponseMeta.mapper(data._meta),
          data: ApplicationFlowTemplateDetail.mapperEach(data.data, ApplicationFlowTemplateDetail),
        };
      }
      return { ...state, examineFlows };
    },

    /**
     * 所有的账号
     * @return {object} 更新 allAccount
     * @memberof module:model/application/common~application/common/reducers
     */
    reduceAllAccountName(state, action) {
      const data = action.payload || [];
      let allAccount = {};
      // 判断有数据才能更新state，重置时过滤
      if (is.existy(data) && is.not.empty(data)) {
        allAccount = {
          name: action.payload, // 账号姓名
          nameTree: data.map((item) => { // 账号树
            return {
              title: `${item.name} ${item.phone}`,
              disabled: false,
              key: item.id,
            };
          }),
        };
      }
      return {
        ...state,
        allAccount,     // 申请人名字树
      };
    },

    /**
     * 费用类型
     * @return {object} 更新 expenseTypes
     * @memberof module:model/application/common~application/common/reducers
     */
    reduceExpenseTypes(state, action) {
      return { ...state, expenseTypes: action.payload.data };
    },

    /**
     * 第三方公司
     * @return {object} 更新 companies
     * @memberof module:model/application/common~application/common/reducers
     */
    reduceCompanies(state, action) {
      return { ...state, companies: action.payload };
    },

    /**
     * 职位信息
     * @return {object} 更新 positions
     * @memberof module:model/application/common~application/common/reducers
     */
    reducePositions(state, action) {
      return { ...state, positions: action.payload };
    },

    /**
     * 供应商数据
     * @return {object} 更新 suppliers
     * @memberof module:model/application/common~application/common/reducers
     */
    reduceSuppliers(state, action) {
      // 供应商数据
      const { suppliers } = state;
      // 命名空间和新数据
      const { namespace, data } = action.payload;
      // 写入数据
      return {
        ...state,
        suppliers: {
          ...suppliers,
          [namespace]: data,
        },
      };
    },

    /**
     * 平台数据
     * @return {object} 更新 platforms
     * @memberof module:model/application/common~application/common/reducers
     */
    reducePlatforms(state, action) {
      // 命名空间和新数据
      const { namespace, data } = action.payload;
      // 写入数据
      return {
        ...state,
        platforms: {
          ...state.platforms,
          [namespace]: data,
        },
      };
    },

    /**
     * 城市数据
     * @return {object} 更新 cities
     * @memberof module:model/application/common~application/common/reducers
     */
    reduceCities(state, action) {
      // 命名空间和新数据
      const { namespace, data } = action.payload;
      // 写入数据
      return {
        ...state,
        cities: {
          ...state.cities,
          [namespace]: data,
        },
      };
    },

    /**
     * 区域数据
     * @return {object} 更新 districts
     * @memberof module:model/application/common~application/common/reducers
     */
    reduceDistricts(state, action) {
      // 命名空间和新数据
      const { namespace, data } = action.payload;
      // 写入数据
      return {
        ...state,
        districts: {
          ...state.districts,
          [namespace]: data,
        },
      };
    },

    /**
     * 获取科目列表
     * @returns {object} 更新 subjectsData
     * @memberof module:model/expense/subject~expense/subject/reducers
     */
    reduceExpenseSubjects(state, action) {
      const subjectsData = {
        data: CostAccountingDetail.mapperEach(action.payload.data, CostAccountingDetail),
      };
      return { ...state, subjectsData };
    },

    /**
     * 获取推荐公司
     * @returns {object} 更新 subjectsData
     * @memberof module:model/expense/subject~expense/subject/reducers
     */
    reduceRecommendCompany(state, action) {
      return {
        ...state,
        recommendCompanyData: action.payload,
      };
    },

    /**
     * 获取所属场景
     * @returns {object} 更新 industryData
     * @memberof module:model/expense/subject~expense/subject/reducers
     */
    reduceIndustry(state, action) {
      return {
        ...state,
        industryData: action.payload,
      };
    },
    /**
     * 获取审批岗位信息
     * @returns {object} approvalJobs
     * @memberof module:model/expense/subject~expense/subject/reducers
     */
    reduceRecommendApprovalJobs(state, action) {
      return {
        ...state,
        approvalJobs: action.payload,
      };
    },
    /**
     * 成员列表
     * @returns {object} 更新 membersData
     * @memberof module:model/account/manage~account/manage/reducers
     */
    reduceMembersInfo(state, action) {
      return { ...state, membersData: action.payload };
    },

    /**
     * 合同甲方
     * @returns {array} 更新 contractBelong
     * @memberof module:model/account/manage~account/manage/reducers
     */
    reduceContractBelong(state, action) {
      let contractBelong = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        contractBelong = action.payload;
      }
      return {
        ...state,
        contractBelong,
      };
    },

    /**
     * 开户行信息
     * @returns {array} 更新 bankName
     * @memberof module:model/account/manage~account/manage/reducers
     */
    reduceBankName(state, action) {
      return { ...state, bankName: action.payload };
    },

    /**
     * 员工列表
     */
    reduceTeamMembers(state, action) {
      const {
        result = {},
        namespace = undefined,
      } = action.payload;

      const {
        teamMembers,
      } = state;

      let newData = {};

      if (namespace && is.existy(result) && is.not.empty(result)) {
        newData = {
          ...teamMembers,
          [namespace]: result,
        };
      }

      return { ...state, teamMembers: { ...newData } };
    },

    /**
     * 团队id
     */
    reduceTeam(state, action) {
      const {
        result = {},
        namespace = undefined,
      } = action.payload;

      const {
        teamList,
      } = state;

      let newTeamList = {};

      if (namespace && is.existy(result) && is.not.empty(result)) {
        newTeamList = {
          ...teamList,
          [namespace]: result,
        };
      }

      return { ...state, teamList: { ...newTeamList } };
    },

    /**
     * 部门树
     */
    reduceDepartments(state, action) {
      const { departments } = state;
      const { namespace, data } = action.payload;
      const flatDepartment = flatTree(data);
      return {
        ...state,
        departments: {
          ...departments,
          [namespace]: data,
        },
        flatDepartment,
      };
    },

    /**
     * 职位清单
     */
    reduceStaffs(state, action) {
      const staffs = Object.assign({}, state.staffs);
      const { namespace, data } = action.payload;
      if (is.not.empty(data) && is.existy(data)) {
        staffs[namespace] = {
          // eslint-disable-next-line no-underscore-dangle
          meta: ResponseMeta.mapper(data._meta),
          data: data.data,
        };
      } else {
        staffs[namespace] = {
          meta: {},
          data: [],
        };
      }

      return { ...state, staffs };
    },

    /**
     * 部门下职员列表
     */
    reduceDepartmentEmployees(state, action) {
      // 写入数据
      return { ...state, departmentEmployees: action.payload };
    },

    /**
     * 获取工作交接单下拉
     * @return {object} 更新 jobHandovers
     * @memberof module:model/oa/common~oa/common/reducers
     */
    reduceJobHandovers(state, action) {
      // 员工id和新数据
      const { employeeId, res } = action.payload;
      // 员工id作为命名空间写入新数据
      return {
        ...state,
        jobHandovers: {
          ...state.jobHandovers,
          [employeeId]: res,
        },
      };
    },

    // 抄送信息
    reduceCopyGiveInfo(state, action) {
      return {
        ...state,
        copyGiveInfo: action.payload,
      };
    },

    reduceEnumeratedValue(state, action) {
      let enumeratedValue = {};
      if (action.payload.enumeratedType) {
        const { enumeratedType = undefined } = action.payload;
        typeof enumeratedType === 'string' && (enumeratedValue = dealEnumerateVal(action, enumeratedType));
        Array.isArray(enumeratedType) && (enumeratedValue = enumeratedType.reduce(
          (odd, i) => {
            Object.assign(odd, dealEnumerateVal(action, i));
            return odd;
          },
          {},
        ));
        return { ...state, enumeratedValue: { ...state.enumeratedValue, ...enumeratedValue } };
      }
      return { ...state, enumeratedValue: {} };
    },

    /**
     * 部门及岗位树
     */
    reduceDepAndPost(state, action) {
      let depAndPostTree = [];
      if (is.existy(action.payload) && is.existy(action.payload.data)) {
        depAndPostTree = action.payload.data;
      }
      return { ...state, depAndPostTree };
    },

    /**
     * 枚举（未处理）
     */
    reduceAllEnumerated(state, action) {
      let allEnumerated = {};
      if (is.existy(action.payload)) {
        allEnumerated = action.payload;
      }

      return { ...state, allEnumerated };
    },
  },
};
