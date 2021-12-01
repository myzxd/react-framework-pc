/**
 * 共享登记 - 权限 - 添加成员Modal
 */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form } from 'antd';
import { CoreForm } from '../../../../../components/core';
import { CommonSelectDepartmentEmployees } from '../../../../../components/common';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 10,
  },
};

const AccountModal = ({ visible, setAccountVisible, changeValue, accountInfo }) => {
  const [form] = Form.useForm();
  // 成员信息
  const accountData = useRef([]);

  // 表单accountInfo值去重
  const distinct = (info) => {
    const distinctArray = [];
    info.forEach((item) => {
      // 相同id的项去重
      if (distinctArray.some(cur => cur.id === item.id)) return;
      distinctArray.push(item);
    });
    return distinctArray;
  };

  // Modal点击确定事件
  const handleOk = async () => {
    await form.validateFields();
    // 获取指定格式的accountInfo  accountInfo = [{ id: xxx, name: xxx }]
    const accountDataInfo = accountData.current.map(item => ({ id: item.payload.account_id, name: item.payload.name }));
    const accountInfoValue = [...accountDataInfo, ...accountInfo];
    changeValue('accountInfo', distinct(accountInfoValue));
    form.resetFields();
    setAccountVisible(false);
  };

  // Modal关闭事件
  const handleCancel = () => {
    // 隐藏Modal
    setAccountVisible(false);
  };

  // 选择成员组件onChange事件
  const changeDepartmentEmployees = (_, options) => {
    // 成员信息
    accountData.current = options;
  };

  const formItem = [
    <Form.Item
      name="accountIds"
      label="添加成员"
      rules={[{ required: true, message: '请选择' }]}
    >
      <CommonSelectDepartmentEmployees
        mode="multiple"
        showArrow
        placeholder="请选择成员"
        showSearch
        optionFilterProp="children"
        onChange={changeDepartmentEmployees}
      />
    </Form.Item>,
  ];

  return (
    <Modal
      title="添加成员"
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

AccountModal.propTypes = {
  visible: PropTypes.bool,            // Modal显示状态
  setAccountVisible: PropTypes.func,  // 切换Modal显示状态
  changeValue: PropTypes.func,        // 更改自定义表单值
  accountInfo: PropTypes.array,       // 表单lookAccountInfo中的accountInfo值
};
AccountModal.defaultProps = {
  visible: false,
  setAccountVisible: voidFunc,
  changeValue: voidFunc,
  accountInfo: [{}],
};

export default AccountModal;
