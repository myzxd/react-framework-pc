/**
 * 审批配置页面
 */
import is from 'is_js';
import dot from 'dot-prop';
import { Radio, Switch, Button } from 'antd';
import { Form } from '@ant-design/compatible';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';

import { DeprecatedCoreForm } from '../../../components/core';
import CoreContent from '../../../components/core/content';

// 默认开启的配置参数
PageApproalConfig.onDefaultConfig = {
  addSubDepartment: true,         // 新增子部门是否需要审批
  adjustDepartment: true,         // 调整上级部门是否需要审批
  addJob: true,                   // 添加部门下岗位是否需要审批
  cutDepartment: true,            // 裁撤部门是否需要审批
  addAuthorizedStrength: true,    // 增编是否需要审批
  reduceAuthorizedStrength: true, // 减编是否需要审批
};
// 默认关闭的配置参数
PageApproalConfig.offDefaultConfig = {
  addSubDepartment: false,          // 新增子部门是否需要审批
  adjustDepartment: false,          // 调整上级部门是否需要审批
  addJob: false,                    // 添加部门下岗位是否需要审批
  cutDepartment: false,             // 裁撤部门是否需要审批
  addAuthorizedStrength: false,     // 增编是否需要审批
  reduceAuthorizedStrength: false,  // 减编是否需要审批
};

// 审批配置
const approvalConfigState = {
  on: true,
  off: false,
  description(rawValue) {
    switch (rawValue) {
      case this.on: return '需要';
      case this.off: return '不需要';
      default: return '未定义';
    }
  },
};

// form 样式布局
const layout = { labelCol: { span: 5 }, wrapperCol: { span: 14 } };
const formItemStyle = { marginBottom: 0 };
// label style
const labelStyle = { color: '#666' };


