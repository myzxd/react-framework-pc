/**
 * 审批单打印模板还款列表 Expense/Manage/Print/repayment
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { BorrowType, RepayCircle, RepayMethod, Unit } from '../../../../application/define';

class Repayment extends Component {
  render() {
    const repaymentOrderList = this.props.examineOrder.repayment_order_list;
    const loanOrRepaymentFileList = this.props.examineOrder.loan_or_repayment_file_list;
    return (
      <div style={{ padding: '0 16px', boxSizing: 'border-box', backgroundColor: 'rgb(247,247,247)', margin: '20px 0 0 0', overflow: 'hidden' }}>
        <div style={{ margin: '18px 8px' }} />
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
            <span style={{ verticalAlign: 'text-bottom' }}>还款单</span>
          </div>
          {
            repaymentOrderList.map((item, index) => {
              return (
                <div key={index} style={{ padding: '8px', boxSizing: 'border-box', backgroundColor: '#fff', margin: '8px 0' }}>
                  <div>
                    还款单号: {item._id}
                  </div>
                  <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                    <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                      <span style={{ verticalAlign: 'text-bottom' }}>借款信息</span>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>借款单号:{dot.get(item, 'loan_order_id', '--')}</div>
                      <div style={{ width: '35%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>借款类型:
                        {dot.get(item, 'loan_order_info.loan_type', 0) ? BorrowType.description(dot.get(item, 'loan_order_info.loan_type', 0)) : '--'}
                      </div>
                      <div style={{ width: '30%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>借款事由:{dot.get(item, 'loan_order_info.loan_note', '--')}</div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>申请人:{dot.get(item, 'apply_account_info.name', '--')}</div>
                      <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>实际借款人: {dot.get(item, 'loan_order_info.actual_loan_info.name', '--')}</div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                        借款金额 (元):{Unit.exchangePriceCentToMathFormat(dot.get(item, 'loan_order_info.loan_money', 0))}
                      </div>
                      <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                        已还金额 (元): {Unit.exchangePriceCentToMathFormat(dot.get(item, 'loan_order_info.repayment_money', 0))}
                      </div>
                      <div style={{ width: '30%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                        未还金额 (元):{Unit.exchangePriceCentToMathFormat(dot.get(item, 'loan_order_info.non_repayment_money', 0))}
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
                        还款方式:{dot.get(item, 'loan_order_info.repayment_method', 0) ? RepayMethod.description(dot.get(item, 'loan_order_info.repayment_method', 0)) : '--'}
                      </div>
                      <div style={{ width: '35%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                        还款周期:{dot.get(item, 'loan_order_info.repayment_cycle', 0) ? RepayCircle.description(dot.get(item, 'loan_order_info.repayment_cycle', 0)) : '--'}
                      </div>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>
                        还款金额(元):{dot.get(item, 'repayment_money', 0) ? Unit.exchangePriceCentToMathFormat(dot.get(item, 'repayment_money', 0)) : '--'}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ lineHeight: '28px', paddingLeft: '2px', boxSizing: 'border-box', overflow: 'hidden' }}>
                        <div style={{ float: 'left', width: '36px' }}>备注:</div>
                        <div style={{ float: 'left', width: '82%' }}>{dot.get(item, 'repayment_note', '--') || '--'}</div>
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ lineHeight: '28px', paddingLeft: '2px', boxSizing: 'border-box', overflow: 'hidden' }}>
                        <div style={{ float: 'left', width: '60px' }}>上传附件:</div>
                        <div style={{ float: 'left', width: '66%' }}>
                          {
                            loanOrRepaymentFileList.map((file, fileIndex) => {
                              return <p style={{ margin: 0 }} key={fileIndex}>{file.file_name}</p>;
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
      </div>
    );
  }
}
export default Repayment;
