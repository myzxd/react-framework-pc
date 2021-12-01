/**
 * 审批流设置 - 审批流编辑 - 适用team
 */
import { connect } from 'dva';
import React from 'react';
import {
  TreeSelect,
  Select,
} from 'antd';

const { SHOW_PARENT } = TreeSelect;

const TeamForm = ({
  value = [],
  onChange,
  flowTeamList = [], // 适用team
}) => {
  // 无数据
  if (!Array.isArray(flowTeamList) || flowTeamList.length < 1) {
    return (
      <Select placeholder="请选择" />
    );
  }

  // 处理数据
  const dealWithData = (data = []) => {
    return data.map((team) => {
      return {
        title: team.name,
        value: `${team._id}=${team.name}`,
        key: `${team._id}=${team.name}`,
        children: dealWithData(team.children),
      };
    });
  };

  // tree data
  const treeData = [
    {
      title: '全部',
      value: '*=全部',
      key: '*=全部',
      children: dealWithData(flowTeamList),
    },
  ];

  const tProps = {
    treeData,
    value,
    onChange,
    allowClear: true,
    treeCheckable: true,
    treeDefaultExpandAll: true,
    placeholder: '请选择',
    showCheckedStrategy: SHOW_PARENT,
    style: {
      width: '100%',
    },
  };

  return <TreeSelect {...tProps} />;
};

const mapStateToProps = ({
  codeFlow: { flowTeamList },
}) => {
  return { flowTeamList };
};

export default connect(mapStateToProps)(TeamForm);
