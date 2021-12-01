/*
 * 共享登记 - 部门
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';

const Option = Select.Option;

const Department = (props) => {
  const {
    dispatch,
    departmentTree = {},
    onChange,
    value,
    setDepartmentVal,
  } = props;

  useEffect(() => {
    const payload = {
      page: 1,
      limit: 9999,
    };
    dispatch({ type: 'department/getDepartmentTree', payload });
  }, [dispatch]);

  const onChangeDep = (val, option) => {
    // department name
    let departmentName = [];
    if (option && Array.isArray(option)) {
      departmentName = option.map(i => i.name);
    }

    onChange && onChange(val);

    setDepartmentVal && setDepartmentVal(departmentName);
  };

  return (
    <Select
      placeholder="请选择"
      allowClear
      showSearch
      mode="multiple"
      showArrow
      optionFilterProp="children"
      onChange={onChangeDep}
      value={value}
    >
      {
        departmentTree.map((i) => {
          return <Option value={i._id} key={i._id} name={i.name}>{i.name}</Option>;
        })
      }
    </Select>
  );
};

const mapStateToProps = ({ department: { departmentTree } }) => ({ departmentTree });

export default connect(mapStateToProps)(Department);
