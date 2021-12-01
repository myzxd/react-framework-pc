/*
 * 共享登记 - 员工档案列表
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
import {
  StaffSate,
  PendingDepartureState,
 } from '../../../application/define';

const Option = Select.Option;

const Custodian = ({
  dispatch,
  employeeList = {},
  onChange,
  value,
  initVal,
  ...props
}) => {
  const { data = [] } = employeeList;

  useEffect(() => {
    const payload = {
      is_auth: true,
      _meta: { page: 1, limit: 9999 },
      state: [StaffSate.inService], // 员工状态（在职）
      pending_departure_state: PendingDepartureState.inService, // 待离职员工状态（在职）
    };
    dispatch({ type: 'sharedBankAccount/getEmployeeList', payload });
    return () => dispatch({ type: 'sharedBankAccount/resetEmployeeList', payload: {} });
  }, [dispatch]);

  let dataSource = [...data];
  const idData = data.map(i => i._id);
  if (Array.isArray(initVal)) {
    const dealData = initVal.filter(i => !idData.includes(i._id)).map((i) => {
      return { ...i, isEmpty: true };
    });
    dataSource = [
      ...data,
      ...dealData,
    ];
  }

  if (initVal && Object.keys(initVal).length > 0 && !Array.isArray(initVal)) {
    dataSource = [
      ...data,
      {
        ...initVal,
        isEmpty: true,
      },
    ];
  }

  return (
    <Select
      placeholder="请选择"
      showSearch
      optionFilterProp="children"
      onChange={onChange}
      value={value}
      {...props}
    >
      {
        dataSource.map((i) => {
          return (
            <Option
              value={i._id}
              key={i._id}
              disabled={i.isEmpty}
            >{i.name}</Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  sharedBankAccount: { employeeList },
}) => ({ employeeList });

export default connect(mapStateToProps)(Custodian);
