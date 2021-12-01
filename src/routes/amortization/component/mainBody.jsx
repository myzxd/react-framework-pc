/**
 * 摊销管理 - 主体select
 */
import _ from 'lodash';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const MainBody = ({
  dispatch,
  mainBodyList = {},
  value,
  onChange,
  ...props
}) => {
  useEffect(() => {
    dispatch({
      type: 'costAmortization/getMainBodyList',
      payload: {},
    });
    return () => {
      dispatch({ type: 'costAmortization/resetMainBodyList' });
    };
  }, [dispatch]);

  // 项目data
  const { data = [] } = mainBodyList;

  // 去重
  const dealData = _.uniqWith(data, (a, b) => (a.name === b.name));

  return (
    <Select
      value={value}
      onChange={onChange}
      dropdownMatchSelectWidth={false}
      {...props}
    >
      {
        dealData.map((i) => {
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
  costAmortization: { mainBodyList },
}) => {
  return { mainBodyList };
};

export default connect(mapStateToProps)(MainBody);
