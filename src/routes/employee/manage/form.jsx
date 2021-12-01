/**
 * 员工档案 - 新建/编辑
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React from 'react';

import EmployeeForm from './components/employee/form/index';
import LaborerForm from './components/laborer/form/index';

const FormWrap = ({
  employeeDetail,
  location,
}) => {
  const fileType = dot.get(location, 'query.fileType');

  const props = {
    employeeDetail, // 详情
    location,
  };

  // 员工档案详情
  if (fileType === 'second') {
    return (
      <LaborerForm
        {...props}
      />
    );
  } else {
    return (
      <EmployeeForm
        {...props}
      />
    );
  }
};

const mapStateToProps = ({
  employeeManage: { employeeDetail },
}) => {
  return { employeeDetail };
};

export default connect(mapStateToProps)(FormWrap);
