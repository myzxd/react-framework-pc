/**
 * 服务费规则 补贴质量 单人考核 Finance/Components/quality/person
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message } from 'antd';

import {
  FinanceQualityStaffOnDuty,
  FinanceRulesGeneratorStep,
  FinanceKnightClassification,
  FinanceSalaryKnightTagState,
  FinanceQualityType,
} from '../../../../../../../../application/define';
import {
  DeprecatedCoreForm,
  CoreSelect,
} from '../../../../../../../../components/core';
import TopTip from '../common/topTip';
import PersonEdit from './personEdit';
import TitleBar from '../common/titleBar';

import styles from './style/index.less';

const Option = CoreSelect.Option;
const CurrentStep = FinanceRulesGeneratorStep.third;

class QualityPerson extends Component {

  static propTypes = {
    platformCode: PropTypes.string, // 平台
    isShowTips: PropTypes.bool,     // 是否显示toptip
    onCloseTip: PropTypes.func,     // 关闭顶部提示栏回调
    ruleCollectionId: PropTypes.string.isRequired, // 规则集id
  }
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
  onSubmit = () => {
    const { validateFields } = this.props.form;
    const { ruleCollectionId } = this.props;
    const { isSumbit } = this.private;
    validateFields({ force: true }, (err, values) => {
      if (err) return;
      const payload = {
        ...values, // 表单值
        ruleCollectionId, // 规则集ID
        type: FinanceQualityType.person, // 奖惩类型
        step: CurrentStep, // 当前步骤
        platformCode: this.props.platformCode, // 平台
        onSuccessCallback: this.onCreateSuccessCallback, // 创建成功回调
        onFailureCallback: this.onCreateFailureCallback, // 创建失败回调
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
    this.onReset(); // 成功之后清空
    this.fetchListData();
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

  // 关闭提示
  onCloseTip = () => {
    const { onCloseTip } = this.props;
    if (onCloseTip) {
      onCloseTip(`${FinanceQualityType.person}`);
    }
  }

  // 刷新列表数据
  fetchListData = () => {
    const { dispatch, ruleCollectionId } = this.props;
    dispatch({
      type: 'financeRulesGenerator/fetchRulesGeneratorList',
      payload: {
        ruleCollectionId,
        step: CurrentStep,
      },
    });
  }

  // 渲染创建
  renderCreate = () => {
    return (
      <Form>
        {/* 渲染考核范围 */}
        {this.renderRange()}

        {/* 渲染奖项方式 */}
        {this.renderReward()}

        {/* 表单提交按钮 */}
        <div className={styles['app-comp-finance-quality-create-person-from-wrap']}>
          <Button onClick={this.onReset}>清空</Button>
          <Button
            type="primary"
            className={styles['app-comp-finance-quality-create-person-from-button']}
            onClick={this.onSubmit}
          >
            创建
          </Button>
        </div>
      </Form>
    );
  }

  // 渲染唯一指标
  // 骑士分类和骑士标签: v6.4.0 默认选中全部
  renderRange = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
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
          initialValue: `${FinanceQualityStaffOnDuty.all}`,
          rules: [{
            required: true,
            message: '请选择',
          }],
        })(
          <CoreSelect
            allowClear
            placeholder="请选择"
            mode="multiple"
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

    // 表单布局
    const layout = {
      labelCol: {
        span: 9,
      },
      wrapperCol: {
        span: 15,
      },
    };

    return (
      <div>
        <TitleBar title="选择考核范围" />
        <DeprecatedCoreForm items={formItems} layout={layout} cols={3} />
      </div>
    );
  }

  // 渲染可编辑
  renderReward = () => {
    const { form, platformCode } = this.props;
    return (
      <PersonEdit
        platformCode={platformCode}
        form={form}
      />
    );
  }

  // 渲染提示栏
  renderTopTip = () => {
    if (!this.props.isShowTips) return;
    const tip = '在圈定范围的中选择按天按月统计数据，进行单人考核。单人考核的奖励有两种：按量、按率阶梯奖励。';
    return (<TopTip content={tip} onClose={this.onCloseTip} />);
  }

  render() {
    return (
      <div>
        {/* 渲染提示栏*/}
        {this.renderTopTip()}

        {/* 渲染创建 */}
        {this.renderCreate()}
      </div>
    );
  }
}

export default connect()(Form.create()(QualityPerson));
