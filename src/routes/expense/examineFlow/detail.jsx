/**
 * 审批流详情页入口
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';

import {
 ExpenseCostOrderBizType,
} from '../../../application/define';
import CostDetail from './costDetail';
import AffairsDetail from './component/affairs/detail';

const FlowDetail = ({
  dispatch,
  examineDetail = {}, // 审批流详情
  location = {}, // location
  enumeratedValue = [],
}) => {
  // 审批流id
  const flowId = dot.get(location, 'query.flowId', undefined);
  useEffect(() => {
    if (flowId) {
      dispatch({
        type: 'expenseExamineFlow/fetchExamineDetail',
        payload: { id: flowId },
      });

      dispatch({
        type: 'applicationCommon/getEnumeratedValue',
        payload: { enumeratedType: ['examineFlowApplyApplicationTypes', 'subjectScense', 'affairs'] },
      });
    }

    return () => {
      dispatch({ type: 'expenseExamineFlow/resetExamineFlowDetail' });
    };
  }, [dispatch, flowId]);

  // 审批流类型
  const bizType = dot.get(examineDetail, 'bizType');

  // 成本类，非成本类审批流
  if (bizType === ExpenseCostOrderBizType.costOf
    || bizType === ExpenseCostOrderBizType.noCostOf) {
    return (
      <CostDetail
        examineDetail={examineDetail}
        enumeratedValue={enumeratedValue}
      />
    );
  }

  // 事务性审批流
  if (bizType === ExpenseCostOrderBizType.transactional
    && Object.keys(examineDetail).length > 0
    && Object.keys(enumeratedValue).length > 0
  ) {
    return (
      <AffairsDetail
        examineDetail={examineDetail}
        enumeratedValue={enumeratedValue}
      />
    );
  }
  return <div />;
};

const mapStateToProps = ({
  expenseExamineFlow: { examineDetail },
  applicationCommon: { enumeratedValue },
}) => {
  return { examineDetail, enumeratedValue };
};

export default connect(mapStateToProps)(FlowDetail);
