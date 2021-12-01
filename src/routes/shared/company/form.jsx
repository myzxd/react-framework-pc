/**
 * 共享登记 - 公司表单
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { useEffect } from 'react';
import {
  Input,
  Form,
  Button,
  Select,
  DatePicker,
  InputNumber,
  message,
} from 'antd';
import { connect } from 'dva';

import { CoreForm, CoreContent } from '../../../components/core';
import { PageUpload } from '../../oa/document/components/index';
import AuthorityComponent from '../component/authorityComponent';
import {
  Unit,
  SharedCompanyState,
  SharedAuthorityState,
  BusinessCompanyType,
} from '../../../application/define';
import { authorize } from '../../../application';

const { staffProfileId } = authorize.account;
const Option = Select.Option;
const TextArea = Input.TextArea;
const FormLayoutC3 = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

const formLayoutC1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const CompanyForm = ({
  location = {},
  updateForm,
  createForm,
  getCompanyDetail,
  resetCompanyDetail,
  getEmployeeDetail,
  getSharedCompanyNature,
  companyDetail = {},
  companyNature,
  isUpdate = false,
}) => {
  const [form] = Form.useForm();
  const { query = {} } = location;

  useEffect(() => {
    query.id && getCompanyDetail({ id: query.id });
    return () => resetCompanyDetail();
  }, [getCompanyDetail, resetCompanyDetail, query.id]);

  // 获取人员详情（为了拿到详情中的部门id，在Modal中使用）
  useEffect(() => {
    if (!staffProfileId) return;
    getEmployeeDetail();
  }, []);

  // 获取公司类型
  useEffect(() => {
    getSharedCompanyNature();
  }, []);

  if (isUpdate && (!companyDetail || Object.keys(companyDetail).length <= 0)) return <div />;

  const {
    registered_capital: registeredCapital = undefined,
    paid_capital: paidCapital = undefined,
    registered_date: registeredDate = undefined,
    state = SharedCompanyState.normal,
  } = companyDetail;

  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const { lookAccountInfo } = formRes;
    // 共享登记 - 权限状态为指定范围 && 可见成员成员信息不存在
    if (lookAccountInfo.state === SharedAuthorityState.section
      && lookAccountInfo.accountInfo.length === 0
      && lookAccountInfo.departmentInfo.length === 0) {
      return message.error('请选择指定范围');
    }
    const res = isUpdate ?
      await updateForm({ ...formRes, _id: query.id })
      : await createForm({ ...formRes });
    if (res && res._id) {
      message.success('请求成功');
      window.location.href = '/#/Shared/Company';
    }
  };
  const items = [
    <Form.Item
      name="name"
      label="公司名称"
      rules={[{ required: true, message: '请填写公司名称' }]}
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      label="税号"
    >
      {
        dot.get(companyDetail, 'tax_number', '')
        ? dot.get(companyDetail, 'tax_number')
        : '--'
      }
    </Form.Item>,
    <Form.Item
      name="firm_nature"
      label="公司类型"
      rules={[{ required: true, message: '请选择公司类型' }]}
    >
      <Select placeholder="请选择">
        {
          Object.keys(dot.get(companyNature, 'data', {})).map((item) => {
            return (
              <Option key={item} value={Number(item)}>{companyNature.data[item]}</Option>
            );
          })
        }
      </Select>
    </Form.Item>,
    <Form.Item
      name="firm_type"
      label="公司性质"
    >
      <Select placeholder="请选择">
        <Option value={BusinessCompanyType.child}>{BusinessCompanyType.description(BusinessCompanyType.child)}</Option>
        <Option value={BusinessCompanyType.points}>{BusinessCompanyType.description(BusinessCompanyType.points)}</Option>
        <Option value={BusinessCompanyType.joint}>{BusinessCompanyType.description(BusinessCompanyType.joint)}</Option>
        <Option value={BusinessCompanyType.acquisition}>{BusinessCompanyType.description(BusinessCompanyType.acquisition)}</Option>
        <Option value={BusinessCompanyType.other}>{BusinessCompanyType.description(BusinessCompanyType.other)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      name="registered_addr"
      label="注册地址"
      rules={[{ required: true, message: '请填写注册地址' }]}
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="legal_name"
      label="企业代表人"
      rules={[{ required: true, message: '请填写企业代表人' }]}
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="registered_capital"
      label="注册资本（万）"
      rules={[{ required: true, message: '请填写注册资本' }]}
    >
      <InputNumber
        max={99999}
        min={0}
        step={0.01}
        placeholder="请输入"
      />
    </Form.Item>,
    <Form.Item
      name="paid_capital"
      label="实收资本（万）"
    >
      <InputNumber
        max={99999}
        min={0}
        step={0.01}
        placeholder="请输入"
      />
    </Form.Item>,
    <Form.Item
      name="registered_date"
      label="成立日期"
      rules={[{ required: true, message: '请选择成立日期' }]}
    >
      <DatePicker placeholder="请选择" />
    </Form.Item>,
    <Form.Item
      name="share_holder_info"
      label="股东"
    >
      <Input placeholder="请输入" />
    </Form.Item>,
  ];

  const itemsOne = [
    <Form.Item
      name="business_scope"
      label="经营范围"
      rules={[{ required: true, message: '请填写经营范围' }]}
      {...formLayoutC1}
    >
      <TextArea rows={4} placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="note"
      label="备注"
      {...formLayoutC1}
    >
      <TextArea rows={4} placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      label="状态"
      {...formLayoutC1}
    >
      {state ? SharedCompanyState.description(state) : '--'}
    </Form.Item>,
    <Form.Item
      label="附件"
      name="asset_keys"
      {...formLayoutC1}
    >
      <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
    </Form.Item>,
  ];

  const initialValue = {
    name: dot.get(companyDetail, 'name', undefined),
    firm_type: dot.get(companyDetail, 'firm_type', '') ? dot.get(companyDetail, 'firm_type') : undefined,
    firm_nature: dot.get(companyDetail, 'firm_nature', undefined),
    registered_addr: dot.get(companyDetail, 'registered_addr', undefined),
    legal_name: dot.get(companyDetail, 'legal_name', undefined),
    registered_capital: registeredCapital >= 0 ? Unit.exchangePriceToWanYuan(registeredCapital) : undefined,
    paid_capital: paidCapital >= 0 ? Unit.exchangePriceToWanYuan(paidCapital) : undefined,
    registered_date: registeredDate ? moment(String(registeredDate)) : undefined,
    share_holder_info: dot.get(companyDetail, 'share_holder_info', undefined),
    business_scope: dot.get(companyDetail, 'business_scope', undefined),
    note: dot.get(companyDetail, 'note', undefined),
    asset_keys: PageUpload.getInitialValue(companyDetail, 'asset_infos', {}),
    lookAccountInfo: {
      state: dot.get(companyDetail, 'look_acl', SharedAuthorityState.section),
      accountInfo: dot.get(companyDetail, 'look_account_info_list', []).map(item => ({ id: item._id, name: item.name })),
      departmentInfo: dot.get(companyDetail, 'look_department_info_list', []).map(item => ({ id: item._id, name: item.name })),
    },
  };

  return (
    <Form {...FormLayoutC3} form={form} initialValues={initialValue}>
      <CoreContent>
        <CoreForm items={items} />
        <CoreForm items={itemsOne} cols={1} />
        <CoreContent title="权限">
          <AuthorityComponent detail={companyDetail} />
        </CoreContent>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={onSubmit}>保存</Button>
        </div>
      </CoreContent>
    </Form>
  );
};

const mapDispatchToProps = dispatch => ({
  getCompanyDetail: payload => dispatch({
    type: 'sharedCompany/getSharedCompanyDetail',
    payload,
  }),
  resetCompanyDetail: () => dispatch({
    type: 'sharedCompany/resetSharedCompanyDetail',
    payload: {},
  }),
  updateForm: payload => dispatch({
    type: 'sharedCompany/updateSharedCompany',
    payload,
  }),
  createForm: payload => dispatch({
    type: 'sharedCompany/createSharedCompany',
    payload,
  }),
  getEmployeeDetail: () => dispatch({
    type: 'oaCommon/fetchEmployeeDetail',
    payload: { id: staffProfileId },
  }),
  getSharedCompanyNature: () => dispatch({
    type: 'sharedCompany/getSharedCompanyNature',
    payload: {},
  }),
});

const mapStateToProps = ({
  sharedCompany: {
    companyDetail, // 公司详情
    companyNature, // 公司类型
  },
}) => ({ companyDetail, companyNature });
export default connect(mapStateToProps, mapDispatchToProps)(CompanyForm);
