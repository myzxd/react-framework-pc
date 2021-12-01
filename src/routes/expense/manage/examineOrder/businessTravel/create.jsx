/**
 * 创建差旅报销单
 */
import is from 'is_js';
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, message } from 'antd';
import { connect } from 'dva';
import dot from 'dot-prop';
import { authorize } from '../../../../../application';

import { ExpenseCostOrderBelong, Unit, ExpenseCostCenterType } from '../../../../../application/define';
import TravelApplyOrder from './components/travelApplyOrder';
// import PaymentInfo from './components/paymentInfo';
import Cost from './components/cost/index';
import CommonSubject from '../../common/costSubject';  // 科目设置
import CommonExpense from '../../common/costExpense';  // 成本分摊
import { CommonSelectSuppliers } from '../../../../../components/common';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import CoreUpload from '../../../components/uploadAmazon';
import Collection from '../../common/collection';
import InvoiceHeader from '../../template/components/invoiceHeader';
import styles from './style.less';

const { TextArea } = Input;

class TravelApplyOrderCreate extends Component {
  constructor(props) {
    super(props);

    const expenseTypeId = dot.get(props, 'location.query.expenseTypeId', '');
    const expenseTypeName = dot.get(props, 'location.query.expenseTypeName', '');
    const orderId = dot.get(props, 'location.query.orderId', '');
    const platform = dot.get(props, 'location.query.platform', '');
    this.state = {
      fileList: [],                      // 文件列表
      selectedSubjectId: '',              // 当前选中的科目id
      orderId,
      expenseTypeId, // 费用分组id
      expenseTypeName, // 费用分钟名称
      selectedCostCenterType: undefined,     // 当前选择的成本中心类型
      apportionData: {}, // 分摊中平台、供应商数据
      costAllocation: undefined, // 成本归属
      teamTypeList: [], // 团队类型列表
      platform,
    };
    // 上传文件的随机key
    this.private = {
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
      flag: true,                                                   // 初始化加载id和上传附件
    };
  }

  componentWillUnmount() {
    // 重置，清空
    this.props.form.resetFields();
  }

  // 成功的回调
  onSuccessCallback = () => {
    const { approvalKey } = this.props.location.query;
    // 跳转到创建借款审批单页面
    this.props.history.push(`/Expense/Manage/ExamineOrder/Form?orderId=${this.state.orderId}&approvalKey=${approvalKey}`);
  }

  // 失败回调
  onFailureCallback = (result) => {
    const records = result.records || [];
    // 错误提示信息
    if (is.existy(result.zh_message) && is.not.empty(result.zh_message)) {
      return message.error(result.zh_message);
    }
    records.map((v) => {
      return message.error(v.zh_message);
    });
  }

  // 校验成本归属
  onVerifyExpenseCostItems = (items = [], costBelong, costAttribution, costCenterType) => {
    if (is.empty(items)) {
      message.error('分摊数据为空');
      return true;
    }
    if (is.not.array(items)) {
      message.error('分摊数据格式错误');
      return true;
    }

    // 项目信息转换
    const verifyKeys = {
      vendor: '分摊信息供应商未选择',      // 供应商id
      platform: '分摊信息平台未选择',     // 平台
      city: '分摊信息城市未选择',         // 城市
      district: '分摊信息商圈未选择',     // 商圈
      costCount: '分摊金额不能为空',     // 分摊金额
    };

    // 团队
    if (Number(costAttribution) === ExpenseCostCenterType.team && costCenterType !== ExpenseCostCenterType.headquarters) {
      verifyKeys.teamType = '团队类型未选择';
      verifyKeys.teamId = '团队ID未选择';
    }

    // 总部
    if (Number(costAttribution) === ExpenseCostCenterType.team && costCenterType === ExpenseCostCenterType.headquarters) {
      verifyKeys.teamId = '团队未选择';
    }

    // 个人
    if (Number(costAttribution) === ExpenseCostCenterType.person) {
      verifyKeys.staffId = '个人信息未选择';
      verifyKeys.staffName = '档案ID未选择';
    }

    // 是否校验错误
    let isVerifyError = false;
    let flag = false;

    // 因为收款信息可以有多条所以是数组先循环
    items.forEach((item, index) => {
      // 如果已经校验出错误，则不再继续校验。
      if (isVerifyError === true) {
        return;
      }

      // 判断是否为空
      if (is.empty(item)) {
        flag = true;
      }
      if (Number(costBelong) === ExpenseCostOrderBelong.custom &&
      (is.not.existy(item.costCount) || item.costCount === 0)) {
        isVerifyError = true;
        message.error(`第${index + 1}条分摊明细 : ${verifyKeys.costCount}`);
      }

      // 遍历数据中的字段
      Object.keys(item).forEach((key) => {
        // 排除不校验的字段 && 如果已经校验出错误，则不再继续校验。
        if (is.not.existy(verifyKeys[key]) || isVerifyError === true) {
          return;
        }

        // 校验数据是否存在 || 校验数据是否为空
        if (is.not.existy(item[key]) || is.empty(item[key])) {
          // 校验错误
          isVerifyError = true;
          // 提示信息
          message.error(`第${index + 1}条分摊明细 : ${verifyKeys[key]}`);
        }
      });
    });
    if (flag === true) {
      return message.error('分摊数据为空');
    }
    if (isVerifyError === true) {
      return true;
    }
    return false;
  }

