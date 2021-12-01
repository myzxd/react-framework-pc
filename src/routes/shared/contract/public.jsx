/*
 * 共享登记 - 合同列表 - 公共TabPane
 */
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import {
  SharedNewContractState,
  OAContractStampType,
} from '../../../application/define';

import Search from './search';
import ContentChild from './content';

Public.propTypes = {
  tabKey: PropTypes.string, // tab key
};
const Content = forwardRef(ContentChild);
function Public({
  tabKey,
  contractList,
  getSharedContractList,
  reduceSharedContractList,
  sharedContractDeliver,
  getContractEnumerator,
  contractTypeData = {},      // 合同类型及其他类型的枚举表
  tabKeyState,

}) {
  const tabSearchParmas = {};
  // 根据tabKey添加默认搜索条件
  switch (tabKey) {
    case 'tab1':
      tabSearchParmas.state = [SharedNewContractState.toBeEffective];
      tabSearchParmas.stamp_type = [OAContractStampType.weFirst, OAContractStampType.weNext];
      break;
    case 'tab2':
      tabSearchParmas.state = [SharedNewContractState.effective, SharedNewContractState.expired];
      tabSearchParmas.stamp_type = [OAContractStampType.weFirst, OAContractStampType.weNext];
      break;
    case 'tab3':
      tabSearchParmas.state = [SharedNewContractState.invalid];
      tabSearchParmas.stamp_type = [OAContractStampType.weFirst, OAContractStampType.weNext];
      break;
    case 'tab4':
      tabSearchParmas.stamp_type = [OAContractStampType.unNeed];
      break;
    default:
  }
  // search value
  const searchVal = useRef({
    _meta: { page: 1, limit: 30 },
    contractNameSpace: tabKey,
    ...tabSearchParmas,
  });

  const [form, setForm] = useState({});


  // content子组件
  const contentRef = useRef();
  // table loading
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await getSharedContractList({ ...searchVal.current });
      setTableLoading(false);
    })();
     // 获取合同类型枚举表
    getContractEnumerator();
    return () => {
      reduceSharedContractList({ contractNameSpace: tabKey, result: {} });
    };
  }, []);

  useEffect(() => {
    if (tabKeyState) {
      onReset();
    }
  }, [tabKeyState]);
  // onSearch
  const onSearch = async (values) => {
    setTableLoading(true);
    searchVal.current = {
      ...searchVal.current,
      ...values,
      _meta: {
        page: 1,
        limit: 30,
      },
    };
    // 清除选中
    if (contentRef.current && contentRef.current.setSelectedRowKeys && contentRef.current.setSelectedRowKeys.length > 0) {
      contentRef.current.setSelectedRowKeys([]);
    }
    await getSharedContractList({ ...searchVal.current });
    setTableLoading(false);
  };


  const onReset = async () => {
    setTableLoading(true);
    const params = {
      _meta: { page: 1, limit: 30 },
      contractNameSpace: tabKey,
      ...tabSearchParmas,
    };
    searchVal.current = params;

    // 清除选中
    if (contentRef.current && contentRef.current.setSelectedRowKeys && contentRef.current.setSelectedRowKeys.length > 0) {
      contentRef.current.setSelectedRowKeys([]);
    }
    await getSharedContractList(params);
    setTableLoading(false);
  };
  // onChangePage
  const onChangePage = async (page, limit) => {
    setTableLoading(true);
    searchVal.current = {
      ...searchVal.current,
      _meta: { page, limit },
    };
    await getSharedContractList({ ...searchVal.current });
    setTableLoading(false);
  };

  // onShowSizeChange
  const onShowSizeChange = async (page, limit) => {
    setTableLoading(true);
    searchVal.current = {
      ...searchVal.current,
      _meta: { page, limit },
    };
    await getSharedContractList({ ...searchVal.current });
    setTableLoading(false);
  };

  return (
    <div>
      <Search
        tabKeyState={tabKeyState}
        tabKey={tabKey}
        onSearch={onSearch}
        onReset={onReset}
        setForm={setForm}
        form={form}
        tabSearchParmas={tabSearchParmas}
      />
      <Content
        pactTypes={contractTypeData.pact_types}
        sealTypes={contractTypeData.seal_types}
        tabKey={tabKey}
        tableLoading={tableLoading}
        contractList={contractList}
        onChangePage={onChangePage}
        onShowSizeChange={onShowSizeChange}
        ref={contentRef}
        sharedContractDeliver={sharedContractDeliver}
        breakContractList={async () => {
          setTableLoading(true);
          await getSharedContractList({ ...searchVal.current });
          setTableLoading(false);
        }}
      />
    </div>
  );
}

const mapStateToProps = ({ sharedContract: { contractList }, expenseExamineFlow: { contractTypeData } }) => ({ contractList, contractTypeData });
const mapDispatchToProps = dispatch => ({
  // 获取列表
  getSharedContractList: payload => dispatch({
    type: 'sharedContract/getSharedContractList',
    payload,
  }),
  // 清除列表
  reduceSharedContractList: payload => dispatch({
    type: 'sharedContract/reduceSharedContractList',
    payload,
  }),
  // 合同转递
  sharedContractDeliver: payload => dispatch({
    type: 'sharedContract/sharedContractDeliver',
    payload,
  }),
  // 获取合同类型枚举表
  getContractEnumerator: () => dispatch({ type: 'expenseExamineFlow/fetchContractType' }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Public);
