/**
 *  工具库
 * */
import React from 'react';

import style from './style.css';
import { CorePhotos } from '../../../../../components/core';

/*
 * 将字符串的url转换为img标签
 * @param form 目标图片的url
 * @param ...args 还可传入自定义span,layout,等属性，用来覆盖或添加至新的FormItem
 * @return 返回一个新的FormItem对象
 */
export function wrapImageElement({ form, keys, ...args }) {
  // 默认为单个标签图片
  const value = {
    urls: [`${form}`],
    keys: keys || [`${form}`],
  };
  // form为数组时将图片全部拼接在一个form中
  if (Array.isArray(form)) {
    value.urls = form;
  }
  // namespace
  const namespace = `ComponentDetailContractInfo-${value.urls[0].slice(-8)}`;
  let target = <CorePhotos isDisplayMode value={value} namespace={namespace} />;
  // form为空则直接返回暂无标签
  if (form === '' || form === null || form === '--') {
    target = <div className={style['app-comp-employee-manage-detail-util']}>暂无</div>;
  }
  return {
    span: 8,
    layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
    form: target,
    ...args,
  };
}
