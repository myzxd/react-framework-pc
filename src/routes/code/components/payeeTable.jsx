/**
 * 付款明细 - 表格
 */
import dot from 'dot-prop';
import React from 'react';
import { Table, Radio } from 'antd';


import { CoreContent } from '../../../components/core';
import { ExpenseCollectionType, Unit } from '../../../application/define';

function PayeeTable(props) {
  // 金额合计
  const renderMoney = () => {
    const { money, isPluginOrder, pluginMoney } = props;
    return (
      <div style={{ textAlign: 'center', margin: '5px 0' }}>
        {
          isPluginOrder !== true ?
            `金额合计 ${Unit.exchangePriceCentToMathFormat(money)} 元` :
            `金额合计 ${Unit.exchangePriceCentToMathFormat(pluginMoney)} 元`
        }
      </div>
    );
  };
  // 渲染表单
  const renderTable = () => {
    const { isDetail, isPaymentNode, isPluginOrder } = props;
    const dataSource = dot.get(props, 'dataSource', []);
    const columns = [
      {
        title: '收款人',
        dataIndex: 'card_name',
        key: 'card_name',
        render: (text, record) => {
          if (text) {
            return `${text} ${record.card_phone ? `(${record.card_phone})` : ''}`;
          }
          return '--';
        },
      },
      {
        title: '银行卡号',
        dataIndex: 'card_num',
        key: 'card_num',
        render: text => text || '--',
      },
      {
        title: '开户支行',
        dataIndex: 'bank_details',
        key: 'bank_details',
        render: text => text || '--',
      },
      {
        title: '金额（元）',
        dataIndex: 'money',
        key: 'money',
        render: text => (text >= 0 ? Unit.exchangePriceCentToMathFormat(text) : '--'),
      },
      {
        title: `${isDetail || isPaymentNode ? '收款方式' : '付款方式'}`,
        dataIndex: 'payee_type',
        key: 'payee_type',
        render: (text, record) => {
          // 付款节点，并不是外部审批单
          if (isPaymentNode && isPluginOrder !== true) {
            const item = dot.get(props, 'dataSource', []).filter(v => v._id === record._id);
            const value = item[0].payee_type || undefined;
            return (
              <Radio.Group
                value={value}
                onChange={(e) => {
                  if (props.onChangepayeeList) {
                    props.onChangepayeeList(e, record._id);
                  }
                }}
              >
                <Radio value={ExpenseCollectionType.onlineBanking}>{ExpenseCollectionType.description(ExpenseCollectionType.onlineBanking)}</Radio>
                <Radio
                  disabled={!record.payee_employee_id}
                  value={ExpenseCollectionType.wallet}
                >{ExpenseCollectionType.description(ExpenseCollectionType.wallet)}</Radio>
              </Radio.Group>
            );
          }
          return ExpenseCollectionType.description(text);
        },
      },
    ];

    return (
      <CoreContent title={isDetail || isPaymentNode ? '付款明细' : '支付信息'}>
        {/* 渲染金额合计 */}
        {
          isDetail ? renderMoney() : null
        }
        <Table
          bordered
          columns={columns}
          pagination={false}
          dataSource={dataSource}
          rowKey={record => record._id}
          scroll={{ y: 400 }}
        />
        {/* 渲染金额合计 */}
        {isPaymentNode ? renderMoney() : null}
      </CoreContent>
    );
  };

  return (
    <React.Fragment>
      {/* 渲染表格 */}
      {renderTable()}
    </React.Fragment>
  );
}

export default PayeeTable;
