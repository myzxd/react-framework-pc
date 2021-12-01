/*
 * 三方平台ID - 新增弹窗
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Modal, Input, DatePicker } from 'antd';
import { DeprecatedCoreForm } from '../../../../../../../../components/core';

import style from './style.css';

class ModalForm extends Component {

  static propTypes = {
    visible: PropTypes.bool, // 弹窗是否可见
    onCancel: PropTypes.func,   // 隐藏弹窗的回调函数
    entryDate: PropTypes.string, // 合作日期
  }

  static defaultProps = {
    visible: false, // 弹窗是否可见
    onCancel: () => {},   // 隐藏弹窗的回调函数
    entryDate: '', // 合作日期
  }

  // 弹窗提交方法
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      const { customId, date } = values;
      this.props.getCreateModalData(customId, Number(moment(date).format('YYYYMMDD')));
      this.onCancel();
    });
  }

  // 弹窗取消方法
  onCancel = () => {
    const { form, onCancel } = this.props;
    // 重置表单数据
    form.resetFields();
    // 调用上层回调
    if (onCancel) {
      onCancel(1);
    }
  }

  // 日期限制范围
  disabledDate = (value) => {
    const { entryDate } = this.props;
    return value < moment(entryDate, 'YYYYMMDD') || value > moment();
  }

  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { entryDate } = this.props;
    const dataSource = dot.get(this.props, 'dataSource', []);
    const dateValue = dataSource.length === 0 ? moment(entryDate, 'YYYY-MM-DD') : undefined;
    const formItems = [
      {
        label: '第三方平台ID',
        form: getFieldDecorator('customId', {
          rules: [{
            required: true,
            message: '请输入第三方平台ID(只能是数字与字母)',
            pattern: /^[A-Za-z0-9]+$/,
          }],
        })(
          <Input className={style['app-comp-employee-manage-update-modal-create-custom']} />,
        ),
      },
      {
        label: '生效日期：',
        form: getFieldDecorator('date', {
          rules: [{
            required: true,
            message: '请输入生效日期',
          }],
          initialValue: dateValue,
        })(
          <DatePicker className={style['app-comp-employee-manage-update-modal-create-date']} disabledDate={this.disabledDate} disabled={dataSource.length === 0} />,
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
      <Modal title="新增" visible={visible} onOk={onSubmit} onCancel={onCancel} okText="确认" cancelText="取消">
        <Form>
          {/* 渲染表单 */}
          {this.renderForm()}
        </Form>
      </Modal>
    );
  }
}

export default connect()(Form.create()(ModalForm));
