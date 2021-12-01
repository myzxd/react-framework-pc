/**
 * 财商类 - 注册公司申请 - 编辑
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { DatePicker, Input, Select, InputNumber, Form, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { BusinessCompanyHandleType, BusinessCompanyType, Unit } from '../../../../../../application/define';
import { utils } from '../../../../../../application';
import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import { PageCompanySelect } from '../common/index';
import ExamineFlow from '../../../components/form/flow';

const { Option } = Select;
const { TextArea } = Input;
const customizeNamespace = 'companyhChange';

function RegisteredCompanyUpdate(props) {
  const { dispatch, businessCompanyDetail, companySelectInfo, query, examineFlowInfo = [] } = props;
  const [form] = Form.useForm();
  const [companyName, setCompanyName] = useState(undefined); // 获取公司名称
  const [companyInfo, setCompanyInfo] = useState({});  // 获取公司信息
  const flag = query.id;
  // 根据公司ID筛选出数据
  const companyId = companyName ? companyName : dot.get(businessCompanyDetail, 'firm_info._id', undefined);
  const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
  const formLayoutC1 = { labelCol: { span: 3 }, wrapperCol: { span: 16 } };
  // 接口请求
  useEffect(() => {
    if (query.id) {
      const payload = {
        id: flag,
      };
      // 请求接口
      dispatch({ type: 'business/fetchBusinessFirmModifyOrderDetail', payload });
      return () => { dispatch({ type: 'business/resetBusinessFirmModifyOrderDetail', payload: {} }); };
    }
  }, [dispatch, flag]);

  // 筛选公司信息
  useEffect(() => {
    dot.get(companySelectInfo, `${customizeNamespace}.data`, []).map((company) => {
      if (company._id === companyId) {
        return setCompanyInfo(company);
      }
    });
  }, [companySelectInfo, companyId]);
  // 限制校验
  const disabledDate = function (current) {
    const day = Number(moment().format('YYYYMMDD'));
    return current && Number(moment(current).format('YYYYMMDD')) < day;
  };

  // 提交单据到服务器
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    onFinish({
      onSuccessCallback: onDoneHook,
      onErrorCallback: onUnlockHook,
      onLockHook,
    });
  };

  // 提交
  const onFinish = function (params = {}) {
    form.validateFields().then((values) => {
      if (params.onLockHook) {
        params.onLockHook();
      }
      const payload = {
        id: query.id,
        ...values,
        ...params,
        ...companyInfo,
        type: dot.get(businessCompanyDetail, 'deal_type'),
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
    const handleItems = [
      <Form.Item
        label="办理类型"
        {...formLayoutC1}
      >
        {dot.get(businessCompanyDetail, 'deal_type') ? BusinessCompanyHandleType.description(dot.get(businessCompanyDetail, 'deal_type')) : '--'}
      </Form.Item >,
    ];
    const formItems = [];
    // 判断类型是否添加注销时间
    if (dot.get(businessCompanyDetail, 'deal_type') === BusinessCompanyHandleType.cancellation) {
      formItems.push(
        <Form.Item
          label="公司名称"
          name="companyName"
          initialValue={dot.get(businessCompanyDetail, 'firm_info._id', undefined)}
          rules={[{ required: true, message: '请选择公司名称' }]}
          {...formLayoutC3}
        >
          <PageCompanySelect
            onChange={onCompanySelect}
            placeholder="请选择公司名称"
            otherChild={utils.dotOptimal(businessCompanyDetail, 'firm_info', {})}
            customizeNamespace={customizeNamespace}
          />
        </Form.Item >,
        <Form.Item
          label="公司性质"
          {...formLayoutC3}
        >
          {dot.get(companyInfo, 'firm_type') ? BusinessCompanyType.description(dot.get(companyInfo, 'firm_type')) : '--'}
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
          label="股东信息"
          {...formLayoutC3}
        >
          {dot.get(companyInfo, 'share_holder_info', '--')}
        </Form.Item >,
        <Form.Item
          label="注销时间"
          name="rcancellationDate"
          initialValue={dot.get(businessCompanyDetail, 'cancel_date') ? moment(`${dot.get(businessCompanyDetail, 'cancel_date')}`) : undefined}
          rules={[{ required: true, message: '请选择注销时间' }]}
          {...formLayoutC3}
        >
          <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
        </Form.Item>,
      );
    } else {
      formItems.push(
        <Form.Item
          label="公司名称"
          name="companyName"
          initialValue={dot.get(businessCompanyDetail, 'name', undefined)}
          rules={[{ required: true, message: '请输入公司名称' }]}
          {...formLayoutC3}
        >
          <Input placeholder="请输入公司名称" />
        </Form.Item >,
        <Form.Item
          label="公司性质"
          name="companyType"
          initialValue={dot.get(businessCompanyDetail, 'firm_type', undefined)}
          rules={[{ required: true, message: '请选择公司性质' }]}
          {...formLayoutC3}
        >
          <Select placeholder="请选择公司性质" style={{ width: '100%' }} >
            <Option value={BusinessCompanyType.child}>{BusinessCompanyType.description(BusinessCompanyType.child)}</Option>
            <Option value={BusinessCompanyType.points}>{BusinessCompanyType.description(BusinessCompanyType.points)}</Option>
            <Option value={BusinessCompanyType.joint}>{BusinessCompanyType.description(BusinessCompanyType.joint)}</Option>
            <Option value={BusinessCompanyType.acquisition}>{BusinessCompanyType.description(BusinessCompanyType.acquisition)}</Option>
            <Option value={BusinessCompanyType.other}>{BusinessCompanyType.description(BusinessCompanyType.other)}</Option>
          </Select>
        </Form.Item >,
        <Form.Item
          label="法人代表"
          name="guardianship"
          initialValue={dot.get(businessCompanyDetail, 'legal_name', undefined)}
          rules={[{ required: true, message: '请输入法人代表' }]}
          {...formLayoutC3}
        >
          <Input placeholder="请输入法人代表" />
        </Form.Item >,
        <Form.Item >
          <Row>
            <Col span={17} offset={3} style={{ marginLeft: 79 }}>
              <Form.Item
                label="注册资本"
                name="capital"
                initialValue={dot.get(businessCompanyDetail, 'registered_capital') >= 0 ? Unit.exchangePriceToWanYuan(dot.get(businessCompanyDetail, 'registered_capital')) : undefined}
                rules={[{ required: true, message: '请输入注册资本' }]}
              >
                <InputNumber style={{ width: '90%' }} precision={2} min={0} max={99999} step={0.01} />
              </Form.Item >
            </Col>
            <Col span={3}>
              <Form.Item>
                {<span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>万元</span>}
              </Form.Item >
            </Col>
          </Row>
        </Form.Item>,
        <Form.Item
          label="注册时间"
          name="registeredDate"
          initialValue={dot.get(businessCompanyDetail, 'registered_date') ? moment(`${dot.get(businessCompanyDetail, 'registered_date')}`) : undefined}
          rules={[{ required: true, message: '请选择注册时间' }]}
          {...formLayoutC3}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item >,
        <Form.Item
          label="注册地址"
          name="address"
          initialValue={dot.get(businessCompanyDetail, 'registered_address', undefined)}
          rules={[{ required: true, message: '请输入注册地址' }]}
          {...formLayoutC3}
        >
          <Input placeholder="请输入注册地址" />
        </Form.Item >,
        <Form.Item
          label="股东信息"
          name="shareholders"
          initialValue={dot.get(businessCompanyDetail, 'share_holder_info', undefined)}
          rules={[{ required: true, message: '请输入股东信息' }]}
          {...formLayoutC3}
        >
          <Input placeholder="请输入股东信息" />
        </Form.Item >,
      );
    }
    const publicItems = [
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
        rules={[{ required: dot.get(businessCompanyDetail, 'deal_type') === BusinessCompanyHandleType.cancellation ? false : true, message: '请输入上传附件' }]}
        {...formLayoutC1}
      >
        <PageUpload domain="oa_approval" />
      </Form.Item >,
    ];
    return (
      <CoreContent title="注册/注销公司信息">
        <CoreForm items={handleItems} cols={1} />
        <CoreForm items={formItems} cols={2} />
        <CoreForm items={publicItems} cols={1} />
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
  return {
    businessCompanyDetail,
    companySelectInfo,
    examineFlowInfo,
  };
};

export default connect(mapStateToProps)(RegisteredCompanyUpdate);
