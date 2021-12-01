/**
 * 审批管理 - 流程审批 - 考勤管理 - 加班管理 - 请假弹窗
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, Steps, message } from 'antd';

import {
  ExpenseCostOrderBizType,
  OaApplicationFlowTemplateState,
  OaApplicationOrderType,
} from '../../../../../application/define';
import { CommonSelectExamineFlows } from '../../../../../components/common';
import { DeprecatedCoreForm } from '../../../../../components/core';

import styles from './style.css';

const { Step } = Steps;

class Create extends Component {
  constructor() {
    super();
    this.state = {
      visible: false, // 新建加班弹窗visible
    };
    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail', payload: {} });
  }

  // 显示弹窗
  onAdd = () => {
    this.setState({ visible: true });
  }

  // 提交
  onSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, value) => {
      if (err) {
        return;
      }
      const params = {
        examineFlowId: value.examineFlowId, // 审批流id
        approvalType: OaApplicationOrderType.takeLeave, // 请假申请
        onSuccessCallback: this.onSuccessCallback,
        onFailureCallback: this.onFailureCallback,
      };

      if (this.private.isSubmit) {
        this.props.dispatch({
          type: 'expenseExamineOrder/createExamineOrder',
          payload: params,
        });
      }
    });
  }

  // 新建请假审批单成功回调
  onSuccessCallback = (res) => {
    if (res && res._id) {
      window.location.href = `/#/Expense/Attendance/TakeLeave/Create?applicationOrderId=${res._id}`;
    }
  }

  // 失败的回调
  onFailureCallback = (res) => {
    this.private.isSubmit = true;
    if (res && res.zh_message) {
      message.error(res.zh_message);
    }
    // 隐藏弹窗
    this.setState({
      visible: false,
    });
  }

  // 隐藏弹窗
  onCancel = () => {
    // 隐藏弹窗
    this.setState({ visible: false });

    // 重置审批流详情
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail', payload: {} });
  }

  // 修改审批流
  onChangeExamineFlow = (val) => {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id: val } });
  }

  // 按要求显示用户名称
  reduceAccountList = (list) => {
    if (!list || (typeof (list) === 'object' && Array === list.constructor && list.length === 0)) return '无';
    return list.reduce((acc, cur, idx) => {
      if (idx === 0) return cur.name;
      return `${acc}, ${cur.name}`;
    }, '');
  }

  // 渲染节点审批人员信息
  renderNodeListText = (postList, accountList) => {
    const postText = postList
      && typeof (postList) === 'object'
      && Array === postList.constructor
      ? postList.reduce((acc, cur, idx) => {
        if (idx === 0) {
          return `${cur.post_name}(${this.reduceAccountList(cur.account_info_list)})`;
        }
        return `${acc}, ${cur.post_name}(${this.reduceAccountList(cur.account_info_list)})`;
      }, '')
      : '';
    const accountText = accountList
      && typeof (accountList) === 'object'
      && Array === accountList.constructor
      ? accountList.reduce((acc, cur, idx) => {
        if (idx === 0) return cur.name;
        return `${acc}, ${cur.name}`;
      }, '')
      : '';
    const text = postText && accountText
      ? `${postText}, ${accountText}`
      : postText || accountText;
    return text;
  }

  // 表单
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;

    // 传入审批流选择框组件的参数
    const props = {
      onChange: this.onChangeExamineFlow,
      bizType: ExpenseCostOrderBizType.noCostOf, // 非成本
      showSearch: true,
      optionFilterProp: 'children',
      placeholder: '请选择审批流',
      namespace: 'overTime',
      state: [OaApplicationFlowTemplateState.normal], // 状态
      style: { width: '100%' },
      approvalType: OaApplicationOrderType.takeLeave,
    };

    const formItems = [
      {
        label: '审批类型',
        form: '请假申请',
      },
      {
        label: '审批流',
        form: getFieldDecorator('examineFlowId', { rules: [{ required: true, message: '请选择审批流' }], initialValue: undefined })(
          <CommonSelectExamineFlows {...props} />,
        ),
      },
    ];

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  // 审批流信息
  renderFlowNodes = () => {
    // 审批流详情
    const { examineDetail = {} } = this.props;

    // 节点信息
    const { nodeList = [] } = examineDetail;

    if (nodeList.length === 0) return '';

    // 返回每个审批节点的信息
    return nodeList.map((item, index) => {
      return (
        <Steps direction="vertical" key={index} current={index + 1}>
          <Step title={`节点-${index + 1}`} description={this.renderNodeListText(item.postList, item.accountList)} />
        </Steps>
      );
    });
  }

  // 渲染弹窗
  renderModal = () => {
    const { visible } = this.state;
    const { onSubmit, onCancel } = this;

    // 弹窗不显示
    if (visible === false) return null;

    return (
      <Modal
        title="新建请假"
        visible={visible}
        onOk={onSubmit}
        onCancel={onCancel}
        okText="确认"
        cancelText="取消"
      >
        {/* 渲染表单 */}
        {this.renderForm()}
        {/* 渲染相应审批流的内容 */}
        {this.renderFlowNodes()}
      </Modal>
    );
  }

  // 渲染操作
  renderButton = () => {
    return (
      <Button
        type="primary"
        onClick={this.onAdd}
        className={styles['app-comp-expense-overTime-create-button']}
      >
        新建请假审批
      </Button>
    );
  }

  render() {
    return (
      <div className={styles['app-comp-expense-overTime-create-wrap']}>
        {/* 渲染操作 */}
        {this.renderButton()}
        {/* 渲染弹窗 */}
        {this.renderModal()}
      </div>
    );
  }
}

function mapStateToProps({ expenseExamineFlow: { examineDetail } }) {
  return { examineDetail };
}

export default connect(mapStateToProps)(Form.create()(Create));
