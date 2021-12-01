/**
 * 公告接收人权限model
 *
 * @module model/announcement/permissions
 */
import is from 'is_js';
import { message } from 'antd';

import { fetchPermissionsList, createPermissions, updatePermissions, fetchPermissionsDetail } from '../../services/announcement';

import { RequestMeta, ResponseMeta } from '../../application/object';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'permissions',
  /**
   * 状态树
   * @prop {object} permissionsData 权限列表数据
   * @prop {object} permissionsDetail 权限详情数据
   */
  state: {
    permissionsData: {},       // 权限列表数据
    permissionsDetail: {},  // 权限详情数据
  },

  /**
   * @namespace model/announcement/effects
   */
  effects: {
    /**
     * 获取权限列表
     * @param {number} limit 每页条数
     * @param {number} page 页码
     * @param {string} name 名称
     * @param {string} team 团队
     * @param {array} positions 职位列表
     * @param {array} suppliers 供应商
     * @param {array} platforms 平台
     * @param {array} cites 城市
     * @param {array} districts 商圈
     * @memberof module:model/model/announcement~model/announcement/effects
     */
    *fetchPermissionsList({ payload = {} }, { call, put }) {
      // 默认参数
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      // 名称
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 手机
      if (is.existy(payload.phone) && is.not.empty(payload.phone)) {
        params.phone = payload.phone;
      }
      // 职位列表
      if (is.existy(payload.positions) && is.not.empty(payload.positions) && is.array(payload.positions)) {
        params.gid_list = payload.positions.map(item => Number(item));
      }
      // 供应商
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers) && is.array(payload.suppliers)) {
        params.supplier_list = payload.suppliers;
      }
      // 平台
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms) && is.array(payload.platforms)) {
        params.platform_list = payload.platforms;
      }
      // 城市
      if (is.existy(payload.cities) && is.not.empty(payload.cities) && is.array(payload.cities)) {
        params.city_spelling_list = payload.cities;
      }
      // 团队
      if (is.existy(payload.districts) && is.not.empty(payload.districts) && is.array(payload.districts)) {
        params.biz_district_list = payload.districts;
      }
      // 请求服务器
      const result = yield call(fetchPermissionsList, params);
      // 判断数据是否为空
      if (is.existy(result.data)) {
        yield put({ type: 'reducePermissionsList', payload: result });
      }
    },

    /**
     * 获取权限详情
     * @param {string} id 权限id
     * @memberof module:model/model/announcement~model/announcement/effects
     */
    *fetchPermissionsDetails({ payload }, { call, put }) {
      // 默认参数
      const params = {};

      // 权限id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }

      // 请求服务器
      const result = yield call(fetchPermissionsDetail, params);
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reducePermissionsDetails', payload: result });
      }
    },

    /**
     * 重置权限详情
     * @memberof module:model/model/announcement~model/announcement/effects
     */
    *resetPermissionsDetails({ payload }, { put }) {
      yield put({ type: 'reducePermissionsDetails', payload: {} });
    },

    /**
     * 创建权限
     * @param {string} name 名称
     * @param {string} phone 手机号
     * @param {array} positions 职位列表
     * @param {array} districts 商圈
     * @param {number} state 权限状态
     * @memberof module:model/model/announcement~model/announcement/effects
     */
    *createPermissions({ payload }, { put }) {
      if (is.not.existy(payload.params.positions) || is.empty(payload.params.positions)) {
        return message.error('操作失败，角色信息错误');
      }
      if (is.not.existy(payload.params.members) || is.empty(payload.params.members)) {
        return message.error('操作失败，成员信息错误');
      }
      if (is.not.existy(payload.params.permission) || is.empty(payload.params.permission)) {
        return message.error('操作失败，权限配置错误');
      }

      const params = {
        account_ids: payload.params.members,
        notice_permission: payload.params.permission,
        domain: payload.params.scope,
        platform_list: payload.params.platforms,
        supplier_list: payload.params.suppliers,
        city_spelling_list: payload.params.cities,
        biz_district_list: payload.params.districts,
        positions_id: payload.params.positions,
      };
      const request = {
        params, // 接口参数
        service: createPermissions, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },

    /**
     * 更新权限信息
     * @param {string} name 名称
     * @param {string} phone 手机号
     * @param {array} positions 职位列表
     * @param {array} districts 商圈
     * @param {number} state 权限状态
     * @memberof module:model/model/announcement~model/announcement/effects
     */
    *updatePermissions({ payload }, { put }) {
      if (is.not.existy(payload.params.positions) || is.empty(payload.params.positions)) {
        return message.error('操作失败，角色信息错误');
      }
      if (is.not.existy(payload.params.permission) || is.empty(payload.params.permission)) {
        return message.error('操作失败，权限配置错误');
      }
      if (is.not.existy(payload.params.members) || is.empty(payload.params.members)) {
        return message.error('操作失败，成员信息错误');
      }
      const params = {
        account_ids: [payload.params.members],
        notice_permission: payload.params.permission,
        domain: payload.params.scope,
        platform_list: payload.params.platforms,
        supplier_list: payload.params.suppliers,
        city_spelling_list: payload.params.cities,
        biz_district_list: payload.params.districts,
        positions_id: payload.params.positions,
      };

      const request = {
        params, // 接口参数
        service: updatePermissions, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },
  },

  /**
   * @namespace model/announcement/reducers
   */
  reducers: {

    /**
     * 权限列表
     * @returns {object} 更新 permissionsData
     * @memberof module:model/model/announcement~model/announcement/reducers
     */
    reducePermissionsList(state, action) {
      const permissionsData = {
        meta: ResponseMeta.mapper(action.payload._meta),
        data: action.payload.data,
      };
      return { ...state, permissionsData };
    },
    /**
     * 权限详情
     * @returns {object} 更新 permission
     * @memberof module:model/model/announcement~model/announcement/reducers
     */
    reducePermissionsDetails(state, action) {
      const permissionsDetail = action.payload;
      return { ...state, permissionsDetail };
    },
  },
};
