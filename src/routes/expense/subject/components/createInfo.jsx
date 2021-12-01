/**
 * 科目设置 - 创建信息
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Select,
  Radio,
  Input,
} from 'antd';

import CosAttribution from '../common/attribution';

import {
  CoreContent,
  DeprecatedCoreForm,
  CoreSelect,
} from '../../../../components/core';
import { CommonSelectScene } from '../../../../components/common';
import { OaCostAccountingLevel, OaApplicationFlowRegulation, OaCostAccountingState } from '../../../../application/define';

import style from './style.css';

const { Option } = CoreSelect;
const { TextArea } = Input;

class CreateInfo extends Component {
  static propTypes = {
    subjectsData: PropTypes.object,
    form: PropTypes.object,
    dispatch: PropTypes.func,
  };

  static defaultProps = {
    subjectsData: {},
    form: {},
    dispatch: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      close: false,   // 关闭必填
      disable: true,  // 禁止填充数据
      closeCost: true, // 关闭成本
      disableCost: false,  // 禁止填充成本数据
      accountingCode: '', // 科目编码
    };
  }

  // 级别触发列表接口
  onChangeLevel = (value) => {
    const { form } = this.props;
    const values = value - 1;
    const params = {
      level: [values],
      page: 1,
      limit: 999999,
      state: [OaCostAccountingState.normal],
    };
    form.setFieldsValue({ attribution: undefined, superior: undefined, coding: undefined });
    this.setState({ accountingCode: '' });
    if (Number(value) === OaCostAccountingLevel.one) {
      this.setState({
        close: false,   // 关闭必填
        disable: true,  // 禁止填充数据
      });
    } else {
      this.setState({
        close: true,   // 关闭必填
        disable: false,  // 禁止填充数据
      });
    }
    if (values) {
      this.props.dispatch({ type: 'expenseSubject/fetchExpenseSubjects', payload: params });
    }
  }

  // 上级科目的赛选
  onChangeSuperior = (id) => {
    const { form, subjectsData: { data = [] } = {} } = this.props;
    const selectedSuperior = data.filter(subject => subject.id === id);
    if (selectedSuperior && selectedSuperior.length > 0) {
      this.setState({
        accountingCode: selectedSuperior[0].accountingCode,
      });
      form.setFieldsValue({ attribution: `${selectedSuperior[0].costCenterType || ''}` });
    }
    form.setFieldsValue({ coding: undefined });
  }

  // 是否是成本类
  onChangeCostOf = (e) => {
    const { form } = this.props;
    form.setFieldsValue({ attribution: undefined });
    if (e.target.value === OaApplicationFlowRegulation.no) {
      this.setState({
        closeCost: false, // 关闭成本
        disableCost: true,  // 禁止填充成本数据
      });
    } else {
      this.setState({
        closeCost: true, // 关闭成本
        disableCost: false,  // 禁止填充成本数据
      });
    }
  }

  // 渲染归属信息
  renderAttributionInfo = () => {
    const { subjectsData: { data = [] } = {}, form = {} } = this.props;
    const { getFieldDecorator } = form;
    const options = [];
    options.push(data.map((item, index) => <Option key={index} value={item.id}>{`${item.name}(${item.accountingCode})`}</Option>));
    const formItems = [
      {
        label: '级别 :',
        span: 9,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('level', { rules: [{ required: true, message: '请选择科目级别' }], initialValue: undefined })(
          <Select placeholder="请选择科目级别" onChange={this.onChangeLevel} >
            <Option value={`${OaCostAccountingLevel.one}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.one)}</Option>
            <Option value={`${OaCostAccountingLevel.two}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.two)}</Option>
            <Option value={`${OaCostAccountingLevel.three}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.three)}</Option>
            <Option value={`${OaCostAccountingLevel.four}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.four)}</Option>
            <Option value={`${OaCostAccountingLevel.five}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.five)}</Option>
            <Option value={`${OaCostAccountingLevel.six}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.six)}</Option>
            <Option value={`${OaCostAccountingLevel.seven}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.seven)}</Option>
            <Option value={`${OaCostAccountingLevel.eight}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.eight)}</Option>
            <Option value={`${OaCostAccountingLevel.nine}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.nine)}</Option>
            <Option value={`${OaCostAccountingLevel.ten}`}>{OaCostAccountingLevel.description(OaCostAccountingLevel.ten)}</Option>
          </Select>,
        ),
      },
      {
        label: '上级科目 :',
        span: 9,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('superior', { rules: [{ required: this.state.close, message: '请选择上级科目' }], initialValue: undefined })(
          <Select placeholder="请选择上级科目" onChange={this.onChangeSuperior} disabled={this.state.disable} showSearch allowClear optionFilterProp="children">
            {options}
          </Select>,
        ),
      },
      {
        label: '是否成本类',
        span: 9,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('costOf', {
          initialValue: OaApplicationFlowRegulation.is,
          rules: [{
            required: true,
            message: '请选择',
          }],
        })(
          <Radio.Group onChange={this.onChangeCostOf}>
            <Radio value={OaApplicationFlowRegulation.is}>{OaApplicationFlowRegulation.description(OaApplicationFlowRegulation.is)}</Radio>
            <Radio value={OaApplicationFlowRegulation.no}>{OaApplicationFlowRegulation.description(OaApplicationFlowRegulation.no)}</Radio>
          </Radio.Group>,
        ),
      },
      {
        label: '成本归属',
        span: 9,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('attribution', { rules: [{ required: this.state.closeCost, message: '请选择成本归属' }] })(
          <CosAttribution allowClear showSearch optionFilterProp="children" placeholder="请选择成本归属" />,
        ),
      },
      {
        label: '适用场景',
        span: 9,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('scense', { rules: [{ required: true, message: '请选择适用场景' }] })(
          <CommonSelectScene enumeratedType="subjectScense" />,
        ),
      },
    ];

    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  // 渲染归属信息
  renderBasicInfo = () => {
    const { getFieldDecorator } = this.props.form;
    const { accountingCode } = this.state;
    const formItems = [
      {
        label: '科目名称 :',
        span: 9,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        form: getFieldDecorator('name', { rules: [{ required: true, message: '请填写科目名称' }, { max: 128, message: '长度不得超过128' }], initialValue: undefined })(
          <Input type="text" placeholder="请输入科目名称" />,
        ),
      },
      {
        label: '科目编码 :',
        span: 9,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 15 } },
        form: <span>{accountingCode}{getFieldDecorator('coding', { rules: [{ required: true, message: '请填写科目编码' }, { len: 2, message: '必须是两位' }, { pattern: /\S{2,}/, message: '输入的内容不能为空格' }], initialValue: undefined })(
          <Input className={style['app-comp-expense-subject-components-coding']} type="text" placeholder="请输入科目编码" />,
        )}</span>,
      },
      {
        label: '科目描述 :',
        span: 23,
        layout: { labelCol: { span: 2 }, wrapperCol: { span: 19 } },
        form: getFieldDecorator('describe', { rules: [{ required: false, message: '请输入科目描述' }], initialValue: undefined })(
          <TextArea placeholder="请输入科目描述" className={style['app-comp-expense-subject-components-describe']} />,
        ),
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} />
    );
  }

  render = () => {
    return (
      <div>
        <CoreContent title="归属信息" >
          {/* 渲染归属信息 */}
          {this.renderAttributionInfo()}
        </CoreContent>
        <CoreContent title="基本信息" >
          {/* 渲染归属信息 */}
          {this.renderBasicInfo()}
        </CoreContent>
      </div>
    );
  }
}

export default CreateInfo;

