/**
 * 共享登记 - 权限 - 添加部门Modal
 */
import React, { useRef } from 'react';
import { Modal, Form } from 'antd';
import PropTypes from 'prop-types';
import { CoreForm } from '../../../../../components/core';
import { CommonTreeSelectDepartments } from '../../../../../components/common';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 10,
  },
};

const DepartmentModal = ({ visible, setDepartmentVisible, changeValue, departmentInfo }) => {
  const [form] = Form.useForm();
  // 部门信息
  const departmentData = useRef([]);

  // 表单departmentInfo值去重
  const distinct = (info) => {
    const distinctArray = [];
    info.forEach((item) => {
      if (distinctArray.some(cur => cur.id === item.id)) return;
      distinctArray.push(item);
    });
    return distinctArray;
  };

  // Modal点击确定事件
  const handleOk = async () => {
    await form.validateFields();
    const departmentDataInfo = departmentData.current;
    const departmentInfoValue = [...departmentDataInfo, ...departmentInfo];
    changeValue('departmentInfo', distinct(departmentInfoValue));
    form.resetFields();
    setDepartmentVisible(false);
  };

  // Modal关闭事件
  const handleCancel = () => {
    // 隐藏Modal
    setDepartmentVisible(false);
  };

  // 部门信息组件onChange事件
  const changeDepartmentEmployees = (value, title) => {
    // 获取指定格式的departmentInfo  departmentInfo = [{ id: xxx, name: xxx }]
    departmentData.current = value.map((item, idx) => ({ id: item, name: title[idx] }));
  };

  // 部门搜索模糊搜索
  const onTreeSelectorFilter = (inputValue, nodeValue) => {
    // inputValue去掉收尾空格不为空 && nodeValue 存在  &&  nodeValue的props 存在  &&  nodeValue.props.title包含inputValue
    return (!!(inputValue.trim()
      && nodeValue
      && nodeValue.props
      && nodeValue.props.title.trim().indexOf(inputValue.trim()) !== -1));
  };

  const formItem = [
    <Form.Item
      name="departmentIds"
      label="添加部门"
      rules={[{ required: true, message: '请选择' }]}
    >
      <CommonTreeSelectDepartments
        isAuthorized
        multiple
        onChange={changeDepartmentEmployees}
        filterTreeNode={onTreeSelectorFilter}
      />
    </Form.Item>,
  ];

  return (
    <Modal
      title="添加部门"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        {...layout}
      >
        <CoreForm items={formItem} cols={1} />
      </Form>
    </Modal>
  );
};

const voidFunc = () => {};

DepartmentModal.propTypes = {
  visible: PropTypes.bool,               // Modal显示状态
  setDepartmentVisible: PropTypes.func,  // 切换Modal显示状态
  changeValue: PropTypes.func,           // 更改自定义表单值
  departmentInfo: PropTypes.array,       // 表单lookAccountInfo中的accountInfo值
};
DepartmentModal.defaultProps = {
  visible: false,
  setDepartmentVisible: voidFunc,
  changeValue: voidFunc,
  departmentInfo: [{}],
};

export default DepartmentModal;
