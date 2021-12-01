/**
 * 借还款管理
 * @module model/expense/borrowingRepaments
 */
import is from 'is_js';
import { message } from 'antd';
import moment from 'moment';

import {
  fetchBorrowingOrders, // 获取借款单列表
  fetchRepaymentOrders, // 获取还款单列表
  createBorrowOrder, // 创建借款单
  createRepayOrder, // 创建还款单
  updateBorrowOrder, // 编辑借款单
  updateRepayOrder, // 编辑还款单
  fetchBorrowingDetails, // 获取借款单详情
  fetchRepaymentsDetails, // 获取还款单详情
  borrowingDownloadTemplate, // 借款导出
  repaymentsDownloadTemplate, // 还款导出
  fetchExamineOrderFlowRecordList, // 借款单流转记录
 } from '../../services/expense/borrowingRepayment';
import { fetchPCExamineOrderDetail } from '../../services/expense/examineOrder';
import {
  RequestMeta,
  ApplicationOrderDetail,
  ApplicationOrderFlowRecordBrief,
} from '../../application/object/';
import { Unit, ExpenseExamineOrderProcessState } from '../../application/define';

// 转换借款单参数
const transferBorrowOrder = (payload) => {
  // 默认参数
  const params = {
    actual_loan_info: {},
    payee_account_info: {},
  };
  const {
    borrowType, // 借款类型
    platform, // 平台
    supplier, // 供应商
    city, // 城市
    district, // 商圈
    name, // 姓名
    identity, // 身份证号
    phone, // 手机号
    cardNum, // 银行卡号
    bankName, // 开户行
    borrowMoney, // 借款金额
    borrowNote, // 借款原因
    attachments, // 附件
    repayMethod, // 还款方式
    repayCircle, // 还款周期
    repayDay, // 还款日期
    employeeId, // 实际借款人
    teamName, // 团队信息
  } = payload;

  // 借款类型
  if (is.not.existy(borrowType) || is.empty(borrowType)) {
    return message.error('借款类型不能为空');
  }
  params.loan_type = Number(borrowType);

  // 平台
  // if (is.not.existy(platform) || is.empty(platform)) {
    // return message.error('平台不能为空');
  // }
  platform && (params.platform_code = platform);

  // 供应商
  // if (is.not.existy(supplier) || is.empty(supplier)) {
    // return message.error('供应商不能为空');
  // }
  supplier && (params.supplier_id = supplier);

  // 城市
  // if (is.not.existy(city) || is.empty(city)) {
    // return message.error('城市不能为空');
  // }
  city && (params.city_code = city);

  // 商圈
  if (is.existy(district) && is.not.empty(district)) {
    params.biz_district_id = district;
  }

  // 姓名
  // if (is.not.existy(name) || is.empty(name)) {
    // return message.error('实际借款人姓名不能为空');
  // }
  name && (params.actual_loan_info.name = name);

  // 身份证号
  if (is.not.existy(identity) || is.empty(identity)) {
    return message.error('身份证号码不能为空');
  }
  params.actual_loan_info.identity = identity;

  // 手机号
  if (is.not.existy(phone) || is.empty(phone)) {
    return message.error('联系方式不能为空');
  }
  params.actual_loan_info.phone = phone;

  // 银行卡号
  if (is.not.existy(cardNum) || is.empty(cardNum)) {
    return message.error('收款账户不能为空');
  }
  params.payee_account_info.card_num = cardNum;

  // 开户行
  if (is.not.existy(bankName) || is.empty(bankName)) {
    return message.error('开户支行不能为空');
  }
  params.payee_account_info.bank_details = bankName;

  // 借款金额
  if (is.not.existy(borrowMoney) || is.empty(borrowMoney) || is.not.number(borrowMoney)) {
    return message.error('借款金额不合法');
  }
  params.loan_money = Unit.dynamicExchange(borrowMoney, Unit.priceYuan);

  // 借款原因
  if (is.not.existy(borrowNote) || is.empty(borrowNote)) {
    return message.error('借款事由不能为空');
  }
  params.loan_note = borrowNote;

  // 附件内容
  if (is.existy(attachments) && is.not.empty(attachments)) {
    params.asset_ids = attachments;
  }

  // 还款方式
  if (is.not.existy(repayMethod) || is.empty(repayMethod)) {
    return message.error('还款方式不能为空');
  }
  params.repayment_method = Number(repayMethod);

  // 还款周期
  if (is.not.existy(repayCircle) || is.empty(repayCircle)) {
    return message.error('还款周期不能为空');
  }
  params.repayment_cycle = Number(repayCircle);

  // 还款日期
  if (is.not.existy(repayDay) || is.empty(repayDay)) {
    return message.error('预计还款时间不能为空');
  }
  params.expected_repayment_time = Number(moment(repayDay).format('YYYYMMDD'));

  // 实际借款人
  employeeId && (params.actual_loan_info.actual_loan_employee_id = employeeId);
  // 团队name
  teamName && (params.actual_loan_info.department_name = teamName);

  return { params, ok: true };
};
// 转换还款单参数
const transferRepayOrder = (payload) => {
  // 默认参数
  const params = {};
  const {
    repayMoney, // 还款金额
    attachments, // 附件
    note, // 备注
  } = payload;

  // 还款金额
  if (is.not.existy(repayMoney) || is.empty(repayMoney) || is.not.number(repayMoney)) {
    return message.error('借款金额不合法');
  }
  params.repayment_money = Unit.dynamicExchange(repayMoney, Unit.priceYuan);

   // 附件
  if (is.not.existy(attachments) || is.empty(attachments)) {
    params.asset_ids = [];
  } else {
    params.asset_ids = attachments;
  }

  // 备注
  if (is.not.existy(note) || is.empty(note)) {
    params.repayment_note = '';
  } else {
    params.repayment_note = note;
  }

  return { params, ok: true };
};


