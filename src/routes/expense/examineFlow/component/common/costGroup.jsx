/**
 * 审批流列表页 - 查询组件 - 费用分组
 **/
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const CostGroup = ({
  value,
  onChange,
  dispatch,
  expenseTypes = [], // 费用分组
  ...props
}) => {
  useEffect(() => {
    if (expenseTypes
      && Array.isArray(expenseTypes)
      && expenseTypes.length > 0) return;

    dispatch({
      type: 'applicationCommon/fetchExpenseTypes',
    });
  }, [dispatch]);

  return (
    <Select
      value={Array.isArray(expenseTypes) && expenseTypes.length > 0 ? value : undefined}
      onChange={onChange}
      {...props}
    >
      {
        expenseTypes.map((g, key) => {
          return (
            <Option value={g._id} key={key}>{g.name}</Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  applicationCommon: { expenseTypes },
}) => {
  return { expenseTypes };
};

export default connect(mapStateToProps)(CostGroup);
