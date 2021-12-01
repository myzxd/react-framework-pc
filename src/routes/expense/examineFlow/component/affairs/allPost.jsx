/**
 * 全量岗位
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const AllPost = ({
  dispatch,
  value,
  onChange,
  staffList = {},
}) => {
  useEffect(() => {
    dispatch({
      type: 'organizationStaff/getStaffList',
      payload: { page: 1, limit: 999 },
    });
  }, [dispatch]);

  const { data = [] } = staffList;

  if (!Array.isArray(data) || data.length < 1) return <Select style={{ width: '70%' }} placeholder="请选择" />;

  return (
    <Select
      value={value}
      placeholder="请选择"
      onChange={onChange}
      style={{ width: '70%' }}
      mode="multiple"
      showArrow
      allowClear
      optionFilterProp="children"
    >
      {
        data.map((i, key) => {
          return <Option value={i._id} key={i._id || key}>{i.name}</Option>;
        })
      }
    </Select>
  );
};

const mapStateToProps = ({ organizationStaff: { staffList } }) => {
  return { staffList };
};

export default connect(mapStateToProps)(AllPost);
