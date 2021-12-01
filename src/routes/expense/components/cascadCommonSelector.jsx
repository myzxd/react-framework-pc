/**
 * 项目（平台）- 城市 - 团队（商圈）级联选择表单组件
 */
import dot from 'dot-prop';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import {
  CommonSelectPlatforms,
  CommonSelectCities,
  CommonSelectDistricts,
} from '../../../components/common';
import { DeprecatedCoreForm } from '../../../components/core';

// 项目选择错误的提示语
const PlatformEmptyErrMsg = '请选择项目';
// 城市选择错误的提示语
const CityEmptyErrMsg = '请选择城市';
// 团队选择错误的提示语
const DistrictEmptyErrMsg = '请选择团队';

class CascadeCommonSelector extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired, // 上层表单
    platform: PropTypes.string, // 项目初始值
    city: PropTypes.string, // 城市初始值
    citySpell: PropTypes.string, // 城市spell
    district: PropTypes.string, // 团队初始值
  }

  static defaultProps = {
    platform: undefined, // 平台
    city: undefined, // 城市
    citySpell: undefined, // 城市全拼
    district: undefined, // 商圈
  }

  constructor(props) {
    super(props);
    const { citySpell } = props;
    this.state = {
      city: citySpell ? [citySpell] : [], // 城市全拼
    };
  }

  // 修改平台选择
  onChangePlatform = () => {
    const { setFields, getFieldsValue, setFieldsValue } = this.props.form;
    const { city } = getFieldsValue();
    // 清空城市和团队
    if (city) {
      setFields({
        city: {
          value: undefined,
          errors: [new Error(CityEmptyErrMsg)],
        },
      });
    }
    setFieldsValue({ district: undefined });
    // 清空团队
    this.props.dispatch({ type: 'applicationCommon/resetDistricts', payload: { namespace: 'overtime' } });
    this.setState({
      city: [],
    });
  }

  // 修改城市选择
  onChangeCity = (e, options) => {
    const { setFieldsValue } = this.props.form;
    if (options && options.props) {
      // 获取city_spelling
      const citySpelling = dot.get(options, 'props.spell');

      this.setState({
        city: [citySpelling],
      });
    } else {
      this.setState({
        city: [],
      });
    }

    setFieldsValue({ district: undefined });

    // 清空团队
    this.props.dispatch({ type: 'applicationCommon/resetDistricts', payload: { namespace: 'overtime' } });
  }

  render() {
    const { platform: initialPlatform, city: initialCity, district: initialDistrict } = this.props;
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const { platform } = getFieldsValue();

    // 上层传入了platform就用上层的，不然用表单当前选择的
    let platforms = [];
    if (platform) {
      platforms = [platform];
    }

    if (initialPlatform) {
      platforms = [initialPlatform];
    }

    const { city } = this.state;
    const formItems = [
      {
        label: '项目',
        form: getFieldDecorator('platform', {
          initialValue: initialPlatform,
          rules: [{ required: true, message: PlatformEmptyErrMsg }],
        })(<CommonSelectPlatforms
          showArrow
          placeholder={PlatformEmptyErrMsg}
          allowClear
          style={{ width: '100%' }}
          onChange={this.onChangePlatform}
        />),
      },
      {
        label: '城市',
        form: getFieldDecorator('city', {
          initialValue: initialCity,
          rules: [{ required: true, message: CityEmptyErrMsg }],
        })(<CommonSelectCities
          showArrow
          allowClear
          placeholder={CityEmptyErrMsg}
          platforms={platforms}
          style={{ width: '100%' }}
          isExpenseModel
          onChange={this.onChangeCity}
        />),
      },
      {
        label: '团队',
        form: getFieldDecorator('district', {
          initialValue: initialDistrict,
          rules: [{ required: true, message: DistrictEmptyErrMsg }],
        })(<CommonSelectDistricts
          showArrow
          allowClear
          filterDisable
          placeholder={DistrictEmptyErrMsg}
          platforms={platforms}
          cities={city}
          isCities
          namespace="overtime"
          style={{ width: '100%' }}
        />),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} cols={3} />
    );
  }
}

export default connect()(CascadeCommonSelector);
