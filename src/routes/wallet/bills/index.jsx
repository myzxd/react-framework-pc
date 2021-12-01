/**
 * 趣活钱包 - 支付账单
 */
import { connect } from 'dva';
import React, { useRef, useEffect, useState } from 'react';

import {
  CoreTabs,
} from '../../../components/core';
import {
  WalletBillsPaidState,
} from '../../../application/define';

import Search from './search';
import Content from './content';

const Bills = ({
  dispatch,
  walletBills = {}, // 支付账单list
}) => {
  // tab key
  const [tabKey, setTabKey] = useState(WalletBillsPaidState.toBePaid);
  // loading
  const [loading, onChangeLoading] = useState(true);
  // 查询参数
  const searchVal = useRef({
    page: 1,
    limit: 30,
    state: WalletBillsPaidState.toBePaid, // 账单状态
  });

  // loading关闭
  const onLoading = () => {
    onChangeLoading(false);
  };

  useEffect(() => {
    dispatch({
      type: 'wallet/getWalletBills',
      payload: {
        ...searchVal.current,
        onLoading,
      },
    });
    return () => {
      dispatch({ type: 'wallet/resetWalletBills' });
    };
  }, [dispatch]);

  // 获取支付账单list
  const getWalletBills = () => {
    onChangeLoading(true);
    dispatch({ type: 'wallet/resetWalletBills' });
    dispatch({
      type: 'wallet/getWalletBills',
      payload: {
        ...searchVal.current,
        onLoading,
      },
    });
  };

  // onSearch
  const onSearch = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
    };
    getWalletBills();
  };

  // onReset
  const onReset = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
      page: 1,
      limit: 30,
    };
    getWalletBills();
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };
    getWalletBills();
  };

  // tab onChange
  const onChangeTab = (val) => {
    searchVal.current = {
      page: 1,
      limit: 30,
      state: val,
    };
    setTabKey(val);
    getWalletBills();
  };

  // search props
  const sProps = {
    onSearch,
    onReset,
    dispatch,
    tabKey,
    searchVal: searchVal.current,
  };

  // content props
  const cProps = {
    walletBills,
    onChangePage,
    onShowSizeChange: onChangePage,
    dispatch,
    getWalletBills,
    loading,
  };

  // tab content
  const renderTabContent = () => {
    return (
      <React.Fragment>
        <Search {...sProps} />
        <Content {...cProps} />
      </React.Fragment>
    );
  };

  // tab items
  const tabItems = [
    // 待支付
    {
      title: WalletBillsPaidState.description(WalletBillsPaidState.toBePaid),
      content: renderTabContent(),
      key: WalletBillsPaidState.toBePaid,
    },
    // 支付中
    {
      title: WalletBillsPaidState.description(WalletBillsPaidState.payOngoing),
      content: renderTabContent(),
      key: WalletBillsPaidState.payOngoing,
    },
    // 支付完成
    {
      title: WalletBillsPaidState.description(WalletBillsPaidState.done),
      content: renderTabContent(),
      key: WalletBillsPaidState.done,
    },
    // 已作废
    {
      title: WalletBillsPaidState.description(WalletBillsPaidState.void),
      content: renderTabContent(),
      key: WalletBillsPaidState.void,
    },
  ];

  return (
    <CoreTabs
      items={tabItems}
      onChange={onChangeTab}
    />
  );
};

const mapStateToProps = ({
  wallet: { walletBills },
}) => {
  return { walletBills };
};

export default connect(mapStateToProps)(Bills);
