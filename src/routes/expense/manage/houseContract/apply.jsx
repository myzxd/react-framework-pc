/**
 * 房屋管理/费用申请信息 /Expense/Manage/House/Apply
 */
import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Button, Row, Col } from 'antd';

import { ExpenseCostOrderTemplateType } from '../../../../application/define';
import Deposit from './components/apply/deposit';
import AgencyFees from './components/apply/agencyFees';
import Rent from './components/apply/rent';
import style from './style.css';

class Apply extends Component {
  static propTypes = {
    houseContractDetail: PropTypes.object,
    form: PropTypes.object,
    dispatch: PropTypes.func,
  };

  static defaultProps = {
    houseContractDetail: {},
    form: {},
    dispatch: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { id } = this.props.location.query;
    const params = {
      id,
    };
    this.props.dispatch({ type: 'expenseHouseContract/fetchHouseContractsDetail', payload: params });
  }

  // 清空数据
  componentWillUnmount() {
    this.props.dispatch({ type: 'expenseHouseContract/resetHouseContractDetail' });
    this.props.dispatch({ type: 'expenseCostOrder/resetCostOrders' });
  }

  // 返回修改的合同信息
  onReturnContrac = () => {
    const { id } = this.props.location.query;
    if (id) {
      window.location.href = `/#/Expense/Manage/House/Update?id=${id}`;
    }
  }

  onSaveAndCreateRenewOrder = () => {
    const { form = {}, dispatch } = this.props;

    const { id } = this.props.location.query;

    // 成功回调（跳转进续签审批单）
    const routeToLink = (rens) => {
      window.location.href = `/#/Expense/Manage/ExamineOrder/Form?orderId=${rens.application_order_id}&contractId=${id}&template=${ExpenseCostOrderTemplateType.rent}`;
    };

    // 失败回调
    const failureCallback = () => { };

    // 表单提交
    form.validateFields((errs, values) => {
      const {
        rentDate, // 租金期间
        houseMoney, // 房屋租金
        rentInvoiceFlag, // 租金是否开票
        rentTax,    // 租金税金
        rentPayee: rentPayeeName, // 房租收款人
        rentPayeeAccount: rentPayeeNum, // 收款账号
        rentBankName: rentPayeeBankDetails, // 开户支行
        pledgeMoney,  // 押金金额
        pledgePayee: pledgePayeeName, // 押金收款人
        pledgePayeeAccount: pledgePayeeNum, // 押金收款账号
        pledgeBankName: pledgePayeeBankDetails, // 押金开户支行
        agentMoney, // 费用金额
        agentInvoiceFlag, // 中介费是否开票
        agentPayeeTax, // 中介费税金
        agentPayee: agentPayeeName, // 中介收款人
        agentPayeeAccount: agentPayeeNum, // 中介收款人
        agentBankName: agentPayeeBankDetails, // 中介开户支行
        UnifiedCode, // 租金信息 统一信用代码
        idNumber,   // 租金信息 身份证号
        mediumUnifiedCode, // 中介信息 统一信用代码
        mediumIdNumber,   // 中介信息 身份证号
        payMethod, // 租金信息 收款类型
        mediumPayMethod, // 中介信息 收款类型
      } = values;

      // 租金期间开始时间
      const rentStartDate = Number(moment(rentDate.startValue).format('YYYYMMDD'));
      // 租金期间结束时间
      const rentEndDate = Number(moment(rentDate.endValue).format('YYYYMMDD'));
      // if (errs) return;

      if (errs) return;

      // 更新续签合同
      dispatch({
        type: 'expenseHouseContract/createInitApplicationOrder',
        payload: {
          params: {
            payMethod, // 租金信息 收款类型
            mediumPayMethod,  // 中介信息 收款类型
            UnifiedCode, // 租金信息 统一信用代码
            idNumber,   // 租金信息 身份证号
            mediumUnifiedCode, // 中介信息 统一信用代码
            mediumIdNumber, // 中介信息 身份证号
            id, // 合同id
            rentStartDate, // 开始时间
            rentEndDate, // 结束时间
            houseMoney, // 房屋租金
            rentInvoiceFlag, // 租金是否开票
            rentTax,    // 租金税金
            rentPayeeName, // 房租收款人
            rentPayeeNum, // 收款账号
            rentPayeeBankDetails, // 开户支行
            pledgeMoney,  // 押金金额
            pledgePayeeName, // 押金收款人
            pledgePayeeNum, // 押金收款账号
            pledgePayeeBankDetails, // 押金开户支行
            agentMoney, // 费用金额
            agentInvoiceFlag, // 中介费是否开票
            agentPayeeTax, // 中介费税金
            agentPayeeName, // 中介收款人
            agentPayeeNum, // 中介收款人
            agentPayeeBankDetails, // 中介开户支行
          },
          onSuccessCallback: routeToLink,
          onFailureCallback: failureCallback,
        },
      });
    });
  }

  // 渲染租金信息
  renderRentInfo = () => {
    const { houseContractDetail = {}, form = {} } = this.props;

    return (
      <Rent
        form={form}
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染押金信息
  renderDeposit = () => {
    const { houseContractDetail = {}, form = {}, location: { query = {} } = {} } = this.props;

    // 押金科目id
    const { pledgeAccountingInfo: { id } = {} } = houseContractDetail;

    const { isCreateRenew } = query;
    return (
      <Deposit
        form={form}
        houseContractDetail={houseContractDetail}
        subjectId={id}
        isCreateRenew={isCreateRenew}
      />
    );
  }

  // 渲染中介费信息
  renderAgencyFees = () => {
    const { houseContractDetail = {}, form = {} } = this.props;

    // 中介费科目id
    const { agentAccountingInfo: { id } = {} } = houseContractDetail;
    return (
      <AgencyFees
        form={form}
        houseContractDetail={houseContractDetail}
        subjectId={id}
      />
    );
  }

  // 渲染操作按钮
  renderOprations = () => {
    return (
      <Row
        type="flex"
        align="middle"
        justify="space-around"
        className={style['app-comp-expense-house-contract-update']}
      >
        <Col span={11} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            size="large"
            onClick={this.onReturnContrac}
          >
            返回并修改合同信息
          </Button>
        </Col>
        <Col span={11}>
          <Button
            type="primary"
            size="large"
            onClick={this.onSaveAndCreateRenewOrder}
          >
            提交并生成费用单
          </Button>
        </Col>
      </Row>
    );
  }

  render = () => {
    return (
      <Form layout="horizontal">

        {/* 渲染租金信息 */}
        {this.renderRentInfo()}

        {/* 渲染押金信息 */}
        {this.renderDeposit()}

        {/* 渲染中介费信息 */}
        {this.renderAgencyFees()}

        {/* 渲染操作按钮 */}
        {this.renderOprations()}

      </Form>
    );
  }
}

function mapStateToProps({ expenseHouseContract: { houseContractDetail } }) {
  return { houseContractDetail };
}


export default connect(mapStateToProps)(Form.create()(Apply));
