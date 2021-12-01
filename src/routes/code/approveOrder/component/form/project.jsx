/**
 * Code/Team审批管理 - 付款审批 - 项目Select
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
}) => {
  useEffect(() => {
    dispatch({
      type: 'codeOrder/getProjectList',
      payload: {},
    });
    return () => {
      dispatch({ type: 'codeOrder/resetProjectList' });
    };
  }, [dispatch]);

  // 项目data
  const { data = [] } = projectList;

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="请选择"
      allowClear
      showSearch
      optionFilterProp="children"
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
  codeOrder: { projectList },
}) => {
  return { projectList };
};

export default connect(mapStateToProps)(Project);
