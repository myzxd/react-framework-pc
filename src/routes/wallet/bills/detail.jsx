/**
 * 趣活钱包 - 支付账单 - 账单详情
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';

import BasicInfo from './component/basic';
import Approval from './component/approval';
import Payee from './component/payee';

const Detail = ({
  dispatch,
  walletBillDetail = {}, // 支付账单详情
  location = {},
}) => {
  const { id } = location.query;
  useEffect(() => {
    id && dispatch({
      type: 'wallet/getWalletBillDetail',
      payload: { id },
    });
    return () => {
      dispatch({
        type: 'wallet/resetWalletBillDetail',
      });
    };
  }, [dispatch, id]);

  return (
    <div>
      <BasicInfo detail={walletBillDetail} />
      <Approval detail={walletBillDetail} />
      <Payee detail={walletBillDetail} dispatch={dispatch} />
    </div>
  );
};

const mapStateToProps = ({
  wallet: { walletBillDetail },
}) => {
  return { walletBillDetail };
};
export default connect(mapStateToProps)(Detail);
