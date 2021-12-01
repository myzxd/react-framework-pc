/**
 * 费用管理 - 付款审批 - 还款信息
 */
import is from 'is_js';
import dot from 'dot-prop';
import { Collapse, message } from 'antd';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DeprecatedCoreForm, CoreContent, CoreFinder } from '../../../../../components/core';
import { Unit, BorrowType, RepayMethod, RepayCircle } from '../../../../../application/define';

const { CoreFinderList } = CoreFinder;

const Panel = Collapse.Panel;

class RepaymentsInfo extends Component {
  // 外部审批单更新数据
  static getDerivedStateFromProps(nextProps, prevState) {
    const { orderDetails = {} } = prevState;
    const { externalData = [], isExternal = false } = nextProps;
    if (Object.keys(orderDetails).length <= 0 && isExternal && externalData.length > 0) {
      const data = {};
      externalData.forEach((i) => {
        dot.set(data, i._id, i);
      });
      return { orderDetails: data };
    }

    return null;
  }

  static propTypes = {
    orderIds: PropTypes.array, // 还款单id列表
    isExternal: PropTypes.bool, // 外部审批单字段
  }

  static defaultProps = {
    orderIds: [],              // 还款单id列表
    isExternal: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      orderDetails: {},                         // 还款单详情数据
    };
  }

  onRequestOrderDetail = (orderId) => {
    const { isExternal = false } = this.props;
    // 外部审批单不调用接口
    if (isExternal) return;

    if (is.not.existy(orderId) || is.empty(orderId)) {
      return;
    }

    const { orderDetails = {} } = this.state;
    const ids = Object.keys(orderDetails);
    if (ids.includes(orderId)) {
      return;
    }

    // 获取还款单数据
    this.props.dispatch({
      type: 'expenseExamineOrder/fetchRepaymentOrderDetail',
      payload: {
        id: orderId,
        onSuccessCallback: this.onSuccessCallback,
        onFailureCallback: this.onFailureCallback,
      },
    });
  }

  // 成功回调
  onSuccessCallback = (result) => {
    const orderId = dot.get(result, '_id', '');
    if (is.empty(orderId) || is.not.existy(orderId)) {
      message.error('获取还款单详情失败');
      return;
    }

    const { orderDetails = {} } = this.state;
    dot.set(orderDetails, orderId, result);
    this.setState({
      orderDetail: orderDetails,
    });
  }

  // 失败回调
  onFailureCallback = (result) => {
    // 判断是否有查看这条审批单的权限, 没有跳404页面
    if (result.zh_message === '您没有查看这条还款单的权限') {
      window.location.href = '/#/404';
    }

    this.private.isRequest = false;
  }

   // 预览组件
  renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0.file_url')) {
      const data = value.map((item) => {
        return { key: item.file_name, url: item.file_url };
      });
      return (
        <CoreFinderList data={data} />
      );
    }
    return '--';
  };
  // 借款信息
  renderBorrowingPeopleInfo = (record) => {
    const { isExternal = false } = this.props;
    // 借款单号（兼容外部审批单，外部审批单不能跳转）
    const orderId = isExternal
      ? dot.get(record, 'loan_order_id', '--')
      : (<a
        key="detail"
        href={`/#/Expense/BorrowingRepayments/Borrowing/Detail?approvalId=${record.loan_order_id}&orderId=${record.loan_order_info.application_order_id}`}
        target="_blank"
        rel="noopener noreferrer"
      >{dot.get(record, 'loan_order_id', '--')}</a>);

    const formItems = [
      {
        label: '借款单号',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: orderId,
      },
      {
        label: '借款类型',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'loan_order_info.loan_type', 0) ? BorrowType.description(dot.get(record, 'loan_order_info.loan_type', 0)) : '--',
      }, {
        label: '借款事由',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'loan_order_info.loan_note', '--'),
      }, {
        label: '申请人',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'apply_account_info.name', '--'),
      }, {
        label: '实际借款人',
        span: 14,
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'loan_order_info.actual_loan_info.name', '--'),
      }, {
        label: '借款金额 (元)',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: Unit.exchangePriceCentToMathFormat(dot.get(record, 'loan_order_info.loan_money', 0)),
      }, {
        label: '已还金额 (元)',
        span: 8,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 14 } },
        form: Unit.exchangePriceCentToMathFormat(dot.get(record, 'loan_order_info.repayment_money', 0)),
      }, {
        label: '未还金额 (元)',
        span: 8,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: Unit.exchangePriceCentToMathFormat(dot.get(record, 'loan_order_info.non_repayment_money', 0)),
      },
    ];
    return (
      <CoreContent title="借款信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  }

  // 还款信息
  renderRepaymentsInfo = (record) => {
    const formItems = [
      {
        label: '还款方式',
        form: dot.get(record, 'loan_order_info.repayment_method', 0) ? RepayMethod.description(dot.get(record, 'loan_order_info.repayment_method', 0)) : '--',
      },
      {
        label: '还款周期',
        form: dot.get(record, 'loan_order_info.repayment_cycle', 0) ? RepayCircle.description(dot.get(record, 'loan_order_info.repayment_cycle', 0)) : '--',
      },
      {
        label: '还款金额(元)',
        form: dot.get(record, 'repayment_money', 0) ? Unit.exchangePriceCentToMathFormat(dot.get(record, 'repayment_money', 0)) : '--',
      }, {
        label: '备注',
        form: <span className="noteWrap">{dot.get(record, 'repayment_note', '--') || '--'}</span>,
      },
    ];
    const formItem = [
      {
        label: '上传附件',
        form: this.renderCorePreview(dot.get(record, 'assert_file_list', [])),
      },
    ];
    const layout = { labelCol: { span: 4 }, wrapperCol: { span: 17 } };
    const layoutItem = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

    return (
      <CoreContent title="还款信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        <DeprecatedCoreForm items={formItem} cols={3} layout={layoutItem} />

      </CoreContent>
    );
  }

  renderOrderDetail = (orderId) => {
    // 详情数据
    const { orderDetails = {} } = this.state;
    const detail = dot.get(orderDetails, orderId);

    // 判断详情数据是否为空
    if (is.empty(detail) || is.not.existy(detail)) {
      return '详情数据为空';
    }

    return (
      <div>
        {/* 渲染借款人信息 */}
        {this.renderBorrowingPeopleInfo(detail)}
        {/* 渲染还款信息 */}
        {this.renderRepaymentsInfo(detail)}
      </div>
    );
  }

  render = () => {
    const { orderIds } = this.props;
    return (
      <CoreContent title="还款单">
        <Collapse bordered={false} onChange={this.onRequestOrderDetail} accordion>
          {
            orderIds.map((id) => {
              const header = `${'还款单号:'} ${id}`;
              return (
                <Panel header={header} key={id}>
                  {this.renderOrderDetail(id)}
                </Panel>
              );
            })
          }
        </Collapse>
      </CoreContent>
    );
  }
}

export default RepaymentsInfo;
