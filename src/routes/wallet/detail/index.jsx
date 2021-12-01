/**
 * 趣活钱包 - 钱包明细
 */
import { connect } from 'dva';
import React, { useRef, useEffect, useState } from 'react';

import {
  CoreTabs,
} from '../../../components/core';
import {
  WalletDetailType,
} from '../../../application/define';

import Search from './search';
import Content from './content';

const Detail = ({
  dispatch,
  walletDetails = {}, // 钱包明细list
  walletDetailsInvoice = [], // 发票抬头
}) => {
  // tab key
  const [tabKey, setTabKey] = useState(WalletDetailType.all);

  // 查询参数
  const searchVal = useRef({
    page: 1,
    limit: 30,
    type: [WalletDetailType.recharge, WalletDetailType.withdraw],
    isGetInvoice: true,
  });

  useEffect(() => {
    // 钱包明细
    dispatch({
      type: 'wallet/getWalletDetails',
      payload: { ...searchVal.current },
    });
    // 发票抬头
    dispatch({
      type: 'wallet/getWalletDetailsInvoice',
      payload: {},
    });

    return () => {
      dispatch({ type: 'wallet/resetWalletDetails' });
      dispatch({ type: 'wallet/resetWalletDetailsInvoice' });
    };
  }, [dispatch]);

  // 获取支付账单list
  const getWalletDetails = () => {
    dispatch({
      type: 'wallet/getWalletDetails',
      payload: { ...searchVal.current, isGetInvoice: false },
    });
  };

  // onSearch
  const onSearch = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
    };
    getWalletDetails();
  };

  // onReset
  const onReset = (val) => {
    searchVal.current = {
      ...searchVal.current,
      ...val,
      page: 1,
      limit: 30,
    };
    getWalletDetails();
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };
    getWalletDetails();
  };

  // tab onChange
  const onChangeTab = (val) => {
    searchVal.current = {
      isGetInvoice: false,
      type: val,
      page: 1,
      limit: 30,
    };
    setTabKey(val);
    getWalletDetails();
  };

  // search props
  const sProps = {
    onSearch,
    onReset,
    dispatch,
    tabKey,
    walletDetailsInvoice,
    searchVal: searchVal.current,
  };

  // content props
  const cProps = {
    onChangePage,
    onShowSizeChange: onChangePage,
    walletDetails,
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
    // 全部
    {
      title: WalletDetailType.description(WalletDetailType.all),
      content: renderTabContent(),
      key: WalletDetailType.all,
    },
    // 充值
    {
      title: WalletDetailType.description(WalletDetailType.recharge),
      content: renderTabContent(),
      key: WalletDetailType.recharge,
    },
    // 提现
    {
      title: WalletDetailType.description(WalletDetailType.withdraw),
      content: renderTabContent(),
      key: WalletDetailType.withdraw,
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
  wallet: { walletDetails, walletDetailsInvoice },
}) => {
  return { walletDetails, walletDetailsInvoice };
};

export default connect(mapStateToProps)(Detail);
