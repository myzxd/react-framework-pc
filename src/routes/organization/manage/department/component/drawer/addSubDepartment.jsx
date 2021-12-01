/**
 * 新增子部门Drawer
 */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Switch,
  DatePicker,
  message,
  Alert,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';
import is from 'is_js';
import { CoreForm } from '../../../../../../components/core';
import { authorize } from '../../../../../../application';
import { PageUpload } from '../../../../../oa/document/components';
import { omit, dotOptimal } from '../../../../../../application/utils';
import {
  OrganizationDepartmentChangeType,
} from '../../../../../../application/define';
import {
  CommonModalCopyGive,
  CommonModalFixedCopyGiveDisplay,
} from '../../../../../../components/common';

import FlowPreview from '../../../components/flowPreview';
import AddPost from './components/addPost.jsx';
import Pid from '../pid';

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const { TextArea } = Input;

const voidFunc = () => { };
AddSubDepartment.propTypes = {
  onChangeCheckResult: PropTypes.func, // 更改部门操作校验结果Modal visible、获取部门操作提交事件、获取部门操作校验提示信息
  onChangeAddSubVisable: PropTypes.func, // 更改新增子部门Drawer visible
  departmentDetail: PropTypes.object, // 部门详情
  isUpdate: PropTypes.bool, // 是否是走审批编辑操作
  isAddSubDepartmentApprove: PropTypes.bool, // 添加子部门操作是否走审批
  addSubDepartmentFlowId: PropTypes.string, // 添加子部门操作需要的审批流id
  setAddSubDepartmentFlowId: PropTypes.func, // 更改添加子部门操作需要的审批流id
  onSuccess: PropTypes.func, // 请求成功回调
};
AddSubDepartment.defaultProps = {
  onChangeCheckResult: voidFunc,
  onChangeAddSubVisable: voidFunc,
  setAddSubDepartmentFlowId: voidFunc,
  onSuccess: voidFunc,
  departmentDetail: {},
  isUpdate: false,
  isAddSubDepartmentApprove: false,
  addSubDepartmentFlowId: '',
};

