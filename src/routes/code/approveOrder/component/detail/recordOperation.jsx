/**
 * code - 审批单详情 - 流转记录 - 审批操作
 */
import React, { useState } from 'react';

import Consent from '../operation/consent'; // 同意审批
import Disallowance from '../operation/disallowance'; // 驳回审批
import SupplementOpinion from '../operation/supplementOpinion'; // 补充意见

import AddTicketTag from '../operation/addTicket'; // 添加发票
import CheckTicket from '../operation/checkTicket'; // 完成验票
import TicketAbnormal from '../operation/ticketAbnormal'; // 标记验票异常
import CcDrawer from '../operation/ccDrawer/index';

import style from '../style.less';

const RecordOperation = ({
  dispatch,
  approveOrderDetail = {}, // 审批单详情
  recordDetail = {}, // 流转记录
}) => {
  // 灵活抄送信息
  const [ccInfo, setCcInfo] = useState({});
  // consent props
  const props = {
    dispatch,
    recordDetail,
    approveOrderDetail,
    className: style['code-circulation-approve-operation'],
  };

  // 可操作字段列表
  const { handle_list: handleList = [] } = recordDetail;

  if (!Array.isArray(handleList) || handleList.length < 1) return <div />;

  return (
    <React.Fragment>
      {/* 补充意见*/}
      {handleList.includes('add_extra') && (<SupplementOpinion {...props} />)}

      {/* 同意审批 */}
      {handleList.includes('approved') && (<Consent {...props} ccInfo={ccInfo} />)}

      {/* 驳回审批 */}
      {handleList.includes('reject') && (<Disallowance {...props} />)}

      {/* 添加验票标签 */}
      {handleList.includes('ticket_tag') && (<AddTicketTag {...props} />)}

      {/* 完成验票 */}
      {handleList.includes('inspect_ticket') && (<CheckTicket {...props} />)}

      {/* 标记验票异常 */}
      {handleList.includes('abnormal_inspect_ticket') && (<TicketAbnormal {...props} />)}

      {/* 添加抄送 */}
      {handleList.includes('add_flexible_carbon_copy') && (<CcDrawer {...props} setCcInfo={setCcInfo} />)}
    </React.Fragment>
  );
};

export default RecordOperation;

