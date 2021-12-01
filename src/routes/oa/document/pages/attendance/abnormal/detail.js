/**
 * 考勤类 - 考勤异常 - 详情
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Form } from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageBaseInfo, PageUpload } from '../../../components/index';
import { OaAttendanceAbnormalState } from '../../../../../../application/define';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

function PageAbnormalDetail(props) {
  const [form] = Form.useForm();
  const { dispatch, abnormalDetail, query, oaDetail = {} } = props;
  useEffect(() => {
    if (oaDetail._id) {
      dispatch({
        type: 'attendance/fetchAbnormalDetail',
        payload: {
          isPluginOrder: true,
          oaDetail,
        } });
    } else {
      dispatch({
        type: 'attendance/fetchAbnormalDetail',
        payload: {
          id: query.id,
        } });
    }
    // 清空页面详情数据（componentWillUnmount）
    return () => {
      dispatch({ type: 'attendance/resetAbnormalDetail' });
    };
  }, [dispatch, query.id, oaDetail]);

  // 基本信息
  const renderBasisInfo = () => {
    return (
      <CoreContent title="基本信息">
        <PageBaseInfo isDetail detail={abnormalDetail} />
      </CoreContent>
    );
  };

  // 异常信息
  const renderAbnormalInformation = () => {
    const exceptionDate = abnormalDetail.exception_date ? moment(`${abnormalDetail.exception_date}`).format('YYYY-MM-DD') : undefined;
    const formItems = [
      <Form.Item {...layout} label="异常类型">
        {OaAttendanceAbnormalState.description(dot.get(abnormalDetail, 'exception_type', '--'))}
      </Form.Item>,
      <Form.Item {...layout} label="考勤异常日期">
        {dot.get(exceptionDate, '--')}
      </Form.Item>,
      <Form.Item {...layout} label="开始时间">
        <div>
          {dot.get(abnormalDetail, 'from_period', '--')}
        </div>
      </Form.Item>,
      <Form.Item {...layout} label="结束时间">
        <div>
          {dot.get(abnormalDetail, 'end_period', '--')}
        </div>
      </Form.Item>,
      <Form.Item {...layout} label="事由及说明">
        {dot.get(abnormalDetail, 'note', '--')}
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="附件"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
          >
            <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} displayMode value={PageUpload.getInitialValue(abnormalDetail, 'asset_infos')} />
          </Form.Item>
        ),
      },
    ];

    return (
      <CoreContent title="异常信息">
        <CoreForm items={formItems} cols={2} />
      </CoreContent>
    );
  };

  return (
    <Form form={form}>
      {/* 基本信息 */}
      {renderBasisInfo()}

      {/* 异常信息 */}
      {renderAbnormalInformation()}
    </Form>
  );
}

function mapStateToProps({ attendance: { abnormalDetail } }) {
  return { abnormalDetail };
}
export default connect(mapStateToProps)(PageAbnormalDetail);
