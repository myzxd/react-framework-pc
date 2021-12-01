/**
 * 审批流设置，审批流编辑/创建页面 /Expense/ExamineFlow/Form
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RightOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Button, Input, message, Row, Col, Radio, Popconfirm, Tooltip } from 'antd';

import { DeprecatedCoreForm, CoreContent } from '../../../components/core';
import {
  CommonSelectPlatforms,
  CommonSelectExpenseTypes,
  CommonSelectScene,
} from '../../../components/common';
import {
  ExpenseExamineFlowAmountAdjust,
  ExpenseCostOrderTemplateType,
  ExpenseCostOrderBizType,
  OaApplicationFlowTemplateApproveMode,
  OaApplicationFlowAssigned,
  OaApplicationFlowRegulation,
  AccountState,
} from '../../../application/define';
import styles from './style.less';
import CommonTransfor from '../components/commonTransfor/index';
import { ApplicationFlowNodeBrief } from '../../../application/object';

const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const { TextArea } = Input;

class ExpenseFlowCreact extends Component {
  static getDerivedStateFromProps(prevProps, state) {
    const { scense } = state;
    const prevScense = dot.get(prevProps, 'examineDetail.industryCodes.0', undefined);
    // 适用场景
    if (!scense && scense !== prevScense) {
      return { scense: prevScense };
    }

    return null;
  }

  static propTypes = {
    examineDetail: PropTypes.object,
  };

  static defaultProps = {
    examineDetail: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      nodeList: dot.get(props, 'examineDetail.nodeList', []),
      flowId: dot.get(props, 'flowId', undefined),
      newVisible: false, // 弹窗
      template: ExpenseCostOrderTemplateType.refund, // 默认模版
      value: [], // 节点id

      accountIds: [], // 按用户穿梭框值
      postIds: [], // 按岗位穿梭框值
      targetFlowNodeId: undefined, // 编辑的审批流节点id
      targetFlowNodeName: '', // 编辑的审批节点的名字
      isEditFlowNode: false,  // 编辑节点
      index: 0,
      level: undefined,
      levelNum: undefined,
      scense: undefined, // 适用场景
    };

    this.private = {
      isSubmit: true, // 防止多次提交
    };
  }

  // 清除数据
  componentWillUnmount = () => {
    this.setState({
      nodeList: [],
      accountIds: [],
      postIds: [],
    });
    const { dispatch } = this.props;
    dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail' });
    dispatch({ type: 'applicationCommon/resetEnumeratedValue', payload: {} });
  }

  // 适用场景
  onChangeScense = (val) => {
    const { form } = this.props;
    form.setFieldsValue({ platformCodes: undefined, costCatalogScope: undefined });
    this.setState({ scense: val });
  }

  // 确认创建
  onSubmitUpdate = (e) => {
    e.preventDefault();
    if (!this.private.isSubmit) return;
    const {
      examineDetail = {},
      form,
      dispatch,
    } = this.props;
    const { nodeList = [], flowId } = this.state;
    // 判断审批流值是否为空
    if (nodeList.length === 0) {
      return message.error('审批流节点设置不能为空');
    }
    // 获取付款节点
    const paymentNode = nodeList.filter(item => item.isPaymentNode);
    // 判断是否有多个付款节点
    if (paymentNode.length > 1) {
      return message.error('同一审批流不能出现多个付款节点');
    }
    const { bizType } = examineDetail;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.private.isSubmit = false;
        dispatch({
          type: 'expenseExamineFlow/updateExamineFlow',
          payload: {
            id: flowId,
            onSuccessCallback: this.onUpdateSuccessCallback,
            ...values,
            bizType,
            onFailureCallback: this.onFailureCallback,
          },
        });
      }
    });
  }

  // 失败回调
  onFailureCallback = () => {
    this.private.isSubmit = true;
  }

  // 取消创建
  onCancelUpdate = () => {
    // 返回主页面
    window.location.href = '/#/Expense/ExamineFlow/Process?isSetStorageSearchValue=true';
  }

  // 更新成功的回调
  onUpdateSuccessCallback = () => {
    this.private.isSubmit = true;
    // 跳转到审批流列表页面
    window.location.href = '/#/Expense/ExamineFlow/Process?isSetStorageSearchValue=true';
  }

  // 点击新建
  onClickTransfor = () => {
    this.setState({
      newVisible: true, // 穿梭框显示
      isEditFlowNode: false,
    });
  }

  // 点击修改
  onClickChange = (flowNodeId, flowNodeName, accountIds, postIds, index, level, levelNum) => {
    this.setState({
      newVisible: true,
      isEditFlowNode: true,         // 编辑审批流节点判断
      targetFlowNodeId: flowNodeId, // 编辑的审批流节点id
      targetFlowNodeName: flowNodeName, // 编辑的审批流节点name
      accountIds,          // 编辑的审批流节点操作人ids
      postIds,
      index,
      level,
      levelNum,
    });
  }

  // 点击取消
  onCancelTransfor = () => {
    this.setState({
      newVisible: false,
      accountIds: [],
      postIds: [],
      isEditFlowNode: false,       // 编辑审批流节点判断
      targetFlowNodeId: undefined, // 编辑的审批流节点id
      targetFlowNodeName: '', // 编辑的审批流节点name
      level: undefined,
      levelNum: undefined,
    });
  }

  // 确定选择
  onSelectTransfor = (accountIds, postIds, accountName, level, levelNum) => {
    const { flowId, targetFlowNodeId, isEditFlowNode, nodeList = [], index } = this.state;
    // 如果是编辑
    if (isEditFlowNode === true && targetFlowNodeId !== undefined) {
      // 修改审批流
      this.props.dispatch({
        type: 'expenseExamineFlow/updateExamineFlowNode',
        payload: {
          flowId,
          nodeId: nodeList[index].id,                               // 节点id
          record: {
            name: accountName,
            postIds,                                                // 岗位节点id
            accountIds,                                             // 修改审批人
            level,
            levelNum,
          },
          onSuccessCallback: this.onSuccessChangeCallback.bind(this, index),          // 改变节点
        },
      });
    } else {
      // 添加审批流
      this.props.dispatch({ type: 'expenseExamineFlow/createExamineFlowNode',
        payload: {
          id: flowId,
          record: {
            name: accountName,                                     // 节点名称
            postIds,                                                // 岗位节点id
            accountIds,                                            // 审批人
            level,
            levelNum,
          },
          onSuccessCallback: this.onSuccessCallback,
        } });
    }
  }

  // 编辑节点
  onClickFlowNodeEdit = (key) => {
    const { value } = this.state;
    const accountIds = value[key];
    this.setState({
      newVisible: true,
      accountIds,
      isEditFlowNode: true, // 编辑节点
      index: key, // 下标
    });
  }


  // 添加审批流节点
  onSuccessCallback = (result) => {
    if (result.record !== undefined) {
      const { nodeList = [] } = this.state;
      nodeList.push(ApplicationFlowNodeBrief.mapper(result.record, ApplicationFlowNodeBrief));
      this.setState({
        nodeList, // 审批流节点
      });
    }
  }

  // 调整金额的类型
  onChangeSelect = (val, index) => {
    const { nodeList = [], flowId } = this.state;
    this.setState({
      index, // 修改下标
    });
    // 审批人id列表
    const accountIds = nodeList[index].accountIds;
    const postIds = nodeList[index].postIds;
    this.props.dispatch({ type: 'expenseExamineFlow/updateExamineFlowNode',
      payload: {
        flowId,
        nodeId: nodeList[index].id,                    // 节点id
        record: {
          name: nodeList[index].name,                     // 节点名称
          costUpdateRule: val,                            // 审批规则
          accountIds,                                     // 审批人id列表
          postIds,                                        // 岗位节点id
        },
        onSuccessCallback: this.onSuccessChangeCallback.bind(this, index),   // 改变节点
      } });
  }

  // 审批规则
  onChangeApproval = (approveMode, index) => {
    const { nodeList = [], flowId } = this.state;
    this.setState({
      index, // 修改下标
    });
    // 审批人id列表
    const accountIds = nodeList[index].accountIds;
    const postIds = nodeList[index].postIds;
    this.props.dispatch({ type: 'expenseExamineFlow/updateExamineFlowNode',
      payload: {
        flowId,
        nodeId: nodeList[index].id,                    // 节点id
        record: {
          name: nodeList[index].name,                     // 节点名称
          approveMode,                                    // 审批规则
          accountIds,                                     // 审批人id列表
          postIds,                                        // 岗位节点
        },
        onSuccessCallback: this.onSuccessChangeCallback.bind(this, index),   // 改变节点
      },
    });
  }

  // 审批指派
  onChangeAssigned = (pickMode, index) => {
    const { nodeList = [], flowId } = this.state;
    // 审批人id列表
    const accountIds = nodeList[index].accountIds;
    const postIds = nodeList[index].postIds;
    this.props.dispatch({ type: 'expenseExamineFlow/updateExamineFlowNode',
      payload: {
        flowId,
        nodeId: nodeList[index].id,                    // 节点id
        record: {
          name: nodeList[index].name,                     // 节点名称
          pickMode,                                       // 审批指派
          accountIds,                                     // 审批人id列表
          postIds,                                        // 岗位节点
        },
        onSuccessCallback: this.onSuccessChangeCallback.bind(this, index),   // 改变节点
      },
    });
  }

  // 是否可修改提报的费用记录. 默认: false
  onChangeCanUpdateCostRecord = (e, index) => {
    const { nodeList = [], flowId } = this.state;
    this.setState({
      index, // 修改下标
    });
    // 审批人id列表
    const accountIds = nodeList[index].accountIds;
    const postIds = nodeList[index].postIds;
    this.props.dispatch({ type: 'expenseExamineFlow/updateExamineFlowNode',
      payload: {
        flowId,
        nodeId: nodeList[index].id,                    // 节点id
        record: {
          name: nodeList[index].name,                  // 节点名称
          canUpdateCostRecord: e.target.value,
          accountIds,                                     // 审批人id列表
          postIds,                                        // 岗位节点
        },
        onSuccessCallback: this.onSuccessChangeCallback.bind(this, index),          // 改变节点
      },
    });
  }

  // 付款节点
  onChangePaymentNode = (e, index) => {
    const { nodeList = [], flowId } = this.state;
    this.setState({
      index, // 修改下标
    });

    // 当前操作节点详情
    const currentNode = nodeList[index] || {};
    // 当前节点是否为标记付款
    const { isInspectBillNode = false } = currentNode;

    if (isInspectBillNode === true) return message.error('同一个审批流节点中，标记付款、标记验票只能选择一个“是”');
    // 判断是否存在付款节点
    const isPaymentNode = nodeList.some(item => item.isPaymentNode === true);
    if (isPaymentNode === true && e.target.value === true) {
      return message.error('同一审批流不能出现多个付款节点');
    }
    // 审批人id列表
    const accountIds = nodeList[index].accountIds;
    const postIds = nodeList[index].postIds;
    this.props.dispatch({ type: 'expenseExamineFlow/updateExamineFlowNode',
      payload: {
        flowId,
        nodeId: nodeList[index].id,                    // 节点id
        record: {
          name: nodeList[index].name,                     // 节点名称
          isPaymentNode: e.target.value,
          accountIds,                                     // 审批人id列表
          postIds,                                        // 岗位节点
        },
        onSuccessCallback: this.onSuccessChangeCallback.bind(this, index),   // 改变节点
      } });
  }

  // 标记验票
  onChangeCheckTicket = (e, index) => {
    this.setState({
      index, // 修改下标
    });
    const { nodeList = [], flowId } = this.state;

    // 当前操作节点详情
    const currentNode = nodeList[index] || {};

    // 当前节点是否为标记付款
    const { isPaymentNode = false } = currentNode;

    if (isPaymentNode === true) return message.error('同一个审批流节点中，标记付款、标记验票只能选择一个“是”');

    // 验票节点规则（审批流只能存在一个验票节点）
    const ticketNode = nodeList.filter(i => i.isInspectBillNode === true).length || 0;

    if (ticketNode >= 1 && e.target.value === true) return message.error('同一个审批流中，只能有一个标记验票的节点');

    // 审批人id列表
    const accountIds = nodeList[index].accountIds;
    const postIds = nodeList[index].postIds;
    this.props.dispatch({ type: 'expenseExamineFlow/updateExamineFlowNode',
      payload: {
        flowId,
        nodeId: nodeList[index].id,                    // 节点id
        record: {
          name: nodeList[index].name,                     // 节点名称
          accountIds,                                     // 审批人id列表
          postIds,                                        // 岗位节点
          isInspectBillNode: e.target.value,
        },
        onSuccessCallback: this.onSuccessChangeCallback.bind(this, index),   // 改变节点
      } });
  }

  // 删除审批流节点
  onClickRemove = (nodeId, index) => {
    const { flowId } = this.state;
    this.setState({
      index, // 修改下标
    });
    this.props.dispatch({
      type: 'expenseExamineFlow/deleteExamineFlowNode',
      payload: {
        flowId, // 审批流ID
        nodeId, // 节点id
        // index, // 下标
        onSuccessRemoveCallback: this.onSuccessRemoveCallback,  // 删除节点回调
      },
    });
  }

  // 改变节点之后回调
  onSuccessChangeCallback = (index, result) => {
    if (result.record !== undefined) {
      const { nodeList = [] } = this.state;
      nodeList[index] = ApplicationFlowNodeBrief.mapper(result.record, ApplicationFlowNodeBrief);
      this.setState({
        nodeList,
      });
    }
  }

  // 删除节点回调
  onSuccessRemoveCallback = () => {
    const { nodeList, index } = this.state;
    nodeList.splice(index, 1);
    this.setState({
      nodeList,  // 审批流节点
    });
  }

  // 部门搜索模糊搜索
  onTreeSelectorFilter = (inputValue, nodeValue) => {
    // inputValue去掉收尾空格不为空 && nodeValue 存在  &&  nodeValue的props 存在  &&  nodeValue.props.title包含inputValue
    return (!!(inputValue.trim()
      && nodeValue
      && nodeValue.props
      && nodeValue.props.title.trim().indexOf(inputValue.trim()) !== -1));
  }

  // 审批节点名称
  renderProcessName = (accountList = [], postList = []) => {
    return (
      <div>
        {/* 用户节点名称 */}
        {
          accountList.map((item, index) => {
            return (
              <span key={index} className={styles['app-comp-expense-examine-flow-form-node-name']}>
                {item.name}{Number(item.state) === AccountState.off ?
                  `(${AccountState.description(item.state)})` : ''}
                { index !== accountList.length - 1 ? <strong className={styles['app-comp-expense-examine-flow-form-node-text']}>|</strong> : null }
              </span>
            );
          })
        }
        {postList.length > 0 && accountList.length > 0 ? (
          <span className={styles['app-comp-expense-examine-flow-form-node-name']}>
            <strong className={styles['app-comp-expense-examine-flow-form-node-text']}>|</strong>
          </span>
        ) : ''}
        {/* 岗位节点名称 */}
        {
          postList.map((item, index) => {
            return (
              <span key={index} className={styles['app-comp-expense-examine-flow-form-node-name']}>
                {item.post_name}
                { index !== postList.length - 1 ? <strong className={styles['app-comp-expense-examine-flow-form-node-text']}>|</strong> : null }
              </span>
            );
          })
        }
      </div>
    );
  }

  // 岗位节点名称
  renderPostListName = (array) => {
    return (
      <div>
        {
          array.map((item, index) => {
            return (
              <span key={index} className={styles['app-comp-expense-examine-flow-form-node-name']}>
                {item.post_name}
                { index !== array.length - 1 ? <strong className={styles['app-comp-expense-examine-flow-form-node-text']}>|</strong> : null }
              </span>
            );
          })
        }
      </div>
    );
  }

  // 渲染表单
  renderForm = () => {
    // 适用场景
    const { scense = undefined } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { examineDetail = {} } = this.props;

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    const formItems = [
      {
        label: '审批流名称',
        layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
        form: getFieldDecorator('name', { rules: [
          { required: true, message: '请输入审批流名称' },
          { max: 20, message: '字数过多' },
        ],
          initialValue: examineDetail.name })(
            <Input placeholder="请填写内容" />,
        ),
      },
      {
        label: '审批流类型',
        layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
        form: ExpenseCostOrderBizType.description(examineDetail.bizType),
      },
      {
        label: '适用类型',
        layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
        form: getFieldDecorator('applyApplicationTypes', { rules: [
          { required: true, message: '请选择审批流适用类型' },
        ],
          initialValue: examineDetail.applyApplicationTypes })(
            <CommonSelectScene
              mode="multiple"
              showArrow
              examineFlowBiz={examineDetail.bizType}
              enumeratedType="examineFlowApplyApplicationTypes"
            />,
        ),
      },
    ];

    examineDetail.bizType === ExpenseCostOrderBizType.costOf && (formItems[formItems.length] = {
      label: '适用场景',
      layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
      form: getFieldDecorator('scense', { rules: [
        { required: true, message: '请选择适用场景' },
      ],
        initialValue: dot.get(examineDetail, 'industryCodes.0', undefined) })(
          <CommonSelectScene
            enumeratedType="subjectScense"
            onChange={this.onChangeScense}
          />,
      ),
    });

    formItems[formItems.length] = {
      label: '使用范围',
      layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
      form: getFieldDecorator('platformCodes', { rules: [
        { required: true, message: '请选择使用范围' },
      ],
        initialValue: examineDetail.platformCodes ? examineDetail.platformCodes[0] : undefined })(
          <CommonSelectPlatforms
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择使用范围"
            scense={scense}
          />,
      ),
    };

    // 判断是否是成本类 如果是成本类 则渲染 默认模版 和 费用分组
    if (examineDetail.bizType === ExpenseCostOrderBizType.costOf) {
      formItems.push(
        {
          label: '默认模版',
          layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
          form: getFieldDecorator('template', { rules: [{ required: true, message: '请选择模版' }],
            initialValue: examineDetail.extraUiOptions ? `${examineDetail.extraUiOptions.form_template}` : `${ExpenseCostOrderBizType.costOf}` })(
              <Select placeholder="请选择模版">
                <Option value={`${ExpenseCostOrderTemplateType.refund}`}>{ExpenseCostOrderTemplateType.description(ExpenseCostOrderTemplateType.refund)}</Option>
              </Select>,
          ),
        },
        {
          label: '费用分组',
          layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
          form: getFieldDecorator('costCatalogScope', { rules: [{ required: true, message: '请选择费用分组' }], initialValue: examineDetail.costCatalogScope || [] })(
            <CommonSelectExpenseTypes
              placeholder="请选择费用分组"
              mode="multiple"
              showArrow
              allowClear
              optionFilterProp="children"
              scense={scense}
            />,
          ),
        },
        {
          label: '审批流描述',
          layout: { labelCol: { span: 4 }, wrapperCol: { span: 18 } },
          form: getFieldDecorator('note', { rules: [{ max: 200, message: '字数过多' }], initialValue: examineDetail.note })(
            <TextArea autoSize={{ minRows: 5 }} placeholder="请输入审批流描述(选填)" />,
          ),
        },
      );
    }
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} className={styles['app-comp-expense-examine-flow-form-info']} />
      </div>
    );
  }

  // 判断是否显示调控
  renderCostRecord = (index) => {
    const { examineDetail = {} } = this.props;
    const { nodeList } = this.state;

    const { approveLevelType = undefined } = nodeList[index];
    // 节点选择层级，其他条件禁用
    const isLevelDisabled = !!approveLevelType;
    // 审批流类型
    const { bizType } = examineDetail;
    // 成本类显示调控
    if (bizType === ExpenseCostOrderBizType.costOf) {
      return (
        <React.Fragment>
          <div className={styles['app-comp-expense-node-label']}>调&nbsp;&nbsp;&nbsp;&nbsp;控</div>
          <RadioGroup
            name="canUpdateCostRecord"
            size="small"
            className={styles['app-comp-expense-examine-flow-form-regulation']}
            value={nodeList[index].canUpdateCostRecord}
            onChange={(e) => { this.onChangeCanUpdateCostRecord(e, index); }}
            disabled={isLevelDisabled}
          >
            <RadioButton value={OaApplicationFlowRegulation.no}>{OaApplicationFlowRegulation.description(OaApplicationFlowRegulation.no)}</RadioButton>
            <RadioButton value={OaApplicationFlowRegulation.is}>{OaApplicationFlowRegulation.description(OaApplicationFlowRegulation.is)}</RadioButton>
          </RadioGroup>
        </React.Fragment>
      );
    }
    return null;
  }

  // 审批节点类型
  renderSelect = (index) => {
    const { nodeList } = this.state;
    const { examineDetail = {} } = this.props;

    // 审批流类型
    const { bizType } = examineDetail;
    const { approveLevelType = undefined } = nodeList[index];

    // 节点选择层级，其他条件禁用
    const isLevelDisabled = !!approveLevelType;

    // 判断调控是否，否时金额调整禁用
    const amountDisabled = nodeList[index].canUpdateCostRecord === OaApplicationFlowRegulation.no;
    // 审批规则是全部时，审批指派禁用
    const assignedDisabled = Number(nodeList[index].approveMode) === OaApplicationFlowTemplateApproveMode.all;
    return (
      <div layout="vertical">
        {/* 判断是否显示调控 */}
        {this.renderCostRecord(index)}

        {/* 判断是否是成本类 如果是成本类 则渲染 金额调整*/}
        {
          examineDetail.bizType === ExpenseCostOrderBizType.costOf ? <Select
            size="small"
            placeholder="请选择金额调整"
            className={styles['app-comp-expense-examine-flow-form-amount']}
            value={`${nodeList[index].costUpdateRule}`}
            disabled={amountDisabled || isLevelDisabled}
            onChange={(arg) => { this.onChangeSelect(arg, index); }}
          >
            <Option value={`${ExpenseExamineFlowAmountAdjust.upward}`}>{ExpenseExamineFlowAmountAdjust.description(ExpenseExamineFlowAmountAdjust.upward)}</Option>
            <Option value={`${ExpenseExamineFlowAmountAdjust.down}`}>{ExpenseExamineFlowAmountAdjust.description(ExpenseExamineFlowAmountAdjust.down)}</Option>
            <Option value={`${ExpenseExamineFlowAmountAdjust.any}`}>{ExpenseExamineFlowAmountAdjust.description(ExpenseExamineFlowAmountAdjust.any)}</Option>
          </Select> : null
        }
        <div className={styles['app-comp-expense-node-label']}>审批规则</div>
        <Select
          size="small"
          placeholder="请选择审批规则"
          className={styles['app-comp-expense-examine-flow-form-rules']}
          value={`${nodeList[index].approveMode}`}
          onChange={(arg) => { this.onChangeApproval(arg, index); }}
          disabled={isLevelDisabled}
        >
          <Option value={`${OaApplicationFlowTemplateApproveMode.all}`}>{OaApplicationFlowTemplateApproveMode.description(OaApplicationFlowTemplateApproveMode.all)}</Option>
          <Option value={`${OaApplicationFlowTemplateApproveMode.any}`}>{OaApplicationFlowTemplateApproveMode.description(OaApplicationFlowTemplateApproveMode.any)}</Option>
        </Select>
        <Select
          size="small"
          placeholder="请选择"
          className={styles['app-comp-expense-examine-flow-form-any']}
          value={`${nodeList[index].pickMode}`}
          disabled={assignedDisabled || isLevelDisabled}
          onChange={(arg) => { this.onChangeAssigned(arg, index); }}
        >
          <Option value={`${OaApplicationFlowAssigned.automatic}`}>{OaApplicationFlowAssigned.description(OaApplicationFlowAssigned.automatic)}</Option>
          <Option value={`${OaApplicationFlowAssigned.manual}`}>{OaApplicationFlowAssigned.description(OaApplicationFlowAssigned.manual)}</Option>
        </Select>
        <div className={styles['app-comp-expense-node-label']}>标记付款</div>
        <RadioGroup name="paymentNode" size="small" value={nodeList[index].isPaymentNode} onChange={(e) => { this.onChangePaymentNode(e, index); }} disabled={isLevelDisabled}>
          <RadioButton value={false}>否</RadioButton>
          <RadioButton
            value
          >是</RadioButton>
        </RadioGroup>
        <div className={styles['app-comp-expense-node-label']}>
          标记验票
          <Tooltip title="适用的审批单审批类型：费用申请、差旅报销">
            <span className={styles['app-comp-expense-node-ticket-title']}><InfoCircleOutlined /></span>
          </Tooltip>
        </div>
        <RadioGroup
          disabled={bizType === ExpenseCostOrderBizType.noCostOf}
          name="paymentNode"
          size="small"
          value={nodeList[index].isInspectBillNode}
          onChange={(e) => { this.onChangeCheckTicket(e, index); }}
        >
          <RadioButton value={false}>否</RadioButton>
          <RadioButton
            value
          >是</RadioButton>
        </RadioGroup>
      </div>
    );
  }

  // 渲染审批流设置
  renderProcessGroup = () => {
    const { nodeList } = this.state;
    const content = [];
    // 将审批人列表循环
    nodeList.forEach((item, index) => {
      content.push(
        <Col className={styles['app-comp-expense-node-operate']} key={index}>
          <Row className={styles['app-comp-expense-node-people-container']} span={24}>
            <Col span={24}>
              <Row span={24} className={styles['app-comp-expense-node-name']}>
                <Col span={24}><span className={styles['app-comp-expense-round']} />{item.name}</Col>
              </Row>
              <Row span={24} className={styles['app-comp-expense-node-approval-people']}>
                {/* 审批节点名称 */}
                {this.renderProcessName(item.accountList, item.postList)}
              </Row>
              <Row span={24} className={styles['app-comp-expense-node-people-content']}>
                {this.renderSelect(index)}
              </Row>
              <Row span={24} gutter={0} type="flex" justify="center" align="middle">
                <Col span={12} className={styles['app-comp-expense-node-people-button']} >
                  <span className={styles['app-comp-expense-examine-flow-form-modify-button']} onClick={() => { this.onClickChange(item.id, item.name, item.accountIds, item.postIds, index); }}><EditOutlined /> 修改 </span>
                </Col>
                <Col span={12} className={styles['app-comp-expense-node-people-button']}>
                  <Popconfirm title="确认删除当前节点?" onConfirm={() => { this.onClickRemove(item.id, index); }} okText="删除" cancelText="取消">
                    <span className={styles['app-comp-expense-examine-flow-form-detele-button']}><DeleteOutlined /> 删除 </span>
                  </Popconfirm>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>,
      );
      content.push(
        <Col span={1} key={`key-${index}`} className={styles['app-comp-expense-node-arrow']}><RightOutlined className={styles['app-comp-expense-examine-flow-form-icon']} /></Col>,
      );
    });
    return content;
  }

  // 渲染流程图
  renderProcess = () => {
    return (
      <Row span={24} gutter={8} type="flex" align="middle">
        {/* 申请人 */}
        <Col span={1} className={styles['app-comp-expense-node']}>
          <Row span={24} gutter={8} type="flex" align="middle" className={styles['app-comp-expense-examine-flow-form-process']}>
            <Col span={24}><span className={styles['app-comp-expense-examine-flow-form-apply']}>申请人</span></Col>
          </Row>
        </Col>
        <Col span={1} className={styles['app-comp-expense-node-arrow']}><RightOutlined className={styles['app-comp-expense-examine-flow-form-icon']} /></Col>

        {/* 渲染节点信息 */}
        {this.renderProcessGroup()}

        <Col className={styles['app-comp-expense-add-node-operate']}>
          {/* 加号点击新增审批流 */}
          <Button icon={<PlusOutlined />} type="primary" onClick={this.onClickTransfor}>新增节点</Button>
        </Col>
      </Row>
    );
  }

  // 审批人弹框
  renderFlowNodeOperateAccounts = () => {
    const {
      isEditFlowNode,
      targetFlowNodeId,
      accountIds,
      postIds,
      targetFlowNodeName,
      newVisible,
      level,
      levelNum,
    } = this.state;
    const { examineDetail = {} } = this.props;
    const props = {
      isEditFlowNode,         // 编辑审批流节点判断
      targetFlowNodeId,       // 编辑的审批流节点id
      accountIds,             // 编辑的审批流节点操作人ids
      postIds,
      targetFlowNodeName,     // 编辑的审批流节点name
      onCancel: this.onCancelTransfor, // 点击取消
      visible: newVisible, // 弹窗是否显示
      onSelect: this.onSelectTransfor, // 确定选择
      level,
      levelNum,
      examineDetail,
    };
    return (
      <CommonTransfor {...props} />
    );
  }

  render = () => {
    const formItemLayoutOperate = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    const flowId = dot.get(this.props, 'location.query.flowId', undefined);
    const { examineDetail = {} } = this.props;
    if (flowId && Object.keys(examineDetail).length <= 0) return <div />;

    return (
      <Form>
        <CoreContent title="审批流详情设置">
          {/* 渲染表单 */}
          {this.renderForm()}
        </CoreContent>
        <CoreContent title="审批流节点设置">
          <FormItem {...formItemLayoutOperate} key={'operate'} className={styles['app-comp-expense-examine-flow-form-setting']}>
            <div>
              {this.renderProcess()}
            </div>
          </FormItem>
          <FormItem className={styles['app-comp-expense-examine-flow-form-button']}>
            <Button
              type="primary"
              onClick={this.onSubmitUpdate}
              className={styles['app-comp-expense-examine-flow-form-submit']}
            >确定</Button>
            <Button type="default" onClick={this.onCancelUpdate}>取消</Button>
          </FormItem>
        </CoreContent>
        {/* 渲染编辑弹窗 */}
        { this.renderFlowNodeOperateAccounts() }
      </Form>
    );
  }
}

const WrappedSearchComponent = Form.create()(ExpenseFlowCreact);
export default connect()(WrappedSearchComponent);
