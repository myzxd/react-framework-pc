/**
 * 费用管理 - 付款审批 - 差旅详情
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DeprecatedCoreForm, CoreContent, CoreFinder } from '../../../../../components/core';
import { authorize } from '../../../../../application';
import {
  Unit,
  ExpenseCostOrderBelong,
  ExpenseCostCenterType,
  ExpenseExamineOrderProcessState,
  ExpenseTeamType,
  OaApplicationOrderType,
  ExpenseCostOrderType,
} from '../../../../../application/define';
import Invoice from './components/invoice.jsx';
import InvoiceHeader from '../../template/components/invoiceHeader';
import PayeeTable from './components/payeeTable';

import styles from './style.less';

const { CoreFinderList } = CoreFinder;

class TravelInfo extends Component {

  static propTypes = {
    recordId: PropTypes.string, // 还款单id
    examineDetail: PropTypes.object, // 审批流详情
    examineOrderDetail: PropTypes.object,       // 审批单详情(用于获取付款总金额)
    pluginCostOrder: PropTypes.object,  // 外部审批单-费用单详情
    isExternal: PropTypes.bool, // 外部审批单标识
  }

  static defaultProps = {
    recordId: '', // 还款单id
    examineDetail: {}, // 审批流详情
    examineOrderDetail: {},       // 审批单详情(用于获取付款总金额)
    pluginCostOrder: {},
    isExternal: false,
  }

  componentDidMount() {
    // 还款单id
    const { recordId, examineOrderDetail } = this.props;
    if (dot.get(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', false)) return;
    this.props.dispatch({
      type: 'expenseCostOrder/fetchNamespaceCostOrderDetail',
      payload: {
        recordId,
        namespace: recordId,
        onSuccessCallback: res => this.fetchCostOrderAmountSummay(res),
      },
    });
  }

  // get costTargetId by cost center
  getCostTargetId = (costCenter, value) => {
    if (costCenter === ExpenseCostCenterType.person) return value.staffInfo.identity_card_id;
    if (costCenter === ExpenseCostCenterType.team) return value.teamId;
    if (costCenter === ExpenseCostCenterType.asset) return value.district;

    if (costCenter === ExpenseCostCenterType.project) return value.platformCode;
    if (costCenter === ExpenseCostCenterType.headquarter) return value.supplierId;
    if (costCenter === ExpenseCostCenterType.city) return value.cityCode;
    if (costCenter === ExpenseCostCenterType.district) return value.bizDistrictId;
    if (costCenter === ExpenseCostCenterType.knight) return value.bizDistrictId;
  }

  // 获取费用订单的汇总
  fetchCostOrderAmountSummay = (res) => {
    const {
      costAllocationList,       // 成本费用记录分摊清单
      costCenterType,           // 成本中心归属类型名称
      costAccountingId,         // 费用科目ID
      applicationOrderId,       // 归属审批单ID
    } = res;
    // 审批单第一次提报时间
    const { submitAt, platformCodes } = this.props.examineOrderDetail;

    // 差旅报销单归属总部不调用接口
    if (platformCodes && Array.isArray(platformCodes) && platformCodes[0] === 'zongbu') return;

    // 根据成本费用记录分摊列表获取当月已付款费用合计
    costAllocationList.forEach((v) => {
      const {
        identity_card_id: staffId,
      } = v.staffInfo;
      // 已付款金额参数
      const payload = {
        costCenter: costCenterType,
        costTargetId: this.getCostTargetId(costCenterType, v),
        subjectId: costAccountingId,
        applicationOrderId,
        submitAt,
      };
      // 定义提报金额参数
      const params = {
        costCenter: costCenterType,
        applicationOrderId,               // 审批单id
        accountingId: costAccountingId,   // 科目id
        costTargetId: this.getCostTargetId(costCenterType, v),                     // 成本归属id
        platformCode: v.platformCode,           // 平台
        supplierId: v.supplierId,               // 供应商
        cityCode: v.cityCode,                   // 城市
        bizDistrictId: v.bizDistrictId,          // 商圈
        submitAt,
        teamId: v.teamId,
        staffId,
        assetsId: v.assetsId,          // 资产
      };
      // 获取已付款金额
      this.props.dispatch({ type: 'expenseCostOrder/fetchAmountSummary', payload });
      // 获取提报金额
      this.props.dispatch({ type: 'expenseCostOrder/fetchSubmitSummary', payload: params });
    });
  }

  // 出差实际时间
  renderActualDate = (record) => {
    const doneDate = moment(dot.get(record, 'actual_done_at', undefined)).format('YYYY.MM.DD HH:00');
    const startDate = moment(dot.get(record, 'actual_start_at', undefined)).format('YYYY.MM.DD HH:00');
    const date = dot.get(record, 'actual_done_at', undefined) && dot.get(record, 'actual_start_at', undefined) ? `${startDate} - ${doneDate}` : '--';
    return (<span>{date}</span>);
  }

  // 预计出差时间
  renderExpectDate = (record) => {
    const doneDate = moment(dot.get(record, 'expect_done_at', undefined)).format('YYYY.MM.DD HH:00');
    const startDate = moment(dot.get(record, 'expect_start_at', undefined)).format('YYYY.MM.DD HH:00');
    const date = dot.get(record, 'expect_start_at', undefined) && dot.get(record, 'expect_done_at', undefined) ? `${startDate} - ${doneDate}` : '--';
    return (<span>{date}</span>);
  }

  // 出发地
  renderDeparture = (record) => {
    const destination = dot.get(record, 'destination', {});
    let address;
    if (dot.get(record, 'destination.province_name', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}`;
    }
    if (dot.get(record, 'destination.city_name', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}${dot.get(record, 'destination.city_name', undefined) || ''}`;
    }
    if (dot.get(record, 'destination.area_name', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}${dot.get(record, 'destination.city_name', undefined) || ''}${dot.get(record, 'destination.area_name', undefined) || ''}`;
    }
    if (dot.get(record, 'destination.detailed_address', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}${dot.get(record, 'destination.city_name', undefined) || ''}${dot.get(record, 'destination.area_name', undefined) || ''}${dot.get(record, 'destination.detailed_address', undefined)}`;
    }
    if (is.not.empty(destination)) {
      return (<span>{address}</span>);
    } else {
      return '--';
    }
  }

  // 出差目的地
  renderDestination = (record) => {
    const departure = dot.get(record, 'departure', {});
    let address;
    if (dot.get(record, 'departure.province_name', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}`;
    }
    if (dot.get(record, 'departure.city_name', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}${dot.get(record, 'departure.city_name', undefined) || ''}`;
    }
    if (dot.get(record, 'departure.area_name', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}${dot.get(record, 'departure.city_name', undefined) || ''}${dot.get(record, 'departure.area_name', undefined) || ''}`;
    }
    if (dot.get(record, 'departure.detailed_address', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}${dot.get(record, 'departure.city_name', undefined) || ''}${dot.get(record, 'departure.area_name', undefined) || ''}${dot.get(record, 'departure.detailed_address', undefined)}`;
    }
    if (is.not.empty(departure)) {
      return (<span>{address}</span>);
    } else {
      return '--';
    }
  }

  // 出差人信息
  renderBusinessInfo = () => {
    const {
      recordId,
      examineOrderDetail,
      namespaceCostOrderDetail,
      pluginCostOrder,
      isExternal,
     } = this.props;
    const costOrderDetail = dot.get(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', false)
                            ? pluginCostOrder
                            : namespaceCostOrderDetail[recordId] || {};

    // 费用单类型
    const { type } = costOrderDetail;

    // 外部审批单 && 红冲单不显示
    if (type === ExpenseCostOrderType.redPunch && isExternal) return;

    let travelId = '--';

    dot.get(costOrderDetail.bizExtraTravelApplyOrderInfo, '_id', undefined) && (
      travelId = <a href={`/#/Expense/TravelApplication/Detail?id=${costOrderDetail.bizExtraTravelApplyOrderId}`} target="_blank" rel="noopener noreferrer" >{dot.get(costOrderDetail.bizExtraTravelApplyOrderInfo, '_id', undefined)}</a>
    );

    // 外部审批单不能跳转
    isExternal && (travelId = dot.get(costOrderDetail.bizExtraTravelApplyOrderInfo, '_id', '--'));

    const formItems = [
      {
        label: '出差申请单号',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: travelId,
      },
      {
        label: '实际出差人',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(costOrderDetail.bizExtraTravelApplyOrderInfo, 'apply_user_name', undefined) || '--',
      },
      {
        label: '预计出差时间',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        form: this.renderExpectDate(costOrderDetail.bizExtraTravelApplyOrderInfo),
      },
      {
        label: '出差地点',
        span: 9,
        layout: { labelCol: { span: 7 }, wrapperCol: { span: 17 } },
        form: <span>{this.renderDestination(costOrderDetail.bizExtraTravelApplyOrderInfo)} - {this.renderDeparture(costOrderDetail.bizExtraTravelApplyOrderInfo)}</span>,
      },
      {
        label: '实际出差时间',
        span: 8,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 18 } },
        form: this.renderActualDate(costOrderDetail.bizExtraTravelApplyOrderInfo),
      },
      {
        label: '出差天数',
        span: 7,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 14 } },
        form: `${dot.get(costOrderDetail.bizExtraTravelApplyOrderInfo, 'actual_apply_days', 0)} ${'天'}`,
      },
    ];
    return (
      <CoreContent title="出差信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  }

   // 预览组件
  renderCorePreview = (value, fileNames) => {
    if (Array.isArray(value) && dot.get(value, '0')) {
      const datas = value.map((item, index) => {
        return { key: fileNames[index], url: item };
      });
      return (
        <CoreFinderList data={datas} enableTakeLatest={false} />
      );
    }
    return '--';
  };

  // 渲染金额调整
  renderUpdateCostRecord = (record) => {
    const { examineOrderDetail, recordId, examineDetail } = this.props;
    const { namespaceCostOrderDetail = [] } = this.props;
    const costOrderDetail = namespaceCostOrderDetail[recordId] || {};
    const orderId = dot.get(this.props, 'location.query.orderId', '');
    // 默认的模版类型
    const {
      nodeList = [], // 审批流节点信息
      extraUiOptions, // 审批模板类型
    } = examineDetail;

    // 默认的模版类型
    const { form_template: template } = extraUiOptions;

    const {
      currentFlowNode = undefined, // 当前节点id
      currentOperateAccounts = [], // 当前可操作人列表
      state, // 审批单状态
    } = examineOrderDetail;
    const isPluginOrder = dot.get(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', false);
    // 当前节点信息
    const currentNodeInfo = nodeList.filter(item => item.id === currentFlowNode)[0] || {};

    const {
      canUpdateCostRecord = false, // 当前节点金额是否调整
      costUpdateRule, // 当前节点金额调整规则
    } = currentNodeInfo;

    // 获取当前key
    const { approvalKey } = this.props.location.query;

    // 费用单类型
    const { type } = costOrderDetail;

    const colorStyle = type === ExpenseCostOrderType.redPunch ? { color: 'red' } : {};

    // 费用金额判断是否为空
    const totalMoney = dot.get(record, 'totalMoney', undefined);
    // 数据处于可以编辑的状态下 && 当前的操作人在操作人列表中,外部审批单暂时不能编辑
    if (canUpdateCostRecord === true &&
      currentOperateAccounts.indexOf(authorize.account.id) !== -1 &&
      state === ExpenseExamineOrderProcessState.processing &&
      isPluginOrder !== true) {
      return (
        <div>
          <a
            className={styles['app-comp-expense-travel-update-money']}
            key="update"
            href={`/#/Expense/Manage/Template/Update?orderId=${orderId}&recordId=${recordId}&template=${template}&isUpdateRule=true&costUpdateRule=${costUpdateRule}&approvalKey=${approvalKey}&isPluginOrder=${isPluginOrder}`}
          >
            {totalMoney !== undefined ? Unit.exchangePriceToYuan(totalMoney) : '--'}
          </a>
          <span>元</span>
        </div>
      );
    }
    return totalMoney !== undefined ? (
      <span><span style={{ ...colorStyle }}>{`${Unit.exchangePriceToYuan(totalMoney)}`}</span>元</span>
    ) : '--';
  }

  // 费用信息
  renderCostInfo = () => {
    const {
      recordId,
      namespaceCostOrderDetail,
      examineOrderDetail,
      pluginCostOrder,
    } = this.props;
    const costOrderDetail = dot.get(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', false)
                            ? pluginCostOrder
                            : namespaceCostOrderDetail[recordId] || {};
    const { type, isBook, totalMoney = 0, totalTaxAmountAmount = 0 } = costOrderDetail;
    const formItems = [
      {
        label: '付款金额',
        form: this.renderUpdateCostRecord(costOrderDetail),
      },
      {
        label: '费用金额',
        form: `${Unit.exchangePriceToYuan(totalMoney - totalTaxAmountAmount)}元`,
      },
      {
        label: '是否开票',
        form: dot.get(costOrderDetail, 'invoiceFlag') ? '是' : '否',
      },
      {
        label: '是否红冲',
        form: type === ExpenseCostOrderType.redPunch ? '是' : '否',
      },
      {
        label: '是否可记账',
        form: isBook ? '是' : '否',
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="费用信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 差旅费用明细
  renderTravelCostInfo = () => {
    const {
      recordId,
      namespaceCostOrderDetail,
      examineOrderDetail,
      pluginCostOrder,
      isExternal,
    } = this.props;
    const costOrderDetail = dot.get(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', false)
                            ? pluginCostOrder
      : namespaceCostOrderDetail[recordId] || {};

    // 费用单类型
    const { type } = costOrderDetail;

    // 外部审批单 && 红冲单不显示
    if (type === ExpenseCostOrderType.redPunch && isExternal) return;

    const formItems = [
      {
        label: '补助(元)',
        form: dot.get(costOrderDetail.bizExtraData, 'subsidy_fee', 0) ? Unit.exchangePriceToYuan(dot.get(costOrderDetail.bizExtraData, 'subsidy_fee', 0)) : 0,
      },
      {
        label: '住宿(元)',
        form: dot.get(costOrderDetail.bizExtraData, 'stay_fee', 0) ? Unit.exchangePriceToYuan(dot.get(costOrderDetail.bizExtraData, 'stay_fee', 0)) : 0,
      },
      {
        label: '往返交通费(元)',
        form: dot.get(costOrderDetail.bizExtraData, 'transport_fee', 0) ? Unit.exchangePriceToYuan(dot.get(costOrderDetail.bizExtraData, 'transport_fee', 0)) : 0,
      }, {
        label: '市内交通费(元)',
        form: dot.get(costOrderDetail.bizExtraData, 'urban_transport_fee', 0) ? Unit.exchangePriceToYuan(dot.get(costOrderDetail.bizExtraData, 'urban_transport_fee', 0)) : 0,
      }, {
        label: '其它(元)',
        form: dot.get(costOrderDetail.bizExtraData, 'other_fee', 0) ? Unit.exchangePriceToYuan(dot.get(costOrderDetail.bizExtraData, 'other_fee', 0)) : 0,
      },
    ];
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="差旅费用明细">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染成本分摊
  renderCostShare = (costOrder) => {
    // 成本分摊子项目
    const costItems = dot.get(costOrder, 'costAllocationList', []) || [];
    return (
      <div>
        <Row>
          <Col span={24}>{ExpenseCostOrderBelong.description(dot.get(costOrder, 'allocationMode'))}</Col>
          <Col span={24}>
            {
              costItems.map((item, key) => {
                return this.renderCostShareItems(item, key, costOrder);
              })
            }
          </Col>
        </Row>
      </div>
    );
  }

  // 渲染成本分摊子项目
  renderCostShareItems = (item, key, costOrder) => {
    const { examineOrderDetail, isExternal } = this.props;
    // 获取平台、供应商、城市、商圈
    const {
      platformName,
      supplierName,
      cityName,
      bizDistrictName,
      bizDistrictId,
      cityCode,
      supplierId,
      staffInfo,
      teamId,
      teamType,
      teamName,
    } = item;
    // 获取月汇总金额
    const { costOrderAmountSummary, costOrderSubmitSummary } = this.props;
    // 获取科目id、成本中心归属类型
    const { costAccountingId, costCenterType, costAccountingInfo = {} } = costOrder;

    // 科目成本中心
    const costAccountType = costAccountingInfo && Object.keys(costAccountingInfo).length > 0 ? costAccountingInfo.costCenterType : undefined;

    // 获取归属对象id
    const costTargetId = this.getCostTargetId(costCenterType, item);
    // 定义成本分摊平台、供应商、城市、商圈
    let name;
    // 如果平台存在，则显示平台
    if (is.existy(platformName) && is.not.empty(platformName)) {
      name = `${platformName}`;
    }
    // 如果供应商存在，则显示平台、供应商
    if (is.existy(supplierName) && is.not.empty(supplierName)) {
      name = `${platformName} - ${supplierName}`;
    }
    // 如果城市存在，则显示平台、供应商、城市
    if (is.existy(cityName) && is.not.empty(cityName)) {
      name = `${platformName} - ${supplierName} - ${cityName}`;
    }
    // 如果商圈存在，则显示平台、供应商、城市、商圈
    if (is.existy(bizDistrictName) && is.not.empty(bizDistrictName)) {
      name = `${platformName} - ${supplierName} - ${cityName} - ${bizDistrictName}`;
    }

    // 个人
    if (is.existy(staffInfo) && is.not.empty(staffInfo) && costCenterType === ExpenseCostCenterType.person) {
      const {
        identity_card_id: staffId,
        name: staffName,
      } = staffInfo;
      if (teamName) {
        name = name ? `${name} - ${teamName} - ${staffName}(${staffId})` : `${teamName} - ${staffName}(${staffId})`;
      } else {
        name = name ? `${name} - ${staffName}(${staffId})` : `${staffName}(${staffId})`;
      }
    }

    // 团队
    if (is.existy(teamId) && is.not.empty(teamId) && is.existy(teamType) && is.not.empty(teamType)
      && costCenterType === ExpenseCostCenterType.team
      && costAccountType !== ExpenseCostCenterType.headquarters
    ) {
      name = `${name} - ${ExpenseTeamType.description(Number(teamType))} - ${teamName} - ${teamId}`;
    }

    // 科目成本中心为总部
    if (costAccountType === ExpenseCostCenterType.headquarters && costCenterType === ExpenseCostCenterType.team) {
      name = `${teamName} - ${teamId}`;
    }

    // 审批单第一次提报时间
    const firstCreatedTime = dot.get(examineOrderDetail, 'submitAt', undefined);

    // 获取月份
    let bookMonth = '';
    let submitAt = '';
    // 判断提报时间是否存在
    if (firstCreatedTime) {
      bookMonth = moment(firstCreatedTime).format('YYYYMM');
      submitAt = moment(firstCreatedTime).format('YYYY-MM-DD');
    } else {
      bookMonth = moment().format('YYYYMM');
      submitAt = moment().format('YYYY-MM');
    }
    // 当月已付款费用合计的命名空间
    const namespace = `${costAccountingId}-${costTargetId}-${bookMonth}`;
    // 当月已提报费用合计的命名空间
    const submitNamespace = `${costAccountingId}-${costTargetId}-${submitAt}-${bizDistrictId}-${cityCode}-${supplierId}`;
    // 当月已提报费用金额
    const submitMoney = dot.get(costOrderSubmitSummary, `${submitNamespace}.amountMoney`, 0);

    // 当月已付款费用合计
    const totalMoney = dot.get(costOrderAmountSummary, `${namespace}.money`, 0);
    const formItems = dot.get(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', false) || costAccountType === ExpenseCostCenterType.headquarters
                      ? []
                      : [{
                        label: '当月已提报费用合计',
                        span: 9,
                        layout: { labelCol: { span: 15 }, wrapperCol: { span: 9 } },
                        form: <p
                          className={styles['app-comp-expense-travel-submit-money-td']}
                        >
                          {Unit.exchangePriceCentToMathFormat(submitMoney)}元
                          </p>,
                      },
                      {
                        label: '当月已付款费用合计',
                        span: 9,
                        layout: { labelCol: { span: 15 }, wrapperCol: { span: 9 } },
                        form: <p
                          className={styles['app-comp-expense-travel-total-money-td']}
                        >
                          {Unit.exchangePriceCentToMathFormat(totalMoney)}元
                            </p>,
                      }];

    // 判断分摊金额是否存在，存在则渲染
    if (item.money) {
      formItems.unshift({
        label: '分摊金额',
        span: 6,
        layout: { labelCol: { span: 13 }, wrapperCol: { span: 11 } },
        form: (<p
          className={styles['app-comp-expense-travel-money-item-td']}
        >
          {Unit.exchangePriceToYuan(dot.get(item, 'money', '--'))}元
        </p>),
      });
    }

    return (
      <Row key={key}>
        <Col span={8}>{name}</Col>
        {
          isExternal || costAccountType === ExpenseCostOrderType.headquarters ? '' : (
            <Col span={16}>
              <DeprecatedCoreForm items={formItems} />
            </Col>
          )
        }
      </Row>
    );
  }

  // 项目信息
  renderProjectInfo = () => {
    const {
      recordId,
      namespaceCostOrderDetail,
      examineOrderDetail,
      pluginCostOrder,
    } = this.props;
    const costOrderDetail = dot.get(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', false)
                            ? pluginCostOrder
                            : namespaceCostOrderDetail[recordId] || {};
    const {
      costCenterType = undefined, // 成本归属
      costAccountingInfo = {},
      platformCodes = [],
    } = costOrderDetail;

    // 科目成本中心
    const costAccountType = costAccountingInfo && Object.keys(costAccountingInfo).length > 0 ? costAccountingInfo.costCenterType : undefined;

    const formItems = [
      {
        label: '科目',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: `${dot.get(costOrderDetail, 'costAccountingInfo.name', '--')}(${dot.get(costOrderDetail, 'costAccountingInfo.accountingCode', '--')})`,
      },
      {
        label: '费用分组',
        form: dot.get(costOrderDetail, 'costGroupName'),
      },
      {
        label: '成本归属',
        form: costCenterType ? ExpenseCostCenterType.description(Number(costCenterType)) : '--',
      },
    ];

    // 成本分摊子项目布局
    const costShare = [
      {
        label: '成本分摊',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: this.renderCostShare(costOrderDetail),
      },
    ];
    // 发票抬头与备注与上传附件布局
    const noteAndAttachment = [
      {
        label: '发票抬头',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: costAccountType === ExpenseCostCenterType.headquarters
              ? (<InvoiceHeader
                invoiceVal={dot.get(costOrderDetail, 'invoiceTitle', '--')}
                platform={platformCodes[0]}
                isDetail
              />)
              : dot.get(costOrderDetail, 'invoiceTitle', '--'),
      },
      {
        label: '备注',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: <span className="noteWrap">{dot.get(costOrderDetail, 'note', '--')}</span>,
      }, {
        label: '上传附件',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: this.renderCorePreview(dot.get(costOrderDetail, 'attachmentPrivateUrls', []), dot.get(costOrderDetail, 'attachments', [])),
      },
    ];
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 17 } };
    return (
      <CoreContent title="项目信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        {/* 渲染成本分摊子项目信息 */}
        <DeprecatedCoreForm items={costShare} cols={1} />
        {/* 渲染备注与附件  */}
        <DeprecatedCoreForm items={noteAndAttachment} cols={1} />
      </CoreContent>
    );
  }

  // 收款信息
  renderCollectionInfo = () => {
    const {
      recordId,
      namespaceCostOrderDetail,
      examineOrderDetail,
      pluginCostOrder,
      isExternal,
    } = this.props;
    const costOrderDetail = dot.get(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', false)
                            ? pluginCostOrder
                            : namespaceCostOrderDetail[recordId] || {};

    // 费用单类型
    const { type } = costOrderDetail;

    // 外部审批单 && 红冲单不显示
    if (type === ExpenseCostOrderType.redPunch && isExternal) return;
    // 渲染收款人信息
    return (
      <PayeeTable
        dataSource={dot.get(costOrderDetail, 'payeeList', [])}
        money={dot.get(costOrderDetail, 'totalMoney', undefined)}
      />
    );
  }

  // 发票
  renderInvoice = () => {
    const {
      namespaceCostOrderDetail = {},
      recordId,
      examineOrderDetail = {},
      examineDetail = {},
      pluginCostOrder,
      isExternal,
    } = this.props;
    const costOrderDetail = namespaceCostOrderDetail[recordId];
    if ((!costOrderDetail || Object.keys(costOrderDetail).length <= 0) && (!pluginCostOrder || Object.keys(pluginCostOrder).length <= 0)) return;

    const { applicationOrderType } = examineOrderDetail;

    // 费用单类型
    let type;
    if (isExternal) type = pluginCostOrder.type;
    if (!isExternal) type = costOrderDetail.type;

    // 费用申请 && 差旅报销显示发票
    if ((applicationOrderType === OaApplicationOrderType.cost
      || applicationOrderType === OaApplicationOrderType.travel)
      && type === ExpenseCostOrderType.normal
    ) return <Invoice detail={isExternal ? pluginCostOrder : costOrderDetail} examineOrderDetail={examineOrderDetail} examineDetail={examineDetail} />;
    return null;
  }

  render = () => {
    const {
      namespaceCostOrderDetail,
      examineOrderDetail,
      pluginCostOrder,
     } = this.props;
    // 数据为空，返回null
    if (Object.keys(namespaceCostOrderDetail).length === 0 && !dot.get(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', false)) {
      return <div />;
    }
    if (Object.keys(pluginCostOrder).length === 0 && dot.get(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', false)) {
      return <div />;
    }

    return (
      <div>
        {/* 渲染出差信息 */}
        {this.renderBusinessInfo()}

        {/* 费用信息 */}
        {this.renderCostInfo()}

        {/* 差旅费用明细 */}
        {this.renderTravelCostInfo()}

        {/* 项目信息 */}
        {this.renderProjectInfo()}

        {/* 收款人信息 */}
        {this.renderCollectionInfo()}

        {/* 发票信息 */}
        {this.renderInvoice()}
      </div>
    );
  }
}

function mapStateToProps({
  expenseCostOrder: {
    costOrderAmountSummary, // 月汇总金额
    costOrderSubmitSummary, // 已提报金额
    namespaceCostOrderDetail, // 费用单详情
  },
}) {
  return {
    costOrderAmountSummary, // 月汇总金额
    costOrderSubmitSummary, // 已提报金额
    namespaceCostOrderDetail, // 费用单详情
  };
}
export default connect(mapStateToProps)(TravelInfo);
