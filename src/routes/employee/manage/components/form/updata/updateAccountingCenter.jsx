/**
 * 核算中心
 * */
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Form } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import ComponentTeam from './components/codeTeam';
import ComponentTeamType from './components/codeTeamType';

class ComponentUpdateAccountingCenter extends Component {

  // 归属team类型
  onChangeCodeTeamType = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ codeTeam: undefined });
  }

  render = () => {
    const employeeDetail = dot.get(this.props, 'employeeDetail', {});
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { disabled } = this.props;
    const formItems = [
      {
        label: '归属team类型',
        form: getFieldDecorator('codeTeamType', {
          initialValue: employeeDetail.cost_team_type ? employeeDetail.cost_team_type : undefined,
          rules: [{ required: true, message: '请选择归属team类型' }],
        })(
          <ComponentTeamType
            placeholder="请选择归属team类型"
            showSearch
            allowClear
            initCostTeamType={employeeDetail.cost_team_type || undefined}
            optionFilterProp="children"
            onChange={this.onChangeCodeTeamType}
            disabled={disabled}
          />,
        ),
      },
      {
        label: '归属team',
        form: getFieldDecorator('codeTeam', {
          initialValue: employeeDetail.cost_team_id ? employeeDetail.cost_team_id : undefined,
          rules: [{ required: true, message: '请选择归属team' }],
        })(
          <ComponentTeam
            placeholder="请选择归属team"
            namespace="updateAccountingCenter"
            codeTeamType={getFieldValue('codeTeamType')}
            showSearch
            allowClear
            optionFilterProp="children"
            initCostTeamType={employeeDetail.cost_team_type || undefined}
            initCostTeamInfo={employeeDetail.cost_team_info || {}}
            disabled={disabled}
          />,
        ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <Form>
        <CoreContent>
          <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        </CoreContent>
      </Form>
    );
  }
}

export default ComponentUpdateAccountingCenter;
