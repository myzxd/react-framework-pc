/**
 * 人员管理 - 合同归属管理 - 员工合同甲方 - 新建弹窗
 */
import React, { useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Input,
  Select,
  Radio,
} from 'antd';
import {
  AllowElectionSign,
  ThirdCompanyState,
  ContractAttributionType,
} from '../../../../application/define';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 14 } };

const { Option } = Select;

const BillDetailPay = ({
  dispatch,
  getCompanies,
}) => {
  const [form] = Form.useForm();

  // visible
  const [visible, setVisible] = useState(false);

  // 成功回调
  const onSuccessCallback = () => {
    setVisible(false);
    form.resetFields();
    getCompanies && getCompanies();
  };

  // onOk
  const onOk = async () => {
    const formVals = await form.validateFields();
    dispatch({
      type: 'systemManage/createCompany',
      payload: {
        ...formVals,
        type: ContractAttributionType.employee, // 类型
        onSuccessCallback,
      },
    });
  };

  // 关闭弹窗并清空数据
  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  // form
  const renderForm = () => {
    const initialValues = {
      state: ThirdCompanyState.on,
    };

    return (
      <Form
        form={form}
        initialValues={initialValues}
        layout="horizontal"
      >
        <Form.Item
          label="公司名称"
          name="name"
          rules={[
            { required: true, message: '请填写内容' },
          ]}
          {...formLayout}
        >
          <Input maxLength={50} placeholder="请填写内容" />
        </Form.Item>
        <Form.Item
          label="是否允许电子签约"
          name="allowElectionSign"
          rules={[
            { required: true, message: '请选择' },
          ]}
          {...formLayout}
        >
          <Select>
            <Option
              value={AllowElectionSign.yes}
            >
              {AllowElectionSign.description(AllowElectionSign.yes)}
            </Option>
            <Option
              value={AllowElectionSign.no}
            >
              {AllowElectionSign.description(AllowElectionSign.no)}
            </Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="法人"
          name="legalPerson"
          rules={[
            { required: true, message: '请填写内容' },
          ]}
          {...formLayout}
        >
          <Input maxLength={50} placeholder="请填写内容" />
        </Form.Item>
        <Form.Item
          label="统一社会信用代码"
          name="creditNo"
          rules={[
            { required: true, message: '请填写内容' },
          ]}
          {...formLayout}
        >
          <Input maxLength={50} placeholder="请填写内容" />
        </Form.Item>
        <Form.Item
          label="地址"
          name="address"
          rules={[
            { required: true, message: '请填写内容' },
          ]}
          {...formLayout}
        >
          <Input maxLength={100} placeholder="请填写内容" />
        </Form.Item>
        <Form.Item
          label="电话"
          name="phone"
          rules={[
            { required: true, pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' },
          ]}
          {...formLayout}
        >
          <Input maxLength={11} placeholder="请填写内容" />
        </Form.Item>
        <Form.Item
          label="状态"
          name="state"
          rules={[
            { required: true, message: '请选择状态' },
          ]}
          {...formLayout}
        >
          <Radio.Group>
            <Radio
              value={ThirdCompanyState.on}
            >
              {ThirdCompanyState.description(ThirdCompanyState.on)}
            </Radio>
            <Radio
              value={ThirdCompanyState.off}
            >
              {ThirdCompanyState.description(ThirdCompanyState.off)}
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    );
  };


  return (
    <React.Fragment>
      <Modal
        title="创建合同归属公司"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      >
        {renderForm()}
      </Modal>
      <Button
        onClick={() => setVisible(true)}
        type="primary"
      >新建</Button>
    </React.Fragment>
  );
};

export default BillDetailPay;