  // 计算相差多少天并过滤休息日
  onChangeFilterDiffDay = (date) => {
    // 获取实际出差时间
    const startDate = moment(date[0], 'YYYY-MM-DD HH:00');
    const endDate = moment(date[1], 'YYYY-MM-DD HH:00');
    // 计算相差时间
    const days = endDate.diff(startDate, 'day');
    let diffDays = 0;
    if (days >= 0) {
      // 不过滤休息日
      Array.from({ length: days }).forEach(() => {
        diffDays += 1;
      });
      return diffDays;
    }
    return '--';
  }


  // 提交
  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 验证成本分摊是否有重复值，获取配置项，及其去重之后的数组
        const { costItems, costBelong } = values.expense;
        const { costAttribution = undefined, costCenterType } = values;
        // 校验成本归属
        const flag = this.onVerifyExpenseCostItems(values.expense.costItems, costBelong, costAttribution, costCenterType);
        if (flag === true) {
          return message.error('分摊数据为空');
        }
        // 获取不包含金额的数据数组,通过id、code进行判断，@TODO 后端返回的name与前端选择的name不同
        let originalData = costItems.map(item => _.omit(item, ['cityName', 'platformName', 'vendorName', 'districtName']));
        if (Number(costBelong) === ExpenseCostOrderBelong.custom) {
          originalData = costItems.map(item => _.omit(item, ['cityName', 'platformName', 'vendorName', 'districtName', 'costCount']));
        }
        // 获取去重之后的数据
        const laterData = _.uniqWith(originalData, _.isEqual);

