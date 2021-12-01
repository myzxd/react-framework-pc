/**
 * code - 审批单详情 - 费用单信息
 */
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import {
  Collapse,
  Empty,
} from 'antd';

import {
  Unit,
  CodeApproveOrderType,
  InvoiceAjustAction,
  CostOrderTicketPunchState,
} from '../../../../../application/define';
import {
  CoreContent,
} from '../../../../../components/core';
import CostItem from './costItem';
import Travel from './travel';
import Transfer from './transfer';
import UpdateMoney from './updateMoney';

import style from '../style.less';

const { Panel } = Collapse;

const Cost = ({
  approveOrderDetail = {}, // 审批单详情
  costOrderList = {}, // 费用单列表
  dispatch,
}) => {
  const [activeKey, setActiveKey] = useState([]);
  // 修改金额弹窗visible
  const [updateMoneyVis, setUpdateMoneyVis] = useState(false);
  // 费用单详情
  const [costOrderDetail, setCostOrderDetail] = useState({});

  // 费用单ids，费用单列表
  const {
    _id: orderId, // 审批单id
    biz_order_ids: costOrderIds = [], // 审批单关联单据ids
    paid_money: paidMoney = 0, // 合计金额
  } = approveOrderDetail;

  useEffect(() => {
    dispatch({
      type: 'codeOrder/getCostOrderList',
      payload: { orderId },
    });

    return () => {
      dispatch({
        type: 'codeOrder/resetCostOrderList',
      });
    };
  }, [dispatch, orderId]);

  const { data = [] } = costOrderList;

  // 无数据
  if (!Array.isArray(data) || data.length < 1) {
    return (
      <CoreContent title="费用单">
        <Empty />
      </CoreContent>
    );
  }

  // 修改金额
  const onUpdateMoney = (e, cost) => {
    // 阻止事件冒泡
    e && e.stopPropagation();
    // 当前操作的费用单详情
    setCostOrderDetail(cost);
    // 修改金额modal visible
    setUpdateMoneyVis(true);
  };

  // 隐藏修改金额modal
  const onCancelUpdateMoneyModal = () => {
    // 当前操作的费用单详情
    setCostOrderDetail({});
    // 修改金额modal visible
    setUpdateMoneyVis(false);
  };

  // 展开/收起全部
  const onChangeCollapse = () => {
    if (activeKey.length === costOrderIds.length) {
      setActiveKey([]);
    } else {
      setActiveKey(costOrderIds);
    }
  };

  // titleExt
  const titleExt = (
    <span onClick={onChangeCollapse} style={{ cursor: 'pointer' }}>
      {activeKey.length !== costOrderIds.length ? '全部展开' : '全部收起'}
    </span>
  );

  // 渲染对应模版
  const renderStencil = (cost) => {
    const {
      template_type: templateType, // 模版类型
    } = approveOrderDetail;
    const itemProps = {
      cost,
      orderId,
      approveOrderDetail,
    };

    // 差旅报销
    if (templateType === CodeApproveOrderType.travel) {
      return <Travel key={cost._id} {...itemProps} />;
    }

    // 内部划账
    if (templateType === CodeApproveOrderType.transfer) {
      return <Transfer key={cost._id} {...itemProps} />;
    }

    return <CostItem key={cost._id} {...itemProps} />;
  };

  // footer
  const renderFooter = () => {
    // 费用单税金汇总
    const totalTax = data.reduce((ac, cr) => ac + cr.total_tax_amount_amount, 0);
    return (
      <div className={style['code-order-cost-footer']}>
        <span>
          <span className={style['code-order-cost-header-tax']}>
            <span
              className={style['code-order-cost-header-money-text']}
            >总税金：</span>
            <span>{Unit.exchangePriceCentToMathFormat(totalTax)}元</span>
          </span>
          <span>
            <span
              className={style['code-order-cost-header-money-text']}
            >合计金额：</span>
            <span>{Unit.exchangePriceCentToMathFormat(paidMoney)}元</span>
          </span>
        </span>
      </div>
    );
  };

  // 修改金额modal
  const renderUpdateMoneyModal = () => {
    if (!updateMoneyVis) return;
    return (
      <UpdateMoney
        visible={updateMoneyVis}
        dispatch={dispatch}
        onCancel={onCancelUpdateMoneyModal}
        detail={costOrderDetail}
        approveOrderDetail={approveOrderDetail}
      />
    );
  };

  return (
    <CoreContent
      title="费用单 （提示：橘色的审批单为提报金额与付款金额不一致的单据！）"
      titleExt={titleExt}
    >
      <Collapse
        activeKey={activeKey}
        onChange={v => setActiveKey(v)}
      >
        {
          data.map((cost) => {
            const {
              total_money: costTotalMoney = 0, // 提报金额
              total_tax_amount_amount: totalTaxAmountAmount = 0, // 费用单税金
              type, // 费用单类型（正常 || 红冲）
              bill_red_push_state: billRedPushState, // 红冲状态
              payment_total_money: paymentTotalMoney = 0, // 付款金额
              allow_update_money: allowUpdateMoney = false, // 费用单金额是否可调控
            } = cost;

            // 费用金额
            let costMoney = paymentTotalMoney;
            // 正常费用单 && 已红冲
            if (type === InvoiceAjustAction.normal && billRedPushState === CostOrderTicketPunchState.done) {
              costMoney = paymentTotalMoney - totalTaxAmountAmount;
            }

            const header = (
              <div className={style['code-order-cost-header']}>
                <span>
                  <span>费用单号：</span>
                  <span
                    style={
                      costTotalMoney !== paymentTotalMoney ? {
                        color: '#FF7700',
                      } : null
                    }
                  >{cost._id}</span>
                </span>
                <span>
                  <span className={style['code-order-cost-header-tax']}>
                    <span
                      className={style['code-order-cost-header-money-text']}
                    >税金：</span>
                    <span>{Unit.exchangePriceCentToMathFormat(totalTaxAmountAmount)}元</span>
                  </span>
                  <span className={style['code-order-cost-header-tax']}>
                    <span
                      className={style['code-order-cost-header-money-text']}
                    >提报金额：</span>
                    <span>{Unit.exchangePriceCentToMathFormat(costTotalMoney)}元</span>
                  </span>
                  <span className={style['code-order-cost-header-tax']}>
                    <span
                      className={style['code-order-cost-header-money-text']}
                    >付款金额：</span>
                    <span>{Unit.exchangePriceCentToMathFormat(paymentTotalMoney)}元</span>
                  </span>
                  <span className={style['code-order-cost-header-tax']}>
                    <span
                      className={style['code-order-cost-header-money-text']}
                    >费用金额：</span>
                    <span>{Unit.exchangePriceCentToMathFormat(costMoney)}元</span>
                  </span>
                  {
                    // 系统设置为可以调整金额
                    // 当前审批节点为付款节点
                    // 正常的费用单
                    allowUpdateMoney
                      && (
                        <a
                          onClick={e => onUpdateMoney(e, cost)}
                          style={{ color: '#FF7700' }}
                        >修改金额</a>
                      )
                  }
                </span>
              </div>
            );

            return (
              <Panel header={header} key={cost._id}>
                {renderStencil(cost)}
              </Panel>
            );
          })
        }
      </Collapse>
      {/* 修改金额modal */}
      {renderUpdateMoneyModal()}

      {/* footer */}
      {renderFooter()}
    </CoreContent>
  );
};

const mapStateToProps = ({
  codeOrder: { costOrderList },
}) => {
  return { costOrderList };
};

export default connect(mapStateToProps)(Cost);
