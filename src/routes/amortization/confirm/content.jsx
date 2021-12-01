/*
 * 摊销管理 - 摊销确认 - 列表
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import is from 'is_js';
import {
  Table,
  Button,
} from 'antd';
import {
  Unit,
  AmortizationState,
  CodeRecordBillRedPushState,
} from '../../../application/define';
import { CoreContent } from '../../../components/core';

import AddShare from './component/addShare';
import ComfirmRule from './component/batchConfirmRule';
import Termination from './component/termination';
import EditRule from './component/editRule';
import Operate from '../../../application/define/operate';

// 编辑规则封板类型
const EditRuleType = {
  edit: 'edit',
  comfirm: 'comfirm',
};

const Content = ({
  dispatch,
  onShowSizeChange = () => {},
  onChangePage = () => {},
  amortizationList = {},
  loading, // 是否为加载中
  history,
  getAmortizationList, // 获取摊销列表
  randomString, // 随机字符串
}) => {
  // selectedRowKeys
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // termination visible
  const [terminationVisible, setTerminationVisible] = useState(false);
  // edit rule visible
  const [editRuleVisible, setEditRuleVisible] = useState(false);
  // comfirm rule visible
  const [comfirmRuleVisible, setComfirmRuleVisible] = useState(false);
  // 当前操作的摊销数据
  const [curAmotization, setCurAmorization] = useState({});
  // 编辑规则封板类型
  const [editRuleType, setEditRuleType] = useState(EditRuleType.edit);

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [randomString]);

  const { data = [], _meta: meta = {} } = amortizationList;

  // 获取摊销列表rowSelection disabled
  const getRowSelectionDisabled = (rec = {}) => {
    // 摊销状态已完成 || 已终止
    // 实际已摊销周期有值
    // 状态不允许操作
    if (rec.state === AmortizationState.completed
      || rec.state === AmortizationState.terminated
      || rec.accumulated_allocation_cycle > 0
    ) {
      return true;
    }
    return false;
  };

  // 显示终止摊销弹窗
  const onTermination = (rec) => {
    setCurAmorization(rec);
    setTerminationVisible(true);
  };

  // 隐藏终止弹窗
  const onCancelTerminationModal = (isReset) => {
    // 调用接口成功，重置相关状态
    if (isReset) {
      // 获取摊销列表
      getAmortizationList && getAmortizationList();
    }
    // 重置当前操作的数据
    setCurAmorization({});
    // 隐藏弹窗
    setTerminationVisible(false);
  };

  // 显示编辑规则弹窗
  const onEditRule = (rec) => {
    // 设置当前操作数据
    setCurAmorization(rec);
    if (rec.accumulated_allocation_cycle > 0) {
      // 已封板，显示编辑规则弹窗
      setEditRuleType(EditRuleType.edit);
      // 已封板（编辑规则）
      setEditRuleVisible(true);
    } else {
      // 未封板，显示确认规则弹窗
      setEditRuleType(EditRuleType.comfirm);
      // 未封板(确认规则)
      setComfirmRuleVisible(true);
    }
  };

  // 隐藏编辑规则弹窗
  const onCancelEditRuleModal = (isReset) => {
    // 调用接口成功，重置相关状态
    if (isReset) {
      // 获取摊销列表
      getAmortizationList && getAmortizationList();
    }
    // 重置编辑规则类型为编辑规则
    setEditRuleType(EditRuleType.edit);
    // 重置当前操作的数据
    setCurAmorization({});
    // 隐藏弹窗
    setEditRuleVisible(false);
  };

  // 隐藏批量确认弹窗
  const onCancelComfirmRuleModal = (isReset) => {
    // 调用接口成功，重置相关状态
    if (isReset) {
      // 获取摊销列表
      getAmortizationList && getAmortizationList();

      // 如果是从编辑规则进入的确认规则弹窗，则重置curAmorization
      if (editRuleType === EditRuleType.comfirm) {
        setCurAmorization({});
      } else {
        // 重置selectedRowKeys
        setSelectedRowKeys([]);
      }
    }
    // 重置编辑规则类型为编辑规则
    setEditRuleType(EditRuleType.edit);

    // 隐藏表单
    setComfirmRuleVisible(false);
  };

  // 添加分摊数据modal
  const renderAddShare = () => {
    if (Operate.canOperateCostAmortizationOption()) {
      return <AddShare getAmortizationList={getAmortizationList} />;
    }
    return <div />;
  };

  // 批量确认规则button
  const renderComfirmRuleBtn = () => {
    if (Operate.canOperateCostAmortizationOption()) {
      return (
        <Button
          type="primary"
          onClick={() => setComfirmRuleVisible(true)}
          disabled={selectedRowKeys.length < 1}
          style={{
            marginLeft: 5,
          }}
        >批量确认摊销规则</Button>
      );
    }
  };

  // 批量确认规则modal
  const renderComfirmRuleModal = () => {
    if (!comfirmRuleVisible) return;
    if (Operate.canOperateCostAmortizationOption()) {
      let rowKeys = selectedRowKeys;
      // 编辑规则
      editRuleType === EditRuleType.comfirm && (rowKeys = [curAmotization._id]);

      return (
        <ComfirmRule
          data={data}
          selectedRowKeys={rowKeys}
          visible={comfirmRuleVisible}
          onCancel={onCancelComfirmRuleModal}
        />
      );
    }
    return <div />;
  };

  // 终止弹窗
  const renderTerminationModal = () => {
    if (!terminationVisible || Object.keys(curAmotization).length < 1) return;
    if (Operate.canOperateCostAmortizationOption()) {
      return (
        <Termination
          visible={terminationVisible}
          curAmotization={curAmotization}
          onCancel={onCancelTerminationModal}
        />
      );
    }
    return <div />;
  };

  // 编辑规则弹窗
  const renderEditRuleModal = () => {
    if (!editRuleVisible
      || !curAmotization
      || Object.keys(curAmotization).length < 1
    ) return;
    if (Operate.canOperateCostAmortizationOption()) {
      return (
        <EditRule
          visible={editRuleVisible}
          curAmotization={curAmotization}
          onCancel={onCancelEditRuleModal}
        />
      );
    }
    return <div />;
  };

  const onClickDetail = (rec) => {
    if (is.not.existy(rec) || is.empty(rec)) return;
    // 存储用户行为
    dispatch({ type: 'costAmortization/updateUserAction', payload: { page: meta.page, pageSize: meta.page_size } });

    history.push({
      pathname: '/Amortization/Detail',
      query: {
        id: rec._id,
      },
    });
  };
  // 查看操作
  const renderOption = (rec) => {
    const { state } = rec;
    if (!Operate.canOperateCostAmortizationDetail()
      && !Operate.canOperateCostAmortizationOption()
    ) return '--';

    return (
      <React.Fragment>
        {
          Operate.canOperateCostAmortizationDetail() && (
            <a
              style={{ marginRight: 5 }}
              onClick={() => onClickDetail(rec)}
            >查看</a>
          )
        }
        {
          // 已完成 & 已终止 状态不允许操作
          Operate.canOperateCostAmortizationOption()
            && state !== AmortizationState.completed
            && state !== AmortizationState.terminated
            && (
            <React.Fragment>
              <a
                style={{ marginRight: 5 }}
                onClick={() => onEditRule(rec)}
              >编辑规则</a>
              <a
                onClick={() => onTermination(rec)}
              >终止</a>
            </React.Fragment>
          )
        }
      </React.Fragment>
    );
  };

  // columns
  const columns = [
    {
      title: '科目名称',
      dataIndex: 'biz_account_info',
      fixed: 'left',
      width: 150,
      render: (text = {}) => {
        if (!text) return '--';
        const { name, ac_code: code } = text;

        if (name && code) {
          return `${name}（${code}）`;
        }

        if (name) {
          return name;
        }

        return '--';
      },
    },
    {
      title: '记账科目',
      dataIndex: 'book_account_info',
      fixed: 'left',
      width: 120,
      render: (text = {}) => {
        if (!text) return '--';
        const { name, ac_code: code } = text;

        if (name && code) {
          return `${name}（${code}）`;
        }

        if (name) {
          return name;
        }

        return '--';
      },
    },
    {
      title: '核算中心',
      dataIndex: 'biz_team_name',
      width: 200,
      render: (_, rec) => {
        // team核算中心
        if (rec.biz_team_name) return rec.biz_team_name;
        // code核算中心
        if (rec.biz_code_name) return rec.biz_code_name;
        return '--';
      },
    },
    {
      title: '摊销状态',
      dataIndex: 'state',
      width: 100,
      render: text => (text ? AmortizationState.description(text) : '--'),
    },
    {
      title: '红冲状态',
      dataIndex: 'bill_red_push_state',
      width: 100,
      render: text => ((text || text === false) ? CodeRecordBillRedPushState.description(text) : '--'),
    },
    {
      title: '付款金额',
      dataIndex: 'total_money',
      width: 140,
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '--'),
    },
    {
      title: '税金',
      dataIndex: 'tax_money',
      width: 140,
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '--'),
    },
    {
      title: '税后金额 （费用金额）',
      dataIndex: 'tax_deduction',
      width: 160,
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '--'),
    },
    {
      title: '应摊总额',
      dataIndex: 'allocation_total_money',
      width: 150,
      render: text => ((text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--'),
    },
    {
      title: '本期应摊金额',
      dataIndex: 'allocation_money',
      width: 150,
      render: text => ((text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--'),
    },
    {
      title: '累计已摊金额',
      dataIndex: 'accumulated_allocation_money',
      width: 150,
      render: text => ((text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--'),
    },
    {
      title: '累计未摊金额',
      dataIndex: 'accumulated_unallocation_money',
      width: 150,
      render: text => ((text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--'),
    },
    {
      title: '预计残值金额',
      dataIndex: 'pre_salvage_money',
      width: 150,
      render: text => ((text || text === 0) ? Unit.exchangePriceCentToMathFormat(text) : '--'),
    },
    {
      title: '摊销周期',
      dataIndex: 'allocation_cycle',
      width: 150,
      render: text => text || '--',
    },
    {
      title: '实际已摊周期',
      dataIndex: 'accumulated_allocation_cycle',
      width: 140,
      render: text => text || '--',
    },
    {
      title: '摊销开始日期',
      dataIndex: 'allocation_start_date',
      width: 140,
      render: text => (text ? moment(String(text)).format('YYYY-MM-DD') : '--'),
    },
    {
      title: '摊销终止日期',
      dataIndex: 'allocation_end_date',
      width: 140,
      render: text => (text ? moment(String(text)).format('YYYY-MM-DD') : '--'),
    },
    {
      title: '实际已摊截止日期',
      dataIndex: 'actual_allocation_end_date',
      width: 150,
      render: text => (text ? moment(String(text)).format('YYYY-MM-DD') : '--'),
    },
    {
      title: '费用单号',
      dataIndex: 'cost_order_id',
      width: 200,
      render: text => text || '--',
    },
    {
      title: '审批单号',
      dataIndex: 'oa_order_id',
      width: 200,
      render: (text) => {
        if (text) {
          return (
            <a
              href={`/#/Code/PayOrder/Detail?orderId=${text}&isShowOperation=true`}
            >{text}</a>
          );
        }
        return '--';
      },
    },
    {
      title: '发票抬头',
      dataIndex: 'invoice_title',
      width: 200,
      render: text => text || '--',
    },
    {
      title: '最新操作人',
      dataIndex: ['operator_info', 'name'],
      render: text => text || '--',
    },
    {
      title: '操作',
      dataIndex: '_id',
      key: 'operate',
      fixed: 'right',
      width: 140,
      render: (text, rec) => renderOption(rec),
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

  // rowSelection
  const rowSelection = {
    selectedRowKeys,
    columnWidth: 60,
    getCheckboxProps: rec => ({
      disabled: getRowSelectionDisabled(rec),
    }),
    onChange: val => setSelectedRowKeys(val),
  };

  // 渲染列表
  const renderContent = () => {
    return (
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        rowSelection={rowSelection}
        bordered
        loading={loading}
        scroll={{ y: 500, x: 3500 }}
      />
    );
  };

  const titleExt = (
    <React.Fragment>
      {/* 添加分摊数据modal */}
      {renderAddShare()}

      {/* 批量确认规则button */}
      {renderComfirmRuleBtn()}
    </React.Fragment>
  );

  return (
    <CoreContent title="摊销确认表" titleExt={titleExt}>
      {/* 列表 */}
      {renderContent()}

      {/* 终止弹窗 */}
      {renderTerminationModal()}

      {/* 编辑规则弹窗 */}
      {renderEditRuleModal()}

      {/* 批量确认摊销规则弹窗 */}
      {renderComfirmRuleModal()}
    </CoreContent>
  );
};

export default connect()(Content);
