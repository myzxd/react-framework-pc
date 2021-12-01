/**
 * 摊销管理 - 场景select
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const Scenes = ({
  dispatch,
  scenesList = {}, // 场景列表
  value,
  onChange,
  ...props
}) => {
  useEffect(() => {
    dispatch({
      type: 'costAmortization/getScenesList',
      payload: {},
    });
    return () => {
      dispatch({ type: 'costAmortization/resetScenesList' });
    };
  }, [dispatch]);

  // 项目data
  const { data = [] } = scenesList;

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
  costAmortization: { scenesList },
}) => {
  return { scenesList };
};

export default connect(mapStateToProps)(Scenes);
