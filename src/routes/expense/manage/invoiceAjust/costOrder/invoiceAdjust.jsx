/**
 * 费用管理 - 付款审批 - 红冲审批单 - 红冲费用单 - 红冲表单
 */
import React from 'react';
import {
  Input,
} from 'antd';

import {
  DeprecatedCoreForm,
} from '../../../../../components/core';

import UploadFile from '../../components/uploadFile';
import CostAllocationForm from '../../components/costAllocationForm';
import Collection from '../../common/collection';

const { TextArea } = Input;

const InvoiceAdjust = (props) => {
  const {
    form,
    examineDetail = {}, // 审批流数据
    costOrderDetail = {}, // 费用单详情
    uniqueKey,
  } = props;

  const {
    getFieldDecorator,
  } = form;

  const {
    note = undefined, // 备注
    attachment_private_urls: attachmentPrivateUrls, // 附件下载地址
    attachments, // 附件
    cost_accounting_info: {
      _id: costAccountingId,
      cost_center_type: costCenterType,
    } = {
      _id: '',
      cost_center_type: '',
    },
  } = costOrderDetail;

  // 成本
  const renderCostAllocation = () => {
    return (
      <CostAllocationForm
        form={form}
        costCenterType={costCenterType}
        costAccountingId={costAccountingId}
        uniqueKey={uniqueKey}
        examineDetail={examineDetail}
        costOrderDetail={costOrderDetail}
      />
    );
  };

  // 上传附件
  const renderUploadFile = () => {
    return (
      <UploadFile
        form={form}
        fileList={attachments}
        fileListUrl={attachmentPrivateUrls}
      />
    );
  };

  // 备注
  const renderNote = () => {
    const formItems = [
      {
        label: '备注',
        form: getFieldDecorator('note', {
          initialValue: note,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <TextArea rows={2} />,
        ),
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

  // 支付信息
  const renderPaymentForm = () => {
    return (
      <Collection
        form={form}
        detail={costOrderDetail}
        totalMoney={form.getFieldValue('money')}
        isClassName
      />
    );
  };

  // 内容
  const renderContent = () => {
    return (
      <div>
        {
          renderCostAllocation()
        }
        {
          renderNote()
        }
        {
          renderUploadFile()
        }
        {
          renderPaymentForm()
        }
      </div>
    );
  };

  return renderContent();
};

export default InvoiceAdjust;

