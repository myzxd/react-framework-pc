/**
 * 费用单
 * @module model/expense/costOrder
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["_meta", "_id"] }]*/
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { message } from 'antd';

import {
  fetchCostOrders, // 获取费用单
  fetchCostOrderDetail, // 获取费用单详情
  createCostOrder, // 创建费用单
  updateCostOrder, // 编辑费用单
  updatePluginAdjustCostMoney, // 更新外部审批费用单
  deleteCostOrder,
  fetchAmountSummary, // 获取费用金额汇总
  fetchSubmitSummary,
  fetchCostOrderExport,
  fetchOriginalCostOrder,
  fetchSubjectBelong,
  fetchCollection,
  getCostInvoiceHeader,
} from '../../services/expense/costOrder';

import { RequestMeta, ResponseMeta, CostOrderListItem, CostOrderDetail, CostBookMonthbrief, CostOrderSubmitBrief } from '../../application/object/';
import { Unit, ExpenseCostOrderState, PayModeEnumer } from '../../application/define';

// 费用单
const mapperData = (payloads) => {
  // 将原数据深拷贝一份，避免提交的时候要修改数据，会影响到原始数据（如：分摊金额 * 100）
  const payload = JSON.parse(JSON.stringify(payloads));
  const params = {
    invoice_flag: payload.hasInvoice, // 是否开发票
    storage_type: payload.storage_type, // 上传文件的类型
  };

  // 科目id（非费用单科目）
  if (is.existy(payload.subject) && !is.empty(payload.subject)) {
    params.cost_accounting_id = payload.subject;
  }

  // 费用分组ID
  if (is.existy(payload.expenseType) && !is.empty(payload.expenseType)) {
    params.cost_group_id = payload.expenseType;
  }
  // 成本中心
  if (is.existy(payload.expense) && !is.empty(payload.expense)) {
    if (is.existy(payload.expense.costCenter) && !is.empty(payload.expense.costCenter)) {
      params.cost_center_type = Number(payload.expense.costCenter);
    }
  }
  // 成本中心
  if (is.existy(payload.expense) && !is.empty(payload.expense)) {
    if (is.existy(payload.expense.selectedCostCenterType) && !is.empty(payload.expense.selectedCostCenterType)) {
      params.cost_center_type = Number(payload.expense.selectedCostCenterType);
    }
  }

  // 新增成本归属
  if (is.existy(payload.costCenterType) && is.not.empty(payload.costCenterType)) {
    params.cost_center_type = Number(payload.costCenterType);
  }

  // 科目id（费用单科目）
  if (is.existy(payload.subject) && !is.empty(payload.subject)) {
    // 科目id
    if (is.existy(payload.subject.subjectId) && !is.empty(payload.subject.subjectId)) {
      params.cost_accounting_id = payload.subject.subjectId;
    }
    // 成本归属
    if (is.existy(payload.subject.costAttribution) && !is.empty(payload.subject.costAttribution)) {
      params.cost_center_type = payload.subject.costAttribution;
    }
  }

  // 申请金额
  if ((is.existy(payload.money) && !is.empty(payload.money)) || payload.money === 0) {
    params.total_money = Unit.exchangePriceToCent(payload.money);
  }
  // 分摊模式 6平均分摊 8自定义分摊
  if (is.existy(payload.expense) && !is.empty(payload.expense)) {
    if (is.existy(payload.expense.costBelong) && !is.empty(payload.expense.costBelong)) {
      params.allocation_mode = parseFloat(payload.expense.costBelong);
    }
  }
  // 分摊明细
  if (is.existy(payload.expense) && !is.empty(payload.expense)) {
    if (is.existy(payload.expense.costItems) && !is.empty(payload.expense.costItems)) {
      const costItems = [];
        // 因为收款信息可以有多条所以是数组先循环
      payload.expense.costItems.forEach((itemParam) => {
        const item = itemParam;
        // 项目信息转换
        const mapperKeys = {
          vendor: 'supplier_id',        // 供应商id
          platform: 'platform_code',    // 平台
          city: 'city_code',            // 城市
          district: 'biz_district_id',  // 商圈
          teamId: 'team_id', // 团队id
          teamType: 'team_type', // 团队类型
          teamName: 'team_name', // 团队姓名
          teamIdCode: 'team_id_code', // 团队身份证号
          staffId: 'identity_card_id', // 人员id
          costCount: 'money',           // 分摊金额
          jobId: 'job_id',           // 团队信息
          teamStaffId: 'profile_id',  // staff_id
          departmentTeamName: 'team_name',
          departmentCode: 'team_id_code',
        };
        if (item.costCount) {
          item.costCount = Unit.exchangePriceToCent(item.costCount);
        }
        const costItem = {};
        Object.keys(item).forEach((key) => {
          // 遍历属性，排除原型链
          if (is.existy(mapperKeys[key]) && is.not.empty(mapperKeys[key]) && is.existy(item[key]) && is.not.empty(item[key])) {
            dot.set(costItem, mapperKeys[key], item[key]);
          }
        });
        costItems.push(costItem);
      });
      params.cost_allocation = costItems;
    }
  }

  // 发票抬头
  if (is.existy(payload.invoiceTitle) && !is.empty(payload.invoiceTitle)) {
    params.invoice_title = payload.invoiceTitle;
  }

  // // 租金发票抬头
  // if (is.existy(payload.rentInvoiceTitle) && !is.empty(payload.rentInvoiceTitle)) {
  //   params.rent_invoice_title = payload.rentInvoiceTitle;
  // }

  // // 押金发票抬头
  // if (is.existy(payload.pledgeInvoiceTitle) && !is.empty(payload.pledgeInvoiceTitle)) {
  //   params.pledge_invoice_title = payload.pledgeInvoiceTitle;
  // }

  // // 中介费发票抬头
  // if (is.existy(payload.agentInvoiceTitle) && !is.empty(payload.agentInvoiceTitle)) {
  //   params.agent_invoice_title = payload.agentInvoiceTitle;
  // }


  // 收款人列表
  if (is.existy(payload.bankList) && !is.empty(payload.bankList)) {
    params.payee_list = payload.bankList.map((v) => {
      const item = {
        card_name: String(v.card_name).replace(/\s*/g, ''),       // 收款人姓名
        card_num: v.card_num,         // 收款人卡号
        bank_details: v.bank_details, // 开户行
        payee_type: v.payee_type,     // 收款方式
        money: Unit.exchangePriceToCent(v.money),               // 金额
        payee_employee_id: v.payee_employee_id,                   // 档案id

      };
      // 手机号
      if (is.existy(v.card_phone) && !is.empty(v.card_phone)) {
        item.card_phone = v.card_phone;
      }
      if (is.existy(v.payment) && is.not.empty(v.payment)) {
        item.payment = v.payment;
      }
      if (is.existy(v.payment) && v.payment === PayModeEnumer.credit) {
        item.credit_no = v.credit_no;
      }
      if (is.existy(v.payment) && v.payment === PayModeEnumer.idCard) {
        item.id_card_no = v.id_card_no;
      }
      return item;
    });
  }

  // 文件列表
  if (is.existy(payload.fileList) && !is.empty(payload.fileList)) {
    params.attachments = payload.fileList;
  } else {
    params.attachments = [];
  }

  // 备注
  if (is.existy(payload.note) && !is.empty(payload.note)) {
    params.note = payload.note;
  }

  // 费用单单号（编辑使用）
  if (is.existy(payload.recordId) && !is.empty(payload.recordId)) {
    params.id = payload.recordId;
  }

  // 房屋编号 (提交房屋信息使用) TODO: @曹毅 @郭庆 预留字段
  if (is.existy(payload.uniqueHouseNum) && !is.empty(payload.uniqueHouseNum)) {
    params.house_num = payload.uniqueHouseNum;
  }
  // 差旅费用明细
  if (is.existy(payload.bizExtraData) && is.not.empty(payload.bizExtraData)) {
    params.biz_extra_data = payload.bizExtraData;
  }
  // 出差申请单id
  if (is.existy(payload.bizExtraTravelApplyOrderId) && is.not.empty(payload.bizExtraTravelApplyOrderId)) {
    params.biz_extra_travel_apply_order_id = payload.bizExtraTravelApplyOrderId;
  }
  // 出差实际开始时间
  if (is.existy(payload.actualStartAt) && is.not.empty(payload.actualStartAt)) {
    params.actual_start_at = payload.actualStartAt;
  }
  // 出差实际结束时间
  if (is.existy(payload.actualDoneAt) && is.not.empty(payload.actualDoneAt)) {
    params.actual_done_at = payload.actualDoneAt;
  }
  // 实际出差时间(相差x天)
  if (is.existy(payload.actualApplyDays) && is.not.empty(payload.actualApplyDays)) {
    params.actual_apply_days = payload.actualApplyDays;
  }
  return params;
};

