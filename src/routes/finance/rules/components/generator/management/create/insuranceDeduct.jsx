/**
 * 服务费规则生成 - 管理组件 - 创建组件 - 创建保险扣款设置 Finance/Rules/Generator
 */
import is from 'is_js';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Button, Input, message } from 'antd';
import React, { Component } from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../../components/core';
import { FinanceRulesGeneratorStep, FinanceSalaryDeductionsType } from '../../../../../../../application/define';
import ComponentInsuranceForm from '../common/InsuranceForm';

import styles from './style/index.less';

const { Option } = Select;

const CurrentFinanceRulesGeneratorStep = FinanceRulesGeneratorStep.forth;

class ComponentInsuranceDeductions extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.private = {
      isSumbit: true, // 防止重复点击
    };
  }

  // 定义调用子组件函数
  onRef = (ref) => {
    this.child = ref; // 定义一个子组件变量
  }

  // 重置函数
  onReset = () => {
    // 重置表单数据
    this.props.form.resetFields();
    this.child.onResetalaryIndicators(); // 调用子组件操作，清空子组件指标名称
  }

  // 提交函数
  onSubmit = (e) => {
    e.preventDefault();
    const { ruleCollectionId, bizCate, platformCode } = this.props;
    const { isSumbit } = this.private;
    this.props.form.validateFields((err, values) => {
      // 如果没有错误，并且有回调参数，则进行回调
      if (!err) {
        // 判断是否是按月扣款，扣款金额不能为空
        if (values.monthFlag === true &&
          (is.not.existy(values.decMoney) || is.empty(values.decMoney))) {
          return message.error('操作失败，扣款金额不能为空');
        }
        const params = {
          ...values,
          ruleCollectionId,
          bizCate,
          platformCode,
          step: CurrentFinanceRulesGeneratorStep,
          onSuccessCallback: this.onCreateSuccessCallback,
          onFailureCallback: this.onCreateFailureCallback,
        };
        // 防止重复提交
        if (isSumbit) {
          this.props.dispatch({ type: 'financeRulesGenerator/createRulesGeneratorSteps', payload: params });
          this.private.isSumbit = false;
        }
      }
    });
  }

  // 创建成功回调
  onCreateSuccessCallback = () => {
    // 重置
    this.onReset();
    const { dispatch, ruleCollectionId } = this.props;
    dispatch({
      type: 'financeRulesGenerator/fetchRulesGeneratorList',
      payload: {
        ruleCollectionId,
        step: CurrentFinanceRulesGeneratorStep,
      },
    });
    this.private.isSumbit = true;
  }

  // 创建失败回调
  onCreateFailureCallback = (result) => {
    this.private.isSumbit = true;
    // 失败会回调
    if (result.zh_message) {
      return message.error(result.zh_message);
    }
  }

  // 渲染保险扣款基础的表单信息
  renderInsuranceFrom = () => {
    const { getFieldDecorator } = this.props.form;
    const { computeLogic } = this.state;
    const insurance = FinanceSalaryDeductionsType.insurance;
    const formItems = [
      {
        label: '保险扣款项',
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('bizCateItem', {
          initialValue: `${insurance}`,
          rules: [{ required: true, message: '请选择保险扣款项' }],
        })(
          <Select allowClear placeholder="请选择">
            <Option value={`${insurance}`}>{FinanceSalaryDeductionsType.description(insurance)}</Option>
          </Select>,
        ),
      },
      {
        label: '险种',
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('bizCateItemNote', {
          rules: [{ required: true, message: '请选择险种' }],
        })(
          <Input placeholder="请选择险种" />,
        ),
      },
    ];
    const props = {
      form: this.props.form,
      tags: this.props.tags,
      platformCode: this.props.platformCode,
      computeLogic,
      onRef: this.onRef,
    };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={4} />
        <ComponentInsuranceForm {...props} />
      </div>
    );
  }

  // 渲染创建保险扣款设置
  renderInsuranceDeductions = () => {
    return (
      <CoreContent title="创建保险扣款设置">
        <Form onSubmit={this.onSubmit}>

          {/* 渲染保险扣款基础的表单信息 */}
          {this.renderInsuranceFrom()}

          {/* 表单提交按钮 */}
          <div className={styles['app-comp-finance-management-create-button-wrap']}>
            <Button onClick={this.onReset}>清空</Button>
            <Button
              type="primary"
              htmlType="submit"
              className={styles['app-comp-finance-management-create-button']}
            >
              创建
            </Button>
          </div>
        </Form>
      </CoreContent>
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染创建保险扣款设置 */}
        {this.renderInsuranceDeductions()}
      </div>
    );
  }
}

export default connect()(Form.create()(ComponentInsuranceDeductions));
