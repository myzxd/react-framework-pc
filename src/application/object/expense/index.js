/**
 * 费用管理相关对象
 */
import CoreObject from '../core';

// OA费用分组(原费用类型）
class OaCostGroup extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.name = '';                             // 名称
    this.supplierIds = [];                      // 供应商ID
    this.accountingIds = [];                    // 费用科目ID
    this.creatorId = undefined;                 // 创建人ID
    this.state = 0;                             // 状态 -101(删除) -100(停用) 100(正常) 1(编辑)
    this.note = '';                             // 备注
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间
    this.industryCodes = undefined; // 适用场景（手动添加）
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'name',                       // 名称
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      supplier_ids: 'supplierIds',
      accounting_ids: 'accountingIds',
      creator_id: 'creatorId',
      state: 'state',
      note: 'note',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
      industry_codes: 'industryCodes',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      supplierIds: 'supplier_ids',
      accountingIds: 'accounting_ids',
      creatorId: 'creator_id',
      state: 'state',
      note: 'note',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      industryCodes: 'industry_codes',
    };
  }
}

// OA成本费用会计科目表
class OaCostAccounting extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.code = '';                             // 快捷别名
    this.accountingCode = '';                   // 会计科目编码
    this.name = '';                             // 名称
    this.level = 0;                             // 级别 1、2、3
    this.costCenterType = 0;                    // 成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目
    this.parentId = undefined;                  // 上级科目ID
    this.creatorId = undefined;                 // 创建人账户ID
    this.description = '';                      // 描述
    this.state = 0;                             // 状态 -101 删除 -100 停用 100 正常 1 编辑
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间
    this.costFlag = false;                      // 是否成本类
    this.industryCodes = undefined; // 适用场景（手动添加）
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'accountingCode',             // 会计科目编码
      'name',                       // 名称
      'level',                      // 级别 1、2、3
      'costCenterType',             // 成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目
      'state',                      // 状态 -101 删除 -100 停用 100 正常 1 编辑
      'costFlag',                   // 是否成本类
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      code: 'code',
      accounting_code: 'accountingCode',
      name: 'name',
      level: 'level',
      cost_center_type: 'costCenterType',
      parent_id: 'parentId',
      creator_id: 'creatorId',
      description: 'description',
      state: 'state',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
      cost_flag: 'costFlag',
      industry_codes: 'industryCodes',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      code: 'code',
      accountingCode: 'accounting_code',
      name: 'name',
      level: 'level',
      costCenterType: 'cost_center_type',
      parentId: 'parent_id',
      creatorId: 'creator_id',
      description: 'description',
      state: 'state',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      costFlag: 'cost_flag',
      industryCodes: 'industry_codes',
    };
  }
}

// OA成本费用记录分摊明细表(分摊记录)
class OaCostAllocation extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // 流水号
    this.costOrderId = undefined;               // 所属成本记录
    this.cityCode = '';                         // 城市
    this.platformCode = '';                     // 平台（项目）
    this.supplierId = undefined;                // 供应商（主体总部）
    this.bizDistrictId = undefined;             // 商圈
    this.costCenterType = 0;                    // 成本中心归属类型 1 项目(平台） 2 项目主体总部（供应商） 3 城市 4 商圈
    this.money = 0;                             // 分摊金额(分)
    this.bookState = 0;                         // 状态(1 init 10 待记账 90 记账中 100 记账完成）
    this.state = 0;                             // 单据状态 -100 删除 50 进行中 100 审批完成  1 待提交
    this.createdAt = undefined;                 // 创建时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // 流水号
      'costOrderId',                // 所属成本记录
      'money',                      // 分摊金额(分)
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      cost_order_id: 'costOrderId',
      city_code: 'cityCode',
      platform_code: 'platformCode',
      supplier_id: 'supplierId',
      biz_district_id: 'bizDistrictId',
      cost_center_type: 'costCenterType',
      money: 'money',
      book_state: 'bookState',
      state: 'state',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      costOrderId: 'cost_order_id',
      cityCode: 'city_code',
      platformCode: 'platform_code',
      supplierId: 'supplier_id',
      bizDistrictId: 'biz_district_id',
      costCenterType: 'cost_center_type',
      money: 'money',
      bookState: 'book_state',
      state: 'state',
      createdAt: 'created_at',
    };
  }
}

// OA成本费用记账明细
class OaCostBookLog extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // 流水号
    this.accountingId = undefined;              // 科目ID
    this.costOrderId = undefined;               // 所属成本记录
    this.oaCostAllocationId = undefined;        // 成本分配记录
    this.costTargetId = undefined;              // 归属对象(供应商/城市/商圈/平台）ID
    this.money = 0;                             // 金额(分)
    this.bookAt = undefined;                    // 记账时间
    this.bookYear = 0;                          // 记账年（2018）
    this.bookMonth = 0;                         // 记账月份（201808）
    this.bookDay = 0;                           // 记账日期（20180801）
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // 流水号
      'accountingId',               // 科目ID
      'costOrderId',                // 所属成本记录
      'oaCostAllocationId',         // 成本分配记录
      'money',                      // 金额(分)
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      accounting_id: 'accountingId',
      cost_order_id: 'costOrderId',
      oa_cost_allocation_id: 'oaCostAllocationId',
      cost_target_id: 'costTargetId',
      money: 'money',
      book_at: 'bookAt',
      book_year: 'bookYear',
      book_month: 'bookMonth',
      book_day: 'bookDay',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      accountingId: 'accounting_id',
      costOrderId: 'cost_order_id',
      oaCostAllocationId: 'oa_cost_allocation_id',
      costTargetId: 'cost_target_id',
      money: 'money',
      bookAt: 'book_at',
      bookYear: 'book_year',
      bookMonth: 'book_month',
      bookDay: 'book_day',
    };
  }
}

