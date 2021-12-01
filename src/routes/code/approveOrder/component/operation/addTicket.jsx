/*
 * code - 审批单 - 打验票标签
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { Checkbox, Modal, Button, Form, message } from 'antd';

const AddTicketTag = ({
  dispatch,
  ticketTags = {}, // 标签列表
  approveOrderDetail = {}, // 审批单详情
  recordDetail = {}, // 流转记录详情
  className,
}) => {
  // 标签列表
  const {
    inspect_bill_label_ids: inspectBillLabelIds = [], // 标签list
    _id: orderId, // 审批单id
    inspect_bill_label_list: selectLabelList = [], // 已选中的标签list
  } = approveOrderDetail;
  const {
    _id: recordId, // 流转记录id
  } = recordDetail;

  const [form] = Form.useForm();

  // visible
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const payload = { page: 1, limit: 9999 };

    visible && dispatch({ type: 'ticketTag/getTicketTags', payload });
  }, [dispatch, visible]);

  useEffect(() => {
    form.setFieldsValue({ tags: [...inspectBillLabelIds] });
  }, [approveOrderDetail, inspectBillLabelIds, form]);

  const { data = [] } = ticketTags;

  const onCancel = () => {
    setVisible(false);
    form.setFieldsValue({ tags: [...inspectBillLabelIds] });
  };

  // submit
  const onSubmit = async () => {
    const formRes = await form.validateFields();
    const res = await dispatch({
      type: 'codeOrder/setOrderTicket',
      payload: { ...formRes, recordId, orderId },
    });

    if (res && res._id) {
      message.success('请求成功');
      setVisible(false);

      // 获取审批单详情
      dispatch({
        type: 'codeOrder/getApproveOrderDetail',
        payload: { orderId },
      });

      dispatch({
        type: 'codeOrder/getOrderFlowRecordList',
        payload: { orderId },
      });

      // 重置验票标签
    } else if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  };

  // modal
  const renderModal = () => {
    if (!visible) return;

    const layout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };

    const options = data.map((tag) => {
      const { _id: id, name } = tag;
      return { label: name, value: id };
    });


    // 1 拿到当前options所有的ids集合
    const dataIds = data.map(i => i._id);

    // 2 找出 删除的标签
    const deleteLabel = [];
    selectLabelList.forEach((item) => {
      if (!dataIds.includes(item._id)) {
        deleteLabel.push({ value: item._id, label: `${item.name}(已删除)` });
      }
    });

    // 3 合并 最终渲染的options
    const newLabelLists = [...options, ...deleteLabel];


    return (
      <Modal
        title="打验票标签"
        visible={visible}
        onOk={onSubmit}
        okText="保存"
        onCancel={() => onCancel()}
        destroyOnClose
      >
        <Form
          {...layout}
          form={form}
          initialValues={{ tags: [...inspectBillLabelIds] }}
          className="affairs-flow-basic"
        >
          <Form.Item name="tags" label="" rules={[{ required: true, message: '请选择' }]}>
            <Checkbox.Group style={{ margin: '5px 5px' }} options={newLabelLists} />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      {renderModal()}
      <Button
        onClick={() => setVisible(true)}
        className={className}
      >打验票标签</Button>
    </React.Fragment>
  );
};

const mapStateToProps = ({ ticketTag: { ticketTags } }) => ({ ticketTags });

export default connect(mapStateToProps)(AddTicketTag);
