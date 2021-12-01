/**
 * 员工档案-部门及岗位自定义表单-表单项
 */
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Switch, Button, message } from 'antd';
import { DeprecatedCoreForm } from '../../../../../../../components/core';
import {
  CommonTreeSelectDepartments,
  CommonSelectStaffs,
} from '../../../../../../../components/common';
import Operate from '../../../../../../../application/define/operate';
import { cryptoRandomString } from '../../../../../../../application/utils';

class ContactPersonItem extends Component {
  static propTypes = {
    item: PropTypes.object,
    index: PropTypes.number,
    isEdit: PropTypes.bool,
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  constructor() {
    super();
    this.private = {
      namespace: cryptoRandomString(32),
    };
  }

  // 修改所属部门
  onChangeDepartment = (department) => {
    this.changeCurrent({
      department,
      post: undefined,
      podepartmentJobRelationId: undefined,
    });
  }

  // 修改岗位
  onChangePost = (podepartmentJobRelationId, selectedOptions) => {
    this.changeCurrent({ post: dot.get(selectedOptions, 'props.item.job_id', ''), podepartmentJobRelationId });
  }

  // 修改是否设置为主岗位
  onChangeSelected = (isSelected) => {
    const { value, index } = this.props;
    if (value.some((item, idx) => idx === index && !item.post)) {
      return message.error('请选择岗位');
    }
    this.changeCurrent({ isSelected, isOrganization: true });
  }

  // 不计入占编数统计
  onChangeIsOrganization = (isOrganization) => {
    this.changeCurrent({ isOrganization: !isOrganization });
  }

  // 部门搜索模糊搜索
  onTreeSelectorFilter = (inputValue, nodeValue) => {
    // inputValue去掉收尾空格不为空 && nodeValue 存在  &&  nodeValue的props 存在  &&  nodeValue.props.title包含inputValue
    return (!!(inputValue.trim()
      && nodeValue
      && nodeValue.props
      && nodeValue.props.title.trim().indexOf(inputValue.trim()) !== -1));
  }

  // 增加项
  addItem = () => {
    const { onChange, value } = this.props;
    onChange([...value, {
      isOrganization: true,
    }]);
  }

  // 减少项
  cutItem = () => {
    const { onChange, value, index } = this.props;
    value.splice(index, 1);
    onChange(value);
  }

  // 修改当前项的内容
  changeCurrent = (valueObj) => {
    const { value, onChange, index } = this.props;
    const currentValue = value.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          ...valueObj,
        };
      }
      // 只能设置一个主岗位
      if (Object.keys(valueObj).includes('isSelected')) {
        return {
          ...item,
          isSelected: false,
          isOrganization: true,
        };
      }
      return item;
    });
    onChange(currentValue);
  }

  // 渲染操作按钮
  renderOperateButton = () => {
    const { index, value } = this.props;
    if (value.length === 1) {
      return <Button shape="circle" icon={<PlusOutlined />} onClick={this.addItem} />;
    }
    if (index === value.length - 1) {
      return (
        <React.Fragment>
          <Button shape="circle" style={{ marginRight: 10 }} icon={<MinusOutlined />} onClick={this.cutItem} />
          <Button shape="circle" icon={<PlusOutlined />} onClick={this.addItem} />
        </React.Fragment>
      );
    }
    return <Button shape="circle" icon={<MinusOutlined />} onClick={this.cutItem} />;
  }

  render() {
    const { item, isEdit } = this.props;
    const formItems = [
      {
        label: '所属部门',
        span: 6,
        layout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
        },
        form: <CommonTreeSelectDepartments
          placeholder="请选择"
          isAuthorized
          value={item.department}
          onChange={this.onChangeDepartment}
          namespace={this.private.namespace}
          filterTreeNode={this.onTreeSelectorFilter}
        />,
      },
      {
        label: '岗位',
        span: 6,
        layout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
        },
        form: <CommonSelectStaffs
          placeholder="请选择"
          value={item.podepartmentJobRelationId}
          departmentId={item.department}
          onChange={this.onChangePost}
          namespace={this.private.namespace}
        />,
      },
      {
        label: '设置为主岗位',
        span: 3,
        layout: {
          labelCol: { span: 16 },
          wrapperCol: { span: 8 },
        },
        form: <Switch checked={item.isSelected} onChange={this.onChangeSelected} />,
      },
      {
        label: '',
        span: 3,
        layout: {
          labelCol: { span: 0 },
          wrapperCol: { span: 24 },
        },
        form: this.renderOperateButton(),
      },
    ];
    // 判断是否显示不计入占编数统计
    if (item.isSelected && Operate.canOperateEmployeeCreateIsOrganization()) {
      formItems.splice(3, 0, {
        label: '不计入占编数统计',
        span: 4,
        layout: {
          labelCol: { span: 16 },
          wrapperCol: { span: 8 },
        },
        form: <Switch
          disabled={!item.isSelected}
          checked={!item.isOrganization}
          onChange={this.onChangeIsOrganization}
        />,
      });
    }
    const formDetailItems = [
      {
        label: '所属部门',
        form: <span>{item.department || '--'}</span>,
      },
      {
        label: '岗位',
        form: <span>{item.post || '--'}</span>,
      },
      {
        label: '设置为主岗位',
        form: <span>{item.isSelected || '--'}</span>,
      },

    ];
    // 判断是否显示不计入占编数统计
    if (item.isSelected && Operate.canOperateEmployeeCreateIsOrganization()) {
      formDetailItems.push(
        {
          label: '不计入占编数统计',
          form: <span>{item.isOrganization || '--'}</span>,
        },
      );
    }
    const layout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    return (
      <React.Fragment>
        <DeprecatedCoreForm items={isEdit ? formItems : formDetailItems} layout={layout} />
      </React.Fragment>
    );
  }
}

export default ContactPersonItem;
