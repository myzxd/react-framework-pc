/**
 * 人员管理 - 人员档案 - 员工档案 - search
 */
import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Input,
  Button,
  DatePicker,
  Popconfirm,
} from 'antd';
import {
  CoreSearch,
  CoreContent,
} from '../../../../components/core';
import {
  CommonSelectCompanies,
  CommonTreeSelectDepartments,
  CommonSelectStaffs,
} from '../../../../components/common';
import {
  StaffSate,
  AccountApplyWay,
  ThirdCompanyType,
  ContractState,
  OrganizationStaffsState,
  SignContractType,
  StaffTabKey,
} from '../../../../application/define';
import { system } from '../../../../application';
import Operate from '../../../../application/define/operate';

import ComponentTeam from '../menu/components/codeTeam';
import ComponentTeamType from '../menu/components/codeTeamType';


const { Option } = Select;
const { RangePicker } = DatePicker;

const codeFlag = system.isShowCode(); // 判断是否是code

const Search = ({
  onSearch,
  tabKey,
  dispatch,
}) => {
  // form
  const [form, setForm] = useState({});

  useEffect(() => {
    // 重置表单
    form && form.resetFields && form.setFieldsValue({
      name: undefined,
      phone: undefined,
      identityCardId: undefined,
      state: undefined,
      searchState: undefined,
      signType: undefined,
      applicationChannelId: undefined,
      applicationCompanyName: undefined,
      contractFirstPartyInfo: undefined,
      contractState: undefined,
      department: undefined,
      post: undefined,
      boardDate: null,
      bossMemberId: undefined,
      windControl: undefined,
      codeTeamType: undefined,
      codeTeam: undefined,
      regularDate: null,
      currentEndAtDate: null,
      departureDate: null,
    });
  }, [tabKey]);

  // 获取日期form
  const getDateItem = () => {
    if (tabKey === StaffTabKey.probation) {
      return (
        <Form.Item label="预计转正日期" name="regularDate">
          <RangePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
        </Form.Item>
      );
    }

    if (tabKey === StaffTabKey.renew) {
      return (
        <Form.Item label="合同到期日期" name="currentEndAtDate">
          <RangePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
        </Form.Item>
      );
    }

    if (tabKey === StaffTabKey.resign) {
      return (
        <Form.Item label="离职日期" name="departureDate">
          <RangePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
        </Form.Item>
      );
    }
  };

  // 导出
  const onCreateExportTask = async () => {
    if (form) {
      const values = await form.validateFields();
      dispatch({
        type: 'employeeManage/exportEmployees',
        payload: {
          tabKey,
          fileType: 'staff',
          ...values,
        },
      });
    }
  };

  // 公共select属性
  const commonSelectProps = {
    placeholder: '请选择',
    allowClear: true,
    mode: 'multiple',
    optionFilterProp: 'children',
    showArrow: true,
  };

  // team类型form item
  const teamTypeItem = (
    <Form.Item
      label="TEAM类型"
      name="codeTeamType"
    >
      <ComponentTeamType
        onChange={() => (form && form.setFieldsValue({ codeTeam: undefined }))}
        {...commonSelectProps}
      />
    </Form.Item>
  );

  // team form item
  const teamItem = (
    <Form.Item
      noStyle
      key="codeTeam-wrap"
      shouldUpdate={(preV, curV) => preV.codeTeamType !== curV.codeTeamType}
    >
      {
        ({ getFieldValue }) => {
          const codeTeamType = getFieldValue('codeTeamType');
          return (
            <Form.Item label="TEAM信息" name="codeTeam">
              <ComponentTeam
                namespace="staffSearch"
                codeTeamType={codeTeamType}
                {...commonSelectProps}
              />
            </Form.Item>
          );
        }
      }
    </Form.Item>
  );

  // 全部tab
  const allTabItems = [
    <Form.Item
      label="姓名"
      name="name"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="手机号"
      name="phone"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="身份证号"
      name="identityCardId"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="员工状态"
      name="searchState"
    >
      <Select {...commonSelectProps}>
        <Option
          value={StaffSate.inService}
        >
          {StaffSate.description(StaffSate.inService)}
        </Option>
        <Option
          value={StaffSate.departure}
        >
          {StaffSate.description(StaffSate.departure)}
        </Option>
        <Option
          value={StaffSate.willResign}
        >
          {StaffSate.description(StaffSate.willResign)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="签约类型"
      name="signType"
    >
      <Select
        onChange={() => (form && form.setFieldsValue({ contractFirstPartyInfo: undefined }))}
        {...commonSelectProps}
      >
        <Option
          value={SignContractType.electronic}
        >
          {SignContractType.description(SignContractType.electronic)}
        </Option>
        <Option
          value={SignContractType.paper}
        >
          {SignContractType.description(SignContractType.paper)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="应聘途径"
      name="applicationChannelId"
    >
      <Select
        placeholder="请选择"
        allowClear
        onChange={() => (form && form.setFieldsValue({ applicationCompanyName: undefined }))}
      >
        <Option
          value={AccountApplyWay.company}
        >
          {AccountApplyWay.description(AccountApplyWay.company)}
        </Option>
        <Option
          value={AccountApplyWay.recommend}
        >
          {AccountApplyWay.description(AccountApplyWay.recommend)}
        </Option>
        <Option
          value={AccountApplyWay.apply}
        >
          {AccountApplyWay.description(AccountApplyWay.apply)}
        </Option>
        <Option
          value={AccountApplyWay.transfer}
        >
          {AccountApplyWay.description(AccountApplyWay.transfer)}
        </Option>
        <Option
          value={AccountApplyWay.hr}
        >
          {AccountApplyWay.description(AccountApplyWay.hr)}
        </Option>
        <Option
          value={AccountApplyWay.other}
        >
          {AccountApplyWay.description(AccountApplyWay.other)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      noStyle
      key="applicationCompanyName-wrap"
      shouldUpdate={(preV, curV) => preV.applicationChannelId !== curV.applicationChannelId}
    >
      {
        ({ getFieldValue }) => {
          // 应聘途径
          const applicationChannelId = getFieldValue('applicationChannelId');
          return (
            <Form.Item label="公司名称" name="applicationCompanyName">
              <Input
                disabled={applicationChannelId !== AccountApplyWay.company}
                allowClear
                placeholder="请输入"
              />
            </Form.Item>
          );
        }
      }
    </Form.Item>,
    <Form.Item
      label="合同甲方"
      name="contractFirstPartyInfo"
    >
      <CommonSelectCompanies
        isNoState
        type={ThirdCompanyType.staffProfile}
        {...commonSelectProps}
      />
    </Form.Item>,
    <Form.Item
      label="合同状态"
      name="contractState"
    >
      <Select
        allowClear
        placeholder="请选择"
      >
        <Option
          value={ContractState.uploaded}
        >
          {ContractState.description(ContractState.uploaded)}
        </Option>
        <Option
          value={ContractState.notUpload}
        >
          {ContractState.description(ContractState.notUpload)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="部门"
      name="department"
    >
      <CommonTreeSelectDepartments
        allowClear
        isAuthorized
        placeholder="请选择"
        onChange={() => (form && form.setFieldsValue({ post: undefined }))}
        namespace="staffSearch"
        filterTreeNode={(inV, noV) => !!(inV.trim()
          && noV
          && noV.props
          && noV.props.title.trim().indexOf(inV.trim()) !== -1)}
        isAuth={Operate.canOperateEmployeeAbolishDepartment()}
      />
    </Form.Item>,
    <Form.Item
      noStyle
      key="post-wrap"
      shouldUpdate={(preV, curV) => preV.department !== curV.department}
    >
      {
        ({ getFieldValue }) => {
          // 部门
          const department = getFieldValue('department');
          return (
            <Form.Item label="岗位" name="post">
              <CommonSelectStaffs
                allowClear
                placeholder="请选择"
                departmentId={department}
                namespace="staffSearch"
                state={OrganizationStaffsState.enable}
              />
            </Form.Item>
          );
        }
      }
    </Form.Item>,
    <Form.Item
      label="入职日期"
      name="boardDate"
    >
      <RangePicker style={{ width: '100%' }} format={'YYYY-MM-DD'} />
    </Form.Item>,
    <Form.Item
      label="BOSS人员ID"
      name="bossMemberId"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="风控检测状态"
      name="windControl"
    >
      <Select
        placeholder="请选择"
        allowClear
      >
        <Option
          value={false}
          style={{ color: 'green' }}
        >通过</Option>
        <Option
          value
          style={{ color: 'red' }}
        >
          未通过
        </Option>
      </Select>
    </Form.Item>,
  ];

  // 判断是否是code系统
  if (codeFlag) {
    allTabItems[allTabItems.length] = teamTypeItem;
    allTabItems[allTabItems.length] = teamItem;
  }

  // 其他tab
  const otherTabItems = [
    <Form.Item
      label="姓名"
      name="name"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="手机号"
      name="phone"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    <Form.Item
      label="身份证号"
      name="identityCardId"
    >
      <Input placeholder="请输入" allowClear />
    </Form.Item>,
    getDateItem(),
    teamTypeItem,
    teamItem,
    <Form.Item
      label="部门"
      name="department"
    >
      <CommonTreeSelectDepartments
        allowClear
        isAuthorized
        placeholder="请选择"
        onChange={() => (form && form.setFieldsValue({ post: undefined }))}
        namespace="staffSearch"
        filterTreeNode={(inV, noV) => !!(inV.trim()
          && noV
          && noV.props
          && noV.props.title.trim().indexOf(inV.trim()) !== -1)}
        isAuth={Operate.canOperateEmployeeAbolishDepartment()}
      />
    </Form.Item>,
    <Form.Item
      noStyle
      key="post-wrap"
    >
      {
        ({ getFieldValue }) => {
          // 部门
          const department = getFieldValue('department');
          return (
            <Form.Item label="岗位" name="post">
              <CommonSelectStaffs
                allowClear
                placeholder="请选择"
                departmentId={department}
                namespace="staffSearch"
                state={OrganizationStaffsState.enable}
              />
            </Form.Item>
          );
        }
      }
    </Form.Item>,
  ];


  // 扩展操作（导出）
  const operations = Operate.canOperateEmployeeSearchExportExcel() ?
    (
      <Popconfirm
        title="创建下载任务？"
        onConfirm={() => onCreateExportTask()}
        okText="确认"
        cancelText="取消"
      >
        <Button
          type="primary"
        >导出EXCEL</Button>
      </Popconfirm>
    ) : null;

  const sProps = {
    items: tabKey === StaffTabKey.all ? allTabItems : otherTabItems,
    operations,
    onSearch,
    onReset: onSearch,
    onHookForm: hForm => setForm(hForm),
  };

  return (
    <CoreContent className="affairs-flow-basic">
      <CoreSearch {...sProps} />
    </CoreContent>
  );
};

export default Search;
