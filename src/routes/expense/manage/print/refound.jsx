/**
 * 审批退款单打印的打印区域费用单组件 Expense/Manage/Print/Cost
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import is from 'is_js';

import { ExpenseCostOrderBelong, Unit } from '../../../../application/define';

class Cost extends Component {
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
  getName = (itemChild) => {
    const { platform_name: platformName,
      supplier_name: supplierName,
      city_name: cityName,
      biz_district_name: bizDistrictName,
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
    return name;
  }
  render() {
    const { originalDate = [] } = this.props;
    // 如果数据为空 就不打印
    if (originalDate.length === 0) {
      return '';
    }
    return (
      <div style={{ boxSizing: 'border-box', backgroundColor: 'rgb(247,247,247)', margin: '20px 0 0 0', overflow: 'hidden' }}>
        <div style={{ margin: '18px 8px' }} />
        <div style={{ borderTop: '1px solid rgb(204,204,204)', height: '26px', textAlign: 'center' }}>
          <div style={{ color: 'rgba(0,0,0,0.65)', fontSize: '18px' }}>退款单申请单</div>
        </div>
        {
          originalDate.map((item, index) => {
            return (
              <div key={index} >
                <div style={{ padding: '14px', boxSizing: 'border-box' }}>
                  费用单号: {item._id}
                </div>
                <div style={{ padding: '0 40px', boxSizing: 'border-box' }} >
                  <div style={{ height: '28px' }}>
                    <div style={{ width: '33%', height: '28px', lineHeight: '28px', float: 'left' }}>退款金额:{item.total_money !== undefined ? Unit.exchangePriceToYuan(item.total_money) : '--'}元</div>
                    <div style={{ width: '33%', height: '28px', lineHeight: '28px', float: 'left' }}>费用分组:{item.cost_group_name}</div>
                    <div style={{ width: '33%', height: '28px', lineHeight: '28px', float: 'left' }}>科目:{item.cost_accounting_info.name}{item.cost_accounting_code}({item.cost_accounting_info.accounting_code})</div>
                  </div>
                  <div style={{ height: '28px', lineHeight: '28px' }}>成本分摊：{ExpenseCostOrderBelong.description(dot.get(item, 'allocation_mode'))}</div>
                  {item.cost_allocation_list.map((itemChild, childIndex) => {
                    return (
                      <div key={childIndex} style={{ paddingLeft: '30px', boxSizing: 'border-box', marginBottom: '10px' }}>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ width: '70%', float: 'left' }}>{this.getName(itemChild)}</div>
                          {itemChild.money ?
                            <div style={{ width: '20%', float: 'right' }}>分摊金额：{Unit.exchangePriceToYuan(dot.get(itemChild, 'money', '--'))}元</div> : ''
                          }
                          <div style={{ width: '23%', float: 'left' }}>当月已提报费用合计：{this.getSubmitSummary(itemChild)}元</div>
                          <div style={{ width: '23%', float: 'right' }}>当月已付款费用合计：{this.getAmountSummary(itemChild)}元</div>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ float: 'left', width: '60px' }}>发票抬头：</div>
                    <div style={{ float: 'left', width: '88%' }}>
                      {item.invoice_title ? item.invoice_title : '--'}
                    </div>
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ float: 'left', width: '60px' }}>退款说明：</div>
                    <div style={{ float: 'left', width: '88%' }}>
                      {item.note}
                    </div>
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ float: 'left', width: '60px' }}>上传附件：</div>
                    <div style={{ float: 'left', width: '89%' }}>
                      <div style={{ display: 'inline-block', marginRight: '30px' }}>
                        {
                          item.attachments.map((child, childIndex) => {
                            return <span key={childIndex} style={{ display: 'inline-block', marginRight: '30px' }}>{child}</span>;
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Cost;
