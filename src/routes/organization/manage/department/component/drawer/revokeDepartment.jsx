/**
 * 裁撤部门
 */
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  message,
} from 'antd';
import { connect } from 'dva';
import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';
import PropTypes from 'prop-types';

import { CoreForm } from '../../../../../../components/core';
import {
  CommonModalCopyGive,
  CommonModalFixedCopyGiveDisplay,
} from '../../../../../../components/common';
import { PageUpload } from '../../../../../oa/document/components';
import { omit, dotOptimal } from '../../../../../../application/utils';
import {
  OrganizationDepartmentChangeType,
} from '../../../../../../application/define';
import { authorize } from '../../../../../../application';

import FlowPreview from '../../../components/flowPreview';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const { TextArea } = Input;

const voidFunc = () => { };
RevokeDepartment.propTypes = {
  onChangeCheckResult: PropTypes.func, // 更改部门操作校验结果Modal visible、获取部门操作提交事件、获取部门操作校验提示信息
  onChangeRevokeDepartmentVisable: PropTypes.func, // 更改裁撤部门Drawer visable
  departmentDetail: PropTypes.object, // 部门详情
  isUpdate: PropTypes.bool, // 是否是走审批编辑操作
  revokeDepartmentFlowId: PropTypes.string, // 裁撤部门操作需要的审批流id
  onSuccess: PropTypes.func, // 请求成功回调
};
RevokeDepartment.defaultProps = {
  onChangeCheckResult: voidFunc,
  onChangeRevokeDepartmentVisable: voidFunc,
  onSuccess: voidFunc,
  departmentDetail: {},
  isUpdate: false,
  revokeDepartmentFlowId: '',
};

