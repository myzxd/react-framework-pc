/**
 * 付款审批 - 请假单信息
 */
import is from 'is_js';
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Collapse } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DeprecatedCoreForm, CoreContent, CoreFinder } from '../../../../../components/core';
import { ExpenseAttendanceTakeLeaveType } from '../../../../../application/define';

import style from './style.less';

const { CoreFinderList } = CoreFinder;

const Panel = Collapse.Panel;

class TakeLeaveSingle extends Component {

  static propTypes = {
    extraWorkOrLeaveId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // 请假id列表
    isExternal: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: [], // 折叠面板key
    };
  }

  componentDidMount() {
    const { extraWorkOrLeaveId, isExternal = false } = this.props;
    if (is.not.existy(extraWorkOrLeaveId) || is.empty(extraWorkOrLeaveId) || isExternal) {
      return;
    }
    // 获取请假单详情
    this.props.dispatch({
      type: 'expenseTakeLeave/fetchExpenseTakeLeaveDetail',
      payload: {
        id: extraWorkOrLeaveId,
      },
    });
  }

  // 获取审批信息
  onRequestOrderDetail = (key) => {
    this.setState({ activeKey: key });
  }

  // 展开/收起全部
  onChangeCollapse = () => {
    const { activeKey } = this.state;
    const { extraWorkOrLeaveId } = this.props;

    // 定义需要更新的折叠面板key
    const key = [];
    // 判断，如果当前折叠面板没有全部打开，那么更新key为全部值(此时，按钮显示为 全部打开)
    if (activeKey.length !== [extraWorkOrLeaveId].length) {
      [extraWorkOrLeaveId].forEach((item, index) => {
        key.push(`${index}`);
      });
    }

    // 否则，折叠面板key数组置为空(此时，按钮显示为 全部收起)
    this.setState({ activeKey: key });
  }
  // 个人信息
  renderPersonalInfo = () => {
    const { expenseTakeLeaveDetail } = this.props;
    const formItems = [
      {
        label: '实际请假人',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(expenseTakeLeaveDetail, 'actual_apply_name', '--'),
      }, {
        label: '联系人方式',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(expenseTakeLeaveDetail, 'phone', '--'),
      },
    ];

    // 范围信息
    const scopeItem = [
      {
        label: '项目',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(expenseTakeLeaveDetail, 'platform_name', undefined) || '--',
      }, {
        label: '城市',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(expenseTakeLeaveDetail, 'city_name', undefined) || '--',
      }, {
        label: '团队',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 15 } },
        form: dot.get(expenseTakeLeaveDetail, 'biz_district_name', undefined) || '--',
      },
    ];

    return (
      <CoreContent title="请假人信息">
        <DeprecatedCoreForm items={formItems} />
        <DeprecatedCoreForm items={scopeItem} />
      </CoreContent>
    );
  }

  // 预览组件
  renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0.file_url')) {
      const datas = value.map((item) => {
        return { key: item.file_name, url: item.file_url };
      });
      return (
        <CoreFinderList data={datas} />
      );
    }
    return '--';
  };

  // 请假信息
  renderAskLeave = () => {
    const { expenseTakeLeaveDetail } = this.props;
    // 判断详情数据是否为空
    if (is.empty(expenseTakeLeaveDetail) || is.not.existy(expenseTakeLeaveDetail)) {
      return '详情数据为空';
    }

    const formItems = [
      {
        label: '请假类型',
        form: dot.get(expenseTakeLeaveDetail, 'leave_type', 0) ? ExpenseAttendanceTakeLeaveType.description(dot.get(expenseTakeLeaveDetail, 'leave_type', 0)) : '--',
      },
      {
        label: '开始时间',
        form: moment(dot.get(expenseTakeLeaveDetail, 'start_at')).format('YYYY.MM.DD HH:mm:ss'),
      }, {
        label: '结束时间',
        form: moment(dot.get(expenseTakeLeaveDetail, 'end_at')).format('YYYY.MM.DD HH:mm:ss'),
      },
      {
        label: '时长 (小时)',
        form: dot.get(expenseTakeLeaveDetail, 'duration', undefined) || '--',
      },
      {
        label: '请假事由',
        form: (
          <div className="noteWrap">
            {dot.get(expenseTakeLeaveDetail, 'reason', '--')}
          </div>
        ),
      }, {
        label: '工作安排',
        form: (
          <div className="noteWrap">
            {dot.get(expenseTakeLeaveDetail, 'work_placement', '--')}
          </div>
        ),
      }, {
        label: '上传附件',
        form: this.renderCorePreview(dot.get(expenseTakeLeaveDetail, 'file_url_list', [])),
      },
    ];
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
    return (
      <CoreContent title="请假信息">
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }

  render = () => {
    const { activeKey } = this.state;
    const { extraWorkOrLeaveId } = this.props;
    // 定义扩展操作
    const ext = (
      <span
        onClick={this.onChangeCollapse}
        className={style['app-comp-expense-detail-order-info-ext']}
      >
        {/* 判断显示文本，如果折叠面板全部展开，则显示 全部收起，否则显示 全部展开 */}
        {activeKey.length !== [extraWorkOrLeaveId].length ? '全部展开' : '全部收起'}
      </span>);

    return (
      <CoreContent key="takeLeve" title="请假单" titleExt={ext}>
        <Collapse bordered={false} activeKey={activeKey} onChange={this.onRequestOrderDetail}>
          {
            [extraWorkOrLeaveId].map((id, index) => {
              const header = `${'请假申请单号:'} ${id}`;
              return (
                <Panel header={header} key={`${index}`}>
                  {/* 渲染请假人信息 */}
                  {this.renderPersonalInfo(id)}

                  {/* 渲染请假信息 */}
                  {this.renderAskLeave(id)}
                </Panel>
              );
            })
          }
        </Collapse>
      </CoreContent>
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

export default connect(mapStateToProps)(TakeLeaveSingle);

