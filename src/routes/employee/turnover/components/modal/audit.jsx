/**
 * 服务费查询模块, 数据汇总页面-首页 - 提审弹窗
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal } from 'antd';

import { DeprecatedCoreForm } from '../../../../../components/core';
import {
  OaApplicationFlowTemplateApproveMode,
  OaApplicationFlowAssigned,
  ExpenseCostOrderBizType,
  OaApplicationFlowTemplateState,
  OaApplicationOrderType,
} from '../../../../../application/define';
import { CommonSelectExamineFlows } from '../../../../../components/common';
import ApprovePersonOrPost from '../../../../expense/manage/examineOrder/detail/approvePersonOrPost';


function AuditModal(props) {
  // 提交时，是否判断审批岗位
  const [isVerifyPost, setIsVerifyPost] = useState(false);
  // 提交时，是否是初次默认值
  const [isDefault, setIsDefault] = useState(true);
  // 是否禁用提交用组件的审批岗位下的审批人选择框
  const [isDisabledPerson, setIsDisabledPerson] = useState(false);
  // 审批流id
  const [examineFlowId, setExamineFlowId] = useState(undefined);

  const { isShowModal, onHideModal, turnoverId } = props;


  useEffect(() => {
    return () => {
      props.dispatch({ type: 'financeSummaryManage/resetSalarySubmitAudit' });
    };
  }, []);

  // 提交
  const onSubmit = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((errs, values) => {
      if (errs) {
        return;
      }
      // 获取自定义表单的值
      const { assignedPerson = {} } = values;
      const { postId, personId } = assignedPerson;
      // if (is.not.existy(turnoverId) || is.empty(turnoverId)) {
      //   return message.error('操作失败，请选择结算单');
      // }
      const params = {
        turnoverId, // 人员异动id
        accountId: personId,  // 接点人id
        postId, // 岗位id
        examineFlowId, // 审批流id
        onSuccessCallback: () => { window.location.href = '/#/Employee/Turnover'; },
      };
      props.dispatch({ type: 'employeeTurnover/EmployeeTurnoverApproval', payload: params });
      if (onHideModal) {
        onHideModal();
      }
    });
  };

  // 重置数据
  const onReset = () => {
    // 重置表单
    props.form.resetFields();
  };

   // 隐藏弹窗
  const onCancel = () => {
    setIsVerifyPost(false);
    setIsDefault(false);
    if (onHideModal) {
      onHideModal();
    }
    // 重置数据
    onReset();
  };

   // 修改审批流
  const onChangeExamineFlow = (val) => {
    const { dispatch } = props;
     // 审批流id
    setExamineFlowId(val);
    // 提交时，是否是初次默认值
    setIsDefault(true);
    // 审批人禁用
    setIsDisabledPerson(false);

    dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id: val } });
    // 重置数据
    onReset();
  };

   // 修改审批人或审批岗位
  const onChangePerson = (isVerifyPosts, isDisabledPersons) => {
     // 是否校验审批岗位下的审批人
    setIsVerifyPost(isVerifyPosts);
     // 提交用组件是否是初次默认值
    setIsDefault(false);
     // 是否禁用提交用组件的审批岗位下的审批人选择框
    setIsDisabledPerson(isDisabledPersons);
  };

   // 自定义Form校验
  const onVerify = (rule, value, callback) => {
    // 审批单详情
    const { auditData } = props;

    // 是否校验审批岗位下的审批人

    // 节点列表
    const nodeList = dot.get(auditData, 'nodeList', []);

    // 获取下一节点的审批人列表
    const examinePerson = dot.get(nodeList[0], 'accountList', []);

    // 获取下一节点的审批岗位列表
    const postList = dot.get(nodeList[0], 'postList', []);

    // 只有一个岗位时，重置岗位的校验
    if (postList.length === 1 && examinePerson.length === 0) {
      setIsVerifyPost(true);
    }
    // 判断：如果下一节点审批规则是全部 || (审批规则为任一 && 自动指派 && 选择至审批人),则不用校验
    if (rule.isApprovalAll === true || (rule.isApprovalAll === false && rule.isAutoMatic && isVerifyPost === false)) {
      callback();
      return;
    }
    // 判断：如果下一节点审批规则为任一 && 选择至审批岗位（审批岗位下的审批人必选），则全部校验
    if (rule.isApprovalAll === false && isVerifyPost === true && value.postId && value.personId) {
      callback();
      return;
    }
    // 判断：如果下一节点审批规则为任一 && 指派规则为手动 && 指派人选择至审批人
    if (rule.isApprovalAll === false && rule.isAutoMatic === false && isVerifyPost === false && value.personId) {
      callback();
      return;
    }

    // 如果校验不通过，则提示错误文本
    callback('请选择指派审批人或审批岗位');
  };

  // 渲染审批流
  const renderExamineFlow = () => {
    const { getFieldDecorator } = props.form;
    // 传入审批流选择框组件的参数
    const prop = {
      onChange: onChangeExamineFlow,
      bizType: ExpenseCostOrderBizType.noCostOf, // 非成本
      showSearch: true,
      optionFilterProp: 'children',
      placeholder: '请选择审批流',
      namespace: 'overTime',
      state: [OaApplicationFlowTemplateState.normal], // 状态
      style: { width: '100%' },
      approvalType: OaApplicationOrderType.turnover,
    };

    const formItems = [
      {
        label: '审批流',
        form: getFieldDecorator('examineFlowId', { rules: [{ required: true, message: '请选择审批流' }], initialValue: undefined })(
          <CommonSelectExamineFlows {...prop} />,
        ),
      },
    ];

    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </div>
    );
  };

   // 渲染添加标签的表单
  const renderCreateForm = () => {
    const { getFieldDecorator } = props.form;
    const { auditData } = props;

    // 如果不显示弹窗，return
    if (!props.isShowModal || Object.keys(auditData).length === 0) {
      return;
    }

    // 获取下一节点的审批规则
    let approveMode;
    // 获取下一节点的指派方式
    let pickMode;
    // 获取下一节点审批人，用于指派审批人
    let nextNodeAccountList = [];
    // 获取下一节点审批岗位列表
    let nextNodePostList = [];
    // 获取下一节点详情
    let nextNodeInfo = {};
    // 获取当前审批单所属审批流的节点列表
    const nodeList = dot.get(auditData, 'nodeList');
    // 获取提报节点之后的第一个节点的审批人
    if (is.existy(nodeList) && is.array(nodeList) && is.not.empty(nodeList)) {
      nextNodeInfo = nodeList[0] || {};
      nextNodeAccountList = dot.get(nodeList[0], 'accountList', []);
      nextNodePostList = dot.get(nodeList[0], 'postList', []);
      pickMode = dot.get(nodeList[0], 'pickMode');
      approveMode = nodeList[0].approveMode;
    }
    const rules = {
      message: '请选择审批人或审批岗位',
      isApprovalAll: false,
      isAutoMatic: false,
      required: false,
    };

    // 定义提交表单时的校验规则-审批规则
    if (approveMode === OaApplicationFlowTemplateApproveMode.all) {
      rules.isApprovalAll = true;
    }
    // 定义提交表但是的校验规则-指派规则
    if (pickMode === OaApplicationFlowAssigned.automatic) {
      rules.isAutoMatic = true;
    }

    // 是否必选
    if (!rules.isApprovalAll && !rules.isAutoMatic) {
      rules.required = true;
    }

    // 合并审批人与审批岗位
    const accountIdsData = nextNodeAccountList.concat(nextNodePostList);

    let postId; // 提交用岗位id
    let personId; // 提交用审批人id
    let postPersonId; // 显示用审批岗位/审批人id
    let personShowId; // 显示用审批岗位下的审批人id
    let isDisabledPost = false; // 是否禁用自定义组件的审批岗位/审批人选择框
    let isDisabledPersons = false; // 是否禁用审批岗位下的审批人选择框

    // 只有一个审批人 && 审批规则为任一
    if (
      nextNodePostList.length === 0
      && accountIdsData.length === 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
    ) {
      personId = nextNodeAccountList[0].id;
      personShowId = nextNodeAccountList[0].id;
      isDisabledPost = true;
    }

    // 只有一个岗位 && 审批规则为任一
    if (
      nextNodePostList.length === 1
      && accountIdsData.length === 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
    ) {
      postId = nextNodePostList[0]._id;
      personShowId = nextNodePostList[0]._id;
      isDisabledPost = true;
    }

    // 只有一个审批岗位 && 该岗位下只有一个审批人 && 审批规则为任一
    if (
      nextNodePostList.length === 1
      && accountIdsData.length === 1
      && nextNodePostList[0].account_ids.length === 1
      && approveMode === OaApplicationFlowTemplateApproveMode.any
    ) {
      personId = nextNodePostList[0].account_ids[0];
      postId = nextNodePostList[0]._id;
      postPersonId = nextNodePostList[0].account_ids[0];
      personShowId = nextNodePostList[0]._id;
      isDisabledPost = true;
      isDisabledPersons = true;
    }

    // 定义传入的参数
    const prop = {
      nextNodeDetail: nextNodeInfo,
      accountIdsData,
      postPersonList: nextNodePostList,
      onChangePerson,
      isDisabledPost,
      isDisabledPerson: isDefault ? isDisabledPersons : isDisabledPerson,
      postList: nextNodePostList,
      personList: nextNodeAccountList,
    };

    const formItems = [
      {
        label: '下一节点审批人',
        form: getFieldDecorator('assignedPerson',
          {
            initialValue: { personId, postId, postPersonId, personShowId },
            rules: [{ ...rules, validator: onVerify }],
            validateTrigger: onSubmit,
          })(
            <ApprovePersonOrPost {...prop} />,
          ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <div>
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </div>
    );
  };

  return (
    <Modal title="操作" visible={isShowModal} onOk={onSubmit} onCancel={onCancel} okText="创建" cancelText="取消">
      {/* 渲染审批流 */}
      {renderExamineFlow()}
      <Form>
        {renderCreateForm()}
      </Form>
    </Modal>
  );
}

AuditModal.propTypes = {
  isShowModal: PropTypes.bool,     // 弹窗是否可见
  onHideModal: PropTypes.func, // 隐藏弹窗的回调函数
  auditData: PropTypes.object, // 获取提审信息
};
AuditModal.defaultProps = {
  isShowModal: false,              // 弹窗是否可见
  onHideModal: () => {},        // 隐藏弹窗的回调函数
  auditData: {},               // 获取提审信息
};
function mapStateToProps({ employeeTurnover, expenseExamineFlow: { examineDetail } }) {
  return { employeeTurnover, auditData: examineDetail };
}
export default connect(mapStateToProps)(Form.create()(AuditModal));
