// 存档操作 弹窗
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
import { utils } from '../../../application';
import { PageUpload } from '../../oa/document/components/index';

const layout = {
  labelCol: { span: 8 },
  style: { display: 'flex', marginBottom: 12 },
};
function FilesPopupComponent({
  _id,
  contractNumber,
  visible,
  setVisible,
  dispatch,
  breakContractList,
  contractDetail = {}, // 合同详情
}) {
  // button loading
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [isDisable, setIsDisable] = useState(true);
  // 提交成功后的回调
  const onCallBack = () => {
    setIsLoading(false);
    onCancel();
    breakContractList();

    // 跳转到列表页
    !(utils.dotOptimal(contractDetail, 'is_filed')) && (window.location.href = '/#/Shared/Contract');
  };
  // 提交
  const onSubmit = () => {
    form.validateFields().then((values) => {
      const { filed_address, filed_box, file_keys, filed_note } = values;
      setIsLoading(true);
      const payload = {
        _id,
        filed_address,
        filed_box,
        file_keys,
        filed_note,
        pact_num: contractNumber,
        isUpdateContract: utils.dotOptimal(contractDetail, 'is_filed', false),
        onCallBack,
      };
      dispatch({ type: 'sharedContract/updateFiles', payload });
    });
  };

// 取消弹窗
  const onCancel = () => {
    setVisible(false);
    setIsLoading(false);
    setIsDisable(true);
  };

  // 动态校验子元素的变化
  const onFormChange = (name, { forms }) => {
    const { filed_address: filedsAdress, file_keys: fileKeys, filed_box: filedBox } = forms[name].getFieldsValue();
    if (filedsAdress && fileKeys && filedBox) {
      setIsDisable(false);
      return;
    }
    setIsDisable(true);
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        filed_address: utils.dotOptimal(contractDetail, 'filed_info.filed_address', undefined),
        filed_box: utils.dotOptimal(contractDetail, 'filed_info.filed_box', undefined),
        file_keys: PageUpload.getInitialValue(contractDetail, 'sign_asset_infos'),
        filed_note: utils.dotOptimal(contractDetail, 'filed_info.filed_note', undefined),
      });
    }
  }, [visible]);

  const renderForm = () => {
    const items = [
      <Form.Item
        label="存放地"
        name="filed_address"
        {...layout}
        rules={[{ required: true }]}
      >
        <Input placeholder="请输入存放地" />
      </Form.Item>,
      <Form.Item label="存放档案盒" name="filed_box" {...layout} rules={[{ required: true }]}>
        <Input placeholder="请输入存放档案盒" />
      </Form.Item>,
      <Form.Item label="上传盖章合同附件" name="file_keys" {...layout} rules={[{ required: true }]}>
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
      <Form.Item label="备注" name="filed_note" {...layout}>
        <Input.TextArea />
      </Form.Item>,
      <Form.Item label="合同序号" name="pact_num" {...layout}>
        {contractNumber || '--'}
      </Form.Item>,

    ];

    return (
      <Form.Provider onFormChange={onFormChange}>
        <Form
          form={form}
          name="control-hooks"
          className="affairs-flow-basic form-item-content-scroll"
        >
          <CoreForm items={items} cols={1} />
        </Form>
      </Form.Provider>

    );
  };
  return (
    <Modal
      visible={visible}
      title="归档信息"
      confirmLoading={isLoading}
      onOk={onSubmit}
      onCancel={() => (onCancel && onCancel(false))}
      width="35%"
      okButtonProps={{ disabled: isDisable }}
    >
      {renderForm()}
    </Modal>
  );
}

FilesPopupComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  _id: PropTypes.string,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  contractNumber: PropTypes.string,
  breakContractList: PropTypes.func,
};

FilesPopupComponent.defaultProps = {
  _id: '',                     // 合同id
  contractNumber: '',          // 合同序号
  visible: false,              // state 是否显示弹窗
  setVisible: () => {},        // setState
  breakContractList: () => {}, // 刷新列表
};

export default connect()(FilesPopupComponent);
