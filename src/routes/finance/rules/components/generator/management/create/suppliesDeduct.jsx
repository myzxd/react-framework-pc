/**
 * 服务费规则生成 - 管理组件 - 创建组件 - 物资扣款设置 Finance/Rules/Generator
 */
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Button } from 'antd';
import React, { Component } from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../../components/core';
import { FinanceRulesGeneratorStep, FinanceSalaryDeductionsType, FinanceSalaryKnightTagState } from '../../../../../../../application/define';
import ComponentDeductions from '../common/suppliesDeduct';

import styles from './style/index.less';

const CurrentFinanceRulesGeneratorStep = FinanceRulesGeneratorStep.forth;

const { Option } = Select;

class ComponentSuppliesDeductions extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.private = {
      isSumbit: true, // 防止重复点击
    };
  }

  // 重置函数
  onReset = () => {
    this.props.form.resetFields();
  }

  // 提交函数
  onSubmit = (e) => {
    e.preventDefault();
    const { ruleCollectionId, bizCate } = this.props;
    const { isSumbit } = this.private;
    this.props.form.validateFields((err, values) => {
      // 如果没有错误，并且有回调参数，则进行回调
      if (!err) {
        const params = {
          ...values,
          knightTags: [`${FinanceSalaryKnightTagState.all}`],
          ruleCollectionId,
          bizCate,
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
  onCreateFailureCallback = () => {
    this.private.isSumbit = true;
  }

  // 渲染基础的表单信息
  renderBaseFrom = () => {
    // 绑定表单使用
    const { getFieldDecorator } = this.props.form;
    // 表单内容, 根据业务实现, 基础信息
    const equipment = FinanceSalaryDeductionsType.equipment;
    const formItems = [
      {
        label: '物资扣款项',
        form: getFieldDecorator('bizCateItem', {
          initialValue: `${equipment}`,
          rules: [{ required: true, message: '请选择物资扣款项' }],
        })(
          <Select allowClear placeholder="请选择">
            <Option value={`${equipment}`}>{FinanceSalaryDeductionsType.description(equipment)}</Option>
          </Select>,
        ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
        <ComponentDeductions form={this.props.form} platformCode={this.props.platformCode} />
      </div>
    );
  }

  // 渲染创建物资扣款设置
  renderSuppliesDeduct = () => {
    return (
      <CoreContent title="创建物资扣款设置">
        <Form onSubmit={this.onSubmit}>

          {/* 渲染基础的表单信息 */}
          {this.renderBaseFrom()}

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
        {/* 渲染创建物资扣款设置 */}
        {this.renderSuppliesDeduct()}
      </div>
    );
  }
}

export default connect()(Form.create()(ComponentSuppliesDeductions));