export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'borrowingRepayment',
  /**
   * 状态树
   * @prop {object} borrowingOrders            借款单列表
   * @prop {object} repaymentOrders            还款单列表
   */
  state: {
    // 借款单列表
    borrowingOrders: {},
    // 还款单列表
    repaymentOrders: {},
    // 审批单详情
    examineOrderDetail: {},
    // 还款详情数据
    repaymentDetail: {},
    // 借款单详情数据
    borrowingDetail: {},
    // 审批单流转记录
    flowRecordList: [],
  },

  /**
   * @namespace expense/borrowingRepayment/effects
   */
  effects: {
    /**
     * 获取审批单详情
     * @param {string}   id           审批单id
     * @param {function} onSuccessCallback  成功回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * fetchExamineOrderDetail({ payload = {} }, { call, put }) {
      // 审批单id
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('获取审批单详情错误，审批单id不能为空');
      }

      const params = {
        id: payload.id,
      };

      // 请求接口
      const result = yield call(fetchPCExamineOrderDetail, params);

      // 调用回调
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result.biz_extra_house_contract_id);
      }

      // 判断数据是否为空
      if (is.existy(result)) {
        yield put({ type: 'reduceExamineOrderDetail', payload: result });
      }
    },

    /**
     * 重置审批单详情
     * @todo 接口需升级优化
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * resetExamineOrderDetail({ payload }, { put }) {
      yield put({ type: 'reduceExamineOrderDetail', payload: {} });
    },

    /**
     * 获取借款单列表
     * @param {string} borrowOrderId    借款单号
     * @param {number} borrowType       借款类型
     * @param {number} repaymentState   还款状态
     * @param {string} subjectMatter    借款事由
     * @param {array} platforms         平台
     * @param {array} suppliers         供应商
     * @param {array} cities            城市
     * @param {array} districts         商圈
     * @param {number} borrowStartTime     借款开始时间
     * @param {number} borrowEndTime       借款结束时间
     * @param {number} repaymentStartTime  还款开始时间
     * @param {number} repaymentEndTime    还款结束时间
     * @param {string} applyAccountId      账号ID
     * @param {number} state               流程状态
     */
    * fetchBorrowingOrders({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
        // 默认流程状态(审批进行中、完成、关闭)
        state: [ExpenseExamineOrderProcessState.processing,
          ExpenseExamineOrderProcessState.finish,
          ExpenseExamineOrderProcessState.close],
      };
      const {
        borrowOrderId,
        borrowType,
        repaymentState,
        subjectMatter,
        platforms,
        suppliers,
        cities,
        districts,
        borrowStartTime,
        borrowEndTime,
        repaymentStartTime,
        repaymentEndTime,
        applyAccountId,
        disableState,
        state,
      } = payload;
      // 在审批单中如果是提报时状态会为[]
      if (disableState) {
        params.state = [];
      }
      // 借款单号
      if (is.existy(borrowOrderId) && is.not.empty(borrowOrderId)) {
        params._id = borrowOrderId;
      }

      // 借款类型
      if (is.existy(borrowType) && is.not.empty(borrowType)) {
        params.loan_type = borrowType;
      }

      // 还款状态
      if (is.existy(repaymentState) && is.not.empty(repaymentState)) {
        params.repayment_state = repaymentState;
      }

      // 借款事由
      if (is.existy(subjectMatter) && is.not.empty(subjectMatter)) {
        params.loan_note = subjectMatter;
      }

      // 平台
      if (is.existy(platforms) && is.not.empty(platforms)) {
        params.platform_code = platforms;
      }

      // 供应商
      if (is.existy(suppliers) && is.not.empty(suppliers)) {
        params.supplier_id = suppliers;
      }

      // 城市
      if (is.existy(cities) && is.not.empty(cities)) {
        params.city_code = cities;
      }

      // 商圈
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_id = districts;
      }

      // 预计还款开始日期
      if (is.existy(repaymentStartTime) && is.not.empty(repaymentStartTime)) {
        params.expected_repayment_start_time = Number(repaymentStartTime);
      }

      // 预计还款结束日期
      if (is.existy(repaymentEndTime) && is.not.empty(repaymentEndTime)) {
        params.expected_repayment_end_time = Number(repaymentEndTime);
      }

      // 借款开始日期
      if (is.existy(borrowStartTime) && is.not.empty(borrowStartTime)) {
        params.loan_start_time = Number(borrowStartTime);
      }

      // 借款结束日期
      if (is.existy(borrowEndTime) && is.not.empty(borrowEndTime)) {
        params.loan_end_time = Number(borrowEndTime);
      }

      // 账号id
      if (is.existy(applyAccountId) && is.not.empty(applyAccountId)) {
        params.apply_account_id = applyAccountId;
      }

      // 流程状态
      if (is.existy(state) && is.not.empty(state)) {
        params.state = [state];
      }

      // 获取数据
      const result = yield call(fetchBorrowingOrders, params);
      if (is.existy(result.data)) {
        yield put({ type: 'reduceBorrowingOrders', payload: result });
      }
    },

    /**
     * 获取还款单列表
     * @param {array} platforms         平台
     * @param {array} suppliers         供应商
     * @param {array} cities            城市
     * @param {array} districts         商圈
     * @param {number} state            流程状态
     * @param {string} repaymentsOrderId   还款单号
     * @param {number} repaymentStartTime  还款开始时间
     * @param {number} repaymentEndTime    还款结束时间
     */
    * fetchRepaymentOrders({ payload = {} }, { call, put }) {
      // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
        // 默认流程状态(审批进行中、完成、关闭)
        state: [ExpenseExamineOrderProcessState.processing,
          ExpenseExamineOrderProcessState.finish,
          ExpenseExamineOrderProcessState.close],
      };

      const {
        platforms,
        suppliers,
        cities,
        districts,
        state,
        repaymentsOrderId,
        repaymentStartTime,
        repaymentEndTime,
        applyAccountId,
        borrowingId,
        disableState,
        orderState,
      } = payload;
      // 在审批单中如果是提报时状态会为[]
      if (disableState) {
        params.state = [];
      }
      // 除了待提报状态都可以显示
      if (orderState) {
        params.state = [ExpenseExamineOrderProcessState.finish, ExpenseExamineOrderProcessState.close, ExpenseExamineOrderProcessState.processing];
      }
      // 平台
      if (is.existy(platforms) && is.not.empty(platforms)) {
        params.platform_code = platforms;
      }

      // 供应商
      if (is.existy(suppliers) && is.not.empty(suppliers)) {
        params.supplier_id = suppliers;
      }

      // 城市
      if (is.existy(cities) && is.not.empty(cities)) {
        params.city_code = cities;
      }

      // 商圈
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_id = districts;
      }

      // 还款单号
      if (is.existy(repaymentsOrderId) && is.not.empty(repaymentsOrderId)) {
        params._id = repaymentsOrderId;
      }
      // 借款单号
      if (is.existy(borrowingId) && is.not.empty(borrowingId)) {
        params.loan_order_id = borrowingId;
      }

      // 流程状态
      if (is.existy(state) && is.not.empty(state)) {
        params.state = [state];
      }

      // 还款开始时间
      if (is.existy(repaymentStartTime) && is.not.empty(repaymentStartTime)) {
        params.repayment_start_time = Number(repaymentStartTime);
      }

      // 还款结束时间
      if (is.existy(repaymentEndTime) && is.not.empty(repaymentEndTime)) {
        params.repayment_end_time = Number(repaymentEndTime);
      }

      // 账号id
      if (is.existy(applyAccountId) && is.not.empty(applyAccountId)) {
        params.apply_account_id = applyAccountId;
      }

      // 获取数据
      const result = yield call(fetchRepaymentOrders, params);
      if (is.existy(result.data)) {
        yield put({ type: 'reduceRepaymentOrders', payload: result });
      }
    },

    /**
     * 创建借款单
     * @param {string} applicationOrderId 归属审批单id
     * @param {number} borrowType 借款类型
     * @param {string} platform 平台
     * @param {string} supplier 供应商
     * @param {string} city 城市
     * @param {string} district 商圈
     * @param {string} name 实际借款人
     * @param {string} identity 身份证号码
     * @param {string} phone 借款人联系方式
     * @param {string} cardNum 收款账户
     * @param {string} bankName 开户支行
     * @param {number} borrowMoney 借款金额
     * @param {string} borrowNote 借款事由
     * @param {array} attachments 上传附件
     * @param {number} repayMethod 还款方式
     * @param {number} repayCircle 还款周期
     * @param {moment} repayDay 预计还款时间
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *createBorrowOrder({ payload = {} }, { put }) {
      const { params, ok } = transferBorrowOrder(payload);
      if (ok !== true) return;

      // 审批单id
      const { applicationOrderId } = payload;
      if (is.not.existy(applicationOrderId) || is.empty(applicationOrderId)) {
        return message.error('审批单ID不能为空');
      }
      params.application_order_id = applicationOrderId;
      params.storage_type = 3; // 上传文件的类型
      const request = {
        params,
        service: createBorrowOrder,
        onVerifyCallback: result => is.existy(result) && is.existy(result._id) && is.not.empty(result._id),
        onSuccessCallback: payload.onSuccessCallback,
        onFailureCallback: payload.onFailureCallback,
      };
      // 调用接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 编辑借款单
     * @param {string} id 借款单id
     * @param {number} borrowType 借款类型
     * @param {string} platform 平台
     * @param {string} supplier 供应商
     * @param {string} city 城市
     * @param {string} district 商圈
     * @param {string} name 实际借款人
     * @param {string} identity 身份证号码
     * @param {string} phone 借款人联系方式
     * @param {string} cardNum 收款账户
     * @param {string} bankName 开户支行
     * @param {number} borrowMoney 借款金额
     * @param {string} borrowNote 借款事由
     * @param {array} attachments 上传附件
     * @param {number} repayMethod 还款方式
     * @param {number} repayCircle 还款周期
     * @param {moment} repayDay 预计还款时间
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *updateBorrowOrder({ payload = {} }, { put }) {
      const { params, ok } = transferBorrowOrder(payload);
      if (ok !== true) return;

      // 借款单id
      const { id } = payload;
      if (is.not.existy(id) || is.empty(id)) {
        return message.error('审批单ID不能为空');
      }
      params.id = id;
      params.storage_type = 3; // 上传文件的类型

      if (payload.district) {
        params.biz_district_id = payload.district;
      } else {
        params.biz_district_id = '';
      }
      const request = {
        params,
        service: updateBorrowOrder,
        onVerifyCallback: result => is.existy(result) && is.truthy(result.ok),
        onSuccessCallback: payload.onSuccessCallback,
        onFailureCallback: payload.onFailureCallback,
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },
     /**
     * 获取借款单详情数据
     * @param {string} id 借款id
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *fetchBorrowingDetails({ payload = {} }, { call, put }) {
      const params = {};
      const { id } = payload;
      if (is.not.existy(id) || is.empty(id)) {
        return message.error('借款单ID不能为空');
      }
      params.id = id;
      // 获取数据
      const result = yield call(fetchBorrowingDetails, params);
      if (is.existy(result)) {
        yield put({ type: 'reduceBorrowingDetails', payload: result });
      }
    },
    /**
     * 清空借款单详情数据
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *resetBorrowingDetails({ payload = {} }, { put }) {
      yield put({ type: 'reduceBorrowingDetails', payload: { } });
    },

    /**
     * 获取借款单详情数据
     * @param {string} id 借款id
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    // TODO: 不确定
    *fetchRepaymentsDetails({ payload = {} }, { call, put }) {
      const params = {};
      const { id } = payload;
      if (is.not.existy(id) || is.empty(id)) {
        return message.error('还款单ID不能为空');
      }
      params.id = id;
      // 获取数据
      const result = yield call(fetchRepaymentsDetails, params);
      if (payload.onSuccessCallback) {
        payload.onSuccessCallback(result);
      }
      if (is.existy(result)) {
        yield put({ type: 'reduceRepaymentsDetails', payload: result });
      }
    },

    /**
     * 清空还款单详情数据
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *resetRepaymentsDetails({ payload = {} }, { put }) {
      yield put({ type: 'reduceRepaymentsDetails', payload: {} });
    },
    /**
     * 创建还款单
     * @param {string} applicationOrderId 归属审批单id
     * @param {string} borrowOrderId 借款单id
     * @param {number} repayMoney 还款金额
     * @param {string} note 备注
     * @param {array} attachments 上传附件
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *createRepayOrder({ payload = {} }, { put }) {
      const params = {
        storage_type: 3, // 上传文件的类型
      };
      const { applicationOrderId, borrowOrderId } = payload;

      // 审批单id
      if (is.not.existy(applicationOrderId) || is.empty(applicationOrderId)) {
        return message.error('审批单ID不能为空');
      }
      params.application_order_id = applicationOrderId;

      // 借款单id
      if (is.not.existy(borrowOrderId) || is.empty(borrowOrderId)) {
        return message.error('借款单ID不能为空');
      }
      params.loan_order_id = borrowOrderId;

      params.repayment_money = 0;
      params.asset_ids = ['xxx'];

      const request = {
        params,
        service: createRepayOrder,
        onVerifyCallback: result => is.existy(result) && is.existy(result._id) && is.not.empty(result._id),
        onSuccessCallback: res => payload.onSuccessCallback(res, applicationOrderId),
        onFailureCallback: payload.onFailureCallback,
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },
    /**
     * 编辑还款单
     * @param {string} id 还款单id
     * @param {number} repayMoney 还款金额
     * @param {string} note 备注
     * @param {array} attachments 上传附件
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *updateRepayOrder({ payload = {} }, { put }) {
      const { params, ok } = transferRepayOrder(payload);
      if (ok !== true) return;

      // 还款单id
      const { id } = payload;
      if (is.not.existy(id) || is.empty(id)) {
        return message.error('还款单ID不能为空');
      }
      params.id = id;
      params.storage_type = 3; // 上传文件的类型
      const request = {
        params,
        service: updateRepayOrder,
        onVerifyCallback: result => is.existy(result) && is.truthy(result.ok),
        onSuccessCallback: payload.onSuccessCallback,
        onFailureCallback: payload.onFailureCallback,
      };
      // 请求接口
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 重置借款单列表数据
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *resetBorrowingOrders({ payload = {} }, { put }) {
      yield put({ type: 'reduceBorrowingOrders', payload: {} });
    },

    /**
     * 重置还款单列表数据
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *resetRepaymentOrders({ payload = {} }, { put }) {
      yield put({ type: 'reduceRepaymentOrders', payload: {} });
    },

    /**
     * 借款导出Excel表格
     * @param {string} borrowOrderId    借款单号
     * @param {number} borrowType       借款类型
     * @param {number} repaymentState   还款状态
     * @param {string} subjectMatter    借款事由
     * @param {array} platforms         平台
     * @param {array} suppliers         供应商
     * @param {array} cities            城市
     * @param {array} districts         商圈
     * @param {number} borrowStartTime     借款开始时间
     * @param {number} borrowEndTime       借款结束时间
     * @param {number} repaymentStartTime  还款开始时间
     * @param {number} repaymentEndTime    还款结束时间
     * @param {string} applyAccountId      账号ID
     * @param {number} state               流程状态
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *borrowingDownloadTemplate({ payload = {} }, { put }) {
      // 请求列表的meta信息
      const params = {
      // 默认流程状态(审批进行中、完成、关闭)
        state: [ExpenseExamineOrderProcessState.processing,
          ExpenseExamineOrderProcessState.finish,
          ExpenseExamineOrderProcessState.close],
      };
      const {
        borrowOrderId,
        borrowType,
        repaymentState,
        subjectMatter,
        platforms,
        suppliers,
        cities,
        districts,
        borrowStartTime,
        borrowEndTime,
        repaymentStartTime,
        repaymentEndTime,
        state,
        applyAccountId,
      } = payload.params;
       // 借款单号
      if (is.existy(borrowOrderId) && is.not.empty(borrowOrderId)) {
        params._id = borrowOrderId;
      }

       // 借款类型
      if (is.existy(borrowType) && is.not.empty(borrowType)) {
        params.loan_type = borrowType;
      }

       // 还款状态
      if (is.existy(repaymentState) && is.not.empty(repaymentState)) {
        params.repayment_state = repaymentState;
      }

      // 借款事由
      if (is.existy(subjectMatter) && is.not.empty(subjectMatter)) {
        params.loan_note = subjectMatter;
      }

       // 平台
      if (is.existy(platforms) && is.not.empty(platforms)) {
        params.platform_code = platforms;
      }

       // 供应商
      if (is.existy(suppliers) && is.not.empty(suppliers)) {
        params.supplier_id = suppliers;
      }

       // 城市
      if (is.existy(cities) && is.not.empty(cities)) {
        params.city_code = cities;
      }

       // 商圈
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_id = districts;
      }

      // 预计还款开始日期
      if (is.existy(repaymentStartTime) && is.not.empty(repaymentStartTime)) {
        params.expected_repayment_start_time = Number(repaymentStartTime);
      }

      // 预计还款结束日期
      if (is.existy(repaymentEndTime) && is.not.empty(repaymentEndTime)) {
        params.expected_repayment_end_time = Number(repaymentEndTime);
      }

      // 借款开始日期
      if (is.existy(borrowStartTime) && is.not.empty(borrowStartTime)) {
        params.loan_start_time = Number(borrowStartTime);
      }

      // 借款结束日期
      if (is.existy(borrowEndTime) && is.not.empty(borrowEndTime)) {
        params.loan_end_time = Number(borrowEndTime);
      }

      // 账号id
      if (is.existy(applyAccountId) && is.not.empty(applyAccountId)) {
        params.apply_account_id = applyAccountId;
      }

       // 流程状态
      if (is.existy(state) && is.not.empty(state)) {
        params.state = [state];
      }

      const request = {
        params, // 接口参数
        service: borrowingDownloadTemplate,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 还款导出Excel表格
     * @param {array} platforms         平台
     * @param {array} suppliers         供应商
     * @param {array} cities            城市
     * @param {array} districts         商圈
     * @param {number} state            流程状态
     * @param {string} repaymentsOrderId   还款单号
     * @param {number} repaymentStartTime  还款开始时间
     * @param {number} repaymentEndTime    还款结束时间
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/effects
     */
    *repaymentsDownloadTemplate({ payload = {} }, { put }) {
      // 请求列表的meta信息
      const params = {
        state: [ExpenseExamineOrderProcessState.processing,
          ExpenseExamineOrderProcessState.finish,
          ExpenseExamineOrderProcessState.close],
      };

      const {
        platforms,
        suppliers,
        cities,
        districts,
        state,
        repaymentsOrderId,
        repaymentStartTime,
        repaymentEndTime,
        applyAccountId,
        borrowingId,
        orderState,
      } = payload.params;
      // 除了待提报状态都可以显示
      if (orderState) {
        params.state = [ExpenseExamineOrderProcessState.finish, ExpenseExamineOrderProcessState.close, ExpenseExamineOrderProcessState.processing];
      }
      // 平台
      if (is.existy(platforms) && is.not.empty(platforms)) {
        params.platform_code = platforms;
      }

      // 供应商
      if (is.existy(suppliers) && is.not.empty(suppliers)) {
        params.supplier_id = suppliers;
      }

      // 城市
      if (is.existy(cities) && is.not.empty(cities)) {
        params.city_code = cities;
      }

      // 商圈
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_id = districts;
      }

      // 还款单号
      if (is.existy(repaymentsOrderId) && is.not.empty(repaymentsOrderId)) {
        params._id = repaymentsOrderId;
      }
      // 借款单号
      if (is.existy(borrowingId) && is.not.empty(borrowingId)) {
        params.loan_order_id = borrowingId;
      }

      // 流程状态
      if (is.existy(state) && is.not.empty(state)) {
        params.state = [state];
      }

      // 还款开始时间
      if (is.existy(repaymentStartTime) && is.not.empty(repaymentStartTime)) {
        params.repayment_start_time = Number(repaymentStartTime);
      }

      // 还款结束时间
      if (is.existy(repaymentEndTime) && is.not.empty(repaymentEndTime)) {
        params.repayment_end_time = Number(repaymentEndTime);
      }

      // 账号id
      if (is.existy(applyAccountId) && is.not.empty(applyAccountId)) {
        params.apply_account_id = applyAccountId;
      }

      const request = {
        params, // 接口参数
        service: repaymentsDownloadTemplate,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取审批单流转记录
     * @param {string}   id           审批单id
     * @param {function} onSuccessCallback  成功回调
     * @memberof module:model/expense/examineOrder~expense/examineOrder/effects
     */
    * fetchExamineOrderFlowRecordList({ payload = {} }, { call, put }) {
      const {
        id,
      } = payload;
      if (is.empty(id) || is.not.existy(id)) {
        return message.error('获取审批单流转记录错误，审批单id不能为空');
      }

      const params = {
        order_id: id,
      };

      const result = yield call(fetchExamineOrderFlowRecordList, params);

      if (is.existy(result)) {
        yield put({ type: 'reduceExamineOrderFlowRecordList', payload: result });
      }
    },
  },

  /**
   * @namespace expense/costOrder/reducers
   */
  reducers: {
    /**
     * 更新借款单列表
     * @returns {object} 更新 borrowingOrders
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/reducers
     */
    reduceBorrowingOrders(state, action) {
      let borrowingOrders = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        borrowingOrders = action.payload;
      }
      return { ...state, borrowingOrders };
    },

    /**
     * 更新还款单列表
     * @returns {object} 更新 repaymentOrders
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/reducers
     */
    reduceRepaymentOrders(state, action) {
      let repaymentOrders = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        repaymentOrders = action.payload;
      }
      return { ...state, repaymentOrders };
    },

    /**
     * 审批单详情数据
     * @returns {object} 更新 examineOrderDetail
     * @memberof module:model/expense/examineOrder~expense/examineOrder/reducers
     */
    reduceExamineOrderDetail(state, action) {
      let examineOrderDetail = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        examineOrderDetail = ApplicationOrderDetail.mapper(action.payload, ApplicationOrderDetail);
      }
      return { ...state, examineOrderDetail };
    },

     /**
     * 借款详情数据
     * @returns {object} 更新 borrowingDetail
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/reducers
     */
    reduceBorrowingDetails(state, action) {
      let borrowingDetail = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        borrowingDetail = action.payload;
      }
      return { ...state, borrowingDetail };
    },
    /**
     * 还款详情数据
     * @returns {object} 更新 repaymentDetail
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/reducers
     */
    reduceRepaymentsDetails(state, action) {
      let repaymentDetail = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        repaymentDetail = action.payload;
      }
      return { ...state, repaymentDetail };
    },

    /**
     * 借款单流转记录列表
     * @returns {object} 更新 flowRecordList
     * @memberof module:model/expense/borrowingRepayment~expense/borrowingRepayment/reducers
     */
    reduceExamineOrderFlowRecordList(state, action) {
      let flowRecordList = [];
      const {
        data = {},
      } = action.payload;
      if (is.not.empty(data) && is.existy(data)) {
        flowRecordList = ApplicationOrderFlowRecordBrief.mapperEach(data, ApplicationOrderFlowRecordBrief);
      }
      return { ...state, flowRecordList };
    },
  },
};
