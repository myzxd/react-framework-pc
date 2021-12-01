/**
 * code - 付款审批 - 通用模版 - 详情
 */
import dot from 'dot-prop';
import React from 'react';
import { Form, Row, Col } from 'antd';
import {
  CheckCircleOutlined,
} from '@ant-design/icons';

import { CoreContent, CoreForm } from '../../../../components/core';
import { Unit, ExpenseCollectionType, CodeSubmitType } from '../../../../application/define';
import PageUpload from '../../components/upload';


function ComponentCostItemDetail(props) {
  const { detail, costCenterType } = props;

  // 渲染表单
  const renderContent = () => {
    const formItems = [
      <Form.Item
        label="科目"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        {dot.get(detail, 'biz_account_info.name', '--')}
        {dot.get(detail, 'biz_account_info.ac_code', undefined) ?
          `(${dot.get(detail, 'biz_account_info.ac_code', undefined)})` : null}
      </Form.Item>,
      <Form.Item
        label="核算中心"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        {
          costCenterType === CodeSubmitType.code ?
          dot.get(detail, 'biz_code_info.name', '--') :
          dot.get(detail, 'biz_team_info.name', '--')
        }
      </Form.Item>,
      {
        span: 12,
        render: (
          <Form.Item
            label="发票抬头"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {dot.get(detail, 'invoice_title', '--')}
          </Form.Item>
        ),
      },
      {
        span: 12,
        render: (
          <Form.Item
            label="金额"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {
               Unit.exchangePriceCentToMathFormat(dot.get(detail, 'total_money', 0))
            }
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="事由说明"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{dot.get(detail, 'note', '--')}</div>
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="上传附件"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            <PageUpload
              displayMode
              value={PageUpload.getInitialValue(detail, 'attachment_private_urls')}
            />
          </Form.Item>
        ),
      },
    ];

    return (
      <CoreForm items={formItems} cols={2} />
    );
  };

  // 计算金额
  const renderCalculationMoney = () => {
    const totalMoney = Unit.exchangePriceToYuan(dot.get(detail, 'total_money', 0)).toFixed(2);
    const bankList = dot.get(detail, 'payee_list', []);
    // 金额汇总
    const bankMoneys = bankList.map(v => Unit.exchangePriceToYuan(v.money));
    // 金额之和
    let moneys = 0;
    if (bankMoneys.length > 0) {
      moneys = bankMoneys.reduce((a, b) => a + b).toFixed(2);
    }
    // 差额
    const calculationMoney = Number(totalMoney - moneys).toFixed(2);
    return (
      <div style={{ textAlign: 'right' }}>
        <span>费用总金额：{Unit.exchangePriceToMathFormat(totalMoney)}元</span>
        <span style={{ marginLeft: 20 }}>当前合计金额：{Unit.exchangePriceToMathFormat(moneys)}元</span>
        {
          Number(calculationMoney) === 0 ? (
            <CheckCircleOutlined
              style={{ marginLeft: 20, color: '#52c41a' }}
            />) : (
              <span style={{ marginLeft: 20 }}>差额：<span
                style={{ color: 'red' }}
              >{Unit.exchangePriceToMathFormat(calculationMoney)}</span> 元</span>
          )
        }
      </div>
    );
  };

  // 支付明细
  const renderPayeeInfo = () => {
    const payeeList = dot.get(detail, 'payee_list', []); // 支付明细
    return (
      <CoreContent
        title="支付明细"
        color="rgba(255, 119, 0, 0.5)"
        style={{
          backgroundColor: 'rgba(255, 226, 200, 0.15)',
        }}
      >
        {
          payeeList.map((v, i) => {
            return (
              <Row key={i}>
                <Col span={8}>
                  <Form.Item
                    label="收款人"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {dot.get(v, 'card_name', '--')}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="手机号"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {dot.get(v, 'card_phone', '--')}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="收款方式"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {ExpenseCollectionType.description(dot.get(v, 'payee_type', '--'))}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="开户支行"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {dot.get(v, 'bank_details', '--')}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="收款账户"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                      {dot.get(v, 'card_num', '--')}</div>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="金额"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {dot.get(v, 'money') >= 0 ? Unit.exchangePriceCentToMathFormat(dot.get(v, 'money')) : '--'}
                  </Form.Item>
                </Col>
              </Row>
            );
          })
        }
        <Form.Item
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
        >
          {renderCalculationMoney()}
        </Form.Item>
      </CoreContent>
    );
  };


  return (
    <div>
      {/* 渲染表单 */}
      {renderContent()}
      {/* 支付明细 */}
      {renderPayeeInfo()}
    </div>
  );
}

export default ComponentCostItemDetail;
