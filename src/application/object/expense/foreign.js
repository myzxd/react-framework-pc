/**
 * 外键关联对象
 */
import CoreObject from '../core';
import { OaCostGroup, OaCostAccounting, OaCostAllocation, OaCostBookLog, OaCostBookMonth, OaPayeeBook, OaCostOrder, OaApplicationFlowNode, OaApplicationFlowTemplate, OaApplicationOrder, OaApplicationOrderFlowRecord, OaApplicationOrderFlowExtra, OaApplicationUrgeRecord, OaHouseContract, CommonMessage } from './index';
import { PayrollStatementBrief, SalaryComputeTaskBrief, SalaryPlanVersionBrief, SalaryComputeDataSetBrief } from './salary';

// 账号摘要
class AccountBrief extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.name = '';                             // name
    this.gid = 0;                               // 角色（职位）
    this.positionName = '';                     // 职位名称
    this.staffId = '';                          // 人员ID
    this.state = 0;                             // 状态(手动添加映射)
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      gid: 'gid',
      position_name: 'positionName',
      staff_id: 'staffId',
      state: 'state',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      gid: 'gid',
      positionName: 'position_name',
      staffId: 'staff_id',
      state: 'state',
    };
  }
}

// 费用科目摘要
class CostAccountingBrief extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.name = '';                             // 名称
    this.parentInfo = undefined;                // 上级科目摘要
    this.costCenterTypeTitle = '';              // 成本中心归属类型名称
    this.costCenterType = 0;                    // 成本中心归属类型名称
    this.creatorInfo = undefined;               // 创建人信息
    this.accountingCode = undefined;
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      parent_info: {
        key: 'parentInfo',
        transform: value => CoreObject.mapper(value, CostAccountingBrief),
      },
      cost_center_type_title: 'costCenterTypeTitle',
      cost_center_type: 'costCenterType',
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      accounting_code: 'accountingCode',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      parentInfo: {
        key: 'parent_info',
        transform: value => CoreObject.revert(value, CostAccountingBrief),
      },
      costCenterTypeTitle: 'cost_center_type_title',
      costCenterType: 'cost_center_type',
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      accountingCode: 'accounting_code',
    };
  }
}

// 费用科目摘要
class CostAccountingListItem extends CoreObject {
  constructor() {
    super();
    this.parentInfo = undefined;                // 上级科目摘要
    this.costCenterTypeTitle = '';              // 成本中心归属类型名称
    this.creatorInfo = undefined;               // 创建人信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      parent_info: {
        key: 'parentInfo',
        transform: value => CoreObject.mapper(value, CostAccountingBrief),
      },
      cost_center_type_title: 'costCenterTypeTitle',
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      parentInfo: {
        key: 'parent_info',
        transform: value => CoreObject.revert(value, CostAccountingBrief),
      },
      costCenterTypeTitle: 'cost_center_type_title',
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
    };
  }
}

// 费用科目详情
class CostAccountingDetail extends CoreObject {
  constructor() {
    super();
    this.parentInfo = undefined;                // 上级科目摘要
    this.costCenterTypeTitle = '';              // 成本中心归属类型名称
    this.creatorInfo = undefined;               // 创建人信息
    this.costFlag = false;                      // 是否是成本类
    this.parentName = '';                       // 上级科目
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaCostAccounting;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      parent_info: {
        key: 'parentInfo',
        transform: value => CoreObject.mapper(value, CostAccountingBrief),
      },
      cost_center_type_title: 'costCenterTypeTitle',
      cost_flag: 'costFlag',
      parent_name: 'parentName',
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      parentInfo: {
        key: 'parent_info',
        transform: value => CoreObject.revert(value, CostAccountingBrief),
      },
      costCenterTypeTitle: 'cost_center_type_title',
      costFlag: 'cost_flag',
      parentName: 'parent_name',
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
    };
  }
}

// 费用分组摘要
class CostGroupBrief extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.name = '';                             // 名称
    this.creatorInfo = undefined;               // 创建人信息
    this.accountingList = [];                   // 包含的所有会计科目列表信息
    this.accountingIds = [];                    // 科目id列表（手动添加）
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      accounting_list: {
        key: 'accountingList',
        transform: value => CoreObject.mapperEach(value, CostAccountingDetail),
      },
      accounting_ids: 'accountingIds',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      accountingList: {
        key: 'accounting_list',
        transform: value => CoreObject.revertEach(value, CostAccountingDetail),
      },
      accountingIds: 'accounting_ids',
    };
  }
}

// 费用分组详情
class CostGroupDetail extends CoreObject {
  constructor() {
    super();
    this.creatorInfo = undefined;               // 创建人信息
    this.accountingList = [];                   // 包含的所有会计科目列表信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaCostGroup;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      accounting_list: {
        key: 'accountingList',
        transform: value => CoreObject.mapperEach(value, CostAccountingDetail),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      accountingList: {
        key: 'accounting_list',
        transform: value => CoreObject.revertEach(value, CostAccountingDetail),
      },
    };
  }
}

// 审批流模版摘要
class ApplicationFlowTemplateBrief extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.name = '';                             // 名称
    this.costCatalogScopeList = [];             // 包含的费用分组摘要列表
    this.extraUiOptions = {};                   // 前端UI表单选项
    this.nodeList = [];                         // 审批流节点摘要列表
    this.bizType = 0;                           // 工作流业务分类  1 成本审批流  90 非成本审批流
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      cost_catalog_scope_list: {
        key: 'costCatalogScopeList',
        transform: value => CoreObject.mapperEach(value, CostGroupBrief),
      },
      extra_ui_options: 'extraUiOptions',
      node_list: {
        key: 'nodeList',
        transform: value => CoreObject.mapperEach(value, ApplicationFlowNodeBrief),
      },
      biz_type: 'bizType',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      costCatalogScopeList: {
        key: 'cost_catalog_scope_list',
        transform: value => CoreObject.revertEach(value, CostGroupBrief),
      },
      extraUiOptions: 'extra_ui_options',
      nodeList: {
        key: 'node_list',
        transform: value => CoreObject.revertEach(value, ApplicationFlowNodeBrief),
      },
      bizType: 'biz_type',
    };
  }
}

// 审批流模版详情
class ApplicationFlowTemplateDetail extends CoreObject {
  constructor() {
    super();
    this.platformNames = [];                    // 平台名称
    this.creatorInfo = undefined;               // 创建人
    this.nodeList = [];                         // 审批流节点摘要列表
    this.costCatalogScopeList = [];             // 包含的费用分组摘要列表
    this.excludeCostCatalogScopeList = [];      // 排除掉的费用分组摘要列表
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaApplicationFlowTemplate;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      platform_names: 'platformNames',
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      node_list: {
        key: 'nodeList',
        transform: value => CoreObject.mapperEach(value, ApplicationFlowNodeBrief),
      },
      cost_catalog_scope_list: {
        key: 'costCatalogScopeList',
        transform: value => CoreObject.mapperEach(value, CostGroupBrief),
      },
      exclude_cost_catalog_scope_list: {
        key: 'excludeCostCatalogScopeList',
        transform: value => CoreObject.mapperEach(value, CostGroupBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      platformNames: 'platform_names',
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      nodeList: {
        key: 'node_list',
        transform: value => CoreObject.revertEach(value, ApplicationFlowNodeBrief),
      },
      costCatalogScopeList: {
        key: 'cost_catalog_scope_list',
        transform: value => CoreObject.revertEach(value, CostGroupBrief),
      },
      excludeCostCatalogScopeList: {
        key: 'exclude_cost_catalog_scope_list',
        transform: value => CoreObject.revertEach(value, CostGroupBrief),
      },
    };
  }
}

// 审批流模版节点列表（嵌入）
class ApplicationFlowNodeEmbedItem extends CoreObject {
  constructor() {
    super();
    this.accountList = [];                      // 节点审批人摘要列表
    this.parentFlowTemplateInfo = [];           // 所属审批流模版摘要
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaApplicationFlowNode;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      account_list: {
        key: 'accountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      parent_flow_template_info: {
        key: 'parentFlowTemplateInfo',
        transform: value => CoreObject.mapperEach(value, ApplicationFlowTemplateBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      accountList: {
        key: 'account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      parentFlowTemplateInfo: {
        key: 'parent_flow_template_info',
        transform: value => CoreObject.revertEach(value, ApplicationFlowTemplateBrief),
      },
    };
  }
}

// 关联审批单（手动添加）
class RelationApplicationOrderInfo extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                // _id
    this.bizState = undefined;          // biz_state
    this.currentFlowNodeInfo = undefined; // current_flow_node_info
    this.flowInfo = undefined;          // flow_info
    this.state = undefined;             // state
    this.submitAt = undefined;          // submit_at
    this.totalMoney = undefined;        // total_money
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      biz_state: 'bizState',
      current_flow_node_info: 'currentFlowNodeInfo',
      flow_info: 'flowInfo',
      state: 'state',
      submit_at: 'submitAt',
      total_money: 'totalMoney',
    };
  }

   // 反向映射
  static revertMap() {
    return {
      id: '_id',
      bizState: 'biz_state',
      currentFlowNodeInfo: 'current_flow_node_info',
      flowInfo: 'flow_info',
      state: 'state',
      submitAt: 'submit_at',
      totalMoney: 'total_money',
    };
  }
}

// 审批流节点摘要（嵌入）
class AffairsFlowNodeCCInfo extends CoreObject {
  constructor() {
    super();
    this.fixedCcAccountInfoList = undefined; // 固定抄送人员
    this.fixedCcDepartmentJobRelationInfoList = undefined; // 固定抄送部门岗位关系
    this.fixedCcDepartmentInfoList = undefined; // 固定抄送部门
    this.flexibleCcAccountInfoList = undefined; // 灵活抄送人员
    this.flexibleCcDepartmentJobRelationInfoList = undefined; // 灵活抄送部门岗位关系
    this.flexibleCcDepartmentInfoList = undefined; // 灵活抄送部门
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [];
  }

  // 数据映射
  static datamap() {
    return {
      fixed_cc_account_info_list: 'fixedCcAccountInfoList',
      fixed_cc_department_job_relation_info_list: 'fixedCcDepartmentJobRelationInfoList',
      fixed_cc_department_info_list: 'fixedCcDepartmentInfoList',
      flexible_cc_account_info_list: 'flexibleCcAccountInfoList',
      flexible_cc_department_job_relation_info_list: 'flexibleCcDepartmentJobRelationInfoList',
      flexible_cc_department_info_list: 'flexibleCcDepartmentInfoList',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      fixedCcAccountInfoList: 'fixed_cc_account_info_list',
      fixedCcDepartmentInfoList: 'fixed_cc_department_info_list',
      fixedCcDepartmentJobRelationInfoList: 'fixed_cc_department_job_relation_info_list',
      flexibleCcAccountInfoList: 'flexible_cc_account_info_list',
      flexibleCcDepartmentInfoList: 'flexible_cc_department_info_list',
      flexibleCcDepartmentJobRelationInfoList: 'flexible_cc_department_job_relation_info_list',
    };
  }
}

