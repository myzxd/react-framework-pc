/**
 * 弹窗 在新窗口打开
 */
import React from 'react';
import { Button } from 'antd';
import { CompassOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import styles from '../style.less';

const InnerComponentNewTabWidget = ({ onOpenNewTab }) => {
  return (
    <React.Fragment>
      <Button className={styles['app-comp-core-model-widgets-newopen']} icon={<CompassOutlined />} onClick={onOpenNewTab} />
    </React.Fragment>
  );
};

InnerComponentNewTabWidget.propTypes = {
  onOpenNewTab: PropTypes.func,
};

InnerComponentNewTabWidget.defaultProps = {
  onOpenNewTab: () => { },
};

export default InnerComponentNewTabWidget;
