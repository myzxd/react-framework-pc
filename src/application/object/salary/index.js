import CoreObject from '../core';

// import CoreObject from './core';

// 结算单调整项(扣款补款)配置
class PayrollAdjustmentConfiguration extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.supplierId = undefined;                // 供应商ID
    this.platformCode = '';                     // 平台code
    this.group = 0;                             // 款项组分类
    this.lines = [];                            // 扣补款项目集[{_id:ObjectId, weight:1}]
    this.createdAt = undefined;                 // 创建时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'platformCode',               // 平台code
      'group',                      // 款项组分类
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      supplier_id: 'supplierId',
      platform_code: 'platformCode',
      group: 'group',
      lines: 'lines',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      supplierId: 'supplier_id',
      platformCode: 'platform_code',
      group: 'group',
      lines: 'lines',
      createdAt: 'created_at',
    };
  }
}

// 结算单调整项(扣款补款)项目
class PayrollAdjustmentItem extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.supplierId = undefined;                // 供应商id
    this.identifier = '';                       // 编号
    this.name = '';                             // 名称
    this.definition = '';                       // 定义
    this.operatorId = undefined;                // 操作人id
    this.templateId = undefined;                // 模版ID
    this.state = 0;                             // 状态(启用100,禁用-100)
    this.platformCode = '';                     // 平台code
    this.group = 0;                             // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
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
      'identifier',                 // 编号
      'name',                       // 名称
      'operatorId',                 // 操作人id
      'state',                      // 状态(启用100,禁用-100)
      'platformCode',               // 平台code
      'group',                      // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
      'createdAt',                  // 创建时间
      'updatedAt',                  // 更新时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      supplier_id: 'supplierId',
      identifier: 'identifier',
      name: 'name',
      definition: 'definition',
      operator_id: 'operatorId',
      template_id: 'templateId',
      state: 'state',
      platform_code: 'platformCode',
      group: 'group',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      supplierId: 'supplier_id',
      identifier: 'identifier',
      name: 'name',
      definition: 'definition',
      operatorId: 'operator_id',
      templateId: 'template_id',
      state: 'state',
      platformCode: 'platform_code',
      group: 'group',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
  }
}

// 结算单调整项(扣款补款)数据模板
class PayrollAdjustmentDataTemplate extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.supplierId = undefined;                // 供应商id
    this.platformCode = '';                     // 平台code
    this.version = '';                          // 版本号
    this.group = 0;                             // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
    this.createdAt = undefined;                 // 创建时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'platformCode',               // 平台code
      'version',                    // 版本号
      'group',                      // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      supplier_id: 'supplierId',
      platform_code: 'platformCode',
      version: 'version',
      group: 'group',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      supplierId: 'supplier_id',
      platformCode: 'platform_code',
      version: 'version',
      group: 'group',
      createdAt: 'created_at',
    };
  }
}

// 结算单调整项(扣款补款)数据上传任务
class PayrollAdjustmentTask extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.supplierId = undefined;                // 供应商id
    this.platformCode = '';                     // 平台code
    this.cityCode = '';                         // 城市code
    this.bizDistrictId = undefined;             // 商圈id
    this.payrollPlanId = undefined;             // 服务费计划id
    this.payrollPlanCycleNo = 0;                // 服务费计划周期ID
    this.payrollStatementId = undefined;        // 服务费总账单
    this.fundFlag = false;                      // 款项标示(true无款项)
    this.activeFlag = false;                    // 待处理标示(true待处理)
    this.positionId = 0;                        // 职位(1003:总监,1004:城市经理,1005:助理,1006:调度,1007:站长,1009:骑士长,1010:骑士)
    this.workType = 0;                          // 工作性质
    this.state = 0;                             // 状态
    this.operatorId = undefined;                // 操作人id
    this.startDate = 0;                         // 起始日期
    this.endDate = 0;                           // 结束日期
    this.createdAt = undefined;                 // 创建时间
    this.submitedAt = undefined;                // 提交时间
    this.updatedAt = undefined;                 // 更新时间
    this.fileKey = '';                          // 文件key
    this.storageType = 0;                       // 储存模式(七牛)
    this.optionFlag = false;                    // 操作标示(true可操作,false不可操作 )
    this.errData = [];                          // 错误信息
    this.group = 0;                             // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'platformCode',               // 平台code
      'payrollPlanId',              // 服务费计划id
      'payrollPlanCycleNo',         // 服务费计划周期ID
      'payrollStatementId',         // 服务费总账单
      'positionId',                 // 职位(1003:总监,1004:城市经理,1005:助理,1006:调度,1007:站长,1009:骑士长,1010:骑士)
      'workType',                   // 工作性质
      'state',                      // 状态
      'startDate',                  // 起始日期
      'endDate',                    // 结束日期
      'createdAt',                  // 创建时间
      'updatedAt',                  // 更新时间
      'group',                      // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      supplier_id: 'supplierId',
      platform_code: 'platformCode',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      payroll_plan_id: 'payrollPlanId',
      payroll_plan_cycle_no: 'payrollPlanCycleNo',
      payroll_statement_id: 'payrollStatementId',
      fund_flag: 'fundFlag',
      active_flag: 'activeFlag',
      position_id: 'positionId',
      work_type: 'workType',
      state: 'state',
      operator_id: 'operatorId',
      start_date: 'startDate',
      end_date: 'endDate',
      created_at: 'createdAt',
      submited_at: 'submitedAt',
      updated_at: 'updatedAt',
      file_key: 'fileKey',
      storage_type: 'storageType',
      option_flag: 'optionFlag',
      err_data: 'errData',
      group: 'group',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      supplierId: 'supplier_id',
      platformCode: 'platform_code',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      payrollPlanId: 'payroll_plan_id',
      payrollPlanCycleNo: 'payroll_plan_cycle_no',
      payrollStatementId: 'payroll_statement_id',
      fundFlag: 'fund_flag',
      activeFlag: 'active_flag',
      positionId: 'position_id',
      workType: 'work_type',
      state: 'state',
      operatorId: 'operator_id',
      startDate: 'start_date',
      endDate: 'end_date',
      createdAt: 'created_at',
      submitedAt: 'submited_at',
      updatedAt: 'updated_at',
      fileKey: 'file_key',
      storageType: 'storage_type',
      optionFlag: 'option_flag',
      errData: 'err_data',
      group: 'group',
    };
  }
}

