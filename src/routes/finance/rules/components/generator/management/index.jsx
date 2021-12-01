/**
 * 服务费规则生成 - 管理组件 Finance/Rules/Generator
 */
import React, { Component } from 'react';
import { SalaryCollapseType, FinanceRulesGeneratorStep } from '../../../../../../application/define';

import ManagementCreateComponent from './create/index';    // 创建组件
import ManagementContentComponent from './content/index';  // 内容组件

const CurrentFinanceRulesGeneratorStep = FinanceRulesGeneratorStep.forth;

class ManagementComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { platformCode, ruleCollectionId } = this.props;
    return (
      <div>
        {/* 渲染创建组件 */}
        <ManagementCreateComponent tags={CurrentFinanceRulesGeneratorStep} ruleCollectionId={ruleCollectionId} platformCode={platformCode} />

        {/* 渲染内容组件 */}
        <ManagementContentComponent
          tags={CurrentFinanceRulesGeneratorStep}
          ruleCollectionId={ruleCollectionId}
          type={SalaryCollapseType.generator}
          platformCode={platformCode}
        />
      </div>
    );
  }
}

export default ManagementComponent;
