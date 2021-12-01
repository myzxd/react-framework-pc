/**
 * 人员异动管理modal
 * @module model/employee/turnover
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import { message } from 'antd';

import {
  fetchEmployeeTurnoverData,
  fetchEmployeeTurnoverDetail,
  createEmployeeTurnover,
  updateEmployeeTurnover,
  EmployeeTurnoverApproval,
} from '../../services/employee';

export default {

  /**
   * 命名空间
   * @default
   */
  namespace: 'employeeTurnover',

  /**
   * 状态树
   * @prop {object} employeeTurnoverData 人员异动列表信息
   * @prop {object} employeeTurnoverDetail 人员异动详情信息
   */
  state: {
    employeeTurnoverData: {},           // 人员异动列表信息
    employeeTurnoverDetail: {},         // 人员异动详情信息
  },

  /**
   * @namespace employee/turnover/effects
   */
  effects: {
    /**
     * 获取人员异动管理列表
     * @param {string} applyState 申请状态
     * @param {string} change 信息变更任务
     * @param {array} themeTag 主题标签
     * @param {string} postName 调岗人姓名
     * @param {string} idCard 身份证
     * @param {number} page 页码
     * @param {number} limit 每页数量
     * @memberof module:model/employee/turnover~employee/turnover/effects
     */
    *fetchEmployeeTurnoverData({ payload }, { call, put }) {
      const {
        applyState, // 申请状态
        change, // 信息变更任务
        themeTag, // 主题标签
        postName, // 调岗人姓名
        idCard, // 身份证
        examineNum,  // 审批单号
        page,
        limit,
      } = payload;
      const params = {
        _meta: {
          page: 1,
          limit: 30,
        },
        task_state: [10, 100],
      };
       // 申请状态
      if (is.not.empty(applyState) && is.existy(applyState)) {
        params.state = applyState;
      }

      // 信息变更任务
      if (is.not.empty(change) && is.existy(change)) {
        params.task_state = [change];
      }

      // 主题标签
      if (is.not.empty(themeTag) && is.existy(themeTag)) {
        params.theme_tags = themeTag;
      }

      // 调岗人姓名
      if (is.not.empty(postName) && is.existy(postName)) {
        params.name = postName;
      }

      // 身份证号码
      if (is.not.empty(idCard) && is.existy(idCard)) {
        params.identity_card_id = idCard;
      }
      // 审批单号
      if (is.not.empty(examineNum) && is.existy(examineNum)) {
        params._id = examineNum;
      }

      if (is.existy(page) && is.number(page)) {
        params._meta.page = page;
      }

      if (is.existy(limit) && is.number(limit)) {
        params._meta.limit = limit;
      }
      const result = yield call(fetchEmployeeTurnoverData, params);

      if (is.not.existy(result) || is.empty(result)) {
        return message('获取人员合同列表失败');
      }

      yield put({
        type: 'reduceEmployeeTurnoverData',
        payload: result,
      });
    },
    /**
     * 获取人员异动详情
     * @param {string} id 人员异动ID
     * @memberof module:model/employee/turnover~employee/turnover/effects
     */
    *fetchEmployeeTurnoverDetail({ payload }, { call, put }) {
      const { id } = payload;
      const params = {};
      // 人员异动id
      if (is.not.empty(id) && is.existy(id)) {
        params._id = id;
      }

      const result = yield call(fetchEmployeeTurnoverDetail, params);

      if (is.existy(result) && is.not.empty(result)) {
        yield put({
          type: 'reduceEmployeeTurnoverDetail',
          payload: result,
        });
      }
    },
    /**
     * 人员异动创建
     * @param {string} postIdCard 调岗人员
     * @param {string} department 所属部门
     * @param {string} postName 岗位名称
     * @param {string} postWhy 岗位原因
     * @param {string} afterDepartment 调岗后部门
     * @param {string} postAfterName 调岗后岗位
     * @param {string} expectDate 期望生效时间
     * @param {array} themeTag 主题标签
     * @param {string} note 备注
     * @param {array} fileList 附件
     * @memberof module:model/employee/turnover~employee/turnover/effects
     */
    *createEmployeeTurnover({ payload }, { call }) {
      const {
        employeeId, // 调岗人员
        department, // 所属部门
        postName, // 岗位名称
        postWhy,  // 岗位原因
        afterDepartment, // 调岗后部门
        postAfterName, // 调岗后岗位
        effectDate, // 期望生效时间
        themeTag, // 主题标签
        note, // 备注
        fileList, // 附件
      } = payload;
      // 参数
      const params = {
        storage_type: 3, // 上传类型
      };

      // 调岗人员
      if (is.not.empty(employeeId) && is.existy(employeeId)) {
        params.changed_staff_id = employeeId;
      }

      // 所属部门
      if (is.not.empty(department) && is.existy(department)) {
        params.department = department;
      }

      // 岗位名称
      if (is.not.empty(postName) && is.existy(postName)) {
        params.station = postName;
      }

      // 岗位原因
      if (is.not.empty(postWhy) && is.existy(postWhy)) {
        params.change_reason = postWhy;
      }

      // 调岗后部门
      if (is.not.empty(afterDepartment) && is.existy(afterDepartment)) {
        params.adjusted_department = afterDepartment;
      }

      // 调岗后岗位
      if (is.not.empty(postAfterName) && is.existy(postAfterName)) {
        params.adjusted_station = postAfterName;
      }

      // 期望生效时间
      if (is.not.empty(effectDate) && is.existy(effectDate)) {
        params.active_at = effectDate;
      }

       // 主题标签
      if (is.not.empty(themeTag) && is.existy(themeTag)) {
        params.theme_tags = themeTag;
      }

      // 备注
      if (is.not.empty(note) && is.existy(note)) {
        params.note = note;
      }

       // 附件
      if (is.not.empty(fileList) && is.existy(fileList)) {
        params.file_list = fileList;
      }
      const result = yield call(createEmployeeTurnover, params);

      if (result.zh_message) {
        message.error(result.zh_message);
      }
      if (result && result.ok) {
        message.success('请求成功');
        payload.onSuccessCallback && payload.onSuccessCallback(result);
      } else {
        payload.onFailureCallback && payload.onFailureCallback(result);
      }
    },
    /**
     * 人员异动编辑
     * @param {string} postIdCard 调岗人员
     * @param {string} department 所属部门
     * @param {string} postName 岗位名称
     * @param {string} postWhy 岗位原因
     * @param {string} afterDepartment 调岗后部门
     * @param {string} postAfterName 调岗后岗位
     * @param {string} expectDate 期望生效时间
     * @param {array} themeTag 主题标签
     * @param {string} note 备注
     * @param {array} fileList 附件
     * @param {string} id   人员id
     * @memberof module:model/employee/turnover~employee/turnover/effects
     */
    *updateEmployeeTurnover({ payload }, { call }) {
      const {
        employeeId, // 调岗人员
        department, // 所属部门
        postName, // 岗位名称
        postWhy,  // 岗位原因
        afterDepartment, // 调岗后部门
        postAfterName, // 调岗后岗位
        effectDate, // 期望生效时间
        themeTag, // 主题标签
        note, // 备注
        fileList, // 附件
        id, // 人员id
        changeState, // 变更状态
      } = payload;
      // 参数
      const params = {
        storage_type: 3, // 上传类型
      };

      // 人员异动id
      if (is.not.empty(id) && is.existy(id)) {
        params._id = id;
      }

      // 调岗人员
      if (is.not.empty(employeeId) && is.existy(employeeId)) {
        params.changed_staff_id = employeeId;
      }

      // 变更状态
      if (is.not.empty(changeState) && is.existy(changeState)) {
        params.task_state = changeState;
      }

      // 所属部门
      if (is.not.empty(department) && is.existy(department)) {
        params.department = department;
      } else {
        params.department = '';
      }

      // 岗位名称
      if (is.not.empty(postName) && is.existy(postName)) {
        params.station = postName;
      }

      // 岗位原因
      if (is.not.empty(postWhy) && is.existy(postWhy)) {
        params.change_reason = postWhy;
      }

      // 调岗后部门
      if (is.not.empty(afterDepartment) && is.existy(afterDepartment)) {
        params.adjusted_department = afterDepartment;
      } else {
        params.adjusted_department = '';
      }

      // 调岗后岗位
      if (is.not.empty(postAfterName) && is.existy(postAfterName)) {
        params.adjusted_station = postAfterName;
      }

      // 期望生效时间
      if (is.not.empty(effectDate) && is.existy(effectDate)) {
        params.active_at = effectDate;
      }

       // 主题标签
      if (is.not.empty(themeTag) && is.existy(themeTag)) {
        params.theme_tags = themeTag;
      }

      // 备注
      if (is.not.empty(note) && is.existy(note)) {
        params.note = note;
      }

       // 附件
      if (is.not.empty(fileList) && is.existy(fileList)) {
        params.file_list = fileList;
      }

      const result = yield call(updateEmployeeTurnover, params);
      // 错误信息
      if (result.zh_message) {
        message.error(result.zh_message);
      }
      // 成功信息
      if (result && result.ok) {
        message.success('请求成功');
        payload.onSuccessCallback && payload.onSuccessCallback(result);
      } else {
        payload.onFailureCallback && payload.onFailureCallback(result);
      }
    },
    /**
     * 人员异动删除
     * @param {string} id 异动id
     * @param {string} taskState 更改状态
     * @memberof module:model/employee/turnover~employee/turnover/effects
     */
    *EmployeeTurnoverDelete({ payload }, { call }) {
      const {
        id,
        taskState,
      } = payload;
      // 参数
      const params = {};

      // 人员异动id
      if (is.not.empty(id) && is.existy(id)) {
        params._id = id;
      }

      // 更改状态
      if (is.not.empty(taskState) && is.existy(taskState)) {
        params.task_state = taskState;
      }

      const result = yield call(updateEmployeeTurnover, params);

      if (result.zh_message) {
        message.error(result.zh_message);
      }
      if (result && result.ok) {
        message.success('删除成功');
        payload.onSuccessCallback && payload.onSuccessCallback(result);
      }
    },
    /**
     * 人员异审批
     * @param {string} turnoverId 异动id
     * @param {string} examineFlowId 审批流id
     * @memberof module:model/employee/turnover~employee/turnover/effects
     */
    *EmployeeTurnoverApproval({ payload }, { call }) {
      // 参数
      const params = {};

      // 下一节点审批id
      if (is.not.empty(payload.accountId) && is.existy(payload.accountId)) {
        params.next_node_account_id = payload.accountId;
      }

      // 下一节点岗位id
      if (is.not.empty(payload.postId) && is.existy(payload.postId)) {
        params.next_node_post_id = payload.postId;
      }

      // 人员异动id
      if (is.not.empty(payload.turnoverId) && is.existy(payload.turnoverId)) {
        params.staff_change_id = payload.turnoverId;
      }

      // 审批流id
      if (is.not.empty(payload.examineFlowId) && is.existy(payload.examineFlowId)) {
        params.flow_id = payload.examineFlowId;
      }

      const result = yield call(EmployeeTurnoverApproval, params);
      if (result && is.truthy(result.ok)) {
        message.success('操作成功');
        // 成功回调
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback();
        }
      } else {
        message.error(result.zh_message);
      }
    },
  },

  /**
   * @namespace employee/turnover/reducers
   */
  reducers: {

    /**
     * 人员合同列表
     * @returns {object} 更新 employeeTurnoverData
     * @memberof module:model/employee/turnover~employee/turnover/reducers
     */
    reduceEmployeeTurnoverData(state, action) {
      return { ...state, employeeTurnoverData: action.payload };
    },

    /**
     * 人员合同详情
     * @returns {object} 更新 employeeTurnoverDetail
     * @memberof module:model/employee/turnover~employee/turnover/reducers
     */
    reduceEmployeeTurnoverDetail(state, action) {
      return { ...state, employeeTurnoverDetail: action.payload };
    },
  },
};
