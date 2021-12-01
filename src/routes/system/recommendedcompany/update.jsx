/**
 * 推荐公司管理 - 编辑推荐公司基本信息弹窗 system/recommendedcompany/update
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

function Update(props) {
  const { visible, dataSource, onCreateSuccess } = props;


  // 创建成功回调
  const onCreateSuccessCallback = () => {
    // 重置表单数据
    props.form.resetFields();
    onCreateSuccess();
  };

  // 点击确认回调
  const onSubmit = () => {
    const { _id: recommendedCompanyId } = dataSource;
    props.form.validateFields((err, values) => {
      if (err) return;
      props.dispatch({
        type: 'systemRecommendedCompany/updateCompany',
        payload: {
          recommendedCompanyId,
          onSuccessCallback: onCreateSuccessCallback,
          ...values,
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
    const { name, abbreviation } = dataSource;
    const formItems = [
      {
        label: '推荐公司',
        form: getFieldDecorator('name', {
          initialValue: name,
          rules: [{ required: true, transform: value => value.trim(), message: '请填写' }],
        })(
          <Input maxLength={100} />,
        ),
      },
      {
        label: '公司简称',
        form: getFieldDecorator('abbreviation', { initialValue: abbreviation })(
          <Input maxLength={100} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 5 }, wrapperCol: { span: 17 } };
    return <DeprecatedCoreForm items={formItems} layout={layout} />;
  };

  return (
    <Modal
      title="编辑推荐公司信息"
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


Update.propTypes = {
  dataSource: PropTypes.object.isRequired, // 数据源
  visible: PropTypes.bool,  // 是否显示
  onCreateSuccess: PropTypes.func.isRequired, // 创建成功回调
  onCancel: PropTypes.func.isRequired, // 取消回调
};

Update.defaultProps = {
  dataSource: {}, // 默认数据源为空对象
  visible: false, // 默认隐藏
  onCreateSuccess: noop, // 创建成功回调
  onCancel: noop, // 取消回调
};
export default connect()(Form.create()(Update));
