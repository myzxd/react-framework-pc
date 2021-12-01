// 物资分类名称类型
const SupplyNameType = {
  electricCars: 10,
  equipment: 20,
  fixedAssets: 30,
  description(rawValue) {
    switch (rawValue) {
      case this.electricCars: return '电动车';
      case this.equipment: return '装备';
      case this.fixedAssets: return '固定资产';
      default: return '--';
    }
  },
};

// 物资的采购方式
const SupplyPurchaseWayType = {
  procurement: 1,
  lease: 2,
  description(rawValue) {
    switch (rawValue) {
      case this.procurement: return '自采';
      case this.lease: return '租赁';
      default: return '未定义';
    }
  },
};

// 使用扣款方式
const SupplyMoneyDeductionType = {
  onceBuckle: 10,
  installment: 20,
  noBuckle: 30,
  always: 40,
  description(rawValue) {
    switch (rawValue) {
      case this.onceBuckle: return '一次扣';
      case this.installment: return '分期扣';
      case this.noBuckle: return '不扣';
      case this.always: return '一直扣';
      default: return '未定义';
    }
  },
};

// 押金扣款方式
const SupplyPledgeMoneyType = {
  buckle: 1,
  noBuckle: 2,
  description(rawValue) {
    switch (rawValue) {
      case this.buckle: return '扣';
      case this.noBuckle: return '不扣';
      default: return '未定义';
    }
  },
};

// 物资模块模板类型
const SupplyTemplateType = {
  distribution: 'distribution',
  item: 'item',
  purchase: 'purchase',
  deductSummarize: 'deduction_total',
  description(rawValue) {
    switch (rawValue) {
      case this.distribution: return '分发';
      case this.item: return '物资管理/品目';
      case this.purchase: return '入库';
      case this.deductSummarize: return '扣款汇总';
      default: return '未定义';
    }
  },
};

// 物资模块下载模板类型
const SupplyDownloadType = {
  purchaseTemplate: 'purchase_template',
  distributionTemplate: 'distribution_template',
  itemTemplate: 'item_template',
  description(rawValue) {
    switch (rawValue) {
      case this.purchaseTemplate: return '采购入库明细表';
      case this.distributionTemplate: return '分发明细表';
      case this.itemTemplate: return '物资设置表';
      default: return '未定义';
    }
  },
};

// 物资文件粗存类型
const SupplyStorageType = {
  sevenCattle: 1,
  local: 2,
  sThree: 3,
  description(rawValue) {
    switch (rawValue) {
      case this.sevenCattle: return '七牛';
      case this.local: return '本地';
      case this.sThree: return 'S3';
      default: return '未定义';
    }
  },
};

// 物资模块-分发明细列表-物资领用状态
const SupplyDistributionState = {
  toBeUsed: 1,
  used: 10,
  return: 40,
  description(rawValue) {
    switch (rawValue) {
      case this.toBeUsed: return '未领用';
      case this.used: return '已领用';
      case this.return: return '退还入库';
      default: return '未定义';
    }
  },
};

// 推荐公司状态
const RecommendedCompanyState = {
  on: 100,
  off: -100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.on: return '正常';
      case this.off: return '停用';
      default: return '未定义';
    }
  },
};

// 推荐公司服务范围状态
const RecommendedCompanyServiceRangeState = {
  on: 100,
  off: -100,
  deleted: -101,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.on: return '正常';
      case this.off: return '停用';
      case this.deleted: return '删除';
      default: return '未定义';
    }
  },
};

// 推荐公司服务范围级别
const RecommendedCompanyServiceRangeDomain = {
  platform: 1,
  supplier: 2,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.platform: return '平台';
      case this.supplier: return '供应商';
      default: return '未定义';
    }
  },
};

// 推荐平台
const RecommendedPlatform = {
  wuba: 10,     // 智联
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.wuba: return '58同城';
      default: return '--';
    }
  },
};

export {
  SupplyNameType, // 物资名称类型
  SupplyPurchaseWayType, // 物资采购方式
  SupplyMoneyDeductionType, // 使用扣款方式
  SupplyPledgeMoneyType, // 押金扣款方式
  SupplyTemplateType, // 物资模块上传模板类型
  SupplyDownloadType, // 物资模块下载模板类型
  SupplyStorageType,  // 物资文件储存类型
  SupplyDistributionState,  // 物资分发明细状态
  RecommendedCompanyState, // 推荐公司状态
  RecommendedCompanyServiceRangeState, // 推荐公司服务范围状态
  RecommendedCompanyServiceRangeDomain, // 推荐公司服务范围级别
  RecommendedPlatform,    // 推荐平台
};
