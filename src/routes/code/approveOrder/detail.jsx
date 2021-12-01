/**
 * code - 审批单详情
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Button } from 'antd';

import {
  CoreTabs,
} from '../../../components/core';
import BasicInfo from './component/detail/basicInfo';
import Cost from './component/detail/cost';
import ReleateOrder from './component/detail/relateOrder';
import Circulation from './component/detail/circulation';
import ThemeTags from './component/operation/themeTags';
import PaymentDetail from './component/detail/paymentDetail';

const ApproveOrderDetail = ({
  location,
  dispatch,
  approveOrderDetail = {}, // 审批单详情
}) => {
  // 审批流id
  const {
    orderId,
    isShowOperation,
  } = location.query;

  useEffect(() => {
    orderId && dispatch({
      type: 'codeOrder/getApproveOrderDetail',
      payload: { orderId },
    });

    return () => {
      dispatch({ type: 'codeOrder/resetApproveOrderDetail' });
    };
  }, [dispatch, orderId]);

  if (Object.keys(approveOrderDetail).length < 1) return <div />;

  // basicInfo prop
  const basicProps = {
    approveOrderDetail,
    dispatch,
  };

  // cost props
  const costProps = {
    approveOrderDetail, // 审批单详情
  };

  // relateOrder props
  const relateProps = {
    orderId,
  };

  // circulation props
  const circulationProps = {
    approveOrderDetail,
    dispatch,
  };

  // payee props
  const payeeProps = {
    detail: approveOrderDetail,
    isApproveOrder: true,
  };

  // tab
  const renderTab = () => {
    const tabItems = [
      // code
      {
        title: '关联审批',
        content: <ReleateOrder {...relateProps} />,
        key: 'relateOrder',
      },
       // code
      {
        title: '主题标签',
        content: <ThemeTags orderId={orderId} />,
        key: 'themeLabel',
      },
       // code
      {
        title: '付款明细',
        content: <PaymentDetail {...payeeProps} />,
        key: 'paymentDetail',
      },
    ];

    return (
      <CoreTabs items={tabItems} />
    );
  };

  // 操作
  const renderOption = () => {
    // 隐藏按钮
    if (isShowOperation === 'true') {
      return;
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <Button
          href={'/#/Code/PayOrder'}
        >
          返回
        </Button>
      </div>
    );
  };

  return (
    <React.Fragment>
      {/* 基本信息 */}
      <BasicInfo {...basicProps} />

      {/* 关联审批单/主题标签/付款信息 */}
      {renderTab()}

      {/* 费用单 */}
      <Cost {...costProps} />

      {/* 流转记录 */}
      <Circulation {...circulationProps} />

      {/* 返回操作 */}
      {renderOption()}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeOrder: { approveOrderDetail },
}) => {
  return { approveOrderDetail };
};

export default connect(mapStateToProps)(ApproveOrderDetail);
