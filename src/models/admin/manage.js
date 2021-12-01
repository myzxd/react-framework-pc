/**
 * 角色管理，权限管理相关model
 *
 * @module model/admin/manage
 */
import is from 'is_js';
import { message } from 'antd';

import {
  fetchSystemAuthorize,
  updateSystemRole,
  createSystemRole,
  fetchSystemCodeInformation,
  updateSystemPermission,
} from '../../services/login.js';

import { authorize } from '../../../src/application';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'adminManage',
  /**
   * 状态树
   * @prop {array} roles 角色管理信息
   * @prop {array} permissions 权限管理信息
   * @prop {array} codeInformation code信息
   */
  state: {
    roles: [],        // 角色管理信息
    permissions: [],  // 权限管理信息
    codeInformation: [], // code信息
  },

  /**
   * @namespace admin/manage/subscriptions
   */
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location;

        // 如果账号处于未登录，不进行处理
        if (authorize.isLogin() === false) {
          return;
        }

        // 如果已经在管理页面，获取角色信息
        if (pathname === '/Admin/Management/Roles'
          || pathname === '/Admin/Management/Authorize'
          || pathname === '/Admin/Developer'
        ) {
          dispatch({ type: 'fetchSystemAuthorize' });
        }
      });
    },
  },

  /**
   * @namespace admin/manage/effects
   */
  effects: {

    /**
     * 更新系统的权限信息
     * @param {string} roleId 角色id
     * @param {array} permisson 权限
     * @memberof module:model/admin/manage~admin/manage/effects
     */
    * updateSystemPermission({ payload }, { call, put }) {
      const { roleId, permission } = payload;

      const params = {
        permission_mp: {
          [roleId]: permission,
        },
      };
      const result = yield call(updateSystemPermission, params);
      if (result === undefined || is.not.existy(result.group_list) || is.not.existy(result.permission_group)) {
        return message.error('更新权限失败，请稍后重试');
      } else {
        message.success('更新权限成功');
      }

      yield put({ type: 'reduceSystemAuthorize', payload: { roles: result.group_list, permissions: result.permission_group } });
    },

    /**
     * 获取系统的角色，权限信息
     * @todo 接口需升级优化
     * @memberof module:model/admin/manage~admin/manage/effects
     */
    * fetchSystemAuthorize({ payload = {} }, { call, put }) {
      const result = yield call(fetchSystemAuthorize, payload);

      if (result === undefined || is.not.existy(result.group_list) || is.not.existy(result.permission_group)) {
        message.error('获取信息列表数据失败，请稍后重试');
        return;
      }

      // 获取数据成功回调
      payload.callBack && payload.callBack();

      yield put({ type: 'reduceSystemAuthorize', payload: { roles: result.group_list, permissions: result.permission_group } });
    },

    /**
     * 更新角色信息
     * @param {unknow} gid unknow
     * @param {unknow} name unknow
     * @param {unknow} pid unknow
     * @param {unknow} state unknow
     * @memberof module:model/admin/manage~admin/manage/effects
     */
    * updateSystemRole({ payload }, { call, put }) {
      const { gid, name, pid, state, callBack } = payload;
      const params = {
        gid,
        name,
        pid: String(pid),
      };

      if (state !== '') {
        params.available = state;
      }
      // 特殊code策略组
      if (is.existy(payload.codeBizGroupIds) && is.not.empty(payload.codeBizGroupIds)) {
        params.code_biz_group_ids = payload.codeBizGroupIds;
        // 判断是否是code并且没有添加数据时进行清空
      } else if (payload.isCode) {
        params.code_biz_group_ids = [];
      }
      const result = yield call(updateSystemRole, params);
      if (result && is.not.existy(result.code)) {
        message.success('操作成功');

        // 重新获取数据
        yield put({
          type: 'fetchSystemAuthorize',
          payload: { callBack },
        });

        if (payload.onSucessCallback) {
          payload.onSucessCallback();
        }
      } else {
        // 失败回调
        payload.onFailureCallback && payload.onFailureCallback();
      }
    },

    /**
     * 添加角色信息
     * @param {unknow} pid unknow
     * @param {unknow} name unknow
     * @memberof module:model/admin/manage~admin/manage/effects
     */
    * createSystemRole({ payload }, { call, put }) {
      const { name, pid } = payload;
      const params = {
        name,
        pid,
      };
      const result = yield call(createSystemRole, params);
      if (result && is.not.existy(result.code)) {
        message.success('操作成功');
        yield put({ type: 'fetchSystemAuthorize' });
      }
    },

    /**
     * 获取code信息
     * @todo 接口需升级优化
     * @memberof module:model/admin/manage~admin/manage/effects
     */
    * fetchSystemCodeInformation({ payload }, { call, put }) {
      const result = yield call(fetchSystemCodeInformation, payload);

      // 错误提示
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }

      // 成功
      if (result) {
        yield put({ type: 'reduceSystemCodeInformation', payload: result });
      }
    },

  },

  /**
   * @namespace admin/manage/reducers
   */
  reducers: {
    /**
     * 更新角色信息
     * @return {object} 更新 roles,permissions
     * @memberof module:model/admin/manage~admin/manage/reducers
     */
    reduceSystemAuthorize(state, action) {
      // 保存权限列表信息
      // Permissions.saveModulesByPermissions(action.payload.permissions || []);
      return { ...state, roles: action.payload.roles, permissions: action.payload.permissions };
    },
    // code角色信息
    reduceSystemCodeInformation(state, action) {
      return {
        ...state,
        codeInformation: action.payload,
      };
    },
  },
};
