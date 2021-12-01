/**
 * 费用管理 - 房屋管理 - 房屋续租信息编辑 /Expense/Manage/House/Renewal/Update
 */
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { message } from 'antd';

import {
 ExpenseHouseContractTemplate,
} from '../../../../../application/define/';
import BasisInfo from './components/detail/basisInfo'; // 房屋信息
import ContractInfo from './components/detail/contract'; // 合同信息
import PaymentInfo from './components/detail/paymentInfo'; // 最近一次付款信息
import RenewalInfo from './components/form/renewalInfo'; // 续租信息
import Operation from '../components/common/operation'; // 操作组件

class RenewalUpdate extends Component {
  static propsTypes = {
    houseContractDetail: PropTypes.object, // 房屋合同详情
    form: PropTypes.object,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    houseContractDetail: {},
    form: {},
    dispatch: () => {},
  }

  constructor() {
    super();
    this.state = {};
    this.private = {
      isSubmit: true,
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

      const {
        contractTime, // 租金期间
      } = values;

      // 租金期间开始时间
      const contractStartDate = Number(moment(contractTime.startValue).format('YYYYMMDD'));
      // 租金期间结束时间
      const contractEndDate = Number(moment(contractTime.endValue).format('YYYYMMDD'));

      const rentEndDate = moment(`${detail.contractEndDate}`);
      const contractEndTime = values.contractTime.endValue;
      const flag = rentEndDate.valueOf() === contractEndTime.valueOf();
      const params = {
        id, // 合同ID
        action: ExpenseHouseContractTemplate.rent, // 模板类型
        contractStartDate,
        contractEndDate,
        flag,
        ...values,
      };
      const sum = Number(values.rentMoney + values.tax).toFixed(2);
      // 判断押金转租金是否小于等于房屋租金
      if (flag === true && values.depositRent > sum) {
        return message.error('押金转租金必须小于等于【房屋租金+税金】');
      }

      // 防止多次提交
      if (this.private.isSubmit) {
        dispatch({
          type: 'expenseHouseContract/createExpenseHouseRenewal',
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

  // 渲染合同信息
  renderContractInfo = () => {
    // 房屋详情
    const { houseContractDetail } = this.props;

    return (
      <ContractInfo
        detail={houseContractDetail}
      />
    );
  }

  // 渲染最近一次付款信息
  renderPaymentInfo = () => {
    const {
      houseContractDetail, // 房屋详情
    } = this.props;

    return (
      <PaymentInfo
        detail={houseContractDetail}
      />
    );
  }

  // 渲染续租信息
  renderRenewalInfo = () => {
    const {
      form,
      houseContractDetail, // 房屋详情
    } = this.props;

    return (
      <RenewalInfo
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

        {/* 渲染合同信息 */}
        {this.renderContractInfo()}

        {/* 渲染最近一次付款信息 */}
        {this.renderPaymentInfo()}

        {/* 渲染续租信息 */}
        {this.renderRenewalInfo()}

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
export default connect(mapStateToProps)(Form.create()(RenewalUpdate));
