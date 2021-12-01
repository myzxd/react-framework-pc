/**
 * code - 审批单 - 补充意见
 */
import React, { useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Tooltip,
} from 'antd';

import {
  Alternatives,
} from '../../../../../application/define';
import AlternativedTextBox from '../../../../expense/components/alternativedTextBox';
import CommonTab from '../../../../expense/manage/examineOrder/detail/commonTab';
import PageUpload from '../../../components/upload';
import styles from '../style.less';

// form layout
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

const SupplementOpinion = ({
  dispatch,
  className,
  approveOrderDetail = {}, // 审批单详情
  recordDetail = {}, // 流转记录详情
}) => {
  const [form] = Form.useForm();
  // modal visible
  const [visible, setVisible] = useState(false);
  // tab key
  const [tabKey, setTabKey] = useState(Alternatives.often);
  // 付款状态
  const {
    _id: orderId,
    isPaymentNode = true,
  } = approveOrderDetail;

  const {
    _id: recordId,
  } = recordDetail;

  // 弹框关闭并清除数据
  const onCancel = () => {
    // 隐藏弹窗
    setVisible(false);
    // 重置form值
    form.resetFields();
  };

  // 成功回调
  const onSuccessCallback = () => {
    // 弹框关闭并清除数据
    onCancel();
    dispatch({
      type: 'codeOrder/getOrderFlowRecordList',
      payload: { orderId },
    });
  };

  // 提交
  const onOk = async () => {
    const vals = await form.validateFields();
    dispatch({
      type: 'codeOrder/addApproveOrderExtra',
      payload: {
        orderId,
        recordId,
        ...vals,
        onSuccessCallback,
      },
    });
  };

  // tab onChange
  const onChangeTab = (v) => {
    setTabKey(v);
    form.resetFields();
  };

  // modal
  const renderModal = () => {
    const defaultActiveKey = isPaymentNode ? Alternatives.finance : Alternatives.often;  // tab状态
    const alternativeKey = tabKey || defaultActiveKey;
    // 预览支持格式内容
    const text = (<div>
      <span>目前支持的上传格式：- office文件(doc/docx/ppt/pptx/xls/xlsx)</span>
      <span>- Rtf文档/- pdf文件/ - 图片文件(jpg/jpeg/png/gif/bmp/tiff/webp)</span>
      <span>- txt文件/- csv文件/-eml格式 /- zip格式/- rar格式(不能上传有密码的此类文件)</span>
    </div>);

    return (
      <Modal
        title="补充意见"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        width={650}
      >
        <CommonTab
          activeKey={alternativeKey}
          onChange={onChangeTab}
        />
        <Form
          form={form}
          className="affairs-flow-basic"
        >
          <Form.Item
            label="意见"
            name="note"
            rules={[
              { max: 1000, message: '意见的最大长度不能超过1000' },
            ]}
            {...formLayout}
          >
            <AlternativedTextBox
              alternatives={Alternatives.conversionData(alternativeKey)}
              placeholder="请输入意见"
              rows={4}
            />
          </Form.Item>
          <Form.Item
            label={<div><Tooltip placement="top" title={text}>
              <span className={styles['code-order-cost-tooltip-title']}>!</span>
            </Tooltip><span>上传附件</span></div>}
            name="fileList"
            {...formLayout}
          >
            <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      {renderModal()}
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        className={className}
      >补充意见</Button>
    </React.Fragment>
  );
};

export default SupplementOpinion;
