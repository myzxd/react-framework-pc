/**
 * 公用组件，审批岗位
 * 未使用
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { connect } from 'dva';
import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

class CommonSelectBankName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankData: dot.get(props, 'bankName.data', []),
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'applicationCommon/fetchBankName',
    });
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({
      bankData: dot.get(nextProps, 'bankName.data', []),
    });
  }

  componentWillUnmount = () => {
    // 重置数据
    this.props.dispatch({
      type: 'applicationCommon/resetBankName',
    });
  }

  render() {
    const { bankData } = this.state;
    const options = bankData.map((item, index) => {
      return <Option value={item} key={index}>{item}</Option>;
    });
    // 默认传递所有上级传入的参数
    const props = { ...this.props };

    // 去除Antd Select不需要的props
    const omitedProps = omit([
      'dispatch',
      'bankData',
    ], props);

    return (
      <CoreSelect {...omitedProps} >
        {options}
      </CoreSelect>
    );
  }
}

function mapStateToProps({ applicationCommon: { bankName } }) {
  return { bankName };
}

export default connect(mapStateToProps)(CommonSelectBankName);
