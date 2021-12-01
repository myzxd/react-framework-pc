/*
 * 三方平台ID - 编辑弹窗
 **/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Modal, Input, DatePicker } from 'antd';
import { DeprecatedCoreForm } from '../../../../../../../../components/core';
import { CustomListType } from '../../../../../../../../application/define';

import style from './style.css';

const { RangePicker } = DatePicker;
class ModalForm extends Component {

  static propTypes = {
    visible: PropTypes.bool,     // 弹窗是否可见
    onCancel: PropTypes.func,    // 隐藏弹窗的回调函数
    entryDate: PropTypes.string, // 合作日期
    customObj: PropTypes.object, // custom_list中单条数据
  }

  static defaultProps = {
    visible: false,     // 弹窗是否可见
    onCancel: () => {}, // 隐藏弹窗的回调函数
    entryDate: '',      // 合作日期
    customObj: {},      // custom_list中单条数据
  }

  // 弹窗提交方法
  onSubmit = (e) => {
    e.preventDefault();
    const { customObj } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { customId, date } = values;
      // 终止的情况下
      if (customObj.state === CustomListType.invalid) {
        this.props.getEditModalData(customObj.staff_id, customObj._id, customId, Number(moment(date[0]).format('YYYYMMDD')), Number(moment(date[1]).format('YYYYMMDD')));
      } else {
        // 点击确定后回传两个参数(三方ID，日期)
        this.props.getEditModalData(customObj.staff_id, customObj._id, customId, Number(moment(date).format('YYYYMMDD')));
      }
      this.onCancel();
    });
  };

  // 弹窗取消方法
  onCancel = () => {
    const { form, onCancel } = this.props;
    // 重置表单数据
    form.resetFields();
    // 调用上层回调
    onCancel(2);
  };

  // 日期限制范围
  disabledDate = (value) => {
    const { entryDate } = this.props;
    return value < moment(entryDate, 'YYYYMMDD') || value > moment();
  }

  // 渲染表单
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { customObj } = this.props;
    const isInvalid = customObj.state === CustomListType.invalid;
    const formItems = [
      {
        label: '第三方平台ID：',
        form: getFieldDecorator('customId',
          {
            rules: [{
              required: true,
              message: '请输入第三方平台ID(只能是数字与字母)',
              pattern: /^[A-Za-z0-9]+$/,
            }],
            initialValue: customObj.custom_id,
          })(
            <Input className={style['app-comp-employee-manage-update-modal-edit']} />,
        ),
      },
      {
        label: '生效日期：',
        form: getFieldDecorator('date',
          {
            rules: [{
              required: true, message: '请输入生效日期',
            }],
            initialValue: isInvalid ? [moment(customObj.start_time, 'YYYYMMDD'), moment(customObj.end_time, 'YYYYMMDD')] : moment(customObj.start_time, 'YYYYMMDD'),
          })(
          isInvalid ?
            <RangePicker className={style['app-comp-employee-manage-update-modal-edit']} disabledDate={this.disabledDate} /> :
            <DatePicker className={style['app-comp-employee-manage-update-modal-edit']} disabledDate={this.disabledDate} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />;
  };

  render() {
    const { visible } = this.props;
    const { onSubmit, onCancel } = this;
    return (
      <Modal title="编辑" visible={visible} onOk={onSubmit} onCancel={onCancel} okText="确认" cancelText="取消">
        <Form>
          {/* 渲染表单 */}
          {this.renderForm()}
        </Form>
      </Modal>
    );
  }
}

export default connect()(Form.create()(ModalForm));
