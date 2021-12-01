/**
 * code - 审批单 - 驳回审批
 */
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import {
  Select,
  Form,
  Button,
  Modal,
  message,
} from 'antd';
import AlternativedTextBox from '../../../../expense/components/alternativedTextBox';

const { Option } = Select;

// form layout
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

// 常用语
const Alternatives = [
  {
    key: '0',
    value: '请上传附件。',
  },
  {
    key: '1',
    value: '文件有误，需要修改。',
  },
];

const Disallowace = ({
  rejectNodeList = {}, // 可驳回节点列表
  dispatch,
  approveOrderDetail = {}, // 审批单详情
  recordDetail = {}, // 流转记录详情
  className,
}) => {
  const [form] = Form.useForm();
  // visible
  const [visible, setVisible] = useState(false);

  // 审批单id
  const { _id: orderId } = approveOrderDetail;
  // 流转记录id
  const { _id: recordId } = recordDetail;

  // 获取可驳回节点列表
  useEffect(() => {
    if (visible) {
      orderId && recordId && dispatch({
        type: 'codeOrder/getRejectNodeList',
        payload: { orderId, recordId },
      });
    }

    return (() => {
      dispatch({
        type: 'codeOrder/resetRejectNodeList',
        payload: {},
      });
    });
  }, [dispatch, orderId, recordId, visible]);

  // 驳回
  const onOk = async () => {
    const vals = await form.validateFields();
    const res = await dispatch({
      type: 'codeOrder/disallowanceApproveOrder',
      payload: { orderId, recordId, ...vals },
    });

    if (res && res._id) {
      message.success('请求成功');
      dispatch({
        type: 'codeOrder/getOrderFlowRecordList',
        payload: { orderId },
      });
      // 隐藏弹窗
      setVisible(false);
    } else {
      res.zh_message && message.error(res.zh_message);
    }
  };

  const { data = [] } = rejectNodeList;

  // 驳回节点select
  const rejectNodeSelect = (
    <Select
      placeholder="请选择"
      allowClear
      searchValue
    >
      <Option value="null" key="none">提报节点</Option>
      {
        Array.isArray(data) && data.map((r) => {
          return <Option key={r._id} value={r._id}>{r.name}</Option>;
        })
      }
    </Select>
  );

  // modal
  const renderModal = () => {
    return (
      <Modal
        title="驳回"
        visible={visible}
        onOk={onOk}
        onCancel={() => setVisible(false)}
      >
        <Form
          form={form}
          className="affairs-flow-basic"
        >
          <Form.Item
            label="驳回至节点"
            name="rejectNodeId"
            rules={[{ required: true, message: '请选择驳回节点' }]}
            {...formLayout}
          >
            {rejectNodeSelect}
          </Form.Item>
          <Form.Item
            label="意见"
            name="note"
            rules={[
              { max: 1000, message: '意见的最大长度不能超过1000' },
            ]}
            {...formLayout}
          >
            <AlternativedTextBox
              alternatives={Alternatives}
              placeholder="请输入意见"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      <Button
        onClick={() => setVisible(true)}
        className={className}
      >驳回</Button>
      {renderModal()}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeOrder: { rejectNodeList },
}) => {
  return { rejectNodeList };
};

export default connect(mapStateToProps)(Disallowace);
