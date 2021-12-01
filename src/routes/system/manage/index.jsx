/**
 * 合同归属管理
 */
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';

import {
  CoreTabs,
} from '../../../components/core';
import {
  ContractAttributionType,
  ThirdCompanyState,
} from '../../../application/define';

import Laborer from './company/index';
import Employee from './employee/index';

const ContractAttribution = ({
  dispatch,
}) => {
  const [tabKey, setTabKey] = useState(ContractAttributionType.laborder);
  useEffect(() => {
    dispatch({
      type: 'systemManage/fetchCompanies',
      payload: {
        type: Number(tabKey),
        state: ThirdCompanyState.on, // 状态
      },
    });
  }, [tabKey, dispatch]);


  const renderTab = () => {
    // tab items
    const tabItems = [
      // 劳动者合同甲方
      {
        title: ContractAttributionType.description(ContractAttributionType.laborder),
        key: ContractAttributionType.laborder,
      },
      // 员工合同甲方
      {
        title: ContractAttributionType.description(ContractAttributionType.employee),
        key: ContractAttributionType.employee,
      },
    ];
    return (
      <CoreTabs
        items={tabItems}
        onChange={val => setTabKey(val)}
      />
    );
  };

  const renderContent = () => {
    if (Number(tabKey) === ContractAttributionType.laborder) {
      return <Laborer tabKey={tabKey} />;
    }
    if (Number(tabKey) === ContractAttributionType.employee) {
      return <Employee tabKey={tabKey} />;
    }
    return null;
  };

  return (
    <React.Fragment>
      {renderTab()}
      {renderContent()}
    </React.Fragment>
  );
};

export default connect()(ContractAttribution);
