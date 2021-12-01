/**
 * 审批单详情 - 借款信息
 */
import is from 'is_js';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { Collapse, message } from 'antd';
import React, { Component } from 'react';
import { DeprecatedCoreForm, CoreContent, CoreFinder } from '../../../../../components/core';
import { Unit, BorrowType, RepayMethod, RepayCircle } from '../../../../../application/define';

const { CoreFinderList } = CoreFinder;

const Panel = Collapse.Panel;

class BorrowingInfo extends Component {
  static propTypes = {
    orderIds: PropTypes.array, // 借款单id列表
    pluginExtraMeta: PropTypes.object,
    loanOrderList: PropTypes.array,
    examineDetail: PropTypes.object, // 审批流详情
  }
  static defaultProps = {
    orderIds: [],
    pluginExtraMeta: {},
    loanOrderList: [],
    examineDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      orderDetails: {},                         // 借款单详情数据
    };
  }

  onRequestOrderDetail = (orderId) => {
    const { pluginExtraMeta } = this.props;
    // 如果为外部审批单，不请求详情接口
    if (pluginExtraMeta.is_plugin_order) {
      return;
    }
    if (is.not.existy(orderId) || is.empty(orderId)) {
      return;
    }

    const { orderDetails = {} } = this.state;
    const ids = Object.keys(orderDetails);
    if (ids.includes(orderId)) {
      return;
    }

    // 获取借款单数据
    this.props.dispatch({
      type: 'expenseExamineOrder/fetchBorrowingOrderDetail',
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
      message.error('获取借款单详情失败');
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
    if (result.zh_message === '您没有查看这条借款单的权限') {
      window.location.href = '/#/404';
    }

    this.private.isRequest = false;
  }

  // 借款人信息
  renderBorrowingPeopleInfo = (record) => {
    const { examineDetail = {} } = this.props;
    const { platformCodes = [] } = examineDetail;

    const platformCode = platformCodes && Array.isArray(platformCodes) ? platformCodes[0] : undefined;

    // 正常借款单
    const normalItems = [
      {
        label: '平台',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'platform_name', undefined) || '--',
      },
      {
        label: '供应商',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'supplier_name', undefined) || '--',
      }, {
        label: '城市',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'city_name', undefined) || '--',
      }, {
        label: '商圈',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 15 } },
        form: dot.get(record, 'biz_district_name', undefined) || '--',
      }, {
        label: '实际借款人',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'actual_loan_info.name', '--'),
      },
    ];

    const headquartersItems = [
      {
        label: '实际借款人',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'actual_loan_info.name', '--'),
      }, {
        label: '团队信息',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'actual_loan_info.department_name', '--'),
      },
    ];

    const items = platformCode === 'zongbu' ? headquartersItems : normalItems;

    const formItems = [
      ...items,
      {
        label: '身份证号码',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'actual_loan_info.identity', '--'),
      }, {
        label: '借款联系人方式',
        span: 7,
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'actual_loan_info.phone', '--'),
      }, {
        label: '收款账户',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'payee_account_info.card_num', '--'),
      }, {
        label: '开户支行',
        span: 7,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: dot.get(record, 'payee_account_info.bank_details', '--'),
      },
    ];


    return (
      <CoreContent title="借款人信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
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
  renderBorrowingInfo = (record) => {
    const formItems = [
      {
        label: '借款金额(元)',
        form: dot.get(record, 'loan_money', 0) ? Unit.exchangePriceCentToMathFormat(dot.get(record, 'loan_money', 0)) : '--',
      },
      {
        label: '借款类型',
        form: dot.get(record, 'loan_type', 0) ? BorrowType.description(dot.get(record, 'loan_type', 0)) : '--',
      },
      {
        label: '借款事由',
        form: <span className="noteWrap">{dot.get(record, 'loan_note', '--')}</span>,
      }, {
        label: '上传附件',
        form: this.renderCorePreview(dot.get(record, 'assert_file_list', [])),
      },
    ];
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
    return (
      <CoreContent title="借款信息">
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }

  // 还款方式
  renderRepaymentsInfo = (record) => {
    const formItems = [
      {
        label: '还款方式',
        form: dot.get(record, 'repayment_method', 0) ? RepayMethod.description(dot.get(record, 'repayment_method', 0)) : '--',
      },
      {
        label: '还款周期',
        form: dot.get(record, 'repayment_cycle', 0) ? RepayCircle.description(dot.get(record, 'repayment_cycle', 0)) : '--',
      }, {
        label: '预计还款时间',
        form: dot.get(record, 'expected_repayment_time', undefined) || '--',
      },
    ];
    const layout = { labelCol: { span: 7 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="还款信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  renderOrderDetail = (orderId, loanOrderDetails) => {
    const { pluginExtraMeta } = this.props;
    // 详情数据
    const { orderDetails = {} } = this.state;
    const detail = pluginExtraMeta.is_plugin_order ? loanOrderDetails : dot.get(orderDetails, orderId);

    // 判断详情数据是否为空
    if (is.empty(detail) || is.not.existy(detail)) {
      return '详情数据为空';
    }

    return (
      <div>
        {/* 渲染借款人信息 */}
        {this.renderBorrowingPeopleInfo(detail)}

        {/* 渲染借款信息 */}
        {this.renderBorrowingInfo(detail)}

        {/* 渲染还款信息 */}
        {this.renderRepaymentsInfo(detail)}

      </div>
    );
  }

  render = () => {
    const { orderIds, pluginExtraMeta, loanOrderList } = this.props;

    return (
      <CoreContent title="借款单">
        <Collapse bordered={false} onChange={this.onRequestOrderDetail} accordion>
          {
            pluginExtraMeta.is_plugin_order
            ? loanOrderList.map((item) => {
              const header = `${'借款单号:'} ${item._id}`;
              return (
                <Panel header={header} key={item._id}>
                  {this.renderOrderDetail(item._id, item)}
                </Panel>
              );
            })
            : orderIds && orderIds.map((id) => {
              const header = `${'借款单号:'} ${id}`;
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

export default BorrowingInfo;
