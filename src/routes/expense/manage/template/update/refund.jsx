/**
 * 报销表单的模版(编辑)
 */
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Tooltip, Input, InputNumber } from 'antd';
import React, { Component } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';

import { Unit, ExpenseExamineFlowAmountAdjust } from '../../../../../application/define';
import style from './style.css';

// import Project from '../components/project';
import CostProject from '../components/costProject';
import Collection from '../../common/collection';


const { Option } = Select;

class Index extends Component {
  static propTypes = {
    costUpdateRule: PropTypes.string,
    isUpdateRule: PropTypes.bool,
    isHideHouseNum: PropTypes.bool,
    title: PropTypes.string,
    detail: PropTypes.object,
    formKey: PropTypes.string,
    onHookForm: PropTypes.func,
    platform: PropTypes.string,
  }

  static defaultProps = {
    costUpdateRule: '',
    isUpdateRule: false,
    isHideHouseNum: true,
    title: '',
    detail: {},
    formKey: '',
    onHookForm: () => {},
    platform: '',
  }

  componentDidMount() {
    // 更新id和上传附件
    this.onChangeFormRecordIdFileList(this.props);
  }

  // 更新id和上传附件
  onChangeFormRecordIdFileList = (props) => {
    const { formKey, onHookForm, form = {} } = props;

    // 返回初始化的form对象
    if (onHookForm) {
      onHookForm(form, formKey);
    }
  }

  // 费用信息
  renderRentInfo = () => {
    const { detail = {}, isHideHouseNum, isUpdateRule, costUpdateRule, form = {} } = this.props;
    const { getFieldDecorator } = form;
    let min = 0;
    let max = Infinity; // max调整为无限大
    const totalMoney = dot.get(detail, 'totalMoney', undefined);
    // 金额调整规则，向上，向下的默认限制
    let popconfirm = '';
    // 向上调整
    if (Number(costUpdateRule) === ExpenseExamineFlowAmountAdjust.upward) {
      min = Unit.exchangePriceToYuan(totalMoney);
      popconfirm = '只能向上调整';
    }
    // 向下调整
    if (Number(costUpdateRule) === ExpenseExamineFlowAmountAdjust.down) {
      max = Unit.exchangePriceToYuan(totalMoney);
      popconfirm = '只能向下调整';
    }
    // 任意调整
    if (Number(costUpdateRule) === ExpenseExamineFlowAmountAdjust.any) {
      min = 1;
      popconfirm = '可以任意调整';
    }

    // 费用金额判断是否为空
    const formItems = [
      {
        label: '费用金额(元)',
        form: getFieldDecorator('money', {
          initialValue: totalMoney !== undefined ? Unit.exchangePriceToYuan(totalMoney) : undefined,
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <InputNumber
            min={min}
            max={max}
            step={0.01}
            formatter={Unit.limitDecimals}
            parser={Unit.limitDecimals}
          />,
        ),
      }, {
        label: '是否开票',
        form: getFieldDecorator('hasInvoice', {
          initialValue: dot.get(detail, 'invoiceFlag', undefined) ? '1' : '0',
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Select placeholder="请选择是否开票" disabled={isUpdateRule}>
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
        form: getFieldDecorator('uniqueHouseNum', {
          initialValue: dot.get(detail, 'bizExtraHouseContractInfo.houseNum', undefined),
        })(
          <Input placeholder="请输入房屋编号" disabled={isUpdateRule} />,
        ),
      });
    }
    const layout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };
    return (
      <CoreContent title="费用信息">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        {
          isUpdateRule === true ? <p className={style['app-comp-expense-manage-template-refund-expense']}>备注：调整范围 ${popconfirm}</p> : ''
        }
      </CoreContent>
    );
  }

  // 项目信息
  renderExpenseInfo = () => {
    const {
      // applicationOrderType,
      form = {},
      detail = {},
      platform,
      isUpdateRule,
      isPluginOrder,
    } = this.props;

    const props = {
      form,
      detail,
      expenseTypeId: dot.get(detail, 'costGroupId', undefined),
      isUpdateRule,
      platform,
      isPluginOrder,
    };

    if (Object.keys(detail).length === 0) return null;

    // 费用单
    // if (Number(applicationOrderType) === OaApplicationOrderType.cost) {
    // return <CostProject {...props} />;
    // }

    // 物资单
    // if (Number(applicationOrderType) === OaApplicationOrderType.supplies) {
    // return <CostProject {...props} />;
    // }

    return <CostProject {...props} />;
  }

  // 支付信息
  renderPaymentInfo = () => {
    const { form = {}, detail = {}, isUpdateRule } = this.props;
    return (<Collection
      form={form}
      isUpdateRule={isUpdateRule}
      detail={detail}
      totalMoney={form.getFieldValue('money')}
    />);
  }

  // 渲染隐藏表单
  renderHiddenForm = () => {
    const { detail = {}, form = {} } = this.props;

    const formItems = [
      {
        label: '',
        form: form.getFieldDecorator('recordId', { initialValue: dot.get(detail, 'id') })(<Input hidden />),
      },
    ];
    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };
    return (
      <DeprecatedCoreForm
        className={style['app-comp-expense-manage-template-refund-hide']}
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  render = () => {
    const { title } = this.props;
    return (
      <Form layout="horizontal" >
        <CoreContent title={title}>
          {/* 费用信息 */}
          {this.renderRentInfo()}

          {/* 项目信息 */}
          {this.renderExpenseInfo()}

          {/* 支付信息 */}
          {this.renderPaymentInfo()}

          {/* 渲染隐藏表单 */}
          {this.renderHiddenForm()}
        </CoreContent>
      </Form>
    );
  }
}

export default Form.create()(Index);