// 人员扣款补款明细数据
class SalaryPayrollAdjustmentLine extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.supplierId = undefined;                // 供应商id
    this.platformCode = '';                     // 平台code
    this.cityCode = '';                         // 城市code
    this.bizDistrictId = undefined;             // 商圈id
    this.taskId = undefined;                    // 任务id
    this.payrollPlanId = undefined;             // 服务费计划id
    this.payrollStatementId = undefined;        // 服务费总账单
    this.staffId = undefined;                   // 人员id
    this.idCardNum = '';                        // 身份证号
    this.items = [];                            // 扣补款项目集
    this.belongTime = 0;                        // 归属日期
    this.startDate = 0;                         // 起始日期
    this.endDate = 0;                           // 结束日期
    this.payrollCycleType = 0;                  // 结算周期类型(1:按月，2:按日)
    this.positionId = 0;                        // 职位
    this.group = 0;                             // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
    this.createdAt = undefined;                 // 创建时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'platformCode',               // 平台code
      'taskId',                     // 任务id
      'payrollPlanId',              // 服务费计划id
      'payrollStatementId',         // 服务费总账单
      'staffId',                    // 人员id
      'idCardNum',                  // 身份证号
      'items',                      // 扣补款项目集
      'belongTime',                 // 归属日期
      'startDate',                  // 起始日期
      'endDate',                    // 结束日期
      'payrollCycleType',           // 结算周期类型(1:按月，2:按日)
      'positionId',                 // 职位
      'group',                      // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      supplier_id: 'supplierId',
      platform_code: 'platformCode',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      task_id: 'taskId',
      payroll_plan_id: 'payrollPlanId',
      payroll_statement_id: 'payr、ollStatementId',
      staff_id: 'staffId',
      id_card_num: 'idCardNum',
      items: 'items',
      belong_time: 'belongTime',
      start_date: 'startDate',
      end_date: 'endDate',
      payroll_cycle_type: 'payrollCycleType',
      position_id: 'positionId',
      group: 'group',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      supplierId: 'supplier_id',
      platformCode: 'platform_code',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      taskId: 'task_id',
      payrollPlanId: 'payroll_plan_id',
      payrollStatementId: 'payroll_statement_id',
      staffId: 'staff_id',
      idCardNum: 'id_card_num',
      items: 'items',
      belongTime: 'belong_time',
      startDate: 'start_date',
      endDate: 'end_date',
      payrollCycleType: 'payroll_cycle_type',
      positionId: 'position_id',
      group: 'group',
      createdAt: 'created_at',
    };
  }
}

// 结算计划
class PayrollPlan extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.platformCode = '';                     // 平台code
    this.supplierId = undefined;                // 供应商id
    this.cityCode = '';                         // 城市code
    this.bizDistrictId = undefined;             // 商圈id
    this.type = 0;                              // 类型(1:城市级别，2:商圈级别)
    this.payrollCycleType = 0;                  // 结算周期类型 1（按月）2（按日）
    this.cycleInterval = 0;                     // 结算周期值（天/月）
    this.payrollCycleNo = 0;                    // 当前周期编号
    this.initExecuteDate = 0;                   // 首次计算执行日(yyyymmdd)
    this.nextExecuteDate = 0;                   // 计算执行日(下次结算单生成日期)
    this.computeDelayDays = 0;                  // 计算预留后延天数
    this.adjustmentFlag = false;                // 扣补款标示(true:有款项，false:无款项)
    this.workType = 0;                          // 工作性质(3001:全职,3002:兼职)
    this.operatorId = undefined;                // 操作人id
    this.creatorId = undefined;                 // 创建人id
    this.state = 0;                             // 状态 100（启用）-100（禁用） -101（删除）
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
      'id',                         // id
      'platformCode',               // 平台code
      'supplierId',                 // 供应商id
      'cityCode',                   // 城市code
      'type',                       // 类型(1:城市级别，2:商圈级别)
      'payrollCycleType',           // 结算周期类型 1（按月）2（按日）
      'cycleInterval',              // 结算周期值（天/月）
      'payrollCycleNo',             // 当前周期编号
      'computeDelayDays',           // 计算预留后延天数
      'adjustmentFlag',             // 扣补款标示(true:有款项，false:无款项)
      'workType',                   // 工作性质(3001:全职,3002:兼职)
      'operatorId',                 // 操作人id
      'creatorId',                  // 创建人id
      'state',                      // 状态 100（启用）-100（禁用） -101（删除）
      'createdAt',                  // 创建时间
      'updatedAt',                  // 更新时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      platform_code: 'platformCode',
      supplier_id: 'supplierId',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      type: 'type',
      payroll_cycle_type: 'payrollCycleType',
      cycle_interval: 'cycleInterval',
      payroll_cycle_no: 'payrollCycleNo',
      init_execute_date: 'initExecuteDate',
      next_execute_date: 'nextExecuteDate',
      compute_delay_days: 'computeDelayDays',
      adjustment_flag: 'adjustmentFlag',
      work_type: 'workType',
      operator_id: 'operatorId',
      creator_id: 'creatorId',
      state: 'state',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      platformCode: 'platform_code',
      supplierId: 'supplier_id',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      type: 'type',
      payrollCycleType: 'payroll_cycle_type',
      cycleInterval: 'cycle_interval',
      payrollCycleNo: 'payroll_cycle_no',
      initExecuteDate: 'init_execute_date',
      nextExecuteDate: 'next_execute_date',
      computeDelayDays: 'compute_delay_days',
      adjustmentFlag: 'adjustment_flag',
      workType: 'work_type',
      operatorId: 'operator_id',
      creatorId: 'creator_id',
      state: 'state',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
  }
}

