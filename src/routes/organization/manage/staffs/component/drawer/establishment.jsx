/**
 * 组织架构 - 部门管理 - 岗位编制 - 增编/减编（drawer）
 */
import React, { useState, useRef } from 'react';
import moment from 'moment';
import {
  Button,
  Form,
  InputNumber,
  Input,
  DatePicker,
  message,
} from 'antd';
import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';

import {
  Unit,
  OrganizationDepartmentChangeType,
  OrganizationDepartmentChangeState,
} from '../../../../../../application/define';
import { CoreForm } from '../../../../../../components/core';
import { PageUpload } from '../../../../../oa/document/components';
import { authorize, utils } from '../../../../../../application';
import {
  CommonModalCopyGive,
  CommonModalFixedCopyGiveDisplay,
} from '../../../../../../components/common';

import AllPost from '../../../components/departmentPost';
import FlowPreview from '../../../components/flowPreview';
import CheckResultModal from '../../../components/checkResultModal';

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const { TextArea } = Input;

// 操作类型
const OptionType = {
  Save: 'save', // 保存
  SaveAndCarryOn: 'saveAndCarryOn', // 保存并继续
};

const Establishment = ({
  dispatch,
  visible,
  onClose,
  flowId, // 审批流id
  isApprove = false, // 是否走审批流程
  departmentDetail = {}, // 部门
  countPostList = [], // 编制数与占编数相同的岗位列表
  organizationSubType,
  isUpdate = false, // 是否为编辑
  updateInitValue = {}, // 编辑时，默认岗位数据
  breakDepartmentList, // 刷新列表
}) => {
  const [form] = Form.useForm();
  // 表单操作类型
  const optionType = useRef(OptionType.Save);
  // save button loading
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  // SaveAndCarryOn button loading
  const [saveAndCarryOnBtnLoading, setSaveAndCarryOnBtnLoading] = useState(false);

  // 错误提示校验modal visible
  const [messageVisible, setMessageVisible] = useState(false);
  // 错误提示
  const [checkMessage, setCheckMessage] = useState([]);
  // 岗位信息
  const [postInfo, setPostInfo] = useState(
    isUpdate ?
      // 编辑
      utils.dotOptimal(updateInitValue)
      // 新建
      : utils.dotOptimal(countPostList, '0', {}),
  );

  // save button disabled
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(false);
  // SaveAndCarryOn button disabled
  const [saveAndCarryOnBtnDisabled, setSaveAndCarryOnBtnBtnDisabled] = useState(false);

  const {
    _id: departmentId, // 部门id
  } = departmentDetail;

  // drawer title
  let title = '';
  // 编制数label
  let peopleNumLabel = '岗位编制数';
  // 增编
  if (organizationSubType === OrganizationDepartmentChangeType.add) {
    title = '增编';
    peopleNumLabel = '增编数';
  }

  // 减编
  if (organizationSubType === OrganizationDepartmentChangeType.remove) {
    title = '减编';
    peopleNumLabel = '减编数';
  }

  // 设置button loading状态
  const setBtnLoading = (type, isLoading) => {
    // 触发保存操作
    if (type === OptionType.Save) {
      // 设置保存按钮loading
      setSaveBtnLoading(isLoading);
      // 设置保存并继续按钮disabled
      setSaveAndCarryOnBtnBtnDisabled(isLoading);
    }
    // 触发保存并继续添加操作
    if (type === OptionType.SaveAndCarryOn) {
      // 设置保存并继续添加按钮loading
      setSaveAndCarryOnBtnLoading(isLoading);
      // 设置保存按钮disabled
      setSaveBtnDisabled(isLoading);
    }
  };

  // onChangeCheckResult
  const onChangeCheckResult = (val) => {
    setBtnLoading(optionType.current, false);
    setMessageVisible(val);
  };

  // success callback
  const onSuccessCallback = async () => {
    message.success('请求成功');

    // 保存并继续操作后 & 不需要走审批，需要重置获取部门下岗位数据
    if (optionType.current === OptionType.SaveAndCarryOn && !isApprove) {
      // 重置部门下岗位列表
      await dispatch({
        type: 'organizationStaffs/resetDepartmentStaffs',
      });
    }

    // 重新获取部门下岗位列表
    breakDepartmentList && breakDepartmentList(isApprove, OrganizationDepartmentChangeState.effectBefore);

    // 设置操作loading状态
    setBtnLoading(optionType.current, false);

    // 保存操作，隐藏抽屉
    if (optionType.current === OptionType.Save) onClose();

    // 提交并继续添加操作，不隐藏抽屉，重置表单
    if (optionType.current === OptionType.SaveAndCarryOn) {
      // 重置岗位信息
      setPostInfo({});
      form.setFieldsValue({
        jobId: undefined,
        peopleNum: undefined,
        takeEffectDate: moment(),
        note: undefined,
        assetKeys: undefined,
      });
    }
  };

  // 不走审批流程
  const onSetOrganizationCount = async () => {
    const values = await form.validateFields();
    const updateRes = await dispatch({
      type: 'organizationStaffs/setOrganizationCount',
      payload: {
        departmentId, // 部门id
        organizationSubType, // 操作类型
        ...values,
      },
    });

    // 接口失败处理
    if (updateRes && updateRes.zh_message) {
      // 设置操作loading状态
      setBtnLoading(optionType.current, false);
      message.error(updateRes.zh_message);
      return false;
    }

    // 接口成功处理
    if (updateRes && updateRes._id) {
      onSuccessCallback();
      return true;
    }
    return true;
  };

  // 走审批流程（增编申请 & 审批单提报）
  const onSubmitApprove = async () => {
    const values = await form.validateFields();
    // 增编申请接口
    const applicationRes = await dispatch({
      type: 'organizationStaffs/setApproveOrganizationCount',
      payload: {
        isUpdate,
        departmentId, // 部门id
        oaFlowId: flowId, // 审批流id
        organizationSubType, // 操作类型
        applicationId: utils.dotOptimal(updateInitValue, '_id', undefined), // 申请单id
        ...values,
      },
    });

    // 接口失败处理
    if (applicationRes && applicationRes.zh_message) {
      // 设置操作loading状态
      setBtnLoading(optionType.current, false);
      message.error(applicationRes.zh_message);
      return false;
    }

    // 接口成功处理
    if (applicationRes && applicationRes._id) {
      // 审批单提报接口
      const orderRes = await dispatch({
        type: 'oaCommon/submitOrder',
        payload: {
          id: applicationRes.oa_application_order_id,
          copyGive: values.copyGive,
          onSuccessCallback,
        },
      });

      // 提报接口失败处理
      if (!orderRes) {
        setBtnLoading(optionType.current, false);
        return false;
      }
      return true;
    }
    // 错误提示模式返回值
    return true;
  };

  // 保存
  const onSave = async (type) => {
    // 校验表单
    const values = await form.validateFields();
    // 设置操作类型
    optionType.current = type;
    // 设置操作loading状态
    setBtnLoading(type, true);
   // 操作前校验接口
    const checkRes = await dispatch({
      type: 'department/checkDepartmentUpdate',
      payload: {
        departmentId,
        organizationSubType,
        jobId: utils.dotOptimal(values, 'jobId', undefined),
        oaApplicationOrderId: utils.dotOptimal(updateInitValue, 'oa_application_order_id', undefined), // 审批单id
      },
    });

    // 接口失败处理
    if (checkRes && checkRes.zh_message) {
      // 设置操作loading状态
      setBtnLoading(type, false);
      message.error(checkRes.zh_message);
      return;
    }
    // 接口成功处理
    if (checkRes && checkRes.ok === false) {
      // 设置check message
      setCheckMessage(checkRes.hint_list);
      // 设置错误提示modal visible
      setMessageVisible(true);
    }

    if (checkRes && checkRes.ok) {
      // 走审批
      isApprove && onSubmitApprove();
      // 不走审批
      !isApprove && onSetOrganizationCount();
    }
  };

  // form
  const renderForm = () => {
    // 编制数max num
    const maxNum = organizationSubType === OrganizationDepartmentChangeType.remove ?
      (utils.dotOptimal(postInfo, 'organization_count', 100) || utils.dotOptimal(postInfo, '.job_list.0.people_num', 100))
      : 100;

    const commonItems = [
      <Form.Item
        label="岗位名称"
        name="jobId"
        rules={[
          { required: true, message: '请选择' },
        ]}
      >
        <AllPost
          placeholder="请选择"
          allowClear
          showSearch
          optionFilterProp="children"
          departmentId={departmentId}
          disabled={isUpdate}
          onChange={(_, option) => setPostInfo(utils.dotOptimal(option, 'info', {}))}
        />
      </Form.Item>,
      <Form.Item
        label={peopleNumLabel}
        name="peopleNum"
        rules={[
          { required: true, message: '请选择' },
        ]}
      >
        <InputNumber
          min={1}
          max={maxNum}
          formatter={v => Unit.limitMaxPositiveIntegerNumber(v, maxNum)}
          parser={v => Unit.limitMaxPositiveIntegerNumber(v, maxNum)}
          placeholder="请选择"
        />
      </Form.Item>,
    ];

    // 新增表单item
    const approveItems = [
      <Form.Item
        label="生效日期"
        name="takeEffectDate"
        rules={[
          { required: true, message: '请选择' },
        ]}
      >
        <DatePicker
          disabledDate={cr => (cr && cr < moment().endOf('day').subtract(1, 'days'))}
        />
      </Form.Item>,
      <Form.Item
        label="申请原因"
        name="note"
        rules={[
          { required: true, message: '请输入' },
        ]}
      >
        <TextArea
          placeholder="请输入"
          rows={4}
        />
      </Form.Item>,
      <Form.Item
        label="附件"
        name="assetKeys"
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
    ];

    // 公共详情item
    const commonDetailItems = [
      <Form.Item
        label="所属部门"
        key="department_name"
      >
        {utils.dotOptimal(departmentDetail, 'name', '--')}
      </Form.Item>,
      <Form.Item
        label="岗位占编数"
        key="organization_num"
      >
        {utils.dotOptimal(postInfo, 'organization_num', '--')}
      </Form.Item>,
      <Form.Item
        label="现岗位编制数"
        key="organization_num_detail"
      >
        {utils.dotOptimal(postInfo, 'organization_count', '--')}
      </Form.Item>,
    ];
    const formItems = [
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
    ];
    // 走审批流程的form
    const approveFormItems = [...commonItems, ...approveItems, ...commonDetailItems];
    // 创建展示抄送，编辑不展示抄送
    if (!isUpdate) {
      approveFormItems.push(...formItems);
    }
    const items = isApprove ?
      // 走审批流程的form
      approveFormItems
      // 不走审批流程的form
      : [...commonItems, ...commonDetailItems];

    return (
      <CoreForm items={items} cols={1} />
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
          onClick={() => onSave(OptionType.Save)}
          type="primary"
          loading={saveBtnLoading}
          disabled={saveBtnDisabled}
          style={{ marginLeft: 10 }}
        >提交</Button>
        {
          // 编辑没有该操作
          !isUpdate && (
            <Button
              onClick={() => onSave(OptionType.SaveAndCarryOn)}
              type="primary"
              loading={saveAndCarryOnBtnLoading}
              disabled={saveAndCarryOnBtnDisabled}
              style={{ marginLeft: 10 }}
            >提交并继续添加</Button>
          )
        }
      </div>
    );
  };

  // 错误提示modal
  const renderMessageModal = () => {
    if (!messageVisible) return;
    // 部门名称
    const departmentName = utils.dotOptimal(departmentDetail, 'name', undefined);
    // 岗位名称
    const postName = utils.dotOptimal(postInfo, 'job_info.name', undefined)
      || utils.dotOptimal(postInfo, 'job_data_list.0.job_info.name', undefined);

    // 类型title
    const typeTitle = `组织管理 - ${OrganizationDepartmentChangeType.description(organizationSubType)}`;
    // messageTitle（部门名称 - 岗位名称）
    const messageTitle = departmentName && postName ?
      `${typeTitle}（${departmentName} - ${postName}）`
      : typeTitle;

    return (
      <CheckResultModal
        visible={messageVisible}
        onChangeCheckResult={val => onChangeCheckResult(val)}
        checkMessage={checkMessage}
        messageTitle={messageTitle}
        onSubmitDepartment={isApprove ? onSubmitApprove : onSetOrganizationCount}
      />
    );
  };

  const flowProps = {
    flowId, // 审批流id
    departmentId, // 实际申请部门
    specialDepartmentId: departmentId, // 特殊部门
    accountId: authorize.account.id, // 实际申请人
  };

  // initialValues
  const initialValues = isUpdate ? {
    jobId: utils.dotOptimal(updateInitValue, 'job_list.0.job_id', undefined),
    peopleNum: utils.dotOptimal(updateInitValue, 'job_list.0.people_num', 0),
    takeEffectDate: utils.dotOptimal(updateInitValue, 'take_effect_date', undefined) ?
      moment(String(utils.dotOptimal(updateInitValue, 'take_effect_date')))
      : moment(),
    note: utils.dotOptimal(updateInitValue, 'note', undefined),
    assetKeys: PageUpload.getInitialValue(updateInitValue, 'asset_infos', {}),
  } : {
    jobId: utils.dotOptimal(countPostList, '0.job_info._id', undefined), // 岗位名称
    takeEffectDate: moment(),
  };

  return (
    <Drawer
      title={title}
      visible={visible}
      onClose={onClose}
      // getContainer={false}
      width={400}
      footer={renderFooter()}
    >
      <Form
        form={form}
        className="affairs-flow-node"
        initialValues={initialValues}
        {...formLayout}
      >
        {renderForm()}
      </Form>

      {/* 审批流预览 */}
      {
        visible && isApprove && flowId ?
          <FlowPreview {...flowProps} />
          : ''
      }
      {renderMessageModal()}
    </Drawer>
  );
};

export default Establishment;
