import CoreObject from '../core';

// 复合指标公式表
class VarExpression extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.varId = undefined;                     // 指标ID
    this.valueLambda = '';                      // 指标计算函数{{a}} + {{b}}
    this.lambdaParams = [];                     // 参数code列表
    this.scope = '';                            // 作用域(美团:'meituan',饿了么:'elem')
    this.state = 0;                             // 状态(可用:100,不可用:-100)
    this.sourceType = 0;                        // 数据来源（通过数据文件获取:1,其他数据汇总:2,公式计算:3,boss系统获取:4）
    this.varKind = 0;                           // 指标种类（一级复合指标:1,二级:2,三级:3,四级:4,基础指标:10,特殊指标:20）
    this.varDimension = 0;                      // 指标维度（供应商:10,城市:20,商圈:30,骑士:40,订单:50)
    this.operatorId = undefined;                // 操作人id
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
      'id',                         // id
      'varId',                      // 指标ID
      'valueLambda',                // 指标计算函数{{a}} + {{b}}
      'lambdaParams',               // 参数code列表
      'scope',                      // 作用域(美团:'meituan',饿了么:'elem')
      'state',                      // 状态(可用:100,不可用:-100)
      'sourceType',                 // 数据来源（通过数据文件获取:1,其他数据汇总:2,公式计算:3,boss系统获取:4）
      'varKind',                    // 指标种类（一级复合指标:1,二级:2,三级:3,四级:4,基础指标:10,特殊指标:20）
      'varDimension',               // 指标维度（供应商:10,城市:20,商圈:30,骑士:40,订单:50)
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      var_id: 'varId',
      value_lambda: 'valueLambda',
      lambda_params: 'lambdaParams',
      scope: 'scope',
      state: 'state',
      source_type: 'sourceType',
      var_kind: 'varKind',
      var_dimension: 'varDimension',
      operator_id: 'operatorId',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      varId: 'var_id',
      valueLambda: 'value_lambda',
      lambdaParams: 'lambda_params',
      scope: 'scope',
      state: 'state',
      sourceType: 'source_type',
      varKind: 'var_kind',
      varDimension: 'var_dimension',
      operatorId: 'operator_id',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 源数据表
class DataSource extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.taskId = undefined;                    // 任务ID
    this.platformCode = '';                     // 平台
    this.supplierId = undefined;                // 供应商id
    this.cityCode = '';                         // 城市spelling
    this.bizDistrictId = undefined;             // 商圈id
    this.knightId = '';                         // 骑士ID
    this.staffId = undefined;                   // 骑士ID
    this.orderId = '';                          // 订单ID
    this.complainId = '';                       // 投诉ID
    this.dataDimension = [];                    // 数据维度（商圈，骑士）
    this.state = 0;                             // 数据状态(可用:1,不可用:-1)
    this.data = {};                             // 数据集合
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
      'id',                         // id
      'taskId',                     // 任务ID
      'dataDimension',              // 数据维度（商圈，骑士）
      'state',                      // 数据状态(可用:1,不可用:-1)
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      task_id: 'taskId',
      platform_code: 'platformCode',
      supplier_id: 'supplierId',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      knight_id: 'knightId',
      staff_id: 'staffId',
      order_id: 'orderId',
      complain_id: 'complainId',
      data_dimension: 'dataDimension',
      state: 'state',
      data: 'data',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      taskId: 'task_id',
      platformCode: 'platform_code',
      supplierId: 'supplier_id',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      knightId: 'knight_id',
      staffId: 'staff_id',
      orderId: 'order_id',
      complainId: 'complain_id',
      dataDimension: 'data_dimension',
      state: 'state',
      data: 'data',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 基于模版的指标公式表
class TemplateFormula extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.varId = undefined;                     // BOSS指标ID
    this.templateId = undefined;                // 模版ID
    this.type = 0;                              // 指标类型（预估:1，结算:2）
    this.keyUnique = 0;                         // 主键列是否唯一
    this.keyTitleName = '';                     // 主键列表头名
    this.valueDimension = 0;                    // 数据维度
    this.state = 0;                             // 数据状态(100:可用,-100:禁用)
    this.fetchCondition = '';                   // 筛选条件
    this.fetchType = 0;                         // 取值方式（列表项:1,列表项之和:2,列表行数:3）
    this.params = [];                           // 筛选条件的参数列表
    this.varTitleName = '';                     // 取值列表头名
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
      'id',                         // id
      'varId',                      // BOSS指标ID
      'templateId',                 // 模版ID
      'type',                       // 指标类型（预估:1，结算:2）
      'valueDimension',             // 数据维度
      'state',                      // 数据状态(100:可用,-100:禁用)
      'fetchType',                  // 取值方式（列表项:1,列表项之和:2,列表行数:3）
      'varTitleName',               // 取值列表头名
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      var_id: 'varId',
      template_id: 'templateId',
      type: 'type',
      key_unique: 'keyUnique',
      key_title_name: 'keyTitleName',
      value_dimension: 'valueDimension',
      state: 'state',
      fetch_condition: 'fetchCondition',
      fetch_type: 'fetchType',
      params: 'params',
      var_title_name: 'varTitleName',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      varId: 'var_id',
      templateId: 'template_id',
      type: 'type',
      keyUnique: 'key_unique',
      keyTitleName: 'key_title_name',
      valueDimension: 'value_dimension',
      state: 'state',
      fetchCondition: 'fetch_condition',
      fetchType: 'fetch_type',
      params: 'params',
      varTitleName: 'var_title_name',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 系统变量表
class VarDefinition extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.name = '';                             // 名称
    this.defaultValue = '';                     // 默认值
    this.state = 0;                             // 状态(可用:100,不可用:-100)
    this.suffix = '';                           // 单位
    this.code = '';                             // 对应码
    this.type = 0;                              // 指标类型（预估:1，结算:2）
    this.dataType = '';                         // 数据类型（'int','float','string'）
    this.varDimension = 0;                      // 指标维度（供应商:10,城市:20,商圈:30,骑士:40,订单:50)
    this.scope = '';                            // 作用域(美团:'meituan',饿了么:'elem')
    this.varKind = 0;                           // 指标种类（一级复合指标:1,二级:2,三级:3,四级:4,基础指标:10,特殊指标:20）
    this.sourceType = 0;                        // 数据来源（通过数据文件获取:1,其他数据汇总:2,公式计算:3,boss系统获取:4）
    this.averageType = [];                      // 日单均种类（总量:1,日均:2,单均:3）
    this.operatorId = undefined;                // 操作人id
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
      'id',                         // id
      'name',                       // 名称
      'defaultValue',               // 默认值
      'state',                      // 状态(可用:100,不可用:-100)
      'suffix',                     // 单位
      'code',                       // 对应码
      'type',                       // 指标类型（预估:1，结算:2）
      'dataType',                   // 数据类型（'int','float','string'）
      'varDimension',               // 指标维度（供应商:10,城市:20,商圈:30,骑士:40,订单:50)
      'scope',                      // 作用域(美团:'meituan',饿了么:'elem')
      'varKind',                    // 指标种类（一级复合指标:1,二级:2,三级:3,四级:4,基础指标:10,特殊指标:20）
      'sourceType',                 // 数据来源（通过数据文件获取:1,其他数据汇总:2,公式计算:3,boss系统获取:4）
      'averageType',                // 日单均种类（总量:1,日均:2,单均:3）
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      default_value: 'defaultValue',
      state: 'state',
      suffix: 'suffix',
      code: 'code',
      type: 'type',
      data_type: 'dataType',
      var_dimension: 'varDimension',
      scope: 'scope',
      var_kind: 'varKind',
      source_type: 'sourceType',
      average_type: 'averageType',
      operator_id: 'operatorId',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      defaultValue: 'default_value',
      state: 'state',
      suffix: 'suffix',
      code: 'code',
      type: 'type',
      dataType: 'data_type',
      varDimension: 'var_dimension',
      scope: 'scope',
      varKind: 'var_kind',
      sourceType: 'source_type',
      averageType: 'average_type',
      operatorId: 'operator_id',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 源数据模板表
class DataSourceTemplate extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.name = '';                             // 数据文件名称
    this.fileType = 0;                          // 文件类型(csv:1,xlsx:2,xls:3)
    this.platformCode = '';                     // 平台
    this.state = 0;                             // 是否可用（1可用:100,不可用:-100）
    this.reversible = 0;                        // 是否可取消上传（可取消:1,不可取消:0）
    this.titleIndex = 0;                        // 表头信息所在行数
    this.dataStartIndex = 0;                    // 数据取值起始行数
    this.createdType = 0;                       // 创建方式（系统模板:1,默认:2,自定义:3）
    this.taskProduceType = 0;                   // 任务生成类型（按时间分类:每日:1,每半月:2,每月:3）
    this.taskDimension = 0;                     // 任务维度（供应商:10,城市:20,商圈:30）
    this.valueDimensionList = [];               // 数据维度（供应商:10,城市:20,商圈:30,骑士:40,订单:50）
    this.dataTimeDimension = 0;                 // 数据时间维度（每日:1,每月:4）
    this.templateFormat = {};                   // 模版格式
    this.fileEncoding = '';                     // 模版编码
    this.orderSource = 0;                       // 订单来源（美团:1,跑腿:2,海葵:3）
    this.orderItemName = '';                    // 对应的订单子项名称
    this.note = '';                             // 备注
    this.operatorId = undefined;                // 操作人id
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
      'id',                         // id
      'name',                       // 数据文件名称
      'fileType',                   // 文件类型(csv:1,xlsx:2,xls:3)
      'platformCode',               // 平台
      'state',                      // 是否可用（1可用:100,不可用:-100）
      'reversible',                 // 是否可取消上传（可取消:1,不可取消:0）
      'titleIndex',                 // 表头信息所在行数
      'dataStartIndex',             // 数据取值起始行数
      'createdType',                // 创建方式（系统模板:1,默认:2,自定义:3）
      'taskProduceType',            // 任务生成类型（按时间分类:每日:1,每半月:2,每月:3）
      'taskDimension',              // 任务维度（供应商:10,城市:20,商圈:30）
      'dataTimeDimension',          // 数据时间维度（每日:1,每月:4）
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      file_type: 'fileType',
      platform_code: 'platformCode',
      state: 'state',
      reversible: 'reversible',
      title_index: 'titleIndex',
      data_start_index: 'dataStartIndex',
      created_type: 'createdType',
      task_produce_type: 'taskProduceType',
      task_dimension: 'taskDimension',
      value_dimension_list: 'valueDimensionList',
      data_time_dimension: 'dataTimeDimension',
      template_format: 'templateFormat',
      file_encoding: 'fileEncoding',
      order_source: 'orderSource',
      order_item_name: 'orderItemName',
      note: 'note',
      operator_id: 'operatorId',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      fileType: 'file_type',
      platformCode: 'platform_code',
      state: 'state',
      reversible: 'reversible',
      titleIndex: 'title_index',
      dataStartIndex: 'data_start_index',
      createdType: 'created_type',
      taskProduceType: 'task_produce_type',
      taskDimension: 'task_dimension',
      valueDimensionList: 'value_dimension_list',
      dataTimeDimension: 'data_time_dimension',
      templateFormat: 'template_format',
      fileEncoding: 'file_encoding',
      orderSource: 'order_source',
      orderItemName: 'order_item_name',
      note: 'note',
      operatorId: 'operator_id',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 指标日均、单均计算公式表
class VarAverageFormula extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.varId = undefined;                     // 指标ID
    this.averagePerDayLambda = '';              // 日均指标计算函数{{a}} + {{b}}
    this.averagePerDayParams = [];              // 日均指标函数参数code列表
    this.averagePerOrderLambda = '';            // 单均指标计算函数{{a}} + {{b}}
    this.averagePerOrderParams = [];            // 单均指标函数参数code列表
    this.scope = '';                            // 作用域(美团:'meituan'，饿了么:'elem')
    this.state = 0;                             // 状态(可用:100，不可用:-100)
    this.operatorId = undefined;                // 操作人id
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
      'id',                         // id
      'varId',                      // 指标ID
      'scope',                      // 作用域(美团:'meituan'，饿了么:'elem')
      'state',                      // 状态(可用:100，不可用:-100)
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      var_id: 'varId',
      average_per_day_lambda: 'averagePerDayLambda',
      average_per_day_params: 'averagePerDayParams',
      average_per_order_lambda: 'averagePerOrderLambda',
      average_per_order_params: 'averagePerOrderParams',
      scope: 'scope',
      state: 'state',
      operator_id: 'operatorId',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      varId: 'var_id',
      averagePerDayLambda: 'average_per_day_lambda',
      averagePerDayParams: 'average_per_day_params',
      averagePerOrderLambda: 'average_per_order_lambda',
      averagePerOrderParams: 'average_per_order_params',
      scope: 'scope',
      state: 'state',
      operatorId: 'operator_id',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 上传任务表
class UploadDataSourceTask extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.type = 0;                              // 任务类型（供应商:10，商圈:30）
    this.platformCode = '';                     // 平台code
    this.supplierId = undefined;                // 供应商id
    this.cityCode = '';                         // 城市code
    this.bizDistrictId = undefined;             // 商圈id
    this.startDate = 0;                         // 起始时间
    this.endDate = 0;                           // 终止时间
    this.state = 0;                             // 状态（待上传:0,待校验:1,数据校验中:2，校验失败:-10,上传成功:10,清洗基础指标:20,清洗复合指标:30,任务已取消:-100）
    this.errorMessageList = [];                 // 错误信息列表
    this.localPath = '';                        // 服务器存储地址
    this.uploadType = 0;                        // 上传类型（七牛:1,服务器:2,S3:3）
    this.fileKey = '';                          // 文件属性
    this.fileType = 0;                          // 文件类型（csv:1,xls:2）
    this.dataSourceTemplateId = undefined;      // 模版id
    this.operatorId = undefined;                // 操作人id
    this.finishedDate = undefined;              // 上传完成时间
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
      'id',                         // id
      'type',                       // 任务类型（供应商:10，商圈:30）
      'platformCode',               // 平台code
      'startDate',                  // 起始时间
      'endDate',                    // 终止时间
      'state',                      // 状态（待上传:0,待校验:1,数据校验中:2，校验失败:-10,上传成功:10,清洗基础指标:20,清洗复合指标:30,任务已取消:-100）
      'dataSourceTemplateId',       // 模版id
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      type: 'type',
      platform_code: 'platformCode',
      supplier_id: 'supplierId',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      start_date: 'startDate',
      end_date: 'endDate',
      state: 'state',
      error_message_list: 'errorMessageList',
      local_path: 'localPath',
      upload_type: 'uploadType',
      file_key: 'fileKey',
      file_type: 'fileType',
      data_source_template_id: 'dataSourceTemplateId',
      operator_id: 'operatorId',
      finished_date: 'finishedDate',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      type: 'type',
      platformCode: 'platform_code',
      supplierId: 'supplier_id',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      startDate: 'start_date',
      endDate: 'end_date',
      state: 'state',
      errorMessageList: 'error_message_list',
      localPath: 'local_path',
      uploadType: 'upload_type',
      fileKey: 'file_key',
      fileType: 'file_type',
      dataSourceTemplateId: 'data_source_template_id',
      operatorId: 'operator_id',
      finishedDate: 'finished_date',
      updatedAt: 'updated_at',
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
      'type',                       // 类型 1（人员明细）2（商圈）3（城市）
      'supplierId',                 // 供应商id
      'platformCode',               // 平台code
      'cityCode',                   // 城市code
      'planId',                     // 服务费方案ID
      'planVersionId',              // 服务费方案版本ID
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
    this.bizDistrictId = undefined;             // 商圈ID
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
      biz_district_id: 'bizDistrictId',
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
      bizDistrictId: 'biz_district_id',
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
    this.canAllowEdit = undefined;              // 是否可编辑
    this.canAllowCompute = undefined;           // 是否允许试算
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
      'canAllowEdit',               // 是否可编辑
      'canAllowCompute',            // 是否允许试算
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
      can_allow_edit: 'canAllowEdit',
      can_allow_compute: 'canAllowCompute',
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
      canAllowEdit: 'can_allow_edit',
      canAllowCompute: 'can_allow_compute',
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
    this.collectionIndexNum = 0;                // 在规则集中的优先级序号
    this.rulePrimaryKey = '';                   // 规则唯一主键
    this.matchFilters = {};                     // 数据源筛选器(条件)
    this.computeLogic = {};                     // 数据处理逻辑
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

// 结算指标方案配置版本
class SalaryVarConfigVersion extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.name = '';                             // 名称
    this.platformCode = '';                     // 平台
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
      'platformCode',               // 平台
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
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 结算指标方案配置默认版本
class SalaryVarConfigDefaultVersion extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.configVersionId = undefined;           // 结算指标方案配置版本id
    this.planId = undefined;                    // 服务费方案ID
    this.planVersionId = undefined;             // 服务费方案版本ID
    this.varPlanId = undefined;                 // 结算指标方案库ID
    this.varPlanVersionId = undefined;          // 结算指标方案库版本ID
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
      'configVersionId',            // 结算指标方案配置版本id
      'planId',                     // 服务费方案ID
      'planVersionId',              // 服务费方案版本ID
      'varPlanId',                  // 结算指标方案库ID
      'varPlanVersionId',           // 结算指标方案库版本ID
      'updatedAt',                  // 更新时间
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      config_version_id: 'configVersionId',
      plan_id: 'planId',
      plan_version_id: 'planVersionId',
      var_plan_id: 'varPlanId',
      var_plan_version_id: 'varPlanVersionId',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      configVersionId: 'config_version_id',
      planId: 'plan_id',
      planVersionId: 'plan_version_id',
      varPlanId: 'var_plan_id',
      varPlanVersionId: 'var_plan_version_id',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
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
    this.draftVersion = undefined;              // 草稿版本
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
      draft_version: 'draftVersion',
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
      draftVersion: 'draft_version',
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
    this.state = 0;                             // 状态 -101(删除) -100(停用) 100(启用)
    this.name = '';                             // 名称
    this.code = '';                             // 编码
    this.unit = 0;                              // 单位(1:单,2:天,3:kg,4:km,5:%,6:星,7:分钟,8:元9:无)
    this.unitText = '';                         // 单位名称
    this.definition = '';                       // 定义
    this.platformCode = '';                     // 平台Code
    this.level = 0;                             // 指标等级
    this.factor = '';                           // 条件
    this.formula = '';                          // 公式
    this.plan = 0;                              // 执行方案（1:汇总计数,2:求和,3:自定义公式,4:取值,5:阶梯）
    this.sourceDomain = 0;                      // 变量维度 1:(骑士) 2（商圈）3（城市） 4(平台) 5(供应商) 6(订单)7（基础指标）
    this.tags = [];                             // 所属标签
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
      'state',                      // 状态 -101(删除) -100(停用) 100(启用)
      'name',                       // 名称
      'code',                       // 编码
      'unit',                       // 单位(1:单,2:天,3:kg,4:km,5:%,6:星,7:分钟,8:元9:无)
      'unitText',                   // 单位名称
      'definition',                 // 定义
      'platformCode',               // 平台Code
      'level',                      // 指标等级
      'plan',                       // 执行方案（1:汇总计数,2:求和,3:自定义公式,4:取值,5:阶梯）
      'sourceDomain',               // 变量维度 1:(骑士) 2（商圈）3（城市） 4(平台) 5(供应商) 6(订单)7（基础指标）
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
      state: 'state',
      name: 'name',
      code: 'code',
      unit: 'unit',
      unit_text: 'unitText',
      definition: 'definition',
      platform_code: 'platformCode',
      level: 'level',
      factor: 'factor',
      formula: 'formula',
      plan: 'plan',
      source_domain: 'sourceDomain',
      tags: 'tags',
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
      state: 'state',
      name: 'name',
      code: 'code',
      unit: 'unit',
      unitText: 'unit_text',
      definition: 'definition',
      platformCode: 'platform_code',
      level: 'level',
      factor: 'factor',
      formula: 'formula',
      plan: 'plan',
      sourceDomain: 'source_domain',
      tags: 'tags',
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
    this.domain = 0;                            // 作用域（2（商圈）3（城市） 4(平台) 5(供应商)）
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
      'platformCode',               // 平台Code
      'domain',                     // 作用域（2（商圈）3（城市） 4(平台) 5(供应商)）
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
      domain: 'domain',
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
      domain: 'domain',
      values: 'values',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      creatorId: 'creator_id',
    };
  }
}

