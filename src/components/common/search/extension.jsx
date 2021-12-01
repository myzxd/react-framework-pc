/**
 * 扩展搜索功能，添加业务相关的级联查询(供应商，平台，城市，商圈)
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

import { CoreSearch } from '../../core';
import {
  CommonSelectSuppliers, CommonSelectPlatforms,
  CommonSelectCities, CommonSelectDistricts,
} from '../index';

const CommonSearchExtension = ({
  items, specialItems, isExpenseModel, namespace, onSearch, onReset, onHookForm,
  onChange, ...restProps
}) => {
  // 更换平台
  const onChangePlatforms = (getFieldValue, setFieldsValue) => {
    // 清空选项
    setFieldsValue({
      suppliers: undefined, cities: undefined, districts: undefined,
    });

    // 数据变更的回调
    onChange(getFieldValue());
  };

  // 更换供应商
  const onChangeSuppliers = (getFieldsValue, setFieldsValue) => {
    // 清空选项
    setFieldsValue({ cities: undefined, districts: undefined });

    // 数据变更的回调
    onChange(getFieldsValue());
  };


  // 更换城市
  const onChangeCity = (getFieldsValue, setFieldsValue) => {
    // 清空选项
    setFieldsValue({ districts: undefined });

    // 数据变更的回调
    onChange(getFieldsValue());
  };

  // 更换区域
  const onChangeDistrict = (getFieldsValue) => {
    // 数据变更的回调
    onChange(getFieldsValue());
  };

  const formItems = [
    ...specialItems,
    <Form.Item key="platforms" noStyle shouldUpdate={() => false}>
      {({ getFieldsValue, setFieldsValue }) => (
        <Form.Item label="平台" name="platforms">
          <CommonSelectPlatforms
            allowClear
            showSearch
            namespace={namespace}
            optionFilterProp="children"
            mode="multiple"
            showArrow
            placeholder="请选择平台"
            onChange={() => onChangePlatforms(getFieldsValue, setFieldsValue)}
          />
        </Form.Item>
      )}
    </Form.Item>,
    <Form.Item
      noStyle
      key="suppliers"
      shouldUpdate={
        (prevValues, curValues) => {
          return prevValues.platforms !== curValues.platforms;
        }}
    >
      {({ getFieldValue, getFieldsValue, setFieldsValue }) => (
        <Form.Item label="供应商" name="suppliers">
          <CommonSelectSuppliers
            namespace={namespace}
            allowClear
            showSearch
            showArrow
            platforms={getFieldValue('platforms')}
            optionFilterProp="children"
            mode="multiple"
            placeholder="请选择供应商"
            onChange={() => onChangeSuppliers(getFieldsValue, setFieldsValue)}
          />
        </Form.Item>
      )}
    </Form.Item>,
    <Form.Item
      noStyle
      key="cities"
      shouldUpdate={
        (prevValues, curValues) => (
          prevValues.platforms !== curValues.platforms ||
          prevValues.suppliers !== curValues.suppliers
        )
      }
    >
      {({ getFieldValue, getFieldsValue, setFieldsValue }) => (
        <Form.Item label="城市" name="cities">
          <CommonSelectCities
            namespace={namespace}
            allowClear
            showSearch
            showArrow
            optionFilterProp="children"
            mode="multiple"
            placeholder="请选择城市"
            platforms={getFieldValue('platforms')}
            suppliers={getFieldValue('suppliers')}
            onChange={() => onChangeCity(getFieldsValue, setFieldsValue)}
            isExpenseModel={isExpenseModel}
          />
        </Form.Item>
      )}
    </Form.Item>,
    <Form.Item
      noStyle
      key="districts"
      shouldUpdate={
        (prevValues, curValues) => (
          prevValues.platforms !== curValues.platforms ||
          prevValues.suppliers !== curValues.suppliers ||
          prevValues.cities !== curValues.cities
        )
      }
    >
      {({ getFieldValue, getFieldsValue }) => (
        <Form.Item label="商圈" name="districts">
          <CommonSelectDistricts
            allowClear
            showSearch
            namespace={namespace}
            optionFilterProp="children"
            mode="multiple"
            showArrow
            placeholder="请选择商圈"
            platforms={getFieldValue('platforms')}
            suppliers={getFieldValue('suppliers')}
            cities={getFieldValue('cities')}
            onChange={() => onChangeDistrict(getFieldsValue)}
          />
        </Form.Item>
      )}
    </Form.Item>,
    ...items,
  ];

  return (
    <CoreSearch
      items={formItems}
      onReset={onReset}
      onSearch={onSearch}
      onHookForm={onHookForm}
      {...restProps}
    />
  );
};

CommonSearchExtension.propTypes = {
  namespace: PropTypes.string, // 命名空间
  items: PropTypes.array,                         // 详细item
  specialItems: PropTypes.array,  // 特殊查询，需要放置在动态之前
  isExpenseModel: PropTypes.bool,        // 是否为费用模块
  onReset: PropTypes.func,            // 重置的回调
  onSearch: PropTypes.func,         // 搜索的回调（默认回调，添加供应商，平台，城市，商圈查询条件）
  onChange: PropTypes.func,         // 数据的回调（默认回调，添加供应商，平台，城市，商圈查询条件）
  onHookForm: PropTypes.func,   // 绑定form控件
};

CommonSearchExtension.defaultProps = {
  namespace: 'default',
  items: [],
  specialItems: [],
  isExpenseModel: false,
  onReset: () => {},
  onSearch: () => {},
  onChange: () => {},
  onHookForm: () => {},
};


export default CommonSearchExtension;
