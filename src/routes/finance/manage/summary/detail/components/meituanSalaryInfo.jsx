/**
 * 服务费结算 - 结算管理 - 结算单汇总 - 城市结算明细 - 骑士结算明细 - 美团服务费信息
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
        label: '工资标准',
        form: `${Unit.exchangePriceToMathFormat((data['工资标准'] || 0))}元`,
      },
      {
        label: '出勤天数',
        form: `${(data['出勤天数'] || 0)}天`,
      }, {
        label: '有效出勤',
        form: `${(data['有效出勤'] || 0)}天`,
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
      </div>
    );
  }

  // 单量
  renderSingleQuantity = () => {
    const { data } = this.props;
    // 出勤信息
    const singleQuantity = [
      {
        label: '保底单量',
        form: `${(data['保底单量'] || 0)}单`,
      },
      {
        label: '完成单量',
        form: `${(data['完成单量'] || 0)}单`,
      }, {
        label: '美团单量提成（总）',
        layout: { labelCol: { span: 14 }, wrapperCol: { span: 10 } },
        form: `${Unit.exchangePriceToMathFormat((data['美团单量提成（总）'] || 0))}元`,
      }, {
        label: '特殊时段订单单量',
        form: `${(data['特殊时段订单单量'] || 0)}单`,
      },
    ];

    const otherQuantity = [
      {
        label: '特殊时段订单提成',
        form: `${Unit.exchangePriceToMathFormat((data['特殊时段订单提成'] || 0))}元`,
      }, {
        label: '外单单量',
        form: `${(data['外单单量'] || 0)}单`,
      }, {
        label: '外单提成',
        form: `${Unit.exchangePriceToMathFormat((data['外单提成'] || 0))}元`,
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
        label: '好评单量',
        form: `${(data['好评单量'] || 0)}单`,
      }, {
        label: '好评奖励',
        form: `${Unit.exchangePriceToMathFormat((data['好评奖励'] || 0))}元`,
      }, {
        label: '考核出勤/单量补贴',
        form: `${Unit.exchangePriceToMathFormat((data['考核出勤/单量补贴'] || 0))}元`,
      }, {
        label: '综合排名补贴',
        form: `${Unit.exchangePriceToMathFormat((data['综合排名补贴'] || 0))}元`,
      }, {
        label: '季节性补贴',
        form: `${Unit.exchangePriceToMathFormat((data['季节性补贴'] || 0))}元`,
      }, {
        label: '大额订单补贴',
        form: `${Unit.exchangePriceToMathFormat((data['大额订单补贴'] || 0))}元`,
      }, {
        label: '距离补贴',
        form: `${Unit.exchangePriceToMathFormat((data['距离补贴'] || 0))}元`,
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
        label: '社保补贴',
        form: `${Unit.exchangePriceToMathFormat((data['社保补贴'] || 0))}元`,
      }, {
        label: '其他补贴',
        form: `${Unit.exchangePriceToMathFormat((data['其他补贴'] || 0))}元`,
      }, {
        label: '星级绩效',
        form: `${Unit.exchangePriceToMathFormat((data['星级绩效'] || 0))}元`,
      }, {
        label: '岗位补贴',
        form: `${Unit.exchangePriceToMathFormat((data['岗位补贴'] || 0))}元`,
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
        label: '临时性结算汇总',
        form: `${Unit.exchangePriceToMathFormat((data['临时性结算汇总'] || 0))}元`,
      }, {
        label: '内荐费',
        form: `${Unit.exchangePriceToMathFormat((data['内荐费'] || 0))}元`,
      }, {
        label: '押金返还（6月前）',
        form: `${Unit.exchangePriceToMathFormat((data['押金返还（6月前）'] || 0))}元`,
      }, {
        label: '押金返还（6月后）',
        form: `${Unit.exchangePriceToMathFormat((data['押金返还（6月后）'] || 0))}元`,
      }, {
        label: '社保扣款（企业）',
        form: `${Unit.exchangePriceToMathFormat((data['社保扣款（企业）'] || 0))}元`,
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

    // 装备
    const equipmentInfo = [
      {
        label: '装备扣款',
        form: `${Unit.exchangePriceToMathFormat((data['装备扣款'] || 0))}元`,
      },
      {
        label: '装备押金扣款',
        form: `${Unit.exchangePriceToMathFormat((data['装备押金扣款'] || 0))}元`,
      },
    ];

    const platformPenalty = [
      {
        label: '美团罚款',
        form: `${Unit.exchangePriceToMathFormat((data['美团罚款'] || 0))}元`,
      },
      {
        label: '餐损扣款',
        form: `${Unit.exchangePriceToMathFormat((data['餐损扣款'] || 0))}元`,
      },
      {
        label: '星火履约扣款',
        form: `${Unit.exchangePriceToMathFormat((data['星火履约扣款'] || 0))}元`,
      },
      {
        label: '城市扣款',
        form: `${Unit.exchangePriceToMathFormat((data['城市扣款'] || 0))}元`,
      },
    ];

    // 电动车
    const electricCarInfo = [
      {
        label: '工伤险扣款',
        form: `${Unit.exchangePriceToMathFormat((data['工伤险扣款'] || 0))}元`,
      }, {
        label: '平台雇主险扣款',
        form: `${Unit.exchangePriceToMathFormat((data['平台雇主险扣款'] || 0))}元`,
      },
    ];

    // 房屋
    const deductionInfo = [
      {
        label: '房屋扣款',
        form: `${Unit.exchangePriceToMathFormat((data['房屋扣款'] || 0))}元`,
      }, {
        label: '水电费扣款',
        form: `${Unit.exchangePriceToMathFormat((data['水电费扣款'] || 0))}元`,
      }, {
        label: '管理费扣款',
        form: `${Unit.exchangePriceToMathFormat((data['管理费扣款'] || 0))}元`,
      }, {
        label: '应发工资',
        form: `${Unit.exchangePriceToMathFormat((data['应发工资'] || 0))}元`,
      }, {
        label: '社保扣款(个人）',
        form: `${Unit.exchangePriceToMathFormat((data['社保扣款(个人）'] || 0))}元`,
      }, {
        label: '个人所得税',
        form: `${Unit.exchangePriceToMathFormat((data['个人所得税'] || 0))}元`,
      }, {
        label: '房屋水电费代扣款',
        form: `${Unit.exchangePriceToMathFormat((data['房屋水电费代扣款'] || 0))}元`,
      },
      {
        label: '房屋水电费补款',
        form: `${Unit.exchangePriceToMathFormat((data['房屋水电费补款'] || 0))}元`,
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
          items={equipmentInfo}
          cols={4}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={platformPenalty}
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
      </div>
    );
  }

  // 工资
  renderWage = () => {
    const { data } = this.props;
    // 基本
    const wageInfo = [
      {
        label: '平台奖励扣款',
        form: `${Unit.exchangePriceToMathFormat((data['平台奖励扣款'] || 0))}元`,
      }, {
        label: '现金内荐费扣款',
        form: `${Unit.exchangePriceToMathFormat((data['现金内荐费扣款'] || 0))}元`,
      }, {
        label: '兼职工资扣款',
        form: `${Unit.exchangePriceToMathFormat((data['兼职工资扣款'] || 0))}元`,
      }, {
        label: '临时性结算扣回',
        form: `${Unit.exchangePriceToMathFormat((data['临时性结算扣回'] || 0))}元`,
      }, {
        label: '手续费',
        form: `${Unit.exchangePriceToMathFormat((data['手续费'] || 0))}元`,
      },
    ];

    // 单成本
    const singleCostInfo = [
      {
        label: '实发工资',
        form: `${Unit.exchangePriceToMathFormat((data['实发工资'] || 0))}元`,
      },
      {
        label: '调前应发',
        form: `${Unit.exchangePriceToMathFormat((data['调前应发'] || 0))}元`,
      },
      {
        label: '调前实发',
        form: `${Unit.exchangePriceToMathFormat((data['调前实发'] || 0))}元`,
      },
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
