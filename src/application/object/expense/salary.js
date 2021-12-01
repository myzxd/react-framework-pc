/**
 * 外键关联对象
 */
import CoreObject from '../core';
// 结算单汇总
class PayrollStatementBrief extends CoreObject {
  constructor() {
    super();
    this.orderCount = 0;                        // 总单量
    this.positionId = 0;                        // 职位ID
    this.qaMoney = 0;                           // 质量补贴金额
    this.updatedAt = undefined;                 // 更新时间
    this.month = 0;                             // 月
    this.year = 0;                              // 年
    this.supplierId = undefined;                // 供应商id
    this.payrollCycleType = 0;                  // 周期类型(按月:1, 按日:2)
    this.payrollPlanId = undefined;             // 服务费计划id
    this.staffCount = 0;                        // 人员数量
    this.adjustmentHrIncState = false;          // 人事补款状态
    this.oaApplicationOrderId = undefined;      // OA审批单ID
    this.state = 0;                             // 状态(1=待审核, 50=审核中,100=审核通过)
    this.adjustmentHrDecState = false;          // 人事扣款状态
    this.workMoney = 0;                         // 出勤补贴金额
    this.startDate = 0;                         // 起始日期
    this.cityCode = '';                         // 城市code
    this.adjustmentStaffIncState = false;       // 人员补款状态
    this.endDate = 0;                           // 结束日期
    this.workType = 0;                          // 工作性质
    this.knightDecMoney = 0;                    // 人员扣款总额
    this.adjustmentStaffDecMoney = 0;           // 人员扣款总额
    this.operationMoney = 0;                    // 管理补贴金额
    this.netPayMoney = 0;                       // 实发总额
    this.adjustmentHrIncMoney = 0;              // 人事补款总额
    this.singleAverageAmount = 0;               // 单均成本
    this.adjustmentStaffDecState = false;       // 人员扣款状态
    this.day = 0;                               // 日
    this.platformCode = '';                     // 平台code
    this.salaryComputeDataSetId = undefined;    // 服务费计算结果集ID
    this.createdAt = undefined;                 // 创建时间
    this.knightIncMoney = 0;                    // 人员补款总额
    this.payableMoney = 0;                      // 应发总额
    this.adjustmentHrDecMoney = 0;              // 人事扣款总额
    this.payrollCycleNo = 0;                    // 服务费计划周期编号
    this.orderMoney = 0;                        // 单量提成金额
    this.adjustmentStaffIncMoney = 0;           // 人员补款总额
    this.id = undefined;                        // _id
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
      order_count: 'orderCount',
      position_id: 'positionId',
      qa_money: 'qaMoney',
      updated_at: 'updatedAt',
      month: 'month',
      year: 'year',
      supplier_id: 'supplierId',
      payroll_cycle_type: 'payrollCycleType',
      payroll_plan_id: 'payrollPlanId',
      staff_count: 'staffCount',
      adjustment_hr_inc_state: 'adjustmentHrIncState',
      oa_application_order_id: 'oaApplicationOrderId',
      state: 'state',
      adjustment_hr_dec_state: 'adjustmentHrDecState',
      work_money: 'workMoney',
      start_date: 'startDate',
      city_code: 'cityCode',
      adjustment_staff_inc_state: 'adjustmentStaffIncState',
      end_date: 'endDate',
      work_type: 'workType',
      knight_dec_money: 'knightDecMoney',
      adjustment_staff_dec_money: 'adjustmentStaffDecMoney',
      operation_money: 'operationMoney',
      net_pay_money: 'netPayMoney',
      adjustment_hr_inc_money: 'adjustmentHrIncMoney',
      single_average_amount: 'singleAverageAmount',
      adjustment_staff_dec_state: 'adjustmentStaffDecState',
      day: 'day',
      platform_code: 'platformCode',
      salary_compute_data_set_id: 'salaryComputeDataSetId',
      created_at: 'createdAt',
      knight_inc_money: 'knightIncMoney',
      payable_money: 'payableMoney',
      adjustment_hr_dec_money: 'adjustmentHrDecMoney',
      payroll_cycle_no: 'payrollCycleNo',
      order_money: 'orderMoney',
      adjustment_staff_inc_money: 'adjustmentStaffIncMoney',
      _id: 'id',
    };
  }

    // 反向映射
  static revertMap() {
    return {
      orderCount: 'order_count',
      positionId: 'position_id',
      qaMoney: 'qa_money',
      updatedAt: 'updated_at',
      month: 'month',
      year: 'year',
      supplierId: 'supplier_id',
      payrollCycleType: 'payroll_cycle_type',
      payrollPlanId: 'payroll_plan_id',
      staffCount: 'staff_count',
      adjustmentHrIncState: 'adjustment_hr_inc_state',
      oaApplicationOrderId: 'oa_application_order_id',
      state: 'state',
      adjustmentHrDecState: 'adjustment_hr_dec_state',
      workMoney: 'work_money',
      startDate: 'start_date',
      cityCode: 'city_code',
      adjustmentStaffIncState: 'adjustment_staff_inc_state',
      endDate: 'end_date',
      workType: 'work_type',
      knightDecMoney: 'knight_dec_money',
      adjustmentStaffDecMoney: 'adjustment_staff_dec_money',
      operationMoney: 'operation_money',
      netPayMoney: 'net_pay_money',
      adjustmentHrIncMoney: 'adjustment_hr_inc_money',
      singleAverageAmount: 'single_average_amount',
      adjustmentStaffDecState: 'adjustment_staff_dec_state',
      day: 'day',
      platformCode: 'platform_code',
      salaryComputeDataSetId: 'salary_compute_data_set_id',
      createdAt: 'created_at',
      knightIncMoney: 'knight_inc_money',
      payableMoney: 'payable_money',
      adjustmentHrDecMoney: 'adjustment_hr_dec_money',
      payrollCycleNo: 'payroll_cycle_no',
      orderMoney: 'order_money',
      adjustmentStaffIncMoney: 'adjustment_staff_inc_money',
      id: '_id',
    };
  }
}

