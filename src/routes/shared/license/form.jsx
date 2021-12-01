/**
 * 共享登记 - 证照表单
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Radio,
  Checkbox,
  message,
} from 'antd';
import { connect } from 'dva';

import { CoreForm, CoreContent } from '../../../components/core';
import { PageUpload } from '../../oa/document/components/index';
import Company from '../component/company';
import AuthorityComponent from '../component/authorityComponent';
import {
  SharedLicenseType,
  AdministrationLicenseType,
  AdministrationLicense,
  SharedAuthorityState,
  SharedLicenseDeadLineType,
} from '../../../application/define';
import { CommonSelectDepartmentEmployees } from '../../../components/common';
import { regionalList } from '../../../components/common/select/regional/regionalList';

const FormLayoutC3 = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

const formLayoutC1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const Option = Select.Option;
const TextArea = Input.TextArea;

const LicenseForm = ({
  getLicenseDetail,
  resetLicenseDetail,
  location = {},
  licenseDetail = {},
  isUpdate = false,
  createLicense,
  updateLicense,
}) => {
  const [form] = Form.useForm();
  const { query = {} } = location;
  const [isShow, setIsShow] = useState(false);
  const [cityData, setCityData] = useState([]);
  const [showToday, setShowToday] = useState(true);
  useEffect(() => {
    query.id && getLicenseDetail({ id: query.id });
    return () => resetLicenseDetail();
  }, [getLicenseDetail, resetLicenseDetail, query.id]);

  useEffect(() => {
    if (isUpdate && licenseDetail && Object.keys(licenseDetail).length > 0 && cityData.length === 0) {
      getCurrentProvince();
    }
  }, [licenseDetail]);

  useEffect(() => {
    if (isUpdate && licenseDetail && Object.keys(licenseDetail).length > 0) {
      setIsShow(dot.get(licenseDetail, 'cert_type', undefined) === SharedLicenseType.businessLicense);
    }
  }, [licenseDetail]);

  // 编辑页，需要获取详情
  if (isUpdate && (!licenseDetail || Object.keys(licenseDetail).length <= 0)) return <div />;

  // 获取当前城市列表
  const getCurrentProvince = () => {
    const { province_code: province = undefined } = licenseDetail;
    const currentProvince = province ? regionalList.find(i => i.code === Number(province)) : {};
    const { children: initCity = [] } = currentProvince;
    setCityData(initCity);
  };

  const {
    from_date: fromDate = undefined,
    end_date: endDate = undefined,
    send_date: sendDate = undefined,
    other_cert_deadline: otherCertDeadline = undefined,
    province_code: provinceCode = undefined,
    city_code: cityCode = undefined,
  } = licenseDetail;

  // province onChange
  const onChangeProvince = (val, option) => {
    const { citychild = [] } = option;
    form.setFieldsValue({ city_code: undefined });
    setCityData(citychild);
  };

  const onChangeCertType = (val) => {
    if (val === SharedLicenseType.businessLicense) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  };

  const changeFromDate = () => {
    form.setFieldsValue({
      end_date: null,
    });
  };

  // 营业期限结束 日期限制
  const endDateDisabledDate = (current) => {
    // 需大于营业期限开始时间
    const fromDateForm = form.getFieldValue('from_date');
    if (!fromDateForm) return false;
    if (moment(fromDateForm).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      setShowToday(false);
    } else {
      setShowToday(true);
    }
    return current && current < moment(fromDateForm).add(1, 'days');
  };

  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const { lookAccountInfo } = formRes;
    if (lookAccountInfo.state === SharedAuthorityState.section
      && lookAccountInfo.accountInfo.length === 0
      && lookAccountInfo.departmentInfo.length === 0) {
      return message.error('请选择指定范围');
    }
    delete formRes.originForm;
    const res = isUpdate ?
      await updateLicense({ ...formRes, _id: query.id })
      : await createLicense({ ...formRes });
    if (res && (res._id || res.ok)) {
      message.success('请求成功');
      window.location.href = '/#/Shared/License';
    }
  };

  const items = [
    <Form.Item
      name="cert_type"
      label="证照类型"
      rules={[{ required: true, message: '请选择证照类型' }]}
    >
      <Select placeholder="请选择" onChange={onChangeCertType}>
        <Option value={SharedLicenseType.businessLicense}>{SharedLicenseType.description(SharedLicenseType.businessLicense)}</Option>
        <Option value={SharedLicenseType.expressDelivery}>{SharedLicenseType.description(SharedLicenseType.expressDelivery)}</Option>
        <Option value={SharedLicenseType.food}>{SharedLicenseType.description(SharedLicenseType.food)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      name="keep_account_id"
      label="证照负责人"
      rules={[{ required: true, message: '请选择证照负责人' }]}
    >
      <CommonSelectDepartmentEmployees
        fareManagerInfo={dot.get(licenseDetail, 'keep_account_info', {})}
        placeholder="请选择"
        showSearch
        optionFilterProp="children"
      />
    </Form.Item>,
  ];

  const originalItems = [
    <Form.Item
      label="正副本"
      name="originForm"
      dependencies={['origin', 'display']}
      rules={[{
        required: true,
        validator: () => {
          const origin = form.getFieldValue('origin');
          const display = form.getFieldValue('display');
          if (isUpdate && origin && display) {
            return Promise.resolve();
          }
          if (origin && Array.isArray(display) && display.length > 0) {
            return Promise.resolve();
          }
          return Promise.reject('请选择正副本');
        },
      }]}
      {...formLayoutC1}
    >
      <div style={{ display: 'flex' }}>
        <Form.Item
          name="origin"
        >
          <Radio.Group>
            <Radio value={AdministrationLicenseType.original}>
              {AdministrationLicenseType.description(AdministrationLicenseType.original)}
            </Radio>
            <Radio value={AdministrationLicenseType.copy}>
              {AdministrationLicenseType.description(AdministrationLicenseType.copy)}
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="display"
          style={{ marginLeft: 100 }}
        >
          {
            isUpdate ?
              (<Radio.Group>
                <Radio value={AdministrationLicense.original}>
                  {AdministrationLicense.description(AdministrationLicense.original)}
                </Radio>
                <Radio value={AdministrationLicense.copies}>
                  {AdministrationLicense.description(AdministrationLicense.copies)}
                </Radio>
                <Radio value={AdministrationLicense.scannedCopy}>
                  {AdministrationLicense.description(AdministrationLicense.scannedCopy)}
                </Radio>
              </Radio.Group>)
              : (<Checkbox.Group>
                <Checkbox value={AdministrationLicense.original}>
                  {AdministrationLicense.description(AdministrationLicense.original)}
                </Checkbox>
                <Checkbox value={AdministrationLicense.copies}>
                  {AdministrationLicense.description(AdministrationLicense.copies)}
                </Checkbox>
                <Checkbox value={AdministrationLicense.scannedCopy}>
                  {AdministrationLicense.description(AdministrationLicense.scannedCopy)}
                </Checkbox>
              </Checkbox.Group>)
          }
        </Form.Item>
      </div>
    </Form.Item>,
  ];

  const nameItems = [
    <Form.Item
      name="name"
      label="证照名称"
      rules={[{ required: true, message: '请填写证照名称' }]}
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="firm_id"
      label="公司名称"
      rules={[{ required: true, message: '请选择公司名称' }]}
    >
      <Company
        otherChild={dot.get(licenseDetail, 'firm_info', {})}
      />
    </Form.Item>,
  ];

  const hideItems = isShow ? [
    <Form.Item
      name="cert_no"
      label="证照编号"
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="credit_no"
      label="统一社会信用代码"
      rules={[
        { required: true, message: '请填写统一社会信用代码' },
        () => ({
          validator(rule, val) {
            const reg = /^[0-9A-Z]{1,}$/;
            if (!val || reg.test(val)) return Promise.resolve();
            return Promise.reject('请输入数字或大写字母');
          },
        }),
      ]}
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="from_date"
      label="营业期限开始"
      rules={[{ required: true, message: '请选择营业期限开始' }]}
    >
      <DatePicker
        placeholder="请选择"
        onChange={changeFromDate}
      />
    </Form.Item>,
    <Form.Item
      name="end_date"
      label="营业期限结束"
      rules={[{ required: true, message: '请选择营业期限结束' }]}
    >
      <DatePicker
        showToday={showToday}
        placeholder="请选择"
        disabledDate={endDateDisabledDate}
      />
    </Form.Item>,
    <Form.Item
      name="send_date"
      label="发证日期"
      rules={[{ required: true, message: '请选择发证日期' }]}
    >
      <DatePicker placeholder="请选择" />
    </Form.Item>,
    <Form.Item
      name="certification_unit"
      label="发证单位"
      rules={[{ required: true, message: '请填写发证单位' }]}
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="cert_deadline_type"
      label="证照有效期"
      rules={[{ required: true, message: '请选择证照有效期' }]}
    >
      <Select placeholder="请选择">
        <Option value={SharedLicenseDeadLineType.exist}>{SharedLicenseDeadLineType.description(SharedLicenseDeadLineType.exist)}</Option>
        <Option value={SharedLicenseDeadLineType.not}>{SharedLicenseDeadLineType.description(SharedLicenseDeadLineType.not)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, curValues) => prevValues.cert_deadline_type !== curValues.cert_deadline_type}
    >
      {({ getFieldValue }) => {
        return getFieldValue('cert_deadline_type') === SharedLicenseDeadLineType.exist
        ? <Form.Item
          name="other_cert_deadline"
          rules={[{ required: true, message: '请选择证照有效期' }]}
        >
          <DatePicker placeholder="请选择" />
        </Form.Item>
       : null;
      }}
    </Form.Item>,
    {
      key: 'area_code',
      span: 24,
      render: (
        <Form.Item
          name="area"
          label="公司区域"
          {...formLayoutC1}
          required
        >
          <div style={{ display: 'flex' }}>
            <Form.Item
              name="province_code"
              rules={[{ required: true, message: '请选择省份' }]}
              style={{ width: '25%', marginRight: 5 }}
            >
              <Select onChange={onChangeProvince} placeholder="请选择省份">
                {
                  regionalList.map(i => <Option value={String(i.code)} citychild={i.children}>{i.value}</Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item
              name="city_code"
              style={{ width: '30%' }}
              rules={[{ required: true, message: '请选择城市' }]}
            >
              <Select placeholder="请选择城市">
                {
                  cityData.map(i => <Option value={String(i.code)}>{i.value}</Option>)
                }
              </Select>
            </Form.Item>
          </div>
        </Form.Item>
      ),
    },
  ] : [];

  const noteAndFileItems = [
    <Form.Item
      name="note"
      label="备注"
      {...formLayoutC1}
    >
      <TextArea rows={4} placeholder="请输入" />
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
    cert_type: dot.get(licenseDetail, 'cert_type', undefined),
    keep_account_id: dot.get(licenseDetail, 'keep_account_info._id', undefined),
    name: dot.get(licenseDetail, 'name', undefined),
    firm_id: dot.get(licenseDetail, 'firm_info._id', undefined),
    cert_no: dot.get(licenseDetail, 'cert_no', undefined),
    credit_no: dot.get(licenseDetail, 'credit_no', undefined),
    from_date: fromDate ? moment(String(fromDate)) : undefined,
    end_date: endDate ? moment(String(endDate)) : undefined,
    send_date: sendDate ? moment(String(sendDate)) : undefined,
    certification_unit: dot.get(licenseDetail, 'certification_unit', undefined),
    cert_deadline_type: dot.get(licenseDetail, 'cert_deadline_type', undefined) ? dot.get(licenseDetail, 'cert_deadline_type') : undefined,
    other_cert_deadline: otherCertDeadline ? moment(String(otherCertDeadline)) : undefined,
    note: dot.get(licenseDetail, 'note', undefined),
    asset_keys: PageUpload.getInitialValue(licenseDetail, 'asset_infos', {}),
    province_code: provinceCode ? provinceCode : undefined,
    city_code: cityCode ? cityCode : undefined,
    origin: dot.get(licenseDetail, 'origin', undefined),
    display: dot.get(licenseDetail, 'display', undefined),
    lookAccountInfo: {
      state: dot.get(licenseDetail, 'look_acl', SharedAuthorityState.section),
      accountInfo: dot.get(licenseDetail, 'look_account_info_list', []).map(item => ({ id: item._id, name: item.name })),
      departmentInfo: dot.get(licenseDetail, 'look_department_info_list', []).map(item => ({ id: item._id, name: item.name })),
    },
  };

  return (
    <Form {...FormLayoutC3} form={form} initialValues={initialValue}>
      <CoreContent>
        <CoreForm items={items} />
        <CoreForm items={originalItems} cols={1} />
        <CoreForm items={nameItems} />
        <CoreForm items={hideItems} />
        <CoreForm items={noteAndFileItems} cols={1} />
        <CoreContent title="权限">
          <AuthorityComponent detail={licenseDetail} />
        </CoreContent>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={onSubmit}>保存</Button>
        </div>
      </CoreContent>
    </Form>
  );
};

const mapDispatchToProps = dispatch => ({
  getLicenseDetail: payload => dispatch({
    type: 'sharedLicense/getSharedLicenseDetail',
    payload,
  }),
  resetLicenseDetail: () => dispatch({
    type: 'sharedLicense/resetSharedLicenseDetail',
    payload: {},
  }),
  updateLicense: payload => dispatch({
    type: 'sharedLicense/updateSharedLicense',
    payload,
  }),
  createLicense: payload => dispatch({
    type: 'sharedLicense/createSharedLicense',
    payload,
  }),
});

const mapStateToProps = ({ sharedLicense: { licenseDetail } }) => ({ licenseDetail });

export default connect(mapStateToProps, mapDispatchToProps)(LicenseForm);
