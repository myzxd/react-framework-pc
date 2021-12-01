/**
 * 私教管理 - 私教指导 - 新增私教指导Modal
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input } from 'antd';

import SelectDistricts from './selectDistricts';
import { DeprecatedCoreForm } from '../../../../../components/core';

const noop = () => {};
const { TextArea } = Input;
class CreateMessageModal extends Component {
  static propTypes = {
    onSearch: PropTypes.func,            // 搜索(刷新数据)
    isShowModal: PropTypes.bool,         // 是否显示私教指导Modal
    hideModal: PropTypes.func,           // 隐藏弹窗
  }

  static defaultProps = {
    onSearch: noop,
    isShowModal: false,
    hideModal: noop,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 成功回调
  onSuccessCallback = () => {
    const { hideModal, onSearch } = this.props;
    this.props.form.resetFields();
    if (onSearch) {
      onSearch({});
    }
    if (hideModal) {
      hideModal();
    }
  }

  // 确定
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      // 错误判断
      if (err) {
        return;
      }
      // 请求参数
      const payload = {
        ...values,
        onSuccessCallback: this.onSuccessCallback,
      };
      this.props.dispatch({
        type: 'teamMessage/createTeamMessage',
        payload,
      });
    });
  }

  // 取消
  handleCancel = () => {
    const { hideModal } = this.props;
    // 清空表单值
    this.props.form.resetFields();
    if (hideModal) {
      hideModal();
    }
  }

  // 渲染表单信息
  renderFormInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '商圈',
        form: getFieldDecorator('districts', {
          rules: [{ required: true, message: '请选择商圈' }],
        })(
          <SelectDistricts
            showSearch
            optionFilterProp="children"
            placeholder="请选择商圈"
            style={{ width: '100%' }}
          />,
        ),
      },
      {
        label: '指导意见',
        form: getFieldDecorator('note', {
          rules: [{ required: true, message: '请输入对该商圈的指导意见' }],
        })(
          <TextArea
            rows={4}
            maxlength={150}
            placeholder="请输入对该商圈的指导意见（限制150字）"
          />,
        ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  render() {
    const { isShowModal } = this.props;
    return (
      <Modal
        title="新增指导意见"
        visible={isShowModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        {/* 渲染表单信息 */}
        {this.renderFormInfo()}
      </Modal>
    );
  }
}

const mapStateToProps = ({ teamTeacher: { teamTeacherDetail } }) => {
  return { teamTeacherDetail };
};

export default connect(mapStateToProps)(Form.create()(CreateMessageModal));
