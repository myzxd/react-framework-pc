/**
 * 新增页应用范围组件-core  WhiteList/Components/Selector
 */

import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Input } from 'antd';

import {
  CommonSelectCities,
  CommonSelectDistricts,
  CommonSelectPlatforms,
  CommonSelectSuppliers,
} from '../../../components/common/index';
import styles from './style/index.less';


const Option = Select.Option;
const InputGroup = Input.Group;

// 选中的类型
const selector = {
  platform: 'platform',     // 平台
  supplier: 'supplier',     // 供应商
  city: 'city',             // 城市
  district: 'district',     // 商圈
  all: 'all',                // 选中全部
  part: 'part',                // 选中部分
};

class SelectorAll extends Component {
  static propTypes = {
    supplierInput: PropTypes.string, // 供应商左侧下拉框默认选择part
    cityInput: PropTypes.string, // 城市左侧下拉框默认选择part
    districtInput: PropTypes.string, // 商圈左侧下拉框默认选择part
  };

  static defaultProps = {
    supplierInput: selector.part,
    cityInput: selector.part,
    districtInput: selector.part,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectorAll: false,           // 是否选中全部
      selectorValue: '',            // 选中的值
    };
  }

  // 输入框选中的回调
  onChangeSelector = (v, options = []) => {
    const { onChange, selectorType } = this.props;
    let spell = null;
    this.setState({
      selectorValue: v,
    });
    // 当组件类型是城市的时候，转换成city_spell
    if (selectorType === selector.city) {
      spell = options.map(option => dot.get(option, 'props.spell', []));
    }
    if (selectorType === selector.platform) {
      this.setState({
        selectorAll: false,
      });
    }

    onChange(selectorType, v, false, spell);
  }

  // 选中全部或自定义的回调
  onSelectorAll = (value) => {
    const { selectorValue } = this.state;
    const { onChange, selectorType } = this.props;

    // 当选择全部时候
    if (value === selector.all) {
      this.setState({
        selectorAll: true,
      });
      onChange(selectorType, selectorValue, true);
    } else {
      this.setState({
        selectorAll: false,
      });
      onChange(selectorType, selectorValue, false);
    }
  }

  // 渲染平台
  renderPlatform = () => {
    const { namespace } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      getFieldDecorator('platform', { rules: [{ required: true, message: '平台不能为空' }] })(
        <CommonSelectPlatforms namespace={namespace} allowClear showSearch optionFilterProp="children" placeholder="请选择平台" onChange={this.onChangeSelector} />,
      )
    );
  }


  // 渲染供应商
  renderSupplier = () => {
    const { namespace, platforms, suppliersAll, supplierInput } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <InputGroup className={styles['app-comp-white-list-selector-input-group']}>
        <Select value={supplierInput} className={styles['app-comp-white-list-selector']} onChange={this.onSelectorAll}>
          <Option value={selector.all}>全部</Option>
          <Option value={selector.part}>自定义</Option>
        </Select>
        {getFieldDecorator('supplier', { rules: [{ required: true, message: '供应商不能为空' }] })(
          <CommonSelectSuppliers
            disabled={suppliersAll}
            className={styles['app-comp-white-list-selector-supplier-selector']}
            namespace={namespace}
            allowClear
            showSearch
            platforms={platforms}
            optionFilterProp="children"
            placeholder="请选择供应商"
            onChange={this.onChangeSelector}
          />,
        )}
      </InputGroup>
    );
  }

  // 渲染城市
  renderCity = () => {
    const { namespace, platforms, suppliers, suppliersAll, citiesAll, cityInput } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <InputGroup className={styles['app-comp-white-list-selector-input-group']}>
        <Select value={cityInput} className={styles['app-comp-white-list-selector']} disabled={suppliersAll} onChange={this.onSelectorAll}>
          <Option value={selector.all}>全部</Option>
          <Option value={selector.part}>自定义</Option>
        </Select>
        {getFieldDecorator('city', { rules: [{ required: true, message: '城市不能为空' }] })(
          <CommonSelectCities
            namespace={namespace}
            allowClear
            showSearch
            optionFilterProp="children"
            mode="multiple"
            showArrow
            placeholder="请选择城市"
            platforms={platforms}
            suppliers={suppliers}
            onChange={this.onChangeSelector}
            isExpenseModel
            className={styles['app-comp-white-list-selector-supplier-selector']}
            disabled={citiesAll}
          />,
        )}
      </InputGroup>
    );
  }

  // 渲染商圈
  renderDistrict = () => {
    const { namespace, platforms, suppliers, cities, citiesAll, districtsAll, districtInput } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <InputGroup className={styles['app-comp-white-list-selector-input-group']}>
        <Select value={districtInput} className={styles['app-comp-white-list-selector']} disabled={citiesAll} onChange={this.onSelectorAll}>
          <Option value={selector.all}>全部</Option>
          <Option value={selector.part}>自定义</Option>
        </Select>
        {getFieldDecorator('districtsArray', { rules: [{ required: true, message: '商圈不能为空' }] })(
          <CommonSelectDistricts
            className={styles['app-comp-white-list-selector-supplier-selector']}
            namespace={namespace}
            allowClear
            showSearch
            optionFilterProp="children"
            mode="multiple"
            showArrow
            placeholder="请选择商圈"
            platforms={platforms}
            suppliers={suppliers}
            cities={cities}
            onChange={this.onChangeSelector}
            disabled={districtsAll}
          />,
        )}
      </InputGroup>
    );
  }


  render() {
    const { selectorType } = this.props;
    // 平台
    if (selectorType === selector.platform) {
      return this.renderPlatform();
    }
    // 供应商
    if (selectorType === selector.supplier) {
      return this.renderSupplier();
    }
    // 城市
    if (selectorType === selector.city) {
      return this.renderCity();
    }
    // 商圈
    if (selectorType === selector.district) {
      return this.renderDistrict();
    }
  }
}
function mapStateToProps({ applicationCommon }) {
  return { applicationCommon };
}
export default connect(mapStateToProps)(Form.create()(SelectorAll));
