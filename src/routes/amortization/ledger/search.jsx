/**
 * 台账明细表-搜索
 */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Form, Select, DatePicker } from 'antd';
import { CodeCostCenterType } from '../../../application/define';
import { CoreSearch, CoreContent } from '../../../components/core';
import Scenes from '../component/scenes'; // 场景
import Platform from '../component/platform'; // 平台
import MainBody from '../component/mainBody'; // 主体
import Project from '../component/project'; // 项目
import Subject from '../component/subject'; // 科目名称
import Invoice from '../component/invoice'; // 发票抬头

const { MonthPicker } = DatePicker;
const { Option } = Select;
const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };

Search.propTypes = {
  getDefaultBookMonth: PropTypes.func, // 获取默认记账月份
};

function Search({ onSearch, onReset, getDefaultBookMonth }) {
  // 公共select属性
  const commonSelectProps = {
    placeholder: '请选择',
    allowClear: true,
    mode: 'multiple',
    optionFilterProp: 'children',
    showArrow: true,
  };

  const formItems = [
    <Form.Item
      label="场景"
      name="scenes"
    >
      <Scenes {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="平台"
      name="platform"
    >
      <Platform {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="主体"
      name="mainBody"
    >
      <MainBody {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="项目"
      name="project"
    >
      <Project {...commonSelectProps} />
    </Form.Item>,
    <Form.Item
      label="记账月份"
      name="billMonth"
    >
      <MonthPicker
        allowClear={false}
        placeholder="请选择"
        disabledDate={c => (c && c > getDefaultBookMonth())}
      />
    </Form.Item>,
    <Form.Item
      label="科目类型"
      name="subjectType"
    >
      <Select placeholder="请选择" allowClear>
        <Option value={CodeCostCenterType.team}>{CodeCostCenterType.description(CodeCostCenterType.team)}</Option>
        <Option value={CodeCostCenterType.code}>{CodeCostCenterType.description(CodeCostCenterType.code)}</Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="科目名称"
      name="subjectName"
    >
      <Subject {...commonSelectProps} />
    </Form.Item>,
    {
      key: 'invoice',
      span: 16,
      render: (
        <Form.Item
          label="发票抬头"
          name="invoiceTitle"
          {...formLayout}
        >
          <Invoice
            showArrow
            placeholder="请选择"
            allowClear
            mode="multiple"
            optionFilterProp="children"
            dropdownMatchSelectWidth={false}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <CoreContent className="affairs-flow-basic">
      <CoreSearch
        items={formItems}
        onSearch={onSearch}
        onReset={onReset}
        initialValues={{
          billMonth: moment(getDefaultBookMonth()), // 记账月份
        }}
      />
    </CoreContent>
  );
}

export default Search;
