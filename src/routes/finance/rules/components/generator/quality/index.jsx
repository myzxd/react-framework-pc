/**
 * 服务费规则生成 - 质量组件 Finance/Rules/Generator
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SalaryCollapseType } from '../../../../../../application/define';

import QualityCreateComponent from './create/index';    // 创建组件
import QualityContentComponent from './content';        // 内容组件

class QualityComponent extends Component {
  static propTypes = {
    ruleCollectionId: PropTypes.string,    // 服务费方案规则集id
  }

  render() {
    const { ruleCollectionId, platformCode } = this.props;
    return (
      <div>
        {/* 渲染创建组件 */}
        <QualityCreateComponent
          ruleCollectionId={ruleCollectionId}
          platformCode={platformCode}
        />

        {/* 渲染内容组件 */}
        <QualityContentComponent
          ruleCollectionId={ruleCollectionId}
          type={SalaryCollapseType.generator}
          platformCode={platformCode}
        />
      </div>
    );
  }
}

export default QualityComponent;
