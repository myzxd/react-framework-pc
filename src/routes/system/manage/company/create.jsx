/**
 * 合同归属设置列表, 创建弹窗
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, Select, Radio, Form } from 'antd';

import { CoreForm } from '../../../../components/core';
import { ThirdCompanyState, AllowElectionSign } from '../../../../application/define';
// import { CommonSelectPlatforms, CommonSelectSuppliers } from '../../../../components/common';

const { Option } = Select;

const CreateModal = (props = {}) => {
  const {
    onSubmit, // 提交参数
    onCancel,  // 可见状态变更回调
    visible,         // 是否显示弹窗
  } = props;
  const [form] = Form.useForm();

  // 监听弹窗是否显示状态
  useEffect(() => {
    onReset();
  }, [visible]);

  // 添加项目
  const onClickSubmit = async () => {
    const formValues = await form.validateFields();
    onSubmit(formValues);
  };

  // 取消
  const onHideCancel = () => {
    // 回调函数，提交
    if (onCancel) {
      onCancel();
    }

    // 重置
    onReset();
  };


  // 重制state
  const onReset = () => {
    form.resetFields();
  };

  // 更改平台事件
  // onChangePlatforms = () => {
  // const { resetFields } = this.props.form;
  // resetFields(['supplier']);
  // }

  // 渲染搜索区域
  // const platforms = getFieldValue('platforms');
  const layout = { labelCol: { span: 8 }, wrapperCol: { span: 14 } };
  const formItems = [
    <Form.Item
      label="公司名称"
      name="name"
      rules={[{ required: true, message: '请填写内容' }]}
      {...layout}
    >
      <Input maxLength={50} placeholder="请填写内容" />
    </Form.Item>,
    <Form.Item
      label="是否允许电子签约"
      name="allowElectionSign"
      rules={[{ required: true, message: '请选择' }]}
      {...layout}
    >
      <Select>
        <Option value={`${AllowElectionSign.yes}`}>{AllowElectionSign.description(AllowElectionSign.yes)}</Option>
        <Option value={`${AllowElectionSign.no}`}>{AllowElectionSign.description(AllowElectionSign.no)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="法人"
      name="legalPerson"
      rules={[{ required: true, message: '请填写内容' }]}
      {...layout}
    >
      <Input maxLength={50} placeholder="请填写内容" />
    </Form.Item>,
    <Form.Item
      label="统一社会信用代码"
      name="creditNo"
      rules={[{ required: true, message: '请填写内容' }]}
      {...layout}
    >
      <Input maxLength={50} placeholder="请填写内容" />
    </Form.Item>,
    <Form.Item
      label="地址"
      name="address"
      rules={[{ required: true, message: '请填写内容' }]}
      {...layout}
    >
      <Input maxLength={100} placeholder="请填写内容" />
    </Form.Item>,
    <Form.Item
      label="电话"
      name="phone"
      rules={[{ required: true, pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' }]}
      {...layout}
    >
      <Input placeholder="请填写内容" maxLength={11} />
    </Form.Item>,
    <Form.Item
      label="状态"
      name="state"
      rules={[{ required: true, message: '请填选择状态' }]}
      {...layout}
    >
      <Radio.Group>
        <Radio value={ThirdCompanyState.on}>{ThirdCompanyState.description(ThirdCompanyState.on)}</Radio>
        <Radio value={ThirdCompanyState.off}>{ThirdCompanyState.description(ThirdCompanyState.off)}</Radio>
      </Radio.Group>
    </Form.Item>,
  ];

  return (
    <Modal title="创建合同归属公司" visible={visible} onOk={onClickSubmit} onCancel={onHideCancel} okText="确认" cancelText="取消">
      <Form layout="horizontal" form={form}>
        <CoreForm items={formItems} cols={1} />
      </Form>
    </Modal>
  );
};

CreateModal.propTypes = {
  onSubmit: PropTypes.func, // 提交参数
  onCancel: PropTypes.func,  // 可见状态变更回调
  visible: PropTypes.bool,         // 是否显示弹窗
};

CreateModal.defaultProps = {
  onSubmit: () => { }, // 提交参数
  onCancel: () => { },  // 可见状态变更回调
  visible: false,         // 是否显示弹窗
};

export default CreateModal;
