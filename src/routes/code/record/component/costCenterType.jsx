/**
 * Code/Team审批管理 - 记录明细 - 科目Select
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';

const { Option } = Select;

const CostCenterType = ({
  dispatch,
  value,
  onChange,
  codeCostCenterTypeList = [], // code核算中心
  teamCostCenterTypeList = [], // team核算中心
}) => {
  useEffect(() => {
    dispatch({
      type: 'codeRecord/getCodeCostCenterTypeList',
      payload: {},
    });

    dispatch({
      type: 'codeRecord/getTeamCostCenterTypeList',
      payload: {},
    });

    return () => {
      dispatch({ type: 'codeRecord/resetCodeCostCenterTypeList' });
      dispatch({ type: 'codeRecord/resetTeamCostCenterTypeList' });
    };
  }, [dispatch]);

  let data = [];
  if (Array.isArray(codeCostCenterTypeList) && Array.isArray(teamCostCenterTypeList)) {
    data = [...codeCostCenterTypeList, ...teamCostCenterTypeList];
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="请选择"
      mode="multiple"
      allowClear
      optionFilterProp="children"
      showArrow
    >
      {
        data.map((i) => {
          return (
            <Option
              value={i._id}
              key={i._id}
            >{i.name}</Option>
          );
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  codeRecord: { codeCostCenterTypeList, teamCostCenterTypeList },
}) => {
  return { codeCostCenterTypeList, teamCostCenterTypeList };
};

export default connect(mapStateToProps)(CostCenterType);
