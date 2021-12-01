/**
 * 趣活钱包 - 支付账单 - 付款成功弹窗
 */
import React from 'react';
import {
  Modal,
} from 'antd';
import {
  CheckCircleFilled,
} from '@ant-design/icons';

import style from '../../style.less';

const SinglePay = ({
  visible,
  title = '批量付款',
  onCancel,
}) => {
  return (
    <Modal
      title={title}
      visible={visible}
      footer={null}
      onCancel={onCancel}
    >
      <div className={style['wallet-paystate-modal-wrap']}>
        <CheckCircleFilled className={style['wallet-paystate-modal-icon']} />
        <div className={style['wallet-paystate-modal-title']}>付款完成</div>
      </div>
    </Modal>
  );
};

export default SinglePay;
