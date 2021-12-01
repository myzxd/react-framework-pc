/**
 * 核心组件，内容预览
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';
import styles from './style/index.less';

const CorePreview = (props) => {
  const { style, markdown, children } = props;

  // 默认显示children
  let content = children;

  // 如果有markdown内容，优先显示
  if (markdown !== '') {
    // 解析md文件，base64反编译
    const regex = /data:text\/x-markdown;base64,(.*)/;
    const matches = regex.exec(markdown);
    content = matches ? Base64.decode(matches[1]) : `markdown内容解析失败:${markdown}`;
  }

  return (
    <pre className={styles['app-comp-core-content-preview']} style={style}>
      {content}
    </pre>
  );
};

CorePreview.propTypes = {
  markdown: PropTypes.string, // markdown文件内容(优先显示)
  children: PropTypes.node,   // 模块内容
  style: PropTypes.object,    // 样式
};

CorePreview.defaultProps = {
  markdown: '',               // markdown文件内容(优先显示)
  children: null,             // 模块内容
  style: {},                  // 样式
};

// 上一版 module.exports = CorePreview;
export default CorePreview;
