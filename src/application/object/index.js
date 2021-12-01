import { Supplier, Platform, Account } from './account';
import {
  OaCostGroup,
  OaCostAccounting,
  OaCostAllocation,
  OaCostBookLog,
  OaCostBookMonth,
  OaPayeeBook,
  OaCostOrder,
  OaApplicationFlowNode,
  OaApplicationFlowTemplate,
  OaApplicationOrder,
  OaApplicationOrderFlowRecord,
  OaApplicationOrderFlowExtra,
  OaApplicationUrgeRecord,
  OaHouseContract,
  CommonMessage,
} from './expense/index';
import {
  AccountBrief,
  CostAccountingBrief,
  CostAccountingListItem,
  CostAccountingDetail,
  CostGroupBrief,
  CostGroupDetail,
  ApplicationFlowTemplateBrief,
  ApplicationFlowTemplateDetail,
  ApplicationFlowNodeEmbedItem,
  ApplicationFlowNodeBrief,
  ApplicationFlowNodeDetail,
  ApplicationOrderListItem,
  ApplicationOrderBrief,
  ApplicationOrderDetail,
  ApplicationOrderFlowRecordBrief,
  ApplicationOrderFlowRecordDetail,
  CostAllocationBrief,
  ApplicationUrgeRecordDetail,
  CostOrderListItem,
  CostOrderBrief,
  CostOrderDetail,
  SysNoticeDetail,
  BossAssistNoticeDetail,
  HouseContractListItem,
  HouseContractDetail,
  CostBookMonthbrief,
  CostOrderSubmitBrief,
} from './expense/foreign';
import {
  PayrollAdjustmentConfiguration,
  PayrollAdjustmentItem,
  PayrollAdjustmentDataTemplate,
  PayrollAdjustmentTask,
  SalaryPayrollAdjustmentLine,
  PayrollPlan,
  PayrollStatement,
  Payroll,
  SalaryComputeTask,
  SalaryComputeDataSet,
  SalaryPlan,
  SalaryPlanVersion,
  SalaryPlanRuleCollection,
  SalaryRule,
  SalaryVarPlan,
  SalaryVar,
  SalaryVarValue,
  StaffTag,
  StaffTagMap,
} from './';

import { RequestMeta, ResponseMeta } from './meta';

// 上一版 module.export
export {
  RequestMeta,    // 请求列表数据使用的meta
  ResponseMeta,   // 返回列表数据的meta

  Platform,   // 平台
  Account,    // 账户信息对象
  Supplier,   // 供应商

  OaCostGroup,                          // OA费用分组(原费用分组）
  OaCostAccounting,                     // OA成本费用会计科目表
  OaCostAllocation,                     // OA成本费用记录分摊明细表(分摊记录)
  OaCostBookLog,                        // OA成本费用记账明细
  OaCostBookMonth,                      // OA成本费用月度汇总表
  OaPayeeBook,                          // 收款人信息名录
  OaCostOrder,                          // 成本费用记录
  OaApplicationFlowNode,                // OA审批流节点
  OaApplicationFlowTemplate,            // OA审批流模板
  OaApplicationOrder,                   // OA申请审批单
  OaApplicationOrderFlowRecord,         // OA审批单流转明细记录
  OaApplicationOrderFlowExtra,          // OA审批单流转补充说明
  OaApplicationUrgeRecord,              // 催办记录
  OaHouseContract,                      // 房屋租赁合同/记录
  CommonMessage,                        // 系统消息/通知

  AccountBrief,                         // 账号摘要
  CostAccountingBrief,                  // 费用科目摘要
  CostAccountingListItem,               // 费用科目摘要
  CostAccountingDetail,                 // 费用科目详情
  CostGroupBrief,                       // 费用分组摘要
  CostGroupDetail,                      // 费用分组详情
  ApplicationFlowTemplateBrief,         // 审批流模版摘要
  ApplicationFlowTemplateDetail,        // 审批流模版详情
  ApplicationFlowNodeEmbedItem,         // 审批流模版节点列表（嵌入）
  ApplicationFlowNodeBrief,             // 审批流节点摘要（嵌入）
  ApplicationFlowNodeDetail,            // 审批流模版节点详情
  ApplicationOrderListItem,             // 审批单列表
  ApplicationOrderBrief,                // 付款审批摘要
  ApplicationOrderDetail,               // 审批单详情
  ApplicationOrderFlowRecordBrief,      // 付款审批流转记录摘要
  ApplicationOrderFlowRecordDetail,     // 审批单流转明细记录
  CostAllocationBrief,                  // 成本费用记录分摊摘要
  ApplicationUrgeRecordDetail,          // 催办记录详情
  CostOrderListItem,                    // 成本费用记录列表记录
  CostOrderBrief,                       // 成本费用记录摘要
  CostOrderDetail,                      // 成本费用记录详情
  SysNoticeDetail,                      // 系统消息详情
  BossAssistNoticeDetail,               // BOSS助理消息详情
  HouseContractListItem,                // 房屋合同列表
  HouseContractDetail,                  // 房屋合同详情

  PayrollAdjustmentConfiguration,       // 结算单调整项(扣款补款)配置
  PayrollAdjustmentItem,                // 结算单调整项(扣款补款)项目
  PayrollAdjustmentDataTemplate,        // 结算单调整项(扣款补款)数据模板
  PayrollAdjustmentTask,                // 结算单调整项(扣款补款)数据上传任务
  SalaryPayrollAdjustmentLine,          // 人员扣款补款明细数据
  PayrollPlan,                          // 结算计划
  PayrollStatement,                     // 结算单-总账单（商圈级别）
  Payroll,                              // 结算单（明细）
  SalaryComputeTask,                    // 服务费试算任务
  SalaryComputeDataSet,                 // 人员服务费计算结果集
  SalaryPlan,                           // 服务费方案
  SalaryPlanVersion,                    // 服务费方案版本
  SalaryPlanRuleCollection,             // 服务费规则集
  SalaryRule,                           // 服务费计算规则
  SalaryVarPlan,                        // 结算指标方案库
  SalaryVar,                            // 结算指标定义
  SalaryVarValue,                       // 结算指标参数值
  StaffTag,                             // 人员标签分组
  StaffTagMap,                          // 人员标签
  CostBookMonthbrief,                   // 费用月度汇总摘要(手动添加映射)
  CostOrderSubmitBrief,                 // 费用阅读汇总摘要(已提报)(手动添加映射)
};
