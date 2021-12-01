export default [
  {
    desc: 'OA费用分组(原费用类型）',
    obj: 'OaCostGroup',
    struct: [
      {
        desc: '_id',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '名称',
        field: 'name',
        required: true,
        type: 'string',
      },
      {
        desc: '供应商ID',
        field: 'supplier_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '费用科目ID',
        field: 'accounting_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '创建人ID',
        field: 'creator_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '状态 -101(删除) -100(停用) 100(正常) 1(编辑)',
        field: 'state',
        required: false,
        type: 'int',
      },
      {
        desc: '备注',
        field: 'note',
        required: false,
        type: 'string',
      },
      {
        desc: '更新时间',
        field: 'updated_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '创建时间',
        field: 'created_at',
        required: false,
        type: 'datetime',
      },
    ],
  },
  {
    desc: 'OA成本费用会计科目表',
    obj: 'OaCostAccounting',
    struct: [
      {
        desc: '_id',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '快捷别名',
        field: 'code',
        required: false,
        type: 'string',
      },
      {
        desc: '会计科目编码',
        field: 'accounting_code',
        required: true,
        type: 'string',
      },
      {
        desc: '名称',
        field: 'name',
        required: true,
        type: 'string',
      },
      {
        desc: '级别 1、2、3',
        field: 'level',
        required: true,
        type: 'int',
      },
      {
        desc: '成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目',
        field: 'cost_center_type',
        required: true,
        type: 'int',
      },
      {
        desc: '上级科目ID',
        field: 'parent_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '创建人账户ID',
        field: 'creator_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '描述',
        field: 'description',
        required: false,
        type: 'string',
      },
      {
        desc: '状态 -101 删除 -100 停用 100 正常 1 编辑',
        field: 'state',
        required: true,
        type: 'int',
      },
      {
        desc: '更新时间',
        field: 'updated_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '创建时间',
        field: 'created_at',
        required: false,
        type: 'datetime',
      },
    ],
  },
  {
    desc: 'OA成本费用记录分摊明细表(分摊记录)',
    obj: 'OaCostAllocation',
    struct: [
      {
        desc: '流水号',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '所属成本记录',
        field: 'cost_order_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '城市',
        field: 'city_code',
        required: false,
        type: 'string',
      },
      {
        desc: '平台（项目）',
        field: 'platform_code',
        required: false,
        type: 'string',
      },
      {
        desc: '供应商（主体总部）',
        field: 'supplier_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '商圈',
        field: 'biz_district_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '成本中心归属类型 1 项目(平台） 2 项目主体总部（供应商） 3 城市 4 商圈',
        field: 'cost_center_type',
        required: false,
        type: 'int',
      },
      {
        desc: '分摊金额(分)',
        field: 'money',
        required: true,
        type: 'int',
      },
      {
        desc: '状态(1 init 10 待记账 90 记账中 100 记账完成）',
        field: 'book_state',
        required: false,
        type: 'int',
      },
      {
        desc: '单据状态 -100 删除 50 进行中 100 审批完成  1 待提交',
        field: 'state',
        required: false,
        type: 'int',
      },
      {
        desc: '创建时间',
        field: 'created_at',
        required: true,
        type: 'datetime',
      },
    ],
  },
  {
    desc: 'OA成本费用记账明细',
    obj: 'OaCostBookLog',
    struct: [
      {
        desc: '流水号',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '科目ID',
        field: 'accounting_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '所属成本记录',
        field: 'cost_order_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '成本分配记录',
        field: 'oa_cost_allocation_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '归属对象(供应商/城市/商圈/平台）ID',
        field: 'cost_target_id',
        required: false,
        type: 'None',
      },
      {
        desc: '金额(分)',
        field: 'money',
        required: true,
        type: 'int',
      },
      {
        desc: '记账时间',
        field: 'book_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '记账年（2018）',
        field: 'book_year',
        required: false,
        type: 'int',
      },
      {
        desc: '记账月份（201808）',
        field: 'book_month',
        required: false,
        type: 'int',
      },
      {
        desc: '记账日期（20180801）',
        field: 'book_day',
        required: false,
        type: 'int',
      },
    ],
  },
  {
    desc: 'OA成本费用月度汇总表',
    obj: 'OaCostBookMonth',
    struct: [
      {
        desc: '流水号',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '归属对象(供应商/城市/商圈/平台）ID',
        field: 'cost_target_id',
        required: false,
        type: 'None',
      },
      {
        desc: '记账月份（201808）',
        field: 'book_month',
        required: false,
        type: 'int',
      },
      {
        desc: '汇总金额',
        field: 'money',
        required: false,
        type: 'int',
      },
      {
        desc: '更新时间',
        field: 'update_at',
        required: true,
        type: 'datetime',
      },
    ],
  },
  {
    desc: '收款人信息名录',
    obj: 'OaPayeeBook',
    struct: [
      {
        desc: '_ID',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '快捷代码',
        field: 'code',
        required: false,
        type: 'string',
      },
      {
        desc: '收款人姓名',
        field: 'card_name',
        required: false,
        type: 'string',
      },
      {
        desc: '收款人姓名',
        field: 'card_num',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '开户行等详细信息',
        field: 'bank_details',
        required: false,
        type: 'string',
      },
      {
        desc: '平台',
        field: 'platform_codes',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '供应商',
        field: 'supplier_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '开户行等详细信息',
        field: 'biz_district_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '城市',
        field: 'city_codes',
        required: false,
        type: '[basestring]',
      },
    ],
  },
  {
    desc: '成本费用记录',
    obj: 'OaCostOrder',
    struct: [
      {
        desc: '流水号',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '供应商ID',
        field: 'supplier_ids',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '平台CODE',
        field: 'platform_codes',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '城市全拼列表',
        field: 'city_codes',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '商圈列表',
        field: 'biz_district_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '单据状态 -101 删除 10 进行中 100 完成 1 待提交 -100 关闭',
        field: 'state',
        required: false,
        type: 'int',
      },
      {
        desc: '打款状态 100:已打款  -1:异常  1:未处理',
        field: 'paid_state',
        required: false,
        type: 'int',
      },
      {
        desc: '打款备注',
        field: 'paid_note',
        required: false,
        type: 'string',
      },
      {
        desc: '提报人ID',
        field: 'apply_account_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '归属审批单ID',
        field: 'application_order_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '发票标记(true 有 false 无)',
        field: 'invoice_flag',
        required: false,
        type: 'bool',
      },
      {
        desc: '备注',
        field: 'note',
        required: false,
        type: 'string',
      },
      {
        desc: '附件地址列表',
        field: 'attachments',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '用途',
        field: 'usage',
        required: false,
        type: 'string',
      },
      {
        desc: '收款人信息',
        field: 'payee_info',
        required: false,
        type: 'dict',
      },
      {
        desc: '总金额（支付报销金额)',
        field: 'total_money',
        required: false,
        type: 'int',
      },
      {
        desc: '费用分组ID',
        field: 'cost_group_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '费用科目ID',
        field: 'cost_accounting_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '费用科目编码',
        field: 'cost_accounting_code',
        required: false,
        type: 'string',
      },
      {
        desc: '成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目',
        field: 'cost_center_type',
        required: false,
        type: 'int',
      },
      {
        desc: '成本归属分摊模式（ 6 平均分摊 8 自定义分摊）',
        field: 'allocation_mode',
        required: false,
        type: 'int',
      },
      {
        desc: '成本归属分摊明细',
        field: 'cost_allocation_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '业务附加信息: 房屋租赁合同ID',
        field: 'biz_extra_house_contract_id',
        required: false,
        type: 'object_id',
      },
      {
        desc: '未归类的业务附加信息',
        field: 'biz_extra_data',
        required: false,
        type: 'dict',
      },
      {
        desc: '更新时间',
        field: 'updated_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '创建时间',
        field: 'created_at',
        required: true,
        type: 'datetime',
      },
      {
        desc: '付款完成时间',
        field: 'paid_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '完成时间',
        field: 'done_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '关闭时间',
        field: 'closed_at',
        required: false,
        type: 'datetime',
      },
    ],
  },
  {
    desc: 'OA审批流节点',
    obj: 'OaApplicationFlowNode',
    struct: [
      {
        desc: '_id',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '节点名称',
        field: 'name',
        required: true,
        type: 'string',
      },
      {
        desc: '所属审批流ID',
        field: 'parent_template_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '节点审批人',
        field: 'account_ids',
        required: true,
        type: '[ObjectId]',
      },
      {
        desc: '节点审批模式： 10 所有审批人全部审批  20 任意审批人审批',
        field: 'approve_mode',
        required: true,
        type: 'int',
      },
      {
        desc: '特殊节点标记: 是否为支付节点. 支付节点可以变更费用的付款状态。',
        field: 'is_payment_node',
        required: false,
        type: 'bool',
      },
      {
        desc: '是否可修改提报的费用记录',
        field: 'can_update_cost_record',
        required: false,
        type: 'bool',
      },
      {
        desc: '费用记录修改规则: 无限制: 0,  向下:-1,  向上:1',
        field: 'cost_update_rule',
        required: true,
        type: 'int',
      },
      {
        desc: '流程节点索引序号， 0 开始',
        field: 'index_num',
        required: false,
        type: 'int',
      },
    ],
  },
  {
    desc: 'OA审批流模板',
    obj: 'OaApplicationFlowTemplate',
    struct: [
      {
        desc: '_id',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '名称',
        field: 'name',
        required: true,
        type: 'string',
      },
      {
        desc: '创建人ID',
        field: 'creator_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '工作流业务分类  1 成本审批流  90 非成本审批流',
        field: 'biz_type',
        required: false,
        type: 'int',
      },
      {
        desc: '审批流程，节点列表',
        field: 'flow_nodes',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '模版说明',
        field: 'note',
        required: false,
        type: 'string',
      },
      {
        desc: '状态 -100 删除 -1 停用 100 正常 1 草稿',
        field: 'state',
        required: true,
        type: 'int',
      },
      {
        desc: '限定仅用于本审批流的费用分组类型ID',
        field: 'cost_catalog_scope',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '限定不可用于本审批流的费用分组类型ID',
        field: 'exclude_cost_catalog_scope',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '城市',
        field: 'city_codes',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '平台（项目）',
        field: 'platform_codes',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '供应商（主体总部）',
        field: 'supplier_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '商圈',
        field: 'biz_district_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '前端UI表单选项: {form_template: "form_template_id", cost_forms: {cost_group_id: "form_template_id"} }',
        field: 'extra_ui_options',
        required: false,
        type: 'dict',
      },
      {
        desc: '更新时间',
        field: 'updated_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '创建时间',
        field: 'created_at',
        required: false,
        type: 'datetime',
      },
    ],
  },
  {
    desc: 'OA申请审批单',
    obj: 'OaApplicationOrder',
    struct: [
      {
        desc: '流水号',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '城市',
        field: 'city_codes',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '平台（项目）',
        field: 'platform_codes',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '供应商（主体总部）',
        field: 'supplier_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '商圈',
        field: 'biz_district_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '申请人ID',
        field: 'apply_account_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '审批流程ID',
        field: 'flow_id',
        required: true,
        type: 'object_id',
      },
      {
        desc: '本审批流可审核操作（通过/驳回）的全部人员列表',
        field: 'operate_accounts',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '可前节点可审核操作（通过/驳回）的人员列表',
        field: 'current_operate_accounts',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '审批抄送过的人员列表',
        field: 'cc_accounts',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '当前等待处理的人员账号列表',
        field: 'current_pending_accounts',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '当前审批流已经手操作的人员账号列表（包括审批和补充）',
        field: 'flow_accounts',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '当前进行的审批记录ID列表(可能有多个）',
        field: 'current_record_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '当前审批节点ID, None 代表是提报节点',
        field: 'current_flow_node',
        required: false,
        type: 'object_id',
      },
      {
        desc: '流程状态: 1 => 待提交 10 => 审批流进行中 100 => 流程完成 -100=> 流程关闭 -101 删除',
        field: 'state',
        required: false,
        type: 'int',
      },
      {
        desc: '当前节点最近一次业务审批状态: 1 => 待处理（首次未提交） 10 => 待补充 50 => 异常 100 => 通过 -100 => 驳回',
        field: 'biz_state',
        required: false,
        type: 'int',
      },
      {
        desc: '当前节点的催办状态: true 已催办 false 未催办',
        field: 'urge_state',
        required: false,
        type: 'bool',
      },
      {
        desc: '本次审批的费用单ID',
        field: 'cost_order_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '本次申请的总金额',
        field: 'total_money',
        required: false,
        type: 'int',
      },
      {
        desc: '打款状态 100:已打款  -1:异常  1:未处理',
        field: 'paid_state',
        required: false,
        type: 'int',
      },
      {
        desc: '打款备注',
        field: 'paid_note',
        required: false,
        type: 'string',
      },
      {
        desc: '附件地址',
        field: 'attachments',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '业务附加信息: 房屋租赁合同ID',
        field: 'biz_extra_house_contract_id',
        required: false,
        type: 'object_id',
      },
      {
        desc: '未归类的业务附加信息',
        field: 'biz_extra_data',
        required: false,
        type: 'dict',
      },
      {
        desc: '创建时间',
        field: 'created_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '更新时间',
        field: 'updated_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '提交时间(成本归属时间）',
        field: 'submit_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '完成时间',
        field: 'done_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '关闭时间',
        field: 'closed_at',
        required: false,
        type: 'datetime',
      },
    ],
  },
  {
    desc: 'OA审批单流转明细记录',
    obj: 'OaApplicationOrderFlowRecord',
    struct: [
      {
        desc: 'ID',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: 'OA申请审批单ID',
        field: 'order_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '审批流程ID',
        field: 'flow_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '归属流程节点序号, 0 代表是首个提报记录',
        field: 'index_num',
        required: true,
        type: 'int',
      },
      {
        desc: '被驳回记录: 用于驳回，记录驳回的源审批记录ID',
        field: 'reject_source_record_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '被驳回节点: 用于驳回，记录驳回的源审批记录节点ID',
        field: 'reject_source_node_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '驳回至新记录: 用于驳回，记录驳回后的返回的目标审批记录ID, 一条或多条',
        field: 'reject_to_record_id',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '驳回至节点: 用于驳回，记录驳回后的返回的目标节点ID',
        field: 'reject_to_node_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '审批状态： 1 待处理 100 通过 -100 驳回 -101 关闭',
        field: 'state',
        required: false,
        type: 'int',
      },
      {
        desc: '当前节点的催办状态: true 已催办 false 未催办',
        field: 'urge_state',
        required: false,
        type: 'bool',
      },
      {
        desc: '催办记录ID',
        field: 'urge_record_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '操作说明',
        field: 'note',
        required: false,
        type: 'string',
      },
      {
        desc: '审批流程节点ID: 提报记录节点为 None',
        field: 'node_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '当前记录可审批人员ID列表',
        field: 'operate_accounts',
        required: true,
        type: '[ObjectId]',
      },
      {
        desc: '当前记录抄送参与人员',
        field: 'cc_accounts',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '实际审批操作人员ID',
        field: 'account_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '实际审批操作时间',
        field: 'operated_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '创建时间',
        field: 'created_at',
        required: false,
        type: 'datetime',
      },
    ],
  },
  {
    desc: 'OA审批单流转补充说明',
    obj: 'OaApplicationOrderFlowExtra',
    struct: [
      {
        desc: '_ID',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '所属OA审批单流转明细记录ID',
        field: 'record_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '附件',
        field: 'attachemnts',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '说明',
        field: 'content',
        required: false,
        type: 'string',
      },
      {
        desc: '创建人',
        field: 'creator_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '创建时间',
        field: 'created_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '文件列表',
        field: 'file_list',
        required: false,
        type: '[string]',
      },
      {
        desc: '状态',
        field: 'state',
        required: false,
        type: 'int',
      },
      {
        desc: '操作人信息',
        field: 'creator_info',
        required: false,
        type: 'dict',
      }
    ],
  },
  {
    desc: '催办记录',
    obj: 'OaApplicationUrgeRecord',
    struct: [
      {
        desc: '_id',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: 'OA申请审批单ID',
        field: 'order_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '审批流程ID',
        field: 'flow_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '审批流程节点ID',
        field: 'node_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: 'OA审批单流转明细记录ID',
        field: 'flow_record_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '发起人id',
        field: 'created_by',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '催办对象(审批人) 可多人',
        field: 'notify_account',
        required: true,
        type: '[ObjectId]',
      },
      {
        desc: '1 未处理 100 已办理 -100 关闭',
        field: 'state',
        required: false,
        type: 'int',
      },
      {
        desc: '创建时间',
        field: 'created_at',
        required: true,
        type: 'datetime',
      },
      {
        desc: '更新时间',
        field: 'updated_at',
        required: false,
        type: 'datetime',
      },
    ],
  },
  {
    desc: '房屋租赁合同/记录',
    obj: 'OaHouseContract',
    struct: [
      {
        desc: '合同编号',
        field: '_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '存量合同补录模式',
        field: 'migrate_flag',
        required: false,
        type: 'bool',
      },
      {
        desc: '存量合同原OA审批单号或其他审批信息',
        field: 'migrate_oa_note',
        required: false,
        type: 'string',
      },
      {
        desc: '面积',
        field: 'area',
        required: false,
        type: 'string',
      },
      {
        desc: '用途',
        field: 'usage',
        required: false,
        type: 'string',
      },
      {
        desc: '合同租期起始时间, YYYY-MM-DD',
        field: 'contract_start_date',
        required: false,
        type: 'string',
      },
      {
        desc: '合同租期结束时间, YYYY-MM-DD',
        field: 'contract_end_date',
        required: false,
        type: 'string',
      },
      {
        desc: '成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目',
        field: 'cost_center_type',
        required: false,
        type: 'int',
      },
      {
        desc: '执行状态 1(待提交/草稿) 10（审批中）50(执行中)  100(完成) -100(终止) -101 (删除)',
        field: 'state',
        required: true,
        type: 'int',
      },
      {
        desc: '特殊业务申请状态: 0 无特殊业务 11 续租申请中  12 断租申请中 13 退租申请中',
        field: 'biz_state',
        required: true,
        type: 'int',
      },
      {
        desc: '城市全拼',
        field: 'city_codes',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '供应商ID',
        field: 'supplier_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '平台CODE',
        field: 'platform_codes',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '商圈列表',
        field: 'biz_district_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '分摊明细对象[{platform_code, city_code, supplier_id, biz_district_id}]',
        field: 'cost_allocations',
        required: false,
        type: '[dict]',
      },
      {
        desc: '成本归属分摊模式（6 平均分摊）',
        field: 'allocation_mode',
        required: false,
        type: 'int',
      },
      {
        desc: '月租金（分）',
        field: 'month_money',
        required: false,
        type: 'int',
      },
      {
        desc: '租金是否开票',
        field: 'rent_invoice_flag',
        required: false,
        type: 'bool',
      },
      {
        desc: '租金科目ID',
        field: 'rent_accounting_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '每次付款月数',
        field: 'period_month_num',
        required: false,
        type: 'int',
      },
      {
        desc: '单次/续租付款金额, 分',
        field: 'period_money',
        required: false,
        type: 'int',
      },
      {
        desc: '录入时已经支付租金月数',
        field: 'init_paid_month_num',
        required: false,
        type: 'int',
      },
      {
        desc: '录入时已经支付租金金额',
        field: 'init_paid_money',
        required: false,
        type: 'int',
      },
      {
        desc: '提前多少天提醒申请租金续租',
        field: 'schedule_prepare_days',
        required: false,
        type: 'int',
      },
      {
        desc: '租金收款人信息',
        field: 'rent_payee_info',
        required: false,
        type: 'dict',
      },
      {
        desc: '押金 分',
        field: 'pledge_money',
        required: false,
        type: 'int',
      },
      {
        desc: '押金是否开票',
        field: 'pledge_invoice_flag',
        required: false,
        type: 'bool',
      },
      {
        desc: '押金科目ID',
        field: 'pledge_accounting_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '押金收款人信息',
        field: 'pledge_payee_info',
        required: false,
        type: 'dict',
      },
      {
        desc: '中介费',
        field: 'agent_money',
        required: false,
        type: 'int',
      },
      {
        desc: '中介费是否开票',
        field: 'agent_invoice_flag',
        required: false,
        type: 'bool',
      },
      {
        desc: '中介费科目ID',
        field: 'agent_accounting_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '中介费收款人信息',
        field: 'agent_payee_info',
        required: false,
        type: 'dict',
      },
      {
        desc: '备注',
        field: 'note',
        required: false,
        type: 'string',
      },
      {
        desc: '房屋断租日期时间（YYYY-MM-DD）',
        field: 'break_date',
        required: false,
        type: 'string',
      },
      {
        desc: '实际退租/断退回押金',
        field: 'pledge_return_money',
        required: false,
        type: 'int',
      },
      {
        desc: '退/断租押金损失',
        field: 'pledge_lost_money',
        required: false,
        type: 'int',
      },
      {
        desc: '退/断租押金损失科目ID',
        field: 'lost_accounting_id',
        required: false,
        type: 'int',
      },
      {
        desc: '附件地址列表',
        field: 'attachments',
        required: false,
        type: '[basestring]',
      },
      {
        desc: '记录下一次续租时间',
        field: 'next_pay_time',
        required: false,
        type: 'datetime',
      },
      {
        desc: '合约计划付款次数',
        field: 'plan_total_pay_num',
        required: false,
        type: 'int',
      },
      {
        desc: '合约租金总金额',
        field: 'plan_total_money',
        required: false,
        type: 'int',
      },
      {
        desc: '合约已支付租金总金额',
        field: 'plan_paid_money',
        required: false,
        type: 'int',
      },
      {
        desc: '计划未执行付款次数',
        field: 'plan_pending_pay_num',
        required: false,
        type: 'int',
      },
      {
        desc: '新租审批ID',
        field: 'init_application_order_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '断/退租付款审批ID',
        field: 'last_application_order_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '当前进行审批的审批单ID',
        field: 'current_application_order_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '关联的费用记录ID数组',
        field: 'cost_order_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '关联的审批单ID数组',
        field: 'application_order_ids',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '续签的旧合同ID',
        field: 'from_contract_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '续签的新合同ID',
        field: 'renewal_contract_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '创建人ID',
        field: 'creator_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '最近修改人',
        field: 'operator_id',
        required: false,
        type: 'ObjectId',
      },
      {
        desc: '申请通过时间(开始执行时间）',
        field: 'approved_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '创建时间',
        field: 'created_at',
        required: false,
        type: 'datetime',
      },
      {
        desc: '更新时间',
        field: 'updated_at',
        required: false,
        type: 'datetime',
      },
    ],
  },
  {
    desc: '系统消息/通知',
    obj: 'CommonMessage',
    struct: [
      {
        desc: '消息ID',
        field: '_id',
        required: true,
        type: 'ObjectId',
      },
      {
        desc: '消息总线ID',
        field: 'channel_id',
        required: true,
        type: 'string',
      },
      {
        desc: '业务模块ID',
        field: 'biz_channel_id',
        required: true,
        type: 'int',
      },
      {
        desc: '1（新）90（已送达）100（已读）-100（已删除）',
        field: 'state',
        required: true,
        type: 'int',
      },
      {
        desc: '1(全局) 10(定向)',
        field: 'broad_type',
        required: true,
        type: 'int',
      },
      {
        desc: '定向接收人账号',
        field: 'accounts',
        required: false,
        type: '[ObjectId]',
      },
      {
        desc: '消息负载',
        field: 'payload',
        required: true,
        type: 'dict',
      },
      {
        desc: '更新时间',
        field: 'updated_at',
        required: true,
        type: 'datetime',
      },
      {
        desc: '创建时间',
        field: 'created_at',
        required: true,
        type: 'datetime',
      },
    ],
  },
];