// 审批流节点摘要（嵌入）
class ApplicationFlowNodeBrief extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.name = '';                             // 名称
    this.approveMode = 0;                       // 节点审批模式： 10 所有审批人全部审批  20 任意审批人审批
    this.accountList = [];                      // 节点审批人摘要列表
    this.accountIds = [];                      // 节点审批人ids
    this.isPaymentNode = false;                 // 是否为支付节点
    this.canUpdateCostRecord = false;           // 是否为编辑节点
    this.costUpdateRule = 0;                    // 费用记录修改规则
    this.indexNum = 0;                          // 流程节点索引序号
    this.pickMode = 0;                          // 指派方式 1 手动/ 2 自动(手动添加映射)
    this.postList = [];                         // 审批流（岗位）节点（手动添加映射）
    this.postIds = [];                          // 审批流（岗位）节点ids（手动添加映射）
    this.isInspectBillNode = false; // 标记验票（手动添加）
    this.nodeApproveType = undefined; // 节点审批人设置（手动添加）
    this.organizationApproveType = undefined; // 按汇报关系指定上级（手动添加）
    this.accountApproveType = undefined; // 按汇报关系审批人（手动添加）
    this.approveDepartmentId = undefined; // 按协作关系指定部门-部门id（手动添加）
    this.approveDepartmentAccountType = undefined; // 部门审批人类型（手动添加）
    this.approveJobId = undefined; // 指定部门-岗位id（手动添加）
    this.specifiedDepartmentType = undefined; // 指定字段特殊部门（手动添加）
    this.specifiedFieldType = undefined; // 指定字段相关人（手动添加）
    this.fixedCcAccountInfoList = undefined; // 固定抄送人员
    this.fixedCcDepartmentJobRelationInfoList = undefined; // 固定抄送部门岗位关系
    this.fixedCcDepartmentInfoList = undefined; // 固定抄送部门
    this.flexibleCcAccountInfoList = undefined; // 灵活抄送人员
    this.flexibleCcDepartmentJobRelationInfoList = undefined; // 灵活抄送部门岗位关系
    this.flexibleCcDepartmentInfoList = undefined; // 灵活抄送部门
    this.isCc = undefined; // 是否可抄送
    this.ccList = []; // 节点抄送信息（手动添加）
    this.approveDepartmentInfo = undefined; // 部门信息
    this.approveJobInfo = undefined; // 岗位信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'approveMode',                // 节点审批模式： 10 所有审批人全部审批  20 任意审批人审批
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      approve_mode: 'approveMode',
      post_ids: 'postIds',
      post_list: 'postList',
      account_ids: 'accountIds',
      account_list: {
        key: 'accountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      is_payment_node: 'isPaymentNode',
      can_update_cost_record: 'canUpdateCostRecord',
      cost_update_rule: 'costUpdateRule',
      index_num: 'indexNum',
      pick_mode: 'pickMode',
      is_inspect_bill_node: 'isInspectBillNode',
      node_approve_type: 'nodeApproveType',
      organization_approve_type: 'organizationApproveType',
      account_approve_type: 'accountApproveType',
      approve_department_id: 'approveDepartmentId',
      approve_department_account_type: 'approveDepartmentAccountType',
      approve_job_id: 'approveJobId',
      specified_department_type: 'specifiedDepartmentType',
      specified_field_type: 'specifiedFieldType',
      fixed_cc_account_info_list: 'fixedCcAccountInfoList',
      fixed_cc_department_job_relation_info_list: 'fixedCcDepartmentJobRelationInfoList',
      fixed_cc_department_info_list: 'fixedCcDepartmentInfoList',
      flexible_cc_account_info_list: 'flexibleCcAccountInfoList',
      flexible_cc_department_job_relation_info_list: 'flexibleCcDepartmentJobRelationInfoList',
      flexible_cc_department_info_list: 'flexibleCcDepartmentInfoList',
      is_cc: 'isCc',
      cc_list: {
        key: 'ccList',
        transform: value => CoreObject.mapperEach(value, AffairsFlowNodeCCInfo),
      },
      approve_department_info: 'approveDepartmentInfo',
      approve_job_info: 'approveJobInfo',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      approveMode: 'approve_mode',
      postIds: 'post_ids',
      postList: 'post_list',
      accountIds: 'account_ids',
      accountList: {
        key: 'account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      isPaymentNode: 'is_payment_node',
      canUpdateCostRecord: 'can_update_cost_record',
      costUpdateRule: 'cost_update_rule',
      indexNum: 'index_num',
      pickMode: 'pick_mode',
      isInspectBillNode: 'is_inspect_bill_node',
      nodeApproveType: 'node_approve_type',
      organizationApproveType: 'organization_approve_type',
      accountApproveType: 'account_approve_type',
      approveDepartmentId: 'approve_department_id',
      approveDepartmentAccountType: 'approve_department_account_type',
      approveJobId: 'approve_job_id',
      specifiedDepartmentType: 'specified_department_type',
      specifiedFieldType: 'specified_field_type',
      fixedCcAccountInfoList: 'fixed_cc_account_info_list',
      fixedCcDepartmentInfoList: 'fixed_cc_department_info_list',
      fixedCcDepartmentJobRelationInfoList: 'fixed_cc_department_job_relation_info_list',
      flexibleCcAccountInfoList: 'flexible_cc_account_info_list',
      flexibleCcDepartmentInfoList: 'flexible_cc_department_info_list',
      flexibleCcDepartmentJobRelationInfoList: 'flexible_cc_department_job_relation_info_list',
      isCc: 'is_cc',
      ccList: {
        key: 'cc_list',
        transform: value => CoreObject.revertEach(value, AffairsFlowNodeCCInfo),
      },
      approveDepartmentInfo: 'approve_department_info',
      approveJobInfo: 'approve_job_info',
    };
  }
}

// 房屋科目
class CostAccountingTiny extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.name = '';                             // undefined
    this.accountingCode = '';                   // 科目code
    this.costCenterTypeTitle = '';              // 成本中心名称呼
    this.costCenterType = undefined;            // 成本中心id
    this.parantName = '';                       // 父节点信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      accounting_code: 'accountingCode',
      cost_center_type_title: 'costCenterTypeTitle',
      cost_center_type: 'costCenterType',
      parant_name: 'parantName',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      accountingCode: 'accounting_code',
      costCenterTypeTitle: 'cost_center_type_title',
      costCenterType: 'cost_center_type',
      parantName: 'parant_name',
    };
  }
}

// 审批流模版节点详情
class ApplicationFlowNodeDetail extends CoreObject {
  constructor() {
    super();
    this.accountList = [];                      // 节点审批人列表
    this.parentFlowTemplateInfo = undefined;    // 所属审批流模版摘要
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaApplicationFlowNode;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      account_list: {
        key: 'accountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      parent_flow_template_info: {
        key: 'parentFlowTemplateInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowTemplateBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      accountList: {
        key: 'account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      parentFlowTemplateInfo: {
        key: 'parent_flow_template_info',
        transform: value => CoreObject.revert(value, ApplicationFlowTemplateBrief),
      },
    };
  }
}

// 审批单列表
class ApplicationOrderListItem extends CoreObject {
  constructor() {
    super();
    this.cityNames = [];                        // 城市名称列表
    this.supplierNames = [];                    // 供应商名称列表
    this.platformNames = [];                    // 平台名称列表
    this.bizDistrictNames = [];                 // 商圈名称列表
    this.flowInfo = undefined;                  // 审批流模版详情
    this.currentFlowNodeInfo = undefined;       // 当前节点信息
    this.applyAccountInfo = undefined;          // 申请人信息
    this.currentPendingAccountList = [];        // 当前节点等待处理的人员账号列表
    this.flowAccountList = [];                  // 当前审批流已经手操作的人员账号列表（包括审批和补充）
    this.operateAccountsList = [];              // 本审批单可审核操作（通过/驳回）的人员列表
    this.currentOperateAccountList = [];        // 可前节点可审核操作（通过/驳回）的人员列表
    this.currentRecordList = [];                // 当前节点的审批记录列表
    this.attachmentPrivateUrls = [];            // 附件私有下载地址
    this.belongTime = 0;                        // 归属周期(手动添加)
    this.paidAt = undefined;                    // 付款日期(手动添加)
    this.payrollStatementId = '';               // 结算单id
    this.applicationOrderType = 0;              // 审批单类型(手动添加)
    this.themeLabelList = [];                   // 主题标签(手动添加)
    this.refundApplicationOrderId = undefined;  // 退款审批单id(手动添加)
    this.redRushApplicationOrderId = undefined; // 红冲审批单id(手动添加)
    this.applicationSubType = undefined;        // 审批单类型（红冲/退款）（手动添加）
    this.extraWorkOrLeaveId = undefined;        // 加班单/请假单id（手动添加）
    this.inspectBillState = undefined; // 验票状态（手动添加）
    this.inspectBillNote = undefined; // 验票说明（手动添加）
    this.inspectBillLabelIds = undefined; // 验票标签（手动添加）
    this.inspectBillAt = undefined; // 验票时间（手动添加）
    this.inspectBillLabelList = undefined; // 验票标签（手动添加）
    this.inspectBillErrNote = undefined; // 验票异常说明（手动添加）
    this.pluginExtraMeta = undefined; // 外部审批单（手动添加）
    this.actualApplyAccountDepartmentInfo = {}; // 实际申请部门
    this.actualApplyAccountInfo = {}; // 实际申请人
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaApplicationOrder;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      city_names: 'cityNames',
      supplier_names: 'supplierNames',
      platform_names: 'platformNames',
      biz_district_names: 'bizDistrictNames',
      flow_info: {
        key: 'flowInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowTemplateBrief),
      },
      current_flow_node_info: {
        key: 'currentFlowNodeInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowNodeBrief),
      },
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      current_pending_account_list: {
        key: 'currentPendingAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      flow_account_list: {
        key: 'flowAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      operate_accounts_list: {
        key: 'operateAccountsList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      current_operate_account_list: {
        key: 'currentOperateAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      current_record_list: {
        key: 'currentRecordList',
        transform: value => CoreObject.mapperEach(value, ApplicationOrderFlowRecordBrief),
      },
      attachment_private_urls: 'attachmentPrivateUrls',
      belong_time: 'belongTime',
      paid_at: 'paidAt',
      payroll_statement_id: 'payrollStatementId',
      application_order_type: 'applicationOrderType',
      theme_label_list: 'themeLabelList',
      refund_application_order_id: 'refundApplicationOrderId',
      red_rush_application_order_id: 'redRushApplicationOrderId',
      application_sub_type: 'applicationSubType',
      extra_work_or_leave_id: 'extraWorkOrLeaveId',
      inspect_bill_state: 'inspectBillState',
      inspect_bill_note: 'inspectBillNote',
      inspect_bill_label_ids: 'inspectBillLabelIds',
      inspect_bill_at: 'inspectBillAt',
      inspect_bill_label_list: 'inspectBillLabelList',
      inspect_bill_err_note: 'inspectBillErrNote',
      plugin_extra_meta: 'pluginExtraMeta',
      actual_apply_account_department_info: 'actualApplyAccountDepartmentInfo',
      actual_apply_account_info: 'actualApplyAccountInfo',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cityNames: 'city_names',
      supplierNames: 'supplier_names',
      platformNames: 'platform_names',
      bizDistrictNames: 'biz_district_names',
      flowInfo: {
        key: 'flow_info',
        transform: value => CoreObject.revert(value, ApplicationFlowTemplateBrief),
      },
      currentFlowNodeInfo: {
        key: 'current_flow_node_info',
        transform: value => CoreObject.revert(value, ApplicationFlowNodeBrief),
      },
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      currentPendingAccountList: {
        key: 'current_pending_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      flowAccountList: {
        key: 'flow_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      operateAccountsList: {
        key: 'operate_accounts_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      currentOperateAccountList: {
        key: 'current_operate_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      currentRecordList: {
        key: 'current_record_list',
        transform: value => CoreObject.revertEach(value, ApplicationOrderFlowRecordBrief),
      },
      attachmentPrivateUrls: 'attachment_private_urls',
      belongTime: 'belong_time',
      paidAt: 'paid_at',
      payrollStatementId: 'payroll_statement_id',
      applicationOrderType: 'application_order_type',
      themeLabelList: 'theme_label_list',
      refundApplicationOrderId: 'refund_application_order_id',
      redRushApplicationOrderId: 'red_rush_application_order_id',
      relationApplicationOrderIds: 'relation_application_order_ids',
      applicationSubType: 'application_sub_type',
      extraWorkOrLeaveId: 'extra_work_or_leave_id',
      inspectBillState: 'inspect_bill_state',
      inspectBillNote: 'inspect_bill_note',
      inspectBillLabelIds: 'inspect_bill_label_ids',
      inspectBillAt: 'inspect_bill_at',
      inspectBillLabelList: 'inspect_bill_label_list',
      inspectBillErrNote: 'inspect_bill_err_note',
      pluginExtraMeta: 'plugin_extra_meta',
      actualApplyAccountDepartmentInfo: 'actual_apply_account_department_info',
      actualApplyAccountInfo: 'actual_apply_account_info',
    };
  }
}

