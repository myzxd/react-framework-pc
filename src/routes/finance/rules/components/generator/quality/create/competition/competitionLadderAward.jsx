/**
 * 服务费规则 补贴质量 竞赛评比 设定奖罚 阶梯奖励 Finance/Components/generator/quality/create/competitionLadderAward
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {
  Checkbox,
  Button,
  InputNumber,
} from 'antd';

import {
  CoreSelect,
  DeprecatedCoreForm,
} from '../../../../../../../../components/core';
import LadderAwardRule from '../common/ladderAwardRule';

const Option = CoreSelect.Option;

class CompetitionLadderAward extends Component {

  static propTypes = {
    form: PropTypes.object,     // 上级表单
  }

  static defaultProps = {
    form: {},                   // 上级表单默认值
  }

  constructor(props) {
    super(props);
    this.state = {
      isCollapse: false,         // 是否折叠
    };
  }

  // 折叠
  toggleCollapse = () => {
    let { isCollapse } = this.state;
    isCollapse = !isCollapse;
    this.setState({ isCollapse });
  }

  // 渲染首行
  renderFirstLine = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { isCollapse } = this.state;
    const btnIcon = isCollapse ? <DownOutlined /> : <UpOutlined />;
    const isDisabled = !getFieldValue('markLadderAward');
    const formItems = [
      {
        label: '',
        span: 1,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: getFieldDecorator('markLadderAward', {
        })(
          <Checkbox onChange={this.onChangeMarkLadderAward} />,
        ),
      },
      {
        label: '',
        span: 4,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: getFieldDecorator('ladderAwardType', {
        })(
          <CoreSelect disabled={isDisabled}>
            <Option value="0">按量阶梯奖励法</Option>
            <Option value="1">按率阶梯奖励法</Option>
          </CoreSelect>,
        ),
      },
      {
        label: '',
        form: (
          <Button
            shape="circle"
            icon={btnIcon}
            size="small"
            onClick={this.toggleCollapse}
          />
        ),
      },
    ];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (<DeprecatedCoreForm items={formItems} cols={3} layout={layout} />);
  }

  // 渲染最高奖励金额
  renderMaxAwardMoney = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const isDisabled = !getFieldValue('markLadderAward');
    const formItems = [
      {
        label: '最高奖励金额(元)',
        span: 6,
        form: getFieldDecorator('maxAwardMoney', {
        })(<InputNumber disabled={isDisabled} />),
      },
    ];

    const layout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } };

    return (<DeprecatedCoreForm items={formItems} cols={1} layout={layout} />);
  }

  // 渲染阶梯奖励组件
  renderLadderAwardRule = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const isDisabled = !getFieldValue('markLadderAward');
    const unit = getFieldValue('ladderAwardType') === '0' ? 'quantity' : 'rate';
    const formItems = [
      {
        label: '',
        form: getFieldDecorator('competitionLadderAwardRule', {
        })(
          <LadderAwardRule
            unit={unit}
            disabled={isDisabled}
          />,
        ),
      },
    ];
    const layout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };
    return (<DeprecatedCoreForm items={formItems} layout={layout} cols={1} />);
  }

  // 渲染内容
  renderContent = () => {
    const { isCollapse } = this.state;
    if (isCollapse) return null;
    return (
      <div>
        {this.renderMaxAwardMoney()}

        {this.renderLadderAwardRule()}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderFirstLine()}

        {this.renderContent()}
      </div>
    );
  }

}

export default CompetitionLadderAward;
