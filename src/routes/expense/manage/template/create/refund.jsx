/**
 * 报销表单的模版
 */
import { QuestionCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Select, Tooltip, Input, InputNumber } from 'antd';
import React, { Component } from 'react';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { Unit, OaApplicationOrderType } from '../../../../../application/define';

import CostProject from '../components/costProject';
import Collection from '../../common/collection';

import style from './style.css';

const { Option } = Select;

class Index extends Component {
  static propTypes = {
    applicationOrderType: PropTypes.string,
    isHideHouseNum: PropTypes.bool,
    platform: PropTypes.string,
    expenseTypeId: PropTypes.string,
    title: PropTypes.string,
    formKey: PropTypes.string,
    onHookForm: PropTypes.func,
  }

  static defaultProps = {
    applicationOrderType: '',
    platform: '',
    isHideHouseNum: false,
    expenseTypeId: '',
    title: '',
    formKey: '',
    onHookForm: () => {},
  }

  componentDidMount() {
    const { formKey, onHookForm, form } = this.props;

    // 返回初始化的form对象
    if (onHookForm) {
      onHookForm(form, formKey);
    }
  }

  // 费用信息
  renderRentInfo = () => {
    const { isHideHouseNum, form } = this.props;
    const { getFieldDecorator } = form;

    const formItems = [
      {
        label: '费用金额(元)',
        form: getFieldDecorator('money', {
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <InputNumber
            min={0}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />,
          ),
      }, {
        label: '是否开票',
        form: getFieldDecorator('hasInvoice', {
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select placeholder="请选择是否开票">
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>,
          ),
      },
    ];

    // 判断是否隐藏房屋编号字段
    if (isHideHouseNum !== true) {
      formItems.push({
        label: (
          <span> 房屋编号
            <Tooltip title="如此项费用与房屋关联可填写编号绑定" arrowPointAtCenter> <QuestionCircleOutlined /> </Tooltip>
          </span>
        ),
        form: getFieldDecorator('uniqueHouseNum')(
          <Input placeholder="请输入房屋编号" />,
        ),
      });
    }
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="费用信息" className={style['app-comp-expense-manage-template-create-refund-expense']}>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </CoreContent>
    );
  }

  // 项目信息
  renderExpenseInfo = () => {
    const {
      applicationOrderType,
      form,
      platform, // 审批流平台
      expenseTypeId,
    } = this.props;

    const props = {
      form,
      expenseTypeId,
      platform,
    };

    // 费用单
    if (Number(applicationOrderType) === OaApplicationOrderType.cost) {
      return <CostProject {...props} />;
    }

    // 物资单
    if (Number(applicationOrderType) === OaApplicationOrderType.supplies) {
      return <CostProject {...props} />;
    }

    return null;
  }

  // 支付信息
  renderPaymentInfo = () => {
    const { form = {} } = this.props;
    const totalMoney = form.getFieldValue('money');
    return <Collection form={form} totalMoney={totalMoney} />;
  }

  render = () => {
    const { title } = this.props;
    return (
      <Form layout="horizontal">
        <CoreContent title={title}>
          {/* 费用信息 */}
          {this.renderRentInfo()}

          {/* 项目信息 */}
          {this.renderExpenseInfo()}

          {/* 支付信息 */}
          {this.renderPaymentInfo()}
        </CoreContent>
      </Form>
    );
  }
}

export default Form.create()(Index);
