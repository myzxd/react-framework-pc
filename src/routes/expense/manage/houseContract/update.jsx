/**
 * 房屋管理/编辑房屋信息 /Expense/Manage/House/Update
 */

import dot from 'dot-prop';
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import is from 'is_js';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { message, Button, Row, Col } from 'antd';

import { authorize } from '../../../../application';
import { ExpenseCostCenterType, ExpenseHouseContractState } from '../../../../application/define';
import HouseInfo from './components/form/houseInfo';
import Deposit from './components/form/deposit';
import AgencyFees from './components/form/agencyFees';
import BaseInfo from './components/common/baseInfo';
import Rent from './components/form/rent';
import Ascription from './components/form/ascriptionNew';
import Renew from './components/form/renew';
import HistoryContract from './components/detail/renew'; // 历史合同信息（续签合同）
import Account from './components/detail/account'; // 房屋台账
import Contract from './components/form/contract';
import style from './style.css';

const platforms = authorize.platform();

class Edit extends Component {
  static propTypes = {
    houseContractDetail: PropTypes.object, // 房屋合同详情
    houseAccout: PropTypes.object, // 房屋台账
    examineFlowConfig: PropTypes.object, // 房屋审批流配置
    dispatch: PropTypes.func,
    form: PropTypes.object,
  };

  static defaultProps = {
    houseContractDetail: {}, // 房屋合同详情
    houseAccout: {}, // 房屋台账
    examineFlowConfig: {}, // 房屋审批流配置
    dispatch: () => {},
    form: {},
  };

  static getDerivedStateFromProps(prevProps, oriState) {
    const { houseContractDetail: prevData = {} } = prevProps;
    const { houseContractDetail = undefined } = oriState;

    // 更新
    if (houseContractDetail === undefined && Object.keys(prevData).length > 0) {
      const {
        migrateFlag = false, // 合同存量方式
        rentAccountingInfo: {
          id: rentAccountingId = '',
        } = {},
        pledgeAccountingInfo: {
          id: pledgeAccountingId = '',
        } = {},
        agentAccountingInfo: {
          id: agentAccountingId = '',
        } = {}, // 科目id
        state, // 合同状态
        costCenterType, // 成本中心
        platformCodes = [], // 平台
      } = prevData;

      return {
        houseContractDetail: prevData, // 合同详情
        migrateFlag: Number(migrateFlag),
        subject: {
          rentAccountingId,
          pledgeAccountingId,
          agentAccountingId,
        },
        isProcessing: state === ExpenseHouseContractState.processing,
        costCenterType,
        platform: platformCodes[0],
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      houseContractDetail: undefined,
      subject: undefined,
      migrateFlag: undefined,
      isProcessing: undefined,
      platform: undefined,
      costCenterType: undefined,
    };

    this.private = {
      searchParams: {
        page: 1,
        limit: 10,
      },
    };
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    // 房屋合同id
    const { id } = location.query;
    const params = {
      feature: 'house_contract',
      platforms: platforms.map(val => val.id),
    };
    // 房屋审批流配置
    dispatch({ type: 'expenseExamineFlow/fetchExamineFlowConfig', payload: params });
    // 房屋台账信息
    dispatch({ type: 'expenseHouseContract/fetchHouseAccount', payload: { id } });
  }

  // 清空数据
  componentWillUnmount() {
    this.props.dispatch({ type: 'expenseHouseContract/resetHouseContractDetail' });
    this.props.dispatch({ type: 'expenseCostOrder/resetCostOrders' });
  }

  // 搜索
  onSearch = () => {
    const { dispatch, location } = this.props;
    const { id } = location.query;
    if (!this.private.searchParams.page) {
      this.private.searchParams.page = 1;
    }
    if (!this.private.searchParams.limit) {
      this.private.searchParams.limit = 30;
    }
    if (!this.private.searchParams.id) {
      this.private.searchParams.id = id;
    }

    // 调用搜索
    dispatch({ type: 'expenseHouseContract/fetchHouseAccount', payload: this.private.searchParams });
  }

  // 修改分页
  onChangePage = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
  }

  // 改变每页展示条数
  onShowSizeChange = (page, limit) => {
    this.private.searchParams.page = page;
    this.private.searchParams.limit = limit;
    this.onSearch(this.private.searchParams);
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
      platform: '分摊信息平台未选择',     // 平台
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
    const { form = {}, dispatch, houseContractDetail = {} } = this.props;
    // 合同id
    const { id } = houseContractDetail;

    const copyInvoiceTitle = {};
    const routeToList = () => {
      window.location.href = '/#/Expense/Manage/House';
    };
    form.validateFields((errs, values) => {
      // 校验分摊明细数据
      if (this.onVerifyExpenseCostItems(dot.get(values, 'expense.costItems'), dot.get(values, 'costCenterType')) === false) {
        return;
      }
      if (errs) return;
      // 将发票抬头复制三份
      if (values.invoiceTitle) {
        copyInvoiceTitle.rentInvoiceTitle = values.invoiceTitle; //  租金发票抬头
        copyInvoiceTitle.pledgeInvoiceTitle = values.invoiceTitle; // 押金发票抬头
        copyInvoiceTitle.agentInvoiceTitle = values.invoiceTitle; // 中介费发票抬头
      }
      dispatch({
        type: 'expenseHouseContract/updateHouseContract',
        payload: {
          param: {
            ...values,
            ...copyInvoiceTitle,
            id,
          },
          onSuccessCallback: routeToList,
        },
      });
    });
  }

