/**
 * 发起申请 /Code/Document
 * */
import is from 'is_js';
import React from 'react';
import { Empty } from 'antd';
import { CoreTabs } from '../../../components/core';

import OADocumentManageComponents from '../../oa/document/oaComponents';
import ExpenseDocumentManageComponents from './expenseComponents.jsx';
import {
  canOperateCodeDocumentManageExpense,
  canOperateModuleOADocumentManage,
} from '../../../application/define/operate';

const Index = ({
  location,
}) => {
  const { jumpKey } = location.query;
  // 渲染tab
  const renderModalTab = () => {
    const items = [];
    // 判断是否有新建页面的权限
    if (canOperateCodeDocumentManageExpense()) {
      items.push(
        {
          title: '费控申请',
          content: <ExpenseDocumentManageComponents jumpKey={(jumpKey && jumpKey !== 'undefined' ? jumpKey : undefined)} />,
          key: '费控申请',
        },
      );
    }
    if (canOperateModuleOADocumentManage()) {
      items.push(
        {
          title: '事务申请',
          content: <OADocumentManageComponents isShowCode />,
          key: '事务申请',
        },
      );
    }
    if (is.not.existy(items) || is.empty(items)) {
      return (
        <Empty description="你没有权限操作此页面请找管理员添加权限" />
      );
    }
    return (
      <CoreTabs
        items={items}
        size="large"
      />
    );
  };
  return (
    <div>{renderModalTab()}</div>
  );
};


export default Index;
