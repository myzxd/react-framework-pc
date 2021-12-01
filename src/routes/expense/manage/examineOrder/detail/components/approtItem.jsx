/**
 * 红冲分摊弹窗 - item
 **/
import React, { useState, useRef } from 'react';

import {
  Form,
  Select,
} from 'antd';
import {
  CommonSelectPlatforms,
  CommonSelectSuppliers,
  CommonSelectCities,
  CommonSelectDistricts,
  CommonSelectTeamId,
} from '../../../../../../components/common';

import { ExpenseTeamType, ExpenseCostCenterType } from '../../../../../../application/define';
import { CoreForm } from '../../../../../../components/core';
import { cryptoRandomString } from '../../../../../../application/utils';
import DepartmentJobs from '../../../common/departmentJobs';
import SelectStaff from './staff';

const Option = Select.Option;

// 显示的项目
const CommonItemsType = {
  platform: 'platform',   // 平台
  supplier: 'supplier',       // 供应商
  city: 'city',           // 城市
  district: 'district',   // 商圈
};

const RedPunchApportItem = ({ form, field, config = {}, costCenterType }) => {
  const intervalRef = useRef(cryptoRandomString(32));
  const { key: currentKey = 0 } = field;
  const teamTypeList = [10, 20, 30, 40, 50];

  const [platformVal, setPlatformVal] = useState(undefined);
  const [supplierVal, setSupplierVal] = useState(undefined);
  const [cityVal, setCityVal] = useState(undefined);
  const [teamTypeVal, setTeamType] = useState(undefined);
  const [teamIdVal, setTeamId] = useState(undefined);

  const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

  // platform onChange
  const onChangePlatform = (val) => {
    const formVal = form.getFieldsValue().approt || [];
    formVal[currentKey] = {
      platform: val,
    };
    form.setFieldsValue(formVal);
    setPlatformVal(val);
  };

  // supplier onChange
  const onChangeSupplier = (val) => {
    const formVal = form.getFieldsValue().approt || [];
    const { platform = undefined } = formVal[currentKey];
    formVal[currentKey] = {
      platform,
      supplier: val,
    };
    form.setFieldsValue(formVal);
    setSupplierVal(val);
  };

  // city onChange
  const onChangeCity = (val, option) => {
    const { props: cityProps = {} } = option;
    const { spell = undefined } = cityProps;

    const formVal = form.getFieldsValue().approt || [];
    const { platform, supplier } = formVal[currentKey];
    formVal[currentKey] = {
      platform,
      supplier,
      city: val,
    };
    form.setFieldsValue(formVal);
    setCityVal(spell);
  };

  // district onChange
  const onChangeDistrict = (val) => {
    const formVal = form.getFieldsValue().approt || [];
    const { platform = undefined, supplier, city } = formVal[currentKey];
    formVal[currentKey] = {
      platform,
      supplier,
      city,
      district: val,
    };
    form.setFieldsValue(formVal);
  };

  // team type onChange
  const onChangeTeamType = (val) => {
    const formVal = form.getFieldsValue().approt || [];
    formVal[currentKey] = {
      ...formVal[currentKey],
      teamId: undefined,
      teamCode: undefined,
      teamName: undefined,
    };
    setTeamType(val);
  };

  // job onChange
  const onChangeJobs = (val, options = {}) => {
    const { code, name } = options;
    const formVal = form.getFieldsValue().approt || [];
    formVal[currentKey] = {
      ...formVal[currentKey],
      staffId: undefined,
      teamCode: code,
      teamName: name,
    };
    setTeamId(val);
  };

  // owner onChange
  const onChangeOwner = (val, options = {}) => {
    const { props: option = {} } = options;
    const { teamidcode, teamname } = option;
    const formVal = form.getFieldsValue().approt || [];
    formVal[currentKey] = {
      ...formVal[currentKey],
      staffId: undefined,
      teamCode: teamidcode,
      teamName: teamname,
    };
    setTeamId(val);
  };

  // staff onChange
  const onChangeJobsStaff = (val) => {
    const formVal = form.getFieldsValue().approt || [];
    formVal[currentKey] = {
      ...formVal[currentKey],
      staffId: undefined,
      profileId: undefined,
    };
    setTeamId(val);
  };

  const onChangeStaff = (val, options = {}) => {
    const { profileid } = options;
    const formVal = form.getFieldsValue().approt || [];
    formVal[currentKey] = {
      ...formVal[currentKey],
      profileId: profileid,
    };
  };

  const formItems = [];

  // platform
  config.find(i => i === CommonItemsType.platform) !== undefined && (
    formItems[formItems.length] =
      (<Form.Item
        {...layout}
        style={{ margin: '5px 0' }}
        name={[field.name, 'platform']}
        label="平台"
        key={[field.fieldKey, 'platform']}
        fieldKey={[field.fieldKey, 'platform']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <CommonSelectPlatforms
          onChange={onChangePlatform}
          allowClear
          showSearch
          placeholder="请选择平台"
          optionFilterProp="children"
          namespace={intervalRef.current}
        />
      </Form.Item>)
  );

  // supplier
  config.find(i => i === CommonItemsType.supplier) !== undefined && (
    formItems[formItems.length] =
      (<Form.Item
        {...layout}
        style={{ margin: '5px 0' }}
        name={[field.name, 'supplier']}
        label="供应商"
        key={[field.fieldKey, 'supplier']}
        fieldKey={[field.fieldKey, 'supplier']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <CommonSelectSuppliers
          allowClear
          showSearch
          platforms={platformVal}
          placeholder="请选择供应商"
          namespace={intervalRef.current}
          optionFilterProp="children"
          onChange={onChangeSupplier}
        />
      </Form.Item>)
  );

  // city
  config.find(i => i === CommonItemsType.city) !== undefined && (
    formItems[formItems.length] =
      (<Form.Item
        {...layout}
        style={{ margin: '5px 0' }}
        name={[field.name, 'city']}
        label="城市"
        key={[field.fieldKey, 'city']}
        fieldKey={[field.fieldKey, 'city']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <CommonSelectCities
          allowClear
          showSearch
          platforms={platformVal}
          supplies={supplierVal}
          placeholder="请选择城市"
          namespace={intervalRef.current}
          optionFilterProp="children"
          onChange={onChangeCity}
          isExpenseModel
        />
      </Form.Item>)
  );

  // district
  config.find(i => i === CommonItemsType.district) !== undefined && (
    formItems[formItems.length] =
      (<Form.Item
        {...layout}
        style={{ margin: '5px 0' }}
        name={[field.name, 'district']}
        label="商圈"
        key={[field.fieldKey, 'district']}
        fieldKey={[field.fieldKey, 'district']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <CommonSelectDistricts
          allowClear
          showSearch
          platforms={platformVal}
          supplies={supplierVal}
          cities={cityVal}
          placeholder="请选择商圈"
          optionFilterProp="children"
          namespace={intervalRef.current}
          onChange={onChangeDistrict}
        />
      </Form.Item>)
  );

  // team
  costCenterType === ExpenseCostCenterType.team && (
    formItems[formItems.length] =
      (<Form.Item
        {...layout}
        style={{ margin: '5px 0' }}
        name={[field.name, 'teamType']}
        label="团队类型"
        key={[field.fieldKey, 'teamType']}
        fieldKey={[field.fieldKey, 'teamType']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <Select
          placeholder="请选择团队类型"
          onChange={onChangeTeamType}
        >
          {
            teamTypeList.map((item) => {
              return (
                <Option key={`${item}`} value={item}>{ExpenseTeamType.description(item)}</Option>
              );
            })
          }
        </Select>
      </Form.Item>
    )
  );

  // team
  costCenterType === ExpenseCostCenterType.team && teamTypeVal === ExpenseTeamType.departmentOwner && (
    formItems[formItems.length] = (
      <Form.Item
        {...layout}
        style={{ margin: '5px 0' }}
        name={[field.name, 'teamId']}
        label="团队"
        key={[field.fieldKey, 'teamId']}
        fieldKey={[field.fieldKey, 'teamId']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <CommonSelectTeamId
          allowClear
          showSearch
          platforms={platformVal}
          teamType={teamTypeVal}
          placeholder="请选择团队"
          optionFilterProp="children"
          namespace={intervalRef.current}
          onChange={onChangeOwner}
        />
      </Form.Item>
    )
  );

  // team
  costCenterType === ExpenseCostCenterType.team && teamTypeVal !== ExpenseTeamType.departmentOwner && (
    formItems[formItems.length] = (
      <Form.Item
        {...layout}
        style={{ margin: '5px 0' }}
        name={[field.name, 'teamId']}
        label="团队信息"
        key={[field.fieldKey, 'teamId']}
        fieldKey={[field.fieldKey, 'teamId']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <DepartmentJobs
          isAuthorized
          onChange={onChangeJobs}
          namespace={intervalRef.current}
          type={teamTypeVal}
        />
      </Form.Item>
    )
  );

  // person
  costCenterType === ExpenseCostCenterType.person && (
    formItems[formItems.length] = (
      <Form.Item
        {...layout}
        style={{ margin: '5px 0' }}
        name={[field.name, 'teamId']}
        label="团队信息"
        key={[field.fieldKey, 'teamId']}
        fieldKey={[field.fieldKey, 'teamId']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <DepartmentJobs
          isAuthorized
          onChange={onChangeJobsStaff}
          namespace={intervalRef.current}
          type={teamTypeVal}
        />
      </Form.Item>
    )
  ) && (
    formItems[formItems.length] = (
      <Form.Item
        {...layout}
        style={{ margin: '5px 0' }}
        name={[field.name, 'staffId']}
        label="人员信息"
        key={[field.fieldKey, 'staffId']}
        fieldKey={[field.fieldKey, 'staffId']}
        rules={[{ required: true, message: '请选择' }]}
      >
        <SelectStaff
          teamId={teamIdVal}
          onChange={onChangeStaff}
        />
      </Form.Item>
    )
  );

  return (
    <React.Fragment>
      <CoreForm items={formItems} cols={2} />
    </React.Fragment>
  );
};

export default RedPunchApportItem;