// 结算单-总账单（商圈级别）
class PayrollStatement extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.supplierId = undefined;                // 供应商id
    this.platformCode = '';                     // 平台code
    this.cityCode = '';                         // 城市code
    this.payrollCycleType = 0;                  // 周期类型(按月:1, 按日:2)
    this.payrollPlanId = undefined;             // 服务费计划id
    this.payrollCycleNo = 0;                    // 服务费计划周期编号
    this.positionId = 0;                        // 职位id
    this.orderCount = 0;                        // 总单量
    this.staffCount = 0;                        // 人员数量
    this.orderMoney = 0;                        // 单量提成金额
    this.workMoney = 0;                         // 出勤补贴金额
    this.qaMoney = 0;                           // 质量补贴金额
    this.operationMoney = 0;                    // 管理补贴金额
    this.payableMoney = 0;                      // 应发总额
    this.netPayMoney = 0;                       // 实发总额
    this.state = 0;                             // 状态(1=待审核, 50=审核中,100=审核通过)
    this.workType = 0;                          // 工作性质
    this.adjumentHrDecMoney = 0;                // 人事扣款总额
    this.adjumentHrIncMoney = 0;                // 人事补款总额
    this.adjumentStaffDecMoney = 0;             // 人员扣款总额
    this.adjumentStaffIncMoney = 0;             // 人员补款总额
    this.adjumentStaffIncState = false;         // 人员补款状态
    this.adjumentStaffIncState = false;         // 人员扣款状态
    this.adjumentHrIncState = false;            // 人事补款状态
    this.adjumentHrIncState = false;            // 人事扣款状态
    this.singleAverageAmount = 0;               // 单均成本
    this.oaApplicationOrderId = undefined;      // OA审批单ID
    this.salaryComputeDataSetId = undefined;    // 服务费计算结果集ID
    this.startDate = 0;                         // 起始日期
    this.endDate = 0;                           // 结束日期
    this.day = 0;                               // 日
    this.month = 0;                             // 月
    this.year = 0;                              // 年
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
      'supplierId',                 // 供应商id
      'platformCode',               // 平台code
      'cityCode',                   // 城市code
      'payrollCycleType',           // 周期类型(按月:1, 按日:2)
      'payrollPlanId',              // 服务费计划id
      'payrollCycleNo',             // 服务费计划周期编号
      'positionId',                 // 职位id
      'orderCount',                 // 总单量
      'staffCount',                 // 人员数量
      'orderMoney',                 // 单量提成金额
      'workMoney',                  // 出勤补贴金额
      'qaMoney',                    // 质量补贴金额
      'operationMoney',             // 管理补贴金额
      'payableMoney',               // 应发总额
      'netPayMoney',                // 实发总额
      'state',                      // 状态(1=待审核, 50=审核中,100=审核通过)
      'workType',                   // 工作性质
      'adjumentHrDecMoney',         // 人事扣款总额
      'adjumentHrIncMoney',         // 人事补款总额
      'adjumentStaffDecMoney',      // 人员扣款总额
      'adjumentStaffIncMoney',      // 人员补款总额
      'singleAverageAmount',        // 单均成本
      'startDate',                  // 起始日期
      'endDate',                    // 结束日期
      'month',                      // 月
      'year',                       // 年
      'createdAt',                  // 创建时间
      'updatedAt',                  // 更新时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      supplier_id: 'supplierId',
      platform_code: 'platformCode',
      city_code: 'cityCode',
      payroll_cycle_type: 'payrollCycleType',
      payroll_plan_id: 'payrollPlanId',
      payroll_cycle_no: 'payrollCycleNo',
      position_id: 'positionId',
      order_count: 'orderCount',
      staff_count: 'staffCount',
      order_money: 'orderMoney',
      work_money: 'workMoney',
      qa_money: 'qaMoney',
      operation_money: 'operationMoney',
      payable_money: 'payableMoney',
      net_pay_money: 'netPayMoney',
      state: 'state',
      work_type: 'workType',
      adjument_hr_dec_money: 'adjumentHrDecMoney',
      adjument_hr_inc_money: 'adjumentHrIncMoney',
      adjument_staff_dec_money: 'adjumentStaffDecMoney',
      adjument_staff_inc_money: 'adjumentStaffIncMoney',
      adjument_staff_inc_state: 'adjumentStaffIncState',
      adjument_hr_inc_state: 'adjumentHrIncState',
      single_average_amount: 'singleAverageAmount',
      oa_application_order_id: 'oaApplicationOrderId',
      salary_compute_data_set_id: 'salaryComputeDataSetId',
      start_date: 'startDate',
      end_date: 'endDate',
      day: 'day',
      month: 'month',
      year: 'year',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      supplierId: 'supplier_id',
      platformCode: 'platform_code',
      cityCode: 'city_code',
      payrollCycleType: 'payroll_cycle_type',
      payrollPlanId: 'payroll_plan_id',
      payrollCycleNo: 'payroll_cycle_no',
      positionId: 'position_id',
      orderCount: 'order_count',
      staffCount: 'staff_count',
      orderMoney: 'order_money',
      workMoney: 'work_money',
      qaMoney: 'qa_money',
      operationMoney: 'operation_money',
      payableMoney: 'payable_money',
      netPayMoney: 'net_pay_money',
      state: 'state',
      workType: 'work_type',
      adjumentHrDecMoney: 'adjument_hr_dec_money',
      adjumentHrIncMoney: 'adjument_hr_inc_money',
      adjumentStaffDecMoney: 'adjument_staff_dec_money',
      adjumentStaffIncMoney: 'adjument_staff_inc_money',
      adjumentStaffIncState: 'adjument_staff_inc_state',
      adjumentHrIncState: 'adjument_hr_inc_state',
      singleAverageAmount: 'single_average_amount',
      oaApplicationOrderId: 'oa_application_order_id',
      salaryComputeDataSetId: 'salary_compute_data_set_id',
      startDate: 'start_date',
      endDate: 'end_date',
      day: 'day',
      month: 'month',
      year: 'year',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
  }
}

