/**
 * 服务费规则生成 - 公用骑士标签组件
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { FinanceSalaryKnightTagState } from '../../../../../application/define';

const Option = Select.Option;

class GeneratorKnightTagsComponent extends Component {
  static propTypes = {
    knightTags: PropTypes.object, // 数据源，遍历数据使用
  }
  static defaultProps = {
    knightTags: {},
  }

  render() {
    const { knightTags } = this.props;
    const allOptions = [{ id: FinanceSalaryKnightTagState.all, name: FinanceSalaryKnightTagState.description(FinanceSalaryKnightTagState.all) }];
    allOptions.push(...dot.get(knightTags, 'data', []));
    // 选项
    const options = allOptions.map((item) => {
      return <Option key={item.id} value={`${item.id}`} >{item.name}</Option>;
    });
    return (
      <Select {...this.props}>
        {options}
      </Select>
    );
  }
}

function mapStateToProps({ financeConfigTags: { knightTags } }) {
  return { knightTags };
}

export default connect(mapStateToProps)(GeneratorKnightTagsComponent);
