/**
 * 平台，供应商，城市，商圈，分摊金额 & 科目三级联动选择 & 成本中心数据显示
 */
import dot from 'dot-prop';
import React from 'react';
import PropTypes from 'prop-types';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber } from 'antd';

import style from './style.css';

import { Unit, DistrictState } from '../../../../../../application/define';
import { DeprecatedCoreForm } from '../../../../../../components/core';
import { CommonSelectSuppliers, CommonSelectPlatforms, CommonSelectCities, CommonSelectDistricts } from '../../../../../../components/common';

// 显示的项目
const CommonItemsType = {
  platformDisable: 'platformDisable',    // 只读模式下的平台
  platform: 'platform',   // 平台
  vendor: 'vendor',       // 供应商
  city: 'city',           // 城市
  district: 'district',   // 商圈
  costCount: 'costCount', // 分单金额
  operatCreate: 'operatCreate', // 添加操作按钮
  operatDelete: 'operatDelete', // 删除操作按钮
};

class CommonItems extends React.Component {
  static propTypes = {
    value: PropTypes.object.isRequired, // 表单值
    onChange: PropTypes.func.isRequired, // 修改回调
    onCreate: PropTypes.func.isRequired, // 点击创建回调
    onDelete: PropTypes.func.isRequired, // 点击删除回调
    disabled: PropTypes.bool, // 是否禁用
  };

  static defaultProps = {
    value: {}, // 表单值
    onChange: () => {}, // 修改回调
    onCreate: () => {}, // 点击创建回调
    onDelete: () => {}, // 点击删除回调
    disabled: false, // 是否禁用
  };

  onChange = (changeValue = {}) => {
    const { value = {}, onChange } = this.props;
    const { key, config = [], cityDisable } = value;
    const {
      platform,
      vendorName,
      vendor,
      city,
      citySpelling,
      district,
      costCount,
      vendorDisable,
      districtDisable,
    } = changeValue;

    // 返回的数据，校验配置，是否需要返回字段
    const values = {
      vendorDisable,
      cityDisable,
      districtDisable,
    };
    // 平台
    if (config.indexOf(CommonItemsType.platform) !== -1 || config.indexOf(CommonItemsType.platformDisable) !== -1) {
      values.platform = platform;
    }
    // 供应商
    if (config.indexOf(CommonItemsType.vendor) !== -1) {
      values.vendor = vendor;
      values.vendorName = vendorName;
    }
    // 城市
    if (config.indexOf(CommonItemsType.city) !== -1) {
      values.city = city;
      values.citySpelling = citySpelling;
    }
    // 商圈
    if (config.indexOf(CommonItemsType.district) !== -1) {
      values.district = district;
    }
    // 分单金额
    if (config.indexOf(CommonItemsType.costCount) !== -1) {
      values.costCount = costCount;
    }
    if (onChange) {
      onChange(key, values);
    }
  }

  // 创建操作的回调
  onCreate = () => {
    const { onCreate } = this.props;
    if (onCreate) {
      onCreate();
    }
  }

  // 删除操作的回调
  onDelete = () => {
    const { onDelete, value = {} } = this.props;
    const { key } = value;
    if (onDelete) {
      onDelete(key);
    }
  }

  // 平台修改回调
  onChangePlatform = (e) => {
    const { value = {} } = this.props;
    const { costCount } = value;
    this.onChange({
      platform: e,
      vendor: undefined,
      city: undefined,
      district: undefined,
      costCount,
      citySpelling: undefined,
    });
  }

  // 服务商修改回调
  onChangeVendor = (e, options) => {
    const { value = {} } = this.props;
    const { platform, costCount } = value;
    const vendorName = options ? options.props ? options.props.children : undefined : undefined;

    this.onChange({
      platform,
      vendor: e,
      city: undefined,
      district: undefined,
      costCount,
      vendorName,
      citySpelling: undefined,
    });
  }

  // 城市修改回调
  onChangeCity = (e, options) => {
    const { value = {} } = this.props;
    const { platform, vendor, costCount, vendorName, vendorDisable } = value;
    const cities = dot.get(options, 'props.spell', []);
    this.onChange({
      platform,
      vendor,
      city: e,
      district: undefined,
      costCount,
      vendorName,
      citySpelling: cities,
      vendorDisable,
    });
  }

