/**
 * 摊销管理 - 项目select
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const Project = ({
  dispatch,
  projectList = {},
  value,
  onChange,
  ...props
}) => {
  useEffect(() => {
    dispatch({
      type: 'costAmortization/getProjectList',
      payload: {},
    });
  }, [dispatch]);

  // 项目data
  const { data = [] } = projectList;

  return (
    <Select
      value={value}
      onChange={onChange}
      dropdownMatchSelectWidth={false}
      {...props}
    >
      {
        data.map((i) => {
          return (
            <Option value={i._id} key={i._id}>
              {i.name}
            </Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  costAmortization: { projectList },
}) => {
  return { projectList };
};

export default connect(mapStateToProps)(Project);
