/**
 *  新增付款单 - 人员组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import dot from 'dot-prop';
import { connect } from 'dva';
import _ from 'lodash';
import is from 'is_js';

import { SigningState } from '../../../application/define';
import styles from './style.less';

const Option = Select.Option;

const ComponentEmployeeList = (props = {}) => {
  const {
  namespace,
  value,
  onChange,
  employees,
  dispatch,
  disabled,
  name,
  } = props;

  const employeesData = dot.get(employees, namespace, {}); // 列表
  const dataSource = employeesData.data || [];

  // 请求接口
  const onFetchEmployees = (val) => {
    const payload = {
      name: val, // 姓名
      state: [SigningState.normal],  // 状态
      page: 1,
      limit: 30,
      namespace, // 命名空间
    };
    dispatch({ type: 'enterprisePayment/fetchEmployees', payload });
  };

  // 模糊查询
  const onSearchSelect = _.debounce((val) => {
    onFetchEmployees(val);
  }, 800);

  // 改变
  const onChangeSelect = (val) => {
    const filterData = dataSource.filter(v => v.staff_info._id === val);
    let identityCardId = '';
    let names = '';
    if (is.existy(filterData) && is.not.empty(filterData)) {
      identityCardId = filterData[0].staff_info.identity_card_id;
      names = filterData[0].staff_info.name;
    }
    if (onChange) {
      onChange({ value: val, identityCardId, name: names });
    }
  };

  if (disabled === true) {
    return (
      <Select
        disabled={disabled}
        value={name}
        showArrow={false}
        placeholder="请输入姓名"
        className={styles.bossEmployeeListNameSelector}
      >
        {dataSource.map(v => <Option key={value} value={v.staff_info.name}>{v.staff_info.name}</Option>)}
      </Select>
    );
  }
  return (
    <Select
      showSearch
      showArrow={false}
      value={value}
      placeholder="请输入姓名"
      filterOption={false}
      onSearch={onSearchSelect}
      onChange={onChangeSelect}
      className={styles.bossEmployeeListNameSelector}
    >
      {dataSource.map(v => <Option key={v.staff_info._id} value={v.staff_info._id}>{v.staff_info.name}</Option>)}
    </Select>
  );
};

// 变量&函数声明
ComponentEmployeeList.propTypes = {
  value: PropTypes.any, // 值
  namespace: PropTypes.string,
  onChange: PropTypes.func,
};

// 默认值
ComponentEmployeeList.defaultProps = {
  namespace: 'default',
  value: '',
  onChange: () => {},
};

function mapStateToProps({ enterprisePayment: { employees } }) {
  return { employees };
}

export default connect(mapStateToProps)(ComponentEmployeeList);
