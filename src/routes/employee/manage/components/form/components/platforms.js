/**
 * 城市管理 - 平台
 */
import is from 'is_js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import { Select } from 'antd';
import { connect } from 'dva';

import { omit } from '../../../../../../application/utils';

const { Option } = Select;

class CommonSelectPlatforms extends Component {

  static propTypes = {
    namespace: PropTypes.string,
    industryCodes: PropTypes.string, // 所属场景信息
    cityList: PropTypes.object,    // 平台数据
  }

  static defaultProps = {
    namespace: 'default',
    industryCodes: '',
    cityList: {},
  }

  componentDidMount = () => {
    const { industryCodes, namespace } = this.props;
    // 级联查询
    if (is.existy(industryCodes) && is.not.empty(industryCodes)) {
      this.props.dispatch({ type: 'systemCity/fetchCityList', payload: { industryCodes, namespace } });
    }
  }

  componentDidUpdate = (prevProps) => {
    const { industryCodes, dispatch, namespace } = this.props;
    // 判断如果平台数据不一致，则请求服务器获取所属场景信息
    if (prevProps.industryCodes !== industryCodes) {
      dispatch({ type: 'systemCity/fetchCityList', payload: { industryCodes, namespace } });
    }
  }

  render() {
    const { namespace, cityList } = this.props;
    const dataSource = dot.get(cityList, `${namespace}.data`, []);
    // 选项
    const options = dataSource.map((v) => {
      return (<Option key={v.platform_code} value={`${v.platform_code}`} >{v.name}</Option>);
    });

    // 默认传递所有上级传入的参数
    const omitedProps = omit([
      'dispatch',
      'cityList',
      'namespace',
      'industryCodes',
    ], { ...this.props });

    return (
      <Select {...omitedProps} >
        {options}
      </Select>
    );
  }
}

function mapStateToProps({ systemCity: { cityList } }) {
  return { cityList };
}

export default connect(mapStateToProps)(CommonSelectPlatforms);
