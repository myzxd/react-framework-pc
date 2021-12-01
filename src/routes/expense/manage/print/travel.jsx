/**
 * 审批单打印模板差旅列表 Expense/Manage/Print/Travel
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import is from 'is_js';
import {
  ExpenseCostOrderBelong,
  Unit,
  ExpenseTeamType,
  ExpenseCostCenterType,
  ExpenseInvoiceType,
  ExpenseInvoiceTaxRate,
  ExpenseCostOrderType,
} from '../../../../application/define';
import InvoiceHeader from '../template/components/invoiceHeader';

class Travel extends Component {
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
    if (costCenterType === ExpenseCostCenterType.team && costAccountType !== ExpenseCostCenterType.headquarters) {
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
  // 预计出差时间
  renderExpectDate = (record) => {
    const doneDate = moment(dot.get(record, 'expect_done_at', undefined)).format('YYYY.MM.DD HH:00');
    const startDate = moment(dot.get(record, 'expect_start_at', undefined)).format('YYYY.MM.DD HH:00');
    const date = dot.get(record, 'expect_start_at', undefined) && dot.get(record, 'expect_done_at', undefined) ? `${startDate} - ${doneDate}` : '--';
    return date;
  }
  // 出差实际时间
  renderActualDate = (record) => {
    const doneDate = moment(dot.get(record, 'actual_done_at', undefined)).format('YYYY.MM.DD HH:00');
    const startDate = moment(dot.get(record, 'actual_start_at', undefined)).format('YYYY.MM.DD HH:00');
    const date = dot.get(record, 'actual_done_at', undefined) && dot.get(record, 'actual_start_at', undefined) ? `${startDate} - ${doneDate}` : '--';
    return date;
  }
  // 出差起始地
  renderDeparture = (record) => {
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
      return address;
    } else {
      return '--';
    }
  }
  // 出差目的地
  renderDestination = (record) => {
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
      return address;
    } else {
      return '--';
    }
  }
  // 差旅地点
  renderPlace = (record) => {
    return `${this.renderDeparture(record)}-${this.renderDestination(record)}`;
  }
  render() {
    const loanOrderList = this.props.costOrder;

    const costOrderList = this.props.examineOrder.cost_order_list;
    loanOrderList.forEach((item, index) => {
      costOrderList.forEach((v) => {
        if (item._id === v._id) {
          loanOrderList[index].travelInfo = v;
        }
      });
    });

    const commonStyle = { height: '28px', lineHeight: '28px', float: 'left' };

    return (
      <div style={{ padding: '0 16px', boxSizing: 'border-box', backgroundColor: 'rgb(247,247,247)', margin: '20px 0 0 0', overflow: 'hidden' }}>
        <div style={{ margin: '18px 8px' }} />
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
            <span style={{ verticalAlign: 'text-bottom' }}>费用单</span>
          </div>
          {
            loanOrderList.map((item, index) => {
              const {
                total_tax_amount_amount: totalTaxAmountAmount = 0,
                total_cost_bill_amount: totalCostBillAmount = 0,
                total_tax_deduction_amount: totalTaxDeductionAmount = 0,
                cost_bill_list: costBillList = [],
                type: costOrderType,
                is_book: isBook = false,
              } = item;
              const costAccountType = dot.get(item, 'cost_accounting_info.cost_center_type', undefined);

              // 发票信息
              const invoiceInfo = (
                <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                  <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                    <span style={{ verticalAlign: 'text-bottom' }}>发票信息</span>
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ width: '25%', ...commonStyle }}>
                      发票总金额：{Unit.exchangePriceToYuan(totalCostBillAmount)}元
                    </div>
                    <div style={{ width: '35%', ...commonStyle }}>
                      费用总金额：{Unit.exchangePriceToYuan(totalTaxDeductionAmount)}元
                    </div>
                    <div style={{ width: '40%', ...commonStyle }}>
                      总税金：{Unit.exchangePriceToYuan(totalTaxAmountAmount)}元
                    </div>
                  </div>
                  {
                    costBillList.map((i) => {
                      const {
                        code = undefined,
                        type = undefined,
                        money = 0,
                        tax_rate: taxRate = undefined,
                        tax_amount: tax = 0,
                        tax_deduction: noTax = 0,
                      } = i;
                      return (
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ width: '16%', ...commonStyle }}>
                            发票编号：{code}
                          </div>
                          <div style={{ width: '16%', ...commonStyle }}>
                            发票类型：{type ? ExpenseInvoiceType.description(type) : '--'}
                          </div>
                          <div style={{ width: '16%', ...commonStyle }}>
                            发票金额：{Unit.exchangePriceToYuan(money)}元
                          </div>
                          <div style={{ width: '16%', ...commonStyle }}>
                            税率：{taxRate ? ExpenseInvoiceTaxRate.description(taxRate) : '--'}
                          </div>
                          <div style={{ width: '16%', ...commonStyle }}>
                            费用金额：{Unit.exchangePriceToYuan(noTax)}元
                          </div>
                          <div style={{ width: '16%', ...commonStyle }}>
                            税金：{Unit.exchangePriceToYuan(tax)}元
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              );

              return (
                <div key={index} style={{ padding: '8px', boxSizing: 'border-box', backgroundColor: '#fff', margin: '8px 0' }}>
                  <div>
                    费用单号: {dot.get(item, '_id', undefined) || '--'}
                  </div>
                  {
                    item.travelInfo ? <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                      <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                        <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                        <span style={{ verticalAlign: 'text-bottom' }}>出差信息</span>
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ width: '50%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                          出差申请单号: {dot.get(item.travelInfo, 'biz_extra_travel_apply_order_id', undefined) || '--'}
                        </div>
                        <div style={{ width: '50%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                          实际出差人: {dot.get(item.travelInfo.biz_extra_travel_apply_order_info, 'apply_user_name', undefined) || '--'}</div>
                        <div style={{ width: '50%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                          预计出差时间: {this.renderExpectDate(item.travelInfo.biz_extra_travel_apply_order_info)}</div>
                        <div style={{ width: '50%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                          出差地点: {this.renderPlace(item.travelInfo.biz_extra_travel_apply_order_info)}</div>
                        <div style={{ width: '50%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                          实际出差时间: {this.renderActualDate(item.travelInfo.biz_extra_travel_apply_order_info)}</div>
                        <div style={{ width: '50%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                          出差天数: {dot.get(item.travelInfo.biz_extra_travel_apply_order_info, 'actual_apply_days', 0) ? `${dot.get(item.travelInfo.biz_extra_travel_apply_order_info, 'actual_apply_days', 0)} ${'天'}` : '--'}</div>
                      </div>
                    </div> : ''
                  }
                  <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                    <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                      <span style={{ verticalAlign: 'text-bottom' }}>费用信息</span>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>付款金额（元）: {Unit.exchangePriceToYuan(dot.get(item.travelInfo, 'total_money', 0))}</div>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>费用金额（元）: {Unit.exchangePriceToYuan(dot.get(item.travelInfo, 'total_money', 0)) - Unit.exchangePriceToYuan(totalTaxAmountAmount)}</div>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>是否开发票: {dot.get(item.travelInfo, 'invoice_flag') ? '是' : '否'}</div>
                      <div style={{ width: '30%', ...commonStyle }}>是否红冲:{costOrderType === ExpenseCostOrderType.redPunch ? '是' : '否'}</div>
                      <div style={{ width: '30%', ...commonStyle }}>是否可记账:{isBook ? '是' : '否'}</div>
                    </div>
                  </div>
                  {
                    item.travelInfo ? <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                      <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                        <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                        <span style={{ verticalAlign: 'text-bottom' }}>差旅费用明细</span>
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                          补助（元）: {dot.get(item.travelInfo.biz_extra_data, 'stay_fee', 0) ? Unit.exchangePriceToYuan(dot.get(item.travelInfo.biz_extra_data, 'stay_fee', 0)) : '--'}
                        </div>
                        <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>住宿（元）:
                        {dot.get(item.travelInfo.biz_extra_data, 'subsidy_fee', 0) ? Unit.exchangePriceToYuan(dot.get(item.travelInfo.biz_extra_data, 'subsidy_fee', 0)) : '--'}
                        </div>
                        <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>往返交通费（元）:
                        {dot.get(item.travelInfo.biz_extra_data, 'transport_fee', 0) ? Unit.exchangePriceToYuan(dot.get(item.travelInfo.biz_extra_data, 'transport_fee', 0)) : '--'}
                        </div>
                        <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>市内交通费（元）:
                        {dot.get(item.travelInfo.biz_extra_data, 'urban_transport_fee', 0) ? Unit.exchangePriceToYuan(dot.get(item.travelInfo.biz_extra_data, 'urban_transport_fee', 0)) : '--'}
                        </div>
                        <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>其它（元）:
                        {dot.get(item.travelInfo.biz_extra_data, 'other_fee', 0) ? Unit.exchangePriceToYuan(dot.get(item.travelInfo.biz_extra_data, 'other_fee', 0)) : '--'}
                        </div>
                      </div>
                    </div> : ''
                  }
                  <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                    <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                      <span style={{ verticalAlign: 'text-bottom' }}>项目信息</span>
                    </div>
                    <div style={{ padding: '0 40px', boxSizing: 'border-box' }}>
                      <div style={{ height: '28px' }}>
                        <div style={{ width: '25%', height: '28px', lineHeight: '28px', float: 'left' }}>科目:
                          {`${dot.get(item, 'cost_accounting_info.name', '--')}(${dot.get(item, 'cost_accounting_code', '--')})`}
                        </div>
                        <div style={{ width: '25%', height: '28px', lineHeight: '28px', float: 'left' }}>费用分组:
                          {dot.get(item, 'cost_group_name')}
                        </div>
                        <div style={{ width: '25%', height: '28px', lineHeight: '28px', float: 'left' }}>成本归属:
                          {ExpenseCostCenterType.description(dot.get(item, 'cost_center_type'))}
                        </div>
                      </div>
                      <div>
                        <div style={{ height: '28px', lineHeight: '28px' }}>成本分摊：{ExpenseCostOrderBelong.description(dot.get(item, 'allocation_mode'))}</div>
                        {item.cost_allocation_list.map((itemChild, childIndex) => {
                          return (
                            <div key={childIndex} style={{ paddingLeft: '30px', boxSizing: 'border-box', marginBottom: '10px' }}>
                              <div style={{ overflow: 'hidden' }}>
                                <div style={{ width: '70%', float: 'left' }}>{this.getName(itemChild, dot.get(item, 'cost_center_type'), costAccountType)}</div>
                                {itemChild.money ?
                                  <div style={{ width: '30%', float: 'right' }}>分摊金额: {Unit.exchangePriceToYuan(dot.get(itemChild, 'money', '--'))}元</div> : ''
                                }

                              </div>
                              {
                                costAccountType === ExpenseCostCenterType.headquarters
                                  ? ''
                                  : (
                                    <div style={{ overflow: 'hidden' }}>
                                      <div style={{ width: '50%', float: 'left' }}>当月已提报费用合计: {this.getSubmitSummary(itemChild)}元</div>
                                      <div style={{ width: '50%', float: 'right' }}>当月已付款费用合计: {this.getAmountSummary(itemChild)}元</div>
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
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                    <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                      <span style={{ verticalAlign: 'text-bottom' }}>支付信息</span>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>收款人: {dot.get(item, 'payee_info.card_name', '--')}</div>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>收款账号: {dot.get(item, 'payee_info.card_num', '--')}</div>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>开户支行: {dot.get(item, 'payee_info.bank_details', '--')}</div>
                    </div>
                  </div>
                  {
                    costOrderType === ExpenseCostOrderType.normal
                      ? invoiceInfo : ''
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
export default Travel;
