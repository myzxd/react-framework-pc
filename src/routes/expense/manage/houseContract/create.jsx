/**
 * 房屋管理 - 新建房屋信息 /Expense/Manage/House/Create
 */
import is from 'is_js';
import React, { Component } from 'react';
import { connect } from 'dva';
import dot from 'dot-prop';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { message, Button, Row, Col } from 'antd';


import { authorize } from '../../../../application';
import { ExpenseCostCenterType } from '../../../../application/define';
import HouseInfo from './components/form/houseInfo';
import Deposit from './components/form/deposit';
import AgencyFees from './components/form/agencyFees';
import Rent from './components/form/rent';
import Ascription from './components/form/ascriptionNew';
import Renew from './components/form/renew';
import Contract from './components/form/contract';
import style from './style.css';

const platforms = authorize.platform();

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      migrateFlag: 0,
      subject: { // 科目信息
        rentAccountingId: '', // 租金科目ID
        pledgeAccountingId: '', // 押金科目ID
        agentAccountingId: '', // 中介费科目ID
      },
      id: undefined, // 获取合同提交完成的合同id
      isDisable: true,  // 是否开启执行合同与预览生成费用申请单按钮
      isSaveDisable: false, // 保存合同操作是否禁用
      isUpdateContract: false, // 房屋合同是否可编辑
    };
    this.selected = {
      costCenterType: undefined,
      platform: undefined,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {
      feature: 'house_contract',
      platforms: platforms.map(val => val.id),
    };
    // 获取审批流设置
    dispatch({ type: 'expenseExamineFlow/fetchExamineFlowConfig', payload: params });
  }

  // 校验成本分摊数据
  onVerifyExpenseCostItems = (items = [], costCenterType) => {
    if (is.empty(items)) {
      message.error('分摊数据为空');
      return false;
    }
    if (is.not.array(items)) {
      message.error('分摊数据格式错误');
      return false;
    }

    // 项目信息转换
    const verifyKeys = {
      vendor: '分摊信息供应商未选择',      // 供应商id
      // platform: '分摊信息平台未选择',     // 平台
      city: '分摊信息城市未选择',         // 城市
      district: '分摊信息商圈未选择',     // 商圈
      costCount: '分摊金额不能为空',     // 分摊金额
    };

    // 是否校验错误
    let isVerifyError = false;

    // 因为收款信息可以有多条所以是数组先循环
    items.forEach((item, index) => {
      // 如果已经校验出错误，则不再继续校验。
      if (isVerifyError === true) {
        return;
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
    if (Number(costCenterType) === ExpenseCostCenterType.city) {
      const obj = {};
      items.forEach((item) => {
        if (obj[item.city]) {
          message.error('成本分摊对象不能重复');
          isVerifyError = true;
          return false;
        } else {
          obj[item.city] = true;
        }
      });
    }
    if (Number(costCenterType) === ExpenseCostCenterType.district) {
      const obj = {};
      items.forEach((item) => {
        if (obj[item.district]) {
          message.error('成本分摊对象不能重复');
          isVerifyError = true;
          return false;
        } else {
          obj[item.district] = true;
        }
      });
    }
    if (isVerifyError === true) {
      return false;
    }

    return true;
  }

  // 保存操作
  onSave = () => {
    const { form, dispatch } = this.props;
    const routeToList = (res) => {
      this.setState({
        id: res._id, // 获取合同提交完成的合同id
        isDisable: false,  // 预览生成费用申请单按钮开始
        isSaveDisable: true,
        isUpdateContract: true,
      });
      // window.location.href = '/#/Expense/Manage/House';
    };
    const failureCallback = (e) => {
      e.zh_message && message.error(e.zh_message);
    };
    const copyInvoiceTitle = {};
    form.validateFields((errs, values) => {
      // 校验分摊明细数据
      if (this.onVerifyExpenseCostItems(dot.get(values, 'expense.costItems'), dot.get(values, 'costCenterType')) === false) {
        return;
      }

      if (errs) return;
      if (values.monthMoney !== '' && values.pledgeMoney !== '' && values.agentMoney !== '') {
        if (values.monthMoney + values.pledgeMoney + values.agentMoney === 0) {
          message.error('月租金和押金金额和费用金额不能都为0！！！');
          return;
        }
      }
      // 将发票抬头复制三份
      if (values.invoiceTitle) {
        copyInvoiceTitle.rentInvoiceTitle = values.invoiceTitle; //  租金发票抬头
        copyInvoiceTitle.pledgeInvoiceTitle = values.invoiceTitle; // 押金发票抬头
        copyInvoiceTitle.agentInvoiceTitle = values.invoiceTitle; // 中介费发票抬头
      }
      dispatch({
        type: 'expenseHouseContract/createHouseContract',
        payload: {
          param: { ...values, ...copyInvoiceTitle },
          onSuccessCallback: routeToList,
          onFailureCallback: failureCallback,
        },
      });
    });
  }

  // 执行合同
  onSaveAndExecute = () => {
    const { dispatch } = this.props;
    const { id } = this.state;
    const routeToLink = () => {
      window.location.href = '/#/Expense/Manage/House';
    };
    const failureCallback = (e) => {
      message.error(e.zh_message);
    };
    dispatch({
      type: 'expenseHouseContract/createInitApplicationOrder',
      payload: {
        params: {
          id,
        },
        onSuccessCallback: routeToLink,
        onFailureCallback: failureCallback,
      },
    });
  }

  // 保存并生成费用申请单
  onSaveAndCreateOrder = () => {
    const { id } = this.state;
    if (id !== undefined) {
      window.location.href = `/#/Expense/Manage/House/Apply?id=${id}`;
    }
  }

  // 改变存量合同模式
  onChangeMigrateFlag = (migrateFlag) => {
    this.setState({ migrateFlag, isDisable: true });
  }

  // 改变成本中心
  onChangeCostCenterType = (e) => {
    this.selected.costCenterType = e;
    this.changeSubject();
  }

  onChangePlatform = (e) => {
    this.selected.platform = e;
    this.changeSubject();
  }

  // 自动更改科目
  changeSubject = () => {
    const { setFieldsValue } = this.props.form;
    const { platform, costCenterType } = this.selected;
    const examineFlowConfig = dot.get(this.props, 'examineFlowConfig', {});
    if (platform && costCenterType) {
      const subject = dot.get(examineFlowConfig, `${platform}.accountings`, {});
      const rentAccountingId = dot.get(subject, `rent_accounting_id.${costCenterType}`, '');
      const pledgeAccountingId = dot.get(subject, `pledge_accounting_id.${costCenterType}`, '');
      const agentAccountingId = dot.get(subject, `agent_accounting_id.${costCenterType}`, '');
      this.setState({
        subject: {
          rentAccountingId,
          pledgeAccountingId,
          agentAccountingId,
        },
      });
      setFieldsValue({
        rentAccountingId,
        pledgeAccountingId,
        agentAccountingId,
      });
    }
  }

  // 渲染房屋信息
  renderHouseInfo = () => {
    const form = this.props.form;
    const { isUpdateContract } = this.state;
    return (
      <HouseInfo
        form={form}
        disabled={isUpdateContract}
        onChangeMigrateFlag={this.onChangeMigrateFlag}
      />
    );
  }

  // 渲染付款方式
  renderRenew = () => {
    const form = this.props.form;
    const isCreate = true;
    return (
      <Renew
        form={form}
        isCreate={isCreate}
      />
    );
  }

  // 渲染合同信息
  renderContract = () => {
    const form = this.props.form;
    const isCreate = true;
    const { isUpdateContract } = this.state;
    return (
      <Contract
        form={form}
        isCreate={isCreate}
        disabled={isUpdateContract}
        onChangeMigrateFlag={this.onChangeMigrateFlag}
      />
    );
  }

  // 渲染成本归属
  renderAscriptionInfo = () => {
    const form = this.props.form;
    const { isUpdateContract } = this.state;
    return (
      <Ascription
        form={form}
        isUpdateContract={isUpdateContract}
        onChangeCostCenterType={this.onChangeCostCenterType}
        onChangePlatform={this.onChangePlatform}
        disabled={isUpdateContract}
      />
    );
  }

  // 渲染租金信息
  renderRentInfo = () => {
    const form = this.props.form;
    const { subject: { rentAccountingId }, migrateFlag, isUpdateContract } = this.state;
    const isCreate = true;
    return (
      <Rent
        migrateFlag={migrateFlag}
        form={form}
        subjectId={rentAccountingId}
        isCreate={isCreate}
        isUpdateContract={isUpdateContract}
        disabled={isUpdateContract}
      />
    );
  }

  // 渲染押金信息
  renderDeposit = () => {
    const form = this.props.form;
    const { subject: { pledgeAccountingId }, migrateFlag, isUpdateContract } = this.state;
    return (
      <Deposit
        form={form}
        migrateFlag={migrateFlag}
        disabled={isUpdateContract}
        subjectId={pledgeAccountingId}
      />
    );
  }

  // 渲染中介费信息
  renderAgencyFees = () => {
    const form = this.props.form;
    const { subject: { agentAccountingId }, isUpdateContract } = this.state;
    return (
      <AgencyFees
        form={form}
        disabled={isUpdateContract}
        subjectId={agentAccountingId}
      />
    );
  }

  // 渲染操作按钮
  renderOprations = () => {
    const { isDisable, isSaveDisable } = this.state;
    const { migrateFlag } = this.state;
    const operations = [(
      <Col key="save">
        <Button
          type="primary"
          size="large"
          disabled={isSaveDisable}
          onClick={this.onSave}
        >
          保存房屋合同
        </Button>
      </Col>
    )];
    if (migrateFlag) {
      operations.push((
        <Col key="save&excute">
          <Button
            type="primary"
            size="large"
            disabled={isDisable}
            onClick={this.onSaveAndExecute}
          >
            执行合同
          </Button>
        </Col>
      ));
    } else {
      operations.push((
        <Col key="save&generate">
          <Button
            type="primary"
            size="large"
            disabled={isDisable}
            onClick={this.onSaveAndCreateOrder}
          >
            预览生成费用申请单
          </Button>
        </Col>
      ));
    }
    return (
      <Row
        type="flex"
        align="middle"
        justify="space-around"
        className={style['app-comp-expense-house-contract-create']}
      >
        {operations}
      </Row>
    );
  }

  render = () => {
    return (
      <Form layout="horizontal">

        {/* 渲染房屋信息 */}
        {this.renderHouseInfo()}

        {/* 渲染成本归属信息 */}
        {this.renderAscriptionInfo()}

        {/* 渲染合同信息 */}
        {this.renderContract()}

        {/* 渲染租金信息 */}
        {this.renderRentInfo()}

        {/* 渲染押金信息 */}
        {this.renderDeposit()}

        {/* 渲染中介费信息 */}
        {this.renderAgencyFees()}

        {/* 渲染操作按钮 */}
        {this.renderOprations()}
      </Form>
    );
  }
}

function mapStateToProps({ expenseExamineFlow: { examineFlowConfig } }) {
  return { examineFlowConfig };
}

export default connect(mapStateToProps)(Form.create()(Create));
