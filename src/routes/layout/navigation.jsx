/**
 *  侧栏导航
 * */
import dot from 'dot-prop';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as ReactIs from 'react-is';
import { Menu } from 'antd';
import styles from './index.css';
import { authorize, system } from '../../application';

function Navigation(props) {
  // 缓存计算好的侧边栏数据
  const [navigation] = useState(authorize.navigation(system.isDebugMode()));


  // 渲染菜单
  const renderMenu = (data, level = 0) => {
    return data.map((item) => {
      // 判断模块是否有权限可以访问, 并且可以显示在菜单栏上
      if (item.module.canAccess === false) {
        return undefined;
      }

      const iconComponent = ReactIs.isElement(item.module.icon) ? item.module.icon : null;

      // 子菜单
      if (item.routes) {
        return (
          <Menu.SubMenu key={item.module.key} title={<span>{iconComponent}<span>{item.module.title}</span></span>}>
            {renderMenu(item.routes, level + 1)}
          </Menu.SubMenu>
        );
      }

      return <Menu.Item key={item.module.key} ><a href={`/#/${item.module.path}`}>{<span>{iconComponent}<span>{item.module.title}</span></span>}</a></Menu.Item>;
    });
  };


  const { selectedMenu, selectedModule } = props;
    // 默认展开的菜单和选中的菜单
  const defaultOpenKeys = dot.get(selectedMenu, 'key');
  const defaultSelected = dot.get(selectedModule, 'key');

  return (
    <Menu theme="dark" mode="inline" defaultOpenKeys={[defaultOpenKeys]} selectedKeys={[defaultSelected]} className={styles['app-layout-sider-navigation-menu']} inlineIndent={19}>
      {renderMenu(navigation)}
    </Menu>
  );
}

Navigation.propTypes = {
  selectedMenu: PropTypes.object, // 选中的菜单
  selectedModule: PropTypes.object, // 选中的模块
};

export default Navigation;