// 结算单（明细）
class Payroll extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.supplierId = undefined;                // 供应商id
    this.platformCode = '';                     // 平台code
    this.cityCode = '';                         // 平台code_城市全拼
    this.bizDistrictId = undefined;             // 商圈id|站点id|团队id
    this.positionId = 0;                        // 职位id
    this.staffId = undefined;                   // 人员id
    this.idCardNum = '';                        // 身份证号
    this.payrollStatementId = undefined;        // 结算单汇总单id
    this.payrollPlanId = undefined;             // 服务费计划ID
    this.payrollCycleNo = 0;                    // 服务费计划周期编号
    this.salaryComputeDataSetId = undefined;    // 服务费计算结果集ID
    this.payrollCycleType = 0;                  // 计算周期(1:按月,2:按日)
    this.contractBelongId = undefined;          // 合同归属
    this.startDate = 0;                         // 起始日期
    this.endDate = 0;                           // 结束日期
    this.month = 0;                             // 月
    this.year = 0;                              // 年
    this.orderCount = 0;                        // 单量
    this.orderMoney = 0;                        // 单量提成金额
    this.workMoney = 0;                         // 出勤补贴金额
    this.qaMoney = 0;                           // 质量补贴金额
    this.operationMoney = 0;                    // 管理补贴金额
    this.payableMoney = 0;                      // 应发总额
    this.netPayMoney = 0;                       // 实发总额
    this.adjumentHrDecMoney = 0;                // 人事扣款总额
    this.adjumentHrIncMoney = 0;                // 人事补款总额
    this.adjumentStaffDecMoney = 0;             // 人员扣款总额
    this.adjumentStaffIncMoney = 0;             // 人员补款总额
    this.adjustmentItemLines = [];              // 扣补款项目明细
    this.operatorId = undefined;                // 操作人id
    this.debtsType = 0;                         // 欠款类型
    this.updateTime = undefined;                // 更新时间
    this.paySalaryState = 0;                    // 结算状态(1 正常 -1 缓发)
    this.oaApplicationOrderId = undefined;      // OA审批单ID
    this.createdAt = undefined;                 // 创建时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'supplierId',                 // 供应商id
      'platformCode',               // 平台code
      'cityCode',                   // 平台code_城市全拼
      'bizDistrictId',              // 商圈id|站点id|团队id
      'positionId',                 // 职位id
      'staffId',                    // 人员id
      'idCardNum',                  // 身份证号
      'payrollStatementId',         // 结算单汇总单id
      'payrollPlanId',              // 服务费计划ID
      'payrollCycleNo',             // 服务费计划周期编号
      'payrollCycleType',           // 计算周期(1:按月,2:按日)
      'contractBelongId',           // 合同归属
      'startDate',                  // 起始日期
      'endDate',                    // 结束日期
      'month',                      // 月
      'year',                       // 年
      'orderCount',                 // 单量
      'orderMoney',                 // 单量提成金额
      'workMoney',                  // 出勤补贴金额
      'qaMoney',                    // 质量补贴金额
      'operationMoney',             // 管理补贴金额
      'payableMoney',               // 应发总额
      'netPayMoney',                // 实发总额
      'adjumentHrDecMoney',         // 人事扣款总额
      'adjumentHrIncMoney',         // 人事补款总额
      'adjumentStaffDecMoney',      // 人员扣款总额
      'adjumentStaffIncMoney',      // 人员补款总额
      'debtsType',                  // 欠款类型
      'paySalaryState',             // 结算状态(1 正常 -1 缓发)
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      supplier_id: 'supplierId',
      platform_code: 'platformCode',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      position_id: 'positionId',
      staff_id: 'staffId',
      id_card_num: 'idCardNum',
      payroll_statement_id: 'payrollStatementId',
      payroll_plan_id: 'payrollPlanId',
      payroll_cycle_no: 'payrollCycleNo',
      salary_compute_data_set_id: 'salaryComputeDataSetId',
      payroll_cycle_type: 'payrollCycleType',
      contract_belong_id: 'contractBelongId',
      start_date: 'startDate',
      end_date: 'endDate',
      month: 'month',
      year: 'year',
      order_count: 'orderCount',
      order_money: 'orderMoney',
      work_money: 'workMoney',
      qa_money: 'qaMoney',
      operation_money: 'operationMoney',
      payable_money: 'payableMoney',
      net_pay_money: 'netPayMoney',
      adjument_hr_dec_money: 'adjumentHrDecMoney',
      adjument_hr_inc_money: 'adjumentHrIncMoney',
      adjument_staff_dec_money: 'adjumentStaffDecMoney',
      adjument_staff_inc_money: 'adjumentStaffIncMoney',
      adjustment_item_lines: 'adjustmentItemLines',
      operator_id: 'operatorId',
      debts_type: 'debtsType',
      update_time: 'updateTime',
      pay_salary_state: 'paySalaryState',
      oa_application_order_id: 'oaApplicationOrderId',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      supplierId: 'supplier_id',
      platformCode: 'platform_code',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      positionId: 'position_id',
      staffId: 'staff_id',
      idCardNum: 'id_card_num',
      payrollStatementId: 'payroll_statement_id',
      payrollPlanId: 'payroll_plan_id',
      payrollCycleNo: 'payroll_cycle_no',
      salaryComputeDataSetId: 'salary_compute_data_set_id',
      payrollCycleType: 'payroll_cycle_type',
      contractBelongId: 'contract_belong_id',
      startDate: 'start_date',
      endDate: 'end_date',
      month: 'month',
      year: 'year',
      orderCount: 'order_count',
      orderMoney: 'order_money',
      workMoney: 'work_money',
      qaMoney: 'qa_money',
      operationMoney: 'operation_money',
      payableMoney: 'payable_money',
      netPayMoney: 'net_pay_money',
      adjumentHrDecMoney: 'adjument_hr_dec_money',
      adjumentHrIncMoney: 'adjument_hr_inc_money',
      adjumentStaffDecMoney: 'adjument_staff_dec_money',
      adjumentStaffIncMoney: 'adjument_staff_inc_money',
      adjustmentItemLines: 'adjustment_item_lines',
      operatorId: 'operator_id',
      debtsType: 'debts_type',
      updateTime: 'update_time',
      paySalaryState: 'pay_salary_state',
      oaApplicationOrderId: 'oa_application_order_id',
      createdAt: 'created_at',
    };
  }
}

