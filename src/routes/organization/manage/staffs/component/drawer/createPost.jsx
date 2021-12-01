/**
 * 组织架构 - 部门管理 - 岗位编制 - 添加岗位（drawer）
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

import { CoreForm } from '../../../../../../components/core';
import { PageUpload } from '../../../../../oa/document/components';
import {
  CommonModalCopyGive,
  CommonModalFixedCopyGiveDisplay,
} from '../../../../../../components/common';
import { authorize, utils } from '../../../../../../application';
import {
  Unit,
  OrganizationDepartmentChangeState,
} from '../../../../../../application/define';

import AllPost from '../../../components/postNameSelect';
import FlowPreview from '../../../components/flowPreview';
import CheckResultModal from '../../../components/checkResultModal';

const { TextArea } = Input;

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

// 操作类型
const OptionType = {
  Save: 'save', // 保存
  SaveAndCarryOn: 'saveAndCarryOn', // 保存并继续
};

const CreatePost = ({
  dispatch,
  visible,
  onClose,
  tabKey, // 当前tabKey
  flowId, // 审批流id
  isApprove = false, // 是否走审批流程
  departmentDetail = {}, // 部门
  isUpdate, // 是否为编辑
  updateInitValue = {}, // 默认岗位数据
  breakDepartmentList, // 刷新列表
}) => {
  const [form] = Form.useForm();
  // 表单操作类型
  const optionType = useRef(OptionType.Save);
  // save button loading
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  // saveAndCarryOn button loading
  const [saveAndCarryOnBtnLoading, setSaveAndCarryOnBtnLoading] = useState(false);

  // save button disabled
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(false);
  // saveAndCarryOn button disabled
  const [saveAndCarryOnBtnDisabled, setSaveAndCarryOnBtnBtnDisabled] = useState(false);

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
      : {},
  );

  const {
    _id: departmentId, // 部门id
  } = departmentDetail;

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
    // 设置操作loading状态
    setBtnLoading(optionType.current, false);
    // 获取当前分类key
    const type = tabKey ? OrganizationDepartmentChangeState.descriptionTabKey(tabKey) : OrganizationDepartmentChangeState.effectBefore;
    // 重新获取部门下岗位列表
    breakDepartmentList && breakDepartmentList(isApprove, type);

    // 保存操作，隐藏抽屉
    if (optionType.current === OptionType.Save) onClose();

    // 提交并继续添加操作，不隐藏抽屉，重置表单
    if (optionType.current === OptionType.SaveAndCarryOn) {
      // 重置岗位信息
      setPostInfo({});

      form.setFieldsValue({
        jobId: undefined,
        peopleNum: isApprove ? 0 : undefined,
        takeEffectDate: moment(),
        note: undefined,
        assetKeys: undefined,
        description: undefined,
      });
    }
  };

  // 创建岗位（不走审批流程）
  const onCreatePost = async () => {
    const values = await form.validateFields();
    const updateRes = await dispatch({
      type: 'organizationStaffs/createOrganizationPost',
      payload: {
        departmentId,
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
    if (updateRes && updateRes.ok) {
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
      type: 'organizationStaffs/setApproveOrganizationPost',
      payload: {
        isUpdate,
        departmentId, // 部门id
        oaFlowId: flowId, // 审批流id
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
        organizationSubType: 40,
        oaApplicationOrderId: utils.dotOptimal(updateInitValue, 'oa_application_order_id', undefined), // 审批单id
        jobId: utils.dotOptimal(values, 'jobId', undefined),
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
      !isApprove && onCreatePost();
    }
  };

  // form
  const renderForm = () => {
    // 不走审批form item
    const items = [
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
        label="岗位编制数"
        name="peopleNum"
        rules={[
          { required: true, message: '请选择' },
        ]}
      >
        <InputNumber
          min={0}
          max={100}
          formatter={v => Unit.limitMaxZeroIntegerNumber(v, 100)}
          parser={v => Unit.limitMaxZeroIntegerNumber(v, 100)}
          placeholder="请选择"
        />
      </Form.Item>,
      <Form.Item
        label="岗位描述"
        name="description"
      >
        <TextArea
          placeholder="请输入"
          rows={4}
        />
      </Form.Item>,
      <Form.Item
        label="岗位职级"
        key="rank"
      >
        {
          utils.dotOptimal(postInfo, 'rank', undefined) || utils.dotOptimal(postInfo, 'job_data_list.0.job_info.rank', '--')
        }
      </Form.Item>,
      <Form.Item
        label="所属部门"
        key="department_name"
      >
        {utils.dotOptimal(departmentDetail, 'name', '--')}
      </Form.Item>,
    ];

    // 走审批form item
    const approveItems = [
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
        label="岗位编制数"
        name="peopleNum"
        rules={[
          { required: true, message: '请选择' },
        ]}
      >
        <InputNumber
          min={0}
          max={100}
          disabled
          formatter={v => Unit.limitMaxZeroIntegerNumber(v, 100)}
          parser={v => Unit.limitMaxZeroIntegerNumber(v, 100)}
          placeholder="请选择"
        />
      </Form.Item>,
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
        label="岗位描述"
        name="description"
      >
        <TextArea
          placeholder="请输入"
          rows={4}
        />
      </Form.Item>,
      <Form.Item
        label="岗位职级"
        key="rank"
      >
        {
          utils.dotOptimal(postInfo, 'rank', undefined) || utils.dotOptimal(postInfo, 'job_data_list.0.job_info.rank', '--')
        }
      </Form.Item>,
      <Form.Item
        label="所属部门"
        key="department_name"
      >
        {utils.dotOptimal(departmentDetail, 'name', '--')}
      </Form.Item>,
      <Form.Item
        label="附件"
        name="assetKeys"
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
    ];
    // 创建展示抄送，编辑不展示
    if (!isUpdate) {
      approveItems.push(
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
      <CoreForm items={isApprove ? approveItems : items} cols={1} />
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
    const postName = utils.dotOptimal(postInfo, 'name', undefined)
      || utils.dotOptimal(postInfo, 'job_data_list.0.job_info.name', undefined);
    // 类型title
    const typeTitle = '组织管理 - 添加岗位';

    // messageTitle（部门名称 - 岗位名称）
    const messageTitle = departmentName && postName ?
      `${typeTitle}（${departmentName} - ${postName}）`
      : typeTitle;

    return (
      <CheckResultModal
        visible={messageVisible}
        onChangeCheckResult={val => onChangeCheckResult(val)}
        checkMessage={checkMessage}
        onSubmitDepartment={isApprove ? onSubmitApprove : onCreatePost}
        messageTitle={messageTitle}
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
    peopleNum: utils.dotOptimal(updateInitValue, 'job_data_list.0.organization_count', undefined),
    takeEffectDate: utils.dotOptimal(updateInitValue, 'take_effect_date', undefined) ?
      moment(String(utils.dotOptimal(updateInitValue, 'take_effect_date')))
      : moment(),
    note: utils.dotOptimal(updateInitValue, 'note', undefined),
    assetKeys: PageUpload.getInitialValue(updateInitValue, 'asset_infos', {}),
    description: utils.dotOptimal(updateInitValue, 'job_data_list.0.description', undefined),
  } : {
    takeEffectDate: moment(),
    peopleNum: isApprove ? 0 : undefined,
  };

  return (
    <Drawer
      title={isUpdate ? '编辑岗位' : '添加岗位'}
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

export default CreatePost;
