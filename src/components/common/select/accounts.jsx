/**
 * 公用组件，用户信息
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'dva';
import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

class CommonSelectUser extends Component {
  static propTypes = {
    namespace: PropTypes.string,
    teamMembers: PropTypes.object,
  }

  static defaultValue = {
    namespace: '',
    teamMembers: {},
  }

  componentDidMount() {
    const {
      namespace,
    } = this.props;

    const params = {
      namespace,
    };

    this.props.dispatch({ type: 'applicationCommon/fetchTeamMembers', payload: { ...params } });
  }

  componentWillUnmount = () => {
    // 重置数据
    this.props.dispatch({
      type: 'applicationCommon/resetTeamMembers',
      payload: {},
    });
  }

  render() {
    const {
      teamMembers,
      namespace,
    } = this.props;

    const accounts = teamMembers[namespace] || {};

    const { data = [] } = accounts;

    const options = data.map((item) => {
      return (
        <Option
          value={item.member_id_card_no}
          key={`${item.member_id_card_no}`}
        >
          {`${item.member_name}(${item.member_id_card_no})`}
        </Option>
      );
    });

    // 默认传递所有上级传入的参数
    const props = { ...this.props };

    // 去除Antd Select不需要的props
    const omitedProps = omit([
      'dispatch',
      'teamMembers',
      'namespace',
    ], props);

    return (
      <CoreSelect {...omitedProps} >
        {options}
      </CoreSelect>
    );
  }
}

function mapStateToProps({ applicationCommon: { teamMembers } }) {
  return { teamMembers };
}

export default connect(mapStateToProps)(CommonSelectUser);
