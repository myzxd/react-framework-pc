/**
 * 员工档案 - 详情
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React from 'react';

import EmployeeDetail from './components/employee/detail/index';
import LaborerDetail from './components/laborer/detail/index';

const Detail = ({
  employeeDetail,
  location,
}) => {
  const fileType = dot.get(location, 'query.fileType');

  // 员工档案详情
  if (fileType === 'second') {
    return (
      <LaborerDetail
        employeeDetail={employeeDetail}
      />
    );
  } else {
    return (
      <EmployeeDetail
        employeeDetail={employeeDetail}
      />
    );
  }
};

const mapStateToProps = ({
  employeeManage: { employeeDetail },
}) => {
  return { employeeDetail };
};

export default connect(mapStateToProps)(Detail);
