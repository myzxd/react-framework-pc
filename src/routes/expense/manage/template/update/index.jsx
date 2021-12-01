/**
 * 编辑模版的入口判断页面
 */
import _ from 'lodash';
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Button, message } from 'antd';
import React, { Component } from 'react';

import { authorize } from '../../../../../application';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import {
  ExpenseCostOrderTemplateType,
  ExpenseCostOrderBelong,
  Unit,
  ExpenseCostCenterType,
} from '../../../../../application/define';

import TemplateFormRent from './rent';         // 租房信息模版
import TemplateFormDeposit from './deposit';   // 押金信息模版
import TemplateFormAgency from './agency';     // 中介费信息模版
import TemplateFormBreak from './break';       // 押金损失信息模版
import TemplateFormquit from './quit';         // 退回金额信息模版
import TemplateFormDepositReturn from './depositRefund'; // 退回押金信息模板
import TemplateFormRefund from './refund';     // 报销模版
import HouseInfo from '../../common/houseInfo';    // 房屋信息

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitRequestCounter: 0, // 请求服务器的计数器, 默认为零。计数器为零时，可以进行提交
    };
    this.private = {
      forms: {},     // 跟模版挂钩的表单，用于一次性遍历数据统一提交
      count: 0,
      linkFlag: 0, // 当提交时候有失败的请求不让跳转页面
      recordId: dot.get(props, 'location.query.recordId', ''),
      template: dot.get(props, 'location.query.template', ''),
      rentRecordId: dot.get(props, 'location.query.rentRecordId', ''),             // 房租费用id
      agentRecordId: dot.get(props, 'location.query.agentRecordId', ''),           // 中介费费用id
      pledgeRecordId: dot.get(props, 'location.query.pledgeRecordId', ''),         // 押金费用id
      pledgeLostRecordId: dot.get(props, 'location.query.pledgeLostRecordId', ''), // 押金损失费用id
      isUpdateRule: dot.get(props, 'location.query.isUpdateRule', false),
      costUpdateRule: dot.get(props, 'location.query.costUpdateRule', undefined),
      platform: dot.get(props, 'location.query.platform', undefined),
      platformParam: dot.get(props, 'location.query.platformParam', ''),           // 审批流所属平台
    };
  }

  componentDidMount() {
    const { recordId, rentRecordId, agentRecordId, pledgeRecordId, pledgeLostRecordId } = this.private;
    const isPluginOrder = dot.get(this.props, 'location.query.isPluginOrder', '');
    const orderId = dot.get(this.props, 'location.query.orderId', '');
    const payload = {
      orderId, // 审批单id
    };
    // 是否是外部审批单
    if (isPluginOrder === 'true') {
      payload.isPluginOrder = true;
    }
    if (is.existy(recordId) && is.not.empty(recordId)) {
      this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrderDetail', payload: { recordId, ...payload } });
    }
    if (is.existy(rentRecordId) && is.not.empty(rentRecordId)) {
      this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrderDetail', payload: { rentRecordId, ...payload } });
    }
    if (is.existy(agentRecordId) && is.not.empty(agentRecordId)) {
      this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrderDetail', payload: { agentRecordId, ...payload } });
    }
    if (is.existy(pledgeRecordId) && is.not.empty(pledgeRecordId)) {
      this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrderDetail', payload: { pledgeRecordId, ...payload } });
    }
    if (is.existy(pledgeLostRecordId) && is.not.empty(pledgeLostRecordId)) {
      this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrderDetail', payload: { pledgeLostRecordId, ...payload } });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'expenseCostOrder/resetCostOrderDetail' });
    this.props.dispatch({ type: 'expenseCostOrder/resetRentCostOrderDetail' });
    this.props.dispatch({ type: 'expenseCostOrder/resetAgentCostOrderDetail' });
    this.props.dispatch({ type: 'expenseCostOrder/resetPledgeCostOrderDetail' });
    this.props.dispatch({ type: 'expenseCostOrder/resetPledgeLostCostOrderDetail' });
  }

  // 模版的form组件钩子函数
  onHookForm = (form, key) => {
    if (is.not.existy(key) || is.not.existy(form)) {
      return;
    }

    // 将模版的表单添加到数据中，统一处理提交
    this.private.forms[key] = form;
  }

  // 提交数据
  onSubmit = () => {
    // 差旅报销单的明细项、出差单id
    // const { bizExtraData = {}, bizExtraTravelApplyOrderId } = this.state.costOrderDetail;

    // 差旅费用明细
    // const bizExtra = { ...bizExtraData };

    // 金额换算（分）
    // eslint-disable-next-line guard-for-in
    // for (const i in bizExtra) {
    // bizExtra[i] = Unit.exchangePriceToCent(bizExtra[i]);
    // }

    // 初始失败请求的标示
    this.private.linkFlag = 0;
    const {
      recordId,
      template,
      rentRecordId,
      agentRecordId,
      pledgeRecordId,
      forms,
    } = this.private;
    let totalMoney = 0;
    if (is.empty(forms) || is.not.existy(forms)) {
      return;
    }
    // 提交的数据
    const data = [];
    // 租金、中介、押金项目分摊中子项目的容器，用于同一费用编辑比较子项目的一致性
    const allCostItems = [];
    // 租金、中介、押金成本分摊的成本中心，用于判断子项目是到平台还是城市还是供应商还是商圈
    let allCostCenter = 0;
    // 是否提交
    let isSubmit = true;
    // 当成本分摊设置相同时，跳出循环，不进行后面的判断
    let noCountinue = false;
    // 遍历监听的表单
    Object.keys(forms).forEach((key) => {
      // 获取表单中的数据
      const form = forms[key];
      form.validateFields((err, values) => {
        // 获取各个表单的金额
        totalMoney += values.money;
        // eslint-disable-next-line no-param-reassign
        values.storage_type = 3; // 上传文件的类型
        // 验证成本分摊是否有重复值，获取配置项，及其去重之后的数组
        if (!values.expense) {
          data.push(values);
          return;
        }
        const { costItems, costBelong } = values.expense;
        // 新增成本归属
        const { costAttribution = undefined, costCenterType } = values;

        allCostCenter = values.costCenterType;
        const flag = this.onVerifyExpenseCostItems(values.expense.costItems, costBelong, values.note, costAttribution, costCenterType);
        // 验证表单错误
        if (err) {
          isSubmit = false;
          return;
        }
        if (flag) {
          isSubmit = false;
          return;
        }

        // 房屋校验规则@v8.22.11更新
        if (`${template}` === `${ExpenseCostOrderTemplateType.rent}`) {
          const verifyHouse = this.onVerifyHouseCostItems(values);
          if (verifyHouse) {
            isSubmit = false;
            return;
          }
        }

        // 获取不包含金额的数据数组,通过id、code进行判断，@TODO 后端返回的name与前端选择的name不同
        let originalData = costItems.map(item => _.omit(item, ['cityName', 'platformName', 'vendorName', 'districtName', 'city', 'costCount', 'costCountFlag']));
        if (Number(costBelong) === ExpenseCostOrderBelong.custom) {
          originalData = costItems.map(item => _.omit(item, ['cityName', 'platformName', 'vendorName', 'districtName', 'costCount', 'city', 'costCountFlag']));
        }

        // 获取去重之后的数据
        const laterData = _.uniqWith(originalData, _.isEqual);
        // 判断是否有重复数据，如果有，则return
        if (originalData.length !== laterData.length) {
          isSubmit = false;
          noCountinue = true;
          return message.error(`${values.note}成本分摊不能设置相同的成本归属`);
        }

        data.push(values);
        allCostItems.push(costItems);
      });
    });
    if (noCountinue) {
      return;
    }
    // 当自定义分摊时判断费用金额与分摊金额总额是否一致
    for (const i in data) {
      if (data[i].expense && (`${data[i].expense.costBelong}` === `${ExpenseCostOrderBelong.custom}`)) {
        const money = Unit.exchangePriceToCent(data[i].money);  // 费用金额
        let costCountMoney = 0;               // 分摊金额总和
        costCountMoney = data[i].expense.costItems.reduce((a, b) => {
          return a + Unit.exchangePriceToCent(b.costCount);
        }, 0);
        if (money !== costCountMoney) {
          return message.error('费用金额与分摊金额总和不一致');
        }
      }
    }
    // 房租费用id 、中介费费用id 、押金费用id都存在时判断总金额不能为0
    if (rentRecordId && agentRecordId && pledgeRecordId) {
      if (totalMoney === 0) {
        message.error('租金金额和中介费金额和押金金额之和不能为0！！！');
        return;
      }
    }
    // 当有只有两个成本分摊的时候
    if (allCostItems.length === 2 && this.isEqualCost2(allCostItems, allCostCenter)) {
      message.error('租金、中介费、押金分摊子项目对象必须一致');
      return;
    }
    // 当有三个成本分摊的时候
    if (allCostItems.length === 3 && this.isEqualCost(allCostItems, allCostCenter)) {
      message.error('租金、中介费、押金分摊子项目对象必须一致');
      return;
    }

    // 差旅报销单，需要传入字段（出差单id、差旅单明细项）
    // data[0].bizExtraData = bizExtra;
    // data[0].bizExtraTravelApplyOrderId = bizExtraTravelApplyOrderId;

    const isPluginOrder = dot.get(this.props, 'location.query.isPluginOrder', '');
    // return
    // 判断是否提交服务器，如果表单有错误，则不提交数据
    if (isSubmit) {
      // 暂时只支持提交单条数据
      if (`${template}` === `${ExpenseCostOrderTemplateType.refund}`) {
        // 先设置请求计数为1，后请求服务器
        this.setState({
          submitRequestCounter: 1,
        }, () => {
          // 判断是否是外部审批单
          if (isPluginOrder === 'true') {
            this.props.dispatch({
              type: 'expenseCostOrder/updatePluginAdjustCostMoney',
              payload: {
                orderId: dot.get(this.props, 'location.query.orderId', ''),
                id: recordId,
                record: data[0],
                onSuccessCallback: this.onSuccessCallback,
                onFailureCallback: this.onFailureCallback,
              } });
            return;
          }
          this.props.dispatch({ type: 'expenseCostOrder/updateCostOrder', payload: { id: recordId, record: data[0], onSuccessCallback: this.onSuccessCallback, onFailureCallback: this.onFailureCallback } });
        });
      } else if (`${template}` === `${ExpenseCostOrderTemplateType.rent}`) {
        // 先设置请求计数为数据条数，后请求服务器
        this.setState({
          submitRequestCounter: data.length,
        }, () => {
          data.forEach((item) => {
              // 判断是否是外部审批单
            if (isPluginOrder === 'true') {
              this.props.dispatch({
                type: 'expenseCostOrder/updatePluginAdjustCostMoney',
                payload: {
                  orderId: dot.get(this.props, 'location.query.orderId', ''),
                  id: item.recordId,
                  record: item,
                  onSuccessCallback: this.onSuccessCallback.bind(this, data),
                  onFailureCallback: this.onFailureCallback,
                } });
              return;
            }
            this.props.dispatch({ type: 'expenseCostOrder/updateCostOrder', payload: { id: item.recordId, record: item, onSuccessCallback: this.onSuccessCallback.bind(this, data), onFailureCallback: this.onFailureCallback } });
          });
        });
      }
    }
  }

  // 房屋校验规则
  onVerifyHouseCostItems = (values) => {
    const {
      rentCostOrderDetail = {},
      agentCostOrderDetail = {},
      pledgeCostOrderDetail = {},
      pledgeLostCostOrderDetail = {},
    } = this.props;
    // 表单科目id
    const subject = dot.get(values, 'subject', undefined);

    // 新成本归属
    const costAttribution = dot.get(values, 'costAttribution', undefined);

    // 分摊数组
    const costItems = dot.get(values, 'expense.costItems', []);
    // 租金科目id
    const rentCostAccountingId = dot.get(rentCostOrderDetail, 'costAccountingId', undefined);
    // 中介费科目id
    const agentCostAccountingId = dot.get(agentCostOrderDetail, 'costAccountingId', undefined);
    // 押金科目id
    const pledgeCostAccountingId = dot.get(pledgeCostOrderDetail, 'costAccountingId', undefined);
    // 押金损失科目id
    const pledgeLostCostAccountingId = dot.get(pledgeLostCostOrderDetail, 'costAccountingId', undefined);


    // 租金科目成本中心
    const rentCostCenter = dot.get(rentCostOrderDetail, 'costAccountingInfo.costCenterType', undefined);
    // 中介费科目成本中心
    const agentCostCenter = dot.get(agentCostOrderDetail, 'costAccountingInfo.costCenterType', undefined);
    // 押金科目成本中心
    const pledgeCostCenter = dot.get(pledgeCostOrderDetail, 'costAccountingInfo.costCenterType', undefined);
    // 押金损失科目成本中心
    const pledgeLostCostCenter = dot.get(pledgeLostCostOrderDetail, 'costAccountingInfo.costCenterType', undefined);

    // 成本中心
    let costCenter;
    subject === rentCostAccountingId && (costCenter = rentCostCenter);
    subject === agentCostAccountingId && (costCenter = agentCostCenter);
    subject === pledgeCostAccountingId && (costCenter = pledgeCostCenter);
    subject === pledgeLostCostAccountingId && (costCenter = pledgeLostCostCenter);

    // 供应商
    if (costCenter === ExpenseCostCenterType.headquarter) {
      const filterCostItems = costItems.map(c => c.vendor);
      const dedupCostItems = [...new Set(filterCostItems)];
      if (filterCostItems.length !== dedupCostItems.length) {
        message.error('相同供应商不可进行分摊');
        return true;
      }
    }

    // 城市
    if (costCenter === ExpenseCostCenterType.city) {
      const filterCostItems = costItems.map(c => c.city);
      const dedupCostItems = [...new Set(filterCostItems)];
      if (filterCostItems.length !== dedupCostItems.length) {
        message.error('相同城市不可进行分摊');
        return true;
      }
    }

    // 商圈
    if (costCenter === ExpenseCostCenterType.district) {
      const filterCostItems = costItems.map(c => c.district);
      const dedupCostItems = [...new Set(filterCostItems)];
      if (filterCostItems.length !== dedupCostItems.length) {
        message.error('相同商圈不可进行分摊');
        return true;
      }
    }

    // 团队
    if (costAttribution === ExpenseCostCenterType.team) {
      const filterCostItems = costItems.map(c => c.teamId);
      const dedupCostItems = [...new Set(filterCostItems)];
      if (filterCostItems.length !== dedupCostItems.length) {
        message.error('相同团队不可进行分摊');
        return true;
      }
    }

    return false;
  }

  onVerifyExpenseCostItems = (items = [], costBelong, note, costAttribution, costCenterType) => {
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

    if (Number(costAttribution) === ExpenseCostCenterType.team && costCenterType !== ExpenseCostCenterType.headquarters) {
      verifyKeys.teamType = '团队类型未选择';
      verifyKeys.teamId = '团队未选择';
      verifyKeys.departmentId = '团队未选择';
      // verifyKeys.teamIdCode = '团队ID未选择';
    }

    if (Number(costAttribution) === ExpenseCostCenterType.team && costCenterType === ExpenseCostCenterType.headquarters) {
      verifyKeys.teamId = '团队未选择';
    }

    if (Number(costAttribution) === ExpenseCostCenterType.person) {
      verifyKeys.staffId = '个人信息未选择';
      verifyKeys.jobId = '团队信息未选择';
    }

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
        message.error(`${note}第${index + 1}条分摊明细 : ${verifyKeys.costCount}`);
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
          message.error(`${note}第${index + 1}条分摊明细 : ${verifyKeys[key]}`);
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
  }

  // 获取审批流id
  onGetOrderId = (orderId) => {
    const isPluginOrder = dot.get(this.props, 'location.query.isPluginOrder', '');
      // 外部审批单时
    if (isPluginOrder === 'true') {
      return dot.get(this.props, 'location.query.orderId', '');
    }
    return orderId;
  }

  onSuccessCallback = (data) => {
    const {
      template,
      rentRecordId,
      agentRecordId,
      pledgeRecordId,
      pledgeLostRecordId,
      isUpdateRule,
    } = this.private;
    const {
      costOrderDetail,
      agentCostOrderDetail,
      rentCostOrderDetail,
      pledgeCostOrderDetail,
      pledgeLostCostOrderDetail,
    } = this.props;
    const { submitRequestCounter } = this.state;
    const { approvalKey } = this.props.location.query;

    // 请求计数减少
    const counter = submitRequestCounter - 1;
    this.setState({
      submitRequestCounter: counter,
    });

    let orderId = '';
    // 根据使用的模板不同，选择展示的审批单
    if (`${template}` === `${ExpenseCostOrderTemplateType.refund}`) {
      // 获取审批流id
      orderId = this.onGetOrderId(dot.get(costOrderDetail, 'applicationOrderId'));
    } else if (`${template}` === `${ExpenseCostOrderTemplateType.rent}`) {
      this.private.count += 1;
      if (this.private.count === data.length) {
        if (data[0].recordId === rentRecordId) {
          // 获取审批流id
          orderId = this.onGetOrderId(dot.get(rentCostOrderDetail, 'applicationOrderId'));
        } else if (data[0].recordId === agentRecordId) {
          // 获取审批流id
          orderId = this.onGetOrderId(dot.get(agentCostOrderDetail, 'applicationOrderId'));
        } else if (data[0].recordId === pledgeRecordId) {
          // 获取审批流id
          orderId = this.onGetOrderId(dot.get(pledgeCostOrderDetail, 'applicationOrderId'));
        } else if (data[0].recordId === pledgeLostRecordId) {
          // 获取审批流id
          orderId = this.onGetOrderId(dot.get(pledgeLostCostOrderDetail, 'applicationOrderId'));
        }
        this.private.count = 0;
      }
    }

    if (!orderId) {
      return;
    }
    // 判断是否是金额调整，如果是提交后跳转到审批单详情页面
    if (isUpdateRule === true || isUpdateRule === 1 || isUpdateRule === 'true' || isUpdateRule === '1') {
      window.location.href = `/#/Expense/Manage/ExamineOrder/Detail?orderId=${orderId}&approvalKey=${approvalKey}`;
    } else {
      // 多个请求存在的时候，没有请求失败才跳转
      this.private.linkFlag === 0 && (window.location.href = `/#/Expense/Manage/ExamineOrder/Form?orderId=${orderId}&approvalKey=${approvalKey}`);
    }
  }

  // 失败回调
  onFailureCallback = (e) => {
    const { submitRequestCounter } = this.state;
    // 请求计数减少
    const counter = submitRequestCounter - 1;
    this.setState({
      submitRequestCounter: counter,
    });

    // 请求失败linkFlag自加
    this.private.linkFlag += 1;
    if (e.zh_message) {
      message.error(e.zh_message);
    }
  }

  // 比较租金、中介、押金其中的两个的分摊项目的子项目是否全等
  isEqualCost2 = (array = [], allCostCenter) => {
    const arrayNum1 = array[0];
    const arrayNum2 = array[1];
    if (Number(allCostCenter) === ExpenseCostCenterType.project) {
      const arrA = [];
      const arrB = [];
      arrayNum1.forEach((item) => {
        arrA.push(item.platform);
      });
      arrayNum2.forEach((item) => {
        arrB.push(item.platform);
      });
      if (this.arrayEqual2(arrA, arrB)) {
        return false;
      }
    }
    if (Number(allCostCenter) === ExpenseCostCenterType.headquarter) {
      const arrA = [];
      const arrB = [];
      arrayNum1.forEach((item) => {
        arrA.push(item.vendor);
      });
      arrayNum2.forEach((item) => {
        arrB.push(item.vendor);
      });
      if (this.arrayEqual2(arrA, arrB)) {
        return false;
      }
    }
    if (Number(allCostCenter) === ExpenseCostCenterType.city) {
      const arrA = [];
      const arrB = [];
      arrayNum1.forEach((item) => {
        arrA.push(item.city);
      });
      arrayNum2.forEach((item) => {
        arrB.push(item.city);
      });
      if (this.arrayEqual2(arrA, arrB)) {
        return false;
      }
    }
    if (Number(allCostCenter) === ExpenseCostCenterType.district) {
      const arrA = [];
      const arrB = [];
      arrayNum1.forEach((item) => {
        arrA.push(item.district);
      });
      arrayNum2.forEach((item) => {
        arrB.push(item.district);
      });
      if (this.arrayEqual2(arrA, arrB)) {
        return false;
      }
    }
    if (Number(allCostCenter) === ExpenseCostCenterType.team) {
      const arrA = [];
      const arrB = [];
      arrayNum1.forEach((item) => {
        item.platform && arrA.push(item.platform);
        item.vendor && arrA.push(item.vendor);
        item.city && arrA.push(item.city);
        item.district && arrA.push(item.district);
        arrA.push(item.teamType);
        arrA.push(item.teamIdCode);
      });
      arrayNum2.forEach((item) => {
        item.platform && arrB.push(item.platform);
        item.vendor && arrB.push(item.vendor);
        item.city && arrB.push(item.city);
        item.district && arrB.push(item.district);
        arrB.push(item.teamType);
        arrB.push(item.teamIdCode);
      });
      if (this.arrayEqual2(arrA, arrB)) {
        return false;
      }
    }


    return true;
  }

  // 比较租金、中介、押金三个的分摊项目的子项目是否全等
  isEqualCost = (array = [], allCostCenter) => {
    // 租金所有子项目数组
    const rentArray = array[0];
    // 中介所有子项目数组
    const agencyArray = array[1];
    // 押金所有子项数组
    const depositArray = array[2];
    if (rentArray.length !== agencyArray.length || rentArray.length !== depositArray.length) {
      return true;
    }
    if (Number(allCostCenter) === ExpenseCostCenterType.project) {
      const arrA = [];
      const arrB = [];
      const arrC = [];
      rentArray.forEach((item) => {
        arrA.push(item.platform);
      });
      agencyArray.forEach((item) => {
        arrB.push(item.platform);
      });
      depositArray.forEach((item) => {
        arrC.push(item.platform);
      });
      if (this.arrayEqual(arrA, arrB, arrC)) {
        return false;
      }
    }
    if (Number(allCostCenter) === ExpenseCostCenterType.headquarter) {
      const arrA = [];
      const arrB = [];
      const arrC = [];
      rentArray.forEach((item) => {
        arrA.push(item.vendor);
      });
      agencyArray.forEach((item) => {
        arrB.push(item.vendor);
      });
      depositArray.forEach((item) => {
        arrC.push(item.vendor);
      });
      if (this.arrayEqual(arrA, arrB, arrC)) {
        return false;
      }
    }
    if (Number(allCostCenter) === ExpenseCostCenterType.city) {
      const arrA = [];
      const arrB = [];
      const arrC = [];
      rentArray.forEach((item) => {
        arrA.push(item.city);
      });
      agencyArray.forEach((item) => {
        arrB.push(item.city);
      });
      depositArray.forEach((item) => {
        arrC.push(item.city);
      });
      if (this.arrayEqual(arrA, arrB, arrC)) {
        return false;
      }
    }
    if (Number(allCostCenter) === ExpenseCostCenterType.district) {
      const arrA = [];
      const arrB = [];
      const arrC = [];
      rentArray.forEach((item) => {
        arrA.push(item.district);
      });
      agencyArray.forEach((item) => {
        arrB.push(item.district);
      });
      depositArray.forEach((item) => {
        arrC.push(item.district);
      });
      if (this.arrayEqual(arrA, arrB, arrC)) {
        return false;
      }
    }
    if (Number(allCostCenter) === ExpenseCostCenterType.team) {
      const arrA = [];
      const arrB = [];
      const arrC = [];
      rentArray.forEach((item) => {
        item.platform && arrA.push(item.platform);
        item.vendor && arrA.push(item.vendor);
        item.city && arrA.push(item.city);
        item.district && arrA.push(item.district);
        arrA.push(item.teamType);
        arrA.push(item.teamIdCode);
      });
      agencyArray.forEach((item) => {
        item.platform && arrB.push(item.platform);
        item.vendor && arrB.push(item.vendor);
        item.city && arrB.push(item.city);
        item.district && arrB.push(item.district);
        arrB.push(item.teamType);
        arrB.push(item.teamIdCode);
      });
      depositArray.forEach((item) => {
        item.platform && arrC.push(item.platform);
        item.vendor && arrC.push(item.vendor);
        item.city && arrC.push(item.city);
        item.district && arrC.push(item.district);
        arrC.push(item.teamType);
        arrC.push(item.teamIdCode);
      });

      if (this.arrayEqual(arrA, arrB, arrC)) {
        return false;
      }
    }


    return true;
  }

  // 判断三个数组是否全等（每一个元素都相等）
  arrayEqual = (arrA = [], arrB = [], arrC = []) => {
    const strA = JSON.stringify(arrA.sort());
    const strB = JSON.stringify(arrB.sort());
    const strC = JSON.stringify(arrC.sort());
    return strA === strB && strA === strC;
  }
  // 判断2个数组是否全等（每一个元素都相等）
  arrayEqual2 = (arrA = [], arrB = []) => {
    const strA = JSON.stringify(arrA.sort());
    const strB = JSON.stringify(arrB.sort());
    return strA === strB;
  }

  // 基础信息
  renderBaseInfo = () => {
    const {
      rentRecordId,
      agentRecordId,
      pledgeRecordId,
      pledgeLostRecordId,
      template,
    } = this.private;
    const {
      costOrderDetail,
      agentCostOrderDetail,
      rentCostOrderDetail,
      pledgeCostOrderDetail,
      pledgeLostCostOrderDetail,
    } = this.props;
    // 判断是否是房屋费用单
    const isReset = true;
    let orderDetail = '';
    // 根据不同的模板选择对应的费用单详情信息
    if (`${template}` === `${ExpenseCostOrderTemplateType.refund}`) {
      orderDetail = costOrderDetail;
    } else if (`${template}` === `${ExpenseCostOrderTemplateType.rent}`) {
      if (rentRecordId) {
        orderDetail = rentCostOrderDetail;
      } else if (agentRecordId) {
        orderDetail = agentCostOrderDetail;
      } else if (pledgeRecordId) {
        orderDetail = pledgeCostOrderDetail;
      } else if (pledgeLostRecordId) {
        orderDetail = pledgeLostCostOrderDetail;
      }
    }
    const formItems = [
      {
        label: '费用类型',
        form: dot.get(orderDetail, 'costGroupName', '--'),
      }, {
        label: '申请人',
        form: dot.get(orderDetail, 'applyAccountInfo.name', authorize.account.name),
      },
    ];
    if (orderDetail.bizExtraHouseContractId) {
      formItems.splice(1, 0, {
        label: '合同编号',
        form: orderDetail.bizExtraHouseContractId,
      });
    }
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        {
          orderDetail.bizExtraHouseContractId
          ?
            <HouseInfo
              contractId={dot.get(orderDetail, 'bizExtraHouseContractId', '')}
              isReset={isReset}
            />
          :
          ''
        }
      </CoreContent>
    );
  }

  // 渲染模版内容
  renderTemplates = () => {
    const {
      template,
      rentRecordId,
      agentRecordId,
      pledgeRecordId,
      pledgeLostRecordId,
      isUpdateRule,
      costUpdateRule,
      platform,
      platformParam,
    } = this.private;
    const {
      costOrderDetail,
      rentCostOrderDetail,
      agentCostOrderDetail,
      pledgeCostOrderDetail,
      pledgeLostCostOrderDetail,
    } = this.props;

    const {
      location,
    } = this.props;

    const {
      applicationOrderType,
    } = location.query;

    let components = [];
    // 报销模版需要返回的渲染模块
    if (`${template}` === `${ExpenseCostOrderTemplateType.refund}`) {
      components = [
        { component: TemplateFormRefund, title: '费用信息', props: { isHideHouseNum: true, isUpdateRule: !!isUpdateRule, costUpdateRule, platform: decodeURIComponent(platform) } },
      ];
    }

    // 房屋模板
    if (`${template}` === `${ExpenseCostOrderTemplateType.rent}`) {
      if (rentRecordId) {
        if (agentRecordId || !pledgeLostRecordId) {
          components.push({ component: TemplateFormRent, title: '租金信息' });
        } else {
          components.push({ component: TemplateFormquit, title: '退回金额信息' });
        }
      }
      if (agentRecordId) {
        components.push({ component: TemplateFormAgency, title: '中介费信息' });
      }
      if (pledgeRecordId) {
        if (agentRecordId) {
          components.push({ component: TemplateFormDeposit, title: '押金信息', houseInfo: dot.get(costOrderDetail, 'bizExtraHouseContractInfo', {}) });
        } else {
          components.push({ component: TemplateFormDepositReturn, title: '退回押金信息', isNegative: true });
        }
      }
      if (pledgeLostRecordId) {
        components.push({ component: TemplateFormBreak, title: '押金损失信息' });
      }
    }

    // 渲染模版
    return components.map((item, index) => {
      // 模版渲染需要的参数
      const props = {
        ...item.props,
        titleNote: item.title,
        isPluginOrder: dot.get(location, 'query.isPluginOrder', ''),
        applicationOrderType,
        detail: costOrderDetail,
        rentDetail: rentCostOrderDetail,
        agentDetail: agentCostOrderDetail,
        pledgeDetail: pledgeCostOrderDetail,
        pledgeLostDetail: pledgeLostCostOrderDetail,
        key: index,                   // antd 元素用key
        formKey: `form-${index}`,     // 表单的唯一标示，用于onHookForm
        onHookForm: this.onHookForm,  // 钩子函数
        isNegative: item.isNegative || false, // 分摊金额是否可以为负数
        platformParam,
      };

      return <item.component {...props} />;
    });
  }

  render = () => {
    const { submitRequestCounter } = this.state;
    // const { template } = this.private;
    // 判断模版类型是否非法
    // if (`${template}` !== `${ExpenseCostOrderTemplateType.rent}` && `${template}` !== `${ExpenseCostOrderTemplateType.refund}`) {
    //   return (
    //     <CoreContent title="模版错误">
    //       模版类型参数非法 {template}
    //     </CoreContent>
    //   );
    // }
    return (
      <div>
        {/* 渲染基础信息 */}
        {this.renderBaseInfo()}

        {/* 渲染模版内容 */}
        {this.renderTemplates()}

        {/* 表单提交按钮 */}
        <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
          <Button type="primary" onClick={this.onSubmit} disabled={submitRequestCounter !== 0} >提交</Button>
        </CoreContent>
      </div>
    );
  }
}

function mapStateToProps({ expenseCostOrder }) {
  return {
    costOrderDetail: dot.get(expenseCostOrder, 'costOrderDetail', []),                     // 费用单详情数据
    rentCostOrderDetail: dot.get(expenseCostOrder, 'rentCostOrderDetail', []),             // 房租费用单详情数据
    agentCostOrderDetail: dot.get(expenseCostOrder, 'agentCostOrderDetail', []),           // 中介费费用单详情数据
    pledgeCostOrderDetail: dot.get(expenseCostOrder, 'pledgeCostOrderDetail', []),         // 押金费用单详情数据
    pledgeLostCostOrderDetail: dot.get(expenseCostOrder, 'pledgeLostCostOrderDetail', []), // 押金损失费用单详情数据
  };
}

export default connect(mapStateToProps)(Index);
