/**
 * 行政类 - 印章作废申请 - 详情 /Oa/Document/Pages/Administration/InvalidSeal/Detail
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, {
  useEffect,
} from 'react';
import { Form } from 'antd';

import { PageUpload } from '../../../components/index';
import { CoreContent, CoreForm } from '../../../../../../components/core';

const DetailInvalidSeal = (props) => {
  const {
    query,
    dispatch,
    oaDetail = {},
  } = props;
  useEffect(() => {
    if (oaDetail._id) {
      dispatch({ type: 'administration/fetchInvalidSealDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'administration/fetchInvalidSealDetail', payload: { id: query.id } });
    }
    return () => { dispatch({ type: 'administration/resetInvalidSealDetail' }); };
  }, [query, dispatch, oaDetail]);

  const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };
  const formLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } };

  const { invalidSealDetail } = props;

  // 渲染印章信息
  const renderSeal = () => {
    const sealInfo = dot.get(invalidSealDetail, 'seal_info', {});
    const formItems = [
      <Form.Item
        label="公司名称"
        {...formLayout}
      >
        {dot.get(invalidSealDetail, 'firm_info.name') || '--'}
      </Form.Item>,
      <Form.Item
        label="印章名称"
        {...formLayout}
      >
        {dot.get(sealInfo, 'name') || '--'}
      </Form.Item>,
      <Form.Item
        label="印章管理员"
        {...formLayout}
      >
        {dot.get(sealInfo, 'keep_account_info.employee_info.name') || '--'}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="废止理由"
        {...formLayoutC1}
      >
        <span className="noteWrap">{dot.get(invalidSealDetail, 'note') || '--'}</span>
      </Form.Item>,
      <Form.Item
        label="上传附件"
        {...formLayoutC1}
      >
        <PageUpload
          domain={PageUpload.UploadDomains.OAUploadDomain}
          displayMode
          value={PageUpload.getInitialValue(invalidSealDetail, 'asset_infos')}
        />
      </Form.Item>,
    ];
    return (
      <CoreContent title="印章信息">
        <CoreForm items={formItems} cols={1} />
        <CoreForm items={formItems2} cols={1} />
      </CoreContent>
    );
  };

  return (
    <Form>
      {renderSeal()}
    </Form>
  );
};
function mapPropsToState({ administration: { invalidSealDetail } }) {
  return { invalidSealDetail };
}
export default connect(mapPropsToState)(DetailInvalidSeal);