// 付款审批摘要
class ApplicationOrderBrief extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // 审批单id
    this.cityNames = [];                        // 城市名称列表
    this.supplierNames = [];                    // 供应商名称列表
    this.platformNames = [];                    // 平台名称列表
    this.bizDistrictNames = [];                 // 商圈名称列表
    this.state = 0;                             // 流程状态 1 => 待提交 10 => 审批流进行中 100 => 流程完成 -100=> 流程关闭
    this.bizState = 0;                          // 当前节点的业务审批状态
    this.totalMoney = 0;                        // 总金额
    this.flowInfo = undefined;                  // 审批流模版摘要
    this.currentFlowNodeInfo = undefined;       // 当前节点信息
    this.applyAccountInfo = undefined;          // 申请人信息摘要
    this.currentOperateAccounts = [];           // 当前节点可审核操作（通过/驳回）的人员列表
    this.costOrderList = [];                    // 费用单摘要列表
    this.flowRecordList = [];                   // 审批单流转明细记录列表
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      city_names: 'cityNames',
      supplier_names: 'supplierNames',
      platform_names: 'platformNames',
      biz_district_names: 'bizDistrictNames',
      state: 'state',
      biz_state: 'bizState',
      total_money: 'totalMoney',
      flow_info: {
        key: 'flowInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowTemplateBrief),
      },
      current_flow_node_info: {
        key: 'currentFlowNodeInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowNodeBrief),
      },
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      current_operate_accounts: 'currentOperateAccounts',
      cost_order_list: {
        key: 'costOrderList',
        transform: value => CoreObject.mapperEach(value, CostOrderBrief),
      },
      flow_record_list: {
        key: 'flowRecordList',
        transform: value => CoreObject.mapperEach(value, ApplicationOrderFlowRecordBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      cityNames: 'city_names',
      supplierNames: 'supplier_names',
      platformNames: 'platform_names',
      bizDistrictNames: 'biz_district_names',
      state: 'state',
      bizState: 'biz_state',
      totalMoney: 'total_money',
      flowInfo: {
        key: 'flow_info',
        transform: value => CoreObject.revert(value, ApplicationFlowTemplateBrief),
      },
      currentFlowNodeInfo: {
        key: 'current_flow_node_info',
        transform: value => CoreObject.revert(value, ApplicationFlowNodeBrief),
      },
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      currentOperateAccounts: 'current_operate_accounts',
      costOrderList: {
        key: 'cost_order_list',
        transform: value => CoreObject.revertEach(value, CostOrderBrief),
      },
      flowRecordList: {
        key: 'flow_record_list',
        transform: value => CoreObject.revertEach(value, ApplicationOrderFlowRecordBrief),
      },
    };
  }
}

