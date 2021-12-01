/**
 * 身份信息(编辑)
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Tabs } from 'antd';

import { CoreContent } from '../../../../../../components/core';
import IdentityForm from './components/identityForm';
import HealthForm from './components/healthForm';
import DriveForm from './components/driveForm';

const TabPane = Tabs.TabPane;

class UpdataIdentityInfo extends Component {
  static propTypes = {
    employeeDetail: PropTypes.object, // 人员详情
  }

  static defaultProps = {
    employeeDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 渲染tabs
  renderTabs = () => {
    const { form, employeeDetail } = this.props;
    return (
      <Tabs type="card">
        <TabPane
          tab="身份证件"
          key="identity"
        >
          <IdentityForm
            form={form}
            employeeDetail={employeeDetail}
          />
        </TabPane>
        <TabPane
          tab="健康证件"
          key="health"
        >
          <HealthForm
            form={form}
            employeeDetail={employeeDetail}
          />
        </TabPane>
        <TabPane
          tab="驾驶证件"
          key="drive"
        >
          <DriveForm
            form={form}
            employeeDetail={employeeDetail}
          />
        </TabPane>
      </Tabs>
    );
  }

  render() {
    return (
      <CoreContent title="身份信息">
        <Form layout="horizontal">
          {/* 渲染tabs */}
          {this.renderTabs()}
        </Form>
      </CoreContent>
    );
  }
}

export default UpdataIdentityInfo;
