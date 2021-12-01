/**
 * 差旅报销的详情模版
 */
import dot from 'dot-prop';
import is from 'is_js';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Tooltip } from 'antd';
import React, { Component } from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import {
  ExpenseInvoiceType,
  ExpenseCostCenterType,
  ExpenseCostOrderBelong,
  Unit,
  ExpenseCostOrderType,
  ExpenseInvoiceTaxRate,
} from '../../../../../application/define';
import styles from '../../common/styles.less';
import moneyIconLight from '../../../static/money_light.svg';
import moneyIconGrey from '../../../static/money_grey.svg';
import InvoiceHeader from '../../template/components/invoiceHeader';

class Index extends Component {
  static propTypes = {
    title: PropTypes.string,
    detail: PropTypes.object,
    examineOrderDetail: PropTypes.object,
    costOrderSubmitSummary: PropTypes.object,
    costOrderAmountSummary: PropTypes.object,
  }

  static defaultProps = {
    title: '',
    detail: {},
    examineOrderDetail: {},
    costOrderAmountSummary: {},
    costOrderSubmitSummary: {},
  }

  componentDidMount() {
    this.fetchCostOrderAmountSummay();
  }

  // get costTargetId by cost center
  getCostTargetId = (costCenter, value) => {
    if (costCenter === ExpenseCostCenterType.project) return value.platformCode;
    if (costCenter === ExpenseCostCenterType.headquarter) return value.supplierId;
    if (costCenter === ExpenseCostCenterType.city) return value.cityCode;
    if (costCenter === ExpenseCostCenterType.district) return value.bizDistrictId;
    if (costCenter === ExpenseCostCenterType.knight) return value.bizDistrictId;
    if (costCenter === ExpenseCostCenterType.person) return value.staffInfo.identity_card_id;
    if (costCenter === ExpenseCostCenterType.team) return value.teamId;
    if (costCenter === ExpenseCostCenterType.asset) return value.bizDistrictId;
  }