// 服务费试算任务
class SalaryComputeTask extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.supplierId = undefined;                // 供应商id
    this.platformCode = '';                     // 平台code
    this.cityCode = '';                         // 城市code
    this.bizDistrictId = undefined;             // 商圈id
    this.planId = undefined;                    // 服务费方案ID
    this.planVersionId = undefined;             // 服务费方案版本ID
    this.planRevisionId = undefined;            // 服务费方案修订版本号（规则每次修改均变化）
    this.computeContext = {};                   // 数据计算上下文环境
    this.state = 0;                             // 状态(1:待试算,50:正在试算,100:试算成功,-100:试算失败)
    this.createdAt = undefined;                 // 创建时间
    this.updatedAt = undefined;                 // 更新时间
    this.fromDate = 0;                          // 生效开始日期（yyyymmdd）
    this.toDate = 0;                            // 结束失效日期（yyyymmdd）
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'supplierId',                 // 供应商id
      'platformCode',               // 平台code
      'cityCode',                   // 城市code
      'planId',                     // 服务费方案ID
      'planVersionId',              // 服务费方案版本ID
      'planRevisionId',             // 服务费方案修订版本号（规则每次修改均变化）
      'state',                      // 状态(1:待试算,50:正在试算,100:试算成功,-100:试算失败)
      'createdAt',                  // 创建时间
      'updatedAt',                  // 更新时间
      'fromDate',                   // 生效开始日期（yyyymmdd）
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      supplier_id: 'supplierId',
      platform_code: 'platformCode',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      plan_id: 'planId',
      plan_version_id: 'planVersionId',
      plan_revision_id: 'planRevisionId',
      compute_context: 'computeContext',
      state: 'state',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      from_date: 'fromDate',
      to_date: 'toDate',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      supplierId: 'supplier_id',
      platformCode: 'platform_code',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      planId: 'plan_id',
      planVersionId: 'plan_version_id',
      planRevisionId: 'plan_revision_id',
      computeContext: 'compute_context',
      state: 'state',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      fromDate: 'from_date',
      toDate: 'to_date',
    };
  }
}

// 人员服务费计算结果集
class SalaryComputeDataSet extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.taskId = undefined;                    // 计算任务ID
    this.sessionId = undefined;                 // 计算会话ID
    this.type = 0;                              // 类型 1（人员明细）2（商圈）3（城市）
    this.staffId = undefined;                   // 人员id
    this.supplierId = undefined;                // 供应商id
    this.platformCode = '';                     // 平台code
    this.workType = 0;                          // 工作类型 3001（全职）3002（兼职）
    this.cityCode = '';                         // 城市code
    this.bizDistrictId = undefined;             // 商圈id
    this.planId = undefined;                    // 服务费方案ID
    this.planVersionId = undefined;             // 服务费方案版本ID
    this.planRevisionId = undefined;            // 服务费方案修订版本号（规则每次修改均变化）
    this.data = {};                             // 计算结果集
    this.startDate = 0;                         // 源数据起始日期(yyyymmdd)
    this.endDate = 0;                           // 源数据结束日期(yyyymmdd)
    this.createdAt = undefined;                 // 创建时间
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'taskId',                     // 计算任务ID
      'sessionId',                  // 计算会话ID
      'type',                       // 类型 1（人员明细）2（商圈）3（城市）
      'staffId',                    // 人员id
      'supplierId',                 // 供应商id
      'platformCode',               // 平台code
      'cityCode',                   // 城市code
      'planId',                     // 服务费方案ID
      'planVersionId',              // 服务费方案版本ID
      'planRevisionId',             // 服务费方案修订版本号（规则每次修改均变化）
      'startDate',                  // 源数据起始日期(yyyymmdd)
      'endDate',                    // 源数据结束日期(yyyymmdd)
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      task_id: 'taskId',
      session_id: 'sessionId',
      type: 'type',
      staff_id: 'staffId',
      supplier_id: 'supplierId',
      platform_code: 'platformCode',
      work_type: 'workType',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      plan_id: 'planId',
      plan_version_id: 'planVersionId',
      plan_revision_id: 'planRevisionId',
      data: 'data',
      start_date: 'startDate',
      end_date: 'endDate',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      taskId: 'task_id',
      sessionId: 'session_id',
      type: 'type',
      staffId: 'staff_id',
      supplierId: 'supplier_id',
      platformCode: 'platform_code',
      workType: 'work_type',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      planId: 'plan_id',
      planVersionId: 'plan_version_id',
      planRevisionId: 'plan_revision_id',
      data: 'data',
      startDate: 'start_date',
      endDate: 'end_date',
      createdAt: 'created_at',
    };
  }
}

// 服务费方案
class SalaryPlan extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.name = '';                             // 规则名称
    this.platformCode = '';                     // 平台Code
    this.supplierId = undefined;                // 供应商ID
    this.cityCode = '';                         // 城市code
    this.cityName = '';                         // 城市名称
    this.bizDistrictId = undefined;             // 商圈ID
    this.bizDistrictName = '';                  // 商圈名称
    this.state = 0;                             // 状态 -101(删除) -100(停用) 100(启用) 1(草稿)
    this.domain = 0;                            // 适用范围 2（商圈）3（城市）
    this.activeVersion = undefined;             // 使用中的版本ID
    this.draftVersion = undefined;              // 当前草稿版本ID
    this.applicationVersion = undefined;        // 审核中版本ID
    this.pendingVersion = undefined;            // 待启用版本ID
    this.enabledAt = undefined;                 // 启用时间
    this.disabledAt = undefined;                // 停用时间
    this.deletedAt = undefined;                 // 删除时间
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间
    this.creatorId = undefined;                 // 创建人
    this.operatorId = undefined;                // 操作人
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'name',                       // 规则名称
      'platformCode',               // 平台Code
      'supplierId',                 // 供应商ID
      'state',                      // 状态 -101(删除) -100(停用) 100(启用) 1(草稿)
      'domain',                     // 适用范围 2（商圈）3（城市）
      'updatedAt',                  // 更新时间
      'createdAt',                  // 创建时间
      'creatorId',                  // 创建人
      'operatorId',                 // 操作人
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      platform_code: 'platformCode',
      supplier_id: 'supplierId',
      city_code: 'cityCode',
      city_name: 'cityName',
      biz_district_id: 'bizDistrictId',
      biz_district_name: 'bizDistrictName',
      state: 'state',
      domain: 'domain',
      active_version: 'activeVersion',
      draft_version: 'draftVersion',
      application_version: 'applicationVersion',
      pending_version: 'pendingVersion',
      enabled_at: 'enabledAt',
      disabled_at: 'disabledAt',
      deleted_at: 'deletedAt',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
      creator_id: 'creatorId',
      operator_id: 'operatorId',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      platformCode: 'platform_code',
      supplierId: 'supplier_id',
      cityCode: 'city_code',
      cityName: 'city_name',
      bizDistrictId: 'biz_district_id',
      bizDistrictName: 'biz_district_name',
      state: 'state',
      domain: 'domain',
      activeVersion: 'active_version',
      draftVersion: 'draft_version',
      applicationVersion: 'application_version',
      pendingVersion: 'pending_version',
      enabledAt: 'enabled_at',
      disabledAt: 'disabled_at',
      deletedAt: 'deleted_at',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      creatorId: 'creator_id',
      operatorId: 'operator_id',
    };
  }
}

