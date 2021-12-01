// 作废操作 弹窗
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import {
    Modal,
    Form,
    Input,
  } from 'antd';
import {
    CoreForm,
  } from '../../../components/core';
import styles from './styles.less';

function VoidPopupComponent({ data, visible, setVisible, dispatch, breakContractList }) {
  // button loading
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  // 提交成功后的回调
  const onCallBack = () => {
    setIsLoading(false);
    onCancel();
    breakContractList();
  };
  // 提交
  const onSubmit = () => {
    form.validateFields().then((values) => {
      setIsLoading(true);
      const payload = {
        _id: data._id,
        cancel_note: values.note,
        onCallBack,
        onErrorCallBack: () => {
          setIsLoading(false);
        },
      };
      dispatch({ type: 'sharedContract/updateVoidContract', payload });
    });
  };
// 取消弹窗
  const onCancel = () => {
    setVisible(false);
    setIsLoading(false);
  };
  // 再次打开弹窗 数据清空
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ note: undefined });
    }
  }, [visible]);


  const renderSignItems = () => {
    return (
      <div >
        <p className={styles['sign-modal-info-wrap']}>
          <span className={styles['sign-modal-lable']}>合同名称：</span>
          <span className={styles['sign-modal-content']}>{data.name || '--'}</span>
        </p>
        <p className={styles['sign-modal-info-wrap']}>
          <span className={styles['sign-modal-lable']}>签订单位：</span>
          <span className={styles['sign-modal-content']}>{(data.firm_info || {}).name || '--'}</span>
        </p>
        <p className={styles['sign-modal-info-wrap']}>
          <span className={styles['sign-modal-lable']}>BOSS审批单号：</span>
          <span className={styles['sign-modal-content']}>{data.application_order_id || '--'}</span>
        </p>
        <p className={styles['sign-modal-info-wrap']}>
          <span className={styles['sign-modal-lable']}>合同甲方：</span>
          <span className={styles['sign-modal-content']}>{data.pact_part_a || '--'}</span>
        </p>
        <p className={styles['sign-modal-info-wrap']}>
          <span className={styles['sign-modal-lable']}>合同乙方：</span>
          <span className={styles['sign-modal-content']}>{data.pact_part_b || '--'}</span>
        </p>
      </div>
    );
  };

  const renderForm = () => {
    const items = [
      // <Form.Item label="合同名称" {...layout}>
      //   {data.name || '--'}
      //   <span className={styles['sign-modal-content']}>{data.name || '--'}</span>
      // </Form.Item>,
      // <Form.Item label="签订单位" {...layout}>
      //   {(data.firm_info || {}).name || '--'}
      // </Form.Item>,
      // <Form.Item label="boss审批单号" {...layout}>
      //   {data.application_order_id || '--'}
      // </Form.Item>,
      // <Form.Item label="合同甲方" {...layout}>
      //   {data.pact_part_a || '--'}
      // </Form.Item>,
      // <Form.Item label="合同乙方" {...layout}>
      //   {data.pact_part_b || '--'}
      // </Form.Item>,
      <Form.Item label="作废原因" style={{ display: 'flex', margin: '20px 0 0 0' }} name="note" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>,
    ];
    return (
      <Form form={form} name="control-hooks" >
        {renderSignItems()}
        <CoreForm items={items} cols={1} />
      </Form>
    );
  };

  return (
    <Modal
      visible={visible}
      title="确认作废合同信息"
      confirmLoading={isLoading}
      onOk={onSubmit}
      onCancel={() => (onCancel && onCancel(false))}
      width="30%"
    >
      {renderForm()}
    </Modal>
  );
}

VoidPopupComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.object,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  breakContractList: PropTypes.func,
};

VoidPopupComponent.defaultProps = {
  data: {},                    // 作废这一项的数据
  visible: false,              // state 是否显示弹窗
  setVisible: () => {},        // setState
  breakContractList: () => {}, // 刷新列表
};

export default connect()(VoidPopupComponent);
