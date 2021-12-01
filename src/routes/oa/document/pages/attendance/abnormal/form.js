/**
 * 考勤类 - 考勤异常 - 创建/编辑
 */
import dot from 'dot-prop';
import is from 'is_js';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import moment from 'moment';
import { Input, Radio, DatePicker, TimePicker, Form } from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { OaAttendanceAbnormalState } from '../../../../../../application/define';

import {
  PageFormButtons,
  PageBaseInfo,
  PageUpload,
  FixedCopyGiveDisplay,
  PageComponentThemeTag,
} from '../../../components/index';

const { TextArea } = Input;

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

function PageAbnormal(props) {
  const { dispatch, abnormalDetail, query } = props;
  const [form] = Form.useForm();
  const flag = query.id;
  useEffect(() => {
    // 判断是否是编辑
    if (query.id) {
      dispatch({
        type: 'attendance/fetchAbnormalDetail',
        payload: {
          id: query.id,
        },
      });
    }

    // 清空页面详情数据（componentWillUnmount）
    return () => {
      dispatch({ type: 'attendance/resetAbnormalDetail' });
    };
  }, [dispatch, query.id]);

  // 设置value值
  useEffect(() => {
    const formValues = {
      // 异常类型
      exceptionType: dot.get(abnormalDetail, 'exception_type', OaAttendanceAbnormalState.forget),
      // 考勤异常日期
      exceptionDate: abnormalDetail.exception_date ? moment(`${abnormalDetail.exception_date}`) : undefined,
      // 开始时间
      fromTime: abnormalDetail.from_period ? moment(abnormalDetail.from_period, 'HH:mm') : undefined,
      // 结束时间
      endTime: abnormalDetail.end_period ? moment(abnormalDetail.end_period, 'HH:mm') : undefined,
      // 事由及说明
      note: dot.get(abnormalDetail, 'note', undefined),
      // 附件
      fileList: PageUpload.getInitialValue(abnormalDetail, 'asset_infos'),
    };
    form.setFieldsValue(formValues);
  }, [abnormalDetail, form]);

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
      dispatch({ type: 'attendance/createAbnormal', payload });
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

  // 开始时间和结束公用的方法
  const onChangeTime = (e) => {
    if (is.empty(e) || is.not.existy(e)) {
      return undefined;
    }
    const minutes = moment(e).minutes();
    // 判断分钟是否大于或小于
    if (minutes < 30) {
      return moment(moment(e).format('YYYY-MM-DD HH:00'));
    }
    if (minutes > 30) {
      return moment(moment(e).format('YYYY-MM-DD HH:30'));
    }
    return moment(e);
  };

  // 开始时间
  const onChangeFromIime = (current) => {
    const { setFieldsValue } = form;
    setFieldsValue({ endTime: null });
    return onChangeTime(current);
  };

  // 结束时间改变
  const onChangeEndIime = (e) => {
    const { getFieldValue } = form;
    const startTime = getFieldValue('fromTime');
    if (is.empty(e) || is.not.existy(e)) {
      return undefined;
    }
    if (e < startTime) {
      return moment(startTime);
    }
    return onChangeTime(e);
  };

  // 禁用异常日期
  const disabledexceptionDate = (current) => {
    return current && current > moment();
  };

  // 限制开始时间分钟
  const disabledForTimeMinutes = () => {
    return [...Array(60).keys()].filter(v => (v !== 0 && v !== 30));
  };

  // 限制结束时间小时
  const disabledEndTimeHours = () => {
    const { getFieldValue } = form;
    const startTime = getFieldValue('fromTime');
    // 判断开始时间是否为空
    if (is.empty(startTime) || is.not.existy(startTime)) {
      return undefined;
    }
    const startTimeHours = moment(startTime).hours();
    return [...Array(24).keys()].filter(v => v < startTimeHours);
  };

  // 限制结束时间分钟
  const disabledEndTimeMinutes = (endTimeHours) => {
    const { getFieldValue } = form;
    const startTime = getFieldValue('fromTime');
    // 判断开始时间是否为空
    if (is.empty(startTime) || is.not.existy(startTime)) {
      return [...Array(60).keys()].filter(v => (v !== 0 && v !== 30));
    }
    const startTimeHours = moment(startTime).hours();
    const minutes = moment(startTime).minutes();
    return [...Array(60).keys()].filter((v) => {
      return (v !== 0 && v !== 30) || (endTimeHours > startTimeHours ? v !== 0 && v !== 30 : v < minutes);
    });
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
        <PageBaseInfo isDetail={flag} detail={abnormalDetail} />
        <CoreForm items={formItems} cols={4} />
      </CoreContent>
    );
  };

  // 异常信息
  const renderAbnormalInformation = () => {
    const formItems = [
      <Form.Item
        {...layout}
        label="异常类型"
        name="exceptionType"
        rules={[{ required: true, message: '请选择异常类型' }]}
      >
        <Radio.Group>
          <Radio value={OaAttendanceAbnormalState.forget}>
            {OaAttendanceAbnormalState.description(OaAttendanceAbnormalState.forget)}
          </Radio>
          <Radio value={OaAttendanceAbnormalState.other}>
            {OaAttendanceAbnormalState.description(OaAttendanceAbnormalState.other)}
          </Radio>
        </Radio.Group>
      </Form.Item>,
      <Form.Item
        {...layout}
        label="考勤异常日期"
        name="exceptionDate"
        rules={[{ required: true, message: '请选择考勤异常日期' }]}
      >
        <DatePicker showToday={false} disabledDate={disabledexceptionDate} />
      </Form.Item>,
      <Form.Item
        {...layout}
        label="开始时间"
        name="fromTime"
        rules={[{ required: true, message: '请选择开始时间' }]}
        getValueFromEvent={onChangeFromIime}
      >
        <TimePicker
          format="HH:mm"
          hideDisabledOptions
          disabledMinutes={disabledForTimeMinutes}
        />
      </Form.Item>,
      <Form.Item
        {...layout}
        label="结束时间"
        name="endTime"
        rules={[{ required: true, message: '请选择结束时间' }]}
        getValueFromEvent={onChangeEndIime}
      >
        <TimePicker
          format="HH:mm"
          hideDisabledOptions
          disabledMinutes={disabledEndTimeMinutes}
          disabledHours={disabledEndTimeHours}
        />
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
      <CoreContent title="异常信息">
        <CoreForm items={formItems} cols={2} />
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

      {/* 异常信息 */}
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

function mapStateToProps({ attendance: { abnormalDetail } }) {
  return { abnormalDetail };
}
export default connect(mapStateToProps)(PageAbnormal);
