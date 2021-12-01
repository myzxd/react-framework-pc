/**
 * 员工档案 - 劳动者详情
 */
import React from 'react';
import {
  Tabs,
} from 'antd';
import {
  LaborerPageSetp,
} from '../../../../../../application/define';
import {
  system,
} from '../../../../../../application';

import BasicInfo from './basicInfo';
import WorkInfo from './workInfo';
import CostCenterInfo from './costCenterInfo';
import ContractInfo from './contractInfo';

const { TabPane } = Tabs;

const LadorerDetail = ({
  employeeDetail, // 员工详情
}) => {
  // 返回档案列表页
  const onBack = () => {
    window.location.href = '/#/Employee/Manage?fileType=second';
  };

  const props = {
    employeeDetail,
    onBack,
  };

  return (
    <div
      style={{ height: '100%' }}
      className="contract-content-wrap"
    >
      <Tabs
        style={{ background: '#fff', height: '100%' }}
      >
        <TabPane
          tab="劳动者基础信息"
          key={LaborerPageSetp.basic}
        >
          <BasicInfo {...props} />
        </TabPane>
        {
          system.isShowCode && employeeDetail.is_tab && (
            <TabPane
              tab="TEAM成本中心"
              key={LaborerPageSetp.costCenter}
            >
              <CostCenterInfo {...props} />
            </TabPane>
          )
        }
        <TabPane
          tab="系统信息"
          key={LaborerPageSetp.work}
        >
          <WorkInfo {...props} />
        </TabPane>
        <TabPane
          tab="合同信息"
          key={LaborerPageSetp.contract}
        >
          <ContractInfo {...props} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default LadorerDetail;
