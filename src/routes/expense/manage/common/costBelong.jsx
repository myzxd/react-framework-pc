/**
 * 成本归属
 */
import _ from 'lodash';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'dva';
import { CoreSelect } from '../../../../components/core';
import { ExpenseCostCenterType } from '../../../../application/define';
import { system } from '../../../../application';
import { omit } from '../../../../application/utils';

const Option = CoreSelect.Option;

export const CheckPlatforms = ['elem', 'meituan', 'relian', 'zongbu', 'chengtu', 'haluo', 'mobike', 'chengjing', 'lailai'];
export const isPlatform = platform => CheckPlatforms.includes(platform);

class CommonSelectUser extends Component {
  static propTypes = {
    subjectCode: PropTypes.string, // 科目编码
    expenseCostOrder: PropTypes.object,
    namespace: PropTypes.string,
  }

  static defaultValue = {
    subjectCode: '',
    expenseCostOrder: {},
    namespace: 'belong',
  }

  componentDidMount() {
    const {
      subjectCode, // 科目编码
      platform,
      namespace = 'cost',
    } = this.props;

    const params = {
      subjectCode,
      namespace,
      onSuccessCallback: res => this.onSuccessCallback(res, true),
    };

    if (subjectCode && system.isEnableCostBelongModule() && isPlatform(platform)) {
      this.props.dispatch({ type: 'expenseCostOrder/fetchSubjectBelong', payload: { ...params } });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      subjectCode,
      platform,
      namespace = 'cost',
    } = this.props;

    // 判断参数是否变化，如果参数变化，则重新获取数据
    if (!_.isEqual(subjectCode, prevProps.subjectCode) && system.isEnableCostBelongModule() && isPlatform(platform)) {
      this.props.dispatch({
        type: 'expenseCostOrder/fetchSubjectBelong',
        payload: {
          subjectCode,
          namespace,
          onSuccessCallback: this.onSuccessCallback,
        },
      });
    }
  }

  componentWillUnmount = () => {
    // 重置数据
    this.props.dispatch({
      type: 'expenseCostOrder/resetSubjectBelong',
      payload: {},
    });
  }

  onSuccessCallback = (res, isInit) => {
    const { form, onChangeCostAttribution } = this.props;

    onChangeCostAttribution && onChangeCostAttribution(res, isInit);

    const {
      cost_center_type: costCenterType = undefined,
    } = res;

    form.setFieldsValue({ costAttribution: costCenterType });
  }

  render() {
    const {
      expenseCostOrder,
      namespace = 'cost',
    } = this.props;
    const subjectBelong = dot.get(expenseCostOrder, 'subjectBelong', {});

    // if (Object.keys(subjectBelong).length < 1) return null;

    const belong = dot.get(subjectBelong, `${namespace}`, {});

    const data = belong.cost_center_type ? [belong] : [];

    const options = data.map((item) => {
      return (
        <Option
          value={item.cost_center_type}
          key={item.cost_center_type}
        >
          {ExpenseCostCenterType.description(item.cost_center_type)}
        </Option>
      );
    });

    // 默认传递所有上级传入的参数
    const props = { ...this.props };
    const omitedProps = omit([
      'subjectCode',
      'onChangeCostAttribution',
      'dispatch',
      'expenseCostOrder',
    ], props);
    return (
      <CoreSelect {...omitedProps} >
        {options}
      </CoreSelect>
    );
  }
}

function mapStateToProps({ expenseCostOrder }) {
  return { expenseCostOrder };
}

export default connect(mapStateToProps)(CommonSelectUser);
