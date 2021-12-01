/**
 * 审批单打印模板请假列表
 */
import moment from 'moment';
import dot from 'dot-prop';
import React, { Component } from 'react';
// import moment from 'moment';
import { ExpenseAttendanceTakeLeaveType } from '../../../../application/define';

class TakeLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // 渲染附件文件
  renderFiles = (filesUrl) => {
    return (
      <div>
        {
          filesUrl.map((item, index) => {
            return (
              <span style={{ marginRight: '10px' }} key={index}>{item.file_name}</span>
            );
          })
        }
      </div>
    );
  }

  render() {
    const {
      takeLeaveDetail, // 请假单详情
    } = this.props;

    return (
      <div style={{ padding: '0 16px', boxSizing: 'border-box', backgroundColor: 'rgb(247,247,247)', margin: '20px 0 0 0', overflow: 'hidden' }}>
        <div style={{ margin: '18px 8px' }} />
        <div>
          <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
            <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
            <span style={{ verticalAlign: 'text-bottom' }}>请假单</span>
          </div>
          {
            [takeLeaveDetail].map((item, index) => {
              return (
                <div key={index} style={{ padding: '8px', boxSizing: 'border-box', backgroundColor: '#fff', margin: '8px 0' }}>
                  <div>
                    请假申请单号: {item._id}
                  </div>
                  <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                    <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                      <span style={{ verticalAlign: 'text-bottom' }}>请假人信息</span>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>实际请假人: {dot.get(item, 'actual_apply_name', '--')}</div>
                      <div style={{ width: '35%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>联系方式: {dot.get(item, 'phone', '--')}</div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>项目: {dot.get(item, 'platform_name', undefined) || '--'}</div>
                      <div style={{ width: '35%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>城市: {dot.get(item, 'city_name', undefined) || '--'}</div>
                      <div style={{ width: '30%', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>团队: {dot.get(item, 'biz_district_name', undefined) || '--'}</div>
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                    <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                      <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                      <span style={{ verticalAlign: 'text-bottom' }}>请假信息</span>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>请假类型:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {dot.get(item, 'leave_type', 0) ? ExpenseAttendanceTakeLeaveType.description(dot.get(item, 'leave_type', 0)) : '--'}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>开始时间:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {moment(dot.get(item, 'start_at')).format('YYYY.MM.DD HH:mm:ss')}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>结束时间:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {moment(dot.get(item, 'end_at')).format('YYYY.MM.DD HH:mm:ss')}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>时长(小时):</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {dot.get(item, 'duration', undefined) || '--'}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>请假事由:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {dot.get(item, 'reason', undefined) || '--'}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>工作安排:</div>
                      <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                        {dot.get(item, 'work_placement', undefined) || '--'}
                      </div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ lineHeight: '28px', paddingLeft: '2px', boxSizing: 'border-box', overflow: 'hidden' }}>
                        <div style={{ width: '80px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box', textAlign: 'right' }}>上传附件:</div>
                        <div style={{ width: '87%', lineHeight: '28px', float: 'left', paddingLeft: '8px', boxSizing: 'border-box' }}>
                          {this.renderFiles(dot.get(item, 'file_url_list', []))}
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

export default TakeLeave;
