/**
 * 业主管理 - 弹窗 - 选择业主
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState } from 'react';
import { Modal, Form, message } from 'antd';

import EmployeeSelect from './employeeOld';
import { CoreForm } from '../../../../components/core';

function OwnModal(props) {
  const { dispatch, onOwnerHandleCancel, isOwnerModal, district } = props;
  const [form] = Form.useForm();
  // 获取业主信息
  const [managerDetail, setManagerDetail] = useState({});
  const [loading, setLoading] = useState(false);

  // 更新业主信息
  const onChangeManager = (id, info) => {
    setManagerDetail(info);
  };

  // 提交
  const onCreateModalHandleOk = function () {
    form.validateFields().then((values) => {
      setLoading(true);
      const payload = {
        ...values,
        district,
        id: managerDetail._id,
        onFailureCallback: (result) => {
          setLoading(false);
          return message.error(`请求错误：${result.zh_message}`);
        },
        onSuccessCallback: () => {
          setLoading(false);
          // 重置表单
          form.resetFields();
          setManagerDetail({});
          // 调取回凋
          if (onOwnerHandleCancel) {
            onOwnerHandleCancel();
          }
          // 更新列表
          dispatch({
            type: 'teamManager/fetchTeamManagers',
            payload: { meta: { page: 1, limit: 30 } },
          });
        },
      };
      dispatch({
        type: 'teamManager/createTeamManager',
        payload,
      });
    });
  };

  // 新增业主弹窗点击取消回调
  const onCreateModalHandleCancel = () => {
    form.resetFields();
    setLoading(false);
    setManagerDetail({});
    // 调取回凋
    if (onOwnerHandleCancel) {
      onOwnerHandleCancel();
    }
  };

  // 渲染表单
  const renderFrom = function () {
    const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
    const formItems = [
      <Form.Item
        label="身份证号"
        name="idCard"
        help={managerDetail._id ? '' : '暂无档案的新业主，输入身份证号后点“确定”即邀请加入'}
        rules={[{ required: true, message: '请输入身份证号' }]}
        {...formLayoutC3}
      >
        <EmployeeSelect onChange={onChangeManager} />
      </Form.Item >,
      <Form.Item
        label="姓名"
        {...formLayoutC3}
      >
        {dot.get(managerDetail, 'name', '--')}
      </Form.Item >,
      <Form.Item
        label="手机号"
        {...formLayoutC3}
      >
        {dot.get(managerDetail, 'phone', '--')}
      </Form.Item >,
    ];
    return (
      <Modal
        title="选择业主"
        visible={isOwnerModal}
        confirmLoading={loading}
        onOk={onCreateModalHandleOk}
        onCancel={onCreateModalHandleCancel}
      >
        <CoreForm items={formItems} cols={1} />
      </Modal>
    );
  };

  return (
    <Form layout="horizontal" form={form}>
      {/* 渲染表单 */}
      {renderFrom()}
    </Form>
  );
}


const mapStateToProps = ({ teamManager }) => {
  return { teamManager };
};

export default connect(mapStateToProps)(OwnModal);
