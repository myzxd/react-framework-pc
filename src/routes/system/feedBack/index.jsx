/**
 * 系统管理 - 意见反馈
 */
import { connect } from 'dva';
import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import {
  Table,
  Tooltip,
} from 'antd';

import { CoreContent } from '../../../components/core';

import DealFeedBack from './deal';

const FeedBack = ({
  feedBackList = {}, // 意见反馈
  dispatch,
}) => {
  // 查询参数
  const searchVal = useRef({
    page: 1,
    limit: 30,
  });

  // modal visible
  const [visible, setVisible] = useState(false);
  // 意见id
  const [feedBackId, setFeedBackId] = useState(undefined);
  // table loading
  const [loading, setLoading] = useState(undefined);

  useEffect(() => {
    setLoading(true);
    dispatch({
      type: 'systemManage/getFeedBackList',
      payload: {
        ...searchVal.current,
        setLoading: () => setLoading(false),
      },
    });

    return () => {
      dispatch({
        type: 'systemManage/resetFeedBackList',
      });
    };
  }, [dispatch]);

  // onCancel
  const onCancel = () => {
    setFeedBackId(undefined);
    setVisible(false);
  };

  // onChangePage
  const onChangePage = (page, limit) => {
    setLoading(true);
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };

    dispatch({
      type: 'systemManage/getFeedBackList',
      payload: {
        ...searchVal.current,
        setLoading: () => setLoading(false),
      },
    });
  };

  // onShowSizeChange
  const onShowSizeChange = (page, limit) => {
    setLoading(true);
    searchVal.current = {
      ...searchVal.current,
      page,
      limit,
    };

    dispatch({
      type: 'systemManage/getFeedBackList',
      payload: {
        ...searchVal.current,
        setLoading: () => setLoading(false),
      },
    });
  };

  // 处理
  const onDealFeedBack = (id) => {
    setFeedBackId(id);
    setVisible(true);
  };

  // table note
  const renderNote = (text) => {
    if (text === '' || !text) {
      return '--';
    }

    return (
      // 长度大于20个字要气泡显示
      <div>{
        text.length <= 20 ?
          text
          : (
            <Tooltip
              title={(
                <div
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {text}
                </div>
              )}
            >
              <div>
                {text.length <= 20 ? text : `${text.substr(0, 20)}...`}
              </div>
            </Tooltip>
          )
        }
      </div>
    );
  };

  // table
  const renderTable = () => {
    const { data = [], _meta: meta = {} } = feedBackList;
    // columns
    const columns = [
      {
        title: '分类',
        dataIndex: 'category',
        fixed: 'left',
        width: 120,
        render: text => text || '--',
      },
      {
        title: '提交时间',
        dataIndex: 'created_at',
        width: 180,
        fixed: 'left',
        render: text => (text ? moment(String(text)).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '提交人',
        dataIndex: 'account_name',
        width: 100,
        render: text => text || '--',
      },
      {
        title: '账号',
        dataIndex: 'account_phone',
        width: 120,
        render: text => text || '--',
      },
      {
        title: '部门',
        dataIndex: 'major_department_name',
        width: 120,
        render: text => text || '--',
      },
      {
        title: '岗位',
        dataIndex: 'major_job_name',
        width: 120,
        render: text => text || '--',
      },
      {
        title: '所在城市',
        dataIndex: 'city_name',
        width: 100,
        render: text => text || '--',
      },
      {
        title: '所属主体',
        dataIndex: 'third_part_name',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '选择团队',
        dataIndex: 'team_name',
        width: 120,
        render: text => text || '--',
      },
      {
        title: '问题描述',
        dataIndex: 'issue_note',
        width: 200,
        render: text => renderNote(text),
      },
      {
        title: '处理状态',
        dataIndex: 'handle_state',
        width: 100,
        render: text => (text || '--'),
      },
      {
        title: '处理人',
        dataIndex: 'handle_account_name',
        width: 100,
        render: text => text || '--',
      },
      {
        title: '处理时间',
        dataIndex: 'handle_at',
        width: 180,
        render: text => (text ? moment(String(text)).format('YYYY-MM-DD HH:mm:ss') : '--'),
      },
      {
        title: '备注',
        dataIndex: 'handle_note',
        render: text => renderNote(text),
      },
      {
        title: '操作',
        dataIndex: '_id',
        fixed: 'right',
        key: 'operate',
        width: 80,
        render: (text, rec = {}) => {
          const { handle_state: state, _id: id } = rec;
          if (state === '待处理') {
            return <a onClick={() => onDealFeedBack(id)}>处理</a>;
          }

          return '--';
        },
      },
    ];

    // pagination
    const pagination = {
      current: meta.page || 1,
      defaultPageSize: 30,
      pageSize: meta.page_size || 30,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: onChangePage,
      onShowSizeChange,
      showTotal: showTotal => `总共${showTotal}条`,
      total: meta.result_count,
      pageSizeOptions: ['10', '20', '30', '40'],
    };

    return (
      <CoreContent title="意见反馈">
        <Table
          rowKey={(re, key) => re._id || key}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          bordered
          loading={loading}
          scroll={{ x: 1990, y: 500 }}
        />
      </CoreContent>
    );
  };

  // modal
  const renderModal = () => {
    if (!visible) return;
    return (
      <DealFeedBack
        visible={visible}
        onCancel={onCancel}
        feedBackId={feedBackId}
        dispatch={dispatch}
      />
    );
  };

  return (
    <React.Fragment>
      {renderTable()}
      {renderModal()}
    </React.Fragment>
  );
};

const mapStateToProps = ({
  systemManage: {
    feedBackList,
  },
}) => {
  return { feedBackList };
};

export default connect(mapStateToProps)(FeedBack);