  // 保存并提交续签审批单
  onSaveAndCreateRenewOrder = () => {
    const { form = {}, dispatch, houseContractDetail = {} } = this.props;

    const { id } = houseContractDetail;
    const { isCreateRenew } = this.props.location.query;

    // 失败回调
    const failureCallback = (e) => {
      e.zh_message && message.error(e.zh_message);
    };
    const copyInvoiceTitle = {};

    // 生成续签审批单
    const execute = () => {
      if (id !== undefined) {
        window.location.href = `/#/Expense/Manage/House/Apply?id=${id}&isCreateRenew=${isCreateRenew}`;
      }
    };

    // 表单提交
    form.validateFields((errs, values) => {
      // 校验分摊明细数据
      if (this.onVerifyExpenseCostItems(dot.get(values, 'expense.costItems')) === false) {
        return;
      }

      if (errs) return;
      // 将发票抬头复制三份
      if (values.invoiceTitle) {
        copyInvoiceTitle.rentInvoiceTitle = values.invoiceTitle; //  租金发票抬头
        copyInvoiceTitle.pledgeInvoiceTitle = values.invoiceTitle; // 押金发票抬头
        copyInvoiceTitle.agentInvoiceTitle = values.invoiceTitle; // 中介费发票抬头
      }

      // 校验金额
      if (values.monthMoney !== '' && values.pledgeMoney !== '' && values.agentMoney !== '') {
        if (values.monthMoney + values.pledgeMoney + values.agentMoney === 0) {
          message.error('月租金和押金金额和费用金额不能都为0！！！');
          return;
        }
      }


      // 更新续签合同
      dispatch({
        type: 'expenseHouseContract/updateHouseContract',
        payload: {
          param: { ...values, ...copyInvoiceTitle, id },
          onSuccessCallback: execute,
          onFailureCallback: failureCallback,
        },
      });
    });
  }

  // 改变成本中心
  onChangeCostCenterType = (e) => {
    const { platform } = this.state;
    this.changeSubject(e, platform);
  }

  // 修改平台
  onChangePlatform = (e) => {
    const { costCenterType } = this.state;
    this.changeSubject(costCenterType, e);
  }

  // 改变存量合同模式
  onChangeMigrateFlag = (migrateFlag) => {
    this.setState({ migrateFlag });
  }

  // 自动更改科目
  changeSubject = (costCenterType, platform) => {
    const { examineFlowConfig = {}, form = {} } = this.props;
    const { setFieldsValue } = form;

    if (platform && costCenterType) {
      const subject = dot.get(
        examineFlowConfig,
        `${platform}.accountings`,
        {},
      );

      const rentAccountingId = dot.get(subject, `rent_accounting_id.${costCenterType}`, '');
      const pledgeAccountingId = dot.get(subject, `pledge_accounting_id.${costCenterType}`, '');
      const agentAccountingId = dot.get(subject, `agent_accounting_id.${costCenterType}`, '');
      this.setState({
        subject: {
          rentAccountingId, // 租金科目ID
          pledgeAccountingId, // 押金科目ID
          agentAccountingId, // 中介费科目ID
        },
        costCenterType, // 成本中心
        platform, // 平台
      });

      setFieldsValue({
        rentAccountingId, // 租金科目ID
        pledgeAccountingId, // 押金科目ID
        agentAccountingId, // 中介费科目ID
      });
    }
  }

