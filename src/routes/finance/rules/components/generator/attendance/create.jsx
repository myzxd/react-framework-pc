/**
 * 服务费规则生成 - 出勤组件 - 创建组件 Finance/Rules/Generator
 */
import is from 'is_js';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Button, message } from 'antd';
import React, { Component } from 'react';

import { CoreContent, DeprecatedCoreForm, CoreSelect } from '../../../../../../components/core';
import RuleFromComponent from './components/ruleFrom';
import {
  FinanceQualityStaffOnDuty,
  FinanceKnightClassification,
  FinanceRulesGeneratorStep,
  FinanceSalaryKnightTagState,
} from '../../../../../../application/define';

import styles from './style/index.less';

const Option = Select.Option;
const CurrentFinanceRulesGeneratorStep = FinanceRulesGeneratorStep.second;

class AttendanceCreateComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: props.key ? props.key : '',  // 当前组件的key值，预留，用于标示使用
      computeLogic: { byOnceParams: { decUnitAmount: 1 }, byOrderUnitParams: { incUnitAmount: 1 } }, // 天数
    };
    this.private = {
      isSumbit: true, // 防止重复点击
    };
  }

  // 重置函数
  onReset = () => {
    this.setState({
      computeLogic: { byOnceParams: { decUnitAmount: 1 }, byOrderUnitParams: { incUnitAmount: 1 } }, // 天数
    });
    this.props.form.resetFields();
  }

  // 校验满足条件
  onCheckAttendanceIndexValueRules = (data = []) => {
    // 判断格式是否错误
    if (is.not.array(data)) {
      return message.error('满足条件的数据格式错误');
    }
    let flag = false;
      // 遍历数据中
    data.forEach((item) => {
      // 判断是否为空
      if (is.empty(item)) {
        flag = true;
        return;
      }
        // 遍历数据中的子项
      const isFlag = Object.keys(item).some(key => is.not.existy(item[key]) || is.empty(item[key]));
      // 判断是否为空
      if (isFlag === true) {
        flag = true;
        return true;
      }
    });
    return flag;
  }


  // 提交函数
  onSubmit = (e) => {
    e.preventDefault();
    const { isSumbit } = this.private;
    this.props.form.validateFields((err, values) => {
      // 如果没有错误，并且有回调参数，则进行回调
      if (!err) {
        const { computeLogic } = this.state;
        const { decUnitAmount } = computeLogic.byOnceParams;
        const { incUnitAmount } = computeLogic.byOrderUnitParams;
        const { orderVars } = values;
        const flag = this.onCheckAttendanceIndexValueRules(orderVars.rules);
        if (is.empty(orderVars.rules[0]) || flag === true) {
          return message.error('满足条件请填写完整');
        }
        const params = {
          ...values,
          type: 'compose',
          ruleCollectionId: this.props.ruleCollectionId, // 服务费规则集id
          step: CurrentFinanceRulesGeneratorStep, // 步骤
          platformCode: this.props.platformCode,
          decUnitAmount, // 第几天
          incUnitAmount, // 每x单
          onSuccessCallback: this.onCreateSuccessCallback, // 成功回调
          onFailureCallback: this.onCreateFailureCallback, // 失败回调
          knightType: [`${FinanceKnightClassification.all}`],  // 骑士分类: v6.4.0 默认选中全部
          knightTags: [`${FinanceSalaryKnightTagState.all}`],  // 骑士标签: v6.4.0 默认选中全部
        };
        // 防止重复提交
        if (isSumbit) {
          // 调用服务器
          this.props.dispatch({ type: 'financeRulesGenerator/createRulesGeneratorSteps', payload: { ...params } });
          this.private.isSumbit = false;
        }
      }
    });
  }

  // 改变天
  onConfirmBtnDay = (decUnitAmount) => {
    const { computeLogic } = this.state;
    computeLogic.byOnceParams.decUnitAmount = decUnitAmount;
    this.setState({
      computeLogic, // 天
    });
  }

  // 改变每x单
  onConfirmIncUnitAmount = (e) => {
    const { computeLogic } = this.state;
    computeLogic.byOrderUnitParams.incUnitAmount = e;
    this.setState({
      computeLogic, // 天
    });
  }

  // 创建成功回调
  onCreateSuccessCallback = () => {
    // 重置
    this.onReset(); // 成功之后清空
    const { dispatch, ruleCollectionId } = this.props;
    dispatch({
      type: 'financeRulesGenerator/fetchRulesGeneratorList',
      payload: {
        ruleCollectionId,
        step: CurrentFinanceRulesGeneratorStep,
      },
    });
    // 放开重复提交
    this.private.isSumbit = true;
  }

  // 失败回调
  onCreateFailureCallback = (result) => {
    // 放开重复提交
    this.private.isSumbit = true;

    // 失败会回调
    if (result.zh_message) {
      return message.error(result.zh_message);
    }
  }

  // 渲染基础的表单信息
  renderBaseFrom = () => {
    // 绑定表单使用
    const { getFieldDecorator } = this.props.form;
    const { computeLogic } = this.state;
    const { platformCode } = this.props;
    // TODO: initialValue属性换行
    // 表单内容, 根据业务实现, 基础信息
    const formItemsOne = [
      {
        label: '骑士分类',
        form: FinanceKnightClassification.description(FinanceKnightClassification.all),
      },
      {
        label: '骑士标签',
        form: FinanceSalaryKnightTagState.description(FinanceSalaryKnightTagState.all),
      },
      {
        label: '当月在离职',
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: getFieldDecorator('state', { rules: [
                { required: true, message: '请选择' },
        ],
          initialValue: [`${FinanceQualityStaffOnDuty.all}`],
        })(
          <CoreSelect
            allowClear
            placeholder="请选择"
            mode="multiple"
            showArrow
          >
            <Option
              value={`${FinanceQualityStaffOnDuty.all}`}
            >
              {FinanceQualityStaffOnDuty.description(FinanceQualityStaffOnDuty.all)}
            </Option>
            <Option
              value={`${FinanceQualityStaffOnDuty.on}`}
            >
              {FinanceQualityStaffOnDuty.description(FinanceQualityStaffOnDuty.on)}
            </Option>
            <Option
              value={`${FinanceQualityStaffOnDuty.no}`}
            >
              {FinanceQualityStaffOnDuty.description(FinanceQualityStaffOnDuty.no)}
            </Option>
          </CoreSelect>,
        ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 8 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItemsOne} cols={3} layout={layout} />
        <RuleFromComponent
          form={this.props.form}
          computeLogic={computeLogic}
          onConfirmBtnDay={this.onConfirmBtnDay}
          onConfirmIncUnitAmount={this.onConfirmIncUnitAmount}
          platformCode={platformCode}
        />
      </div>
    );
  }

  // 渲染创建
  render = () => {
    return (
      <CoreContent title="创建出勤补贴规则">
        <Form onSubmit={this.onSubmit}>

          {/* 渲染基础的表单信息 */}
          {this.renderBaseFrom()}

          {/* 表单提交按钮 */}
          <div className={styles['app-comp-finance-attendance-create-button-wrap']}>
            <Button onClick={this.onReset}>清空</Button>
            <Button
              type="primary"
              htmlType="submit"
              className={styles['app-comp-finance-attendance-create-button']}
            >
              创建
            </Button>
          </div>
        </Form>
      </CoreContent>
    );
  }
}


export default connect()(Form.create()(AttendanceCreateComponent));
