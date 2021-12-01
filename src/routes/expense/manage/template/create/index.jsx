/**
 * 创建模版的入口判断页面
 */
import _ from 'lodash';
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Button, message } from 'antd';
import React, { Component } from 'react';

import { authorize } from '../../../../../application';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { ExpenseCostOrderTemplateType, ExpenseCostOrderBelong, Unit, ExpenseCostCenterType } from '../../../../../application/define';

import TemplateFormRent from './rent';     // 租房模版
import TemplateFormRefund from './refund'; // 报销模版

class Index extends Component {
  constructor(props) {
    super(props);
    const expenseTypeId = dot.get(props, 'location.query.expenseTypeId', '');
    const expenseTypeName = dot.get(props, 'location.query.expenseTypeName', '');
    const orderId = dot.get(props, 'location.query.orderId', '');
    const template = dot.get(props, 'location.query.template', '');
    const platform = dot.get(props, 'location.query.platform', '');

    this.state = {
      orderId,          // 审批单id
      template,         // 模版类型
      expenseTypeId,    // 费用分组id
      expenseTypeName,  // 费用分组名称
      platform, // 平台（用于提交成本归属为个人的费用单）
    };
    this.private = {
      forms: {},     // 跟模版挂钩的表单，用于一次性遍历数据统一提交
      isSubmit: true, // 防止多次提交
    };
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
    const { orderId, expenseTypeId, template } = this.state;
    const { forms } = this.private;

    if (is.empty(forms) || is.not.existy(forms)) {
      return;
    }

    // 提交的数据
    const data = [];
    // 是否提交
    let isSubmit = true;
    // 遍历监听的表单
    Object.keys(forms).forEach((key, index) => {
      // 获取表单中的数据
      const form = forms[key];
      form.validateFields((err, values) => {
        // 验证成本分摊是否有重复值，获取配置项，及其去重之后的数组
        const { expense = {} } = values;
        const { costItems = [], costBelong } = expense;
        const { costAttribution = undefined, costCenterType = undefined } = values;
        // 校验
        const flag = this.onVerifyExpenseCostItems(costItems, costBelong, costAttribution, costCenterType);

        if (values.money <= 0) {
          isSubmit = false;
          message.error('费用金额必须大于0');
        }
        // 验证表单错误
        if (err) {
          isSubmit = false;
          return;
        }
        if (flag) {
          isSubmit = false;
          return;
        }
        // 获取不包含金额的数据数组,通过id、code进行判断，@TODO 后端返回的name与前端选择的name不同
        let originalData = costItems.map(item => _.omit(item, ['cityName', 'platformName', 'vendorName', 'districtName']));
        if (Number(costBelong) === ExpenseCostOrderBelong.custom) {
          originalData = costItems.map(item => _.omit(item, ['cityName', 'platformName', 'vendorName', 'districtName', 'costCount']));
        }
        // 获取去重之后的数据
        const laterData = _.uniqWith(originalData, _.isEqual);

        // 判断是否有重复数据，如果有，则return
        if (originalData.length !== laterData.length) {
          isSubmit = false;
          return message.error('成本分摊不能设置相同的成本归属');
        }
        const params = values;
        params.expenseType = expenseTypeId;   // 费用分组
        params.orderId = orderId;             // 汇总的数据id
        params.template = template[index];
        params.storage_type = 3; // 上传文件的类型
        data.push(params);
      });
    });
    // 当自定义分摊时
    if (`${dot.get(data, '0.expense.costBelong')}` === `${ExpenseCostOrderBelong.custom}`) {
      const money = Unit.exchangePriceToCent(data[0].money);  // 费用金额
      let costCountMoney = 0;               // 分摊金额总和
      costCountMoney = data[0].expense.costItems.reduce((a, b) => {
        return a + Unit.exchangePriceToCent(b.costCount);
      }, 0);
      if (money !== costCountMoney) {
        return message.error('费用金额与分摊金额总和不一致');
      }
    }

    // 判断是否提交服务器，如果表单有错误，则不提交数据 防止多次提交
    if (isSubmit && this.private.isSubmit) {
      this.props.dispatch({
        type: 'expenseCostOrder/createCostOrder',
        payload: {
          orderId,
          expenseTypeId,
          records: data,
          onSuccessCallback: this.onSuccessCallback,
          onFailureCallback: this.onFailureCallback,
        },
      });
      this.private.isSubmit = false;
    }
  }

  onVerifyExpenseCostItems = (items = [], costBelong, costAttribution, costCenterType) => {
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
    }

    // 总部
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
  }

  // 创建成功回调函数，跳转到审批单提交页面
  onSuccessCallback = () => {
    const { orderId } = this.state;
    const { approvalKey } = this.props.location.query;
    if (orderId) {
      window.location.href = `/#/Expense/Manage/ExamineOrder/Form?orderId=${orderId}&approvalKey=${approvalKey}`;
    }
  }

  // 失败回调函数，开启防止多次提交
  onFailureCallback = (res) => {
    // 开启防止多次提交
    this.private.isSubmit = true;
    message.error(res.zh_message);
  }

  // 基础信息
  renderBaseInfo = () => {
    const { expenseTypeName } = this.state;
    const formItems = [
      {
        label: '费用分组',
        form: expenseTypeName,
      }, {
        label: '申请人',
        form: authorize.account.name,
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染模版内容
  renderTemplates = () => {
    const { expenseTypeId, template, platform } = this.state;
    const { location } = this.props;
    const {
      applicationOrderType,
    } = location.query;
    let components = [];
    // 报销模版需要返回的渲染模块
    if (`${template}` === `${ExpenseCostOrderTemplateType.refund}`) {
      components = [
        { component: TemplateFormRefund, title: '费用信息', props: { isHideHouseNum: true, platform: decodeURIComponent(platform) } },
      ];
    }

    // 租房模版需要返回的渲染模块
    if (`${template}` === `${ExpenseCostOrderTemplateType.rent}`) {
      components = [
        { component: TemplateFormRent, title: '房租信息' },
        { component: TemplateFormRefund, title: '中介费信息', props: { isHideHouseNum: true } },
        { component: TemplateFormRefund, title: '押金信息', props: { isHideHouseNum: true } },
      ];
    }

    // NOTE：如添加新模版类型支持，只需要在 ExpenseCostOrderTemplateType 中添加后处理即可

    // 渲染模版
    return components.map((item, index) => {
      // 模版渲染需要的参数
      const props = {
        ...item.props,
        expenseTypeId,                // 费用分组id
        platform: decodeURIComponent(platform), // 审批流平台
        key: index,                   // antd 元素用key
        applicationOrderType, // 审批单类型
        formKey: `form-${index}`,     // 表单的唯一标示，用于onHookForm
        onHookForm: this.onHookForm,  // 钩子函数
      };

      return <item.component {...props} />;
    });
  }

  render = () => {
    const { template } = this.state;
    // 判断模版类型是否非法
    if (`${template}` !== `${ExpenseCostOrderTemplateType.rent}` && `${template}` !== `${ExpenseCostOrderTemplateType.refund}`) {
      return (
        <CoreContent title="模版错误">
          模版类型参数非法 {template}
        </CoreContent>
      );
    }

    return (
      <div>
        {/* 渲染基础信息 */}
        {this.renderBaseInfo()}

        {/* 渲染模版内容 */}
        {this.renderTemplates()}

        {/* 表单提交按钮 */}
        <CoreContent style={{ textAlign: 'center', backgroundColor: '#ffffff' }} >
          <Button type="primary" onClick={this.onSubmit} >提交</Button>
        </CoreContent>
      </div>
    );
  }
}

export default connect()(Index);
