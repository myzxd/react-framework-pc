/**
 * 费用管理 - 考勤管理 - 请假管理列表页 - 请假详情页
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TakeLeaveSingle from './details/single';
import BaseInfo from './details/baseInfo';

class Detail extends Component {
  static propTypes = {
    expenseTakeLeaveDetail: PropTypes.object, // 请假详情
  }

  static defaultProps = {
    expenseTakeLeaveDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      takeLeaveId: dot.get(props, 'location.query.takeLeaveId', undefined),  // 借款id
    };
  }

  // 默认加载数据
  componentDidMount() {
    const { takeLeaveId } = this.state;
    this.props.dispatch({
      type: 'expenseTakeLeave/fetchExpenseTakeLeaveDetail',
      payload: {
        id: takeLeaveId,
      },
    });
  }

  // 渲染请假单信息
  renderTakeLeaveSingle = () => {
    const { expenseTakeLeaveDetail } = this.props;

    return (
      <TakeLeaveSingle
        expenseTakeLeaveDetail={expenseTakeLeaveDetail}
      />
    );
  }

  // 渲染基础信息
  renderBaseInfo = () => {
    const { expenseTakeLeaveDetail } = this.props;

    return (
      <BaseInfo
        expenseTakeLeaveDetail={expenseTakeLeaveDetail}
      />
    );
  }

  render = () => {
    const { expenseTakeLeaveDetail } = this.props;

    // 数据为空，返回null
    if (Object.keys(expenseTakeLeaveDetail).length === 0) return <div />;
    return (
      <div>
        {/* 渲染基础信息 */}
        {this.renderBaseInfo()}

        {/* 渲染请假人基础信息 */}
        {this.renderTakeLeaveSingle()}
      </div>
    );
  }
}

function mapStateToProps({
  expenseTakeLeave: {
    expenseTakeLeaveDetail,
  },
}) {
  return {
    expenseTakeLeaveDetail,
  };
}

export default connect(mapStateToProps)(Detail);
