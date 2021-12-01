/**
 * 服务费查询模块, 数据汇总页面-首页 - Finance/Summary
 */
import React, { Component } from 'react';
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Table, Button, message, Row, Col, Popover, Empty } from 'antd';

import { CoreContent, CoreUploadAmazon } from '../../../../components/core';
import { SalarySummaryState, SalaryUploadState, HouseholdType, Unit, OaApplicationFlowTemplateApproveMode } from '../../../../application/define';
import Operate from '../../../../application/define/operate';
import Search from './search';
import AuditModal from './modal/audit';

import styles from './style/index.less';

class IndexPage extends Component {
  static propTypes = {
    salarySummary: PropTypes.object,
  };

  static defaultProps = {
    salarySummary: {},
  };

  constructor() {
    super();
    this.state = {
      selectedRowKeys: [],              // 选择要操作的数据keys
      isShowModal: false,               // 是否显示弹窗
      summaryId: undefined,             // 数据汇总id
    };
    this.private = {
      searchParams: {
        page: 1,
        limit: 30,
      },   // 搜索的参数
    };
  }

  // 获取初始平台
  onSearchPlatform = (params) => {
    this.private.searchParams = params;
    this.props.dispatch({
      type: 'financeSummaryManage/fetchSalaryStatement',
      payload: this.private.searchParams,
    });
  }


  // 搜索
  onSearch = (params) => {
    // 保存搜索的参数
    this.private.searchParams = params;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    // 调用搜索
    this.props.dispatch({ type: 'financeSummaryManage/fetchSalaryStatement', payload: params });
  }

