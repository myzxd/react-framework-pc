/**
 * 服务费规则 补贴质量 竞赛评比 按多组条件设置 条目 Finance/Components/generator/quality/create/competition/mutipleConditionSetting/item
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  InputNumber,
  Button,
} from 'antd';

import {
  FinanceQualityAwardOrPunish,
} from '../../../../../../../../../application/define';
import {
  CoreSelect,
} from '../../../../../../../../../components/core';
import ComponentOrderType from '../../../../../common/orderType';
import ComponentPopconfirmBtns from '../../../../../common/popconfirmBtns/index';
import ComponentSalaryIndicators from '../../../../../common/salaryIndicators';
import styles from './style/index.less';

const Option = CoreSelect.Option;

class MutipleConditionSettingItem extends Component {
  static propTypes = {
    platformCode: PropTypes.string, // 平台
    currentStep: PropTypes.number, // 当前步骤
    disabled: PropTypes.bool, // 是否禁用
    index: PropTypes.number,  // 下标
    config: PropTypes.object, // 配置
    conditions: PropTypes.object, // 条件
    award: PropTypes.object,  // 奖励
    onChange: PropTypes.func.isRequired, // 改变回调
    onPlusItem: PropTypes.func.isRequired, // 新增条目
    onDeleteItem: PropTypes.func.isRequired, // 删除条目
  };

  static defaultProps = {
    disabled: false,
    index: 0,
    config: {},
    conditions: [],
    award: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      indicatorData: {           // 当前所选指标信息
        id: '',                  // 指标id
        name: '',                // 指标名字
        unit: '',                // 指标单位
      },
    };
  }

  // 新增条目
  onPlusItem = () => {
    const { onPlusItem } = this.props;
    if (onPlusItem) {
      onPlusItem();
    }
  }

  // 删除条目
  onDeleteItem = () => {
    const { onDeleteItem, index } = this.props;
    if (onDeleteItem) {
      onDeleteItem(index);
    }
  }

  // 奖励指标改变
  onChangeAwardIndex = (compareItem, unit, name) => {
    // 触发指标改变且重置步长
    this.triggerChangeAward({ compareItem, unit });
    this.setState({ indicatorData: { id: compareItem, unit, name } });
  }

  // 奖励单量改变
  onChangeRewardUnit = (index) => {
    this.triggerChangeAward({ index });
  }

  // 奖励或惩罚改变
  onChangeAwardOrPunish = (awardOrPunish) => {
    this.triggerChangeAward({ awardOrPunish });
  }

  // 金额改变
  onChangeMoney = (money) => {
    this.triggerChangeAward({ money });
  }

  // 改变条件回调
  onChangeConditions = (conditions) => {
    this.triggerOnChange({ conditions });
  }

  triggerChangeAward = (e) => {
    const { award } = this.props;
    this.triggerOnChange({ award: { ...award, ...e } });
  }

  // 触发值改变
  triggerOnChange = (e) => {
    const {
      onChange,
      index,
      award,
      conditions,
    } = this.props;
    const preValue = {
      award,
      conditions,
    };
    const nextValue = { ...preValue, ...e };
    if (onChange) {
      onChange(nextValue, index);
    }
  }

  renderAward = () => {
    const { disabled, award, platformCode, currentStep, unitText } = this.props;
    const {
      compareItem = '',
      money,
      awardOrPunish = FinanceQualityAwardOrPunish.award,
      index = 1,
    } = award;
    const { id, unit } = this.state.indicatorData;
    const unitTextShow = unitText && (unitText[id] || '');
    return (
      <Row align="middle" type="flex">
        <Col span={1} className={styles['app-comp-finance-align-center']}>按</Col>
        <Col span={7} className={styles['app-comp-finance-align-center']}>
          <ComponentSalaryIndicators
            platformCode={platformCode}
            tagList={[currentStep]}
            disabled={disabled}
            value={compareItem}
            onChange={this.onChangeAwardIndex}
            className={styles['app-comp-finance-common-mutiple-condition-set-wrap']}
          />
        </Col>
        <Col span={3} className={styles['app-comp-finance-align-center']}>
          <span>
            <span>每</span>
            <ComponentPopconfirmBtns
              disabled={disabled}
              unit={unit}
              num={index}
              onConfirm={this.onChangeRewardUnit}
            />
            <span>{unitTextShow}</span>
          </span>
        </Col>
        <Col span={333} className={styles['app-comp-finance-align-center']}>
          <CoreSelect
            disabled={disabled}
            value={`${awardOrPunish}`}
            onChange={this.onChangeAwardOrPunish}
            style={{ width: '100%' }}
          >
            <Option
              value={`${FinanceQualityAwardOrPunish.award}`}
            >
              {FinanceQualityAwardOrPunish.description(FinanceQualityAwardOrPunish.award)}
            </Option>
            <Option
              value={`${FinanceQualityAwardOrPunish.punish}`}
            >
              {FinanceQualityAwardOrPunish.description(FinanceQualityAwardOrPunish.punish)}
            </Option>
          </CoreSelect>
        </Col>
        <Col span={5} className={styles['app-comp-finance-align-center']}>
          <InputNumber
            disabled={disabled}
            value={money}
            onChange={this.onChangeMoney}
            formatter={value => `${value}元`}
            parser={value => value.replace('元', '')}
          />
        </Col>
      </Row>
    );
  }

  renderConditions = () => {
    const { conditions, disabled, platformCode, currentStep } = this.props;
    const layout = {
      indicators: 6,
      symbol: 3,
      num: 5,
    };

    return (
      <ComponentOrderType
        platformCode={platformCode}
        tags={[currentStep]}
        isHideConditions
        disabled={disabled}
        value={conditions}
        layout={layout}
        onChange={this.onChangeConditions}
      />
    );
  }


  render() {
    const {
      config,
      disabled,
    } = this.props;
    const btns = [];

    if (config.operatDelete) {
      btns.push((
        <Button
          key="minus"
          shape="circle"
          icon={<MinusOutlined />}
          disabled={disabled}
          onClick={this.onDeleteItem}
          className={styles['app-comp-finance-operations-button']}
        />
      ));
    }

    if (config.operatCreate) {
      btns.push((
        <Button
          key="plus"
          shape="circle"
          icon={<PlusOutlined />}
          disabled={disabled}
          onClick={this.onPlusItem}
        />
      ));
    }

    return (
      <Row align="middle" type="flex">
        <Col span={19} className={styles['app-comp-finance-content']}>
          {this.renderConditions()}
          {this.renderAward()}
        </Col>
        <Col span={3}>
          <div className={styles['app-comp-finance-operations']}>
            {btns}
          </div>
        </Col>
      </Row>
    );
  }

}

function mapStateToProps({ financeRulesGenerator: { orderTypes: { unitText } } }) {
  return { unitText };
}

export default connect(mapStateToProps)(MutipleConditionSettingItem);
