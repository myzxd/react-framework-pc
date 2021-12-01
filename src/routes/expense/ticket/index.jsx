/*
 * 审批管理 - 基础设置 - 验票标签库设置 /Expense/Ticket
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import {
  Form,
  Input,
  Table,
  Button,
  Popconfirm,
  message,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { CoreSearch, CoreContent } from '../../../components/core';
import Createtag from './components/modal/create';

const TicketTag = (props) => {
  const { dispatch, ticketTags = {} } = props;

  // visible
  const [visible, setVisible] = useState(false);

  const { data = [], _meta: paginationMeta = { page: 1, limit: 30 } } = ticketTags;

  // meta
  const [meta, setMeta] = useState({ ...paginationMeta });
  // search value
  const [searchVal, setSearchVal] = useState({ name: undefined });
  useEffect(() => {
    const payload = {
      ...meta,
      ...searchVal,
    };

    dispatch({ type: 'ticketTag/getTicketTags', payload });
  }, [dispatch, meta, searchVal, visible]);

  // onSearch
  const onSearch = (values) => {
    setSearchVal({ ...values });
    setMeta({ page: 1, limit: 30 });
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    setMeta({ page, limit });
  };

  // onShowSizeChange
  const onShowSizeChange = (page, limit) => {
    setMeta({ page, limit });
  };

  // delete
  const onDelete = async (id) => {
    const res = await dispatch({ type: 'ticketTag/deleteTicketTag', payload: { id } });
    if (res && res.ok) {
      dispatch({ type: 'ticketTag/getTicketTags', payload: { ...meta, ...searchVal } });
    } else {
      message.error('操作失败');
    }
  };

  // search component
  const searchComponent = () => {
    const items = [
      <Form.Item label="验票标签名称" name="name">
        <Input placeholder="请输入" allowClear />
      </Form.Item>,
    ];

    const searchProps = {
      items,
      onSearch,
      onReset: onSearch,
    };

    return (
      <CoreContent>
        <CoreSearch {...searchProps} />
      </CoreContent>
    );
  };

  // table
  const contentComponent = () => {
    const columns = [
      {
        title: '验票标签名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '备注',
        dataIndex: 'note',
        render: (text) => {
          if (!text) return '--';
          return (
            <span className="noteWrap">
              {text}
            </span>
          );
        },
      },
      {
        title: '操作',
        dataIndex: '_id',
        width: 150,
        render: (id) => {
          return (
            <Popconfirm
              icon={<InfoCircleOutlined style={{ color: '#FF7700' }} />}
              title="是否删除此标签？"
              onConfirm={() => onDelete(id)}
            >
              <a>删除</a>
            </Popconfirm>
          );
        },
      },
    ];

    const titleExt = <Button type="primary" onClick={() => setVisible(true)}>新增验票标签</Button>;

    const pagination = {
      current: meta.page || 1,
      defaultPageSize: 30,
      pageSize: meta.limit || 30,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: onChangePage,
      onShowSizeChange,
      showTotal: showTotal => `总共${showTotal}条`,
      total: paginationMeta.result_count,
      pageSizeOptions: ['10', '20', '30', '40'],
    };

    return (
      <CoreContent title="验票标签" titleExt={titleExt}>
        <Table
          rowKey={(re, key) => re.id || key}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          bordered
        />
      </CoreContent>
    );
  };

  // modal
  const createModal = () => {
    if (!visible) return;
    return (
      <Createtag
        dispatch={dispatch}
        visible={visible}
        onCancel={() => setVisible(false)}
      />
    );
  };

  return (
    <div>
      {searchComponent()}
      {contentComponent()}
      {createModal()}
    </div>
  );
};

const mapStateToProps = ({ ticketTag: { ticketTags } }) => ({ ticketTags });

export default connect(mapStateToProps)(TicketTag);
