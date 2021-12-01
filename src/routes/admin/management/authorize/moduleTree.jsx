/**
 * 角色，职位，权限 对照显示模块
 */
import _ from 'lodash';
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Tree, Collapse, Tooltip } from 'antd';

import { AuthTree, AuthNodes } from '../../../../application/define/auth';
import { SystemIdentifier, ModuleState } from '../../../../application/define';
import { system, config, utils } from '../../../../application';
import styles from './style.less';

const Panel = Collapse.Panel;
class ModuleTree extends Component {
  static propTypes = {
    id: PropTypes.number,        // 角色id
    name: PropTypes.string,      // 角色姓名
    isActive: PropTypes.bool,    // 是否是展开状态
    permission: PropTypes.array, // 角色权限
    onChangePannelActive: PropTypes.func, // 更改pannel的展开状态
  };

  static defaultProps = {
    permission: [],
    isActive: false,
    onChangePannelActive: () => {},
  };

  constructor(props) {
    super(props);
    this.private = {
      dispatch: props.dispatch,
    };
    this.permissionKeys = utils.dotOptimal(props, 'permission', []).map(item => item.id); // 当前角色的权限
    this.state = {
      stateCheckedKeys: this.getCheckedKeys() || [], // 当前选中节点keys（state）
    };
  }

  // 选中节点
  onClickNodes = (checkedKeys, e) => {
    const { dispatch } = this.private;
    const { stateCheckedKeys } = this.state;
    const { id, permission } = this.props;
    const [
      currentModules, // 当前选中节点的modules
      currentKeys, // // 当前选中节点的keys
    ] = this.getModulesKey(e);
    let currentCheckedKeys = [];
    // 选中操作
    if (e.checked) {
      currentCheckedKeys = [...stateCheckedKeys, ...currentKeys];
      this.permissionKeys = [...this.permissionKeys, ...currentModules];
    // 取消操作
    } else {
      currentCheckedKeys = stateCheckedKeys.filter(item => currentKeys.every(i => i !== item));
      this.permissionKeys = this.permissionKeys.filter(item => currentModules.every(i => i !== item));
    }
    // 更新选中节点显示
    this.setState({
      stateCheckedKeys: currentCheckedKeys,
    });
    // 遍历所有模块，生成权限的提交参数
    const data = {};
    // 遍历原权限列表（取消勾选时属性值设置为0）
    permission.forEach((item) => {
      data[item.id] = this.permissionKeys.includes(item.id) ? 1 : 0;
    });
    // 遍历新的模块，生成权限的提交参数
    this.permissionKeys.forEach((item) => {
      data[item] = 1;
    });
    // 更新权限信息
    const payload = {
      roleId: id,
      permission: data,
    };
    dispatch({ type: 'adminManage/updateSystemPermission', payload });
  }

  // 更改展开收起的状态
  onChangeCollapse = (e) => {
    const isActive = is.not.empty(e);
    const { id, onChangePannelActive } = this.props;
    if (onChangePannelActive) {
      onChangePannelActive(id, isActive);
    }
  }

  // 获取节点及节点下children的modules及key
  getModulesKey = (current) => {
    if (!utils.dotOptimal(current, 'node.children', undefined)) {
      return [utils.dotOptimal(current, 'node.modules', []), [utils.dotOptimal(current, 'node.key', '')]];
    }
    let currentModules = utils.dotOptimal(current, 'node.modules', []);
    let currentKeys = [utils.dotOptimal(current, 'node.key', '')];
    current.node.children.forEach((item) => {
      currentModules = currentModules.concat(this.getChildrenModules(item));
      currentKeys = currentKeys.concat(this.getChildrenKeys(item));
    });
    return [currentModules, currentKeys];
  }

  // 获取嵌套Children的modules
  getChildrenModules = (current) => {
    const defaultRes = utils.dotOptimal(current, 'modules', []);
    if (!utils.dotOptimal(current, 'children')) {
      return defaultRes;
    }
    let res = defaultRes;
    current.children.forEach((item) => {
      res = res.concat(this.getChildrenModules(item));
    });
    return res;
  }

  // 获取嵌套Children的key
  getChildrenKeys = (current) => {
    const defaultRes = [utils.dotOptimal(current, 'key', '')];
    if (!utils.dotOptimal(current, 'children')) {
      return defaultRes;
    }
    let res = defaultRes;
    current.children.forEach((item) => {
      res = res.concat(this.getChildrenKeys(item));
    });
    return res;
  }

