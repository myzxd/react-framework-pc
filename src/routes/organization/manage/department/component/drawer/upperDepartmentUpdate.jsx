/**
 * 调整上级部门
 */
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Alert,
  message,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';
import PropTypes from 'prop-types';
import { CoreForm } from '../../../../../../components/core';
import { PageUpload } from '../../../../../oa/document/components';
import { omit, dotOptimal } from '../../../../../../application/utils';
import {
  CommonModalCopyGive,
  CommonModalFixedCopyGiveDisplay,
} from '../../../../../../components/common';
import {
  OrganizationDepartmentChangeType,
} from '../../../../../../application/define';
import { authorize } from '../../../../../../application';

import FlowPreview from '../../../components/flowPreview';

import Pid from '../pid';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const { TextArea } = Input;

const voidFunc = () => { };
UpperDepartmentUpdate.propTypes = {
  onChangeCheckResult: PropTypes.func, // 更改部门操作校验结果Modal visible、获取部门操作提交事件、获取部门操作校验提示信息
  onChangeUpperDepartmentVisable: PropTypes.func, // 更改调整上级部门Drawer visable
  departmentDetail: PropTypes.object, // 部门详情
  isUpdate: PropTypes.bool, // 是否是走审批编辑操作
  upperDepartmentFlowId: PropTypes.string, // 调整上级部门操作需要的审批流id
  onSuccess: PropTypes.func, // 请求成功回调
};
UpperDepartmentUpdate.defaultProps = {
  onChangeCheckResult: voidFunc,
  onChangeUpperDepartmentVisable: voidFunc,
  onSuccess: voidFunc,
  departmentDetail: {},
  isUpdate: false,
};

