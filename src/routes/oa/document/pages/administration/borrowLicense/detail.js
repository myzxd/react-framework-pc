/**
 * 行政类 - 证照借用申请 - 详情 /Oa/Document/Pages/Administration/BorrowLicense/Create
 */
import { connect } from 'dva';
import React, {
  useEffect,
} from 'react';
import moment from 'moment';
import dot from 'dot-prop';
import {
  Form,
} from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { AdministrationLicense, AdministrationLicenseType } from '../../../../../../application/define';
import { PageUpload } from '../../../components/index';

const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };

const PageBorrowLicenseDetail = (props) => {
  const [form] = Form.useForm();
  const {
    query,
    dispatch,
    borrowLicenseDetail,
    oaDetail = {},
  } = props;
  useEffect(() => {
    if (oaDetail._id) {
      dispatch({ type: 'administration/fetchBorrowLicenseDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'administration/fetchBorrowLicenseDetail', payload: { id: query.id } });
    }
    return () => {
      dispatch({ type: 'administration/resetBorrowLicenseDetail' });
    };
  }, [dispatch, query.id, oaDetail]);

  // 渲染证照信息
  const renderSeal = () => {
    const expectFromDate = borrowLicenseDetail.expect_from_date ? moment(`${borrowLicenseDetail.expect_from_date}`).format('YYYY-MM-DD') : undefined;
    const expectEndDate = borrowLicenseDetail.expect_end_date ? moment(`${borrowLicenseDetail.expect_end_date}`).format('YYYY-MM-DD') : undefined;
    const firmInfo = dot.get(borrowLicenseDetail, 'firm_info', {});
    const certInfo = dot.get(borrowLicenseDetail, 'cert_info', {});
    const keepAccountInfo = dot.get(certInfo, 'keep_account_info', {});

    const formItems = [
      <Form.Item
        label="公司名称"
        name="companyName"
        {...formLayoutC3}
      >
        {dot.get(firmInfo, 'name') || '--'}
      </Form.Item>,
      <Form.Item
        label="证照名称"
        name="licenseName"
        {...formLayoutC3}
      >
        {dot.get(certInfo, 'name') || '--'}
      </Form.Item>,
      <Form.Item
        label="证照保管人"
        {...formLayoutC3}
      >
        {dot.get(keepAccountInfo, 'name') || '--'}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="原件/复印件"
        name="license"
        {...formLayoutC3}
      >
        {AdministrationLicense.description(borrowLicenseDetail.cert_nature)}
      </Form.Item>,
      <Form.Item
        label="证照类型"
        name="licenseType"
        {...formLayoutC3}
      >
        {AdministrationLicenseType.description(borrowLicenseDetail.cert_type)}
      </Form.Item>,
    ];
    const formItems3 = [
      <Form.Item
        label="预计借用时间"
        {...formLayoutC3}
      >
        {expectFromDate || '--'}
      </Form.Item>,
      <Form.Item
        label="预计归还时间"
        {...formLayoutC3}
      >
        {expectEndDate || '--'}
      </Form.Item>,
    ];
    const formItems4 = [
      <Form.Item
        label="申请事由"
        {...formLayoutC1}
      >
        <span className="noteWrap">{dot.get(borrowLicenseDetail, 'note') || '--'}</span>
      </Form.Item>,
      <Form.Item
        label="附件"
        {...formLayoutC1}
      >
        <PageUpload
          domain={PageUpload.UploadDomains.OAUploadDomain}
          displayMode
          value={PageUpload.getInitialValue(borrowLicenseDetail, 'asset_infos')}
        />
      </Form.Item>,
    ];
    return (
      <CoreContent title="证照信息">
        <CoreForm items={formItems} />
        <CoreForm items={formItems2} />
        <CoreForm items={formItems3} />
        <CoreForm items={formItems4} cols={1} />
      </CoreContent>
    );
  };
  const initialValue = {
  };
  return (
    <Form form={form} initialValues={initialValue}>
      {renderSeal()}
    </Form>
  );
};
function mapStateToProps({ administration: { borrowLicenseDetail } }) {
  return { borrowLicenseDetail };
}
export default connect(mapStateToProps)(PageBorrowLicenseDetail);
