/**
 * 发起审批 - 事务申请 - 页面路由 - 配置管理业务页面路由，方便代理转换
 * NOTE: 注意：所有页面前缀必须使用 Page
 * PageDetailxxx
 * PageCreatexxx
 * PageUpdatexxx
 * PageFormxxx
 */
import is from 'is_js';
import _ from 'lodash';
import dot from 'dot-prop';

// -----------------------人力资源----------------------
// 招聘管理 - 招聘需求表单
import PageRecruitmentForm from './pages/humanResource/recruitment/form';
// 招聘管理 - 招聘需求表单详情
import PageRecruitmentDetail from './pages/humanResource/recruitment/detail';
// 增编管理 - 增编申请表
import PageAuthorizedStrengthForm from './pages/humanResource/authorizedStrength/form';
// 增编管理 - 增编申请表详情
import PageAuthorizedStrengthDetail from './pages/humanResource/authorizedStrength/detail';
// 录用申请
import PageEmployForm from './pages/humanResource/employ/form';
// 录用申请详情
import PageEmployDetail from './pages/humanResource/employ/detail';
// 转正申请 - 转正申请表单
import OfficialForm from './pages/humanResource/official/form';
// 转正申请 - 转正申请表单详情
import OfficialDetail from './pages/humanResource/official/detail';
// 合同续签 - 合同续签申请创建
import PageRenewCreate from './pages/humanResource/renew/create';
// 合同续签 - 合同续签申请编辑
import PageRenewUpdate from './pages/humanResource/renew/update';
// 合同续签 - 合同续签申请表
import PageRenewDetail from './pages/humanResource/renew/detail';
// 人事异动 - 人事异动申请创建
import PagePositionTransferCreate from './pages/humanResource/positonTransfer/create';
// 人事异动 - 人事异动申请编辑
import PagePositionTransferUpdate from './pages/humanResource/positonTransfer/update';
// 人事异动 - 人事异动申请详情
import PagePositionTransferDetail from './pages/humanResource/positonTransfer/detail';
// 离职申请 - 离职申请创建
import PageResignCreate from './pages/humanResource/resign/create';
// 离职申请 - 离职申请编辑
import PageResignUpdate from './pages/humanResource/resign/update';
// 离职申请 - 离职申请详情
import PageResignDetail from './pages/humanResource/resign/detail';
// 工作交接 - 工作交接创建
import PageJobHandoverCreate from './pages/humanResource/jobHandover/create';
// 工作交接 - 工作交接编辑
import PageJobHandoverUpdate from './pages/humanResource/jobHandover/update';
// 工作交接 - 工作交接详情
import PageJobHandoverDetail from './pages/humanResource/jobHandover/detail';
// 入职申请 - 入职申请创建&编辑
import PageInductionForm from './pages/humanResource/induction/form';
// 入职申请 - 入职申请详情
import PageInductionDetail from './pages/humanResource/induction/detail';

// -----------------------考勤----------------------
// 考勤管理页面暂时先隐藏 产品：李彩燕
// 请假 - 请假申请表
// import PageLeave from './pages/attendance/leave/form';
// // 加班 - 请假申请表 - 详情
// import PageLeaveDetail from './pages/attendance/leave/detail';
// // 加班 - 加班申请表
// import PageOvertime from './pages/attendance/overtime/form';
// // 加班 - 加班申请表 - 详情
// import PageOvertimeDetail from './pages/attendance/overtime/detail';
// // 外出 - 外出申请表
// import PageExternalOut from './pages/attendance/externalOut/form';
// // 外出 - 外出申请表 - 详情
// import PageExternalOutDetail from './pages/attendance/externalOut/detail';
// // 考勤异常 - 考勤异常申请表
// import PageAbnormal from './pages/attendance/abnormal/form';
// // 考勤异常 - 考勤异常申请表 - 详情
// import PageAbnormalDetail from './pages/attendance/abnormal/detail';

// -----------------------行政----------------------
// 印章刻制 - 印章刻制申请表
import PageAdministrationCarveSealCreate from './pages/administration/carveSeal/create';  // 刻章申请
import PageAdministrationCarveSealUpdate from './pages/administration/carveSeal/update';  // 刻章申请
import PageAdministrationCarveSealDetail from './pages/administration/carveSeal/detail';  // 刻章申请

// 印章作废 - 印章作废申请表
import PageAdministrationInvalidSeal from './pages/administration/invalidSeal/create';  // 印章作废申请
// 印章作废 - 印章作废申请表 - 详情
import PageAdministrationInvalidSealDetail from './pages/administration/invalidSeal/detail';  // 印章作废申请
// 印章作废 - 印章作废申请表 - 编辑
import PageAdministrationInvalidSealUpdate from './pages/administration/invalidSeal/update';  // 印章作废申请

