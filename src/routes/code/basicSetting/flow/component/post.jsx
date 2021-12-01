/**
 * 岗位
 */
import dot from 'dot-prop';
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
  initValue = {},
}) => {
  const { data: originData = [] } = staffList;
  useEffect(() => {
    if (departmentId) {
      dispatch({
        type: 'organizationStaffs/getDepartmentStaffs',
        payload: { departmentId, limit: 999, page: 1 },
      });
    }

    return () => dispatch({
      type: 'organizationStaffs/resetDepartmentStaffs',
      payload: {},
    });
  }, [dispatch, departmentId]);

  if (Object.keys(staffList).length < 1) return <Select placeholder="请选择" />;

  let data = [...originData];
  // 存在删除的数据
  if (initValue
    && Object.keys(initValue).length > 0
    && !originData.find(i => i._id === initValue._id)
    && dot.get(initValue, 'department_info._id') === departmentId
    && Object.keys(staffList).length > 0
  ) {
    data = [
      ...originData,
      {
        ...initValue,
        isDisabled: true,
        job_info: {
          ...initValue.job_info,
          name: `${dot.get(initValue, 'job_info.name')}（已删除）`,
        },
      },
    ];
  }

  return (
    <Select
      value={value}
      placeholder="请选择"
      onChange={onChange}
      disabled={disabled}
      allowClear
      showSearch
      dropdownMatchSelectWidth={false}
      style={{ width: '100%' }}
    >
      {
        data.map((i) => {
          const { job_info: info } = i;
          if (Object.keys(info).length > 0) {
            return (
              <Option
                value={i._id}
                key={info._id}
                disabled={i.isDisabled}
              >{info.name}</Option>
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
