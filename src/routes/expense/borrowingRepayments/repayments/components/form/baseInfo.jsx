/**
 * 费用管理 - 还款管理 - 新建/编辑 - 基础信息组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { OaApplicationOrderType } from '../../../../../../application/define';

class BaseInfo extends Component {

  static propTypes = {
    examineOrderDetail: PropTypes.object, // 审批单详情
    repaymentDetail: PropTypes.object, // 还款单详情
    isCreate: PropTypes.bool, // 是否为新建
  }

  static defaultProps = {
    examineOrderDetail: {}, // 审批单详情
    repaymentDetail: {}, // 还款单详情
    isCreate: false, // 是否为新建
  }

  render = () => {
    const { examineOrderDetail, repaymentDetail, isCreate } = this.props;

    // 数据为空，返回null
    if (Object.keys(repaymentDetail).length === 0) return null;

    // 还款单所属的审批单信息
    const { application_order_info: applicationOrderInfo } = repaymentDetail;

    // 新建与编辑后端取值区别开
    const formItems = isCreate
    ? [{
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
    }]
    : [{
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
    }];
    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={formItems} cols={3} />
      </CoreContent>
    );
  }
}

export default BaseInfo;
