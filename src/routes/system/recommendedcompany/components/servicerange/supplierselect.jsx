/**
 * 推荐公司管理 - 新增推荐公司服务范围供应商下拉选择 system/recomendedcompany/components/servicerange/supplierselect
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import is from 'is_js';
import React from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import { omit } from '../../../../../application/utils';

import { RecommendedCompanyServiceRangeDomain } from '../../../../../application/define';

const Option = Select.Option;

// 命名空间
const namespace = 'recomendedCompany';
// 服务范围供应商选项为全部的value
const SupplierAll = 'supplierall';

class SupplierSelect extends React.Component {

  static propTypes = {
    platform: PropTypes.string, // 平台
    serviceRange: PropTypes.array, // 已有的服务范围
    onChange: PropTypes.func, // 表单字段修改回调
  }

  static defaultProps = {
    platform: '', // 默认为空
    serviceRange: [], // 默认为空
    onChange: () => {}, // 表单字段修改回调
  }

  componentDidMount = () => {
    const { platform } = this.props;
    if (is.not.empty(platform)) {
      // 获取供应商列表
      this.props.dispatch({ type: 'applicationCommon/fetchSuppliers', payload: { namespace, platforms: [platform] } });
    }
  }

  componentDidUpdate = (prevProps) => {
    // 判断参数是否变化，如果参数变化，则重新获取数据
    // 字符串，值比较
    if (this.props.platform !== prevProps.platform) {
      if (this.props.platform === '') {
        // 若平台为空重置数据
        this.props.dispatch({ type: 'applicationCommon/resetSuppliers', payload: { namespace } });
      } else {
        // 若平台不为空, 重新加载数据
        this.props.dispatch({ type: 'applicationCommon/fetchSuppliers', payload: { namespace, platforms: [this.props.platform] } });
      }
    }
  }

  componentWillUnmount = () => {
    // 重置数据
    this.props.dispatch({ type: 'applicationCommon/resetSuppliers', payload: { namespace } });
  }

  // 更新数据的回调
  onChangeSuppliers = (value) => {
    this.props.onChange(value);
  }

  // 渲染选项
  renderOptions = () => {
    const { platform, serviceRange } = this.props;
    // 如果platform为空, 则直接返回null
    if (platform === '') return null;
    // 遍历服务范围, 寻找是否有平台级别的且平台为当前平台
    // 如果有, 那么说明存在“全部”, 过滤掉所有选项
    const hasAll = serviceRange.find(value =>
      (value.domain === RecommendedCompanyServiceRangeDomain.platform) &&
      (value.platform_code === platform)) !== undefined;
    if (hasAll) return null;
    const suppliers = dot.get(this.props, `suppliers.${namespace}`, []);
    // 过滤供应商, 已有的不显示
    const filtedSuppliers = [];
    suppliers.forEach((supplier) => {
      // 已有的是否存在本供应商
      let has = false;
      serviceRange.forEach((range) => {
        // 若已存在,标记has为true
        if (supplier.supplier_id === range.supplier_id) has = true;
      });
      // 若不存在,则添加到过滤后的数组里
      if (has === false) filtedSuppliers.push(supplier);
    });
    const options = filtedSuppliers.map((value) => {
      return (
        <Option value={value.supplier_id} key={value.supplier_id}>{value.supplier_name}</Option>
      );
    });
    // 判断是否有数据，有数据显示全部
    if (filtedSuppliers.length > 0) {
      // 添加全部选项
      options.unshift(<Option value={SupplierAll} key={SupplierAll}>全部</Option>);
    }
    return options;
  }

  render() {
    // 默认传递所有上级传入的参数
    const props = { ...this.props, onChange: this.onChangeSuppliers };

    // 删除无用的props
    const omitedProps = omit(['serviceRange', 'dispatch'], props);

    return (
      <Select {...omitedProps} >
        {/* 渲染选项 */}
        {this.renderOptions()}
      </Select>
    );
  }
}

function mapStateToProps({ applicationCommon: { suppliers } }) {
  return { suppliers };
}

export default connect(mapStateToProps)(SupplierSelect);
