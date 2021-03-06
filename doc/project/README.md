
..
├── README.md
├── account
│   ├── README.md
│   ├── authorize
│   │   ├── auth.jsx  多账号登录
│   │   ├── index.jsx  登录相关路由
│   │   ├── login.jsx  登录业务组件
│   │   ├── static
│   │   │   ├── bj.jpg 静态文件
│   │   │   ├── huiliuico.png 静态文件
│   │   │   ├── huiliuico2.jpg 静态文件
│   │   │   ├── lgBg.jpg 静态文件
│   │   │   ├── loginBg.jpg 静态文件
│   │   │   ├── logo.png 静态文件
│   │   │   ├── logo@2x.png 静态文件
│   │   │   ├── logoNew.png 静态文件
│   │   │   └── xingdalogo@2x.png 静态文件
│   │   └── style
│   │       ├── auth.less 样式
│   │       ├── login.less 样式
│   │       └── theme.less 样式
│   ├── components
│   │   └── strategyGroupPreview.jsx  我的账户 - 角色数据授权 - 策略组预览
│   └── index.jsx  我的账户模块 我的账户
├── admin
│   ├── README.md
│   ├── developer
│   │   ├── index.jsx  职位 对照显示模块
│   │   └── style.less 样式
│   ├── interface
│   │   ├── components
│   │   │   ├── apiDocument
│   │   │   │   ├── index.jsx  控件，界面
│   │   │   │   └── style.less 样式
│   │   │   ├── content
│   │   │   │   ├── index.jsx  控件，界面
│   │   │   │   └── style.less 样式
│   │   │   ├── finder
│   │   │   │   ├── index.jsx  控件，界面
│   │   │   │   └── mock.json json文件
│   │   │   ├── form
│   │   │   │   └── index.jsx  控件，界面
│   │   │   ├── search
│   │   │   │   └── index.jsx  控件，界面
│   │   │   └── tabs
│   │   │       ├── index.jsx  控件，界面
│   │   │       └── style.less 样式
│   │   ├── document
│   │   │   ├── application.md
│   │   │   ├── interface.md
│   │   │   ├── modules.md
│   │   │   └── plan.md
│   │   ├── examples
│   │   │   └── treeSelect
│   │   │       ├── component.jsx  组合控件，岗位以及职位动
│   │   │       └── index.jsx  控件，界面
│   │   ├── index.jsx  控件，界面
│   │   └── style.less 样式
│   ├── management
│   │   ├── authorize
│   │   │   ├── index.jsx  权限管理模块
│   │   │   ├── moduleTree.jsx  角色，职位，权限 对照显示模块
│   │   │   └── style.less 样式
│   │   └── roles
│   │       ├── index.jsx  角色，职位，权限 对照显示模块
│   │       └── style.less 样式
│   ├── style.less 样式
│   └── system.jsx  角色，职位，权限 对照显示模块
├── amortization
│   ├── component
│   │   ├── accountCenter.jsx  摊销中心 - 核算中心select
│   │   ├── city.jsx  城市select
│   │   ├── invoice.jsx  摊销管理- 发票抬头select
│   │   ├── mainBody.jsx  摊销管理 - 主体select
│   │   ├── platform.jsx  摊销管理 - 平台select
│   │   ├── project.jsx  摊销管理 - 项目select
│   │   ├── scenes.jsx  摊销管理 - 场景select
│   │   └── subject.jsx  摊销管理 - 科目select
│   ├── confirm
│   │   ├── component
│   │   │   ├── addShare.jsx  摊销管理 - 摊销确认表 - 添加分摊数据modal
│   │   │   ├── batchConfirmRule.jsx  摊销管理 - 摊销确认表 - 批量确认规则modal
│   │   │   ├── editRule.jsx  摊销管理 - 摊销确认表 - 编辑规则modal
│   │   │   └── termination.jsx  摊销管理 - 摊销确认表 - 终止modal
│   │   ├── content.jsx  摊销管理 - 摊销确认 - 列表
│   │   ├── detail.jsx 该文件没有头部注释或格式不对
│   │   ├── index.jsx  摊销管理 - 摊销确认页
│   │   └── search.jsx  摊销管理 - 摊销确认 - search
│   └── ledger
│       ├── index.jsx 
│       └── search.jsx  台账明细表-搜索
├── announcement
│   ├── create.jsx  公告接收人 - 权限列表 -创建
│   ├── details.jsx  公告接收人 - 权限详情页
│   ├── index.jsx  公告接收人 - 权限列表
│   ├── search.jsx  公告接收人 - 权限列表 - 搜索
│   ├── style.css 样式
│   └── update.jsx  系统管理 - 用户管理 - 编辑用户
├── assets
│   └── district
│       ├── manage
│       │   ├── changeLog
│       │   │   └── index.jsx  商圈变更记录 - 页面
│       │   ├── components
│       │   │   ├── platforms.jsx  商圈管理 - 平台
│       │   │   ├── setTag.jsx  资产管理 - 商圈管理 - 设置标签弹窗
│       │   │   ├── style.css 样式
│       │   │   ├── tag.jsx  资产管理 - 商圈管理 - 查询 - 标签组件
│       │   │   ├── tripartiteId.jsx  系统管理 - 商圈管理 - 更多三方平台商圈id组件
│       │   │   └── tripartiteIdItem.js  系统管理 - 商圈管理 - 更多三方平台商圈id组件 - 子项
│       │   ├── create.jsx   添加商圈
│       │   ├── detail.jsx   商圈详情
│       │   ├── index.jsx   商圈管理
│       │   ├── search.jsx   商圈管理-搜索组件
│       │   └── style
│       │       └── index.less 样式
│       └── tags
│           ├── component
│           │   └── modal
│           │       └── create.jsx  资产管理 - 商圈管理 - 商圈标签管理 = 新增&编辑标签弹窗
│           ├── content.jsx  资产管理 - 商圈管理 - 商圈标签管理 = 列表组件
│           ├── index.jsx  资产管理 - 商圈管理 - 商圈标签管理
│           ├── index.less 样式
│           └── search.jsx  资产管理 - 商圈管理 - 商圈标签管理 - 查询组件
├── code
│   ├── approveOrder
│   │   ├── component
│   │   │   ├── costItem.js  code - 付款审批 - 通用模版
│   │   │   ├── costItemDetail.js  code - 付款审批 - 通用模版 - 详情
│   │   │   ├── detail
│   │   │   │   ├── basicInfo.jsx  code - 审批单详情 - 基本信息
│   │   │   │   ├── circulation.jsx 
│   │   │   │   ├── cost.jsx  code - 审批单详情 - 费用单信息
│   │   │   │   ├── costItem.jsx  code - 审批单详情 - 费用单单据组件
│   │   │   │   ├── flowPreview.jsx  code - 审批单详情 - 流转记录 - 审批流节点预览
│   │   │   │   ├── flowTimeLine.jsx  code - 审批单详情 - 流转记录 - 审批流timeLine
│   │   │   │   ├── invoice.jsx  审批管理 - 基础设置 - 付款审批 - 发票
│   │   │   │   ├── paymentDetail.jsx  code - 审批单详情 - 付款明细
│   │   │   │   ├── recordOperation.jsx  code - 审批单详情 - 流转记录 - 审批操作
│   │   │   │   ├── relateOrder.jsx  code - 审批单详情 - 关联审批信息
│   │   │   │   ├── supplementOpinionText.jsx  付款审批 - 补充意见文本显示组件
│   │   │   │   ├── transfer.jsx  code - 审批单详情 - 划账单单据组件
│   │   │   │   ├── travel.jsx  code - 审批单详情 - 差旅报销单单据组件
│   │   │   │   └── updateMoney.jsx  code - 基础设置 - 表格组件 - 新建审批流弹窗
│   │   │   ├── form
│   │   │   │   ├── flowLink.jsx  Code/Team审批管理 - 付款审批 - 审批流链接Select
│   │   │   │   └── project.jsx  Code/Team审批管理 - 付款审批 - 项目Select
│   │   │   ├── item.js  费用信息 - 差旅费用明细
│   │   │   ├── operation
│   │   │   │   ├── addTicket.jsx  code - 审批单 - 打验票标签
│   │   │   │   ├── bookMonth.jsx  记账月份
│   │   │   │   ├── ccDrawer
│   │   │   │   │   ├── depPostTreeSelect.jsx  部门岗位Select
│   │   │   │   │   ├── index.jsx  code - 审批单 - 添加抄送
│   │   │   │   │   └── user.jsx  抄送人 - 指定成员
│   │   │   │   ├── checkTicket.jsx  code - 审批单 -  完成验票
│   │   │   │   ├── consent.jsx  code - 审批单 - 同意审批
│   │   │   │   ├── disallowance.jsx  code - 审批单 - 驳回审批
│   │   │   │   ├── markAbnormal.jsx  code - 审批单 - 标记异常审批
│   │   │   │   ├── markNoPay.jsx  code - 审批单 - 标记不付款审批
│   │   │   │   ├── markPayment.jsx  code - 审批单 - 标记付款审批
│   │   │   │   ├── payOption.jsx  code - 审批单详情 - 流转记录 - 付款操作
│   │   │   │   ├── supplementOpinion.jsx  code - 审批单 - 补充意见
│   │   │   │   ├── themeTags.jsx  code - 审批单 - 主题标签
│   │   │   │   └── ticketAbnormal.jsx  code - 审批单 -  验票异常
│   │   │   ├── style.less 样式
│   │   │   ├── travelBusiness.js  code - 差旅报销
│   │   │   └── travelBusinessDetail.js  code - 差旅报销 - 详情
│   │   ├── content.jsx  code - 审批单列表 - 表格
│   │   ├── create.jsx  code - 审批单新建页
│   │   ├── dealSearchValues.js 该文件没有头部注释或格式不对
│   │   ├── detail.jsx  code - 审批单详情
│   │   ├── group.jsx  code - 付款审批单
│   │   ├── index.jsx  code - 付款审批单
│   │   ├── search.jsx  code - 审批单列表 - 查询组件
│   │   ├── style.less 样式
│   │   └── update.jsx  code - 审批单编辑页
│   ├── basicSetting
│   │   ├── flow
│   │   │   ├── component
│   │   │   │   ├── basicForm.jsx  审批流设置，事务性审批流编辑页基本表单组件
│   │   │   │   ├── basicInfo.jsx  事务性审批流详情页
│   │   │   │   ├── ccDrawer
│   │   │   │   │   ├── depPostTreeSelect.jsx  部门岗位treeSelect
│   │   │   │   │   ├── index.jsx  审批流设置，费用审批流编辑页抄送抽屉
│   │   │   │   │   └── user.jsx  抄送人 - 指定成员
│   │   │   │   ├── codeForm.jsx  审批流设置 - 审批流编辑 - 适用code
│   │   │   │   ├── createModal.jsx  code - 基础设置 - 表格组件 - 新建审批流弹窗
│   │   │   │   ├── highestPost.jsx  最高岗位表单
│   │   │   │   ├── nodeDrawer.jsx  code - 基础设置 - 审批流配置 - 审批流编辑 - 节点设置抽屉
│   │   │   │   ├── nodeForm.jsx  code - 基础设置 - 审批流配置 - 审批流编辑 - 节点设置
│   │   │   │   ├── nodeTimeLine.jsx  审批流节点信息时间轴
│   │   │   │   ├── post.jsx  岗位
│   │   │   │   ├── subject.jsx  Code/Team审批管理 - 付款类型配置管理 - 科目Select
│   │   │   │   └── teamForm.jsx  审批流设置 - 审批流编辑 - 适用team
│   │   │   ├── content.jsx  code - 基础设置 - 表格组件
│   │   │   ├── detail.jsx  code - 基础设置 - 审批流管理 - 审批流详情页
│   │   │   ├── form.jsx  code - 基础设置 - 审批流管理 - 审批流编辑页
│   │   │   ├── index.jsx  code - 基本设置 - 审批流配置
│   │   │   ├── search.jsx  code - 基础设置 - 审批流配置
│   │   │   └── style.less 样式
│   │   └── paymentRule
│   │       └── index.jsx  code - 基本设置 - 付款规则
│   ├── components
│   │   ├── associated.jsx  付款审批 - 关联审批
│   │   ├── codeBusinessAccounting.js  code - code核算中心
│   │   ├── collection
│   │   │   ├── collectionBankDetails.jsx  费用单收款信息 - 开户行组件
│   │   │   ├── collectionCardName.jsx  费用单收款信息 - 收款人组件
│   │   │   ├── collectionCardNum.jsx  费用单收款信息 - 收款账户组件
│   │   │   ├── collectionCardPhone.jsx  费用单收款信息 - 收款账户组件
│   │   │   ├── collectionItem.jsx  费用单收款信息组件
│   │   │   ├── index.jsx  code - 支付明细
│   │   │   └── styles.less 样式
│   │   ├── payeeTable.jsx  付款明细 - 表格
│   │   ├── reportModal.jsx  code提报弹窗
│   │   ├── style.less 样式
│   │   ├── subject.js  code - 科目
│   │   ├── teamBusinessAccounting.js  code - code核算中心
│   │   ├── teamInvoiceTitles.js  team - 发票抬头
│   │   ├── travelApplicationForm.jsx  出差申请单组件
│   │   └── upload.jsx  上传文件的表单组件
│   ├── document
│   │   ├── README.md
│   │   ├── components
│   │   │   ├── button.jsx 
│   │   │   ├── creatModal.js  Code/Team审批管理 - 发起审批 - 费控申请 - 弹框
│   │   │   ├── departmentFlow.jsx  code - 发起审批 - 部门（当前员工档案下的）
│   │   │   ├── linkComponent.jsx  Code/Team审批管理 - 发起审批 - 费控申请 - tree - link
│   │   │   ├── postFlow.jsx  code - 发起审批 - 岗位（当前员工档案下的）
│   │   │   ├── style.less 样式
│   │   │   └── treeData.jsx  Code/Team审批管理 - 发起审批 - 费控申请 - tree
│   │   ├── expenseComponents.jsx  发起审批 - 费控申请 /Code/Document
│   │   ├── index.js  发起申请 /Code/Document
│   │   ├── oldExpenseComponents.jsx  发起审批 - 费控申请 /Code/Document
│   │   └── oldExpenseDefine.js  发起审批 - 费控申请 - 页面路由 - 配置管理业务页面路由，方便代理转换
│   ├── home
│   │   ├── components
│   │   │   ├── approval.jsx  code/team - 首页 - 审批单汇总信息
│   │   │   ├── basicInfo.jsx  code/team - 首页 - 账号信息
│   │   │   ├── collectReport.jsx  code/team - 首页 - 收藏的提报
│   │   │   └── link.jsx  code/team - 首页 - 收藏的提报 - 链接
│   │   ├── index.jsx  code/team - 首页
│   │   └── style.less 样式
│   ├── print
│   │   ├── index.jsx  code审批单打印预览页
│   │   ├── item.jsx  code审批单打印预览页
│   │   └── process.jsx 
│   ├── record
│   │   ├── component
│   │   │   ├── basicInfo.jsx  code - 记录明细详情 - 基本信息
│   │   │   ├── costCenterType.jsx  Code/Team审批管理 - 记录明细 - 科目Select
│   │   │   ├── incoice.jsx  team - 发票抬头
│   │   │   ├── invoiceInfo.jsx  code - 记录明细详情 - 发票信息
│   │   │   └── paymentInfo.jsx  code - 审批单详情 - 付款明细
│   │   ├── content.jsx  code - 记录明细
│   │   ├── detail.jsx  code - 记录明细 - 详情
│   │   ├── index.jsx  code - 记录明细
│   │   └── search.jsx  code - 记录明细 - search
│   ├── static
│   │   ├── 001.png 静态文件
│   │   ├── 001@1x.png 静态文件
│   │   ├── 002.png 静态文件
│   │   ├── 002@1x.png 静态文件
│   │   ├── 003.png 静态文件
│   │   ├── 003@1x.png 静态文件
│   │   ├── 004.png 静态文件
│   │   ├── 004@1x.png 静态文件
│   │   ├── 005.png 静态文件
│   │   ├── 005@1x.png 静态文件
│   │   ├── 006.png 静态文件
│   │   ├── 006@1x.png 静态文件
│   │   ├── affairsApprove.png 静态文件
│   │   ├── affairsApprove@2x.png 静态文件
│   │   ├── affairsBorrowing.png 静态文件
│   │   ├── affairsRepayment.png 静态文件
│   │   ├── affairsSubmit.png 静态文件
│   │   ├── affairsSubmit@2x.png 静态文件
│   │   ├── avatar.png 静态文件
│   │   ├── codeApprove.png 静态文件
│   │   ├── codeApprove@2x.png 静态文件
│   │   ├── codeSubmit.png 静态文件
│   │   ├── codeSubmit@2x.png 静态文件
│   │   ├── example.png 静态文件
│   │   ├── example@2x.png 静态文件
│   │   ├── light-bulb.png 静态文件
│   │   ├── path.png 静态文件
│   │   ├── path@2x.png 静态文件
│   │   ├── step.png 静态文件
│   │   └── step@2x.png 静态文件
│   └── typeConfig
│       └── payment
│           ├── component
│           │   ├── createLink.jsx  Code/Team审批管理 - 付款类型配置管理 - 添加链接弹窗
│           │   ├── depAndPost.jsx  部门及岗位 - treeSelect
│           │   ├── flow.jsx  Code/Team审批管理 - 付款类型配置管理 - 审批流Select
│           │   ├── linkIcon.jsx  Code/Team审批管理 - 付款类型配置管理 - icon Select
│           │   ├── matterBasic.jsx  Code/Team审批管理 - 付款类型配置管理 - 内容（事项基本信息）
│           │   ├── matterLink.jsx  Code/Team审批管理 - 付款类型配置管理 - 内容（事项link列表）
│           │   ├── subject.jsx  Code/Team审批管理 - 付款类型配置管理 - 科目Select
│           │   ├── team.jsx  Code/Team审批管理 - 付款类型配置管理 - team Select
│           │   ├── updateLink.jsx  Code/Team审批管理 - 付款类型配置管理 - 编辑链接弹窗
│           │   └── updateMatter.jsx  Code/Team审批管理 - 付款类型配置管理 - 添加链接弹窗
│           ├── content.jsx  Code/Team审批管理 - 付款类型配置管理 - 内容
│           ├── index.jsx  Code/Team审批管理 - 付款类型配置管理
│           └── menu.jsx  Code/Team审批管理 - 付款类型配置管理 - 菜单树结构
├── employee
│   ├── README.md
│   ├── contract
│   │   ├── detail.jsx  合同管理-详情
│   │   ├── index.jsx  合同管理-列表
│   │   ├── search.jsx  人员合同列表-搜索功能
│   │   └── style.css 样式
│   ├── manage
│   │   ├── components
│   │   │   ├── detail
│   │   │   │   ├── accountingCenter.js  核算中心
│   │   │   │   ├── bankInfo.jsx  银行卡信息
│   │   │   │   ├── baseInfo.jsx  个人信息
│   │   │   │   ├── contractInfo.jsx   劳动者档案/合同/协议信息
│   │   │   │   ├── costCenter.jsx   成本中心(详情)
│   │   │   │   ├── educationInfo.jsx  银行卡信息
│   │   │   │   ├── employeeContract.jsx   员工合同信息
│   │   │   │   ├── fileInfo.jsx  档案信息
│   │   │   │   ├── historyContractInfo.js 该文件没有头部注释或格式不对
│   │   │   │   ├── historyContractSearch.js 该文件没有头部注释或格式不对
│   │   │   │   ├── historyInfo.jsx  历史记录
│   │   │   │   ├── historyTripartiteId.js 该文件没有头部注释或格式不对
│   │   │   │   ├── historyWorkInfo.js 该文件没有头部注释或格式不对
│   │   │   │   ├── identityInfo.jsx  身份信息
│   │   │   │   ├── individual.js 该文件没有头部注释或格式不对
│   │   │   │   ├── operateInfo.jsx  操作信息
│   │   │   │   ├── recommendedSource.jsx   推荐信息
│   │   │   │   ├── socialSecurityInfo.jsx  社保/公积金信息
│   │   │   │   ├── style.css 样式
│   │   │   │   ├── util.js   工具库
│   │   │   │   ├── wageInfoDetail.jsx  档案信息
│   │   │   │   ├── workExperience.jsx   工作经历
│   │   │   │   └── workInfo.jsx  工作信息
│   │   │   ├── employee
│   │   │   │   ├── detail
│   │   │   │   │   ├── bankInfo.jsx  员工档案 - 员工详情 - 基本信息tab - 银行卡信息
│   │   │   │   │   ├── basicInfo.jsx  员工档案 - 员工详情 - 基本信息
│   │   │   │   │   ├── careerInfo.jsx  员工档案 - 员工详情 - 职业生涯tab
│   │   │   │   │   ├── contractInfo.jsx  员工档案 - 员工详情 - 合同tab
│   │   │   │   │   ├── costCenterInfo.jsx  员工档案 - 员工详情 - team成本中心信息tab
│   │   │   │   │   ├── educationInfo.jsx  员工档案 - 员工详情 - 基本信息tab - 学历信息
│   │   │   │   │   ├── identityInfo.jsx  员工档案 - 员工详情 - 基本信息tab - 身份信息
│   │   │   │   │   ├── index.jsx  员工档案 - 员工详情
│   │   │   │   │   ├── personalInfo.jsx  员工档案 - 员工详情 - 基本信息 - 个人信息
│   │   │   │   │   ├── recommendedSourceInfo.jsx  员工档案 - 员工 - 基本信息tab - 来源信息
│   │   │   │   │   ├── style.less 样式
│   │   │   │   │   ├── welfareInfo.jsx  员工档案 - 员工详情 - 福利信息tab
│   │   │   │   │   └── workInfo.jsx  员工档案 - 员工详情 - 工作信息tab
│   │   │   │   └── form
│   │   │   │       ├── bankForm.jsx  员工档案 - 创建 - 基本信息tab - 银行卡信息
│   │   │   │       ├── basicForm.jsx  员工档案 - 创建 - 基本信息tab
│   │   │   │       ├── careerForm.jsx  员工档案 - 创建 - 职业生涯tab
│   │   │   │       ├── contractForm.jsx  员工档案 - 创建 - 合同信息tab
│   │   │   │       ├── costCenterForm.jsx  员工档案 - 创建 - TEAM成本中心tab
│   │   │   │       ├── depAndPostItems.jsx  员工档案 - 部门岗位 - form,list - item
│   │   │   │       ├── educationForm.jsx  员工档案 - 创建 - 基本信息tab - 学历信息
│   │   │   │       ├── idnentityForm.jsx  员工档案 - 创建 - 基本信息tab - 身份信息
│   │   │   │       ├── index.jsx  员工档案 - 新建档案
│   │   │   │       ├── personalForm.jsx  员工档案 - 创建 - 基本信息tab - 个人信息
│   │   │   │       ├── recommendedSourceForm.jsx  员工档案 - 创建 - 基本信息tab - 来源信息
│   │   │   │       ├── resetStaff.js 该文件没有头部注释或格式不对
│   │   │   │       ├── style.less 样式
│   │   │   │       ├── welfareForm.jsx  员工档案 - 创建 - 福利信息tab
│   │   │   │       └── workForm.jsx  员工档案 - 创建 - 工作信息tab
│   │   │   ├── form
│   │   │   │   ├── components
│   │   │   │   │   ├── corePhotos.jsx  上传照片组件
│   │   │   │   │   ├── costCompoment.jsx  成本中心
│   │   │   │   │   ├── costItem.jsx  成本信息-业务信息
│   │   │   │   │   ├── platforms.js  城市管理 - 平台
│   │   │   │   │   ├── popconfirmRadio.jsx  单选框气泡选择组件
│   │   │   │   │   ├── selectFundPlan.jsx  社保参保方案名称 - 下拉组件
│   │   │   │   │   ├── selectPlan.jsx  社保参保方案名称 - 下拉组件
│   │   │   │   │   ├── socialSecurity.jsx  社保/公积金信息
│   │   │   │   │   ├── staffDepartments
│   │   │   │   │   │   ├── index.jsx  员工档案-部门及岗位自定义表单
│   │   │   │   │   │   └── item.jsx  员工档案-部门及岗位自定义表单-表单项
│   │   │   │   │   ├── style.less 样式
│   │   │   │   │   ├── team.jsx  人员档案 - tem
│   │   │   │   │   └── teamType.jsx  人员档案 - tem类型
│   │   │   │   ├── create
│   │   │   │   │   ├── bankInfo.jsx  银行卡信息(创建)(废弃)
│   │   │   │   │   ├── baseInfo.jsx  个人信息（创建）(废弃)
│   │   │   │   │   ├── businessInfo.jsx  业务范围信息（创建）
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── contractBelong.jsx 该文件没有头部注释或格式不对
│   │   │   │   │   │   ├── driveForm.jsx  驾驶证件信息表单
│   │   │   │   │   │   ├── dynamicComponent.jsx  自定义表单加减组件
│   │   │   │   │   │   ├── dynamicItems.jsx  自定义表单加减组件项
│   │   │   │   │   │   ├── healthForm.jsx  健康证件信息表单
│   │   │   │   │   │   ├── identityForm.jsx  身份证件信息表单
│   │   │   │   │   │   └── style.css 样式
│   │   │   │   │   ├── contractInfo.jsx  合同/协议信息（创建）
│   │   │   │   │   ├── costCenter.jsx  成本信息
│   │   │   │   │   ├── educationInfo.jsx  学历信息(创建)(废弃)
│   │   │   │   │   ├── fileInfo.jsx  档案信息(创建)
│   │   │   │   │   ├── identityInfo.jsx  身份信息(创建)
│   │   │   │   │   ├── recommendedSourceInfo.jsx  推荐来源信息（创建）
│   │   │   │   │   ├── style.css 样式
│   │   │   │   │   ├── wageInfo.jsx  工资信息（创建）(废弃)
│   │   │   │   │   └── workExperienceInfo.jsx  工作经历信息（创建）(废弃)
│   │   │   │   ├── resetStaff.js 该文件没有头部注释或格式不对
│   │   │   │   └── updata
│   │   │   │       ├── components
│   │   │   │       │   ├── codeTeam.js  code - 归属team
│   │   │   │       │   ├── codeTeamType.js  code - 发票抬头
│   │   │   │       │   ├── driveForm.jsx  驾驶证件信息表单
│   │   │   │       │   ├── dynamicCustomId.jsx  人员编辑页第三方ID列表模块
│   │   │   │       │   ├── healthForm.jsx  健康证件信息表单
│   │   │   │       │   ├── identityForm.jsx  身份证件信息表单
│   │   │   │       │   └── modal
│   │   │   │       │       ├── create.js  三方平台ID - 新增弹窗
│   │   │   │       │       ├── createContract.jsx  新增合同 - 员工编辑页 - 弹窗
│   │   │   │       │       ├── edit.js  三方平台ID - 编辑弹窗
│   │   │   │       │       ├── expiry.js  三方平台ID - 终止弹窗
│   │   │   │       │       ├── remove.js  三方平台ID - 删除弹窗
│   │   │   │       │       └── style.css 样式
│   │   │   │       ├── style.css 样式
│   │   │   │       ├── updataBankInfo.jsx  银行卡信息(编辑)
│   │   │   │       ├── updataBaseInfo.jsx  个人信息（编辑）
│   │   │   │       ├── updataBusinessInfo.jsx  业务范围信息（编辑）
│   │   │   │       ├── updataContractInfo.jsx  合同/协议信息（编辑）
│   │   │   │       ├── updataEducationInfo.jsx  学历信息（编辑）
│   │   │   │       ├── updataFileInfo.jsx  档案信息(编辑)
│   │   │   │       ├── updataIdentityInfo.jsx  身份信息(编辑)
│   │   │   │       ├── updataRecommendedSourceInfo.jsx  推荐来源信息（编辑）
│   │   │   │       ├── updataWageInfo.jsx  工资信息（编辑）
│   │   │   │       ├── updataWorkExperienceInfo.jsx  工作经历信息（编辑）
│   │   │   │       └── updateAccountingCenter.jsx  核算中心
│   │   │   ├── laborer
│   │   │   │   ├── detail
│   │   │   │   │   ├── bankInfo.jsx  员工档案 - 劳动者详情 - 基本信息tab - 银行卡信息
│   │   │   │   │   ├── basicInfo.jsx  员工档案 - 劳动者详情 - 基本信息
│   │   │   │   │   ├── contractInfo.jsx  员工档案 - 劳动者详情 - 合同信息
│   │   │   │   │   ├── costCenterInfo.jsx  员工档案 - 劳动者详情 - TEAM成本中心
│   │   │   │   │   ├── educationInfo.jsx  员工档案 - 员工详情 - 基本信息tab - 学历信息
│   │   │   │   │   ├── experience.jsx  员工档案 - 员工详情 - 职业生涯tab
│   │   │   │   │   ├── identityInfo.jsx  员工档案 - 劳动者详情 - 基本信息tab - 身份信息
│   │   │   │   │   ├── index.jsx  员工档案 - 劳动者详情
│   │   │   │   │   ├── personalInfo.jsx  员工档案 - 劳动者详情 - 基本信息 - 个人信息
│   │   │   │   │   ├── recommendedSourceInfo.jsx  员工档案 - 劳动者详情 - 基本信息tab - 来源信息
│   │   │   │   │   ├── style.less 样式
│   │   │   │   │   └── workInfo.jsx  员工档案 - 劳动者详情 - 系统信息
│   │   │   │   └── form
│   │   │   │       ├── basicForm.jsx  劳动者档案 - 编辑 - 基本信息tab
│   │   │   │       ├── costCenterForm.jsx  劳动者档案档案 - 编辑 - TEAM成本中心tab
│   │   │   │       ├── educationForm.jsx  劳动者档案 - 编辑 - 基本信息tab - 学历信息
│   │   │   │       ├── index.jsx  员工档案 - 新建档案
│   │   │   │       ├── personalForm.jsx  劳动者档案 - 编就 - 基本信息tab - 个人信息
│   │   │   │       ├── recommendedSourceForm.jsx  劳动者档案 - 编辑 - 基本信息tab - 来源信息
│   │   │   │       ├── resetLaborer.js 该文件没有头部注释或格式不对
│   │   │   │       ├── style.less 样式
│   │   │   │       └── workForm.jsx  劳动者档案 - 编辑 - 工作经历tab
│   │   │   └── other
│   │   │       ├── department.jsx  部门 - treeSelect
│   │   │       ├── popconfirmRadio.jsx  单选框气泡选择组件
│   │   │       ├── post.jsx  岗位select
│   │   │       ├── regignation.jsx  人员管理 - 人员档案 - 员工档案 - 办理离职（modal）
│   │   │       ├── selectFundPlan.jsx  社保参保方案名称 - 下拉组件
│   │   │       ├── selectPlan.jsx  社保参保方案名称 - 下拉组件
│   │   │       ├── style.less 样式
│   │   │       ├── team.jsx  人员档案 - tem
│   │   │       └── teamType.jsx  人员档案 - tem类型
│   │   ├── detail.jsx  员工档案 - 详情
│   │   ├── form.jsx  员工档案 - 新建/编辑
│   │   ├── index.jsx  人员管理 - 人员档案
│   │   ├── menu
│   │   │   ├── commonLine.jsx  查看人员渲染公共部分
│   │   │   ├── components
│   │   │   │   ├── changeTeam.jsx  批量变更team
│   │   │   │   ├── codeTeam.js  code - team信息
│   │   │   │   ├── codeTeamType.js  code - team类型
│   │   │   │   └── employeesSelect.jsx  人员下拉
│   │   │   ├── modal
│   │   │   │   └── download.jsx  员工档案 - 搜索 - 下载弹窗
│   │   │   ├── resign.jsx  确认离职页面
│   │   │   ├── secondLine.jsx   劳动者档案
│   │   │   ├── secondSearch.jsx  劳动者档案人员管理列表，搜索功能
│   │   │   ├── staff.jsx   人员
│   │   │   ├── staffSearch.jsx  人员管理列表，搜索功能
│   │   │   └── style.css 样式
│   │   ├── oldDetail.jsx  人员详情
│   │   ├── oldForm.jsx  创建&编辑人员
│   │   ├── oldIndex.jsx  人员管理
│   │   ├── second
│   │   │   ├── content.jsx  人员管理 - 人员档案 - 劳动者档案 - content
│   │   │   ├── index.jsx  人员管理 - 人员档案 - 劳动者档案
│   │   │   └── search.jsx  人员管理 - 人员档案 - 劳动者档案 - content
│   │   └── staff
│   │       ├── content.jsx  人员管理 - 人员档案 - 员工档案 - content
│   │       ├── index.jsx  人员管理 - 人员档案 - 劳动者档案
│   │       └── search.jsx  人员管理 - 人员档案 - 员工档案 - search
│   ├── society
│   │   ├── components
│   │   │   ├── selectPlan.jsx  社保参保方案名称 - 下拉组件
│   │   │   └── societyCard.jsx  社保配置 - 社保卡片组件
│   │   ├── detail
│   │   │   └── index.jsx  人员管理 - 社保配置管理 - 新增与编辑
│   │   ├── form
│   │   │   └── index.jsx  人员管理 - 社保配置管理 - 新增与编辑
│   │   ├── index.jsx  人员管理 - 社保配置管理 - 列表页
│   │   ├── search.jsx  人员管理 - 社保配置管理 - 搜索组件
│   │   └── style.less 样式
│   ├── statisticsData
│   │   ├── index.js  个户注册数据
│   │   └── search.js  个户注册数据 - 查询 /Employee/StatisticsData
│   ├── transport
│   │   ├── detail
│   │   │   ├── index.js  工号管理, 运力工号记录, 详情页面
│   │   │   ├── search.js  工号管理, 运力工号记录, 详情页面, 列表页的搜索组件
│   │   │   └── style.css 样式
│   │   ├── form
│   │   │   ├── components
│   │   │   │   └── knight.jsx  工号管理，骑士信息
│   │   │   ├── create.jsx  工号管理，新建运力弹窗
│   │   │   ├── index.jsx  工号管理, 运力工号记录, 编辑页面
│   │   │   ├── search.jsx  工号管理创建页面, 列表页的搜索组件
│   │   │   ├── style.css 样式
│   │   │   └── update.jsx  工号管理，新建运力弹窗
│   │   ├── index.js  工号管理列表
│   │   ├── search.js  工号管理, 列表页的搜索组件
│   │   └── style.css 样式
│   └── turnover
│       ├── components
│       │   └── modal
│       │       ├── audit.jsx  服务费查询模块, 数据汇总页面-首页 - 提审弹窗
│       │       └── style.css 样式
│       ├── create.jsx  人员管理 - 人员异动管理 - 申请单
│       ├── detail.jsx  人员管理 - 人员异动管理 - 详情
│       ├── index.jsx  人员管理 - 人员异动管理列表
│       ├── search.jsx  人员管理 - 人员异动 - 搜索
│       ├── style.css 样式
│       └── update.jsx  人员管理 - 人员异动管理 - 编辑
├── enterprise
│   └── payment
│       ├── add.js   新增明细 -- 组件
│       ├── detail.js   付款单详情页 /  确认执行付款页
│       ├── employeeList.js   新增付款单 - 人员组件
│       ├── index.js   付款单列表
│       ├── paymentOrder.js   新增付款单
│       ├── search.js   付款单列表-搜索组件
│       └── style.less 样式
├── expense
│   ├── README.md
│   ├── attendance
│   │   ├── style.less 样式
│   │   └── takeLeave
│   │       ├── create.jsx  费用管理 - 考勤管理 - 请假管理 - 创建请假申请
│   │       ├── detail.jsx  费用管理 - 考勤管理 - 请假管理列表页 - 请假详情页
│   │       ├── details
│   │       │   ├── baseInfo.jsx  费用管理 - 考勤管理 - 请假管理列表页 - 请假详情页 - 请假基本信息
│   │       │   ├── single.jsx  费用管理 - 考勤管理 - 请假管理列表页 - 请假详情页 - 请假单信息
│   │       │   └── style.css 样式
│   │       ├── index.jsx  费用管理 - 考勤管理 - 请假管理
│   │       ├── model
│   │       │   ├── create.jsx  审批管理 - 流程审批 - 考勤管理 - 加班管理 - 请假弹窗
│   │       │   └── style.css 样式
│   │       ├── search.jsx  费用管理 - 考勤管理 - 请假管理 - 查询组件
│   │       ├── style.css 样式
│   │       └── update.jsx  费用管理 - 考勤管理 - 请假管理 - 编辑
│   ├── borrowingRepayments
│   │   ├── borrowing
│   │   │   ├── components
│   │   │   │   ├── form
│   │   │   │   │   ├── baseInfo.jsx  费用管理 - 借还款管理 - 新建/编辑 - 基础信息组件
│   │   │   │   │   ├── borrowInfo.jsx  费用管理 - 借还款管理 - 新建/编辑 - 借款信息组件
│   │   │   │   │   ├── borrowerInfo.jsx  费用管理 - 借还款管理 - 新建/编辑 - 借款人信息组件
│   │   │   │   │   ├── repayInfo.jsx  费用管理 - 借还款管理 - 新建/编辑 - 还款信息组件
│   │   │   │   │   └── style.css 样式
│   │   │   │   └── modal
│   │   │   │       └── repaymentsModal.jsx  还款弹窗
│   │   │   ├── create.jsx  费用管理 - 借还款管理 - 借款申请单创建
│   │   │   ├── detail
│   │   │   │   ├── index.jsx  费用管理 - 借还款管理 - 借款管理列表页 - 借款详情页
│   │   │   │   ├── info.jsx  借款单详情 - 借款信息
│   │   │   │   ├── repaymentsInfo.jsx  借款单详情 - 借款信息
│   │   │   │   └── style.css 样式
│   │   │   ├── index.jsx  费用管理 - 借还款管理 - 借款管理列表页   /Expense/BorrowingRepayments/Borrowing
│   │   │   ├── search.jsx  费用管理 - 借还款管理 - 借款管理 - 查询组件
│   │   │   ├── style.css 样式
│   │   │   └── update.jsx  费用管理 - 借还款管理 - 借款申请单编辑
│   │   ├── components
│   │   │   ├── style.css 样式
│   │   │   └── uploadFormItem.jsx  费用管理 - 借还款管理 - 上传组件
│   │   └── repayments
│   │       ├── components
│   │       │   └── form
│   │       │       ├── baseInfo.jsx  费用管理 - 还款管理 - 新建/编辑 - 基础信息组件
│   │       │       ├── borrowInfo.jsx  费用管理 - 还款管理 - 新建/编辑 - 借款信息组件
│   │       │       └── repayInfo.jsx  费用管理 - 还款管理 - 新建/编辑 - 还款信息组件
│   │       ├── create.jsx  费用管理 - 借还款管理 - 还借款申请单创建
│   │       ├── detail
│   │       │   ├── index.jsx  费用管理 - 借还款管理 - 还款管理列表页 - 还款详情页
│   │       │   ├── info.jsx  还款单详情 - 还款信息
│   │       │   └── style.css 样式
│   │       ├── index.jsx  费用管理 - 借还款管理 - 还款管理列表页   Expense/BorrowingRepayments/Repayments
│   │       ├── search.jsx  费用管理 - 借还款管理 - 还款管理 - 查询组件
│   │       ├── style.css 样式
│   │       └── update.jsx  费用管理 - 借还款管理 - 还借款申请单编辑
│   ├── budget
│   │   ├── index.jsx  费用管理 - 费用预算    Expense/Budget (废弃了)
│   │   ├── search.jsx  费用管理 - 费用预算 - 查询组件
│   │   └── style.css 样式
│   ├── components
│   │   ├── alternativedTextBox.jsx  付款审批 - 有备选项的输入组件
│   │   ├── cascadCommonSelector.jsx  项目（平台）- 城市 - 团队（商圈）级联选择表单组件
│   │   ├── commonTransfor
│   │   │   ├── index.jsx  穿梭框
│   │   │   ├── postTransfor.jsx  穿梭框 - 按岗位
│   │   │   ├── postUser.js  岗位|用户tab
│   │   │   ├── style.css 样式
│   │   │   └── userTransfor.jsx  穿梭框 - 按用户
│   │   ├── rank.jsx  审批流职级
│   │   ├── style.less 样式
│   │   ├── upload.js  上传文件组件---用于费用管理中的所有上传功能
│   │   ├── upload.less 样式
│   │   └── uploadAmazon.js  上传execel
│   ├── examineFlow
│   │   ├── component
│   │   │   ├── affairs
│   │   │   │   ├── allPost.jsx  全量岗位
│   │   │   │   ├── basicForm.jsx  审批流设置，事务性审批流编辑页基本表单组件
│   │   │   │   ├── ccDrawer.jsx  审批流设置，事务性审批流编辑页抄送抽屉
│   │   │   │   ├── contractChildTypeComponent.jsx 该文件没有头部注释或格式不对
│   │   │   │   ├── contractTypeComponent.jsx 该文件没有头部注释或格式不对
│   │   │   │   ├── depPostTreeSelect.jsx  部门岗位treeSelect
│   │   │   │   ├── depTreeSelect.jsx  适用部门 - treeSelect
│   │   │   │   ├── detail.jsx  事务性审批流详情页
│   │   │   │   ├── highestPost.jsx  最高岗位表单
│   │   │   │   ├── index.jsx  审批流设置，事务性审批流编辑页入口
│   │   │   │   ├── nodeDrawer.jsx  审批流设置，事务性审批流编辑页节点设置抽屉
│   │   │   │   ├── nodeForm.jsx  审批流设置，事务性审批流编辑页节点表单组件
│   │   │   │   ├── nodeTimeLine.jsx  审批流节点信息时间轴
│   │   │   │   ├── post.jsx  岗位标签
│   │   │   │   ├── postTags.jsx  岗位标签
│   │   │   │   ├── rank.jsx  岗位职级
│   │   │   │   ├── style.less 样式
│   │   │   │   ├── type.jsx  类型
│   │   │   │   ├── user.jsx  抄送人 - 指定成员
│   │   │   │   └── viewRange.jsx  可见范围 - treeSelect
│   │   │   └── common
│   │   │       ├── appropriateType.jsx  适用类型
│   │   │       ├── costGroup.jsx  审批流列表页 - 查询组件 - 费用分组
│   │   │       ├── oldPost.jsx  旧岗位select（非组织架构）
│   │   │       └── platform.jsx  审批流列表页 - 查询组件 - 适用范围
│   │   ├── config
│   │   │   ├── housingManagement
│   │   │   │   ├── component
│   │   │   │   │   ├── examleFlow.js  审批流设置，房屋审批流配置页面，审批流，费用分组设置组件 Expense/ExamineFlow/Config
│   │   │   │   │   └── subjects.js  审批流设置，房屋审批流配置页面，科目设置组件 Expense/ExamineFlow/Config
│   │   │   │   ├── index.js  审批流设置，审批流配置，房屋管理 /Expense/ExamineFlow/Config
│   │   │   │   ├── object.js  审批流设置的配置文件
│   │   │   │   └── style.css 样式
│   │   │   ├── index.js  审批流设置 /Expense/ExamineFlow/Config
│   │   │   ├── salaryIssue
│   │   │   │   ├── component
│   │   │   │   │   ├── expenseType.jsx  审批流设置 - 编辑审批流页面 - 服务费方案 - 费用分组组件 /Expense/ExamineFlow/Config
│   │   │   │   │   ├── items.js  审批流设置 - 编辑审批流页面 - 服务费发放 - 组件 /Expense/ExamineFlow/Config
│   │   │   │   │   ├── style.css 样式
│   │   │   │   │   └── subject.jsx  审批流设置 - 编辑审批流页面 - 服务费方案 - 科目组件 /Expense/ExamineFlow/Config
│   │   │   │   ├── index.js  审批流设置 - 审批流配置 - 服务费发放 /Expense/ExamineFlow/Config
│   │   │   │   └── style.css 样式
│   │   │   └── salaryPlan
│   │   │       ├── component
│   │   │       │   ├── items.js  审批流设置 - 编辑审批流页面 - 服务费方案 - 组件 /Expense/ExamineFlow/Config
│   │   │       │   └── style.css 样式
│   │   │       ├── index.js  审批流设置 - 审批流配置 - 服务费方案 /Expense/ExamineFlow/Config
│   │   │       └── style.css 样式
│   │   ├── cost.jsx  审批流设置，审批流编辑/创建页面 /Expense/ExamineFlow/Form
│   │   ├── costDetail.jsx  审批流设置，审批流详情页面 /Expense/ExamineFlow/Detail
│   │   ├── detail.jsx  审批流详情页入口
│   │   ├── form.jsx  审批流设置，审批流编辑/创建页面 /Expense/ExamineFlow/Form
│   │   ├── index.jsx  审批流程设置 /Expense/ExamineFlow/Process
│   │   ├── modal
│   │   │   ├── create.jsx  费用审批流 - 创建弹窗&设置按钮 /Expense/ExamineFlow/
│   │   │   └── style.css 样式
│   │   ├── post
│   │   │   ├── components
│   │   │   │   ├── addPost.jsx  添加岗位弹窗
│   │   │   │   └── style.css 样式
│   │   │   ├── index.jsx  审批岗位设置 /Expense/ExamineFlow/Post
│   │   │   ├── search.jsx  审批岗位设置 - 搜索组件
│   │   │   └── style.css 样式
│   │   ├── search.jsx  审批流设置，查询 /Expense/ExamineFlow
│   │   └── style.less 样式
│   ├── manage
│   │   ├── common
│   │   │   ├── collection.jsx  费用单收款信息组件
│   │   │   ├── collectionBankDetails.jsx  费用单收款信息 - 开户行组件
│   │   │   ├── collectionCardName.jsx  费用单收款信息 - 收款人组件
│   │   │   ├── collectionCardNum.jsx  费用单收款信息 - 收款账户组件
│   │   │   ├── collectionCardPhone.jsx  费用单收款信息 - 收款账户组件
│   │   │   ├── collectionItem.jsx  费用单收款信息组件
│   │   │   ├── costBelong.jsx  成本归属
│   │   │   ├── costExpense.jsx  费用信息模块模版
│   │   │   ├── costItems.jsx  平台，供应商，城市，商圈，分摊金额 & 科目三级联动选择 & 成本中心数据显示
│   │   │   ├── costSubject.jsx  科目三级联动选择 & 成本中心数据显示
│   │   │   ├── departmentJobs.jsx  费用提报 - 团队信息 - select
│   │   │   ├── expense.jsx  费用信息模块模版
│   │   │   ├── houseInfo.jsx  房屋信息
│   │   │   ├── items.jsx  平台，供应商，城市，商圈，分摊金额 & 科目三级联动选择 & 成本中心数据显示
│   │   │   ├── selectStaff.jsx  费用提报 - 人员信息 - select
│   │   │   ├── styles.less 样式
│   │   │   ├── subject.jsx  科目三级联动选择 & 成本中心数据显示
│   │   │   └── verify.js 该文件没有头部注释或格式不对
│   │   ├── components
│   │   │   ├── affairOrder.jsx  事务性审批单列表
│   │   │   ├── baseInfo.jsx  费用管理 - 付款审批 - 退款审批单 - 基本信息
│   │   │   ├── costAllocation.jsx  费用管理 - 付款审批 - 详情 - 成本分摊组件（详情）
│   │   │   ├── costAllocationForm.jsx  费用管理 = 付款审批 - 详情 - 成本分摊组件（详情）
│   │   │   ├── costAllocationMap.jsx  费用管理 - 付款审批 - 详情 - 成本分摊组件（详情）
│   │   │   ├── costOrder.jsx  费用管理 - 付款审批 - 退款/还款审批单 - 费用单组件
│   │   │   ├── costOrderItem.jsx  审批单详情页面 - 每个费用单组件 Expense/Manage/ExamineOrder/Detail
│   │   │   ├── operate.jsx  退款/红冲 - 提交审批单按钮
│   │   │   ├── style.css 样式
│   │   │   ├── themeTags.jsx  费用管理 - 付款审批 - 退款审批单 - 基本信息
│   │   │   ├── ticketTag.jsx  审批管理 - 基础设置 - 付款审批 - 验票标签
│   │   │   ├── uploadAmazonFile.jsx  s3文件上传
│   │   │   └── uploadFile.jsx  TODO: 注释 @王晋
│   │   ├── examineOrder
│   │   │   ├── businessTravel
│   │   │   │   ├── components
│   │   │   │   │   ├── cost
│   │   │   │   │   │   ├── index.js  费用信息
│   │   │   │   │   │   └── item.jsx  费用信息 - 差旅费用明细
│   │   │   │   │   ├── paymentInfo.jsx  收款信息
│   │   │   │   │   ├── style.less 样式
│   │   │   │   │   ├── travelApplicationForm.jsx  出差申请单组件
│   │   │   │   │   └── travelApplyOrder.jsx  出差信息
│   │   │   │   ├── create.jsx  创建差旅报销单
│   │   │   │   ├── style.less 样式
│   │   │   │   └── update.jsx  编辑差旅报销单
│   │   │   ├── businessTrip
│   │   │   │   ├── components
│   │   │   │   │   ├── businessTravelerInfo.jsx  出差人信息
│   │   │   │   │   ├── businessTripInfo.jsx  出差信息
│   │   │   │   │   └── style.less 样式
│   │   │   │   ├── form.jsx  创建\编辑出差申请单
│   │   │   │   └── style.less 样式
│   │   │   ├── common
│   │   │   │   ├── associated.jsx  付款审批 - 关联审批
│   │   │   │   ├── borrowing.jsx  付款审批 - 借款信息
│   │   │   │   ├── businessTrip.jsx  付款审批 - 出差申请
│   │   │   │   ├── createCostOrder.jsx  付款审批 - 审核记录创建模块
│   │   │   │   ├── expenseType.jsx  付款审批创建 - 费用分组选择组件
│   │   │   │   ├── overTime.jsx  付款审批 - 加班申请
│   │   │   │   ├── process.jsx  审批单 - 审核记录列表详情页面 /Expense/Manage/ExamineOrder/Detail
│   │   │   │   ├── repayment.jsx  付款审批 -还款信息
│   │   │   │   ├── style.less 样式
│   │   │   │   ├── supplementOpinionText.jsx  付款审批 - 补充意见文本显示组件
│   │   │   │   └── takeLeave.jsx  付款审批 - 请假申请
│   │   │   ├── detail
│   │   │   │   ├── approve.jsx  付款审批 - 同意操作
│   │   │   │   ├── approvePersonOrPost.jsx  付款审批 - 通过操作 - 自定义Form组件
│   │   │   │   ├── borrowingInfo.jsx  审批单详情 - 借款信息
│   │   │   │   ├── business.jsx  费用管理 - 付款审批 - 出差详情
│   │   │   │   ├── commonTab.jsx  付款审批 - tab
│   │   │   │   ├── commontab.less 样式
│   │   │   │   ├── components
│   │   │   │   │   ├── addTicketTag.jsx  审批管理 - 基础设置 - 付款审批 - 打验票标签
│   │   │   │   │   ├── approtItem.jsx  红冲分摊弹窗 - item
│   │   │   │   │   ├── checkTicket.jsx  审批管理 - 基础设置 - 付款审批 - 完成验票
│   │   │   │   │   ├── elemSalarySummary.jsx  审批单详情页面 - 饿了么结算汇总
│   │   │   │   │   ├── externalApprove.jsx  审批单详情页 - 外部审批单据组件 Expense/Manage/ExamineOrder/Detail
│   │   │   │   │   ├── historyApprove.jsx  审批单详情页面 - 历史审批单详情
│   │   │   │   │   ├── invoice.jsx  审批管理 - 基础设置 - 付款审批 - 发票
│   │   │   │   │   ├── meituanSalarySummary.jsx  审批单详情页面 - 服务费发放 - 美团结算汇总
│   │   │   │   │   ├── overTime.jsx  付款审批 - 审批单详情 - 加班单
│   │   │   │   │   ├── payeeTable.jsx  付款明细 - 表格
│   │   │   │   │   ├── redBlunt.jsx  审批单详情页面 - 红冲申请单
│   │   │   │   │   ├── redPunchApport.jsx  红冲分摊弹窗
│   │   │   │   │   ├── refund.jsx  审批单详情页面 - 退款申请单
│   │   │   │   │   ├── staff.jsx  红冲分摊 - 人员组件
│   │   │   │   │   ├── style.less 样式
│   │   │   │   │   └── ticketAbnormal.jsx  审批管理 - 基础设置 - 付款审批 - 验票异常
│   │   │   │   ├── costOrderItem.jsx  审批单详情页面 - 每个费用单组件 Expense/Manage/ExamineOrder/Detail
│   │   │   │   ├── index.jsx  审批单详情页面 Expense/Manage/ExamineOrder/Detail
│   │   │   │   ├── paymentException.jsx  付款审批 - 标记异常操作
│   │   │   │   ├── reject.jsx  付款审批 - 驳回操作
│   │   │   │   ├── rejectNodeAndPerson.jsx  付款审批 - 驳回操作 - 自定义Form组件
│   │   │   │   ├── repaymentsInfo.jsx  费用管理 - 付款审批 - 还款信息
│   │   │   │   ├── salaryPlanVersionInfo.jsx  审批单详情 - 薪资规则组件 Expense/Manage/ExamineOrder/Detail
│   │   │   │   ├── salarySummary.jsx  审批单详情 - 薪资发放组件 Expense/Manage/ExamineOrder/Detail
│   │   │   │   ├── style.less 样式
│   │   │   │   ├── supplementOpinion.jsx  付款审批 - 补充意见操作
│   │   │   │   ├── takeLeaveInfo.jsx  付款审批 - 请假单信息
│   │   │   │   ├── travel.jsx  费用管理 - 付款审批 - 差旅详情
│   │   │   │   └── turnover.jsx  付款审批 - 人员异动审批信息
│   │   │   ├── form.jsx  审批单 - 创建/编辑页面 Expense/Manage/ExamineOrder/Form
│   │   │   ├── index.jsx  付款审批页面 Expense/Manage/ExamineOrder
│   │   │   ├── modal
│   │   │   │   └── invoiceAdjust.jsx  付款审批 - 创建红冲退款模态框
│   │   │   ├── search.jsx  付款审批 - 搜索组件
│   │   │   └── style.less 样式
│   │   ├── houseContract
│   │   │   ├── apply.jsx  房屋管理/费用申请信息 /Expense/Manage/House/Apply
│   │   │   ├── brokRent
│   │   │   │   ├── components
│   │   │   │   │   ├── detail
│   │   │   │   │   │   ├── basisInfo.jsx  费用管理 / 房屋管理 / 断租编辑 / 基本信息
│   │   │   │   │   │   ├── historyContractInfo.jsx  费用管理 / 房屋管理 / 断租编辑 / 历史合同信息
│   │   │   │   │   │   └── paymentInfo.jsx  费用管理 / 房屋管理 / 断租租编辑 / 最近一次付款信息
│   │   │   │   │   └── form
│   │   │   │   │       └── brokRent.jsx  费用管理 / 房屋管理 / 断租编辑 / 断租信息
│   │   │   │   ├── style.css 样式
│   │   │   │   └── update.jsx  费用管理 - 房屋管理 - 房屋断租信息编辑 /Expense/Manage/House/brokRent/Update
│   │   │   ├── components
│   │   │   │   ├── apply
│   │   │   │   │   ├── agencyFees.jsx  房屋管理/费用申请/中介费信息
│   │   │   │   │   ├── datePicker.jsx  自定义DatePicker
│   │   │   │   │   ├── deposit.jsx  房屋管理/新建(编辑)/押金信息
│   │   │   │   │   ├── rent.jsx  房屋管理/费用申请/租金信息
│   │   │   │   │   └── style.css 样式
│   │   │   │   ├── common
│   │   │   │   │   ├── baseInfo.jsx  房屋管理/新建(编辑)/基础信息
│   │   │   │   │   ├── customizeRenew.jsx  付款方式 - 自定义表单（无运算逻辑）
│   │   │   │   │   ├── expense.jsx  费用信息模块模版
│   │   │   │   │   ├── expenseApplyRecords.jsx  房屋管理/费用申请记录
│   │   │   │   │   ├── expenseItem.jsx  平台，供应商，城市，商圈，分摊金额 & 科目三级联动选择 & 成本中心数据显示
│   │   │   │   │   ├── operation.jsx  费用管理 - 房屋管理 - 房屋续租/退租/断租提交生成费用单按钮
│   │   │   │   │   ├── showSubject.jsx  根据科目id展示科目名称
│   │   │   │   │   └── style.css 样式
│   │   │   │   ├── detail
│   │   │   │   │   ├── account.jsx  房屋管理 / 房屋详情 / 房屋台账
│   │   │   │   │   ├── agencyFees.jsx  房屋管理/房屋详情/中介费信息
│   │   │   │   │   ├── ascription.jsx  房屋管理/房屋详情/归属组件
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── accountAgencyFee.jsx  房屋管理 / 房屋台账 / 中介费
│   │   │   │   │   │   ├── accountDeposit.jsx  房屋管理 / 房屋台账 / 押金
│   │   │   │   │   │   ├── accountRent.jsx  房屋管理 / 房屋台账 / 租金
│   │   │   │   │   │   └── style.css 样式
│   │   │   │   │   ├── contractInfo.jsx  房屋管理/房屋详情/合同信息
│   │   │   │   │   ├── deposit.jsx  房屋管理/房屋详情/押金信息
│   │   │   │   │   ├── houseInfo.jsx  房屋管理/房屋详情/房屋信息
│   │   │   │   │   ├── renew.jsx  房屋详情 = 历史合同信息
│   │   │   │   │   ├── rent.jsx  房屋管理/房屋详情/租金信息
│   │   │   │   │   └── style.css 样式
│   │   │   │   ├── form
│   │   │   │   │   ├── agencyFees.jsx  房屋管理/新建(编辑)/中介费信息
│   │   │   │   │   ├── ascriptionNew.jsx  房屋管理/新建(编辑)/成本归属/分摊
│   │   │   │   │   ├── collection.jsx  费用单收款信息组件
│   │   │   │   │   ├── contract.jsx  房屋管理/新建(编辑)/合同信息
│   │   │   │   │   ├── customizeRenew.jsx  付款方式 - 自定义表单
│   │   │   │   │   ├── deposit.jsx  房屋管理/新建(编辑)/押金信息
│   │   │   │   │   ├── houseInfo.jsx  房屋管理/新建(编辑)/房屋信息
│   │   │   │   │   ├── renew.jsx  房屋管理 / 新建(编辑) / 付款方式
│   │   │   │   │   ├── rent.jsx  房屋管理/新建(编辑)/租金信息
│   │   │   │   │   ├── share.jsx  房屋管理/新建(编辑)/分摊信息
│   │   │   │   │   └── style.css 样式
│   │   │   │   └── modal
│   │   │   │       ├── export.jsx  房屋管理 = 台账导出（弹窗组件）
│   │   │   │       └── refundDeposit.jsx  退还押金（弹窗）
│   │   │   ├── create.jsx  房屋管理 - 新建房屋信息 /Expense/Manage/House/Create
│   │   │   ├── detail.jsx  房屋管理/房屋信息查看 /Expense/Manage/House/Detail
│   │   │   ├── index.jsx  房屋管理/列表 /Expense/Manage/House
│   │   │   ├── renew
│   │   │   │   ├── components
│   │   │   │   │   ├── detail
│   │   │   │   │   │   └── basisInfo.jsx  费用管理 / 房屋管理 / 续租编辑 / 基本信息
│   │   │   │   │   └── form
│   │   │   │   │       ├── contract.jsx  费用管理 / 房屋管理 / 续签编辑 / 续签合同信息
│   │   │   │   │       ├── operation.jsx  费用管理 - 房屋管理 - 房屋续签操作
│   │   │   │   │       └── rentInfo.jsx  费用管理 / 房屋管理 / 续签编辑 / 租金信息（无运算逻辑）
│   │   │   │   ├── index.jsx  费用管理 / 房屋管理 / 房屋续签编辑
│   │   │   │   └── style.css 样式
│   │   │   ├── renewal
│   │   │   │   ├── components
│   │   │   │   │   ├── detail
│   │   │   │   │   │   ├── basisInfo.jsx  费用管理 / 房屋管理 / 续租编辑 / 房屋信息
│   │   │   │   │   │   ├── contract.jsx  费用管理 / 房屋管理 / 续租编辑 / 合同信息
│   │   │   │   │   │   └── paymentInfo.jsx  费用管理 / 房屋管理 / 续租编辑 / 最近一次付款信息
│   │   │   │   │   └── form
│   │   │   │   │       ├── datePicker.jsx  自定义DatePicker
│   │   │   │   │       └── renewalInfo.jsx  费用管理 / 房屋管理 / 续租编辑 / 续租信息
│   │   │   │   ├── style.css 样式
│   │   │   │   └── update.jsx  费用管理 - 房屋管理 - 房屋续租信息编辑 /Expense/Manage/House/Renewal/Update
│   │   │   ├── search.jsx  房屋管理/列表(搜索组件)
│   │   │   ├── style.css 样式
│   │   │   ├── update.jsx  房屋管理/编辑房屋信息 /Expense/Manage/House/Update
│   │   │   └── withdrawal
│   │   │       ├── components
│   │   │       │   ├── detail
│   │   │       │   │   ├── agencyFeeInfo.jsx  费用管理 / 房屋管理 / 退租编辑 / 中介费信息
│   │   │       │   │   ├── contractInfo.jsx  房屋管理 / 房屋详情 / 退租编辑 / 合同信息
│   │   │       │   │   ├── depositInfo.jsx  费用管理 / 房屋管理 / 退租编辑 / 押金信息
│   │   │       │   │   ├── houseInfo.jsx  费用管理 / 房屋管理 / 退租编辑 / 房屋信息
│   │   │       │   │   └── rentInfo.jsx  费用管理 / 房屋管理 / 退租编辑 / 租金信息（无运算逻辑）
│   │   │       │   └── form
│   │   │       │       └── withdrawalInfo.jsx  费用管理 / 房屋管理 / 退租编辑 / 续租信息
│   │   │       └── update.jsx  费用管理 - 房屋管理 - 房屋退租信息编辑 /Expense/Manage/House/Renewal/Update
│   │   ├── invoiceAjust
│   │   │   ├── costOrder
│   │   │   │   ├── detail.jsx  费用管理 - 付款审批 - 红冲审批单 - 红冲费用单详情
│   │   │   │   ├── detailMap.jsx  费用管理 - 付款审批 - 红冲审批单 - 红冲费用单详情
│   │   │   │   ├── form.jsx  费用管理 - 付款审批 - 红冲审批单 - 红冲费用单编辑
│   │   │   │   ├── index.jsx  费用管理 - 付款审批 - 红冲审批单 - 红冲费用单
│   │   │   │   ├── invoiceAdjust.jsx  费用管理 - 付款审批 - 红冲审批单 - 红冲费用单 - 红冲表单
│   │   │   │   └── style.css 样式
│   │   │   └── form
│   │   │       ├── index.jsx  费用管理 - 付款审批 - 红冲审批单创建
│   │   │       └── style.css 样式
│   │   ├── oaOrder
│   │   │   ├── index.jsx  oa单据页面 Expense/Manage/OaOrder
│   │   │   ├── search.jsx  oa单据页面 - 搜索组件
│   │   │   └── style.less 样式
│   │   ├── print
│   │   │   ├── borrow.jsx  审批单打印模板借款列表 Expense/Manage/Print/borrow
│   │   │   ├── businessTrip.jsx  审批单打印模板出差列表 Expense/Manage/Print/BusinessTrip
│   │   │   ├── cost.jsx  审批单打印的打印区域费用单组件 Expense/Manage/Print/Cost
│   │   │   ├── house.jsx  审批单打印的打印区域房屋信息组件 Expense/Manage/Print/House
│   │   │   ├── invoiceAdjust.jsx  审批红冲单打印的打印区域费用单组件 Expense/Manage/Print/Cost
│   │   │   ├── overTime.jsx  审批单打印模板加班列表
│   │   │   ├── printPreview.jsx  审批单打印预览页面 Expense/Manage/Print/PrintPreview
│   │   │   ├── process.jsx  审批单打印模板审批列表 Expense/Manage/Print/Process
│   │   │   ├── refound.jsx  审批退款单打印的打印区域费用单组件 Expense/Manage/Print/Cost
│   │   │   ├── repayment.jsx  审批单打印模板还款列表 Expense/Manage/Print/repayment
│   │   │   ├── style.css 样式
│   │   │   ├── takeLeave.jsx  审批单打印模板请假列表
│   │   │   ├── temp.jsx  审批单打印的打印区域 Expense/Manage/Print/Temp
│   │   │   └── travel.jsx  审批单打印模板差旅列表 Expense/Manage/Print/Travel
│   │   ├── records
│   │   │   ├── detail.jsx  续租, 续签, 断租, 退租 详情页面入口
│   │   │   ├── form
│   │   │   │   └── index.jsx  续租, 续签, 断租, 退租 创建表单的入口
│   │   │   ├── index.jsx  费用记录明细列表页面 /Expense/Manage/Records
│   │   │   ├── search.jsx  费用记录明细 - 搜索组件
│   │   │   ├── style.css 样式
│   │   │   └── summary
│   │   │       ├── create.jsx  记录明细 - 操作页 /Expense/Manage/Records
│   │   │       └── style.css 样式
│   │   ├── refund
│   │   │   ├── costOrder
│   │   │   │   ├── detail.jsx  费用管理 - 付款审批 - 退款审批单 - 退款费用单详情
│   │   │   │   ├── form.jsx  费用管理 - 付款审批 - 退款审批单 - 退款费用单创建
│   │   │   │   ├── refund.jsx  费用管理 - 付款审批 - 退款审批单 - 退款费用单 - 退款表单
│   │   │   │   └── style.css 样式
│   │   │   └── form
│   │   │       ├── index.jsx  费用管理 - 付款审批 - 退款审批单编辑
│   │   │       └── style.css 样式
│   │   └── template
│   │       ├── components
│   │       │   ├── costProject.jsx  费用表单
│   │       │   ├── invoiceHeader.jsx  费用表单 - 发票抬头
│   │       │   └── style.css 样式
│   │       ├── create
│   │       │   ├── index.jsx  创建模版的入口判断页面
│   │       │   ├── refund.jsx  报销表单的模版
│   │       │   ├── rent.jsx  租金表单的模版 & 该文件暂未使用
│   │       │   └── style.css 样式
│   │       ├── detail
│   │       │   ├── index.jsx  详情模版的入口判断页面 /Expense/Manage/Template/Detail
│   │       │   ├── refund.jsx  报销的详情模版
│   │       │   ├── rent.jsx  租金详情模版
│   │       │   └── travel.jsx  差旅报销的详情模版
│   │       ├── records
│   │       │   ├── detail
│   │       │   │   ├── break.jsx  断租表单模块
│   │       │   │   ├── cancel.jsx  退租表单模块
│   │       │   │   ├── continue.jsx  续租表单模块
│   │       │   │   └── sign.jsx  续签表单模块
│   │       │   └── form
│   │       │       ├── break.jsx  断租表单模块
│   │       │       ├── cancel.jsx  退租表单模块
│   │       │       ├── continue.jsx  续租表单模块
│   │       │       └── sign.jsx  续签表单模块
│   │       └── update
│   │           ├── agency.jsx  中介费表单的模版
│   │           ├── break.jsx  押金损失信息表单的模版
│   │           ├── deposit.jsx  押金表单的模版
│   │           ├── depositRefund.jsx  退回押金信息表单的模版
│   │           ├── depositSpread.jsx  押金差价
│   │           ├── index.jsx  编辑模版的入口判断页面
│   │           ├── quit.jsx  退租信息表单的模版
│   │           ├── refund.jsx  报销表单的模版(编辑)
│   │           ├── rent.jsx  租金表单的模版
│   │           └── style.css 样式
│   ├── overTime
│   │   ├── components
│   │   │   ├── basicInfo.jsx  展示加班申请基本信息
│   │   │   ├── detail
│   │   │   │   ├── overTime.jsx  审批管理 - 流程审批 - 考勤管理 - 加班管理 - 加班单详情 - 加班信息
│   │   │   │   └── person.jsx  审批管理 - 流程审批 - 考勤管理 - 加班管理 - 加班单详情 - 加班人信息
│   │   │   ├── form
│   │   │   │   ├── index.js 该文件没有头部注释或格式不对
│   │   │   │   ├── overTimeInfo.jsx  加班信息编辑组件
│   │   │   │   ├── overTimePerson.jsx  加班人信息编辑组件
│   │   │   │   └── style.less 样式
│   │   │   ├── modal
│   │   │   │   └── create.jsx  审批管理 - 流程审批 - 考勤管理 - 加班管理 - 新建加班弹窗
│   │   │   └── tabContent.jsx  审批管理 - 流程审批 - 考勤管理 - 加班管理 - 表格组件
│   │   ├── create.jsx 该文件没有头部注释或格式不对
│   │   ├── detail.jsx  审批管理 - 流程审批 - 考勤管理 - 加班管理 - 加班单详情 /Expense/Attendance/OverTime/Detail
│   │   ├── index.jsx  审批管理 - 流程审批 - 考勤管理 - 加班管理 /Expense/Attendance/OverTime
│   │   ├── search.jsx  审批管理 - 流程审批 - 考勤管理 - 加班管理 - 查询组件
│   │   ├── style.css 样式
│   │   └── update.jsx  审批管理 - 流程审批 - 考勤管理 - 加班管理 - 加班单编辑 /Expense/Attendance/OverTime/Update
│   ├── relationExamineFlow
│   │   ├── affair
│   │   │   ├── create.js  关联审批流 - 事务类审批流创建
│   │   │   ├── detail.js  关联审批流 - 事务类审批流详情
│   │   │   ├── index.js  事务类审批流
│   │   │   ├── nodeList.jsx  关联审批流 - 节点预览
│   │   │   ├── search.js  事务类审批流 - 查询
│   │   │   └── update.js  关联审批流 - 事务类审批流编辑
│   │   ├── codeTeam
│   │   │   ├── create.js  关联审批流 - code/team审批流创建
│   │   │   ├── detail.js  关联审批流 - code/team审批流创建
│   │   │   ├── index.js  code/team审批流
│   │   │   ├── nodeList.jsx  关联审批流 - 节点预览
│   │   │   ├── search.js  code/team审批流 - 查询
│   │   │   └── update.js  关联审批流 - code/team审批流创建
│   │   ├── component
│   │   │   ├── examineFlow.jsx  审批流组件
│   │   │   ├── type.jsx  类型
│   │   │   └── xdExamineFlow.jsx  审批流组件
│   │   ├── cost
│   │   │   ├── create.js  关联审批流 - 成本类审批流创建
│   │   │   ├── detail.js  关联审批流 - 成本类审批流创建
│   │   │   ├── index.js  成本类审批流
│   │   │   ├── nodeList.jsx  关联审批流 - 节点预览
│   │   │   ├── search.js  成本类审批流 - 查询
│   │   │   └── update.js  关联审批流 - 成本类审批流创建
│   │   ├── index.js  关联审批流
│   │   └── noCost
│   │       ├── create.js  关联审批流 - 非成本类审批流创建
│   │       ├── detail.js  关联审批流 - 非成本类审批流创建
│   │       ├── index.js  非成本类审批流
│   │       ├── nodeList.jsx  关联审批流 - 节点预览
│   │       ├── search.js  非成本类审批流 - 查询
│   │       └── update.js  关联审批流 - 非成本类审批流创建
│   ├── static
│   │   ├── approve.png 静态文件
│   │   ├── approve_payment.png 静态文件
│   │   ├── money_grey.svg
│   │   ├── money_light.svg
│   │   ├── reject.png 静态文件
│   │   ├── waiting.png 静态文件
│   │   └── waiting_payment.png 静态文件
│   ├── statistics
│   │   ├── detail.jsx  费用管理 - 审批监控 - 详情 Expense/Statistics/Detail
│   │   ├── index.jsx  费用管理 - 审批监控 Expense/Statistics
│   │   ├── index.less 样式
│   │   └── search.jsx  费用管理 - 审批监控 - 搜索组件 Expense/Statistics
│   ├── subject
│   │   ├── common
│   │   │   └── attribution.jsx  费用管理 - 科目设置 - 成本归属  /Expense/Subject
│   │   ├── components
│   │   │   ├── createInfo.jsx  科目设置 - 创建信息
│   │   │   ├── style.css 样式
│   │   │   └── updateInfo.jsx  科目设置 - 编辑信息
│   │   ├── create.jsx  科目设置 - 新建科目
│   │   ├── details.jsx  科目设置 - 科目详情
│   │   ├── index.jsx  费用管理 - 科目设置 /Expense/Subject
│   │   ├── search.jsx  费用管理 - 科目设置 - 搜索模块  /Expense/Subject
│   │   ├── style.css 样式
│   │   └── update.jsx  科目设置 - 编辑
│   ├── ticket
│   │   ├── components
│   │   │   └── modal
│   │   │       └── create.jsx  审批管理 - 验票标签 - 新增标签
│   │   └── index.jsx  审批管理 - 基础设置 - 验票标签库设置 /Expense/Ticket
│   ├── travelApplication
│   │   ├── detail.js   出差申请单详情 Expense/TravelApplication/Detail
│   │   ├── index.jsx   出差申请 Expense/TravelApplication
│   │   ├── search.js  出差管理 - 搜索组件
│   │   └── style.css 样式
│   └── type
│       ├── create.js  费用分组新建页面 /Expense/Type/Create
│       ├── detail.js  费用分组详情页面 /Expense/Type/Detail
│       ├── index.jsx  费用分组列表页 /Expense/Type
│       ├── search.jsx  费用分组列表页-搜索栏目
│       ├── style.css 样式
│       └── update.js  费用分组编辑页面 /Expense/Type/Update
├── finance
│   ├── config
│   │   ├── index
│   │   │   ├── index.jsx  服务费结算 - 基础设置 - 结算指标设置 Finance/Config/Index
│   │   │   ├── style
│   │   │   │   └── index.less 样式
│   │   │   └── template.jsx  服务费结算 - 基础设置 - 结算指标设置 - 模版组件
│   │   └── tags
│   │       ├── component
│   │       │   ├── index.jsx  服务费结算 - 基础设置 - 骑士标签设置 - 添加骑士标签组件 Finance/Config/Tags
│   │       │   └── search.jsx  服务费结算 - 基础设置 - 骑士标签设置 - 添加骑士标签组件 - 搜索组件 Finance/Config/Tags
│   │       ├── content.jsx  服务费结算 - 基础设置 - 结算指标设置 - 右侧内容组件
│   │       ├── index.jsx  服务费结算 - 基础设置 - 骑士标签设置 Finance/Config/Tags
│   │       ├── search.jsx  服务费结算 - 基础设置 - 结算指标设置 - 搜索组件
│   │       └── style
│   │           └── index.less 样式
│   ├── manage
│   │   ├── summary
│   │   │   ├── detail
│   │   │   │   ├── city
│   │   │   │   │   ├── index.jsx  结算汇总,城市结算明细 - Finance/Manage/Summary/Detail/City
│   │   │   │   │   ├── search.jsx  结算汇总,城市结算明细,查询 - Finance/Manage/Summary/Detail/City
│   │   │   │   │   └── style
│   │   │   │   │       └── index.less 样式
│   │   │   │   ├── components
│   │   │   │   │   ├── meituanSalaryInfo.jsx  服务费结算 - 结算管理 - 结算单汇总 - 城市结算明细 - 骑士结算明细 - 美团服务费信息
│   │   │   │   │   ├── receiptInfo.jsx  服务费结算 - 结算管理 - 结算单汇总 - 城市结算明细 - 骑士结算明细 - 收款基本信息
│   │   │   │   │   ├── salaryInfo.jsx  服务费结算 - 结算管理 - 结算单汇总 - 城市结算明细 - 骑士结算明细 - 饿了么服务费信息
│   │   │   │   │   └── workInfo.jsx  服务费结算 - 结算管理 - 结算单汇总 - 城市结算明细 - 骑士结算明细 - 工作信息
│   │   │   │   ├── knight.jsx  结算汇总,城市结算明细,骑士结算明细 - Finance/Manage/Summary/Detail/Knight
│   │   │   │   └── style
│   │   │   │       └── index.less 样式
│   │   │   ├── index.jsx  服务费查询模块, 数据汇总页面-首页 - Finance/Summary
│   │   │   ├── modal
│   │   │   │   ├── audit.jsx  服务费查询模块, 数据汇总页面-首页 - 提审弹窗
│   │   │   │   └── style
│   │   │   │       └── index.less 样式
│   │   │   ├── search.jsx  结算模版列表,查询 - Finance/Summary
│   │   │   └── style
│   │   │       └── index.less 样式
│   │   └── task
│   │       ├── create.jsx  结算任务设置 - 创建结算计划设置
│   │       ├── index.jsx  结算任务设置 Finance/Manage/Task
│   │       └── style
│   │           └── index.less 样式
│   ├── plan
│   │   ├── index.jsx  服务费方案 Finance/Summary
│   │   ├── modal
│   │   │   └── create.jsx  服务费方案 - 创建弹窗 Finance/Config/Tags
│   │   ├── search.jsx  服务费方案/列表  搜索组件
│   │   └── style
│   │       └── index.less 样式
│   ├── rules
│   │   ├── calculate
│   │   │   ├── history.jsx  服务费试算 - 试算历史
│   │   │   ├── index.jsx  服务费试算 Finance/Rules/Calculate
│   │   │   ├── information
│   │   │   │   ├── courier.jsx  服务费试算详情页面 - 骑士维度明细
│   │   │   │   ├── districts.jsx  服务费试算详情页面 - 商圈维度明细
│   │   │   │   ├── index.jsx  服务费试算详情页面 Finance/Rules/Calculate/Detail
│   │   │   │   ├── style
│   │   │   │   │   └── index.less 样式
│   │   │   │   └── summary.jsx  服务费试算详情页面 - 试算汇总
│   │   │   ├── modal
│   │   │   │   ├── create.jsx  服务费试算 - 服务费试算弹窗
│   │   │   │   ├── style
│   │   │   │   │   └── index.less 样式
│   │   │   │   └── verify.jsx  服务费试算 - 提交审审核弹窗
│   │   │   ├── result.jsx  服务费试算 - 试算结果
│   │   │   └── style
│   │   │       └── index.less 样式
│   │   ├── components
│   │   │   ├── common
│   │   │   │   ├── addRuleModal.jsx  服务费规则 - 规则添加弹窗
│   │   │   │   ├── collapse.jsx  内容组件 - 内容展开收起组件
│   │   │   │   ├── container.jsx  抽象组件 - 遍历数据，回调渲染的容器
│   │   │   │   ├── knightClassification.js  服务费规则生成 - 公用骑士分类组件
│   │   │   │   ├── knightTags.jsx  服务费规则生成 - 公用骑士标签组件
│   │   │   │   ├── mutualExclusionControl.jsx  控制互斥组件
│   │   │   │   ├── orderType
│   │   │   │   │   ├── index.jsx  服务费规则 - 模板规则创建 - 单型选择组件
│   │   │   │   │   └── item.jsx  服务费规则 - 模板规则创建 - 单型选择组件条目
│   │   │   │   ├── popconfirmBtns
│   │   │   │   │   └── index.js  服务费规则生成 - 公用气泡数量组件 Finance/Rules/Generator
│   │   │   │   ├── popoverRadio.jsx  单选框气泡选择组件
│   │   │   │   ├── salaryIndicators.jsx  服务费规则 - 模板规则 - 结算指标组件
│   │   │   │   ├── style
│   │   │   │   │   └── index.less 样式
│   │   │   │   └── updataEffectiveModal.jsx  服务费规则 - 修改生效时间弹窗
│   │   │   ├── fields.md
│   │   │   └── generator
│   │   │       ├── README.md
│   │   │       ├── attendance
│   │   │       │   ├── components
│   │   │       │   │   └── ruleFrom.js  服务费规则生成 - 出勤组件 - 公用表单
│   │   │       │   ├── content.jsx  服务费规则生成 - 出勤组件 - 列表组件 Finance/Rules/Generator
│   │   │       │   ├── create.jsx  服务费规则生成 - 出勤组件 - 创建组件 Finance/Rules/Generator
│   │   │       │   ├── index.jsx  服务费规则生成 - 出勤组件 Finance/Rules/Generator
│   │   │       │   └── style
│   │   │       │       └── index.less 样式
│   │   │       ├── management
│   │   │       │   ├── common
│   │   │       │   │   ├── InsuranceForm.js  服务费规则生成 - 管理组件 - 创建组件 - 保险扣款设置 - 公用表单 Finance/Rules/Generator
│   │   │       │   │   ├── dayItem
│   │   │       │   │   │   ├── index.js  服务费规则生成 - 管理组件 - 公用组件 - 公用表单 Finance/Rules/Generator
│   │   │       │   │   │   ├── item.js  服务费规则生成 - 管理组件 - 公用组件 - 公用表单 - 子项 Finance/Rules/Generator
│   │   │       │   │   │   └── style
│   │   │       │   │   │       └── index.less 样式
│   │   │       │   │   ├── dayNum
│   │   │       │   │   │   ├── index.js  服务费规则生成 - 管理组件 - 公用组件 - 天数组件 Finance/Rules/Generator
│   │   │       │   │   │   └── style
│   │   │       │   │   │       └── index.less 样式
│   │   │       │   │   ├── style
│   │   │       │   │   │   └── index.less 样式
│   │   │       │   │   └── suppliesDeduct.js  服务费规则生成 - 管理组件 - 创建组件 - 物资扣款设置 Finance/Rules/Generator
│   │   │       │   ├── content
│   │   │       │   │   └── index.jsx  服务费规则生成 - 管理组件 - 列表组件 - 内容组件 Finance/Rules/Generator
│   │   │       │   ├── create
│   │   │       │   │   ├── index.jsx  服务费规则生成 - 管理组件 - 创建组件 Finance/Rules/Generator
│   │   │       │   │   ├── insuranceDeduct.jsx  服务费规则生成 - 管理组件 - 创建组件 - 创建保险扣款设置 Finance/Rules/Generator
│   │   │       │   │   ├── style
│   │   │       │   │   │   └── index.less 样式
│   │   │       │   │   └── suppliesDeduct.jsx  服务费规则生成 - 管理组件 - 创建组件 - 物资扣款设置 Finance/Rules/Generator
│   │   │       │   └── index.jsx  服务费规则生成 - 管理组件 Finance/Rules/Generator
│   │   │       ├── order
│   │   │       │   ├── common
│   │   │       │   │   ├── extractRule.jsx  单量提成规则--详细方案规则
│   │   │       │   │   └── items.jsx  单量提成规则-详细方案规则-子项
│   │   │       │   ├── content.jsx  服务费规则生成 - 单量组件 - 列表组件 Finance/Rules/Generator
│   │   │       │   ├── create.jsx  服务费规则生成 - 单量组件 - 创建组件 Finance/Rules/Generator
│   │   │       │   ├── index.jsx  服务费规则生成 - 单量组件 Finance/Rules/Generator
│   │   │       │   └── style
│   │   │       │       └── index.less 样式
│   │   │       └── quality
│   │   │           ├── content.jsx  服务费规则生成 - 质量组件 - 列表组件 Finance/Rules/Generator
│   │   │           ├── create
│   │   │           │   ├── common
│   │   │           │   │   ├── awardSetting.jsx  服务费规则 补贴质量 奖励部分 Finance/Components/generator/quality/create/common/awardSetting
│   │   │           │   │   ├── ladderAward.jsx  服务费规则 补贴质量 单人考核 设定奖罚 阶梯奖励
│   │   │           │   │   ├── ladderAwardRule
│   │   │           │   │   │   ├── index.jsx  服务费规则 - 质量评比 - 阶梯奖励组件
│   │   │           │   │   │   ├── item.jsx  服务费规则 - 质量评比 - 阶梯奖励组件 - 条目组件
│   │   │           │   │   │   └── style
│   │   │           │   │   │       └── index.less 样式
│   │   │           │   │   ├── mutipleConditionSetting
│   │   │           │   │   │   ├── index.jsx  服务费规则 补贴质量 竞赛评比 按多组条件设置
│   │   │           │   │   │   ├── item.jsx  服务费规则 补贴质量 竞赛评比 按多组条件设置 条目 Finance/Components/generator/quality/create/competition/mutipleConditionSetting/item
│   │   │           │   │   │   └── style
│   │   │           │   │   │       └── index.less 样式
│   │   │           │   │   ├── style
│   │   │           │   │   │   └── index.less 样式
│   │   │           │   │   ├── titleBar
│   │   │           │   │   │   ├── index.jsx  服务费规则 补贴质量 标题 Finance/Components/generator/quality/create/competition/common/titleBar/index
│   │   │           │   │   │   └── style
│   │   │           │   │   │       └── index.less 样式
│   │   │           │   │   └── topTip
│   │   │           │   │       └── index.jsx  服务费规则 补贴质量 顶部提示条
│   │   │           │   ├── competition
│   │   │           │   │   ├── competitionEdit.jsx  服务费规则 补贴质量 竞赛评比 可编辑部分 Finance/Components/generator/quality/create/competition/competitionEdit
│   │   │           │   │   ├── competitionLadderAward.jsx  服务费规则 补贴质量 竞赛评比 设定奖罚 阶梯奖励 Finance/Components/generator/quality/create/competitionLadderAward
│   │   │           │   │   ├── index.jsx  服务费规则 补贴质量 竞赛评比 Finance/Components/quality/create/competition
│   │   │           │   │   ├── rankSetting.jsx  服务费规则 排名配置 Finance/Components/quality/create/rankSetting
│   │   │           │   │   └── style
│   │   │           │   │       └── index.less 样式
│   │   │           │   ├── index.jsx  服务费规则生成 - 质量组件 - 创建组件 Finance/Rules/Generator
│   │   │           │   ├── person
│   │   │           │   │   ├── index.jsx  服务费规则 补贴质量 单人考核 Finance/Components/quality/person
│   │   │           │   │   ├── personEdit.jsx  服务费规则 补贴质量 单人评比 可编辑部分 Finance/Components/generator/quality/create/competition/competitionEdit
│   │   │           │   │   └── style
│   │   │           │   │       └── index.less 样式
│   │   │           │   └── style
│   │   │           │       └── index.less 样式
│   │   │           ├── index.jsx  服务费规则生成 - 质量组件 Finance/Rules/Generator
│   │   │           └── style
│   │   │               └── index.less 样式
│   │   ├── draft.jsx  服务费规则--模板--草稿箱、审核中、待生效、已生效
│   │   ├── generator.jsx  服务费规则生成 Finance/Rules/Generator
│   │   ├── history.jsx  服务费方案-审批历史 Finance/Rules/History
│   │   ├── index.jsx  服务费规则 Finance/Rules
│   │   └── style
│   │       └── index.less 样式
│   └── static
│       ├── checkFailure.png 静态文件
│       ├── cylinder.png 静态文件
│       ├── submitPending.png 静态文件
│       └── uploadPending.png 静态文件
├── layout
│   ├── README.md
│   ├── breadcrumb.jsx  面包屑
│   ├── error.jsx  404 错误页面
│   ├── header.css 样式
│   ├── header.jsx  布局的header
│   ├── index.css 样式
│   ├── index.jsx  布局layout,容器组件
│   ├── logo.jsx  logo组件
│   ├── navigation.jsx   侧栏导航
│   ├── static
│   │   ├── avatar.png 静态文件
│   │   ├── errorBg.png 静态文件
│   │   ├── errorBtn.png 静态文件
│   │   ├── huiliuico.png 静态文件
│   │   ├── logoOld.jpg 静态文件
│   │   ├── navLogo@2x.png 静态文件
│   │   ├── userIcon.png 静态文件
│   │   └── xingda.png 静态文件
│   └── widgets
│       ├── qrcode.jsx  点击展示二维码组件
│       ├── style.css 样式
│       └── task.jsx  任务列表的组建
├── oa
│   ├── document
│   │   ├── README.md
│   │   ├── assets
│   │   │   ├── 101.png 静态文件
│   │   │   ├── 102.png 静态文件
│   │   │   ├── 103.png 静态文件
│   │   │   ├── 104.png 静态文件
│   │   │   ├── 105.png 静态文件
│   │   │   ├── 106.png 静态文件
│   │   │   ├── 107.png 静态文件
│   │   │   ├── 108.png 静态文件
│   │   │   ├── 109.png 静态文件
│   │   │   ├── 201.png 静态文件
│   │   │   ├── 202.png 静态文件
│   │   │   ├── 203.png 静态文件
│   │   │   ├── 204.png 静态文件
│   │   │   ├── 301.png 静态文件
│   │   │   ├── 302.png 静态文件
│   │   │   ├── 303.png 静态文件
│   │   │   ├── 305.png 静态文件
│   │   │   ├── 306.png 静态文件
│   │   │   ├── 308.png 静态文件
│   │   │   ├── 309.png 静态文件
│   │   │   ├── 401.png 静态文件
│   │   │   ├── 402.png 静态文件
│   │   │   ├── 403.png 静态文件
│   │   │   ├── 404.png 静态文件
│   │   │   ├── 405.png 静态文件
│   │   │   ├── 406.png 静态文件
│   │   │   ├── 408.png 静态文件
│   │   │   ├── 501.png 静态文件
│   │   │   ├── 601.png 静态文件
│   │   │   ├── expense
│   │   │   │   ├── 006.png 静态文件
│   │   │   │   ├── 1.png 静态文件
│   │   │   │   ├── 6.png 静态文件
│   │   │   │   ├── 7.png 静态文件
│   │   │   │   ├── 8.png 静态文件
│   │   │   │   ├── 9.png 静态文件
│   │   │   │   ├── hover-1.png 静态文件
│   │   │   │   ├── hover-6.png 静态文件
│   │   │   │   ├── hover-7.png 静态文件
│   │   │   │   ├── hover-8.png 静态文件
│   │   │   │   └── hover-9.png 静态文件
│   │   │   ├── hover-101.png 静态文件
│   │   │   ├── hover-102.png 静态文件
│   │   │   ├── hover-103.png 静态文件
│   │   │   ├── hover-104.png 静态文件
│   │   │   ├── hover-105.png 静态文件
│   │   │   ├── hover-106.png 静态文件
│   │   │   ├── hover-107.png 静态文件
│   │   │   ├── hover-108.png 静态文件
│   │   │   ├── hover-109.png 静态文件
│   │   │   ├── hover-201.png 静态文件
│   │   │   ├── hover-202.png 静态文件
│   │   │   ├── hover-203.png 静态文件
│   │   │   ├── hover-204.png 静态文件
│   │   │   ├── hover-301.png 静态文件
│   │   │   ├── hover-302.png 静态文件
│   │   │   ├── hover-303.png 静态文件
│   │   │   ├── hover-305.png 静态文件
│   │   │   ├── hover-306.png 静态文件
│   │   │   ├── hover-308.png 静态文件
│   │   │   ├── hover-309.png 静态文件
│   │   │   ├── hover-401.png 静态文件
│   │   │   ├── hover-402.png 静态文件
│   │   │   ├── hover-403.png 静态文件
│   │   │   ├── hover-404.png 静态文件
│   │   │   ├── hover-405.png 静态文件
│   │   │   ├── hover-406.png 静态文件
│   │   │   ├── hover-408.png 静态文件
│   │   │   ├── hover-501.png 静态文件
│   │   │   └── hover-601.png 静态文件
│   │   ├── components
│   │   │   ├── approvalInfo.jsx  tab切换下
│   │   │   ├── basisInfo.jsx  基本信息
│   │   │   ├── basisOrderForm.jsx  基本信息（兼容旧版本form）
│   │   │   ├── contractChildTypeComponent.jsx 该文件没有头部注释或格式不对
│   │   │   ├── contractTypeComponent.jsx 该文件没有头部注释或格式不对
│   │   │   ├── departmentDisplay.jsx  根据部门id展示部门名称
│   │   │   ├── detail.jsx  单据详情页面模块
│   │   │   ├── employeesSelect.jsx  人员下拉
│   │   │   ├── expense
│   │   │   │   ├── button.jsx 
│   │   │   │   ├── modal.jsx  发起审批 - 费控管理 - 创建弹窗
│   │   │   │   └── style.css 样式
│   │   │   ├── fixedCopyGiveDisplay.jsx  固定抄送展示
│   │   │   ├── flow
│   │   │   │   ├── button.jsx 
│   │   │   │   ├── modal.jsx  发起审批 - 事务申请 - 弹框
│   │   │   │   └── style.css 样式
│   │   │   ├── flowName.jsx  渲染审批流预览流程名称组件
│   │   │   ├── form
│   │   │   │   ├── buttons.jsx  表单按钮组件 - 表单创建/编辑按钮
│   │   │   │   ├── departmentFlow.jsx  事务性表单 - 部门（审批流联动）
│   │   │   │   ├── flow.jsx  事务性表单 - 审批流信息
│   │   │   │   ├── postFlow.jsx  事务性表单 - 岗位（审批流联动）
│   │   │   │   ├── submit.jsx  表单按钮组件 - 提交动作
│   │   │   │   └── update.jsx  表单按钮组件 - 保存动作
│   │   │   ├── index.js  公共组件
│   │   │   ├── organizationJobSelect.jsx  岗位库下拉列表
│   │   │   ├── relatedApproval.jsx 
│   │   │   ├── style.less 样式
│   │   │   ├── themeTag.js  主题标签
│   │   │   ├── themeTags.jsx  tab切换下
│   │   │   ├── upload
│   │   │   │   └── upload.jsx  上传文件的表单组件
│   │   │   └── wapper
│   │   │       ├── breadcrumb.jsx  布局包装容器
│   │   │       ├── create.jsx  布局包装容器
│   │   │       ├── detail.jsx  布局包装容器
│   │   │       └── update.jsx  布局包装容器
│   │   ├── define.jsx  发起审批 - 事务申请 - 页面路由 - 配置管理业务页面路由，方便代理转换
│   │   ├── dynamic.jsx  OA路由配置, 动态路由
│   │   ├── expenseComponents.jsx  发起审批 - 费控申请 /OA/Document
│   │   ├── expenseDefine.js  发起审批 - 费控申请 - 页面路由 - 配置管理业务页面路由，方便代理转换
│   │   ├── index.js  发起申请 /OA/Document
│   │   ├── oaComponents.jsx  发起审批 - 事务申请 /OA/Document
│   │   └── pages
│   │       ├── administration
│   │       │   ├── borrowLicense
│   │       │   │   ├── create.jsx  行政类 - 证照借用申请 - 新增 /Oa/Document/Pages/Administration/BorrowLicense/Create
│   │       │   │   ├── detail.js  行政类 - 证照借用申请 - 详情 /Oa/Document/Pages/Administration/BorrowLicense/Create
│   │       │   │   └── update.jsx  行政类 - 证照借用申请 - 编辑 /Oa/Document/Pages/Administration/BorrowLicense/Update
│   │       │   ├── borrowSeal
│   │       │   │   ├── create.jsx  行政类 - 借章申请 - 新增 /Oa/Document/Pages/Administration/BorrowSeal/Create
│   │       │   │   ├── detail.jsx  行政类 - 借章申请 - 详情 /Oa/Document/Pages/Administration/BorrowSeal/Detail
│   │       │   │   └── update.jsx  行政类 - 借章申请 - 编辑 /Oa/Document/Pages/Administration/BorrowSeal/Update
│   │       │   ├── businessCard
│   │       │   │   ├── create.jsx  行政类 - 名片申请 - 新增 /Oa/Document/Pages/Administration/Business/Create
│   │       │   │   ├── detail.jsx  行政类 - 名片申请 - 详情 /Oa/Document/Pages/Administration/Business/Create
│   │       │   │   └── update.jsx  行政类 - 名片申请 - 编辑 /Oa/Document/Pages/Administration/Business/Update
│   │       │   ├── carveSeal
│   │       │   │   ├── create.jsx  行政类 - 刻章申请 - 新增 /Oa/Document/Pages/Administration/CarveSeal/Create
│   │       │   │   ├── detail.jsx  行政类 - 刻章申请 - 详情 /Oa/Document/Pages/Administration/CarveSeal/Detail
│   │       │   │   └── update.jsx  行政类 - 刻章申请 - 编辑 /Oa/Document/Pages/Administration/CarveSeal/Update
│   │       │   ├── components
│   │       │   │   ├── companySelect.jsx  公司下拉 /Oa/Document/Pages/Administration/Components/CompanySelect
│   │       │   │   ├── keepingSelect.jsx  印章保管人下拉 /Oa/Document/Pages/Administration/Components/KeepingSelect
│   │       │   │   ├── license.jsx  证照库 /Oa/Document/Pages/Administration/Components/Licence
│   │       │   │   └── sealSelect.jsx  印章信息下拉 /Oa/Document/Pages/Administration/Components/SealSelect
│   │       │   ├── invalidSeal
│   │       │   │   ├── create.jsx  行政类 - 印章作废申请 - 新增 /Oa/Document/Pages/Administration/InvalidSeal/Create
│   │       │   │   ├── detail.jsx  行政类 - 印章作废申请 - 详情 /Oa/Document/Pages/Administration/InvalidSeal/Detail
│   │       │   │   └── update.jsx  行政类 - 印章作废申请 - 编辑 /Oa/Document/Pages/Administration/InvalidSeal/Update
│   │       │   ├── reward
│   │       │   │   ├── create.jsx  行政类 - 奖惩通知申请 - 新增 /Oa/Document/Pages/Administration/Reward/Create
│   │       │   │   ├── detail.jsx  行政类 - 奖惩通知申请 - 详情 /Oa/Document/Pages/Administration/Reward/Detail
│   │       │   │   └── update.jsx  行政类 - 奖惩通知申请 - 编辑 /Oa/Document/Pages/Administration/Reward/Update
│   │       │   ├── style.css 样式
│   │       │   └── useSeal
│   │       │       ├── create.jsx  行政类 - 用章申请 - 新增 /Oa/Document/Pages/Administration/UseSeal/Create
│   │       │       ├── detail.jsx  行政类 - 用章申请 - 详情 /Oa/Document/Pages/Administration/useSeal/Detail
│   │       │       └── update.jsx  行政类 - 用章申请 - 编辑 /Oa/Document/Pages/Administration/UseSeal/Update
│   │       ├── attendance
│   │       │   ├── abnormal
│   │       │   │   ├── detail.js  考勤类 - 考勤异常 - 详情
│   │       │   │   └── form.js  考勤类 - 考勤异常 - 创建/编辑
│   │       │   ├── components
│   │       │   │   ├── hourlyCalculationDays.js  考勤类 - 根据小时计算天
│   │       │   │   └── index.js  考勤类 - 公用组件
│   │       │   ├── externalOut
│   │       │   │   ├── detail.js  考勤类 - 外出申请 - 详情
│   │       │   │   └── form.js  考勤类 - 外出申请 - 创建/编辑
│   │       │   ├── leave
│   │       │   │   ├── detail.js  考勤类 - 请假申请 - 详情
│   │       │   │   └── form.js  考勤类 - 请假申请 - 创建/编辑
│   │       │   └── overtime
│   │       │       ├── detail.js  考勤类 - 加班申请 - 详情
│   │       │       └── form.js  考勤类 - 加班申请 - 创建/编辑
│   │       ├── business
│   │       │   ├── bankAccount
│   │       │   │   ├── create.jsx  财商类 - 银行开户 - 创建
│   │       │   │   ├── detail.jsx  财商类 - 银行开户 - 详情
│   │       │   │   └── update.jsx  财商类 - 银行开户 - 编辑
│   │       │   ├── cancellationBank
│   │       │   │   ├── create.jsx  财商类 - 注销银行账户申请 - 创建
│   │       │   │   ├── detail.jsx  财商类 - 注销银行账户申请 - 详情
│   │       │   │   └── update.jsx  财商类 - 注销银行账户申请 - 编辑
│   │       │   ├── common
│   │       │   │   ├── accountSelect.jsx  账户下拉
│   │       │   │   ├── accountTypeSelect.jsx  账户类型下拉
│   │       │   │   ├── companySelect.jsx  公司下拉
│   │       │   │   ├── contractSelect.jsx  合同下拉
│   │       │   │   ├── employeesSelect.jsx  人员下拉
│   │       │   │   ├── employeesSelectOnly.jsx  指定人员下拉（固定合同保管人）
│   │       │   │   ├── fundTransferAmountRnageSelect.jsx  资金调拨金额范围下拉
│   │       │   │   ├── fundTransferCauseSelect.jsx  资金调拨事由下拉
│   │       │   │   └── index.jsx  公共组件
│   │       │   ├── companyChange
│   │       │   │   ├── create.jsx  财商类 - 公司变更 - 创建
│   │       │   │   ├── detail.jsx  财商类 - 公司变更申请 - 详情
│   │       │   │   └── update.jsx  财商类 - 公司变更 - 编辑
│   │       │   ├── contractBorrowing
│   │       │   │   ├── component
│   │       │   │   │   ├── contractInfo.jsx  添加多个借阅合同组件
│   │       │   │   │   ├── contractInfoItem.jsx  ContractInfo Item
│   │       │   │   │   └── style.less 样式
│   │       │   │   ├── create.jsx  财商类 - 合同借阅 - 创建
│   │       │   │   ├── detail.jsx  财商类 - 合同借阅 - 详情
│   │       │   │   └── update.jsx  财商类 - 合同借阅 - 编辑
│   │       │   ├── contractCome
│   │       │   │   ├── components
│   │       │   │   │   ├── contractChildTypeComponent.jsx  合同子类型 下拉组件
│   │       │   │   │   ├── contractTypeComponent.jsx  合同类型 下拉组件
│   │       │   │   │   ├── items.jsx  合同份数
│   │       │   │   │   └── sealType.js  盖章类型
│   │       │   │   ├── create.jsx  财商类 - 合同会审 - 创建
│   │       │   │   ├── detail.jsx  财商类 - 合同会审 - 详情
│   │       │   │   └── update.jsx  财商类 - 合同会审 - 编辑
│   │       │   ├── fundTransfer
│   │       │   │   ├── create.jsx  财商类 - 资金调拨 - 创建
│   │       │   │   ├── detail.jsx  资金调拨
│   │       │   │   ├── styles.less 样式
│   │       │   │   └── update.jsx  财商类 - 资金调拨 - 编辑
│   │       │   └── registeredCompany
│   │       │       ├── create.jsx  财商类 - 注册公司申请 - 创建
│   │       │       ├── detail.jsx  财商类 - 注册公司申请 - 详情
│   │       │       └── update.jsx  财商类 - 注册公司申请 - 编辑
│   │       ├── departmentPost
│   │       │   └── detail.js  组织管理 - 详情
│   │       ├── fake
│   │       │   └── businessTrip
│   │       │       ├── create.jsx  事务审批 - 假勤管理 - 出差申请 - 创建
│   │       │       ├── detail.jsx  事务审批 - 假勤管理 - 出差申请 - 详情
│   │       │       ├── regional.jsx  省、市、区、详细地址组件
│   │       │       ├── regionalList.js  省、市、区json数据
│   │       │       ├── style.less 样式
│   │       │       ├── travelStandard.jsx  code - 事务申请 - 出差申请 - 出差明细标准
│   │       │       └── update.jsx  事务审批 - 假勤管理 - 出差申请 - 编辑
│   │       ├── humanResource
│   │       │   ├── authorizedStrength
│   │       │   │   ├── detail.jsx  人事类 - 增编申请 - 详情
│   │       │   │   └── form.jsx  人事类 - 增编申请 - 创建/编辑
│   │       │   ├── employ
│   │       │   │   ├── detail.jsx  人事类 - 录用申请 - 详情
│   │       │   │   └── form.jsx  人事类 - 录用申请 - 创建/编辑
│   │       │   ├── induction
│   │       │   │   ├── detail.jsx  人事类 - 入职申请 - 详情
│   │       │   │   └── form.jsx  人事类 - 入职申请 - 创建&编辑
│   │       │   ├── jobHandover
│   │       │   │   ├── components
│   │       │   │   │   ├── employeesSelect.jsx  人员下拉
│   │       │   │   │   └── relatedJobHandoverOrder.jsx  关联审批单组件
│   │       │   │   ├── create.jsx  人事类 - 工作交接 - 创建
│   │       │   │   ├── detail.jsx  人事类 - 工作交接 - 详情
│   │       │   │   └── update.jsx  人事类 - 工作交接 - 编辑
│   │       │   ├── official
│   │       │   │   ├── detail.jsx  人事类 - 转正申请 - 详情
│   │       │   │   └── form.jsx  人事类 - 转正申请 - 创建/编辑
│   │       │   ├── positonTransfer
│   │       │   │   ├── create.jsx  人事类 - 人事调动 - 创建
│   │       │   │   ├── detail.jsx  人事类 - 人事调动 - 详情
│   │       │   │   └── update.jsx  人事类 - 人事调动 - 编辑
│   │       │   ├── recruitment
│   │       │   │   ├── detail.jsx  人事类 - 招聘申请 - 详情
│   │       │   │   └── form.jsx  人事类 - 招聘申请 - 创建/编辑
│   │       │   ├── renew
│   │       │   │   ├── create.jsx  人事类 - 合同续签 - 创建
│   │       │   │   ├── detail.jsx  人事类 - 合同续签 - 详情
│   │       │   │   └── update.jsx  人事类 - 合同续签 - 编辑
│   │       │   └── resign
│   │       │       ├── create.jsx  人事类 - 离职申请 - 创建
│   │       │       ├── detail.jsx  人事类 - 离职申请 - 详情
│   │       │       └── update.jsx  人事类 - 离职申请 - 编辑
│   │       ├── other
│   │       │   └── sign
│   │       │       ├── detail.jsx  其他 - 事务签呈 - 详情
│   │       │       └── form.jsx  其他 - 事务签呈 - 创建&编辑
│   │       └── �234�语表.md 该文件不存在，请及时更新目录模版文件
│   ├── formily
│   │   └── EMPTY 该文件为空，请及时查看
│   └── workflow
│       └── EMPTY 该文件为空，请及时查看
├── organization
│   ├── manage
│   │   ├── attributes
│   │   │   ├── component
│   │   │   │   ├── content.jsx  组织架构 - 部门管理 - 业务信息Tab - content组件
│   │   │   │   ├── customize.jsx  组织架构 - 部门管理 - 业务信息Tab - 自定义属性form组件
│   │   │   │   ├── customizeItem.jsx  组织架构 - 部门管理 - 业务信息Tab - 自定义属性Itme
│   │   │   │   └── update.jsx  组织架构 - 部门管理 - 业务信息Tab - update组件
│   │   │   ├── index.jsx  组织架构 - 部门管理 - 业务信息Tab
│   │   │   └── index.less 样式
│   │   ├── components
│   │   │   ├── checkResultModal.jsx  部门操作校验结果Modal
│   │   │   ├── city.jsx  组织架构 - 部门管理 - 数据权限范围Tab - 编辑业务信息 - 城市select
│   │   │   ├── departmentPost.jsx  部门下岗位Select
│   │   │   ├── flowPreview.jsx  组织架构 - 审批流节点预览
│   │   │   ├── index.less 样式
│   │   │   ├── platform.jsx  组织架构 - 部门管理 - 数据权限范围Tab - 编辑业务信息 - 平台select
│   │   │   ├── postNameSelect.jsx  获取岗位名称下拉
│   │   │   └── supplier.jsx  组织架构 - 部门管理 - 数据权限范围Tab - 编辑业务信息 - 供应商select
│   │   ├── content.jsx  组织架构 - 内容区
│   │   ├── dataPermission
│   │   │   ├── component
│   │   │   │   ├── content.jsx  组织架构 - 部门管理 - 数据权限范围Tab - content组件
│   │   │   │   └── update.jsx  组织架构 - 部门管理 - 数据权限范围Tab - update组件
│   │   │   ├── index.jsx  组织架构 - 部门管理 - 数据权限范围Tab
│   │   │   └── index.less 样式
│   │   ├── department
│   │   │   ├── component
│   │   │   │   ├── basicInfo.jsx  组织架构 - 部门管理 - 部门Tab - 基本信息组件
│   │   │   │   ├── drawer
│   │   │   │   │   ├── addSubDepartment.jsx  新增子部门Drawer
│   │   │   │   │   ├── components
│   │   │   │   │   │   ├── addPost.jsx  添加多个岗位信息组件
│   │   │   │   │   │   └── style.less 样式
│   │   │   │   │   ├── revokeDepartment.jsx  裁撤部门
│   │   │   │   │   └── upperDepartmentUpdate.jsx  调整上级部门
│   │   │   │   ├── index.less 样式
│   │   │   │   ├── member.jsx  组织架构 - 部门管理 - 部门Tab - 部门成员组件
│   │   │   │   ├── modal
│   │   │   │   │   ├── departmentUpdate.jsx  组织架构 - 部门管理 - 编辑部门弹窗
│   │   │   │   │   ├── principal.jsx  组织架构 - 部门管理 = 设置负责人弹窗
│   │   │   │   │   └── updateDepError.jsx  上级部门更改后错误提示弹窗
│   │   │   │   ├── pid.jsx  组织架构 - 部门管理 - 编辑/新建部门弹窗 - 上级部门select
│   │   │   │   └── subordinateDepart
│   │   │   │       ├── content.jsx 
│   │   │   │       ├── index.jsx  组织架构 - 部门管理 - 部门Tab - 下级部门组件
│   │   │   │       └── public.jsx  组织架构 - 部门管理 - 部门Tab - 下级部门组件 - 公共TabPane
│   │   │   └── index.jsx  组织架构 - 部门管理 = 部门管理(Tab)
│   │   ├── department.jsx  公用组件，部门树信息
│   │   ├── empty.jsx  组织架构 - 部门管理 = 初始化
│   │   ├── index.jsx  组织架构 - 部门管理
│   │   ├── silder.jsx  组织架构 - 导航
│   │   ├── staffs
│   │   │   ├── component
│   │   │   │   ├── basic.jsx  组织架构 - 部门管理 - 岗位编制详情 - 基本信息组件
│   │   │   │   ├── business.jsx  组织架构 - 部门管理 - 岗位编制详情 - 数据权限信息组件
│   │   │   │   ├── button
│   │   │   │   │   ├── createPostBtn.jsx  组织架构 - 部门管理 - 岗位编制 - 添加岗位（button）
│   │   │   │   │   ├── deleteBtn.jsx  组织架构 - 部门管理 - 岗位编制 - 删除岗位（button）
│   │   │   │   │   └── establishmentBtn.jsx  组织架构 - 部门管理 - 岗位编制 - 增编/减编（button）
│   │   │   │   ├── drawer
│   │   │   │   │   ├── createPost.jsx  组织架构 - 部门管理 - 岗位编制 - 添加岗位（drawer）
│   │   │   │   │   └── establishment.jsx  组织架构 - 部门管理 - 岗位编制 - 增编/减编（drawer）
│   │   │   │   ├── index.less 样式
│   │   │   │   ├── memberContent.jsx  组织架构 - 部门管理 - 岗位编制详情 - 成员组件
│   │   │   │   ├── modal
│   │   │   │   │   ├── create.jsx  组织架构 - 部门管理 - 新建/编辑岗位弹窗
│   │   │   │   │   └── setBusiness.jsx  组织架构 - 部门管理 - 岗位编制 - 设置岗位数据权限范围设置弹框
│   │   │   │   └── staffName.jsx  组织架构 - 岗位编制Tab - 添加/编辑岗位 - 岗位名称select
│   │   │   ├── content.jsx 
│   │   │   ├── detail.jsx  组织架构 - 部门管理 - 岗位编制Tab -  详情
│   │   │   ├── index.jsx  组织架构 - 部门管理 - 岗位编制Tab
│   │   │   ├── index.less 样式
│   │   │   ├── list.jsx  组织架构 - 部门管理 - 岗位编制Tab - 列表组件
│   │   │   ├── public.jsx  组织架构 - 部门管理 - 部门Tab - 下级部门组件 - 公共TabPane
│   │   │   └── search.jsx  组织架构 - 部门管理 = 岗位编制tab -  查询组件
│   │   └── styles.css 样式
│   ├── operationLog
│   │   ├── componentOperationObject.js  组织架构 - 操作日志 - 查询条件 - 操作对象 Organization/OperationLog
│   │   ├── index.js  组织架构 - 操作日志 Organization/OperationLog
│   │   └── search.js  组织架构 - 操作日志 - 查询条件 Organization/OperationLog
│   └── staffs
│       ├── component
│       │   ├── allPost.jsx  共享登记 - 公司列表组件
│       │   └── modal
│       │       └── create.jsx  组织架构 - 岗位管理 = 列表组件 - 创建岗位弹窗
│       ├── content.jsx  组织架构 - 岗位管理 = 列表组件
│       ├── index.jsx  组织架构 - 岗位管理
│       ├── index.less 样式
│       └── search.jsx  组织架构 - 岗位管理 = 查询组件
├── shared
│   ├── bankAccount
│   │   ├── content.jsx  共享登记 - 银行账户列表 - 表格组件 /Shared/BankAccount
│   │   ├── create.jsx  共享登记 - 银行账户创建
│   │   ├── detail.jsx  共享登记 - 银行详情
│   │   ├── form.jsx  共享登记 - 银行表单
│   │   ├── index.jsx  共享登记 - 银行账户列表 /Shared/BankAccount
│   │   ├── search.jsx  共享登记 - 银行账户列表 - 查询组件 /Shared/BankAccount
│   │   └── update.jsx  共享登记 - 银行账户编辑
│   ├── company
│   │   ├── content.jsx  共享登记 - 公司列表 - 表格组件 /Shared/Company
│   │   ├── create.jsx  共享登记 - 公司创建
│   │   ├── detail.jsx  共享登记 - 公司详情
│   │   ├── form.jsx  共享登记 - 公司表单
│   │   ├── index.jsx  共享登记 - 公司列表 /Shared/Company
│   │   ├── search.jsx  共享登记 - 公司列表 - 查询组件 /Shared/Company
│   │   └── update.jsx  共享登记 - 公司编辑
│   ├── component
│   │   ├── authorityComponent
│   │   │   ├── component
│   │   │   │   ├── accountModal.jsx  共享登记 - 权限 - 添加成员Modal
│   │   │   │   ├── departmentModal.jsx  共享登记 - 权限 - 添加部门Modal
│   │   │   │   ├── index.jsx  共享登记 - 权限 - 自定义表单
│   │   │   │   └── style.less 样式
│   │   │   └── index.jsx  共享登记 - 权限
│   │   ├── company.jsx  共享登记 - 公司列表组件
│   │   ├── companyList.jsx  共享登记 - 公司列表组件（包含注销的数据）
│   │   ├── companyPurview.jsx  共享登记 - 公司列表组件（带state）
│   │   ├── contractType.jsx  合同类型
│   │   ├── custodian.jsx  共享登记 - 合同保管人
│   │   ├── department.jsx  共享登记 - 部门
│   │   ├── employee.jsx  共享登记 - 员工档案列表
│   │   ├── filesPopupComponent.jsx 该文件没有头部注释或格式不对
│   │   ├── mailPopupComponent.jsx 该文件没有头部注释或格式不对
│   │   ├── principal.jsx  共享登记 - 证照负责人
│   │   ├── sealCustodian.jsx  共享登记 -  签订人组件
│   │   ├── signModal.jsx  合同盖章/批量盖章 Modal
│   │   ├── signUnit.jsx  共享登记 -  签订单位
│   │   ├── signatory.jsx  共享登记 -  签订人组件
│   │   ├── styles.less 样式
│   │   └── voidPopupComponent.jsx 该文件没有头部注释或格式不对
│   ├── contract
│   │   ├── content.jsx  共享登记 - 合同列表 - 表格组件 /Shared/Contract
│   │   ├── detail.jsx  共享登记 - 合同详情
│   │   ├── form.jsx  共享登记 - 合同表单
│   │   ├── index.jsx  共享登记 - 合同列表 /Shared/Contract
│   │   ├── public.jsx  共享登记 - 合同列表 - 公共TabPane
│   │   └── search.jsx  共享登记 - 合同列表 - 查询组件 /Shared/Contract
│   ├── license
│   │   ├── content.jsx  共享登记 - 证照列表 - 表格组件 /Shared/license
│   │   ├── create.jsx  共享登记 - 证照新建
│   │   ├── detail.jsx  共享登记 - 证照详情
│   │   ├── form.jsx  共享登记 - 证照表单
│   │   ├── index.jsx  共享登记 - 证照列表 /Shared/License
│   │   ├── search.jsx  共享登记 - 证照列表 - 查询组件 /Shared/License
│   │   └── update.jsx  共享登记 - 证照编辑
│   └── seal
│       ├── content.jsx  共享登记 - 印章列表 - 表格组件 /Shared/Seal
│       ├── create.jsx  共享登记 - 印章创建
│       ├── detail.jsx  共享登记 - 印章详情
│       ├── form.jsx  共享登记 - 印章表单
│       ├── index.jsx  共享登记 - 印章列表 /Shared/Seal
│       ├── search.jsx  共享登记 - 印章列表 - 查询组件 /Shared/Seal
│       └── update.jsx  共享登记 - 印章编辑
├── supply
│   ├── deductSummarize
│   │   ├── details
│   │   │   ├── basicInfo.jsx  物资管理 - 扣款汇总 - 扣款汇总详情 - 基本信息组件
│   │   │   └── index.jsx  物资管理 - 扣款汇总 - 扣款汇总详情页 Supply/DeductSummarize/Details
│   │   ├── index.jsx  物资管理 - 扣款汇总页面 Supply/DeductSummarize
│   │   └── search.jsx  物资管理 - 扣款汇总页面 - 搜索组件    Supply/DeductSummarize
│   ├── deductions
│   │   ├── index.css 样式
│   │   ├── index.jsx  物资管理 - 扣款明细页面   Supply/Deductions
│   │   └── search.jsx  物资管理 - 物资扣款明细页面 - 搜索组件   Supply/Deductions
│   ├── distribution
│   │   ├── index.css 样式
│   │   ├── index.jsx  物资管理 - 分发明细页面  Supply/Distribution
│   │   └── search.jsx  物资管理 - 物资分发明细 - 搜索组件   Supply/Distribution
│   ├── parameter
│   │   ├── index.jsx  物资管理 - 物资台账页面  Supply/Parameter
│   │   ├── search.jsx  物资管理 - 物资台账页面 - 搜索组件  Supply/Parameter
│   │   └── style.css 样式
│   ├── procurement
│   │   ├── index.jsx  物资管理 - 采购入库明细
│   │   ├── search.jsx  物资管理 - 采购入库明细 - 搜索组件
│   │   └── style.css 样式
│   └── setting
│       ├── index.jsx  物资管理 - 物资设置页面 Supply/Setting
│       ├── search.jsx  物资管理 - 物资设置 - 搜索组件  Supply/Setting
│       └── style.css 样式
├── system
│   ├── README.md
│   ├── account
│   │   ├── manage
│   │   │   ├── allPositions.js  角色组件
│   │   │   ├── create.jsx  系统管理 - 账号管理 - 创建用户
│   │   │   ├── details.jsx  系统管理 - 账号管理 - 用户详情
│   │   │   ├── index.jsx  账号管理
│   │   │   ├── search.jsx  账号管理列表，搜索功能
│   │   │   ├── style
│   │   │   │   └── index.less 样式
│   │   │   └── update.jsx  系统管理 - 账号管理 - 编辑用户
│   │   └── related
│   │       ├── create.jsx  关联账号，新建弹窗
│   │       ├── edit.jsx  关联账号，编辑弹窗
│   │       ├── index.jsx  关联账号，列表页
│   │       ├── search.jsx  关联账号，搜索功能
│   │       └── style
│   │           └── index.less 样式
│   ├── approal
│   │   └── index.jsx  审批配置页面
│   ├── city
│   │   ├── components
│   │   │   ├── cities.js  城市管理 - 行政区城市组件
│   │   │   ├── citysItems.js  城市管理 - 阶梯组件
│   │   │   ├── modal
│   │   │   │   ├── createModal.js   编辑城市 - 提交弹框
│   │   │   │   └── resetModal.js   编辑城市 - 重置弹框
│   │   │   ├── platforms.js  城市管理 - 平台
│   │   │   └── style
│   │   │       └── index.less 样式
│   │   ├── detail.js   城市详情
│   │   ├── index.js   城市管理
│   │   ├── search.js   城市管理-搜索组件
│   │   ├── style
│   │   │   └── index.less 样式
│   │   └── update.js   编辑城市
│   ├── contractTemplate
│   │   ├── componentDetail.js  组件详情
│   │   ├── createModal.js   合同模版管理 - 创建弹框
│   │   ├── index.js  合同模版管理
│   │   ├── previewTemplate.js   合同模版管理 - 预览合同模版
│   │   └── search.js   合同模版管理 - 查询
│   ├── feedBack
│   │   ├── deal.jsx  系统管理 - 意见反馈 - 处理弹窗
│   │   └── index.jsx  系统管理 - 意见反馈
│   ├── manage
│   │   ├── company
│   │   │   ├── components
│   │   │   │   ├── createModal.jsx  合同归属设置列表 - 合同归属编辑 - 新增弹窗
│   │   │   │   ├── previewContract.js   预览合同
│   │   │   │   ├── templateSelect.js  合同模版下拉框
│   │   │   │   └── updateModal.jsx  合同归属设置列表 - 合同归属编辑 - 编辑弹窗
│   │   │   ├── create.jsx  合同归属设置列表, 创建弹窗
│   │   │   ├── detail.jsx  合同归属 - 详情
│   │   │   ├── index.jsx  合同归属设置列表
│   │   │   ├── search.jsx  合同归属管理, 搜索选项
│   │   │   ├── style
│   │   │   │   └── index.less 样式
│   │   │   └── update.jsx  合同归属 - 合同归属编辑
│   │   ├── employee
│   │   │   ├── content.jsx  人员管理 - 合同归属管理 - 员工合同甲方 - content
│   │   │   ├── createModal.jsx  人员管理 - 合同归属管理 - 员工合同甲方 - 新建弹窗
│   │   │   ├── detailModal.jsx  人员管理 - 员工合同甲方 - 详情弹窗
│   │   │   ├── index.jsx  人员管理 - 合同归属管理 - 员工合同甲方
│   │   │   └── search.jsx  人员管理 - 合同归属管理 - 员工合同甲方 - seatch
│   │   └── index.jsx  合同归属管理
│   ├── merchants
│   │   ├── components
│   │   │   ├── create
│   │   │   │   ├── merchants.jsx  系统管理 - 服务商配置 - 创建 - 个体工商户注册
│   │   │   │   ├── scope.jsx  新增页应用范围组件 WhiteList/Components/Range
│   │   │   │   └── selector.jsx  新增页应用范围组件-core  WhiteList/Components/Selector
│   │   │   └── style
│   │   │       └── index.less 样式
│   │   ├── create.jsx  系统管理 - 服务商配置 - 创建
│   │   ├── detail.jsx  系统管理 - 服务上配置 - 详情页
│   │   ├── index.jsx  系统管理 - 服务商配置列表
│   │   ├── search.jsx  服务商配置 - 搜索组件
│   │   ├── style
│   │   │   └── index.less 样式
│   │   └── update.jsx  白名单编辑页
│   ├── recommendedcompany
│   │   ├── components
│   │   │   └── servicerange
│   │   │       ├── create.jsx  推荐公司管理 - 新增推荐公司服务范围弹窗 system/recommendedcompany/components/servicerange/create
│   │   │       ├── style
│   │   │       │   └── index.less 样式
│   │   │       └── supplierselect.jsx  推荐公司管理 - 新增推荐公司服务范围供应商下拉选择 system/recomendedcompany/components/servicerange/supplierselect
│   │   ├── create.jsx  推荐公司管理 - 新增推荐公司弹窗 system/recommendedcompany/create
│   │   ├── detail.jsx  推荐公司管理 - 详情页 system/recommendedcompany/detail
│   │   ├── index.jsx  推荐公司管理 - 列表页 system/recommendedcompany/index
│   │   ├── search.jsx  推荐公司管理 - 搜索组件 system/recommendedcompany/search
│   │   ├── style
│   │   │   └── index.less 样式
│   │   └── update.jsx  推荐公司管理 - 编辑推荐公司基本信息弹窗 system/recommendedcompany/update
│   └── supplier
│       ├── manage
│       │   ├── detail.jsx  供应商管理-详情页
│       │   ├── form.jsx  添加供应商
│       │   ├── index.js  供应商管理
│       │   ├── search.jsx  供应商管理, 搜索选项
│       │   └── style
│       │       └── index.less 样式
│       └── scope
│           └── city
│               ├── index.jsx  系统管理 -- 供应商管理 -- 业务分布情况(城市)
│               ├── search.jsx  供应商列表
│               └── style
│                   └── index.less 样式
├── team
│   ├── components
│   │   ├── containerTop.jsx  列表头部功能按钮  --团队公共组件
│   │   ├── districtModal.jsx  公共组件 - 商圈弹窗
│   │   ├── search.jsx  业务承揽 - 业务承揽记录 - 搜索组件
│   │   └── style
│   │       └── index.less 样式
│   ├── manager
│   │   ├── components
│   │   │   ├── changeList.jsx  业主管理 - 编辑页 - 变更记录 组件
│   │   │   ├── employee.jsx  公用组件，成员列表信息
│   │   │   ├── employeeOld.jsx  公用组件，成员列表信息
│   │   │   ├── ownerModal.jsx  业主管理 - 弹窗 - 选择业主
│   │   │   ├── scopeCard.jsx  业主管理 - 编辑页 - 承揽范围 组件
│   │   │   ├── updateOwnerList.jsx  业主管理 - 编辑页 - 业主团队变更记录列表
│   │   │   └── updateOwnerModal.jsx  公用组件，成员列表信息
│   │   ├── detail.jsx  业主管理 - 业主详情
│   │   ├── index.jsx  业主管理
│   │   ├── managerLog.jsx  业务承揽 - 业务承揽记录
│   │   ├── nothingOwner
│   │   │   ├── components
│   │   │   │   └── employee.jsx  公用组件，成员列表信息
│   │   │   ├── index.js  无业主商圈监控
│   │   │   ├── model.js  无业主商圈监控
│   │   │   └── search.js  私教管理 - 私教指导, 搜索选项
│   │   ├── search.jsx  业主管理, 搜索选项
│   │   ├── style
│   │   │   └── index.less 样式
│   │   └── update.jsx  业主管理 - 业主编辑
│   └── teacher
│       ├── account
│       │   ├── components
│       │   │   ├── changeList.jsx  私教账户 - 编辑页 - 变更记录 组件
│       │   │   ├── scopeCard.jsx  私教账户 - 编辑页 - 业务范围 组件
│       │   │   └── selectTeachTeam.jsx  下拉选择私教团队
│       │   ├── detail.jsx  私教管理 - 私教账户 - 私教团队详情
│       │   ├── index.jsx  私教管理 - 私教账户
│       │   ├── search.jsx  私教管理 - 私教账户, 搜索选项
│       │   ├── style
│       │   │   └── index.less 样式
│       │   └── update.jsx  私教管理 - 私教账户 - 编辑私教账户
│       ├── business
│       │   └── index.jsx  私教管理 - 私教业务记录
│       ├── manage
│       │   ├── assets.jsx  私教资产隶属管理 - 私教团队管理 - 业主团队管理
│       │   ├── components
│       │   │   ├── changeCoachModal.jsx  私教团队管理 - 编辑页 - 变更私教 组件
│       │   │   ├── changeList.jsx  私教团队管理 - 编辑页 - 变更记录 组件
│       │   │   ├── relationship.jsx  私教团队管理 - 业主团队管理 - 资产关系 组件
│       │   │   └── style.less 样式
│       │   ├── index.jsx  私教资产隶属管理 - 私教团队管理
│       │   └── search.jsx  私教管理 - 私教部门, 搜索选项
│       ├── manageLog
│       │   ├── index.jsx  私教管理记录
│       │   └── search.jsx  私教管理记录 - 搜索组件
│       ├── message
│       │   ├── components
│       │   │   ├── createMessageModal.jsx  私教管理 - 私教指导 - 新增私教指导Modal
│       │   │   └── selectDistricts.jsx  私教指导 - 新增指导意见 — 商圈选择
│       │   ├── index.jsx  私教管理 - 私教指导
│       │   ├── search.jsx  私教管理 - 私教指导, 搜索选项
│       │   └── style
│       │       └── index.less 样式
│       ├── monitoring
│       │   ├── create
│       │   │   └── modal.jsx  无私教业主团队监控 - 创建
│       │   ├── index.jsx  无私教业主团队监控
│       │   └── search.jsx  无私教业主团队监控 - 搜索
│       └── operations
│           ├── index.jsx  私教资产隶属管理 - 私教运营管理页面
│           ├── style.less 样式
│           └── update.jsx  私教运营管理 - 编辑页
├── wallet
│   ├── bills
│   │   ├── component
│   │   │   ├── approval.jsx  趣活钱包 - 支付账单 - 账单详情 - 审批单信息
│   │   │   ├── basic.jsx  趣活钱包 - 支付账单 - 账单详情 - 基本信息
│   │   │   ├── modal
│   │   │   │   ├── batchPay.jsx  趣活钱包 - 支付账单 - 付款弹窗（批量付款）
│   │   │   │   ├── detailPay.jsx  趣活钱包 - 支付账单 - 账单详情 - 付款弹窗
│   │   │   │   ├── paymentState.jsx  趣活钱包 - 支付账单 - 付款成功弹窗
│   │   │   │   └── singlePay.jsx  趣活钱包 - 支付账单 - 付款弹窗（单账单）
│   │   │   └── payee.jsx  趣活钱包 - 支付账单 - 账单详情 - 收款人信息
│   │   ├── content.jsx  趣活钱包 - 支付账单 - 表格组件
│   │   ├── detail.jsx  趣活钱包 - 支付账单 - 账单详情
│   │   ├── index.jsx  趣活钱包 - 支付账单
│   │   ├── search.jsx  趣活钱包 - 支付账单 - 查询组件
│   │   └── style.less 样式
│   ├── detail
│   │   ├── content.jsx  趣活钱包 - 钱包明细 - 表格组件
│   │   ├── index.jsx  趣活钱包 - 钱包明细
│   │   └── search.jsx  趣活钱包 - 钱包明细 - 查询组件
│   └── summary
│       ├── index.jsx  趣活钱包 - 钱包汇总
│       └── style.less 样式
└── whiteList
├── components
│   ├── bossCreate.jsx  白名单 - 老板创建
│   ├── bossUpdate.jsx  白名单 - 老板编辑
│   ├── chooseApp.jsx   选择应用终端
│   ├── knightCreate.jsx  白名单 - 骑士创建   WhiteList/Components/KnightCreate
│   ├── knightUpdate.jsx  白名单 - 骑士编辑   WhiteList/Components/KnightUpdate
│   ├── range.jsx  新增页应用范围组件 WhiteList/Components/Range
│   ├── selector.jsx  新增页应用范围组件-core  WhiteList/Components/Selector
│   └── style
│       └── index.less 样式
├── create.jsx  新增页应用范围组件 WhiteList/Create
├── detail.js  白名单 - 详情页
├── index.jsx  白名单列表页/whiteList
├── search.jsx  服务费预支设置权限 - 搜索组件
├── style
│   └── index.less 样式
└── update.jsx  白名单编辑页

444 directories, 1523 files
