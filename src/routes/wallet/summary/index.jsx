/**
 * 趣活钱包 - 钱包汇总
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Row,
  Col,
  Tooltip,
} from 'antd';
import {
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Unit,
} from '../../.../../../application/define';

import style from './style.less';

const Summary = ({
  walletSummary = {},
  dispatch,
}) => {
  useEffect(() => {
    dispatch({
      type: 'wallet/getWalletSummary',
      payload: {},
    });
    return () => {
      dispatch({
        type: 'wallet/resetWalletSummary',
      });
    };
  }, [dispatch]);

  const {
    total_unpaid_money: totalMoney = 0,
    bill_counts: billCounts = 0,
  } = walletSummary;

  // money layout
  // const renderMoneyLayout = (info, key) => {
    // return (
      // <Col span={6} key={key}>
        // <div className={key === 3 ? style['wallet-summary-money-last-wrap'] : style['wallet-summary-money-wrap']}>
          // <div
            // className={style['wallet-summary-money-title']}
          // >{info.title}</div>
          // <div
            // className={style['wallet-summary-money-num']}
          // >￥{info.num}</div>
        // </div>
      // </Col>
    // );
  // };

  // 汇总金额
  const renderTotalMoney = () => {
    return (
      <Row className={style['wallet-summary-total-money-row']}>
        <Col span={6}>
          <div className={style['wallet-summary-total-money-wrap']}>
            <div className={style['wallet-summary-total-money-title']}>
              <span>本月待支付金额</span>
              <Tooltip title="截止查看时点，账单状态为「待支付」和「支付中」全部需要支付的金额合计数">
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <div
              className={style['wallet-summary-total-money-num']}
            >{Unit.exchangePriceCentToMathFormat(totalMoney)}</div>
            <div
              className={style['wallet-summary-total-money-footer']}
            >请确保账户中有足够的金额</div>
          </div>
        </Col>
        <Col span={6}>
          <div className={style['wallet-summary-total-money-wrap']}>
            <div className={style['wallet-summary-total-money-title']}>
              <span>本月待支付账单数</span>
              <Tooltip title="截止查看时点，账单状态为「待支付」和「支付中」的账单合计数">
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <div
              className={style['wallet-summary-total-money-num']}
            >{billCounts}</div>
            {/*
              <div
              className={style['wallet-summary-total-money-footer']}
              >包含审批单数量 1000</div>
            */}
            <div
              className={style['wallet-summary-total-money-footer']}
            />
          </div>
        </Col>
      </Row>
    );
  };

  // 明细金额
  // const renderMoney = () => {
    // const moneyData = [
      // { title: '累计已支付', num: '50000' },
      // { title: '累计员工提现', num: '50000' },
      // { title: '本月已支付', num: '50000' },
      // { title: '本月员工提现', num: '50000' },
    // ];

    // return (
      // <Row className={style['wallet-summary-money-row-wrap']}>
        // {
          // moneyData.map((i, key) => renderMoneyLayout(i, key))
        // }
      // </Row>
    // );
  // };

  return (
    <React.Fragment>
      {renderTotalMoney()}
      {/* renderMoney() */}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  wallet: { walletSummary },
}) => {
  return { walletSummary };
};

export default connect(mapStateToProps)(Summary);
