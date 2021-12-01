/**
 * 付款审批 - 创建红冲退款模态框
 */
import is from 'is_js';
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Steps, message } from 'antd';

import {
  OaApplicationOrderType,
  ExpenseCostOrderBizType,
  OaApplicationFlowTemplateState,
  InvoiceAjustAction,
} from '../../../../../application/define';
import { DeprecatedCoreForm } from '../../../../../components/core';
import { CommonSelectExamineFlows } from '../../../../../components/common';

const Step = Steps.Step;

class ModalForm extends Component {

  static propTypes = {
    visible: PropTypes.bool,                     // 弹窗是否可见
    selectedExamineFlowDetail: PropTypes.object, // 选中的审批流详情
    onCancel: PropTypes.func,                    // 隐藏弹窗的回调函数
  }

  static defaultProps = {
    visible: false,
    selectedExamineFlowDetail: {},
    onCancel: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      examineFlowDisabled: false,           // 审批流是否可选
    };
    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  // 清除数据
  componentWillUnmount = () => {
    this.onCancel();
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail' });
  };

  // 创建
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      // 获取审批流id
      const { examineFlowId } = values;
      // 账单单号ID  红冲(20)和退款(10)的标识
      const { OrderId, ActionType } = this.props;
      // 单点提交借口参数
      if (this.private.isSubmit) {
        this.props.dispatch({
          type: 'expenseExamineOrder/createExamineOrder',
          payload: {
            examineFlowId,
            approvalType: OaApplicationOrderType.cost,
            onSuccessCallback: this.onSuccessCallback,
            onFailureCallback: this.onFailureCallback,
            orderId: OrderId,
            actionType: ActionType,
          },
        });
        this.private.isSubmit = false;
      }
    });
  }
   //  请求成功回调
  onSuccessCallback = (date) => {
    // 账单单号ID  红冲(20)和退款(10)的标识
    const { OrderId, ActionType } = this.props;
    // 如果是红冲单，跳转到红冲单新建页面
    if (ActionType === InvoiceAjustAction.invoiceAdjust) {
      window.location.href = `/#/Expense/Manage/InvoiceAdjust?orderId=${OrderId}&invoiceAdjustId=${date._id}`;
    }
    // 如果是退款单，跳转到出退款新建页面
    if (ActionType === InvoiceAjustAction.refund) {
      window.location.href = `/#/Expense/Manage/RefundForm?orderId=${OrderId}&refundId=${date._id}`;
    }
    // 调用隐藏弹窗的回调
    this.onCancel();
  }
  //  请求失败回调
  onFailureCallback = (err) => {
    message.error(err.zh_message);
    this.private.isSubmit = true;
  }

  // 隐藏弹窗
  onCancel = () => {
    // 重置数据
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail', payload: {} });

    // 重置form的值
    const { form } = this.props;
    form.resetFields();

    // 调用上层回调
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }

    // 重置状态
    this.setState({
      selectedExamineFlowDetail: {},
      examineFlowDisabled: false,
    });
  }


  // 获取每次的审批流id
  onChangeExamineFlowId = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id } });
  }

  // 按要求显示用户名称
  reduceAccountList = (list) => {
    // 判断  list数组不存在 || list为空数组时
    if (!list || (is.array(list) && list.length === 0)) return '无';
    return list.reduce((acc, cur, idx) => {
      if (idx === 0) return cur.name;
      return `${acc}, ${cur.name}`;
    }, '');
  }

  // 渲染创建的表单
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { examineFlowDisabled } = this.props;

    // 添加审批流桩体
    const state = [OaApplicationFlowTemplateState.normal];
    // 传入审批流选择框组件的参数
    const props = {
      disabled: examineFlowDisabled,
      onChange: this.onChangeExamineFlowId,
      bizType: ExpenseCostOrderBizType.costOf,
      showSearch: true,
      optionFilterProp: 'children',
      placeholder: '请选择审批流',
      namespace: `create${ExpenseCostOrderBizType.costOf}`,
      state,
    };

    const formItems = [
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

  // 渲染节点审批人员信息
  renderNodeListText = (postList, accountList) => {
    const postText = postList && typeof (postList) === 'object'
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

  // 渲染相应审批流的内容
  renderFlowNodes = () => {
    const { selectedExamineFlowDetail } = this.props;

    // 判断审批节点信息是否存在
    if (is.not.existy(selectedExamineFlowDetail.nodeList) || is.empty(selectedExamineFlowDetail.nodeList)) {
      return '';
    }

    // 返回每个审批节点的信息
    return selectedExamineFlowDetail.nodeList.map((item, index) => {
      return (
        <Steps direction="vertical" key={index} current={index + 1}>
          <Step title={`节点-${index + 1}`} description={this.renderNodeListText(item.postList, item.accountList)} />
        </Steps>
      );
    });
  }

  render = () => {
    const { visible } = this.props;
    const { onSubmit, onCancel } = this;
    const { ActionType } = this.props;

    // 模态框title信息
    let modalTitle;

    // 如果是红冲单改变模态框title
    if (ActionType === InvoiceAjustAction.invoiceAdjust) {
      modalTitle = '红冲审批';
    }

    // 如果是红退款单改变模态框title
    if (ActionType === InvoiceAjustAction.refund) {
      modalTitle = '退款审批';
    }

    return (
      <Modal title={modalTitle} visible={visible} onOk={onSubmit} onCancel={onCancel} okText="确认" cancelText="取消">
        <Form>
          {/* 渲染表单 */}
          {this.renderForm()}
          {/* 渲染相应审批流的内容 */}
          {this.renderFlowNodes()}
        </Form>
      </Modal>
    );
  };
}

function mapStateToProps({ expenseExamineFlow: { examineDetail } }) {
  return { selectedExamineFlowDetail: examineDetail };
}

export default connect(mapStateToProps)(Form.create()(ModalForm));
