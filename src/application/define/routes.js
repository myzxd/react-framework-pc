/* eslint no-console: ["error", { allow: ["warn", "error", "log"]  }] */
// 路由报Loading错时，页面需要刷新
const onRouteError = (err) => {
    console.log(`DEBUG: 路由调试 ${err}`);
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = err.match(pattern);
    console.log(err);
    // 检测是否有问题
    if (isChunkLoadFailed) {
        console.log('DEBUG: 路由刷新');
        window.location.reload(); // 刷新
    }
};

// 预加载的路由（预加载，页面布局加载前的逻辑判断使用）
const PreLoadRoutes = [
    // 登录相关
    {
        path: '/authorize/:route',
        component: () =>
            import ('../../routes/account/authorize/index').catch(err => onRouteError(`${err}`)),
    },
    // 404
    {
        path: '/404',
        component: () =>
            import ('../../routes/layout/error').catch(err => onRouteError(`${err}`)),
    },
];

// 模块路由
const ModuleRoutes = [
    // 登录相关
    {
        path: '/authorize/:route',
        component: () =>
            import ('../../routes/account/authorize').catch(err => onRouteError(`${err}`)),
    },

    // -----------------------超级管理----------------------
    // 系统信息
    {
        path: '/Admin/System',
        component: () =>
            import ('../../routes/admin/system').catch(err => onRouteError(`${err}`)),
    },
    // 模块权限信息
    {
        path: '/Admin/Management/Authorize',
        component: () =>
            import ('../../routes/admin/management/authorize').catch(err => onRouteError(`${err}`)),
    },
    // 角色管理
    {
        path: '/Admin/Management/Roles',
        component: () =>
            import ('../../routes/admin/management/roles').catch(err => onRouteError(`${err}`)),
    },
    // 开发参考模块
    {
        path: '/Admin/Interface',
        component: () =>
            import ('../../routes/admin/interface').catch(err => onRouteError(`${err}`)),
    },
    // 开发参考模块
    {
        path: '/Admin/Developer',
        component: () =>
            import ('../../routes/admin/developer').catch(err => onRouteError(`${err}`)),
    },
    {
        path: '/*',
        component: () =>
            import ('../../routes/layout/error').catch(err => onRouteError(`${err}`)),
    },
];

// 调试路由（提供给未开发完成，或者是隐藏的功能）
const DebugRoutes = [

];

export {
    // 预加载的路由（预加载，页面布局加载前的逻辑判断使用）
    PreLoadRoutes,

    // 模块路由
    ModuleRoutes,

    // 调试路由（提供给未开发完成，或者是隐藏的功能）
    DebugRoutes,
};