/* eslint no-underscore-dangle: ["error", { "allow": ["_account", '_accounts', '_phones', '_config', '_prompt', '_enumerated'] }]*/

import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';

import Storage from '../library/storage';
import Router from './router';
import Config from './config';
import Modules from '../define/modules';
import pageWhiteList from '../object/pageWhiteList';

class Authorize {
    constructor() {
        // 授权信息
        this._account = new Storage('aoao.app.authorize', { container: 'auth' });
        // 多账号列表
        this._accounts = new Storage('aoao.app.authorize', { container: 'accounts' });
        // 系统中所有有效手机号(移除到system)
        this._phones = new Storage('aoao.app.authorize', { container: 'phones' });
        // 授权配置
        this._config = new Storage('aoao.app.authorize', { container: 'config' });

        this._prompt = new Storage('aoao.app.authorize', { container: 'prompt' });
    }

    get account() {
        return this._account.data;
    }

    set account(info) {
        this._account.set(info);
    }

    // 获取多账号列表
    get accounts() {
        return this._accounts.data;
    }

    set accounts(info) {
        this._accounts.set(info);
    }

    // 系统中所有的账户
    // TODO: 后期要改变方式，不能使用这种方式调用
    get phones() {
        return this._phones.data;
    }

    set phones(info) {
        this._phones.set(info);
    }

    get prompt() {
        return this._prompt.data;
    }

    set prompt(info) {
        this._prompt.set(info);
    }

    // 判断是否是超管 true 超管 false 不是超管
    isAdmin = () => {
        return this._account.get('isAdmin', false);
    }

    // 负责平台
    platform = () => {
        return this._account.get('platforms', []);
    }

    // 是否为首页（首页无需面包屑）
    isHome = (pathname) => {
        return pageWhiteList.find(p => p.path === pathname.replace(/\/*([\W\w]+)/, '$1'));
    }

    // 负责平台进行过滤,筛选name
    platformFilter = (value) => {
        // 判断是否是数组
        if (is.array(value) && is.existy(value) && is.not.empty(value)) {
            return value.map((val) => {
                const platformList = this.platform().filter(v => v.id === val);
                // 判断平台是否存在
                if (is.existy(platformList) && is.not.empty(platformList)) {
                    return platformList[0].name;
                }
                return '--';
            }).join(' , ');
        }

        // 判断是否是字符串
        if (is.string(value) && is.existy(value) && is.not.empty(value)) {
            const platformList = this.platform().filter(v => v.id === value);
            // 判断平台是否存在
            if (is.existy(platformList) && is.not.empty(platformList)) {
                return platformList[0].name;
            }
            return '--';
        }

        return '--';
    }

    // 判断是否登陆
    isLogin = () => {
        if (is.not.empty(this._account.data) &&
            is.existy(this._account.data) &&
            is.existy(this._account.data.id) &&
            is.existy(this._account.data.accessToken)) {
            return true;
        }
        return false;
    }

    // 设置授权，当前账户已经授权登录
    setAuth = (isAuth = false) => {
        this._config.set('updateTime', moment());
        return this._account.set('isAuth', isAuth);
    }

    // 判断是否需要选择多账号 && 供应商数据
    isAuth = () => {
        // 是否登录
        if (!this.isLogin()) {
            return false;
        }

        if (is.existy(this._account.data) &&
            is.truthy(this._account.data.isAuth)
        ) {
            return true;
        }
        return false;
    }

    // 获取当前用户能访问的模块
    modules = () => {
        return this._account.get('modules');
    }

    // 判断用户是否可查看超级管理员模块
    canAdminAccess = () => {
        // 隐藏超管模块的账号统计
        const accounts = dot.get(Config, 'hide_administrators_module_account', []);
        const roleNames = this._account.get('roleList', []).map(v => v.name); // 职位列表
        const name = this._account.get('name', []); // 姓名
        const phone = this._account.get('phone', []); // 手机号
        // 筛选
        const admins = accounts.filter((item) => {
            return roleNames.includes(item.role) && item.name === name && item.phone === Number(phone);
        });
        // 判断是否有数据
        return is.existy(admins) && is.not.empty(admins);
    }

    // 判断是否有权限使用某内置功能
    canOperate = (operateModule) => {
        // 如果没有登陆则不能访问
        if (this.isLogin() === false) {
            return false;
        }
        // 超级管理员，默认拥有所有权限
        if (this.isAdmin()) {
            return true;
        }
        // 判断是否是功能操作模块
        if (is.not.truthy(dot.get(operateModule, 'isOperate'))) {
            return false;
        }
        // 当前角色能访问的所有模块
        const modules = this.modules();

        // 遍历角色拥有的所有模块
        let canOperate = false;
        modules.forEach((v) => {
            // 判断当前路径是否存在于模块中
            if (v.id === operateModule.id) {
                canOperate = true;
            }
        });
        return canOperate;
    }

    // 判断模块是否可以被访问
    canAccess = (pathname) => {
        // 判断用户是否可查看超级管理员模块
        const flag = this.canAdminAccess();
        // 默认界面
        if (pathname === '/') {
            return true;
        }

        // 如果没有登陆则不能访问
        if (this.isLogin() === false) {
            return false;
        }

        // 除了个别账号，其他超级管理员，默认拥有所有权限
        if (this.isAdmin() && flag !== true) {
            return true;
        }

        // 判断是否是oa模块，并且有权限访问oa
        if (pathname.includes('/OA/Document/') && this.canAccessOA()) {
            return true;
        }

        // 当前角色能访问的所有模块
        const modules = this.modules();

        // 过滤路径中的字符串
        const path = pathname.replace(/\/*([\W\w]+)/, '$1');
        // 遍历角色拥有的所有模块
        let canAccess = false;
        modules.forEach((module) => {
            // 判断当前路径是否存在于模块中
            if (module.path === path) {
                // 判断判断用户是否可查看超级管理员模块
                if (flag === true && module.isAdmin === true) {
                    canAccess = false;
                } else {
                    canAccess = true;
                }
            }
        });

        // 调试权限使用的日志
        // console.log('Debug:', pathname, path, canAccess);
        return canAccess;
    }

    // 是否能访问oa模块
    canAccessOA = () => {
        // 当前角色能访问的所有模块
        const modules = this.modules();
        const oa = modules.filter(module => module.id === Modules.ModuleOADocumentManage.id);
        if (oa.length === 0) {
            return false;
        }

        return true;
    }

    // 菜单栏
    navigation = (isDebugMode = false) => {
        return Router.navigationByAccessHook(this.canAccess, isDebugMode);
    }

    // 判断是否重新刷新权限
    isRefreshAuth = () => {
        const lastUpdateTime = this._config.get('updateTime');
        const diff = moment().diff(lastUpdateTime, 'days');
        // const diff = moment().diff(lastUpdateTime, 'seconds');
        if (diff >= 1 || !lastUpdateTime) {
            return true;
        }
        return false;
    }

    // 清空数据
    clear = () => {
        this._account.clear();
        this._accounts.clear();
        this._phones.clear();
        this._config.clear();
        // TODO:临时做兼容清除
        window.sessionStorage.clear();
    }

    debug = () => {
        // const storage = new Storage('aoao.app.authorize');
        // console.log('DEBUG:storage', storage);
        // console.log('DEBUG:this._account', this._account);
        // console.log('DEBUG:isLogin', this.isLogin());
    }
}

// 上一版 module.exports = Authorize;
export default Authorize;