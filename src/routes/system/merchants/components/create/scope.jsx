/**
 * 新增页应用范围组件 WhiteList/Components/Range
 */

import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core/index';

import SelectorAll from './selector';
import styles from '../style/index.less';


// 选中的类型
const selector = {
  platform: 'platform',     // 平台
  supplier: 'supplier',     // 供应商
  city: 'city',             // 城市
  district: 'district',     // 商圈
};

class ApplyRange extends Component {

  constructor() {
    super();
    this.state = {
      platforms: undefined,             // 平台
      suppliers: undefined,             // 供应商
      cities: undefined,                 // 城市
      districts: undefined,             // 商圈
      suppliersAll: false,              // 全部供应商
      citiesAll: false,                 // 全部城市
      districtsAll: false,              // 全部商圈
      supplierInput: 'part',            // 供应商全部选项中默认选中自定义
      cityInput: 'part',                // 城市全部选项中默认选中自定义
      districtInput: 'part',            // 商圈全部选项中默认选中自定义
    };
  }


  // 选择平台、供应商、城市、商圈的回调（选择的类型，值，该类型下是否选中全部，传递city_spell）
  onChange = (type, value, selectorAll = false, spell = []) => {
    const { form, onChangeSelectAll } = this.props;

    // 当onChange的组件类型是平台
    if (type === selector.platform) {
      this.setState({
        platforms: value,
        suppliers: '',
        cities: '',
        districts: '',
        suppliersAll: false,
        citiesAll: false,
        districtsAll: false,
        supplierInput: 'part',
        cityInput: 'part',
        districtInput: 'part',
      });

      // 平台改变，清空供应商、城市、商圈的值
      form.setFieldsValue({ platform: value, supplier: undefined, city: undefined, districtsArray: undefined });
    }

    // 当onChange的组件类型是供应商
    if (type === selector.supplier) {
      this.setState({
        suppliers: value,
        cities: '',
        districts: '',
      });

      // 当供应商左侧选中全选
      if (selectorAll) {
        onChangeSelectAll(1);
        form.setFieldsValue({ supplier: '全部', city: '全部', districtsArray: '全部' });
        this.setState({
          supplierInput: 'all',
          cityInput: 'all',
          districtInput: 'all',
          suppliersAll: true,
          citiesAll: true,
          districtsAll: true,
        });
      } else {
        // 当供应商左侧选中自定义
        onChangeSelectAll(4);
        form.setFieldsValue({ supplier: undefined, city: undefined, districtsArray: undefined });
        this.setState({
          supplierInput: 'part',
          cityInput: 'part',
          districtInput: 'part',
          suppliersAll: false,
          citiesAll: false,
          districtsAll: false,
        });
      }
    }

    // 当onChange的组件类型是城市
    if (type === selector.city) {
      this.setState({
        cities: spell,
        districts: '',
      });

      // 当城市左侧选中全选
      if (selectorAll) {
        onChangeSelectAll(2);
        form.setFieldsValue({ city: '全部', districtsArray: '全部' });
        this.setState({
          cityInput: 'all',
          districtInput: 'all',
          citiesAll: true,
          districtsAll: true,
        });
      } else {
        // 当城市左侧选中自定义
        onChangeSelectAll(4);
        form.setFieldsValue({ city: undefined, districtsArray: undefined });
        this.setState({
          cityInput: 'part',
          districtInput: 'part',
          citiesAll: false,
          districtsAll: false,
        });
      }
    }

    // 当onChange的组件类型是商圈
    if (type === selector.district) {
      this.setState({
        districts: value,
      });

      // 当商圈左侧选中全选
      if (selectorAll) {
        onChangeSelectAll(3);
        form.setFieldsValue({ districtsArray: '全部' });
        this.setState({
          districtInput: 'all',
          districtsAll: true,
        });
      } else {
        // 当商圈左侧选中自定义
        onChangeSelectAll(4);
        form.setFieldsValue({ districtsArray: undefined });
        this.setState({
          districtInput: 'part',
          districtsAll: false,
        });
      }
    }
  }

  render() {
    const { form } = this.props;
    const { platforms, suppliers, cities, suppliersAll, citiesAll, districtsAll, cityInput, districtInput, supplierInput } = this.state;

    const formItems = [
      {
        label: '平台',
        form: form.getFieldDecorator('choice-platform', {
          rules: [{
            required: true,
            message: '请选择平台',
          }],
        })(<SelectorAll selectorType="platform" form={form} onChange={this.onChange} />),
      },
      {
        label: '供应商',
        form: form.getFieldDecorator('choice-supplier', {
          rules: [{
            required: true,
            message: '请选择供应商',
          }],
        })(<SelectorAll selectorType="supplier" platforms={platforms} form={form} supplierInput={supplierInput} suppliersAll={suppliersAll} onChange={this.onChange} />),
      }, {
        label: '城市',
        form: form.getFieldDecorator('choice-city', {
          rules: [{
            required: citiesAll ? false : true,
            message: '请选择城市',
          }],
        })(<SelectorAll
          selectorType="city"
          form={form}
          platforms={platforms}
          suppliers={suppliers}
          suppliersAll={suppliersAll}
          citiesAll={citiesAll}
          onChange={this.onChange}
          cityInput={cityInput}
        />),
      }, {
        label: '商圈',
        form: form.getFieldDecorator('choice-district', {
          rules: [{
            required: districtsAll ? false : true,
            message: '请选择商圈',
          }],
        })(<SelectorAll
          selectorType="district"
          form={form}
          platforms={platforms}
          suppliers={suppliers}
          cities={cities}
          citiesAll={citiesAll}
          suppliersAll={suppliersAll}
          districtsAll={districtsAll}
          onChange={this.onChange}
          districtInput={districtInput}
        />),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 8 } };

    return (
      <CoreContent title="选择应用范围" style={{ backgroundColor: '#FAFAFA' }}>
        <p className={styles['app-comp-white-list-range-tip']}>* 选择 “全部” 表示选择该层级中的全部数据，包括现有数据以及后续增加的数据</p>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }
}
export default Form.create()(ApplyRange);
