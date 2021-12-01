/**
 * 加班信息编辑组件
 */
import is from 'is_js';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { Select, Input, InputNumber, DatePicker } from 'antd';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import UploadFile from '../../../manage/components/uploadAmazonFile';
import { ExpenseOverTimeThemeTag } from '../../../../../application/define';
import './style.less';

const { TextArea } = Input;
const { Option } = Select;

class OverTimeInfo extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired, // 上层表单
    detail: PropTypes.object, // 加班单详情
  }

  static defaultProps = {
    detail: {},
  }

  constructor(props) {
    super(props);
    const { detail } = props;

    const {
      duration = 0, // 时长
    } = detail;

    this.state = {
      overTime: duration, // 加班时长
    };
  }

  // 更改加班时长
  onChangeOverTime = (startTime, endTime) => {
    if (is.empty(startTime) || is.not.existy(startTime) ||
      is.empty(endTime) || is.not.existy(endTime)) {
      this.setState({
        overTime: 0,
      });
    } else {
      const diff = endTime.diff(startTime, 'minutes') / 60;
      this.setState({
        overTime: diff % 1 === 0 ? diff : diff.toFixed(1),
      });
    }
  }

  // 开始时间改变
  onChangeTimeRange = (e) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    setFieldsValue({ endTime: null });
    const endTime = getFieldValue('endTime');
    // 计算时长
    this.onChangeOverTime(e, endTime);
    return this.onChangeTime(e);
  }

  // 开始时间和结束公用的方法
  onChangeTime = (e) => {
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
  }

  // 结束时间改变
  onChangeEndTimeRange = (e) => {
    const { getFieldValue } = this.props.form;
    const startTime = getFieldValue('startTime');
    // 判断结束是否是否清空
    if (is.empty(e) || is.not.existy(e)) {
      // 计算时长
      this.onChangeOverTime(startTime, undefined);
      return undefined;
    }
    // 判断结束时间比开始时间小
    if (e < startTime) {
      // 计算时长
      this.onChangeOverTime(startTime, moment(startTime));
      return moment(startTime);
    }
    // 计算时长
    this.onChangeOverTime(startTime, this.onChangeTime(e));
    return this.onChangeTime(e);
  }

  // 加班时间只允许选正点和半点
  disabledRangeTime = () => {
    return {
      disabledMinutes: () => [...Array(60).keys()].filter(v => v !== 0 && v !== 30),
    };
  }

  // 加班时间只允许选正点和半点
  disabledEndRangeTime = (endData) => {
    const { getFieldValue } = this.props.form;
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

  // 渲染表单第一部分
  renderPartOne = () => {
    const { getFieldDecorator } = this.props.form;

    const { detail } = this.props; // 加班单详情

    const {
      tags = [], // 主题标签
      working_hours: workingHours, // 标准工时
      info_address: infoAddress = undefined, // 资料地址
    } = detail;

    const layout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    const formItems = [
      {
        label: '主题标签',
        form: getFieldDecorator('themeTag', {
          rules: [{ required: true, message: '请选择主题标签' }],
          initialValue: tags.length > 0 ? tags : undefined,
        })(<Select
          style={{ width: '20%' }}
          placeholder="请选择主题标签"
        >
          <Option key="1" value={ExpenseOverTimeThemeTag.product}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.product)}`}</Option>
          <Option key="2" value={ExpenseOverTimeThemeTag.data}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.data)}`}</Option>
          <Option key="3" value={ExpenseOverTimeThemeTag.mobile}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.mobile)}`}</Option>
          <Option key="4" value={ExpenseOverTimeThemeTag.rearEnd}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.rearEnd)}`}</Option>
          <Option key="5" value={ExpenseOverTimeThemeTag.frontEnd}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.frontEnd)}`}</Option>
          <Option key="6" value={ExpenseOverTimeThemeTag.implement}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.implement)}`}</Option>
          <Option key="7" value={ExpenseOverTimeThemeTag.qualityInspection}>{`${ExpenseOverTimeThemeTag.description(ExpenseOverTimeThemeTag.qualityInspection)}`}</Option>
        </Select>),
      },
      {
        label: '标准工时',
        form: (
          <div>
            {getFieldDecorator('standardWorkHours', {
              rules: [{ required: true, message: '请填写标准工时' }],
              initialValue: workingHours,
            })(<InputNumber
              placeholder="请填写标准工时"
              min={0}
              precision={1}
              style={{ width: '20%', marginRight: '20px' }}
            />)}
            <span>示例：前端 1h</span>
          </div>
        ),
      },
      {
        label: '资料地址',
        form: getFieldDecorator('dataUrl', {
          initialValue: infoAddress,
        })(<Input
          placeholder="请填写资料地址"
          style={{ width: '45%' }}
        />),
      },
    ];
    return <DeprecatedCoreForm cols={1} items={formItems} layout={layout} />;
  }

  // 渲染表单第二部分
  renderPartTwo = () => {
    const { getFieldDecorator } = this.props.form;

    const { detail } = this.props;

    const {
      start_at: startAt = undefined, // 开始时间
      end_at: endAt = undefined, // 结束时间
    } = detail;

    // 开始时间
    const startTimeAt = startAt ? moment(startAt) : undefined;
    // 结束时间
    const endTimeAt = endAt ? moment(endAt) : undefined;

    const layout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    const { overTime } = this.state;
    const formItems = [
      {
        label: '开始时间',
        form: getFieldDecorator('startTime', {
          rules: [{ required: true, message: '请选择开始时间' }],
          getValueFromEvent: this.onChangeTimeRange,
          initialValue: startTimeAt,
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
          initialValue: endTimeAt,
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
        label: '时长（小时）',
        form: overTime,
      },
    ];
    return <DeprecatedCoreForm cols={1} items={formItems} layout={layout} />;
  }

  // 渲染表单第三部分
  renderPartThree = () => {
    const { getFieldDecorator } = this.props.form;

    const { detail } = this.props;

    const {
      reason = undefined, // 加班事由
      file_url_list: fileUrlList = [], // 附件
    } = detail;

    const formItems = [
      {
        label: '加班事由及成果',
        form: getFieldDecorator('note', {
          rules: [{ required: true, message: '请填写加班事由及成果' }],
          initialValue: reason,
        })(<TextArea
          placeholder="请填写加班事由及成果"
          style={{ width: '60%' }}
          autoSize={{ minRows: 3 }}
        />),
      },
    ];
    const layout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    // 附件命列表
    const fileList = fileUrlList.map(item => item.file_name);
    // 附件url列表
    const fileListUrl = fileUrlList.map(item => item.file_url);

    return (
      <React.Fragment>
        <DeprecatedCoreForm cols={1} items={formItems} layout={layout} />
        <UploadFile domain="cost" form={this.props.form} fileList={fileList} fileListUrl={fileListUrl} />
      </React.Fragment>
    );
  }

  render() {
    return (
      <CoreContent title="加班信息">
        {this.renderPartOne()}
        {this.renderPartTwo()}
        {this.renderPartThree()}
      </CoreContent>
    );
  }
}

export default OverTimeInfo;
