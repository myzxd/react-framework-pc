/* eslint-disable no-confusing-arrow */
/**
 * 摊销管理 - 台账明细
 */
import React, { useRef, useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { connect } from 'dva';
import { CoreContent } from '../../../components/core';
import { utils } from '../../../application';
import { Unit } from '../../../application/define';
import Search from './search';

// 获取默认记账月份
const getDefaultBookMonth = () => {
  // 当前日期
  const curDate = Number(moment().get('date'));

  // 12号之后，取当前月
  if (curDate > 12) {
    return moment();
  }

  // 12号之前，取上月
  if (curDate <= 12) {
    return moment().subtract(1, 'M');
  }
};

Index.propTypes = {
  ledgerListInfo: PropTypes.object, // 台账列表信息
};

function Index({
  ledgerListInfo,
  fetchLedgerList, // 获取台账列表
  clearLedgerList, // 清空台账列表model数据
}) {
  // table loading
  const [tableLoading, setTableLoading] = useState(true);
  // 默认的搜索参数
  const searchParams = useRef({
    page: 1,
    limit: 30,
    billMonth: getDefaultBookMonth(), // 记账月份
  });

  // 获取台账列表
  useEffect(() => {
    (async () => {
      await fetchLedgerList(searchParams.current);
      setTableLoading(false);
    })();
    return () => {
      // 清空台账列表model数据
      clearLedgerList();
    };
  }, []);

  // 搜索事件回调
  const onSearch = async (params = {}) => {
    setTableLoading(true);
    searchParams.current = {
      ...searchParams.current,
      ...params,
    };
    await fetchLedgerList({ ...searchParams.current });
    setTableLoading(false);
  };

  // 重置搜索条件回调
  const onReset = async () => {
    setTableLoading(true);
    searchParams.current = {
      page: 1,
      limit: 30,
      billMonth: getDefaultBookMonth(), // 记账月份
    };
    await fetchLedgerList(searchParams.current);
    setTableLoading(false);
  };

  // 渲染搜索
  const renderSearch = () => {
    return (
      <Search
        onSearch={onSearch}
        onReset={onReset}
        getDefaultBookMonth={getDefaultBookMonth}
      />
    );
  };

  // 渲染表格
  const renderTable = () => {
    const columns = [
      {
        title: '科目名称',
        dataIndex: 'cost_accounting_name',
        key: 'cost_accounting_name',
        render: text => text || '--',
      },
      {
        title: '应摊总额',
        dataIndex: 'allocation_total_money',
        key: 'allocation_total_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      {
        title: '总税金',
        dataIndex: 'tax_money',
        key: 'tax_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      {
        title: '本期应摊总额',
        dataIndex: 'allocation_money',
        key: 'allocation_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      {
        title: '未摊金额',
        dataIndex: 'accumulated_unallocation_money',
        key: 'accumulated_unallocation_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      {
        title: '累计已摊销金额',
        dataIndex: 'accumulated_allocation_money',
        key: 'accumulated_allocation_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
      {
        title: '预计残值金额',
        dataIndex: 'pre_salvage_money',
        key: 'pre_salvage_money',
        render: text => (text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--',
      },
    ];

    // 修改分页
    const onChangePage = (page, limit) => {
      searchParams.current = {
        ...searchParams.current,
        page,
        limit,
      };
      onSearch();
    };

    // 改变每页展示条数
    const onShowSizeChange = (page, limit) => {
      searchParams.current = {
        ...searchParams.current,
        page,
        limit,
      };
      onSearch();
    };

    const { limit } = searchParams.current;

    // 分页
    const pagination = {
      current: searchParams.current.page || 1, // 当前页数
      pageSize: limit || 30,          // 默认数据条数
      onChange: onChangePage,       // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange,             // 展示每页数据数
      showTotal: total => `总共${total}条`,     // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: utils.dotOptimal(ledgerListInfo, '_meta.result_count', 0),  // 数据总条数
    };

    return (
      <CoreContent title="分摊台账表">
        <Table
          rowKey={(re, key) => re._id || key}
          columns={columns}
          bordered
          dataSource={ledgerListInfo.data || []}
          pagination={pagination}
          loading={tableLoading}
        />
      </CoreContent>
    );
  };

  return (
    <div>
      {/* 渲染搜索 */}
      {renderSearch()}
      {/* 渲染表格 */}
      {renderTable()}
    </div>
  );
}

const mapStateToProps = ({
  costAmortization: { ledgerListInfo },
}) => ({
  ledgerListInfo,
});

const mapDispatchToProps = dispatch => ({
  // 获取台账列表
  fetchLedgerList: payload => dispatch({
    type: 'costAmortization/fetchLedgerList',
    payload,
  }),
  // 清空台账列表model数据
  clearLedgerList: () => dispatch({
    type: 'costAmortization/reduceLedgerListInfo',
    payload: {},
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
