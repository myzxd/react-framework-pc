/**
 * 服务费规则生成 - 单量组件 Finance/Rules/Generator
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SalaryCollapseType } from '../../../../../../application/define';

import OrderCreateComponent from './create';    // 创建组件
import OrderContentComponent from './content';  // 内容组件

class OrderComponent extends Component {
  static propTypes = {
    platformCode: PropTypes.string,        // 平台code
    ruleCollectionId: PropTypes.string,    // 服务费方案规则集id
  }

  render() {
    const { ruleCollectionId, platformCode } = this.props;
    return (
      <div>
        {/* 渲染创建组件 */}
        <OrderCreateComponent
          ruleCollectionId={ruleCollectionId}
          platformCode={platformCode}
        />

        {/* 渲染内容组件 */}
        <OrderContentComponent
          ruleCollectionId={ruleCollectionId}
          type={SalaryCollapseType.generator}
          platformCode={platformCode}
        />
      </div>
    );
  }
}

export default OrderComponent;
