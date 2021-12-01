/**
 * 创建&编辑人员
 */
/* eslint-disable no-return-assign */
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, message, Modal } from 'antd';
import React, { Component } from 'react';

import {
  FileType,
  SignContractType,
  EmployeeUpdatePageSetp,
} from '../../../application/define';
import { system } from '../../../application';
import onResetStaff from './components/form/resetStaff.js';

import { CoreContent, CoreTabs } from '../../../components/core';
import ComponentDetailContractInfo from './components/detail/contractInfo';
import WorkInfo from './components/detail/workInfo';
import ComponentDetailIdentityInfo from './components/detail/identityInfo';
import FileInfo from './components/form/create/fileInfo';
import BusinessInfo from './components/form/create/businessInfo';
// import BaseInfo from './components/form/create/baseInfo';
import IdentityInfo from './components/form/create/identityInfo';
import ContractInfo from './components/form/create/contractInfo';
import RecommendedSourceInfo from './components/form/create/recommendedSourceInfo';
// import EducationInfo from './components/form/create/educationInfo';
// import WorkExperienceInfo from './components/form/create/workExperienceInfo';
// import BankInfo from './components/form/create/bankInfo';
// import CostCenter from './components/form/create/costCenter';
// import WageInfo from './components/form/create/wageInfo';

import UpdataFileInfo from './components/form/updata/updataFileInfo';
import UpdataBusinessInfo from './components/form/updata/updataBusinessInfo';
import UpdataContractInfo from './components/form/updata/updataContractInfo';
import UpdataIdentityInfo from './components/form/updata/updataIdentityInfo';
import UpdataRecommendedSourceInfo from './components/form/updata/updataRecommendedSourceInfo';
import UpdataBaseInfo from './components/form/updata/updataBaseInfo';
import UpdataEducationInfo from './components/form/updata/updataEducationInfo';
import UpdataWorkExperienceInfo from './components/form/updata/updataWorkExperienceInfo';
import UpdataBankInfo from './components/form/updata/updataBankInfo';
import UpdataWageInfo from './components/form/updata/updataWageInfo';
import ComponentDetailBankInfo from './components/detail/bankInfo';

import SocialSecurity from './components/form/components/socialSecurity';        // 社保/公积金信息（创建与编辑组件）
import UpdateAccountingCenter from './components/form/updata/updateAccountingCenter.jsx'; // 成本中心

const BusinessInfoForm = Form.create()(BusinessInfo);
const FileInfoForm = Form.create()(FileInfo);
const ContractInfoForm = Form.create()(ContractInfo);
const IdentityInfoForm = Form.create()(IdentityInfo);
const RecommendedSourceInfoForm = Form.create()(RecommendedSourceInfo);
// const BaseInfoForm = Form.create()(BaseInfo);
// const EducationInfoForm = Form.create()(EducationInfo);
// const WorkExperienceInfoForm = Form.create()(WorkExperienceInfo);
// const BankInfoForm = Form.create()(BankInfo);
// const CostCenterForm = Form.create()(CostCenter);
// const WageInfoForm = Form.create()(WageInfo);

const UpdataFileInfoForm = Form.create()(UpdataFileInfo);
const UpdataBusinessInfoForm = Form.create()(UpdataBusinessInfo);
const UpdataContractInfoForm = Form.create()(UpdataContractInfo);
const UpdataIdentityInfoForm = Form.create()(UpdataIdentityInfo);
const UpdataRecommendedSourceInfoForm = Form.create()(UpdataRecommendedSourceInfo);
const UpdataBaseInfoForm = Form.create()(UpdataBaseInfo);
const UpdataEducationInfoForm = Form.create()(UpdataEducationInfo);
const UpdataWorkExperienceInfoForm = Form.create()(UpdataWorkExperienceInfo);
const UpdataBankInfoForm = Form.create()(UpdataBankInfo);
const UpdataWageInfoForm = Form.create()(UpdataWageInfo);

const SocialSecurityForm = Form.create()(SocialSecurity);
const UpdateAccountingCenterForm = Form.create()(UpdateAccountingCenter); // 成本中心

