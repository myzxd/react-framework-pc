/**
 * code - 付款审批单
 */
import { connect } from 'dva';
import React, { useRef, useEffect, useState } from 'react';
import {
  Empty,
} from 'antd';
import is from 'is_js';
import dot from 'dot-prop';

import {
  CoreTabs,
} from '../../../components/core';
import {
  CodeApproveOrderTabKey,
} from '../../../application/define';
import {
  cryptoRandomString,
} from '../../../application/utils';

import Search from './search';
import Content from './content';
import GroupContent from './group';
import getFormValues from './dealSearchValues';

import Operate from '../../../application/define/operate';

const ApproveOrder = ({
  dispatch,
  approveOrderList = {}, // 审批单list
  location = {},
  orderSearchGroup = [], // 查询条件分组
  prePageAction,
}) => {
  // 页面跳转tab key
  const { tabKey: defaultKey } = location.query;
  // tab key
  const [tabKey, setTabKey] = useState(defaultKey || CodeApproveOrderTabKey.awaitReport);
  // 表格加载状态
  const [loading, setLoading] = useState(true);
  // 默认分组
  const [defaultGroup, setDefaultGroup] = useState({});

  // 重置状态值
  const [resetState, setResetState] = useState(undefined);

  // 查询参数
  const searchVal = useRef({
    page: 1,
    limit: 30,
    tabKey,
  });

  useEffect(() => {
    // 如果存储的用户行为不存在 直接返回
    if (is.not.existy(prePageAction) || is.empty(prePageAction)) return;
    searchVal.current = {
      page: prePageAction.page,
      limit: prePageAction.pageSize,
      tabKey: prePageAction.tabKey,
    };

    // 设置tabkey *如果第二次点击跳转 上一次tabkey可能是默认值 所以需要设置
    if (is.existy(prePageAction.tabKey)) {
      setTabKey(prePageAction.tabKey);
    }
  }, [prePageAction]);
  // 更新分组列表及审批单列表
  const onUpdateGroup = async (params = {}) => {
    const {
      tabType = tabKey,
      groupId, // 分组id
    } = params;

    // 重置数据
    dispatch({ type: 'codeOrder/resetApproveOrderList' });

    // 设置列表loading
    setLoading(true);

    // 非待提报tab
    if (Number(tabType) !== CodeApproveOrderTabKey.awaitReport) {
      // 切换分组，更新查询条件(无需调用分组接口)
      if (groupId) {
        const groupData = orderSearchGroup.find(g => g._id === groupId) || {};

        if (groupData && groupData.filter_params) {
          searchVal.current = {
            ...searchVal.current,
            ...getFormValues(groupData.filter_params),
          };
          // 设置默认分组查询数据
          setDefaultGroup({ ...getFormValues(groupData.filter_params) });
        }
      } else {
        // 切换tab || 默认分组变更，更新查询条件（获取分组接口）
        const res = await dispatch({
          type: 'codeOrder/getOrderSearchGroupList',
          payload: {
            tabKey: tabType,
          },
        });

        // 默认分组
        const initGroup = Array.isArray(res) ? res.find(g => g.is_default) : {};

        // 默认分组存在：重置查询参数为默认分组查询条件
        if (initGroup && initGroup.filter_params) {
          searchVal.current = {
            ...searchVal.current,
            ...getFormValues(initGroup.filter_params),
          };

          // 设置默认分组查询数据
          setDefaultGroup({ ...getFormValues(initGroup.filter_params) });
        }

        // 不存在默认分组
        if (!initGroup || Object.keys(initGroup).length < 1) {
          searchVal.current = {
            limit: 30,
            page: 1,
            tabKey: tabType,
          };

          // 设置默认分组查询数据为空
          setDefaultGroup({});
        }
      }
    } else {
      // 设置默认分组查询数据为空
      setDefaultGroup({});
    }

    // 获取审批单list
    dispatch({
      type: 'codeOrder/getApproveOrderList',
      payload: {
        ...searchVal.current,
        setLoading: () => setLoading(false),
      },
    });
  };

  useEffect(() => {
    // 获取分组列表及审批单列表
    onUpdateGroup();

    return () => {
      dispatch({ type: 'codeOrder/resetApproveOrderList' });
    };
  }, [dispatch]);

  // 获取审批单list
  const getApproveOrderList = () => {
    // 重置数据
    dispatch({ type: 'codeOrder/resetApproveOrderList' });

    dispatch({
      type: 'codeOrder/getApproveOrderList',
      payload: {
        ...searchVal.current,
        setLoading: () => setLoading(false),
      },
    });
  };

  // onSearch
  const onSearch = (val) => {
    setLoading(true);
    searchVal.current = {
      ...searchVal.current,
      ...val,
      page: 1,
      limit: 30,
    };
    getApproveOrderList();
  };

  // onReset
  const onReset = (val) => {
    setLoading(true);
    // 重置状态
    setResetState(cryptoRandomString(32));

    searchVal.current = {
      ...searchVal.current,
      ...val,
      page: 1,
      limit: 30,
    };
    getApproveOrderList();
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };
    getApproveOrderList();
  };

  // tab onChange
  const onChangeTab = async (val) => {
    searchVal.current = {
      page: 1,
      limit: 30,
      tabKey: val,
    };

    setTabKey(val);

    // 获取分组列表及审批单列表
    onUpdateGroup({ tabType: val });
  };

  // tab content
  const renderTabContent = () => {
    // search props
    const sProps = {
      onSearch,
      onReset,
      dispatch,
      tabKey,
      searchVal: searchVal.current,
      defaultGroup,
      onUpdateGroup,
      orderSearchGroup,
    };

    // content props
    const cProps = {
      onChangePage,
      onShowSizeChange: onChangePage,
      dispatch,
      approveOrderList,
      getApproveOrderList,
      tabKey,
      loading,
    };

    const gProps = {
      dispatch,
      orderSearchGroup,
      tabKey,
      onUpdateGroup,
      resetState, // 状态
    };

    return (
      <React.Fragment>
        <Search {...sProps} />
        {
          Number(tabKey) !== CodeApproveOrderTabKey.awaitReport && (
            <GroupContent {...gProps} />
          )
        }
        <Content {...cProps} />
      </React.Fragment>
    );
  };

  // tab items
  let tabItems = [];

  // 我待办/我提报/待提报/我经手Tab
  Operate.canOperateOperateCodeApproveOrderTabOther() && (
    tabItems = [
      // 待提报
      {
        title: CodeApproveOrderTabKey.description(CodeApproveOrderTabKey.awaitReport),
        key: CodeApproveOrderTabKey.awaitReport,
      },
      // 我待办
      {
        title: CodeApproveOrderTabKey.description(CodeApproveOrderTabKey.upcoming),
        key: CodeApproveOrderTabKey.upcoming,
      },
      // 我提报
      {
        title: CodeApproveOrderTabKey.description(CodeApproveOrderTabKey.meReport),
        key: CodeApproveOrderTabKey.meReport,
      },
      // 我经手
      {
        title: CodeApproveOrderTabKey.description(CodeApproveOrderTabKey.meHandle),
        key: CodeApproveOrderTabKey.meHandle,
      },
      // 抄送我的
      {
        title: CodeApproveOrderTabKey.description(CodeApproveOrderTabKey.copyGive),
        key: CodeApproveOrderTabKey.copyGive,
      },
    ]
  );

  // 全部tab
  Operate.canOperateOperateCodeApproveOrderTabAll() && (
    tabItems[tabItems.length] = {
      title: CodeApproveOrderTabKey.description(CodeApproveOrderTabKey.all),
      key: CodeApproveOrderTabKey.all,
    }
  );

  // 无权限
  if (tabItems.length.length < 1) return <Empty />;

  // tab defaultActiveKey第一次进来 只会拿第一个 所以如果有存储的值就用存储的 否则用默认值
  const actionTabkey = dot.get(prePageAction, 'tabKey', tabKey);
  return (
    <React.Fragment>
      <CoreTabs
        items={tabItems}
        onChange={onChangeTab}
        defaultActiveKey={actionTabkey}
      />
      {renderTabContent()}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeOrder: {
    approveOrderList,
    orderSearchGroup,
    prePageAction,
  },
}) => {
  return { approveOrderList, orderSearchGroup, prePageAction };
};

export default connect(mapStateToProps)(ApproveOrder);
