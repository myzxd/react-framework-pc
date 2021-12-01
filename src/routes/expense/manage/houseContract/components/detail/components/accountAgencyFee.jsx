/**
 * 房屋管理 / 房屋台账 / 中介费
 */
import moment from 'moment';
import React, { Component } from 'react';
import { Table, Row, Col } from 'antd';
import PropsType from 'prop-types';

import {
  Unit,
} from '../../../../../../../application/define';

import { CoreContent } from '../../../../../../../components/core';
import style from './style.css';

class AccountAgencyFees extends Component {

  static propTypes = {
    costOrderData: PropsType.array, // 费用列表
    houseContractDetail: PropsType.object, // 房屋信息
  };

  static defaultProps = {
    costOrderData: [], // 费用列表
    houseContractDetail: {}, // 房屋信息
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 渲染内容
  renderContent = () => {
    const {
      costOrderData = [], // 中介费数据
      houseContractDetail = {}, // 房屋详情
    } = this.props;

    const {
      contractStartDate, // 合同开始时间
      contractEndDate, // 合同结束时间
      agentMoney, // 中介费金额
    } = houseContractDetail;

    // 中介费金额、台账记录
    // const {
    // agentMoney = 0, // 中介费金额
    // houseContractAllocation = [], // 台账记录
    // contractStartDate, // 合同开始日期
    // contractEndDate, // 合同结束日期
    // } = houseContractDetail;

    // 台账记录没有数据时，不渲染
    // const dataSource = houseContractAllocation.length === 0
    // ? []
    // : costOrderData;

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
      title: '中介金额',
      dataIndex: 'total_money',
      render: (text, record) => {
        const { tax_money: taxMoney } = record; // 税金金额
        // 计算金额
        const money = text - taxMoney;
        if (text) {
          return Unit.exchangePriceCentToMathFormat(money);
        }
        return '--';
      },
    }, {
      title: '无票税点金额',
      dataIndex: 'tax_money',
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return '--';
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
        <Row className={style['app-comp-expense-house-contract-detail-mediation']}>
          <Col span={4}>中介费记录</Col>
        </Row>
        <Row className={style['app-comp-expense-house-contract-detail-mediation']}>
          <Col
            span={4}
            offset={2}
          >
            {`合同中介费：${Unit.exchangePriceCentToMathFormat(agentMoney)}`}
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
          dataSource={costOrderData}
          pagination={false}
          rowKey={record => record._id}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderContent();
  }
}

export default AccountAgencyFees;
