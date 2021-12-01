/**
 * 房屋管理 / 房屋台账 / 租金
 */
import moment from 'moment';
import React, { Component } from 'react';
import { Table, Row, Col } from 'antd';
import PropsType from 'prop-types';

import {
  Unit,
  ExpenseTeamType,
  ExpenseCostCenterType,
  ExpenseCostOrderBelong,
} from '../../../../../../../application/define';
import style from './style.css';

import { CoreContent } from '../../../../../../../components/core';

// const temp = []; // 合并列数据
// const indexTemp = []; // 合并行对应行的rowSpan

class AccountRent extends Component {

  static propTypes = {
    // costOrderData: PropsType.array, // 费用列表
    houseContractDetail: PropsType.object, // 房屋信息
    houseAccout: PropsType.object,
    onChangePage: PropsType.func,
  };

  static defaultProps = {
    // costOrderData: [], // 费用列表
    houseContractDetail: {}, // 房屋信息
    houseAccout: {},
    onChangePage: () => {},
  };

  // 修改页码
  onChangePage = (page, limit) => {
    const { onChangePage } = this.props;
    onChangePage && onChangePage(page, limit);
  }

  // 合并行
  // mergeCells = (text, data, col, index) => {
  //   let i = 0;
  //   if (text !== temp[col]) {
  //     temp[col] = text;
  //     data.forEach((item) => {
  //       if (item.belong_time === temp[col]) {
  //         i += 1;
  //       }
  //     });
  //   }
  //   indexTemp.push(i);
  //   return indexTemp[index];
  // }

