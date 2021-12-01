/**
 * 身份信息(创建)
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

class IdentityInfo extends Component {
  static propTypes = {
    fileType: PropTypes.string,     // 档案类型
    signType: PropTypes.string,     // 签约类型
    industryType: PropTypes.string, // 所属场景
    dispatch: PropTypes.func,
    onResetStaff: PropTypes.func,
  }

  static defaultProps = {
    fileType: '',
    signType: '',
    industryType: '',
    dispatch: () => {},
    onResetStaff: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 渲染tabs
  renderTabs = () => {
    const { form, fileType, signType, industryType, dispatch, onResetStaff, disabledUpdate, employeeDetail } = this.props;
    return (
      <Tabs type="card">
        <TabPane
          tab="身份证件"
          key="identity"
          forceRender
        >
          <IdentityForm
            form={form}
            fileType={fileType}
            signType={signType}
            dispatch={dispatch}
            onResetStaff={onResetStaff}
            disabledUpdate={disabledUpdate}
            employeeDetail={employeeDetail}
          />
        </TabPane>
        <TabPane
          tab="健康证件"
          key="health"
          forceRender
        >
          <HealthForm
            form={form}
            fileType={fileType}
            signType={signType}
            industryType={industryType}
            employeeDetail={employeeDetail}
          />
        </TabPane>
        <TabPane
          tab="驾驶证件"
          key="drive"
          forceRender
        >
          <DriveForm
            form={form}
            fileType={fileType}
            signType={signType}
            industryType={industryType}
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

export default IdentityInfo;