// 服务费方案版本
class SalaryPlanVersion extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.name = '';                             // 规则名称
    this.revision = undefined;                  // 修订版本号（规则每次修改均变化）
    this.platformCode = '';                     // 平台Code
    this.supplierId = undefined;                // 供应商ID
    this.cityCode = '';                         // 城市code
    this.bizDistrictId = undefined;             // 商圈ID
    this.state = 0;                             // 状态 1（草稿）10（审批中）50（待生效）100（已生效）-100（已失效）-101（已删除）
    this.domain = 0;                            // 作用域 2（商圈）3（城市）
    this.rules = [];                            // 服务费规则集列表
    this.rulesList = [];                        // 服务费规则集列表信息
    this.salaryVarPlanId = undefined;           // 指标库ID
    this.salaryVarPlanVersionId = undefined;    // 指标库版本
    this.configVersionId = undefined;           // 指标参数值版本ID
    this.fromDate = 0;                          // 生效开始日期（yyyymmdd）
    this.toDate = 0;                            // 结束失效日期（yyyymmdd）
    this.oaAppliedAt = undefined;               // 提审时间
    this.oaDoneAt = undefined;                  // OA审批完成时间
    this.activeAt = undefined;                  // 生效时间
    this.closedAt = undefined;                  // 失效时间
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间
    this.creatorId = undefined;                 // 创建人ID
    this.operatorId = undefined;                // 操作人ID
    this.oaApplyOperatorId = undefined;         // OA申请人ID
    this.oaApplicationOrderId = undefined;      // OA申请单ID
    this.oaOperatorId = undefined;              // OA最后一次修改人ID
    this.dryRunTaskId = undefined;              // 试算任务ID
    this.planId = undefined;                    // 服务费方案ID
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'name',                       // 规则名称
      'revision',                   // 修订版本号（规则每次修改均变化）
      'platformCode',               // 平台Code
      'supplierId',                 // 供应商ID
      'state',                      // 状态 1（草稿）10（审批中）50（待生效）100（已生效）-100（已失效）-101（已删除）
      'domain',                     // 作用域 2（商圈）3（城市）
      'fromDate',                   // 生效开始日期（yyyymmdd）
      'updatedAt',                  // 更新时间
      'createdAt',                  // 创建时间
      'creatorId',                  // 创建人ID
      'operatorId',                 // 操作人ID
      'oaOperatorId',               // OA最后一次修改人ID
      'planId',                     // 服务费方案ID
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      revision: 'revision',
      platform_code: 'platformCode',
      supplier_id: 'supplierId',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      state: 'state',
      domain: 'domain',
      rules: 'rules',
      rules_list: 'rulesList',
      salary_var_plan_id: 'salaryVarPlanId',
      salary_var_plan_version_id: 'salaryVarPlanVersionId',
      config_version_id: 'configVersionId',
      from_date: 'fromDate',
      to_date: 'toDate',
      oa_applied_at: 'oaAppliedAt',
      oa_done_at: 'oaDoneAt',
      active_at: 'activeAt',
      closed_at: 'closedAt',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
      creator_id: 'creatorId',
      operator_id: 'operatorId',
      oa_apply_operator_id: 'oaApplyOperatorId',
      oa_application_order_id: 'oaApplicationOrderId',
      oa_operator_id: 'oaOperatorId',
      dry_run_task_id: 'dryRunTaskId',
      plan_id: 'planId',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      revision: 'revision',
      platformCode: 'platform_code',
      supplierId: 'supplier_id',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      state: 'state',
      domain: 'domain',
      rules: 'rules',
      rulesList: 'rules_list',
      salaryVarPlanId: 'salary_var_plan_id',
      salaryVarPlanVersionId: 'salary_var_plan_version_id',
      configVersionId: 'config_version_id',
      fromDate: 'from_date',
      toDate: 'to_date',
      oaAppliedAt: 'oa_applied_at',
      oaDoneAt: 'oa_done_at',
      activeAt: 'active_at',
      closedAt: 'closed_at',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      creatorId: 'creator_id',
      operatorId: 'operator_id',
      oaApplyOperatorId: 'oa_apply_operator_id',
      oaApplicationOrderId: 'oa_application_order_id',
      oaOperatorId: 'oa_operator_id',
      dryRunTaskId: 'dry_run_task_id',
      planId: 'plan_id',
    };
  }
}

