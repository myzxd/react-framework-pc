/**
 * 人事类 - 增编申请 - 详情
 */
import React, { useEffect } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { Form } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageUpload } from '../../../components/index';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const textAreaLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 12,
  },
};

const AuthorizedStrengthDetail = ({
  query,
  authorizedStrengthDetail,
  dispatch,
  oaDetail = {},
}) => {
  useEffect(() => {
    if (oaDetail._id) {
      // 获取增编申请详情
      dispatch({
        type: 'humanResource/getAuthorizedStrengthDetail',
        payload: { isPluginOrder: true, oaDetail },
      });
    } else {
      // 获取增编申请详情
      dispatch({
        type: 'humanResource/getAuthorizedStrengthDetail',
        payload: { id: query.id },
      });
    }
  }, []);

  const {
    department_info, // 部门信息
    organization_num: organizationNum = '',   // 部门编制数
    organization_count: organizationCount = '', // 部门占编数
    job_info,    // 岗位信息
    work_address: initialAddress = '',              // 工作地点
    people_num: initialNumber = '',                 // 人数
    expect_entry_date: initialDate = null,          // 到职日期
    note: initialNote = '', // 增编原因
  } = authorizedStrengthDetail;

  const renderAuthorizedDetail = () => {
    const formItems = [
      <Form.Item
        {...layout}
        key="department"
        label="招聘部门"
      >
        {dot.get(department_info, 'name', '--')}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="authorizedDetailNum"
        label="部门编制数"
      >
        {organizationNum || '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="authorizedDetailNow"
        label="部门占编数"
      >
        {organizationCount || '--'}
      </Form.Item>,
    ];
    const formItemPost = [
      <Form.Item
        {...layout}
        key="podepartmentJobRelationId"
        label="岗位名称"
      >
        {dot.get(job_info, 'name', '--')}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="address"
        label="工作地"
      >
        {initialAddress || '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="number"
        label="人数"
      >
        {initialNumber || '--'}
      </Form.Item>,
      <Form.Item
        {...layout}
        key="endDate"
        label="期望到职日期"
      >
        {initialDate ? moment(`${initialDate}`).format('YYYYMMDD') : '--'}
      </Form.Item>,
    ];
    const formItemReason = [
      <Form.Item
        key="note"
        label="增编原因"
        {...textAreaLayout}
      >
        <span className="noteWrap">{initialNote || '--'}</span>
      </Form.Item>,
    ];
    const formItemFiled = [
      <Form.Item
        {...textAreaLayout}
        key="uploadFiled"
        label="上传附件"
      >
        <PageUpload
          displayMode
          value={PageUpload.getInitialValue(authorizedStrengthDetail, 'asset_infos')}
        />
      </Form.Item>,
    ];
    return (
      <React.Fragment>
        <CoreForm items={formItems} cols={4} />
        <CoreForm items={formItemPost} cols={4} />
        <CoreForm items={formItemReason} cols={1} />
        <CoreForm items={formItemFiled} cols={1} />
      </React.Fragment>
    );
  };

  return (
    <Form>
      <CoreContent title="增编明细">
        {/* 渲染编制概况 */}
        {renderAuthorizedDetail()}
      </CoreContent>
    </Form>
  );
};

AuthorizedStrengthDetail.propTypes = {
  query: PropTypes.object,                    // 路由参数
  authorizedStrengthDetail: PropTypes.object, // 增编申请单详情数据
};
AuthorizedStrengthDetail.defaultProps = {
  authorizedStrengthDetail: {},
};

function mapStateToProps({ humanResource: { authorizedStrengthDetail } }) {
  return { authorizedStrengthDetail };
}

export default connect(mapStateToProps)(AuthorizedStrengthDetail);
