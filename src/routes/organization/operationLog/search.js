/**
 * 组织架构 - 操作日志 - 查询条件 Organization/OperationLog
 */
import React from 'react';
import { Form, DatePicker, Input } from 'antd';
import moment from 'moment';

import { CoreSearch, CoreContent } from '../../../components/core';
import {
  CommonTreeSelectDepartments,
} from '../../../components/common';
import ComponentOperationObject from './componentOperationObject';

const { RangePicker } = DatePicker;

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowEmployeeNameForm: false, // 是否展示「姓名」form
      isShowDepartmentForm: false, // 是否展示「部门」form
    };
    this.form = null;
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.form = form;
  }

  // 重置
  onReset = () => {
    // 重置默认值
    const initDate = [moment().subtract('days', 6), moment()];

    const params = {
      page: 1,
      limit: 30,
      date: initDate,
    };
    this.form.setFieldsValue({
      date: initDate || undefined,
    });

    // 重置搜索
    if (this.props.onSearch) {
      this.props.onSearch(params);
    }
  }

  // 搜索
  onSearch = (values) => {
    const params = {
      page: 1,
      limit: 30,
      ...values,
    };
    if (this.props.onSearch) {
      this.props.onSearch(params);
    }
  }

  // 操作对象onChange
  onChangeOperator = (val) => {
    // 姓名表单是否展示
    let isShowEmployeeNameForm = false;
    let isShowDepartmentForm = false;

    if (val && Array.isArray(val)) {
      // 操作对象为「普通员工档案」,姓名可展示
      if (val.includes('staff_profile')) {
        isShowEmployeeNameForm = true;
      }

      // 操作对象为「部门管理」、「部门业务信息」、「数据权限信息」,姓名可展示
      if (val.includes('department_manage')
        || val.includes('biz_data_business')
        || val.includes('biz_label_manage')
      ) {
        isShowDepartmentForm = true;
      }
    }

    this.setState({
      isShowDepartmentForm,
      isShowEmployeeNameForm,
    });
  };

  render = () => {
    const { operations } = this.state;
    const { date } = this.props;
    const items = [
      <Form.Item label="时间" name="date">
        <RangePicker style={{ width: '100%' }} />
      </Form.Item>,
      <Form.Item label="操作对象" name="domain">
        <ComponentOperationObject
          allowClear
          showSearch
          showArrow
          enableSelectAll
          mode="multiple"
          optionFilterProp="children"
          placeholder="请选择操作对象"
          onChange={this.onChangeOperator}
        />
      </Form.Item>,
      <Form.Item label="操作者" name="name">
        <Input allowClear placeholder="请输入操作者" />
      </Form.Item>,
    ];

    // 姓名
    if (this.state.isShowEmployeeNameForm) {
      items[items.length] = (
        <Form.Item label="姓名" name="employeeName">
          <Input allowClear placeholder="请输入" />
        </Form.Item>
      );
    }

    // 部门
    if (this.state.isShowDepartmentForm) {
      items[items.length] = (
        <Form.Item label="部门" name="department">
          <CommonTreeSelectDepartments
            namespace="operationLog"
            isAuthorized
          />
        </Form.Item>
      );
    }

    const props = {
      initialValues: { date },
      items,
      operations,
      onReset: this.onReset,
      onSearch: this.onSearch,
      expand: true,
      onHookForm: this.onHookForm,
    };
    return (
      <CoreContent>
        <CoreSearch {...props} />
      </CoreContent>
    );
  }
}

export default Search;
