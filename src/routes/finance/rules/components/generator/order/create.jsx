/**
 * 服务费规则生成 - 单量组件 - 创建组件 Finance/Rules/Generator
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Radio, Button, message, Tooltip, Input } from 'antd';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import {
  SalaryMonthState,
  SalaryStationLevel,
  SalaryExtractType,
  FinanceRulesGeneratorStep,
  FinanceKnightClassification,
  FinanceSalaryKnightTagState,
} from '../../../../../../application/define';
import ExtractRule from './common/extractRule';   // 单量规则加减组件
import ComponentSalaryIndicators from '../../common/salaryIndicators';

import styles from './style/index.less';

const { Option } = Select;
const RadioGroup = Radio.Group;

class OrderCreateComponent extends Component {
  static propTypes = {
    platformCode: PropTypes.string,      // 平台code
    ruleCollectionId: PropTypes.string,  // 服务费方案规则集id
  }
  constructor(props) {
    super(props);
    this.state = {
      type: `${SalaryExtractType.segmentation}`,                  // 方案提成类型
    };
    this.private = {
      isSumbit: true, // 防止重复点击
    };
  }

  // 重置函数
  onReset = () => {
    // 重置表单数据，如果有自定义的数据需要重置，在此处理
    this.props.form.resetFields();
  }

  // 提交函数
  onSubmit = (e) => {
    e.preventDefault();
    const { ruleCollectionId } = this.props;
    const { isSumbit } = this.private;

    this.props.form.validateFields((err, values) => {
      const rangeTable = values.rangeTable;
      // 如果没有错误，并且有回调参数，则进行回调
      if (err) return;
      if (!rangeTable) return message.error('请检查方案提成规则（结束单量应大于起始单量）');
      // eslint-disable-next-line no-plusplus
      for (let k = 0; k < rangeTable.length; k++) {
        if (rangeTable[k].max - rangeTable[k].min <= 0 || !rangeTable[k].max) {
          return message.error('请检查方案提成规则（结束单量应大于起始单量）');
        }
        if (k !== rangeTable.length - 1 && k !== 0 && rangeTable[k].max - rangeTable[k - 1].max <= 0) {
          return message.error('请检查方案提成规则区间设置的合理性（每个区间规则的第二个值必须大于前一个规则区间第二个值）');
        }
      }

      const payload = {
        ...values,
        platformCode: this.props.platformCode,
        step: FinanceRulesGeneratorStep.first,
        ruleCollectionId,
        onSuccessCallback: this.onCreateSuccessCallback,
        onFailureCallback: this.onCreateFailureCallback,
        // knightType: [`${FinanceKnightClassification.all}`],  // 骑士分类: v6.4.0 默认选中全部
        // knightTags: [`${FinanceSalaryKnightTagState.all}`],  // 骑士标签: v6.4.0 默认选中全部
      };
      // 防止重复点击
      if (isSumbit) {
        this.props.dispatch({ type: 'financeRulesGenerator/createRulesGeneratorSteps', payload });
        this.private.isSumbit = false;
      }
    });
  }

  // 创建成功回调
  onCreateSuccessCallback = () => {
    const { ruleCollectionId } = this.props;
    this.onReset(); // 成功之后清空
    this.props.dispatch({
      type: 'financeRulesGenerator/fetchRulesGeneratorList',
      payload: {
        ruleCollectionId,
        step: FinanceRulesGeneratorStep.first,
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

  // 回调函数
  onChange = (state) => {
    const { onChange } = this.state;
    this.setState(state);

    // 调用上级回调
    if (onChange) {
      onChange(state);
    }
  }

  // 更改方案提成
  onChangeExtractType = (e) => {
    const value = e.target.value;
    // 重置extractRule
    this.props.form.resetFields(['rangeTable']);
    const state = {
      type: value,  // 方案提成
    };
    this.onChange(state);
  }

  // 渲染基础的表单信息
  renderBaseFrom = () => {
    const { platformCode } = this.props;
    const { getFieldDecorator } = this.props.form;

    // 表单内容, 根据业务实现, 基础信息（详情中不可修改
    // 骑士分类和骑士标签: v6.4.0 默认选中全部
    const formItems = [
      {
        label: '结算指标',
        form: getFieldDecorator('orderType', {
          rules: [{ required: true, message: '请选择' }],
        })(
          <ComponentSalaryIndicators
            platformCode={platformCode}
            tagList={[FinanceRulesGeneratorStep.first]}
            className={styles['app-comp-finance-generator-order-from']}
          />,
          ),
      },
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
        form: getFieldDecorator('state', {
          initialValue: [`${SalaryMonthState.all}`],
          rules: [{ required: true, message: '请选择' }],
        })(
          <Select allowClear placeholder="请选择" showArrow mode="multiple">
            <Option value={`${SalaryMonthState.all}`}>{SalaryMonthState.description(SalaryMonthState.all)}</Option>
            <Option value={`${SalaryMonthState.incumbent}`}>{SalaryMonthState.description(SalaryMonthState.incumbent)}</Option>
            <Option value={`${SalaryMonthState.resignation}`}>{SalaryMonthState.description(SalaryMonthState.resignation)}</Option>
          </Select>,
          ),
      },
      {
        label: '站点评星',
        form: getFieldDecorator('stationLevel', {
          initialValue: [`${SalaryStationLevel.all}`],
          rules: [{ required: true, message: '请选择' }],
        })(
          <Select allowClear placeholder="请选择" showArrow mode="multiple">
            <Option value={`${SalaryStationLevel.all}`}>{SalaryStationLevel.description(SalaryStationLevel.all)}</Option>
            <Option value={`${SalaryStationLevel.first}`}>{SalaryStationLevel.description(SalaryStationLevel.first)}</Option>
            <Option value={`${SalaryStationLevel.second}`}>{SalaryStationLevel.description(SalaryStationLevel.second)}</Option>
            <Option value={`${SalaryStationLevel.third}`}>{SalaryStationLevel.description(SalaryStationLevel.third)}</Option>
            <Option value={`${SalaryStationLevel.four}`}>{SalaryStationLevel.description(SalaryStationLevel.four)}</Option>
            <Option value={`${SalaryStationLevel.fives}`}>{SalaryStationLevel.description(SalaryStationLevel.fives)}</Option>
          </Select>,
          ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 渲染额外的表单信息
  renderRuleFrom = () => {
    const { type } = this.state;
    const { platformCode } = this.props;
    // 绑定表单使用
    const { getFieldDecorator } = this.props.form;
    const indexId = this.props.form.getFieldValue('orderType');

    // 表单内容, 根据业务实现, 额外信息（详情中可修改）
    const formItems = [
      {
        label: '方案提成',
        form: getFieldDecorator('type', {
          initialValue: `${SalaryExtractType.segmentation}`,
          rules: [{ required: true, message: '请选择方案提成' }],
        })(
          <RadioGroup onChange={this.onChangeExtractType}>
            <Radio value={`${SalaryExtractType.segmentation}`}>
              {SalaryExtractType.description(SalaryExtractType.segmentation)}
              <Tooltip title="单段金额=各区间段单量x单价，总值为各区间段相加">
                <QuestionCircleOutlined className={styles['app-comp-finance-generator-order-from-tooltip']} />
              </Tooltip>
            </Radio>
            <Radio value={`${SalaryExtractType.change}`}>
              {SalaryExtractType.description(SalaryExtractType.change)}
              <Tooltip title="单段金额=区间段单量x单价，总值为单量符合的单段金额">
                <QuestionCircleOutlined className={styles['app-comp-finance-generator-order-from-tooltip']} />
              </Tooltip>
            </Radio>
          </RadioGroup>,
        ),
      },
    ];
    const formItemsMark = [
      {
        label: '结算单对应列',
        form: getFieldDecorator('payrollMark', {
          initialValue: '',
        })(
          <Input placeholder="请输入结算单对应列(可选)" />,
          ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />

        {/* 单量规则 */}
        {
          getFieldDecorator('rangeTable')(
            <ExtractRule indexId={indexId} extractType={type} platformCode={platformCode} />,
          )
        }

        <DeprecatedCoreForm items={formItemsMark} cols={3} layout={layout} />
      </div>
    );
  }

  // 渲染
  render = () => {
    return (
      <CoreContent title="创建单量提成规则">
        <Form onSubmit={this.onSubmit}>

          {/* 渲染基础的表单信息 */}
          {this.renderBaseFrom()}

          {/* 渲染额外的表单信息 */}
          {this.renderRuleFrom()}

          {/* 表单提交按钮 */}
          <div className={styles['app-comp-finance-generator-order-create-button-wrap']}>
            <Button onClick={this.onReset}>清空</Button>
            <Button type="primary" htmlType="submit" className={styles['app-comp-finance-generator-order-create-button']}>创建</Button>
          </div>
        </Form>
      </CoreContent>
    );
  }
}

export default connect()(Form.create()(OrderCreateComponent));
