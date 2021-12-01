/**
 * 组合控件，岗位以及职位动
 */
import dot from 'dot-prop';
import { Switch } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CommonTreeSelectDepartments, CommonSelectStaffs } from '../../../../../components/common';
import { DeprecatedCoreForm } from '../../../../../components/core';

class ComponentCustom extends Component {
  static propTypes = {
    namespace: PropTypes.string,
    form: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.object,
  }
  static defaultProps = {
    namespace: 'default',
  }

  onChange = (value) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }

    // 判断是否有表单对象，如果有表单对象，则设置表单字段
    const { namespace } = this.props;
    if (this.props.form) {
      const fields = [];
      fields[`${namespace}-department`] = value.department;
      fields[`${namespace}-staff`] = value.staff;
      fields[`${namespace}-isSelected`] = value.isSelected;
      this.props.form.setFieldsValue(fields);
    }
  }

  // 变更部门
  onChangeDepartment = (department) => {
    const { value } = this.props;
    value.department = department;
    value.staff = [];
    this.onChange(value);
  }

  // 变更职位
  onChangeStaff = (staff) => {
    const { value } = this.props;
    value.staff = staff;
    this.onChange(value);
  }

  // 选择是否是主要岗位
  onChangeSwitch = (checked) => {
    const { value } = this.props;
    value.isSelected = checked;
    this.onChange(value);
  }

  // 渲染表单组件
  renderFormItems = () => {
    const { getFieldDecorator } = this.props.form;
    const { namespace, value } = this.props;
    // console.log('change value', value);
    const formItems = [
      {
        label: '所属部门',
        form: getFieldDecorator(`${namespace}.department`, {
          rules: [{
            required: true,
            message: '请选择部门',
          }],
          initialValue: dot.get(value, 'department', []),
        })(
          <CommonTreeSelectDepartments namespace={`${namespace}-department`} onChange={this.onChangeDepartment} />,
        ),
      },
      {
        label: '岗位',
        form: getFieldDecorator(`${namespace}.staff`, {
          rules: [{
            required: true,
            message: '请选择岗位',
          }],
          initialValue: dot.get(value, 'staff', []),
        })(
          <CommonSelectStaffs namespace={`${namespace}-staff`} departmentId={dot.get(value, 'department', [])} onChange={this.onChangeStaff} />,
        ),
      },
      {
        label: '设置为主岗位',
        form: getFieldDecorator(`${namespace}.isSelected`, {
          initialValue: dot.get(value, 'isSelected', false),
        })(
          <Switch onChange={this.onChangeSwitch} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 渲染无表单组件
  renderItems = () => {
    const { namespace, value } = this.state;
    const formItems = [
      {
        label: '所属部门',
        form: <CommonTreeSelectDepartments value={dot.get(value, 'department', [])} namespace={`${namespace}-department`} onChange={this.onChangeDepartment} />,
      },
      {
        label: '岗位',
        form: <CommonSelectStaffs value={dot.get(value, 'staff', [])} namespace={`${namespace}-staff`} departmentId={dot.get(value, 'department', [])} onChange={this.onChangeStaff} />,
      },
      {
        label: '设置为主岗位',
        form: <Switch checked={dot.get(value, 'isSelected', false)} onChange={this.onChangeSwitch} />,
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  render() {
    if (this.props.form) {
      return this.renderFormItems();
    }

    return this.renderItems();
  }
}
export default ComponentCustom;
