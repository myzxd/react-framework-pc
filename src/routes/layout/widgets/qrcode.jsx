/**
 * 点击展示二维码组件
 * api: 见文章 https://lai.yuweining.cn/archives/2225/
 */
import is from 'is_js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { QrcodeOutlined } from '@ant-design/icons';
import { Popover, Spin, Tabs } from 'antd';

import style from './style.css';

const { TabPane } = Tabs;
// 搜狐二维码api
const qrCodeApi = 'https://qrcode.jp/qr?q=';

class QrCodePop extends Component {
  static propTypes = {
    qrStr: PropTypes.string,
    qcStr: PropTypes.string,
    qlStr: PropTypes.string,
    onShow: PropTypes.func,
  };

  static defaultProps = {
    qrStr: '',
    qcStr: '',
    qlStr: '',
    onShow: () => {},
  };

  // 显隐改变的回调
  onVisibleChange = (visible) => {
    const { onShow } = this.props;
    if (!visible || !is.function(onShow)) {
      return;
    }
    onShow();
  };

  render = () => {
    const { qrStr, qcStr, qlStr } = this.props;
    const footerQr = '以上为BOSS骑士（Android版），请使用浏览器扫码下载';
    const footerQc = '以上为BOSS当家（Android版），请使用浏览器扫码下载';
    const footerQl = '以上为BOSS之家（Android版），请使用浏览器扫码下载';
    const content = (
      <div className={style['app-comp-layout-tabWrap']}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="BOSS骑士下载" key="1">
            <div className={style['app-layout-qrcode-wrap']}>
              {
                qrStr
                  ? <img src={qrCodeApi + qrStr} alt="BOSS骑士二维码" className={style['app-layout-qrcode-img']} />
                  : <Spin />
              }
              <a className={style['app-layout-qrcode-download']} href={qrStr} target={'_blank'}>{qrStr}</a>
              <div>{footerQr}</div>
            </div>
          </TabPane>
          <TabPane tab="BOSS当家下载" key="2">
            <div className={style['app-layout-qrcode-wrap']}>
              {
                qcStr
                  ? <img src={qrCodeApi + qcStr} alt="BOSS当家二维码" className={style['app-layout-qrcode-img']} />
                  : <Spin />
              }
              <a className={style['app-layout-qrcode-download']} href={qcStr} target={'_blank'}>{qcStr}</a>
              <div>{footerQc}</div>
            </div>
          </TabPane>
          <TabPane tab="BOSS之家下载" key="3">
            <div className={style['app-layout-qrcode-wrap']}>
              {
                qlStr
                  ? <img src={qrCodeApi + qlStr} alt="BOSS之家二维码" className={style['app-layout-qrcode-img']} />
                  : <Spin />
              }
              <a className={style['app-layout-qrcode-download']} href={qlStr} target={'_blank'}>{qlStr}</a>
              <div>{footerQl}</div>
            </div>
          </TabPane>
        </Tabs>

      </div>
    );


    return (
      <Popover content={content} trigger="click" onVisibleChange={this.onVisibleChange}>
        <QrcodeOutlined />
      </Popover>
    );
  };
}


// 上一版 module.exports = QrCodePop;
export default QrCodePop;
