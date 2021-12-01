/**
 * 表单按钮组件 - 保存动作
 */
import dot from 'dot-prop';
import React, { useState } from 'react';
import { Button } from 'antd';

function PageUpdateButtons(props) {
  // 是否锁定提交按钮
  const [isLockButton, setIsLockButton] = useState(false);

  // 跳转到审批单列表页
  const onRedirect = () => {
    if (dot.has(props.query, 'callbackId') && dot.has(props.query, 'callbackKey')) {
      const { callbackId: id, callbackKey: approvalKey } = props.query;
      const url = `/#/Expense/Manage/ExamineOrder/Form?orderId=${id}&approvalKey=${approvalKey}`;
      window.location.href = url;
    }
  };

  // 提交
  const onUpdate = () => {
    if (!props.onUpdate) {
      return;
    }

    // 提交数据
    props.onUpdate({
      // 结束提交，隐藏弹窗，跳转界面
      onDoneHook: () => { onRedirect(); },
      // 锁定提交按钮
      onLockHook: () => { setIsLockButton(true); },
      // 解锁提交按钮
      onUnlockHook: () => { setIsLockButton(false); },
    });
  };

  // 判断是否锁定提交按钮，如果锁定则提示提交中
  if (isLockButton) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Button loading type="primary" onClick={() => { }} style={{ marginRight: '20px' }}>
          保存中...
        </Button>
      </div>

    );
  }

  // 默认显示保存
  return (
    <div style={{ textAlign: 'center' }}>
      <Button type="primary" onClick={onUpdate} style={{ marginRight: '20px' }}>
        保存
      </Button>
    </div>
  );
}

export default PageUpdateButtons;
