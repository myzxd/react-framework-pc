/**
 * 私教账户管理 model
 *
 * @module model/teamAccount
 */
import is from 'is_js';
import moment from 'moment';
import { message, Modal } from 'antd';

import {
  createTeamAccount,
  updateTeamAccount,
  fetchTeamAccountDetail,
  fetchTeamAccounts,
  fetchTeamAccountDistrict,
  deleteTeamAccount,
  exportCoachBiz,
  exportNotCoachBiz,
  fetchCoachScopeList,
  fetchCoachChangeLog,
  fetchCoachCreateScope,
  fetchCoachUpdateScope,
  fetchCoachCancelScope,
  fetchCoachChangeCancel,
  fetchCoachBusinessList,
  fetchCoachSave,
  fetchCoachName,
} from '../../services/team/account.js';
import { RequestMeta } from '../../application/object';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'teamAccount',
  /**
   * 状态树
   * @prop {string} teamAccounts      私教账户列表
   * @prop {string} accountDistrict   私教账户列表
   * @prop {string} teamAccountDetail 私教账户详情
   */
  state: {
    // 私教账户列表
    teamAccounts: {
      data: [],
      _meta: {},
    },
    // 私教账户业务范围列表
    accountDistrict: {
      data: [],
      _meta: {},
    },
    // 私教账户详情
    teamAccountDetail: {},
    // 私教编辑页业务范围列表
    teamCoachScopeList: {},
    teamCoachChangeList: {},
    businessList: [],   // 私教业务记录列表
    coachName: [],
  },

  /**
   * @namespace teamAccount/effects
   */
  effects: {
    /**
     * 获取私教账户详情信息
     * @memberof module:model/teamAccount~teamAccount/effects
     */
    *fetchTeamAccountDetail({ payload }, { call, put }) {
      // 私教账户id
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('请求参数不能为空');
      }
      const params = {
        id: payload.id,
      };
      const result = yield call(fetchTeamAccountDetail, params);
      if (result && result._id) {
        yield put({ type: 'reduceTeamAccountDetail', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 创建私教账户
     * @memberof module:model/teamAccount~teamAccount/effects
     */
    *createTeamAccount({ payload }, { call }) {
      const {
        accountName,       // 私教账户名称
        members,           // 系统用户
        accountTeam,       // 私教团队
        // districts,         // 商圈
        onSuccessCallback, // 请求成功回调
      } = payload;
      // 参数判断
      if (is.not.existy(accountName) || is.empty(accountName)) {
        return message.error('私教账户名称，参数不能为空');
      }
      if (is.not.existy(members) || is.empty(members)) {
        return message.error('系统用户，参数不能为空');
      }
      if (is.not.existy(accountTeam) || is.empty(accountTeam)) {
        return message.error('私教团队，参数不能为空');
      }
      // if (is.not.existy(districts) || is.empty(districts)) {
      //   return message.error('商圈，参数不能为空');
      // }
      const params = {
        name: accountName,            // 私教账户名称
        coach_account_id: members,    // 系统用户
        coach_team_ids: accountTeam,  // 私教团队
        // biz_district_ids: districts,  // 商圈
      };
      const result = yield call(createTeamAccount, params);
      if (result && result.ok) {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        return message.success('创建成功');
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
     * 删除私教账户
     * @memberof module:model/teamAccount~teamAccount/effects
     */
    *deleteTeamAccount({ payload }, { call }) {
      const {
        id,                // 私教账户id
        onSuccessCallback, // 请求成功回调
      } = payload;
      // 参数判断
      if (is.not.existy(id) || is.empty(id)) {
        return message.error('私教账户id，参数不能为空');
      }
      const params = {
        id,
      };
      const result = yield call(deleteTeamAccount, params);
      if (result && result.ok) {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        return message.success('删除成功');
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 更新私教账户
     * @memberof module:model/teamAccount~teamAccount/effects
     */
    *updateTeamAccount({ payload }, { call }) {
      const {
        id,                // 私教账户id
        accountTeam,       // 私教团队
        districts,         // 商圈
        onSuccessCallback, // 请求成功回调
      } = payload;
      // 参数判断
      if (is.not.existy(id) || is.empty(id)) {
        return message.error('私教账户id，参数不能为空');
      }
      if (is.not.existy(accountTeam) || is.empty(accountTeam)) {
        return message.error('私教团队，参数不能为空');
      }
      if (is.not.existy(districts) || is.empty(districts)) {
        return message.error('商圈，参数不能为空');
      }

      const params = {
        id,                           // 私教账户id
        coach_team_ids: accountTeam,  // 私教团队
        biz_district_ids: districts,  // 商圈
      };

      const result = yield call(updateTeamAccount, params);
      if (result && result.ok) {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        return message.success('编辑成功');
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 获取私教账户列表
     * @memberof module:model/teamAccount~teamAccount/effects
     */
    *fetchTeamAccounts({ payload }, { call, put }) {
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 私教团队id
      if (is.existy(payload.coachTeamId) && is.not.empty(payload.coachTeamId)) {
        params.coach_team_id = payload.coachTeamId;
      }
      // 私教账户id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.id = payload.id;
      }
      // 私教账户姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 私教账户手机号码
      if (is.existy(payload.phone) && is.not.empty(payload.phone)) {
        params.phone = payload.phone;
      }
      // 私教团队名称
      if (is.existy(payload.teamName) && is.not.empty(payload.teamName)) {
        params.coach_team_name = payload.teamName;
      }
      // 平台
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_code = payload.platforms;
      }
      // 供应商
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_id = payload.suppliers;
      }
      // 城市
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_code = payload.cities;
      }
      // 商圈
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_id = payload.districts;
      }

      // 请求服务器
      const result = yield call(fetchTeamAccounts, params);
      if (result && result.data) {
        yield put({ type: 'reduceTeamAccounts', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 获取私教账户业务范围列表
     * @memberof module:model/teamAccount~teamAccount/effects
     */
    *fetchTeamAccountDistrict({ payload }, { call, put }) {
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 私教账户id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.id = payload.id;
      }

      // 请求服务器
      const result = yield call(fetchTeamAccountDistrict, params);
      if (result && result.data) {
        yield put({ type: 'reduceAccountDistrict', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
     * 导出业主商圈数据
     * @memberof module:model/teamManager~teamManager/effects
     */
    *exportCoachBiz({ payload }, { call }) {
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 私教团队id
      if (is.existy(payload.coachTeamId) && is.not.empty(payload.coachTeamId)) {
        params.coach_team_id = payload.coachTeamId;
      }
      // 私教账户id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.id = payload.id;
      }
      // 私教账户姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 私教账户手机号码
      if (is.existy(payload.phone) && is.not.empty(payload.phone)) {
        params.phone = payload.phone;
      }
      // 私教团队名称
      if (is.existy(payload.teamName) && is.not.empty(payload.teamName)) {
        params.coach_team_name = payload.teamName;
      }
      // 平台
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_code = payload.platforms;
      }
      // 供应商
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_id = payload.suppliers;
      }
      // 城市
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_code = payload.cities;
      }
      // 商圈
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_id = payload.districts;
      }

      // 请求服务器
      const result = yield call(exportCoachBiz, params);
      if (result.ok) {
        message.success('导出成功');
      } else {
        message.error('导出失败');
      }
    },
    /**
     * 导出无私教商圈数据
     * @memberof module:model/teamManager~teamManager/effects
     */
    *exportNotCoachBiz({ payload }, { call }) {
      // 请求服务器
      const result = yield call(exportNotCoachBiz);
      if (result.ok) {
        message.success('导出成功');
      } else {
        message.error('导出失败');
      }
    },

    /**
     * 获取私教账户编辑页承揽范围列表
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchCoachScopeList({ payload }, { call, put }) {
      //
      if (!payload.id) {
        return message.error('业主id不能为空！');
      }
      const params = {
        coach_id: payload.id,
        _meta: RequestMeta.mapper(payload.meta),

      };
      const result = yield call(fetchCoachScopeList, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceCoachScopeList', payload: result });
      }
    },
    /**
     * 获取私教账户编辑页变更记录列表
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchCoachChangeLog({ payload }, { call, put }) {
      //
      if (!payload.id) {
        return message.error('业主id不能为空！');
      }
      const params = {
        coach_id: payload.id,
        _meta: RequestMeta.mapper(payload.meta),
      };
      const result = yield call(fetchCoachChangeLog, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceCoachChangeList', payload: result });
      }
    },
    /**
     * 私教账户编辑页添加承揽范围
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchCoachCreateScope({ payload }, { call }) {
      const params = {
        event: 'add',        // 标识 添加动作
      };
      // 商圈
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_ids = payload.districts;
      }
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.coach_id = payload.id;
      }
      const result = yield call(fetchCoachCreateScope, params);
      if (result.zh_message) {
        Modal.error({
          content: result.zh_message,
        });
      } else {
        const data = moment(`${result.record.plan_done_date}`).format('YYYY年MM月DD日');
        message.success(`添加成功，${data}开始生效`);
        payload.onSuccessCallBack();
      }
    },
    /**
     * 私教账户编辑页变更承揽范围
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchCoachUpdateScope({ payload }, { call }) {
      const params = {
        event: 'update',        // 标识 变更动作
      };
      // 商圈
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_ids = payload.districts;
      }
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.coach_id = payload.id;
      }
      if (is.existy(payload.nextId) && is.not.empty(payload.nextId)) {
        params.changed_coach_id = payload.nextId;
      }
      const result = yield call(fetchCoachUpdateScope, params);
      if (result.zh_message) {
        Modal.error({
          content: result.zh_message,
        });
      } else {
        const data = moment(`${result.month}01`).format('YYYY年MM月DD日');
        message.success(`变更成功，${data}开始生效`);
        payload.onSuccessCallBack();
      }
    },
    /**
     * 私教账户编辑页终止承揽
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchCoachCancelScope({ payload }, { call }) {
      const params = {
        event: 'stop',        // 标识 终止动作
      };
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.coach_id = payload.id;
      }
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_ids = payload.districts;
      }
      const result = yield call(fetchCoachCancelScope, params);
      if (result.zh_message) {
        Modal.error({
          content: result.zh_message,
        });
      } else {
        const data = moment(`${result.month}01`).format('YYYY年MM月DD日');
        message.success(`终止成功，${data}开始生效`);
        payload.onSuccessCallBack();
      }
    },
    /**
     * 私教编辑页取消变更
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchCoachChangeCancel({ payload }, { call }) {
      const params = {};
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      const result = yield call(fetchCoachChangeCancel, params);
      if (result.zh_message) {
        Modal.error({
          content: result.zh_message,
        });
      } else {
        payload.onSuccessCallBack();
      }
    },
    /**
     * 获取私教业务记录列表
     * @memberof module:model/coachBusiness~coachBusiness/effects
     */
    *fetchCoachBusinessList({ payload }, { call, put }) {
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 平台
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_code = payload.platforms;
      }
      // 供应商
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_id = payload.suppliers;
      }
      // 城市
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_code = payload.cities;
      }
      // 商圈
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_id = payload.districts;
      }
      const result = yield call(fetchCoachBusinessList, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceBusinessList', payload: result });
      }
    },
    /**
     * 私教编辑页保存
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchCoachSave({ payload }, { call }) {
      const params = {};
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      if (is.existy(payload.accountName) && is.not.empty(payload.accountName)) {
        params.name = payload.accountName;
      }
      if (is.existy(payload.accountTeam) && is.not.empty(payload.accountTeam)) {
        params.coach_team_ids = payload.accountTeam;
      }
      const result = yield call(fetchCoachSave, params);
      if (result.zh_message) {
        message.error(result.zh_message);
      } else {
        message.success('保存成功！');
      }
    },
    /**
     * 私教编辑页保存
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchCoachName({ payload }, { call, put }) {
      const params = {};
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      const result = yield call(fetchCoachName, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceCoachName', payload: result });
      }
    },
    /**
     * 私教编辑页私教姓名重置
     * @memberof module:model/teamManager~teamManager/effects
     */
    *resetCoachName({ payload }, { put }) {
      yield put({ type: 'reduceResetCoachName' });
    },
  },

  /**
   * @namespace teamAccount/reducers
   */
  reducers: {

    /**
     * 更新私教账户列表
     * @returns {string} 更新 teamAccounts
     * @memberof module:model/teamAccount~teamAccount/reducers
     */
    reduceTeamAccounts(state, { payload }) {
      return {
        ...state,
        teamAccounts: payload,
      };
    },

    /**
     * 更新私教账户详情
     * @returns {string} 更新 teamAccountDetail
     * @memberof module:model/teamAccount~teamAccount/reducers
     */
    reduceTeamAccountDetail(state, { payload }) {
      return {
        ...state,
        teamAccountDetail: payload,
      };
    },

    /**
     * 更新私教账户业务范围列表
     * @returns {string} 更新 accountDistrict
     * @memberof module:model/teamAccount~teamAccount/reducers
     */
    reduceAccountDistrict(state, { payload }) {
      return {
        ...state,
        accountDistrict: payload,
      };
    },
    /**
     * 编辑页承揽范围列表
     * @returns {string} 更新 teamManagers
     * @memberof module:model/teamManager~teamManager/reducers
     */
    reduceCoachScopeList(state, { payload }) {
      return {
        ...state,
        teamCoachScopeList: payload,
      };
    },
    /**
     * 编辑页承揽范围列表
     * @returns {string} 更新 teamManagers
     * @memberof module:model/teamManager~teamManager/reducers
     */
    reduceCoachChangeList(state, { payload }) {
      return {
        ...state,
        teamCoachChangeList: payload,
      };
    },
    /**
     * 更新私教业务列表
     * @returns {string} 更新 coachBusiness
     * @memberof module:model/coachBusiness~coachBusiness/reducers
     */
    reduceBusinessList(state, { payload }) {
      return {
        ...state,
        businessList: payload.data,
      };
    },
    /**
     * 更新私教名称列表
     * @returns {string} 更新 coachBusiness
     * @memberof module:model/coachBusiness~coachBusiness/reducers
     */
    reduceCoachName(state, { payload }) {
      return {
        ...state,
        coachName: payload.data,
      };
    },

    /**
     * 重置私教名称列表
     * @returns {string} 更新 coachBusiness
     * @memberof module:model/coachBusiness~coachBusiness/reducers
     */
    reduceResetCoachName(state) {
      return {
        ...state,
        coachName: [],
      };
    },
  },
};
