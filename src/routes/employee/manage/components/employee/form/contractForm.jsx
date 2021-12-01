/**
 * 员工档案 - 创建 - 合同信息tab
 */
import moment from 'moment';
import is from 'is_js';
import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import {
  Button,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
} from 'antd';
import {
  CoreForm,
  CorePhotosAmazon,
} from '../../../../../../components/core';
import {
  CommonSelectCompanies,
} from '../../../../../../components/common';
import {
  SignContractType,
  TimeCycle,
  ThirdCompanyType,
  ContractType,
  StaffTag,
  EmployeePageSetp,
  StaffType,
  ThirdCompanyState,
} from '../../../../../../application/define';
import PopconfirmRadio from '../../other/popconfirmRadio';
import { utils } from '../../../../../../application';

import style from './style.less';

// form layout
const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const formOneLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

const { Option } = Select;

const ContractForm = forwardRef(({
  setTabKey,
  onChangeTabKeys,
  employeeId, // 人员id
  dispatch,
  employeeDetail = {},  // 员工信息
  newContractInfo = {}, // 合同信息
  onSave, // 编辑保存
  onBack, // 返回
}, ref) => {
  const [form] = Form.useForm();

  // 暴露ref
  useImperativeHandle(ref, () => form);

  const getInitialValues = (isInit) => {
    // 签约周期
    const signCycle = newContractInfo.sign_cycle || 1;
    const signCycleUnit = newContractInfo.sign_cycle_unit || TimeCycle.year;
    let currentStartAt;
  // 判断【当前合同生效日期】是否有值
    if (newContractInfo.current_start_at) {
      currentStartAt = moment(String(newContractInfo.current_start_at));
    }
  // 判断【当前合同生效日期】是否有值，没值而【首合同生效日期】有值，取【首合同生效日期】值
    if ((is.not.existy(newContractInfo.current_start_at) || is.empty(newContractInfo.current_start_at))
    && newContractInfo.signed_date) {
      currentStartAt = moment(String(newContractInfo.signed_date));
    }
    let currentEndAt;
  // 判断【当前合同结束日期】是否有值
    if (newContractInfo.current_end_at) {
      currentEndAt = moment(String(newContractInfo.current_end_at));
    }
  // 判断【当前合同结束日期】是否有值，没值计算默认值
    if ((is.not.existy(newContractInfo.current_end_at) || is.empty(newContractInfo.current_end_at))
    && currentStartAt && signCycle && signCycleUnit) {
      let at = String(currentStartAt);
      // 年
      if (Number(signCycleUnit) === TimeCycle.year) {
        at = moment(String(currentStartAt)).add(signCycle, 'years');
      }
      // 月
      if (Number(signCycleUnit) === TimeCycle.month) {
        at = moment(String(currentStartAt)).add(signCycle, 'months');
      }
      // 日
      if (Number(signCycleUnit) === TimeCycle.day) {
        at = moment(String(currentStartAt)).add(signCycle, 'days');
      }
      currentEndAt = moment(at);
    }
    const initialValues = {
      sign_type: newContractInfo.sign_type || SignContractType.paper, // 签约类型
      // 之前是取的劳动合同(newContractInfo)里的 现在改为从档案(employeeDetail)里面取
      signed_date: employeeDetail.signed_date ?
      moment(String(employeeDetail.signed_date)) : undefined, // 首合同生效日期
      current_start_at: currentStartAt, // 当前合同生效日期
      current_end_at: currentEndAt,   // 当前合同结束日期
      contract_belong_id: utils.dotOptimal(newContractInfo, 'contract_belong_info._id', undefined), // 合同甲方
      contract_type: newContractInfo.contract_type || ContractType.labor, // 合同类型
      contract_photo_list: {
        keys: Array.isArray(newContractInfo.contract_photo_list) ?
        newContractInfo.contract_photo_list
        : [],
        urls: Array.isArray(newContractInfo.contract_photo_url_list) ?
        newContractInfo.contract_photo_url_list
        : [],
      }, // 合同照片
      sign_cycle: signCycle, // 签约周期
      sign_cycle_unit: signCycleUnit, // 签约周期
      employee_type: utils.dotOptimal(employeeDetail, 'employee_type', undefined),
    };

    // 处理员工标签
    if (isInit) {
      // 过滤出'兼职'数据
      const workLabel = utils.dotOptimal(employeeDetail, 'work_label', []).filter(w => w !== StaffTag.partTime);
      initialValues.work_label = workLabel[0];
    }
    return initialValues;
  };

  useEffect(() => {
    form.setFieldsValue({ ...getInitialValues() });
  }, [form, newContractInfo]);

  useEffect(() => {
    form.setFieldsValue({
      work_label: Array.isArray(employeeDetail.work_label) ?
        employeeDetail.work_label : [],
    });
  }, [form, employeeDetail]);

  // 上一步
  const onUpStep = () => {
    setTabKey(EmployeePageSetp.work);
  };

  // 下一步
  const onDownStep = () => {
    form.validateFields().then(() => {
      setTabKey && setTabKey(EmployeePageSetp.career);
      onChangeTabKeys(EmployeePageSetp.career);
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
    form.validateFields().then((values) => {
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

  // 改变结束日期
  const onUpdateCurrentEndAt = (e, signSycle = 1, signCycleUnit) => {
    // 判断是否有值
    if (e && signSycle && signCycleUnit) {
      const at = moment(e).add(-1, 'days');
      let currentEndAt = at;
      // 年
      if (Number(signCycleUnit) === TimeCycle.year) {
        currentEndAt = moment(at).add(signSycle, 'years');
      }
      // 月
      if (Number(signCycleUnit) === TimeCycle.month) {
        currentEndAt = moment(at).add(signSycle, 'months');
      }
      // 日
      if (Number(signCycleUnit) === TimeCycle.day) {
        currentEndAt = moment(at).add(signSycle, 'days');
      }
      form.setFieldsValue({ current_end_at: currentEndAt });
      return;
    }
    form.setFieldsValue({ current_end_at: undefined });
  };

  // 首合同生效日期
  const onChangeSignedDate = (e) => {
    const signSycle = form.getFieldValue('sign_cycle');
    const signCycleUnit = form.getFieldValue('sign_cycle_unit');
    // 改变结束日期
    onUpdateCurrentEndAt(e, signSycle, signCycleUnit);

    // 判断是否有值
    if (e) {
      form.setFieldsValue({ current_start_at: e });
      return;
    }
    form.setFieldsValue({ current_start_at: undefined });
  };

  // 当前合同生效日期
  const onChangeCurrentStartAt = (e) => {
    const signSycle = form.getFieldValue('sign_cycle');
    const signCycleUnit = form.getFieldValue('sign_cycle_unit');
    // 改变结束日期
    onUpdateCurrentEndAt(e, signSycle, signCycleUnit);
  };

  // 签约周期选择
  const onChangeSignCycle = (e) => {
    const currentStartAt = form.getFieldValue('current_start_at');
    const signCycleUnit = form.getFieldValue('sign_cycle_unit');
    // 改变结束日期
    onUpdateCurrentEndAt(currentStartAt, e, signCycleUnit);
  };

  // 签约周期单位
  const onChangeSignCycleUnit = (e) => {
    const currentStartAt = form.getFieldValue('current_start_at');
    const signSycle = form.getFieldValue('sign_cycle');
    // 改变结束日期
    onUpdateCurrentEndAt(currentStartAt, signSycle, e);
  };

  // 首合同生效日期disabled
  const disabledDateSigneDate = (cur) => {
    const curDate = form.getFieldValue('current_start_at');
    if (curDate) {
      return cur && cur > moment(curDate).endOf('day');
    }
  };

  // 当前合同开始日期disabled
  const disabledDateCurrentStartAt = (cur) => {
    const curDate = form.getFieldValue('signed_date');
    const endDate = form.getFieldValue('current_end_at');
    if (curDate && endDate) {
      return cur && (cur < moment(curDate).endOf('day').subtract(1, 'd') || cur > moment(endDate).endOf('day'));
    }

    // 首合同生效日期
    if (curDate) {
      return cur && cur < moment(curDate);
    }

    // 当前合同结束日期
    if (endDate) {
      return cur && cur > moment(endDate).endOf('day');
    }
  };

  // 当前合同结束日期disabled
  const disabledDateCurrenEndAt = (cur) => {
    const curDate = form.getFieldValue('current_start_at');
    if (curDate) {
      return cur && cur < moment(curDate);
    }
  };

  const items = [
    <Form.Item
      label="签约类型"
      name="sign_type"
      rules={[
        { required: true, message: '请选择签约类型' },
      ]}
      {...formLayout}
    >
      <Select
        allowClear
        placeholder="请选择签约类型"
      >
        <Option
          value={SignContractType.paper}
        >
          {SignContractType.description(SignContractType.paper)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="首合同生效日期"
      name="signed_date"
      rules={[
        { required: true, message: '请选择日期' },
      ]}
      {...formLayout}
    >
      <DatePicker
        allowClear
        disabledDate={disabledDateSigneDate}
        onChange={onChangeSignedDate}
      />
    </Form.Item>,
    <Form.Item
      label="当前合同生效日期"
      name="current_start_at"
      rules={[
        { required: true, message: '请选择日期' },
      ]}
      {...formLayout}
    >
      <DatePicker
        allowClear
        disabledDate={disabledDateCurrentStartAt}
        onChange={onChangeCurrentStartAt}
      />
    </Form.Item>,
    <Form.Item
      key="sign_cycle_wrap"
      label={<span className="form-item-required">签约周期</span>}
      shouldUpdate
      {...formLayout}
    >
      {
        ({ getFieldValue }) => {
          const timeCycle = getFieldValue('sign_cycle_unit');
          // 年
          let formContent = (
            <Select onChange={onChangeSignCycle}>
              {
                Array.from({ length: 12 }, (v, i) => {
                  return (
                    <Option
                      key={i}
                      value={i + 1}
                    >{i + 1}</Option>
                  );
                })
              }
            </Select>
          );

          // 日
          if (timeCycle === TimeCycle.day) {
            formContent = (
              <InputNumber
                placeholder="请输入签约周期"
                precision={0}
                min={1}
                max={365}
                style={{ width: '70%' }}
                onChange={onChangeSignCycle}
              />
            );
          }

          // 月
          if (timeCycle === TimeCycle.month) {
            formContent = (
              <Select onChange={onChangeSignCycle} placeholder="请选择签约周期">
                {
                  Array.from({ length: 12 }, (v, i) => {
                    return (
                      <Option
                        key={i}
                        value={i + 1}
                      >{i + 1}</Option>
                    );
                  })
                }
              </Select>
            );
          }

          // 月
          return (
            <Row>
              <Col span={20}>
                <Form.Item
                  name="sign_cycle"
                  rules={[
                    { required: true, message: '请选择签约周期' },
                  ]}
                >
                  {formContent}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="sign_cycle_unit"
                >
                  <PopconfirmRadio
                    onChange={onChangeSignCycleUnit}
                    onChangePopconfirm={() => form.setFieldsValue({ sign_cycle: 1 })}
                  />
                </Form.Item>
              </Col>
            </Row>
          );
        }
      }
    </Form.Item>,
    <Form.Item
      label="当前合同结束日期"
      name="current_end_at"
      rules={[
        { required: true, message: '请选择日期' },
      ]}
      {...formLayout}
    >
      <DatePicker
        allowClear
        disabledDate={disabledDateCurrenEndAt}
      />
    </Form.Item>,
    <Form.Item
      label="合同甲方"
      name="contract_belong_id"
      rules={[
        { required: true, message: '请选择合同甲方' },
      ]}
      {...formLayout}
    >
      <CommonSelectCompanies
        placeholder="请选择合同归属"
        optionFilterProp="children"
        isElectronicSign=""
        showSearch
        state={ThirdCompanyState.on}
        initialCompanies={utils.dotOptimal(newContractInfo, 'contract_belong_info', {})}
        type={ThirdCompanyType.staffProfile}
      />
    </Form.Item>,
    <Form.Item
      label="合同类型"
      name="contract_type"
      rules={[
        { required: true, message: '请选择合同类型' },
      ]}
      {...formLayout}
    >
      <Select placeholder="请选择合同类型">
        <Option value={ContractType.labor}>
          {ContractType.description(ContractType.labor)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="员工类型"
      name="employee_type"
      {...formLayout}
    >
      <Select
        placeholder="请选择员工类型"
      >
        <Option value={StaffType.fullTime}>
          {StaffType.description(StaffType.fullTime)}
        </Option>
        <Option value={StaffType.partTime}>
          {StaffType.description(StaffType.partTime)}
        </Option>
        <Option value={StaffType.intern}>
          {StaffType.description(StaffType.intern)}
        </Option>
      </Select>
    </Form.Item>,
    <Form.Item
      label="员工标签"
      name="work_label"
      {...formLayout}
    >
      <Select
        placeholder="请选择员工标签"
      >
        <Option
          value={StaffTag.probation}
        >{StaffTag.description(StaffTag.probation)}</Option>
        <Option
          value={StaffTag.correct}
        >{StaffTag.description(StaffTag.correct)}</Option>
      </Select>
    </Form.Item>,
    {
      span: 24,
      render: (
        <Form.Item
          label="合同照片"
          name="contract_photo_list"
          {...formOneLayout}
        >
          <CorePhotosAmazon
            domain="staff"
            multiple
            namespace="Contract"
          />
        </Form.Item>
      ),
    },
  ];

  // 合同编号（编辑）
  newContractInfo._id && (
    items.splice(7, 0, (
      <Form.Item
        label="合同编号"
        key="contract_no"
        {...formLayout}
      >
        {newContractInfo.contract_no || '--'}
      </Form.Item>
    ))
  );
  // 创建页操作
  const renderCreateOperation = () => {
    return (
      <div
        className={style['contract-tab-scroll-button']}
      >
        <Button
          onClick={() => form.resetFields()}
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
        <Button
          onClick={onDownStep}
          type="primary"
        >下一步</Button>
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
          onClick={() => form.resetFields()}
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
            initialValues={getInitialValues(true)}
            className="affairs-flow-basic"
          >
            <CoreForm items={items} />
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

export default ContractForm;