// 用章申请 - 用章申请表
import PageAdministrationUseSealCreate from './pages/administration/useSeal/create';  // 用章申请
import PageAdministrationUseSealUpdate from './pages/administration/useSeal/update';  // 用章申请编辑
import PageAdministrationUseSealDetail from './pages/administration/useSeal/detail';  // 用章申请详情

// 用章申请 - 借章申请表
import PageAdministrationBorrowSealCreate from './pages/administration/borrowSeal/create';  // 借章申请
import PageAdministrationBorrowSealUpdate from './pages/administration/borrowSeal/update';  // 借章申请编辑
import PageAdministrationBorrowSealDetail from './pages/administration/borrowSeal/detail';  // 借章申请详情

// 用章申请 - 印章库  @韩健
// 名片申请 - 名片申请表
import PageAdministrationBusinessCardCreate from './pages/administration/businessCard/create';  // 名片申请
import PageAdministrationBusinessCardUpdate from './pages/administration/businessCard/update';  // 名片申请
import PageAdministrationBusinessCardDetail from './pages/administration/businessCard/detail';  // 名片申请

// 证照借用 - 证照借用创建
import PageAdministrationBorrowLicense from './pages/administration/borrowLicense/create';  // 证照借用申请
// 证照借用 - 证照借用编辑
import PageAdministrationBorrowLicenseUpdate from './pages/administration/borrowLicense/update';  // 证照借用申请
// 证照借用 - 证照借用 - 详情
import PageBorrowLicenseDetail from './pages/administration/borrowLicense/detail';  // 证照借用申请

// 证照借用 - 证照库 @韩健
// 奖惩通知 - 奖惩通知表单
import PageAdministrationRewardCreate from './pages/administration/reward/create';  // 奖罚通知申请
import PageAdministrationRewardUpdate from './pages/administration/reward/update';  // 奖罚通知申请
import PageAdministrationRewardDetail from './pages/administration/reward/detail';  // 奖罚通知申请

// -----------------------财商----------------------
// 注册公司 - 注销/注册公司申请表
import PageRegisteredCompanyCreate from './pages/business/registeredCompany/create';
import PageRegisteredCompanyDetail from './pages/business/registeredCompany/detail';
import PageRegisteredCompanyUpdate from './pages/business/registeredCompany/update';
// 公司变更 - 公司变更申请表
import PageCompanyChangeCreate from './pages/business/companyChange/create';
import PageCompanyChangeDetail from './pages/business/companyChange/detail';
import PageCompanyChangeUpdate from './pages/business/companyChange/update';
// 银行开户 - 银行开户申请表
import PageBankAccountCreate from './pages/business/bankAccount/create';
import PageBankAccountDetail from './pages/business/bankAccount/detail';
import PageBankAccountUpdate from './pages/business/bankAccount/update';
// 注销开户 - 注销银行账户申请
import PageCancellationBankCreate from './pages/business/cancellationBank/create';
import PageCancellationBankUpdate from './pages/business/cancellationBank/update';
import PageCancellationBankDetail from './pages/business/cancellationBank/detail';
// 财商类 - 合同会审 -创建
import PageContractComeCreate from './pages/business/contractCome/create';
import PageContractComeDetail from './pages/business/contractCome/detail';
import PageContractComeUpdate from './pages/business/contractCome/update';
// 财商类 - 合同借阅 -创建
import PageContractBorrowingCreate from './pages/business/contractBorrowing/create';
import PageContractBorrowingDetail from './pages/business/contractBorrowing/detail';
import PageContractBorrowingUpdate from './pages/business/contractBorrowing/update';

// 财商类 - 资金调拨
import PageFundTrasferCreate from './pages/business/fundTransfer/create';
import PageFundTrasferUpdate from './pages/business/fundTransfer/update';
import PageFundTransferDetail from './pages/business/fundTransfer/detail';

// -----------------------其他----------------------
// 其他 - 事务签呈 - 创建&编辑
import PageOtherSignForm from './pages/other/sign/form';
// 其他 - 事务签呈 - 详情
import PageOtherSignDetail from './pages/other/sign/detail';

// -----------------------假勤管理----------------------
// 假勤管理 - 出差管理 - 创建
import PageBusinessTripCreate from './pages/fake/businessTrip/create';
// 假勤管理 - 出差管理 - 编辑
import PageBusinessTripUpdate from './pages/fake/businessTrip/update';
// 假勤管理 - 出差管理 - 详情
import PageBusinessTripDetail from './pages/fake/businessTrip/detail';