  fetchCostOrderAmountSummay = () => {
    const { detail = {} } = this.props;

    const {
      costAllocationList,
      costCenterType,
      costAccountingId,
      applicationOrderId,
    } = detail;

    costAllocationList.forEach((v) => {
      const { platformCode, supplierId, cityCode, bizDistrictId, teamId, staffInfo: { identity_card_id: staffId } = {} } = v;
      const payload = {
        costCenter: costCenterType,
        costTargetId: this.getCostTargetId(costCenterType, v),
        subjectId: costAccountingId,
        applicationOrderId,
      };
      // 定义提报金额参数
      const params = {
        costCenter: costCenterType,
        applicationOrderId,
        accountingId: costAccountingId,   // 科目
        costTargetId: this.getCostTargetId(costCenterType, v),  // 成本归属id
        platformCode,           // 平台
        supplierId,               // 供应商
        cityCode,                   // 城市
        bizDistrictId,          // 商圈
        assetsId: v.assetsId,          // 资产
        teamId,
        staffId,
      };
      this.props.dispatch({ type: 'expenseCostOrder/fetchAmountSummary', payload });
      // 获取提报金额
      this.props.dispatch({ type: 'expenseCostOrder/fetchSubmitSummary', payload: params });
    });
  }
  // 预计出差时间
  renderExpectDate = (record) => {
    if (!record.bizExtraTravelApplyOrderInfo || record.bizExtraTravelApplyOrderInfo.expect_done_at === null || record.bizExtraTravelApplyOrderInfo.expect_start_at === null) {
      return '--';
    }
    const doneDate = moment(dot.get(record, 'bizExtraTravelApplyOrderInfo.expect_done_at', undefined)).format('YYYY.MM.DD HH:00');
    const startDate = moment(dot.get(record, 'bizExtraTravelApplyOrderInfo.expect_start_at', undefined)).format('YYYY.MM.DD HH:00');
    const date = dot.get(record, 'bizExtraTravelApplyOrderInfo.expect_start_at', undefined) && dot.get(record, 'bizExtraTravelApplyOrderInfo.expect_done_at', undefined) ? `${startDate} - ${doneDate}` : '--';
    return (<span>{date}</span>);
  }
  // 出差起始地
  renderDeparture = (record) => {
    const departure = dot.get(record, 'departure', {});
    let address;
    if (dot.get(record, 'departure.province_name', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}`;
    }
    if (dot.get(record, 'departure.city_name', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}${dot.get(record, 'departure.city_name', undefined) || ''}`;
    }
    if (dot.get(record, 'departure.area_name', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}${dot.get(record, 'departure.city_name', undefined) || ''}${dot.get(record, 'departure.area_name', undefined) || ''}`;
    }
    if (dot.get(record, 'departure.detailed_address', undefined) !== undefined) {
      address = `${dot.get(record, 'departure.province_name', undefined)}${dot.get(record, 'departure.city_name', undefined) || ''}${dot.get(record, 'departure.area_name', undefined) || ''}${dot.get(record, 'departure.detailed_address', undefined)}`;
    }
    if (is.not.empty(departure)) {
      return address;
    } else {
      return '--';
    }
  }
  // 出差目的地
  renderDestination = (record) => {
    const destination = dot.get(record, 'destination', {});
    let address;
    if (dot.get(record, 'destination.province_name', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}`;
    }
    if (dot.get(record, 'destination.city_name', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}${dot.get(record, 'destination.city_name', undefined) || ''}`;
    }
    if (dot.get(record, 'destination.area_name', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}${dot.get(record, 'destination.city_name', undefined) || ''}${dot.get(record, 'destination.area_name', undefined) || ''}`;
    }
    if (dot.get(record, 'destination.detailed_address', undefined) !== undefined) {
      address = `${dot.get(record, 'destination.province_name', undefined)}${dot.get(record, 'destination.city_name', undefined) || ''}${dot.get(record, 'destination.area_name', undefined) || ''}${dot.get(record, 'destination.detailed_address', undefined)}`;
    }
    if (is.not.empty(destination)) {
      return address;
    } else {
      return '--';
    }
  }
  // 差旅地点
  renderPlace = (record) => {
    return `${this.renderDeparture(record)}-${this.renderDestination(record)}`;
  }
  // 出差实际时间
  renderActualDate = (record) => {
    if (!record.bizExtraTravelApplyOrderInfo || record.bizExtraTravelApplyOrderInfo.actual_done_at === null || record.bizExtraTravelApplyOrderInfo.actual_start_at === null) {
      return '--';
    }
    const doneDate = moment(dot.get(record, 'bizExtraTravelApplyOrderInfo.actual_done_at', undefined)).format('YYYY.MM.DD HH:00');
    const startDate = moment(dot.get(record, 'bizExtraTravelApplyOrderInfo.actual_start_at', undefined)).format('YYYY.MM.DD HH:00');
    const date = dot.get(record, 'bizExtraTravelApplyOrderInfo.expect_start_at', undefined) && dot.get(record, 'bizExtraTravelApplyOrderInfo.expect_done_at', undefined) ? `${startDate} - ${doneDate}` : '--';
    return (<span>{date}</span>);
  }