// 骑士异常账户
class AbnormalAccount extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.cityCode = '';                         // 城市code
    this.bizDistrictId = undefined;             // 商圈ID
    this.supplierId = undefined;                // 供应商ID
    this.platformCode = '';                     // 平台code
    this.name = '';                             // 骑士名称
    this.phone = '';                            // 骑士手机号码
    this.identityCardId = '';                   // 身份证ID
    this.courierId = '';                        // 骑士第三方账号ID
    this.positionId = 0;                        // 职位(1003:总监,1004:城市经理,1005:助理,1006:调度,1007:站长,1009:骑士长,1010:骑士)
    this.state = 0;                             // 状态(100:在职,0:离职待审核,-100:离职)
    this.jobCategoryId = 0;                     // 工作类型(101:全职白班,102:全职夜班,103:全职早餐,104:兼职)
    this.isProcessed = 0;                       // 处理状态(1.未处理,2.已处理)
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间
    this.operatorId = undefined;                // 操作人ID
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // _id
      'courierId',                  // 骑士第三方账号ID
      'isProcessed',                // 处理状态(1.未处理,2.已处理)
      'updatedAt',                  // 更新时间
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      supplier_id: 'supplierId',
      platform_code: 'platformCode',
      name: 'name',
      phone: 'phone',
      identity_card_id: 'identityCardId',
      courier_id: 'courierId',
      position_id: 'positionId',
      state: 'state',
      job_category_id: 'jobCategoryId',
      is_processed: 'isProcessed',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
      operator_id: 'operatorId',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      supplierId: 'supplier_id',
      platformCode: 'platform_code',
      name: 'name',
      phone: 'phone',
      identityCardId: 'identity_card_id',
      courierId: 'courier_id',
      positionId: 'position_id',
      state: 'state',
      jobCategoryId: 'job_category_id',
      isProcessed: 'is_processed',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      operatorId: 'operator_id',
    };
  }
}

// 人员信息表
class Staff extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.name = '';                             // 姓名
    this.phone = '';                            // 手机号
    this.operatorId = '';                       // 操作人id
    this.platformList = [];                     // 平台列表
    this.citySpellingList = [];                 // 城市列表
    this.bizDistrictList = [];                  // 商圈列表
    this.positionId = 0;                        // 职位(1003:总监,1004:城市经理, 1005:助理,1006:调度,1007:站长,1009:骑士长,1010:骑士)
    this.state = 0;                             // 状态(100:在职,0:离职待审核,-100:离职)
    this.workType = 0;                          // 工作类型（3001：全职，3002：兼职）
    this.jobCategoryLog = [];                   // 骑士类型转换日志
    this.entryDate = '';                        // 入职日期
    this.departureDate = '';                    // 离职日期
    this.associatedKnightIdList = [];           // 其他平台骑士ID列表
    this.customId = '';                         // 当前关联三方平台ID
    this.contractBelongId = '';                 // 合同归属
    this.headPortraitPhoto = '';                // 头像照片
    this.contractPhotoList = [];                // 合同照片
    this.genderId = 0;                          // 性别(1:男人, 2:女人)
    this.healthCertificate = '';                // 健康证(照片)
    this.healthCertificateBack = '';            // 健康证(背面照片)
    this.identityCardId = '';                   // 身份证号
    this.associatedIdentityCardId = '';         // 平台身份证号
    this.identityCardFront = '';                // 身份证正面照(照片)
    this.identityCardBack = '';                 // 身份证正背面(照片)
    this.bankCardId = '';                       // 银行证号
    this.cardholderName = '';                   // 持卡人姓名
    this.bankBranch = '';                       // 开户行支行
    this.bankCardFront = '';                    // 银行证正面照(照片)
    this.national = '';                         // 民族
    this.education = '';                        // 学历
    this.emergencyContact = '';                 // 紧急联系人
    this.emergencyContactPhone = '';            // 紧急联系人电话
    this.bust = '';                             // 半身照(照片)
    this.recruitmentChannelId = 0;              // 招聘渠道(1001:三方，1002:个人，1003:其他 )
    this.referrerStaffId = '';                  // 推荐人人员id
    this.departureLog = [];                     // 离职日志
    this.departureReason = '';                  // 离职原因
    this.jobTransferRemark = '';                // 工作交接备注
    this.departureApproverAccountId = '';       // 离职审批人id
    this.supplierList = [];                     // 服务商id列表
    this.transportType = 0;                     // 工号种类
    this.transportState = 0;                    // 工号状态
    this.paySalaryCycle = 0;                    // 服务费发放周期
    this.bankLocation = [];                     // 开户行省市
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
      'id',                         // id
      'name',                       // 姓名
      'phone',                      // 手机号
      'positionId',                 // 职位(1003:总监,1004:城市经理, 1005:助理,1006:调度,1007:站长,1009:骑士长,1010:骑士)
      'state',                      // 状态(100:在职,0:离职待审核,-100:离职)
      'workType',                   // 工作类型（3001：全职，3002：兼职）
      'identityCardId',             // 身份证号
      'supplierList',               // 服务商id列表
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      name: 'name',
      phone: 'phone',
      operator_id: 'operatorId',
      platform_list: 'platformList',
      city_spelling_list: 'citySpellingList',
      biz_district_list: 'bizDistrictList',
      position_id: 'positionId',
      state: 'state',
      work_type: 'workType',
      job_category_log: 'jobCategoryLog',
      entry_date: 'entryDate',
      departure_date: 'departureDate',
      associated_knight_id_list: 'associatedKnightIdList',
      custom_id: 'customId',
      contract_belong_id: 'contractBelongId',
      head_portrait_photo: 'headPortraitPhoto',
      contract_photo_list: 'contractPhotoList',
      gender_id: 'genderId',
      health_certificate: 'healthCertificate',
      health_certificate_back: 'healthCertificateBack',
      identity_card_id: 'identityCardId',
      associated_identity_card_id: 'associatedIdentityCardId',
      identity_card_front: 'identityCardFront',
      identity_card_back: 'identityCardBack',
      bank_card_id: 'bankCardId',
      cardholder_name: 'cardholderName',
      bank_branch: 'bankBranch',
      bank_card_front: 'bankCardFront',
      national: 'national',
      education: 'education',
      emergency_contact: 'emergencyContact',
      emergency_contact_phone: 'emergencyContactPhone',
      bust: 'bust',
      recruitment_channel_id: 'recruitmentChannelId',
      referrer_staff_id: 'referrerStaffId',
      departure_log: 'departureLog',
      departure_reason: 'departureReason',
      job_transfer_remark: 'jobTransferRemark',
      departure_approver_account_id: 'departureApproverAccountId',
      supplier_list: 'supplierList',
      transport_type: 'transportType',
      transport_state: 'transportState',
      pay_salary_cycle: 'paySalaryCycle',
      bank_location: 'bankLocation',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
      phone: 'phone',
      operatorId: 'operator_id',
      platformList: 'platform_list',
      citySpellingList: 'city_spelling_list',
      bizDistrictList: 'biz_district_list',
      positionId: 'position_id',
      state: 'state',
      workType: 'work_type',
      jobCategoryLog: 'job_category_log',
      entryDate: 'entry_date',
      departureDate: 'departure_date',
      associatedKnightIdList: 'associated_knight_id_list',
      customId: 'custom_id',
      contractBelongId: 'contract_belong_id',
      headPortraitPhoto: 'head_portrait_photo',
      contractPhotoList: 'contract_photo_list',
      genderId: 'gender_id',
      healthCertificate: 'health_certificate',
      healthCertificateBack: 'health_certificate_back',
      identityCardId: 'identity_card_id',
      associatedIdentityCardId: 'associated_identity_card_id',
      identityCardFront: 'identity_card_front',
      identityCardBack: 'identity_card_back',
      bankCardId: 'bank_card_id',
      cardholderName: 'cardholder_name',
      bankBranch: 'bank_branch',
      bankCardFront: 'bank_card_front',
      national: 'national',
      education: 'education',
      emergencyContact: 'emergency_contact',
      emergencyContactPhone: 'emergency_contact_phone',
      bust: 'bust',
      recruitmentChannelId: 'recruitment_channel_id',
      referrerStaffId: 'referrer_staff_id',
      departureLog: 'departure_log',
      departureReason: 'departure_reason',
      jobTransferRemark: 'job_transfer_remark',
      departureApproverAccountId: 'departure_approver_account_id',
      supplierList: 'supplier_list',
      transportType: 'transport_type',
      transportState: 'transport_state',
      paySalaryCycle: 'pay_salary_cycle',
      bankLocation: 'bank_location',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
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
    this.tagType = 0;                           // 标签类型 1（商圈级别）2（城市级别）3(供应商) 4（平台）
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
      'tagType',                    // 标签类型 1（商圈级别）2（城市级别）3(供应商) 4（平台）
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
    this.costAllocations = [];                  // 分摊明细对象[{platform_code, city_code, supplier_id, biz_district_id}]
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
    };
  }
}

// OA审批单操作日志
class OaApplicationOrderLog extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.operatorId = undefined;                // 操作人ID
    this.operationId = 0;                       // 操作类型（1： 提交 10：审核、20：修改、30：催办、40：抄送）
    this.stateChanges = undefined;              // 记录本次操作引起的状态变更, 从 ori_state 修改为 to_state
    this.orderId = undefined;                   // OA申请审批单ID
    this.flowId = undefined;                    // 审批流程ID
    this.nodeId = undefined;                    // 审批流程节点ID
    this.updatedAt = undefined;                 // 更新时间
    this.createdAt = undefined;                 // 创建时间
    this.note = '';                             // 备注
    this.extraMeta = {};                        // 附加字段
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return undefined;
  }

  // 必填字段
  static requiredFields() {
    return [
      'id',                         // id
      'operatorId',                 // 操作人ID
      'operationId',                // 操作类型（1： 提交 10：审核、20：修改、30：催办、40：抄送）
      'orderId',                    // OA申请审批单ID
      'flowId',                     // 审批流程ID
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      operator_id: 'operatorId',
      operation_id: 'operationId',
      state_changes: 'stateChanges',
      order_id: 'orderId',
      flow_id: 'flowId',
      node_id: 'nodeId',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
      note: 'note',
      extra_meta: 'extraMeta',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      operatorId: 'operator_id',
      operationId: 'operation_id',
      stateChanges: 'state_changes',
      orderId: 'order_id',
      flowId: 'flow_id',
      nodeId: 'node_id',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
      note: 'note',
      extraMeta: 'extra_meta',
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
    this.salaryPlanVersionId = undefined;       // 服务费版本ID
    this.salaryComputeTaskId = undefined;       // 试算记录ID
    this.payrollStatementId = undefined;        // 结算单-总账单id（商圈级别）
    this.managementAmount = 0;                  // 试算总金额
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
      salary_plan_version_id: 'salaryPlanVersionId',
      salary_compute_task_id: 'salaryComputeTaskId',
      payroll_statement_id: 'payrollStatementId',
      management_amount: 'managementAmount',
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
      salaryPlanVersionId: 'salary_plan_version_id',
      salaryComputeTaskId: 'salary_compute_task_id',
      payrollStatementId: 'payroll_statement_id',
      managementAmount: 'management_amount',
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
    this.accountingId = undefined;              // 科目ID
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
      'accountingId',               // 科目ID
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
      accounting_id: 'accountingId',
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
      accountingId: 'accounting_id',
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

// 结算单-总账单（商圈级别）
class PayrollStatement extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.supplierId = undefined;                // 供应商id
    this.platformCode = '';                     // 平台code
    this.cityCode = '';                         // 城市code
    this.bizDistrictId = undefined;             // 商圈ID
    this.parentStatementId = undefined;         // 父级ID
    this.domain = 0;                            // 数据维度(2:商圈, 3:城市)
    this.payrollCycleType = 0;                  // 周期类型(按月:1, 按日:2)
    this.payrollPlanId = undefined;             // 服务费计划id
    this.payrollCycleNo = 0;                    // 服务费计划周期编号
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
    this.adjustmentHrDecMoney = 0;              // 人事扣款总额
    this.adjustmentHrIncMoney = 0;              // 人事补款总额
    this.adjustmentStaffDecMoney = 0;           // 人员扣款总额
    this.adjustmentStaffIncMoney = 0;           // 人员补款总额
    this.adjustmentStaffIncState = false;       // 人员补款状态
    this.adjustmentStaffDecState = false;       // 人员扣款状态
    this.adjustmentHrIncState = false;          // 人事补款状态
    this.adjustmentHrDecState = false;          // 人事扣款状态
    this.singleAverageAmount = 0;               // 单均成本
    this.oaApplicationOrderId = undefined;      // OA审批单ID
    this.salaryComputeDataSetId = undefined;    // 服务费计算结果集ID
    this.startDate = 0;                         // 起始日期
    this.endDate = 0;                           // 结束日期
    this.createdAt = undefined;                 // 创建时间
    this.updatedAt = undefined;                 // 更新时间
    this.positionId = 0;                        // 职位ID
    this.knightDecMoney = 0;                    // 骑士扣款总额
    this.knightIncMoney = 0;                    // 骑士补款总额
    this.knightDecState = false;                // 骑士扣款状态
    this.knightIncState = false;                // 骑士补款状态
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
      'domain',                     // 数据维度(2:商圈, 3:城市)
      'payrollCycleType',           // 周期类型(按月:1, 按日:2)
      'payrollPlanId',              // 服务费计划id
      'payrollCycleNo',             // 服务费计划周期编号
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
      'adjustmentHrDecMoney',       // 人事扣款总额
      'adjustmentHrIncMoney',       // 人事补款总额
      'adjustmentStaffDecMoney',    // 人员扣款总额
      'adjustmentStaffIncMoney',    // 人员补款总额
      'singleAverageAmount',        // 单均成本
      'startDate',                  // 起始日期
      'endDate',                    // 结束日期
      'createdAt',                  // 创建时间
      'updatedAt',                  // 更新时间
      'positionId',                 // 职位ID
      'knightDecMoney',             // 骑士扣款总额
      'knightIncMoney',             // 骑士补款总额
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
      parent_statement_id: 'parentStatementId',
      domain: 'domain',
      payroll_cycle_type: 'payrollCycleType',
      payroll_plan_id: 'payrollPlanId',
      payroll_cycle_no: 'payrollCycleNo',
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
      adjustment_hr_dec_money: 'adjustmentHrDecMoney',
      adjustment_hr_inc_money: 'adjustmentHrIncMoney',
      adjustment_staff_dec_money: 'adjustmentStaffDecMoney',
      adjustment_staff_inc_money: 'adjustmentStaffIncMoney',
      adjustment_staff_inc_state: 'adjustmentStaffIncState',
      adjustment_staff_dec_state: 'adjustmentStaffDecState',
      adjustment_hr_inc_state: 'adjustmentHrIncState',
      adjustment_hr_dec_state: 'adjustmentHrDecState',
      single_average_amount: 'singleAverageAmount',
      oa_application_order_id: 'oaApplicationOrderId',
      salary_compute_data_set_id: 'salaryComputeDataSetId',
      start_date: 'startDate',
      end_date: 'endDate',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      position_id: 'positionId',
      knight_dec_money: 'knightDecMoney',
      knight_inc_money: 'knightIncMoney',
      knight_dec_state: 'knightDecState',
      knight_inc_state: 'knightIncState',
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
      parentStatementId: 'parent_statement_id',
      domain: 'domain',
      payrollCycleType: 'payroll_cycle_type',
      payrollPlanId: 'payroll_plan_id',
      payrollCycleNo: 'payroll_cycle_no',
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
      adjustmentHrDecMoney: 'adjustment_hr_dec_money',
      adjustmentHrIncMoney: 'adjustment_hr_inc_money',
      adjustmentStaffDecMoney: 'adjustment_staff_dec_money',
      adjustmentStaffIncMoney: 'adjustment_staff_inc_money',
      adjustmentStaffIncState: 'adjustment_staff_inc_state',
      adjustmentStaffDecState: 'adjustment_staff_dec_state',
      adjustmentHrIncState: 'adjustment_hr_inc_state',
      adjustmentHrDecState: 'adjustment_hr_dec_state',
      singleAverageAmount: 'single_average_amount',
      oaApplicationOrderId: 'oa_application_order_id',
      salaryComputeDataSetId: 'salary_compute_data_set_id',
      startDate: 'start_date',
      endDate: 'end_date',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      positionId: 'position_id',
      knightDecMoney: 'knight_dec_money',
      knightIncMoney: 'knight_inc_money',
      knightDecState: 'knight_dec_state',
      knightIncState: 'knight_inc_state',
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
    this.adjustmentHrDecMoney = 0;              // 人事扣款总额
    this.adjustmentHrIncMoney = 0;              // 人事补款总额
    this.adjustmentStaffDecMoney = 0;           // 人员扣款总额
    this.adjustmentStaffIncMoney = 0;           // 人员补款总额
    this.adjustmentItemLines = [];              // 扣补款项目明细
    this.operatorId = undefined;                // 操作人id
    this.debtsType = 0;                         // 欠款类型
    this.updateTime = undefined;                // 更新时间
    this.paySalaryState = 0;                    // 结算状态(1 正常 -1 缓发)
    this.oaApplicationOrderId = undefined;      // OA审批单ID
    this.createdAt = undefined;                 // 创建时间
    this.workType = 0;                          // 工作性质
    this.salaryData = {};                       // 服务费数据
    this.positionId = 0;                        // 职位ID
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
      'adjustmentHrDecMoney',       // 人事扣款总额
      'adjustmentHrIncMoney',       // 人事补款总额
      'adjustmentStaffDecMoney',    // 人员扣款总额
      'adjustmentStaffIncMoney',    // 人员补款总额
      'debtsType',                  // 欠款类型
      'paySalaryState',             // 结算状态(1 正常 -1 缓发)
      'createdAt',                  // 创建时间
      'workType',                   // 工作性质
      'salaryData',                 // 服务费数据
      'positionId',                 // 职位ID
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
      adjustment_hr_dec_money: 'adjustmentHrDecMoney',
      adjustment_hr_inc_money: 'adjustmentHrIncMoney',
      adjustment_staff_dec_money: 'adjustmentStaffDecMoney',
      adjustment_staff_inc_money: 'adjustmentStaffIncMoney',
      adjustment_item_lines: 'adjustmentItemLines',
      operator_id: 'operatorId',
      debts_type: 'debtsType',
      update_time: 'updateTime',
      pay_salary_state: 'paySalaryState',
      oa_application_order_id: 'oaApplicationOrderId',
      created_at: 'createdAt',
      work_type: 'workType',
      salary_data: 'salaryData',
      position_id: 'positionId',
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
      adjustmentHrDecMoney: 'adjustment_hr_dec_money',
      adjustmentHrIncMoney: 'adjustment_hr_inc_money',
      adjustmentStaffDecMoney: 'adjustment_staff_dec_money',
      adjustmentStaffIncMoney: 'adjustment_staff_inc_money',
      adjustmentItemLines: 'adjustment_item_lines',
      operatorId: 'operator_id',
      debtsType: 'debts_type',
      updateTime: 'update_time',
      paySalaryState: 'pay_salary_state',
      oaApplicationOrderId: 'oa_application_order_id',
      createdAt: 'created_at',
      workType: 'work_type',
      salaryData: 'salary_data',
      positionId: 'position_id',
    };
  }
}

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
    this.payrollCycleNo = 0;                    // 服务费计划周期
    this.payrollStatementId = undefined;        // 服务费总账单
    this.fundFlag = false;                      // 款项标示(true无款项)
    this.templateId = undefined;                // 模板id
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
    this.errData = [];                          // 错误信息[]
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
      'supplierId',                 // 供应商id
      'platformCode',               // 平台code
      'cityCode',                   // 城市code
      'payrollPlanId',              // 服务费计划id
      'payrollCycleNo',             // 服务费计划周期
      'payrollStatementId',         // 服务费总账单
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
      payroll_cycle_no: 'payrollCycleNo',
      payroll_statement_id: 'payrollStatementId',
      fund_flag: 'fundFlag',
      template_id: 'templateId',
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
      payrollCycleNo: 'payroll_cycle_no',
      payrollStatementId: 'payroll_statement_id',
      fundFlag: 'fund_flag',
      templateId: 'template_id',
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
    this.group = 0;                             // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
    this.createdAt = undefined;                 // 创建时间
    this.state = 0;                             // 状态 100（正常） -101（删除）
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
      'group',                      // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
      'createdAt',                  // 创建时间
      'state',                      // 状态 100（正常） -101（删除）
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
      payroll_statement_id: 'payrollStatementId',
      staff_id: 'staffId',
      id_card_num: 'idCardNum',
      items: 'items',
      belong_time: 'belongTime',
      start_date: 'startDate',
      end_date: 'endDate',
      group: 'group',
      created_at: 'createdAt',
      state: 'state',
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
      group: 'group',
      createdAt: 'created_at',
      state: 'state',
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

