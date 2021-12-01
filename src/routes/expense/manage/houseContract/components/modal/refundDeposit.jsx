/**
 * 退还押金（弹窗）
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, InputNumber } from 'antd';
import { DeprecatedCoreForm } from '../../../../../../components/core';
import { Unit } from '../../../../../../application/define';

class RefundDeposit extends Component {
  static propTypes = {
    form: PropTypes.object,
    isShowRefundDeposit: PropTypes.bool,
    onCancel: PropTypes.func,
    dispatch: PropTypes.func,
    contractId: PropTypes.string,
    unrefundedPledgeMoney: PropTypes.number,
  }

  static defaultProps = {
    form: {},
    isShowRefundDeposit: false,
    onCancel: () => {},
    dispatch: () => {},
    contractId: '',
    unrefundedPledgeMoney: 0,
  }

  constructor() {
    super();
    this.state = {
    };
  }

  // 隐藏弹窗
  onCancel = () => {
    const { onCancel, form } = this.props;

    // 重置表单
    const { resetFields } = form;
    resetFields();

    // 隐藏弹窗
    onCancel && onCancel();
  }

  // 获取数据的回调函数
  onSuccessCallback = (res) => {
    window.location.href = `/#/Expense/Manage/ExamineOrder/Form?orderId=${res.application_order_id}`;
  }

  // 添加项目
  onSubmit = () => {
    const { form, dispatch } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      // 错误判断
      if (err) {
        return;
      }

      // 合同id
      const { contractId } = this.props;

      // 参数
      const params = {
        id: contractId, // 合同id
        pledge: 'close_pledge', // actuon
        returnpledgemoney: values.returnpledgemoney * 100, // 退回押金
      };

      dispatch({
        type: 'expenseHouseContract/createApprovalSheet',
        payload: {
          params,
          onSuccessCallback: this.onSuccessCallback,
        },
      });

      // 隐藏弹窗
      this.onCancel();
    });
  }

  // 渲染modal
  renderModal = () => {
    const { isShowRefundDeposit, form, unrefundedPledgeMoney } = this.props;
    const { getFieldDecorator } = form;

    // form项
    const formItems = [
      {
        label: '退回押金',
        form: getFieldDecorator('returnpledgemoney', {
          initialValue: Unit.exchangePriceToYuan(unrefundedPledgeMoney),
          rules: [{ required: true, message: '请填写正确金额' }] },
        )(
          <InputNumber
            min={0}
            max={Unit.exchangePriceToYuan(unrefundedPledgeMoney)}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />,
        ),
      },
    ];

    // 布局
    const layout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } };

    return (
      <Modal
        title="退押金信息"
        visible={isShowRefundDeposit}
        onOk={this.onSubmit}
        onCancel={this.onCancel}
        okText="确认"
        cancelText="取消"
      >
        <Form layout="horizontal">
          <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
        </Form>
      </Modal>
    );
  }

  // 渲染搜索区域
  render = () => {
    return this.renderModal();
  }
}

export default Form.create()(RefundDeposit);
