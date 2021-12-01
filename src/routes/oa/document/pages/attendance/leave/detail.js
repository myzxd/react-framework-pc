/**
 * 考勤类 - 请假申请 - 详情
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import moment from 'moment';
import { Form } from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageBaseInfo, PageUpload } from '../../../components/index';
import { OAAttendanceTakeLeaveType } from '../../../../../../application/define';
import { HourlyCalculationDays } from '../components';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

function PageLeaveDetail(props) {
  const [form] = Form.useForm();
  const { dispatch, leaveDetail, query, oaDetail = {} } = props;
  useEffect(() => {
    if (oaDetail._id) {
      dispatch({
        type: 'attendance/fetchLeaveDetail',
        payload: {
          isPluginOrder: true,
          oaDetail,
        },
      });
    } else {
      dispatch({
        type: 'attendance/fetchLeaveDetail',
        payload: {
          id: query.id,
        },
      });
    }
    // 清空页面详情数据（componentWillUnmount）
    return () => {
      dispatch({ type: 'attendance/resetLeaveDetail' });
    };
  }, [dispatch, query.id, oaDetail]);

  // 基础信息
  const renderBasisInfo = () => {
    const employeeInfo = dot.get(leaveDetail, 'employee_info', {});
    const entryDate = employeeInfo.entry_date ? moment(`${employeeInfo.entry_date}`).format('YYYY-MM-DD') : undefined;
    const formItems = [
      <Form.Item
        {...layout}
        label="入职日期"
      >
        {entryDate || '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        label="请假类型"
      >
        {OAAttendanceTakeLeaveType.description(dot.get(leaveDetail, 'leave_type', '--'))}
      </Form.Item>,
    ];
    return (
      <CoreContent title="基础信息">
        <PageBaseInfo isDetail detail={leaveDetail} />
        <CoreForm items={formItems} cols={4} />
      </CoreContent>
    );
  };

  // 请假信息
  const renderAbnormalInformation = () => {
    // 开始时间
    const startTimeAt = leaveDetail.from_at ? moment(leaveDetail.from_at).format('YYYY-MM-DD HH:mm') : undefined;
    // 结束时间
    const endTimeAt = leaveDetail.end_at ? moment(leaveDetail.end_at).format('YYYY-MM-DD HH:mm') : undefined;
    const formItems = [
      <Form.Item
        {...layout}
        label="开始时间"
      >
        {startTimeAt || '--'}
      </Form.Item>,

      <Form.Item
        {...layout}
        label="结束时间"
      >
        {endTimeAt || '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        label="请休假时长"
      >
        <HourlyCalculationDays
          isDetail
          value={dot.get(leaveDetail, 'hour', 0)}
        />
      </Form.Item>,
      <Form.Item
        {...layout}
        label="工作代理人"
      >
        {dot.get(leaveDetail, 'agent', '--')}
      </Form.Item>,
      <Form.Item
        {...layout}
        label="事由及说明"
      >
        {dot.get(leaveDetail, 'note', '--')}
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="附件"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
          >
            <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} displayMode value={PageUpload.getInitialValue(leaveDetail, 'asset_infos')} />
          </Form.Item>
        ),
      },
    ];

    return (
      <CoreContent title="请假信息">
        <CoreForm items={formItems} cols={2} />
      </CoreContent>
    );
  };
  return (
    <Form form={form}>
      {/* 基础信息 */}
      {renderBasisInfo()}

      {/* 请假信息 */}
      {renderAbnormalInformation()}
    </Form>
  );
}

function mapStateToProps({ attendance: { leaveDetail } }) {
  return { leaveDetail };
}

export default connect(mapStateToProps)(PageLeaveDetail);
