/**
 * 房屋管理/费用申请记录
 */

import React, { Component } from 'react';
import { Table } from 'antd';
import PropsType from 'prop-types';

import { Unit, ExpenseCostOrderState } from '../../../../../../application/define';

import { CoreContent } from '../../../../../../components/core';

class ExpenseApplyRecords extends Component {

  static propTypes = {
    costOrderData: PropsType.array,   // 费用列表
  };

  static defaultProps = {
    costOrderData: [],                 // 费用列表
  };

  render = () => {
    const { costOrderData } = this.props;
    const columns = [{
      title: '序号',
      dataIndex: 'index',
      fixed: 'left',
      width: 100,
      render: (text, record, index) => {
        return (
          <div>{ index + 1 }</div>
        );
      },
    }, {
      title: '审批单号',
      width: 250,
      dataIndex: 'applicationOrderId',
    }, {
      title: '费用单号',
      dataIndex: 'id',
    }, {
      title: '申请人',
      width: 150,
      dataIndex: ['applyAccountInfo', 'name'],
    }, {
      title: '费用类型',
      width: 250,
      dataIndex: 'costGroupName',
    }, {
      title: '科目',
      width: 150,
      dataIndex: ['costAccountingInfo', 'name'],
      render: (text, record) => {
        return `${text} (${record.costAccountingCode})`;
      },
    }, {
      title: '金额',
      width: 150,
      dataIndex: 'totalMoney',
      render: record => Unit.exchangePriceToYuan(record),
    }, {
      title: '审批状态',
      width: 150,
      dataIndex: 'state',
      render: record => ExpenseCostOrderState.description(record),
    }];
    return (
      <CoreContent
        title="费用申请记录"
      >
        <Table
          bordered
          columns={columns}
          dataSource={costOrderData}
          pagination={false}
          rowKey={record => record.id}
          scroll={{ y: 200, x: 1390 }}
        />
      </CoreContent>
    );
  }
}

export default ExpenseApplyRecords;
