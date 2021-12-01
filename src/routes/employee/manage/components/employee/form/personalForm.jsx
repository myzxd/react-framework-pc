/**
 * 员工档案 - 创建 - 基本信息tab - 个人信息
 */
import dot from 'dot-prop';
import moment from 'moment';
import React from 'react';
import {
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  InputNumber,
} from 'antd';
import {
  Gender,
  MaritalStatusType,
  PoliticalStatusType,
} from '../../../../../../application/define';
import {
  CoreForm,
  CoreContent,
  CorePhotosAmazon,
  CoreOaUpload,
} from '../../../../../../components/core';
import {
  CommonSelectNations,
  CommonSelectConstellation,
  CommonSelectRegionalCascade,
  CommonSelectEducations,
} from '../../../../../../components/common';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const formProviceLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
const formOneLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

const { Option } = Select;

const PersonalForm = ({
  form,
  employeeDetail = {}, // 员工档案
}) => {
  // 校验出发地
  const checkDeparture = (_, value, callback) => {
    if (!value || Object.keys(value).length < 1) {
      return callback('请选择工作地');
    }

    const {
      province, // 省
      city, // 市
      // area, // 区
    } = value;

    if (!province) {
      return callback('请选择省份');
    }

    if (!city) {
      return callback('请选择城市');
    }

    callback();
  };

  const items = [
    <Form.Item
      label="姓名"
      name="name"
      // validateTrigger={['onUpdate', 'onDownStep']}
      rules={[
        { required: true, message: '请输入姓名' },
        { pattern: /^[\u4e00-\u9fa5a-zA-Z-z]+$/g, message: '只能输入字母,汉字' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入姓名" />
    </Form.Item>,
    <Form.Item
      label="手机号"
      name="phone"
      rules={[
        { required: true, message: '请输入手机号' },
        { pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入手机号" />
    </Form.Item>,
    <Form.Item
      label="性别"
      name="gender_id"
      rules={[
        { required: true, message: '请选择性别' },
      ]}
      {...formLayout}
    >
      <Radio.Group>
        <Radio
          value={Gender.male}
        >{Gender.description(Gender.male)}</Radio>
        <Radio
          value={Gender.female}
        >{Gender.description(Gender.female)}</Radio>
      </Radio.Group>
    </Form.Item>,
    <Form.Item
      label="民族"
      name="national"
      rules={[
        { required: true, message: '请选择民族' },
      ]}
      {...formLayout}
    >
      <CommonSelectNations />
    </Form.Item>,
    <Form.Item
      label="出生日期"
      name="born_in"
      rules={[
        { required: true, message: '请选择出生日期' },
      ]}
      {...formLayout}
    >
      <DatePicker
        disabledDate={c => (c && c > moment().endOf('day'))}
      />
    </Form.Item>,
    <Form.Item
      label="婚姻状况"
      name="marital_status"
      rules={[
        { required: true, message: '请选择婚姻状况' },
      ]}
      {...formLayout}
    >
      <Select placeholder="请选择婚姻状况" allowClear>
        <Option
          value={MaritalStatusType.married}
        >
          {MaritalStatusType.description(MaritalStatusType.married)}
        </Option>
        <Option
          value={MaritalStatusType.unmarried}
        >
          {MaritalStatusType.description(MaritalStatusType.unmarried)}
        </Option>
      </Select>
    </Form.Item>,
    {
      span: 16,
      key: 'work_address',
      render: (
        <Form.Item
          label={<span className="boss-form-item-required">工作地</span>}
          name="work_address"
          rules={[
            { validator: checkDeparture },
          ]}
          {...formProviceLayout}
        >
          <CommonSelectRegionalCascade
            isHideArea
            style={{
              province: { width: 150, marginRight: 20 },
              city: { width: 180 },
            }}
          />
        </Form.Item>
      ),
    },
    <Form.Item
      label="户口所在地"
      name="native_place"
      rules={[
        { required: true, message: '请输入户口所在地' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入户口所在地" />
    </Form.Item>,
    <Form.Item
      label="常居地"
      name="often_address"
      rules={[
        { required: true, message: '请输入常居地' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入常居地" />
    </Form.Item>,
    <Form.Item
      label="紧急联系人"
      name="emergency_contact"
      rules={[
        { required: true, message: '请输入紧急联系人' },
        { pattern: /^[\u4e00-\u9fa5A-Za-z]+$/, message: '请输入汉字或字母' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入紧急联系人" />
    </Form.Item>,
    <Form.Item
      label="紧急联系电话"
      name="emergency_contact_phone"
      rules={[
        { required: true, message: '请输入紧急联系电话' },
        { pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入紧急联系电话" />
    </Form.Item>,
    <Form.Item
      label="年龄"
      shouldUpdate={(prevVal, curVal) => prevVal.born_in !== curVal.born_in}
      // name="age"
      {...formLayout}
    >
      {
        ({ getFieldValue }) => {
          const bornIn = getFieldValue('born_in');
          if (!bornIn) return '--';
          // 出生日期与当前日期为同一年时，显示0
          if (moment().year() === moment(bornIn).year()) {
            return 0;
          }
          // 当前日期月份大于出生日期月份 || (当前日期月份等于出生日期月份 && 当前日期大于等于出生日期)
          if (moment().month() > moment(bornIn).month()
            || (moment().month() === moment(bornIn).month() && moment().date() >= moment(bornIn).date())) {
            return moment().year() - moment(bornIn).year();
          }
          return moment().year() - moment(bornIn).year() - 1;
        }
      }
    </Form.Item>,
    <Form.Item
      label="政治面貌"
      name="politics_status"
      {...formLayout}
    >
      <Select placeholder="请选择政治面貌" allowClear>
        <Option
          value={PoliticalStatusType.partyMember}
        >
          {PoliticalStatusType.description(PoliticalStatusType.partyMember)}
        </Option>
        <Option
          value={PoliticalStatusType.prepPartyMember}
        >
          {PoliticalStatusType.description(PoliticalStatusType.prepPartyMember)}
        </Option>
        <Option
          value={PoliticalStatusType.member}
        >
          {PoliticalStatusType.description(PoliticalStatusType.member)}
        </Option>
        <Option
          value={PoliticalStatusType.masses}
        >
          {PoliticalStatusType.description(PoliticalStatusType.masses)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="籍贯"
      name="birth_place"
      {...formLayout}
    >
      <Input placeholder="请输入籍贯" />
    </Form.Item>,
    <Form.Item
      label="工作邮箱"
      name="work_email"
      rules={[
        { type: 'email', message: '请输入正确邮箱地址' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入工作邮箱" />
    </Form.Item>,
    <Form.Item
      label="个人邮箱"
      name="email"
      rules={[
        { type: 'email', message: '请输入正确邮箱地址' },
      ]}
      {...formLayout}
    >
      <Input placeholder="请输入个人邮箱" />
    </Form.Item>,
    <Form.Item
      label="固定电话"
      name="telephone"
      {...formLayout}
    >
      <Input placeholder="请输入固定电话" />
    </Form.Item>,
    <Form.Item
      label="身高"
      name="height"
      {...formLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入身高"
        formatter={v => `${v}cm`}
        parser={v => v.replace('cm', '')}
      />
    </Form.Item>,
    <Form.Item
      label="体重"
      name="weight"
      {...formLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入体重"
        formatter={v => `${v}kg`}
        parser={v => v.replace('kg', '')}
      />
    </Form.Item>,
    <Form.Item
      label="爱好"
      name="interest"
      {...formLayout}
    >
      <Input placeholder="请输入爱好" />
    </Form.Item>,
    <Form.Item
      label="星座"
      name="constellation"
      {...formLayout}
    >
      <CommonSelectConstellation allowClear />
    </Form.Item>,
    <Form.Item
      label="特长"
      name="speciality"
      {...formLayout}
    >
      <Input placeholder="请输入特长" />
    </Form.Item>,
    <Form.Item
      label="学历"
      name="education"
      {...formLayout}
    >
      <CommonSelectEducations allowClear />
    </Form.Item>,
    {
      span: 24,
      render: (
        <Form.Item
          label="应聘人员登记表"
          name="candidates_photo_list"
          {...formOneLayout}
        >
          <CorePhotosAmazon
            domain="staff"
            multiple
            namespace="candidates_photo_list"
          />
        </Form.Item>
      ),
    },
    {
      span: 24,
      render: (
        <Form.Item
          label="附件"
          name="fileList"
          {...formOneLayout}
        >
          <CoreOaUpload
            domain="staff"
          />
        </Form.Item>
      ),
    },
    // { 隐藏 @彭悦
    //   span: 24,
    //   render: (
    //     <Form.Item
    //       label="备注"
    //       name="remark"
    //       labelCol={{ span: 3 }}
    //       wrapperCol={{ span: 10 }}
    //     >
    //       <TextArea
    //         placeholder="请输入备注"
    //         rows={4}
    //       />
    //     </Form.Item>
    //   ),
    // },
  ];

  // 获取initialValues
  const getInitialValues = () => {
    // 新建
    if (Object.keys(employeeDetail).length < 1) return { national: '汉族' };
    // 编辑
    return {
      name: employeeDetail.name || undefined, // 姓名
      phone: employeeDetail.phone || undefined, // 手机号
      gender_id: employeeDetail.gender_id || undefined, // 性别
      national: employeeDetail.national || '汉族', // 民族
      born_in: employeeDetail.born_in ? moment(String(employeeDetail.born_in)) : '', // 出生日期
      marital_status: employeeDetail.marital_status || undefined, // 婚姻状况
      work_address: {
        province: employeeDetail.work_province_code ?
          Number(employeeDetail.work_province_code)
          : undefined,
        city: employeeDetail.work_city_code ?
          Number(employeeDetail.work_city_code)
          : undefined,
      }, // 工作地
      native_place: employeeDetail.native_place || undefined, // 户口所在地
      often_address: employeeDetail.often_address || undefined, // 常居地
      emergency_contact: employeeDetail.emergency_contact || undefined, // 紧急联系人
      emergency_contact_phone: employeeDetail.emergency_contact_phone || undefined, // 紧急联系人电话
      work_email: employeeDetail.work_email || undefined, // 工作邮箱
      email: employeeDetail.email || undefined, // 个人邮箱
      telephone: employeeDetail.telephone || undefined, // 固定电话
      height: employeeDetail.height || undefined, // 身高
      weight: employeeDetail.weight || undefined, // 体重
      interest: employeeDetail.interest || undefined, // 爱好
      constellation: employeeDetail.constellation || undefined, // 星座
      speciality: employeeDetail.speciality || undefined, // 特长
      education: employeeDetail.education || undefined, // 学历
      politics_status: employeeDetail.politics_status || undefined, // 政治面貌
      birth_place: employeeDetail.birth_place || undefined, // 籍贯
      remark: dot.get(employeeDetail, 'remark', undefined), // 备注
      fileList: CoreOaUpload.getInitialValue(employeeDetail, 'enclosure_urls'), // 附件信息, // 附件
      candidates_photo_list: {
        keys: Array.isArray(employeeDetail.candidates_photo_list) ?
          employeeDetail.candidates_photo_list : [],
        urls: Array.isArray(employeeDetail.candidates_photo_url_list) ?
          employeeDetail.candidates_photo_url_list : [],
      }, // 应聘人员登记表
    };
  };

  return (
    <CoreContent title="个人信息">
      <Form
        form={form}
        initialValues={getInitialValues()}
        className="affairs-flow-basic"
      >
        <CoreForm items={items} />
      </Form>
    </CoreContent>
  );
};

export default PersonalForm;
