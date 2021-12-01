/**
 * 审批单打印模板借款列表 Expense/Manage/Print/borrow
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { BorrowType, RepayCircle, RepayMethod, Unit } from '../../../../application/define';

class BorrowMoney extends Component {
  render() {
    const loanOrderList = this.props.examineOrder.loan_order_list;
    const loanOrRepaymentFileList = this.props.examineOrder.loan_or_repayment_file_list;
    const platformCode = dot.get(this.props, 'examineOrder.platform_codes', [])[0];
    return (
      <div style={{ padding: '0 16px', boxSizing: 'border-box', backgroundColor: 'rgb(247,247,247)', margin: '20px 0 0 0', overflow: 'hidden' }}>
        <div style={{ margin: '18px 8px' }} />
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
            <span style={{ verticalAlign: 'text-bottom' }}>借款单</span>
          </div>
          {
            loanOrderList.map((item, index) => {
              return (
                <div key={index} style={{ padding: '8px', boxSizing: 'border-box', backgroundColor: '#fff', margin: '8px 0' }}>
                  <div>
                    借款单号: {item._id}
                  </div>
                  <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                    <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                      <span style={{ verticalAlign: 'text-bottom' }}>借款人信息</span>
                    </div>
                    {
                      platformCode !== 'zongbu' ?
                        (
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>平台:{dot.get(item, 'platform_name', undefined) || '--'}</div>
                            <div style={{ width: '35%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>供应商: {dot.get(item, 'supplier_name', undefined) || '--'}</div>
                            <div style={{ width: '30%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>城市:{dot.get(item, 'city_name', undefined) || '--'}</div>
                          </div>
                        ) : ''
                    }
                    <div style={{ overflow: 'hidden' }}>
                      {
                        platformCode !== 'zongbu' ?
                        (
                          <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>商圈:{dot.get(item, 'biz_district_name', undefined) || '--'}</div>
                        ) : ''
                      }
                      <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>实际借款人: {dot.get(item, 'actual_loan_info.name', '--')}</div>
                      {
                        platformCode === 'zongbu' ?
                          (
                            <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>团队信息:{dot.get(item, 'actual_loan_info.department_name', undefined) || '--'}</div>
                          ) : ''
                      }
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>身份证号码:{dot.get(item, 'actual_loan_info.identity', '--')}</div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>借款联系人方式:{dot.get(item, 'actual_loan_info.phone', '--')}</div>
                      <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>收款账户: {dot.get(item, 'payee_account_info.card_num', '--')}</div>
                      <div style={{ width: '30%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>开户支行:{dot.get(item, 'payee_account_info.bank_details', '--')}</div>
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                    <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                      <span style={{ verticalAlign: 'text-bottom' }}>借款信息</span>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>借款金额(元):</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {dot.get(item, 'loan_money', 0) ? Unit.exchangePriceCentToMathFormat(dot.get(item, 'loan_money', 0)) : '--'}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>借款类型:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {dot.get(item, 'loan_type', 0) ? BorrowType.description(dot.get(item, 'loan_type', 0)) : '--'}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>借款事由:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>{dot.get(item, 'loan_note', '--')}</div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>上传附件:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {
                          loanOrRepaymentFileList.map((file, fileIndex) => {
                            return (
                              <p style={{ margin: 0 }} key={fileIndex}>{file.file_name}</p>
                            );
                          })
                        }
                      </div>
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                    <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                      <span style={{ verticalAlign: 'text-bottom' }}>还款信息</span>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '35%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                        还款方式:{dot.get(item, 'repayment_method', 0) ? RepayMethod.description(dot.get(item, 'repayment_method', 0)) : '--'}
                      </div>
                      <div style={{ width: '35%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                        还款周期:{dot.get(item, 'repayment_cycle', 0) ? RepayCircle.description(dot.get(item, 'repayment_cycle', 0)) : '--'}
                      </div>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>预计还款时间:{
                        dot.get(item, 'expected_repayment_time', undefined) || '--'
                      }</div>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
export default BorrowMoney;
