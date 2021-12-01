/**
 *  CODE提报页相关接口模块
 * @module model/code/flow
 */
import is from 'is_js';
import {
  message,
} from 'antd';
import {
  fetchTreeData,
  fetchDepartmentPostDetail,
} from '../../services/code/document';

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'codeDocument',

  /**
   * 状态树
   */
  state: {
    treeData: {},
    departmentPostDetail: {}, // 组织管理详情
  },

  /**
   * @namespace code/codeDocument/effects
   */
  effects: {
    /**
     * 获取tree
     */
    fetchTreeData: [
      function*({ payload }, { call, put }) {
        const params = {};
        // 部门
        if (is.existy(payload.departmentId) && is.not.empty(payload.departmentId)) {
          params.department_id = payload.departmentId;
        }
        // 类型
        if (is.existy(payload.type) && is.not.empty(payload.type)) {
          params.scene_type = Number(payload.type);
        }
        // 部门岗位关系id
        if (is.existy(payload.departmentJobId) && is.not.empty(payload.departmentJobId)) {
          params.department_job_id = payload.departmentJobId;
        }
        const result = yield call(fetchTreeData, params);
        // 报错信息
        if (result.zh_message) {
          if (payload.onErrorCallback) {
            payload.onErrorCallback();
          }
          return message.error(`请求错误：${result.zh_message}`);
        }
        // 判断数据是否为空
        if (Array.isArray(result)) {
          if (payload.onSucessCallback) {
            payload.onSucessCallback();
          }
          yield put({ type: 'reduceTreeData', payload: result });
        }
      },
      { type: 'takeLatest' },
    ],
    /**
     * 组织管理详情
     * @memberof module:model/code/document~code/document/effects
     */
    *fetchDepartmentPostDetail({ payload }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      // 判断是否是外部审批单
      if (isPluginOrder) {
        yield put({ type: 'reduceDepartmentPostDetail', payload: oaDetail });
        return;
      }
      const params = {};
      // id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.oa_organization_order_id = payload.id;
      }

      const result = yield call(fetchDepartmentPostDetail, params);

      if (result) {
        yield put({ type: 'reduceDepartmentPostDetail', payload: result });
      }
    },

    /**
     * 重置tree
     */
    *resetTreeData({ payload }, { put }) {
      yield put({ type: 'reduceTreeData', payload: {} });
    },
  },

  /**
   * @namespace code/codeDocument/reducers
   */
  reducers: {
    /**
     * 获取tree
     * @returns {object} 更新 treeData
     * @memberof module:model/code/document~code/document/reducers
     */
    reduceTreeData(state, action) {
      return {
        ...state,
        treeData: { data: action.payload },
      };
    },
    /**
     * 组织管理详情
     * @returns {object} 更新 departmentPostDetail
     * @memberof module:model/code/document~code/document/reducers
     */
    reduceDepartmentPostDetail(state, action) {
      return {
        ...state,
        departmentPostDetail: action.payload,
      };
    },
  },
};
