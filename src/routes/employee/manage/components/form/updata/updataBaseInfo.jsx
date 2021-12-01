/**
 * 个人信息（编辑）
 */
import is from 'is_js';
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
  CommonSelectRegionalCascade,
} from '../../../../../../components/common';
import {
  Gender,
  PoliticalStatusType,
  MaritalStatusType,
  SignContractType,
  FileType,
} from '../../../../../../application/define';

import style from './style.css';

const { Option } = Select;
const RadioGroup = Radio.Group;

class UpdataBaseInfo extends Component {
  static propTypes = {
    employeeDetail: PropTypes.object, // 人员详情
  }

  static defaultProps = {
    employeeDetail: {},
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

  // 校验工作地
  onValidatorWorkplace = (rule, value = {}, callback) => {
    // 数据为空
    if (is.not.existy(value) || is.empty(value)) {
      callback('请选择工作地');
      return;
    }
    // 省份为空
    if (is.not.existy(value.province) || is.empty(value.province)) {
      callback('请选择工作地省份');
      return;
    }
    // 城市为空
    if (is.not.existy(value.city) || is.empty(value.city)) {
      callback('请选择工作地城市');
      return;
    }
    callback();
  }

  // 出生日期选择范围限制
  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  }

  renderForm = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { signType, disabledName, disabledGender, disabledPhone, fileType } = this.props;
    const {
      // sign_type: signType,                                 // 签约类型
      // profile_type: fileType,                              // 档案类型
      name = '',                                           // 姓名
      gender_id: gender,                                   // 性别
      born_in: initBirthday = undefined,                   // 出生日期
      national,                                            // 名族
      politics_status: politicalStatus,                    // 政治面貌
      marital_status: maritalStatus,                       // 婚姻状况
      birth_place: birthplace = '',                        // 籍贯
      native_place: accountLocation = '',                  // 户口所在地
      often_address: oftenAddress = '',                    // 常居地
      phone = '',                                          // 手机号
      telephone: fixedTelephone,                           // 固定电话
      email = '',                                          // 邮箱
      education,                                           // 学历
      emergency_contact: emergencyContact = '',            // 紧急联系人
      emergency_contact_phone: emergencyContactPhone = '', // 紧急联系人电话
      height,                                              // 身高
      weight,                                              // 体重
      constellation,                                       // 星座
      interest: hobby = '',                                // 兴趣爱好
      speciality: specialty = '',                          // 特长
      work_province_code: workProvinceCode = '',                    // 工作地省份
      work_city_code: workCityCode = '',                            // 工作地城市
      work_email: workEmail, // 工作邮箱
    } = this.props.employeeDetail;
    // 出生日期
    const birthday = getFieldValue('birthday') ? getFieldValue('birthday').format('YYYYMMDD') : initBirthday;
    const formItems = [
      {
        label: '姓名',
        key: 'name',
        form: getFieldDecorator('name', {
          rules: [
            { required: true, message: '请填写内容' },
            { pattern: /^[\u4e00-\u9fa5a-zA-Z-z]+$/g, message: '只能输入字母,汉字' },
          ],
          initialValue: name,
        })(
          <Input
            disabled={disabledName}
            placeholder="请输入姓名"
          />,
        ),
      },
      {
        label: '性别',
        key: 'gender',
        form: getFieldDecorator('gender', {
          rules: [{ required: true, message: '请选择内容' }],
          initialValue: gender && `${gender}`,
        })(
          <RadioGroup
            disabled={disabledGender}
          >
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
          initialValue: national ? `${national}` : undefined,
        })(
          <CommonSelectNations className={style['app-comp-employee-manage-update-base-list']} />,
        ),
      },
      {
        label: '政治面貌',
        key: 'politicalStatus',
        form: getFieldDecorator('politicalStatus', {
          initialValue: politicalStatus ? `${politicalStatus}` : undefined,
        })(
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
        form: getFieldDecorator('maritalStatus', {
          initialValue: maritalStatus ? `${maritalStatus}` : undefined,
        })(
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
          initialValue: birthplace,
        })(
          <Input placeholder="请输入籍贯" />,
        ),
      },
      {
        label: '户口所在地',
        key: 'accountLocation',
        form: getFieldDecorator('accountLocation', {
          initialValue: accountLocation,
        })(
          <Input placeholder="请输入户口所在地" />,
        ),
      },
      {
        label: '常居地',
        key: 'oftenAddress',
        form: getFieldDecorator('oftenAddress', {
          rules: [{ required: true, message: '请填写内容' }],
          initialValue: oftenAddress,
        })(
          <Input
            placeholder="请输入常居地"
          />,
        ),
      },
      {
        label: '手机号',
        key: 'phone',
        form: getFieldDecorator('phone', {
          rules: [{ required: true, pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' }],
          initialValue: phone,
        })(
          <Input placeholder="请输入手机号" disabled={disabledPhone} />,
        ),
      },
      {
        label: '固定电话',
        key: 'fixedTelephone',
        form: getFieldDecorator('fixedTelephone', {
          initialValue: fixedTelephone,
        })(
          <Input placeholder="请输入固定电话" />,
        ),
      },

      {
        label: '个人邮箱',
        key: 'email',
        form: getFieldDecorator('email', {
          rules: [{ type: 'email', message: '请输入正确邮箱地址' }],
          initialValue: email,
        })(
          <Input placeholder="请输入邮箱" />,
        ),
      },
      {
        label: '学历',
        key: 'education',
        form: getFieldDecorator('education', {
          rules: [{ required: true, message: '请填写内容' }],
          initialValue: education ? `${education}` : undefined,
        })(
          <CommonSelectEducations allowClear className={style['app-comp-employee-manage-update-base-list']} />,
        ),
      },
      {
        label: '紧急联系人',
        key: 'emergencyContact',
        form: getFieldDecorator('emergencyContact', {
          initialValue: emergencyContact,
        })(
          <Input placeholder="请输入联系人姓名" />,
        ),
      },
      {
        label: '紧急联系人联系电话',
        key: 'emergencyContactPhone',
        form: getFieldDecorator('emergencyContactPhone', {
          rules: [{ required: true, pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' }],
          initialValue: emergencyContactPhone,
        })(
          <Input placeholder="请输入紧急联系人联系电话" />,
        ),
      },
      {
        label: '身高',
        key: 'height',
        form: getFieldDecorator('height', {
          initialValue: height,
        })(
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
        form: getFieldDecorator('weight', {
          initialValue: weight,
        })(
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
        form: getFieldDecorator('constellation', {
          initialValue: constellation ? `${constellation}` : undefined,
        })(
          <CommonSelectConstellation allowClear />,
        ),
      },
      {
        label: '兴趣爱好',
        key: 'hobby',
        form: getFieldDecorator('hobby', {
          initialValue: hobby,
        })(
          <Input placeholder="请输入兴趣爱好" />,
        ),
      },
      {
        label: '特长',
        key: 'specialty',
        form: getFieldDecorator('specialty', {
          initialValue: specialty,
        })(
          <Input placeholder="请输入特长" />,
        ),
      },
    ];
    // 判断是否是人员
    if (Number(fileType) === FileType.staff) {
      formItems.splice(8, 0,
        {
          label: '工作地',
          key: 'workplace',
          form: getFieldDecorator('workplace', {
            rules: [
            { required: true },
            { validator: this.onValidatorWorkplace },
            ],
            initialValue: workProvinceCode && workCityCode ?
              { province: Number(workProvinceCode), city: Number(workCityCode) } : {},
          })(
            <CommonSelectRegionalCascade
              style={{ province: { width: '100%' }, city: { width: '100%' } }}
              isHideArea
            />,
        ),
        },
      );
    }
    // 判断是否是人员
    if (Number(fileType) === FileType.staff) {
      formItems.splice(9, 0,
        {
          label: '工作邮箱',
          key: 'work_email',
          form: getFieldDecorator('workEmail', {
            rules: [{ type: 'email', message: '请输入正确邮箱地址' }],
            initialValue: workEmail,
          })(
            <Input placeholder="请输入邮箱" />,
          ),
        },
      );
    }

    if (`${signType}` === `${SignContractType.paper}`) {
      formItems.splice(3, 0,
        {
          label: '出生日期',
          key: 'birthday',
          form: getFieldDecorator('birthday', {
            rules: [{ required: true, message: '请填写内容' }],
            initialValue: birthday && moment(`${birthday}`),
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
            <span>{birthday ? moment().year() - moment(`${birthday}`).year() : '--'}</span>,
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
    const { isUpdata } = this.props;
    return (
      <CoreContent title={`${isUpdata ? '基本信息' : '个人信息'}`}>
        {/* 渲染表单信息 */}
        {this.renderForm()}
      </CoreContent>
    );
  }
}

export default UpdataBaseInfo;
