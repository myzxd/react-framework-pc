/**
 * 组织架构 - 部门管理 - 部门Tab
 * @module model/organization/manage/department
 **/
import is from 'is_js';
import { message } from 'antd';

import {
  getDepartmentTree,
  getDepartmentDetail,
  createDepartment,
  updateDepartment,
  getDepartmentMember,
  getChildDepartmentList,
  deleteDepartment,
  exportMember,
  exportDepartment,
  checkDeleteDepartment,
  createOaUpperDepartment,
  updateOaUpperDepartment,
  checkDepartmentUpdate,
  createOaSubDepartment,
  updateOaSubDepartment,
  closeOaOrganizationOrder,
  createRevokeDepartment,
  updateRevokeDepartment,
  getOrganizationConfig,
  getOrganizationFlowList,
  findDepartmentOrderList,
} from '../../../services/organization/manage/department.jsx';

import { OrganizationDepartmentState, FileType } from '../../../application/define';

// 树状结构扁平处理
const flatTree = (data) => {
  const res = [{ _id: '0', name: '无' }];
  if (Array.isArray(data) && data.length > 0) {
    data.forEach((i) => {
      const assignment = (n) => {
        res[res.length] = {
          name: n.node.name,
          _id: n.node._id,
          pid: n.node.pid,
          code: n.node.code,
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

export default {
  /**
  * 命名空间
  * @default
  */
  namespace: 'department',
  /**
   * 状态树
   * @prop {object} departmentTree 部门Tree
   * @prop {object} departmentDetail 部门详情
   * @prop {object} departmentMember 部门下成员
   * @prop {object} childDepartmentList 部门下级部门
   * @prop {object} departmentOrderList 部门/编制申请单列表信息
   * @prop {object} expenseDepartment 部门（费用模块成本分摊）
   */
  state: {
    departmentTree: [],
    departmentDetail: {},
    departmentMember: {},
    childDepartmentList: {},
    departmentOrderList: {},
    expenseDepartment: {},
  },
  /**
   * @namespace organization/manage/department/effects
   */
  effects: {
    /**
     * 获取部门tree
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * getDepartmentTree({ payload = {} }, { call, put }) {
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
      const result = yield call(getDepartmentTree, params);

      if (is.existy(result)) {
        yield put({ type: 'reduceDepartmentTree', payload: result });
      }
    },

    /**
     * 获取部门详情
     * @param {string} id 部门id
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * getDepartmentDetail({ payload = {} }, { call, put }) {
      const { id = undefined, onSuccessCallback } = payload;
      const params = {};

      // 部门id
      if (is.existy(id) && is.not.empty(id)) {
        params._id = payload.id;
      }

      const result = yield call(getDepartmentDetail, params);

      if (result && result._id) {
        onSuccessCallback && onSuccessCallback(result);
        yield put({ type: 'reduceDepartmentDetail', payload: result });
        return result;
      }
    },

    /**
     * 新建部门
     * @param {string} name 部门名称
     * @param {string} code 部门编号
     * @param {string} superior 上级部门
     * @param {string} administratorId 部门负责人id
     * @param {func} onSuccessCallback 成功回调
     * @param {func} onFailureCallback 失败回调
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * createDepartment({ payload = {} }, { call }) {
      const {
        name = undefined,
        code = undefined,
        superior = undefined,
        administratorId = undefined,
        jobList, // 岗位列表
        onSuccessCallback,
        onFailureCallback,
        onChangeIsSubmit,               // 改变弹窗提交按钮状态
      } = payload;

      const params = {};
      name && (params.name = name); // 部门名称
      code && (params.code = code); // 部门编号
      superior && (params.pid = superior); // 上级部门
      superior === '0' && (params.pid = null); // 上级部门
      administratorId && (params.administrator_id = administratorId); // 部门负责人id
      // 岗位列表
      if (jobList && Array.isArray(jobList)) {
        params.job_list = jobList.map(item => ({
          job_id: item.jobId,
          organization_count: Number(item.organizationCount),
          description: item.description,
        }));
      }

      const result = yield call(createDepartment, params);

      // 改变弹窗提交按钮回调
      if (onChangeIsSubmit) {
        onChangeIsSubmit();
      }

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback(result);
        return result;
      } else {
        onFailureCallback && onFailureCallback(result);
        return undefined;
      }
    },

    /**
     * 编辑部门
     * @param {string} id 部门id
     * @param {string} name 部门名称
     * @param {string} code 部门编号
     * @param {string} superior 上级部门
     * @param {string} administratorId 部门负责人id
     * @param {func} onSuccessCallback 成功回调
     * @param {func} onFailureCallback 失败回调
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * updateDepartment({ payload = {} }, { call }) {
      const {
        id = undefined,
        name = undefined,
        code = undefined,
        superior = undefined,
        administratorId = undefined,
        onSuccessCallback,
        onFailureCallback,
        onChangeIsSubmit,               // 改变弹窗提交按钮状态
      } = payload;

      // 部门id
      if (!is.existy(id) || is.empty(id)) {
        return message.error('缺少部门id');
      }

      const params = { _id: id };
      name && (params.name = name); // 部门名称
      code && (params.code = code); // 部门编号
      superior && (params.pid = superior); // 上级部门
      if (administratorId) {
        if (administratorId === 'remove') {
          params.administrator_id = 'remove';
        } else {
          params.administrator_id = administratorId;  // 部门负责人id
        }
      }

      superior === '0' && (params.pid = null); // 上级部门
      const result = yield call(updateDepartment, params);

      // 改变弹窗提交按钮回调
      if (onChangeIsSubmit) {
        onChangeIsSubmit();
      }

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback(result);
        return result;
      } else {
        onFailureCallback && onFailureCallback(result);
        return undefined;
      }
    },

    /**
     * 获取当前部门下级部门
     * @param {string} id 部门id
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * getChildDepartmentList({ payload = {} }, { call, put }) {
      const {
        id = undefined,
        page = 1,
        limit = 30,
        teamAttr,
      } = payload;
      const params = { _meta: { page, limit } };

      // 部门id
      if (is.existy(id) && is.not.empty(id)) {
        params.pid = id;
      }
      // 成本中心
      if (is.existy(teamAttr) && is.not.empty(teamAttr)) {
        params.team_attr = teamAttr;
      }

      const result = yield call(getChildDepartmentList, params);
      if (result && result.data) {
        yield put({ type: 'reduceChildDepartmentList', payload: result });
      }
    },

    /**
     * 部门/编制申请单列表
     * @param {string} id 部门id
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * findDepartmentOrderList({ payload = {} }, { call, put }) {
      const {
        page = 1,
        limit = 30,
        state, // 组织架构-部门/编制申请单生效状态
        organizationSubTypes, // 组织架构-部门/编制调整 子类型
        departmentId, // 部门id
        targetParentDepartmentId, // 提交申请时当前上级部门id
        orderNameSpace,
      } = payload;
      const params = {
        _meta: { page, limit },
        organization_sub_type: organizationSubTypes,
        take_effect_state: Array.isArray(state) ? state : [state],
      };

      departmentId && (params.department_id = departmentId);
      targetParentDepartmentId && (params.target_parent_department_id = targetParentDepartmentId);

      const result = yield call(findDepartmentOrderList, params);
      if (result && result.data) {
        yield put({ type: 'reduceDepartmentOrderList', payload: { result, orderNameSpace } });
      }
    },

    /**
     * 获取部门（费用模块成本分摊）
     * @param {string} id 部门id
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * getExpenseDepartment({ payload = {} }, { call, put }) {
      const { id = undefined, page = 1, limit = 30, teamAttr, namespace = 'default', isAuthorized } = payload;
      const params = { _meta: { page, limit } };

      // 部门id
      if (is.existy(id) && is.not.empty(id)) {
        params.pid = id;
      }
      // 成本中心
      if (is.existy(teamAttr) && is.not.empty(teamAttr)) {
        params.team_attr = teamAttr;
      }

      isAuthorized && (params.is_authorized = isAuthorized);

      const result = yield call(getChildDepartmentList, params);
      if (is.existy(result)) {
        yield put({ type: 'reduceExpenseDepartment', payload: { namespace, data: result } });
      }
    },


    /**
     * 获取部门下成员
     * @param {string} id 部门id
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    getDepartmentMember: [
      function* ({ payload = {} }, { call, put }) {
        const { id = undefined, page = 1, limit = 30 } = payload;
        const params = { _meta: { page, limit }, profile_type: 30 };

        // 部门id
        if (is.existy(id) && is.not.empty(id)) {
          params.department_ids = [id];
        }

        const result = yield call(getDepartmentMember, params);
        if (is.existy(result)) {
          yield put({ type: 'reduceDepartmentMember', payload: result });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 撤销部门
     * @param {string} id 部门id
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * deleteDepartment({ payload = {} }, { call }) {
      const { id = undefined, onSuccessCallback, onFailureCallback } = payload;
      const params = { state: OrganizationDepartmentState.disable };

      // 部门id
      if (is.existy(id) && is.not.empty(id)) {
        params._id = payload.id;
      }
      const result = yield call(deleteDepartment, params);
      if (is.existy(result) && result.ok) {
        onSuccessCallback && onSuccessCallback();
        return result;
      } else {
        onFailureCallback && onFailureCallback(result);
        return undefined;
      }
    },


    /**
     * 导出部门下成员
     * @param {string} id 部门id
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * exportMember({ payload = {} }, { call }) {
      const { id = [] } = payload;
      // 档案类型（固定为员工）
      const params = { profile_type: FileType.staff };

      // 部门id
      if (is.existy(id) && is.not.empty(id)) {
        params.department_ids = id;
      }

      const result = yield call(exportMember, params);
      if (result && is.existy(result.task_id)) {
        message.success(`创建下载任务成功，任务id：${result.task_id}`);
      } else {
        message.error(result.message);
      }
    },

    /**
     * 导出部门
     * @param {string} id 部门id
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * exportDepartment({ payload = {} }, { call }) {
      const { id } = payload;
      const params = {};

      // 部门id
      if (is.existy(id) && is.not.empty(id)) {
        params._id = id;
      }

      const result = yield call(exportDepartment, params);

      if (result && is.existy(result.task_id)) {
        message.success(`创建下载任务成功，任务id：${result.task_id}`);
      } else {
        result.zh_message && message.error(result.zh_message);
      }
    },

    /**
     * 重置部门下级部门
     */
    * resetChildDepartmentList({ payload = {} }, { put }) {
      yield put({ type: 'reduceChildDepartmentList', payload });
    },

    /**
     * 重置部门详情
     */
    * resetDepartmentDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceDepartmentDetail', payload });
    },

    /**
     * 重置部门下成员列表
     */
    * resetDepartmentMember({ payload = {} }, { put }) {
      yield put({ type: 'reduceDepartmentMember', payload });
    },

    /**
     * 重置部门下成员列表
     */
    * resetExpenseDepartment({ payload = {} }, { put }) {
      yield put({ type: 'reduceExpenseDepartment', payload });
    },

    /**
     * 撤销部门校验
     */
    * checkDeleteDepartment({ payload = {} }, { call }) {
      const params = { _id: payload.departmentId };

      const res = yield call(checkDeleteDepartment, params);

      return res;
    },

    /**
     * 审批-调整上级部门-创建
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * createOaUpperDepartment({ payload = {} }, { call }) {
      const {
        upperDepartmentFlowId, // 调整上级部门操作需要的审批流id
        departmentId, // 当前部门id
        updateParentDepartmentId, // 调整后的上级部门ID
        code, // 当前部门编号
        effectiveDate, // 生效日期
        reason, // 调整原因
        assetKeys, // 附件列表
      } = payload;

      const params = {
        oa_flow_id: upperDepartmentFlowId,
        department_id: departmentId,
        department_code: code,
        take_effect_date: effectiveDate,
        note: reason,
      };
      updateParentDepartmentId && (params.update_parent_department_id = updateParentDepartmentId); // 上级部门
      updateParentDepartmentId === '0' && (params.update_parent_department_id = null);
      if (assetKeys && Array.isArray(assetKeys) && assetKeys.length > 0) {
        params.asset_keys = assetKeys.map(item => item.key);
      }

      const result = yield call(createOaUpperDepartment, params);

      if (result && result._id) {
        return result;
      }
      return undefined;
    },

    /**
     * 审批-调整上级部门-编辑
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * updateOaUpperDepartment({ payload = {} }, { call }) {
      const {
        oaOrganizationOrderId, //  部门/编制申请单ID
        updateParentDepartmentId, // 调整后的上级部门ID
        code, // 当前部门编号
        effectiveDate, // 生效日期
        reason, // 调整原因
        assetKeys, // 附件列表
      } = payload;

      const params = {
        oa_organization_order_id: oaOrganizationOrderId,
        department_code: code,
        take_effect_date: effectiveDate,
        note: reason,
      };

      updateParentDepartmentId && (params.update_parent_department_id = updateParentDepartmentId); // 上级部门
      updateParentDepartmentId === '0' && (params.update_parent_department_id = null);
      if (assetKeys && Array.isArray(assetKeys) && assetKeys.length > 0) {
        params.asset_keys = assetKeys.map(item => item.key);
      }

      const result = yield call(updateOaUpperDepartment, params);

      if (result && result._id) {
        return result;
      }
      return undefined;
    },

    /**
     * 审批-新增子部门-创建
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * createOaSubDepartment({ payload = {} }, { call }) {
      const {
        addSubDepartmentFlowId, // 添加子部门操作需要的审批流id
        targetParentDepartmentId, // 上级部门ID
        name, // 部门name
        code, // 部门编号
        effectiveDate, // 生效日期
        reason, // 新增原因
        assetKeys, // 附件列表
        jobList, // 岗位列表
      } = payload;

      const params = {
        oa_flow_id: addSubDepartmentFlowId,
        department_name: name,
        department_code: code,
        take_effect_date: effectiveDate,
        note: reason,
      };
      targetParentDepartmentId && (params.target_parent_department_id = targetParentDepartmentId); // 上级部门
      targetParentDepartmentId === '0' && (params.target_parent_department_id = null);
      if (assetKeys && Array.isArray(assetKeys) && assetKeys.length > 0) {
        params.asset_keys = assetKeys.map(item => item.key);
      }
      // 岗位列表
      if (jobList && Array.isArray(jobList)) {
        params.job_list = jobList.map(item => ({
          job_id: item.jobId,
          organization_count: Number(item.organizationCount),
          description: item.description,
        }));
      }

      const result = yield call(createOaSubDepartment, params);

      if (result && result._id) {
        return result;
      }
      return undefined;
    },

    /**
     * 审批-新增子部门-编辑
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * updateOaSubDepartment({ payload = {} }, { call }) {
      const {
        oaOrganizationOrderId, // 部门/编制申请单ID
        targetParentDepartmentId, // 上级部门ID
        name, // 部门name
        code, // 部门编号
        effectiveDate, // 生效日期
        reason, // 新增原因
        assetKeys, // 附件列表
        jobList, // 岗位列表
      } = payload;

      const params = {
        oa_organization_order_id: oaOrganizationOrderId,
        department_name: name,
        department_code: code,
        take_effect_date: effectiveDate,
        note: reason,
      };
      targetParentDepartmentId && (params.target_parent_department_id = targetParentDepartmentId); // 上级部门
      targetParentDepartmentId === '0' && (params.target_parent_department_id = null);
      if (assetKeys && Array.isArray(assetKeys) && assetKeys.length > 0) {
        params.asset_keys = assetKeys.map(item => item.key);
      }
      // 岗位列表
      if (jobList && Array.isArray(jobList)) {
        params.job_list = jobList.map(item => ({
          job_id: item.jobId,
          organization_count: Number(item.organizationCount),
          description: item.description,
        }));
      }

      const result = yield call(updateOaSubDepartment, params);

      if (result && result._id) {
        return result;
      }
      return undefined;
    },

    /**
     * 部门/编制申请单关闭
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * closeOaOrganizationOrder({ payload = {} }, { call }) {
      const {
        oaOrganizationOrderId, // 部门/编制申请单ID
      } = payload;

      if (!oaOrganizationOrderId) return message.error('部门/编制申请单ID缺失');

      const params = { oa_organization_order_id: oaOrganizationOrderId };

      const result = yield call(closeOaOrganizationOrder, params);

      if (result && result._id) {
        return result;
      }
      return undefined;
    },

    /**
     * 审批-裁撤部门-新增
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * createRevokeDepartment({ payload = {} }, { call }) {
      const {
        revokeDepartmentFlowId, // 裁撤部门操作需要的审批流id
        departmentId, // 裁撤部门ID
        reason, // 裁撤原因
        assetKeys, // 附件列表
      } = payload;

      const params = {
        oa_flow_id: revokeDepartmentFlowId,
        department_id: departmentId,
        note: reason,
      };

      if (assetKeys && Array.isArray(assetKeys) && assetKeys.length > 0) {
        params.asset_keys = assetKeys.map(item => item.key);
      }

      const result = yield call(createRevokeDepartment, params);

      if (result && result._id) {
        return result;
      }
      return undefined;
    },

    /**
     * 审批-裁撤部门-编辑
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * updateRevokeDepartment({ payload = {} }, { call }) {
      const {
        oaOrganizationOrderId, // 部门/编制申请单ID
        reason, // 裁撤原因
        assetKeys, // 附件列表
      } = payload;

      const params = {
        oa_organization_order_id: oaOrganizationOrderId,
        note: reason,
      };

      if (assetKeys && Array.isArray(assetKeys) && assetKeys.length > 0) {
        params.asset_keys = assetKeys.map(item => item.key);
      }

      const result = yield call(updateRevokeDepartment, params);

      if (result && result._id) {
        return result;
      }
      return undefined;
    },

    /**
     * 组织架构操作前校验
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    * checkDepartmentUpdate({ payload = {} }, { call }) {
      const {
        organizationSubType, // 部门/编制子类型
        departmentId, // 部门id
        updateParentDepartmentId, // 调整后的上级部门ID
        targetParentDepartmentId, // 添加子部门时的部门id
        jobId, // 岗位id
        oaApplicationOrderId, // 审批单ID（编辑审批单时使用）
      } = payload;

      const params = {};

      // 部门id
      departmentId && (params.department_id = departmentId);
      // 部门/编制子类型
      organizationSubType && (params.organization_sub_type = organizationSubType);
      // 调整后的上级部门ID
      updateParentDepartmentId && (params.update_parent_department_id = updateParentDepartmentId);
      // 添加子部门时的部门id
      targetParentDepartmentId && (params.target_parent_department_id = targetParentDepartmentId);
      // 岗位id
      jobId && (params.job_id = jobId);
      // 审批单ID（编辑审批单时使用）
      oaApplicationOrderId && (params.oa_application_order_id = oaApplicationOrderId);

      const result = yield call(checkDepartmentUpdate, params);

      // 请求成功 200
      if (result && !result.message) {
        return result;
      }
      return undefined;
    },

    /**
     * 获取组织架构操作配置
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    *getOrganizationConfig({ payload = {} }, { call }) {
      const params = {
        config_type_list: [20],
      };
      const res = yield call(getOrganizationConfig, params);
      if (res && !res.zh_message && Array.isArray(res)) {
        return res;
      }
      return undefined;
    },

    /**
     * 获取组织架构审批流list
     * @memberof module:model/organization/manage/department~organization/manage/department/effects
     */
    *getOrganizationFlowList({ payload = {} }, { call }) {
      const {
        departmentId, // 部门id
        organizationSubType, // 部门/编制子类型
      } = payload;

      const params = {
        apply_application_type: 701, // 适用审批类型
      };

      // 部门id
      departmentId && (params.apply_department_id = departmentId);
      // 部门/编制子类型
      organizationSubType && (params.organization_sub_type = organizationSubType);

      const res = yield call(getOrganizationFlowList, params);
      return res;
    },
  },
  /**
   * @namespace organization/manage/department/reducers
   */
  reducers: {
    /**
     * 部门Tree
     * @returns {object} 更新 departmentTree
     * @memberof module:model/organization/manage/department/deductions~organization/manage/department/reducers
     */
    reduceDepartmentTree(state, action) {
      let departmentTree = [];
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        const { data = [] } = action.payload;
        departmentTree = flatTree(data);
      }
      return { ...state, departmentTree };
    },


    /**
     * 部门详情
     * @returns {object} 更新 departmentDetail
     * @memberof module:model/organization/manage/department/deductions~organization/manage/department/reducers
     */
    reduceDepartmentDetail(state, action) {
      let departmentDetail = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        departmentDetail = action.payload;
      }
      return { ...state, departmentDetail };
    },

    /**
     * 部门下成员
     * @returns {object} 更新 departmentMember
     * @memberof module:model/organization/manage/department/deductions~organization/manage/department/reducers
     */
    reduceDepartmentMember(state, action) {
      let departmentMember = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        departmentMember = action.payload;
      }
      return { ...state, departmentMember };
    },

    /**
     * 当前部门下级部门
     * @returns {object} 更新 childDepartmentList
     * @memberof module:model/organization/manage/department/deductions~organization/manage/department/reducers
     */
    reduceChildDepartmentList(state, action) {
      let childDepartmentList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        childDepartmentList = action.payload;
      }
      return { ...state, childDepartmentList };
    },

    /**
     * 部门/编制申请单列表信息
     * @returns {object} 更新 departmentOrderList
     * @memberof module:model/organization/manage/department/deductions~organization/manage/department/reducers
     */
    reduceDepartmentOrderList(state, action) {
      const departmentOrderList = { ...state.departmentOrderList };
      if (action && action.payload && action.payload.orderNameSpace) {
        departmentOrderList[action.payload.orderNameSpace] = action.payload.result;
      }
      return { ...state, departmentOrderList };
    },

    /**
     * 部门（费用模块成本分摊）
     * @returns {object} 更新 expenseDepartment
     * @memberof module:model/organization/manage/department/deductions~organization/manage/department/reducers
     */
    reduceExpenseDepartment(state, action) {
      const { expenseDepartment = {} } = state;
      const { namespace, data } = action.payload;
      if (is.existy(data) && is.not.empty(data)) {
        expenseDepartment[namespace] = data;
      } else {
        expenseDepartment[namespace] = [];
      }
      return { ...state, expenseDepartment: { ...expenseDepartment } };
    },
  },
};
