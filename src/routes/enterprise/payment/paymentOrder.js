/**
 *  新增付款单
 */
 import is from 'is_js';
 import React, { useState } from 'react';
 import { connect } from 'dva';
 import { Form } from '@ant-design/compatible';
 import '@ant-design/compatible/assets/index.css';
 import { Input, InputNumber, Row, Button, Col, message, Spin} from 'antd';
 
 import { DeprecatedCoreForm } from '../../../components/core';
 import { Unit } from '../../../application/define';
 import PaymentMember from './add';
 import styles from './style.less';
 
 const { TextArea } = Input;
 
 const PaymentOrder = (props = {}) => {
   const {
     form = {},
     dispatch,
   } = props;
 
   // 加载明细时的loading
   const [isShow, setIsShow] = useState(false);
 
   // 校验付款单明细
   const onCheckPaymentValueLines = (data = []) => {
     // 判断格式是否错误
     if (is.not.array(data)) {
       return message.error('付款单明细的数据格式错误');
     }
     let flag = false;
     if (is.not.existy(data) || is.empty(data)) {
       return true;
     }
       // 遍历数据中
     data.forEach((item) => {
         // 判断是否为空
       if (is.empty(item)) {
         flag = true;
         return;
       }
       // 如果没有填写姓名或者金额也算是明细没填写完整
       if (!item.money || !item.name) {
         flag = true;
         return true;
       }
       // 遍历数据中的子项
       Object.keys(item).forEach((key) => {
           // 判断数据是否为空
         if (is.not.existy(item[key]) || is.empty(item[key])) {
           flag = true;
           return true;
         }
       });
     });
     return flag;
   };
 
   // 提交
   const onSubmit = (e) => {
     e.preventDefault();
     form.validateFieldsAndScroll((err, values) => {
       if (!err) {
         const detailArray = values.detailArray.map((v) => {
           delete v.temp_id;
           return { ...v };
         });
         // 校验付款明细
         const flag = onCheckPaymentValueLines(detailArray);
         if (is.not.empty(detailArray[0]) && flag === true) {
           return message.error('付款单明细请填写完整或移除不完整项');
         }
         if (values.totalMoney === 0) {
           return message.error('费用总计金额不能为0');
         }
         // 金额汇总
         const detailMoneys = detailArray.map(v => v.money);
         const total = detailMoneys.reduce((a, b) => a + b);
         if (total !== values.totalMoney) {
           return message.error('明细中的付款金额总值和费用总计金额值不一致，请重新输入！');
         }
         const params = { ...values };
         dispatch({ type: 'enterprisePayment/createPayment', payload: params });
       }
     });
   };
 
 
   // 渲染表单
   const renderCreateForm = () => {
     const { getFieldDecorator } = form;
 
     const formItems = [
       {
         label: '费用总计',
         form: getFieldDecorator('totalMoney', { rules: [{ required: true, message: '请输入费用总计' }] })(
           <InputNumber
             className={styles.bossPaymentOrderSumInput}
             placeholder="请输入费用总计"
             step={0.01}
             min={0}
             formatter={Unit.limitDecimals}
             parser={Unit.limitDecimals}
           />,
         ),
       }, {
         label: '款项说明：',
         form: getFieldDecorator('note', { rules: [{ required: true, message: '请输入款项说明' }] })(
           <TextArea rows={8} />,
         ),
       },
     ];
 
     const layout = { labelCol: { span: 8 }, wrapperCol: { span: 8 } };
     return (
       <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
     );
   };
 
   const changeShow = (val) => {
     setIsShow(val);
   };

   // 渲染新增的明细
   const renderDetail = () => {
     const { getFieldDecorator } = form;
     return (
       <Form.Item >
         {getFieldDecorator('detailArray', {
           initialValue: [],
         })(<PaymentMember changeShow={changeShow} />)}
       </Form.Item>
     );
   };

   // 渲染取消与提交
   const renderFooter = () => {
     return (
       <Row className={styles.bossPaymentOrderFooterWrap}>
         <Col span={8} offset={8} className={styles.bossPaymentOrderFooterItem}>
           <Button className={styles.bossPaymentOrderFooterCancel} onClick={() => { window.location.href = '#/Enterprise/Payment'; }}>取消</Button>
           <Button type="primary" htmlType="submit" >提交</Button>
         </Col>
       </Row>
     );
   };
 
     const winHeight = `${window.innerHeight}px`;
     const isShows = isShow ? 'block' : 'none';
     return (
       <div>
         <div style={{ display: isShows, width: '100%', height: winHeight, position: 'absolute', zIndex: '9999' }}>
           <div className={styles.bossPaymentOrderSpinWrap}>
             <Spin tip="数据导入中..." size="large" />
           </div>
         </div>
         <form onSubmit={onSubmit}>
           {renderCreateForm()}
           {/* 渲染导入Excel、新增明细 */}
           {renderDetail()}
           {/* 取消与提交按钮 */}
           {renderFooter()}
         </form>
       </div>
     );
   };
 
 export default connect()(Form.create()(PaymentOrder));
 