function RevokeDepartment(props) {
  const {
    onChangeCheckResult,
    onChangeRevokeDepartmentVisable,
    departmentDetail,
    createRevokeDepartment,
    updateRevokeDepartment,
    checkDepartmentUpdate,
    isUpdate,
    revokeDepartmentFlowId,
    submitOrder,
    onSuccess,
  } = props;
  const [form] = Form.useForm();
  // 保存按钮loading
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormValue();
  }, [departmentDetail]);

   // 回填表单数据
  const setFormValue = () => {
    // 是否是走审批编辑操作
    if (isUpdate) {
      form.setFieldsValue({
        reason: dotOptimal(departmentDetail, 'note', undefined),
        assetKeys: PageUpload.getInitialValue(departmentDetail, 'asset_infos', {}),
      });
    } else {
      form.setFieldsValue({
        reason: undefined,
        assetKeys: undefined,
      });
    }
  };

  // 提交表单数据
  const onSubmit = async () => {
    const formRes = await form.getFieldsValue();
    const payload = {
      reason: dotOptimal(formRes, 'reason', undefined),
      assetKeys: dotOptimal(formRes, 'assetKeys', undefined),
    };
    let res;
    // 审批编辑操作
    if (isUpdate) {
      res = await updateRevokeDepartment({
        ...payload,
        oaOrganizationOrderId: dotOptimal(departmentDetail, '_id', undefined),
      });
    } else {
      res = await createRevokeDepartment({
        ...payload,
        revokeDepartmentFlowId,
        departmentId: dotOptimal(departmentDetail, '_id', undefined),
      });
    }
    // 请求成功
    if (res) {
      // 事务性审批单提报
      const submitOrderRes = await submitOrder({
        id: res.oa_application_order_id,
        copyGive: formRes.copyGive,
      });
      // 请求成功
      if (submitOrderRes) {
        message.success('请求成功');
        // 更改裁撤部门Drawer visable
        onChangeRevokeDepartmentVisable(false);
        // 重置表单值(审批编辑无需清空表单值-直接关闭)
        if (!isUpdate) {
          form.setFieldsValue({
            reason: undefined,
            assetKeys: [],
          });
        }
        setIsLoading(false);
        // 请求成功回调
        onSuccess();
        return true;
      }
      setIsLoading(false);
      return false;
    }
    setIsLoading(false);
    return false;
  };

  // 点击确定按钮
  const onOk = async () => {
    // 表单提交校验
    await form.validateFields();
    // 保存按钮loading
    setIsLoading(true);
    const payload = {
      organizationSubType: OrganizationDepartmentChangeType.revoke, // 组织架构-部门/编制调整 子类型
      departmentId: dotOptimal(departmentDetail, '_id', undefined), // 部门id
    };
    // 审批编辑时需要oaApplicationOrderId（审批单id）
    if (isUpdate) {
      payload.oaApplicationOrderId = dotOptimal(departmentDetail, 'oa_application_order_info._id', undefined);
    }
    // 部门操作前校验
    const res = await checkDepartmentUpdate(payload);
    // 请求成功
    if (res) {
      // 通过校验
      if (res.ok) {
        // 提交数据
        await onSubmit();
        return;
      // 未通过校验，展示校验提示信息
      } else {
        // 保存按钮loading
        setIsLoading(true);
        onChangeCheckResult(
          true,
          onSubmit,
          res.hint_list,
          `调整类型：组织架构-裁撤部门(${isUpdate ? dotOptimal(departmentDetail, 'department_info.name', '--') : dotOptimal(departmentDetail, 'name', '--')})`,
        );
      }
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  // 渲染需要展示的表单字段
  const renderForm = () => {
    const formItems = [
      <Form.Item
        label="部门名称"
        name="name"
      >
        {isUpdate ? dotOptimal(departmentDetail, 'department_info.name', '--') : dotOptimal(departmentDetail, 'name', '--')}
      </Form.Item>,
      <Form.Item
        label="部门编号"
        name="code"
      >
        {isUpdate ? dotOptimal(departmentDetail, 'department_info.code', '--') : dotOptimal(departmentDetail, 'code', '--')}
      </Form.Item>,
      <Form.Item
        label="裁撤原因"
        name="reason"
        rules={[{ required: true, message: '请输入裁撤原因' }]}
      >
        <TextArea
          placeholder="请输入裁撤原因"
          rows={4}
        />
      </Form.Item>,
      <Form.Item
        label="附件"
        name="assetKeys"
      >
        <PageUpload
          domain={PageUpload.UploadDomains.OAUploadDomain}
        />
      </Form.Item>,
    ];
    // 创建展示抄送，编辑不展示
    if (!isUpdate) {
      // 审批流id
      const flowId = revokeDepartmentFlowId || dotOptimal(departmentDetail, 'oa_application_flow_id', undefined);
      formItems.push(
        <Form.Item
          label="固定抄送"
        >
          <CommonModalFixedCopyGiveDisplay flowId={flowId} />
        </Form.Item>,
        <Form.Item
          label="抄送"
          name="copyGive"
        >
          <CommonModalCopyGive flowId={flowId} />
        </Form.Item>,
      );
    }
    return (
      <CoreForm className="affairs-flow-basic" items={formItems} cols={1} />
    );
  };

  // 渲染footer
  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button
          onClick={() => {
            setFormValue();
            onChangeRevokeDepartmentVisable(false);
          }}
        >取消</Button>
        <Button
          onClick={() => { onOk(); }}
          type="primary"
          loading={isLoading}
          style={{ marginLeft: 10 }}
        >提交</Button>
      </div>
    );
  };
  // 过滤props
  const omitedProps = omit([
    'dispatch',
    'onChangeCheckResult',
    'isUpdate',
    'onChangeRevokeDepartmentVisable',
    'departmentDetail',
    'createRevokeDepartment',
    'updateRevokeDepartment',
    'checkDepartmentUpdate',
    'isRevokeDepartmentApprove',
    'submitOrder',
    'onSuccess',
    'revokeDepartmentFlowId',
  ], props);

  // 审批流预览组件props
  const flowProps = {
    flowId: revokeDepartmentFlowId || dotOptimal(departmentDetail, 'oa_application_flow_id', undefined), // 审批流id
    departmentId: isUpdate
      ? dotOptimal(departmentDetail, 'department_info._id', undefined)
      : dotOptimal(departmentDetail, '_id', undefined), // 实际申请部门
    specialDepartmentId: isUpdate
      ? dotOptimal(departmentDetail, 'department_info._id', undefined)
      : dotOptimal(departmentDetail, '_id', undefined), // 实际申请部门
    accountId: authorize.account.id, // 实际申请人
  };

  return (
    <Drawer
      title="裁撤部门"
      width="400"
      onClose={() => {
        setFormValue();
        onChangeRevokeDepartmentVisable(false);
      }}
      footer={renderFooter()}
      {...omitedProps}
    >
      <Form form={form} {...formLayout}>
        {renderForm()}
      </Form>
      {/* 审批流预览 */}
      {
        omitedProps.visible ? <FlowPreview {...flowProps} /> : null
      }
    </Drawer>
  );
}

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
  // 审批-裁撤部门-新增
  createRevokeDepartment: payload => dispatch({
    type: 'department/createRevokeDepartment',
    payload,
  }),
  // 审批-裁撤部门-编辑
  updateRevokeDepartment: payload => dispatch({
    type: 'department/updateRevokeDepartment',
    payload,
  }),
  // 部门操作前校验
  checkDepartmentUpdate: payload => dispatch({
    type: 'department/checkDepartmentUpdate',
    payload,
  }),
  // 事务性审批单提报
  submitOrder: payload => dispatch({
    type: 'oaCommon/submitOrder',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RevokeDepartment);
