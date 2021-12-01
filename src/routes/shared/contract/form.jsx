/**
 * 共享登记 - 合同表单
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import is from 'is_js';
import {
  Input,
  Form,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Radio,
  message,
} from 'antd';
import { connect } from 'dva';

import { CoreForm, CoreContent } from '../../../components/core';
import {
  CommonSelectDepartmentEmployees,
} from '../../../components/common';
import { PageUpload } from '../../oa/document/components/index';
import Company from '../component/company';
import AuthorityComponent from '../component/authorityComponent';
import {
  Unit,
  BusinesContractComeNatureType,
  AdministrationSealType,
  BusinesContractComeInvoiceType,
  SharedBusinessType,
  SharedAuthorityState,
  SharedContractState,
} from '../../../application/define';
import { utils } from '../../../application';
import { regionalList } from '../../../components/common/select/regional/regionalList';
import ContractType from '../component/contractType';


const Option = Select.Option;
const { TextArea } = Input;
const FormLayoutC3 = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

const formLayoutC1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const ContractForm = ({
  location = {},
  updateForm,
  getContractDetail,
  resetContractDetail,
  contractDetail = {},
  getContractTypeDetail,
  contractTypeData = {}, // 枚举表
}) => {
  const [form] = Form.useForm();
  const { query = {} } = location;
  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    getContractTypeDetail();
  }, []);
  useEffect(() => {
    query.id && getContractDetail({ id: query.id });
    return () => resetContractDetail();
  }, [getContractDetail, resetContractDetail, query.id]);

  useEffect(() => {
    if (contractDetail && Object.keys(contractDetail).length > 0 && cityData.length === 0) {
      getCurrentProvince();
    }
  }, [contractDetail]);

  if (!contractDetail || Object.keys(contractDetail).length <= 0) return <div />;

  const {
    from_date: fromDate = undefined,
    end_date: endDate = undefined,
    unit_price: unitPrice = undefined,
  } = contractDetail;

  // 获取当前城市列表
  const getCurrentProvince = () => {
    const { province_code: province = undefined } = contractDetail;
    const currentProvince = province ? regionalList.find(i => i.code === Number(province)) : {};
    const { children: initCity = [] } = currentProvince;
    setCityData(initCity);
  };

  // province onChange
  const onChangeProvince = (val, option) => {
    const { citychild = [] } = option;
    form.setFieldsValue({ city_code: undefined });
    setCityData(citychild);
  };

  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const { lookAccountInfo } = formRes;
    if (lookAccountInfo.state === SharedAuthorityState.section
      && lookAccountInfo.accountInfo.length === 0
      && lookAccountInfo.departmentInfo.length === 0) {
      return message.error('请选择指定范围');
    }
    delete formRes.shared;
    const res = await updateForm({ ...formRes, _id: query.id });
    if (res && res._id) {
      message.success('请求成功');
      window.location.href = '/#/Shared/Contract';
    }
  };

  // 触发表单校验
  const onChangeShared = () => {
    form.validateFields(['shared']);
  };

  // 更改开始时间
  const onChangeStart = () => {
    const { setFieldsValue } = form;
    setFieldsValue({ end_date: null });
  };


  // 限制结束时间
  const onDisabledEndDate = (endValue) => {
    const startTime = form.getFieldValue('from_date');
    if (!endValue || !startTime) {
      return false;
    }

    const starts = moment(moment(startTime).format('YYYY-MM-DD')).valueOf();
    const end = moment(moment(endValue).format('YYYY-MM-DD')).valueOf();
    return end < starts;
  };


  const sealTypes = dot.get(contractTypeData, 'seal_types', '--');
  // 渲染 印章类型
  const renderSealType = () => {
    const sealValue = [];
    if (is.existy(sealTypes) && is.not.empty(sealTypes) && is.object(sealTypes)) {
      Object.keys(sealTypes).map((key) => {
        sealValue.push(<Option value={Number(key)}>{sealTypes[key]}</Option>);
      });
    }
    return sealValue;
  };


  const itemsBasicOne = [
    <Form.Item
      label="合同编号"
    >
      {dot.get(contractDetail, 'pact_no', '--')}
    </Form.Item>,
    <Form.Item
      label="合同名称"
      name="name"
      rules={[
        { required: true, message: '请填写合同名称' },
      ]}
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      name="singer"
      label="签订人"
      rules={[{ required: true, message: '请输入签订人' }]}
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      name="firm_id"
      label="签订单位"
      rules={[{ required: true, message: '请选择签订单位' }]}
    >
      <Company
        otherChild={utils.dotOptimal(contractDetail, 'firm_info', {})}
      />
    </Form.Item>,
    <Form.Item
      label="盖章类型"
      required
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form.Item
          name="seal_type"
          rules={[{ required: true, message: '请选择盖章类型' }]}
          style={{ width: '40%' }}
        >
          <Select placeholder="请选择" allowClear>
            {renderSealType()}
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.seal_type !== currentValues.seal_type}
        >
          {({ getFieldValue }) => {
            return getFieldValue('seal_type') === AdministrationSealType.other ? (
              <Form.Item
                name="other_seal"
                style={{ width: '50%', marginLeft: 10 }}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>

      </div>
    </Form.Item>,
    <Form.Item
      name="pact_part_a"
      label="签订甲方"
      validateFirst
      rules={[
        { required: true, message: '请填写签订甲方' },
        // () => ({
        //   validator(rule, val = []) {
        //     const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
        //     if (val.some(item => !reg.test(item))) {
        //       return Promise.reject('请输入数字、字母或者汉字');
        //     }
        //     return Promise.resolve();
        //   },
        // }),
      ]}
    >
      <Select
        mode="tags"
        allowClear
        notFoundContent=""
        tokenSeparators={[',', '，']}
        placeholder="请输入签订甲方"
      />
    </Form.Item>,
    <Form.Item
      name="pact_part_b"
      label="签订乙方"
      validateFirst
      rules={[
        { required: true, message: '请填写签订乙方' },
        // () => ({
        //   validator(rule, val = []) {
        //     const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
        //     if (val.some(item => !reg.test(item))) {
        //       return Promise.reject('请输入数字、字母或者汉字');
        //     }
        //     return Promise.resolve();
        //   },
        // }),
      ]}
    >
      <Select
        mode="tags"
        allowClear
        notFoundContent=""
        tokenSeparators={[',', '，']}
        placeholder="请输入签订乙方"
      />
    </Form.Item>,
    <Form.Item
      name="pact_part_c"
      label="签订丙方"
      validateFirst
      // rules={[
      //   // { required: true, message: '请填写签订丙方' },
      //   () => ({
      //     validator(rule, val = []) {
      //       const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
      //       if (val.some(item => !reg.test(item))) {
      //         return Promise.reject('请输入数字、字母或者汉字');
      //       }
      //       return Promise.resolve();
      //     },
      //   }),
      // ]}
    >
      <Select
        mode="tags"
        allowClear
        notFoundContent=""
        tokenSeparators={[',', '，']}
        placeholder="请输入签订丙方"
      />
    </Form.Item>,
    <Form.Item
      name="pact_part_d"
      label="签订丁方"
      validateFirst
      // rules={[
      //   // { required: true, message: '请填写签订丁方' },
      //   () => ({
      //     validator(rule, val = []) {
      //       const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
      //       if (val.some(item => !reg.test(item))) {
      //         return Promise.reject('请输入数字、字母或者汉字');
      //       }
      //       return Promise.resolve();
      //     },
      //   }),
      // ]}
    >
      <Select
        mode="tags"
        allowClear
        notFoundContent=""
        tokenSeparators={[',', '，']}
        placeholder="请输入签订丁方"
      />
    </Form.Item>,
  ];

  const itemsShare = [
    <Form.Item
      name="shared"
      label="合同份数"
      rules={[{
        required: true,
        validator: () => {
          const copies = form.getFieldValue('copies');
          const ourCopies = form.getFieldValue('our_copies');
          const oppositeCopies = form.getFieldValue('opposite_copies');
          if (!copies || (!ourCopies && ourCopies !== 0) || (!oppositeCopies && oppositeCopies !== 0)) {
            return Promise.reject('请输入合同份数');
          }
          if (ourCopies + oppositeCopies !== copies) {
            return Promise.reject('我方合同份数与对方合同份数之和需和合同总份数保持一致');
          }
          return Promise.resolve();
        },
      }]}
      style={{ lineHeight: 3 }}
      {...formLayoutC1}
    >
      <React.Fragment>
        一式
        <Form.Item name="copies" style={{ display: 'inline-block', margin: '0 20px' }}>
          <InputNumber
            style={{ width: 60 }}
            min={0}
            precision={0}
            onChange={onChangeShared}
          />
        </Form.Item>
        份，其中我方
        <Form.Item name="our_copies" style={{ display: 'inline-block', margin: '0 20px' }}>
          <InputNumber
            style={{ width: 60 }}
            min={0}
            precision={0}
            onChange={onChangeShared}
          />
        </Form.Item>
        份，对方
        <Form.Item name="opposite_copies" style={{ display: 'inline-block', margin: '0 20px' }}>
          <InputNumber
            style={{ width: 60 }}
            min={0}
            precision={0}
            onChange={onChangeShared}
          />
        </Form.Item>
        份
      </React.Fragment>
    </Form.Item>,
  ];

  const itemsBasicTwo = [
    <Form.Item
      name="from_date"
      label="合同起始日期"
      rules={[{ required: true, message: '请选择' }]}
    >
      <DatePicker onChange={onChangeStart} />
    </Form.Item>,
    <Form.Item
      name="end_date"
      label="合同终止日期"
      rules={[{ required: true, message: '请选择' }]}
    >
      <DatePicker showToday={false} disabledDate={onDisabledEndDate} />
    </Form.Item>,
    <Form.Item
      name="business_type"
      label="业务类别"
      rules={[{ required: true, message: '请选择业务类别' }]}
    >
      <Select placeholder="请选择" allowClear>
        <Option value={SharedBusinessType.purchase}>{SharedBusinessType.description(SharedBusinessType.purchase)}</Option>
        <Option value={SharedBusinessType.electromechanical}>{SharedBusinessType.description(SharedBusinessType.electromechanical)}</Option>
        <Option value={SharedBusinessType.building}>{SharedBusinessType.description(SharedBusinessType.building)}</Option>
        <Option value={SharedBusinessType.airCondi}>{SharedBusinessType.description(SharedBusinessType.airCondi)}</Option>
        <Option value={SharedBusinessType.equipment}>{SharedBusinessType.description(SharedBusinessType.equipment)}</Option>
        <Option value={SharedBusinessType.maintenance}>{SharedBusinessType.description(SharedBusinessType.maintenance)}</Option>
        <Option value={SharedBusinessType.firefighting}>{SharedBusinessType.description(SharedBusinessType.firefighting)}</Option>
      </Select>
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
              style={{ width: '25%', marginRight: 5 }}
            >
              <Select onChange={onChangeProvince} placeholder="请选择省份">
                {
                  regionalList.map(i => <Option key={String(i.code)} value={String(i.code)} citychild={i.children}>{i.value}</Option>)
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
                  cityData.map(i => <Option key={String(i.code)} value={String(i.code)}>{i.value}</Option>)
                }
              </Select>
            </Form.Item>
          </div>
        </Form.Item>
      ),
    },
    <Form.Item
      label="合同保管人"
    >
      {dot.get(contractDetail, 'preserver_info.name', '--')}
    </Form.Item>,

    <Form.Item
      name="pact_property"
      label="合同性质"
    >
      <Select placeholder="请选择" allowClear>
        <Option value={BusinesContractComeNatureType.main}>{BusinesContractComeNatureType.description(BusinesContractComeNatureType.main)}</Option>
        <Option value={BusinesContractComeNatureType.supplement}>{BusinesContractComeNatureType.description(BusinesContractComeNatureType.supplement)}</Option>
        <Option value={BusinesContractComeNatureType.business}>{BusinesContractComeNatureType.description(BusinesContractComeNatureType.business)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      name="pact_type"
      label="合同类型"
    >
      <ContractType placeholder="请选择" />
    </Form.Item>,
    <Form.Item
      name="singer_phone"
      label="签订电话"
      rules={[
        { pattern: /^1[3456789]\d{9}$/, message: '请填写正确电话' },
      ]}
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      name="invoice_type"
      label="发票类型"
    >
      <Select placeholder="请选择" allowClear>
        <Option value={BusinesContractComeInvoiceType.special}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.special)}</Option>
        <Option value={BusinesContractComeInvoiceType.ordinary}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.ordinary)}</Option>
        <Option value={BusinesContractComeInvoiceType.volume}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.volume)}</Option>
        <Option value={BusinesContractComeInvoiceType.machine}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.machine)}</Option>
        <Option value={BusinesContractComeInvoiceType.building}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.building)}</Option>
        <Option value={BusinesContractComeInvoiceType.cargo}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.cargo)}</Option>
        <Option value={BusinesContractComeInvoiceType.highway}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.highway)}</Option>
        <Option value={BusinesContractComeInvoiceType.quota}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.quota)}</Option>
        <Option value={BusinesContractComeInvoiceType.place}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.place)}</Option>
        <Option value={BusinesContractComeInvoiceType.receipt}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.receipt)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      name="fare_manager_id"
      label="票务负责人"
    >
      <CommonSelectDepartmentEmployees
        showSearch
        optionFilterProp="children"
        fareManagerInfo={dot.get(contractDetail, 'fare_manager_info', [])}
        placeholder="请选择"
        allowClear
      />
    </Form.Item>,
    <Form.Item
      name="relation_application_order_ids"
      label="关联审批单"
      validateFirst
      rules={[
        () => ({
          validator(rule, val = []) {
            const reg = /^[0-9a-zA-Z]{1,}$/;
            // 判断是否是数组
            if (Array.isArray(val)) {
              const filterVal = val.filter(v => reg.test(v));
              // 判断过滤的数据是否相等
              if (val.length !== filterVal.length) {
                return Promise.reject('请输入数字、字母');
              }
              if (filterVal.length > 0) {
                return Promise.resolve();
              }
            }
            return Promise.resolve();
          },
        }),
      ]}
    >
      <Select
        mode="tags"
        allowClear
        notFoundContent=""
        tokenSeparators={[',', '，']}
        placeholder="请输入关联审批单"
      />
    </Form.Item>,
    <Form.Item
      name="unit_price"
      label="合同单价（元）"
    >
      <InputNumber step={0.01} min={0} placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="part_pact_no"
      label="客户方合同编号"
      rules={[
        () => ({
          validator(rule, val) {
            const reg = /^[0-9a-zA-Z-_]{1,}$/;
            if (!val || reg.test(val)) return Promise.resolve();
            return Promise.reject('请输入数字、字母或横线');
          },
        }),
      ]}
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      name="customer_company"
      label="客户公司"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      name="customer_info"
      label="客户信息"
      rules={[
        () => ({
          validator(rule, val) {
            const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
            if (!val || reg.test(val)) return Promise.resolve();
            return Promise.reject('请输入数字、字母或者汉字');
          },
        }),
      ]}
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      name="is_backed"
      label="合同版本是否已返回"
    >
      <Radio.Group>
        <Radio value={'1'}>已回</Radio>
        <Radio value={'0'}>未回</Radio>
      </Radio.Group>
    </Form.Item>,
  ];

  const itemsOne = [
    <Form.Item
      name="content"
      label="合同主要内容及条款"
      rules={[{ required: true, pattern: /\S+/, message: '请输入申请原因及说明' }]}
      {...formLayoutC1}
    >
      <TextArea rows={4} placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="note"
      label="备注"
      rules={[{ pattern: /\S+/, message: '请输入备注' }]}
      {...formLayoutC1}
    >
      <TextArea rows={4} placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      label="上传盖章附件"
      name="asset_keys"
      rules={[{ required: true, message: '请上传盖章附件' }]}
      {...formLayoutC1}
    >
      <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
    </Form.Item>,
  ];

  // 合同信息
  const itemContract = [
    <Form.Item
      label="合同状态"
    >
      {
        dot.get(contractDetail, 'state', '')
        ? SharedContractState.description(dot.get(contractDetail, 'state'))
        : '--'
      }
    </Form.Item>,
    <Form.Item
      label="借用人"
    >
      {dot.get(contractDetail, 'borrower_info.name', '--')}
    </Form.Item>,
    <Form.Item
      label="预计归还时间"
    >
      {
        dot.get(contractDetail, 'expected_return_date', '')
        ? moment(`${dot.get(contractDetail, 'expected_return_date')}`).format('YYYY-MM-DD')
        : '--'
      }
    </Form.Item>,
  ];
  let otherSeal;
  if (dot.get(contractDetail, 'seal_type', undefined) === AdministrationSealType.other) {
    otherSeal = dot.get(contractDetail, 'other_seal', undefined);
  }

  const initialValue = {
    name: dot.get(contractDetail, 'name', undefined),
    pact_property: dot.get(contractDetail, 'pact_property') > 0 ? dot.get(contractDetail, 'pact_property') : undefined,
    pact_type: dot.get(contractDetail, 'pact_type') > 0 ? dot.get(contractDetail, 'pact_type') : undefined,
    from_date: fromDate ? moment(String(fromDate)) : undefined,
    end_date: endDate ? moment(String(endDate)) : undefined,
    fare_manager_id: utils.dotOptimal(contractDetail, 'fare_manager_id', undefined) || undefined,
    relation_application_order_ids: (
      dot.get(contractDetail, 'relation_application_order_list', undefined)
      && Array.isArray(contractDetail.relation_application_order_list))
      ? contractDetail.relation_application_order_list.map(v => v._id) : '--',
    unit_price: unitPrice ? Unit.exchangePriceToYuan(unitPrice) : undefined,
    part_pact_no: dot.get(contractDetail, 'part_pact_no', undefined),
    firm_id: dot.get(contractDetail, 'firm_info._id', undefined),
    business_type: contractDetail.business_type || undefined,
    singer: dot.get(contractDetail, 'singer', undefined),
    singer_phone: dot.get(contractDetail, 'singer_phone', undefined),
    copies: dot.get(contractDetail, 'copies', 0),
    our_copies: dot.get(contractDetail, 'our_copies', 0),
    opposite_copies: dot.get(contractDetail, 'opposite_copies', 0),
    pact_part_a: dot.get(contractDetail, 'pact_part_a') ? dot.get(contractDetail, 'pact_part_a').split('、') : undefined,
    pact_part_b: dot.get(contractDetail, 'pact_part_b') ? dot.get(contractDetail, 'pact_part_b').split('、') : undefined,
    pact_part_c: dot.get(contractDetail, 'pact_part_c') ? dot.get(contractDetail, 'pact_part_c').split('、') : undefined,
    pact_part_d: dot.get(contractDetail, 'pact_part_d') ? dot.get(contractDetail, 'pact_part_d').split('、') : undefined,
    customer_company: dot.get(contractDetail, 'customer_company', undefined),
    seal_type: dot.get(contractDetail, 'seal_type', undefined),
    other_seal: otherSeal,
    customer_info: dot.get(contractDetail, 'customer_info', undefined),
    invoice_type: dot.get(contractDetail, 'invoice_type') > 0 ? dot.get(contractDetail, 'invoice_type') : undefined,
    is_backed: typeof (contractDetail.is_backed) === 'object' && !contractDetail.is_backed
                ? undefined
                : dot.get(contractDetail, 'is_backed', false) ? '1' : '0',
    content: dot.get(contractDetail, 'content', undefined),
    note: dot.get(contractDetail, 'note', undefined),
    asset_keys: PageUpload.getInitialValue(contractDetail, 'asset_infos', {}),
    city_code: contractDetail.city_code || undefined,
    province_code: contractDetail.province_code || undefined,
    lookAccountInfo: {
      state: dot.get(contractDetail, 'look_acl', SharedAuthorityState.section),
      accountInfo: dot.get(contractDetail, 'look_account_info_list', []).map(item => ({ id: item._id, name: item.name })),
      departmentInfo: dot.get(contractDetail, 'look_department_info_list', []).map(item => ({ id: item._id, name: item.name })),
    },
  };

  return (
    <Form {...FormLayoutC3} form={form} initialValues={initialValue}>
      <CoreContent>
        <CoreForm items={itemsBasicOne} />
        <CoreForm items={itemsShare} cols={1} />
        <CoreForm items={itemsBasicTwo} />
        <CoreForm items={itemsOne} cols={1} />
        <CoreContent title="权限">
          <AuthorityComponent detail={contractDetail} />
        </CoreContent>
      </CoreContent>
      <CoreContent>
        <CoreForm items={itemContract} />
      </CoreContent>
      <CoreContent>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={onSubmit}>保存</Button>
        </div>
      </CoreContent>
    </Form>
  );
};

const mapDispatchToProps = dispatch => ({
  getContractTypeDetail: () => dispatch({
    type: 'sharedContract/fetchContractType',
  }),
  getContractDetail: payload => dispatch({
    type: 'sharedContract/getSharedContractDetail',
    payload,
  }),
  updateForm: payload => dispatch({
    type: 'sharedContract/updateSharedContract',
    payload,
  }),
  resetContractDetail: () => dispatch({
    type: 'sharedContract/resetSharedContractDetail',
    payload: {},
  }),
});

const mapStateToProps = ({
  sharedContract: { contractDetail, contractTypeData },
}) => ({
  contractDetail,
  contractTypeData,
});

export default connect(mapStateToProps, mapDispatchToProps)(ContractForm);
