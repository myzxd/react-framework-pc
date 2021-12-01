/**
 * 合同份数
 */
import React from 'react';
import { InputNumber } from 'antd';

function Contractitems(props) {
  const { value } = props;
  // 份数
  const onChangeCopies = (e) => {
    value.copies = e;
    triggerChange({ ...value });
  };

  // 我方合同份数
  const onChangeOurCopies = (e) => {
    value.our_copies = e;
    triggerChange({ ...value });
  };

  // 对方合同份数
  const onChangeopPositeCopies = (e) => {
    value.opposite_copies = e;
    triggerChange({ ...value });
  };

  const triggerChange = (changedValue) => {
    const { onChange } = props;
    if (onChange) {
      onChange(Object.assign({}, value, changedValue));
    }
  };

  // 明细
  const renderDetailed = () => {
    const formItem = [
      {
        label: '一式',
        style: { marginRight: 10 },
        form: (
          <span>
            <InputNumber
              value={value.copies}
              onChange={onChangeCopies}
              min={0}
              max={10000}
              precision={0}
            />
            <a style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: '5px', marginRight: '5px' }}>份</a>
          </span>
        ),
      },
      {
        label: '其中我方',
        style: { marginRight: 10 },
        form: (
          <span>
            <InputNumber
              value={value.our_copies}
              min={0}
              max={10000}
              precision={0}
              onChange={onChangeOurCopies}
            />
            <a style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: '5px', marginRight: '5px' }}>份</a>
          </span>
        ),
      },
      {
        label: '对方',
        style: { marginRight: 10 },
        form: (
          <span>
            <InputNumber
              value={value.opposite_copies}
              min={0}
              max={10000}
              precision={0}
              onChange={onChangeopPositeCopies}
            />
            <a style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: '5px', marginRight: '5px' }}>份</a>
          </span>
        ),
      },
    ];
    return (
      <div>
        {formItem.map((val, index) => {
          return (
            <span key={index} style={val.style}>{val.label} {val.form}</span>
          );
        })}

      </div>
    );
  };
  return (
    <div>
      {/* 明细 */}
      {renderDetailed()}
    </div>
  );
}


export default Contractitems;
