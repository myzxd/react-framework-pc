/**
 * 任务列表的组建
 * */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import moment from 'moment'; import React, { Component } from 'react'; import { connect } from 'dva';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Table, Tooltip } from 'antd';
import { CoreContent } from '../../../components/core';
import { ExpenseCostCenterType } from '../../../application/define';

import style from './style.css';

// 任务文件的类型定义
const taskFileType = {
  salaryRecords: 'salary_collect',
  employeeRecords: 'download_staff',
  finaceRecords: 'biz_data_report',
  fundManageRecords: 'deduction_and_payment_template',
  salaryComputeTaskRecords: 'salary_compute_task',
  payrollAdjustmentDataTemplate: 'payroll_adjustment_data_template',
  asynTaskActionSalaryStatement: 'asyn_task_action_salary_statement',
  salaryComputeTaskDataTemplate: 'salary_compute_task_data_template',
  oaCostOrderTaskDataTemplate: 'oa_cost_order_export_asyn_task',
  payrollStatementTaskDataTemplate: 'payroll_statement_task_data_template',
  supplyDistribution: 'distribution',
  supplyItem: 'item',
  supplyPurchase: 'purchase',
  supplyDeduction: 'deduction',
  payrollTaskDownloadData: 'payroll_task_download_data',
  purchaseTemplate: 'purchase_template',
  distributionTemplate: 'distribution_template',
  deductionTemplate: 'deduction_template',
  itemTemplate: 'item_template',
  calculationTemplate: 'material_data_calculation_export',
  deductionExport: 'deduction_total_export',
  deductionTotal: 'deduction_total',
  paymentOrderLineDownload: 'payment_order_line_download',
  paymentOrderLineUpload: 'payment_order_line_upload',
  oaLoanOrderExportAsynTask: 'oa_loan_order_export_asyn_task',
  oaRepaymentOrderExportAsynTask: 'oa_repayment_order_export_asyn_task',
  oaTravelApplyOrderExportAsynTask: 'oa_travel_apply_order_export_asyn_task',
  costBudgetDownload: 'cost_budget_download',
  costBudgetUpload: 'cost_budget_upload',
  payrollCalculationTemplateUploadTarget: 'payroll_calculation_template_upload_target',
  payrollAdjustmentTemplateUploadTarget: 'payroll_adjustment_template_upload_target',
  payrollCalculationTemplateDownloadTarget: 'payroll_calculation_template_download_target',
  payrollAdjustmentTemplateDownloadTarge: 'payroll_adjustment_template_download_target',
  ownerExport: 'owner_export',
  noOwnerDistrictExport: 'no_owner_district_export',
  coachAccountExport: 'coach_account_export',
  noCoachAccountDistrictExport: 'no_coach_account_district_export',
  downloadStaffContractTeam: 'download_staff_contract_team',
  houseContractAllocation: 'house_contract_allocation',
  oaLeaveOrderExportAsynTask: 'oa_leave_order_export_asyn_task',
  oaExtraWorkOrderExportAsynTask: 'oa_extra_work_order_export_asyn_task',
  downloadIndividualStatistics: 'download_individual_statistics',
  downloadDepartment: 'download_department',
  exportSelaTarget: 'export_sela_target',
  exportCertTarget: 'export_cert_target',
  exportBankTarget: 'export_bank_target',
  exportFirmTarget: 'export_firm_target',
  exportPactTarget: 'export_pact_target',
  oaPaymentBillExportAsynTask: 'oa_payment_bill_export_asyn_task',
  walletFlowExportAsynTask: 'wallet_flow_export_asyn_task',
  qoaCostOrderExportAsynTask: 'qoa_cost_order_export_asyn_task',
  description(rawValue) {
    switch (rawValue) {
      case this.salaryRecords: return '服务费';
      case this.employeeRecords: return '员工列表';
      case this.finaceRecords: return '收支数据';
      case this.fundManageRecords: return '扣补款模版';
      case this.salaryComputeTaskRecords: return '服务费试算';
      case this.payrollAdjustmentDataTemplate: return '扣补款模版';
      case this.asynTaskActionSalaryStatement: return '服务费对账单';
      case this.salaryComputeTaskDataTemplate: return '服务费试算模板';
      case this.oaCostOrderTaskDataTemplate: return '记录明细';
      case this.payrollStatementTaskDataTemplate: return '结算单模板';
      case this.supplyDistribution: return '分发明细上传';
      case this.supplyItem: return '物资设置上传';
      case this.supplyPurchase: return '采购入库上传';
      case this.supplyDeduction: return '扣款明细上传';
      case this.distributionTemplate: return '分发明细模板';
      case this.itemTemplate: return '物资设置模板';
      case this.purchaseTemplate: return '采购入库模板';
      case this.deductionTemplate: return '扣款明细模板';
      case this.payrollTaskDownloadData: return '结算单模版';
      case this.calculationTemplate: return '物资台账导出';
      case this.deductionExport: return '扣款汇总导出';
      case this.deductionTotal: return '扣款汇总上传';
      case this.paymentOrderLineDownload: return '付款单明细模版';
      case this.paymentOrderLineUpload: return '付款单明细异常';
      case this.oaLoanOrderExportAsynTask: return '借款管理模版';
      case this.oaRepaymentOrderExportAsynTask: return '还款管理模版';
      case this.oaTravelApplyOrderExportAsynTask: return '出差管理';
      case this.costBudgetDownload: return '费用预算下载模板';
      case this.costBudgetUpload: return '费用预算上传';
      case this.payrollCalculationTemplateUploadTarget: return '服务费计算上传';
      case this.payrollAdjustmentTemplateUploadTarget: return '运营补扣款上传';
      case this.payrollCalculationTemplateDownloadTarget: return '服务费计算模版';
      case this.payrollAdjustmentTemplateDownloadTarge: return '运营补扣款模版';
      case this.ownerExport: return '业主列表';
      case this.noOwnerDistrictExport: return '无业主商圈';
      case this.coachAccountExport: return '私教列表';
      case this.noCoachAccountDistrictExport: return '无私教商圈';
      case this.downloadStaffContractTeam: return '劳动者导出';
      case this.houseContractAllocation: return '房屋台账导出';
      case this.oaLeaveOrderExportAsynTask: return '请假导出';
      case this.oaExtraWorkOrderExportAsynTask: return '加班导出';
      case this.downloadIndividualStatistics: return '个户注册数据';
      case this.downloadDepartment: return '部门导出';
      case this.exportPactTarget: return '共享登记合同导出';
      case this.exportFirmTarget: return '共享登记公司导出';
      case this.exportBankTarget: return '共享登记银行账户导出';
      case this.exportCertTarget: return '共享登记证照导出';
      case this.exportSelaTarget: return '共享登记印章导出';
      case this.oaPaymentBillExportAsynTask: return '支付账单导出报表';
      case this.walletFlowExportAsynTask: return '钱包明细导出报表';
      case this.qoaCostOrderExportAsynTask: return 'code费用记录明细导出';
      default: return '未知';
    }
  },
};

