/**
 * 编辑差旅报销单
 */
import is from 'is_js';
import _ from 'lodash';
import dot from 'dot-prop';
import moment from 'moment';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, message } from 'antd';
import { connect } from 'dva';

import { CommonSelectSuppliers } from '../../../../../components/common';
import { ExpenseCostOrderBelong, Unit, ExpenseCostCenterType } from '../../../../../application/define';
import TravelApplyOrder from './components/travelApplyOrder'; // 出差信息
import Cost from './components/cost/index'; // 费用信息
import CommonSubject from '../../common/costSubject';  // 科目设置
import CommonExpense from '../../common/costExpense';  // 成本分摊
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import CoreUpload from '../../../components/uploadAmazon';
import Collection from '../../common/collection';
import InvoiceHeader from '../../template/components/invoiceHeader';
import style from './style.less';

const { TextArea } = Input;

class TravelApplyOrderUpdate extends Component {

  constructor(props) {
    super(props);
    const platform = dot.get(props, 'location.query.platform', '');
    this.state = {
      fileList: dot.get(props, 'costOrderDetail.attachments', []),                      // 文件列表
      fileUrlList: dot.get(props, 'costOrderDetail.attachmentPrivateUrls', []),                   // 附件下载地址列表
      detail: dot.get(props, 'costOrderDetail', {}),
      expenseTypeId: dot.get(props, 'costOrderDetail.costGroupId', undefined),         // 费用分组id
      selectedCostCenterType: dot.get(props, 'costOrderDetail.costAccountingInfo.costCenterType', undefined),     // 当前选择的成本中心类型
      selectedSubjectId: dot.get(props, 'costOrderDetail.costAccountingId', undefined), // 科目id
      apportionData: {}, // 分摊中平台、供应商数据
      currentInvoiceFlag: true, // 是否用接口返回数据中的发票抬头
      costAttribution: dot.get(props, 'costOrderDetail.costCenterType', undefined),
      teamTypeList: [], // 团队类型列表
      platform, // 审批单所属平台
    };
    // 上传文件的随机key
    this.private = {
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'expenseCostOrder/fetchCostOrderDetail',
      payload: {
        recordId: dot.get(this.props, 'location.query.recordId', ''),
      } });
  }

  componentDidUpdate(prevProps) {
    const {
      costOrderDetail: propsDetail = {},
    } = this.props;

    const {
      costOrderDetail: prevPropsDetail = {},
    } = prevProps;
    if (Object.keys(prevPropsDetail).length === 0 && Object.keys(prevPropsDetail).length !== Object.keys(propsDetail).length) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        fileList: dot.get(propsDetail, 'attachments', []),                              // 文件列表
        fileUrlList: dot.get(propsDetail, 'attachmentPrivateUrls', []),                 // 附件下载地址列表
        detail: propsDetail,
        expenseTypeId: dot.get(propsDetail, 'costGroupId', undefined),  // 费用分组id
        selectedCostCenterType: dot.get(propsDetail, 'costAccountingInfo.costCenterType', undefined),     // 当前选择的成本中心类型
      });
    }
  }

  componentWillUnmount() {
    // 重置，清空
    this.props.form.resetFields();
    this.props.dispatch({ type: 'expenseCostOrder/reduceCostOrderDetail', payload: {} });
  }

  // 成功的回调
  onSuccessCallback = () => {
    const { orderId, approvalKey } = this.props.location.query;

    // 跳转到创建借款审批单页面
    this.props.history.push(`/Expense/Manage/ExamineOrder/Form?orderId=${orderId}&approvalKey=${approvalKey}`);
  }

  // 失败回调
  onFailureCallback = (result) => {
    // 错误提示信息
    if (is.existy(result.zh_message) && is.not.empty(result.zh_message)) {
      return message.error(result.zh_message);
    }
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
      // 不过滤周六日
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
          id: dot.get(this.props, 'location.query.recordId', ''),
          record: {
            ...values,
            storage_type: 3, // 上传文件的类型
            expense,
            actualApplyDays: this.onChangeFilterDiffDay(values.date),
            actualStartAt: moment(values.date[0]).format('YYYY-MM-DD HH:00:00'),
            actualDoneAt: moment(values.date[1]).format('YYYY-MM-DD HH:00:00'),
            bizExtraData,
            fileList: this.state.fileList,
            // 上传文件的类型
          },
          onSuccessCallback: this.onSuccessCallback, // 成功回调
          onFailureCallback: this.onFailureCallback, // 失败回调
        };
        if (payload.record.actualStartAt === payload.record.actualDoneAt) return message.error('开始时间与结束时间不能完全相同');
        this.props.dispatch({ type: 'expenseCostOrder/updateCostOrder', payload });
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
    this.props.form.setFieldsValue({ fileList: list });
  }

  // 删除文件
  onDeleteFile = (index) => {
    const { fileList, fileUrlList } = this.state;
    fileList.splice(index, 1);
    fileUrlList.splice(index, 1);
    this.setState({
      ...this.state,
      fileList,
      fileUrlList,
    });
  }

  // 获取成本分摊中的平台、供应商
  getPlatFormVendor = (apportionData) => {
    this.setState({
      apportionData,
      currentInvoiceFlag: false,
    }, () => {
      this.props.form.resetFields('invoiceTitle');
    });
  }

  // 基础信息
  renderBasics = () => {
    const { detail } = this.state;
    const applyAccountInfo = detail.applyAccountInfo || {};
    const fromItems = [
      {
        label: '费用分组',
        form: detail.costGroupName || '--',
      },
      {
        label: '申请人',
        form: applyAccountInfo.name || '--',
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
      fileList = [],
      fileUrlList = [],
      expenseTypeId,
      detail,
      apportionData,
      currentInvoiceFlag,
      selectedSubjectId,
      costAttribution,
      teamTypeList,
      platform,
      selectedCostCenterType,
    } = this.state;

    // 费用单信息
    const { costOrderDetail = {} } = this.props;
    const {
      costAccountingId, // 科目id
      allocationMode = undefined, // 成本分摊方式
      costAllocationList = [], // 成本分摊
      costCenterType, // 成本中心
    } = costOrderDetail;

    const {
      costAccountingCode,
    } = detail;

    // 成本中心
    const expense = {
      costBelong: allocationMode,  // 成本归属分摊模式
      // 子项目
      costItems: costAllocationList.map((item) => {
        let costCount;
        if (item.money) {
          costCount = Unit.exchangePriceToYuan(item.money);
        }
        const costAllocation = {};
        // 平台
        if (item.platformCode) {
          costAllocation.platform = item.platformCode;
          costAllocation.platformName = item.platformCode;
        }
        // 供应商
        if (item.supplierId) {
          costAllocation.vendor = item.supplierId;
          costAllocation.vendorName = item.supplierName;
        }
        // 城市
        if (item.cityCode) {
          costAllocation.city = item.cityCode;
          costAllocation.cityName = item.cityName;
          costAllocation.citySpelling = item.citySpelling;
        }
        // 商圈
        if (item.bizDistrictId) {
          costAllocation.district = item.bizDistrictId;
          costAllocation.districtName = item.bizDistrictName;
        }

        if (item.teamId) {
          costAllocation.teamId = item.teamId;
          costAllocation.teamType = item.teamType;
          costAllocation.teamName = item.teamName;
          costAllocation.teamIdCode = item.teamIdCode;
        }

        if (Object.keys(item.staffInfo).length > 0) {
          const {
            identity_card_id: staffId,
            name: staffName,
          } = item.staffInfo;
          costAllocation.staffId = staffId;
          costAllocation.staffName = `${staffName}(${staffId})`;
        }

        // 自定义分配金额
        if (costCount) {
          costAllocation.costCount = costCount;
        }
        return costAllocation;
      }),
    };
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
        form: getFieldDecorator('invoiceTitle', { initialValue: currentInvoiceFlag ? dot.get(detail, 'invoiceTitle', undefined) : dot.get(apportionData, 'vendorName', undefined) })(
          <CommonSelectSuppliers
            platforms={dot.get(apportionData, 'platform', dot.get(detail, 'platformCodes.0', ''))}
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
                  <p key={index}>
                    {/* 判断，如果是刚上传的，则不能下载，因为没有对应的url */}
                    {
                      fileUrlList[index] ?
                        <a
                          className={style['app-comp-expense-update-upload']}
                          rel="noopener noreferrer"
                          target="_blank"
                          key={index}
                          href={fileUrlList[index]}
                        >
                          {item}
                        </a> :
                        <span>{item}</span>
                    }
                    <span
                      onClick={() => { this.onDeleteFile(index); }}
                      className={style['app-comp-expense-update-detele']}
                    >
                      删除
                    </span>
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
          getFieldDecorator('subject', { initialValue: { subjectId: costAccountingId, costAttribution: costCenterType } })(
            <CommonSubject
              selectedSubjectId={selectedSubjectId || costAccountingId}
              expenseTypeId={expenseTypeId}
              subjectCode={costAccountingCode}
              form={this.props.form}
              platform={platform}
              onChangeSubject={this.onChangeSubject}
              onChangeCostAttribution={this.onChangeCostAttribution}
            />,
          )
        }

        {/* 成本分摊 */}
        {
          getFieldDecorator('expense', { initialValue: expense })(
            <CommonExpense
              costAccountingId={selectedSubjectId || costAccountingId}
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
        <DeprecatedCoreForm
          items={formItems}
          cols={1}
          layout={{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }}
        />
      </CoreContent>
    );
  }

  // 支付信息
  renderPaymentInfo = () => {
    const { form = {}, costOrderDetail: detail = {} } = this.props;
    return <Collection form={form} detail={detail} totalMoney={form.getFieldValue('money')} />;
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
        className={style['app-comp-expense-manage-create-form-hide']}
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  render() {
    const {
      costOrderDetail = {},
    } = this.props;

    if (Object.keys(costOrderDetail).length === 0) return null;
    return (
      <Form layout="horizontal">
        {/* 基础信息 */}
        {this.renderBasics()}

        {/* 出差信息 */}
        <TravelApplyOrder
          form={this.props.form}
          detail={this.state.detail}
        />

        {/* 费用信息 */}
        <Cost
          form={this.props.form}
          detail={this.state.detail}
        />

        {/* 项目信息 */}
        { this.renderExpenseInfo() }

        {/* 收款信息 */}
        {this.renderPaymentInfo()}

        {/* 隐藏表单 */}
        {this.renderHiddenForm()}

        <div className={style['app-comp-expense-update-button']}>
          <Button type="primary" onClick={this.onSubmit}>提交</Button>
        </div>
      </Form>
    );
  }
}
function mapStateToProps({ expenseCostOrder: { costOrderDetail } }) {
  return {
    costOrderDetail,
  };
}

export default connect(mapStateToProps)(Form.create()(TravelApplyOrderUpdate));
