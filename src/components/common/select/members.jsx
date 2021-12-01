/**
 * 公用组件，成员列表信息
 * 未使用
 */
import _ from 'lodash';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { connect } from 'dva';
import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

class CommonMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positions: props.positions ? props.positions : undefined, // 职位参数
      data: dot.get(props, 'membersData.data', []),
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({
      positions: nextProps.positions ? nextProps.positions : undefined, // 职位参数
      data: dot.get(nextProps, 'membersData.data', []),
    });

    // 判断职位参数，如果职位参数不一致，则请求服务器
    const { positions } = this.state;
    if (!_.isEqual(positions, nextProps.positions)) {
      this.props.dispatch({ type: 'applicationCommon/fetchMembersInfo', payload: { positions: Number(nextProps.positions), state: nextProps.state } });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'applicationCommon/resetMembersInfo',
    });
  }

  render() {
    const { data } = this.state;
    const options = data.map((item) => {
      return <Option value={item._id} key={item._id}>{item.name}</Option>;
    });
    // 默认传递所有上级传入的参数
    const props = { ...this.props };

    // 去除Antd Select不需要的props
    const omitedProps = omit([
      'dispatch',
      'membersData',
      'positions',
    ], props);

    return (
      <CoreSelect {...omitedProps} >
        {options}
      </CoreSelect>
    );
  }
}

function mapStateToProps({ applicationCommon: { membersData } }) {
  return { membersData };
}

export default connect(mapStateToProps)(CommonMembers);
