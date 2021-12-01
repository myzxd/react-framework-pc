/**
 * 人员档案 - tem
*/
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import { utils } from '../../../../../application';

const { Option } = Select;

const Team = ({
  dispatch,
  teamList = [],
  teamType,
  value,
  onChange,
  initValue = {}, // 默认数据
  disabled = false, // select disabled
}) => {
  const initTeamId = initValue.team_id;
// 如果为true 不显示team下的数据 等加载完成以后 在显示 /*接口有延时 误让用户点击
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    if (teamType) {
      setFlag(true);
      dispatch({
        type: 'employeeManage/getTeamList',
        payload: {
          teamType,
          onsetFlagCallback: () => {
            setFlag(false);
          },
        },
      });
      return;
    }
    dispatch({ type: 'employeeManage/reduceTeamList', payload: [] });

    return () => dispatch({ type: 'employeeManage/reduceTeamList', payload: [] });
  }, [dispatch, teamType]);

  let data = [...teamList];
  // team id 列表
  const teamIdList = Array.isArray(teamList) ? teamList.map(t => t._id) : [];

  // team数据中没有默认的team id & 则将默认team信息添加到team list中 & 默认值team类型与前置选择的类型相同
  if (initTeamId
    && !teamIdList.includes(initTeamId)
    && teamType === utils.dotOptimal(initValue, 'biz_meta.cate', undefined)) {
    data = [
      {
        _id: initTeamId,
        name: initValue.name,
        disabled: true,
      },
      ...teamList,
    ];
  }

  if (flag) {
    return <Select disabled />;
  }

  return (
    <Select
      placeholder="请选择team"
      allowClear
      showSearch
      optionFilterProp="children"
      onChange={onChange}
      value={value}
      disabled={disabled}
    >
      {
        data.map(t => (
          <Option
            key={t._id}
            value={t._id}
            disabled={t.disabled}
          >
            {t.name}
          </Option>
        ))
      }
    </Select>
  );
};

const mapStateToProps = ({
  employeeManage: { teamList },
}) => {
  return { teamList };
};
export default connect(mapStateToProps)(Team);
