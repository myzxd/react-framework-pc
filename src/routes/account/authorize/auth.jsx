/**
 * 多账号登录
 */
import is from 'is_js';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message, Tooltip, Spin } from 'antd';
import { authorize } from '../../../application';
import styles from './style/auth.less';

const FormItem = Form.Item;

function Auth(props) {
  const [exchangeAccounts] = useState(authorize.account.exchangeAccounts || []);
  const [selectedAccount, setSelectedAccount] = useState(null); // 当前选中账号
  const [loading, setLoading] = useState(true);


  // loading
  const onLoading = () => {
    setLoading(false);
  };

  // 选择服务商，使用账号进行登陆
  const onSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = props;
    // 判断账户是否选择
    const accountId = selectedAccount.id;
    if (is.not.existy(accountId) || is.not.string(accountId)) {
      message.info('请选择要登陆的账户');
      return;
    }

    // 获取账户授权
    dispatch({ type: 'authorizeManage/exchangeAuthorize', payload: { accountId } });
  };

  // 选择账号
  const onSelectAccount = (account) => {
    setSelectedAccount(account);
  };

   // 重置授权，返回登陆界面
  const onAuthClear = () => {
    authorize.clear();

    // 跳转到登陆页
    setTimeout(() => { window.location.href = '/#/authorize/login'; }, 500);
  };

  useEffect(() => {
    // 刷新账户信息和授权信息
    props.dispatch({
      type: 'authorizeManage/refreashAuthorize',
      payload: {
        onLoading,
        isReload: false,
      } });
  }, []);


  // 渲染多账号
  const renderAccountsComponent = () => {
    // loading
    if (loading === true) {
      return (
        <Spin />
      );
    }
    const accountsList = [];
    // 获取该账号下的相关账号
    exchangeAccounts.forEach((account, index) => {
      const key = account.id + index;
      const roleNames = account.roleNames || [];
      const TooltipTitle = roleNames.join(', ');
      const title = (
        <div className={styles['app-comp-account-auth-title']}>
          <span className={styles['app-comp-account-auth-title-name']}>{account.name}</span>
          <Tooltip title={TooltipTitle} placement="right" >
            <InfoCircleOutlined />
          </Tooltip>
        </div>
      );

      if (selectedAccount === account.id) {
        accountsList.push(
          <div key={key}>
            <Button className={styles['app-comp-account-auth-select-btn']} onClick={() => { onSelectAccount(account); }} icon={<CheckCircleOutlined />}>{title}</Button>
          </div>,
        );
      } else {
        accountsList.push(
          <div key={key}>
            <Button className={styles['app-comp-account-auth-select-btn']} onClick={() => { onSelectAccount(account); }}>{title}</Button>
          </div>,
          );
      }
    });

    return (
      <div className={styles['app-comp-account-auth-account-list']}>
        {accountsList}
      </div>
    );
  };


  return (
    <Form className={styles['app-comp-account-auth-form']} onSubmit={onSubmit}>
      <FormItem >
        <h2> 选择账户 </h2>
        <div className={styles['app-comp-account-auth-title']}>当前手机号对应多个账号，请选择此次登录账号</div>
        {/* 渲染账户列表 */}
        {renderAccountsComponent()}
      </FormItem>
      <FormItem>
        <Button className={styles['app-comp-account-auth-operate-enter']} type="primary" htmlType="submit">进入账户</Button>
        <div>
          <Button className={styles['app-comp-account-auth-operate-relogin']} onClick={() => { onAuthClear(); }}>重新登陆</Button>
        </div>
      </FormItem>
    </Form>
  );
}

const mapStateToProps = ({ login }) => {
  return { login };
};

export default connect(mapStateToProps)(Form.create()(Auth));
