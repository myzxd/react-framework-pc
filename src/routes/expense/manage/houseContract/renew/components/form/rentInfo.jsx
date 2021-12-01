/**
 * 费用管理 / 房屋管理 / 续签编辑 / 租金信息（无运算逻辑）
 */
import is from 'is_js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  InputNumber,
} from 'antd';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../../components/core';
import ShowSubject from '../../../components/common/showSubject';
import { Unit } from '../../../../../../../application/define';

class Rent extends Component {

  static propTypes = {
    subjectId: PropTypes.string,            // subjectId
    detail: PropTypes.object, // 默认数据
    form: PropTypes.object, // form
  };

  static defaultProps = {
    detail: {}, // 默认为空
    form: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 渲染租金信息
  renderBaseInfo = () => {
    const { detail = {}, form = {}, subjectId } = this.props;
    const { getFieldDecorator } = form;

    const {
      monthMoney,
      schedulePrepareDays,
      periodMonthNum,
      initPaidMoney,
      initPaidMonthNum,
    } = detail;

    const formItems = [
      {
        label: '月租金(元)',
        form: getFieldDecorator('monthMoney', {
          initialValue: is.existy(monthMoney) && is.not.empty(monthMoney) ? Unit.exchangePriceToYuan(monthMoney) : '',
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            min={0}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />,
        ),
      },
      {
        label: '科目',
        form: getFieldDecorator('rentAccountingId', {
          initialValue: subjectId,
          rules: [{
            required: true,
            message: '没有科目',
          }],
        })(
          <ShowSubject subjectId={subjectId} />,
        ),
      },
      {
        label: '提前付款天数(天)',
        form: getFieldDecorator('schedulePrepareDays', {
          initialValue: schedulePrepareDays,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <InputNumber
            min={0}
          />,
        ),
      },
      {
        label: '付款周期（月／次）',
        form: getFieldDecorator('periodMonthNum', {
          initialValue: `${periodMonthNum || ''}`,
          required: true,
          rules: [{
            message: '请输入',
          }],
        })(
          <InputNumber
            min={1}
            max={120}
            precision={0}
          />,
        ),
      },
      {
        label: '已支付租金金额(元)',
        form: getFieldDecorator('initPaidMoney', {
          initialValue: is.existy(initPaidMoney) && is.not.empty(initPaidMonthNum) ? Unit.exchangePriceToYuan(initPaidMoney) : '',
          rules: [{
            required: false,
          }],
        })(
          <InputNumber
            min={0}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />,
        ),
      },
      {
        label: '已支付租金月数(月)',
        form: getFieldDecorator('initPaidMonthNum', {
          initialValue: initPaidMonthNum,
          rules: [{
            required: false,
          }],
        })(
          <InputNumber
            min={0}
          />,
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={3}
        layout={layout}
      />
    );
  }

  // 渲染收款信息
  renderReceiptInfo = () => {
    const {
      form,
      detail = {},
    } = this.props;

    const { getFieldDecorator } = form;

    const {
      rentPayeeInfo: {
        bank_details,
        card_name,
        card_num,
      } = {
        bank_details: '',
        card_name: '',
        card_num: '',
      },
    } = detail;

    const formItems = [
      {
        label: '房租收款人',
        form: getFieldDecorator('rentPayeeInfo.cardName', {
          initialValue: card_name,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            placeholder="请输入姓名"
          />,
        ),
      },
      {
        label: '收款账号',
        form: getFieldDecorator('rentPayeeInfo.cardNum', {
          initialValue: card_num,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            placeholder="请输入卡号"
          />,
        ),
      },
      {
        label: '开户支行',
        form: getFieldDecorator('rentPayeeInfo.bankDetails', {
          initialValue: bank_details,
          rules: [{
            required: true,
            message: '请填写内容',
          }],
        })(
          <Input
            placeholder="请输入全称"
          />,
        ),
      },
    ];

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={3}
        layout={layout}
      />
    );
  }

  render = () => {
    return (
      <CoreContent title="合同租金信息">

        {/* 渲染租金信息 */}
        {this.renderBaseInfo()}

        {/* 渲染收款信息 */}
        {this.renderReceiptInfo()}

      </CoreContent>
    );
  }
}

export default Rent;
