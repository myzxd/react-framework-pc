/**
 * 审批流职级
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const Option = Select.Option;

const Rank = (props) => {
  const { dispatch, staffList = {}, value = [], onChange } = props;
  const [disabled, setDisabled] = useState(false);
  const [rankVal, setRankVal] = useState(value);

  useEffect(() => {
    dispatch({
      type: 'organizationStaff/getStaffList',
      payload: { page: 1, limit: 9999 },
    });
    return () => {
      dispatch({
        type: 'organizationStaff/resetStaffList',
      });
    };
  }, [dispatch]);

  // 岗位列表
  const { data = [] } = staffList;

  // 过滤
  const rankList = data.map((i) => {
    if (i.rank) {
      return i.rank;
    }
  });

  // 去重
  const setRank = [...new Set(rankList)];

  const onRankChange = (val) => {
    !val && (setDisabled(false) && onChange(val) && setRankVal(val));
    const isAll = val.find(e => e === 'all');
    if (isAll) {
      setDisabled(true);
      onChange(['all']);
      setRankVal(['all']);
    } else {
      setDisabled(false);
      onChange(val);
      setRankVal(val);
    }
  };

  return (
    <Select
      placeholder="请选择职级"
      mode="multiple"
      showArrow
      value={rankVal}
      onChange={onRankChange}
      showSearch
      allowClear
      optionFilterProp="children"
    >
      <Option value="all">不限</Option>
      {
        setRank.map((item, key) => {
          return <Option key={`${key}${item}`} value={item} disabled={disabled}>{item}</Option>;
        })
      }
    </Select>
  );
};

const mapStateToProps = ({ organizationStaff: { staffList } }) => ({ staffList });

export default connect(mapStateToProps)(Rank);
