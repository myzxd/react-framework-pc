/**
 * 推荐公司管理 - 新增推荐公司弹窗 system/recommendedcompany/create
 */
import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { DeprecatedCoreForm } from '../../../components/core';

// 空函数
const noop = () => {};

function Create(props) {
  const { onCreateSuccess } = props;
   // 创建成功回调
  const onCreateSuccessCallback = (response) => {
    // 重置表单数据
    props.form.resetFields();
    onCreateSuccess(response);
  };

  // 点击确认回调
  const onSubmit = () => {
    props.form.validateFields((err, values) => {
      if (err) return;
      props.dispatch({
        type: 'systemRecommendedCompany/createCompany',
        payload: {
          ...values,
          onSuccessCallback: onCreateSuccessCallback,
        },
      });
    });
  };

  // 点击取消按钮回调
  const onCancelCallback = () => {
    // 重置表单数据
    props.form.resetFields();
    props.onCancel();
  };

   // 渲染表单
  const renderForm = () => {
    const { getFieldDecorator } = props.form;
    const formItems = [
      {
        label: '推荐公司',
        form: getFieldDecorator('name',
          { rules: [{ required: true,
            transform: (value) => {
              return value ? value.trim() : undefined;
            },
            message: '请填写' }] },
        )(
          <Input maxLength={100} />,
        ),
      },
      {
        label: '公司简称',
        form: getFieldDecorator('abbreviation')(
          <Input maxLength={100} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 5 }, wrapperCol: { span: 17 } };
    return <DeprecatedCoreForm items={formItems} layout={layout} />;
  };

  const { visible } = props;
  return (
    <Modal
      title="新增推荐公司"
      cancelText="取消"
      okText="保存"
      visible={visible}
      onOk={onSubmit}
      onCancel={onCancelCallback}
    >
      {/* 渲染表单 */}
      {renderForm()}
    </Modal>
  );
}

Create.propTypes = {
  visible: PropTypes.bool,  // 是否显示
  onCreateSuccess: PropTypes.func.isRequired, // 创建成功回调
  onCancel: PropTypes.func.isRequired, // 取消回调
};
Create.defaultProps = {
  visible: false, // 默认隐藏
  onCreateSuccess: noop, // 创建成功回调
  onCancel: noop, // 取消回调
};

export default connect()(Form.create()(Create));
