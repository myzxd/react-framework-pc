/*
 * 共享登记 - 公司列表组件
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';
import PropsType from 'prop-types';

import { Select } from 'antd';

const Option = Select.Option;

Company.propTypes = {
  otherChild: PropsType.object, // 展示其他的child（仅展示不可选择）
};
Company.defaultProps = {
  otherChild: {},
};

function Company(props) {
  const {
    dispatch,
    company = {},
    onChange,
    value,
    otherChild,
  } = props;

  const { data = [] } = company;

  useEffect(() => {
    const payload = {
      _meta: { page: 1, limit: 9999 },
    };

    dispatch({ type: 'sharedCompany/getSharedCompany', payload });
  }, [dispatch]);

  const renderOptions = () => {
    // otherChild不存在 || otherChild在data中存在
    if (!otherChild._id || data.some(item => item._id === otherChild._id)) {
      return data.map((i) => {
        return <Option value={i._id} key={i._id} child={i}>{i.name}</Option>;
      });
    }
    // 渲染data及otherChild数据
    return [...data, otherChild].map((i) => {
      // otherChild中的数据仅展示，不可选中
      if (i._id === otherChild._id) {
        return <Option disabled value={i._id} key={i._id} child={i}>{i.name}</Option>;
      }
      // data中的数据可选中
      return <Option value={i._id} key={i._id} child={i}>{i.name}</Option>;
    });
  };

  return (
    <Select
      placeholder="请选择"
      allowClear
      showSearch
      optionFilterProp="children"
      onChange={onChange}
      value={value}
    >
      {renderOptions()}
    </Select>
  );
}

const mapStateToProps = ({ sharedCompany: { company } }) => ({ company });

export default connect(mapStateToProps)(Company);
