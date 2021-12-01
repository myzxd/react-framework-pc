/**
 * 业主管理 model
 *
 * @module model/teamManager
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { message, Modal } from 'antd';

import {
  createTeamManager,
  createOwnerTeamScope,
  updateTeamManager,
  fetchTeamManagerDetail,
  fetchTeamManagers,
  exportOwnerBiz,
  exportNotOwnerBiz,
  fetchOwnerScopeList,
  fetchOwnerChangeLog,
  fetchOwnerCreateScope,
  fetchOwnerUpdateScope,
  fetchOwnerCancelScope,
  fetchOwnerChangeCancel,
  updateOwnerteamManagers,
  updateDissolutionTeam,
  fetchTeamManagerUpdateOwnerList,
  cancelTeamManagerUpdateOwnerListItem,
  fetchTeamKnightDistrcit,
} from '../../services/team/manager.js';
import { RequestMeta } from '../../application/object';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'teamManager',
  /**
   * 状态树
   * @prop {string} teamManagers      业主列表
   * @prop {string} teamManagerDetail 业主详情
   * @prop {string} teamManagerUpdateOwnerList // 业主团队变更记录列表
   */
  state: {
    // 业主列表
    teamManagers: {
      data: [],
      _meta: {},
    },
    // 业主详情
    teamManagerDetail: {},
    teamManagerScopeList: {},   //  业主管理编辑页承揽范围列表
    teamManagerChangeList: {},   //  业主管理编辑页变更记录列表
    teamManagerUpdateOwnerList: {},   // 业主团队变更记录列表
  },

  /**
   * @namespace teamManager/effects
   */
  effects: {
    /**
     * 获取业主详情信息
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchTeamManagerDetail({ payload }, { call, put }) {
      // 业主id
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('请求参数不能为空');
      }

      const params = {
        id: payload.id,
      };

      const result = yield call(fetchTeamManagerDetail, params);

      if (result === undefined) {
        message.error('获取数据失败');
      }

      yield put({ type: 'reduceTeamManagerDetail', payload: result });
    },

    /**
     * 创建业主
     * @memberof module:model/teamManager~teamManager/effects
     */
    *createTeamManager({ payload }, { put }) {
      const { district, onSuccessCallback, onFailureCallback, idCard, id } = payload;

      // 参数
      const params = {};

      // 商圈
      if (is.existy(district) && is.not.empty(district)) {
        params.biz_district_id = district;
      }

      // 业主身份证号
      if (is.existy(idCard) && is.not.empty(idCard)) {
        params.identity_card_id = idCard;
      }

      // 业主身份id
      if (is.existy(id) && is.not.empty(id)) {
        params.staff_id = id;
      }

      const request = {
        params, // 接口参数
        service: createTeamManager, // 接口
        onSuccessCallback, // 成功回调
        onFailureCallback,
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 创建业主团队范围
     * @memberof module:model/teamManager~teamManager/effects
     */
    * createOwnerTeamScope({ payload }, { call }) {
      const { platformId, supplierId, cities, district, onSuccessCallback } = payload;

      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };

      // 平台
      if (is.existy(platformId) && is.not.empty(platformId)) {
        params.platform_code = [platformId];
      }

      // 供应商
      if (is.existy(supplierId) && is.not.empty(supplierId)) {
        params.supplier_id = [supplierId];
      }

      // 城市
      if (is.existy(cities) && is.not.empty(cities)) {
        params.city_code = [cities];
      }

      // 商圈
      if (is.existy(district) && is.not.empty(district)) {
        params.biz_district_id = [district];
      }
      // 获取的数据
      const result = yield call(createOwnerTeamScope, params);
      if (result.data.length <= 0) {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      } else {
        message.error('请求错误：所选商圈已经存在业主，一个商圈不可以存在多个业主！');
      }
    },

    /**
     * 更新业主
     * @memberof module:model/teamManager~teamManager/effects
     */
    *updateTeamManager({ payload }, { put }) {
      // 参数判断
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('人员id，参数不能为空');
      }
      // 参数判断
      if (is.not.existy(payload.districts) || is.empty(payload.districts)) {
        return message.error('商圈列表，参数不能为空');
      }

      // 参数
      const { id, districts, onSuccessCallback } = payload;
      const params = {
        id,
        biz_district_ids: districts,
      };

      // 失败回调
      const onFailureCallback = (err) => {
        if (err.zh_message) return message.error(err.zh_message);
        return message.error('请求失败');
      };
      const request = {
        params, // 接口参数
        service: updateTeamManager, // 接口
        onSuccessCallback, // 成功回调
        onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取其实商圈
     */
    *fetchTeamKnightDistrcit({ payload }, { call }) {
      const params = {};
      // 业主劳动者档案ID
      if (is.existy(payload.staffId) && is.not.empty(payload.staffId)) {
        params.staff_id = payload.staffId;
      }
      // 业主团队ID
      if (is.existy(payload.ownerId) && is.not.empty(payload.ownerId)) {
        params.owner_id = payload.ownerId;
      }
      // 商圈ids
      if (is.existy(payload.district) && is.not.empty(payload.district)) {
        params.biz_district_ids = payload.district;
      }

      const result = yield call(fetchTeamKnightDistrcit, params);
      // 错误信息
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      // 是否有骑士数据
      if (result.data) {
        payload.onSuccessCallBack(result.data);
      }
    },

    /**
     * 解散团队
     * @memberof module:model/teamManager~teamManager/effects
     */
    *updateDissolutionTeam({ payload }, { call }) {
      // 参数判断
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('人员id，参数不能为空');
      }

      // 参数
      const { id } = payload;
      const params = {
        owner_id: id,
      };
      const result = yield call(updateDissolutionTeam, params);
      // 错误提示
      if (result.zh_message) {
        return Modal.error({
          title: result.zh_message,
        });
      }
      // 成功提示
      if (result.ok) {
        message.success('解散成功');
        window.location.href = '/#/Team/Manager';
      }
    },

    /**
     * 获取业主列表
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchTeamManagers({ payload }, { call, put }) {
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 业主id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = [Number(payload.state)];
      }
      // 业主姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 业主手机号码
      if (is.existy(payload.mobile) && is.not.empty(payload.mobile)) {
        params.phone = payload.mobile;
      }
      // 业主身份证号码
      if (is.existy(payload.idCard) && is.not.empty(payload.idCard)) {
        params.identity_card_id = payload.idCard;
      }
      // 团队id
      if (is.existy(payload.teamId) && is.not.empty(payload.teamId)) {
        params._id = payload.teamId;
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
      const result = yield call(fetchTeamManagers, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceTeamManagers', payload: result });
      } else {
        return message.error(`请求失败 ${dot.get(result, 'zh_message')}`);
      }
    },

    /**
     * 导出业主商圈数据
     * @memberof module:model/teamManager~teamManager/effects
     */
    *exportOwnerBiz({ payload }, { call }) {
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 业主id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = Number(payload.state);
      }
      // 业主姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 业主手机号码
      if (is.existy(payload.mobile) && is.not.empty(payload.mobile)) {
        params.phone = payload.mobile;
      }
      // 业主身份证号码
      if (is.existy(payload.idCard) && is.not.empty(payload.idCard)) {
        params.identity_card_id = payload.idCard;
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
      const result = yield call(exportOwnerBiz, params);
      if (result.ok) {
        message.success('导出成功');
      } else {
        message.error('导出失败');
      }
    },
    /**
     * 导出业主商圈数据
     * @memberof module:model/teamManager~teamManager/effects
     */
    *exportNotOwnerBiz({ payload }, { call }) {
      // 请求服务器
      const result = yield call(exportNotOwnerBiz);
      if (result.ok) {
        message.success('导出成功');
      } else {
        message.error('导出失败');
      }
    },
    /**
     * 变更业主
     * @prop {string} ownerId // 业主团队ID
     * @prop {string} staffId // 业主劳动者档案ID
     * @prop {number} plan_done_date // 生效日期
     * @memberof module:model/teamManager~teamManager/effects
     */
    *updateOwnerteamManagers({ payload }, { call }) {
      const params = {};
      // 业主劳动者档案ID
      if (is.existy(payload.staffId) && is.not.empty(payload.staffId)) {
        params.staff_id = payload.staffId;
      }
      // 生效日期
      if (is.existy(payload.planDoneDate) && is.not.empty(payload.planDoneDate)) {
        params.plan_done_date = payload.planDoneDate;
      }
      // 业主团队ID
      if (is.existy(payload.ownerId) && is.not.empty(payload.ownerId)) {
        params.owner_id = payload.ownerId;
      }
      // 业主身份证号
      if (is.existy(payload.idCard) && is.not.empty(payload.idCard)) {
        params.identity_card_id = payload.idCard;
      }
      // 删除的骑士商圈ids
      if (is.existy(payload.districtId) && is.not.empty(payload.districtId)) {
        params.remove_role_biz_district_ids = payload.districtId;
      }
      // 请求服务器
      const result = yield call(updateOwnerteamManagers, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      const record = result.record || {};
      if (record.plan_done_date) {
        const data = moment(`${record.plan_done_date}`).format('YYYY年MM月DD日');
        message.success(`操作成功，${data}生效`);
        payload.onSuccessCallBack();
        return;
      }
      if (result.ok) {
        message.success('操作成功，已生效');
        payload.onSuccessCallBack();
      } else {
        payload.onFailureCallback();
      }
    },

    /**
     * 获取业主管理编辑页变更记录列表
     * @prop {number} page // 页码
     * @prop {number} limit // 条数
     * @prop {string} ownerId // 业主团队ID
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchTeamManagerUpdateOwnerList({ payload }, { call, put }) {
      const params = {
        _meta: {},
      };
      // 业主团队ID
      if (is.existy(payload.ownerId) && is.not.empty(payload.ownerId)) {
        params.owner_id = payload.ownerId;
      }
      // 页码
      if (is.existy(payload.page) && is.not.empty(payload.page)) {
        params._meta.page = payload.page;
      }
      // 条数
      if (is.existy(payload.limit) && is.not.empty(payload.limit)) {
        params._meta.limit = payload.limit;
      }
      const result = yield call(fetchTeamManagerUpdateOwnerList, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceTeamManagerUpdateOwnerList', payload: result });
      }
    },
    /**
     * 业主团队变更记录列表 - 取消待生效
     * @prop {string} id // id
     * @memberof module:model/teamManager~teamManager/effects
     */
    *cancelTeamManagerUpdateOwnerListItem({ payload }, { call }) {
      const params = {};
      // id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      // 请求服务器
      const result = yield call(cancelTeamManagerUpdateOwnerListItem, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      payload.onSuccessCallBack();
    },
    /**
     * 获取业主管理编辑页承揽范围列表
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchOwnerScopeList({ payload }, { call, put }) {
      //
      if (!payload.id) {
        return message.error('业主id不能为空！');
      }
      const params = {
        owner_id: payload.id,
        _meta: RequestMeta.mapper(payload.meta),

      };
      const result = yield call(fetchOwnerScopeList, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceOwnerScopeList', payload: result });
      }
    },
    /**
     * 获取业主管理编辑页变更记录列表
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchOwnerChangeLog({ payload }, { call, put }) {
      //
      if (!payload.id) {
        return message.error('业主id不能为空！');
      }
      const params = {
        owner_id: payload.id,
        _meta: RequestMeta.mapper(payload.meta),

      };
      const result = yield call(fetchOwnerChangeLog, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceOwnerChangeList', payload: result });
      }
    },
    /**
     * 业主管理编辑页添加承揽范围
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchOwnerCreateScope({ payload }, { call }) {
      const params = {
        event: 'add',        // 标识 添加动作
      };
      // 商圈
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_ids = [payload.districts];
      }
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.owner_id = payload.id;
      }
      if (is.existy(payload.effectTime) && is.not.empty(payload.effectTime)) {
        params.plan_done_date = payload.effectTime;
      }
      const result = yield call(fetchOwnerCreateScope, params);
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
     * 业主管理编辑页变更承揽范围
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchOwnerUpdateScope({ payload }, { call }) {
      const params = {
        event: 'update',        // 标识 变更动作
      };
      // 商圈
      if (is.existy(payload.district) && is.not.empty(payload.district)) {
        params.biz_district_ids = payload.district;
      }
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.changed_owner_id = payload.id;
      }
      if (is.existy(payload.ownerId) && is.not.empty(payload.ownerId)) {
        params.owner_id = payload.ownerId;
      }
      if (is.existy(payload.effectDate) && is.not.empty(payload.effectDate)) {
        params.plan_done_date = payload.effectDate;
      }
      // 删除的骑士商圈ids
      if (is.existy(payload.districtId) && is.not.empty(payload.districtId)) {
        params.remove_role_biz_district_ids = payload.districtId;
      }
      const result = yield call(fetchOwnerUpdateScope, params);
      if (result.zh_message) {
        Modal.error({
          content: result.zh_message,
        });
      } else {
        const data = moment(`${result.record.plan_done_date}`).format('YYYY年MM月DD日');
        message.success(`变更成功，${data}开始生效`);
        payload.onSuccessCallBack();
      }
    },
    /**
     * 业主管理编辑页终止承揽
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchOwnerCancelScope({ payload }, { call }) {
      const params = {
        event: 'stop',        // 标识 终止动作
      };
      if (is.existy(payload.ownerId) && is.not.empty(payload.ownerId)) {
        params.owner_id = payload.ownerId;
      }
      if (is.existy(payload.effectDate) && is.not.empty(payload.effectDate)) {
        params.plan_done_date = payload.effectDate;
      }
      if (is.existy(payload.district) && is.not.empty(payload.district)) {
        params.biz_district_ids = payload.district;
      }
      // 删除的骑士商圈ids
      if (is.existy(payload.districtId) && is.not.empty(payload.districtId)) {
        params.remove_role_biz_district_ids = payload.districtId;
      }
      const result = yield call(fetchOwnerCancelScope, params);
      if (result.zh_message) {
        Modal.error({
          content: result.zh_message,
        });
      } else {
        const data = moment(`${result.record.plan_done_date}`).format('YYYY年MM月DD日');
        message.success(`终止成功，${data}开始生效`);
        payload.onSuccessCallBack();
      }
    },
    /**
     * 业主管理编辑页取消变更
     * @memberof module:model/teamManager~teamManager/effects
     */
    *fetchOwnerChangeCancel({ payload }, { call }) {
      const params = {};
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      const result = yield call(fetchOwnerChangeCancel, params);
      if (result.zh_message) {
        message.error(result.zh_message);
      } else {
        payload.onSuccessCallBack();
      }
    },
  },

  /**
   * @namespace teamManager/reducers
   */
  reducers: {

    /**
     * 更新业主列表
     * @returns {string} 更新 teamManagers
     * @memberof module:model/teamManager~teamManager/reducers
     */
    reduceTeamManagers(state, { payload }) {
      return {
        ...state,
        teamManagers: payload,
      };
    },

    /**
     * 更新业主详情
     * @returns {string} 更新 teamManagerDetail
     * @memberof module:model/teamManager~teamManager/reducers
     */
    reduceTeamManagerDetail(state, action) {
      const teamManagerDetail = action.payload;
      const scope = {
        suppliers: [],  // 供应商
        platforms: [],  // 平台
        cities: [],     // 城市
        districts: [],  // 商圈
      };
      if (is.not.empty(teamManagerDetail.biz_district_list)) {
        const list = dot.get(teamManagerDetail, 'biz_district_list', []);
        list.forEach((item) => {
          scope.suppliers.push(dot.get(item, 'supplier_id'));
          scope.platforms.push(dot.get(item, 'platform_code'));
          scope.cities.push(dot.get(item, 'city_spelling'));
          scope.districts.push(dot.get(item, '_id'));
        });
      }

      // 数据的范围, 数据排重
      teamManagerDetail.scope = {
        suppliers: Array.from(new Set(scope.suppliers)),
        platforms: Array.from(new Set(scope.platforms)),
        cities: Array.from(new Set(scope.cities)),
        districts: Array.from(new Set(scope.districts)),
      };
      return { ...state, teamManagerDetail };
    },
    /**
     * 承揽范围列表
     * @returns {string} 更新 teamManagers
     * @memberof module:model/teamManager~teamManager/reducers
     */
    reduceOwnerScopeList(state, { payload }) {
      return {
        ...state,
        teamManagerScopeList: payload,
      };
    },
    /**
     * 变更列表
     * @returns {string} 更新 teamManagers
     * @memberof module:model/teamManager~teamManager/reducers
     */
    reduceOwnerChangeList(state, { payload }) {
      return {
        ...state,
        teamManagerChangeList: payload,
      };
    },
    /**
     * 业主团队变更记录列表
     * @returns {string} 更新 teamManagerUpdateOwnerList
     * @memberof module:model/teamManager~teamManager/reducers
     */
    reduceTeamManagerUpdateOwnerList(state, { payload }) {
      return {
        ...state,
        teamManagerUpdateOwnerList: payload,
      };
    },
  },
};
