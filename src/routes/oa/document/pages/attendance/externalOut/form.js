/**
 * 考勤类 - 外出申请 - 创建/编辑
 */
import dot from 'dot-prop';
import is from 'is_js';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Input, DatePicker, Form } from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import {
  PageFormButtons,
  PageBaseInfo,
  PageUpload,
  FixedCopyGiveDisplay,
  PageComponentThemeTag,
} from '../../../components/index';

const { TextArea } = Input;

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

function PageExternalOut(props) {
  const [form] = Form.useForm();
  const { dispatch, externalOutDetail, query } = props;
  const flag = query.id;
  useEffect(() => {
    // 判断是否是编辑
    if (query.id) {
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
  }, [dispatch, query.id]);

  // 设置value值
  useEffect(() => {
    const formValues = {
      // 外出时间
      fromTime: externalOutDetail.from_at ? moment(externalOutDetail.from_at) : undefined,
      // 返回时间
      endTime: externalOutDetail.end_at ? moment(externalOutDetail.end_at) : undefined,
      // 外出地点
      address: dot.get(externalOutDetail, 'address', undefined),
      // 同行人员
      partner: dot.get(externalOutDetail, 'partner', undefined),
      // 事由及说明
      note: dot.get(externalOutDetail, 'note', undefined),
      // 附件
      fileList: PageUpload.getInitialValue(externalOutDetail, 'asset_infos'),
    };
    form.setFieldsValue(formValues);
  }, [externalOutDetail, form]);

  // 完成
  const onFinish = (params = {}) => {
    form.validateFields().then((values) => {
      // 锁定按钮
      if (params.onLockHook) {
        params.onLockHook();
      }
      const payload = {
        ...values, // form数据
        ...params, // 额外的参数
        flag, // 判断是否是编辑
      };
      dispatch({ type: 'attendance/createExternalOut', payload });
    });
  };

  // 提交单据到服务器
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    const { flow_id: flowId } = query;
    onFinish({
      flowId,
      onSuccessCallback: onDoneHook,
      onFailureCallback: onUnlockHook,
      onLockHook,
    });
  };

  // 更新单据到服务器(编辑提交)
  const onUpdate = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    // 编辑保存回调
    onFinish({
      id: query.id,
      onSuccessCallback: onDoneHook,
      onFailureCallback: onUnlockHook,
      onLockHook,
    });
  };

    // 外出时间改变
  const onChangeTimeRange = () => {
    const { setFieldsValue } = form;
    setFieldsValue({ endTime: null });
  };

    // 返回时间改变
  const onChangeEndTime = (e) => {
    const { getFieldValue } = form;
    const startTime = getFieldValue('fromTime');
    if (is.empty(e) || is.not.existy(e)) {
      return null;
    }
    if (e < startTime) {
      return moment(startTime).add(1, 'minutes');
    }
    return e;
  };

  // 返回时间禁用日期
  const disabledEndDate = (endValue) => {
    const { getFieldValue } = form;
    const startValue = getFieldValue('fromTime');
    if (!endValue || !startValue) {
      return false;
    }
    const start = moment(moment(startValue).format('YYYY-MM-DD')).valueOf();
    const end = moment(moment(endValue).format('YYYY-MM-DD')).valueOf();
    return end < start;
  };

  // 返回时间禁用时间
  const disabledEndRangeTime = (endData) => {
    const { getFieldValue } = form;
    const startTime = getFieldValue('fromTime');
    const startvalue = moment(moment(startTime).format('YYYY-MM-DD')).valueOf();
    const endvalue = moment(moment(endData).format('YYYY-MM-DD')).valueOf();
    const minutes = moment(startTime).minutes();
      // 判断开始时间是否为空
    if (is.empty(startTime) || is.not.existy(startTime) || endvalue > startvalue) {
      return {
        disabledMinutes: () => 0,
      };
    }
    const startTimeHours = moment(startTime).hours();
    const endTimeHours = moment(endData).hours();
    return {
      disabledHours: () => [...Array(24).keys()].filter(v => v < startTimeHours),
      disabledMinutes: () => [...Array(60).keys()].filter((v) => {
        return 0 || endTimeHours > startTimeHours ? 0 : v <= minutes;
      }),
    };
  };

  // 基本信息
  const renderBasisInfo = () => {
    const formItems = [];
    // 判断是否是创建
    if (!query.id) {
      formItems.push(
        <Form.Item
          {...layout}
          label="主题标签"
          name="themeTag"
        >
          <PageComponentThemeTag placeholder="请填写主题标签" />
        </Form.Item>,
        );
    }
    return (
      <CoreContent title="基本信息">
        <PageBaseInfo isDetail={flag} detail={externalOutDetail} />
        <CoreForm items={formItems} cols={4} />
      </CoreContent>
    );
  };

  // 外出信息
  const renderAbnormalInformation = () => {
    const formItems = [
      <Form.Item
        {...layout}
        label="外出时间"
        name="fromTime"
        rules={[{ required: true, message: '请选择外出时间' }]}
      >
        <DatePicker
          onChange={onChangeTimeRange}
          showTime={{
            hideDisabledOptions: true,
            format: 'HH:mm',
          }}
          format="YYYY-MM-DD HH:mm"
        />
      </Form.Item>,
      <Form.Item
        {...layout}
        label="返回时间"
        name="endTime"
        rules={[{ required: true, message: '请选择返回时间' }]}
        getValueFromEvent={onChangeEndTime}
      >
        <DatePicker
          disabledDate={disabledEndDate}
          disabledTime={disabledEndRangeTime}
          showTime={{
            hideDisabledOptions: true,
            format: 'HH:mm',
            defaultValue: moment(`${moment().hours()}:00`, 'HH:mm'),
          }}
          format="YYYY-MM-DD HH:mm"
        />
      </Form.Item>,
      <Form.Item
        {...layout}
        label="外出地点"
        name="address"
      >
        <Input placeholder="请输入外出地点" />
      </Form.Item>,
      <Form.Item
        {...layout}
        label="同行人员"
        name="partner"
      >
        <Input placeholder="请输入同行人员" />
      </Form.Item>,
      <Form.Item
        {...layout}
        label="事由及说明"
        name="note"
      >
        <TextArea rows={4} placeholder="请输入事由及说明" />
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="上传附件"
            name="fileList"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
          >
            <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
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
  // 抄送人
  const renderCopyGive = () => {
    if (flag) return null;
    const formItems = [
      <Form.Item
        label="抄送人"
        name="copyGive"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <CommonModalCopyGive flowId={query.flow_id} />
      </Form.Item>,
      <Form.Item
        label="固定抄送"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <FixedCopyGiveDisplay flowId={query.flow_id} />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };
  return (
    <Form form={form}>
      {/* 基本信息 */}
      {renderBasisInfo()}

      {/* 外出信息 */}
      {renderAbnormalInformation()}

      {/* 渲染抄送 */}
      {renderCopyGive()}
      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={query}
        showUpdate={flag ? true : false}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
      />
    </Form>
  );
}

function mapStateToProps({ attendance: { externalOutDetail } }) {
  return { externalOutDetail };
}
export default connect(mapStateToProps)(PageExternalOut);
