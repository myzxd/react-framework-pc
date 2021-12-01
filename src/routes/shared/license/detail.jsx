/**
 * 共享登记 - 证照详情
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { useEffect } from 'react';
import {
  Form,
} from 'antd';
import { connect } from 'dva';

import {
  AdministrationLicense,
  AdministrationLicenseType,
  SharedLicenseDeadLineType,
  SharedLicenseBorrowState,
  SharedLicenseType,
  SharedAuthorityState,
  SharedSourceType,
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

const LicenseDetail = ({
  getLicenseDetail,
  resetLicenseDetail,
  location = {},
  licenseDetail = {},
}) => {
  const [form] = Form.useForm();
  const { query = {} } = location;

  useEffect(() => {
    query.id && getLicenseDetail({ id: query.id });
    return () => resetLicenseDetail();
  }, [getLicenseDetail, resetLicenseDetail, query.id]);

  // 无数据
  if (!licenseDetail || Object.keys(licenseDetail).length <= 0) return <div />;

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
    cert_type: certType = undefined,
    origin = undefined,
    display = undefined,
    from_date: fromDate = undefined,
    end_date: endDate = undefined,
    certification_unit: certificationUnit = undefined,
    send_date: sendDate = undefined,
    cert_deadline_type: certDeadlineType = undefined,
    other_cert_deadline: otherCertDeadline = undefined,
    note = undefined,
    borrow_state: borrowState = undefined,
    expected_return_date: expectedReturnDate = undefined,
    created_at: createdAt = undefined,
  } = licenseDetail;

  const items = [
    <Form.Item
      label="证照类型"
    >
      {certType ? SharedLicenseType.description(certType) : '--'}
    </Form.Item>,
    <Form.Item
      label="证照负责人"
    >
      {dot.get(licenseDetail, 'keep_account_info.name', undefined) ? dot.get(licenseDetail, 'keep_account_info.name') : '--'}
    </Form.Item>,
    <Form.Item
      label="证照名称"
    >
      {dot.get(licenseDetail, 'name', undefined) ? dot.get(licenseDetail, 'name') : '--'}
    </Form.Item>,
    <Form.Item
      label="公司名称"
    >
      {dot.get(licenseDetail, 'firm_info.name', undefined) ? dot.get(licenseDetail, 'firm_info.name') : '--'}
    </Form.Item>,
    <Form.Item
      label="证照编号"
    >
      {dot.get(licenseDetail, 'cert_no', undefined) ? dot.get(licenseDetail, 'cert_no') : '--'}
    </Form.Item>,
    <Form.Item
      label="统一社会信用代码"
    >
      {dot.get(licenseDetail, 'credit_no', undefined) ? dot.get(licenseDetail, 'credit_no') : '--'}
    </Form.Item>,
    <Form.Item
      label="正副本"
    >
      {origin ? AdministrationLicenseType.description(origin) : '--'}
    </Form.Item>,
    <Form.Item
      label="原件/复印件"
    >
      {display ? AdministrationLicense.description(display) : '--'}
    </Form.Item>,
    <Form.Item
      label="公司区域"
    >
      {`${dot.get(licenseDetail, 'province_name', '-')}${dot.get(licenseDetail, 'city_name', '-')}`}
    </Form.Item>,
    <Form.Item
      label="营业期限开始"
    >
      {fromDate ? moment(String(fromDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      label="营业期限结束"
    >
      {endDate ? moment(String(endDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      label="发证日期"
    >
      {sendDate ? moment(String(sendDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      label="发证单位"
    >
      {certificationUnit || '--'}
    </Form.Item>,
    <Form.Item
      label="证照有效期"
    >
      <span>{certDeadlineType ? SharedLicenseDeadLineType.description(certDeadlineType) : '--'}</span>
      <span style={{ paddingLeft: 5 }}>{otherCertDeadline ? moment(String(otherCertDeadline)).format('YYYY-MM-DD') : ''}</span>
    </Form.Item>,
  ];

  const itemSource = [
    <Form.Item
      label="备注"
      {...formLayoutC1}
    >
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{note || '--'}</div>
    </Form.Item>,
  ];

  const itemsOne = [
    <Form.Item
      label="来源"
    >
      {
        dot.get(licenseDetail, 'source_type', '')
        ? SharedSourceType.description(dot.get(licenseDetail, 'source_type'))
        : '--'
      }
    </Form.Item>,
    <Form.Item
      label={
        dot.get(licenseDetail, 'source_type', '') === SharedSourceType.approval
        ? '提报人'
        : '创建人'
      }
    >
      {
        dot.get(licenseDetail, 'source_type', '') === SharedSourceType.approval
        ? dot.get(licenseDetail, 'report_info.name', '--')
        : dot.get(licenseDetail, 'creator_info.name', '--')
      }
    </Form.Item>,
    <Form.Item
      label="创建时间"
    >
      {createdAt ? moment(createdAt).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
  ];

  const itemOrder = [
    <Form.Item
      label="证照状态"
    >
      {borrowState ? SharedLicenseBorrowState.description(borrowState) : '--'}
    </Form.Item>,
    <Form.Item
      label="借用人"
    >
      {dot.get(licenseDetail, 'borrower_info.name', '--')}
    </Form.Item>,
    <Form.Item
      label="预计归还时间"
    >
      {expectedReturnDate ? moment(String(expectedReturnDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
  ];

  const itemFile = [
    <Form.Item
      label="附件"
      {...formLayoutC1}
    >
      <PageUpload
        domain={PageUpload.UploadDomains.OAUploadDomain}
        displayMode
        value={PageUpload.getInitialValue(licenseDetail, 'asset_infos')}
      />
    </Form.Item>,
  ];

  const itemAuthority = [
    <Form.Item
      label="可见成员"
      {...formLayoutC1}
    >
      {
        dot.get(licenseDetail, 'look_acl', undefined) === SharedAuthorityState.all
        ? '全部'
        : renderName(dot.get(licenseDetail, 'look_account_info_list', []), dot.get(licenseDetail, 'look_department_info_list', []))
      }
    </Form.Item>,
  ];

  return (
    <Form {...FormLayoutC3} form={form}>
      <CoreContent>
        <CoreForm items={items} />
        <CoreForm items={itemSource} cols={1} />
        <CoreForm items={itemsOne} />
        <CoreForm items={itemOrder} />
        <CoreForm items={itemFile} cols={1} />
        {
          Operate.canOperateSharedLicenseAuthority() ?
            (<CoreForm items={itemAuthority} cols={1} />) : ''
        }
      </CoreContent>
    </Form>
  );
};

const mapDispatchToProps = dispatch => ({
  getLicenseDetail: payload => dispatch({
    type: 'sharedLicense/getSharedLicenseDetail',
    payload,
  }),
  resetLicenseDetail: () => dispatch({
    type: 'sharedLicense/resetSharedLicenseDetail',
    payload: {},
  }),
});

const mapStateToProps = ({ sharedLicense: { licenseDetail } }) => ({ licenseDetail });

export default connect(mapStateToProps, mapDispatchToProps)(LicenseDetail);
