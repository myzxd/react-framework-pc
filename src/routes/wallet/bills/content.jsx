/*
 * 趣活钱包 - 支付账单 - 表格组件
 */
import dot from 'dot-prop';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Table,
  Tooltip,
  Button,
  Popconfirm,
  message,
} from 'antd';

import { CoreContent } from '../../../components/core';
import {
  Unit,
  OaApplicationOrderType,
  ExpenseExamineOrderProcessState,
  ExpenseTicketState,
  WalletBillsPaidState,
  WalletBillsPaidType,
  CodeCostCenterType,
  CodeTicketState,
} from '../../../application/define';
import SinglePayModal from './component/modal/singlePay';
import BatchPayModal from './component/modal/batchPay';
import PaymentStateModal from './component/modal/paymentState';
import Operate from '../../../application/define/operate';

const Content = ({
  dispatch,
  walletBills = {}, // 支付账单list
  onShowSizeChange = () => {},
  onChangePage = () => {},
  getWalletBills, // 获取支付账单list
  loading = false,
}) => {
  // table select keys
  const [selectedRowKeys, setTabKey] = useState([]);
  // 当前操作付款的账单
  const [curBill, setCurBill] = useState({});
  // 单账单弹窗visible
  const [singlePayVis, setSinglePayVis] = useState(false);
  // 批量付款弹窗visible
  const [batchPayVis, setBatchPayVis] = useState(false);
  // 付款状态弹窗visible
  const [payStateVis, setPayStateVis] = useState(false);
  // 付款状态弹窗title
  const [payStateTitle, setPayStateTitle] = useState('批量付款');

  const { data = [], _meta: meta = {} } = walletBills;

  useEffect(() => {
    setTabKey([]);
  }, [walletBills]);

  // 单账单付款
  const onBill = (rec) => {
    setCurBill(rec);
    setSinglePayVis(true);
  };

  // 隐藏单账单付款弹窗
  const onCancelSinglePayModal = (res) => {
    setSinglePayVis(false);

    // 付款成功显示提示弹窗
    if (res && res.ok) {
      // 获取支付账单list
      getWalletBills && getWalletBills();
      setPayStateVis(true);
      setPayStateTitle('确认付款信息');
    }
  };

  // 隐藏批量付款弹窗
  const onCancelBatchPayModal = (res) => {
    setBatchPayVis(false);
    setTabKey([]);

    // 付款成功显示提示弹窗
    if (res && res.ok) {
      // 获取支付账单list
      getWalletBills && getWalletBills();
      setPayStateVis(true);
      setPayStateTitle('批量付款');
    }
  };

  // 账单作废
  const onVoid = async (billId) => {
    const res = await dispatch({
      type: 'wallet/onVoidBill',
      payload: {
        billId,
        state: WalletBillsPaidState.void,
      },
    });

    if (res && res._id) {
      message.success('请求成功');
      getWalletBills && getWalletBills();
    } else {
      message.error('请求失败');
    }
  };

  // 单账单付款弹窗
  const renderSinglePayModal = () => {
    return (
      <SinglePayModal
        data={curBill}
        visible={singlePayVis}
        onCancel={onCancelSinglePayModal}
        dispatch={dispatch}
      />
    );
  };

  // 批量付款弹窗
  const renderBatchPayModal = () => {
    return (
      <BatchPayModal
        visible={batchPayVis}
        billIds={selectedRowKeys}
        onCancel={onCancelBatchPayModal}
        data={data}
        dispatch={dispatch}
      />
    );
  };

  // 付款状态弹窗
  const renderPaymentStateModal = () => {
    return (
      <PaymentStateModal
        visible={payStateVis}
        onCancel={() => setPayStateVis(false)}
        title={payStateTitle}
      />
    );
  };

  // 渲染标签
  const renderTags = (tagsList, type) => {
    // 标签数据大于三个
    if (Array.isArray(tagsList) && tagsList.length > 3) {
      const title = type === 'inspect' ?
        tagsList.map(t => t.name).join(' 、 ')
        : tagsList.map(t => t).join(' 、 ');
      return (
        <Tooltip title={title}>
          <div>
            {
              type === 'inspect' ?
                tagsList.slice(0, 3).map(t => t.name).join(' 、 ')
                : tagsList.slice(0, 3).map(t => t).join(' 、 ')
            }...</div>
        </Tooltip>
      );
    }

    // 标签数据小于三个
    if (Array.isArray(tagsList) && tagsList.length <= 3 && tagsList.length > 0) {
      return (
        <div>
          {
            type === 'inspect' ?
              tagsList.map(t => t.name).join('、')
              : tagsList.map(t => t).join('、')
          }
        </div>
      );
    }

    return '--';
  };

  // columns
  const columns = [
    {
      title: '账单编号',
      dataIndex: '_id',
      width: 120,
      fixed: 'left',
    },
    {
      title: '审批单提报人',
      dataIndex: ['order_apply_info', 'name'],
      width: 100,
      fixed: 'left',
      render: text => text || '--',
    },
    {
      title: '账单生成时间',
      dataIndex: 'created_at',
      width: 120,
      fixed: 'left',
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    },
    {
      title: '关联审批单号',
      dataIndex: 'ref_id',
      width: 120,
      fixed: 'left',
      render: text => (text || '--'),
    },
    {
      title: '账单总金额',
      dataIndex: 'total_money',
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '0.00'),
    },
    {
      title: '已支付金额',
      dataIndex: 'paid_money',
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '0.00'),
    },
    {
      title: '未支付金额',
      dataIndex: 'unpaid_money',
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '0.00'),
    },
    {
      title: '支付中金额',
      dataIndex: 'paying_money',
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '0.00'),
    },
    {
      title: '主题标签',
      dataIndex: ['application_order_info', 'theme_label_list'],
      render: (text, record) => {
        // 审批流
        if (record.type === WalletBillsPaidType.approval) {
          return renderTags(text, 'theme');
        }
        // CODE审批类
        if (record.type === WalletBillsPaidType.code) {
          return renderTags(dot.get(record, 'qoa_order_info.theme_label_list', []), 'theme');
        }
        return '--';
      },
    },
    {
      title: '是否有验票标签',
      dataIndex: ['application_order_info', 'inspect_bill_label_list'],
      render: (text, record) => {
        // 审批流
        if (record.type === WalletBillsPaidType.approval) {
          return Array.isArray(text) && text.length > 0 ? '有' : '无';
        }
        // CODE审批类
        if (record.type === WalletBillsPaidType.code) {
          const labelList = dot.get(record, 'qoa_order_info.inspect_bill_label_list', []);
          return (Array.isArray(labelList)
            && labelList.length > 0) ? '有' : '无';
        }
        return '--';
      },
    },
    {
      title: '验票标签',
      dataIndex: ['application_order_info', 'inspect_bill_label_list'],
      render: (text, record) => {
        // 审批流
        if (record.type === WalletBillsPaidType.approval) {
          return renderTags(text, 'inspect');
        }
        // CODE审批类
        if (record.type === WalletBillsPaidType.code) {
          return renderTags(dot.get(record, 'qoa_order_info.inspect_bill_label_list', []), 'inspect');
        }
        return '--';
      },
    },
    {
      title: '提报日期',
      dataIndex: ['application_order_info', 'submit_at'],
      render: (text, record) => {
        // 审批流
        if (record.type === WalletBillsPaidType.approval) {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
        }
        // CODE审批类
        if (record.type === WalletBillsPaidType.code) {
          const submitAt = dot.get(record, 'qoa_order_info.submit_at', undefined);
          return submitAt ? moment(submitAt).format('YYYY-MM-DD HH:mm:ss') : '--';
        }
        return '--';
      },
    },
    {
      title: '归属周期',
      dataIndex: ['application_order_info', 'belong_time'],
      render: (text, record) => {
        // 审批流
        if (record.type === WalletBillsPaidType.approval) {
          return text || '--';
        }
        // CODE审批类
        if (record.type === WalletBillsPaidType.code) {
          return dot.get(record, 'qoa_order_info.belong_month', '--');
        }
        return '--';
      },
    },
    {
      title: '审批流',
      dataIndex: ['application_order_info', 'flow_info', 'name'],
      render: (text, record) => {
        // 审批流
        if (record.type === WalletBillsPaidType.approval) {
          return text || '--';
        }
        // CODE审批类
        if (record.type === WalletBillsPaidType.code) {
          return dot.get(record, 'qoa_order_info.flow_info.name', undefined) || '--';
        }
        return '--';
      },
    },
    {
      title: '审批类型',
      dataIndex: ['application_order_info', 'application_order_type'],
      render: (text, record) => {
        // 审批流
        if (record.type === WalletBillsPaidType.approval) {
          return text ? OaApplicationOrderType.description(text) : '--';
        }
        // CODE审批类
        if (record.type === WalletBillsPaidType.code) {
          return dot.get(record, 'qoa_order_info.cost_center_type', undefined) ?
            CodeCostCenterType.description(dot.get(record, 'qoa_order_info.cost_center_type')) : '--';
        }
        return '--';
      },
    },
    {
      title: '流程状态',
      dataIndex: ['application_order_info', 'state'],
      render: (text, record) => {
        // 审批流
        if (record.type === WalletBillsPaidType.approval) {
          return text ? ExpenseExamineOrderProcessState.description(text) : '--';
        }
        // CODE审批类
        if (record.type === WalletBillsPaidType.code) {
          return dot.get(record, 'qoa_order_info.state', undefined) ?
          ExpenseExamineOrderProcessState.description(dot.get(record, 'qoa_order_info.state')) : '--';
        }
        return '--';
      },
    },
    {
      title: '当前节点',
      dataIndex: ['application_order_info', 'current_flow_node_info', 'name'],
      render: (text, record) => {
        // 审批流
        if (record.type === WalletBillsPaidType.approval) {
          return text || '--';
        }
        // CODE审批类
        if (record.type === WalletBillsPaidType.code) {
          return dot.get(record, 'qoa_order_info.current_node.name', undefined) || '--';
        }
        return '--';
      },
    },
    {
      title: '验票状态',
      dataIndex: ['application_order_info', 'inspect_bill_state'],
      render: (text, record) => {
        // 审批流
        if (record.type === WalletBillsPaidType.approval) {
          return text ? ExpenseTicketState.description(text) : '--';
        }
        // CODE审批类
        if (record.type === WalletBillsPaidType.code) {
          return dot.get(record, 'qoa_order_info.inspect_bill_state', undefined) ?
            CodeTicketState.description(dot.get(record, 'qoa_order_info.inspect_bill_state', undefined)) : '--';
        }
        return '--';
      },
    },
    {
      title: '账单状态',
      dataIndex: 'state',
      width: 80,
      fixed: 'right',
      render: text => (text ? WalletBillsPaidState.description(text) : '--'),
    },
    {
      title: '操作',
      dataIndex: '_id',
      width: 100,
      fixed: 'right',
      render: (id, rec) => {
        const { state, unpaid_money: unpaidMoney = 0 } = rec;
        const detailUrl = `/#/Wallet/Bills/Detail?id=${id}`;
        return (
          <div>
            {
              Operate.canOperateWalletBillsPay()
                && state !== WalletBillsPaidState.done
                && state !== WalletBillsPaidState.void
                && unpaidMoney !== 0
                ? <a onClick={() => onBill(rec)}>付款</a> : ''
            }
            {
              Operate.canOperateWalletBillsDetail()
                ? (
                  <a
                    href={detailUrl}
                    style={{ marginLeft: 10 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >查看详情</a>
                ) : ''
            }
            {
              Operate.canOperateWalletBillsPay()
                && state === WalletBillsPaidState.toBePaid
                ? (
                  <Popconfirm
                    title="确认作废当前账单？"
                    onConfirm={() => onVoid(id)}
                  >
                    <a style={{ marginLeft: 10 }}>作废</a>
                  </Popconfirm>
                ) : ''
            }
          </div>
        );
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

  // rowSelection
  const rowSelection = {
    selectedRowKeys,
    onChange: setTabKey,
    columnWidth: 50,
    getCheckboxProps: (row) => {
      const { state, unpaid_money: unpaidMoney = 0 } = row;
      return {
        disabled: (
          state === WalletBillsPaidState.done
          || state === WalletBillsPaidState.void
          || (
            state === WalletBillsPaidState.payOngoing
            && unpaidMoney === 0
          )
        ),
      };
    },
  };

  // table title operate
  const title = Operate.canOperateWalletBillsPay() ? (
    <Button
      type="primary"
      disabled={selectedRowKeys.length < 2}
      onClick={() => setBatchPayVis(true)}
    >批量付款</Button>
  ) : '';

  return (
    <CoreContent title={title} isShowIcon>
      <Table
        rowKey={(re, key) => re._id || key}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        rowSelection={rowSelection}
        bordered
        scroll={{ x: 2200, y: 500 }}
      />
      {renderSinglePayModal()}
      {renderBatchPayModal()}
      {renderPaymentStateModal()}
    </CoreContent>
  );
};

export default Content;
