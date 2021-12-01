/**
 * 岗位标签
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const Post = ({
  dispatch,
  staffList = {},
  value,
  onChange,
  departmentId,
  disabled = false,
}) => {
  const { data = [] } = staffList;
  useEffect(() => {
    if (departmentId) {
      dispatch({
        type: 'organizationStaffs/getDepartmentStaffs',
        payload: { departmentId, limit: 999, page: 1 },
      });
      return () => {
        dispatch({
          type: 'organizationStaffs/reduceDepartmentStaffs',
          payload: {},
        });
      };
    }
  }, [dispatch, departmentId]);

  return (
    <Select
      value={value}
      placeholder="请选择"
      onChange={onChange}
      disabled={disabled}
      allowClear
      showSearch
      optionFilterProp="children"
      dropdownMatchSelectWidth={false}
      style={{ width: '100%' }}
    >
      {
        data.map((i) => {
          const { job_info: info } = i;
          if (Object.keys(info).length > 0) {
            return (
              <Option value={info._id} key={info._id}>{info.name}</Option>
            );
          }
        })
      }
    </Select>
  );
};

const mapStateToProps = ({ organizationStaffs: { staffList } }) => {
  return { staffList };
};

export default connect(mapStateToProps)(Post);
