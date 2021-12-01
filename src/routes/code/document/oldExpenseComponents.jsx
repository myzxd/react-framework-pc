/**
 * 发起审批 - 费控申请 /Code/Document
 * */
import React from 'react';

import { CoreContent } from '../../../components/core';
import { PagesDefinition } from './oldExpenseDefine';
import PageExpenseButton from './components/button';

const OldExpenseDocumentManageComponents = () => {
  // 渲染分组数据
  function renderPageGroups(groups = []) {
    return groups.map(({ title = '', routes = [] }) => {
      return (
        <CoreContent
          color="rgba(255, 119, 0, 0.5)"
          title={title}
          key={`page-${title}`}
          style={{ background: '#fff' }}
        >
          <div style={{ overflow: 'hidden', display: 'flex' }}>
            {renderPageRoutes(routes)}
          </div>
        </CoreContent>
      );
    });
  }

  // 渲染节点数据
  function renderPageRoutes(routes = []) {
    return routes.map(({ key, title, icon, hoverIcon, isShow, desc }) => {
      return (<PageExpenseButton
        key={key}
        type={key}
        title={title}
        icon={icon}
        hoverIcon={hoverIcon}
        desc={desc}
        isShow={isShow}
      />);
    });
  }

  return renderPageGroups(PagesDefinition);
};

export default OldExpenseDocumentManageComponents;
