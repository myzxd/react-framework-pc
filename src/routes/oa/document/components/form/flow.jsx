/**
 * 事务性表单 - 审批流信息
 */
import dot from 'dot-prop';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Steps, message } from 'antd';
import is from 'is_js';
import {
  OaApplicationFlowTemplateState,
  ExpenseCostOrderBizType,
} from '../../../../../application/define';

const Step = Steps.Step;

const ExamineFlow = ({
  isDetail,
  examineFlowInfo = [],   // 审批流预览信息
  dispatch,
  departmentId,
  flowId,                 // 审批流id
  rank,                   // 职级
  pageType,               // 事务性类型
  sealType,               // 印章类型
  accountId,
  setFlowId,
  specialDepartmentId,    // 特殊部门id
  pactType,               // 借阅类型
  specialAccountId,       // 特殊人id
  stampType,              // 盖章类型
  contractType,           // 合同类型
  contractChildType,      // 合同子类型
  borrowType,       // 证照借用类型
  isSelf,
}) => {
  const [flowVal, setFlowVal] = useState(flowId);

  useEffect(() => {
    // 不用获取审批流详情
    if (!isDetail && pageType && isSelf) {
      const payload = {
        state: OaApplicationFlowTemplateState.normal,   // 审批流状态，正常
        bizType: ExpenseCostOrderBizType.transactional, // 审批流类型，事务
        pageType,
        stampType,
        sealType,
        pact_apply_types: contractType,
        pact_sub_types: contractChildType,
        contractBorrowType: pactType,
        borrowType,
        isNewOaReduce: true, // 新的reduce
        isNewInterface: false,
      };
      dispatch({ type: 'expenseExamineFlow/fetchExamineFlows', payload });
      return () => {
        dispatch({ type: 'expenseExamineFlow/reduceNewExamineFlows', payload: {} });
      };
    }
    return () => {
      dispatch({ type: 'expenseExamineFlow/reduceNewExamineFlows', payload: {} });
    };
  }, [dispatch, isDetail, isSelf, pageType]);

  // 根据参数，获取对应审批流list
  useEffect(() => {
    // 不用获取审批流详情
    if (!isDetail && departmentId && pageType) {
      const payload = {
        state: OaApplicationFlowTemplateState.normal,   // 审批流状态，正常
        bizType: ExpenseCostOrderBizType.transactional, // 审批流类型，事务
        departmentId,
        rankName: rank,
        pageType,
        sealType,
        stampType,
        borrowType,
        pact_apply_types: contractType,
        pact_sub_types: contractChildType,
        contractBorrowType: pactType,
        isNewInterface: false, // 是否旧接口
        onFailureCallback: () => { message.error('提示：没有适用审批流，请联系流程管理员'); },
        onSuccessCallback: res => onSetFlowId(res),
      };
      // 原审批流接口
      dispatch({ type: 'expenseExamineFlow/fetchExamineFlows', payload });
    }
  }, [dispatch, departmentId, rank, pageType, borrowType, isDetail, pactType, sealType, contractType, contractChildType]);

  // 审批流预览信息
  useEffect(() => {
    flowVal && dispatch({
      type: 'oaCommon/getExamineFlowInfo',
      payload: {
        departmentId,
        flowId: flowVal,
        accountId,
        specialDepartmentId,
        specialAccountId,
      },
    });

    return () => {
      dispatch({ type: 'oaCommon/resetExamineFlowInfo' });
    };
  }, [flowVal, dispatch, accountId, departmentId, specialDepartmentId, specialAccountId]);


  // 根据审批流find接口数据，重置需要获取预览信息的审批流id
  const onSetFlowId = (res = {}) => {
    const currentId = is.string(res) ? res : dot.get(res, 'data.0._id', undefined);
    setFlowVal(currentId);
    // 审批流更新时，更新需要提交的审批流id
    setFlowId && setFlowId(currentId);

    if (!currentId) {
      message.error('提示：没有适用审批流，请联系流程管理员');
    }
  };

  if (flowVal && examineFlowInfo && Array.isArray(examineFlowInfo)) {
    return (
      <Steps labelPlacement="vertical" style={{ marginBottom: 20, maxWidth: '100%', overflowY: 'scroll' }}>
        {
          examineFlowInfo.map((i, key) => {
            const description = dot.get(i, 'accounts_name', '无');
            return <Step status="wait" title={i.name} description={description} key={i._id || key} />;
          })
        }
      </Steps>
    );
  }
  return <div />;
};

function mapStateToProp({ oaCommon: { examineFlowInfo } }) {
  return { examineFlowInfo };
}

export default connect(mapStateToProp)(ExamineFlow);
