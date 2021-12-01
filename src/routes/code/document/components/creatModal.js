/**
 * Code/Team审批管理 - 发起审批 - 费控申请 - 弹框
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'antd';

import { CoreForm } from '../../../../components/core';
import DepartmentFlow from './departmentFlow';
import PostFlow from './postFlow';

function CreateModal(props) {
  const {
    values = {},
    dispatch,
    accountDep,
    staffProfileId = undefined,
    relationInfoId = undefined,
    relationInfoName = undefined,
    majorDepartmentId = undefined,
    majorDepartmentName = undefined,
  } = props;
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState({}); // 部门
  const [posts, setPosts] = useState({}); // 岗位
  const departmentList = dot.get(accountDep, 'departmentList', []);
  const postList = dot.get(accountDep, 'postList', []);
    // 人员所属所有部门及岗位
  useEffect(() => {
    dispatch({
      type: 'oaCommon/getEmployeeDepAndPostInfo',
      payload: { accountId: staffProfileId },
    });
  }, [dispatch, staffProfileId]);

  // 取消弹窗回调
  const onCancel = () => {
    if (props.onCancel) {
      props.onCancel();
    }
    form.resetFields();
  };

  // 确定弹窗回调
  const onOk = () => {
    form.validateFields().then(() => {
      const preDepartments = dot.get(values, 'departments', { _id: majorDepartmentId, name: majorDepartmentName });
      const nextDepartments = is.existy(departments) && is.not.empty(departments) ? departments : preDepartments;
      if (props.onOk) {
        props.onOk({
          departments: nextDepartments,
          posts: is.not.empty(posts) ? posts : { _id: relationInfoId, name: relationInfoName },
        });
      }
    });
  };

  // 部门
  const onChangeDepartments = (e, name) => {
    setDepartments({ _id: e, name });
    form.setFieldsValue({ postId: undefined });
  };

  // 岗位
  const onChangePosts = (e, name) => {
    setPosts({ _id: e, name });
  };

  // 渲染具体的表单组件
  const renderFormItem = () => {
    const formItems = [
      <Form.Item
        name="departmentId"
        label="部门"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        rules={[{ required: true, message: '请选择部门' }]}
      >
        <DepartmentFlow
          onChange={onChangeDepartments}
          departmentList={departmentList}
        />
      </Form.Item>,
      <Form.Item
        noStyle
        key="岗位"
        shouldUpdate={
        (prevValues, curValues) => (
          prevValues.departmentId !== curValues.departmentId
        )
      }
      >
        {
          () => {
            return (
              <Form.Item
                name="postId"
                label="岗位"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
                rules={[{ required: true, message: '请选择岗位' }]}
              >
                <PostFlow
                  onChange={onChangePosts}
                  departmentId={form.getFieldValue('departmentId')}
                  postList={postList}
                />
              </Form.Item>
            );
          }
        }
      </Form.Item>,
    ];

    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

  // 渲染表单
  const render = () => {
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    // 判断是否显示弹框
    if (props.visible !== true) {
      return null;
    }
    const initialValues = {
      departmentId: dot.get(values, 'departments._id', majorDepartmentId),
      postId: dot.get(values, 'posts._id', relationInfoId),
    };
    // 表单信息
    return (
      <Modal
        title="切换副岗提报"
        visible={props.visible}
        width="650px"
        onOk={onOk}
        onCancel={onCancel}
      >
        <Form form={form} initialValues={initialValues} {...layout}>
          {/* 渲染表单参数 */}
          {renderFormItem()}
        </Form>
      </Modal>
    );
  };
  return render();
}
function mapStateToProp({ oaCommon: { accountDep } }) {
  return { accountDep };
}

export default connect(mapStateToProp)(CreateModal);
