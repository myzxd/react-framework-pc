/**
 * 审批流设置 - 审批流编辑 - 适用code
 */
import { connect } from 'dva';
import React from 'react';
import {
  Select,
  TreeSelect,
} from 'antd';

const { SHOW_PARENT } = TreeSelect;

const CodeForm = ({
  value = [],
  onChange,
  flowCodeList = [], // 适用code
}) => {
  // 无数据
  if (!Array.isArray(flowCodeList) || flowCodeList.length < 1) {
    return (
      <Select placeholder="请选择" />
    );
  }

  // 处理数据
  const dealWithData = (data = []) => {
    return data.map((code) => {
      return {
        title: code.name,
        value: `${code._id}=${code.name}`,
        key: `${code._id}=${code.name}`,
        children: dealWithData(code.children),
      };
    });
  };

  // tree data
  const treeData = [
    {
      title: '全部',
      value: '*=全部',
      key: '*=全部',
      children: dealWithData(flowCodeList),
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
  codeFlow: { flowCodeList },
}) => {
  return { flowCodeList };
};

export default connect(mapStateToProps)(CodeForm);
