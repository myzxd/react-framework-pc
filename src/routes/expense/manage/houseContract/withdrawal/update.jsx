/**
 * 费用管理 - 房屋管理 - 房屋退租信息编辑 /Expense/Manage/House/Renewal/Update
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
import HouseInfo from './components/detail/houseInfo'; // 房屋信息
import ContractInfo from './components/detail/contractInfo'; // 合同信息
import RentInfo from './components/detail/rentInfo'; // 租金信息
import DepositInfo from './components/detail/depositInfo'; // 押金信息
import AgencyFeeInfo from './components/detail/agencyFeeInfo'; // 中介费信息
import WithdrawalInfo from './components/form/withdrawalInfo'; // 退租信息
import Operation from '../components/common/operation'; // 操作组件

class WithdrawalUpdate extends Component {
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
      houseContractDetail: detail,
      dispatch,
    } = this.props;

    // 合同id
    const {
      id, // 合同id
      contractEndDate, // 退租时间（合同结束时间）
    } = detail;

    form.validateFields((errs, values) => {
      if (errs) return;

      // 参数
      const params = {
        id, // 合同ID
        breakDate: contractEndDate,
        action: ExpenseHouseContractTemplate.close, // 模板类型
        ...values,
      };

      // 防止多次提交
      if (this.private.isSubmit) {
        dispatch({
          type: 'expenseHouseContract/createExpenseHouseWithdrawal',
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

  // 渲染房屋信息
  renderHouseInfo = () => {
    // 房屋详情
    const { houseContractDetail } = this.props;

    return (
      <HouseInfo
        detail={houseContractDetail}
      />
    );
  }

  // 渲染合同信息
  renderContractInfo = () => {
    // 房屋详情
    const {
      form,
      houseContractDetail, // 房屋详情
    } = this.props;

    return (
      <ContractInfo
        form={form}
        detail={houseContractDetail}
      />
    );
  }

  // 渲染租金信息
  renderRentInfo = () => {
    const {
      form,
      houseContractDetail, // 房屋详情
    } = this.props;

    return (
      <RentInfo
        form={form}
        detail={houseContractDetail}
      />
    );
  }

  // 渲染押金信息
  renderDepositInfo = () => {
    const {
      houseContractDetail, // 房屋详情
    } = this.props;

    return (
      <DepositInfo
        detail={houseContractDetail}
      />
    );
  }

  // 渲染中介费信息
  renderAgencyFeeInfo = () => {
    const {
      houseContractDetail, // 房屋详情
    } = this.props;

    return (
      <AgencyFeeInfo
        detail={houseContractDetail}
      />
    );
  }

  // 渲染退租信息
  renderWithdrawalInfo = () => {
    const {
      form,
      houseContractDetail, // 房屋详情
    } = this.props;

    return (
      <WithdrawalInfo
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
        {/* 渲染房屋信息 */}
        {this.renderHouseInfo()}

        {/* 渲染合同信息 */}
        {this.renderContractInfo()}

        {/* 渲染租金信息 */}
        {this.renderRentInfo()}

        {/* 渲染押金信息 */}
        {this.renderDepositInfo()}

        {/* 渲染中介费信息 */}
        {this.renderAgencyFeeInfo()}

        {/* 渲染退租信息 */}
        {this.renderWithdrawalInfo()}

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
export default connect(mapStateToProps)(Form.create()(WithdrawalUpdate));
