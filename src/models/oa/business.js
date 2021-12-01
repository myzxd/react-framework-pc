/**
 * oa - 财商类
 *
 * @module model/oa/business
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import moment from 'moment';
import { message } from 'antd';
import { FundTransferOtherReasonEnum, Unit, BusinessCompanyHandleType, OABorrowingType } from '../../application/define';
import { OAPayloadMapper } from './helper';

import {
  createBusinessFirmModifyOrder,
  updateBusinessFirmModifyOrder,
  fetchBusinessFirmModifyOrderDetail,
  fetchBusinessBankOrderDetail,
  createBusinessBankOrder,
  updateBusinessBankOrder,
  createBusinessPactBorrowOrder,
  updateBusinessPactBorrowOrder,
  fetchBusinessPactBorrowOrderDetail,
  createBusinessPactApplyOrder,
  updateBusinessPactApplyOrder,
  fetchBusinessSealTypes,
  fetchBusinessPactApplyOrderDetail,
  fetchBusinessPactContractSelect,
  fetchBusinessCompanySelect,
  fetchBusinessEmployeesSelect,
  fetchBusinessAccountSelect,
  fetchFundTransferCause,
  fetchFundTransferAmountRange,
  createFundTransfer,
  updateFundTransfer,
  fetchFundTransferDetail,
  fetchContractType,
} from '../../services/oa/business';

export default {
  /**
   * 命名空间
   * @prop {object} businessCompanyDetail 公司详情
   * @prop {object} businessBankDetail    银行详情
   * @prop {object} businessBorrowDetail  借阅详情
   * @prop {object} businessCameDetail    会审详情
   * @prop {object} contractSelectInfo    合同下拉信息
   * @prop {object} companySelectInfo     城市下拉信息
   * @prop {object} employeesSelectInfo   员工下拉
   * @prop {object} accountSelectInfo     账户信息
   */
  namespace: 'business',

  /**
   * 状态树
   */
  state: {
    businessCompanyDetail: {},
    businessBankDetail: {},
    businessBorrowDetail: {},
    businessCameDetail: {},
    contractSelectInfo: {},
    companySelectInfo: {},
    employeesSelectInfo: {},
    accountSelectInfo: {},
    firmAccountSelectInfo: {},
    fundTransferCauseInfo: {},
    fundTransferAmountRangeInfo: {},
    fundTransferDetail: {}, // 资金调度详情
    contractTypeData: {}, // 合同类型表
    sealTypes: {}, // 盖章类型
  },

  /**
   * @namespace oa/business/effects
   */
  effects: {
    /**
     *
     * @param {合同类型表} param0
     * @param {*} param1
     */
    *fetchContractType({ payload }, { call, put }) {
      const res = yield call(fetchContractType, payload);
      if (is.existy(res) && is.not.empty(res)) {
        yield put({ type: 'reduceContractTypeSuccess', payload: { contractTypeData: res } });
      }
    },
    /**
     * 编辑资金调拨申请
     */
    * updateFundTransfer({ payload = {} }, { call }) {
      const transferFormBlock = (source) => {
        const result = [];
        source.forEach(({ company, account, amount, reason, otherReason, note }) => {
          const res = {};
          if (is.not.existy(company) || is.empty(company)) {
            payload.onErrorCallback && payload.onErrorCallback();
            message.error('公司不能为空');
            return false;
          }
          res.firm_id = company;
          if (is.not.existy(account) || is.empty(account)) {
            message.error('账号不能为空');
            payload.onErrorCallback && payload.onErrorCallback();
            return false;
          }
          res.bank_account_id = account;

          if (is.not.existy(amount) || is.empty(amount)) {
            message.error('金额不能为空');
            payload.onErrorCallback && payload.onErrorCallback();
            return false;
          }
          res.money = Unit.exchangePriceToCent(amount);

          if (is.not.existy(reason) || is.empty(reason)) {
            message.error('调拨事由不能为空');
            payload.onErrorCallback && payload.onErrorCallback();
            return false;
          }
          res.allocate_reason = reason;

          if (reason === FundTransferOtherReasonEnum && (is.not.existy(otherReason) || is.empty(otherReason))) {
            message.error('其他事由不能为空');
            payload.onErrorCallback && payload.onErrorCallback();
            return false;
          }
          res.other_reason = otherReason;

          if (is.existy(note) && is.not.empty(note)) {
            res.note = note;
          } else {
            res.note = '';
          }

          result.push(res);
        });
        return result;
      };
      const params = {};
      const { id, provider, receiver, files } = payload;
      if (is.not.existy(id) || is.empty(id)) {
        payload.onErrorCallback && payload.onErrorCallback();
        message.error('id不能为空');
        return false;
      }
      params._id = id;

      if (provider.length <= 0 || receiver.length <= 0) {
        payload.onErrorCallback && payload.onErrorCallback();
        message.error('缺少调出方/调入方');
        return false;
      }
      if (provider.length > 1 && receiver.length > 1) {
        payload.onErrorCallback && payload.onErrorCallback();
        message.error('不能同时存在多个调出方和调入方');
        return false;
      }
      if (
          provider.reduce((odd, cur) => odd + Unit.exchangePriceToCent(cur.amount), 0) !== receiver.reduce((odd, cur) => odd + Unit.exchangePriceToCent(cur.amount), 0)
      ) {
        payload.onErrorCallback && payload.onErrorCallback();
        message.error('调出/调入金额不相等');
        return false;
      }
      if (is.existy(files) && is.not.empty(files)) {
        params.asset_keys = files.map(({ key }) => key);
      } else {
        params.asset_keys = [];
      }
      params.dispatch_expense = transferFormBlock(provider);
      params.dispatch_income = transferFormBlock(receiver);
      const result = yield call(updateFundTransfer, params);
      if (result._id) {
        message.success('编辑成功！');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(result.oa_application_order_id);
        }
        return result;
      } else if (result && result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      } else {
        message.error('编辑失败！');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
    },
    /**
     * 创建资金调拨申请
     */
    * createFundTransfer({ payload = {} }, { call }) {
      const transferFormBlock = (source) => {
        const result = [];
        source.forEach(({ company, account, amount, reason, otherReason, note }) => {
          const res = {};
          if (is.not.existy(company) || is.empty(company)) {
            payload.onErrorCallback && payload.onErrorCallback();
            message.error('公司不能为空');
            return false;
          }
          res.firm_id = company;
          if (is.not.existy(account) || is.empty(account)) {
            payload.onErrorCallback && payload.onErrorCallback();
            message.error('账号不能为空');
            return false;
          }
          res.bank_account_id = account;

          if (is.not.existy(amount) || is.empty(amount)) {
            payload.onErrorCallback && payload.onErrorCallback();
            message.error('金额不能为空');
            return false;
          }
          res.money = Unit.exchangePriceToCent(amount);

          if (is.not.existy(reason) || is.empty(reason)) {
            payload.onErrorCallback && payload.onErrorCallback();
            message.error('调拨事由不能为空');
            return false;
          }
          res.allocate_reason = reason;

          if (reason === FundTransferOtherReasonEnum && (is.not.existy(otherReason) || is.empty(otherReason))) {
            message.error('其他事由不能为空');
            payload.onErrorCallback && payload.onErrorCallback();
            return false;
          }
          res.other_reason = otherReason;

          if (is.existy(note) && is.not.empty(note)) {
            res.note = note;
          }

          result.push(res);
        });
        return result;
      };
      const params = OAPayloadMapper(payload);
      if (!params) return false;
      const { provider, receiver, files } = payload;
      if (provider.length <= 0 || receiver.length <= 0) {
        message.error('缺少调出方/调入方');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      if (provider.length > 1 && receiver.length > 1) {
        message.error('不能同时存在多个调出方和调入方');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      if (
          provider.reduce((odd, cur) => odd + Unit.exchangePriceToCent(cur.amount), 0) !== receiver.reduce((odd, cur) => odd + Unit.exchangePriceToCent(cur.amount), 0)
      ) {
        message.error('调出/调入金额不相等');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      if (is.existy(files) && is.not.empty(files)) {
        params.asset_keys = files.map(({ key }) => key);
      }
      params.dispatch_expense = transferFormBlock(provider);
      params.dispatch_income = transferFormBlock(receiver);

      // 部门id
      payload.departmentId && (params.actual_department_id = payload.departmentId);
      // 岗位id
      payload.postId && (params.actual_job_id = payload.postId);

      const result = yield call(createFundTransfer, params);
      if (result._id) {
        message.success('保存成功');
        if (payload.onCreateSuccess) {
          payload.onCreateSuccess(result.oa_application_order_id);
        }
        return result;
      } else if (result && result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      } else {
        message.error('创建失败');
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
    },
    /**
     * 获取资金调拨事由下拉
     */
    * fetchFundTransferCauseSelect({ payload = {} }, { call, put }) {
      const { namespace } = payload;
      const result = yield call(fetchFundTransferCause);
      if (result && result.data) {
        yield put({ type: 'reduceFirmAccountSelect', payload: { data: result, namespace } });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
    * 重置资金调拨事由下拉
    */
    *resetFundTransferCauseSelect({ payload }, { put }) {
      const { namespace } = payload;
      yield put({ type: 'reduceFundTransferCauseSelect', payload: { data: {}, namespace } });
    },
    /**
     * 获取资金调拨金额范围下拉
     */
    * fetchFundTransferAmountRangeSelect({ payload = {} }, { call, put }) {
      const { namespace } = payload;
      const result = yield call(fetchFundTransferAmountRange);
      if (result && result.data) {
        yield put({ type: 'reduceFundTransferAmountRangeSelect', payload: { data: result, namespace } });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
     * 重置资金调拨金额范围下拉
    */
    *resetFundTransferAmountRangeSelect({ payload }, { put }) {
      const { namespace } = payload;
      yield put({ type: 'reduceFundTransferAmountRangeSelect', payload: { data: {}, namespace } });
    },
    /**
     * 根据公司获取账户下拉
     */
    * fetchFirmAccountSelect({ payload = {} }, { call, put }) {
      const { firmId, namespace } = payload;
      const result = yield call(fetchBusinessAccountSelect, { firm_id: firmId });
      if (result && result.data) {
        yield put({ type: 'reduceFirmAccountSelect', payload: { data: result, namespace } });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
    * 重置公司级联账户下拉
    */
    *resetFirmAccountSelect({ payload }, { put }) {
      const { namespace } = payload;
      yield put({ type: 'reduceFirmAccountSelect', payload: { data: {}, namespace } });
    },
    /**
     * 公司注销/注册/变更创建
     */
    * createBusinessFirmModifyOrder({ payload = {} }, { call }) {
      // 配置审批流参数
      const mapper = OAPayloadMapper(payload);
      if (mapper === false && !payload.flowId) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      const params = {
        ...mapper,
      };
      // 当办理类型是公司注册附件必填
      if (payload.type === BusinessCompanyHandleType.registered && is.empty(payload.fileList)) {
        payload.onErrorCallback && payload.onErrorCallback();
        return message.error('请上传附件');
      }
      // 办理类型
      if (is.not.empty(payload.type) && is.existy(payload.type)) {
        params.deal_type = payload.type;
      }
      // 注销时间
      if (is.not.empty(payload.rcancellationDate) && is.existy(payload.rcancellationDate)) {
        params.cancel_date = Number(moment(payload.rcancellationDate).format('YYYYMMDD'));
      }
      // 申请原因及说明
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.note = payload.note;
      }
      // 变更内容
      if (is.not.empty(payload.content) && is.existy(payload.content)) {
        params.modify_content = payload.content;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }
      // 变更类型
      if (is.not.empty(payload.modifyType) && is.existy(payload.modifyType)) {
        params.modify_type = payload.modifyType;
      }
      // 根据类型判断传递参数不同
      if (payload.type === BusinessCompanyHandleType.registered) {
        // 公司名称
        if (is.not.empty(payload.companyName) && is.existy(payload.companyName)) {
          params.name = payload.companyName;
        }
        // 公司类型
        if (is.not.empty(payload.companyType) && is.existy(payload.companyType)) {
          params.firm_type = payload.companyType;
        }
        // 法人代表
        if (is.not.empty(payload.guardianship) && is.existy(payload.guardianship)) {
          params.legal_name = payload.guardianship;
        }
        // 注册资本
        if (is.not.empty(payload.capital) && is.existy(payload.capital)) {
          params.registered_capital = Unit.exchangePriceToWanCent(Number(payload.capital));
        }
        // 注册时间
        if (is.not.empty(payload.registeredDate) && is.existy(payload.registeredDate)) {
          params.registered_date = Number(moment(payload.registeredDate).format('YYYYMMDD'));
        }
        // 注册地址
        if (is.not.empty(payload.address) && is.existy(payload.address)) {
          params.registered_address = payload.address;
        }
        // 股东信息
        if (is.not.empty(payload.shareholders) && is.existy(payload.shareholders)) {
          params.share_holder_info = payload.shareholders;
        }
      } else {
        // 公司id
        if (is.not.empty(payload.companyName) && is.existy(payload.companyName)) {
          params.firm_id = payload.companyName;
        }
        // 公司name
        if (is.not.empty(payload.name) && is.existy(payload.name)) {
          params.name = payload.name;
        }
        // 公司类型
        if (is.not.empty(payload.firm_type) && is.existy(payload.firm_type)) {
          params.firm_type = payload.firm_type;
        }
        // 法人代表
        if (is.not.empty(payload.legal_name) && is.existy(payload.legal_name)) {
          params.legal_name = payload.legal_name;
        }
        // 注册资本
        if (is.not.empty(payload.registered_capital) && is.existy(payload.registered_capital)) {
          params.registered_capital = payload.registered_capital;
        }
        // 注册时间
        if (is.not.empty(payload.registered_date) && is.existy(payload.registered_date)) {
          params.registered_date = payload.registered_date;
        }
        // 注册地址
        if (is.not.empty(payload.registered_addr) && is.existy(payload.registered_addr)) {
          params.registered_address = payload.registered_addr;
        }
        // 股东信息
        if (is.not.empty(payload.share_holder_info) && is.existy(payload.share_holder_info)) {
          params.share_holder_info = payload.share_holder_info;
        }
      }

      payload.departmentId && (params.actual_department_id = payload.departmentId);
      payload.postId && (params.actual_job_id = payload.postId);

      const result = yield call(createBusinessFirmModifyOrder, params);
      if (result._id) {
        message.success('保存成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
          return;
        }
      }
      if (result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 公司注销/注册/变更编辑
     */
    * updateBusinessFirmModifyOrder({ payload = {} }, { call }) {
      const params = {};
      // 当办理类型是公司注册附件必填
      if (payload.type === 20 && is.empty(payload.fileList)) {
        return message.error('请上传附件');
      }
      // 费用单id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }
      // 注销时间
      if (is.not.empty(payload.rcancellationDate) && is.existy(payload.rcancellationDate)) {
        params.cancel_date = Number(moment(payload.rcancellationDate).format('YYYYMMDD'));
      }
      // 申请原因及说明
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.note = payload.note;
      }
      // 变更内容
      if (is.not.empty(payload.content) && is.existy(payload.content)) {
        params.modify_content = payload.content;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      } else {
        params.asset_keys = [];
      }
      // 变更类型
      if (is.not.empty(payload.modifyType) && is.existy(payload.modifyType)) {
        params.modify_type = payload.modifyType;
      }
      // 根据类型判断传递参数不同
      if (payload.type === BusinessCompanyHandleType.registered) {
        // 公司名称
        if (is.not.empty(payload.companyName) && is.existy(payload.companyName)) {
          params.name = payload.companyName;
        }
        // 公司类型
        if (is.not.empty(payload.companyType) && is.existy(payload.companyType)) {
          params.firm_type = payload.companyType;
        }
        // 法人代表
        if (is.not.empty(payload.guardianship) && is.existy(payload.guardianship)) {
          params.legal_name = payload.guardianship;
        }
        // 注册资本
        if (is.not.empty(payload.capital) && is.existy(payload.capital)) {
          params.registered_capital = Unit.exchangePriceToWanCent(Number(payload.capital));
        }
        // 注册时间
        if (is.not.empty(payload.registeredDate) && is.existy(payload.registeredDate)) {
          params.registered_date = Number(moment(payload.registeredDate).format('YYYYMMDD'));
        }
        // 注册地址
        if (is.not.empty(payload.address) && is.existy(payload.address)) {
          params.registered_address = payload.address;
        }
        // 股东信息
        if (is.not.empty(payload.shareholders) && is.existy(payload.shareholders)) {
          params.share_holder_info = payload.shareholders;
        }
      } else {
        // 公司id
        if (is.not.empty(payload.companyName) && is.existy(payload.companyName)) {
          params.firm_id = payload.companyName;
        }
        // 公司name
        if (is.not.empty(payload.name) && is.existy(payload.name)) {
          params.name = payload.name;
        }
        // 公司类型
        if (is.not.empty(payload.firm_type) && is.existy(payload.firm_type)) {
          params.firm_type = payload.firm_type;
        }
        // 法人代表
        if (is.not.empty(payload.legal_name) && is.existy(payload.legal_name)) {
          params.legal_name = payload.legal_name;
        }
        // 注册资本
        if (is.not.empty(payload.registered_capital) && is.existy(payload.registered_capital)) {
          params.registered_capital = payload.registered_capital;
        }
        // 注册时间
        if (is.not.empty(payload.registered_date) && is.existy(payload.registered_date)) {
          params.registered_date = payload.registered_date;
        }
        // 注册地址
        if (is.not.empty(payload.registered_addr) && is.existy(payload.registered_addr)) {
          params.registered_address = payload.registered_addr;
        }
        // 股东信息
        if (is.not.empty(payload.share_holder_info) && is.existy(payload.share_holder_info)) {
          params.share_holder_info = payload.share_holder_info;
        }
      }
      const result = yield call(updateBusinessFirmModifyOrder, params);
      if (result._id) {
        message.success('编辑成功！');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
          return;
        }
        return;
      }
      if (result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 公司注销/注册/变更详情
     */
    *fetchBusinessFirmModifyOrderDetail({ payload }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceBusinessFirmModifyOrderDetail', payload: oaDetail });
        return;
      }
      // 费用id
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('请求参数不能为空');
      }
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchBusinessFirmModifyOrderDetail, params);
      if (result && result._id) {
        yield put({ type: 'reduceBusinessFirmModifyOrderDetail', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
       /**
     * 重置公司注销/注册/变更详情
     */
    *resetBusinessFirmModifyOrderDetail({ payload }, { put }) {
      yield put({ type: 'reduceBusinessFirmModifyOrderDetail', payload: {} });
    },
    /**
     * 银行账户申请单详情
     */
    *fetchBusinessBankOrderDetail({ payload }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceBusinessBankOrderDetail', payload: oaDetail });
        return;
      }
      // 费用id
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('请求参数不能为空');
      }
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchBusinessBankOrderDetail, params);
      if (result && result._id) {
        yield put({ type: 'reduceBusinessBankOrderDetail', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
     * 创建银行账户申请单
     */
    * createBusinessBankOrder({ payload = {} }, { call }) {
      // 配置审批流参数
      const mapper = OAPayloadMapper(payload);
      if (mapper === false && !payload.flowId) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      const params = {
        ...mapper,
        order_type: payload.orderType, // 类型
      };
      // 公司名称
      if (is.not.empty(payload.companyName) && is.existy(payload.companyName)) {
        params.firm_id = payload.companyName;
      }
      // 账户类型
      if (is.not.empty(payload.type) && is.existy(payload.type)) {
        params.bank_card_type = payload.type;
      }
      // 账户
      if (is.not.empty(payload.account) && is.existy(payload.account)) {
        params.bank_account_id = payload.account;
      }
      // 开户银行支行全称
      if (is.not.empty(payload.branch) && is.existy(payload.branch)) {
        params.bank_and_branch = payload.branch;
      }
      // 开户时间
      if (is.not.empty(payload.date) && is.existy(payload.date)) {
        params.bank_opened_date = Number(moment(payload.date).format('YYYYMMDD'));
      }
      // 申请原因及说明
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.note = payload.note;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }

      payload.departmentId && (params.actual_department_id = payload.departmentId);
      payload.postId && (params.actual_job_id = payload.postId);

      // 币种
      payload.currency && (params.currency = payload.currency);
      // 网银
      payload.onlineBank && (params.online_banking = payload.onlineBank);
      // 网银保管人
      payload.onlineBankCustodian && (params.online_custodian_employee_ids = payload.onlineBankCustodian);
      // 银行联系人
      payload.contactPerson && (params.bank_user_contact_name = payload.contactPerson);
      // 银行联系方式
      payload.contactPhone && (params.bank_user_contact_way = payload.contactPhone);
      // 开户资料
      payload.openAccountInformation
        && Array.isArray(payload.openAccountInformation)
        && payload.openAccountInformation.length > 0
        && (params.opened_data = payload.openAccountInformation);
      // 开户资料说明
      payload.openAccountNote && (params.opened_data_desc = payload.openAccountNote);
      // 开户保管人
      payload.openedId && (params.opened_custodian_employee_id = payload.openedId);
      // 账户体系
      payload.accountSystem && (params.account_system = Number(payload.accountSystem));

      const result = yield call(createBusinessBankOrder, params);
      if (result._id) {
        message.success('保存成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      if (result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
    * 编辑银行账户申请单
    */
    * updateBusinessBankOrder({ payload = {} }, { call }) {
      const params = {};

      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }
      // 公司名称
      if (is.not.empty(payload.companyName) && is.existy(payload.companyName)) {
        params.firm_id = payload.companyName;
      }
      // 账户
      if (is.not.empty(payload.account) && is.existy(payload.account)) {
        params.bank_account_id = payload.account;
      }
      // 账户类型
      if (is.not.empty(payload.type) && is.existy(payload.type)) {
        params.bank_card_type = payload.type;
      }
      // 开户银行支行全称
      if (is.not.empty(payload.branch) && is.existy(payload.branch)) {
        params.bank_and_branch = payload.branch;
      }
      // 开户时间
      if (is.not.empty(payload.date) && is.existy(payload.date)) {
        params.bank_opened_date = Number(moment(payload.date).format('YYYYMMDD'));
      } else {
        params.bank_opened_date = '';
      }
      // 申请原因及说明
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.note = payload.note;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      } else {
        params.asset_keys = [];
      }

      // 币种
      payload.currency && (params.currency = payload.currency);
      // 网银
      payload.onlineBank && (params.online_banking = payload.onlineBank);
      // 网银保管人
      payload.onlineBankCustodian && (params.online_custodian_employee_ids = payload.onlineBankCustodian);
      // 银行联系人
      params.bank_user_contact_name = payload.contactPerson ? payload.contactPerson : '';
      // 银行联系方式
      params.bank_user_contact_way = payload.contactPhone ? payload.contactPhone : '';
      // 开户资料
      payload.openAccountInformation
        && Array.isArray(payload.openAccountInformation)
        && payload.openAccountInformation.length > 0
        && (params.opened_data = payload.openAccountInformation);
      // 开户资料说明
      payload.openAccountNote && (params.opened_data_desc = payload.openAccountNote);
      // 账户体系
      payload.accountSystem && (params.account_system = Number(payload.accountSystem));

      const result = yield call(updateBusinessBankOrder, params);
      if (result._id) {
        message.success('编辑成功！');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      if (result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
   * 获取借阅信息
   */
    * fetchBusinessPactBorrowOrderDetail({ payload }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceBusinessPactBorrowOrderDetail', payload: oaDetail });
        return;
      }
      // 费用id
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('请求参数不能为空');
      }
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchBusinessPactBorrowOrderDetail, params);
      if (result && result._id) {
        yield put({ type: 'reduceBusinessPactBorrowOrderDetail', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
     * 创建借阅信息
     */
    * createBusinessPactBorrowOrder({ payload = {} }, { call }) {
      // 配置审批流参数
      const mapper = OAPayloadMapper(payload);
      if (mapper === false && !payload.flowId) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      const params = {
        ...mapper,
        order_type: payload.orderType, // 类型
      };
      // 合同信息
      if (is.not.empty(payload.contractInfo) && is.existy(payload.contractInfo)) {
        params.pact_ids = payload.contractInfo;
      }
      // 借阅类型
      if (is.not.empty(payload.type) && is.existy(payload.type)) {
        params.pact_borrow_type = OABorrowingType.transDescription(payload.type);
      }
      // 借阅份数
      if (is.not.empty(payload.additional) && is.existy(payload.additional)) {
        params.borrow_copies = payload.additional;
      }
      // 借阅时间
      if (is.not.empty(payload.date) && is.existy(payload.date)) {
        params.from_date = Number(moment(payload.date).format('YYYYMMDD'));
      }
      // 预计归还时间
      if (is.not.empty(payload.expect) && is.existy(payload.expect)) {
        params.expect_end_date = Number(moment(payload.expect).format('YYYYMMDD'));
      }
      // 借阅事由
      if (is.not.empty(payload.why) && is.existy(payload.why)) {
        params.cause = payload.why;
      }
      // 使用城市
      if (is.not.empty(payload.city) && is.existy(payload.city)) {
        params.city_name = payload.city;
      }
      // 申请原因及说明
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.note = payload.note;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }

      payload.departmentId && (params.actual_department_id = payload.departmentId);
      payload.postId && (params.actual_job_id = payload.postId);

      const result = yield call(createBusinessPactBorrowOrder, params);
      if (result._id) {
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      if (result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
  * 编辑借阅信息
  */
    * updateBusinessPactBorrowOrder({ payload = {} }, { call }) {
      const params = {
        order_type: payload.orderType, // 类型
      };

      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }
      // 公司信息
      if (is.not.empty(payload.contractInfo) && is.existy(payload.contractInfo)) {
        params.pact_ids = payload.contractInfo;
      }

      // if (is.not.empty(payload.type) && is.existy(payload.type)) {
        // params.pact_borrow_type = payload.type;
      // }
      // 借阅份数
      if (is.not.empty(payload.additional) && is.existy(payload.additional)) {
        params.borrow_copies = payload.additional;
      }
      // 借阅时间
      if (is.not.empty(payload.date) && is.existy(payload.date)) {
        params.from_date = Number(moment(payload.date).format('YYYYMMDD'));
      }
      // 预计归还时间
      if (is.not.empty(payload.expect) && is.existy(payload.expect)) {
        params.expect_end_date = Number(moment(payload.expect).format('YYYYMMDD'));
      }
      // 借阅事由
      if (is.not.empty(payload.why) && is.existy(payload.why)) {
        params.cause = payload.why;
      } else {
        params.cause = '';
      }
      // 使用城市
      if (is.not.empty(payload.city) && is.existy(payload.city)) {
        params.city_name = payload.city;
      } else {
        params.city_name = '';
      }
      // 申请原因及说明
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.note = payload.note;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      } else {
        params.asset_keys = [];
      }
      const result = yield call(updateBusinessPactBorrowOrder, params);
      if (result._id) {
        message.success('编辑成功！');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      if (result.zh_message) {
        message.error(result.zh_message);
        payload.onErrorCallback && payload.onErrorCallback();
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
    * 获取会审信息
    */
    * fetchBusinessPactApplyOrderDetail({ payload }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      if (isPluginOrder) {
        yield put({ type: 'reduceBusinessPactApplyOrderDetaill', payload: oaDetail });
        return;
      }
      // 费用id
      if (is.not.existy(payload.id) || is.empty(payload.id)) {
        return message.error('请求参数不能为空');
      }
      const params = {
        _id: payload.id,
      };
      const result = yield call(fetchBusinessPactApplyOrderDetail, params);
      if (result && result._id) {
        yield put({ type: 'reduceBusinessPactApplyOrderDetaill', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 获取盖章类型
     */
    fetchBusinessSealTypes: [
      function*({ payload = {} }, { call, put }) {
        // 签订单位id
        if (is.not.existy(payload.firmId) || is.empty(payload.firmId)) {
          return message.error('请求参数不能为空');
        }
        const params = {
          firm_id: payload.firmId, // 签订单位id
        };
        const result = yield call(fetchBusinessSealTypes, params);
        if (result) {
          yield put({ type: 'reduceBusinessSealTypes', payload: result });
        }
      },
      { type: 'takeLatest' },
    ],
    /**
    * 创建会审信息
    */
    * createBusinessPactApplyOrder({ payload = {} }, { call }) {
      // 配置审批流参数
      const mapper = OAPayloadMapper(payload);
      if (mapper === false && !payload.flowId) {
        payload.onErrorCallback && payload.onErrorCallback();
        return false;
      }
      const params = {
        ...mapper,
        order_type: payload.orderType, // 类型
        stamp_type: Number(payload.stampType), // 盖章类型
      };
      // 附件必填校验
      if (is.empty(payload.fileList)) {
        payload.onErrorCallback && payload.onErrorCallback();
        return message.error('请上传附件');
      }
      // 公司名称
      if (is.not.empty(payload.name) && is.existy(payload.name)) {
        params.name = payload.name;
      }
      // 合同编号
      if (is.not.empty(payload.code) && is.existy(payload.code)) {
        params.pact_no = payload.code;
      }
      // 合同类型
      if (is.not.empty(payload.contractType) && is.existy(payload.contractType)) {
        params.pact_type = Number(payload.contractType);
      }

      // 合同性质
      if (is.not.empty(payload.nature) && is.existy(payload.nature)) {
        params.pact_property = payload.nature;
      }
      // 签订人
      if (is.not.empty(payload.people) && is.existy(payload.people)) {
        params.singer = payload.people;
      }
      // 签手机
      if (is.not.empty(payload.phone) && is.existy(payload.phone)) {
        params.sign_phone = payload.phone;
      }
      // 合同单价
      if (is.not.empty(payload.unitPrice) && is.existy(payload.unitPrice)) {
        params.unit_price = Unit.exchangePriceToCent(Number(payload.unitPrice));
      }
      // 签订单位
      if (is.not.empty(payload.unit) && is.existy(payload.unit)) {
        params.firm_id = payload.unit;
      }
      // 签订甲方
      if (is.not.empty(payload.partyA) && is.existy(payload.partyA)) {
        params.pact_part_a = payload.partyA.join('、');
      }
      // 签订丙方
      if (is.not.empty(payload.partyC) && is.existy(payload.partyC)) {
        params.pact_part_c = payload.partyC.join('、');
      }
      // 签订乙方
      if (is.not.empty(payload.partyB) && is.existy(payload.partyB)) {
        params.pact_part_b = payload.partyB.join('、');
      }
      // 签订丁方
      if (is.not.empty(payload.partyD) && is.existy(payload.partyD)) {
        params.pact_part_d = payload.partyD.join('、');
      }
      // 合同保管人
      if (is.not.empty(payload.safekeeping) && is.existy(payload.safekeeping)) {
        params.preserver_id = payload.safekeeping;
      }
      // 票务负责人
      if (is.not.empty(payload.responsibility) && is.existy(payload.responsibility)) {
        params.fare_manager_id = payload.responsibility;
      }
      // 关联审批单
      if (is.not.empty(payload.relationOrderIds) && is.existy(payload.relationOrderIds)) {
        params.relation_application_order_ids = payload.relationOrderIds;
      }
      // 盖章类
      if (is.not.empty(payload.seal) && is.existy(payload.seal)) {
        params.seal_type = payload.seal;
      }
      // 发票类型
      if (is.not.empty(payload.invoice) && is.existy(payload.invoice)) {
        params.invoice_type = payload.invoice;
      }
      // 合同份数
      if (is.not.empty(payload.guardianship) && is.existy(payload.guardianship)) {
        params.copies = payload.guardianship.copies;
      }
      // 我方合同份数
      if (is.not.empty(payload.guardianship) && is.existy(payload.guardianship)) {
        params.our_copies = payload.guardianship.our_copies;
      }
      // 对方合同份数
      if (is.not.empty(payload.guardianship) && is.existy(payload.guardianship)) {
        params.opposite_copies = payload.guardianship.opposite_copies;
      }
      // 合同版本是否已返回
      if (is.not.empty(payload.version) && is.existy(payload.version)) {
        params.is_backed = payload.version;
      }
      // 合同起始时间
      if (is.not.empty(payload.start) && is.existy(payload.start)) {
        params.from_date = Number(moment(payload.start).format('YYYYMMDD'));
      }
      // 合同结束时间
      if (is.not.empty(payload.end) && is.existy(payload.end)) {
        params.end_date = Number(moment(payload.end).format('YYYYMMDD'));
      }
      // 合同主要内容及条款
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.content = payload.note;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }
      payload.contractChildType && (params.pact_sub_type = Number(payload.contractChildType));

      payload.departmentId && (params.actual_department_id = payload.departmentId);
      payload.postId && (params.actual_job_id = payload.postId);
      const result = yield call(createBusinessPactApplyOrder, params);
      if (result._id) {
        message.success('保存成功');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      if (result.zh_message) {
        payload.onErrorCallback && payload.onErrorCallback();
        message.error(result.zh_message);
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
    * 编辑会审信息
    */
    * updateBusinessPactApplyOrder({ payload = {} }, { call }) {
      const params = {
        order_type: payload.orderType, // 类型
        stamp_type: Number(payload.stampType), // 盖章类型
      };

      // 附件必填校验
      if (is.empty(payload.fileList)) {
        payload.onErrorCallback && payload.onErrorCallback();
        return message.error('请上传附件');
      }
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }
      // 公司名称
      if (is.not.empty(payload.name) && is.existy(payload.name)) {
        params.name = payload.name;
      }
      // 合同编号
      if (is.not.empty(payload.code) && is.existy(payload.code)) {
        params.pact_no = payload.code;
      } else {
        params.pact_no = '';
      }
      // 合同类型
      if (is.not.empty(payload.type) && is.existy(payload.type)) {
        params.pact_type = payload.type;
      }
      // 合同类型
      if (is.not.empty(payload.contractType) && is.existy(payload.contractType)) {
        params.pact_type = Number(payload.contractType);
      }
      // 合同子类型
      if (is.not.empty(payload.contractChildType) && is.existy(payload.contractChildType)) {
        params.pact_sub_type = Number(payload.contractChildType);
      }
      // 合同性质
      if (is.not.empty(payload.nature) && is.existy(payload.nature)) {
        params.pact_property = payload.nature;
      }
      // 签订人
      if (is.not.empty(payload.people) && is.existy(payload.people)) {
        params.singer = payload.people;
      }
      // 签订电话
      if (is.not.empty(payload.phone) && is.existy(payload.phone)) {
        params.sign_phone = payload.phone;
      } else {
        params.sign_phone = '';
      }
      // 合同单价
      if (is.not.empty(payload.unitPrice) && is.existy(payload.unitPrice)) {
        params.unit_price = Unit.exchangePriceToCent(Number(payload.unitPrice));
      } else {
        params.unit_price = '';
      }
      // 签订单位
      if (is.not.empty(payload.unit) && is.existy(payload.unit)) {
        params.firm_id = payload.unit;
      }
      // 签订甲方
      if (is.not.empty(payload.partyA) && is.existy(payload.partyA)) {
        params.pact_part_a = payload.partyA.join('、');
      }
      // 签订丙方
      if (is.not.empty(payload.partyC) && is.existy(payload.partyC)) {
        params.pact_part_c = payload.partyC.join('、');
      } else {
        params.pact_part_c = '';
      }
      // 签订乙方
      if (is.not.empty(payload.partyB) && is.existy(payload.partyB)) {
        params.pact_part_b = payload.partyB.join('、');
      }
      // 签订丁方
      if (is.not.empty(payload.partyD) && is.existy(payload.partyD)) {
        params.pact_part_d = payload.partyD.join('、');
      } else {
        params.pact_part_d = '';
      }
      // 合同保管人
      if (is.not.empty(payload.safekeeping) && is.existy(payload.safekeeping)) {
        params.preserver_id = payload.safekeeping;
      }
      // 票务负责人
      if (is.not.empty(payload.responsibility) && is.existy(payload.responsibility)) {
        params.fare_manager_id = payload.responsibility;
      }
      // 关联审批单
      if (is.not.empty(payload.relationOrderIds) && is.existy(payload.relationOrderIds)) {
        params.relation_application_order_ids = payload.relationOrderIds;
      }
      // 盖章类
      if (is.not.empty(payload.seal) && is.existy(payload.seal)) {
        params.seal_type = payload.seal;
      }
      // 发票类型
      if (is.not.empty(payload.invoice) && is.existy(payload.invoice)) {
        params.invoice_type = payload.invoice;
      }
      // 合同份数
      if (is.not.empty(payload.guardianship) && is.existy(payload.guardianship)) {
        params.copies = payload.guardianship.copies;
      }
      // 我方合同份数
      if (is.not.empty(payload.guardianship) && is.existy(payload.guardianship)) {
        params.our_copies = payload.guardianship.our_copies;
      }
      // 对方合同份数
      if (is.not.empty(payload.guardianship) && is.existy(payload.guardianship)) {
        params.opposite_copies = payload.guardianship.opposite_copies;
      }
      // 合同版本是否已返回
      if (is.not.empty(payload.version) && is.existy(payload.version)) {
        params.is_backed = payload.version;
      }
      // 合同起始时间
      if (is.not.empty(payload.start) && is.existy(payload.start)) {
        params.from_date = Number(moment(payload.start).format('YYYYMMDD'));
      }
      // 合同结束时间
      if (is.not.empty(payload.end) && is.existy(payload.end)) {
        params.end_date = Number(moment(payload.end).format('YYYYMMDD'));
      }
      // 合同主要内容及条款
      if (is.not.empty(payload.note) && is.existy(payload.note)) {
        params.content = payload.note;
      }
      // 上传附件
      if (is.not.empty(payload.fileList) && is.existy(payload.fileList)) {
        params.asset_keys = payload.fileList.map(v => Object.values(v)[0]);
      }
       // 合同类型
      if (is.not.empty(payload.pact_type) && is.existy(payload.pact_type)) {
        params.pact_type = Number(payload.pact_type);
      }
       // 合同子类型
      if (is.not.empty(payload.pact_sub_type) && is.existy(payload.pact_sub_type)) {
        params.pact_sub_type = Number(payload.pact_sub_type);
      }

      const result = yield call(updateBusinessPactApplyOrder, params);
      if (result._id) {
        message.success('编辑成功！');
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        return;
      }
      if (result.zh_message) {
        payload.onErrorCallback && payload.onErrorCallback();
        message.error(result.zh_message);
        return;
      }
      payload.onErrorCallback && payload.onErrorCallback();
    },
    /**
     * 公司下拉
     */
    *fetchBusinessCompanySelect({ payload }, { call, put }) {
      const { namespace } = payload;
      const result = yield call(fetchBusinessCompanySelect);
      if (result && result.data) {
        yield put({ type: 'reduceBusinessCompanySelect', payload: { data: result, namespace } });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
    * 重置公司下拉
    */
    *resetBusinessCompanySelect({ payload = {} }, { put }) {
      const { namespace } = payload;
      yield put({ type: 'reduceBusinessCompanySelect', payload: { data: {}, namespace } });
    },
    /**
     * 合同下拉
     */
    *fetchBusinessPactContractSelect({ payload }, { call, put }) {
      const result = yield call(fetchBusinessPactContractSelect);
      if (result && result.data) {
        yield put({ type: 'reduceBusinessPactContractSelect', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
    * 重置合同下拉
    */
    *resetBusinessPactContractSelect({ payload }, { put }) {
      yield put({ type: 'reduceBusinessPactContractSelect', payload: {} });
    },
    /**
    * 员工下拉
    */
    *fetchBusinessEmployeesSelect({ payload }, { call, put }) {
      const result = yield call(fetchBusinessEmployeesSelect);
      if (result && result.data) {
        yield put({ type: 'reduceBusinessEmployeesSelect', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
    * 重置员工下拉
    */
    *resetBusinessEmployeesSelect({ payload }, { put }) {
      yield put({ type: 'reduceBusinessEmployeesSelect', payload: {} });
    },
    /**
    * 账户下拉
    */
    * fetchBusinessAccountSelect({ payload }, { call, put }) {
      const params = {};
      // 用户id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params.firm_id = payload.id;
      }
      const result = yield call(fetchBusinessAccountSelect, params);
      if (result && result.data) {
        yield put({ type: 'reduceBusinessAccountSelect', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },
    /**
    * 重置员工下拉
    */
    *resetBusinessAccountSelect({ payload }, { put }) {
      yield put({ type: 'reduceBusinessAccountSelect', payload: {} });
    },

      /**
      * 资金调度详情
      */
    * fetchFundTransferDetail({ payload }, { call, put }) {
      const { isPluginOrder, oaDetail } = payload;
      // 判断是否是兴达插件
      if (isPluginOrder) {
        yield put({ type: 'reduceFundTransferDetail', payload: oaDetail });
        return;
      }
      const params = {};
      // 用户id
      if (is.not.empty(payload.id) && is.existy(payload.id)) {
        params._id = payload.id;
      }
      const result = yield call(fetchFundTransferDetail, params);
      // 错误提示
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      if (result) {
        yield put({ type: 'reduceFundTransferDetail', payload: result });
      }
    },
  },

  /**
   * @namespace oa/business/reducers
   */
  reducers: {
      /**
       *
       * @param {合同类型数据}
       * @param {*} 获取合同类型数据
       */
    reduceContractTypeSuccess(state, action) {
      const { contractTypeData } = action.payload;
      return {
        ...state,
        contractTypeData,
      };
    },
    /**
    * 更新公司注销/注册/变更详情
    */
    reduceBusinessFirmModifyOrderDetail(state, { payload }) {
      return {
        ...state,
        businessCompanyDetail: payload,
      };
    },
    /**
    * 银行账户申请单详情
    */
    reduceBusinessBankOrderDetail(state, { payload }) {
      return {
        ...state,
        businessBankDetail: payload,
      };
    },
    /**
   * 借阅详情
   */
    reduceBusinessPactBorrowOrderDetail(state, { payload }) {
      return {
        ...state,
        businessBorrowDetail: payload,
      };
    },
    /**
     * 会审详情
     */
    reduceBusinessPactApplyOrderDetaill(state, { payload }) {
      return {
        ...state,
        businessCameDetail: payload,
      };
    },
    /**
     * 盖章类型
     */
    reduceBusinessSealTypes(state, { payload }) {
      return {
        ...state,
        sealTypes: payload,
      };
    },
    /**
    * 公司下拉
    */
    reduceBusinessCompanySelect(state, { payload }) {
      const { namespace, data } = payload;
      return {
        ...state,
        companySelectInfo: {
          ...state.companySelectInfo,
          [namespace]: data,
        },
      };
    },
    /**
 * 合同下拉
 */
    reduceBusinessPactContractSelect(state, { payload }) {
      return {
        ...state,
        contractSelectInfo: payload,
      };
    },
    /**
* 员工下拉
*/
    reduceBusinessEmployeesSelect(state, { payload }) {
      return {
        ...state,
        employeesSelectInfo: payload,
      };
    },
    /**
    * 账户下拉信息
    */
    reduceBusinessAccountSelect(state, { payload }) {
      return {
        ...state,
        accountSelectInfo: payload,
      };
    },
    /**
    * 公司级联账户下拉信息
    */
    reduceFirmAccountSelect(state, { payload }) {
      const { namespace, data } = payload;
      return {
        ...state,
        firmAccountSelectInfo: {
          ...state.firmAccountSelectInfo,
          [namespace]: data,
        },
      };
    },
    /**
    * 资金调拨事由下拉信息
    */
    reduceFundTransferCauseSelect(state, { payload }) {
      const { namespace, data } = payload;
      return {
        ...state,
        fundTransferCauseInfo: {
          ...state.fundTransferCauseInfo,
          [namespace]: data,
        },
      };
    },
    /**
    * 资金调拨金额范围下拉信息
    */
    reduceFundTransferAmountRangeSelect(state, { payload }) {
      const { namespace, data } = payload;
      return {
        ...state,
        fundTransferAmountRangeInfo: {
          ...state.fundTransferCauseInfo,
          [namespace]: data,
        },
      };
    },
    // 资金调度详情
    reduceFundTransferDetail(state, { payload }) {
      return {
        ...state,
        fundTransferDetail: payload,
      };
    },
  },
};
