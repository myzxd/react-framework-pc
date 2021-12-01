/**
 * 审批流列表页 - 查询组件 - 适用范围
 **/
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Select } from 'antd';
import { utils } from '../../../../../application';

const { Option } = Select;

const Platform = ({
  value,
  onChange,
  dispatch,
  platforms = {}, // 费用分组
  ...props
}) => {
  useEffect(() => {
    if (platforms
      && utils.dotOptimal(platforms, 'flow', []).length > 0) return;

    dispatch({
      type: 'applicationCommon/fetchPlatforms',
      payload: { namespace: 'flow' },
    });
  }, [dispatch]);

  return (
    <Select
      value={value}
      onChange={onChange}
      {...props}
    >
      {
        utils.dotOptimal(platforms, 'flow', []).map((p, key) => {
          return (
            <Option value={p.platform_code} key={key}>{p.platform_name}</Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  applicationCommon: { platforms },
}) => {
  return { platforms };
};

export default connect(mapStateToProps)(Platform);
