/**
 * 服务费规则生成 Finance/Rules/Generator
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Steps, message } from 'antd';
import React, { Component } from 'react';
import { FinanceRulesGeneratorStep, GeneratorState } from '../../../application/define';

// 订单组件
import OrderComponent from './components/generator/order/index';
// 出勤组件
import AttendanceComponent from './components/generator/attendance/index';
// 质量组件
import QualityComponent from './components/generator/quality/index';
// 管理组件
import ManagementComponent from './components/generator/management/index';

import styles from './style/index.less';

const Step = Steps.Step;

// 规则组件
const RulesComponents = {
  order: 1,           // 单量
  attendance: 2,      // 出勤
  quality: 3,         // 质量
  management: 4,      // 管理
  component(rawValue, id, code) {
    switch (Number(rawValue)) {
      case this.order: return <OrderComponent platformCode={code} ruleCollectionId={id} key={this.order} />;
      case this.attendance: return <AttendanceComponent platformCode={code} ruleCollectionId={id} key={this.attendance} />;
      case this.quality: return <QualityComponent platformCode={code} ruleCollectionId={id} key={this.quality} />;
      case this.management: return <ManagementComponent platformCode={code} ruleCollectionId={id} key={this.management} />;
      default: return '未定义';
    }
  },
  description(rawValue) {
    switch (Number(rawValue)) {
      case this.order: return '单量提成';
      case this.attendance: return '出勤奖罚';
      case this.quality: return '质量奖罚';
      case this.management: return '管理奖罚';
      default: return '未定义';
    }
  },
};

class IndexComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      generatorSteps: [
        { step: RulesComponents.order, state: GeneratorState.none },
        { step: RulesComponents.attendance, state: GeneratorState.none },
        { step: RulesComponents.quality, state: GeneratorState.none },
        { step: RulesComponents.management, state: GeneratorState.none },
      ],
    };
  }

  componentDidUpdate(prevProps) {
    const ruleCollectionId = this.props.location.query.id;
    if (dot.get(prevProps, `ruleCollectionData.${ruleCollectionId}`, {}) !== dot.get(this.props, `ruleCollectionData.${ruleCollectionId}`, {})) {
      const ruleCollectionData = dot.get(this.props, `ruleCollectionData.${ruleCollectionId}`);
      const {
        orderRuleFlag,
        workRuleFlag,
        qaRuleFlag,
        operationRuleFlag,
      } = ruleCollectionData;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        generatorSteps: [
          { step: RulesComponents.order, state: orderRuleFlag ? GeneratorState.none : GeneratorState.skip },
          { step: RulesComponents.attendance, state: workRuleFlag ? GeneratorState.none : GeneratorState.skip },
          { step: RulesComponents.quality, state: qaRuleFlag ? GeneratorState.none : GeneratorState.skip },
          { step: RulesComponents.management, state: operationRuleFlag ? GeneratorState.none : GeneratorState.skip },
        ],
      });
    }
  }

  // 不使用
  onClickSkip = () => {
    const { currentStep } = this.state;
    const { step } = this.state.generatorSteps[currentStep];
    const ruleCollectionId = this.props.location.query.id;
    const params = {
      step,
      ruleCollectionId,
      ruleFlag: false,
      onSuccessCallback: this.onSuccessCallbackFlag(GeneratorState.skip),
    };
    this.props.dispatch({
      type: 'financeRulesGenerator/updateRulesGeneratorByEnableDisable',
      payload: params,
    });
  }

  // 回调
  onSuccessCallbackFlag = (state) => {
    const { currentStep, generatorSteps } = this.state;
    generatorSteps[currentStep].state = state;
    this.setState({ currentStep, generatorSteps });
  }

  // 启用
  onClickWork = () => {
    const { currentStep } = this.state;
    const { step } = this.state.generatorSteps[currentStep];
    const ruleCollectionId = this.props.location.query.id;
    const params = {
      step,
      ruleCollectionId,
      ruleFlag: true,
      onSuccessCallback: this.onSuccessCallbackFlag(GeneratorState.work),
    };
    this.props.dispatch({
      type: 'financeRulesGenerator/updateRulesGeneratorByEnableDisable',
      payload: params,
    });
  }

  // 下一步
  onClickNext = () => {
    const { currentStep, generatorSteps } = this.state;
    const ruleCollectionId = this.props.location.query.id;

    // 判断当前步骤的原始状态，如果已经有原始状态，则不进行更新，直接进入下一步
    const state = generatorSteps[currentStep].state;
    if (state !== GeneratorState.none) {
      this.setState({ currentStep: currentStep + 1 });
      return;
    }
    const dataSource = dot.get(this.props.financeRulesGeneratorList, `${ruleCollectionId}.${FinanceRulesGeneratorStep.first}.data`, []);
    if (dataSource.length === 0) {
      return message.error('请完成“单量提成”规则设置');
    }
    // 默认下一步的时候，赋值为启用
    generatorSteps[currentStep].state = GeneratorState.work;
    this.setState({ currentStep: currentStep + 1, generatorSteps });
  }

  // 上一步
  onClickPrev = () => {
    const currentStep = this.state.currentStep - 1;
    this.setState({ currentStep });
  }

  // 保存
  onSubmit = () => {
    const planVersionId = this.props.location.query.planVersionId;
    const payload = {
      planVersionId,
      onSuccessCallback: this.onSubmitSuccessCallback,
    };
    this.props.dispatch({
      type: 'financeRulesGenerator/createFinanceRulesGenerator',
      payload,
    });
  }

  // 保存成功回调
  onSubmitSuccessCallback = (e) => {
    const planId = this.props.location.query.planId;
    if (e.ok) {
      window.location.href = `/#/Finance/Rules?id=${planId}`;
    }
  }

  // 渲染步骤条
  renderSteps = () => {
    const { currentStep, generatorSteps } = this.state;
    return (
      <Steps current={currentStep} className={styles['app-comp-finance-generator-steps']}>
        {generatorSteps.map((item) => {
          // 标题
          const title = RulesComponents.description(item.step);
          // 当前节点的数据状态
          const state = item.state;
          // 判断状态是否是生效中
          if (state === GeneratorState.work) {
            return <Step key={item.step} status="finish" title={title} />;
          // 判读状态是否是不使用
          } else if (state === GeneratorState.skip) {
            return (
              <Step
                key={item.step}
                status="finish"
                title={title}
                icon={<CloseCircleOutlined className={styles['app-comp-finance-generator-steps-state']} />}
              />
            );
          } else {
            return <Step key={item.step} title={title} />;
          }
        })}
      </Steps>
    );
  }

  // 渲染内容
  renderContent = () => {
    const { currentStep, generatorSteps } = this.state;
    const ruleCollectionId = this.props.location.query.id;
    const platformCode = this.props.location.query.platformCode;
    const content = RulesComponents.component(generatorSteps[currentStep].step, ruleCollectionId, platformCode);
    return (
      <div>
        {content}
      </div>
    );
  }

  // 渲染操作按钮
  renderOperations = () => {
    const { currentStep, generatorSteps } = this.state;
    const state = generatorSteps[currentStep].state;

    return (
      <div className={styles['app-comp-finance-generator-steps-operation']}>
        {/* 判断，显示启用，禁用 */}
        {
          state === GeneratorState.skip ?
            <Button onClick={this.onClickWork}> 启用 </Button> :
            currentStep !== 0 ?
              <Button onClick={this.onClickSkip}> 不使用 </Button> :
              ''
        }

        {/* 上一步 */}
        {
          this.state.currentStep > 0 &&
          <Button className={styles['app-comp-finance-generator-steps-operation-previous']} onClick={this.onClickPrev}>上一步</Button>
        }

        {/* 下一步 */}
        {
          this.state.currentStep < generatorSteps.length - 1 &&
          <Button className={styles['app-comp-finance-generator-steps-operation-previous']} type="primary" onClick={this.onClickNext}>下一步</Button>
        }

        {/* 保存 */}
        {
          this.state.currentStep === generatorSteps.length - 1 &&
          <Button className={styles['app-comp-finance-generator-steps-operation-previous']} type="primary" onClick={this.onSubmit}>保存</Button>
        }
      </div>
    );
  }

  // 渲染遮罩
  renderBlurContent = () => {
    return (
      <div>
        {/* 渲染步骤条 */}
        {this.renderSteps()}

        <div className={styles['app-comp-finance-generator-steps-mask']}>
          {/* 渲染内容 */}
          <div className={styles['app-comp-finance-generator-steps-mask-content']}>
            {this.renderContent()}
          </div>
          <div className={styles['app-comp-finance-generator-steps-mask-button-wrap']}>
            {/* 渲染操作 */}
            {this.renderOperations()}
          </div>
        </div>
      </div>
    );
  }

  // 渲染内容
  renderFormContent = () => {
    return (
      <div>
        {/* 渲染步骤条 */}
        {this.renderSteps()}

        {/* 渲染内容 */}
        {this.renderContent()}

        {/* 渲染操作 */}
        {this.renderOperations()}
      </div>
    );
  }

  render() {
    const { currentStep, generatorSteps } = this.state;
    const state = generatorSteps[currentStep].state;
    // 如果是不使用，则渲染遮罩
    if (state === GeneratorState.skip) {
      return this.renderBlurContent();
    }

    // 渲染默认的页面
    return this.renderFormContent();
  }
}

function mapStateToProps({ financePlan: { ruleCollectionData }, financeRulesGenerator: { financeRulesGeneratorList } }) {
  return { ruleCollectionData, financeRulesGeneratorList };
}
export default connect(mapStateToProps)(IndexComponent);