// OA成本费用月度汇总表
class OaCostBookMonth extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // 流水号
    this.costTargetId = undefined;              // 归属对象(供应商/城市/商圈/平台）ID
    this.bookMonth = 0;                         // 记账月份（201808）
    this.money = 0;                             // 汇总金额
    this.updateAt = undefined;                  // 更新时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // 流水号
      'updateAt',                   // 更新时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      cost_target_id: 'costTargetId',
      book_month: 'bookMonth',
      money: 'money',
      update_at: 'updateAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      costTargetId: 'cost_target_id',
      bookMonth: 'book_month',
      money: 'money',
      updateAt: 'update_at',
    };
  }
}

// 收款人信息名录
class OaPayeeBook extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _ID
    this.code = '';                             // 快捷代码
    this.cardName = '';                         // 收款人姓名
    this.cardNum = undefined;                   // 收款人姓名
    this.bankDetails = '';                      // 开户行等详细信息
    this.platformCodes = [];                    // 平台
    this.supplierIds = [];                      // 供应商
    this.bizDistrictIds = [];                   // 开户行等详细信息
    this.cityCodes = [];                        // 城市
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _ID
      'cardNum',                    // 收款人姓名
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      code: 'code',
      card_name: 'cardName',
      card_num: 'cardNum',
      bank_details: 'bankDetails',
      platform_codes: 'platformCodes',
      supplier_ids: 'supplierIds',
      biz_district_ids: 'bizDistrictIds',
      city_codes: 'cityCodes',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      code: 'code',
      cardName: 'card_name',
      cardNum: 'card_num',
      bankDetails: 'bank_details',
      platformCodes: 'platform_codes',
      supplierIds: 'supplier_ids',
      bizDistrictIds: 'biz_district_ids',
      cityCodes: 'city_codes',
    };
  }
}

// 成本费用记录
class OaCostOrder extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // 流水号
    this.supplierIds = [];                      // 供应商ID
    this.platformCodes = [];                    // 平台CODE
    this.cityCodes = [];                        // 城市全拼列表
    this.bizDistrictIds = [];                   // 商圈列表
    this.state = 0;                             // 单据状态 -101 删除 10 进行中 100 完成 1 待提交 -100 关闭
    this.paidState = 0;                         // 打款状态 100:已打款  -1:异常  1:未处理
    this.paidNote = '';                         // 打款备注
    this.applyAccountId = undefined;            // 提报人ID
    this.applicationOrderId = undefined;        // 归属审批单ID
    this.invoiceFlag = false;                   // 发票标记(true 有 false 无)
    this.note = '';                             // 备注
    this.attachments = [];                      // 附件地址列表
    this.usage = '';                            // 用途
    this.payeeInfo = {};                        // 收款人信息
    this.totalMoney = 0;                        // 总金额（支付报销金额)
    this.costGroupId = undefined;               // 费用分组ID
    this.costAccountingId = undefined;          // 费用科目ID
    this.costAccountingCode = '';               // 费用科目编码
    this.costCenterType = 0;                    // 成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目
    this.allocationMode = 0;                    // 成本归属分摊模式（ 6 平均分摊 8 自定义分摊）
    this.costAllocationIds = [];                // 成本归属分摊明细
    this.bizExtraHouseContractId = undefined;   // 业务附加信息: 房屋租赁合同ID
    this.bizExtraData = {};                     // 未归类的业务附加信息
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间
    this.paidAt = undefined;                    // 付款完成时间
    this.doneAt = undefined;                    // 完成时间
    this.closedAt = undefined;                  // 关闭时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // 流水号
      'applyAccountId',             // 提报人ID
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      supplier_ids: 'supplierIds',
      platform_codes: 'platformCodes',
      city_codes: 'cityCodes',
      biz_district_ids: 'bizDistrictIds',
      state: 'state',
      paid_state: 'paidState',
      paid_note: 'paidNote',
      apply_account_id: 'applyAccountId',
      application_order_id: 'applicationOrderId',
      invoice_flag: 'invoiceFlag',
      note: 'note',
      attachments: 'attachments',
      usage: 'usage',
      payee_info: 'payeeInfo',
      total_money: 'totalMoney',
      cost_group_id: 'costGroupId',
      cost_accounting_id: 'costAccountingId',
      cost_accounting_code: 'costAccountingCode',
      cost_center_type: 'costCenterType',
      allocation_mode: 'allocationMode',
      cost_allocation_ids: 'costAllocationIds',
      biz_extra_house_contract_id: 'bizExtraHouseContractId',
      biz_extra_data: 'bizExtraData',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
      paid_at: 'paidAt',
      done_at: 'doneAt',
      closed_at: 'closedAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      supplierIds: 'supplier_ids',
      platformCodes: 'platform_codes',
      cityCodes: 'city_codes',
      bizDistrictIds: 'biz_district_ids',
      state: 'state',
      paidState: 'paid_state',
      paidNote: 'paid_note',
      applyAccountId: 'apply_account_id',
      applicationOrderId: 'application_order_id',
      invoiceFlag: 'invoice_flag',
      note: 'note',
      attachments: 'attachments',
      usage: 'usage',
      payeeInfo: 'payee_info',
      totalMoney: 'total_money',
      costGroupId: 'cost_group_id',
      costAccountingId: 'cost_accounting_id',
      costAccountingCode: 'cost_accounting_code',
      costCenterType: 'cost_center_type',
      allocationMode: 'allocation_mode',
      costAllocationIds: 'cost_allocation_ids',
      bizExtraHouseContractId: 'biz_extra_house_contract_id',
      bizExtraData: 'biz_extra_data',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      paidAt: 'paid_at',
      doneAt: 'done_at',
      closedAt: 'closed_at',
    };
  }
}

