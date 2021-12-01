/**
 * 工号管理，新建运力弹窗
 * 未使用
 */
import is from 'is_js';
import moment from 'moment';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, DatePicker } from 'antd';

import { DeprecatedCoreForm } from '../../../../components/core';

const { RangePicker } = DatePicker;

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editRecordId: props.editRecordId || '',   // 编辑的数据id
      editTimeRange: props.editTimeRange || [], // 编辑时间范围
      editTransportId: props.editTransportId || '', // 替跑工号
      disabledDate: props.disabledDate || [],   // 不可选择的时间
      visible: props.visible || false,          // 弹窗是否可见
      onCancle: props.onCancle ? props.onCancle : undefined,   // 隐藏弹窗的回调函数
      onSuccessCallback: props.onSuccessCallback ? props.onSuccessCallback : undefined, // 更新成功的回调函数
    };

    this.private = {
      dispatch: props.dispatch,
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({
      editRecordId: nextProps.editRecordId || '',         // 编辑的数据id
      editTimeRange: nextProps.editTimeRange || [],       // 编辑时间范围
      editTransportId: nextProps.editTransportId || '',   // 替跑工号
      disabledDate: nextProps.disabledDate || [],         // 不可选择的时间
      visible: nextProps.visible,     // 弹窗是否可见
      onCancle: nextProps.onCancle ? nextProps.onCancle : undefined,   // 隐藏弹窗的回调函数
      onSuccessCallback: nextProps.onSuccessCallback ? nextProps.onSuccessCallback : undefined, // 更新成功的回调函数
    });

    // 隐藏弹窗的时候，重置所有表单
    if (nextProps.visible === false) {
      this.componentReset();
    }
  };

  componentWillUnmount = () => {
    this.componentReset();
  }

  // 更新用户
  onSubmit = (e) => {
    const { editRecordId, editTransportId } = this.state;

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { dateRange } = values;
      const params = {
        recordId: editRecordId,       // 替跑记录ID
        transportId: editTransportId, // 运力工号人员ID
        date: dateRange,
        onSuccessCallback: this.onSuccessCallback,
      };

      this.private.dispatch({ type: 'employeeTransport/updateTransportRecord', payload: params });
    });
  }

  // 成功的回调函数
  onSuccessCallback = () => {
    const { onSuccessCallback } = this.state;
    if (onSuccessCallback) {
      onSuccessCallback();
    }
  }

  // 隐藏弹窗
  onCancel = () => {
    const { onCancle } = this.state;
    if (onCancle) {
      onCancle();
    }
  }

  // 不可以选择的时间
  isDateDisable = (current) => {
    const { disabledDate, editTimeRange } = this.state;
    let timeRange = disabledDate || [];
    const exceptTime = editTimeRange;
    timeRange = timeRange.filter(item => (`${item[0]}-${item[1]}` !== `${exceptTime[0]}-${exceptTime[1]}`));

    // 如果不是当月则不能使用
    if (current.month() !== moment().month()) {
      return true;
    }

    // 如果替跑账号时段为空，则可以使用
    if (is.empty(timeRange)) {
      return false;
    }

    // 是否禁用
    let isDisable = false;
    timeRange.forEach((item) => {
      // 时间段的开始和结束
      const startDate = moment(item[0], 'YYYY-MM-DD');
      const endDate = moment(item[1], 'YYYY-MM-DD');

      // 判断是否在时间段之内，并且日期等于开始和结束，都设置为禁用
      if (current.isBetween(startDate, endDate, 'day') || current.isSame(startDate, 'day') || current.isSame(endDate, 'day')) {
        isDisable = true;
      }
    });
    return isDisable;
  }

  // 重置组件
  componentReset = () => {
    this.setState({
      editRecordId: '',   // 编辑的数据id
      editTimeRange: [],  // 编辑时间范围
      transportId: '',    // 替跑工号
    });
    // 重置表单
    this.props.form.resetFields();
  }

  // 渲染创建的表单
  renderContent = () => {
    const { getFieldDecorator } = this.props.form;
    const { editTimeRange } = this.state;
    const value = [
      moment(editTimeRange[0], 'YYYY-MM-DD'),
      moment(editTimeRange[1], 'YYYY-MM-DD'),
    ];
    const formItems = [
      {
        label: '选择时间',
        form: getFieldDecorator('dateRange', { rules: [{ required: true, message: '请选择时间范围' }], initialValue: value })(
          <RangePicker disabledDate={this.isDateDisable} />,
        ),
      },
    ];

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  render = () => {
    const { visible } = this.state;
    const { onSubmit, onCancel } = this;
    return (
      <Modal title="编辑运力" visible={visible} onOk={onSubmit} onCancel={onCancel} okText="确认" cancelText="取消">
        <Form>
          {/* 渲染表单 */}
          {this.renderContent()}
        </Form>
      </Modal>
    );
  };
}

export default Form.create()(ModalForm);
