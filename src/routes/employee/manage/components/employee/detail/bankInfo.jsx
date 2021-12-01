/**
 * 员工档案 - 员工详情 - 基本信息tab - 银行卡信息
 */
import React from 'react';
import {
  Form,
} from 'antd';
import {
  EmployeeCollectionType,
} from '../../../../../../application/define';
import {
  CoreForm,
  CoreContent,
  CorePhotosAmazon,
} from '../../../../../../components/core';

import Operate from '../../../../../../application/define/operate';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

const BankInfo = ({
  employeeDetail = {}, // 员工详情
}) => {
  // 银行卡信息
  const bankInfo = employeeDetail.bank_info ? employeeDetail.bank_info : {};

  const {
    payment_type: collection, // 收款模式
  } = bankInfo;

  // 银行卡正面照
  const bankCardPhoto = {
    keys: bankInfo.bank_card_front ? [bankInfo.bank_card_front] : [],
    urls: bankInfo.bank_card_front_url ? [bankInfo.bank_card_front_url] : [],
  };

  // 代收协议
  const collectProtocol = {
    keys: Array.isArray(bankInfo.collect_protocol) ? bankInfo.collect_protocol : [],
    urls: Array.isArray(bankInfo.collect_protocol_url) ? bankInfo.collect_protocol_url : [],
  };

  // 上传图片
  const renderPhoto = (namespace, value = {}) => {
    if (!Array.isArray(value.keys)
      || !Array.isArray(value.urls)
      || value.keys.length < 1
      || value.urls.length < 1
    ) {
      return (
        <div
          style={{
            width: 104,
            height: 104,
            backgroundColor: '#eee',
            textAlign: 'center',
            lineHeight: '104px',
          }}
        >
          暂无
        </div>
      );
    }
    return (
      <CorePhotosAmazon
        isDisplayMode
        value={value}
        namespace={namespace}
        domain="staff"
      />
    );
  };

  // 本人银行卡form item
  const renderMySelfInfo = () => {
    const formItems = [
      <Form.Item
        label="持卡人姓名"
        {...formLayout}
      >
        {bankInfo.card_holder_name || '--'}
      </Form.Item>,
      <Form.Item
        label="银行卡账号"
        {...formLayout}
      >
        {bankInfo.card_holder_bank_card_no || '--'}
      </Form.Item>,
      <Form.Item
        label="开户行"
        {...formLayout}
      >
        {bankInfo.bank_branch || '--'}
      </Form.Item>,
      <Form.Item
        label="支行名称"
        {...formLayout}
      >
        {bankInfo.bank_branch_name || '--'}
      </Form.Item>,
      <Form.Item
        label="开户行所在地"
        {...formLayout}
      >
        {bankInfo.bank_location || '--'}
      </Form.Item>,
      <Form.Item key="self_empty" />,
      <Form.Item
        label="银行卡正面照"
        {...formLayout}
      >
        {renderPhoto('bank_card_front', bankCardPhoto)}
      </Form.Item>,
    ];

    return (
      <CoreForm items={formItems} />
    );
  };

  // 他人银行卡form item
  const renderOtherInfo = () => {
    const formItems = [
      <Form.Item
        label="持卡人姓名"
        {...formLayout}
      >
        {bankInfo.card_holder_name || '--'}
      </Form.Item>,
      <Form.Item
        label="代收人身份证号码"
        {...formLayout}
      >
        {bankInfo.collect_id_card_no || '--'}
      </Form.Item>,
      <Form.Item
        label="银行卡账号"
        {...formLayout}
      >
        {bankInfo.card_holder_bank_card_no || '--'}
      </Form.Item>,
      <Form.Item
        label="开户行"
        {...formLayout}
      >
        {bankInfo.bank_branch || '--'}
      </Form.Item>,
      <Form.Item
        label="支行名称"
        {...formLayout}
      >
        {bankInfo.bank_branch_name || '--'}
      </Form.Item>,
      <Form.Item
        label="开户行所在地"
        {...formLayout}
      >
        {bankInfo.bank_location || '--'}
      </Form.Item>,
    ];

    // 照片form item
    const photoItems = [
      <Form.Item
        label="银行卡正面照"
        {...formLayout}
      >
        {renderPhoto('bank_card_front', bankCardPhoto)}
      </Form.Item>,
      <Form.Item
        label="代收协议"
        {...formLayout}
      >
        {renderPhoto('collect_protocol', collectProtocol)}
      </Form.Item>,
    ];

    return (
      <React.Fragment>
        <CoreForm items={formItems} />
        <CoreForm items={photoItems} />
      </React.Fragment>
    );
  };
  // 如果后端没有返回收款模式类型 默认显示本人银行卡
  let collectionMode = EmployeeCollectionType.personal;
  // collection:后端返回的收款模式类型
  if (collection) {
    collectionMode = collection;
  }
  const items = [
    <Form.Item
      label="收款模式"
      {...formLayout}
    >
      {EmployeeCollectionType.description(collectionMode)}
    </Form.Item>,
  ];

  // titleExt
  const titleExt = Operate.canOperateModuleEmployeeDetailHistoryInfo() ?
    (
      <a
        key="history"
        target="_blank"
        rel="noopener noreferrer"
        href={`/#/Employee/Detail/HistoryInfo?id=${employeeDetail._id}&profileType=${employeeDetail.profile_type}`}
      >
        历史记录
      </a>
    ) : '';

  return (
    <CoreContent title="银行卡信息" titleExt={titleExt}>
      <Form
        className="affairs-flow-basic"
      >
        <CoreForm items={items} />
        {/* 本人银行卡 */}
        {
          collection === EmployeeCollectionType.personal && renderMySelfInfo()
        }
        {/* 他人银行卡 */}
        {
          collection === EmployeeCollectionType.collecting && renderOtherInfo()
        }
      </Form>
    </CoreContent>
  );
};

export default BankInfo;
