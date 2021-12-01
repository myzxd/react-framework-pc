/**
 * 其他 - 事务签呈 - 详情
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Form } from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageUpload } from '../../../components/index';

const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 10 } };

function PageAbnormalDetail({ dispatch, query = {}, signDetail, oaDetail }) {
  const [form] = Form.useForm();

  useEffect(() => {
    // 判断是否是兴达插件
    if (oaDetail._id) {
      dispatch({
        type: 'oaOther/fetchSignDetail',
        payload: {
          isPluginOrder: true,
          oaDetail,
        },
      });
    } else {
      dispatch({
        type: 'oaOther/fetchSignDetail',
        payload: {
          id: query.id,
        },
      });
    }

    return () => {
      dispatch({
        type: 'oaOther/reduceSignDetail',
        payload: {},
      });
    };
  }, [dispatch, query.id, oaDetail]);

  // 签呈内容
  const renderContent = () => {
    const formItems = [
      <Form.Item
        label="文件编号"
        name="documentNumber"
      >
        {dot.get(signDetail, 'document_number', '--')}
      </Form.Item>,
      <Form.Item
        label="主题"
        name="theme"
      >
        {dot.get(signDetail, 'theme', '--')}
      </Form.Item>,
      <Form.Item
        label="说明"
        name="note"
      >
        <span className="noteWrap">{dot.get(signDetail, 'note', '--')}</span>
      </Form.Item>,
    ];
    return (
      <CoreContent title="签呈内容">
        <CoreForm items={formItems} cols={1} />
      </CoreContent>
    );
  };

    // 附件
  const renderPageUpload = () => {
    const formItems = [
      <Form.Item
        label="附件"
      >
        <PageUpload
          domain={PageUpload.UploadDomains.OAUploadDomain}
          displayMode
          value={PageUpload.getInitialValue(signDetail, 'asset_infos')}
        />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

  return (
    <Form {...formLayout} form={form}>
      {/* 签呈内容 */}
      {renderContent()}

      {/* 附件 */}
      {renderPageUpload()}
    </Form>
  );
}

function mapStateToProps({ oaOther: { signDetail } }) {
  return { signDetail };
}
export default connect(mapStateToProps)(PageAbnormalDetail);