// 组织管理 - 详情
import PageDepartmentPostDetail from './pages/departmentPost/detail';

// 审批流表单信息
import { PageFlowItems } from './components/flow/modal';

// 所有的单据类型
const PagesTypes = [
  {
    key: 601,
    icon: '601.png',
    hoverIcon: 'hover-601.png',
    title: '出差申请',
    desc: '出差申请 - 出差申请审批',
    component: {
      create: PageBusinessTripCreate,
      update: PageBusinessTripUpdate,
      detail: PageBusinessTripDetail,
    },
    // 获取对应表单信息接口
    api: 'vacations_attendance.transaction_travel_order.find',
    // 审批流配置
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: false,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
        PageFlowItems.itemSubmitSelf,
      ],
      // 代提交的表单
      substitute: [
        PageFlowItems.itemSubmitSelf,
        PageFlowItems.itemDepartment,
        PageFlowItems.itemPost,
      ],
    },
  },
  // 人力资源  100 ～ 199
  {
    key: 102,
    icon: '102.png',
    hoverIcon: 'hover-102.png',
    title: '部门增编申请',
    desc: '增编管理 - 增编申请表',
    component: {
      create: PageAuthorizedStrengthForm,
      update: PageAuthorizedStrengthForm,
      detail: PageAuthorizedStrengthDetail,
    },
    // 获取对应表单信息接口
    api: 'human_resource.addendum_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: false,
      // 自己提交的表单
      self: [],
      // 代提交的表单
      substitute: [
        PageFlowItems.itemDepartment,
      ],
    },
  },
  {
    key: 101,
    icon: '101.png',
    hoverIcon: 'hover-101.png',
    title: '部门招聘申请',
    desc: '招聘管理 - 招聘需求表单',
    component: {
      create: PageRecruitmentForm,
      update: PageRecruitmentForm,
      detail: PageRecruitmentDetail,
    },
    // 获取对应表单信息接口
    api: 'human_resource.recruitment_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: false,
      // 自己提交的表单
      self: [],
      // 代提交的表单
      substitute: [
        PageFlowItems.itemDepartment,
      ],
    },
  },
  {
    key: 108,
    icon: '108.png',
    hoverIcon: 'hover-108.png',
    title: '录用申请',
    desc: '录用申请',
    component: {
      create: PageEmployForm,
      update: PageEmployForm,
      detail: PageEmployDetail,
    },
    // 获取对应表单信息接口
    api: 'human_resource.employ_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: false,
      // 自己提交的表单
      self: [],
      // 代提交的表单
      substitute: [
        PageFlowItems.itemDepartment,
        PageFlowItems.itemPost,
      ],
    },
  },
  {
    key: 109,
    icon: '109.png',
    title: '入职申请',
    hoverIcon: 'hover-109.png',
    desc: '入职申请 - 工作交接表',
    component: {
      create: PageInductionForm,
      update: PageInductionForm,
      detail: PageInductionDetail,
    },
    // 获取对应表单信息接口
    api: 'administration.employment_apply.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: false,
      // 自己提交的表单
      self: [],
      // 代提交的表单
      substitute: [
        PageFlowItems.itemDepartment,
        PageFlowItems.itemPost,
      ],
    },
  },
  {
    key: 103,
    icon: '103.png',
    hoverIcon: 'hover-103.png',
    title: '转正申请',
    desc: '转正申请 - 转正申请表单',
    component: {
      create: OfficialForm,
      update: OfficialForm,
      detail: OfficialDetail,
    },
    // 获取对应表单信息接口
    api: 'human_resource.positive_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
      ],
      // 代提交的表单
      substitute: [
      ],
    },
  },
  {
    key: 104,
    icon: '104.png',
    hoverIcon: 'hover-104.png',
    title: '劳动合同续签申请',
    desc: '合同续签 - 合同续签申请表',
    component: {
      create: PageRenewCreate,
      update: PageRenewUpdate,
      detail: PageRenewDetail,
    },
    // 获取对应表单信息接口
    api: 'human_resource.renew_contract_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: false,
      // 自己提交的表单
      self: [],
      // 代提交的表单
      substitute: [
        PageFlowItems.itemDepartment,
        PageFlowItems.itemPost,
      ],
    },
  },
  {
    key: 105,
    icon: '105.png',
    hoverIcon: 'hover-105.png',
    title: '人事调动申请',
    desc: '人事异动 - 人事异动申请表',
    component: {
      create: PagePositionTransferCreate,
      update: PagePositionTransferUpdate,
      detail: PagePositionTransferDetail,
    },
    // 获取对应表单信息接口
    api: 'human_resource.human_resource_transfer_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: false,
      // 自己提交的表单
      self: [],
      // 代提交的表单
      substitute: [
        PageFlowItems.itemDepartment,
        PageFlowItems.itemPost,
      ],
    },
  },
  {
    key: 106,
    icon: '106.png',
    hoverIcon: 'hover-106.png',
    title: '离职申请',
    desc: '离职申请 - 离职申请表',
    component: {
      create: PageResignCreate,
      update: PageResignUpdate,
      detail: PageResignDetail,
    },
    // 获取对应表单信息接口
    api: 'human_resource.departure_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: false,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
        PageFlowItems.itemSubmitSelf,
      ],
      // 代提交的表单
      substitute: [
        PageFlowItems.itemSubmitSelf,
        PageFlowItems.itemDepartment,
        PageFlowItems.itemPost,
      ],
    },
  },
  {
    key: 107,
    icon: '107.png',
    hoverIcon: 'hover-107.png',
    title: '工作交接',
    desc: '工作交接 - 工作交接表',
    component: {
      create: PageJobHandoverCreate,
      update: PageJobHandoverUpdate,
      detail: PageJobHandoverDetail,
    },
    // 获取对应表单信息接口
    api: 'human_resource.handover_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: false,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
        PageFlowItems.itemSubmitSelf,
      ],
      // 代提交的表单
      substitute: [
        PageFlowItems.itemSubmitSelf,
        PageFlowItems.itemDepartment,
      ],
    },
  },
  // 考勤管理 200～299
  // 考勤管理页面暂时先隐藏 产品：李彩燕
  // {
  //   key: 201,
  //   icon: '201.png',
  //   hoverIcon: 'hover-201.png',
  //   title: '请假申请',
  //   desc: '请假 - 请假申请表',
  //   component: {
  //     create: PageLeave,
  //     update: PageLeave,
  //     detail: PageLeaveDetail,
  //   },
  //   // 获取对应表单信息接口
  //   api: 'attendance.leave_order.find',
  //   // 审批流配置
  //   flow: {
  //     // 隐藏切换开关
  //     isHideSwitch: true,
  //     // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
  //     isSelfSubmit: true,
  //     // 自己提交的表单
  //     self: [
  //       PageFlowItems.itemLeaveDayType,
  //     ],
  //     // 代提交的表单
  //     substitute: [
  //     ],
  //   },
  // },
  // {
  //   key: 202,
  //   icon: '202.png',
  //   hoverIcon: 'hover-202.png',
  //   title: '加班申请',
  //   desc: '加班 - 加班申请表',
  //   component: {
  //     create: PageOvertime,
  //     update: PageOvertime,
  //     detail: PageOvertimeDetail,
  //   },
  //   // 获取对应表单信息接口
  //   api: 'attendance.extra_work_order.find',
  //   // 审批流配置
  //   flow: {
  //     // 隐藏切换开关
  //     isHideSwitch: true,
  //     // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
  //     isSelfSubmit: true,
  //     // 自己提交的表单
  //     self: [
  //     ],
  //     // 代提交的表单
  //     substitute: [
  //     ],
  //   },
  // },
  // {
  //   key: 203,
  //   icon: '203.png',
  //   hoverIcon: 'hover-203.png',
  //   title: '外出申请',
  //   desc: '外出 - 外出申请表',
  //   component: {
  //     create: PageExternalOut,
  //     update: PageExternalOut,
  //     detail: PageExternalOutDetail,
  //   },
  //   // 获取对应表单信息接口
  //   api: 'attendance.break_order.find',
  //   // 审批流配置
  //   flow: {
  //     // 隐藏切换开关
  //     isHideSwitch: true,
  //     // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
  //     isSelfSubmit: true,
  //     // 自己提交的表单
  //     self: [
  //     ],
  //     // 代提交的表单
  //     substitute: [
  //     ],
  //   },
  // },
  // {
  //   key: 204,
  //   icon: '204.png',
  //   hoverIcon: 'hover-204.png',
  //   title: '考勤异常申请',
  //   desc: '考勤异常 - 考勤异常申请表',
  //   component: {
  //     create: PageAbnormal,
  //     update: PageAbnormal,
  //     detail: PageAbnormalDetail,
  //   },
  //   // 获取对应表单信息接口
  //   api: 'attendance.exception_order.find',
  //   // 审批流配置
  //   flow: {
  //     // 隐藏切换开关
  //     isHideSwitch: true,
  //     // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
  //     isSelfSubmit: true,
  //     // 自己提交的表单
  //     self: [
  //     ],
  //     // 代提交的表单
  //     substitute: [
  //     ],
  //   },
  // },

  // 行政管理 300～399
  {
    key: 303,
    icon: '303.png',
    hoverIcon: 'hover-303.png',
    title: '用章申请',
    desc: '用章申请 - 用章申请表',
    component: {
      create: PageAdministrationUseSealCreate,
      update: PageAdministrationUseSealUpdate,
      detail: PageAdministrationUseSealDetail,
    },
    // 获取对应表单信息接口
    api: 'administration.seal_use_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
        PageFlowItems.itemSealType,
      ],
      // 代提交的表单
      substitute: [
      ],
    },
  },
  {
    key: 309,
    icon: '309.png',
    hoverIcon: 'hover-309.png',
    title: '借章申请',
    desc: '用章申请 - 借章申请表',
    component: {
      create: PageAdministrationBorrowSealCreate,
      update: PageAdministrationBorrowSealUpdate,
      detail: PageAdministrationBorrowSealDetail,
    },
    // 获取对应表单信息接口
    api: 'administration.seal_use_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
        PageFlowItems.itemSealType,
      ],
      // 代提交的表单
      substitute: [
      ],
    },
  },
  {
    key: 301,
    icon: '301.png',
    hoverIcon: 'hover-301.png',
    title: '印章刻制申请',
    desc: '印章刻制 - 印章刻制申请表',
    component: {
      create: PageAdministrationCarveSealCreate,
      update: PageAdministrationCarveSealUpdate,
      detail: PageAdministrationCarveSealDetail,
    },
    // 获取对应表单信息接口
    api: 'administration.seal_engrave_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
      ],
      // 代提交的表单
      substitute: [
      ],
    },
  },
  {
    key: 302,
    icon: '302.png',
    hoverIcon: 'hover-302.png',
    title: '印章作废申请',
    desc: '印章作废 - 印章作废申请表',
    component: {
      create: PageAdministrationInvalidSeal,
      update: PageAdministrationInvalidSealUpdate,
      detail: PageAdministrationInvalidSealDetail,
    },
    // 获取对应表单信息接口
    api: 'administration.seal_revoke_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
      ],
      // 代提交的表单
      substitute: [
      ],
    },
  },
  {
    key: 305,
    icon: '305.png',
    hoverIcon: 'hover-305.png',
    title: '名片申请',
    desc: '名片申请 - 名片申请表',
    component: {
      create: PageAdministrationBusinessCardCreate,
      update: PageAdministrationBusinessCardUpdate,
      detail: PageAdministrationBusinessCardDetail,
    },
    // 获取对应表单信息接口
    api: 'administration.visiting_card_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: false,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
      ],
      // 代提交的表单
      substitute: [
        PageFlowItems.itemDepartment,
      ],
    },
  },
  {
    key: 306,
    icon: '306.png',
    hoverIcon: 'hover-306.png',
    title: '证照借用申请',
    desc: '证照借用 - 证照借用',
    component: {
      create: PageAdministrationBorrowLicense,
      update: PageAdministrationBorrowLicenseUpdate,
      detail: PageBorrowLicenseDetail,
    },
    // 获取对应表单信息接口
    api: 'administration.cert_borrow_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
        PageFlowItems.itemLicense,
      ],
      // 代提交的表单
      substitute: [
      ],
    },
  },
  {
    key: 308,
    icon: '308.png',
    hoverIcon: 'hover-308.png',
    title: '奖罚申请',
    desc: '奖罚申请 - 奖罚申请表单',
    component: {
      create: PageAdministrationRewardCreate,
      update: PageAdministrationRewardUpdate,
      detail: PageAdministrationRewardDetail,
    },
    // 获取对应表单信息接口
    api: 'administration.prize_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: false,
      // 自己提交的表单
      self: [],
      // 代提交的表单
      substitute: [
        PageFlowItems.itemDepartment,
        PageFlowItems.itemPost,
      ],
    },
  },

  // 财商管理 400～499
  {
    key: 401,
    icon: '401.png',
    hoverIcon: 'hover-401.png',
    title: '注册/注销公司申请',
    desc: '注册公司 - 注销/注册公司申请表',
    component: {
      create: PageRegisteredCompanyCreate,
      update: PageRegisteredCompanyUpdate,
      detail: PageRegisteredCompanyDetail,
    },
    // 获取对应表单信息接口
    api: 'business.firm_modify_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
      ],
      // 代提交的表单
      substitute: [
      ],
    },
  },
  {
    key: 402,
    icon: '402.png',
    hoverIcon: 'hover-402.png',
    title: '公司变更申请',
    desc: '公司变更 - 公司变更申请表',
    component: {
      create: PageCompanyChangeCreate,
      update: PageCompanyChangeUpdate,
      detail: PageCompanyChangeDetail,
    },
    // 获取对应表单信息接口
    api: 'business.firm_modify_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
      ],
      // 代提交的表单
      substitute: [
      ],
    },
  },
  {
    key: 405,
    icon: '405.png',
    title: '合同会审申请',
    hoverIcon: 'hover-405.png',
    desc: '合同会审 - 合同会审审批',
    component: {
      create: PageContractComeCreate,
      update: PageContractComeUpdate,
      detail: PageContractComeDetail,
    },
    // 获取对应表单信息接口
    api: 'business.pact_apply_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
        PageFlowItems.itemStampType,
      ],
      // 代提交的表单
      substitute: [
      ],
    },
  },
  {
    key: 406,
    icon: '406.png',
    hoverIcon: 'hover-406.png',
    title: '合同借阅申请',
    desc: '合同借阅 - 合同借阅审批',
    component: {
      create: PageContractBorrowingCreate,
      update: PageContractBorrowingUpdate,
      detail: PageContractBorrowingDetail,
    },
    // 获取对应表单信息接口
    api: 'business.pact_borrow_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
        PageFlowItems.itemContractBorrowType,
      ],
    },
  },
  {
    key: 408,
    icon: '408.png',
    hoverIcon: 'hover-408.png',
    title: '资金调拨申请',
    desc: '资金调拨审批',
    component: {
      create: PageFundTrasferCreate,
      update: PageFundTrasferUpdate,
      detail: PageFundTransferDetail,
    },
    // 获取对应表单信息接口
    api: 'administration.capital_allocate_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
        PageFlowItems.itemSubmitSelf,
      ],
    },
  },
  {
    key: 403,
    icon: '403.png',
    hoverIcon: 'hover-403.png',
    title: '银行开户申请',
    desc: '银行开户 - 银行开户申请表',
    component: {
      create: PageBankAccountCreate,
      update: PageBankAccountUpdate,
      detail: PageBankAccountDetail,
    },
    // 获取对应表单信息接口
    api: 'business.bank_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
      ],
      // 代提交的表单
      substitute: [
      ],
    },
  },
  {
    key: 404,
    icon: '404.png',
    hoverIcon: 'hover-404.png',
    title: '注销银行账户申请',
    desc: '注销开户 - 注销银行账户申请',
    component: {
      create: PageCancellationBankCreate,
      update: PageCancellationBankUpdate,
      detail: PageCancellationBankDetail,
    },
    // 获取对应表单信息接口
    api: 'business.bank_order.find',
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
      ],
      // 代提交的表单
      substitute: [
      ],
    },
  },
  {
    key: 501,
    icon: '501.png',
    hoverIcon: 'hover-501.png',
    title: '事务签呈',
    desc: '事务签呈 - 事务签呈审批',
    component: {
      create: PageOtherSignForm,
      update: PageOtherSignForm,
      detail: PageOtherSignDetail,
    },
    // 获取对应表单信息接口
    api: 'administration.petition.find',
    // 审批流配置
    // 审批流配置
    flow: {
      // 隐藏切换开关
      isHideSwitch: true,
      // 默认是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
      isSelfSubmit: true,
      // 自己提交的表单
      self: [
        PageFlowItems.itemSubmitSelf,
      ],
      // 代提交的表单
      substitute: [],
    },
  },
  {
    key: 701,
    title: '组织管理',
    component: {
      detail: PageDepartmentPostDetail,
    },
  },
];

