/**
 * 成本中心
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Select } from 'antd';

import { ExpenseCostCenterType } from '../../../../../../application/define';

const { Option } = Select;

class CostCompoment extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  onChangeCostCenterType = (e) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }
  }

  // 渲染第一行
  renderFirstLine = () => {
    // 成本中心初始值
    const value = dot.get(this.props, 'value', '');
    const props = {
      value,
      allowClear: true,
      showSearch: true,
      optionFilterProp: 'children',
      placeholder: '请选择成本中心',
      onChange: this.onChangeCostCenterType,
    };
    return (
      <Select {...props}>
        <Option key={ExpenseCostCenterType.group} value={`${ExpenseCostCenterType.group}`} >
          {ExpenseCostCenterType.description(ExpenseCostCenterType.group)}
        </Option>
        <Option key={ExpenseCostCenterType.project} value={`${ExpenseCostCenterType.project}`} >
          {ExpenseCostCenterType.description(ExpenseCostCenterType.project)}
        </Option>
        <Option key={ExpenseCostCenterType.headquarter} value={`${ExpenseCostCenterType.headquarter}`}>
          {ExpenseCostCenterType.description(ExpenseCostCenterType.headquarter)}
        </Option>
        <Option key={ExpenseCostCenterType.city} value={`${ExpenseCostCenterType.city}`}>
          {ExpenseCostCenterType.description(ExpenseCostCenterType.city)}
        </Option>
      </Select>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染成本中心表单 */}
        {this.renderFirstLine()}
      </div>
    );
  }
}

export default CostCompoment;
