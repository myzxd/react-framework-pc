        /**
 * 房屋合同 (目前仅返回房屋编号，后续扩展到合同管理的功能)
 * @module model/expense/houseContract
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { message } from 'antd';

import {
  createHouseContract, // 创建房屋合同
  updateHouseContract, // 编辑房屋合同
  fetchHouseContractDetail, // 获取房屋合同详情
  fetchHouseContracts, // 获取房屋合同列表
  createFlowByContract,
  getNewGroupApprovaList,
  fetchHouseContractDelete,
  fetchHouseRenew,
  costApplyContract,
  fetchHouseAccount,
  exportHouseLedger,
} from '../../services/expense/houseContract';

import { Unit, ExpenseHouseContractState } from '../../application/define';
import { fetchSubjectsDetail } from '../../services/expense';
import {
  RequestMeta,
  ResponseMeta,
  OaHouseContract,
  CostAccountingDetail,
  HouseContractDetail,
  HouseContractListItem,
 } from '../../application/object/';

const dealWithData = (val = {}) => {
  const {
    sort,
    contractnum,
    houseNumber,
    platforms,
    districts,
    state,
    suppliers,
    cities,
    startBeforeTime,
    startAfterTime,
    endBeforeTime,
    endAfterTime,
  } = val;

  // 请求列表的meta信息
  const params = {
    _meta: RequestMeta.mapper(val),
    state: [
      ExpenseHouseContractState.pendding, // 待提交
      ExpenseHouseContractState.verifying, // 审批中
      ExpenseHouseContractState.processing, // 执行中
      ExpenseHouseContractState.done, // 完成
    ], // 默认状态
  };
  // sort
  if (is.not.empty(sort) && is.existy(sort)) {
    params.sort = sort;
  }
  // 获取合同编号
  if (is.not.empty(contractnum) && is.existy(contractnum)) {
    params.id = contractnum;
  }
  // 获取平台
  if (is.not.empty(platforms) && is.existy(platforms)) {
    params.platform_codes = platforms;
  }

  // 获取合同编号
  if (is.not.empty(houseNumber) && is.existy(houseNumber)) {
    params.house_no = houseNumber;
  }

  // 获取商圈
  if (is.not.empty(districts) && is.existy(districts)) {
    params.biz_district_ids = districts;
  }

  // 获取执行状态
  if (is.not.empty(state) && is.existy(state)) {
    params.state = [Number(val.state)];
  }

   // 获取供应商
  if (is.not.empty(suppliers) && is.existy(suppliers)) {
    params.supplier_ids = suppliers;
  }

  // 获取城市
  if (is.not.empty(cities) && is.existy(cities)) {
    params.city_codes = cities;
  }

  // 合同开始时间段开始时间
  if (is.not.empty(startBeforeTime) && is.existy(startBeforeTime)) {
    params.start_min_date = Number(startBeforeTime);
  }

  // 合同开始时间段结束时间
  if (is.not.empty(startAfterTime) && is.existy(startAfterTime)) {
    params.start_max_date = Number(startAfterTime);
  }

  // 合同结束时间段开始时间
  if (is.not.empty(endBeforeTime) && is.existy(endBeforeTime)) {
    params.end_min_date = Number(endBeforeTime);
  }

  // 合同结束时间段结束时间
  if (is.not.empty(endAfterTime) && is.existy(endAfterTime)) {
    params.end_max_date = Number(endAfterTime);
  }

  return params;
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'expenseHouseContract',
  /**
   * 状态树
   * @prop {object} houseContractData    房屋合同列表
   * @prop {object} houseContractDetail  房屋合同详情数据
   * @prop {object} subjectsDetail       科目详情(含namespace)
   * @prop {object} approvalSheetInfo    续租/断组/退租审批单数据
   * @prop {object} newleasepAprovalInfo 新租审批单数据
   * @prop {string} pledgemoney          押金数据
   * @prop {string} update               断租时间
   */
  state: {
    // 房屋合同列表
    houseContractData: {},
    // 房屋合同详情数据
    houseContractDetail: {},
    // 科目详情(含namespace)
    subjectsDetail: {},
    // 续租/断组/退租审批单数据
    approvalSheetInfo: {},
    // 新租审批单数据
    newleasepAprovalInfo: {},
    // 押金数据
    pledgemoney: '',
    // 断租时间
    update: '',
    // 房屋台账
    houseAccout: {},
  },
   /**
   * @namespace expense/houseContract/subscriptions
   */
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query, search } = location;
        let id;
        if (query && query.id) {
          id = query.id;
        } else {
          id = search.slice(4, 28);
        }

        // 获取房屋列表
        if (pathname === '/Manage/House') {
          dispatch({ type: 'fetchHouseFlows', payload: { page: 1, limit: 30 } });
        }
        // 获取房屋详情/编辑
        if (pathname === '/Expense/Manage/House/Detail' || pathname === '/Expense/Manage/House/Update') {
          dispatch({
            type: 'fetchHouseContractsDetail',
            payload: { id },
          });
        }
      });
    },
  },
  /**
   * @namespace expense/houseContract/effects
   */
  effects: {

    // 执行房屋合同
    // TODO: 确定, 可删除
    * excuteHouseContract({ payload = {} }, { put }) {
      const {
        contractId,    // 合同id
      } = payload;
      const params = {};
      if (is.existy(contractId) && is.not.empty(contractId)) {
        params.id = contractId;
      }
      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.id) && is.not.empty(result.id);
      };

      const request = {
        params, // 接口参数
        service: createFlowByContract,  // 接口
        onVerifyCallback, // 验证返回数据的回调
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 重置房屋详情数据
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * resetHouseContractDetail({ payload = {} }, { put }) {
      yield put({
        type: 'reduceHouseContractDetail',
        payload: {},
      });
    },

    /**
     * 新建房屋合同
     * @param {string}  migrateFlag 存量合同录入模式
     * @param {string}  migrateOaNote 原OA审批单号
     * @param {string}  contractDate 合同租期
     * @param {string}  area 面积
     * @param {number}  periodMonthNum 付款周期
     * @param {number}  schedulePrepareDays 提前付款天数
     * @param {number}  monthMoney    月租金
     * @param {number}  initPaidMoney  已支付租金金额
     * @param {number}  initPaidMonthNum 已支付租金月数
     * @param {array}   attachments 附件
     * @param {number}  pledgeMoney 押金金额
     * @param {number}  agentMoney    中介费
     * @param {number}  rentInvoiceFlag  租金是否开票
     * @param {number}  agentInvoiceFlag 中介费是否开票
     * @param {number}  pledgeInvoiceFlag 押金是否开票
     * @param {string}  agentPayeeInfo 中介费收款信息
     * @param {string}  pledgePayeeInfo 押金收款信息
     * @param {number}  note 备注
     * @param {number}  costCenterType 成本中心
     * @param {string}  usage 用途
     * @param {string}  rentAccountingId  租金科目
     * @param {string}  pledgeAccountingId 押金科目
     * @param {string}  agentAccountingId 中介费科目
     * @param {object}  expense 分担信息
     * @param {string}  platformCode 平台id
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * createHouseContract({ payload = {} }, { put }) {
      const {
        migrateFlag,          // 存量合同录入模式
        migrateOaNote,        // 原OA审批单号
        contractDate,         // 合同租期
        area,                 // 面积
        periodMonthNum,       // 付款周期
        schedulePrepareDays,  // 提前付款天数
        monthMoney,           // 月租金
        initPaidMoney,        // 已支付租金金额
        initPaidMonthNum,     // 已支付租金月数
        attachments,          // 附件
        pledgeMoney,          // 押金金额
        agentMoney,           // 中介费
        rentInvoiceFlag,      // 租金是否开票
        agentInvoiceFlag,     // 中介费是否开票
        pledgeInvoiceFlag,    // 押金是否开票
        // agentPayeeInfo,       // 中介费收款信息
        // pledgePayeeInfo,      // 押金收款信息
        note,                 // 备注
        costCenterType,       // 成本中心
        usage,                // 用途
        rentAccountingId,     // 租金科目
        pledgeAccountingId,   // 押金科目
        agentAccountingId,    // 中介费科目
        invoiceTitle,         // 发票抬头
        rentInvoiceTitle,     // 租金发票抬头
        pledgeInvoiceTitle,   // 押金发票抬头
        agentInvoiceTitle,    // 中介费发票抬头
        expense: {
          costItems,          // 分摊信息
        },
        platformCode,         // 平台id
        address,              // 房屋地址
        landlordName,         // 房东姓名
        paymentMethod,        // 付款方式
        noApportionMoney,     // 未分摊金额
        noApportionTime,      // 未分摊时间段
        noApportionDate,      // 已分摊时间
        source,               // 房屋来源
        pledgePayee, // 押金收款人
        pledgePayeeAccount, // 押金收款账户
        pledgeBankName, // 押金开户行
        rentPayee, // 租金收款人
        rentPayeeAccount, // 租金收款账户
        rentBankName, // 租金开户行
        agentPayee, // 中介费收款人
        agentPayeeAccount, // 中介费收款账户
        agentBankName, // 中介费开户行
        mediumUnifiedCode, // 中介费 收款类型：对公 统一信用代码
        mediumIdNumber,    // 中介费 收款类型：对私 身份证号
        UnifiedCode,       // 租金收款类型：对公 统一信用代码
        idNumber,           // 租金收款类型：对私 身份证号
        payMethod,          // 租金收款类型
        mediumPayMethod,    // 中介费 收款类型
      } = payload.param;
      // 处理未分摊时间段
      // 开始时间
      const allocationStart = dot.has(noApportionTime, '0') ? moment(noApportionTime[0]).format('YYYYMMDD') : '';
      // 结束时间
      const allocationEnd = dot.has(noApportionTime, '0') ? moment(noApportionTime[1]).format('YYYYMMDD') : '';

      const params = {
        storage_type: 3, // 上传文件的类型
      };

      // 平台id
      if (is.existy(platformCode) && is.not.empty(platformCode)) {
        params.platform_code = platformCode;
      }

      // 发票抬头
      if (is.existy(invoiceTitle) && is.not.empty(invoiceTitle)) {
        params.invoice_title = invoiceTitle;
      }

      // 租金发票抬头
      if (is.existy(rentInvoiceTitle) && is.not.empty(rentInvoiceTitle)) {
        params.rent_invoice_title = rentInvoiceTitle;
      }

      // 押金发票抬头
      if (is.existy(pledgeInvoiceTitle) && is.not.empty(pledgeInvoiceTitle)) {
        params.pledge_invoice_title = pledgeInvoiceTitle;
      }

      // 中介费发票抬头
      if (is.existy(agentInvoiceTitle) && is.not.empty(agentInvoiceTitle)) {
        params.agent_invoice_title = agentInvoiceTitle;
      }

      // 分摊信息
      params.cost_allocations = costItems.map((v) => {
        const ret = {};
        const { vendor, city, district } = v;
        // TODO: 此处的platform是从上级选择框取的,而不是表单原值
        ret.platform_code = platformCode;
        if (vendor) {
          ret.supplier_id = vendor;
        }
        if (city) {
          ret.city_code = city;
        }
        if (district) {
          ret.biz_district_id = district;
        }
        return ret;
      });

      // 租金科目
      if (is.existy(rentAccountingId) && is.not.empty(rentAccountingId)) {
        params.rent_accounting_id = rentAccountingId;
      }

      // 押金科目
      if (is.existy(pledgeAccountingId) && is.not.empty(pledgeAccountingId)) {
        params.pledge_accounting_id = pledgeAccountingId;
      }

      // 中介费科目
      if (is.existy(agentAccountingId) && is.not.empty(agentAccountingId)) {
        params.agent_accounting_id = agentAccountingId;
      }

      // 用途
      if (is.existy(usage) && is.not.empty(usage)) {
        params.usage = usage;
      }

      // 成本中心
      if (is.existy(costCenterType) && is.not.empty(costCenterType)) {
        params.cost_center_type = Number(costCenterType);
      }

      // 备注
      if (is.existy(note) && is.not.empty(note)) {
        params.note = note;
      }

      // 租金是否开票
      if (is.existy(rentInvoiceFlag) && is.not.empty(rentInvoiceFlag)) {
        params.rent_invoice_flag = !!Number(rentInvoiceFlag);
      }

      // 押金是否开票
      if (is.existy(pledgeInvoiceFlag) && is.not.empty(pledgeInvoiceFlag)) {
        params.pledge_invoice_flag = !!Number(pledgeInvoiceFlag);
      }

      // 中介费是否开票
      if (is.existy(agentInvoiceFlag) && is.not.empty(agentInvoiceFlag)) {
        params.agent_invoice_flag = !!Number(agentInvoiceFlag);
      }

      params.rent_payee_info = {};
      // 租金收款人
      if (is.existy(rentPayee) && is.not.empty(rentPayee)) {
        params.rent_payee_info.card_name = rentPayee;
      }

      // 租金收款账号
      if (is.existy(rentPayeeAccount) && is.not.empty(rentPayeeAccount)) {
        params.rent_payee_info.card_num = rentPayeeAccount;
      }

      // 租金收款开户行
      if (is.existy(rentBankName) && is.not.empty(rentBankName)) {
        params.rent_payee_info.bank_details = rentBankName;
      }
      // 租金收款类型：对公 统一信用代码
      if (is.existy(UnifiedCode) && is.not.empty(UnifiedCode)) {
        params.rent_payee_info.credit_no = UnifiedCode;
      }
      // 租金收款类型：对私 身份证号
      if (is.existy(idNumber) && is.not.empty(idNumber)) {
        params.rent_payee_info.id_card_no = idNumber;
      }
      // 租金收款类型
      if (is.existy(payMethod) && is.not.empty(payMethod)) {
        params.rent_payee_info.payment = payMethod;
      }


      params.pledge_payee_info = {};
      // 押金收款人
      if (is.existy(pledgePayee) && is.not.empty(pledgePayee)) {
        params.pledge_payee_info.card_name = pledgePayee;
      }

      // 押金收款账号
      if (is.existy(pledgePayeeAccount) && is.not.empty(pledgePayeeAccount)) {
        params.pledge_payee_info.card_num = pledgePayeeAccount;
      }

      // 押金收款开户行
      if (is.existy(pledgeBankName) && is.not.empty(pledgeBankName)) {
        params.pledge_payee_info.bank_details = pledgeBankName;
      }

      params.agent_payee_info = {};
      // 中介费收款人
      if (is.existy(agentPayee) && is.not.empty(agentPayee)) {
        params.agent_payee_info.card_name = agentPayee;
      }

      // 中介费收款账号
      if (is.existy(agentPayeeAccount) && is.not.empty(agentPayeeAccount)) {
        params.agent_payee_info.card_num = agentPayeeAccount;
      }

      // 中介费收款开户行
      if (is.existy(agentBankName) && is.not.empty(agentBankName)) {
        params.agent_payee_info.bank_details = agentBankName;
      }

      // 中介费 收款类型：对公 统一信用代码
      if (is.existy(mediumUnifiedCode) && is.not.empty(mediumUnifiedCode)) {
        params.agent_payee_info.credit_no = mediumUnifiedCode;
      }

      // 中介费 收款类型：对私 身份证号
      if (is.existy(mediumIdNumber) && is.not.empty(mediumIdNumber)) {
        params.agent_payee_info.id_card_no = mediumIdNumber;
      }

      // 中介费 收款类型
      if (is.existy(mediumPayMethod) && is.not.empty(mediumPayMethod)) {
        params.agent_payee_info.payment = mediumPayMethod;
      }

      // 存量模式
      if (is.existy(migrateFlag) && is.not.empty(migrateFlag)) {
        params.migrate_flag = !!migrateFlag;
      }

      // 原OA审批单号
      if (is.existy(migrateOaNote) && is.not.empty(migrateOaNote)) {
        params.migrate_oa_note = migrateOaNote;
      }

      // 合同有效期
      if (is.existy(contractDate) && is.not.empty(contractDate)) {
        const startDate = moment(contractDate[0]).format('YYYYMMDD');
        const endDate = moment(contractDate[1]).format('YYYYMMDD');

        params.contract_start_date = Number(startDate);
        params.contract_end_date = Number(endDate);
      }

      // 面积
      if (is.existy(area) && is.not.empty(area)) {
        params.area = `${area}`;
      }

      // 付款周期
      if (is.existy(periodMonthNum) && is.not.empty(periodMonthNum)) {
        params.period_month_num = Number(periodMonthNum);
      }

      // 提前付款天数
      if (is.existy(schedulePrepareDays) && is.not.empty(schedulePrepareDays)) {
        params.schedule_prepare_days = Number(schedulePrepareDays);
      }

      // 月租金
      if (is.existy(monthMoney) && is.not.empty(monthMoney)) {
        params.month_money = Unit.exchangePriceToCent(monthMoney);
      }

      // 已付租金
      if (is.existy(initPaidMoney) && is.not.empty(initPaidMoney)) {
        params.init_paid_money = Unit.exchangePriceToCent(initPaidMoney);
      }

      // 已付月数
      if (is.existy(initPaidMonthNum) && is.not.empty(initPaidMonthNum)) {
        params.init_paid_month_num = Number(initPaidMonthNum);
      }

      // 附件
      if (is.existy(attachments) && is.not.empty(attachments)) {
        params.attachments = attachments;
      }

      // 押金
      if (is.existy(pledgeMoney) && is.not.empty(pledgeMoney)) {
        params.pledge_money = Unit.exchangePriceToCent(pledgeMoney);
      }

      // 中介费
      if (is.existy(agentMoney) && is.not.empty(agentMoney)) {
        params.agent_money = Unit.exchangePriceToCent(agentMoney);
      }

      // 房屋地址
      if (is.existy(address) && is.not.empty(address)) {
        params.house_address = address;
      }

      // 房东姓名
      if (is.existy(landlordName) && is.not.empty(landlordName)) {
        params.landlord_name = landlordName;
      }

      // 付款方式（押金）
      if ((is.existy(paymentMethod.betting) && is.not.empty(paymentMethod.betting)) || paymentMethod.betting === 0) {
        params.payment_method_pledge = paymentMethod.betting;
      }

      // 付款方式（租金）
      if (is.existy(paymentMethod.pay) && is.not.empty(paymentMethod.pay)) {
        params.payment_method_rent = paymentMethod.pay;
      }

      // 未分摊金额
      if (is.existy(noApportionMoney) && is.not.empty(noApportionMoney)) {
        params.last_allocation_money = Unit.exchangePriceToCent(noApportionMoney);
      }

      // 未分摊时间段（开始时间）
      if (is.existy(allocationStart) && is.not.empty(allocationStart)) {
        params.allocation_start_date = Number(allocationStart);
      }

      // 未分摊时间段（结束时间）
      if (is.existy(allocationEnd) && is.not.empty(allocationEnd)) {
        params.allocation_end_date = Number(allocationEnd);
      }

      // 已分摊时间
      if (is.existy(noApportionDate) && is.not.empty(noApportionDate)) {
        params.allocation_end_date = Number(moment(noApportionDate).format('YYYYMMDD'));
      }

      // 房屋来源
      if (is.existy(source) && is.not.empty(source)) {
        params.house_source = source;
      }

      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result._id) && is.not.empty(result._id);
      };

      const request = {
        params: { record: params }, // 接口参数
        service: createHouseContract,  // 接口
        onVerifyCallback, // 验证返回数据的回调
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 编辑房屋合同
     * @param {string}  migrateFlag 存量合同录入模式
     * @param {string}  migrateOaNote 原OA审批单号
     * @param {string}  contractDate 合同租期
     * @param {string}  area 面积
     * @param {number}  periodMonthNum 付款周期
     * @param {number}  schedulePrepareDays 提前付款天数
     * @param {number}  monthMoney    月租金
     * @param {number}  initPaidMoney  已支付租金金额
     * @param {number}  initPaidMonthNum 已支付租金月数
     * @param {array}  attachments 附件
     * @param {number}  pledgeMoney 押金金额
     * @param {number}  agentMoney    中介费
     * @param {number}  rentInvoiceFlag  租金是否开票
     * @param {number}  agentInvoiceFlag 中介费是否开票
     * @param {number}  pledgeInvoiceFlag 押金是否开票
     * @param {number}  note 备注
     * @param {number}  costCenterType 成本中心
     * @param {string}  usage 用途
     * @param {string}  rentAccountingId  租金科目
     * @param {string}  pledgeAccountingId 押金科目
     * @param {string}  agentAccountingId 中介费科目
     * @param {object}  expense 分担信息
     * @param {string}  platformCode 平台id（唯一
     * @param {string}  id 合同id
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * updateHouseContract({ payload = {} }, { put }) {
      const {
        migrateFlag,          // 存量合同录入模式
        migrateOaNote,        // 原OA审批单号
        contractDate,         // 合同租期
        area,                 // 面积
        periodMonthNum,       // 付款周期
        schedulePrepareDays,      // 提前付款天数
        monthMoney,           // 月租金
        initPaidMoney,        // 已支付租金金额
        initPaidMonthNum,     // 已支付租金月数
        attachments,          // 附件
        pledgeMoney,          // 押金金额
        agentMoney,           // 中介费
        rentInvoiceFlag,      // 租金是否开票
        agentInvoiceFlag,     // 中介费是否开票
        pledgeInvoiceFlag,    // 押金是否开票
        pledgePayee, // 押金收款人
        pledgePayeeAccount, // 押金收款账户
        pledgeBankName, // 押金开户行
        rentPayee, // 租金收款人
        rentPayeeAccount, // 租金收款账户
        rentBankName, // 租金开户行
        agentPayee, // 中介费收款人
        agentPayeeAccount, // 中介费收款账户
        agentBankName, // 中介费开户行
        note,                 // 备注
        costCenterType,       // 成本中心
        usage,                // 用途
        rentAccountingId,     // 租金科目
        pledgeAccountingId,   // 押金科目
        agentAccountingId,    // 中介费科目
        expense: {
          costItems,          // 分摊信息
        },
        platformCode,         // 平台id（唯一）
        id,                   // 合同id
        invoiceTitle,         // 发票抬头
        rentInvoiceTitle,     // 租金发票抬头
        pledgeInvoiceTitle,   // 押金发票抬头
        agentInvoiceTitle,    // 中介费发票抬头
        address,              // 房屋地址
        landlordName,         // 房东姓名
        paymentMethod,        // 付款方式
        noApportionMoney,     // 未分摊金额
        noApportionTime,      // 未分摊时间段
        noApportionDate,      // 已分摊时间
        source,               // 房屋来源
        mediumUnifiedCode, // 中介费 收款类型：对公 统一信用代码
        mediumIdNumber,    // 中介费 收款类型：对私 身份证号
        UnifiedCode,       // 租金收款类型：对公 统一信用代码
        idNumber,           // 租金收款类型：对私 身份证号
        payMethod,          // 租金收款类型
        mediumPayMethod,    // 中介费 收款类型
      } = payload.param;

      // 处理未分摊时间段
      // 开始时间
      const allocationStart = dot.has(noApportionTime, '0') ? moment(noApportionTime[0]).format('YYYYMMDD') : '';
      // 结束时间
      const allocationEnd = dot.has(noApportionTime, '0') ? moment(noApportionTime[1]).format('YYYYMMDD') : '';
      const params = {
        record: {
          storage_type: 3, // 上传文件的类型
        },
      };

      // 合同id
      if (is.existy(id) && is.not.empty(id)) {
        params.id = id;
      } else {
        message.error('没有合同id');
      }

      // 平台id
      if (is.existy(platformCode) && is.not.empty(platformCode)) {
        params.record.platform_code = platformCode;
      }

      // 发票抬头
      if (is.existy(invoiceTitle) && is.not.empty(invoiceTitle)) {
        params.record.invoice_title = invoiceTitle;
      }

      // 租金发票抬头
      if (is.existy(rentInvoiceTitle) && is.not.empty(rentInvoiceTitle)) {
        params.record.rent_invoice_title = rentInvoiceTitle;
      }

      // 押金发票抬头
      if (is.existy(pledgeInvoiceTitle) && is.not.empty(pledgeInvoiceTitle)) {
        params.record.pledge_invoice_title = pledgeInvoiceTitle;
      }

      // 中介费发票抬头
      if (is.existy(agentInvoiceTitle) && is.not.empty(agentInvoiceTitle)) {
        params.record.agent_invoice_title = agentInvoiceTitle;
      }

      // 分摊信息
      params.record.cost_allocations = costItems.map((v) => {
        const ret = {};
        const { platform, vendor, city, district } = v;
        if (is.existy(platform)) {
          if (is.not.empty(platform)) {
            ret.platform_code = platform;
          } else {
            message.error('分摊信息平台未选择');
          }
        }
        if (is.existy(vendor)) {
          if (is.not.empty(vendor)) {
            ret.supplier_id = vendor;
          } else {
            message.error('分摊信息供应商未选择');
          }
        }
        if (is.existy(city)) {
          if (is.not.empty(city)) {
            ret.city_code = city;
          } else {
            message.error('分摊信息城市未选择');
          }
        }
        if (is.existy(district)) {
          if (is.not.empty(district)) {
            ret.biz_district_id = district;
          } else {
            message.error('分摊信息商圈未选择');
          }
        }
        return ret;
      });

      // 租金科目
      if (is.existy(rentAccountingId) && is.not.empty(rentAccountingId)) {
        params.record.rent_accounting_id = rentAccountingId;
      }

      // 押金科目
      if (is.existy(pledgeAccountingId) && is.not.empty(pledgeAccountingId)) {
        params.record.pledge_accounting_id = pledgeAccountingId;
      }

      // 中介费科目
      if (is.existy(agentAccountingId) && is.not.empty(agentAccountingId)) {
        params.record.agent_accounting_id = agentAccountingId;
      }

      // 用途
      if (is.existy(usage) && is.not.empty(usage)) {
        params.record.usage = usage;
      }

      // 成本中心
      if (is.existy(costCenterType) && is.not.empty(costCenterType)) {
        params.record.cost_center_type = Number(costCenterType);
      }

      // 备注
      if (is.existy(note) && is.not.empty(note)) {
        params.record.note = note;
      } else {
        params.record.note = '';
      }

      // 租金是否开票
      if (is.existy(rentInvoiceFlag) && is.not.empty(rentInvoiceFlag)) {
        params.record.rent_invoice_flag = !!Number(rentInvoiceFlag);
      }

      // 押金是否开票
      if (is.existy(pledgeInvoiceFlag) && is.not.empty(pledgeInvoiceFlag)) {
        params.record.pledge_invoice_flag = !!Number(pledgeInvoiceFlag);
      }

      // 中介费是否开票
      if (is.existy(agentInvoiceFlag) && is.not.empty(agentInvoiceFlag)) {
        params.record.agent_invoice_flag = !!Number(agentInvoiceFlag);
      }

      params.record.rent_payee_info = {};
      // 租金收款人
      if (is.existy(rentPayee) && is.not.empty(rentPayee)) {
        params.record.rent_payee_info.card_name = rentPayee;
      }

      // 租金收款账号
      if (is.existy(rentPayeeAccount) && is.not.empty(rentPayeeAccount)) {
        params.record.rent_payee_info.card_num = rentPayeeAccount;
      }

      // 租金收款开户行
      if (is.existy(rentBankName) && is.not.empty(rentBankName)) {
        params.record.rent_payee_info.bank_details = rentBankName;
      }

      // 租金收款类型：对公 统一信用代码
      if (is.existy(UnifiedCode) && is.not.empty(UnifiedCode)) {
        params.record.rent_payee_info.credit_no = UnifiedCode;
      }
      // 租金收款类型：对私 身份证号
      if (is.existy(idNumber) && is.not.empty(idNumber)) {
        params.record.rent_payee_info.id_card_no = idNumber;
      }
      // 租金收款类型
      if (is.existy(payMethod) && is.not.empty(payMethod)) {
        params.record.rent_payee_info.payment = payMethod;
      }

      params.record.pledge_payee_info = {};
      // 押金收款人
      if (is.existy(pledgePayee) && is.not.empty(pledgePayee)) {
        params.record.pledge_payee_info.card_name = pledgePayee;
      }

      // 押金收款账号
      if (is.existy(pledgePayeeAccount) && is.not.empty(pledgePayeeAccount)) {
        params.record.pledge_payee_info.card_num = pledgePayeeAccount;
      }

      // 押金收款开户行
      if (is.existy(pledgeBankName) && is.not.empty(pledgeBankName)) {
        params.record.pledge_payee_info.bank_details = pledgeBankName;
      }

      params.record.agent_payee_info = {};
      // 中介费收款人
      if (is.existy(agentPayee) && is.not.empty(agentPayee)) {
        params.record.agent_payee_info.card_name = agentPayee;
      }

      // 中介费收款账号
      if (is.existy(agentPayeeAccount) && is.not.empty(agentPayeeAccount)) {
        params.record.agent_payee_info.card_num = agentPayeeAccount;
      }

      // 中介费收款开户行
      if (is.existy(agentBankName) && is.not.empty(agentBankName)) {
        params.record.agent_payee_info.bank_details = agentBankName;
      }

      // 中介费 收款类型：对公 统一信用代码
      if (is.existy(mediumUnifiedCode) && is.not.empty(mediumUnifiedCode)) {
        params.record.agent_payee_info.credit_no = mediumUnifiedCode;
      }

      // 中介费 收款类型：对私 身份证号
      if (is.existy(mediumIdNumber) && is.not.empty(mediumIdNumber)) {
        params.record.agent_payee_info.id_card_no = mediumIdNumber;
      }

      // 中介费 收款类型
      if (is.existy(mediumPayMethod) && is.not.empty(mediumPayMethod)) {
        params.record.agent_payee_info.payment = mediumPayMethod;
      }

      // 存量模式
      if (is.existy(migrateFlag) && is.not.empty(migrateFlag)) {
        params.record.migrate_flag = !!migrateFlag;
      }

      // 原OA审批单号
      if (is.existy(migrateOaNote) && is.not.empty(migrateOaNote)) {
        params.record.migrate_oa_note = migrateOaNote;
      }

      // 合同有效期
      if (is.existy(contractDate) && is.not.empty(contractDate)) {
        params.record.contract_start_date = Number(moment(contractDate[0]).format('YYYYMMDD'));
        params.record.contract_end_date = Number(moment(contractDate[1]).format('YYYYMMDD'));
      }

      // 面积
      if (is.existy(area) && is.not.empty(area)) {
        params.record.area = `${area}`;
      }

      // 付款周期
      if (is.existy(periodMonthNum) && is.not.empty(periodMonthNum)) {
        params.record.period_month_num = Number(periodMonthNum);
      }

      // 提前付款天数
      if (is.existy(schedulePrepareDays) && is.not.empty(schedulePrepareDays)) {
        params.record.schedule_prepare_days = Number(schedulePrepareDays);
      }

      // 月租金
      if (is.existy(monthMoney) && is.not.empty(monthMoney)) {
        params.record.month_money = Unit.exchangePriceToCent(monthMoney);
      }

      // 已付租金
      if (is.existy(initPaidMoney) && is.not.empty(initPaidMoney)) {
        params.record.init_paid_money = Unit.exchangePriceToCent(initPaidMoney);
      }

      // 已付月数
      if (is.existy(initPaidMonthNum) && is.not.empty(initPaidMonthNum)) {
        params.record.init_paid_month_num = Number(initPaidMonthNum);
      }

      // 附件(必选, 若没有则传[])
      if (is.existy(attachments) && is.not.empty(attachments)) {
        params.record.attachments = attachments;
      } else {
        params.record.attachments = [];
      }

      // 押金
      if (is.existy(pledgeMoney) && is.not.empty(pledgeMoney)) {
        params.record.pledge_money = Unit.exchangePriceToCent(pledgeMoney);
      }

      // 中介费
      if (is.existy(agentMoney) && is.not.empty(agentMoney)) {
        params.record.agent_money = Unit.exchangePriceToCent(agentMoney);
      }

      // 房屋地址
      if (is.existy(address) && is.not.empty(address)) {
        params.record.house_address = address;
      }

      // 房东姓名
      if (is.existy(landlordName) && is.not.empty(landlordName)) {
        params.record.landlord_name = landlordName;
      }

      // 付款方式（押金）
      if (is.existy(paymentMethod.betting) && is.not.empty(paymentMethod.betting)) {
        params.record.payment_method_pledge = paymentMethod.betting;
      }

      // 付款方式（租金）
      if (is.existy(paymentMethod.pay) && is.not.empty(paymentMethod.pay)) {
        params.record.payment_method_rent = paymentMethod.pay;
      }

      // 未分摊金额
      if (is.existy(noApportionMoney) && is.not.empty(noApportionMoney)) {
        params.record.last_allocation_money = Unit.exchangePriceToCent(noApportionMoney);
      }

      // 未分摊时间段（开始时间）
      if (is.existy(allocationStart) && is.not.empty(allocationStart)) {
        params.record.allocation_start_date = Number(allocationStart);
      }

      // 未分摊时间段（结束时间）
      if (is.existy(allocationEnd) && is.not.empty(allocationEnd)) {
        params.record.allocation_end_date = Number(allocationEnd);
      }

      // 已分摊时间
      if (is.existy(noApportionDate) && is.not.empty(noApportionDate)) {
        params.record.allocation_end_date = Number(moment(noApportionDate).format('YYYYMMDD'));
      }

      // 房屋来源
      if (is.existy(source) && is.not.empty(source)) {
        params.record.house_source = source;
      }

      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };
      const request = {
        params, // 接口参数
        service: updateHouseContract,  // 接口
        onVerifyCallback, // 验证返回数据的回调
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 费用申请信息
     * @param {string}  contractDate 合同租期
     * @param {string}  area 面积
     * @param {number}  periodMonthNum 付款周期
     * @param {number}  initPaidMoney  已支付租金金额
     * @param {array}  attachments 附件
     * @param {number}  pledgeMoney 押金金额
     * @param {number}  agentMoney    中介费
     * @param {number}  rentInvoiceFlag  租金是否开票
     * @param {number}  agentInvoiceFlag 中介费是否开票
     * @param {number}  pledgeInvoiceFlag 押金是否开票
     * @param {string}  agentPayeeInfo 中介费收款信息
     * @param {string}  pledgePayeeInfo 押金收款信息
     * @param {number}  note 备注
     * @param {number}  costCenterType 成本中心
     * @param {string}  usage 用途
     * @param {string}  rentAccountingId  租金科目
     * @param {string}  pledgeAccountingId 押金科目
     * @param {string}  agentAccountingId 中介费科目
     * @param {object}  expense 分担信息
     * @param {string}  platformCode 平台id（唯一
     * @param {string}  id 合同id
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * costApplyContract({ payload = {} }, { put }) {
      const {
        id,
        agentPayeeInfo,
      } = payload.param;

      const params = {
        record: {},
      };

      // 合同id
      if (is.existy(id) && is.not.empty(id)) {
        params.id = id;
      } else {
        message.error('没有合同id');
      }

      params.record.agent_payee_info = {};
      // 中介费收款人
      if (is.existy(agentPayeeInfo.cardName) && is.not.empty(agentPayeeInfo.cardName)) {
        params.record.agent_payee_info.card_name = agentPayeeInfo.cardName;
      }

      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };

      const request = {
        params, // 接口参数
        service: costApplyContract,  // 接口
        onVerifyCallback, // 验证返回数据的回调
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取房屋合同详情
     * @todo 接口需升级优化
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * fetchHouseContractsDetail({ payload = {} }, { put, call }) {
      const { id } = payload;
      const params = {};

      if (is.not.existy(id) || is.empty(id)) {
        throw new Error('contract id is required');
      }

      params.id = id;

      const res = yield call(fetchHouseContractDetail, params);

      if (res === undefined) {
        message.error('获取数据失败');
        return;
      }

      yield put({
        type: 'reduceHouseContractDetail',
        payload: res,
      });
    },

    /**
     * 获取删除房屋合同
     * @todo 接口需升级优化
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * fetchHouseContractDelete({ payload = {} }, { put }) {
      const { id } = payload.params;
      const params = {};
      if (is.not.existy(id) || is.empty(id)) {
        throw new Error('contract id is required');
      }
      params.id = id;
      const request = {
        params, // 接口参数
        service: fetchHouseContractDelete,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },
    /**
     * 获取房屋合同列表
     * @param {number}  state  状态
     * @param {string}  contractnum 合同编号
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   city    城市
     * @param {array}   districts  商圈
     * @param {number}  state 状态
     * @param {string}  name  姓名
     * @param {string}  phone  手机号
     * @param {string}  positions  职位
     * @param {number} type 工号种类
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * fetchHouseContracts({ payload = {} }, { put, call }) {
      const params = dealWithData(payload);

      const result = yield call(fetchHouseContracts, params);

      if (result === undefined) {
        message.error('获取数据失败');
        return;
      }

      yield put({ type: 'reduceHouseContractData', payload: result });
    },

    /**
     * 创建续租/断组/退租/退押金审批单
     * @param {string}  id 获取合同ID
     * @param {string}  close 退租
     * @param {string}  positions  职位
     * @param {string}  breaks 断租
     * @param {string}  returnrentmoney 退回的租金（分）
     * @param {string}  update 修改的时间
     * @param {string}  returnpledgemoney 退回押金
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * createApprovalSheet({ payload = {} }, { put }) {
      const {
         id,     // 获取合同ID
         rent,   // 获取续租
         close,  // 退租
         breaks, // 断租
         pledge, // 退押金
         update, // 修改的时间
         returnrentmoney, // 退回的租金（分）
         returnpledgemoney, // 退回押金
       } = payload.params;
      const params = {};
      if (is.existy(id) && is.not.empty(id)) {
        params.id = id;
      }
      if (is.existy(rent) && is.not.empty(rent)) {
        params.action = rent;
      }
      if (is.existy(close) && is.not.empty(close)) {
        params.action = close;
      }
      if (is.existy(breaks) && is.not.empty(breaks)) {
        params.action = breaks;
      }

      // 房屋退押金
      if (is.existy(pledge) && is.not.empty(pledge)) {
        params.action = pledge;
      }

      if (is.existy(update) && is.not.empty(update)) {
        params.break_date = update;
      }
      if (is.existy(returnrentmoney) && is.not.empty(returnrentmoney)) {
        params.return_rent_money = returnrentmoney;
      }
      if (is.existy(returnpledgemoney) && is.not.empty(returnpledgemoney)) {
        params.return_pledge_money = returnpledgemoney;
      }

      const request = {
        params, // 接口参数
        service: createFlowByContract,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({
        type: 'applicationCore/requestWithCallback',
        payload: request,
      });
    },

    /**
     * 创建新租审批单
     * @param {string}  id 获取合同ID
     * @param {string}  rentStartDate, // 开始时间
     * @param {string}  rentEndDate, // 结束时间
     * @param {number}  houseMoney, // 房屋租金
     * @param {string}  rentInvoiceFlag, // 租金是否开票
     * @param {number}  rentTax,    // 租金税金
     * @param {string}  rentPayeeName, // 房租收款人
     * @param {string}  rentPayeeNum, // 收款账号
     * @param {string}  rentPayeeBankDetails, // 开户支行
     * @param {number}  pledgeMoney,  // 押金金额
     * @param {string}  pledgePayeeName, // 押金收款人
     * @param {string}  pledgePayeeNum, // 押金收款账号
     * @param {string}  pledgePayeeBankDetails, // 押金开户支行
     * @param {nbmber}  agentMoney, // 费用金额
     * @param {string}  agentInvoiceFlag, // 中介费是否开票
     * @param {number}  agentPayeeTax, // 中介费税金
     * @param {string}  agentPayeeName, // 中介收款人
     * @param {string}  agentPayeeNum, // 中介收款人
     * @param {string}  agentPayeeBankDetails, // 中介开户支行
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * createInitApplicationOrder({ payload = {} }, { put }) {
      const {
          id, // 获取合同id
          rentStartDate, // 开始时间
          rentEndDate, // 结束时间
          houseMoney, // 房屋租金
          rentInvoiceFlag, // 租金是否开票
          rentTax,    // 租金税金
          rentPayeeName, // 房租收款人
          rentPayeeNum, // 收款账号
          rentPayeeBankDetails, // 开户支行
          pledgeMoney,  // 押金金额
          pledgePayeeName, // 押金收款人
          pledgePayeeNum, // 押金收款账号
          pledgePayeeBankDetails, // 押金开户支行
          agentMoney, // 费用金额
          agentInvoiceFlag, // 中介费是否开票
          agentPayeeTax, // 中介费税金
          agentPayeeName, // 中介收款人
          agentPayeeNum, // 中介收款人
          agentPayeeBankDetails, // 中介开户支行
          mediumIdNumber, // 中介信息 身份证号
          mediumUnifiedCode, // 中介信息 身份证号
          UnifiedCode, // 租金信息 统一信用代码
          idNumber,   // 租金信息 身份证号
          payMethod, // 租金信息 收款类型
          mediumPayMethod,  // 中介信息 收款类型
        } = payload.params;

      const params = {};
      // 合同id
      if (is.existy(id) && is.not.empty(id)) {
        params.id = id;
      }
      // 租金开始时间
      if (is.existy(rentStartDate) && is.not.empty(rentStartDate)) {
        params.rent_cycle_start_at = rentStartDate;
      }
      // 租金结束时间
      if (is.existy(rentEndDate) && is.not.empty(rentEndDate)) {
        params.rent_cycle_end_at = rentEndDate;
      }
      // 房屋租金
      if (is.existy(houseMoney) && is.not.empty(houseMoney)) {
        params.rent_money = houseMoney * 100;
      }
      // 租金是否开票
      if (is.existy(rentInvoiceFlag) && is.not.empty(rentInvoiceFlag)) {
        params.rent_invoice_flag = !!Number(rentInvoiceFlag);
      }
      // 租金税金
      if (is.existy(rentTax) && is.not.empty(rentTax)) {
        params.rent_tax = Number(rentTax) * 100;
      }
      // 租金收款人姓名
      if (is.existy(rentPayeeName) && is.not.empty(rentPayeeName)) {
        params.rent_payee_name = rentPayeeName;
      }
      // 租金收款人账号
      if (is.existy(rentPayeeNum) && is.not.empty(rentPayeeNum)) {
        params.rent_payee_num = rentPayeeNum;
      }
      // 租金收款人地址
      if (is.existy(rentPayeeBankDetails) && is.not.empty(rentPayeeBankDetails)) {
        params.rent_payee_bank_details = rentPayeeBankDetails;
      }
      // 租金信息 统一信用代码
      if (is.existy(UnifiedCode) && is.not.empty(UnifiedCode)) {
        params.rent_payee_credit_no = UnifiedCode;
      }
       // 租金信息 身份证号
      if (is.existy(idNumber) && is.not.empty(idNumber)) {
        params.rent_payee_id_card_no = idNumber;
      }

       // 租金信息 收款类型
      if (is.existy(payMethod) && is.not.empty(payMethod)) {
        params.rent_payee_payment = payMethod;
      }


      // 押金金额
      if (is.existy(pledgeMoney) && is.not.empty(pledgeMoney)) {
        params.pledge_money = pledgeMoney * 100;
      }
      // 押金收款人
      if (is.existy(pledgePayeeName) && is.not.empty(pledgePayeeName)) {
        params.pledge_payee_name = pledgePayeeName;
      }
      // 押金收款人账号
      if (is.existy(pledgePayeeNum) && is.not.empty(pledgePayeeNum)) {
        params.pledge_payee_num = pledgePayeeNum;
      }
      // 押金开户支行
      if (is.existy(pledgePayeeBankDetails) && is.not.empty(pledgePayeeBankDetails)) {
        params.pledge_payee_bank_details = pledgePayeeBankDetails;
      }
      // 费用金额
      if (is.existy(agentMoney) && is.not.empty(agentMoney)) {
        params.agent_money = agentMoney * 100;
      }
      // 是否开票
      if (is.existy(agentInvoiceFlag) && is.not.empty(agentInvoiceFlag)) {
        params.agent_invoice_flag = !!Number(agentInvoiceFlag);
      }
      // 税金
      if (is.existy(agentPayeeTax) && is.not.empty(agentPayeeTax)) {
        params.agent_payee_tax = Number(agentPayeeTax);
      }
      // 中介收款人
      if (is.existy(agentPayeeName) && is.not.empty(agentPayeeName)) {
        params.agent_payee_name = agentPayeeName;
      }
      // 中介收款账号
      if (is.existy(agentPayeeNum) && is.not.empty(agentPayeeNum)) {
        params.agent_payee_num = agentPayeeNum;
      }
      // 中介开户支行
      if (is.existy(agentPayeeBankDetails) && is.not.empty(agentPayeeBankDetails)) {
        params.agent_payee_bank_details = agentPayeeBankDetails;
      }
       // 中介信息 身份证号
      if (is.existy(mediumIdNumber) && is.not.empty(mediumIdNumber)) {
        params.agent_payee_id_card_no = mediumIdNumber;
      }

       // 中介信息 统一信用代码
      if (is.existy(mediumUnifiedCode) && is.not.empty(mediumUnifiedCode)) {
        params.agent_payee_credit_no = mediumUnifiedCode;
      }

       // 中介信息 收款类型
      if (is.existy(mediumPayMethod) && is.not.empty(mediumPayMethod)) {
        params.agent_payee_payment = mediumPayMethod;
      }


      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };

      const request = {
        params, // 接口参数
        onVerifyCallback,
        service: getNewGroupApprovaList, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取科目详情
     * @param {string}  id 科目id
     * @param {function} onSuccessCallback  成功回调
     * @param {function} onFailureCallback  失败回调
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * fetchSubjectsDetail({ payload = {} }, { call, put }) {
      const { param, namespace } = payload;
      if (is.empty(param.id) || is.not.existy(param.id)) {
        return message.error('科目id不能为空');
      }
      const params = {
        id: param.id, // 科目id
      };
      const result = yield call(fetchSubjectsDetail, params);
      yield put({
        type: 'reduceSubjectsDetail',
        payload: { namespace, result },
      });
    },

    /**
     * 清空科目详情
     * @todo 接口需升级优化
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * resetSubjectsDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceResetSubjectsDetail' });
    },

    /**
     * 房屋续签
     * @param {string} id 房屋合同id
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * fetchHouseRenew({ payload = {} }, { put }) {
      const {
          id, // 获取合同id
        } = payload.params;

      const params = {
        renewal: true,
      };

      if (is.existy(id) && is.not.empty(id)) {
        params.id = id;
      }

      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };

      const request = {
        params, // 接口参数
        onVerifyCallback,
        service: fetchHouseRenew, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 房屋续租
     * @param {string} id 房屋合同id
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * createExpenseHouseRenewal({ payload = {} }, { put }) {
      const {
        action,
        id, // 获取合同id
        contractStartDate, // 租金期间开始时间
        contractEndDate, // 租金期间结束时间
        rentMoney, // 房屋租金
        rentInvoiceFlag, // 是否开票
        rentPayeeName, // 收款账户
        rentPayeeNum, // 收款账户
        rentPayeeBankDetails, // 开户支行
        depositRent, // 押金转租金
        flag, // 是否显示押金转租金
      } = payload.params;

      const params = {
        action,
        id,
        rent_cycle_start_at: contractStartDate,
        rent_cycle_end_at: contractEndDate,
        rent_money: rentMoney * 100,
        rent_invoice_flag: Boolean(rentInvoiceFlag),
        rent_payee_name: rentPayeeName,
        rent_payee_num: rentPayeeNum,
        rent_payee_bank_details: rentPayeeBankDetails,
      };
      // 押金转租金
      if (is.not.empty(depositRent) && is.existy(depositRent) && flag === true) {
        params.pledge_money_to_rent_money = depositRent * 100;
      }

      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };

      const request = {
        params, // 接口参数
        onVerifyCallback,
        service: createFlowByContract, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 房屋退租
     * @param {string} id 房屋合同id
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * createExpenseHouseWithdrawal({ payload = {} }, { put }) {
      const {
        action,
        id, // 获取合同id
        returnPledgeMoney, // 退回押金
        breakDate, // 退租时间
      } = payload.params;

      const params = {
        action,
        id,
        break_date: Number(moment(breakDate).format('YYYYMMDD')),
        return_pledge_money: returnPledgeMoney * 100,
        return_rent_money: 0, // 退回的租金（默认为0）
      };

      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };

      const request = {
        params, // 接口参数
        onVerifyCallback,
        service: createFlowByContract, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 房屋断租
     * @param {string} id 房屋合同id
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * createExpenseHouseBrokRent({ payload = {} }, { put }) {
      const {
        action,
        id, // 获取合同id
        returnPledgeMoney, // 退回押金
        returnRentMoney, // 退回租金
        updateTime, // 断租时间
      } = payload.params;

      // 参数
      const params = {
        action,
        id,
        return_pledge_money: returnPledgeMoney * 100,
        return_rent_money: returnRentMoney * 100,
        break_date: Number(moment(updateTime).format('YYYYMMDD')),
      };

      // 自定义校验
      const onVerifyCallback = (result) => {
        return is.existy(result.ok) && result.ok === true;
      };

      const request = {
        params, // 接口参数
        onVerifyCallback,
        service: createFlowByContract, // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };

      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取房屋台账
     * @todo 接口需升级优化
     * @memberof module:model/expense/houseContract~expense/houseContract/effects
     */
    * fetchHouseAccount({ payload = {} }, { put, call }) {
      const { id } = payload;
      const params = {
        _meta: RequestMeta.mapper(payload),
        belong_time: Number(moment().format('YYYYMMDD')),
      };

      if (is.not.existy(id) || is.empty(id)) {
        throw new Error('contract id is required');
      }

      params.id = id;

      const res = yield call(fetchHouseAccount, params);

      if (res === undefined) {
        message.error('获取数据失败');
        return;
      }

      yield put({
        type: 'reduceHouseAccount',
        payload: res,
      });
    },

    /**
     * 房屋台账导出
     */
    * exportHouseLedger({ payload = {} }, { call }) {
      const params = {};
        // 获取平台
      if (is.not.empty(payload.platforms) && is.existy(payload.platforms)) {
        params.platform_codes = payload.platforms;
      }

        // 获取商圈
      if (is.not.empty(payload.districts) && is.existy(payload.districts)) {
        params.biz_district_ids = payload.districts;
      }

        // 获取供应商
      if (is.not.empty(payload.suppliers) && is.existy(payload.suppliers)) {
        params.supplier_ids = payload.suppliers;
      }

        // 获取城市
      if (is.not.empty(payload.cities) && is.existy(payload.cities)) {
        params.city_codes = payload.cities;
      }

        // 导出台账日期
      if (is.not.empty(payload.exportDate) && is.existy(payload.exportDate)) {
        params.export_date = Number(moment(payload.exportDate).format('YYYYMM'));
      }
      const {
        onSuccessCallback, // 成功回调
      } = payload;

      const result = yield call(exportHouseLedger, params);

      if (result && result.ok) {
        onSuccessCallback && onSuccessCallback();
      }
    },

  },
   /**
   * @namespace expense/houseContract/reducers
   */
  reducers: {
     /**
     * 获取房屋合同列表
     * @returns {object} 更新 houseContractData
     * @memberof module:model/expense/houseContract~expense/houseContract/reducers
     */
    reduceHouseContractData(state, action) {
      const houseContractData = {
        meta: ResponseMeta.mapper(action.payload._meta),
        data: HouseContractListItem.mapperEach(action.payload.data, HouseContractListItem),
      };
      return { ...state, houseContractData };
    },

    // 获取房屋合同详情
    reduceHouseContractDetail(state, action) {
      let houseContractDetail = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        houseContractDetail = HouseContractDetail.mapper(action.payload, HouseContractDetail);
      }
      return { ...state, houseContractDetail };
    },

    // 获取科目详情
    reduceSubjectsDetail(state, action) {
      const { namespace, result } = action.payload;
      const subjectsDetail = CostAccountingDetail.mapper(result, CostAccountingDetail);
      return { ...state,
        subjectsDetail: {
          ...state.subjectsDetail,
          [namespace]: subjectsDetail,
        },
      };
    },
    // 清空科目详情
    reduceResetSubjectsDetail(state) {
      return { ...state, subjectsDetail: {} };
    },
    // 获取新租审批单数据
    // TODO: 确定, 可删除
    createNewGroupApprovalList(state, action) {
      const newleasepAprovalInfo = OaHouseContract.mapper(action.payload, OaHouseContract);
      return { ...state, newleasepAprovalInfo };
    },

    /**
     * 更新房屋台账
     * @returns {object} 更新 houseContractData
     * @memberof module:model/expense/houseContract~expense/houseContract/reducers
     */
    reduceHouseAccount(state, action) {
      let houseAccout = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        houseAccout = {
          meta: ResponseMeta.mapper(action.payload._meta),
          data: action.payload.data,
        };
      }
      return { ...state, houseAccout };
    },
  },
};
