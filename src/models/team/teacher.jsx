/**
 * 私教管理 model
 *
 * @module model/teamTeacher
 */
import is from 'is_js';
import { message } from 'antd';
import moment from 'moment';
import dot from 'dot-prop';

import {
  createTeamTeacher,
  updateTeamTeacher,
  fetchTeamTeacherDetail,
  fetchTeamTeachers,
  fetchAccountTeachers,
  deleteTeamTeacher,
  toggleoffTeamTeacher,
  fetchTeamTeacherMonitoringList,
  createTeamTeacherMonitoring,
  fetachTeamMonitoringdePartmentList,
  fetchTeamTeacherManageLog,
} from '../../services/team/teacher.js';
import { RequestMeta } from '../../application/object';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'teamTeacher',
  /**
   * 状态树
   * @prop {string} teamTeachers      私教列表
   * @prop {string} teamTeacherDetail 私教详情
   * @prop {object} monitoringData    监控数据
   * @prop {object} partmentData      部门信息
   */
  state: {
    // 私教团队列表
    teamTeachers: {
      data: [],
      _meta: {},
    },
    // 私教账户列表
    accountTeachers: {
      data: [],
      _meta: {},
    },
    // 私教详情
    teamTeacherDetail: {},
    // 监控数据
    monitoringData: {},
    // 部门信息
    partmentData: [],
    // 私教管理记录列表数据
    manageLogList: {},
  },

  /**
   * @namespace teamTeacher/effects
   */
  effects: {
    /**
     * 获取私教详情
     * @memberof module:model/teamTeacher~teamTeacher/effects
     */
    *fetchTeamTeacherDetail({ payload }, { call, put }) {
      // 私教id
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('请求参数不能为空');
      }
      const params = {
        id: payload.id,
      };
      const result = yield call(fetchTeamTeacherDetail, params);
      if (result && result._id) {
        yield put({ type: 'reduceTeamTeacherDetail', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 创建私教团队
     * @memberof module:model/teamTeacher~teamTeacher/effects
     */
    *createTeamTeacher({ payload }, { call }) {
      const {
        name,              // 私教团队名称
        note,              // 备注
        onSuccessCallback, // 请求成功回调
      } = payload;
      // 参数判断
      if (is.not.existy(name) || is.empty(name)) {
        return message.error('私教团队名称，参数不能为空');
      }
      const params = {
        name, // 私教团队名称
      };
      // 备注
      if (is.existy(note) && is.not.empty(note)) {
        params.note = note;
      }
      const result = yield call(createTeamTeacher, params);
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
     * 编辑私教团队
     * @memberof module:model/teamTeacher~teamTeacher/effects
     */
    *updateTeamTeacher({ payload }, { call }) {
      const {
        id,                // 私教团队id
        name,              // 私教团队名称
        note,              // 备注
        onSuccessCallback, // 请求成功回调
      } = payload;
      // 参数判断
      if (is.not.existy(id) || is.empty(id)) {
        return message.error('私教团队id，参数不能为空');
      }
      // 参数判断
      if (is.not.existy(name) || is.empty(name)) {
        return message.error('私教团队名称，参数不能为空');
      }

      // 参数
      const params = {
        id,
        name,
        note,
      };
      const result = yield call(updateTeamTeacher, params);
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
     * 删除私教团队
     * @memberof module:model/teamTeacher~teamTeacher/effects
     */
    *deleteTeamTeacher({ payload }, { call }) {
      const {
        id,                // 私教团队id
        onSuccessCallback, // 请求成功回调
      } = payload;
      // 参数判断
      if (is.not.existy(id) || is.empty(id)) {
        return message.error('私教团队id，参数不能为空');
      }

      // 参数
      const params = {
        id,
      };
      const result = yield call(deleteTeamTeacher, params);
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
     * 禁用私教团队
     * @memberof module:model/teamTeacher~teamTeacher/effects
     */
    *toggleoffTeamTeacher({ payload }, { call }) {
      const {
        id,                // 私教团队id
        onSuccessCallback, // 请求成功回调
      } = payload;
      // 参数判断
      if (is.not.existy(id) || is.empty(id)) {
        return message.error('私教团队id，参数不能为空');
      }

      // 参数
      const params = {
        id,
      };
      const result = yield call(toggleoffTeamTeacher, params);
      if (result && result.ok) {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        return message.success('禁用成功');
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
   * 添加私教管理
   * @memberof module:model/teamTeacher~teamTeacher/effects
   */
    *createTeamTeacherMonitoring({ payload }, { call }) {
      const {
        id,                // 私教团队id
        name,              // 部门名称
        onSuccessCallback, // 请求成功回调
      } = payload;
      const date = new Date(); // 当前时间
      // 参数
      const params = {
        event: 'add',
        plan_done_date: Number(moment(date).format('YYYYMMDD')),
      };
      // 私教ID
      if (is.existy(id) && is.not.empty(id)) {
        params.owner_id = id;
      }
      // 私教部门ID
      if (is.existy(name) && is.not.empty(name)) {
        params.department_id = name;
      }
      const result = yield call(createTeamTeacherMonitoring, params);

      // 错误提示
      if (result && result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      if (result && result.ok) {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
        return message.success('创建成功');
      }
    },

    /**
     * 获取私教团队列表
     * @memberof module:model/teamTeacher~teamTeacher/effects
     */
    *fetchTeamTeachers({ payload }, { call, put }) {
      const {
        teamName,  // 私教团队名称
      } = payload;
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 私教团队名称
      if (is.existy(teamName) && is.not.empty(teamName)) {
        params.name = teamName;
      }
      // 请求服务器
      const result = yield call(fetchTeamTeachers, params);
      if (result && result.data) {
        yield put({ type: 'reduceTeamTeachers', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
   * 获取部门信息
   * @memberof module:model/teamTeacher~teamTeacher/effects
   */
    *fetachTeamMonitoringdePartmentList({ payload }, { call, put }) {
      const {
        name,
      } = payload;
      const params = {
        _meta: { page: 1, limit: 9999 },
      };
      // 部门名称
      if (is.existy(name) && is.not.empty(name)) {
        params.department_name = name;
      }
      // 请求服务器
      const result = yield call(fetachTeamMonitoringdePartmentList, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceTeamMonitoringdePartmentList', payload: result });
      }
    },

    /**
* 重置部门信息
* @memberof module:model/teamTeacher~teamTeacher/effects
*/
    *resetTeamMonitoringdePartmentList({ payload }, { put }) {
      yield put({ type: 'reduceTeamMonitoringdePartmentList', payload: { data: [] } });
    },

    /**
     * 获取无私教业主团队监控创列表
     * @memberof module:model/teamTeacher~teamTeacher/effects
     */
    *fetchTeamTeacherMonitoringList({ payload }, { call, put }) {
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };

      // 业主姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }

      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = [Number(payload.state)];
      }

      // 业主手机号码
      if (is.existy(payload.mobile) && is.not.empty(payload.mobile)) {
        params.phone = payload.mobile;
      }

      // 业主身份证号码
      if (is.existy(payload.idCard) && is.not.empty(payload.idCard)) {
        params.identity_card_id = payload.idCard;
      }

      // 业主团队ID
      if (is.existy(payload.ownerTeamId) && is.not.empty(payload.ownerTeamId)) {
        params.owner_id = payload.ownerTeamId;
      }

      // 请求服务器
      const result = yield call(fetchTeamTeacherMonitoringList, params);
      if (is.existy(result) && is.existy(result.data)) {
        yield put({ type: 'reduceTeamTeacherMonitoringList', payload: result });
      } else {
        return message.error(`请求失败 ${dot.get(result, 'zh_message')}`);
      }
    },

    /**
    * 重置无私教业主团队监控创列表
    * @memberof module:model/teamTeacher~teamTeacher/effects
    */
    *resetTeamTeacherMonitoringList({ payload }, { put }) {
      yield put({ type: 'reduceTeamTeacherMonitoringList', payload: {} });
    },

    /**
     * 获取私教账户列表
     * @memberof module:model/teamTeacher~teamTeacher/effects
     */
    *fetchAccountTeachers({ payload }, { call, put }) {
      const {
        teamName,
      } = payload;
      const params = {
        _meta: RequestMeta.mapper(payload.meta),
      };
      // 私教团队名称
      if (is.existy(teamName) && is.not.empty(teamName)) {
        params.name = teamName;
      }
      // 请求服务器
      const result = yield call(fetchAccountTeachers, params);
      if (result.data) {
        yield put({ type: 'reduceAccountTeachers', payload: result });
      } else if (result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
     * 获取私教管理记录列表
     * @memberof module:model/teamTeacher~teamTeacher/effects
     */
    *fetchTeamTeacherManageLog({ payload }, { call, put }) {
      const {
        name,
        phone,
        idCard,
        disName,
        ownerTeamId,                  // 业主团队ID
        meta,
      } = payload;
      const params = {
        _meta: RequestMeta.mapper(meta),
      };
      // 业主姓名
      if (is.existy(name) && is.not.empty(name)) {
        params.name = name;
      }
      // 业主手机号
      if (is.existy(phone) && is.not.empty(phone)) {
        params.phone = phone;
      }
      // 业主身份证号
      if (is.existy(idCard) && is.not.empty(idCard)) {
        params.identity_card_id = idCard;
      }
      // 商圈名称
      if (is.existy(disName) && is.not.empty(disName)) {
        params.biz_district_name = disName;
      }
      // 业主团队ID
      if (is.existy(ownerTeamId) && is.not.empty(ownerTeamId)) {
        params.owner_id = ownerTeamId;
      }
      // 请求服务器
      const result = yield call(fetchTeamTeacherManageLog, params);
      if (result.data) {
        yield put({ type: 'reduceTeamTeacherManageLog', payload: result });
      }
    },
    /**
     * 重置私教管理记录列表
     * @memberof module:model/teamTeacher~teamTeacher/effects
     */
    *resetTeamTeacherManageLog({ payload }, { put }) {
      yield put({ type: 'reduceTeamTeacherManageLog', payload: {} });
    },
  },

  /**
   * @namespace teamTeacher/reducers
   */
  reducers: {

    /**
     * 更新私教团队列表
     * @returns {string} 更新 teamTeachers
     * @memberof module:model/teamTeacher~teamTeacher/reducers
     */
    reduceTeamTeachers(state, { payload }) {
      return {
        ...state,
        teamTeachers: payload,
      };
    },

    /**
     * 更新私教账户列表
     * @returns {string} 更新 accountTeachers
     * @memberof module:model/teamTeacher~teamTeacher/reducers
     */
    reduceAccountTeachers(state, { payload }) {
      return {
        ...state,
        accountTeachers: payload,
      };
    },

    /**
     * 更新私教团队详情
     * @returns {string} 更新 teamTeacherDetail
     * @memberof module:model/teamTeacher~teamTeacher/reducers
     */
    reduceTeamTeacherDetail(state, { payload }) {
      return {
        ...state,
        teamTeacherDetail: payload,
      };
    },
    /**
   * 更新更新无私教业主团队监控列表
   * @returns {string} 更新 monitoringData
   * @memberof module:model/teamTeacher~teamTeacher/reducers
   */
    reduceTeamTeacherMonitoringList(state, { payload }) {
      return {
        ...state,
        monitoringData: payload,
      };
    },
    /**
 * 更新部门信息
 * @returns {string} 更新 partmentData
 * @memberof module:model/teamTeacher~teamTeacher/reducers
 */
    reduceTeamMonitoringdePartmentList(state, { payload }) {
      return {
        ...state,
        partmentData: payload.data,
      };
    },
    /**
    * 更新私教管理记录
    * @returns {string} 更新 manageLogList
    * @memberof module:model/teamTeacher~teamTeacher/reducers
    */
    reduceTeamTeacherManageLog(state, { payload }) {
      return {
        ...state,
        manageLogList: payload,
      };
    },
  },
};
