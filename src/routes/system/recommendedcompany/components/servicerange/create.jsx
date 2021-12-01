/**
 * 推荐公司管理 - 新增推荐公司服务范围弹窗 system/recommendedcompany/components/servicerange/create
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { DeprecatedCoreForm } from '../../../../../components/core';
import { CommonSelectPlatforms } from '../../../../../components/common';
import SupplierSelect from './supplierselect';

import styles from './style/index.less';

// 空函数
const noop = () => {};

class Create extends Component {

  static propTypes = {
    visible: PropTypes.bool,  // 是否显示
    recommendedCompanyId: PropTypes.string.isRequired, // 推荐公司ID
    serviceRange: PropTypes.array, // 服务范围
    onCreateSuccess: PropTypes.func.isRequired, // 创建成功回调
    onCancel: PropTypes.func.isRequired, // 取消回调
  }

  static defaultProps = {
    visible: false, // 默认隐藏
    recommendedCompanyId: '', // 默认为空
    serviceRange: [], // 服务范围
    onCreateSuccess: noop, // 创建成功回调
    onCancel: noop, // 取消回调
  }

  // 点击取消按钮回调
  onCancelCallback = () => {
    // 重置表单数据
    this.props.form.resetFields();
    this.props.onCancel();
  }

  // 创建成功回调
  onCreateSuccessCallback = () => {
    // 重置表单数据
    this.props.form.resetFields();
    this.props.onCreateSuccess();
  }

  // 平台改变回调
  onChangePlatform = () => {
    // 重置供应商表单选中数据
    this.props.form.resetFields(['supplierIds']);
  }

  // 点击确认回调
  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.dispatch({
        type: 'systemRecommendedCompany/createServiceRange',
        payload: {
          ...values,
          recommendedCompanyId: this.props.recommendedCompanyId,
          onSuccessCallback: this.onCreateSuccessCallback,
        },
      });
    });
  }

  // 渲染表单
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const selectedPlatform = this.props.form.getFieldValue('platformCode') || '';
    const formItems = [
      {
        label: '平台',
        form: getFieldDecorator('platformCode', { rules: [{ required: true, message: '请选择' }] })(
          <CommonSelectPlatforms
            onChange={this.onChangePlatform}
            placeholder="请选择平台"
            className={styles['app-comp-system-create-selector']}
          />,
        ),
      },
      {
        label: '供应商',
        form: getFieldDecorator('supplierIds', { rules: [{ required: true, message: '请选择' }] })(
          <SupplierSelect
            allowClear
            mode="multiple"
            showArrow
            placeholder="请选择供应商"
            className={styles['app-comp-system-create-selector']}
            serviceRange={this.props.serviceRange}
            platform={selectedPlatform}
          />,
        ),
      },
    ];
    const layout = { labelCol: { span: 5 }, wrapperCol: { span: 17 } };
    return <DeprecatedCoreForm items={formItems} layout={layout} />;
  }
  render() {
    const { visible } = this.props;
    return (
      <Modal
        title="新增推荐公司关系"
        cancelText="取消"
        okText="保存"
        visible={visible}
        onOk={this.onSubmit}
        onCancel={this.onCancelCallback}
      >
        {/* 渲染表单 */}
        {this.renderForm()}
      </Modal>
    );
  }
}

export default connect()(Form.create()(Create));
