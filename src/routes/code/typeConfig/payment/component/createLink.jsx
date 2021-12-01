/**
 * Code/Team审批管理 - 付款类型配置管理 - 添加链接弹窗
 */
import React, { useState } from 'react';
import {
  Form,
  Input,
  message,
  Button,
  Radio,
} from 'antd';
import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';

import {
  CodeMatterType,
} from '../../../../../application/define';
import {
  CoreForm,
} from '../../../../../components/core';
import Flow from './flow';
import LinkIcon from './linkIcon';
import Subject from './subject';
import Team from './team';
import DepAndPost from './depAndPost';

const { TextArea } = Input;

// form layout
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const CreateFlowLink = ({
  visible,
  onClose,
  dispatch,
  matterId, // 事项id
  tabKey, // 类型（code || team）
}) => {
  const [form] = Form.useForm();
  // 部门与岗位的集合
  const [depAndPostVals, setDepAndPost] = useState([]);
  // flow id
  const [flowId, setFlowId] = useState(undefined);
  // subject list
  const [subject, setSubject] = useState(undefined);
  // 是否特定范围提报
  const [isAll, setIsAll] = useState(true);
  // button loading
  const [isLoading, setIsLoading] = useState(false);

  // onOk
  const onOk = async () => {
    const vals = await form.validateFields();
    setIsLoading(true);
    const res = await dispatch({
      type: 'codeMatter/createMatterLink',
      payload: { ...vals, matterId, depAndPostVals },
    });

    if (res && res._id) {
      message.success('请求成功');
      form.resetFields();
      setIsLoading(false);
      onClose && onClose(res._id);
    } else if (res && res.zh_message) {
      message.error(res.zh_message);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  // flow onChange
  const onChangeFlowId = (val) => {
    setFlowId(val);
    // reset team
    form.setFieldsValue({ team: undefined, code: undefined });
  };

  // flow onChange
  const onChangeSubject = (val) => {
    setSubject(val);
    // reset team
    form.setFieldsValue({ team: undefined, code: undefined });
  };

  // dep onChange
  const onChangeDep = (_, op, extra) => {
    const curVal = extra.triggerNode.props;
    setDepAndPost([...depAndPostVals, curVal]);
  };

  // 是否特定范围提报
  const onChangeIsAll = (val) => {
    setIsAll(val.target.value);
    setDepAndPost([]);
  };

  // form item
  const renderForm = () => {
    // 适用code或适用team
    const applicationType = Number(tabKey) === CodeMatterType.code ?
      (
        <Form.Item
          label="选择CODE"
          name="code"
          rules={[
            { required: true, message: '请选择' },
          ]}
          {...formLayout}
        >
          <Team
            flowId={flowId}
            subject={subject}
            tabKey={tabKey}
          />
        </Form.Item>
      ) : (
        <Form.Item
          label="选择TEAM"
          name="team"
          rules={[
            { required: true, message: '请选择' },
          ]}
          {...formLayout}
        >
          <Team
            flowId={flowId}
            subject={subject}
            tabKey={tabKey}
          />
        </Form.Item>
    );

    const formItems = [
      <Form.Item
        label="标题"
        name="title"
        rules={[
          { required: true, message: '请输入' },
          { pattern: /^\S+$/, message: '标题不能包含空格' },
          { type: 'string', max: 20, message: '名称最多20字符' },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入" allowClear />
      </Form.Item>,
      <Form.Item
        label="说明"
        name="note"
        rules={[
          { required: true, message: '请输入' },
        ]}
        className="code-flow-link-textArea"
        {...formLayout}
      >
        <TextArea allowClear placeholder="请输入" rows={4} />
      </Form.Item>,
      <Form.Item
        label="icon"
        name="icon"
        rules={[
          { required: true, message: '请选择' },
        ]}
        {...formLayout}
      >
        <LinkIcon />
      </Form.Item>,
      <div>审批流选择</div>,
      <Form.Item
        label="审批流"
        name="flowId"
        rules={[
          { required: true, message: '请选择' },
        ]}
        {...formLayout}
      >
        <Flow
          type={tabKey}
          onChange={onChangeFlowId}
        />
      </Form.Item>,
      <div>选项</div>,
      <Form.Item
        label="启动选择科目"
        name="subject"
        rules={[
          { required: true, message: '请选择' },
        ]}
        {...formLayout}
      >
        <Subject
          type={tabKey}
          onChange={onChangeSubject}
        />
      </Form.Item>,
      applicationType,
      <Form.Item
        label="是否特定范围提报"
        name="isAll"
        {...formLayout}
      >
        <Radio.Group onChange={onChangeIsAll}>
          <Radio value={false}>是</Radio>
          <Radio value>否</Radio>
        </Radio.Group>
      </Form.Item>,
    ];

    !isAll && (
      formItems[formItems.length] = (
        <Form.Item
          label="部门及岗位"
          name="dep"
          rules={[
            { required: true, message: '请选择' },
          ]}
          {...formLayout}
        >
          <DepAndPost multiple onChange={onChangeDep} />
        </Form.Item>
      )
    );

    return (
      <Form
        form={form}
        className="affairs-flow-basic"
        initialValues={{
          isAll: true,
        }}
      >
        <CoreForm items={formItems} cols={1} />
      </Form>
    );
  };

  // footer
  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button
          onClick={() => onClose()}
        >取消</Button>
        <Button
          loading={isLoading}
          onClick={() => onOk()}
          type="primary"
          style={{ marginLeft: 10 }}
        >确定</Button>
      </div>
    );
  };

  return (
    <Drawer
      title="添加链接"
      visible={visible}
      onClose={() => onClose()}
      width={500}
      footer={renderFooter()}
    >
      {renderForm()}
    </Drawer>
  );
};

export default CreateFlowLink;
