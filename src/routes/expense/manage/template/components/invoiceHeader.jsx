/**
 * 费用表单 - 发票抬头
 */
import React, { useEffect } from 'react';
import {
  Select,
} from 'antd';
import { connect } from 'dva';

const Option = Select.Option;

const InvoiceHeader = ({
  invoiceList = {},
  dispatch,
  platform,
  disabled = false,
  value,
  onChange,
  isDetail = false,
  invoiceVal = undefined,
}) => {
  useEffect(() => {
    dispatch({ type: 'expenseCostOrder/getCostInvoiceHeader', payload: { platform } });
    return () => dispatch({ type: 'expenseCostOrder/resetCostInvoiceHeader', payload: {} });
  }, [platform, dispatch]);

  if (!invoiceList || Object.keys(invoiceList).length <= 0 || !invoiceList.data || Object.keys(invoiceList.data).length <= 0) return <div />;

  const { data = {} } = invoiceList;

  const invoice = platform === 'zongbu' ? Object.values(data) : data;

  // 详情
  if (isDetail) {
    let invoiceDetail = '--';
    invoiceVal && (invoiceDetail = invoiceVal);
    invoiceVal && Number(invoiceVal) && (invoiceDetail = invoice.find((i, key) => (key + 1) === Number(invoiceVal)));
    return invoiceDetail;
  }

  return (
    <Select
      allowClear
      showSearch
      placeholder="请选择发票抬头"
      optionFilterProp="children"
      disabled={disabled}
      value={value}
      onChange={onChange}
    >
      {
        platform === 'zongbu' ?
          invoice.map((i, key) => <Option value={`${key + 1}`} key={key}>{i}</Option>)
          : invoice.map(i => <Option value={i.name} key={i._id}>{i.name}</Option>)
      }
    </Select>
  );
};

function mapStateToProps({ expenseCostOrder: { invoiceList } }) {
  return {
    invoiceList,
  };
}

export default connect(mapStateToProps)(InvoiceHeader);
