/**
* 合同/协议信息（创建）
*/
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, DatePicker, Input, InputNumber } from 'antd';

// import CorePhotos from '../components/corePhotos';
import { CoreContent, DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../../components/core';
import {
  ThirdCompanyType,
  SignContractType,
  ContractType,
  TimeCycle,
  FileType,
  StaffTag,
} from '../../../../../../application/define';
import ContractBelong from './components/contractBelong';
import { CommonSelectCompanies } from '../../../../../../components/common';
import PopconfirmRadio from '../components/popconfirmRadio';

import style from './style.css';

const { Option } = Select;

class ContractInfo extends Component {
  static propTypes = {
    onChangeSignType: PropTypes.func, // 更改签约类型
    fileType: PropTypes.string,    // 档案类型
    supplierIds: PropTypes.array,  // 供应商
    cityCode: PropTypes.string, // 城市
    industryType: PropTypes.string, // 所属场景
  }

  static defaultProps = {
    fileType: '',
    supplierIds: [],
    cityCode: '',
    industryType: '',
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.signedDate = undefined; // 合同生效日期(用于限制转正日期可选范围))
  }

  // 自定义PopconfirmRadio气泡组件，点击确定事件监听
  onChangePopconfirm = () => {
    const { setFieldsValue } = this.props.form;
    // 重置表单signCycle
    setFieldsValue({ signCycle: undefined, formalDate: undefined });
  }

  // 更改签约周期（年）
  onChangeSignCycle = (e) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    const signedDate = getFieldValue('signedDate');
    const timeCycle = getFieldValue('timeCycle');
    const formalDate = this.calcFormalDate(signedDate, timeCycle, e);
    setFieldsValue({ formalDate });
  }
  // 更改合作/入职日期
  onChangeEntryDate = (e) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    this.signedDate = e;
    const timeCycle = getFieldValue('timeCycle');
    const signCycle = getFieldValue('signCycle');
    const formalDate = this.calcFormalDate(e, timeCycle, signCycle);
    setFieldsValue({ signedDate: e, formalDate });
  }

  // 更改合同生效日期
  onChangeSignedDate = (e) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    this.signedDate = e;
    const timeCycle = getFieldValue('timeCycle');
    const signCycle = getFieldValue('signCycle');
    const formalDate = this.calcFormalDate(e, timeCycle, signCycle);
    setFieldsValue({ formalDate });
    // 合同生效日期影响后面的社保公积金缴纳月份
    if (dot.get(this, 'props.society.props.form')) {
      const signedYear = moment(e).year();
      const signedMonth = moment(e).month();
      const sDate = dot.get(this, 'props.society.props.form').getFieldValue('societyStartMonth');
      const fDate = dot.get(this, 'props.society.props.form').getFieldValue('fundStartMonth');
      // 社保开始月份不能早于合同生效日期
      if (sDate) {
        const sy = moment(sDate).year();
        const sm = moment(sDate).month();
        // 社保年份小于合同生效年 || 合同生效年与社保开始年相等 && 合同生效月大于社保开始月份，需要重置社保开始年月
        if (signedYear > sy || (signedYear === sy && signedMonth > sm)) {
          this.props.society.props.form.setFieldsValue({
            societyStartMonth: null,
          });
        }
      }
      // 公积金开始月份不能早于合同生效日期
      if (fDate) {
        const fy = moment(fDate).year();
        const fm = moment(fDate).month();
        // 公积金年份小于合同生效年 || 合同生效年与公积金开始年相等 && 合同生效月大于公积金开始月份，需要重置公积金开始年月
        if (signedYear > fy || (signedYear === fy && signedMonth > fm)) {
          this.props.society.props.form.setFieldsValue({
            fundStartMonth: null,
          });
        }
      }
    }
  }

  onChangeSignType = () => {
    // 更改签约类型
    const { resetFields } = this.props.form;
    resetFields(['contractBelong']);
  }

  // 修改员工标签
  getValueFromEvent = (val) => {
    const data = [...val];
    const selectValue = val[val.length - 1];
    if (selectValue === StaffTag.probation) {
      return data.filter(i => i !== StaffTag.correct);
    }

    if (selectValue === StaffTag.correct) {
      return data.filter(i => i !== StaffTag.probation);
    }
    return data;
  }

  // 合作日期选择范围限制（劳动者）
  entryDateDisabledDate = (current) => {
    return current > moment().endOf('day') || current < moment().subtract('years', 1);
  }

  // 入职/合作日期选择范围限制（员工）
  entryDateDisabledDateStaff = (current) => {
    return current > moment().endOf('day');
  }

  // 合同生效日期选择范围限制（劳动者）
  signedDateDisabledDate = (current) => {
    return current > moment().endOf('day') || current < moment().subtract('years', 1);
  }

  // 合同生效日期选择范围限制（员工）
  signedDateDisabledDateStaff = (current) => {
    return current > moment().endOf('day');
  }

  // 转正日期选择范围限制
  formalDateDisabledDate = (current) => {
    return current < moment(this.signedDate).endOf('day');
  }

  // 转正日期选择范围限制
  // formalDateDisabledDate = (current) => {
  //   return current && current > moment().add(30, 'day');
  // }

  // 计算预计转正日期
  calcFormalDate = (signedDate, timeCycle, signCycle) => {
    if (signedDate && `${timeCycle}` === `${TimeCycle.year}`) {
      let formalDate;
      switch (`${signCycle}`) {
        case '1':
          formalDate = moment(signedDate).add(1, 'months');
          break;
        case '2':
          formalDate = moment(signedDate).add(2, 'months');
          break;
        case '3':
          formalDate = moment(signedDate).add(3, 'months');
          break;
        default:
          formalDate = undefined;
      }
      return formalDate;
    }
    return undefined;
  }

  // 渲染表单信息
  renderForm = () => {
    const {
      fileType,
      supplierIds,
      cityCode,
      industryType,
      onChangeSignType,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    // 签约类型
    const signType = getFieldValue('signType') || (`${fileType}` === `${FileType.second}`
                      ? `${SignContractType.electronic}`
                      : `${SignContractType.paper}`);
    // 合作日期
    const entryDate = getFieldValue('entryDate') || undefined;
    // 时间周期
    const timeCycle = getFieldValue('timeCycle') || `${TimeCycle.year}`;
    const formItems = [
      // 劳动者包括电子签约和纸质签约、人员档案只有纸质签约
      {
        label: '签约类型',
        key: 'signType',
        form: getFieldDecorator('signType', {
          rules: [{ required: true, message: '请选择内容' }],
          initialValue: `${fileType}` === `${FileType.second}`
                        ? `${SignContractType.electronic}`
                        : `${SignContractType.paper}`,
        })(
          <Select className={style['app-comp-employee-manage-form-create-contract-sign-type']} placeholder="请选择签约类型" onChange={onChangeSignType}>
            {
              (`${fileType}` === `${FileType.second}`)
              && <Option value={`${SignContractType.electronic}`}>{SignContractType.description(SignContractType.electronic)}</Option>
            }
            {
              (`${fileType}` === `${FileType.second}` || `${fileType}` === `${FileType.staff}`)
              && <Option value={`${SignContractType.paper}`}>{SignContractType.description(SignContractType.paper)}</Option>
            }
          </Select>,
        ),
      },
      {
        label: `${fileType}` === `${FileType.staff}` ? '合作/入职日期' : '合作日期',
        key: 'entryDate',
        form: getFieldDecorator('entryDate', {
          initialValue: null,
          rules: [{ required: true, message: '请选择日期' }],
        })(
          <DatePicker
            onChange={this.onChangeEntryDate}
            disabledDate={`${fileType}` === `${FileType.staff}` ? this.entryDateDisabledDateStaff : this.entryDateDisabledDate}
          />,
        ),
      },
      {
        label: '合同生效日期',
        key: 'signedDate',
        form: getFieldDecorator('signedDate', {
          rules: [{ required: true, message: '请选择日期' }],
          initialValue: entryDate,
        })(
          <DatePicker
            onChange={`${fileType}` === `${FileType.staff}` ? this.onChangeSignedDate : () => {}}
            disabledDate={`${fileType}` === `${FileType.staff}` ? this.signedDateDisabledDateStaff : this.signedDateDisabledDate}
          />,
        ),
      },
      {
        label: '合同甲方',
        key: 'contractBelong',
        form: getFieldDecorator('contractBelong', {
          rules: [{ required: true, message: '请选择内容' }],
        })(
          `${fileType}` === `${FileType.staff}`
          ? <CommonSelectCompanies
            className={style['app-comp-employee-manage-form-create-contract-belong']}
            placeholder="请选择合同归属"
            type={ThirdCompanyType.staffProfile}
          />
          : <ContractBelong
            className={style['app-comp-employee-manage-form-create-contract-belong']}
            placeholder="请选择合同归属"
            supplierId={supplierIds}
            disabled
            cityCode={cityCode}
            industryCode={industryType}
          />,
        ),
      },
      {
        label: '签约周期',
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 14 } },
        span: 7,
        key: 'signCycle',
        form: getFieldDecorator('signCycle', {
          rules: [{ required: true, message: `${timeCycle}` === `${TimeCycle.day}` ? '请输入内容' : '请选择内容' }],
          initialValue: '1',
        })(
          // 时间周期为天时使用InputNumber，为年或月时使用Select
          `${timeCycle}` === `${TimeCycle.day}`
          ? <InputNumber className={style['app-comp-employee-manage-form-create-contract-sign']} placeholder="请输入签约周期" precision={0} min={1} max={365} />
          : `${timeCycle}` === `${TimeCycle.year}`
            ? <Select
              className={style['app-comp-employee-manage-form-create-contract-sign']}
              onChange={`${fileType}` === `${FileType.staff}` ? this.onChangeSignCycle : () => {}}
              placeholder="请选择签约周期"
            >
              {
                Array.from({ length: 15 }, (v, i) => {
                  return (<Option value={`${i + 1}`}>{i + 1}</Option>);
                })
              }
            </Select>
              : <Select className={style['app-comp-employee-manage-form-create-contract-sign']} placeholder="请选择签约周期">
                {
                  Array.from({ length: 12 }, (v, i) => {
                    return (<Option value={`${i + 1}`}>{i + 1}</Option>);
                  })
                }
              </Select>,
        ),
      },
      {
        label: '',
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 4 } },
        span: 1,
        key: 'timeCycle',
        form: getFieldDecorator('timeCycle', {
          initialValue: `${TimeCycle.year}`,
        })(
          <PopconfirmRadio
            timeCycleProps={timeCycle}
            onChangePopconfirm={this.onChangePopconfirm}
          />,
        ),
      },
      {
        // 劳动者档案只有承揽协议，人员档案只有劳动合同
        label: '合同类型',
        key: 'contractType',
        form: getFieldDecorator('contractType', {
          rules: [{ required: true, message: '请选择内容' }],
          initialValue: `${fileType}` === `${FileType.staff}`
                        ? `${ContractType.labor}`
                        : `${ContractType.contract}`,
        })(
          <Select className={style['app-comp-employee-manage-form-create-contract-sign-type']} placeholder="请选择合同类型">
            {
              `${fileType}` === `${FileType.staff}`
              || <Option value={`${ContractType.contract}`}>{ContractType.description(ContractType.contract)}</Option>
            }
            {
              `${fileType}` === `${FileType.staff}`
              && <Option value={`${ContractType.labor}`}>{ContractType.description(ContractType.labor)}</Option>
            }
          </Select>,
        ),
      },
    ];
    // 签约类型为纸质签约时
    if (`${signType}` === `${SignContractType.paper}`) {
      formItems.push(
        {
          label: '合同编号',
          key: 'contractNumber',
          form: getFieldDecorator('contractNumber')(
            <Input placeholder="请输入合同编号" />,
          ),
        },
      );
    }
    // 档案类型为人员档案时
    if (`${fileType}` === `${FileType.staff}`) {
      formItems.push(
        {
          label: '员工标签',
          form: getFieldDecorator('staffTag', {
            key: 'tag',
            getValueFromEvent: this.getValueFromEvent,
          })(
            <Select placeholder="请选择员工标签" showArrow mode="multiple" onSelect={this.onSelect}>
              <Option value={StaffTag.partTime}>{StaffTag.description(StaffTag.partTime)}</Option>
              <Option value={StaffTag.probation}>{StaffTag.description(StaffTag.probation)}</Option>
              <Option value={StaffTag.correct}>{StaffTag.description(StaffTag.correct)}</Option>
            </Select>,
          ),
        },
        {
          label: '预计转正日期',
          key: 'formalDate',
          form: getFieldDecorator('formalDate', { initialValue: null })(
            <DatePicker
              disabledDate={this.formalDateDisabledDate}
            />,
          ),
        },
        {
          label: '实际转正日期',
          key: 'realFormalDate',
          form: getFieldDecorator('realFormalDate', { initialValue: null })(
            <DatePicker
              disabledDate={this.formalDateDisabledDate}
            />,
          ),
        },
      );
    }
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 渲染合同照片信息
  renderContactPhotos = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    // 签约状态
    const signType = getFieldValue('signType') || `${SignContractType.electronic}`;
    // 只有纸质签约才可以上传照片
    if (`${signType}` !== `${SignContractType.paper}`) return;
    // 使用人员id，作为命名空间
    const namespace = 'ContractInfo';
    const values = {
      keys: [],
      urls: [],
    };
    const formItems = [
      {
        label: '合同照片',
        form: getFieldDecorator('contractPhotos', {
          initialValue: values,
        })(
          <CorePhotosAmazon domain="staff" multiple namespace={namespace} />,
        ),
      },
    ];
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  render() {
    return (
      <CoreContent title="合同/协议信息">
        <Form layout="horizontal">
          {/* 渲染表单信息 */}
          {this.renderForm()}
          {/* 渲染合同照片信息(只有纸质签约才可以上传照片) */}
          {this.renderContactPhotos()}
        </Form>
      </CoreContent>
    );
  }
}

export default ContractInfo;