// 页面大类
const PageCateogries = {
  HumanResource: 100,
  Attendance: 200,
  Administraion: 300,
  Business: 400,
  Other: 500,
  Fake: 600,

  description(rawValue) {
    switch (Number(rawValue)) {
      case this.HumanResource: return '人力资源';
      case this.Attendance: return '考勤管理';
      case this.Administraion: return '行政管理';
      case this.Business: return '财商管理';
      case this.Other: return '其他';
      case this.Fake: return '假勤管理';
      default: return '--';
    }
  },
};

// 页面类型（创建，编辑，详情）
const PagesRouteTypes = {
  create: 'create', // 创建页面
  update: 'update', // 编辑页面
  detail: 'detail', // 详情页面
};

// 单据页面相关的帮助方法
const PagesHelper = {

  // 筛选出对应副部门的第一条审批流
  // 页面公用方法，本人提报
  pageCommonTerminateForEach(examineList = [], deputyDepartmentList = [], deputyDepartmentIds = []) {
        // 筛选出对应副部门的第一条审批流
    const item = {};
    examineList.some((v = {}) => {
          // 部门id集合
      const arr = [...dot.get(v, 'applyDepartmentIds', []), ...dot.get(v, 'applyDepartmentSubIds', [])];
      const applyRanks = dot.get(v, 'applyRanks', []);
          // 获取当前人的部门id和审批流的部门id的交集
      const intersection = _.intersection(arr, deputyDepartmentIds);
      const allDepartment = {};
      deputyDepartmentList.some((j) => {
        if (
              intersection.includes(dot.get(j, 'department_info._id', undefined))
            ) {
          allDepartment.departmentId = dot.get(j, 'department_info._id', undefined);
          allDepartment.departmentInfo = dot.get(j, 'department_info', {});
          allDepartment.rank = dot.get(j, 'job_info.rank', undefined);
          allDepartment.jobId = dot.get(j, 'job_info._id', undefined);
          allDepartment.jobInfo = dot.get(j, 'job_info', {});
          return true;
        }
        return false;
      });
            // 判断部门集合和副部门是否有交集并且岗位集合为全部
      if (is.existy(intersection) && is.not.empty(intersection) && applyRanks[0] === 'all'
            && is.existy(allDepartment) && is.not.empty(allDepartment)) {
        item.examineItem = v;
        item.departmentId = allDepartment.departmentId;
        item.departmentInfo = allDepartment.departmentInfo;
        item.rank = allDepartment.rank;
        item.jobId = allDepartment.jobId;
        item.jobInfo = allDepartment.jobInfo;
        return true;
      }

      let filterDepartment = {};
      deputyDepartmentList.some((j) => {
        if (
              intersection.includes(dot.get(j, 'department_info._id', undefined))
              && applyRanks.includes(dot.get(j, 'job_info.rank', undefined))
            ) {
          filterDepartment = {
            departmentId: dot.get(j, 'department_info._id', undefined),
            departmentInfo: dot.get(j, 'department_info', {}),
            rank: dot.get(j, 'job_info.rank', undefined),
            jobId: dot.get(j, 'job_info._id', undefined),
            jobInfo: dot.get(j, 'job_info', {}),
          };
          return true;
        }
        return false;
      });
            // 判断部门集合和副部门是否有交集并且岗位集合为包含当前岗位职级
      if (is.existy(intersection) && is.not.empty(intersection) &&
              is.existy(filterDepartment) && is.not.empty(filterDepartment)) {
        item.examineItem = v;
        item.departmentId = filterDepartment.departmentId;
        item.departmentInfo = filterDepartment.departmentInfo;
        item.rank = filterDepartment.rank;
        item.jobId = filterDepartment.jobId;
        item.jobInfo = filterDepartment.jobInfo;
        return true;
      }
      return false;
    });
    return item;
  },

  // 判断页面key是否存在
  isPageKeyExisty(key) {
    const page = PagesTypes.filter(item => Number(key) === item.key);
    return is.existy(page) && is.not.empty(page);
  },

  // 判断访问类型是否存在
  isPageRouteTypeExisty(type) {
    return [PagesRouteTypes.create, PagesRouteTypes.update, PagesRouteTypes.detail].includes(type);
  },

  // 获取当前大类下的页面数据
  pagesByCategory(category) {
    let keys = [];
    // 人力模块key集合
    if (category === PageCateogries.HumanResource) {
      keys = [
        101, 102, 103, 104, 105, 106, 107, 108, 109, 308,
      ];
    }
    // 考勤模块key集合
    // 考勤管理页面暂时先隐藏 产品：李彩燕
    // if (category === PageCateogries.Attendance) {
    //   keys = [201, 202, 203, 204];
    // }
    // 行政模块key集合
    if (category === PageCateogries.Administraion) {
      keys = [301, 302, 303, 305, 306, 309, 401, 402];
    }
    // 财商模块key集合
    if (category === PageCateogries.Business) {
      keys = [403, 404, 405, 406, 408];
    }
    // 财商模块key集合
    if (category === PageCateogries.Other) {
      keys = [501];
    }

    // 财商模块key集合
    if (category === PageCateogries.Fake) {
      keys = [601];
    }
    return PagesTypes.filter(page => keys.includes(page.key));
  },

  // 根据key值获取页面信息
  pageByKey(key) {
    const page = PagesTypes.filter(item => Number(key) === item.key);
    if (is.not.existy(page) || is.empty(page) || is.not.array(page)) {
      return undefined;
    }
    return dot.get(page, '0');
  },

  // 根据页面key，获取标题
  titleByKey(key) {
    const page = this.pageByKey(key);
    return dot.get(page, 'title', '--');
  },

  // 根据页面key，获取组件
  componentByKey(key, type) {
    const page = this.pageByKey(key);
    return dot.get(page, `component.${type}`, undefined);
  },

  // 根据页面key，获取路由配置
  routeByKey(key, type, query = {}) {
    const page = this.pageByKey(key);
    // 判断如果路由配置为空，则不显示
    if (is.not.existy(page) || is.empty(page)) {
      return '';
    }

    // 判断如果模版类型不对，返回空
    if (this.isPageRouteTypeExisty(type) !== true) {
      return '';
    }

    // 判断组件是否存在，组件如果不存在，则返回空
    const component = this.componentByKey(key, type);
    if (is.not.existy(component) || is.empty(component)) {
      return '';
    }

    // 根据自定义请求的参数，创建跳转页面的路由
    if (is.existy(query) && is.not.empty(query)) {
      const params = Object.keys(query).map(k => `${k}=${query[k]}`).join('&');
      return `/#/OA/Document/${page.key}/${type}?${params}`;
    }

    // 根据默认请求的参数，创建跳转页面的路由
    if (is.existy(page.query) && is.not.empty(page.query)) {
      const params = Object.keys(page.query).map(k => `${k}=${page.query[k]}`).join('&');
      return `/#/OA/Document/${key}/${type}?${params}`;
    }

    // 直接返回页面跳转
    return `/#/OA/Document/${key}/${type}`;
  },

  // 面包屑的路径
  breadcrumbByKey(key) {
    return [
      '审批管理',
      '发起审批',
      '事务申请',
      this.titleByKey(key),
    ];
  },

  // 根据页面key，获取api地址
  apiByKey(key) {
    const page = this.pageByKey(key);
    return dot.get(page, 'api', undefined);
  },

  // 获取组织管理key
  getDepartmentPostKey() {
    return 701;
  },

  // 根据页面key，获取审批流表单配置, 自己提交
  flowSelfByKey(key) {
    const page = this.pageByKey(key);
    return dot.get(page, 'flow.self', []);
  },

  // 根据页面key，获取审批流表单配置, 代提交
  flowSubstituteByKey(key) {
    const page = this.pageByKey(key);
    return dot.get(page, 'flow.substitute', []);
  },

  // 根据页面key，获取审批流表单配置, 是否禁用自己提交
  flowIsHideSwitchByKey(key) {
    const page = this.pageByKey(key);
    return dot.get(page, 'flow.isHideSwitch', false);
  },

  // 根据页面key，获取审批流表单配置, 是否是自己提交（默认都是true，个别情况，只有待提交的，设置为false）
  flowIsSelfSubmitByKey(key) {
    const page = this.pageByKey(key);
    return dot.get(page, 'flow.isSelfSubmit', true);
  },

  // 所有模块的key值
  allKeys() {
    return PagesTypes.map(page => page.key);
  },
};

