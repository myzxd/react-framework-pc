/**
 * 社保/公积金信息
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import React, { Component } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, InputNumber, DatePicker, Divider, Tooltip, Row, Col } from 'antd';

import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { CommonSelectRegionalCascade } from '../../../../../../components/common';

import SelectPlan from './selectPlan.jsx'; // 社保方案名称
import SelectFundPlan from './selectFundPlan.jsx'; // 公积金方案名称

import Style from './style.less';
import { Unit } from '../../../../../../application/define';

class SocialSecurity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      societyPlan: {},
      fundPlan: {},
      societyCity: {},
      fundCity: {},
      flag: true,
    };
  }
  componentDidMount() {
    if (this.props.childRef) {
      this.props.childRef(this);
    }
  }

  componentWillUpdate(nextProps, state) {
    if (this.props.employeeDetail._id && state.flag) {
      const {
        social_security_payment_plac: initSecurityPlace,   // 社保缴纳地
        provident_fund_payment_plac: providentFundPaymentPlac,  // 公积金缴纳地
        insurance_program_info: insuranceProgramInfo,  // 社保方案信息
        provident_fund_program_info: providentFundProgramInfo,  // 公积金方案信息
      } = nextProps.employeeDetail;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        societyCity: {
          province: initSecurityPlace ? initSecurityPlace.province : undefined,
          city: initSecurityPlace ? initSecurityPlace.city : undefined,
        },
        fundCity: {
          province: providentFundPaymentPlac ? providentFundPaymentPlac.province : undefined,
          city: providentFundPaymentPlac ? providentFundPaymentPlac.city : undefined,
        },
        societyPlan: insuranceProgramInfo || {},
        fundPlan: providentFundProgramInfo || {},
        flag: false,
      });
    }
  }
  // 重置的操作
  onRestPlan = () => {
    const {
      social_security_payment_plac: initSecurityPlace,   // 社保缴纳地
      provident_fund_payment_plac: providentFundPaymentPlac,  // 公积金缴纳地
      insurance_program_info: insuranceProgramInfo,  // 社保方案信息
      provident_fund_program_info: providentFundProgramInfo,  // 公积金方案信息
    } = this.props.employeeDetail;
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      societyCity: {
        province: initSecurityPlace ? initSecurityPlace.province : undefined,
        city: initSecurityPlace ? initSecurityPlace.city : undefined,
      },
      fundCity: {
        province: providentFundPaymentPlac ? providentFundPaymentPlac.province : undefined,
        city: providentFundPaymentPlac ? providentFundPaymentPlac.city : undefined,
      },
      societyPlan: insuranceProgramInfo || {},
      fundPlan: providentFundProgramInfo || {},
    });
  }

  onChangeSocietyPlan = async (name) => {
    if (!name) {
      await this.setState({
        societyPlan: {},
      });
      return this.props.form.validateFields([
        'oldAgeInsurance',
        'medicalInsurance',
        'unemploymentInsurance',
        'occupationalInsurance',
        'fertilityInsurance',
      ]);
    }
    const { data = [] } = this.props.staffSocietyPlanList;
    const { transMoney } = this;
    let flag = true;
    data.map((item) => {
      if (item.name === name) {
        this.props.form.setFieldsValue({
          oldAgeInsurance: transMoney(dot.get(item, 'old_age_insurance.lower_limit')),
          medicalInsurance: transMoney(dot.get(item, 'medical_insurance.lower_limit')),
          unemploymentInsurance: transMoney(dot.get(item, 'unemployment_insurance.lower_limit')),
          occupationalInsurance: transMoney(dot.get(item, 'occupational_insurance.lower_limit')),
          fertilityInsurance: transMoney(dot.get(item, 'birth_insurance.lower_limit')),
        });
        flag = false;
        this.setState({
          societyPlan: item,
        });
      }
    });
    if (flag) {
      this.setState({
        societyPlan: {},
      });
    }
  }
  onChangeFundPlan = async (name) => {
    if (!name) {
      await this.setState({
        fundPlan: {},
      });
      return this.props.form.validateFields(['fundInsurance']);
    }
    const { data = [] } = this.props.staffFundPlanList;
    const { transMoney } = this;
    let flag = true;
    data.map((item) => {
      if (item.name === name) {
        this.props.form.setFieldsValue({
          fundInsurance: transMoney(dot.get(item, 'provident_fund.lower_limit')),
        });
        flag = false;
        this.setState({
          fundPlan: item,
        });
      }
    });
    if (flag) {
      this.setState({
        fundPlan: {},
      });
    }
  }
  // 社保地改变
  onChangeSocietyPlace = async (val) => {
    if (val.city) {
      this.setState({
        societyCity: val,
        societyPlan: {},
      });
      await this.props.form.setFieldsValue({
        planName: undefined,
      });
      this.props.form.validateFields([
        'oldAgeInsurance',
        'medicalInsurance',
        'unemploymentInsurance',
        'occupationalInsurance',
        'fertilityInsurance',
      ]);
    }
  }
  // 公积金缴纳地改变
  onChangeFundPlace = async (val) => {
    if (val.city) {
      this.setState({
        fundCity: val,
        fundPlan: {},
      });
      await this.props.form.setFieldsValue({
        fundPlanName: undefined,
      });
      this.props.form.validateFields([
        'fundInsurance',
      ]);
    }
  }
  // 转换金钱
  transMoney = (num) => {
    if (num === 0) {
      return 0;
    }
    if (!num) {
      return undefined;
    }
    return num / 100;
  }
  // 转换个人与公司比例
  transBl = (num) => {
    if (num === 0) {
      return '0%';
    }
    if (!num) {
      return '--%';
    }
    return `${num}%`;
  }
  // 单位转换
  transformUnit = (data) => {
    return (data || data === 0) ? Unit.exchangePriceToYuan(data) : undefined;
  }

  // 校验缴纳社保公积金日期
  validatorDate = (current) => {
    // 获取合同生效日期
    if (dot.get(this, 'props.contractForm.props.form')) {
      const dateRes = dot.get(this, 'props.contractForm.props.form').getFieldValue('signedDate');
      if (dateRes) {
        const ym = moment(dateRes).format('YYYY-MM');
        return current && current < moment(ym);
      }
    }
    return false;
  }

  commonRules = (data, val) => {
    const { upper_limit: upper, lower_limit: lower } = data;
    // 如果都没有最大值最小值就校验通过
    if (!upper && !lower) {
      return Promise.resolve();
    }
    // 输入的值小于最小值则警告
    if ((lower || lower === 0) && (val * 100 < lower)) {
      if (upper || upper === 0) {
        return Promise.reject(`区间范围为${lower / 100} - ${upper / 100}`);
      } else {
        return Promise.reject(`区间范围为大于${lower / 100}`);
      }
    }
    // 输入的值大于最大值则警告
    if ((upper || upper === 0) && (val * 100 > upper)) {
      if (lower || lower === 0) {
        return Promise.reject(`区间范围为${lower / 100} - ${upper / 100}`);
      } else {
        return Promise.reject(`区间范围为小于${upper / 100}`);
      }
    }
    return Promise.resolve();
  }
  // 养老
  validatorOld = (_, val) => {
    const { old_age_insurance: data = {} } = this.state.societyPlan;
    return this.commonRules(data, val);
  }
  // 医疗
  validatorMed = (_, val) => {
    const { medical_insurance: data = {} } = this.state.societyPlan;
    return this.commonRules(data, val);
  }
  // 失业
  validatorUn = (_, val) => {
    const { unemployment_insurance: data = {} } = this.state.societyPlan;
    return this.commonRules(data, val);
  }
  // 工伤
  validatorOcc = (_, val) => {
    const { occupational_insurance: data = {} } = this.state.societyPlan;
    return this.commonRules(data, val);
  }
  // 生育
  validatorBirth = (_, val) => {
    const { birth_insurance: data = {} } = this.state.societyPlan;
    return this.commonRules(data, val);
  }
  // 公积金
  validatorFund = (_, val) => {
    const { provident_fund: data = {} } = this.state.fundPlan;
    return this.commonRules(data, val);
  }


  // 渲染表单信息
  renderForm = () => {
    const { transformUnit, transBl } = this;
    const { societyCity, fundCity, societyPlan, fundPlan } = this.state;
    const { getFieldDecorator } = this.props.form;
    const employeeDetail = dot.get(this.props, 'employeeDetail', {});
    const {
      social_security_payment_plac: initSecurityPlace,   // 社保缴纳地
      old_age_insurance: initOldAgeInsurance,               // 养老保险
      medical_insurance: initMedicalInsurance,              // 医疗保险
      unemployment_insurance: initUnemploymentInsurance,      // 失业保险
      occupational_insurance: initOccupationalInsurance,      // 工伤保险
      birth_insurance: initFertilityInsurance,             // 生育保险
      // accident_insurance: initAccidentInsurance,          // 意外保险
      provident_fund: initProvidentFund,                  // 公积金
      insurance_began_month: insuranceBeganMonth,          // 社保缴纳月份
      provident_fund_payment_plac: providentFundPaymentPlac,  // 公积金缴纳地
      provident_fund_began_month: providentFundBeganMonth,        // 公积金缴纳月份
      other_enterprise_fee: otherEnterpriseFee,          // 其它费用企业
      other_person_fee: otherPersonFee,          // 其它费用个人
      big_medical_insurance_enterprise: bigMedicalInsuranceEnterprise,          // 大额企业
      big_medical_insurance_person: bigMedicalInsurancePerson,          // 大额个人
      // insurance_program_name: insuranceProgramName,         // 社保方案名称
      // provident_fund_program_name: providentFundProgramName,           // 公积金方案名称
      insurance_program_info: insuranceProgramInfo = {},         // 社保信息
      provident_fund_program_info: providentFundProgramInfo = {},         // 公积金信息
    } = employeeDetail;
    const sDiv = (<div className={Style['app-comp-employee-manage-tip-wrap']}>
      <Row>
        <Col span="8">险种</Col>
        <Col span="8">公司</Col>
        <Col span="8">个人</Col>
      </Row>
      <Row>
        <Col span="8">养老</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'old_age_insurance.company_percent'))}</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'old_age_insurance.person_percent'))}</Col>
      </Row>
      <Row>
        <Col span="8">医疗</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'medical_insurance.company_percent'))}</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'medical_insurance.person_percent'))}</Col>
      </Row>
      <Row>
        <Col span="8">失业</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'unemployment_insurance.company_percent'))}</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'unemployment_insurance.person_percent'))}</Col>
      </Row>
      <Row>
        <Col span="8">生育</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'occupational_insurance.company_percent'))}</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'occupational_insurance.person_percent'))}</Col>
      </Row>
      <Row>
        <Col span="8">工伤</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'birth_insurance.company_percent'))}</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'birth_insurance.person_percent'))}</Col>
      </Row>
      <Row>
        <Col span="8">公积金</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'provident_fund.company_percent'))}</Col>
        <Col span="8">{transBl(dot.get(societyPlan, 'provident_fund.person_percent'))}</Col>
      </Row>
    </div>);
    const sTips = (<span><span>参保方案名称</span><Tooltip placement="top" title={sDiv}>
      <QuestionCircleOutlined />
    </Tooltip></span>);
    const fDiv = (<div className={Style['app-comp-employee-manage-tip-wrap']}>
      <Row>
        <Col span="8">险种</Col>
        <Col span="8">公司</Col>
        <Col span="8">个人</Col>
      </Row>
      <Row>
        <Col span="8">公积金</Col>
        <Col span="8">{transBl(dot.get(fundPlan, 'provident_fund.company_percent'))}</Col>
        <Col span="8">{transBl(dot.get(fundPlan, 'provident_fund.person_percent'))}</Col>
      </Row>
    </div>);
    const fTips = (<span><span>公积金方案名称</span><Tooltip placement="top" title={fDiv}>
      <QuestionCircleOutlined />
    </Tooltip></span>);
    const formItems = [
      {
        label: '社保缴纳地',
        key: 'securityPlace',
        form: getFieldDecorator('securityPlace', {
          initialValue: initSecurityPlace || {},
        })(
          <CommonSelectRegionalCascade
            isHideArea
            onChange={this.onChangeSocietyPlace}
          />,
        ),
      },
      {
        label: societyPlan.name ? sTips : '参保方案名称',
        key: 'planName',
        form: getFieldDecorator('planName', {
          initialValue: insuranceProgramInfo ? insuranceProgramInfo.name : undefined,
        })(
          <SelectPlan onChange={this.onChangeSocietyPlan} city={societyCity} />,
        ),
      },
      {
        label: '社保缴费开始月份',
        key: 'societyStartMonth',
        form: getFieldDecorator('societyStartMonth', {
          initialValue: insuranceBeganMonth ? moment(`${insuranceBeganMonth}`, 'YYYY-MM') : undefined,
        })(
          <DatePicker picker="month" disabledDate={this.validatorDate} />,
        ),
      },
      {
        label: '养老保险基数',
        key: 'oldAgeInsurance',
        form: getFieldDecorator('oldAgeInsurance', {
          initialValue: transformUnit(initOldAgeInsurance),
          rules: [{ validator: this.validatorOld }],
        })(
          <InputNumber
            min={0}
            placeholder="请输入养老缴纳基数"
            className={Style['app-comp-employee-manage-form-social-input']}
          />,
        ),
      },
      {
        label: '医疗保险基数',
        key: 'medicalInsurance',
        form: getFieldDecorator('medicalInsurance', {
          initialValue: transformUnit(initMedicalInsurance),
          rules: [{ validator: this.validatorMed }],
        })(
          <InputNumber
            min={0}
            placeholder="请输入医疗缴纳基数"
            className={Style['app-comp-employee-manage-form-social-input']}
          />,
        ),
      },
      {
        label: '失业保险基数',
        key: 'unemploymentInsurance',
        form: getFieldDecorator('unemploymentInsurance', {
          initialValue: transformUnit(initUnemploymentInsurance),
          rules: [{ validator: this.validatorUn }],
        })(
          <InputNumber
            min={0}
            placeholder="请输入失业缴纳基数"
            className={Style['app-comp-employee-manage-form-social-input']}
          />,
        ),
      },
      {
        label: '工伤保险基数',
        key: 'occupationalInsurance',
        form: getFieldDecorator('occupationalInsurance', {
          initialValue: transformUnit(initOccupationalInsurance),
          rules: [{ validator: this.validatorOcc }],
        })(
          <InputNumber
            min={0}
            placeholder="请输入工伤缴纳基数"
            className={Style['app-comp-employee-manage-form-social-input']}
          />,
        ),
      },
      {
        label: '生育保险基数',
        key: 'fertilityInsurance',
        form: getFieldDecorator('fertilityInsurance', {
          initialValue: transformUnit(initFertilityInsurance),
          rules: [{ validator: this.validatorBirth }],
        })(
          <InputNumber
            min={0}
            placeholder="请输入生育缴纳基数"
            className={Style['app-comp-employee-manage-form-social-input']}
          />,
        ),
      },
    ];
    const fundFormItems = [
      {
        label: '公积金缴纳地',
        key: 'fundPlace',
        form: getFieldDecorator('fundPlace', {
          initialValue: providentFundPaymentPlac || {},
        })(
          <CommonSelectRegionalCascade
            isHideArea
            onChange={this.onChangeFundPlace}
          />,
        ),
      },
      {
        label: fundPlan.name ? fTips : '公积金方案名称',
        key: 'fundPlanName',
        form: getFieldDecorator('fundPlanName', {
          initialValue: providentFundProgramInfo ? providentFundProgramInfo.name : undefined,
        })(
          <SelectFundPlan onChange={this.onChangeFundPlan} city={fundCity} />,
        ),
      },
      {
        label: '公积金缴费开始月份',
        key: 'fundStartMonth',
        form: getFieldDecorator('fundStartMonth', {
          initialValue: providentFundBeganMonth ? moment(`${providentFundBeganMonth}`, 'YYYY-MM') : null,
        })(
          <DatePicker picker="month" disabledDate={this.validatorDate} />,
        ),
      },
      {
        label: '公积金基数',
        key: 'fundInsurance',
        form: getFieldDecorator('fundInsurance', {
          initialValue: transformUnit(initProvidentFund),
          rules: [{ validator: this.validatorFund }],
        })(
          <InputNumber
            min={0}
            placeholder="请输入公积金缴纳基数"
            className={Style['app-comp-employee-manage-form-social-input']}
          />,
        ),
      },
    ];
    const medicalFormItems = [
      {
        label: '大额医疗保险-企业(元/月)',
        key: 'bigMedicalCompany',
        form: getFieldDecorator('bigMedicalCompany', {
          initialValue: transformUnit(bigMedicalInsuranceEnterprise),
        })(
          <InputNumber
            min={0}
            placeholder="请输入大额医疗保险(企业)"
            className={Style['app-comp-employee-manage-form-social-input']}
          />,
        ),
      },
      {
        label: '大额医疗保险-个人(元/月)',
        key: 'bigMedicalPerson',
        form: getFieldDecorator('bigMedicalPerson', {
          initialValue: transformUnit(bigMedicalInsurancePerson),
        })(
          <InputNumber
            min={0}
            placeholder="请输入大额医疗保险(个人)"
            className={Style['app-comp-employee-manage-form-social-input']}
          />,
        ),
      },
    ];
    const otherFormItems = [
      {
        label: '其它费用-企业',
        key: 'otherCostCompany',
        form: getFieldDecorator('otherCostCompany', {
          initialValue: transformUnit(otherEnterpriseFee),
        })(
          <InputNumber
            min={0}
            placeholder="请输入其它费用(企业)"
            className={Style['app-comp-employee-manage-form-social-input']}
          />,
        ),
      },
      {
        label: '其它费用-个人',
        key: 'otherCostPerson',
        form: getFieldDecorator('otherCostPerson', {
          initialValue: transformUnit(otherPersonFee),
        })(
          <InputNumber
            min={0}
            placeholder="请输入其它费用(个人)"
            className={Style['app-comp-employee-manage-form-social-input']}
          />,
        ),
      },
    ];
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <Form layout="horizontal">
        <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
        <Divider />
        <DeprecatedCoreForm items={fundFormItems} cols={3} layout={layout} />
        <Divider />
        <DeprecatedCoreForm items={medicalFormItems} cols={3} layout={layout} />
        <DeprecatedCoreForm items={otherFormItems} cols={3} layout={layout} />
      </Form>
    );
  }

  render() {
    return (
      <CoreContent title="社保/公积金信息">
        {/* 渲染社保/公积金表单 */}
        {this.renderForm()}
      </CoreContent>
    );
  }
}
function mapStateToProps(
  { society: { staffSocietyPlanList, staffFundPlanList } }) {
  return { staffSocietyPlanList, staffFundPlanList };
}
export default connect(mapStateToProps)(SocialSecurity);
