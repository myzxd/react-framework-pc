/**
 * code审批单打印预览页
 */
import dot from 'dot-prop';
import moment from 'moment';
import React from 'react';

import {
  Unit,
  ExpenseExamineOrderProcessState,
  CodeApproveOrderPayState,
  CodeTicketState,
  ExpenseCollectionType,
  InvoiceAjustAction,
  CostOrderTicketPunchState,
  CodeCostCenterType,
  ExpenseInvoiceType,
  ExpenseInvoiceTaxRate,
  CodeApproveOrderType,
  CodeTravelState,
} from '../../../application/define';

import Process from './process';

const PrintItem = ({
  detail = {},
}) => {
  // 获取出发地
  const getDeparture = (departure = {}) => {
    if (!departure) return {};
    const res = {
      province: departure.province_name,
      city: departure.city_name,
      area: departure.area_name,
    };

    departure.detailed_address && (res.detailed_address = departure.detailed_address);

    return res;
  };

  // 获取出发地
  const getDestination = (destinationList = [], destination = {}) => {
    if ((!destination
      || Object.keys(destination).length < 1)
      && (!destinationList
      || !Array.isArray(destinationList))
    ) return [];

    const data = destinationList.length > 0 ? destinationList : [destination];
    const res = data.map((i) => {
      const departure = {
        province: i.province_name,
        city: i.city_name,
        area: i.area_name,
      };

      i.detailed_address && (departure.detailed_address = i.detailed_address);
      return departure;
    });

    return res;
  };

  // 基本信息
  const renderBasic = () => {
    const {
      state,
      paid_state: paidState,
      inspect_bill_state: inspectBillState,
    } = detail;

    const formFWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '25%',
      display: 'flex',
    };
    const formTWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '33.33%',
      display: 'flex',
    };
    const formLabelStyle = {
      width: '40%',
      textAlign: 'right',
    };
    const formContentStyle = {
      width: '58%',
      color: '#666',
      fontWeight: 500,
      wordBreak: 'break-word',
    };
    const formTContentStyle = {
      width: '67%',
      color: '#666',
      fontWeight: 500,
      wordBreak: 'break-word',
    };

    return (
      <div
        style={{
          borderBottom: '1px solid rgb(204,204,204)',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={formFWrapStyle}>
            <span style={formLabelStyle}>申请人：</span>
            <span style={formContentStyle}>
              {dot.get(detail, 'apply_account_info.name', '--')}
            </span>
          </div>
          <div style={formFWrapStyle}>
            <span style={formLabelStyle}>部门：</span>
            <span style={formContentStyle}>{dot.get(detail, 'department_job_info.department_info.name', '--')}</span>
          </div>
          <div style={formFWrapStyle}>
            <span style={formLabelStyle}>岗位：</span>
            <span style={formContentStyle}>{dot.get(detail, 'department_job_info.job_info.name', '--')}</span>
          </div>
          <div style={formFWrapStyle}>
            <span style={formLabelStyle}>职级：</span>
            <span style={formContentStyle}>{dot.get(detail, 'department_job_info.job_info.rank', '--')}</span>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={formTWrapStyle}>
            <span style={formLabelStyle}>审批标题：</span>
            <span style={formTContentStyle}>{dot.get(detail, 'name', '--')}</span>
          </div>
          <div style={formTWrapStyle}>
            <span style={formLabelStyle}>审批单号：</span>
            <span style={formTContentStyle}>{dot.get(detail, '_id', '--')}</span>
          </div>
          <div style={formTWrapStyle}>
            <span style={formLabelStyle}>审批流：</span>
            <span style={formTContentStyle}>{dot.get(detail, 'flow_info.name', '--')}</span>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={formTWrapStyle}>
            <span style={formLabelStyle}>流程状态：</span>
            <span style={formTContentStyle}>{state ? ExpenseExamineOrderProcessState.description(state) : '--'}</span>
          </div>
          <div style={formTWrapStyle}>
            <span style={formLabelStyle}>付款状态：</span>
            <span style={formTContentStyle}>{paidState ? CodeApproveOrderPayState.description(paidState) : '--'}</span>
          </div>
          <div style={formTWrapStyle}>
            <span style={formLabelStyle}>验票状态：</span>
            <span style={formTContentStyle}>{inspectBillState ? CodeTicketState.description(inspectBillState) : '--'}</span>
          </div>
          <div style={formTWrapStyle}>
            <span style={formLabelStyle}>记账月份：</span>
            <span style={formTContentStyle}>{dot.get(detail, 'belong_month', undefined) || '付款月份'}</span>
          </div>
        </div>
      </div>
    );
  };

  // 付款明细
  const renderPayeeList = () => {
    const { actual_payee_list: payeeList = [] } = detail;
    if (!payeeList || !Array.isArray(payeeList) || payeeList.length < 1) {
      return '无';
    }

    // 付款合计金额
    const totalAmountMoney = payeeList.reduce((rec, cur) => rec + cur.money, 0);

    const tableTitleTD = {
      color: 'rgba(0, 0, 0, .85)',
      fontWeight: 500,
      border: '1px solid #f0f0f0',
      padding: '16px 8px',
    };

    const tableContentTD = {
      color: 'rgba(0, 0, 0, .65)',
      border: '1px solid #f0f0f0',
      padding: '16px 8px',
    };

    return (
      <div>
        <div style={{ textAlign: 'right' }}>{`付款合计金额：${Unit.exchangePriceCentToMathFormat(totalAmountMoney)}`}</div>
        <table
          style={{
            borderCollapse: 'collapse',
            width: '90%',
            marginBottom: 10,
          }}
        >
          <tr>
            <td style={tableTitleTD}>收款人</td>
            <td style={tableTitleTD}>银行卡号</td>
            <td style={tableTitleTD}>开户支行</td>
            <td style={tableTitleTD}>金额（元）</td>
            <td style={tableTitleTD}>付款方式</td>
          </tr>
          {
            dot.get(detail, 'actual_payee_list', []).map((payee, key) => {
              const {
                card_name: cardName,
                card_phone: cardPhone,
                card_num: cardNum,
                bank_details: bankDetails,
                money,
                payee_type: payeeType,
              } = payee;
              return (
                <tr key={key}>
                  <td style={tableContentTD}>
                    {cardName}
                    {cardPhone ? (cardPhone) : ''}
                  </td>
                  <td style={tableContentTD}>{cardNum}</td>
                  <td style={tableContentTD}>{bankDetails}</td>
                  <td style={tableContentTD}>
                    {
                      money >= 0
                        ? Unit.exchangePriceCentToMathFormat(money) : '--'
                    }
                  </td>
                  <td style={tableContentTD}>
                    {
                       payeeType
                        ? ExpenseCollectionType.description(payeeType) : '--'
                    }
                  </td>
                </tr>
              );
            })
          }
        </table>
      </div>
    );
  };

  // 主题标签，验票标签
  const renderTab = () => {
    const formWrapStyle = {
      display: 'flex',
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
    };
    const formLabelStyle = {
      width: '10%',
      textAlign: 'right',
    };
    const formContentStyle = {
      color: '#666',
      fontWeight: 500,
      width: '88%',
      wordBreak: 'break-word',
    };
    return (
      <div
        style={{
          borderBottom: '1px solid rgb(204,204,204)',
          marginBottom: 10,
        }}
      >
        <div style={formWrapStyle}>
          <span style={formLabelStyle}>主题标签：</span>
          <span style={formContentStyle}>
            {
              dot.get(detail, 'theme_label_list', []).map(i => i).join(' 、 ')
            }
          </span>
        </div>
        <div style={formWrapStyle}>
          <span style={formLabelStyle}>验票标签：</span>
          <span style={formContentStyle}>
            {
              dot.get(detail, 'inspect_bill_label_list', []).map(i => i.name).join(' 、 ')
            }
          </span>
        </div>
        <div style={formWrapStyle}>
          <span style={formLabelStyle}>付款明细：</span>
          <span style={formContentStyle}>{renderPayeeList()}</span>
        </div>
      </div>
    );
  };

  // 费用单收款明细
  const renderCostPayeeList = (costOrder) => {
    const { payee_list: payeeList = [] } = costOrder;
    if (!payeeList || !Array.isArray(payeeList) || payeeList.length < 1) {
      return '无';
    }

    const tableTitleTD = {
      color: 'rgba(0, 0, 0, .85)',
      fontWeight: 500,
      border: '1px solid #f0f0f0',
      padding: '16px 8px',
    };

    const tableContentTD = {
      color: 'rgba(0, 0, 0, .65)',
      border: '1px solid #f0f0f0',
      padding: '16px 8px',
    };

    return (
      <div>
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: 10,
          }}
        >
          <tr>
            <td style={tableTitleTD}>收款人</td>
            <td style={tableTitleTD}>付款方式</td>
            <td style={tableTitleTD}>银行卡号</td>
            <td style={tableTitleTD}>开户支行</td>
            <td style={tableTitleTD}>金额（元）</td>
            <td style={tableTitleTD}>手机号</td>
          </tr>
          {
            payeeList.map((payee, key) => {
              const {
                card_name: cardName,
                card_phone: cardPhone,
                card_num: cardNum,
                bank_details: bankDetails,
                money,
                payee_type: payeeType,
              } = payee;
              return (
                <tr key={key}>
                  <td style={tableContentTD}>
                    {cardName}
                  </td>
                  <td style={tableContentTD}>
                    {
                       payeeType
                        ? ExpenseCollectionType.description(payeeType) : '--'
                    }
                  </td>
                  <td style={tableContentTD}>{cardNum}</td>
                  <td style={tableContentTD}>{bankDetails}</td>
                  <td style={tableContentTD}>
                    {
                      money >= 0
                        ? Unit.exchangePriceCentToMathFormat(money) : '--'
                    }
                  </td>
                  <td style={tableContentTD}>{cardPhone}</td>
                </tr>
              );
            })
          }
        </table>
      </div>
    );
  };

  // 费用单发票信息
  const renderCostInvoiceInfo = (costOrder) => {
    const {
      cost_bill_list: costBillList = [],
      total_cost_bill_amount: totalCostBillAmount = 0, // 实时汇总发票总金额
      total_tax_amount_amount: totalTaxAmountAmount = 0, // 实时汇总发票总税额
      total_tax_deduction_amount: totalTaxDeductionAmount = 0, // 实时汇总发票总去税额
    } = costOrder;
    if (!costBillList || !Array.isArray(costBillList) || costBillList.length < 1) {
      return '无';
    }

    const tableTitleTD = {
      color: 'rgba(0, 0, 0, .85)',
      fontWeight: 500,
      border: '1px solid #f0f0f0',
      padding: '16px 8px',
    };

    const tableContentTD = {
      color: 'rgba(0, 0, 0, .65)',
      border: '1px solid #f0f0f0',
      padding: '16px 8px',
    };

    const formTWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '33.33%',
      display: 'flex',
    };
    const formTLabelStyle = {
      width: '50%',
      textAlign: 'right',
    };
    const formTContentStyle = {
      width: '47%',
      color: '#666',
      fontWeight: 500,
      wordBreak: 'break-word',
    };

    return (
      <div>
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: 10,
          }}
        >
          <tr>
            <td style={tableTitleTD}>发票编号</td>
            <td style={tableTitleTD}>发票类型</td>
            <td style={tableTitleTD}>发票金额（元）</td>
            <td style={tableTitleTD}>费用金额（元）</td>
            <td style={tableTitleTD}>税率</td>
            <td style={tableTitleTD}>税金（元）</td>
          </tr>
          {
            costBillList.map((costBill, costBillKey) => {
              const {
                code = undefined,
                type = undefined,
                money = 0,
                tax_rate: taxRate = undefined,
                tax_amount: tax = 0,
                tax_deduction: noTax = 0,
              } = costBill;
              return (
                <tr key={costBillKey}>
                  <td style={tableContentTD}>
                    {code}
                  </td>
                  <td style={tableContentTD}>
                    {type ? ExpenseInvoiceType.description(type) : '--'}
                  </td>
                  <td style={tableContentTD}>
                    {Unit.exchangePriceCentToMathFormat(money)}
                  </td>
                  <td style={tableContentTD}>
                    {Unit.exchangePriceCentToMathFormat(noTax)}
                  </td>
                  <td style={tableContentTD}>
                    {
                      taxRate !== undefined ? ExpenseInvoiceTaxRate.description(taxRate) : '--'
                    }
                  </td>
                  <td style={tableContentTD}>
                    {Unit.exchangePriceCentToMathFormat(tax)}
                  </td>
                </tr>
              );
            })
          }
        </table>
        <div
          style={{
            display: 'flex',
          }}
        >
          <div style={formTWrapStyle}>
            <span style={formTLabelStyle}>发票总金额：</span>
            <span style={formTContentStyle}>
              {Unit.exchangePriceCentToMathFormat(totalCostBillAmount)}元
            </span>
          </div>
          <div style={formTWrapStyle}>
            <span style={formTLabelStyle}>费用总金额：</span>
            <span style={formTContentStyle}>
              {Unit.exchangePriceCentToMathFormat(totalTaxDeductionAmount)}元
            </span>
          </div>
          <div style={formTWrapStyle}>
            <span style={formTLabelStyle}>总税金：</span>
            <span style={formTContentStyle}>
              {Unit.exchangePriceCentToMathFormat(totalTaxAmountAmount)}元
            </span>
          </div>
        </div>
      </div>
    );
  };

  // 费用单
  const renderCostOrderList = () => {
    const { costOrderList = [] } = detail;
    if (!costOrderList || !Array.isArray(costOrderList) || costOrderList.length < 1) {
      return '';
    }

    const formFWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '25%',
      display: 'flex',
    };
    const formLabelStyle = {
      width: '40%',
      textAlign: 'right',
    };
    const formContentStyle = {
      width: '58%',
      color: '#666',
      fontWeight: 500,
      wordBreak: 'break-word',
    };

    const formOWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '100%',
      display: 'flex',
    };
    const formOLabelStyle = {
      width: '10%',
      textAlign: 'right',
    };
    const formOContentStyle = {
      color: '#666',
      fontWeight: 500,
      width: '88%',
      wordBreak: 'break-word',
    };

    return (
      <div>
        <p
          style={{
            borderBottom: '1px solid rgb(204,204,204)',
            paddingBottom: 10,
            fontWeight: 500,
            fontSize: 14,
          }}
        >费用单</p>
        {
          costOrderList.map((costOrder, costKey) => {
            const {
              total_money: totalMoney = 0, // 提报及嗯
              total_tax_amount_amount: totalTaxAmountAmount = 0,
              type,
              bill_red_push_state: billRedPushState,
              payment_total_money: paymentTotalMoney = 0, // 付款金额
            } = costOrder;
            // 费用金额
            let costMoney = paymentTotalMoney;
            // 正常费用单 && 已红冲
            if (type === InvoiceAjustAction.normal && billRedPushState === CostOrderTicketPunchState.done) {
              costMoney = paymentTotalMoney - totalTaxAmountAmount;
            }

            // 核算中心
            let costCenterType = '--';
            // code
            if (dot.get(costOrder, 'cost_center_type') === CodeCostCenterType.code) {
              costCenterType = dot.get(costOrder, 'biz_code_info.name', '--');
            }

            // team
            if (dot.get(costOrder, 'cost_center_type') === CodeCostCenterType.team) {
              costCenterType = dot.get(costOrder, 'biz_team_info.name', '--');
            }


            return (
              <div
                key={costKey}
                style={{
                  borderBottom: '1px solid rgb(204,204,204)',
                  mariginBottom: '12px',
                  paddingBottom: 10,
                }}
              >
                <div style={formOWrapStyle}>
                  <span style={formOLabelStyle}>费用单号：</span>
                  <span style={formOContentStyle}>{costOrder._id}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <div style={formFWrapStyle}>
                    <span style={formLabelStyle}>科目：</span>
                    <span style={formContentStyle}>
                      {dot.get(costOrder, 'biz_account_info.name', '--')}
                      {
                        dot.get(costOrder, 'biz_account_info.ac_code')
                          ? `(${dot.get(costOrder, 'biz_account_info.ac_code')})`
                          : ''
                      }
                    </span>
                  </div>
                  <div style={formFWrapStyle}>
                    <span style={formLabelStyle}>核算中心：</span>
                    <span style={formContentStyle}>{costCenterType}</span>
                  </div>
                  <div style={formFWrapStyle}>
                    <span style={formLabelStyle}>提报金额：</span>
                    <span style={formContentStyle}>
                      {Unit.exchangePriceCentToMathFormat(totalMoney)}元
                    </span>
                  </div>
                  <div style={formFWrapStyle}>
                    <span style={formLabelStyle}>付款金额：</span>
                    <span style={formContentStyle}>
                      {Unit.exchangePriceCentToMathFormat(paymentTotalMoney)}元
                    </span>
                  </div>

                  <div style={formFWrapStyle}>
                    <span style={formLabelStyle}>费用金额：</span>
                    <span style={formContentStyle}>
                      {Unit.exchangePriceCentToMathFormat(costMoney)}元
                    </span>
                  </div>
                </div>
                <div style={formOWrapStyle}>
                  <span style={formOLabelStyle}>发票抬头：</span>
                  <span style={formOContentStyle}>{costOrder.invoice_title}</span>
                </div>
                <div style={formOWrapStyle}>
                  <span style={formOLabelStyle}>事项说明：</span>
                  <span style={formOContentStyle}>{costOrder.note || '--'}</span>
                </div>
                <div style={formOWrapStyle}>
                  <span style={formOLabelStyle}>附件：</span>
                  <span style={formOContentStyle}>
                    {
                      dot.get(costOrder, 'attachment_private_urls', []).map((fileUrl, fileKey) => {
                        return <p key={fileKey}>{fileUrl.file_name}</p>;
                      })
                    }
                  </span>
                </div>
                <div style={formOWrapStyle}>
                  <span style={formOLabelStyle}>收款信息：</span>
                  <span style={formOContentStyle}>{renderCostPayeeList(costOrder)}</span>
                </div>
                <div style={formOWrapStyle}>
                  <span style={formOLabelStyle}>发票信息：</span>
                  <span style={formOContentStyle}>{renderCostInvoiceInfo(costOrder)}</span>
                </div>
              </div>
            );
          })
      }
      </div>
    );
  };

  // 差旅明细
  const renderTravelCostDetail = (costOrder, isOaTravel) => {
    const formWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '20%',
      display: 'flex',
    };
    const formLabelStyle = {
      width: '55%',
      textAlign: 'right',
    };
    const formContentStyle = {
      width: '45%',
      color: '#666',
      fontWeight: 500,
      wordBreak: 'break-word',
    };

    // 明细
    const { travel_fee_extra_data: feeData = {} } = costOrder;
    const {
      subsidy_fee: subsidyFee, // 补助
      stay_fee: stayFee, // 住宿
      transport_fee: transportFee, // 往返交通费
      urban_transport_fee: urbanTransportFee, // 市内交通费
      other_fee: otherFee, // 其他
    } = feeData;

    return (
      <div
        style={{
          fontSize: 12,
          minHeight: 32,
          lineHeight: '32px',
          width: '100%',
        }}
      >
        <div>差旅费用明细：{isOaTravel ? (<span style={{ fontWeight: 400, marginLeft: 10 }}>明细超标将会用红色字体显示</span>) : ''}
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <div style={formWrapStyle}>
            <span style={formLabelStyle}>补助：</span>
            <span
              style={formContentStyle}
            >
              <span
                style={{
                // 判断是否超标
                  color: isOaTravel && dot.get(feeData, 'is_out_subsidy_fee', false) ? 'red' : '',
                }}
              >{Unit.exchangePriceCentToMathFormat(subsidyFee)}</span>元
            </span>
          </div>
          <div style={formWrapStyle}>
            <span style={formLabelStyle}>住宿：</span>
            <span
              style={formContentStyle}
            >
              <span
                style={{
                // 判断是否超标
                  color: isOaTravel && dot.get(feeData, 'is_out_stay_fee', false) ? 'red' : '',
                }}
              >
                {Unit.exchangePriceCentToMathFormat(stayFee)}
              </span>元
            </span>
          </div>
          <div style={formWrapStyle}>
            <span style={formLabelStyle}>市内交通费：</span>
            <span style={formContentStyle}>{Unit.exchangePriceCentToMathFormat(urbanTransportFee)}元</span>
          </div>
          {
            isOaTravel && dot.get(feeData, 'high_speed_train_fee') ? (
              <div style={formWrapStyle}>
                <span style={formLabelStyle}>动车/高铁交通费：</span>
                <span style={formContentStyle}>{Unit.exchangePriceCentToMathFormat(dot.get(feeData, 'high_speed_train_fee'))}元</span>
              </div>
            ) : ''
          }
          {
            isOaTravel && dot.get(feeData, 'aircraft_fee') ? (
              <div style={formWrapStyle}>
                <span style={formLabelStyle}>飞机交通费：</span>
                <span style={formContentStyle}>{Unit.exchangePriceCentToMathFormat(dot.get(feeData, 'aircraft_fee'))}元</span>
              </div>
            ) : ''
          }
          {
            isOaTravel && dot.get(feeData, 'train_ordinary_soft_sleeper_fee') ? (
              <div style={formWrapStyle}>
                <span style={formLabelStyle}>普通软卧交通费：</span>
                <span style={formContentStyle}>{Unit.exchangePriceCentToMathFormat(dot.get(feeData, 'train_ordinary_soft_sleeper_fee'))}元</span>
              </div>
            ) : ''
          }
          {
            isOaTravel && dot.get(feeData, 'bus_fee') ? (
              <div style={formWrapStyle}>
                <span style={formLabelStyle}>客车交通费：</span>
                <span style={formContentStyle}>{Unit.exchangePriceCentToMathFormat(dot.get(feeData, 'bus_fee'))}元</span>
              </div>
            ) : ''
          }
          {
            isOaTravel && dot.get(feeData, 'self_driving_fee') ? (
              <div style={formWrapStyle}>
                <span style={formLabelStyle}>自驾交通费：</span>
                <span style={formContentStyle}>{Unit.exchangePriceCentToMathFormat(dot.get(feeData, 'self_driving_fee'))}元</span>
              </div>
            ) : ''
          }
          {
            isOaTravel ? (transportFee ? (
              <div style={formWrapStyle}>
                <span style={formLabelStyle}>往返交通费：</span>
                <span style={formContentStyle}>{Unit.exchangePriceCentToMathFormat(transportFee)}元</span>
              </div>
            ) : '') : (
              <div style={formWrapStyle}>
                <span style={formLabelStyle}>往返交通费：</span>
                <span style={formContentStyle}>{Unit.exchangePriceCentToMathFormat(transportFee)}元</span>
              </div>
            )
          }
          {
            isOaTravel ? (otherFee ? (
              <div style={formWrapStyle}>
                <span style={formLabelStyle}>其他：</span>
                <span style={formContentStyle}>{Unit.exchangePriceCentToMathFormat(otherFee)}元</span>
              </div>
            ) : '') : (
              <div style={formWrapStyle}>
                <span style={formLabelStyle}>其他：</span>
                <span style={formContentStyle}>{Unit.exchangePriceCentToMathFormat(otherFee)}元</span>
              </div>
            )
          }

        </div>
      </div>
    );
  };

  // 差旅
  const renderTravelOrderList = () => {
    const { costOrderList = [] } = detail;
    if (!costOrderList || !Array.isArray(costOrderList) || costOrderList.length < 1) {
      return '';
    }

    const formTWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '33.33%',
      display: 'flex',
    };
    const formTLabelStyle = {
      width: '50%',
      textAlign: 'right',
    };
    const formTContentStyle = {
      width: '47%',
      color: '#666',
      fontWeight: 500,
      wordBreak: 'break-word',
    };

    const formOWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '100%',
      display: 'flex',
    };
    const formOLabelStyle = {
      width: '10%',
      textAlign: 'right',
    };
    const formOContentStyle = {
      color: '#666',
      fontWeight: 500,
      width: '88%',
    };

    const formTWOWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '33.33%',
      display: 'flex',
    };
    const formTWOLabelStyle = {
      width: '30%',
      textAlign: 'right',
    };
    const formTWOContentStyle = {
      color: '#666',
      fontWeight: 500,
      width: '68%',
    };

    return (
      <div>
        <p
          style={{
            borderBottom: '1px solid rgb(204,204,204)',
            paddingBottom: 10,
            fontWeight: 500,
            fontSize: 14,
          }}
        >费用单</p>
        {
        costOrderList.map((costOrder, costKey) => {
          const {
            travel_order_info: businessData = {}, // 出差信息
          } = costOrder;
          if (!businessData) return '';

          // 核算中心
          let costCenterType = '--';
          // code
          if (dot.get(costOrder, 'cost_center_type') === CodeCostCenterType.code) {
            costCenterType = dot.get(costOrder, 'biz_code_info.name', '--');
          }

          // team
          if (dot.get(costOrder, 'cost_center_type') === CodeCostCenterType.team) {
            costCenterType = dot.get(costOrder, 'biz_team_info.name', '--');
          }

          const {
            expect_start_at: expectStartAt, // 预计出差开始时间,
            expect_done_at: expectDoneAt, // 预计出差结束时间
            actual_start_at: actualStartAt, // 实际出差开始时间
            actual_done_at: actualDoneAt, // 实际出差结束时间
            departure, // 出发地
            destination_list: destinationList, // 目的地
            destination, // 目的地
          } = businessData;

          // 预计出差时间
          const expectAt = (expectStartAt && expectDoneAt) ?
            `${moment(expectStartAt).format('YYYY.MM.DD HH:00')} - ${moment(expectDoneAt).format('YYYY.MM.DD HH:00')}`
            : '--';

          // 实际出差时间
          const actualAt = (actualStartAt && actualDoneAt) ?
            `${moment(actualStartAt).format('YYYY.MM.DD HH:00')} - ${moment(actualDoneAt).format('YYYY.MM.DD HH:00')}`
            : '--';

          return (
            <div
              key={costKey}
              style={{
                borderBottom: '1px solid rgb(204,204,204)',
                mariginBottom: '12px',
                paddingBottom: 10,
              }}
            >
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>费用单号：</span>
                <span style={formOContentStyle}>{costOrder._id}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>出差单号：</span>
                  <span style={formTContentStyle}>
                    {businessData._id}
                  </span>
                </div>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>实际出差人：</span>
                  <span style={formTContentStyle}>
                    {dot.get(businessData, 'apply_user_name', '--')}
                  </span>
                </div>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>预计出差时间：</span>
                  <span style={formTContentStyle}>
                    {expectAt}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>实际出差时间：</span>
                  <span style={formTContentStyle}>
                    {actualAt}
                  </span>
                </div>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>出发地：</span>
                  <span style={formTContentStyle}>
                    {
                      Object.values(getDeparture(departure)).join('-')
                    }
                  </span>
                </div>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>目的地：</span>
                  <span style={formTContentStyle}>
                    {
                      getDestination(destinationList, destination).map(i => Object.values(i).join('-')).join(' 、')
                    }
                  </span>
                </div>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>出差天数：</span>
                  <span style={formTContentStyle}>
                    {dot.get(businessData, 'actual_apply_days', '--')}天
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={formTWOWrapStyle}>
                  <span style={formTWOLabelStyle}>科目：</span>
                  <span style={formTWOContentStyle}>
                    {dot.get(costOrder, 'biz_account_info.name', '--')}
                    {
                      dot.get(costOrder, 'biz_account_info.ac_code')
                        ? `(${dot.get(costOrder, 'biz_account_info.ac_code')})`
                        : ''
                    }
                  </span>
                </div>
                <div style={formTWOWrapStyle}>
                  <span style={formTWOLabelStyle}>核算中心：</span>
                  <span style={formTWOContentStyle}>{costCenterType}</span>
                </div>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>提报金额：</span>
                <span style={formOContentStyle}>
                  {Unit.exchangePriceCentToMathFormat(dot.get(costOrder, 'total_money', 0))}元
                </span>
              </div>
              {renderTravelCostDetail(costOrder)}
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>发票抬头：</span>
                <span style={formOContentStyle}>{costOrder.invoice_title}</span>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>事项说明：</span>
                <span style={formOContentStyle}>{costOrder.note || '--'}</span>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>附件：</span>
                <span style={formOContentStyle}>
                  {
                    dot.get(costOrder, 'attachment_private_urls', []).map((fileUrl, fileKey) => {
                      return <p key={fileKey}>{fileUrl.file_name}</p>;
                    })
                  }
                </span>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>收款信息：</span>
                <span style={formOContentStyle}>{renderCostPayeeList(costOrder)}</span>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>发票信息：</span>
                <span style={formOContentStyle}>{renderCostInvoiceInfo(costOrder)}</span>
              </div>
            </div>
          );
        })
      }
      </div>
    );
  };

  // code事务差旅
  const renderOaTravelOrderList = (isOaTravel) => {
    const { costOrderList = [] } = detail;
    if (!costOrderList || !Array.isArray(costOrderList) || costOrderList.length < 1) {
      return '';
    }

    const formTWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '33.33%',
      display: 'flex',
    };
    const formTLabelStyle = {
      width: '50%',
      textAlign: 'right',
    };
    const formTContentStyle = {
      width: '47%',
      color: '#666',
      fontWeight: 500,
      wordBreak: 'break-word',
    };

    const formOWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '100%',
      display: 'flex',
    };
    const formOLabelStyle = {
      width: '10%',
      textAlign: 'right',
    };
    const formOContentStyle = {
      color: '#666',
      fontWeight: 500,
      width: '88%',
    };

    const formTWOWrapStyle = {
      fontSize: 12,
      minHeight: 32,
      lineHeight: '32px',
      width: '50%',
      display: 'flex',
    };
    const formTWOLabelStyle = {
      width: '30%',
      textAlign: 'right',
    };
    const formTWOContentStyle = {
      color: '#666',
      fontWeight: 500,
      width: '68%',
    };

    return (
      <div>
        <p
          style={{
            borderBottom: '1px solid rgb(204,204,204)',
            paddingBottom: 10,
            fontWeight: 500,
            fontSize: 14,
          }}
        >费用单</p>
        {
        costOrderList.map((costOrder, costKey) => {
          const {
            travel_order_info: businessData = {}, // 出差信息
          } = costOrder;
          if (!businessData) return '';

          // 核算中心
          let costCenterType = '--';
          // code
          if (dot.get(costOrder, 'cost_center_type') === CodeCostCenterType.code) {
            costCenterType = dot.get(costOrder, 'biz_code_info.name', '--');
          }

          // team
          if (dot.get(costOrder, 'cost_center_type') === CodeCostCenterType.team) {
            costCenterType = dot.get(costOrder, 'biz_team_info.name', '--');
          }

          const {
            expect_start_at: expectStartAt, // 预计出差开始时间,
            expect_done_at: expectDoneAt, // 预计出差结束时间
            actual_start_at: actualStartAt, // 实际出差开始时间
            actual_done_at: actualDoneAt, // 实际出差结束时间
            departure, // 出发地
            destination_list: destinationList, // 目的地
            destination, // 目的地
          } = businessData;

          // 预计出差时间
          const expectAt = (expectStartAt && expectDoneAt) ?
            `${moment(expectStartAt).format('YYYY.MM.DD HH:00')} - ${moment(expectDoneAt).format('YYYY.MM.DD HH:00')}`
            : '--';

          // 实际出差时间
          const actualAt = (actualStartAt && actualDoneAt) ?
            `${moment(actualStartAt).format('YYYY.MM.DD HH:00')} - ${moment(actualDoneAt).format('YYYY.MM.DD HH:00')}`
            : '--';

          return (
            <div
              key={costKey}
              style={{
                borderBottom: '1px solid rgb(204,204,204)',
                mariginBottom: '12px',
                paddingBottom: 10,
              }}
            >
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>费用单号：</span>
                <span style={formOContentStyle}>{costOrder._id}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>出差单号：</span>
                  <span style={formTContentStyle}>
                    {businessData._id}
                  </span>
                </div>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>实际出差人：</span>
                  <span style={formTContentStyle}>
                    {dot.get(businessData, 'apply_user_name', '--')}
                  </span>
                </div>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>部门：</span>
                  <span style={formTContentStyle}>
                    {dot.get(businessData, 'department_info.name', '--')}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>岗位：</span>
                  <span style={formTContentStyle}>
                    {dot.get(businessData, 'job_info.name', '--')}
                  </span>
                </div>
                <div style={formTWrapStyle}>
                  <span style={formTLabelStyle}>职级：</span>
                  <span style={formTContentStyle}>
                    {dot.get(businessData, 'work_level', '--')}
                  </span>
                </div>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>预计出差时间：</span>
                <span style={formOContentStyle}>
                  {expectAt}
                </span>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>出发地：</span>
                <span style={formOContentStyle}>
                  {
                      Object.values(getDeparture(departure)).join('-')
                    }
                </span>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>目的地：</span>
                <span style={formOContentStyle}>
                  {
                      getDestination(destinationList, destination).map(i => Object.values(i).join('-')).join(' 、')
                    }
                </span>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={formTWOWrapStyle}>
                  <span style={formTWOLabelStyle}>实际出差时间：</span>
                  <span style={formTWOContentStyle}>
                    {actualAt}
                  </span>
                </div>
                <div style={formTWOWrapStyle}>
                  <span style={formTWOLabelStyle}>出差天数：</span>
                  <span style={formTWOContentStyle}>
                    {dot.get(businessData, 'actual_apply_days', '--')}
                    {
                      // 实际出差天数大于预计出差天数
                      dot.get(businessData, 'actual_apply_days') > dot.get(businessData, 'expect_apply_days') ?
                        (<span>（<span style={{ color: 'red' }}>申请出差天数：{dot.get(businessData, 'expect_apply_days')}天</span>）</span>) : ''
                    }
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={formTWOWrapStyle}>
                  <span style={formTWOLabelStyle}>科目：</span>
                  <span style={formTWOContentStyle}>
                    {dot.get(costOrder, 'biz_account_info.name', '--')}
                    {
                      dot.get(costOrder, 'biz_account_info.ac_code')
                        ? `(${dot.get(costOrder, 'biz_account_info.ac_code')})`
                        : ''
                    }
                  </span>
                </div>
                <div style={formTWOWrapStyle}>
                  <span style={formTWOLabelStyle}>核算中心：</span>
                  <span style={formTWOContentStyle}>{costCenterType}</span>
                </div>
              </div>
              {renderTravelCostDetail(costOrder, isOaTravel)}
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>提报金额：</span>
                <span style={formOContentStyle}>
                  {Unit.exchangePriceCentToMathFormat(dot.get(costOrder, 'total_money', 0))}元
                </span>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>发票抬头：</span>
                <span style={formOContentStyle}>{costOrder.invoice_title}</span>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>事项说明：</span>
                <span style={formOContentStyle}>{costOrder.note || '--'}</span>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>附件：</span>
                <span style={formOContentStyle}>
                  {
                    dot.get(costOrder, 'attachment_private_urls', []).map((fileUrl, fileKey) => {
                      return <p key={fileKey}>{fileUrl.file_name}</p>;
                    })
                  }
                </span>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>收款信息：</span>
                <span style={formOContentStyle}>{renderCostPayeeList(costOrder)}</span>
              </div>
              <div style={formOWrapStyle}>
                <span style={formOLabelStyle}>发票信息：</span>
                <span style={formOContentStyle}>{renderCostInvoiceInfo(costOrder)}</span>
              </div>
            </div>
          );
        })
      }
      </div>
    );
  };

  // 费用单
  const renderOrder = () => {
    const {
      template_type: templateType, // 模版类型
      costOrderList = [],
    } = detail;

    // 是否为事务差旅报销
    const isOaTravel = costOrderList.find(i => i.travel_order_type === CodeTravelState.oa);
    // 差旅
    if (templateType === CodeApproveOrderType.travel) {
      return isOaTravel ? renderOaTravelOrderList(isOaTravel) : renderTravelOrderList();
    }

    // 费用
    return renderCostOrderList();
  };

  // 流转记录
  const renderProcess = () => {
    const { orderRecordList } = detail;
    return <Process orderRecordList={orderRecordList} />;
  };

  return (
    <div
      style={{
        borderBottom: '2px dashed #000',
        margin: '0 10px',
      }}
    >
      {renderBasic()}
      {renderTab()}
      {renderOrder()}
      {renderProcess()}
    </div>
  );
};

export default PrintItem;