// OA审批流节点
class OaApplicationFlowNode extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.name = '';                             // 节点名称
    this.parentTemplateId = undefined;          // 所属审批流ID
    this.accountIds = [];                       // 节点审批人
    this.approveMode = 0;                       // 节点审批模式： 10 所有审批人全部审批  20 任意审批人审批
    this.isPaymentNode = false;                 // 特殊节点标记: 是否为支付节点. 支付节点可以变更费用的付款状态。
    this.canUpdateCostRecord = false;           // 是否可修改提报的费用记录
    this.costUpdateRule = 0;                    // 费用记录修改规则: 无限制: 0,  向下:-1,  向上:1
    this.indexNum = 0;                          // 流程节点索引序号， 0 开始
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'name',                       // 节点名称
      'parentTemplateId',           // 所属审批流ID
      'accountIds',                 // 节点审批人
      'approveMode',                // 节点审批模式： 10 所有审批人全部审批  20 任意审批人审批
      'costUpdateRule',             // 费用记录修改规则: 无限制: 0,  向下:-1,  向上:1
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      parent_template_id: 'parentTemplateId',
      account_ids: 'accountIds',
      approve_mode: 'approveMode',
      is_payment_node: 'isPaymentNode',
      can_update_cost_record: 'canUpdateCostRecord',
      cost_update_rule: 'costUpdateRule',
      index_num: 'indexNum',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      parentTemplateId: 'parent_template_id',
      accountIds: 'account_ids',
      approveMode: 'approve_mode',
      isPaymentNode: 'is_payment_node',
      canUpdateCostRecord: 'can_update_cost_record',
      costUpdateRule: 'cost_update_rule',
      indexNum: 'index_num',
    };
  }
}

