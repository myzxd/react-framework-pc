/**
 * 行政类 - 刻章申请 - 详情 /Oa/Document/Pages/Administration/CarveSeal/Detail
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Form } from 'antd';

import { PageUpload } from '../../../components/index';
import { CoreContent, CoreForm } from '../../../../../../components/core';

const DetailCarveSeal = ({
  carveSealDetail = {},
  dispatch,
  query,
  oaDetail = {},
  enumeratedValue = {},
}) => {
  const formLayoutC2 = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
  const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };
  const formLayout = { labelCol: { span: 2 }, wrapperCol: { span: 12 } };

  // 请求枚举列表接口
  useEffect(() => {
    dispatch({
      type: 'codeRecord/getEnumeratedValue',
      payload: {},
    });

    return () => {
      dispatch({
        type: 'codeRecord/resetEnumerateValue',
        payload: {},
      });
    };
  }, [dispatch]);


  useEffect(() => {
    // 获取详情信息
    if (oaDetail._id) {
      dispatch({ type: 'administration/fetchCarveSealDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'administration/fetchCarveSealDetail', payload: { id: query.id } });
    }
    // 页面退出时，重制详情信息
    return () => { dispatch({ type: 'administration/resetCarveSealDetail' }); };
  }, [dispatch, query, oaDetail]);


  // 渲染 印章类型
  const renderSealType = () => {
    const { seal_type: sealType = undefined } = carveSealDetail;
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

  // 渲染印章刻制信息
  const renderSeal = () => {
    const formItems = [
      <Form.Item label="印章类型" {...formLayoutC2}>
        {renderSealType()}
      </Form.Item>,
      <Form.Item label="公司名称" {...formLayoutC2}>
        {dot.get(carveSealDetail, 'firm_info.name') || '--'}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item label="印章全称" {...formLayout}>
        {dot.get(carveSealDetail, 'name') || '--'}
      </Form.Item>,
    ];
    const formItems3 = [
      <Form.Item label="印章字体" {...formLayoutC2}>
        {dot.get(carveSealDetail, 'typeface') || '--'}
      </Form.Item>,
      <Form.Item label="印章保管人" {...formLayoutC2}>
        {dot.get(carveSealDetail, 'keep_account_info.employee_info.name') || '--'}
      </Form.Item>,
    ];

    const formItems4 = [
      <Form.Item label="申请事由" {...formLayoutC1}>
        <span className="noteWrap">{dot.get(carveSealDetail, 'note') || '--'}</span>
      </Form.Item>,
      <Form.Item label="上传附件" {...formLayoutC1}>
        <PageUpload
          domain={PageUpload.UploadDomains.OAUploadDomain}
          displayMode
          value={PageUpload.getInitialValue(carveSealDetail, 'asset_infos')}
        />
      </Form.Item>,
    ];
    return (
      <CoreContent title="印章刻制信息">
        <CoreForm items={formItems} cols={2} />
        <CoreForm items={formItems2} cols={1} />
        <CoreForm items={formItems3} cols={2} />
        <CoreForm items={formItems4} cols={1} />
      </CoreContent>
    );
  };
  return (
    <Form >
      {renderSeal()}
    </Form>
  );
};
function mapPropsToState({
  codeRecord: { enumeratedValue },
  administration: { carveSealDetail } }) {
  return { enumeratedValue, carveSealDetail };
}
export default connect(mapPropsToState)(DetailCarveSeal);