// 审批单详情
class ApplicationOrderDetail extends CoreObject {
  constructor() {
    super();
    this.fileUrlList = [];                      // 流转记录补充意见下载地址(手动添加)
    this.isSupportCc = false;                 // 是否支持抄送
    this.cityNames = [];                        // 城市名称列表
    this.supplierNames = [];                    // 供应商名称列表
    this.platformNames = [];                    // 平台名称列表
    this.bizDistrictNames = [];                 // 商圈名称列表
    this.salaryPlanVersionId = undefined;       // 服务费方案id(手动添加)
    this.salaryOrderId = undefined;             // 结算单id(手动添加)
    this.payrollStatementId = undefined;        // 结算汇总单id(手动添加)
    this.salaryComputeDataSetId = undefined;    // 服务费计算结果集id(手动添加)
    this.salaryComputeTaskId = undefined;       // 服务费试算任务id(手动添加)
    this.flowInfo = undefined;                  // 审批流模版摘要
    this.currentFlowNodeInfo = undefined;       // 当前节点信息
    this.applyAccountInfo = undefined;          // 申请人信息
    this.currentPendingAccountList = [];        // 当前节点等待处理的人员账号列表
    this.flowAccountList = [];                  // 当前审批流已经手操作的人员账号列表（包括审批和补充）
    this.operateAccountsList = [];              // 本审批单可审核操作（通过/驳回）的人员列表
    this.currentOperateAccountList = [];        // 可前节点可审核操作（通过/驳回）的人员列表
    this.costOrderList = [];                    // 成本费用记录摘要列表
    this.currentRecordList = [];                // 当前节点的审批记录摘要列表
    this.flowRecordList = [];                   // 审批单的流转明细记录，倒序排列
    this.salaryPlanVersionInfo = undefined;     // 服务费方案详情(手动添加)
    this.payrollStatementInfo = undefined;      // 结算汇总单详情(手动添加)
    this.salaryComputeDataSetInfo = undefined;  // 人员服务费计算结果集详情(手动添加)
    this.salaryComputeTaskInfo = undefined;     // 新姿势算任务详情(手动添加)
    this.loanOrderList = [];                    // 审批流借款详情数据
    this.repaymentOrderList = [];               // 审批流还款详情数据
    this.costOrderIds = [];                     // 借还款id
    this.loanOrRepaymentFileList = [];          // 借还款附件
    this.applicationOrderType = undefined;     // 审批单类型(手动添加)
    this.relationApplicationOrderInfo = undefined; // 关联审批单id(手动添加)
    this.relationApplicationOrderId = undefined;    // 关联审id(手动添加)
    this.businessTravelOrderId = undefined;       // 出差审批单详情(手动添加)
    this.businessTravelOrderInfo = undefined;       // 出差审批单详情(手动添加)
    this.applicationSubType = undefined;         // 审批单申请单类型
    this.relationApplicationOrderIds = [];      // 关联审批单id
    this.rentCycleStartAt = undefined;       // 关联的审批单租金开始日期
    this.rentCycleEndAt = undefined;         // 关联的审批单租金结束日期
    this.extraWorkOrLeaveId = undefined;        // 加班/请假单id（手动添加）
    this.extraStaffChangeId = undefined;        // 人员异动id（手动添加）
    this.pluginExtraMeta = {};                // 原始提报人和手机号
    this.inspectBillLabelList = undefined; // 验票标签（手动添加）
    this.inspectBillState = undefined; // 验票状态（手动添加）
    this.inspectBillNote = undefined; // 验票说明（手动添加）
    this.inspectBillErrNote = undefined; // 验票异常说明（手动添加）
    this.bizExtraWorkflowIds = undefined; // 事务性单据id（手动添加）
    this.oaLeaveOrderInfo = undefined; // 外部审批单请假单据详情（手动添加）
    this.oaExtraWorkOrderInfo = undefined; // 外部审批单加班单据详情（手动添加）
    this.bizExtraHouseContractInfo = undefined; // 外部审批单房屋单据详情（手动添加）

    // 审批详情事务性表单
    this.addendumOrderInfo = undefined;   // 外部审批单事务单据增编详情(手动添加)
    this.positiveOrderInfo = undefined;   // 外部审批单事务单据转正申请详情(手动添加)
    this.oaOrganizationOrderInfo = undefined; // 组织管理
    this.recruitmentOrderInfo = undefined;  // 招聘管理 - 招聘需求表单
    this.renewContractOrderInfo = undefined;  // 合同续签 - 合同续签申请表
    this.humanResourceTransferOrderInfo = undefined;  // 人事异动 - 人事异动申请表
    this.departureOrderInfo = undefined;       // 离职申请 - 离职申请表
    this.handoverOrderInfo = undefined;     // 工作交接 - 工作交接表
    this.employOrderInfo = undefined;       // 录用申请 - 录用申请表单
    this.leaveOrderInfo = undefined;          // 请假 - 请假申请表
    this.extraWorkOrderInfo = undefined;      // 加班 - 加班申请表
    this.breakOrderInfo = undefined;          // 外出 - 外出申请表
    this.attendanceExceptionOrderInfo = undefined;  // 考勤异常 - 考勤异常申请表
    this.sealModifyOrderInfo = undefined;           // 印章刻制 - 印章刻制申请表, 印章作废 - 印章作废申请表
    this.sealUseOrderInfo = undefined;          // 用章申请 - 用章申请表
    this.visitingCardOrderInfo = undefined;     // 名片申请 - 名片申请表
    this.certBorrowOrderInfo = undefined;     // 证照借用 - 证照借用
    this.prizeOrderInfo = undefined;          // 奖惩通知 - 奖惩通知表单
    this.sealUseOrderInfo = undefined;          // 用章申请 - 借章申请表
    this.firmModifyOrderInfo = undefined;          // 注册公司 - 注销/注册公司申请表、公司变更 - 公司变更申请表
    this.firmBankOrderInfo = undefined;          // 银行开户 - 银行开户申请表、注销开户 - 注销银行账户申请
    this.pactApplyOrderInfo = undefined;          // 合同会审 - 合同会审审批
    this.pactBorrowOrderInfo = undefined;          // 合同借阅 - 合同借阅审批
    this.employmentApplyOrderInfo = undefined;          // 入职申请 - 入职申请审批
    this.capitalAllocateOrderInfo = undefined;          // 资金调拨 - 资金调拨审批
    this.petitionOrderInfo = undefined;              // 事务签呈 - 事务签呈审批
    this.relationApplicationOrderListItem = [];        // 关联审批信息
    this.actualPayeeList = [];                        // 付款明细
    this.payeeList = [];                               // 费用单付款明细
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaApplicationOrder;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      actual_payee_list: 'actualPayeeList',
      payee_list: 'payeeList',
      file_url_list: {
        key: 'fileUrlList',
        transform: value => CoreObject.mapperEach(value, FileUrlListBrief),
      },
      is_support_cc: 'isSupportCc',
      city_names: 'cityNames',
      supplier_names: 'supplierNames',
      platform_names: 'platformNames',
      biz_district_names: 'bizDistrictNames',
      salary_plan_version_id: 'salaryPlanVersionId',
      salary_order_id: 'salaryOrderId',
      payroll_statement_id: 'payrollStatementId',
      salary_compute_data_set_id: 'salaryComputeDataSetId',
      salary_compute_task_id: 'salaryComputeTaskId',
      payroll_statement_info: 'payrollStatementInfo',
      application_sub_type: 'applicationSubType',
      relation_application_order_list_item: 'relationApplicationOrderListItem',
      // application_order_type: 'applicationOrderType',
      flow_info: {
        key: 'flowInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowTemplateBrief),
      },
      current_flow_node_info: {
        key: 'currentFlowNodeInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowNodeBrief),
      },
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      current_pending_account_list: {
        key: 'currentPendingAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      flow_account_list: {
        key: 'flowAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      operate_accounts_list: {
        key: 'operateAccountsList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      current_operate_account_list: {
        key: 'currentOperateAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      cost_order_list: {
        key: 'costOrderList',
        transform: value => CoreObject.mapperEach(value, CostOrderBrief),
      },
      current_record_list: {
        key: 'currentRecordList',
        transform: value => CoreObject.mapperEach(value, ApplicationOrderFlowRecordBrief),
      },
      flow_record_list: {
        key: 'flowRecordList',
        transform: value => CoreObject.mapperEach(value, ApplicationOrderFlowRecordBrief),
      },
      salary_plan_version_info: {
        key: 'salaryPlanVersionInfo',
        transform: value => CoreObject.mapper(value, SalaryPlanVersionBrief),
      },
      salary_compute_data_set_info: {
        key: 'salaryComputeDataSetInfo',
        transform: value => CoreObject.mapper(value, SalaryComputeDataSetBrief),
      },
      salary_compute_task_info: {
        key: 'salaryComputeTaskInfo',
        transform: value => CoreObject.mapper(value, SalaryComputeTaskBrief),
      },
      relation_application_order_info: {
        key: 'relationApplicationOrderInfo',
        transform: value => CoreObject.mapper(value, RelationApplicationOrderInfo),
      },
      loan_order_list: 'loanOrderList',
      repayment_order_list: 'repaymentOrderList',
      cost_order_ids: 'costOrderIds',
      loan_or_repayment_file_list: 'loanOrRepaymentFileList',
      application_order_type: 'applicationOrderType',
      relation_application_order_id: 'relationApplicationOrderId',
      business_travel_order_id: 'businessTravelOrderId',
      business_travel_order_info: 'businessTravelOrderInfo',
      relation_application_order_ids: 'relationApplicationOrderIds',
      rent_cycle_start_at: 'rentCycleStartAt',
      rent_cycle_end_at: 'rentCycleEndAt',
      extra_work_or_leave_id: 'extraWorkOrLeaveId',
      extra_staff_change_id: 'extraStaffChangeId',
      plugin_extra_meta: 'pluginExtraMeta',
      inspect_bill_label_list: 'inspectBillLabelList',
      inspect_bill_state: 'inspectBillState',
      inspect_bill_note: 'inspectBillNote',
      inspect_bill_err_note: 'inspectBillErrNote',
      biz_extra_workflow_ids: 'bizExtraWorkflowIds',
      addendum_order_info: 'addendumOrderInfo',
      oa_leave_order_info: 'oaLeaveOrderInfo',
      oa_extra_work_order_info: 'oaExtraWorkOrderInfo',
      biz_extra_house_contract_info: 'bizExtraHouseContractInfo',
      positive_order_info: 'positiveOrderInfo',

      oa_organization_order_info: 'oaOrganizationOrderInfo',
      recruitment_order_info: 'recruitmentOrderInfo',
      renewContract_order_info: 'renewContractOrderInfo',
      human_resource_transfer_order_info: 'humanResourceTransferOrderInfo',
      departure_order_info: 'departureOrderInfo',
      handover_order_info: 'handoverOrderInfo',
      employ_order_info: 'employOrderInfo',
      leave_order_info: 'leaveOrderInfo',
      extraWork_order_info: 'extraWorkOrderInfo',
      break_order_info: 'breakOrderInfo',
      attendance_exception_order_info: 'attendanceExceptionOrderInfo',
      seal_modify_order_info: 'sealModifyOrderInfo',
      seal_use_order_info: 'sealUseOrderInfo',
      visiting_card_order_info: 'visitingCardOrderInfo',
      cert_borrow_order_info: 'certBorrowOrderInfo',
      prize_order_info: 'prizeOrderInfo',
      seal_use_order_info: 'sealUseOrderInfo',
      firm_modify_order_info: 'firmModifyOrderInfo',
      firm_bank_order_info: 'firmBankOrderInfo',
      pact_apply_order_info: 'pactApplyOrderInfo',
      pact_borrow_order_info: 'pactBorrowOrderInfo',
      petition_order_info: 'petitionOrderInfo',
      employment_apply_order_info: 'employmentApplyOrderInfo',
      capital_allocate_order_info: 'capitalAllocateOrderInfo',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      actualPayeeList: 'actual_payee_list',
      payeeList: 'payee_list',
      fileUrlList: {
        key: 'file_url_list',
        transform: value => CoreObject.revertEach(value, FileUrlListBrief),
      },
      isSupportCc: 'is_support_cc',
      cityNames: 'city_names',
      supplierNames: 'supplier_names',
      platformNames: 'platform_names',
      bizDistrictNames: 'biz_district_names',
      salaryPlanVersionId: 'salary_plan_version_id',
      salaryOrderId: 'salary_order_id',
      payrollStatementId: 'payroll_statement_id',
      salaryComputeDataSetId: 'salary_compute_data_set_id',
      salaryComputeTaskId: 'salary_compute_task_id',
      payrollStatementInfo: 'payroll_statement_info',
      relationApplicationOrderListItem: 'relation_application_order_list_item',
      // applicationOrderType: 'application_order_type',
      flowInfo: {
        key: 'flow_info',
        transform: value => CoreObject.revert(value, ApplicationFlowTemplateBrief),
      },
      currentFlowNodeInfo: {
        key: 'current_flow_node_info',
        transform: value => CoreObject.revert(value, ApplicationFlowNodeBrief),
      },
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      currentPendingAccountList: {
        key: 'current_pending_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      flowAccountList: {
        key: 'flow_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      operateAccountsList: {
        key: 'operate_accounts_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      currentOperateAccountList: {
        key: 'current_operate_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      costOrderList: {
        key: 'cost_order_list',
        transform: value => CoreObject.revertEach(value, CostOrderBrief),
      },
      currentRecordList: {
        key: 'current_record_list',
        transform: value => CoreObject.revertEach(value, ApplicationOrderFlowRecordBrief),
      },
      flowRecordList: {
        key: 'flow_record_list',
        transform: value => CoreObject.revertEach(value, ApplicationOrderFlowRecordBrief),
      },
      salaryPlanVersionInfo: {
        key: 'salary_plan_version_info',
        transform: value => CoreObject.revert(value, SalaryPlanVersionBrief),
      },
      salaryComputeDataSetInfo: {
        key: 'salary_compute_data_set_info',
        transform: value => CoreObject.revert(value, SalaryComputeDataSetBrief),
      },
      salaryComputeTaskInfo: {
        key: 'salary_compute_task_info',
        transform: value => CoreObject.revert(value, SalaryComputeTaskBrief),
      },
      relationApplicationOrderInfo: {
        key: 'relation_application_order_info',
        transform: value => CoreObject.revert(value, RelationApplicationOrderInfo),
      },
      loanOrderlist: 'loan_order_list',
      repaymentOrderList: 'repayment_order_list',
      costOrderIds: 'cost_order_ids',
      loanOrRepaymentFileList: 'loan_or_repayment_file_list',
      applicationOrderType: 'application_order_type',
      relationApplicationOrderId: 'relation_application_order_id',
      businessTravelOrderId: 'business_travel_order_id',
      businessTravelOrderInfo: 'business_travel_order_info',
      applicationSubType: 'application_sub_type',
      relationApplicationOrderIds: 'relation_application_order_ids',
      rentCycleStartAt: 'rent_cycle_start_at',
      rentCycleEndAt: 'rent_cycle_end_at',
      extraWorkOrLeaveId: 'extra_work_or_leave_id',
      extraStaffChangeId: 'extra_staff_change_id',
      pluginExtraMeta: 'plugin_extra_meta',
      inspectBillLabelList: 'inspect_bill_label_list',
      inspectBillState: 'inspect_bill_state',
      inspectBillErrNote: 'inspect_bill_err_note',
      inspectBillNote: 'inspect_bill_note',
      bizExtraWorkflowIds: 'biz_extra_workflow_ids',
      addendumOrderInfo: 'addendum_order_info',
      oaLeaveOrderInfo: 'oa_leave_order_info',
      oaExtraWorkOrderInfo: 'oa_extra_work_order_info',
      bizExtraHouseContractInfo: 'biz_extra_house_contract_info',

      positiveOrderInfo: 'positive_order_info',
      oaOrganizationOrderInfo: 'oa_organization_order_info',
      recruitmentOrderInfo: 'recruitment_order_info',
      renewContractOrderInfo: 'renewContract_order_info',
      humanResourceTransferOrderInfo: 'human_resource_transfer_order_info',
      departureOrderInfo: 'departure_order_info',
      handoverOrderInfo: 'handover_order_info',
      employOrderInfo: 'employ_order_info',
      leaveOrderInfo: 'leave_order_info',
      extraWorkOrderInfo: 'extraWork_order_info',
      breakOrderInfo: 'break_order_info',
      attendanceExceptionOrderInfo: 'attendance_exception_order_info',
      sealModifyOrderInfo: 'seal_modify_order_info',
      sealUseOrderInfo: 'seal_use_order_info',
      visitingCardOrderInfo: 'visiting_card_order_info',
      certBorrowOrderInfo: 'cert_borrow_order_info',
      prizeOrderInfo: 'prize_order_info',
      sealUseOrderInfo: 'seal_use_order_info',
      firmModifyOrderInfo: 'firm_modify_order_info',
      firmBankOrderInfo: 'firm_bank_order_info',
      pactApplyOrderInfo: 'pact_apply_order_info',
      pactBorrowOrderInfo: 'pact_borrow_order_info',

      recruitmentOrderInfo: 'recruitment_order_info',
      renewContractOrderInfo: 'renewContract_order_info',
      humanResourceTransferOrderInfo: 'human_resource_transfer_order_info',
      departureOrderInfo: 'departure_order_info',
      handoverOrderInfo: 'handover_order_info',
      employOrderInfo: 'employ_order_info',
      leaveOrderInfo: 'leave_order_info',
      extraWorkOrderInfo: 'extraWork_order_info',
      breakOrderInfo: 'break_order_info',
      attendanceExceptionOrderInfo: 'attendance_exception_order_info',
      sealModifyOrderInfo: 'seal_modify_order_info',
      sealUseOrderInfo: 'seal_use_order_info',
      visitingCardOrderInfo: 'visiting_card_order_info',
      certBorrowOrderInfo: 'cert_borrow_order_info',
      prizeOrderInfo: 'prize_order_info',
      sealUseOrderInfo: 'seal_use_order_info',
      firmModifyOrderInfo: 'firm_modify_order_info',
      firmBankOrderInfo: 'firm_bank_order_info',
      pactApplyOrderInfo: 'pact_apply_order_info',
      pactBorrowOrderInfo: 'pact_borrow_order_info',
      petitionOrderInfo: 'petition_order_info',
      employmentApplyOrderInfo: 'employment_apply_order_info',
      capitalAllocateOrderInfo: 'capital_allocate_order_info',
    };
  }
}

