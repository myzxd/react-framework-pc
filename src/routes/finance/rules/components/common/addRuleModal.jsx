/**
 * 服务费规则 - 规则添加弹窗
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Modal, message } from 'antd';
import { DeprecatedCoreForm } from '../../../../../components/core';
import { HouseholdType } from '../../../../../application/define';

const { Option } = Select;

class AddRuleModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,          // 添加规则对话框是否展示
    confirmLoading: PropTypes.bool,   // 添加规则对话框确定按钮是否有loading
    onChangeModalDisplayState: PropTypes.func,  // 对话框展示隐藏切换回调
    planVersionId: PropTypes.string,  // 服务费方案版本id
    planId: PropTypes.string,         // 服务费方案版本id
    platformCode: PropTypes.string,   // 平台code
  }

  constructor() {
    super();
    this.state = {
    };
  }

  // 请求接口成功回调
  onSuccessCallback = (e) => {
    const { platformCode, planVersionId, planId } = this.props;
    if (!e.ok) return;
    if (!e.record._id) return;
    window.location.href = `/#/Finance/Rules/Generator?id=${e.record._id}&planId=${planId}&planVersionId=${planVersionId}&platformCode=${platformCode}`;
  }

  // 请求接口失败回调
  onFailureCallback = (e) => {
    if (e.zh_message) {
      return message.error(e.zh_message);
    }
  }

  handleOk = () => {
    const { onChangeModalDisplayState, planVersionId } = this.props;
    this.props.form.validateFields((err, values) => {
      // 如果没有错误，并且有回调参数，则进行回调
      if (!err) {
        const payload = {
          planVersionId,
          workType: values.workType,
          onSuccessCallback: this.onSuccessCallback,
          onFailureCallback: this.onFailureCallback,
        };
        this.props.dispatch({ type: 'financePlan/createRuleCollection', payload });
      }
    });
    if (onChangeModalDisplayState) {
      onChangeModalDisplayState();
    }
  }

  handleCancel = () => {
    const { onChangeModalDisplayState } = this.props;
    if (onChangeModalDisplayState) {
      onChangeModalDisplayState();
    }
  }

  renderFormItems = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '个户类型',
        form: getFieldDecorator('workType', {
          initialValue: `${HouseholdType.first}`,
          rules: [{ required: true, message: '请选择' }],
        })(
          <Select className="app-global-componenth-width100" placeholder="请选择">
            <Option value={`${HouseholdType.first}`}>
              {HouseholdType.description(HouseholdType.first)}
            </Option>
            <Option value={`${HouseholdType.second}`}>
              {HouseholdType.description(HouseholdType.second)}
            </Option>
          </Select>,
          ),
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </div>
    );
  }
  render() {
    const { visible, confirmLoading } = this.props;
    return (
      <div>
        <Modal
          title="创建方案"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form>
            {this.renderFormItems()}
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect()(Form.create()(AddRuleModal));
