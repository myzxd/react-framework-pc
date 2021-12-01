import React from 'react';
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
// import Crypto from 'crypto';

import { Unit } from '../define';

// 工具类
class Utils {

  // 下载文件
  static downloadFile = (url = '', name) => {
    if (url === '') {
      alert('下载地址为空，无法下载文件');
      // console.log('DEBUG:下载地址为空，无法下载文件');
      return false;
    }

    let link = window.document.createElement('a');
    link.download = name;
    link.href = url;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    link = null;
  }
  // 返回一个元对象的拷贝，删除那些空字段和空数组字段
  static copyNotEmptyProperty = (obj = {}, ...excpetPropName) => {
    return Object.keys(obj).reduce((accumlaterParam, item) => {
      const accumlater = accumlaterParam;
      if ((Object.hasOwnProperty.call(obj, item) &&
        (obj[item] || obj[item] === 0) &&
        ((Array.isArray(obj[item]) && obj[item].length > 0) ||
          (!Array.isArray(obj[item]) && obj[item] !== '')))
        // 白名单判断
        || (excpetPropName && excpetPropName.indexOf(item) > -1)) {
        accumlater[item] = obj[item];
      }
      return accumlater;
    }, {});
  }

  // 随机字符串（指定长度）
  static cryptoRandomString(len) {
    if (!Number.isFinite(len)) {
      throw new TypeError('Expected a finite number');
    }
    return Array.prototype.map.call(window.crypto.getRandomValues(new Uint8Array(len)), item => item.toString(16)).join('');
  }