// 付款审批流转记录摘要
class ApplicationOrderFlowRecordBrief extends CoreObject {
  constructor() {
    super();
    this.rejectToRecordAccounts = {};           // 驳回至审批人信息(手动添加)
    this.flexibleCcAccountInfoList = []; // 抄送用户
    this.flexibleCcDepartmentInfoList = [], // 抄送部门
    this.flexibleCcDepartmentJobRelationInfoList = [], // 抄送岗位
    this.fixedCcAccountInfoList = [], // 固定抄送用户
    this.fixedCcDepartmentInfoList = [], // 固定抄送部门
    this.fixedCcDepartmentJobRelationInfoList = [], // 固定抄送岗位
    this.accountInfo = undefined;               // 流转记录操作人信息
    this.id = undefined;                        // OA审批单流转明细记录id
    this.extraInfoList = [];                    // 扩展信息列表
    this.operateAccountList = [];               // 审批人列表
    this.ccAccountList = [];                    // 抄送人列表
    this.orderId = undefined;                   // 审批单ID
    this.flowId = undefined;                    // 审批流ID
    this.indexNum = 0;                          // 归属流程节点序号, 0 代表是首个提报记录
    this.rejectToNodeId = undefined;            // 驳回至新节点 用于驳回，记录驳回后的返回的节点ID
    this.rejectToNodeInfo = undefined;          // 驳回至的审批流节点的摘要
    this.state = 0;                             // 审批状态 1 待处理 10 待补充 50 异常 100 通过 -100 驳回
    this.urgeState = false;                     // 当前记录的催办状态 false 未催办 true 已催办
    this.note = '';                             // 操作说明
    this.nodeId = undefined;                    // 审批流程节点ID 提报记录节点为 None
    this.flowNodeInfo = undefined;              // 审批流程节点摘要
    this.operatedAt = undefined;                // 实际审批操作时间
    this.createdAt = undefined;                 // 创建时间（待处理）
    this.approvedAt = undefined;                // 同意审批操作时间
    this.rejectedAt = undefined;                // 驳回审批操作时间
    this.closedAt = undefined;                  // 关闭审批操作时间
    this.operatePostList = undefined;           // 审批岗位（手动添加）
    this.operatePostIds = undefined;            // 当前流转记录可操作岗位id列表（手动添加）
    this.operateAccounts = undefined;           // 当前流转记录可了操作人id列表（手动添加）
    this.approvalTransferReason = undefined;    // 转交原因
    this.historyApprovalAccountList = [];       // 历史审批人列表
    this.transferAt = undefined;                // 转交时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      reject_to_record_accounts: 'rejectToRecordAccounts',
      flexible_cc_account_info_list: 'flexibleCcAccountInfoList',
      flexible_cc_department_info_list: 'flexibleCcDepartmentInfoList',
      flexible_cc_department_job_relation_info_list: 'flexibleCcDepartmentJobRelationInfoList',
      fixed_cc_account_info_list: 'fixedCcAccountInfoList',
      fixed_cc_department_info_list: 'fixedCcDepartmentInfoList',
      fixed_cc_department_job_relation_info_list: 'fixedCcDepartmentJobRelationInfoList',
      account_info: {
        key: 'accountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      _id: 'id',
      extra_info_list: {
        key: 'extraInfoList',
        transform: value => CoreObject.mapperEach(value, OaApplicationOrderFlowExtra),
      },
      operate_account_list: {
        key: 'operateAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      cc_account_list: {
        key: 'ccAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      order_id: 'orderId',
      flow_id: 'flowId',
      index_num: 'indexNum',
      reject_to_node_id: 'rejectToNodeId',
      reject_to_node_info: {
        key: 'rejectToNodeInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowNodeBrief),
      },
      state: 'state',
      urge_state: 'urgeState',
      note: 'note',
      node_id: 'nodeId',
      flow_node_info: {
        key: 'flowNodeInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowNodeBrief),
      },
      operated_at: 'operatedAt',
      created_at: 'createdAt',
      approved_at: 'approvedAt',
      rejected_at: 'rejectedAt',
      closed_at: 'closedAt',
      operate_post_list: 'operatePostList',
      operate_post_ids: 'operatePostIds',
      operate_accounts: 'operateAccounts',
      approval_transfer_reason: 'approvalTransferReason',
      history_approval_account_list: 'historyApprovalAccountList',
      transfer_at: 'transferAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      rejectToRecordAccounts: 'reject_to_record_accounts',
      flexibleCcAccountInfoList: 'flexible_cc_account_info_list',
      flexibleCcDepartmentInfoList: 'flexible_cc_department_info_list',
      flexibleCcDepartmentJobRelationInfoList: 'flexible_cc_department_job_relation_info_list',
      fixedCcAccountInfoList: 'fixed_cc_account_info_list',
      fixedCcDepartmentInfoList: 'fixed_cc_department_info_list',
      fixedCcDepartmentJobRelationInfoList: 'fixed_cc_department_job_relation_info_list',
      accountInfo: {
        key: 'account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      id: '_id',
      extraInfoList: {
        key: 'extra_info_list',
        transform: value => CoreObject.revertEach(value, OaApplicationOrderFlowExtra),
      },
      operateAccountList: {
        key: 'operate_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      ccAccountList: {
        key: 'cc_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      orderId: 'order_id',
      flowId: 'flow_id',
      indexNum: 'index_num',
      rejectToNodeId: 'reject_to_node_id',
      rejectToNodeInfo: {
        key: 'reject_to_node_info',
        transform: value => CoreObject.revert(value, ApplicationFlowNodeBrief),
      },
      state: 'state',
      urgeState: 'urge_state',
      note: 'note',
      nodeId: 'node_id',
      flowNodeInfo: {
        key: 'flow_node_info',
        transform: value => CoreObject.revert(value, ApplicationFlowNodeBrief),
      },
      operatedAt: 'operated_at',
      createdAt: 'created_at',
      approvedAt: 'approved_at',
      rejectedAt: 'rejected_at',
      closedAt: 'closed_at',
      operatePostList: 'operate_post_list',
      operatePostIds: 'operate_post_ids',
      operateAccounts: 'operate_accounts',
      approvalTransferReason: 'approval_transfer_reason',
      historyApprovalAccountList: 'history_approval_account_list',
      transferAt: 'transfer_at',
    };
  }
}

// 审批单流转明细记录
class ApplicationOrderFlowRecordDetail extends CoreObject {
  constructor() {
    super();
    this.extraInfoList = [];                    // 扩展信息
    this.nodeAccountList = [];                  // 审批人列表
    this.ccAccountList = [];                    // 抄送人列表
    this.attachmentPrivateUrls = [];            // 附件私有下载地址
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaApplicationOrderFlowRecord;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      extra_info_list: {
        key: 'extraInfoList',
        transform: value => CoreObject.mapperEach(value, OaApplicationOrderFlowExtra),
      },
      node_account_list: {
        key: 'nodeAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      cc_account_list: {
        key: 'ccAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      attachment_private_urls: 'attachmentPrivateUrls',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      extraInfoList: {
        key: 'extra_info_list',
        transform: value => CoreObject.revertEach(value, OaApplicationOrderFlowExtra),
      },
      nodeAccountList: {
        key: 'node_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      ccAccountList: {
        key: 'cc_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      attachmentPrivateUrls: 'attachment_private_urls',
    };
  }
}

// 成本费用记录分摊摘要
class CostAllocationBrief extends CoreObject {
  constructor() {
    super();
    this.cityCode = '';                         // 城市代码
    this.cityName = '';                         // 城市名称
    this.citySpelling = '';                     // 城市拼写（手动添加）
    this.platformCode = '';                     // 平台
    this.platformName = '';                     // 平台名称
    this.supplierId = undefined;                // 供应商ID
    this.supplierName = '';                     // 供应商
    this.bizDistrictId = undefined;             // 商圈ID
    this.bizDistrictName = '';                  // 商圈
    this.money = 0;                             // 分摊金额(分)
    this.teamId = undefined;                    // 团队id
    this.teamType = undefined;                  // 团队类型
    this.teamName = undefined;                  // 团队名称
    this.teamIdCode = undefined;                // 团队身份证号
    this.staffInfo = undefined;                 // 人员id
    this.assetsId = undefined;                 // 资产
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'cityCode',                   // 城市代码
      'cityName',                   // 城市名称
      'citySpelling',               // 城市拼音
      'platformCode',               // 平台
      'platformName',               // 平台名称
      'supplierId',                 // 供应商ID
      'supplierName',               // 供应商
      'bizDistrictId',              // 商圈ID
      'bizDistrictName',            // 商圈
      'money',                      // 分摊金额(分)
    ];
  }

  // 数据映射
  static datamap() {
    return {
      city_code: 'cityCode',
      city_name: 'cityName',
      city_spelling: 'citySpelling',
      platform_code: 'platformCode',
      platform_name: 'platformName',
      supplier_id: 'supplierId',
      supplier_name: 'supplierName',
      biz_district_id: 'bizDistrictId',
      biz_district_name: 'bizDistrictName',
      money: 'money',
      team_id: 'teamId',
      team_type: 'teamType',
      team_name: 'teamName',
      team_id_code: 'teamIdCode',
      staff_info: 'staffInfo',
      assets_id: 'assetsId',
      profile_id: 'profileId',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cityCode: 'city_code',
      cityName: 'city_name',
      citySpelling: 'city_spelling',
      platformCode: 'platform_code',
      platformName: 'platform_name',
      supplierId: 'supplier_id',
      supplierName: 'supplier_name',
      bizDistrictId: 'biz_district_id',
      bizDistrictName: 'biz_district_name',
      money: 'money',
      teamId: 'team_id',
      teamType: 'team_type',
      teamName: 'team_name',
      teamIdCode: 'team_id_code',
      staffId: 'identity_card_id',
      staffInfo: 'staff_info',
      assetsId: 'assets_id',
      profileId: 'profile_id',
    };
  }
}

// 催办记录详情
class ApplicationUrgeRecordDetail extends CoreObject {
  constructor() {
    super();
    this.stateTitle = '';                       // 状态名称
    this.creatorInfo = undefined;               // 催办人信息
    this.applicationOrderInfo = undefined;      // OA审批单信息(包含审批流信息)
    this.flowRecordInfo = undefined;            // OA审批单流转明细记录（含被催办节点信息)
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaApplicationUrgeRecord;
  }

  // 必填字段
  static requiredFields() {
    return [
      'stateTitle',                 // 状态名称
      'creatorInfo',                // 催办人信息
      'applicationOrderInfo',       // OA审批单信息(包含审批流信息)
      'flowRecordInfo',             // OA审批单流转明细记录（含被催办节点信息)
    ];
  }

  // 数据映射
  static datamap() {
    return {
      state_title: 'stateTitle',
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      application_order_info: {
        key: 'applicationOrderInfo',
        transform: value => CoreObject.mapper(value, ApplicationOrderListItem),
      },
      flow_record_info: {
        key: 'flowRecordInfo',
        transform: value => CoreObject.mapper(value, ApplicationOrderFlowRecordBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      stateTitle: 'state_title',
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      applicationOrderInfo: {
        key: 'application_order_info',
        transform: value => CoreObject.revert(value, ApplicationOrderListItem),
      },
      flowRecordInfo: {
        key: 'flow_record_info',
        transform: value => CoreObject.revert(value, ApplicationOrderFlowRecordBrief),
      },
    };
  }
}

// 成本费用记录列表记录
class CostOrderListItem extends CoreObject {
  constructor() {
    super();
    this.platformNames = [];                    // 平台名称列表(手动添加)
    this.cityNames = [];                        // 城市名称列表
    this.supplierNames = [];                    // 供应商名称列表
    this.bizDistrictNames = [];                 // 商圈名称列表
    this.costAccountingInfo = undefined;        // 费用科目摘要
    this.costGroupName = '';                    // 费用分组名称
    this.applyAccountInfo = undefined;          // 提报人摘要信息
    this.costAllocationList = [];               // OA 成本费用记录分摊清单(手动添加)
    this.belongTime = 0;                        // 归属周期
    this.paidMonth = 0;                         // 付款周期
    this.attachmentPrivateUrls = [];            // 费用单上传附件下载地址(手动添加)
    this.invoiceTitle = '';                     // 发票抬头(手动添加)
    this.themeLabelList = [];                   // 主题标签(手动添加)
    this.type = undefined; // 费用单类型（手动添加）
    this.isBook = false; // 是否可付款（手动添加）
    this.bookMonth = undefined; // 记账周期（手动添加）
    this.totalCostBillAmount = undefined; // 实时汇总发票总金额（手动添加）
    this.totalTaxAmountAmount = undefined; // 实时汇总发票总税额（手动添加）
    this.totalTaxDeductionAmount = undefined; // 实时汇总发票总去税额（手动添加）
    this.applicationOrderInfo = undefined;    // 费用单类型(手动添加)(记录明细需要用到)
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaCostOrder;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      platform_names: 'platformNames',
      city_names: 'cityNames',
      supplier_names: 'supplierNames',
      biz_district_names: 'bizDistrictNames',
      theme_label_list: 'themeLabelList',
      cost_accounting_info: {
        key: 'costAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingBrief),
      },
      cost_group_name: 'costGroupName',
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      cost_allocation_list: {
        key: 'costAllocationList',
        transform: value => CoreObject.mapperEach(value, CostAllocationBrief),
      },
      belong_time: 'belongTime',
      paid_month: 'paidMonth',
      attachment_private_urls: 'attachmentPrivateUrls',
      biz_extra_travel_apply_order_id: 'bizExtraTravelApplyOrderId',
      invoice_title: 'invoiceTitle',
      type: 'type',
      is_book: 'isBook',
      book_month: 'bookMonth',
      total_cost_bill_amount: 'totalCostBillAmount',
      total_tax_amount_amount: 'totalTaxAmountAmount',
      total_tax_deduction_amount: 'totalTaxDeductionAmount',
      application_order_info: 'applicationOrderInfo',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      platformNames: 'platform_names',
      cityNames: 'city_names',
      supplierNames: 'supplier_names',
      bizDistrictNames: 'biz_district_names',
      themeLabelList: 'theme_label_list',
      costAccountingInfo: {
        key: 'cost_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingBrief),
      },
      costGroupName: 'cost_group_name',
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      costAllocationList: {
        key: 'cost_allocation_list',
        transform: value => CoreObject.revertEach(value, CostAllocationBrief),
      },
      belongTime: 'belong_time',
      paidMonth: 'paid_month',
      attachmentPrivateUrls: 'attachmentPrivateUrls',
      bizExtraTravelApplyOrderId: 'biz_extra_travel_apply_order_id',
      invoiceTitle: 'invoice_title',
      type: 'type',
      isBook: 'is_book',
      bookMonth: 'book_month',
      totalCostBillAmount: 'total_cost_bill_amount',
      totalTaxAmountAmount: ' total_tax_amount_amount',
      totalTaxDeductionAmount: 'total_tax_deduction_amount',
      applicationOrderInfo: 'application_order_info',
    };
  }
}

// 成本费用记录摘要
class CostOrderBrief extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // 成本费用记录单id
    this.cityNames = [];                        // 城市名称列表
    this.supplierNames = [];                    // 供应商名称列表
    this.bizDistrictNames = [];                 // 商圈名称列表
    this.costAccountingInfo = undefined;        // 费用科目摘要
    this.costGroupName = '';                    // 费用分组名称
    this.state = 0;                             // 单据状态 -100 删除 50 进行中 100 完成 1 待提交
    this.allocationMode = 0;                    // 成本归属分摊模式（ 6 平均分摊 8 自定义分摊）
    this.note = '';                             // 备注
    this.attachments = [];                      // 附件Key列表
    this.attachmentPrivateUrls = [];            // 附件私有下载地址
    this.usage = '';                            // 用途
    this.totalMoney = 0;                        // 总金额（支付报销金额)
    this.invoiceFlag = false;                   // 发票标记(true 有 false 无)
    this.invoiceTitle = undefined;                   // 发票抬头
    this.applyAccountInfo = undefined;          // 提报人摘要信息
    this.payeeInfo = {};                        // 收款人信息
    this.bizExtraHouseContractId = undefined;   // 业务附加信息==》 房屋租赁合同ID
    this.costAllocationList = [];               // OA 成本费用记录分摊清单
    this.costGroupInfo = undefined;             // 成本费用分组摘要
    this.bizExtraHouseContractInfo = undefined; // 租房合同（暂时没有定义）
    this.bizExtraTravelApplyOrderId = undefined;   // 差旅报销单Id (手动添加)
    this.bizExtraData = undefined;                 // 差旅报销单费用信息 (手动添加)
    this.bizExtraTravelApplyOrderInfo = undefined; // 出差信息 (手动添加)
    this.type = undefined; // 费用单类型（手动添加）
    this.totalCostBillAmount = undefined; // 实时汇总发票总金额（手动添加）
    this.totalTaxAmountAmount = undefined; // 实时汇总发票总税额（手动添加）
    this.totalTaxDeductionAmount = undefined; // 实时汇总发票总去税额（手动添加）
    this.costBillList = undefined; // 发票列表（手动添加）
    this.billRedPushState = undefined; // 费用单发票红冲状态（手动添加）
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      city_names: 'cityNames',
      supplier_names: 'supplierNames',
      biz_district_names: 'bizDistrictNames',
      cost_accounting_info: {
        key: 'costAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingBrief),
      },
      cost_group_name: 'costGroupName',
      state: 'state',
      allocation_mode: 'allocationMode',
      note: 'note',
      attachments: 'attachments',
      attachment_private_urls: 'attachmentPrivateUrls',
      usage: 'usage',
      total_money: 'totalMoney',
      invoice_flag: 'invoiceFlag',
      biz_extra_travel_apply_order_id: 'bizExtraTravelApplyOrderId',
      biz_extra_travel_apply_order_info: 'bizExtraTravelApplyOrderInfo',
      biz_extra_data: 'bizExtraData',
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      payee_info: 'payeeInfo',
      biz_extra_house_contract_id: 'bizExtraHouseContractId',
      cost_allocation_list: {
        key: 'costAllocationList',
        transform: value => CoreObject.mapperEach(value, CostAllocationBrief),
      },
      cost_group_info: {
        key: 'costGroupInfo',
        transform: value => CoreObject.mapper(value, CostGroupBrief),
      },
      biz_extra_house_contract_info: {
        key: 'bizExtraHouseContractInfo',
        transform: value => CoreObject.mapper(value, OaHouseContract),
      },
      type: 'type',
      total_cost_bill_amount: 'totalCostBillAmount',
      total_tax_amount_amount: 'totalTaxAmountAmount',
      total_tax_deduction_amount: 'totalTaxDeductionAmount',
      cost_bill_list: 'costBillList',
      bill_red_push_state: 'billRedPushState',
      invoice_title: 'invoiceTitle',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      cityNames: 'city_names',
      supplierNames: 'supplier_names',
      bizDistrictNames: 'biz_district_names',
      costAccountingInfo: {
        key: 'cost_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingBrief),
      },
      costGroupName: 'cost_group_name',
      state: 'state',
      allocationMode: 'allocation_mode',
      note: 'note',
      attachments: 'attachments',
      attachmentPrivateUrls: 'attachment_private_urls',
      usage: 'usage',
      totalMoney: 'total_money',
      invoiceFlag: 'invoice_flag',
      bizExtraTravelApplyOrderId: 'biz_extra_travel_apply_order_id',
      bizExtraData: 'biz_extra_data',
      bizExtraTravelApplyOrderInfo: 'biz_extra_travel_apply_order_info',
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      payeeInfo: 'payee_info',
      bizExtraHouseContractId: 'biz_extra_house_contract_id',
      costAllocationList: {
        key: 'cost_allocation_list',
        transform: value => CoreObject.revertEach(value, CostAllocationBrief),
      },
      costGroupInfo: {
        key: 'cost_group_info',
        transform: value => CoreObject.revert(value, CostGroupBrief),
      },
      bizExtraHouseContractInfo: {
        key: 'biz_extra_house_contract_info',
        transform: value => CoreObject.revert(value, OaHouseContract),
      },
      type: 'type',
      totalCostBillAmount: 'total_cost_bill_amount',
      totalTaxAmountAmount: ' total_tax_amount_amount',
      totalTaxDeductionAmount: 'total_tax_deduction_amount',
      costBillList: 'cost_bill_list',
      billRedPushState: 'bill_red_push_state',
      invoiceTitle: 'invoice_title',
    };
  }
}

