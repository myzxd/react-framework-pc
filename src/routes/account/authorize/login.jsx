/**
 * 登录业务组件
 **/
 import React, { useEffect, useState } from 'react';
 import { connect } from 'dva';
 import { CloseCircleOutlined } from '@ant-design/icons';
 import { Form } from '@ant-design/compatible';
 import '@ant-design/compatible/assets/index.css';
 import { Button, Input, Row, Col } from 'antd';
 import styles from './style/login.less';
 import logoNew from './static/logoNew.png';
 import logoOld from './static/logo.png';
 import xingdaLogo from './static/xingdalogo@2x.png';
 import huiLiuLogo from './static/huiliuico2.jpg';
 import { asyncValidatePhoneNumber } from '../../../application/utils';
 
 const FormItem = Form.Item;
 function Login(props) {
   // 是否第一次点击获取验证码
   const [firstGetCode, setFirstGetCode] = useState(true);
   // 倒计时
   const [count, setCount] = useState(60);
   // 清除按钮状态
   const [closeState, setCloseState] = useState(false);
   const privates = {
     timer: null,       // 保存计时器
   };
 
   useEffect(() => {
     // 组件卸载时清除计时器
     return () => {
        // 清除计时器
       clearInterval(privates.timer);
     };
   }, []);
 
 
    // 渲染趣活logo或者嗷嗷BOSS logo
   const renderLogo = () => {
     if (window?.application?.config?.isShowQuhuoLogo) {
       return (
         <div>
           <div className={styles['app-comp-account-logo-box']}>
             <img src={logoNew} alt="" className={styles['app-comp-account-logo-new']} />
           </div>
           <div id={styles['app-comp-account-title']}>
             <div className="app-global-text-center">
               <span className={styles['app-comp-account-line']} />
               <p> <span className={styles['app-comp-account-logo-add-wrap']}>Quhuo<span className={styles['app-comp-account-logo-add']}>+</span></span></p>
               <span className={styles['app-comp-account-line']} />
             </div>
           </div>
         </div>
       );
     } else if (window?.application?.config?.isShowXingDaLogo) {
       return (
         <div>
           <div className={styles['app-comp-account-logo-box']}>
             <img src={xingdaLogo} alt="" className={styles['app-comp-account-logo-xingda']} />
           </div>
           <div id={styles['app-comp-account-title']}>
             <div className="app-global-text-center">
               <span className={styles['app-comp-account-line']} />
               <p>兴达科技</p>
               <span className={styles['app-comp-account-line']} />
             </div>
           </div>
         </div>
       );
     } else if (window?.application?.config?.isShowHuiLiuLogo) {
       return (
         <div>
           <div className={styles['app-comp-account-logo-box']}>
             <img src={huiLiuLogo} alt="" className={styles['app-comp-account-logo-xingda']} />
           </div>
           <div id={styles['app-comp-account-title']}>
             <div className="app-global-text-center">
               <span className={styles['app-comp-account-line']} />
               <p>HuiLiu</p>
               <span className={styles['app-comp-account-line']} />
             </div>
           </div>
         </div>
       );
     } else {
       return (
         <div>
           <div className={styles['app-comp-account-logo-box']}>
             <img src={logoOld} alt="" className={styles['app-comp-account-logo-old']} />
           </div>
           <div id={styles['app-comp-account-title']}>
             <div className="app-global-text-center">
               <span className={styles['app-comp-account-line']} />
               <p>BOSS之家</p>
               <span className={styles['app-comp-account-line']} />
             </div>
           </div>
         </div>
       );
     }
   };
 
   // 清除input数据&隐藏清除按钮
   const onClear = () => {
     const { resetFields } = props.form;
     // 清除手机号和验证码
     resetFields();
     setCloseState(false);
   };
 
   // 聚焦 显示清除按钮
   const onCloseFocus = () => {
     setCloseState(true);
   };
 
   // 倒计时
   const onChangeCountdown = () => {
     // 60s倒计时
     let total = 60;
     // 清除计时器
     clearInterval(privates.timer);
 
     privates.timer = setInterval(() => {
       total -= 1;
       setCount(total);
       if (total === 0) {
         // 倒计时结束
         clearInterval(privates.timer);
       }
     }, 1000);
   };
 
   // 登录
   const onSubmit = () => {
     const { dispatch } = props;
     const { getFieldsValue, validateFields } = props.form;
     validateFields((error) => {
       if (!error) {
         const data = getFieldsValue();
         dispatch({
           type: 'authorizeManage/fetchAuthorize',
           payload: {
             phone: data.phone,
             verify_code: data.verifyCode,
           },
         });
       }
     });
   };
 
   // 获取验证码
   const onSendVerifyCode = () => {
     const { dispatch } = props;
     const { getFieldsValue, validateFields } = props.form;
     validateFields(['phone'], (error) => {
       if (!error) {
         const value = getFieldsValue();
         setFirstGetCode(false); // 点击获取验证码后，制否，显示重新获取验证码
          // 倒计时
         onChangeCountdown();
         dispatch({ type: 'authorizeManage/fetchVerifyCode', payload: { phone: value.phone } });
       }
     });
   };
 
   const { getFieldDecorator } = props.form;
 
   return (
     <Form>
 
       {/* 渲染趣活logo或者嗷嗷BOSS logo*/}
       {renderLogo()}
 
       <FormItem className={styles['app-comp-account-input']}>
         {getFieldDecorator('phone', {
           rules: [{
             required: true,
             trigger: 'onBlur',
             validateTrigger: 'onFous',
             validator: asyncValidatePhoneNumber,
           }],
         })(
           <Input
             size="large"
             placeholder="请输入手机号"
             suffix={(closeState && <div onClick={onClear} ><CloseCircleOutlined /></div>) || <span />}
             onFocus={onCloseFocus}
           />,
         )}
       </FormItem>
       <Row className={styles['app-comp-account-input']}>
         <Col sm={15}>
           <FormItem>
             {getFieldDecorator('verifyCode', {
               rules: [{ required: true, message: '您输入的验证码有误,请重新输入！' }],
             })(
               <Input size="large" placeholder="请输入验证码" />,
             )}
           </FormItem>
         </Col>
         <Col sm={1} />
         <Col sm={8}>
           <FormItem>
             {
               firstGetCode ?
                 <Button className={styles['app-comp-account-bar-code']} onClick={onSendVerifyCode}>获取验证码</Button>
                 :
                 count === 0 ?
                   // 重发验证码
                   <Button className={styles['app-comp-account-bar-code']} onClick={onSendVerifyCode}>重发验证码</Button>
                   :
                   // 倒计时
                   <Button className={styles['app-comp-account-bar-code']} disabled>{count}s</Button>
             }
           </FormItem>
         </Col>
       </Row>
       <FormItem>
         <Button type="primary" className={`${styles['app-comp-account-input']} ${styles['app-comp-account-login-btn']}`} onClick={onSubmit}>
           <span>登录</span>
         </Button>
       </FormItem>
     </Form>
   );
 }
 
 export default connect()(Form.create()(Login));