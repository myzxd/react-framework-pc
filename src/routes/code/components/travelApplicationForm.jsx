/**
 * 出差申请单组件
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

import {
  OaApplicationTravelApplyOrderState,
  ExpenseTravelApplicationBizState,
  CodeTravelState,
  ExpenseCostOrderState,
} from '../../../application/define';
import { authorize } from '../../../application';
import { omit } from '../../../application/utils';

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
    this.props.dispatch({ type: 'fake/getBusinssTripList', payload: params });
  }

  // 改变出差申请单组件
  onChangeSelect = (e, options) => {
    const { define, item } = options;
    const { onChange } = this.props;
    if (onChange) {
      onChange(e, define, item);
    }
  }

  render() {
    const omitProps = omit([
      'dispatch',
      'travelApplicationLists',
      'businessTripList',
      'enableSelectAll',
    ], this.props);
    const props = {
      ...omitProps,
      style: this.props.style,
      value: this.props.value,
      disabled: this.props.disabled,
      placeholder: this.props.placeholder,
    };
    const dataSource = dot.get(this.props, 'travelApplicationLists.data', []);
    const oaDataSource = dot.get(this.props, 'businessTripList.data', []);
    // 渲染oa的Option
    const oaOptions = oaDataSource.map((item) => {
      const departure = item.departure || {}; // 出发地
      const destination = item.destination || {}; // 目的地
      const costState = dot.get(item, 'cost_order_info.state', undefined); // 费用单状态
      return (
        <Option
          key={item._id}
          define={CodeTravelState.oa}
          value={item._id}
          item={item}
        >
          {item.apply_user_name}--
          ({departure.province_name}{departure.city_name}--{destination.province_name}{destination.city_name})
          -{item._id}{costState ? `-${ExpenseCostOrderState.description(costState)}` : ''}
        </Option>
      );
    });
    // 渲染费用的Option
    const options = dataSource.map((item) => {
      const departure = item.departure || {}; // 出发地
      const destination = item.destination || {}; // 目的地
      const costState = dot.get(item, 'cost_order_info.state', undefined); // 费用单状态
      return (
        <Option
          key={item._id}
          define={CodeTravelState.expense}
          value={item._id}
          item={item}
        >
          {item.apply_user_name}--
          ({departure.province_name}{departure.city_name}--{destination.province_name}{destination.city_name})
          -{item._id}{costState ? `-${ExpenseCostOrderState.description(costState)}` : ''}
        </Option>
      );
    });
    return (
      <Select {...props} onChange={this.onChangeSelect}>
        {[...oaOptions, ...options]}
      </Select>
    );
  }
}

function mapStateToProps({
  expenseExamineOrder: { travelApplicationLists },
  fake: { businessTripList } }) {
  return {
    travelApplicationLists,
    businessTripList,
  };
}
export default connect(mapStateToProps)(TravelApplicationForm);
