/**
 * 推荐来源信息（创建）
 */
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Input, message } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { asyncValidateIdCardNumber } from '../../../../../../application/utils';
import {
  AccountApplyWay,
  AccountRecruitmentChannel,
  RecommendedPlatform,
  SigningState,
  RecommendedPlatformStaff,
} from '../../../../../../application/define';
import {
  CommonSelectPlatforms, CommonSelectRecommendCompany,
  CommonSelectSuppliers,
} from '../../../../../../components/common';

const { Option } = Select;

class RecommendedSourceInfo extends Component {
  static propTypes = {
    idCardEmployees: PropTypes.object,       // 根据身份证号查询的人员列表
    fileType: PropTypes.string,              // 表单类型
    employeeDetail: PropTypes.object,
  }

  static defaultProps = {
    idCardEmployees: {},
    employeeDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'employeeManage/resetEmployeesIdCard',
      payload: {},
    });
  }

  // 更改推荐人身份证事件
  onChangeStaffIdentityCard = (e) => {
    const identityCardId = e.target.value;
    if (!identityCardId) {
      this.props.dispatch({
        type: 'employeeManage/resetEmployeesIdCard',
        payload: {},
      });
      this.props.form.setFieldsValue(
        {
          staffIdentityName: '',
          staffIdentityPhone: '',
        },
      );
      return;
    }
    this.props.dispatch({
      type: 'employeeManage/fetchEmployeesIdCard',
      payload: {
        identityCardId,
        onSuccessCallback: this.onFetchEmployeesCallback,
        fileType: this.props.fileType,
        state: [
          SigningState.pending,
          SigningState.normal,
          SigningState.replace,
          SigningState.pendingReview,
          SigningState.repair,
        ],
      },
    });
  }

  // 更改推荐渠道事件
  onChangeRecruitmentChannel = () => {
    this.props.dispatch({
      type: 'employeeManage/resetEmployeesIdCard',
      payload: {},
    });
  }

  // 更换平台
  onChangePlatforms = () => {
    const { form } = this.props;
    // 清空选项
    form.setFieldsValue({
      supplierIdsStaff: [],
    });
  }

  // 获取人员列表请求成功回调
  onFetchEmployeesCallback = (data) => {
    const { fileType } = this.props;
    if (!data || !Array.isArray(data)) return;
    if (data.length === 0) {
      if (fileType === 'staff') {
        message.error('请输入正确的员工身份证号');
      } else {
        message.error('请输入正确的劳动者身份证号');
      }
    }
    this.props.form.setFieldsValue(
      {
        staffIdentityName: data.length === 0 ? '' : data[0].name,
        staffIdentityPhone: data.length === 0 ? '' : data[0].phone,
      },
    );
  }

  // 渲染表单信息
  renderForm = () => {
    const { idCardEmployees, flag, employeeDetail = {}, form } = this.props;
    const {
      application_channel_id: initApplicationChannel,   // 应聘途径
      supplier_list: supplierIds = [], // 供应商列表
      recruitment_channel_id: initRecruitmentChannel,   // 推荐渠道
      referrer_platform: initReferrerPlatform,          // 推荐平台
      referrer_company_id: initReferrerCompany = '',    // 推荐公司
    } = employeeDetail;

    const referrerStaffInfo = employeeDetail.referrerStaffInfo || {};

    const {
      identity_card_id: initStaffIdentityCard = '',     // 推荐人身份证号
      name: initStaffIdentityName = '',               // 推荐人姓名
      phone: initStaffIdentityPhone = '',             // 推荐人手机号
    } = referrerStaffInfo;

    const employeesData = idCardEmployees.data || [];
    const { getFieldDecorator, getFieldValue } = form;

    // 推荐人姓名
    let initdefineStaffIdentityName;
    // 推荐人手机号
    let initdefineStaffIdentityPhone;
    if (employeesData[0]) {
      initdefineStaffIdentityName = employeesData[0].name;
      initdefineStaffIdentityPhone = employeesData[0].phone;
    } else if (initStaffIdentityName) {
      if (this.count === 1) {
        initdefineStaffIdentityName = '--';
        initdefineStaffIdentityPhone = '--';
      } else {
        initdefineStaffIdentityName = initStaffIdentityName;
        initdefineStaffIdentityPhone = initStaffIdentityPhone;
      }
    }
    // 推荐渠道
    const recruitmentChannel = getFieldValue('recruitmentChannel') || initRecruitmentChannel;


    // 由于返回来的有修改的历史数据，后端未清除，需要先清除它的默认值
    let initApplicationCompanyName = '';    // 公司名称
    let initApplicationPlatform = '';   // 应聘途径的渠道
    let initIdentityNo = '';            // 员工推荐人身份证
    let initName = '';                  // 员工推荐人姓名
    let initPhone = '';               // 员工推荐人电话
    let transferSignPlatform = '';      // 转签平台
    let transferSignSupplier = '';      // 转签供应商
    let transferSignPost = '';          //  转签岗位

    // 如果是员工
    if (flag) {
      switch (initApplicationChannel) {
        case AccountApplyWay.company:
          initApplicationCompanyName = employeeDetail.application_company_name;
          break;
        case AccountApplyWay.recommend:
          initIdentityNo = employeeDetail.referrer_identity_no;
          initName = employeeDetail.referrer_name;
          initPhone = employeeDetail.referrer_phone;
          break;
        case AccountApplyWay.apply:
          initApplicationPlatform = employeeDetail.application_platform;
          break;
        case AccountApplyWay.transfer:
          transferSignPlatform = employeeDetail.transfer_sign_platform;
          transferSignSupplier = employeeDetail.transfer_sign_supplier;
          transferSignPost = employeeDetail.transfer_sign_post;
          break;
        default:
          break;
      }
    }

    if (flag) {
      const formItems = [
        {
          label: '应聘途径',
          key: 'application_channel_id',
          form: getFieldDecorator('applicationChannelId', {
            rules: [{ required: true, message: '请选择内容' }],
            initialValue: initApplicationChannel ? `${initApplicationChannel}` : undefined,
          })(
            <Select placeholder="请选择应聘途径" onChange={this.onChangeRecruitmentChannel}>
              <Option value={`${AccountApplyWay.company}`}>{AccountApplyWay.description(AccountApplyWay.company)}</Option>
              <Option value={`${AccountApplyWay.recommend}`}>{AccountApplyWay.description(AccountApplyWay.recommend)}</Option>
              <Option value={`${AccountApplyWay.apply}`}>{AccountApplyWay.description(AccountApplyWay.apply)}</Option>
              <Option value={`${AccountApplyWay.transfer}`}>{AccountApplyWay.description(AccountApplyWay.transfer)}</Option>
              <Option value={`${AccountApplyWay.hr}`}>{AccountApplyWay.description(AccountApplyWay.hr)}</Option>
              <Option value={`${AccountApplyWay.other}`}>{AccountApplyWay.description(AccountApplyWay.other)}</Option>
            </Select>,
          ),
        },
      ];
      // 当人力资源服务公司 / 猎头公司时，显示公司名称输入框
      if (getFieldValue('applicationChannelId') === `${AccountApplyWay.company}`) {
        formItems.push({
          label: '公司名称',
          key: 'application_company_name',
          form: getFieldDecorator('applicationCompanyName',
            {
              rules: [{ required: true, message: '请输入公司名称' }],
              initialValue: initApplicationCompanyName || undefined,
            })(
              <Input
                placeholder="请输入公司名称"
              />,
          ),
        });
      }
      // 当推荐公司为内部推荐时，显示推荐人身份证、推荐人姓名、推荐人手机号表单
      if (getFieldValue('applicationChannelId') === `${AccountApplyWay.recommend}`) {
        formItems.push({
          label: '推荐人身份证',
          key: 'staffIdentityCard',
          form: getFieldDecorator('staffIdentityCard', {
            rules: [{ required: true, validator: asyncValidateIdCardNumber }],
            initialValue: initIdentityNo || undefined,
          })(
            <Input placeholder="请输入推荐人身份证" onBlur={this.onChangeStaffIdentityCard} />,
          ),
        }, {
          label: '推荐人姓名',
          key: 'staffIdentityName',
          form: getFieldDecorator('staffIdentityName', { rules: [{ required: true, message: '请输入推荐人姓名' }], initialValue: initName || undefined })(
            <Input placeholder="请输入推荐人姓名" />,
          ),
        }, {
          label: '推荐人手机号',
          key: 'staffIdentityPhone',
          form: getFieldDecorator('staffIdentityPhone', { rules: [{ required: true, pattern: /^1[0-9]{10}$/g, message: '请输入正确的手机号' }], initialValue: initPhone || undefined })(
            <Input placeholder="请输入推荐人手机号" />,
          ),
        });
      }
      // 当招聘渠道时，显示推招聘渠道表单
      if (getFieldValue('applicationChannelId') === `${AccountApplyWay.apply}`) {
        formItems.push({
          label: '渠道',
          key: 'application_platform',
          form: getFieldDecorator('applicationPlatform', {
            rules: [{ required: true, message: '请选择渠道' }],
            initialValue: initApplicationPlatform ? `${initApplicationPlatform}` : undefined,
          })(
            <Select placeholder="请选择渠道">
              <Option value={`${RecommendedPlatformStaff.zhiLian}`}>{RecommendedPlatformStaff.description(RecommendedPlatformStaff.zhiLian)}</Option>
              <Option value={`${RecommendedPlatformStaff.BOSS}`}>{RecommendedPlatformStaff.description(RecommendedPlatformStaff.BOSS)}</Option>
              <Option value={`${RecommendedPlatformStaff.liePin}`}>{RecommendedPlatformStaff.description(RecommendedPlatformStaff.liePin)}</Option>
              <Option value={`${RecommendedPlatformStaff.other}`}>{RecommendedPlatformStaff.description(RecommendedPlatformStaff.other)}</Option>
            </Select>,
          ),
        });
      }
      // 当转签时，显示平台、供应商、岗位表单
      if (getFieldValue('applicationChannelId') === `${AccountApplyWay.transfer}`) {
        formItems.push(
          {
            label: '平台',
            key: 'platformCodeStaff',
            form: getFieldDecorator('platformCodeStaff', {
              initialValue: transferSignPlatform || undefined,
              rules: [{
                required: true,
                message: '请选择平台',
              }],
            })(
              <CommonSelectPlatforms
                allowClear
                showSearch
                optionFilterProp="children"
                placeholder="请选择平台"
                onChange={this.onChangePlatforms}
              />,
            ),
          },
          {
            label: '供应商',
            key: 'supplierIdsStaff',
            form: getFieldDecorator('supplierIdsStaff', {
              initialValue: transferSignSupplier || undefined,
              rules: [{
                required: true,
                message: '请选择供应商',
              }],
            })(
              <CommonSelectSuppliers
                allowClear
                showSearch
                platforms={getFieldValue('platformCodeStaff')}
                optionFilterProp="children"
                placeholder="请选择供应商"
              />,
            ),
          },
          {
            label: '岗位',
            key: 'job',
            form: getFieldDecorator('job',
              {
                rules: [{ required: true, message: '请输入岗位' }],
                initialValue: transferSignPost || undefined,
              })(
                <Input
                  placeholder="请输入岗位"
                />,
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
    const formItems = [
      {
        label: '推荐渠道',
        key: 'recruitmentChannel',
        form: getFieldDecorator('recruitmentChannel', {
          rules: [{ required: true, message: '请选择内容' }],
        })(
          <Select placeholder="请选择推荐渠道" onChange={this.onChangeRecruitmentChannel}>
            <Option value={`${AccountRecruitmentChannel.third}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.third)}</Option>
            <Option value={`${AccountRecruitmentChannel.recommend}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.recommend)}</Option>
            <Option value={`${AccountRecruitmentChannel.thirdPlatform}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.thirdPlatform)}</Option>
            <Option value={`${AccountRecruitmentChannel.personal}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.personal)}</Option>
            <Option value={`${AccountRecruitmentChannel.transfer}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.transfer)}</Option>
            <Option value={`${AccountRecruitmentChannel.other}`}>{AccountRecruitmentChannel.description(AccountRecruitmentChannel.other)}</Option>
          </Select>,
        ),
      },
    ];
    // 当推荐公司为三方服务公司时，显示推荐公司表单
    if (`${recruitmentChannel}` === `${AccountRecruitmentChannel.third}`) {
      formItems.push({
        label: '推荐公司',
        key: 'referrerCompany',
        form: getFieldDecorator('referrerCompany',
          {
            rules: [{ required: true, message: '请选择内容' }],
            initialValue: initReferrerCompany || undefined,
          })(
            <CommonSelectRecommendCompany
              showSearch
              optionFilterProp="children"
              placeholder="请选择推荐公司"
              suppliers={supplierIds}
            />,
        ),
      });
    }
    // 当推荐公司为内部推荐时，显示推荐人身份证、推荐人姓名、推荐人手机号表单
    if (`${recruitmentChannel}` === `${AccountRecruitmentChannel.recommend}`) {
      formItems.push({
        label: '推荐人身份证',
        key: 'staffIdentityCard',
        form: getFieldDecorator('staffIdentityCard', {
          rules: [{ required: true, validator: asyncValidateIdCardNumber }],
          initialValue: initStaffIdentityCard,
        })(
          <Input placeholder="请输入推荐人身份证" onBlur={this.onChangeStaffIdentityCard} />,
        ),
      }, {
        label: '推荐人姓名',
        key: 'staffIdentityName',
        form: getFieldDecorator('staffIdentityName', {
          initialValue: initdefineStaffIdentityName,
        })(
          <span>{employeesData.length === 0 ? '--' : employeesData[0].name}</span>,
        ),
      }, {
        label: '推荐人手机号',
        key: 'staffIdentityPhone',
        form: getFieldDecorator('staffIdentityPhone', { initialValue: initdefineStaffIdentityPhone })(
          <span>{employeesData.length === 0 ? '--' : employeesData[0].phone}</span>,
        ),
      });
    }
    // 当推荐公司为三方推广平台时，显示推荐平台表单
    if (`${recruitmentChannel}` === `${AccountRecruitmentChannel.thirdPlatform}`) {
      formItems.push({
        label: '推荐平台',
        key: 'referrerPlatform',
        form: getFieldDecorator('referrerPlatform', {
          rules: [{ required: true, message: '请选择内容' }],
          initialValue: initReferrerPlatform ? `${initReferrerPlatform}` : undefined,
        })(
          <Select placeholder="请选择推荐平台">
            <Option value={`${RecommendedPlatform.wuba}`}>{RecommendedPlatform.description(RecommendedPlatform.wuba)}</Option>
          </Select>,
        ),
      });
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
      <CoreContent title="推荐来源">
        {/* 渲染表单信息 */}
        {this.renderForm()}
      </CoreContent>
    );
  }
}

function mapStateToProps({ employeeManage: { idCardEmployees } }) {
  return { idCardEmployees };
}

export default connect(mapStateToProps)(RecommendedSourceInfo);
