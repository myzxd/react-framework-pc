/**
 * 审批管理 - 流程审批 - 考勤管理 - 加班管理 - 加班单详情 /Expense/Attendance/OverTime/Detail
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Collapse,
} from 'antd';

import {
  CoreContent,
} from '../../../components/core';

import Person from './components/detail/person';
import OverTimeInfo from './components/detail/overTime';

const { Panel } = Collapse;

class Detail extends Component {
  static propTypes = {
    overTimeDetail: PropTypes.object, // 加班单详情
  }

  static defaultProps = {
    overTimeDetail: {},
  }

  componentDidMount() {
    const {
      location,
      dispatch,
    } = this.props;

    const { overTimeId } = location.query;

    dispatch({
      type: 'expenseOverTime/fetchOverTimeDetail',
      payload: { overTimeId },
    });
  }

  // 基本信息
  renderBaseInfo = () => {
    return <div>基本信息</div>;
  };

  // 加班人信息
  renderPersonInfo = () => {
    const { overTimeDetail } = this.props;

    return <Person detail={overTimeDetail} />;
  }

  // 加班信息
  renderOverTime = () => {
    const { overTimeDetail } = this.props;

    return <OverTimeInfo detail={overTimeDetail} />;
  }

  // 加班单
  renderOverTimeOrder = () => {
    const {
      overTimeDetail,
    } = this.props;
    const { _id } = overTimeDetail;
    return (
      _id &&
      <CoreContent title="加班单">
        <Collapse bordered={false} defaultActiveKey={[`${_id}`]}>
          <Panel
            header={`加班申请单号: ${_id}`}
            key={_id}
          >
            {/* 渲染加班人信息 */}
            {this.renderPersonInfo()}

            {/* 渲染加班信息 */}
            {this.renderOverTime()}
          </Panel>
        </Collapse>
      </CoreContent>
    );
  }

  // 内容
  renderContent = () => {
    return (
      <div>
        {/* 基本信息 */}
        {this.renderBaseInfo()}

        {/* 加班单 */}
        {this.renderOverTimeOrder()}
      </div>
    );
  }

  render() {
    return this.renderContent();
  }
}

const mapStateToProps = ({ expenseOverTime: { overTimeDetail } }) => {
  return {
    overTimeDetail,
  };
};

export default connect(mapStateToProps)(Detail);
