/* eslint-disable import/no-dynamic-require */
/**
 * 发起审批 - 费控管理 /OA/Document
 * */
import React, { useState } from 'react';
import { Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import Style from './style.css';
import PageFlowCreateModal from './modal';
import {
  OaApplicationOrderType,
} from '../../../../../application/define';

function PageExpenseButton(props) {
  const [visible, setVisable] = useState(false);
  // 滑过state
  const [isHoverIcon, setIsHoverIcon] = useState(false);

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

  // 移入
  const onMouseOverImg = () => {
    setIsHoverIcon(true);
  };

  // 移出
  const onMouseOutImg = () => {
    setIsHoverIcon(false);
  };

  // 渲染页面
  const render = () => {
    // 渲染节点数据
    const { type, title, icon, hoverIcon, isShow, desc } = props;
    // 判断是否有页面权限
    if (isShow !== true) {
      return null;
    }
    return (
      <div className={Style['app-comp-oa-card']} key={`group-${title}`}>
        <div>
          <img
            src={isHoverIcon && hoverIcon ?
            require(`../../assets/expense/${hoverIcon}`) :
            require(`../../assets/expense/${icon}`)}
            alt=""
            onClick={() => { onShowModal(); }}
            onMouseOver={onMouseOverImg}
            onMouseOut={onMouseOutImg}
          />
          {
            desc ? (<span>
              <Tooltip title={desc}>
                <ExclamationCircleOutlined />
              </Tooltip>
            </span>) : null
          }

        </div>

        <p>{title}</p>

        {/* 渲染弹窗 */}
        {visible ? <PageFlowCreateModal title={title} visible={visible} onCancel={onHideModal} type={type} /> : null}
      </div>
    );
  };
  return render();
}

export default PageExpenseButton;
