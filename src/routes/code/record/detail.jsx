/**
 * code - 记录明细 - 详情
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';

import BasicInfo from './component/basicInfo';
import PaymentInfo from './component/paymentInfo';
import InvoiceInfo from './component/invoiceInfo';

const Detail = ({
  dispatch,
  location,
  recordDetail = {}, // 记录明细详情
}) => {
  // 记录明细id
  const { recordId } = location.query;

  useEffect(() => {
    dispatch({
      type: 'codeRecord/getRecordDetail',
      payload: { recordId },
    });
    return () => {
      dispatch({ type: 'codeRecord/resetRecordDetail' });
    };
  }, [dispatch, recordId]);

  return (
    <React.Fragment>
      {/* 基本信息 */}
      <BasicInfo detail={recordDetail} />

      {/* 收款信息 */}
      <PaymentInfo detail={recordDetail} />

      {/* 发票信息 */}
      <InvoiceInfo detail={recordDetail} />
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeRecord: { recordDetail },
}) => {
  return { recordDetail };
};
export default connect(mapStateToProps)(Detail);
