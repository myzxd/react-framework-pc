/**
 * Code/Team审批管理 - 付款类型配置管理 - 菜单树结构
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Tree,
  Empty,
} from 'antd';

const TypeMenu = ({
  tabKey,
  onSelect,
  dispatch,
  matterTree = [],
  setMenuSelectedKey,
}) => {
  useEffect(() => {
    dispatch({
      type: 'codeMatter/getMatterTree',
      payload: { type: tabKey },
    });

    return () => {
      dispatch({ type: 'codeMatter/resetMatterTree' });
    };
  }, [dispatch, tabKey]);

  useEffect(() => {
    // 获取默认值，事项树第一项
    if (Array.isArray(matterTree) && matterTree.length > 0) {
      const defaultVal = [dot.get(matterTree, '0._id')];
      setMenuSelectedKey && (setMenuSelectedKey(defaultVal));
    }
  }, [matterTree, setMenuSelectedKey]);

  // 无数据
  if (!Array.isArray(matterTree) || matterTree.length < 1) return <Empty />;

  // generateTree
  const generateTree = (treeNodes = []) => {
    return treeNodes.map((i) => {
      return {
        title: i.name,
        value: i._id,
        key: i._id,
        children: generateTree(i.child_scene_list),
      };
    });
  };

  const treeData = generateTree(matterTree);

  return (
    <Tree
      treeData={treeData}
      defaultExpandAll
      onSelect={onSelect}
      defaultSelectedKeys={[dot.get(matterTree, '0._id')]}
    />
  );
};

const mapStateToProps = ({
  codeMatter: { matterTree },
}) => {
  return { matterTree };
};

export default connect(mapStateToProps)(TypeMenu);
