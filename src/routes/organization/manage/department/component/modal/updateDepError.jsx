/**
 * 上级部门更改后错误提示弹窗
 */
import dot from 'dot-prop';
import React from 'react';
import { Modal, Button } from 'antd';

import style from '../index.less';

const ErrorModal = ({
  visible,
  message = {},
  onCancelErrorModal,
}) => {
  let title = '请求异常';
  // 错误提示
  if (message && message.zh_message) {
    title = message.zh_message;
  }

  if (message && message.record) {
    const {
      originalPidName = '无',
      curPidName = '无',
    } = message;
    title = (
      <span>
        {`${dot.get(message, 'record.name', '--')}    调整上级部门成功`}
        <br />
        <span className={style['organization-department-error-modal-content']}>
            调整前上级部门：{`${originalPidName}`}
        </span>
        <br />
        <span className={style['organization-department-error-modal-content']}>
            调整后上级部门：{`${curPidName}`}
        </span>
      </span>
    );
  }
  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={() => onCancelErrorModal()}
    >
      <div
        className={style['organization-department-error-modal-title']}
      >{title}</div>
      <div
        className={style['organization-department-error-modal-btn-wrap']}
      >
        <Button type="primary" onClick={() => onCancelErrorModal()}>知道了</Button>
      </div>
    </Modal>
  );
};

export default ErrorModal;
