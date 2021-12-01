# 部署测试环境
  yarn deploy-oa

  登陆验证码 999999

# 测试环境  
  IP: 172.18.22.33   
  Boss地址： qa-boss.quhuo.cn
  Qlife地址：qa-boss-team.quhuo.cn
  datahub地址：qa-datahub.quhuo.cn
  boss前端部署目录：/data/project/apps/aoao-boss-app/dist
  qlife前端部署目录：/data/project/apps/qlife-app/dist

# 测试环境host
  172.18.22.33 qa-boss.quhuo.cn
  172.18.22.33 qa-boss-api.quhuo.cn
  172.18.22.33 qa-boss-team.quhuo.cn
  172.18.22.33 qa-datahub.quhuo.cn
  172.18.22.33 qa-qlife-datahub.quhuo.cn
  172.18.22.33 qa-quhuo-datahub.quhuo.cn
  172.18.22.33 qa-datahub-api.quhuo.cn
  172.18.22.33 qa-qlife-api.quhuo.cn
  172.18.22.33 qa-qlife-apps.quhuo.cn
  172.18.22.33 qa-s3.quhuo.cn
  172.18.22.33 qa-saas-api.quhuo.cn
  172.18.22.33 qa-ums-api.quhuo.cn
  172.18.22.33 qa-datahub-assets.quhuo.cn

  - 定稿的需求UE 24页面+4配置/28 @唐冬 @彩燕 @冯俏 @彭悦
    - 该部分，查看在线文档
    - https://docs.qq.com/sheet/DWnFva1daYnBma1pI?tab=BB08J2


