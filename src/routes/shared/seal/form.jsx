/**
 * 共享登记 - 印章表单
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  message,
} from 'antd';
import { connect } from 'dva';

import { CoreForm, CoreContent } from '../../../components/core';
import { PageUpload } from '../../oa/document/components/index';
import Company from '../component/company';
// import SealCustodian from '../component/sealCustodian';
import AuthorityComponent from '../component/authorityComponent';
import { utils } from '../../../application';
import {
  AdministrationSealType,
  SharedSealState,
  SharedSealBorrowState,
  SharedAuthorityState,
} from '../../../application/define';
import { CommonSelectDepartmentEmployees } from '../../../components/common';

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

const SealForm = ({
  createSharedSeal,
  updateSharedSeal,
  sealDetail = {},
  location = {},
  getSealDetail,
  resetSealDetail,
  isUpdate = false,
  getEnumer,
  resetEnumer,
  enumeratedValue = {},
}) => {
  const [form] = Form.useForm();
  const { query = {} } = location;
  // 印章类型
  const [sealType, setSealType] = useState(undefined);

  // 请求枚举列表接口
  useEffect(() => {
    getEnumer();
    return () => {
      resetEnumer();
    };
  }, []);

  useEffect(() => {
    query.id && getSealDetail({ id: query.id });
    return () => resetSealDetail();
  }, [getSealDetail, resetSealDetail, query.id]);

  useEffect(() => {
    // 编辑印章时，设置印章类型
    if (isUpdate && sealDetail && Object.keys(sealDetail).length > 0) {
      setSealType(dot.get(sealDetail, 'seal_type', undefined));
    }
  }, [sealDetail, isUpdate]);

  // 无数据
  if (isUpdate && (!sealDetail || Object.keys(sealDetail).length <= 0)) return <div />;

  const {
    state,
    borrow_state: borrowState = undefined,
    expected_return_date: expectedReturnDate = undefined,
  } = sealDetail;

  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const { lookAccountInfo } = formRes;
    if (lookAccountInfo.state === SharedAuthorityState.section
      && lookAccountInfo.accountInfo.length === 0
      && lookAccountInfo.departmentInfo.length === 0) {
      return message.error('请选择指定范围');
    }
    const res = isUpdate ?
      await updateSharedSeal({ ...formRes, _id: query.id })
      : await createSharedSeal({ ...formRes });

    if (res && res._id) {
      message.success('请求成功');
      window.location.href = '/#/Shared/Seal';
    }
  };

  // 印章类型onChange
  const onChangeSealType = (val) => {
    setSealType(val);

    // 重置其他章类型的other_seal
    form.setFieldsValue({ other_seal: undefined });
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

  const items = [
    <Form.Item
      name="name"
      label="印章名称"
      rules={[{ required: true, message: '请填写印章名称' }]}
    >
      <Input placeholder="请输入" />
    </Form.Item>,
    <Form.Item
      name="firm_id"
      label="公司名称"
      rules={[{ required: true, message: '请选择公司' }]}
    >
      <Company
        otherChild={utils.dotOptimal(sealDetail, 'firm_info', {})}
      />
    </Form.Item>,
    <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 20 }}>
      <Form.Item
        label="印章类型"
        name="seal_type"
        rules={[{ required: true, message: '请选择印章类型' }]}
        style={
          sealType !== AdministrationSealType.other ?
            { width: '100%' } : { width: '50%' }
        }
      >
        <Select placeholder="请选择" onChange={onChangeSealType}>
          {renderSealTypeOptions()}
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
    </div>,
    <Form.Item
      name="keep_account_id"
      label="印章保管人"
      rules={[{ required: true, message: '请选择印章保管人' }]}
    >
      <CommonSelectDepartmentEmployees
        placeholder="请选择"
        showSearch
        optionFilterProp="children"
        fareManagerInfo={utils.dotOptimal(sealDetail, 'keep_account_info', {})}
      />
    </Form.Item>,
  ];

  const itemsOne = [
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

  const itemOrder = [
    <Form.Item
      label="印章状态"
    >
      {state ? SharedSealState.description(state) : '--'}
    </Form.Item>,
    <Form.Item
      label="借用状态"
    >
      {borrowState ? SharedSealBorrowState.description(borrowState) : '--'}
    </Form.Item>,
    <Form.Item
      label="借用人"
    >
      {dot.get(sealDetail, 'borrower_info.name', '--')}
    </Form.Item>,
    <Form.Item
      label="预计归还时间"
    >
      {expectedReturnDate ? moment(String(expectedReturnDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
  ];

  const initialValues = {
    name: dot.get(sealDetail, 'name', undefined),
    firm_id: dot.get(sealDetail, 'firm_info._id', undefined),
    seal_type: dot.get(sealDetail, 'seal_type', undefined),
    keep_account_id: dot.get(sealDetail, 'keep_account_info._id', undefined),
    note: dot.get(sealDetail, 'note', undefined),
    state: dot.get(sealDetail, 'state', undefined),
    borrow_state: dot.get(sealDetail, 'borrow_state', undefined),
    asset_keys: PageUpload.getInitialValue(sealDetail, 'asset_infos', {}),
    other_seal: dot.get(sealDetail, 'other_seal', undefined),
    lookAccountInfo: {
      state: dot.get(sealDetail, 'look_acl', SharedAuthorityState.section),
      accountInfo: dot.get(sealDetail, 'look_account_info_list', []).map(item => ({ id: item._id, name: item.name })),
      departmentInfo: dot.get(sealDetail, 'look_department_info_list', []).map(item => ({ id: item._id, name: item.name })),
    },
  };

  return (
    <Form {...FormLayoutC3} form={form} initialValues={initialValues} >
      <CoreContent>
        <CoreForm items={items} />
        <CoreForm items={itemsOne} cols={1} />
        {isUpdate ? <CoreForm items={itemOrder} /> : ''}
        <CoreContent title="权限">
          <AuthorityComponent detail={sealDetail} />
        </CoreContent>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={onSubmit}>保存</Button>
        </div>
      </CoreContent>
    </Form>
  );
};

const mapDispatchToProps = dispatch => ({
  getSealDetail: payload => dispatch({
    type: 'sharedSeal/getSharedSealDetail',
    payload,
  }),
  resetSealDetail: () => dispatch({
    type: 'sharedSeal/resetSharedSealDetail',
    payload: {},
  }),
  updateSharedSeal: payload => dispatch({
    type: 'sharedSeal/updateSharedSeal',
    payload,
  }),
  createSharedSeal: payload => dispatch({
    type: 'sharedSeal/createSharedSeal',
    payload,
  }),
  getEnumer: () => dispatch({
    type: 'codeRecord/getEnumeratedValue',
    payload: {},
  }),
  resetEnumer: () => dispatch({
    type: 'codeRecord/resetEnumerateValue',
    payload: {},
  }),
});

const mapStateToProps = ({ codeRecord: { enumeratedValue }, sharedSeal: { sealDetail } }) => ({ enumeratedValue, sealDetail });
export default connect(mapStateToProps, mapDispatchToProps)(SealForm);

