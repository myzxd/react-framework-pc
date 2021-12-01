/**
 * 费用管理 - 付款审批 - 退款审批单 - 退款费用单 - 退款表单
 */

import { connect } from 'dva';
import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, InputNumber, Button, message } from 'antd';

import {
  Unit,
  InvoiceAjustAction,
} from '../../../../../application/define';

import {
  DeprecatedCoreForm,
} from '../../../../../components/core';

import UploadFile from '../../components/uploadFile';
import CommonExpense from '../../common/expense';
import onVerify from '../../common/verify';
import Collection from '../../common/collection';

import style from './style.css';

const Refund = (props) => {
  let isOneSubmit = true;

  const {
    form,
    detail = {}, // 原审批单详情
    // disabled = false,
    orderId, // 原审批单id
    dispatch,
    refundId, // 退款审批单id
    originalId, // 退款费用单id
    costOrderId, // 原费用单id
    examineDetail = {}, // 审批流详情
    invoiceCostOrder = {}, // 退款费用单详情
  } = props;

  const {
    getFieldDecorator,
    validateFields,
    resetFields,
  } = form;

  const {
    totalMoney = undefined, // 金额
    costGroupName, // 费用分组
    costAccountingInfo: {
      name,
      costCenterType: selectedCostCenterType,
    } = {
      name: '',
    }, // 科目名称
   costAccountingId: selectedSubjectId, // 科目id
  } = detail;

  const {
    totalMoney: invoiceMoney, // 退款金额
    note: invoiceNote, // 退款说明
    attachmentPrivateUrls: fileListUrl, // 退款附件地址
    attachments: fileList, // 退款附件
  } = invoiceCostOrder;

  // 保存退款单
  const onSave = () => {
    // 表单校验
    validateFields((err, values) => {
      if (err) {
        return;
      }

      const isSubmit = onVerify(values, err);

      const param = {
        ...detail,
        ...values,
        totalMoney: -(values.money * 100),
      };

      if (isSubmit === true && !originalId && isOneSubmit) {
        dispatch({
          type: 'expenseCostOrder/createRefundOrder',
          payload: {
            orderId: refundId,
            costOrderId,
            action: InvoiceAjustAction.refund,
            records: [param],
            onSuccessCallback: onCancel,
            onFailureCallback,
          },
        });
      }

      if (isSubmit === true && originalId && isOneSubmit) {
        dispatch({
          type: 'expenseCostOrder/updateRefundOrder',
          payload: {
            refundCostId: originalId,
            costOrderId,
            action: InvoiceAjustAction.refund,
            record: param,
            onSuccessCallback: onCancel,
            onFailureCallback,
          },
        });
      }

      // isSubmit = false;
    });
  };

  // 取消修改
  const onCancel = () => {
    isOneSubmit = false;
    // 重置表单
    resetFields();

    window.location.href = `/#/Expense/Manage/RefundForm?orderId=${orderId}&refundId=${refundId}`;
  };

  // 失败回调
  const onFailureCallback = (res) => {
    if (res && res.zh_message) {
      isOneSubmit = true;
      return message.error(res.zh_message);
    }
  };

  // 成本归属
  const renderCostAllocation = () => {
    // 审批流所属平台
    const { platformCodes: platformParam } = examineDetail;

    const {
      allocationMode: costBelong = undefined,
      costAllocationList = [],
    } = invoiceCostOrder;

    // 成本中心
    const expense = Object.keys(invoiceCostOrder).length === 0
      ? {}
      : {
        costBelong, // 成本归属分摊模式
        // 子项目
        costItems: costAllocationList.map((item) => {
          let costCount;
          if (item.money) {
            costCount = -Unit.exchangePriceToYuan(item.money);
          }
          const costAllocation = {};
          // 平台
          if (item.platformCode) {
            costAllocation.platform = item.platformCode;
            costAllocation.platformName = item.platformName;
          }
          // 供应商
          if (item.supplierId) {
            costAllocation.vendor = item.supplierId;
            costAllocation.vendorName = item.supplierName;
          }
          // 城市
          if (item.cityCode) {
            costAllocation.city = item.cityCode;
            costAllocation.cityName = item.cityName;
            costAllocation.citySpelling = item.citySpelling;
          }
          // 商圈
          if (item.bizDistrictId) {
            costAllocation.district = item.bizDistrictId;
            costAllocation.districtName = item.bizDistrictName;
          }
          // 自定义分配金额
          if (costCount) {
            costAllocation.costCount = costCount;
          }
          return costAllocation;
        }),
      };

    return (
      getFieldDecorator('expense', { initialValue: expense })(
        <CommonExpense
          CostAccountingId={selectedSubjectId}
          form={form}
          selectedCostCenterType={selectedCostCenterType}
          platformParam={platformParam}
        />,
      )
    );
  };

  // 基本信息
  const renderBaseInfo = () => {
    // 退款金额
    const formItems = [
      {
        label: '退款金额',
        form: getFieldDecorator('money', {
          initialValue: invoiceMoney ? Unit.exchangePriceToYuan(-invoiceMoney) : '',
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            min={0}
            max={Unit.exchangePriceToYuan(totalMoney)}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />,
        ),
      },
      {
        label: '费用分组',
        form: costGroupName || '--',
      },
      {
        label: '科目',
        form: name || '--',
      },
    ];

    // 基本信息布局
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <DeprecatedCoreForm
        items={formItems}
        layout={layout}
        cols={3}
      />
    );
  };

  // 上传附件
  const renderUploadFile = () => {
    return (
      <UploadFile
        form={form}
        fileList={fileList}
        fileListUrl={fileListUrl}
      />
    );
  };

  // 备注
  const renderNote = () => {
    // 退款说明
    const descriptionForm = [
      {
        label: '退款说明',
        form: getFieldDecorator('description', {
          initialValue: invoiceNote,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input />,
        ),
      },
    ];

    // 单行布局
    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

    return (
      <DeprecatedCoreForm
        items={descriptionForm}
        cols={1}
        layout={layout}
      />
    );
  };

  // 操作
  const renderOperation = () => {
    return (
      <div
        className={style['app-comp-expense-refund-operate-wrap']}
      >
        <Button
          type="primary"
          onClick={onCancel}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={onSave}
          className={style['app-comp-expense-refund-save']}
        >
          保存
        </Button>
      </div>
    );
  };

  // 支付信息
  const renderPaymentForm = () => {
    return (
      <Collection
        form={form}
        totalMoney={form.getFieldValue('money')}
        detail={invoiceCostOrder}
        isClassName
      />
    );
  };

  // 内容
  const renderContent = () => {
    // 数据没加载出来，不渲染
    if (originalId && Object.keys(invoiceCostOrder).length === 0) {
      return null;
    }
    return (
      <div
        className={style['app-comp-expense-manage-refund-cost-wrap']}
      >
        <h2
          className={style['app-comp-expense-manage-refund-cost-title']}
        >
          退款申请单
        </h2>

        {/* 基本信息 */}
        {
          renderBaseInfo()
        }

        {/* 成本分摊 */}
        {
          renderCostAllocation()
        }

        {/* 退款说明 */}
        {
          renderNote()
        }

        {/* 附件 */}
        {
          renderUploadFile()
        }

        {/* 收款 */}
        {
          renderPaymentForm()
        }

        {/* 操作 */}
        {
          renderOperation()
        }
      </div>
    );
  };

  return renderContent();
};

export default connect()(Form.create()(Refund));

