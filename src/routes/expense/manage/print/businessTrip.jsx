/**
 * 审批单打印模板出差列表 Expense/Manage/Print/BusinessTrip
 */
import React, { Component } from 'react';
import moment from 'moment';
import { ExpenseBusinessTripType, ExpenseBusinessTripWay } from '../../../../application/define';
// import dot from 'dot-prop';
// import { BorrowType, RepayCircle, RepayMethod, Unit } from '../../../../application/define';

class BusinessTrip extends Component {
  render() {
    const { examineOrder } = this.props;
    const businessInfo = examineOrder.business_travel_order_info;
    const loanOrderList = [1];
    // const loanOrderList = this.props.examineOrder.loan_order_list;
    // const loanOrRepaymentFileList = this.props.examineOrder.loan_or_repayment_file_list;
    return (
      <div style={{ padding: '0 16px', boxSizing: 'border-box', backgroundColor: 'rgb(247,247,247)', margin: '20px 0 0 0', overflow: 'hidden' }}>
        <div style={{ margin: '18px 8px' }} />
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
            <span style={{ verticalAlign: 'text-bottom' }}>出差单</span>
          </div>
          {
            loanOrderList.map((item, index) => {
              return (
                <div key={index} style={{ padding: '8px', boxSizing: 'border-box', backgroundColor: '#fff', margin: '8px 0' }}>
                  <div>
                    出差申请单号: {examineOrder.business_travel_order_id}
                  </div>
                  <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                    <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                      <span style={{ verticalAlign: 'text-bottom' }}>出差人信息</span>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>实际出差人: {businessInfo.apply_user_name}</div>
                      <div style={{ width: '35%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>联系方式: {businessInfo.apply_user_phone}</div>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>同行人员: {businessInfo.together_user_names.join(', ')}</div>
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                    <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                      <span style={{ verticalAlign: 'text-bottom' }}>出差信息</span>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>出差类别:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {ExpenseBusinessTripType.description(businessInfo.biz_type)}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>出差方式:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {businessInfo.transport_kind.map((ite) => {
                          return `${ExpenseBusinessTripWay.description(ite)} `;
                        })}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>出发地:</div>
                      <div style={{ width: '40%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {`${businessInfo.departure.province_name}${businessInfo.departure.city_name || ''}${businessInfo.departure.area_name || ''}${businessInfo.departure.detailed_address}`}
                      </div>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>目的地:{`${businessInfo.destination.province_name}${businessInfo.destination.city_name || ''}${businessInfo.destination.area_name || ''}${businessInfo.destination.detailed_address}`}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>预计出差时间:</div>
                      <div style={{ width: '40%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {moment(businessInfo.expect_start_at).format('YYYY-MM-DD HH:mm:ss')} -- {moment(businessInfo.expect_done_at).format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>出差天数: {businessInfo.expect_apply_days}天</div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>原由及说明:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {businessInfo.note}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>工作安排:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {businessInfo.working_plan}
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

export default BusinessTrip;
