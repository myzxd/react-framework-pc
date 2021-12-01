/**
 * 审批单打印的打印区域房屋信息组件 Expense/Manage/Print/House
 */
import React, { Component } from 'react';
import { ExpenseCostCenterType, ExpenseCostOrderState, Unit } from '../../../../application/define';

class House extends Component {
  render() {
    const thTdStyle = { border: '1px solid #000', padding: '4px' };
    const { houseDetail, houseCostOrders } = this.props;
    let costAllocationList = [];
    let agentInvoiceTitle = '--';
    if (houseDetail) {
      costAllocationList = houseDetail.cost_allocation_list;
      agentInvoiceTitle = houseDetail.agent_invoice_title;
    }
    return (
      <div style={{ padding: '0 16px', boxSizing: 'border-box', backgroundColor: 'rgb(247,247,247)', margin: '20px 0 0 0', overflow: 'hidden' }}>
        <h3 style={{ margin: '18px 8px' }}>房屋信息</h3>
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
            <span style={{ verticalAlign: 'text-bottom' }}>基础信息</span>
          </div>
          <div style={{ padding: '14px', boxSizing: 'border-box' }}>
            合同编号：{houseDetail._id}
          </div>
        </div>
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
            <span style={{ verticalAlign: 'text-bottom' }}>费用申请记录</span>
          </div>
          <div style={{ padding: '14px', boxSizing: 'border-box' }}>
            <table style={{ width: '100%', textAlign: 'center', border: '1px solid #000', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <th style={thTdStyle}>序号</th>
                  <th style={thTdStyle}>审批单号</th>
                  <th style={thTdStyle}>费用单号</th>
                  <th style={thTdStyle}>申请人</th>
                  <th style={thTdStyle}>费用类型</th>
                  <th style={thTdStyle}>科目</th>
                  <th style={thTdStyle}>金额</th>
                  <th style={thTdStyle}>审批状态</th>
                </tr>
                {
                  houseCostOrders.length > 0 ?
                    (
                      houseCostOrders.map((item, index) => (
                        <tr key={index}>
                          <td style={thTdStyle}>{index + 1}</td>
                          <td style={thTdStyle}>{item.application_order_id}</td>
                          <td style={thTdStyle}>{item._id}</td>
                          <td style={thTdStyle}>{item.apply_account_info.name}</td>
                          <td style={thTdStyle}>{item.cost_group_name}</td>
                          <td style={thTdStyle}>{item.cost_accounting_info.name}</td>
                          <td style={thTdStyle}>{Unit.exchangePriceToYuan(item.total_money)}</td>
                          <td style={thTdStyle}>{ExpenseCostOrderState.description(item.state)}</td>
                        </tr>
                        ),
                      )
                    )
                    : (
                      <tr>
                        <td colSpan="8" style={{ padding: '22px' }}>内容为空</td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0px', top: '7px', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)' }} />
            <span style={{ position: 'absolute', left: '12px', top: '4px' }}>房屋信息</span>
          </div>
          <div style={{ padding: '14px', boxSizing: 'border-box' }}>
            <div style={{ height: '28px' }}>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>合同录入类型：{houseDetail.migrate_flag ? '现存执行合同补录' : '新合同'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }} />
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>原来OA审批单：{houseDetail.migrate_oa_note || '--'}</div>
            </div>
            <div style={{ height: '28px' }}>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>用途：{houseDetail.usage || '--'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>面积：{houseDetail.area || '--'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>合同租期：{houseDetail.contract_start_date}-{houseDetail.contract_end_date}</div>
            </div>
            <div style={{ height: '28px' }}>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>断租时间：{houseDetail.break_date || '--'}</div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'left', width: '45px' }}>备注：</div>
              <div style={{ float: 'left', width: '92%' }}>
                {houseDetail.note || '--'}
              </div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'left', width: '45px' }}>附件：</div>
              <div style={{ float: 'left', width: '92%' }}>
                {houseDetail.attachments.map((item, index) => <span style={{ display: 'inline-block', marginRight: '8px' }} key={index}>{item}</span>)}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0px', top: '7px', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)' }} />
            <span style={{ position: 'absolute', left: '12px', top: '4px' }}>成本归属/分摊</span>
          </div>
          <div style={{ padding: '14px', boxSizing: 'border-box' }}>
            <div style={{ height: '28px' }}>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>成本中心：{houseDetail.cost_center_type ? ExpenseCostCenterType.description(houseDetail.cost_center_type) : '--'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>平台：{houseDetail.platform_names.length > 0 ? houseDetail.platform_names[0] : '--'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>分摊模式：{houseDetail.allocation_mode_title || '--'}</div>
            </div>
            {costAllocationList.map((item, index) => {
              return (
                <div key={index} style={{ height: '28px' }}>
                  <div style={{ width: '25%', float: 'left', height: '28px', lineHeight: '28px' }}>平台：{item.platform_name || '--'}</div>
                  <div style={{ width: '25%', float: 'left', height: '28px', lineHeight: '28px' }}>供应商：{item.supplier_name || '--'}</div>
                  <div style={{ width: '25%', float: 'left', height: '28px', lineHeight: '28px' }}>城市：{item.city_name || '--'}</div>
                  <div style={{ width: '25%', float: 'left', height: '28px', lineHeight: '28px' }}>商圈：{item.biz_district_name || '--'}</div>
                </div>
              );
            })}
            <div style={{ height: '28px' }}>
              <div style={{ width: '100%', float: 'left', height: '28px', lineHeight: '28px' }}>发票抬头：{agentInvoiceTitle}</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0px', top: '7px', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)' }} />
            <span style={{ position: 'absolute', left: '12px', top: '4px' }}>租金信息</span>
          </div>
          <div style={{ padding: '14px', boxSizing: 'border-box' }}>
            <div style={{ height: '28px' }}>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>月租金：{houseDetail.month_money !== undefined
                ? Unit.exchangePriceToYuan(houseDetail.month_money)
                : '--'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>是否开票：{houseDetail.rent_invoice_flag ? '是' : '否'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>科目：{houseDetail.rent_accounting_info.name}{houseDetail.rent_accounting_info.accounting_code}</div>
            </div>
            <div style={{ height: '28px', overflow: 'hidden' }}>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>提前付款天数：{houseDetail.schedule_prepare_days !== undefined
                ? houseDetail.schedule_prepare_days
                : '--'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>付款周期（月/次）：{houseDetail.period_month_num !== undefined
                ? houseDetail.period_month_num
                : '--'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>已支付租金金额：{houseDetail.init_paid_money !== undefined
                ? Unit.exchangePriceToYuan(houseDetail.init_paid_money)
                : '--'}</div>
            </div>
            <div style={{ height: '28px' }}>
              <div style={{ height: '28px', lineHeight: '28px' }}>已支付租金月数：{houseDetail.init_paid_month_num !== undefined
                ? houseDetail.init_paid_month_num
                : '--'}</div>
            </div>
            <div style={{ height: '28px' }}>
              <div style={{ width: '25%', float: 'left', height: '28px', lineHeight: '28px' }}>房屋收款人：{houseDetail.rent_payee_info.card_name || '--'}</div>
              <div style={{ width: '35%', float: 'left', height: '28px', lineHeight: '28px' }}>收款账号：{houseDetail.rent_payee_info.card_num || '--'}</div>
              <div style={{ width: '40%', float: 'left', height: '28px', lineHeight: '28px' }}>开户支行：{houseDetail.rent_payee_info.bank_details || '--'}</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0px', top: '7px', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)' }} />
            <span style={{ position: 'absolute', left: '12px', top: '4px' }}>押金信息</span>
          </div>
          <div style={{ padding: '14px', boxSizing: 'border-box' }}>
            <div style={{ height: '28px' }}>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>押金金额：{houseDetail.pledge_money !== undefined
                ? Unit.exchangePriceToYuan(houseDetail.pledge_money)
                : '--'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>是否开票：{houseDetail.pledge_invoice_flag ? '是' : '否'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>科目：{houseDetail.pledge_accounting_info.name}{houseDetail.pledge_accounting_info.accounting_code}</div>
            </div>
            <div style={{ height: '28px' }}>
              <div style={{ width: '25%', float: 'left', height: '28px', lineHeight: '28px' }}>押金收款人：{houseDetail.pledge_payee_info.card_name || '--'}</div>
              <div style={{ width: '35%', float: 'left', height: '28px', lineHeight: '28px' }}>收款账号：{houseDetail.pledge_payee_info.card_num || '--'}</div>
              <div style={{ width: '40%', float: 'left', height: '28px', lineHeight: '28px' }}>开户支行：{houseDetail.pledge_payee_info.bank_details || '--'}</div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0px', top: '7px', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)' }} />
            <span style={{ position: 'absolute', left: '12px', top: '4px' }}>中介费信息</span>
          </div>
          <div style={{ padding: '14px', boxSizing: 'border-box' }}>
            <div style={{ height: '28px' }}>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>费用金额：{houseDetail.agent_money !== undefined
                ? Unit.exchangePriceToYuan(houseDetail.agent_money)
                : '--'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>是否开票：{houseDetail.agent_invoice_flag ? '是' : '否'}</div>
              <div style={{ width: '33.33%', float: 'left', height: '28px', lineHeight: '28px' }}>科目：{houseDetail.agent_accounting_info.name}{houseDetail.agent_accounting_info.accounting_code}</div>
            </div>
            <div style={{ height: '28px' }}>
              <div style={{ width: '25%', float: 'left', height: '28px', lineHeight: '28px' }}>中介收款人：{houseDetail.agent_payee_info.card_name || '--'}</div>
              <div style={{ width: '35%', float: 'left', height: '28px', lineHeight: '28px' }}>收款账号：{houseDetail.agent_payee_info.card_num || '--'}</div>
              <div style={{ width: '40%', float: 'left', height: '28px', lineHeight: '28px' }}>开户支行：{houseDetail.agent_payee_info.bank_details || '--'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default House;
