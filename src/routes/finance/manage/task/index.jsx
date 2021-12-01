/**
 * 结算任务设置 Finance/Manage/Task
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { Table, Popconfirm } from 'antd';
import { connect } from 'dva';

import CreatePaydayTask from './create';

import { HouseholdType, SalaryDeductSupplementState, FinanceSalaryCycleType } from '../../../../application/define';
import Operate from '../../../../application/define/operate';
import styles from './style/index.less';

class PaydayTask extends Component {
  static propTypes = {
    payrollPlanData: PropTypes.object,
  };

  static defaultProps = {
    payrollPlanData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowEditModal: false,                                                     // 编辑弹窗是否开启
      itemInfo: {
        id: undefined,               // 每一条数据Id
        payrollCycleType: undefined, // 结算周期
        cycleInterval: undefined,    // 计算执行日
        workType: undefined,         // 工作性质
        computeDelayDays: undefined, // 延期日期
        platformName: undefined,     // 平台
        cityCode: undefined,         // 城市
        supplierId: undefined,       // 商圈
        initExecuteDate: undefined,  // 首次开始时间
      },
    };
    this.private = {
      countParams: {},
    };
  }
  // 默认加载数据
  componentDidMount() {
    this.props.dispatch({ type: 'financeTask/fetchPayrollPlanList' });
  }

  // 编辑更新数据
  onUpdate = (record) => {
    this.setState({
      isShowEditModal: true,
      itemInfo: {
        id: record.id,                         // 每一条数据Id
        payrollCycleType: record.payrollCycleType,       // 结算周期
        cycleInterval: record.cycleInterval,   // 计算执行日
        workType: record.workType,                // 工作性质
        computeDelayDays: record.pdatedAt,     // 延期日期
        platformName: record.platformCode,     // 平台
        cityCode: record.cityCode,             // 城市
        supplierId: record.supplierId,         // 商圈
        initExecuteDate: record.createdAt,     // 首次开始时间
      },
    });
  }
  // 关闭弹窗的回调
  onHideModal = () => {
    this.setState({
      isShowEditModal: false,
    });
  }
  // 更新启用的数据
  onUpdateDisableData = () => {
    this.props.dispatch({ type: 'financeTask/fetchPayrollPlanList' });
  }
  // 禁用按钮操作
  onDisable = (record) => {
    const params = {
      id: record.id,                          // 数据Id
      state: SalaryDeductSupplementState.on, // 状态
    };
    this.props.dispatch({
      type: 'financeTask/updatePayrollPlanState',
      payload: {
        params,
        onSuccessCallback: this.onUpdateDisableData,
      },
    });
  }
  // 更新启用的数据
  onUpdateEnableData = () => {
    this.props.dispatch({ type: 'financeTask/fetchPayrollPlanList' });
  }
  // 启用按钮操作
  onEnable = (record) => {
    const params = {
      id: record.id,  // 数据Id
      state: SalaryDeductSupplementState.off, // 状态
    };
    this.props.dispatch({
      type: 'financeTask/updatePayrollPlanState',
      payload: {
        params,
        onSuccessCallback: this.onUpdateEnableData,
      },
    });
  }
  // 改变条数
  onChangeCount = (params) => {
    // 保存搜索的参数
    this.private.countParams = params;
    if (!this.private.countParams.page) {
      this.private.countParams.page = 1;
    }
    if (!this.private.countParams.limit) {
      this.private.countParams.limit = 30;
    }
    // 调用搜索
    this.props.dispatch({ type: 'financeTask/fetchPayrollPlanList', payload: this.private.countParams });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.private.countParams.page = page;
    this.private.countParams.limit = limit;
    this.onChangeCount(this.private.countParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.private.countParams.page = page;
    this.private.countParams.limit = limit;
    this.onChangeCount(this.private.countParams);
  }
  // 渲染列表内容
  renderContent = () => {
    const { page } = this.private.countParams;

    const { payrollPlanData = {} } = this.props;
    const planListData = dot.get(payrollPlanData, 'data', []);
    const payrollPlanCount = dot.get(payrollPlanData, 'meta.count', 0);

    // tabel列表
    const columns = [{
      title: '代码',
      dataIndex: 'id',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '平台',
      dataIndex: 'platformName',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '供应商',
      dataIndex: 'supplierName',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '城市',
      dataIndex: 'cityName',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '个户类型',
      dataIndex: 'workType',
      render: (text) => {
        return HouseholdType.description(text);
      },
    }, {
      title: '结算周期',
      dataIndex: 'cycleInterval',
      render: (text, record) => {
        return (<span>{FinanceSalaryCycleType.description(record.payrollCycleType)} / {text}</span>);
      },
    }, {
      title: '计算执行日',
      dataIndex: 'computeDelayDays',
      render: (text, record) => {
        return (<span>{FinanceSalaryCycleType.description(record.payrollCycleType)} + {text}</span>);
      },
    }, {
      title: '首次开始月份',
      dataIndex: 'initExecuteDate',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '创建日期',
      dataIndex: 'createdAt',
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD') : '--';
      },
    }, {
      title: '最后操作日期',
      dataIndex: 'updatedAt',
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD') : '--';
      },
    }, {
      title: '创建者',
      dataIndex: ['creatorInfo', 'name'],
    }, {
      title: '最后操作者',
      dataIndex: ['operatorInfo', 'name'],
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '操作',
      dataIndex: 'state',
      render: (text, record) => {
        const content = [];
        const contents = (
          <div className={styles['app-comp-finance-task-wdith230']}>
            <h4>你确定要禁用该结算任务?</h4>
            <p className={styles['app-comp-finance-task-color']} >备注：禁用后请及时创建新的结算任务,否则影响结算单生成!</p>
          </div>
         );
        if (record.state === SalaryDeductSupplementState.on) {
          content.push(
            <Popconfirm placement="top" title={contents} okText="确认" key="1" onConfirm={() => { this.onEnable(record); }} cancelText="取消">
              {!Operate.canOperateFinanceManageTaskDisable() || <a className={styles['app-comp-finance-task-color-Ml']}>禁用</a>}
            </Popconfirm>);
        } else {
          content.push(
            <Popconfirm placement="top" title="你确定要启用该结算任务?" okText="确认" key="2" onConfirm={() => { this.onDisable(record); }} cancelText="取消">
              {!Operate.canOperateFinanceManageTaskEnable() || <a className={styles['app-comp-finance-task-color-Ml']}>启用</a>}
            </Popconfirm>);
        }
        return (<span>
          {content}
        </span>);
      },
    }];

    // 分页配置
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 30,                     // 默认下拉页数
      onShowSizeChange: this.onShowSizeChange, // 展示每页数据
      total: payrollPlanCount,
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onChangePage,  // 切换分页
    };
    if (page) {
      pagination.current = page; // 当前页数
    }
    return (
      <div>
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={(record, index) => { return record.id || index; }}
          scroll={{ x: 1000 }}
          dataSource={planListData}
          bordered
        />
      </div>
    );
  }

  // 渲染创建发新设置
  renderCreatePaydayTask = () => {
    const { onSearch } = this;
    return (
      <CreatePaydayTask onSearch={onSearch} />
    );
  }

  render() {
    return (
      <div>
        {/* 创建结算任务*/}
        {this.renderCreatePaydayTask()}

        {/* 列表内容渲染 */}
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ financeTask: { payrollPlanData } }) {
  return { payrollPlanData };
}
export default connect(mapStateToProps)(PaydayTask);
