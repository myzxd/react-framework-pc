/**
 * 组织架构 - 操作日志 - 查询条件 - 操作对象 Organization/OperationLog
 */
import dot from 'dot-prop';
import React from 'react';
import { connect } from 'dva';

import { CoreSelect } from '../../../components/core';
import { omit } from '../../../application/utils';

const { Option } = CoreSelect;

class ComponentOperationObject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({ type: 'organizationOperationLog/fetchOperationObject', payload: {} });
  }

  // 清除数据
  componentWillUnmount() {
    this.props.dispatch({ type: 'organizationOperationLog/reduceOperationObject', payload: {} });
  }

  render = () => {
    const { operationObject } = this.props;
    const domains = dot.get(operationObject, 'domains', {});
    const dataSource = Object.keys(domains).map((v) => {
      return <Option value={v} key={v}>{domains[v]}</Option>;
    });
    // 去除Antd Select不需要的props
    const omitedProps = omit([
      'dispatch',
      'operationObject',
    ], this.props);

    return (
      <CoreSelect {...omitedProps}>
        {dataSource}
      </CoreSelect>
    );
  }
}
const mapStateToProps = ({ organizationOperationLog: { operationObject } }) => {
  return { operationObject };
};

export default connect(mapStateToProps)(ComponentOperationObject);
