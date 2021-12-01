/**
* 适用部门 - treeSelect
*/
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { TreeSelect } from 'antd';

const DepTreeSelect = ({
  departments = {},
  dispatch,
  value,
  onChange,
  multiple = false,
}) => {
  const { default: dataSource = [] } = departments;

  useEffect(() => {
    if (dataSource && Object.keys(dataSource).length > 0) return;
    dispatch({
      type: 'applicationCommon/fetchDepartments',
    });
  }, [dispatch]);

 // generateTree
  const generateTree = (treeNodes = []) => {
    return treeNodes.map((i) => {
      if (i.node) {
        return {
          title: i.node.name,
          value: i.node._id,
          key: i.node._id,
          children: generateTree(i.leaf),
        };
      }
    });
  };

  // tree data
  const treeData = generateTree(dataSource);

  // tree value必须在treeData有值时才能赋值，否则显示为id串
  const val = treeData.length > 0 ? value : [];

  const tProps = {
    showArrow: true,
    treeData,
    treeDefaultExpandAll: true,
    value: val,
    filterTreeNode: (inputVal, node) => node.title.indexOf(inputVal) > -1,
    onChange,
    showSearch: true,
    allowClear: true,
    multiple,
    placeholder: '请选择',
    style: {
      width: '100%',
    },
  };

  return <TreeSelect {...tProps} />;
};

const mapStateToProps = ({ applicationCommon: { departments } }) => {
  return { departments };
};

export default connect(mapStateToProps)(DepTreeSelect);