// 服务费规则集
class SalaryPlanRuleCollection extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.planId = undefined;                    // 服务费方案ID
    this.planVersionId = undefined;             // 版本id
    this.workType = 0;                          // 工作类型(3001:全职,3002:兼职)
    this.orderRules = [];                       // 单量提成规则
    this.orderRuleFlag = false;                 // 单量提成启用标记
    this.orderRuleRelation = 0;                 // 规则关系 1（互斥）2（互补）
    this.workRules = [];                        // 出勤扣罚规则
    this.workRuleRelation = 0;                  // 规则关系 1（互斥）2（互补）
    this.workRuleFlag = false;                  // 出勤启用标记
    this.qaRules = [];                          // 质量扣罚规则
    this.qaRuleRelation = 0;                    // 规则关系 1（互斥）2（互补）
    this.qaRuleFlag = false;                    // 质量启用标记
    this.operationRules = [];                   // 运营管理奖罚规则
    this.operationRuleRelation = 0;             // 规则关系 1（互斥）2（互补）
    this.operationRuleFlag = false;             // 运营管理启用标记
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
      'planId',                     // 服务费方案ID
      'planVersionId',              // 版本id
      'workType',                   // 工作类型(3001:全职,3002:兼职)
      'orderRuleFlag',              // 单量提成启用标记
      'orderRuleRelation',          // 规则关系 1（互斥）2（互补）
      'workRuleRelation',           // 规则关系 1（互斥）2（互补）
      'workRuleFlag',               // 出勤启用标记
      'qaRuleRelation',             // 规则关系 1（互斥）2（互补）
      'qaRuleFlag',                 // 质量启用标记
      'operationRuleRelation',      // 规则关系 1（互斥）2（互补）
      'operationRuleFlag',          // 运营管理启用标记
      'createdAt',                  // 创建时间
      'updatedAt',                  // 更新时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      plan_id: 'planId',
      plan_version_id: 'planVersionId',
      work_type: 'workType',
      order_rules: 'orderRules',
      order_rule_flag: 'orderRuleFlag',
      order_rule_relation: 'orderRuleRelation',
      work_rules: 'workRules',
      work_rule_relation: 'workRuleRelation',
      work_rule_flag: 'workRuleFlag',
      qa_rules: 'qaRules',
      qa_rule_relation: 'qaRuleRelation',
      qa_rule_flag: 'qaRuleFlag',
      operation_rules: 'operationRules',
      operation_rule_relation: 'operationRuleRelation',
      operation_rule_flag: 'operationRuleFlag',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      planId: 'plan_id',
      planVersionId: 'plan_version_id',
      workType: 'work_type',
      orderRules: 'order_rules',
      orderRuleFlag: 'order_rule_flag',
      orderRuleRelation: 'order_rule_relation',
      workRules: 'work_rules',
      workRuleRelation: 'work_rule_relation',
      workRuleFlag: 'work_rule_flag',
      qaRules: 'qa_rules',
      qaRuleRelation: 'qa_rule_relation',
      qaRuleFlag: 'qa_rule_flag',
      operationRules: 'operation_rules',
      operationRuleRelation: 'operation_rule_relation',
      operationRuleFlag: 'operation_rule_flag',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
  }
}

// 服务费计算规则
class SalaryRule extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.planId = undefined;                    // 服务费方案
    this.planVersionId = undefined;             // 服务费方案版本ID
    this.ruleCollectionId = undefined;          // 归属的服务费规则集ID
    this.collectionCate = 0;                    // 规则分类(1:单量,2:出勤,3:质量,4:管理)
    this.collectionCateOption = {};             // 规则分类参数
    this.collectionIndexNum = 0;                // 在规则集中的优先级序号
    this.rulePrimaryKey = {};                   // 规则唯一主键
    this.matchFilters = [];                     // 数据源筛选器(条件)
    this.computeLogic = [];                     // 数据处理逻辑
    this.state = 0;                             // 状态 100（正常） -100（删除）
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
      'planId',                     // 服务费方案
      'planVersionId',              // 服务费方案版本ID
      'ruleCollectionId',           // 归属的服务费规则集ID
      'collectionCate',             // 规则分类(1:单量,2:出勤,3:质量,4:管理)
      'collectionCateOption',       // 规则分类参数
      'collectionIndexNum',         // 在规则集中的优先级序号
      'rulePrimaryKey',             // 规则唯一主键
      'matchFilters',               // 数据源筛选器(条件)
      'computeLogic',               // 数据处理逻辑
      'state',                      // 状态 100（正常） -100（删除）
      'createdAt',                  // 创建时间
      'updatedAt',                  // 更新时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      plan_id: 'planId',
      plan_version_id: 'planVersionId',
      rule_collection_id: 'ruleCollectionId',
      collection_cate: 'collectionCate',
      collection_cate_option: 'collectionCateOption',
      collection_index_num: 'collectionIndexNum',
      rule_primary_key: 'rulePrimaryKey',
      match_filters: 'matchFilters',
      compute_logic: 'computeLogic',
      state: 'state',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      planId: 'plan_id',
      planVersionId: 'plan_version_id',
      ruleCollectionId: 'rule_collection_id',
      collectionCate: 'collection_cate',
      collectionCateOption: 'collection_cate_option',
      collectionIndexNum: 'collection_index_num',
      rulePrimaryKey: 'rule_primary_key',
      matchFilters: 'match_filters',
      computeLogic: 'compute_logic',
      state: 'state',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
  }
}

// 结算指标方案库
class SalaryVarPlan extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.name = '';                             // 指标库名称
    this.version = undefined;                   // 指标库版本
    this.platformCode = '';                     // 平台Code
    this.state = 0;                             // 状态 -101(删除) -100(停用) 100(启用) 1(草稿)
    this.enabledAt = undefined;                 // 启用时间
    this.disabledAt = undefined;                // 停用时间
    this.deletedAt = undefined;                 // 删除时间
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间
    this.creatorId = undefined;                 // 创建人
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'name',                       // 指标库名称
      'version',                    // 指标库版本
      'platformCode',               // 平台Code
      'state',                      // 状态 -101(删除) -100(停用) 100(启用) 1(草稿)
      'updatedAt',                  // 更新时间
      'createdAt',                  // 创建时间
      'creatorId',                  // 创建人
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      version: 'version',
      platform_code: 'platformCode',
      state: 'state',
      enabled_at: 'enabledAt',
      disabled_at: 'disabledAt',
      deleted_at: 'deletedAt',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
      creator_id: 'creatorId',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      version: 'version',
      platformCode: 'platform_code',
      state: 'state',
      enabledAt: 'enabled_at',
      disabledAt: 'disabled_at',
      deletedAt: 'deleted_at',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      creatorId: 'creator_id',
    };
  }
}