  // 根据服务返回的模块id，对应到权限id
  getCheckedKeys = () => {
    const selectedPermission = dot.get(this.props, 'permission', []).filter(item => item.state === ModuleState.access).map(item => item.id) || [];
    const checkedKeys = [];

    // 遍历授权模块
    Object.values(AuthNodes).forEach((auth) => {
      const authModuleIds = dot.get(auth, 'modules', []).map(module => module.id);

      // 获取授权模块id和所有模块id的交集（验证当前权限中，所有模块是否都有权限）
      const checkedModuleIds = _.intersection(selectedPermission, authModuleIds);

      // 模块交集相等，则当前拥有当前的权限
      if (checkedModuleIds.length === authModuleIds.length && is.not.empty(authModuleIds)) {
        checkedKeys.push(`${auth.key}`);
      }
    });
    return checkedKeys;
  }

  // 渲染模块树信息
  renderAuthTree = (data) => {
    const selectedPermission = dot.get(this.props, 'permission', []).filter(item => item.state === ModuleState.access).map(item => item.id) || [];
    return data.map((item) => {
      // 非调试模式 && 节点只显示在调试模式 （直接返回空）
      if (system.isDebugMode() !== true && item.node.onShowOnDebugMode === true) {
        return '';
      }

      // 判断如果是boss系统模块，并且系统的标示号不为9999，则隐藏模块
      if (item.node.onShowOnBoss === true && SystemIdentifier.isBossSystemIdentifier(config.SystemIdentifier) === false) {
        return '';
      }

      // 获取配置文件中的当前权限的所有模块id
      const authModuleIds = dot.get(item, 'node.modules', []).map(module => module.id);

      // 获取授权模块id和所有模块id的交集（验证当前权限中，所有模块是否都有权限）
      const checkedModuleIds = _.intersection(selectedPermission, authModuleIds);

      // 模块交集相等，则当前拥有当前的权限
      const isAuth = checkedModuleIds.length === authModuleIds.length && is.not.empty(authModuleIds);

      // console.log('DEBUG:' + item.title, isAuth, ids);
      const moduleDesc = (
        <div>
          <span>{item.node.description}</span><br />
          {dot.get(item, 'node.modules', []).map(module => <p key={module.key} className={styles['app-comp-admin-module-tree-desc']}>{module.title}</p>)}
        </div>
      );

      // 判断模块是否有权限访问，没有权限则为灰色，并且不选中
      let title = dot.get(item, 'node.title');
      if (isAuth !== true) {
        title = <Tooltip title={moduleDesc}><span className={styles['app-comp-admin-module-tree-title-disable']}>{title}</span></Tooltip>;
      } else {
        title = <Tooltip title={moduleDesc}><span className={styles['app-comp-admin-module-tree-title-disable']}>{title}</span></Tooltip>;
      }

      // 子权限
      let leaf = [];
      if (item.leaf) {
        leaf = this.renderAuthTree(item.leaf);
      }

      // 判断节点数据是否为空
      if (is.not.empty(leaf)) {
        return (
          <Tree.TreeNode title={title} key={item.node.key} modules={authModuleIds} disableCheckbox={!item.node.isVerifyAuth}>
            {leaf}
          </Tree.TreeNode>
        );
      }

      return <Tree.TreeNode title={title} key={item.node.key} modules={authModuleIds} disableCheckbox={!item.node.isVerifyAuth} />;
    }).filter(item => item !== ''); // 添加空数据过滤
  }

  render() {
    const { onChangeCollapse } = this;
    const { name, isActive } = this.props;
    const { stateCheckedKeys } = this.state;
    const defaultActiveKey = isActive ? name : null;

    // 渲染授权模块信息
    return (
      <Collapse defaultActiveKey={defaultActiveKey} className={styles['app-comp-admin-module-isVerifyAuth-collapse']} onChange={onChangeCollapse}>
        <Panel header={name} key={name}>
          <Tree defaultExpandAll onCheck={this.onClickNodes} checkable checkStrictly checkedKeys={stateCheckedKeys} >
            {/* 渲染权限树 */}
            {this.renderAuthTree(AuthTree)}
          </Tree>
        </Panel>
      </Collapse>
    );
  }
}
export default ModuleTree;
