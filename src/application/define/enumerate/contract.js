// 合同生效状态
const ContractEffectiveState = {
  toBeSign: 1, // 待签署
  signed: 50, // 待签署
  signedTwo: 100, // 已签署
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.toBeSign:
        return '待签署';
      case this.signed:
        return '待签署';
      case this.signedTwo:
        return '已签署';
      default:
        return '--';
    }
  },
};

// 历史合同状态
const HistoryContractState = {
  one: -50, // 员工签约失败
  two: -100, // 公司签约失败
  three: -105, // 合同过期失效
  four: -110, // 已删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.one:
        return '员工签约失败';
      case this.two:
        return '公司签约失败';
      case this.three:
        return '合同过期失效';
      case this.four:
        return '已删除';
      default:
        return '--';
    }
  },
};

// 签约类型
const SignContractType = {
  electronic: 20, // 电子签约
  paper: 10, // 纸质签约
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.electronic:
        return '电子签约';
      case this.paper:
        return '纸质签约';
      default:
        return '--';
    }
  },
};

// 合同周期单位
const ContractCycleUnit = {
  year: 10, // 年
  month: 20, // 月
  day: 30, // 日
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.year:
        return '年';
      case this.month:
        return '月';
      case this.day:
        return '日';
      default:
        return '--';
    }
  },
};

// 签约周期
const SignContractCycle = {
  one: 1, // 一年
  three: 3, // 三年
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.one:
        return '一年';
      case this.three:
        return '三年';
      default:
        return '--';
    }
  },
};

// 合同归属
const ContractBelong = {
  quhuo: 4001, // 趣活
  bodu: 4002, // 伯渡
  changda: 4003, // 盛世昌达
  zhongxin: 4004, // 众鑫
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.quhuo:
        return '趣活';
      case this.bodu:
        return '伯渡';
      case this.changda:
        return '盛世昌达';
      case this.zhongxin:
        return '众鑫';
      default:
        return '未定义';
    }
  },
};

// 合同归属类型
const ContractAttributionType = {
  laborder: 1,
  employee: 3,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.laborder:
        return '劳动者合同甲方';
      case this.employee:
        return '员工合同甲方';
      default:
        return '未定义';
    }
  },
};

// 房屋合同执行状态
const ExpenseHouseContractState = {
  pendding: 1, // 待提交
  verifying: 10, // 审批中
  processing: 50, // 执行中
  done: 100, // 完成
  finish: -100, // 终止
  deleted: -101, // 删除
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.pendding:
        return '草稿';
      case this.verifying:
        return '审批中';
      case this.processing:
        return '执行中';
      case this.done:
        return '完成';
      case this.finish:
        return '终止';
      case this.deleted:
        return '删除';
      default:
        return '未定义';
    }
  },
};

// 房屋合同用途
const ExpenseHouseContractUsage = {
  office: '办公', // 办公
  dormitory: '宿舍', // 宿舍
  warehouse: '仓库', // 仓库
  charging: '充电站', // 充电站
  other: '其他', // 其他
  description(rawValue) {
    switch (rawValue) {
      case this.office:
        return '办公';
      case this.dormitory:
        return '宿舍';
      case this.warehouse:
        return '仓库';
      case this.charging:
        return '充电站';
      case this.other:
        return '其他';
      default:
        return '未定义';
    }
  },
};

// 房屋来源
const ExpenseHouseContractHouseSource = {
  rent: 10, // 自租
  acquisition: 20, // 收购
  other: 1, // 其他
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.rent:
        return '自租';
      case this.acquisition:
        return '收购';
      case this.other:
        return '--';
      default:
        return '未定义';
    }
  },
};

// 房屋合同,房屋审批流对应模板信息
const ExpenseHouseContractTemplate = {
  break: 'break', // 断租
  init: 'init', // 新租、续签
  rent: 'rent', // 续租
  close: 'close', // 退租
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.break:
        return '断租';
      case this.init:
        return '新租、续签';
      case this.rent:
        return '续租';
      case this.close:
        return '退租';
      default:
        return '未定义';
    }
  },
};

// 合同性质类型
const BusinesContractComeNatureType = {
  main: 10, // 主合同
  supplement: 20, // 增补合同
  business: 30, // 商务中心
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.main:
        return '主合同';
      case this.supplement:
        return '增补合同';
      case this.business:
        return '商务中心';
      default:
        return '未定义';
    }
  },
};

// 发票类型
const BusinesContractComeInvoiceType = {
  special: 10, // 增值税专用发票
  ordinary: 20, // 增值税普通发票
  volume: 30, // 通用机打卷式发票
  machine: 40, // 通用机打发票
  building: 50, // 建筑统一发票
  cargo: 60, // 货物运输业增值税专用发票（11%）
  highway: 70, // 公路、内河货物运输业统一发票（7%）
  quota: 80, // 通用定额发票
  place: 90, // 地税发票
  receipt: 100, // 收据
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.special:
        return '增值税专用发票';
      case this.ordinary:
        return '增值税普通发票';
      case this.volume:
        return '通用机打卷式发票';
      case this.machine:
        return '通用机打发票';
      case this.building:
        return '建筑统一发票';
      case this.cargo:
        return '货物运输业增值税专用发票（11%）';
      case this.highway:
        return '公路、内河货物运输业统一发票（7%）';
      case this.quota:
        return '通用定额发票';
      case this.place:
        return '地税发票';
      case this.receipt:
        return '收据';
      default:
        return '--';
    }
  },
};

// 合同版本是否返回
const BusinesContractComeVersionType = {
  yes: true, // 已回
  no: false, // 未回
  description(rawValue) {
    switch (rawValue) {
      case this.yes:
        return '已回';
      case this.no:
        return '未回';
      default:
        '未定义';
    }
  },
};

export {
  ContractEffectiveState, // 合同生效状态
  HistoryContractState, // 历史合同状态
  SignContractType, // 签约类型
  SignContractCycle, // 签约周期
  ContractCycleUnit, // 合同周期单位
  ContractBelong, // 合同归属
  ExpenseHouseContractState, // 房屋合同,执行状态
  ExpenseHouseContractUsage, // 房屋合同,用途
  ExpenseHouseContractHouseSource, // 房屋合同,用途
  ExpenseHouseContractTemplate, // 房屋合同,房屋审批流对应模板信息
  BusinesContractComeNatureType, // 合同性质类型
  BusinesContractComeInvoiceType, // 发票类型
  BusinesContractComeVersionType, // 版本类型
  ContractAttributionType, // 人员管理- 合同归属类型
};