function AddSubDepartment(props) {
  const {
    onChangeCheckResult,
    onChangeAddSubVisable,
    departmentDetail,
    isUpdate,
    checkDepartmentUpdate,
    createOaSubDepartment,
    updateOaSubDepartment,
    createDepartment,
    isAddSubDepartmentApprove,
    addSubDepartmentFlowId,
    submitOrder,
    setAddSubDepartmentFlowId,
    getOrganizationFlowList,
    onSuccess,
  } = props;

  const [form] = Form.useForm();
  // 保存按钮loading
  const [isLoading, setIsLoading] = useState(false);
  // 保存按钮disabled
  const [isDisabled, setIsDisabled] = useState(false);
  // 提交并继续添加按钮loading
  const [isNextLoading, setIsNextLoading] = useState(false);
  // 提交并继续添加按钮disabled
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  // 是否显示无适应审批流的提示
  const [isShowNotFlow, setIsShowNotFlow] = useState(false);
  // 当前部门调整是否走审批 || 审批编辑操作
  const isApprove = isAddSubDepartmentApprove || isUpdate;

  // departmentDetail变化时更新回填的表单值
  useEffect(() => {
    setFormValue();
  }, [departmentDetail, isApprove]);

  // 回填表单数据
  const setFormValue = () => {
    let _jobList = [{
      organizationCount: isApprove ? 0 : undefined,
    }];
    if (is.existy(departmentDetail.job_list) && Array.isArray(departmentDetail.job_list) && is.existy(departmentDetail.job_list) && Array.isArray(departmentDetail.job_list).length > 0) {
      _jobList = dotOptimal(departmentDetail, 'job_list', [{}]).map(item => ({
        jobId: item.job_id,
        organizationCount: item.organization_count,
        description: item.description,
      }));
    }
    // 是否是走审批编辑操作
    if (isUpdate) {
      form.setFieldsValue({
        name: dotOptimal(departmentDetail, 'department_info.name', undefined), // 部门名称
        superior: dotOptimal(departmentDetail, 'target_parent_department_info._id', '0'), // 上级部门
        code: dotOptimal(departmentDetail, 'department_info.code', undefined), // 部门编号
        effectiveDate: dotOptimal(departmentDetail, 'take_effect_date', undefined) // 生效日期
          ? moment(`${dotOptimal(departmentDetail, 'take_effect_date')}`)
          : undefined,
        reason: dotOptimal(departmentDetail, 'note', undefined), // 原因
        isAddPost: dotOptimal(departmentDetail, 'job_list', []).length > 0, // 是否添加岗位
        // 岗位信息
        jobList: _jobList,
        assetKeys: PageUpload.getInitialValue(departmentDetail, 'asset_infos', {}), // 附件
      });
    } else {
      form.setFieldsValue({
        superior: dotOptimal(departmentDetail, '_id', '0'), // 上级部门
        code: dotOptimal(departmentDetail, 'code', undefined), // 部门编号
        name: undefined, // 部门名称
        isAddPost: true, // 是否添加岗位
        jobList: [{
          organizationCount: isApprove ? 0 : undefined,
        }], // 岗位信息
        effectiveDate: moment(), // 生效日期
        reason: undefined, // 原因
        assetKeys: [], // 附件
      });
    }
  };

  // 请求成功后执行的操作
  const onSuccessFunc = (isNextFlg) => {
    message.success('请求成功');
    // 判断是否是提交并继续添加
    setIsLoading(false);
    setIsNextDisabled(false);
    setIsDisabled(false);
    // 判断是否是保存并继续添加
    isNextFlg || onChangeAddSubVisable(false);
    // 重置表单值(审批编辑无需清空表单值-直接关闭)
    if (!isUpdate) {
      form.setFieldsValue({
        name: undefined, // 部门名称
        isAddPost: true, // 是否添加岗位
        jobList: [{
          organizationCount: isApprove ? 0 : undefined,
        }], // 岗位信息
        effectiveDate: moment(), // 生效日期
        reason: undefined, // 原因
        superior: dotOptimal(departmentDetail, '_id', '0'), // 上级部门
        code: dotOptimal(departmentDetail, 'code', undefined), // 部门编号
        assetKeys: [], // 附件
      });
    }
    onSuccess();
  };

  // 提交表单数据
  const onSubmit = async (isNext) => {
    const formRes = await form.getFieldsValue();
    const payload = {
      name: dotOptimal(formRes, 'name', undefined), // 部门名称
      code: dotOptimal(formRes, 'code', undefined), // 部门编号
      jobList: dotOptimal(formRes, 'jobList', undefined), // 岗位信息
    };

    let res;
    // 审批编辑操作
    if (isUpdate) {
      res = await updateOaSubDepartment({
        ...payload,
        oaOrganizationOrderId: dotOptimal(departmentDetail, '_id', undefined),
        targetParentDepartmentId: dotOptimal(formRes, 'superior', undefined),
        effectiveDate: dotOptimal(formRes, 'effectiveDate', undefined) && Number(formRes.effectiveDate.format('YYYYMMDD')),
        reason: dotOptimal(formRes, 'reason', undefined),
        assetKeys: dotOptimal(formRes, 'assetKeys', undefined),
      });
    // 添加子部门操作需要走审批
    } else if (isAddSubDepartmentApprove) {
      res = await createOaSubDepartment({
        ...payload,
        addSubDepartmentFlowId,
        targetParentDepartmentId: dotOptimal(formRes, 'superior', undefined),
        effectiveDate: dotOptimal(formRes, 'effectiveDate', undefined) && Number(formRes.effectiveDate.format('YYYYMMDD')),
        reason: dotOptimal(formRes, 'reason', undefined),
        assetKeys: dotOptimal(formRes, 'assetKeys', undefined),
      });
    // 添加子部门操作不需要走审批
    } else {
      res = await createDepartment({
        ...payload,
        superior: dotOptimal(formRes, 'superior', undefined),
      });
    }

    // 请求成功
    if (res) {
      // 审批编辑操作 || 添加子部门操作需要走审批
      if (isUpdate || isAddSubDepartmentApprove) {
        // 事务性审批单提报
        const submitOrderRes = await submitOrder({
          id: res.oa_application_order_id,
          copyGive: formRes.copyGive,
        });
        // 请求成功
        if (submitOrderRes) {
          // 请求成功后执行的操作
          onSuccessFunc(isNext);
          return true;
        }
        setIsLoading(false);
        setIsDisabled(false);
        setIsNextDisabled(false);
        return false;
      }
      setIsLoading(false);
      setIsDisabled(false);
      setIsNextDisabled(false);
      // 请求成功后执行的操作
      onSuccessFunc(isNext);
      return true;
    }
    setIsLoading(false);
    setIsDisabled(false);
    setIsNextDisabled(false);
    return false;
  };

  // 点击保存
  const onSave = async () => {
    const formRes = await form.validateFields();
    // 保存按钮loading
    setIsLoading(true);
    // 提交并继续添加按钮disabled
    setIsNextDisabled(true);
    const payload = {
      organizationSubType: OrganizationDepartmentChangeType.create, // 组织架构-部门/编制调整 子类型
      targetParentDepartmentId: dotOptimal(formRes, 'superior', undefined), // 上级部门id
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
        onChangeCheckResult(true, onSubmit, res.hint_list, `新增部门申请(${dotOptimal(formRes, 'name', '--')})`);
      }
      setIsLoading(false);
      setIsDisabled(false);
      setIsNextDisabled(false);
      return;
    }
    setIsLoading(false);
    setIsDisabled(false);
    setIsNextDisabled(false);
  };

  // 点击提交并继续添加
  const onSaveNext = async () => {
    const formRes = await form.validateFields();
    // 提交并继续添加按钮loading
    setIsNextLoading(true);
    // 保存按钮disabled
    setIsDisabled(true);
    const payload = {
      organizationSubType: OrganizationDepartmentChangeType.create, // 组织架构-部门/编制调整 子类型
      targetParentDepartmentId: dotOptimal(formRes, 'superior', undefined),
    };
    // 部门操作前校验
    const res = await checkDepartmentUpdate(payload);
    // 请求成功
    if (res) {
      // 通过校验
      if (res.ok) {
        await onSubmit(true);
      // 未通过校验，展示校验提示信息
      } else {
        onChangeCheckResult(true, async () => await onSubmit(true), res.hint_list, `新增部门申请(${dotOptimal(formRes, 'name', '--')})`);
      }
      setIsNextLoading(false);
      setIsDisabled(false);
      return;
    }
    setIsNextLoading(false);
    setIsDisabled(false);
  };

  // 修改上级部门操作
  const onChangePid = async (val) => {
    form.setFieldsValue({ superior: val });
    // 添加子部门操作是否走审批
    if (isAddSubDepartmentApprove) {
      if (!val) {
        setIsDisabled(false);
        setIsNextDisabled(false);
        // 是否显示无适应审批流的提示
        setIsShowNotFlow(false);
        return;
      }
      // 获取组织架构审批流list
      const res = await getOrganizationFlowList({
        departmentId: val,
        organizationSubType: OrganizationDepartmentChangeType.create,
      });
      // 接口请求成功 200
      if (res && res.data) {
        // data.0.flow_template_records.0._id字段存在，说明存在适应的审批流
        if (dotOptimal(res, 'data.0.flow_template_records.0._id', '')) {
          setAddSubDepartmentFlowId(dotOptimal(res, 'data.0.flow_template_records.0._id'));
          setIsDisabled(false);
          setIsNextDisabled(false);
          // 是否显示无适应审批流的提示
          setIsShowNotFlow(false);
        } else {
          setIsDisabled(true);
          setIsNextDisabled(true);
          // 是否显示无适应审批流的提示
          setIsShowNotFlow(true);
          return;
        }
      }
      // 接口请求失败 400
      if (res && res.zh_message) {
        return message.error(res.zh_message);
      }
    }
  };

  // 渲染需要展示的表单字段
  const renderForm = () => {
    const formItems = [
      <Form.Item
        label="部门名称"
        name="name"
        rules={[
          { required: true, message: '请输入部门名称' },
          { min: 2, message: '部门名称必须超过2个字' },
          { max: 32, message: '部门名称必须小于32个字' },
          { pattern: /^\S+$/, message: '部门名称不能包含空格' },
        ]}
      >
        <Input placeholder="请输入部门名称" />
      </Form.Item>,
      <Form.Item
        label="上级部门"
        name="superior"
        rules={[{ required: true, message: '请选择上级部门' }]}
      >
        <Pid
          onChangePid={onChangePid}
          disabled={isUpdate}
        />
      </Form.Item>,
      <Form.Item
        label="部门编号"
        name="code"
        rules={[
          { required: true, message: '请输入部门编号' },
          () => ({
            validator(rule, val) {
              const reg = /^[0-9a-zA-Z-]{1,}$/;
              if (!val || reg.test(val)) return Promise.resolve();
              return Promise.reject('请输入数字、字母或中横线');
            },
          }),
        ]}
      >
        <Input placeholder="请输入部门编号" />
      </Form.Item>,
      <Form.Item
        label="是否添加岗位"
        name="isAddPost"
        valuePropName="checked"
      >
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>,
      <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.isAddPost !== curValues.isAddPost}>
        {
          ({ getFieldValue }) => {
            return getFieldValue('isAddPost')
              ? <AddPost form={form} formName="jobList" isApprove={isApprove} />
              : null;
          }
        }
      </Form.Item>,
    ];

    // 当前部门调整是否走审批 || 审批编辑操作
    if (isApprove) {
      formItems.splice(3, 0,
        <Form.Item
          label="生效日期"
          name="effectiveDate"
          rules={[{ required: true, message: '请选择生效日期' }]}
        >
          <DatePicker
            disabledDate={current => current && current < moment().endOf('day').subtract(1, 'days')}
          />
        </Form.Item>,
      );
      formItems.push(
        <Form.Item
          label="新增原因"
          name="reason"
          rules={[{ required: true, message: '请输入调整原因' }]}
        >
          <TextArea
            placeholder="请输入新增原因"
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
      );
      // 创建展示抄送，编辑不展示
      if (!isUpdate) {
        // 审批流id
        const flowId = addSubDepartmentFlowId || dotOptimal(departmentDetail, 'oa_application_flow_id', undefined);
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
            // 重置表单值
            setFormValue();
            onChangeAddSubVisable(false);
          }}
        >取消</Button>
        <Button
          onClick={onSave}
          type="primary"
          loading={isLoading}
          disabled={isDisabled}
          style={{ marginLeft: 10 }}
        >提交</Button>
        {
          !isUpdate
            ? <Button
              onClick={onSaveNext}
              type="primary"
              loading={isNextLoading}
              disabled={isNextDisabled}
              style={{ marginLeft: 10 }}
            >提交并继续添加</Button>
            : null
        }
      </div>
    );
  };

  // 过滤props
  const omitedProps = omit([
    'dispatch',
    'departmentDetail',
    'onChangeCheckResult',
    'onChangeAddSubVisable',
    'isUpdate',
    'checkDepartmentUpdate',
    'createOaSubDepartment',
    'updateOaSubDepartment',
    'createDepartment',
    'isAddSubDepartmentApprove',
    'addSubDepartmentFlowId',
    'submitOrder',
    'onSuccess',
  ], props);

  // 审批流预览组件props
  const flowProps = {
    flowId: addSubDepartmentFlowId || dotOptimal(departmentDetail, 'oa_application_flow_id', undefined), // 审批流id
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
      title="新增子部门"
      width="400"
      onClose={() => {
        // 重置表单值
        setFormValue();
        onChangeAddSubVisable(false);
      }}
      footer={renderFooter()}
      {...omitedProps}
    >
      {/* 修改上级部门的提示 */}
      {
        isShowNotFlow
          ? <Alert message="当前上级部门无适用审批流，请联系流程管理员" type="info" showIcon banner style={{ marginBottom: 10 }} />
          : null
      }
      <Form
        form={form}
        initialValues={{ isAddPost: true }}
        {...formLayout}
      >
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
  // 审批-新增子部门-创建
  createOaSubDepartment: payload => dispatch({
    type: 'department/createOaSubDepartment',
    payload,
  }),
  // 新建部门
  createDepartment: payload => dispatch({
    type: 'department/createDepartment',
    payload,
  }),
  // 审批-新增子部门-编辑
  updateOaSubDepartment: payload => dispatch({
    type: 'department/updateOaSubDepartment',
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
  // 获取组织架构审批流list
  getOrganizationFlowList: payload => dispatch({
    type: 'department/getOrganizationFlowList',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddSubDepartment);
