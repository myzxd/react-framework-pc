/**
 * 共享登记 - 银行详情
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { useEffect } from 'react';
import {
  Form,
} from 'antd';
import { connect } from 'dva';

import {
  BusinesBankAccountType,
  SharedBankAccountState,
  SharedAuthorityState,
  SharedSourceType,
  SharedBankCurrency,
  SharedBankOnlineBankType,
  SharedBankOpenAccountInfoType,
  SharedBankChangeSchedule,
  SharedBankAccountSystem,
} from '../../../application/define';
import { CoreForm, CoreContent } from '../../../components/core';
import { PageUpload } from '../../oa/document/components/index';
import Operate from '../../../application/define/operate';

const FormLayoutC3 = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

const formLayoutC1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const BankAccountDetail = ({
  bankAccountDetail = {},
  location = {},
  getBankAccountDetail,
  resetBankAccountDetail,
}) => {
  const [form] = Form.useForm();
  const { query = {} } = location;

  useEffect(() => {
    query.id && getBankAccountDetail({ id: query.id });
    return () => resetBankAccountDetail();
  }, [getBankAccountDetail, resetBankAccountDetail, query.id]);

  // 无数据
  if (!bankAccountDetail || Object.keys(bankAccountDetail).length <= 0) return <div />;

  const renderName = (accountInfo, departmentInfo) => {
    const infoArr = accountInfo.concat(departmentInfo);
    if (infoArr.length === 0) return '--';
    return infoArr.reduce((acc, cur, idx) => {
      if (idx === 0) {
        return cur.name;
      }
      return `${acc}, ${cur.name}`;
    }, '');
  };

  const {
    bank_card_type: bankCardType = undefined,
    bank_opened_date: bankOpenedDate = undefined,
    note = undefined,
    state = undefined,
    created_at: createdAt = undefined,
    canceler_date: cancelerDate = undefined,
    currency = undefined,
    online_banking: onlineBank = undefined,
    online_custodian_employee_list: custodian = undefined,
    opened_data: information = undefined,
    opened_data_desc: openNote,
    bank_user_contact_name: person,
    bank_user_contact_way: phone,
    account_change_schedule_desc: scheduleNote,
    account_change_schedule: changeSchedule,
  } = bankAccountDetail;

  const items = [
    <Form.Item
      label="公司名称"
    >
      {dot.get(bankAccountDetail, 'firm_info.name', '--')}
    </Form.Item>,
    <Form.Item
      label="税号"
    >
      {dot.get(bankAccountDetail, 'firm_info.tax_number', undefined) ? dot.get(bankAccountDetail, 'firm_info.tax_number') : '--'}
    </Form.Item>,
    <Form.Item
      label="开户账号"
    >
      {dot.get(bankAccountDetail, 'bank_card', '--')}
    </Form.Item>,
    <Form.Item
      label="账户类型"
    >
      {bankCardType ? BusinesBankAccountType.description(bankCardType) : '--'}
    </Form.Item>,
    <Form.Item
      label="开户银行"
    >
      {dot.get(bankAccountDetail, 'bank_and_branch', '--')}
    </Form.Item>,
    <Form.Item
      label="开户时间"
    >
      {bankOpenedDate ? moment(String(bankOpenedDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      label="所属区域"
    >
      {`${dot.get(bankAccountDetail, 'province_name', '-')}${dot.get(bankAccountDetail, 'city_name', '-')}`}
    </Form.Item>,
    <Form.Item
      label="开户地址"
    >
      {dot.get(bankAccountDetail, 'opening_address', undefined) ? dot.get(bankAccountDetail, 'opening_address') : '--'}
    </Form.Item>,
    <Form.Item
      label="币种"
    >
      {currency ? SharedBankCurrency.description(currency) : '--'}
    </Form.Item>,
    <Form.Item
      label="网银"
    >
      {onlineBank ? SharedBankOnlineBankType.description(onlineBank) : '--'}
    </Form.Item>,
    <Form.Item
      label="网银保管人"
    >
      {
        Array.isArray(custodian) && custodian.length > 0 ?
          custodian.map(i => i.name).join('，')
          : '--'
      }
    </Form.Item>,
    <Form.Item
      label="账户体系"
      name="account_system"
    >
      {dot.get(bankAccountDetail, 'account_system', undefined)
        ? SharedBankAccountSystem.description(dot.get(bankAccountDetail, 'account_system'))
        : '--'}
    </Form.Item>,
    <Form.Item
      label="开户资料"
    >
      {
        Array.isArray(information) && information.length > 0 ?
          information.map(i => SharedBankOpenAccountInfoType.description(i)).join('、')
          : '--'
      }
    </Form.Item>,
    <Form.Item
      label="开户保管人"
    >
      {dot.get(bankAccountDetail, 'opened_custodian_employee_info.name', '--')}
    </Form.Item>,
  ];

  // 开户资料说明
  (Array.isArray(information) && information.includes(SharedBankOpenAccountInfoType.other)) && (
    items[items.length] = {
      span: 24,
      key: 'open_account_note',
      render: (
        <Form.Item
          label="开户资料说明"
          {...formLayoutC1}
        >
          <span className="noteWrap">{openNote || '--'}</span>
        </Form.Item>
      ),
    });

  // 银行联系人信息
  const itemsBankPerson = [
    <Form.Item label="银行联系人">
      {person || '--'}
    </Form.Item>,
    <Form.Item label="银行联系方式">
      {phone || '--'}
    </Form.Item>,
    <Form.Item label="银行变更进度">
      {changeSchedule ? SharedBankChangeSchedule.description(changeSchedule) : '--'}
    </Form.Item>,
  ];

  changeSchedule === SharedBankChangeSchedule.undone && (
    itemsBankPerson[itemsBankPerson.length] = {
      span: 24,
      key: 'change_schedule_note',
      render: (
        <Form.Item
          label="账户进度说明"
          {...formLayoutC1}
        >
          {scheduleNote || '--'}
        </Form.Item>
      ),
    }
  );

  const itemsOne = [
    <Form.Item
      label="备注"
      {...formLayoutC1}
    >
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{note || '--'}</div>
    </Form.Item>,

  ];

  const itemsTwo = [
    <Form.Item
      label="来源"
    >
      {
        dot.get(bankAccountDetail, 'source_type', '')
        ? SharedSourceType.description(dot.get(bankAccountDetail, 'source_type'))
        : '--'
      }
    </Form.Item>,
    <Form.Item
      label={
        dot.get(bankAccountDetail, 'source_type', '') === SharedSourceType.approval
        ? '提报人'
        : '创建人'
      }
    >
      {
        dot.get(bankAccountDetail, 'source_type', '') === SharedSourceType.approval
        ? dot.get(bankAccountDetail, 'report_info.name', '--')
        : dot.get(bankAccountDetail, 'creator_info.name', '--')
      }
    </Form.Item>,
    <Form.Item
      label="创建时间"
    >
      {createdAt ? moment(createdAt).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      label="状态"
    >
      {state ? SharedBankAccountState.description(state) : '--'}
    </Form.Item>,
  ];

  if (`${state}` !== `${SharedBankAccountState.normal}`) {
    itemsTwo.push(
      <Form.Item
        label="注销提报人"
      >
        {dot.get(bankAccountDetail, 'canceler_info.name', '--')}
      </Form.Item>,
      <Form.Item
        label="注销时间"
      >
        {cancelerDate ? moment(String(cancelerDate)).format('YYYY-MM-DD') : '--'}
      </Form.Item>,
    );
  }

  const itemsFile = [
    <Form.Item
      label="附件"
      {...formLayoutC1}
    >
      <PageUpload
        domain={PageUpload.UploadDomains.OAUploadDomain}
        displayMode
        value={PageUpload.getInitialValue(bankAccountDetail, 'asset_infos')}
      />
    </Form.Item>,
  ];

  const itemAuthority = [
    <Form.Item
      label="可见成员"
      {...formLayoutC1}
    >
      {
        dot.get(bankAccountDetail, 'look_acl', undefined) === SharedAuthorityState.all
        ? '全部'
        : renderName(dot.get(bankAccountDetail, 'look_account_info_list', []), dot.get(bankAccountDetail, 'look_department_info_list', []))
      }
    </Form.Item>,
  ];

  return (
    <Form {...FormLayoutC3} form={form}>
      <CoreContent>
        <CoreForm items={items} />
        <CoreForm items={itemsOne} cols={1} />
        <CoreForm items={itemsBankPerson} />
        <CoreForm items={itemsTwo} />
        <CoreForm items={itemsFile} cols={1} />
        {
          Operate.canOperateSharedBankAccountAuthority() ?
            (<CoreForm items={itemAuthority} cols={1} />) : ''
        }
      </CoreContent>
    </Form>
  );
};

const mapDispatchToProps = dispatch => ({
  getBankAccountDetail: payload => dispatch({
    type: 'sharedBankAccount/getSharedBankAccountDetail',
    payload,
  }),
  resetBankAccountDetail: () => dispatch({
    type: 'sharedBankAccount/resetSharedBankAccountDetail',
    payload: {},
  }),
});

const mapStateToProps = ({ sharedBankAccount: { bankAccountDetail } }) => ({ bankAccountDetail });

export default connect(mapStateToProps, mapDispatchToProps)(BankAccountDetail);
