import _ from 'lodash';
import is from 'is_js';

// 共享登记 - 合同邮寄状态
const SharedContractMailState = {
  notMail: 10,
  done: 100,
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.notMail: return '未邮寄';
      case this.done: return '已邮寄';
      default: '未定义';
    }
  },
};

// 单位类型定义（1～9为服务器定义，1000以上为本地自定义）
const Unit = {
  weightG: 1001, // 重量单位（克）
  weightKG: 3, // 重量单位（千克）
  distanceM: 1002, // 距离单位（米）
  distanceKM: 4, // 距离单位（千米）
  mathPercent: 5, // 百分比单位（%）
  timeYear: 1003, // 时间单位（年）
  timeMonth: 1004, // 时间单位（月）
  timeDay: 2, // 时间单位（天）
  timeHour: 1005, // 时间单位（小时）
  timeMinute: 7, // 时间单位（分钟）
  timeSecond: 1006, // 时间单位（秒）
  priceYuan: 8, // 价格单位（元）
  customOrder: 1, // 自定义单位（单）
  customStar: 6, // 自定义单位（星）
  customNull: 9, // 自定义单位（无）
  maxMoney: 9999999999, // 最大金额

  description(rawValue) {
    switch (Number(rawValue)) {
      case this.weightG:
        return '克';
      case this.weightKG:
        return '千克';
      case this.distanceM:
        return '米';
      case this.distanceKM:
        return '千米';
      case this.mathPercent:
        return '百分';
      case this.timeYear:
        return '年';
      case this.timeMonth:
        return '月';
      case this.timeDay:
        return '日';
      case this.timeHour:
        return '小时';
      case this.timeMinute:
        return '分钟';
      case this.timeSecond:
        return '秒';
      case this.priceYuan:
        return '元';
      case this.customOrder:
        return '单';
      case this.customStar:
        return '星';
      case this.customNull:
        return '无';
      default:
        return '未定义';
    }
  },

  // 单位符号
  unitSymbol(rawValue) {
    switch (Number(rawValue)) {
      case this.weightG:
        return 'g';
      case this.weightKG:
        return 'kg';
      case this.distanceM:
        return 'm';
      case this.distanceKM:
        return 'km';
      case this.mathPercent:
        return '%';
      case this.timeYear:
        return '年';
      case this.timeMonth:
        return '月';
      case this.timeDay:
        return '天';
      case this.timeHour:
        return '小时';
      case this.timeMinute:
        return '分钟';
      case this.timeSecond:
        return '秒';
      case this.priceYuan:
        return '¥';
      case this.customOrder:
        return '单';
      case this.customStar:
        return '星';
      case this.customNull:
        return '';
      default:
        return '';
    }
  },
  // 合同状态
  ContractState(isDeliver, ownerIsSigned, mailState, isFiled) {
    if (is.boolean(isDeliver) && is.boolean(ownerIsSigned) && is.existy(mailState) && is.boolean(isFiled)) {
      let str = '';
      if (isDeliver) {
        str += '已转交,';
      } else {
        str += '未转交,';
      }

      if (ownerIsSigned) {
        str += '已盖章,';
      } else {
        str += '未盖章,';
      }

      if (mailState) {
        str += `${SharedContractMailState.description(mailState)},`;
      } else {
        str += '未邮寄,';
      }

      if (isFiled) {
        str += '已归档';
      } else {
        str += '未归档';
      }
      return str;
    }
    return '--';
  },

  dynamicValid(value, unit) {
    // 两位小数正则
    const twoDecimal = /^-?\d+(\.\d{1,2})?$/;
    // 三位小数正则
    const threeDecimal = /^-?\d+(\.\d{1,3})?$/;
    switch (Number(unit)) {
      case Unit.timeDay:
        return _.isInteger(value) ? true : '请填写整数';
      case Unit.customOrder:
        return _.isInteger(value) ? true : '请填写整数';
      case Unit.weightG:
        return _.isInteger(value) ? true : '请填写整数';
      case Unit.distanceM:
        return _.isInteger(value) ? true : '请填写整数';
      case Unit.customStar:
        return _.isInteger(value) && value > 0 && value <= 5 ? true : '请填写1~5的整数';
      case Unit.mathPercent:
        return twoDecimal.test(`${value}`) ? true : '请填写最多两位小数';
      case Unit.priceYuan:
        return twoDecimal.test(`${value}`) ? true : '请填写最多两位小数';
      case Unit.weightKG:
        return threeDecimal.test(`${value}`) ? true : '请填写最多三位小数';
      case Unit.distanceKM:
        return threeDecimal.test(`${value}`) ? true : '请填写最多三位小数';
      case Unit.priceWanYuan:
        return threeDecimal.test(`${value}`) ? true : '请填写最多两位小数';
      default:
        return true;
    }
  },

  dynamicExchange(value, unit, toService = true) {
    if (toService) {
      if (!Unit.dynamicValid(value, unit)) {
        throw new TypeError(`${value} is invalid ${unit}`);
      }
      switch (Number(unit)) {
        case Unit.weightKG:
          return Unit.exchangeWeightToGram(value);
        case Unit.distanceKM:
          return Unit.exchangeDistanceToMetre(value);
        case Unit.mathPercent:
          return Unit.exchangePercentToInt(value);
        case Unit.priceYuan:
          return Unit.exchangePriceToCent(value);
        case Unit.priceWanYuan:
          return Unit.exchangePriceToWanCent(value);
        default:
          return value;
      }
    } else {
      switch (Number(unit)) {
        case Unit.weightKG:
          return Unit.exchangeWeightToKilogram(value);
        case Unit.distanceKM:
          return Unit.exchangeDistanceToKilometre(value);
        case Unit.mathPercent:
          return Unit.exchangeIntToPercent(value);
        case Unit.priceYuan:
          return Unit.exchangePriceToYuan(value);
        case Unit.priceWanYuan:
          return Unit.exchangePriceToWanYuan(value);
        default:
          return value;
      }
    }
  },

  // 换算计量单位
  measureCount(rawValue) {
    switch (rawValue) {
      case this.priceYuan:
        return 100; // 价格单位（元）换算／100
      case this.priceWanYuan:
        return 1000000; // 价格单位（万元）换算／100000
      case this.distanceM:
        return 1000; // 距离单位（米）换算／1000
      case this.mathPercent:
        return 100; // 百分比单位(%) 换算／100
      case this.weightG:
        return 1000; // 重量单位(克) 换算 ／1000
      default:
        return 1; // 默认的计量单位是 1，不进行换算
    }
  },

  // 换算小数->整数(避免小数乘导致运算不准确)
  exchangeDecimalToInt(value, unit) {
    return Number(`${value.toFixed(Math.log(unit) / Math.log(10))}`.replace('.', ''));
  },
  // 换算价格, 换算成元
  exchangePriceToYuan(price) {
    return price / Unit.measureCount(Unit.priceYuan);
  },
  // 合同操作状态
  getContractOperateState(isDeliver, mailState) {
    if (!isDeliver) {
      return '未转交';
    }
    if (isDeliver && mailState === 10) {
      return '已转交/未邮寄';
    }
    if (isDeliver && mailState === 100) {
      return '已转交/已邮寄';
    }
    return '--';
  },
  // 换算价格, 换算成分
  exchangePriceToCent(price) {
    return Number(`${price.toFixed(Math.log(Unit.measureCount(Unit.priceYuan)) / Math.log(10))}`.replace('.', ''));
  },
  // 换算价格, 换算成万元
  exchangePriceToWanYuan(price) {
    return price / Unit.measureCount(Unit.priceWanYuan);
  },
  // 换算价格, 换算成万分
  exchangePriceToWanCent(price) {
    return Number(`${price.toFixed(Math.log(Unit.measureCount(Unit.priceWanYuan)) / Math.log(8))}`.replace('.', ''));
  },
  // 千分位分隔符(元)
  exchangePriceToMathFormat(price) {
    // 不等于空，undefined和--时转为金额格式
    if (price !== '--' && price !== '' && price !== undefined) {
      return Number(price).toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
    }
    return price;
  },
  // 千分位分隔符(分)
  exchangePriceCentToMathFormat(price) {
    // 不等于空，undefined和--时转为金额格式
    if (price !== '--' && price !== '' && price !== undefined) {
      return Number(price / Unit.measureCount(Unit.priceYuan)).toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
    }
    return price;
  },
  // 换算距离, 换算成千米
  exchangeDistanceToKilometre(distance) {
    return distance / Unit.measureCount(Unit.distanceM);
  },
  // 换算距离, 换算成米
  exchangeDistanceToMetre(distance) {
    return this.exchangeDecimalToInt(distance, this.measureCount(this.distanceM));
  },
  // 换算质量, 换算成千克
  exchangeWeightToKilogram(weight) {
    return weight / this.measureCount(this.weightG);
  },
  // 换算质量, 换算成克
  exchangeWeightToGram(weight) {
    return this.exchangeDecimalToInt(weight, this.measureCount(this.weightG));
  },
  // 换算百分比, 换算成整数
  exchangePercentToInt(percent) {
    return this.exchangeDecimalToInt(percent, this.measureCount(this.mathPercent));
  },
  // 换算百分比, 换算成百分比
  exchangeIntToPercent(int) {
    return int / this.measureCount(this.mathPercent);
  },
  // 根据小时计算天
  exchangeHourlyCalculationDays(hour) {
    return Number(hour / 8).toFixed(1);
  },
  // 身份证号后8位进行*处理
  exchangeIdentityNumber(value) {
    // 判断是否为空
    if (is.empty(value) || is.not.existy(value)) {
      return value;
    }
    // 身份证号后8位换成*
    return value.replace(/(\d+)(\d{8})/, '$1********');
  },
  // 限制小数的位数（解决用antd InputNumber限制的两位小数，会保存三位小数）
  // parser 属性, 搭配 formatter 一起使用
  limitDecimals(value) {
    const reg = /^(\\-)*(\d+)\.(\d\d).*$/;
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
    } else {
      return '';
    }
  },
  // 最大金额限制
  maxMoneyLimitDecimals(value) {
    const reg = /^(\\-)*(\d+)\.(\d\d).*$/;
    if (typeof value === 'string') {
      if (!isNaN(Number(value))) {
        if (Number(value) < Unit.maxMoney) {
          return value.replace(reg, '$1$2.$3');
        }
        return `${Unit.maxMoney}`.replace(reg, '$1$2.$3');
      }
      return '';
    } else if (typeof value === 'number') {
      if (!isNaN(value)) {
        if (Number(value) < Unit.maxMoney) {
          return String(value).replace(reg, '$1$2.$3');
        }
        return `${Unit.maxMoney}`.replace(reg, '$1$2.$3');
      }
      return '';
    } else {
      return '';
    }
  },

  // 限制antd InputNumber只能输入正整数
  limitPositiveIntegerNumber(value) {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/^(0+)|[^\d]/g, '') : '';
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/^(0+)|[^\d]/g, '') : '';
    } else {
      return '';
    }
  },

  // 限制antd InputNumber只能输入正整数（包含0）
  limitZeroPositiveIntegerNumber(value) {
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(/[^\d]/g, '').replace(/^(0+)/g, '0') : '';
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(/[^\d]/g, '').replace(/^(0+)/g, '0') : '';
    } else {
      return '';
    }
  },

  // 限制antd InputNumber只能输入整数，存在max value
  limitMaxZeroIntegerNumber(value, maxVal) {
    if ((value || value === 0) && maxVal) {
      return value > maxVal ?
        this.limitZeroPositiveIntegerNumber(maxVal) :
        this.limitZeroPositiveIntegerNumber(value);
    } else if (value || value === 0) {
      return this.limitZeroPositiveIntegerNumber(value);
    } else {
      return '';
    }
  },

  // 限制antd InputNumber只能输入正整数，存在max value
  limitMaxPositiveIntegerNumber(value, maxVal) {
    if ((value || value === 0) && maxVal) {
      return value > maxVal ?
        this.limitPositiveIntegerNumber(maxVal) :
        this.limitPositiveIntegerNumber(value);
    } else if (value || value === 0) {
      return this.limitPositiveIntegerNumber(value);
    } else {
      return '';
    }
  },

  // 限制antd InputNumber，存在max & 保留两位小数
  limitMaxDecimals(value, maxVal) {
    if ((value || value === 0) && maxVal) {
      return value > maxVal ?
        this.limitDecimals(maxVal) :
        this.limitDecimals(value);
    } else if (value || value === 0) {
      return this.limitDecimals(value);
    } else {
      return '';
    }
  },

  // 千分位展示，并且现在小数点后两位
  limitDecimalsFormatter(value) {
    const reg = /^(-)*(\d+)\.(\d\d).*$/;
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(reg, '$1$2.$3');
  },
  // 千分位展示，并且现在小数点后两位(最大金额)
  maxMoneyLimitDecimalsFormatter(value) {
    const reg = /^(-)*(\d+)\.(\d\d).*$/;
    if (!isNaN(Number(value))) {
      if (value < Unit.maxMoney) {
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(reg, '$1$2.$3');
      }
      return `${Unit.maxMoney}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(reg, '$1$2.$3');
    }
    return '';
  },
  // 去除千分位的逗号
  limitDecimalsParser(value) {
    const reg = /^(-)*(\d+)\.(\d\d).*$/;
    return `${value}`.replace(/￥\s?|(,*)/g, '').replace(reg, '$1$2.$3');
  },
  // 上传附件支持的后缀名
  uploadFileSuffixs(suffix = '') {
    // 图片后缀集合
    const imgSuffixs = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'webp'];
    // office后缀集合
    const officeSuffixs = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'md'];
    // 压缩包后缀集合
    const compressSuffixs = ['zip', 'rar'];
    // 其他后缀集合
    const otherSuffixs = ['rtf', 'pdf', 'txt', 'csv', 'eml'];
    // 支持上传的文件后缀名集合
    const fileSuffixs = [...imgSuffixs, ...officeSuffixs, ...compressSuffixs, ...otherSuffixs];
    // 判断后缀是否存在，后缀大写转小写
    return fileSuffixs.includes(suffix.toLowerCase());
  },
  uploadFileFormat(format = '') {
    // 支持的格式预览 jpg/jpeg/bmp/png/gif/xlsx/docx/pdf/xls
    const supportFormats = ['PDF', 'JPG', 'jpg', 'JPEG', 'jpeg', 'BMP', 'bmp', 'PNG', 'png', 'GIF', 'gif', 'XLSX', 'xlsx', 'DOCX', 'docx', 'pdf', 'XLS', 'xls'];
    // 不支持的格式预览
    // const notSupportFormats = ['txt', 'webp', 'rtf', 'ppt', 'tiff', 'CSV'];

    return supportFormats.includes(format);
  },

  // 判断当前图片是否支持下载
  imageProcess(fileType) {
    // 支持下载的图片
    const supportDownloadPictures = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];

    if (is.existy(fileType) && is.string(fileType)) {
      // 所有图片类型转成小写
      const formatFileType = fileType.toLocaleLowerCase();
      return supportDownloadPictures.includes(formatFileType);
    }
    return false;
  },

  /**
   * 图片下载到本地
   * @param {string} name 图片名称
   * @param {string} url  图片地址
   * 解决图片资源请求跨域问题
   */
  downloadWithBlob(name, url) {
    /* 常见资源类型
    1.excel: type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    2.图片: type = "image/*"
    3.视频: type = "video/*"
    4.音频: type = "audio/*"
    */
    window.fetch(url, {
      mode: 'cors',
    }).then((response) => {
      // 拿到arrayBuffer 转化为 blob 生成链接  通过a标签打开
      response.arrayBuffer().then((res) => {
        const type = 'image/*'; // 资源类型
        // eslint-disable-next-line no-undef
        const blob = new Blob([res], {
          type,
        });
        const objectUrl = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        window.document.body.appendChild(a);
        a.style = 'display: none';
        a.href = objectUrl;
        a.download = name;
        a.click();
        window.document.body.removeChild(a);
      });
    });
  },

};

export default Unit;
