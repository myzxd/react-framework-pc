// 邮寄 弹窗
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';

import {
    Modal,
    Form,
    Input,
    Radio,
    Space,
  } from 'antd';
import {
    CoreForm,
  } from '../../../components/core';
import { MailRadioType } from '../../../application/define';

const layout = {
  style: { display: 'flex', marginBottom: 12 },
};
function MailPopupComponent({ _id, visible, setVisible, dispatch, breakContractList }) {
  // button loading
  const [isLoading, setIsLoading] = useState(false);
  // 快递信息 默认值
  const fastMail = useRef([{ name: 0, key: 0, fieldKey: 0 }]);
  const [form] = Form.useForm();
  // 是否需要邮寄状态
  const [mailState, setMailState] = useState();
  // 提交成功后的回调
  const onCallBack = () => {
    setIsLoading(false);
    onCancel();
    breakContractList();
  };
  // 提交
  const onSubmit = () => {
    form.validateFields().then((values) => {
      const { note, users = [] } = values;
      setIsLoading(true);
      const payload = {
        _id,
        is_need_mail: mailState,
        mail_company: (users[0] || {}).first,
        mail_no: (users[0] || {}).last,
        mail_note: note,
        onCallBack,
      };
      dispatch({ type: 'sharedContract/updateToMail', payload });
    });
  };
// 取消弹窗
  const onCancel = () => {
    setVisible(false);
    setIsLoading(false);
    setMailState();
  };
// change 是否需要邮寄
  const onChangeIsNeedMail = (e) => {
    setMailState(e.target.value);
  };
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        isNeedMail: undefined,
        note: undefined,
        fastMailInfo: undefined,
        users: undefined,
      });
    }
  }, [visible]);

  // 快递信息
  const renderFastMail = () => {
    /**
     * 本期只做单选 后期改为多选 注释勿删
     */
    return (
      <Form.List name="users">
        {() => {
          return (
            <React.Fragment>
              {fastMail.current.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} style={{ display: 'flex', margin: 0 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'first']}
                    fieldKey={[fieldKey, 'first']}
                    rules={[{ pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/g, required: true, message: '请输入汉字或字母' }]}
                  >
                    <Input placeholder="快递公司" />
                  </Form.Item>
                  -
                  <Form.Item
                    {...restField}
                    name={[name, 'last']}
                    fieldKey={[fieldKey, 'last']}
                    rules={[{ pattern: /^[0-9a-zA-Z]+$/g, required: true, message: '请输入数字或字母' }]}
                  >
                    <Input placeholder="快递单号" />
                  </Form.Item>
                  {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                </Space>
            ))}
              {/* <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                添加
              </Button>
              </Form.Item> */}
            </React.Fragment>
          );
        }}
      </Form.List>
    );
  };

  const renderForm = () => {
    const items = [
      <Form.Item {...layout} label="是否需要邮寄" name="isNeedMail" rules={[{ required: true, message: '请选择是否需要邮寄' }]}>
        <Radio.Group onChange={onChangeIsNeedMail}>
          <Radio value={MailRadioType.yes}>{MailRadioType.description(true)}</Radio>
          <Radio value={MailRadioType.no}>{MailRadioType.description(false)}</Radio>
        </Radio.Group>
      </Form.Item>,
      <Form.Item label="备注" name="note">
        <Input.TextArea />
      </Form.Item>,
    ];
    if (mailState) {
      const item = (<Form.Item style={{ margin: 0 }} label="快递信息" name="fastMailInfo">{renderFastMail()}</Form.Item>);
      items.splice(1, 0, item);
    }
    return (
      <Form form={form} name="control-hooks" >
        <CoreForm items={items} cols={1} />
      </Form>
    );
  };
  return (
    <Modal
      visible={visible}
      title="填写邮寄信息"
      confirmLoading={isLoading}
      onOk={onSubmit}
      onCancel={() => (onCancel && onCancel(false))}
      width="35%"
    >
      {renderForm()}
    </Modal>
  );
}

MailPopupComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  _id: PropTypes.string,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  breakContractList: PropTypes.func,
};

MailPopupComponent.defaultProps = {
  _id: '',                     // 合同id
  visible: false,              // state 是否显示弹窗
  setVisible: () => {},        // setState
  breakContractList: () => {}, // 刷新列表
};

export default connect()(MailPopupComponent);
