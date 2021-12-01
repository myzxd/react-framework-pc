/**
 * 成本信息-业务信息
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { ExpenseCostCenterType } from '../../../../../../application/define';
import { DeprecatedCoreForm } from '../../../../../../components/core';
import {
  CommonSelectPlatforms,
  CommonSelectSuppliers,
  CommonSelectCities,
} from '../../../../../../components/common';


class CostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

    // 更换供应商
  onChangeSuppliers = () => {
    const { form } = this.props;

      // 清空选项
    form.setFieldsValue({
      cityCodes: '',
    });
  }

    // 更换平台
  onChangePlatforms = () => {
    const { form } = this.props;
    // 清空选项
    form.setFieldsValue({
      supplierIds: '',
      cityCodes: '',
    });
  }

  // 更改城市
  onChangeCity = (e, options) => {
    const { setFieldsValue } = this.props.form;
    const { code } = options ? options.props : {};
    setFieldsValue({ citys: code });
  }

  renderBusiness = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { platformList, supplierList, citySpellingList, cityCodes } = this.props;
    const { costCenter } = this.props;
    const formItems = [];
    if (costCenter && costCenter <= ExpenseCostCenterType.project) {
      formItems.push(
        {
          label: '平台',
          key: 'platformCode',
          form: getFieldDecorator('platformCode', {
            initialValue: platformList,
            rules: [{
              required: costCenter && costCenter <= ExpenseCostCenterType.project,
              message: '请选择平台',
            }],
          })(
            <CommonSelectPlatforms
              allowClear
              showSearch
              optionFilterProp="children"
              placeholder="请选择平台"
              onChange={this.onChangePlatforms}
            />,
          ),
        },
      );
    }
    if (costCenter && costCenter <= ExpenseCostCenterType.headquarter) {
      formItems.push(
        {
          label: '供应商',
          key: 'supplierIds',
          form: getFieldDecorator('supplierIds', {
            initialValue: supplierList,
            rules: [{
              required: costCenter && costCenter <= ExpenseCostCenterType.headquarter,
              message: '请选择供应商',
            }],
          })(
            <CommonSelectSuppliers
              allowClear
              showSearch
              platforms={getFieldValue('platformCode')}
              optionFilterProp="children"
              placeholder="请选择供应商"
              onChange={this.onChangeSuppliers}
              namespace="costCenter"
            />,
          ),
        },
      );
    }
    if (costCenter && costCenter <= ExpenseCostCenterType.city) {
      formItems.push(
        {
          label: '城市',
          key: 'cityCodes',
          form: getFieldDecorator('cityCodes', {
            initialValue: citySpellingList,
            rules: [{
              required: costCenter && costCenter <= ExpenseCostCenterType.city,
              message: '请选择城市',
            }],
          })(
            <CommonSelectCities
              allowClear
              showSearch
              optionFilterProp="children"
              placeholder="请选择城市"
              platforms={getFieldValue('platformCode')}
              suppliers={getFieldValue('supplierIds')}
              onChange={this.onChangeCity}
            />,
          ),
        },
        {
          label: '',
          key: 'citys',
          form: getFieldDecorator('citys', {
            initialValue: cityCodes,
          })(
            <span />,
          ),
        },
      );
    }
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <Form layout="horizontal">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </Form>
    );
  }

  render() {
    return (
      <div>
        {this.renderBusiness()}
      </div>
    );
  }
}

export default CostItem;
