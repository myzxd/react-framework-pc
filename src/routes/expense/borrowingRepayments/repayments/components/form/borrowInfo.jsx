/**
 * 费用管理 - 还款管理 - 新建/编辑 - 借款信息组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { BorrowType, Unit } from '../../../../../../application/define';

class BorrowInfo extends Component {

  static propTypes = {
    borrowingDetail: PropTypes.object.isRequired, // 借款单详情
  }

  static defaultProps = {
    borrowingDetail: {}, // 借款单详情
  }

  render = () => {
    const { borrowingDetail } = this.props;
    const formItemsFirstLine = [
      {
        label: '借款单号',
        form: borrowingDetail._id || '--',
      },
      {
        label: '借款类型',
        form: BorrowType.description(borrowingDetail.loan_type),
      },
      {
        label: '借款事由',
        form: borrowingDetail.loan_note || '--',
      },
    ];
    const formItemsSecondLine = [
      {
        label: '申请人',
        form: dot.get(borrowingDetail, 'apply_account_info.name', '--'),
      },
      {
        label: '实际借款人',
        form: dot.get(borrowingDetail, 'actual_loan_info.name', '--'),
      },
    ];
    const formItemsThirdLine = [
      {
        label: '借款金额（元）',
        form: borrowingDetail.loan_money ? Unit.exchangePriceCentToMathFormat(borrowingDetail.loan_money) : 0,
      },
      {
        label: '已还金额（元）',
        form: borrowingDetail.repayment_money ? Unit.exchangePriceCentToMathFormat(borrowingDetail.repayment_money) : 0,
      },
      {
        label: '未还金额（元）',
        form: borrowingDetail.non_repayment_money ? Unit.exchangePriceCentToMathFormat(borrowingDetail.non_repayment_money) : 0,
      },
    ];
    return (
      <CoreContent title="借款信息">
        <DeprecatedCoreForm items={formItemsFirstLine} cols={3} />
        <DeprecatedCoreForm items={formItemsSecondLine} cols={3} />
        <DeprecatedCoreForm items={formItemsThirdLine} cols={3} />
      </CoreContent>
    );
  }
}

export default BorrowInfo;