  // 判断是否是符合格式的身份证号
  static isProperIdCardNumber(number) {
    if (number.length === 15) {
      return /^\d{8}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}$/i.test(number);
    } else if (/^\d{6}(18|19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(number)) {
      // 加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 17; i++) {
        ai = number[i];
        wi = factor[i];
        sum += ai * wi;
      }
      if (`${parity[sum % 11]}` !== number[17].toUpperCase()) {
        return false;
      }
      return true;
    }
    return false;
  }

  // 判断是否正确的金额
  static isProperMoneyNumber(number) {
    return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(number);
  }

  // 计算请假时长
  static calculationLeaveTime = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const at = 9; // 上午上班时间
    const bt = 1; // 下午上班时间
    const ct = 6; // 下班时间
    const dt = 16;
    const startHours = startTime.getHours();
    const endHours = endTime.getHours();
    if (startHours >= 12 && startHours < 13) {
      startTime.setHours(12);
      startTime.setMinutes(0);
    }
    if (endHours >= 12 && endHours < 13) {
      endTime.setHours(12);
      endTime.setMinutes(0);
    }
    if (startHours === 12 && endHours > 13) {
      startTime.setHours(13);
      startTime.setMinutes(0);
    }
    const startDate = startTime.toLocaleDateString(); // 开始日期
    const endDate = endTime.toLocaleDateString(); // 结束日期
    let res = (endTime - startTime) / 1000 / 3600;

    // 同一天
    if (startDate === endDate) {
      if (startHours < 12 && endHours > 12) {
        res -= bt;
      }
      if ((startHours === 12 && endHours === 13)) {
        res -= bt;
      }
    } else {
      // 相差一天
      res = res - at - ct;
      if (startHours < 12) {
        res -= bt;
      }
      if (endHours > 12) {
        res -= bt;
      }
      if ((startHours === 12 && endHours === 12) || (startHours === 12 && endHours === 13)) {
        res -= bt;
      }
      // 超过一天
      const cDate = (new Date(endDate) - new Date(startDate)) / 3600 / 24 / 1000;
      if (cDate > 1) {
        res -= dt * (cDate - 1);
      }
      if (startHours === 12 && endHours < 12) {
        res -= bt;
      }
    }
    return Number(res).toFixed(1);
  };


  // 判断是否是符合格式的手机号(周婷让写成11位数字)
  static isProperPhoneNumber(number) {
    return /^1[0-9]{10}$/g.test(number);
  }

  // 判断是否是符合格式的三方id(周婷:字母或数字,不限位数)
  static isProperCustomId(number) {
    return /^[a-zA-Z0-9]+$/.test(number);
  }

  // async-validate使用的自定义手机号验证方法
  static asyncValidatePhoneNumber(rule, value) {
    if (is.not.existy(value) || is.empty(value)) {
      return Promise.reject('请输入手机号码');
    }

    if (!(Utils.isProperPhoneNumber(value))) {
      return Promise.reject('请输入正确的手机号码');
    }
    return Promise.resolve();
  }

  // async-validate使用的自定义手机号验证方法
  static asyncValidatePhoneNumberNotRequired(rule, value, callback) {
    if (is.existy(value) && is.not.empty(value) && !(Utils.isProperPhoneNumber(value))) {
      callback('请输入正确的手机号码');
      return;
    }
    callback();
  }

  // async-validata使用的自定义身份证验证方法
  static asyncValidateIdCardNumber(rule, value, callback) {
    if (is.not.existy(value) || is.empty(value)) {
      callback('请输入身份证号');
      return;
    }

    if (!(Utils.isProperIdCardNumber(value))) {
      callback('请输入正确的身份证号');
      return;
    }
    callback();
  }

  // async-validata使用的三方id验证方法
  static asyncValidateCustomId(rule, value, callback) {
    const { required } = rule;
    // 判断数据是否为空
    if (is.not.existy(value) || is.empty(value)) {
      // 判断是否是必填
      if (required) {
        callback('请输入第三方id');
        return;
      }
      callback();
      return;
    }

    if (!(Utils.isProperCustomId(value))) {
      callback('请输入正确的第三方id');
      return;
    }
    callback();
  }

  // 校验更多三方平台商圈id
  static asyncValidateTripartiteId = (rule, value, callback) => {
    if (is.not.existy(value) || is.empty(value) || value.checked === false) {
      callback();
      return;
    }

    if (value.checked && (is.not.existy(value.items) || is.empty(value.items))) {
      callback('请补充商圈ID数据，不补充请关闭开关');
      return;
    }

    value.items.forEach((item) => {
      // 添加更多三方id为空的判断
      if (is.not.existy(item) || is.empty(item) || Object.keys(item).length < 3) {
        callback('请填写完当前数据');
        return;
      }
      if (!(Utils.isProperCustomId(item.id))) {
        callback('请输入正确的第三方id');
      }
    });
    callback();
  }

  // async-validata使用的指标值校验方法
  static asyncValidateOrderVars(unit, shouldValidate = true) {
    return (rule, value, callback) => {
      if (shouldValidate === false || !value) {
        callback();
        return;
      }
      const res = Unit.dynamicValid(value, unit);
      if (res === true) {
        callback();
        return;
      }
      callback(res);
    };
  }

  // 延迟执行
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 删除对象对应的key
  static omit(keys, obj) {
    const res = { ...obj };
    keys.forEach(key => delete res[key]);
    return res;
  }

  // 展示普通字符串，若为空默认显示'--'
  static showPlainText(obj, path, placeholder = '--') {
    const res = dot.get(obj, path, placeholder);
    // dot结果为null时不取placeholder
    if (res === null) {
      return placeholder;
    }
    return res;
  }

  // dot优化
  static dotOptimal(obj, path, placeholder) {
    const res = dot.get(obj, path, placeholder);
    // dot结果为null || '' || undefined 时取placeholder
    if (res === null || res === '' || res === undefined) {
      return placeholder;
    }
    return res;
  }

  // 展示日期，若为空默认显示'--'
  static showDate(obj, path, placeholder = '--') {
    const date = dot.get(obj, path);
    if (typeof date !== 'number') {
      return placeholder;
    }
    return moment(date, 'YYYYMMDD').format('YYYY-MM-DD');
  }
  // 展示日期，若为空默认显示'--'
  static showDateAfter(obj, path, placeholder = '--') {
    const date = dot.get(obj, path);
    if (typeof date !== 'number') {
      return placeholder;
    }
    return moment(date, 'YYYYMMDD').add(1, 'day').format('YYYY-MM-DD');
  }
  // 将规范的枚举对象转换成option，便于下拉使用
  static transOptions(obj, Option, style) {
    const arr = [];
    Object.keys(obj).map((item, index) => {
      if (item !== 'description') {
        // eslint-disable-next-line react/react-in-jsx-scope
        arr.push(<Option value={obj[item]} key={index} style={style}>{obj.description(obj[item])}</Option>);
      }
    });
    return arr;
  }

  // 获取日期表单值
  static getDateFormValue(obj, path) {
    const date = dot.get(obj, path);
    if (typeof date !== 'number') {
      return undefined;
    }
    return moment(date, 'YYYYMMDD');
  }

  // 获取uri地址，切掉多余的参数部分
  static uriFromHash(path = '/') {
    const paramsIndex = path.indexOf('?');
    if (paramsIndex === -1) {
      return path;
    }
    return `/${path.substr(0, paramsIndex)}`;
  }
}

export default Utils;

export const {
  downloadFile,
  copyNotEmptyProperty,
  cryptoRandomString,
  isProperIdCardNumber,
  isProperMoneyNumber,
  calculationLeaveTime,
  isProperPhoneNumber,
  isProperCustomId,
  asyncValidatePhoneNumber,
  asyncValidatePhoneNumberNotRequired,
  asyncValidateIdCardNumber,
  asyncValidateCustomId,
  asyncValidateTripartiteId,
  asyncValidateOrderVars,
  sleep,
  omit,
  showPlainText,
  dotOptimal,
  showDate,
  showDateAfter,
  transOptions,
  getDateFormValue,
  uriFromHash,
} = Utils;
