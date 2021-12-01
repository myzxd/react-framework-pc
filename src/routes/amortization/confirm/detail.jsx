/* eslint-disable no-confusing-arrow */
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Table } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { CoreForm, CoreContent } from '../../../components/core';
import { utils } from '../../../application';
import {
  Unit,
  CodeTicketState,
  CodeApproveOrderPayState,
  CodeRecordBillRedPushState,
  ExpenseExamineOrderProcessState,
} from '../../../application/define';

Detail.propTypes = {
  amortizationDetail: PropTypes.object, // 摊销确认详情
};

function Detail({
  location,
  amortizationDetail,
  getAmortizationDetail,
  resetAmortizationDetail, // 重置详情
}) {
  const { query: { id } } = location;

  useEffect(() => {
    // 获取摊销确认详情
    getAmortizationDetail({ id });
    // 重置详情
    return () => resetAmortizationDetail();
  }, []);

  // 渲染基本信息
  const renderBasicInfo = () => {
    const items = [
      <Form.Item label="费用单号" key="costNum">
        {utils.dotOptimal(amortizationDetail, 'cost_order_id', '--')}
      </Form.Item>,
      <Form.Item label="科目" key="subject">
        {utils.dotOptimal(amortizationDetail, 'biz_account_name', '--')}
      </Form.Item>,
      <Form.Item label="核算中心" key="account">
        {amortizationDetail.biz_team_name || amortizationDetail.biz_code_name || '--'}
      </Form.Item>,
      <Form.Item label="发票抬头" key="invoice">
        {utils.dotOptimal(amortizationDetail, 'invoice_title', '--')}
      </Form.Item>,
      <Form.Item label="付款金额" key="report">
        {`${utils.dotOptimal(amortizationDetail, 'total_money') ? Unit.exchangePriceCentToMathFormat(amortizationDetail.total_money) : '--'}元`}
      </Form.Item>,
      <Form.Item label="费用金额" key="expense">
        {`${utils.dotOptimal(amortizationDetail, 'tax_deduction') ? Unit.exchangePriceCentToMathFormat(amortizationDetail.tax_deduction) : '--'}元`}
      </Form.Item>,
      <Form.Item label="总税金" key="tax">
        {`${utils.dotOptimal(amortizationDetail, 'tax_money') ? Unit.exchangePriceCentToMathFormat(amortizationDetail.tax_money) : '--'}元`}
      </Form.Item>,
      <Form.Item label="审批单状态" key="approvalState">
        {
          utils.dotOptimal(amortizationDetail, 'order_state', undefined)
          ? ExpenseExamineOrderProcessState.description(utils.dotOptimal(amortizationDetail, 'order_state'))
          : '--'
        }
      </Form.Item>,
      <Form.Item label="付款状态" key="paymentState">
        {
          utils.dotOptimal(amortizationDetail, 'paid_state', undefined)
          ? CodeApproveOrderPayState.description(utils.dotOptimal(amortizationDetail, 'paid_state'))
          : '--'
        }
      </Form.Item>,
      <Form.Item label="验票状态" key="checkTicketState">
        {
          utils.dotOptimal(amortizationDetail, 'inspect_bill_state', undefined)
          ? CodeTicketState.description(utils.dotOptimal(amortizationDetail, 'inspect_bill_state'))
          : '--'
        }
      </Form.Item>,
      <Form.Item label="是否红冲" key="hongchong">
        {
          utils.dotOptimal(amortizationDetail, 'bill_red_push_state', undefined)
          ? CodeRecordBillRedPushState.description(utils.dotOptimal(amortizationDetail, 'bill_red_push_state'))
          : '--'
        }
      </Form.Item>,
    ];
    return (
      <CoreContent title="基本信息" className="affairs-flow-basic">
        <CoreForm cols={4} items={items} />
      </CoreContent>
    );
  };

  // 渲染摊销台账明细
  const renderLedgerInfo = () => {
    const items = [
      <Form.Item label="付款金额" key="ledgerReport">
        {`${utils.dotOptimal(amortizationDetail, 'total_money') ? Unit.exchangePriceCentToMathFormat(amortizationDetail.total_money) : '--'}元`}
      </Form.Item>,
      <Form.Item label="摊销周期" key="cycle">
        {`${utils.dotOptimal(amortizationDetail, 'allocation_rule_info.allocation_cycle', '--')}期`}
      </Form.Item>,
      <Form.Item label="摊销日期" key="date">
        {
          `${utils.dotOptimal(amortizationDetail, 'allocation_rule_info.allocation_start_date', undefined)
          ? moment(`${utils.dotOptimal(amortizationDetail, 'allocation_rule_info.allocation_start_date')}`).format('YYYY-MM-DD')
          : '--'}
          -
          ${utils.dotOptimal(amortizationDetail, 'allocation_rule_info.allocation_end_date', undefined)
          ? moment(`${utils.dotOptimal(amortizationDetail, 'allocation_rule_info.allocation_end_date')}`).format('YYYY-MM-DD')
          : '--'}
          `
        }
      </Form.Item>,
      <Form.Item label="残值率" key="residual">
        {`${utils.dotOptimal(amortizationDetail, 'allocation_rule_info.salvage_value_rate', '--')}%`}
      </Form.Item>,
    ];

    const columns = [
      {
        title: '原始科目',
        dataIndex: 'original_subject',
        key: 'original_subject',
        render: () => {
          const text = utils.dotOptimal(amortizationDetail, 'biz_account_info', {}) || {};
          if (!text) return '--';
          const { name, ac_code: code } = text;

          if (name && code) {
            return `${name}（${code}）`;
          }

          if (name) {
            return name;
          }

          return '--';
        },
      },
      {
        title: '记账科目',
        dataIndex: 'book_account_info',
        key: 'book_account_info',
        render: (text = {}) => {
          if (!text) return '--';
          const { name, ac_code: code } = text;

          if (name && code) {
            return `${name}（${code}）`;
          }

          if (name) {
            return name;
          }

          return '--';
        },
      },
      {
        title: '税后金额',
        dataIndex: 'tax_deduction',
        key: 'tax_deduction',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      {
        title: '记账月份',
        dataIndex: 'book_month',
        key: 'book_month',
        render: text => text || '--',
      },
      {
        title: '应摊总额',
        dataIndex: 'allocation_total_money',
        key: 'allocation_total_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      {
        title: '税金',
        dataIndex: 'tax_money',
        key: 'tax_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      {
        title: '本期已摊金额',
        dataIndex: 'allocation_money',
        key: 'allocation_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      {
        title: '累计已摊金额',
        dataIndex: 'accumulated_allocation_money',
        key: 'accumulated_allocation_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      {
        title: '未摊总金额',
        dataIndex: 'accumulated_unallocation_money',
        key: 'accumulated_unallocation_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      {
        title: '残值率',
        dataIndex: 'salvage_value_rate',
        key: 'salvage_value_rate',
        render: text => text ? `${text}%` : '--',
      },
      {
        title: '预计残值金额',
        dataIndex: 'pre_salvage_money',
        key: 'pre_salvage_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      // {
      //   title: '已摊截止日期',
      //   dataIndex: 'accumulated_allocation_end_date',
      //   key: 'accumulated_allocation_end_date',
      //   render: text => text ? moment(`${text}`).format('YYYY-MM-DD') : '--',
      // },
      // {
      //   title: '未摊截止日期',
      //   dataIndex: 'unallocation_end_date',
      //   key: 'unallocation_end_date',
      //   render: () => utils.dotOptimal(amortizationDetail, 'allocation_rule_info.allocation_end_date', undefined)
      //                 ? moment(`${utils.dotOptimal(amortizationDetail, 'allocation_rule_info.allocation_end_date')}`).format('YYYY-MM-DD')
      //                 : '--',
      // },
    ];

    return (
      <CoreContent title="摊销台账明细" className="affairs-flow-basic">
        <CoreForm cols={4} items={items} />
        <Table
          dataSource={utils.dotOptimal(amortizationDetail, 'allocation_detail_list', [])}
          columns={columns}
          pagination={false}
          bordered
        />
      </CoreContent>
    );
  };

  return (
    <React.Fragment>
      {/* 渲染基本信息 */}
      {renderBasicInfo()}
      {/* 渲染摊销台账明细 */}
      {renderLedgerInfo()}
    </React.Fragment>
  );
}

const mapStateToProps = ({
  costAmortization: { amortizationDetail },
}) => ({
  amortizationDetail,
});

const mapDispatchToProps = dispatch => ({
  // 获取摊销确认详情
  getAmortizationDetail: payload => dispatch({
    type: 'costAmortization/getAmortizationDetail',
    payload,
  }),
  resetAmortizationDetail: payload => dispatch({
    type: 'costAmortization/resetAmortizationDetail',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