// 供应商数据表
class BizDataBySupplier extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.platformCode = '';                     // 平台
    this.day = 0;                               // 日
    this.month = 0;                             // 月
    this.year = 0;                              // 年
    this.timestamp = undefined;                 // 时间戳
    this.dataStandard = {};                     // 指标数据
    this.type = 0;                              // 数据类型（10:预估,20:结算）
    this.supplierId = undefined;                // 供应商id
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
      'id',                         // id
      'platformCode',               // 平台
      'year',                       // 年
      'dataStandard',               // 指标数据
      'type',                       // 数据类型（10:预估,20:结算）
      'supplierId',                 // 供应商id
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      platform_code: 'platformCode',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      data_standard: 'dataStandard',
      type: 'type',
      supplier_id: 'supplierId',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      platformCode: 'platform_code',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      dataStandard: 'data_standard',
      type: 'type',
      supplierId: 'supplier_id',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 申诉单数据表
class BizDataByAppeal extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.platformCode = '';                     // 平台
    this.knightId = '';                         // 骑士id
    this.staffId = undefined;                   // 人员id
    this.bizDistrictId = undefined;             // 商圈id
    this.cityCode = '';                         // 城市code
    this.supplierId = undefined;                // 供应商id
    this.orderId = '';                          // 订单ID
    this.complainId = '';                       // 投诉ID
    this.orderSource = 0;                       // 订单来源（美团:1,跑腿:2,海葵:3）
    this.waybillId = '';                        // 运单ID
    this.day = 0;                               // 日
    this.month = 0;                             // 月
    this.year = 0;                              // 年
    this.timestamp = undefined;                 // 时间戳
    this.dataStandard = {};                     // 指标数据
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
      'id',                         // id
      'platformCode',               // 平台
      'supplierId',                 // 供应商id
      'orderId',                    // 订单ID
      'complainId',                 // 投诉ID
      'year',                       // 年
      'dataStandard',               // 指标数据
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      platform_code: 'platformCode',
      knight_id: 'knightId',
      staff_id: 'staffId',
      biz_district_id: 'bizDistrictId',
      city_code: 'cityCode',
      supplier_id: 'supplierId',
      order_id: 'orderId',
      complain_id: 'complainId',
      order_source: 'orderSource',
      waybill_id: 'waybillId',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      data_standard: 'dataStandard',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      platformCode: 'platform_code',
      knightId: 'knight_id',
      staffId: 'staff_id',
      bizDistrictId: 'biz_district_id',
      cityCode: 'city_code',
      supplierId: 'supplier_id',
      orderId: 'order_id',
      complainId: 'complain_id',
      orderSource: 'order_source',
      waybillId: 'waybill_id',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      dataStandard: 'data_standard',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 订单数据表
class BizDataByOrder extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.platformCode = '';                     // 平台
    this.knightId = '';                         // 骑士id
    this.staffId = undefined;                   // 人员id
    this.bizDistrictId = undefined;             // 商圈id
    this.cityCode = '';                         // 城市code
    this.supplierId = undefined;                // 供应商id
    this.orderId = '';                          // 订单ID
    this.orderSource = 0;                       // 订单来源（美团:1,跑腿:2,海葵:3）
    this.waybillId = '';                        // 运单ID
    this.day = 0;                               // 日
    this.month = 0;                             // 月
    this.year = 0;                              // 年
    this.timestamp = undefined;                 // 时间戳
    this.dataStandard = {};                     // 指标数据
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
      'id',                         // id
      'platformCode',               // 平台
      'supplierId',                 // 供应商id
      'year',                       // 年
      'dataStandard',               // 指标数据
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      platform_code: 'platformCode',
      knight_id: 'knightId',
      staff_id: 'staffId',
      biz_district_id: 'bizDistrictId',
      city_code: 'cityCode',
      supplier_id: 'supplierId',
      order_id: 'orderId',
      order_source: 'orderSource',
      waybill_id: 'waybillId',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      data_standard: 'dataStandard',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      platformCode: 'platform_code',
      knightId: 'knight_id',
      staffId: 'staff_id',
      bizDistrictId: 'biz_district_id',
      cityCode: 'city_code',
      supplierId: 'supplier_id',
      orderId: 'order_id',
      orderSource: 'order_source',
      waybillId: 'waybill_id',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      dataStandard: 'data_standard',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 商圈数据表
class BizDataByDistrict extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.day = 0;                               // 日
    this.month = 0;                             // 月
    this.year = 0;                              // 年
    this.dataStandard = {};                     // 指标数据
    this.timestamp = undefined;                 // 时间戳
    this.type = 0;                              // 数据类型（10:预估,20:结算）
    this.bizDistrictId = undefined;             // 商圈id
    this.cityCode = '';                         // 城市code
    this.supplierId = undefined;                // 供应商id
    this.platformCode = '';                     // 平台
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
      'id',                         // id
      'year',                       // 年
      'dataStandard',               // 指标数据
      'type',                       // 数据类型（10:预估,20:结算）
      'bizDistrictId',              // 商圈id
      'supplierId',                 // 供应商id
      'platformCode',               // 平台
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      day: 'day',
      month: 'month',
      year: 'year',
      data_standard: 'dataStandard',
      timestamp: 'timestamp',
      type: 'type',
      biz_district_id: 'bizDistrictId',
      city_code: 'cityCode',
      supplier_id: 'supplierId',
      platform_code: 'platformCode',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      day: 'day',
      month: 'month',
      year: 'year',
      dataStandard: 'data_standard',
      timestamp: 'timestamp',
      type: 'type',
      bizDistrictId: 'biz_district_id',
      cityCode: 'city_code',
      supplierId: 'supplier_id',
      platformCode: 'platform_code',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 城市数据表
class BizDataByCity extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.platformCode = '';                     // 平台
    this.day = 0;                               // 日
    this.month = 0;                             // 月
    this.year = 0;                              // 年
    this.timestamp = undefined;                 // 时间戳
    this.dataStandard = {};                     // 指标数据
    this.type = 0;                              // 数据类型（10:预估,20:结算）
    this.cityCode = '';                         // 城市code
    this.supplierId = undefined;                // 供应商id
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
      'id',                         // id
      'platformCode',               // 平台
      'year',                       // 年
      'dataStandard',               // 指标数据
      'type',                       // 数据类型（10:预估,20:结算）
      'supplierId',                 // 供应商id
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      platform_code: 'platformCode',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      data_standard: 'dataStandard',
      type: 'type',
      city_code: 'cityCode',
      supplier_id: 'supplierId',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      platformCode: 'platform_code',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      dataStandard: 'data_standard',
      type: 'type',
      cityCode: 'city_code',
      supplierId: 'supplier_id',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 骑士数据表
class BizDataByKnight extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.day = 0;                               // 日
    this.month = 0;                             // 月
    this.year = 0;                              // 年
    this.timestamp = undefined;                 // 时间戳
    this.type = 0;                              // 数据类型（10:预估,20:结算）
    this.knightId = '';                         // 骑士id
    this.staffId = undefined;                   // 骑士id
    this.bizDistrictId = undefined;             // 商圈id
    this.cityCode = '';                         // 城市id
    this.supplierId = undefined;                // 供应商id
    this.platformCode = '';                     // 平台
    this.dataStandard = {};                     // 指标数据
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
      'id',                         // id
      'year',                       // 年
      'type',                       // 数据类型（10:预估,20:结算）
      'knightId',                   // 骑士id
      'supplierId',                 // 供应商id
      'platformCode',               // 平台
      'dataStandard',               // 指标数据
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      type: 'type',
      knight_id: 'knightId',
      staff_id: 'staffId',
      biz_district_id: 'bizDistrictId',
      city_code: 'cityCode',
      supplier_id: 'supplierId',
      platform_code: 'platformCode',
      data_standard: 'dataStandard',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      type: 'type',
      knightId: 'knight_id',
      staffId: 'staff_id',
      bizDistrictId: 'biz_district_id',
      cityCode: 'city_code',
      supplierId: 'supplier_id',
      platformCode: 'platform_code',
      dataStandard: 'data_standard',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 投诉单数据表
class BizDataByComplain extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.platformCode = '';                     // 平台
    this.knightId = '';                         // 骑士id
    this.staffId = undefined;                   // 人员id
    this.bizDistrictId = undefined;             // 商圈id
    this.cityCode = '';                         // 城市code
    this.supplierId = undefined;                // 供应商id
    this.orderId = '';                          // 订单ID
    this.complainId = '';                       // 投诉ID
    this.orderSource = 0;                       // 订单来源（美团:1,跑腿:2,海葵:3）
    this.waybillId = '';                        // 运单ID
    this.day = 0;                               // 日
    this.month = 0;                             // 月
    this.year = 0;                              // 年
    this.timestamp = undefined;                 // 时间戳
    this.dataStandard = {};                     // 指标数据
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
      'id',                         // id
      'platformCode',               // 平台
      'supplierId',                 // 供应商id
      'orderId',                    // 订单ID
      'complainId',                 // 投诉ID
      'year',                       // 年
      'dataStandard',               // 指标数据
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      platform_code: 'platformCode',
      knight_id: 'knightId',
      staff_id: 'staffId',
      biz_district_id: 'bizDistrictId',
      city_code: 'cityCode',
      supplier_id: 'supplierId',
      order_id: 'orderId',
      complain_id: 'complainId',
      order_source: 'orderSource',
      waybill_id: 'waybillId',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      data_standard: 'dataStandard',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      platformCode: 'platform_code',
      knightId: 'knight_id',
      staffId: 'staff_id',
      bizDistrictId: 'biz_district_id',
      cityCode: 'city_code',
      supplierId: 'supplier_id',
      orderId: 'order_id',
      complainId: 'complain_id',
      orderSource: 'order_source',
      waybillId: 'waybill_id',
      day: 'day',
      month: 'month',
      year: 'year',
      timestamp: 'timestamp',
      dataStandard: 'data_standard',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

// 标准数据表
class BizData extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.timestamp = undefined;                 // 时间戳
    this.day = 0;                               // 日
    this.month = 0;                             // 月
    this.year = 0;                              // 年
    this.platformCode = '';                     // 平台
    this.supplierId = undefined;                // 供应商id
    this.cityCode = '';                         // 城市CODE
    this.bizDistrictId = undefined;             // 商圈id
    this.knightId = '';                         // 骑士id
    this.staffId = undefined;                   // 人员ID
    this.orderId = '';                          // 订单ID
    this.waybillId = '';                        // 运单ID
    this.complainId = '';                       // 投诉ID
    this.type = 0;                              // 数据类型（10:预估,20:结算）
    this.dataStandard = {};                     // 标准数据集合
    this.orderSource = 0;                       // 订单来源（美团:1,跑腿:2,海葵:3）
    this.dataDimension = 0;                     // 数据维度（供应商:10,城市:20,商圈:30,骑士:40,订单:50）
    this.dataTimeDimension = 0;                 // 数据时间维度（每日:1,每周:2,每半月:3,每月:4）
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
      'id',                         // id
      'year',                       // 年
      'platformCode',               // 平台
      'complainId',                 // 投诉ID
      'type',                       // 数据类型（10:预估,20:结算）
      'dataStandard',               // 标准数据集合
      'dataDimension',              // 数据维度（供应商:10,城市:20,商圈:30,骑士:40,订单:50）
      'dataTimeDimension',          // 数据时间维度（每日:1,每周:2,每半月:3,每月:4）
      'createdAt',                  // 创建时间
    ];
  }

  // 数据映射
  static datamap() {
    return {
      _id: 'id',
      timestamp: 'timestamp',
      day: 'day',
      month: 'month',
      year: 'year',
      platform_code: 'platformCode',
      supplier_id: 'supplierId',
      city_code: 'cityCode',
      biz_district_id: 'bizDistrictId',
      knight_id: 'knightId',
      staff_id: 'staffId',
      order_id: 'orderId',
      waybill_id: 'waybillId',
      complain_id: 'complainId',
      type: 'type',
      data_standard: 'dataStandard',
      order_source: 'orderSource',
      data_dimension: 'dataDimension',
      data_time_dimension: 'dataTimeDimension',
      updated_at: 'updatedAt',
      created_at: 'createdAt',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      timestamp: 'timestamp',
      day: 'day',
      month: 'month',
      year: 'year',
      platformCode: 'platform_code',
      supplierId: 'supplier_id',
      cityCode: 'city_code',
      bizDistrictId: 'biz_district_id',
      knightId: 'knight_id',
      staffId: 'staff_id',
      orderId: 'order_id',
      waybillId: 'waybill_id',
      complainId: 'complain_id',
      type: 'type',
      dataStandard: 'data_standard',
      orderSource: 'order_source',
      dataDimension: 'data_dimension',
      dataTimeDimension: 'data_time_dimension',
      updatedAt: 'updated_at',
      createdAt: 'created_at',
    };
  }
}

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

//
class CommonMessageExtra extends CoreObject {
  constructor() {
    super();
    this.accountList = [];                      //
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return CommonMessage;
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
    };
  }

  // 反向映射
  static revertMap() {
    return {
      accountList: {
        key: 'account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
    };
  }
}

// 服务费规则集详情
class SalaryPlanRuleCollectionDetail extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryPlanRuleCollection;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 按单条件信息
class RangeTableInfo extends CoreObject {
  constructor() {
    super();
    this.index = undefined;                     // 指标
    this.symbolMin = '';                        // left运算符
    this.money = 0;                             // 取值
    this.min = 0;                               // 最小值
    this.max = 0;                               // 最大值
    this.unitAmount = 1;                        // 步长
    this.symbolMax = '';                        // right运算符
    this.deltaFlag = false;                     // True 按和档位最高值不足部分（和档位上限差额值）计算 False 按实际量计算
    this.minMoney = 0;                          // 档位最低奖罚金额
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
      index: 'index',
      symbol_min: 'symbolMin',
      money: 'money',
      min: 'min',
      max: 'max',
      unit_amount: 'unitAmount',
      symbol_max: 'symbolMax',
      delta_flag: 'deltaFlag',
      min_money: 'minMoney',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      index: 'index',
      symbolMin: 'symbol_min',
      money: 'money',
      min: 'min',
      max: 'max',
      unitAmount: 'unit_amount',
      symbolMax: 'symbol_max',
      deltaFlag: 'delta_flag',
      minMoney: 'min_money',
    };
  }
}