  // 商圈修改回调
  onChangeDistrict = (e) => {
    const { value = {} } = this.props;
    const { platform, vendor, city, costCount, vendorName, citySpelling, vendorDisable } = value;
    this.onChange({
      platform,
      vendor,
      vendorName,
      city,
      district: e,
      costCount,
      citySpelling,
      vendorDisable,
    });
  }

  render() {
    const { value = {}, disabled } = this.props;
    const { key, platform, vendor, city, district, costCount, config, citySpelling: cities, vendorDisable, cityDisable, districtDisable } = value;

    const disabledDistrict = disabled === true ? true : districtDisable;
    const disableVendor = disabled === true ? true : vendorDisable;
    const disabledCity = disabled === true ? true : cityDisable;
    const formItems = [];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const isExpenseModel = true;
    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.platform) !== -1) {
      const namespace = `platform-${key}`;
      formItems.push({
        label: '平台',
        form: (
          <CommonSelectPlatforms
            namespace={namespace}
            value={platform}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择平台"
            onChange={this.onChangePlatform}
          />
        ),
      });
    }

    // 只读模式的平台
    if (config.indexOf(CommonItemsType.platformDisable) !== -1) {
      const namespace = `platform-${key}`;
      formItems.push({
        label: '平台',
        form: (
          <CommonSelectPlatforms
            namespace={namespace}
            value={platform}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择平台"
            onChange={this.onChangePlatform}
            disabled
          />
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.vendor) !== -1) {
      const namespace = `supplier-${key}`;
      formItems.push({
        label: '供应商',
        span: 4,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: (
          <CommonSelectSuppliers
            namespace={namespace}
            value={vendor}
            platforms={platform}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择供应商"
            onChange={this.onChangeVendor}
            disabled={disableVendor}
          />
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.city) !== -1) {
      const namespace = `city-${key}`;
      formItems.push({
        label: '城市',
        span: 4,
        form: (
          <CommonSelectCities
            namespace={namespace}
            value={city}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择城市"
            platforms={platform}
            suppliers={vendor}
            onChange={this.onChangeCity}
            isExpenseModel={isExpenseModel}
            disabled={disabledCity}
          />
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.district) !== -1) {
      const namespace = `district-${key}`;
      formItems.push({
        label: '商圈',
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        span: 5,
        form: (
          <CommonSelectDistricts
            className={style['app-comp-expense-house-contract-common-districts']}
            namespace={namespace}
            value={district}
            state={[DistrictState.enable, DistrictState.preparation, DistrictState.waitClose]}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择商圈"
            platforms={platform}
            suppliers={vendor}
            cities={cities}
            onChange={this.onChangeDistrict}
            disabled={disabledDistrict}
          />
        ),
      });
    }

    // 判断设置选项，显示参数
    if (config.indexOf(CommonItemsType.costCount) !== -1) {
      let money = 0;
      if (costCount) {
        money = costCount;
      }
      formItems.push({
        label: '分摊金额(元)',
        span: 3,
        layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
        form: <InputNumber
          min={0}
          value={money}
          step={0.01}
          disabled={disabled}
          formatter={Unit.limitDecimals}
          parser={Unit.limitDecimals}
          onChange={this.onChangeCostCount}
        />,
      });
    }
    // 操作按钮
    if (config.indexOf(CommonItemsType.operatCreate) !== -1 && config.indexOf(CommonItemsType.operatDelete) !== -1 && !disabled) {
      formItems.push({
        span: 3,
        form: (
          <div>
            <Button onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} />
            <Button className="app-global-mgl8" onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} />
          </div>
        ),
      });
    } else if (config.indexOf(CommonItemsType.operatCreate) !== -1 && !disabled) {
      formItems.push({
        span: 3,
        form: (
          <div>
            <Button onClick={this.onCreate} shape="circle" icon={<PlusOutlined />} />
          </div>
        ),
      });
    } else if (config.indexOf(CommonItemsType.operatDelete) !== -1 && !disabled) {
      formItems.push({
        span: 3,
        form: (
          <div>
            <Button onClick={this.onDelete} shape="circle" icon={<MinusOutlined />} />
          </div>
        ),
      });
    }
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={6} layout={layout} className={style['app-comp-expense-house-contract-common']} />
        {/* {prompt} */}
      </div>
    );
  }
}
CommonItems.CommonItemsType = CommonItemsType;
// 上一版 module.exports = CommonItems;
export default CommonItems;
