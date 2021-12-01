/**
 * 审批管理 - 流程审批 - 考勤管理 - 加班管理 - 表格组件
 */
import moment from 'moment';
import React from 'react';
import {
  Table,
} from 'antd';

import {
  CoreContent,
} from '../../../../components/core';

import {
 ExpenseExamineOrderProcessState,
 ExpenseOverTimeThemeTag,
} from '../../../../application/define';

import styles from '../style.css';

const TabContent = (props) => {
  const {
    dataList, // 加班单列表
    onChangePage,
  } = props;

  const {
    data: dataSource = [],
    _meta: meta = {},
  } = dataList;

  const {
    result_count: dataCount,
  } = meta;

  const renderContent = () => {
    const columns = [
      {
        title: '加班单号',
        dataIndex: '_id',
        key: '_id',
        width: 230,
        fixed: 'left',
        render: text => (
          <div className={styles['app-comp-expense-overTime-table-line']}>
            {text}
          </div>
      ),
      },
      {
        title: '主题标签',
        dataIndex: 'tags',
        key: 'tags',
        width: 100,
        render: (text) => {
          if (Array.isArray(text) && text.length > 0) {
            return ExpenseOverTimeThemeTag.description(text[0]);
          }
          return '--';
        },
      },
      {
        title: '项目',
        dataIndex: 'platform_name',
        key: 'platform_name',
        width: 70,
        render: text => text || '--',
      },
      {
        title: '城市',
        dataIndex: 'city_name',
        key: 'city_name',
        width: 70,
        render: text => text || '--',
      },
      {
        title: '团队',
        dataIndex: 'biz_district_name',
        key: 'biz_district_name',
        width: 150,
        render: text => text || '--',
      },
      {
        title: '实际加班人',
        dataIndex: 'actual_apply_name',
        key: 'actual_apply_name',
        width: 100,
        render: text => text || '--',
      },
      {
        title: '审批流',
        dataIndex: 'application_order_info',
        key: 'flow_info',
        width: 150,
        render: (text) => {
          const { flow_info: flowInfo = {} } = text;
          if (flowInfo.name) {
            return (
              <div className={styles['app-comp-expense-overtime-table-line']}>{flowInfo.name}</div>
            );
          }
          return '--';
        },
      },
      {
        title: '流程状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: text => ExpenseExamineOrderProcessState.description(text),
      },
      {
        title: '当前节点',
        dataIndex: 'application_order_info',
        key: 'currentFlowNode',
        width: 120,
        render: (text) => {
          const {
            current_flow_node_info: currentFlowNodeInfo = {},
          } = text;

          if (currentFlowNodeInfo) {
            const name = currentFlowNodeInfo.name;
            const accountList = currentFlowNodeInfo.account_list;
            let subName = '';
            if (accountList.length > 0) {
              subName = '(';
              accountList.map((item) => {
                subName += item.name;
              });
              subName += ')';
            }

            return <div className={styles['app-comp-expense-overtime-table-line']}>{`${name}${subName}`}</div>;
          } else {
            return '--';
          }
        },
      },
      {
        title: '开始时间',
        dataIndex: 'start_at',
        key: 'start_at',
        width: 180,
        render: (text) => {
          if (text) {
            return moment(text).format('YYYY-MM-DD HH:mm:ss');
          }
          return '--';
        },
      },
      {
        title: '结束时间',
        dataIndex: 'end_at',
        key: 'end_at',
        width: 180,
        render: (text) => {
          if (text) {
            return moment(text).format('YYYY-MM-DD HH:mm:ss');
          }
          return '--';
        },
      },
      {
        title: '加班时长（小时）',
        dataIndex: 'duration',
        key: 'duration',
        width: 120,
        render: text => text || '--',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => {
          const { _id: overTimeId } = record;
          return (
            <a
              key="detail"
              href={`/#/Expense/Attendance/OverTime/Detail?overTimeId=${overTimeId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看
            </a>
          );
        },
      },
    ];

    // 分页
    const pagination = {
      defaultPageSize: 30, // 默认数据条数
      onChange: onChangePage, // 切换分页
      total: dataCount, // 数据总条数
      showTotal: total => `总共${total}条`, // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true, // 显示快速跳转
      showSizeChanger: true, // 显示分页
      onShowSizeChange: onChangePage, // 展示每页数据数
    };

    return (
      <CoreContent title="加班列表" >
        <Table
          rowKey={record => record._id}
          dataSource={dataSource}
          columns={columns}
          bordered
          pagination={pagination}
          scroll={{ x: 1640, y: 400 }}
        />
      </CoreContent>
    );
  };

  return renderContent();
};

export default TabContent;
