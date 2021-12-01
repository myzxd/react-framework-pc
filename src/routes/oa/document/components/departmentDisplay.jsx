/**
 * 根据部门id展示部门名称
 */
import React, { useEffect } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';

const DepartmentDisplay = ({ departmentId, dispatch, departmentDetail }) => {
  useEffect(() => {
    // 获取部门详情
    dispatch({
      type: 'department/getDepartmentDetail',
      payload: {
        id: departmentId,
      },
    });
    // 清空部门详情model
    return function resetDepartmentDetail() {
      dispatch({ type: 'department/resetDepartmentDetail', payload: {} });
    };
  }, [departmentId]);
  return (
    <span>{dot.get(departmentDetail, 'name', '--')}</span>
  );
};

DepartmentDisplay.propTypes = {
  departmentId: PropTypes.string,      // 部门id
  departmentDetail: PropTypes.object,  // 部门详情数据
};
DepartmentDisplay.defaultProps = {
  departmentDetail: {},
};

function mapStateToProps({ department: { departmentDetail } }) {
  return { departmentDetail };
}

export default connect(mapStateToProps)(DepartmentDisplay);