// 服务费试算任务
class SalaryComputeTaskBrief extends CoreObject {
  constructor() {
    super();
    this.computeContext = {};                   // 数据计算上下文环境
    this.supplierId = undefined;                // 供应商id
    this.planId = undefined;                    // 服务费方案id
    this.planRevisionId = undefined;            // 服务费方案修订版本号（每次修改都有变化）
    this.id = undefined;                        // _id
    this.createdAt = undefined;                 // 创建时间
    this.updatedAt = undefined;                 // 更改时间
    this.planVersionId = undefined;             // 服务费方案版本id
    this.state = 0;                             // 1:待试算,50:正在试算,100:试算成功,-100:试算失败
    this.bizDistrictId = undefined;             // 商圈id
    this.cityCode = '';                         // 城市code
    this.fromDate = 0;                          // 生效时间
    this.platformCode = '';                     // 平台code
    this.toDate = 0;                            // 结束时间
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
      compute_context: 'computeContext',
      supplier_id: 'supplierId',
      plan_id: 'planId',
      plan_revision_id: 'planRevisionId',
      _id: 'id',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      plan_version_id: 'planVersionId',
      state: 'state',
      biz_district_id: 'bizDistrictId',
      city_code: 'cityCode',
      from_date: 'fromDate',
      platform_code: 'platformCode',
      to_date: 'toDate',
    };
  }

    // 反向映射
  static revertMap() {
    return {
      computeContext: 'compute_context',
      supplierId: 'supplier_id',
      planId: 'plan_id',
      planRevisionId: 'plan_revision_id',
      id: '_id',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      planVersionId: 'plan_version_id',
      state: 'state',
      bizDistrictId: 'biz_district_id',
      cityCode: 'city_code',
      fromDate: 'from_date',
      platformCode: 'platform_code',
      toDate: 'to_date',
    };
  }
}

// 服务费方案版本
class SalaryPlanVersionBrief extends CoreObject {
  constructor() {
    super();
    this.domain = 0;                            // 作用域
    this.bizDistrictId = undefined;             // 商圈id
    this.configVersionId = undefined;           // 配置版本id
    this.oaDoneAt = undefined;                  // OA提审完成时间
    this.updatedAt = undefined;                 // 更新时间
    this.id = undefined;                        // _id
    this.operatorId = undefined;                // 操作人id
    this.toDate = 0;                            // 结束开始日期
    this.closedAt = undefined;                  // 失效时间
    this.platformCode = '';                     // 平台code
    this.dryRunTaskId = undefined;              // 试算id
    this.supplierId = undefined;                // 供应商id
    this.oaApplyOperatorId = undefined;         // OA申请人id
    this.name = '';                             // 名称
    this.rules = [];                            // 服务费规则
    this.createdAt = undefined;                 // 创建时间
    this.fromDate = undefined;                  // 生效开始日期
    this.planId = undefined;                    // 服务费方案id
    this.oaApplicationOrderId = undefined;      // OA审批单ID
    this.state = 0;                             // 状态
    this.activeAt = undefined;                  // 生效时间
    this.creatorId = undefined;                 // 创建人id
    this.oaOperatorId = undefined;              // OA最后一次修改人id
    this.oaAppliedAt = undefined;               // 提审时间
    this.cityCode = '';                         // 城市code
    this.revision = undefined;                  // 修改版本号
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
      domain: 'domain',
      biz_district_id: 'bizDistrictId',
      config_version_id: 'configVersionId',
      oa_done_at: 'oaDoneAt',
      updated_at: 'updatedAt',
      _id: 'id',
      operator_id: 'operatorId',
      to_date: 'toDate',
      closed_at: 'closedAt',
      platform_code: 'platformCode',
      dry_run_task_id: 'dryRunTaskId',
      supplier_id: 'supplierId',
      oa_apply_operator_id: 'oaApplyOperatorId',
      name: 'name',
      rules: 'rules',
      created_at: 'createdAt',
      from_date: 'fromDate',
      plan_id: 'planId',
      oa_application_order_id: 'oaApplicationOrderId',
      state: 'state',
      active_at: 'activeAt',
      creator_id: 'creatorId',
      oa_operator_id: 'oaOperatorId',
      oa_applied_at: 'oaAppliedAt',
      city_code: 'cityCode',
      revision: 'revision',
    };
  }

    // 反向映射
  static revertMap() {
    return {
      domain: 'domain',
      bizDistrictId: 'biz_district_id',
      configVersionId: 'config_version_id',
      oaDoneAt: 'oa_done_at',
      updatedAt: 'updated_at',
      id: '_id',
      operatorId: 'operator_id',
      toDate: 'to_date',
      closedAt: 'closed_at',
      platformCode: 'platform_code',
      dryRunTaskId: 'dry_run_task_id',
      supplierId: 'supplier_id',
      oaApplyOperatorId: 'oa_apply_operator_id',
      name: 'name',
      rules: 'rules',
      createdAt: 'created_at',
      fromDate: 'from_date',
      planId: 'plan_id',
      oaApplicationOrderId: 'oa_application_order_id',
      state: 'state',
      activeAt: 'active_at',
      creatorId: 'creator_id',
      oaOperatorId: 'oa_operator_id',
      oaAppliedAt: 'oa_applied_at',
      cityCode: 'city_code',
      revision: 'revision',
    };
  }
}