//
class ApplicationFlowNodeEmbedItem extends CoreObject {
  constructor() {
    super();
    this.accountList = [];                      //
    this.parentFlowTemplateInfo = undefined;    //
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

// 服务费数据信息
class SalaryInfo extends CoreObject {
  constructor() {
    super();
    this.realMaterialDepositDeduction = 0;      // 实扣物资保证金总额
    this.knightPayment = 0;                     // 骑士补款
    this.orderCount = 0;                        // 完成单量
    this.materialDeduction = 0;                 // 物资扣款
    this.realEquipmentCashDeposit = 0;          // 实扣装备保证金
    this.qaMoney = 0;                           // 质量补贴
    this.realMaterialDeduction = 0;             // 实扣物资扣款
    this.workEfficiency = 0;                    // 人效(单/人日)
    this.monthTimeoutOrderCount = 0;            // 超时单量
    this.subsidySeniority = 0;                  // 工龄补助
    this.waterAndInternetDeduction = 0;         // 水电网费扣款
    this.monthBadOrderCount = 0;                // 差评单量
    this.socialSecurityDeduction = 0;           // 社保代缴扣款(单位承担)
    this.monthTimeLimitCompleteOrderCount = 0;  // 准时单量
    this.badWeatherSubsidy = 0;                 // 恶劣天气补贴
    this.subsidyPhone = 0;                      // 话补
    this.adjustmentWorkDifferences = 0;         // 调整考勤差异
    this.subsidyCar = 0;                        // 车补
    this.equipmentDepositReturn = 0;            // 装备押金返还
    this.excellentStaffAward = 0;               // 优秀人员奖励
    this.platformOfflineDeduction = 0;          // 平台线下罚款
    this.workMoney = 0;                         // 出勤补贴
    this.deductionReduction = 0;                // 扣罚减免
    this.specialTimeSubsidy = 0;                // 特殊时段补贴
    this.orderMoney = 0;                        // 单量提成
    this.knightDeduction = 0;                   // 骑士扣款
    this.subsidyCharge = 0;                     // 充电补助
    this.orderPayment = 0;                      // 其他补款
    this.equipmentDepositDeduction = 0;         // 装备押金扣款
    this.rentDeduction = 0;                     // 住宿/房租扣款
    this.realEquipmentDeduction = 0;            // 实扣装备扣款
    this.workDays = 0;                          // 出单天数
    this.equipmentDeduction = 0;                // 装备扣款
    this.operationMoney = 0;                    // 管理扣罚
    this.payableMoney = 0;                      // 应发工资
    this.newItem = 0;                           // 新项目
    this.violationStationAdminDeduction = 0;    // 违反站内管理扣款
    this.orderDeduction = 0;                    // 其他扣款
    this.monthPraiseOrderCount = 0;             // 好评单量
    this.electricVehicleDeduction = 0;          // 电动车扣款
    this.accidentDeduction = 0;                 // 意外险扣款
    this.validAttendance = 0;                   // 有效出勤
    this.specialSeasonSubsidy = 0;              // 特殊季节补贴
    this.netPayMoney = 0;                       // 实发工资
    this.realTripartiteDeduction = 0;           // 实扣三方扣款
    this.adjustmentHrDecMoney = 0;              // 人事扣款
    this.adjustmentOrderDifferences = 0;        // 调整单量差异
    this.realInterBankCost = 0;                 // 实扣跨行扣款
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
      real_material_deposit_deduction: 'realMaterialDepositDeduction',
      knight_payment: 'knightPayment',
      order_count: 'orderCount',
      material_deduction: 'materialDeduction',
      real_equipment_cash_deposit: 'realEquipmentCashDeposit',
      qa_money: 'qaMoney',
      real_material_deduction: 'realMaterialDeduction',
      work_efficiency: 'workEfficiency',
      month_timeout_order_count: 'monthTimeoutOrderCount',
      subsidy_seniority: 'subsidySeniority',
      water_and_internet_deduction: 'waterAndInternetDeduction',
      month_bad_order_count: 'monthBadOrderCount',
      social_security_deduction: 'socialSecurityDeduction',
      month_time_limit_complete_order_count: 'monthTimeLimitCompleteOrderCount',
      bad_weather_subsidy: 'badWeatherSubsidy',
      subsidy_phone: 'subsidyPhone',
      adjustment_work_differences: 'adjustmentWorkDifferences',
      subsidy_car: 'subsidyCar',
      equipment_deposit_return: 'equipmentDepositReturn',
      excellent_staff_award: 'excellentStaffAward',
      platform_offline_deduction: 'platformOfflineDeduction',
      work_money: 'workMoney',
      deduction_reduction: 'deductionReduction',
      special_time_subsidy: 'specialTimeSubsidy',
      order_money: 'orderMoney',
      knight_deduction: 'knightDeduction',
      subsidy_charge: 'subsidyCharge',
      order_payment: 'orderPayment',
      equipment_deposit_deduction: 'equipmentDepositDeduction',
      rent_deduction: 'rentDeduction',
      real_equipment_deduction: 'realEquipmentDeduction',
      work_days: 'workDays',
      equipment_deduction: 'equipmentDeduction',
      operation_money: 'operationMoney',
      payable_money: 'payableMoney',
      new_item: 'newItem',
      violation_station_admin_deduction: 'violationStationAdminDeduction',
      order_deduction: 'orderDeduction',
      month_praise_order_count: 'monthPraiseOrderCount',
      electric_vehicle_deduction: 'electricVehicleDeduction',
      accident_deduction: 'accidentDeduction',
      valid_attendance: 'validAttendance',
      special_season_subsidy: 'specialSeasonSubsidy',
      net_pay_money: 'netPayMoney',
      real_tripartite_deduction: 'realTripartiteDeduction',
      adjustment_hr_dec_money: 'adjustmentHrDecMoney',
      adjustment_order_differences: 'adjustmentOrderDifferences',
      real_inter_bank_cost: 'realInterBankCost',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      realMaterialDepositDeduction: 'real_material_deposit_deduction',
      knightPayment: 'knight_payment',
      orderCount: 'order_count',
      materialDeduction: 'material_deduction',
      realEquipmentCashDeposit: 'real_equipment_cash_deposit',
      qaMoney: 'qa_money',
      realMaterialDeduction: 'real_material_deduction',
      workEfficiency: 'work_efficiency',
      monthTimeoutOrderCount: 'month_timeout_order_count',
      subsidySeniority: 'subsidy_seniority',
      waterAndInternetDeduction: 'water_and_internet_deduction',
      monthBadOrderCount: 'month_bad_order_count',
      socialSecurityDeduction: 'social_security_deduction',
      monthTimeLimitCompleteOrderCount: 'month_time_limit_complete_order_count',
      badWeatherSubsidy: 'bad_weather_subsidy',
      subsidyPhone: 'subsidy_phone',
      adjustmentWorkDifferences: 'adjustment_work_differences',
      subsidyCar: 'subsidy_car',
      equipmentDepositReturn: 'equipment_deposit_return',
      excellentStaffAward: 'excellent_staff_award',
      platformOfflineDeduction: 'platform_offline_deduction',
      workMoney: 'work_money',
      deductionReduction: 'deduction_reduction',
      specialTimeSubsidy: 'special_time_subsidy',
      orderMoney: 'order_money',
      knightDeduction: 'knight_deduction',
      subsidyCharge: 'subsidy_charge',
      orderPayment: 'order_payment',
      equipmentDepositDeduction: 'equipment_deposit_deduction',
      rentDeduction: 'rent_deduction',
      realEquipmentDeduction: 'real_equipment_deduction',
      workDays: 'work_days',
      equipmentDeduction: 'equipment_deduction',
      operationMoney: 'operation_money',
      payableMoney: 'payable_money',
      newItem: 'new_item',
      violationStationAdminDeduction: 'violation_station_admin_deduction',
      orderDeduction: 'order_deduction',
      monthPraiseOrderCount: 'month_praise_order_count',
      electricVehicleDeduction: 'electric_vehicle_deduction',
      accidentDeduction: 'accident_deduction',
      validAttendance: 'valid_attendance',
      specialSeasonSubsidy: 'special_season_subsidy',
      netPayMoney: 'net_pay_money',
      realTripartiteDeduction: 'real_tripartite_deduction',
      adjustmentHrDecMoney: 'adjustment_hr_dec_money',
      adjustmentOrderDifferences: 'adjustment_order_differences',
      realInterBankCost: 'real_inter_bank_cost',
    };
  }
}

//
class HouseContractListItem extends CoreObject {
  constructor() {
    super();
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

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 服务费方案
class SalaryPlanBrief extends CoreObject {
  constructor() {
    super();
    this.domain = 0;                            // 适用范围
    this.bizDistrictId = undefined;             // 商圈id
    this.operatorId = undefined;                // 最后操作人id
    this.updatedAt = undefined;                 // 更新时间
    this.enabledAt = undefined;                 // 启用时间
    this.disabledAt = undefined;                // 停用时间
    this.activeVersion = undefined;             // 使用中的版本id
    this.deletedAt = undefined;                 // 删除时间
    this.applicationVersion = undefined;        // 审批中版本id
    this.platformCode = '';                     // 平台code
    this.supplierId = undefined;                // 供应商id
    this.name = '';                             // 方案名称
    this.createdAt = undefined;                 // 创建时间
    this.creatorId = undefined;                 // 创建人id
    this.pendingVersion = undefined;            // 待启用版本ID
    this.state = 0;                             // 状态
    this.draftVersion = undefined;              // 当前草稿箱ID
    this.id = undefined;                        // _id
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
      domain: 'domain',
      biz_district_id: 'bizDistrictId',
      operator_id: 'operatorId',
      updated_at: 'updatedAt',
      enabled_at: 'enabledAt',
      disabled_at: 'disabledAt',
      active_version: 'activeVersion',
      deleted_at: 'deletedAt',
      application_version: 'applicationVersion',
      platform_code: 'platformCode',
      supplier_id: 'supplierId',
      name: 'name',
      created_at: 'createdAt',
      creator_id: 'creatorId',
      pending_version: 'pendingVersion',
      state: 'state',
      draft_version: 'draftVersion',
      _id: 'id',
      city_code: 'cityCode',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      domain: 'domain',
      bizDistrictId: 'biz_district_id',
      operatorId: 'operator_id',
      updatedAt: 'updated_at',
      enabledAt: 'enabled_at',
      disabledAt: 'disabled_at',
      activeVersion: 'active_version',
      deletedAt: 'deleted_at',
      applicationVersion: 'application_version',
      platformCode: 'platform_code',
      supplierId: 'supplier_id',
      name: 'name',
      createdAt: 'created_at',
      creatorId: 'creator_id',
      pendingVersion: 'pending_version',
      state: 'state',
      draftVersion: 'draft_version',
      id: '_id',
      cityCode: 'city_code',
    };
  }
}

//
class ApplicationOrderDetail extends CoreObject {
  constructor() {
    super();
    this.salaryPlanVersionInfo = undefined;     //
    this.applyAccountInfo = undefined;          //
    this.currentOperateAccountList = [];        //
    this.flowAccountList = [];                  //
    this.salaryComputeTaskInfo = undefined;     //
    this.costOrderList = [];                    //
    this.currentRecordList = [];                //
    this.currentPendingAccountList = [];        //
    this.flowRecordList = [];                   //
    this.payrollStatementInfo = undefined;      //
    this.currentFlowNodeInfo = undefined;       //
    this.flowInfo = undefined;                  //
    this.operateAccountsList = [];              //
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
      salary_plan_version_info: {
        key: 'salaryPlanVersionInfo',
        transform: value => CoreObject.mapper(value, SalaryPlanVersionBrief),
      },
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      current_operate_account_list: {
        key: 'currentOperateAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      flow_account_list: {
        key: 'flowAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      salary_compute_task_info: {
        key: 'salaryComputeTaskInfo',
        transform: value => CoreObject.mapper(value, SalaryComputeTaskBrief),
      },
      cost_order_list: {
        key: 'costOrderList',
        transform: value => CoreObject.mapperEach(value, CostOrderDetail),
      },
      current_record_list: {
        key: 'currentRecordList',
        transform: value => CoreObject.mapperEach(value, ApplicationOrderFlowRecordBrief),
      },
      current_pending_account_list: {
        key: 'currentPendingAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      flow_record_list: {
        key: 'flowRecordList',
        transform: value => CoreObject.mapperEach(value, ApplicationOrderFlowRecordBrief),
      },
      payroll_statement_info: {
        key: 'payrollStatementInfo',
        transform: value => CoreObject.mapper(value, PayrollStatementBrief),
      },
      current_flow_node_info: {
        key: 'currentFlowNodeInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowNodeBrief),
      },
      flow_info: {
        key: 'flowInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowTemplateBrief),
      },
      operate_accounts_list: {
        key: 'operateAccountsList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      salaryPlanVersionInfo: {
        key: 'salary_plan_version_info',
        transform: value => CoreObject.revert(value, SalaryPlanVersionBrief),
      },
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      currentOperateAccountList: {
        key: 'current_operate_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      flowAccountList: {
        key: 'flow_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      salaryComputeTaskInfo: {
        key: 'salary_compute_task_info',
        transform: value => CoreObject.revert(value, SalaryComputeTaskBrief),
      },
      costOrderList: {
        key: 'cost_order_list',
        transform: value => CoreObject.revertEach(value, CostOrderDetail),
      },
      currentRecordList: {
        key: 'current_record_list',
        transform: value => CoreObject.revertEach(value, ApplicationOrderFlowRecordBrief),
      },
      currentPendingAccountList: {
        key: 'current_pending_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      flowRecordList: {
        key: 'flow_record_list',
        transform: value => CoreObject.revertEach(value, ApplicationOrderFlowRecordBrief),
      },
      payrollStatementInfo: {
        key: 'payroll_statement_info',
        transform: value => CoreObject.revert(value, PayrollStatementBrief),
      },
      currentFlowNodeInfo: {
        key: 'current_flow_node_info',
        transform: value => CoreObject.revert(value, ApplicationFlowNodeBrief),
      },
      flowInfo: {
        key: 'flow_info',
        transform: value => CoreObject.revert(value, ApplicationFlowTemplateBrief),
      },
      operateAccountsList: {
        key: 'operate_accounts_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
    };
  }
}

// 参数信息
class ParamsInfo extends CoreObject {
  constructor() {
    super();
    this.index = undefined;                     // 指标
    this.totalMaxNum = 0;                       // 累加最大值
    this.unitMoney = 0;                         // 金额
    this.type = 0;                              // 阶梯类型 1: 阶梯分段 2:阶梯变动
    this.rangeTable = [];                       // 方案提成参数
    this.unitDay = 0;                           // 出勤天数
    this.unitIndex = undefined;                 // 统计指标(手动添加)
    this.unitAmount = 0;                        // 最小天数(手动添加)
    this.decMoney = 0;                          // 扣罚金额(手动添加)
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
      index: 'index',
      total_max_num: 'totalMaxNum',
      unit_money: 'unitMoney',
      type: 'type',
      range_table: {
        key: 'rangeTable',
        transform: value => CoreObject.mapperEach(value, RangeTableInfo),
      },
      unit_day: 'unitDay',
      unit_index: 'unitIndex',
      unit_amount: 'unitAmount',
      dec_money: 'decMoney',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      index: 'index',
      totalMaxNum: 'total_max_num',
      unitMoney: 'unit_money',
      type: 'type',
      rangeTable: {
        key: 'range_table',
        transform: value => CoreObject.revertEach(value, RangeTableInfo),
      },
      unitDay: 'unit_day',
      unitIndex: 'unit_index',
      unitAmount: 'unit_amount',
      decMoney: 'dec_money',
    };
  }
}

//
class BossAssistNoticeDetail extends CoreObject {
  constructor() {
    super();
    this.oaUrgeRecordInfo = undefined;          //
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return CommonMessageExtra;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      oa_urge_record_info: {
        key: 'oaUrgeRecordInfo',
        transform: value => CoreObject.mapper(value, ApplicationUrgeRecordEmbed),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      oaUrgeRecordInfo: {
        key: 'oa_urge_record_info',
        transform: value => CoreObject.revert(value, ApplicationUrgeRecordEmbed),
      },
    };
  }
}

// 扣补款任务列表
class PayrollAdjustmentTaskListItem extends CoreObject {
  constructor() {
    super();
    this.cityName = '';                         // 城市名称
    this.cards = [];                            // 返回扣补款项待办任务展示块
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return PayrollAdjustmentTask;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      city_name: 'cityName',
      cards: {
        key: 'cards',
        transform: value => CoreObject.mapperEach(value, CardInfo),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cityName: 'city_name',
      cards: {
        key: 'cards',
        transform: value => CoreObject.revertEach(value, CardInfo),
      },
    };
  }
}

//
class ApplicationOrderFlowRecordBrief extends CoreObject {
  constructor() {
    super();
    this.rejectToNodeInfo = undefined;          //
    this.extraInfoList = [];                    //
    this.operateAccountList = [];               //
    this.accountInfo = undefined;               //
    this.flowNodeInfo = undefined;              //
    this.ccAccountList = [];                    //
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
      reject_to_node_info: {
        key: 'rejectToNodeInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowNodeBrief),
      },
      extra_info_list: {
        key: 'extraInfoList',
        transform: value => CoreObject.mapperEach(value, OaApplicationOrderFlowExtra),
      },
      operate_account_list: {
        key: 'operateAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      account_info: {
        key: 'accountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      flow_node_info: {
        key: 'flowNodeInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowNodeBrief),
      },
      cc_account_list: {
        key: 'ccAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      rejectToNodeInfo: {
        key: 'reject_to_node_info',
        transform: value => CoreObject.revert(value, ApplicationFlowNodeBrief),
      },
      extraInfoList: {
        key: 'extra_info_list',
        transform: value => CoreObject.revertEach(value, OaApplicationOrderFlowExtra),
      },
      operateAccountList: {
        key: 'operate_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      accountInfo: {
        key: 'account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      flowNodeInfo: {
        key: 'flow_node_info',
        transform: value => CoreObject.revert(value, ApplicationFlowNodeBrief),
      },
      ccAccountList: {
        key: 'cc_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
    };
  }
}

//
class CostOrderBrief extends CoreObject {
  constructor() {
    super();
    this.payeeInfo = undefined;                 //
    this.costGroupInfo = undefined;             //
    this.applyAccountInfo = undefined;          //
    this.bizExtraHouseContractInfo = undefined; //
    this.costAllocationList = [];               //
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
      payee_info: 'payeeInfo',
      cost_group_info: {
        key: 'costGroupInfo',
        transform: value => CoreObject.mapper(value, CostGroupBrief),
      },
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      biz_extra_house_contract_info: {
        key: 'bizExtraHouseContractInfo',
        transform: value => CoreObject.mapper(value, OaHouseContract),
      },
      cost_allocation_list: {
        key: 'costAllocationList',
        transform: value => CoreObject.mapperEach(value, CostAllocationBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      payeeInfo: 'payee_info',
      costGroupInfo: {
        key: 'cost_group_info',
        transform: value => CoreObject.revert(value, CostGroupBrief),
      },
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      bizExtraHouseContractInfo: {
        key: 'biz_extra_house_contract_info',
        transform: value => CoreObject.revert(value, OaHouseContract),
      },
      costAllocationList: {
        key: 'cost_allocation_list',
        transform: value => CoreObject.revertEach(value, CostAllocationBrief),
      },
    };
  }
}

//
class CostGroupListItem extends CoreObject {
  constructor() {
    super();
    this.creatorInfo = undefined;               //
    this.accountingList = [];                   //
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
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      accounting_list: {
        key: 'accountingList',
        transform: value => CoreObject.mapperEach(value, CostAccountingTiny),
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
        transform: value => CoreObject.revertEach(value, CostAccountingTiny),
      },
    };
  }
}

// 结算计划列表
class PayrollPlanListItem extends CoreObject {
  constructor() {
    super();
    this.platformName = '';                     // 平台名称
    this.operatorInfo = undefined;              // 操作人信息
    this.creatorInfo = undefined;               // 创建人信息
    this.supplierName = '';                     // 供应商名称
    this.cityName = '';                         // 城市名称
    this.bizDistrictName = '';                  // 商圈名称
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return PayrollPlan;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      platform_name: 'platformName',
      operator_info: {
        key: 'operatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      supplier_name: 'supplierName',
      city_name: 'cityName',
      biz_district_name: 'bizDistrictName',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      platformName: 'platform_name',
      operatorInfo: {
        key: 'operator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      supplierName: 'supplier_name',
      cityName: 'city_name',
      bizDistrictName: 'biz_district_name',
    };
  }
}

//
class SysNoticeDetail extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return CommonMessageExtra;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

//
class ApplicationFlowNodeDetail extends CoreObject {
  constructor() {
    super();
    this.accountList = [];                      //
    this.parentFlowTemplateInfo = undefined;    //
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

// 服务费方案版本列表
class SalaryPlanVersionListItem extends CoreObject {
  constructor() {
    super();
    this.cityName = '';                         // 城市name
    this.rulesList = [];                        //
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryPlanVersion;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      city_name: 'cityName',
      rules_list: {
        key: 'rulesList',
        transform: value => CoreObject.mapperEach(value, SalaryPlanVersionBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cityName: 'city_name',
      rulesList: {
        key: 'rules_list',
        transform: value => CoreObject.revertEach(value, SalaryPlanVersionBrief),
      },
    };
  }
}

// 人员标签
class StaffTagBrief extends CoreObject {
  constructor() {
    super();
    this.operatorId = undefined;                // 创建人id
    this.name = '';                             // 人员名称
    this.staffCounter = 0;                      // 人员数量
    this.updatedAt = undefined;                 // 更新时间
    this.state = 0;                             // 状态100 启用 -100停用
    this.supplierId = undefined;                // 供应商id
    this.cityCode = '';                         // 城市code
    this.platformCode = '';                     // 平台code
    this.id = undefined;                        // _id
    this.createdAt = undefined;                 // 创建时间
    this.bizDistrictId = undefined;             // 商圈id
    this.tagType = 0;                           // 标签类型 1城市级别 2商圈级别
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
      operator_id: 'operatorId',
      name: 'name',
      staff_counter: 'staffCounter',
      updated_at: 'updatedAt',
      state: 'state',
      supplier_id: 'supplierId',
      city_code: 'cityCode',
      platform_code: 'platformCode',
      _id: 'id',
      created_at: 'createdAt',
      biz_district_id: 'bizDistrictId',
      tag_type: 'tagType',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      operatorId: 'operator_id',
      name: 'name',
      staffCounter: 'staff_counter',
      updatedAt: 'updated_at',
      state: 'state',
      supplierId: 'supplier_id',
      cityCode: 'city_code',
      platformCode: 'platform_code',
      id: '_id',
      createdAt: 'created_at',
      bizDistrictId: 'biz_district_id',
      tagType: 'tag_type',
    };
  }
}

// 服务费试算任务详情
class SalaryComputeTaskDetail extends CoreObject {
  constructor() {
    super();
    this.cityName = '';                         // 城市name
    this.bizDistrictName = '';                  // 商圈name
    this.computeDataSet = undefined;            // 服务费试算结果信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryComputeTask;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      city_name: 'cityName',
      biz_district_name: 'bizDistrictName',
      compute_data_set: {
        key: 'computeDataSet',
        transform: value => CoreObject.mapper(value, ComputeDataSetInfoBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cityName: 'city_name',
      bizDistrictName: 'biz_district_name',
      computeDataSet: {
        key: 'compute_data_set',
        transform: value => CoreObject.revert(value, ComputeDataSetInfoBrief),
      },
    };
  }
}

//
class ApplicationFlowTemplateBrief extends CoreObject {
  constructor() {
    super();
    this.costCatalogScopeList = [];             //
    this.nodeList = [];                         //
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
      cost_catalog_scope_list: {
        key: 'costCatalogScopeList',
        transform: value => CoreObject.mapperEach(value, CostGroupBrief),
      },
      node_list: {
        key: 'nodeList',
        transform: value => CoreObject.mapperEach(value, ApplicationFlowNodeBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      costCatalogScopeList: {
        key: 'cost_catalog_scope_list',
        transform: value => CoreObject.revertEach(value, CostGroupBrief),
      },
      nodeList: {
        key: 'node_list',
        transform: value => CoreObject.revertEach(value, ApplicationFlowNodeBrief),
      },
    };
  }
}

//
class CostAccountingDetail extends CoreObject {
  constructor() {
    super();
    this.creatorInfo = undefined;               //
    this.parentInfo = undefined;                //
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
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      parent_info: {
        key: 'parentInfo',
        transform: value => CoreObject.mapper(value, CostAccountingBrief),
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
      parentInfo: {
        key: 'parent_info',
        transform: value => CoreObject.revert(value, CostAccountingBrief),
      },
    };
  }
}

//
class HouseContractResponse extends CoreObject {
  constructor() {
    super();
    this.record = undefined;                    //
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
      record: {
        key: 'record',
        transform: value => CoreObject.mapper(value, HouseContractDetail),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      record: {
        key: 'record',
        transform: value => CoreObject.revert(value, HouseContractDetail),
      },
    };
  }
}

//
class ApplicationOrderListItem extends CoreObject {
  constructor() {
    super();
    this.applyAccountInfo = undefined;          //
    this.currentOperateAccountList = [];        //
    this.flowAccountList = [];                  //
    this.currentRecordList = [];                //
    this.currentPendingAccountList = [];        //
    this.currentFlowNodeInfo = undefined;       //
    this.flowInfo = {};                         //
    this.operateAccountsList = [];              //
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
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      current_operate_account_list: {
        key: 'currentOperateAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      flow_account_list: {
        key: 'flowAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      current_record_list: {
        key: 'currentRecordList',
        transform: value => CoreObject.mapperEach(value, ApplicationOrderListItemOrderFlowRecordTiny),
      },
      current_pending_account_list: {
        key: 'currentPendingAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      current_flow_node_info: {
        key: 'currentFlowNodeInfo',
        transform: value => CoreObject.mapper(value, FlowNodeInfoTiny),
      },
      flow_info: 'flowInfo',
      operate_accounts_list: {
        key: 'operateAccountsList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      currentOperateAccountList: {
        key: 'current_operate_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      flowAccountList: {
        key: 'flow_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      currentRecordList: {
        key: 'current_record_list',
        transform: value => CoreObject.revertEach(value, ApplicationOrderListItemOrderFlowRecordTiny),
      },
      currentPendingAccountList: {
        key: 'current_pending_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      currentFlowNodeInfo: {
        key: 'current_flow_node_info',
        transform: value => CoreObject.revert(value, FlowNodeInfoTiny),
      },
      flowInfo: 'flow_info',
      operateAccountsList: {
        key: 'operate_accounts_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
    };
  }
}

// 按单补贴信息
class ByOrderUnitParamsInfo extends CoreObject {
  constructor() {
    super();
    this.incUnitMoney = 0;                      // 补x元
    this.unitIndex = undefined;                 // 结算指标(手动添加)
    this.minAmount = 0;                         // 最小单量(手动添加)
    this.incUnitAmount = 0;                     // 每x单(手动添加)
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
      unit_index: 'unitIndex',
      inc_unit_money: 'incUnitMoney',
      min_amount: 'minAmount',
      inc_unit_amount: 'incUnitAmount',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      unitIndex: 'unit_index',
      incUnitMoney: 'inc_unit_money',
      minAmount: 'min_amount',
      incUnitAmount: 'inc_unit_amount',
    };
  }
}

// 扣补款项目详情
class PayrollAdjustmentItemDetail extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return PayrollAdjustmentItem;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 结算指标
class SalaryVarBrief extends CoreObject {
  constructor() {
    super();
    this.code = '';                             // 编码
    this.tags = [];                             // 所属标签
    this.sourceDomain = 0;                      // 变量维度 1:(骑士) 2（商圈）3（城市） 4(平台) 5(供应商) 6(订单)7（基础指标）
    this.updatedAt = undefined;                 // 更新时间
    this.plan = 0;                              // 执行方案（1:汇总计数,2:求和,3:自定义公式,4:取值,5:阶梯）
    this.formula = '';                          // 公式
    this.platformCode = '';                     // 平台Code
    this.definition = '';                       // 指标定义
    this.planId = undefined;                    // 指标方案id
    this.name = '';                             // 名称
    this.level = 0;                             // 指标等级
    this.createdAt = undefined;                 // 创建时间
    this.forkVersion = undefined;               // 上一个版本（fork 来源）首个版本为空
    this.state = 0;                             // 状态 -101(删除) -100(停用) 100(启用)
    this.version = undefined;                   // 对应版本
    this.unit = 0;                              // 单位(1:单,2:天,3:kg,4:km,5:%,6:星,7:分钟,8:元9:无)
    this.factor = '';                           // 条件
    this.creatorId = undefined;                 // 创建人
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
      code: 'code',
      tags: 'tags',
      source_domain: 'sourceDomain',
      updated_at: 'updatedAt',
      plan: 'plan',
      formula: 'formula',
      platform_code: 'platformCode',
      definition: 'definition',
      plan_id: 'planId',
      name: 'name',
      level: 'level',
      created_at: 'createdAt',
      fork_version: 'forkVersion',
      state: 'state',
      version: 'version',
      unit: 'unit',
      factor: 'factor',
      creator_id: 'creatorId',
      _id: 'id',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      code: 'code',
      tags: 'tags',
      sourceDomain: 'source_domain',
      updatedAt: 'updated_at',
      plan: 'plan',
      formula: 'formula',
      platformCode: 'platform_code',
      definition: 'definition',
      planId: 'plan_id',
      name: 'name',
      level: 'level',
      createdAt: 'created_at',
      forkVersion: 'fork_version',
      state: 'state',
      version: 'version',
      unit: 'unit',
      factor: 'factor',
      creatorId: 'creator_id',
      id: '_id',
    };
  }
}

// 结算单（明细）
class PayrollBrief extends CoreObject {
  constructor() {
    super();
    this.paySalaryState = 0;                    // 结算状态(1 正常 -1 缓发)
    this.orderCount = 0;                        // 单量
    this.positionId = 0;                        // 职位id
    this.qaMoney = 0;                           // 质量补贴金额
    this.month = 0;                             // 月
    this.payableMoney = 0;                      // 应发总额
    this.bizDistrictId = undefined;             // 商圈id|站点id|团队id
    this.year = 0;                              // 年
    this.staffId = undefined;                   // 人员id
    this.supplierId = undefined;                // 供应商id
    this.payrollCycleType = 0;                  // 计算周期(1:按月,2:按日)
    this.debtsType = 0;                         // 欠款类型
    this.salaryData = undefined;                // 服务费数据
    this.oaApplicationOrderId = undefined;      // OA审批单ID
    this.payrollStatementId = undefined;        // 结算单汇总单id
    this.workMoney = 0;                         // 出勤补贴金额
    this.startDate = 0;                         // 起始日期
    this.cityCode = '';                         // 平台code_城市全拼
    this.updateTime = undefined;                // 更新时间
    this.operatorId = undefined;                // 操作人id
    this.endDate = 0;                           // 结束日期
    this.salaryComputeDataSetId = undefined;    // 服务费计算结果集ID
    this.operationMoney = 0;                    // 管理补贴金额
    this.netPayMoney = 0;                       // 实发总额
    this.adjustmentHrIncMoney = 0;              // 人事补款总额
    this.adjustmentItemLines = [];              // 扣补款项目明细
    this.platformCode = '';                     // 平台code
    this.adjustmentStaffDecMoney = 0;           // 人员扣款总额
    this.contractBelongId = undefined;          // 合同归属
    this.createdAt = undefined;                 // 创建时间
    this.payrollPlanId = undefined;             // 服务费计划ID
    this.adjustmentHrDecMoney = 0;              // 人事扣款总额
    this.payrollCycleNo = 0;                    // 服务费计划周期编号
    this.orderMoney = 0;                        // 单量提成金额
    this.adjustmentStaffIncMoney = 0;           // 人员补款总额
    this.id = undefined;                        // _id
    this.idCardNum = '';                        // 身份证号
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
      pay_salary_state: 'paySalaryState',
      order_count: 'orderCount',
      position_id: 'positionId',
      qa_money: 'qaMoney',
      month: 'month',
      payable_money: 'payableMoney',
      biz_district_id: 'bizDistrictId',
      year: 'year',
      staff_id: 'staffId',
      supplier_id: 'supplierId',
      payroll_cycle_type: 'payrollCycleType',
      debts_type: 'debtsType',
      salary_data: {
        key: 'salaryData',
        transform: value => CoreObject.mapper(value, SalaryInfo),
      },
      oa_application_order_id: 'oaApplicationOrderId',
      payroll_statement_id: 'payrollStatementId',
      work_money: 'workMoney',
      start_date: 'startDate',
      city_code: 'cityCode',
      update_time: 'updateTime',
      operator_id: 'operatorId',
      end_date: 'endDate',
      salary_compute_data_set_id: 'salaryComputeDataSetId',
      operation_money: 'operationMoney',
      net_pay_money: 'netPayMoney',
      adjustment_hr_inc_money: 'adjustmentHrIncMoney',
      adjustment_item_lines: 'adjustmentItemLines',
      platform_code: 'platformCode',
      adjustment_staff_dec_money: 'adjustmentStaffDecMoney',
      contract_belong_id: 'contractBelongId',
      created_at: 'createdAt',
      payroll_plan_id: 'payrollPlanId',
      adjustment_hr_dec_money: 'adjustmentHrDecMoney',
      payroll_cycle_no: 'payrollCycleNo',
      order_money: 'orderMoney',
      adjustment_staff_inc_money: 'adjustmentStaffIncMoney',
      _id: 'id',
      id_card_num: 'idCardNum',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      paySalaryState: 'pay_salary_state',
      orderCount: 'order_count',
      positionId: 'position_id',
      qaMoney: 'qa_money',
      month: 'month',
      payableMoney: 'payable_money',
      bizDistrictId: 'biz_district_id',
      year: 'year',
      staffId: 'staff_id',
      supplierId: 'supplier_id',
      payrollCycleType: 'payroll_cycle_type',
      debtsType: 'debts_type',
      salaryData: {
        key: 'salary_data',
        transform: value => CoreObject.revert(value, SalaryInfo),
      },
      oaApplicationOrderId: 'oa_application_order_id',
      payrollStatementId: 'payroll_statement_id',
      workMoney: 'work_money',
      startDate: 'start_date',
      cityCode: 'city_code',
      updateTime: 'update_time',
      operatorId: 'operator_id',
      endDate: 'end_date',
      salaryComputeDataSetId: 'salary_compute_data_set_id',
      operationMoney: 'operation_money',
      netPayMoney: 'net_pay_money',
      adjustmentHrIncMoney: 'adjustment_hr_inc_money',
      adjustmentItemLines: 'adjustment_item_lines',
      platformCode: 'platform_code',
      adjustmentStaffDecMoney: 'adjustment_staff_dec_money',
      contractBelongId: 'contract_belong_id',
      createdAt: 'created_at',
      payrollPlanId: 'payroll_plan_id',
      adjustmentHrDecMoney: 'adjustment_hr_dec_money',
      payrollCycleNo: 'payroll_cycle_no',
      orderMoney: 'order_money',
      adjustmentStaffIncMoney: 'adjustment_staff_inc_money',
      id: '_id',
      idCardNum: 'id_card_num',
    };
  }
}

// 扣补款任务详情
class PayrollAdjustmentTaskDetail extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return PayrollAdjustmentTask;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 人员标签映射列表
class SalaryStaffListItem extends CoreObject {
  constructor() {
    super();
    this.tagMapInfo = undefined;                // 人员标签关联
    this.platformNames = undefined;             // 平台name
    this.bizDistrictNames = undefined;          // 商圈name
    this.cityNames = undefined;                 // 城市name
    this.supplierNames = undefined;             // 供应商name
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return Staff;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      tag_map_info: {
        key: 'tagMapInfo',
        transform: value => CoreObject.mapper(value, StaffTagMapBrief),
      },
      platform_names: 'platformNames',
      biz_district_names: 'bizDistrictNames',
      city_names: 'cityNames',
      supplier_names: 'supplierNames',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      tagMapInfo: {
        key: 'tag_map_info',
        transform: value => CoreObject.revert(value, StaffTagMapBrief),
      },
      platformNames: 'platform_names',
      bizDistrictNames: 'biz_district_names',
      cityNames: 'city_names',
      supplierNames: 'supplier_names',
    };
  }
}

// 用户
class OperatiorBrief extends CoreObject {
  constructor() {
    super();
    this.phone = '';                            //
    this.id = undefined;                        //
    this.name = '';                             //
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
      phone: 'phone',
      _id: 'id',
      name: 'name',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      phone: 'phone',
      id: '_id',
      name: 'name',
    };
  }
}

// 扣补款项目列表
class PayrollAdjustmentItemListItem extends CoreObject {
  constructor() {
    super();
    this.operatorInfo = undefined;              // 操作人信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return PayrollAdjustmentItem;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      operator_info: {
        key: 'operatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      operatorInfo: {
        key: 'operator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
    };
  }
}

