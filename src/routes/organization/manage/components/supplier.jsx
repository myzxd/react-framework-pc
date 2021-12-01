/**
* 组织架构 - 部门管理 - 数据权限范围Tab - 编辑业务信息 - 供应商select
*/
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import { omit } from '../../../../application/utils';
import { utils } from '../../../../application';
import style from './index.less';

const Option = Select.Option;

class Supplier extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'organizationBusiness/getSupplierList', payload: {} });
  }

  onChange = (val) => {
    const { onChange } = this.props;
    onChange && onChange(val);
  }

  render() {
    const { supplierList = {}, value, mode = undefined } = this.props;
    const { supplier_list: data = [] } = supplierList;
    // 去除Antd Select不需要的props
    const omitedProps = omit([
      'dispatch',
      'value',
      'supplierList',
    ], this.props);
    return (
      <Select
        allowClear
        mode={mode}
        placeholder="请选择供应商"
        onChange={this.onChange}
        value={value}
        {...omitedProps}
        className={style['app-organization-update-select']}
      >
        {
          data.map((supplier) => {
            const platformName = utils.dotOptimal(supplier, 'platform_info.platform_name', undefined);
            return (
              <Option key={supplier.supplier_id}>
                {platformName ? `${supplier.supplier_name}（${platformName}）` : supplier.supplier_name}
              </Option>
            );
          })
        }
      </Select>
    );
  }
}

Supplier.propTypes = {
  supplierList: PropTypes.object,
  dispatch: PropTypes.func,
  onChange: PropTypes.func,
};

Supplier.defaultProps = {
  supplierList: {},
  dispatch: () => { },
  onChange: () => { },
};

function mapStateToProps({
  organizationBusiness: {
    supplierList, // 门下岗位编制列表
  },
}) {
  return { supplierList };
}

export default connect(mapStateToProps)(Supplier);
