/**
 * 事务性表单 - 部门（审批流联动）
 */
import is from 'is_js';
import React from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const Option = Select.Option;

const DepartmentFlow = ({
  value,
  setJobForm,
  setDepartmentId,
  onChange,
  accountDep = {},
  disabled,
  examineFlowDepartmentIds = [],
  setRank, // 重置职级
}) => {
  const onChangeVal = (val) => {
    // 重置岗位表单
    setJobForm && (setJobForm());

    // 重置部门id
    setDepartmentId && (setDepartmentId(val));
    onChange && (onChange(val));
    // 重置职级
    setRank && setRank(undefined);
  };

  const { departmentList = [] } = accountDep;
  let data = [];
  // 过滤没有审批流的部门
  if (is.existy(examineFlowDepartmentIds) && is.not.empty(examineFlowDepartmentIds)) {
    data = departmentList.filter(v => examineFlowDepartmentIds.includes(v._id));
  } else {
    data = departmentList;
  }
  // 过滤没有审批流的部门
  return (
    <Select
      value={value}
      onChange={onChangeVal}
      placeholder="请选择"
      disabled={disabled}
    >
      {
        data.map((i, key) => <Option value={i._id} key={i._id || key}>{i.name}</Option>)
      }
    </Select>
  );
};

function mapStateToProp({ oaCommon: { accountDep } }) {
  return { accountDep };
}

export default connect(mapStateToProp)(DepartmentFlow);
