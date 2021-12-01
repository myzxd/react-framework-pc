/**
 * 创建\编辑出差申请单
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';
import { OaApplicationOrderType } from '../../../../../application/define';
import BusinessTravelerInfo from './components/businessTravelerInfo';
import BusinessTripInfo from './components/businessTripInfo';
import styles from './style.less';

class Index extends Component {
  static propTypes = {
    examineOrderDetail: PropTypes.object, // 审批单单详情
    businessTripData: PropTypes.object,   // 出差申请单详情
  }

  static defaultProps = {
    examineOrderDetail: {},
    businessTripData: {},
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.isUpdate = Boolean(this.props.location.query.costOrderId); // 是否为编辑
    this.shouldUpdate = 1;  // 创建页面第二次点击为编辑
  }

  componentDidMount() {
    const applicationOrderId = this.props.location.query.applicationOrderId; // 审批单id
    // 获取审批单详情数据
    this.props.dispatch({
      type: 'expenseExamineOrder/fetchExamineOrderDetail',
      payload: { id: applicationOrderId },
    });
    if (this.isUpdate) {
      const costOrderId = this.props.location.query.costOrderId; // 申请单id
      this.props.dispatch({
        type: 'expenseExamineOrder/fetchBusinessTrip',
        payload: { costOrderId },
      });
    }
  }

  // 点击保存
  onSave = (e) => {
    e.preventDefault();
    this.onSubmit({
      onCreateSuccessCallBack: this.onCreateSuccessCallBack,
    });
  }

  // 点击下一步
  onNext = (e) => {
    e.preventDefault();
    this.onSubmit({
      onCreateSuccessCallBack: this.onBack,
      onSuccessCallBack: this.onBack,
    });
  }

  // 返回审批单详情
  onBack = () => {
    const { history } = this.props;
    const applicationOrderId = this.props.location.query.applicationOrderId; // 审批单id
    history.push(`/Expense/Manage/ExamineOrder/Form?orderId=${applicationOrderId}`);
  }

  // 创建成功回调
  onCreateSuccessCallBack = () => {
    this.shouldUpdate += 1;
  }

  // 提交表单数据
  onSubmit = (params) => {
    const { _id: id = '' } = this.props.businessTripData;
    const applicationOrderId = this.props.location.query.applicationOrderId; // 审批单id
    const costOrderId = this.props.location.query.costOrderId || id; // 申请单id
    const cityCodes = [441900, 442000, 460300, 460400, 620200, 710000, 810000, 820000];
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const value = {
        ...fieldsValue,
        businessTripTime: [
          fieldsValue.businessTripTime[0].format('YYYY-MM-DD HH:mm:ss'),
          fieldsValue.businessTripTime[1].format('YYYY-MM-DD HH:mm:ss'),
        ],
      };
      if (value.businessTripTime[0] === value.businessTripTime[1]) return message.error('开始时间与结束时间不能完全相同');
      if (value.departure) {
        if (!value.departure.province) return message.error('请选择出发地省份');
        if (cityCodes.includes(value.departure.province) === false && !value.departure.city) return message.error('请选择出发地城市');
        if (cityCodes.includes(value.departure.province) === false
        && cityCodes.includes(value.departure.city) === false
        && !value.departure.area) return message.error('请选择出发地区/县');
      }
      if (value.destination) {
        if (!value.destination.province) return message.error('请选择目的地省份');
        if (cityCodes.includes(Number(value.destination.province)) === false && !value.destination.city) return message.error('请选择目的地城市');
        if (cityCodes.includes(Number(value.destination.province)) === false
        && cityCodes.includes(value.destination.city) === false
        && !value.destination.area) return message.error('请选择目的地区/县');
      }
      const payload = {
        ...value,
        ...params,
        applicationOrderId,
        costOrderId,
      };
      if (this.isUpdate || this.shouldUpdate >= 2) {
        this.props.dispatch({
          type: 'expenseExamineOrder/updateBusinessTrip',
          payload,
        });
        return;
      }
      this.props.dispatch({
        type: 'expenseExamineOrder/createBusinessTrip',
        payload,
      });
    });
  }

  // 渲染基本信息
  renderBasicInfo = () => {
    const {
      applyAccountInfo: { name: name = '' } = {},
      applicationOrderType: applicationOrderType = '',
      flowInfo: { name: flowName = '' } = {},
    } = this.props.examineOrderDetail;
    const {
      _id: id = '',
    } = this.props.businessTripData;
    const formItems = [
      {
        label: '申请人',
        key: 'name',
        form: <span>{name}</span>,
      },
      {
        label: '审批类型',
        key: 'examineType',
        form: <span>{OaApplicationOrderType.description(applicationOrderType)}</span>,
      },
      {
        label: '审批流程',
        key: 'examineProcess',
        form: <span>{flowName}</span>,
      },
    ];
    if (this.isUpdate) {
      formItems.unshift(
        {
          label: '出差申请单号',
          key: 'tripApplicationNumber',
          form: <span>{id}</span>,
        },
      );
    }
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <CoreContent title="基本信息">
        <DeprecatedCoreForm items={formItems} cols={4} layout={layout} />
      </CoreContent>
    );
  }

  // 渲染出差人信息
  renderBusinessTraveler = () => {
    const { businessTripData } = this.props;
    return (
      <BusinessTravelerInfo
        form={this.props.form}
        businessTripData={businessTripData}
        isUpdate={this.isUpdate}
      />
    );
  }

  // 渲染出差信息
  renderBusinessTrip = () => {
    const { businessTripData } = this.props;
    return (
      <BusinessTripInfo
        form={this.props.form}
        businessTripData={businessTripData}
        isUpdate={this.isUpdate}
      />
    );
  }

  render() {
    return (
      <Form layout="horizontal">
        {/* 渲染基本信息 */}
        {this.renderBasicInfo()}
        {/* 渲染出差人信息 */}
        {this.renderBusinessTraveler()}
        {/* 渲染出差信息 */}
        {this.renderBusinessTrip()}
        <CoreContent style={{ textAlign: 'center' }}>
          <Button type="primary" className={styles['app-comp-expense-form-save-btn']} onClick={this.onSave}>保存</Button>
          <Button type="primary" onClick={this.onNext}>下一步</Button>
        </CoreContent>
      </Form>
    );
  }
}

function mapStateToProps({ expenseExamineOrder: { examineOrderDetail, businessTripData } }) {
  return { examineOrderDetail, businessTripData };
}

export default Form.create()(connect(mapStateToProps)(Index));
