/**
 * 行政类 - 用章申请 - 详情 /Oa/Document/Pages/Administration/useSeal/Detail
 */
import moment from 'moment';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, {
  useEffect,
} from 'react';
import {
  Form,
} from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';

import { PageUpload } from '../../../components/index';

const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };
const formLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } };

const UseSealDetail = ({
  query,
  dispatch,
  useSealDetail = {},
  oaDetail = {},
}) => {
  useEffect(() => {
    if (oaDetail._id) {
      dispatch({ type: 'administration/fetchUseSealDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'administration/fetchUseSealDetail', payload: { id: query.id } });
    }
    return () => {
      dispatch({ type: 'administration/resetUseSealDetail' });
    };
  }, [dispatch, query]);

  // 渲染用章信息
  const renderSeal = () => {
    const formItems = [
      <Form.Item
        label="公司名称"
        {...formLayout}
      >
        {dot.get(useSealDetail, 'firm_info.name') || '--'}
      </Form.Item>,
      <Form.Item
        label="印章名称"
        {...formLayout}
      >
        {dot.get(useSealDetail, 'seal_info.name') || '--'}
      </Form.Item>,
      <Form.Item
        label="印章保管人"
        {...formLayout}
      >
        {dot.get(useSealDetail, 'keep_account_info.employee_info.name') || '--'}
      </Form.Item>,
    ];

    const formItems2 = [
      <Form.Item
        label="用印章文件名"
        {...formLayoutC3}
      >
        <div className="noteWrap">
          {dot.get(useSealDetail, 'file_name') || '--'}
        </div>
      </Form.Item>,
      <Form.Item
        label="用印份数"
        {...formLayoutC3}
      >
        {dot.get(useSealDetail, 'form_num')}式
        {dot.get(useSealDetail, 'use_num')}份
      </Form.Item>,
      <Form.Item
        label="用印时间"
        {...formLayoutC3}
      >
        {useSealDetail.apply_date ? moment(useSealDetail.apply_date.toString()).format('YYYY-MM-DD') : '--'}
      </Form.Item>,
    ];
    const formItems3 = [
      <Form.Item
        label="申请事由"
        {...formLayoutC1}
      >
        <span className="noteWrap">{dot.get(useSealDetail, 'note') || '--'}</span>
      </Form.Item>,
      <Form.Item label="上传附件" {...formLayoutC1}>
        <PageUpload
          domain={PageUpload.UploadDomains.OAUploadDomain}
          displayMode
          value={PageUpload.getInitialValue(useSealDetail, 'asset_infos')}
        />
      </Form.Item>,
    ];

    return (
      <CoreContent title="用章信息">
        <CoreForm items={formItems} cols={1} />
        <CoreForm items={formItems2} />
        <CoreForm items={formItems3} cols={1} />
      </CoreContent>
    );
  };
  return (
    <Form>
      {renderSeal()}
    </Form>
  );
};

function mapPropsToState({ administration: { useSealDetail } }) {
  return { useSealDetail };
}

export default connect(mapPropsToState)(UseSealDetail);
