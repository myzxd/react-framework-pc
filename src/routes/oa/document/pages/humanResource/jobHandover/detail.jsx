/**
 * 人事类 - 工作交接 - 详情
 */
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import PropTypes from 'prop-types';

import {
  CoreContent,
  CoreForm,
} from '../../../../../../components/core';
import {
  showPlainText,
  showDate,
} from '../../../../../../application/utils';
import {
  OaApplicationJobHandoverType,
} from '../../../../../../application/define';
import { PageUpload } from '../../../components';

// 表单布局
const FormLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function JobHandoverDetail({
  fetchData,
  clearData,
  query: { id },
  dataSource = {},
  oaDetail = {},
  fetchPluginData,
  examineOrderDetail,
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
    <Form.Item label="实际交接人">
      {showPlainText(dataSource, 'order_employee_info.name')}
    </Form.Item>,
    <Form.Item label="所在部门">
      {showPlainText(dataSource, 'department_info.name')}
    </Form.Item>,
    <Form.Item label="岗位">
      {showPlainText(dataSource, 'job_info.name')}
    </Form.Item>,
    <Form.Item label="入职日期">
      {showDate(dataSource, 'entry_date')}
    </Form.Item>,
    <Form.Item label="工作接收人">
      {dot.get(dataSource, 'receiver_info_list') ? dot.get(dataSource, 'receiver_info_list').map(v => v.name).join(', ') : '--'}
    </Form.Item>,
    <Form.Item label="监交人">
      {showPlainText(dataSource, 'supervisor')}
    </Form.Item>,
    <Form.Item label="工作交接类型">
      {dataSource.handover_type ? OaApplicationJobHandoverType.description(dataSource.handover_type) : '--'}
    </Form.Item>,
    <Form.Item
      label="关联审批单"
    >
      {
        dot.get(examineOrderDetail, 'pluginExtraMeta.is_plugin_order', undefined)
        ? showPlainText(dataSource, 'relation_application_order_info._id')
        : dot.get(dataSource, 'relation_application_order_info._id', undefined)
          ? <a
            target="_blank"
            rel="noopener noreferrer"
            href={`/#/Expense/Manage/ExamineOrder/Detail?orderId=${showPlainText(dataSource, 'relation_application_order_info._id')}`}
          >
            {showPlainText(dataSource, 'relation_application_order_info._id')}
          </a>
          : '--'
      }
    </Form.Item>,
  ];

  if (dataSource.handover_type === OaApplicationJobHandoverType.resign) {
    employeeInfoFormItems.push(
      <Form.Item label="离职日期">
        {showDate(dataSource, 'departure_date')}
      </Form.Item>,
    );
  }

  // 附件
  const photoFormItems = [
    <Form.Item
      key="photo"
      label="附件"
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
    <React.Fragment>
      <Form {...FormLayout}>
        {/* 渲染基本信息 */}
        <CoreContent title="基本信息">
          <CoreForm items={employeeInfoFormItems} />
        </CoreContent>
        {/* 渲染附件 */}
        <CoreContent title="拍照上传《工作交接单》">
          <CoreForm items={photoFormItems} cols={1} />
        </CoreContent>
      </Form>
    </React.Fragment>
  );
}

JobHandoverDetail.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired, // 费用单id
  }).isRequired,
};

const mapStateToProps = ({ humanResource: { jobHandoverDetail }, expenseExamineOrder: { examineOrderDetail } }) => ({
  dataSource: jobHandoverDetail,
  examineOrderDetail,
});

const mapDispatchToProps = dispatch => ({
  // 获取工作交接单信息
  fetchData: id => dispatch({
    type: 'humanResource/fetchHandoverOrderDetail',
    payload: { id },
  }),
  // 清空工作交接单信息
  clearData: () => dispatch({
    type: 'humanResource/reduceJobHandoverDetail',
    payload: {},
  }),
  // 获取外部审批单插件
  fetchPluginData: oaDetail => dispatch({
    type: 'humanResource/fetchHandoverOrderDetail',
    payload: { isPluginOrder: true, oaDetail },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(JobHandoverDetail);

