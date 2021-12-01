/**
 * 合同周期
 */
import React from 'react';
import PropTypes from 'prop-types';

import { CoreSelect } from '../../core';

const Options = [
  {
    value: 1,
    label: '1年',
  },
  {
    value: 2,
    label: '2年',
  },
  {
    value: 3,
    label: '3年',
  },
  {
    value: 4,
    label: '4年',
  },
  {
    value: 5,
    label: '5年',
  },
];

function CommonSelectContractCycle({ value, onChange, ...restProps }) {
  return (
    <CoreSelect value={value} onChange={onChange} {...restProps}>
      {
        Options.map(({ value: val, label }) => (
          <CoreSelect.Option key={`${val}`} value={val}>{label}</CoreSelect.Option>
        ))
      }
    </CoreSelect>
  );
}

CommonSelectContractCycle.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
};

export default CommonSelectContractCycle;