  // 出差信息
  renderTravelInfo = () => {
    const { detail = {} } = this.props;
    const formItems = [
      {
        label: '出差申请单号',
        form: dot.get(detail, 'bizExtraTravelApplyOrderInfo._id', undefined) ?
          <a href={`/#/Expense/TravelApplication/Detail?id=${dot.get(detail, 'bizExtraTravelApplyOrderInfo._id')}`} target="_blank" rel="noopener noreferrer">
            {dot.get(detail, 'bizExtraTravelApplyOrderInfo._id', undefined)}
          </a> : '--',
      }, {
        label: '实际出差人',
        form: dot.get(detail, 'bizExtraTravelApplyOrderInfo.apply_user_name', '--'),
      }, {
        label: '预计出差时间',
        form: this.renderExpectDate(detail),
      }, {
        label: '出差地点',
        form: this.renderPlace(detail.bizExtraTravelApplyOrderInfo),
      }, {
        label: '实际出差时间',
        form: this.renderActualDate(detail),
      }, {
        label: '出差天数',
        form: dot.get(detail, 'bizExtraTravelApplyOrderInfo.actual_apply_days', 0) || '--',
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="出差信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 费用信息
  renderRentInfo = () => {
    const { detail = {} } = this.props;
    const { type, isBook, totalTaxAmountAmount = 0 } = detail;
    // 费用金额判断是否为空
    const totalMoney = dot.get(detail, 'totalMoney', undefined);
    const formItems = [
      {
        label: '付款金额',
        form: totalMoney !== undefined ? `${Unit.exchangePriceToYuan(totalMoney)}元` : '--',
      },
      {
        label: '费用金额',
        form: totalMoney !== undefined ? `${Unit.exchangePriceToYuan(totalMoney) - Unit.exchangePriceToYuan(totalTaxAmountAmount)}元` : '--',
      }, {
        label: '是否开发票',
        form: dot.get(detail, 'invoiceFlag') ? '是' : '否',
      },
      {
        label: '是否红冲',
        form: type === ExpenseCostOrderType.redPunch ? '是' : '否',
      },
      {
        label: '是否可记账',
        form: isBook ? '是' : '否',
      },
    ];

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="费用信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }
  // 差旅费用明细
  renderRentDetail = () => {
    const { detail = {} } = this.props;
    const formItems = [
      {
        label: '补助（元）',
        form: dot.get(detail, 'bizExtraData.subsidy_fee', '--'),
      }, {
        label: '住宿（元）',
        form: dot.get(detail, 'bizExtraData.stay_fee', '--'),
      }, {
        label: '往返交通费（元）',
        form: dot.get(detail, 'bizExtraData.transport_fee', '--'),
      }, {
        label: '市内交通费（元）',
        form: dot.get(detail, 'bizExtraData.urban_transport_fee', '--'),
      }, {
        label: '其它（元）',
        form: dot.get(detail, 'bizExtraData.other_fee', '--'),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="差旅费用明细">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 项目信息
  renderExpenseInfo = () => {
    const { detail = {} } = this.props;
    const { costAccountingInfo = {} } = detail;
    // 科目成本中心
    const costAccountType = costAccountingInfo && Object.keys(costAccountingInfo).length > 0 ? costAccountingInfo.costCenterType : undefined;

    const formItems = [
      {
        label: '科目',
        form: `${dot.get(detail, 'costAccountingInfo.name', '--')}(${dot.get(detail, 'costAccountingCode', '--')})`,
      }, {
        label: '成本分摊',
        form: ExpenseCostOrderBelong.description(dot.get(detail, 'allocationMode')),
      },
      {
        label: '发票抬头',
        form: costAccountType === ExpenseCostCenterType.headquarters ?
        (<InvoiceHeader
          invoiceVal={dot.get(detail, 'invoiceTitle', undefined)}
          platform={dot.get(detail, 'platformCodes.0', undefined)}
          isDetail
        />) : dot.get(detail, 'invoiceTitle', '--'),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    // 子项目信息
    const costItems = dot.get(detail, 'costAllocationList', []) || [];

    return (
      <CoreContent title="项目信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        <div className={styles['app-comp-expense-manage-template-detail-travel-project']}>
          {/* 渲染子项目信息 */}
          {
            costItems.map((item, key) => {
              return this.renderCostItems(item, key);
            })
          }
        </div>
      </CoreContent>
    );
  }

  // 渲染子项目信息
  renderCostItems = (items, key) => {
    const { costOrderAmountSummary = {}, examineOrderDetail = {}, costOrderSubmitSummary = {}, detail = {} } = this.props;
    const { costAccountingId, costCenterType, costAccountingInfo = {} } = detail;

    // 科目成本中心
    const costAccountType = costAccountingInfo && Object.keys(costAccountingInfo).length > 0 ? costAccountingInfo.costCenterType : undefined;

    const costTargetId = this.getCostTargetId(costCenterType, items);
    // 获取审批单提报时间
    const firstCreatedTime = dot.get(examineOrderDetail, 'submitAt', undefined);
    let bookMonth = '';   // 提报时间(已付款金额使用的命名空间)
    let submitAt = '';    // 提报时间(已提报金额使用的命名空间)
    // 判断提报时间是否有值,并定义不同的时间格式
    if (firstCreatedTime) {
      bookMonth = moment(firstCreatedTime).format('YYYYMM');
      submitAt = moment(firstCreatedTime).format('YYYY-MM-DD');
    } else {
      bookMonth = moment().format('YYYYMM');
      submitAt = moment().format('YYYY-MM-DD');
    }
    // 渲染气泡显示
    const tooltipText = `${moment(bookMonth, 'YYYYMM').format('YYYY年MM月费用合计（元）: 已提报 | 已付款')}`;
    // 月汇总已付款命名空间
    const namespace = `${costAccountingId}-${costTargetId}-${bookMonth}`;
    // 月汇总已提报命名空间
    const submitnamespace = `${costAccountingId}-${costTargetId}-${submitAt}`;
    // 获取已付款金额
    const amountSummary = dot.get(costOrderAmountSummary, `${namespace}.money`, undefined);
    // 定义提报金额
    const submitSummary = dot.get(costOrderSubmitSummary, `${submitnamespace}.amountMoney`, undefined);
    // 定义月汇总单付款总金额
    const totalMoney = amountSummary && amountSummary > 0 ? amountSummary : 0;
    // 定义月汇总单付款总金额
    const submitMoney = submitSummary && submitSummary > 0 ? submitSummary : 0;
    // 定义金额图标显示
    const src = totalMoney !== 0 || submitMoney !== 0 ? moneyIconLight : moneyIconGrey;
    // 定义金额图标样式
    const className = totalMoney !== 0 || submitMoney !== 0 ? styles['app-comp-expense-manage-common-moneyiconlight'] : styles['app-comp-expense-manage-common-moneyicongrey'];

    // 定义金额显示组件
    const costOrderAmountSummaryFormItem = costAccountType === ExpenseCostCenterType.headquarters ? '' : {
      layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
      offset: 1,
      span: 4,
      label: '',
      form: (
        <Tooltip title={tooltipText}>
          <div className={styles['app-comp-expense-manage-common-moneywrap']}>
            <img src={src} alt="" className={className} />
            <span className={submitMoney !== 0 ? styles['app-comp-expense-manage-common-moneytextlight'] : null}>¥{Unit.exchangePriceCentToMathFormat(submitMoney)}</span>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <span className={totalMoney !== 0 ? styles['app-comp-expense-manage-common-moneytextlight'] : null}>¥{Unit.exchangePriceCentToMathFormat(totalMoney)}</span>
          </div>
        </Tooltip>
      ) };

    const { staffInfo = {}, teamName, teamId } = items;

    // 科目成本中心为总部，成本分摊
    let headquartersItem = [];

    // 个人
    if (costCenterType === ExpenseCostCenterType.person) {
      if (is.existy(staffInfo) && is.not.empty(staffInfo)) {
        const {
          identity_card_id: staffId,
          name: staffName,
        } = staffInfo;
        if (teamName) {
          headquartersItem = [
            {
              label: '个人',
              span: 8,
              form: `${teamName} - ${staffName}(${staffId})`,
            },
          ];
        } else {
          headquartersItem = [
            {
              label: '个人',
              span: 8,
              form: `${staffName}(${staffId})`,
            },
          ];
        }
      }
    }

    // 团队
    if (costCenterType === ExpenseCostCenterType.team) {
      headquartersItem = [
        {
          label: '团队',
          span: 8,
          form: `${teamName} - ${teamId}`,
        },
      ];
    }

    const costAllocationItem = costAccountType === ExpenseCostCenterType.headquarters
      ? headquartersItem
      : [
        {
          label: '平台',
          span: 2,
          form: dot.get(items, 'platformName', '--'),
        }, {
          label: '供应商',
          span: 5,
          form: dot.get(items, 'supplierName', '--'),
        }, {
          label: '城市',
          span: 3,
          form: dot.get(items, 'cityName', '--'),
        }, {
          label: '商圈',
          span: 5,
          form: dot.get(items, 'bizDistrictName', '--'),
        },
      ];

    const formItems = [
      costOrderAmountSummaryFormItem,
      ...costAllocationItem,
    ];

    if (items.money) {
      formItems.push({
        label: '分摊金额',
        span: 4,
        form: `${Unit.exchangePriceToYuan(dot.get(items, 'money', '--'))}元`,
      });
    }
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    return (
      <div key={key}>
        <DeprecatedCoreForm items={formItems} layout={layout} className={styles['app-comp-expense-manage-template-detail-travel-share']} />
      </div>
    );
  }
  // 支付信息
  renderPaymentInfo = () => {
    const { detail = {} } = this.props;
    const formItems = [
      {
        label: '收款人',
        form: dot.get(detail, 'payeeInfo.card_name', '--'),
      }, {
        label: '收款账号',
        form: dot.get(detail, 'payeeInfo.card_num', '--'),
      }, {
        label: '开户支行',
        form: dot.get(detail, 'payeeInfo.bank_details', '--'),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="支付信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 发票信息
  renderInvoiceInfo = () => {
    const { detail = {} } = this.props;
    const {
      totalCostBillAmount = 0, // 实时汇总发票总金额
      totalTaxAmountAmount = 0, // 实时汇总发票总税额
      totalTaxDeductionAmount = 0, // 实时汇总发票总去税额
      costBillList = [], // 发票列表
    } = detail;

    const moneyItems = [
      {
        label: '发票总金额',
        form: `${Unit.exchangePriceToYuan(totalCostBillAmount)}元`,
      }, {
        label: '费用总金额',
        form: `${Unit.exchangePriceToYuan(totalTaxDeductionAmount)}元`,
      },
      {
        label: '总税金',
        form: `${Unit.exchangePriceToYuan(totalTaxAmountAmount)}元`,
      },
    ];

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="发票信息">
        <DeprecatedCoreForm items={moneyItems} cols={3} layout={layout} />
        {
          costBillList.map((item) => {
            const {
              code = undefined,
              type = undefined,
              money = 0,
              tax_rate: taxRate = undefined,
              tax_amount: tax = 0,
              tax_deduction: noTax = 0,
            } = item;

            const detailsItems = [
              {
                label: '发票编号',
                form: code || '--',
              }, {
                label: '发票类型',
                form: type ? ExpenseInvoiceType.description(type) : '--',
              }, {
                label: '发票金额',
                form: `${Unit.exchangePriceToYuan(money)}元`,
              }, {
                label: '税率',
                form: taxRate !== undefined ? ExpenseInvoiceTaxRate.description(taxRate) : '--',
              }, {
                label: '费用金额',
                form: `${Unit.exchangePriceToYuan(noTax)}元`,
              }, {
                label: '税金',
                form: `${Unit.exchangePriceToYuan(tax)}元`,
              },
            ];
            return <DeprecatedCoreForm items={detailsItems} cols={6} layout={layout} />;
          })
        }
      </CoreContent>
    );
  }

  render = () => {
    const { title } = this.props;
    return (
      <div>
        <Form layout="horizontal">
          <CoreContent title={title}>
            {/* 出差信息 */}
            {this.renderTravelInfo()}

            {/* 费用信息 */}
            {this.renderRentInfo()}

            {/* 差旅费用明细 */}
            {this.renderRentDetail()}

            {/* 项目信息 */}
            {this.renderExpenseInfo()}

            {/* 支付信息 */}
            {this.renderPaymentInfo()}

            {/* 发票信息 */}
            {this.renderInvoiceInfo()}
          </CoreContent>
        </Form>
      </div>
    );
  }
}

function mapStateToProps({ expenseCostOrder: { costOrderAmountSummary, costOrderSubmitSummary } }) {
  return { costOrderAmountSummary, costOrderSubmitSummary };
}
export default connect(mapStateToProps)(Index);
