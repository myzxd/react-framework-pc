/**
 * 人员管理 - 合同归属管理 - 员工合同甲方
 */
import React, { useRef } from 'react';
import { connect } from 'dva';
import {
  ThirdCompanyState,
  ContractAttributionType,
} from '../../../../application/define';

import Search from './search';
import Content from './content';

const Employee = ({
  dispatch,
  companies = {},
}) => {
  // 查询参数
  const searchVal = useRef({
    page: 1,
    limit: 30,
    state: ThirdCompanyState.on, // 状态
    type: ContractAttributionType.employee, // 类型
  });

  // 获取支付账单list
  const getCompanies = () => {
    dispatch({
      type: 'systemManage/fetchCompanies',
      payload: {
        ...searchVal.current,
        meta: {
          page: searchVal.current.page,
          limit: searchVal.current.limit,
        },
        state: searchVal.current.state,
        type: searchVal.current.type,

      },
    });
  };

  // onSearch
  const onSearch = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
      page: 1,
      limit: 30,
    };
    getCompanies();
  };

  // onReset
  const onReset = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
      page: 1,
      limit: 30,
    };
    getCompanies();
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };
    getCompanies();
  };


  // search props
  const sProps = {
    onSearch,
    onReset,
    dispatch,
    searchVal: searchVal.current,
  };

  // content props
  const cProps = {
    companies,
    onChangePage,
    onShowSizeChange: onChangePage,
    dispatch,
    getCompanies,
  };

  return (
    <React.Fragment>
      <Search {...sProps} />
      <Content {...cProps} />
    </React.Fragment>
  );
};

const mapStateToProps = ({
  systemManage: { companies },
}) => {
  return { companies };
};

export default connect(mapStateToProps)(Employee);