// 入口配置定义
const PagesDefinition = [
  {
    title: PageCateogries.description(PageCateogries.HumanResource),
    routes: PagesHelper.pagesByCategory(PageCateogries.HumanResource),
  },
  {
    title: PageCateogries.description(PageCateogries.Fake),
    routes: PagesHelper.pagesByCategory(PageCateogries.Fake),
  },
  // { // 考勤管理页面暂时先隐藏 产品：李彩燕
  //   title: PageCateogries.description(PageCateogries.Attendance),
  //   routes: PagesHelper.pagesByCategory(PageCateogries.Attendance),
  // },
  {
    title: PageCateogries.description(PageCateogries.Administraion),
    routes: PagesHelper.pagesByCategory(PageCateogries.Administraion),
  },
  {
    title: PageCateogries.description(PageCateogries.Business),
    routes: PagesHelper.pagesByCategory(PageCateogries.Business),
  },
  {
    title: PageCateogries.description(PageCateogries.Other),
    routes: PagesHelper.pagesByCategory(PageCateogries.Other),
  },
];

export {
  // 单据类型类型
  PagesTypes,
  // 入口配置定义
  PagesDefinition,
  // 页面的路由类型定义
  PagesRouteTypes,
  // 页面帮助方法
  PagesHelper,
};
