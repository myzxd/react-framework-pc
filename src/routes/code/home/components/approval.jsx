/**
 * code/team - 首页 - 审批单汇总信息
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Row,
  Col,
  Badge,
} from 'antd';
import {
  CodeApproveOrderTabKey,
  ExpenseApprovalType,
  OaApplicationOrderType,
} from '../../../../application/define';
import { system } from '../../../../application';

import getFormValues from '../../approveOrder/dealSearchValues';
import style from '../style.less';

const Approval = ({
  dispatch,
  reportOrderCount = 0,
  submitOrderCount = 0,
  borrowingCount = 0,
  repaymentCount = 0,
  affairsReportOrderCount = 0,
  affairsSubmitOrderCount = 0,
  loading,
}) => {
  useEffect(() => {
    // 获取待审批借款单数量
    dispatch({
      type: 'expenseExamineOrder/getAffairsOrderCount',
      payload: {
        tabKey: ExpenseApprovalType.penddingVerify,
        approveType: OaApplicationOrderType.borrowing,
      },
    });
    // 获取待审批还款单数量
    dispatch({
      type: 'expenseExamineOrder/getAffairsOrderCount',
      payload: {
        tabKey: ExpenseApprovalType.penddingVerify,
        approveType: OaApplicationOrderType.repayments,
      },
    });
    dispatch({
      type: 'codeOrder/getOrderCount',
      payload: { tabKey: CodeApproveOrderTabKey.awaitReport },
    });
    dispatch({
      type: 'expenseExamineOrder/getAffairsOrderCount',
      payload: { tabKey: ExpenseApprovalType.penddingVerify },
    });

    dispatch({
      type: 'expenseExamineOrder/getAffairsOrderCount',
      payload: { tabKey: ExpenseApprovalType.penddingSubmit },
    });

    // 获取我代办查询条件分组
    const getOrderSearchGroupList = () => dispatch({
      type: 'codeOrder/getOrderSearchGroupList',
      payload: {
        tabKey: CodeApproveOrderTabKey.upcoming,
      },
    });

    getOrderSearchGroupList().then((res) => {
      // 默认分组
      const initGroup = Array.isArray(res) ? res.find(g => g.is_default) : {};

      const params = initGroup && initGroup.filter_params ?
        { ...getFormValues(initGroup.filter_params) }
        : {};

      dispatch({
        type: 'codeOrder/getOrderCount',
        payload: {
          tabKey: CodeApproveOrderTabKey.upcoming,
          ...params,
        },
      });
    });
  }, [dispatch]);

  if (loading) return <div />;

  return (
    <div className={style['code-home-order-wrap']}>
      <div
        className={style['code-home-order-title']}
      >
        我的待办
      </div>
      <Row>
        <Col
          span={4}
          onClick={() => (window.location.href = `/#/Code/PayOrder?tabKey=${CodeApproveOrderTabKey.awaitReport}`)}
          className={style['code-home-order-icon-wrap']}
        >
          <Badge count={submitOrderCount}>
            <img
              role="presentation"
              className={style['code-home-order-icon']}
              src={require('../../static/codeSubmit@2x.png')}
            />
          </Badge>
          <span
            className={style['code-home-order-icon-title']}
          >待提报CODE/TEAM费用单</span>
        </Col>
        <Col
          span={4}
          onClick={() => (window.location.href = `/#/Code/PayOrder?tabKey=${CodeApproveOrderTabKey.upcoming}`)}
          className={style['code-home-order-icon-wrap']}
        >
          <Badge count={reportOrderCount}>
            <img
              role="presentation"
              className={style['code-home-order-icon']}
              src={require('../../static/codeApprove@2x.png')}
            />
          </Badge>
          <span
            className={style['code-home-order-icon-title']}
          >待审批CODE/TEAM费用单</span>
        </Col>

        <Col
          span={4}
          onClick={() => (window.location.href = `/#/Code/Manage/OAOrder?selectedTabKey=${ExpenseApprovalType.penddingSubmit}`)}
          className={style['code-home-order-icon-wrap']}
        >
          <Badge count={affairsSubmitOrderCount}>
            <img
              role="presentation"
              className={style['code-home-order-icon']}
              src={require('../../static/affairsSubmit@2x.png')}
            />
          </Badge>
          <span
            className={style['code-home-order-icon-title']}
          >待提报事务单</span>
        </Col>
        <Col
          span={4}
          onClick={() => (window.location.href = `/#/Code/Manage/OAOrder?selectedTabKey=${ExpenseApprovalType.penddingVerify}`)}
          className={style['code-home-order-icon-wrap']}
        >
          <Badge count={affairsReportOrderCount}>
            <img
              role="presentation"
              className={style['code-home-order-icon']}
              src={require('../../static/affairsApprove@2x.png')}
            />
          </Badge>
          <span
            className={style['code-home-order-icon-title']}
          >待审批事务单</span>
        </Col>
        <Col
          span={4}
          onClick={() => {
            window.location.href = `/#/Expense/Manage/ExamineOrder?selectedTabKey=${ExpenseApprovalType.penddingVerify}`;
            // 设置付款审批列表页搜索条件
            system.setSearchParams('examineOrder', { approvalType: OaApplicationOrderType.borrowing });
          }}
          className={style['code-home-order-icon-wrap']}
        >
          <Badge count={borrowingCount}>
            <img
              role="presentation"
              className={style['code-home-order-icon']}
              src={require('../../static/affairsBorrowing.png')}
            />
          </Badge>
          <span
            className={style['code-home-order-icon-title']}
          >待审批借款单</span>
        </Col>
        <Col
          span={4}
          onClick={() => {
            window.location.href = `/#/Expense/Manage/ExamineOrder?selectedTabKey=${ExpenseApprovalType.penddingVerify}`;
            // 设置付款审批列表页搜索条件
            system.setSearchParams('examineOrder', { approvalType: OaApplicationOrderType.repayments });
          }}
          className={style['code-home-order-icon-wrap']}
        >
          <Badge count={repaymentCount}>
            <img
              role="presentation"
              className={style['code-home-order-icon']}
              src={require('../../static/affairsRepayment.png')}
            />
          </Badge>
          <span
            className={style['code-home-order-icon-title']}
          >待审批还款单</span>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ({
  codeOrder: { reportOrderCount, submitOrderCount },
  expenseExamineOrder: { affairsSubmitOrderCount, affairsReportOrderCount, borrowingCount, repaymentCount },
}) => {
  return {
    reportOrderCount,
    submitOrderCount,
    borrowingCount,
    repaymentCount,
    affairsReportOrderCount,
    affairsSubmitOrderCount,
  };
};

export default connect(mapStateToProps)(Approval);
