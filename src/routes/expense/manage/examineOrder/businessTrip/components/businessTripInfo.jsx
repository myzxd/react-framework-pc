/**
 * 出差信息
 */
import { connect } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Radio, Input, DatePicker, Checkbox, Row, Col } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { ExpenseBusinessTripType, ExpenseBusinessTripWay } from '../../../../../../application/define';
import { CommonSelectRegionalCascade } from '../../../../../../components/common';
import styles from './style.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

class BusinessTripInfo extends Component {
  static propTypes = {
    businessTripData: PropTypes.object, // 出差申请单详情
    isUpdate: PropTypes.bool,           // 是否是编辑状态
  }

  static defaultProps = {
    businessTripData: {},
    isUpdate: false,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 更改出差类别
  onChangeBusinessTripType = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ businessTripWay: [] });
  }

  // 更改预计出差日期
  onChangeBusinessTripTime = (val) => {
    if (!val) { // 清空
      this.props.form.resetFields(['businessTripCountDay']);
      return;
    }
    const count = this.countWorkDay(val[0], val[1]);
    this.props.form.setFieldsValue({ businessTripCountDay: count });
  }

  // 计算出差天数
  countWorkDay = (sDay, eDay) => {
    if (!sDay || !eDay) return 0;
    const days = eDay.diff(sDay, 'day');
    let diffDays = 0;
    if (days >= 0) {
      // 过滤休息日
      Array.from({ length: days }).forEach(() => {
        diffDays += 1;
      });
      return diffDays;
    }
    return 0;
  }

  // 出差类别
  renderBusinessTripType = () => {
    const { isUpdate, businessTripData } = this.props;
    const {
      biz_type: businessTripType = ExpenseBusinessTripType.oneWay, // 出差类别
    } = businessTripData;
    const { getFieldDecorator } = this.props.form;
    const initBusinessTripType = isUpdate ? businessTripType : ExpenseBusinessTripType.oneWay;
    const formItems = [
      {
        label: '出差类别',
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        span: 10,
        key: 'businessTripType',
        form: getFieldDecorator('businessTripType', {
          initialValue: initBusinessTripType,
          rules: [{ required: true, message: '请选择出差类别' }],
        })(
          <RadioGroup onChange={this.onChangeBusinessTripType}>
            <Radio value={ExpenseBusinessTripType.oneWay}>单程</Radio>
            <Radio value={ExpenseBusinessTripType.roundTrip}>往返</Radio>
          </RadioGroup>,
        ),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  // 出差方式
  renderBusinessTripWay = () => {
    const { isUpdate, businessTripData } = this.props;
    const {
      transport_kind: businessTripWay = [],  // 出差方式
    } = businessTripData;
    const { getFieldDecorator } = this.props.form;
    const initBusinessTripWay = isUpdate ? businessTripWay : [];
    const formItems = [
      {
        label: '出差方式',
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 22 } },
        key: 'businessTripWay',
        form: getFieldDecorator('businessTripWay', {
          initialValue: initBusinessTripWay,
          rules: [{ required: true, message: '请选择出差方式' }],
        })(
          <Checkbox.Group className={styles['app-comp-expense-business-trip-info-way-checkbox-group']}>
            <Row>
              <Col span={4}>
                <Checkbox value={ExpenseBusinessTripWay.planeOne}>{ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.planeOne)}</Checkbox>
              </Col>
              <Col span={4}>
                <Checkbox value={ExpenseBusinessTripWay.planeTwo}>{ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.planeTwo)}</Checkbox>
              </Col>
            </Row>
            <Row>
              <Col span={4}>
                <Checkbox value={ExpenseBusinessTripWay.heightIronOne}>{ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.heightIronOne)}</Checkbox>
              </Col>
              <Col span={4}>
                <Checkbox value={ExpenseBusinessTripWay.heightIronTwo}>{ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.heightIronTwo)}</Checkbox>
              </Col>
              <Col span={4}>
                <Checkbox value={ExpenseBusinessTripWay.bulletTrainOne}>{ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.bulletTrainOne)}</Checkbox>
              </Col>
              <Col span={4}>
                <Checkbox value={ExpenseBusinessTripWay.bulletTrainTwo}>{ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.bulletTrainTwo)}</Checkbox>
              </Col>
              <Col span={4}>
                <Checkbox value={ExpenseBusinessTripWay.train}>{ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.train)}</Checkbox>
              </Col>
            </Row>
            <Row>
              <Col span={4}>
                <Checkbox value={ExpenseBusinessTripWay.passengerCar}>{ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.passengerCar)}</Checkbox>
              </Col>
              <Col span={4}>
                <Checkbox value={ExpenseBusinessTripWay.drive}>{ExpenseBusinessTripWay.description(ExpenseBusinessTripWay.drive)}</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>,
        ),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  // 出发地
  renderDeparture = () => {
    const { isUpdate, businessTripData } = this.props;
    const {
      departure: {
        province, // 省
        city,     // 市
        area,     // 县
        detailed_address: departureAddress = '', // 详细地址
      } = {},
    } = businessTripData;
    const { getFieldDecorator } = this.props.form;
    const initDeparture = isUpdate ? { province, city, area } : {};
    const initDepartureAddress = isUpdate ? departureAddress : '';
    const formItems = [
      {
        label: '出发地',
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        span: 10,
        key: 'departure',
        form: getFieldDecorator('departure', {
          initialValue: initDeparture,
          rules: [{ required: true }],
        })(
          <CommonSelectRegionalCascade />,
        ),
      },
      {
        label: '',
        span: 12,
        key: 'departureAddress',
        form: getFieldDecorator('departureAddress', {
          initialValue: initDepartureAddress,
        })(
          <Input placeholder="请输入详细地址" />,
        ),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  // 目的地
  renderDestination = () => {
    const { isUpdate, businessTripData } = this.props;
    const {
      destination: {
        province, // 省
        city,     // 市
        area,     // 县
        detailed_address: destinationAddress = '', // 详细地址
      } = {},
    } = businessTripData;
    const { getFieldDecorator } = this.props.form;
    const initDestination = isUpdate ? { province, city, area } : {};
    const initDestinationAddress = isUpdate ? destinationAddress : '';
    const formItems = [
      {
        label: '目的地',
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        span: 10,
        key: 'destination',
        form: getFieldDecorator('destination', {
          initialValue: initDestination,
          rules: [{ required: true }],
        })(
          <CommonSelectRegionalCascade />,
        ),
      },
      {
        label: '',
        span: 12,
        key: 'destinationAddress',
        form: getFieldDecorator('destinationAddress', {
          initialValue: initDestinationAddress,
        })(
          <Input placeholder="请输入详细地址" />,
        ),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  // 预计出差时间
  renderBusinessTripTime = () => {
    const { isUpdate, businessTripData } = this.props;
    const {
      expect_start_at: startbusinessTripTime = undefined, // 预计出差开始时间
      expect_done_at: endbusinessTripTime = undefined,    // 预计出差结束时间
      expect_apply_days: businessTripCountDay = undefined,        // 预计出差天数
    } = businessTripData;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const initBusinessTripTime = isUpdate ? [moment(startbusinessTripTime), moment(endbusinessTripTime)] : [];
    const initBusinessTripCountDay = isUpdate ? businessTripCountDay : undefined;
    const businessTripDay = getFieldValue('businessTripCountDay') === 0
                            ? 0
                            : getFieldValue('businessTripCountDay') || initBusinessTripCountDay;
    const formItems = [
      {
        label: '预计出差时间',
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        span: 10,
        key: 'businessTripTime',
        form: getFieldDecorator('businessTripTime', {
          initialValue: initBusinessTripTime,
          rules: [{ required: true, message: '请选择预计出差时间' }],
        })(
          <RangePicker
            showTime={{ format: 'HH:00' }}
            format="YYYY-MM-DD HH:00"
            onChange={this.onChangeBusinessTripTime}
          />,
        ),
      },
      {
        label: '',
        span: 10,
        key: 'businessTripCountDay',
        form: getFieldDecorator('businessTripCountDay', {
          initialValue: initBusinessTripCountDay,
        })(
          <span>出差天数：{businessTripDay}天</span>,
        ),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  // 原由及说明
  renderReason = () => {
    const { isUpdate, businessTripData } = this.props;
    const {
      note: reason = '',  // 原由及说明
    } = businessTripData;
    const { getFieldDecorator } = this.props.form;
    const initReason = isUpdate ? reason : '';
    const formItems = [
      {
        label: '原由及说明',
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        span: 10,
        key: 'reason',
        form: getFieldDecorator('reason', {
          initialValue: initReason,
        })(
          <TextArea autoSize={{ minRows: 4 }} />,
        ),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  // 工作安排
  renderArrangement = () => {
    const { isUpdate, businessTripData } = this.props;
    const {
      working_plan: arrangement = '', // 工作安排
    } = businessTripData;
    const { getFieldDecorator } = this.props.form;
    const initArrangement = isUpdate ? arrangement : '';
    const formItems = [
      {
        label: '工作安排',
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        span: 10,
        key: 'arrangement',
        form: getFieldDecorator('arrangement', {
          initialValue: initArrangement,
        })(
          <TextArea autoSize={{ minRows: 4 }} />,
        ),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  render() {
    return (
      <CoreContent title="出差信息">
        {this.renderBusinessTripType()}
        {this.renderBusinessTripWay()}
        {this.renderDeparture()}
        {this.renderDestination()}
        {this.renderBusinessTripTime()}
        {this.renderReason()}
        {this.renderArrangement()}
      </CoreContent>
    );
  }
}

export default connect()(BusinessTripInfo);
