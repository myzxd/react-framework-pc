/**
 * 面包屑
 * */
import PropTypes from 'prop-types';
import React from 'react';
import { Breadcrumb } from 'antd';
import styles from './index.css';


function BreadCrumbComponent(props) {
  // 渲染面包屑
  const renderBreadcrumb = () => {
    const { breadcrumb } = props;
    const content = [];
    breadcrumb.forEach((item) => {
      content.push(<Breadcrumb.Item key={item.key}> {item.title} </Breadcrumb.Item>);
    });
    return (
      <Breadcrumb className={styles['app-layout-sider-navigation-bread-crumb']}>
        {content}
      </Breadcrumb>
    );
  };

  return (
    <div>
      {renderBreadcrumb()}
    </div>
  );
}


BreadCrumbComponent.propTypes = {
  breadcrumb: PropTypes.array,
};
BreadCrumbComponent.defaultProps = {
  breadcrumb: [],
};
export default BreadCrumbComponent;
