/* eslint-disable import/no-dynamic-require */
/**
 * 发起审批 - 事务申请 /OA/Document
 * */
import is from 'is_js';
import React, { useState } from 'react';
import { message } from 'antd';

import Style from './style.css';
import { authorize } from '../../../../../application';
import PageFlowCreateModal from './modal';

function PageFlowButton(props) {
  const [visible, setVisable] = useState(false);
  // 滑过state
  const [isHoverIcon, setIsHoverIcon] = useState(false);

  // 隐藏弹窗
  const onHideModal = () => {
    setVisable(false);
  };

  // 显示弹窗
  const onShowModal = () => {
    const { staffProfileId } = authorize.account;

    // 判断是否关联员工档案
    if (is.not.existy(staffProfileId) || is.empty(staffProfileId)) {
      message.error('提示：没有适用审批流，请联系流程管理员');
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
    const { type, title, icon, hoverIcon } = props;
    return (
      <div className={Style['app-comp-oa-card']} key={`group-${title}`}>
        <img
          src={isHoverIcon && hoverIcon ?
            require(`../../assets/${hoverIcon}`) :
            require(`../../assets/${icon}`)}
          alt=""
          onClick={() => { onShowModal(); }}
          onMouseOver={onMouseOverImg}
          onMouseOut={onMouseOutImg}
        />
        <p>{title}</p>

        {/* 渲染弹窗 */}
        {visible && <PageFlowCreateModal isShowCode={props.isShowCode} visible={visible} onCancel={onHideModal} type={type} />}
      </div>
    );
  };
  return render();
}

export default PageFlowButton;
