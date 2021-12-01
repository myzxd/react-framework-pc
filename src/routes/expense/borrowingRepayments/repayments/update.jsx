/**
 * 费用管理 - 借还款管理 - 还借款申请单编辑
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Row, Col, message } from 'antd';

import BaseInfo from './components/form/baseInfo';
import BorrowInfo from './components/form/borrowInfo';
import RepayInfo from './components/form/repayInfo';

class Update extends Component {

  constructor(props) {
    super(props);
    this.applicationOrderId = props.location.query.applicationOrderId; // 审批单号
    this.repayOrderId = props.location.query.repayOrderId; // 还款单号
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 加载还款单详情数据
    dispatch({
      type: 'borrowingRepayment/fetchRepaymentsDetails',
      payload: { id: this.repayOrderId, onSuccessCallback: this.fetchBorrowDetail },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    // 重置借款单详情数据
    dispatch({ type: 'borrowingRepayment/resetBorrowingDetails' });
    // 重置还款单详情数据
    dispatch({ type: 'borrowingRepayment/resetRepaymentsDetails' });
  }

  // 点击下一步成功回调
  onNextSuccessCllback = () => {
    // 跳转到创建借款审批单页面
    this.props.history.push(`/Expense/Manage/ExamineOrder/Form?orderId=${this.applicationOrderId}`);
  }

  //  请求失败回调
  onFailureCallback = (err) => {
    message.error(err.zh_message);
  }

  // 请求借款数据
  fetchBorrowDetail = (res) => {
    const { loan_order_id: id } = res;
    this.props.dispatch({
      type: 'borrowingRepayment/fetchBorrowingDetails',
      payload: { id },
    });
  }

  // 处理保存
  handleSave = (isNext) => {
    const { form, dispatch } = this.props;
    form.validateFields((errs, values) => {
      if (errs) return;
      // 有id, 则调用编辑接口
      dispatch({
        type: 'borrowingRepayment/updateRepayOrder',
        payload: {
          ...values,
          onSuccessCallback: isNext ? this.onNextSuccessCllback : null,
          onFailureCallback: this.onFailureCallback,
          id: this.repayOrderId,
        },
      });
    });
  }

  // 渲染操作
  renderOperations = () => {
    return (
      <Row gutter={24} justify="center" type="flex">
        <Col>
          <Button type="primary" onClick={() => this.handleSave(false)}>保存</Button>
        </Col>
        <Col>
          <Button type="primary" onClick={() => this.handleSave(true)}>下一步</Button>
        </Col>
      </Row>
    );
  }

  render = () => {
    const { form, borrowingDetail, repaymentDetail } = this.props;
    return (
      <div>
        {/* 渲染基础信息 */}
        <BaseInfo repaymentDetail={repaymentDetail} />
        {/* 渲染借款信息 */}
        <BorrowInfo borrowingDetail={borrowingDetail} />
        {/* 渲染还款信息 */}
        <RepayInfo form={form} borrowingDetail={borrowingDetail} repaymentDetail={repaymentDetail} />
        {/* 渲染操作 */}
        {this.renderOperations()}
      </div>
    );
  }
}

function mapStateToProps({ borrowingRepayment: { borrowingDetail, repaymentDetail } }) {
  return { borrowingDetail, repaymentDetail };
}

export default connect(mapStateToProps)(Form.create()(Update));
