/**
 * 房屋管理/新建(编辑)/押金信息
 */
import is from 'is_js';
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
import Collection from './collection';
import { Unit } from '../../../../../../application/define';


class Deposit extends Component {

  static propTypes = {
    houseContractDetail: PropTypes.object, // 房屋详情数据
    subjectId: PropTypes.string,            // subjectId
    disabled: PropTypes.bool, // 是否禁用
    migrateFlag: PropTypes.number, // 合同录入方式
  };

  static defaultProps = {
    houseContractDetail: {}, // 默认为空
    disabled: false, // 是否禁用
    migrateFlag: 0, // 合同录入方式（新合同）
  }

  // 渲染费用信息
  renderExpenseInfo = () => {
    const {
      houseContractDetail = {}, // 房屋详情
      subjectId, // 科目id
      disabled, // 是否禁用
      isCreateRenew, // 是否为续签合同
      migrateFlag, // 合同录入方式
      form = {},
    } = this.props;
    const { getFieldDecorator } = form;

    const {
      pledgeMoney,
    } = houseContractDetail;

    const formItems = [];

    // 押金label
    const pledgeLable = migrateFlag === 0 ? '押金金额(元)' : '期初押金(元)';

    if (isCreateRenew !== undefined) {
      formItems.push(
        {
          label: pledgeLable,
          span: 5,
          layout: { labelCol: { span: 13 }, wrapperCol: { span: 10 } },
          form: getFieldDecorator('pledgeMoney', {
            initialValue: is.existy(pledgeMoney) && is.not.empty(pledgeMoney) ? Unit.exchangePriceToYuan(pledgeMoney) : '',
            rules: [{
              required: true,
              message: '请填写内容',
            }],
          })(
            <InputNumber
              max={9999999999}
              min={0}
              disabled={disabled}
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
            <span style={{ color: 'red', textAlign: 'left' }}>此为合同押金,请与付款押金区分</span>,
          ),
        },
        {
          label: '科目',
          span: 7,
          layout: { labelCol: { span: 10 }, wrapperCol: { span: 14 } },
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
          label: pledgeLable,
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
              max={9999999999}
              disabled={disabled}
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
      <CoreContent title="合同押金信息">

        {/* 渲染费用信息 */}
        {this.renderExpenseInfo()}

        {/* 渲染收款信息 */}
        {this.renderReceiptInfo()}

      </CoreContent>
    );
  }
}

export default Deposit;