// 成本费用记录详情
class CostOrderDetail extends CoreObject {
  constructor() {
    super();
    this.applyAccountInfo = undefined;          // 申请人信息
    this.cityNames = [];                        // 城市名称列表
    this.supplierNames = [];                    // 供应商名称列表
    this.platformNames = [];                    // 平台名称列表
    this.bizDistrictNames = [];                 // 商圈名称列表
    this.costAccountingInfo = undefined;        // 费用科目摘要
    this.costGroupId = '';                      // 成本费用分组id
    this.costGroupName = '';                    // 成本费用分组名称
    this.costAccountingCode = undefined;        // 科目编码（手动添加）
    this.pledgeMoneyToRentMoney = undefined;    // 押金转组件(手动添加)
    this.bizExtraHouseContractInfo = undefined; // 租房合同
    this.cityNames = [];                        // 城市名称列表
    this.costAllocationList = [];               // OA 成本费用记录分摊清单
    this.attachmentPrivateUrls = [];            // 附件私有下载地址
    this.note = '';                             // 备注
    this.bizExtraTravelApplyOrderInfo = '';     // 出差信息
    this.bizExtraTravelApplyOrderId = '';       // 出差申请单id
    this.invoiceTitle = '';                     // 发票抬头
    this.isRefundRedRush = undefined;           // 退款/红冲审批单
    this.refCostOrderIds = undefined;            // 新的审批单号（手动添加）
    this.refCostOrderInfoList = [];             // 退款,红冲审批数据（手动添加）
    this.costOrderExistsRefoundRedRush = undefined; // 红冲退款类型(手动添加)
    this.totalCostBillAmount = undefined; // 实时汇总发票总金额（手动添加）
    this.totalTaxAmountAmount = undefined; // 实时汇总发票总税额（手动添加）
    this.totalTaxDeductionAmount = undefined; // 实时汇总发票总去税额（手动添加）
    this.costBillList = undefined; // 发票列表（手动添加）
    this.type = undefined; // 费用单类型（手动添加）
    this.billRedPushState = undefined; // 费用单发票红冲状态（手动添加）
    this.isBook = undefined; // 记账状态（手动添加）
    this.payeeList = []; // 付款明细
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaCostOrder;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      payee_list: 'payeeList',
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      city_names: 'cityNames',
      supplier_names: 'supplierNames',
      platform_names: 'platformNames',
      biz_district_names: 'bizDistrictNames',
      cost_accounting_info: {
        key: 'costAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingBrief),
      },
      cost_group_id: 'costGroupId',
      cost_group_name: 'costGroupName',
      biz_extra_house_contract_info: {
        key: 'bizExtraHouseContractInfo',
        transform: value => CoreObject.mapper(value, OaHouseContract),
      },
      cost_allocation_list: {
        key: 'costAllocationList',
        transform: value => CoreObject.mapperEach(value, CostAllocationBrief),
      },
      attachment_private_urls: 'attachmentPrivateUrls',
      note: 'note',
      biz_extra_travel_apply_order_id: 'bizExtraTravelApplyOrderId',
      biz_extra_travel_apply_order_info: 'bizExtraTravelApplyOrderInfo',
      invoice_title: 'invoiceTitle',
      is_refund_red_rush: 'isRefundRedRush',
      ref_cost_order_ids: 'refCostOrderIds',
      ref_cost_order_info_list: 'refCostOrderInfoList',
      cost_order_exists_refound_red_rush: 'costOrderExistsRefoundRedRush',
      cost_accounting_code: 'costAccountingCode',
      pledge_money_to_rent_money: 'pledgeMoneyToRentMoney',
      total_cost_bill_amount: 'totalCostBillAmount',
      total_tax_amount_amount: 'totalTaxAmountAmount',
      total_tax_deduction_amount: 'totalTaxDeductionAmount',
      cost_bill_list: 'costBillList',
      type: 'type',
      bill_red_push_state: 'billRedPushState',
      is_book: 'isBook',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      payeeList: 'payee_list',
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      cityNames: 'city_names',
      supplierNames: 'supplier_names',
      platformNames: 'platform_names',
      bizDistrictNames: 'biz_district_names',
      costAccountingInfo: {
        key: 'cost_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingBrief),
      },
      costGroupId: 'cost_group_id',
      costGroupName: 'cost_group_name',
      bizExtraHouseContractInfo: {
        key: 'biz_extra_house_contract_info',
        transform: value => CoreObject.revert(value, OaHouseContract),
      },
      costAllocationList: {
        key: 'cost_allocation_list',
        transform: value => CoreObject.revertEach(value, CostAllocationBrief),
      },
      attachmentPrivateUrls: 'attachment_private_urls',
      note: 'note',
      bizExtraTravelApplyOrderId: 'biz_extra_travel_apply_order_id',
      bizExtraTravelApplyOrderInfo: 'biz_extra_travel_apply_order_info',
      invoiceTitle: 'invoice_title',
      isRefundRedRush: 'is_refund_red_rush',
      refCostOrderIds: 'ref_cost_order_ids',
      refCostOrderInfoList: 'ref_cost_order_info_list',
      costOrderExistsRefoundRedRush: 'cost_order_exists_refound_red_rush',
      costAccountingCode: 'cost_accounting_code',
      pledgeMoneyToRentMoney: 'pledge_money_to_rent_money',
      totalCostBillAmount: 'total_cost_bill_amount',
      totalTaxAmountAmount: ' total_tax_amount_amount',
      totalTaxDeductionAmount: 'total_tax_deduction_amount',
      costBillList: 'cost_bill_list',
      type: 'type',
      billRedPushState: 'bill_red_push_state',
      isBook: 'is_book',
    };
  }
}

