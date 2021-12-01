/**
 * 人员档案变更相关model
 * @module model/employee/fileChange
 **/
import is from 'is_js';
import {
  message,
} from 'antd';

import {
  UpdateFileType,            // 变更档案类型
  createContract,             // 新增合同
  fetchEmployeeChangeRecord,          // 档案变更记录
  fetchApprovalList,                  // 审批单（调岗单）列表
  fetchNewContractInfo,                 // 员工档案-员工合同信息
} from '../../services/employee';

import { FileType } from '../../application/define/index';

export default {
  /**
   * 命名空间
   */
  namespace: 'fileChange',
  /**
   * 状态
   */
  state: {
    fileChangeLog: undefined, //  档案变更记录
    approvalList: [],  // 审批单（调岗单）列表
    newContractInfo: {},   // 员工档案-员工合同信息
  },

  /**
   * @namespace employee/fileChange/effects
   */
  effects: {
    /**
     * 变更档案类型
     * @param {string}  staffId  人员档案id
     * @param {string}   currentFileType   当前档案类型
     * @param {string}   changedFileType   变更档案类型
     * @param {string}   applicationOrderId   关联审批单号
     * @param {string}   staffChangeOrderId   关联调岗申请单号
     */
    * UpdateFileType({
      payload = {},
    }, {
      call,
    }) {
      // 默认参数
      const params = {};
      // 员工档案id
      if (is.existy(payload.staffId) && is.not.empty(payload.staffId)) {
        params.staff_id = payload.staffId;
      }
      // 目前档案类型
      if (is.existy(payload.currentFileType) && is.not.empty(payload.currentFileType)) {
        params.profile_type = payload.currentFileType;
      }
      // 变更后档案类型
      if (is.existy(payload.changedFileType) && is.not.empty(payload.changedFileType)) {
        params.changed_profile_type = payload.changedFileType;
      }
      // 关联审批单号
      if (is.existy(payload.applicationOrderId) && is.not.empty(payload.applicationOrderId)) {
        params.oa_application_order_id = payload.applicationOrderId;
      }
      // 关联调岗申请单号
      if (is.existy(payload.staffChangeOrderId) && is.not.empty(payload.staffChangeOrderId)) {
        params.staff_change_order_id = payload.staffChangeOrderId;
      }

      // 请求服务器
      const result = yield call(UpdateFileType, params);
      // 判断数据是否为空
      if (is.existy(result) && is.truthy(result.ok)) {
        message.success('变更成功,页面即将跳转');
        const fileType = payload.changedFileType;
        return setTimeout(() => {
          window.location.href = `/#/Employee/Manage?fileType=${fileType === FileType.second ? 'second' : 'staff'}`;
        }, 1000);
      }
      if (is.existy(result.zh_message) && is.truthy(result.zh_message)) {
        return message.error(result.zh_message);
      }
    },
    /**
     * 新增合同
     * @param {number}  signingType  签约类型
     * @param {string}   effectiveDate   合同生效日期
     * @param {string}   contractBelong   合同甲方id
     * @param {number}   contractType   合同类型
     * @param {string}   contractNumber   合同编号
     * @param {Array}   contractPhoto   合同照片
     */
    * createContract({
      payload = {},
    }, {
      call,
    }) {
      // 默认参数
      const params = {};
      // 手机号
      if (is.existy(payload.phone) && is.not.empty(payload.phone)) {
        params.phone = payload.phone;
      }
      // 姓名
      if (is.existy(payload.name) && is.not.empty(payload.name)) {
        params.name = payload.name;
      }
      // 身份证id
      if (is.existy(payload.identityCardId) && is.not.empty(payload.identityCardId)) {
        params.identity_card_id = payload.identityCardId;
      }

      // 签约类型
      if (is.existy(payload.signingType) && is.not.empty(payload.signingType)) {
        params.sign_type = payload.signingType;
      }
      // 合同生效日期
      if (is.existy(payload.effectiveDate) && is.not.empty(payload.effectiveDate)) {
        params.signed_date = payload.effectiveDate;
      }
      // 合同甲方id
      if (is.existy(payload.contractBelong) && is.not.empty(payload.contractBelong)) {
        params.contract_belong_id = payload.contractBelong;
      }
      // 合同类型
      if (is.existy(payload.contractType) && is.not.empty(payload.contractType)) {
        params.contract_type = payload.contractType;
      }
      // 签约周期
      if (is.existy(payload.signCycle) && is.not.empty(payload.signCycle)) {
        params.sign_cycle = payload.signCycle;
        params.sign_cycle_unit = Number(payload.signCycleUnit);
      }
      // 合同编号
      if (is.existy(payload.contractNumber) && is.not.empty(payload.contractNumber)) {
        params.contract_no = payload.contractNumber;
      }
      // 合同照片
      if (is.existy(payload.contractPhoto) && is.not.empty(payload.contractPhoto)) {
        params.contract_photo_list = payload.contractPhoto.keys;
      }

      // 请求服务器
      const result = yield call(createContract, params);

      // 判断数据是否为空
      if (is.existy(result) && is.truthy(result.ok)) {
        message.success('新增成功');
        if (payload.onSuccessCallBack) {
          payload.onSuccessCallBack();
        }
        return;
      }
      return message.error('新增失败');
    },
    /**
     * 获取档案变更记录
     */
    *fetchEmployeeChangeRecord({ payload }, { call, put }) {
      const params = {
        _meta: payload.pageConfig,
      };
      // 员工id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.staff_id = payload.id;
      }
      const result = yield call(fetchEmployeeChangeRecord, params);
      yield put({ type: 'reduceEmployeeChangeRecord', payload: result });
    },
    /**
     * 获取审批单和调岗单列表
     */
    *fetchApprovalList({ payload }, { call, put }) {
      const params = {
        state: [100],   // 状态固定值
      };
      // 员工id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.staff_id = payload.id;
      }
      const result = yield call(fetchApprovalList, params);
      yield put({ type: 'reduceApprovalList', payload: result });
    },
     /**
     * 获取员工档案-员工新增合同信息
     */
    *fetchNewContractInfo({ payload }, { call, put }) {
      const params = {};
      // 员工id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.identity_card_id = payload.id;
      }
      const result = yield call(fetchNewContractInfo, params);
      yield put({ type: 'reduceNewContractInfo', payload: result });
    },

    /**
     * 重置员工合同信息
     */
    *resetNewContractInfo({ payload }, { put }) {
      yield put({ type: 'reduceNewContractInfo', payload: {} });
    },
  },
  /**
  * @namespace employee/fileChange/reducers
  */
  reducers: {
    /**
     * 人员档案变更记录
     * @returns {object} 更新 fileChangeLog
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceEmployeeChangeRecord(state, action) {
      return { ...state, fileChangeLog: action.payload };
    },
    /**
     * 更新审批单和调岗单
     * @returns {object} 更新 contractData
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceApprovalList(state, action) {
      const { data } = action.payload;
      return { ...state, approvalList: data };
    },
    /**
     * 更新审批单和调岗单
     * @returns {object} 更新 contractData
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceNewContractInfo(state, action) {
      return { ...state, newContractInfo: action.payload };
    },
  },
};
