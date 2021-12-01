/**
 * 下载组件
 */
import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const InnerComponentDownloadWidget = ({ onDownload }) => {
  return (
    <React.Fragment key="download">
      <Button type="primary" icon={<DownloadOutlined />} onClick={onDownload} />
    </React.Fragment>
  );
};

InnerComponentDownloadWidget.propTypes = {
  // 下载当前预览文件
  onDownload: PropTypes.func,
};

InnerComponentDownloadWidget.defaultProps = {
  onDownload: () => { },
};

export default InnerComponentDownloadWidget;
