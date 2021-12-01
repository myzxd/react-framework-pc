/**
 * 员工档案 - 创建 - 福利信息tab
 */
import dot from 'dot-prop';
import moment from 'moment';
import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from 'react';
import {
  Button,
  Form,
  Radio,
  InputNumber,
  DatePicker,
  Tooltip,
  Row,
  Col,
  message,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  CoreForm,
  CoreContent,
} from '../../../../../../components/core';
import {
  CommonSelectRegionalCascade,
} from '../../../../../../components/common';
import {
  Unit,
  EmployeePageSetp,
} from '../../../../../../application/define';
import {
  system,
} from '../../../../../../application';

import SelectPlan from '../../other/selectPlan'; // 社保方案名称
import SelectFundPlan from '../../other/selectFundPlan'; // 公积金方案名称

import style from './style.less';

// form layout
const formLayout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
const formProviceLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
const formMoneyLayout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

const WelfareForm = forwardRef(({
  setTabKey, // 设置操作切换的tab key
  onChangeTabKeys, // 设置可操作tab
  staffSocietyPlanList = {}, // 社保参保城市信息
  staffFundPlanList = {}, // 公积金参保城市信息
  formBasic = {}, // 基本信息form
  employeeId, // 员工id
  dispatch,
  employeeDetail = {}, // 员工详情
  onSave, // 编辑保存
  onBack, // 返回
  onSubmit, // 创建提交操作
}, ref) => {
  const [form] = Form.useForm();
  // 是否拆分工资
  const [isSplitWage, setIsSplitWage] = useState(Number(employeeDetail.is_salary_split));

  // 社保参保数据
  const [societyPlan, setSocietyPlan] = useState({});

  // 公积金参保数据
  const [fundPlan, setFundPlan] = useState({});

  // 暴露ref
  useImperativeHandle(ref, () => form);

  useEffect(() => {
    Object.keys(employeeDetail).length > 0 && form && (
      form.resetFields()
    );
  }, [form, employeeDetail]);

  // 校验缴纳地
  const checkDeparture = (_, value, callback) => {
    const {
      province, // 省
      city, // 市
      // area, // 区
    } = value;

    if (city && !province) {
      return callback('请选择省份');
    }

    if (province && !city) {
      return callback('请选择城市');
    }

    callback();
  };

  // 校验表单参数
  const checkFomValue = (values = {}) => {
    if ((
        Object.keys(values.social_security_payment_plac).length < 1
      || !values.social_security_payment_plac.province
      || !values.social_security_payment_plac.city
    )
      && (
        values.old_age_insurance
        || values.medical_insurance
        || values.unemployment_insurance
        || values.occupational_insurance
        || values.birth_insurance
      )
    ) {
      message.error('请选择社保缴纳地');
      return false;
    }

    if ((
        Object.keys(values.provident_fund_payment_plac).length < 1
        || !values.provident_fund_payment_plac.province
        || !values.provident_fund_payment_plac.city
      ) && (
        values.provident_fund
      )
    ) {
      message.error('请选择公积金缴纳地');
      return false;
    }

    return true;
  };

  // 上一步
  const onUpStep = () => {
    setTabKey(EmployeePageSetp.career);
  };

  // 重置表单
  const resetForm = () => {
    setIsSplitWage(Number(employeeDetail.is_salary_split));
    form.resetFields();
  };

  // 下一步
  const onDownStep = () => {
    form.validateFields().then((values) => {
      const isCheck = checkFomValue(values);
      if (!isCheck) return;

      onChangeTabKeys(EmployeePageSetp.costCenter);
      setTabKey(EmployeePageSetp.costCenter);
      // 表单校验，跳转第一个报错字段
    }).catch((error) => {
      form.scrollToField(
        error.errorFields[0].name,
        {
          behavior: actions => actions.forEach(({ el, top }) => {
            // eslint-disable-next-line no-param-reassign
            el.scrollTop = top - 5;
          }),
        },
      );
    });
  };

  // 提交（创建）
  const onSubmitVal = () => {
    form.validateFields().then((values) => {
      const isCheck = checkFomValue(values);
      if (!isCheck) return;

      onSubmit && onSubmit();
      // 表单校验，跳转第一个报错字段
    }).catch((error) => {
      form.scrollToField(
        error.errorFields[0].name,
        {
          behavior: actions => actions.forEach(({ el, top }) => {
            // eslint-disable-next-line no-param-reassign
            el.scrollTop = top - 5;
          }),
        },
      );
    });
  };

  // 提交
  const onUpdate = () => {
    form.validateFields().then((values = {}) => {
      const isCheck = checkFomValue(values);
      if (!isCheck) return;
      onSave && onSave(values);
      // 表单校验，跳转第一个报错字段
    }).catch((error) => {
      form.scrollToField(
        error.errorFields[0].name,
        {
          behavior: actions => actions.forEach(({ el, top }) => {
            // eslint-disable-next-line no-param-reassign
            el.scrollTop = top - 5;
          }),
        },
      );
    });
  };

  // 是否拆分onChange
  const onChangeIsSalarySplit = (val) => {
    setIsSplitWage(Boolean(val.target.value));
    form && form.setFieldsValue({
      split_base: undefined,
    });
  };

  // 校验社保基数
  const onValidateFields = () => {
    form.validateFields([
      'old_age_insurance',
      'medical_insurance',
      'unemployment_insurance',
      'occupational_insurance',
      'birth_insurance',
    ]);
  };

  // 社保缴纳地onChange
  const onChangeSecurityPlace = async () => {
    await form.setFieldsValue({
      insurance_program_id: undefined,
    });

    onValidateFields();
  };

  // 公积金缴纳地onChange
  const onChangeFundPlace = async () => {
    await form.setFieldsValue({
      provident_fund_program_id: undefined,
    });

    form.validateFields([
      'provident_fund',
    ]);
  };

  // 社保参保方案名称onchange
  const onChangeSocietyPlan = async (val) => {
    if (!val) {
      await setSocietyPlan({});

      return onValidateFields();
    }

    // 当前城市所有参保数据
    const { data } = staffSocietyPlanList;
    // 当前选择的参保数据
    const curSociety = data.find(i => i._id === val) || {};

    if (Object.keys(curSociety).length > 0) {
      // 设置form
      form.setFieldsValue({
        old_age_insurance: transMoney(dot.get(curSociety, 'old_age_insurance.lower_limit')),
        medical_insurance: transMoney(dot.get(curSociety, 'medical_insurance.lower_limit')),
        unemployment_insurance: transMoney(dot.get(curSociety, 'unemployment_insurance.lower_limit')),
        occupational_insurance: transMoney(dot.get(curSociety, 'occupational_insurance.lower_limit')),
        birth_insurance: transMoney(dot.get(curSociety, 'birth_insurance.lower_limit')),
      });
      setSocietyPlan(curSociety);
    }
  };

  // 公积金参保方案onCHnage
  const onChangeFundPlan = async (val) => {
    if (!val) {
      await setFundPlan({});
      return form.validateFields(['provident_fund']);
    }
    const { data = [] } = staffFundPlanList;
    const curFundPlan = data.find(i => i._id === val);

    if (Object.keys(curFundPlan).length > 0) {
      form.setFieldsValue({
        provident_fund: transMoney(dot.get(curFundPlan, 'provident_fund.lower_limit')),
      });
      setFundPlan(curFundPlan);
    }
  };

  // 转换金钱
  const transMoney = (num) => {
    if (num === 0) {
      return 0;
    }
    if (!num) {
      return undefined;
    }
    return num / 100;
  };

  // 转换个人与公司比例
  const transBl = (num) => {
    if (num === 0) {
      return '0%';
    }
    if (!num) {
      return '--%';
    }
    return `${num}%`;
  };

  // 校验缴纳社保公积金日期
  const validatorDate = (current) => {
    // 获取合同生效日期
    if (formBasic.current) {
      const dateRes = formBasic.current.getFieldValue('signedDate');
      if (dateRes) {
        const ym = moment(dateRes).format('YYYY-MM');
        return current && current < moment(ym);
      }
    }
    return false;
  };

  // 表单校验
  const commonRules = (data, val) => {
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
  };

  // 单位转换
  const transformUnit = (data) => {
    return (data || data === 0) ? Unit.exchangePriceToYuan(data) : undefined;
  };

  // 养老
  const validatorOld = (_, val) => {
    const { old_age_insurance: data = {} } = societyPlan;
    return commonRules(data, val);
  };

  // 医疗
  const validatorMed = (_, val) => {
    const { medical_insurance: data = {} } = societyPlan;
    return commonRules(data, val);
  };

  // 失业
  const validatorUn = (_, val) => {
    const { unemployment_insurance: data = {} } = societyPlan;
    return commonRules(data, val);
  };

  // 工伤
  const validatorOcc = (_, val) => {
    const { occupational_insurance: data = {} } = societyPlan;
    return commonRules(data, val);
  };

  // 生育
  const validatorBirth = (_, val) => {
    const { birth_insurance: data = {} } = societyPlan;
    return commonRules(data, val);
  };

  // 公积金
  const validatorFund = (_, val) => {
    const { provident_fund: data = {} } = fundPlan;
    return commonRules(data, val);
  };

  // 社保参保方案名称提示
  const renderSocialPrompt = () => {
    const title = (
      <div
        style={{ minWidth: '200px' }}
      >
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
      </div>
    );
    return (
      <React.Fragment>
        <span
          style={{ marginRight: 4 }}
        >参保方案名称</span>
        <Tooltip
          placement="top"
          title={title}
        >
          <QuestionCircleOutlined />
        </Tooltip>
      </React.Fragment>
    );
  };

  // 公积金参保方案名称提示
  const renderProvidentPrompt = () => {
    const title = (
      <div
        style={{ minWidth: '200px' }}
      >
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
      </div>
    );
    return (
      <React.Fragment>
        <span
          style={{ marginRight: 4 }}
        >参保方案名称</span>
        <Tooltip
          placement="top"
          title={title}
        >
          <QuestionCircleOutlined />
        </Tooltip>
      </React.Fragment>
    );
  };

  // 工资
  const wageItems = [
    <Form.Item
      label="工资是否拆分"
      name="is_salary_split"
      rules={[
        { required: true, message: '请选择是否拆分' },
      ]}
      {...formLayout}
    >
      <Radio.Group onChange={onChangeIsSalarySplit}>
        <Radio value>是</Radio>
        <Radio value={false}>否</Radio>
      </Radio.Group>
    </Form.Item>,
    <Form.Item
      label="拆分基数"
      name="split_base"
      rules={[
        { required: isSplitWage, message: '请填写拆分基数' },
      ]}
      {...formLayout}
    >
      <InputNumber
        disabled={!isSplitWage}
        min={1}
        style={{ width: 200 }}
      />
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
          name="social_security_payment_plac"
          rules={[
            { validator: checkDeparture },
          ]}
          {...formProviceLayout}
        >
          <CommonSelectRegionalCascade
            isHideArea
            onChange={onChangeSecurityPlace}
            style={{
              province: { width: 150, marginRight: 20 },
              city: { width: 180 },
            }}
          />
        </Form.Item>
      ),
    },
    <Form.Item key="social_security_empty" />,
    <Form.Item
      label={societyPlan.name ? renderSocialPrompt() : '参保方案名称'}
      // shouldUpdate
      shouldUpdate={(prevVal, curVal) => prevVal.social_security_payment_plac !== curVal.social_security_payment_plac}
      {...formLayout}
    >
      {
        ({ getFieldValue }) => {
          // 社保缴纳地
          const securityPlace = getFieldValue('social_security_payment_plac') || {};
          return (
            <Form.Item
              name="insurance_program_id"
            >
              <SelectPlan
                city={securityPlace}
                onChange={onChangeSocietyPlan}
              />
            </Form.Item>
          );
        }
      }
    </Form.Item>,
    <Form.Item
      label="社保缴费开始月份"
      name="insurance_began_month"
      {...formLayout}
    >
      <DatePicker
        picker="month"
        disabledDate={validatorDate}
      />
    </Form.Item>,
    <Form.Item
      label="养老保险基数"
      name="old_age_insurance"
      rules={[
        { validator: validatorOld },
      ]}
      {...formLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入养老缴纳基数"
        style={{ width: '100%' }}
      />
    </Form.Item>,
    <Form.Item
      label="医疗保险基数"
      name="medical_insurance"
      rules={[
        { validator: validatorMed },
      ]}
      {...formLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入医疗缴纳基数"
        style={{ width: '100%' }}
      />
    </Form.Item>,
    <Form.Item
      label="失业保险基数"
      name="unemployment_insurance"
      rules={[
        { validator: validatorUn },
      ]}
      {...formLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入失业缴纳基数"
        style={{ width: '100%' }}
      />
    </Form.Item>,
    <Form.Item
      label="工伤保险基数"
      name="occupational_insurance"
      rules={[
        { validator: validatorOcc },
      ]}
      {...formLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入工伤缴纳基数"
        style={{ width: '100%' }}
      />
    </Form.Item>,
    <Form.Item
      label="生育保险基数"
      name="birth_insurance"
      rules={[
        { validator: validatorBirth },
      ]}
      {...formLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入生育缴纳基数"
        style={{ width: '100%' }}
      />
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
          name="provident_fund_payment_plac"
          rules={[
            { validator: checkDeparture },
          ]}
          {...formProviceLayout}
        >
          <CommonSelectRegionalCascade
            isHideArea
            onChange={onChangeFundPlace}
            style={{
              province: { width: 150, marginRight: 20 },
              city: { width: 180 },
            }}
          />
        </Form.Item>
      ),
    },
    <Form.Item key="provident_fund_empty" />,
    <Form.Item
      label={fundPlan.name ? renderProvidentPrompt() : '参保方案名称'}
      // shouldUpdate
      shouldUpdate={(prevVal, curVal) => prevVal.provident_fund_payment_plac !== curVal.provident_fund_payment_plac}
      {...formLayout}
    >
      {
        ({ getFieldValue }) => {
          // 公积金缴纳地
          const fundPlace = getFieldValue('provident_fund_payment_plac') || {};
          return (
            <Form.Item
              name="provident_fund_program_id"
            >
              <SelectFundPlan
                city={fundPlace}
                onChange={onChangeFundPlan}
              />
            </Form.Item>
          );
        }
      }
    </Form.Item>,
    <Form.Item
      label="公积金缴费开始月份"
      name="provident_fund_began_month"
      {...formLayout}
    >
      <DatePicker
        picker="month"
        disabledDate={validatorDate}
      />
    </Form.Item>,
    <Form.Item
      label="公积金基数"
      name="provident_fund"
      rules={[
        { validator: validatorFund },
      ]}
      {...formLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入公积金缴纳基数"
        style={{ width: '100%' }}
      />
    </Form.Item>,
  ];

  // 其他form item
  const otherItems = [
    <Form.Item
      label="大额医疗保险-企业(元/月)"
      name="big_medical_insurance_enterprise"
      {...formMoneyLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入大额医疗保险(企业)"
        style={{ width: '90%' }}
      />
    </Form.Item>,
    <Form.Item
      label="大额医疗保险-个人(元/月)"
      name="big_medical_insurance_person"
      {...formMoneyLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入大额医疗保险(个人)"
        style={{ width: '90%' }}
      />
    </Form.Item>,
    <Form.Item
      label="其它费用-企业"
      name="other_enterprise_fee"
      {...formMoneyLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入其它费用(企业)"
        style={{ width: '90%' }}
      />
    </Form.Item>,
    <Form.Item
      label="其它费用-个人"
      name="other_person_fee"
      {...formMoneyLayout}
    >
      <InputNumber
        min={0}
        placeholder="请输入其它费用(个人)"
        style={{ width: '90%' }}
      />
    </Form.Item>,
  ];

  // 创建页操作
  const renderCreateOperation = () => {
    return (
      <div
        className={style['contract-tab-scroll-button']}
      >
        <Button
          onClick={resetForm}
          style={{
            marginRight: 10,
          }}
        >重置</Button>
        <Button
          onClick={onUpStep}
          type="primary"
          style={{
            marginRight: 10,
          }}
        >上一步</Button>
        {
          // code系统，才有TEAM成本中心
          system.isShowCode() ? (
            <Button
              onClick={onDownStep}
              type="primary"
            >下一步</Button>
          ) : (
            <Button
              onClick={onSubmitVal}
              type="primary"
            >提交</Button>
          )
        }
      </div>
    );
  };

  // 编辑页操作
  const renderUpdateOperation = () => {
    return (
      <div
        className={style['contract-tab-scroll-button']}
      >
        <Button
          onClick={onBack}
          style={{
            marginRight: 10,
          }}
        >返回</Button>
        <Button
          onClick={resetForm}
          style={{
            marginRight: 10,
          }}
        >重置</Button>
        <Button
          onClick={onUpdate}
          type="primary"
        >提交</Button>
      </div>
    );
  };

  const initialValues = {
    is_salary_split: Boolean(employeeDetail.is_salary_split), // 工资是否拆分
    split_base: employeeDetail.split_base ? Unit.exchangePriceToYuan(employeeDetail.split_base) : undefined, // 拆分基数
    social_security_payment_plac: {
      province: dot.get(employeeDetail, 'social_security_payment_plac.province') ?
        Number(dot.get(employeeDetail, 'social_security_payment_plac.province'))
        : undefined,
      city: dot.get(employeeDetail, 'social_security_payment_plac.city')
        ? Number(dot.get(employeeDetail, 'social_security_payment_plac.city'))
        : undefined,
    }, // 社保缴纳地
    insurance_program_id: dot.get(employeeDetail, 'insurance_program_info._id'), // 参保名称
    insurance_began_month: employeeDetail.insurance_began_month ?
      moment(String(employeeDetail.insurance_began_month), 'YYYYMM')
    : undefined, // 社保缴费开始月份
    old_age_insurance: transformUnit(employeeDetail.old_age_insurance), // 养老保险基数
    medical_insurance: transformUnit(employeeDetail.medical_insurance), // 医疗保险基数
    unemployment_insurance: transformUnit(employeeDetail.unemployment_insurance), // 失业保险基数
    occupational_insurance: transformUnit(employeeDetail.occupational_insurance), // 工伤保险基数
    birth_insurance: transformUnit(employeeDetail.birth_insurance), // 生育保险基数
    provident_fund_payment_plac: {
      province: dot.get(employeeDetail, 'provident_fund_payment_plac.province')
        ? Number(dot.get(employeeDetail, 'provident_fund_payment_plac.province'))
        : undefined,
      city: dot.get(employeeDetail, 'provident_fund_payment_plac.city')
        ? dot.get(employeeDetail, 'provident_fund_payment_plac.city')
        : undefined,
    }, // 公积金缴纳地
    provident_fund_program_id: dot.get(employeeDetail, 'provident_fund_program_info._id'), // 公积金方案名称
    provident_fund_began_month: employeeDetail.provident_fund_began_month ?
      moment(String(employeeDetail.provident_fund_began_month), 'YYYYMM')
    : undefined, // 公积金缴费开始月份
    provident_fund: transformUnit(employeeDetail.provident_fund), // 公积金基数
    big_medical_insurance_enterprise: transformUnit(employeeDetail.big_medical_insurance_enterprise), // 大额医疗保险-企业
    big_medical_insurance_person: transformUnit(employeeDetail.big_medical_insurance_person), // 大额医疗保险-个人
    other_enterprise_fee: transformUnit(employeeDetail.other_enterprise_fee), // 其它费用-企业
    other_person_fee: transformUnit(employeeDetail.other_person_fee), // 其它费用-个人
  };

  return (
    <React.Fragment>
      <div
        className={style['contract-tab-content-wrap']}
      >
        <div
          className={style['contract-tab-scroll-content']}
        >
          <Form
            form={form}
            initialValues={initialValues}
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
        {
        employeeId ?
          renderUpdateOperation()
          : renderCreateOperation()
      }
      </div>
    </React.Fragment>
  );
});

export default WelfareForm;
