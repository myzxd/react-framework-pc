/**
 * 公用组件，用户信息
 * 未使用
 */
import is from 'is_js';
import dot from 'dot-prop';
import { Tree } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';

const { TreeNode } = Tree;

// 默认树结构展开的层级，目前默认展开第一级， 0 为全部展开
const DefaultExpandLevel = 1;

class CommonTreeDepartments extends Component {

  // 根据子节点，向上遍历，获取父级别所有节点的方法
  static fetchNodesKeysByLeaf = (dataSource, leafId) => {
    const iterativeNodes = (nodes) => {
      // 判断是否有节点信息，有节点信息则渲染
      if (is.empty(nodes) || is.not.existy(nodes) || is.not.array(nodes)) {
        return undefined;
      }

      // 节点keys
      let keys = [];
      nodes.forEach((item) => {
        const { node, leaf = [] } = item;
        // console.log(node._id, leafId);

        // 获取当前节点key
        if (node._id === leafId) {
          keys.push(node._id);
          return;
        }

        // 判断，如果子节点数据为空，则返回空
        if (is.not.existy(leaf) || is.empty(leaf)) {
          return undefined;
        }

        // 继续调用子节点数据
        const leafData = iterativeNodes(leaf);
        // 如果子节点数据不存在或为空，则返回空，整个枝干自动为空
        if (is.not.existy(leafData) || is.empty(leafData)) {
          return undefined;
        }

        // 合并子节点keys
        keys = keys.concat(leafData);
        // 获取当前节点key（子级有数据，才会push当前节点）
        keys.push(node._id);
      });

      return keys.filter(item => !item === false);
    };

    // 遍历节点数据
    return iterativeNodes(dataSource);
  }

  // TODO：@王晋 直接使用props和getDerivedStateFromProps， 需要在组件中使用 Proptypes 声明
  static getDerivedStateFromProps(nextProps, prevState) {
    const { selectedIds, searchValue = [], expandedKeys } = prevState;
    const {
      namespace = 'default',
      departments = {},
      onSelect,
      selectedIds: nextSelectedIds = [],
      searchValue: nextSearchValue = [],
    } = nextProps;

    // 初始化selectIds（selectedIds无值，并且部门树有数据时才更新）
    if ((is.empty(selectedIds) || !is.existy(selectedIds))
      && is.not.empty(departments[namespace])) {
      const node = dot.get(departments[namespace], '0.node', {});
      const id = dot.get(node, '_id', undefined);
      const info = [{ props: { node } }];

      // id存在才能更新（会出现[undefined]的情况）
      if (id) {
        // TODO: @王晋：不要使用行内判断和调用，该语法，调试器加断点会有问题
        onSelect && onSelect([id], info);
        return { selectedIds: [id] };
      } else {
        return null;
      }
    }

    if (dot.get(selectedIds, '0', undefined) !== dot.get(nextSelectedIds, '0', undefined)) {
      // 高亮选中的节点id
      const selectedId = dot.get(nextSelectedIds, '0', undefined);

      // 根据选中的节点，获取该节点上级枝干的ids数组
      let selectedNodesIds = [];
      // 部门数据是否为空
      if (is.not.empty(departments) && is.not.empty(departments[namespace])) {
        // 遍历数据，获取结果
        const dataSource = departments[namespace];
        // 根据选中的节点，获取该节点上级枝干的ids数组
        selectedNodesIds = CommonTreeDepartments.fetchNodesKeysByLeaf(dataSource, selectedId);
      } else {
        // 无法获取到部门数据
        selectedNodesIds = [selectedId];
        console.error('无法获取部门数据，无法展开父级节点');
      }

      // 合并当前已经选中节点的id数组，一起返回，filter 数据去重
      const mergeExpandedKeys = expandedKeys.concat(selectedNodesIds).filter((item, index, self) => {
        return self.indexOf(item) === index;
      });

      return {
        selectedIds: nextSelectedIds,     // 设置选中高亮的节点
        expandedKeys: mergeExpandedKeys,  // 设置展开的节点
      };
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
      searchValue: dot.get(props, 'searchValue', []),     // 搜索的数据标题
      selectedIds: dot.get(props, 'selectedIds', []),     // 选中的节点数据
      expandedKeys: [],         // 展开的树节点keys值
    };
  }

