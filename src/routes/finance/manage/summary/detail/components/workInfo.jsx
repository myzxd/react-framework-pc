/**
 * 服务费结算 - 结算管理 - 结算单汇总 - 城市结算明细 - 骑士结算明细 - 工作信息
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';

class WorkInfo extends Component {
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
    const basicInfo = [
      {
        label: '本人姓名',
        form: data['本人姓名'] || '--',
      }, {
        label: '本人手机号',
        form: data['本人手机号'] || '--',
      }, {
        label: '入职日期',
        form: data['入职日期'] || '--',
      }, {
        label: '离职日期',
        form: data['离职日期'] || '--',
      }, {
        label: '骑士类型',
        form: data['骑士类型'] || '--',
      }, {
        label: '人员职位',
        form: data['人员职位'] || '--',
      }, {
        label: '人员状态',
        form: data['人员状态'] || '--',
      }, {
        label: '招聘来源',
        form: data['招聘来源'] || '--',
      },
    ];

    // 所在平台信息
    const platformInfo = [
      {
        label: '项目',
        form: data['项目'] || '--',
      }, {
        label: '主体',
        form: data['主体'] || '--',
      }, {
        label: '城市',
        form: data['城市'] || '--',
      }, {
        label: '商圈ID',
        form: data['商圈ID'] || '--',
      }, {
        label: '商圈',
        form: data['商圈'] || '--',
      }, {
        label: '雇用主体',
        form: data['雇佣主体'] || '--',
      }, {
        label: '人员ID',
        form: data['人员ID'] || '--',
      }, {
        label: 'boss人员ID',
        form: data['boss员工ID'] || '--',
      },
    ];

    // 平台为美团，则删除 人员职位 字段
    if (platformCode === 'meituan') {
      basicInfo.splice(5, 1);
    }

    // 布局
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <CoreContent
        title="工作信息"
        titleExt={extra}
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <div
          style={{ display: isShowDetail ? 'block' : 'none' }}
        >
          {/* 个人信息 */}
          <DeprecatedCoreForm
            items={basicInfo}
            cols={4}
            layout={layout}
          />
          {/* 所在平台信息 */}
          <DeprecatedCoreForm
            items={platformInfo}
            cols={4}
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

export default WorkInfo;
