/**
 * 费用管理 - 考勤管理 - 请假管理列表页 - 请假详情页 - 请假单信息
 */
import dot from 'dot-prop';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import React, { Component } from 'react';

import { DeprecatedCoreForm, CoreContent, CoreFinder } from '../../../../../components/core';
import { ExpenseAttendanceTakeLeaveType } from '../../../../../application/define';

const { CoreFinderList } = CoreFinder;

const Panel = Collapse.Panel;

class TakeLeaveSingle extends Component {
  static propTypes = {
    expenseTakeLeaveDetail: PropTypes.object, // 请假详情信息
  }

  static defaultProps = {
    expenseTakeLeaveDetail: {}, // 请假详情信息
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 个人信息
  renderPersonalInfo = (record) => {
    const formItems = [
      {
        label: '实际请假人',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'actual_apply_name', '--'),
      }, {
        label: '联系人方式',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'phone', '--'),
      },
    ];

    // 范围信息
    const scopeItem = [
      {
        label: '项目',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'platform_name', undefined) || '--',
      }, {
        label: '城市',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'city_name', undefined) || '--',
      }, {
        label: '团队',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 15 } },
        form: dot.get(record, 'biz_district_name', undefined) || '--',
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
      const data = value.map((item) => {
        return { key: item.file_name, url: item.file_url };
      });
      return (
        <CoreFinderList data={data} enableTakeLatest={false} />
      );
    }
    return '--';
  };

  // 请假信息
  renderAskLeave = (record) => {
    const Reasons = dot.get(record, 'reason', undefined) || '--';
    const Organization = dot.get(record, 'work_placement', undefined) || '--';
    const formItems = [
      {
        label: '请假类型',
        form: dot.get(record, 'leave_type', 0) ? ExpenseAttendanceTakeLeaveType.description(dot.get(record, 'leave_type', 0)) : '--',
      },
      {
        label: '开始时间',
        form: moment(dot.get(record, 'start_at')).format('YYYY.MM.DD HH:mm:ss'),
      }, {
        label: '结束时间',
        form: moment(dot.get(record, 'end_at')).format('YYYY.MM.DD HH:mm:ss'),
      },
      {
        label: '时长 (小时)',
        form: dot.get(record, 'duration', undefined) || '--',
      },
      {
        label: '请假事由',
        form: <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{Reasons || '--'}</div>

        ,
      }, {
        label: '工作安排',
        form: <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{Organization || '--'}</div>,
      }, {
        label: '上传附件',
        form: this.renderCorePreview(dot.get(record, 'file_url_list', [])),
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
    const { expenseTakeLeaveDetail } = this.props;

    // 数据为空，返回null
    if (Object.keys(expenseTakeLeaveDetail).length === 0) return null;

    return (
      <CoreContent title="请假单">
        <Collapse bordered={false} defaultActiveKey={['0']}>
          {
            [expenseTakeLeaveDetail].map((item, index) => {
              const header = `${'请假申请单号:'} ${item._id}`;
              return (
                <Panel header={header} key={index}>
                  {/* 渲染请假人信息 */}
                  {this.renderPersonalInfo(item)}

                  {/* 渲染请假信息 */}
                  {this.renderAskLeave(item)}
                </Panel>
              );
            })
          }
        </Collapse>
      </CoreContent>
    );
  }
}

export default TakeLeaveSingle;
