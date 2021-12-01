/**
 * 出差申请单组件
 */
import is from 'is_js';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

import {
  OaApplicationTravelApplyOrderState,
  ExpenseTravelApplicationBizState,
} from '../../../../../../application/define';
import { authorize } from '../../../../../../application';

const { Option } = Select;

class TravelApplicationForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    const params = {
      state: [
        OaApplicationTravelApplyOrderState.complete, // 完成
      ],
      bizState: ExpenseTravelApplicationBizState.undone, // 报销状态
      applyAccountId: authorize.account.id, // 当前账号id
    };
    this.props.dispatch({ type: 'expenseExamineOrder/fetchTravelApplicationLists', payload: params });
  }

  // 改变出差申请单组件
  onChangeSelect = (e) => {
    const { onChange } = this.props;
    const dataSource = this.props.travelApplicationLists.data || [];
    const data = dataSource.filter(v => v._id === e);
    let item = [];
    if (is.existy(data) && is.not.empty(data)) {
      item = data[0];
    }
    if (onChange) {
      onChange(e, item);
    }
  }

  render() {
    const props = {
      ...this.props,
      style: this.props.style,
      value: this.props.value,
      disabled: this.props.disabled,
      placeholder: this.props.placeholder,
    };
    const dataSource = this.props.travelApplicationLists.data || [];
    // 渲染Option
    const options = dataSource.map((item) => {
      const departure = item.departure || {}; // 出发地
      const destination = item.destination || {}; // 目的地
      return (
        <Option key={item._id} value={item._id}>
          {item.apply_user_name}--
          ({departure.province_name}{departure.city_name}--{destination.province_name}{destination.city_name})
          -{item._id}
        </Option>
      );
    });
    return (
      <div>
        <Select {...props} onChange={this.onChangeSelect}>
          {options}
        </Select>
      </div>
    );
  }
}

function mapStateToProps({ expenseExamineOrder: { travelApplicationLists } }) {
  return {
    travelApplicationLists,
  };
}
export default connect(mapStateToProps)(TravelApplicationForm);