// 服务费规则集列表
class SalaryPlanRuleCollectionListItem extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryPlanRuleCollection;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

//
class ApplicationFlowTemplateDetail extends CoreObject {
  constructor() {
    super();
    this.excludeCostCatalogScopeList = [];      //
    this.nodeList = [];                         //
    this.costCatalogScopeList = [];             //
    this.creatorInfo = undefined;               //
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
      exclude_cost_catalog_scope_list: {
        key: 'excludeCostCatalogScopeList',
        transform: value => CoreObject.mapperEach(value, CostGroupBrief),
      },
      node_list: {
        key: 'nodeList',
        transform: value => CoreObject.mapperEach(value, ApplicationFlowTemplateDetailNodeDetail),
      },
      cost_catalog_scope_list: {
        key: 'costCatalogScopeList',
        transform: value => CoreObject.mapperEach(value, CostGroupDetail),
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
      excludeCostCatalogScopeList: {
        key: 'exclude_cost_catalog_scope_list',
        transform: value => CoreObject.revertEach(value, CostGroupBrief),
      },
      nodeList: {
        key: 'node_list',
        transform: value => CoreObject.revertEach(value, ApplicationFlowTemplateDetailNodeDetail),
      },
      costCatalogScopeList: {
        key: 'cost_catalog_scope_list',
        transform: value => CoreObject.revertEach(value, CostGroupDetail),
      },
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
    };
  }
}

// 总额补贴信息
class ByOnceParamsInfo extends CoreObject {
  constructor() {
    super();
    this.autoDecOption = false;                 // 是否扣款
    this.decUnitAmount = 0;                     // 每x天
    this.decUnitMoney = 0;                      // 扣x元
    this.unitIndex = undefined;                 // 扣款指标(手动添加)
    this.decMinAmount = 0;                      // 不满足x天
    this.onceMoney = 0;                         // 一次补贴x元
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
      auto_dec_option: 'autoDecOption',
      dec_unit_amount: 'decUnitAmount',
      dec_unit_money: 'decUnitMoney',
      dec_min_amount: 'decMinAmount',
      once_money: 'onceMoney',
      unit_index: 'unitIndex',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      autoDecOption: 'auto_dec_option',
      decUnitAmount: 'dec_unit_amount',
      decUnitMoney: 'dec_unit_money',
      decMinAmount: 'dec_min_amount',
      onceMoney: 'once_money',
      unitIndex: 'unit_index',
    };
  }
}

// 结算指标详情
class SalaryVarDetail extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryVar;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

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

//
class ApplicationFlowTemplateDetailNodeDetail extends CoreObject {
  constructor() {
    super();
    this.accountList = [];                      //
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
    };
  }

  // 反向映射
  static revertMap() {
    return {
      accountList: {
        key: 'account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
    };
  }
}

