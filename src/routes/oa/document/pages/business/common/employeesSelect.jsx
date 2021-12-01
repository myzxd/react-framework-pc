/**
 * 人员下拉
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Select } from 'antd';

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
    <Select showSearch optionFilterProp="children" {...props}>
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
