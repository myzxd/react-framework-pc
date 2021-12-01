/**
 * 费用管理 - 付款审批 - 退款/还款审批单 - 费用单组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// TODO: 折行 @王晋
import {
  Collapse,
} from 'antd';

import {
  CoreContent,
} from '../../../../components/core';

import CostOrderItem from './costOrderItem';

import style from './style.css';

// TODO: 折行 @王晋
const {
  Panel,
} = Collapse;

class CostOrder extends Component {
  static propTypes = {
    location: PropTypes.object,
    examineOrderDetail: PropTypes.object, // 审批单详情
    examineDetail: PropTypes.object, // 审批流详情
    originalCostOrder: PropTypes.array, // 原费用单列表
  }

  static defaultProps = {
    location: {},
    examineOrderDetail: {},
    examineDetail: {},
    originalCostOrder: [],
  }

  constructor() {
    super();
    this.state = {
      activeKey: [], // 折叠面板key
    };
  }

  // 展开/收起全部
  onChangeCollapse = () => {
    // TODO: 折行 @王晋
    const {
      activeKey,
    } = this.state;

    const {
      originalCostOrder,
    } = this.props;

    // 定义需要更新的折叠面板key
    const key = [];

    // 判断，如果当前折叠面板没有全部打开，那么更新key为全部值(此时，按钮显示为 全部打开)
    if (activeKey.length !== originalCostOrder.length) {
      originalCostOrder.forEach((item, index) => {
        key.push(`${index}`);
      });
    }

    // 否则，折叠面板key数组置为空(此时，按钮显示为 全部收起)
    this.setState({ activeKey: key });
  }

  // 折叠面板的onChange
  onChangePanel = (key) => {
    this.setState({ activeKey: key });
  }

  // 渲染折叠面板右侧扩展内容
  renderExtra = (id, costOrderId) => {
    const { extra } = this.props;
    return extra && extra(id, costOrderId);
  }

  // 内容
  renderContent = () => {
    // TODO: 折行 @王晋
    const {
      activeKey,
    } = this.state;

    const {
      location,
      examineOrderDetail,
      examineDetail,
      originalCostOrder,
    } = this.props;

    const {
      id, // 审批单id
    } = examineOrderDetail;

    // 定义扩展操作
    const ext = (
      <span
        onClick={this.onChangeCollapse}
        className={style['app-comp-expense-detail-order-info-ext']}
      >
        {/* 判断显示文本，如果折叠面板全部展开，则显示 全部收起，否则显示 全部展开 */}
        {activeKey.length !== originalCostOrder.length ? '全部展开' : '全部收起'}
      </span>
    );

    return (
      <CoreContent
        key="salaryRules"
        title="费用单"
        titleExt={ext}
      >
        <Collapse
          bordered={false}
          activeKey={activeKey}
          onChange={this.onChangePanel}
        >
          {
            originalCostOrder.map((item, key) => {
              // 定义折叠面板每项的header
              const header = `费用单号: ${item.id}`;
              return (
                <Panel
                  header={header}
                  key={`${key}`}
                  extra={this.renderExtra(id, item.id)}
                >
                  <CostOrderItem
                    location={location}
                    // recordId={costOrderId}
                    examineOrderDetail={examineOrderDetail}
                    examineDetail={examineDetail}
                    costOrderDetail={item}
                  />
                </Panel>
              );
            })
          }
        </Collapse>
      </CoreContent>
    );
  }

  // TODO: 将renderContent修改问render，删除多余代码 @王晋
  render() {
    return this.renderContent();
  }
}

export default CostOrder;
