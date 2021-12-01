/**
 * 考勤类 - 加班申请 - 详情
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import moment from 'moment';
import { Form } from 'antd';

import { PageBaseInfo, PageUpload } from '../../../components/index';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { HourlyCalculationDays } from '../components';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

function PageOvertimeDetail(props) {
  const { dispatch, overtimeDetail, query, oaDetail = {} } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (oaDetail._id) {
      dispatch({
        type: 'attendance/fetchOvertimeDetail',
        payload: {
          isPluginOrder: true,
          oaDetail,
        },
      });
    } else {
      dispatch({
        type: 'attendance/fetchOvertimeDetail',
        payload: {
          id: query.id,
        },
      });
    }
    // 清空页面详情数据（componentWillUnmount）
    return () => {
      dispatch({ type: 'attendance/resetOvertimeDetail' });
    };
  }, [dispatch, query.id]);

  // 基础信息
  const renderBasisInfo = () => {
    return (
      <CoreContent title="基础信息">
        <PageBaseInfo isDetail detail={overtimeDetail} />
      </CoreContent>
    );
  };

  // 加班信息
  const renderAbnormalInformation = () => {
    // 开始时间
    const startTimeAt = overtimeDetail.from_at ? moment(overtimeDetail.from_at).format('YYYY-MM-DD HH:mm') : undefined;
    // 结束时间
    const endTimeAt = overtimeDetail.end_at ? moment(overtimeDetail.end_at).format('YYYY-MM-DD HH:mm') : undefined;
    const formItems = [
      <Form.Item
        {...layout}
        label="开始时间"
      >
        {dot.get(startTimeAt, '--')}
      </Form.Item>,
      <Form.Item
        {...layout}
        label="结束时间"
      >
        {dot.get(endTimeAt, '--')}
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            label="加班时长"
          >
            <HourlyCalculationDays
              isDetail
              value={dot.get(overtimeDetail, 'hour', 0)}
            />
          </Form.Item>
        ),
      },
      <Form.Item
        {...layout}
        label="事由及说明"
      >
        {dot.get(overtimeDetail, 'note', '--')}
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="附件"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
          >
            <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} displayMode value={PageUpload.getInitialValue(overtimeDetail, 'asset_infos')} />
          </Form.Item>
        ),
      },
    ];

    return (
      <CoreContent title="加班信息">
        <CoreForm items={formItems} cols={2} layout={layout} />
      </CoreContent>
    );
  };
  return (
    <Form form={form}>
      {/* 基础信息 */}
      {renderBasisInfo()}

      {/* 加班信息 */}
      {renderAbnormalInformation()}
    </Form>
  );
}

function mapStateToProps({ attendance: { overtimeDetail } }) {
  return { overtimeDetail };
}
export default connect(mapStateToProps)(PageOvertimeDetail);
