/**
 * 人事类 - 人事调动 - 详情
 */
import React, { useEffect } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import dot from 'dot-prop';

import { PositionTransferType } from '../../../../../../application/define';
import {
  CoreForm, CoreContent,
} from '../../../../../../components/core';
import { PageUpload } from '../../../components';
import {
  showPlainText,
  showDate,
} from '../../../../../../application/utils';

// 表单布局
const FormLayout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

function PositionTransferDetail({
  fetchData,
  clearData,
  query: { id },
  dataSource = {},
  fetchPluginData,
  oaDetail,
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
    {
      key: '1',
      cols: 3,
      items: [
        <Form.Item label="调动人员">
          {showPlainText(dataSource, 'order_employee_info.name')}
        </Form.Item>,
        <Form.Item label="调动类型">
          {PositionTransferType.description(dot.get(dataSource, 'human_resource_type'))}
        </Form.Item>,
        <Form.Item label="调动生效时间">
          {showDate(dataSource, 'effect_date')}
        </Form.Item>,
        <Form.Item label="所在部门">
          {showPlainText(dataSource, 'department_info.name')}
        </Form.Item>,
        <Form.Item label="岗位">
          {showPlainText(dataSource, 'job_info.name')}
        </Form.Item>,
        <Form.Item key="level" label="职级">
          {showPlainText(dataSource, 'job_info.rank')}
        </Form.Item>,
        <Form.Item label="调动后部门">
          {showPlainText(dataSource, 'transfer_department_info.name')}
        </Form.Item>,
        <Form.Item label="调动后岗位">
          {showPlainText(dataSource, 'transfer_job_info.name')}
        </Form.Item>,
        <Form.Item key="afterLevel" label="职级">
          {showPlainText(dataSource, 'transfer_job_info.rank')}
        </Form.Item>,
      ],
    },
    {
      key: '2',
      cols: 1,
      items: [
        <Form.Item
          label="调动原因说明"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 18 }}
        >
          <span className="noteWrap">{showPlainText(dataSource, 'note')}</span>
        </Form.Item>,
      ],
    },
    {
      key: '3',
      cols: 1,
      items: [
        <Form.Item
          label="附件"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 18 }}
        >
          <PageUpload
            displayMode
            value={PageUpload.getInitialValue(dataSource, 'asset_infos')}
          />
        </Form.Item>,
      ],
    },
  ];


  return (<Form {...FormLayout}>
    {/* 渲染调动人员信息 */}
    <CoreContent title="调动人员信息">
      {
        employeeInfoFormItems.map(({ key, items, cols }) => (
          <CoreForm key={key} items={items} cols={cols} />
        ))
      }
    </CoreContent>
  </Form>);
}

const mapStateToProps = ({ humanResource: { positionTransferDetail } }) => ({
  dataSource: positionTransferDetail,
});

const mapDispatchToProps = dispatch => ({
  // 获取人事调动详情
  fetchData: id => dispatch({
    type: 'humanResource/fetchHumanResourceTransferOrderDetail',
    payload: { id },
  }),
  // 清空人事调动详情
  clearData: () => dispatch({
    type: 'humanResource/reducePositionTransferDetail',
    payload: {},
  }),
  // 获取外部审批单插件
  fetchPluginData: oaDetail => dispatch({
    type: 'humanResource/fetchHumanResourceTransferOrderDetail',
    payload: { isPluginOrder: true, oaDetail },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PositionTransferDetail);
