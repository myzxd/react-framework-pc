/**
 * 趣活钱包 - 支付账单 - 付款弹窗（批量付款）
 */
import React from 'react';
import {
  Modal,
  Table,
  Tooltip,
  Button,
} from 'antd';
import {
  Unit,
} from '../../../../../application/define';
import style from '../../style.less';

const BatchPay = ({
  visible,
  onCancel,
  billIds = [], // 付款单id list
  data = [], // 所有账单信息
  dispatch,
}) => {
  const dataSource = data.filter(i => billIds.find(a => a === i._id));

  // onOk
  const onOk = async () => {
    const res = await dispatch({
      type: 'wallet/onPayBill',
      payload: { billIds },
    });

    if (res && res.ok) {
      onCancel && onCancel(res);
    }
  };

  // 渲染标签
  const renderTags = (tagsList) => {
    // 标签数据大于三个
    if (Array.isArray(tagsList) && tagsList.length > 3) {
      return (
        <Tooltip title={tagsList.map(t => t).join(' 、 ')}>
          <div>{tagsList.slice(0, 3).map(t => t).join(' 、 ')}</div>
        </Tooltip>
      );
    }

    // 标签数据小于三个
    if (Array.isArray(tagsList) && tagsList.length <= 3 && tagsList.length > 0) {
      return <div>{tagsList.map(t => t).join('、')}</div>;
    }

    return '--';
  };

  // columns
  const columns = [
    {
      title: '账单编号',
      dataIndex: '_id',
      width: 120,
    },
    {
      title: '关联审批单号',
      dataIndex: 'ref_id',
      width: 120,
      render: text => (text || '--'),
    },
    {
      title: '审批单提报人',
      dataIndex: ['order_apply_info', 'name'],
      width: 100,
    },
    {
      title: '账单总金额',
      dataIndex: 'total_money',
      width: 100,
      render: text => (text ? Unit.exchangePriceCentToMathFormat(text) : '0.00'),
    },
    {
      title: '账单待付款金额',
      dataIndex: 'unpaid_money',
      width: 100,
      render: (text) => {
        if (text) {
          return (
            <div
              className={style['wallet-bill-batch-pay-money']}
            >
              {Unit.exchangePriceCentToMathFormat(text)}
            </div>
          );
        }
        return <div className={style['wallet-bill-batch-pay-money']}>0.00</div>;
      },
    },
    {
      title: '主题标签',
      dataIndex: ['application_order_info', 'theme_label_list'],
      width: 100,
      render: text => renderTags(text),
    },
  ];

  // footer
  const renderFooter = () => {
    // 合计金额
    const totalMoney = dataSource.reduce((ac, cr) => (ac + cr.unpaid_money), 0);

    return (
      <div className={style['wallet-bill-batch-pay-footer']}>
        <div
          className={style['wallet-bill-batch-pay-footer-title']}
        >
          付款合计金额：
          <span className={style['wallet-bill-batch-pay-footer-money']}>
            ￥{Unit.exchangePriceCentToMathFormat(totalMoney)}
          </span>
        </div>
        <div>
          <Button onClick={() => onCancel()}>取消</Button>
          <Button onClick={() => onOk()} type="primary">确定</Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title="确认付款信息"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={710}
      footer={renderFooter()}
    >
      <Table
        rowKey={(re, key) => re._id || key}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        scroll={{ y: 300 }}
      />
    </Modal>
  );
};

export default BatchPay;
