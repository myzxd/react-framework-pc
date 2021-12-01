/**
 * 业务范围信息（创建）
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { FileType } from '../../../../../../application/define';
import CommonSelectPlatforms from '../components/platforms';
import {
  CommonSelectSuppliers,
  CommonSelectCities,
  CommonSelectDistricts,
} from '../../../../../../components/common';

import style from './style.css';

const noop = () => {};

class BusinessInfo extends Component {
  static propTypes = {
    onChangePlatform: PropTypes.func.isRequired, // 更改平台
    onChangeSupplier: PropTypes.func.isRequired, // 更改供应商
    onChangeCity: PropTypes.func.isRequired, // 更改城市
    fileType: PropTypes.string,                  // 档案类型
    industryType: PropTypes.string,              // 所属场景
  }

  static defaultProps = {
    onChangePlatform: noop,
    onChangeSupplier: noop,
    onChangeCity: noop,
    fileType: '',
    industryType: '',
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 选择平台事件
  onChangePlatformCode = (e) => {
    const { onChangePlatform } = this.props;
    const { resetFields } = this.props.form;
    // 重置供应商、城市、商圈、合同甲方表单数据
    resetFields(['supplierIds', 'cityCodes', 'districts']);
    onChangePlatform(e);
  }

  // 选择供应商事件
  onChangeSupplier = (e) => {
    const { onChangeSupplier } = this.props;
    const { resetFields } = this.props.form;
    // 重置城市、商圈、合同甲方、推荐公司表单数据
    resetFields(['cityCodes', 'districts']);
    onChangeSupplier(e);
  }

  // 选择城市事件
  onChangeCity = (e, options) => {
    const { onChangeCity } = this.props;
    const { resetFields } = this.props.form;
    // 重置商圈表单数据
    resetFields(['districts']);
    // 取city_code, e为city_spelling
    const { code } = options ? options.props : {};
    // setFieldsValue({ citys: code });
    onChangeCity(code);
  }

  // 渲染表单信息
  renderForm = () => {
    const { fileType, industryType } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    // 平台
    const platformCode = getFieldValue('platformCode') || '';
    // 供应商
    const supplierIds = getFieldValue('supplierIds') || '';
    // 城市
    const cityCodes = getFieldValue('cityCodes') || '';
    const formItems = [
      {
        label: '平台',
        form: getFieldDecorator('platformCode', {
          rules: [{ required: true, message: '请选择平台' }],
        })(
          <CommonSelectPlatforms
            placeholder="请选择平台"
            industryCodes={industryType}
            onChange={this.onChangePlatformCode}
          />,
          ),
      }, {
        label: '主体',
        form: getFieldDecorator('supplierIds', {
          rules: [{ required: true, message: '请选择主体' }],
        })(
          <CommonSelectSuppliers
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择主体"
            platforms={platformCode}
            namespace={platformCode}
            onChange={this.onChangeSupplier}
          />,
          ),
      }, {
        label: '城市',
        form: getFieldDecorator('cityCodes', {
          rules: [{ required: true, message: '请选择城市' }],
        })(
          <CommonSelectCities
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择城市"
            suppliers={supplierIds}
            platforms={platformCode}
            namespace={platformCode}
            onChange={this.onChangeCity}
          />,
          ),
      }, {
        label: '商圈',
        form: getFieldDecorator('districts', {
          rules: [{ required: true, message: '请选择商圈' }],
        })(
          <CommonSelectDistricts
            className={style['app-comp-employee-manage-form-create-business-districts']}
            allowClear
            mode={(`${fileType}` === `${FileType.second}` || `${fileType}` === `${FileType.first}`) ? 'multiple' : ''}
            placeholder="请选择商圈"
            optionFilterProp="children"
            namespace={platformCode}
            platforms={platformCode}
            suppliers={supplierIds}
            cities={cityCodes}
          />,
          ),
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <Form layout="horizontal">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </Form>
    );
  }

  render() {
    const { fileType } = this.props;
    // 档案类型为人员档案时不显示业务范围
    return (
      `${fileType}` === `${FileType.staff}`
      || <CoreContent title="业务范围">
          {/* 渲染表单信息 */}
          {this.renderForm()}
        </CoreContent>
    );
  }
}

export default BusinessInfo;
