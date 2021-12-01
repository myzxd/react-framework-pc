/**
 * 文件预览的功能
 */
import is from 'is_js';
import React from 'react';
import { Result, Empty } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './style.less';
import { FileType } from '../define';

const InnerComponentPreview = ({ type, name, url, wps, msg, state }) => {
  // 文件状态
  const fileState = {
    Upload: 1,    // 上传中
    success: 100, // 成功
    fail: -100,   // 失败
  };

  // 如果文件类型非法，则返回格式不支持
  if (FileType.isIllegal(type)) {
    return (
      <Result className={styles['app-comp-core-model-preview-result']} icon={<SmileOutlined />} title={`${type}格式不支持预览`} />
    );
  }

  // 渲染图片类
  if (FileType.isImage(type)) {
    return (
      <div className={styles['app-comp-core-preview-box']}>
        <img height={650} src={url} crossOrigin="anonymous" role="presentation" />
      </div>
    );
  }

  // 如果预览地址为空，或文件状态错误，则显示获取失败
  if (is.not.existy(wps) || is.empty(wps) || state !== fileState.success) {
    // 默认的错误信息
    const message = msg || '请手动刷新，加载文件预览';
    return (
      <div className={styles['app-comp-core-model-preview-empty']}>
        <Empty description={message} />
      </div>
    );
  }

  // 只读文档
  if (FileType.isDoc(type)) {
    return (
      <iframe style={{ border: 'none' }} width="100%" height="650px" src={wps} title={name} />
    );
  }

  // 渲染wps文档
  if (FileType.isWPS(type)) {
    return (
      <iframe style={{ border: 'none' }} width="100%" height="650px" src={wps} title={name} />
    );
  }

  // 默认渲染无数据页面
  return (
    <Result className={styles['app-comp-core-model-preview-result']} icon={<SmileOutlined />} title={`${type}格式不支持预览`} />
  );
};

InnerComponentPreview.propTypes = {
  // 文件类型
  type: PropTypes.string.isRequired,
  // 文件名称
  name: PropTypes.string.isRequired,
  // 文件地址
  url: PropTypes.string,
  // 文件预览链接（wps）
  wps: PropTypes.string,
  // 文件状态
  state: PropTypes.number,
  // 错误信息
  msg: PropTypes.string,
};

InnerComponentPreview.defaultProps = {
  url: '',
  wps: '',
};

export default InnerComponentPreview;
