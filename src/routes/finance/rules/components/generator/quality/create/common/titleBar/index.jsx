/**
 * 服务费规则 补贴质量 标题 Finance/Components/generator/quality/create/competition/common/titleBar/index
 */

import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import styles from './style/index.less';

class TitleBar extends Component {

  static propTypes = {
    title: PropTypes.string,             // 标题文字
  }

  static defaultProps = {
    title: '',
  }

  render() {
    const { title } = this.props;

    return (
      <div className={styles['app-comp-finance-title']}>
        <Row type="flex" justify="space-around" align="middle">
          <Col span={12}>
            <span className={styles['app-comp-finance-title-spin']} />
            {title}
          </Col>
          <Col span={12} className={styles['app-comp-finance-right']} />
        </Row>
      </div>
    );
  }
}

export default TitleBar;
