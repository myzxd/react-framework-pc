/**
 * tab切换下
 * 主题标签组件
 */
import React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import is from 'is_js';

import { CoreForm } from '../../../../components/core';
import PageComponentThemeTag from './themeTag';

function ComponentThemeTag(props) {
  const { setThemeTag, formItemsTags } = props;

  // 获取tag表单输入的内容
  const onChangeGetTagValue = v => setThemeTag(v);

  let themeTagitem = [
    <Form.Item
      label="主题标签"
      name="themeTag"
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 16 }}
    >
      <PageComponentThemeTag onChange={onChangeGetTagValue} placeholder="请填写主题标签" />
    </Form.Item>,
  ];

  // 如果传入FormItem表单 使用传进来的
  if (formItemsTags && is.not.empty(formItemsTags)) {
    themeTagitem = formItemsTags;
  }

  return (
    <React.Fragment>
      <CoreForm items={themeTagitem} cols={2} />
    </React.Fragment>
  );
}

ComponentThemeTag.propTypes = {
  formItemsTags: PropTypes.array,
  setThemeTag: PropTypes.func,
};

ComponentThemeTag.defaultProps = {
  formItemsTags: [],     // 传过来的FormItem 表单
  setThemeTag: () => {}, // 设置主题标签内容
};

export default ComponentThemeTag;
