/**
 *  商圈管理-搜索组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Input, Form } from 'antd';

import { CoreSearch, CoreContent } from '../../../../components/core';
import { DistrictState } from '../../../../application/define/index';
import { CommonSelectSuppliers, CommonSelectCities, CommonSelectPlatforms } from '../../../../components/common';
import Tags from './components/tag';

import { utils } from '../../../../application';

const { Option } = Select;

class Search extends Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,    // 点击搜索事件
    operations: PropTypes.array.isRequired, // 扩展操作
    onReset: PropTypes.func.isRequired, // 重置
  }

  constructor(props) {
    super(props);
    this.state = {
      form: undefined,  // 搜索的form
      supplier: '',     // 供应商
      platformCode: '',
    };
  }

  // 搜索
  onSearch = (params) => {
    const { onSearch } = this.props;
    // 每次点击搜索重置页码为1
    const newParams = {
      ...params,
      meta: { page: 1, limit: 30 },
    };
    if (onSearch) {
      onSearch(newParams);
    }
  }

  // 获取提交用的form表单
  onHookForm = (form) => {
    this.setState({ form });
  }

  // 重置搜索条件
  onReset = () => {
    const { onReset } = this.props;
    onReset && onReset();
  }

  // 选择平台回调
  onChangePlatformCode = (e) => {
    const { form } = this.state;
    this.setState({
      platformCode: e,
    });
    form.setFieldsValue({
      supplierIds: [],
    });
    form.setFieldsValue({
      cityCodes: [],
    });
  }

  // 选择供应商回调
  onSupplierChange = (e) => {
    const { form } = this.state;
    this.setState({
      supplier: e,
    });
    form.setFieldsValue({
      cityCodes: [],
    });
  }

  // 渲染查询条件
  renderSearch = () => {
    const { operations } = this.props;
    const items = [
      <Form.Item label="平台" name="platformCode">
        <CommonSelectPlatforms
          enableSelectAll
          allowClear
          showSearch
          optionFilterProp="children"
          placeholder="请选择平台"
          onChange={this.onChangePlatformCode}
        />
      </Form.Item>,
      <Form.Item
        noStyle
        key="supplierIds"
        shouldUpdate={(prevValues, curValues) => prevValues.platformCode !== curValues.platformCode}
      >
        {({ getFieldValue }) =>
          <Form.Item label="供应商" name="supplierIds">
            <CommonSelectSuppliers
              enableSelectAll
              allowClear
              showSearch
              showArrow
              mode="multiple"
              optionFilterProp="children"
              placeholder="请选择供应商"
              platforms={getFieldValue('platformCode')}
              namespace={getFieldValue('platformCode')}
              onChange={this.onSupplierChange}
            />
          </Form.Item>
        }
      </Form.Item>,
      <Form.Item
        noStyle
        key="cityCodes"
        shouldUpdate={
          (prevValues, curValues) => (
            prevValues.platformCode !== curValues.platformCode ||
            prevValues.supplierIds !== curValues.supplierIds
          )
        }
      >
        {({ getFieldValue }) =>
          <Form.Item label="城市" name="cityCodes">
            <CommonSelectCities
              enableSelectAll
              allowClear
              showSearch
              showArrow
              mode="multiple"
              optionFilterProp="children"
              placeholder="请选择城市"
              platforms={getFieldValue('platformCode')}
              suppliers={getFieldValue('supplierIds')}
              namespace={getFieldValue('platformCode')}
            />
          </Form.Item>
        }
      </Form.Item>,
      <Form.Item label="商圈名称" name="name">
        <Input placeholder="请输入商圈名称" />
      </Form.Item>,
      <Form.Item label="平台商圈ID" name="customId">
        <Input placeholder="请输入平台商圈ID" />
      </Form.Item>,
      <Form.Item label="状态" name="state">
        <Select allowClear showArrow mode="multiple" placeholder="请选择状态">
          {
            utils.transOptions(DistrictState, Option)
          }
        </Select>
      </Form.Item>,
      <Form.Item label="标签" name="tag">
        <Tags />
      </Form.Item>,
      <Form.Item label="BOSS商圈ID" name="bossId">
        <Input placeholder="请输入BOSS商圈ID" />
      </Form.Item>,
    ];
    const props = {
      items,
      operations,
      expand: true,
      onReset: this.onReset,
      onSearch: this.onSearch,
      onHookForm: this.onHookForm,
    };
    return (
      <CoreContent>
        <CoreSearch {...props} />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染查询条件 */}
        {this.renderSearch()}
      </div>
    );
  }
}

export default Search;
