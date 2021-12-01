/**
 * 员工档案 - 创建 - 基本信息tab - 银行卡信息
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Radio,
  Button,
  message,
  Modal,
} from 'antd';
import {
  EmployeeCollectionType,
} from '../../../../../../application/define';
import {
  CoreForm,
  CoreContent,
  CorePhotosAmazon,
} from '../../../../../../components/core';
import {
  CommonSelectRegionalName,
} from '../../../../../../components/common';
import Utils from '../../../../../../application/utils';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
// form layout（开户行所在地）
const addressFormLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

const BankForm = ({
  form,
  dispatch,
  employeeDetail = {}, // 员工详情
  specialFields,
}) => {
  const {
    getFieldValue,
    setFieldsValue,
  } = form;

  // 银行卡信息
  const bankInfo = employeeDetail.bank_info ? employeeDetail.bank_info : {};

  // 收款模式
  const [collection, setCollection] = useState(bankInfo.payment_type || EmployeeCollectionType.personal);
  const [personalDisabled, setPersonalDisabled] = useState(true);
  const [collectionDisabled, setCollectionDisabled] = useState(true);
  const [visible, onChangeVisible] = useState(false);

  useEffect(() => {
    if (specialFields && Object.keys(specialFields).length > 0) {
      specialFields.bank_info && specialFields.bank_info.payment_type && (
        setCollection(specialFields.bank_info.payment_type)
      );
    }
  }, [specialFields]);

  // 收款模式onChange
  const onChangeCollection = (val) => {
    setCollection(val.target.value);

    if (val.target.value === bankInfo.payment_type) {
      // 编辑时重置到详情的数据
      form.setFieldsValue({
        ...getIniitialValues(),
      });
    } else {
      // 重置银行卡信息
      setFieldsValue({
        card_holder_name: undefined,
        card_holder_bank_card_no: undefined,
        bank_branch: undefined,
        bank_branch_name: undefined,
        bank_location: { province: undefined, city: undefined },
        bank_card_front: undefined,
        collect_protocol: undefined,
        collect_id_card_no: undefined,
      });
    }
  };

  // 银行卡onChange
  const onChangeBankPositive = () => {
    // 重置银行卡账号，开户行
    setFieldsValue({
      card_holder_bank_card_no: undefined,
      bank_branch: undefined,
    });
  };

  // 银行卡识别成功回调
  const onIdentifySuccess = (res) => {
    message.success('识别成功');
    const bankCardId = dot.get(res, 'record.bank_card_id');
    setFieldsValue({
      card_holder_bank_card_no: bankCardId ? String(bankCardId).replace(/\s/g, '') : undefined,
      bank_branch: dot.get(res, 'record.bank_name', undefined),
    });
  };

  // 银行卡正面照识别
  const onIdentifyBankCard = () => {
    const bankPositive = getFieldValue('bank_card_front') || {};
    const {
      keys,
      urls,
    } = bankPositive;
    if (Array.isArray(keys)
      && Array.isArray(urls)
      && keys.length > 0
      && urls.length > 0
    ) {
      dispatch({
        type: 'employeeManage/fetchBankCardIdentification',
        payload: {
          bankgPositive: bankPositive,
          onSuccessCallback: res => onIdentifySuccess(res),
          onErrorCallback: () => {
            onChangeVisible(true);
          },
        },
      });
    } else {
      message.error('请上传银行卡正面照');
    }
  };

  // 校验开户行所在地
  const checkOtherDeparture = (_, value, callback) => {
    if (!value || Object.keys(value).length < 0) {
      return callback('请选择开户行所在地');
    }

    const {
      province, // 省
      city, // 市
      // area, // 区
    } = value;

    if (!province && !city) {
      return callback('请选择开户行所在地');
    }

    if (!province) {
      return callback('请选择省份');
    }

    if (!city) {
      return callback('请选择城市');
    }

    callback();
  };


  // 校验开户行所在地
  const checkDeparture = (_, value, callback) => {
    if (!value || Object.keys(value).length < 1) {
      return callback();
    }

    const {
      province, // 省
      city, // 市
      // area, // 区
    } = value;

    if (!province && city) {
      return callback('请选择省份');
    }

    if (!city && province) {
      return callback('请选择城市');
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
      return callback('请上传银行卡正面照');
    }

    callback();
  };

  // 上传图片校验
  const validatorCollectProtocol = (_, value, callback) => {
    if (!value
      || !Array.isArray(value.keys)
      || value.keys.length < 1
      || !Array.isArray(value.urls)
      || value.urls.length < 1
    ) {
      return callback('请上传代收协议');
    }

    callback();
  };

  // 本人银行卡form item
  const renderMySelfFormItem = () => {
    const formItems = [
      <Form.Item
        label="持卡人姓名"
        name="card_holder_name"
        {...formLayout}
      >
        <Input placeholder="请输入持卡人姓名" />
      </Form.Item>,
      <Form.Item
        label="银行卡账号"
        name="card_holder_bank_card_no"
        rules={[
          { pattern: /^[0-9]{1,23}$/g, message: '银行卡账号必须为数字，并且最多23位' },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入银行卡账号" disabled={personalDisabled} />
      </Form.Item>,
      <Form.Item
        label="开户行"
        name="bank_branch"
        rules={[
          { pattern: /^[\u4e00-\u9fa5]{1,32}$/, message: '开户行名称必须为汉字，并且最多32位' },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入开户行名称" disabled={personalDisabled} />
      </Form.Item>,
      <Form.Item
        label="支行名称"
        name="bank_branch_name"
        {...formLayout}
      >
        <Input placeholder="请输入支行名称" />
      </Form.Item>,
      {
        span: 16,
        render: (
          <Form.Item
            label="开户行所在地"
            name="bank_location"
            rules={[
              { validator: checkDeparture },
            ]}
            {...addressFormLayout}
          >
            <CommonSelectRegionalName
              provinceWidth={150}
              cityWith={180}
            />
          </Form.Item>
        ),
      },
      <Form.Item
        label="银行卡正面照"
        name="bank_card_front"
        {...formLayout}
      >
        <CorePhotosAmazon
          maximum={1}
          domain="staff"
          namespace="bank_card_front"
          onChange={onChangeBankPositive}
        />
      </Form.Item>,
    ];

    const operateItems = [
      <Form.Item
        label=" "
        key="operate"
        colon={false}
        {...formLayout}
      >
        <Button
          type="primary"
          onClick={onIdentifyBankCard}
        >识别银行卡</Button>
      </Form.Item>,
    ];

    return (
      <React.Fragment>
        <CoreForm items={formItems} />
        <CoreForm items={operateItems} />
      </React.Fragment>
    );
  };

  // 他人银行卡form item
  const renderOtherFormItems = () => {
    const formItems = [
      <Form.Item
        label="持卡人姓名"
        name="card_holder_name"
        rules={[
          { required: true, message: '请输入持卡人姓名' },
          { pattern: /^[\u4e00-\u9fa5A-Za-z]+$/, message: '请输入汉字或字母' },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入持卡人姓名" />
      </Form.Item>,
      <Form.Item
        label="代收人身份证号码"
        name="collect_id_card_no"
        rules={[
          {
            required: true,
            validator: Utils.asyncValidateIdCardNumber,
          },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入代收人身份证号码" />
      </Form.Item>,
      <Form.Item
        label="银行卡账号"
        name="card_holder_bank_card_no"
        rules={[
          { required: true, message: '请识别正确的代收人银行卡账号' },
          { pattern: /^[0-9]{1,23}$/g, message: '银行卡账号必须为数字，并且最多23位' },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入银行卡账号" disabled={collectionDisabled} />
      </Form.Item>,
      <Form.Item
        label="开户行"
        name="bank_branch"
        rules={[
          { required: true, message: '请识别正确的开户行名称' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$/, message: '开户行名称必须为汉字，并且最多32位' },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入开户行名称" disabled={collectionDisabled} />
      </Form.Item>,
      <Form.Item
        label="支行名称"
        name="bank_branch_name"
        rules={[
          { required: true, message: '请输入支行名称' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '支行名称必须为汉字' },
        ]}
        {...formLayout}
      >
        <Input placeholder="请输入支行名称" />
      </Form.Item>,
      {
        span: 16,
        render: (
          <Form.Item
            label="开户行所在地"
            name="bank_location"
            rules={[
              { required: true, validator: checkOtherDeparture },
            ]}
            {...addressFormLayout}
          >
            <CommonSelectRegionalName
              provinceWidth={150}
              cityWith={180}
            />
          </Form.Item>
        ),
      },
    ];

    // 照片form item
    const photoItems = [
      <Form.Item
        label="银行卡正面照"
        name="bank_card_front"
        rules={[
          { required: true, validator: validatorCardFront },
        ]}
        {...formLayout}
      >
        <CorePhotosAmazon
          maximum={1}
          domain="staff"
          namespace="bank_card_front"
        />
      </Form.Item>,
      <Form.Item
        label="代收协议"
        name="collect_protocol"
        rules={[
          { required: true, validator: validatorCollectProtocol },
        ]}
        {...formLayout}
      >
        <CorePhotosAmazon
          domain="staff"
          multiple
          namespace="collect_protocol"
        />
      </Form.Item>,
    ];

    const operateItems = [
      <Form.Item
        label=" "
        key="operate"
        colon={false}
        {...formLayout}
      >
        <Button
          type="primary"
          onClick={onIdentifyBankCard}
        >识别银行卡</Button>
      </Form.Item>,
    ];

    return (
      <React.Fragment>
        <CoreForm items={formItems} />
        <CoreForm items={photoItems} />
        <CoreForm items={operateItems} />
      </React.Fragment>
    );
  };

  const items = [
    <Form.Item
      label="收款模式"
      name="payment_type"
      rules={[
        { required: true, message: '请选择收款方式' },
      ]}
      {...formLayout}
    >
      <Radio.Group
        onChange={onChangeCollection}
      >
        <Radio
          value={EmployeeCollectionType.personal}
        >
          {EmployeeCollectionType.description(EmployeeCollectionType.personal)}
        </Radio>
        <Radio
          value={EmployeeCollectionType.collecting}
        >
          {EmployeeCollectionType.description(EmployeeCollectionType.collecting)}
        </Radio>
      </Radio.Group>
    </Form.Item>,
  ];

  // 获取initialValues
  const getIniitialValues = () => {
    // initialValues
    const initialValues = {
      bank_location: Array.isArray(bankInfo.bank_location) && bankInfo.bank_location.length > 0 ?
      {
        province: bankInfo.bank_location[0],
        city: bankInfo.bank_location[1],
      } : {}, // 所在地（省市）
      payment_type: bankInfo.payment_type || EmployeeCollectionType.personal, // 收款模式
      card_holder_name: bankInfo.card_holder_name || undefined, // 持卡人姓名
      card_holder_bank_card_no: bankInfo.card_holder_bank_card_no || undefined, // 银行卡账号
      bank_branch: bankInfo.bank_branch || undefined, // 开户行
      bank_branch_name: bankInfo.bank_branch_name || undefined, // 支行名称
      bank_card_front: {
        keys: bankInfo.bank_card_front ?
          [bankInfo.bank_card_front]
          : [],
        urls: bankInfo.bank_card_front_url ?
          [bankInfo.bank_card_front_url]
          : [],
      }, // 银行卡正面照
      collect_protocol: {
        keys: Array.isArray(bankInfo.collect_protocol) ?
          bankInfo.collect_protocol
          : [],
        urls: Array.isArray(bankInfo.collect_protocol_url) ?
          bankInfo.collect_protocol_url
          : [],
      }, // 代收协议
      collect_id_card_no: bankInfo.collect_id_card_no || undefined, // 代收人身份证号码
    };
    return initialValues;
  };

  return (
    <CoreContent title="银行卡信息">
      <Form
        form={form}
        initialValues={getIniitialValues()}
        className="affairs-flow-basic"
      >
        <CoreForm items={items} />
        {/* 本人银行卡 */}
        {
          collection === EmployeeCollectionType.personal && renderMySelfFormItem()
        }
        {/* 他人银行卡 */}
        {
          collection === EmployeeCollectionType.collecting && renderOtherFormItems()
        }
        <Modal
          title="银行卡识别"
          visible={visible}
          cancelText="重新识别"
          okText="手动录入"
          footer={(<div style={{ textAlign: 'right' }}>
            <Button
              style={{ marginRight: 10 }}
              onClick={() => {
                onChangeVisible(false);
                onIdentifyBankCard();
              }}
            >重新识别</Button>
            <Button
              type="primary"
              onClick={() => {
                onChangeVisible(false);
                // 本人银行卡
                if (collection === EmployeeCollectionType.personal) {
                  setPersonalDisabled(false);
                }
                // 他人代收
                if (collection === EmployeeCollectionType.collecting) {
                  setCollectionDisabled(false);
                }
              }}
            >手动录入</Button></div>)}
          onCancel={() => {
            onChangeVisible(false);
          }}
        >
          <p>银行卡信息识别失败，请重新识别银行卡，或者手动录入银行卡信息</p>
        </Modal>
      </Form>
    </CoreContent>
  );
};

const mapStateToProps = ({
  employeeManage: { bankInfo },
}) => {
  return { bankInfo };
};

export default connect(mapStateToProps)(BankForm);
