/**
 * 人事类 - 入职申请 - 详情
 */
import React, { useEffect } from 'react';
import dot from 'dot-prop';
import { Form } from 'antd';
import { connect } from 'dva';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageUpload } from '../../../components/index';
import { Gender } from '../../../../../../application/define';

const FormLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

function InductionDetail({
  dispatch,
  query = {},
  inductionDetail,
  oaDetail,
}) {
  const [form] = Form.useForm();
  useEffect(() => {
    // 判断是否是兴达插件
    if (oaDetail._id) {
      dispatch({
        type: 'humanResource/fetchInductionDetail',
        payload: {
          isPluginOrder: true,
          oaDetail,
        },
      });
    } else {
      dispatch({
        type: 'humanResource/fetchInductionDetail',
        payload: {
          id: query.id,
        },
      });
    }

    return () => {
      dispatch({
        type: 'humanResource/reduceInductionDetail',
        payload: {},
      });
    };
  }, [dispatch, query.id, oaDetail]);

  // 人员信息
  const renderPersonnelInformation = () => {
    const formItems = [
      <Form.Item
        label="姓名"
        rules={[{ required: true, message: '请输入姓名' }]}
      >
        {dot.get(inductionDetail, 'name', '--')}
      </Form.Item>,
      <Form.Item
        label="性别"
      >
        {Gender.description(dot.get(inductionDetail, 'gender', '--'))}
      </Form.Item>,
      <Form.Item
        label="入职部门"
      >
        {dot.get(inductionDetail, 'employment_apply_department_info.name', '--')}
      </Form.Item>,
      <Form.Item
        label="入职岗位"
      >
        {dot.get(inductionDetail, 'employment_apply_job_info.name', '--')}
      </Form.Item>,
      <Form.Item
        label="入职类型"
      >
        <span>
          {/* 入职方式 */}
          {dot.get(inductionDetail, 'apply_type_title', '--')}
        </span>
        <span style={{ marginLeft: 10 }}>
          {/* 其他方式 */}
          {dot.get(inductionDetail, 'other_type', null)}
        </span>
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="备注"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            <span className="noteWrap">{dot.get(inductionDetail, 'note', '--')}</span>
          </Form.Item>
        ),
      },
    ];

    return (
      <CoreContent title="人员信息">
        <CoreForm items={formItems} cols={2} />
      </CoreContent>
    );
  };

  // 附件
  const renderPageUpload = () => {
    const formItems = [
      <Form.Item
        label="附件"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <PageUpload
          domain={PageUpload.UploadDomains.OAUploadDomain}
          displayMode
          value={PageUpload.getInitialValue(inductionDetail, 'asset_infos')}
        />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

  return (
    <Form {...FormLayout} form={form}>
      {/* 人员信息 */}
      {renderPersonnelInformation()}

      {/* 附件 */}
      {renderPageUpload()}
    </Form>
  );
}

const mapStateToProps = ({ humanResource: { inductionDetail } }) => {
  return {
    inductionDetail,
  };
};

export default connect(mapStateToProps)(InductionDetail);
