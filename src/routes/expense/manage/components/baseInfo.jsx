/**
 * 费用管理 - 付款审批 - 退款审批单 - 基本信息
 */
import React from 'react';
import { DeprecatedCoreForm, CoreContent } from '../../../../components/core';
import { Unit, OaApplicationOrderType, ExpenseExamineOrderPaymentState } from '../../../../application/define';

import ThemeTags from './themeTags';

// TODO: 使用类进行声明，并且声明详细的参数格式，willReceive要求相同 @王晋
const BaseInfo = (props) => {
  const {
    detail = {}, // 审批单详情
  } = props;

  // 基本信息
  const renderBasic = () => {
    // TODO: 使用dot直接获取，或者直接在类的声明中声明变量，不要在使用的时候再次声明。 @王晋
    const {
      id, // 审批单id
      applyAccountInfo: {
        name: accountName,
      } = {
        accountName: '',
      }, // 申请人姓名
      totalMoney, // 金额
      flowInfo: {
        name: flowName,
      } = {
        flowName: '',
      }, // 审批流名称
      applicationOrderType, // 审批单类型
      paidState, // 付款状态
      paidNote,
      themeLabelList: themeTags, // 主题标签
    } = detail;

    // 项
    const formItemsBase = [
      {
        label: '审批单号',
        form: id,
      },
      {
        label: '申请人',
        form: accountName,
      }, {
        label: '总金额',
        form: Unit.exchangePriceCentToMathFormat(totalMoney),
      }, {
        label: '审批流程',
        form: flowName,
      }, {
        label: '审批类型',
        form: `${OaApplicationOrderType.description(applicationOrderType)}`,
      }, {
        label: '标记付款状态',
        form: `${ExpenseExamineOrderPaymentState.description(paidState)}`,
      }, {
        label: '付款异常说明',
        form: paidNote,
      },
    ];

    // 基本布局
    const layoutBase = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <CoreContent>
        <DeprecatedCoreForm items={formItemsBase} layout={layoutBase} cols={3} />
        <ThemeTags themeTags={themeTags} orderId={id} />
      </CoreContent>
    );
  };

  const renderContent = () => {
    return (
      <div>
        {renderBasic()}
      </div>
    );
  };

  return renderContent();
};

export default BaseInfo;
