/**
 * 404 错误页面
 * */
import React from 'react';
import { Button } from 'antd';
import styles from './index.css';

function Error() {
  return (
    <div>
      <div className={styles['app-layout-error-box']}>
        <div className={styles['app-error-wrapper']}>
          <div className={styles['app-error-pin']} />
          <div className={styles['app-error-code']}> 错误 <span>404</span></div>
          <p>您没有权限查看此页面</p>
          <p>请刷新页面或者 &nbsp;<Button type="primary"><a href="/#/Code/Home">返回</a></Button></p>
        </div>
      </div>
    </div>
  );
}
export default Error;
