/**
* 组织架构 - 部门管理 - 数据权限范围Tab - 编辑业务信息 - 城市select
*/
import _ from 'lodash';
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';

import { omit } from '../../../../application/utils';
import { CoreSelect } from '../../../../components/core';
import style from './index.less';

const Option = CoreSelect.Option;

class City extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'organizationBusiness/getCityList', payload: {} });
  }

  onChange = (val) => {
    const { onChange } = this.props;
    onChange && onChange(val);
  }

  render() {
    const { cityList = [], value, mode = undefined } = this.props;

    // 按照city_code去重
    const uniqData = _.uniqWith(cityList, (a, b) => (a.city_code === b.city_code));
    // 去除Antd Select不需要的props
    const omitedProps = omit([
      'dispatch',
      'value',
      'cityList',
    ], this.props);
    return (
      <CoreSelect
        allowClear
        mode={mode}
        placeholder="请选择城市"
        onChange={this.onChange}
        value={Array.isArray(value) ? [...new Set(value)] : value}
        {...omitedProps}
        className={style['app-organization-update-select']}
      >
        {
          uniqData.map((city) => {
            return <Option key={city.city_code} value={city.city_code}>{city.city_name}</Option>;
          })
        }
      </CoreSelect>
    );
  }
}

City.propTypes = {
  cityList: PropTypes.array,
  dispatch: PropTypes.func,
  onChange: PropTypes.func,
};

City.defaultProps = {
  cityList: [],
  dispatch: () => { },
  onChange: () => { },
};

function mapStateToProps({
  organizationBusiness: {
    cityList, // 门下岗位编制列表
  },
}) {
  return { cityList };
}

export default connect(mapStateToProps)(City);
