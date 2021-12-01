import CoreObject from './core';
import Modules from '../define/modules';
import pageWhiteList from './pageWhiteList';

// 平台
class Platform extends CoreObject {
  constructor() {
    super();
    this.id = '';       // 平台数据id
    this.name = '';     // 平台名称
  }
  // 数据映射
  static datamap() {
    return {
      platform_code: 'id',
      platform_name: 'name',
    };
  }

  // 反向映射
  static revertMap() {
    return {
      id: 'platform_code',
      name: 'platform_name',
    };
  }
}

// 账户信息对象
class Account extends CoreObject {
  constructor() {
    super();
    this.id = '';             // 账户id
    this.employeeId = '';     // 人员id
    this.name = '';           // 账户名称
    this.isAdmin = '';        // 判断是否是超管 true 超管 false 不是超管
    this.state = '';          // 账户状态 CHANGED 服务器返回数据没有该字段
    this.phone = '';          // 手机号
    this.modules = [];        // 模块id
    this.exchangeAccounts = []; // 可以切换的账户
    this.platforms = [];      // 平台列表
    this.roleList = [];      // 角色列表
    this.accessToken = '';    // 授权token
    this.refreshToken = '';   // 刷新token
    this.expiredAt = '';      // token过期时间
    this.staffProfileId = ''; // 档案id
  }

  // 数据映射
  static datamap() {
    return {
      account_id: 'id',
      staff_id: 'employeeId',
      name: 'name',
      phone: 'phone',
      state: 'state',
      is_admin: 'isAdmin',
      staff_profile_id: 'staffProfileId',
      region: {
        key: 'platforms',
        transform: value => CoreObject.mapperEach(value, Platform),
      },
      role_list: 'roleList',
      permission_id_list: [
        {
          key: 'modules',
          transform: (permissionIds = []) => {
            // 本地的模块列表（根据权限模块的id）
            const modules = [...pageWhiteList];
            Object.keys(Modules).forEach((k) => {
              if (permissionIds.includes(Modules[k].id)) {
                modules.push(Modules[k]);
              }
            });

          // HACK：管理员权限下，应该拥有所有的模块。此处判断是核对前后端模块列表一致性使用。
          // if (modules.length !== permissionIds.length) {
          //   Object.keys(Modules).forEach((k) => {
          //     // 验证前端的模块是否存在与后端数据中
          //     if (permissionIds.includes(Modules[k].id) === false) {
          //       console.log('HACK: 前后端模块不一致', Modules[k]);
          //     }
          //   });
          // }

            return modules;
          },
        },
      ],
      access_token: 'accessToken',
      refresh_token: 'refreshToken',
      expired_at: 'expiredAt',
      allow_exchange_account: {
        key: 'exchangeAccounts',
        transform: (values = []) => {
          const result = [];
          values.forEach((value) => {
            const { account_id, name, role_names } = value;
            result.push({ id: account_id, name, roleNames: role_names });
          });
          return result;
        },
      },
    };
  }

  // 反向数据映射 TODO: 支持revert
  static revertMap() {
    return {
      id: 'account_id',
      employeeId: 'staff_id',
      name: 'name',
      phone: 'phone',
      isAdmin: 'is_admin',
      staffProfileId: 'staff_profile_id',
      state: 'state',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      expiredAt: 'expired_at',
      roleList: 'role_list',
      platforms: {
        key: 'region',
        transform: value => (CoreObject.revertEach(value, Platform)),
      },
    };
  }
}

// 供应商
class Supplier extends CoreObject {
  constructor() {
    super();
    this.id = '';     // id
    this.name = '';   // 名称
  }
  // 数据映射
  static datamap() {
    return {
      supplier_id: 'id',
      supplier_name: 'name',
    };
  }
  // 反向映射
  static revertMap() {
    return {
      id: 'supplier_id',
      name: 'supplier_name',
    };
  }
}

// 上一版 module.exports
export {
  Supplier,   // 供应商
  Platform,   // 平台
  Account,    // 账户信息对象
};
