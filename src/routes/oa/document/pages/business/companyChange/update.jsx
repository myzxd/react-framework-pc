/**
 * 财商类 - 公司变更 - 编辑
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Input, Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { BusinessCompanyChangeType, BusinessCompanyType, Unit } from '../../../../../../application/define';
import { utils } from '../../../../../../application';
import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import { PageCompanySelect } from '../common/index';
import ExamineFlow from '../../../components/form/flow';


const { Option } = Select;
const { TextArea } = Input;
const customizeNamespace = 'companyhChange';

function CompanyhChangeUpdate(props) {
  const { dispatch, businessCompanyDetail, companySelectInfo, query, examineFlowInfo = [] } = props;
  const [form] = Form.useForm();
  const [companyName, setCompanyName] = useState(undefined); // 获取公司名称
  const [companyInfo, setCompanyInfo] = useState({}); // 获取公司信息
  const flag = query.id;
  // 根据公司ID筛选出数据
  const companyId = companyName ? companyName : dot.get(businessCompanyDetail, 'firm_id', undefined);
  const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
  const formLayoutC1 = { labelCol: { span: 3 }, wrapperCol: { span: 16 } };
  // 接口请求
  useEffect(() => {
    const payload = {
      id: query.id,
    };
    // 请求接口
    dispatch({ type: 'business/fetchBusinessFirmModifyOrderDetail', payload });
    return () => { dispatch({ type: 'business/resetBusinessFirmModifyOrderDetail', payload: {} }); };
  }, [dispatch, query.id]);

  // 筛选公司信息
  useEffect(() => {
    dot.get(companySelectInfo, `${customizeNamespace}.data`, []).map((company) => {
      if (company._id === companyId) {
        return setCompanyInfo(company);
      }
    });
  }, [companySelectInfo, companyId]);

  // 提交单据到服务器
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    onFinish({
      type: 30,
      onSuccessCallback: onDoneHook,
      onErrorCallback: onUnlockHook,
      onLockHook,
    });
  };

  // 提交
  const onFinish = function (params = {}) {
    form.validateFields().then((values) => {
      // 锁定按钮
      if (params.onLockHook) {
        params.onLockHook();
      }
      const payload = {
        id: query.id,
        ...values,
        ...params,
        ...companyInfo,
        flag,
      };
      dispatch({ type: 'business/updateBusinessFirmModifyOrder', payload });
    });
  };

  // 更新单据到服务器(编辑提交)
  const onUpdate = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    onFinish({
      onSuccessCallback: onDoneHook,
      onErrorCallback: onUnlockHook,
      onLockHook,
    });
  };

  // 更改公司名称
  const onCompanySelect = (value) => {
    setCompanyName(value);
  };

  // 渲染表单
  const renderFrom = function () {
    if (!businessCompanyDetail._id) {
      return null;
    }
    const formItems = [
      <Form.Item
        label="公司名称"
        name="companyName"
        initialValue={dot.get(businessCompanyDetail, 'firm_id', undefined)}
        rules={[{ required: true, message: '请选择公司名称' }]}
        {...formLayoutC3}
      >
        <PageCompanySelect
          placeholder="请选择公司名称"
          customizeNamespace={customizeNamespace}
          onChange={onCompanySelect}
          otherChild={utils.dotOptimal(businessCompanyDetail, 'firm_info', {})}
        />
      </Form.Item >,
      <Form.Item
        label="法人代表"
        {...formLayoutC3}
      >
        {dot.get(companyInfo, 'legal_name', '--')}
      </Form.Item >,
      <Form.Item
        label="注册资本"
        {...formLayoutC3}
      >
        {dot.get(companyInfo, 'registered_capital') >= 0 ? <span>{`${Unit.exchangePriceToWanYuan(dot.get(companyInfo, 'registered_capital'))}万元`}</span> : '--'}
      </Form.Item >,
      <Form.Item
        label="注册时间"
        {...formLayoutC3}
      >
        {dot.get(companyInfo, 'registered_date') ? moment(`${dot.get(companyInfo, 'registered_date')}`).format('YYYY-MM-DD') : '--'}
      </Form.Item >,
      <Form.Item
        label="注册地址"
        {...formLayoutC3}
      >
        {dot.get(companyInfo, 'registered_addr', '--')}
      </Form.Item >,
      <Form.Item
        label="公司性质"
        {...formLayoutC3}
      >
        {dot.get(companyInfo, 'firm_type') ? BusinessCompanyType.description(dot.get(companyInfo, 'firm_type')) : '--'}
      </Form.Item >,
      <Form.Item
        label="股东信息"
        {...formLayoutC3}
      >
        {dot.get(companyInfo, 'share_holder_info', '--')}
      </Form.Item >,
    ];
    const formItems2 = [
      <Form.Item
        label="变更类型"
        name="modifyType"
        initialValue={dot.get(businessCompanyDetail, 'modify_type', undefined)}
        rules={[{ required: true, message: '请选择变更类型' }]}
        {...formLayoutC1}
      >
        <Select placeholder="请选择变更类型" style={{ width: '100%' }} allowClear showArrow mode="multiple" >
          <Option value={BusinessCompanyChangeType.name}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.name)}</Option>
          <Option value={BusinessCompanyChangeType.guardianship}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.guardianship)}</Option>
          <Option value={BusinessCompanyChangeType.monitoring}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.monitoring)}</Option>
          <Option value={BusinessCompanyChangeType.shareholders}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.shareholders)}</Option>
          <Option value={BusinessCompanyChangeType.capital}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.capital)}</Option>
          <Option value={BusinessCompanyChangeType.address}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.address)}</Option>
          <Option value={BusinessCompanyChangeType.scope}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.scope)}</Option>
          <Option value={BusinessCompanyChangeType.other}>{BusinessCompanyChangeType.description(BusinessCompanyChangeType.other)}</Option>
        </Select>
      </Form.Item >,
      <Form.Item
        label="变更内容"
        name="content"
        rules={[{ required: true, message: '请输入变更内容' }]}
        initialValue={dot.get(businessCompanyDetail, 'modify_content', undefined)}
        {...formLayoutC1}
      >
        <TextArea placeholder="请输入变更内容" />
      </Form.Item >,
      <Form.Item
        label="申请原因及说明"
        name="note"
        initialValue={dot.get(businessCompanyDetail, 'note', undefined)}
        rules={[{ required: true, message: '请输入申请原因及说明' }]}
        {...formLayoutC1}
      >
        <TextArea rows={4} placeholder="请输入申请原因及说明" />
      </Form.Item >,
      <Form.Item
        label="上传附件"
        name="fileList"
        initialValue={PageUpload.getInitialValue(businessCompanyDetail, 'asset_infos')}
        rules={[{ required: false, message: '请输入上传附件' }]}
        {...formLayoutC1}
      >
        <PageUpload domain="oa_approval" />
      </Form.Item >,
    ];
    return (
      <CoreContent title="公司变更申请表">
        <CoreForm items={formItems} cols={2} />
        <CoreForm items={formItems2} cols={1} />
      </CoreContent>
    );
  };

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <Form layout="horizontal" form={form} onFinish={() => { }}>
      {/* 审批信息 */}
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          flowId={query.flow_id}
          isDetail
          departmentId={dot.get(businessCompanyDetail, 'creator_department_info._id', undefined)}
          accountId={dot.get(businessCompanyDetail, 'creator_info._id', undefined)}
        />
      </CoreContent>

      {/* 渲染表单 */}
      {renderFrom()}

      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={props.query}
        showUpdate={flag ? true : false}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
      />
    </Form>
  );
}


const mapStateToProps = ({ business: { businessCompanyDetail, companySelectInfo },
  oaCommon: { examineFlowInfo },
}) => {
  return { businessCompanyDetail, companySelectInfo, examineFlowInfo };
};

export default connect(mapStateToProps)(CompanyhChangeUpdate);
