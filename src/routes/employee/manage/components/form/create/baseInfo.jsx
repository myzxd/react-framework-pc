/**
 * 个人信息（创建）(废弃)
 */
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Radio, DatePicker, Select, InputNumber } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import {
  CommonSelectNations,
  CommonSelectEducations,
  CommonSelectConstellation,
} from '../../../../../../components/common';
import {
  Gender,
  PoliticalStatusType,
  MaritalStatusType,
  SignContractType,
} from '../../../../../../application/define';

import style from './style.css';

const { Option } = Select;
const RadioGroup = Radio.Group;

class BaseInfo extends Component {
  static propTypes = {
    form: PropTypes.object,     // 父组件表单form
    signType: PropTypes.string, // 签约类型
  }

  static defaultProps = {
    form: {},
    signType: '',
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 更改出生日期事件
  onChangeBirthday = (e) => {
    const age = moment().year() - e.year();
    this.props.form.setFieldsValue({ age });
  }

  // 出生日期选择范围限制
  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  }

  renderForm = () => {
    const { signType } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    // 出生日期
    const birthday = getFieldValue('birthday') || '';
    const formItems = [
      {
        label: '姓名',
        key: 'name',
        form: getFieldDecorator('name', {
          rules: [
            { required: true, message: '请填写内容' },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z-z]+$/g, message: '只能输入字母,汉字' },
          ],
        })(
          <Input placeholder="请输入姓名" />,
        ),
      },
      {
        label: '性别',
        key: 'gender',
        form: getFieldDecorator('gender', {
          rules: [{ required: true, message: '请选择内容' }],
          initialValue: `${Gender.male}`,
        })(
          <RadioGroup>
            <Radio value={`${Gender.male}`}>{Gender.description(Gender.male)}</Radio>
            <Radio value={`${Gender.female}`}>{Gender.description(Gender.female)}</Radio>
          </RadioGroup>,
        ),
      },
      {
        label: '民族',
        key: 'national',
        form: getFieldDecorator('national', {
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <CommonSelectNations className={style['app-comp-employee-manage-form-create-baseInfo-national']} />,
        ),
      },
      {
        label: '政治面貌',
        key: 'politicalStatus',
        form: getFieldDecorator('politicalStatus')(
          <Select placeholder="请选择政治面貌" allowClear>
            <Option value={`${PoliticalStatusType.partyMember}`}>{PoliticalStatusType.description(PoliticalStatusType.partyMember)}</Option>
            <Option value={`${PoliticalStatusType.prepPartyMember}`}>{PoliticalStatusType.description(PoliticalStatusType.prepPartyMember)}</Option>
            <Option value={`${PoliticalStatusType.member}`}>{PoliticalStatusType.description(PoliticalStatusType.member)}</Option>
            <Option value={`${PoliticalStatusType.masses}`}>{PoliticalStatusType.description(PoliticalStatusType.masses)}</Option>
          </Select>,
        ),
      },
      {
        label: '婚姻状况',
        key: 'maritalStatus',
        form: getFieldDecorator('maritalStatus')(
          <Select placeholder="请选择婚姻状况" allowClear>
            <Option value={`${MaritalStatusType.married}`}>{MaritalStatusType.description(MaritalStatusType.married)}</Option>
            <Option value={`${MaritalStatusType.unmarried}`}>{MaritalStatusType.description(MaritalStatusType.unmarried)}</Option>
          </Select>,
        ),
      },
      {
        label: '籍贯',
        key: 'birthplace',
        form: getFieldDecorator('birthplace', {
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请输入籍贯" />,
        ),
      },
      {
        label: '户口所在地',
        key: 'accountLocation',
        form: getFieldDecorator('accountLocation')(
          <Input placeholder="请输入户口所在地" />,
        ),
      },
      {
        label: '常居地',
        key: 'oftenAddress',
        form: getFieldDecorator('oftenAddress', {
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <Input placeholder="请输入常居地" />,
        ),
      },
      {
        label: '手机号',
        key: 'phone',
        form: getFieldDecorator('phone', {
          rules: [{ required: true, pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' }],
        })(
          <Input placeholder="请输入手机号" />,
        ),
      },
      {
        label: '固定电话',
        key: 'fixedTelephone',
        form: getFieldDecorator('fixedTelephone')(
          <Input placeholder="请输入固定电话" />,
        ),
      },
      {
        label: '邮箱',
        key: 'email',
        form: getFieldDecorator('email', {
          rules: [{ type: 'email', message: '请输入正确邮箱地址' }],
        })(
          <Input placeholder="请输入邮箱" />,
        ),
      },
      {
        label: '学历',
        key: 'education',
        form: getFieldDecorator('education', {
          rules: [{ required: true, message: '请填写内容' }],
        })(
          <CommonSelectEducations allowClear className={style['app-comp-employee-manage-form-create-baseinfo-education']} />,
        ),
      },
      {
        label: '紧急联系人',
        key: 'emergencyContact',
        form: getFieldDecorator('emergencyContact')(
          <Input placeholder="请输入联系人姓名" />,
        ),
      },
      {
        label: '紧急联系人联系电话',
        key: 'emergencyContactPhone',
        form: getFieldDecorator('emergencyContactPhone', {
          rules: [{ required: true, pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' }],
        })(
          <Input placeholder="请输入紧急联系人联系电话" />,
        ),
      },
      {
        label: '身高',
        key: 'height',
        form: getFieldDecorator('height')(
          <InputNumber
            min={0}
            placeholder="请输入身高"
            formatter={value => `${value}cm`}
            parser={value => value.replace('cm', '')}
          />,
        ),
      },
      {
        label: '体重',
        key: 'weight',
        form: getFieldDecorator('weight')(
          <InputNumber
            min={0}
            placeholder="请输入体重"
            formatter={value => `${value}kg`}
            parser={value => value.replace('kg', '')}
          />,
        ),
      },
      {
        label: '星座',
        key: 'constellation',
        form: getFieldDecorator('constellation')(
          <CommonSelectConstellation allowClear />,
        ),
      },
      {
        label: '兴趣爱好',
        key: 'hobby',
        form: getFieldDecorator('hobby')(
          <Input placeholder="请输入兴趣爱好" />,
        ),
      },
      {
        label: '特长',
        key: 'specialty',
        form: getFieldDecorator('specialty')(
          <Input placeholder="请输入特长" />,
        ),
      },
    ];
    if (`${signType}` === `${SignContractType.paper}`) {
      formItems.splice(3, 0,
        {
          label: '出生日期',
          key: 'birthday',
          form: getFieldDecorator('birthday', {
            initialValue: null,
            rules: [{ required: true, message: '请填写内容' }],
          })(
            <DatePicker
              disabledDate={this.disabledDate}
              onChange={this.onChangeBirthday}
            />,
          ),
        },
        {
          label: '年龄',
          key: 'age',
          form: getFieldDecorator('age')(
            <span>{birthday ? moment().year() - moment(birthday).year() : '--'}</span>,
          ),
        },
      );
    }
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <Form layout="horizontal">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
      </Form>
    );
  }

  render() {
    return (
      <CoreContent title="个人信息">
        {/* 渲染表单信息 */}
        {this.renderForm()}
      </CoreContent>
    );
  }
}

export default BaseInfo;
