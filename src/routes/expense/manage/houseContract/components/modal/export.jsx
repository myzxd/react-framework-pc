/**
 * 房屋管理 = 台账导出（弹窗组件）
 */
import React from 'react';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, DatePicker, message } from 'antd';

import { DeprecatedCoreForm } from '../../../../../../components/core';

const { MonthPicker } = DatePicker;

const ExportModal = (props) => {
  const {
    form,
    visible,
    value,
    dispatch = () => {},
    onCancelModal = () => {},
  } = props;

  const {
    getFieldDecorator,
  } = form;

  // 成功回调
  const onSuccessCallback = () => {
    message.success('请求成功');
    onCancelModal && onCancelModal();
  };

  // 提交
  const onSubmit = () => {
    form.validateFields((err, values) => {
      if (err) return;

      const params = {
        ...value,
        ...values,
        onSuccessCallback: () => onSuccessCallback(),
        onFailureCallback: () => onCancelModal(),
      };

      dispatch({ type: 'expenseHouseContract/exportHouseLedger', payload: params });
    });
  };

  // 隐藏弹窗
  const onCancel = () => {
    onCancelModal && onCancelModal();
  };

  // 台账日期禁用
  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  // 弹窗
  const renderModal = () => {
    const formItems = [
      {
        label: '台账导出时间',
        form: getFieldDecorator('exportDate', { rules: [{ required: true, message: '请选择导出时间' }] })(
          <MonthPicker format={'YYYY-MM'} disabledDate={disabledDate} />,
        ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 8 } };

    return (
      <Modal
        title="房屋台账导出"
        visible={visible}
        onOk={onSubmit}
        onCancel={onCancel}
        okText="确认"
        cancelText="取消"
      >
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </Modal>
    );
  };

  return renderModal();
};

export default Form.create()(ExportModal);

