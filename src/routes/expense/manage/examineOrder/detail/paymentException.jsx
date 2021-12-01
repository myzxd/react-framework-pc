/**
 * 付款审批 - 标记异常操作
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, Button } from 'antd';
import { DeprecatedCoreForm } from '../../../../../components/core';
import {
  ExpenseExamineOrderPaymentState,
  ExpenseApprovalType,
 } from '../../../../../application/define';

const { TextArea } = Input;

class PaymentExceptionModal extends Component {

  static propTypes = {
    orderId: PropTypes.string,       // 审批单id
    orderRecordId: PropTypes.string, // 审批单流转记录id
  }

  constructor() {
    super();
    this.state = {
      visible: false, // 是否显示弹窗
    };
  }

  // 显示弹窗
  onShowModal = () => {
    this.setState({ visible: true });
  }

  // 隐藏弹窗
  onHideModal = () => {
    this.setState({ visible: false, detail: {} });
    this.props.form.resetFields();
  }

  // 添加项目
  onSubmit = () => {
    const { orderId, orderRecordId } = this.props;
    this.props.form.validateFields((err, values) => {
      // 错误判断
      if (err) {
        return;
      }

      const params = {
        id: orderId,        // 审批单id
        orderRecordId,      // 审批单流转记录id
        note: values.note,  // 审批意见
        state: ExpenseExamineOrderPaymentState.exception, // 标记付款异常
        onSuccessCallback: this.onSuccessCallback,  // 成功的回调函数
      };
      this.props.dispatch({ type: 'expenseExamineOrder/updateExamineOrderByMarkPaid', payload: params });
    });
  }

  // 成功的回调
  onSuccessCallback = () => {
    // 成功后跳转到审批单列表页 我待办 的tab页
    window.location.href = `/#/Expense/Manage/ExamineOrder?selectedTabKey=${ExpenseApprovalType.penddingVerify}`;
  }

  // 渲染弹窗内容
  renderModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;

    const formItems = [
      {
        label: '付款状态',
        form: ExpenseExamineOrderPaymentState.description(ExpenseExamineOrderPaymentState.exception),
      }, {
        label: '备注',
        form: getFieldDecorator('note', { rules: [{ max: 1000, message: '备注的最大长度不能超过1000' }] })(
          <TextArea placeholder="请输入备注" rows={4} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };

    return (
      <Modal title="操作" visible={visible} onOk={this.onSubmit} onCancel={this.onHideModal} >
        <Form layout="horizontal">
          <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
        </Form>
      </Modal>
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染操作弹窗 */}
        {this.renderModal()}

        {/* 渲染文案 */}
        <Button onClick={this.onShowModal}>标记异常</Button>
      </div>
    );
  }
}

export default Form.create()(PaymentExceptionModal);
