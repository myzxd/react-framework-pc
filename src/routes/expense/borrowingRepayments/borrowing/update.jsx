/**
 * 费用管理 - 借还款管理 - 借款申请单编辑
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Row, Col } from 'antd';
import { connect } from 'dva';

import BaseInfo from './components/form/baseInfo';
import BorrowerInfo from './components/form/borrowerInfo';
import BorrowInfo from './components/form/borrowInfo';
import RepayInfo from './components/form/repayInfo';

class Update extends Component {

  constructor(props) {
    super(props);
    this.applicationOrderId = props.location.query.applicationOrderId; // 审批单号
    this.costOrderId = props.location.query.costOrderId; // 借款单号
  }

  componentDidMount() {
    // 获取借款单详情数据
    this.props.dispatch({
      type: 'borrowingRepayment/fetchBorrowingDetails',
      payload: { id: this.costOrderId },
    });
    // 获取审批单详情数据
    this.props.dispatch({
      type: 'borrowingRepayment/fetchExamineOrderDetail',
      payload: { id: this.applicationOrderId },
    });
  }

  componentWillUnmount() {
    // 清空借款单详情数据
    this.props.dispatch({
      type: 'borrowingRepayment/resetBorrowingDetails',
    });
    // 清空审批单详情数据
    this.props.dispatch({
      type: 'borrowingRepayment/resetExamineOrderDetail',
    });
  }

  // 点击下一步成功回调
  onNextSuccessCllback = () => {
    // 跳转到创建借款审批单页面
    this.props.history.push(`/Expense/Manage/ExamineOrder/Form?orderId=${this.applicationOrderId}`);
  }

  //  请求失败回调
  onFailureCallback = (err) => { console.log(err); }

  // 处理保存
  handleSave = (isNext) => {
    const { form, dispatch } = this.props;
    form.validateFields((errs, values) => {
      if (errs) return;
      dispatch({
        type: 'borrowingRepayment/updateBorrowOrder',
        payload: {
          ...values,
          onSuccessCallback: isNext ? this.onNextSuccessCllback : null,
          onFailureCallback: this.onFailureCallback,
          id: this.costOrderId,
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
    const { form, borrowingDetail, examineOrderDetail } = this.props;

    // 数据为空，返回null
    if (Object.keys(borrowingDetail).length === 0) return null;

    // 审批流平台
    const examinePlatfrom = examineOrderDetail.platformCodes ? examineOrderDetail.platformCodes[0] : undefined;

    // 借款单平台
    const loanPlatform = borrowingDetail ? borrowingDetail.platform_code : undefined;

    // 平台（审批流适用为总部时，借款单没有平台）
    const platformCode = loanPlatform ? loanPlatform : examinePlatfrom;

    return (
      <div>
        {/* 渲染基础信息 */}
        <BaseInfo form={form} borrowingDetail={borrowingDetail} />
        {/* 渲染借款人信息 */}
        <BorrowerInfo form={form} borrowingDetail={borrowingDetail} platformCode={platformCode} />
        {/* 渲染借款信息 */}
        <BorrowInfo form={form} borrowingDetail={borrowingDetail} />
        {/* 渲染还款信息 */}
        <RepayInfo form={form} borrowingDetail={borrowingDetail} />
        {/* 渲染操作信息 */}
        {this.renderOperations()}
      </div>
    );
  }
}

function mapStateToProps({ borrowingRepayment: { borrowingDetail, examineOrderDetail } }) {
  return { borrowingDetail, examineOrderDetail };
}

export default connect(mapStateToProps)(Form.create()(Update));
