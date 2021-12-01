/**
 * 岗位select
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const Post = ({
  staffs,
  namespace = 'default',
  departmentId,
  dispatch,
  value,
  onChange,
}) => {
  useEffect(() => {
    // 有部门的情况，调用接口
    if (departmentId) {
      dispatch({
        type: 'applicationCommon/fetchStaffs',
        payload: { namespace, departmentId },
      });
      return;
    }
    // 清楚数据
    dispatch({
      type: 'applicationCommon/resetStaffs',
      payload: { namespace },
    });
  }, [dispatch, departmentId, namespace]);

  const data = dot.get(staffs[namespace], 'data', []);

  return (
    <Select
      placeholder="请选择岗位"
      allowClear
      showSearch
      value={value}
      onChange={onChange}
      optionFilterProp="children"
      dropdownMatchSelectWidth={false}
    >
      {
        data.map((p) => {
          return (
            <Option
              value={p._id}
              key={p._id}
              job_id={p.job_id}
            >
              {dot.get(p, 'job_info.name', '--')}({dot.get(p, 'organization_count', 0)})
            </Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  applicationCommon: { staffs },
}) => {
  return { staffs };
};

export default connect(mapStateToProps)(Post);
