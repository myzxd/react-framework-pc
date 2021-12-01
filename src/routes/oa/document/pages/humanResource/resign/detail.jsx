/**
 * 人事类 - 离职申请 - 详情
 */
import React, { useEffect } from 'react';
import dot from 'dot-prop';
import { Form } from 'antd';
import { connect } from 'dva';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { ResignReason } from '../../../../../../application/define';
import {
  showPlainText,
  showDate,
} from '../../../../../../application/utils';
import { PageUpload } from '../../../components';

// 基本信息表单布局
const EmployeeFormLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

// 离职信息表单布局
const ResignInfoFormLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

function ResignDetail({
  fetchData,
  clearData,
  query: { id },
  dataSource = {},
  fetchPluginData,
  oaDetail = {},
}) {
  useEffect(() => {
    if (oaDetail._id) {
      // 如果是外部插入审批单获取外部插入审批单
      fetchPluginData(oaDetail);
    } else {
      // 获取审批单数据
      fetchData(id);
    }
    return clearData;
  }, [fetchData, clearData, id, fetchPluginData, oaDetail]);

  // 基本信息
  const employeeInfoFormItems = [
    <Form.Item
      label="离职申请人"
      {...EmployeeFormLayout}
    >
      {showPlainText(dataSource, 'order_employee_info.name')}
    </Form.Item>,
    <Form.Item
      label="部门"
      {...EmployeeFormLayout}
    >
      {showPlainText(dataSource, 'department_info.name')}
    </Form.Item>,
    <Form.Item
      label="岗位"
      {...EmployeeFormLayout}
    >
      {showPlainText(dataSource, 'job_info.name')}
    </Form.Item>,
    <Form.Item
      label="职级"
      {...EmployeeFormLayout}
    >
      {showPlainText(dataSource, 'job_info.rank')}
    </Form.Item>,
  ];

  // 离职信息
  const resignInfoFormItems = [
    <Form.Item
      label="申请离职日期"
      {...ResignInfoFormLayout}
    >
      {showDate(dataSource, 'apply_departure_date')}
    </Form.Item>,
    <Form.Item
      label="离职原因"
      {...ResignInfoFormLayout}
    >
      {ResignReason.description(dot.get(dataSource, 'departure_type'))}
    </Form.Item>,
    // <Form.Item
    //   label="工作交接关联审批单"
    //   {...ResignInfoFormLayout}
    // >
    //   {
    //     dot.get(dataSource, 'handover_order_info.oa_application_order_id') ?
    //       <a
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         href={`/#/Expense/Manage/ExamineOrder/Detail?orderId=${showPlainText(dataSource, 'handover_order_info.oa_application_order_id')}`}
    //       >
    //         {showPlainText(dataSource, 'handover_order_info._id')}
    //       </a> :
    //       showPlainText(dataSource, 'handover_order_info._id')
    //   }
    // </Form.Item>,
    <Form.Item
      label="离职事由"
      {...ResignInfoFormLayout}
    >
      <span className="noteWrap">{showPlainText(dataSource, 'note')}</span>
    </Form.Item>,
  ];

  // 附件
  const filesFormItems = [
    <Form.Item
      label="附件"
      key="files"
      labelCol={{ span: 2 }}
      wrapperCol={{ span: 20 }}
    >
      <PageUpload
        displayMode
        value={PageUpload.getInitialValue(dataSource, 'asset_infos')}
      />
    </Form.Item>,
  ];

  return (
    <Form>
      {/* 渲染基本信息 */}
      <CoreContent title="基本信息">
        <CoreForm items={employeeInfoFormItems} cols={4} />
      </CoreContent>

      {/* 渲染离职信息 */}
      <CoreContent title="离职信息">
        <CoreForm items={resignInfoFormItems} cols={1} />
      </CoreContent>

      {/* 渲染附件 */}
      <CoreContent title="附件">
        <CoreForm items={filesFormItems} cols={1} />
      </CoreContent>
    </Form>
  );
}

const mapStateToProps = ({ humanResource: { resignDetail } }) => ({
  dataSource: resignDetail, // 离职申请详情
});

const mapDispatchToProps = dispatch => ({
  // 获取离职申请详情
  fetchData: id => dispatch({
    type: 'humanResource/fetchResignOrderDetail',
    payload: { id },
  }),
  // 清空离职申请详情
  clearData: () => dispatch({
    type: 'humanResource/reduceResignDetail',
    payload: {},
  }),
  // 获取外部审批单插件
  fetchPluginData: oaDetail => dispatch({
    type: 'humanResource/fetchResignOrderDetail',
    payload: { isPluginOrder: true, oaDetail },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResignDetail);
