/**
 * 还款单详情 - 还款信息
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import React, { Component } from 'react';

import { DeprecatedCoreForm, CoreContent, CoreFinder } from '../../../../../components/core';
import { Unit, BorrowType, RepayMethod, RepayCircle } from '../../../../../application/define';
import Operate from '../../../../../application/define/operate';

const Panel = Collapse.Panel;
const { CoreFinderList } = CoreFinder;

class RepaymentsInfo extends Component {
  static propTypes = {
    repaymentDetail: PropTypes.object, // 还款单详情
  }

  static defaultProps = {
    repaymentDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 借款信息
  renderBorrowingPeopleInfo = (record) => {
    const content = [];
    if (!Operate.canOperateExpenseBorrowOrderDetail()) {
      content.push(<span key="operate">{dot.get(record, 'loan_order_id', '--')}</span>);
    } else {
      content.push(<a
        key="detail"
        href={`/#/Expense/BorrowingRepayments/Borrowing/Detail?approvalId=${record.loan_order_id}&orderId=${record.loan_order_info.application_order_id}`}
        target="_blank"
        rel="noopener noreferrer"
      >{dot.get(record, 'loan_order_id', '--')}</a>);
    }
    const formItems = [
      {
        label: '借款单号',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: <span>{content}</span>,
      },
      {
        label: '借款类型',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'loan_order_info.loan_type', 0) ? BorrowType.description(dot.get(record, 'loan_order_info.loan_type', 0)) : '--',
      }, {
        label: '借款事由',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'loan_order_info.loan_note', '--'),
      }, {
        label: '申请人',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'apply_account_info.name', '--'),
      }, {
        label: '实际借款人',
        span: 14,
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'loan_order_info.actual_loan_info.name', '--'),
      }, {
        label: '借款金额 (元)',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: Unit.exchangePriceCentToMathFormat(dot.get(record, 'loan_order_info.loan_money', 0)),
      }, {
        label: '已还金额 (元)',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 14 } },
        form: Unit.exchangePriceCentToMathFormat(dot.get(record, 'loan_order_info.repayment_money', 0)),
      }, {
        label: '未还金额 (元)',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: Unit.exchangePriceCentToMathFormat(dot.get(record, 'loan_order_info.non_repayment_money', 0)),
      },
    ];
    return (
      <CoreContent title="借款信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  }

  // 预览组件
  renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0.file_url')) {
      const datas = value.map((item) => {
        return { key: item.file_name, url: item.file_url };
      });
      return (
        <CoreFinderList data={datas} enableTakeLatest={false} />
      );
    }
    return '--';
  };

  // 还款信息
  renderRepaymentsInfo = (record) => {
    const formItems = [
      {
        label: '还款方式',
        form: dot.get(record, 'loan_order_info.repayment_method', 0) ? RepayMethod.description(dot.get(record, 'loan_order_info.repayment_method', 0)) : '--',
      },
      {
        label: '还款周期',
        form: dot.get(record, 'loan_order_info.repayment_cycle', 0) ? RepayCircle.description(dot.get(record, 'loan_order_info.repayment_cycle', 0)) : '--',
      },
      {
        label: '还款金额(元)',
        form: dot.get(record, 'repayment_money', 0) ? Unit.exchangePriceCentToMathFormat(dot.get(record, 'repayment_money', 0)) : '--',
      }, {
        label: '备注',
        form: dot.get(record, 'repayment_note', '--') || '--',
      }, {
        label: '上传附件',
        form: this.renderCorePreview(dot.get(record, 'assert_file_list', [])),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 17 } };
    return (
      <CoreContent title="还款信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  render = () => {
    const { repaymentDetail } = this.props;

    // 数据为空，返回null
    if (Object.keys(repaymentDetail).length === 0) return null;

    return (
      <CoreContent title="还款单">
        <Collapse bordered={false} defaultActiveKey={['0']}>
          {
            [repaymentDetail].map((item, index) => {
              const header = `${'还款单号:'} ${item._id}`;
              return (
                <Panel header={header} key={index}>
                  {/* 渲染借款人信息 */}
                  {this.renderBorrowingPeopleInfo(item)}
                  {/* 渲染还款信息 */}
                  {this.renderRepaymentsInfo(item)}
                </Panel>
              );
            })
          }
        </Collapse>
      </CoreContent>
    );
  }
}

export default RepaymentsInfo;
