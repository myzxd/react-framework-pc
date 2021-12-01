/**
 * 考勤类 - 根据小时计算天
 */
import React from 'react';
import { InputNumber } from 'antd';

import { Unit } from '../../../../../../application/define';


function HourlyCalculationDays(props) {
  const onChange = (value) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };
  const { isDetail } = props;
  const day = props.value ? Unit.exchangeHourlyCalculationDays(props.value) : 0;
  return (
    <React.Fragment>
      {isDetail ?
        props.value :
        <InputNumber
          min={0}
          value={props.value}
          style={{ width: 60 }}
          onChange={onChange}
          precision={1}
        />
      }
        小时（合计 {day} 天）
    </React.Fragment>
  );
}

export default HourlyCalculationDays;
