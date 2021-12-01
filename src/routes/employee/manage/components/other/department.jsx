/**
* 部门 - treeSelect
*/
import React from 'react';
import { TreeSelect } from 'antd';

const DepTreeSelect = ({
  value,
  onChange,
  multiple = false,
  departmentTree,
}) => {
  // tree value必须在treeData有值时才能赋值，否则显示为id串
  const val = departmentTree.length > 0 ? value : undefined;

  const tProps = {
    treeData: departmentTree,
    treeDefaultExpandAll: true,
    value: val,
    // filterTreeNode: (inputVal, node) => node.title.indexOf(inputVal) > -1,
    filterTreeNode: (inputVal, node) => (!!(inputVal.trim()
      && node
      && node.title.trim().indexOf(inputVal.trim()) !== -1)),
    onChange,
    showSearch: true,
    allowClear: true,
    multiple,
    placeholder: '请选择',
    dropdownMatchSelectWidth: false,
    style: {
      width: '100%',
    },
  };

  return <TreeSelect {...tProps} />;
};

export default DepTreeSelect;
