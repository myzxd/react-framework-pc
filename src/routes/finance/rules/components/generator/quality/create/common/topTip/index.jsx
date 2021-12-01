/**
 * 服务费规则 补贴质量 顶部提示条
 * Finance/Components/quality/create/topTip
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';

import styles from '../../../../../common/style/index.less';

class Index extends Component {

  static propTypes = {
    content: PropTypes.string,   // 提示条内容
    onClose: PropTypes.func,     // 关闭回调
  };

  static defaultProps = {
    content: '',
  };

  onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  }

  render() {
    return (
      <div className={styles['app-comp-finance-top-tip']}>
        <InfoCircleOutlined className={styles['app-comp-finance-icon-info']} />
        <span>{this.props.content}</span>
        <CloseOutlined className={styles['app-comp-finance-icon-close']} onClick={this.onClose} />
      </div>
    );
  }
}

export default Index;
