/**
 * 主题标签
 */
import React from 'react';
import { Select } from 'antd';

function ComponentThemeTag(props) {
  const selectProps = {
    value: props.value,
    placeholder: props.placeholder,
    ...props,
  };
  return (
    <Select
      mode="tags"
      notFoundContent=""
      allowClear
      tokenSeparators={[',', '，']}
      {...selectProps}
    />
  );
}

export default ComponentThemeTag;
