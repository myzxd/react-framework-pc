/**
 * 员工档案 - 新建档案
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useRef, useState, useEffect } from 'react';
import {
  Tabs,
  Spin,
  message,
} from 'antd';
import {
  LaborerPageSetp,
} from '../../../../../../application/define';
import {
  system,
} from '../../../../../../application';

import BasicForm from './basicForm';
import CostCenterForm from './costCenterForm';
import WorkInfo from '../detail/workInfo';
import ContractInfo from '../detail/contractInfo';
import onResetForm from './resetLaborer.js';

const { TabPane } = Tabs;

const Create = ({
  dispatch,
  departments, // 部门树
  employeeDetail = {}, // 员工档案
  location,
}) => {
  // 劳动者基础信息form
  const basicFormRef = useRef();
  // TEAM成本中心form
  const costCenterFormRef = useRef();
  // 劳动者id
  const laborerId = dot.get(location, 'query.id');

  // tab key
  const [tabKey, setTabKey] = useState(LaborerPageSetp.basic);
  // loading
  const [isLoading, setIsLoading] = useState(laborerId ? true : false);

  useEffect(() => {
    // 获取部门树
    dispatch({
      type: 'applicationCommon/fetchDepartments',
    });

    return () => {
      dispatch({
        type: 'employeeManage/reduceEmployeeDetail',
        payload: {},
      });
    };
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(employeeDetail).length > 0) {
      setIsLoading(false);
    }
  }, [employeeDetail]);

  // 保存
  const onSave = async (values) => {
    const res = await dispatch({
      type: 'employeeManage/updateLaborerFile',
      payload: {
        _id: laborerId,
        tab_type: Number(tabKey),
        data: { ...values },
      },
    });
    // 抛错
    if (res && res.zh_message) {
      return message.error(res.zh_message);
    }

    if (res && res.ok) {
      // 获取劳动者详情
      await dispatch({
        type: 'employeeManage/fetchEmployeeDetail',
        payload: {
          employeeId: laborerId,
          fileType: 'second',
        },
      });

      if (res && res.record) {
        onResetForm(res.record, { basicFormRef, costCenterFormRef });
      }
      message.success('请求成功');
    }
  };

  // 返回档案列表页
  const onBack = () => {
    window.location.href = '/#/Employee/Manage?fileType=second';
  };

  const props = {
    setTabKey,
    onSave,
    departmentTree: departments,
    employeeDetail,
    onBack,
  };

  // loading页
  const renderLoading = () => {
    if (isLoading) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'rgba(0, 0, 0, .1)',
          }}
        >
          <Spin tip="Loading..." />
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ background: '#F3F3F3', height: '100%' }}>
      {renderLoading()}
      {
        !isLoading && (
          <div
            style={{ height: '100%' }}
            className="contract-content-wrap"
          >
            <Tabs
              activeKey={tabKey}
              onChange={val => setTabKey(val)}
              style={{ background: '#fff', height: '100%' }}
            >
              <TabPane
                tab="劳动者基础信息"
                key={LaborerPageSetp.basic}
              >
                <BasicForm
                  ref={basicFormRef}
                  {...props}
                />
              </TabPane>
              {
                system.isShowCode && employeeDetail.is_tab && (
                  <TabPane
                    tab="TEAM成本中心"
                    key={LaborerPageSetp.costCenter}
                  >
                    <CostCenterForm
                      ref={costCenterFormRef}
                      {...props}
                    />
                  </TabPane>
                )
              }
              <TabPane
                tab="系统信息"
                key={LaborerPageSetp.work}
              >
                <WorkInfo
                  {...props}
                />
              </TabPane>
              <TabPane
                tab="合同信息"
                key={LaborerPageSetp.contract}
              >
                <ContractInfo
                  {...props}
                />
              </TabPane>
            </Tabs>
          </div>
        )
      }
    </div>
  );
};

const mapStateToProps = (
  {
    society: { staffSocietyPlanList, staffFundPlanList },
    applicationCommon: { departments },
    employeeManage: { employeeDetail },
  },
) => {
  return {
    staffSocietyPlanList,
    staffFundPlanList,
    departments,
    employeeDetail,
  };
};

export default connect(mapStateToProps)(Create);
