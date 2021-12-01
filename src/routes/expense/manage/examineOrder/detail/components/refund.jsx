/**
 * 审批单详情页面 - 退款申请单
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import {
  ExpenseCostOrderBelong,
  ExpenseCostCenterType,
  Unit,
} from '../../../../../../application/define';
import { DeprecatedCoreForm, CoreFinder } from '../../../../../../components/core';

const { CoreFinderList } = CoreFinder;

class Refund extends Component {

  // get costTargetId by cost center
  getCostTargetId = (costCenter, value) => {
    if (costCenter === ExpenseCostCenterType.project) return value.platformCode;
    if (costCenter === ExpenseCostCenterType.headquarter) return value.supplierId;
    if (costCenter === ExpenseCostCenterType.city) return value.cityCode;
    if (costCenter === ExpenseCostCenterType.district) return value.bizDistrictId;
    if (costCenter === ExpenseCostCenterType.knight) return value.bizDistrictId;
  }

  // 预览组件
  renderCorePreview = (value, filename) => {
    if (Array.isArray(value) && dot.get(value, '0')) {
      const data = value.map((item, index) => {
        return { key: filename[index], url: item };
      });
      return (
        <CoreFinderList data={data} />
      );
    }
    return '--';
  };

  // 渲染成本分摊
  renderCostShare = (costOrderDetail) => {
    // 成本分摊子项目
    const costItems = dot.get(costOrderDetail, 'cost_allocation_list', []) || [];
    return (
      <div>
        <Row>
          <Col span={24}>{ExpenseCostOrderBelong.description(dot.get(costOrderDetail, 'allocation_mode'))}</Col>
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
    // 获取月汇总金额
    const { examineOrderDetail, costOrderDetail, costOrderAmountSummary, costOrderSubmitSummary } = this.props;
    // 获取科目id
    const costAccountingId = dot.get(costOrderDetail, 'cost_accounting_id');
    // 成本中心归属类型
    const costCenterType = dot.get(costOrderDetail, 'cost_center_type');
    // 获取归属对象id
    const costTargetId = this.getCostTargetId(costCenterType, item);
    // 定义成本分摊平台、供应商、城市、商圈
    let name;
    // 如果平台存在，则显示平台
    if (is.existy(item.platform_name) && is.not.empty(item.platform_name)) {
      name = `${item.platform_name}`;
    }
    // 如果供应商存在，则显示平台、供应商
    if (is.existy(item.supplier_name) && is.not.empty(item.supplier_name)) {
      name = `${item.platform_name} - ${item.supplier_name}`;
    }
    // 如果城市存在，则显示平台、供应商、城市
    if (is.existy(item.city_name) && is.not.empty(item.city_name)) {
      name = `${item.platform_name} - ${item.supplier_name} - ${item.city_name}`;
    }
    // 如果商圈存在，则显示平台、供应商、城市、商圈
    if (is.existy(item.biz_district_name) && is.not.empty(item.biz_district_name)) {
      name = `${item.platform_name} - ${item.supplier_name} - ${item.city_name} - ${item.biz_district_name}`;
    }

    // 审批单第一次提报时间
    const firstCreatedTime = dot.get(examineOrderDetail, 'submitAt', undefined);

    // 获取月份
    let bookMonth = '';
    let submitAt = '';
    // 判断提报时间是否存在
    if (firstCreatedTime) {
      bookMonth = moment(firstCreatedTime).format('YYYYMM');
      submitAt = moment(firstCreatedTime).format('YYYY-MM-DD');
    } else {
      bookMonth = moment().format('YYYYMM');
      submitAt = moment().format('YYYY-MM');
    }
    // 当月已付款费用合计的命名空间
    const namespace = `${costAccountingId}-${costTargetId}-${bookMonth}`;
    // 当月已提报费用合计的命名空间
    const submitNamespace = `${costAccountingId}-${costTargetId}-${submitAt}`;
    // 当月已提报费用金额
    const submitMoney = dot.get(costOrderSubmitSummary, `${submitNamespace}.amountMoney`, 0);

    // 当月已付款费用合计
    const totalMoney = dot.get(costOrderAmountSummary, `${namespace}.money`, 0);
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
    if (item.money) {
      formItems.unshift({
        label: '分摊金额',
        span: 6,
        layout: { labelCol: { span: 13 }, wrapperCol: { span: 11 } },
        form: `${Unit.exchangePriceToYuan(dot.get(item, 'money', '--'))}元`,
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

  // 渲染金额调整
  renderUpdateCostRecord = (costOrderDetail) => {
    // 费用金额判断是否为空
    const totalMoney = dot.get(costOrderDetail, 'total_money', undefined);
    return totalMoney !== undefined ? `${Unit.exchangePriceToYuan(totalMoney)}元` : '--';
  }

  // 渲染退款信息
  render = () => {
    const { costOrderDetail } = this.props;
    // 退款金额
    const refundAmountInfo = [
      {
        label: '退款金额',
        layout: { labelCol: { span: 9, pull: 3 }, wrapperCol: { span: 15, pull: 3 } },
        form: this.renderUpdateCostRecord(costOrderDetail),
      }, {
        label: '费用分组',
        form: dot.get(costOrderDetail, 'cost_group_name'),
      }, {
        label: '科目',
        form: `${dot.get(costOrderDetail, 'cost_accounting_info.name', '--')}(${dot.get(costOrderDetail, 'cost_accounting_info.accounting_code', '--')}})`,
      },
    ];

    // 退款分摊
    const refundCostShare = [
      {
        label: '成本分摊',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: this.renderCostShare(costOrderDetail),
      },
    ];

    // 发票抬头与退款说明与上传附件布局
    const refundNoteAndAttachment = [
      {
        label: '发票抬头',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: dot.get(costOrderDetail, 'invoice_title', '--') || '--',
      },
      {
        label: '退款说明',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: dot.get(costOrderDetail, 'note'),
      }, {
        label: '上传附件',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: this.renderCorePreview(dot.get(costOrderDetail, 'attachment_private_urls', []), dot.get(costOrderDetail, 'attachments', [])),
      },
    ];
    // 费用单号
    const costNo = [
      {
        label: '费用单号',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: dot.get(costOrderDetail, '_id', '--') || '--',
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <div style={{ marginTop: '10px', width: '100%', borderTop: '3px dashed #ccc', backgroundColor: 'rgba(251,245,246)' }}>
        <h2 style={{ marginTop: '10px', width: '100%', textAlign: 'center', height: '40px', lineHeight: '40px' }}>退款申请单</h2>
        {/* 渲染基费用单号 */}
        <DeprecatedCoreForm items={costNo} cols={1} />
        {/* 渲染退款金额信息 */}
        <DeprecatedCoreForm items={refundAmountInfo} cols={3} layout={layout} />
        {/* 渲染分摊信息 */}
        <DeprecatedCoreForm items={refundCostShare} cols={1} />
        {/* 渲染退款说明,附件  */}
        <DeprecatedCoreForm items={refundNoteAndAttachment} cols={1} />
      </div>
    );
  }
}

export default Refund;
