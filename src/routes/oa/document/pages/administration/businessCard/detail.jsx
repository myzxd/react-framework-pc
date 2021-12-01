/**
 * 行政类 - 名片申请 - 详情 /Oa/Document/Pages/Administration/Business/Create
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

import { PageUpload } from '../../../components/index';
import { CoreContent, CoreForm } from '../../../../../../components/core';

const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const DetailBusinessCard = (props) => {
  const {
    dispatch,
    businessCardDetail,
    query,
    oaDetail = {},
  } = props;
  useEffect(() => {
    if (oaDetail._id) {
      dispatch({
        type: 'administration/fetchBusinessCardDetail',
        payload: {
          isPluginOrder: true,
          oaDetail,
        } });
    } else {
      dispatch({
        type: 'administration/fetchBusinessCardDetail',
        payload: {
          id: query.id,
        } });
    }
    return () => { dispatch({ type: 'administration/resetBusinessCardDetail' }); };
  }, [dispatch, query, oaDetail]);

    // 渲染申请信息
  const renderApplyInfo = () => {
    const formItems = [
      <Form.Item
        label="实际申请人"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'order_employee_info.name') || '--'}
      </Form.Item>,
      <Form.Item
        label="部门"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'department_info.name') || '--'}
      </Form.Item>,
      <Form.Item
        label="岗位"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'job_info.name') || '--'}
      </Form.Item>,
      <Form.Item
        label="名片职务职称"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'official') || '--'}
      </Form.Item>,
      <Form.Item
        label="名片姓名"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'name') || '--'}
      </Form.Item>,
      <Form.Item
        label="英文名"
        name="nameEn"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'en_name') || '--'}
      </Form.Item>,
      <Form.Item
        label="手机"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'phone') || '--'}
      </Form.Item>,
      <Form.Item
        label="电子邮箱"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'email') || '--'}
      </Form.Item>,
      <Form.Item
        label="QQ"
        name="qq"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'qq') || '--'}
      </Form.Item>,
      <Form.Item
        label="公司网址"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'company_url') || '--'}
      </Form.Item>,
      <Form.Item
        label="办公地址"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'address') || '--'}
      </Form.Item>,
      <Form.Item
        label="申请数量(盒)"
        {...formLayoutC3}
      >
        {dot.get(businessCardDetail, 'apply_num') || '--'}
      </Form.Item>,
      <Form.Item
        label="需求时间"
        {...formLayoutC3}
      >
        {businessCardDetail.demand_date ? moment(businessCardDetail.demand_date.toString()).format('YYYY-MM-DD') : '--'}
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="附件"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 14 }}
          >
            <PageUpload
              domain={PageUpload.UploadDomains.OAUploadDomain}
              displayMode
              value={PageUpload.getInitialValue(businessCardDetail, 'asset_infos')}
            />
          </Form.Item>),
      },
    ];
    return (
      <CoreContent title="申请信息">
        <CoreForm items={formItems} />
      </CoreContent>
    );
  };

  return (
    <Form>
      {/* 表单信息 */}
      {renderApplyInfo()}
    </Form>
  );
};
function mapPropsToState({ administration: { businessCardDetail } }) {
  return { businessCardDetail };
}
export default connect(mapPropsToState)(DetailBusinessCard);