function UpperDepartmentUpdate(props) {
  const {
    onChangeCheckResult,
    onChangeUpperDepartmentVisable,
    departmentDetail,
    createOaUpperDepartment,
    updateOaUpperDepartment,
    checkDepartmentUpdate,
    isUpdate,
    upperDepartmentFlowId,
    submitOrder,
    onSuccess,
  } = props;
  const [form] = Form.useForm();
  // 是否显示修改上级部门的提示
  const [isShowPidPrompt, setIsShowPidPrompt] = useState(false);
  // 保存按钮loading
  const [isLoading, setIsLoading] = useState(false);

  // departmentDetail变化时更新回填的表单值
  useEffect(() => {
    setFormValue();
  }, [departmentDetail]);

  // 回填表单数据
  const setFormValue = () => {
    // 是否是走审批编辑操作
    if (isUpdate) {
      form.setFieldsValue({
        superior: dotOptimal(departmentDetail, 'update_parent_department_info._id', '0'), // 上级部门
        code: dotOptimal(departmentDetail, 'department_info.code', undefined), // 部门编号
        // 生效日期
        effectiveDate: dotOptimal(departmentDetail, 'take_effect_date', undefined)
          ? moment(`${dotOptimal(departmentDetail, 'take_effect_date')}`)
          : undefined,
        reason: dotOptimal(departmentDetail, 'note', undefined), // 原因
        assetKeys: PageUpload.getInitialValue(departmentDetail, 'asset_infos', {}), // 附件
      });
    } else {
      form.setFieldsValue({
        superior: dotOptimal(departmentDetail, 'pid', '0'), // 上级部门
        code: dotOptimal(departmentDetail, 'code', undefined), // 部门编号
        effectiveDate: moment(), // 生效日期
        reason: undefined, // 原因
        assetKeys: [], // 附件
      });
    }
  };

  // 提交表单数据
  const onSubmit = async () => {
    const formRes = await form.getFieldsValue();
    const payload = {
      updateParentDepartmentId: dotOptimal(formRes, 'superior', undefined), // 上级部门id
      code: dotOptimal(formRes, 'code', undefined), // 部门编号
      effectiveDate: dotOptimal(formRes, 'effectiveDate', undefined) && Number(formRes.effectiveDate.format('YYYYMMDD')), // 生效日期
      reason: dotOptimal(formRes, 'reason', undefined), // 原因
      assetKeys: dotOptimal(formRes, 'assetKeys', undefined), // 附件
    };
    let res;
    // 是否是走审批编辑操作
    if (isUpdate) {
      // 审批-调整上级部门-编辑
      res = await updateOaUpperDepartment({
        ...payload,
        oaOrganizationOrderId: dotOptimal(departmentDetail, '_id', undefined), // 部门id
      });
    // 审批创建操作
    } else {
      // 审批-调整上级部门-创建
      res = await createOaUpperDepartment({
        ...payload,
        upperDepartmentFlowId, // 调整上级部门操作需要的审批流id
        departmentId: dotOptimal(departmentDetail, '_id', undefined), // 部门id
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
        onChangeUpperDepartmentVisable(false);
        // 是否显示修改上级部门的提示
        setIsShowPidPrompt(false);
        // 重置表单值(审批编辑无需清空表单值-直接关闭)
        if (!isUpdate) {
          form.setFieldsValue({
            superior: dotOptimal(departmentDetail, 'pid', '0'), // 上级部门
            code: dotOptimal(departmentDetail, 'code', undefined), // 部门编号
            effectiveDate: moment(), // 生效日期
            reason: undefined, // 原因
            assetKeys: [], // 附件
          });
        }
        setIsLoading(false);
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
    const formRes = await form.validateFields();
    setIsLoading(true);
    const payload = {
      organizationSubType: OrganizationDepartmentChangeType.change, // 组织架构-部门/编制调整 子类型
      departmentId: dotOptimal(departmentDetail, '_id', undefined), // 部门id
      updateParentDepartmentId: dotOptimal(formRes, 'superior', undefined), // 上级部门id
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
          `调整类型：组织架构-调整部门(${isUpdate ? dotOptimal(departmentDetail, 'department_info.name', '--') : dotOptimal(departmentDetail, 'name', '--')})`,
          );
      }
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  // 上级部门onChange
  const onChangePid = (val) => {
    form.setFieldsValue({ superior: val });
    if (dotOptimal(departmentDetail, 'pid') !== val) {
      setIsShowPidPrompt(true);
    } else {
      setIsShowPidPrompt(false);
    }
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
        label="上级部门"
        name="superior"
        rules={[{ required: true, message: '请选择上级部门' }]}
      >
        <Pid
          onChangePid={onChangePid}
          disabled={isUpdate}
          curDepId={isUpdate ? dotOptimal(departmentDetail, 'department_info._id', undefined) : dotOptimal(departmentDetail, '_id', undefined)}
          otherChild={isUpdate ? dotOptimal(departmentDetail, 'department_info.parent_info', {}) : dotOptimal(departmentDetail, 'parent_info', {})}
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
        label="生效日期"
        name="effectiveDate"
        rules={[{ required: true, message: '请选择生效日期' }]}
      >
        <DatePicker
          disabledDate={current => current && current < moment().endOf('day').subtract(1, 'days')}
        />
      </Form.Item>,
      <Form.Item
        label="调整原因"
        name="reason"
        rules={[{ required: true, message: '请输入调整原因' }]}
      >
        <TextArea
          placeholder="请输入调整原因"
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
      const flowId = upperDepartmentFlowId || dotOptimal(departmentDetail, 'oa_application_flow_id', undefined);
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
            onChangeUpperDepartmentVisable(false);
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
    'onChangeUpperDepartmentVisable',
    'departmentDetail',
    'createOaUpperDepartment',
    'updateOaUpperDepartment',
    'checkDepartmentUpdate',
    'isUpdate',
    'upperDepartmentFlowId',
    'submitOrder',
    'onSuccess',
  ], props);

  // 审批流预览组件props
  const flowProps = {
    flowId: upperDepartmentFlowId || dotOptimal(departmentDetail, 'oa_application_flow_id', undefined), // 审批流id
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
      title="调整上级部门"
      width="400"
      onClose={() => {
        setFormValue();
        onChangeUpperDepartmentVisable(false);
      }}
      footer={renderFooter()}
      {...omitedProps}
    >
      {/* 修改上级部门的提示 */}
      {
        isShowPidPrompt
          ? <Alert message="上级部门已经修改，请及时修改部门编号" type="info" showIcon banner style={{ marginBottom: 10 }} />
          : null
      }
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
  // 审批-调整上级部门-创建
  createOaUpperDepartment: payload => dispatch({
    type: 'department/createOaUpperDepartment',
    payload,
  }),
  // 审批-调整上级部门-编辑
  updateOaUpperDepartment: payload => dispatch({
    type: 'department/updateOaUpperDepartment',
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

export default connect(mapStateToProps, mapDispatchToProps)(UpperDepartmentUpdate);