        // 判断是否有重复数据，如果有，则return
        if (originalData.length !== laterData.length) {
          return message.error('成本分摊不能设置相同的成本归属');
        }
        const expense = {
          costBelong,
          costItems: costItems.map((v) => {
            const item = { ...v };
            if (is.existy(v.costCount) && is.not.empty(v.costCount)) {
              item.costCount = v.costCount;
            }
            return item;
          }),
        };
        // 计算费用明细总金额
        const itemsAmount = Object.values(values.bizExtraData).map(i => i * 100).reduce((a, b) => a + b) / 100;
        if (itemsAmount !== values.money) {
          return message.error('差旅费用明细总和和费用金额不相等，请修改！');
        }
        const bizExtraData = {};
        // eslint-disable-next-line guard-for-in
        for (const i in values.bizExtraData) {
          bizExtraData[i] = Unit.exchangePriceToCent(values.bizExtraData[i]);
        }
        const payload = {
          orderId: this.state.orderId,
          records: [{
            ...values,
            expense,
            storage_type: 3, // 上传文件的类型
            expenseType: this.state.expenseTypeId,
            actualApplyDays: this.onChangeFilterDiffDay(values.date),
            actualStartAt: moment(values.date[0]).format('YYYY-MM-DD HH:00:00'),
            actualDoneAt: moment(values.date[1]).format('YYYY-MM-DD HH:00:00'),
            bizExtraData,
            fileList: this.state.fileList,
          }],
          onSuccessCallback: this.onSuccessCallback, // 成功回调
          onFailureCallback: this.onFailureCallback, // 失败回调
        };
        if (payload.records[0].actualStartAt === payload.records[0].actualDoneAt) return message.error('开始时间与结束时间不能完全相同');
        this.props.dispatch({ type: 'expenseCostOrder/createCostOrder', payload });
      }
    });
  }


  // 改变科目回调
  onChangeSubject = (selectedSubjectId, selectedCostCenterType) => {
    const { costAttribution } = this.state;
    // 设置当前选择的科目id值
    this.setState({
      selectedSubjectId,
      selectedCostCenterType,
      costAttribution: selectedSubjectId ? costAttribution : undefined,
    });
    const { form } = this.props;
    form.setFieldsValue({ costCenterType: selectedCostCenterType });
  }

  // 成本归属
  onChangeCostAttribution = (val, isInit) => {
    const { form } = this.props;

    const {
      cost_center_type: costCenterType = undefined, // 成本归属
      team_type_list: teamTypeList = [], // 团队类型列表
    } = val;

    this.setState({
      costAttribution: costCenterType, // 成本归属
      teamTypeList,
    });

    const expense = form.getFieldsValue(['expense']).expense || {};
    let { costBelong = undefined } = expense;
    const { costItems = [] } = expense;

    if (costBelong === undefined && val !== ExpenseCostCenterType.person) {
      costBelong = ExpenseCostOrderBelong.average;
    }

    form.setFieldsValue({ expense: { costBelong, costItems: isInit ? costItems : [{}] } });
  }

  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const list = this.state.fileList;
    list.push(e);
    this.setState({
      fileList: list,
    });
  }

  // 删除文件
  onDeleteFile = (index) => {
    const list = this.state.fileList;
    list.splice(index, 1);
    this.setState({
      ...this.state,
      fileList: list,
    });
    this.props.form.setFieldsValue({ fileList: list });
  }

  // 获取成本分摊中的平台、供应商
  getPlatFormVendor = (apportionData) => {
    this.setState({
      apportionData,
    }, () => {
      this.props.form.resetFields('invoiceTitle');
    });
  }

  // 基础信息
  renderBasics = () => {
    const name = authorize.account.name;
    const { expenseTypeName } = this.state;
    const fromItems = [
      {
        label: '费用分组',
        form: expenseTypeName,
      },
      {
        label: '申请人',
        form: name || '--',
      },
    ];
    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={fromItems} cols={2} />
      </CoreContent>
    );
  }

  // 项目信息
  renderExpenseInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const {
      detail,
      fileList = [],
      selectedSubjectId,
      expenseTypeId,
      selectedCostCenterType,
      apportionData,
      costAttribution,
      teamTypeList,
      platform,
    } = this.state;

    // 如果费用分组id没有值，则return
    if (!expenseTypeId) {
      return;
    }

    // 发票表单（科目成本归属为总部时，使用一套发票表单）
    const invoice = selectedCostCenterType === ExpenseCostCenterType.headquarters ?
      ({
        label: '发票抬头',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 9 } },
        form: getFieldDecorator('invoiceTitle', { initialValue: dot.get(detail, 'invoiceTitle', undefined) })(
          <InvoiceHeader platform="zongbu" />,
        ),
      })
      : ({
        label: '发票抬头',
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 9 } },
        form: getFieldDecorator('invoiceTitle', { initialValue: apportionData.vendorName })(
          <CommonSelectSuppliers
            platforms={apportionData.platform}
            allowClear
            showSearch
            optionFilterProp="children"
            placeholder="请选择供应商"
            isSubmitNameAsValue
          />,
        ),
      });

    const formItems = [
      invoice,
      {
        label: '备注',
        form: getFieldDecorator('note', { initialValue: dot.get(detail, 'note', undefined) })(
          <TextArea rows={2} />,
        ),
      }, {
        label: '上传附件',
        form: (
          <div>
            <CoreUpload
              domain="cost"
              namespace={this.private.namespace}
              onSuccess={this.onUploadSuccess}
              onFailure={this.onUploadFailure}
            />
            {
              fileList.map((item, index) => {
                return (
                  <p key={index}>{item}
                    <span
                      onClick={() => { this.onDeleteFile(index); }}
                      className={styles['app-comp-expense-create-files-del-btn']}
                    >删除</span>
                  </p>
                );
              })
            }
          </div>
        ),
      },
    ];

    return (
      <CoreContent title="项目信息">
        {/* 科目设置 */}
        {
          getFieldDecorator('subject', { initialValue: undefined })(
            <CommonSubject
              selectedSubjectId={selectedSubjectId}
              expenseTypeId={expenseTypeId}
              form={this.props.form}
              platform={platform}
              onChangeSubject={this.onChangeSubject}
              onChangeCostAttribution={this.onChangeCostAttribution}
            />,
          )
        }

        {/* 成本分摊 */}
        {
          getFieldDecorator('expense', { initialValue: {} })(
            <CommonExpense
              costAccountingId={selectedSubjectId}
              selectedCostCenterType={selectedCostCenterType}
              getPlatFormVendor={this.getPlatFormVendor}
              form={this.props.form}
              costAttribution={costAttribution}
              teamTypeList={teamTypeList}
              platform={platform}
            />,
          )
        }

        {/* 备注，上传 */}
        <DeprecatedCoreForm items={formItems} cols={1} layout={{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }} />
      </CoreContent>
    );
  }

  // 支付信息
  renderPaymentInfo = () => {
    const { form = {} } = this.props;
    const { detail } = this.state;
    return (<Collection
      form={form}
      detail={detail}
      totalMoney={form.getFieldValue('money')}
    />);
  }

  // 渲染隐藏表单
  renderHiddenForm = () => {
    const { selectedCostCenterType } = this.state;
    const { form } = this.props;

    const formItems = [
      {
        label: '',
        form: form.getFieldDecorator('costCenterType', { initialValue: selectedCostCenterType })(<Input hidden />),
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
        className={styles['app-comp-expense-manage-create-form-hide']}
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  render() {
    return (
      <Form layout="horizontal">
        {/* 基础信息 */}
        {this.renderBasics()}

        {/* 出差信息 */}
        <TravelApplyOrder
          form={this.props.form}
        />

        {/* 费用信息 */}
        <Cost
          form={this.props.form}
        />

        {/* 项目信息 */}
        { this.renderExpenseInfo() }

        {/* 收款信息 */}
        {this.renderPaymentInfo()}

        {/* 隐藏表单 */}
        {this.renderHiddenForm()}

        <div className={styles['app-comp-expense-create-operate-wrap']}>
          <Button type="primary" onClick={this.onSubmit}>提交</Button>
        </div>
      </Form>
    );
  }
}

export default connect()(Form.create()(TravelApplyOrderCreate));