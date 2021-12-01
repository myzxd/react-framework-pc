/**
 * 操作模块的权限判断
 */
import { authorize } from '../index';
import Modules from './modules';

class Operate {

  // 判断数据是否在数组中
  static inArray = (item = '', array = []) => {
    // 检测数据是否在数组中
    if (array.indexOf(item) !== -1) {
      return true;
    }

    // 不存在则直接返回
    return false;
  }

  // 角色管理 - CODE业务策略
  static canOperateAdminManagementCodeRoles = () => {
    return authorize.canOperate(Modules.OperateAdminManagementCodeRoles);
  }
  // NOTE: 查询管理----------------------------------

  // NOTE: 人员管理----------------------------------
  // 导出EXCEL(超级管理员)
  static canOperateEmployeeSearchExportExcel = () => {
    return authorize.canOperate(Modules.OperateEmployeeSearchExportExcel);
  }
  // 编辑人员信息按钮
  static canOperateEmployeeSearchUpdateButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeSearchUpdateButton);
  }
  // TODO:AUTH 产品需求待定，权限由后台判断返回 离职审核按钮(站长，调度)
  static canOperateEmployeeResignVerifyButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeResignVerifyButton);
  }
  // 工号管理,启用／停用按钮
  static canOperateEmployeeDeliveryStartButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeDeliveryStartButton);
  }
  // 办理离职按钮
  static canOperateEmployeeResignVerifyForceButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeResignVerifyForceButton);
  }
  // 完成离职按钮
  static canOperateEmployeeResignButton = () => {
    return authorize.canOperate(Modules.OperateEmployeeResignButton);
  }
  // 查看劳动者档案
  static canOperateEmployeeFileTypeSecond = () => {
    return authorize.canOperate(Modules.OperateEmployeeFileTypeSecond);
  }
  // 查看人员档案
  static canOperateEmployeeFileTypeStaff = () => {
    return authorize.canOperate(Modules.OperateEmployeeFileTypeStaff);
  }
  // 查看历史信息
  static canOperateModuleEmployeeDetailHistoryInfo = () => {
    return authorize.canOperate(Modules.OperateModuleEmployeeDetailHistoryInfo);
  }
  // 人员异动编辑操作
  static canOperateEmployeeTurnoverUpdate = () => {
    return authorize.canOperate(Modules.OperateEmployeeTurnoverUpdate);
  }
  // 人员异动创建操作
  static canOperateEmployeeTurnoverCreate = () => {
    return authorize.canOperate(Modules.OperateEmployeeTurnoverCreate);
  }
  // 人员异动删除操作
  static canOperateEmployeeTurnoverDelete = () => {
    return authorize.canOperate(Modules.OperateEmployeeTurnoverDelete);
  }
  // 人员异动信息变更操作
  static canOperateEmployeeTurnoverInfoChange = () => {
    return authorize.canOperate(Modules.OperateEmployeeTurnoverInfoChange);
  }
  // 人员档案新增合同
  static canOperateEmployeeCreateContract = () => {
    return authorize.canOperate(Modules.OperateEmployeeCreateContract);
  }
  // 不计入占编数统计
  static canOperateEmployeeCreateIsOrganization = () => {
    return authorize.canOperate(Modules.OperateEmployeeCreateIsOrganization);
  }
  // 包含已裁撤部门数据
  static canOperateEmployeeAbolishDepartment = () => {
    return authorize.canOperate(Modules.OperateEmployeeAbolishDepartment);
  }
  // 批量操作员工档案team按钮
  static canOperateEmployeeChangeStaffTeam = () => {
    return authorize.canOperate(Modules.OperateEmployeeChangeStaffTeam);
  }
   // 批量操作劳动者档案team按钮
  static canOperateEmployeeChangeScendTeam = () => {
    return authorize.canOperate(Modules.OperateEmployeeChangeScendTeam);
  }

  // 社保配置-新增
  static canOperateEmployeeSocietyCreate = () => {
    return authorize.canOperate(Modules.OperateEmployeeSocietyCreate);
  }
  // 社保配置-编辑
  static canOperateEmployeeSocietyUpdate = () => {
    return authorize.canOperate(Modules.OperateEmployeeSocietyUpdate);
  }
  // 社保配置-详情
  static canOperateEmployeeSocietyDetail = () => {
    return authorize.canOperate(Modules.OperateEmployeeSocietyDetail);
  }

  // NOTE: 物资管理----------------------------------
  // 物资设置上传附件、下载模板
  static canOperateSupplySettingDownloadAndUpload = () => {
    return authorize.canOperate(Modules.OperateSupplySettingDownloadAndUpload);
  }
  // 采购入库明细下载模板
  static canOperateSupplyProcurementDownload = () => {
    return authorize.canOperate(Modules.OperateSupplyProcurementDownload);
  }
  // 分发明细上传附件、下载模板
  static canOperateSupplyDistributionDownloadAndUpload = () => {
    return authorize.canOperate(Modules.OperateSupplyDistributionDownloadAndUpload);
  }
  // 扣款汇总上传附件、导出excel
  static canOperateSupplyDeductSummarizeExportAndUpload = () => {
    return authorize.canOperate(Modules.OperateSupplyDeductSummarizeExportAndUpload);
  }
  // 物资台账导出EXCEL
  static canOperateSupplyStandBookExport = () => {
    return authorize.canOperate(Modules.OperateSupplyStandBookExport);
  }

  // 共享登记 - 合同编辑
  static canOperateSharedContractUpdate = () => {
    return authorize.canOperate(Modules.OperateSharedContractUpdate);
  }
  // 共享登记 - 合同详情
  static canOperateSharedContractDetail = () => {
    return authorize.canOperate(Modules.OperateSharedContractDetail);
  }
  // 共享登记 - 合同导出
  static canOperateSharedContractExport = () => {
    return authorize.canOperate(Modules.OperateSharedContractExport);
  }
  // 共享登记 - 合同权限
  static canOperateSharedContractAuthority = () => {
    return authorize.canOperate(Modules.OperateSharedContractAuthority);
  }
  // 共享登记 - 公司创建
  static canOperateSharedCompanyCreate = () => {
    return authorize.canOperate(Modules.OperateSharedCompanyCreate);
  }
  // 共享登记 - 公司编辑
  static canOperateSharedCompanyUpdate = () => {
    return authorize.canOperate(Modules.OperateSharedCompanyUpdate);
  }
  // 共享登记 - 公司详情
  static canOperateSharedCompanyDetail = () => {
    return authorize.canOperate(Modules.OperateSharedCompanyDetail);
  }
  // 共享登记 - 公司导出
  static canOperateSharedCompanyExport = () => {
    return authorize.canOperate(Modules.OperateSharedCompanyExport);
  }
  // 共享登记 - 公司权限
  static canOperateSharedCompanyAuthority = () => {
    return authorize.canOperate(Modules.OperateSharedCompanyAuthority);
  }
  // 共享登记 - 银行账户创建
  static canOperateSharedBankAccountCreate = () => {
    return authorize.canOperate(Modules.OperateSharedBankAccountCreate);
  }
  // 共享登记 - 银行账户编辑
  static canOperateSharedBankAccountUpdate = () => {
    return authorize.canOperate(Modules.OperateSharedBankAccountUpdate);
  }
  // 共享登记 - 银行账户详情
  static canOperateSharedBankAccountDetail = () => {
    return authorize.canOperate(Modules.OperateSharedBankAccountDetail);
  }
  // 共享登记 - 银行账户导出
  static canOperateSharedBankAccountExport = () => {
    return authorize.canOperate(Modules.OperateSharedBankAccountExport);
  }
  // 共享登记 - 银行账户权限
  static canOperateSharedBankAccountAuthority = () => {
    return authorize.canOperate(Modules.OperateSharedBankAccountAuthority);
  }
  // 共享登记 - 证照创建
  static canOperateSharedLicenseCreate = () => {
    return authorize.canOperate(Modules.OperateSharedLicenseCreate);
  }
  // 共享登记 - 证照编辑
  static canOperateSharedLicenseUpdate = () => {
    return authorize.canOperate(Modules.OperateSharedLicenseUpdate);
  }
  // 共享登记 - 证照详情
  static canOperateSharedLicenseDetail = () => {
    return authorize.canOperate(Modules.OperateSharedLicenseDetail);
  }
  // 共享登记 - 证照导出
  static canOperateSharedLicenseExport = () => {
    return authorize.canOperate(Modules.OperateSharedLicenseExport);
  }
  // 共享登记 - 证照权限
  static canOperateSharedLicenseAuthority = () => {
    return authorize.canOperate(Modules.OperateSharedLicenseAuthority);
  }
  // 共享登记 - 印章创建
  static canOperateSharedSealCreate = () => {
    return authorize.canOperate(Modules.OperateSharedSealCreate);
  }
  // 共享登记 - 印章编辑
  static canOperateSharedSealUpdate = () => {
    return authorize.canOperate(Modules.OperateSharedSealUpdate);
  }
  // 共享登记 - 印章详情
  static canOperateSharedSealDetail = () => {
    return authorize.canOperate(Modules.OperateSharedSealDetail);
  }
  // 共享登记 - 印章导出
  static canOperateSharedSealExport = () => {
    return authorize.canOperate(Modules.OperateSharedSealExport);
  }
  // 共享登记 - 印章权限
  static canOperateSharedSealAuthority = () => {
    return authorize.canOperate(Modules.OperateSharedSealAuthority);
  }

  // NOTE: 服务费结算----------------------------------
  // 骑士添加标签
  static canOperateFinanceConfigTagsCreate = () => {
    return authorize.canOperate(Modules.canOperateFinanceConfigTagsCreate);
  }
  // 骑士移除标签
  static canOperateFinanceConfigTagsDelete = () => {
    return authorize.canOperate(Modules.canOperateFinanceConfigTagsDelete);
  }
  // 服务费方案创建
  static canOperateFinancePlanCreate = () => {
    return authorize.canOperate(Modules.OperateFinancePlanCreate);
  }
  // 服务费方案试算服务费开始试算
  static canOperateFinancePlanTrial = () => {
    return authorize.canOperate(Modules.OperateFinancePlanTrial);
  }
  // 服务费方案试算服务费提交审核
  static canOperateFinancePlanonSubmit = () => {
    return authorize.canOperate(Modules.OperateFinancePlanonSubmit);
  }
  // 服务费方案试算服务费导出数据
  static canOperateFinancePlanExportData = () => {
    return authorize.canOperate(Modules.OperateFinancePlanExportData);
  }
  // 服务费方案规则集创建
  static canOperateFinancePlanRulesCreate = () => {
    return authorize.canOperate(Modules.OperateFinancePlanRulesCreate);
  }
  // 服务费方案规则集编辑（高级编辑模式、修改方案）
  static canOperateFinancePlanRulesUpdate = () => {
    return authorize.canOperate(Modules.OperateFinancePlanRulesUpdate);
  }
  // 服务费方案规则互斥互补操作
  static canOperateFinancePlanRulesMutualExclusion = () => {
    return authorize.canOperate(Modules.OperateFinancePlanRulesMutualExclusion);
  }
  // 服务费方案版本删除
  static canOperateFinancePlanVersionDelete = () => {
    return authorize.canOperate(Modules.OperateFinancePlanVersionDelete);
  }
  // 服务费方案版本取消生效
  static canOperateFinancePlanVersionToDraft = () => {
    return authorize.canOperate(Modules.OperateFinancePlanVersionToDraft);
  }
  // 调薪
  static canOperateFinancePlanVersionCreateDraft = () => {
    return authorize.canOperate(Modules.OperateFinancePlanVersionCreateDraft);
  }
  // 服务费方案规则编辑、保存、删除
  static canOperateFinancePlanRuleUpdate = () => {
    return authorize.canOperate(Modules.OperateFinancePlanRuleUpdate);
  }
  // 服务费方案规则上移、下移
  static canOperateFinancePlanRuleMove = () => {
    return authorize.canOperate(Modules.OperateFinancePlanRuleMove);
  }
  // 创建结算计划
  static canOperateFinanceManageTaskCreate = () => {
    return authorize.canOperate(Modules.OperateFinanceManageTaskCreate);
  }
  // 结算任务启用
  static canOperateFinanceManageTaskEnable = () => {
    return authorize.canOperate(Modules.OperateFinanceManageTaskEnable);
  }
  // 结算任务禁用
  static canOperateFinanceManageTaskDisable = () => {
    return authorize.canOperate(Modules.OperateFinanceManageTaskDisable);
  }
  // 结算汇总查询，提交结算单审核
  static canOperateFinanceManageSummarySubmit = () => {
    return authorize.canOperate(Modules.OperateFinanceManageSummarySubmit);
  }
  // 服务费发放，下载结算单
  static canOperateFinanceManageSummaryDownload = () => {
    return authorize.canOperate(Modules.OperateFinanceManageSummaryDownload);
  }
  // 服务费发放，下载结算单模版
  static canOperateFinanceManageSummaryModalDownload = () => {
    return authorize.canOperate(Modules.OperateFinanceManageSummaryModalDownload);
  }
  // 服务费发放，上传结算单表格
  static canOperateFinanceManageSummaryUpload = () => {
    return authorize.canOperate(Modules.OperateFinanceManageSummaryUpload);
  }
  // 结算单汇总, 运营补扣款模版下载
  static canOperateFinanceManageOperatingModalDownload = () => {
    return authorize.canOperate(Modules.OperateFinanceManageOperatingModalDownload);
  }
  // 结算单汇总, 运营补扣款文件上传
  static canOperateFinanceManageOperatingUpload= () => {
    return authorize.canOperate(Modules.OperateFinanceManageOperatingUpload);
  }
  // 结算查询列表，批量缓发按钮(城市经理，城市助理)
  static canOperateFinanceManageSummaryDelay = () => {
    return authorize.canOperate(Modules.OperateFinanceManageSummaryDelay);
  }

  // NOTE: 系统管理----------------------------------

  // 运营管理录入,更改公司名称(运营管理)
  static canOperateSystemManageCompanyUpdate = () => {
    return authorize.canOperate(Modules.OperateSystemManageCompanyUpdate);
  }
  // 合同归属详情按钮操作
  static canOperateSystemManageCompanyDetail = () => {
    return authorize.canOperate(Modules.OperateSystemManageCompanyDetail);
  }
  // 运营管理录入,添加公司名称(运营管理)
  static canOperateSystemManageCompanyCreate = () => {
    return authorize.canOperate(Modules.OperateSystemManageCompanyCreate);
  }
  // 账号管理,添加编辑用户人员信息确认(总监到站长)
  static canOperateSystemAccountManageVerifyEmployee = () => {
    return authorize.canOperate(Modules.OperateSystemAccountManageVerifyEmployee);
  }
  // 账号管理,编辑用户按钮操作
  static canOperateSystemAccountManageUpdate = () => {
    return authorize.canOperate(Modules.OperateSystemAccountManageUpdate);
  }
  // 账号管理,用户详情按钮操作
  static canOperateSystemAccountManageDatails = () => {
    return authorize.canOperate(Modules.OperateSystemAccountManageDatails);
  }
  // 添加、编辑、全部解除关联账号
  static canOperateSystemAccountReleatedUpdate = () => {
    return authorize.canOperate(Modules.OperateSystemAccountReleatedUpdate);
  }
  // 新建、编辑供应商
  static canOperateSystemSupplierUpdate = () => {
    return authorize.canOperate(Modules.OperateSystemSupplierUpdate);
  }
  // 启用、停用供应商
  static canOperateSystemSupplierUpdateState = () => {
    return authorize.canOperate(Modules.OperateSystemSupplierUpdateState);
  }

  // 编辑城市按钮
  static canOperateSystemCityUpdate = () => {
    return authorize.canOperate(Modules.OperateSystemCityUpdate);
  }

  // 添加商圈按钮
  static canOperateAssectsAdministrationCreate = () => {
    return authorize.canOperate(Modules.OperateAssectsAdministrationCreate);
  }
  // 查看商圈变更记录
  static canOperateAssetsChangeLog = () => {
    return authorize.canOperate(Modules.OperateAssetsChangeLog);
  }

  // 添加标签按钮
  static canOperateAssectsAdministrationTagCreate = () => {
    return authorize.canOperate(Modules.OperateAssectsAdministrationTagCreate);
  }

  // 编辑标签按钮
  static canOperateAssectsAdministrationTagUpdate = () => {
    return authorize.canOperate(Modules.OperateAssectsAdministrationTagUpdate);
  }

  // 停用标签按钮
  static canOperateAssectsAdministrationTagDelete = () => {
    return authorize.canOperate(Modules.OperateAssectsAdministrationTagDelete);
  }

  // 设置标签按钮
  static canOperateAssectsAdministrationTagSet = () => {
    return authorize.canOperate(Modules.OperateAssectsAdministrationTagSet);
  }

  // 批量设置标签按钮
  static canOperateAssectsAdministrationTagBatchSet = () => {
    return authorize.canOperate(Modules.OperateAssectsAdministrationTagBatchSet);
  }

  // 批量设置标签按钮
  static canOperateAssectsAdministrationTagBatchDelete = () => {
    return authorize.canOperate(Modules.OperateAssectsAdministrationTagBatchDelete);
  }

  // 业务分布情况(城市)
  static canOperateModuleSystemSupplierScopeCity = () => {
    return authorize.canAccess(Modules.ModuleSystemSupplierScopeCity.path);
  }

  // 服务商配置编辑操作
  static canOperateSystemMerchantsUpdate = () => {
    return authorize.canOperate(Modules.OperateSystemMerchantsUpdate);
  }

  // 服务商配置创建操作
  static canOperateSystemMerchantsCreate = () => {
    return authorize.canOperate(Modules.OperateSystemMerchantsCreate);
  }

  // 服务商配置详情操作
  static canOperateSystemMerchantsDetail = () => {
    return authorize.canOperate(Modules.OperateSystemMerchantsDetail);
  }

  // NOTE: 费用分组--------------------------------
  // 审批流查看
  static canOperateExpenseExamineFlowDetail = () => {
    return authorize.canAccess(Modules.ModuleExpenseExamineFlowDetail.path);
  }
  // 审批流编辑新建
  static canOperateExpenseExamineUpdate = () => {
    return authorize.canOperate(Modules.OperateExpenseExamineUpdate);
  }
  // code/team审批流
  static canOperateExpenseRelationExamineFlowCodeTeam = () => {
    return authorize.canOperate(Modules.OperateExpenseRelationExamineFlowCodeTeam);
  }
  // code/team审批流详情
  static canOperateExpenseRelationExamineFlowCodeTeamDetail = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowCodeTeamDetail.path);
  }
  // code/team审批流创建
  static canOperateExpenseRelationExamineFlowCodeTeamCreate = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowCodeTeamCreate.path);
  }
  // code/team审批流编辑
  static canOperateExpenseRelationExamineFlowCodeTeamUpdate = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowCodeTeamUpdate.path);
  }
  // 删除、禁用、启用
  static canOperateExpenseRelationExamineFlowCodeTeamUpdateState = () => {
    return authorize.canOperate(Modules.OperateExpenseRelationExamineFlowCodeTeamUpdateState);
  }
  // 事务审批流
  static canOperateExpenseRelationExamineFlowAffair = () => {
    return authorize.canOperate(Modules.OperateExpenseRelationExamineFlowAffair);
  }
  // 事务审批流详情
  static canOperateExpenseRelationExamineFlowAffairDetail = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowAffairDetail.path);
  }
  // 事务审批流创建
  static canOperateExpenseRelationExamineFlowAffairCreate = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowAffairCreate.path);
  }
  // 事务审批流编辑
  static canOperateExpenseRelationExamineFlowAffairUpdate = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowAffairUpdate.path);
  }
  // 事务（删除、禁用、启用）
  static canOperateExpenseRelationExamineFlowAffairUpdateState = () => {
    return authorize.canOperate(Modules.OperateExpenseRelationExamineFlowAffairUpdateState);
  }
  // 成本类审批流
  static canOperateExpenseRelationExamineFlowCost = () => {
    return authorize.canOperate(Modules.OperateExpenseRelationExamineFlowCost);
  }
  // 成本类审批流详情
  static canOperateExpenseRelationExamineFlowCostDetail = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowCostDetail.path);
  }
  // 成本类审批流创建
  static canOperateExpenseRelationExamineFlowCostCreate = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowCostCreate.path);
  }
  // 成本类审批流编辑
  static canOperateExpenseRelationExamineFlowCostUpdate = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowCostUpdate.path);
  }
  // 成本类（删除、禁用、启用）
  static canOperateExpenseRelationExamineFlowCostUpdateState = () => {
    return authorize.canOperate(Modules.OperateExpenseRelationExamineFlowCostUpdateState);
  }
  // 非成本类审批流
  static canOperateExpenseRelationExamineFlowNoCost = () => {
    return authorize.canOperate(Modules.OperateExpenseRelationExamineFlowNoCost);
  }
  // 非成本类审批流详情
  static canOperateExpenseRelationExamineFlowNoCostDetail = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowNoCostDetail.path);
  }
  // 非成本类审批流创建
  static canOperateExpenseRelationExamineFlowNoCostCreate = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowNoCostCreate.path);
  }
  // 非成本类审批流编辑
  static canOperateExpenseRelationExamineFlowNoCostUpdate = () => {
    return authorize.canAccess(Modules.ModuleExpenseRelationExamineFlowNoCostUpdate.path);
  }
  // 非成本类（删除、禁用、启用）
  static canOperateExpenseRelationExamineFlowNoCostUpdateState = () => {
    return authorize.canOperate(Modules.OperateExpenseRelationExamineFlowNoCostUpdateState);
  }
  // 费用分组编辑新建
  static canOperateExpenseExpenseTypeUpdate = () => {
    return authorize.canOperate(Modules.OperateExpenseExpenseTypeUpdate);
  }
  // 新建费用申请
  static canOperateExpenseManageCreate = () => {
    return authorize.canOperate(Modules.OperateExpenseManageCreate);
  }
  // 还款页面操作权限
  static canModuleExpenseBorrowing = () => {
    return authorize.canAccess(Modules.ModuleExpenseBorrowing.path);
  }
  // 审批单编辑
  static canOperateExpenseManageEditButton = () => {
    return authorize.canOperate(Modules.OperateExpenseManageEditButton);
  }
   // 审批单退款
  static canOperateExpenseManageRefundButton = () => {
    return authorize.canOperate(Modules.OperateExpenseManageRefundButton);
  }
  // 审批单红冲
  static canOperateExpenseManageRedBluntButton = () => {
    return authorize.canOperate(Modules.OperateExpenseManageRedBluntButton);
  }
  // 审批单审批
  static canOperateExpenseManageApprovalButton = () => {
    return authorize.canOperate(Modules.OperateExpenseManageApprovalButton);
  }
  // 审批单列表tab全部操作
  static canOperateExpenseManageExamineOrderAll = () => {
    return authorize.canOperate(Modules.OperateExpenseManageExamineOrderAll);
  }
   // 审批单列表tab待提报操作
  static canOperateExpenseManageExamineOrderReported = () => {
    return authorize.canOperate(Modules.OperateExpenseManageExamineOrderReported);
  }
  // 审批单列表tab待办操作
  static canOperateExpenseManageExamineOrderStayDo = () => {
    return authorize.canOperate(Modules.OperateExpenseManageExamineOrderStayDo);
  }
  // 审批单列表tab我的提报操作
  static canOperateExpenseManageExamineOrderSubmission = () => {
    return authorize.canOperate(Modules.OperateExpenseManageExamineOrderSubmission);
  }
   // 审批单列表tab我经手的操作
  static canOperateExpenseManageExamineOrderHandle = () => {
    return authorize.canOperate(Modules.OperateExpenseManageExamineOrderHandle);
  }
  // 借款单号跳借款单详情按钮
  static canOperateExpenseBorrowingRouterDetail = () => {
    return authorize.canOperate(Modules.OperateExpenseBorrowingRouterDetail);
  }
  // 查看出差申请详情（操作）
  static canOperateExpenseTravelApplicationDetail = () => {
    return authorize.canOperate(Modules.OperateExpenseTravelApplicationDetail);
  }
  // 出差列表tab全部（操作）
  static canOperateExpenseTravelApplicationAll = () => {
    return authorize.canOperate(Modules.OperateExpenseTravelApplicationAll);
  }
  // 出差列表tab我的（操作）
  static canOperateExpenseTravelApplicationMy = () => {
    return authorize.canOperate(Modules.OperateExpenseTravelApplicationMy);
  }
  // 房屋管理操作权限(操作)
  static canModuleExpenseManageHouse = () => {
    return authorize.canAccess(Modules.ModuleExpenseManageHouse.path);
  }

  // 房屋管理断租续租退租操作权限(操作)
  static canOperateExpenseManageHouseoPeration = () => {
    return authorize.canOperate(Modules.OperateExpenseManageHouseoPeration);
  }
  // 房屋台账导出操作权限(操作)
  static canOperateExpenseManageHouseLedgerExport = () => {
    return authorize.canOperate(Modules.OperateExpenseManageHouseLedgerExport);
  }
  // 费用预算下载模板按钮
  static canOperateExpenseBudgetDownTemplate = () => {
    return authorize.canOperate(Modules.OperateExpenseBudgetDownTemplate);
  }
  // 费用预算上传按钮
  static canOperateExpenseBudgetUpload = () => {
    return authorize.canOperate(Modules.OperateExpenseBudgetUpload);
  }
  // 添加岗位
  static canOperateExpensePostCreate = () => {
    return authorize.canOperate(Modules.OperateExpensePostCreate);
  }
  // 编辑岗位
  static canOperateExpensePostUpdate = () => {
    return authorize.canOperate(Modules.OperateExpensePostUpdate);
  }
  // 启用岗位
  static canOperateExpensePostEnable = () => {
    return authorize.canOperate(Modules.OperateExpensePostEnable);
  }
  // 禁用岗位
  static canOperateExpensePostDisable = () => {
    return authorize.canOperate(Modules.OperateExpensePostDisable);
  }
  // 查看审批流通统计详情
  static canOperateExpenseStatisticsDetail = () => {
    return authorize.canOperate(Modules.OperateExpenseStatisticsDetail);
  }

  // 推荐公司详情按钮
  static canOperateSystemRecommendedCompanyDetail = () => {
    return authorize.canOperate(Modules.OperateSystemRecommendedCompanyDetail);
  }
  // 推荐公司新建、编辑、停用、启用
  static canOperateSystemRecommendedCompanyUpdate = () => {
    return authorize.canOperate(Modules.OperateSystemRecommededCompanyUpdate);
  }
  // 科目新建
  static canOperateExpenseSubjectCreate = () => {
    return authorize.canOperate(Modules.OperateExpenseSubjectCreate);
  }
  // 科目编辑
  static canOperateExpenseSubjectUpdate = () => {
    return authorize.canOperate(Modules.OperateExpenseSubjectUpdate);
  }
  // 科目删除
  static canOperateExpenseSubjectDelete = () => {
    return authorize.canOperate(Modules.OperateExpenseSubjectDelete);
  }
  // 科目启用
  static canOperateExpenseSubjectEnable = () => {
    return authorize.canOperate(Modules.OperateExpenseSubjectEnable);
  }
  // 科目停用
  static canOperateExpenseSubjectDisable = () => {
    return authorize.canOperate(Modules.OperateExpenseSubjectDisable);
  }
  // 科目查看
  static canOperateExpenseSubjectDetail = () => {
    return authorize.canOperate(Modules.OperateExpenseSubjectDetail);
  }
  // 企业付款单、新增付款单（执行付款）操作
  static canOperateEnterprisePaymentUpdate = () => {
    return authorize.canOperate(Modules.OperateEnterprisePaymentUpdate);
  }
  // NOTE: 借还款管理----------------------------------
  // 借款列表tab我的操作
  static canOperateExpenseBorrowOrderMy = () => {
    return authorize.canOperate(Modules.OperateExpenseBorrowOrderMy);
  }
  // 借款列表tab全部操作
  static canOperateExpenseBorrowOrderAll = () => {
    return authorize.canOperate(Modules.OperateExpenseBorrowOrderAll);
  }
  // 借款单详情查看
  static canOperateExpenseBorrowOrderDetail = () => {
    return authorize.canOperate(Modules.OperateExpenseBorrowOrderDetail);
  }
  // 还款单详情查看
  static canOperateExpenseRepaymentOrderDetail = () => {
    return authorize.canOperate(Modules.OperateExpenseRepaymentOrderDetail);
  }
  // 还款单创建
  static canOperateExpenseRepaymentOrderCreate = () => {
    return authorize.canOperate(Modules.OperateExpenseRepaymentOrderCreate);
  }
  // 还款列表tab全部操作
  static canOperateExpenseRepaymentOrderAll = () => {
    return authorize.canOperate(Modules.OperateExpenseRepaymentOrderAll);
  }
  // 还款列表tab我的操作
  static canOperateExpenseRepaymentOrderMy = () => {
    return authorize.canOperate(Modules.OperateExpenseRepaymentOrderMy);
  }

  // 请假管理（我的）
  static canOperateExpenseAttendanceTakeLeaveMy = () => {
    return authorize.canOperate(Modules.OperateExpenseAttendanceTakeLeaveMy);
  }

  // 请假管理（全部）
  static canOperateExpenseAttendanceTakeLeaveAll = () => {
    return authorize.canOperate(Modules.OperateExpenseAttendanceTakeLeaveAll);
  }

  // 加班管理（我的）
  static canOperateExpenseOverTimeMy = () => {
    return authorize.canOperate(Modules.OperateExpenseAttendanceOverTimeMy);
  }

  // 加班管理（全部）
  static canOperateExpenseOverTimeAll = () => {
    return authorize.canOperate(Modules.OperateExpenseAttendanceOverTimeAll);
  }

  // NOTE: 白名单-------------------------------------

  // 白名单创建
  static canOperateWhiteListCreate = () => {
    return authorize.canOperate(Modules.OperateWhiteListCreate);
  }
  // 关闭操作（按钮）
  static canOperateWhiteListDelete = () => {
    return authorize.canOperate(Modules.OperateWhiteListDelete);
  }
  // 编辑（按钮）
  static canOperateWhiteListUpdate = () => {
    return authorize.canOperate(Modules.OperateWhiteListUpdate);
  }
  // 详情（按钮）
  static canOperateWhiteListDetail = () => {
    return authorize.canOperate(Modules.OperateWhiteListDetail);
  }

  // NOTE: 公告接收人-------------------------------------
  // 公告接收人 权限详情操作（按钮）
  static canOperateAnnouncementPermissionsDetail = () => {
    return authorize.canOperate(Modules.OperateAnnouncementPermissionsDetail);
  }
  // 公告接收人 权限创建操作（按钮）
  static canOperateAnnouncementPermissionsCreate = () => {
    return authorize.canOperate(Modules.OperateAnnouncementPermissionsCreate);
  }
  // 公告接收人 权限编辑操作（按钮）
  static canOperateAnnouncementPermissionsUpdate = () => {
    return authorize.canOperate(Modules.OperateAnnouncementPermissionsUpdate);
  }

  // 业主管理 导出权限
  static canOperateTeamManagerExport = () => {
    return authorize.canOperate(Modules.OperateTeamManagerExport);
  }

  // 业主管理 导出无业主商圈权限
  static canOperateTeamManagerExportNotOwner = () => {
    return authorize.canOperate(Modules.OperateTeamManagerExportNotOwner);
  }

  // 业主管理 新增业主团队权限
  static canOperateTeamManagerCreate = () => {
    return authorize.canOperate(Modules.OperateTeamManagerCreate);
  }

  // 业主管理 查看权限
  static canOperateTeamManagerDetail = () => {
    return authorize.canOperate(Modules.OperateTeamManagerDetail);
  }

  // 业主管理 变更业主权限
  static canOperateTeamManagerUpdateOwner = () => {
    return authorize.canOperate(Modules.OperateTeamManagerUpdateOwner);
  }

  // 业主管理 解散团队权限
  static canOperateTeamManagerDissolution = () => {
    return authorize.canOperate(Modules.OperateTeamManagerDissolution);
  }

  // 业主管理 编辑权限
  static canOperateTeamManagerUpdate = () => {
    return authorize.canOperate(Modules.OperateTeamManagerUpdate);
  }

  // 私教资产隶属管理 - 私教团队管理(按钮)
  static canOperateTeamTeacherManageOwnerTeam = () => {
    return authorize.canOperate(Modules.OperateTeamTeacherManageOwnerTeam);
  }

  // 私教资产隶属管理 - 关联业主(按钮)
  static canOperateTeamTeacherManageOwnerCreate = () => {
    return authorize.canOperate(Modules.OperateTeamTeacherManageOwnerCreate);
  }

  // 私教资产隶属管理 - 变更业主(按钮)
  static canOperateTeamTeacherManageOwnerChange = () => {
    return authorize.canOperate(Modules.OperateTeamTeacherManageOwnerChange);
  }

  // 私教资产隶属管理 - 终止关联业主(按钮)
  static canOperateTeamTeacherManageOwnerStop = () => {
    return authorize.canOperate(Modules.OperateTeamTeacherManageOwnerStop);
  }

  // 私教资产隶属管理 - 取消变更(按钮)
  static canOperateTeamTeacherManageChangeCancel = () => {
    return authorize.canOperate(Modules.OperateTeamTeacherManageChangeCancel);
  }

  // 私教运营管理 - 修改(按钮)
  static canOperateTeamTeacherManageOperationsEdit = () => {
    return authorize.canOperate(Modules.OperateTeamTeacherManageOperationsEdit);
  }

  // 私教运营管理 - 批量修改(按钮)
  static canOperateTeamTeacherManageOperationsBatchEdit = () => {
    return authorize.canOperate(Modules.OperateTeamTeacherManageOperationsBatchEdit);
  }

  // 私教管理记录 - 更换私教管理(按钮)
  static canOperateTeamTeacherManageChange = () => {
    return authorize.canOperate(Modules.OperateTeamTeacherManageChange);
  }

  // 组织架构 - 部门管理 - 设置部门负责人（按钮）
  static canOperateOrganizationManageDepartmentManager = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDepartmentManager);
  }

  // 组织架构 - 部门管理 - 新建部门（按钮）
  static canOperateOrganizationManageDepartmentCreate = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDepartmentCreate);
  }

  // 组织架构 - 部门管理 - 编辑部门（按钮）
  static canOperateOrganizationManageDepartmentUpdate = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDepartmentUpdate);
  }

  // 组织架构 - 部门管理 - 撤销部门（按钮）
  static canOperateOrganizationManageDepartmentDelete = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDepartmentDelete);
  }

  // 组织架构 - 部门管理 - 导出部门编制数报表（按钮）
  static canOperateOrganizationManageDepartmentExport = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDepartmentExport);
  }

  // 组织架构 - 部门管理 - 添加部门员工（按钮）
  static canOperateOrganizationManageDepartmentEmployeeCreate = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDepartmentEmployeeCreate);
  }

  // 组织架构 - 部门管理 - 编辑部门员工（按钮）
  static canOperateOrganizationManageDepartmentEmployeeUpdate = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDepartmentEmployeeUpdate);
  }

  // 组织架构 - 部门管理 - 查看部门员工（按钮）
  static canOperateOrganizationManageDepartmentEmployeeDetail = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDepartmentEmployeeDetail);
  }

  // 组织架构 - 部门管理 - 批量导出部门员工（按钮）
  static canOperateOrganizationManageDepartmentEmployeeExport = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDepartmentEmployeeExport);
  }

  // 组织架构 - 部门管理 - 新建岗位（按钮）
  static canOperateOrganizationManageStaffsCreate = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageStaffsCreate);
  }

  // 组织架构 - 部门管理 - 编辑岗位（按钮）
  static canOperateOrganizationManageStaffsUpdate = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageStaffsUpdate);
  }

  // 组织架构 - 部门管理 - 删除岗位（按钮）
  static canOperateOrganizationManageStaffsDelete = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageStaffsDelete);
  }

  // 组织架构 - 部门管理 - 增编（按钮）
  static canOperateOrganizationManageStaffsAddendum = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageStaffsAddendum);
  }

  // 组织架构 - 部门管理 - 减编（按钮）
  static canOperateOrganizationManageStaffsReduction = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageStaffsReduction);
  }

  // 组织架构 - 部门管理 - 业务信息&数据权限（tab）
  static canOperateOrganizationManageDepartmentBusiness = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDepartmentBusiness);
  }

  // 组织架构 - 业务信息 - 添加业务信息（按钮）
  static canOperateOrganizationManageAttributesCreate = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageAttributesCreate);
  }

  // 组织架构 - 业务信息- 编辑业务信息（按钮）
  static canOperateOrganizationManageAttributesUpdate = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageAttributesUpdate);
  }
    // 组织架构 - 业务信息- 创建数据权限范围（按钮）
  static canOperateOrganizationManageDataPermissionCreate = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDataPermissionCreate);
  }
    // 组织架构 - 业务信息- 编辑数据权限范围（按钮）
  static canOperateOrganizationManageDataPermissionUpdate = () => {
    return authorize.canOperate(Modules.OperateOrganizationManageDataPermissionUpdate);
  }

  // 组织架构 - 岗位管理 - 新建岗位（按钮）
  static canOperateOrganizationStaffsCreate = () => {
    return authorize.canOperate(Modules.OperateOrganizationStaffsCreate);
  }

  // 组织架构 - 岗位管理 - 编辑岗位（按钮）
  static canOperateOrganizationStaffsUpdate = () => {
    return authorize.canOperate(Modules.OperateOrganizationStaffsUpdate);
  }

  // 组织架构 - 岗位管理 - 删除岗位（按钮）
  static canOperateOrganizationStaffsDelete = () => {
    return authorize.canOperate(Modules.OperateOrganizationStaffsDelete);
  }

  // Q钱包 - 支付账单 - 详情
  static canOperateWalletBillsDetail = () => {
    return authorize.canAccess(Modules.ModuleWalletBillsDetail.path);
  }

  // Q钱包 - 支付账单 - 付款/批量付款
  static canOperateWalletBillsPay = () => {
    return authorize.canOperate(Modules.OperateWalletBillsPay);
  }

  // Q钱包 = 支付账单 - 导出报表
  static canOperateWalletBillsExport = () => {
    return authorize.canOperate(Modules.OperateWalletBillsExport);
  }

  // Q钱包 - 钱包明细 - 导出报表
  static canOperateWalletDetailExport = () => {
    return authorize.canOperate(Modules.OperateWalletDetailExport);
  }
  // Code/Team审批管理 - 发起审批 - 费控申请
  static canOperateCodeDocumentManageExpense = () => {
    return authorize.canOperate(Modules.OperateCodeDocumentManageExpense);
  }
  // Code/Team审批管理 - 发起审批 - 费控申请 - code申请
  static canOperateCodeDocumentManageExpenseCode = () => {
    return authorize.canOperate(Modules.OperateCodeDocumentManageExpenseCode);
  }
  // Code/Team审批管理 - 发起审批 - 费控申请 - team申请
  static canOperateCodeDocumentManageExpenseTeam = () => {
    return authorize.canOperate(Modules.OperateCodeDocumentManageExpenseTeam);
  }

  // Code/Team审批管理 - 付款审批
  static canOperateModuleCodePayOrder = () => {
    return authorize.canAccess(Modules.ModuleCodePayOrder.path);
  }
  // Code/Team审批管理 - 事务审批
  static canOperateModuleCodeManageOAOrder = () => {
    return authorize.canAccess(Modules.ModuleCodeManageOAOrder.path);
  }

  // 审批中心 - 发起审批 - 事务申请
  static canOperateModuleOADocumentManage = () => {
    return authorize.canAccess(Modules.ModuleOADocumentManage.path);
  }
  // code审批管理 - 审批流详情查看
  static canOperateModuleCodeFlowDetail = () => {
    return authorize.canAccess(Modules.ModuleCodeFlowDetail.path);
  }

  // code审批管理 - 审批流操作（编辑/启用/停用/删除）
  static canOperateModuleCodeFlowOp = () => {
    return authorize.canOperate(Modules.OperateCodeFlowCreate);
  }

  // code审批管理 - 付款规则编辑
  static canOperateCodePaymentRuleUpdate = () => {
    return authorize.canOperate(Modules.OperateCodePaymentRuleUpdate);
  }

  // code审批管理 - 事项编辑
  static canOperateOperateCodeMatterUpdate = () => {
    return authorize.canOperate(Modules.OperateCodeMatterUpdate);
  }

  // code审批管理 - 事项链接操作(新建，编辑，删除，查看)
  static canOperateOperateCodeMatterLinkOp = () => {
    return authorize.canOperate(Modules.OperateCodeMatterLinkOp);
  }

  // code审批管理 - 审批单列表Tab(我待办/我提报/待提报/我经手)
  static canOperateOperateCodeApproveOrderTabOther = () => {
    return authorize.canOperate(Modules.OperateCodeApproveOrderTabOther);
  }

  // code审批管理 - 审批单列表Tab(全部)
  static canOperateOperateCodeApproveOrderTabAll = () => {
    return authorize.canOperate(Modules.OperateCodeApproveOrderTabAll);
  }

  // code审批管理 - 审批单详情及审批
  static canOperateModuleCodeOrderDetail = () => {
    return authorize.canAccess(Modules.ModuleCodeOrderDetail.path);
  }

  // code审批管理 - 审批单操作（编辑，删除，撤回，关闭）
  static canOperateOperateCodeApproveOrderOp = () => {
    return authorize.canOperate(Modules.OperateCodeApproveOrderOp);
  }

  // code审批管理 - 记录明细详情（查看操作）
  static canOperateModuleCodeRecordDetail = () => {
    return authorize.canAccess(Modules.ModuleCodeRecordDetail.path);
  }

  // code审批管理 - 记录明细导出
  static canOperateOperateCodeRecordExport = () => {
    return authorize.canOperate(Modules.OperateCodeRecordExport);
  }

  // 摊销管理 - 摊销确认操作
  static canOperateCostAmortizationOption = () => {
    return authorize.canOperate(Modules.OperateCostAmortizationOption);
  }

  // 摊销管理 - 摊销确认详情页
  static canOperateCostAmortizationDetail = () => {
    return authorize.canAccess(Modules.ModuleCostAmortizationDetail.path);
  }

  // 摊销管理 - 摊销确认 - 全部数据
  static canOperateCostAmortizationConfirmAllData = () => {
    return authorize.canOperate(Modules.OperateCostAmortizationConfirmAllData);
  }

  // 摊销管理 - 摊销明细 - 全部数据
  static canOperateCostAmortizationLedgerAllData = () => {
    return authorize.canOperate(Modules.OperateCostAmortizationLedgerAllData);
  }

  // 系统关联 - 组件详情
  static canOperateSystemContractTemplateComponentDetail = () => {
    return authorize.canAccess(Modules.ModuleSystemContractTemplateComponentDetail.path);
  }
}
export default Operate;

export const {
  canModuleExpenseManageHouse,
  canOperateExpenseManageCreate,
  canOperateSystemAccountManageVerifyEmployee,
  canOperateSystemAccountManageUpdate,
  canOperateAdminManagementCodeRoles,
  canOperateModuleCodePayOrder,
  canOperateCodeDocumentManageExpenseTeam,
  canOperateSystemAccountManageDatails,
  canModuleExpenseBorrowing,
  canOperateModuleCodeManageOAOrder,
  canOperateExpenseManageHouseoPeration,
  canOperateModuleOADocumentManage,
  canOperateCodeDocumentManageExpense,
  canOperateCodeDocumentManageExpenseCode,
} = Operate;
