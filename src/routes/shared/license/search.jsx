/*
 * 共享登记 - 证照列表 - 查询组件 /Shared/License
 */
import React, { useState } from 'react';
import {
  Form,
  Select,
  Input,
  Popconfirm,
  Button,
  message,
} from 'antd';

import {
  SharedLicenseType,
} from '../../../application/define';
import CompanyList from '../component/companyList';
import Principal from '../component/principal';
import { CoreContent, CoreSearch } from '../../../components/core';
import Operate from '../../../application/define/operate';

const Option = Select.Option;

const Search = ({ onSearch = () => {}, dispatch }) => {
  const [form, setForm] = useState({});
  const onCreateExportTask = async () => {
    const formRes = await form.validateFields();

    dispatch({
      type: 'sharedLicense/exportSharedLicense',
      payload: {
        params: { ...formRes },
        onSuccessCallback: () => message.success('创建下载任务成功'),
        onFailureCallback: () => message.error('导出数据失败'),
      },
    });
  };

  const onHookForm = (hookForm) => {
    setForm(hookForm);
  };

  const onCreate = () => {
    window.location.href = '/#/Shared/License/Create';
  };

  const items = [
    <Form.Item label="公司名称" name="firm_id">
      <CompanyList />
    </Form.Item>,
    <Form.Item label="证照类型" name="cert_type">
      <Select placeholder="请选择" allowClear>
        <Option value={SharedLicenseType.businessLicense}>{SharedLicenseType.description(SharedLicenseType.businessLicense)}</Option>
        <Option value={SharedLicenseType.expressDelivery}>{SharedLicenseType.description(SharedLicenseType.expressDelivery)}</Option>
        <Option value={SharedLicenseType.food}>{SharedLicenseType.description(SharedLicenseType.food)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item label="证照名称" name="name">
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item label="统一社会信用代码" name="credit_no">
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item label="证照负责人" name="keep_account_id">
      <Principal />
    </Form.Item>,
    <Form.Item label="证照ID" name="_id">
      <Input placeholder="请输入" />
    </Form.Item>,
  ];

  const operations = (
    <span>
      {
        Operate.canOperateSharedLicenseCreate() ? (
          <Button type="primary" onClick={onCreate}>创建</Button>
        ) : ''
      }
      {
        Operate.canOperateSharedLicenseExport() ? (
          <Popconfirm
            title="创建下载任务？"
            onConfirm={onCreateExportTask}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary" style={{ marginLeft: 10 }}>导出EXCEL</Button>
          </Popconfirm>
        ) : ''
      }
    </span>
  );

  const searchProps = {
    operations,
    items,
    onSearch,
    onReset: onSearch,
    onHookForm,
  };

  return (
    <CoreContent>
      <CoreSearch {...searchProps} />
    </CoreContent>
  );
};

export default Search;
