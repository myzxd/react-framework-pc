import moment from 'moment';
import {
  Unit,
} from '../../../application/define';

// 设置form value
const getFormValues = (values = {}) => {
  return {
    attribution: values.cost_center_type, // 提报类型
    project: values.project_id, // 旧主体（已废弃）
    flowId: values.flow_id, // 审批流id
    orderId: values.order_ids, // 审批单id
    payStatus: values.paid_state, // 付款状态
    reportAt: values.submit_from_date && values.submit_end_date ?
      [moment(String(values.submit_from_date)), moment(String(values.submit_end_date))]
    : null, // 提报时间
    payAt: values.paid_start_date && values.paid_end_date ?
      [moment(String(values.paid_start_date)), moment(String(values.paid_end_date))]
    : null, // 付款时间
    belongTime: values.belong_month ? moment(String(values.belong_month), 'YYYY-MM') : null, // 记账月份
    ticketStatus: values.inspect_bill_state, // 验票状态
    ticketTag: values.inspect_bill_label_ids, // 验票标签
    isTicketTag: values.has_inspect_bill_label_ids, // 是否有验票标签
    themeTag: values.theme_label, // 主题标签
    processStatus: values.state, // 流程状态
    applicant: values.apply_account_name, // 申请人
    invoiceTitleList: values.invoice_title_list, // 发票抬头
    supplierIds: values.supplier_ids, // 主体
    industryIds: values.industry_ids, // 场景
    platformIds: values.platform_ids, // 平台
    projectIds: values.project_ids, // 项目
    cityCodes: values.city_codes, // 城市
    costAccountingIds: values.cost_accounting_ids, // 科目
    paidMoneyLow: values.paid_money_low ?
      Unit.exchangePriceToYuan(values.paid_money_low)
    : undefined, // 费用金额min
    paidMoneyTop: values.paid_money_top ?
      Unit.exchangePriceToYuan(values.paid_money_top)
    : undefined, // 费用金额max
  };
};

export default getFormValues;
