/*
 * code - 审批单 - 添加抄送
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Form, message } from 'antd';
import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';
import { dotOptimal } from '../../../../../../application/utils';

import DepAndPostTreeSelect from './depPostTreeSelect';
import User from './user';

const Index = ({
  className,
  dispatch,
  setCcInfo, // 保存抄送信息到父组件
  recordDetail, // 流转记录
  applicantNodeCcInfo, // 单个节点抄送数据
}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  // 获取单个节点抄送数据
  useEffect(() => {
    dispatch({
      type: 'codeFlow/getApplicantNodeCc',
      payload: {
        flowId: dotOptimal(recordDetail, 'flow_id', undefined),
        nodeId: dotOptimal(recordDetail, 'flow_node_id', undefined),
      },
    });
  }, []);

  // onOk
  const onOk = async () => {
    const values = await form.validateFields();
    // 保存抄送信息到父组件
    setCcInfo(values);
    message.success('设置成功');
    onCancel();
  };

  // drawer关闭并清除数据
  const onCancel = () => {
    // 隐藏弹窗
    setVisible(false);
    // 重置form值
    // form.resetFields();
  };

  // 灵活抄送 - 部门/岗位
  const onChangeFlexibleDep = (_, option) => {
    form.setFieldsValue({
      flexibleDep: option.map((item) => {
        if (dotOptimal(item, 'data-isdepartmentjobid', false)) {
          return { departmentJobid: item.value };
        }
        return { departmentId: item.value };
      }),
    });
  };

  // footer
  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button
          onClick={() => onCancel()}
        >取消</Button>
        <Button
          onClick={() => onOk()}
          type="primary"
          style={{ marginLeft: 10 }}
        >确定</Button>
      </div>
    );
  };

  // 渲染抽屉
  const renderDrawer = () => {
    return (
      <Drawer
        title="抄送设置"
        visible={visible}
        onClose={onCancel}
        getContainer={false}
        width={400}
        footer={renderFooter()}
      >
        <Form
          form={form}
          labelAlign="left"
          className="affairs-flow-basic"
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#282D36',
            }}
          >灵活抄送</span>
          <Form.Item
            label="可抄送部门/岗位"
            name="flexibleDep"
          >
            <DepAndPostTreeSelect
              applicantNodeCcInfo={applicantNodeCcInfo}
              onChange={onChangeFlexibleDep}
            />
          </Form.Item>
          <Form.Item
            label="可抄送成员"
            name="flexibleUser"
          >
            <User
              applicantNodeCcInfo={applicantNodeCcInfo}
            />
          </Form.Item>
        </Form>
      </Drawer>
    );
  };

  return (
    <React.Fragment>
      {renderDrawer()}
      <Button
        onClick={() => setVisible(true)}
        className={className}
      >选择抄送</Button>
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeFlow: { applicantNodeCcInfo },
}) => {
  return { applicantNodeCcInfo };
};
export default connect(mapStateToProps)(Index);

