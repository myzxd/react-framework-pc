/**
 * 费用管理 - 科目设置 - 搜索模块  /Expense/Subject
 */
import React, { Component } from 'react';
import is from 'is_js';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Select, Input, DatePicker } from 'antd';

import CosAttribution from './common/attribution';
import { DeprecatedCoreSearch, CoreContent } from '../../../components/core';
import { OaApplicationFlowTemplateState, OaCostAccountingLevel } from '../../../application/define';


const { Option } = Select;
const { RangePicker } = DatePicker;

class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    onSearch: () => {},
  };

  // 搜索
  onSearch = (values) => {
    const { onSearch } = this.props;
    const { time } = values;
    const params = {
      page: 1,
      limit: 30,
      ...values,
    };
    // 判断是否为空
    if (is.existy(time) && is.not.empty(time)) {
      params.startDate = Number(moment(time[0]).format('YYYYMMDD'));       // 开始创建时间
      params.endDate = Number(moment(time[1]).format('YYYYMMDD'));       // 开始创建时间
    }
    if (onSearch) {
      onSearch(params);
    }
  }

  // 重置
  onReset = () => {
    const { onSearch } = this.props;
    const params = {};
    // 重置搜索
    if (onSearch) {
      onSearch(params);
    }
  }

  // 渲染搜索区域
  render = () => {
    const items = [
      {
        label: '级别',
        form: form => (form.getFieldDecorator('level')(
          <Select
            showArrow
            placeholder="请选择"
            mode="multiple"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            <Option value={`${OaCostAccountingLevel.one}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.one)}</Option>
            <Option value={`${OaCostAccountingLevel.two}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.two)}</Option>
            <Option value={`${OaCostAccountingLevel.three}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.three)}</Option>
            <Option value={`${OaCostAccountingLevel.four}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.four)}</Option>
            <Option value={`${OaCostAccountingLevel.five}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.five)}</Option>
            <Option value={`${OaCostAccountingLevel.six}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.six)}</Option>
            <Option value={`${OaCostAccountingLevel.seven}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.seven)}</Option>
            <Option value={`${OaCostAccountingLevel.eight}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.eight)}</Option>
            <Option value={`${OaCostAccountingLevel.nine}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.nine)}</Option>
            <Option value={`${OaCostAccountingLevel.ten}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.ten)}</Option>
          </Select>,
        )),
      },
      {
        label: '成本归属',
        form: form => (form.getFieldDecorator('costCenterType')(
          <CosAttribution showArrow allowClear showSearch mode="multiple" optionFilterProp="children" placeholder="请选择成本归属" />,
        )),
      },
      {
        label: '状态',
        form: form => (form.getFieldDecorator('state')(
          <Select showArrow placeholder="请选择" mode="multiple" allowClear>
            <Option value={`${OaApplicationFlowTemplateState.normal}`}>{OaApplicationFlowTemplateState.description(OaApplicationFlowTemplateState.normal)}</Option>
            <Option value={`${OaApplicationFlowTemplateState.disable}`}>{OaApplicationFlowTemplateState.description(OaApplicationFlowTemplateState.disable)}</Option>
            <Option value={`${OaApplicationFlowTemplateState.draft}`}>{OaApplicationFlowTemplateState.description(OaApplicationFlowTemplateState.draft)}</Option>
          </Select>,
        )),
      },
      {
        label: '科目编码',
        form: form => (form.getFieldDecorator('coding')(
          <Input type="text" placeholder="请输入科目编码" />,
        )),
      },
      {
        label: '科目名称',
        form: form => (form.getFieldDecorator('name')(
          <Input type="text" placeholder="请输入科目名称" />,
        )),
      },
      {
        label: '创建时间',
        form: form => (form.getFieldDecorator('time', { initialValue: null })(
          <RangePicker />,
        )),
      },
    ];
    const props = {
      items,
      expand: true,
      onReset: this.onReset,
      onSearch: this.onSearch,
    };
    return (
      <CoreContent>
        <DeprecatedCoreSearch {...props} />
      </CoreContent>
    );
  }
}

export default Search;
