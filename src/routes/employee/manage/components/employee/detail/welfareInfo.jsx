/**
 * 员工档案 - 员工详情 - 福利信息tab
 */
import moment from 'moment';
import React from 'react';
import {
  Form,
  Button,
} from 'antd';
import {
  CoreForm,
  CoreContent,
} from '../../../../../../components/core';
import {
  Unit,
} from '../../../../../../application/define';

import style from './style.less';

// form layout
const formLayout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
const formProviceLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
const formMoneyLayout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

const WelfareForm = ({
  employeeDetail = {}, // 员工详情
  onBack,
}) => {
  const {
    split_base: splitBase, // 拆分基数
    social_security_payment_plac: socialPlace, // 社保缴纳地
    insurance_program_info: insuranceProgramInfo, // 社保参保名称
    insurance_began_month: insuranceBeganMonth, // 社保缴纳月份
    provident_fund_payment_plac: providentFundPaymentPlac,  // 公积金缴纳地
    provident_fund_program_info: providentFundProgramInfo,         // 公积金信息

    provident_fund_began_month: providentFundBeganMonth,        // 公积金缴纳月份
  } = employeeDetail;

// 单位转换// 单位转换
  const transformUnit = (data) => {
    return (data || data === 0) ? `${Unit.exchangePriceToYuan(data)}元` : '--';
  };

  // 工资
  const wageItems = [
    <Form.Item
      label="工资是否拆分"
      {...formLayout}
    >
      {employeeDetail.is_salary_split ? '是' : '否'}
    </Form.Item>,
    <Form.Item
      label="拆分基数"
      {...formLayout}
    >
      {splitBase ? Number(splitBase) / 100 : '--'}
    </Form.Item>,
  ];

  // 社保form item
  const securityItems = [
    {

      key: 'social_security_payment_plac',
      span: 16,
      render: (
        <Form.Item
          label="社保缴纳地"
          {...formProviceLayout}
        >
          {
            socialPlace && socialPlace.province_name && socialPlace.city_name ?
              `${socialPlace.province_name} - ${socialPlace.city_name}`
              : '--'
          }
        </Form.Item>
      ),
    },
    <Form.Item key="social_security_empty" />,
    <Form.Item
      label="参保方案名称"
      {...formLayout}
    >
      {
        insuranceProgramInfo && insuranceProgramInfo.name ?
          `${insuranceProgramInfo.name}`
          : '--'
      }
    </Form.Item>,
    <Form.Item
      label="社保缴费开始月份"
      {...formLayout}
    >
      {
        insuranceBeganMonth ?
          moment(`${insuranceBeganMonth}01`).format('YYYY-MM')
          : '--'
      }
    </Form.Item>,
    <Form.Item
      label="养老保险基数"
      {...formLayout}
    >
      {transformUnit(employeeDetail.old_age_insurance)}
    </Form.Item>,
    <Form.Item
      label="医疗保险基数"
      {...formLayout}
    >
      {transformUnit(employeeDetail.medical_insurance)}
    </Form.Item>,
    <Form.Item
      label="失业保险基数"
      {...formLayout}
    >
      {transformUnit(employeeDetail.unemployment_insurance)}
    </Form.Item>,
    <Form.Item
      label="工伤保险基数"
      {...formLayout}
    >
      {transformUnit(employeeDetail.occupational_insurance)}
    </Form.Item>,
    <Form.Item
      label="生育保险基数"
      {...formLayout}
    >
      {transformUnit(employeeDetail.birth_insurance)}
    </Form.Item>,
  ];

  // 公积金form item
  const providentItems = [
    {
      key: 'provident_fund_payment_plac',
      span: 16,
      render: (
        <Form.Item
          label="公积金缴纳地"
          {...formProviceLayout}
        >
          {
            providentFundPaymentPlac && providentFundPaymentPlac.province_name && providentFundPaymentPlac.city_name ?
              `${providentFundPaymentPlac.province_name} - ${providentFundPaymentPlac.city_name}`
              : '--'
          }
        </Form.Item>
      ),
    },
    <Form.Item key="provident_fund_empty" />,
    <Form.Item
      label="参保方案名称"
      {...formLayout}
    >
      {
        providentFundProgramInfo && providentFundProgramInfo.name ?
          `${providentFundProgramInfo.name}`
          : '--'
      }
    </Form.Item>,
    <Form.Item
      label="公积金缴费开始月份"
      {...formLayout}
    >
      {
        providentFundBeganMonth ?
          moment(`${providentFundBeganMonth}01`).format('YYYY-MM')
          : '--'
      }
    </Form.Item>,
    <Form.Item
      label="公积金基数"
      {...formLayout}
    >
      {transformUnit(employeeDetail.provident_fund)}
    </Form.Item>,
  ];

  // 其他form item
  const otherItems = [
    <Form.Item
      label="大额医疗保险-企业(元/月)"
      {...formMoneyLayout}
    >
      {transformUnit(employeeDetail.big_medical_insurance_enterprise)}
    </Form.Item>,
    <Form.Item
      label="大额医疗保险-个人(元/月)"
      {...formMoneyLayout}
    >
      {transformUnit(employeeDetail.big_medical_insurance_person)}
    </Form.Item>,
    <Form.Item
      label="其它费用-企业"
      {...formMoneyLayout}
    >
      {transformUnit(employeeDetail.other_enterprise_fee)}
    </Form.Item>,
    <Form.Item
      label="其它费用-个人"
      {...formMoneyLayout}
    >
      {transformUnit(employeeDetail.other_person_fee)}
    </Form.Item>,
  ];

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <Form
            className="affairs-flow-basic"
          >
            <CoreContent title="工资信息">
              <CoreForm items={wageItems} />
            </CoreContent>
            <CoreContent title="社保信息">
              <CoreForm items={securityItems} />
            </CoreContent>
            <CoreContent title="公积金信息">
              <CoreForm items={providentItems} />
            </CoreContent>
            <CoreContent title="其他信息">
              <CoreForm items={otherItems} cols={2} />
            </CoreContent>
          </Form>
        </div>
        <div
          className={style['contract-tab-scroll-button']}
        >
          <Button
            onClick={onBack}
          >返回</Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default WelfareForm;
