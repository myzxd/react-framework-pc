/* eslint-disable import/no-dynamic-require */
/**
 * 发起审批 - 费控管理 /OA/Document
 * */
import React, { useState } from 'react';

import Style from './style.less';
import PageFlowCreateModal from '../../../oa/document/components/expense/modal';
import {
  OaApplicationOrderType,
} from '../../../../application/define';

function PageExpenseButton(props) {
  const [visible, setVisable] = useState(false);
  // 隐藏弹窗
  const onHideModal = () => {
    setVisable(false);
  };

  // 显示弹窗
  const onShowModal = () => {
    const { type } = props;
    // 还款申请
    if (Number(type) === OaApplicationOrderType.repayments) {
      window.location.href = '/#/Expense/BorrowingRepayments/Borrowing';
      return;
    }
    setVisable(true);
  };

  // 渲染页面
  const render = () => {
    // 渲染节点数据
    const { type, title, icon, isShow } = props;
    // 判断是否有页面权限
    if (isShow !== true) {
      return null;
    }
    return (
      <React.Fragment>
        <div
          className={Style['app-comp-oa-card']}
          key={`group-${title}`}
        >
          <img
            src={require(`../../static/${icon}`)}
            alt=""
            onClick={() => { onShowModal(); }}
          />
          <span
            style={{ marginLeft: 4 }}
            onClick={() => { onShowModal(); }}
          >{title}</span>

        </div>
        {/* 渲染弹窗 */}
        {visible ? <PageFlowCreateModal title={title} visible={visible} onCancel={onHideModal} type={type} /> : null}
      </React.Fragment>
    );
  };
  return render();
}

export default PageExpenseButton;
