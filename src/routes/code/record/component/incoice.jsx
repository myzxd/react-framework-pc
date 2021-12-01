/**
 * team - 发票抬头
*/
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';

const { Option } = Select;

const InvoiceForm = ({
  dispatch,
  value,
  onChange,
  enumeratedValue = {}, // 枚举值
}) => {
  useEffect(() => {
    dispatch({
      type: 'codeRecord/getEnumeratedValue',
      payload: {},
    });

    return () => {
      dispatch({
        type: 'codeRecord/resetEnumerateValue',
        payload: {},
      });
    };
  }, [dispatch]);

  // code发票抬头
  const codeList = enumeratedValue.code_invoice_titles || [];
  // team发票抬头
  const teamList = enumeratedValue.team_invoice_titles || [];
  const data = [...new Set([...codeList, ...teamList])];

  return (
    <Select
      placeholder="请选择"
      allowClear
      showSearch
      dropdownMatchSelectWidth={false}
      value={value}
      onChange={onChange}
    >
      {
        data.map((v, key) => {
          return (<Option value={v.name} key={key}>{v.name}</Option>);
        })
      }
    </Select>
  );
};

const mapStateToProps = ({
  codeRecord: { enumeratedValue },
}) => {
  return { enumeratedValue };
};
export default connect(mapStateToProps)(InvoiceForm);
