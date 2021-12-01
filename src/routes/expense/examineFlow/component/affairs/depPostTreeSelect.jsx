/**
 * 部门岗位treeSelect
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  TreeSelect,
  Select,
} from 'antd';

const DepAndPostTreeSelect = ({
  value,
  onChange,
  dispatch,
  depAndPostTree = [],
  isDisabledDep, // 禁用部门
  // isJobId, // 是否为岗位id（默认部门岗位关系id）
}) => {
  useEffect(() => {
    if (Array.isArray(depAndPostTree) && depAndPostTree.length > 0) return;
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
          disabled: isDisabledDep ? !i.node.job_id : false,
          children: generateTree([...childJob, ...childLeaf]),
        };
      }
    });
  };

  // 无数据
  if (!Array.isArray(depAndPostTree) || depAndPostTree.length < 1) {
    return <Select placeholder="请选择" />;
  }

  return (
    <TreeSelect
      showSearch
      showArrow
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择"
      allowClear
      multiple
      filterTreeNode={(inputVal, node) => node.title.indexOf(inputVal) > -1}
      treeDefaultExpandAll
      onChange={onChange}
      treeData={generateTree(depAndPostTree)}
    />
  );
};

const mapStateToProps = ({
  applicationCommon: { depAndPostTree },
}) => {
  return { depAndPostTree };
};

export default connect(mapStateToProps)(DepAndPostTreeSelect);

