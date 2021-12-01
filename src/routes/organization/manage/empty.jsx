/**
 * 组织架构 - 部门管理 = 初始化
 */
import { connect } from 'dva';
import React from 'react';
import { Button, message } from 'antd';

import { CoreContent } from '../../../components/core';
import Create from './department/component/modal/departmentUpdate';

// 弹窗类型
const Type = {
  create: 'create',
  update: 'update',
};

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      visable: false, // 弹窗visable
    };
  }

  onCancel = () => {
    this.setState({ visible: false });
  }

  // 成功的回调
  onSuccessCallback = (res) => {
    this.onCancel();
    let id;
    res.record && (id = res.record._id);
    window.location.href = `/#/Organization/Manage/Department?id=${id}`;
  }

  // 失败回调
  onFailureCallback = (res) => {
    this.onCancel();
    res.zh_message && message.error(res.zh_message);
  }

  renderModal = () => {
    const { visible } = this.state;
    const { dispatch } = this.props;

    if (!visible) return;
    return (
      <Create
        title="创建岗位"
        visible={visible}
        type={Type.create}
        dispatch={dispatch}
        onCancel={this.onCancel}
        onSuccessCallback={this.onSuccessCallback}
        onFailureCallback={this.onFailureCallback}
      />
    );
  }

  render() {
    return (
      <CoreContent style={{ minHeight: '400px', lineHeight: '400px', textAlign: 'center' }}>
        <Button onClick={() => this.setState({ visible: true })}>创建部门</Button>
        {this.renderModal()}
      </CoreContent>
    );
  }
}

export default connect()(Index);
