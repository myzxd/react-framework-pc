/**
 * 房屋管理/新建(编辑)/押金信息
 */
import is from 'is_js';
import dot from 'dot-prop';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  InputNumber,
} from 'antd';
import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../components/core';
import ShowSubject from '../common/showSubject';
import Collection from '../form/collection';
import { Unit } from '../../../../../../application/define';

class Deposit extends Component {

  static propTypes = {
    houseContractDetail: PropTypes.object, // 房屋详情数据
    subjectId: PropTypes.string,            // subjectId
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
    subjectId: '',
  }

  renderExpenseInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { houseContractDetail = {}, subjectId, isCreateRenew } = this.props;
    const {
      pledgeMoney = 0, // 原合同押金
      fromContractInfo, // 历史合同信息
    } = houseContractDetail;

    // 历史合同未退押金
    const unrefundedMoney = dot.get(fromContractInfo, 'unrefunded_pledge_money', 0);

    const formItems = [];

    // 续签合同押金
    const spreadMoney = pledgeMoney - unrefundedMoney;

    // 判断是否是续签
    if (isCreateRenew !== undefined) {
      formItems.push(
        {
          label: '押金金额(元)',
          span: 5,
          layout: { labelCol: { span: 13 }, wrapperCol: { span: 10 } },
          form: getFieldDecorator('pledgeMoney', {
            initialValue: is.existy(spreadMoney) && is.not.empty(spreadMoney) ? Unit.exchangePriceToYuan(spreadMoney) : '',
            rules: [{
              required: true,
              message: '请填写内容',
            }],
          })(
            <InputNumber
              min={0}
              disabled
              formatter={Unit.limitDecimals}
              parser={Unit.limitDecimals}
            />,
          ),
        },
        {
          span: 7,
          layout: { labelCol: { span: 0 }, wrapperCol: { span: 16 } },
          form: getFieldDecorator('message', {
          })(
            <span style={{ color: 'red', textAlign: 'left' }}>此处为续签合同未付款的押金差价</span>,
          ),
        },
        {
          label: '科目',
          span: 7,
          layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
          form: getFieldDecorator('pledgeAccountingId', {
            initialValue: subjectId,
            rules: [{
              required: true,
              message: '没有科目',
            }],
          })(
            <ShowSubject subjectId={subjectId} />,
          ),
        },
      );
    } else {
      formItems.push(
        {
          label: '押金金额(元)',
          span: 8,
          layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
          form: getFieldDecorator('pledgeMoney', {
            initialValue: is.existy(pledgeMoney) && is.not.empty(pledgeMoney) ? Unit.exchangePriceToYuan(pledgeMoney) : '',
            rules: [{
              required: true,
              message: '请填写内容',
            }],
          })(
            <InputNumber
              min={0}
              disabled
              formatter={Unit.limitDecimals}
              parser={Unit.limitDecimals}
            />,
          ),
        },
        {
          label: '科目',
          span: 8,
          layout: { labelCol: { span: 8 }, wrapperCol: { span: 16 } },
          form: getFieldDecorator('pledgeAccountingId', {
            initialValue: subjectId,
            rules: [{
              required: true,
              message: '没有科目',
            }],
          })(
            <ShowSubject subjectId={subjectId} />,
          ),
        },
      );
    }

    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={3}
      />
    );
  }

  // 渲染收款信息
  renderReceiptInfo = () => {
    const { form, houseContractDetail = {}, disabled } = this.props;
    const {
      pledgePayeeInfo = {},
    } = houseContractDetail;

    const label = {
      cardNameLabel: '押金收款人',
    };

    const placeholder = {
      cardNamePlace: '请输入姓名',
      cardNumPlace: '请输入卡号',
      bankNamePlace: '请输入全称',
    };

    const formName = {
      cardNameForm: 'pledgePayee',
      cardNumForm: 'pledgePayeeAccount',
      bankNameForm: 'pledgeBankName',
    };

    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

    const detail = { payeeInfo: pledgePayeeInfo };

    return (
      <Collection
        form={form}
        disabled={disabled}
        detail={detail}
        label={label}
        placeholder={placeholder}
        formName={formName}
        isHouse
        layout={layout}
        namespace={'pledge'}
      />
    );
  }

  render = () => {
    return (
      <CoreContent>

        {/* 渲染费用信息 */}
        {this.renderExpenseInfo()}

        {/* 渲染收款信息 */}
        {this.renderReceiptInfo()}

      </CoreContent>
    );
  }
}

export default Deposit;
