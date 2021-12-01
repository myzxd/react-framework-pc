/**
 * 自定义DatePicker
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DatePicker } from 'antd';
import style from './style.css';

class DateRange extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func, // onChange
    format: PropTypes.string, // 时间格式
    disabledStart: PropTypes.bool, // 开始时间是否禁用
    disabledEnd: PropTypes.bool, // 开始时间是否禁用
    placeholderStart: PropTypes.string, // 开始时间placeholder
    placeholderEnd: PropTypes.string, // 结束时间placeholder
    showTodayStart: PropTypes.bool, // 开始时间是否显示今天
    showTodayEnd: PropTypes.bool, // 结束时间是否显示今天
    disabledStartDate: PropTypes.func, // 开始时间限制
    disabledEndDate: PropTypes.func, // 开始时间限制
  }

  static defaultProps = {
    onChange: () => {},
    format: 'YYYY-MM-DD',
    disabledStart: false,
    disabledEnd: false,
    placeholderStart: '开始时间',
    placeholderEnd: '结束时间',
    showTodayStart: false,
    showTodayEnd: false,
    disabledStartDate: () => {},
    disabledEndDate: () => {},
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      startValue: value.startValue,
      endValue: value.endValue,
      endOpen: false,
    };
  }

  // 修改开始时间
  onStartChange = (value) => {
    const { onChange } = this.props;
    // 结束时间
    const { endValue } = this.state;

    if (!('value' in this.props)) {
      this.setState({
        startValue: value,
      });
    }

    onChange && onChange({ startValue: value, endValue });
  };

  // 修改结束时间
  onEndChange = (value) => {
    const { onChange } = this.props;
    // 开始时间
    const { startValue } = this.state;

    if (!('value' in this.props)) {
      this.setState({
        endValue: value,
      });
    }

    onChange && onChange({ startValue, endValue: value });
  };

  // 开始时间限制
  disabledStartDate = (val) => {
    const { disabledStartDate } = this.props;
    disabledStartDate && disabledStartDate(val);
  };

  // 结束时间限制
  disabledEndDate = (val) => {
    const { disabledEndDate } = this.props;
    return disabledEndDate && disabledEndDate(val);
  };

  // 弹层状态
  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  // 弹层状态
  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };

  // 渲染内容
  renderContent = () => {
    const {
      startValue, // 开始时间
      endValue, // 结束时间
      endOpen, // 弹层是否展开
    } = this.state;

    const {
      format,
      disabledStart,
      disabledEnd,
      placeholderStart,
      placeholderEnd,
      showTodayStart,
      showTodayEnd,
    } = this.props;

    return (
      <div>
        <DatePicker
          disabledDate={this.disabledStartDate}
          format={format}
          value={startValue}
          placeholder={placeholderStart}
          disabled={disabledStart}
          showToday={showTodayStart}
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <span
          className={style['app-comp-customize-datePicker']}
        >
        ~
        </span>
        <DatePicker
          disabledDate={this.disabledEndDate}
          format={format}
          value={endValue}
          disabled={disabledEnd}
          placeholder={placeholderEnd}
          onChange={this.onEndChange}
          showToday={showTodayEnd}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </div>
    );
  }

  render() {
    return this.renderContent();
  }
}


export default DateRange;
