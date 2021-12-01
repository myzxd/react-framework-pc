import CoreObject from '../core';

// 商圈列表
class BizDistrictListItem extends CoreObject {
  constructor() {
    super();
    this.operatorInfo = undefined;              //
    this.supplierInfo = undefined;              //
    this.cityInfo = undefined;                  //
    this.industryCode = undefined;
    this.labelInfos = undefined;
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return BizDistrictBrief;
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
      supplier_info: {
        key: 'supplierInfo',
        transform: value => CoreObject.mapper(value, SupplierBrief),
      },
      city_info: {
        key: 'cityInfo',
        transform: value => CoreObject.mapper(value, CityBrief),
      },
      industry_code: 'industryCode',
      label_infos: 'labelInfos',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      operatorInfo: {
        key: 'operator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      supplierInfo: {
        key: 'supplier_info',
        transform: value => CoreObject.revert(value, SupplierBrief),
      },
      cityInfo: {
        key: 'city_info',
        transform: value => CoreObject.revert(value, CityBrief),
      },
      industryCode: 'industry_code',
      labelInfos: 'label_infos',
    };
  }
}

// 商圈详情
class BizDistrictDetail extends CoreObject {
  constructor() {
    super();
    this.operatorInfo = undefined;              //
    this.supplierInfo = undefined;              //
    this.cityInfo = undefined;                  //
    this.industryCode = undefined;
    this.ownerInfo = undefined;
    this.labelInfos = undefined; // 标签（手动添加）
    this.sourceType = undefined;
    this.operationType = undefined;
    this.remark = undefined;
    this.disposalType = undefined;
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return BizDistrictBrief;
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
      supplier_info: {
        key: 'supplierInfo',
        transform: value => CoreObject.mapper(value, SupplierBrief),
      },
      city_info: {
        key: 'cityInfo',
        transform: value => CoreObject.mapper(value, CityBrief),
      },
      industry_code: 'industryCode',
      owner_info: {
        key: 'ownerInfo',
        transform: value => value,
      },
      label_infos: 'labelInfos',
      source_type: 'sourceType',
      operation_type: 'operationType',
      remark: 'remark',
      disposal_type: 'disposalType',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      operatorInfo: {
        key: 'operator_info',
        transform: value => CoreObject.revert(value, AccountBrief),
      },
      supplierInfo: {
        key: 'supplier_info',
        transform: value => CoreObject.revert(value, SupplierBrief),
      },
      cityInfo: {
        key: 'city_info',
        transform: value => CoreObject.revert(value, CityBrief),
      },
      industryCode: 'industry_code',
      owner_info: {
        key: 'ownerInfo',
        transform: value => value,
      },
      labelInfos: 'label_infos',
      sourceType: 'source_type',
      operationType: 'operation_type',
      remark: 'remark',
      disposalType: 'disposal_type',
    };
  }
}

  // 商圈信息
class BizDistrictBrief extends CoreObject {
  constructor() {
    super();
    this.customId = undefined;                  // 平台商圈id
    this.supplierId = undefined;                // 供应商id
    this.name = '';                             // 商圈名称
    this.cityId = undefined;                    // 城市id
    this.createdAt = undefined;                 // 创建时间
    this.updatedAt = undefined;                 // 更新时间
    this.forbiddenAt = undefined;               // 禁用时间
    this.state = 0;                             // 商圈状态(100：启用,-100：禁用)
    this.cityCode = '';                         // 城市code
    this.citySpelling = '';
    this.id = undefined;                        // _id
    this.platformCode = '';                     // 平台code
    this.crowdsource_custom_id = '';            // 众包平台商圈三方ID
    this.legwork_custom_id = '';                // 跑腿平台商圈三方ID
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
      custom_id: 'customId',
      supplier_id: 'supplierId',
      name: 'name',
      city_id: 'cityId',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      forbidden_at: 'forbiddenAt',
      state: 'state',
      city_code: 'cityCode',
      city_spelling: 'citySpelling',
      _id: 'id',
      platform_code: 'platformCode',
      crowdsource_custom_id: 'crowdsource_custom_id',
      legwork_custom_id: 'legwork_custom_id',
      quickly_send_custom_id: 'quickly_send_custom_id',
      enterprise_customer_custom_id: 'enterprise_customer_custom_id',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      customId: 'custom_id',
      supplierId: 'supplier_id',
      name: 'name',
      cityId: 'city_id',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      forbiddenAt: 'forbidden_at',
      state: 'state',
      cityCode: 'city_code',
      citySpelling: 'city_spelling',
      id: '_id',
      platformCode: 'platform_code',
      crowdsource_custom_id: 'crowdsource_custom_id',
      legwork_custom_id: 'legwork_custom_id',
      quickly_send_custom_id: 'quickly_send_custom_id',
      enterprise_customer_custom_id: 'enterprise_customer_custom_id',
    };
  }
}

// 操作人信息
class AccountBrief extends CoreObject {
  constructor() {
    super();
    this.phone = '';                            // phone
    this.id = undefined;                        // id
    this.name = '';                             // 用户名称
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

// 供应商详情
class SupplierBrief extends CoreObject {
  constructor() {
    super();
    this.supplierId = '';                       // 供应商ID
    this.state = 0;                             // 状态(100:启用,-100:禁用, -101:删除)
    this.createdAt = undefined;                 // 创建时间
    this.updatedAt = undefined;                 // 更新时间
    this.forbiddenAt = undefined;               // 禁用时间
    this.creatorId = undefined;                 // 创建人id
    this.operatorId = undefined;                // 操作人id
    this.supplierName = '';                             // 供应商名称
    this.id = undefined;                        // id
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
      supplier_id: 'supplierId',
      state: 'state',
      created_at: 'createdAt',
      updated_at: 'updatedAt',
      forbidden_at: 'forbiddenAt',
      creator_id: 'creatorId',
      operator_id: 'operatorId',
      supplier_name: 'supplierName',
      _id: 'id',
      platform_code: 'platformCode',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      supplierId: 'supplier_id',
      state: 'state',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      forbiddenAt: 'forbidden_at',
      creatorId: 'creator_id',
      operatorId: 'operator_id',
      supplierName: 'supplier_name',
      id: '_id',
      platformCode: 'platform_code',
    };
  }
}

// 城市信息
class CityBrief extends CoreObject {
  constructor() {
    super();
    this.cityName = '';                         // 城市名称
    this.id = undefined;                        // id
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
      city_name: 'cityName',
      _id: 'id',
      city_code: 'cityCode',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      cityName: 'city_name',
      id: '_id',
      cityCode: 'city_code',
    };
  }
}

// 上一版 module.exports
export {
  BizDistrictListItem,
  BizDistrictDetail,
};
