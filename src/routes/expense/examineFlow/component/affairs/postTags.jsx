/**
 * 岗位标签
 */
import _ from 'lodash';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

const PostTag = ({
  dispatch,
  postTags = {},
  value,
  onChange,
}) => {
  useEffect(() => {
    dispatch({ type: 'organizationStaff/getPostTags' });
  }, [dispatch]);

  const { records = [] } = postTags;

  // 去重处理
  const uniqData = _.uniqWith(records, _.isEqual);

  return (
    <Select
      value={value}
      placeholder="请选择"
      onChange={onChange}
      style={{ width: '70%' }}
      allowClear
      showSearch
      mode="multiple"
      showArrow
    >
      {
        uniqData.map((i, key) => {
          return <Option value={i} key={key}>{i}</Option>;
        })
      }
    </Select>
  );
};

const mapStateToProps = ({ organizationStaff: { postTags } }) => {
  return { postTags };
};

export default connect(mapStateToProps)(PostTag);
