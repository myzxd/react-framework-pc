/**
 * 审批单详情 - 薪资发放组件 Expense/Manage/ExamineOrder/Detail
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ElemSalarySummary from './components/elemSalarySummary';
import MeituanSalarySummary from './components/meituanSalarySummary';

class SalarySummary extends Component {
  static PropTypes = {
    payrollStatementId: PropTypes.string, // 结算单id
    salaryRecordsInfo: PropTypes.object, // 结算单数据
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    payrollStatementId: '', // 结算单id
    salaryRecordsInfo: {}, // 结算单数据
    dispatch: () => {},
  }

  componentDidMount() {
    // 结算单id
    const {
      payrollStatementId,
      dispatch,
    } = this.props;

    dispatch({
      type: 'financeSummaryManage/fetchSalaryCityStatementInfo',
      payload: {
        recordId: payrollStatementId,
      },
    });
  }

  // 渲染内容
  renderContent = () => {
    // 结算单数据
    const { salaryRecordsInfo } = this.props;

    // 数据为空，返回null
    if (Object.keys(salaryRecordsInfo).length === 0) return null;

    // 所属平台
    const { platformCodes = [] } = salaryRecordsInfo;

    // 饿了么
    if (platformCodes[0] === 'elem') {
      return (
        <ElemSalarySummary
          detail={salaryRecordsInfo}
          dispatch={this.props.dispatch}
        />
      );
    }

    // 美团
    return (
      <MeituanSalarySummary
        detail={salaryRecordsInfo}
        dispatch={this.props.dispatch}
      />
    );
  }

  render = () => {
    return this.renderContent();
  }
}

function mapStateToProps({
  financeSummaryManage: {
    salaryRecordsInfo,
  },
}) {
  return {
    salaryRecordsInfo,
  };
}

export default connect(mapStateToProps)(SalarySummary);
