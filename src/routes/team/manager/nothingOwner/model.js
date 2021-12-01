/**
 * 无业主商圈监控
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState } from 'react';
import { Modal, Form } from 'antd';
import moment from 'moment';

import { CoreForm } from '../../../../components/core';
import EmployeeSelect from './components/employee';

function CreateModal(props) {
  const [form] = Form.useForm();
  const [managerDetail, onChangeManager] = useState({});

  // 关闭
  const onCancel = () => {
    form.resetFields();
    onChangeManager({});
    if (props.onChangeModalParams) {
      props.onChangeModalParams({});
    }
  };

  // 确定
  const onOk = () => {
    form.validateFields().then((values) => {
      const payload = {
        id: values.ownerId,
        districts: props.districtId,
        effectTime: Number(moment().format('YYYYMMDD')),
        onSuccessCallBack: () => {
          props.onSuccessCallBack();
          onCancel();
        },
      };
      props.dispatch({ type: 'teamManager/fetchOwnerCreateScope', payload });
    });
  };

  // 渲染form表单
  const renderForm = () => {
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
    const formitems = [
      <Form.Item
        {...layout}
        label="业主姓名"
        name="ownerId"
        rules={[{ required: true, message: '请输入业主姓名' }]}
      >
        <EmployeeSelect
          onChange={(id, info) => onChangeManager(info)}
        />
      </Form.Item>,
      <Form.Item {...layout} label="身份证号">
        {dot.get(managerDetail, 'staff_info.identity_card_id', '--')}
      </Form.Item>,
      <Form.Item {...layout} label="手机号">
        {dot.get(managerDetail, 'staff_info.phone', '--')}
      </Form.Item>,
      <Form.Item {...layout} label="人员ID">
        {dot.get(managerDetail, 'staff_info._id', '--')}
      </Form.Item>,
      <Form.Item {...layout} label="生效日期">
        立即生效
      </Form.Item>,
    ];

    return (
      <CoreForm cols={1} items={formitems} />
    );
  };

  return (
    <Modal
      title="添加业务承揽"
      visible={props.visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form}>
        {/* 渲染form表单 */}
        {renderForm()}
      </Form>
    </Modal>
  );
}
function mapStateToProps({ nothingOwner: { nothingOwnerData } }) {
  return { nothingOwnerData };
}
export default connect(mapStateToProps)(CreateModal);
