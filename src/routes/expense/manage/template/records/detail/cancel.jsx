/**
 * 退租表单模块
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import PropTypes from 'prop-types';
import '@ant-design/compatible/assets/index.css';
import React, { Component } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { ExpenseHouseState, Unit } from '../../../../../../application/define';
import { authorize } from '../../../../../../application';

// 详情页面，加载历史记录使用
import DetailRent from '../../detail/rent';

class Index extends Component {
  static propTypes = {
    orderRecordDetails: PropTypes.array,
  }

  static defaultProps = {
    orderRecordDetails: [],
  }

  // 基础信息
  renderBaseInfo = () => {
    const { orderRecordDetails = [] } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    const formItems = [
      {
        label: '房屋状态',
        form: ExpenseHouseState.description(ExpenseHouseState.cancel),
      }, {
        label: '申请人',
        form: dot.get(detail, 'apply_account', authorize.account.name),
      },
    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 费用信息
  renderRentInfo = () => {
    const { orderRecordDetails = [] } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    const formItems = [
      {
        label: '退换押金(注：退还押金有变动请说明原因)',
        form: Unit.exchangePriceToMathFormat(dot.get(detail, 'deposit', '--')),
      }, {
        label: '备注',
        form: dot.get(detail, 'desc', '--'),
      },

    ];
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="费用信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 历史信息
  renderHistoryInfo = () => {
    const { orderRecordDetails = [] } = this.props;
    const detail = dot.get(orderRecordDetails, '0', {});

    const list = dot.get(detail, 'history_id_list', []) || [];
    return (
      <CoreContent title="历史信息">
        {list.map((item, index) => {
          return <DetailRent key={index} detail={item} />;
        })}
      </CoreContent>
    );
  }

  render = () => {
    return (
      <Form layout="horizontal" onSubmit={this.onSubmitTemplate}>
        {/* 基础信息 */}
        {this.renderBaseInfo()}

        {/* 费用信息 */}
        {this.renderRentInfo()}

        {/* 历史信息 */}
        {this.renderHistoryInfo()}
      </Form>
    );
  }
}

function mapStateToProps({ approval: { orderRecordDetails } }) {
  return { orderRecordDetails };
}
export default connect(mapStateToProps)(Index);
