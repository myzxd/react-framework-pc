/**
 * 摊销管理- 发票抬头select
*/
import _ from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';

const { Option } = Select;

const InvoiceForm = ({
  dispatch,
  value,
  onChange,
  enumeratedValue = {}, // 枚举值
  ...props
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
  // 去重
  const data = _.uniqWith([...codeList, ...teamList], (a, b) => (a.name === b.name));

  return (
    <Select
      value={value}
      onChange={onChange}
      dropdownMatchSelectWidth={false}
      {...props}
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
