/*
 * 共享登记 - 合同列表 - 查询组件 /Shared/Contract
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import is from 'is_js';

import {
  Form,
  Select,
  Input,
  Popconfirm,
  Button,
  message,
  DatePicker,
} from 'antd';

import {
  SharedContractBorrowState,
  SharedContractMailState,
} from '../../../application/define';
import { CoreContent, CoreSearch } from '../../../components/core';
import SignUnit from '../component/signUnit';
import Operate from '../../../application/define/operate';
import ContractType from '../component/contractType';

const Option = Select.Option;
const { RangePicker } = DatePicker;

Search.propTypes = {
  tabKey: PropTypes.string, // tab key
  tabSearchParmas: PropTypes.object, // 根据tabKey 默认搜索条件
};

function Search({
  onSearch = () => {},
  dispatch,
  tabKey,
  onReset,
  tabSearchParmas,
  setForm,
  form,
  tabKeyState,
}) {
  const onCreateExportTask = async () => {
    const formRes = await form.validateFields();
    dispatch({
      type: 'sharedContract/exportSharedContract',
      payload: {
        params: { ...formRes, ...tabSearchParmas },
        onSuccessCallback: () => message.success('创建下载任务成功'),
        onFailureCallback: () => message.error('导出数据失败'),
      },
    });
  };

  const onHookForm = (hookForm) => {
    setForm(hookForm);
  };

  useEffect(() => {
    if (tabKeyState && is.existy(form) && is.not.empty(form)) {
      form.resetFields();
    }
  }, [form, tabKeyState]);

  const items = [
    <Form.Item
      label="BOSS审批单号"
      name="order_id"
      rules={[
        {
          validator: (_, val) => {
            const reg = /^[0-9a-z]+$/g;
            // 未输入 || 数字、小写字母、长度24位时通过校验
            if (!val || (reg.test(val) && val.length === 24)) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('请输入正确的BOSS审批单号'));
          },
        },
      ]}
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item label="签订单位" name="firm_id">
      <SignUnit />
    </Form.Item>,
    <Form.Item label="合同名称" name="name">
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
  ];
  if (tabKey === 'tab3') {
    items.splice(1, 0, <Form.Item label="作废日期" name="invalid_date">
      <RangePicker allowClear />
    </Form.Item>);
  }
  if (tabKey === 'tab1' || tabKey === 'tab2' || tabKey === 'tab4') {
    items.push(
      <Form.Item label="提报人" name="submit_account">
        <Input placeholder="请输入" allowClear />
      </Form.Item>,
      <Form.Item label="提报日期" name="submit_date">
        <RangePicker allowClear />
      </Form.Item>,
    );
  }
  if (tabKey === 'tab1' || tabKey === 'tab2') {
    items.push(
      <Form.Item label="合同起始日期" name="contract_at_date">
        <RangePicker allowClear />
      </Form.Item>,
      <Form.Item label="合同终止日期" name="contract_end_date">
        <RangePicker allowClear />
      </Form.Item>,
    );
  }
  if (tabKey === 'tab1' || tabKey === 'tab2' || tabKey === 'tab3') {
    items.push(
      <Form.Item label="合同类型" name="pact_type">
        <ContractType placeholder="请选择" />
      </Form.Item>,
      <Form.Item label="转交状态" name="is_deliver">
        <Select placeholder="请选择" allowClear>
          <Option value>已转交</Option>
          <Option value={false}>未转交</Option>
        </Select>
      </Form.Item>,
      <Form.Item label="盖章状态" name="owner_is_signed">
        <Select placeholder="请选择" allowClear>
          <Option value>已盖章</Option>
          <Option value={false}>未盖章</Option>
        </Select>
      </Form.Item>,
      <Form.Item label="邮寄状态" name="mail_state">
        <Select placeholder="请选择" allowClear>
          <Option value={SharedContractMailState.done}>{SharedContractMailState.description(SharedContractMailState.done)}</Option>
          <Option value={SharedContractMailState.notMail}>{SharedContractMailState.description(SharedContractMailState.notMail)}</Option>
        </Select>
      </Form.Item>,
      <Form.Item label="归档状态" name="is_filed">
        <Select placeholder="请选择" allowClear>
          <Option value>已归档</Option>
          <Option value={false}>未归档</Option>
        </Select>
      </Form.Item>,
    );
  }
  if (tabKey === 'tab2') {
    items.push(
      <Form.Item label="借阅状态" name="borrow_state">
        <Select placeholder="请选择" allowClear>
          <Option value={SharedContractBorrowState.already}>{SharedContractBorrowState.description(SharedContractBorrowState.already)}</Option>
          <Option value={SharedContractBorrowState.not}>{SharedContractBorrowState.description(SharedContractBorrowState.not)}</Option>
        </Select>
      </Form.Item>,
    );
  }

  const operations = (
    <span>
      {
        Operate.canOperateSharedContractExport() ? (
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
    onReset,
    onHookForm,
  };

  return (
    <CoreContent>
      <CoreSearch {...searchProps} />
    </CoreContent>
  );
}

export default connect()(Search);
