/**
 * 报销的详情模版
 */
import is from 'is_js';
import dot from 'dot-prop';
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
  ExpenseCostOrderBelong,
  Unit,
  ExpenseCostCenterType,
  ExpenseInvoiceTaxRate,
  ExpenseCostOrderType,
  OaApplicationOrderType,
  PayModeEnumer,
} from '../../../../../application/define';

import styles from '../../common/styles.less';
import moneyIconLight from '../../../static/money_light.svg';
import moneyIconGrey from '../../../static/money_grey.svg';
import InvoiceHeader from '../../template/components/invoiceHeader';

class Index extends Component {
  static propTypes = {
    title: PropTypes.string,
    detail: PropTypes.object, // 费用单详情
    examineOrderDetail: PropTypes.object,
    costOrderAmountSummary: PropTypes.object,
    costOrderSubmitSummary: PropTypes.object,
  }

  static defaultProps = {
    title: '',
    detail: {},
    examineOrderDetail: {},
    costOrderSubmitSummary: {},
    costOrderAmountSummary: {},
  }

  componentDidMount() {
    this.fetchCostOrderAmountSummay();
  }

  componentDidUpdate(prevProps) {
    const { detail = {} } = this.props;
    if (Object.keys(detail).length !== Object.keys(prevProps.detail).length) {
      this.fetchCostOrderAmountSummay();
    }
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

  // get amount summary
  fetchCostOrderAmountSummay = () => {
    // 费用单详情
    const { detail = {} } = this.props;
    const {
      costAllocationList,
      costCenterType,
      costAccountingId,
      applicationOrderId,
      costAccountingInfo = {},
    } = detail;

    // 科目成本中心
    const costAccountType = costAccountingInfo && Object.keys(costAccountingInfo).length > 0 ? costAccountingInfo.costCenterType : undefined;

    // 科目成本中心为总部时，不调用接口
    if (costAccountType === ExpenseCostCenterType.headquarters) return;

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

  // 渲染附件文件
  renderFiles = (filesUrl, filesName) => {
    return (
      <div>
        {
          filesUrl.map((item, index) => {
            return (
              <a className={styles['app-comp-expense-manage-template-detail-refund-file']} rel="noopener noreferrer" target="_blank" key={index} href={item}>{filesName[index]}</a>
            );
          })
        }
      </div>
    );
  }

  // 费用信息
  renderRentInfo = () => {
    const { detail = {}, examineOrderDetail = {}, newMoneyRule } = this.props;
    const { applicationOrderType } = examineOrderDetail;
    const { type, isBook, totalTaxAmountAmount = 0 } = detail;
    // 费用金额判断是否为空
    const totalMoney = dot.get(detail, 'totalMoney', undefined);
    let formItems;
    if (newMoneyRule === '2') {
      formItems = [
        {
          label: '付款金额',
          form: totalMoney !== undefined ? `${Unit.exchangePriceToYuan(totalMoney)}元` : '--',
        },
        {
          label: '费用金额',
          form: totalMoney !== undefined ? `${Unit.exchangePriceToYuan(totalMoney) - Unit.exchangePriceToYuan(totalTaxAmountAmount)}元` : '--',
        }, {
          label: '是否开票',
          form: dot.get(detail, 'invoiceFlag') ? '是' : '否',
        }, {
          label: '备注',
          form: dot.get(detail, 'note', '--'),
        },
      ];
    } else {
      formItems = [
        {
          label: '费用金额',
          form: totalMoney !== undefined ? `${Unit.exchangePriceToYuan(totalMoney)}元` : '--',
        }, {
          label: '是否开票',
          form: dot.get(detail, 'invoiceFlag') ? '是' : '否',
        }, {
          label: '备注',
          form: dot.get(detail, 'note', '--'),
        },
      ];
    }

    // 费用申请 & 差旅报销显示字段
    if (applicationOrderType === OaApplicationOrderType.cost || applicationOrderType === OaApplicationOrderType.travel) {
      if (newMoneyRule === '2') {
        formItems.splice(2, 0, {
          label: '是否红冲',
          form: type === ExpenseCostOrderType.redPunch ? '是' : '否',
        });
      } else {
        formItems.splice(1, 0, {
          label: '是否红冲',
          form: type === ExpenseCostOrderType.redPunch ? '是' : '否',
        });
      }
      formItems.splice(5, 0, {
        label: '是否可记账',
        form: isBook ? '是' : '否',
      });
    }

    // @TODO 线上样式问题，如果文件名过长，会两行显示；更改之后在一行显示
    const formItemFile = [
      {
        label: '上传附件',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
        form: this.renderFiles(dot.get(detail, 'attachmentPrivateUrls', []), dot.get(detail, 'attachments', [])),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="费用信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        <DeprecatedCoreForm items={formItemFile} cols={1} />
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
        <div className={styles['app-comp-expense-manage-template-detail-refund-project']}>
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
    const {
      detail = {},
      costOrderAmountSummary,
      costOrderSubmitSummary,
      examineOrderDetail = {},
    } = this.props;

    const { costAccountingId, costCenterType, costAccountingInfo = {} } = detail;
    const costTargetId = this.getCostTargetId(costCenterType, items);

    // 科目成本中心
    const costAccountType = costAccountingInfo && Object.keys(costAccountingInfo).length > 0 ? costAccountingInfo.costCenterType : undefined;

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

    // 定义金额显示组件（科目成本归属为总部时，不显示汇总金额）
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
        <DeprecatedCoreForm items={formItems} layout={layout} className={styles['app-comp-expense-manage-template-detail-refund-share']} />
      </div>
    );
  }

  // 根据收款类型 渲染不同的form
  renderPaymentType = (type, formItems, detail) => {
    if (is.existy(type) && is.number(type) && type === PayModeEnumer.idCard) {
      formItems.push({
        label: '身份证号',
        form: dot.get(detail, 'payeeInfo.id_card_no', '--'),
      });
    }
    if (is.existy(type) && is.number(type) && type === PayModeEnumer.credit) {
      formItems.push({
        label: '统一信用代码',
        form: dot.get(detail, 'payeeInfo.credit_no', '--'),
      });
    }
  }

  // 支付信息
  renderPaymentInfo = () => {
    const { detail = {} } = this.props;

    let paymentValue = dot.get(detail, 'payeeInfo.payment', '--');
    // 收款类型 value
    const renderPaymentValue = () => {
      if (is.existy(paymentValue) && is.number(paymentValue)) {
        paymentValue = PayModeEnumer.description(paymentValue);
      }
      return paymentValue;
    };

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
      {
        label: '收款类型',
        form: renderPaymentValue(),
      },
    ];

    // 根据收款类型 渲染不同的form
    this.renderPaymentType(dot.get(detail, 'payeeInfo.payment', '--'), formItems, detail);

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="支付信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 发票信息
  renderInvoiceInfo = () => {
    const { detail = {}, newMoneyRule } = this.props;
    const {
      totalCostBillAmount = 0, // 实时汇总发票总金额
      totalTaxAmountAmount = 0, // 实时汇总发票总税额
      totalTaxDeductionAmount = 0, // 实时汇总发票总去税额
      costBillList = [], // 发票列表
      type: costOrderType,
    } = detail;

    // 正常费用单显示发票信息
    if (costOrderType !== ExpenseCostOrderType.normal) return null;
    let moneyItems;
    if (newMoneyRule === '2') {
      moneyItems = [
        {
          label: '发票总金额',
          form: `${Unit.exchangePriceToYuan(totalCostBillAmount)}元`,
        }, {
          label: '费用总金额',
          form: `${Unit.exchangePriceToYuan(totalTaxDeductionAmount)}元`,
        }, {
          label: '总税金',
          form: `${Unit.exchangePriceToYuan(totalTaxAmountAmount)}元`,
        },
      ];
    } else {
      moneyItems = [
        {
          label: '发票总金额',
          form: `${Unit.exchangePriceToYuan(totalCostBillAmount)}元`,
        }, {
          label: '总税额',
          form: `${Unit.exchangePriceToYuan(totalTaxAmountAmount)}元`,
        }, {
          label: '去税总额',
          form: `${Unit.exchangePriceToYuan(totalTaxDeductionAmount)}元`,
        },
      ];
    }

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
              },
            ];
            if (newMoneyRule === '2') {
              detailsItems.push(...[
                {
                  label: '费用金额',
                  form: `${Unit.exchangePriceToYuan(noTax)}元`,
                },
                {
                  label: '总税金',
                  form: `${Unit.exchangePriceToYuan(tax)}元`,
                },
              ]);
            } else {
              detailsItems.push(...[
                {
                  label: '税额',
                  form: `${Unit.exchangePriceToYuan(tax)}元`,
                }, {
                  label: '去税额',
                  form: `${Unit.exchangePriceToYuan(noTax)}元`,
                },
              ]);
            }
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
            {/* 费用信息 */}
            {this.renderRentInfo()}

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
