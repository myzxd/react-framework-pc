/**
 * 公用组件，部门树信息
 */
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';

const { TreeNode } = Tree;

class CommonTreeDepartments extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { selectedIds, searchValue = [], expandedKeys } = prevState;
    const {
      namespace = 'organization',
      departments = {},
      onSelect,
      selectedIds: nextSelectedIds = [],
      searchValue: nextSearchValue = [],
      isJump = false,
      flatDepartment = [],
    } = nextProps;

    // 获取父节点
    const getFatherNode = (flatData, selectedId) => {
      // 选中的节点是否存在
      if (!selectedId) return [];

      // 需要return的所有父节点
      const keys = [];

      // 递归的当前id
      let currentId = selectedId;

      // 获取父节点id
      const getKeys = (id) => {
        // 对应的节点信息
        const currentNode = flatData.find(node => node._id === id);

        // 父节点数组更新并设置递归的id为当前节点的pid
        if (is.not.empty(currentNode) && is.existy(currentNode)) {
          (dot.get(currentNode, '_id', undefined)) && (keys[keys.length] = dot.get(currentNode, '_id'));
          currentId = dot.get(currentNode, 'pid', undefined);
          currentId && getKeys(currentId);
        }
      };
      getKeys(selectedId);
      return keys;
    };

    // 初始化selectIds（selectedIds无值，并且部门树有数据时才更新）
    if ((is.empty(selectedIds) || !is.existy(selectedIds))
      && is.not.empty(departments[namespace])) {
      const node = dot.get(departments[namespace], '0.node', {});
      const id = dot.get(node, '_id', undefined);

      // 默认展开的节点
      const initExpandedKeys = id && departments[namespace].map(i => i.node._id);

      // id存在才能更新（会出现[undefined]的情况）
      if (id) {
        onSelect && onSelect([id], dot.get(node, 'name', undefined));
        return { selectedIds: [id], expandedKeys: initExpandedKeys };
      } else {
        return null;
      }
    }

    if (dot.get(selectedIds, '0', undefined) !== dot.get(nextSelectedIds, '0', undefined)) {
      // 外部跳转
      if (isJump) {
        // 更新展开的节点（包括选中节点的所有父级节点）
        const fatherKeys = getFatherNode(flatDepartment, selectedIds[0]);
        return { selectedIds: nextSelectedIds, expandedKeys: [...fatherKeys, ...expandedKeys] };
      }
      return { selectedIds: nextSelectedIds };
    }

    // 更新searchValue
    if (dot.get(searchValue, '0', undefined) !== dot.get(nextSearchValue, '0', undefined)) {
      return { searchValue: nextSearchValue };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      searchValue: [],     // 搜索的数据标题
      selectedIds: [],     // 选中的节点数据
      expandedKeys: [],
    };
  }

  componentDidMount() {
    const payload = {
      isAuthorized: true,
      namespace: 'organization',
    };
    // 获取数据
    this.props.dispatch({ type: 'applicationCommon/fetchDepartments', payload });
  }

  componentWillUnmount = () => {
    const { namespace = 'organization' } = this.props;
    this.props.dispatch({ type: 'applicationCommon/resetDepartments', payload: { namespace } });
  }

  // 选中的节点值
  onSelect = (selected, { node = {} }) => {
    // 判断，如果选择为空，则不进行处理
    if (is.empty(selected)) {
      return;
    }
    const { onSelect } = this.props;
    const selectName = dot.get(node, 'node.name', undefined);
    // 更新传入右侧组件的部门信息
    onSelect && onSelect(selected, selectName);

    this.setState({
      selectedIds: selected,
    });
  }

  // 展开/收起
  onExpand = (keys) => {
    if (Array.isArray(keys) && keys.length === 0) {
      this.setState({ expandedKeys: [] });
    } else {
      this.setState({ expandedKeys: [...keys] });
    }
  }

  // 搜索项目，标题高亮
  isDisplayOnFilter = (value) => {
    const { searchValue } = this.state;

    // 如果为空，或者搜索的值不存在，则默认显示
    if (is.empty(searchValue) || is.not.existy(searchValue)) {
      return true;
    }

    // 默认不显示
    let isDisplay = false;
    // 判断如果搜索的选项在数据中，则显示
    if (value.indexOf(searchValue) > -1) {
      isDisplay = true;
    }
    return isDisplay;
  }

  // 遍历获取，所有节点的keys
  iterativeNodesKeys = (nodes) => {
    // 判断是否有节点信息，有节点信息则渲染
    if (is.empty(nodes) || is.not.existy(nodes) || is.not.array(nodes)) {
      return undefined;
    }
    let keys = [];
    nodes.forEach((item) => {
      const { node, leaf = [] } = item;
      // 获取子节点keys
      keys = keys.concat(this.iterativeNodesKeys(leaf));
      // 获取当前节点key
      keys.push(node._id);
    });
    return keys.filter(item => !item === false);
  }

  // 获取默认展开的key（根部门及其一级部门）
  iterativeDefaultNodesKeys = (nodes) => {
    // 判断是否有节点信息，有节点信息则渲染
    if (is.empty(nodes) || is.not.existy(nodes) || is.not.array(nodes)) {
      return undefined;
    }
    const keys = [];
    nodes.forEach((item) => {
      const { node } = item;
      // 获取当前节点key
      keys[keys.length] = node._id;
    });
    return keys.filter(item => !item === false);
  }

  // 遍历获取，所有节点的keys
  iterativeNodes = (nodes) => {
    // 判断是否有节点信息，有节点信息则渲染
    if (is.empty(nodes) || is.not.existy(nodes) || is.not.array(nodes)) {
      return [];
    }
    return nodes.map((item) => {
      const { node, leaf = [] } = item;

      // 默认的节点数据
      const dataItem = {
        node,

        // 默认不禁用节点选择
        disabled: false,
      };

      // 如果数据被过滤，则不显示
      if (this.isDisplayOnFilter(node.name) === false) {
        dataItem.disabled = true;
      }

      // 如果有子节点数据
      if (is.not.empty(leaf) && is.array(leaf)) {
        dataItem.leaf = this.iterativeNodes(leaf);
      } else {
        dataItem.leaf = [];
      }

      return dataItem;
    }).filter((item) => {
      // 判断，如果子节点为空 && 并且当前节点不可选，则过滤（该过滤功能，主要为了展示私教节点使用）
      if (is.empty(item.leaf) && item.disabled === true) {
        return false;
      }

      // 不过滤节点，直接显示
      return true;
    });
  }

  // 渲染节点信息
  renderNodes = (nodes) => {
    const { searchValue } = this.state;
    // 判断是否有节点信息，有节点信息则渲染
    if (is.empty(nodes) || is.not.existy(nodes) || is.not.array(nodes)) {
      return undefined;
    }

    return nodes.map((item) => {
      const { node, leaf = [] } = item;

      // 搜索项目，标题高亮
      const index = node.name.indexOf(searchValue);
      const beforeStr = node.name.substr(0, index);
      const afterStr = node.name.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}({node.count ? node.count : 0}人)
          </span>
        ) : (
          <span>{node.name}({node.count ? node.count : 0}人)</span>
        );

      // 如果子节点为空，则设置switcherIcon
      if (is.empty(leaf) || is.not.existy(leaf) || is.not.array(leaf)) {
        // 渲染节点
        return (
          <TreeNode title={title} key={`${node._id}`} node={node} switcherIcon={<span style={{ fontSize: '16px', marginLeft: '2px' }}>·</span>} >
            {/* 渲染子节点信息 */}
            {this.renderNodes(leaf)}
          </TreeNode>
        );
      }

      // 渲染节点, 使用默认的switcherIcon
      return (
        <TreeNode title={title} key={`${node._id}`} node={node}>
          {/* 渲染子节点信息 */}
          {this.renderNodes(leaf)}
        </TreeNode>
      );
    });
  }

  render = () => {
    const { selectedIds = [], expandedKeys = [] } = this.state;
    const { departments = {}, namespace = 'organization' } = this.props;

    // 部门数据是否为空
    if (is.empty(departments) || is.empty(departments[namespace])) {
      return <div />;
    }

    const dataSource = departments[namespace];

    const filterDataSource = this.iterativeNodes(dataSource);

    // 如果为空，则不渲染
    if (is.empty(filterDataSource)) {
      return <div />;
    }

    // 不为空时渲染，defaultExpandedKeys有个bug，只有第一次渲染才会展开。
    return (
      <Tree
        onSelect={this.onSelect}
        onExpand={this.onExpand}
        showLine
        showIcon
        selectedKeys={selectedIds}
        expandedKeys={expandedKeys}
      >
        { this.renderNodes(filterDataSource) }
      </Tree>
    );
  }
}

function mapStateToProps({ applicationCommon: { departments, flatDepartment } }) {
  return { departments, flatDepartment };
}

CommonTreeDepartments.protoTypes = {
  namespace: PropTypes.string,
  departments: PropTypes.object,
  flatDepartment: PropTypes.array,
  selectedIds: PropTypes.array,
  searchValue: PropTypes.array,
  isJump: PropTypes.bool,
  onSelect: PropTypes.func,
};

CommonTreeDepartments.defaultProps = {
  namespace: 'organization',
  departments: {},
  flatDepartment: [],
  selectedIds: [],
  searchValue: [],
  isJump: false,
  onSelect: () => {},

};

export default connect(mapStateToProps)(CommonTreeDepartments);
