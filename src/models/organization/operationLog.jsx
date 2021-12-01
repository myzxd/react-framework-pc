/**
 * 组织架构 - 操作日志
 * @module model/organization/organizationOperationLog
 **/
import is from 'is_js';
import moment from 'moment';
import { message } from 'antd';

import {
  fetchOperationLogList,
  fetchOperationObject,
} from '../../services/organization/operationLog';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'organizationOperationLog',
  /**
   * 状态树
   * @prop {object} operationLogList 操作日志列表
   * @prop {object} operationObject 操作对象
   */
  state: {
    operationLogList: {}, // 操作日志列表
    operationObject: {}, // 操作对象
  },
  /**
   * @namespace organization/organizationOperationLog/effects
   */
  effects: {
    /**
     * 获取岗位列表
     * @param {string} name 操作者
     * @param {object} domain 操作对象
     * @param {number} start_date 开始时间
     * @param {number} end_date 结束时间
     * @param {number} page 页码
     * @param {number} limit 条数
     * @memberof module:model/organization/organizationOperationLog~organization/organizationOperationLog/effects
     */
    * fetchOperationLogList({ payload = {} }, { call, put }) {
      const params = {};
      const meta = {};
      // 页码
      if (is.existy(payload.page) && is.not.empty(payload.page)) {
        meta.page = payload.page;
      }
      // 条数
      if (is.existy(payload.limit) && is.not.empty(payload.limit)) {
        meta.limit = payload.limit;
      }
      // 分页
      if (is.existy(meta) && is.not.empty(meta)) {
        params._meta = meta;
      }
      // 操作者
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 操作对象
      if (is.existy(payload.domain) && is.not.empty(payload.domain)) {
        params.domain = payload.domain;
      }
      // 时间
      if (is.existy(payload.date) && is.not.empty(payload.date)) {
        params.start_date = Number(moment(payload.date[0]).format('YYYYMMDD'));
        params.end_date = Number(moment(payload.date[1]).format('YYYYMMDD'));
      }

      // 姓名
      payload.employeeName && (params.employee_name = payload.employeeName);
      // 部门
      payload.department && (params.department_id = payload.department);

      const result = yield call(fetchOperationLogList, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      if (result) {
        yield put({ type: 'reduceOperationLogList', payload: result });
      }
    },
    /**
     * 获取操作对象
     * @memberof module:model/organization/organizationOperationLog~organization/organizationOperationLog/effects
     */
    * fetchOperationObject({ payload = {} }, { call, put }) {
      const params = {};
      const result = yield call(fetchOperationObject, params);
      if (result.zh_message) {
        message.error(result.zh_message);
        return;
      }
      if (result) {
        yield put({ type: 'reduceOperationObject', payload: result });
      }
    },
  },
  /**
   * @namespace organization/organizationOperationLog/reducers
   */
  reducers: {
    /**
     * 岗位列表
     * @returns {object} 更新 operationLogList
     * @memberof module:model/organization/organizationOperationLog~organization/organizationOperationLog/reducers
     */
    reduceOperationLogList(state, action) {
      return {
        ...state,
        operationLogList: action.payload,
      };
    },
    /*
    * 操作对象
    * @returns {object} 更新 operationObject
    * @memberof module:model/organization/organizationOperationLog~organization/organizationOperationLog/reducers
    */
    reduceOperationObject(state, action) {
      return {
        ...state,
        operationObject: action.payload,
      };
    },
  },
};
