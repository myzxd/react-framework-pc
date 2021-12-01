/**
 * 人事类 - 合同续签 - 详情
 */
import React, { useEffect } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { PageUpload } from '../../../components';
import {
  showPlainText,
  showDate,
} from '../../../../../../application/utils';

// 表单布局
const FormLayout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

function RenewDetail({
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
    {
      key: '1',
      cols: 3,
      items: [
        <Form.Item label="续签人员">
          {showPlainText(dataSource, 'order_employee_info.name')}
        </Form.Item>,
      ],
    },
    {
      key: '2',
      cols: 3,
      items: [
        <Form.Item label="所在部门">
          {showPlainText(dataSource, 'department_info.name')}
        </Form.Item>,
        <Form.Item label="岗位">
          {showPlainText(dataSource, 'job_info.name')}
        </Form.Item>,
        <Form.Item label="职级">
          {showPlainText(dataSource, 'job_info.rank')}
        </Form.Item>,
      ],
    },
    {
      key: '3',
      cols: 3,
      items: [
        <Form.Item label="入职日期">
          {showPlainText(dataSource, 'entry_date')}
        </Form.Item>,
      ],
    },
  ];

  // 合同信息
  const contractInfoFormItems = [
    {
      key: '1',
      cols: 3,
      items: [
        <Form.Item label="现行合同开始时间">
          {showDate(dataSource, 'contract_signed_date')}
        </Form.Item>,
        <Form.Item label="现行合同结束时间">
          {showDate(dataSource, 'contract_end_date')}
        </Form.Item>,
        <Form.Item label="现行合同甲方">
          {showPlainText(dataSource, 'contract_belong_info.name')}
        </Form.Item>,
        <Form.Item label="新合同开始时间">
          {showDate(dataSource, 'new_contract_signed_date')}
        </Form.Item>,
        <Form.Item label="新合同期限">
          {
            dataSource.new_sign_cycle ?
              `${dataSource.new_sign_cycle}年` :
              '--'
          }
        </Form.Item>,
        <Form.Item label="新合同结束时间">
          {showDate(dataSource, 'new_contract_end_date')}
        </Form.Item>,
        <Form.Item label="新合同甲方">
          {showPlainText(dataSource, 'new_contract_belong_info.name')}
        </Form.Item>,
      ],
    },
    {
      key: '2',
      cols: 1,
      items: [
        <Form.Item
          label="备注"
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

  return (
    <Form {...FormLayout}>
      {/* 渲染续签人员信息 */}
      <CoreContent title="续签人员信息">
        {
          employeeInfoFormItems.map(({ key, cols, items }) => (
            <CoreForm key={key} cols={cols} items={items} />
          ))
        }
      </CoreContent>
      {/* 渲染合同信息 */}
      <CoreContent title="合同信息">
        {
          contractInfoFormItems.map(({ key, cols, items }) => (
            <CoreForm key={key} cols={cols} items={items} />
          ))
        }
      </CoreContent>
    </Form>
  );
}

const mapStateToProps = ({ humanResource: { renewDetail } }) => ({
  dataSource: renewDetail,
});

const mapDispatchToProps = dispatch => ({
  // 获取续签申请详情
  fetchData: id => dispatch({
    type: 'humanResource/fetchRenewOrderDetail',
    payload: { id },
  }),
  // 清空续签申请详情
  clearData: () => dispatch({
    type: 'humanResource/reduceRenewDetail',
    payload: {},
  }),
  // 获取外部审批单插件
  fetchPluginData: oaDetail => dispatch({
    type: 'humanResource/fetchRenewOrderDetail',
    payload: { isPluginOrder: true, oaDetail },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RenewDetail);
