/**
 *  付款单详情页 /  确认执行付款页
 */
import React, { useState, useEffect } from 'react';
import { Table, Button, Col, Row } from 'antd';
import { connect } from 'dva';
import dot from 'dot-prop';

import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import Operate from '../../../application/define/operate';
import { EnterprisePaymentState, Unit } from '../../../application/define';
import styles from './style.less';


const Detail = (props = {}) => {
  const {
    paymentDetailList = {},
    paymentDetail = {},
    fetchDataSource = () => { },
    location,
    fetchPaymentDetail = () => { },
    fetchPaymentApprove = () => { },
  } = props;
  // 订单id
  const orderId = location.query.id;

  // 分页值
  const [searchParams, setSearchParams] = useState({ page: 1, limit: 30 });

  // 列表数据请求
  useEffect(() => {
    const params = {
      meta: searchParams,
      order_id: orderId,
    };
    fetchDataSource(params);
  }, [fetchDataSource, searchParams, orderId]);

  // 详情数据请求
  useEffect(() => {
    const params = {
      order_id: orderId,
    };
    fetchPaymentDetail(params);
  }, [fetchPaymentDetail, orderId]);


  // 改变每页展示条数
  const onShowSizeChange = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
  };

  // 修改分页
  const onChangePage = (page, limit) => {
    setSearchParams({ ...searchParams, page, limit });
  };

  // 确认执行
  const onApprove = () => {
    const { _id } = paymentDetail;
    const payload = {
      order_id: _id,
    };
    fetchPaymentApprove(payload);
  };
  //  取消执行
  const onCancel = () => {
    window.location.href = '#/Enterprise/Payment';
  };

  // 渲染列表内容
  const renderContent = () => {
    const { page, limit } = searchParams;
    const dataSource = dot.get(paymentDetailList, 'data', []);
    const dataTotal = dot.get(paymentDetailList, '_meta.result_count', 0);
    // tabel列表
    const columns = [{
      title: '人员ID',
      dataIndex: 'owner_id',
      key: 'owner_id',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '收款对象',
      dataIndex: ['owner_info', 'name'],
      key: 'owner_info.name',
      render: (text) => {
        return text || '--';
      },
    }, {
      title: '付款金额',
      dataIndex: 'money',
      key: 'money',
      render: (text) => {
        return text ? Unit.exchangePriceCentToMathFormat(text) : '--';
      },
    }, {
      title: '身份证号',
      dataIndex: ['owner_info', 'identity_card_id'],
      key: 'identity_card_id',
      render: (text) => {
        return text || '--';
      },
    }];

    // 分页配置
    const pagination = {
      current: page,
      pageSize: limit,                         // 每页条数
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: limit,                     // 默认下拉页数
      onShowSizeChange, // 展示每页数据
      showTotal: total => `总共${total}条`,
      pageSizeOptions: ['10', '20', '30', '40'],
      total: dataTotal,
      onChange: onChangePage,  // 切换分页
    };
    return (
      <div>
        {/* 渲染的内容 */}
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={(record, index) => { return index; }}
          dataSource={dataSource}
        />
      </div>
    );
  };
  // 渲染底部操作按钮
  const renderFooter = () => {
    const { state } = paymentDetail;
    return (
      <Row className={styles.bossDetailFooterWrap}>
        <Col span={8} offset={8} className={styles.bossDetailFooterItem}>
          {
            state === EnterprisePaymentState.pendingPayment && Operate.canOperateEnterprisePaymentUpdate() ?
              (<div>
                <Button className={styles.bossDetailFooterCancel} onClick={onCancel}>取消</Button>
                <Button type="primary" onClick={onApprove} >执行付款</Button>
              </div>)
            :
              <Button onClick={() => { window.location.href = '#/Enterprise/Payment'; }}>返回</Button>
          }
        </Col>
      </Row>
    );
  };

  const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
  const formItems = [
    {
      label: '费用总计：',
      form: paymentDetail.total_money ? `${Unit.exchangePriceToYuan(paymentDetail.total_money)}元` : '--',
    }, {
      label: '款项说明',
      form: paymentDetail.note || '--',
    },
  ];
  return (
    <div>
      {/* 费用信息 */}
      <CoreContent >
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
      {/* 付款单列表 */}
      {renderContent()}
      {/* 底部操作按钮 */}
      {renderFooter()}
    </div>
  );
};

const mapStateToProps = ({ enterprisePayment: { paymentDetail, paymentDetailList = {} } }) => ({
  paymentDetail,
  paymentDetailList,
});

const mapDispatchToProps = dispatch => (
  {
    fetchDataSource: params => dispatch({
      type: 'enterprisePayment/fetchPaymentDetailList',
      payload: params,
    }),
    fetchPaymentDetail: params => dispatch({
      type: 'enterprisePayment/fetchPaymentDetail',
      payload: params,
    }),
    fetchPaymentApprove: params => dispatch({
      type: 'enterprisePayment/fetchPaymentApprove',
      payload: params,
    }),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
