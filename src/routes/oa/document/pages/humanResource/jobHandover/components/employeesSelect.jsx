/**
 * 人员下拉
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Select } from 'antd';
import { omit } from '../../../../../../../application/utils';

const { Option } = Select;

function EmployeesSelect(props) {
  const { dispatch, employeesSelectInfo } = props;
  useEffect(() => {
    dispatch({
      type: 'business/fetchBusinessEmployeesSelect',
    });
    return () => {
      dispatch({ type: 'business/resetBusinessEmployeesSelect' });
    };
  }, [dispatch]);

  // 获取人员数据
  const options = dot.get(employeesSelectInfo, 'data', []).map((employee) => {
    return <Option value={employee.account_id} key={employee._id}>{employee.name}</Option>;
  });

  return (
    <Select
      {
        ...omit([
          'dispatch',
          'children',
          'employeesSelectInfo',
        ], props)
      }
    >
      {options}
    </Select>
  );
}

function mapStateToProps({ business: { employeesSelectInfo } }) {
  return { employeesSelectInfo };
}
EmployeesSelect.propTypes = {
  employeesSelectInfo: PropTypes.object, // 公司数据
};
EmployeesSelect.defaultProps = {
  employeesSelectInfo: {},
};
export default connect(mapStateToProps)(EmployeesSelect);
