// 导航栏菜单结构
import Modules from './modules';

export default [
    // 首页
    {
        module: Modules.ModuleCodeHome,
    },

    // 超级管理
    {
        module: Modules.MenuAdmin,
        routes: [
            // 系统信息
            { module: Modules.ModuleAdminSystem },
            // 权限管理
            { module: Modules.ModuleAdminAuthorize },
            // 角色管理
            { module: Modules.ModuleAdminManagementRoles },
            // 开发参考模块
            { module: Modules.ModuleAdminInterface },
            // 开发测试模块
            { module: Modules.ModuleAdminDeveloper },
        ],
    },
];