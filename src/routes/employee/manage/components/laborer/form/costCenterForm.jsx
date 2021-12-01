/**
 * 劳动者档案档案 - 编辑 - TEAM成本中心tab
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
  FileType,
} from '../../../../../../application/define';

import TeamType from '../../other/teamType';
import Team from '../../other/team';

import style from './style.less';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const CostCenterForm = forwardRef(({
  onSave, // 保存
  employeeDetail = {}, // 员工档案
  onBack, // 返回
}, ref) => {
  const [form] = Form.useForm();
  // team类型
  const [teamType, setTeamType] = useState(employeeDetail.cost_team_type);

  // 暴露ref
  useImperativeHandle(ref, () => form);

  // 是否可编辑team信息
  const isCanUpdateCost = employeeDetail.profile_type !== FileType.staff
    && employeeDetail.is_can_update_cost === false;

  // 保存
  const onCurSave = () => {
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

  // TEAM类型onChange
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
        <div
          className={style['contract-tab-scroll-button']}
        >
          {
            // team不能编辑状态，只有返回操作
            isCanUpdateCost ? (
              <Button
                onClick={onBack}
                style={{
                  marginRight: 10,
                }}
              >
                返回
              </Button>
            ) : (
              <React.Fragment>
                <Button
                  onClick={onBack}
                  style={{
                    marginRight: 10,
                  }}
                >
                返回
              </Button>
                <Button
                  onClick={onReset}
                  style={{
                    marginRight: 10,
                  }}
                >重置</Button>
                <Button
                  onClick={onCurSave}
                  type="primary"
                >保存</Button>
              </React.Fragment>
            )
          }
        </div>
      </div>
    </React.Fragment>
  );
});

export default CostCenterForm;
