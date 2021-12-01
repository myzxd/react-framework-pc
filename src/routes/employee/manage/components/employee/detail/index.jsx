/**
 * 员工档案 - 员工详情
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Tabs,
} from 'antd';
import {
  EmployeePageSetp,
} from '../../../../../../application/define';

import BasicInfo from './basicInfo';
import WorkInfo from './workInfo';
import CostCenterInfo from './costCenterInfo';
import ContractInfo from './contractInfo';
import WelfareInfo from './welfareInfo';
import CareerInfo from './careerInfo';

const { TabPane } = Tabs;

const EmployeeDetail = ({
  employeeDetail, // 员工详情
  dispatch,
  newContractInfo = {},
}) => {
  const {
    identity_card_id: identityCardId,
  } = employeeDetail;

  useEffect(() => {
    return () => {
      dispatch({
        type: 'employeeManage/reduceEmployeeDetail',
        payload: {},
      });
    };
  }, [dispatch]);

  useEffect(() => {
    identityCardId && dispatch({
      type: 'fileChange/fetchNewContractInfo',
      payload: {
        id: identityCardId,
      },
    });

    return () => {
      // 重置合同
      dispatch({
        type: 'fileChange/resetNewContractInfo',
        payload: {},
      });
    };
  }, [dispatch, identityCardId]);

  // 返回档案列表页
  const onBack = () => {
    window.location.href = '/#/Employee/Manage?fileType=staff';
  };

  const props = {
    employeeDetail,
    onBack,
    newContractInfo,
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
          tab="员工基础信息"
          key={EmployeePageSetp.basic}
        >
          <BasicInfo {...props} />
        </TabPane>
        <TabPane
          tab="系统信息"
          key={EmployeePageSetp.work}
        >
          <WorkInfo {...props} />
        </TabPane>
        <TabPane
          tab="合同信息"
          key={EmployeePageSetp.contract}
        >
          <ContractInfo {...props} />
        </TabPane>
        <TabPane
          tab="职业生涯"
          key={EmployeePageSetp.career}
        >
          <CareerInfo {...props} />
        </TabPane>
        <TabPane
          tab="福利信息"
          key={EmployeePageSetp.welfare}
        >
          <WelfareInfo {...props} />
        </TabPane>
        <TabPane
          tab="TEAM成本中心"
          key={EmployeePageSetp.costCenter}
        >
          <CostCenterInfo {...props} />
        </TabPane>
      </Tabs>
    </div>
  );
};

const mapStateToProps = (
  {
    fileChange: { newContractInfo },
  },
) => {
  return {
    newContractInfo,
  };
};

export default connect(mapStateToProps)(EmployeeDetail);
