/**
 * 审批单详情页 - 外部审批单据组件 Expense/Manage/ExamineOrder/Detail
 */
import is from 'is_js';
import React, { useState } from 'react';
import {
  Collapse,
} from 'antd';
import { CoreContent } from '../../../../../../components/core';
import {
  OaApplicationOrderType,
} from '../../../../../../application/define';
import CostOrderItem from '../costOrderItem';   // 费用申请
import RepaymentsInfo from '../repaymentsInfo'; // 还款
import BorrowingInfo from '../borrowingInfo'; // 借款信息
import BusinessInfo from '../business';         // 出差详情信息
import OverTime from './overTime'; // 加班
import TakeLeaveInfo from '../takeLeaveInfo'; // 请假
import TravelInfo from '../travel';           // 差旅报销详情

import styles from '../style.less';

const Panel = Collapse.Panel;

const ExternalApprove = ({
  examineOrderDetail = {}, // 审批单详情
  location = {},
  examineDetail = {}, // 审批流详情
}) => {
  const [activeKey, setActiveKey] = useState([]);

  const {
    costOrderList = [], // 费用单list
    applicationOrderType, // 审批单类型
    repaymentOrderList = [], // 还款
    oaExtraWorkOrderInfo = {}, // 加班详情
    oaLeaveOrderInfo, // 请假单详情
    pluginExtraMeta = {},
    businessTravelOrderInfo = {}, // 出差
    loanOrderList = [], // 借款单id
  } = examineOrderDetail;

  // 是否为外部审批单
  let isPluginOrder = false;
  if (is.existy(pluginExtraMeta)) {
    isPluginOrder = pluginExtraMeta.is_plugin_order;
  }

  // 审批单数据为空
  if (Object.keys(examineOrderDetail).length <= 0 || !isPluginOrder) return <div />;

  // 折叠面板的onChange
  const onChangePanel = (key) => {
    setActiveKey([...key]);
  };

  // 费用申请展开/收起全部
  const onChangeCollapse = () => {
    // 定义需要更新的折叠面板key
    const key = [];
    // 判断，如果当前折叠面板没有全部打开，那么更新key为全部值(此时，按钮显示为 全部打开)
    if (activeKey.length !== costOrderList.length) {
      costOrderList.forEach((item) => {
        key[key.length] = item.id;
      });
    }
    // 否则，折叠面板key数组置为空(此时，按钮显示为 全部收起)
    setActiveKey([...key]);
  };

  // 根据审批单类型，获取对应组件
  const getComponent = () => {
    switch (applicationOrderType) {
      case OaApplicationOrderType.cost: return getCostComponent();
      case OaApplicationOrderType.housing: return getCostComponent();
      case OaApplicationOrderType.borrowing: return getBorrowComponent();
      case OaApplicationOrderType.repayments: return getRepaymentComponent();
      case OaApplicationOrderType.business: return getBusinessComponent();
      case OaApplicationOrderType.overTime: return getOverTimeComponent();
      case OaApplicationOrderType.takeLeave: return getTakeLeaveComponent();
      case OaApplicationOrderType.travel: return getTravelComponent();
      default: return <div />;
    }
  };

  // 差旅报销
  const getTravelComponent = () => {
    return (
      <CoreContent key="travel" title="费用单">
        <Collapse bordered={false} activeKey={activeKey} onChange={onChangePanel}>
          {
            costOrderList.map((costOrder, costOrderIndex) => {
              // 定义折叠面板每项的header
              const header = `费用单号: ${costOrder.id}`;
              return (
                <Panel header={header} key={`${costOrderIndex}`}>
                  <TravelInfo
                    location={location}
                    recordId={costOrder.id}
                    examineOrderDetail={examineOrderDetail}
                    examineDetail={examineDetail}
                    pluginCostOrder={costOrder}
                    isExternal={isPluginOrder}
                  />
                </Panel>
              );
            })
          }
        </Collapse>
      </CoreContent>
    );
  };

  // 出差详情
  const getBusinessComponent = () => {
    return (
      <BusinessInfo businessDetail={[businessTravelOrderInfo]} />
    );
  };

  // 费用申请
  const getCostComponent = () => {
    if ((Array.isArray(costOrderList) && costOrderList.length <= 0) || !costOrderList) return <div />;

    // 定义扩展操作
    const ext = (
      <span
        onClick={onChangeCollapse}
        className={styles['app-comp-expense-detail-order-info-ext']}
      >
        {/* 判断显示文本，如果折叠面板全部展开，则显示 全部收起，否则显示 全部展开 */}
        {activeKey.length !== costOrderList.length ? '全部展开' : '全部收起'}
      </span>);

    return (
      <CoreContent title="费用单" titleExt={ext}>
        <Collapse bordered={false} activeKey={activeKey} onChange={onChangePanel}>
          {
            costOrderList.map((order) => {
              const { id } = order;
              // 定义折叠面板每项的header
              const header = `费用单号: ${id}`;
              return (
                <Panel header={header} key={id}>
                  <CostOrderItem
                    location={location}
                    recordId={id}
                    examineOrderDetail={examineOrderDetail}
                    examineDetail={examineDetail}
                    isExternal={isPluginOrder}
                  />
                </Panel>
              );
            })
          }
        </Collapse>
      </CoreContent>
    );
  };

  // 借款
  const getBorrowComponent = () => {
    if (!loanOrderList || (Array.isArray(loanOrderList) && loanOrderList.length <= 0)) return <div />;

    const ids = loanOrderList.map(i => i._id);

    return (
      <BorrowingInfo
        orderIds={ids}
        pluginExtraMeta={pluginExtraMeta}
        loanOrderList={loanOrderList}
      />
    );
  };

  // 还款
  const getRepaymentComponent = () => {
    if (!repaymentOrderList || (Array.isArray(repaymentOrderList) && repaymentOrderList.length <= 0)) return <div />;

    const ids = repaymentOrderList.map(i => i._id);

    return (
      <RepaymentsInfo
        orderIds={ids}
        isExternal={isPluginOrder}
        externalData={repaymentOrderList}
      />
    );
  };

  // 加班
  const getOverTimeComponent = () => {
    if (!oaExtraWorkOrderInfo || Object.keys(oaExtraWorkOrderInfo).length <= 0) return <div />;

    return (
      <OverTime
        isExternal={isPluginOrder}
        examineOrderDetail={examineOrderDetail}
      />
    );
  };

  // 请假
  const getTakeLeaveComponent = () => {
    if (!oaLeaveOrderInfo || Object.keys(oaLeaveOrderInfo).length <= 0) return <div />;
    const { _id: id } = oaLeaveOrderInfo;

    return (
      <TakeLeaveInfo
        isExternal={isPluginOrder}
        extraWorkOrLeaveId={id}
      />
    );
  };
  return getComponent();
};

export default ExternalApprove;