// OA审批流模板
class OaApplicationFlowTemplate extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.name = '';                             // 名称
    this.creatorId = undefined;                 // 创建人ID
    this.bizType = 0;                           // 工作流业务分类  1 成本审批流  90 非成本审批流
    this.flowNodes = [];                        // 审批流程，节点列表
    this.note = '';                             // 模版说明
    this.state = 0;                             // 状态 -100 删除 -1 停用 100 正常 1 草稿
    this.costCatalogScope = [];                 // 限定仅用于本审批流的费用分组类型ID
    this.excludeCostCatalogScope = [];          // 限定不可用于本审批流的费用分组类型ID
    this.cityCodes = [];                        // 城市
    this.platformCodes = [];                    // 平台（项目）
    this.supplierIds = [];                      // 供应商（主体总部）
    this.bizDistrictIds = [];                   // 商圈
    this.extraUiOptions = {};                   // 前端UI表单选项: {form_template: "form_template_id", cost_forms: {cost_group_id: "form_template_id"} }
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间

    this.applyRanks = undefined; // 事务性审批流适用职级(手动添加)

    this.applyApplicationTypes = undefined; // 审批流适用场景
    this.industryCodes = undefined; // 适用场景（手动添加）
    this.applyRanks = undefined; // 职级（手动添加）
    this.applicationRule = undefined; // 合并审批规则（手动添加）
    this.finalType = undefined; // 最高审批岗位类型（手动添加）
    this.finalApprovalJobTags = undefined; // 最高审批岗位标签（手动添加）
    this.finalApprovalJobIds = undefined; // 最高审批岗位岗位列表（手动添加）
    this.organization_sub_types = undefined;  // 调整子类型
    this.finalApprovalJobList = undefined; // 最高审批岗位岗位列表（手动添加）
    this.applyDepartmentIds = undefined; // 适用部门（本部门）(手动添加)
    this.applyDepartmentSubIds = undefined; // 适用部门（本加子部门）(手动添加)
    this.applyDepartmentList = undefined; // 适用部门list（本部门）(手动添加)
    this.applyDepartmentSubList = undefined; // 适用部门list（本加子部门）(手动添加)
    this.viewDepartmentIds = undefined; // 可见范围ids（本部门）（手动添加）
    this.viewDepartmentSubIds = undefined; // 可见范围ids（本加子部门）（手动添加）
    this.viewDepartmentJobIds = undefined; // 可见范围ids（岗位关系id）（手动添加）
    this.viewDepartmentList = undefined; // 可见范围list（本部门）(手动添加)
    this.viewDepartmentSubList = undefined; // 可见范围list（本加子部门）(手动添加)
    this.viewDepartmentJobList = undefined; // 可见范围list（岗位关系id）(手动添加)
    this.sealTypes = undefined; // 印章类型（用章、借章提报用）
    this.certNature = undefined; // 证照借用类型（证照借用提报用）
    this.pactBorrowType = undefined; // 合同借阅类型（合同借阅提报用）
    this.pactTypes = undefined;  //合同类型
    this.pactBorrowTypes=undefined; // 合同借阅类型
    this.displayTypes=undefined; // 证照借用类型
    this.stampTypes=undefined; //合同会审类型
    this.pactSubTypes=undefined;//合同子类型
    this.pactApplyTypes=undefined;//合同类型
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'name',                       // 名称
      'creatorId',                  // 创建人ID
      'state',                      // 状态 -100 删除 -1 停用 100 正常 1 草稿
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      creator_id: 'creatorId',
      biz_type: 'bizType',
      flow_nodes: 'flowNodes',
      note: 'note',
      state: 'state',
      cost_catalog_scope: 'costCatalogScope',
      exclude_cost_catalog_scope: 'excludeCostCatalogScope',
      city_codes: 'cityCodes',
      platform_codes: 'platformCodes',
      supplier_ids: 'supplierIds',
      biz_district_ids: 'bizDistrictIds',
      extra_ui_options: 'extraUiOptions',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
      apply_application_types: 'applyApplicationTypes',
      apply_ranks: 'applyRanks',
      apply_application_types: 'applyApplicationTypes',
      industry_codes: 'industryCodes',
      apply_ranks: 'applyRanks',
      application_rule: 'applicationRule',
      final_type: 'finalType',
      final_approval_job_tags: 'finalApprovalJobTags',
      final_approval_job_ids: 'finalApprovalJobIds',
      organization_sub_types: 'organization_sub_types',
      final_approval_job_list: 'finalApprovalJobList',
      apply_department_ids: 'applyDepartmentIds',
      apply_department_sub_ids: 'applyDepartmentSubIds',
      apply_department_list: 'applyDepartmentList',
      apply_department_sub_list: 'applyDepartmentSubList',
      view_department_ids: 'viewDepartmentIds',
      view_department_sub_ids: 'viewDepartmentSubIds',
      view_department_job_ids: 'viewDepartmentJobIds',
      view_department_list: 'viewDepartmentList',
      view_department_sub_list: 'viewDepartmentSubList',
      view_department_job_list: 'viewDepartmentJobList',
      seal_types: 'sealTypes',
      cert_nature: 'certNature',
      pact_borrow_type: 'pactBorrowType',
      pact_types: 'pactTypes',
      pact_borrow_types:'pactBorrowTypes',
      display_types:'displayTypes',
      stamp_types:'stampTypes',
      pact_sub_types:'pactSubTypes',
      pact_apply_types:'pactApplyTypes',      

    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      creatorId: 'creator_id',
      bizType: 'biz_type',
      flowNodes: 'flow_nodes',
      note: 'note',
      state: 'state',
      costCatalogScope: 'cost_catalog_scope',
      excludeCostCatalogScope: 'exclude_cost_catalog_scope',
      cityCodes: 'city_codes',
      platformCodes: 'platform_codes',
      supplierIds: 'supplier_ids',
      bizDistrictIds: 'biz_district_ids',
      extraUiOptions: 'extra_ui_options',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      applyApplicationTypes: 'apply_application_types',
      applyRanks: 'apply_ranks',
      applyApplicationTypes: 'apply_application_types',
      industryCodes: 'industry_codes',
      applyRanks: 'apply_ranks',
      applicationRule: 'application_rule',
      finalType: 'final_type',
      finalApprovalJobTags: 'final_approval_job_tags',
      finalApprovalJobIds: 'final_approval_job_ids',
      organization_sub_types: 'organization_sub_types',
      finalApprovalJobList: 'final_approval_job_list',
      applyDepartmentIds: 'apply_department_ids',
      applyDepartmentSubIds: 'apply_department_sub_ids',
      applyDepartmentList: 'apply_department_list',
      applyDepartmentSubList: 'apply_department_sub_list',
      viewDepartmentIds: 'view_department_ids',
      viewDepartmentSubIds: 'view_department_sub_ids',
      viewDepartmentJobIds: 'view_department_job_ids',
      viewDepartmentList: 'view_department_list',
      viewDepartmentSubList: 'view_department_sub_list',
      viewDepartmentJobList: 'view_department_job_list',
      sealTypes: 'seal_types',
      certNature: 'cert_nature',
      pactBorrowType: 'pact_borrow_type',
      pactTypes: 'pact_types',
      pactBorrowTypes:'pact_borrow_types',
      displayTypes:'display_types',
      stampTypes:'stamp_types',
      pactSubTypes:'pact_sub_types',
      pactApplyTypes:'pact_apply_types',  
    };
  }
}

