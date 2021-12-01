/**
 * 表单按钮组件 - 提交动作
 */
import React, { useState } from 'react';
import { Button, message } from 'antd';
import { canOperateModuleCodeManageOAOrder } from '../../../../../application/define/operate';

function PageSubmitButtons(props) {
  const { query = {} } = props;
  // 是否锁定提交按钮
  const [isLockButton, setIsLockButton] = useState(false);
  // 是否锁定提交按钮
  const [isSaveButton, setIsSaveButton] = useState(false);

  // 关闭页面
  const onClose = () => {
    window.close();
  };

  // 跳转到审批单列表页
  const onRedirect = () => {
    if (query.isShowCode === 'true') {
      if (canOperateModuleCodeManageOAOrder()) {
        window.location.href = '/#/Code/Manage/OAOrder';
        return;
      }
      message.error('你没有查看事务审批页面的权限，请联系管理员添加权限');
      window.location.href = '/#/Code/Document';
      return;
    }
    window.location.href = '/#/Expense/Manage/OAOrder';
  };

  // 提交动作
  const onSubmit = () => {
    if (!props.onSubmit) {
      return;
    }

    // 提交数据
    props.onSubmit({
      // 结束提交，隐藏弹窗，跳转界面
      onDoneHook: () => { onRedirect(); },
      // 锁定提交按钮
      onLockHook: () => { setIsLockButton(true); },
      // 解锁提交按钮
      onUnlockHook: () => { setIsLockButton(false); },
    });
  };

  // 保存
  const onSave = () => {
    if (!props.onSave) {
      return;
    }

    // 保存数据
    props.onSave({
      // 锁定保存按钮
      onSaveHook: () => { setIsSaveButton(true); },
      // 解锁保存按钮
      onUnsaveHook: () => { setIsSaveButton(false); },
    });
  };

  const renderSubmit = () => {
    // 判断是否锁定提交按钮，如果锁定则提示提交中
    if (isLockButton) {
      return (
        <Button loading type="primary" onClick={() => { }}>
          提交中...
        </Button>
      );
    }

    // 默认显示提交
    return (
      <Button type="primary" onClick={onSubmit}>
        提交
      </Button>
    );
  };

  // 保存操作
  const renderSaveButton = () => {
    // 锁定保存按钮
    if (isSaveButton) {
      return (
        <Button loading type="primary" onClick={() => {}} style={{ marginRight: '20px' }}>
          保存中...
        </Button>
      );
    }

    return (
      <Button type="primary" onClick={onSave} style={{ marginRight: '20px' }}>
         保存
      </Button>
    );
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Button onClick={onClose} style={{ marginRight: '20px' }}>
        取消
      </Button>
      {renderSaveButton()}
      {renderSubmit()}
    </div>
  );
}

export default PageSubmitButtons;
