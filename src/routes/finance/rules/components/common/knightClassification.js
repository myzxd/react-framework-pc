/**
 * 服务费规则生成 - 公用骑士分类组件
 */
import React, { Component } from 'react';
import { Select } from 'antd';

import { FinanceKnightClassification } from '../../../../../application/define';

const Option = Select.Option;

class GeneratorKnightClassification extends Component {
  render() {
    return (
      <Select {...this.props}>
        <Option value={`${FinanceKnightClassification.all}`}>{FinanceKnightClassification.description(FinanceKnightClassification.all)}</Option>
        <Option value={`${FinanceKnightClassification.newKnight}`}>{FinanceKnightClassification.description(FinanceKnightClassification.newKnight)}</Option>
        <Option value={`${FinanceKnightClassification.oldKnight}`}>{FinanceKnightClassification.description(FinanceKnightClassification.oldKnight)}</Option>
      </Select>
    );
  }
}

export default GeneratorKnightClassification;