// OA申请审批单
class OaApplicationOrder extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // 流水号
    this.cityCodes = [];                        // 城市
    this.platformCodes = [];                    // 平台（项目）
    this.supplierIds = [];                      // 供应商（主体总部）
    this.bizDistrictIds = [];                   // 商圈
    this.applyAccountId = undefined;            // 申请人ID
    this.flowId = undefined;                    // 审批流程ID
    this.operateAccounts = [];                  // 本审批流可审核操作（通过/驳回）的全部人员列表
    this.currentOperateAccounts = [];           // 可前节点可审核操作（通过/驳回）的人员列表
    this.ccAccounts = [];                       // 审批抄送过的人员列表
    this.currentPendingAccounts = [];           // 当前等待处理的人员账号列表
    this.flowAccounts = [];                     // 当前审批流已经手操作的人员账号列表（包括审批和补充）
    this.currentRecordIds = [];                 // 当前进行的审批记录ID列表(可能有多个）
    this.currentFlowNode = undefined;           // 当前审批节点ID, None 代表是提报节点
    this.state = 0;                             // 流程状态: 1 => 待提交 10 => 审批流进行中 100 => 流程完成 -100=> 流程关闭 -101 删除
    this.bizState = 0;                          // 当前节点最近一次业务审批状态: 1 => 待处理（首次未提交） 10 => 待补充 50 => 异常 100 => 通过 -100 => 驳回
    this.urgeState = false;                     // 当前节点的催办状态: true 已催办 false 未催办
    this.costOrderIds = [];                     // 本次审批的费用单ID
    this.totalMoney = 0;                        // 本次申请的总金额
    this.paidState = 0;                         // 打款状态 100:已打款  -1:异常  1:未处理
    this.paidNote = '';                         // 打款备注
    this.attachments = [];                      // 附件地址
    this.bizExtraHouseContractId = undefined;   // 业务附加信息: 房屋租赁合同ID
    this.bizExtraData = {};                     // 未归类的业务附加信息
    this.createdAt = undefined;                 // 创建时间
    this.updatedAt = undefined;                 // 更新时间
    this.submitAt = undefined;                  // 提交时间(成本归属时间）
    this.doneAt = undefined;                    // 完成时间
    this.closedAt = undefined;                  // 关闭时间
    this.themeLabelList = [];                   // 主题标签
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // 流水号
      'applyAccountId',             // 申请人ID
      'flowId',                     // 审批流程ID
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      city_codes: 'cityCodes',
      platform_codes: 'platformCodes',
      supplier_ids: 'supplierIds',
      biz_district_ids: 'bizDistrictIds',
      apply_account_id: 'applyAccountId',
      flow_id: 'flowId',
      operate_accounts: 'operateAccounts',
      current_operate_accounts: 'currentOperateAccounts',
      cc_accounts: 'ccAccounts',
      current_pending_accounts: 'currentPendingAccounts',
      flow_accounts: 'flowAccounts',
      current_record_ids: 'currentRecordIds',
      current_flow_node: 'currentFlowNode',
      state: 'state',
      biz_state: 'bizState',
      urge_state: 'urgeState',
      cost_order_ids: 'costOrderIds',
      total_money: 'totalMoney',
      paid_state: 'paidState',
      paid_note: 'paidNote',
      attachments: 'attachments',
      biz_extra_house_contract_id: 'bizExtraHouseContractId',
      biz_extra_data: 'bizExtraData',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      submit_at: 'submitAt',
      done_at: 'doneAt',
      closed_at: 'closedAt',
      theme_label_list: 'themeLabelList',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      cityCodes: 'city_codes',
      platformCodes: 'platform_codes',
      supplierIds: 'supplier_ids',
      bizDistrictIds: 'biz_district_ids',
      applyAccountId: 'apply_account_id',
      flowId: 'flow_id',
      operateAccounts: 'operate_accounts',
      currentOperateAccounts: 'current_operate_accounts',
      ccAccounts: 'cc_accounts',
      currentPendingAccounts: 'current_pending_accounts',
      flowAccounts: 'flow_accounts',
      currentRecordIds: 'current_record_ids',
      currentFlowNode: 'current_flow_node',
      state: 'state',
      bizState: 'biz_state',
      urgeState: 'urge_state',
      costOrderIds: 'cost_order_ids',
      totalMoney: 'total_money',
      paidState: 'paid_state',
      paidNote: 'paid_note',
      attachments: 'attachments',
      bizExtraHouseContractId: 'biz_extra_house_contract_id',
      bizExtraData: 'biz_extra_data',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      submitAt: 'submit_at',
      doneAt: 'done_at',
      closedAt: 'closed_at',
      themeLabelList: 'theme_label_list',
    };
  }
}

// OA审批单流转明细记录
class OaApplicationOrderFlowRecord extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // ID
    this.orderId = undefined;                   // OA申请审批单ID
    this.flowId = undefined;                    // 审批流程ID
    this.indexNum = 0;                          // 归属流程节点序号, 0 代表是首个提报记录
    this.rejectSourceRecordId = undefined;      // 被驳回记录: 用于驳回，记录驳回的源审批记录ID
    this.rejectSourceNodeId = undefined;        // 被驳回节点: 用于驳回，记录驳回的源审批记录节点ID
    this.rejectToRecordId = [];                 // 驳回至新记录: 用于驳回，记录驳回后的返回的目标审批记录ID, 一条或多条
    this.rejectToNodeId = undefined;            // 驳回至节点: 用于驳回，记录驳回后的返回的目标节点ID
    this.state = 0;                             // 审批状态： 1 待处理 100 通过 -100 驳回 -101 关闭
    this.urgeState = false;                     // 当前节点的催办状态: true 已催办 false 未催办
    this.urgeRecordId = undefined;              // 催办记录ID
    this.note = '';                             // 操作说明
    this.nodeId = undefined;                    // 审批流程节点ID: 提报记录节点为 None
    this.operateAccounts = [];                  // 当前记录可审批人员ID列表
    this.ccAccounts = [];                       // 当前记录抄送参与人员
    this.accountId = undefined;                 // 实际审批操作人员ID
    this.operatedAt = undefined;                // 实际审批操作时间
    this.createdAt = undefined;                 // 创建时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // ID
      'orderId',                    // OA申请审批单ID
      'flowId',                     // 审批流程ID
      'indexNum',                   // 归属流程节点序号, 0 代表是首个提报记录
      'operateAccounts',            // 当前记录可审批人员ID列表
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      order_id: 'orderId',
      flow_id: 'flowId',
      index_num: 'indexNum',
      reject_source_record_id: 'rejectSourceRecordId',
      reject_source_node_id: 'rejectSourceNodeId',
      reject_to_record_id: 'rejectToRecordId',
      reject_to_node_id: 'rejectToNodeId',
      state: 'state',
      urge_state: 'urgeState',
      urge_record_id: 'urgeRecordId',
      note: 'note',
      node_id: 'nodeId',
      operate_accounts: 'operateAccounts',
      cc_accounts: 'ccAccounts',
      account_id: 'accountId',
      operated_at: 'operatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      orderId: 'order_id',
      flowId: 'flow_id',
      indexNum: 'index_num',
      rejectSourceRecordId: 'reject_source_record_id',
      rejectSourceNodeId: 'reject_source_node_id',
      rejectToRecordId: 'reject_to_record_id',
      rejectToNodeId: 'reject_to_node_id',
      state: 'state',
      urgeState: 'urge_state',
      urgeRecordId: 'urge_record_id',
      note: 'note',
      nodeId: 'node_id',
      operateAccounts: 'operate_accounts',
      ccAccounts: 'cc_accounts',
      accountId: 'account_id',
      operatedAt: 'operated_at',
      createdAt: 'created_at',
    };
  }
}

