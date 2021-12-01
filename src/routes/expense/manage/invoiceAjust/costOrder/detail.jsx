  /**
 * 费用管理 - 付款审批 - 红冲审批单 - 红冲费用单详情
 */

import React from 'react';

import {
  DeprecatedCoreForm,
} from '../../../../../components/core';

import {
  Unit,
} from '../../../../../application/define';

import CostAllocation from '../../components/costAllocation'; // 成本分摊详情

import style from './style.css';

const CostOder = (props) => {
  const {
    isShow,
    detail, // 红冲费用单详情
    examineOrderDetail, // 审批单详情
  } = props;

  const {
    attachment_private_urls: attachmentPrivateUrls = [], // 附件地址
    attachments = [], // 附件name
    note, // 备注
    invoice_title: invoiceTitle, // 发票抬头
    cost_accounting_info: {
      name: costAccountingName, // 科目name
    } = {
      name: '',
    },
    cost_group_name: costGroupName, // 费用分组name
    invoice_flag: invoiceFlag, // 是否开发票
    total_money: totalMoney, // 金额
    payee_info: {
      card_name: cardName, // 收款人姓名
      card_num: cardNum, // 收款账户
      bank_details: bankDetails, // 收款银行
    } = {
      card_name: '',
      card_num: '',
      bank_details: '',
    },
  } = detail;

  // 渲染附件文件
  const renderFiles = (filesUrl, filesName) => {
    return (
      <div>
        {
          filesUrl.map((item, index) => {
            return (
              <a
                className={style['app-comp-expense-manage-template-detail-refund-file']}
                rel="noopener noreferrer"
                target="_blank"
                key={index}
                href={item}
              >
                {filesName[index]}
              </a>
            );
          })
        }
      </div>
    );
  };

  // 基本信息
  const renderBaseInfo = () => {
    // 项
    const formItems = [
      {
        label: '费用分组',
        form: costGroupName || '--',
      },
      {
        label: '科目',
        form: costAccountingName || '--',
      },
      {
        label: '费用金额',
        form: totalMoney ? Unit.exchangePriceToYuan(totalMoney) : '--',
      },
      {
        label: '是否开发票',
        form: invoiceFlag ? '是' : '否',
      },
    ];

    // 布局
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <DeprecatedCoreForm
        cols={4}
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
        form: renderFiles(attachmentPrivateUrls, attachments),
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

  // 收款信息
  const renderPaymentInfo = () => {
    const formItems = [
      {
        label: '收款人',
        form: cardName || '--',
      }, {
        label: '收款账号',
        form: cardNum || '--',
      }, {
        label: '开户支行',
        form: bankDetails || '--',
      },
    ];

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={3}
        layout={layout}
      />
    );
  };

  return (
    <div
      className={isShow ? style['app-comp-expense-manage-invoiceAdjust-cost-wrap'] : null}
    >
      {
        isShow
          ? (<h2
            span={4}
            className={style['app-comp-expense-manage-invoiceAdjust-cost-title']}
          >
            红冲申请单
          </h2>)
          : null
      }

      {/* 基本信息 */}
      {renderBaseInfo()}

      {/* 成本分摊 */}
      {renderCostAllocation()}

      {/* 备注 */}
      {renderNote()}

      {/* 附件 */}
      {renderUploadFile()}

      {/* 收款信息 */}
      {renderPaymentInfo()}
    </div>
  );
};

export default CostOder;
