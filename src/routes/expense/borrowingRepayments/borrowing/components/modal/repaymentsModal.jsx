/**
 * 还款弹窗
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Steps } from 'antd';

import {
  ExpenseCostOrderBizType,
  OaApplicationOrderType,
  OaApplicationFlowTemplateState,
} from '../../../../../../application/define';
import { DeprecatedCoreForm } from '../../../../../../components/core';
import { CommonSelectExamineFlows } from '../../../../../../components/common';

const Step = Steps.Step;

class RepaymentsModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    dispatch: PropTypes.func,
    onCancel: PropTypes.func,
    borrowOrderId: PropTypes.string,
    flowInfo: PropTypes.object,
    state: PropTypes.string,
    examineDetail: PropTypes.object,
  };

  static defaultProps = {
    visible: false,
    dispatch: () => {},
    onCancel: () => {},
    borrowOrderId: '',
    flowInfo: {},
    state: '',
    examineDetail: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isDefault: true,                      // 是否显示默认审批流
    };
    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  // 清除数据
  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail' });
  }

  // 隐藏弹窗
  onCancel = () => {
    const { onCancel, form } = this.props;

    // 重置form值
    form.resetFields();

    // 重置审批流节点信息
    this.setState({
      isDefault: true,
    });

    if (onCancel) {
      onCancel();
    }
  }

  // 获取每次的审批流id
  onChangeExamineFlowId = (e) => {
    const { isDefault } = this.state;
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id: e } });

    if (isDefault) {
      this.setState({
        isDefault: false,
      });
    }
  }

  // 提交
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      // 获取审批流id、审批类型
      const { examineFlowId, approvalType } = values;
      const { dispatch } = this.props;

      // 防止重复提交
      if (this.private.isSubmit) {
        dispatch({
          type: 'expenseExamineOrder/createExamineOrder',
          payload: {
            examineFlowId,            // 审批流id
            approvalType,             // 审批类型
            onSuccessCallback: this.onSuccessCreateRepaymentOrderCallback,  // 成功的回调
            onFailureCallback: this.onFailureCallback,      // 失败的回调
          },
        });
        this.private.isSubmit = false;
      }
    });
  }

  // 创建新的审核单成功回调
  onSuccessCallback = (repayOrder, applicationOrderId) => {
    // 页面跳转
    window.location.href = `/#/Expense/BorrowingRepayments/Repayments/Update?applicationOrderId=${applicationOrderId}&repayOrderId=${repayOrder._id}`;

    // 调用隐藏弹窗的回调
    this.onCancel();
  }

  // 创建新的还款单成功回调
  onSuccessCreateRepaymentOrderCallback = (examineOrder) => {
    // 调用新建还款单的dispatch
    this.props.dispatch({
      type: 'borrowingRepayment/createRepayOrder',
      payload: {
        applicationOrderId: examineOrder._id,           // 审批单id
        borrowOrderId: this.props.borrowOrderId,        // 借款单id
        onSuccessCallback: this.onSuccessCallback,      // 成功的回调
        onFailureCallback: this.onFailureCallback,      // 失败的回调
      },
    });
  }

  //  请求失败回调
  onFailureCallback = () => {
    // 重置防止多次提交
    this.private.isSubmit = true;

    // 调用隐藏弹窗的回调
    this.onCancel();
  }

  // 按要求显示用户名称
  reduceAccountList = (list) => {
    if (!list || (typeof (list) === 'object' && Array === list.constructor && list.length === 0)) return '无';
    return list.reduce((acc, cur, idx) => {
      if (idx === 0) return cur.name;
      return `${acc}, ${cur.name}`;
    }, '');
  }

  // 渲染form
  renderForm = () => {
    const { state, flowInfo = {}, form = {} } = this.props;
    // 获取借款单的审批流id，用作还款单的审批流默认值（正常状态的审批流）
    const flowId = state === OaApplicationFlowTemplateState.normal
      ? dot.get(flowInfo, '_id', undefined)
      : undefined;

    // 传入审批流选择框组件的参数
    const props = {
      onChange: this.onChangeExamineFlowId,     // onChange
      bizType: ExpenseCostOrderBizType.noCostOf,   // 非成本类
      showSearch: true,
      optionFilterProp: 'children',
      placeholder: '请选择审批类型',
      approvalType: OaApplicationOrderType.repayments,
    };

    const { getFieldDecorator } = form;

    const formItems = [
      {
        label: '审批类型',
        form: getFieldDecorator('approvalType', { initialValue: OaApplicationOrderType.repayments })(
          <span>还款</span>,
        ),
      },
      {
        label: '审批流',
        form: getFieldDecorator('examineFlowId', { rules: [{ required: true, message: '请选择审批流' }], initialValue: flowId })(
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


  // 渲染相应审批流的内容
  renderFlowNodes = () => {
    const { isDefault } = this.state;
    const { flowInfo, state, examineDetail = {} } = this.props;

    // 判断：如果是默认值，并且审批流节点列表有值
    if (isDefault === true
      && is.not.empty(flowInfo.node_list) && is.existy(flowInfo.node_list)
      && state === OaApplicationFlowTemplateState.normal
    ) {
      // 默认审批流的节点列表包含提报节点，需要移除
      return flowInfo.node_list.map((item, index) => {
        return (
          <Steps direction="vertical" key={index} current={index + 1}>
            <Step title={`节点-${index + 1}`} description={this.renderNodeListText(item.post_list, item.account_list)} />
          </Steps>
        );
      });
    }

    // 判断：如果不是默认值，并且审批流节点列表有值
    if (isDefault === false
      && is.existy(examineDetail.nodeList)
      && is.not.empty(examineDetail.nodeList)
    ) {
      return examineDetail.nodeList.map((item, index) => {
        return (
          <Steps direction="vertical" key={index} current={index + 1}>
            <Step title={`节点-${index + 1}`} description={this.renderNodeListText(item.postList, item.accountList)} />
          </Steps>
        );
      });
    }

    return '';
  }

  render() {
    const { visible } = this.props;
    const { onSubmit, onCancel } = this;
    return (
      <div>
        <Modal title="还款" visible={visible} onOk={onSubmit} onCancel={onCancel} okText="确认" cancelText="取消">
          <Form>
            {/* 渲染表单 */}
            {this.renderForm()}
            {/* 渲染相应审批流的内容 */}
            {this.renderFlowNodes()}
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ expenseExamineFlow: { examineDetail } }) {
  return { examineDetail };
}

export default connect(mapStateToProps)(Form.create()(RepaymentsModal));
