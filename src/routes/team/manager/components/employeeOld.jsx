/**
 * 公用组件，成员列表信息
 */
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'dva';
import { CoreSelect } from '../../../../components/core';

import { SigningState } from '../../../../application/define';
import { omit } from '../../../../application/utils';

const Option = CoreSelect.Option;

class EmployeeSelect extends Component {
  static propTypes = {
    employeesSecond: PropTypes.object,
  };

  static defaultProps = {
    employeesSecond: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      employeesData: dot.get(this.props, 'employeesSecond.data', []),
    };
  }

  componentDidUpdate(prevProps) {
    const { employeesSecond } = this.props;
    if (prevProps.employeesSecond !== employeesSecond) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        employeesData: dot.get(this.props, 'employeesSecond.data', []),
      });
    }
  }


  // 清除劳动者数据可能给其他模块带来的影响
  componentWillUnmount() {
    this.props.dispatch({ type: 'employeeManage/resetEmployees', payload: { fileType: 'second' } });
  }

  // 小写字母转大写
  // eslint-disable-next-line class-methods-use-this
  onReplaceReg(reg, val) {
    if (val) {
      const str = val.toLowerCase();
      return str.replace(reg, (m) => { return m.toUpperCase(); });
    }
    return undefined;
  }

  // 搜索身份证号
  onSearch = (value) => {
    const reg = /^[A-Za-z0-9]{15,18}$/g;

    // 有值才进行查询
    if (value && reg.test(value) === true) {
      // 小写字母转大写
      const identityCardId = this.onReplaceReg(/\w/g, value);
      // console.log(identityCardId);
      this.props.dispatch({
        type: 'employeeManage/fetchEmployees',
        payload: {
          onFailureCallback: () => {
            setTimeout(() => {
              this.setState({
                employeesData: [{ identity_card_id: identityCardId }],
              });
            }, 50);
          },
          identityCardId,
          isAll: true,
          fileType: 'second',
          state: [SigningState.pending, SigningState.normal, SigningState.replace, SigningState.pendingReview, SigningState.repair],
        },
      });
    }
  }

  // 回调函数
  onChange = (e) => {
    if (e) {
      // 小写字母转大写
      const identityCardId = this.onReplaceReg(/\w/g, e);
      const { employeesData } = this.state;
      // 过滤数据，匹配当前选项
      const result = employeesData.filter(item => item.identity_card_id === identityCardId);
      const info = result.length > 0 ? result[0] : {};
      if (this.props.onChange) {
        this.props.onChange(identityCardId, info);
      }
    }

    // 清空数据
    if (e === undefined) {
      this.props.dispatch({ type: 'employeeManage/resetEmployees', payload: { fileType: 'second' } });
      if (this.props.onChange) {
        this.props.onChange(undefined, {});
      }
    }
  }

  render() {
    const { employeesData } = this.state;
    let options;
    if (is.not.empty(employeesData) && is.existy(employeesData)) {
      options = employeesData.map((item) => {
        return <Option value={item.identity_card_id} key={item.identity_card_id}>{item.name ? `${item.name}（${item.identity_card_id}）` : `${item.identity_card_id}`}</Option>;
      });
    }

    // 去除Antd Select不需要的props
    const omitProps = omit([
      'dispatch',
      'employeesSecond',
    ], this.props);
    const style = this.props.style || { width: 260 };
    // 默认传递所有上级传入的参数
    const props = {
      ...omitProps,
      style,
      placeholder: '请输入身份证号搜索',
      showSearch: true,
      defaultActiveFirstOption: false,
      showArrow: false,
      allowClear: true,
      filterOption: false,
      onChange: this.onChange,
      onSearch: this.onSearch,
      notFoundContent: null,
    };
    return (
      <CoreSelect {...props}>
        {options}
      </CoreSelect>
    );
  }
}

const mapStateToProps = ({ employeeManage: { employeesSecond } }) => {
  return { employeesSecond };
};

export default connect(mapStateToProps)(EmployeeSelect);
