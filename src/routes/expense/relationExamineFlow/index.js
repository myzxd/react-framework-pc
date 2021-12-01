/*
* 关联审批流
*/
import React, { useState, useEffect } from 'react';
import { Empty } from 'antd';

import { CoreTabs } from '../../../components/core';
import { RelationExamineFlowTabType } from '../../../application/define';
import RelationExamineFlowCodeTeam from './codeTeam';
import RelationExamineFlowAffair from './affair';
import RelationExamineFlowCost from './cost';
import RelationExamineFlowNoCost from './noCost';
import Operate from '../../../application/define/operate';

function RelationExamineFlow(props) {
  const { location: { query } } = props;
  const [activeKey, setActiveKey] = useState(query.activeKey);
  useEffect(() => {
    // 判断code/team审批流权限
    if ((!query.activeKey || Number(query.activeKey) === RelationExamineFlowTabType.codeTeam)
      && Operate.canOperateExpenseRelationExamineFlowCodeTeam()) {
      setActiveKey(`${RelationExamineFlowTabType.codeTeam}`);
      return;
    }
    // 判断事务审批流权限
    if ((!query.activeKey || Number(query.activeKey) === RelationExamineFlowTabType.affair)
      && Operate.canOperateExpenseRelationExamineFlowAffair()) {
      setActiveKey(`${RelationExamineFlowTabType.affair}`);
      return;
    }
    // 判断成本类审批流权限
    if ((!query.activeKey || Number(query.activeKey) === RelationExamineFlowTabType.cost)
      && Operate.canOperateExpenseRelationExamineFlowCost()) {
      setActiveKey(`${RelationExamineFlowTabType.cost}`);
      return;
    }
    // 判断非成本审批流权限
    if ((!query.activeKey || Number(query.activeKey) === RelationExamineFlowTabType.noCost)
      && Operate.canOperateExpenseRelationExamineFlowNoCost()) {
      setActiveKey(`${RelationExamineFlowTabType.noCost}`);
    }
  }, [query]);

  // 渲染tab
  const renderTab = () => {
    const items = [];
    // 判断code/team审批流权限
    if (Operate.canOperateExpenseRelationExamineFlowCodeTeam()) {
      items.push(
        {
          title: 'code/team审批流',
          key: `${RelationExamineFlowTabType.codeTeam}`,
        },
      );
    }
    // 判断事务审批流权限
    if (Operate.canOperateExpenseRelationExamineFlowAffair()) {
      items.push(
        {
          title: '事务审批流',
          key: `${RelationExamineFlowTabType.affair}`,
        },
      );
    }
    // 判断成本类审批流权限
    if (Operate.canOperateExpenseRelationExamineFlowCost()) {
      items.push(
        {
          title: '成本类审批流',
          key: `${RelationExamineFlowTabType.cost}`,
        },
      );
    }
    // 判断非成本审批流权限
    if (Operate.canOperateExpenseRelationExamineFlowNoCost()) {
      items.push(
        {
          title: '非成本类审批流',
          key: `${RelationExamineFlowTabType.noCost}`,
        },
      );
    }
    // 判断是否为空
    if (items.length === 0) {
      return <Empty />;
    }
    return (
      <CoreTabs
        items={items}
        type="card"
        activeKey={activeKey}
        onChange={setActiveKey}
      />
    );
  };

  // 渲染内容
  const renderContent = () => {
    // code/team审批流
    if (Number(activeKey) === RelationExamineFlowTabType.codeTeam) {
      return <RelationExamineFlowCodeTeam />;
    }
    // 事务审批流
    if (Number(activeKey) === RelationExamineFlowTabType.affair) {
      return <RelationExamineFlowAffair />;
    }
    // 成本类审批流
    if (Number(activeKey) === RelationExamineFlowTabType.cost) {
      return <RelationExamineFlowCost />;
    }
    // 非成本类审批流
    if (Number(activeKey) === RelationExamineFlowTabType.noCost) {
      return <RelationExamineFlowNoCost />;
    }
  };

  return (
    <React.Fragment>
      {/* 渲染tab */}
      {renderTab()}
      {/* 渲染内容 */}
      {renderContent()}
    </React.Fragment>
  );
}
export default RelationExamineFlow;
