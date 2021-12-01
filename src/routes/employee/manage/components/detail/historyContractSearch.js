/**
  劳动者档案 - 历史合同信息 - 查询
*/
import moment from 'moment';
import React from 'react';
import { Form, DatePicker } from 'antd';

import { CoreSearch } from '../../../../../components/core';

const { RangePicker } = DatePicker;


function HistoryContractInfoSearch(props) {
  // 日期选择范围限制
  const rangePickerDisabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

    // 搜索
  const onSearch = (values) => {
    if (props.onSearch) {
      props.onSearch(values);
    }
  };

  // 重置
  const onReset = () => {
    const params = {};
        // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  };
  // 渲染主体内容
  const renderContent = () => {
    const formItems = [
      <Form.Item label="签约完成时间" name="date">
        <RangePicker
          disabledDate={rangePickerDisabledDate}
        />
      </Form.Item>,
    ];

    return (
      <CoreSearch
        items={formItems}
        onReset={onReset}
        onSearch={onSearch}
      />
    );
  };

  return (
    <React.Fragment>
      {/* 渲染主体内容 */}
      {renderContent()}
    </React.Fragment>
  );
}

export default HistoryContractInfoSearch;
