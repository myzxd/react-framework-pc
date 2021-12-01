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
  EmployeePageSetp,
} from '../../../../../../application/define';
import {
  system,
} from '../../../../../../application';

import BasicForm from './basicForm';
import WorkForm from './workForm';
import ContractForm from './contractForm';
import CareerForm from './careerForm';
import WelfareForm from './welfareForm';
import CostCenterForm from './costCenterForm';

import onResetStaff from './resetStaff.js';

const { TabPane } = Tabs;

const Create = ({
  dispatch,
  staffSocietyPlanList, // 社保参保数据
  staffFundPlanList, // 公积金参保数据
  departments, // 部门树
  employeeDetail = {}, // 员工档案
  location = {},
  newContractInfo = {},
}) => {
  // 员工基础信息
  const basicFormRef = useRef();
  // 系统信息
  const workFormRef = useRef();
  // TEAM成本中心
  const costCenterFormRef = useRef();
  // 合同信息
  const contractFormRef = useRef();
  // 福利信息
  const welfareFormRef = useRef();
  // 职业生涯
  const careerFormRef = useRef();

  // 员工id
  const employeeId = dot.get(location, 'query.id');
  // 部门id
  const departmentId = dot.get(location, 'query.departmentId', undefined);
  // 部门name
  const departmentName = dot.get(location, 'query.departmentName', undefined);

  // 创建页默认tab key
  const initCreateTabKeys = [EmployeePageSetp.basic];
  // 编辑页默认tab key
  const initUpdateTabKeys = [
    EmployeePageSetp.basic,
    EmployeePageSetp.work,
    EmployeePageSetp.contract,
    EmployeePageSetp.career,
    EmployeePageSetp.welfare,
    EmployeePageSetp.costCenter,
  ];

  // 可操作tab key
  const [tabKeys, setTabKeys] = useState(employeeId ? initUpdateTabKeys : initCreateTabKeys);
  // 当前选中的tab key
  const [tabKey, setTabKey] = useState(EmployeePageSetp.basic);
  // loading
  const [isLoading, setIsLoading] = useState(employeeId ? true : false);

  // 特殊处理字段
  const [specialFields, setSpecialFields] = useState(undefined);

  useEffect(() => {
    // 获取部门树
    dispatch({
      type: 'applicationCommon/fetchDepartments',
      payload: { isAuthorized: true },
    });

    return () => {
      dispatch({
        type: 'employeeManage/reduceEmployeeDetail',
        payload: {},
      });

      dispatch({
        type: 'fileChange/resetNewContractInfo',
        payload: {},
      });
    };
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(employeeDetail).length > 0) {
      setIsLoading(false);
    }
  }, [employeeDetail]);

  useEffect(() => {
    employeeDetail.identity_card_id && dispatch({
      type: 'fileChange/fetchNewContractInfo',
      payload: {
        id: employeeDetail.identity_card_id,
      },
    });
  }, [dispatch, employeeDetail]);

  // 跳转到组织架构
  const goOrganization = () => {
    if (window.opener) {
      window.opener.location.reload();
      window.close();
    }
  };

  // 返回档案列表页
  const onBack = () => {
    window.location.href = '/#/Employee/Manage?fileType=staff';
  };

  // 切换tab
  const onChangeTabs = (val) => {
    // 编辑页可直接切换
    if (employeeId) return setTabKey(val);

    // 创建页，需要校验当前tab下form
    let curForm;
    switch (tabKey) {
      case EmployeePageSetp.basic:
        curForm = basicFormRef;
        break;
      case EmployeePageSetp.work:
        curForm = workFormRef;
        break;
      case EmployeePageSetp.contract:
        curForm = contractFormRef;
        break;
      case EmployeePageSetp.career:
        curForm = careerFormRef;
        break;
      case EmployeePageSetp.welfare:
        curForm = welfareFormRef;
        break;
      case EmployeePageSetp.costCenter:
        curForm = costCenterFormRef;
        break;
      default: curForm = basicFormRef;
    }

    // 创建页，切换tab时
    if (curForm && tabKey !== val) {
      curForm.current.validateFields().then(() => {
        setTabKey(val);
      }).catch((error) => {
        curForm.current.scrollToField(
          error.errorFields[0].name,
          {
            behavior: actions => actions.forEach(({ el, top }) => {
              // eslint-disable-next-line no-param-reassign
              el.scrollTop = top - 5;
            }),
          },
        );
      });
    }
  };

  // tab onChnage
  const onChangeTabKeys = (val) => {
    const curTabKeys = tabKeys.includes(val) ? tabKeys : [...tabKeys, val];
    setTabKeys(curTabKeys);
  };

  // 创建提交
  const onSubmit = async () => {
    const basicValues = await basicFormRef.current.validateFields();
    const workValues = await workFormRef.current.validateFields();
    const costCenterValues = (costCenterFormRef && costCenterFormRef.current) ?
      await costCenterFormRef.current.validateFields()
      : {};
    const contractValues = await contractFormRef.current.validateFields();
    const welfareValues = await welfareFormRef.current.validateFields();
    const careerValues = await careerFormRef.current.validateFields();

    const res = await dispatch({
      type: 'employeeManage/createEmployeeFile',
      payload: {
        ...basicValues,
        ...workValues,
        ...costCenterValues,
        ...contractValues,
        ...welfareValues,
        ...careerValues,
      },
    });

    // 抛错
    if (res && res.zh_message) {
      return message.error(res.zh_message);
    }

    if (res && res.ok && res.record) {
      // 同步创建员工合同接口
      const contractRes = await dispatch({
        type: 'employeeManage/createEmployeeContract',
        payload: {
          identity_card_id: res.record.identity_card_id,
          contract_no: res.record.contract_no,
          name: res.record.name,
          phone: res.record.phone,
          entry_date: res.record.entry_date, // 入职日期
          ...contractValues,
        },
      });

      if (contractRes && contractRes.zh_message) {
        return message.error(contractRes.zh_message);
      }

      // 成功
      if (contractRes && contractRes.ok) {
        message.success('请求成功');

        // 跳转到组织架构
        if (departmentId && departmentName) {
          goOrganization();
        } else {
          // 返回档案列表页
          window.location.href = '/#/Employee/Manage?fileType=staff';
        }
      }
    }
  };

  // 编辑保存
  const onSave = async (values = {}) => {
    const res = await dispatch({
      type: 'employeeManage/updateEmployeeFile',
      payload: {
        _id: employeeId,
        tab_type: Number(tabKey),
        data: { ...values },
      },
    });

    // 抛错
    if (res && res.zh_message) {
      return message.error(res.zh_message);
    }

    if (res && res.ok) {
      // 跳转到组织架构
      if (departmentId && departmentName) {
        message.success('请求成功');
        goOrganization();
        return;
      }
      // 合同信息，需要同步更新员工合同接口
      if (tabKey === EmployeePageSetp.contract) {
        const contractParams = {
          name: employeeDetail.name,
          phone: employeeDetail.phone,
          identity_card_id: employeeDetail.identity_card_id,
          entry_date: employeeDetail.entry_date, // 入职日期
          ...values,
        };
        const contractRes = await dispatch({
          type: 'employeeManage/updateEmployeeContract',
          payload: {
            _id: employeeId,
            ...contractParams,
          },
        });

        if (contractRes && contractRes.ok) {
          message.success('请求成功');
          // 获取员工档案接口（包括合同接口）
          await dispatch({
            type: 'employeeManage/fetchEmployeeDetail',
            payload: {
              employeeId,
              fileType: 'staff',
            },
          });
        }
      } else {
        message.success('请求成功');
        // 获取员工详情
        await dispatch({
          type: 'employeeManage/fetchEmployeeDetail',
          payload: {
            employeeId,
            fileType: 'staff',
          },
        });
      }
    }
  };

  // 二次入职，设置表单
  const onSetStaff = (res) => {
    // 重置特殊处理字段对象
    setSpecialFields({
      ...specialFields,
      ...res,
    });

    onResetStaff(res, {
      basicFormRef,
      workFormRef,
      costCenterFormRef,
      contractFormRef,
      welfareFormRef,
      careerFormRef,
    });
  };

  const props = {
    onChangeTabKeys,
    setTabKey,
    onSubmit,
    departmentTree: departments,
    employeeDetail,
    dispatch,
    employeeId,
    onSave,
    onResetStaff: onSetStaff,
    newContractInfo,
    onBack,
    contractFormRef,
    setSpecialFields,
    specialFields,
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
    <div
      style={{ background: '#F3F3F3', height: '100%' }}
      className="contract-content-wrap"
    >
      {renderLoading()}
      {
        !isLoading && (
          <div
            style={{ height: '100%' }}
            className="contract-content-wrap"
          >
            <Tabs
              activeKey={tabKey}
              onChange={onChangeTabs}
              style={{ background: '#fff', height: '100%' }}
            >
              <TabPane
                tab="员工基础信息"
                key={EmployeePageSetp.basic}
                forceRender
                disabled={!tabKeys.includes(EmployeePageSetp.basic)}
              >
                <BasicForm
                  ref={basicFormRef}
                  {...props}
                />
              </TabPane>
              <TabPane
                tab="系统信息"
                key={EmployeePageSetp.work}
                forceRender
                disabled={!tabKeys.includes(EmployeePageSetp.work)}
              >
                <WorkForm
                  ref={workFormRef}
                  departments={departments}
                  {...props}
                />
              </TabPane>
              <TabPane
                tab="合同信息"
                key={EmployeePageSetp.contract}
                forceRender
                disabled={!tabKeys.includes(EmployeePageSetp.contract)}
              >
                <ContractForm
                  ref={contractFormRef}
                  {...props}
                />
              </TabPane>
              <TabPane
                tab="职业生涯"
                key={EmployeePageSetp.career}
                forceRender
                disabled={!tabKeys.includes(EmployeePageSetp.career)}
              >
                <CareerForm
                  ref={careerFormRef}
                  setTabKey={setTabKey}
                  {...props}
                />
              </TabPane>
              <TabPane
                tab="福利信息"
                key={EmployeePageSetp.welfare}
                forceRender
                disabled={!tabKeys.includes(EmployeePageSetp.welfare)}
              >
                <WelfareForm
                  ref={welfareFormRef}
                  staffFundPlanList={staffFundPlanList}
                  staffSocietyPlanList={staffSocietyPlanList}
                  {...props}
                />
              </TabPane>
              {
                // code系统，才有TEAM成本中心
                system.isShowCode() && (
                  <TabPane
                    tab="TEAM成本中心"
                    key={EmployeePageSetp.costCenter}
                    forceRender
                    disabled={!tabKeys.includes(EmployeePageSetp.costCenter)}
                  >
                    <CostCenterForm
                      ref={costCenterFormRef}
                      {...props}
                    />
                  </TabPane>
                )
              }
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
    fileChange: { newContractInfo },
  },
) => {
  return {
    staffSocietyPlanList,
    staffFundPlanList,
    departments,
    employeeDetail,
    newContractInfo,
  };
};

export default connect(mapStateToProps)(Create);
