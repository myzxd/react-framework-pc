/**
 * 社保/公积金信息
 */
import moment from 'moment';
import React from 'react';
import dot from 'dot-prop';
import { Divider } from 'antd';

import { Unit } from '../../../../../application/define';
import { CoreContent, DeprecatedCoreForm } from '../../../../../components/core';

function SocialSecurityInfo(props) {
  // 单位转换
  const transformUnit = (data) => {
    return (data || data === 0) ? Unit.exchangePriceToYuan(data) : '--';
  };

  // 渲染表单信息
  const renderForm = () => {
    const employeeDetail = dot.get(props, 'employeeDetail', {});
    const {
      social_security_payment_plac: initSecurityPlace = {},   // 社保缴纳地
      old_age_insurance: initOldAgeInsurance = undefined,               // 养老保险
      medical_insurance: initMedicalInsurance = undefined,              // 医疗保险
      unemployment_insurance: initUnemploymentInsurance = undefined,      // 失业保险
      occupational_insurance: initOccupationalInsurance = undefined,      // 工伤保险
      birth_insurance: initFertilityInsurance = undefined,             // 生育保险
      provident_fund: initProvidentFund = undefined,                  // 公积金
      insurance_began_month: insuranceBeganMonth,          // 社保缴纳月份
      provident_fund_payment_plac: providentFundPaymentPlac,  // 公积金缴纳地
      provident_fund_began_month: providentFundBeganMonth,        // 公积金缴纳月份
      other_enterprise_fee: otherEnterpriseFee,          // 其它费用企业
      other_person_fee: otherPersonFee,          // 其它费用个人
      big_medical_insurance_enterprise: bigMedicalInsuranceEnterprise,          // 大额企业
      big_medical_insurance_person: bigMedicalInsurancePerson,          // 大额个人
      insurance_program_info: insuranceProgramInfo,         // 社保信息
      provident_fund_program_info: providentFundProgramInfo,         // 公积金信息
    } = employeeDetail;
    const formItems = [
      {
        label: '社保缴纳地',
        key: 'securityPlace',
        form: <span>
          {
            initSecurityPlace
            ? `${initSecurityPlace.province_name || '--'} - ${initSecurityPlace.city_name || '--'}`
            : '--'
          }
        </span>,
      },
      {
        label: '参保方案名称',
        key: 'societyPlanName',
        form: <span>{insuranceProgramInfo ? insuranceProgramInfo.name : '--'}</span>,
      },
      {
        label: '社保缴费开始月份',
        key: 'societyStartMonth',
        form: <span>{insuranceBeganMonth ? moment(`${insuranceBeganMonth}01`).format('YYYY-MM') : '--'}</span>,
      },
      {
        label: '养老保险基数',
        key: 'oldAgeInsurance',
        form: <span>{transformUnit(initOldAgeInsurance)}元</span>,
      },
      {
        label: '医疗保险基数',
        key: 'medicalInsurance',
        form: <span>{transformUnit(initMedicalInsurance)}元</span>,
      },
      {
        label: '失业保险基数',
        key: 'unemploymentInsurance',
        form: <span>{transformUnit(initUnemploymentInsurance)}元</span>,
      },
      {
        label: '工伤保险基数',
        key: 'occupationalInsurance',
        form: <span>{transformUnit(initOccupationalInsurance)}元</span>,
      },
      {
        label: '生育保险基数',
        key: 'fertilityInsurance',
        form: <span>{transformUnit(initFertilityInsurance)}元</span>,
      },
    ];
    const fundFormItems = [
      {
        label: '公积金缴纳地',
        key: 'providentFundPaymentPlac',
        form: <span>
          {
            providentFundPaymentPlac
            ? `${providentFundPaymentPlac.province_name || '--'} - ${providentFundPaymentPlac.city_name || '--'}`
            : '--'
          }
        </span>,
      },
      {
        label: '公积金方案名称',
        key: 'societyPlanName',
        form: <span>{providentFundProgramInfo ? providentFundProgramInfo.name : '--'}</span>,
      },
      {
        label: '公积金缴费开始月份',
        key: 'societyStartMonth',
        form: <span>{ providentFundBeganMonth ? moment(`${providentFundBeganMonth}01`).format('YYYY-MM') : '--'}</span>,
      },
      {
        label: '公积金基数',
        key: 'oldAgeInsurance',
        form: <span>{transformUnit(initProvidentFund)}元</span>,
      },
    ];
    const medicalFormItems = [
      {
        label: '大额医疗保险-企业(元/月)',
        key: 'accidentInsurance',
        form: <span>{transformUnit(bigMedicalInsuranceEnterprise)}元</span>,
      },
      {
        label: '大额医疗保险-个人(元/月)',
        key: 'providentFund',
        form: <span>{transformUnit(bigMedicalInsurancePerson)}元</span>,
      },
    ];
    const otherFormItems = [
      {
        label: '其它费用-企业',
        key: 'accidentInsurance',
        form: <span>{transformUnit(otherEnterpriseFee)}元</span>,
      },
      {
        label: '其它费用-个人',
        key: 'providentFund',
        form: <span>{transformUnit(otherPersonFee)}元</span>,
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <React.Fragment>
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        <Divider />
        <DeprecatedCoreForm items={fundFormItems} cols={3} layout={layout} />
        <Divider />
        <DeprecatedCoreForm items={medicalFormItems} cols={3} layout={layout} />
        <DeprecatedCoreForm items={otherFormItems} cols={3} layout={layout} />
      </React.Fragment>
    );
  };

  return (
    <CoreContent title="社保/公积金信息">
      {/* 渲染社保/公积金表单 */}
      {renderForm()}
    </CoreContent>
  );
}

export default SocialSecurityInfo;