function PageApproalConfig(props) {
  const { getFieldDecorator, validateFields, setFieldsValue } = props.form;
  const { approalInfo } = props;

  // 组织架构相关操作是否需要走审批 开关
  const [disabledState, setDisabledState] = useState(false);
  // 保存按钮状态
  const [isDisable, setIsDisable] = useState(true);

  // 请求配置接口
  useEffect(() => {
    props.dispatch({ type: 'systemManage/fetchApproal' });
  }, []);

  // 初始化配置
  useEffect(() => {
    // 如果审批信息存在 初始化设置
    if (is.existy(approalInfo) && is.not.empty(approalInfo)) {
      const newFieldsValue = {
        addSubDepartment: dot.get(approalInfo, '0.config_info.add_sub_department'),
        adjustDepartment: dot.get(approalInfo, '0.config_info.adjust_department'),
        addJob: dot.get(approalInfo, '0.config_info.add_job'),
        cutDepartment: dot.get(approalInfo, '0.config_info.cut_department'),
        addAuthorizedStrength: dot.get(approalInfo, '0.config_info.add_authorized_strength'),
        reduceAuthorizedStrength: dot.get(approalInfo, '0.config_info.reduce_authorized_strength'),
      };
      // 初始化默认配置
      setFieldsValue(newFieldsValue);

      const configInfo = dot.get(approalInfo, '0.config_info', {});
      const isOpen = Object.keys(configInfo).some(key => configInfo[key] === true);
      // 设置总开关的状态 开启
      setDisabledState(isOpen);
    }

    // 如果审批信息不存在 是空 默认关闭
    if (is.empty(approalInfo)) {
      // 设置 关闭总开关
      setDisabledState(false);
      // 设置所有子开发 关闭
      setFieldsValue(PageApproalConfig.offDefaultConfig);
    }
  }, [approalInfo]);


  // 提交 更新操作
  const onSubmit = async () => {
    const formItem = await validateFields();
    props.dispatch({ type: 'systemManage/updateApproal', payload: formItem });
  };

  // 子开关切换
  const onChangeIsSaveStatus = async (e) => {
    // 当前切换项的名称和值
    const currentName = e.target.name;
    const currentValue = e.target.value;

    // 当前点击项
    const current = {};
    current[currentName] = currentValue;

    // 拿到当前项之前的所有子项状态
    const preValues = await validateFields();
    // 因为不需要总开关的值 删除总开关的值
    delete preValues.all;
    // 合并最新的子项状态
    const configAll = Object.assign(preValues, current);

    // 如果子项有一个开启 则打开总开关 如果 子项全部关闭 设置总开关关闭
    const status = Object.keys(configAll).some(key => configAll[key] === true);
    // 设置总开关的状态
    setDisabledState(status);
    // 保存按钮状态 设置高亮
    setIsDisable(false);
  };

  // 总开关切换
  const onChangeSwitch = (checked) => {
    if (checked) {
      // 如果是开启 下面默认需要
      setFieldsValue(PageApproalConfig.onDefaultConfig);
    } else {
      // 如果是关闭 下面默认不需要
      setFieldsValue(PageApproalConfig.offDefaultConfig);
    }

    // 设置总开关状态
    setDisabledState(checked);

    // 保存按钮状态 设置高亮
    setIsDisable(false);
  };

  // 渲染子开关 form组件
  const renderForm = (name) => {
    return (
      getFieldDecorator(name, { rules: [{ required: true, message: '请填选择状态' }], initialValue: approvalConfigState.on })(
        <Radio.Group style={{ height: 30 }} name={name} onChange={onChangeIsSaveStatus}>
          <Radio disabled={!disabledState} value={approvalConfigState.on}>{approvalConfigState.description(approvalConfigState.on)}</Radio>
          <Radio disabled={!disabledState} value={approvalConfigState.off}>{approvalConfigState.description(approvalConfigState.off)}</Radio>
        </Radio.Group>,
      )
    );
  };

  // 配置Item
  const formItems = [
    {
      style: formItemStyle,
      label: <span style={labelStyle}>组织架构相关操作是否需要走审批</span>,
      form: getFieldDecorator('all', { rules: [{ required: true, message: '请填选择状态' }], initialValue: approvalConfigState.off })(
        <Switch style={{ paddingLeft: 15 }} onChange={onChangeSwitch} checkedChildren="是" unCheckedChildren="否" checked={disabledState} />,
      ),
    },
    {
      style: formItemStyle,
      label: <span style={labelStyle}>新增子部门是否需要审批</span>,
      form: renderForm('addSubDepartment'),
    },
    {
      style: formItemStyle,
      label: <span style={labelStyle}>调整上级部门是否需要审批</span>,
      form: renderForm('adjustDepartment'),
    },
    {
      style: formItemStyle,
      label: <span style={labelStyle}>添加部门下岗位是否需要审批</span>,
      form: renderForm('addJob'),
    },
    {
      style: formItemStyle,
      label: <span style={labelStyle}>裁撤部门是否需要审批</span>,
      form: renderForm('cutDepartment'),
    },
    {
      style: formItemStyle,
      label: <span style={labelStyle}>增编是否需要审批</span>,
      form: renderForm('addAuthorizedStrength'),
    },
    {
      style: formItemStyle,
      label: <span style={labelStyle}>减编是否需要审批</span>,
      form: renderForm('reduceAuthorizedStrength'),
    },
  ];

  // 渲染 配置信息
  const renderConfig = () => {
    return (
      <CoreContent title="配置信息">
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  };

  // 渲染 提交按钮
  const renderSubmit = () => {
    return (
      <CoreContent style={{ textAlign: 'center' }}>
        {/* <Button style={{ marginRight: 25 }} onClick={() => { window.location.href = '/#/Code/Home'; }}>返回</Button> */}
        <Button type="primary" disabled={isDisable} onClick={onSubmit}>保存</Button>
      </CoreContent>
    );
  };

  return (
    <React.Fragment>
      {/* 配置 */}
      {renderConfig()}
      {/* 提交 */}
      {renderSubmit()}
    </React.Fragment>
  );
}


const newPageApproalConfig = Form.create()(PageApproalConfig);

newPageApproalConfig.propTypes = {
  approalInfo: PropTypes.array, // 后端返回的配置数据
};

newPageApproalConfig.defaultProps = {
  approalInfo: [],              // 后端返回的配置数据
};

const mapStateToProps = ({ systemManage: { approalInfo } }) => { return { approalInfo }; };
export default connect(mapStateToProps)(newPageApproalConfig);
