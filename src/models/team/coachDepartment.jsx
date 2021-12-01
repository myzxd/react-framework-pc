/**
 * 私教部门 model
 *
 * @module model/modelCoachDepartment
 */
import is from 'is_js';
import moment from 'moment';
import { message, Modal } from 'antd';

import {
  fetchCoachDepartmentList,            // 获取私教部门列表
  fetchCoachDepartmentDetail,           // 获取私教部门详情
  fetchCoachRelationshipList,           // 获取资产隶属关系列表
  fetchOwnerList,                       // 获取业主信息列表
  relationOwner,                        // 关联业主确定
  fetchChangeLog,                       // 资产变更记录列表
  fetchChangeCancel,                    // 资产变更取消
} from '../../services/team/coachDepartment';

import { RequestMeta } from '../../application/object';
import { ChangeAction } from '../../application/define';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'modelCoachDepartment',
  /**
   * 状态树
   * @prop {object} coachDepartmentList      私教部门列表
   * @prop {object} coachDepartmentDetail      私教部门详情
   */
  state: {
    coachDepartmentList: {},          // 私教部门列表
    coachDepartmentDetail: {},        // 私教部门详情
    coachRelationshipList: {},        // 资产隶属关系列表
    ownerList: [],                  // 业主列表
    teamChangeList: {},               // 资产变更记录列表
  },

  /**
   * @namespace modelCoachDepartment/effects
   */
  effects: {
    /**
     * 获取私教部门列表
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/effects
     */
    *fetchCoachDepartmentList({ payload }, { call, put }) {
      const {
        departmentName,  // 私教部门名称
        departmentNum,  // 私教部门编号
        departmentId,  // 私教部门ID
      } = payload;
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 私教部门名称
      if (is.existy(departmentName) && is.not.empty(departmentName)) {
        params.department_name = departmentName;
      }
      // 私教部门编号
      if (is.existy(departmentNum) && is.not.empty(departmentNum)) {
        params.code = departmentNum;
      }
      // 私教部门ID
      if (is.existy(departmentId) && is.not.empty(departmentId)) {
        params._id = departmentId;
      }
      // 请求服务器
      const result = yield call(fetchCoachDepartmentList, params);
      if (result && result.data) {
        yield put({ type: 'reduceCoachDepartmentList', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
     * 获取私教部门详情
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/effects
     */
    *fetchCoachDepartmentDetail({ payload }, { call, put }) {
      const {
        id,  // 私教部门id
      } = payload;
      const params = {};
      // 私教部门id
      if (is.existy(id) && is.not.empty(id)) {
        params._id = id;
      }
      // 请求服务器
      const result = yield call(fetchCoachDepartmentDetail, params);
      if (result && result.zh_message) {
        return message.error(result.zh_message);
      }
      return yield put({ type: 'reduceCoachDepartmentDetail', payload: result });
    },
    /**
     * 获取资产隶属关系列表
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/effects
     */
    *fetchCoachRelationshipList({ payload }, { call, put }) {
      const {
        id,  // 私教部门id
      } = payload;
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 私教部门id
      if (is.existy(id) && is.not.empty(id)) {
        params.department_id = id;
      }
      const result = yield call(fetchCoachRelationshipList, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceCoachRelationshipList', payload: result });
      }
    },
    /**
     * 获取业主列表
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/effects
     */
    *fetchOwnerList({ payload }, { call, put }) {
      const {
        name,  // 业主名称
      } = payload;
      const params = {};
      // 业主名称
      if (is.existy(name) && is.not.empty(name)) {
        params.name = name;
      }
      const result = yield call(fetchOwnerList, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceOwnerList', payload: result });
      }
    },
    /**
     * 清空业主列表
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/effects
     */
    *resetOwnerList({ payload }, { put }) {
      yield put({ type: 'reduceOwnerList', payload: { data: [] } });
    },
    /**
     * 关联业主确定
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/effects
     */
    *relationOwner({ payload }, { call }) {
      const {
        ownerId,  // 变更后业主id
        formerOwnerId, // 变更前业主id
        departmentId,  // 部门id
        onSuccessCallback,        // 成功的回调
        effectTime,
      } = payload;
      const params = {
        event: ChangeAction.create,        // 新增操作
      };
      // 变更后业主id
      if (is.existy(ownerId) && is.not.empty(ownerId)) {
        params.owner_id = ownerId;
      }
      // 变更前业主id
      if (is.existy(formerOwnerId) && is.not.empty(formerOwnerId)) {
        params.former_owner_id = formerOwnerId;
      }
      // 部门id
      if (is.existy(departmentId) && is.not.empty(departmentId)) {
        params.department_id = departmentId;
      }
      // 生效日期
      if (is.existy(effectTime) && is.not.empty(effectTime)) {
        params.plan_done_date = effectTime;
      }
      const result = yield call(relationOwner, params);
      if (result && result.zh_message) {
        Modal.error({
          title: result.zh_message,
        });
        return;
      }
      if (onSuccessCallback) {
        message.success('关联成功！');
        return onSuccessCallback();
      }
    },
    /**
     * 变更业主确定
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/effects
     */
    *changeOwner({ payload }, { call }) {
      const {
        ownerId,  // 变更后业主id
        formerOwnerId, // 变更前业主id
        departmentId,  // 部门id
        relationLogId,       // 关联数据的_id
        onSuccessCallback,        // 成功的回调
        effectDate, // 生效日期
        // 私教管理编辑页面调整(pm@彭悦版本)
        newDepartmentId,      // 变更后的私教部门
      } = payload;
      const params = {
        event: ChangeAction.change,        // 变更操作
      };
      // 变更后业主id
      if (is.existy(ownerId) && is.not.empty(ownerId)) {
        params.owner_id = ownerId;
      }
      // 变更前业主id
      if (is.existy(formerOwnerId) && is.not.empty(formerOwnerId)) {
        params.former_owner_id = formerOwnerId;
      }
      // 部门id
      if (is.existy(departmentId) && is.not.empty(departmentId)) {
        params.department_id = departmentId;
      }
      // 生效日期
      if (is.existy(effectDate) && is.not.empty(effectDate)) {
        params.plan_done_date = Number(effectDate);
      }
      // _id
      if (is.existy(relationLogId) && is.not.empty(relationLogId)) {
        params.relation_log_id = relationLogId;
      }
      // ownerId
      if (is.existy(ownerId) && is.not.empty(ownerId)) {
        params.owner_id = ownerId;
      }
      // newDepartmentId
      if (is.existy(newDepartmentId) && is.not.empty(newDepartmentId)) {
        params.new_department_id = newDepartmentId;
      }
      const result = yield call(relationOwner, params);
      if (result && result.zh_message) {
        Modal.error({
          title: result.zh_message,
        });
        return;
      }
      if (onSuccessCallback) {
        message.success(`业主团队于${moment(effectDate).format('YYYY年M月D号')}成功更换私教团队`);
        return onSuccessCallback();
      }
    },
    /**
     * 终止关联业主
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/effects
     */
    *stopManage({ payload }, { call }) {
      const {
        formerOwnerId,  // 目标业主id
        departmentId,  // 部门id
        relationLogId,       // 关联数据的_id
        onSuccessCallback,        // 成功的回调
        effectDate, // 生效日期
      } = payload;
      const params = {
        event: ChangeAction.stop,        // 终止操作
      };
      // 目标业主id
      if (is.existy(formerOwnerId) && is.not.empty(formerOwnerId)) {
        params.owner_id = formerOwnerId;
      }
      // 部门id
      if (is.existy(departmentId) && is.not.empty(departmentId)) {
        params.department_id = departmentId;
      }
      // _id
      if (is.existy(relationLogId) && is.not.empty(relationLogId)) {
        params.relation_log_id = relationLogId;
      }
      // 生效日期
      if (is.existy(effectDate) && is.not.empty(effectDate)) {
        params.plan_done_date = effectDate;
      }
      const result = yield call(relationOwner, params);
      if (result && result.zh_message) {
        return message.error(result.zh_message);
      }
      if (onSuccessCallback) {
        message.success('终止成功！');
        return onSuccessCallback();
      }
    },
    /**
     * 获取资产管理编辑页变更记录列表
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/effects
     */
    *fetchChangeLog({ payload }, { call, put }) {
      //
      if (!payload.id) {
        return message.error('业主id不能为空！');
      }
      const params = {
        department_id: payload.id,
        _meta: RequestMeta.mapper(payload.meta),
      };
      const result = yield call(fetchChangeLog, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceChangeList', payload: result });
      }
    },
    /**
     * 资产管理编辑页取消变更
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/effects
     */
    *fetchChangeCancel({ payload }, { call }) {
      const params = {};
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.change_log_id = payload.id;
      }
      const result = yield call(fetchChangeCancel, params);
      if (result.zh_message) {
        Modal.error({
          content: result.zh_message,
        });
      } else {
        payload.onSuccessCallBack();
      }
    },
  },

  /**
   * @namespace modelCoachDepartment/reducers
   */
  reducers: {
    /**
     * 更新私教部门列表
     * @returns {string} 更新 coachDepartmentList
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/reducers
     */
    reduceCoachDepartmentList(state, { payload }) {
      return {
        ...state,
        coachDepartmentList: payload,
      };
    },
    /**
     * 更新私教部门详情
     * @returns {string} 更新 coachDepartmentDetail
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/reducers
     */
    reduceCoachDepartmentDetail(state, { payload }) {
      return {
        ...state,
        coachDepartmentDetail: payload,
      };
    },
    /**
     * 更新私教部门列表
     * @returns {string} 更新 coachRelationshipList
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/reducers
     */
    reduceCoachRelationshipList(state, { payload }) {
      return {
        ...state,
        coachRelationshipList: payload,
      };
    },
    /**
     * 更新业主信息
     * @returns {string} 更新 ownerList
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/reducers
     */
    reduceOwnerList(state, { payload }) {
      return {
        ...state,
        ownerList: payload.data,
      };
    },
    /**
     * 编辑页变更记录列表
     * @returns {string} 更新 teamChangeList
     * @memberof module:model/modelCoachDepartment~modelCoachDepartment/reducers
     */
    reduceChangeList(state, { payload }) {
      return {
        ...state,
        teamChangeList: payload,
      };
    },
  },
};
