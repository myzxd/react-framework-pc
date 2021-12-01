/**
 * 公用Select组件-选择星座
 */
import React from 'react';
import { CoreSelect } from '../../core';

const Option = CoreSelect.Option;
const constellation = [
  { name: '白羊座' },
  { name: '金牛座' },
  { name: '双子座' },
  { name: '巨蟹座' },
  { name: '狮子座' },
  { name: '处女座' },
  { name: '天秤座' },
  { name: '天蝎座' },
  { name: '射手座' },
  { name: '摩羯座' },
  { name: '水瓶座' },
  { name: '双鱼座' },
];

const CommonSelectConstellation = (props = {}) => {
  // 选项
  const options = constellation.map((item, index) => {
    return <Option key={index} value={item.name} >{item.name}</Option>;
  });

  return (
    <CoreSelect {...props} placeholder="请选择星座">
      {options}
    </CoreSelect>
  );
};

export default CommonSelectConstellation;
