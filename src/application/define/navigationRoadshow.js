// 导航栏菜单结构
import Modules from './modules';

export default [
  // 首页
  {
    module: Modules.ModuleCodeHome,
  },

  // 超级管理
  {
    module: Modules.MenuAdmin,
    routes: [
      // 权限管理
      { module: Modules.ModuleAdminAuthorize },
      // 角色管理
      { module: Modules.ModuleAdminManagementRoles },
    ],
  },
  // 组织架构
  {
    module: Modules.MenuOrganization,
    routes: [
      // 部门管理
      {
        module: Modules.ModuleOrganizationManageDepartment,
      },
      // 岗位管理
      { module: Modules.ModuleOrganizationStaffs },
      // 操作日志
      { module: Modules.ModuleOrganizationOperationLog },
    ],
  },

  // 人员管理
  {
    module: Modules.MenuEmployee,
    routes: [
      // 人员档案
      {
        module: Modules.ModuleEmployeeManage,
        relative: [
          // 档案详情
          {
            module: Modules.ModuleEmployeeDetail,
            relative: [
              // 劳动者历史记录
              { module: Modules.ModuleEmployeeDetailHistoryInfo },
              // 劳动者历史合同信息
              { module: Modules.ModuleEmployeeDetailHistoryContractInfo },
              // 劳动者历史工作信息
              { module: Modules.ModuleEmployeeDetailHistoryWorkInfo },
              // 劳动者历史三方id
              { module: Modules.ModuleEmployeeDetailHistoryTripartiteId },
              // 劳动者个户注册
              { module: Modules.ModuleEmployeeDetailIndividual },
            ],
          },
          // 编辑档案
          { module: Modules.ModuleEmployeeUpdate },
          // 添加档案
          { module: Modules.ModuleEmployeeCreate },
          // 档案变更记录
          { module: Modules.ModuleEmployeeFileRecord },
        ],
      },
      // 人员异动管理
      {
        module: Modules.ModuleEmployeeTurnover,
        relative: [
          // 人员异动管理详情
          { module: Modules.ModuleEmployeeTurnoverDetail },
          // 人员异动管理创建
          { module: Modules.ModuleEmployeeTurnoverCreate },
          // 人员管理编辑
          { module: Modules.ModuleEmployeeTurnoverUpdate },
        ],
      },
      // 合同归属管理
      { module: Modules.ModuleSystemManageCompany },
      // 推荐公司管理
      {
        module: Modules.ModuleSystemRecommendedCompany,
        relative: {
          module: Modules.ModuleSystemRecommendedCompanyDetail,
        },
      },
      {
        // 个户注册数据
        module: Modules.ModuleEmployeeStatisticsData,
      },
      {
        // 社保配置管理
        module: Modules.ModuleEmployeeSociety,
        relative: [
          // 社保配置新增
          { module: Modules.ModuleEmployeeSocietyCreate },
          // 社保配置编辑
          { module: Modules.ModuleEmployeeSocietyUpdate },
          // 社保配置详情
          { module: Modules.ModuleEmployeeSocietyDetail },
        ],
      },
    ],
  },

  // 物资管理
  {
    module: Modules.MenuSupply,
    routes: [
      // 物资设置
      { module: Modules.ModuleSupplySetting },
      // 采购入库明细
      { module: Modules.ModuleSupplyProcurement },
      // 发放明细
      { module: Modules.ModuleSupplyDistribution },
      // 扣款汇总
      {
        module: Modules.ModulesSupplyDeductSummarize,
        relative: [
          {
            module: Modules.ModulesSupplyDeductSummarizeDetail,
          },
        ],
      },
      // 扣款明细
      { module: Modules.ModuleSupplyDeductions },
      // 物资台账
      { module: Modules.ModuleSupplyDetails },
    ],
  },

  // 共享登记
  {
    module: Modules.MenuShared,
    routes: [
      // 合同列表
      {
        module: Modules.ModuleSharedContract,
        relative: [
          // 合同编辑
          { module: Modules.ModuleSharedContractForm },
          // 合同详情
          { module: Modules.ModuleSharedContractDetail },
        ],
      },
      // 公司列表
      {
        module: Modules.ModuleSharedCompany,
        relative: [
          // 公司创建
          { module: Modules.ModuleSharedCompanyCreate },
          // 公司编辑
          { module: Modules.ModuleSharedCompanyUpdate },
          // 公司详情
          { module: Modules.ModuleSharedCompanyDetail },
        ],
      },
      // 银行账户列表
      {
        module: Modules.ModuleSharedBankAccount,
        relative: [
          // 银行账户创建
          { module: Modules.ModuleSharedBankAccountCreate },
          // 银行账户编辑
          { module: Modules.ModuleSharedBankAccountUpdate },
          // 银行账户详情
          { module: Modules.ModuleSharedBankAccountDetail },
        ],
      },
      // 证照列表
      {
        module: Modules.ModuleSharedLicense,
        relative: [
          // 证照编辑
          { module: Modules.ModuleSharedLicenseUpdate },
          // 证照新建
          { module: Modules.ModuleSharedLicenseCreate },
          // 证照详情
          { module: Modules.ModuleSharedLicenseDetail },
        ],
      },
      // 印章列表
      {
        module: Modules.ModuleSharedSeal,
        relative: [
          // 印章创建
          { module: Modules.ModuleSharedSealCreate },
          // 印章编辑
          { module: Modules.ModuleSharedSealUpdate },
          // 印章详情
          { module: Modules.ModuleSharedSealDetail },
        ],
      },
    ],
  },

  // Code/Team审批管理
  {
    module: Modules.MenuCodeApprovalAdministration,
    routes: [
      {
        // 基础设置
        module: Modules.MenuCodeBasicSet,
        routes: [
          // Code审批流设置
          {
            module: Modules.ModuleCodeBasicSetProcess,
            relative: [
              // 审批流编辑
              { module: Modules.ModuleCodeFlowForm },
            ],
          },
          // 验票标签库
          { module: Modules.ModuleCodeExpenseTicket },
          // 自定义提报类型
          { module: Modules.ModuleCodeTypeConfigPay },
        ],
      },

      { // 审批中心
        module: Modules.MenuCodeOrderManage,
        routes: [
          // 发起审批
          { module: Modules.ModuleCodeDocumentManage },
          // 费用审批管理
          {
            module: Modules.ModuleCodePayOrder,
            relative: [
              // 审批单详情
              { module: Modules.ModuleCodeOrderDetail },
              // 审批单新建
              { module: Modules.ModuleCodeOrderCreate },
              // 审批单编辑
              { module: Modules.ModuleCodeOrderUpdate },
            ],
          },
          // 事务审批管理
          { module: Modules.ModuleCodeManageOAOrder },
          // 记录明细
          {
            module: Modules.ModuleCodeRecord,
          },
        ],
      },
    ],
  },

  // 摊销管理
  {
    module: Modules.MenuCostAmortization,
    routes: [
      {
        // 摊销确认
        module: Modules.ModuleCostAmortizationConfirm,
        relative: [
          {
            // 摊销详情
            module: Modules.ModuleCostAmortizationDetail,
          },
        ],
      },
      {
       // 台账明细表
        module: Modules.ModuleCostAmortizationLedger,
      },
    ],
  },

  // 审批管理
  {
    module: Modules.MenuExpense,
    routes: [
      // 基础设置
      {
        module: Modules.MenuExpenseControl,
        routes: [
          // 审批流程设置
          {
            module: Modules.ModuleExpenseExamineFlowProcess,
            relative: [
              // 审批流查看页面
              {
                module: Modules.ModuleExpenseExamineFlowDetail,
              },
              // 审批流编辑页面
              {
                module: Modules.ModuleExpenseExamineFlowUpdate,
              },
              // 审批流设置
              {
                module: Modules.ModuleExpenseExamineFlowConfig,
              },
            ],
          },
          // 审批岗位设置
          {
            module: Modules.ModuleExpenseExamineFlowPost,
          },
          // 科目设置
          {
            module: Modules.ModuleExpenseSubject,
            relative: [
              // 费用科目设置创建
              {
                module: Modules.ModuleExpenseSubjectCreate,
              },
              // 费用科目设置设置编辑
              {
                module: Modules.ModuleExpenseSubjectUpdate,
              },
              // 费用科目设置科目详情
              {
                module: Modules.ModuleExpenseSubjectDetails,
              },
            ],
          },
          // 费用分组设置
          {
            module: Modules.ModuleExpenseType,
            relative: [
              // 费用分组设置新建
              {
                module: Modules.ModuleExpenseTypeCreate,
              },
              // 费用分组设置编辑
              {
                module: Modules.ModuleExpenseTypeUpdate,
              },
              // 费用分组设置详情
              {
                module: Modules.ModuleExpenseTypeDetail,
              },
            ],
          },
          // 验票标签库
          {
            module: Modules.ModuleExpenseTicket,
          },
          // 付款审批
          {
            module: Modules.ModuleExpenseManageExamineOrder,
            relative: [
              // 费用申请创建
              { module: Modules.ModuleExpenseManageTemplateCreate },
              // 费用申请编辑
              { module: Modules.ModuleExpenseManageTemplateUpdate },
              // 费用申请详情页
              { module: Modules.ModuleExpenseManageTemplateDetail },
              // 付款审批
              { module: Modules.ModuleExpenseManageExamineOrderCreate },
              // 付款审批详情
              { module: Modules.ModuleExpenseManageExamineOrderDetail },
              // 付款审批打印预览
              { module: Modules.ModuleExpenseManageExamineOrderPrint },
              // 创建差旅报销单
              { module: Modules.ModuleExpenseManageExamineOrderBusinessTravelCreate },
              // 编辑差旅报销单
              { module: Modules.ModuleExpenseManageExamineOrderBusinessTravelUpdate },
              // 创建出差申请单
              { module: Modules.ModuleExpenseManageExamineOrderBusinessTripCreate },
              // 编辑出差申请单
              { module: Modules.ModuleExpenseManageExamineOrderBusinessTripUpdate },
              // 退款审批单编辑
              { module: Modules.ModuleExpenseRefundOrder },
              // 退款费用单编辑
              { module: Modules.ModuleExpenseRefundCostOrder },
              // 红冲审批单编辑
              { module: Modules.ModuleExpenseInvoiceAdjustOrder },
              // 红冲费用单编辑
              { module: Modules.ModuleExpenseInvoiceAdjustCostOrder },
              // 出差详情
              { module: Modules.ModuleExpenseTravelApplicationDetail },
            ],
          },
          // 费用预算 暂时隐藏 @李彩燕 2020-12-01
          // {
          //   module: Modules.ModuleExpenseBudget,
          // },
          // 费用记录明细
          {
            module: Modules.ModuleExpenseManageRecords,
            relative: [
              // 编辑明细列表
              { module: Modules.ModuleExpenseManageRecordsSummaryCreate },
              // 编辑明细记录
              { module: Modules.ModuleExpenseManageRecordsForm },
              // 明细记录详情
              { module: Modules.ModuleExpenseManageRecordsDetail },
            ],
          },
          // 考勤管理
          {
            module: Modules.MenuExpenseAttendance,
            routes: [
              // 请假管理
              {
                module: Modules.ModuleExpenseAttendanceTakeLeave,
                relative: [
                  // 请假管理详情
                  { module: Modules.ModuleExpenseAttendanceTakeLeaveDetail },
                  // 创建请假申请
                  { module: Modules.ModuleExpenseAttendanceTakeLeaveCreate },
                  // 编辑请假申请
                  { module: Modules.ModuleExpenseAttendanceTakeLeaveUpdate },
                ],
              },
              // 加班管理
              {
                module: Modules.ModuleExpenseAttendanceOverTime,
                relative: [
                  // 新建加班费用单
                  { module: Modules.ModuleExpenseAttendanceOverTimeCreate },
                  // 编辑加班费用单
                  { module: Modules.ModuleExpenseAttendanceOverTimeUpdate },
                  // 加班费用单详情
                  { module: Modules.ModuleExpenseAttendanceOverTimeDetail },
                ],
              },
            ],
          },
          // 审批监控
          {
            module: Modules.ModuleExpenseStatistics,
            relative: [
              { module: Modules.ModuleExpenseStatisticsDetail },
            ],
          },
        ],
      },
      // {
      //   // 流程审批
      //   module: Modules.MenuExpenseProcess,
      //   routes: [
      //     // 出差申请
      //     // {
      //     //   module: Modules.ModuleExpenseTravelApplication,
      //     //   relative: [
      //     //   ],
      //     // },
      //     // 借还款管理
      //     // {
      //     //   module: Modules.MenuExpenseBorrowingRepayments,
      //     //   routes: [
      //     //     // 借款管理
      //     //     {
      //     //       module: Modules.ModuleExpenseBorrowing,
      //     //       relative: [
      //     //         // 借款单详情
      //     //         { module: Modules.ModuleExpenseBorrowingDetail },
      //     //         // 创建借款申请单
      //     //         { module: Modules.ModuleExpenseBorrowingCreate },
      //     //         // 编辑借款申请单
      //     //         { module: Modules.ModuleExpenseBorrowingUpdate },
      //     //       ],
      //     //     },
      //     //     // 还款管理
      //     //     {
      //     //       module: Modules.ModuleExpenseRepayments,
      //     //       relative: [
      //     //         // 还款单详情
      //     //         { module: Modules.ModuleExpenseRepaymentsDetail },
      //     //         // 创建还款申请单
      //     //         { module: Modules.ModuleExpenseRepaymentsCreate },
      //     //         // 编辑还款申请单
      //     //         { module: Modules.ModuleExpenseRepaymentsUpdate },
      //     //       ],
      //     //     },
      //     //   ],
      //     // },
      //   ],
      // },
    ],
  },

  // 房屋管理
  {
    module: Modules.MenuExpenseManageHouse,
    routes: [
      // 房屋管理
      {
        module: Modules.ModuleExpenseManageHouse,
        relative: [
          // 新建房屋信息
          { module: Modules.ModuleExpenseManageHouseCreate },
          // 编辑房屋信息
          { module: Modules.ModuleExpenseManageHouseUpdate },
          // 房屋信息明细
          { module: Modules.ModuleExpenseManageHouseDetail },
          // 房屋信息申请
          { module: Modules.ModuleExpenseManageHouseApply },
          // 房屋续租信息编辑
          { module: Modules.ModuleExpenseManageHouseRenewalUpdate },
          // 房屋断租信息编辑
          { module: Modules.ModuleExpenseManageHouseBrokRentUpdate },
          // 房屋退租信息编辑
          { module: Modules.ModuleExpenseManageHouseWithbrawalUpdate },
        ],
      },
    ],
  },

  // 结算设置 暂时隐藏@李彩燕
  // {
  //   module: Modules.MenuFinance,
  //   routes: [
  //     // 基础设置
  //     {
  //       module: Modules.MenuFinanceConfig,
  //       routes: [
  //         // 结算指标设置
  //         { module: Modules.ModuleFinanceConfigIndex },
  //       ],
  //     },

  //     // 服务费方案
  //     {
  //       module: Modules.ModuleFinancePlan,
  //       relative: [
  //         // 服务费规则
  //         {
  //           module: Modules.ModuleFinanceRules,
  //           relative: [
  //             // 服务费规则审批历史
  //             { module: Modules.ModuleFinanceRulesHistory },
  //             // 服务费规则生成
  //             { module: Modules.ModuleFinanceRulesGenerator },
  //             // 服务费试算
  //             {
  //               module: Modules.ModuleFinanceRulesCalculate,
  //               relative: [
  //                 // 服务费试算详情
  //                 { module: Modules.ModuleFinanceRulesCalculateDetail },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },

  //     // 结算管理
  //     {
  //       module: Modules.MenuFinanceManage,
  //       routes: [
  //         // 结算任务设置
  //         {
  //           module: Modules.ModuleFinanceManageTask,
  //         },
  //         // 结算单汇总
  //         {
  //           module: Modules.ModuleFinanceManageSummary,
  //           relative: [
  //             // 城市结算明细
  //             {
  //               module: Modules.ModuleFinanceManageSummaryDetailCity,
  //               relative: [
  //                 // 骑士结算明细
  //                 { module: Modules.ModuleFinanceManageSummaryDetailKnight },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },

  // 业务承揽
  {
    module: Modules.MenuTeamManager,
    routes: [
      // 业主团队管理
      {
        module: Modules.ModuleTeamManager,
        relative: [
          // 业主团队管理-创建业主
          // { module: Modules.ModuleTeamManagerCreate },
          // 业主团队管理-编辑业主
          { module: Modules.ModuleTeamManagerUpdate },
          // 业主团队管理-业主详情
          { module: Modules.ModuleTeamManagerDetail },
        ],
      },
      // 业务承揽记录
      {
        module: Modules.ModuleTeamManagerBusiness,
      },
      // 无业主商圈监控
      {
        module: Modules.ModuleTeamManagerNothingOwner,
      },
    ],
  },

  // 私教资产管理
  {
    module: Modules.MenuTeamTeacher,
    routes: [
      // 私教团队管理
      {
        module: Modules.ModuleTeamTeacherManage,
        relative: [
          // 私教团队管理-编辑
          { module: Modules.ModuleTeamTeacherManageOwnerTeam },
        ],
      },
      // 私教管理记录
      {
        module: Modules.ModuleTeamTeacherManageLog,
      },
      // 私教运营管理 暂时隐藏v10.0.7 @彭悦
      // {
      //   module: Modules.ModuleTeamTeacherManageOperations,
      //   relative: [
      //     // 私教运营管理 - 编辑页
      //     { module: Modules.ModuleTeamTeacherManageOperationsUpdate },
      //   ],
      // },
      // 无私教业主团队监控
      {
        module: Modules.ModuleTeamTeacherMonitoring,
      },
    ],
  },
  // 资产管理
  {
    module: Modules.MenuAssectsAdministration,
    routes: [
        // 商圈管理
      {
        module: Modules.ModuleAssectsAdministrationManage,
        relative: [
            // 添加商圈
            { module: Modules.ModuleAssectsAdministrationCreate },
            // 商圈详情
            { module: Modules.ModuleAssectsAdministrationDetail },
        ],
      },
        // 商圈标签管理
      {
        module: Modules.ModuleAssectsAdministrationTagManage,
      },
    ],
  },

  // 我的账户
  {
    module: Modules.MenuAccount,
    routes: [
      // 我的账户
      { module: Modules.ModuleAccount },
    ],
  },

  // 系统管理
  {
    module: Modules.MenuSystem,
    routes: [
      // 账号管理
      {
        module: Modules.ModuleSystemAccountManage,
        relative: [
          // 账号管理-添加账号
          { module: Modules.ModuleSystemAccountManageCreate },
          // 账号管理-编辑用户
          { module: Modules.ModuleSystemAccountManageUpdate },
          // 账号管理-用户详情
          { module: Modules.ModuleSystemAccountManageDetails },
        ],
      },
      // 关联账号
      { module: Modules.ModuleSystemAccountReleated },
      // 供应商管理
      {
        module: Modules.ModuleSystemSupplierManage,
        relative: [
          // 供应商管理-查看详情 ***
          { module: Modules.ModuleSystemSupplierDetail },
          // 添加供应商
          { module: Modules.ModuleSystemSupplierCreate },
          // 编辑供应商
          { module: Modules.ModuleSystemSupplierUpdate },
          // 业务分布情况(城市)
          { module: Modules.ModuleSystemSupplierScopeCity },
        ],
      },
      // 城市管理
      {
        module: Modules.ModuleSystemCity,
        relative: [
          // 编辑城市
          { module: Modules.ModuleSystemCityUpdate },
          // 城市详情
          { module: Modules.ModuleSystemCityDetail },
        ],
      },
      // 公告接收人 v9.6.0暂时隐藏@李彩燕
      // {
      //   module: Modules.MenuAnnouncementRecipient,
      //   routes: [
      //     // 公告接收人权限列表
      //     {
      //       module: Modules.ModuleAnnouncementPermissions,
      //       relative: [
      //         // 详情
      //         { module: Modules.ModuleAnnouncementPermissionsDetail },
      //         // 创建
      //         { module: Modules.ModuleAnnouncementPermissionsCreate },
      //         // 编辑
      //         { module: Modules.ModuleAnnouncementPermissionsUpdate },
      //       ],
      //     },
      //   ],
      // },
      // 白名单
      {
        module: Modules.ModuleWhiteList,
        relative: [
          // 白名单详情
          { module: Modules.ModuleWhiteListDetail },
          // 白名单创建
          { module: Modules.ModuleWhiteListCreate },
          // 白名单编辑
          { module: Modules.ModuleWhiteListUpdate },
        ],
      },
      // 服务商配置
      {
        module: Modules.ModuleSystemMerchants,
        relative: [
          // 服务商配置详情
          { module: Modules.ModuleSystemMerchantsDetail },
          // 服务商配置创建
          { module: Modules.ModuleSystemMerchantsCreate },
          // 服务商配置编辑
          { module: Modules.ModuleSystemMerchantsUpdate },
        ],
      },
      // 企业付款
      {
        module: Modules.MenuEnterprise,
        routes: [
          // 付款单
          {
            module: Modules.ModuleEnterprisePayment,
            relative: [
              // 新增付款单
              {
                module: Modules.ModuleEnterprisePaymentPaymentOrder,
              },
              // 付款单详情
              {
                module: Modules.ModuleEnterprisePaymentDetail,
              },
            ],
          },
        ],
      },
      // 意见反馈
      {
        module: Modules.ModuleSystemFeedBack,
      },
    ],
  },

  // Q钱包
  {
    module: Modules.MenuWallet,
    routes: [
      // 钱包汇总
      { module: Modules.ModuleWalletSummary },
      // 支付账单
      {
        module: Modules.ModuleWalletBills,
        relative: [
          // 支付账单 - 账单详情
          { module: Modules.ModuleWalletBillsDetail },
        ],
      },
      // 钱包明细
      { module: Modules.ModuleWalletDetail },
    ],
  },
];
