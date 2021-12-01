/**
 * 费用管理 - 房屋管理 - 房屋续租/退租/断租提交生成费用单按钮
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Row,
  Col,
  Button,
} from 'antd';

import style from './style.css';

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
        className={style['app-comp-expense-house-contract-common-operation']}
      >
        <Col>
          <Button
            type="primary"
            size="large"
            onClick={onSubmit}
          >
            提交并生成费用单
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
