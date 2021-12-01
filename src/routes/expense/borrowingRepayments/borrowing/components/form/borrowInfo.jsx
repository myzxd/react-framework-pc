/**
 * 费用管理 - 借还款管理 - 新建/编辑 - 借款信息组件
 */
import React, { Component } from 'react';
import dot from 'dot-prop';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { InputNumber, Input } from 'antd';
import PropTypes from 'prop-types';

import {
  CoreContent,
  DeprecatedCoreForm,
} from '../../../../../../components/core';
import { Unit } from '../../../../../../application/define';
import Upload from '../../../components/uploadFormItem';
import Utils from '../../../../../../application/utils';

const { TextArea } = Input;

// 命名空间
const namespace = 'BorrowInfo';

class BorrowInfo extends Component {

  static propTypes = {
    borrowingDetail: PropTypes.object, // 借款单详情
    form: PropTypes.object, // 表单
  }

  static defaultProps = {
    borrowingDetail: {}, // 借款单详情
    form: {}, // 表单
  }

  render = () => {
    const { borrowingDetail } = this.props;
    const { getFieldDecorator } = this.props.form;
    const initialAttachments = dot.get(borrowingDetail, 'assert_file_list', []).map(file => file.file_name);
    // 借款金额
    const moneyItems = [
      {
        label: '借款金额(元)',
        form: getFieldDecorator('borrowMoney',
          {
            initialValue: borrowingDetail.loan_money ? Unit.dynamicExchange(borrowingDetail.loan_money, Unit.priceYuan, false) : '',
            rules: [{ validator: Utils.asyncValidateOrderVars(Unit.priceYuan) },
              { required: true, message: '请填写' }],
          })(
            <InputNumber min={0.01} />,
        ),
      },
    ];
    const moneyLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 6,
      },
    };
    // 借款事由
    const borrowForItems = [
      {
        label: '借款事由',
        form: getFieldDecorator('borrowNote', { initialValue: borrowingDetail.loan_note || '', rules: [{ required: true, message: '请填写' }] })(
          <TextArea rows={4} />,
        ),
      },
    ];
    const borrowForLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    // 上传附件
    const uploadItems = [
      {
        label: '上传附件',
        form: getFieldDecorator('attachments', { initialValue: initialAttachments })(
          <Upload domain="cost" namespace={namespace} />,
        ),
      },
    ];
    const uploadLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    return (
      <CoreContent title="借款信息">
        <DeprecatedCoreForm
          key="money"
          items={moneyItems}
          cols={2}
          layout={moneyLayout}
        />
        <DeprecatedCoreForm
          key="borrowFor"
          items={borrowForItems}
          cols={2}
          layout={borrowForLayout}
        />
        <DeprecatedCoreForm
          key="upload"
          items={uploadItems}
          cols={2}
          layout={uploadLayout}
        />
      </CoreContent>
    );
  }
}

export default Form.create()(BorrowInfo);
