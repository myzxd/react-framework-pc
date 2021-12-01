/**
 * 物资管理 - 扣款汇总 - 扣款汇总详情 - 基本信息组件
 */
import dot from 'dot-prop';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import { Unit, SupplyNameType } from '../../../../application/define';

class BasicInfo extends Component {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  // 基本信息
  renderBasicInfo = () => {
    // 数据
    const { data } = this.props;

    // 项
    const items = [
      {
        label: '平台',
        form: dot.get(data, 'platform_name', '--'),
      },
      {
        label: '供应商',
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
        form: dot.get(data, 'supplier_name', '--'),
      },
      {
        label: '城市',
        form: dot.get(data, 'city_name', '--'),
      },
      {
        label: '商圈',
        form: dot.get(data, 'biz_district_name', '--'),
      },
      {
        label: '姓名',
        form: dot.get(data, 'staff_name', '--'),
      },
      {
        label: '身份证号',
        form: dot.get(data, 'identity_card_id', '--'),
      },
      {
        label: '物资分类',
        form: SupplyNameType.description(data.group),
      },
      {
        label: '归属时间',
        form: dot.get(data, 'month', '--'),
      },
    ];

    const {
      ult_real_deduction_deposit: ultRealDeductionDeposit = 0,
      ult_real_deduction_usage_fee: ultRealDeductionUsageFee = 0,
      ult_deduction_deposit: ultDeductionDeposit = 0,
      ult_deduction_usage_fee: ultDeductionUsageFee = 0,
      deduction_deposit: deductionDeposit = 0,
      deduction_usage_fee: deductionUsageFee = 0,
    } = data;

    // 上月实际扣款
    const lastMonthReal = ultRealDeductionDeposit + ultRealDeductionUsageFee;

    // 上月未扣款
    const lastMonthUlt = ultDeductionDeposit + ultDeductionUsageFee;

    // 本月应扣款
    const thisMonthShould = deductionDeposit + deductionUsageFee;

    // 本月累计应扣款
    const thisMonthTotal = thisMonthShould + lastMonthUlt;

    // 上月扣款
    const lastMonthItems = [
      {
        label: '上月实际扣款(元)',
        form: Unit.exchangePriceCentToMathFormat(lastMonthReal),
      },
      {
        label: '上月未扣款(元)',
        form: Unit.exchangePriceCentToMathFormat(lastMonthUlt),
      },
    ];

    // 本月扣款
    const thisMonthItems = [
      {
        label: '本月累计应扣款(元)',
        form: Unit.exchangePriceCentToMathFormat(thisMonthTotal),
      },
      {
        label: '本月应扣款(元)',
        form: Unit.exchangePriceCentToMathFormat(thisMonthShould),
      },
    ];

    // 布局
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm
          items={items}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={lastMonthItems}
          cols={3}
          layout={layout}
        />
        <DeprecatedCoreForm
          items={thisMonthItems}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  // 上月未扣项
  renderLatMonthNoSeen = () => {
    // 数据
    const { data } = this.props;

    // 项
    const items = [
      {
        label: '未扣款押金(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.ult_deduction_deposit) || 0)}`,
      },
      {
        label: '未扣款使用费(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.ult_deduction_usage_fee) || 0)}`,
      },
      {
        label: '未扣款折损费(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.ult_deduction_consume_fee) || 0)}`,
      },
      {
        label: '未退款押金(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.ult_refund_deposit) || 0)}`,
      },
    ];

    // 布局
    const layout = { labelCol: { span: 14 }, wrapperCol: { span: 10 } };

    return (
      <CoreContent title="上月未扣项">
        <DeprecatedCoreForm
          items={items}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  // 上月实扣
  renderActualBuckle = () => {
    // 数据
    const { data } = this.props;

    // 项
    const items = [
      {
        label: '实际扣款押金(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.ult_real_deduction_deposit) || 0)}`,
      },
      {
        label: '实际扣款使用费(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.ult_real_deduction_usage_fee) || 0)}`,
      },
      {
        label: '实际扣款折损费(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.ult_real_deduction_consume_fee) || 0)}`,
      },
      {
        label: '实际退款押金(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.ult_real_refund_deposit) || 0)}`,
      },
    ];

    // 布局
    const layout = { labelCol: { span: 14 }, wrapperCol: { span: 10 } };

    return (
      <CoreContent title="上月实扣项">
        <DeprecatedCoreForm
          items={items}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  // 本月应扣项
  renderDeductible = () => {
    // 数据
    const { data } = this.props;

    // 项
    const items = [
      {
        label: '应扣款押金(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.deduction_deposit || 0))}`,
      },
      {
        label: '应扣款使用费(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.deduction_usage_fee) || 0)}`,
      },
      {
        label: '应扣款折损费(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.deduction_fee) || 0)}`,
      },
      {
        label: '应退款押金(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.refund_deposit) || 0)}`,
      },
    ];

    // 布局
    const layout = { labelCol: { span: 14 }, wrapperCol: { span: 10 } };

    return (
      <CoreContent title="本月应扣项">
        <DeprecatedCoreForm
          items={items}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  // 本月累计应扣项
  renderDeductibleTotal = () => {
    // 数据
    const { data } = this.props;

    // 项
    const items = [
      {
        label: '累计应扣款押金(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.accumulative_deduction_deposit) || 0)}`,
      },
      {
        label: '累计应扣款使用费(元)',
        form: `${Unit.exchangePriceCentToMathFormat((data.accumulative_deduction_usage_fee) || 0)}`,
      },
      {
        label: '累计应扣款折损费(元)',
        form: '0.00',
      },
      {
        label: '累计应退款押金(元)',
        form: '0.00',
      },
    ];

    // 布局
    const layout = { labelCol: { span: 14 }, wrapperCol: { span: 10 } };

    return (
      <CoreContent title="本月累计应扣项">
        <DeprecatedCoreForm
          items={items}
          cols={3}
          layout={layout}
        />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染基本信息 */}
        {this.renderBasicInfo()}
        {/* 渲染上月实扣 */}
        {this.renderActualBuckle()}
        {/* 上月位扣 */}
        {this.renderLatMonthNoSeen()}
        {/* 渲染本月应扣 */}
        {this.renderDeductible()}
        {/* 本月累计扣 */}
        {this.renderDeductibleTotal()}
      </div>
    );
  }
}

export default BasicInfo;

