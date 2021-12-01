/**
 * 服务费规则生成 - 出勤组件 Finance/Rules/Generator
 */
import React, { Component } from 'react';
import { SalaryCollapseType } from '../../../../../../application/define';

import AttendanceCreateComponent from './create';    // 创建组件
import AttendanceContentComponent from './content';  // 内容组件

class AttendanceComponent extends Component {
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
        <AttendanceCreateComponent ruleCollectionId={ruleCollectionId} platformCode={platformCode} />

        {/* 渲染内容组件 */}
        <AttendanceContentComponent
          ruleCollectionId={ruleCollectionId}
          platformCode={platformCode}
          type={SalaryCollapseType.generator}
        />
      </div>
    );
  }
}

export default AttendanceComponent;
