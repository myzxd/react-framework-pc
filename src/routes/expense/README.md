OA模块目录组织
OA模块目录组织
├── README.md
├── README.old.md
├── components
│   ├── mySearch.js                     搜索框组件
│   ├── style.less                      搜索框组件样式
│   ├── upload.js                       上传文件组件
│   └── upload.less                     上传文件组件样式
├── examineFlow
│   ├── config
│   │   ├── component
│   │   │   ├── examleFlow.js           审批流设置-房屋审批流配置页面-新租续租设置组件
│   │   │   └── subjects.js             审批流设置-房屋审批流配置页面-科目设置组件
│   │   ├── index.js                    审批流设置-编辑审批流页面
│   │   └── object.js                   审批流设置-配置文件
│   ├── detail.jsx                      审批流设置-审批流详情页面
│   ├── form.jsx                        审批流设置-审批流编辑-创建页面
│   ├── index.jsx                       审批流设置页面
│   ├── modal
│   │   └── create.jsx                  费用审批流-创建弹窗&设置按钮
│   ├── search.jsx                      审批流设置-查询组件
│   └── style.less                      审批流设置-样式
├── manage
│   ├── examineOrder
│   │   ├── common
│   │   │   ├── createCostOrder.jsx     审核记录创建模块
│   │   │   ├── expenseType.jsx         费用审批单创建-费用分组选择组件
│   │   │   ├── process.jsx             费用审批单-审核记录列表
│   │   │   └── style.less              费用审批单-样式
│   │   ├── detail
│   │   │   ├── approve.jsx             费用审批单-同意操作
│   │   │   ├── index.jsx               费用审批单-详情页面
│   │   │   ├── paymentException.jsx    费用审批单-标记异常操作
│   │   │   └── reject.jsx              费用审批单-驳回操作
│   │   ├── form.jsx                    费用审批单-编辑页面
│   │   ├── index.jsx                   费用审批单页面
│   │   ├── modal
│   │   │   └── create.jsx              费用审批单-创建弹窗
│   │   └── search.jsx                  费用审批单-搜索组件
│   ├── houseContract
│   │   ├── components
│   │   │   ├── common
│   │   │   │   ├── baseInfo.jsx                房屋管理-新建(编辑)-基础信息
│   │   │   │   ├── expense.jsx                 房屋管理-费用信息模块模版
│   │   │   │   ├── expenseApplyRecords.jsx     房屋管理-费用申请记录
│   │   │   │   └── showSubject.jsx             房屋管理-根据科目id展示科目名称模块
│   │   │   ├── detail
│   │   │   │   ├── agencyFees.jsx              房屋管理-房屋详情-中介费信息
│   │   │   │   ├── ascription.jsx              房屋管理-房屋详情-归属组件
│   │   │   │   ├── deposit.jsx                 房屋管理-房屋详情-押金信息
│   │   │   │   ├── houseInfo.jsx               房屋管理-房屋详情-房屋信息
│   │   │   │   └── rent.jsx                    房屋管理-房屋详情-租金信息
│   │   │   ├── form
│   │   │   │   ├── agencyFees.jsx              房屋管理-新建(编辑)-中介费信息
│   │   │   │   ├── ascription.jsx              房屋管理-新建(编辑)-归属组件
│   │   │   │   ├── ascriptionNew.jsx           房屋管理-新建(编辑)-成本归属-分摊
│   │   │   │   ├── deposit.jsx                 房屋管理-新建(编辑)-押金信息
│   │   │   │   ├── houseInfo.jsx               房屋管理-新建(编辑)-房屋信息
│   │   │   │   ├── rent.jsx                    房屋管理-新建(编辑)-租金信息
│   │   │   │   └── share.jsx                   房屋管理-新建(编辑)-分摊信息
│   │   │   └── modal
│   │   │       ├── breakModal.jsx              房屋管理-断组弹窗
│   │   │       ├── closeModal.jsx              房屋管理-退租弹窗
│   │   │       └── continueModal.jsx           房屋管理-续租弹窗
│   │   ├── create.jsx                          房屋管理-新建房屋信息
│   │   ├── detail.jsx                          房屋管理-房屋信息查看
│   │   ├── index.jsx                           房屋管理-列表
│   │   ├── search.jsx                          房屋管理-列表-搜索组件
│   │   └── update.jsx                          房屋管理-编辑房屋信息
│   ├── records
│   │   ├── detail.jsx                          续租, 续签, 断租, 退租 详情页面入口
│   │   ├── form
│   │   │   └── index.jsx                       续租, 续签, 断租, 退租 创建表单的入口
│   │   ├── index.jsx                           费用记录明细列表页面
│   │   ├── search.jsx                          费用记录明细搜索页面
│   │   └── summary
│   │       └── create.jsx                      记录明细-操作页
│   └── template
│       ├── common
│       │   ├── expense.jsx                     费用信息模块模版
│       │   ├── houseInfo.jsx                   房屋信息
│       │   ├── items.jsx                       平台，供应商，城市，商圈，分摊金额
│       │   ├── subject.jsx                     科目三级联动选择 & 成本中心数据显示
│       │   └── upload.jsx
│       ├── create
│       │   ├── index.jsx                       创建模版的入口判断页面
│       │   ├── refund.jsx                      报销表单的模版
│       │   └── rent.jsx                        租金表单的模版
│       ├── detail
│       │   ├── index.jsx                       详情模版的入口判断页面
│       │   ├── refund.jsx                      报销的详情模版
│       │   └── rent.jsx                        租金详情模版
│       ├── records
│       │   ├── detail
│       │   │   ├── break.jsx                   断租表单详情模块
│       │   │   ├── cancel.jsx                  退租表单详情模块
│       │   │   ├── continue.jsx                续租表单详情模块
│       │   │   └── sign.jsx                    续签表单详情模块
│       │   └── form    
│       │       ├── break.jsx                   断租表单模块
│       │       ├── cancel.jsx                  退租表单模块
│       │       ├── continue.jsx                续租表单模块
│       │       └── sign.jsx                    续签表单模块
│       └── update
│           ├── agency.jsx                      中介费表单的模版
│           ├── break.jsx                       押金损失信息表单的模版
│           ├── deposit.jsx                     押金表单的模版
│           ├── depositRefund.jsx               退回押金信息表单的模版
│           ├── index.jsx                       编辑模版的入口判断页面
│           ├── quit.jsx                        退租信息表单的模版
│           ├── refund.jsx                      报销表单的模版
│           └── rent.jsx                        租金表单的模版
├── subject
│   ├── index.jsx           费用管理 - 科目设置
│   └── search.jsx          费用管理 - 科目设置 - 搜索模块
└── type
    ├── create.js           创建新模版类型
    ├── detail.js           费用分组详情页
    ├── index.jsx           模版类型列表页
    ├── search.jsx          列表页搜索组件
    └── update.js           费用分组编辑页

29 directories, 92 files
