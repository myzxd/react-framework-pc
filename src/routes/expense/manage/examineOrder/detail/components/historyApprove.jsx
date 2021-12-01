/**
 * 审批单详情页面 - 历史审批单详情
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import {
  ExpenseCostOrderBelong,
  ExpenseCostCenterType,
  Unit,
  ExpenseExamineOrderProcessState,
  InvoiceAjustAction,
  ExpenseTeamType,
  OaApplicationOrderType,
  ExpenseCostOrderType,
} from '../../../../../../application/define';
import { authorize } from '../../../../../../application';
import { DeprecatedCoreForm, CoreFinder } from '../../../../../../components/core';
import Invoice from './invoice';
import InvoiceHeader from '../../../template/components/invoiceHeader';
import PayeeTable from './payeeTable';
import styles from './style.less';

const { CoreFinderList } = CoreFinder;

class Refund extends Component {

  // get costTargetId by cost center
  getCostTargetId = (costCenter, value) => {
    if (costCenter === ExpenseCostCenterType.person) return value.staffInfo.identity_card_id;
    if (costCenter === ExpenseCostCenterType.team) return value.teamId;
    if (costCenter === ExpenseCostCenterType.asset) return value.bizDistrictId;

    if (costCenter === ExpenseCostCenterType.project) return value.platformCode;
    if (costCenter === ExpenseCostCenterType.headquarter) return value.supplierId;
    if (costCenter === ExpenseCostCenterType.city) return value.cityCode;
    if (costCenter === ExpenseCostCenterType.district) return value.bizDistrictId;
    if (costCenter === ExpenseCostCenterType.knight) return value.bizDistrictId;
  }

   // 预览组件
  renderCorePreview = (value, filename) => {
    if (Array.isArray(value) && dot.get(value, '0')) {
      const data = value.map((item, index) => {
        return { key: filename[index], url: item };
      });
      return (
        <CoreFinderList data={data} />
      );
    }
    return '--';
  };


  // 渲染成本分摊
  renderCostShare = (historyApproval) => {
    // 成本分摊子项目
    const costItems = dot.get(historyApproval, 'costAllocationList', []) || [];
    return (
      <div>
        <Row>
          <Col span={24}>{ExpenseCostOrderBelong.description(dot.get(historyApproval, 'allocationMode'))}</Col>
          <Col span={24}>
            {
              costItems.map((item, key) => {
                return this.renderCostShareItems(item, key);
              })
            }
          </Col>
        </Row>
      </div>
    );
  }

  // 渲染成本分摊子项目
  renderCostShareItems = (item, key) => {
    // 获取月汇总金额
    const {
      examineOrderDetail,
      historyApproval,
      costOrderAmountSummary,
      costOrderSubmitSummary,
      isExternal = false,
    } = this.props;
    const costOrderDetail = historyApproval;
    // 获取平台、供应商、城市、商圈
    const {
      platformName,
      supplierName,
      cityName,
      bizDistrictName,
      teamId,
      teamType,
      teamName,
      staffInfo = {},
      bizDistrictId,
      cityCode,
      supplierId,
    } = item;
    // 获取科目id、成本中心归属类型
    const { costAccountingId, costCenterType, costAccountingInfo = {} } = costOrderDetail;

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
    if (costCenterType === ExpenseCostCenterType.person) {
      if (is.existy(staffInfo) && is.not.empty(staffInfo)) {
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
    }

    // 团队
    if (costCenterType === ExpenseCostCenterType.team) {
      if (is.existy(teamId) && is.not.empty(teamId) && is.existy(teamType) && is.not.empty(teamType)) {
        name = `${name} - ${ExpenseTeamType.description(Number(teamType))} - ${teamName} - ${teamId}`;
      }
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
      submitAt = moment().format('YYYY-MM-DD');
    }
    // 当月已付款费用合计的命名空间
    const namespace = `${costAccountingId}-${costTargetId}-${bookMonth}`;
    // 当月已提报费用合计的命名空间
    const submitNamespace = `${costAccountingId}-${costTargetId}-${submitAt}-${bizDistrictId}-${cityCode}-${supplierId}`;
    // 当月已提报费用金额
    const submitMoney = dot.get(costOrderSubmitSummary, `${submitNamespace}.amountMoney`, 0);

    // 当月已付款费用合计
    const totalMoney = dot.get(costOrderAmountSummary, `${namespace}.money`, 0);

    // 费用单科目成本归属为总部时，不显示费用合计
    const formItems = costAccountType === ExpenseCostCenterType.headquarters
      ? []
      : [{
        label: '当月已提报费用合计',
        span: 9,
        layout: { labelCol: { span: 15 }, wrapperCol: { span: 9 } },
        form: `${Unit.exchangePriceCentToMathFormat(submitMoney)}元`,
      },
      {
        label: '当月已付款费用合计',
        span: 9,
        layout: { labelCol: { span: 15 }, wrapperCol: { span: 9 } },
        form: `${Unit.exchangePriceCentToMathFormat(totalMoney)}元`,
      }];

    // 判断分摊金额是否存在，存在则渲染
    if (item.money) {
      formItems.unshift({
        label: '分摊金额',
        span: 6,
        layout: { labelCol: { span: 13 }, wrapperCol: { span: 11 } },
        form: `${Unit.exchangePriceToYuan(dot.get(item, 'money', '--'))}元`,
      });
    }
    return (
      <Row key={key}>
        <Col span={10}>{name}</Col>
        {
          isExternal ? '' : (
            <Col span={14}>
              <DeprecatedCoreForm items={formItems} />
            </Col>
          )
        }
      </Row>
    );
  }

  // 渲染金额调整
  renderUpdateCostRecord = () => {
    const { examineOrderDetail, examineDetail, historyApproval, approvalKey, originalCostOrder } = this.props;

    const costOrderDetail = historyApproval;

    // 费用单类型
    const { type } = costOrderDetail;
    // 红冲单，金额color
    const colorStyle = type === ExpenseCostOrderType.redPunch ? { color: 'red' } : {};

    // 过滤掉后的红冲退款
    const dataSource = dot.get(historyApproval, 'refCostOrderInfoList', []).filter(item => item.total_money < 0);

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
      applicationOrderType, // 审批类型
      platformCodes, // 平台
      pluginExtraMeta = {}, // 外部审批单meta
    } = examineOrderDetail;

    // 是否为外部审批单
    let isPluginOrder = false;
    if (is.existy(pluginExtraMeta) && is.not.empty(pluginExtraMeta) && pluginExtraMeta.is_plugin_order) {
      isPluginOrder = pluginExtraMeta.is_plugin_order;
    }

    // 当前节点信息
    const currentNodeInfo = nodeList.filter(item => item.id === currentFlowNode)[0] || {};

    const {
      canUpdateCostRecord = undefined, // 当前节点金额是否调整
      costUpdateRule, // 当前节点金额调整规则
    } = currentNodeInfo;

    // 数据处于可以编辑的状态下 && 当前的操作人在操作人列表中 && 当元费用单为空的话就可以调控,
    let totalMoney;
    // 费用判断过滤的数据是否为空
    if (is.not.empty(dataSource) && is.existy(dataSource)) {
      dataSource.map((item) => {
        if (item.type === InvoiceAjustAction.invoiceAdjust) {
          totalMoney = dot.get(item, 'total_money', undefined);
        } else {
          totalMoney = dot.get(costOrderDetail, 'totalMoney', undefined);
        }
      });
    } else {
      totalMoney = dot.get(costOrderDetail, 'totalMoney', undefined);
    }

    const { orderId } = this.props;
    // 当前节点金额是否调整,外部审批单下房屋模块不能金额调整
    if (canUpdateCostRecord === true
      && currentOperateAccounts.indexOf(authorize.account.id) !== -1
      && state === ExpenseExamineOrderProcessState.processing
      && !is.existy(originalCostOrder) && applicationOrderType !== OaApplicationOrderType.housing
    ) {
      return (
        <div>
          <a
            className={styles['app-comp-expense-cost-order-item-update-cost-money']}
            key="update"
            href={`/#/Expense/Manage/Template/Update?orderId=${orderId}&recordId=${costOrderDetail.id}&template=${template}&isUpdateRule=true&costUpdateRule=${costUpdateRule}&approvalKey=${approvalKey}&applicationOrderType=${applicationOrderType}&platform=${platformCodes[0]}&isPluginOrder=${isPluginOrder}`}
          >
            {totalMoney !== undefined ? Unit.exchangePriceToYuan(totalMoney) : '--'}
          </a>
          <span>元</span>
        </div>
      );
    }
    return (
      is.not.empty(dataSource) && is.existy(dataSource) && totalMoney !== undefined
        ? <span style={{ color: 'red' }}>{`${Unit.exchangePriceToYuan(totalMoney)}元`}</span>
      : <span><span style={{ ...colorStyle }}>{`${Unit.exchangePriceToYuan(totalMoney)}`}</span>元</span>
    );
  }

  // 发票
  renderInvoice = () => {
    const { historyApproval = {}, examineOrderDetail = {}, examineDetail = {} } = this.props;
    if (Object.keys(historyApproval).length <= 0) return;

    const { applicationOrderType } = examineOrderDetail;

    // 费用单类型
    const { type } = historyApproval;
    // 费用申请 && 差旅报销显示发票
    if ((applicationOrderType === OaApplicationOrderType.cost
      || applicationOrderType === OaApplicationOrderType.travel)
      && type === ExpenseCostOrderType.normal
    ) return <Invoice detail={historyApproval} examineOrderDetail={examineOrderDetail} examineDetail={examineDetail} />;
    return null;
  }

  // 渲染退款信息
  render = () => {
    const { historyApproval, examineOrderDetail, isExternal } = this.props;
    const {
      costCenterType = undefined, // 成本归属
      bizExtraHouseContractInfo = {}, // 房屋合同信息
      costAccountingId = undefined, // 科目id
      pledgeMoneyToRentMoney = undefined,
      type, // 费用单类型
      isBook,
      costAccountingInfo = {},
      totalMoney = 0,
      totalTaxAmountAmount = 0,
      platformCodes = [],
    } = historyApproval;

    // 科目成本中心
    const costAccountType = costAccountingInfo && Object.keys(costAccountingInfo).length > 0 ? costAccountingInfo.costCenterType : undefined;

    const {
      applicationOrderType = undefined, // 审批单类型
      rentCycleEndAt, // 当前租金期间结束时间
      rentCycleStartAt, // 当前租金期间开始时间
      pluginExtraMeta = {}, // 外部审批单meta
    } = examineOrderDetail;

    const {
      rentAccountingId = undefined, // 押金科目id
    } = bizExtraHouseContractInfo;
    let rentMoney = '';
    // 判断合同最后一天和租金期间结束日期是否相等
    if (pledgeMoneyToRentMoney > 0) {
      rentMoney = {
        label: '押金转租金',
        form: pledgeMoneyToRentMoney ?
          `${Unit.exchangePriceToYuan(pledgeMoneyToRentMoney)}`
          : '--',
      };
    }
    // 租金期间
    let rentCycleForm = '';
    if (applicationOrderType === OaApplicationOrderType.housing
      && rentAccountingId
      && rentAccountingId === costAccountingId) {
      !isExternal && (rentCycleForm = {
        label: '租金期间',
        form: rentCycleStartAt && rentCycleEndAt ?
          `${moment(String(rentCycleStartAt)).format('YYYY.MM.DD')}-${moment(String(rentCycleEndAt)).format('YYYY.MM.DD')}`
          : '--',
      });

      // 外部审批单
      (isExternal && pluginExtraMeta && Object.keys(pluginExtraMeta).length > 0) && (rentCycleForm = {
        label: '租金期间',
        form: pluginExtraMeta.rent_cycle_start_at && pluginExtraMeta.rent_cycle_end_at ?
          `${moment(String(pluginExtraMeta.rent_cycle_start_at)).format('YYYY.MM.DD')}-${moment(String(pluginExtraMeta.rent_cycle_end_at)).format('YYYY.MM.DD')}`
          : '--',
      });
    }
    const formHistoryApproval = this.renderUpdateCostRecord(historyApproval);
    let costMoney = [{
      label: '费用金额',
      form: formHistoryApproval,
    }];
    if (applicationOrderType === OaApplicationOrderType.cost || applicationOrderType === OaApplicationOrderType.travel) {
      costMoney = [
        {
          label: '付款金额',
          form: formHistoryApproval,
        },
        {
          label: '费用金额',
          form: `${Unit.exchangePriceToYuan(totalMoney - totalTaxAmountAmount)}元`,
        },
      ];
    }
    // 基本信息布局
    const basicInfo = [
      ...costMoney,
      {
        label: '科目',
        form: `${dot.get(historyApproval, 'costAccountingInfo.name', '--')}(${dot.get(historyApproval, 'costAccountingCode', '--')})`,
      }, {
        label: '成本归属',
        form: costCenterType ? ExpenseCostCenterType.description(Number(costCenterType)) : '--',
      },
      rentCycleForm,
      rentMoney,
    ];

    if (applicationOrderType === OaApplicationOrderType.cost || applicationOrderType === OaApplicationOrderType.travel) {
      if (applicationOrderType === OaApplicationOrderType.cost || applicationOrderType === OaApplicationOrderType.travel) {
        basicInfo.splice(2, 0, {
          label: '是否红冲',
          form: type === ExpenseCostOrderType.redPunch ? '是' : '否',
        });
      } else {
        basicInfo.splice(1, 0, {
          label: '是否红冲',
          form: type === ExpenseCostOrderType.redPunch ? '是' : '否',
        });
      }
      basicInfo.splice(5, 0, {
        label: '是否可记账',
        form: isBook ? '是' : '否',
      });
    }

    // 成本分摊子项目布局
    const costShare = [
      {
        label: '成本分摊',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: this.renderCostShare(historyApproval),
      },
    ];
    // 发票抬头与备注与上传附件布局
    const noteAndAttachment = [
      {
        label: '发票抬头',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: costAccountType === ExpenseCostCenterType.headquarters ?
        (<InvoiceHeader
          invoiceVal={dot.get(historyApproval, 'invoiceTitle', '--')}
          platform={platformCodes[0]}
          isDetail
        />) : dot.get(historyApproval, 'invoiceTitle', '--'),
      },
      {
        label: '备注',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: dot.get(historyApproval, 'note'),
      }, {
        label: '上传附件',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: this.renderCorePreview(dot.get(historyApproval, 'attachmentPrivateUrls', []), dot.get(historyApproval, 'attachments', [])),
      },
    ];

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <div>
        {/* 渲染基本信息 */}
        <DeprecatedCoreForm items={basicInfo} cols={4} layout={layout} />
        {/* 渲染成本分摊子项目信息 */}
        <DeprecatedCoreForm items={costShare} cols={1} />
        {/* 渲染备注与附件  */}
        <DeprecatedCoreForm items={noteAndAttachment} cols={1} />
        {/* 渲染收款人信息 */}
        <PayeeTable
          dataSource={dot.get(historyApproval, 'payeeList', [])}
          money={dot.get(historyApproval, 'totalMoney', undefined)}
        />
        {this.renderInvoice()}
      </div>
    );
  }
}

export default Refund;
