/**
 * 公司下拉
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import '@ant-design/compatible/assets/index.css';
import { Select } from 'antd';
import { omit } from '../../../../../../application/utils';
import { useNamespace } from '../../../../../../application/utils/hooks';

const { Option } = Select;

function CompanySelect(props) {
  const { dispatch, companySelectInfo, customizeNamespace, otherChild } = props;
  const refNamespace = useNamespace();
  const namespace = customizeNamespace || refNamespace;
  useEffect(() => {
    dispatch({
      type: 'business/fetchBusinessCompanySelect',
      payload: { namespace },
    });
    return () => {
      dispatch({
        type: 'business/resetBusinessCompanySelect',
        payload: { namespace },
      });
    };
  }, [dispatch, namespace]);
  const data = dot.get(companySelectInfo, `${namespace}.data`, []);
  // 获取公司数据
  const options = data.map((company) => {
    return <Option value={company._id} key={company._id}>{company.name}</Option>;
  });
  if (is.existy(otherChild) && is.not.empty(otherChild)) {
    // 判断是否存在选中的公司
    const flag = data.some(item => item._id === otherChild._id);
    // 不存在填充到页面上
    if (flag === false) {
      options.push(
        <Option disabled value={otherChild._id} key={otherChild._id}>{otherChild.name}</Option>,
      );
    }
  }


  return (
    <Select
      showSearch
      optionFilterProp="children"
      {...omit(['companySelectInfo', 'dispatch', 'customizeNamespace'], props)}
    >
      {options}
    </Select>
  );
}

function mapStateToProps({ business: { companySelectInfo } }) {
  return { companySelectInfo };
}

CompanySelect.propTypes = {
  customizeNamespace: PropTypes.string,    // 手动传入的namespace
  companySelectInfo: PropTypes.object,     // 公司数据
};
CompanySelect.defaultProps = {
  customizeNamespace: '',
  companySelectInfo: {},
};

export default connect(mapStateToProps)(CompanySelect);
