/**
 * 系统管理 - 商圈管理 - 更多三方平台商圈id组件 - 子项
 */
import React from 'react';
import dot from 'dot-prop';
import { Select, Input } from 'antd';

import { DistrictPlatformState } from '../../../../../application/define';

const { Option } = Select;

function ComponentTripartiteIdItem(props) {
  const item = dot.get(props, 'item', {});
  const codes = dot.get(props, 'codes', []).filter(v => v !== item.code);
  const disabled = dot.get(props, 'disabled', false);
  const disabledItem = dot.get(props, 'disabledItem', false);
  // 渲染表单
  const renderItem = () => {
    const platformStates = Object.values(DistrictPlatformState).filter(v => typeof v !== 'function');
    // 遍历更多平台商圈id
    const optionList = platformStates.map((val) => {
      return {
        code: val,
        name: DistrictPlatformState.description(val),
      };
    });
    return (
      <React.Fragment>
        <Select
          onChange={props.onChangePlatform}
          placeholder="选择平台"
          disabled={disabled || disabledItem}
          value={item.code}
          style={{ width: '40%' }}
        >
          {
            optionList.map((val) => {
              // 过滤
              if (codes.includes(val.code)) {
                return null;
              }
              return (
                <Option value={val.code}>{val.name}</Option>
              );
            })
          }
        </Select>
        <span style={{ margin: '0 5px' }}>--</span>
        <Input
          placeholder="输入平台中的商圈ID"
          onChange={props.onChangePlatformId}
          value={item.id}
          disabled={disabled}
          style={{ width: '40%' }}
        />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {/* 渲染表单 */}
      {renderItem()}
    </React.Fragment>
  );
}
export default ComponentTripartiteIdItem;
