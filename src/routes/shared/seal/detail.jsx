/**
 * 共享登记 - 印章详情
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, { useEffect } from 'react';
import {
  Form,
} from 'antd';
import { connect } from 'dva';

import {
  SharedSealState,
  SharedSealBorrowState,
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

const SealDetail = ({
  sealDetail = {},
  location = {},
  getSealDetail,
  resetSealDetail,
  getEnumer,
  resetEnumer,
  enumeratedValue = {},
}) => {
  const [form] = Form.useForm();
  const { query = {} } = location;

  // 请求枚举列表接口
  useEffect(() => {
    getEnumer();
    return () => {
      resetEnumer();
    };
  }, []);

  useEffect(() => {
    query.id && getSealDetail({ id: query.id });
    return () => resetSealDetail();
  }, [getSealDetail, resetSealDetail, query.id]);

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
    name = undefined,
    seal_type: sealType = undefined,
    note = undefined,
    state = undefined,
    borrow_state: borrowState = undefined,
    created_at: createdAt = undefined,
    canceler_date: cancelerDate = undefined,
    expected_return_date: expectedReturnDate = undefined,
  } = sealDetail;


  // 渲染 印章类型
  const renderSealType = () => {
    const sealTypes = enumeratedValue.seal_types || [];
    let sealValue = '--';
    if (sealTypes.length > 0) {
      sealTypes.forEach((item) => {
        if (item.value === sealType) {
          sealValue = item.name;
        }
      });
    }
    return sealValue;
  };
  const items = [
    <Form.Item
      label="印章名称"
    >
      {name || '--'}
    </Form.Item>,
    <Form.Item
      label="公司名称"
    >
      {dot.get(sealDetail, 'firm_info.name', undefined) ? dot.get(sealDetail, 'firm_info.name') : '--'}
    </Form.Item>,
    <Form.Item
      label="印章类型"
    >
      {renderSealType()}
    </Form.Item>,
    <Form.Item
      label="印章保管人"
    >
      {dot.get(sealDetail, 'keep_account_info.employee_info.name', undefined) ? dot.get(sealDetail, 'keep_account_info.employee_info.name') : '--'}
    </Form.Item>,
  ];

  const itemsOne = [
    <Form.Item
      label="备注"
      {...formLayoutC1}
    >
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{note || '--'}</div>
    </Form.Item>,

  ];

  const itemOrder = [
    <Form.Item
      label="来源"
    >
      {
        dot.get(sealDetail, 'source_type', '')
        ? SharedSourceType.description(dot.get(sealDetail, 'source_type'))
        : '--'
      }
    </Form.Item>,
    <Form.Item
      label={
        dot.get(sealDetail, 'source_type', '') === SharedSourceType.approval
        ? '提报人'
        : '创建人'
      }
    >
      {
        dot.get(sealDetail, 'source_type', '') === SharedSourceType.approval
        ? dot.get(sealDetail, 'report_info.name', '--')
        : dot.get(sealDetail, 'creator_info.name', '--')
      }
    </Form.Item>,
    <Form.Item
      label="创建时间"
    >
      {createdAt ? moment(createdAt).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
    <Form.Item
      label="印章状态"
    >
      {state ? SharedSealState.description(state) : '--'}
    </Form.Item>,
    <Form.Item
      label="借用状态"
    >
      {borrowState ? SharedSealBorrowState.description(borrowState) : '--'}
    </Form.Item>,
    <Form.Item
      label="借用人"
    >
      {dot.get(sealDetail, 'borrower_info.name', '--')}
    </Form.Item>,
    <Form.Item
      label="预计归还时间"
    >
      {expectedReturnDate ? moment(String(expectedReturnDate)).format('YYYY-MM-DD') : '--'}
    </Form.Item>,
  ];

  if (`${state}` !== `${SharedSealState.normal}`) {
    itemOrder.splice(4, 0,
      <Form.Item
        label="作废提报人"
      >
        {dot.get(sealDetail, 'canceler_info.name', '--')}
      </Form.Item>,
      <Form.Item
        label="注销时间"
      >
        {cancelerDate ? moment(String(cancelerDate)).format('YYYY-MM-DD') : '--'}
      </Form.Item>,
    );
  }

  const itemFile = [
    <Form.Item
      label="附件"
      {...formLayoutC1}
    >
      <PageUpload
        domain={PageUpload.UploadDomains.OAUploadDomain}
        displayMode
        value={PageUpload.getInitialValue(sealDetail, 'asset_infos')}
      />
    </Form.Item>,
  ];

  const itemAuthority = [
    <Form.Item
      label="可见成员"
      {...formLayoutC1}
    >
      {
        dot.get(sealDetail, 'look_acl', undefined) === SharedAuthorityState.all
        ? '全部'
        : renderName(dot.get(sealDetail, 'look_account_info_list', []), dot.get(sealDetail, 'look_department_info_list', []))
      }
    </Form.Item>,
  ];

  return (
    <Form {...FormLayoutC3} form={form}>
      <CoreContent>
        <CoreForm items={items} />
        <CoreForm items={itemsOne} cols={1} />
        <CoreForm items={itemOrder} />
        <CoreForm items={itemFile} cols={1} />
        {
          Operate.canOperateSharedSealAuthority() ?
            (<CoreForm items={itemAuthority} cols={1} />) : ''
        }
      </CoreContent>
    </Form>
  );
};

const mapDispatchToProps = dispatch => ({
  getSealDetail: payload => dispatch({
    type: 'sharedSeal/getSharedSealDetail',
    payload,
  }),
  resetSealDetail: () => dispatch({
    type: 'sharedSeal/resetSharedSealDetail',
    payload: {},
  }),
  getEnumer: () => dispatch({
    type: 'codeRecord/getEnumeratedValue',
    payload: {},
  }),
  resetEnumer: () => dispatch({
    type: 'codeRecord/resetEnumerateValue',
    payload: {},
  }),
});

const mapStateToProps = ({ codeRecord: { enumeratedValue }, sharedSeal: { sealDetail } }) => ({ enumeratedValue, sealDetail });

export default connect(mapStateToProps, mapDispatchToProps)(SealDetail);