// 任务的状态
const taskState = {
  pendding: 1,
  process: 50,
  success: 100,
  transmission: 90,
  failure: -100,
  description(rawValue) {
    switch (rawValue) {
      case this.pendding: return '待处理';
      case this.process: return '处理中';
      case this.success: return '处理完成';
      case this.failure: return '处理失败';
      case this.transmission: return '数据错误';
      default: return '未知';
    }
  },
};

class TaskRecordsWidget extends Component {
  static propTypes = {
    downloadRecords: PropTypes.object,
  };

  static defaultProps = {
    downloadRecords: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,     // 页码，初始值1
    };
  }

  // 修改分页
  onChangePage = (page) => {
    this.setState({
      page,
    });
    this.props.dispatch({ type: 'SystemDownloadModal/fetchDownloadRecords', payload: { page } });
  }
  // 查看跳到试算详情页
  onSalaryTask = (record) => {
    window.location.href = `/#/Finance/Rules/Calculate/Detail?calculateId=${record.spec.task_id}`;
    const courierParams = {
      taskId: record.spec.task_id,
      type: ExpenseCostCenterType.knight,
    };
    const districtsParams = {
      taskId: record.spec.task_id,
      type: ExpenseCostCenterType.district,
    };
    const summaryParams = {
      taskId: record.spec.task_id,
    };
    // 刷新试算汇总数据
    this.props.dispatch({ type: 'financePlan/fetchSalaryPlanSummaryData', payload: summaryParams });
    // 刷新骑士维度明细列表
    this.props.dispatch({ type: 'financePlan/fetchCourierDetailData', payload: courierParams });
    // 刷新商圈明细列表
    this.props.dispatch({ type: 'financePlan/fetchDistrictsDetailData', payload: districtsParams });
  }
  // 渲染内容
  render() {
    const { page } = this.state;
    const { downloadRecords: dataSource = {} } = this.props;
    const actionType = 4; // 操作类型
    const columns = [{
      title: '任务类型',
      dataIndex: 'target',
      key: 'target',
      width: 100,
      render: text => taskFileType.description(text),
    }, {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: text => moment(text).format('YYYY-MM-DD HH:mm'),
    }, {
      title: '更新时间',
      dataIndex: 'update_at',
      key: 'update_at',
      width: 160,
      render: text => moment(text).format('YYYY-MM-DD HH:mm'),
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 90,
      render: text => taskState.description(text),
    }, {
      title: '操作',
      dataIndex: 'url',
      key: 'url',
      render: (text, record) => {
        if (taskFileType.description(record.target) === taskFileType.description(taskFileType.salaryComputeTaskRecords)) {
          return <a onClick={() => { this.onSalaryTask(record); }}>查看</a>;
        } else if (record.state === taskState.success && record.action === actionType) { // 当状态完成操作类型为4的时候不可操作
          return <Tooltip title={`任务id: ${record._id}`}><InfoCircleOutlined /></Tooltip>;
        } else if (record.state === taskState.success || record.state === taskState.transmission) { // 成功状态下，可下载文件
          const type = taskFileType.description(record.target);
          const time = moment(record.created_at).format('YYYY-MM-DD HH:mm');
          const filename = `${type}-${time}`;
          return <a download={filename} href={record.url}>下载</a>;
        }
        // 其他状态下，返回任务id
        return <Tooltip title={`任务id: ${record._id}`}><InfoCircleOutlined /></Tooltip>;
      },
    }];

    // 分页
    const pagination = {
      current: page,                        // 当前页码
      defaultPageSize: 10,                  // 默认数据条数
      onChange: this.onChangePage,          // 切换分页
      total: dot.get(dataSource, '_meta.result_count', 0), // 数据总条数
      showQuickJumper: true,                // 显示快速跳转
    };

    return (
      <CoreContent className={style['app-layout-widgets-task']}>
        {/* 数据 */}
        <Table rowKey={record => record._id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ y: 200 }} />
      </CoreContent>
    );
  }
}

function mapStateToProps({ SystemDownloadModal: { downloadRecords } }) {
  return { downloadRecords };
}

export default connect(mapStateToProps)(TaskRecordsWidget);
