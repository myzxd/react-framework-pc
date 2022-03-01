// 导航栏菜单结构
import Modules from './modules';

export default [
    // 首页
    // {
    //     module: Modules.ModuleCodeHome,
    // },

    // 超级管理
    {
        module: Modules.MenuAdmin,
        routes: [
            // 权限管理
            { module: Modules.ModuleAdminAuthorize },
            // 角色管理
            { module: Modules.ModuleAdminManagementRoles },
        ],
    },
];