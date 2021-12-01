/**
 * 审批流设置 - 编辑审批流页面 - 服务费方案 - 科目组件 /Expense/ExamineFlow/Config
 */
import _ from 'lodash';
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'dva';
import { CoreSelect } from '../../../../../../components/core';
import { OaCostAccountingState } from '../../../../../../application/define';
import { omit } from '../../../../../../application/utils';

const Option = CoreSelect.Option;

class SelectSubject extends React.Component {
  static propTypes = {
    flowId: PropTypes.string,
    typeId: PropTypes.string,
    namespace: PropTypes.string,
    examineFlowDetail: PropTypes.object,
    showDisabledSubject: PropTypes.bool,
  }

  static defaultProps = {
    flowId: '',
    typeId: '',
    namespace: 'default',
    examineFlowDetail: {},
    showDisabledSubject: false,
  }

  componentDidMount = () => {
    // 根据审批流id，获取费用分组列表
    const { flowId, namespace } = this.props;
    if (is.existy(flowId)) {
      this.props.dispatch({ type: 'expenseExamineFlow/fetchExamineFlowDetail', payload: { id: flowId, namespace } });
    }
  }

  componentDidUpdate(prevProps) {
    const { namespace, flowId, examineFlowDetail, dispatch, typeId } = this.props;
    if ((!_.isEqual(flowId, prevProps.flowId) || !_.isEqual(typeId, prevProps.typeId)) && Object.keys(dot.get(examineFlowDetail, namespace, {})).length <= 0) {
      dispatch({ type: 'expenseExamineFlow/fetchExamineFlowDetail', payload: { id: flowId, namespace } });
    }
  }

  render = () => {
    const { examineFlowDetail, typeId, namespace, showDisabledSubject } = this.props;
    const examineDetail = dot.get(examineFlowDetail, namespace, {});

    let costCatalogScopeList = [];          // 费用分组
    let subjectData = [];                   // 科目
    // 取出选中的费用分组数据
    if (is.existy(examineDetail) && is.existy(examineDetail.costCatalogScopeList) && is.array(examineDetail.costCatalogScopeList)) {
      costCatalogScopeList = examineDetail.costCatalogScopeList.find(item => item.id === typeId);
    }
    // 取出对应的科目数据
    if (is.existy(costCatalogScopeList) && is.not.empty(costCatalogScopeList)) {
      subjectData = costCatalogScopeList.accountingList;
    }

    // 定义根据相应条件过滤出来的数据数组
    let filtedSubjects = [];
    if (showDisabledSubject) {
      filtedSubjects = subjectData.filter(subject => [OaCostAccountingState.normal, OaCostAccountingState.disable].indexOf(subject.state) > -1);
    } else {
      filtedSubjects = subjectData.filter(subject => [OaCostAccountingState.normal].indexOf(subject.state) > -1);
    }
    const options = filtedSubjects.map((data) => {
      return (
        <Option
          key={data.id}
          value={`${data.id}`}
          disabled={data.state === OaCostAccountingState.disable}
        >{`${data.name}(${data.accountingCode})${data.state === OaCostAccountingState.disable ? '(停用)' : ''}`}
        </Option>
      );
    });

    // 默认传递所有上级传入的参数
    const props = { ...this.props };
    // 去除Antd Select不需要的props
    const omitedProps = omit([
      'dispatch',
      'flowId',
      'typeId',
      'namespace',
      'examineFlowDetail',
      'showDisabledSubject',
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

export default connect(mapStateToProps)(SelectSubject);
