/**
 * 人员管理 - 人员异动 - 搜索
 */
import React, { useState } from 'react';
import { Input, Select } from 'antd';

import { CoreContent, DeprecatedCoreSearch } from '../../../components/core';
import { EmployeeTurnoverApplyState, EmployeeTurnoverInfoChangeTask, EmployeeTurnoverThemeTag } from '../../../application/define';

const { Option } = Select;
function Search(props) {
  // 搜索的form
  const [, setForm] = useState(undefined);
  // 已选供应商
  const [, setSuppliers] = useState([]);


  // 重置
  const onReset = () => {
    const params = {
      page: 1,
      limit: 30,
    };
    // 重置搜索
    if (props.onSearch) {
      props.onSearch(params);
    }
  };

   // 搜索
  const onSearch = (params) => {
    props.onSearch(params);
  };

  // 搜索的扩展数据
  const onChangeSearchExtensions = (values) => {
    setSuppliers(values.suppliers);
  };

  // 获取提交用的form表单
  const onHookForm = (forms) => {
    setForm(forms);
  };

  const items = [
    {
      label: '申请状态',
      form: forms => (forms.getFieldDecorator('applyState', { initialValue: undefined })(
        <Select allowClear placeholder="请选择申请状态">
          <Option value={EmployeeTurnoverApplyState.pendding}>{EmployeeTurnoverApplyState.description(EmployeeTurnoverApplyState.pendding)}</Option>
          <Option value={EmployeeTurnoverApplyState.verifying}>{EmployeeTurnoverApplyState.description(EmployeeTurnoverApplyState.verifying)}</Option>
          <Option value={EmployeeTurnoverApplyState.rejected}>{EmployeeTurnoverApplyState.description(EmployeeTurnoverApplyState.rejected)}</Option>
          <Option value={EmployeeTurnoverApplyState.done}>{EmployeeTurnoverApplyState.description(EmployeeTurnoverApplyState.done)}</Option>
          <Option value={EmployeeTurnoverApplyState.withdraw}>{EmployeeTurnoverApplyState.description(EmployeeTurnoverApplyState.withdraw)}</Option>
          <Option value={EmployeeTurnoverApplyState.close}>{EmployeeTurnoverApplyState.description(EmployeeTurnoverApplyState.close)}</Option>
        </Select>,
      )),
    },
    {
      label: '信息变更任务',
      form: forms => (forms.getFieldDecorator('change', { initialValue: undefined })(
        <Select allowClear placeholder="请选择申请状态">
          <Option value={EmployeeTurnoverInfoChangeTask.finished}>{EmployeeTurnoverInfoChangeTask.description(EmployeeTurnoverInfoChangeTask.finished)}</Option>
          <Option value={EmployeeTurnoverInfoChangeTask.unfinished}>{EmployeeTurnoverInfoChangeTask.description(EmployeeTurnoverInfoChangeTask.unfinished)}</Option>
        </Select>,
      )),
    },
    {
      label: '主题标签',
      form: forms => (forms.getFieldDecorator('themeTag', { initialValue: undefined })(
        <Select showArrow mode="tags" style={{ width: '100%' }} placeholder="请输入主题标签" >
          <Option value={EmployeeTurnoverThemeTag.promotion}>{EmployeeTurnoverThemeTag.description(EmployeeTurnoverThemeTag.promotion)}</Option>
          <Option value={EmployeeTurnoverThemeTag.demotion}>{EmployeeTurnoverThemeTag.description(EmployeeTurnoverThemeTag.demotion)}</Option>
          <Option value={EmployeeTurnoverThemeTag.level}>{EmployeeTurnoverThemeTag.description(EmployeeTurnoverThemeTag.level)}</Option>
        </Select>,
      )),
    },
    {
      label: '调岗人姓名',
      form: forms => (forms.getFieldDecorator('postName', { initialValue: undefined })(
        <Input placeholder="请输入调岗人姓名" />,
      )),
    },
    {
      label: '身份证号码',
      form: forms => (forms.getFieldDecorator('idCard', { initialValue: undefined })(
        <Input placeholder="请输入身份证号码" />,
      )),
    },
    {
      label: '审批单号',
      form: forms => (forms.getFieldDecorator('examineNum', { initialValue: undefined })(
        <Input placeholder="请输入审批单号" />,
      )),
    },
  ];

  const prop = {
    items,
    onReset,
    onSearch,
    onChange: onChangeSearchExtensions,
    onHookForm,
    expand: true,
  };
  return (
    <CoreContent>
      <DeprecatedCoreSearch {...prop} />
    </CoreContent>
  );
}

export default Search;
