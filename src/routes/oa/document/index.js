/**
 * 发起申请 /OA/Document
 * */
import React, { useState } from 'react';
import { Alert } from 'antd';

import { CoreTabs } from '../../../components/core';

// import OADocumentManageComponents from './oaComponents.jsx';
import ExpenseDocumentManageComponents from './expenseComponents.jsx';
import {
  canModuleExpenseManageHouse,
  canOperateExpenseManageCreate,
} from '../../../application/define/operate';

const Index = () => {
  const defaultActiveKey = canOperateExpenseManageCreate() ? '费控申请' : '事务申请';
  const [activeKey, onChangeActiveKey] = useState(defaultActiveKey);
  // 渲染tab
  const renderModalTab = () => {
    const items = [
      // {
        // title: '事务申请',
        // content: <OADocumentManageComponents />,
        // key: '事务申请',
      // },
    ];
    // 判断是否有新建页面的权限
    if (canOperateExpenseManageCreate()) {
      items.unshift(
        {
          title: '费控申请',
          content: <ExpenseDocumentManageComponents />,
          key: '费控申请',
        },
      );
    }
    let operations;
    // 判断是否有房屋管理页面权限
    if (canModuleExpenseManageHouse() && activeKey === '费控申请') {
      operations = (
        <Alert
          style={{ width: 500 }}
          message={<div
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <span>房屋相关的申请到【房屋管理】中提报</span> <a
              style={{ color: '#ff9429' }}
              rel="noopener noreferrer"
              target="_blank"
              href="/#/Expense/Manage/House"
            >进入房屋管理</a>
          </div>}
          type="warning"
          showIcon
        />
      );
    }
    // 事务申请tab下提示&有费控申请的权限
    if (canOperateExpenseManageCreate() && activeKey === '事务申请') {
      operations = (
        <Alert
          style={{ width: 500 }}
          message={<div
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <span>出差申请暂时需要到【费控申请】中提报</span> <span
              style={{ color: '#ff9429', cursor: 'pointer' }}
              onClick={() => onChangeActiveKey('费控申请')}
            >进入出差管理</span>
          </div>}
          type="warning"
          showIcon
        />
      );
    }
    return (
      <CoreTabs
        onChange={(key) => {
          onChangeActiveKey(key);
        }}
        items={items}
        operations={operations}
        activeKey={activeKey}
      />
    );
  };
  return (
    <div>{renderModalTab()}</div>
  );
};


export default Index;
