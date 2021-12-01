/**
 * 城市管理 - 平台
 */
import is from 'is_js';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import { Select } from 'antd';
import { connect } from 'dva';
import { omit } from '../../../../application/utils';

const { Option } = Select;

const CommonSelectPlatforms = (props) => {
  const {
    industryCodes,
    namespace,
    dispatch,
    cityList = {},
  } = props;
  useEffect(() => {
// 级联查询
    if (is.existy(industryCodes) && is.not.empty(industryCodes)) {
      dispatch({ type: 'systemCity/fetchCityList', payload: { industryCodes, namespace } });
    }
    return () => {
      dispatch({
        type: 'systemCity/reduceCityList',
        payload: {
          namespace,
          result: {},
        },
      });
    };
  }, [industryCodes, namespace]);

    // 获取城市列表
  const dataSource = dot.get(cityList, `${namespace}.data`, []);

    // 选项
  const options = dataSource.map((v) => {
    return (<Option key={v._id} value={`${v._id}`} >{v.name}</Option>);
  });

    // 去除Antd Select不需要的props
  const omitedProps = omit([
    'dispatch',
    'cityList',
    'namespace',
    'industryCodes',
    'enableSelectAll',
  ], props);

  return (
    <Select {...omitedProps} >
      {options}
    </Select>
  );
};

CommonSelectPlatforms.propTypes = {
  namespace: PropTypes.string,
  industryCodes: PropTypes.array, // 所属场景信息
};

CommonSelectPlatforms.defaultProps = {
  allAccounts: [],        // 所有有效账号
  accountsList: {},
};

function mapStateToProps({ systemCity: { cityList = {} } }) {
  return { cityList };
}

export default connect(mapStateToProps)(CommonSelectPlatforms);