// OA审批单流转补充说明
class OaApplicationOrderFlowExtra extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _ID
    this.recordId = undefined;                  // 所属OA审批单流转明细记录ID
    this.attachemnts = [];                      // 附件
    this.content = '';                          // 说明
    this.creatorId = undefined;                 // 创建人
    this.createdAt = undefined;                 // 创建时间
    this.fileList = [];                         // 文件列表(手动添加)
    this.state = 0;                             // 状态(手动添加)
    this.creatorInfo = {};                      // 创建人信息(手动添加)
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _ID
      'recordId',                   // 所属OA审批单流转明细记录ID
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      record_id: 'recordId',
      attachemnts: 'attachemnts',
      content: 'content',
      creator_id: 'creatorId',
      created_at: 'createdAt',
      file_list: 'fileList',
      state: 'state',
      creator_info: 'creatorInfo',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      recordId: 'record_id',
      attachemnts: 'attachemnts',
      content: 'content',
      creatorId: 'creator_id',
      createdAt: 'created_at',
      fileList: 'file_list',
      state: 'state',
      creatorInfo: 'creator_info',
    };
  }
}

// 催办记录
class OaApplicationUrgeRecord extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.orderId = undefined;                   // OA申请审批单ID
    this.flowId = undefined;                    // 审批流程ID
    this.nodeId = undefined;                    // 审批流程节点ID
    this.flowRecordId = undefined;              // OA审批单流转明细记录ID
    this.createdBy = undefined;                 // 发起人id
    this.notifyAccount = [];                    // 催办对象(审批人) 可多人
    this.state = 0;                             // 1 未处理 100 已办理 -100 关闭
    this.createdAt = undefined;                 // 创建时间
    this.updatedAt = undefined;                 // 更新时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'orderId',                    // OA申请审批单ID
      'flowId',                     // 审批流程ID
      'nodeId',                     // 审批流程节点ID
      'flowRecordId',               // OA审批单流转明细记录ID
      'createdBy',                  // 发起人id
      'notifyAccount',              // 催办对象(审批人) 可多人
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      order_id: 'orderId',
      flow_id: 'flowId',
      node_id: 'nodeId',
      flow_record_id: 'flowRecordId',
      created_by: 'createdBy',
      notify_account: 'notifyAccount',
      state: 'state',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      orderId: 'order_id',
      flowId: 'flow_id',
      nodeId: 'node_id',
      flowRecordId: 'flow_record_id',
      createdBy: 'created_by',
      notifyAccount: 'notify_account',
      state: 'state',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
  }
}

