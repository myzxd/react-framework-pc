/**
 *  编辑城市 - 提交弹框
 */
import is from 'is_js';
import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { connect } from 'dva';

const ModalCreate = (props) => {
  const {
    dispatch,
    form = {},
    location,
  } = props;

  // 是否开启弹窗
  const [visible, setVisible] = useState(false);

  // 新增
  const onSubmit = () => {
    form.validateFields().then(() => {
      setVisible(true);
    });
  };

  // 校验value值
  const onCheckPriceValue = (data) => {
    let flag = true;
    // 判断是否有数据
    if (is.not.existy(data) || is.empty(data)) {
      flag = false;
      return flag;
    }
    data.forEach((val) => {
      if (is.not.existy(val) || is.empty(val)) {
        flag = false;
        return flag;
      }
      Object.keys(val).forEach((v) => {
        if (is.not.existy(val[v]) || is.empty(val[v])) {
          flag = false;
          return flag;
        }
      });
    });
    return flag;
  };

  // 成功回调
  const onSuccessCallback = () => {
    message.success('提交成功');
    setVisible(false);
    window.location.href = '/#/System/City';
  };

  // 确认
  const onOkModal = () => {
    form.validateFields().then((value) => {
      const flag = onCheckPriceValue(value.cityList);
      if (flag === false) {
        return message.error('城市数据不能为空');
      }
      const { id } = location.query;
      const params = {
        ...value,
        id, // 详情id
        onSuccessCallback,
      };
      dispatch({ type: 'systemCity/createCitySubmit', payload: params });
    });
  };

  // 取消
  const onCancelModal = () => {
    setVisible(false);
  };

  return (
    <span style={{ ...props.style }} className={props.className}>
      <Button type="primary" onClick={onSubmit}>新增</Button>
      <Modal
        title="新增确认"
        visible={visible}
        onOk={onOkModal}
        onCancel={onCancelModal}
      >
        说明：本次提交的城市数据后期不可再进行直接修改，允许新增城市。
        </Modal>
    </span>
  );
};

export default connect()(ModalCreate);
