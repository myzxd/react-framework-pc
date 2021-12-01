/**
 * 组织架构 - 部门管理 - 业务信息Tab
 * @module model/organization/manage/business
 **/
import _ from 'lodash';
import is from 'is_js';
import { message } from 'antd';

import {
  getBusiness,
  getPlatformList,
  getSupplierList,
  getCityList,
  createBusinessTag,
  updateBusinessTag,
  gainDataPermissionValidator,
} from '../../../services/organization/manage/business';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'organizationBusiness',
  /**
   * 状态树
   * @prop {object} departmentBusiness 部门下业务信息
   * @prop {object} platformList 平台
   * @prop {object} supplierList 供应商
   * @prop {object} cityList 城市
   */
  state: {
    businessTag: {},
    staffBusinessTag: {},
    platformList: {},
    allPlatformList: {},
    supplierList: {},
    cityList: [],
  },
  /**
   * @namespace organization/manage/business/effects
   */
  effects: {
    /**
     * 获取部门下业务信息
     * @param {string} id 部门id
     * @memberof module:model/organization/manage/business~organization/manage/business/effects
     */
    * getBusiness({ payload = {} }, { call, put }) {
      // 部门id、岗位id
      const { departmentId = undefined } = payload;
      const params = {};
      if (!is.existy(departmentId) || is.empty(departmentId)) {
        return message.error('缺少部门id');
      }

      // 部门id
      departmentId && (params._id = departmentId);

      const result = yield call(getBusiness, params);

      if (is.existy(result)) {
        yield put({ type: 'reduceBusiness', payload: result });
      }
    },

    /**
     * 获取岗位下业务信息
     * @param {string} staffId 岗位id
     * @memberof module:model/organization/manage/business~organization/manage/business/effects
     */
    * getStaffBusiness({ payload = {} }, { call, put }) {
      // 岗位id
      const { staffId = undefined } = payload;
      const params = {};
      if (!is.existy(staffId) || is.empty(staffId)) {
        return message.error('缺少岗位id');
      }

      // 岗位id
      staffId && (params._id = staffId);

      const result = yield call(getBusiness, params);

      if (is.existy(result)) {
        yield put({ type: 'reduceStaffBusiness', payload: result });
      }
    },

    /**
     * 新增业务信息
     * @param {string} departmentId 部门id
     * @param {string} jobId 岗位id
     * @param {number} level 标签级别
     * @param {number} type 类型
     * @param {array} cityCodes 城市标签
     * @param {array} supplierIds 供应商标签
     * @param {array} platformCodes 平台标签
     * @param {array} teamAttrs 团队标签
     * @param {array} customAttrs 自定义标签
     * @param {string} departmentJobRelationId 部门岗位关联id
     * @memberof module:model/organization/manage/business~organization/manage/business/effects
     */
    * createBusinessTag({ payload = {} }, { call }) {
      const {
        departmentId = undefined,
        staffId = undefined,
        level = undefined,
        cityCodes = undefined,
        supplierIds = undefined,
        platformCodes = undefined,
        costCenter = undefined,
        departmentJobRelationId = undefined,
        type = undefined,
        teamAttrs = undefined,
        customAttrs = undefined,
        scense = undefined,
        onSuccessCallback,
        onFailureCallback,
      } = payload;

      if (!is.existy(departmentId) && !is.existy(staffId)) {
        return message.error('缺少id');
      }

      const params = {
        city_codes: [],
        supplier_ids: [],
        platform_codes: [],
        team_attrs: [],
        custom_attrs: [],
        cost_center_type: undefined,
      };

      // 部门id
      is.existy(departmentId) && is.not.empty(departmentId) && (params.department_id = departmentId, params.level = 10);
      // 岗位id
      is.existy(staffId) && is.not.empty(staffId) && (params.department_job_relation_id = staffId, params.level = 20);
      // 标签级别
      is.existy(level) && is.not.empty(level) && (params.level = level);
      // 城市编码列表
      is.existy(cityCodes) && is.not.empty(cityCodes) && (params.city_codes = Array.isArray(cityCodes) ? cityCodes : [cityCodes]);
      // supplier_ids
      is.existy(supplierIds) && is.not.empty(supplierIds) && (params.supplier_ids = Array.isArray(supplierIds) ? supplierIds : [supplierIds]);
      // 平台CODE
      is.existy(platformCodes) && is.not.empty(platformCodes) && (params.platform_codes = Array.isArray(platformCodes) ? platformCodes : [platformCodes]);
      // 类型
      is.existy(type) && is.not.empty(type) && (params.type = Number(type));
      // 成本中心
      is.existy(costCenter) && is.not.empty(costCenter) && (params.cost_center_type = Number(costCenter));
      // 团队属性
      is.existy(teamAttrs) && is.not.empty(teamAttrs) && (params.team_attrs = Array.isArray(teamAttrs) ? teamAttrs : [teamAttrs]);
      // 自定义属性
      is.existy(customAttrs) && is.not.empty(customAttrs) && (params.custom_attrs = customAttrs);
      // 部门岗位关联id
      is.existy(departmentJobRelationId) && is.not.empty(departmentJobRelationId) && (params.department_job_relation_id = departmentJobRelationId);
      // 场景
      is.existy(scense) && is.not.empty(scense) && (params.industry_codes = scense);

      const result = yield call(createBusinessTag, params);
      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 编辑业务信息
     * @param {string} departmentId 部门id
     * @param {string} jobId 岗位id
     * @param {number} level 标签级别
     * @param {number} type 类型
     * @param {array} cityCodes 城市标签
     * @param {array} supplierIds 供应商标签
     * @param {array} platformCodes 平台标签
     * @param {array} teamAttrs 团队标签
     * @param {array} customAttrs 自定义标签
     * @param {string} departmentJobRelationId 部门岗位关联id
     * @memberof module:model/organization/manage/business~organization/manage/business/effects
     */
    * updateBusinessTag({ payload = {} }, { call }) {
      const {
        departmentId = undefined,
        staffId = undefined,
        level = undefined,
        cityCodes = undefined,
        supplierIds = undefined,
        platformCodes = undefined,
        departmentJobRelationId = undefined,
        teamAttrs = undefined,
        customAttrs = undefined,
        costCenter = undefined,
        type,
        scense = undefined,
        onSuccessCallback,
        onFailureCallback,
      } = payload;

      if (!is.existy(departmentId) && !is.existy(staffId)) {
        return message.error('缺少id');
      }

      const params = {
        city_codes: [],
        supplier_ids: [],
        platform_codes: [],
        team_attrs: [],
        custom_attrs: [],
        cost_center_type: undefined,
      };

      // 部门id
      is.existy(departmentId) && is.not.empty(departmentId) && (params._id = departmentId);
      // 岗位id
      is.existy(staffId) && is.not.empty(staffId) && (params._id = staffId);
      // 标签级别
      is.existy(level) && is.not.empty(level) && (params.level = level);
      // 城市编码列表
      is.existy(cityCodes) && is.not.empty(cityCodes) && (params.city_codes = Array.isArray(cityCodes) ? cityCodes : [cityCodes]);
      // 供应商标签
      is.existy(supplierIds) && is.not.empty(supplierIds) && (params.supplier_ids = Array.isArray(supplierIds) ? supplierIds : [supplierIds]);
      // 平台CODE
      is.existy(platformCodes) && is.not.empty(platformCodes) && (params.platform_codes = Array.isArray(platformCodes) ? platformCodes : [platformCodes]);
      // 类型
      is.existy(type) && is.not.empty(type) && (params.type = Number(type));
      // 成本中心
      is.existy(costCenter) && is.not.empty(costCenter) && (params.cost_center_type = Number(costCenter));
      // 团队属性
      is.existy(teamAttrs) && is.not.empty(teamAttrs) && (params.team_attrs = Array.isArray(teamAttrs) ? teamAttrs : [teamAttrs]);
      // 自定义属性
      is.existy(customAttrs) && is.not.empty(customAttrs) && (params.custom_attrs = customAttrs);
      // 部门岗位关联id
      is.existy(departmentJobRelationId) && is.not.empty(departmentJobRelationId) && (params.department_job_relation_id = departmentJobRelationId);

      // 场景
      is.existy(scense) && is.not.empty(scense) && (params.industry_codes = scense);

      const result = yield call(updateBusinessTag, params);
      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 全量平台
     * @param {boolean} is_auth 全量数据
     */
    * getAllPlatformList({ payload = {} }, { call, put }) {
      const params = {
        is_auth: false, // 全量数据
        _meta: {
          page: 1,
          limit: 9999,
        },
      };

      const result = yield call(getPlatformList, params);

      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceAllPlatformList', payload: result });
      }
    },

    /**
     * 平台
     * @param {boolean} is_auth 全量数据
     */
    * getPlatformList({ payload = {} }, { call, put }) {
      const params = {
        is_auth: false, // 全量数据
        _meta: {
          page: 1,
          limit: 9999,
        },
      };

      // 场景
      Array.isArray(payload.scense) && payload.scense.length > 0 && (params.industry_codes = payload.scense);

      const result = yield call(getPlatformList, params);

      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reducePlatformList', payload: result });
      }
    },

    /**
     * 供应商
     * @param {boolean} is_auth 全量数据
     */
    * getSupplierList({ payload = {} }, { call, put }) {
      const params = {
        is_auth: false, // 全量数据
      };
      const result = yield call(getSupplierList, params);
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceSuppliersList', payload: result });
      }
    },

    /**
     * 城市
     * @param {boolean} is_auth 全量数据
     */
    * getCityList({ payload = {} }, { call, put }) {
      const params = {
        is_auth: false, // 全量数据
      };
      const result = yield call(getCityList, params);
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceCityList', payload: result });
      }
    },

    /**
     * 是否开启数据权限开关
     * @param {boolean} is_auth 全量数据
     */
    * gainDataPermissionValidator({ payload = {} }, { call }) {
      const result = yield call(gainDataPermissionValidator);
      return result;
    },

    /**
     * 重置部门下业务信息
     */
    * resetBusiness({ payload = {} }, { put }) {
      yield put({ type: 'reduceBusiness', payload });
    },

    /**
     * 重置岗位下业务信息
     */
    * resetStaffBusiness({ payload = {} }, { put }) {
      yield put({ type: 'reduceStaffBusiness', payload });
    },
  },
  /**
   * @namespace organization/manage/business/reducers
   */
  reducers: {
    /**
     * 部门下业务信息
     * @returns {object} 更新 businessTag
     * @memberof module:model/organization/manage/business/deductions~organization/manage/business/reducers
     */
    reduceBusiness(state, action) {
      let businessTag = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        businessTag = action.payload;
      }
      return { ...state, businessTag };
    },

    /**
     * 岗位下业务信息
     * @returns {object} 更新 staffBusinessTag
     * @memberof module:model/organization/manage/business/deductions~organization/manage/business/reducers
     */
    reduceStaffBusiness(state, action) {
      let staffBusinessTag = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        staffBusinessTag = action.payload;
      }
      return { ...state, staffBusinessTag };
    },

    /**
     * 全量平台
     * @returns {object} 更新 platformList
     * @memberof module:model/organization/manage/business/deductions~organization/manage/business/reducers
     */
    reduceAllPlatformList(state, action) {
      let allPlatformList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        allPlatformList = action.payload;
      }
      return { ...state, allPlatformList };
    },

    /**
     * 平台
     * @returns {object} 更新 platformList
     * @memberof module:model/organization/manage/business/deductions~organization/manage/business/reducers
     */
    reducePlatformList(state, action) {
      let platformList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        platformList = action.payload;
      }
      return { ...state, platformList };
    },

    /**
     * 供应商
     * @returns {object} 更新 supplierList
     * @memberof module:model/organization/manage/business/deductions~organization/manage/business/reducers
     */
    reduceSuppliersList(state, action) {
      let supplierList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        supplierList = action.payload;
      }
      return { ...state, supplierList };
    },

    /**
     * 城市
     * @returns {object} 更新 cityList
     * @memberof module:model/organization/manage/business/deductions~organization/manage/business/reducers
     */
    reduceCityList(state, action) {
      let cityList = [];
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        const { city_list: originalData = [] } = action.payload;

        // 过滤出不需要去重比较的参数
        const filterData = originalData.map(data => _.omit(data, ['city_name_joint', 'city_spelling', 'platform_code', 'platform_name']));

        // 去重
        cityList = _.uniqWith(filterData, _.isEqual);
      }
      return { ...state, cityList };
    },
  },
};