// 人员服务费计算结果集
class SalaryComputeDataSetBrief extends CoreObject {
  constructor() {
    super();
    this.bizDistrictId = undefined;             // 商圈id
    this.endDate = 0;                           // 结束时间
    this.workType = 0;                          // 工作类型 3001全职 3002兼职
    this.cityName = '';                         // 城市name
    this.data = undefined;                      // 服务费试算结果信息
    this.platformCode = '';                     // 平台code
    this.bizDistrictName = '';                  // 商圈name
    this.staffId = undefined;                   // 人员id
    this.supplierId = undefined;                // 供应商id
    this.planId = undefined;                    // 服务费方案id
    this.planRevisionId = undefined;            // 服务费方案修订版本号
    this.taskId = undefined;                    // 试算id
    this.createdAt = undefined;                 // 创建时间
    this.sessionId = undefined;                 // 计算会话id
    this.planVersionId = undefined;             // 服务费方案版本id
    this.id = undefined;                        // _id
    this.type = 0;                              // 1人员明细 2商圈 3城市
    this.startDate = 0;                         // 开始时间
    this.cityCode = '';                         // 城市code
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
      biz_district_id: 'bizDistrictId',
      end_date: 'endDate',
      work_type: 'workType',
      city_name: 'cityName',
      data: {
        key: 'data',
        transform: value => CoreObject.mapper(value, ComputeTaskInfoBrief),
      },
      platform_code: 'platformCode',
      biz_district_name: 'bizDistrictName',
      staff_id: 'staffId',
      supplier_id: 'supplierId',
      plan_id: 'planId',
      plan_revision_id: 'planRevisionId',
      task_id: 'taskId',
      created_at: 'createdAt',
      session_id: 'sessionId',
      plan_version_id: 'planVersionId',
      _id: 'id',
      type: 'type',
      start_date: 'startDate',
      city_code: 'cityCode',
    };
  }

    // 反向映射
  static revertMap() {
    return {
      bizDistrictId: 'biz_district_id',
      endDate: 'end_date',
      workType: 'work_type',
      cityName: 'city_name',
      data: {
        key: 'data',
        transform: value => CoreObject.revert(value, ComputeTaskInfoBrief),
      },
      platformCode: 'platform_code',
      bizDistrictName: 'biz_district_name',
      staffId: 'staff_id',
      supplierId: 'supplier_id',
      planId: 'plan_id',
      planRevisionId: 'plan_revision_id',
      taskId: 'task_id',
      createdAt: 'created_at',
      sessionId: 'session_id',
      planVersionId: 'plan_version_id',
      id: '_id',
      type: 'type',
      startDate: 'start_date',
      cityCode: 'city_code',
    };
  }
}

// 服务费试算信息
class ComputeTaskInfoBrief extends CoreObject {
  constructor() {
    super();
    this.totalOrder = 0;                        // 单量总额
    this.managementAmount = 0;                  // 试算总金额
    this.trialCalculationAmount = 0;            // 补贴总额
    this.subsidyAmount = 0;                     // 完成单量
    this.doneOrder = 0;                         // 管理总额
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
      total_order: 'totalOrder',
      management_amount: 'managementAmount',
      trial_calculation_amount: 'trialCalculationAmount',
      subsidy_amount: 'subsidyAmount',
      done_order: 'doneOrder',
    };
  }

    // 反向映射
  static revertMap() {
    return {
      totalOrder: 'total_order',
      managementAmount: 'management_amount',
      trialCalculationAmount: 'trial_calculation_amount',
      subsidyAmount: 'subsidy_amount',
      doneOrder: 'done_order',
    };
  }
  }

// 上一版 module.exports
export {
  PayrollStatementBrief,
  SalaryComputeTaskBrief,
  SalaryPlanVersionBrief,
  SalaryComputeDataSetBrief,
};
