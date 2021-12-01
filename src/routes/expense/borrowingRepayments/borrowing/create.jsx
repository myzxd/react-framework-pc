/**
 * 费用管理 - 借还款管理 - 借款申请单创建
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Row, Col, message } from 'antd';
import { connect } from 'dva';

import BaseInfo from './components/form/baseInfo';
import BorrowerInfo from './components/form/borrowerInfo';
import BorrowInfo from './components/form/borrowInfo';
import RepayInfo from './components/form/repayInfo';

class Create extends Component {

  constructor(props) {
    super(props);
    this.savedBorrowId = ''; // 当前保存的借款单的id
    this.applicationOrderId = props.location.query.applicationOrderId; // 审批单号
  }

  componentDidMount() {
    // 获取审批单详情数据
    this.props.dispatch({
      type: 'borrowingRepayment/fetchExamineOrderDetail',
      payload: { id: this.applicationOrderId },
    });
  }

  componentWillUnmount() {
    // 清空审批单详情数据
    this.props.dispatch({
      type: 'borrowingRepayment/resetExamineOrderDetail',
    });
  }

  // 点击保存成功回调
  onSaveSuccessCallback = (res) => {
    if (!this.savedBorrowId) {
      this.savedBorrowId = res._id;
    }
  }

  // //  请求失败回调
  onFailureCallback = (err) => {
    message.error(err.zh_message);
  }

  // 点击下一步成功回调
  onNextSuccessCllback = (res) => {
    if (!this.savedBorrowId) {
      this.savedBorrowId = res._id;
    }
    // 跳转到创建借款审批单页面
    this.props.history.push(`/Expense/Manage/ExamineOrder/Form?orderId=${this.applicationOrderId}`);
  }

  // 处理保存
  handleSave = (isNext) => {
    const { form, dispatch } = this.props;
    form.validateFields((errs, values) => {
      if (errs) return;
      // 如果没有已保存的id, 则新建
      if (!this.savedBorrowId) {
        // 调用创建接口
        return dispatch({
          type: 'borrowingRepayment/createBorrowOrder',
          payload: {
            ...values,
            onSuccessCallback: isNext ? this.onNextSuccessCllback : this.onSaveSuccessCallback,
            onFailureCallback: this.onFailureCallback,
            applicationOrderId: this.applicationOrderId,
          },
        });
      }
      // 有id, 则调用编辑接口
      dispatch({
        type: 'borrowingRepayment/updateBorrowOrder',
        payload: {
          ...values,
          onSuccessCallback: isNext ? this.onNextSuccessCllback : this.onSaveSuccessCallback,
          onFailureCallback: this.onFailureCallback,
          id: this.savedBorrowId,
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
    const { form, examineOrderDetail } = this.props;
    const platformCode = examineOrderDetail.platformCodes ? examineOrderDetail.platformCodes[0] : undefined;
    return (
      <div>
        {/* 渲染基本信息 */}
        <BaseInfo form={form} isCreate examineOrderDetail={examineOrderDetail} />
        {/* 渲染借款人信息 */}
        <BorrowerInfo form={form} platformCode={platformCode} />
        {/* 渲染借款信息 */}
        <BorrowInfo form={form} />
        {/* 渲染还款信息 */}
        <RepayInfo form={form} />
        {/* 渲染操作 */}
        {this.renderOperations()}
      </div>
    );
  }
}

function mapStateToProps({ borrowingRepayment: { examineOrderDetail } }) {
  return { examineOrderDetail };
}

export default connect(mapStateToProps)(Form.create()(Create));
