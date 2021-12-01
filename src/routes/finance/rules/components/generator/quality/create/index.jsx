/**
 * 服务费规则生成 - 质量组件 - 创建组件 Finance/Rules/Generator
 */
import { connect } from 'dva';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { FinanceRulesGeneratorStep, FinanceQualityType } from '../../../../../../../application/define';
import { CoreTabs } from '../../../../../../../components/core';
import QualityPerson from './person';
import QualityCompetition from './competition';

import styles from './style/index.less';

class QualityCreateComponent extends Component {
  static propTypes = {
    platformCode: PropTypes.string, // 平台
    ruleCollectionId: PropTypes.string.isRequired, // 规则集id
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowTips: {
        [FinanceQualityType.person]: true,       // 展示个人考核提示
        [FinanceQualityType.competition]: true,  // 展示竞赛评比提示
      },
    };
    this.private = {
      currentTabKey: `${FinanceQualityType.person}`, // 当前tab的key
    };
  }

  // tip关闭按钮回调
  onCloseTip = (target) => {
    if (this.private.currentTabKey !== target) return;
    const { isShowTips } = this.state;
    isShowTips[target] = false;
    this.setState({ isShowTips });
  }

  // tip展示改变回调
  onChangeShowTips = (target) => {
    if (this.private.currentTabKey !== target) return;
    const { isShowTips } = this.state;
    isShowTips[target] = !isShowTips[target];
    this.setState({ isShowTips });
  }

  // 切换tab回调
  onChangeTab = (e) => {
    this.private.currentTabKey = e;
  }

  // 刷新列表数据
  fetchListData = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'financeRulesGenerator/fetchRulesGeneratorList', payload: { step: FinanceRulesGeneratorStep.third } });
  }


  // 渲染tab
  renderTabs = () => {
    const { ruleCollectionId, platformCode } = this.props;
    const { isShowTips } = this.state;
    const person = FinanceQualityType.person;
    const competition = FinanceQualityType.competition;
    const tabItems = [
      {
        key: `${person}`,
        title: (
          <div>
            <span>{FinanceQualityType.description(person)}</span>
            <QuestionCircleOutlined
              className={styles['app-comp-finance-generator-quality-create-icon']}
              onClick={() => this.onChangeShowTips(`${person}`)}
            />
          </div>
        ),
        content: (
          <QualityPerson
            platformCode={platformCode}
            isShowTips={isShowTips[person]}
            onCloseTip={this.onCloseTip}
            ruleCollectionId={ruleCollectionId}
          />
        ),
      },
      {
        key: `${competition}`,
        title: (
          <div>
            <span>{FinanceQualityType.description(competition)}</span>
            <QuestionCircleOutlined
              className={styles['app-comp-finance-generator-quality-create-icon']}
              onClick={() => this.onChangeShowTips(`${competition}`)}
            />
          </div>
        ),
        content: (
          <QualityCompetition
            platformCode={platformCode}
            isShowTips={isShowTips[competition]}
            onCloseTip={this.onCloseTip}
            ruleCollectionId={ruleCollectionId}
          />),
      },
    ];

    return (
      <CoreTabs
        type="card"
        items={tabItems}
        onChange={this.onChangeTab}
        defaultActiveKey={`${person}`}
      />
    );
  }

  render() {
    return (
      <div>
        {/* 渲染tabs组件 */}
        {this.renderTabs()}
      </div>
    );
  }
}

export default connect()(QualityCreateComponent);
