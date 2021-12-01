/**
 * 组织架构 - 岗位管理
 * @module model/organization/staffs
 **/
import is from 'is_js';
import { message } from 'antd';

import {
  getStaffList,
  createStaff,
  updateStaff,
  deleteStaff,
  getPostTags,
} from '../../services/organization/staffs';
import { OrganizationStaffsState } from '../../application/define';

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'organizationStaff',
  /**
   * 状态树
   * @prop {object} staffsList 岗位列表
   */
  state: {
    postTags: {},
    staffList: {},
    allStaffList: {},
  },
  /**
   * @namespace organization/staffs/effects
   */
  effects: {
    /**
     * 获取岗位列表
     * @param {string} staffName 岗位名称
     * @memberof module:model/organization/staffs~organization/staffs/effects
     */
    getStaffList: [
      function*({ payload = {} }, { call, put }) {
        const {
          limit = 30,
          page = 1,
          staffName = undefined,
          code,
          rank,
        } = payload;
        // 请求列表的meta信息
        const params = {
          _meta: { limit, page },
        };

         // 岗位名称
        if (is.existy(staffName) && is.not.empty(staffName)) {
          params.name = payload.staffName;
        }
        // 岗位编号
        if (is.existy(code) && is.not.empty(code)) {
          params.code = payload.code;
        }
        // 岗位职级
        if (is.existy(rank) && is.not.empty(rank)) {
          params.rank = payload.rank;
        }

        // 审批岗位标签
        payload.tags && (params.apply_tags = [payload.tags]);

        const result = yield call(getStaffList, params);

        if (is.existy(result)) {
          yield put({ type: 'reduceStaffList', payload: result });
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 重置岗位列表
     */
    * resetStaffList({ payload = {} }, { put }) {
      yield put({ type: 'reduceStaffList', payload });
    },

    /**
     * 创建岗位
     * @param {string} id 岗位id
     * @param {string} staffName 岗位名称
     * @param {string} staffNum 岗位编号
     */
    * createStaff({ payload = {} }, { call }) {
      const {
        staffName = undefined,
        staffNum = undefined,
        staffRank = undefined,
        tags = undefined,
        onSuccessCallback,
        onFailureCallback,
      } = payload;

      if (!is.existy(staffName) || is.empty(staffName)) {
        return message.error('缺少岗位名称');
      }
      if (!is.existy(staffNum) || is.empty(staffNum)) {
        return message.error('缺少岗位编号');
      }
      if (!is.existy(staffRank) || is.empty(staffRank)) {
        return message.error('缺少岗位编号');
      }

      const params = {
        name: staffName.replace(/(^\s+)|(\s+$)|\s+/g, ''),
        code: staffNum,
        rank: staffRank,
      };

      // 审批岗位标签
      tags && (params.apply_tags = tags);

      const result = yield call(createStaff, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 编辑岗位
     * @param {string} id 岗位id
     * @param {string} staffName 岗位名称
     * @param {string} staffNum 岗位编号
     */
    * updateStaff({ payload = {} }, { call }) {
      const {
        id,
        staffName = undefined,
        staffNum = undefined,
        staffRank = undefined,
        tags,
        onSuccessCallback,
        onFailureCallback,
      } = payload;

      if (!is.existy(id) || is.empty(id)) {
        return message.error('缺少岗位id');
      }
      if (!is.existy(staffName) || is.empty(staffName)) {
        return message.error('缺少岗位名称');
      }
      if (!is.existy(staffNum) || is.empty(staffNum)) {
        return message.error('缺少岗位编号');
      }
      if (!is.existy(staffRank) || is.empty(staffRank)) {
        return message.error('缺少岗位编号');
      }

      const params = {
        _id: id,
        name: staffName.replace(/(^\s+)|(\s+$)|\s+/g, ''),
        code: staffNum,
        rank: staffRank,
      };

      // 审批岗位标签
      tags && (params.apply_tags = tags);

      const result = yield call(updateStaff, params);
      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback(result);
      }
    },

    /**
     * 删除岗位
     * @param {string} id 岗位id
     */
    * deleteStaff({ payload = {} }, { call }) {
      const { id, onSuccessCallback, onFailureCallback } = payload;
      if (!is.existy(id) || is.empty(id)) {
        return message.error('缺少岗位id');
      }

      const params = { _id: id, state: OrganizationStaffsState.disable };

      const result = yield call(deleteStaff, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      } else {
        onFailureCallback && onFailureCallback();
      }
    },

    /**
     * 获取岗位标签
     * @memberof module:model/organization/staffs~organization/staffs/effects
     */
    * getPostTags({ payload = {} }, { call, put }) {
      const params = { state: [100], _meta: { page: 1, limit: 1000 } };
      const result = yield call(getPostTags, params);

      if (is.existy(result)) {
        yield put({ type: 'reducePostTags', payload: result });
      }
    },

    /*
     * 获取所有岗位
     */
    * getAllStaffList({ payload = {} }, { call, put }) {
      const params = {
        _meta: {
          page: 1,
          limit: 0,
        },
      };

      const res = yield call(getStaffList, params);

      if (is.existy(res)) {
        yield put({ type: 'reduceAllStaffList', payload: res });
      }
    },

    /**
     * 重置所有岗位
     */
    * resetAllStaffList({ payload = {} }, { put }) {
      yield put({ type: 'reduceAllStaffList', payload });
    },


  },
  /**
   * @namespace organization/staffs/reducers
   */
  reducers: {
    /**
     * 岗位列表
     * @returns {object} 更新 staffsList
     * @memberof module:model/organization/staffs~organization/staffs/reducers
     */
    reduceStaffList(state, action) {
      let staffList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        staffList = action.payload;
      }
      return { ...state, staffList };
    },

    /**
     * 岗位标签
     * @returns {object} 更新 postTags
     * @memberof module:model/organization/staffs~organization/staffs/reducers
     */
    reducePostTags(state, action) {
      let postTags = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        postTags = action.payload;
      }
      return { ...state, postTags };
    },

    /**
     * 所有岗位
     * @returns {object} 更新 allStaffList
     * @memberof module:model/organization/staffs~organization/staffs/reducers
     */
    reduceAllStaffList(state, action) {
      let allStaffList = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        allStaffList = action.payload;
      }
      return { ...state, allStaffList };
    },
  },
};
