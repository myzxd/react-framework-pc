/**
 * 结算任务设置 - 创建结算计划设置
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Radio,
  Checkbox,
  DatePicker,
  Input,
  Button,
  Row,
  Col,
  Select,
  Tooltip,
  message,
} from 'antd';
import styles from './style/index.less';

import { CoreContent, DeprecatedCoreForm } from '../../../../components/core';
import { HouseholdType, FinanceSalaryDeductions, FinanceSalaryCycleType, SupplierState } from '../../../../application/define';
import Operate from '../../../../application/define/operate';
import { CommonSelectCities, CommonSelectPlatforms, CommonSelectSuppliers } from '../../../../components/common';

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const { MonthPicker } = DatePicker;

class CreatePaydayTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        platforms: '',            // 平台
        suppliers: '',            // 供应商
        cities: '',               // 城市(页面组件选中使用)
        work: [HouseholdType.first],          // 工作性质
        startDate: undefined,     // 首次开始日期
        cycle: FinanceSalaryCycleType.month,         // 结算周期
        deductions: FinanceSalaryDeductions.taskNo,         // 补扣款
        day: 1,                   // 延期天数
        date: 1,                  // 周期时间的选择
      },
      text: '月',                  // 右边文字
      isShowDay: false,            // 显示天数弹窗内容
      dayItem: [],                 // 月份
      monthItem: [],               // 天数
    };
  }

  componentDidMount = () => {
    this.onSetDate();
  }

  // 重置
  onReset = () => {
    this.setState({
      fields: {
        platforms: '',            // 平台
        suppliers: '',            // 商圈
        cities: '',               // 城市(页面组件选中使用)
        districts: '',            // 商圈
        work: [HouseholdType.first],          // 工作性质
        startDate: '',            // 首次开始日期
        cycle: FinanceSalaryCycleType.month,         // 结算周期
        deductions: FinanceSalaryDeductions.taskNo,         // 补扣款
        day: 1,                   // 延期天数
        date: 1,                  // 周期时间的选择
      },
    });
    // 重置表单
    this.props.form.resetFields();
  }

  // 更新数据
  onUpdateData = () => {
    this.props.dispatch({ type: 'financeTask/fetchPayrollPlanList' });
  }

  // 失败的回调的错误提示
  onFailureCallback = (res) => {
    message.error(res.zh_message);
  }

  // 创建发薪计设置
  onCreatePayday = (e) => {
    const { fields } = this.state;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (err) {
        return;
      }
      const { platforms, suppliers, cities, cycle, deductions, day } = value;
      const params = {
        platforms,        // 平台
        suppliers,        // 供应商
        cities,              // 城市
        work: fields.work,                  // 工作性质
        startDate: Number(moment(fields.startDate).format('YYYYMMDD')),        // 首次开始日期
        cycle,                // 结算周期
        deductions,      // 补扣款
        day: Number(fields.day),                    // 延期天数
        date: day,                  // 周期时间的选择
      };
      this.props.dispatch({
        type: 'financeTask/createPayrollPlan',
        payload: {
          params,
          onSuccessCallback: this.onUpdateData,
          onFailureCallback: this.onFailureCallback,
        },
      });
    });
  }

  // 更换平台
  onChangePlatforms = (e) => {
    const { form } = this.props;
    const { fields } = this.state;
    fields.platforms = e;
    fields.suppliers = '';
    fields.districts = '';
    fields.cities = '';
    this.setState({ fields });
    // 清空选项
    form.setFieldsValue({ suppliers: '' });
    form.setFieldsValue({ cities: '' });
  }

  // 更换供应商
  onChangeSuppliers = (e) => {
    const { form } = this.props;
    const { fields } = this.state;
    fields.suppliers = e;
    fields.cities = '';
    fields.districts = '';
    this.setState({ fields });

    // 清空选项
    form.setFieldsValue({ cities: '' });
  }

  // 更换城市
  onChangeCity = (e) => {
    const { fields } = this.state;
    // 保存城市参数
    fields.cities = e;
    this.setState({ fields });
  }

  // 更换区域
  onChangeDistrict = (e) => {
    const { fields } = this.state;
    // 保存商圈参数
    fields.districts = e;
    this.setState({ fields });
  }

  // 功能工作性质
  onChangeWork = (e) => {
    const { fields } = this.state;
    fields.work = e;
    this.setState({ fields });
  }

  // 首次开始日期
  onChangeStartDate = (date, dateString) => {
    const { fields } = this.state;
    fields.startDate = dateString;
    this.setState({ fields });
  }

  // 结算周期
  onChangeCycle = (e) => {
    const { fields } = this.state;
    const { form } = this.props;
    fields.cycle = e;
    if (Number(e) === FinanceSalaryCycleType.day) {
      this.setState({
        text: '天',
        isShowDay: true,   // 显示天数弹窗
        isShowModal: true, // 显示弹窗
      });
    } else {
      this.setState({
        text: '月',
        isShowDay: false,   // 显示天数弹窗
        isShowModal: true, // 显示弹窗
      });
    }
    this.setState({ fields });
    form.setFieldsValue({ day: '1' });
  }

  // 延期的天数
  onChangeDay = (e) => {
    const { fields } = this.state;
    fields.day = e.target.value;
    if (e.target.value > 0) {
      fields.day = e.target.value;
    } else {
      fields.day = 1;
    }
    this.setState({ fields });
  }

  // 设置时间
  onSetDate = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const mydate = new Date(year, month, 1);
    const time = new Date(mydate.getTime() - 1000).getDate();  // 获取当前月份的最后一天
    const dayItem = [];
    const monthItem = [];
    for (let item = 1; item <= time; item += 1) {
      monthItem.push(item);
      if (item <= 12) {
        dayItem.push(item);
      }
    }
    this.setState({
      dayItem,
      monthItem,
    });
  }

  // 渲染添加标签的表单
  renderCreateForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { platforms, suppliers, day } = this.state.fields;
    const content = []; // 渲染的内容
    const { isShowDay, dayItem, monthItem } = this.state;
    // 判断月份与天数
    if (isShowDay) {
      content.push(monthItem.map((item, index) => <Option key={index} value={`${item}`}>{item}</Option>));
    } else {
      content.push(dayItem.map((item, index) => <Option key={index} value={`${item}`}>{item}</Option>));
    }
    const options = [
      { label: HouseholdType.description(HouseholdType.first), value: HouseholdType.first },
      { label: HouseholdType.description(HouseholdType.second), value: HouseholdType.second },
    ];
    const formItems = [
      {
        label: '平台:',
        span: 8,
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('platforms', { rules: [{ required: true, message: '请选择平台' }], initialValue: undefined })(
          <CommonSelectPlatforms allowClear showSearch optionFilterProp="children" placeholder="请选择平台" onChange={this.onChangePlatforms} />,
        ),
      }, {
        label: '供应商:',
        span: 8,
        layout: { labelCol: { span: 7 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('suppliers', { rules: [{ required: true, message: '请选择供应商' }], initialValue: undefined })(
          <CommonSelectSuppliers state={SupplierState.enable} allowClear showSearch optionFilterProp="children" platforms={platforms} placeholder="请选择供应商" onChange={this.onChangeSuppliers} />,
        ),
      }, {
        label: '城市:',
        span: 8,
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('cities', { rules: [{ required: true, message: '请选择城市' }], initialValue: undefined })(
          <CommonSelectCities isExpenseModel className="maxHeight" enableSelectAll allowClear showSearch optionFilterProp="children" placeholder="请选择城市" platforms={platforms} suppliers={suppliers} onChange={this.onChangeCity} />,
        ),
      }, {
        label: '个户类型:',
        span: 8,
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('work', { rules: [{ required: true, message: '请选择个户类型' }], initialValue: HouseholdType.first })(
          <Radio.Group>
            <CheckboxGroup options={options} defaultValue={[HouseholdType.first]} onChange={this.onChangeWork}>{options.label}</CheckboxGroup>
          </Radio.Group>,
        ),
      }, {
        label: '首次开始月份:',
        span: 8,
        layout: { labelCol: { span: 7 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('StartDate', { rules: [{ required: true, message: '请选择首次开始日期' }], initialValue: null })(
          <MonthPicker onChange={this.onChangeStartDate} format="YYYY-MM" />,
        ),
      }, {
        label: '结算周期:',
        span: 5,
        layout: { labelCol: { span: 8 }, wrapperCol: { span: 14 } },
        form: getFieldDecorator('cycle', { rules: [{ required: true, message: '请选择结算周期' }], initialValue: `${FinanceSalaryCycleType.month}` })(
          <Select placeholder="请选择结算周期" onChange={this.onChangeCycle} disabled>
            <Option value={`${FinanceSalaryCycleType.day}`}>{FinanceSalaryCycleType.description(FinanceSalaryCycleType.day)}</Option>
            <Option value={`${FinanceSalaryCycleType.month}`}>{FinanceSalaryCycleType.description(FinanceSalaryCycleType.month)}</Option>
          </Select>,
        ),
      }, {
        label: '',
        span: 3,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('day', { rules: [{ required: true, message: '请选择首次开始日期' }], initialValue: '1' })(
          <Select onChange={this.onChangeDate} disabled>
            {content}
          </Select>,
        ),
      }, {
        label: '计算执行',
        span: 8,
        layout: { labelCol: { span: 5 }, wrapperCol: { span: 17 } },
        form: getFieldDecorator('perform', { rules: [{ required: true, message: '计算执行' }], initialValue: 1 })(
          <div className={styles['app-comp-finance-task-perform']}>
            <div className={styles['app-comp-finance-task-nowrap']}>
              <Tooltip title="结算任务的开始时间点">
                <QuestionCircleOutlined className={styles['app-comp-finance-task-Icon']} />
              </Tooltip>
              <span className={styles['app-comp-finance-task-fs8']}>
                <Tooltip title="结算周期最后一日延">
                  结算周期最后一日延
                </Tooltip>
              </span>
            </div>
            <Input addonAfter="天" value={day} type="Number" className={styles['app-comp-finance-task-margin']} onChange={this.onChangeDay} />
          </div>,
        ),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  // 渲染表单
  renderForm = () => {
    return (
      <div className={styles['app-comp-finance-Box']}>
        <CoreContent title="创建结算计划设置">
          <Form>
            {this.renderCreateForm()}
          </Form>
          <Row className="app-global-mgr10">
            <Col span={11} className={styles['app-comp-finance-task-align']} >
              <Button type="primary" onClick={this.onReset} >清空</Button>
            </Col>
            <Col span={11} offset={1}>
              {!Operate.canOperateFinanceManageTaskCreate() || <Button type="primary" onClick={this.onCreatePayday} >创建</Button>}
            </Col>
          </Row>
        </CoreContent>
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* 渲染表单内容*/}
        {this.renderForm()}
      </div>
    );
  }
}
function mapStateToProps({ financeTask }) {
  return { financeTask };
}
export default connect(mapStateToProps)(Form.create()(CreatePaydayTask));
