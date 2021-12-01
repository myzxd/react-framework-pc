/**
 * 费用管理 - 付款审批 - 退款审批单 - 退款费用单详情
 */

import React from 'react';
import dot from 'dot-prop';
import {
  DeprecatedCoreForm,
  CoreFinder,
} from '../../../../../components/core';

import {
  Unit,
} from '../../../../../application/define';

import CostAllocation from '../../components/costAllocation'; // 成本分摊详情

import style from './style.css';

const { CoreFinderList } = CoreFinder;

const CostOder = (props) => {
  const {
    detail, // 退款费用单详情
    examineOrderDetail, // 审批单详情
  } = props;

  const {
    attachment_private_urls: attachmentPrivateUrls, // 附件地址
    attachments, // 附件name
    note, // 备注
    invoice_title: invoiceTitle, // 发票抬头
    cost_accounting_info: {
      name: costAccountingName, // 科目name
    } = {
      name: '',
    },
    cost_group_name: costGroupName, // 费用分组name
    total_money: totalMoney, // 金额
  } = detail;

   // 预览组件
  const renderCorePreview = (value, fileNames) => {
    if (Array.isArray(value) && dot.get(value, '0')) {
      const datas = value.map((item, index) => {
        return { key: fileNames[index], url: item };
      });
      return (
        <CoreFinderList data={datas} enableTakeLatest={false} />
      );
    }
    return '--';
  };

  // 基本信息
  const renderBaseInfo = () => {
    // 项
    const formItems = [
      {
        label: '退款金额',
        form: totalMoney ? Unit.exchangePriceToYuan(totalMoney) : '--',
      },
      {
        label: '费用分组',
        form: costGroupName || '--',
      },
      {
        label: '科目',
        form: costAccountingName || '--',
      },
    ];

    // 布局
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <DeprecatedCoreForm
        cols={3}
        layout={layout}
        items={formItems}
      />
    );
  };

  // 成本分摊
  const renderCostAllocation = () => {
    return (
      <CostAllocation
        detail={detail}
        examineOrderDetail={examineOrderDetail}
      />
    );
  };

  // 备注&发票抬头
  const renderNote = () => {
    // 备注
    const noteFormItems = [
      {
        label: '备注',
        form: note,
      },
    ];

    const invoiceFormItems = [
      {
        label: '发票抬头',
        form: invoiceTitle,
      },
    ];

    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

    return (
      <div>
        <DeprecatedCoreForm
          items={noteFormItems}
          cols={1}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={invoiceFormItems}
          cols={1}
          layout={layout}
        />
      </div>
    );
  };

  // 附件
  const renderUploadFile = () => {
    const formItems = [
      {
        label: '上传附件',
        form: renderCorePreview(attachmentPrivateUrls, attachments),
      },
    ];

    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  };

  return (
    <div
      className={style['app-comp-expense-manage-refund-cost-wrap']}
    >
      <h2
        span={4}
        className={style['app-comp-expense-manage-refund-cost-title']}
      >
        退款申请单
      </h2>

      {/* 基本信息 */}
      {renderBaseInfo()}

      {/* 成本分摊 */}
      {renderCostAllocation()}

      {/* 备注 */}
      {renderNote()}

      {/* 附件 */}
      {renderUploadFile()}
    </div>
  );
};

export default CostOder;
