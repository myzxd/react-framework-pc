/**
 * 推荐公司管理 - 搜索组件 system/recommendedcompany/search
 */

import React from 'react';
import { Select, Input } from 'antd';
import PropTypes from 'prop-types';

import { DeprecatedCoreSearch, CoreContent } from '../../../components/core';
import { RecommendedCompanyState } from '../../../application/define';

const { Option } = Select;
function Search(props) {
  const { defaultState } = props;
  const items = [
    {
      label: '状态',
      form: form => (form.getFieldDecorator('state', { initialValue: defaultState }))(
        <Select allowClear placeholder="请选择状态">
          <Option value={`${RecommendedCompanyState.on}`} >{RecommendedCompanyState.description(RecommendedCompanyState.on)}</Option>
          <Option value={`${RecommendedCompanyState.off}`} >{RecommendedCompanyState.description(RecommendedCompanyState.off)}</Option>
        </Select>,
      ),
    },
    {
      label: '推荐公司ID',
      form: form => (form.getFieldDecorator('companyId')(
        <Input placeholder="请输入推荐公司ID" />,
      )),
    },
    {
      label: '推荐公司名称',
      form: form => (form.getFieldDecorator('companyName')(
        <Input placeholder="请输入推荐公司名称" />,
      )),
    },
  ];
  const prop = {
    items,
    expand: true,
    // 重置和搜索的回调逻辑一致, 所以都用搜索回调
    onReset: props.onSearch,
    onSearch: props.onSearch,
  };
  return (
    <CoreContent>
      <DeprecatedCoreSearch {...prop} />
    </CoreContent>
  );
}

Search.onSearch = {
  onSearch: PropTypes.func.isRequired, // 搜索回调
};
export default Search;
