/**
 * 组织架构 - 部门管理 - 岗位Tab
 * @module model/organization/manage/staffs
 **/
import is from 'is_js';
import moment from 'moment';
import { message } from 'antd';

import {
  getDepartmentStaffs,
  createDepartmentStaff,
  updateDepartmentStaff,
  getStaffDetail,
  getStaffMember,
  setOrganizationCount,
  createApproveOrganizationCount,
  updateApproveOrganizationCount,
  createOrganizationPost,
  createApproveOrganizationPost,
  updateApproveOrganizationPost,
  onCloseApproveOrder,
  onDeletePost,
} from '../../../services/organization/manage/staffs.jsx';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'organizationStaffs',
  /**
   * 状态树
   * @prop {object} staffList 部门下岗位列表
   * @prop {object} staffDetail 岗位详情
   * @prop {object} staffMember 岗位下成员
   */
  state: {
    staffList: {},
    staffDetail: {},
    staffMember: {},
  },
  /**
   * @namespace organization/manage/staffs/effects
   */
  effects: {
    /**
     * 获取部门下岗位列表
     * @param {string} departmentId 部门id
     * @param {string} name 部门名称
     * @memberof module:model/organization/manage/staffs~organization/manage/staffs/effects
     */
    getDepartmentStaffs: [
      function*({ payload = {} }, { call, put }) {
        const { departmentId = undefined, name = undefined, page = 1, limit = 30 } = payload;
        // 部门id
        if (!is.existy(departmentId) || is.empty(departmentId)) {
          return message.error('缺少部门id');
        }
        const params = {
          department_id: departmentId,
          _meta: { page, limit },
        };

        name && (params.name = name);
        departmentId && (params.department_id = departmentId);

        const result = yield call(getDepartmentStaffs, params);
        if (is.existy(result) && is.not.empty(result)) {
          yield put({ type: 'reduceDepartmentStaffs', payload: result });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 添加部门下岗位
     * @param {string} departmentId 部门id
     * @param {string} jobId 岗位id
     * @param {number} organizationCount 岗位编制数
     * @param {string} description 岗位描述
     */
    * createDepartmentStaff({ payload = {} }, { call }) {
      const {
        departmentId = undefined,
        jobId = undefined,
        organizationCount = undefined,
        description = undefined,
        onSuccessCallback,
        onFailureCallback,
      } = payload;

      if (!is.existy(departmentId) || is.empty(departmentId)) {
        return message.error('缺少部门id');
      }

      const params = { department_id: departmentId };
      jobId && (params.job_id = jobId); // 岗位id
      organizationCount && (params.organization_count = organizationCount); // 岗位编制数
      description && (params.description = description); // 岗位描述

      const result = yield call(createDepartmentStaff, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 编辑部门下岗位
     * @param {string} jobId 岗位id
     * @param {number} organizationCount 岗位编制数
     * @param {string} description 岗位描述
     */
    * updateDepartmentStaff({ payload = {} }, { call }) {
      const {
        jobId = undefined,
        organizationCount = undefined,
        description = undefined,
        onSuccessCallback,
        onFailureCallback,
      } = payload;

      if (!is.existy(jobId) || is.empty(jobId)) {
        onFailureCallback && onFailureCallback(result);
        return message.error('缺少岗位id');
      }

      const params = {};
      jobId && (params._id = jobId); // 岗位id
      Number(organizationCount) >= 0 && (params.organization_count = organizationCount); // 岗位编制数
      description && (params.description = description); // 岗位描述

      const result = yield call(updateDepartmentStaff, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 删除部门下岗位
     * @param {string} staffId 岗位id
     */
    *onDeletePost({ payload = {} }, { call }) {
      const {
        relaId = undefined,
      } = payload;

      if (!is.existy(relaId) || is.empty(relaId)) {
        return message.error('缺少关联id');
      }

      const res = yield call(onDeletePost, { _id: relaId, state: -100 });
      return res;
    },

    /**
     * 获取岗位详情
     * @param {string} staffId 岗位id
     */
    * getStaffDetail({ payload = {} }, { call, put }) {
      const { staffId = undefined } = payload;

      if (!is.existy(staffId) || is.empty(staffId)) {
        return message.error('缺少岗位id');
      }

      const result = yield call(getStaffDetail, { _id: staffId });

      if (result && result._id) {
        yield put({ type: 'reduceStaffDetail', payload: result });
      }
    },

    /**
     * 获取岗位下成员列表
     * @param {string} staffId 岗位id
     * @memberof module:model/organization/manage/staffs~organization/manage/staffs/effects
     */
    * getStaffMember({ payload = {} }, { call, put }) {
      const { staffId = undefined, page = 1, limit = 30 } = payload;

      // 岗位id
      if (!is.existy(staffId) || is.empty(staffId)) {
        return message.error('缺少岗位id');
      }
      const params = {
        department_job_relation_id: staffId,
        _meta: { page, limit },
        profile_type: 30,
      };

      const result = yield call(getStaffMember, params);
      if (is.existy(result)) {
        yield put({ type: 'reduceStaffMember', payload: result });
      }
    },

    /**
     * 重置部门下岗位列表
     */
    * resetDepartmentStaffs({ payload = {} }, { put }) {
      yield put({ type: 'reduceDepartmentStaffs', payload });
    },

    /**
     * 重置岗位详情
     */
    * resetStaffDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceStaffDetail', payload });
    },

    /**
     * 重置岗位下成员列表
     */
    * resetStaffMember({ payload = {} }, { put }) {
      yield put({ type: 'reduceStaffMember', payload });
    },

    /**
     * 设置组织架构岗位编制数（不走审批）
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    *setOrganizationCount({ payload = {} }, { call }) {
      const {
        organizationSubType, // 操作类型
        departmentId, // 部门id
        jobId, // 岗位id
        peopleNum, // 编制数
        takeEffectDate, // 生效时间
        note, // 调整原因
        assetKeys, // 附件
      } = payload;

      const params = {};

      // 操作类型
      organizationSubType && (params.organization_sub_type = organizationSubType);
      // 部门id
      departmentId && (params.department_id = departmentId);
      // 岗位id
      jobId && (params.job_id = jobId);
      // 编制数
      peopleNum && (params.people_num = peopleNum);
      // 生效时间
      takeEffectDate && (params.take_effect_date = Number(moment(takeEffectDate).format('YYYYMMDD')));
      // 调整原因
      note && (params.note = note);
      // 附件
      assetKeys && Array.isArray(assetKeys) && (params.asset_keys = assetKeys.map(a => a.key));

      const res = yield call(setOrganizationCount, params);
      return res;
    },

    /**
     * 组织架构岗位编制数调整申请（走审批）
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    *setApproveOrganizationCount({ payload = {} }, { call }) {
      const {
        organizationSubType, // 操作类型
        oaFlowId, // 审批流id
        departmentId, // 部门id
        jobId, // 岗位id
        peopleNum, // 编制数
        takeEffectDate, // 生效时间
        note, // 调整原因
        assetKeys, // 附件
        applicationId, // 申请单id
        isUpdate,
      } = payload;

      const params = {};

      // 操作类型
      !isUpdate && organizationSubType && (params.organization_sub_type = organizationSubType);
      // 审批流id
      !isUpdate && oaFlowId && (params.oa_flow_id = oaFlowId);
      // 部门id
      !isUpdate && departmentId && (params.department_id = departmentId);
      // 岗位id
      !isUpdate && jobId && (params.job_id = jobId);
      // 编制数
      peopleNum && (params.people_num = peopleNum);
      // 生效时间
      takeEffectDate && (params.take_effect_date = Number(moment(takeEffectDate).format('YYYYMMDD')));
      // 调整原因
      note && (params.note = note);
      // 附件
      assetKeys && Array.isArray(assetKeys) && (params.asset_keys = assetKeys.map(a => a.key));
      // 申请单id
      isUpdate && applicationId && (params._id = applicationId);

      const res = isUpdate ?
       // 编辑申请单
       yield call(updateApproveOrganizationCount, params)
       // 新建申请单
       : yield call(createApproveOrganizationCount, params);
      return res;
    },

    /**
     * 组织架构创建岗位（不走审批）
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    *createOrganizationPost({ payload = {} }, { call }) {
      const {
        departmentId, // 部门id
        jobId, // 岗位id
        peopleNum, // 编制数
        takeEffectDate, // 生效时间
        note, // 调整原因
        assetKeys, // 附件
        description, // 岗位描述
      } = payload;

      const params = {};

      // 部门id
      departmentId && (params.department_id = departmentId);
      // 岗位id
      jobId && (params.job_id = jobId);
      // 编制数
      (peopleNum || peopleNum === 0) && (params.organization_count = peopleNum);
      // 生效时间
      takeEffectDate && (params.take_effect_date = Number(moment(takeEffectDate).format('YYYYMMDD')));
      // 调整原因
      note && (params.note = note);
      // 附件
      assetKeys && Array.isArray(assetKeys) && (params.asset_keys = assetKeys.map(a => a.key));
      // 岗位描述
      description && (params.description = description);

      const res = yield call(createOrganizationPost, params);
      return res;
    },

    /**
     * 组织架构创建岗位申请（走审批）
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    *setApproveOrganizationPost({ payload = {} }, { call }) {
      const {
        oaFlowId, // 审批流id
        departmentId, // 部门id
        jobId, // 岗位id
        peopleNum, // 编制数
        takeEffectDate, // 生效时间
        note, // 调整原因
        assetKeys, // 附件
        applicationId, // 申请单id
        isUpdate,
        description, // 岗位描述
      } = payload;

      const params = {};

      // 审批流id
      !isUpdate && oaFlowId && (params.oa_flow_id = oaFlowId);
      // 部门id
      !isUpdate && departmentId && (params.department_id = departmentId);
      // 岗位id
      jobId && (params.job_id = jobId);
      // 编制数
      (peopleNum || peopleNum === 0) && (params.organization_count = peopleNum);
      // 生效时间
      takeEffectDate && (params.take_effect_date = Number(moment(takeEffectDate).format('YYYYMMDD')));
      // 调整原因
      note && (params.note = note);
      // 附件
      assetKeys && Array.isArray(assetKeys) && (params.asset_keys = assetKeys.map(a => a.key));
      // 申请单id
      isUpdate && applicationId && (params._id = applicationId);
      // 岗位描述
      description && (params.description = description);

      const res = isUpdate ?
        yield call(updateApproveOrganizationPost, params)
        : yield call(createApproveOrganizationPost, params);
      return res;
    },

    /**
     * 关闭审批单
     */
    *onCloseApproveOrder({ payload }, { call }) {
      const { oaOrganizationOrderId } = payload;
      if (!oaOrganizationOrderId) return message.error('缺少申请单id');
      const params = { oa_organization_order_id: oaOrganizationOrderId };
      const res = yield call(onCloseApproveOrder, params);
      return res;
    },
  },
  /**
   * @namespace organization/manage/staffs/reducers
   */
  reducers: {
    /**
     * 部门下岗位列表
     * @returns {object} 更新 staffList
     * @memberof module:model/organization/manage/staffs/deductions~organization/manage/staffs/reducers
     */
    reduceDepartmentStaffs(state, action) {
      let staffList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        staffList = action.payload;
      }
      return { ...state, staffList };
    },

    /**
     * 岗位详情
     * @returns {object} 更新 staffDetail
     * @memberof module:model/organization/manage/staffs/deductions~organization/manage/staffs/reducers
     */
    reduceStaffDetail(state, action) {
      let staffDetail = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        staffDetail = action.payload;
      }
      return { ...state, staffDetail };
    },

    /**
     * 岗位下成员列表
     * @returns {object} 更新 staffMember
     * @memberof module:model/organization/manage/staffs/deductions~organization/manage/staffs/reducers
     */
    reduceStaffMember(state, action) {
      let staffMember = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        staffMember = action.payload;
      }
      return { ...state, staffMember };
    },
  },
};
