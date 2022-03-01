import React from 'react';
import {
    CodeOutlined,
    UserOutlined,
    DatabaseOutlined,
    PayCircleOutlined,
    BankOutlined,
    ReconciliationOutlined,
    CustomerServiceOutlined,
    SolutionOutlined,
    SettingOutlined,
    MoneyCollectOutlined,
    ApartmentOutlined,
    ShareAltOutlined,
    HomeOutlined,
    WalletOutlined,
    TransactionOutlined,
} from '@ant-design/icons';

// 模块对象(页面)
class Module {
    constructor({ id, key = '', title = '', path = '' }) {
        this.id = id; // 对应服务器的模块id
        this.key = key; // 模块的key, 标示
        this.title = title; // 模块的标题
        this.path = path; // 模块的路径
        this.isMenu = false; // 是否是菜单
        this.isPage = false; // 是否是页面
        this.isRule = false; // 是否是页面内置功能
        this.isBoss = false; // 是否是boss内置模块
        this.canAccess = false; // 是否有权限访问(默认没有权限)
    }
}

// 菜单对象
class Menu extends Module {
    constructor({ id, key, icon = '', title = '', isBoss = false, isVerifyAuth = true, isAdmin = false, merchant }) {
        super({ id, key, title, path: `menu-${key}` });
        this.icon = icon; // 菜单栏icon
        this.isMenu = true; // 是否是菜单
        this.isBoss = isBoss; // 是否是boss内置模块
        this.isVerifyAuth = isVerifyAuth; // 是否验证菜单栏显示权限，true 判断权限，false不判断默认显示
        this.isAdmin = isAdmin; // 判断是否是超级管理员模块
        this.merchant = merchant; // 商户
    }
}

// 页面
class Page extends Module {
    constructor({ id, key, icon = '', title = '', path = '', isBoss = false, isAdmin = false, merchant }) {
        super({ id, key, title, path });
        this.icon = icon; // 页面icon
        this.isPage = true; // 是否是页面
        this.isBoss = isBoss; // 是否是boss内置模块
        this.isAdmin = isAdmin; // 判断是否是超级管理员模块
        this.merchant = merchant; // 商户
    }
}

// 操作
class Operate extends Module {
    constructor({ id, key, title = '', isBoss = false, merchant }) {
        super({ id, key, title, path: `operate-${key}` });
        this.isOperate = true; // 是否是页面操作
        this.isBoss = isBoss;
        this.merchant = merchant; // 商户
    }
}

// 系统所有注册的模块
export default {
    // 超级管理
    MenuAdmin: new Menu({ id: '2-0', key: 'MenuAdmin', title: '超级管理(仅限超管)', icon: < CodeOutlined / > , isAdmin: true }),
    ModuleAdminAuthorize: new Page({ id: '2-2', key: 'ModuleAdminAuthorize', title: '权限管理', path: 'Admin/Management/Authorize', isAdmin: true }),
    ModuleAdminManagementRoles: new Page({ id: '2-3', key: 'ModuleAdminManagementRoles', title: '角色管理', path: 'Admin/Management/Roles', isAdmin: true }),
    OperateAdminManagementCodeRoles: new Page({ id: '2-6', key: 'OperateAdminManagementCodeRoles', title: 'CODE业务策略' }),
    ModuleAdminInterface: new Page({ id: '2-4', key: 'ModuleAdminInterface', title: '开发文档', path: 'Admin/Interface', isAdmin: true }),
    ModuleAdminDeveloper: new Page({ id: '2-5', key: 'ModuleAdminDeveloper', title: '开发调试', path: 'Admin/Developer', isAdmin: true }),
};