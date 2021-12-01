/**
 * 员工档案 - 创建 - TEAM成本中心tab
 */
import React, {
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import {
  Button,
  Form,
} from 'antd';
import {
  CoreForm,
} from '../../../../../../components/core';
import {
  EmployeePageSetp,
  FileType,
} from '../../../../../../application/define';

import TeamType from '../../other/teamType';
import Team from '../../other/team';

import style from './style.less';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const CostCenterForm = forwardRef(({
  setTabKey,
  onChangeTabKeys,
  dispatch,
  employeeId, // 员工id
  employeeDetail = {}, // 员工档案
  onSave, // 编辑提交
  onSubmit, // 创建提交
  onBack, // 返回
}, ref) => {
  const [form] = Form.useForm();
  // team类型
  const [teamType, setTeamType] = useState(employeeDetail.cost_team_type);

  // 暴露ref
  useImperativeHandle(ref, () => form);

  // 是否可编辑team信息
  const isCanUpdateCost = employeeDetail.profile_type !== FileType.staff && employeeDetail.is_can_update_cost === false;

  // 上一步
  const onUpStep = () => {
    setTabKey(EmployeePageSetp.welfare);
  };

  // 提交（创建）
  const onSubmitVal = () => {
    form.validateFields().then(() => {
      onSubmit && onSubmit();
      // 表单校验，跳转第一个报错字段
    }).catch((error) => {
      form.scrollToField(
        error.errorFields[0].name,
        {
          behavior: actions => actions.forEach(({ el, top }) => {
            // eslint-disable-next-line no-param-reassign
            el.scrollTop = top - 5;
          }),
        },
      );
    });
  };

  // 提交（保存）
  const onUpdate = () => {
    form.validateFields().then((values) => {
      onSave && onSave(values);
      // 表单校验，跳转第一个报错字段
    }).catch((error) => {
      form.scrollToField(
        error.errorFields[0].name,
        {
          behavior: actions => actions.forEach(({ el, top }) => {
            // eslint-disable-next-line no-param-reassign
            el.scrollTop = top - 5;
          }),
        },
      );
    });
  };

  // team类型onChange
  const onChangeTeamType = (val) => {
    setTeamType(val);
    form.setFieldsValue({ cost_team_id: undefined });
  };

  // 重置
  const onReset = () => {
    setTeamType(employeeDetail.cost_team_type);
    form.resetFields();
  };

  const items = [
    <Form.Item
      label="归属team类型"
      name="cost_team_type"
      rules={[
        { required: true, message: '请选择归属team类型' },
      ]}
      {...formLayout}
    >
      <TeamType
        onChange={onChangeTeamType}
        disabled={isCanUpdateCost}
      />
    </Form.Item>,
    <Form.Item
      label="归属team"
      name="cost_team_id"
      rules={[
        { required: true, message: '请选择归属team' },
      ]}
      {...formLayout}
    >
      <Team
        teamType={teamType}
        initValue={employeeDetail.cost_team_info}
        disabled={isCanUpdateCost}
      />
    </Form.Item>,
  ];

  // 创建页操作
  const renderCreateOperation = () => {
    return (
      <div
        className={style['contract-tab-scroll-button']}
      >
        <Button
          onClick={onReset}
          style={{
            marginRight: 10,
          }}
        >重置</Button>
        <Button
          onClick={onUpStep}
          type="primary"
          style={{
            marginRight: 10,
          }}
        >上一步</Button>
        <Button
          onClick={onSubmitVal}
          type="primary"
        >提交</Button>
      </div>
    );
  };

  // 编辑页操作
  const renderUpdateOperation = () => {
    return (
      <div
        className={style['contract-tab-scroll-button']}
      >
        <Button
          onClick={onBack}
          style={{
            marginRight: 10,
          }}
        >返回</Button>
        <Button
          onClick={onReset}
          style={{
            marginRight: 10,
          }}
        >重置</Button>
        <Button
          onClick={onUpdate}
          type="primary"
        >提交</Button>
      </div>
    );
  };

  const initialValues = {
    cost_team_type: employeeDetail.cost_team_type || undefined, // 归属team类型
    cost_team_id: employeeDetail.cost_team_id || undefined, // 归属team
  };

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <Form
            form={form}
            initialValues={initialValues}
            className="affairs-flow-basic"
          >
            <CoreForm items={items} />
          </Form>
        </div>
        {
        employeeId ?
          renderUpdateOperation()
          : renderCreateOperation()
      }
      </div>
    </React.Fragment>
  );
});

export default CostCenterForm;
