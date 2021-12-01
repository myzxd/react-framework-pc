/**
 * 考勤类 - 外出申请 - 详情
 */
import moment from 'moment';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Form } from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageBaseInfo, PageUpload } from '../../../components/index';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

function PageExternalOutDetail(props) {
  const [form] = Form.useForm();
  const { dispatch, externalOutDetail, query, oaDetail = {} } = props;
  useEffect(() => {
    if (oaDetail._id) {
      dispatch({
        type: 'attendance/fetchExternalOutDetail',
        payload: {
          isPluginOrder: true,
          oaDetail,
        } });
    } else {
      dispatch({
        type: 'attendance/fetchExternalOutDetail',
        payload: {
          id: query.id,
        } });
    }
    // 清空页面详情数据（componentWillUnmount）
    return () => {
      dispatch({ type: 'attendance/resetExternalOutDetail' });
    };
  }, [dispatch, query.id, oaDetail]);

  // 基本信息
  const renderBasisInfo = () => {
    return (
      <CoreContent title="基本信息">
        <PageBaseInfo isDetail detail={externalOutDetail} />
      </CoreContent>
    );
  };

  // 外出信息
  const renderAbnormalInformation = () => {
    // 外出时间
    const startTimeAt = externalOutDetail.from_at ? moment(externalOutDetail.from_at).format('YYYY-MM-DD HH:mm') : undefined;
    // 返回时间
    const endTimeAt = externalOutDetail.end_at ? moment(externalOutDetail.end_at).format('YYYY-MM-DD HH:mm') : undefined;
    const formItems = [
      <Form.Item
        {...layout}
        label="外出时间"
      >
        {startTimeAt}
      </Form.Item>,
      <Form.Item
        {...layout}
        label="返回时间"
      >
        {endTimeAt}
      </Form.Item>,
      <Form.Item
        {...layout}
        label="外出地点"
      >
        {externalOutDetail.address || '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        label="同行人员"
      >
        {externalOutDetail.partner || '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        label="事由及说明"
      >
        {externalOutDetail.note || '--'}
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="附件"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
          >
            <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} displayMode value={PageUpload.getInitialValue(externalOutDetail, 'asset_infos')} />
          </Form.Item>
        ),
      },
    ];

    return (
      <CoreContent title="外出信息">
        <CoreForm items={formItems} cols={2} layout={layout} />
      </CoreContent>
    );
  };

  return (
    <Form form={form}>
      {/* 基本信息 */}
      {renderBasisInfo()}

      {/* 外出信息 */}
      {renderAbnormalInformation()}
    </Form>
  );
}

function mapStateToProps({ attendance: { externalOutDetail } }) {
  return { externalOutDetail };
}
export default connect(mapStateToProps)(PageExternalOutDetail);
