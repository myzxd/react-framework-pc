/**
 * 共享登记 - 公司详情
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { useEffect } from 'react';
import {
  Form,
} from 'antd';
import { connect } from 'dva';

import {
  Unit,
  SharedCompanyState,
  SharedAuthorityState,
  SharedSourceType,
  BusinessCompanyType,
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

const CompanyDetail = ({
  companyDetail = {},
  location = undefined,
  getCompanyDetail,
  resetCompanyDetail,
  getSharedCompanyNature,
  companyNature,
}) => {
  const [form] = Form.useForm();
  const { query = {} } = location;

  useEffect(() => {
    query.id && getCompanyDetail({ id: query.id });
    return () => resetCompanyDetail();
  }, [getCompanyDetail, resetCompanyDetail, query.id]);

  // 获取公司类型
  useEffect(() => {
    getSharedCompanyNature();
  }, []);

  // 无数据
  if (!companyDetail || Object.keys(companyDetail).length <= 0) return <div />;

  const renderName = (accountInfo, departmentInfo) => {
    const infoArr = accountInfo.concat(departmentInfo);
    if (infoArr.length === 0) return '全部';
    return infoArr.reduce((acc, cur, idx) => {
      if (idx === 0) {
        return cur.name;
      }
      return `${acc}, ${cur.name}`;
    }, '');
  };

  const {
    firm_nature: firmNature = undefined,
    firm_type: firmType = undefined,
    registered_capital: registeredCapital = undefined,
    paid_capital: paidCapital = undefined,
    registered_date: registeredDate = undefined,
    business_scope: businessScope = undefined,
    state = undefined,
    created_at: createdAt = undefined,
    canceler_date: cancelerDate = undefined,
  } = companyDetail;

  const _note = dot.get(companyDetail, 'note', undefined) ? dot.get(companyDetail, 'note') : '--';

  const items = [
    <Form.Item
      label="公司名称"
    >
      {dot.get(companyDetail, 'name', '--')}
    </Form.Item>,
    <Form.Item
      label="公司类型"
    >
      {firmNature ? dot.get(companyNature, `data.${firmNature}`, '--') : '--'}
    </Form.Item>,
    <Form.Item
      label="公司性质"
    >
      {firmType ? BusinessCompanyType.description(firmType) : '--'}
    </Form.Item>,
    <Form.Item
      label="注册地址"
    >
      {dot.get(companyDetail, 'registered_addr', '--')}
    </Form.Item>,
    <Form.Item
      label="企业代表人"
    >
      {dot.get(companyDetail, 'legal_name', '--')}
    </Form.Item>,
    <Form.Item
      label="注册资本（万）"
    >
      {registeredCapital >= 0 ? Unit.exchangePriceToWanYuan(registeredCapital) : '--'}
    </Form.Item>,
    <Form.Item
      label="实收资本（万）"
    >
      {paidCapital >= 0 ? Unit.exchangePriceToWanYuan(paidCapital) : '--'}
    </Form.Item>,
    <Form.Item
      label="成立日期"
    >
      {registeredDate ? moment(String(registeredDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      label="股东"
    >
      {dot.get(companyDetail, 'share_holder_info', undefined) ? dot.get(companyDetail, 'share_holder_info') : '--'}
    </Form.Item>,
  ];

  const itemsOne = [
    <Form.Item
      label="经营范围"
      {...formLayoutC1}
    >
      <div className="noteWrap">
        {businessScope || '--'}
      </div>
    </Form.Item>,
    <Form.Item
      label="备注"
      {...formLayoutC1}
    >
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{_note || '--'}</div>
    </Form.Item>,
    <Form.Item
      label="附件"
      {...formLayoutC1}
    >
      <PageUpload
        domain={PageUpload.UploadDomains.OAUploadDomain}
        displayMode
        value={PageUpload.getInitialValue(companyDetail, 'asset_infos')}
      />
    </Form.Item>,
  ];

  const itemOrder = [
    <Form.Item
      label="来源"
    >
      {
        dot.get(companyDetail, 'source_type', '')
        ? SharedSourceType.description(dot.get(companyDetail, 'source_type'))
        : '--'
      }
    </Form.Item>,
    <Form.Item
      label={
        dot.get(companyDetail, 'source_type', '') === SharedSourceType.approval
        ? '提报人'
        : '创建人'
      }
    >
      {
        dot.get(companyDetail, 'source_type', '') === SharedSourceType.approval
        ? dot.get(companyDetail, 'report_info.name', '--')
        : dot.get(companyDetail, 'creator_info.name', '--')
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
      {state ? SharedCompanyState.description(state) : '--'}
    </Form.Item>,
  ];
  if (`${state}` !== `${SharedCompanyState.normal}`) {
    itemOrder.push(
      <Form.Item
        label="注销提报人"
      >
        {dot.get(companyDetail, 'canceler_info.name', '--')}
      </Form.Item>,
      <Form.Item
        label="注销时间"
      >
        {cancelerDate ? moment(String(cancelerDate)).format('YYYY-MM-DD') : '--'}
      </Form.Item>,
    );
  }

  const itemAuthority = [
    <Form.Item
      label="可见成员"
      {...formLayoutC1}
    >
      {
        dot.get(companyDetail, 'look_acl', undefined) === SharedAuthorityState.all
        ? '全部'
        : renderName(dot.get(companyDetail, 'look_account_info_list', []), dot.get(companyDetail, 'look_department_info_list', []))
      }
    </Form.Item>,
  ];

  return (
    <Form {...FormLayoutC3} form={form}>
      <CoreContent>
        <CoreForm items={items} />
        <CoreForm items={itemsOne} cols={1} />
        <CoreForm items={itemOrder} />
        {
          Operate.canOperateSharedCompanyAuthority() ?
            (<CoreForm items={itemAuthority} cols={1} />) : ''
        }
      </CoreContent>
    </Form>
  );
};

const mapDispatchToProps = dispatch => ({
  // 获取公司详情
  getCompanyDetail: payload => dispatch({
    type: 'sharedCompany/getSharedCompanyDetail',
    payload,
  }),
  // 重置公司详情
  resetCompanyDetail: () => dispatch({
    type: 'sharedCompany/resetSharedCompanyDetail',
    payload: {},
  }),
  // 获取公司类型
  getSharedCompanyNature: () => dispatch({
    type: 'sharedCompany/getSharedCompanyNature',
    payload: {},
  }),
});

const mapStateToProps = ({
  sharedCompany: {
    companyDetail, // 公司详情
    companyNature, // 公司类型
  },
}) => ({ companyDetail, companyNature });

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDetail);
