/**
 * team - 发票抬头
*/
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { connect } from 'dva';

import { Select } from 'antd';
import { omit } from '../../../application/utils';
import {
  CodeSubmitType,
} from '../../../application/define';

const { Option } = Select;

function ComponentTeamInvoiceTitles(props) {
  const { dispatch, orderId, costCenterType } = props;
  // 枚举类型
  let enumeratedType;
  // code
  costCenterType === CodeSubmitType.code && (enumeratedType = 'codeInvoiceTitles');
  // team
  costCenterType === CodeSubmitType.team && (enumeratedType = 'teamInvoiceTitles');

  useEffect(() => {
    dispatch({
      type: 'applicationCommon/getEnumeratedValue',
      payload: { enumeratedType },
    });
  }, [dispatch, orderId, enumeratedType]);
    // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'orderId',
    'enumeratedValue',
    'costCenterType',
  ], props);
  const dataScoure = dot.get(props, `enumeratedValue.${enumeratedType}`, []);
  const options = dataScoure.map((v) => {
    return (
      <Option key={v.name} value={v.name}>{v.name}</Option>
    );
  });

  return (
    <Select {...omitedProps}>
      {options}
    </Select>
  );
}

const mapStateToProps = ({
  applicationCommon: { enumeratedValue },
}) => {
  return { enumeratedValue };
};
export default connect(mapStateToProps)(ComponentTeamInvoiceTitles);
