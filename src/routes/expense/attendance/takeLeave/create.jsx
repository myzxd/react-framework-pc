/**
 * 费用管理 - 考勤管理 - 请假管理 - 创建请假申请
 */
import is from 'is_js';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Input, DatePicker, Button, InputNumber } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import { CommonSelectCities, CommonSelectDistricts, CommonSelectPlatforms } from '../../../../components/common';
import {
  ExpenseAttendanceTakeLeaveType,
  OaApplicationOrderType,
} from '../../../../application/define';
import { authorize } from '../../../../application';
import {
  isProperPhoneNumber,
} from '../../../../application/utils';
import UploadFile from '../../manage/components/uploadAmazonFile';
import '../style.less';

const { Option } = Select;
const { TextArea } = Input;

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      citySpelling: '',
      flag: true, // 控制是否调取接口
    };
    // 上传文件的随机key
    this.private = {
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    };
  }

  // 默认加载数据
  componentDidMount() {
    const { applicationOrderId } = this.props.location.query; // 审批单id
    // 获取审批单详情数据
    this.props.dispatch({
      type: 'expenseExamineOrder/fetchExamineOrderDetail',
      payload: { id: applicationOrderId },
    });
  }

  // 重置数据
  componentWillUnmount() {
    this.props.dispatch({
      type: 'expenseExamineOrder/reduceExamineOrderDetail',
      payload: {},
    });
  }

  // 开始时间日期的限制
  onDisabledDate = (current) => {
    const { getFieldValue } = this.props.form;
    const leaveType = getFieldValue('leaveType');
    const day = moment(current).day();
    // 判断请假类型不是事假和病假不用禁用周末，默认禁用周末
    if (Number(leaveType) === ExpenseAttendanceTakeLeaveType.things ||
      Number(leaveType) === ExpenseAttendanceTakeLeaveType.disease || leaveType === undefined) {
      return current && (day === 6 || day === 0);
    }
  }

  // 点击保存
  onSave = (e) => {
    e.preventDefault();
    this.onSubmit({
      onSuccessCallback: () => this.setState({
        flag: false,
      }),
    });
  }

  // 点击下一步
  onNext = (e) => {
    const { flag } = this.state;
    e.preventDefault();
    if (flag) {
      this.onSubmit({
        onSuccessCallback: this.onBack,
      });
    } else {
      this.onBack();
    }
  }

 // 审批单编辑页
  onBack = () => {
    const { history } = this.props;
    const applicationOrderId = this.props.location.query.applicationOrderId; // 审批单id
    history.push(`/Expense/Manage/ExamineOrder/Form?orderId=${applicationOrderId}`);
  }

  // 保存
  onSubmit = (params) => {
    const { applicationOrderId } = this.props.location.query; // 审批单id
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { fileList } = values; // 上传的文件
      const payload = {
        ...values,
        ...params,
        fileList, // 附件列表
        applicationOrderId, // 审批单id
      };
      this.props.dispatch({ type: 'expenseTakeLeave/createExpenseTakeLeave', payload });
    });
  }

  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const list = this.state.fileList;
    list.push(e);
    this.setState({
      fileList: list,
    });
  }

  // 删除文件
  onDeleteFile = (index) => {
    const { fileList } = this.state;
    fileList.splice(index, 1);
    this.setState({
      fileList,
    });
  }
  // 自定义校验手机号
  onValidatorPhone = (rule, value, callback) => {
    if (is.existy(value) && is.not.empty(value)) {
      if (!isProperPhoneNumber(value)) {
        callback('请输入正确的手机号码');
        return;
      }
    }
    callback();
  }

  // 项目
  onChangePlatforms = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ cities: undefined, districts: undefined });
    // 清除团队的数据
    this.props.dispatch({ type: 'applicationCommon/resetDistricts', payload: { namespace: 'districts' } });
    this.setState({ citySpelling: [] });
  }
  // 城市
  onChangeCity = (e, options) => {
    const { setFieldsValue } = this.props.form;
    if (options && options.props) {
      this.setState({ citySpelling: options.props.spell });
    } else {
      this.setState({ citySpelling: [] });
    }
    setFieldsValue({ districts: undefined, cities: undefined });
    // 清除团队的数据
    this.props.dispatch({ type: 'applicationCommon/resetDistricts', payload: { namespace: 'districts' } });
  }

  // 开始时间改变
  onChangeTimeRange = (e) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ endTime: null });
    return this.onChangeTime(e);
  }

  // 开始时间和结束公用的方法
  onChangeTime = (e) => {
    if (is.empty(e) || is.not.existy(e)) {
      return undefined;
    }
    const minutes = moment(e).minutes();
    const hours = moment(e).hours();
    // 判断小时是否大于或小于
    if (hours > 19) {
      return moment(moment(e).format('YYYY-MM-DD 19:30'));
    }
    if (hours < 9) {
      return moment(moment(e).format('YYYY-MM-DD 9:00'));
    }
    // 判断分钟是否大于或小于
    if (minutes < 30) {
      return moment(moment(e).format('YYYY-MM-DD HH:00'));
    }
    if (minutes > 30) {
      return moment(moment(e).format('YYYY-MM-DD HH:30'));
    }
    return moment(e);
  }

  // 结束时间改变
  onChangeEndTimeRange = (e) => {
    const { getFieldValue } = this.props.form;
    const startTime = getFieldValue('startTime');
    if (is.empty(e) || is.not.existy(e)) {
      return undefined;
    }
    if (e < startTime) {
      return moment(startTime);
    }
    return this.onChangeTime(e);
  }

  // 请假时间只允许选正点和半点
  disabledRangeTime = () => {
    return {
      disabledHours: () => [...Array(24).keys()].filter(v => v < 9 || v > 19),
      disabledMinutes: () => [...Array(60).keys()].filter(v => v !== 0 && v !== 30),
    };
  }

  // 请假时间只允许选正点和半点
  disabledEndRangeTime = (endData) => {
    const { getFieldValue } = this.props.form;
    const startTime = getFieldValue('startTime');
    const startvalue = moment(moment(startTime).format('YYYY-MM-DD')).valueOf();
    const endvalue = moment(moment(endData).format('YYYY-MM-DD')).valueOf();
    // 判断开始时间是否为空
    if (is.empty(startTime) || is.not.existy(startTime) || endvalue > startvalue) {
      return {
        disabledHours: () => [...Array(24).keys()].filter(v => v < 9 || v > 19),
        disabledMinutes: () => [...Array(60).keys()].filter(v => v !== 0 && v !== 30),
      };
    }
    const startTimeHours = moment(startTime).hours();
    return {
      disabledHours: () => [...Array(24).keys()].filter(v => v < startTimeHours || v > 19),
      disabledMinutes: () => [...Array(60).keys()].filter(v => v !== 0 && v !== 30),
    };
  }
  // 结束日期禁用
  disabledEndDate = (endValue) => {
    const { getFieldValue } = this.props.form;
    const startValue = getFieldValue('startTime');
    if (!endValue || !startValue) {
      return false;
    }

    const start = moment(moment(startValue).format('YYYY-MM-DD')).valueOf();
    const end = moment(moment(endValue).format('YYYY-MM-DD')).valueOf();
    return end < start;
  };

  //   基本信息
  renderTitle = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      applyAccountInfo: { name: name = '' } = {},
      applicationOrderType: applicationOrderType = '',
      flowInfo: { name: flowName = '' } = {},
    } = this.props.examineOrderDetail;
    const formItems = [
      {
        label: '申请人',
        form: name || '--',
      },
      {
        label: '审批类型',
        form: OaApplicationOrderType.description(applicationOrderType),
      },
      {
        label: '审批流程',
        form: flowName || '--',
      },
      {
        label: '请假类型',
        form: getFieldDecorator('leaveType', {
          initialValue: undefined,
          rules: [{ required: true, message: '请选择请假类型' }],
        })(
          <Select placeholder="请选择请假类型">
            <Option value={ExpenseAttendanceTakeLeaveType.things}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.things)}</Option>
            <Option value={ExpenseAttendanceTakeLeaveType.disease}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.disease)}</Option>
            <Option value={ExpenseAttendanceTakeLeaveType.years}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.years)}</Option>
            <Option value={ExpenseAttendanceTakeLeaveType.marriage}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.marriage)}</Option>
            <Option value={ExpenseAttendanceTakeLeaveType.maternity}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.maternity)}</Option>
            <Option value={ExpenseAttendanceTakeLeaveType.paternal}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.paternal)}</Option>
            <Option value={ExpenseAttendanceTakeLeaveType.bereavement}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.bereavement)}</Option>
            <Option value={ExpenseAttendanceTakeLeaveType.goOut}>{ExpenseAttendanceTakeLeaveType.description(ExpenseAttendanceTakeLeaveType.goOut)}</Option>
          </Select>,
        ),
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <CoreContent title="基本信息">
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
      </CoreContent>
    );
  }

  // 请假人信息
  renderLeavePeople = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { citySpelling } = this.state;
    const formItems = [
      {
        label: '实际请假人',
        form: getFieldDecorator('leavePeople', {
          initialValue: authorize.account.name,
        })(
          <span>{ authorize.account.name}</span>,
        ),
      },
      {
        label: '联系方式',
        form: getFieldDecorator('phone', {
          initialValue: undefined,
          rules: [{ validator: this.onValidatorPhone }],
        })(
          <Input placeholder="请输入手机号" />,
        ),
      },
      {
        label: '项目',
        form: getFieldDecorator('platforms', {
          initialValue: undefined,
          rules: [{ required: true, message: '请选择项目' }],
        })(
          <CommonSelectPlatforms
            showArrow
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择项目"
            onChange={this.onChangePlatforms}
          />,
        ),
      },
      {
        label: '城市',
        form: getFieldDecorator('cities', {
          initialValue: undefined,
          rules: [{ required: true, message: '请选择城市' }],
        })(
          <CommonSelectCities
            showArrow
            namespace="cities"
            isExpenseModel
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择城市"
            platforms={getFieldValue('platforms') || ''}
            onChange={this.onChangeCity}
          />,
        ),
      },
      {
        label: '团队',
        form: getFieldDecorator('districts', {
          rules: [{ required: true, message: '请选择团队' }],
        })(
          <CommonSelectDistricts
            showArrow
            namespace="districts"
            allowClear
            showSearch
            filterDisable
            optionFilterProp="children"
            placeholder="请选择团队"
            platforms={getFieldValue('platforms') || ''}
            cities={citySpelling}
          />,
        ),
      },
    ];
    const layout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
    return (
      <CoreContent title="请假人信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  //   请假信息
  renderLeave = () => {
    const { getFieldDecorator } = this.props.form;
    const formItems = [
      {
        label: '开始时间',
        form: getFieldDecorator('startTime', {
          rules: [{ required: true, message: '请选择开始时间' }],
          getValueFromEvent: this.onChangeTimeRange,
          initialValue: null,
        })(<DatePicker
          style={{ width: '40%' }}
          disabledTime={this.disabledRangeTime}
          showTime={{
            hideDisabledOptions: true,
            format: 'HH:mm',
            defaultValue: moment(`${moment().hours()}:00`, 'HH:mm'),
          }}
          format="YYYY-MM-DD HH:mm"
        />),
      },
      {
        label: '结束时间',
        form: getFieldDecorator('endTime', {
          rules: [{ required: true, message: '请选择结束时间' }],
          getValueFromEvent: this.onChangeEndTimeRange,
          initialValue: null,
        })(<DatePicker
          style={{ width: '40%' }}
          disabledTime={this.disabledEndRangeTime}
          disabledDate={this.disabledEndDate}
          showTime={{
            hideDisabledOptions: true,
            format: 'HH:mm',
            defaultValue: moment(`${moment().hours()}:00`, 'HH:mm'),
          }}
          format="YYYY-MM-DD HH:mm"
        />),
      },
      {
        label: '时长',
        form: getFieldDecorator('duration', {
          nitialValue: undefined,
          rules: [{ required: true, message: '请输入时长' }],
        })(<InputNumber min={0} placeholder="请输入时长" precision={1} />),
      },
      {
        label: '请假事由',
        form: getFieldDecorator('note', {
          nitialValue: undefined,
          rules: [{ required: true, message: '请选择请假事由' }],
        })(
          <TextArea rows={4} />,
        ),
      },
      {
        label: '工作安排',
        form: getFieldDecorator('work', {
          nitialValue: undefined,
        })(
          <TextArea rows={4} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 10 } };
    return (
      <CoreContent title="请假信息">
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
        <UploadFile domain="cost" form={this.props.form} />
      </CoreContent>
    );
  }

  render() {
    return (
      <Form layout="horizontal">
        {/* 基本信息 */}
        {this.renderTitle()}
        {/* 请假人信息 */}
        {this.renderLeavePeople()}
        {/* 请假信息 */}
        {this.renderLeave()}
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.onSave}>保存</Button>
          <Button type="primary" style={{ marginLeft: 20 }} onClick={this.onNext}>下一步</Button>
        </div>
      </Form>
    );
  }
}

function mapStateToProps({ expenseExamineOrder: { examineOrderDetail } }) {
  return { examineOrderDetail };
}
export default connect(mapStateToProps)(Form.create()(Create));
