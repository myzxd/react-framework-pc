/**
 * Code/Team审批管理 - 付款类型配置管理 - 审批流Select
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const Flow = ({
  dispatch,
  flowSelectList = {}, // 审批流下拉列表数据
  value,
  onChange,
  type, // 类型（code || team）
}) => {
  useEffect(() => {
    dispatch({
      type: 'codeFlow/getFlowSelectList',
      payload: { page: 1, limit: 9999, type },
    });

    return () => {
      dispatch({ type: 'codeFlow/resetFlowSelectList' });
    };
  }, [dispatch, type]);

  const { data = [] } = flowSelectList;

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
            <Option
              value={i._id}
              key={i._id}
              team={i.team}
            >
              {i.name}
            </Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  codeFlow: { flowSelectList },
}) => {
  return { flowSelectList };
};

export default connect(mapStateToProps)(Flow);
