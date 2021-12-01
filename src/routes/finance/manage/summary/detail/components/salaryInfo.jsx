/**
 * 服务费结算 - 结算管理 - 结算单汇总 - 城市结算明细 - 骑士结算明细 - 饿了么服务费信息
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Unit, SalaryPaymentState } from '../../../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';

class SalaryInfo extends Component {
  static propTypes = {
    data: PropTypes.object,
    salaryDetail: PropTypes.object,
  }

  static defaultProps = {
    data: {},
    salaryDetail: {},
  }

  constructor() {
    super();
    this.state = {
      isShowDetail: true, // 是否显示信息
    };
  }

  // 出勤
  renderAttendance = () => {
    const { data } = this.props;
    // 出勤信息
    const attendaceInfo = [
      {
        label: '出勤天数',
        form: `${(data['出勤天数'] || 0)}天`,
      }, {
        label: '有效出勤',
        form: `${(data['有效出勤'] || 0)}天`,
      }, {
        label: '病假天数',
        form: `${(data['病假天数'] || 0)}天`,
      },
    ];

    // 工资标准
    const standardInfo = [
      {
        label: '工资标准',
        form: `${Unit.exchangePriceToMathFormat((data['工资标准'] || 0))}元`,
      }, {
        label: '出勤工资',
        form: `${Unit.exchangePriceToMathFormat((data['出勤工资'] || 0))}元`,
      }, {
        label: '全勤奖',
        form: `${Unit.exchangePriceToMathFormat((data['全勤奖'] || 0))}元`,
      },

    ];

    // 布局
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

    return (
      <div className="app-global-mgb30">
        <DeprecatedCoreForm
          items={attendaceInfo}
          cols={4}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={standardInfo}
          cols={4}
          layout={layout}
        />
      </div>
    );
  }

  // 单量
  renderSingleQuantity = () => {
    const { data } = this.props;
    // 出勤信息
    const singleQuantity = [
      {
        label: '完成单量',
        form: `${(data['完成单量'] || 0)}单`,
      }, {
        label: '准时单量',
        form: `${(data['准时单量'] || 0)}单`,
      }, {
        label: '超时单量',
        form: `${(data['超时单量'] || 0)}单`,
      },
    ];

    const otherQuantity = [
      {
        label: '午高峰单/夜班单/早餐单',
        layout: { labelCol: { span: 18 }, wrapperCol: { span: 6 } },
        form: `${(data['午高峰单/夜班单/早餐单'] || 0)}单`,
      }, {
        label: '好评单量',
        form: `${(data['好评单量'] || 0)}单`,
      }, {
        label: '差评单量',
        form: `${(data['差评单量'] || 0)}单`,
      },
    ];

    // 布局
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

    return (
      <div className="app-global-mgb30">
        <DeprecatedCoreForm
          items={singleQuantity}
          cols={4}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={otherQuantity}
          cols={4}
          layout={layout}
        />
      </div>
    );
  }

  // 提成
  renderCommission = () => {
    const { data } = this.props;
    // 出勤信息
    const commissionInfo = [
      {
        label: '单量提成',
        form: `${Unit.exchangePriceToMathFormat((data['单量提成'] || 0))}元`,
      }, {
        label: '准时单量提成',
        form: `${Unit.exchangePriceToMathFormat((data['准时单量提成'] || 0))}元`,
      }, {
        label: '超时单量提成',
        form: `${Unit.exchangePriceToMathFormat((data['超时单量提成'] || 0))}元`,
      }, {
        label: '超时单量扣款',
        form: `${Unit.exchangePriceToMathFormat((data['超时单量扣款'] || 0))}元`,
      }, {
        label: '午高峰/夜班单/早餐单提成/补贴',
        layout: { labelCol: { span: 18 }, wrapperCol: { span: 6 } },
        form: `${Unit.exchangePriceToMathFormat((data['午高峰/夜班单/早餐单提成/补贴'] || 0))}元`,
      }, {
        label: '好评奖励',
        form: `${Unit.exchangePriceToMathFormat((data['好评奖励'] || 0))}元`,
      }, {
        label: '差评扣款',
        form: `${Unit.exchangePriceToMathFormat((data['差评扣款'] || 0))}元`,
      }, {
        label: '单量补贴',
        form: `${Unit.exchangePriceToMathFormat((data['单量补贴'] || 0))}元`,
      },
    ];

    // 布局
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

    return (
      <div className="app-global-mgb30">
        <DeprecatedCoreForm
          items={commissionInfo}
          cols={4}
          layout={layout}
        />
      </div>
    );
  }

  // 补贴
  renderSubsidy = () => {
    const { data } = this.props;
    // 出勤信息
    const subsidyInfo = [
      {
        label: '车辆补贴',
        form: `${Unit.exchangePriceToMathFormat((data['车辆补贴'] || 0))}元`,
      }, {
        label: '充电补贴',
        form: `${Unit.exchangePriceToMathFormat((data['充电补贴'] || 0))}元`,
      }, {
        label: '其他补贴',
        form: `${Unit.exchangePriceToMathFormat((data['其他补贴'] || 0))}元`,
      }, {
        label: '奖金',
        form: `${Unit.exchangePriceToMathFormat((data['奖金'] || 0))}元`,
      }, {
        label: '服务费调节类补款',
        form: `${Unit.exchangePriceToMathFormat((data['薪资调节类补款'] || 0))}元`,
      }, {
        label: '平台奖励',
        form: `${Unit.exchangePriceToMathFormat((data['平台奖励'] || 0))}元`,
      }, {
        label: '现金内荐费',
        form: `${Unit.exchangePriceToMathFormat((data['现金内荐费'] || 0))}元`,
      }, {
        label: '兼职工资',
        form: `${Unit.exchangePriceToMathFormat((data['兼职工资'] || 0))}元`,
      }, {
        label: '临时性结算',
        form: `${Unit.exchangePriceToMathFormat((data['临时性结算'] || 0))}元`,
      }, {
        label: '内荐费',
        form: `${Unit.exchangePriceToMathFormat((data['内荐费'] || 0))}元`,
      }, {
        label: '线下违规扣款',
        form: `${Unit.exchangePriceToMathFormat((data['线下违规扣款'] || 0))}元`,
      }, {
        label: '管理费',
        form: `${Unit.exchangePriceToMathFormat((data['管理费'] || 0))}元`,
      }, {
        label: '个人所得税',
        form: `${Unit.exchangePriceToMathFormat((data['个人所得税'] || 0))}元`,
      }, {
        label: '平台奖励扣款',
        form: `${Unit.exchangePriceToMathFormat((data['平台奖励扣款'] || 0))}元`,
      }, {
        label: '现金内荐费扣款',
        form: `${Unit.exchangePriceToMathFormat((data['现金内荐费扣款'] || 0))}元`,
      }, {
        label: '兼职工资扣款',
        form: `${Unit.exchangePriceToMathFormat((data['兼职工资扣款'] || 0))}元`,
      }, {
        label: '工伤险扣款',
        form: `${Unit.exchangePriceToMathFormat((data['工伤险扣款'] || 0))}元`,
      }, {
        label: '平台雇主险扣款',
        form: `${Unit.exchangePriceToMathFormat((data['平台雇主险扣款'] || 0))}元`,
      }, {
        label: '平台罚款',
        form: `${Unit.exchangePriceToMathFormat((data['平台罚款'] || 0))}元`,
      }, {
        label: '手续费',
        form: `${Unit.exchangePriceToMathFormat((data['手续费'] || 0))}元`,
      },
    ];

    // 布局
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

    return (
      <div className="app-global-mgb30">
        <DeprecatedCoreForm
          items={subsidyInfo}
          cols={4}
          layout={layout}
        />
      </div>
    );
  }

  // 其他补贴
  renderOtherSubsidy = () => {
    const { data } = this.props;
    // 出勤信息
    const subsidyInfo = [
      {
        label: '岗位补贴',
        form: `${Unit.exchangePriceToMathFormat((data['岗位补贴'] || 0))}元`,
      }, {
        label: '夜班补贴',
        form: `${Unit.exchangePriceToMathFormat((data['夜班补贴'] || 0))}元`,
      },
    ];

    // 押金返还
    const depositInfo = [
      {
        label: '押金返还',
        form: `${Unit.exchangePriceToMathFormat((data['押金返还'] || 0))}元`,
      },
    ];

    // 装备
    const equipmentInfo = [
      {
        label: '装备押金扣款',
        form: `${Unit.exchangePriceToMathFormat((data['装备押金扣款'] || 0))}元`,
      }, {
        label: '装备扣款',
        form: `${Unit.exchangePriceToMathFormat((data['装备扣款'] || 0))}元`,
      },
    ];

    // 电动车
    const electricCarInfo = [
      {
        label: '电动车扣款',
        form: `${Unit.exchangePriceToMathFormat((data['电动车扣款'] || 0))}元`,
      }, {
        label: '电动车租金扣款',
        form: `${Unit.exchangePriceToMathFormat((data['电动车租金扣款'] || 0))}元`,
      }, {
        label: '电动车押金扣款',
        form: `${Unit.exchangePriceToMathFormat((data['电动车押金扣款'] || 0))}元`,
      },
    ];

    // 房屋
    const deductionInfo = [
      {
        label: '房屋扣款',
        form: `${Unit.exchangePriceToMathFormat((data['房屋扣款'] || 0))}元`,
      }, {
        label: '水电扣款',
        form: `${Unit.exchangePriceToMathFormat((data['水电扣款'] || 0))}元`,
      }, {
        label: '城市扣款',
        form: `${Unit.exchangePriceToMathFormat((data['城市扣款'] || 0))}元`,
      }, {
        label: '其他扣款',
        form: `${Unit.exchangePriceToMathFormat((data['其他扣款'] || 0))}元`,
      }, {
        label: '房屋费代扣款',
        form: `${Unit.exchangePriceToMathFormat((data['房屋费代扣款'] || 0))}元`,
      }, {
        label: '房屋费代补款',
        form: `${Unit.exchangePriceToMathFormat((data['房屋费代补款'] || 0))}元`,
      }, {
        label: '水电费扣款',
        form: `${Unit.exchangePriceToMathFormat((data['水电费扣款'] || 0))}元`,
      }, {
        label: '水电费补款',
        form: `${Unit.exchangePriceToMathFormat((data['水电费补款'] || 0))}元`,
      }, {
        label: '装备扣款',
        form: `${Unit.exchangePriceToMathFormat((data['装备扣款'] || 0))}元`,
      }, {
        label: '装备补款',
        form: `${Unit.exchangePriceToMathFormat((data['装备补款'] || 0))}元`,
      },
    ];

    // 借贷
    const borrowInfo = [
      {
        label: '装备扣款（借款核销）',
        layout: { labelCol: { span: 12 }, wrapperCol: { span: 12 } },
        form: `${Unit.exchangePriceToMathFormat((data['装备扣款（借款核销）'] || 0))}元`,
      },
    ];

    // 布局
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

    return (
      <div className="app-global-mgb30">
        <DeprecatedCoreForm
          items={subsidyInfo}
          cols={4}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={depositInfo}
          cols={4}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={equipmentInfo}
          cols={4}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={electricCarInfo}
          cols={4}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={deductionInfo}
          cols={4}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={borrowInfo}
          cols={4}
          layout={layout}
        />
      </div>
    );
  }

  // 工资
  renderWage = () => {
    const { data } = this.props;
    // 基本
    const wageInfo = [
      {
        label: '应发工资',
        form: `${Unit.exchangePriceToMathFormat((data['应发工资'] || 0))}元`,
      }, {
        label: '税前工资',
        form: `${Unit.exchangePriceToMathFormat((data['税前工资'] || 0))}元`,
      }, {
        label: '实发工资',
        form: `${Unit.exchangePriceToMathFormat((data['实发工资'] || 0))}元`,
      },
    ];

    // 其他
    const otherInfo = [
      {
        label: '调前应发',
        form: `${Unit.exchangePriceToMathFormat((data['调前应发'] || 0))}元`,
      }, {
        label: '调前实发',
        form: `${Unit.exchangePriceToMathFormat((data['调前实发'] || 0))}元`,
      },
    ];

    // 单成本
    const singleCostInfo = [
      {
        label: '单成本',
        form: `${Unit.exchangePriceToMathFormat((data['单成本'] || 0))}元`,
      },
    ];

    // 布局
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

    return (
      <div className="app-global-mgb30">
        <DeprecatedCoreForm
          items={wageInfo}
          cols={4}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={otherInfo}
          cols={4}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={singleCostInfo}
          cols={4}
          layout={layout}
        />
      </div>
    );
  }

  // 其他
  renderOtherInfo = () => {
    const { data, salaryDetail } = this.props;
    // 出勤信息
    const attendaceInfo = [
      {
        label: '服务费发放状态',
        form: SalaryPaymentState.description(salaryDetail.pay_salary_state),
      }, {
        label: '发放账户',
        form: data['发放账户'] || '--',
      }, {
        label: '备注',
        form: data['备注'] || '--',
      },
    ];

    const item = [
      {
        label: '招聘费用预测',
        form: `${Unit.exchangePriceToMathFormat((data['招聘费用预测'] || 0))}元`,
      },
    ];

    // 布局
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

    return (
      <div>
        <DeprecatedCoreForm
          items={attendaceInfo}
          cols={4}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={item}
          cols={4}
          layout={layout}
        />
      </div>
    );
  }

  // 渲染内容
  renderContent = () => {
    const { isShowDetail } = this.state;

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
        title="收款明细"
        titleExt={extra}
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <div
          style={{ display: isShowDetail ? 'block' : 'none' }}
        >
          {/* 出勤信息 */}
          {this.renderAttendance()}
          {/* 单量信息 */}
          {this.renderSingleQuantity()}
          {/* 提成信息 */}
          {this.renderCommission()}
          {/* 补贴信息 */}
          {this.renderSubsidy()}
          {/* 其他补贴信息 */}
          {this.renderOtherSubsidy()}
          {/* 工资信息 */}
          {this.renderWage()}
          {/* 其他信息 */}
          {this.renderOtherInfo()}
        </div>
      </CoreContent>
    );
  }

  render() {
    // 渲染内容
    return this.renderContent();
  }
}

export default SalaryInfo;