  // 渲染内容
  renderContent = () => {
    const {
      // costOrderData, // 租金数据
      houseContractDetail = {}, // 房屋详情
      houseAccout = {},
    } = this.props;

    const {
      data,
      meta,
    } = houseAccout;

    // 数据为空，返回null
    if (Object.keys(houseContractDetail).length === 0) return null;

    // 租金金额
    const {
      monthMoney = 0, // 租金金额
      contractStartDate, // 合同开始日期
      contractEndDate, // 合同结束日期
      allocationMode, // 分摊方式
    } = houseContractDetail;

    // 合同租期拼串
    const contractDate = `${moment(`${contractStartDate}`).format('YYYY.MM.DD')}-${moment(`${contractEndDate}`).format('YYYY.MM.DD')}`;

    const columns = [{
      title: '序号',
      dataIndex: 'index',
      fixed: 'left',
      width: 50,
      render: (text, record, index) => {
        return (
          <div>{ index + 1 }</div>
        );
      },
    }, {
      title: '审批单',
      width: 250,
      dataIndex: ['cost_order_info', 'application_order_info', '_id'],
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '付款日期',
      width: 150,
      dataIndex: ['cost_order_info', 'paid_at'],
      render: (text) => {
        if (text) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        }
        return '--';
      },
    }, {
      title: '租金期间',
      width: 200,
      dataIndex: 'application_rent_cycle',
      render: (text) => {
        if (text) {
          if (text.length === 1) {
            return moment(`${text[0]}`).format('YYYY.MM.DD');
          }
          return `${moment(`${text[0]}`).format('YYYY.MM.DD')} - ${moment(`${text[1]}`).format('YYYY.MM.DD')}`;
        }
        return '--';
      },
    }, {
      title: '租金',
      width: 100,
      dataIndex: 'pay_money',
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return Unit.exchangePriceCentToMathFormat(0);
      },
    }, {
      title: '无票税点金额',
      width: 100,
      dataIndex: 'rent_tax_money',
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return Unit.exchangePriceCentToMathFormat(0);
      },
    }, {
      title: '分摊对象',
      dataIndex: 'cost_center_type',
      width: 200,
      render: (text, record) => {
        if (text === ExpenseCostCenterType.project) {
          return record.platform_name || '--';
        }
        if (text === ExpenseCostCenterType.headquarter) {
          return record.supplier_name | '--';
        }
        if (text === ExpenseCostCenterType.city) {
          return record.city_name || '--';
        }
        if (text === ExpenseCostCenterType.district) {
          return record.biz_district_name || '--';
        }
        if (text === ExpenseCostCenterType.team) {
          if (record.team_type && record.team_name) {
            return `${ExpenseTeamType.description(record.team_type)}(${record.team_name})`;
          }
          return '--';
        }
        return '--';
      },
    }, {
      title: '分摊方式',
      dataIndex: ['cost_order_info', 'allocation_mode'],
      width: 200,
      render: (text, record) => {
        // 费用单信息
        const { cost_order_info: costOrderInfo } = record;
        // 费用单数据为空，从房屋详情里获取
        if (!costOrderInfo) {
          return ExpenseCostOrderBelong.description(allocationMode);
        }

        if (text) {
          return ExpenseCostOrderBelong.description(text);
        }
        return '--';
      },
    }, {
      title: '分摊id',
      dataIndex: 'cost_center_type',
      width: 200,
      render: (text, record) => {
        if (text === ExpenseCostCenterType.project) {
          return record.platform_code || '--';
        }
        if (text === ExpenseCostCenterType.headquarter) {
          return record.supplier_id || '--';
        }
        if (text === ExpenseCostCenterType.city) {
          return record.city_code || '--';
        }
        if (text === ExpenseCostCenterType.district) {
          return record.biz_district_id || '--';
        }
        if (text === ExpenseCostCenterType.team) {
          return record.team_id_code || '--';
        }
        return '--';
      },
    }, {
      title: '累计已付款',
      width: 100,
      dataIndex: 'accumulated_payment_money',
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return Unit.exchangePriceCentToMathFormat(0);
      },
    }, {
      title: '累计已分摊',
      width: 100,
      dataIndex: 'accumulated_allocation_money',
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return Unit.exchangePriceCentToMathFormat(0);
      },
    }, {
      title: '未分摊总金额',
      width: 100,
      dataIndex: 'unallocation_money',
      render: (text) => {
        if (text) {
          return Unit.exchangePriceCentToMathFormat(text);
        }
        return Unit.exchangePriceCentToMathFormat(0);
      },
    }, {
      title: '分摊开始日期',
      width: 150,
      dataIndex: 'allocation_start_date',
      render: (text) => {
        if (text) {
          return moment(`${text}`).format('YYYY-MM-DD');
        }

        // 取值合同开始日期
        if (contractStartDate) {
          return moment(`${contractStartDate}`).format('YYYY-MM-DD');
        }

        return '--';
      },
    }, {
      title: '已分摊截止日期',
      width: 150,
      dataIndex: 'allocation_end_date',
      render: (text) => {
        if (text) {
          return moment(`${text}`).format('YYYY-MM-DD');
        }
        return '--';
      },
    }, {
      title: '未分摊截止日期',
      width: 150,
      dataIndex: 'unallocation_end_date',
      render: (text) => {
        if (text) {
          return moment(`${text}`).format('YYYY-MM-DD');
        }
        return '--';
      },
    }, {
      title: '备注',
      width: 150,
      dataIndex: ['cost_order_info', 'note'],
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

    // 分页配置
    const pagination = {
      showSizeChanger: true, // 可以改变 pageSize
      showQuickJumper: true,  // 可以快速跳转至某页
      defaultPageSize: 10, // 默认下拉页数
      onShowSizeChange: this.onChangePage, // 展示每页数据
      total: meta.count,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage, // 切换分页
    };

    return (
      <CoreContent>
        <Row className={style['app-comp-expense-house-contract-detail-account-rent']}>
          <Col span={4}>租金记录</Col>
        </Row>
        <Row className={style['app-comp-expense-house-contract-detail-account-rent']}>
          <Col
            span={4}
            offset={2}
          >
            {`合同租金：${Unit.exchangePriceCentToMathFormat(monthMoney)}`}
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
          dataSource={data}
          pagination={pagination}
          rowKey={record => record._id}
          scroll={{ y: 200, x: 2450 }}
        />
      </CoreContent>
    );
  }

  render = () => {
    return this.renderContent();
  }
}

export default AccountRent;
