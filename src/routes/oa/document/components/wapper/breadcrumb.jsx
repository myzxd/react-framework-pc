/**
 * 布局包装容器
 */
import is from 'is_js';
import React from 'react';
import { Breadcrumb } from 'antd';
import { PagesHelper } from '../../define';

function PageBreadCrumb(props) {
  const { pageType } = props;
  // 获取面包屑数据
  const breadcrumbs = PagesHelper.breadcrumbByKey(pageType);
  // 判断面包屑是否存在
  if (is.not.existy(breadcrumbs) || is.empty(breadcrumbs)) {
    return <div />;
  }

  return (
    <Breadcrumb style={{ marginBottom: '10px', marginTop: '-5px' }}>
      {
        breadcrumbs.map((item, index) => {
          return <Breadcrumb.Item key={`breadcrumb-${index}`}>{item}</Breadcrumb.Item>;
        })
      }
    </Breadcrumb>
  );
}

export default PageBreadCrumb;
