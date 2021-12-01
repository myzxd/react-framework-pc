/*
 * 共享登记 - 公司列表组件（包含注销的数据）
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const Option = Select.Option;

function CompanyList(props) {
  const {
    dispatch,
    companyList = {},
    onChange,
    value,
  } = props;

  const { data = [] } = companyList;

  useEffect(() => {
    const payload = {
      _meta: { page: 1, limit: 0 },
    };

    dispatch({ type: 'sharedCompany/getSharedCompanyList', payload });
    return () => {
      dispatch({ type: 'sharedCompany/reduceSharedCompanyList', payload: { } });
    };
  }, [dispatch]);

  const renderOptions = () => {
    // 渲染data及otherChild数据
    return data.map((i) => {
      // data中的数据可选中
      return <Option value={i._id} key={i._id} child={i}>{i.name}</Option>;
    });
  };

  return (
    <Select
      placeholder="请选择"
      allowClear
      showSearch
      optionFilterProp="children"
      onChange={onChange}
      value={value}
    >
      {renderOptions()}
    </Select>
  );
}

const mapStateToProps = ({ sharedCompany: { companyList } }) => ({ companyList });

export default connect(mapStateToProps)(CompanyList);
