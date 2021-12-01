/**
 * 审批单打印模板加班列表
 */
import moment from 'moment';
import React from 'react';
import dot from 'dot-prop';
import { ExpenseOverTimeThemeTag } from '../../../../application/define';

const OverTime = (props) => {
  const {
    overTimeDetail, // 加班单详情
  } = props;

  const {
    file_url_list: fileList = [],
  } = overTimeDetail;

  return (
    <div style={{ padding: '0 16px', boxSizing: 'border-box', backgroundColor: 'rgb(247,247,247)', margin: '20px 0 0 0', overflow: 'hidden' }}>
      <div style={{ margin: '18px 8px' }} />
      <div>
        <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
          <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
          <span style={{ verticalAlign: 'text-bottom' }}>加班单</span>
        </div>
        {
          [overTimeDetail].map((item, index) => {
            return (
              <div key={index} style={{ padding: '8px', boxSizing: 'border-box', backgroundColor: '#fff', margin: '8px 0' }}>
                <div>
                  加班单号: {item._id}
                </div>
                <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                  <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                    <span style={{ verticalAlign: 'text-bottom' }}>加班人信息</span>
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>实际加班人:{dot.get(item, 'actual_apply_name', '--')}</div>
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>项目:{dot.get(item, 'platform_name', '--')}</div>
                    <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>城市: {dot.get(item, 'city_name', '--')}</div>
                    <div style={{ width: '35%', height: '28px', lineHeight: '28px', float: 'left', paddingLeft: '2px', boxSizing: 'border-box' }}>团队: {dot.get(item, 'biz_district_name', '--')}</div>
                  </div>
                </div>
                <div style={{ backgroundColor: 'rgb(247,247,247)', padding: '14px', boxSizing: 'border-box', marginTop: '6px' }}>
                  <div style={{ borderBottom: '1px solid rgb(204,204,204)', height: '26px' }}>
                    <span style={{ display: 'inline-block', width: '4px', height: '12px', backgroundColor: 'rgb(138,138,138)', marginRight: '10px' }} />
                    <span style={{ verticalAlign: 'text-bottom' }}>加班信息</span>
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ height: '28px', lineHeight: '28px' }}>主题标签: {ExpenseOverTimeThemeTag.description(dot.get(item, 'tags')[0])}</div>
                    <div style={{ height: '28px', lineHeight: '28px' }}>标准工时: {dot.get(item, 'working_hours', '--')}</div>
                    <div style={{ height: '28px', lineHeight: '28px' }}>资料地址: {dot.get(item, 'info_address', '--')}</div>
                    <div style={{ height: '28px', lineHeight: '28px' }}>开始时间: {moment(dot.get(item, 'start_at')).format('YYYY.MM.DD HH:mm:ss')}</div>
                    <div style={{ height: '28px', lineHeight: '28px' }}>结束时间: {moment(dot.get(item, 'end_at')).format('YYYY.MM.DD HH:mm:ss')}</div>
                    <div style={{ height: '28px', lineHeight: '28px' }}>时长（小时）: {dot.get(item, 'duration', '--')}</div>
                    <div style={{ height: '28px', lineHeight: '28px' }}>加班事由及成果: {dot.get(item, 'reason', '--')}</div>
                    <div style={{ height: '28px', lineHeight: '28px' }}>
                      <div style={{ float: 'left', width: '60px' }}>上传附件:</div>
                      <div style={{ float: 'left', width: '66%' }}>
                        {
                          fileList.map((file, fileIndex) => {
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
};

export default OverTime;
