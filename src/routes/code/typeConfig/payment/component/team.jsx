/**
 * Code/Team审批管理 - 付款类型配置管理 - team Select
 */
import is from 'is_js';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const Team = ({
  dispatch,
  teamList = {},
  value,
  onChange,
  flowId, // 审批流id
  subject, // 科目ids
  tabKey, // 中心类型
  isInitFlag, // 判断是否是初始状态
  initAllowCodeList,
  initAllowTeamList,
}) => {
  useEffect(() => {
    flowId && dispatch({
      type: 'codeMatter/getTeamList',
      payload: { flowId, subject, tabKey },
    });
    return () => {
      dispatch({ type: 'codeMatter/resetTeamList' });
    };
  }, [dispatch, flowId, subject, tabKey]);

  const { data = [] } = teamList;

  // 获取焦点回调
  const onFocus = () => {
    // 判断是初始的情况&不是全部的情况
    if (isInitFlag && !value.includes('*')) {
      // 获取数据id集合
      const ids = data.map(v => v._id);
      // 过滤数据源不存在的数据
      const fliterValue = value.filter(v => ids.includes(v));
      onChange && onChange(fliterValue);
    }
  };

  // onChange
  const onChangeVal = (val = []) => {
    if (val.includes('*')) {
      onChange && onChange(['*']);
    } else {
      onChange && onChange(val);
    }
  };

  const options = data.map((i) => {
    return (
      <Option
        value={i._id}
        key={i._id}
        disabled={(Array.isArray(value) && value.includes('*'))}
      >{i.name}</Option>
    );
  });
  // 判断是否是初始状态
  if (isInitFlag === true) {
    // 判断code数据是否为空
    if (is.existy(initAllowCodeList) && is.not.empty(initAllowCodeList)) {
      // 获取数据id集合
      const ids = data.map(v => v._id);
      // 判断数据是否包含初始值
      const initCodeList = initAllowCodeList.filter(v => !ids.includes(v._id));
      const initOptions = initCodeList.map((i) => {
        return (
          <Option
            value={i._id}
            key={i._id}
            disabled
          >{i.name}</Option>
        );
      });
      // 添加初始值
      options.push(...initOptions);
    }
    // 判断team数据是否为空
    if (is.existy(initAllowTeamList) && is.not.empty(initAllowTeamList)) {
      // 获取数据id集合
      const ids = data.map(v => v._id);
      // 判断数据是否包含初始值
      const initTeamList = initAllowTeamList.filter(v => !ids.includes(v._id));
      const initOptions = initTeamList.map((i) => {
        return (
          <Option
            value={i._id}
            key={i._id}
            disabled
          >{i.name}</Option>
        );
      });
      // 添加初始值
      options.push(...initOptions);
    }
  }
  return (
    <Select
      value={value}
      onChange={onChangeVal}
      onFocus={onFocus}
      placeholder="请选择"
      mode="multiple"
      allowClear
      showSearch
      showArrow
      optionFilterProp="children"
    >
      {data.length > 0 && <Option value="*" key="*">全部</Option>}
      {options}
    </Select>
  );
};

const mapStateToProps = ({
  codeMatter: { teamList },
}) => {
  return { teamList };
};

export default connect(mapStateToProps)(Team);
