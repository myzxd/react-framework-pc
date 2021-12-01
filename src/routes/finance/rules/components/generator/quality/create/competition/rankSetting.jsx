/**
 * 服务费规则 排名配置 Finance/Components/quality/create/rankSetting
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditOutlined, MinusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { InputNumber, Button, Modal } from 'antd';

import {
  DeprecatedCoreForm,
} from '../../../../../../../../components/core';

/* const value = {
  rankSum: number,
  rankLadder: [
    {
      interval: [1, 1],
      money: number,
    },
    {
      interval: [2, 2],
      money: number,
    },
    {
      interval: [3, 30],
      money: number,
    }
  ]
} */

// 默认值
const defaultValue = { rankSum: 0, rankLadder: [] };
// 最大名次
const MaxSingleRank = 10;


class RankSetting extends Component {

  static propTypes = {
    disabled: PropTypes.bool,             // 是否不可编辑
  }

  static defaultProps = {
    disabled: false, // 是否不可编辑
  }

  // 当value不同时，从props中取value更新state
  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      const value = props.value || defaultValue;
      return {
        value,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = this.props.value || defaultValue; // 表单值
    this.state = {
      value, // 表单值
      isShowModal: false, // 是否显示弹窗
    };
  }

  // 改变名次总数
  onChangeRankSum = (rankSumParam) => {
    const rankLadder = [];
    let rankSum = rankSumParam;
    if (rankSum === '') {
      rankSum = 0;
    }
    // 生成名次范围数据
    for (let i = 1; i <= rankSum; i += 1) {
      if (i > MaxSingleRank) {
        rankLadder.push({
          interval: [i, rankSum],
          money: 0,
        });
        break;
      }
      rankLadder.push({
        interval: [i, i],
        money: 0,
      });
    }
    const value = { ...this.state.value, rankSum, rankLadder };
    // 更新表单value
    this.triggerFormOnChange(value);
  }

  // 点击编辑回调
  onClickEdit = () => {
    this.setState({ isShowModal: true });
  }

  // 点击删除回调
  onClickMinus = (index) => {
    const { rankLadder } = this.state.value;
    const len = rankLadder.length;
    let value = {};
    // 如果删除的是最后一个名次范围，把倒数第二个名次范围的右边界置为最后一个名次范围的右边界
    if (index === len - 1) {
      rankLadder[len - 2].interval[1] = rankLadder[len - 1].interval[1];
      // 删除当前名次范围
      rankLadder.splice(index, 1);
      value = { ...this.state.value, rankLadder };
      // 更新表单value
      this.triggerFormOnChange(value);
      return;
    }
    // 如果不是最后一个名次范围，把后一个名次范围的左边界置为当前名次范围的左边界
    rankLadder[index + 1].interval[0] = rankLadder[index].interval[0];
    // 删除当前名次范围
    rankLadder.splice(index, 1);
    value = { ...this.state.value, rankLadder };
    // 更新表单value
    this.triggerFormOnChange(value);
  }

  // 改变金额回调
  onChangeMoney = (e, index) => {
    const { rankLadder } = this.state.value;
    rankLadder[index].money = e;
    if (e === '') {
      rankLadder[index].money = 0;
    }
    const value = { ...this.state.value, rankLadder };
    this.triggerFormOnChange(value);
  }

  // 点击弹框的确认按钮回调
  onModalOk = () => {
    const { validateFields, setFieldsValue } = this.props.form;
    const { rankLadder } = this.state.value;
    validateFields((err, value) => {
      if (err) return;
      const { rank, money } = value;
      const lastItem = rankLadder[rankLadder.length - 1];
      // 将新增的名次范围的左边界置为输入的边界+1
      // 将新增的名次范围的右边界置为最后一个名次范围的右边界
      // 将最后一个名次范围的右边界置为输入的边界
      rankLadder.push({
        interval: [rank + 1, lastItem.interval[1]],
        money: lastItem.money,
      });
      rankLadder[rankLadder.length - 2].interval[1] = rank;
      rankLadder[rankLadder.length - 2].money = money;
      // 清空modal表单
      setFieldsValue({
        rank: undefined,
        money: 0,
      });
      this.setState({ isShowModal: false });
    });
  }

