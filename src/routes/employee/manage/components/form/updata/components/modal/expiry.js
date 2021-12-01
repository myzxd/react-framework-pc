/*
 * 三方平台ID - 终止弹窗
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Modal, DatePicker } from 'antd';
import { DeprecatedCoreForm } from '../../../../../../../../components/core';

import style from './style.css';

class ModalForm extends Component {

  static propTypes = {
    visible: PropTypes.bool,     // 弹窗是否可见
    onCancel: PropTypes.func,    // 隐藏弹窗的回调函数
    customObj: PropTypes.object, // custom_list中单条数据
  }

  static defaultProps = {
    visible: false,     // 弹窗是否可见
    onCancel: () => {}, // 隐藏弹窗的回调函数
    customObj: {},      // custom_list中单条数据
  }

  // 弹窗提交方法
  onSubmit = (e) => {
    const { staff_id, _id } = this.props.customObj;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      const { date } = values;
      this.props.getExpiryModalData(staff_id, _id, Number(moment(date).format('YYYYMMDD')));
      this.onCancel();
    });
  }

  // 弹窗取消方法
  onCancel = () => {
    const { onCancel } = this.props;
    const { form } = this.props;
    // 重置表单数据
    form.resetFields();
    // 调用上层回调
    if (onCancel) {
      onCancel(4);
    }
  }

  // 日期限制范围
  disabledDate = (value) => {
    const { customObj } = this.props;
    return value < moment(customObj.start_time, 'YYYYMMDD') || value > moment();
  }

  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '终止日期：',
        form: getFieldDecorator('date', { initialValue: null, rules: [{ required: true, message: '请输入解除日期' }] })(
          <DatePicker className={style['app-comp-employee-manage-update-modal-expiry-date']} disabledDate={this.disabledDate} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    return <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />;
  }

  render() {
    const { visible } = this.props;
    const { onSubmit, onCancel } = this;

    return (
      <Modal title="终止" visible={visible} onOk={onSubmit} onCancel={onCancel} okText="确认" cancelText="取消">
        <Form>
          <p className={style['app-comp-employee-manage-update-modal-expiry']}>确定要终止该第三方平台ID与该人员的关系？</p>
          {/* 渲染表单 */}
          {this.renderForm()}
        </Form>
      </Modal>
    );
  }
}

export default connect()(Form.create()(ModalForm));
