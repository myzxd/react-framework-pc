/**
 * 控件，界面
 */
import dot from 'dot-prop';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Switch } from 'antd';
import React, { Component } from 'react';
import { CommonTreeSelectDepartments, CommonSelectStaffs } from '../../../../../components/common';
import { DeprecatedCoreForm, CoreContent } from '../../../../../components/core';
import ComponentCustom from './component';

class DemoCoreSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 部门
      departments: {},
      // 职位
      staffs: {},
      // 选中的主要部门id
      selectetId: undefined,

      // 字段数据
      fields: {},

      // 测试字段数据
      field2: { department: 6, staff: 4 },
      field3: { department: 6, staff: 4 },
      field4: { department: 6, staff: 4 },
    };
  }

  // 保存
  onSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      // eslint-disable-next-line
      console.log(values);
    });
  }

  // 变更部门
  onChangeDepartment = (namespace, departmentId) => {
    const { departments } = this.state;
    departments[namespace] = departmentId;
    this.setState({
      departments,
    });

    const fields = {};
    fields[`${namespace}-staff`] = undefined;
    this.props.form.setFieldsValue(fields);
  }

  onChangeStaffs = (namespace, staffId) => {
    const { staffs } = this.state;
    staffs[namespace] = staffId;
    this.setState({
      staffs,
    });
  }

  // 选择开关
  onChangeSwitch = (departmentId, checked) => {
    if (checked) {
      this.setState({ selectetId: departmentId });
    } else {
      this.setState({ selectetId: undefined });
    }
  }

  // 渲染表单
  renderFormItems = () => {
    const { getFieldDecorator } = this.props.form;
    const { departments } = this.state;
    // 标识符，命名空间，用作多组组件的标识
    const namespace = 'namespace-1';

    // 字段名称
    const departmentFieldName = `${namespace}-department`;
    const staffFieldName = `${namespace}-staff`;

    const departmentId = dot.get(departments, namespace);
    const formItems = [
      {
        label: '所属部门',
        form: getFieldDecorator(departmentFieldName, {
          rules: [{
            required: true,
            message: '请选择部门',
          }],
        })(
          <CommonTreeSelectDepartments namespace={departmentFieldName} onChange={(id) => { this.onChangeDepartment(namespace, id); }} />,
        ),
      },
      {
        label: '岗位',
        form: getFieldDecorator(staffFieldName, {
          rules: [{
            required: true,
            message: '请选择岗位',
          }],
        })(
          <CommonSelectStaffs namespace={staffFieldName} departmentId={departmentId} />,
        ),
      },
      {
        label: '设置为主岗位',
        form: getFieldDecorator(staffFieldName)(
          <Switch onChange={(checked) => { this.onChangeSwitch(departmentId, checked); }} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title="表单内组件">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染自定义集成表单
  renderCombineForm = () => {
    const { field2, field3, field4 } = this.state;

    return (
      <CoreContent title="集成组件">
        {/* 使用方式. 外层表单套用直接使用form, 返回的表单名与namespace一致，无需再次使用getFieldDecorator封装 */}
        <ComponentCustom namespace={'fields-2'} form={this.props.form} value={field2} onChange={(value) => { this.setState({ field2: value }); }} />
        <ComponentCustom namespace={'fields-3'} form={this.props.form} value={field3} onChange={(value) => { this.setState({ field3: value }); }} />
        <ComponentCustom namespace={'fields-4'} form={this.props.form} value={field4} onChange={(value) => { this.setState({ field4: value }); }} />
      </CoreContent>
    );
  }

  renderMultiSelect = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '所属部门',
        form: getFieldDecorator('multiple-department', {
          rules: [{
            required: true,
            message: '请选择部门',
          }],
        })(
          <CommonTreeSelectDepartments multiple namespace="multiple-department" />,
        ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title="多选">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 过滤选项，只显示私教部门
  renderCoachFilterSelect = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '所属部门',
        form: getFieldDecorator('filter-department', {
          rules: [{
            required: true,
            message: '请选择部门',
          }],
        })(
          <CommonTreeSelectDepartments multiple isOnlyShowCoach allowClear namespace="filter-department" />,
        ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title="过滤选项，只显示私教部门">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 过滤选项，只显示私教部门
  renderAuthorizeFilterSelect = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '所属部门',
        form: getFieldDecorator('filter-department', {
          rules: [{
            required: true,
            message: '请选择部门',
          }],
        })(
          <CommonTreeSelectDepartments isAuthorized namespace="filter-department" />,
        ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <CoreContent title="过滤选项，只显示有权限的部门">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  render() {
    return (
      <Form layout="horizontal">
        {/* 表单内组件 */}
        { this.renderFormItems() }

        {/* 集成组件 */}
        { this.renderCombineForm() }

        {/* 多选 */}
        { this.renderMultiSelect() }

        {/* 过滤选项，只显示私教部门 */}
        { this.renderCoachFilterSelect() }

        {/* 过滤选项，只显示有权限的部门 */}
        { this.renderAuthorizeFilterSelect() }

        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.onSubmit}>保存</Button>
        </div>
      </Form>

    );
  }
}
export default Form.create()(DemoCoreSelect);