  // 修改分页
  onChangePage = (page) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    this.onSearch(searchParams);
  }

  // 修改分页条数
  onShowSizeChange = (page, limit) => {
    const { searchParams } = this.private;
    searchParams.page = page;
    searchParams.limit = limit;
    this.onSearch(searchParams);
  }

  // 上传表格 到 七牛 成功的回调
  onUploadSuccess = (key, hash, record) => {
    const payload = { key, id: record._id };
    this.props.dispatch({ type: 'financeSummaryManage/fetchUploadSalaryExcel', payload });
  }

  // 上传表格 到 七牛 失败的回调
  onUploadFailure = (error) => {
    message.error(error);
  }

  // 下载结算单模版
  onDownloadModal = (record) => {
    const payload = {
      id: record._id,
    };
    this.props.dispatch({ type: 'financeSummaryManage/fetchDownLoadSalaryStatementModal', payload });
  }

  // 下载结算单
  onDownloadSalaryStatement = (record) => {
    const payload = {
      id: record._id,
    };
    this.props.dispatch({ type: 'financeSummaryManage/downloadSalaryStatement', payload });
  }

  // 运营模版下载
  onDownloadOperating = (record) => {
    const payload = {
      id: record._id,
    };
    this.props.dispatch({ type: 'financeSummaryManage/fetchDownloadOperatingModal', payload });
  }

  // 运营文件表格上传
  onUploadOperating = (key, hash, record) => {
    const payload = { key, id: record._id };
    this.props.dispatch({ type: 'financeSummaryManage/fetchUploadOperatingExcel', payload });
  }

  // 关闭提审弹窗的回调
  onHideModal = () => {
    this.setState({
      isShowModal: false,
    });
  }

  // 选择类型显示弹窗
  onShowModal = (record) => {
    // 判断状态为已审核过得状态不让显示弹窗
    if (is.not.existy(record._id) || is.empty(record._id)) {
      return message.info('请添加结算汇总单数据');
    }

    this.setState({
      summaryId: record._id, // 汇总id
    });

    // 判断汇总数数据是否有值
    if (is.not.empty(record)) {
      // 传递参数获取提审信息
      const params = {
        summaryItemId: record._id,   // 汇总id
        scope: dot.get(record, 'domain', 0),
        platform: dot.get(record, 'platform_code', undefined),
        supplier: dot.get(record, 'supplier_id', undefined),
        city: dot.get(record, 'city_spelling', undefined),
        onSuccessCallback: this.onSuccessAuditInfo,
      };
      this.props.dispatch({ type: 'financeSummaryManage/fetchSalarySubmitAudit', payload: params });
    }
  }

  // 提审信息成功的回调函数
  onSuccessAuditInfo = (result) => {
    const { summaryId } = this.state;
    // 判断提审信息是否有数据
    if (is.not.empty(result)) {
      // 获取第一个节点信息
      let approveMode;          // 审批规则
      const nodeList = dot.get(result, 'node_list');
      if (is.existy(nodeList) && is.not.empty(nodeList)) {
        approveMode = nodeList[0].approve_mode;
      }
      // 如果审批规则为全部，则不显示弹窗,否则显示弹窗
      if (approveMode === OaApplicationFlowTemplateApproveMode.all) {
        const params = {
          ids: summaryId, // 汇总id
        };
        this.props.dispatch({ type: 'financeSummaryManage/submitSalaryStatement', payload: params });
      } else {
        this.setState({
          isShowModal: true,
        });
      }
    } else {
      message.error('审批流未配置');
    }
  }

  // 渲染搜索条件
  renderSearch = () => {
    const { onSearch } = this;
    return (
      <Search onSearch={onSearch} onSearchPlatform={this.onSearchPlatform} />
    );
  }

  // 渲染提审弹窗
  renderAuditModal = () => {
    const { onHideModal } = this; // 关闭弹窗回调
    const { isShowModal, summaryId } = this.state;
    return <AuditModal onHideModal={onHideModal} isShowModal={isShowModal} summaryId={summaryId} />;
  }

  // 渲染操作内容
  renderRoperationContent = (record) => {
    // 审核中和已审核不允许上传
    const disabled = record.state === SalarySummaryState.success ||
      record.state === SalarySummaryState.processing;
    return (
      <Popover
        placement="left"
        content={(
          <div
            className={styles['app-comp-finance-summary-word-all']}
          >
            <Row>
              {/* 判断是否有下载结算单模版权限 */}
              {Operate.canOperateFinanceManageSummaryModalDownload() ?
                <Col span={12}><Button
                  type="primary"
                  className={styles['app-comp-finance-summary-WHM']}
                  onClick={() => this.onDownloadModal(record)}
                >
                  服务费计算模版<br />下载</Button></Col>
                : ''}
              {/* 判断是否有上传结算单表格权限 */}
              {Operate.canOperateFinanceManageSummaryUpload() ?
                <Col span={12}>{!disabled ?
                  <CoreUploadAmazon
                    domain="salary"
                    namespace={record._id}
                    customContent={<Button
                      type="primary"
                      className={styles['app-comp-finance-summary-WHM']}
                    ><span className={styles['app-comp-finance-summary-color']}>服务费计算文件<br />上传</span></Button>}
                    onSuccess={(key, hash) => { this.onUploadSuccess(key, hash, record); }}
                    onFailure={this.onUploadFailure}
                  /> :
                  <Button
                    disabled={disabled}
                    className={styles['app-comp-finance-summary-WHM']}
                  >
                    <span>服务费计算文件<br />上传</span>
                  </Button>}</Col> : ''}
              {/* 判断是否有下载运营补扣款模版 */}
              {Operate.canOperateFinanceManageOperatingModalDownload() ?
                <Col span={12}><Button
                  type="primary"
                  className={styles['app-comp-finance-summary-WHM']}
                  onClick={() => this.onDownloadOperating(record)}
                >运营补扣款模<br />版下载</Button></Col> : ''}

              {Operate.canOperateFinanceManageOperatingUpload() ?
                <Col span={12}> {!disabled ?
                  <CoreUploadAmazon
                    domain="salary"
                    namespace={record._id}
                    customContent={<Button
                      type="primary"
                      className={styles['app-comp-finance-summary-WHM']}
                    ><span className={styles['app-comp-finance-summary-color']}>运营补扣款文<br />件上传</span></Button>}
                    onSuccess={(key, hash) => { this.onUploadOperating(key, hash, record); }}
                    onFailure={this.onUploadFailure}
                  /> :
                  <Button
                    disabled={disabled}
                    className={styles['app-comp-finance-summary-WHM']}
                  > <span>运营补扣款文<br />件上传</span></Button>
                }</Col> : ''}

              {/* 判断是否有下载结算单权限 */}
              {Operate.canOperateFinanceManageSummaryDownload() ?
                <Col span={12}><Button
                  type="primary"
                  className={styles['app-comp-finance-summary-WHM']}
                  onClick={() => this.onDownloadSalaryStatement(record)}
                >结算单下载</Button></Col>
                : ''}
            </Row>
          </div>
        )}
        trigger="hover"
      >
        <a
          className={styles['app-comp-finance-summary-margin-left-2']}
        >
          下载/上传
        </a>
      </Popover>
    );
  }

  // 渲染饿了么内容列表
  renderElemContent = () => {
    const { salarySummary: dataSource = {} } = this.props;
    const { page, limit } = this.private.searchParams || 1;
    const columns = [{
      title: '序号',
      dataIndex: '序号',
      width: 50,
      fixed: 'left',
      render: (text, record, index) => {
        const num = (limit * (page - 1)) + index + 1;
        return <div>{num}</div>;
      },
    }, {
      title: '主体',
      dataIndex: '主体',
      fixed: 'left',
      width: 173,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['主体'] || '--';
      },
    }, {
      title: '城市',
      dataIndex: '城市',
      fixed: 'left',
      width: 53,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['城市'] || '--';
      },
    }, {
      title: '雇佣主体',
      dataIndex: '雇佣主体',
      width: 80,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['雇佣主体'] || '--';
      },
    }, {
      title: '项目',
      dataIndex: '项目',
      width: 80,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['项目'] || '--';
      },
    }, {
      title: '个户类型',
      dataIndex: 'work_type',
      width: 80,
      render: text => HouseholdType.description(text),
    }, {
      title: '成本中心',
      dataIndex: '成本中心',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['成本中心'] || '--';
      },
    }, {
      title: '人数',
      dataIndex: '人数',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['人数'] >= 0 ? summaryData['人数'] : '--';
      },
    }, {
      title: '招聘费用预测',
      dataIndex: '招聘费用预测',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['招聘费用预测']) || '--';
      },
    }, {
      title: '单量',
      dataIndex: '单量',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['完成单量'] >= 0 ? summaryData['完成单量'] : '--';
      },
    }, {
      title: '服务费调节类补款',
      dataIndex: '薪资调节类补款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['薪资调节类补款']) || '--';
      },
    }, {
      title: '内荐费',
      dataIndex: '内荐费',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['内荐费']) || '--';
      },
    }, {
      title: '押金返还',
      dataIndex: '押金返还',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['押金返还']) || '--';
      },
    }, {
      title: '平台奖励',
      dataIndex: '平台奖励',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['平台奖励']) || '--';
      },
    }, {
      title: '现金内荐费',
      dataIndex: '现金内荐费',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['现金内荐费']) || '--';
      },
    }, {
      title: '兼职工资(应发后)',
      dataIndex: '兼职工资(应发后)',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['兼职工资扣款']) || '--';
      },
    }, {
      title: '临时性结算汇总',
      dataIndex: '临时性结算汇总',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['临时性结算']) || '--';
      },
    }, {
      title: '工伤保险扣款',
      dataIndex: '工伤保险扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['工伤险扣款']) || '--';
      },
    }, {
      title: '平台雇主险扣款',
      dataIndex: '平台雇主险扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['平台雇主险扣款']) || '--';
      },
    }, {
      title: '电动车扣款',
      dataIndex: '电动车扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['电动车扣款']) || '--';
      },
    }, {
      title: '电动车租金扣款',
      dataIndex: '电动车租金扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['电动车租金扣款']) || '--';
      },
    }, {
      title: '电动车押金扣款',
      dataIndex: '电动车押金扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['电动车押金扣款']) || '--';
      },
    }, {
      title: '装备押金',
      dataIndex: '装备押金',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['装备押金扣款']) || '--';
      },
    }, {
      title: '装备扣款',
      dataIndex: '装备扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['装备扣款']) || '--';
      },
    }, {
      title: '应发工资',
      dataIndex: '应发工资',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['应发工资']) || '--';
      },
    }, {
      title: '社保扣款',
      dataIndex: '社保扣款',
      width: 120,
      render: () => 0,
    }, {
      title: '个人所得税',
      dataIndex: '个人所得税',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['个人所得税']) || '--';
      },
    }, {
      title: '实发工资',
      dataIndex: '实发工资',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['实发工资']) || '--';
      },
    }, {
      title: '三方手续费汇总',
      dataIndex: '手续费',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['手续费']) || '--';
      },
    }, {
      title: '综合实发工资',
      dataIndex: '综合实发工资',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['实发工资']) || '--';
      },
    }, {
      title: '文件上传状态(服务费计算)',
      dataIndex: 'calculation_template_state',
      width: 120,
      render: (text) => {
        return SalaryUploadState.description(text);
      },
    }, {
      title: '文件上传状态(运营补扣款)',
      dataIndex: 'adjustment_template_state',
      width: 120,
      render: (text) => {
        return SalaryUploadState.description(text);
      },
    }, {
      title: '审核状态',
      dataIndex: 'state',
      width: 120,
      render: (text) => {
        return SalarySummaryState.description(text);
      },
    }, {
      title: '操作',
      dataIndex: '操作',
      width: 150,
      fixed: 'right',
      render: (text, record) => {
        // 提审操作
        let auditOperation;
        // 根据状态是否显示提审操作
        const auditState = record.state === SalarySummaryState.waiting || record.state === SalarySummaryState.reject;
        // 提审权限
        if (Operate.canOperateFinanceManageSummarySubmit() && auditState) {
          auditOperation = (<a
            onClick={() => this.onShowModal(record)}
            className={styles['app-comp-finance-summary-margin-left']}
          >
            提审
          </a>);
        }
        return (
          <div>
            {auditOperation}
            <a
              href={`/#/Finance/Manage/Summary/Detail/City?id=${record._id}&states=${record.state}&platformCode=${record.platform_code}&canDelay=1`}
              className={styles['app-comp-finance-summary-margin-left']}
            >
              查看
            </a>
            {/* 渲染上传下载操作内容 */}
            {this.renderRoperationContent(record)}
          </div>
        );
      },
    }];
    // 获取表格列表的宽度
    const columnsWidth = columns.map(v => v.width || 0);
    // 计算表格列表的宽度
    const scrollX = columnsWidth.reduce((a, b) => a + b);
    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, '_meta.result_count', 0),  // 数据总条数
    };
    return (
      <CoreContent title="服务费列表">
        {/* 数据 */}
        <Table rowKey={record => record._id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ x: scrollX }} />
      </CoreContent>
    );
  }

  // 渲染美团内容列表
  renderMeituanContent = () => {
    const { salarySummary: dataSource = {} } = this.props;
    const { page, limit } = this.private.searchParams;
    const columns = [{
      title: '序号',
      dataIndex: '序号',
      key: '序号',
      fixed: 'left',
      width: 50,
      render: (text, record, index) => {
        const num = (limit * (page - 1)) + index + 1;
        return <div>{num}</div>;
      },
    }, {
      title: '主体',
      dataIndex: '主体',
      key: '主体',
      fixed: 'left',
      width: 173,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['主体'] || '--';
      },
    }, {
      title: '城市',
      dataIndex: '城市',
      key: '城市',
      fixed: 'left',
      width: 53,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['城市'] || '--';
      },
    }, {
      title: '雇佣主体',
      dataIndex: '雇佣主体',
      key: '雇佣主体',
      width: 80,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['雇佣主体'] || '--';
      },
    }, {
      title: '项目',
      dataIndex: '项目',
      key: '项目',
      width: 80,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['项目'] || '--';
      },
    }, {
      title: '个户类型',
      dataIndex: 'work_type',
      key: 'work_type',
      width: 80,
      render: text => HouseholdType.description(text),
    }, {
      title: '成本中心',
      dataIndex: '成本中心',
      key: '成本中心',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['成本中心'] || '--';
      },
    }, {
      title: '人数',
      dataIndex: '人数',
      key: '人数',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return summaryData['人数'] >= 0 ? summaryData['人数'] : '--';
      },
    }, {
      title: '招聘费用预测',
      dataIndex: '招聘费用预测',
      key: '招聘费用预测',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['招聘费用预测']) || '--';
      },
    }, {
      title: '单量',
      dataIndex: '单量',
      key: '单量',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        const sum = summaryData['完成单量'] + summaryData['外单单量'];
        // 判断是否存在
        return sum >= 0 ? sum : '--';
      },
    }, {
      title: '服务费类调节补款',
      dataIndex: '薪资类调节补款',
      key: '薪资类调节补款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['薪资调节类补款']) || '--';
      },
    }, {
      title: '平台奖励',
      dataIndex: '平台奖励',
      key: '平台奖励',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['平台奖励']) || '--';
      },
    }, {
      title: '内荐费',
      dataIndex: '内荐费',
      key: '内荐费',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['内荐费']) || '--';
      },
    }, {
      title: '押金返还（6月前）',
      dataIndex: '押金返还（6月前）',
      key: '押金返还（6月前）',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['押金返还（6月前）']) || '--';
      },
    }, {
      title: '押金返还（6月后）',
      dataIndex: '押金返还（6月后）',
      key: '押金返还（6月后）',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['押金返还（6月后）']) || '--';
      },
    }, {
      title: '现金内荐费扣款',
      dataIndex: '现金内荐费扣款',
      key: '现金内荐费扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['现金内荐费扣款']) || '--';
      },
    }, {
      title: '兼职工资扣款',
      dataIndex: '兼职工资扣款',
      key: '兼职工资扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['兼职工资扣款']) || '--';
      },
    }, {
      title: '临时性结算扣回',
      dataIndex: '临时性结算扣回',
      key: '临时性结算扣回',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['临时性结算扣回']) || '--';
      },
    }, {
      title: '工伤保险扣款',
      dataIndex: '工伤保险扣款',
      key: '工伤保险扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['工伤险扣款']) || '--';
      },
    }, {
      title: '平台雇主险扣款',
      dataIndex: '平台雇主险扣款',
      key: '平台雇主险扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['平台雇主险扣款']) || '--';
      },
    }, {
      title: '电动车扣款',
      dataIndex: '电动车扣款',
      key: '电动车扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['电动车扣款']) || '--';
      },
    }, {
      title: '电动车租金扣款',
      dataIndex: '电动车租金扣款',
      key: '电动车租金扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['电动车租金扣款']) || '--';
      },
    }, {
      title: '电动车押金扣款',
      dataIndex: '电动车押金扣款',
      key: '电动车押金扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['电动车押金扣款']) || '--';
      },
    }, {
      title: '装备押金扣款',
      dataIndex: '装备押金扣款',
      key: '装备押金扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['装备押金扣款']) || '--';
      },
    }, {
      title: '装备扣款',
      dataIndex: '装备扣款',
      key: '装备扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['装备扣款']) || '--';
      },
    }, {
      title: '应发工资',
      dataIndex: '应发工资',
      key: '应发工资',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['应发工资']) || '--';
      },
    }, {
      title: '社保扣款',
      dataIndex: '社保扣款',
      key: '社保扣款',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['社保扣款(个人）']) || '--';
      },
    }, {
      title: '个人所得税',
      dataIndex: '个人所得税',
      key: '个人所得税',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['个人所得税']) || '--';
      },
    }, {
      title: '手续费',
      dataIndex: '手续费',
      key: '手续费',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['手续费']) || '--';
      },
    }, {
      title: '实发工资',
      dataIndex: '实发工资',
      key: '实发工资',
      width: 120,
      render: (text, record) => {
        const summaryData = record.summary_data || {};
        return Unit.exchangePriceToMathFormat(summaryData['实发工资']) || '--';
      },
    }, {
      title: '文件上传状态(服务费计算)',
      dataIndex: 'calculation_template_state',
      key: 'calculation_template_state',
      width: 120,
      render: (text) => {
        return SalaryUploadState.description(text);
      },
    }, {
      title: '文件上传状态(运营补扣款)',
      dataIndex: 'adjustment_template_state',
      key: 'adjustment_template_state',
      width: 120,
      render: (text) => {
        return SalaryUploadState.description(text);
      },
    }, {
      title: '审核状态',
      dataIndex: 'state',
      key: 'state',
      width: 120,
      render: (text) => {
        return SalarySummaryState.description(text);
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 150,
      fixed: 'right',
      render: (text, record) => {
        // 提审操作
        let auditOperation;
        // 根据状态是否显示提审操作
        const auditState = record.state === SalarySummaryState.waiting || record.state === SalarySummaryState.reject;
        // 提审权限
        if (Operate.canOperateFinanceManageSummarySubmit() && auditState) {
          auditOperation = (<a
            onClick={() => this.onShowModal(record)}
            className={styles['app-comp-finance-summary-margin-left']}
          >
            提审
          </a>);
        }
        return (
          <div>
            {auditOperation}
            <a
              href={`/#/Finance/Manage/Summary/Detail/City?id=${record._id}&states=${record.state}&platformCode=${record.platform_code}&canDelay=1`}
              className={styles['app-comp-finance-summary-margin-left']}
            >
              查看
            </a>

            {/* 渲染上传下载操作内容 */}
            {this.renderRoperationContent(record)}
          </div>
        );
      },
    }];

    // 获取表格列表的宽度
    const columnsWidth = columns.map(v => v.width || 0);
    // 计算表格列表的宽度
    const scrollX = columnsWidth.reduce((a, b) => a + b);
    // 分页
    const pagination = {
      // 每次点击查询, 重置页码为1
      current: page,
      defaultPageSize: 30,          // 默认数据条数
      onChange: this.onChangePage,  // 切换分页
      showQuickJumper: true,        // 显示快速跳转
      showSizeChanger: true,        // 显示分页
      onShowSizeChange: this.onShowSizeChange,              // 展示每页数据数
      showTotal: total => `总共${total}条`,                  // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dot.get(dataSource, '_meta.result_count', 0),  // 数据总条数
    };
    return (
      <CoreContent title="服务费列表">
        {/* 数据 */}
        <Table rowKey={record => record._id} dataSource={dataSource.data} columns={columns} pagination={pagination} bordered scroll={{ x: scrollX }} />
      </CoreContent>
    );
  }

  // 渲染平台表格
  renderIsPlatformTable = () => {
    const { platform } = this.private.searchParams;
    // 渲染平台对应的表格
    if (platform === 'elem') {
      // 渲染饿了么内容列表
      return this.renderElemContent();
    }

    if (platform === 'meituan') {
      // 渲染美团内容列表
      return this.renderMeituanContent();
    }
    return <Empty />;
  }

  render() {
    const { renderSearch, renderIsPlatformTable, renderAuditModal } = this;
    return (
      <div>
        {/* 渲染搜索框 */}
        {renderSearch()}

        {/* 渲染平台表格 */}
        {renderIsPlatformTable()}

        {/* 渲染提审弹窗 */}
        {renderAuditModal()}
      </div>
    );
  }
}

function mapStateToProps({ financeSummaryManage: { salarySummary } }) {
  return { salarySummary };
}

export default connect(mapStateToProps)(IndexPage);
