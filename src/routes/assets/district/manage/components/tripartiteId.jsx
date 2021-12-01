/**
 * 系统管理 - 商圈管理 - 更多三方平台商圈id组件
 */
import React from 'react';
import dot from 'dot-prop';
import { Switch, Button, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import ComponentTripartiteIdItem from './tripartiteIdItem';
import { DistrictPlatformState } from '../../../../../application/define';
import './style.css';


function ComponentTripartiteId(props) {
  const checked = dot.get(props, 'value.checked', false);
  const items = dot.get(props, 'value.items', []);
  const disabled = dot.get(props, 'disabled', false);
  const disabledSwitch = dot.get(props, 'disabledSwitch', false);
  const onChange = (values) => {
    const params = {
      ...props.value,
      ...values,
    };
    if (props.onChange) {
      props.onChange(params);
    }
  };

  // 改变平台
  const onChangePlatform = (e, i) => {
    items[i].code = e;
    onChange({ items });
  };

  // 改变平台商圈id
  const onChangePlatformId = (e, i) => {
    items[i].id = e.target.value;
    onChange({ items });
  };

  // 添加
  const onClickAddItems = () => {
    const val = items[items.length - 1];
    // 判断是否是否填写完整
    if (items.length - 1 >= 0 &&
      Object.values(val).filter(v => v !== '').length < 3) {
      return message.error('请填写完当前数据，再添加');
    }
    items.push({ disabled: false });
    onChange({ items });
  };

  // 删除
  const onClickRemove = (i) => {
    items.splice(i, 1);
    onChange({ items });
  };

  // 渲染表单开关
  const renderSwitch = () => {
    // 判断是否有数据
    if (disabledSwitch) {
      return null;
    }
    return (
      <div>
        <Switch
          checked={checked}
          disabled={disabled || disabledSwitch}
          onChange={(val) => {
            onChange({ checked: val, items: [{ disabled: false }] });
          }}
        />
      </div>
    );
  };

  // 渲染表单
  const renderItems = () => {
    // 开关没选中不渲染表单
    if (!checked) {
      return null;
    }
    const codes = items.map(v => v.code);
    const { length: platformStateLength } = Object.values(DistrictPlatformState).filter(v => typeof v !== 'function');
    return (
      <React.Fragment>
        {items.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <ComponentTripartiteIdItem
                disabled={disabled}
                disabledItem={item.disabled}
                item={item}
                codes={codes}
                onChangePlatform={e => onChangePlatform(e, index)}
                onChangePlatformId={e => onChangePlatformId(e, index)}
              />
              {disabled || item.disabled ? null : (
                <MinusCircleOutlined
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    onClickRemove(index);
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
        {
          items.length >= platformStateLength || disabled ? null : (
            <Button
              type="dashed"
              style={{ width: 'calc( 80% + 25px)' }}
              onClick={onClickAddItems}
            >
              <PlusOutlined /> 添加
            </Button>
          )
        }
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {/* 渲染表单开关 */}
      {renderSwitch()}

      {/* 渲染表单 */}
      {renderItems()}
    </React.Fragment>
  );
}
export default ComponentTripartiteId;
