/**
 * 费用审批流 - 创建弹窗&设置按钮 /Expense/ExamineFlow/
 */
import is from 'is_js';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Modal, Select, Button, message } from 'antd';
import style from './style.css';

import aoaoBossTools from '../../../../utils/util';
import { DeprecatedCoreForm } from '../../../../components/core';
import { ExpenseCostOrderBizType } from '../../../../application/define';

const { Option } = Select;

class CreateModal extends Component {
  constructor() {
    super();
    this.state = {
      visible: false, // 是否显示弹窗
    };
  }

  // 显示弹窗
  onShowModal = () => {
    this.setState({ visible: true });
  }

  // 隐藏弹窗
  onHideModal = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  }

  // 去房屋审批流页
  onClickConfig = () => {
    window.location.href = '/#/Expense/ExamineFlow/Config';  // 去房屋审批流页
  }

  // 添加项目
  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      // 错误判断
      if (err) {
        return;
      }
      const params = {
        onSuccessCallback: this.onCreateSuccessCallback,  // 成功的回调函数
        onFailureCallback: this.onFailureCallback, // 成功回调
        ...values,
      };
      this.props.dispatch({ type: 'expenseExamineFlow/createExamineFlow', payload: params });
    });
  }

  // 审批流创建成功之后的回调函数
  onCreateSuccessCallback = (result = {}) => {
    // 判断创建成功之后的审批流数据
    if (is.existy(result) && is.not.empty(result) && is.not.empty(result._id)) {
      this.onHideModal();

      // 跳转到审批流编辑页面
      aoaoBossTools.popUpCompatible(`/#/Expense/ExamineFlow/Form?flowId=${result._id}`);
      // window.open(`/#/Expense/ExamineFlow/Form?flowId=${result._id}`);
      return;
    }

    message.error('无法获取新创建的审批流信息，请手动刷新页面查询');
  }

  // 失败回调
  onFailureCallback = (result) => {
    // 错误提示信息
    if (is.existy(result.zh_message) && is.not.empty(result.zh_message)) {
      return message.error(result.zh_message);
    }
  }

  // 渲染弹窗内容
  renderModal = () => {
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;

    const formItems = [
      {
        label: '审批流名称',
        form: getFieldDecorator('name', { rules: [
          { required: true, message: '请选择审批流名称' },
          { pattern: /^\S+$/, message: '审批流名称不能包含空格' },
        ],
          initialValue: undefined })(
            <Input placeholder="请输入审批流名称" />,
        ),
      },
      {
        label: '审批流类型',
        form: getFieldDecorator('bizType', { rules: [
          { required: true, message: '请选择审批流类型' },
        ],
          initialValue: `${ExpenseCostOrderBizType.transactional}` })(
            <Select placeholder="请选择审批流类型">
              <Option value={`${ExpenseCostOrderBizType.costOf}`}>{ExpenseCostOrderBizType.description(ExpenseCostOrderBizType.costOf)}</Option>
              <Option value={`${ExpenseCostOrderBizType.noCostOf}`}>{ExpenseCostOrderBizType.description(ExpenseCostOrderBizType.noCostOf)}</Option>
              <Option value={`${ExpenseCostOrderBizType.transactional}`}>{ExpenseCostOrderBizType.description(ExpenseCostOrderBizType.transactional)}</Option>
            </Select>,
        ),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

    return (
      <Modal title="操作" visible={visible} onOk={this.onSubmit} onCancel={this.onHideModal} >
        <Form layout="horizontal">
          <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
        </Form>
      </Modal>
    );
  }

  render = () => {
    return (
      <div>
        {/* 渲染操作弹窗 */}
        {this.renderModal()}
        <span>
          <Button type="primary" onClick={this.onClickConfig} className={style['app-comp-expense-examine-flow-modal-approval-config']}>审批流配置</Button>
          <Button type="primary" onClick={this.onShowModal}>新增审批流</Button>
        </span>
      </div>
    );
  }
}

export default Form.create()(CreateModal);
