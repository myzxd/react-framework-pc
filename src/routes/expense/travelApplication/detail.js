/*
 *  出差申请单详情 Expense/TravelApplication/Detail
 **/

import dot from 'dot-prop';
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Collapse } from 'antd';
import { CoreContent, DeprecatedCoreForm } from '../../../components/core';
import {
  OaApplicationOrderType,
  ExpenseBusinessTripType,
  ExpenseBusinessTripWay,
  Unit,
} from '../../../application/define';

import style from './style.css';

const Panel = Collapse.Panel;

class Detail extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'expenseTravelApplication/getExpenseTravelApplicationDetail',
      payload: { travel_apply_order_id: this.props.location.query.id },
    });
  }

  // 渲染基本信息
  renderBaseInfo = () => {
    const { detail } = this.props;

    const formItems = [
      {
        label: '审批单号',
        form: detail.apply_application_order_id || '--',
      },
      {
        label: '申请人',
        form: detail.apply_account_info ? detail.apply_account_info.name : '--',
      },
      {
        label: '审批类型',
        form: detail.apply_application_order_info ? OaApplicationOrderType.description(detail.apply_application_order_info.application_order_type) : '--',
      },
    ];

    return (
      <CoreContent title="基本信息">
        <Row type="flex" align="middle">
          <Col span={24}>
            <DeprecatedCoreForm items={formItems} cols={4} />
          </Col>
        </Row>
      </CoreContent>
    );
  }

  // 出差单
  renderTravelList = () => {
    const { _id } = this.props.detail;
    return (
      _id &&
      <CoreContent title="出差单">
        <Collapse bordered={false} defaultActiveKey={[`${_id}`]}>
          <Panel
            header={`出差申请单号: ${_id}`}
            key={_id}
          >
            {/* 渲染出差人信息 */}
            {this.renderPersonInfo()}

            {/* 渲染出差信息 */}
            {this.renderTravelInformation()}
          </Panel>
        </Collapse>
      </CoreContent>
    );
  }

  // 出差单-出差人信息
  renderPersonInfo = () => {
    const { detail } = this.props;
    const formItems = [
      {
        label: '实际出差人',
        form: detail.apply_user_name || '--',
      },
      {
        label: '联系方式',
        form: detail.apply_user_phone || '--',
      },
      {
        label: '同行人员',
        form: detail.together_user_names ? detail.together_user_names.join(', ') : '--',
      },
    ];

    return (
      <CoreContent title="出差人信息">
        <Row type="flex" align="middle">
          <Col span={24}>
            <DeprecatedCoreForm items={formItems} cols={3} />
          </Col>
        </Row>
      </CoreContent>
    );
  }

  // 出差单-出差信息
  renderTravelInformation = () => {
    const { detail } = this.props;
    const {
      departure,
      destination,
    } = detail;

    // 出发方式
    let transport = '';
    if (detail.transport_kind) {
      detail.transport_kind.forEach((item) => {
        transport += `${ExpenseBusinessTripWay.description(item)} ,`;
      });
      transport = transport.substring(0, transport.length - 1);
    } else {
      transport = '--';
    }

    const formItems = [
      {
        label: '出差类别',
        form: ExpenseBusinessTripType.description(detail.biz_type) || '--',
      },
      {
        label: '出发方式',
        form: transport,
      },
      {
        label: '出发地',
        form: departure ? `${departure.province_name}${departure.city_name || ''}${departure.area_name || ''}${departure.detailed_address}` : '--',
      },
      {
        label: '目的地',
        form: destination ? `${destination.province_name}${destination.city_name || ''}${destination.area_name || ''}${destination.detailed_address}` : '--',
      },
      {
        label: '预计出差时间',
        form: `${moment(detail.expect_start_at).format('YYYY-MM-DD HH:00')} -- ${moment(detail.expect_done_at).format('YYYY-MM-DD HH:00')}` || '--',
      },
      {
        label: '出差天数',
        form: (`${detail.expect_apply_days}天`),
      },
      {
        label: '原因及说明',
        form: detail.note || '--',
      },
      {
        label: '工作安排',
        form: detail.working_plan || '--',
      },
    ];
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };

    return (
      <CoreContent title="出差信息">
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }

  // 报销单
  renderReimburseForm = () => {
    const { detail } = this.props;
    const { cost_order_info } = detail;

    // 无数据
    if (!dot.get(detail, 'cost_order_info') || Object.keys(cost_order_info).length < 1) return <div />;

    return (
      <CoreContent title="报销单">
        <Collapse bordered={false} defaultActiveKey={[`${cost_order_info._id}`]}>
          <Panel
            header={`费用单号: ${cost_order_info._id}`}
            key={cost_order_info._id}
          >
            {/* 渲染出差信息 */}
            {this.renderReimburseBusiness(detail)}

            {/* 渲染费用信息 */}
            {this.renderCostInformation(cost_order_info)}

            {/* 渲染项目信息 */}
            {this.renderProjectInformation(cost_order_info)}

            {/* 渲染支付信息 */}
            {this.renderPaymentInformation(cost_order_info)}
          </Panel>
        </Collapse>
      </CoreContent>
    );
  }

  // 报销单-出差信息
  renderReimburseBusiness = (detail) => {
    const formItems = [
      {
        label: '实际出差时间',
        form: detail.actual_start_at ? `${moment(detail.actual_start_at).format('YYYY-MM-DD HH:mm:ss')} -- ${moment(detail.actual_done_at).format('YYYY-MM-DD HH:mm:ss')}` : '--',
      },
      {
        label: '出差天数',
        form: `${detail.actual_apply_days}天`,
      },
    ];

    return (
      <CoreContent title="出差信息">
        <DeprecatedCoreForm items={formItems} cols={2} />
      </CoreContent>
    );
  }

  // 报销单-费用信息
  renderCostInformation = (info) => {
    const formItems = [
      {
        label: '费用金额（元）',
        form: Unit.exchangePriceCentToMathFormat(info.total_money) || '--',
      },
      {
        label: '是否开票',
        form: info.invoice_flag ? '是' : '否',
      },
    ];
    const formItemSub = [
      {
        label: '差旅费用明细',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
        form: this.renderTravelExpensesInformation(info),
      },
    ];

    return (
      <CoreContent title="费用信息">
        <DeprecatedCoreForm items={formItems} cols={4} />
        <DeprecatedCoreForm items={formItemSub} cols={1} />
      </CoreContent>
    );
  }

  // 报销信息--费用信息--差旅费用明细
  renderTravelExpensesInformation = (info = {}) => {
    const bizExtraData = info.biz_extra_data;
    const formItemsDetail = [
      {
        label: '补助（元）',
        span: 4,
        layout: { labelCol: { span: 13 }, wrapperCol: { span: 11 } },
        form: bizExtraData.subsidy_fee >= 0 ?
          (<p className={style['app-comp-expense-travel-application-detail']}>
            {Unit.exchangePriceCentToMathFormat(bizExtraData.subsidy_fee)}</p>)
        : '--',
      },
      {
        label: '住宿（元）',
        span: 5,
        layout: { labelCol: { span: 13 }, wrapperCol: { span: 11 } },
        form: bizExtraData.stay_fee >= 0 ?
          (<p className={style['app-comp-expense-travel-application-detail']}>
            {Unit.exchangePriceCentToMathFormat(bizExtraData.stay_fee)}</p>)
      : '--',
      },
      {
        label: '往返交通费（元）',
        span: 5,
        layout: { labelCol: { span: 13 }, wrapperCol: { span: 11 } },
        form: bizExtraData.transport_fee >= 0 ?
        (<p className={style['app-comp-expense-travel-application-detail']}>
          {Unit.exchangePriceCentToMathFormat(bizExtraData.transport_fee)}</p>)
    : '--',
      },
      {
        label: '市内交通费（元）',
        span: 5,
        layout: { labelCol: { span: 13 }, wrapperCol: { span: 11 } },
        form: bizExtraData.urban_transport_fee >= 0 ?
        (<p className={style['app-comp-expense-travel-application-detail']}>
          {Unit.exchangePriceCentToMathFormat(bizExtraData.urban_transport_fee)}</p>)
    : '--',
      },
      {
        label: '其他（元）',
        span: 5,
        layout: { labelCol: { span: 13 }, wrapperCol: { span: 11 } },
        form: bizExtraData.other_fee >= 0 ?
        (<p className={style['app-comp-expense-travel-application-detail']}>
          {Unit.exchangePriceCentToMathFormat(bizExtraData.other_fee)}</p>)
    : '--',
      },
    ];
    const layout = { labelCol: { span: 18 }, wrapperCol: { span: 6 } };

    return (
      <Row>
        <Col span={24}>&nbsp;</Col>
        <DeprecatedCoreForm items={formItemsDetail} layout={layout} />
      </Row>
    );
  }

  // 报销信息--项目信息
  renderProjectInformation = (info) => {
    // 附件
    const attachments = () => {
      if (!info.attachments || info.attachments.length === 0) {
        return '--';
      }
      return (
        <div>
          {
            info.attachments.map((item, index) => {
              return (
                <a key={`onDownloadPayroll_${index}`} className={style['app-comp-expense-travel-application-detail-project']} href={info.attachment_private_urls[index]}>
                  {item}
                  <span>&nbsp;</span>
                </a>
              );
            })
          }
        </div>
      );
    };

    const formItems = [
      {
        label: '科目',
        form: info.cost_accounting_info.name || '--',
      },
      {
        label: '费用分组',
        form: info.cost_group_name || '--',
      },
      {
        label: '成本分摊',
        form: this.renderCostAttribution(info),
      },
      {
        label: '备注',
        form: info.note || '--',
      },
      {
        label: '附件',
        form: attachments(),
      },
    ];
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };

    return (
      <CoreContent title="项目信息">
        <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
      </CoreContent>
    );
  }

  // 报销信息--项目信息--成本分摊
  renderCostAttribution = (info) => {
    return (
      <Row type="flex" align="middle">
        <Col span={24}>{info.allocation_mode === 6 ? '分摊金额' : '自定义分摊'}</Col>
        <Col span={24}>
          {
            info.cost_allocation_list.map((item, index) => {
              return (<div key={index}>{`${item.platform_name || ''}——${item.supplier_name || ''} - ${item.city_name || ''} - ${item.biz_district_name || ''}  分摊金额：${Unit.exchangePriceCentToMathFormat(item.money) || ''}元`}</div>);
            })
          }
        </Col>
      </Row>
    );
  }

  // 报销信息-收款信息
  renderPaymentInformation = (info) => {
    const formItems = [
      {
        label: '收款人',
        form: info.payee_info.card_name || '--',
      },
      {
        label: '收款账号',
        form: info.payee_info.card_num || '--',
      },
      {
        label: '开户支行',
        form: info.payee_info.bank_details || '--',
      },
    ];

    return (
      <CoreContent title="支付信息">
        <DeprecatedCoreForm items={formItems} cols={3} />
      </CoreContent>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}

        {/* 渲染出差单 */}
        {this.renderTravelList()}

        {/* 渲染报销单 */}
        {this.props.detail.cost_order_id && this.renderReimburseForm()}
      </div>
    );
  }
}

const mapStateToProps = ({ expenseTravelApplication }) => {
  return {
    detail: expenseTravelApplication.expenseTravelApplicationDetail,
  };
};

export default connect(mapStateToProps)(Detail);
