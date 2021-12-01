/**
 * 房屋管理 / 房屋台账 / 押金
 */
import moment from 'moment';
import React, { Component } from 'react';
import { Table, Row, Col } from 'antd';
import PropsType from 'prop-types';

import {
  Unit,
} from '../../../../../../../application/define';
import style from './style.css';

import { CoreContent } from '../../../../../../../components/core';

class AccountDeposit extends Component {

  static propTypes = {
    costOrderData: PropsType.array, // 费用列表
    houseContractDetail: PropsType.object, // 房屋信息
  };

  static defaultProps = {
    costOrderData: [], // 费用列表
  };

  // 渲染内容
  renderContent = () => {
    const {
      costOrderData = [], // 押金数据
      houseContractDetail = {}, // 房屋详情
    } = this.props;

    // const {
    // houseContractAllocation = [], // 租金台账记录
    // } = houseContractDetail;

    // 台账记录没有数据时，不渲染
    // const dataSource = houseContractAllocation.length === 0
    // ? []
    // : costOrderData;

    // 押金金额、已退押金金额、未退押金金额
    const {
      pledgeMoney = 0, // 押金金额
      contractStartDate, // 合同开始日期
      contractEndDate, // 合同结束日期
      pledgeLostMoney, // 押金损失
      unrefundedPledgeMoney, // 期末押金
    } = houseContractDetail;

    const dataSource = costOrderData.length === 0
      ? []
      : [{
        ...costOrderData[0],
        pledge_lost_money: pledgeLostMoney,
        unrefunded_pledge_money: unrefundedPledgeMoney,
      }];

    // 合同租期拼串
    const contractDate = `${moment(`${contractStartDate}`).format('YYYY.MM.DD')}-${moment(`${contractEndDate}`).format('YYYY.MM.DD')}`;

    const columns = [{
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => {
        return (
          <div>{ index + 1 }</div>
        );
      },
    }, {
      title: '审批单号',
      dataIndex: 'application_order_id',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '付款时间',
      dataIndex: 'paid_at',
      render: (text) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        }
        return '--';
      },
    }, {
      title: '申请人',
      dataIndex: ['apply_account_info', 'name'],
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '押金金额',
      dataIndex: 'total_money',
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return 0;
      },
    }, {
      title: '押金损失',
      dataIndex: 'pledge_lost_money',
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return 0;
      },
    }, {
      title: '期初押金',
      dataIndex: 'total_money',
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return 0;
      },
    }, {
      title: '期末押金',
      dataIndex: 'unrefunded_pledge_money',
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return 0;
      },
    }, {
      title: '备注',
      dataIndex: 'note',
      render: (text) => {
        if (text) {
          return (
            <div
              className={style['app-comp-expense-house-contract-detail-account-table']}
            >
              {text}
            </div>
          );
        }
        return '--';
      },
    }];

    return (
      <CoreContent>
        <Row className={style['app-comp-expense-house-contract-detail-account-deposit']}>
          <Col span={4}>押金记录</Col>
        </Row>
        <Row className={style['app-comp-expense-house-contract-detail-account-deposit']}>
          <Col
            span={4}
            offset={2}
          >
            {`合同押金：${Unit.exchangePriceCentToMathFormat(pledgeMoney)}`}
          </Col>
          <Col
            span={4}
          >
            {`合同租期：${contractDate}`}
          </Col>
        </Row>
        <Table
          bordered
          columns={columns}
          pagination={false}
          dataSource={dataSource}
          rowKey={record => record._id}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderContent();
  }
}

export default AccountDeposit;
