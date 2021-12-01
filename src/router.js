/**
 * router center 路由模块
 */
import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';

import { authorize, system } from './application';
import { PreLoadRoutes, ModuleRoutes, DebugRoutes } from './application/define/routes';
import Layout from './routes/layout/index';
import PageWhiteList from './application/object/pageWhiteList';

function AppRouter(props) {
  const { history } = props;

  // 渲染动态路由
  const renderDynamicRoutes = (routes = []) => {
    const { app } = props;
    return routes.map((route, index) => {
      // 动态加载，dva支持的dynamic初始化，返回Promise对象。dynamic说明见 https://dvajs.com/api/#dva-dynamic
      const DynamicComponent = dynamic({
        app, // dva 实例，加载 models 时需要
        component: route.component,
      });
      // 初始化路由节点
      return (<Route key={index} exact={route.path !== '*'} path={route.path} component={DynamicComponent} />);
    });
  };

  // 渲染主节点路由
  const renderRootRoute = ({ location }) => {
    // 过滤预加载地址，防止循环重定向。
    if (PreLoadRoutes.map(item => item.path).indexOf(location.pathname) !== -1) {
      return <div />;
    }

    // 如果未登陆，未授权，则跳转到登录页面
    const isLogin = authorize.isLogin();
    const isAuth = authorize.isAuth();
    if (isLogin === false || isAuth === false) {
      return <Redirect to="/authorize/login" />;
    }

    // 如果没有权限访问，则跳转到404
    if (authorize.canAccess(location.pathname) === false
      && PageWhiteList.find(i => `/${i.path}` !== location.pathname)
    ) {
      return <Redirect to="/404" />;
    }

    // 如果已登录，未授权，则跳转到授权页面
    if (location.pathname === '/' && isLogin === true && isAuth === false) {
      return <Redirect to="/authorize/auth" />;
    }

    // 如果已登录，已授权，则跳转到用户页面（默认访问页面）
    if (location.pathname === '/' && isLogin === true && isAuth === true) {
      return <Redirect to="/Code/Home" />;
    }

    // 加载默认的布局
    return (
      <Layout location={location}>
        <Switch>
          {/* 渲染调试模式路由, 调试模式下开启 */}
          { system.isDebugMode() ? renderDynamicRoutes(DebugRoutes) : '' }

          {/* 渲染局部路由 */}
          {renderDynamicRoutes(ModuleRoutes) }
        </Switch>
      </Layout>
    );
  };

  return (
    <Router history={history}>
      {/* 只渲染单一路径条件，https://reacttraining.com/react-router/web/api/Switch */}
      <Switch>
        {/* 渲染预加载路由 */}
        {renderDynamicRoutes(PreLoadRoutes) }

        {/* 渲染根路由 */}
        <Route path="/" render={renderRootRoute} />
      </Switch>
    </Router>
  );
}

// 路由中心
export default function ({ history, app }) {
  return (
    <AppRouter history={history} app={app} />
  );
}
