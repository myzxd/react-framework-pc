

## 数据模型(Model)

### 基础模型



#### OA费用分组(原费用类型） OaCostGroup 

| 参数名称           | 类型         | 是否必须  | 描述                                 |
| :------------- | :--------- | :---- | ---------------------------------- |
| _id            | ObjectId   | True  | _id                                |
| name           | string     | True  | 名称                                 |
| supplier_ids   | [ObjectId] | False | 供应商ID                              |
| accounting_ids | [ObjectId] | False | 费用科目ID                             |
| creator_id     | ObjectId   | False | 创建人ID                              |
| state          | int        | False | 状态 -101(删除) -100(停用) 100(正常) 1(编辑) |
| note           | string     | N     | 备注                                 |
| updated_at     | datetime   | False | 更新时间                               |
| created_at     | datetime   | N     | 创建时间                               |

#### OA成本费用会计科目表 OaCostAccounting 

| 参数名称             | 类型       | 是否必须  | 描述                                      |
| :--------------- | :------- | :---- | --------------------------------------- |
| _id              | ObjectId | True  | _id                                     |
| code             | string   | False | 快捷别名                                    |
| accounting_code  | string   | True  | 会计科目编码                                  |
| name             | string   | True  | 名称                                      |
| level            | int      | True  | 级别 1、2、3                                |
| cost_center_type | int      | True  | 成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目 |
| parent_id        | ObjectId | False | 上级科目ID                                  |
| creator_id       | ObjectId | False | 创建人账户ID                                 |
| description      | string   | False | 描述                                      |
| state            | int      | True  | 状态 -101 删除 -100 停用 100 正常 1 编辑          |
| updated_at       | datetime | False | 更新时间                                    |
| created_at       | datetime | False | 创建时间                                    |

#### OA成本费用记录分摊明细表(分摊记录) OaCostAllocation 

