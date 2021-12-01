/**
 * logo组件
 */

import React from 'react';
import headerLogo from './static/navLogo@2x.png';
import xingDaLogo from './static/xingda.png';
import huiLiuLogo from './static/huiliuico.png';
import logoOld from './static/logoOld.jpg';
import styles from './index.css';

export default function Logo() {
  if (window.application.config.isShowQuhuoLogo) {
    return (
      <div className={styles['app-layout-sider-logo']}>
        <img src={headerLogo} alt="趣活科技" className={styles['app-layout-sider-logo-quhuo']} />
      </div>
    );
  } else if (window.application.config.isShowXingDaLogo) {
    return (
      <div className={styles['app-layout-sider-xingda']}>
        <img src={xingDaLogo} alt="兴达科技" className={styles['app-layout-sider-xingda-logo']} />
      </div>
    );
  } else if (window.application.config.isShowHuiLiuLogo) {
    return (
      <div className={styles['app-layout-sider-xingda']}>
        <img src={huiLiuLogo} alt="汇流科技" className={styles['app-layout-sider-xingda-logo']} />
      </div>
    );
  } else {
    return (
      <div className={styles['app-layout-sider-logo']}>
        <img src={logoOld} alt="趣活科技" className={styles['app-layout-sider-logo-aoao']} />
      </div>
    );
  }
}
