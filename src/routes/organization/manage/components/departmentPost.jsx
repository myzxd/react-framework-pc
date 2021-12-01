/**
 * 部门下岗位Select
 **/
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Select } from 'antd';

import { utils } from '../../../../application';

const { Option } = Select;

const DepartmentPost = ({
  value,
  onChange,
  dispatch,
  staffList = {}, // 部门下岗位list
  departmentId, // 部门id
  ...props
}) => {
  useEffect(() => {
    dispatch({
      type: 'organizationStaffs/getDepartmentStaffs',
      payload: { departmentId },
    });
  }, [dispatch, departmentId]);

  const { data = [] } = staffList;

  if (!data
    || data.length < 1
    || !departmentId
  ) {
    return <Select placeholder="请选择" {...props} />;
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      {...props}
    >
      {
        data.map((p) => {
          const jobInfo = utils.dotOptimal(p, 'job_info', {});
          return (
            <Option
              value={jobInfo._id}
              key={jobInfo._id}
              info={p}
            >{jobInfo.name}</Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  organizationStaffs: { staffList },
}) => {
  return { staffList };
};

export default connect(mapStateToProps)(DepartmentPost);