// 系统消息详情
class SysNoticeDetail extends CoreObject {
  constructor() {
    super();
    this.channelName = '';                      // 消息总线名称
    this.broadTypeTitle = '';                   // 广播类型名称
    this.eventId = 0;                           // 事件ID
    this.eventTitle = '';                       // 事件名称
    this.eventExtra = {};                       // 事件参数
    this.isSent = false;                        // 是否已送达
    this.isRead = false;                        // 是否已送达
    this.isDone = false;                        // 是否已送达
    this.isDeleted = false;                     // 是否已送达
    this.isBroadGlobal = false;                 // 是否全局消息
    this.isBroadCustom = false;                 // 是否定向消息
    this.accountList = [];                      // 定向接收人账号
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return CommonMessage;
  }

  // 必填字段
  static requiredFields() {
    return [
      'channelName',                // 消息总线名称
      'broadTypeTitle',             // 广播类型名称
      'eventId',                    // 事件ID
      'eventTitle',                 // 事件名称
      'isSent',                     // 是否已送达
      'isRead',                     // 是否已送达
      'isDone',                     // 是否已送达
      'isDeleted',                  // 是否已送达
      'isBroadGlobal',              // 是否全局消息
      'isBroadCustom',              // 是否定向消息
    ];
  }

  // 数据映射
  static datamap() {
    return {
      channel_name: 'channelName',
      broad_type_title: 'broadTypeTitle',
      event_id: 'eventId',
      event_title: 'eventTitle',
      event_extra: 'eventExtra',
      is_sent: 'isSent',
      is_read: 'isRead',
      is_done: 'isDone',
      is_deleted: 'isDeleted',
      is_broad_global: 'isBroadGlobal',
      is_broad_custom: 'isBroadCustom',
      account_list: {
        key: 'accountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      channelName: 'channel_name',
      broadTypeTitle: 'broad_type_title',
      eventId: 'event_id',
      eventTitle: 'event_title',
      eventExtra: 'event_extra',
      isSent: 'is_sent',
      isRead: 'is_read',
      isDone: 'is_done',
      isDeleted: 'is_deleted',
      isBroadGlobal: 'is_broad_global',
      isBroadCustom: 'is_broad_custom',
      accountList: {
        key: 'account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
    };
  }
}

// BOSS助理消息详情
class BossAssistNoticeDetail extends CoreObject {
  constructor() {
    super();
    this.channelName = '';                      // 消息总线名称
    this.broadTypeTitle = '';                   // 广播类型名称
    this.isSent = false;                        // 是否已送达
    this.isRead = false;                        // 是否已送达
    this.isDone = false;                        // 是否已送达
    this.isDeleted = false;                     // 是否已送达
    this.isBroadGlobal = false;                 // 是否全局消息
    this.isBroadCustom = false;                 // 是否定向消息
    this.accountList = [];                      // 定向接收人账号
    this.eventId = 0;                           // 事件ID，1(催办) 2(待处理审批)
    this.eventTitle = '';                       // 事件名称，如催办消息/待处理审批
    this.eventExtra = {};                       // 事件参数
    this.oaApplicationOrderId = '';             // 审批单ID
    this.oaApplicationRecordId = '';            // 审批记录ID
    this.oaUrgeRecordId = '';                   // 催办记录ID
    this.oaUrgeRecordInfo = {};                 // 催办信息
    this.oaUrgeRecordInfo.flowId = '';          // 审批流ID
    this.oaUrgeRecordInfo.flowName = '';        // 审批流名称
    this.oaUrgeRecordInfo.nodeId = '';          // 被催办的节点ID
    this.oaUrgeRecordInfo.nodeName = '';        // 节点ID
    this.oaUrgeRecordInfo.flowRecordId = '';    // 被催办的审批记录ID
    this.oaUrgeRecordInfo.creatorInfo = undefined;// 催办人信息
    this.oaUrgeRecordInfo.state = 0;            // 催办状态
    this.oaUrgeRecordInfo.stateTitle = '';      // 催办状态名称
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return CommonMessage;
  }

  // 必填字段
  static requiredFields() {
    return [
      'channelName',                // 消息总线名称
      'broadTypeTitle',             // 广播类型名称
      'isSent',                     // 是否已送达
      'isRead',                     // 是否已送达
      'isDone',                     // 是否已送达
      'isDeleted',                  // 是否已送达
      'isBroadGlobal',              // 是否全局消息
      'isBroadCustom',              // 是否定向消息
      'eventId',                    // 事件ID，1(催办) 2(待处理审批)
      'eventTitle',                 // 事件名称，如催办消息/待处理审批
    ];
  }

  // 数据映射
  static datamap() {
    return {
      channel_name: 'channelName',
      broad_type_title: 'broadTypeTitle',
      is_sent: 'isSent',
      is_read: 'isRead',
      is_done: 'isDone',
      is_deleted: 'isDeleted',
      is_broad_global: 'isBroadGlobal',
      is_broad_custom: 'isBroadCustom',
      account_list: {
        key: 'accountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      event_id: 'eventId',
      event_title: 'eventTitle',
      event_extra: 'eventExtra',
      oa_application_order_id: 'oaApplicationOrderId',
      oa_application_record_id: 'oaApplicationRecordId',
      oa_urge_record_id: 'oaUrgeRecordId',
      oa_urge_record_info: 'oaUrgeRecordInfo',
      'oa_urge_record_info.flow_id': 'oaUrgeRecordInfo.flowId',
      'oa_urge_record_info.flow_name': 'oaUrgeRecordInfo.flowName',
      'oa_urge_record_info.node_id': 'oaUrgeRecordInfo.nodeId',
      'oa_urge_record_info.node_name': 'oaUrgeRecordInfo.nodeName',
      'oa_urge_record_info.flow_record_id': 'oaUrgeRecordInfo.flowRecordId',
      'oa_urge_record_info.creator_info': {
        key: 'oaUrgeRecordInfo.creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      'oa_urge_record_info.state': 'oaUrgeRecordInfo.state',
      'oa_urge_record_info.state_title': 'oaUrgeRecordInfo.stateTitle',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      channelName: 'channel_name',
      broadTypeTitle: 'broad_type_title',
      isSent: 'is_sent',
      isRead: 'is_read',
      isDone: 'is_done',
      isDeleted: 'is_deleted',
      isBroadGlobal: 'is_broad_global',
      isBroadCustom: 'is_broad_custom',
      accountList: {
        key: 'account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      eventId: 'event_id',
      eventTitle: 'event_title',
      eventExtra: 'event_extra',
      oaApplicationOrderId: 'oa_application_order_id',
      oaApplicationRecordId: 'oa_application_record_id',
      oaUrgeRecordId: 'oa_urge_record_id',
      oaUrgeRecordInfo: 'oa_urge_record_info',
      'oaUrgeRecordInfo.flowId': 'oa_urge_record_info.flow_id',
      'oaUrgeRecordInfo.flowName': 'oa_urge_record_info.flow_name',
      'oaUrgeRecordInfo.nodeId': 'oa_urge_record_info.node_id',
      'oaUrgeRecordInfo.nodeName': 'oa_urge_record_info.node_name',
      'oaUrgeRecordInfo.flowRecordId': 'oa_urge_record_info.flow_record_id',
      'oaUrgeRecordInfo.creatorInfo': {
        key: 'oa_urge_record_info.creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      'oaUrgeRecordInfo.state': 'oa_urge_record_info.state',
      'oaUrgeRecordInfo.stateTitle': 'oa_urge_record_info.state_title',
    };
  }
}

// 房屋合同列表
class HouseContractListItem extends CoreObject {
  constructor() {
    super();
    this.cityNames = [];                        // 城市名称列表
    this.supplierNames = [];                    // 供应商名称列表
    this.platformNames = [];                    // 平台名称列表
    this.operatorInfo = undefined;              // 最新操作人
    this.creatorInfo = undefined;               // 创建人
    this.houseNo = undefined;                   // 房屋编号
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaHouseContract;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      city_names: 'cityNames',
      supplier_names: 'supplierNames',
      platform_names: 'platformNames',
      house_no: 'houseNo',
      operator_info: {
        key: 'operatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cityNames: 'city_names',
      supplierNames: 'supplier_names',
      platformNames: 'platform_names',
      houseNo: 'house_no',
      operatorInfo: {
        key: 'operator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
    };
  }
}

// 房屋合同详情
class HouseContractDetail extends CoreObject {
  constructor() {
    super();
    this.cityNames = [];                        // 城市名称列表
    this.supplierNames = [];                    // 供应商名称列表
    this.platformNames = [];                    // 平台名称列表
    this.creatorInfo = undefined;               // 创建人信息
    this.operatorInfo = undefined;              // 最新操作人(手动添加映射)
    this.stateTitle = '';                       // 状态名
    this.bizStateTitle = '';                    // 业务状态名
    this.allocationModeTitle = '';              // 平均分摊
    this.rentAccountingInfo = undefined;        // 房租科目
    this.pledgeAccountingInfo = undefined;      // 押金科目
    this.agentAccountingInfo = undefined;       // 中介费科目
    this.lostAccountingName = '';               // 押金损失科目名
    this.costAllocationList = [];               // 成本归属分摊列表
    this.attachmentPrivateUrls = [];            // 附件私有下载地址
    this.agentInvoiceTitle = '';                // 发票抬头
    this.houseContractAllocation = undefined;   // 租金分摊记录（手动添加）
    this.houseNo = undefined;                   // 房屋编号
    this.houseSource = undefined;               // 房屋来源
    this.recentPayInfo = undefined;             // 最近一次付款信息
    this.unrefundedPledgeMoney = undefined;       // 未退押金
    this.pcUsage = [];                          // 合同用途
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaHouseContract;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      city_names: 'cityNames',
      supplier_names: 'supplierNames',
      platform_names: 'platformNames',
      house_no: 'houseNo',
      house_source: 'houseSource',
      unrefunded_pledge_money: 'unrefundedPledgeMoney',
      pc_usage: 'pcUsage',
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      operator_info: {
        key: 'operatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      state_title: 'stateTitle',
      biz_state_title: 'bizStateTitle',
      allocation_mode_title: 'allocationModeTitle',
      rent_accounting_info: {
        key: 'rentAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingTiny),
      },
      pledge_accounting_info: {
        key: 'pledgeAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingTiny),
      },
      agent_accounting_info: {
        key: 'agentAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingTiny),
      },
      lost_accounting_name: 'lostAccountingName',
      cost_allocation_list: {
        key: 'costAllocationList',
        transform: value => CoreObject.mapperEach(value, CostAllocationBrief),
      },
      attachment_private_urls: 'attachmentPrivateUrls',
      agent_invoice_title: 'agentInvoiceTitle',
      house_cantract_allocation: 'houseContractAllocation',
      recent_pay_info: 'recentPayInfo',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cityNames: 'city_names',
      supplierNames: 'supplier_names',
      platformNames: 'platform_names',
      houseNo: 'house_no',
      houseSource: 'house_source',
      unrefundedPledgeMoney: 'unrefunded_pledge_money',
      pcUsage: 'pc_usage',
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      operatorInfo: {
        key: 'operator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      stateTitle: 'state_title',
      bizStateTitle: 'biz_state_title',
      allocationModeTitle: 'allocation_mode_title',
      rentAccountingInfo: {
        key: 'rent_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingTiny),
      },
      pledgeAccountingInfo: {
        key: 'pledge_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingTiny),
      },
      agentAccountingInfo: {
        key: 'agent_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingTiny),
      },
      lostAccountingName: 'lost_accounting_name',
      costAllocationList: {
        key: 'cost_allocation_list',
        transform: value => CoreObject.revertEach(value, CostAllocationBrief),
      },
      attachmentPrivateUrls: 'attachment_private_urls',
      agentInvoiceTitle: 'agent_invoice_title',
      houseContractAllocation: 'house_cantract_allocation',
      recentPayInfo: 'recent_pay_info',
    };
  }
}

// 费用月度汇总摘要(手动添加映射)
class CostBookMonthbrief extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.acountingId = undefined;               // 科目id
    this.costTargetId = '';                     // 归属对象
    this.bookMonth = 0;                         // 记账月份
    this.money = 0;                             // 汇总金额
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      acounting_id: 'acountingId',
      cost_target_id: 'costTargetId',
      book_month: 'bookMonth',
      money: 'money',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      acountingId: 'acounting_id',
      costTargetId: 'cost_target_id',
      bookMonth: 'book_month',
      money: 'money',
    };
  }
}

// 费用月度提报金额汇总摘要(手动添加映射)
class CostOrderSubmitBrief extends CoreObject {
  constructor() {
    super();
    this.amountMoney = 0;                          // 金额
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 数据映射
  static datamap() {
    return {
      amount_money: 'amountMoney',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      amountMoney: 'amount_money',
    };
  }
}

// 审批单补充意见下载地址(手动添加)
class FileUrlListBrief extends CoreObject {
  constructor() {
    super();
    this.fileName = '';                          // 文件名
    this.fileUrl = '';                          // 文件名
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      file_name: 'fileName',
      file_url: 'fileUrl',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      fileName: 'file_name',
      fileUrl: 'file_url',
    };
  }
}

// 上一版 module.exports
export {
  AccountBrief,                         // 账号摘要
  CostAccountingBrief,                  // 费用科目摘要
  CostAccountingListItem,               // 费用科目摘要
  CostAccountingDetail,                 // 费用科目详情
  CostGroupBrief,                       // 费用分组摘要
  CostGroupDetail,                      // 费用分组详情
  ApplicationFlowTemplateBrief,         // 审批流模版摘要
  ApplicationFlowTemplateDetail,        // 审批流模版详情
  ApplicationFlowNodeEmbedItem,         // 审批流模版节点列表（嵌入）
  ApplicationFlowNodeBrief,             // 审批流节点摘要（嵌入）
  CostAccountingTiny,                   // 房屋科目
  ApplicationFlowNodeDetail,            // 审批流模版节点详情
  ApplicationOrderListItem,             // 审批单列表
  ApplicationOrderBrief,                // 付款审批摘要
  ApplicationOrderDetail,               // 审批单详情
  ApplicationOrderFlowRecordBrief,      // 付款审批流转记录摘要
  ApplicationOrderFlowRecordDetail,     // 审批单流转明细记录
  CostAllocationBrief,                  // 成本费用记录分摊摘要
  ApplicationUrgeRecordDetail,          // 催办记录详情
  CostOrderListItem,                    // 成本费用记录列表记录
  CostOrderBrief,                       // 成本费用记录摘要
  CostOrderDetail,                      // 成本费用记录详情
  SysNoticeDetail,                      // 系统消息详情
  BossAssistNoticeDetail,               // BOSS助理消息详情
  HouseContractListItem,                // 房屋合同列表
  HouseContractDetail,                  // 房屋合同详情
  CostBookMonthbrief,                   // 费用月度汇总摘要(手动添加映射)
  CostOrderSubmitBrief,                 // 费用月度提报金额汇总摘要(手动添加映射)
  FileUrlListBrief,                     // 审批单补充意见下载地址(手动添加)
};
