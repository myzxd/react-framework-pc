/**
 * 摊销管理 - 平台select
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const Platform = ({
  dispatch,
  platformList = {},
  value,
  onChange,
  ...props
}) => {
  useEffect(() => {
    dispatch({
      type: 'costAmortization/getPlatformList',
      payload: {},
    });
    return () => {
      dispatch({ type: 'costAmortization/resetPlatformList' });
    };
  }, [dispatch]);

  // 项目data
  const { data = [] } = platformList;

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
  costAmortization: { platformList },
}) => {
  return { platformList };
};

export default connect(mapStateToProps)(Platform);
