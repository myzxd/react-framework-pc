/**
 * code - 支付明细
*/
import React from 'react';
import { Form } from 'antd';
import {
  CheckCircleOutlined,
} from '@ant-design/icons';

import { CoreContent, CoreForm } from '../../../../components/core';
import { ExpenseCollectionType, Unit } from '../../../../application/define';
import CollectionItem from './collectionItem';

const reg = new RegExp('^[1][3,4,5,6,7,8,9][0-9]{9}$');

function ComponentCollection(props) {
    // 校验金额集合
  const onValidatorBankListMoney = (rule, value, callback) => {
    const totalMoney = Number(props.form.getFieldValue('money') || 0).toFixed(2);
    if (value) {
      value.forEach((v, i) => {
        if (!v.card_name || !v.bank_details || !v.card_num || typeof v.money !== 'number') {
          callback(`第${i + 1}行内容: 收款人，开户支行，收款账户，金额请填写完整`);
          return true;
        }
        if (v.card_phone) {
          if (!reg.test(v.card_phone)) {
            callback(`第${i + 1}行内容: 手机号格式错误`);
            return true;
          }
        }
      });
    }
      // 金额汇总
    const bankMoneys = value.map(item => Number(item.money || 0));
      // 金额之和
    const moneys = bankMoneys.reduce((a, b) => a + b).toFixed(2);
      // 差额
    const calculationMoney = Number(totalMoney - moneys).toFixed(2);
    if (Number(calculationMoney) !== 0) {
      callback('收款信息金额与费用总金额不一致');
      return;
    }
    callback();
  };

  // 渲染内容
  const renderContent = () => {
    const formItems = [
      {
        span: 24,
        render: (
          <Form.Item
            name="bankList"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            rules={[{ validator: onValidatorBankListMoney }]}
            initialValue={[{ payee_type: ExpenseCollectionType.onlineBanking, num: 1 }]}
          >
            <CollectionItem />
          </Form.Item>
        ),
      },
    ];
    return (
      <CoreContent
        title="支付明细"
        color="rgba(255, 119, 0, 0.5)"
        style={{
          backgroundColor: 'rgba(255, 226, 200, 0.15)',
        }}
      >
        <CoreForm items={formItems} />
      </CoreContent>
    );
  };


    // 计算金额
  const renderCalculationMoney = () => {
    const { form = {} } = props;
    const totalMoney = Number(form.getFieldValue('money') || 0).toFixed(2);
    const bankList = form.getFieldValue('bankList') || [];
      // 金额汇总
    const bankMoneys = bankList.map(item => Number(item.money || 0));
      // 金额之和
    let moneys = 0;
    if (bankMoneys.length > 0) {
      moneys = bankMoneys.reduce((a, b) => a + b).toFixed(2);
    }
      // 差额
    const calculationMoney = Number(totalMoney - moneys).toFixed(2);
    return (
      <div style={{ textAlign: 'center' }}>
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

  return (
    <React.Fragment>
      {/* 渲染内容 */}
      {renderContent()}
      <Form.Item
        shouldUpdate={
          (prevValues, curValues) => (
            prevValues.money !== curValues.money ||
            prevValues.bankList !== curValues.bankList
          )
      }
      >
        {() => renderCalculationMoney()}
      </Form.Item>
    </React.Fragment>
  );
}

export default ComponentCollection;
