/**
 * 行政类 - 刻章申请 - 编辑 /Oa/Document/Pages/Administration/CarveSeal/Update
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Input, Select, Form } from 'antd';

import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import { CoreContent, CoreForm } from '../../../../../../components/core';

import CompanySelect from '../components/companySelect';
import ExamineFlow from '../../../components/form/flow';

const { Option } = Select;
const { TextArea } = Input;

const CreateCarveSeal = ({ carveSealDetail, dispatch, query, enumeratedValue = {}, examineFlowInfo = {} }) => {
  const formLayoutC2 = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
  const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };
  const formLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } };

  const [form] = Form.useForm();

  // 请求枚举列表接口
  useEffect(() => {
    dispatch({
      type: 'codeRecord/getEnumeratedValue',
      payload: {},
    });

    return () => {
      dispatch({
        type: 'codeRecord/resetEnumerateValue',
        payload: {},
      });
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: 'administration/fetchCarveSealDetail', payload: { id: query.id } });
    return () => { dispatch({ type: 'administration/resetCarveSealDetail' }); };
  }, []);

  // 提交（编辑）
  const onUpdate = async (callbackObj) => {
    const { id } = query;
    const res = await form.validateFields();
     // 禁用提交按钮
    if (callbackObj.onLockHook) {
      callbackObj.onLockHook();
    }
    dispatch({
      type: 'administration/updateCarveSeal',
      payload: {
        id,
        ...res,
        sealKeeping: dot.get(carveSealDetail, 'keep_account_info.employee_info._id', '--'),
        onSuccessCallback: callbackObj.onDoneHook,
        onErrorCallback: callbackObj.onUnlockHook,
      },
    });
  };

  // 渲染 印章类型 options
  const renderSealTypeOptions = () => {
    const sealTypes = enumeratedValue.seal_types || [];
    if (sealTypes.length > 0) {
      return sealTypes.map((item) => {
        return <Option value={item.value}>{item.name}</Option>;
      });
    }
    return [];
  };

  // 渲染印章刻制信息
  const renderSeal = () => {
    if (!carveSealDetail._id) {
      return null;
    }
    const formItems = [
      <Form.Item
        label="印章类型"
        name="sealType"
        initialValue={dot.get(carveSealDetail, 'seal_type', undefined)}
        rules={[{ required: true, message: '请选择印章类型' }]}
        {...formLayoutC2}
      >
        <Select style={{ width: '100%' }} placeholder="请选择">
          {renderSealTypeOptions()}
        </Select>
      </Form.Item>,
      <Form.Item
        label="公司名称"
        name="company"
        {...formLayoutC2}
        initialValue={dot.get(carveSealDetail, 'firm_id', undefined)}
        rules={[{ required: true, message: '请选择公司名称' }]}
      >
        <CompanySelect />
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="印章全称"
        name="sealName"
        initialValue={dot.get(carveSealDetail, 'name', undefined)}
        rules={[{ required: true, message: '请输入印章全称' }]}
        {...formLayout}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
    ];
    const formItems3 = [
      <Form.Item
        label="印章字体"
        name="sealFont"
        initialValue={dot.get(carveSealDetail, 'typeface', undefined)}
        {...formLayoutC2}
      >
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="印章保管人"
        name="sealKeeping"
        {...formLayoutC2}
      >
        {dot.get(carveSealDetail, 'keep_account_info.employee_info.name', '--')}
      </Form.Item>,
    ];
    const formItems4 = [
      <Form.Item
        label="申请事由"
        name="reason"
        initialValue={dot.get(carveSealDetail, 'note', undefined)}
        rules={[{ required: true, message: '请输入申请事由' }]}
        {...formLayoutC1}
      >
        <TextArea rows={4} />
      </Form.Item>,
      <Form.Item
        label="上传附件"
        name="assets"
        initialValue={PageUpload.getInitialValue(carveSealDetail, 'asset_infos')}
        {...formLayoutC1}
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
    ];
    return (
      <CoreContent title="印章刻制信息">
        <CoreForm items={formItems} cols={2} />
        <CoreForm items={formItems2} cols={1} />
        <CoreForm items={formItems3} cols={2} />
        <CoreForm items={formItems4} cols={1} />
      </CoreContent>
    );
  };

    // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <Form form={form} onFinish={() => { }}>
      {/* 审批信息 */}
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          flowId={query.flow_id}
          isDetail
          accountId={dot.get(carveSealDetail, 'creator_info._id', undefined)}
          departmentId={dot.get(carveSealDetail, 'creator_department_info._id', undefined)}
          specialAccountId={dot.get(carveSealDetail, 'keep_account_info._id', undefined)}
        />
      </CoreContent>


      {/* 渲染用章信息 */}
      {renderSeal()}

      {/* 渲染表单按钮 */}
      <PageFormButtons showUpdate query={query} onUpdate={onUpdate} />
    </Form>
  );
};
function mapPropsToState({
  codeRecord: { enumeratedValue },
  administration: { carveSealDetail },
  oaCommon: { examineFlowInfo } }) {
  return {
    enumeratedValue,
    carveSealDetail,
    examineFlowInfo,
  };
}
export default connect(mapPropsToState)(CreateCarveSeal);
