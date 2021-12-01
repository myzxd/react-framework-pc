/**
 * 穿梭框
 */
import React, { useEffect } from 'react';
import is from 'is_js';
import { Modal, Form, Input } from 'antd';

import { CoreForm } from '../../../../components/core';
import ComponentPostUser from './postUser';

import style from './style.css';

function CommonTransfor(props) {
  const {
    targetFlowNodeName,
    accountIds: propsAccountIds = [],
    postIds: propsPostIds = [],
  } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      targetName: targetFlowNodeName,
      postUser: {
        accountIds: propsAccountIds,
        postIds: propsPostIds,
      },
    });
    return () => {
      form.setFieldsValue({
        targetName: '',
        postUser: {
          accountIds: [],
          postIds: [],
        },
      });
    };
  }, [targetFlowNodeName, propsAccountIds, propsPostIds]);

  // 穿梭框确认
  const onOkModal = () => {
    form.validateFields().then((values) => {
      const { targetName, postUser = {} } = values;
      const { postIds = [], accountIds = [] } = postUser;
      // 如果穿梭框不为空并且节点名称不为空 就将值传给外面的函数
      props.onSelect && props.onSelect(accountIds, postIds, targetName);
      props.onCancel && props.onCancel();  // 穿梭框取消
    });
  };

  // 穿梭框取消
  const onCancelModal = () => {
    props.onCancel && props.onCancel();
    form.resetFields();
  };

  const renderForm = () => {
    const formItems = [
      <Form.Item
        label="节点名称设置"
        name="targetName"
        rules={[
          { required: true, message: '审批节点名称不能为空' },
          { pattern: /^\S+$/, message: '审批节点名称不能包含空格' },
        ]}
      >
        <Input
          placeholder="请输入节点名称"
          className={style['app-comp-expense-transfor-node-name']}
        />
      </Form.Item>,
      <Form.Item
        label="节点审批人员设置"
        name="postUser"
        rules={[
          { required: true },
          {
            validator: (_, val) => {
              const { accountIds, postIds } = val;
              const flag = is.not.existy(accountIds) || is.empty(accountIds) ? postIds : accountIds;
              if (is.not.existy(flag) || is.empty(flag)) {
                return Promise.reject(new Error('节点审批人员至少要有一个用户或者岗位'));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <ComponentPostUser />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };
  return (
    <Modal
      title="审批流设置"
      visible={props.visible}
      onOk={onOkModal}
      onCancel={onCancelModal}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
      >
        {renderForm()}
      </Form>
    </Modal>
  );
}

export default CommonTransfor;
