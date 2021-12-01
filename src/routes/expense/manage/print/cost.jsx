/**
 * 审批单打印的打印区域费用单组件 Expense/Manage/Print/Cost
 */
import is from 'is_js';
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import RefoundComponent from './refound';
import InvoiceAdjustComponent from './invoiceAdjust';
import InvoiceHeader from '../template/components/invoiceHeader';
import {
  ExpenseCostOrderBelong,
  Unit,
  InvoiceAjustAction,
  ExpenseCostCenterType,
  ExpenseCostOrderState,
  ExpenseTeamType,
  OaApplicationOrderType,
  ExpenseInvoiceType,
  ExpenseInvoiceTaxRate,
  ExpenseCostOrderType,
} from '../../../../application/define';

// TODO: 所有的参数，初始化的时候要声明，否则根本不知道组件中到底有多少参数。 @常志闯
class Cost extends Component {
  static propTypes = {
    costOrder: PropTypes.array,
    examineOrderDetail: PropTypes.object,
    originalCostOrder: PropTypes.array,
  }

  static defaultProps = {
    costOrder: [],
    examineOrderDetail: {},
    originalCostOrder: [],
  }

  // 默认加载数据
  componentDidMount() {
    const { costOrder } = this.props;
    if (is.not.empty(costOrder)) {
      // 获取审批单号
      const applicationOrderId = costOrder[0].application_order_id;
      // 触发旧的审批单接口详情
      this.props.dispatch({
        type: 'expenseCostOrder/fetchOriginalCostOrder',
        payload: {
          orderId: applicationOrderId,
        },
      });
      // 触发旧的审批单接口详情
      this.props.dispatch({
        type: 'expenseExamineOrder/fetchExamineOrderDetail',
        payload: {
          id: applicationOrderId,
          flag: true,
          onFailureCallback: this.onFailureCallback,
          onSuccessCallback: this.onSuccessCallbackExamineOrderDetail,
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { originalCostOrder } = this.props;
    if (prevProps.originalCostOrder.length !== originalCostOrder.length) {
      // 触发新的审批单接口详情
      this.props.dispatch({
        type: 'expenseCostOrder/fetchNamespaceCostOrderDetail',
        payload: {
          recordId: originalCostOrder[0].id,
          namespace: originalCostOrder[0].id,
          onSuccessCallback: res => this.fetchCostOrderAmountSummay(res),
        },
      });
    }
  }

  // 成功回调
  onSuccessCallbackExamineOrderDetail = (result) => {
    // 关联的出差单id
    const costOrderId = dot.get(result, 'business_travel_order_id');
    const flowId = dot.get(result, 'flow_id');
    if (is.existy(costOrderId) && is.not.empty(costOrderId)) {
      const param = {
        costOrderId,
      };
      this.props.dispatch({ type: 'expenseExamineOrder/fetchBusinessTrip', payload: param });
    }

    if (flowId) {
      this.props.dispatch({ type: 'expenseExamineFlow/fetchExamineDetail', payload: { id: flowId } });
    }
  }

  // 失败回调
  onFailureCallback = (result) => {
    // 判断是否有查看这条审批单的权限, 没有跳404页面
    if (result.zh_message === '您没有查看这条审批单的权限') {
      window.location.href = '/#/404';
    }
  }
  // 获取已付款金额
  getAmountSummary = (itemChild) => {
    const value = dot.get(itemChild, 'costOrderAmountSummary.money', 0);
    return Unit.exchangePriceCentToMathFormat(value);
  }
  // 获取提报金额
  getSubmitSummary = (itemChild) => {
    const value = dot.get(itemChild, 'costOrderSubmitSummary.amountMoney', 0);
    return Unit.exchangePriceCentToMathFormat(value);
  }
  // 获取红冲退款的已付款金额
  getOriginalCostOrderAmountSummary = (costOrderAmountSummary) => {
    let obj;
    let value;
    for (const key of Object.keys(costOrderAmountSummary)) {
      obj = costOrderAmountSummary[key];
      value = obj.money;
    }
    return Unit.exchangePriceCentToMathFormat(value);
  }
  // 获取红冲退款的已提报金额
  getOriginalcostOrderSubmitSummary = (costOrderSubmitSummary) => {
    let obj;
    let value;
    for (const key of Object.keys(costOrderSubmitSummary)) {
      obj = costOrderSubmitSummary[key];
      value = obj.amountMoney;
    }
    return Unit.exchangePriceCentToMathFormat(value);
  }
  // 获取平台、供应商、城市、商圈
  getName = (itemChild, costCenterType, costAccountType) => {
    const { platform_name: platformName,
      supplier_name: supplierName,
      city_name: cityName,
      biz_district_name: bizDistrictName,
      team_name: teamName = undefined,
      team_id: teamId = undefined,
      team_type: teamType = undefined,
      staff_info: staffInfo = {},
    } = itemChild;
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

    // 团队
    if (costCenterType === ExpenseCostCenterType.team) {
      if (teamType && teamId) {
        name = `${name} - ${ExpenseTeamType.description(Number(teamType))} - ${teamName} - ${teamId}`;
      }
    }

    // 科目成本中心为总部
    if (costAccountType === ExpenseCostCenterType.headquarters && costCenterType === ExpenseCostCenterType.team) {
      name = `${teamName} - ${teamId}`;
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

    return name;
  }

  // 获取平台、供应商、城市、商圈
  getOriginalCostOrderName = (itemChild) => {
    const {
      platformName,
      supplierName,
      cityName,
      bizDistrictName,
      teamId,
      teamType,
      teamName,
      staffInfo = {},
    } = itemChild;
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
    // 团队
    if (is.existy(teamId) && is.not.empty(teamId) && is.existy(teamType) && is.not.empty(teamType)) {
      name = `${name} - ${ExpenseTeamType.description(Number(teamType))} - ${teamName}(${teamId})`;
    }

    // 个人
    if (is.existy(staffInfo) && is.not.empty(staffInfo)) {
      const {
        identity_card_id: staffId,
        name: staffName,
      } = staffInfo;
      name = `${name} - ${staffName}(${staffId})`;
    }
    return name;
  }

  // 获取平台、供应商、城市、商圈成本归属id
  getCostTargetId = (costCenter, value) => {
    // 平台
    if (costCenter === ExpenseCostCenterType.project) return value.platformCode;
    // 供应商
    if (costCenter === ExpenseCostCenterType.headquarter) return value.supplierId;
    // 城市
    if (costCenter === ExpenseCostCenterType.city) return value.cityCode;
    // 商圈
    if (costCenter === ExpenseCostCenterType.district) return value.bizDistrictId;
    // 商圈
    if (costCenter === ExpenseCostCenterType.knight) return value.bizDistrictId;
  }

  // 当月已提报费用合计 当月已付款费用合计
  fetchCostOrderAmountSummay = (res) => {
    const {
      costAllocationList,       // 成本费用记录分摊清单
      costCenterType,           // 成本中心归属类型名称
      costAccountingId,         // 费用科目ID
      applicationOrderId,       // 归属审批单ID
    } = res;
    // 审批单第一次提报时间
    // TODO：不能直接使用props，变量要声明 @常志闯
    const { submitAt } = this.props.examineOrderDetail;
    // 根据成本费用记录分摊列表获取当月已付款费用合计
    costAllocationList.forEach((v) => {
      // 已付款金额参数
      const payload = {
        costCenter: costCenterType,
        costTargetId: this.getCostTargetId(costCenterType, v),  // 成本归属id
        subjectId: costAccountingId,
        applicationOrderId,
        submitAt,
      };
      // 定义提报金额参数
      const params = {
        costCenter: costCenterType,
        applicationOrderId,               // 审批单id
        accountingId: costAccountingId,   // 科目id
        costTargetId: this.getCostTargetId(costCenterType, v),   // 成本归属id
        platformCode: v.platformCode,           // 平台
        supplierId: v.supplierId,               // 供应商
        cityCode: v.cityCode,                   // 城市
        bizDistrictId: v.bizDistrictId,          // 商圈
        submitAt,
        assetsId: v.assetsId,          // 资产
      };
      // 获取已付款金额
      this.props.dispatch({ type: 'expenseCostOrder/fetchAmountSummary', payload });
      // 获取提报金额
      this.props.dispatch({ type: 'expenseCostOrder/fetchSubmitSummary', payload: params });
    });
  }
  // 渲染常规费用单打印
  renderCostOrder = (costOrder) => {
    const { examineOrderDetail = {} } = this.props;
    const {
      applicationOrderType = undefined,
      rentCycleEndAt, // 当前租金期间结束时间
      rentCycleStartAt, // 当前租金期间开始时间
    } = examineOrderDetail;

    const commonStyle = { height: '28px', lineHeight: '28px', float: 'left' };

    return (
      <div>
        {costOrder.map((item, index) => {
          const {
            cost_accounting_id: costAccountingId = '',
            cost_center_type: costCenterType,
            total_tax_amount_amount: totalTaxAmountAmount = 0,
            total_cost_bill_amount: totalCostBillAmount = 0,
            total_tax_deduction_amount: totalTaxDeductionAmount = 0,
            cost_bill_list: costBillList = [{}],
            cost_accounting_info: costAccountingInfo = {},
            type: costOrderType = undefined,
            is_book: isBook = false,
          } = item;
          const rentAccountingId = dot.get(item, 'biz_extra_house_contract_info.rent_accounting_id', undefined);

          // 科目成本中心
          const costAccountType = dot.get(costAccountingInfo, 'cost_center_type', undefined);
          // 租金期间
          let rentCycle = '';
          if (applicationOrderType === OaApplicationOrderType.housing
            && rentAccountingId
            && rentAccountingId === costAccountingId) {
            rentCycle = rentCycleStartAt && rentCycleEndAt ?
              `${moment(String(rentCycleStartAt)).format('YYYY.MM.DD')}-${moment(String(rentCycleEndAt)).format('YYYY.MM.DD')}` : '--';
          }

          // 科目name
          const costAccountName = costAccountingInfo ? costAccountingInfo.name : '';

          let formMoney = (<React.Fragment>
            <div style={{ width: '35%', ...commonStyle }}>
              总税额：{Unit.exchangePriceToYuan(totalTaxAmountAmount)}元
            </div>
            <div style={{ width: '40%', ...commonStyle }}>
              去税总额：{Unit.exchangePriceToYuan(totalTaxDeductionAmount)}元
            </div>
          </React.Fragment>);

          // 判断是审批单为费用或差旅报销
          if (applicationOrderType === OaApplicationOrderType.cost || applicationOrderType === OaApplicationOrderType.travel) {
            formMoney = (<React.Fragment>
              <div style={{ width: '35%', ...commonStyle }}>
                费用总金额：{Unit.exchangePriceToYuan(totalTaxDeductionAmount)}元
              </div>
              <div style={{ width: '40%', ...commonStyle }}>
                总税金：{Unit.exchangePriceToYuan(totalTaxAmountAmount)}元
              </div>
            </React.Fragment>);
          }
          // 发票信息
          const invoiceInfo = (
            <div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ float: 'left', width: '75px' }}>发票信息：</div>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ width: '25%', ...commonStyle }}>
                  发票总金额：{Unit.exchangePriceToYuan(totalCostBillAmount)}元
                </div>
                {formMoney}
              </div>
              {
                costBillList.map((i) => {
                  const {
                    code = undefined,
                    type = 10,
                    money = 0,
                    tax_rate: taxRate = 0.01,
                    tax_amount: tax = 0,
                    tax_deduction: noTax = 0,
                  } = i;
                  let formInvoice = (<React.Fragment>
                    <div style={{ width: '25%', ...commonStyle }}>
                      税额：{Unit.exchangePriceToYuan(noTax)}元
                    </div>
                    <div style={{ width: '25%', ...commonStyle }}>
                      去税额：{Unit.exchangePriceToYuan(tax)}元
                    </div>
                  </React.Fragment>);
                  // 判断是审批单为费用或差旅报销
                  if (applicationOrderType === OaApplicationOrderType.cost || applicationOrderType === OaApplicationOrderType.travel) {
                    formInvoice = (<React.Fragment>
                      <div style={{ width: '25%', ...commonStyle }}>
                        税金：{Unit.exchangePriceToYuan(tax)}元
                      </div>
                      <div style={{ width: '25%', ...commonStyle }}>
                        费用金额：{Unit.exchangePriceToYuan(noTax)}元
                      </div>
                    </React.Fragment>);
                  }
                  return (
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '25%', ...commonStyle }}>
                        发票编号：{code}
                      </div>
                      <div style={{ width: '25%', ...commonStyle }}>
                        发票类型：{type ? ExpenseInvoiceType.description(type) : '--'}
                      </div>
                      <div style={{ width: '25%', ...commonStyle }}>
                        发票金额：{Unit.exchangePriceToYuan(money)}元
                      </div>
                      <div style={{ width: '25%', ...commonStyle }}>
                        税率：{taxRate ? ExpenseInvoiceTaxRate.description(taxRate) : '--'}
                      </div>
                      {formInvoice}
                    </div>
                  );
                })
              }
            </div>
          );

          // 费用申请类型
          const isCost = applicationOrderType === OaApplicationOrderType.cost;

          return (
            <div key={index}>
              <div style={{ padding: '14px', boxSizing: 'border-box' }}>
                费用单号: {item._id}
              </div>
              <div style={{ padding: '0 40px', boxSizing: 'border-box' }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ width: '20%', ...commonStyle }}>付款金额:{item.total_money !== undefined ? Unit.exchangePriceToYuan(item.total_money) : '--'}元</div>
                  <div style={{ width: '25%', ...commonStyle }}>费用金额:{item.total_money !== undefined ? (Unit.exchangePriceToYuan(item.total_money) - Unit.exchangePriceToYuan(totalTaxAmountAmount)) : '--'}元</div>
                  {
                    isCost ?
                      (
                        <div style={{ width: '25%', ...commonStyle }}>是否红冲:{costOrderType === ExpenseCostOrderType.redPunch ? '是' : '否'}</div>
                      ) : ''
                  }
                  {
                    isCost ?
                      (
                        <div style={{ width: '25%', ...commonStyle }}>是否可记账:{isBook ? '是' : '否'}</div>
                      ) : ''
                  }
                  <div style={{ width: '15%', height: '28px', lineHeight: '28px', float: 'left' }}>是否开票:{item.invoice_flag ? '是' : '否'}</div>
                  <div style={{ width: '30%', height: '28px', lineHeight: '28px', float: 'left' }}>费用分组:{item.cost_group_name}</div>
                  <div style={{ width: '30%', height: '28px', lineHeight: '28px', float: 'left' }}>科目:{costAccountName}{item.cost_accounting_code}</div>
                  <div style={{ width: '30%', height: '28px', lineHeight: '28px', float: 'left' }}>成本归属:{ExpenseCostCenterType.description(item.cost_center_type)}</div>
                  {
                    rentCycle ?
                      <div style={{ width: '30%', height: '28px', lineHeight: '28px', float: 'left' }}>租金期间:{rentCycle}</div> : ''
                  }
                </div>
                <div>
                  <div style={{ height: '28px', lineHeight: '28px' }}>
                    <span>
                    成本分摊：{ExpenseCostOrderBelong.description(dot.get(item, 'allocation_mode'))}
                    </span>
                    {item.pledge_money_to_rent_money > 0 ? <span style={{ marginLeft: '50px' }}>
                      押金转租金：{Unit.exchangePriceToYuan(item.pledge_money_to_rent_money)}
                    </span> : ''}
                  </div>
                  {item.cost_allocation_list.map((itemChild, childIndex) => {
                    return (
                      <div key={childIndex} style={{ paddingLeft: '30px', boxSizing: 'border-box', marginBottom: '10px' }}>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ width: '70%', float: 'left' }}>{this.getName(itemChild, costCenterType, costAccountType)}</div>
                          {itemChild.money ?
                            <div style={{ width: '30%', float: 'right' }}>分摊金额：{Unit.exchangePriceToYuan(dot.get(itemChild, 'money', '--'))}元</div> : ''
                          }
                        </div>
                        {
                          costAccountType === ExpenseCostCenterType.headquarters
                            ? ''
                            : (
                              <div style={{ overflow: 'hidden' }}>
                                <div style={{ width: '50%', float: 'left' }}>当月已提报费用合计：{this.getSubmitSummary(itemChild)}元</div>
                                <div style={{ width: '50%', float: 'right' }}>当月已付款费用合计：{this.getAmountSummary(itemChild)}元</div>
                              </div>
                            )
                        }
                      </div>
                    );
                  })}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ float: 'left', width: '75px' }}>发票抬头：</div>
                  <div style={{ float: 'left', width: '88%' }}>
                    {costAccountType === ExpenseCostCenterType.headquarters
                      ? (<InvoiceHeader
                        invoiceVal={dot.get(item, 'invoice_title', undefined)}
                        platform={dot.get(item, 'platform_codes.0', undefined)}
                        isDetail
                      />)
                      : dot.get(item, 'invoice_title', '--')}
                  </div>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ float: 'left', width: '45px' }}>备注：</div>
                  <div style={{ float: 'left', width: '92%' }}>
                    {item.note}
                  </div>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ float: 'left', width: '75px' }}>上传附件：</div>
                  <div style={{ float: 'left', width: '89%' }}>
                    {
                      item.attachments.map((child, childIndex) => {
                        return <span key={childIndex} style={{ display: 'inline-block', marginRight: '30px' }}>{child}</span>;
                      })
                    }
                  </div>
                </div>
                <div style={{ height: '28px' }}>
                  <div style={{ width: '25%', height: '28px', lineHeight: '28px', float: 'left' }}>收款人：{dot.get(item, 'payee_info.card_name', '--')}</div>
                  <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left' }}>收款账号：{dot.get(item, 'payee_info.card_num', '--')}</div>
                  <div style={{ width: '40%', height: '28px', lineHeight: '28px', float: 'left' }}>开户支行：{dot.get(item, 'payee_info.bank_details', '--')}</div>
                </div>
                {
                  costOrderType === ExpenseCostOrderType.normal
                  && applicationOrderType === OaApplicationOrderType.cost
                    ? invoiceInfo : ''
                }
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 渲染红冲退款费用单打印
  renderoriginalCostOrder = (examineOrderDetail, originalCostOrder, costOrderAmountSummary, costOrderSubmitSummary) => {
    const {
      applicationSubType, // 审批类型（退款/红冲）
    } = examineOrderDetail;

    let costOrderList = [];

    // 退款
    if (applicationSubType === InvoiceAjustAction.refund) {
      costOrderList = originalCostOrder.filter(item => item.costOrderExistsRefoundRedRush === InvoiceAjustAction.refund);
    }

    // 红冲
    if (applicationSubType === InvoiceAjustAction.invoiceAdjust) {
      costOrderList = originalCostOrder.filter(item => item.costOrderExistsRefoundRedRush === InvoiceAjustAction.invoiceAdjust);
    }

    return (
      <div>
        {costOrderList.map((item, index) => {
          return (
            <div key={index} style={{ borderBottom: '1px solid rgb(204,204,204)' }}>
              <div style={{ padding: '14px', boxSizing: 'border-box' }}>
                费用单号: {item.id}
              </div>
              <div style={{ padding: '0 40px', boxSizing: 'border-box' }}>
                <div style={{ height: '28px' }}>
                  <div style={{ width: '25%', height: '28px', lineHeight: '28px', float: 'left' }}>费用金额:{item.totalMoney !== undefined ? Unit.exchangePriceToYuan(item.totalMoney) : '--'}元</div>
                  <div style={{ width: '15%', height: '28px', lineHeight: '28px', float: 'left' }}>是否开票:{item.invoiceFlag ? '是' : '否'}</div>
                  <div style={{ width: '30%', height: '28px', lineHeight: '28px', float: 'left' }}>费用分组:{item.costGroupName}</div>
                  <div style={{ width: '30%', height: '28px', lineHeight: '28px', float: 'left' }}>科目:{item.costAccountingInfo.name}({item.costAccountingCode})</div>
                  <div style={{ width: '30%', height: '28px', lineHeight: '28px', float: 'left' }}>成本归属:{ExpenseCostCenterType.description(item.costCenterType)}</div>
                </div>
                <div>
                  <div style={{ height: '28px', lineHeight: '28px' }}>成本分摊：{ExpenseCostOrderBelong.description(dot.get(item, 'allocationMode'))}</div>
                  {item.costAllocationList.map((itemChild, childIndex) => {
                    return (
                      <div key={childIndex} style={{ paddingLeft: '30px', boxSizing: 'border-box', marginBottom: '10px' }}>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ width: '70%', float: 'left' }}>{this.getOriginalCostOrderName(itemChild)}</div>
                          {itemChild.money ?
                            <div style={{ width: '30%', float: 'right' }}>分摊金额：{Unit.exchangePriceToYuan(dot.get(itemChild, 'money', '--'))}元</div> : ''
                          }
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ width: '50%', float: 'left' }}>当月已提报费用合计：{this.getOriginalcostOrderSubmitSummary(costOrderSubmitSummary)}元</div>
                          <div style={{ width: '50%', float: 'right' }}>当月已付款费用合计：{this.getOriginalCostOrderAmountSummary(costOrderAmountSummary)}元</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ float: 'left', width: '60px' }}>发票抬头：</div>
                  <div style={{ float: 'left', width: '88%' }}>
                    {item.invoiceTitle ? item.invoiceTitle : '--'}
                  </div>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ float: 'left', width: '36px' }}>备注：</div>
                  <div style={{ float: 'left', width: '92%' }}>
                    {item.note}
                  </div>
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ float: 'left', width: '60px' }}>上传附件：</div>
                  <div style={{ float: 'left', width: '89%' }}>
                    {
                      item.attachments.map((child, childIndex) => {
                        return <span key={childIndex} style={{ display: 'inline-block', marginRight: '30px' }}>{child}</span>;
                      })
                    }
                  </div>
                </div>
                <div style={{ height: '28px' }}>
                  <div style={{ width: '25%', height: '28px', lineHeight: '28px', float: 'left' }}>收款人：{dot.get(item, 'payeeInfo.card_name', '--')}</div>
                  <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left' }}>收款账号：{dot.get(item, 'payeeInfo.card_num', '--')}</div>
                  <div style={{ width: '40%', height: '28px', lineHeight: '28px', float: 'left' }}>开户支行：{dot.get(item, 'payeeInfo.bank_details', '--')}</div>
                </div>
              </div>

              {/* 红冲/退款单 */}
              {this.renderOriginal(item)}
            </div>
          );
        })}
      </div>
    );
  }
  // 渲染红冲退款打印组件
  renderOriginal = (item) => {
    const {
      costOrderExistsRefoundRedRush,
      refCostOrderInfoList = [],
    } = item;

    // 过滤数据
    let data;

    // 如果是打印的是退款单类型则打印退款
    if (costOrderExistsRefoundRedRush === InvoiceAjustAction.refund) {
      data = refCostOrderInfoList.filter(costOrder => costOrder.state !== ExpenseCostOrderState.close && costOrder.state !== ExpenseCostOrderState.delete);
      return <RefoundComponent originalDate={data} />;
    }
    // 如果是打印的是红冲单类型则打印红冲
    if (costOrderExistsRefoundRedRush === InvoiceAjustAction.invoiceAdjust) {
      data = refCostOrderInfoList.filter(costOrder => costOrder.state !== ExpenseCostOrderState.close && costOrder.state !== ExpenseCostOrderState.delete && costOrder.total_money > 0);
      return <InvoiceAdjustComponent originalDate={data} />;
    }
    return '';
  }

  render() {
    const { costOrder, originalCostOrder, examineOrderDetail, costOrderAmountSummary, costOrderSubmitSummary } = this.props;
    return (
      <div style={{ padding: '0 16px', boxSizing: 'border-box', backgroundColor: 'rgb(247,247,247)', margin: '20px 0 0 0', overflow: 'hidden' }}>
        <div style={{ margin: '18px 8px' }} />
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
            <span style={{ verticalAlign: 'text-bottom' }}>费用单</span>
          </div>
          {
            examineOrderDetail.applicationSubType === InvoiceAjustAction.normal ?
            this.renderCostOrder(costOrder) : this.renderoriginalCostOrder(examineOrderDetail, originalCostOrder, costOrderAmountSummary, costOrderSubmitSummary)
          }
        </div>
      </div>
    );
  }
}
function mapStateToProps({
  expenseCostOrder: {
    originalCostOrder,
    costOrderAmountSummary,
    costOrderSubmitSummary,
  },
  expenseExamineOrder: { examineOrderDetail },
  expenseExamineFlow: { examineDetail },
}) {
  return { originalCostOrder, examineOrderDetail, examineDetail, costOrderAmountSummary, costOrderSubmitSummary };
}
export default connect(mapStateToProps)(Cost);
