/**
 * 考勤类 - 加班申请 - 创建/编辑
 */
import dot from 'dot-prop';
import is from 'is_js';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import moment from 'moment';
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
import { HourlyCalculationDays } from '../components';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const { TextArea } = Input;

function PageOvertime(props) {
  const [form] = Form.useForm();
  const { dispatch, overtimeDetail, query } = props;
  const flag = query.id;
  useEffect(() => {
    // 判断是否是编辑
    if (query.id) {
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


  // 设置value值
  useEffect(() => {
    const formValues = {
      // 开始时间
      startTime: overtimeDetail.from_at ? moment(overtimeDetail.from_at) : undefined,
      // 结束时间
      endTime: overtimeDetail.end_at ? moment(overtimeDetail.end_at) : undefined,
      // 时长
      hour: dot.get(overtimeDetail, 'hour', 0),
      // 事由及说明
      note: dot.get(overtimeDetail, 'note', undefined),
      // 附件
      fileList: PageUpload.getInitialValue(overtimeDetail, 'asset_infos'),
    };
    form.setFieldsValue(formValues);
  }, [overtimeDetail, form]);

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
      dispatch({ type: 'attendance/createOvertime', payload });
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

    // 计算加班时长
  const onChangeOverTime = (startTime, endTime) => {
    const { setFieldsValue } = form;
    if (is.empty(startTime) || is.not.existy(startTime) ||
        is.empty(endTime) || is.not.existy(endTime)) {
      setFieldsValue({ hour: 0 });
    } else {
      const diff = endTime.diff(startTime, 'minutes') / 60;
      const hour = diff % 1 === 0 ? diff : diff.toFixed(1);
      setFieldsValue({ hour });
    }
  };

  // 开始时间和结束公用的方法
  const onChangeTime = (e) => {
    if (is.empty(e) || is.not.existy(e)) {
      return undefined;
    }
    const minutes = moment(e).minutes();
    if (minutes < 30) {
      return moment(moment(e).format('YYYY-MM-DD HH:00'));
    }
    if (minutes > 30) {
      return moment(moment(e).format('YYYY-MM-DD HH:30'));
    }
    return moment(e);
  };

  // 开始时间改变
  const onChangeTimeRange = (e) => {
    const { setFieldsValue, getFieldValue } = form;
    setFieldsValue({ endTime: null });
    const endTime = getFieldValue('endTime');
    onChangeOverTime(e, endTime);
    return onChangeTime(e);
  };

    // 结束时间改变
  const onChangeEndTimeRange = (e) => {
    const { getFieldValue } = form;
    const startTime = getFieldValue('startTime');
      // 判断结束是否是否清空
    if (is.empty(e) || is.not.existy(e)) {
      onChangeOverTime(startTime, undefined);
      return undefined;
    }
      // 判断结束时间比开始时间小
    if (e < startTime) {
      onChangeOverTime(startTime, moment(startTime));
      return moment(startTime);
    }
    onChangeOverTime(startTime, onChangeTime(e));
    return onChangeTime(e);
  };

  // 检验时长
  const asyncValidatorHour = (rule, value, callback) => {
    if (!value) {
      callback('时长不能为0');
      return;
    }
    callback();
  };

  // 加班时间只允许选正点和半点
  const disabledRangeTime = () => {
    return {
      disabledMinutes: () => [...Array(60).keys()].filter(v => v !== 0 && v !== 30),
    };
  };
    // 加班时间只允许选正点和半点
  const disabledEndRangeTime = (endData) => {
    const { getFieldValue } = form;
    const startTime = getFieldValue('startTime');
    const startvalue = moment(moment(startTime).format('YYYY-MM-DD')).valueOf();
    const endvalue = moment(moment(endData).format('YYYY-MM-DD')).valueOf();
    const minutes = moment(startTime).minutes();
      // 判断开始时间是否为空
    if (is.empty(startTime) || is.not.existy(startTime) || endvalue > startvalue) {
      return {
        disabledMinutes: () => [...Array(60).keys()].filter(v => v !== 0 && v !== 30),
      };
    }
    const startTimeHours = moment(startTime).hours();
    const endTimeHours = moment(endData).hours();
    return {
      disabledHours: () => [...Array(24).keys()].filter(v => v < startTimeHours),
      disabledMinutes: () => [...Array(60).keys()].filter((v) => {
        return (v !== 0 && v !== 30) || endTimeHours > startTimeHours ? v !== 0 && v !== 30 : v < minutes;
      }),
    };
  };
    // 结束日期禁用
  const disabledEndDate = (endValue) => {
    const { getFieldValue } = form;
    const startValue = getFieldValue('startTime');
    if (!endValue || !startValue) {
      return false;
    }
    const start = moment(moment(startValue).format('YYYY-MM-DD')).valueOf();
    const end = moment(moment(endValue).format('YYYY-MM-DD')).valueOf();
    return end < start;
  };

  // 基础信息
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
      <CoreContent title="基础信息">
        <PageBaseInfo isDetail={flag} detail={overtimeDetail} />
        <CoreForm items={formItems} cols={4} />
      </CoreContent>
    );
  };

  // 加班信息
  const renderAbnormalInformation = () => {
    const formItems = [
      <Form.Item
        {...layout}
        label="开始时间"
        name="startTime"
        rules={[{ required: true, message: '请选择开始时间' }]}
        getValueFromEvent={onChangeTimeRange}
      >
        <DatePicker
          disabledTime={disabledRangeTime}
          showTime={{
            hideDisabledOptions: true,
            format: 'HH:mm',
            defaultValue: moment(`${moment().hours()}:00`, 'HH:mm'),
          }}
          showNow
          format="YYYY-MM-DD HH:mm"
        />
      </Form.Item>,
      <Form.Item
        {...layout}
        label="结束时间"
        name="endTime"
        rules={[{ required: true, message: '请选择结束时间' }]}
        getValueFromEvent={onChangeEndTimeRange}
      >
        <DatePicker
          disabledTime={disabledEndRangeTime}
          disabledDate={disabledEndDate}
          showTime={{
            hideDisabledOptions: true,
            format: 'HH:mm',
            defaultValue: moment(`${moment().hours()}:00`, 'HH:mm'),
          }}
          showNow
          format="YYYY-MM-DD HH:mm"
        />
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="加班时长"
            name="hour"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            rules={[{ required: true, validator: asyncValidatorHour }]}
          >
            <HourlyCalculationDays isDetail />
          </Form.Item>
        ),
      },
      <Form.Item
        {...layout}
        label="事由及说明"
        name="note"
        rules={[{ required: true, message: '请填写事由及说明' }]}
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
      <CoreContent title="加班信息">
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
      {/* 基础信息 */}
      {renderBasisInfo()}

      {/* 加班信息 */}
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

function mapStateToProps({ attendance: { overtimeDetail } }) {
  return { overtimeDetail };
}
export default connect(mapStateToProps)(PageOvertime);
