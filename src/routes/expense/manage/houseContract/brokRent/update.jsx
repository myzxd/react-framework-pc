/**
 * 费用管理 - 房屋管理 - 房屋断租信息编辑 /Expense/Manage/House/brokRent/Update
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { message } from 'antd';

import {
 ExpenseHouseContractTemplate,
} from '../../../../../application/define/';
import BasisInfo from './components/detail/basisInfo'; // 基本信息
import HistoryContractInfo from './components/detail/historyContractInfo'; // 历史合同信息
import PaymentInfo from './components/detail/paymentInfo'; // 最近一次付款信息
import BrokRentInfo from './components/form/brokRent'; // 断租信息
import Operation from '../components/common/operation'; // 操作组件

class BrokRentUpdate extends Component {
  static propsTypes = {
    houseContractDetail: PropTypes.object, // 房屋合同详情
    form: PropTypes.object,
  }

  static defaultProps = {
    houseContractDetail: {},
    form: {},
  }

  constructor() {
    super();
    this.state = {};
    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location,
    } = this.props;

    // 房屋合同id
    const { id } = location.query;

    dispatch({
      type: 'expenseHouseContract/fetchHouseContractsDetail',
      payload: {
        id,
      },
    });
  }

  // 提交并生成费用单
  onSubmit = () => {
    const {
      form,
      houseContractDetail: detail, // 房屋详情
      dispatch,
    } = this.props;

    // 合同id
    const { id = '' } = detail;

    form.validateFields((errs, values) => {
      if (errs) return;

      const params = {
        id, // 合同ID
        action: ExpenseHouseContractTemplate.break, // 模板类型
        ...values,
      };

      // 防止多次提交
      if (this.private.isSubmit) {
        dispatch({
          type: 'expenseHouseContract/createExpenseHouseBrokRent',
          payload: {
            params,

            // 成功的回调
            onSuccessCallback: (res) => {
              this.private.isSubmit = false;
              window.location.href = `/#/Expense/Manage/ExamineOrder/Form?orderId=${res.application_order_id}`;
            },

            // 失败的回调
            onFailureCallback: (res) => {
              if (res && res.zh_message) {
                // 重置按钮状态
                this.private.isSubmit = true;
                return message.error(res.zh_message);
              }
            },
          },
        });
      }
    });
  }

  // 渲染基础信息
  renderBasisInfo = () => {
    // 房屋详情
    const { houseContractDetail } = this.props;

    return (
      <BasisInfo
        detail={houseContractDetail}
      />
    );
  }

  // 渲染历史合同信息
  renderHistoryContractInfo = () => {
    // 房屋详情
    const { houseContractDetail } = this.props;

    return (
      <HistoryContractInfo
        detail={houseContractDetail}
      />
    );
  }

  // 渲染最近一次付款信息
  renderPaymentInfo = () => {
    const {
      form,
      houseContractDetail, // 房屋详情
    } = this.props;

    return (
      <PaymentInfo
        form={form}
        detail={houseContractDetail}
      />
    );
  }

  // 渲染断租信息
  renderBrokRentInfo = () => {
    const {
      form,
      houseContractDetail, // 房屋详情
    } = this.props;

    return (
      <BrokRentInfo
        form={form}
        detail={houseContractDetail}
      />
    );
  }

  // 渲染操作
  renderOpration = () => {
    return (
      <Operation
        onSubmit={this.onSubmit}
      />
    );
  }

  render = () => {
    // 房屋详情
    const { houseContractDetail } = this.props;

    // 数据为空，返回null
    if (Object.keys(houseContractDetail).length === 0) return <div />;

    return (
      <div>
        {/* 渲染基本信息 */}
        {this.renderBasisInfo()}

        {/* 渲染历史合同信息 */}
        {this.renderHistoryContractInfo()}

        {/* 渲染最近一次付款信息 */}
        {this.renderPaymentInfo()}

        {/* 渲染断租信息 */}
        {this.renderBrokRentInfo()}

        {/* 渲染操作 */}
        {this.renderOpration()}
      </div>
    );
  }
}

function mapStateToProps({
  expenseHouseContract: {
   houseContractDetail,
  },
}) {
  return {
    houseContractDetail,
  };
}
export default connect(mapStateToProps)(Form.create()(BrokRentUpdate));
