/**
* 可见范围 - treeSelect
*/
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { TreeSelect } from 'antd';

const ViewRange = ({
  dispatch,
  value,
  onChange,
  multiple = false,
  depAndPostTree = [],
  isDisabledPost = false, // 是否禁用岗位
}) => {
  useEffect(() => {
    if (depAndPostTree && depAndPostTree.length > 0) return;
    dispatch({
      type: 'applicationCommon/getDepAndPost',
    });
  }, [dispatch]);

 // generateTree
  const generateTree = (treeNodes = []) => {
    return treeNodes.map((i) => {
      if (i.node) {
        const childLeaf = i.leaf ? [...i.leaf] : [];
        const childJob = i.job_list ? [...i.job_list] : [];

        return {
          title: i.node.name,
          value: i.node._id,
          key: i.node._id,
          jobId: i.node.job_id,
          disabled: (isDisabledPost && Boolean(i.node.job_id)),
          children: generateTree([...childJob, ...childLeaf]),
        };
      }
    });
  };

  // tree data
  const treeData = generateTree(depAndPostTree);

  // tree value必须在treeData有值时才能赋值，否则显示为id串
  const val = treeData.length > 0 ? value : [];

  const tProps = {
    treeData,
    value: val,
    onChange,
    filterTreeNode: (inputVal, node) => node.title.indexOf(inputVal) > -1,
    showSearch: true,
    allowClear: true,
    multiple,
    treeDefaultExpandAll: true,
    placeholder: '请选择',
    style: {
      width: '100%',
    },
  };

  return <TreeSelect {...tProps} />;
};

const mapStateToProps = ({ applicationCommon: { depAndPostTree } }) => {
  return { depAndPostTree };
};

export default connect(mapStateToProps)(ViewRange);