/**
 * 费用管理 - 还款管理 - 新建/编辑 - 还款信息组件
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { InputNumber, Input } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { RepayCircle, RepayMethod, Unit } from '../../../../../../application/define';
import Utils from '../../../../../../application/utils';
import Upload from '../../../components/uploadFormItem';

const { TextArea } = Input;

// 命名空间
const namespace = 'RepayInfo';

class RepayInfo extends Component {

  static propTypes = {
    borrowingDetail: PropTypes.object.isRequired, // 借款单详情
    repaymentDetail: PropTypes.object, // 还款单详情
    form: PropTypes.object, // 表单
  }

  static defaultProps = {
    borrowingDetail: {}, // 借款单详情
    repaymentDetail: {}, // 还款单详情
    form: {}, // 表单
  }

  render = () => {
    const { borrowingDetail, repaymentDetail } = this.props;
    const { getFieldDecorator } = this.props.form;
    const initialAttachments = dot.get(repaymentDetail, 'assert_file_list', []).map(file => file.file_name);
    // 还款周期
    const repayCircle = borrowingDetail.repayment_cycle;
    // 未还款金额
    const nonRepayMoney = borrowingDetail.non_repayment_money ? Unit.dynamicExchange(borrowingDetail.non_repayment_money, Unit.priceYuan, false) : 0;
    const formItemsFirstLine = [
      {
        label: '还款方式',
        form: RepayMethod.description(RepayMethod.currency),
      },
      {
        label: '还款周期',
        form: RepayCircle.description(borrowingDetail.repayment_cycle),
      },
    ];
    let formItemsSecondLine = [];
    if (repayCircle === RepayCircle.once) {
      // 如果是一次还，那么还款金额固定为未还款金额
      formItemsSecondLine = [{
        label: '还款金额(元)',
        form: getFieldDecorator('repayMoney', {
          initialValue: nonRepayMoney,
          rules: [{ validator: Utils.asyncValidateOrderVars(Unit.priceYuan) },
              { required: true, message: '请填写' }],
        })(
          <InputNumber disabled />,
        ),
      }];
    } else if (repayCircle === RepayCircle.instalment) {
      // 如果多次还，则还款金额大于等于0.01小于等于待还款金额
      formItemsSecondLine = [{
        label: '还款金额(元)',
        form: getFieldDecorator('repayMoney', {
          initialValue: repaymentDetail.repayment_money ? Unit.dynamicExchange(repaymentDetail.repayment_money, Unit.priceYuan, false) : '',
          rules: [{ validator: Utils.asyncValidateOrderVars(Unit.priceYuan) },
              { required: true, message: '请填写' }],
        })(
          <InputNumber min={0.01} max={nonRepayMoney} />,
        ),
      }];
    }
    const formItemsThirdLine = [
      {
        label: '上传附件',
        form: getFieldDecorator('attachments', { initialValue: initialAttachments })(
          <Upload domain="cost" namespace={namespace} />,
        ),
      },
    ];
    const formItemsForthLine = [
      {
        label: '备注',
        form: getFieldDecorator('note', { initialValue: repaymentDetail.repayment_note || '' })(
          <TextArea rows={4} />,
        ),
      },
    ];
    const formLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const formLayoutForthLine = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };
    return (
      <CoreContent title="还款信息">
        <DeprecatedCoreForm layout={formLayout} items={formItemsFirstLine} cols={3} />
        <DeprecatedCoreForm layout={formLayout} items={formItemsSecondLine} cols={3} />
        <DeprecatedCoreForm layout={formLayoutForthLine} items={formItemsThirdLine} cols={2} />
        <DeprecatedCoreForm layout={formLayoutForthLine} items={formItemsForthLine} cols={2} />
      </CoreContent>
    );
  }
}

export default RepayInfo;

