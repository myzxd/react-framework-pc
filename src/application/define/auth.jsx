// 权限设置的配置文件
import Modules from './modules';

class Node {
  constructor({ key = '', title = '' }) {
    this.key = key;       // key, 标识
    this.title = title;   // 标题
  }
}

// 权限
class Auth extends Node {
  /**
   * 权限节点
   * @param {String} [key='']         [权限的key，前端自定义，仅权限模块使用，不传值给后台。key唯一不重复。]
   * @param {String} [title='']       [权限名称]
   * @param {String} [description=''] [权限定义]
   * @param {Array}  [modules=[]]     [权限相关（菜单，页面，操作）]
   * @param {Bool}   [onShowOnDebugMode=false]  [调试模式相关，ture 为只在调试模式展示，false为所有模式都显示 ]
   * @param {Bool}   [onShowOnBoss=false]  [调试模式相关，ture 为只在boss系统中展示，false为不显示 ]
   * @param {Bool}   [isVerifyAuth=true]  [是否验证权限，true 判断权限，false不判断权限]
   */
  constructor({ key = '', title = '', description = '', modules = [], onShowOnDebugMode = false, onShowOnBoss = false, isVerifyAuth = true }) {
    super({ key, title });
    this.description = description;  // 权限组的描述
    this.modules = modules;          // 权限组的模块
    this.onShowOnDebugMode = onShowOnDebugMode; // 只在调试模式展示
    this.onShowOnBoss = onShowOnBoss; // 只在boss系统中展示
    this.isVerifyAuth = isVerifyAuth; // 是否验证权限，true 判断权限，false不判断权限，不显示勾选框
  }
}

// 所有的权限节点
const AuthNodes = {
  // 超级管理
  AuthAdmin: new Auth({
    key: 'AuthAdmin',
    title: '超级管理',
    modules: [
      // 超级管理（菜单）
      Modules.MenuAdmin,
    ],
  }),

  // 系统信息
  AuthAdminSystem: new Auth({
    key: 'AuthAdminSystem',
    title: '系统信息',
    description: '查看（系统信息）页面的权限',
    modules: [
      // 超级管理 / 系统管理 （页面）
      Modules.ModuleAdminSystem,
    ],
    // 只在调试模式展示
    onShowOnDebugMode: true,
  }),

  // 权限管理
  AuthAdminAuthorize: new Auth({
    key: 'AuthAdminAuthorize',
    title: '权限管理',
    description: '查看、操作（权限管理）页面的权限',
    modules: [
      // 超级管理 / 权限管理 （页面）
      Modules.ModuleAdminAuthorize,
    ],
  }),

  // 角色管理
  AuthAdminManagementRoles: new Auth({
    key: 'AuthAdminManagementRoles',
    title: '角色管理',
    description: '查看、操作（角色管理）页面的权限',
    modules: [
      // 超级管理 / 角色管理 （页面）
      Modules.ModuleAdminManagementRoles,
    ],
  }),
  // CODE业务策略
  AuthAdminManagementCodeRoles: new Auth({
    key: 'AuthAdminManagementCodeRoles',
    title: 'CODE业务策略',
    description: '查看、操作（CODE业务策略）页面的权限',
    modules: [
      // 超级管理 / 角色管理 （页面）
      Modules.OperateAdminManagementCodeRoles,
    ],
  }),

  // 开发文档
  AuthAdminInterface: new Auth({
    key: 'AuthAdminInterface',
    title: '开发文档',
    description: '查看（开发文档）页面的权限',
    modules: [
      // 超级管理 / 开发文档 （页面）
      Modules.ModuleAdminInterface,
    ],
    // 只在调试模式展示
    onShowOnDebugMode: true,
  }),

  // 开发调试
  AuthAdminDeveloper: new Auth({
    key: 'AuthAdminDeveloper',
    title: '开发调试',
    description: '查看（开发调试）页面的权限',
    modules: [
      // 超级管理 / 开发调试 （页面）
      Modules.ModuleAdminDeveloper,
    ],
    // 只在调试模式展示
    onShowOnDebugMode: true,
  }),
};

/**
 * 权限设置的配置文件
 * @desc node {Auth}     节点
 * @desc leaf {Array}    子节点
 */
const AuthTree = [
  // 超级管理相关权限
  {
    // 超级管理
    node: AuthNodes.AuthAdmin,
    leaf: [
      // 系统信息
      { node: AuthNodes.AuthAdminSystem },
      // 权限管理
      { node: AuthNodes.AuthAdminAuthorize },
      // 角色管理
      {
        node: AuthNodes.AuthAdminManagementRoles,
        leaf: [
          // CODE业务策略
          { node: AuthNodes.AuthAdminManagementCodeRoles },
        ],
      },
      // 开发文档
      { node: AuthNodes.AuthAdminInterface },
      // 开发调试
      { node: AuthNodes.AuthAdminDeveloper },
    ],
  },
];

// 上一版module.exports
export default {
  AuthNodes,   // 权限的节点
  AuthTree,    // 权限的树结构
};

export {
  AuthNodes,   // 权限的节点
  AuthTree,    // 权限的树结构
};
