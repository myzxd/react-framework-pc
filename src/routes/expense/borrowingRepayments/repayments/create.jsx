/**
 * 费用管理 - 借还款管理 - 还借款申请单创建
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Row, Col, message } from 'antd';

import BaseInfo from './components/form/baseInfo';
import BorrowInfo from './components/form/borrowInfo';
import RepayInfo from './components/form/repayInfo';

class Create extends Component {

  constructor(props) {
    super(props);
    this.savedRepayId = ''; // 当前保存的还款单id
    this.applicationOrderId = props.location.query.applicationOrderId; // 审批单号
    this.borrowOrderId = props.location.query.borrowOrderId; // 对应借款单号
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 加载审批单详情数据
    dispatch({
      type: 'borrowingRepayment/fetchExamineOrderDetail',
      payload: { id: this.applicationOrderId },
    });
    // 加载借款单详情数据
    dispatch({
      type: 'borrowingRepayment/fetchBorrowingDetails',
      payload: { id: this.borrowOrderId },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    // 重置审批单详情数据
    dispatch({ type: 'borrowingRepayment/resetExamineOrderDetail' });
    // 重置借款单详情数据
    dispatch({ type: 'borrowingRepayment/resetBorrowingDetails' });
  }

  // 点击保存成功回调
  onSaveSuccessCallback = (res) => {
    if (!this.savedRepayId) {
      this.savedRepayId = res._id;
    }
  }

  // 点击下一步成功回调
  onNextSuccessCllback = (res) => {
    if (!this.savedRepayId) {
      this.savedRepayId = res._id;
    }
    // 跳转到创建借款审批单页面
    this.props.history.push(`/Expense/Manage/ExamineOrder/Form?orderId=${this.applicationOrderId}`);
  }

  //  请求失败回调
  onFailureCallback = (err) => {
    message.error(err.zh_message);
  }

  // 处理保存
  handleSave = (isNext) => {
    const { form, dispatch } = this.props;
    form.validateFields((errs, values) => {
      if (errs) return;
      // 如果没有已保存的id, 则新建
      if (!this.savedRepayId) {
        // 调用创建接口
        return dispatch({
          type: 'borrowingRepayment/createRepayOrder',
          payload: {
            ...values,
            onSuccessCallback: isNext ? this.onNextSuccessCllback : this.onSaveSuccessCallback,
            onFailureCallback: this.onFailureCallback,
            applicationOrderId: this.applicationOrderId,
            borrowOrderId: this.borrowOrderId,
          },
        });
      }
      // 有id, 则调用编辑接口
      dispatch({
        type: 'borrowingRepayment/updateRepayOrder',
        payload: {
          ...values,
          onSuccessCallback: isNext ? this.onNextSuccessCllback : this.onSaveSuccessCallback,
          id: this.savedRepayId,
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
    const { form, examineOrderDetail, borrowingDetail } = this.props;
    return (
      <div>
        {/* 渲染基础信息 */}
        <BaseInfo examineOrderDetail={examineOrderDetail} isCreate />
        {/* 渲染借款信息 */}
        <BorrowInfo borrowingDetail={borrowingDetail} />
        {/* 渲染还款信息 */}
        <RepayInfo form={form} borrowingDetail={borrowingDetail} />
        {/* 渲染操作 */}
        {this.renderOperations()}
      </div>
    );
  }
}
function mapStateToProps({ borrowingRepayment: { examineOrderDetail, borrowingDetail } }) {
  return { examineOrderDetail, borrowingDetail };
}

export default connect(mapStateToProps)(Form.create()(Create));
