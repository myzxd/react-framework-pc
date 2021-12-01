/**
 * 审批流设置 - 编辑审批流页面 - 服务费方案 - 费用分组组件 /Expense/ExamineFlow/Config
 */
import _ from 'lodash';
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import { CoreSelect } from '../../../../../../components/core';
import { omit } from '../../../../../../application/utils';

const Option = CoreSelect.Option;

class SelectExpenseTypes extends React.Component {
  static propTypes = {
    flowId: PropTypes.string,
    namespace: PropTypes.string,
    examineFlowDetail: PropTypes.object,
  }

  static defaultProps = {
    flowId: '',
    namespace: 'default',
    examineFlowDetail: {},
  }

  componentDidMount = () => {
    // 根据审批流id，获取费用分组列表
    const { flowId, namespace } = this.props;
    if (is.existy(flowId)) {
      this.props.dispatch({ type: 'expenseExamineFlow/fetchExamineFlowDetail', payload: { id: flowId, namespace } });
    }
  }

  componentDidUpdate(prevProps) {
    const { namespace, flowId, examineFlowDetail, dispatch } = this.props;
    if ((!_.isEqual(flowId, prevProps.flowId) || !_.isEqual(namespace, prevProps.namespace)) && Object.keys(dot.get(examineFlowDetail, namespace, {})).length <= 0) {
      dispatch({ type: 'expenseExamineFlow/fetchExamineFlowDetail', payload: { id: flowId, namespace } });
    }
  }

  render = () => {
    const { examineFlowDetail = {}, namespace } = this.props;
    const examineDetail = dot.get(examineFlowDetail, namespace, {});

    // 取出对应审批流中的费用分组数据
    let costCatalogScopeList = [];
    if (is.existy(examineDetail) && is.existy(examineDetail.costCatalogScopeList) && is.array(examineDetail.costCatalogScopeList)) {
      costCatalogScopeList = examineDetail.costCatalogScopeList;
    }

    // 渲染选择项
    const options = costCatalogScopeList.map((data) => {
      return <Option key={data.id} value={`${data.id}`}>{data.name}</Option>;
    });

    // 默认传递所有上级传入的参数
    const props = { ...this.props };
    // 去除Antd Select不需要的props
    const omitedProps = omit([
      'dispatch',
      'flowId',
      'namespace',
      'examineFlowDetail',
    ], props);

    return (
      <CoreSelect {...omitedProps} >
        {options}
      </CoreSelect>
    );
  }
}

function mapStateToProps({ expenseExamineFlow: { examineFlowDetail } }) {
  return { examineFlowDetail };
}

export default connect(mapStateToProps)(SelectExpenseTypes);
