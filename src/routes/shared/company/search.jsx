/*
 * 共享登记 - 公司列表 - 查询组件 /Shared/Company
 */
import React, { useState } from 'react';
import dot from 'dot-prop';
import {
  Form,
  Select,
  Input,
  Popconfirm,
  Button,
  message,
} from 'antd';
import { connect } from 'dva';
import {
  SharedCompanyState,
  BusinessCompanyType,
} from '../../../application/define';
import { CoreContent, CoreSearch } from '../../../components/core';
import Operate from '../../../application/define/operate';

const Option = Select.Option;

const Search = ({ onSearch = () => {}, dispatch, companyNature }) => {
  const [form, setForm] = useState({});
  const onCreateExportTask = async () => {
    const formRes = await form.validateFields();

    dispatch({
      type: 'sharedCompany/exportSharedCompany',
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
    window.location.href = '/#/Shared/Company/Create';
  };

  const items = [
    <Form.Item label="公司名称" name="name">
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item label="公司类型" name="firm_nature">
      <Select placeholder="请选择">
        {
          Object.keys(dot.get(companyNature, 'data', {})).map((item) => {
            return (
              <Option key={item} value={item}>{companyNature.data[item]}</Option>
            );
          })
        }
      </Select>
    </Form.Item>,
    <Form.Item label="公司性质" name="firm_type">
      <Select placeholder="请选择" allowClear>
        <Option value={BusinessCompanyType.child}>{BusinessCompanyType.description(BusinessCompanyType.child)}</Option>
        <Option value={BusinessCompanyType.points}>{BusinessCompanyType.description(BusinessCompanyType.points)}</Option>
        <Option value={BusinessCompanyType.joint}>{BusinessCompanyType.description(BusinessCompanyType.joint)}</Option>
        <Option value={BusinessCompanyType.acquisition}>{BusinessCompanyType.description(BusinessCompanyType.acquisition)}</Option>
        <Option value={BusinessCompanyType.other}>{BusinessCompanyType.description(BusinessCompanyType.other)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item label="公司状态" name="state">
      <Select placeholder="请选择" allowClear>
        <Option value={SharedCompanyState.normal}>{SharedCompanyState.description(SharedCompanyState.normal)}</Option>
        <Option value={SharedCompanyState.logout}>{SharedCompanyState.description(SharedCompanyState.logout)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item label="公司ID" name="_id">
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
  ];

  const operations = (
    <span>
      {
        Operate.canOperateSharedCompanyCreate() ?
          (<Button type="primary" onClick={onCreate}>创建</Button>)
          : ''
      }
      {
        Operate.canOperateSharedCompanyExport() ?
          (
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

const mapStateToProps = ({ sharedCompany: { companyNature } }) => ({ companyNature });
export default connect(mapStateToProps)(Search);
