/**
 * 付款审批 - 审批单详情 - 加班单
 */
import PropTypes from 'prop-types';
import { connect } from 'dva';
import React, { Component } from 'react';
import {
  Collapse,
} from 'antd';

import {
  CoreContent,
} from '../../../../../../components/core';

import Person from '../../../../overTime/components/detail/person';
import OverTimeInfo from '../../../../overTime/components/detail/overTime';

import styles from './style.less';

const { Panel } = Collapse;

class OverTime extends Component {
  static propTypes = {
    examineOrderDetail: PropTypes.object, // 审批单详情
    overTimeDetail: PropTypes.object, // 加班单详情
    isExternal: PropTypes.bool, // 外部审批字段
  }

  static defaultProps = {
    examineOrderDetail: {},
    overTimeDetail: {},
    isExternal: false,
  }

  constructor() {
    super();
    this.state = {
      activeKey: [], // 折叠面板key
    };
  }

  componentDidMount() {
    const {
      examineOrderDetail,
      dispatch,
      isExternal = false,
    } = this.props;

    if (isExternal) return;

    const {
      extraWorkOrLeaveId, // 加班单id
    } = examineOrderDetail;

    dispatch({ type: 'expenseOverTime/fetchOverTimeDetail', payload: { overTimeId: extraWorkOrLeaveId } });
  }

  // 折叠面板的onChange
  onChangePanel = (key) => {
    this.setState({ activeKey: key });
  }

  // 展开/收起全部
  onChangeCollapse = () => {
    const { activeKey } = this.state;
    const {
      examineOrderDetail,
      overTimeDetail,
    } = this.props;

    // 兼容外部单据
    const { _id: workId } = overTimeDetail;
    const ids = extraWorkOrLeaveId || workId;

    const { extraWorkOrLeaveId } = examineOrderDetail;

    // 定义需要更新的折叠面板key
    const key = [];
    // 判断，如果当前折叠面板没有全部打开，那么更新key为全部值(此时，按钮显示为 全部打开)
    if (activeKey.length !== [ids].length) {
      [ids].forEach((item) => {
        key.push(`${item}`);
      });
    }

    // 否则，折叠面板key数组置为空(此时，按钮显示为 全部收起)
    this.setState({ activeKey: key });
  }

  // 加班单
  renderOverTime = () => {
    const {
      overTimeDetail, // 加班单详情
    } = this.props;

    if (Object.keys(overTimeDetail).length === 0) return null;

    return (
      <div>
        <Person detail={overTimeDetail} />
        <OverTimeInfo detail={overTimeDetail} />
      </div>
    );
  }

  // 内容
  renderContent = () => {
    const { activeKey } = this.state;
    const { examineOrderDetail, overTimeDetail = {} } = this.props;

    const { extraWorkOrLeaveId } = examineOrderDetail; // 加班单id

    // 兼容外部单据
    const { _id: workId } = overTimeDetail;
    const ids = extraWorkOrLeaveId || workId;

    // 定义扩展操作
    const ext = (
      <span
        onClick={this.onChangeCollapse}
        className={styles['app-comp-expense-detail-order-info-ext']}
      >
        {/* 判断显示文本，如果折叠面板全部展开，则显示 全部收起，否则显示 全部展开 */}
        {activeKey.length !== [ids].length ? '全部展开' : '全部收起'}
      </span>);

    return (
      <CoreContent key="overTime" title="加班单" titleExt={ext}>
        <Collapse bordered={false} activeKey={activeKey} onChange={this.onChangePanel}>
          {
            [ids].map((overTimeId) => {
              // 定义折叠面板每项的header
              const header = `加班申请单号: ${overTimeId}`;
              return (
                <Panel header={header} key={`${overTimeId}`}>
                  {this.renderOverTime()}
                </Panel>
              );
            })
          }
        </Collapse>
      </CoreContent>
    );
  }

  render() {
    return this.renderContent();
  }

}

function mapStateToProps({
  expenseOverTime: { overTimeDetail },
}) {
  return {
    overTimeDetail,
  };
}

export default connect(mapStateToProps)(OverTime);