// 结算计划详情
class PayrollPlanDetail extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return PayrollPlan;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 竞赛评比信息
class BattleParamsInfo extends CoreObject {
  constructor() {
    super();
    this.rankSum = 0;                           // 设定名次
    this.ladder = [];                           // 竞赛名次范围
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
      rank_sum: 'rankSum',
      ladder: {
        key: 'ladder',
        transform: value => CoreObject.mapperEach(value, LadderInfo),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      rankSum: 'rank_sum',
      ladder: {
        key: 'ladder',
        transform: value => CoreObject.revertEach(value, LadderInfo),
      },
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

// 结算指标列表
class SalaryVarListItem extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryVar;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 结算单列表
class PayrollListItem extends CoreObject {
  constructor() {
    super();
    this.platformName = '';                     // 平台名称
    this.contractBelongName = '';               // 合同归属名称
    this.supplierName = '';                     // 供应商名称
    this.positionName = '';                     // 职位名称
    this.staffInfo = undefined;                 // 人员信息
    this.payrollStatementInfo = undefined;      // 结算单信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return Payroll;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      platform_name: 'platformName',
      contract_belong_name: 'contractBelongName',
      supplier_name: 'supplierName',
      position_name: 'positionName',
      staff_info: {
        key: 'staffInfo',
        transform: value => CoreObject.mapper(value, StaffBrief),
      },
      payroll_statement_info: {
        key: 'payrollStatementInfo',
        transform: value => CoreObject.mapper(value, PayrollStatementBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      platformName: 'platform_name',
      contractBelongName: 'contract_belong_name',
      supplierName: 'supplier_name',
      positionName: 'position_name',
      staffInfo: {
        key: 'staff_info',
        transform: value => CoreObject.revert(value, StaffBrief),
      },
      payrollStatementInfo: {
        key: 'payroll_statement_info',
        transform: value => CoreObject.revert(value, PayrollStatementBrief),
      },
    };
  }
}

//
class ApplicationFlowTemplateListItem extends CoreObject {
  constructor() {
    super();
    this.costCatalogScopeList = [];             //
    this.creatorInfo = undefined;               //
    this.excludeCostCatalogScopeList = [];      //
    this.nodeList = [];                         //
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
      cost_catalog_scope_list: {
        key: 'costCatalogScopeList',
        transform: value => CoreObject.mapperEach(value, ApplicationFlowTemplateListItemCostGroupTiny),
      },
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      exclude_cost_catalog_scope_list: {
        key: 'excludeCostCatalogScopeList',
        transform: value => CoreObject.mapperEach(value, ApplicationFlowTemplateListItemCostGroupTiny),
      },
      node_list: {
        key: 'nodeList',
        transform: value => CoreObject.mapperEach(value, FlowNodeInfoTiny),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      costCatalogScopeList: {
        key: 'cost_catalog_scope_list',
        transform: value => CoreObject.revertEach(value, ApplicationFlowTemplateListItemCostGroupTiny),
      },
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      excludeCostCatalogScopeList: {
        key: 'exclude_cost_catalog_scope_list',
        transform: value => CoreObject.revertEach(value, ApplicationFlowTemplateListItemCostGroupTiny),
      },
      nodeList: {
        key: 'node_list',
        transform: value => CoreObject.revertEach(value, FlowNodeInfoTiny),
      },
    };
  }
}

// 结算单汇总列表
class PayrollStatementListItem extends CoreObject {
  constructor() {
    super();
    this.platformName = '';                     // 平台名称
    this.cityName = '';                         // 城市名称
    this.supplierName = '';                     // 供应商名称
    this.positionName = '';                     // 职位名称
    this.payrollPlanInfo = undefined;           // 结算计划信息
    this.staffInfo = undefined;                 // 人员信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return PayrollStatement;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      platform_name: 'platformName',
      city_name: 'cityName',
      supplier_name: 'supplierName',
      position_name: 'positionName',
      payroll_plan_info: {
        key: 'payrollPlanInfo',
        transform: value => CoreObject.mapper(value, PayrollPlanBrief),
      },
      staff_info: {
        key: 'staffInfo',
        transform: value => CoreObject.mapper(value, StaffBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      platformName: 'platform_name',
      cityName: 'city_name',
      supplierName: 'supplier_name',
      positionName: 'position_name',
      payrollPlanInfo: {
        key: 'payroll_plan_info',
        transform: value => CoreObject.revert(value, PayrollPlanBrief),
      },
      staffInfo: {
        key: 'staff_info',
        transform: value => CoreObject.revert(value, StaffBrief),
      },
    };
  }
}

//
class ApplicationFlowNodeBrief extends CoreObject {
  constructor() {
    super();
    this.accountList = [];                      //
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
      account_list: {
        key: 'accountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
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
    };
  }
}

// 人员标签映射详情
class StaffTagMapDetail extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return StaffTagMap;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 服务费方案详情
class SalaryPlanDetail extends CoreObject {
  constructor() {
    super();
    this.cityName = '';                         // 城市name
    this.bizDistrictName = '';                  // 商圈name
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryPlan;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      city_name: 'cityName',
      biz_district_name: 'bizDistrictName',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cityName: 'city_name',
      bizDistrictName: 'biz_district_name',
    };
  }
}

//
class ApplicationFlowTemplateListItemCostGroupTiny extends CoreObject {
  constructor() {
    super();
    this.accountingList = [];                   //
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
      accounting_list: {
        key: 'accountingList',
        transform: value => CoreObject.mapperEach(value, CostAccountingTiny),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      accountingList: {
        key: 'accounting_list',
        transform: value => CoreObject.revertEach(value, CostAccountingTiny),
      },
    };
  }
}

// 人员
class StaffBrief extends CoreObject {
  constructor() {
    super();
    this.workType = 0;                          // 工作类型
    this.positionId = 0;                        // 职位id
    this.departureDate = undefined;             // 离开日期
    this.platformNames = [];                    // 平台name
    this.bizDistrictNames = [];                 // 商圈name
    this.knightTypeId = undefined;              // 骑士类型id
    this.bankCardId = undefined;                // 银行卡id
    this.bankLocation = [];                     // 银行位置
    this.bankBranch = '';                       // 银行分行
    this.citySpellingList = [];                 // 城市列表
    this.contractBelongId = undefined;          // 合同契约id
    this.name = '';                             // 人员名称
    this.phone = '';                            // 手机号
    this.identityCardId = undefined;            // 身份证id
    this.recruitmentChannelId = 0;              // 招聘渠道
    this.state = 0;                             // 状态
    this.supplierNames = [];                    // 供应商name
    this.entryDate = undefined;                 // 进入时间
    this.id = undefined;                        // 人员id
    this.cityNames = [];                        // 城市name
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
      work_type: 'workType',
      position_id: 'positionId',
      departure_date: 'departureDate',
      platform_names: 'platformNames',
      biz_district_names: 'bizDistrictNames',
      knight_type_id: 'knightTypeId',
      bank_card_id: 'bankCardId',
      bank_location: 'bankLocation',
      bank_branch: 'bankBranch',
      city_spelling_list: 'citySpellingList',
      contract_belong_id: 'contractBelongId',
      name: 'name',
      phone: 'phone',
      identity_card_id: 'identityCardId',
      recruitment_channel_id: 'recruitmentChannelId',
      state: 'state',
      supplier_names: 'supplierNames',
      entry_date: 'entryDate',
      _id: 'id',
      city_names: 'cityNames',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      workType: 'work_type',
      positionId: 'position_id',
      departureDate: 'departure_date',
      platformNames: 'platform_names',
      bizDistrictNames: 'biz_district_names',
      knightTypeId: 'knight_type_id',
      bankCardId: 'bank_card_id',
      bankLocation: 'bank_location',
      bankBranch: 'bank_branch',
      citySpellingList: 'city_spelling_list',
      contractBelongId: 'contract_belong_id',
      name: 'name',
      phone: 'phone',
      identityCardId: 'identity_card_id',
      recruitmentChannelId: 'recruitment_channel_id',
      state: 'state',
      supplierNames: 'supplier_names',
      entryDate: 'entry_date',
      id: '_id',
      cityNames: 'city_names',
    };
  }
}

//
class ApplicationUrgeRecordDetail extends CoreObject {
  constructor() {
    super();
    this.applicationOrderInfo = undefined;      //
    this.flowRecordInfo = undefined;            //
    this.creatorInfo = undefined;               //
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return OaApplicationUrgeRecord;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      application_order_info: {
        key: 'applicationOrderInfo',
        transform: value => CoreObject.mapper(value, ApplicationOrderListItem),
      },
      flow_record_info: {
        key: 'flowRecordInfo',
        transform: value => CoreObject.mapper(value, ApplicationOrderFlowRecordBrief),
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
      applicationOrderInfo: {
        key: 'application_order_info',
        transform: value => CoreObject.revert(value, ApplicationOrderListItem),
      },
      flowRecordInfo: {
        key: 'flow_record_info',
        transform: value => CoreObject.revert(value, ApplicationOrderFlowRecordBrief),
      },
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
    };
  }
}

// 人员服务费计算结果集列表
class SalaryComputeDataSetListItem extends CoreObject {
  constructor() {
    super();
    this.cityName = '';                         // 城市name
    this.bizDistrictName = '';                  // 商圈name
    this.staffInfo = undefined;                 // 人员基本信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryComputeDataSet;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      city_name: 'cityName',
      biz_district_name: 'bizDistrictName',
      staff_info: {
        key: 'staffInfo',
        transform: value => CoreObject.mapper(value, StaffBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cityName: 'city_name',
      bizDistrictName: 'biz_district_name',
      staffInfo: {
        key: 'staff_info',
        transform: value => CoreObject.revert(value, StaffBrief),
      },
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

// 人员标签映射
class StaffTagMapBrief extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // _id
    this.tags = [];                             // 标签id
    this.tagList = [];                          // 标签信息
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
      tags: 'tags',
      tag_list: {
        key: 'tagList',
        transform: value => CoreObject.mapperEach(value, StaffTagTiny),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      tags: 'tags',
      tagList: {
        key: 'tag_list',
        transform: value => CoreObject.revertEach(value, StaffTagTiny),
      },
    };
  }
}

//
class CostAllocationBrief extends CoreObject {
  constructor() {
    super();
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

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 服务费规则列表
class SalaryRuleListItem extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryRuleBrief;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

//
class HouseContractDetail extends CoreObject {
  constructor() {
    super();
    this.agentAccountingInfo = undefined;       //
    this.rentAccountingInfo = undefined;        //
    this.pledgeAccountingInfo = undefined;      //
    this.lostAccountingInfo = undefined;        //
    this.costAllocationList = [];               //
    this.creatorInfo = undefined;               //
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
      agent_accounting_info: {
        key: 'agentAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingTiny),
      },
      rent_accounting_info: {
        key: 'rentAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingTiny),
      },
      pledge_accounting_info: {
        key: 'pledgeAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingTiny),
      },
      lost_accounting_info: {
        key: 'lostAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingTiny),
      },
      cost_allocation_list: {
        key: 'costAllocationList',
        transform: value => CoreObject.mapperEach(value, HouseContractCostAllotionItem),
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
      agentAccountingInfo: {
        key: 'agent_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingTiny),
      },
      rentAccountingInfo: {
        key: 'rent_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingTiny),
      },
      pledgeAccountingInfo: {
        key: 'pledge_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingTiny),
      },
      lostAccountingInfo: {
        key: 'lost_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingTiny),
      },
      costAllocationList: {
        key: 'cost_allocation_list',
        transform: value => CoreObject.revertEach(value, HouseContractCostAllotionItem),
      },
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
    };
  }
}

// 服务费规则
class SalaryRuleBrief extends CoreObject {
  constructor() {
    super();
    this.computeLogic = undefined;              // 数据处理逻辑
    this.collectionCate = 0;                    // 规则分类(1:单量,2:出勤,3:质量,4:管理)
    this.planId = undefined;                    // 服务费计划ID
    this.rulePrimaryKey = undefined;            // 规则唯一主键
    this.collectionCateOption = undefined;      // 规则分类参数
    this.ruleCollectionId = undefined;          // 服务费规则集ID
    this.matchFilters = undefined;              // 数据源筛选器(条件)
    this.updatedAt = undefined;                 // 更新时间
    this.planVersionId = undefined;             // 服务费版本ID
    this.state = 0;                             // 状态 100（正常） -100（删除）
    this.collectionIndexNum = 0;                // 在规则集中的优先级序号
    this.id = undefined;                        // 服务费规则ID
    this.createdAt = undefined;                 // 创建时间
    this.payrollMark = '';                      // 结算单对应列
    this.sortOptions = [];                     // 指标排序
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
      compute_logic: {
        key: 'computeLogic',
        transform: value => CoreObject.mapper(value, ComputeLogicBrief),
      },
      collection_cate: 'collectionCate',
      plan_id: 'planId',
      rule_primary_key: {
        key: 'rulePrimaryKey',
        transform: value => CoreObject.mapper(value, RulePrimaryKeyBrief),
      },
      collection_cate_option: {
        key: 'collectionCateOption',
        transform: value => CoreObject.mapper(value, CollectionCateOptionBrief),
      },
      rule_collection_id: 'ruleCollectionId',
      match_filters: {
        key: 'matchFilters',
        transform: value => CoreObject.mapperEach(value, MatchFiltersBrief),
      },
      updated_at: 'updatedAt',
      plan_version_id: 'planVersionId',
      state: 'state',
      collection_index_num: 'collectionIndexNum',
      _id: 'id',
      created_at: 'createdAt',
      payroll_mark: 'payrollMark',
      sort_options: 'sortOptions',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      computeLogic: {
        key: 'compute_logic',
        transform: value => CoreObject.revert(value, ComputeLogicBrief),
      },
      collectionCate: 'collection_cate',
      planId: 'plan_id',
      rulePrimaryKey: {
        key: 'rule_primary_key',
        transform: value => CoreObject.revert(value, RulePrimaryKeyBrief),
      },
      collectionCateOption: {
        key: 'collection_cate_option',
        transform: value => CoreObject.revert(value, CollectionCateOptionBrief),
      },
      ruleCollectionId: 'rule_collection_id',
      matchFilters: {
        key: 'match_filters',
        transform: value => CoreObject.revertEach(value, MatchFiltersBrief),
      },
      updatedAt: 'updated_at',
      planVersionId: 'plan_version_id',
      state: 'state',
      collectionIndexNum: 'collection_index_num',
      id: '_id',
      createdAt: 'created_at',
      payrollMark: 'payroll_mark',
      sortOptions: 'sort_options',
    };
  }
}

//
class ApplicationOrderResponse extends CoreObject {
  constructor() {
    super();
    this.record = undefined;                    //
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
      record: {
        key: 'record',
        transform: value => CoreObject.mapper(value, ApplicationOrderBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      record: {
        key: 'record',
        transform: value => CoreObject.revert(value, ApplicationOrderBrief),
      },
    };
  }
}

//
class AccountBrief extends CoreObject {
  constructor() {
    super();
    this.staffId = undefined;                   // 人员id
    this.gid = undefined;                       // gid
    this.name = undefined;                      // 用户名称
    this.id = undefined;                        // id
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
      staff_id: 'staffId',
      gid: 'gid',
      name: 'name',
      _id: 'id',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      staffId: 'staff_id',
      gid: 'gid',
      name: 'name',
      id: '_id',
    };
  }
}

// 人员标签列表
class StaffTagListItem extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return StaffTag;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 人员标签详情
class StaffTagDetail extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return StaffTag;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 服务费试算任务列表
class SalaryComputeTaskListItem extends CoreObject {
  constructor() {
    super();
    this.cityName = '';                         // 城市name
    this.bizDistrictName = '';                  // 商圈name
    this.computeDatasetInfo = undefined;        // 服务费试算任务相关信息
    this.computeDataSet = undefined;            // 服务费试算信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryComputeTask;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      city_name: 'cityName',
      biz_district_name: 'bizDistrictName',
      compute_dataset_info: {
        key: 'computeDatasetInfo',
        transform: value => CoreObject.mapper(value, SalaryComputeTaskBrief),
      },
      compute_data_set: {
        key: 'computeDataSet',
        transform: value => CoreObject.mapper(value, ComputeDataSetInfoBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cityName: 'city_name',
      bizDistrictName: 'biz_district_name',
      computeDatasetInfo: {
        key: 'compute_dataset_info',
        transform: value => CoreObject.revert(value, SalaryComputeTaskBrief),
      },
      computeDataSet: {
        key: 'compute_data_set',
        transform: value => CoreObject.revert(value, ComputeDataSetInfoBrief),
      },
    };
  }
}

// 规则分类参数信息
class CollectionCateOptionBrief extends CoreObject {
  constructor() {
    super();
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

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

//
class CostOrderDetail extends CoreObject {
  constructor() {
    super();
    this.costAccountingInfo = undefined;        //
    this.applyAccountInfo = undefined;          //
    this.bizExtraHouseContractInfo = undefined; //
    this.costAllocationList = [];               //
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
      cost_accounting_info: {
        key: 'costAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingBrief),
      },
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      biz_extra_house_contract_info: {
        key: 'bizExtraHouseContractInfo',
        transform: value => CoreObject.mapper(value, HouseContractInfo),
      },
      cost_allocation_list: {
        key: 'costAllocationList',
        transform: value => CoreObject.mapperEach(value, CostAllocationBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      costAccountingInfo: {
        key: 'cost_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingBrief),
      },
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      bizExtraHouseContractInfo: {
        key: 'biz_extra_house_contract_info',
        transform: value => CoreObject.revert(value, HouseContractInfo),
      },
      costAllocationList: {
        key: 'cost_allocation_list',
        transform: value => CoreObject.revertEach(value, CostAllocationBrief),
      },
    };
  }
}

//
class HouseContractCostAllotionItem extends CoreObject {
  constructor() {
    super();
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

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 服务费试算信息
class ComputeDataSetInfoBrief extends CoreObject {
  constructor() {
    super();
    this.subsidyAmount = 0;                     // 补贴总额
    this.managementAmount = 0;                  // 管理总额
    this.totalOrder = 0;                        // 单量总额
    this.trialCalculationAmount = 0;            // 试算总金额
    this.doneOrder = 0;                         // 完成单量
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
      subsidy_amount: 'subsidyAmount',
      management_amount: 'managementAmount',
      total_order: 'totalOrder',
      trial_calculation_amount: 'trialCalculationAmount',
      done_order: 'doneOrder',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      subsidyAmount: 'subsidy_amount',
      managementAmount: 'management_amount',
      totalOrder: 'total_order',
      trialCalculationAmount: 'trial_calculation_amount',
      doneOrder: 'done_order',
    };
  }
}

// 规则信息
class RulesInfo extends CoreObject {
  constructor() {
    super();
    this.index = undefined;                     // 指标
    this.symbol = '';                           // 运算符
    this.value = 0;                               // 取值(单、天)
    this.varName = '';                          // 名称
    this.num = 0;                               // 值
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
      index: 'index',
      symbol: 'symbol',
      value: 'value',
      num: 'num',
      var_name: 'varName',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      index: 'index',
      symbol: 'symbol',
      value: 'value',
      num: 'num',
      varName: 'var_name',
    };
  }
}

//
class CostGroupDetail extends CoreObject {
  constructor() {
    super();
    this.creatorInfo = undefined;               //
    this.accountingList = [];                   //
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
        transform: value => CoreObject.mapperEach(value, CostAccountingBrief),
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
        transform: value => CoreObject.revertEach(value, CostAccountingBrief),
      },
    };
  }
}

//
class CostGroupResponse extends CoreObject {
  constructor() {
    super();
    this.record = undefined;                    //
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
      record: {
        key: 'record',
        transform: value => CoreObject.mapper(value, CostGroupBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      record: {
        key: 'record',
        transform: value => CoreObject.revert(value, CostGroupBrief),
      },
    };
  }
}

// 规则唯一主键信息
class RulePrimaryKeyBrief extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // 主键ID
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
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
    };
  }
}

//
class CostOrderResponse extends CoreObject {
  constructor() {
    super();
    this.record = undefined;                    //
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
      record: {
        key: 'record',
        transform: value => CoreObject.mapper(value, CostOrderBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      record: {
        key: 'record',
        transform: value => CoreObject.revert(value, CostOrderBrief),
      },
    };
  }
}

//
class ApplicationOrderListItemOrderFlowRecordTiny extends CoreObject {
  constructor() {
    super();
    this.rejectToNodeInfo = undefined;          //
    this.operateAccountList = [];               //
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
      reject_to_node_info: {
        key: 'rejectToNodeInfo',
        transform: value => CoreObject.mapper(value, FlowNodeInfoTiny),
      },
      operate_account_list: {
        key: 'operateAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      rejectToNodeInfo: {
        key: 'reject_to_node_info',
        transform: value => CoreObject.revert(value, FlowNodeInfoTiny),
      },
      operateAccountList: {
        key: 'operate_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
    };
  }
}

// 底薪补贴信息
class BySalaryBaseParamsInfo extends CoreObject {
  constructor() {
    super();
    this.salaryIncMoney = 0;                    //  底薪x元
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
      salary_inc_money: 'salaryIncMoney',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      salaryIncMoney: 'salary_inc_money',
    };
  }
}

// 返回扣补款项待办任务展示块
class CardInfo extends CoreObject {
  constructor() {
    super();
    this.errData = [];                          // 错误信息
    this.operatorInfo = undefined;              // 操作人信息
    this.group = 0;                             //
    this.endDate = 0;                           // 归属服务费结束日期
    this.workType = 0;                          // 工作性质
    this.bizDistrictName = undefined;           // 商圈name
    this.payrollCycleNo = 0;                    // 服务费计划周期
    this.state = 0;                             // 状态
    this.id = undefined;                        // _id
    this.startDate = 0;                         // 归属服务费开始日期
    this.fundFlag = false;                      // 是否无款项
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
      err_data: 'errData',
      operator_info: {
        key: 'operatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      group: 'group',
      end_date: 'endDate',
      work_type: 'workType',
      biz_district_name: 'bizDistrictName',
      payroll_cycle_no: 'payrollCycleNo',
      state: 'state',
      _id: 'id',
      start_date: 'startDate',
      fund_flag: 'fundFlag',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      errData: 'err_data',
      operatorInfo: {
        key: 'operator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      group: 'group',
      endDate: 'end_date',
      workType: 'work_type',
      bizDistrictName: 'biz_district_name',
      payrollCycleNo: 'payroll_cycle_no',
      state: 'state',
      id: '_id',
      startDate: 'start_date',
      fundFlag: 'fund_flag',
    };
  }
}

// 服务费方案列表
class SalaryPlanListItem extends CoreObject {
  constructor() {
    super();
    this.platformName = '';                     // 平台name
    this.operatorInfo = undefined;              //
    this.creatorInfo = undefined;               //
    this.supplierName = '';                     // 供应商name
    this.cityName = '';                         // 城市name
    this.bizDistrictName = '';                  // 商圈name
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryPlan;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      platform_name: 'platformName',
      operator_info: {
        key: 'operatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      supplier_name: 'supplierName',
      city_name: 'cityName',
      biz_district_name: 'bizDistrictName',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      platformName: 'platform_name',
      operatorInfo: {
        key: 'operator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      creatorInfo: {
        key: 'creator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      supplierName: 'supplier_name',
      cityName: 'city_name',
      bizDistrictName: 'biz_district_name',
    };
  }
}

//
class ApplicationUrgeRecordEmbed extends CoreObject {
  constructor() {
    super();
    this.creatorInfo = undefined;               //
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
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
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
    };
  }
}

// 人员标签映射
class StaffTagTiny extends CoreObject {
  constructor() {
    super();
    this.id = undefined;                        // id
    this.name = '';                             // 标签名称
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
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: '_id',
      name: 'name',
    };
  }
}

// 结算单汇总详情
class PayrollStatementDetail extends CoreObject {
  constructor() {
    super();
    this.payrollInfo = undefined;               // 服务费订单信息
    this.staffInfo = undefined;                 // 人员信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return PayrollStatement;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      payroll_info: {
        key: 'payrollInfo',
        transform: value => CoreObject.mapper(value, PayrollBrief),
      },
      staff_info: {
        key: 'staffInfo',
        transform: value => CoreObject.mapper(value, StaffBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      payrollInfo: {
        key: 'payroll_info',
        transform: value => CoreObject.revert(value, PayrollBrief),
      },
      staffInfo: {
        key: 'staff_info',
        transform: value => CoreObject.revert(value, StaffBrief),
      },
    };
  }
}

// 人员标签映射列表
class StaffTagMapListItem extends CoreObject {
  constructor() {
    super();
    this.platformName = '';                     // 平台name
    this.tagList = [];                          // 标签名称
    this.supplierName = '';                     // 供应商name
    this.cityName = '';                         // 城市name
    this.staffInfo = undefined;                 // 人员基本信息
    this.bizDistrictName = '';                  // 商圈name
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return StaffTagMap;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      platform_name: 'platformName',
      tag_list: {
        key: 'tagList',
        transform: value => CoreObject.mapperEach(value, StaffTagTiny),
      },
      supplier_name: 'supplierName',
      city_name: 'cityName',
      staff_info: {
        key: 'staffInfo',
        transform: value => CoreObject.mapper(value, StaffBrief),
      },
      biz_district_name: 'bizDistrictName',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      platformName: 'platform_name',
      tagList: {
        key: 'tag_list',
        transform: value => CoreObject.revertEach(value, StaffTagTiny),
      },
      supplierName: 'supplier_name',
      cityName: 'city_name',
      staffInfo: {
        key: 'staff_info',
        transform: value => CoreObject.revert(value, StaffBrief),
      },
      bizDistrictName: 'biz_district_name',
    };
  }
}

// 按多条件设置信息
class MultipleParamsInfo extends CoreObject {
  constructor() {
    super();
    this.unitMoney = 0;                         // 奖励/扣罚x元
    this.matchType = 0;                         // 条件类型 1: 满足全部条件, 2: 满足任一条件
    this.unitAmount = 0;                        // 每x单
    this.rules = [];                            // 明细项
    this.unitIndex = undefined;                 // 设定指标
    this.type = 0;                              // 阶梯类型 1: 阶梯分段 2:阶梯变动
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
      unit_money: 'unitMoney',
      match_type: 'matchType',
      unit_amount: 'unitAmount',
      rules: {
        key: 'rules',
        transform: value => CoreObject.mapperEach(value, RulesInfo),
      },
      unit_index: 'unitIndex',
      type: 'type',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      unitMoney: 'unit_money',
      matchType: 'match_type',
      unitAmount: 'unit_amount',
      rules: {
        key: 'rules',
        transform: value => CoreObject.revertEach(value, RulesInfo),
      },
      unitIndex: 'unit_index',
      type: 'type',
    };
  }
}

// 结算单详情
class PayrollDetail extends CoreObject {
  constructor() {
    super();
    this.platformName = '';                     // 平台名称
    this.contractBelongName = '';               // 合同归属名称
    this.supplierName = '';                     // 供应商名称
    this.positionName = '';                     // 职位名称
    this.staffInfo = undefined;                 // 人员信息
    this.payrollStatementInfo = undefined;      // 结算单信息
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return Payroll;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      platform_name: 'platformName',
      contract_belong_name: 'contractBelongName',
      supplier_name: 'supplierName',
      position_name: 'positionName',
      staff_info: {
        key: 'staffInfo',
        transform: value => CoreObject.mapper(value, StaffBrief),
      },
      payroll_statement_info: {
        key: 'payrollStatementInfo',
        transform: value => CoreObject.mapper(value, PayrollStatementBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      platformName: 'platform_name',
      contractBelongName: 'contract_belong_name',
      supplierName: 'supplier_name',
      positionName: 'position_name',
      staffInfo: {
        key: 'staff_info',
        transform: value => CoreObject.revert(value, StaffBrief),
      },
      payrollStatementInfo: {
        key: 'payroll_statement_info',
        transform: value => CoreObject.revert(value, PayrollStatementBrief),
      },
    };
  }
}

//
class CostAccountingBrief extends CoreObject {
  constructor() {
    super();
    this.creatorInfo = undefined;               //
    this.parentInfo = undefined;                //
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
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      parent_info: {
        key: 'parentInfo',
        transform: value => CoreObject.mapper(value, CostAccountingBrief),
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
      parentInfo: {
        key: 'parent_info',
        transform: value => CoreObject.revert(value, CostAccountingBrief),
      },
    };
  }
}

//
class CostAccountingTiny extends CoreObject {
  constructor() {
    super();
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

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

//
class CostOrderListItem extends CoreObject {
  constructor() {
    super();
    this.costAccountingInfo = undefined;        //
    this.applyAccountInfo = undefined;          //
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
      cost_accounting_info: {
        key: 'costAccountingInfo',
        transform: value => CoreObject.mapper(value, CostAccountingTiny),
      },
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      costAccountingInfo: {
        key: 'cost_accounting_info',
        transform: value => CoreObject.revert(value, CostAccountingTiny),
      },
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
    };
  }
}

// 名次阶梯设置信息
class LadderInfo extends CoreObject {
  constructor() {
    super();
    this.money = 0;                             // 奖励金额
    this.rankFrom = 0;                          // 第min名
    this.rankTo = 0;                            // 第max名
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
      money: 'money',
      rank_from: 'rankFrom',
      rank_to: 'rankTo',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      money: 'money',
      rankFrom: 'rank_from',
      rankTo: 'rank_to',
    };
  }
}

//
class CostAccountingResponse extends CoreObject {
  constructor() {
    super();
    this.record = undefined;                    //
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
      record: {
        key: 'record',
        transform: value => CoreObject.mapper(value, CostAccountingBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      record: {
        key: 'record',
        transform: value => CoreObject.revert(value, CostAccountingBrief),
      },
    };
  }
}

// 服务费方案版本详情
class SalaryPlanVersionDetail extends CoreObject {
  constructor() {
    super();
    this.planId = undefined;                    // 服务费方案id
    this.planRevisionId = undefined;            // 修改后服务费版本的id
    this.rulesList = [];                        // 规则集列表
    this.supplierName = '';                     // 供应商name
    this.bizDistrictName = '';                  // 商圈name
    this.computeDataSet = undefined;            // 服务费试算结果信息
    this.platformName = '';                     // 平台name
    this.canAllowCompute = '';                  // 能否试算
    this.cityName = '';                         // 城市name
    this.planVersionId = undefined;             // 城市name
    this.canAllowEdit = '';                     // 能否编辑
    this.computeTaskInfo = undefined;           // 服务费试算结果信息
    this.citySpelling = undefined;              // 城市Spelling
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryPlanVersion;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {
      plan_id: 'planId',
      plan_revision_id: 'planRevisionId',
      rules_list: {
        key: 'rulesList',
        transform: value => CoreObject.mapperEach(value, SalaryPlanRuleCollectionBrief),
      },
      supplier_name: 'supplierName',
      biz_district_name: 'bizDistrictName',
      compute_data_set: {
        key: 'computeDataSet',
        transform: value => CoreObject.mapper(value, ComputeDataSetInfoBrief),
      },
      platform_name: 'platformName',
      can_allow_compute: 'canAllowCompute',
      city_name: 'cityName',
      plan_version_id: 'planVersionId',
      can_allow_edit: 'canAllowEdit',
      compute_task_info: {
        key: 'computeTaskInfo',
        transform: value => CoreObject.mapper(value, SalaryComputeTaskBrief),
      },
      city_spelling: 'citySpelling',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      planId: 'plan_id',
      planRevisionId: 'plan_revision_id',
      rulesList: {
        key: 'rules_list',
        transform: value => CoreObject.revertEach(value, SalaryPlanRuleCollectionBrief),
      },
      supplierName: 'supplier_name',
      bizDistrictName: 'biz_district_name',
      computeDataSet: {
        key: 'compute_data_set',
        transform: value => CoreObject.revert(value, ComputeDataSetInfoBrief),
      },
      platformName: 'platform_name',
      canAllowCompute: 'can_allow_compute',
      cityName: 'city_name',
      planVersionId: 'plan_version_id',
      canAllowEdit: 'can_allow_edit',
      computeTaskInfo: {
        key: 'compute_task_info',
        transform: value => CoreObject.revert(value, SalaryComputeTaskBrief),
      },
      citySpelling: 'city_spelling',
    };
  }
}

// 扣补款项目
class PayrollAdjustmentItemBrief extends CoreObject {
  constructor() {
    super();
    this.definition = '';                       // 定义
    this.supplierId = undefined;                // 供应商id
    this.group = 0;                             // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
    this.name = '';                             // 名称
    this.createdAt = undefined;                 // 创建时间
    this.updatedAt = undefined;                 // 更新时间
    this.id = undefined;                        // _id
    this.state = 0;                             // 状态(启用100,禁用-100)
    this.operatorId = undefined;                // 操作人id
    this.identifier = '';                       // 编号
    this.templateId = undefined;                // 模版ID
    this.platformCode = '';                     // 平台code
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
      definition: 'definition',
      supplier_id: 'supplierId',
      group: 'group',
      name: 'name',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      _id: 'id',
      state: 'state',
      operator_id: 'operatorId',
      identifier: 'identifier',
      template_id: 'templateId',
      platform_code: 'platformCode',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      definition: 'definition',
      supplierId: 'supplier_id',
      group: 'group',
      name: 'name',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      id: '_id',
      state: 'state',
      operatorId: 'operator_id',
      identifier: 'identifier',
      templateId: 'template_id',
      platformCode: 'platform_code',
    };
  }
}

// 结算计划
class PayrollPlanBrief extends CoreObject {
  constructor() {
    super();
    this.cycleInterval = 0;                     // 结算周期值（天/月）
    this.operatorId = undefined;                // 操作人id
    this.initExecuteDate = 0;                   // 首次计算执行日(yyyymmdd)
    this.workType = 0;                          // 工作性质(3001:全职,3002:兼职)
    this.computeDelayDays = 0;                  // 计算预留后延天数
    this.updatedAt = undefined;                 // 更新时间
    this.nextExecuteDate = 0;                   // 计算执行日(下次结算单生成日期)
    this.adjustmentFlag = false;                // 扣补款标示(true:有款项，false:无款项)
    this.bizDistrictId = undefined;             // 商圈id
    this.supplierId = undefined;                // 供应商id
    this.createdAt = undefined;                 // 创建时间
    this.payrollCycleNo = 0;                    // 当前周期编号
    this.payrollCycleType = 0;                  // 结算周期类型 1（按月）2（按日）
    this.state = 0;                             // 状态 100（启用）-100（禁用） -101（删除）
    this.platformCode = '';                     // 平台code
    this.creatorId = undefined;                 // 创建人id
    this.id = undefined;                        // id
    this.type = 0;                              // 类型(1:城市级别，2:商圈级别)
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
      cycle_interval: 'cycleInterval',
      operator_id: 'operatorId',
      init_execute_date: 'initExecuteDate',
      work_type: 'workType',
      compute_delay_days: 'computeDelayDays',
      updated_at: 'updatedAt',
      next_execute_date: 'nextExecuteDate',
      adjustment_flag: 'adjustmentFlag',
      biz_district_id: 'bizDistrictId',
      supplier_id: 'supplierId',
      created_at: 'createdAt',
      payroll_cycle_no: 'payrollCycleNo',
      payroll_cycle_type: 'payrollCycleType',
      state: 'state',
      platform_code: 'platformCode',
      creator_id: 'creatorId',
      _id: 'id',
      type: 'type',
      city_code: 'cityCode',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cycleInterval: 'cycle_interval',
      operatorId: 'operator_id',
      initExecuteDate: 'init_execute_date',
      workType: 'work_type',
      computeDelayDays: 'compute_delay_days',
      updatedAt: 'updated_at',
      nextExecuteDate: 'next_execute_date',
      adjustmentFlag: 'adjustment_flag',
      bizDistrictId: 'biz_district_id',
      supplierId: 'supplier_id',
      createdAt: 'created_at',
      payrollCycleNo: 'payroll_cycle_no',
      payrollCycleType: 'payroll_cycle_type',
      state: 'state',
      platformCode: 'platform_code',
      creatorId: 'creator_id',
      id: '_id',
      type: 'type',
      cityCode: 'city_code',
    };
  }
}

//
class CostGroupBrief extends CoreObject {
  constructor() {
    super();
    this.creatorInfo = undefined;               //
    this.accountingList = [];                   //
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
      creator_info: {
        key: 'creatorInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      accounting_list: {
        key: 'accountingList',
        transform: value => CoreObject.mapperEach(value, CostAccountingBrief),
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
        transform: value => CoreObject.revertEach(value, CostAccountingBrief),
      },
    };
  }
}

// 数据源筛选器(条件)
class MatchFiltersBrief extends CoreObject {
  constructor() {
    super();
    this.index = 0;                             // 指标id
    this.value = [];                            // 值 100:全部, 其他枚举值调接口
    this.symbol = 0;                            // in | not
    this.varName = [];                          // 名称
    this.groupMatch = undefined;                // 条件类型 all: 满足全部条件, any: 满足任一条件
    this.groupFilters = [];                     // 明细项
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
      index: 'index',
      value: 'value',
      symbol: 'symbol',
      var_name: 'varName',
      group_match: 'groupMatch',
      group_filters: {
        key: 'groupFilters',
        transform: value => CoreObject.mapperEach(value, RulesInfo),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      index: 'index',
      value: 'value',
      symbol: 'symbol',
      varName: 'var_name',
      groupMatch: 'group_match',
      groupFilters: {
        key: 'group_filters',
        transform: value => CoreObject.revertEach(value, RulesInfo),
      },
    };
  }
}


// 服务费规则集
class SalaryPlanRuleCollectionBrief extends CoreObject {
  constructor() {
    super();
    this.workRuleRelation = 0;                  // 规则关系 1 互斥 2互补
    this.orderRules = [];                       // 单量提成规则
    this.operationRules = [];                   // 运营管理奖罚规则
    this.operationRuleFlag = false;             // 运营管理启用标记
    this.workType = 0;                          // 工作类型
    this.updatedAt = undefined;                 // 更新时间
    this.operationRuleRelation = 0;             // 规则关系 1 互斥 2互补
    this.orderRuleRelation = 0;                 // 规则关系 1 互斥 2互补
    this.orderRuleFlag = false;                 // 单量提成启用标记
    this.qaRuleFlag = false;                    // 质量启用标记
    this.qaRules = [];                          // 质量扣罚规则
    this.qaRuleRelation = 0;                    // 规则关系 1 互斥 2互补
    this.id = undefined;                        // _id
    this.planId = undefined;                    // 服务费方案id
    this.workRules = [];                        // 出勤扣罚规则
    this.createdAt = undefined;                 // 创建时间
    this.planVersionId = undefined;             // 服务费方案版本id
    this.workRuleFlag = false;                  // 出勤启用标记
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
      work_rule_relation: 'workRuleRelation',
      order_rules: 'orderRules',
      operation_rules: 'operationRules',
      operation_rule_flag: 'operationRuleFlag',
      work_type: 'workType',
      updated_at: 'updatedAt',
      operation_rule_relation: 'operationRuleRelation',
      order_rule_relation: 'orderRuleRelation',
      order_rule_flag: 'orderRuleFlag',
      qa_rule_flag: 'qaRuleFlag',
      qa_rules: 'qaRules',
      qa_rule_relation: 'qaRuleRelation',
      _id: 'id',
      plan_id: 'planId',
      work_rules: 'workRules',
      created_at: 'createdAt',
      plan_version_id: 'planVersionId',
      work_rule_flag: 'workRuleFlag',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      workRuleRelation: 'work_rule_relation',
      orderRules: 'order_rules',
      operationRules: 'operation_rules',
      operationRuleFlag: 'operation_rule_flag',
      workType: 'work_type',
      updatedAt: 'updated_at',
      operationRuleRelation: 'operation_rule_relation',
      orderRuleRelation: 'order_rule_relation',
      orderRuleFlag: 'order_rule_flag',
      qaRuleFlag: 'qa_rule_flag',
      qaRules: 'qa_rules',
      qaRuleRelation: 'qa_rule_relation',
      id: '_id',
      planId: 'plan_id',
      workRules: 'work_rules',
      createdAt: 'created_at',
      planVersionId: 'plan_version_id',
      workRuleFlag: 'work_rule_flag',
    };
  }
}

//
class ApplicationFlowResponse extends CoreObject {
  constructor() {
    super();
    this.record = undefined;                    //
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
      record: {
        key: 'record',
        transform: value => CoreObject.mapper(value, ApplicationFlowTemplateDetail),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      record: {
        key: 'record',
        transform: value => CoreObject.revert(value, ApplicationFlowTemplateDetail),
      },
    };
  }
}

//
class ApplicationOrderBrief extends CoreObject {
  constructor() {
    super();
    this.flowRecordList = [];                   //
    this.applyAccountInfo = undefined;          //
    this.currentFlowNodeInfo = undefined;       //
    this.flowInfo = undefined;                  //
    this.costOrderList = [];                    //
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
      flow_record_list: {
        key: 'flowRecordList',
        transform: value => CoreObject.mapperEach(value, ApplicationOrderFlowRecordBrief),
      },
      apply_account_info: {
        key: 'applyAccountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      current_flow_node_info: {
        key: 'currentFlowNodeInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowNodeBrief),
      },
      flow_info: {
        key: 'flowInfo',
        transform: value => CoreObject.mapper(value, ApplicationFlowTemplateBrief),
      },
      cost_order_list: {
        key: 'costOrderList',
        transform: value => CoreObject.mapperEach(value, CostOrderBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      flowRecordList: {
        key: 'flow_record_list',
        transform: value => CoreObject.revertEach(value, ApplicationOrderFlowRecordBrief),
      },
      applyAccountInfo: {
        key: 'apply_account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      currentFlowNodeInfo: {
        key: 'current_flow_node_info',
        transform: value => CoreObject.revert(value, ApplicationFlowNodeBrief),
      },
      flowInfo: {
        key: 'flow_info',
        transform: value => CoreObject.revert(value, ApplicationFlowTemplateBrief),
      },
      costOrderList: {
        key: 'cost_order_list',
        transform: value => CoreObject.revertEach(value, CostOrderBrief),
      },
    };
  }
}

//
class ApplicationFlowNodeResponse extends CoreObject {
  constructor() {
    super();
    this.record = undefined;                    //
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
      record: {
        key: 'record',
        transform: value => CoreObject.mapper(value, ApplicationFlowNodeDetail),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      record: {
        key: 'record',
        transform: value => CoreObject.revert(value, ApplicationFlowNodeDetail),
      },
    };
  }
}

// 人员服务费计算结果集详情
class SalaryComputeDatasetDetail extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryComputeDataSet;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

// 服务费规则详情
class SalaryRuleDetail extends CoreObject {
  constructor() {
    super();
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return SalaryRule;
  }

  // 必填字段
  static requiredFields() {
    return [

    ];
  }

  // 数据映射
  static datamap() {
    return {

    };
  }

  // 反向映射
  static revertMap() {
    return {

    };
  }
}

//
class ApplicationOrderFlowRecordDetail extends CoreObject {
  constructor() {
    super();
    this.accountInfo = undefined;               //
    this.extraInfoList = [];                    //
    this.ccAccountList = [];                    //
    this.operateAccountList = [];               //
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
      account_info: {
        key: 'accountInfo',
        transform: value => CoreObject.mapper(value, AccountBrief),
      },
      extra_info_list: {
        key: 'extraInfoList',
        transform: value => CoreObject.mapperEach(value, OaApplicationOrderFlowExtra),
      },
      cc_account_list: {
        key: 'ccAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
      operate_account_list: {
        key: 'operateAccountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      accountInfo: {
        key: 'account_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      extraInfoList: {
        key: 'extra_info_list',
        transform: value => CoreObject.revertEach(value, OaApplicationOrderFlowExtra),
      },
      ccAccountList: {
        key: 'cc_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
      operateAccountList: {
        key: 'operate_account_list',
        transform: value => CoreObject.revertEach(value, AccountBrief),
      },
    };
  }
}

//
class CreateCostOrderResponse extends CoreObject {
  constructor() {
    super();
    this.records = [];                          //
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
      records: {
        key: 'records',
        transform: value => CoreObject.mapperEach(value, CostOrderBrief),
      },
    };
  }

  // 反向映射
  static revertMap() {
    return {
      records: {
        key: 'records',
        transform: value => CoreObject.revertEach(value, CostOrderBrief),
      },
    };
  }
}

//
class FlowNodeInfoTiny extends CoreObject {
  constructor() {
    super();
    this.accountList = [];                      //
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
      account_list: {
        key: 'accountList',
        transform: value => CoreObject.mapperEach(value, AccountBrief),
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
    };
  }
}

// 扣补款任务
class PayrollAdjustmentTaskBrief extends CoreObject {
  constructor() {
    super();
    this.activeFlag = false;                    // 待处理标示(true待处理)
    this.createdAt = 0;                         // 创建时间
    this.bizDistrictId = undefined;             // 商圈id
    this.endDate = 0;                           // 结束日期
    this.positionId = 0;                        // 职位(1003:总监,1004:城市经理,1005:助理,1006:调度,1007:站长,1009:骑士长,1010:骑士)
    this.workType = 0;                          // 工作性质
    this.updatedAt = 0;                         // 更新时间
    this.fileKey = '';                          // 文件key
    this.optionFlag = false;                    // 操作标示(true可操作,false不可操作 )
    this.storageType = 0;                       // 储存模式(七牛)
    this.operatorId = undefined;                // 操作人id
    this.platformCode = '';                     // 平台code
    this.errData = [];                          // 错误信息
    this.supplierId = undefined;                // 供应商id
    this.group = 0;                             // 款项组(人员扣款11001, 人员补款 11002, 人事扣款 11003, 人事补款 11004)
    this.submitedAt = 0;                        // 提交时间
    this.payrollPlanCycleNo = 0;                // 服务费计划周期ID
    this.payrollPlanId = undefined;             // 服务费计划id
    this.state = 0;                             // 状态
    this.payrollStatementId = undefined;        // 服务费总账单
    this.id = undefined;                        // _id
    this.startDate = 0;                         // 起始日期
    this.cityCode = '';                         // 城市code
    this.fundFlag = false;                      // 款项标示(true无款项)
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
      active_flag: 'activeFlag',
      created_at: 'createdAt',
      biz_district_id: 'bizDistrictId',
      end_date: 'endDate',
      position_id: 'positionId',
      work_type: 'workType',
      updated_at: 'updatedAt',
      file_key: 'fileKey',
      option_flag: 'optionFlag',
      storage_type: 'storageType',
      operator_id: 'operatorId',
      platform_code: 'platformCode',
      err_data: 'errData',
      supplier_id: 'supplierId',
      group: 'group',
      submited_at: 'submitedAt',
      payroll_plan_cycle_no: 'payrollPlanCycleNo',
      payroll_plan_id: 'payrollPlanId',
      state: 'state',
      payroll_statement_id: 'payrollStatementId',
      _id: 'id',
      start_date: 'startDate',
      city_code: 'cityCode',
      fund_flag: 'fundFlag',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      activeFlag: 'active_flag',
      createdAt: 'created_at',
      bizDistrictId: 'biz_district_id',
      endDate: 'end_date',
      positionId: 'position_id',
      workType: 'work_type',
      updatedAt: 'updated_at',
      fileKey: 'file_key',
      optionFlag: 'option_flag',
      storageType: 'storage_type',
      operatorId: 'operator_id',
      platformCode: 'platform_code',
      errData: 'err_data',
      supplierId: 'supplier_id',
      group: 'group',
      submitedAt: 'submited_at',
      payrollPlanCycleNo: 'payroll_plan_cycle_no',
      payrollPlanId: 'payroll_plan_id',
      state: 'state',
      payrollStatementId: 'payroll_statement_id',
      id: '_id',
      startDate: 'start_date',
      cityCode: 'city_code',
      fundFlag: 'fund_flag',
    };
  }
}

// 数据处理逻辑
class ComputeLogicBrief extends CoreObject {
  constructor() {
    super();
    this.rangeParams = undefined;               // 按阶梯设置参数
    this.battleParams = undefined;              // 竞赛评比参数
    this.byOrderUnitParams = undefined;         // 按单补贴参数
    this.byOnceParams = undefined;              // 总额补贴参数
    this.setFlag = undefined;                   // 1 奖励法 2 竞赛评比
    this.condtionsType = 0;                     // 奖罚方式 1：按阶梯，2：按多组条件
    this.params = undefined;                    // 数据处理逻辑参数
    this.multipleParams = [];                   // 按多组条件设置参数
    this.bySalaryBaseParams = undefined;        // 底薪补贴参数
    this.bizLogic = [];                         // 数据处理逻辑类型描述
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
      range_params: {
        key: 'rangeParams',
        transform: value => CoreObject.mapper(value, ParamsInfo),
      },
      battle_params: {
        key: 'battleParams',
        transform: value => CoreObject.mapper(value, BattleParamsInfo),
      },
      by_order_unit_params: {
        key: 'byOrderUnitParams',
        transform: value => CoreObject.mapper(value, ByOrderUnitParamsInfo),
      },
      by_once_params: {
        key: 'byOnceParams',
        transform: value => CoreObject.mapper(value, ByOnceParamsInfo),
      },
      set_flag: 'setFlag',
      condtions_type: 'condtionsType',
      params: {
        key: 'params',
        transform: value => CoreObject.mapper(value, ParamsInfo),
      },
      multiple_params: {
        key: 'multipleParams',
        transform: value => CoreObject.mapperEach(value, MultipleParamsInfo),
      },
      by_salary_base_params: {
        key: 'bySalaryBaseParams',
        transform: value => CoreObject.mapper(value, BySalaryBaseParamsInfo),
      },
      biz_logic: 'bizLogic',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      rangeParams: {
        key: 'range_params',
        transform: value => CoreObject.revert(value, ParamsInfo),
      },
      battleParams: {
        key: 'battle_params',
        transform: value => CoreObject.revert(value, BattleParamsInfo),
      },
      byOrderUnitParams: {
        key: 'by_order_unit_params',
        transform: value => CoreObject.revert(value, ByOrderUnitParamsInfo),
      },
      byOnceParams: {
        key: 'by_once_params',
        transform: value => CoreObject.revert(value, ByOnceParamsInfo),
      },
      setFlag: 'set_flag',
      condtionsType: 'condtions_type',
      params: {
        key: 'params',
        transform: value => CoreObject.revert(value, ParamsInfo),
      },
      multipleParams: {
        key: 'multiple_params',
        transform: value => CoreObject.revertEach(value, MultipleParamsInfo),
      },
      bySalaryBaseParams: {
        key: 'by_salary_base_params',
        transform: value => CoreObject.revert(value, BySalaryBaseParamsInfo),
      },
      bizLogic: 'biz_logic',
    };
  }
}
// 上一版 module.exports
export {
  VarExpression,                        // 复合指标公式表
  DataSource,                           // 源数据表
  TemplateFormula,                      // 基于模版的指标公式表
  VarDefinition,                        // 系统变量表
  DataSourceTemplate,                   // 源数据模板表
  VarAverageFormula,                    // 指标日均、单均计算公式表
  UploadDataSourceTask,                 // 上传任务表
  SalaryComputeTask,                    // 服务费试算任务
  SalaryComputeDataSet,                 // 人员服务费计算结果集
  SalaryPlan,                           // 服务费方案
  SalaryPlanVersion,                    // 服务费方案版本
  SalaryPlanRuleCollection,             // 服务费规则集
  SalaryRule,                           // 服务费计算规则
  SalaryVarConfigVersion,               // 结算指标方案配置版本
  SalaryVarConfigDefaultVersion,        // 结算指标方案配置默认版本
  SalaryVarPlan,                        // 结算指标方案库
  SalaryVar,                            // 结算指标定义
  SalaryVarValue,                       // 结算指标参数值
  AbnormalAccount,                      // 骑士异常账户
  Staff,                                // 人员信息表
  StaffTag,                             // 人员标签分组
  StaffTagMap,                          // 人员标签
  OaHouseContract,                      // 房屋租赁合同/记录
  OaApplicationOrderLog,                // OA审批单操作日志
  OaApplicationFlowNode,                // OA审批流节点
  OaApplicationFlowTemplate,            // OA审批流模板
  OaApplicationOrder,                   // OA申请审批单
  OaApplicationOrderFlowRecord,         // OA审批单流转明细记录
  OaApplicationOrderFlowExtra,          // OA审批单流转补充说明
  OaApplicationUrgeRecord,              // 催办记录
  OaCostGroup,                          // OA费用分组(原费用类型）
  OaCostAccounting,                     // OA成本费用会计科目表
  OaCostAllocation,                     // OA成本费用记录分摊明细表(分摊记录)
  OaCostBookLog,                        // OA成本费用记账明细
  OaCostBookMonth,                      // OA成本费用月度汇总表
  OaPayeeBook,                          // 收款人信息名录
  OaCostOrder,                          // 成本费用记录
  PayrollStatement,                     // 结算单-总账单（商圈级别）
  Payroll,                              // 结算单（明细）
  PayrollAdjustmentConfiguration,       // 结算单调整项(扣款补款)配置
  PayrollAdjustmentItem,                // 结算单调整项(扣款补款)项目
  PayrollAdjustmentDataTemplate,        // 结算单调整项(扣款补款)数据模板
  PayrollAdjustmentTask,                // 结算单调整项(扣款补款)数据上传任务
  SalaryPayrollAdjustmentLine,          // 人员扣款补款明细数据
  PayrollPlan,                          // 结算计划
  BizDataBySupplier,                    // 供应商数据表
  BizDataByAppeal,                      // 申诉单数据表
  BizDataByOrder,                       // 订单数据表
  BizDataByDistrict,                    // 商圈数据表
  BizDataByCity,                        // 城市数据表
  BizDataByKnight,                      // 骑士数据表
  BizDataByComplain,                    // 投诉单数据表
  BizData,                              // 标准数据表
  PayrollStatementBrief,                // 结算单汇总
  MatchFiltersBrief,                    // 数据源筛选器(条件)
  CommonMessageExtra,                   //
  SalaryPlanRuleCollectionDetail,       // 服务费规则集详情
  RangeTableInfo,                       // 按单条件信息
  ApplicationFlowNodeEmbedItem,         //
  SalaryInfo,                           // 服务费数据信息
  HouseContractListItem,                //
  SalaryPlanBrief,                      // 服务费方案
  ApplicationOrderDetail,               //
  ParamsInfo,                           // 参数信息
  BossAssistNoticeDetail,               //
  PayrollAdjustmentTaskListItem,        // 扣补款任务列表
  ApplicationOrderFlowRecordBrief,      //
  CostOrderBrief,                       //
  CostGroupListItem,                    //
  PayrollPlanListItem,                  // 结算计划列表
  SysNoticeDetail,                      //
  ApplicationFlowNodeDetail,            //
  SalaryPlanVersionListItem,            // 服务费方案版本列表
  StaffTagBrief,                        // 人员标签
  SalaryComputeTaskDetail,              // 服务费试算任务详情
  ApplicationFlowTemplateBrief,         //
  CostAccountingDetail,                 //
  HouseContractResponse,                //
  ApplicationOrderListItem,             //
  ByOrderUnitParamsInfo,                // 按单补贴信息
  PayrollAdjustmentItemDetail,          // 扣补款项目详情
  SalaryVarBrief,                       // 结算指标
  PayrollBrief,                         // 结算单（明细）
  PayrollAdjustmentTaskDetail,          // 扣补款任务详情
  SalaryStaffListItem,                  // 人员标签映射列表
  OperatiorBrief,                       // 用户
  PayrollAdjustmentItemListItem,        // 扣补款项目列表
  SalaryPlanRuleCollectionListItem,     // 服务费规则集列表
  ApplicationFlowTemplateDetail,        //
  ByOnceParamsInfo,                     // 总额补贴信息
  SalaryVarDetail,                      // 结算指标详情
  SalaryComputeTaskBrief,               // 服务费试算任务
  ApplicationFlowTemplateDetailNodeDetail, //
  PayrollPlanDetail,                    // 结算计划详情
  BattleParamsInfo,                     // 竞赛评比信息
  SalaryComputeDataSetBrief,            // 人员服务费计算结果集
  SalaryVarListItem,                    // 结算指标列表
  PayrollListItem,                      // 结算单列表
  ApplicationFlowTemplateListItem,      //
  PayrollStatementListItem,             // 结算单汇总列表
  ApplicationFlowNodeBrief,             //
  StaffTagMapDetail,                    // 人员标签映射详情
  SalaryPlanDetail,                     // 服务费方案详情
  ApplicationFlowTemplateListItemCostGroupTiny, //
  StaffBrief,                           // 人员
  ApplicationUrgeRecordDetail,          //
  SalaryComputeDataSetListItem,         // 人员服务费计算结果集列表
  SalaryPlanVersionBrief,               // 服务费方案版本
  StaffTagMapBrief,                     // 人员标签映射
  CostAllocationBrief,                  //
  SalaryRuleListItem,                   // 服务费规则列表
  HouseContractDetail,                  //
  SalaryRuleBrief,                      // 服务费规则
  ApplicationOrderResponse,             //
  AccountBrief,                         //
  StaffTagListItem,                     // 人员标签列表
  StaffTagDetail,                       // 人员标签详情
  SalaryComputeTaskListItem,            // 服务费试算任务列表
  CollectionCateOptionBrief,            // 规则分类参数信息
  CostOrderDetail,                      //
  HouseContractCostAllotionItem,        //
  ComputeDataSetInfoBrief,              // 服务费试算信息
  RulesInfo,                            // 规则信息
  CostGroupDetail,                      //
  CostGroupResponse,                    //
  RulePrimaryKeyBrief,                  // 规则唯一主键信息
  CostOrderResponse,                    //
  ApplicationOrderListItemOrderFlowRecordTiny, //
  BySalaryBaseParamsInfo,               // 底薪补贴信息
  CardInfo,                             // 返回扣补款项待办任务展示块
  SalaryPlanListItem,                   // 服务费方案列表
  ApplicationUrgeRecordEmbed,           //
  StaffTagTiny,                         // 人员标签映射
  PayrollStatementDetail,               // 结算单汇总详情
  StaffTagMapListItem,                  // 人员标签映射列表
  MultipleParamsInfo,                   // 按多条件设置信息
  PayrollDetail,                        // 结算单详情
  CostAccountingBrief,                  //
  CostAccountingTiny,                   //
  CostOrderListItem,                    //
  LadderInfo,                           // 名次阶梯设置信息
  CostAccountingResponse,               //
  SalaryPlanVersionDetail,              // 服务费方案版本详情
  PayrollAdjustmentItemBrief,           // 扣补款项目
  PayrollPlanBrief,                     // 结算计划
  CostGroupBrief,                       //
  SalaryPlanRuleCollectionBrief,        // 服务费规则集
  ApplicationFlowResponse,              //
  ApplicationOrderBrief,                //
  ApplicationFlowNodeResponse,          //
  SalaryComputeDatasetDetail,           // 人员服务费计算结果集详情
  SalaryRuleDetail,                     // 服务费规则详情
  ApplicationOrderFlowRecordDetail,     //
  CreateCostOrderResponse,              //
  FlowNodeInfoTiny,                     //
  PayrollAdjustmentTaskBrief,           // 扣补款任务
  ComputeLogicBrief,                    // 数据处理逻辑
};
