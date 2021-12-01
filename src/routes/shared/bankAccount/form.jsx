/**
 * 共享登记 - 银行表单
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {
  Input,
  Form,
  Button,
  Select,
  DatePicker,
  message,
  Checkbox,
  Row,
  Col,
  Radio,
} from 'antd';
import { connect } from 'dva';

import { CoreForm, CoreContent } from '../../../components/core';
import { PageUpload } from '../../oa/document/components/index';
import Company from '../component/company';
import Employee from '../component/employee';
import AuthorityComponent from '../component/authorityComponent';
import {
  BusinesBankAccountType,
  SharedBankAccountState,
  SharedAuthorityState,
  SharedBankCurrency,
  SharedBankOnlineBankType,
  SharedBankOpenAccountInfoType,
  SharedBankChangeSchedule,
  SharedBankAccountSystem,
} from '../../../application/define';
import { authorize } from '../../../application';
import { regionalList } from '../../../components/common/select/regional/regionalList';

const { staffProfileId } = authorize.account;
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

const BankAccountForm = ({
  location = {},
  updateForm,
  createForm,
  getBankAccountDetail,
  resetBankAccountDetail,
  getEmployeeDetail,
  bankAccountDetail = {},
  isUpdate = false,
  getBankOperator,
  resetBankOperator,
  bankOperator = {}, // 银行操作人（网银保管人，开户人）
}) => {
  const [form] = Form.useForm();
  const { query = {} } = location;
  const [cityData, setCityData] = useState([]);
  const [taxNumber, setTaxNumber] = useState(undefined);
  // 开户资料form value
  const [information, setInformation] = useState([]);
  // 银行变更进度form value
  const [schedule, setSchedule] = useState(undefined);
  // 网银
  const [onlineBanking, setOnlineBanking] = useState(SharedBankOnlineBankType.manage);

  useEffect(() => {
    getBankOperator();
    return () => resetBankOperator();
  }, [getBankOperator, resetBankOperator]);

  useEffect(() => {
    query.id && getBankAccountDetail({ id: query.id });
    return () => resetBankAccountDetail();
  }, [getBankAccountDetail, resetBankAccountDetail, query.id]);

  useEffect(() => {
    if (isUpdate && bankAccountDetail && Object.keys(bankAccountDetail).length > 0 && cityData.length === 0) {
      getCurrentProvince();
    }

    setInformation(dot.get(bankAccountDetail, 'opened_data', []));
    setSchedule(bankAccountDetail.account_change_schedule || SharedBankChangeSchedule.done);
    setOnlineBanking(dot.get(bankAccountDetail, 'online_banking', undefined));
  }, [bankAccountDetail]);

  // 获取人员详情（为了拿到详情中的部门id，在Modal中使用）
  useEffect(() => {
    if (!staffProfileId) return;
    getEmployeeDetail();
  }, []);

  // 无数据
  if (isUpdate && (!bankAccountDetail || Object.keys(bankAccountDetail).length <= 0)) return <div />;

  // 获取当前城市列表
  const getCurrentProvince = () => {
    const { province_code: province = undefined } = bankAccountDetail;
    const currentProvince = province ? regionalList.find(i => i.code === Number(province)) : {};
    const { children: initCity = [] } = currentProvince;
    setCityData(initCity);
  };

  const {
    bank_opened_date: bankOpenedDate = undefined,
    state = SharedBankAccountState.normal,
    province_code: provinceCode = undefined,
    city_code: cityCode = undefined,
  } = bankAccountDetail;

  const validatorBankWay = (rule, value, callback) => {
    const reg = /^[\d_()]+$/;
    if ((value && reg.test(value)) || !value) {
      callback();
      return;
    }
    callback('银行联系方式须为数字,下划线或圆括号');
  };

  // province onChange
  const onChangeProvince = (val, option) => {
    const { citychild = [] } = option;
    form.setFieldsValue({ city_code: undefined });
    setCityData(citychild);
  };

  // company onChange
  const onChangeCompany = (val, option) => {
    const { child = {} } = option;
    const { tax_number: currentTax } = child;
    currentTax && (setTaxNumber(currentTax));
  };

  const onSubmit = async () => {
    const formRes = await form.validateFields();

    const {
      lookAccountInfo,
    } = formRes;

    if (lookAccountInfo.state === SharedAuthorityState.section
      && lookAccountInfo.accountInfo.length === 0
      && lookAccountInfo.departmentInfo.length === 0) {
      return message.error('请选择指定范围');
    }

    // 默认网银保管人
    const onlineApprovalId = dot.get(bankOperator, 'online_approval._id')
      ? [dot.get(bankOperator, 'online_approval._id')]
      : undefined;

    // 网银保管人
    // 经办网银：form中获取网银保管人
    // 审批网银：固定接口获取网银保管人
    const onlineCustodianEmployeeIds = onlineBanking === SharedBankOnlineBankType.approve
      ? onlineApprovalId
      : formRes.online_custodian_employee_ids;

    // 编辑
    const res = isUpdate ?
      await updateForm({
        ...formRes,
        online_custodian_employee_ids: onlineCustodianEmployeeIds,
        opened_custodian_employee_id: dot.get(bankOperator, 'opened._id'), // 开户保管人（固定接口获取）
        _id: query.id,
      })
      // 创建
      : await createForm({
        ...formRes,
        online_custodian_employee_ids: onlineCustodianEmployeeIds,
        opened_custodian_employee_id: dot.get(bankOperator, 'opened._id'), // 开户保管人（固定接口获取）
      });
    if (res && res._id) {
      message.success('请求成功');
      window.location.href = '/#/Shared/BankAccount';
    }
  };

  const items = [
    <Form.Item
      name="firm_id"
      label="公司名称"
      rules={[{ required: true, message: '请选择公司' }]}
    >
      <Company
        onChange={onChangeCompany}
        otherChild={dot.get(bankAccountDetail, 'firm_info', {})}
      />
    </Form.Item>,
    <Form.Item
      key="firm_info_tax_number"
      label="税号"
    >
      {taxNumber || dot.get(bankAccountDetail, 'firm_info.tax_number', '--')}
    </Form.Item>,
    <Form.Item
      name="bank_card"
      label="开户账号"
      rules={[{ required: true, message: '请填写开户账号' }]}
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="bank_card_type"
      label="账户类型"
      rules={[{ required: true, message: '请选择账户类型' }]}
    >
      <Select placeholder="请选择">
        <Option value={BusinesBankAccountType.basic}>{BusinesBankAccountType.description(BusinesBankAccountType.basic)}</Option>
        <Option value={BusinesBankAccountType.general}>{BusinesBankAccountType.description(BusinesBankAccountType.general)}</Option>
        <Option value={BusinesBankAccountType.temporary}>{BusinesBankAccountType.description(BusinesBankAccountType.temporary)}</Option>
        <Option value={BusinesBankAccountType.special}>{BusinesBankAccountType.description(BusinesBankAccountType.special)}</Option>
        <Option value={BusinesBankAccountType.treasure}>{BusinesBankAccountType.description(BusinesBankAccountType.treasure)}</Option>
        <Option value={BusinesBankAccountType.dollar}>{BusinesBankAccountType.description(BusinesBankAccountType.dollar)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      name="bank_and_branch"
      label="开户行及支行"
      rules={[{ required: true, message: '请填写开户行及支行' }]}
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="bank_opened_date"
      label="开户时间"
    >
      <DatePicker />
    </Form.Item>,
    {
      key: 'area_code',
      span: 24,
      render: (
        <Form.Item
          label="所属区域"
          required
          {...formLayoutC1}
        >
          <div style={{ display: 'flex' }}>
            <Form.Item
              name="province_code"
              rules={[{ required: true, message: '请选择省份' }]}
              style={{ width: '25%', marginRight: 5, marginBottom: 0 }}
            >
              <Select onChange={onChangeProvince} placeholder="请选择省份">
                {
                  regionalList.map(i => <Option value={String(i.code)} citychild={i.children}>{i.value}</Option>)
                }
              </Select>
            </Form.Item>
            <Form.Item
              name="city_code"
              style={{ width: '30%', marginBottom: 0 }}
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
    <Form.Item
      name="opening_address"
      label="开户地址"
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      label="币种"
      name="currency"
    >
      <Select
        placeholder="请选择"
        allowClear
      >
        <Option value={SharedBankCurrency.rmb}>
          {SharedBankCurrency.description(SharedBankCurrency.rmb)}
        </Option>
        <Option value={SharedBankCurrency.dollar}>
          {SharedBankCurrency.description(SharedBankCurrency.dollar)}
        </Option>
        <Option value={SharedBankCurrency.hkdollar}>
          {SharedBankCurrency.description(SharedBankCurrency.hkdollar)}
        </Option>
        <Option value={SharedBankCurrency.other}>
          {SharedBankCurrency.description(SharedBankCurrency.other)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="网银"
      name="online_banking"
    >
      <Select
        placeholder="请选择"
        allowClear
        onChange={val => setOnlineBanking(val)}
      >
        <Option value={SharedBankOnlineBankType.manage}>
          {SharedBankOnlineBankType.description(SharedBankOnlineBankType.manage)}
        </Option>
        <Option value={SharedBankOnlineBankType.approve}>
          {SharedBankOnlineBankType.description(SharedBankOnlineBankType.approve)}
        </Option>
      </Select>
    </Form.Item>,
  ];

  // 网银保管人
  items[items.length] = onlineBanking !== SharedBankOnlineBankType.approve ?
    (
      <Form.Item
        label="网银保管人"
        name="online_custodian_employee_ids"
        key="form_online_custodian_employee_ids"
      >
        <Employee
          mode="multiple"
          showArrow
          initVal={dot.get(bankAccountDetail, 'online_custodian_employee_list')}
        />
      </Form.Item>
    ) : (
      <Form.Item
        label="网银保管人"
        key="detail_online_custodian_employee_ids"
      >
        {dot.get(bankOperator, 'online_approval.name', '--')}
      </Form.Item>
    );
  // 账户体系
  items.push(<Form.Item
    label="账户体系"
    name="account_system"
  >
    <Select
      placeholder="请选择"
      allowClear
    >
      <Option value={SharedBankAccountSystem.inside}>
        {SharedBankAccountSystem.description(SharedBankAccountSystem.inside)}
      </Option>
      <Option value={SharedBankAccountSystem.outside}>
        {SharedBankAccountSystem.description(SharedBankAccountSystem.outside)}
      </Option>
    </Select>
  </Form.Item>);

  // 开户资料items
  const itemsOpenInfo = [
    <Form.Item
      label="开户资料"
      name="opened_data"
      {...formLayoutC1}
    >
      <Checkbox.Group
        onChange={val => setInformation(val)}
        style={{ width: '100%' }}
      >
        <Row>
          <Col span={4}>
            <Checkbox
              value={SharedBankOpenAccountInfoType.printCard}
            >
              {SharedBankOpenAccountInfoType.description(SharedBankOpenAccountInfoType.printCard)}
            </Checkbox>
          </Col>
          <Col span={4}>
            <Checkbox
              value={SharedBankOpenAccountInfoType.application}
            >
              {SharedBankOpenAccountInfoType.description(SharedBankOpenAccountInfoType.application)}
            </Checkbox>
          </Col>
          <Col span={4}>
            <Checkbox
              value={SharedBankOpenAccountInfoType.settlementCatd}
            >
              {SharedBankOpenAccountInfoType.description(SharedBankOpenAccountInfoType.settlementCatd)}
            </Checkbox>
          </Col>
          <Col span={4}>
            <Checkbox
              value={SharedBankOpenAccountInfoType.cipherLetter}
            >
              {SharedBankOpenAccountInfoType.description(SharedBankOpenAccountInfoType.cipherLetter)}
            </Checkbox>
          </Col>
          <Col span={4}>
            <Checkbox
              value={SharedBankOpenAccountInfoType.other}
            >
              {SharedBankOpenAccountInfoType.description(SharedBankOpenAccountInfoType.other)}
            </Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
    </Form.Item>,
  ];

  // 银行联系人
  const itemsBankPerson = [
    <Form.Item
      key="opened-name"
      label="开户保管人"
    >
      {dot.get(bankOperator, 'opened.name', '--')}
    </Form.Item>,
    <Form.Item key="empty_2" />,
    <Form.Item key="empty_3" />,
    <Form.Item
      label="银行联系人"
      name="bank_user_contact_name"
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      label="银行联系方式"
      name="bank_user_contact_way"
      rules={[
        { validator: validatorBankWay },
      ]}
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      label="银行变更进度"
      name="account_change_schedule"
    >
      <Radio.Group
        onChange={val => setSchedule(val.target.value)}
      >
        <Radio
          value={SharedBankChangeSchedule.done}
        >
          {SharedBankChangeSchedule.description(SharedBankChangeSchedule.done)}
        </Radio>
        <Radio
          value={SharedBankChangeSchedule.undone}
        >
          {SharedBankChangeSchedule.description(SharedBankChangeSchedule.undone)}
        </Radio>
      </Radio.Group>
    </Form.Item>,
  ];

  // 开户资料说明
  information.includes(SharedBankOpenAccountInfoType.other) && (itemsBankPerson[itemsBankPerson.length] = (
  {
    span: 24,
    key: 'opened_data_desc',
    render: (
      <Form.Item
        label="开户资料说明"
        name="opened_data_desc"
        {...formLayoutC1}
      >
        <TextArea rows={4} placeholder="请输入" />
      </Form.Item>
    ),
  }
  ));

  // 账户进度说明
  schedule === SharedBankChangeSchedule.undone && (itemsBankPerson[itemsBankPerson.length] = {
    span: 24,
    key: 'account_change_schedule_desc',
    render: (
      <Form.Item
        label="账户进度说明"
        name="account_change_schedule_desc"
        {...formLayoutC1}
      >
        <TextArea rows={4} placeholder="请输入" />
      </Form.Item>
    ),
  });

  const itemsOne = [
    <Form.Item
      name="note"
      label="备注"
      {...formLayoutC1}
    >
      <TextArea rows={4} placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      label="状态"
      key="state"
      {...formLayoutC1}
    >
      {state ? SharedBankAccountState.description(state) : '--'}
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
    note: dot.get(bankAccountDetail, 'note', undefined),
    firm_id: dot.get(bankAccountDetail, 'firm_info._id', undefined),
    bank_card: dot.get(bankAccountDetail, 'bank_card', undefined),
    bank_card_type: dot.get(bankAccountDetail, 'bank_card_type', undefined),
    bank_and_branch: dot.get(bankAccountDetail, 'bank_and_branch', undefined),
    bank_opened_date: bankOpenedDate ? moment(String(bankOpenedDate)) : undefined,
    opening_address: dot.get(bankAccountDetail, 'opening_address', undefined),
    asset_keys: PageUpload.getInitialValue(bankAccountDetail, 'asset_infos', {}),
    province_code: provinceCode ? provinceCode : undefined,
    city_code: cityCode ? cityCode : undefined,
    lookAccountInfo: {
      state: dot.get(bankAccountDetail, 'look_acl', SharedAuthorityState.section),
      accountInfo: dot.get(bankAccountDetail, 'look_account_info_list', []).map(item => ({ id: item._id, name: item.name })),
      departmentInfo: dot.get(bankAccountDetail, 'look_department_info_list', []).map(item => ({ id: item._id, name: item.name })),
    },
    currency: dot.get(bankAccountDetail, 'currency') > 0 ? dot.get(bankAccountDetail, 'currency') : undefined,
    online_banking: dot.get(bankAccountDetail, 'online_banking') > 0 ?
      dot.get(bankAccountDetail, 'online_banking') : undefined,
    online_custodian_employee_ids: dot.get(bankAccountDetail, 'online_custodian_employee_ids', undefined),
    account_system: dot.get(bankAccountDetail, 'account_system') > 0 ? dot.get(bankAccountDetail, 'account_system') : undefined,
    opened_data: dot.get(bankAccountDetail, 'opened_data', undefined),
    opened_custodian_employee_id: dot.get(bankAccountDetail, 'opened_custodian_employee_id', undefined),
    opened_data_desc: dot.get(bankAccountDetail, 'opened_data_desc', undefined),
    bank_user_contact_name: dot.get(bankAccountDetail, 'bank_user_contact_name', undefined),
    bank_user_contact_way: dot.get(bankAccountDetail, 'bank_user_contact_way', undefined),
    account_change_schedule: bankAccountDetail.account_change_schedule || SharedBankChangeSchedule.done,
    account_change_schedule_desc: dot.get(bankAccountDetail, 'account_change_schedule_desc', undefined),
  };

  return (
    <Form
      {...FormLayoutC3}
      form={form}
      initialValues={initialValue}
    >
      <CoreContent>
        <CoreForm items={items} />
        <CoreForm items={itemsOpenInfo} cols={1} />
        <CoreForm items={itemsBankPerson} />
        <CoreForm items={itemsOne} cols={1} />
        <CoreContent title="权限">
          <AuthorityComponent detail={bankAccountDetail} />
        </CoreContent>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={onSubmit}>保存</Button>
        </div>
      </CoreContent>
    </Form>
  );
};

const mapDispatchToProps = dispatch => ({
  getBankAccountDetail: payload => dispatch({
    type: 'sharedBankAccount/getSharedBankAccountDetail',
    payload,
  }),
  resetBankAccountDetail: () => dispatch({
    type: 'sharedBankAccount/resetSharedBankAccountDetail',
    payload: {},
  }),
  updateForm: payload => dispatch({
    type: 'sharedBankAccount/updateSharedBankAccount',
    payload,
  }),
  createForm: payload => dispatch({
    type: 'sharedBankAccount/createSharedBankAccount',
    payload,
  }),
  getEmployeeDetail: () => dispatch({
    type: 'oaCommon/fetchEmployeeDetail',
    payload: { id: staffProfileId },
  }),
  getBankOperator: () => dispatch({
    type: 'sharedBankAccount/getBankOperator',
    payload: {},
  }),
  resetBankOperator: () => dispatch({
    type: 'sharedBankAccount/resetBankOperator',
    payload: {},
  }),
});

const mapStateToProps = ({ sharedBankAccount: { bankAccountDetail, bankOperator } }) => ({ bankAccountDetail, bankOperator });
export default connect(mapStateToProps, mapDispatchToProps)(BankAccountForm);
