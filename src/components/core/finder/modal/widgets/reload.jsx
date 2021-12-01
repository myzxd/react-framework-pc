/**
 * 重新加载组件
 */
import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from '../style.less';

const InnerComponentReloadWidget = ({ onReload }) => {
  return (
    <React.Fragment key="reload">
      <Button className={styles['app-comp-core-modal-widgets-reload']} icon={<ReloadOutlined />} onClick={onReload} />
    </React.Fragment>
  );
};

InnerComponentReloadWidget.propTypes = {
  // 刷新数据
  onReload: PropTypes.func,
};

InnerComponentReloadWidget.defaultProps = {
  onReload: () => { },
};

export default InnerComponentReloadWidget;
