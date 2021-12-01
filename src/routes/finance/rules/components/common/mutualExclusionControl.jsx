/**
 * 控制互斥组件
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { Component } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip, Switch } from 'antd';
import PropTypes from 'prop-types';
import { SalaryCollapseType, SalaryMutualExclusion, SalaryRules } from '../../../../../application/define';
import Operate from '../../../../../application/define/operate';
import styles from './style/index.less';

class MutualExclusionControl extends Component {
  static propTypes = {
    type: PropTypes.number,              // 模板tab标识
    ruleCollectionId: PropTypes.string,  // 服务费规则集id
    ruleType: PropTypes.number,          // 规则集子项
  }
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    this.fetchRuleCollectionData();
  }

  // 更改互斥状态后的回调
  onSuccessCallback = (e) => {
    if (e.ok) {
      this.fetchRuleCollectionData();
    }
  }

  onChange = (e) => {
    const { ruleCollectionId, ruleType } = this.props;
    const payload = {
      ruleType,
      id: ruleCollectionId,
      exclusive: e ? SalaryMutualExclusion.Exclusion : SalaryMutualExclusion.Complementary,
      onSuccessCallback: this.onSuccessCallback,
    };
    this.props.dispatch({ type: 'financePlan/updateMutualExclusion', payload });
  }

  // 获取规则集详情
  fetchRuleCollectionData= () => {
    const { ruleCollectionId } = this.props;  // 规则集id
    const payload = {
      id: ruleCollectionId,
    };
    this.props.dispatch({
      payload,
      type: 'financePlan/fetchRuleCollectionData',
    });
  }

  // 渲染互斥控制切换
  renderControl = () => {
    const { type, ruleType, ruleCollectionId } = this.props;
    const ruleCollectionData = dot.get(this.props.ruleCollectionData, `${ruleCollectionId}`, {});
    let isMutualExclusion;
    // 根据规则集子项 判断子项互斥状态
    if (ruleType === SalaryRules.order) {
      isMutualExclusion = ruleCollectionData.orderRuleRelation;
    } else if (ruleType === SalaryRules.attendance) {
      isMutualExclusion = ruleCollectionData.workRuleRelation;
    } else if (ruleType === SalaryRules.quality) {
      isMutualExclusion = ruleCollectionData.qaRuleRelation;
    } else if (ruleType === SalaryRules.management) {
      isMutualExclusion = ruleCollectionData.operationRuleRelation;
    }
    if (type === SalaryCollapseType.generator || type === SalaryCollapseType.draft) {
      return (
        <div className={styles['app-comp-finance-MECoh']}>
          {!(type === SalaryCollapseType.generator) || <span className={styles['app-comp-finance-MEfl']}>可以点击后续上下进行排序及删除</span>}
          <span className={styles['app-comp-finance-MEfr']}>
            <span className="app-global-mgr8">互斥</span>
            <Tooltip title="互斥：数据计算取互补交集">
              <QuestionCircleOutlined className="app-global-mgr24" />
            </Tooltip>
            {
              !Operate.canOperateFinancePlanRulesMutualExclusion()
              || <Switch
                className={styles['app-comp-finance-MEmb4']}
                checked={isMutualExclusion === SalaryMutualExclusion.Exclusion}
                checkedChildren="开"
                unCheckedChildren="关"
                onChange={this.onChange}
              />
            }
          </span>
        </div>
      );
    }
    return (
      <div className={styles['app-comp-finance-MECoh']}>
        <span className={styles['app-comp-finance-MEfr']}>
          {
            isMutualExclusion === SalaryMutualExclusion.Exclusion ?
              <span className="app-global-mgr8">互斥</span> :
              <span className="app-global-mgr8">互补</span>
          }
          <Tooltip title="互斥：数据计算取互补交集">
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      </div>
    );
  }
  render() {
    return (
      <div>
        {/* 渲染互斥控制切换 */}
        {this.renderControl()}
      </div>
    );
  }
}

function mapStateToProps({ financePlan: { ruleCollectionData } }) {
  return { ruleCollectionData };
}

export default connect(mapStateToProps)(MutualExclusionControl);
