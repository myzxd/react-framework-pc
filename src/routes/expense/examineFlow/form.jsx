/**
 * 审批流设置，审批流编辑/创建页面 /Expense/ExamineFlow/Form
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';

import { ExpenseCostOrderBizType } from '../../../application/define';
import CostForm from './cost';
import AffairsFlow from './component/affairs/index';

const FlowUpdate = ({
  examineDetail = {}, // 审批流详情
  dispatch,
  location = {}, // location
}) => {
  // 审批流id
  const flowId = dot.get(location, 'query.flowId', undefined);

  // 获取审批流详情
  useEffect(() => {
    flowId && dispatch({
      type: 'expenseExamineFlow/fetchExamineDetail',
      payload: { id: flowId },
    });

    return () => {
      dispatch({
        type: 'expenseExamineFlow/resetExamineFlowDetail',
      });
    };
  }, [flowId, dispatch]);

  // 审批流类型
  const { bizType } = examineDetail;

  // 成本类，非成本类审批流
  if ((bizType === ExpenseCostOrderBizType.costOf
    || bizType === ExpenseCostOrderBizType.noCostOf)
    && Object.keys(examineDetail).length > 0
  ) {
    return (
      <CostForm
        examineDetail={examineDetail}
        flowId={flowId}
      />
    );
  }

  // 事务性审批流
  if (bizType === ExpenseCostOrderBizType.transactional
    || Object.keys(examineDetail).length > 0) {
    return (
      <AffairsFlow
        examineDetail={examineDetail}
        flowId={flowId}
      />
    );
  }
  return <div />;
};

const mapStateToProps = ({ expenseExamineFlow: { examineDetail } }) => {
  return { examineDetail };
};

export default connect(mapStateToProps)(FlowUpdate);
