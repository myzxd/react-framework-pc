/*
 * 三方平台ID - 删除弹窗
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

class ModalForm extends Component {

  static propTypes = {
    visible: PropTypes.bool,     // 弹窗是否可见
    onCancel: PropTypes.func,    // 隐藏弹窗的回调函数
    customObj: PropTypes.object, // custom_list中单条数据
  }

  static defaultProps = {
    visible: false,     // 弹窗是否可见
    onCancel: () => {}, // 隐藏弹窗的回调函数
    customObj: {},      // custom_list中单条数据
  }

  // 弹窗确定
  onSubmit = (e) => {
    e.preventDefault();
    const { staff_id, _id } = this.props.customObj;
    this.props.getRemoveModalData(staff_id, _id);
    this.onCancel();
  }

  // 弹窗取消
  onCancel = () => {
    const { onCancel } = this.props;
    // 调用上层回调
    if (onCancel) {
      onCancel(3);
    }
  }

  render() {
    const { visible } = this.props;
    const { onSubmit, onCancel } = this;
    return (
      <Modal title="删除" visible={visible} onOk={onSubmit} onCancel={onCancel} okText="确认" cancelText="取消">
        确定要删除该第三方平台ID与该人员的关系？
      </Modal>
    );
  }
}

export default ModalForm;
