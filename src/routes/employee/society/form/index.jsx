/**
 * 人员管理 - 社保配置管理 - 新增与编辑
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, Input, Row, Col, Button, Tooltip, Modal } from 'antd';


import { CoreContent, CoreForm } from '../../../../components/core';
import { CommonSelectRegionalCascade } from '../../../../components/common';
import { Unit } from '../../../../application/define';

import SelectPlan from '../components/selectPlan.jsx';           // 参保方案名称下拉组件

import SocietyCard from '../components/societyCard.jsx';        // 社保方案卡片

import Style from '../style.less';                            // 样式

const { Item } = Form;
const SocietyForm = ({ match, dispatch, location, societyPlanDetail = {}, history }) => {
  // 弹窗显示状态
  const [displayModal, setDisplayModal] = useState(false);
  // 异常人数
  const [anomalyNum, setAnomalyNum] = useState(0);
  // 标记是否是新增页面(默认新建页)
  const [isCreate, setIsCreate] = useState(true);
  // 下拉选择的方案名称
  const [selectPlanName, setSelectPlanName] = useState(undefined);

  const [form] = Form.useForm();

  // 初始化页面
  useEffect(() => {
    // 如果是编辑页面
    if (match.path === '/Employee/Society/Update') {
      setIsCreate(false);
      //  请求详情数据
      dispatch({
        type: 'society/fetchSocietyPlanDetail',
        payload: { id: location.query.id },
      });
      return () => {
        dispatch({
          type: 'society/reducerSocietyPlanDetail',
          payload: {},
        });
      };
    }
  }, [match, dispatch, location]);

  // 详情填充
  useEffect(() => {
    // 当是编辑并且有详情数据的时候，填充
    if (!isCreate && societyPlanDetail._id) {
      initDataFn();
    }
  }, [societyPlanDetail]);
  // 单位转换
  const transformUnit = (data) => {
    return (data || data === 0) ? Unit.exchangePriceToYuan(data) : undefined;
  };
  // 详情填充数据
  const initDataFn = () => {
    const {
      province_code,
      city_code,
      name,
      old_age_insurance,
      medical_insurance,
      unemployment_insurance,
      occupational_insurance,
      birth_insurance,
      provident_fund,
    } = societyPlanDetail;
    const initData = {
      city: {
        province: province_code,
        city: city_code,
        area: undefined,
      },
      planName: name,
      pensionBaseUp: transformUnit(old_age_insurance.upper_limit),          // 养老
      pensionBaseDown: transformUnit(old_age_insurance.lower_limit),
      pensionCompany: old_age_insurance.company_percent,
      pensionPerson: old_age_insurance.person_percent,
      medicineBaseUp: transformUnit(medical_insurance.upper_limit),         // 医疗
      medicineBaseDown: transformUnit(medical_insurance.lower_limit),
      medicineCompany: medical_insurance.company_percent,
      medicinePerson: medical_insurance.person_percent,
      loseBaseUp: transformUnit(unemployment_insurance.upper_limit),             // 失业
      loseBaseDown: transformUnit(unemployment_insurance.lower_limit),
      loseCompany: unemployment_insurance.company_percent,
      losePerson: unemployment_insurance.person_percent,
      birthBaseUp: transformUnit(birth_insurance.upper_limit),            // 生育
      birthBaseDown: transformUnit(birth_insurance.lower_limit),
      birthCompany: birth_insurance.company_percent,
      birthPerson: birth_insurance.person_percent,
      injuryBaseUp: transformUnit(occupational_insurance.upper_limit),           // 工伤
      injuryBaseDown: transformUnit(occupational_insurance.lower_limit),
      injuryCompany: occupational_insurance.company_percent,
      injuryPerson: occupational_insurance.person_percent,
      fundBaseUp: transformUnit(provident_fund.upper_limit),           // 公积金
      fundBaseDown: transformUnit(provident_fund.lower_limit),
      fundCompany: provident_fund.company_percent,
      fundPerson: provident_fund.person_percent,
    };
    form.setFieldsValue(initData);
  };

  // 重置
  const onReset = () => {
    form.resetFields();
  };
  // 保留2位小数
  const trans = (num) => {
    if (num) {
      const res = String(num).split('.');
      if (res.length === 1) {
        return num;
      }
      const str = res[1].slice(0, 2);
      return Number(`${res[0]}.${str}`);
    }
    return num;
  };

  // 提交
  const onSave = () => {
    form.validateFields().then((values) => {
      const obj = {
        // 比例
        pensionCompany: trans(values.pensionCompany),
        pensionPerson: trans(values.pensionPerson),
        medicineCompany: trans(values.medicineCompany),
        medicinePerson: trans(values.medicinePerson),
        loseCompany: trans(values.loseCompany),
        losePerson: trans(values.losePerson),
        birthCompany: trans(values.birthCompany),
        birthPerson: trans(values.birthPerson),
        injuryCompany: trans(values.injuryCompany),
        injuryPerson: trans(values.injuryPerson),
        fundCompany: trans(values.fundCompany),
        fundPerson: trans(values.fundPerson),
        // 上下限
        pensionBaseDown: trans(values.pensionBaseDown),
        pensionBaseUp: trans(values.pensionBaseUp),
        medicineBaseDown: trans(values.medicineBaseDown),
        medicineBaseUp: trans(values.medicineBaseUp),
        loseBaseDown: trans(values.loseBaseDown),
        loseBaseUp: trans(values.loseBaseUp),
        birthBaseDown: trans(values.birthBaseDown),
        birthBaseUp: trans(values.birthBaseUp),
        injuryBaseDown: trans(values.injuryBaseDown),
        injuryBaseUp: trans(values.injuryBaseUp),
        fundBaseDown: trans(values.fundBaseDown),
        fundBaseUp: trans(values.fundBaseUp),
      };
      if (isCreate) {
        dispatch({
          type: 'society/createSociety',
          payload: { ...values, onComplete, ...obj },
        });
      } else {
        dispatch({
          type: 'society/updateSociety',
          payload: { ...values, onComplete, id: location.query.id, ...obj },
        });
      }
    });
  };
  // 完成的回调
  const onComplete = (res) => {
    if (isCreate) {
      onModalOk();
    } else if (res === 0) {
      onModalOk();
    } else {
      setAnomalyNum(res);
      setDisplayModal(true);
    }
  };

  // 弹窗确认
  const onModalOk = () => {
    window.location.href = '/#/Employee/Society';
  };

  // 方案下拉选择
  const onChangePlan = (name) => {
    setSelectPlanName(name);
  };

  // 设置方案基本信息
  const renderBaseInfo = () => {
    const styleCity = {
      province: {
        width: 120,
        marginRight: 10,
      },
      city: {
        width: 120,
      },
    };
    const itemsCity = [
      <Item
        label="城市"
        name="city"
        rules={
        [
          {
            required: true,
            validator(rule, value) {
              if (!value || !value.city) {
                return Promise.reject('请选择城市');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <CommonSelectRegionalCascade isHideArea disabled={!isCreate} style={styleCity} />
      </Item>,
    ];
    const items = [
      <Item
        label="参保方案名称"
        name="planName"
        rules={[
          {
            required: true,
            validator: (rule, val) => {
              if (!val) {
                return Promise.reject('请输入参保方案名称');
              }
              if (!val.trim()) {
                return Promise.reject('请输入非空格名称');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input placeholder="请输入" />
      </Item>,
    ];
    return (<CoreContent title="设置方案基本信息">
      <CoreForm items={items} cols={3} />
      <CoreForm items={itemsCity} cols={3} />
    </CoreContent>);
  };
  // 社保方案配置
  const renderSocietyPlan = () => {
    // 渲染提示文字
    const text = '选择已经成功设置的社保方案，可以复用该方案的基数和比例信息';
    // 渲染方案名称label
    const elementLabel = (<span>
      方案名称&nbsp;
      <Tooltip placement="top" title={text}>
        <QuestionCircleOutlined />
      </Tooltip>
    </span>);
    return (<CoreContent title="参保方案配置">
      <Row>
        <Col span={8}>
          <Item label={elementLabel} name="selectPlanTip">
            <SelectPlan onChange={onChangePlan} />
          </Item>
        </Col>
      </Row>
      <SocietyCard Item={Item} form={form} selectPlanName={selectPlanName} />
    </CoreContent>);
  };
  // 渲染底部方案
  const renderButton = () => {
    if (isCreate) {
      return (<div className={Style['app-comp-employee-society-form-button-wrap']}>
        <Button onClick={onReset}>重置</Button>
        <Button type="primary" onClick={onSave}>提交</Button>
      </div>);
    }
    return (<div className={Style['app-comp-employee-society-form-button-wrap']}>
      <Button onClick={() => { history.go(-1); }}>返回</Button>
      <Button type="primary" onClick={onSave}>保存方案</Button>
    </div>);
  };
  // 渲染弹窗
  const renderModal = () => {
    return (
      <Modal
        title="提示"
        visible
        onCancel={onModalOk}
        footer={null}
      >
        <p>该方案已修改成功，有{anomalyNum}个员工社保基数已经超出当前方案设置的基数区间值，请记得修改</p>
        <div className={Style['app-comp-employee-society-modal-footer']}>
          <Button onClick={onModalOk} type="primary">知道了</Button>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      <Form
        form={form}
        name="society"
        labelAlign="right"
        labelCol={{ span: 8, offset: 2 }}
      >
        {/* 设置方案基本信息 */}
        {renderBaseInfo()}
        {/* 社保方案配置 */}
        {renderSocietyPlan()}
        {/* 底部按钮 */}
        {renderButton()}
      </Form>
      {/* 渲染弹窗 */}
      {displayModal ? renderModal() : null}
    </div>
  );
};

const mapStateToProps = ({ society: { societyPlanDetail } }) => ({ societyPlanDetail });

export default connect(mapStateToProps)(SocietyForm);
