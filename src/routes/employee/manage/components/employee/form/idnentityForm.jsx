/**
 * 员工档案 - 创建 - 基本信息tab - 身份信息
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Tabs,
  Button,
  message,
  Modal,
} from 'antd';
import {
  PaperworkType,
} from '../../../../../../application/define';
import {
  CoreForm,
  CoreContent,
  CorePhotosAmazon,
} from '../../../../../../components/core';
import { isProperIdCardNumber, cryptoRandomString } from '../../../../../../application/utils';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const { TabPane } = Tabs;
const { Option } = Select;

const IdentityForm = ({
  form,
  dispatch,
  employeeDetail = {}, // 员工档案
  onResetStaff, // 二次入职
  setResetState,
  employeeId, // 员工档案id
}) => {
  // 二次入职按钮loading
  const [twiceLoading, setTwiceLoading] = useState(false);
  const {
    getFieldValue,
  } = form;

  // 证件号码校验
  const validatorIdentityCardId = (_, value, callback) => {
    const identityType = getFieldValue('identity_certificate_type');
    if (!value) {
      return callback('请输入证件号码');
    }

    if (identityType === PaperworkType.idCard
      && !isProperIdCardNumber(value)
    ) {
      return callback('请输入正确的身份证号');
    }

    callback();
  };

  // 上传图片校验
  const validatorCardFront = (_, value, callback) => {
    if (!value
      || !Array.isArray(value.keys)
      || value.keys.length < 1
      || !Array.isArray(value.urls)
      || value.urls.length < 1
    ) {
      return callback('请上传证件正面照');
    }

    callback();
  };

  // 上传图片校验
  const validatorCardBack = (_, value, callback) => {
    if (!value
      || !Array.isArray(value.keys)
      || value.keys.length < 1
      || !Array.isArray(value.urls)
      || value.urls.length < 1
    ) {
      return callback('请上传证件反面照');
    }

    callback();
  };

  // 二次入职查询回调
  const onTwiceBoardCallback = (res) => {
    setTwiceLoading(false);
    setResetState && setResetState(cryptoRandomString(32));
    onResetStaff && onResetStaff(res);
  };

  // 二次入职查询
  const getModalConfirm = (res = {}) => {
    Object.keys(res).length > 0 ?
      Modal.confirm({
        content: (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>系统中该身份证号存在对应的离职人员档案信息，请核对以下信息并确认是否要复用该份档案中的信息</div>
            <div style={{ marginLeft: '30px', marginBottom: '10px' }}>{`手机号：${res.phone}`}</div>
            <div style={{ marginLeft: '30px' }}>{`姓名：${res.name}`}</div>
          </div>
        ),
        maskClosable: true,
        onOk: () => onTwiceBoardCallback(res),
        onCancel: () => setTwiceLoading(false),
      })
      : Modal.error({
        maskClosable: true,
        content: '系统中未找到该身份证号对应的离职员工档案',
        onCancel: () => setTwiceLoading(false),
        onOk: () => setTwiceLoading(false),
      });
  };

  // 二次入职查询
  const onTwiceBoard = async () => {
    // 身份证证件号码
    const identityCardId = getFieldValue('identity_card_id');
    if (!identityCardId) return message.error('请填写证件号码');
    // 操作loading
    setTwiceLoading(true);

    const res = await dispatch({
      type: 'employeeManage/getTwiceBoard',
      payload: {
        identityCardId,
      },
    });

    getModalConfirm(res);
  };

  // 身份证
  const renderIndentity = () => {
    const items = [
      <Form.Item
        label="证件类型"
        name="identity_certificate_type"
        rules={[
          { required: true, message: '请选择' },
        ]}
        {...formLayout}
      >
        <Select
          placeholder="请选择证件类型"
          allowClear
          onChange={() => form.validateFields(['identity_card_id'])}
        >
          <Option
            value={PaperworkType.idCard}
          >
            {PaperworkType.description(PaperworkType.idCard)}
          </Option>
          <Option
            value={PaperworkType.sergeant}
          >
            {PaperworkType.description(PaperworkType.sergeant)}
          </Option>
          <Option
            value={PaperworkType.student}
          >
            {PaperworkType.description(PaperworkType.student)}
          </Option>
          <Option
            value={PaperworkType.passport}
          >
            {PaperworkType.description(PaperworkType.passport)}
          </Option>
          <Option
            value={PaperworkType.hmPass}
          >
            {PaperworkType.description(PaperworkType.hmPass)}
          </Option>
        </Select>
      </Form.Item>,
      <Form.Item
        label="证件号码"
        name="identity_card_id"
        rules={[
          {
            required: true,
            validator: validatorIdentityCardId,
          },
        ]}
        {...formLayout}
      >
        <Input placeholder="请填写证件号码" />
      </Form.Item>,
      <Form.Item key="empty" />,
      <Form.Item
        label="证件正面照"
        name="identity_card_front"
        rules={[
          { required: true, validator: validatorCardFront },
        ]}
        {...formLayout}
      >
        <CorePhotosAmazon
          domain="staff"
          maximum={1}
          namespace="identity_card_front"
        />
      </Form.Item>,
      <Form.Item
        label="证件反面照"
        name="identity_card_back"
        rules={[
          { required: true, validator: validatorCardBack },
        ]}
        {...formLayout}
      >
        <CorePhotosAmazon
          domain="staff"
          maximum={1}
          namespace="identity_card_back"
        />
      </Form.Item>,
      <Form.Item
        label="手持证件半身照"
        name="identity_card_in_hand"
        {...formLayout}
      >
        <CorePhotosAmazon
          domain="staff"
          maximum={1}
          namespace="identity_card_in_hand"
        />
      </Form.Item>,
    ];

    // 员工创建有二次入职功能
    if (!employeeId) {
      items[items.length] = (
        <Form.Item
          label=" "
          key="twice_board"
          colon={false}
          {...formLayout}
        >
          <Button
            type="primary"
            onClick={onTwiceBoard}
            loading={twiceLoading}
          >二次入职查询</Button>
        </Form.Item>
      );
    }

    return <CoreForm items={items} />;
  };

  // 健康证件
  const renderHealth = () => {
    const items = [
      <Form.Item
        label="证件类型"
        name="health_certificate_type"
        {...formLayout}
      >
        <Select placeholder="请选择证件类型">
          <Option
            value={PaperworkType.health}
          >
            {PaperworkType.description(PaperworkType.health)}
          </Option>
        </Select>
      </Form.Item>,
      <Form.Item
        label="证件号码"
        name="health_certificate_no"
        {...formLayout}
      >
        <Input placeholder="请填写证件号码" />
      </Form.Item>,
      <Form.Item key="empty" />,
      <Form.Item
        label="证件正面照"
        name="health_certificate"
        {...formLayout}
      >
        <CorePhotosAmazon
          domain="staff"
          maximum={1}
          namespace="health_certificate"
        />
      </Form.Item>,
      <Form.Item
        label="证件反面照"
        name="health_certificate_back"
        {...formLayout}
      >
        <CorePhotosAmazon
          domain="staff"
          maximum={1}
          namespace="health_certificate_back"
        />
      </Form.Item>,
      <Form.Item
        label="手持证件半身照"
        name="health_certificate_in_hand"
        {...formLayout}
      >
        <CorePhotosAmazon
          domain="staff"
          maximum={1}
          namespace="health_certificate_in_hand"
        />
      </Form.Item>,
    ];

    return <CoreForm items={items} />;
  };

  // 驾驶证
  const renderDrive = () => {
    const items = [
      <Form.Item
        label="证件类型"
        name="drive_certificate_type"
        {...formLayout}
      >
        <Select placeholder="请选择证件类型">
          <Option
            value={PaperworkType.drive}
          >
            {PaperworkType.description(PaperworkType.drive)}
          </Option>
        </Select>
      </Form.Item>,
      <Form.Item
        label="证件号码"
        name="drive_certificate_no"
        {...formLayout}
      >
        <Input placeholder="请填写证件号码" />
      </Form.Item>,
      <Form.Item key="empty" />,
      <Form.Item
        label="证件正面照"
        name="drive_certificate_front"
        {...formLayout}
      >
        <CorePhotosAmazon
          domain="staff"
          maximum={1}
          namespace="drive_certificate_front"
        />
      </Form.Item>,
      <Form.Item
        label="证件反面照"
        name="drive_certificate_back"
        {...formLayout}
      >
        <CorePhotosAmazon
          domain="staff"
          maximum={1}
          namespace="drive_certificate_back"
        />
      </Form.Item>,
      <Form.Item
        label="手持证件半身照"
        name="drive_certificate_in_hand"
        {...formLayout}
      >
        <CorePhotosAmazon
          domain="staff"
          maximum={1}
          namespace="drive_certificate_in_hand"
        />
      </Form.Item>,
    ];

    return <CoreForm items={items} />;
  };

  // tabs
  const renderTabs = () => (
    <Tabs type="card">
      <TabPane
        tab="身份证件"
        key="identity"
        forceRender
      >
        {renderIndentity()}
      </TabPane>
      <TabPane
        tab="健康证件"
        key="health"
        forceRender
      >
        {renderHealth()}
      </TabPane>
      <TabPane
        tab="驾驶证件"
        key="drive"
        forceRender
      >
        {renderDrive()}
      </TabPane>
    </Tabs>
  );

  // 获取initialValues
  const getInitialValues = () => {
    return {
      identity_certificate_type: employeeDetail.identity_certificate_type || PaperworkType.idCard, // 身份证证件类型
      identity_card_id: employeeDetail.identity_card_id || undefined, // 身份证证件类型
      identity_card_front: {
        keys: dot.get(employeeDetail, 'identity_card_front') ? [dot.get(employeeDetail, 'identity_card_front')] : [],
        urls: dot.get(employeeDetail, 'identity_card_front_url') ? [dot.get(employeeDetail, 'identity_card_front_url')] : [],
      }, // 身份证正面照
      identity_card_back: {
        keys: dot.get(employeeDetail, 'identity_card_back') ? [dot.get(employeeDetail, 'identity_card_back')] : [],
        urls: dot.get(employeeDetail, 'identity_card_back_url') ? [dot.get(employeeDetail, 'identity_card_back_url')] : [],
      }, // 身份证反面照
      identity_card_in_hand: {
        keys: dot.get(employeeDetail, 'identity_card_in_hand') ? [dot.get(employeeDetail, 'identity_card_in_hand')] : [],
        urls: dot.get(employeeDetail, 'identity_card_in_hand_url') ? [dot.get(employeeDetail, 'identity_card_in_hand_url')] : [],
      }, // 身份证半身照

      health_certificate_type: employeeDetail.health_certificate_type || PaperworkType.health, // 身份证证件类型
      health_certificate_no: employeeDetail.health_certificate_no || undefined, // 健康证证件类型
      health_certificate: {
        keys: dot.get(employeeDetail, 'health_certificate') ? [dot.get(employeeDetail, 'health_certificate')] : [],
        urls: dot.get(employeeDetail, 'health_certificate_url') ? [dot.get(employeeDetail, 'health_certificate_url')] : [],
      }, // 健康证正面照
      health_certificate_back: {
        keys: dot.get(employeeDetail, 'health_certificate_back') ? [dot.get(employeeDetail, 'health_certificate_back')] : [],
        urls: dot.get(employeeDetail, 'health_certificate_back_url') ? [dot.get(employeeDetail, 'health_certificate_back_url')] : [],
      }, // 健康证反面照
      health_certificate_in_hand: {
        keys: dot.get(employeeDetail, 'health_certificate_in_hand') ? [dot.get(employeeDetail, 'health_certificate_in_hand')] : [],
        urls: dot.get(employeeDetail, 'health_certificate_in_hand_url') ? [dot.get(employeeDetail, 'health_certificate_in_hand_url')] : [],
      }, // 健康证半身照

      drive_certificate_type: employeeDetail.drive_certificate_type || PaperworkType.drive, // 驾驶证证证件类型
      drive_certificate_no: employeeDetail.drive_certificate_no || undefined, // 驾驶证证证件类型
      drive_certificate_front: {
        keys: dot.get(employeeDetail, 'drive_certificate_front') ? [dot.get(employeeDetail, 'drive_certificate_front')] : [],
        urls: dot.get(employeeDetail, 'drive_certificate_front_url') ? [dot.get(employeeDetail, 'drive_certificate_front_url')] : [],
      }, // 驾驶证证正面照
      drive_certificate_back: {
        keys: dot.get(employeeDetail, 'drive_certificate_back') ? [dot.get(employeeDetail, 'drive_certificate_back')] : [],
        urls: dot.get(employeeDetail, 'drive_certificate_back_url') ? [dot.get(employeeDetail, 'drive_certificate_back_url')] : [],
      }, // 驾驶证证反面照
      drive_certificate_in_hand: {
        keys: dot.get(employeeDetail, 'drive_certificate_in_hand') ? [dot.get(employeeDetail, 'drive_certificate_in_hand')] : [],
        urls: dot.get(employeeDetail, 'drive_certificate_in_hand_url') ? [dot.get(employeeDetail, 'drive_certificate_in_hand_url')] : [],
      }, // 驾驶证证半身照
    };
  };

  return (
    <CoreContent title="身份信息">
      <Form
        form={form}
        initialValues={getInitialValues()}
        className="affairs-flow-basic"
      >
        {renderTabs()}
      </Form>
    </CoreContent>
  );
};

export default connect()(IdentityForm);
