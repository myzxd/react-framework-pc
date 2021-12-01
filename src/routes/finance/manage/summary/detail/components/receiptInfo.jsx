/**
 * 服务费结算 - 结算管理 - 结算单汇总 - 城市结算明细 - 骑士结算明细 - 收款基本信息
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';

class ReceiptInfo extends Component {
  static propTypes = {
    data: PropTypes.object,
    platformCode: PropTypes.string,
  }

  static defaultProps = {
    data: {},
    platformCode: '',
  }

  constructor() {
    super();
    this.state = {
      isShowDetail: true, // 是否显示信息
    };
  }

  // 渲染内容
  renderContent = () => {
    const { isShowDetail } = this.state;
    const { data, platformCode } = this.props;

    // 右侧内容
    const extra = (
      <a
        key="changeExpand"
        onClick={() => this.setState({ isShowDetail: !isShowDetail })}
      >
        {isShowDetail ? '收起' : '展开'}
      </a>
    );

    // 基本个人信息
    const receiptInfo = [
      {
        label: '本人姓名',
        form: `${(data['本人姓名'] || '--')}`,
      }, {
        label: '本人身份证号码',
        form: `${(data['本人身份证号码'] || '--')}`,
      }, {
        label: '收款人是否为本人',
        form: `${(data['收款人是否为本人'] || '--')}`,
      }, {
        label: '收款人姓名',
        form: `${(data['收款人姓名'] || '--')}`,
      }, {
        label: '收款方式ID',
        form: `${(data['收款方式'] || '--')}`,
      }, {
        label: '收款人身份证号码',
        form: `${(data['收款人身份证号码'] || '--')}`,
      }, {
        label: '收款银行卡号',
        form: `${(data['收款银行卡号'] || '--')}`,
      }, {
        label: '收款开户银行',
        form: `${(data['收款开户银行'] || '--')}`,
      }, {
        label: '开户行所在地',
        form: `${(data['开户行所在地'] || '--')}`,
      },
    ];

    // 平台为饿了么，则删除 收款方式id 字段
    if (platformCode === 'elem') {
      receiptInfo.splice(4, 1);
    }

    // 布局
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

    return (
      <CoreContent
        title="收款基本信息"
        titleExt={extra}
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <div
          style={{ display: isShowDetail ? 'block' : 'none' }}
        >
          {/* 个人信息 */}
          <DeprecatedCoreForm
            items={receiptInfo}
            cols={3}
            layout={layout}
          />
        </div>
      </CoreContent>
    );
  }

  render() {
    // 渲染内容
    return this.renderContent();
  }
}

export default ReceiptInfo;

