/**
 * 费用管理 - 付款审批 - 详情 - 成本分摊组件（详情）
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Row, Col } from 'antd';

import {
  Unit,
  ExpenseCostOrderBelong,
  ExpenseCostCenterType,
} from '../../../../application/define';

// TODO: 折行 @王晋
import {
  DeprecatedCoreForm,
} from '../../../../components/core';

class CostAllocation extends Component {
  componentDidMount() {
    const {
      detail,
      examineOrderDetail,
    } = this.props;

    const {
      costAllocationList = [],       // 成本费用记录分摊清单
      // cost_center_type: costCenterType,           // 成本中心归属类型名称
      // cost_accounting_id: costAccountingId,         // 费用科目ID
      applicationOrderId,       // 归属审批单ID
      costAccountingInfo: {
        costAccountingId,
        costCenterType,
      } = {
        costAccountingId: '',
        costCenterType: '',
      },
    } = detail;

    // 审批单第一次提报时间
    const { submitAt } = examineOrderDetail;

    // 根据成本费用记录分摊列表获取当月已付款费用合计
    costAllocationList.forEach((v) => {
      // 已付款金额参数
      const payload = {
        costCenter: costCenterType,
        costTargetId: this.getCostTargetId(costCenterType, v),
        subjectId: costAccountingId,
        applicationOrderId,
        submitAt,
      };

      // 定义提报金额参数
      const params = {
        costCenter: costCenterType,
        applicationOrderId,               // 审批单id
        accountingId: costAccountingId,   // 科目id
        costTargetId: this.getCostTargetId(costCenterType, v),                     // 成本归属id
        platformCode: v.platformCode,           // 平台
        supplierId: v.supplierId,               // 供应商
        cityCode: v.cityCode,                   // 城市
        bizDistrictId: v.bizDistrictId,          // 商圈
        submitAt,
        assetsId: v.assetsId,          // 资产
      };

      // 获取已付款金额
      this.props.dispatch({ type: 'expenseCostOrder/fetchAmountSummary', payload });

      // 获取提报金额
      this.props.dispatch({ type: 'expenseCostOrder/fetchSubmitSummary', payload: params });
    });
  }

  // get costTargetId by cost center
  getCostTargetId = (costCenter, value) => {
    if (costCenter === ExpenseCostCenterType.project) return value.platformCode;
    if (costCenter === ExpenseCostCenterType.headquarter) return value.supplierId;
    if (costCenter === ExpenseCostCenterType.city) return value.cityCode;
    if (costCenter === ExpenseCostCenterType.district) return value.bizDistrictId;
    if (costCenter === ExpenseCostCenterType.knight) return value.bizDistrictId;
  }

  // 获取分摊name
  fetchAllocationName = (item) => {
    const {
      platformName, // 平台
      supplierName, // 供应商
      cityName, // 城市
      bizDistrictName, // 商圈
    } = item;

    // 定义成本分摊平台、供应商、城市、商圈
    let name;
    // 如果平台存在，则显示平台
    if (is.existy(platformName) && is.not.empty(platformName)) {
      name = `${platformName}`;
    }
    // 如果供应商存在，则显示平台、供应商
    if (is.existy(supplierName) && is.not.empty(supplierName)) {
      name = `${platformName} - ${supplierName}`;
    }
    // 如果城市存在，则显示平台、供应商、城市
    if (is.existy(cityName) && is.not.empty(cityName)) {
      name = `${platformName} - ${supplierName} - ${cityName}`;
    }
    // 如果商圈存在，则显示平台、供应商、城市、商圈
    if (is.existy(bizDistrictName) && is.not.empty(bizDistrictName)) {
      name = `${platformName} - ${supplierName} - ${cityName} - ${bizDistrictName}`;
    }

    return name;
  }

  // 获取当月已付款金额
  fetchAmountMoney = (item) => {
    const {
      detail,
      examineOrderDetail,
      costOrderSubmitSummary,
      costOrderAmountSummary,
    } = this.props;

    const {
      // cost_accounting_id: costAccountingId, // 科目id
      // cost_center_type: costCenterType, // 成本中心归属类型
      costAccountingInfo: {
        costAccountingId,
        costCenterType,
      } = {
        costAccountingId: '',
        costCenterType: '',
      },
    } = detail;


    const {
      submitAt: firstCreatedTime = undefined, // 审批单第一次提报时间
    } = examineOrderDetail;

    // 获取归属对象id
    const costTargetId = this.getCostTargetId(costCenterType, item);

    // 获取月份
    let bookMonth = '';
    let submitAt = '';
    // 判断提报时间是否存在
    if (firstCreatedTime) {
      bookMonth = moment(firstCreatedTime).format('YYYYMM');
      submitAt = moment(firstCreatedTime).format('YYYY-MM-DD');
    } else {
      bookMonth = moment().format('YYYYMM');
      submitAt = moment().format('YYYY-MM-DD');
    }

    // 当月已付款费用合计的命名空间
    const namespace = `${costAccountingId}-${costTargetId}-${bookMonth}`;

    // 当月已提报费用合计的命名空间
    const submitNamespace = `${costAccountingId}-${costTargetId}-${submitAt}`;

    // 当月已提报费用金额
    const submitMoney = dot.get(costOrderSubmitSummary, `${submitNamespace}.amountMoney`, 0);

    // 当月已付款费用合计
    const totalMoney = dot.get(costOrderAmountSummary, `${namespace}.money`, 0);

    return { submitMoney, totalMoney };
  }

  // 渲染成本分摊
  renderCostShare = () => {
    const {
      detail, // 费用单详情
    } = this.props;

    const {
      costAllocationList: costItems = [], // 成本分摊子项目
      allocationMode, // 分摊方式
    } = detail;

    return (
      <div>
        <Row>
          <Col span={24}>{ExpenseCostOrderBelong.description(allocationMode)}</Col>
          <Col span={24}>
            {
              costItems.map((item, key) => {
                return this.renderCostShareItems(item, key);
              })
            }
          </Col>
        </Row>
      </div>
    );
  }

  // 渲染成本分摊子项目
  renderCostShareItems = (item, key) => {
    const {
      money, // 分摊项金额
    } = item;

    const {
      submitMoney,
      totalMoney,
    } = this.fetchAmountMoney(item);

    // 分摊name
    const name = this.fetchAllocationName(item);

    const formItems = [
      {
        label: '当月已提报费用合计',
        span: 9,
        layout: { labelCol: { span: 15 }, wrapperCol: { span: 9 } },
        form: `${Unit.exchangePriceCentToMathFormat(submitMoney)}元`,
      },
      {
        label: '当月已付款费用合计',
        span: 9,
        layout: { labelCol: { span: 15 }, wrapperCol: { span: 9 } },
        form: `${Unit.exchangePriceCentToMathFormat(totalMoney)}元`,
      },
    ];

    // 判断分摊金额是否存在，存在则渲染
    if (money) {
      formItems.unshift({
        label: '分摊金额',
        span: 6,
        layout: { labelCol: { span: 13 }, wrapperCol: { span: 11 } },
        form: `${Unit.exchangePriceToYuan(money)}元`,
      });
    }

    return (
      <Row key={key}>
        <Col span={10}>{name}</Col>
        <Col span={14}>
          <DeprecatedCoreForm items={formItems} />
        </Col>
      </Row>
    );
  }

  // 内容
  renderContent = () => {
    // 成本分摊子项目布局
    const costShare = [
      {
        label: '成本分摊',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
        form: this.renderCostShare(),
      },
    ];

    return (
      <DeprecatedCoreForm
        items={costShare}
        cols={1}
      />
    );
  }

  // TODO: 将renderContent修改问render，删除多余代码 @王晋
  render() {
    return this.renderContent();
  }
}

function mapStateToProps({
  expenseCostOrder: {
    costOrderAmountSummary, // 月汇总金额
    costOrderSubmitSummary, // 已提报金额
  },
}) {
  return {
    costOrderAmountSummary, // 月汇总金额
    costOrderSubmitSummary, // 已提报金额
  };
}
export default connect(mapStateToProps)(CostAllocation);
