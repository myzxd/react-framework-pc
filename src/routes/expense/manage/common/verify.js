import is from 'is_js';
import _ from 'lodash';
import {
  message,
} from 'antd';

import {
  Unit,
  ExpenseCostOrderBelong,
} from '../../../../application/define';

// 校验成本分摊
const onVerifyExpenseCostItems = (items = [], costBelong) => {
  if (is.empty(items)) {
    message.error('分摊数据为空');
    return true;
  }
  if (is.not.array(items)) {
    message.error('分摊数据格式错误');
    return true;
  }

  // 项目信息转换
  const verifyKeys = {
    vendor: '分摊信息供应商未选择',      // 供应商id
    platform: '分摊信息平台未选择',     // 平台
    city: '分摊信息城市未选择',         // 城市
    district: '分摊信息商圈未选择',     // 商圈
    costCount: '分摊金额不能为空',     // 分摊金额
  };

  // 是否校验错误
  let isVerifyError = false;
  let flag = false;

  // 因为收款信息可以有多条所以是数组先循环
  items.forEach((item, index) => {
    // 如果已经校验出错误，则不再继续校验。
    if (isVerifyError === true) {
      return;
    }

    // 判断是否为空
    if (is.empty(item)) {
      flag = true;
    }
    if (Number(costBelong) === ExpenseCostOrderBelong.custom && (is.not.existy(item.costCount) || item.costCount === 0)) {
      isVerifyError = true;
      message.error(`第${index + 1}条分摊明细 : ${verifyKeys.costCount}`);
    }

    // 遍历数据中的字段
    Object.keys(item).forEach((key) => {
      // 排除不校验的字段 && 如果已经校验出错误，则不再继续校验。
      if (is.not.existy(verifyKeys[key]) || isVerifyError === true) {
        return;
      }

      // 校验数据是否存在 || 校验数据是否为空
      if (is.not.existy(item[key]) || is.empty(item[key])) {
        // 校验错误
        isVerifyError = true;
        // 提示信息
        message.error(`第${index + 1}条分摊明细 : ${verifyKeys[key]}`);
      }
    });
  });
  if (flag === true) {
    return message.error('分摊数据为空');
  }
  if (isVerifyError === true) {
    return true;
  }
  return false;
};

const onVerify = (values, err) => {
  // 是否可提交
  let isSubmit = true;

  // 表单验证
  if (err) {
    isSubmit = false;
    return;
  }

  if (values.money <= 0) {
    isSubmit = false;
    message.error('费用金额必须大于0');
    return;
  }

  // 验证成本分摊是否有重复值，获取配置项，及其去重之后的数组
  const { costItems, costBelong } = values.expense;
  const flag = onVerifyExpenseCostItems(values.expense.costItems, costBelong);

  if (flag) {
    isSubmit = false;
    return;
  }

  // 获取不包含金额的数据数组,通过id、code进行判断，@TODO 后端返回的name与前端选择的name不同
  let originalData = costItems.map(item => _.omit(item, ['cityName', 'platformName', 'vendorName', 'districtName', 'costCountFlag']));
  if (Number(costBelong) === ExpenseCostOrderBelong.custom) {
    originalData = costItems.map(item => _.omit(item, ['cityName', 'platformName', 'vendorName', 'districtName', 'costCount', 'costCountFlag']));
  }

  // 获取去重之后的数据
  const laterData = _.uniqWith(originalData, _.isEqual);

  // 判断是否有重复数据，如果有，则return
  if (originalData.length !== laterData.length) {
    isSubmit = false;
    return message.error('成本分摊不能设置相同的成本归属');
  }

  // 当自定义分摊时
  if (costBelong === ExpenseCostOrderBelong.custom) {
    // 金额
    const money = Unit.exchangePriceToCent(values.money);

    // 分摊金额总和
    let costCountMoney = 0;

    costCountMoney = costItems.reduce((a, b) => {
      return a + Unit.exchangePriceToCent(b.costCount);
    }, 0);

    if (money !== costCountMoney) {
      return message.error('费用金额与分摊金额总和不一致');
    }
  }

  return isSubmit;
};

export default onVerify;
