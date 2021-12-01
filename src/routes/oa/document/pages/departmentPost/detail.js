/**
 * 组织管理 - 详情
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { Form, Table } from 'antd';

import { ExpenseDepartmentSubtype } from '../../../../../application/define';
import { CoreContent, CoreForm } from '../../../../../components/core';
import { PageUpload } from '../../components/index';
import { PagesHelper } from '../../define';


const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

function PageDepartmentPostDetail(props) {
  const { dispatch, query = {}, oaDetail = {}, departmentPostDetail, examineOrderDetail } = props;
  const [form] = Form.useForm();
  let note = '--';
  // 判断是否是外部审批单
  if (oaDetail._id) {
    note = dot.get(departmentPostDetail, 'filter_note', '--');
  } else {
    note = dot.get(departmentPostDetail, 'note', '--');
  }
  useEffect(() => {
    if (oaDetail._id) {
      dispatch({ type: 'codeDocument/fetchDepartmentPostDetail', payload: { isPluginOrder: true, oaDetail } });
    } else {
      dispatch({ type: 'codeDocument/fetchDepartmentPostDetail', payload: { id: query.id } });
    }
    return () => {
      dispatch({
        type: 'codeDocument/reduceDepartmentPostDetail', payload: {},
      });
    };
  }, [dispatch, oaDetail, query.id]);

  // 新增部门
  const renderNewAdd = () => {
    const formItems = [
      <Form.Item label="调整类型">
        {PagesHelper.titleByKey(dot.get(examineOrderDetail, 'applicationOrderType'))}
      </Form.Item>,
      <Form.Item label="调整子类型">
        {ExpenseDepartmentSubtype.description(dot.get(departmentPostDetail, 'organization_sub_type'))}
      </Form.Item>,
      <div />,
      <Form.Item label="部门名称">
        {dot.get(departmentPostDetail, 'department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="所属上级部门">
        {dot.get(departmentPostDetail, 'target_parent_department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="部门编号">
        {dot.get(departmentPostDetail, 'department_info.code', '--')}
      </Form.Item>,
    ];
    const formItemFooter = [
      // <Form.Item
      //   label="部门主要职能"
      //   labelCol={{ span: 2 }}
      //   wrapperCol={{ span: 22 }}
      // >
      //   {dot.get(departmentPostDetail, '部门主要职能', '--')}
      // </Form.Item>,
      <Form.Item
        label="新增原因"
      >
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {note}
        </div>
      </Form.Item>,
      <Form.Item
        label="附件"
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} displayMode value={PageUpload.getInitialValue(departmentPostDetail, 'asset_infos')} />
      </Form.Item>,
    ];
    const columns = [
      {
        title: '岗位名称',
        dataIndex: ['job_info', 'name'],
        render: text => (text || '--'),
      },
      {
        title: '所属部门',
        dataIndex: '所属部门',
        render: () => (dot.get(departmentPostDetail, 'department_info.name', '--')),
      },
      {
        title: '岗位编制数',
        dataIndex: 'organization_count',
        render: text => (text || text === 0 ? text : '--'),
      },
      {
        title: '岗位职级',
        dataIndex: ['job_info', 'rank'],
        render: text => (text || '--'),
      },
    ];
    return (
      <CoreContent >
        <CoreForm className="affairs-flow-basic" items={formItems} cols={3} layout={layout} />
        <div style={{ textAlign: 'center', margin: '10px 0' }}>部门下添加岗位</div>
        <Table
          rowKey={record => record._id}
          dataSource={dot.get(departmentPostDetail, 'job_data_list', [])}
          columns={columns}
          bordered
          scroll={{ y: 400 }}
        />
        <CoreForm className="affairs-flow-basic" items={formItemFooter} cols={1} layout={layout} />
      </CoreContent>
    );
  };

  // 调整上级部门
  const renderAdjustment = () => {
    const formItems = [
      <Form.Item label="调整类型">
        {PagesHelper.titleByKey(dot.get(examineOrderDetail, 'applicationOrderType'))}
      </Form.Item>,
      <Form.Item label="调整子类型">
        {ExpenseDepartmentSubtype.description(dot.get(departmentPostDetail, 'organization_sub_type'))}
      </Form.Item>,
      <div />,
      <div />,
      <Form.Item label="调整部门名称">
        {dot.get(departmentPostDetail, 'department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="所属上级部门">
        {dot.get(departmentPostDetail, 'target_parent_department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="部门编号">
        {dot.get(departmentPostDetail, 'department_code', '--')}
      </Form.Item>,
      <Form.Item label="上级部门编号">
        {dot.get(departmentPostDetail, 'target_parent_department_info.code', '--')}
      </Form.Item>,
      <Form.Item label="调整后上级部门名称">
        {dot.get(departmentPostDetail, 'update_parent_department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="调整后上级部门编号">
        {dot.get(departmentPostDetail, 'update_parent_department_info.code', '--')}
      </Form.Item>,
    ];
    const formItemFooter = [
      <Form.Item
        label="原因"
      >
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {note}
        </div>
      </Form.Item>,
      <Form.Item
        label="附件"
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} displayMode value={PageUpload.getInitialValue(departmentPostDetail, 'asset_infos')} />
      </Form.Item>,
    ];
    return (
      <CoreContent >
        <CoreForm className="affairs-flow-basic" items={formItems} cols={4} layout={layout} />
        <CoreForm className="affairs-flow-basic" items={formItemFooter} cols={1} layout={layout} />
      </CoreContent>
    );
  };

  // 裁撤部门
  const renderAbolition = () => {
    const formItems = [
      <Form.Item label="调整类型">
        {PagesHelper.titleByKey(dot.get(examineOrderDetail, 'applicationOrderType'))}
      </Form.Item>,
      <Form.Item label="调整子类型">
        {ExpenseDepartmentSubtype.description(dot.get(departmentPostDetail, 'organization_sub_type'))}
      </Form.Item>,
      <div />,
      <Form.Item label="裁撤部门名称">
        {dot.get(departmentPostDetail, 'department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="部门编号">
        {dot.get(departmentPostDetail, 'department_info.code', '--')}
      </Form.Item>,
      <Form.Item label="所属上级部门">
        {dot.get(departmentPostDetail, 'target_parent_department_info.name', '--')}
      </Form.Item>,
    ];
    const formItemFooter = [
      <Form.Item
        label="原因"
      >
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {note}
        </div>
      </Form.Item>,
      <Form.Item
        label="附件"
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} displayMode value={PageUpload.getInitialValue(departmentPostDetail, 'asset_infos')} />
      </Form.Item>,
    ];
    return (
      <CoreContent >
        <CoreForm className="affairs-flow-basic" items={formItems} cols={3} layout={layout} />
        <CoreForm className="affairs-flow-basic" items={formItemFooter} cols={1} layout={layout} />
      </CoreContent>
    );
  };

  // 增编
  const renderAddendum = () => {
    // 岗位信息
    const jobList = dot.get(departmentPostDetail, 'job_data_list', []);
    const jobItem = jobList[0] || {};
    const formItems = [
      <Form.Item label="调整类型">
        {PagesHelper.titleByKey(dot.get(examineOrderDetail, 'applicationOrderType'))}
      </Form.Item>,
      <Form.Item label="调整子类型">
        {ExpenseDepartmentSubtype.description(dot.get(departmentPostDetail, 'organization_sub_type'))}
      </Form.Item>,
      <div />,
      <div />,
      <Form.Item label="增编部门名称">
        {dot.get(departmentPostDetail, 'department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="部门编号">
        {dot.get(departmentPostDetail, 'department_info.code', '--')}
      </Form.Item>,
      <Form.Item label="部门编制数">
        {dot.get(departmentPostDetail, 'department_info.organization_num', '--')}
      </Form.Item>,
      <Form.Item label="部门占编数">
        {dot.get(departmentPostDetail, 'department_info.organization_count', '--')}
      </Form.Item>,
      <Form.Item label="岗位名称">
        {dot.get(jobItem, 'job_info.name', '--')}
      </Form.Item>,
      <Form.Item label="增编数">
        {dot.get(jobItem, 'people_num', '--')}
      </Form.Item>,
      <Form.Item label="现岗位编制数">
        {dot.get(jobItem, 'organization_count', '--')}
      </Form.Item>,
      <Form.Item label="岗位占编数">
        {dot.get(jobItem, 'organization_num', '--')}
      </Form.Item>,
    ];
    const formItemFooter = [
      <Form.Item
        label="原因"
      >
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {note}
        </div>
      </Form.Item>,
      <Form.Item
        label="附件"
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} displayMode value={PageUpload.getInitialValue(departmentPostDetail, 'asset_infos')} />
      </Form.Item>,
    ];
    return (
      <CoreContent >
        <CoreForm className="affairs-flow-basic" items={formItems} cols={4} layout={layout} />
        <CoreForm className="affairs-flow-basic" items={formItemFooter} cols={1} layout={layout} />
      </CoreContent>
    );
  };

  // 减编
  const renderReduceStaff = () => {
    // 岗位信息
    const jobList = dot.get(departmentPostDetail, 'job_data_list', []);
    const jobItem = jobList[0] || {};
    const formItems = [
      <Form.Item label="调整类型">
        {PagesHelper.titleByKey(dot.get(examineOrderDetail, 'applicationOrderType'))}
      </Form.Item>,
      <Form.Item label="调整子类型">
        {ExpenseDepartmentSubtype.description(dot.get(departmentPostDetail, 'organization_sub_type'))}
      </Form.Item>,
      <div />,
      <div />,
      <Form.Item label="减编部门名称">
        {dot.get(departmentPostDetail, 'department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="部门编号">
        {dot.get(departmentPostDetail, 'department_info.code', '--')}
      </Form.Item>,
      <Form.Item label="部门编制数">
        {dot.get(departmentPostDetail, 'department_info.organization_num', '--')}
      </Form.Item>,
      <Form.Item label="部门占编数">
        {dot.get(departmentPostDetail, 'department_info.organization_count', '--')}
      </Form.Item>,
      <Form.Item label="岗位名称">
        {dot.get(jobItem, 'job_info.name', '--')}
      </Form.Item>,
      <Form.Item label="减编数">
        {dot.get(jobItem, 'people_num', '--')}
      </Form.Item>,
      <Form.Item label="现岗位编制数">
        {dot.get(jobItem, 'organization_count', '--')}
      </Form.Item>,
      <Form.Item label="岗位占编数">
        {dot.get(jobItem, 'organization_num', '--')}
      </Form.Item>,
    ];
    const formItemFooter = [
      <Form.Item
        label="原因"
      >
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {note}
        </div>
      </Form.Item>,
      <Form.Item
        label="附件"
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} displayMode value={PageUpload.getInitialValue(departmentPostDetail, 'asset_infos')} />
      </Form.Item>,
    ];
    return (
      <CoreContent >
        <CoreForm className="affairs-flow-basic" items={formItems} cols={4} layout={layout} />
        <CoreForm className="affairs-flow-basic" items={formItemFooter} cols={1} layout={layout} />
      </CoreContent>
    );
  };

  // 添加岗位
  const renderAddPost = () => {
    // 岗位信息
    const jobList = dot.get(departmentPostDetail, 'job_data_list', []);
    const jobItem = jobList[0] || {};
    const formItems = [
      <Form.Item label="调整类型">
        {PagesHelper.titleByKey(dot.get(examineOrderDetail, 'applicationOrderType'))}
      </Form.Item>,
      <Form.Item label="调整子类型">
        {ExpenseDepartmentSubtype.description(dot.get(departmentPostDetail, 'organization_sub_type'))}
      </Form.Item>,
      <div />,
      <div />,
      <Form.Item label="部门名称">
        {dot.get(departmentPostDetail, 'department_info.name', '--')}
      </Form.Item>,
      <Form.Item label="岗位名称">
        {dot.get(jobItem, 'job_info.name', '--')}
      </Form.Item>,
      <Form.Item label="岗位编制数">
        {dot.get(jobItem, 'organization_count', '--')}
      </Form.Item>,
      <Form.Item label="岗位职级">
        {dot.get(jobItem, 'job_info.rank', '--')}
      </Form.Item>,
      <Form.Item label="部门编号">
        {dot.get(departmentPostDetail, 'department_info.code', '--')}
      </Form.Item>,
    ];
    const formItemFooter = [
      <Form.Item
        label="岗位描述"
      >
        {dot.get(jobItem, 'description', '--')}
      </Form.Item>,
      <Form.Item
        label="原因"
      >
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {note}
        </div>
      </Form.Item>,
      <Form.Item
        label="附件"
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} displayMode value={PageUpload.getInitialValue(departmentPostDetail, 'asset_infos')} />
      </Form.Item>,
    ];
    return (
      <CoreContent >
        <CoreForm className="affairs-flow-basic" items={formItems} cols={4} layout={layout} />
        <CoreForm className="affairs-flow-basic" items={formItemFooter} cols={1} layout={layout} />
      </CoreContent>
    );
  };

  // 渲染内容
  const renderConent = () => {
    // 子类型
    const subType = dot.get(departmentPostDetail, 'organization_sub_type');
    // 新增部门
    if (subType === ExpenseDepartmentSubtype.newAdd) {
      return renderNewAdd();
    }
    // 调整上级部门
    if (subType === ExpenseDepartmentSubtype.adjustment) {
      return renderAdjustment();
    }
    // 裁撤部门
    if (subType === ExpenseDepartmentSubtype.abolition) {
      return renderAbolition();
    }
    // 增编
    if (subType === ExpenseDepartmentSubtype.addendum) {
      return renderAddendum();
    }
    // 减编
    if (subType === ExpenseDepartmentSubtype.reduceStaff) {
      return renderReduceStaff();
    }
    // 添加岗位
    if (subType === ExpenseDepartmentSubtype.addPost) {
      return renderAddPost();
    }
  };
  return (
    <Form form={form}>
      {/* 渲染内容 */}
      {renderConent()}
    </Form>
  );
}

function mapStateToProps({ codeDocument: { departmentPostDetail } }) {
  return { departmentPostDetail };
}
export default connect(mapStateToProps)(PageDepartmentPostDetail);
