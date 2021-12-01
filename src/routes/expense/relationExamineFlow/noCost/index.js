/*
* 非成本类审批流
*/
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm } from 'antd';

import { CoreContent } from '../../../../components/core';
import {
  RelationExamineFlowAvailableState,
  RelationExamineFlowState,
  RelationExamineFlowTabType,
  ExpenseCostOrderBizType,
} from '../../../../application/define';
import Search from './search';
import Operate from '../../../../application/define/operate';

const bizType = RelationExamineFlowTabType.noCost;
const enumeratedType = 'examineFlowApplyApplicationTypes';

function RelationExamineFlowNoCost(props) {
  const { dispatch, enumeratedValue = {} } = props;
  const { [enumeratedType]: dataTypes = [] } = enumeratedValue;
  const [meta, setMeta] = useState({ page: 1, limit: 30 });
  const [searchParams, setSearchParams] = useState({ });
  useEffect(() => {
    dispatch({
      type: 'applicationCommon/getEnumeratedValue',
      payload: { enumeratedType, examineFlowBiz: ExpenseCostOrderBizType.noCostOf },
    });
    return () => dispatch({ type: 'applicationCommon/resetEnumeratedValue', payload: {} });
  }, [dispatch]);

  useEffect(() => {
    const payload = {
      bizType,
      ...searchParams,
    };
    dispatch({ type: 'relationExamineFlow/fetchRelationExamineFlow', payload });
    return () => {
      dispatch({ type: 'relationExamineFlow/reduceRelationExamineFlow', payload: {} });
    };
  }, [dispatch, searchParams]);

  const onSearch = (val) => {
    setMeta({ page: 1, limit: 30 });
    setSearchParams({
      ...val,
    });
  };

  // 分页
  const onChangePage = (page, limit) => {
    setMeta({ page, limit });
  };

  // 成功回调
  const onSuccessCallback = () => {
    const payload = {
      bizType,
      ...searchParams,
    };
    dispatch({ type: 'relationExamineFlow/fetchRelationExamineFlow', payload });
  };

  // 更新状态
  const onClickUpdateState = (record, state) => {
    const payload = {
      pluginId: record.plugin_id,
      appWatchFlowId: record.app_watch_flow_id,
      state,
      bizType,
      onSuccessCallback,
    };
    dispatch({ type: 'relationExamineFlow/updateRelationExamineFlowState', payload });
  };

  // 渲染tab
  const renderSearch = () => {
    return (
      <Search onSearch={onSearch} dataTypes={dataTypes} />
    );
  };

  const renderTableOperate = (record) => {
    const operates = [];
    if (Operate.canOperateExpenseRelationExamineFlowNoCostDetail()) {
      operates.push(
        <a
          key="detail"
          href={`/#/Expense/RelationExamineFlow/NoCostDetail?qhFlowId=${dot.get(record, 'qh_flow_info._id', undefined)}&xdFlowId=${dot.get(record, 'xd_flow_info._id', undefined)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: 10 }}
        >
      查看
      </a>,
      );
    }
    // 可用
    if (record.state === RelationExamineFlowAvailableState.available
    && Operate.canOperateExpenseRelationExamineFlowNoCostUpdateState()) {
      operates.push(
        <Popconfirm title="您是否确认禁用此关联关系？" onConfirm={() => { onClickUpdateState(record, RelationExamineFlowState.disable); }}>
          <a>禁用</a>
        </Popconfirm>,
      );
    }
    // 不可用
    if (record.state === RelationExamineFlowAvailableState.noAvailable) {
      if (Operate.canOperateExpenseRelationExamineFlowNoCostUpdate()) {
        operates.push(
          <a
            rel="noopener noreferrer"
            target="_blank"
            href={`/#/Expense/RelationExamineFlow/NoCostUpdate?pluginId=${record.plugin_id}&appWatchFlowId=${record.app_watch_flow_id}&qhFlowId=${dot.get(record, 'qh_flow_info._id', undefined)}&xdFlowId=${dot.get(record, 'xd_flow_info._id', undefined)}`}
          >编辑</a>,
        );
      }
      if (Operate.canOperateExpenseRelationExamineFlowNoCostUpdateState()) {
        operates.push(
          <Popconfirm title="您是否确认启用此关联关系？" onConfirm={() => { onClickUpdateState(record, RelationExamineFlowState.normal); }}>
            <a style={{ marginLeft: 10 }}>启用</a>
          </Popconfirm>,
          <Popconfirm title="您是否确认删除此关联关系？" onConfirm={() => { onClickUpdateState(record, RelationExamineFlowState.delete); }}>
            <a style={{ marginLeft: 10 }}>删除</a>
          </Popconfirm>,
        );
      }
    }
    // 判断是否有操作按钮
    if (operates.length === 0) {
      return '--';
    }
    return operates;
  };

  // 表格
  const renderContent = () => {
    const { limit, page } = meta;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        width: 50,
        fixed: 'left',
        render: (text, record, index) => {
          const num = (limit * (page - 1)) + index + 1;
          return <div>{num}</div>;
        },
      },
      {
        title: 'BU3/审批流名称',
        dataIndex: ['xd_flow_info', 'name'],
        width: 120,
        render: text => text || '--',
      },
      {
        title: 'BU3/适用类型',
        dataIndex: ['xd_flow_info', 'type'],
        width: 120,
        render: (text) => {
          if (Array.isArray(text) && text.length > 0) {
            return text.map((item) => {
              const type = dataTypes.find(v => v.value === item) || {};
              return type.name;
            }).join('、');
          }
          return '--';
        },
      },
      {
        title: 'BU3/是否有RS节点',
        dataIndex: ['xd_flow_info', 'has_rs_node'],
        width: 150,
        render: text => (text ? '是' : '否'),
      },
      {
        title: 'BU3/状态',
        dataIndex: ['xd_flow_info', 'state'],
        width: 80,
        render: text => RelationExamineFlowState.description(text),
      },
      {
        title: '趣活/审批流名称',
        dataIndex: ['qh_flow_info', 'name'],
        width: 120,
        render: text => text || '--',
      },
      {
        title: '趣活/适用类型',
        dataIndex: ['qh_flow_info', 'type'],
        width: 120,
        render: (text) => {
          if (Array.isArray(text) && text.length > 0) {
            return text.map((item) => {
              const type = dataTypes.find(v => v.value === item) || {};
              return type.name;
            }).join('、');
          }
          return '--';
        },
      },
      {
        title: '趣活/状态',
        dataIndex: ['qh_flow_info', 'state'],
        width: 100,
        render: text => RelationExamineFlowState.description(text),
      },
      {
        title: '可用状态',
        dataIndex: 'state',
        width: 80,
        render: text => RelationExamineFlowAvailableState.description(text),
      },
      {
        title: '原因',
        dataIndex: 'reason',
        width: 150,
        render: (text) => {
          if (Array.isArray(text)) {
            if (text.length === 0) {
              return '--';
            }
            return text.map((item, i) => {
              return (<span key={i}>{item};{i === text.length - 1 ? <br /> : null}</span>);
            });
          }
          return '--';
        },
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        width: 100,
        render: text => text || '--',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 150,
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
      {
        title: '最新操作人',
        dataIndex: 'operator',
        width: 100,
        render: text => text || '--',
      },
      {
        title: '操作时间',
        dataIndex: 'updated_at',
        width: 150,
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width: 150,
        fixed: 'right',
        render: (text, record) => {
          return renderTableOperate(record);
        },
      },
    ];

    // 分页
    const pagination = {
      current: page,
      pageSize: limit, // 默认数据条数
      onChange: onChangePage, // 切换分页
      showTotal: total => `总共${total}条`, // 数据展示总条数
      pageSizeOptions: ['10', '20', '30', '40'],
      showQuickJumper: true, // 显示快速跳转
      showSizeChanger: true, // 显示分页
      onShowSizeChange: onChangePage, // 展示每页数据数
    };
    // 获取表格列表的宽度
    const columnsWidth = columns.map(v => v.width || 0);
    // 计算表格列表的宽度
    const scrollX = columnsWidth.reduce((a, b) => a + b);
    let titleExt;
    // 判断权限
    if (Operate.canOperateExpenseRelationExamineFlowNoCostCreate()) {
      titleExt = (<Button
        onClick={() => {
          window.location.href = '/#/Expense/RelationExamineFlow/NoCostCreate';
        }}
        type="primary"
      >新增</Button>);
    }
    return (
      <CoreContent title="非成本类审批流列表" titleExt={titleExt}>
        <Table
          rowKey={(record, key) => key}
          dataSource={dot.get(props, 'relationExamineFlowList.datas', [])}
          columns={columns}
          bordered
          pagination={pagination}
          scroll={{ x: scrollX }}
        />
      </CoreContent>
    );
  };
  return (
    <React.Fragment>
      {/* 渲染tab */}
      {renderSearch()}

      {/* 表格 */}
      {renderContent()}
    </React.Fragment>
  );
}

function mapStateToProps({ relationExamineFlow: { relationExamineFlowList },
  applicationCommon: { enumeratedValue },
}) {
  return { relationExamineFlowList, enumeratedValue };
}
export default connect(mapStateToProps)(RelationExamineFlowNoCost);
