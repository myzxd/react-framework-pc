/**
 * 卡片组件 - 操作按钮组件
 * 未使用
 */
import is from 'is_js';
import React, { Component } from 'react';

import {
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { Row, Col, Popconfirm } from 'antd';
import styles from './style/index.less';

const CardOperate = {
  upload: 1,     // 上传文件
  download: 2,   // 下载文件
  view: 3,       // 查看文件
  none: 4,       // 无款项
  submit: 5,     // 提交
  reject: 6,     // 驳回
  approve: 7,    // 同意
  reupload: 8,   // 重新上传
  reversible: 9, // 无数据取消上传
  template: 10,   // 下载模版
  description(rawValue) {
    switch (rawValue) {
      case this.upload: return '上传文件';
      case this.download: return '下载文件';
      case this.view: return '查看文件';
      case this.none: return '无款项';
      case this.submit: return '提交';
      case this.reject: return '驳回';
      case this.approve: return '同意';
      case this.reupload: return '重新上传';
      case this.reversible: return '无数据';
      case this.template: return '下载模版';
      default: return '--';
    }
  },
};

class CommonCardOperates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operates: props.operates ? props.operates : [],  // 操作
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      operates: nextProps.operates ? nextProps.operates : [],  // 操作
    });
  }

  // 点击事件回调函数
  onClickCallback = (item) => {
    const { tag, operate, callback, data } = item;
    // 上传文件的内置事件
    if (operate === CardOperate.upload || operate === CardOperate.reupload) {
      /* global document eslint 屏蔽*/
      const uploadComponent = document.getElementById(`uploadTask-${tag}`);
      if (uploadComponent !== undefined) {
        uploadComponent.click();
      } else {
        // 如果上传组件初始化失败，则不会进行回调操作
        return;
      }
    }

    // 回调函数
    if (callback) {
      callback(tag, data);
    }
  }

  renderOperate = (operate) => {
    // 上传文件
    if (operate === CardOperate.upload) {
      return <span><UploadOutlined style={{ marginRight: '8px' }} />上传文件</span>;
    }
    // 下载文件
    if (operate === CardOperate.download) {
      return <span><DownloadOutlined style={{ marginRight: '8px' }} />下载文件</span>;
    }
    // 查看文件
    if (operate === CardOperate.view) {
      return <span><EyeOutlined style={{ marginRight: '8px' }} />查看文件</span>;
    }
    // 无款项
    if (operate === CardOperate.none) {
      return <span><FileOutlined style={{ marginRight: '8px' }} />无款项</span>;
    }
    // 提交
    if (operate === CardOperate.submit) {
      return <span><UploadOutlined style={{ marginRight: '8px' }} />提交</span>;
    }
    // 驳回
    if (operate === CardOperate.reject) {
      return <span><CloseOutlined style={{ marginRight: '8px' }} />驳回</span>;
    }
    // 同意
    if (operate === CardOperate.approve) {
      return <span><CheckOutlined style={{ marginRight: '8px' }} />同意</span>;
    }
    // 重新上传
    if (operate === CardOperate.reupload) {
      return <span><UploadOutlined style={{ marginRight: '8px' }} />重新上传</span>;
    }
    // 取消上传
    if (operate === CardOperate.reversible) {
      return <span><CloseOutlined style={{ marginRight: '8px' }} />无数据</span>;
    }
    // 下载模版
    if (operate === CardOperate.template) {
      return <span><DownloadOutlined style={{ marginRight: '8px' }} />下载模版</span>;
    }

    return <span />;
  }

  // 渲染操作
  renderOperates = () => {
    const { operates } = this.state;
    if (is.empty(operates) || is.not.array(operates) || operates.length > 3) {
      return <span />;
    }

    const span = 24 / operates.length;
    return operates.map((item, index) => {
      const { operate, disabled } = item;

      // 禁用状态
      if (disabled) {
        return (
          <Col key={index} span={span} className={styles['app-comp-common-card-button-disabled']}>
            <div>{this.renderOperate(operate)}</div>
          </Col>
        );
      }

      const isShowButtonInterval = index !== operates.length - 1 ? styles['app-comp-common-card-button-interval'] : '';
      // 取消上传需要添加二次确认
      if (operate === CardOperate.reversible) {
        return (
          <Col key={index} span={span} className={styles['app-comp-common-card-button']}>
            <Popconfirm title={<span><p>确认文件无数据，取消该任务?（取消后，</p><p>该文件下对应数据指标全部为0)</p></span>} onConfirm={() => this.onClickCallback(item)}>
              <div className={isShowButtonInterval} >{this.renderOperate(operate)}</div>
            </Popconfirm>
          </Col>
        );
      }
      return (
        <Col key={index} span={span} className={styles['app-comp-common-card-button']}>
          <div className={isShowButtonInterval} onClick={() => { this.onClickCallback(item); }}>{this.renderOperate(operate)}</div>
        </Col>
      );
    });
  }

  render = () => {
    return (
      <Row className={styles['app-comp-common-card-operate-container']}>
        {/* 渲染操作 */}
        {this.renderOperates()}
      </Row>
    );
  }
}

CommonCardOperates.CardOperate = CardOperate;
export default CommonCardOperates;