// 退款
const mapperRefundData = (payloads) => {
  // 将原数据深拷贝一份，避免提交的时候要修改数据，会影响到原始数据（如：分摊金额 * 100）
  const payload = JSON.parse(JSON.stringify(payloads));

  // 原费用单信息
  const params = {
    invoice_flag: payload.invoiceFlag, // 是否开发票
    cost_group_id: payload.costGroupId, // 费用分组id
    cost_accounting_id: payload.costAccountingId, // 科目id
    cost_center_type: payload.costCenterType, // 成本中心
    total_money: payload.totalMoney, // 金额
    invoice_title: payload.invoiceTitle, // 发票抬头
    // note: payload.note, // 备注
    id: payload.id, // 费用单id
    payee_info: {
      card_name: String(payload.payee).replace(/\s*/g, ''),       // 收款人姓名
      card_num: payload.payeeAccount, // 收款人卡号
      bank_details: payload.bankName, // 开户行
    },
  };

  // 退款说明
  if (is.existy(payload.description) && is.not.empty(payload.description)) {
    params.note = payload.description;
  }

  // 文件列表
  if (is.existy(payload.fileList) && !is.empty(payload.fileList)) {
    params.attachments = payload.fileList;
  } else {
    params.attachments = [];
  }

  // 分摊模式 6平均分摊 8自定义分摊
  if (is.existy(payload.expense) && !is.empty(payload.expense)) {
    if (is.existy(payload.expense.costBelong) && !is.empty(payload.expense.costBelong)) {
      params.allocation_mode = parseFloat(payload.expense.costBelong);
    }
  }

  // 分摊明细
  if (is.existy(payload.expense) && !is.empty(payload.expense)) {
    if (is.existy(payload.expense.costItems) && !is.empty(payload.expense.costItems)) {
      const costItems = [];
        // 因为收款信息可以有多条所以是数组先循环
      payload.expense.costItems.forEach((itemParam) => {
        const item = itemParam;
        // 项目信息转换
        const mapperKeys = {
          vendor: 'supplier_id',        // 供应商id
          platform: 'platform_code',    // 平台
          city: 'city_code',            // 城市
          district: 'biz_district_id',  // 商圈
          costCount: 'money',           // 分摊金额
        };
        if (item.costCount) {
          item.costCount = -Unit.exchangePriceToCent(item.costCount);
        }
        const costItem = {};
        Object.keys(item).forEach((key) => {
          // 遍历属性，排除原型链
          if (is.existy(mapperKeys[key]) && is.not.empty(mapperKeys[key]) && is.existy(item[key]) && is.not.empty(item[key])) {
            dot.set(costItem, mapperKeys[key], item[key]);
          }
        });
        costItems.push(costItem);
      });
      params.cost_allocation = costItems;
    }
  }

  return params;
};
// 收款请求参数
const mapperCollection = (payloads) => {
  const params = {};
// 收款人
  if (is.existy(payloads.card_name) && is.not.empty(payloads.card_name)) {
    params.card_name = String(payloads.card_name).replace(/\s*/g, '');
  }
// 开户支行
  if (is.existy(payloads.bank_details) && is.not.empty(payloads.bank_details)) {
    params.bank_details = payloads.bank_details;
  }
// 收款账户
  if (is.existy(payloads.card_num) && is.not.empty(payloads.card_num)) {
    params.card_num = payloads.card_num;
  }
  return params;
};

