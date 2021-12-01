/**
 * 发起审批 - 费控申请 /OA/Document
 * */
import React from 'react';

import { CoreContent } from '../../../components/core';
import { PagesDefinition } from './expenseDefine';
import { PageExpenseButton } from './components';

const ExpenseDocumentManageComponents = () => {
  // 渲染分组数据
  function renderPageGroups(groups = []) {
    return groups.map(({ title = '', routes = [] }) => {
      return (
        <CoreContent title={title} key={`page-${title}`}>
          <div style={{ overflow: 'hidden' }}>
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

export default ExpenseDocumentManageComponents;
