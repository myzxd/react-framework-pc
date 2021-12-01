/**
 * 单选框气泡选择组件
 */
import React, { useState } from 'react';
import { Popconfirm, Radio } from 'antd';

import { TimeCycle } from '../../../../../application/define';

import style from './style.less';

const PopconfirmRadio = ({
  value = TimeCycle.year,
  onChange,
  disabled,
  onChangePopconfirm,
}) => {
  const [timeCycle, setTimeCycle] = useState(TimeCycle.year);

  // 气泡确认
  const onConfirm = () => {
    onChange && (onChange(timeCycle));
    onChangePopconfirm && onChangePopconfirm();
  };

  const onCancel = () => {
    setTimeCycle(value);
  };

  const renderPopconfirm = () => {
    if (disabled) {
      return (
        <div className={style['employee-common-popconfirm-radio-wrap']}>
          <span>{TimeCycle.description(value)}</span>
        </div>
      );
    }

    const title = (
      <Radio.Group
        value={timeCycle}
        onChange={val => setTimeCycle(val.target.value)}
      >
        <Radio
          className={style['employee-popconfirm-radio-style']}
          value={TimeCycle.year}
        >{TimeCycle.description(TimeCycle.year)}</Radio>
        <Radio
          className={style['employee-popconfirm-radio-style']}
          value={TimeCycle.month}
        >{TimeCycle.description(TimeCycle.month)}</Radio>
        <Radio
          className={style['employee-popconfirm-radio-style']}
          value={TimeCycle.day}
        >{TimeCycle.description(TimeCycle.day)}</Radio>
      </Radio.Group>
    );

    return (
      <Popconfirm
        icon={''}
        className=":global"
        title={title}
        onConfirm={onConfirm}
        onCancel={onCancel}
      >
        <div
          className={style['app-comp-employee-compareType']}
        >
          <span>{TimeCycle.description(value)}</span>
        </div>
      </Popconfirm>
    );
  };
  return renderPopconfirm();
};

export default PopconfirmRadio;