  // model关闭回调
  onModalCancel = () => {
    const { setFieldsValue } = this.props.form;
    // 清空modal表单
    setFieldsValue({
      rank: undefined,
      money: 0,
    });
    this.setState({ isShowModal: false });
  }

  // 触发表单字段改变
  triggerFormOnChange = (value) => {
    const { onChange } = this.props;
    if (!this.props.value) {
      this.setState({ value });
    }
    if (onChange) {
      onChange(value);
    }
  }

  renderModal = () => {
    const { rankLadder } = this.state.value;
    const len = rankLadder.length;
    // 没有名次范围，渲染空
    if (len < 1) return null;
    const rankInterval = rankLadder[len - 1].interval;
    // 没有右边界，渲染空
    if (!rankInterval[1]) return null;
    const { getFieldDecorator } = this.props.form;
    const { disabled } = this.props;
    const formItems = [
      {
        key: 'label',
        span: 3,
        label: '',
        form: `第${rankInterval[0]} ~ `,
      },
      {
        key: 'rank',
        span: 6,
        label: '',
        form: getFieldDecorator('rank', {
          rules: [{ required: true, message: '请填写名次' }],
        })(
          <InputNumber
            min={rankInterval[0]}
            max={rankInterval[1] - 1}
            formatter={value => `${value}名`}
            parser={value => value.replace('名', '')}
            disabled={disabled}
            precision={0}
          />),
      },
      {
        key: 'money',
        span: 6,
        label: '',
        form: getFieldDecorator('money', {
          initialValue: 0,
          rules: [{ required: true, message: '请填写金额' }],
        })(
          <InputNumber
            formatter={value => `${value}元`}
            parser={value => value.replace('元', '')}
            min={0}
            disabled={disabled}
            precision={2}
          />),
      },
    ];

    const layout = { labelCol: { span: 0 }, wrapperCol: { span: 24 } };

    return (
      <Modal
        title="调整竞赛名额"
        visible={this.state.isShowModal}
        onOk={this.onModalOk}
        onCancel={this.onModalCancel}
      >
        <DeprecatedCoreForm items={formItems} layout={layout} cols={4} />
      </Modal>
    );
  }

  renderFirstLine = () => {
    const { rankSum } = this.state.value;
    const { disabled } = this.props;

    const formItems = [{
      label: '设定名次',
      form: (
        <InputNumber
          min={0}
          formatter={value => `${value}名`}
          parser={value => value.replace('名', '')}
          onChange={this.onChangeRankSum}
          value={rankSum}
          disabled={disabled}
          precision={0}
        />
      ),
    }];

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <DeprecatedCoreForm items={formItems} layout={layout} cols={4} />
    );
  }

  renderRankInput = () => {
    const { rankLadder } = this.state.value;
    const { disabled } = this.props;

    const formItems = rankLadder.map((value, index, records) => {
      const { interval, money } = value;
      const operations = [];
      // single
      let label = `第${interval[0]}名`;
      if (rankLadder.length > 1) {
        operations.push(
          <Button
            key="munus"
            shape="circle"
            icon={<MinusOutlined />}
            onClick={() => this.onClickMinus(index)}
            disabled={disabled}
          />,
        );
      }

      // interval
      if (interval[0] !== interval[1]) {
        label += `~第${interval[1]}名`;
        if (index === records.length - 1) {
          operations.push(
            <Button
              key="edit"
              shape="circle"
              icon={<EditOutlined />}
              onClick={this.onClickEdit}
              disabled={disabled}
            />,
          );
        }
      }

      return {
        label,
        form: (
          <div>
            <InputNumber
              value={money}
              formatter={v => `${v}元`}
              parser={v => v.replace('元', '')}
              onChange={e => this.onChangeMoney(e, index)}
              disabled={disabled}
              precision={2}
            />
            {operations}
          </div>
        ),
      };
    });

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    return (
      <DeprecatedCoreForm items={formItems} layout={layout} cols={4} />
    );
  }

  render() {
    return (
      <div>
        {this.renderFirstLine()}

        {this.renderRankInput()}

        {this.renderModal()}
      </div>
    );
  }

}

export default Form.create()(RankSetting);
