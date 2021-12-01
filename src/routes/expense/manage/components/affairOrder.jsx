/**
 * 事务性审批单列表
 **/
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { CoreContent } from '../../../../components/core';
import { PagesHelper } from '../../../oa/document/define';
import { OaApplicationOrderType } from '../../../../application/define';

const AffairOrder = (props) => {
  const { dispatch, detail = {}, orderList = {}, approvalKey = 2 } = props;
  const {
    id,
    applicationOrderType: type,
    flowId,
  } = detail;
  const { data: dataSource = [] } = orderList;
  useEffect(() => {
    dispatch({
      type: 'humanResource/getOrderList',
      payload: {
        id,
        type,
      },
    });
  }, [dispatch, id, type]);
  const onClick = (orderId) => {
    const url = PagesHelper.routeByKey(type, 'update', { id: orderId, callbackId: id, pageType: type, callbackKey: approvalKey, flow_id: flowId });
    window.location.href = url;
  };

  const columns = [
    {
      title: '申请单号',
      dataIndex: '_id',
      render: text => (text || '--'),
    },
    {
      title: '部门',
      dataIndex: ['creator_department_info', 'name'],
      render: text => (text || '--'),
    },
    {
      title: '岗位',
      dataIndex: ['creator_job_info', 'name'],
      render: text => (text || '--'),
    },
    {
      title: '申请人',
      dataIndex: ['creator_info', 'name'],
      render: text => (text || '--'),
    },
    {
      title: '事由说明',
      dataIndex: 'note',
      width: 450,
      render: (text, record) => {
        // 根据类型判断所调取不同的字段
        if (type === OaApplicationOrderType.contractCome) {
          return (<div style={{ wordBreak: 'break-all' }} className="noteWrap">{record.content}</div>);
        } else if (type === OaApplicationOrderType.official) {
          return (<div style={{ wordBreak: 'break-all' }} className="noteWrap">{record.improve_vision}</div>);
        } else if (type === OaApplicationOrderType.recruitment) {
          return (<div style={{ wordBreak: 'break-all' }} className="noteWrap">{record.other_requirement}</div>);
          // 出差
        } else if (type === OaApplicationOrderType.oaBusiness) {
          return (<div style={{ wordBreak: 'break-all' }} className="noteWrap">{record.working_plan}</div>);
          // 资金调拨申请
        } else if (type === OaApplicationOrderType.fundTrasfer) {
          return (<div style={{ wordBreak: 'break-all' }} className="noteWrap">{dot.get(record, 'dispatch_expense_list.0.note', '')}</div>);
        }
        return (<div style={{ wordBreak: 'break-all' }} className="noteWrap">{text}</div>);
      },
    },
    {
      title: '操作',
      dataIndex: '_id',
      render: (text) => {
        return <a onClick={() => onClick(text)}>编辑</a>;
      },
    },
  ];
  return (
    <CoreContent title="相关单据">
      <Table
        columns={columns}
        rowKey={(re, key) => re._id || key}
        dataSource={dataSource}
      />
    </CoreContent>
  );
};

const mapStateToProps = ({ humanResource: { orderList } }) => ({ orderList });

export default connect(mapStateToProps)(AffairOrder);
