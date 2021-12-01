/**
 * 布局layout,容器组件
 * */

import React, { useState } from 'react';
import { Layout } from 'antd';
import styles from './index.css';
import HeaderComponent from './header';
import Navigation from './navigation';
import BreadCrumb from './breadcrumb';
import Router from '../../application/service/router';
import { authorize, config } from '../../application';
import { CommonInjectTracker, CommonInjectTalker } from '../../components/common';

const { Sider, Content, Header } = Layout;


function IndexPage(props) {
 // 是否隐藏侧边栏菜单
  const [isHideSiderNavigation, setIsHideSiderNavigation] = useState(false);


  // 渲染侧边栏菜单
  const renderSiderNavigation = (breadcrumb) => {
    if (isHideSiderNavigation) {
      return;
    }
    // 选中的菜单
    const selectedMenu = breadcrumb[0];
    // 选中的模块
    const selectedModule = breadcrumb.slice(-1)[0];

    return (
      <Sider collapsible width={180}>
        <Navigation selectedMenu={selectedMenu} selectedModule={selectedModule} />
      </Sider>
    );
  };

   // 改变sider展示与否的状态
  const onChangeSiderNavigationDisplay = () => {
    setIsHideSiderNavigation(!isHideSiderNavigation);
  };

  // 渲染侧边栏菜单按钮
  const renderNavigationOpreateButton = () => {
    // 判断菜单栏是否隐藏
    if (isHideSiderNavigation) {
      // 展开按钮
      return (
        <div className={styles['app-layout-navigation-display-button']} onClick={onChangeSiderNavigationDisplay} />
      );
    }

    // 收起按钮
    return (
      <div className={styles['app-layout-navigation-hidden-button']} onClick={onChangeSiderNavigationDisplay} />
    );
  };

  // 渲染脚本注入服务
  const renderTrackerScriptInject = () => {
    // 判断如果配置文件中不进行数据跟踪，则不进行初始化
    if (config.countly_enable !== true) {
      return '';
    }

    // 所有的页面都添加统计脚本
    return (
      <CommonInjectTracker />
    );
  };

  // 渲染脚本注入服务
  const renderTalkerScriptInject = () => {
    // 判断如果配置文件中不进行数据跟踪，则不进行初始化
    if (config.isShowClientService !== true || !config.ClientServiceChatId || !config.ClientServiceDomainId) {
      return '';
    }

    // 所有的页面都添加统计脚本
    return (
      <CommonInjectTalker />
    );
  };


  const { location = {} } = props;
  const { pathname = '' } = location;
    // 面包屑
  const breadcrumb = Router.breadcrumbByPath(pathname);

    // 判断菜单栏是否隐藏
  const contentLayoutStyle = {
    marginLeft: '-10px',
  };
  if (isHideSiderNavigation) {
    contentLayoutStyle.marginTop = '-32px';
  }


  return (
    <Layout className={styles['app-layout']}>
      <Header className={styles['app-layout-header']}>
        <HeaderComponent />
      </Header>

      <Layout>
        {/* 渲染侧边栏菜单 */}
        {renderSiderNavigation(breadcrumb)}
        {/* 渲染侧边栏菜单按钮 */}
        {renderNavigationOpreateButton()}

        <Layout style={contentLayoutStyle}>
          <Content className={styles['app-layout-content']}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: 'calc(100vh - 72px)' }}>
              <div style={{ height: '100%' }}>
                {
                  authorize.isHome(pathname) ? ''
                    : <BreadCrumb breadcrumb={breadcrumb} />
                }
                <div style={authorize.isHome(pathname) ? { height: '100%' } : { height: 'calc(100% - 26px)' }}>
                  {props.children}
                </div>
              </div>
            </div>
          </Content>
        </Layout>

      </Layout>
      {renderTrackerScriptInject()}
      {renderTalkerScriptInject()}
    </Layout>
  );
}

export default IndexPage;
