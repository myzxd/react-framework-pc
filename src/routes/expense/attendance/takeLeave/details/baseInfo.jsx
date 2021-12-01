/**
 * 费用管理 - 考勤管理 - 请假管理列表页 - 请假详情页 - 请假基本信息
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { DeprecatedCoreForm, CoreContent } from '../../../../../components/core';
import { OaApplicationOrderType } from '../../../../../application/define';

class BaseInfo extends Component {
  static propTypes = {
    expenseTakeLeaveDetail: PropTypes.object, // 请假详情信息
  }

  static defaultProps = {
    expenseTakeLeaveDetail: {}, // 请假详情信息
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 个人信息
  render = () => {
    const { expenseTakeLeaveDetail } = this.props;
    const formItems = [
      {
        label: '审批单号',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(expenseTakeLeaveDetail, 'application_order_info._id', '--'),
      },
      {
        label: '申请人',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(expenseTakeLeaveDetail, 'apply_account_info.name', '--'),
      }, {
        label: '审批类型',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(expenseTakeLeaveDetail, 'application_order_info.application_order_type') ? OaApplicationOrderType.description(dot.get(expenseTakeLeaveDetail, 'application_order_info.application_order_type')) : '--',
      },
    ];

    return (
      <CoreContent title="基本信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  }
}

export default BaseInfo;