  componentDidMount() {
    // 获取数据
    this.props.dispatch({ type: 'applicationCommon/fetchDepartments' });
  }

  componentWillUnmount = () => {
    const { namespace } = this.props;
    this.props.dispatch({ type: 'applicationCommon/resetDepartments', payload: { namespace } });
  }

  // 选中的节点值
  onSelect = (selected, info) => {
    // 判断，如果选择为空，则不进行处理
    if (is.empty(selected)) {
      return;
    }

    const { onSelect } = this.props;
    const selectedNodes = dot.get(info, 'selectedNodes', []);

    // 更新传入右侧组件的部门信息
    // TODO: @王晋：不要使用行内判断和调用，该语法，调试器加断点会有问题
    onSelect && onSelect(selected, selectedNodes);

    this.setState({
      selectedIds: selected,
    });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
    });
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

  /**
   * 遍历获取，所有节点的keys
   * @param nodes 所有节点数据
   * @param level 当前节点级别
   * @param expandLevel 展开的级别, -1为展开所有级别
   **/
  iterativeNodesKeys = (nodes, level = 1) => {
    // 判断是否有节点信息，有节点信息则渲染
    if (is.empty(nodes) || is.not.existy(nodes) || is.not.array(nodes)) {
      return undefined;
    }

    // 如当前级别 > 展开级别，则不处理数据，不展开节点
    if (level > DefaultExpandLevel && DefaultExpandLevel !== 0) {
      return undefined;
    }

    let keys = [];
    nodes.forEach((item) => {
      const { node, leaf = [] } = item;
      // 获取子节点keys，树状结构级 + 1
      keys = keys.concat(this.iterativeNodesKeys(leaf, level + 1));
      // 获取当前节点key
      keys.push(node._id);
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
    const { departments = {}, namespace = 'default' } = this.props;

    // 部门数据是否为空
    if (is.empty(departments) || is.empty(departments[namespace])) {
      return <div />;
    }

    const dataSource = departments[namespace];

    // 过滤后的部门树结构
    const filterDataSource = this.iterativeNodes(dataSource);
    // 如果为空，则不渲染
    if (is.empty(filterDataSource)) {
      return <div />;
    }

    // 默认展开的部门树节点，默认展开一级
    const defaultExpandedKeys = this.iterativeNodesKeys(dataSource, 1);
    // 如果为空，则不渲染
    if (is.empty(defaultExpandedKeys) || !is.existy(defaultExpandedKeys)) {
      return <div />;
    }

    // 默认属性
    const props = {
      selectedKeys: selectedIds,    // 默认的选中高亮ids
    };

    // 如果默认展开的keys值为空，使用默认的展开值
    if (is.empty(expandedKeys)) {
      // 默认展开的ids
      props.defaultExpandedKeys = defaultExpandedKeys;
      props.expandedKeys = defaultExpandedKeys;
      props.autoExpandParent = true;
    } else {
      // 如果展开的keys有数据，则直接传递给组件展开
      props.expandedKeys = expandedKeys;
      props.autoExpandParent = false;
    }

    // 不为空时渲染，defaultExpandedKeys有个bug，只有第一次渲染才会展开。
    return (
      <Tree onSelect={this.onSelect} onExpand={this.onExpand} showLine showIcon {...props}>
        { this.renderNodes(filterDataSource) }
      </Tree>
    );
  }
}

function mapStateToProps({ applicationCommon: { departments } }) {
  return { departments };
}

export default connect(mapStateToProps)(CommonTreeDepartments);
