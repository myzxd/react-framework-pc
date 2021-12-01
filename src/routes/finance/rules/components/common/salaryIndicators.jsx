/**
 * 服务费规则 - 模板规则 - 结算指标组件
 */
import is from 'is_js';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Storage from '../../../../../application/library/storage';
import { omit } from '../../../../../application/utils';

const Option = Select.Option;
const OrderTypesCacheTime = 5000;

class ComponentSalaryIndicators extends Component {

  static propTypes = {
    platformCode: PropTypes.string, // 平台code
    tagList: PropTypes.array,       // 步骤
    dataList: PropTypes.array,      // 默认数据
    value: PropTypes.string,        // 指标
  }

  constructor(props) {
    super(props);
    this.private = {
      isUpdateValue: true,
      orderTypeCacheControl: new Storage('aoao.app.cache', { container: 'orderType', useSession: true }),
    };
  }

  // 加载数据
  componentDidMount = () => {
    this.fetchGeneratorOrderTypesWithCache();
    // 改变结算指标单位
    this.onChangeSalaryIndexUnit(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      // 改变结算指标单位
      this.onChangeSalaryIndexUnit(this.props);
    }
  }

  componentWillUnmount() {
    this.private.isUpdateValue = true;
  }

  // 改变结算指标单位
  onChangeSalaryIndexUnit = (props) => {
    const namespace = `${props.platformCode}${props.tagList}`;
    if (this.private.isUpdateValue) {
      // 判断是否有值
      if (
        is.existy(props.value) &&
        is.not.empty(props.value) &&
        props.orderTypes[namespace] !== undefined &&
        is.existy(props.orderTypes[namespace].data) &&
        is.not.empty(props.orderTypes[namespace].data)
      ) {
        this.handleSalaryIndicatorsChange(props.value, props);
        this.private.isUpdateValue = false;
      }
    }
  }

  // 结算指标回调
  onChangeSalaryIndicators = (e) => {
    const { onChange, orderTypes, platformCode, tagList: tags } = this.props;
    const namespace = `${platformCode}${tags}`;
    // 添加非空判断
    if (orderTypes[namespace] === undefined) {
      return;
    }
    const selectedIndicator = orderTypes[namespace].data.filter(item => e === item.id)[0];
    let name = '未匹配';
    let unit = -100;
    let unitText = '';
    if (selectedIndicator !== undefined) {
      unit = selectedIndicator.unit;
      name = selectedIndicator.name;
      unitText = selectedIndicator.unitText;
    }
    if (onChange) {
      onChange(e, unit, name, unitText);
    }
  }

  // 结算指标改变处理函数
  handleSalaryIndicatorsChange = (e, props) => {
    const { onChange, orderTypes, platformCode, tagList: tags } = props;
    const namespace = `${platformCode}${tags}`;
    // 添加非空判断
    if (orderTypes[namespace] === undefined) {
      return;
    }
    const selectedIndicator = orderTypes[namespace].data.filter(item => e === item.id)[0];
    let name = '未匹配';
    let unit = -100;
    let unitText = '';
    if (selectedIndicator !== undefined) {
      unit = selectedIndicator.unit;
      name = selectedIndicator.name;
      unitText = selectedIndicator.unitText;
    }
    if (onChange) {
      onChange(e, unit, name, unitText);
    }
  }

  // 防止多次重复dispatch
  // TODO: 封装成公用方法
  fetchGeneratorOrderTypesWithCache = () => {
    const { dataList } = this.props;
    // 判断是否有默认数据
    if (is.array(dataList)) {
      return;
    }
    const { orderTypes: orderTypesData } = this.props;
    const { orderTypeCacheControl } = this.private;
    // 用两个参数的唯一组合作为namespace,防止数据互相影响
    const { platformCode, tagList: tags } = this.props;
    const namespace = `${platformCode}${tags}`;
    const orderTypes = orderTypeCacheControl.get();

    const dataScoure = orderTypesData[namespace] ? orderTypesData[namespace].data : [];

    /*
     * 不发起请求的条件(当前namespace)
     * 1. 不超过缓存时长 或
     * 2. 当前有数据
     */
    if (!orderTypes[namespace]) {
      orderTypes[namespace] = {
        lastTime: undefined,
      };
      orderTypeCacheControl.set(orderTypes);
    }
    const currentOrderTypes = orderTypes[namespace];
    if (
        (
          currentOrderTypes.lastTime !== undefined &&
          new Date().getTime() - currentOrderTypes.lastTime < OrderTypesCacheTime
        ) ||
        dataScoure.length > 0
    ) {
      return;
    }
    currentOrderTypes.lastTime = new Date().getTime();
    orderTypeCacheControl.set(orderTypes);
    this.fetchGeneratorOrderTypes();
  }

  // 拉取数据
  fetchGeneratorOrderTypes = () => {
    const { platformCode, tagList: tags } = this.props;
    this.props.dispatch({ type: 'financeRulesGenerator/fetchGeneratorOrderTypes', payload: { platformCode, tags } });
  }

  // 渲染结算指标
  renderSalaryIndicators = () => {
    const { value, dataList } = this.props;
    const { orderTypes, platformCode, tagList: tags } = this.props;
    const namespace = `${platformCode}${tags}`;
    let dataScoure = [];
    // 判断是否有默认数据
    if (is.array(dataList)) {
      dataScoure = dataList;
    } else {
      dataScoure = orderTypes[namespace] ? orderTypes[namespace].data : [];
    }
    const options = dataScoure.map((item, index) => {
      return <Option key={index} value={item.id}>{item.name}</Option>;
    });

    // 默认传递所有上级传入的参数
    const props = {
      ...this.props,
      value,
      placeholder: '请选择',
      onChange: this.onChangeSalaryIndicators,
      showSearch: true,
      optionFilterProp: 'children',
      // allowClear: true,
    };

    const omitedProps = omit([
      'dispatch',
      'orderTypes',
      'tagList',
      'platformCode',
      'dataList',
    ], props);

    return (
      <Select {...omitedProps}>
        {options}
      </Select>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染结算指标 */}
        {this.renderSalaryIndicators()}
      </div>
    );
  }

}

function mapStateToProps({ financeRulesGenerator: { orderTypes } }) {
  return { orderTypes };
}

export default connect(mapStateToProps)(ComponentSalaryIndicators);
