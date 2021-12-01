/**
 * 弹窗第二版 子组件
 */
import React from 'react';
import { Result } from 'antd';
import FileViewer from 'react-file-viewer';

import { SmileOutlined } from '@ant-design/icons';
import { isImageTypeTool, isDocTypeTool } from './view';

import styles from './styles.modules.less';

const renderDifferentChild = ({ enclosureType, enclosureName, enclosureAdress }) => {
  // 文件类型： 大写 转 小写
  const fileType = enclosureType && enclosureType.toLowerCase();

  const onError = (e) => {
    console.log(e, 'error in file-viewer');
  };
  // 默认渲染无数据页面
  let child = (
    <Result
      className={styles['component-preview-model-antd-result']}
      icon={<SmileOutlined />}
      title={`${enclosureType}格式不支持预览`}
    />);
  // 渲染图片类
  if (isImageTypeTool(enclosureType)) {
    child = (
      <div className={styles['file-box']}>
        <FileViewer
          key={enclosureName}
          fileType={fileType}
          filePath={enclosureAdress}
          onError={onError}
        />
      </div>);
  }
  // 渲染doc类
  if (isDocTypeTool(enclosureType)) {
    child = (<iframe width="100%" height="650px" src={enclosureAdress} title="暂无数据" />);
  }

  return child;
};

export default renderDifferentChild;