// 房屋租赁合同/记录
class OaHouseContract extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // 合同编号
    this.migrateFlag = false;                   // 存量合同补录模式
    this.migrateOaNote = '';                    // 存量合同原OA审批单号或其他审批信息
    this.area = '';                             // 面积
    this.usage = '';                            // 用途
    this.contractStartDate = '';                // 合同租期起始时间, YYYY-MM-DD
    this.contractEndDate = '';                  // 合同租期结束时间, YYYY-MM-DD
    this.costCenterType = 0;                    // 成本中心归属类型 1 骑士  2商圈  3城市  4 项目主体总部  5 项目
    this.state = 0;                             // 执行状态 1(待提交/草稿) 10（审批中）50(执行中)  100(完成) -100(终止) -101 (删除)
    this.bizState = 0;                          // 特殊业务申请状态: 0 无特殊业务 11 续租申请中  12 断租申请中 13 退租申请中
    this.cityCodes = [];                        // 城市全拼
    this.supplierIds = [];                      // 供应商ID
    this.platformCodes = [];                    // 平台CODE
    this.bizDistrictIds = [];                   // 商圈列表
    this.bizDistrictNames = [];                 // 商圈名称列表
    this.costAllocations = undefined;           // 分摊明细对象[{platform_code, city_code, supplier_id, biz_district_id}]
    this.allocationMode = 0;                    // 成本归属分摊模式（6 平均分摊）
    this.monthMoney = 0;                        // 月租金（分）
    this.rentInvoiceFlag = false;               // 租金是否开票
    this.rentAccountingId = undefined;          // 租金科目ID
    this.periodMonthNum = 0;                    // 每次付款月数
    this.periodMoney = 0;                       // 单次/续租付款金额, 分
    this.initPaidMonthNum = 0;                  // 录入时已经支付租金月数
    this.initPaidMoney = 0;                     // 录入时已经支付租金金额
    this.schedulePrepareDays = 0;               // 提前多少天提醒申请租金续租
    this.rentPayeeInfo = {};                    // 租金收款人信息
    this.pledgeMoney = 0;                       // 押金 分
    this.pledgeInvoiceFlag = false;             // 押金是否开票
    this.pledgeAccountingId = undefined;        // 押金科目ID
    this.pledgePayeeInfo = {};                  // 押金收款人信息
    this.agentMoney = 0;                        // 中介费
    this.agentInvoiceFlag = false;              // 中介费是否开票
    this.agentAccountingId = undefined;         // 中介费科目ID
    this.agentPayeeInfo = {};                   // 中介费收款人信息
    this.note = '';                             // 备注
    this.breakDate = '';                        // 房屋断租日期时间（YYYY-MM-DD）
    this.pledgeReturnMoney = 0;                 // 实际退租/断退回押金
    this.pledgeLostMoney = 0;                   // 退/断租押金损失
    this.lostAccountingId = 0;                  // 退/断租押金损失科目ID
    this.attachments = [];                      // 附件地址列表
    this.nextPayTime = undefined;               // 记录下一次续租时间
    this.planTotalPayNum = 0;                   // 合约计划付款次数
    this.planTotalMoney = 0;                    // 合约租金总金额
    this.planPaidMoney = 0;                     // 合约已支付租金总金额
    this.planPendingPayNum = 0;                 // 计划未执行付款次数
    this.initApplicationOrderId = undefined;    // 新租审批ID
    this.lastApplicationOrderId = undefined;    // 断/退租付款审批ID
    this.currentApplicationOrderId = undefined; // 当前进行审批的审批单ID
    this.costOrderIds = [];                     // 关联的费用记录ID数组
    this.applicationOrderIds = [];              // 关联的审批单ID数组
    this.fromContractId = undefined;            // 续签的旧合同ID
    this.renewalContractId = undefined;         // 续签的新合同ID
    this.creatorId = undefined;                 // 创建人ID
    this.operatorId = undefined;                // 最近修改人
    this.approvedAt = undefined;                // 申请通过时间(开始执行时间）
    this.createdAt = undefined;                 // 创建时间
    this.updatedAt = undefined;                 // 更新时间
    this.unrefundedPledgeMoney = 0;             // 未退押金（手动添加）
    this.returnedPledgeMoney = 0;               // 已退押金（手动添加）
    this.waitingPledgeMoney = 0;                // 待退押金（手动添加）
    this.paymentMethodPledge = 0;             // 付款方式（押金）（手动添加）
    this.paymentMethodRent = 0;               // 付款方式（租金）（手动添加）
    this.fromContractInfo = undefined;          // 历史合同信息（手动添加）
    this.landlordName = undefined;              // 房东姓名（手动添加）
    this.houseAddress = undefined;              // 房屋地址（手动添加）
    this.firstRentCycle = [];                   // 续租周期（手动添加）
    this.houseContractAllocation = {};         // 租金分摊记录（手动添加）
    this.costOrderList = [];                    // 费用列表（手动添加）
    this.allocationStartDate = 0;               // 未分摊开始时间（手动添加）
    this.allocationEndDate = 0;                 // 未分摊结束时间（手动添加）
    this.lastAllocationMoney = 0;               // 未分摊金额（手动添加）
    this.recentPayInfo = {};                    // 续租信息（手动添加）
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'state',                      // 执行状态 1(待提交/草稿) 10（审批中）50(执行中)  100(完成) -100(终止) -101 (删除)
      'bizState',                   // 特殊业务申请状态: 0 无特殊业务 11 续租申请中  12 断租申请中 13 退租申请中
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      migrate_flag: 'migrateFlag',
      migrate_oa_note: 'migrateOaNote',
      area: 'area',
      usage: 'usage',
      contract_start_date: 'contractStartDate',
      contract_end_date: 'contractEndDate',
      cost_center_type: 'costCenterType',
      state: 'state',
      biz_state: 'bizState',
      city_codes: 'cityCodes',
      supplier_ids: 'supplierIds',
      platform_codes: 'platformCodes',
      biz_district_ids: 'bizDistrictIds',
      biz_district_names: 'bizDistrictNames',
      cost_allocations: 'costAllocations',
      allocation_mode: 'allocationMode',
      month_money: 'monthMoney',
      rent_invoice_flag: 'rentInvoiceFlag',
      rent_accounting_id: 'rentAccountingId',
      period_month_num: 'periodMonthNum',
      period_money: 'periodMoney',
      init_paid_month_num: 'initPaidMonthNum',
      init_paid_money: 'initPaidMoney',
      schedule_prepare_days: 'schedulePrepareDays',
      rent_payee_info: 'rentPayeeInfo',
      pledge_money: 'pledgeMoney',
      pledge_invoice_flag: 'pledgeInvoiceFlag',
      pledge_accounting_id: 'pledgeAccountingId',
      pledge_payee_info: 'pledgePayeeInfo',
      agent_money: 'agentMoney',
      agent_invoice_flag: 'agentInvoiceFlag',
      agent_accounting_id: 'agentAccountingId',
      agent_payee_info: 'agentPayeeInfo',
      note: 'note',
      break_date: 'breakDate',
      pledge_return_money: 'pledgeReturnMoney',
      pledge_lost_money: 'pledgeLostMoney',
      lost_accounting_id: 'lostAccountingId',
      attachments: 'attachments',
      next_pay_time: 'nextPayTime',
      plan_total_pay_num: 'planTotalPayNum',
      plan_total_money: 'planTotalMoney',
      plan_paid_money: 'planPaidMoney',
      plan_pending_pay_num: 'planPendingPayNum',
      init_application_order_id: 'initApplicationOrderId',
      last_application_order_id: 'lastApplicationOrderId',
      current_application_order_id: 'currentApplicationOrderId',
      cost_order_ids: 'costOrderIds',
      application_order_ids: 'applicationOrderIds',
      from_contract_id: 'fromContractId',
      renewal_contract_id: 'renewalContractId',
      creator_id: 'creatorId',
      operator_id: 'operatorId',
      approved_at: 'approvedAt',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      unrefunded_pledge_money: 'unrefundedPledgeMoney',
      returned_pledge_money: 'returnedPledgeMoney',
      waiting_pledge_money: 'waitingPledgeMoney',
      payment_method_pledge: 'paymentMethodPledge',
      payment_method_rent: 'paymentMethodRent',
      from_contract_info: 'fromContractInfo',
      landlord_name: 'landlordName',
      house_address: 'houseAddress',
      first_rent_cycle: 'firstRentCycle',
      house_contract_allocation: 'houseContractAllocation',
      cost_order_list: 'costOrderList',
      allocation_start_date: 'allocationStartDate',
      allocation_end_date: 'allocationEndDate',
      last_allocation_money: 'lastAllocationMoney',
      recent_pay_info: 'recentPayInfo',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      migrateFlag: 'migrate_flag',
      migrateOaNote: 'migrate_oa_note',
      area: 'area',
      usage: 'usage',
      contractStartDate: 'contract_start_date',
      contractEndDate: 'contract_end_date',
      costCenterType: 'cost_center_type',
      state: 'state',
      bizState: 'biz_state',
      cityCodes: 'city_codes',
      supplierIds: 'supplier_ids',
      platformCodes: 'platform_codes',
      bizDistrictIds: 'biz_district_ids',
      bizDistrictNames: 'biz_district_names',
      costAllocations: 'cost_allocations',
      allocationMode: 'allocation_mode',
      monthMoney: 'month_money',
      rentInvoiceFlag: 'rent_invoice_flag',
      rentAccountingId: 'rent_accounting_id',
      periodMonthNum: 'period_month_num',
      periodMoney: 'period_money',
      initPaidMonthNum: 'init_paid_month_num',
      initPaidMoney: 'init_paid_money',
      schedulePrepareDays: 'schedule_prepare_days',
      rentPayeeInfo: 'rent_payee_info',
      pledgeMoney: 'pledge_money',
      pledgeInvoiceFlag: 'pledge_invoice_flag',
      pledgeAccountingId: 'pledge_accounting_id',
      pledgePayeeInfo: 'pledge_payee_info',
      agentMoney: 'agent_money',
      agentInvoiceFlag: 'agent_invoice_flag',
      agentAccountingId: 'agent_accounting_id',
      agentPayeeInfo: 'agent_payee_info',
      note: 'note',
      breakDate: 'break_date',
      pledgeReturnMoney: 'pledge_return_money',
      pledgeLostMoney: 'pledge_lost_money',
      lostAccountingId: 'lost_accounting_id',
      attachments: 'attachments',
      nextPayTime: 'next_pay_time',
      planTotalPayNum: 'plan_total_pay_num',
      planTotalMoney: 'plan_total_money',
      planPaidMoney: 'plan_paid_money',
      planPendingPayNum: 'plan_pending_pay_num',
      initApplicationOrderId: 'init_application_order_id',
      lastApplicationOrderId: 'last_application_order_id',
      currentApplicationOrderId: 'current_application_order_id',
      costOrderIds: 'cost_order_ids',
      applicationOrderIds: 'application_order_ids',
      fromContractId: 'from_contract_id',
      renewalContractId: 'renewal_contract_id',
      creatorId: 'creator_id',
      operatorId: 'operator_id',
      approvedAt: 'approved_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      unrefundedPledgeMoney: 'unrefunded_pledge_money',
      returnedPledgeMoney: 'returned_pledge_money',
      waitingPledgeMoney: 'waiting_pledge_money',
      paymentMethodPledge: 'payment_method_pledge',
      paymentMethodRent: 'payment_method_rent',
      fromContractInfo: 'from_contract_info',
      landlordName: 'landlord_name',
      houseAddress: 'house_address',
      firstRentCycle: 'first_rent_cycle',
      houseContractAllocation: 'house_contract_allocation',
      costOrderList: 'cost_order_list',
      allocationStartDate: 'allocation_start_date',
      allocationEndDate: 'allocation_end_date',
      lastAllocationMoney: 'last_allocation_money',
      recentPayInfo: 'recent_pay_info',
    };
  }
}

// 系统消息/通知
class CommonMessage extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // 消息ID
    this.channelId = '';                        // 消息总线ID
    this.bizChannelId = 0;                      // 业务模块ID
    this.state = 0;                             // 1（新）90（已送达）100（已读）-100（已删除）
    this.broadType = 0;                         // 1(全局) 10(定向)
    this.accounts = [];                         // 定向接收人账号
    this.payload = {};                          // 消息负载
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // 消息ID
      'channelId',                  // 消息总线ID
      'bizChannelId',               // 业务模块ID
      'state',                      // 1（新）90（已送达）100（已读）-100（已删除）
      'broadType',                  // 1(全局) 10(定向)
      'payload',                    // 消息负载
      'updatedAt',                  // 更新时间
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      channel_id: 'channelId',
      biz_channel_id: 'bizChannelId',
      state: 'state',
      broad_type: 'broadType',
      accounts: 'accounts',
      payload: 'payload',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      channelId: 'channel_id',
      bizChannelId: 'biz_channel_id',
      state: 'state',
      broadType: 'broad_type',
      accounts: 'accounts',
      payload: 'payload',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 上一版 module.exports
export {
  OaCostGroup,                          // OA费用分组(原费用类型）
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
};