// 结算指标定义
class SalaryVar extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.planId = undefined;                    // 指标方案id
    this.version = undefined;                   // 对应版本
    this.forkVersion = undefined;               // 上一个版本（fork 来源）首个版本为空
    this.name = '';                             // 名称
    this.unit = 0;                              // 单位(1:单,2:天,3:kg,4:km)
    this.definition = '';                       // 指标定义
    this.platformCode = '';                     // 平台Code
    this.state = 0;                             // 状态 -101(删除) -100(停用) 100(启用)
    this.domain = 0;                            // 适用范围 2（商圈）3（城市） 4(平台)
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间
    this.creatorId = undefined;                 // 创建人
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'planId',                     // 指标方案id
      'version',                    // 对应版本
      'name',                       // 名称
      'unit',                       // 单位(1:单,2:天,3:kg,4:km)
      'definition',                 // 指标定义
      'platformCode',               // 平台Code
      'state',                      // 状态 -101(删除) -100(停用) 100(启用)
      'domain',                     // 适用范围 2（商圈）3（城市） 4(平台)
      'updatedAt',                  // 更新时间
      'createdAt',                  // 创建时间
      'creatorId',                  // 创建人
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      plan_id: 'planId',
      version: 'version',
      fork_version: 'forkVersion',
      name: 'name',
      unit: 'unit',
      definition: 'definition',
      platform_code: 'platformCode',
      state: 'state',
      domain: 'domain',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
      creator_id: 'creatorId',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      planId: 'plan_id',
      version: 'version',
      forkVersion: 'fork_version',
      name: 'name',
      unit: 'unit',
      definition: 'definition',
      platformCode: 'platform_code',
      state: 'state',
      domain: 'domain',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      creatorId: 'creator_id',
    };
  }
}

// 结算指标参数值
class SalaryVarValue extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.planId = undefined;                    // 指标方案id
    this.varId = undefined;                     // 指标id
    this.configVersionId = undefined;           // 参数值版本(对应 salary_plan_version 中 config_version_id)
    this.definition = '';                       // 指标定义
    this.platformCode = '';                     // 平台Code
    this.supplierId = undefined;                // 供应商ID
    this.cityCode = '';                         // 城市code
    this.bizDistrictId = undefined;             // 商圈ID
    this.values = {};                           // 指标参数值字典: '{key:value}'. key 是参数 ID(string), value 是对应的取值.
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间
    this.creatorId = undefined;                 // 创建人
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'planId',                     // 指标方案id
      'varId',                      // 指标id
      'configVersionId',            // 参数值版本(对应 salary_plan_version 中 config_version_id)
      'definition',                 // 指标定义
      'platformCode',               // 平台Code
      'updatedAt',                  // 更新时间
      'createdAt',                  // 创建时间
      'creatorId',                  // 创建人
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      plan_id: 'planId',
      var_id: 'varId',
      config_version_id: 'configVersionId',
      definition: 'definition',
      platform_code: 'platformCode',
      supplier_id: 'supplierId',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      values: 'values',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
      creator_id: 'creatorId',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      planId: 'plan_id',
      varId: 'var_id',
      configVersionId: 'config_version_id',
      definition: 'definition',
      platformCode: 'platform_code',
      supplierId: 'supplier_id',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      values: 'values',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      creatorId: 'creator_id',
    };
  }
}

// 人员标签分组
class StaffTag extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.name = '';                             // 名称
    this.platformCode = '';                     // 平台code
    this.supplierId = undefined;                // 供应商ID
    this.cityCode = '';                         // 城市code
    this.bizDistrictId = undefined;             // 商圈ID
    this.tagType = 0;                           // 标签类型 1（城市级别）2（商圈级别）
    this.staffCounter = 0;                      // 人员数量
    this.operatorId = undefined;                // 创建人ID
    this.state = 0;                             // 100（启用） -100（停用）
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
      'id',                         // _id
      'name',                       // 名称
      'platformCode',               // 平台code
      'supplierId',                 // 供应商ID
      'cityCode',                   // 城市code
      'tagType',                    // 标签类型 1（城市级别）2（商圈级别）
      'operatorId',                 // 创建人ID
      'state',                      // 100（启用） -100（停用）
      'updatedAt',                  // 更新时间
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      platform_code: 'platformCode',
      supplier_id: 'supplierId',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      tag_type: 'tagType',
      staff_counter: 'staffCounter',
      operator_id: 'operatorId',
      state: 'state',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      platformCode: 'platform_code',
      supplierId: 'supplier_id',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      tagType: 'tag_type',
      staffCounter: 'staff_counter',
      operatorId: 'operator_id',
      state: 'state',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 人员标签
class StaffTagMap extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // Stuff ID
    this.tags = [];                             // 人员归属标签明细
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // Stuff ID
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      tags: 'tags',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      tags: 'tags',
    };
  }
}

// 上一版 module.exports
export {
  PayrollAdjustmentConfiguration,       // 结算单调整项(扣款补款)配置
  PayrollAdjustmentItem,                // 结算单调整项(扣款补款)项目
  PayrollAdjustmentDataTemplate,        // 结算单调整项(扣款补款)数据模板
  PayrollAdjustmentTask,                // 结算单调整项(扣款补款)数据上传任务
  SalaryPayrollAdjustmentLine,          // 人员扣款补款明细数据
  PayrollPlan,                          // 结算计划
  PayrollStatement,                     // 结算单-总账单（商圈级别）
  Payroll,                              // 结算单（明细）
  SalaryComputeTask,                    // 服务费试算任务
  SalaryComputeDataSet,                 // 人员服务费计算结果集
  SalaryPlan,                           // 服务费方案
  SalaryPlanVersion,                    // 服务费方案版本
  SalaryPlanRuleCollection,             // 服务费规则集
  SalaryRule,                           // 服务费计算规则
  SalaryVarPlan,                        // 结算指标方案库
  SalaryVar,                            // 结算指标定义
  SalaryVarValue,                       // 结算指标参数值
  StaffTag,                             // 人员标签分组
  StaffTagMap,                          // 人员标签
};
