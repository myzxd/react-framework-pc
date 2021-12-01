/**
 * 服务费规则 补贴质量 竞赛评比 Finance/Components/quality/create/competition
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
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
import CompetitionEdit from './competitionEdit';
import TopTip from '../common/topTip';
import TitleBar from '../common/titleBar';

import styles from './style/index.less';

const Option = CoreSelect.Option;
const CurrentStep = FinanceRulesGeneratorStep.third;

class QualityCompetition extends Component {

  static propTypes = {
    platformCode: PropTypes.string,
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
      // 判断最大人数和最小人数
      if (is.existy(values.minPeople) && is.not.empty(values.minPeople)) {
        if (is.existy(values.maxPeople) && is.not.empty(values.maxPeople)) {
          if (values.minPeople > values.maxPeople) {
            return message.error('最大人数应不小于最小人数');
          }
        }
      }
      // 判断是否是竞赛评比/设定名次
      if (values.rankSetting === true) {
        if (is.not.existy(values.rank) || is.empty(values.rank)) {
          return message.error('请设置具体的名次范围！');
        }
        if (is.existy(values.rank) && is.not.empty(values.rank)) {
          const rank = dot.get(values, 'rank', {});
          const rankSum = dot.get(rank, 'rankSum', undefined);
          if (is.not.existy(rankSum) || is.empty(rankSum) || rankSum < 1) {
            return message.error('请设置具体的名次范围！');
          }
        }
      }
      const payload = {
        ...values, // 表单值
        ruleCollectionId, // 规则集id
        type: FinanceQualityType.competition, // 质量奖罚方式
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

  // 点击关闭提示
  onCloseTip = () => {
    const { onCloseTip } = this.props;
    if (onCloseTip) {
      onCloseTip(`${FinanceQualityType.competition}`);
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
        <div className={styles['app-comp-finance-quality-create-competiton-from-wrap']}>
          <Button onClick={this.onReset}>清空</Button>
          <Button
            type="primary"
            className={styles['app-comp-finance-quality-create-competiton-from-button']}
            onClick={this.onSubmit}
          >
            创建
          </Button>
        </div>
      </Form>
    );
  }

  // 渲染考核范围
  renderRange = () => {
    const { getFieldDecorator } = this.props.form;

    // 骑士分类和骑士标签: v6.4.0 默认选中全部
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

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <div>
        <TitleBar title="选择考核范围" />
        <DeprecatedCoreForm items={formItems} layout={layout} cols={3} />
      </div>
    );
  }

  // 渲染奖罚方式
  renderReward = () => {
    const { form, platformCode } = this.props;
    return (
      <CompetitionEdit
        form={form}
        platformCode={platformCode}
      />
    );
  }

  // 渲染提示栏
  renderTopTip = () => {
    if (!this.props.isShowTips) return;
    const tip = '在圈定范围中根据竞赛条件找到头部的优秀者进行奖励。竞赛评比的奖励有三种：按量、按率阶梯奖励、竞赛评比奖励。其中按量按率只能选择一种。';
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

export default connect()(Form.create()(QualityCompetition));
