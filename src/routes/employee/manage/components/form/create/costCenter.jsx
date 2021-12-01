/**
 * 成本信息
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import CostCompoment from '../components/costCompoment';
import CostItem from '../components/costItem';


class CostCenter extends Component {
  static propTypes = {
    employeeDetail: PropTypes.object, // 人员详情
  }
  static defaultProps = {
    employeeDetail: {},
  }

  // 成本中心
  onChangeCostCenter = () => {
    const { form } = this.props;

    // 清空选项
    form.setFieldsValue({
      platformCode: '',
      supplierIds: '',
      cityCodes: '',
    });
  }

  // 渲染表单信息
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const employeeDetail = dot.get(this.props, 'employeeDetail', {});
    const formItems = [
      {
        label: '成本中心',
        key: 'costCenter',
        form: getFieldDecorator('costCenter', {
          initialValue: employeeDetail.cost_center_type ?
          `${dot.get(employeeDetail, 'cost_center_type')}` : undefined,
          rules: [{
            required: true,
            message: '请选择成本中心',
          }],
        })(
          <CostCompoment
            onChange={this.onChangeCostCenter}
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

    // 渲染表单信息
  renderBusiness = () => {
    const { employeeDetail } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const platformList = dot.get(employeeDetail, 'platform_codes', []);
    const supplierList = dot.get(employeeDetail, 'supplier_ids', []);
    const citySpellingList = dot.get(employeeDetail, 'city_spelling_list', []);
    const cityCodes = dot.get(employeeDetail, 'city_codes', []);
    const formItems = [
      {
        label: '',
        key: 'costitem',
        form: getFieldDecorator('costitem')(
          <CostItem
            {...this.props}
            platformList={platformList}
            supplierList={supplierList}
            citySpellingList={citySpellingList}
            cityCodes={cityCodes}
            costCenter={getFieldValue('costCenter')}
          />,
          ),
      },
    ];
    const layout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} layout={layout} />
      </div>
    );
  }

  render() {
    return (
      <CoreContent title="成本信息">
        {/* 渲染成本中心表单 */}
        {this.renderForm()}

        {this.renderBusiness()}
      </CoreContent>
    );
  }
}

export default CostCenter;
