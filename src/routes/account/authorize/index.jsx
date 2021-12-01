/**
 * 登录相关路由
 */
import React from 'react';
import styles from './style/login.less';
import LoginComponent from './login';
import AuthComponent from './auth';

// 模块内部路由
const AuthorizeRouter = {
  login: 'login',       // 登陆
  auth: 'auth',         // 验证
};

function AuthorizeComponent(props) {
  // 根据路由获取模块
  const renderComponentByRoute = (route) => {
    switch (route) {
      case AuthorizeRouter.auth:
        return <AuthComponent />;

      case AuthorizeRouter.login:
      default:
        return <LoginComponent />;
    }
  };

  const { route } = props.match.params;

  return (
    <div id={styles['app-comp-account-login']} className={styles['app-comp-account-login-bj']}>
      <div className={styles['app-comp-account-center-box']}>
        {/* 子模块 */}
        {renderComponentByRoute(route)}
      </div>
    </div>
  );
}

export default AuthorizeComponent;