| 参数名称             | 类型       | 是否必须  | 描述                                       |
| :--------------- | :------- | :---- | ---------------------------------------- |
| _id              | ObjectId | True  | 流水号                                      |
| cost_order_id    | ObjectId | True  | 所属成本记录                                   |
| city_code        | string   | False | 城市                                       |
| platform_code    | string   | False | 平台（项目）                                   |
| supplier_id      | ObjectId | False | 供应商（主体总部）                                |
| biz_district_id  | ObjectId | False | 商圈                                       |
| cost_center_type | int      | False | 成本中心归属类型 1 项目(平台） 2 项目主体总部（供应商） 3 城市 4 商圈 |
| money            | int      | True  | 分摊金额(分)                                  |
| book_state       | int      | False | 状态(1 init 10 待记账 90 记账中 100 记账完成）        |
| state            | int      | False | 单据状态 -100 删除 50 进行中 100 审批完成  1 待提交      |
| created_at       | datetime | True  | 创建时间                                     |

#### OA成本费用记账明细 OaCostBookLog 

| 参数名称                  | 类型       | 是否必须  | 描述                   |
| :-------------------- | :------- | :---- | -------------------- |
| _id                   | ObjectId | True  | 流水号                  |
| accounting_id         | ObjectId | True  | 科目ID                 |
| cost_order_id         | ObjectId | True  | 所属成本记录               |
| oa_cost_allocation_id | ObjectId | True  | 成本分配记录               |
| cost_target_id        | None     | False | 归属对象(供应商/城市/商圈/平台）ID |
| money                 | int      | True  | 金额(分)                |
| book_at               | datetime | False | 记账时间                 |
| book_year             | int      | False | 记账年（2018）            |
| book_month            | int      | False | 记账月份（201808）         |
| book_day              | int      | False | 记账日期（20180801）       |

#### OA成本费用月度汇总表 OaCostBookMonth 

| 参数名称           | 类型       | 是否必须  | 描述                   |
| :------------- | :------- | :---- | -------------------- |
| _id            | ObjectId | True  | 流水号                  |
| cost_target_id | None     | False | 归属对象(供应商/城市/商圈/平台）ID |
| book_month     | int      | False | 记账月份（201808）         |
| money          | int      | False | 汇总金额                 |
| update_at      | datetime | True  | 更新时间                 |

#### 收款人信息名录 OaPayeeBook 

| 参数名称             | 类型           | 是否必须  | 描述       |
| :--------------- | :----------- | :---- | -------- |
| _id              | ObjectId     | True  | _ID      |
| code             | string       | False | 快捷代码     |
| card_name        | string       | False | 收款人姓名    |
| card_num         | ObjectId     | True  | 收款人姓名    |
| bank_details     | string       | False | 开户行等详细信息 |
| platform_codes   | [basestring] | False | 平台       |
| supplier_ids     | [ObjectId]   | False | 供应商      |
| biz_district_ids | [ObjectId]   | False | 开户行等详细信息 |
| city_codes       | [basestring] | False | 城市       |

#### 收款人信息 PayeeInfo 

| 参数名称         | 类型       | 是否必须  | 描述       |
| :----------- | :------- | :---- | -------- |
| _id          | ObjectId | False | _ID      |
| code         | string   | False | 快捷代码     |
| card_name    | string   | False | 收款人姓名    |
| card_num     | string   | False | 收款人账号    |
| bank_details | string   | False | 开户行等详细信息 |

#### 成本费用记录 OaCostOrder 

| 参数名称                        | 类型           | 是否必须  | 描述                                       |
| :-------------------------- | :----------- | :---- | ---------------------------------------- |
| _id                         | ObjectId     | True  | 流水号                                      |
| supplier_ids                | [basestring] | False | 供应商ID                                    |
| platform_codes              | [basestring] | False | 平台CODE                                   |
| city_codes                  | [basestring] | False | 城市全拼列表                                   |
| biz_district_ids            | [ObjectId]   | False | 商圈列表                                     |
| state                       | int          | False | 单据状态 -101 删除 10 进行中 100 完成 1 待提交 -100 关闭 |
| paid_state                  | int          | N     | 打款状态 100:已打款  -1:异常  1:未处理               |
| paid_note                   | string       | False | 打款备注                                     |
| apply_account_id            | ObjectId     | True  | 提报人ID                                    |
| application_order_id        | ObjectId     | False | 归属审批单ID                                  |
| invoice_flag                | bool         | False | 发票标记(true 有 false 无)                     |
| note                        | string       | False | 备注                                       |
| attachments                 | [basestring] | False | 附件地址列表                                   |
| usage                       | string       | False | 用途                                       |
| payee_info                  | dict         | False | 收款人信息                                    |
| total_money                 | int          | False | 总金额（支付报销金额)                              |
| cost_group_id               | ObjectId     | False | 费用分组ID                                   |
| cost_accounting_id          | ObjectId     | False | 费用科目ID                                   |
| cost_accounting_code        | string       | False | 费用科目编码                                   |
| cost_center_type            | int          | False | 成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目  |
| allocation_mode             | int          | False | 成本归属分摊模式（ 6 平均分摊 8 自定义分摊）                |
| cost_allocation_ids         | [ObjectId]   | False | 成本归属分摊明细                                 |
| biz_extra_house_contract_id | object_id    | False | 业务附加信息: 房屋租赁合同ID                         |
| biz_extra_data              | dict         | False | 未归类的业务附加信息                               |
| updated_at                  | datetime     | False | 更新时间                                     |
| created_at                  | datetime     | True  | 创建时间                                     |
| paid_at                     | datetime     | False | 付款完成时间                                   |
| done_at                     | datetime     | False | 完成时间                                     |
| closed_at                   | datetime     | False | 关闭时间                                     |


#### OA审批流节点 OaApplicationFlowNode 

| 参数名称                   | 类型         | 是否必须 | 描述                                |
| :--------------------- | ---------- | :--- | --------------------------------- |
| _id                    | ObjectId   | True | _id                               |
| name                   | string     | True | 节点名称                              |
| parent_template_id     | ObjectId   | True | 所属审批流ID                           |
| account_ids            | [ObjectId] | True | 节点审批人                             |
| approve_mode           | int        | True | 节点审批模式： 10 所有审批人全部审批  20 任意审批人审批  |
| is_payment_node        | bool       | N    | 特殊节点标记: 是否为支付节点. 支付节点可以变更费用的付款状态。 |
| can_update_cost_record | bool       | N    | 是否可修改提报的费用记录                      |
| cost_update_rule       | int        | True | 费用记录修改规则: 无限制: 0,  向下:-1,  向上:1   |
| index_num              | int        | N    | 流程节点索引序号， 0 开始                    |

#### OA审批流模板 OaApplicationFlowTemplate 

| 参数名称                       | 类型           | 是否必须  | 描述                                       |
| :------------------------- | :----------- | :---- | ---------------------------------------- |
| _id                        | ObjectId     | True  | _id                                      |
| name                       | string       | True  | 名称                                       |
| creator_id                 | ObjectId     | True  | 创建人ID                                    |
| biz_type                   | int          | N     | 工作流业务分类  1 成本审批流  90 非成本审批流              |
| flow_nodes                 | [ObjectId]   | N     | 审批流程，节点列表                                |
| note                       | string       | N     | 模版说明                                     |
| state                      | int          | True  | 状态 -100 删除 -1 停用 100 正常 1 草稿             |
| cost_catalog_scope         | [ObjectId]   | False | 限定仅用于本审批流的费用分组类型ID                       |
| exclude_cost_catalog_scope | [ObjectId]   | False | 限定不可用于本审批流的费用分组类型ID                      |
| city_codes                 | [basestring] | False | 城市                                       |
| platform_codes             | [basestring] | False | 平台（项目）                                   |
| supplier_ids               | [ObjectId]   | False | 供应商（主体总部）                                |
| biz_district_ids           | [ObjectId]   | False | 商圈                                       |
| extra_ui_options           | dict         | False | 前端UI表单选项: {form_template: "form_template_id", cost_forms: {cost_group_id: "form_template_id"} } |
| updated_at                 | datetime     | False | 更新时间                                     |
| created_at                 | datetime     | False | 创建时间                                     |

#### OA申请审批单 OaApplicationOrder 

| 参数名称                        | 类型           | 是否必须  | 描述                                       |
| :-------------------------- | :----------- | :---- | ---------------------------------------- |
| _id                         | ObjectId     | True  | 流水号                                      |
| city_codes                  | [basestring] | False | 城市                                       |
| platform_codes              | [basestring] | False | 平台（项目）                                   |
| supplier_ids                | [ObjectId]   | False | 供应商（主体总部）                                |
| biz_district_ids            | [ObjectId]   | False | 商圈                                       |
| apply_account_id            | ObjectId     | True  | 申请人ID                                    |
| flow_id                     | object_id    | True  | 审批流程ID                                   |
| operate_accounts            | [ObjectId]   | False | 本审批流可审核操作（通过/驳回）的全部人员列表                  |
| current_operate_accounts    | [ObjectId]   | False | 可前节点可审核操作（通过/驳回）的人员列表                    |
| cc_accounts                 | [ObjectId]   | False | 审批抄送过的人员列表                               |
| current_pending_accounts    | [ObjectId]   | False | 当前等待处理的人员账号列表                            |
| flow_accounts               | [ObjectId]   | False | 当前审批流已经手操作的人员账号列表（包括审批和补充）               |
| current_record_ids          | [ObjectId]   | False | 当前进行的审批记录ID列表(可能有多个）                     |
| current_flow_node           | object_id    | False | 当前审批节点ID, None 代表是提报节点                   |
| state                       | int          | False | 流程状态: 1 => 待提交 10 => 审批流进行中 100 => 流程完成 -100=> 流程关闭 -101 删除 |
| biz_state                   | int          | False | 当前节点最近一次业务审批状态: 1 => 待处理（首次未提交） 10 => 待补充 50 => 异常 100 => 通过 -100 => 驳回 |
| urge_state                  | bool         | False | 当前节点的催办状态: true 已催办 false 未催办            |
| cost_order_ids              | [ObjectId]   | False | 本次审批的费用单ID                               |
| total_money                 | int          | N     | 本次申请的总金额                                 |
| paid_state                  | int          | N     | 打款状态 100:已打款  -1:异常  1:未处理               |
| paid_note                   | string       | False | 打款备注                                     |
| attachments                 | [basestring] | False | 附件地址                                     |
| biz_extra_house_contract_id | object_id    | False | 业务附加信息: 房屋租赁合同ID                         |
| biz_extra_data              | dict         | False | 未归类的业务附加信息                               |
| created_at                  | datetime     | False | 创建时间                                     |
| updated_at                  | datetime     | False | 更新时间                                     |
| submit_at                   | datetime     | False | 提交时间(成本归属时间）                             |
| done_at                     | datetime     | False | 完成时间                                     |
| closed_at                   | datetime     | False | 关闭时间                                     |

#### OA审批单流转明细记录 OaApplicationOrderFlowRecord 

| 参数名称                    | 类型         | 是否必须  | 描述                                    |
| :---------------------- | :--------- | :---- | ------------------------------------- |
| _id                     | ObjectId   | True  | ID                                    |
| order_id                | ObjectId   | True  | OA申请审批单ID                             |
| flow_id                 | ObjectId   | True  | 审批流程ID                                |
| index_num               | int        | True  | 归属流程节点序号, 0 代表是首个提报记录                 |
| reject_source_record_id | ObjectId   | False | 被驳回记录: 用于驳回，记录驳回的源审批记录ID              |
| reject_source_node_id   | ObjectId   | False | 被驳回节点: 用于驳回，记录驳回的源审批记录节点ID            |
| reject_to_record_id     | [ObjectId] | False | 驳回至新记录: 用于驳回，记录驳回后的返回的目标审批记录ID, 一条或多条 |
| reject_to_node_id       | ObjectId   | False | 驳回至节点: 用于驳回，记录驳回后的返回的目标节点ID           |
| state                   | int        | False | 审批状态： 1 待处理 100 通过 -100 驳回 -101 关闭    |
| urge_state              | bool       | False | 当前节点的催办状态: true 已催办 false 未催办         |
| urge_record_id          | ObjectId   | False | 催办记录ID                                |
| note                    | string     | False | 操作说明                                  |
| node_id                 | ObjectId   | False | 审批流程节点ID: 提报记录节点为 None                |
| operate_accounts        | [ObjectId] | True  | 当前记录可审批人员ID列表                         |
| cc_accounts             | [ObjectId] | False | 当前记录抄送参与人员                            |
| account_id              | ObjectId   | False | 实际审批操作人员ID                            |
| operated_at             | datetime   | False | 实际审批操作时间                              |
| created_at              | datetime   | False | 创建时间                                  |

#### OA审批单流转补充说明 OaApplicationOrderFlowExtra 

| 参数名称        | 类型           | 是否必须  | 描述              |
| :---------- | :----------- | :---- | --------------- |
| _id         | ObjectId     | True  | _ID             |
| record_id   | ObjectId     | True  | 所属OA审批单流转明细记录ID |
| attachemnts | [basestring] | False | 附件              |
| content     | string       | False | 说明              |
| creator_id  | ObjectId     | False | 创建人             |
| created_at  | datetime     | False | 创建时间            |

#### 催办记录 OaApplicationUrgeRecord 

| 参数名称           | 类型         | 是否必须  | 描述                    |
| :------------- | :--------- | :---- | --------------------- |
| _id            | ObjectId   | True  | _id                   |
| order_id       | ObjectId   | True  | OA申请审批单ID             |
| flow_id        | ObjectId   | True  | 审批流程ID                |
| node_id        | ObjectId   | True  | 审批流程节点ID              |
| flow_record_id | ObjectId   | True  | OA审批单流转明细记录ID         |
| created_by     | ObjectId   | True  | 发起人id                 |
| notify_account | [ObjectId] | True  | 催办对象(审批人) 可多人         |
| state          | int        | N     | 1 未处理 100 已办理 -100 关闭 |
| created_at     | datetime   | True  | 创建时间                  |
| updated_at     | datetime   | False | 更新时间                  |


#### 房屋租赁合同/记录 OaHouseContract 

| 参数名称                         | 类型           | 是否必须  | 描述                                       |
| :--------------------------- | :----------- | :---- | ---------------------------------------- |
| _id                          | ObjectId     | N     | 合同编号                                     |
| migrate_flag                 | bool         | False | 存量合同补录模式                                 |
| migrate_oa_note              | string       | False | 存量合同原OA审批单号或其他审批信息                       |
| area                         | string       | False | 面积                                       |
| usage                        | string       | False | 用途                                       |
| contract_start_date          | string       | False | 合同租期起始时间, YYYY-MM-DD                     |
| contract_end_date            | string       | False | 合同租期结束时间, YYYY-MM-DD                     |
| cost_center_type             | int          | False | 成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目  |
| state                        | int          | True  | 执行状态 1(待提交/草稿) 10（审批中）50(执行中)  100(完成) -100(终止) -101 (删除) |
| biz_state                    | int          | True  | 特殊业务申请状态: 0 无特殊业务 11 续租申请中  12 断租申请中 13 退租申请中 |
| city_codes                   | [basestring] | False | 城市全拼                                     |
| supplier_ids                 | [ObjectId]   | False | 供应商ID                                    |
| platform_codes               | [basestring] | False | 平台CODE                                   |
| biz_district_ids             | [ObjectId]   | False | 商圈列表                                     |
| cost_allocations             | [dict]       | False | 分摊明细对象[{platform_code, city_code, supplier_id, biz_district_id}] |
| allocation_mode              | int          | False | 成本归属分摊模式（6 平均分摊）                         |
| month_money                  | int          | False | 月租金（分）                                   |
| rent_invoice_flag            | bool         | False | 租金是否开票                                   |
| rent_accounting_id           | ObjectId     | False | 租金科目ID                                   |
| period_month_num             | int          | False | 每次付款月数                                   |
| period_money                 | int          | False | 单次/续租付款金额, 分                             |
| init_paid_month_num          | int          | False | 录入时已经支付租金月数                              |
| init_paid_money              | int          | False | 录入时已经支付租金金额                              |
| schedule_prepare_days        | int          | False | 提前多少天提醒申请租金续租                            |
| rent_payee_info              | dict         | False | 租金收款人信息                                  |
| pledge_money                 | int          | False | 押金 分                                     |
| pledge_invoice_flag          | bool         | False | 押金是否开票                                   |
| pledge_accounting_id         | ObjectId     | False | 押金科目ID                                   |
| pledge_payee_info            | dict         | False | 押金收款人信息                                  |
| agent_money                  | int          | False | 中介费                                      |
| agent_invoice_flag           | bool         | False | 中介费是否开票                                  |
| agent_accounting_id          | ObjectId     | False | 中介费科目ID                                  |
| agent_payee_info             | dict         | False | 中介费收款人信息                                 |
| note                         | string       | False | 备注                                       |
| break_date                   | string       | False | 房屋断租日期时间（YYYY-MM-DD）                     |
| pledge_return_money          | int          | False | 实际退租/断退回押金                               |
| pledge_lost_money            | int          | False | 退/断租押金损失                                 |
| lost_accounting_id           | int          | False | 退/断租押金损失科目ID                             |
| attachments                  | [basestring] | False | 附件地址列表                                   |
| next_pay_time                | datetime     | False | 记录下一次续租时间                                |
| plan_total_pay_num           | int          | False | 合约计划付款次数                                 |
| plan_total_money             | int          | False | 合约租金总金额                                  |
| plan_paid_money              | int          | False | 合约已支付租金总金额                               |
| plan_pending_pay_num         | int          | False | 计划未执行付款次数                                |
| init_application_order_id    | ObjectId     | False | 新租审批ID                                   |
| last_application_order_id    | ObjectId     | False | 断/退租付款审批ID                              |
| current_application_order_id | ObjectId     | False | 当前进行审批的审批单ID                             |
| cost_order_ids               | [ObjectId]   | False | 关联的费用记录ID数组                              |
| application_order_ids        | [ObjectId]   | False | 关联的审批单ID数组                               |
| from_contract_id             | ObjectId     | False | 续签的旧合同ID                                 |
| renewal_contract_id          | ObjectId     | False | 续签的新合同ID                                 |
| creator_id                   | ObjectId     | False | 创建人ID                                    |
| operator_id                  | ObjectId     | False | 最近修改人                                    |
| approved_at                  | datetime     | False | 申请通过时间(开始执行时间）                           |


#### 系统消息/通知 CommonMessage 

| 参数名称           | 类型         | 是否必须  | 描述                          |
| :------------- | :--------- | :---- | --------------------------- |
| _id            | ObjectId   | True  | 消息ID                        |
| channel_id     | string     | True  | 消息总线ID                      |
| biz_channel_id | int        | True  | 业务模块ID                      |
| state          | int        | True  | 1（新）90（已送达）100（已读）-100（已删除） |
| broad_type     | int        | True  | 1(全局) 10(定向)                |
| accounts       | [ObjectId] | False | 定向接收人账号                     |
| payload        | dict       | True  | 消息负载                        |
| updated_at     | datetime   | True  | 更新时间                        |
| created_at     | datetime   | True  | 创建时间                        |


### 扩展模型




##### ResultSetMeta

| 参数名称         | 类型      | 描述       |
| :----------- | :------ | :------- |
| has_more     | boolean | 是否存在更多数据 |
| result_count | int     | 数据总条数    |

##### FindMeta

| 参数名称  | 类型   | 描述                                       |
| :---- | :--- | :--------------------------------------- |
| page  | int  | 第几页                                      |
| limit | int  | 每页条数                                     |
| sort  | dict | 排序方式 形式是 {field_name: 1 or -1) 1 正序 -1 倒叙 默认是 {_id:-1} |

所有返回 ResultSet 均带有 key 为 '_meta' 的 元信息头


#### 账号摘要 AccountBrief

| 参数名称     | 类型       | 描述     |
| :------- | :------- | :----- |
| _id      | ObjectId | id     |
| name     | string   | name   |
| gid      | int      | 角色（职位） |
| staff_id | string   | 员工ID   |

#### 费用科目摘要 CostAccountingBrief

| 参数名称                   | 类型                  | 描述                                      |
| :--------------------- | :------------------ | :-------------------------------------- |
| _id                    | ObjectId            | id                                      |
| name                   | string              | 名称                                      |
| parent_info            | CostAccountingBrief | 上级科目摘要                                  |
| cost_center_type_title | string              | 成本中心归属类型名称                              |
| cost_center_type       | int                 | 成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目 |
| creator_info           | AccountBrief        | 创建人信息                                   |


#### 费用科目摘要 CostAccountingListItem

| 参数名称                   | 类型                  | 描述         |
| :--------------------- | :------------------ | :--------- |
| parent_info            | CostAccountingBrief | 上级科目摘要     |
| cost_center_type_title | string              | 成本中心归属类型名称 |
| creator_info           | AccountBrief        | 创建人信息      |

#### 费用科目详情 CostAccountingDetail

##### 基础参数 (OaCostAccounting)

##### 扩展参数

| 参数名称                   | 类型                  | 描述         |
| :--------------------- | :------------------ | :--------- |
| parent_info            | CostAccountingBrief | 上级科目摘要     |
| cost_center_type_title | string              | 成本中心归属类型名称 |
| creator_info           | AccountBrief        | 创建人信息      |


#### 费用分组摘要 CostGroupBrief

| 参数名称            | 类型                    | 描述            |
| :-------------- | :-------------------- | :------------ |
| _id             | ObjectId              | id            |
| name            | string                | 名称            |
| creator_info    | AccountBrief          | 创建人信息         |
| accounting_list | [CostAccountingBrief] | 包含的所有会计科目摘要列表 |

#### 费用分组详情 CostGroupDetail

##### 基础参数 (OaCostGroup)

##### 扩展参数

| 参数名称            | 类型                    | 描述              |
| :-------------- | :-------------------- | :-------------- |
| creator_info    | AccountBrief          | 创建人信息           |
| accounting_list | [CostAccountingBrief] | 包含的所有会计科目列表摘要信息 |

#### 审批流模版摘要 ApplicationFlowTemplateBrief

| 参数名称                    | 类型                         | 描述          |
| :---------------------- | :------------------------- | :---------- |
| _id                     | ObjectId                   | 审批流id       |
| name                    | string                     | 审批流名称       |
| cost_catalog_scope_list | [CostGroupBrief]           | 包含的费用分组摘要列表 |
| extra_ui_options        | dict                       | 前端UI表单选项    |
| node_list               | [ApplicationFlowNodeBrief] | 审批流节点摘要列表   |

#### 审批流模版详情 ApplicationFlowTemplateDetail

##### 基础参数 (OaApplicationFlowTemplate)

##### 扩展参数

| 参数名称                            | 类型                         | 描述           |
| :------------------------------ | :------------------------- | :----------- |
| creator_info                    | AccountBrief               | 创建人          |
| node_list                       | [ApplicationFlowNodeBrief] | 审批流节点摘要列表    |
| cost_catalog_scope_list         | [CostGroupBrief]           | 包含的费用分组摘要列表  |
| exclude_cost_catalog_scope_list | [CostGroupBrief]           | 排除掉的费用分组摘要列表 |


#### 审批流模版节点列表（嵌入） ApplicationFlowNodeEmbedItem

##### 基础参数 (OaApplicationFlowNode)

##### 扩展参数

| 参数名称                      | 类型                | 描述        |
| :------------------------ | :---------------- | :-------- |
| account_list              | [AccountBrief]    | 节点审批人摘要列表 |
| parent_flow_template_info | FlowTemplateBrief | 所属审批流模版摘要 |

#### 审批流节点摘要（嵌入） ApplicationFlowNodeBrief

| 参数名称                   | 类型             | 描述        |
| :--------------------- | :------------- | :-------- |
| _id                    | ObjectId       | 节点id      |
| name                   | string         | 节点名称      |
| account_list           | [AccountBrief] | 节点审批人摘要列表 |
| is_payment_node        | bool           | 是否为支付节点   |
| can_update_cost_record | bool           | 是否为支付节点   |
| cost_update_rule       | bool           | 费用记录修改规则  |
| index_num              | int            | 流程节点索引序号  |


#### 审批流模版节点详情 ApplicationFlowNodeDetail

##### 基础参数 (OaApplicationFlowNode)

##### 扩展参数

| 参数名称                      | 类型                           | 描述        |
| :------------------------ | :--------------------------- | :-------- |
| account_list              | [AccountBrief]               | 节点审批人列表   |
| parent_flow_template_info | ApplicationFlowTemplateBrief | 所属审批流模版摘要 |


#### 付款审批列表 ApplicationOrderListItem

##### 基础参数 (OaApplicationOrder)

##### 扩展参数

| 参数名称                         | 类型                                | 描述                         |
| :--------------------------- | :-------------------------------- | :------------------------- |
| city_names                   | [string]                          | 城市名称列表                     |
| supplier_names               | [string]                          | 供应商名称列表                    |
| platform_names               | [string]                          | 平台名称列表                     |
| biz_district_names           | [string]                          | 商圈名称列表                     |
| flow_info                    | ApplicationFlowTemplateBrief      | 审批流模版详情                    |
| current_flow_node_info       | ApplicationFlowNodeBrief          | 当前节点信息                     |
| apply_account_info           | AccountBrief                      | 申请人信息                      |
| current_pending_account_list | [AccountBrief]                    | 当前节点等待处理的人员账号列表            |
| flow_account_list            | [AccountBrief]                    | 当前审批流已经手操作的人员账号列表（包括审批和补充） |
| operate_accounts_list        | [AccountBrief]                    | 本审批单可审核操作（通过/驳回）的人员列表      |
| current_operate_account_list | [AccountBrief]                    | 可前节点可审核操作（通过/驳回）的人员列表      |
| current_record_list          | [ApplicationOrderFlowRecordBrief] | 当前节点的审批记录列表                |
| attachment_private_urls      | [string]                          | 附件私有下载地址                   |


#### 付款审批摘要 ApplicationOrderBrief

| 参数名称                     | 类型                                | 描述                                       |
| :----------------------- | :-------------------------------- | :--------------------------------------- |
| _id                      | ObjectId                          | 审批单id                                    |
| city_names               | [string]                          | 城市名称列表                                   |
| supplier_names           | [string]                          | 供应商名称列表                                  |
| platform_names           | [string]                          | 平台名称列表                                   |
| biz_district_names       | [string]                          | 商圈名称列表                                   |
| state                    | int                               | 流程状态 1 => 待提交 10 => 审批流进行中 100 => 流程完成 -100=> 流程关闭 =>-101 删除 |
| biz_state                | int                               | 当前节点的业务审批状态 1 => 待处理 10 => 待补充 50 => 异常 100 => 通过 -100 => 驳回 |
| total_money              | int                               | 总金额                                      |
| submit_at                | datetime                          | 提交时间(成本归属时间）                             |
| flow_info                | ApplicationFlowTemplateBrief      | 审批流模版摘要                                  |
| current_flow_node_info   | ApplicationFlowNodeBrief          | 当前节点信息                                   |
| apply_account_info       | AccountBrief                      | 申请人信息摘要                                  |
| current_operate_accounts | [string]                          | 可前节点可审核操作（通过/驳回）的人员列表                    |
| cost_order_list          | [CostOrderBrief]                  | 费用单摘要列表                                  |
| flow_record_list         | [ApplicationOrderFlowRecordBrief] | 审批单流转明细记录列表                              |


#### 付款审批详情 ApplicationOrderDetail

##### 基础参数 (OaApplicationOrder)

##### 扩展参数

| 参数名称                         | 类型                                | 描述                         |
| :--------------------------- | :-------------------------------- | :------------------------- |
| city_names                   | [string]                          | 城市名称列表                     |
| supplier_names               | [string]                          | 供应商名称列表                    |
| platform_names               | [string]                          | 平台名称列表                     |
| biz_district_names           | [string]                          | 商圈名称列表                     |
| flow_info                    | ApplicationFlowTemplateBrief      | 审批流模版摘要                    |
| current_flow_node_info       | ApplicationFlowNodeBrief          | 当前节点信息                     |
| apply_account_info           | AccountBrief                      | 申请人信息                      |
| current_pending_account_list | [AccountBrief]                    | 当前节点等待处理的人员账号列表            |
| flow_account_list            | [AccountBrief]                    | 当前审批流已经手操作的人员账号列表（包括审批和补充） |
| operate_accounts_list        | [AccountBrief]                    | 本审批单可审核操作（通过/驳回）的人员列表      |
| current_operate_account_list | [AccountBrief]                    | 可前节点可审核操作（通过/驳回）的人员列表      |
| cost_order_list              | [CostOrderBrief]                  | 成本费用记录摘要列表                 |
| current_record_list          | [ApplicationOrderFlowRecordBrief] | 当前节点的审批记录摘要列表              |
| flow_record_list             | [ApplicationOrderFlowRecordBrief] | 审批单的流转明细记录，倒序排列            |


#### 付款审批流转记录摘要 ApplicationOrderFlowRecordBrief

| 参数名称                 | 类型                            | 描述                                |
| :------------------- | :---------------------------- | :-------------------------------- |
| _id                  | ObjectId                      | OA审批单流转明细记录id                     |
| extra_info_list      | [OaApplicationOrderFlowExtra] | 扩展信息列表                            |
| operate_account_list | [AccountBrief]                | 审批人列表                             |
| cc_account_list      | [AccountBrief]                | 抄送人列表                             |
| order_id             | ObjectId                      | 审批单ID                             |
| flow_id              | ObjectId                      | 审批流ID                             |
| index_num            | int                           | 归属流程节点序号, 0 代表是首个提报记录             |
| reject_to_node_id    | ObjectId                      | 驳回至新节点 用于驳回，记录驳回后的返回的节点ID         |
| reject_to_node_info  | ApplicationFlowNodeBrief      | 驳回至的审批流节点的摘要                      |
| state                | int                           | 审批状态 1 待处理 100 通过 -100 驳回 -101 关闭 |
| urge_state           | bool                          | 当前记录的催办状态 false 未催办 true 已催办      |
| note                 | string                        | 操作说明                              |
| node_id              | ObjectId                      | 审批流程节点ID 提报记录节点为 None             |
| flow_node_info       | ApplicationFlowNodeBrief      | 审批流程节点摘要                          |
| operated_at          | datetime                      | 实际审批操作时间                          |


#### 付款审批流转明细记录 ApplicationOrderFlowRecordDetail

##### 基础参数 (OaApplicationOrderFlowRecord)

##### 扩展参数

| 参数名称                    | 类型                            | 描述       |
| :---------------------- | :---------------------------- | :------- |
| extra_info_list         | [OaApplicationOrderFlowExtra] | 扩展信息     |
| operate_account_list    | [AccountBrief]                | 审批人列表    |
| cc_account_list         | [AccountBrief]                | 抄送人列表    |
| attachment_private_urls | [string]                      | 附件私有下载地址 |


#### 成本费用记录分摊摘要 CostAllocationBrief

| 参数名称              | 类型       | 是否必须 | 描述      |
| :---------------- | :------- | :--- | ------- |
| city_code         | string   | True | 城市代码    |
| city_name         | string   | True | 城市名称    |
| platform_code     | string   | True | 平台      |
| platform_name     | string   | True | 平台名称    |
| supplier_id       | ObjectId | True | 供应商ID   |
| supplier_name     | string   | True | 供应商     |
| biz_district_id   | ObjectId | True | 商圈ID    |
| biz_district_name | string   | True | 商圈      |
| money             | int      | True | 分摊金额(分) |


#### 催办记录详情 ApplicationUrgeRecordDetail

##### 基础参数 (OaApplicationUrgeRecord)

##### 扩展参数

| 参数名称                   | 类型                              | 是否必须 | 描述                    |
| :--------------------- | :------------------------------ | :--- | --------------------- |
| state_title            | string                          | Y    | 状态名称                  |
| creator_info           | AccountBrief                    | Y    | 催办人信息                 |
| application_order_info | ApplicationOrderListItem        | Y    | OA审批单信息(包含审批流信息)      |
| flow_record_info       | ApplicationOrderFlowRecordBrief | Y    | OA审批单流转明细记录（含被催办节点信息) |

#### 成本费用记录列表记录 CostOrderListItem

##### 基础参数 (OaCostOrder)

##### 扩展参数

| 参数名称                 | 类型                  | 描述      |
| :------------------- | :------------------ | :------ |
| city_names           | [string]            | 城市名称列表  |
| supplier_names       | [string]            | 供应商名称列表 |
| biz_district_names   | [string]            | 商圈名称列表  |
| cost_accounting_info | CostAccountingBrief | 费用科目摘要  |
| cost_group_name      | string              | 费用分组名称  |

#### 成本费用记录摘要 CostOrderBrief

| 参数名称                          | 类型                        | 描述                                       |
| :---------------------------- | :------------------------ | :--------------------------------------- |
| _id                           | ObjectId                  | 成本费用记录单id                                |
| city_names                    | [string]                  | 城市名称列表                                   |
| supplier_names                | [string]                  | 供应商名称列表                                  |
| biz_district_names            | [string]                  | 商圈名称列表                                   |
| cost_accounting_info          | CostAccountingBrief       | 费用科目摘要                                   |
| cost_group_name               | string                    | 费用分组名称                                   |
| state                         | int                       | 单据状态 -101 删除 10 进行中 100 完成 1 待提交 -100 关闭 |
| allocation_mode               | int                       | 成本归属分摊模式（ 6 平均分摊 8 自定义分摊）                |
| note                          | string                    | 备注                                       |
| attachments                   | [string]                  | 附件Key列表                                  |
| attachment_private_urls       | [string]                  | 附件私有下载地址                                 |
| usage                         | string                    | 用途                                       |
| total_money                   | int                       | 总金额（支付报销金额)                              |
| invoice_flag                  | bool                      | 发票标记(true 有 false 无)                     |
| apply_account_info            | AccountBrief              | 提报人摘要信息                                  |
| payee_info                    | PayeeInfoSchema.structure | 收款人信息                                    |
| biz_extra_house_contract_id   | ObjectId                  | 业务附加信息==》 房屋租赁合同ID                       |
| cost_allocation_list          | [CostAllocationBrief]     | OA 成本费用记录分摊清单                            |
| cost_group_info               | CostGroupBrief            | 成本费用分组摘要                                 |
| biz_extra_house_contract_info | OaHouseContract           | 租房合同（暂时没有定义）                             |


#### 成本费用记录详情 CostOrderDetail

##### 基础参数 (OaCostOrder)

##### 扩展参数

| 参数名称                          | 类型                    | 描述            |
| :---------------------------- | :-------------------- | :------------ |
| apply_account_info            | AccountBrief          | 申请人信息         |
| city_names                    | [string]              | 城市名称列表        |
| supplier_names                | [string]              | 供应商名称列表       |
| platform_names                | [string]              | 平台名称列表        |
| biz_district_names            | [string]              | 商圈名称列表        |
| cost_accounting_info          | CostAccountingBrief   | 费用科目摘要        |
| cost_group_name               | string                | 成本费用分组名称      |
| biz_extra_house_contract_info | HouseContract         | 租房合同          |
| city_names                    | [string]              | 城市名称列表        |
| cost_allocation_list          | [CostAllocationBrief] | OA 成本费用记录分摊清单 |
| attachment_private_urls       | [string]              | 附件私有下载地址      |
| note                          | string                | 备注            |


#### 系统消息详情 SysNoticeDetail 

##### 基础参数 (CommonMessage)
##### 扩展参数

| 参数名称             | 类型             | 是否必须  | 描述      |
| :--------------- | :------------- | :---- | ------- |
| channel_name     | string         | True  | 消息总线名称  |
| broad_type_title | string         | True  | 广播类型名称  |
| event_id         | int            | True  | 事件ID    |
| event_title      | string         | True  | 事件名称    |
| event_extra      | dict           | False | 事件参数    |
| is_sent          | bool           | True  | 是否已送达   |
| is_read          | bool           | True  | 是否已送达   |
| is_done          | bool           | True  | 是否已送达   |
| is_deleted       | bool           | True  | 是否已送达   |
| is_broad_global  | bool           | True  | 是否全局消息  |
| is_broad_custom  | bool           | True  | 是否定向消息  |
| account_list     | [AccountBrief] | False | 定向接收人账号 |

#### BOSS助理消息详情 BossAssistNoticeDetail 

##### 基础参数 (CommonMessage)
##### 扩展参数

| 参数名称                     | 类型             | 是否必须  | 描述                  |
| :----------------------- | :------------- | :---- | ------------------- |
| channel_name             | string         | True  | 消息总线名称              |
| broad_type_title         | string         | True  | 广播类型名称              |
| is_sent                  | bool           | True  | 是否已送达               |
| is_read                  | bool           | True  | 是否已送达               |
| is_done                  | bool           | True  | 是否已送达               |
| is_deleted               | bool           | True  | 是否已送达               |
| is_broad_global          | bool           | True  | 是否全局消息              |
| is_broad_custom          | bool           | True  | 是否定向消息              |
| account_list             | [AccountBrief] | False | 定向接收人账号             |
| event_id                 | int            | True  | 事件ID，1(催办) 2(待处理审批) |
| event_title              | string         | True  | 事件名称，如催办消息/待处理审批    |
| event_extra              | dict           | False | 事件参数                |
| oa_application_order_id  | string         | False | 审批单ID               |
| oa_application_record_id | string         | False | 审批记录ID              |
| oa_urge_record_id        | string         | False | 催办记录ID              |

#### 房屋合同列表 HouseContractListItem

##### 基础参数 (OaHouseContract)
##### 扩展参数

| 参数名称           | 类型       | 是否必须    | 描述   |
| :------------- | :------- | :------ | ---- |
| city_names     | [string] | 城市名称列表  |      |
| supplier_names | [string] | 供应商名称列表 |      |
| platform_names | [string] | 平台名称列表  |      |


#### 房屋合同详情 HouseContractDetail 

##### 基础参数 (OaHouseContract)
##### 扩展参数

| 参数名称                                     | 类型           | 是否必须     | 描述   |
| :--------------------------------------- | :----------- | :------- | ---- |
| city_names                               | [string]     | 城市名称列表   |      |
| supplier_names                           | [string]     | 供应商名称列表  |      |
| platform_names                           | [string]     | 平台名称列表   |      |
| creator_info                             | AccountBrief | 创建人信息    |      |
| state_title                              | string       | 状态名      |      |
| biz_state_title                          | string       | 业务状态名    |      |
| allocation_mode_title                    | string       | 平均分摊     |      |
| rent_accounting_name                     | string       | 房租科目名    |      |
| pledge_accounting_name                   | string       | 押金科目名    |      |
| agent_accounting_name                    | string       | 中介费科目名   |      |
| lost_accounting_name                     | string       | 押金损失科目名  |      |
| attachment_private_urls                  | list[string] | 附件地址     |      |
| cost_allocation_list                     | list         | 成本归属分摊列表 |      |
| cost_allocation_list.{i}.platform_code   | string       |          |      |
| cost_allocation_list.{i}.platform_name   | string       |          |      |
| cost_allocation_list.{i}.supplier_id     | string       |          |      |
| cost_allocation_list.{i}.supplier_name   | string       |          |      |
| cost_allocation_list.{i}.city_code       | string       |          |      |
| cost_allocation_list.{i}.city_name       | string       |          |      |
| cost_allocation_list.{i}.biz_district_id | string       |          |      |
| cost_allocation_list.{i}.biz_district_name | string       |          |      |


## 接口列表

消息总线

#### **消息列表**

消息按 channel（消息总线） 分为

1）系统总线
2）业务总线，如 BOSS 助理

每个业务模块均可注册自己的 channel 到消息总线。当前支持的 channel

- ```
  BA - BOSS 助理
  SYS - 系统总线
  ```

##### 系统总线消息

**请求方式：**

POST

**接口地址：**

message_bus/sys_channel

**请求参数：**

| 参数名称        | 类型       | 是否必须 | 描述                                    |
| :---------- | :------- | :--- | ------------------------------------- |
| _meta       | FindMeta | N    |                                       |
| broad_type  | int      | Y    | 全局(1)还是定向消息(10)                       |
| state       | [int]    | N    | 状态 1（新消息）90（送达）91（已读）100（完成）-101（已删除） |
| account_ids | [string] | N    | 接收人账号ID列表, 默认只返回当前请求用户作为接收人           |


**响应参数：**

| 参数名称  | 类型                | 描述   |
| :---- | :---------------- | :--- |
| _meta | ResultSetMeta     |      |
| data  | [SysNoticeDetail] | 消息详情 |

**请求示例：**

```


```

**响应示例：**

```


```

##### BOSS助理总线消息

**请求方式：**

POST

**接口地址：**

message_bus/ba_channel

**请求参数：**

| 参数名称        | 类型       | 是否必须 | 描述                                    |
| :---------- | :------- | :--- | ------------------------------------- |
| _meta       | FindMeta | N    |                                       |
| broad_type  | int      | Y    | 全局(1)还是定向消息(10)                       |
| state       | [int]    | N    | 状态 1（新消息）90（送达）91（已读）100（完成）-101（已删除） |
| account_ids | [string] | N    | 接收人账号ID列表, 默认只返回当前请求用户作为接收人           |

**响应参数：**

| 参数名称  | 类型                | 描述   |
| :---- | :---------------- | :--- |
| _meta | ResultSetMeta     |      |
| data  | [SysNoticeDetail] | 消息详情 |

**请求示例：**

```

```

**响应示例：**

```

```

#### 标记消息状态

**请求方式：**

POST

**接口地址：**

message_bus/mark_state

**请求参数：**

| 参数名称       | 类型       | 是否必须 | 描述                                    |
| :--------- | :------- | :--- | ------------------------------------- |
| ids        | [string] | Y    | 消息ID列表                                |
| channel_id | string   | Y    | 总线 SYS\|BA                            |
| state      | [int]    | N    | 状态 1（新消息）90（送达）91（已读）100（完成）-101（已删除） |

**响应参数：**

| 参数名称 | 类型   | 描述   |
| :--- | :--- | :--- |
| ok   | bool | 操作状态 |

#### 消息计数器

**请求方式：**

POST

**接口地址：**

message_bus/channel_counter

**请求参数：**

| 参数名称       | 类型     | 是否必须 | 描述                                    |
| :--------- | :----- | :--- | ------------------------------------- |
| channel_id | string | Y    | 总线 SYS\|BA                            |
| state      | [int]  | N    | 状态 1（新消息）90（送达）91（已读）100（完成）-101（已删除） |

**响应参数：**

| 参数名称 | 类型   | 描述   |
| :--- | :--- | :--- |
| cnt  | int  | 计数   |



### 费用科目

#### 新建科目记录

**说明：**

会计科目编码必须唯一

**请求方式：**

POST

**接口地址：**

oa_cost_accounting/create

**请求参数：**

| 参数名称                    | 类型     | 是否必须 | 描述                                       |
| :---------------------- | :----- | :--- | ---------------------------------------- |
| record                  | dict   | Y    | 单条记录                                     |
| record.code             | string | N    | 快捷别名                                     |
| record.accounting_code  | string | Y    | 会计科目编码，必须全局唯一                            |
| record.name             | string | Y    | 名称                                       |
| record.level            | int    | Y    | 级别（1、2、3）                                |
| record.cost_center_type | int    | Y    | 成本中心归属类型 1（骑士）  2（商圈）3（城市）4（项目主体总部）5（项目） |
| record.parent_id        | string | N    | 上级科目ID                                   |
| record.description      | string | N    | 科目描述                                     |

**响应参数：**

| 参数名称   | 类型                  | 描述     |
| :----- | :------------------ | :----- |
| ok     | boolean             | 创建结果   |
| record | CostAccountingBrief | 费用科目摘要 |


**请求示例：**

```

```

**响应示例：**

```

```

#### 费用科目列表

**说明：**

获取费用科目列表列表

**请求方式：**

POST

**接口地址：**

oa_cost_accounting/find

**请求参数：**

| 参数名称             | 类型       | 是否必须 | 描述                                |
| :--------------- | :------- | :--- | --------------------------------- |
| _meta            | FindMeta | N    |                                   |
| state            | [int]    | N    | 检索条件(状态 -101（删除） -100（停用） 100（正常) |
| cost_center_type | [int]    | N    | 成本归属中心                            |
| level            | [int]    | N    | 科目级别                              |

**响应参数：**

| 参数名称  | 类型                     | 描述   |
| :---- | :--------------------- | :--- |
| _meta | ResultMeta             |      |
| data  | [CostAccountingDetail] | 记录集  |


**请求示例：**

```


```

**响应示例：**

```


```

#### 费用科目详情

**说明：**

获取科目详情

**请求方式：**

POST

**接口地址：**

oa_cost_accounting/get

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述   |
| :--- | :----- | :--- | ---- |
| id   | string | 是    | 科目ID |

**响应参数：**

CostAccountingDetail


**请求示例：**

```


```

**响应示例：**

```


```

#### 更新科目信息

**说明：**

修改科目

**请求方式：**

POST

**接口地址：**

oa_cost_accounting/update

**请求参数：**

| 参数名称                    | 类型     | 是否必须 | 描述                                       |
| :---------------------- | :----- | :--- | ---------------------------------------- |
| id                      | string | 是    | 科目ID                                     |
| record                  | dict   | Y    | 修改科目信息                                   |
| record.code             | string | N    | 快捷别名                                     |
| record.accounting_code  | string | N    | 会计科目编码，必须全局唯一                            |
| record.name             | string | N    | 名称                                       |
| record.level            | int    | N    | 级别（1、2、3）                                |
| record.cost_center_type | int    | N    | 成本中心归属类型 1（骑士）  2（商圈）3（城市）4（项目主体总部）5（项目） |
| record.parent_id        | string | N    | 上级科目ID                                   |
| record.description      | string | N    | 科目描述                                     |


**响应参数：**

| 参数名称   | 类型                  | 描述     |
| ------ | :------------------ | :----- |
| ok     | boolean             | 结果     |
| record | CostAccountingBrief | 费用科目摘要 |

**请求示例：**

```


```

**响应示例：**

```


```

### 费用分组

#### 新建分组

**说明：**

**请求方式：**

POST

**接口地址：**

oa_cost_group/create

**请求参数：**

| 参数名称                  | 类型       | 是否必须 | 描述          |
| :-------------------- | :------- | :--- | ----------- |
| record                | dict     | Y    | 单条记录信息      |
| record.name           | string   | Y    | 分组名称        |
| record.accounting_ids | [string] | N    | 分组包含的科目ID列表 |
| record.supplier_ids   | [string] | N    | 适用的供应商ID列表  |
| record.note           | string   | N    | 备注说明        |

**响应参数：**
| 参数名称   | 类型             | 描述     |
| :----- | :------------- | :----- |
| ok     | boolean        | 创建结果   |
| record | CostGroupBrief | 费用分组摘要 |

**请求示例：**

```

```

**响应示例：**

```

```

#### 费用分组列表

**说明：**

费用分组列表

**请求方式：**

POST

**接口地址：**

oa_cost_group/find

**请求参数：**

| 参数名称           | 类型       | 是否必须 | 描述                                    |
| :------------- | :------- | :--- | ------------------------------------- |
| _meta          | FindMeta | N    |                                       |
| state          | [int]    | N    | 状态 -101（ 删除） -100（ 停用） 100（ 正常） 1（编辑） |
| accounting_ids | [string] | N    | 费用科目ID                                |

**响应参数：**

| 参数名称  | 类型                | 描述   |
| :---- | :---------------- | :--- |
| _meta | ResultMeta        |      |
| data  | [CostGroupDetail] | 记录集  |

**请求示例：**

```


```

**响应示例：**

```


```

#### 费用分组详情

**说明：**

费用分组详情

**请求方式：**

POST

**接口地址：**

oa_cost_group/get

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述     |
| :--- | :----- | :--- | ------ |
| id   | string | 是    | 费用分组ID |


**响应参数：**

CostGroupDetail

**请求示例：**

```


```

**响应示例：**

```

```

#### 更新费用分组信息

**说明：**

修改费用分组

**请求方式：**

POST

**接口地址：**

oa_cost_group/update

**请求参数：**

| 参数名称                  | 类型       | 是否必须 | 描述          |
| :-------------------- | :------- | :--- | ----------- |
| id                    | string   | 是    | 分组ID        |
| record                | dict     | Y    | 修改信息        |
| record.name           | string   | N    | 分组名称        |
| record.accounting_ids | [string] | N    | 分组包含的科目ID列表 |
| record.supplier_ids   | [string] | N    | 适用的供应商ID列表  |
| record.note           | string   | N    | 备注          |

**响应参数：**

| 参数名称   | 类型             | 描述       |
| :----- | :------------- | :------- |
| ok     | boolean        | 结果       |
| record | CostGroupBrief | OA费用分组摘要 |


**请求示例：**

```
{
   
}

```

**响应示例：**

```


```

#### 删除费用分组

**说明：**

删除费用分组

**请求方式：**

POST

**接口地址：**

oa_cost_group/mark_deleted

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述     |
| :--- | :----- | :--- | ------ |
| id   | string | 是    | 费用分组ID |

**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |


**请求示例：**

```

```

**响应示例：**

```


```

#### 启用/停用分组

**说明：**

启用的分组不可再修改。

**请求方式：**

POST

**接口地址：**

oa_cost_group/toggle_state

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述                 |
| :--- | :----- | :--- | ------------------ |
| id   | string | 是    | 审批流模版id            |
| flag | bool   | 是    | true: 启用 false: 停用 |

**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |

**请求示例：**

```
{
    "_id": "5a6fe47bce6d2a0ef4b0a035", 
    "flag": true
}


```

**响应示例：**

```
{
    "ok": true
}

```

#### 

### 房屋合同

#### 新建合同

**说明：**

新建合同

**请求方式：**

POST

**接口地址：**

oa_house_contract/create

**请求参数：**

| 参数名称                                     | 类型       | 是否必须 | 描述                                       |
| :--------------------------------------- | :------- | :--- | ---------------------------------------- |
| record                                   | dict     | Y    | 合同信息                                     |
| record.platform_code                     | string   | N    | 平台代码                                     |
| record.migrate_flag                      | bool     | N    | 存量合同录入模式                                 |
| record.migrate_oa_note                   | string   | N    | 存量合同原OA审批单号或其他审批信息                       |
| record.area                              | string   | N    | 面积                                       |
| record.usage                             | string   | N    | 用途                                       |
| record.contract_start_date               | string   | N    | 合同租期起始时间, YYYY-MM-DD                     |
| record.contract_end_date                 | string   | N    | 合同租期结束时间, YYYY-MM-DD                     |
| record.note                              | string   | N    | 备注                                       |
| record.attachments                       | [string] | N    | 附件                                       |
| 成本归属和分摊信息                                |          |      |                                          |
| record.cost_center_type                  | int      | N    | 成本中心归属类型: 2(商圈)  3(城市)  4(项目主体总部)  5(项目) |
| record.cost_allocations                  | list     | N    | 成本分摊对象列表                                 |
| record.cost_allocations.{i}.platform_code | string   | Y    | 平台代码                                     |
| record.cost_allocations.{i}.supplier_id  | string   | N    | 供应商ID                                    |
| record.cost_allocations.{i}.city_code    | string   | N    | 城市代码                                     |
| record.cost_allocations.{i}.biz_district_id | string   | N    | 商圈ID                                     |
| 租金信息                                     |          |      |                                          |
| record.month_money                       | int      | N    | 月租金（分）                                   |
| record.rent_invoice_flag                 | bool     | N    | 租金是否开票                                   |
| record.rent_accounting_id                | string   | N    | 租金会计科目                                   |
| record.schedule_prepare_days             | int      | N    | 提前多少天提醒申请租金续租                            |
| record.period_month_num                  | int      | N    | 付款周期(每次付款月数)                             |
| record.init_paid_month_num               | int      | N    | 录入时已经支付租金月数                              |
| record.init_paid_money                   | int      | N    | 录入时已经支付租金金额（分）                           |
| record.rent_payee_info                   | dict     | N    | 租金收款人信息                                  |
| record.rent_payee_info.card_name         | string   | N    | 收款人姓名                                    |
| record.rent_payee_info.card_num          | string   | N    | 收款人账号卡号                                  |
| record.rent_payee_info.bank_details      | string   | N    | 开户行等详细信息                                 |
| 押金信息                                     |          |      |                                          |
| record.pledge_money                      | int      | N    | 押金(分)                                    |
| record.pledge_invoice_flag               | bool     | N    | 押金是否开票                                   |
| record.pledge_accounting_id              | string   | N    | 押金科目ID                                   |
| record.pledge_payee_info                 | dict     | N    | 押金收款人信息                                  |
| record.pledge_payee_info.card_name       | string   | N    | 收款人姓名                                    |
| record.pledge_payee_info.card_num        | string   | N    | 收款人账号卡号                                  |
| record.pledge_payee_info.bank_details    | string   | N    | 开户行等详细信息                                 |
| 中介费信息                                    | --       | N    | --                                       |
| record.agent_money                       | int      | N    | 中介费(分)                                   |
| record.agent_invoice_flag                | bool     | N    | 中介费是否开票                                  |
| record.agent_accounting_id               | string   | N    | 中介费科目ID                                  |
| record.agent_payee_info                  | dict     | N    | 中介费收款人信息                                 |
| record.agent_payee_info.card_name        | string   | N    | 收款人姓名                                    |
| record.agent_payee_info.card_num         | string   | N    | 收款人账号卡号                                  |
| record.agent_payee_info.bank_details     | string   | N    | 开户行等详细信息                                 |


**响应参数：**

HouseContractDetail

#### 续签/复制合同

**说明：**

续签或复制合同。

renewal 为True 表示为续签合同，开始日期为源合同截止日，新合同的其他信息和源合同相同，

renewal 为False 表示为复制合同，合同信息全部和源合同相同。

**请求方式：**

POST

**接口地址：**

oa_house_contract/clone

**请求参数：**

| 参数名称    | 类型     | 是否必须 | 描述    |
| :------ | :----- | :--- | ----- |
| id      | string | 是    | 源合同ID |
| renewal | bool   | 是    | 是否为续签 |


**响应参数：**

HouseContractDetail


#### 房屋合同详情

**说明：**

房屋合同详情

**请求方式：**

POST

**接口地址：**

oa_house_contract/get

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述   |
| :--- | :----- | :--- | ---- |
| id   | string | 是    | 合同ID |

**响应参数：**

HouseContractDetail


#### 删除房屋合同

**说明：**

只有未提交执行的房屋合同可以删除

**请求方式：**

POST

**接口地址：**

oa_house_contract/mark_deleted

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述   |
| :--- | :----- | :--- | ---- |
| id   | string | 是    | 合同ID |

**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |


#### 更新合同信息

**说明：**

1. 未提交的合同可以更新全部合同信息
2. 审批中的合同不可以更新合同信息
3. 执行中的合同可以更新租金收款人信息（暂不做）

**请求方式：**

POST

**接口地址：**

oa_house_contract/update

**请求参数：**

| 参数名称                                     | 类型       | 是否必须 | 描述                                       |
| :--------------------------------------- | :------- | :--- | ---------------------------------------- |
| id                                       | string   | Y    | 合同ID                                     |
| record                                   | dict     | Y    | 更新的合同信息                                  |
| record.platform_code                     | string   | N    | 平台代码                                     |
| record.migrate_flag                      | bool     | N    | 存量合同录入模式                                 |
| record.migrate_oa_note                   | string   | N    | 存量合同原OA审批单号或其他审批信息                       |
| record.area                              | string   | N    | 面积                                       |
| record.usage                             | string   | N    | 用途                                       |
| record.contract_start_date               | string   | N    | 合同租期起始时间, YYYY-MM-DD                     |
| record.contract_end_date                 | string   | N    | 合同租期结束时间, YYYY-MM-DD                     |
| record.note                              | string   | N    | 备注                                       |
| record.attachments                       | [string] | N    | 附件                                       |
| 成本归属和分摊信息                                |          |      |                                          |
| record.cost_center_type                  | int      | N    | 成本中心归属类型: 2(商圈)  3(城市)  4(项目主体总部)  5(项目) |
| record.cost_allocations                  | list     | N    | 成本分摊对象列表                                 |
| record.cost_allocations.{i}.platform_code | string   | Y    | 平台代码                                     |
| record.cost_allocations.{i}.supplier_id  | string   | N    | 供应商ID                                    |
| record.cost_allocations.{i}.city_code    | string   | N    | 城市代码                                     |
| record.cost_allocations.{i}.biz_district_id | string   | N    | 商圈ID                                     |
| 租金信息                                     |          |      |                                          |
| record.month_money                       | int      | N    | 月租金（分）                                   |
| record.rent_invoice_flag                 | bool     | N    | 租金是否开票                                   |
| record.rent_accounting_id                | string   | N    | 租金会计科目                                   |
| record.schedule_prepare_days             | int      | N    | 提前多少天提醒申请租金续租                            |
| record.period_month_num                  | int      | N    | 付款周期(每次付款月数)                             |
| record.init_paid_month_num               | int      | N    | 录入时已经支付租金月数                              |
| record.init_paid_money                   | int      | N    | 录入时已经支付租金金额（分）                           |
| record.rent_payee_info                   | dict     | N    | 租金收款人信息                                  |
| record.rent_payee_info.card_name         | string   | N    | 收款人姓名                                    |
| record.rent_payee_info.card_num          | string   | N    | 收款人账号卡号                                  |
| record.rent_payee_info.bank_details      | string   | N    | 开户行等详细信息                                 |
| 押金信息                                     |          |      |                                          |
| record.pledge_money                      | int      | N    | 押金(分)                                    |
| record.pledge_invoice_flag               | bool     | N    | 押金是否开票                                   |
| record.pledge_accounting_id              | string   | N    | 押金科目ID                                   |
| record.pledge_payee_info                 | dict     | N    | 押金收款人信息                                  |
| record.pledge_payee_info.card_name       | string   | N    | 收款人姓名                                    |
| record.pledge_payee_info.card_num        | string   | N    | 收款人账号卡号                                  |
| record.pledge_payee_info.bank_details    | string   | N    | 开户行等详细信息                                 |
| 中介费信息                                    | --       | N    | --                                       |
| record.agent_money                       | int      | N    | 中介费(分)                                   |
| record.agent_invoice_flag                | bool     | N    | 中介费是否开票                                  |
| record.agent_accounting_id               | string   | N    | 中介费科目ID                                  |
| record.agent_payee_info                  | dict     | N    | 中介费收款人信息                                 |
| record.agent_payee_info.card_name        | string   | N    | 收款人姓名                                    |
| record.agent_payee_info.card_num         | string   | N    | 收款人账号卡号                                  |
| record.agent_payee_info.bank_details     | string   | N    | 开户行等详细信息                                 |


**响应参数：**

| 参数名称   | 类型                  | 描述     |
| :----- | :------------------ | :----- |
| ok     | boolean             | 结果     |
| record | HouseContractDetail | 合同详细信息 |


#### 合同列表

**说明：**

合同列表

**请求方式：**

POST

**接口地址：**

oa_house_contract/find

**请求参数：**

| 参数名称             | 类型       | 是否必须 | 描述    |
| :--------------- | :------- | :--- | ----- |
| id               | string   | N    | 合同IID |
| platform_codes   | [string] | N    | 平台代码  |
| supplier_ids     | [string] | N    | 供应商   |
| city_codes       | [string] | N    | 城市代码  |
| biz_district_ids | [string] | N    | 商圈    |

**响应参数：**

| 参数名称  | 类型                      | 描述     |
| :---- | :---------------------- | :----- |
| _meta | ResultSetMeta           |        |
| data  | [HouseContractListItem] | 合同记录列表 |

#### 提交合同审批

**说明：**

提交合同

如合同为存量模式，状态改为进行中。

新合同模式：

	- 如合同为草稿/待提交，会提交创建新租审批单

	- 如合同为审批中，且原审批单已关闭，会再次提交创建新的新租审批单



**请求方式：**

POST

**接口地址：**

oa_house_contract/submit_contract

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述    |
| :--- | :----- | :--- | ----- |
| id   | string | Y    | 合同IID |

**响应参数：**

| 参数名称                 | 类型      | 描述            |
| :------------------- | :------ | :------------ |
| ok                   | boolean | 结果            |
| application_order_id | string  | 审批单ID（新租模式返回） |



#### 创建续租/断租/退租审批单

**说明：**

一个合同只能有一个待提交/审批进行中的审批单，不论续/断/退

**请求方式：**

POST

**接口地址：**

oa_cost_order/create_rent_application_order

**请求参数：**

| 参数名称                | 类型     | 是否必须 | 描述                                       |
| :------------------ | :----- | :--- | ---------------------------------------- |
| id                  | string | Y    | 合同IID                                    |
| action              | string | Y    | rent(续租）, close（退租，到期不续约）, break（断租，提前终止合约） |
| break_date          | string | N\|Y | 断租日期 YYYY-MM-DD 断租必须提供                   |
| note                | string | N    | 备注说明                                     |
| return_rent_money   | int    | N    | 退回的租金（分）                                 |
| return_pledge_money | int    | N    | 退回的押金（分）                                 |

**响应参数：**

| 参数名称                 | 类型      | 描述    |
| :------------------- | :------ | :---- |
| ok                   | boolean | 结果    |
| application_order_id | string  | 审批单ID |




### 成本费用记录单

#### 新建费用记录单

**说明：**

**请求方式：**

POST

**接口地址：**

oa_cost_order/create

**请求参数：**

| 参数名称                                     | 类型       | 是否必须 | 描述                    |
| :--------------------------------------- | :------- | :--- | --------------------- |
| application_order_id                     | string   | Y    | 审批单ID                 |
| records                                  | [dict]   | Y    | 费用记录单数据集(单或多条)        |
| records[i].cost_group_id                 | string   | Y    | 费用分组ID                |
| records[i].cost_accounting_id            | string   | Y    | 费用科目id                |
| records[i].total_money                   | int      | Y    | 申请金额                  |
| records[i].invoice_flag                  | bool     | Y    | 是否开发票                 |
| records[i].allocation_mode               | int      | Y    | 分摊模式：6（平均分摊） 8（自定义分摊） |
| records[i].cost_allocation               | [dict]   | Y    | 分摊明细列表                |
| records[i].cost_allocation[i].supplier_id | string   | N    | 供应商ID                 |
| records[i].cost_allocation[i].platform_code | string   | N    | 平台代码                  |
| records[i].cost_allocation[i].city_code  | string   | N    | 城市代码                  |
| records[i].cost_allocation[i].biz_district_id | string   | N    | 商圈ID                  |
| records[i].cost_allocation[i].money      | int      | N    | 分摊金额（分）               |
| records[i].payee_info                    | dict     | Y    | 收款人信息                 |
| records[i].payee_info.card_name          | string   | Y    | 收款人姓名                 |
| records[i].payee_info.card_num           | string   | Y    | 收款人卡号                 |
| records[i].payee_info.bank_details       | string   | Y    | 开户行                   |
| records[i].attachments                   | [string] | N    | 附件地址列表                |
| records[i].note                          | string   | N    | 备注                    |
|                                          |          |      |                       |

**响应参数：**

| 参数名称    | 类型               | 描述      |
| :------ | :--------------- | :------ |
| ok      | boolean          | 结果      |
| records | [CostOrderBrief] | 申请单摘要列表 |


**请求示例：**

```


```

**响应示例：**

```

```

#### 费用记录单详情

**说明：**

**请求方式：**

POST

**接口地址：**

oa_cost_order/get

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述   |
| :--- | :----- | :--- | ---- |
| id   | string | 是    | ID   |

**响应参数：**

CostOrderDetail


请求示例：**

```


```

**响应示例：**

```
{
  
}
```

#### 更新费用记录单

**说明：**

**请求方式：**

POST

**接口地址：**

oa_cost_order/update

**请求参数：**

| 参数名称                                     | 类型       | 是否必须 | 描述                    |
| :--------------------------------------- | :------- | :--- | --------------------- |
| id                                       | string   | 是    | ID                    |
| records                                  | [dict]   | Y    | 费用单数据集(单或多条)          |
| records[i].cost_group_id                 | string   | N    | 费用类型ID                |
| records[i].cost_accounting_id            | string   | N    | 费用科目id                |
| records[i].total_money                   | int      | N    | 申请金额                  |
| records[i].invoice_flag                  | bool     | N    | 是否开发票                 |
| records[i].allocation_mode               | int      | N    | 分摊模式：6（平均分摊） 8（自定义分摊） |
| records[i].cost_allocation               | [dict]   | N    | 分摊明细                  |
| records[i].cost_allocation[i].supplier_id | string   | Y    | 供应商ID                 |
| records[i].cost_allocation[i].platform_code | string   | N    | 平台代码                  |
| records[i].cost_allocation[i].city_code  | string   | N    | 城市代码                  |
| records[i].cost_allocation[i].biz_district_id | string   | N    | 商圈ID                  |
| records[i].cost_allocation[i].money      | int      | Y    | 分摊金额（分）               |
| records[i].payee_info                    | dict     | N    | 收款人信息                 |
| records[i].payee_info.card_name          | string   | Y    | 收款人姓名                 |
| records[i].payee_info.card_num           | string   | Y    | 收款人卡号                 |
| records[i].payee_info.bank_details       | string   | N    | 开户行                   |
| records[i].attachments                   | [string] | N    | 附件地址列表                |
| records[i].note                          | string   | N    | 备注                    |
|                                          |          |      |                       |

**响应参数：**

| 参数名称   | 类型             | 描述       |
| ------ | -------------- | -------- |
| ok     | bool           |          |
| record | CostOrderBrief | 成本费用记录摘要 |


**请求示例：**

```
{
    "id": "582661953d65ce2b7b5dde32"
}

```

**响应示例：**

```
{
    "ok": false, 
}
```

#### 删除费用记录单

**说明：**

**请求方式：**

POST

**接口地址：**

oa_cost_order/mark_deleted

**请求参数：**

| 参数名称                 | 类型       | 是否必须 | 描述          |
| :------------------- | :------- | :--- | ----------- |
| application_order_id | string   | 是    | 审批单ID       |
| record_ids           | [string] | Y    | 费用单ID(单或多条) |

**响应参数：**

| 参数名称 | 类型   | 描述   |
| :--- | :--- | :--- |
| ok   | bool | 结果   |

**请求示例：**

```


```

**响应示例：**

```


```

#### 费用记录单列表

**说明：**

**请求方式：**

POST

**接口地址：**

oa_cost_order/find

**请求参数：**

| 参数名称                        | 类型       | 是否必须 | 描述                                      |
| :-------------------------- | :------- | :--- | --------------------------------------- |
| _meta                       | FindMeta | N    |                                         |
| application_order_id        | string   | N    | 审批单ID                                   |
| platform_codes              | [string] | N    | 平台代码                                    |
| supplier_ids                | [string] | N    | 供应商                                     |
| city_codes                  | [string] | N    | 城市代码                                    |
| biz_district_ids            | [string] | N    | 商圈                                      |
| state                       | [int]    | N    | 单据状态 -101 删除 10 进行中 100 完成 1 待提交        |
| paid_state                  | [int]    | N    | 打款状态 100:已打款  -1:异常  1:未处理              |
| invoice_flag                | bool     | N    | 发票标记(true 有 false 无)                    |
| cost_center_type            | [int]    | N    | 成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目 |
| allocation_mode             | [int]    | N    | 成本归属分摊模式（ 6 平均分摊 8 自定义分摊）               |
| cost_group_id               | [string] | N    | 费用分组ID                                  |
| biz_extra_house_contract_id | [string] | N    | 房屋合同ID                                  |

**响应参数：**

| 参数名称  | 类型                  | 描述       |
| :---- | :------------------ | :------- |
| _meta | ResultSetMeta       |          |
| data  | [CostOrderListItem] | 成本费用记录列表 |

**请求示例：**

```
{
    "id": "582661953d65ce2b7b5dde32"
}

```

**响应示例：**

```
{
    "ok": false, 
}
```


### 审批流

#### 创建审批流

**说明：**

节点信息需要审批流创建后，通过审批流节点相关接口来创建和更新。

**请求方式：**

POST

**接口地址：**

oa_application_flow/create

**请求参数：**

| 参数名称                              | 类型         | 是否必须 | 描述                                       |
| :-------------------------------- | :--------- | :--- | ---------------------------------------- |
| record                            | dict       | y    | 单条记录信息                                   |
| record.name                       | string     | Y    | 审批流名字                                    |
| record.biz_type                   | int        | N    | 业务分类  1 成本审批流  90 非成本审批流                 |
| record.note                       | string     | N    | 说明                                       |
| record.cost_catalog_scope         | [ObjectId] | N    | 限定仅用于本审批流的费用分组类型id列表                     |
| record.exclude_cost_catalog_scope | [ObjectId] | N    | 限定不可用于本审批流的费用分组类型id列表                    |
| record.platform_codes             | [string]   | N    | 适用平台                                     |
| record.supplier_ids               | [ObjectId] | N    | 适用供应商                                    |
| record.city_codes                 | [string]   | N    | 适用城市                                     |
| record.biz_district_ids           | [ObjectId] | N    | 适用商圈                                     |
| record.extra_ui_options           | dict       | N    | 审批流的前端UI配置 ``{form_template: "form_template_id",cost_forms: { cost_group_id: "form_template_id"} }`` |

**响应参数：**

| 参数名称   | 类型                           | 描述      |
| :----- | :--------------------------- | :------ |
| ok     | boolean                      | 结果      |
| record | ApplicationFlowTemplateBrief | 审批流模板摘要 |

**请求示例：**

```

```

**响应示例：**

```

```

#### 更新审批流信息

**说明：**

节点信息不在此更新，请使用审批流节点相关接口

**请求方式：**

POS

**接口地址：**

oa_application_flow/update

**请求参数：**

| 参数名称                              | 类型         | 是否必须 | 描述                                       |
| :-------------------------------- | :--------- | :--- | ---------------------------------------- |
| id                                | string     | Y    | 审批流ID                                    |
| record                            | dict       | Y    | 更新记录信息                                   |
| record.name                       | string     | N    | 审批流名字                                    |
| record.biz_type                   | int        | N    | 业务分类  1（成本审批流）  90（非成本审批流）               |
| record.note                       | string     | N    | 说明                                       |
| record.cost_catalog_scope         | [ObjectId] | N    | 限定仅用于本审批流的费用分组类型id列表                     |
| record.exclude_cost_catalog_scope | [ObjectId] | N    | 限定不可用于本审批流的费用分组类型id列表                    |
| record.platform_codes             | [string]   | N    | 平台                                       |
| record.supplier_ids               | [ObjectId] | N    | 供应商                                      |
| record.city_codes                 | [string]   | N    | 城市                                       |
| record.biz_district_ids           | [ObjectId] | N    | 商圈                                       |
| record.extra_ui_options           | dict       | N    | 审批流的前端UI配置 ``{form_template: "form_template_id",cost_forms: { cost_group_id: "form_template_id"} }`` |


**响应参数：**

| 参数名称   | 类型                           | 描述      |
| :----- | :--------------------------- | :------ |
| ok     | boolean                      | 结果      |
| record | ApplicationFlowTemplateBrief | 审批流模板摘要 |

**请求示例：**

```


```

**响应示例：**

```

```


#### 审批流列表

**说明：**

获取审批流记录列表

**请求方式：**

POST

**接口地址：**

oa_application_flow/find

**请求参数：**

| 参数名称             | 类型       | 是否必须 | 描述                         |
| :--------------- | :------- | :--- | -------------------------- |
| _meta            | FindMeta | N    |                            |
| state            | [int]    | N    | 状态                         |
| biz_type         | [int]    | N    | 业务分类  1（成本审批流）  90（非成本审批流） |
| platform_codes   | [string] | N    | 平台代码                       |
| supplier_ids     | [string] | N    | 供应商                        |
| city_codes       | [string] | N    | 城市代码                       |
| biz_district_ids | [string] | N    | 商圈                         |


**响应参数：**

| 参数名称  | 类型                              | 描述      |
| :---- | :------------------------------ | :------ |
| _meta | ResultSetMeta                   |         |
| data  | [ApplicationFlowTemplateDetail] | 审批流列表记录 |

**请求示例：**

```



```

**响应示例：**

```


```

#### 审批流详情接口

**说明：**

获取审批流详情

**请求方式：**

POST

**接口地址：**

oa_application_flow/get

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述    |
| :--- | :----- | :--- | ----- |
| id   | string | 是    | 审批流ID |


**响应参数：**

ApplicationFlowTemplateDetail


**请求示例：**

```
{
    "_id": "5a6fe47bce6d2a0ef4b0a035"
}

```

**响应示例：**

```


```

#### 启用/停用审批流

**说明：**

启用的审批流不可再修改。

当前若有进行中的审批单，不可停用。

**请求方式：**

POST

**接口地址：**

oa_application_flow/toggle_state

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述                 |
| :--- | :----- | :--- | ------------------ |
| id   | string | 是    | 审批流模版id            |
| flag | bool   | 是    | true: 启用 false: 停用 |


**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |


**请求示例：**

```
{
    "_id": "5a6fe47bce6d2a0ef4b0a035", 
    "flag": true
}

```

**响应示例：**

```
{
    "ok": true
}
```

#### 删除审批流

**说明：**

启用中的审批流不可删除。

**请求方式：**

POST

**接口地址：**

oa_application_flow/mark_deleted

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述      |
| :--- | :----- | :--- | ------- |
| id   | string | 是    | 审批流模版id |

**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |


**请求示例：**

```
{
    "id": "5a6fe47bce6d2a0ef4b0a035", 
}

```

**响应示例：**

```
{
    "ok": true
}
```
#### 设置特殊审批流选项

**说明：**

设置房租合同等特殊配置选项

选项格式：

    elem|meituan: # 平台代码
    	# 会计科目设置
    	accountings:
            # 押金科目ID
            pledge_accounting_id:
            	'5': 'XXXXx'
            	'4': 'xxxxx'
            	'3': 'xxxxx'
            	'2': 'xxxxx'
            # 中介科目ID
            agent_accounting_id:
            	'5': 'XXXXx'
            	'4': 'xxxxx'
            	'3': 'xxxxx'
            	'2': 'xxxxx'
            # 房租科目ID
            rent_accounting_id:
            	'5': 'XXXXx'
            	'4': 'xxxxx'
            	'3': 'xxxxx'
            	'2': 'xxxxx'
            # 押金损失科目ID
            lost_accounting_id:
            	'5': 'XXXXx'
            	'4': 'xxxxx'
            	'3': 'xxxxx'
            	'2': 'xxxxx'
    	# 审批流设置
        init:  # 新租|含续签
            flow_id: 'xxxx' # 审批流ID
            cost_group_id:  'XXXXX' #  费用分组ID
        period:  # 每月/周期续租
            flow_id: 'xxxx' # 审批流ID
            cost_group_id:  'XXXXX' #  费用分组ID
        break:  # 断/退租
            flow_id: 'xxxx' # 审批流ID
            cost_group_id:  'XXXXX' #  费用分组ID


**请求方式：**

POST

**接口地址：**

oa_application_flow/update_feature_options

**请求参数：**

| 参数名称                                | 类型     | 是否必须 | 描述                    |
| :---------------------------------- | :----- | :--- | --------------------- |
| feature                             | string | N    | 特性, 默认为house_contract |
| options                             | dict   | Y    | 配置项                   |
| 以下为房屋合同管理的默认配置                      |        |      |                       |
| options.<platform_code>             | dict   | N    | 配置项                   |
| options.<platform_code>.accountings | dict   | N    | 会计科目配置                |
| options.<platform_code>.init        | dict   | N    | 新租\|含续签配置项            |
| options.<platform_code>.period      | dict   | N    | 周期续租配置项               |
| options.<platform_code>.break       | dict   | N    | 断退租配置项                |

**响应参数：**




**请求示例：**

```
{
    "_id": "5a6fe47bce6d2a0ef4b0a035"
}

```

#### 获取特殊审批流选项

**说明：**

获取房租合同等特殊配置选项

**请求方式：**

POST

**接口地址：**

oa_application_flow/get_feature_options

**请求参数：**

| 参数名称    | 类型     | 是否必须 | 描述                    |
| :------ | :----- | :--- | --------------------- |
| feature | string | N    | 特性, 默认为house_contract |

**响应参数：**

| 参数名称    | 类型   | 描述       |
| :------ | :--- | :------- |
| elem    | dict | 饿了么平台配置项 |
| meituan | dict | 美团平台配置项  |
|         |      |          |




**请求示例：**

```
{
    
}

```

**响应示例：**

```


```

#### 添加审批流节点

**说明：**

创建审批流节点并添加到审批流，只有编辑中的审批流才可以操作。

**请求方式：**

POST

**接口地址：**

oa_application_flow/create_node

**请求参数：**

| 参数名称                          | 类型       | 是否必须 | 描述                                       |
| :---------------------------- | :------- | :--- | ---------------------------------------- |
| flow_id                       | string   | Y    | 审批流ID                                    |
| record                        | dict     | Y    | 节点信息                                     |
| record.index_num              | int      | N    | 流程节点索引序号, 1 开始. 若忽略节点插入最后，若指定，则心节点插入指定的位置，原有节点自动后移 |
| record.name                   | string   | Y    | 节点名称                                     |
| record.account_ids            | [string] | N    | 节点审批人                                    |
| record.approve_mode           | int      | N    | 节点审批模式: 10(所有审批人全部审批)  20(任意审批人审批)       |
| record.is_payment_node        | bool     | N    | 特殊节点标记: 是否为支付节点. 支付节点可以变更费用的付款状态, 默认: false |
| record.can_update_cost_record | bool     | N    | 特殊节点标记:是否可修改提报的费用记录. 默认: false           |
| record.cost_update_rule       | int      | N    | 费用记录修改规则: 0(无限制) -1(向下) 1(向上)            |


**响应参数：**

| 参数名称   | 类型                        | 描述        |
| :----- | :------------------------ | :-------- |
| ok     | boolean                   | 结果        |
| record | ApplicationFlowNodeDetail | 审批流模板节点详情 |


**请求示例：**

```


```

**响应示例：**

```

```

#### 修改审批流节点

**说明：**

修改审批流节点

**请求方式：**

POST

**接口地址：**

oa_application_flow/update_node

**请求参数：**

| 参数名称                          | 类型       | 是否必须 | 描述                                       |
| :---------------------------- | :------- | :--- | ---------------------------------------- |
| id                            | string   | Y    | 节点ID                                     |
| flow_id                       | string   | Y    | 审批流ID                                    |
| record                        | dict     | Y    | 节点信息                                     |
| record.index_num              | int      | N    | 流程节点索引序号, 1 开始. 若忽略节点插入最后，若指定，则心节点插入指定的位置，原有节点自动后移 |
| record.name                   | string   | N    | 节点名称                                     |
| record.account_ids            | [string] | N    | 节点审批人                                    |
| record.approve_mode           | int      | N    | 节点审批模式: 10 (所有审批人全部审批)  20 (任意审批人审批)     |
| record.is_payment_node        | bool     | N    | 特殊节点标记: 是否为支付节点. 支付节点可以变更费用的付款状态, 默认: false |
| record.can_update_cost_record | bool     | N    | 特殊节点标记:是否可修改提报的费用记录. 默认: false           |
| record.cost_update_rule       | int      | N    | 费用记录修改规则: 0(无限制)  -1(向下)  1(向上)          |

**响应参数：**

| 参数名称   | 类型                        | 描述     |
| :----- | :------------------------ | :----- |
| ok     | boolean                   | 结果     |
| record | ApplicationFlowNodeDetail | 节点详情信息 |

**请求示例：**

```
{
    
    "desc": "测试", 
    "name": "审批流111", 
    "flow_id": "5b7916a4421aa932a88ef22d"
}

```

**响应示例：**

```
{
    "ok": true,
}
```

#### 移除审批流节点

**说明：**

移除审批流节点

**请求方式：**

POST

**接口地址：**

oa_application_flow/remove_node

**请求参数：**

| 参数名称    | 类型     | 是否必须 | 描述    |
| :------ | :----- | :--- | ----- |
| id      | string | 是    | 审批流ID |
| node_id | string | 是    | 节点ID  |

**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |

**请求示例：**

```
{
    
    "_id": "5b7916a4421aa932a88ef22d"
    "node_id": "5b7916a4421aa932a88ef22d"
}

```

**响应示例：**

```
{
    "ok": true,
}
```


### OA 审批单

#### 新建审批单

**说明：**

创建一条审批单（空单）

**请求方式：**

POST

**接口地址：**

oa_application_order/create

**请求参数：**

| 参数名称    | 类型     | 是否必须 | 描述    |
| :------ | :----- | :--- | ----- |
| flow_id | string | 是    | 审批流ID |

**响应参数：**
| 参数名称   | 类型                    | 描述      |
| :----- | :-------------------- | :------ |
| ok     | boolean               | 结果      |
| record | ApplicationOrderBrief | 审批单摘要信息 |


**请求示例：**

```


```

**响应示例：**

```

```


#### 审批单列表

**说明：**

获取审批单列表

**请求方式：**

POST

**接口地址：**

oa_application_order/find

**请求参数：**

| 参数名称                     | 类型       | 是否必须 | 描述                                       |
| :----------------------- | :------- | :--- | ---------------------------------------- |
| _meta                    | FindMeta | N    |                                          |
| paid_state               | [int]    | N    | 打款状态 100:已打款  -1:异常  1:未处理               |
| city_codes               | [string] | N    | 城市代码                                     |
| platform_codes           | [string] | N    | 平台（项目）                                   |
| supplier_ids             | [string] | N    | 供应商（主体总部）                                |
| biz_district_ids         | [string] | N    | 商圈代码                                     |
| state                    | [int]    | N    | 流程状态 1 => 待提交 10 => 审批流进行中 100 => 流程完成 -100=> 流程关闭 -100 => 删除 |
| biz_state                | [int]    | N    | 当前节点的业务审批状态 1 => 待处理 50 => 异常 100 => 正常 -100 => 驳回 10 => 待补充 |
| urge_state               | bool     | N    | 当前节点的催办状态 true 未催办 false 已催办             |
| current_pending_accounts | [String] | N    | 当前等待处理的人员账号列表                            |
| apply_account_id         | String   | N    | 申请人ID                                    |
| flow_accounts            | [String] | N    | 当前审批流已经手操作的人员账号列表（包括审批和补充）               |

**响应参数：**

| 参数名称  | 类型                         | 描述   |
| :---- | :------------------------- | :--- |
| _meta | ResultMeta                 |      |
| data  | [ApplicationOrderListItem] | 记录集  |

**请求示例：**

```
{
    "examine_id": "582661953d65ce2b7b5dde32"
}

```
**响应示例：**

```
{
    "ok": false,
    "result": []
}
```

#### 审批单详情

**说明：**

审批单详情

**请求方式：**

POST

**接口地址：**

oa_application_order/get

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述    |
| :--- | :----- | :--- | ----- |
| id   | string | 是    | 审批单ID |

**响应参数：**

ApplicationOrderDetail

**请求示例：**

```
{
    "examineflow_id": "5b78f566421aa92d7ff3d068"
}

```

**响应示例：**

```
{
    "examine_id": "5b79251e421aa9374716e68d",
    "ok": true
}
```


#### 提报审批单

**说明：**

提报人提报审批单。

* 对于首次提报，首先生成提报节点的审批记录（节点为提报节点，状态：通过），同时生成下一个节点的审批记录（一条或多条）
* 对于二次提报（被打回的再次提交），变更当前提报节点的审批记录状态为通过，生成下一个节点的审批记录（一条或多条）

**请求方式：**

POST

**接口地址：**

oa_application_order/submit

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述    |
| :--- | :----- | :--- | ----- |
| id   | string | 是    | 审批单ID |

**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |
|      |         |      |

**请求示例：**

```
{
    "id": "582661953d65ce2b7b5dde32"
}

```
**响应示例：**

```
{
    "ok": true,
}
```


#### 删除审批单

**说明：**

只有未提交过的审批单可以删除，若已提交请使用终止审批接口

**请求方式：**

POST

**接口地址：**

oa_application_order/mark_deleted

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述    |
| :--- | :----- | :--- | ----- |
| id   | string | Y    | 审批单ID |
| note | string | N    | 备注    |


**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |

**请求示例：**

```
{
    "id": "582661953d65ce2b7b5dde32"
}

```

**响应示例：**

```
{
    "ok": false,
}
```

#### 终止审批

**说明：**

只有进行中的审批单可以执行操作

**请求方式：**

POST

**接口地址：**

oa_application_order/cancel

**请求参数：**

| 参数名称 | 类型     | 是否必须 | 描述    |
| :--- | :----- | :--- | ----- |
| id   | string | Y    | 审批流ID |
| note | string | N    |       |

**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |

**请求示例：**

```
{
    "id": "582661953d65ce2b7b5dde32"
}

```

**响应示例：**

```
{
    "ok": false,
}
```


#### 审批通过

**说明：**

非提报节点的通过使用本操作。提报节点的操作可使用提报操作。

1. 若审批单当前节点的所有审批记录均已通过，则生成下一个节点的审批记录。
2. 若当前节点是最后一个节点，则审批流程全部完成。审批单状态由“进行中”变为“审批完成。
3. 若审批单当前节点仍有其他审批记录未通过，则不改变审批单的当前节点，也**不会生成**下一个节点的审批记录
4. 审批单业务状态字段变更为：通过

**请求方式：**

POST

**接口地址：**

oa_application_order/approve

**请求参数：**

| 参数名称            | 类型     | 是否必须 | 描述        |
| :-------------- | :----- | :--- | --------- |
| order_id        | string | Y    | 审批单ID     |
| order_record_id | string | Y    | 通过的审批记录ID |
| note            | string | N    | 审批意见      |

**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |

**请求示例：**

```
{
    "id": "582661953d65ce2b7b5dde32"
}

```

**响应示例：**

```
{
    "ok": false,
}
```


#### 审批驳回

**说明：**

1. 提报节点不可执行驳回操作
2. 不论当前节点有多少审批记录，均会关闭其他未处理的审批记录
3. 审批单业务状态字段变更为：驳回
4. 若未指定退回的目标节点，默认为提报节点，生成提报人的审批记录

**请求方式：**

POST

**接口地址：**

oa_application_order/reject

**请求参数：**

| 参数名称              | 类型     | 是否必须 | 描述                   |
| :---------------- | :----- | :--- | -------------------- |
| order_id          | string | 是    | 审批单ID                |
| order_record_id   | string | 是    | 驳回的审批记录ID            |
| reject_to_node_id | string | N    | 退回至目标节点, 不指定则默认退回提报人 |
| note              | string | N    | 驳回原因                 |

**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |

**请求示例：**

```
{
    "id": "582661953d65ce2b7b5dde32"
}

```

**响应示例：**

```
{
    "ok": false,
}
```


#### 催办

**说明：**

1. 对当前节点的所有未处理的审批记录均生成一条催办记录
2. 审批单的催办标记设置为 True
3. 当前节点未处理完，只能调用一次催办，后续的催办调用被忽略
4. 同一个节点在多次审批循环中，可每次循环均可以催办一次

**请求方式：**

POST

**接口地址：**

oa_application_order/urge

**请求参数：**

| 参数名称     | 类型     | 是否必须 | 描述    |
| :------- | :----- | :--- | ----- |
| order_id | string | 是    | 审批单ID |

**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |

**请求示例：**

```
{
    "id": "582661953d65ce2b7b5dde32"
}

```

**响应示例：**

```
{
    "ok": false,
}
```



#### 获取催办记录详情

**说明：**

一条审批记录只对应一条催办记录，所有可以根据审批记录ID获取对应催办记录，但若该记录未被催办则返回错误。

id 参数的优先级高于 order_record_id 。

**请求方式：**

POST

**接口地址：**

oa_application_order/get_urge_detail

**请求参数：**

| 参数名称            | 类型     | 是否必须 | 描述         |
| :-------------- | :----- | :--- | ---------- |
| id              | string | N    | 催办记录ID     |
| order_record_id | string | N    | 被催办的审批记录ID |

**响应参数：**

```
ApplicationUrgeRecordDetail
```

*请求示例：**

```

```

**响应示例：**

```
{
    "ok": false,
}

```



#### 标记打款

**说明：**

只有当前节点是可支付节点，方可以执行本操作

**请求方式：**

POST

**接口地址：**

oa_application_order/mark_paid

**请求参数：**

| 参数名称            | 类型     | 是否必须 | 描述               |
| :-------------- | :----- | :--- | ---------------- |
| order_id        | string | 是    | 审批单ID            |
| order_record_id | string | 是    | 审批记录ID           |
| paid_state      | int    | N    | -1(异常) 100 （已打款） |
| note            | string | N    | 原因               |

**响应参数：**

| 参数名称 | 类型      | 描述   |
| :--- | :------ | :--- |
| ok   | boolean | 结果   |

**请求示例：**

```
{
    "id": "582661953d65ce2b7b5dde32"
}

```

**响应示例：**

```
{
    "ok": false,
}
```

#### 获取审批流转明细记录

**说明：**

**请求方式：**

POST

**接口地址：**

oa_application_order/find_flow_records

**请求参数：**

| 参数名称     | 类型     | 是否必须 | 描述     |
| :------- | :----- | :--- | ------ |
| order_id | string | 是    | 审批单ID  |
| node_id  | string | N    | 指定节点ID |

**响应参数：**

| 参数名称  | 类型                                 | 描述   |
| :---- | :--------------------------------- | :--- |
| _meta | ResultMeta                         |      |
| data  | [ApplicationOrderFlowRecordDetail] | 记录集  |

**请求示例：**

```


```

**响应示例：**

```


```

## 附录 - 错误表

| 错误代码(code) | 错误简称(code_name)               | 中文描述(zh_message)            | 原因                                 |
| :--------- | :---------------------------- | :-------------------------- | :--------------------------------- |
| 1000       | ResourceNotFound              | 请求的数据对象不存在                  | 查找的记录主键不正确或记录已被删除,通常是提供了错误的主键(ID)值 |
| 401001     | Invalid_Argument              | 参数缺失或错误                     | 调用参数未提供或不符合验证格式要求                  |
| 2036       | ErrorOaBizRuleInvalid         | OA审批管理作业规则验证失败，实际会返回具体的错误提示 | 违反了业务规则，可依据具体错误信息判断                |
| 3000       | ErrorMessageBusBizRuleInvalid | 消息总线规则验证失败，实际会返回具体的错误提示     | 违反了业务规则，可依据具体错误信息判断                |


