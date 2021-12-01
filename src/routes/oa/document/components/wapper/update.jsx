/**
 * 布局包装容器
 */
import React from 'react';
import PageBreadCrumb from './breadcrumb';

function PageUpdateWapper(props) {
  const { pageType } = props;

  return (
    <div>
      <PageBreadCrumb pageType={pageType} />

      {props.children}
    </div>
  );
}

export default PageUpdateWapper;