  // 渲染基本信息
  renderBaseInfo = () => {
    const { houseContractDetail = {} } = this.props;
    return (
      <BaseInfo
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染历史合同信息
  renderHistoryContract = () => {
    const { houseContractDetail = {} } = this.props;
    const { fromContractId } = houseContractDetail;

    if (!fromContractId) {
      return null;
    }
    return (
      <HistoryContract
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染房屋台账
  renderAccount = () => {
    const { houseContractDetail = {}, houseAccout = {}, location } = this.props;

    // 是否为续签合同
    const { isCreateRenew = undefined } = location.query;

    // 续签合同时 || 台账数据为空时，不显示
    if (isCreateRenew || Object.keys(houseAccout).length === 0) return null;

    return (
      <Account
        houseContractDetail={houseContractDetail}
        houseAccout={houseAccout}
        onChangePage={this.onChangePage}
        onShowSizeChange={this.onShowSizeChange}
      />
    );
  }

  // 渲染房屋信息
  renderHouseInfo = () => {
    const { isProcessing } = this.state;
    const { form = {}, houseContractDetail = {}, location: { query = {} } = {} } = this.props;

    // 是否为续签合同新建
    const { isCreateRenew = undefined } = query;
    return (
      <HouseInfo
        form={form}
        houseContractDetail={houseContractDetail}
        disabled={isProcessing}
        isUpdate
        isCreateRenew={isCreateRenew}
      />
    );
  }

  // 渲染成本归属
  renderAscriptionInfo = () => {
    const { houseContractDetail = {}, form = {} } = this.props;
    return (
      <Ascription
        editMode
        form={form}
        onChangeCostCenterType={this.onChangeCostCenterType}
        onChangePlatform={this.onChangePlatform}
        houseContractDetail={houseContractDetail}
      />
    );
  }

  // 渲染付款方式
  renderPaymentMethod = () => {
    const { isProcessing } = this.state;
    const { houseContractDetail = {}, form = {} } = this.props;
    return (
      <Renew
        form={form}
        houseContractDetail={houseContractDetail}
        disabled={isProcessing}
      />
    );
  }

  // 渲染合同信息
  renderContract = () => {
    const { isProcessing } = this.state;
    const { houseContractDetail = {}, form = {}, location: { query = {} } = {} } = this.props;

    // 是否为续签合同新建
    const { isCreateRenew = undefined } = query;

    return (
      <Contract
        form={form}
        houseContractDetail={houseContractDetail}
        disabled={isProcessing}
        isCreateRenew={isCreateRenew}
        onChangeMigrateFlag={this.onChangeMigrateFlag}
      />
    );
  }

  // 渲染租金信息
  renderRentInfo = () => {
    const { isProcessing, migrateFlag, subject: { rentAccountingId } = {} } = this.state;
    const { houseContractDetail = {}, form = {} } = this.props;
    return (
      <Rent
        migrateFlag={migrateFlag}
        form={form}
        houseContractDetail={houseContractDetail}
        subjectId={rentAccountingId}
        disabled={isProcessing}
      />
    );
  }

  // 渲染押金信息
  renderDeposit = () => {
    const { isProcessing, subject: { pledgeAccountingId } = {} } = this.state;
    const { form = {}, houseContractDetail = {}, location: { query = {} } = {} } = this.props;
    const { isCreateRenew } = query;

    return (
      <Deposit
        form={form}
        houseContractDetail={houseContractDetail}
        subjectId={pledgeAccountingId}
        disabled={isProcessing}
        isCreateRenew={isCreateRenew}
      />
    );
  }

  // 渲染中介费信息
  renderAgencyFees = () => {
    const { form = {}, houseContractDetail = {} } = this.props;
    const { isProcessing, subject: { agentAccountingId } = {} } = this.state;

    return (
      <AgencyFees
        form={form}
        houseContractDetail={houseContractDetail}
        subjectId={agentAccountingId}
        disabled={isProcessing}
      />
    );
  }

  // 渲染操作按钮
  renderOprations = () => {
    // 房屋信息
    const { houseContractDetail = {}, location: { query = {} } = {} } = this.props;

    // 历史合同id
    const { fromContractId, state } = houseContractDetail;

    // 是否为续签合同新建
    const { isCreateRenew = undefined } = query;

    // 历史合同存在 && 续签合同新建，不渲染
    if ((fromContractId && state === ExpenseHouseContractState.pendding) || isCreateRenew) {
      return null;
    }
    return (
      <Row
        type="flex"
        align="middle"
        justify="space-around"
        className={style['app-comp-expense-house-contract-update']}
      >
        <Col>
          <Button
            type="primary"
            size="large"
            onClick={this.onSave}
          >
            保存
          </Button>
        </Col>
      </Row>
    );
  }

  // 渲染操作按钮
  renderRenewOprations = () => {
    // 房屋信息
    const { houseContractDetail = {} } = this.props;

    // 历史合同id
    const { fromContractId, state } = houseContractDetail;

    // 历史合同不存在 && 不为续签合同新建，不渲染
    if (!fromContractId || (state !== ExpenseHouseContractState.pendding && fromContractId)) {
      return null;
    }

    const operations = [(
      <Col key="save&generateRenew">
        <Button
          type="primary"
          size="large"
          onClick={this.onSaveAndCreateRenewOrder}
        >
          保存并生成费用申请单
        </Button>
      </Col>
    )];
    return (
      <Row
        type="flex"
        align="middle"
        justify="space-around"
        className={style['app-comp-expense-house-contract-update']}
      >
        {operations}
      </Row>
    );
  }

  render = () => {
    return (
      <Form layout="horizontal" onSubmit={this.onSubmit}>
        {/* 渲染基本信息 */}
        {this.renderBaseInfo()}

        {/* 渲染历史合同信息 */}
        {this.renderHistoryContract()}

        {/* 渲染房屋台账信息 */}
        {this.renderAccount()}

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

        {/* 渲染续签合同操作按钮 */}
        {this.renderRenewOprations()}
      </Form>
    );
  }
}

function mapStateToProps({ expenseHouseContract: { houseContractDetail, houseAccout }, expenseExamineFlow: { examineFlowConfig } }) {
  return { houseContractDetail, houseAccout, examineFlowConfig };
}


export default connect(mapStateToProps)(Form.create()(Edit));
