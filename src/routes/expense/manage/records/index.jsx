/**
 * 费用记录明细列表页面 /Expense/Manage/Records
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Table, Tooltip } from 'antd';

import { CoreContent } from '../../../../components/core';
import {
  ExpenseCostOrderState,
  Unit,
  ExpenseInvoiceFlag,
  ExpenseCostCenterType,
  ExpenseCostOrderType,
  OaApplicationOrderType,
} from '../../../../application/define';
import Search from './search';
import style from './style.css';

class IndexPage extends Component {
  static propTypes = {
    costOrdersData: PropTypes.object, // 审批单关联的费用单列表
  }
  static defaultProps = {
    costOrdersData: {},
  }

  constructor() {
    super();
    this.state = {
      isShowExpand: true,       // 判断搜索内容是否收起
    };
    this.private = {
      searchParams: {}, // 搜索的参数
    };
  }

  // 默认加载数据
  componentDidMount() {
    this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrders' });
  }

  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    // 调用搜索
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrders', payload: this.private.searchParams });
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 展开搜索内容的回调
  onToggle = (expand) => {
    this.setState({
      isShowExpand: expand,
    });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch, onToggle } = this;
    const { isShowExpand } = this.state;
    return (
      <Search onSearch={onSearch} onToggle={onToggle} isShowExpand={isShowExpand} />
    );
  }

  // 渲染内容列表
  renderContent = () => {
    const { costOrdersData } = this.props;
    const columns = [{
      title: '审批单号',
      dataIndex: 'applicationOrderId',
      fixed: 'left',
      width: 120,
      render: (text) => {
        return (
          <div>
            <a
              className={style['app-comp-expense-records-order-id']}
              key="detail"
              target="_blank"
              rel="noopener noreferrer"
              href={`/#/Expense/Manage/ExamineOrder/Detail?orderId=${text}`}
            >{text}</a>
          </div>
        );
      },
    }, {
      title: '费用单号',
      dataIndex: 'id',
      fixed: 'left',
      width: 120,
      render: text => (
        <div className={style['app-comp-expense-records-cost-id']}>
          {text}
        </div>
      ),
    }, {
      title: '主题标签',
      dataIndex: 'themeLabelList',
      width: 100,
      fixed: 'left',
      render: (text) => {
        if (!text) return '--';
        // 如果标签长度大于3，只显示3条，其余用...显示
        if (is.not.empty(text) && text.length > 3) {
          return (
            <Tooltip title={text.map(item => item).join(' 、 ')}>
              <div className={style['app-comp-expense-records-theme']}>
                {dot.get(text, '0')}、{dot.get(text, '1')}、{dot.get(text, '2')}...
              </div>
            </Tooltip>
          );
        }
        // 如果标签长度小于等于3，咋全部渲染
        if (is.not.empty(text) && text.length <= 3) {
          return (
            <div className={style['app-comp-expense-records-theme']}>
              {text.map(item => item).join('、')}
            </div>
          );
        }
        return '--';
      },
    }, {
      title: '费用分组',
      dataIndex: 'costGroupName',
      width: 150,
    }, {
      title: '平台',
      dataIndex: 'platformNames',
      width: 70,
      render: (text) => {
        if (is.array(text) && is.not.empty(text)) {
          return text.join(',');
        }
        return '--';
      },
    }, {
      title: '供应商',
      dataIndex: 'supplierNames',
      width: '7%',
      render: (text) => {
        if (is.array(text) && is.not.empty(text)) {
          return text.join(',');
        }
        return '--';
      },
    }, {
      title: '城市',
      dataIndex: 'cityNames',
      width: 100,
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '--';
        }
        // 只有一行数据数据则直接返回
        if (text.length === 1) {
          return dot.get(text, '0');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={text.join(' , ')}>
            <span>{dot.get(text, '0')} 等{text.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: '商圈',
      dataIndex: 'bizDistrictNames',
      width: '7%',
      render: (text) => {
        // 判断数据是否存在
        if (is.not.existy(text) || is.empty(text) || is.not.array(text)) {
          return '--';
        }
        // 只有一行数据数据则直接返回
        if (text.length === 1) {
          return dot.get(text, '0');
        }
        // 默认使用弹窗显示数据
        return (
          <Tooltip title={text.join(' , ')}>
            <span>{dot.get(text, '0')} 等{text.length}条</span>
          </Tooltip>
        );
      },
    }, {
      title: '是否可记账',
      dataIndex: 'isBook',
      width: 120,
      render: (text) => {
        return text ? '是' : '否';
      },
    }, {
      title: '付款周期',
      dataIndex: 'paidMonth',
      width: 120,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '归属周期',
      dataIndex: 'bookMonth',
      width: 120,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '科目',
      dataIndex: ['costAccountingInfo', 'name'],
      width: 180,
      render: (text, record) => {
        return (<p className={style['app-comp-expense-records-subjects']}>
          {`${text}(${record.costAccountingCode})`}</p>);
      },
    }, {
      title: '科目成本归属',
      dataIndex: 'costCenterType',
      width: 180,
      render: (text) => {
        if (text) {
          return (
            <p className={style['app-comp-expense-records-subjects']}>
              {ExpenseCostCenterType.description(text)}
            </p>
          );
        }
        return '--';
      },
    }, {
      title: '是否开票',
      dataIndex: 'invoiceFlag',
      width: 100,
      render: (text) => {
        if (!text) return '无';
        return ExpenseInvoiceFlag.description(text);
      },
    }, {
      title: '申请人',
      dataIndex: 'applyAccountInfo',
      width: 100,
      render: (text) => {
        // 判断是否有值
        if (text) {
          return text.name ? text.name : '--';
        }
        return '--';
      },
    }, {
      title: '付款金额（元）',
      dataIndex: 'totalMoney',
      width: 100,
      render: (text) => {
        return (
          <div className={style['app-comp-expense-records-total-money']}>
            {Unit.exchangePriceCentToMathFormat(text)}
          </div>
        );
      },
    }, {
      title: '发票总金额（元）',
      dataIndex: 'totalCostBillAmount',
      width: 150,
      render: (text) => {
        if (!text) return '--';
        return (
          <div className={style['app-comp-expense-records-total-money']}>
            {Unit.exchangePriceCentToMathFormat(text)}
          </div>
        );
      },
    }, {
      title: '费用总金额（元）',
      dataIndex: 'totalTaxDeductionAmount',
      width: 100,
      render: (text) => {
        if (!text) return '--';
        return (
          <div className={style['app-comp-expense-records-total-money']}>
            {Unit.exchangePriceCentToMathFormat(text)}
          </div>
        );
      },
    }, {
      title: '总税金（元）',
      dataIndex: 'totalTaxAmountAmount',
      width: 100,
      render: (text) => {
        if (!text) return '--';
        return (
          <div className={style['app-comp-expense-records-total-money']}>
            {Unit.exchangePriceCentToMathFormat(text)}
          </div>
        );
      },
    }, {
      title: '是否红冲',
      dataIndex: 'type',
      width: 100,
      render: (text) => {
        return text === ExpenseCostOrderType.redPunch ? '是' : '否';
      },
    }, {
      title: '单据状态',
      dataIndex: 'state',
      width: 100,
      render: (text) => {
        return ExpenseCostOrderState.description(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 60,
      render: (text, record) => {
        // 单条数据id
        const { applicationOrderId, id: recordId } = record;
        const orderType = dot.get(record, 'applicationOrderInfo.application_order_type', undefined);
        let newMoneyRule = '1';
        // 如果是一般费用单或者是差旅单子，需要修改费用模板相关规则@pm:李彩燕
        if (orderType === OaApplicationOrderType.cost || orderType === OaApplicationOrderType.travel) {
          newMoneyRule = '2';
        }
        let template = 1;
        if (record.bizExtraTravelApplyOrderId) {
          template = 7;
        }
        return (
          <div>
            <a
              key="detail"
              target="_blank"
              rel="noopener noreferrer"
              href={`/#/Expense/Manage/Template/Detail?recordId=${recordId}&template=${template}&applicationOrderId=${applicationOrderId}&newMoneyRule=${newMoneyRule}`}
            >详情</a>
          </div>
        );
      },
    }];

    const { page, limit } = this.private.searchParams;

    // 分页
    const pagination = {
      pageSize: limit || 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      total: dot.get(costOrdersData, 'meta.count', 0), // 数据总条数
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,
      onShowSizeChange: this.onShowSizeChange,
    };
    if (page) {
      pagination.current = page; // 当前页数
    }

    return (
      <CoreContent>
        <Table
          dataSource={dot.get(costOrdersData, 'data', [])}
          columns={columns}
          pagination={pagination}
          rowKey={record => record.id}
          scroll={{ x: 2650, y: 400 }}
          bordered
        />
      </CoreContent>
    );
  }

  render() {
    const { renderSearch, renderContent } = this;
    return (
      <div>
        {/* 渲染搜索框 */}
        {renderSearch()}

        {/* 渲染内容栏目 */}
        {renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ expenseCostOrder: { costOrdersData } }) {
  return { costOrdersData };
}
export default connect(mapStateToProps)(IndexPage);
