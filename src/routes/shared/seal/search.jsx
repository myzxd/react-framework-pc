/*
 * 共享登记 - 印章列表 - 查询组件 /Shared/Seal
 */
import React, { useState, useEffect } from 'react';
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
  SharedSealState,
  SharedSealBorrowState,
} from '../../../application/define';
import { CoreContent, CoreSearch } from '../../../components/core';
import CompanyList from '../component/companyList';
import SealCustodian from '../component/sealCustodian';
import Operate from '../../../application/define/operate';

const Option = Select.Option;

const Search = ({ onSearch = () => {}, dispatch, enumeratedValue = {} }) => {
  const [form, setForm] = useState({});

  // 请求 枚举接口
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


  const onCreateExportTask = async () => {
    const formRes = await form.validateFields();

    dispatch({
      type: 'sharedSeal/exportSharedSeal',
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
    window.location.href = '/#/Shared/Seal/Create';
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
    <Form.Item label="印章名称" name="name">
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item label="公司名称" name="firm_id">
      <CompanyList />
    </Form.Item>,
    <Form.Item label="印章类型" name="seal_type">
      <Select placeholder="请选择" allowClear>{renderSealTypeOptions()}</Select>
    </Form.Item>,
    <Form.Item label="印章状态" name="state">
      <Select placeholder="请选择" allowClear>
        <Option value={SharedSealState.normal}>{SharedSealState.description(SharedSealState.normal)}</Option>
        <Option value={SharedSealState.scrap}>{SharedSealState.description(SharedSealState.scrap)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item label="印章保管人" name="keep_account_id">
      <SealCustodian />
    </Form.Item>,
    <Form.Item label="借用状态" name="borrow_state">
      <Select placeholder="请选择" allowClear>
        <Option value={SharedSealBorrowState.not}>{SharedSealBorrowState.description(SharedSealBorrowState.not)}</Option>
        <Option value={SharedSealBorrowState.already}>{SharedSealBorrowState.description(SharedSealBorrowState.already)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item label="印章ID" name="_id">
      <Input placeholder="请输入" />
    </Form.Item>,
  ];

  const operations = (
    <span>
      {
        Operate.canOperateSharedSealCreate() ? (
          <Button type="primary" onClick={onCreate}>创建</Button>
        ) : ''
      }
      {
        Operate.canOperateSharedSealExport() ? (
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

const mapStateToProps = ({
  codeRecord: { enumeratedValue },
}) => {
  return { enumeratedValue };
};

export default connect(mapStateToProps)(Search);
