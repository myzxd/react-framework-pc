/**
 * 结算设置-骑士标签设置模块 (废弃)
 *
 * @module model/materials
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';

import { ResponseMeta, RequestMeta } from '../../../application/object';
import { StaffTagListItem, StaffTagMapListItem, SalaryStaffListItem } from '../../../application/object/salary/test';

import { fetchKnightTags, fetchKnightData, deleteKnightTags, createKnightTags, fetchAllKnight } from '../../../services/finance';

export default {

  /**
   * 命名空间
   * @default
   */
  namespace: 'financeConfigTags',

  /**
   * 状态树
   * @prop {object} knightTags 骑士标签列表数据
   * @prop {object} knightData 骑士数据
   * @prop {array} knightAll 所有骑士数据列表
   */
  state: {
    knightTags: {},       // 骑士标签列表数据
    knightData: {},       // 骑士数据
    knightAll: [],        // 所有骑士数据列表
  },

  /**
   * @namespace financeConfigTags/effects
   */
  effects: {

    /**
     * 获取骑士标签设置列表
     * @param {object} _meta 分页格式
     * @memberof module:model/financeConfigTags~financeConfigTags/effects
     */
    *fetchKnightTags({ payload }, { call, put }) {
      // 默认参数
      const params = {
        _meta: RequestMeta.mapper({ page: 1, limit: 1000 }),
      };
      // 请求服务器
      const result = yield call(fetchKnightTags, params);
      // 判断数据是否为空
      if (is.not.existy(result)) {
        message.error('返回数据错误');
        return;
      }
      // 如果是第一次加载 返回第一个标签的id
      if (payload.onFirstLoadSuccessCallback && is.array(result.data) && result.data.length !== 0) {
        payload.onFirstLoadSuccessCallback(result.data[0]._id);
      }
      yield put({ type: 'reduceKnightTags', payload: result });
    },

    /**
     * 获取骑士数据列表
     * @param {object} _meta 分页格式
     * @param {string} name 姓名
     * @param {phone} 手机号
     * @param {number} work_type 人员类型
     * @param {string} staff_tag_id 标签ID
     * @memberof module:model/financeConfigTags~financeConfigTags/effects
     */
    *fetchKnightData({ payload }, { call, put }) {
      // 默认参数
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 手机号
      if (is.existy(payload.phone) && is.not.empty(payload.phone)) {
        params.phone = payload.phone;
      }
      // 人员类型
      if (is.existy(payload.workType) && is.not.empty(payload.workType)) {
        params.work_type = Number(payload.workType); // 转换字符串为数值(int)类型
      }
      // 标签ID
      if (is.existy(payload.selectedTagId) && is.not.empty(payload.selectedTagId)) {
        params.staff_tag_id = payload.selectedTagId;
      }
      // 请求服务器
      const result = yield call(fetchKnightData, params);
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceKnightData', payload: result });
      }
    },

    /**
     * 删除骑士标签
     * @param {array} staff_ids 骑士id列表
     * @param {string} tag_id 标签ID
     * @memberof module:model/financeConfigTags~financeConfigTags/effects
     */
    *deleteKnightTags({ payload }, { call }) {
      // 默认参数
      const params = {
        staff_ids: [], // 删除骑士id列表
      };
      // 删除骑士id列表
      if (is.existy(payload.removeParams) && is.not.empty(payload.removeParams)) {
        params.staff_ids = payload.removeParams;
      }
      // 标签ID
      if (is.existy(payload.selectedTagId) && is.not.empty(payload.selectedTagId)) {
        params.tag_id = payload.selectedTagId;
      }
      // 请求服务器
      const result = yield call(deleteKnightTags, params);
      // 判断数据是否为空
      if (is.not.existy(result)) {
        message.error('返回数据错误');
        return;
      }
      // 判断数据是否返回成功
      if (result.ok === false) {
        message.error('删除失败');
        return;
      }
      message.success('删除成功');
      // 回调函数
      if (payload.onDeleteSuccessCallback) {
        payload.onDeleteSuccessCallback();
      }
    },

    /**
     * 骑士添加标签
     * @param {array} staff_ids 骑士id列表
     * @param {string} tag_id 标签ID
     * @memberof module:model/financeConfigTags~financeConfigTags/effects
     */
    *createKnightTags({ payload }, { call }) {
      const params = {};
      // 骑士ID
      if (is.existy(payload.staffIds) && is.not.empty(payload.staffIds) && is.array(payload.staffIds)) {
        params.staff_ids = payload.staffIds;
      }
      // 标签ID
      if (is.existy(payload.tagId) && is.not.empty(payload.tagId)) {
        params.tag_id = payload.tagId;
      }
      // 请求服务器
      const result = yield call(createKnightTags, params);

      // 判断数据是否为空
      if (is.existy(result) && is.truthy(result.ok) && is.existy(result.record)) {
        message.success('添加成功');
        // 回调函数
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result.record);
        }
      }
    },

    /**
     * 获取所有骑士数据
     * @param {object} _meta 分页格式
     * @param {string} name 姓名
     * @param {number} phone 手机号
     * @param {number} work_type 人员类型
     * @memberof module:model/financeConfigTags~financeConfigTags/effects
     */
    *fetchAllKnight({ payload }, { call, put }) {
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 手机号
      if (is.existy(payload.phone) && is.not.empty(payload.phone)) {
        params.phone = payload.phone;
      }
      // 人员类型
      if (is.existy(payload.workType) && is.not.empty(payload.workType)) {
        params.work_type = Number(payload.workType); // 转换字符串为数值(int)类型
      }

      const result = yield call(fetchAllKnight, params);
      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceAllKnight', payload: result });
      }
    },
  },

  /**
   * @namespace financeConfigTags/reducers
   */
  reducers: {
    /**
     * 骑士标签设置列表
     * @returns {object} 更新 knightTags
     * @memberof module:model/financeConfigTags~financeConfigTags/reducers
     */
    reduceKnightTags(state, action) {
      const knightTags = {
        meta: ResponseMeta.mapper(action.payload._meta) || {},
        data: StaffTagListItem.mapperEach(action.payload.data, StaffTagListItem) || [],
      };
      return { ...state, knightTags };
    },

    /**
     * 骑士数据
     * @returns {object} 更新 knightData
     * @memberof module:model/financeConfigTags~financeConfigTags/reducers
     */
    reduceKnightData(state, action) {
      const knightData = {
        meta: ResponseMeta.mapper(action.payload._meta) || {},
        data: StaffTagMapListItem.mapperEach(action.payload.data, StaffTagMapListItem) || [],
      };
      return { ...state, knightData };
    },

    /**
     * 所有骑士数据
     * @returns {array} 更新 knightAll
     * @memberof module:model/financeConfigTags~financeConfigTags/reducers
     */
    reduceAllKnight(state, action) {
      const knightAll = {
        meta: ResponseMeta.mapper(action.payload._meta) || {},
        data: SalaryStaffListItem.mapperEach(action.payload.data, SalaryStaffListItem) || [],
      };
      return { ...state, knightAll };
    },
  },
};
