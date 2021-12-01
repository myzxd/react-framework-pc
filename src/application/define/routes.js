/* eslint no-console: ["error", { allow: ["warn", "error", "log"]  }] */
// 路由报Loading错时，页面需要刷新
const onRouteError = (err) => {
  console.log(`DEBUG: 路由调试 ${err}`);
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = err.match(pattern);
  console.log(err);
  // 检测是否有问题
  if (isChunkLoadFailed) {
    console.log('DEBUG: 路由刷新');
    window.location.reload(); // 刷新
  }
};

// 预加载的路由（预加载，页面布局加载前的逻辑判断使用）
const PreLoadRoutes = [
  // 登录相关
  {
    path: '/authorize/:route',
    component: () => import('../../routes/account/authorize/index').catch(err => onRouteError(`${err}`)),
  },
  // 404
  {
    path: '/404',
    component: () => import('../../routes/layout/error').catch(err => onRouteError(`${err}`)),
  },
];

// 模块路由
const ModuleRoutes = [
  // 登录相关
  {
    path: '/authorize/:route',
    component: () => import('../../routes/account/authorize').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------超级管理----------------------
  // 系统信息
  {
    path: '/Admin/System',
    component: () => import('../../routes/admin/system').catch(err => onRouteError(`${err}`)),
  },
  // 模块权限信息
  {
    path: '/Admin/Management/Authorize',
    component: () => import('../../routes/admin/management/authorize').catch(err => onRouteError(`${err}`)),
  },
  // 角色管理
  {
    path: '/Admin/Management/Roles',
    component: () => import('../../routes/admin/management/roles').catch(err => onRouteError(`${err}`)),
  },
  // 开发参考模块
  {
    path: '/Admin/Interface',
    component: () => import('../../routes/admin/interface').catch(err => onRouteError(`${err}`)),
  },
  // 开发参考模块
  {
    path: '/Admin/Developer',
    component: () => import('../../routes/admin/developer').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------组织架构-----------------------
  // OA单据创建
  {
    path: '/OA/Document/',
    component: () => import('../../routes/oa/document/index').catch(err => onRouteError(`${err}`)),
  },
  // OA单据管理动态路由
  {
    path: '/OA/Document/:key/:type',
    component: () => import('../../routes/oa/document/dynamic').catch(err => onRouteError(`${err}`)),
  },


  // -----------------------组织架构-----------------------
  // 部门管理
  {
    path: '/Organization/Manage/Department',
    component: () => import('../../routes/organization/manage/index').catch(err => onRouteError(`${err}`)),
  },
  // 岗位管理
  {
    path: '/Organization/Staffs',
    component: () => import('../../routes/organization/staffs/index').catch(err => onRouteError(`${err}`)),
  },
  // 操作日志
  {
    path: '/Organization/OperationLog',
    component: () => import('../../routes/organization/operationLog').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------Q钱包-----------------------
  // 钱包汇总
  {
    path: '/Wallet/Summary',
    component: () => import('../../routes/wallet/summary/index').catch(err => onRouteError(`${err}`)),
  },
  // 支付账单
  {
    path: '/Wallet/Bills',
    component: () => import('../../routes/wallet/bills/index').catch(err => onRouteError(`${err}`)),
  },
  // 钱包明细
  {
    path: '/Wallet/Detail',
    component: () => import('../../routes/wallet/detail/index').catch(err => onRouteError(`${err}`)),
  },
  // 支付账单 - 账单详情
  {
    path: '/Wallet/Bills/Detail',
    component: () => import('../../routes/wallet/bills/detail').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------人员管理-----------------------
  // 查看人员
  {
    path: '/Employee/Manage',
    component: () => import('../../routes/employee/manage/index').catch(err => onRouteError(`${err}`)),
  },
  // 创建人员
  {
    path: '/Employee/Create',
    component: () => import('../../routes/employee/manage/form').catch(err => onRouteError(`${err}`)),
  },
  // 人员编辑
  {
    path: '/Employee/Update',
    component: () => import('../../routes/employee/manage/form').catch(err => onRouteError(`${err}`)),
  },
  // 人员详情
  {
    path: '/Employee/Detail',
    component: () => import('../../routes/employee/manage/detail').catch(err => onRouteError(`${err}`)),
  },
  // 劳动者历史记录
  {
    path: '/Employee/Detail/HistoryInfo',
    component: () => import('../../routes/employee/manage/components/detail/historyInfo').catch(err => onRouteError(`${err}`)),
  },
  // 劳动者历史合同信息
  {
    path: '/Employee/Detail/HistoryContractInfo',
    component: () => import('../../routes/employee/manage/components/detail/historyContractInfo').catch(err => onRouteError(`${err}`)),
  },
  // 劳动者历史工作信息
  {
    path: '/Employee/Detail/HistoryWorkInfo',
    component: () => import('../../routes/employee/manage/components/detail/historyWorkInfo').catch(err => onRouteError(`${err}`)),
  },
  // 劳动者历史三方id
  {
    path: '/Employee/Detail/HistoryTripartiteId',
    component: () => import('../../routes/employee/manage/components/detail/historyTripartiteId').catch(err => onRouteError(`${err}`)),
  },
  // 劳动者个户注册
  {
    path: '/Employee/Detail/Individual',
    component: () => import('../../routes/employee/manage/components/detail/individual').catch(err => onRouteError(`${err}`)),
  },
  // 人员异动列表
  {
    path: '/Employee/Turnover',
    component: () => import('../../routes/employee/turnover/index').catch(err => onRouteError(`${err}`)),
  },
  // 人员异动列表详情
  {
    path: '/Employee/Turnover/Detail',
    component: () => import('../../routes/employee/turnover/detail').catch(err => onRouteError(`${err}`)),
  },
  // 人员异动列表创建
  {
    path: '/Employee/Turnover/Create',
    component: () => import('../../routes/employee/turnover/create').catch(err => onRouteError(`${err}`)),
  },
  // 人员异动列表编辑
  {
    path: '/Employee/Turnover/Update',
    component: () => import('../../routes/employee/turnover/update').catch(err => onRouteError(`${err}`)),
  },

  // 个户注册数据
  {
    path: '/Employee/StatisticsData',
    component: () => import('../../routes/employee/statisticsData').catch(err => onRouteError(`${err}`)),
  },
  // 确认离职页面
  {
    path: '/Employee/Resign',
    component: () => import('../../routes/employee/manage/menu/resign').catch(err => onRouteError(`${err}`)),
  },

  // 社保配置管理
  {
    path: '/Employee/Society',
    component: () => import('../../routes/employee/society').catch(err => onRouteError(`${err}`)),
  },
  // 社保配置管理新增
  {
    path: '/Employee/Society/Create',
    component: () => import('../../routes/employee/society/form').catch(err => onRouteError(`${err}`)),
  },
  // 社保配置管理编辑
  {
    path: '/Employee/Society/Update',
    component: () => import('../../routes/employee/society/form').catch(err => onRouteError(`${err}`)),
  },
  // 社保配置管理详情
  {
    path: '/Employee/Society/Detail',
    component: () => import('../../routes/employee/society/detail').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------------共享登记------------------------
  // 合同列表
  {
    path: '/Shared/Contract',
    component: () => import('../../routes/shared/contract/index').catch(err => onRouteError(`${err}`)),
  },
  // 合同编辑
  {
    path: '/Shared/Contract/Form',
    component: () => import('../../routes/shared/contract/form').catch(err => onRouteError(`${err}`)),
  },
  // 合同详情
  {
    path: '/Shared/Contract/Detail',
    component: () => import('../../routes/shared/contract/detail').catch(err => onRouteError(`${err}`)),
  },
  // 公司列表
  {
    path: '/Shared/Company',
    component: () => import('../../routes/shared/company/index').catch(err => onRouteError(`${err}`)),
  },
  // 公司创建
  {
    path: '/Shared/Company/Create',
    component: () => import('../../routes/shared/company/create').catch(err => onRouteError(`${err}`)),
  },
  // 公司编辑
  {
    path: '/Shared/Company/Update',
    component: () => import('../../routes/shared/company/update').catch(err => onRouteError(`${err}`)),
  },
  // 公司详情
  {
    path: '/Shared/Company/Detail',
    component: () => import('../../routes/shared/company/detail').catch(err => onRouteError(`${err}`)),
  },
  // 银行账户列表
  {
    path: '/Shared/BankAccount',
    component: () => import('../../routes/shared/bankAccount/index').catch(err => onRouteError(`${err}`)),
  },
  // 银行账户创建
  {
    path: '/Shared/BankAccount/Create',
    component: () => import('../../routes/shared/bankAccount/create').catch(err => onRouteError(`${err}`)),
  },
  // 银行账户编辑
  {
    path: '/Shared/BankAccount/Update',
    component: () => import('../../routes/shared/bankAccount/update').catch(err => onRouteError(`${err}`)),
  },
  // 银行账户详情
  {
    path: '/Shared/BankAccount/Detail',
    component: () => import('../../routes/shared/bankAccount/detail').catch(err => onRouteError(`${err}`)),
  },
  // 印章列表
  {
    path: '/Shared/Seal',
    component: () => import('../../routes/shared/seal/index').catch(err => onRouteError(`${err}`)),
  },
  // 印章创建
  {
    path: '/Shared/Seal/Create',
    component: () => import('../../routes/shared/seal/create').catch(err => onRouteError(`${err}`)),
  },
  // 印章编辑
  {
    path: '/Shared/Seal/Update',
    component: () => import('../../routes/shared/seal/update').catch(err => onRouteError(`${err}`)),
  },
  // 印章详情
  {
    path: '/Shared/Seal/Detail',
    component: () => import('../../routes/shared/seal/detail').catch(err => onRouteError(`${err}`)),
  },
  // 证照列表
  {
    path: '/Shared/License',
    component: () => import('../../routes/shared/license/index').catch(err => onRouteError(`${err}`)),
  },
  // 证照编辑
  {
    path: '/Shared/License/Update',
    component: () => import('../../routes/shared/license/update').catch(err => onRouteError(`${err}`)),
  },
  // 证照新建
  {
    path: '/Shared/License/Create',
    component: () => import('../../routes/shared/license/create').catch(err => onRouteError(`${err}`)),
  },
  // 证照详情
  {
    path: '/Shared/License/Detail',
    component: () => import('../../routes/shared/license/detail').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------------费用管理------------------------
  // 科目设置
  {
    path: '/Expense/Subject',
    component: () => import('../../routes/expense/subject/index').catch(err => onRouteError(`${err}`)),
  },
  // 科目创建
  {
    path: '/Expense/Subject/Create',
    component: () => import('../../routes/expense/subject/create').catch(err => onRouteError(`${err}`)),
  },
  // 科目编辑
  {
    path: '/Expense/Subject/Update',
    component: () => import('../../routes/expense/subject/update').catch(err => onRouteError(`${err}`)),
  },
  // 详情
  {
    path: '/Expense/Subject/Details',
    component: () => import('../../routes/expense/subject/details').catch(err => onRouteError(`${err}`)),
  },
  // 费用分组
  {
    path: '/Expense/Type',
    component: () => import('../../routes/expense/type').catch(err => onRouteError(`${err}`)),
  },
  // 费用分组详情
  {
    path: '/Expense/Type/Detail',
    component: () => import('../../routes/expense/type/detail').catch(err => onRouteError(`${err}`)),
  },
  // 新建费用分组
  {
    path: '/Expense/Type/Create',
    component: () => import('../../routes/expense/type/create').catch(err => onRouteError(`${err}`)),
  },
  // 编辑费用分组
  {
    path: '/Expense/Type/Update',
    component: () => import('../../routes/expense/type/update').catch(err => onRouteError(`${err}`)),
  },
  // 审批流程设置
  {
    path: '/Expense/ExamineFlow/Process',
    component: () => import('../../routes/expense/examineFlow/index').catch(err => onRouteError(`${err}`)),
  },
  // 审批岗位设置
  {
    path: '/Expense/ExamineFlow/Post',
    component: () => import('../../routes/expense/examineFlow/post').catch(err => onRouteError(`${err}`)),
  },
  // 审批流表单页面（编辑，创建）
  {
    path: '/Expense/ExamineFlow/Form',
    component: () => import('../../routes/expense/examineFlow/form').catch(err => onRouteError(`${err}`)),
  },
  // 审批流配置页面
  {
    path: '/Expense/ExamineFlow/Detail',
    component: () => import('../../routes/expense/examineFlow/detail').catch(err => onRouteError(`${err}`)),
  },
  // 审批流配置页面
  {
    path: '/Expense/ExamineFlow/Config',
    component: () => import('../../routes/expense/examineFlow/config/index').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流
  {
    path: '/Expense/RelationExamineFlow',
    component: () => import('../../routes/expense/relationExamineFlow').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - code/team审批流详情
  {
    path: '/Expense/RelationExamineFlow/CodeTeamDetail',
    component: () => import('../../routes/expense/relationExamineFlow/codeTeam/detail').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - code/team审批流创建
  {
    path: '/Expense/RelationExamineFlow/CodeTeamCreate',
    component: () => import('../../routes/expense/relationExamineFlow/codeTeam/create').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - code/team审批流编辑
  {
    path: '/Expense/RelationExamineFlow/CodeTeamUpdate',
    component: () => import('../../routes/expense/relationExamineFlow/codeTeam/update').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - 事务类审批流详情
  {
    path: '/Expense/RelationExamineFlow/AffairDetail',
    component: () => import('../../routes/expense/relationExamineFlow/affair/detail').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - 事务类审批流创建
  {
    path: '/Expense/RelationExamineFlow/AffairCreate',
    component: () => import('../../routes/expense/relationExamineFlow/affair/create').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - 事务类审批流编辑
  {
    path: '/Expense/RelationExamineFlow/AffairUpdate',
    component: () => import('../../routes/expense/relationExamineFlow/affair/update').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - 成本类审批流详情
  {
    path: '/Expense/RelationExamineFlow/CostDetail',
    component: () => import('../../routes/expense/relationExamineFlow/cost/detail').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - 成本类审批流创建
  {
    path: '/Expense/RelationExamineFlow/CostCreate',
    component: () => import('../../routes/expense/relationExamineFlow/cost/create').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - 成本类审批流编辑
  {
    path: '/Expense/RelationExamineFlow/CostUpdate',
    component: () => import('../../routes/expense/relationExamineFlow/cost/update').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - 非成本类审批流详情
  {
    path: '/Expense/RelationExamineFlow/NoCostDetail',
    component: () => import('../../routes/expense/relationExamineFlow/noCost/detail').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - 非成本类审批流创建
  {
    path: '/Expense/RelationExamineFlow/NoCostCreate',
    component: () => import('../../routes/expense/relationExamineFlow/noCost/create').catch(err => onRouteError(`${err}`)),
  },
  // 关联审批流 - 非成本类审批流编辑
  {
    path: '/Expense/RelationExamineFlow/NoCostUpdate',
    component: () => import('../../routes/expense/relationExamineFlow/noCost/update').catch(err => onRouteError(`${err}`)),
  },
  // 付款审批
  {
    path: '/Expense/Manage/OAOrder',
    component: () => import('../../routes/expense/manage/oaOrder/index').catch(err => onRouteError(`${err}`)),
  },
  // 付款审批
  {
    path: '/Expense/Manage/ExamineOrder',
    component: () => import('../../routes/expense/manage/examineOrder/index').catch(err => onRouteError(`${err}`)),
  },
  // 付款审批表单
  {
    path: '/Expense/Manage/ExamineOrder/Form',
    component: () => import('../../routes/expense/manage/examineOrder/form').catch(err => onRouteError(`${err}`)),
  },
  // 付款审批详情
  {
    path: '/Expense/Manage/ExamineOrder/Detail',
    component: () => import('../../routes/expense/manage/examineOrder/detail/index').catch(err => onRouteError(`${err}`)),
  },
  // 打印预览页面详情
  {
    path: '/Expense/Manage/ExamineOrder/print',
    component: () => import('../../routes/expense/manage/print/printPreview').catch(err => onRouteError(`${err}`)),
  },
  // 新建费用申请表单
  {
    path: '/Expense/Manage/Template/Create',
    component: () => import('../../routes/expense/manage/template/create/index').catch(err => onRouteError(`${err}`)),
  },
  // 编辑费用申请表单
  {
    path: '/Expense/Manage/Template/Update',
    component: () => import('../../routes/expense/manage/template/update/index').catch(err => onRouteError(`${err}`)),
  },
  // 费用申请表单详情
  {
    path: '/Expense/Manage/Template/Detail',
    component: () => import('../../routes/expense/manage/template/detail/index').catch(err => onRouteError(`${err}`)),
  },
  // 记录明细
  {
    path: '/Expense/Manage/Records',
    component: () => import('../../routes/expense/manage/records/index').catch(err => onRouteError(`${err}`)),
  },
  // 记录明细, 编辑明细列表. 编辑续租，断租，退租，续签列表
  {
    path: '/Expense/Manage/Records/Summary/Create',
    component: () => import('../../routes/expense/manage/records/summary/create').catch(err => onRouteError(`${err}`)),
  },
  // 记录明细, 编辑明细. 编辑续租，断租，退租，续签
  {
    path: '/Expense/Manage/Records/Form',
    component: () => import('../../routes/expense/manage/records/form/index').catch(err => onRouteError(`${err}`)),
  },
  // 记录明细, 明细详情. 续租，断租，退租，续签
  {
    path: '/Expense/Manage/Records/Detail',
    component: () => import('../../routes/expense/manage/records/detail').catch(err => onRouteError(`${err}`)),
  },
  // 房屋管理列表
  {
    path: '/Expense/Manage/House',
    component: () => import('../../routes/expense/manage/houseContract/index').catch(err => onRouteError(`${err}`)),
  },
  // 房屋管理新增
  {
    path: '/Expense/Manage/House/Create',
    component: () => import('../../routes/expense/manage/houseContract/create').catch(err => onRouteError(`${err}`)),
  },
  // 房屋管理编辑
  {
    path: '/Expense/Manage/House/Update',
    component: () => import('../../routes/expense/manage/houseContract/update').catch(err => onRouteError(`${err}`)),
  },
  // 房屋管理费用申请
  {
    path: '/Expense/Manage/House/Apply',
    component: () => import('../../routes/expense/manage/houseContract/apply').catch(err => onRouteError(`${err}`)),
  },
  // 房屋管理详情
  {
    path: '/Expense/Manage/House/Detail',
    component: () => import('../../routes/expense/manage/houseContract/detail').catch(err => onRouteError(`${err}`)),
  },
  // 房屋续租信息编辑
  {
    path: '/Expense/Manage/House/RenewalUpdate',
    component: () => import('../../routes/expense/manage/houseContract/renewal/update').catch(err => onRouteError(`${err}`)),
  },
  // 房屋断租信息编辑
  {
    path: '/Expense/Manage/House/BrokRentUpdate',
    component: () => import('../../routes/expense/manage/houseContract/brokRent/update').catch(err => onRouteError(`${err}`)),
  },
  // 房屋退租信息编辑
  {
    path: '/Expense/Manage/House/WithdrawalUpdate',
    component: () => import('../../routes/expense/manage/houseContract/withdrawal/update').catch(err => onRouteError(`${err}`)),
  },
  // 借款管理
  {
    path: '/Expense/BorrowingRepayments/Borrowing',
    component: () => import('../../routes/expense/borrowingRepayments/borrowing').catch(err => onRouteError(`${err}`)),
  },
  // 借款详情
  {
    path: '/Expense/BorrowingRepayments/Borrowing/Detail',
    component: () => import('../../routes/expense/borrowingRepayments/borrowing/detail').catch(err => onRouteError(`${err}`)),
  },
  // 借款申请单新建
  {
    path: '/Expense/BorrowingRepayments/Borrowing/Create',
    component: () => import('../../routes/expense/borrowingRepayments/borrowing/create').catch(err => onRouteError(`${err}`)),
  },
  // 借款申请单编辑
  {
    path: '/Expense/BorrowingRepayments/Borrowing/Update',
    component: () => import('../../routes/expense/borrowingRepayments/borrowing/update').catch(err => onRouteError(`${err}`)),
  },
  // 还款管理
  {
    path: '/Expense/BorrowingRepayments/Repayments',
    component: () => import('../../routes/expense/borrowingRepayments/repayments').catch(err => onRouteError(`${err}`)),
  },
  // 还款详情
  {
    path: '/Expense/BorrowingRepayments/Repayments/Detail',
    component: () => import('../../routes/expense/borrowingRepayments/repayments/detail').catch(err => onRouteError(`${err}`)),
  },
  // 还款申请单新建
  {
    path: '/Expense/BorrowingRepayments/Repayments/Create',
    component: () => import('../../routes/expense/borrowingRepayments/repayments/create').catch(err => onRouteError(`${err}`)),
  },
  // 还款申请单编辑
  {
    path: '/Expense/BorrowingRepayments/Repayments/Update',
    component: () => import('../../routes/expense/borrowingRepayments/repayments/update').catch(err => onRouteError(`${err}`)),
  },
  // 创建差旅报销单
  {
    path: '/Expense/Manage/ExamineOrder/BusinessTravel/Create',
    component: () => import('../../routes/expense/manage/examineOrder/businessTravel/create').catch(err => onRouteError(`${err}`)),
  },
  // 编辑差旅报销单
  {
    path: '/Expense/Manage/ExamineOrder/BusinessTravel/Update',
    component: () => import('../../routes/expense/manage/examineOrder/businessTravel/update').catch(err => onRouteError(`${err}`)),
  },
  // 创建出差申请单
  {
    path: '/Expense/Manage/ExamineOrder/BusinessTrip/Create',
    component: () => import('../../routes/expense/manage/examineOrder/businessTrip/form').catch(err => onRouteError(`${err}`)),
  },
  // 编辑出差申请单
  {
    path: '/Expense/Manage/ExamineOrder/BusinessTrip/Update',
    component: () => import('../../routes/expense/manage/examineOrder/businessTrip/form').catch(err => onRouteError(`${err}`)),
  },
  // 出差申请新建
  {
    path: '/Expense/TravelApplication',
    component: () => import('../../routes/expense/travelApplication').catch(err => onRouteError(`${err}`)),
  },
  // 出差申请详情
  {
    path: '/Expense/TravelApplication/Detail',
    component: () => import('../../routes/expense/travelApplication/detail').catch(err => onRouteError(`${err}`)),
  },
  // 费用预算
  {
    path: '/Expense/Budget',
    component: () => import('../../routes/expense/budget').catch(err => onRouteError(`${err}`)),
  },
  // 审批监控
  {
    path: '/Expense/Statistics',
    component: () => import('../../routes/expense/statistics').catch(err => onRouteError(`${err}`)),
  },
  // 审批流统计详情
  {
    path: '/Expense/Statistics/Detail',
    component: () => import('../../routes/expense/statistics/detail').catch(err => onRouteError(`${err}`)),
  },
  // 退款审批单创建
  {
    path: '/Expense/Manage/RefundForm',
    component: () => import('../../routes/expense/manage/refund/form/index').catch(err => onRouteError(`${err}`)),
  },
  // 退款费用单创建
  {
    path: '/Expense/Manage/RefundCostOrderForm',
    component: () => import('../../routes/expense/manage/refund/costOrder/form').catch(err => onRouteError(`${err}`)),
  },
  // 红冲审批单创建
  {
    path: '/Expense/Manage/InvoiceAdjust',
    component: () => import('../../routes/expense/manage/invoiceAjust/form/index').catch(err => onRouteError(`${err}`)),
  },
  // 红冲费用单创建
  {
    path: '/Expense/Manage/InvoiceAdjustCostOrderForm',
    component: () => import('../../routes/expense/manage/invoiceAjust/costOrder/form.jsx').catch(err => onRouteError(`${err}`)),
  },
  // 请假管理列表
  {
    path: '/Expense/Attendance/TakeLeave',
    component: () => import('../../routes/expense/attendance/takeLeave/index').catch(err => onRouteError(`${err}`)),
  },
  // 请假管理创建
  {
    path: '/Expense/Attendance/TakeLeave/Create',
    component: () => import('../../routes/expense/attendance/takeLeave/create').catch(err => onRouteError(`${err}`)),
  },
  // 请假管理编辑
  {
    path: '/Expense/Attendance/TakeLeave/Update',
    component: () => import('../../routes/expense/attendance/takeLeave/update').catch(err => onRouteError(`${err}`)),
  },
  // 请假管理详情
  {
    path: '/Expense/Attendance/TakeLeave/Detail',
    component: () => import('../../routes/expense/attendance/takeLeave/detail').catch(err => onRouteError(`${err}`)),
  },
  // 加班管理
  {
    path: '/Expense/Attendance/OverTime',
    component: () => import('../../routes/expense/overTime/index').catch(err => onRouteError(`${err}`)),
  },
  // 新建加班申请单
  {
    path: '/Expense/Attendance/OverTime/Create',
    component: () => import('../../routes/expense/overTime/create').catch(err => onRouteError(`${err}`)),
  },
  // 编辑加班申请单
  {
    path: '/Expense/Attendance/OverTime/Update',
    component: () => import('../../routes/expense/overTime/update').catch(err => onRouteError(`${err}`)),
  },
  // 加班申请单详情
  {
    path: '/Expense/Attendance/OverTime/Detail',
    component: () => import('../../routes/expense/overTime/detail').catch(err => onRouteError(`${err}`)),
  },

  // 验票标签库
  {
    path: '/Expense/Ticket',
    component: () => import('../../routes/expense/ticket/index').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------物资管理----------------------
  // 物资台账
  {
    path: '/Supply/Parameter',
    component: () => import('../../routes/supply/parameter').catch(err => console.log(`DEBUG: 调试 ${err}`)),
  },
  // 物资设置
  {
    path: '/Supply/Setting',
    component: () => import('../../routes/supply/setting').catch(err => console.log(`DEBUG: 调试 ${err}`)),
  },
  // 采购入库明细
  {
    path: '/Supply/Procurement',
    component: () => import('../../routes/supply/procurement').catch(err => console.log(`DEBUG: 调试 ${err}`)),
  },
  // 分发明细
  {
    path: '/Supply/Distribution',
    component: () => import('../../routes/supply/distribution').catch(err => console.log(`DEBUG: 调试 ${err}`)),
  },
  // 扣款汇总
  {
    path: '/Supply/DeductSummarize',
    component: () => import('../../routes/supply/deductSummarize').catch(err => console.log(`DEBUG: 调试 ${err}`)),
  },
  // 扣款汇总详情页
  {
    path: '/Supply/DeductSummarize/Detail',
    component: () => import('../../routes/supply/deductSummarize/details').catch(err => console.log(`DEBUG: 调试 ${err}`)),
  },
  // 扣款明细
  {
    path: '/Supply/Deductions',
    component: () => import('../../routes/supply/deductions').catch(err => console.log(`DEBUG: 调试 ${err}`)),
  },
  // -----------------------服务费结算----------------------
  // 骑士标签设置
  {
    path: '/Finance/Config/Tags',
    component: () => import('../../routes/finance/config/tags').catch(err => onRouteError(`${err}`)),
  },
  // 服务费基础定义
  {
    path: '/Finance/Config/Index',
    component: () => import('../../routes/finance/config/index').catch(err => onRouteError(`${err}`)),
  },
  // 服务费方案
  {
    path: '/Finance/Plan',
    component: () => import('../../routes/finance/plan').catch(err => onRouteError(`${err}`)),
  },
  // 服务费规则
  {
    path: '/Finance/Rules',
    component: () => import('../../routes/finance/rules').catch(err => onRouteError(`${err}`)),
  },
  // 服务费规则 - 审批历史
  {
    path: '/Finance/Rules/History',
    component: () => import('../../routes/finance/rules/history').catch(err => onRouteError(`${err}`)),
  },
  // 服务费规则生成
  {
    path: '/Finance/Rules/Generator',
    component: () => import('../../routes/finance/rules/generator').catch(err => onRouteError(`${err}`)),
  },
  // 服务费试算
  {
    path: '/Finance/Rules/Calculate',
    component: () => import('../../routes/finance/rules/calculate/index').catch(err => onRouteError(`${err}`)),
  },
  // 服务费试算详情
  {
    path: '/Finance/Rules/Calculate/Detail',
    component: () => import('../../routes/finance/rules/calculate/information').catch(err => onRouteError(`${err}`)),
  },
  // 结算任务设置
  {
    path: '/Finance/Manage/Task',
    component: () => import('../../routes/finance/manage/task/index').catch(err => onRouteError(`${err}`)),
  },
  // 结算单汇总
  {
    path: '/Finance/Manage/Summary',
    component: () => import('../../routes/finance/manage/summary/index').catch(err => onRouteError(`${err}`)),
  },
  // 城市结算明细
  {
    path: '/Finance/Manage/Summary/Detail/City',
    component: () => import('../../routes/finance/manage/summary/detail/city/index').catch(err => onRouteError(`${err}`)),
  },
  // 骑士结算明细
  {
    path: '/Finance/Manage/Summary/Detail/Knight',
    component: () => import('../../routes/finance/manage/summary/detail/knight').catch(err => onRouteError(`${err}`)),
  },
  // 查看合同
  {
    path: '/Employee/Contract/Manage',
    component: () => import('../../routes/employee/contract/index').catch(err => onRouteError(`${err}`)),
  },
  // 合同详情
  {
    path: '/Employee/Contract/Detail',
    component: () => import('../../routes/employee/contract/detail').catch(err => onRouteError(`${err}`)),
  },
  // 工号管理
  {
    path: '/Employee/Transport',
    component: () => import('../../routes/employee/transport/index').catch(err => onRouteError(`${err}`)),
  },
  // 工号管理-编辑
  {
    path: '/Employee/Transport/Update',
    component: () => import('../../routes/employee/transport/form/index').catch(err => onRouteError(`${err}`)),
  },
  // 工号管理-详情
  {
    path: '/Employee/Transport/Detail',
    component: () => import('../../routes/employee/transport/detail/index').catch(err => onRouteError(`${err}`)),
  },
  // -----------------------业务承揽----------------------
  // 业主管理
  {
    path: '/Team/Manager',
    component: () => import('../../routes/team/manager/index').catch(err => onRouteError(`${err}`)),
  },
  // 编辑业主
  {
    path: '/Team/Manager/Update',
    component: () => import('../../routes/team/manager/update').catch(err => onRouteError(`${err}`)),
  },
  // 业主详情
  {
    path: '/Team/Manager/Detail',
    component: () => import('../../routes/team/manager/detail').catch(err => onRouteError(`${err}`)),
  },
  // 业务承揽记录
  {
    path: '/Team/Manager/Business',
    component: () => import('../../routes/team/manager/managerLog').catch(err => onRouteError(`${err}`)),
  },
  // 业务承揽记录
  {
    path: '/Team/Manager/NothingOwner',
    component: () => import('../../routes/team/manager/nothingOwner').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------私教资产隶属管理----------------------
  // 私教团队管理
  {
    path: '/Team/Teacher/Manage',
    component: () => import('../../routes/team/teacher/manage/index').catch(err => onRouteError(`${err}`)),
  },
  // 私教团队管理 - 编辑页
  {
    path: '/Team/Teacher/Manage/OwnerTeam',
    component: () => import('../../routes/team/teacher/manage/assets').catch(err => onRouteError(`${err}`)),
  },
  // 私教运营管理
  {
    path: '/Team/Teacher/Manage/Operations',
    component: () => import('../../routes/team/teacher/operations/index').catch(err => onRouteError(`${err}`)),
  },
  // 私教运营管理 - 编辑页
  {
    path: '/Team/Teacher/Manage/Operations/Update',
    component: () => import('../../routes/team/teacher/operations/update').catch(err => onRouteError(`${err}`)),
  },
  // 无私教业主团队监控
  {
    path: '/Team/Teacher/Monitoring',
    component: () => import('../../routes/team/teacher/monitoring/index').catch(err => onRouteError(`${err}`)),
  },
  // 私教管理记录
  {
    path: '/Team/Teacher/Manage/Log',
    component: () => import('../../routes/team/teacher/manageLog/index').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------资产管理----------------------
    // 商圈管理
  {
    path: '/Assets/District/Manage',
    component: () => import('../../routes/assets/district/manage').catch(err => onRouteError(`${err}`)),
  },
    // 添加商圈
  {
    path: '/Assets/District/Create',
    component: () => import('../../routes/assets/district/manage/create').catch(err => onRouteError(`${err}`)),
  },
    // 商圈详情
  {
    path: '/Assets/District/Detail',
    component: () => import('../../routes/assets/district/manage/detail').catch(err => onRouteError(`${err}`)),
  },
    // 商圈变更记录
  {
    path: '/Assets/District/ChangeLog',
    component: () => import('../../routes/assets/district/manage/changeLog/index').catch(err => onRouteError(`${err}`)),
  },

    // 商圈标签管理
  {
    path: '/Assets/District/Tag',
    component: () => import('../../routes/assets/district/tags').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------我的账户----------------------
  // 我的账户
  {
    path: '/Account',
    component: () => import('../../routes/account/index').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------系统管理----------------------
  // 用户管理
  {
    path: '/System/Account/Manage',
    component: () => import('../../routes/system/account/manage/index').catch(err => onRouteError(`${err}`)),
  },
  // 用户管理创建
  {
    path: '/System/Account/Manage/Create',
    component: () => import('../../routes/system/account/manage/create').catch(err => onRouteError(`${err}`)),
  },
  // 用户管理编辑
  {
    path: '/System/Account/Manage/Update',
    component: () => import('../../routes/system/account/manage/update').catch(err => onRouteError(`${err}`)),
  },
  // 用户管理详情
  {
    path: '/System/Account/Manage/Details',
    component: () => import('../../routes/system/account/manage/details').catch(err => onRouteError(`${err}`)),
  },
  // 关联账号
  {
    path: '/System/Account/Releated',
    component: () => import('../../routes/system/account/related/index').catch(err => onRouteError(`${err}`)),
  },
  // 供应商管理
  {
    path: '/System/Supplier/Manage',
    component: () => import('../../routes/system/supplier/manage/index').catch(err => onRouteError(`${err}`)),
  },
  // 添加供应商(子页)
  {
    path: '/System/Supplier/Create',
    component: () => import('../../routes/system/supplier/manage/form').catch(err => onRouteError(`${err}`)),
  },
  // 编辑供应商(子页)
  {
    path: '/System/Supplier/Update',
    component: () => import('../../routes/system/supplier/manage/form').catch(err => onRouteError(`${err}`)),
  },
  // 供应商管理-详情页
  {
    path: '/System/Supplier/Detail',
    component: () => import('../../routes/system/supplier/manage/detail').catch(err => onRouteError(`${err}`)),
  },
  // 城市业务分布
  {
    path: '/System/Supplier/Scope/City',
    component: () => import('../../routes/system/supplier/scope/city/index').catch(err => onRouteError(`${err}`)),
  },
  // 城市管理
  {
    path: '/System/City',
    component: () => import('../../routes/system/city').catch(err => onRouteError(`${err}`)),
  },
  // 编辑城市
  {
    path: '/System/City/Update',
    component: () => import('../../routes/system/city/update').catch(err => onRouteError(`${err}`)),
  },
  // 城市详情
  {
    path: '/System/City/Detail',
    component: () => import('../../routes/system/city/detail').catch(err => onRouteError(`${err}`)),
  },

  // 合同模版管理
  {
    path: '/System/ContractTemplate',
    component: () => import('../../routes/system/contractTemplate').catch(err => onRouteError(`${err}`)),
  },

  // 合同模版管理 - 组件详情
  {
    path: '/System/ContractTemplate/ComponentDetail',
    component: () => import('../../routes/system/contractTemplate/componentDetail').catch(err => onRouteError(`${err}`)),
  },

  // 合同归属管理
  {
    path: '/System/Manage/Company',
    component: () => import('../../routes/system/manage/index').catch(err => onRouteError(`${err}`)),
  },
  // 合同归属详情
  {
    path: '/System/Manage/Company/Detail',
    component: () => import('../../routes/system/manage/company/detail').catch(err => onRouteError(`${err}`)),
  },
  // 合同归属编辑
  {
    path: '/System/Manage/Company/Update',
    component: () => import('../../routes/system/manage/company/update').catch(err => onRouteError(`${err}`)),
  },
  // 推荐公司管理
  {
    path: '/System/RecommendedCompany',
    component: () => import('../../routes/system/recommendedcompany/index').catch(err => onRouteError(`${err}`)),
  },
  // 推荐公司详情
  {
    path: '/System/RecommendedCompany/Detail',
    component: () => import('../../routes/system/recommendedcompany/detail').catch(err => onRouteError(`${err}`)),
  },
  // 服务商配置
  {
    path: '/System/Merchants',
    component: () => import('../../routes/system/merchants/index').catch(err => onRouteError(`${err}`)),
  },
  // 服务商配置详情
  {
    path: '/System/Merchants/Detail',
    component: () => import('../../routes/system/merchants/detail').catch(err => onRouteError(`${err}`)),
  },
  // 服务商配置创建
  {
    path: '/System/Merchants/Create',
    component: () => import('../../routes/system/merchants/create').catch(err => onRouteError(`${err}`)),
  },
  // 服务商配置编辑
  {
    path: '/System/Merchants/Update',
    component: () => import('../../routes/system/merchants/update').catch(err => onRouteError(`${err}`)),
  },
  // 审批配置
  {
    path: '/System/Approal/Config',
    component: () => import('../../routes/system/approal/index').catch(err => onRouteError(`${err}`)),
  },
  // 意见反馈
  {
    path: '/System/FeedBack',
    component: () => import('../../routes/system/feedBack').catch(err => onRouteError(`${err}`)),
  },

  // ------------------------白名单------------------
  // 白名单
  {
    path: '/WhiteList',
    component: () => import('../../routes/whiteList/index').catch(err => onRouteError(`${err}`)),
  },
  // // 新增白名单
  // {
  //   path: '/WhiteList/Add',
  //   component: () => import('../../routes/whiteList/add').catch(err => onRouteError(`${err}`)),
  // },

  // 白名单新增页面
  {
    path: '/WhiteList/Create',
    component: () => import('../../routes/whiteList/create').catch(err => onRouteError(`${err}`)),
  },
  // 白名单详情
  {
    path: '/WhiteList/Detail',
    component: () => import('../../routes/whiteList/detail').catch(err => onRouteError(`${err}`)),
  },
  // 白名单编辑
  {
    path: '/WhiteList/Update',
    component: () => import('../../routes/whiteList/update').catch(err => onRouteError(`${err}`)),
  },
  // -----------------------企业付款----------------------
  // 付款单
  {
    path: '/Enterprise/Payment',
    component: () => import('../../routes/enterprise/payment/index').catch(err => onRouteError(`${err}`)),
  },
  // 新增付款单
  {
    path: '/Enterprise/Payment/PaymentOrder',
    component: () => import('../../routes/enterprise/payment/paymentOrder').catch(err => onRouteError(`${err}`)),
  },
  // 付款单详情
  {
    path: '/Enterprise/Payment/Detail',
    component: () => import('../../routes/enterprise/payment/detail').catch(err => onRouteError(`${err}`)),
  },

  // -----------------------企业付款----------------------
  // Code/Team首页
  {
    path: '/Code/Home',
    component: () => import('../../routes/code/home/index').catch(err => onRouteError(`${err}`)),
  },
  // Code/Team审批管理
  {
    path: '/Code/BasicSetting/Flow',
    component: () => import('../../routes/code/basicSetting/flow/index').catch(err => onRouteError(`${err}`)),
  },
  // Code/Team付款规则
  {
    path: '/Code/BasicSetting/PaymentRule',
    component: () => import('../../routes/code/basicSetting/paymentRule/index').catch(err => onRouteError(`${err}`)),
  },
  // 验票标签库
  {
    path: '/Code/Ticket',
    component: () => import('../../routes/expense/ticket/index').catch(err => onRouteError(`${err}`)),
  },
  // Code/Team审批管理 - 审批流编辑页
  {
    path: '/Code/BasicSetting/Flow/Form',
    component: () => import('../../routes/code/basicSetting/flow/form').catch(err => onRouteError(`${err}`)),
  },
  // Code/Team审批管理 - 审批流详情页
  {
    path: '/Code/BasicSetting/Flow/Detail',
    component: () => import('../../routes/code/basicSetting/flow/detail').catch(err => onRouteError(`${err}`)),
  },
  // Code/Team审批管理 - 付款类型配置管理
  {
    path: '/Code/TypeConfig/Payment',
    component: () => import('../../routes/code/typeConfig/payment/index').catch(err => onRouteError(`${err}`)),
  },
  // Code/Team审批管理 - 发起审批
  {
    path: '/Code/Document',
    component: () => import('../../routes/code/document').catch(err => onRouteError(`${err}`)),
  },
  // 事务审批
  {
    path: '/Code/Manage/OAOrder',
    component: () => import('../../routes/expense/manage/oaOrder/index').catch(err => onRouteError(`${err}`)),
  },
  // 付款审批
  {
    path: '/Code/PayOrder',
    component: () => import('../../routes/code/approveOrder/index').catch(err => onRouteError(`${err}`)),
  },
  // 审批单详情
  {
    path: '/Code/PayOrder/Detail',
    component: () => import('../../routes/code/approveOrder/detail').catch(err => onRouteError(`${err}`)),
  },
  // 审批单新建
  {
    path: '/Code/PayOrder/Create',
    component: () => import('../../routes/code/approveOrder/create').catch(err => onRouteError(`${err}`)),
  },
  // 审批单详情
  {
    path: '/Code/PayOrder/Update',
    component: () => import('../../routes/code/approveOrder/update').catch(err => onRouteError(`${err}`)),
  },
 // 记录明细
  {
    path: '/Code/Record',
    component: () => import('../../routes/code/record/index').catch(err => onRouteError(`${err}`)),
  },
  // 记录明细 - 详情
  {
    path: '/Code/Record/Detail',
    component: () => import('../../routes/code/record/detail').catch(err => onRouteError(`${err}`)),
  },
  // code审批单打印预览
  {
    path: '/Code/Print',
    component: () => import('../../routes/code/print/index').catch(err => onRouteError(`${err}`)),
  },

  // ----------------------摊销管理-------------------------
  // 摊销确认页
  {
    path: '/Amortization/Confirm',
    component: () => import('../../routes/amortization/confirm/index').catch(err => onRouteError(`${err}`)),
  },
  {
    path: '/Amortization/Detail',
    component: () => import('../../routes/amortization/confirm/detail').catch(err => onRouteError(`${err}`)),
  },
  {
    path: '/Amortization/Ledger',
    component: () => import('../../routes/amortization/ledger/index').catch(err => onRouteError(`${err}`)),
  },


  // ----------------------公告接收人-------------------------
  // v9.6.0暂时隐藏@李彩燕
  // 权限列表
  // {
  //   path: '/Announcement/Permissions',
  //   component: () => import('../../routes/announcement/index').catch(err => onRouteError(`${err}`)),
  // },
  // // 权限列表详情页
  // {
  //   path: '/Announcement/Permissions/Detail',
  //   component: () => import('../../routes/announcement/details').catch(err => onRouteError(`${err}`)),
  // },
  // 权限列表详创建
  // {
  //   path: '/Announcement/Permissions/Create',
  //   component: () => import('../../routes/announcement/create').catch(err => onRouteError(`${err}`)),
  // },
  // // 权限列表详编辑
  // {
  //   path: '/Announcement/Permissions/Update',
  //   component: () => import('../../routes/announcement/update').catch(err => onRouteError(`${err}`)),
  // },

  // -----------------------全局----------------------
  // error
  {
    path: '/*',
    component: () => import('../../routes/layout/error').catch(err => onRouteError(`${err}`)),
  },
];

// 调试路由（提供给未开发完成，或者是隐藏的功能）
const DebugRoutes = [

];

export {
  // 预加载的路由（预加载，页面布局加载前的逻辑判断使用）
  PreLoadRoutes,

  // 模块路由
  ModuleRoutes,

  // 调试路由（提供给未开发完成，或者是隐藏的功能）
  DebugRoutes,
};
