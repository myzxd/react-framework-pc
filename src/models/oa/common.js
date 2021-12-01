/**
 * oa - 公用
 *
 * @module model/oa/common
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';
import {
  fetchDepartmentInformation,
  fetchOrganizationJob,
  fetchCompanyList,
  fetchEmployeeDetail,
  getExamineFlowInfo,
  getEmployeeDepAndPostInfo,
  submitOrder,
  getViewRange,
} from '../../services/oa/common';
import { fetchCopyGiveInfo } from '../../services/common';
import { authorize } from '../../application';
import { OAOrderdMapper } from './helper';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'oaCommon',

  /**
   * 状态树
   */
  state: {
    departmentInformation: {}, // 部门信息
    organizationJobInfo: {},   // 岗位库列表信息
    companyList: [],           // 公司列表
    employeeDetail: {},        // 员工详情
    fixedCopyGiveInfo: [],     // 固定抄送信息
    examineFlowInfo: [], // 审批流信息
    accountDep: {}, // 人员所属所有部门及岗位
    viewRange: [], // 事务性提报入口可见key
  },

  /**
   * @namespace oa/common/effects
   */
  effects: {
    /**
     * 获取固定抄送信息
     * @memberof module:model/oa/common~oa/common/effects
     */
    * fetchFixedCopyGiveInfo({ payload = {} }, { call, put }) {
      const { flowId } = payload;
      if (is.not.existy(flowId) || is.empty(flowId)) {
        return message.error('审批流ID不能为空');
      }
      const result = yield call(fetchCopyGiveInfo, { flow_id: flowId });
      if (result) {
        const {
          fixed_cc_department_info_list: departments = [],
          fixed_cc_account_info_list: accounts = [],
        } = result;
        yield put({ type: 'reduceFixedCopyGiveInfo', payload: departments.concat(accounts) });
      }
    },
    /**
     * 重置固定抄送信息
     * @memberof module:model/oa/common~oa/common/effects
     */
    * resetFixedCopyGiveInfo({ payload = {} }, { put }) {
      yield put({ type: 'reduceFixedCopyGiveInfo', payload: {} });
    },
    /**
     * 获取部门信息
     * @memberof module:model/oa/common~oa/common/effects
     */
    * fetchDepartmentInformation({ payload = {} }, { call, put }) {
      const { staffProfileId } = authorize.account;
      if (is.not.existy(staffProfileId) || is.empty(staffProfileId)) {
        return message.error('提示：没有适用审批流，请联系流程管理员');
      }
      const params = {
        _id: staffProfileId,
      };
      const result = yield call(fetchDepartmentInformation, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      if (result) {
        yield put({ type: 'reduceDepartmentInformation', payload: result });
      }
    },
    /**
     * 岗位库下拉列表
     * @memberof module:model/oa/common~oa/common/effects
     */
    *fetchOrganizationJob({ payload = {} }, { call, put }) {
      const params = { ...payload };
      const res = yield call(fetchOrganizationJob, params);
      if (res && res.data) {
        yield put({ type: 'reduceOrganizationJob', payload: res });
      }
      // else if (res && res.zh_message) {
      //   return message.error(res.zh_message);
      // }
    },
    /**
     * 公司下拉列表
     * @memberof module:model/oa/common~oa/common/effects
     */
    *fetchCompanyList({ payload = {} }, { call, put }) {
      const params = { ...payload };
      const rs = yield call(fetchCompanyList, params);
      yield put({ type: 'reduceCompanyList', payload: rs });
      // 请求完成的回调
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback();
      }
    },
    /**
     * 重置公司下拉列表
     * @memberof module:model/oa/common~oa/common/effects
     */
    *resetCompanyList({ payload = {} }, { put }) {
      yield put({ type: 'reduceCompanyList', payload });
    },
    /**
     * 获取员工详情
     * @memberof module:model/oa/common~oa/common/effects
     */
    *fetchEmployeeDetail({ payload = {} }, { call, put }) {
      const { id } = payload;
      if (is.not.existy(id) || is.empty(id)) {
        message.error('员工id不能为空');
        return;
      }
      const params = { _id: id };
      const res = yield call(fetchEmployeeDetail, params);
      if (res && res._id) {
        yield put({ type: 'reduceEmployeeDetail', payload: res });
      }
    },
    /**
     * 重置员工详情
     * @memberof module:model/oa/common~oa/common/effects
     */
    *resetEmployeeDetail(_, { put }) {
      yield put({ type: 'reduceEmployeeDetail', payload: {} });
    },

    /**
     * 获取审批流预览信息
     * @memberof module:model/oa/common~oa/common/effects
     */
    getExamineFlowInfo: [
      function*({ payload = {} }, { call, put }) {
        const {
          flowId, // 审批流id
          departmentId, // 实际申请人部门id
          accountId, // 实际申请人id
          specialDepartmentId, // 特殊表单部门id
          specialAccountId, // 特殊表单人员id
        } = payload;
        if (!flowId) return;
        const params = {
          id: flowId,
        };
        // 实际申请人部门id
        departmentId && (params.actual_department_id = departmentId);
        // 实际申请人id
        accountId && (params.actual_account_id = accountId);
        // 特殊表单部门id
        specialDepartmentId && (params.special_department_id = specialDepartmentId);
        // 特殊表单人员id
        if (is.existy(specialAccountId) && is.not.empty(specialAccountId)) {
          params.special_account_id = specialAccountId;
        }
        const res = yield call(getExamineFlowInfo, params);

        if (res) {
          yield put({ type: 'reduceExamineFlowInfo', payload: res });
        }
      },
      { type: 'takeLatest' },
    ],
    /**
     * 重置审批流信息
     * @memberof module:model/oa/common~oa/common/effects
     */
    *resetExamineFlowInfo(_, { put }) {
      yield put({ type: 'reduceExamineFlowInfo', payload: {} });
    },

    /**
     * 获取人员所属所有部门及岗位
     */
    *getEmployeeDepAndPostInfo({ payload = {} }, { call, put }) {
      const {
        accountId,
      } = payload;
      if (!accountId) return message.error('缺少人员id');
      const res = yield call(getEmployeeDepAndPostInfo, { _id: accountId });

      if (res && res._id) {
        yield put({ type: 'reduceEmployeeDepAndPostInfo', payload: res });
      }
    },

    /**
     * 提交事务性审批单
     */
    *submitOrder({ payload = {} }, { call }) {
      const { id, onSuccessCallback, onErrorCallback, isOa } = payload;
      if (!id) {
        onErrorCallback && onErrorCallback();
        return message.error('缺少审批单id');
      }
      const params = { id, ...OAOrderdMapper(payload) };

      const res = yield call(submitOrder, params);

      if (res && res.ok) {
        if (isOa === true) {
          message.success('创建成功');
        }
        onSuccessCallback && onSuccessCallback();
        return res;
      }
      onErrorCallback && onErrorCallback();
      return undefined;
    },

    /**
     * 获取事务性提报入口可见范围
     */
    *getViewRange({ payload = {} }, { call, put }) {
      const res = yield call(getViewRange, payload);
      if (res) {
        yield put({ type: 'reduceViewRange', payload: res });
      }
    },

    /**
     * 重置事务性提报入口可见范围
     */
    *resetViewRange(_, { put }) {
      yield put({ type: 'reduceViewRange' });
    },
  },

  /**
   * @namespace oa/common/reducers
   */
  reducers: {
    /**
     * 获取固定抄送信息
     * @return {object} 更新 fixedCopyGiveInfoInfo
     * @memberof module:model/oa/common~oa/common/reducers
     */
    reduceFixedCopyGiveInfo(state, action) {
      return {
        ...state,
        fixedCopyGiveInfo: action.payload,
      };
    },
    /**
     * 获取部门信息
     * @return {object} 更新 departmentInformation
     * @memberof module:model/oa/common~oa/common/reducers
     */
    reduceDepartmentInformation(state, action) {
      return {
        ...state,
        departmentInformation: action.payload,
      };
    },
    /**
     * 岗位库下拉列表
     * @return {object} 更新 organizationJobInfo
     * @memberof module:model/oa/common~oa/common/reducers
     */
    reduceOrganizationJob(state, action) {
      return {
        ...state,
        organizationJobInfo: action.payload,
      };
    },
    /**
     * 公司下拉列表
     * @return {object} 更新 companyList
     * @memberof module:model/oa/common~oa/common/reducers
     */
    reduceCompanyList(state, action) {
      return {
        ...state,
        companyList: action.payload,
      };
    },
    /**
     * 获取员工详情
     * @return {object} 更新 employeeDetail
     * @memberof module:model/oa/common~oa/common/reducers
     */
    reduceEmployeeDetail(state, action) {
      return {
        ...state,
        employeeDetail: action.payload,
      };
    },

    /**
     * 更新审批流信息
     * @return {object} 更新 examineFlowInfo
     * @memberof module:model/oa/common~oa/common/reducers
     */
    reduceExamineFlowInfo(state, action) {
      let examineFlowInfo = [];
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        examineFlowInfo = action.payload;
      }
      return {
        ...state,
        examineFlowInfo,
      };
    },

    /**
     * 更新人员部门&岗位信息
     */
    reduceEmployeeDepAndPostInfo(state, action) {
      let accountDep = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        const {
          department_info_list: department = [],
          department_job_relation_info: lordPost = {},
          pluralism_department_job_relation_list: deputyList = [],
        } = action.payload;
        accountDep = {
          departmentList: department,
          postList: [lordPost, ...deputyList],
        };
      }
      return {
        ...state,
        accountDep,
      };
    },

    /**
     * 更新事务性审批提报入口可见范围
     */
    reduceViewRange(state, action) {
      let viewRange = [];
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        viewRange = action.payload.view_application_types;
      }

      return { ...state, viewRange };
    },
  },
};
