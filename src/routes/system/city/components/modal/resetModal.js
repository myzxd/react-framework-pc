/**
 *  编辑城市 - 重置弹框
 */
import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'dva';

const ModalReast = (props) => {
  const {
    dispatch,
    form = {},
    location,
  } = props;

  // 是否开启弹窗
  const [visible, setVisible] = useState(false);

  // 重置
  const onReset = () => {
    setVisible(true);
  };

  // 确认
  const onOkModal = () => {
    setVisible(false);
    const { id } = location.query;
    const params = {
      id, // 详情id
    };
    dispatch({ type: 'systemCity/fetchCityDetail', payload: params });
    form.resetFields();
  };

  // 取消
  const onCancelModal = () => {
    setVisible(false);
  };

  return (
    <span style={{ ...props.style }} className={props.className}>
      <Button type="primary" onClick={onReset}>重置</Button>
      <Modal
        title="重置确认"
        visible={visible}
        onOk={onOkModal}
        onCancel={onCancelModal}
      >
          说明：本次页面调整的内容都会被重置回原来状态。
        </Modal>
    </span>
  );
};

export default connect()(ModalReast);
