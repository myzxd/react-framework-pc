/**
 * 弹窗 放大||缩小
 */
import React from 'react';
import { Button } from 'antd';
import { ZoomOutOutlined, ZoomInOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import styles from '../style.less';

const InnerComponentFullScreenWidget = ({ isFullScreen, onFullScreen }) => {
  //  展示放大ico
  let renderPreviewIco = <Button className={styles['app-comp-core-model-widgets-fullscreen']} icon={<ZoomOutOutlined />} onClick={onFullScreen} />;
  // 展示默认ico
  if (!isFullScreen) {
    renderPreviewIco = <Button className={styles['app-comp-core-model-widgets-fullscreen']} icon={<ZoomInOutlined />} onClick={onFullScreen} />;
  }

  return (
    <React.Fragment key="fullscreen">
      {renderPreviewIco}
    </React.Fragment>
  );
};

InnerComponentFullScreenWidget.propTypes = {
  // 设置弹窗 放大||缩小
  onFullScreen: PropTypes.func,
};

InnerComponentFullScreenWidget.defaultProps = {
  onFullScreen: () => { },
};

export default InnerComponentFullScreenWidget;
