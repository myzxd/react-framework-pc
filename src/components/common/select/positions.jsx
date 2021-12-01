import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';

import { CoreSelect } from '../../core';
import { omit } from '../../../application/utils';

const Option = CoreSelect.Option;

const CommonSelectPositions = (props = {}) => {
  const {
    onlyShowOperable,
    fetchDataSource,                                         // 获取城市数据
    resetDataSource,
    dataSource,
    onChange,
    value = undefined,
  } = props;

  //  请求城市接口
  useEffect(() => {
    fetchDataSource();
    return resetDataSource();
  }, [fetchDataSource, resetDataSource]);

  // 改变
  const onChangeCallback = (e, options) => {
    const groupInfos = options.map(v => v.props.item.code_biz_group_infos);
    // 二维数组转一维
    const infos = _.flattenDeep(groupInfos);
    // 数组对象去重
    const filterInfos = _.uniqBy(infos, '_id');
    if (onChange) {
      onChange(e, filterInfos);
    }
  };

  // 优化数据
  let positionsData = dataSource;
  // 是否只显示可以编辑的职位
  if (onlyShowOperable) {
    positionsData = dataSource.filter(item => item.operable === true);
    // console.log('DEBUG: CommonSelectPositions filter', dataSource);
  }

  // 选项
  const options = positionsData.map((data) => {
    return <Option key={data.gid} item={data} value={`${data.gid}`}>{data.name}</Option>;
  });

  // 默认传递所有上级传入的参数
  let values;
  if (Array.isArray(value)) {
    values = value.map(v => (`${v}`));
  } else if (typeof value === 'number') {
    values = `${value}`;
  } else {
    values = value;
  }
  const params = {
    ...props,
    value: values,
    onChange: onChangeCallback,
  };

  // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'dataSource',
    'onlyShowOperable',
  ], params);

  return (
    <CoreSelect {...omitedProps} >
      {options}
    </CoreSelect>
  );
};

CommonSelectPositions.propTypes = {
  onlyShowOperable: PropTypes.bool, // 是否只显示可以编辑的职位
  dataSource: PropTypes.array,      // 职位数据
  fetchDataSource: PropTypes.func,                                         // 获取城市数据
  resetDataSource: PropTypes.func,
  onChange: PropTypes.func,
};

CommonSelectPositions.defaultProps = {
  onlyShowOperable: false,
  dataSource: [],
  onChange: () => { },
  fetchDataSource: () => { },                                         // 获取城市数据
  resetDataSource: () => { },                                         // 重置城市数据
};

// 引用数据
const mapStateToProps = ({ applicationCommon: { positions } }) => ({ dataSource: positions });

const mapDispatchToProps = dispatch => (
  {
    // 获取列表
    fetchDataSource: () => { dispatch({ type: 'applicationCommon/fetchPositions' }); },
    // 重置列表
    resetDataSource: () => { dispatch({ type: 'applicationCommon/resetPositions' }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CommonSelectPositions);
