/**
 * 付款审批 - 有备选项的输入组件
 * 必须绑定getFieldDecorator使用
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import styles from './style.less';

const { TextArea } = Input;

// 备选项的数据格式
const AlternativePropShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

class AlternativedTextBox extends Component {

  static propTypes = {
    // 备选项
    alternatives: PropTypes.arrayOf(AlternativePropShape).isRequired,
  }

  static defaultProps = {
    alternatives: [],
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return { text: nextProps.value || '' };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      text: props.value || '', // 表单值
      isShowAlternatives: false, // 是否显示备选项
    };
    this.inputRef = React.createRef(); // 输入框的ref
    this.alternativeRef = React.createRef(); // 选择框的ref
  }

  // 输入框失去焦点，隐藏可选框
  onInputBlur = () => {
    // HACK: 延迟执行，否则子选项的click无法执行
    // TODO: 比定时器更稳定的方法?
    setTimeout(() => {
      this.hideAlternatives();
    }, 200);
  }

  // 输入框获得焦点，显示可选框
  onInputFocus = () => {
    if (this.state.text) return;
    this.setState({ isShowAlternatives: true });
  }

  // 点击选项
  onClickOption = (text) => {
    this.triggerChange(text);
    this.inputRef.current.focus();
  }

  // 输入框输入
  onChangeInputValue = (e) => {
    const { value } = e.target;
    const { isShowAlternatives } = this.state;
    // 如果输入框有内容且选择框显示，那么隐藏选择框
    if (value && isShowAlternatives) {
      this.setState({ isShowAlternatives: false });
    }
    // 如果输入框没内容且选择框隐藏，那么显示选择框
    if (!value && !isShowAlternatives) {
      this.setState({ isShowAlternatives: true });
    }
    // 触发输入框内容变化
    this.triggerChange(value);
  }

  // 改变输入框内容
  triggerChange = (text) => {
    const { onChange } = this.props;
    // 如果上层组件未传入value，在本地state保存该值
    if (!('value' in this.props)) {
      this.setState({ text });
    }

    // 如果上层传入了onChange，调用onChange
    if (onChange) {
      onChange(text);
    }
  }

  // 隐藏选择框
  hideAlternatives = () => {
    this.alternativeRef.current.scrollTo(0, 0);
    this.setState({ isShowAlternatives: false });
  }

  render() {
    const { alternatives } = this.props;
    const { text, isShowAlternatives } = this.state;
    const options = alternatives.map(
      ({ key, value }) => (
        <div
          key={key}
          className={styles['app-comp-expense-alternatived-item']}
          onClick={() => this.onClickOption(value)}
        >
          {value}
        </div>
      ),
    );
    return (
      <div className={styles['app-comp-expense-alternatived-text-box']}>
        {/* 渲染输入框 */}
        <TextArea
          {...this.props}
          ref={this.inputRef}
          value={text}
          onChange={this.onChangeInputValue}
          onBlur={this.onInputBlur}
          onFocus={this.onInputFocus}
        />
        {/* 渲染选择框 */}
        <div className={styles['app-comp-expense-alternative-position']}>
          <div
            ref={this.alternativeRef}
            className={`${styles['app-comp-expense-alternative']} ${isShowAlternatives ? '' : styles['app-comp-expense-alternative-hide']}`}
          >
            {options}
          </div>
        </div>
      </div>
    );
  }
}

export default AlternativedTextBox;
