/**
 * 审批单详情页面 - 每个费用单组件 Expense/Manage/ExamineOrder/Detail
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import {
  ExpenseCostOrderBelong,
  ExpenseCostCenterType,
  Unit,
  ExpenseCostOrderState,
  InvoiceAjustAction,
} from '../../../../application/define';
import { DeprecatedCoreForm, CoreFinder } from '../../../../components/core';
import RefundCostOrder from '../refund/costOrder/detail';
import InvoiceCostOrder from '../invoiceAjust/costOrder/detail';

const { CoreFinderList } = CoreFinder;

class CostOrderItem extends Component {
// eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      fileType: null, // 文件预览类型
      fileUrl: null, // 文件预览地址
      visible: false, // 是否显示预览弹窗
      fileName: '', // 文件预览名称
    };
  }
  static propTypes = {
    recordId: PropTypes.string,
    examineOrderDetail: PropTypes.object,
    costOrderDetail: PropTypes.object,
  }

  static defaultProps = {
    recordId: '',
    examineDetail: {},
    examineOrderDetail: {},
    costOrderDetail: {},
    isRefund: false,
  }
  componentDidMount() {
    const { costOrderDetail } = this.props;
    this.fetchCostOrderAmountSummay(costOrderDetail);
  }

  // 预览
  onChangePreview = (key, url) => {
    if (url && key) {
      let fileType = null;
      const reg = /\.(\w+)$/;
      fileType = key.match(reg)[1];
      this.onUploadSuccess(fileType, url, key);
      return;
    }

    this.props.dispatch({
      type: 'applicationFiles/fetchKeyUrl',
      payload: {
        key,
        onUploadSuccess: (type, adress) => this.onUploadSuccess(type, adress, key),
      },
    });
  };


   // 设置预览参数
  onUploadSuccess = (type, url, name) => {
    this.setState({ fileName: name, fileType: type, fileUrl: url, visible: true });
  }
  // get costTargetId by cost center
  getCostTargetId = (costCenter, value) => {
    if (costCenter === ExpenseCostCenterType.project) return value.platformCode;
    if (costCenter === ExpenseCostCenterType.headquarter) return value.supplierId;
    if (costCenter === ExpenseCostCenterType.city) return value.cityCode;
    if (costCenter === ExpenseCostCenterType.district) return value.bizDistrictId;
    if (costCenter === ExpenseCostCenterType.knight) return value.bizDistrictId;
  }
  // 取消弹窗
  setVisible=() => { this.setState({ visible: false }); }
  // get amount summary
  fetchCostOrderAmountSummay = (res) => {
    const {
    costAllocationList,       // 成本费用记录分摊清单
    costCenterType,           // 成本中心归属类型名称
    costAccountingId,         // 费用科目ID
    applicationOrderId,       // 归属审批单ID
  } = res;
  // 审批单第一次提报时间
    const { submitAt } = this.props.examineOrderDetail;
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

  // 预览组件
  renderCorePreview = (value, filesName) => {
    if (Array.isArray(value) && dot.get(value, '0')) {
      const data = value.map((item, index) => {
        return { key: filesName[index], url: item };
      });
      return (
        <CoreFinderList data={data} />
      );
    }
    return '--';
  };

  // 渲染成本分摊
  renderCostShare = () => {
    const { costOrderDetail } = this.props;
    // 成本分摊子项目
    const costItems = dot.get(costOrderDetail, 'costAllocationList', []) || [];
    return (
      <div>
        <Row>
          <Col span={24}>{ExpenseCostOrderBelong.description(dot.get(costOrderDetail, 'allocationMode'))}</Col>
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
    const { examineOrderDetail, costOrderDetail } = this.props;
    // 获取平台、供应商、城市、商圈
    const { platformName, supplierName, cityName, bizDistrictName } = item;
    // 获取月汇总金额
    const { costOrderAmountSummary, costOrderSubmitSummary } = this.props;
    // 获取科目id、成本中心归属类型
    const { costAccountingId, costCenterType } = costOrderDetail;
    // 获取归属对象id
    const costTargetId = this.getCostTargetId(costCenterType, item);

    // TODO: 可以将name的渲染逻辑单独拆分为函数renderCOstShareItemName，逻辑拆分后，函数会更容易维护。其他功能同理。 @王晋
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
          <DeprecatedCoreForm items={formItems} key={key} />
        </Col>
      </Row>
    );
  }

  // 原费用单
  renderOringinal = () => {
    const { recordId, costOrderDetail, isInvoiceAdjust } = this.props;

    // 数据为空，返回null
    if (costOrderDetail.length === 0) return <div />;

    // 数据为空，返回null
    if (!costOrderDetail || Object.keys(costOrderDetail).length === 0) return <div />;

    const {
      id, // 费用单号
      totalMoney = '', // 金额
      invoiceFlag = undefined, // 是否开发票
      costGroupName = '', // 费用分组
      costAccountingInfo: {
        name: costAccountingName,
      } = {
        name: '',
      }, // 科目name
      costAccountingCode = '', // 科目code
      invoiceTitle = '', // 发票抬头
      note = '', // 备注
      payeeInfo: {
        card_num: cardNum, // 收款账号
        card_name: cardName, // 收款人
        bank_details: bankDetails, // 收款人银行
      },
    } = costOrderDetail;

    // 费用单号
    const orderIdForm = [
      {
        label: '费用单号',
        form: id || '',
      },
    ];

    // 基本信息布局
    const basicInfo = [
      {
        label: '费用金额',
        form: totalMoney ? isInvoiceAdjust ? `-${Unit.exchangePriceToYuan(totalMoney)}元` : `${Unit.exchangePriceToYuan(totalMoney)}元` : '--',
      }, {
        label: '是否开票',
        form: invoiceFlag ? '是' : '否',
      }, {
        label: '费用分组',
        form: costGroupName || '--',
      }, {
        label: '科目',
        form: costAccountingName && costAccountingCode ? `${costAccountingName}${costAccountingCode}` : '--',
      },
    ];

    // 成本分摊子项目布局
    const costShare = [
      {
        label: '成本分摊',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: this.renderCostShare(),
      },
    ];
    // 发票抬头与备注与上传附件布局
    const noteAndAttachment = [
      {
        label: '发票抬头',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: invoiceTitle || '--',
      },
      {
        label: '备注',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: note || '--',
      }, {
        label: '上传附件',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        form: this.renderCorePreview(dot.get(costOrderDetail, 'attachmentPrivateUrls', []), dot.get(costOrderDetail, 'attachments', [])),
      },
    ];

    // 收款人信息布局
    const payeeInfo = [
      {
        label: '收款人',
        layout: { labelCol: { span: 9, pull: 3 }, wrapperCol: { span: 15, pull: 3 } },
        form: cardName || '--',
      }, {
        label: '收款账号',
        form: cardNum || '--',
      }, {
        label: '开户支行',
        form: bankDetails || '--',
      },
    ];

    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <div key={recordId}>
        {/* 渲染基本信息 */}
        <DeprecatedCoreForm items={orderIdForm} cols={4} layout={layout} />
        {/* 渲染基本信息 */}
        <DeprecatedCoreForm items={basicInfo} cols={4} layout={layout} />
        {/* 渲染成本分摊子项目信息 */}
        <DeprecatedCoreForm items={costShare} cols={1} />
        {/* 渲染备注与附件  */}
        <DeprecatedCoreForm items={noteAndAttachment} cols={1} />
        {/* 渲染收款人信息 */}
        <DeprecatedCoreForm items={payeeInfo} cols={3} layout={layout} />
      </div>
    );
  }

  // 渲染退款/红冲单
  renderInvoice = () => {
    const {
      costOrderDetail, // 费用单详情
      examineOrderDetail, // 审批单详情
    } = this.props;

    const {
      refCostOrderInfoList = [], // 关联的退款单列表
    } = costOrderDetail;

    const {
      applicationSubType, // 红冲/退款审批单类型
    } = examineOrderDetail;

    // 数据为空，返回null
    if (refCostOrderInfoList.length === 0) {
      return null;
    }

    // 过滤数据
    const filterCostOrder = refCostOrderInfoList.filter(item => (item.state !== ExpenseCostOrderState.delete && item.state !== ExpenseCostOrderState.close));

    // 数据为空，不渲染
    if (filterCostOrder.length === 0) return null;

    return (
      <div>
        {
          filterCostOrder.map((item, key) => {
            // 退款单
            if (item.type === InvoiceAjustAction.refund && applicationSubType === InvoiceAjustAction.refund) {
              return (
                <RefundCostOrder
                  key={key}
                  detail={item}
                  examineOrderDetail={examineOrderDetail}
                />
              );
            }
            // 红冲单
            if (item.type === InvoiceAjustAction.invoiceAdjust && item.total_money > 0 && applicationSubType === InvoiceAjustAction.invoiceAdjust) {
              return (
                <InvoiceCostOrder
                  key={key}
                  isShow
                  detail={item}
                  examineOrderDetail={examineOrderDetail}
                />
              );
            }

            return null;
          })
        }
      </div>
    );
  }

  render = () => {
    return (
      <div>
        {/*  原费用单 */}
        {this.renderOringinal()}

        {/* 退款单 */}
        {this.renderInvoice()}
      </div>
    );
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
export default connect(mapStateToProps)(CostOrderItem);