const codeFlag = system.isShowCode(); // 判断是否是code

// 合并表单值
const flatten = (arr) => {
  if (!Array.isArray(arr)) return { errs: {}, fields: {} };
  return arr.reduce((acc, value) => {
    const newFields = Object.assign({}, acc.fields, value.fields);
    const newErrs = Object.assign({}, acc.errs, value.errs);
    return Object.assign(acc, { fields: newFields }, { errs: newErrs });
  });
};

class Index extends Component {
  static propTypes = {
    employeeDetail: PropTypes.object,  // 人员详情
    idCardEmployees: PropTypes.object, // 根据身份证号查询的人员列表
  }

  static defaultProps = {
    employeeDetail: {},
    idCardEmployees: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      platformCode: [], // 平台
      supplierIds: [],  // 供应商
      cityCode: '', // 城市
      signType: props.location.query.fileType === 'second'
        ? `${SignContractType.electronic}`
        : `${SignContractType.paper}`,  // 签约类型
      industryType: '', // 所属场景
      loading: false,   // 按钮loading状态
      setpActiveKey: EmployeeUpdatePageSetp.one,
      setpArchivesInfoId: undefined, // 档案信息
    };
    this.form = {
      fileInfo: {},              // 档案信息
      businessInfo: {},          // 业务范围
      contractInfo: {},          // 合同/协议信息
      identityInfo: {},          // 身份信息
      recommendedSourceInfo: {}, // 推荐来源
      baseInfo: {},              // 个人信息
      educationInfo: {},         // 学历信息
      workExperienceInfo: {},    // 工作经历
      bankInfo: {},              // 银行信息
      // costCenter: {},            // 成本信息
      wageInfo: {},              // 工资信息
      socialSecurity: {},         // 社保/公积金信息
      accountingCenter: {},         // 社保/公积金信息
    };
    this.isUpdata = Boolean(props.location.query.id);       // 是否是编辑模式
    this.locationFileType = props.location.query.fileType;  // query档案类型
    this.isSubmit = false;       // 防止重复提交
    this.isCreateDetail = true; // 创建页面调用详情
  }

  componentDidUpdate() {
    const { setpArchivesInfoId } = this.state;
    if (setpArchivesInfoId && this.isCreateDetail === true) {
      // 获取人员详情数据
      this.props.dispatch({ type: 'employeeManage/fetchEmployeeDetail', payload: { employeeId: setpArchivesInfoId, fileType: this.locationFileType } });
      this.isCreateDetail = false;
    }
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'employeeManage/reduceEmployeeDetail', payload: {} });
  }

  // 更改平台
  onChangePlatform = (platformCode) => {
    this.setState({
      platformCode: [platformCode],
    });
    // 重置合同甲方
    this.form.contractInfo.props.form.resetFields('contractBelong');
    this.props.dispatch({ type: 'applicationCommon/resetContractBelong' });
  }

  // 更改供应商
  onChangeSupplier = (supplierIds) => {
    this.setState({
      supplierIds: [supplierIds],
      cityCode: undefined,
    });
    // 重置合同甲方、推荐公司表单数据
    this.form.contractInfo.props.form.resetFields('contractBelong');
    this.form.recommendedSourceInfo.props.form.resetFields('referrerCompany');
  }

  // 更改所属场景
  onChangeIndustryType = (industryType) => {
    this.setState({
      industryType,
      supplierIds: [],
      cityCode: undefined,
    });
    // 重置平台数据
    this.form.businessInfo.props.form.resetFields('platformCode');
    // 重置供应商数据
    this.form.businessInfo.props.form.resetFields('supplierIds');
    // 重置城市数据
    this.form.businessInfo.props.form.resetFields('cityCodes');
    // 重置商圈数据
    this.form.businessInfo.props.form.resetFields('districts');
    // 重置合同甲方
    this.form.contractInfo.props.form.resetFields('contractBelong');
  }

  // 更改城市
  onChangeCity = (cityCode) => {
    this.setState({
      cityCode,
    });
    // 重置合同甲方
    if (!cityCode) {
      this.form.contractInfo.props.form.resetFields('contractBelong');
    }
  }

  // 更改签约类型
  onChangeSignType = (signType) => {
    this.setState({
      signType,
    });
    // 重置合同甲方
    // this.form.contractInfo.props.form.resetFields('contractBelong');
  }

  // 清空表单
  onReset = () => {
    const { setpActiveKey } = this.state;
    // 判断是否档案信息
    if (setpActiveKey === EmployeeUpdatePageSetp.one) {
      this.resetAllFields([
        'fileInfo',
        'businessInfo',
        'contractInfo',
        'identityInfo',
        'recommendedSourceInfo',
        'baseInfo',
        'educationInfo',
        'workExperienceInfo',
        'bankInfo',
        // 'costCenter',
        'wageInfo',
        'socialSecurity',
      ]);
      return;
    }
    // 判断是否team成本中心
    if (setpActiveKey === EmployeeUpdatePageSetp.two) {
      this.resetAllFields([
        'accountingCenter',
      ]);
    }
  }


  // 编辑提交
  onClickUpdate = (e) => {
    e.preventDefault();
    const { employeeDetail } = this.props;
    const { setpActiveKey } = this.state;
    // 判断是否档案信息
    if (setpActiveKey === EmployeeUpdatePageSetp.one) {
      // 档案信息编辑
      this.getAllArchivesFieldsValue();
      return;
    }
    // 判断是否team成本中心
    if (setpActiveKey === EmployeeUpdatePageSetp.two) {
      // 劳动者档案 && is_can_update_cost为false不允许提交team成本中心
      if (FileType.staff !== employeeDetail.profile_type && employeeDetail.is_can_update_cost === false) {
        return message.error('本月未存在‘二线身份’，team成本信息不可编辑添加');
      }
      // team成本中心编辑
      this.getAllAccountingCenter();
    }
  }

  // 组织架构编辑员工成功调用
  onSuccessOrganCallback = () => {
    // 部门id
    const departmentId = dot.get(this.props, 'location.query.departmentId', undefined);
    // 部门name
    const departmentName = dot.get(this.props, 'location.query.departmentName', undefined);
    if (window.parent && window.parent.opener && window.parent.opener.location) {
      window.parent.opener.location.href = `/#/Organization/Manage/Department?id=${departmentId}&name=${departmentName}`;
      window.parent.opener.location.reload();
      window.close();
    }
  }

  // 创建页面的回调
  onSuccessCreatePageCallback = (result = {}) => {
    const { record = {} } = result;
    this.setState({
      setpActiveKey: EmployeeUpdatePageSetp.two, // 跳转下一步
      setpArchivesInfoId: record._id,
    });
    this.onLoading();
  }

  // 改变tab
  onChangeActiveKey = (key) => {
    // 判断是否是编辑
    if (this.isUpdata) {
      this.setState({
        setpActiveKey: key,
      });
    }
  }

  // 员工二次入职，重置表单
  onResetStaff = (res = {}) => {
    const { form = {} } = this;
    onResetStaff(res, form);
  }

  // 跳转上一步
  onPreStepBtn = () => {
    this.setState({
      setpActiveKey: EmployeeUpdatePageSetp.one, // 跳转上一步
    });
    this.isCreateDetail = true;
  }

  // 创建编辑人员请求成功回调
  onLoading = () => {
    this.isSubmit = false;
    this.setState({
      loading: false,
    });
  }

  // 接口
  onInterface = (values = {}) => {
    const { setpArchivesInfoId } = this.state;
    let fileTypeOne = '';
    // 根据query中的fileType字段判断档案类型的默认值
    if (this.locationFileType === 'second') {
      fileTypeOne = `${FileType.second}`;
    } else {
      fileTypeOne = `${FileType.staff}`;
    }
    // 判断是否是编辑页面，判断档案id是否存在
    if (this.isUpdata || setpArchivesInfoId) {
      const payload = {
        flag: Number(fileTypeOne) === 30,
        onLoading: this.onLoading,
        onSuccessOrganCallback: codeFlag ? undefined : this.onSuccessOrganCallback, // 组织架构编辑员工回调
        onSuccessCreatePageCallback: this.onSuccessCreatePageCallback, // 创建页面回调
        staffId: this.props.location.query.id,
        departmentId: this.props.location.query.departmentId, // 部门id
        ...values,
        isCreate: !this.isUpdata,
      };
      // 判断档案id是否存在
      if (setpArchivesInfoId) {
        payload.staffId = setpArchivesInfoId;
      }
      this.setState({
        loading: true,
      });
      // 防止重复提交
      if (this.isSubmit) return;
      this.isSubmit = true;
      payload.planNameSocietyList = this.props.staffSocietyPlanList.data;
      payload.planNameFundList = this.props.staffFundPlanList.data;
      // 编辑人员
      this.props.dispatch({
        type: 'employeeManage/updateEmployee',
        payload,
      });
    } else {
      const payload = {
        flag: Number(fileTypeOne) === 30,
        onLoading: this.onLoading,
        onSuccessOrganCallback: codeFlag ? undefined : this.onSuccessOrganCallback, // 组织架构编辑员工回调
        onSuccessCreatePageCallback: this.onSuccessCreatePageCallback, // 创建页面回调
        departmentId: this.props.location.query.departmentId, // 部门id
        ...values,
        codeFlag,
      };
      this.setState({
        loading: true,
      });
      // 防止重复提交
      if (this.isSubmit) return;
      this.isSubmit = true;
      payload.planNameSocietyList = this.props.staffSocietyPlanList.data;
      payload.planNameFundList = this.props.staffFundPlanList.data;
      // 创建人员
      this.props.dispatch({
        type: 'employeeManage/createEmployee',
        payload,
      });
    }
  }

  // 二次入职查询
  getModalConfirm = (res = {}) => {
    Object.keys(res).length > 0 ?
      Modal.confirm({
        content: (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>系统中该身份证号存在对应的离职人员档案信息，请核对以下信息并确认是否要复用该份档案中的信息</div>
            <div style={{ marginLeft: '30px', marginBottom: '10px' }}>{`手机号：${res.phone}`}</div>
            <div style={{ marginLeft: '30px' }}>{`姓名：${res.name}`}</div>
          </div>
        ),
        maskClosable: true,
        onOk: () => this.onResetStaff(res),
      })
      : Modal.error({
        maskClosable: true,
        content: '系统中未找到该身份证号对应的离职员工档案',
      });
  }

  // 获取表单值方法promise
  getSubFormValue = (formName) => {
    return new Promise((resolve) => {
      this.form[formName].props.form.validateFields((errs, fields) => {
        resolve({ errs, fields });
      });
    });
  }

  // 提交档案信息表单数据
  getAllArchivesFieldsValue = () => {
    const {
      profile_type: fileType,
    } = this.props.employeeDetail;
    const { setpActiveKey } = this.state;
    let fileTypeOne = '';
    // 根据query中的fileType字段判断档案类型的默认值
    if (this.locationFileType === 'second') {
      fileTypeOne = `${FileType.second}`;
    } else {
      fileTypeOne = `${FileType.staff}`;
    }
    const { employeeDetail, idCardEmployees } = this.props;
    const params = [
      this.getSubFormValue('fileInfo'),
      this.getSubFormValue('businessInfo'),
      this.getSubFormValue('recommendedSourceInfo'),
      this.getSubFormValue('baseInfo'),
      this.getSubFormValue('educationInfo'),
      this.getSubFormValue('workExperienceInfo'),
      this.getSubFormValue('wageInfo'),
    ];
    // 判断员工才能编辑的表单字段
    if (FileType.staff === Number(employeeDetail.profile_type) || fileTypeOne === '30') {
      // params.push(this.getSubFormValue('costCenter'));
      // 合同/协议信息
      params.push(this.getSubFormValue('contractInfo'));
      // 身份信息
      params.push(this.getSubFormValue('identityInfo'));
      params.push(this.getSubFormValue('socialSecurity'));
      params.push(this.getSubFormValue('bankInfo'));
    }
    Promise.all(params).then((result) => {
      const values = flatten(result);
      // 档案类型为员工档案时校验部门、岗位自定义表单
      if ((`${values.fields.fileType}` === `${FileType.staff}` || `${fileType}` === `${FileType.staff}`)
        && values.fields.staffDepartments.some(item => !item.department || !item.post)) {
        return message.error('所属部门和岗位不能为空');
      }
      // 档案类型为员工档案时内部推荐人根据身份证号查询不到时不允许提交并提示
      if ((`${values.fields.fileType}` === `${FileType.staff}` || `${fileType}` === `${FileType.staff}`)
        && idCardEmployees
        && idCardEmployees.data
        && idCardEmployees.data.length === 0) {
        return message.error('请输入正确的员工身份证号');
      }
      if (Object.keys(values.errs || {}).length !== 0) {
        this.form.wageInfo.props.form.validateFieldsAndScroll();
        this.form.recommendedSourceInfo.props.form.validateFieldsAndScroll();
        this.form.bankInfo.props.form.validateFieldsAndScroll();
        this.form.identityInfo.props.form.validateFieldsAndScroll();
        this.form.contractInfo.props.form.validateFieldsAndScroll();
        this.form.baseInfo.props.form.validateFieldsAndScroll();

        return;
      }
      const payload = {
        setpActiveKey,
        ...values.fields,
      };
      // 调用接口
      this.onInterface(payload);
    });
  }

  // 提交成本中心表单数据
  getAllAccountingCenter = () => {
    // e.preventDefault();
    const { setpActiveKey } = this.state;
    const params = [
      this.getSubFormValue('accountingCenter'),
    ];
    Promise.all(params).then((result) => {
      const values = flatten(result);
      if (Object.keys(values.errs || {}).length !== 0) return;
      const payload = {
        setpActiveKey,
        ...values.fields, // 成本中心表单值
      };
      // 调用接口
      this.onInterface(payload);
    });
  }

  // 重置表单数据
  resetAllFields = (arr) => {
    arr.forEach((item) => {
      if (!this.form[item].props) return;
      this.form[item].props.form.resetFields();
    });
    if (this.socialSecurityRef && this.socialSecurityRef.onRestPlan) {
      this.socialSecurityRef.onRestPlan();
    }
  }

  // 档案信息
  renderArchivesInfo = () => {
    const {
      platformCode,
      supplierIds,
      cityCode,
      signType,
      industryType,
    } = this.state;
    const { employeeDetail, dispatch } = this.props;
    let fileType = '';
    // 根据query中的fileType字段判断档案类型的默认值
    if (this.locationFileType === 'second') {
      fileType = `${FileType.second}`;
    } else {
      fileType = `${FileType.staff}`;
    }
    return (
      <div>
        {/* 档案信息 */}
        {
          this.isUpdata
            ? <UpdataFileInfoForm
              wrappedComponentRef={form => this.form.fileInfo = form}
              employeeDetail={employeeDetail}
            />
            : <FileInfoForm
              wrappedComponentRef={form => this.form.fileInfo = form}
              onChangeIndustryType={this.onChangeIndustryType}
              employeeDetail={employeeDetail}
              fileType={fileType}
            />
        }
        {/* 个人信息 */}
        <UpdataBaseInfoForm
          isUpdata={this.isUpdata}
          wrappedComponentRef={form => this.form.baseInfo = form}
          employeeDetail={employeeDetail}
          // 判断姓名是否可编辑
          disabledName={(`${employeeDetail.profile_type}` === `${FileType.first}` || `${employeeDetail.profile_type}` === `${FileType.second}`)}
          // 判断性别是否可编辑
          disabledGender={(`${employeeDetail.profile_type}` === `${FileType.first}` || `${employeeDetail.profile_type}` === `${FileType.second}`)}
          // 判断手机号是否可编辑
          disabledPhone={`${employeeDetail.profile_type || fileType}` === `${FileType.first}`}
          signType={employeeDetail.sign_type || signType}
          fileType={fileType}
        />
        {/* {
          this.isUpdata
            ? <UpdataBaseInfoForm
              wrappedComponentRef={form => this.form.baseInfo = form}
              employeeDetail={employeeDetail}
            />
            : <BaseInfoForm
              wrappedComponentRef={form => this.form.baseInfo = form}
              signType={signType}
            />
        } */}
        {/* 业务范围 */}
        {
          this.isUpdata
            ? <UpdataBusinessInfoForm
              wrappedComponentRef={form => this.form.businessInfo = form}
              employeeDetail={employeeDetail}
            />
            : <BusinessInfoForm
              wrappedComponentRef={form => this.form.businessInfo = form}
              onChangePlatform={this.onChangePlatform}
              onChangeSupplier={this.onChangeSupplier}
              onChangeCity={this.onChangeCity}
              fileType={fileType}
              industryType={industryType}
            />
        }
        {/* 工作信息 */}
        {
          FileType.staff !== Number(employeeDetail.profile_type) ? this.isUpdata
            ? <WorkInfo employeeDetail={employeeDetail} />
            : null : null
        }
        {/* 合同/协议信息 */}
        {
          FileType.staff !== Number(employeeDetail.profile_type) ? this.isUpdata
            ? <ComponentDetailContractInfo
              employeeDetail={employeeDetail}
              society={this.form.socialSecurity}
            />
            : <ContractInfoForm
              wrappedComponentRef={form => this.form.contractInfo = form}
              onChangeSignType={this.onChangeSignType}
              fileType={fileType}
              platformCode={platformCode}
              supplierIds={supplierIds}
              cityCode={cityCode}
              industryType={industryType}
              employeeDetail={employeeDetail}
              society={this.form.socialSecurity}
            /> :
            <UpdataContractInfoForm
              wrappedComponentRef={form => this.form.contractInfo = form}
              employeeDetail={employeeDetail}
              society={this.form.socialSecurity}
            />
        }
        {/* 身份信息 */}
        {
          this.isUpdata
            // 劳动者档案
            ? (FileType.second === Number(employeeDetail.profile_type) || FileType.first === Number(employeeDetail.profile_type)) ?
              <ComponentDetailIdentityInfo
                employeeDetail={employeeDetail}
              /> :
              <UpdataIdentityInfoForm
                wrappedComponentRef={form => this.form.identityInfo = form}
                employeeDetail={employeeDetail}
              />
            : <IdentityInfoForm
              wrappedComponentRef={form => this.form.identityInfo = form}
              fileType={fileType}
              signType={signType}
              industryType={industryType}
              dispatch={dispatch}
              // 判断人员编号是否可编辑
              disabledUpdate={this.state.setpArchivesInfoId}
              employeeDetail={employeeDetail}
              onResetStaff={this.getModalConfirm}
            />
        }
        {/* 银行卡信息 */}
        {
          // 通过判断员工是否存在来显示与隐藏银行信息
          this.isUpdata
            ? (
              FileType.staff === Number(employeeDetail.profile_type) || fileType === '30'
                ?
                  <UpdataBankInfoForm
                    wrappedComponentRef={form => this.form.bankInfo = form}
                    employeeDetail={employeeDetail}
                    fileType={fileType}
                  />
                :
                  <ComponentDetailBankInfo employeeDetail={employeeDetail} fileType={fileType} />
            ) : (
              FileType.staff === Number(employeeDetail.profile_type) || fileType === '30' ?
                <UpdataBankInfoForm
                  wrappedComponentRef={form => this.form.bankInfo = form}
                  employeeDetail={employeeDetail}
                  fileType={fileType}
                /> : null
            )
        }
        {/* 推荐来源 */}
        {
          this.isUpdata
            ? <UpdataRecommendedSourceInfoForm
              wrappedComponentRef={form => this.form.recommendedSourceInfo = form}
              employeeDetail={employeeDetail}
              fileType={this.locationFileType}
              flag={FileType.staff === Number(employeeDetail.profile_type) || fileType === '30'}
            />
            : <RecommendedSourceInfoForm
              wrappedComponentRef={form => this.form.recommendedSourceInfo = form}
              employeeDetail={employeeDetail}
              supplierIds={supplierIds}
              fileType={this.locationFileType}
              flag={FileType.staff === Number(employeeDetail.profile_type) || fileType === '30'}
            />
        }
        {/* 学历信息 */}
        <UpdataEducationInfoForm
          wrappedComponentRef={form => this.form.educationInfo = form}
          employeeDetail={employeeDetail}
          isUpdata={this.isUpdata}
        />
        {/* {
          this.isUpdata
            ? <UpdataEducationInfoForm
              wrappedComponentRef={form => this.form.educationInfo = form}
              employeeDetail={employeeDetail}
            />
            : <EducationInfoForm
              wrappedComponentRef={form => this.form.educationInfo = form}
            />
        } */}
        {/* 工作经历 */}
        <UpdataWorkExperienceInfoForm
          wrappedComponentRef={form => this.form.workExperienceInfo = form}
          employeeDetail={employeeDetail}
          fileType={fileType}
        />
        {/* {
          this.isUpdata
            ? <UpdataWorkExperienceInfoForm
              wrappedComponentRef={form => this.form.workExperienceInfo = form}
              employeeDetail={employeeDetail}
            />
            : <WorkExperienceInfoForm
              wrappedComponentRef={form => this.form.workExperienceInfo = form}
              fileType={fileType}
            />
        } */}
        {/* 成本信息 */}
        {/* {
          FileType.staff === Number(employeeDetail.profile_type) || fileType === '30'
            ? <CostCenterForm
              employeeDetail={employeeDetail}
              wrappedComponentRef={form => this.form.costCenter = form}
            /> : null
        } */}
        {/* 工资信息 */}
        <UpdataWageInfoForm
          wrappedComponentRef={form => this.form.wageInfo = form}
          employeeDetail={employeeDetail}
          fileType={employeeDetail.profile_type || fileType}
        />
        {/* {
          this.isUpdata
            ? <UpdataWageInfoForm
              wrappedComponentRef={form => this.form.wageInfo = form}
              employeeDetail={employeeDetail}
              fileType={fileType}
            />
            : <WageInfoForm
              wrappedComponentRef={form => this.form.wageInfo = form}
              fileType={fileType}
            />
        } */}
        {/* 社保/公积金信息 */}
        {
          FileType.staff === Number(employeeDetail.profile_type) || fileType === '30'
            ? <SocialSecurityForm
              employeeDetail={employeeDetail}
              contractForm={this.form.contractInfo}
              childRef={(d) => { this.socialSecurityRef = d; }}
              wrappedComponentRef={form => this.form.socialSecurity = form}
            /> : null
        }
      </div>
    );
  }

  // 成本中心
  renderAccountingCenter = () => {
    const { employeeDetail } = this.props;
    return (
      <React.Fragment>
        <UpdateAccountingCenterForm
          wrappedComponentRef={form => this.form.accountingCenter = form}
          employeeDetail={employeeDetail}
          // 劳动者档案，is_can_update_cost为false不可编辑team信息
          disabled={FileType.staff !== employeeDetail.profile_type && employeeDetail.is_can_update_cost === false}
        />
      </React.Fragment>
    );
  }

  // 渲染tab
  renderTabs = () => {
    const { employeeDetail } = this.props;
    let fileType = '';
    // 根据query中的fileType字段判断档案类型的默认值
    if (this.locationFileType === 'second') {
      fileType = `${FileType.second}`;
    } else {
      fileType = `${FileType.staff}`;
    }
    const items = [
      {
        title: EmployeeUpdatePageSetp.description(EmployeeUpdatePageSetp.one),
        content: this.renderArchivesInfo(),
        key: EmployeeUpdatePageSetp.one,
      },
    ];
    // 判断code审批插件是否存在并且员工档案显示tab，劳动者档案根据接口判断是否可显示tab
    if (codeFlag === true && (FileType.staff === Number(fileType) || employeeDetail.is_tab)) {
      items.push(
        {
          title: EmployeeUpdatePageSetp.description(EmployeeUpdatePageSetp.two),
          content: this.renderAccountingCenter(),
          key: EmployeeUpdatePageSetp.two,
        },
      );
    }
    return (
      <CoreTabs
        items={items}
        activeKey={this.state.setpActiveKey}
        onChange={this.onChangeActiveKey}
      />
    );
  }

  // 创建按钮
  renderCreateOperation = () => {
    const { loading, setpActiveKey } = this.state;
    const {
      profile_type: fileType,
    } = this.props.employeeDetail;
    let resetBtn;
    let nextStepBtn;
    let preStepBtn;
    let submitBtn;
    let completeBtn;
    // 判断是否显示重置按钮
    if (setpActiveKey === EmployeeUpdatePageSetp.one) {
      resetBtn = (
        <Button style={{ margin: '0 20px' }} onClick={this.onReset}>重置</Button>
      );
    }
    // 判断是否显示下一步按钮并且一线不显示
    if (codeFlag && FileType.first !== fileType && setpActiveKey === EmployeeUpdatePageSetp.one) {
      nextStepBtn = (
        <Button type="primary" onClick={this.getAllArchivesFieldsValue}>下一步</Button>
      );
    }
    // 判断是否显示下一步按钮并且一线不显示
    if (codeFlag && FileType.first !== fileType && setpActiveKey === EmployeeUpdatePageSetp.two) {
      preStepBtn = (
        <Button style={{ margin: '0 20px' }} type="primary" onClick={this.onPreStepBtn}>返回上一步</Button>
      );
    }
    // 判断不是code系统显示提交按钮
    if (codeFlag !== true && setpActiveKey === EmployeeUpdatePageSetp.one) {
      submitBtn = (
        <Button type="primary" loading={loading} onClick={this.getAllArchivesFieldsValue}>提交</Button>
      );
    }
    // 判断是code系统并且是一线的情况下显示提交按钮
    if (codeFlag === true && FileType.first === fileType && setpActiveKey === EmployeeUpdatePageSetp.one) {
      submitBtn = (
        <Button type="primary" loading={loading} onClick={this.getAllArchivesFieldsValue}>提交</Button>
      );
    }
    // 判断是否显示完成按钮并且一线不显示
    if (codeFlag && FileType.first !== fileType && setpActiveKey === EmployeeUpdatePageSetp.two) {
      completeBtn = (
        <Button type="primary" onClick={this.getAllAccountingCenter}>完成</Button>
      );
    }
    return (
      <CoreContent style={{ textAlign: 'center' }}>
        {/* 重置 */}
        {resetBtn}
        {/* 下一步 */}
        {nextStepBtn}
        {/* 上一步 */}
        {preStepBtn}
        {/* 提交 */}
        {submitBtn}
        {/* 完成 */}
        {completeBtn}
      </CoreContent>
    );
  }

  // 编辑按钮
  renderUpdateOperation = () => {
    const { loading } = this.state;
    return (
      <CoreContent style={{ textAlign: 'center' }}>
        <Button style={{ margin: '0 20px' }} onClick={this.onReset}>重置</Button>
        <Button type="primary" loading={loading} onClick={this.onClickUpdate}>提交</Button>
      </CoreContent>
    );
  }

  // 渲染按钮
  renderOperation = () => {
    // 判断是否是编辑
    if (this.isUpdata) {
      return this.renderUpdateOperation();
    }
    return this.renderCreateOperation();
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, overflowY: 'scroll' }}>
          {/* 渲染tab */}
          {this.renderTabs()}
        </div>
        {/* 按钮 */}
        {this.renderOperation()}
      </div>
    );
  }
}

function mapStateToProps(
  { employeeManage: { employeeDetail, idCardEmployees },
  society: { staffSocietyPlanList, staffFundPlanList } }) {
  return { employeeDetail, idCardEmployees, staffSocietyPlanList, staffFundPlanList };
}

export default connect(mapStateToProps)(Index);
