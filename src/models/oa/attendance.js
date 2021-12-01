/**
 * oa - 考勤类
 *
 * @module model/oa/attendance
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';
import moment from 'moment';
import { OAPayloadMapper } from './helper';

import {
  createAbnormal,
  updateAbnormal,
  fetchAbnormalDetail,
  createExternalOut,
  updateExternalOut,
  fetchExternalOutDetail,
  createOvertime,
  updateOvertime,
  fetchOvertimeDetail,
  createLeave,
  updateLeave,
  fetchLeaveDetail,
} from '../../services/oa/attendance';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'attendance',

  /**
   * 状态树
   */
  state: {
    leaveDetail: {}, // 请假记录
    overtimeDetail: {}, // 加班记录
    externalOutDetail: {}, // 外出记录
    abnormalDetail: {}, // 异常记录
  },

  /**
   * @namespace oa/attendance/effects
   */
  effects: {
    /**
     * 获取请假记录
     * @memberof module:model/oa/attendance~oa/attendance/effects
     */
    * fetchLeaveDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceLeaveDetail', payload: oaDetail });
        return;
      }
      const params = {};
      // id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      const result = yield call(fetchLeaveDetail, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      if (result._id) {
        yield put({ type: 'reduceLeaveDetail', payload: result });
      }
    },
    /**
    * 清空请假记录
    * @memberof module:model/oa/attendance~oa/attendance/effects
    */
    * resetLeaveDetail({ payload }, { put }) {
      yield put({ type: 'reduceLeaveDetail', payload: {} });
    },
    /**
     * 创建请假记录
     * @param {string} leaveType 请假类型
     * @param {number} startTime 开始时间
     * @param {number} endTime 结束时间
     * @param {number} hour 加班时长
     * @param {string} agent 工作代理人
     * @param {string} note 事由及说明
     * @param {array}  fileList 上传附件
     * @param {number} leaveDayType 请假时长类型
     * @param {string} examineFlow 审批流ID
     * @param {string} examineNodeId 审批节点ID
     * @param {string} oaNodeAccountId 下一节点审批人ID
     * @param {string} id 编辑id
     * @memberof module:model/oa/attendance~oa/attendance/effects
     */
    * createLeave({ payload = {} }, { call }) {
      // 配置审批流参数
      const mapper = OAPayloadMapper(payload);
      if (mapper === false && !payload.flag) {
        return message.error('审批流配置错误');
      }
      const params = {
        ...mapper,
      };

      // 请假类型
      if (is.not.empty(payload.leaveType) && is.existy(payload.leaveType)) {
        params.leave_type = Number(payload.leaveType);
      }
      // 开始时间
      if (is.not.empty(payload.startTime) && is.existy(payload.startTime)) {
        params.from_time = moment(payload.startTime).format('YYYY-MM-DD HH:mm:00');
      }
      // 结束时间
      if (is.not.empty(payload.endTime) && is.existy(payload.endTime)) {
        params.end_time = moment(payload.endTime).format('YYYY-MM-DD HH:mm:00');
      }
      // 请假时长
      if (is.not.empty(payload.hour) && is.existy(payload.hour)) {
        params.hour = Number(payload.hour);
      }
      // 请假时长类型, 编辑不传
      if (!payload.flag && (is.not.empty(payload.leaveDayType) && is.existy(payload.leaveDayType))) {
        params.leave_day_type = Number(payload.leaveDayType);
      }
      // 工作代理人
      if (is.not.empty(payload.agent) && is.existy(payload.agent)) {
        params.agent = payload.agent;
      }
      // 事由及说明
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.note = payload.note;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }
      // id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }

      let result = {};
      // 判断是否是编辑
      if (payload.flag) {
        result = yield call(updateLeave, params);
      } else {
        result = yield call(createLeave, params);
      }
      if (result.zh_message) {
        message.error(result.zh_message);
        if (payload.onFailureCallback) {
          payload.onFailureCallback();
        }
        return;
      }
      if (result._id) {
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      }
    },
    /**
     * 获取加班记录
     * @memberof module:model/oa/attendance~oa/attendance/effects
     */
    * fetchOvertimeDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceOvertimeDetail', payload: oaDetail });
        return;
      }
      const params = {};
      // id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      const result = yield call(fetchOvertimeDetail, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      if (result) {
        yield put({ type: 'reduceOvertimeDetail', payload: result });
      }
    },
    /**
     * 清空加班记录
     * @memberof module:model/oa/attendance~oa/attendance/effects
     */
    * resetOvertimeDetail({ payload }, { put }) {
      yield put({ type: 'reduceOvertimeDetail', payload: {} });
    },
    /**
     * 创建加班记录
     * @param {string} startTime 开始时间
     * @param {string} endTime 结束时间
     * @param {number} hour 加班时长
     * @param {string} note 事由及说明
     * @param {array}  fileList 上传附件
     * @param {string} examineFlow 审批流ID
     * @param {string} examineNodeId 审批节点ID
     * @param {string} oaNodeAccountId 下一节点审批人ID
     * @param {string} id 编辑id
     * @memberof module:model/oa/attendance~oa/attendance/effects
     */
    * createOvertime({ payload = {} }, { call }) {
      // 配置审批流参数
      const mapper = OAPayloadMapper(payload);
      if (mapper === false && !payload.flag) {
        return message.error('审批流配置错误');
      }
      const params = {
        ...mapper,
      };

      // 开始时间
      if (is.not.empty(payload.startTime) && is.existy(payload.startTime)) {
        params.from_time = moment(payload.startTime).format('YYYY-MM-DD HH:mm:00');
      }
      // 结束时间
      if (is.not.empty(payload.endTime) && is.existy(payload.endTime)) {
        params.end_time = moment(payload.endTime).format('YYYY-MM-DD HH:mm:00');
      }
      // 加班时长
      if (is.not.empty(payload.hour) && is.existy(payload.hour)) {
        params.hour = payload.hour;
      }
      // 事由及说明
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.note = payload.note;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }
      // id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }

      let result = {};
      // 判断是否是编辑
      if (payload.flag) {
        result = yield call(updateOvertime, params);
      } else {
        result = yield call(createOvertime, params);
      }
      if (result.zh_message) {
        message.error(result.zh_message);
        if (payload.onFailureCallback) {
          payload.onFailureCallback();
        }
        return;
      }
      if (result._id) {
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      }
    },
    /**
     * 获取外出记录
     * @memberof module:model/oa/attendance~oa/attendance/effects
     */
    * fetchExternalOutDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceExternalOutDetail', payload: oaDetail });
      }
      const params = {};
      // id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      const result = yield call(fetchExternalOutDetail, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      if (result) {
        yield put({ type: 'reduceExternalOutDetail', payload: result });
      }
    },
    /**
     * 清空外出记录
     * @memberof module:model/oa/attendance~oa/attendance/effects
     */
    * resetExternalOutDetail({ payload }, { put }) {
      yield put({ type: 'reduceExternalOutDetail', payload: {} });
    },
    /**
     * 创建外出记录
     * @param {number} fromTime 外出时间
     * @param {number} endTime 返回时间
     * @param {string} address 外出地点
     * @param {string} partner 同行人员
     * @param {string} note 事由及说明
     * @param {array}  fileList 上传附件
     * @param {string} examineFlow 审批流ID
     * @param {string} examineNodeId 审批节点ID
     * @param {string} oaNodeAccountId 下一节点审批人ID
     * @param {string} id 编辑id
     * @memberof module:model/oa/attendance~oa/attendance/effects
     */
    * createExternalOut({ payload = {} }, { call }) {
      // 配置审批流参数
      const mapper = OAPayloadMapper(payload);
      if (mapper === false && !payload.flag) {
        return message.error('审批流配置错误');
      }
      const params = {
        ...mapper,
      };

      // 外出时间
      if (is.not.empty(payload.fromTime) && is.existy(payload.fromTime)) {
        params.from_time = moment(payload.fromTime).format('YYYY-MM-DD HH:mm:00');
      }
      // 返回时间
      if (is.not.empty(payload.endTime) && is.existy(payload.endTime)) {
        params.end_time = moment(payload.endTime).format('YYYY-MM-DD HH:mm:00');
      }
      // 外出地点
      if (is.not.empty(payload.address) && is.existy(payload.address)) {
        params.address = payload.address;
      }

      // 同行人员
      if (is.not.empty(payload.partner) && is.existy(payload.partner)) {
        params.partner = payload.partner;
      }
      // 事由及说明
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.note = payload.note;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }
      // id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }

      let result = {};
      // 判断是否是编辑
      if (payload.flag) {
        result = yield call(updateExternalOut, params);
      } else {
        result = yield call(createExternalOut, params);
      }
      if (result.zh_message) {
        message.error(result.zh_message);
        if (payload.onFailureCallback) {
          payload.onFailureCallback();
        }
        return;
      }
      if (result._id) {
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      }
    },
    /**
     * 获取异常记录
     * @memberof module:model/oa/attendance~oa/attendance/effects
     */
    * fetchAbnormalDetail({ payload = {} }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceAbnormalDetail', payload: oaDetail });
        return;
      }
      const params = {};
      // id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params._id = payload.id;
      }
      const result = yield call(fetchAbnormalDetail, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      if (result) {
        yield put({ type: 'reduceAbnormalDetail', payload: result });
      }
    },
    /**
     * 清空异常记录
     * @memberof module:model/oa/attendance~oa/attendance/effects
     */
    * resetAbnormalDetail({ payload }, { put }) {
      yield put({ type: 'reduceAbnormalDetail', payload: {} });
    },
    /**
     * 创建异常记录
     * @param {number} exceptionType 异常类型
     * @param {number} exceptionDate 考勤异常日期
     * @param {string} fromTime 开始时间
     * @param {string} endTime 结束时间
     * @param {string} note 事由及说明
     * @param {array}  fileList 上传附件
     * @param {string} examineFlow 审批流ID
     * @param {string} examineNodeId 审批节点ID
     * @param {string} oaNodeAccountId 下一节点审批人ID
     * @param {string} id 编辑id
     * @memberof module:model/oa/attendance~oa/attendance/effects
     */
    * createAbnormal({ payload = {} }, { call }) {
      // 配置审批流参数
      const mapper = OAPayloadMapper(payload);
      if (mapper === false && !payload.flag) {
        return message.error('审批流配置错误');
      }
      const params = {
        ...mapper,
      };
      // 异常类型
      if (is.not.empty(payload.exceptionType) && is.existy(payload.exceptionType)) {
        params.exception_type = payload.exceptionType;
      }
      // 考勤异常日期
      if (is.not.empty(payload.exceptionDate) && is.existy(payload.exceptionDate)) {
        params.exception_date = Number(moment(payload.exceptionDate).format('YYYYMMDD'));
      }
      // 开始时间
      if (is.not.empty(payload.fromTime) && is.existy(payload.fromTime)) {
        params.from_period = moment(payload.fromTime).format('HH:mm');
      }
      // 结束时间
      if (is.not.empty(payload.endTime) && is.existy(payload.endTime)) {
        params.end_period = moment(payload.endTime).format('HH:mm');
      }
      // 事由及说明
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.note = payload.note;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }
      // id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }

      let result = {};
      // 判断是否是编辑
      if (payload.flag) {
        result = yield call(updateAbnormal, params);
      } else {
        result = yield call(createAbnormal, params);
      }
      if (result.zh_message) {
        message.error(result.zh_message);
        if (payload.onFailureCallback) {
          payload.onFailureCallback();
        }
        return;
      }
      if (result._id) {
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      }
    },
  },

  /**
   * @namespace oa/attendance/reducers
   */
  reducers: {
    /**
     * 获取请假记录
     * @return {object} 更新 leaveDetail
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceLeaveDetail(state, action) {
      return {
        ...state,
        leaveDetail: action.payload,
      };
    },
    /**
     * 获取加班记录
     * @return {object} 更新 overtimeDetail
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceOvertimeDetail(state, action) {
      return {
        ...state,
        overtimeDetail: action.payload,
      };
    },
    /**
     * 获取外出记录
     * @return {object} 更新 externalOutDetail
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceExternalOutDetail(state, action) {
      return {
        ...state,
        externalOutDetail: action.payload,
      };
    },
    /**
     * 获取异常记录
     * @return {object} 更新 abnormalDetail
     * @memberof module:model/finance/plan~finance/plan/reducers
     */
    reduceAbnormalDetail(state, action) {
      return {
        ...state,
        abnormalDetail: action.payload,
      };
    },
  },
};