..
├── README.md
├── assets
│   ├── 101.png 静态文件
│   ├── 102.png 静态文件
│   ├── 103.png 静态文件
│   ├── 104.png 静态文件
│   ├── 105.png 静态文件
│   ├── 106.png 静态文件
│   ├── 107.png 静态文件
│   ├── 108.png 静态文件
│   ├── 109.png 静态文件
│   ├── 201.png 静态文件
│   ├── 202.png 静态文件
│   ├── 203.png 静态文件
│   ├── 204.png 静态文件
│   ├── 301.png 静态文件
│   ├── 302.png 静态文件
│   ├── 303.png 静态文件
│   ├── 305.png 静态文件
│   ├── 306.png 静态文件
│   ├── 308.png 静态文件
│   ├── 309.png 静态文件
│   ├── 401.png 静态文件
│   ├── 402.png 静态文件
│   ├── 403.png 静态文件
│   ├── 404.png 静态文件
│   ├── 405.png 静态文件
│   ├── 406.png 静态文件
│   ├── 408.png 静态文件
│   └── 501.png 静态文件
├── components
│   ├── basisInfo.jsx  基本信息
│   ├── departmentDisplay.jsx  根据部门id展示部门名称
│   ├── detail.jsx  单据详情页面模块
│   ├── flow
│   │   ├── button.jsx 
│   │   ├── modal.jsx  新建申请的弹窗
│   │   └── style.css 样式
│   ├── form
│   │   ├── buttons.jsx  表单按钮组件 - 表单创建/编辑按钮
│   │   ├── submit.jsx  表单按钮组件 - 提交动作
│   │   └── update.jsx  表单按钮组件 - 保存动作
│   ├── index.js  公共组件
│   ├── organizationJobSelect.jsx  岗位库下拉列表
│   ├── upload
│   │   └── upload.jsx  上传文件的表单组件
│   └── wapper
│       ├── breadcrumb.jsx  布局包装容器
│       ├── create.jsx  布局包装容器
│       ├── detail.jsx  布局包装容器
│       └── update.jsx  布局包装容器
├── define.jsx  页面路由 - 配置管理业务页面路由，方便代理转换
├── dynamic.jsx  OA路由配置, 动态路由
├── index.jsx  流程审批入口页 /Code/Document
└── pages
├── administration
│   ├── borrowLicense
│   │   ├── create.jsx  行政类 - 证照借用申请 - 新增 /Code/Document/Pages/Administration/BorrowLicense/Create
│   │   ├── detail.js  行政类 - 证照借用申请 - 新增 /Code/Document/Pages/Administration/BorrowLicense/Create
│   │   └── update.jsx  行政类 - 证照借用申请 - 编辑 /Code/Document/Pages/Administration/BorrowLicense/Update
│   ├── borrowSeal
│   │   ├── create.jsx  行政类 - 借章申请 - 新增 /Code/Document/Pages/Administration/BorrowSeal/Create
│   │   ├── detail.jsx  行政类 - 借章申请 - 详情 /Code/Document/Pages/Administration/BorrowSeal/Detail
│   │   └── update.jsx  行政类 - 借章申请 - 编辑 /Code/Document/Pages/Administration/BorrowSeal/Update
│   ├── businessCard
│   │   ├── create.jsx  行政类 - 名片申请 - 新增 /Code/Document/Pages/Administration/Business/Create
│   │   ├── detail.jsx  行政类 - 名片申请 - 新增 /Code/Document/Pages/Administration/Business/Create
│   │   └── update.jsx  行政类 - 名片申请 - 编辑 /Code/Document/Pages/Administration/Business/Update
│   ├── carveSeal
│   │   ├── create.jsx  行政类 - 刻章申请 - 新增 /Code/Document/Pages/Administration/CarveSeal/Create
│   │   ├── detail.jsx  行政类 - 刻章申请 - 详情 /Code/Document/Pages/Administration/CarveSeal/Detail
│   │   └── update.jsx  行政类 - 刻章申请 - 编辑 /Code/Document/Pages/Administration/CarveSeal/Update
│   ├── components
│   │   ├── companySelect.jsx  公司下拉 /Code/Document/Pages/Administration/Components/CompanySelect
│   │   ├── keepingSelect.jsx  印章保管人下拉 /Code/Document/Pages/Administration/Components/KeepingSelect
│   │   ├── license.jsx  证照库 /Code/Document/Pages/Administration/Components/Licence
│   │   └── sealSelect.jsx  印章信息下拉 /Code/Document/Pages/Administration/Components/SealSelect
│   ├── invalidSeal
│   │   ├── create.jsx  行政类 - 印章作废申请 - 新增 /Code/Document/Pages/Administration/InvalidSeal/Create
│   │   ├── detail.jsx  行政类 - 印章作废申请 - 详情 /Code/Document/Pages/Administration/InvalidSeal/Detail
│   │   └── update.jsx  行政类 - 印章作废申请 - 编辑 /Code/Document/Pages/Administration/InvalidSeal/Update
│   ├── reward
│   │   ├── create.jsx  行政类 - 奖惩通知申请 - 新增 /Code/Document/Pages/Administration/Reward/Create
│   │   ├── detail.jsx  行政类 - 奖惩通知申请 - 详情 /Code/Document/Pages/Administration/Reward/Detail
│   │   └── update.jsx  行政类 - 奖惩通知申请 - 编辑 /Code/Document/Pages/Administration/Reward/Update
│   ├── style.css 样式
│   └── useSeal
│       ├── create.jsx  行政类 - 用章申请 - 新增 /Code/Document/Pages/Administration/UseSeal/Create
│       ├── detail.jsx  行政类 - 用章申请 - 详情 /Code/Document/Pages/Administration/useSeal/Detail
│       └── update.jsx  行政类 - 用章申请 - 编辑 /Code/Document/Pages/Administration/UseSeal/Update
├── attendance
│   ├── abnormal
│   │   ├── detail.js  考勤类 - 考勤异常 - 详情
│   │   └── form.js  考勤类 - 考勤异常 - 创建/编辑
│   ├── components
│   │   ├── hourlyCalculationDays.js  考勤类 - 根据小时计算天
│   │   └── index.js  考勤类 - 公用组件
│   ├── externalOut
│   │   ├── detail.js  考勤类 - 外出申请 - 详情
│   │   └── form.js  考勤类 - 外出申请 - 创建/编辑
│   ├── leave
│   │   ├── detail.js  考勤类 - 请假申请 - 详情
│   │   └── form.js  考勤类 - 请假申请 - 创建/编辑
│   └── overtime
│       ├── detail.js  考勤类 - 加班申请 - 详情
│       └── form.js  考勤类 - 加班申请 - 创建/编辑
├── business
│   ├── bankAccount
│   │   ├── create.jsx  财商类 - 银行开户 - 创建
│   │   ├── detail.jsx  财商类 - 银行开户 - 详情
│   │   └── update.jsx  财商类 - 银行开户 - 编辑
│   ├── cancellationBank
│   │   ├── create.jsx  财商类 - 注销银行账户申请 - 创建
│   │   ├── detail.jsx  财商类 - 注销银行账户申请 - 详情
│   │   └── update.jsx  财商类 - 注销银行账户申请 - 编辑
│   ├── common
│   │   ├── accountSelect.jsx  账户下拉
│   │   ├── accountTypeSelect.jsx  账户类型下拉
│   │   ├── companySelect.jsx  公司下拉
│   │   ├── contractSelect.jsx  合同下拉
│   │   ├── employeesSelect.jsx  人员下拉
│   │   ├── fundTransferAmountRnageSelect.jsx  资金调拨金额范围下拉
│   │   ├── fundTransferCauseSelect.jsx  资金调拨事由下拉
│   │   └── index.jsx  公共组件
│   ├── companyChange
│   │   ├── create.jsx  财商类 - 公司变更 - 创建
│   │   ├── detail.jsx  财商类 - 公司变更申请 - 详情
│   │   └── update.jsx  财商类 - 公司变更 - 编辑
│   ├── contractBorrowing
│   │   ├── create.jsx  财商类 - 合同借阅 - 创建
│   │   ├── detail.jsx  财商类 - 合同借阅 - 详情
│   │   └── update.jsx  财商类 - 合同借阅 - 编辑
│   ├── contractCome
│   │   ├── components
│   │   │   └── items.jsx  合同份数
│   │   ├── create.jsx  财商类 - 合同会审 - 创建
│   │   ├── detail.jsx  财商类 - 合同会审 - 详情
│   │   └── update.jsx  财商类 - 合同会审 - 编辑
│   ├── fundTransfer
│   │   ├── create.jsx  财商类 - 资金调拨 - 创建
│   │   ├── detail.jsx  资金调拨
│   │   ├── styles.less 样式
│   │   └── update.jsx  财商类 - 资金调拨 - 编辑
│   └── registeredCompany
│       ├── create.jsx  财商类 - 注册公司申请 - 创建
│       ├── detail.jsx  财商类 - 注册公司申请 - 详情
│       └── update.jsx  财商类 - 注册公司申请 - 编辑
├── humanResource
│   ├── authorizedStrength
│   │   ├── detail.jsx  人事类 - 增编申请 - 详情
│   │   └── form.jsx  人事类 - 增编申请 - 创建/编辑
│   ├── employ
│   │   ├── detail.jsx  人事类 - 录用申请 - 详情
│   │   └── form.jsx  人事类 - 录用申请 - 创建/编辑
│   ├── induction
│   │   ├── detail.jsx  人事类 - 入职申请 - 详情
│   │   └── form.jsx  人事类 - 入职申请 - 创建&编辑
│   ├── jobHandover
│   │   ├── create.jsx  人事类 - 工作交接 - 创建
│   │   ├── detail.jsx  人事类 - 工作交接 - 详情
│   │   └── update.jsx  人事类 - 工作交接 - 编辑
│   ├── official
│   │   ├── detail.jsx  人事类 - 转正申请 - 详情
│   │   └── form.jsx  人事类 - 转正申请 - 创建/编辑
│   ├── positonTransfer
│   │   ├── create.jsx  人事类 - 人事调动 - 创建
│   │   ├── detail.jsx  人事类 - 人事调动 - 详情
│   │   └── update.jsx  人事类 - 人事调动 - 编辑
│   ├── recruitment
│   │   ├── detail.jsx  人事类 - 招聘申请 - 详情
│   │   └── form.jsx  人事类 - 招聘申请 - 创建/编辑
│   ├── renew
│   │   ├── create.jsx  人事类 - 合同续签 - 创建
│   │   ├── detail.jsx  人事类 - 合同续签 - 详情
│   │   └── update.jsx  人事类 - 合同续签 - 编辑
│   └── resign
│       ├── create.jsx  人事类 - 离职申请 - 创建
│       ├── detail.jsx  人事类 - 离职申请 - 详情
│       └── update.jsx  人事类 - 离职申请 - 编辑
├── other
│   └── sign
│       ├── detail.jsx  其他 - 事务签呈 - 详情
│       └── form.jsx  其他 - 事务签呈 - 创建&编辑
└── �234�语表.md 该文件不存在，请及时更新目录模版文件

44 directories, 140 files44 directories, 140 files
