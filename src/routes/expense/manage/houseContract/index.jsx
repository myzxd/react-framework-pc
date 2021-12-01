/**
 * 房屋管理/列表 /Expense/Manage/House
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Button, message, Tooltip } from 'antd';
import React, { Component } from 'react';

import { CoreContent } from '../../../../components/core';
import { Unit, ExpenseHouseContractState } from '../../../../application/define/index';
import { config } from '../../../../application';
import { canOperateExpenseManageHouseoPeration } from '../../../../application/define/operate';

import RefundDeposit from './components/modal/refundDeposit';
import Search from './search';
import style from './style.css';

class HouseContract extends Component {
  static propTypes = {
    houseContractData: PropTypes.object,
  };

  static defaultProps = {
    houseContractData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      contractId: undefined, // 合同ID

      isShowRefundDeposit: false, // 退还押金弹窗是否显示
      unrefundedPledgeMoney: undefined, // 未退回押金
    };
    this.private = {
      searchParams: {},
    };
  }

  // 默认加载数据
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseHouseContract/fetchHouseContracts' });
  }

  // 搜索
  onSearch = (params) => {
    const { dispatch } = this.props;
    // 保存搜索的参数
    this.private.searchParams = params;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    // 调用搜索
    dispatch({ type: 'expenseHouseContract/fetchHouseContracts', payload: this.private.searchParams });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 续签成功的回调
  onSuccessRenewCallback = (res) => {
    window.location.href = `/#/Expense/Manage/House/Update?id=${res.record._id}&isCreateRenew=1`;
  }

  // 房屋新租失败的回调函数
  onFailureCallback = (res) => {
    message.error(res.zh_message);
  }

  // 房屋新租
  onNewrent = (record) => {
    if (record.id !== undefined) {
      window.location.href = `/#/Expense/Manage/House/Apply?id=${record.id}`;
    }
  }

  // 房屋执行
  onImplement = (record) => {
    const { dispatch } = this.props;
    const params = {
      id: record.id, // 合同id
    };
    dispatch({
      type: 'expenseHouseContract/createInitApplicationOrder',
      payload: {
        params,
        onSuccessCallback: this.onUpdateStart,
      },
    });
  }

  // 删除房屋合同的回调函数
  onDeleteCallback = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseHouseContract/fetchHouseContracts' });
  }

  // 房屋删除按钮
  onDelete = (record) => {
    // 执行中的合同不允许删除
    if (record.state === ExpenseHouseContractState.processing) {
      return message.error('执行中的合同不允许删除');
    }
    const { dispatch } = this.props;
    const params = {
      id: record.id, // 合同id
    };
    dispatch({
      type: 'expenseHouseContract/fetchHouseContractDelete',
      payload: {
        params,
        onSuccessCallback: this.onDeleteCallback,
        onFailureCallback: () => {},
      },
    });
  }

  // 改变刷新的按钮
  onUpdateStart = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'expenseHouseContract/fetchHouseContracts' });
  }

  // 房屋续签
  onRenew = (id) => {
    const { dispatch } = this.props;
    const params = {
      id, // 合同id
    };

    dispatch({
      type: 'expenseHouseContract/fetchHouseRenew',
      payload: {
        params,
        onSuccessCallback: this.onSuccessRenewCallback,
        onFailureCallback: this.onFailureCallback,
      },
    });
  }

  // 退还押金
  onRefundDeposit = (record) => {
    this.setState({
      contractId: record.id,
      unrefundedPledgeMoney: record.unrefundedPledgeMoney,
      isShowRefundDeposit: true,
    });
  }

  // 关闭退还押金弹窗的回调
  onCancleRefundDeposit = () => {
    this.setState({
      isShowRefundDeposit: false,
    });
  }

  // 新建房屋信息跳转
  onHousingInfo = () => {
    window.location.href = '/#/Expense/Manage/House/Create';
  }

  // 列表内名称加逗号显示
  reduceName = (text) => {
    return text.reduce((acc, cur, idx) => {
      if (idx === 0) return cur;
      return `${acc}, ${cur}`;
    }, '');
  }

  // 成员名称显示规则
  renderBizDistrictNames = (text) => {
    if (!text || (typeof (text) === 'object' && Array === text.constructor && text.length === 0)) return '--';
    const bizDistrictNames = this.reduceName(text);
    if (bizDistrictNames.length <= 7) {
      return bizDistrictNames;
    }
    return (
      <Tooltip title={bizDistrictNames}>
        <span>{`${bizDistrictNames.slice(0, 7)}...`}</span>
      </Tooltip>
    );
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch } = this;
    const { dispatch } = this.props;
    return (
      <Search onSearch={onSearch} dispatch={dispatch} />
    );
  }

  // 渲染退还押金弹窗
  renderRefundDeposit = () => {
    const {
      isShowRefundDeposit,
      contractId,
      unrefundedPledgeMoney,
    } = this.state;
    const { dispatch } = this.props;

    return (
      <RefundDeposit
        onCancel={this.onCancleRefundDeposit}
        isShowRefundDeposit={isShowRefundDeposit}
        unrefundedPledgeMoney={unrefundedPledgeMoney}
        contractId={contractId}
        dispatch={dispatch}
      />
    );
  }

  // 渲染表单
  renderTable = () => {
    const { page, limit } = this.private.searchParams;

    // 是否隐藏提报入口
    const { isHideExpenseEntrance = false } = config;

    // 房屋合同列表
    const { houseContractData = {} } = this.props;
    const costOrdersData = dot.get(houseContractData, 'data', []);
    const costOrdersCount = dot.get(houseContractData, 'meta.count', 0);

    const columns = [{
      title: '房屋编号',
      dataIndex: 'houseNo',
      key: 'houseNo',
      fixed: 'left',
      width: 135,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '合同编号',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 135,
      render: text => (
        <div className={style['app-comp-expense-house-contract-list-coding']}>
          {text}
        </div>
      ),
    }, {
      title: '平台',
      dataIndex: 'platformNames',
      key: 'platformNames',
      width: 100,
      render: (text) => {
        if (is.empty(text) || is.not.existy(text) || is.not.array(text)) {
          return '--';
        }
        return text.join(' , ');
      },
    }, {
      title: '供应商',
      dataIndex: 'supplierNames',
      key: 'supplierNames',
      width: 120,
      render: (text) => {
        if (is.empty(text) || is.not.existy(text) || is.not.array(text)) {
          return '--';
        }
        return text.join(' , ');
      },
    }, {
      title: '城市',
      dataIndex: 'cityNames',
      key: 'cityNames',
      width: 100,
      render: (text) => {
        if (is.empty(text) || is.not.existy(text) || is.not.array(text)) {
          return '--';
        }
        return text.join(' , ');
      },
    }, {
      title: '商圈',
      dataIndex: 'bizDistrictNames',
      key: 'bizDistrictNames',
      width: 120,
      render: this.renderBizDistrictNames,
    }, {
      title: '合同租期',
      dataIndex: 'contractStartDate',
      key: 'contractStartDate',
      width: 100,
      render: (text, record) => {
        // 合同结束时间
        const { contractEndDate } = record;
        if (text && contractEndDate) {
          // 后端返回int类型，需要处理时间
          const startTime = `${String(text).slice(0, 4)}-${String(text).slice(4, 6)}-${String(text).slice(6, 8)}`;
          const endTime = `${String(contractEndDate).slice(0, 4)}-${String(contractEndDate).slice(4, 6)}-${String(contractEndDate).slice(6, 8)}`;
          return `${startTime}-${endTime}`;
        }
        return '--';
      },
    }, {
      title: '月租金（元）',
      dataIndex: 'monthMoney',
      key: 'monthMoney',
      width: 100,
      render: text => Unit.exchangePriceToYuan(text),
    }, {
      title: '押金（元）',
      dataIndex: 'pledgeMoney',
      key: 'pledgeMoney',
      width: 100,
      render: (text) => {
        if (text) {
          return Unit.exchangePriceToYuan(text);
        }
        return 0;
      },
    }, {
      title: '未退押金（元）',
      dataIndex: 'unrefundedPledgeMoney',
      key: 'unrefundedPledgeMoney',
      width: 150,
      render: (text) => {
        if (text) {
          return Unit.exchangePriceToYuan(text);
        }
        return 0;
      },
    }, {
      title: '创建人',
      dataIndex: ['creatorInfo', 'name'],
      key: 'creatorInfo.name',
      width: 80,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    }, {
      title: '最新操作人',
      dataIndex: ['operatorInfo', 'name'],
      key: 'operatorInfo.name',
      width: 100,
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 140,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    }, {
      title: '执行状态',
      dataIndex: 'state',
      key: 'state',
      width: 100,
      render: text => ExpenseHouseContractState.description(text),
    }, {
      title: '操作',
      key: 'key',
      fixed: 'right',
      width: 110,
      render: (text, record) => {
        const { state, id, fromContractId, firstRentCycle = [] } = record;

        let operationRefundRent;
        let operationRenew;
        let operationDeposit;
        let operationDelete;
        let operations = [];
        if (canOperateExpenseManageHouseoPeration() === true) {
          operationRefundRent = (
            <a
              className={style['app-comp-expense-house-contract-list-operation']}
              key="5"
              href={`/#/Expense/Manage/House/WithdrawalUpdate?id=${id}`}
            >
              退租
            </a>
          );
          operationRenew = <a className={style['app-comp-expense-house-contract-list-operation']} key="renew" onClick={() => { this.onRenew(id); }}>续签</a>;
          operationDeposit = <a className={style['app-comp-expense-house-contract-list-operation']} key="deposit" onClick={() => { this.onRefundDeposit(record); }}>退押金</a>;
          operationDelete = <a className={style['app-comp-expense-house-contract-list-operation']} key="delete" onClick={() => { this.onDelete(record); }}>删除</a>;
        }


        // 有续租权限 && 房屋合同的续租周期有值;
        const operationContinueRent = canOperateExpenseManageHouseoPeration() === true && firstRentCycle.length === 2
        ? (
          <a
            className={style['app-comp-expense-house-contract-list-operation']}
            key="4"
            href={`/#/Expense/Manage/House/RenewalUpdate?id=${id}`}
          >
          续租
          </a>
          )
        : null;

        // 有断租权限 && 房屋合同的续租周期有值;
        const operationBrokenRent = (<a
          className={style['app-comp-expense-house-contract-list-operation']}
          key="6"
          href={`/#/Expense/Manage/House/BrokRentUpdate?id=${id}`}
        >
          断租
        </a>);

        switch (state) {
          // 草稿
          case ExpenseHouseContractState.pendding:
            if (!record.migrateFlag) {
              (!isHideExpenseEntrance && (
                operations.push(<a className={style['app-comp-expense-house-contract-list-operation']} key="1" onClick={() => { this.onNewrent(record); }}>新租</a>)
              ));
            } else {
              operations.push(<a className={style['app-comp-expense-house-contract-list-operation']} key="2" onClick={() => { this.onImplement(record); }}>执行</a>);
            }
            operations.push(<Link className={style['app-comp-expense-house-contract-list-operation']} key="10" to={{ pathname: '/Expense/Manage/House/Update', query: { id: record.id } }}>编辑</Link>);
            operations.push(operationDelete);
            break;
          // 执行中
          case ExpenseHouseContractState.processing:
            operations.push(<a className={style['app-comp-expense-house-contract-list-operation']} key="7" target="_blank" rel="noopener noreferrer" href={`/#/Expense/Manage/House/Detail?id=${record.id}`}>查看</a>);
            operations.push(<Link className={style['app-comp-expense-house-contract-list-operation']} key="12" to={{ pathname: '/Expense/Manage/House/Update', query: { id: record.id } }}>编辑</Link>);
            (!isHideExpenseEntrance && (operations.push(operationContinueRent)));
            (!isHideExpenseEntrance && (operations.push(operationRefundRent)));
            (!isHideExpenseEntrance && (operations.push(operationBrokenRent)));
            (!isHideExpenseEntrance && (operations.push(operationRenew)));
            (!isHideExpenseEntrance && (operations.push(operationDeposit)));
            operations.push(operationDelete);
            break;
          // 审批中
          case ExpenseHouseContractState.verifying:
            (!isHideExpenseEntrance && (operations.push(<a className={style['app-comp-expense-house-contract-list-operation']} key="8" onClick={() => { this.onNewrent(record); }}>新租</a>)));
            operations.push(<Link className={style['app-comp-expense-house-contract-list-operation']} key="11" to={{ pathname: '/Expense/Manage/House/Update', query: { id: record.id } }}>编辑</Link>);
            operations.push(operationDelete);
            break;
          // 完成
          default: operations.push(<a className={style['app-comp-expense-house-contract-list-operation']} key="9" target="_blank" rel="noopener noreferrer" href={`/#/Expense/Manage/House/Detail?id=${record.id}`}>查看</a>);
        }

        // 草稿状态下的续签合同只有编辑操作(续签的编辑操作)
        if (canOperateExpenseManageHouseoPeration() === true
          && state === ExpenseHouseContractState.pendding
          && fromContractId
        ) {
          operations = [
            <a
              className={style['app-comp-expense-house-contract-list-operation']}
              key="renewExpense"
              href={`/#/Expense/Manage/House/Apply?id=${record.id}`}
            >
              续签
            </a>,
            <Link
              className={style['app-comp-expense-house-contract-list-operation']}
              key="updateRenew"
              to={{ pathname: '/Expense/Manage/House/Update', query: { id: record.id, isCreateRenew: 1 } }}
            >
              编辑
            </Link>,
            <a
              className={style['app-comp-expense-house-contract-list-operation']}
              key="deleteRenew"
              onClick={() => { this.onDelete(record); }}
            >
              删除
            </a>,
          ];

          // 隐藏提报入口
          isHideExpenseEntrance && (operations.shift());
        }

        return <span>{operations}</span>;
      },
    }];

    // 分页配置
    const pagination = {
      showSizeChanger: true, // 可以改变 pageSize
      showQuickJumper: true,  // 可以快速跳转至某页
      pageSize: limit || 30, // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: costOrdersCount,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage, // 切换分页
    };
    if (page) {
      pagination.current = page; // 当前页数
    }
    // 渲染新增房屋信息按钮
    const createButton = isHideExpenseEntrance ? '' : <Button onClick={this.onHousingInfo} className={style['app-comp-expense-house-contract-list-operation-create']}>新增房屋信息</Button>;
    return (
      <CoreContent title="合同列表" titleExt={createButton}>
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={(record, index) => { return index; }}
          scroll={{ x: 1830, y: 400 }}
          dataSource={costOrdersData}
          bordered
        />
      </CoreContent>
    );
  }


  render() {
    return (
      <div>
        {/* 渲染搜索条件及新建按钮 */}
        {this.renderSearch()}
        {/* 渲染表格 */}
        {this.renderTable()}

        {/* 渲染退押金弹窗信息 */}
        {this.renderRefundDeposit()}
      </div>
    );
  }
}

function mapStateToProps({ expenseHouseContract: { houseContractData } }) {
  return { houseContractData };
}

export default connect(mapStateToProps)(HouseContract);
