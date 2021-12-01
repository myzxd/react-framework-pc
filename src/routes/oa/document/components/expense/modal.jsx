/**
 * 发起审批 - 费控管理 - 创建弹窗
 */
import is from 'is_js';
import dot from 'dot-prop';
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
} from '../../../../../application/define';
import { DeprecatedCoreForm } from '../../../../../components/core';
import { CommonSelectExamineFlows } from '../../../../../components/common';

const Step = Steps.Step;

class ModalForm extends Component {

  static propTypes = {
    visible: PropTypes.bool,                     // 弹窗是否可见
    onCancel: PropTypes.func,                    // 隐藏弹窗的回调函数
    selectedExamineFlowDetail: PropTypes.object, // 选中的审批流详情
  }

  static defaultProps = {
    visible: false,                              // 弹窗是否可见
    onCancel: () => {},                          // 隐藏弹窗的回调函数
    selectedExamineFlowDetail: {},               // 选中的审批流详情
  }

  constructor(props) {
    super(props);
    this.state = {
      examineFlowDisabled: false,                 // 审批流是否可选
    };
    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail' });
  }

  // 清除数据
  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail' });
  }

  // 创建
  onSubmit = (e) => {
    // 选择的审批流详情
    const { selectedExamineFlowDetail, type } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      // 获取审批流id、审批类型
      const { examineFlowId } = values;

      // 所选审批流的节点信息
      const { nodeList = [] } = selectedExamineFlowDetail;

      // 该审批流是否存在付款节点
      const isPayNode = nodeList.find(item => item.isPaymentNode === true);

      // 新建审批单为借款类型 && 该审批流没有付款节点
      if (type === OaApplicationOrderType.borrowing && isPayNode === undefined) {
        return message.error('借款审批流无付款节点，请求失败！');
      }

      if (this.private.isSubmit) {
        this.props.dispatch({
          type: 'expenseExamineOrder/createExamineOrder',
          payload: {
            examineFlowId,
            approvalType: type,
            onSuccessCallback: this.onSuccessCallback,
            onFailureCallback: this.onFailureCallback,
          },
        });
        this.private.isSubmit = false;
      }
    });
  }

  // 创建新的审核数据成功回调
  onSuccessCallback = (examineOrder) => {
    // 获取新创建的审批单的类型
    const applicationOrderType = dot.get(examineOrder, 'application_order_type', 1);
    const { selectedTabKey } = this.props;
    // 如果是借款单，则跳转到借款单的新建页面
    if (applicationOrderType === OaApplicationOrderType.borrowing) {
      window.location.href = `/#/Expense/BorrowingRepayments/Borrowing/Create?applicationOrderId=${examineOrder._id}`;
    }
    // 判断差旅申请和费用申请
    if (applicationOrderType === OaApplicationOrderType.cost || applicationOrderType === OaApplicationOrderType.travel) {
      // 跳转到付款审批创建页面
      window.location.href = `/#/Expense/Manage/ExamineOrder/Form?orderId=${examineOrder._id}&approvalKey=${selectedTabKey}`;
    }
    // 如果是出差单，跳转到出差单新建页面
    if (applicationOrderType === OaApplicationOrderType.business) {
      window.location.href = `/#/Expense/Manage/ExamineOrder/BusinessTrip/Create?applicationOrderId=${examineOrder._id}`;
    }
    // 重置数据
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail', payload: {} });

    // 调用隐藏弹窗的回调
    this.onCancel();
  }

  //  请求失败回调
  onFailureCallback = (err) => {
    message.error(err.zh_message);
  }

  // 隐藏弹窗
  onCancel = () => {
    const { onCancel } = this.props;
    const { form } = this.props;
    // 重置数据
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail', payload: {} });

    // 重置form的值
    form.resetFields();

    // 重置状态
    this.setState({
      examineFlowDisabled: false,
    });

    // 调用上层回调
    if (onCancel) {
      onCancel();
    }
  }

  // 获取每次的审批流id
  onChangeExamineFlowId = (e) => {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id: e } });
  }

  // 按要求显示用户名称
  reduceAccountList = (list) => {
    if (!list || (typeof (list) === 'object' && Array === list.constructor && list.length === 0)) return '无';
    return list.reduce((acc, cur, idx) => {
      if (idx === 0) return cur.name;
      return `${acc}, ${cur.name}`;
    }, '');
  }

  // 渲染创建的表单
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { examineFlowDisabled } = this.state;
    const { type } = this.props;

    // 定义审批流成本类型
    let bizType;
    if (type === OaApplicationOrderType.cost || type === OaApplicationOrderType.travel) {
      bizType = ExpenseCostOrderBizType.costOf;
    }

    if (type === OaApplicationOrderType.borrowing || type === OaApplicationOrderType.business) {
      bizType = ExpenseCostOrderBizType.noCostOf;
    }
    // 添加审批流桩体
    const state = [OaApplicationFlowTemplateState.normal];
    // 传入审批流选择框组件的参数
    const props = {
      disabled: examineFlowDisabled,
      onChange: this.onChangeExamineFlowId,
      bizType,
      showSearch: true,
      optionFilterProp: 'children',
      placeholder: '请选择审批流',
      namespace: `create${bizType}`,
      state,
      approvalType: type,
      // allowClear: true,
    };
    const formItems = [
      {
        label: '审批类型',
        form: dot.get(this.props, 'title', '--'),
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

    return (
      <Modal title="新建申请" visible={visible} onOk={onSubmit} onCancel={onCancel} okText="确认" cancelText="取消">
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

function mapStateToProps({ expenseExamineFlow: { examineDetail = {} } }) {
  return { selectedExamineFlowDetail: examineDetail };
}

export default connect(mapStateToProps)(Form.create()(ModalForm));
