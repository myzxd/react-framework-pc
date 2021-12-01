/**
 * 考勤类 - 请假申请 - 创建/编辑
 */
import dot from 'dot-prop';
import is from 'is_js';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import moment from 'moment';
import { Input, DatePicker, Select, Form, message } from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { OAAttendanceTakeLeaveType, OALeaveDayType } from '../../../../../../application/define';
import { HourlyCalculationDays } from '../components';
import {
  PageFormButtons,
  PageBaseInfo,
  PageUpload,
  FixedCopyGiveDisplay,
  PageComponentThemeTag,
} from '../../../components/index';
import { calculationLeaveTime } from '../../../../../../application/utils';

const { TextArea } = Input;
const { Option } = Select;
const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

function PageLeave(props) {
  const [form] = Form.useForm();
  const { dispatch, leaveDetail, query } = props;
  const flag = query.id;
  useEffect(() => {
    // 判断是否是编辑
    if (query.id) {
      dispatch({
        type: 'attendance/fetchLeaveDetail',
        payload: {
          id: query.id,
        },
      });
    }
    // 清空页面详情数据（componentWillUnmount）
    return () => {
      // 清除数据
      dispatch({ type: 'attendance/resetLeaveDetail' });
    };
  }, [dispatch, query.id]);


  // 设置value值
  useEffect(() => {
    const formValues = {
      // 请假类型
      leaveType: dot.get(leaveDetail, 'leave_type', undefined),
      // 开始时间
      startTime: leaveDetail.from_at ? moment(leaveDetail.from_at) : undefined,
      // 结束时间
      endTime: leaveDetail.end_at ? moment(leaveDetail.end_at) : undefined,
      // 时长
      hour: dot.get(leaveDetail, 'hour', 0),
      // 工作代理人
      agent: dot.get(leaveDetail, 'agent', undefined),
      // 事由及说明
      note: dot.get(leaveDetail, 'note', undefined),
      // 附件
      fileList: PageUpload.getInitialValue(leaveDetail, 'asset_infos'),
    };
    form.setFieldsValue(formValues);
  }, [leaveDetail, form]);

  // 完成
  const onFinish = (params = {}) => {
    form.validateFields().then((values) => {
      const days = Number(Number(values.hour / 8).toFixed(1));
      const { leaveDayType } = params;
      // 判断请假时长
      if ((Number(leaveDayType) === OALeaveDayType.levelA && !(days <= 5)) ||
        (Number(leaveDayType) === OALeaveDayType.levelB && !(days > 5 && days <= 10)) ||
      (Number(leaveDayType) === OALeaveDayType.levelC && !(days > 10))) {
        return message.error('请假时长有误，请重新选择');
      }
      // 锁定按钮
      if (params.onLockHook) {
        params.onLockHook();
      }
      const payload = {
        ...values, // form数据
        ...params, // 额外的参数
        flag, // 判断是否是编辑
      };
      dispatch({ type: 'attendance/createLeave', payload });
    });
  };

  // 提交单据到服务器
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    const { leave_day_type: leaveDayType, flow_id: flowId } = query;
    onFinish({
      leaveDayType,
      flowId,
      onSuccessCallback: onDoneHook,
      onFailureCallback: onUnlockHook,
      onLockHook,
    });
  };

  // 更新单据到服务器(编辑保存)
  const onUpdate = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    onFinish({
      id: query.id,
      leaveDayType: leaveDetail.leave_day_type,
      onSuccessCallback: onDoneHook,
      onFailureCallback: onUnlockHook,
      onLockHook,
    });
  };

  // 计算请假时长
  const onChangeLeaveTime = (startTime, endTime) => {
    const { setFieldsValue } = form;

    if ((is.existy(startTime) && is.not.empty(startTime)) && (is.existy(endTime) && is.not.empty(endTime))) {
      const startTimeMinues = moment(startTime).format('HHmm');
      const endTimeMinues = moment(endTime).format('HHmm');
      const startMinues = '0900';
      const endMinues = '1800';
      if ((startTimeMinues >= startMinues && startTimeMinues <= endMinues) &&
        (endTimeMinues >= startMinues && endTimeMinues <= endMinues)) {
        const hour = calculationLeaveTime(startTime, endTime);
        setFieldsValue({ hour });
      }
    }
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

  // 开始时间改变
  const onChangeTimeRange = (e) => {
    const { setFieldsValue } = form;
    const startTime = onChangeTime(e);
    setFieldsValue({ endTime: null });
    setFieldsValue({ hour: 0 });
    // 计算请假时长
    onChangeLeaveTime(startTime, undefined);
    return startTime;
  };

  // 结束时间改变
  const onChangeEndTimeRange = (e) => {
    const { getFieldValue } = form;
    const startTime = getFieldValue('startTime');
    // 计算请假时长
    if (is.empty(e) || is.not.existy(e)) {
      onChangeLeaveTime(startTime, undefined);
      return undefined;
    }
    if (e < startTime) {
      onChangeLeaveTime(startTime, moment(startTime));
      return moment(startTime);
    }
    onChangeLeaveTime(startTime, onChangeTime(e));
    return onChangeTime(e);
  };

  // 检验时长
  const asyncValidatorHour = (rule, value, callback) => {
    if (!value) {
      callback('请输入时长，时长不能为0');
      return;
    }
    callback();
  };

  // 请假时间只允许选正点和半点
  const disabledRangeTime = () => {
    return {
      disabledMinutes: () => [...Array(60).keys()].filter(v => (v !== 0 && v !== 30)),
    };
  };

  // 加班时间只允许选正点和半点
  const disabledEndRangeTime = (endData) => {
    const { getFieldValue } = form;
    const startTime = getFieldValue('startTime');
    const startvalue = moment(moment(startTime).format('YYYY-MM-DD')).valueOf();
    const endvalue = moment(moment(endData).format('YYYY-MM-DD')).valueOf();
    const minutes = moment(startTime).minutes();
    const startTimeHours = moment(startTime).hours();
    const endTimeHours = moment(endData).hours();
      // 判断开始时间是否为空
    if (is.empty(startTime) || is.not.existy(startTime) || endvalue > startvalue) {
      return {
        disabledMinutes: () => [...Array(60).keys()].filter(v => (v !== 0 && v !== 30)),
      };
    }
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
    const { departmentInformation } = props;
    const entryDate = departmentInformation.entry_date ? moment(`${departmentInformation.entry_date}`).format('YYYY-MM-DD') : undefined;
    const employeeInfo = dot.get(leaveDetail, 'employee_info', {});
    const detailEntryDate = employeeInfo.entry_date ? moment(`${employeeInfo.entry_date}`).format('YYYY-MM-DD') : undefined;
    const formItems = [

      <Form.Item
        {...layout}
        label="入职日期"
      >
        {(flag ? detailEntryDate : entryDate) || '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        label="请假类型"
        name="leaveType"
        rules={[{ required: true, message: '请选择请假类型' }]}
      >
        <Select placeholder="请选择请假类型">
          <Option value={OAAttendanceTakeLeaveType.years}>{OAAttendanceTakeLeaveType.description(OAAttendanceTakeLeaveType.years)}</Option>
          <Option value={OAAttendanceTakeLeaveType.marriage}>{OAAttendanceTakeLeaveType.description(OAAttendanceTakeLeaveType.marriage)}</Option>
          <Option value={OAAttendanceTakeLeaveType.disease}>{OAAttendanceTakeLeaveType.description(OAAttendanceTakeLeaveType.disease)}</Option>
          <Option value={OAAttendanceTakeLeaveType.things}>{OAAttendanceTakeLeaveType.description(OAAttendanceTakeLeaveType.things)}</Option>
          <Option value={OAAttendanceTakeLeaveType.maternity}>{OAAttendanceTakeLeaveType.description(OAAttendanceTakeLeaveType.maternity)}</Option>
          <Option value={OAAttendanceTakeLeaveType.paternal}>{OAAttendanceTakeLeaveType.description(OAAttendanceTakeLeaveType.paternal)}</Option>
          <Option value={OAAttendanceTakeLeaveType.bereavement}>{OAAttendanceTakeLeaveType.description(OAAttendanceTakeLeaveType.bereavement)}</Option>
          <Option value={OAAttendanceTakeLeaveType.compensatory}>{OAAttendanceTakeLeaveType.description(OAAttendanceTakeLeaveType.compensatory)}</Option>
        </Select>
      </Form.Item>,
    ];
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
        <PageBaseInfo isDetail={flag} detail={leaveDetail} />
        <CoreForm items={formItems} cols={4} />
      </CoreContent>
    );
  };

  // 请假信息
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
      <Form.Item
        {...layout}
        label="请休假时长"
        name="hour"
        rules={[{ required: true, validator: asyncValidatorHour }]}
      >
        <HourlyCalculationDays />
      </Form.Item>,
      <Form.Item
        {...layout}
        label="工作代理人"
        name="agent"
        rules={[{ required: true, message: '请填写工作代理人' }]}
      >
        <Input placeholder="请填写工作代理人" />
      </Form.Item>,
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
      <CoreContent title="请假信息">
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
      {/* 基础信息 */}
      {renderBasisInfo()}

      {/* 请假信息 */}
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

function mapStateToProps({ attendance: { leaveDetail },
  oaCommon: { departmentInformation } }) {
  return { leaveDetail, departmentInformation };
}
export default connect(mapStateToProps)(PageLeave);