export default {
   /**
   * 命名空间
   * @default
   */
  namespace: 'expenseCostOrder',
  /**
   * 状态树
   * @prop {object} costOrdersData            费用单列表
   * @prop {object} costOrderDetail           费用单详情
   * @prop {object} rentCostOrderDetail       房租费用单详情
   * @prop {object} agentCostOrderDetail      中介费费用单详情
   * @prop {object} pledgeCostOrderDetail     押金费用单详情
   * @prop {object} pledgeLostCostOrderDetail 押金损失费用单详情
   * @prop {object} costOrderAmountSummary    费用金额汇总
   * @prop {object} collectionTypes           费用收款方式
   */
  state: {
    // 费用单列表 报销类
    costOrdersData: {},
    // 费用单列表 房屋类
    costOrderHouseData: {},
    // 费用单详情
    costOrderDetail: {},
    // 房租费用单详情
    rentCostOrderDetail: {},
    // 中介费费用单详情
    agentCostOrderDetail: {},
    // 押金费用单详情
    pledgeCostOrderDetail: {},
    // 押金损失费用单详情
    pledgeLostCostOrderDetail: {},
    // 费用金额汇总
    costOrderAmountSummary: {},
    // 费用金额汇总（提报）
    costOrderSubmitSummary: {},
    // 费用单列表 报销类（命名空间）
    namespaceCostOrderDetail: {},
    // 原费用单列表
    originalCostOrder: [],
    // 退款/红冲费用单
    invoiceCostOrder: {},
    // 科目成本归属
    subjectBelong: {},
    // 收款历史数据
    collection: {},
    // 收款人历史数据
    collectionCardName: {},
    // 开户支行历史数据
    collectionBankDetails: {},
    // 收款账户历史数据
    collectionCardNum: {},
    // 手机号历史数据
    collectionCardPhone: {},
    // 成本分摊 - 发票抬头
    invoiceList: {},
  },
 /**
   * @namespace expense/costOrder/effects
   */
  effects: {
    /**
     * 获取费用金额汇总
     * @param {string} subjectId 科目id
     * @param {string} costTargetId 归属对象(供应商/城市/商圈/平台)ID
     * @param {int} bookMonth 记账月份
     */
    * fetchAmountSummary({ payload = {} }, { call, put, select }) {
      const {
        subjectId, // 科目
        costTargetId, // 归属对象
        applicationOrderId, // 审批单id
        costCenter, // 成本中心
        submitAt, // 提报时间
      } = payload;
      const params = {};

      // 科目
      if (is.existy(subjectId) && is.not.empty(subjectId)) {
        params.accounting_id = subjectId;
      } else {
        // message.error('缺少科目ID');
        return;
      }

      // 归属对象
      if (is.existy(costTargetId) && is.not.empty(costTargetId)) {
        params.cost_target_id = String(costTargetId);
      } else {
        // message.error('缺少归属对象ID');
        return;
      }

      // 成本中心
      if (is.existy(costCenter) && is.not.empty(costCenter)) {
        params.cost_center_type = Number(costCenter);
      } else {
        // message.error('缺少归属对象ID');
        return;
      }

      // 审批单id
      if (is.not.existy(applicationOrderId) || is.empty(applicationOrderId)) {
        return;
      }

      // 定义提报时间
      let firstCreatedTime;

      // 判断提报时间是否传入，如果传入，直接使用；如果没有，则需要调用审批单详情获取
      if (is.existy(submitAt) && is.not.empty(submitAt)) {
        firstCreatedTime = submitAt;
      } else {
        yield put.resolve({ type: 'expenseExamineOrder/fetchPCExamineOrderDetail', payload: { id: applicationOrderId } });
        const examineOrderDetail = yield select(state => state.expenseExamineOrder.examineOrderDetail);
        firstCreatedTime = dot.get(examineOrderDetail, 'submitAt', undefined);
      }

      // 记账月份
      if (firstCreatedTime) {
        params.book_month = Number(moment(firstCreatedTime).format('YYYYMM'));
      } else {
        params.book_month = Number(moment().format('YYYYMM'));
      }

      // 请求接口
      const result = yield call(fetchAmountSummary, params);
      const namespace = `${subjectId}-${costTargetId}-${params.book_month}`;

      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reducerAmountSummary', payload: { result, namespace } });
      }
    },

     /**
     * 获取费用金额汇总（已提报）
     * @param {id} id     审批单id
     * @param {string} accountingId   科目id
     * @param {string} platformCode   平台id
     * @param {string} supplierId     供应商id
     * @param {string} cityCode       城市id
     * @param {string} bizDistrictId  商圈id
     * @param {string} submitAt     提报时间
     */
    * fetchSubmitSummary({ payload = {} }, { call, put, select }) {
      const {
        costCenter,
        applicationOrderId,
        accountingId,
        costTargetId,
        platformCode,
        supplierId,
        cityCode,
        bizDistrictId,
        submitAt,
        staffId,
        teamId,
        assetsId,
        teamIdCode,
      } = payload;
      const params = {};

      // 团队id
      if (is.existy(teamId) && is.not.empty(teamId)) {
        params.team_id = teamId;
      }

      // 团队类型为业主时，identity_card_id
      if (is.existy(teamIdCode) && is.not.empty(teamIdCode)) {
        params.identity_card_id = teamIdCode;
      }

      // 个人id
      if (is.existy(staffId) && is.not.empty(staffId)) {
        params.identity_card_id = staffId;
      }
      // 资产id
      if (is.existy(assetsId) && is.not.empty(assetsId)) {
        params.assets_id = assetsId;
      }

      // costTargetId required
      if (is.existy(costTargetId) && is.not.empty(costTargetId)) {
        params.cost_target_id = costTargetId;
      } else {
        // 如果没有成本归属中心，则return
        return;
      }

      // costCenter required
      if (is.existy(costCenter) && is.not.empty(costCenter)) {
        params.cost_center_type = Number(costCenter);
      } else {
        // message.error('缺少归属对象ID');
        return;
      }

      // accounting_id required
      if (is.existy(accountingId) && is.not.empty(accountingId)) {
        params.accounting_id = accountingId;
      } else {
        return;
      }

      // 平台id
      if (is.existy(platformCode) && is.not.empty(platformCode)) {
        params.platform_code = platformCode;
      }

      // 供应商id
      if (is.existy(supplierId) && is.not.empty(supplierId)) {
        params.supplier_id = supplierId;
      }

      // 城市id
      if (is.existy(cityCode) && is.not.empty(cityCode)) {
        params.city_code = cityCode;
      }

      // 商圈id
      if (is.existy(bizDistrictId) && is.not.empty(bizDistrictId)) {
        params.biz_district_id = bizDistrictId;
      }
      // application order id required
      if (is.not.existy(applicationOrderId) || is.empty(applicationOrderId)) {
        return;
      }

      // 定义提报时间
      let firstCreatedTime;

      // 提报时间 required(如果有值直接使用，否则需要获取)
      if (is.existy(submitAt) && is.not.empty(submitAt)) {
        firstCreatedTime = submitAt;
      } else {
        yield put.resolve({ type: 'expenseExamineOrder/fetchPCExamineOrderDetail', payload: { id: applicationOrderId, flag: true } });
        const examineOrderDetail = yield select(state => state.expenseExamineOrder.examineOrderDetail);
        firstCreatedTime = dot.get(examineOrderDetail, 'submitAt', undefined);
      }
      // bookMonth required int:YYYYMM
      if (firstCreatedTime) {
        params.submit_at = moment(firstCreatedTime).format('YYYY-MM-DD');
      } else {
        params.submit_at = moment().format('YYYY-MM-DD');
      }
      // request server
      const result = yield call(fetchSubmitSummary, params);
      const namespace = `${accountingId}-${costTargetId}-${params.submit_at}-${bizDistrictId}-${cityCode}-${supplierId}`;
      // dispatch reducer
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reducerSubmitSummary', payload: { result, namespace } });
      }
    },

    /**
     * 获取费用单列表
     * @param {number}  limit 总条数
     * @param {number}  page  页数
     * @param {number}  state  费用单状态
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @param {string}  examineOrderId 审批单id
     * @param {string}  type       根据费用分组获取数据
     * @param {array}   subjects   科目
     * @param {number}  paymentState 付款状态
     * @param {string}  approval  审批单号
     * @param {string}  cost      费用单号
     * @param {number}  attribution 归属
     * @param {number}  paymentStart 付款开始日期
     * @param {number}  paymentEnd 付款结束日期
     * @param {number}  submissionStart 提报开始日期
     * @param {number}  submissionEnd 提报结束日期
     * @param {string}  bizExtraHouseContractId    合同id
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */

    * fetchCostOrders({ payload = {} }, { call, put }) {
     // 请求列表的meta信息
      const params = {
        _meta: RequestMeta.mapper(payload),
      };
      // 定义是否为房屋类
      let isHouseData = false;
      // 审批单id
      if (is.existy(payload.examineOrderId) && is.not.empty(payload.examineOrderId)) {
        params.application_order_id = payload.examineOrderId;
      }

      // 费用单状态（默认状态中不包含已删除数据）
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = Array.isArray(payload.state) ? payload.state : [Number(payload.state)];
      } else {
        params.state = [ExpenseCostOrderState.pendding, ExpenseCostOrderState.processing, ExpenseCostOrderState.done, ExpenseCostOrderState.close];
      }
      // 根据供应商获取数据
      if (is.existy(payload.suppliers) && is.not.empty(payload.suppliers)) {
        params.supplier_ids = payload.suppliers;
      }
      // 根据城市获取数据
      if (is.existy(payload.cities) && is.not.empty(payload.cities)) {
        params.city_codes = payload.cities;
      }
      // 根据平台获取数据
      if (is.existy(payload.platforms) && is.not.empty(payload.platforms)) {
        params.platform_codes = payload.platforms;
      }
      // 根据商圈获取数据
      if (is.existy(payload.districts) && is.not.empty(payload.districts)) {
        params.biz_district_ids = payload.districts;
      }
      // 根据费用分组获取数据
      if (is.existy(payload.type) && is.not.empty(payload.type)) {
        params.cost_group_id = payload.type;
      }
      // 根据科目获取数据
      if (is.existy(payload.subjects) && is.not.empty(payload.subjects)) {
        params.cost_accounting_id = payload.subjects;
      }
      // 根据审批单号获取数据
      if (is.existy(payload.approval) && is.not.empty(payload.approval)) {
        params.application_order_id = payload.approval;
      }
      // 根据费用单号获取数据
      if (is.existy(payload.cost) && is.not.empty(payload.cost)) {
        params._id = payload.cost;
      }
      // 根据归属周期获取数据
      if (is.existy(payload.attribution) && is.not.empty(payload.attribution)) {
        params.book_month = Number(payload.attribution);
      }
      // 根据付款开始日期获取数据
      if (is.existy(payload.paymentStart) && is.not.empty(payload.paymentStart)) {
        params.paid_min_at = Number(payload.paymentStart);
      }
      // 根据付款开始日期获取数据
      if (is.existy(payload.paymentEnd) && is.not.empty(payload.paymentEnd)) {
        params.paid_max_at = Number(payload.paymentEnd);
      }
      // 根据提报开始日期获取数据
      if (is.existy(payload.submissionStart) && is.not.empty(payload.submissionStart)) {
        params.submit_min_at = Number(payload.submissionStart);
      }
      // 根据提报开始日期获取数据
      if (is.existy(payload.submissionEnd) && is.not.empty(payload.submissionEnd)) {
        params.submit_max_at = Number(payload.submissionEnd);
      }
      // 合同id
      if (is.existy(payload.bizExtraHouseContractId) && is.not.empty(payload.bizExtraHouseContractId)) {
        params.biz_extra_house_contract_id = [payload.bizExtraHouseContractId];
        isHouseData = true;
      }
      // 主题标签
      if (is.not.empty(payload.themeTags) && is.existy(payload.themeTags)) {
        params.theme_label_list = payload.themeTags;
      }

      const result = yield call(fetchCostOrders, params);
      if (is.existy(result.data)) {
        yield put({ type: 'reduceCostOrders', payload: { result, isHouseData } });
      }
    },

    /**
     * 重置费用单列表
     * @todo 接口需升级优化
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * resetCostOrders({ payload }, { put }) {
      yield put({ type: 'reduceCostOrders', payload: {} });
    },

    /**
     * 重置房租费用单详情
     * @todo 接口需升级优化
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * resetRentCostOrderDetail({ payload }, { put }) {
      yield put({ type: 'reduceRentCostOrderDetail', payload: {} });
    },

    /**
     * 重置中介费费用单详情
     * @todo 接口需升级优化
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * resetAgentCostOrderDetail({ payload }, { put }) {
      yield put({ type: 'reduceAgentCostOrderDetail', payload: {} });
    },

    /**
     * 重置押金费用单详情
     * @todo 接口需升级优化
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * resetPledgeCostOrderDetail({ payload }, { put }) {
      yield put({ type: 'reducePledgeCostOrderDetail', payload: {} });
    },

    /**
     * 重置押金损失费用单详情
     * @todo 接口需升级优化
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * resetPledgeLostCostOrderDetail({ payload }, { put }) {
      yield put({ type: 'reducePledgeLostCostOrderDetail', payload: {} });
    },

     /**
     * 获取费用单详情
     * @param {string}  rentRecordId          获取房租费用单详情id
     * @param {string}  agentRecordId         获取中介费费用单详情id
     * @param {string}  pledgeRecordId        获取押金费用单详情id
     * @param {string}  pledgeLostRecordId    获取押金损失费用单详情id
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * fetchCostOrderDetail({ payload = {} }, { call, put }) {
      const { onSuccessCallback = () => {} } = payload;
      const params = {
        is_plugin_order: false, // 是否是外部审批单，false 否
      };
      // 审批单id
      if (is.existy(payload.orderId) && is.not.empty(payload.orderId)) {
        params.order_id = payload.orderId;
      }
      // 是否是外部审批单
      if (is.existy(payload.isPluginOrder) && is.not.empty(payload.isPluginOrder)) {
        params.is_plugin_order = payload.isPluginOrder;
      }
      // 获取费用单详情
      if (is.existy(payload.recordId) && is.not.empty(payload.recordId)) {
        params.id = payload.recordId;
        const result = yield call(fetchCostOrderDetail, params);
        if (is.existy(result)) {
          onSuccessCallback(CostOrderDetail.mapper(result, CostOrderDetail));
          yield put({ type: 'reduceCostOrderDetail', payload: result });
        }
      }
      // 获取房租费用单详情
      if (is.existy(payload.rentRecordId) && is.not.empty(payload.rentRecordId)) {
        params.id = payload.rentRecordId;
        const result = yield call(fetchCostOrderDetail, params);
        if (is.existy(result)) {
          yield put({ type: 'reduceRentCostOrderDetail', payload: result });
        }
      }
      // 获取中介费费用单详情
      if (is.existy(payload.agentRecordId) && is.not.empty(payload.agentRecordId)) {
        params.id = payload.agentRecordId;
        const result = yield call(fetchCostOrderDetail, params);
        if (is.existy(result)) {
          yield put({ type: 'reduceAgentCostOrderDetail', payload: result });
        }
      }
      // 获取押金费用单详情
      if (is.existy(payload.pledgeRecordId) && is.not.empty(payload.pledgeRecordId)) {
        params.id = payload.pledgeRecordId;
        const result = yield call(fetchCostOrderDetail, params);
        if (is.existy(result)) {
          yield put({ type: 'reducePledgeCostOrderDetail', payload: result });
        }
      }
      // 获取押金损失费用单详情
      if (is.existy(payload.pledgeLostRecordId) && is.not.empty(payload.pledgeLostRecordId)) {
        params.id = payload.pledgeLostRecordId;
        const result = yield call(fetchCostOrderDetail, params);
        if (is.existy(result)) {
          yield put({ type: 'reducePledgeLostCostOrderDetail', payload: result });
        }
      }
    },

    // 重置费用单列表
    * resetCostOrderDetail({ payload }, { put }) {
      yield put({ type: 'reduceCostOrderDetail', payload: {} });
    },

     /**
     *  创建费用单
     * @param {string}  orderId         审批单id
     * @param {string}  records         内容模版
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * createCostOrder({ payload = {} }, { put }) {
      if (is.empty(payload.orderId) || is.not.existy(payload.orderId)) {
        return message.error('创建费用单错误，请填写审批单id');
      }
      if (is.empty(payload.records) || is.not.existy(payload.records)) {
        return message.error('创建费用单错误，请填写内容模版');
      }
      // 请求参数
      const params = {
        application_order_id: payload.orderId,  // 审批单id
        records: payload.records.map(item => mapperData(item)), // 费用单列表
      };

      // 红冲单标识
      if (is.existy(payload.action) && is.not.empty(payload.action)) {
        params.action = payload.action;
      }

      // 红冲单费用单
      if (is.existy(payload.costOrderId) && is.not.empty(payload.costOrderId)) {
        params.cost_order_id = payload.costOrderId;
      }
      // 业务请求
      const request = {
        params, // 接口参数
        service: createCostOrder,  // 接口
        onVerifyCallback: result => is.existy(result) && is.truthy(result.ok),
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     *  创建费用单（退款）
     * @param {string}  orderId         审批单id
     * @param {string}  records         内容模版
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * createRefundOrder({ payload = {} }, { put }) {
      if (is.empty(payload.records) || is.not.existy(payload.records)) {
        return message.error('创建费用单错误，请填写内容模版');
      }

      // 请求参数
      const params = {
        action: payload.action, // 审批单类型（退款/红冲）
        records: payload.records.map(item => mapperRefundData(item)), // 费用单列表
      };

      // 审批单id
      if (is.existy(payload.orderId) && is.not.empty(payload.orderId)) {
        params.application_order_id = payload.orderId;
      }

      // 费用单id
      if (is.existy(payload.costOrderId) && is.not.empty(payload.costOrderId)) {
        params.cost_order_id = payload.costOrderId;
      }

      // 业务请求
      const request = {
        params, // 接口参数
        service: createCostOrder,  // 接口
        onVerifyCallback: result => is.existy(result) && is.truthy(result.ok),
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     *  编辑费用单（退款）
     * @param {string}  orderId         审批单id
     * @param {string}  records         内容模版
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * updateRefundOrder({ payload = {} }, { put }) {
      //  原费用单id
      if (is.empty(payload.costOrderId) || is.not.existy(payload.costOrderId)) {
        return message.error('创建费用单错误，请填写内容模版');
      }

      // 退款费用单id
      if (is.empty(payload.refundCostId) || is.not.existy(payload.refundCostId)) {
        return message.error('创建费用单错误，请填写内容模版');
      }

      // 信息
      if (is.empty(payload.record) || is.not.existy(payload.record)) {
        return message.error('创建费用单错误，请填写内容模版');
      }

      // 请求参数
      const params = {
        id: payload.refundCostId,
        action: payload.action, // 审批单类型（退款/红冲）
        cost_order_id: payload.costOrderId, // 原费用单id
        record: mapperRefundData(payload.record), // 费用单列表
      };

      // 业务请求
      const request = {
        params, // 接口参数
        service: updateCostOrder,  // 接口
        onVerifyCallback: result => is.existy(result) && is.truthy(result.ok),
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     *  更新费用单
     * @param {string}  id         费用单id
     * @param {string}  record     内容模版
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * updateCostOrder({ payload = {} }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('操作费用单错误，请填写费用单id');
      }
      if (is.empty(payload.record) || is.not.existy(payload.record)) {
        return message.error('操作费用单错误，请填写内容模版');
      }
      // 请求参数
      const params = {
        id: payload.id,                     // 费用单id
        record: mapperData(payload.record), // 费用单信息
      };

      // 红冲单标识
      if (is.existy(payload.action) && is.not.empty(payload.action)) {
        params.action = payload.action;
      }

      // 业务请求
      const request = {
        params, // 接口参数
        service: updateCostOrder,  // 接口
        reqCost: payload.reqCost,
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     *  更新外部审批费用单
     * @param {string}  orderId    审批单id
     * @param {string}  id         费用单id
     * @param {string}  record     内容模版
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * updatePluginAdjustCostMoney({ payload = {} }, { put }) {
      if (is.empty(payload.id) || is.not.existy(payload.id)) {
        return message.error('操作费用单错误，请填写费用单id');
      }
      if (is.empty(payload.record) || is.not.existy(payload.record)) {
        return message.error('操作费用单错误，请填写内容模版');
      }
      if (is.empty(payload.orderId) || is.not.existy(payload.orderId)) {
        return message.error('操作费用单错误，请填写审批单id');
      }
      // 请求参数
      const params = {
        order_id: payload.orderId,          // 审批单id
        cost_order_id: payload.id,          // 费用单id
        record: mapperData(payload.record), // 费用单信息
      };

      // 红冲单标识
      if (is.existy(payload.action) && is.not.empty(payload.action)) {
        params.action = payload.action;
      }

      // 业务请求
      const request = {
        params, // 接口参数
        service: updatePluginAdjustCostMoney,  // 接口
        reqCost: payload.reqCost,
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     *  费用记录导出
     * @param {number}  state  费用单状态
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @param {string}  examineOrderId 审批单id
     * @param {string}  type       根据费用分组获取数据
     * @param {array}   subjects   科目
     * @param {number}  paymentState 付款状态
     * @param {string}  approval  审批单号
     * @param {string}  cost      费用单号
     * @param {number}  attribution 归属
     * @param {number}  paymentStart 付款开始日期
     * @param {number}  paymentEnd 付款结束日期
     * @param {number}  submissionStart 提报开始日期
     * @param {number}  submissionEnd 提报结束日期
     * @param {string}  bizExtraHouseContractId    合同id
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */

    * fetchCostOrderExport({ payload = {} }, { put }) {
      const payloads = payload.params;
      // 请求列表的meta信息
      const params = {};
      // 费用单状态（默认状态中不包含已删除数据）
      if (is.existy(payloads.state) && is.not.empty(payloads.state)) {
        params.state = [Number(payloads.state)];
      } else {
        params.state = [ExpenseCostOrderState.pendding, ExpenseCostOrderState.processing, ExpenseCostOrderState.done, ExpenseCostOrderState.close];
      }
      // 根据供应商获取数据
      if (is.existy(payloads.suppliers) && is.not.empty(payloads.suppliers)) {
        params.supplier_ids = payloads.suppliers;
      }
      // 根据城市获取数据
      if (is.existy(payloads.cities) && is.not.empty(payloads.cities)) {
        params.city_codes = payloads.cities;
      }
      // 根据平台获取数据
      if (is.existy(payloads.platforms) && is.not.empty(payloads.platforms)) {
        params.platform_codes = payloads.platforms;
      }
      // 根据商圈获取数据
      if (is.existy(payloads.districts) && is.not.empty(payloads.districts)) {
        params.biz_district_ids = payloads.districts;
      }
      // 根据费用分组获取数据
      if (is.existy(payloads.type) && is.not.empty(payloads.type)) {
        params.cost_group_id = payloads.type;
      }
      // 根据科目获取数据
      if (is.existy(payloads.subjects) && is.not.empty(payloads.subjects)) {
        params.cost_accounting_id = payloads.subjects;
      }
      // 根据审批单号获取数据
      if (is.existy(payloads.approval) && is.not.empty(payloads.approval)) {
        params.application_order_id = payloads.approval;
      }
      // 根据费用单号获取数据
      if (is.existy(payloads.cost) && is.not.empty(payloads.cost)) {
        params._id = payloads.cost;
      }
      // 根据归属周期获取数据
      if (is.existy(payloads.attribution) && is.not.empty(payloads.attribution)) {
        params.book_month = Number(payloads.attribution);
      }
      // 根据付款开始日期获取数据
      if (is.existy(payloads.paymentStart) && is.not.empty(payloads.paymentStart)) {
        params.paid_min_at = Number(payloads.paymentStart);
      }
      // 根据付款开始日期获取数据
      if (is.existy(payloads.paymentEnd) && is.not.empty(payloads.paymentEnd)) {
        params.paid_max_at = Number(payloads.paymentEnd);
      }
      // 根据提报开始日期获取数据
      if (is.existy(payloads.submissionStart) && is.not.empty(payloads.submissionStart)) {
        params.submit_min_at = Number(payloads.submissionStart);
      }
      // 根据提报开始日期获取数据
      if (is.existy(payloads.submissionEnd) && is.not.empty(payloads.submissionEnd)) {
        params.submit_max_at = Number(payloads.submissionEnd);
      }
      // 合同id
      if (is.existy(payloads.bizExtraHouseContractId) && is.not.empty(payloads.bizExtraHouseContractId)) {
        params.biz_extra_house_contract_id = [payloads.bizExtraHouseContractId];
      }
      // 主题标签
      if (is.not.empty(payloads.themeTags) && is.existy(payloads.themeTags)) {
        params.theme_label_list = payloads.themeTags;
      }

      const request = {
        params, // 接口参数
        service: fetchCostOrderExport,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     *  删除操作
     * @param {string}  recordIds        费用单id
     * @param {string}  orderId          审批单id
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * deleteCostOrder({ payload = {} }, { put }) {
      if (is.empty(payload.recordIds) || is.not.existy(payload.recordIds) || is.not.array(payload.recordIds)) {
        return message.error('删除费用单错误，请填写费用单id');
      }
      if (is.empty(payload.orderId) || is.not.existy(payload.orderId)) {
        return message.error('删除费用单错误，请填写审批单id');
      }

      // 请求参数
      const params = {
        application_order_id: payload.orderId,  // 审批单id
        record_ids: payload.recordIds,          // 费用单ids
      };

      // 业务请求
      const request = {
        params, // 接口参数
        service: deleteCostOrder,  // 接口
        onSuccessCallback: payload.onSuccessCallback, // 成功回调
        onFailureCallback: payload.onFailureCallback, // 失败回调
      };
      yield put({ type: 'applicationCore/requestWithCallback', payload: request });
    },

    /**
     * 获取费用单详情（命名空间）
     * @param {string}  rentRecordId          获取房租费用单详情id
     * @param {string}  agentRecordId         获取中介费费用单详情id
     * @param {string}  pledgeRecordId        获取押金费用单详情id
     * @param {string}  pledgeLostRecordId    获取押金损失费用单详情id
     * @memberof module:model/expense/costOrder~expense/costOrder/effects
     */
    * fetchNamespaceCostOrderDetail({ payload = {} }, { call, put }) {
      const { onSuccessCallback = () => {}, namespace } = payload;
      const params = {};
      // 获取费用单详情
      if (is.existy(payload.recordId) && is.not.empty(payload.recordId)) {
        params.id = payload.recordId;
        const result = yield call(fetchCostOrderDetail, params);
        if (is.existy(result)) {
          onSuccessCallback(CostOrderDetail.mapper(result, CostOrderDetail));
          yield put({ type: 'reduceNamespaceCostOrderDetail', payload: { data: result, namespace } });
        }
      }
    },

    /**
     * 获取原费用单列表（退款、红冲）
     */
    * fetchOriginalCostOrder({ payload = {} }, { call, put }) {
      const {
        orderId,
      } = payload;
      if (!is.existy(orderId) || is.empty(orderId)) {
        return message.error('审批单id不能为空 ');
      }

      const params = {
        application_order_id: orderId,
      };

      const result = yield call(fetchOriginalCostOrder, params);

      if (is.not.empty(result)) {
        yield put({ type: 'reduceOriginalCostOrder', payload: result });
      }
    },

    /**
     * 获取退款/红冲费用单详情
     */
    * fetchInvoiceCostOrderDetail({ payload = {} }, { call, put }) {
      const {
        recordId, // 费用单id
      } = payload;

      if (!is.existy(recordId) || is.empty(recordId)) {
        return message.error('缺少费用单id');
      }

      const params = { id: recordId };

      const result = yield call(fetchCostOrderDetail, params);

      if (is.existy(result)) {
        yield put({ type: 'reduceInvoiceCostOrderDetail', payload: result });
      }
    },

    /**
     * 重置退款单详情
     */
    * resetInvoiceCostOrderDetail({ payload = {} }, { put }) {
      yield put({ type: 'reduceInvoiceCostOrderDetail', payload: {} });
    },

    /**
     * 科目成本归属
     */
    * fetchSubjectBelong({ payload = {} }, { call, put }) {
      const {
        subjectCode, // 科目id
        namespace,
        onSuccessCallback,
      } = payload;

      if (!is.existy(subjectCode) || is.empty(subjectCode)) {
        return;
      }

      const params = { accounting_code: subjectCode };

      const result = yield call(fetchSubjectBelong, params);
      if (result) {
        onSuccessCallback && onSuccessCallback(result);
        yield put({ type: 'reduceSubjectBelong', payload: { result, namespace } });
      } else if (!result) {
        onSuccessCallback && onSuccessCallback(result);
        yield put({ type: 'reduceSubjectBelong', payload: { namespace } });
      }
    },

    /**
     * 重置科目成本归属
     */
    * resetSubjectBelong({ payload = {} }, { put }) {
      yield put({ type: 'reduceSubjectBelong', payload: {} });
    },

    /**
     * 费用单收款历史数据
     */
    * fetchCollection({ payload = {} }, { call, put }) {
      // 请求参数
      const params = mapperCollection(payload);
      const result = yield call(fetchCollection, params);
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceCollection', payload: { result } });
      }
    },
    /**
     * 费用单收款人历史数据
     */
    * fetchCollectionCardName({ payload = {} }, { call, put }) {
      // 请求参数
      const params = mapperCollection(payload);
      const result = yield call(fetchCollection, params);
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceCollectionCardName', payload: { namespace: payload.namespace, result } });
        if (payload.onSucessCallback) {
          payload.onSucessCallback();
        }
      }
    },
     /**
     * 费用单开户支行历史数据
     */
    * fetchCollectionBankDetails({ payload = {} }, { call, put }) {
      // 请求参数
      const params = mapperCollection(payload);
      const result = yield call(fetchCollection, params);
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceCollectionBankDetails', payload: { namespace: payload.namespace, result } });
        if (payload.onSucessCallback) {
          payload.onSucessCallback();
        }
      }
    },
    /**
     * 费用单收款账户历史数据
     */
    * fetchCollectionCardNum({ payload = {} }, { call, put }) {
      // 请求参数
      const params = mapperCollection(payload);
      const result = yield call(fetchCollection, params);
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceCollectionCardNum', payload: { namespace: payload.namespace, result } });
        if (payload.onSucessCallback) {
          payload.onSucessCallback();
        }
      }
    },
    /**
     * 费用单手机号历史数据
     */
    * fetchCollectionCardPhone({ payload = {} }, { call, put }) {
      // 请求参数
      const params = mapperCollection(payload);
      const result = yield call(fetchCollection, params);
      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceCollectionCardPhone', payload: { namespace: payload.namespace, result } });
        if (payload.onSucessCallback) {
          payload.onSucessCallback();
        }
      }
    },

    /**
     * 重置科目成本归属
     */
    * resetCollection({ payload = {} }, { put }) {
      yield put({ type: 'reduceCollection', payload: {} });
    },

    /**
     * 成本分摊 - 发票抬头
     */
    * getCostInvoiceHeader({ payload = {} }, { call, put }) {
      const { platform } = payload;

      const params = {
        type: 'invoice_title',
        doc: {},
      };

      platform && (params.doc.platform_code = platform);

      const result = yield call(getCostInvoiceHeader, params);
      if (result && result.data) {
        yield put({ type: 'reduceCostInvoiceHeader', payload: result });
      }
    },
  },
   /**
   * @namespace expense/costOrder/reducers
   */
  reducers: {
    /**
     * 获取费用金额汇总
     * @returns {object} 更新 costOrderAmountSummary
     * @memberof module:model/expense/costOrder~expense/costOrder/reducers
     */
    reducerAmountSummary(state, action) {
      const {
        result,
        namespace,
      } = action.payload;
      const costOrderAmountSummary = CostBookMonthbrief.mapper(result, CostBookMonthbrief);
      return {
        ...state,
        costOrderAmountSummary: {
          ...state.costOrderAmountSummary,
          [namespace]: costOrderAmountSummary,
        },
      };
    },
    /**
     * 获取费用金额汇总(提报)
     * @returns {object} 更新 costOrderSubmitSummary
     * @memberof module:model/expense/costOrder~expense/costOrder/reducers
     */
    reducerSubmitSummary(state, action) {
      const {
        result,
        namespace,
      } = action.payload;
      const costOrderSubmitSummary = CostOrderSubmitBrief.mapper(result, CostOrderSubmitBrief);
      return {
        ...state,
        costOrderSubmitSummary: {
          ...state.costOrderSubmitSummary,
          [namespace]: costOrderSubmitSummary,
        },
      };
    },

    /**
     * 获取费用单列表
     * @returns {object} 更新 costOrdersData
     * @memberof module:model/expense/costOrder~expense/costOrder/reducers
     */
    reduceCostOrders(state, action) {
      const { isHouseData } = action.payload;
      let costOrdersData = {};
      // 判断是否有数据
      if (is.not.empty(action.payload) && is.existy(action.payload.result)) {
        costOrdersData = {
          meta: ResponseMeta.mapper(action.payload.result._meta),
          data: CostOrderListItem.mapperEach(action.payload.result.data, CostOrderListItem),
        };
      }

      // 判断，如果是房屋数据，则更新房屋费用单列表
      if (is.existy(isHouseData) && isHouseData === true) {
        return { ...state, costOrderHouseData: costOrdersData };
      }
      // 判断，如果是报销数据，则更新房屋费用单列表
      if (is.existy(isHouseData) && isHouseData === false) {
        return { ...state, costOrdersData };
      }
      // 如果是重置，则更新所有费用单列表
      return { ...state, costOrdersData, costOrderHouseData: costOrdersData };
    },

    /**
     * 获取费用单详情数据
     * @returns {object} 更新 costOrderDetail
     * @memberof module:model/expense/costOrder~expense/costOrder/reducers
     */
    reduceCostOrderDetail(state, action) {
      let costOrderDetail = {};
      // 判断是否有数据
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        costOrderDetail = CostOrderDetail.mapper(action.payload, CostOrderDetail);
        const bizExtraData = costOrderDetail.bizExtraData || {};
        // 判断差旅明细是否有值，没值添加默认值
        if (is.existy(bizExtraData) && is.not.empty(bizExtraData)) {
          // eslint-disable-next-line guard-for-in
          for (const i in bizExtraData) {
            // 金额换算成元
            costOrderDetail.bizExtraData[i] = Unit.exchangePriceToYuan(bizExtraData[i]);
          }
        } else {
          costOrderDetail.bizExtraData = {
            subsidy_fee: 0,
            stay_fee: 0,
            transport_fee: 0,
            urban_transport_fee: 0,
            other_fee: 0,
          };
        }
      }

      return { ...state, costOrderDetail };
    },

    /**
     * 获取房租费用单详情数据
     * @returns {object} 更新 rentCostOrderDetail
     * @memberof module:model/expense/costOrder~expense/costOrder/reducers
     */
    reduceRentCostOrderDetail(state, action) {
      let rentCostOrderDetail = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        rentCostOrderDetail = CostOrderDetail.mapper(action.payload, CostOrderDetail);
      }
      return { ...state, rentCostOrderDetail };
    },

    /**
     * 获取中介费费用单详情数据
     * @returns {object} 更新 agentCostOrderDetail
     * @memberof module:model/expense/costOrder~expense/costOrder/reducers
     */
    reduceAgentCostOrderDetail(state, action) {
      let agentCostOrderDetail = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        agentCostOrderDetail = CostOrderDetail.mapper(action.payload, CostOrderDetail);
      }
      return { ...state, agentCostOrderDetail };
    },

    /**
     * 获取押金费用单详情数据
     * @returns {object} 更新 pledgeCostOrderDetail
     * @memberof module:model/expense/costOrder~expense/costOrder/reducers
     */
    reducePledgeCostOrderDetail(state, action) {
      let pledgeCostOrderDetail = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        pledgeCostOrderDetail = CostOrderDetail.mapper(action.payload, CostOrderDetail);
      }
      return { ...state, pledgeCostOrderDetail };
    },

     /**
     * 获取押金损失费用单详情数据
     * @returns {object} 更新 pledgeLostCostOrderDetail
     * @memberof module:model/expense/costOrder~expense/costOrder/reducers
     */
    reducePledgeLostCostOrderDetail(state, action) {
      let pledgeLostCostOrderDetail = {};
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        pledgeLostCostOrderDetail = CostOrderDetail.mapper(action.payload, CostOrderDetail);
      }
      return { ...state, pledgeLostCostOrderDetail };
    },

    /**
     * 获取费用单详情数据（命名空间）
     * @returns {object} 更新 costOrderDetail
     * @memberof module:model/expense/costOrder~expense/costOrder/reducers
     */
    reduceNamespaceCostOrderDetail(state, action) {
      let { namespaceCostOrderDetail = {} } = state;
      const { namespace, data = {} } = action.payload;
      // 判断是否有数据
      if (is.not.empty(data) && is.existy(data)) {
        const temp = {};
        temp[namespace] = CostOrderDetail.mapper(data, CostOrderDetail);
        namespaceCostOrderDetail = { ...namespaceCostOrderDetail, ...temp };
      }

      // 出差金额项
      const { biz_extra_data: bizExtraData = {} } = data;
      // 判断差旅明细是否有值，没值添加默认值
      if (is.existy(bizExtraData) && is.not.empty(bizExtraData)) {
        // eslint-disable-next-line guard-for-in
        for (const i in bizExtraData) {
          // 金额换算成元
          namespaceCostOrderDetail[namespace].bizExtraData[i] = bizExtraData[i];
        }
      } else {
        namespaceCostOrderDetail[namespace].bizExtraData = {
          subsidy_fee: 0,
          stay_fee: 0,
          transport_fee: 0,
          urban_transport_fee: 0,
          other_fee: 0,
        };
      }
      return { ...state, namespaceCostOrderDetail };
    },

    /**
     * 更新原费用单（退还、红冲）
     */
    reduceOriginalCostOrder(state, action) {
      let originalCostOrder = [];
      const { data } = action.payload;
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        originalCostOrder = data.map((item) => {
          return CostOrderDetail.mapper(item, CostOrderDetail);
        });
      }
      return { ...state, originalCostOrder };
    },

    /**
     * 更新退款/红冲费用单详情
     */
    reduceInvoiceCostOrderDetail(state, action) {
      let invoiceCostOrder = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        invoiceCostOrder = CostOrderDetail.mapper(action.payload, CostOrderDetail);
      }

      return { ...state, invoiceCostOrder };
    },

    /**
     * 更新科目成本归属
     */
    reduceSubjectBelong(state, action) {
      const { subjectBelong = {} } = state;
      const { result = {}, namespace } = action.payload;
      subjectBelong[namespace] = result;

      return { ...state, subjectBelong };
    },

    /**
     * 更新收款历史数据
     */
    reduceCollection(state, action) {
      const { result } = action.payload;
      const collection = {};
      let data = [];
      if (is.existy(result.data) && is.not.empty(result.data)) {
        data = result.data;
      }

      if (Array.isArray(data) && data.length > 0) {
        // 过滤空数据
        const filterData = data.filter(i => Object.keys(i).length > 0);
        collection.cardName = [...new Set(filterData.map(item => item.card_name))];
        collection.cardNum = [...new Set(filterData.map(item => item.card_num))];
        collection.originalCardNum = filterData.map(item => item.card_num);
        collection.originalBankName = filterData.map(item => item.bank_details);
        collection.bankName = [...new Set(filterData.map(item => item.bank_details))];
      }
      return { ...state, collection };
    },
    /**
     * 更新收款历史数据
     */
    reduceCollectionCardName(state, action) {
      const { namespace, result } = action.payload;
      let collectionCardName = [];
      const data = result.data || [];
      if (Array.isArray(data) && data.length > 0) {
        // 过滤空数据
        const filterData = data.filter(item => item.card_name);
        collectionCardName = [...new Set(filterData.map(item => String(item.card_name).replace(/\s*/g, '')))];
      }
      return {
        ...state,
        collectionCardName: {
          ...state.collectionCardName,
          [namespace]: collectionCardName,
        },
      };
    },
    /**
     * 更新收款开户支行历史数据
     */
    reduceCollectionBankDetails(state, action) {
      const { namespace, result } = action.payload;
      let collectionBankDetails = [];
      const data = result.data || [];
      if (Array.isArray(data) && data.length > 0) {
        // 过滤空数据
        const filterData = data.filter(item => item.bank_details);
        collectionBankDetails = [...new Set(filterData.map(item => item.bank_details))];
      }
      return {
        ...state,
        collectionBankDetails: {
          ...state.collectionBankDetails,
          [namespace]: collectionBankDetails,
        },
      };
    },
    /**
     * 更新收款收款账户历史数据
     */
    reduceCollectionCardNum(state, action) {
      const { namespace, result } = action.payload;
      let collectionCardNum = [];
      const data = result.data || [];
      if (Array.isArray(data) && data.length > 0) {
        // 过滤空数据
        const filterData = data.filter(item => item.card_num);
        collectionCardNum = [...new Set(filterData.map(item => item.card_num))];
      }
      return {
        ...state,
        collectionCardNum: {
          ...state.collectionCardNum,
          [namespace]: collectionCardNum,
        },
      };
    },
    /**
     * 费用单手机号历史数据
     */
    reduceCollectionCardPhone(state, action) {
      const { namespace, result } = action.payload;
      let collectionCardPhone = [];
      const data = result.data || [];
      if (Array.isArray(data) && data.length > 0) {
        // 过滤空数据
        const filterData = data.filter(item => item.card_phone);
        collectionCardPhone = [...new Set(filterData.map(item => item.card_phone))];
      }
      return {
        ...state,
        collectionCardPhone: {
          ...state.collectionCardPhone,
          [namespace]: collectionCardPhone,
        },
      };
    },

    /**
     * 更新成本分摊 - 发票抬头
     */
    reduceCostInvoiceHeader(state, action) {
      let invoiceList = {};
      if (action.payload) {
        invoiceList = action.payload;
      }

      return { ...state, invoiceList };
    },
  },
};
