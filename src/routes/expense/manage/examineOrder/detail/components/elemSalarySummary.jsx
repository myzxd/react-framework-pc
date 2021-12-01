/*
 * 审批单详情页面 - 饿了么结算汇总
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Empty } from 'antd';

import { Unit, HouseholdType } from '../../../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import styles from './style.less';

class SalarySummary extends Component {
  static propTypes = {
    detail: PropTypes.object, // 结算单数据
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    detail: {}, // 结算单数据
    dispatch: () => {},
  }

  constructor() {
    super();
    this.state = {
      isShowDetail: true, // 是否显示详情
    };
  }

  // 下载结算单附件
  onDownloadPayroll = (id) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'financeSummaryManage/downloadSalaryStatement',
      payload: { id },
    });
  }

  // 公共字段
  renderPublic = () => {
    // 结算单数据
    const { detail } = this.props;

    // 服务费发放数据
    const data = dot.get(detail, 'summary_data', {});

    // 归属周期
    const startDate = dot.get(detail, 'start_date', '--');
    const endDate = dot.get(detail, 'end_date', '--');

    const items = [
      {
        form: `项目：${(data['项目'] || '--')}`,
      }, {
        form: `主体：${(data['主体'] || '--')}`,
      }, {
        form: `城市：${(data['城市'] || '--')}`,
      }, {
        form: `个户类型：${HouseholdType.description(detail.work_type)}`,
      }, {
        form: `雇佣主体：${(data['雇佣主体'] || '--')}`,
      }, {
        form: `服务费归属日期：${startDate}~${endDate}`,
      }, {
        form: `成本中心：${(data['成本中心'] || '--')}`,
      }, {
        form: `人数：${(Number(data['人数']) || 0)}`,
      }, {
        form: `招聘费用预测：${Unit.exchangePriceToMathFormat((data['招聘费用预测'] || 0))}元`,
      }, {
        form: `单量：${(data['完成单量'] || 0)}单`,
      }, {
        form: `服务费调节类补款：${Unit.exchangePriceToMathFormat((data['薪资调节类补款'] || 0))}元`,
      }, {
        form: `内荐费：${Unit.exchangePriceToMathFormat((data['内荐费'] || 0))}元`,
      }, {
        form: `押金返还：${Unit.exchangePriceToMathFormat((data['押金返还'] || 0))}元`,
      }, {
        form: `平台奖励：${Unit.exchangePriceToMathFormat((data['平台奖励'] || 0))}元`,
      }, {
        form: `服务费调节类补款：${Unit.exchangePriceToMathFormat((data['薪资调节类补款'] || 0))}元`,
      },
    ];

    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

    return (
      <DeprecatedCoreForm
        items={items}
        cols={4}
        layout={layout}
      />
    );
  }

  // 公共字段
  renderOther = () => {
    // 结算单数据
    const { detail } = this.props;
    // 服务费发放数据
    const data = dot.get(detail, 'summary_data', {});
    const items = [
      {
        form: `临时性结算汇总：${Unit.exchangePriceToMathFormat((data['临时性结算汇总'] || 0))}元`,
      }, {
        form: `工伤保险扣款：${Unit.exchangePriceToMathFormat((data['工伤险扣款'] || 0))}元`,
      }, {
        form: `平台雇主险扣款：${Unit.exchangePriceToMathFormat((data['平台雇主险扣款'] || 0))}元`,
      }, {
        form: `电动车扣款：${Unit.exchangePriceToMathFormat((data['电动车扣款'] || 0))}元`,
      }, {
        form: `电动车租金扣款：${Unit.exchangePriceToMathFormat((data['电动车租金扣款'] || 0))}元`,
      }, {
        form: `电动车押金扣款：${Unit.exchangePriceToMathFormat((data['电动车押金扣款'] || 0))}元`,
      }, {
        form: `装备押金：${Unit.exchangePriceToMathFormat((data['装备押金'] || 0))}元`,
      }, {
        form: `装备扣款：${Unit.exchangePriceToMathFormat((data['装备扣款'] || 0))}元`,
      }, {
        form: `应发工资：${Unit.exchangePriceToMathFormat((data['应发工资'] || 0))}元`,
      }, {
        form: `社保扣款：${Unit.exchangePriceToMathFormat((data['社保扣款'] || 0))}元`,
      }, {
        form: `个人所得税：${Unit.exchangePriceToMathFormat((data['个人所得税'] || 0))}元`,
      }, {
        form: `实发工资：${Unit.exchangePriceToMathFormat((data['实发工资'] || 0))}元`,
      }, {
        form: `三方手续费汇总：${Unit.exchangePriceToMathFormat((data['手续费'] || 0))}元`,
      }, {
        form: `综合实发工资：${Unit.exchangePriceToMathFormat((data['实发工资'] || 0))}元`,
      },
    ];

    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <DeprecatedCoreForm
        items={items}
        cols={4}
        layout={layout}
      />
    );
  }

  // 渲染操作
  renderOperate = () => {
    const { detail } = this.props;
    // 数据
    const data = dot.get(detail, 'payrollStatementInfo', {});

    // 结算明细
    const {
      _id: id,
      platform_code: platformCode,
      state: states,
    } = data;
    return (
      <div>
        <Link
          to={{
            pathname: '/Finance/Manage/Summary/Detail/City',
            query: {
              id,
              platformCode,
              canDelay: 1,
              states,
            },
          }}
        >
            查看详情
        </Link>
        <a
          key="onDownloadPayroll"
          onClick={() => this.onDownloadPayroll(detail._id)}
          className={styles['app-comp-expense-elem-dowload-btn']}
        >
          下载结算单附件
        </a>
      </div>
    );
  }

  render() {
    const { isShowDetail } = this.state;
    // 结算单数据
    const { detail } = this.props;

    // 数据为空
    if (!detail || Object.keys(detail).length === 0) {
      return (
        <CoreContent
          title="结算汇总"
        >
          <Empty />
        </CoreContent>
      );
    }

    // 右侧内容
    const extra = (
      <a
        key="changeExpand"
        onClick={() => this.setState({ isShowDetail: !isShowDetail })}
      >
        {isShowDetail ? '收起' : '展开'}
      </a>
    );

    return (
      <CoreContent
        title="结算汇总"
        titleExt={extra}
      >
        <div
          className={isShowDetail ? '' : styles['app-comp-expense-elem-hide']}
        >
          {this.renderPublic()}
          {this.renderOther()}
          {this.renderOperate()}
        </div>
      </CoreContent>
    );
  }
}

export default SalarySummary;
