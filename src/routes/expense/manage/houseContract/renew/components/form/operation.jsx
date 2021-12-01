/**
 * 费用管理 - 房屋管理 - 房屋续签操作
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
} from 'antd';

import style from '../../style.css';

class Operation extends Component {
  static propsTypes = {
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    onSubmit: () => {},
  }

  // 渲染操作
  renderContent = () => {
    const { onSubmit } = this.props;
    return (
      <Row
        type="flex"
        align="middle"
        justify="space-around"
      >
        <Col>
          <Button
            type="primary"
            size="large"
            onClick={onSubmit}
            className={style['app-comp-expense-house-contract-renew-operation']}
          >
            保存房屋合同
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            onClick={onSubmit}
          >
            预览费用申请单
          </Button>
        </Col>
      </Row>
    );
  }

  render = () => {
    return this.renderContent();
  }
}

export default Operation;
