/**
 * 费用管理 - 借还款管理 - 新建/编辑 - 基础信息组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import dot from 'dot-prop';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { BorrowType, OaApplicationOrderType } from '../../../../../../application/define';
import style from './style.css';

const { Option } = Select;

class BaseInfo extends Component {

  static propTypes = {
    borrowingDetail: PropTypes.object, // 借款单详情（编辑时使用）
    form: PropTypes.object.isRequired, // 表单
    examineOrderDetail: PropTypes.object, // 审批单详情（新建时使用）
    isCreate: PropTypes.bool, // 是否为新建
  }

  static defaultProps = {
    borrowingDetail: {}, // 借款单详情（编辑时使用）
    form: {}, // 表单
    examineOrderDetail: {}, // 审批单详情（新建时使用）
    isCreate: false,
  }

  render = () => {
    const { getFieldDecorator } = this.props.form;

    // 借款单详情、审批单详情
    const {
      borrowingDetail,
      examineOrderDetail,
      isCreate, // 是否为新建
    } = this.props;

    // 借款单所属审批单详情
    const { application_order_info: applicationOrderInfo = {} } = borrowingDetail;

    const formItems = !isCreate
    ? [{
      label: '审批类型',
      form: OaApplicationOrderType.description(applicationOrderInfo.application_order_type),
    },
    {
      label: '审批流',
      form: dot.get(applicationOrderInfo, 'flow_info.name', '--'),
    },
    {
      label: '申请人',
      form: dot.get(applicationOrderInfo, 'apply_account_info.name', '--'),
    },
    {
      label: '借款类型',
      form: getFieldDecorator('borrowType', { initialValue: `${BorrowType.normal}` })(
        <Select className={style.boss_expense_borrowing_form_borrow_type} disabled>
          <Option value={`${BorrowType.normal}`}>{BorrowType.description(BorrowType.normal)}</Option>
        </Select>,
      ),
    }]
      : [{
        label: '审批类型',
        form: OaApplicationOrderType.description(examineOrderDetail.applicationOrderType),
      },
      {
        label: '审批流',
        form: dot.get(examineOrderDetail, 'flowInfo.name', '--'),
      },
      {
        label: '申请人',
        form: dot.get(examineOrderDetail, 'applyAccountInfo.name', '--'),
      },
      {
        label: '借款类型',
        form: getFieldDecorator('borrowType', { initialValue: `${BorrowType.normal}` })(
          <Select className={style['app-comp-expense-borrowing-form-borrow-type']} disabled>
            <Option value={`${BorrowType.normal}`}>{BorrowType.description(BorrowType.normal)}</Option>
          </Select>,
        ),
      }];
    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={formItems} cols={4} />
      </CoreContent>
    );
  }
}

export default BaseInfo;
