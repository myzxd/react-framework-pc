/**
 *  付款单列表-搜索组件
 */
import is from 'is_js';
import React, { useState } from 'react';
import { DatePicker, Select, Form } from 'antd';
import moment from 'moment';

import { CoreSearch, CoreContent } from '../../../components/core';
import { EnterprisePaymentState } from '../../../application/define';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Search = (props = {}) => {
  const {
    onSearch = () => {},
    operations,
  } = props;

  // 设置表单
  const [form, setForm] = useState(undefined);
  console.log(form);
  // 搜索
  const onClickSearch = (params) => {
    const { rangePicker } = params;
    // 每次点击搜索重置页码为1
    const newParams = {
      state: params.state,
    };
    // 判断是否为空
    if (is.existy(rangePicker) && is.not.empty(rangePicker)) {
      newParams.start_date = moment(rangePicker[0]).format('YYYYMMDD');
      newParams.end_date = moment(rangePicker[1]).format('YYYYMMDD');
    }
    if (onSearch) {
      onSearch(newParams);
    }
  };

  // 获取提交用的form表单
  const onHookForm = (val) => {
    setForm(val);
  };

  // 重置搜索条件
  const onReset = () => {
    const params = {};
    if (onSearch) {
      onSearch(params);
    }
  };

  // 渲染查询条件
  const renderSearch = () => {
    const items = [
      <Form.Item label="提交日期" name="rangePicker">
        <RangePicker disabledDate={current => current > moment().endOf('day')} />
      </Form.Item>,
      <Form.Item label="状态" name="state">
        <Select placeholder="请选择">
          <Option value={`${EnterprisePaymentState.pendingPayment}`}>{EnterprisePaymentState.description(EnterprisePaymentState.pendingPayment)}</Option>
          <Option value={`${EnterprisePaymentState.alreadyPayment}`}>{EnterprisePaymentState.description(EnterprisePaymentState.alreadyPayment)}</Option>
        </Select>
      </Form.Item>,
    ];
    const params = {
      items,
      operations,
      expand: true,
      onReset,
      onSearch: onClickSearch,
      onHookForm,
      initialValues: { rangePicker: null },
    };
    return (
      <CoreContent>
        <CoreSearch {...params} />
      </CoreContent>
    );
  };
  return (
    <div>
      {/* 渲染查询条件 */}
      {renderSearch()}
    </div>
  );
};

export default Search;
