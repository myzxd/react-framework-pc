/**
* 合同/协议信息（编辑）
*/
import dot from 'dot-prop';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, DatePicker, InputNumber, Input } from 'antd';

// import CorePhotos from '../components/corePhotos';
import { CoreContent, DeprecatedCoreForm, CorePhotosAmazon } from '../../../../../../components/core';
import {
  ThirdCompanyType,
  SignContractType,
  ContractType,
  TimeCycle,
  FileType,
  SigningState,
  StaffTag,
  ThirdCompanyState,
} from '../../../../../../application/define';
// import Operate from '../../../../../../application/define/operate';
import { CommonSelectCompanies } from '../../../../../../components/common';
import PopconfirmRadio from '../components/popconfirmRadio';
import CreateContract from './components/modal/createContract.jsx';

import style from './style.css';

const { Option } = Select;

class UpdataContractInfo extends Component {
  static propTypes = {
    employeeDetail: PropTypes.object,            // 人员详情
  }

  static defaultProps = {
    employeeDetail: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,          // 默认不显示新增合同弹窗
    };
    this.signedDate = props.employeeDetail.signed_date ? `${props.employeeDetail.signed_date}` : undefined; // 合同生效日期(用于限制转正日期可选范围))
  }


  componentDidMount() {
    this.props.dispatch({ type: 'fileChange/fetchNewContractInfo', payload: { id: this.props.employeeDetail.identity_card_id } });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.employeeDetail.signed_date !== this.props.employeeDetail.signed_date) {
      this.signedDate = `${this.props.employeeDetail.signed_date}`;
    }
  }

   // 关闭新增合同弹窗
  onCloseModal = () => {
    this.setState({
      isShowModal: false,
    });
  }

  // 自定义PopconfirmRadio气泡组件，点击确定事件监听
  onChangePopconfirm = () => {
    const { setFieldsValue } = this.props.form;
    // 重置表单signCycle
    setFieldsValue({ signCycle: undefined });
  }

  // 更改签约周期（年）
  onChangeSignCycle = (e) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    const signedDate = getFieldValue('signedDate');
    const timeCycle = getFieldValue('timeCycle');
    const formalDate = this.calcFormalDate(signedDate, timeCycle, e);
    setFieldsValue({ formalDate });
  }
  // 更改合作日期
  onChangeEntryDate = (e) => {
    const {
      profile_type: fileType,                      // 档案类型
    } = this.props.employeeDetail;
    const { setFieldsValue, getFieldValue } = this.props.form;
    this.signedDate = e;
    const timeCycle = getFieldValue('timeCycle');
    const signCycle = getFieldValue('signCycle');
    const formalDate = this.calcFormalDate(e, timeCycle, signCycle);
    setFieldsValue({ signedDate: e, formalDate });
    if (`${fileType}` === `${FileType.staff}`) {
      this.onChangeSocietyYm(e);
    }
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
    this.onChangeSocietyYm(e);
  }
  // 影响社保与公积金缴纳月份
  onChangeSocietyYm = (e) => {
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
    return current > moment().endOf('day') || current < moment().subtract('years', 1).endOf('day');
  }

  // 入职/合作日期选择范围限制（员工）
  entryDateDisabledDateStaff = (current) => {
    return current > moment().endOf('day');
  }

  // 合同生效日期选择范围限制
  signedDateDisabledDate = (current) => {
    return current && current > moment().endOf('day');
  }

  // 转正日期选择范围限制
  formalDateDisabledDate = (current) => {
    return current < moment(this.signedDate).endOf('day');
  }

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
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { newContractInfo } = this.props;
    const {
      // state,
      // profile_type: fileType,                      // 档案类型

      sign_type: signType,                         // 签约类型
      entry_date: initEntryDate,                   // 合作日期
      signed_date: initSignedDate,                 // 合同生效日期
      sign_cycle: initSignCycle,                   // 签约周期数
      sign_cycle_unit: initTimeCycle,              // 签约周期单位
      contract_type: initContractType,             // 合同类型
      contract_no: initContractNumber = '',        // 合同编号
      regular_date: initFormalDate,                // 预计转正日期
      actual_regular_date: initRealFormalDate,     // 实际转正日期
    } = newContractInfo;
    const {
      state,                                       // 签约状态
      profile_type: fileType,                      // 档案类型
      work_label: staffTag = [], // 员工标签
    } = this.props.employeeDetail;
    const contractBelongInfo = newContractInfo.contract_belong_info || {};
    const {
      _id: contractBelongId,                       // 合同甲方Id
      name: contractBelongName,                    // 合同甲方名称
    } = contractBelongInfo;
    // 签约周期单位
    // const timeCycle = getFieldValue('timeCycle') || `${initTimeCycle}`;
    // 合同生效日期
    // const signedDate = getFieldValue('signedDate') || `${initSignedDate}`;
    // 签约周期
    // const signCycle = getFieldValue('signCycle') || `${initSignCycle}`;
    let formItems = [];
    // 签约状态为已签约-待换签时，合同/协议信息为可编辑状态，其余情况为不可编辑状态
    if (`${state}` === `${SigningState.replace}`) {
      formItems = [
        // 劳动者包括电子签约和纸质签约、人员档案只有纸质签约
        {
          label: '签约类型',
          key: 'signType',
          form: getFieldDecorator('signType', {
            rules: [{ required: true, message: '请选择内容' }],
            initialValue: signType ? `${signType}` : undefined,
          })(
            <Select className={style['app-comp-employee-manage-update-contract-list']} placeholder="请选择签约类型">
              {
                (`${fileType}` === `${FileType.second}` || `${fileType}` === `${FileType.first}`)
                && <Option value={`${SignContractType.electronic}`}>{SignContractType.description(SignContractType.electronic)}</Option>
              }
              {
                ((`${fileType}` === `${FileType.second}` || `${fileType}` === `${FileType.first}`) || `${fileType}` === `${FileType.staff}`)
                && <Option value={`${SignContractType.paper}`}>{SignContractType.description(SignContractType.paper)}</Option>
              }
            </Select>,
          ),
        },
        {
          label: '合作日期',
          key: 'entryDate',
          form: getFieldDecorator('entryDate', {
            rules: [{ required: true, message: '请选择日期' }],
            initialValue: initEntryDate ? moment(`${initEntryDate}`) : null,
          })(
            <DatePicker
              onChange={this.onChangeEntryDate}
              disabledDate={this.entryDateDisabledDate}
            />,
          ),
        },
        {
          label: '合同生效日期',
          key: 'signedDate',
          form: getFieldDecorator('signedDate', {
            rules: [{ required: true, message: '请选择日期' }],
            initialValue: initSignedDate ? moment(`${initSignedDate}`) : null,
          })(
            <DatePicker
              disabledDate={this.signedDateDisabledDate}
            />,
          ),
        },
        {
          label: '合同甲方',
          key: 'contractBelong',
          form: <span>{contractBelongName || '--'}</span>,
        },
        {
          label: '签约周期',
          layout: { labelCol: { span: 10 }, wrapperCol: { span: 14 } },
          span: 7,
          key: 'signCycle',
          form: getFieldDecorator('signCycle', {
            rules: [{ required: true, message: getFieldValue('timeCycle') === `${TimeCycle.day}` ? '请输入内容' : '请选择内容' }],
            initialValue: initSignCycle ? `${initSignCycle}` : null,
          })(
            // 时间周期为天时使用InputNumber，为年或月时使用Select
            getFieldValue('timeCycle') === `${TimeCycle.day}`
            ? <InputNumber className={style['app-comp-employee-manage-update-contract-list']} placeholder="请输入签约周期" precision={0} min={1} max={365} />
            : getFieldValue('timeCycle') === `${TimeCycle.year}`
              ? <Select className={style['app-comp-employee-manage-update-contract-list']} placeholder="请选择签约周期">
                {
                  Array.from({ length: 15 }, (v, i) => {
                    return (<Option value={`${i + 1}`}>{i + 1}</Option>);
                  })
                }
              </Select>
              : <Select className={style['app-comp-employee-manage-update-contract-list']} placeholder="请选择签约周期">
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
            initialValue: initTimeCycle === 'undefined' || initTimeCycle === 'null' || !initTimeCycle ? `${TimeCycle.year}` : initTimeCycle && `${initTimeCycle}`,
          })(
            <PopconfirmRadio
              timeCycleProps={initTimeCycle === 'undefined' || initTimeCycle === 'null' || !initTimeCycle ? `${TimeCycle.year}` : initTimeCycle && `${initTimeCycle}`}
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
            initialValue: initContractType ? `${initContractType}` : null,
          })(
            <Select className={style['app-comp-employee-manage-update-contract-list']} placeholder="请选择合同类型">
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
    // 档案类型为劳动者，且签约状态为待签约时，除签约类型外，都可编辑
    } else if ((`${fileType}` === `${FileType.second}` || `${fileType}` === `${FileType.first}`) && `${state}` === `${SigningState.pending}`) {
      formItems = [
        {
          label: '签约类型',
          form: <span>{SignContractType.description(signType)}</span>,
        },
        {
          label: '合作日期',
          key: 'entryDate',
          form: getFieldDecorator('entryDate', {
            rules: [{ required: true, message: '请选择日期' }],
            initialValue: moment(`${initEntryDate}`),
          })(
            <DatePicker
              onChange={this.onChangeEntryDate}
              disabledDate={this.entryDateDisabledDate}
            />,
          ),
        },
        {
          label: '合同生效日期',
          key: 'signedDate',
          form: getFieldDecorator('signedDate', {
            rules: [{ required: true, message: '请选择日期' }],
            initialValue: moment(`${initSignedDate}`),
          })(
            <DatePicker
              disabledDate={this.signedDateDisabledDate}
            />,
          ),
        },
        {
          label: '合同甲方',
          key: 'contractBelong',
          form: <span>{contractBelongName || '--'}</span>,
        },
        {
          label: '签约周期',
          layout: { labelCol: { span: 10 }, wrapperCol: { span: 14 } },
          span: 7,
          key: 'signCycle',
          form: getFieldDecorator('signCycle', {
            rules: [{ required: true, message: getFieldValue('timeCycle') === `${TimeCycle.day}` ? '请输入内容' : '请选择内容' }],
            initialValue: `${initSignCycle}`,
          })(
            // 时间周期为天时使用InputNumber，为年或月时使用Select
           getFieldValue('timeCycle') === `${TimeCycle.day}`
            ? <InputNumber className={style['app-comp-employee-manage-update-contract-list']} placeholder="请输入签约周期" precision={0} min={1} max={365} />
            : getFieldValue('timeCycle') === `${TimeCycle.year}`
              ? <Select className={style['app-comp-employee-manage-update-contract-list']} placeholder="请选择签约周期">
                {
                  Array.from({ length: 5 }, (v, i) => {
                    return (<Option value={`${i + 1}`}>{i + 1}</Option>);
                  })
                }
              </Select>
              : <Select className={style['app-comp-employee-manage-update-contract-list']} placeholder="请选择签约周期">
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
            initialValue: initTimeCycle === 'undefined' || initTimeCycle === 'null' || !initTimeCycle ? `${TimeCycle.year}` : initTimeCycle && `${initTimeCycle}`,
          })(
            <PopconfirmRadio
              timeCycleProps={initTimeCycle === 'undefined' || initTimeCycle === 'null' || !initTimeCycle ? `${TimeCycle.year}` : `${initTimeCycle}`}
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
            initialValue: `${initContractType}`,
          })(
            <Select className={style['app-comp-employee-manage-update-contract-list']} placeholder="请选择合同类型">
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
      // 签约类型为纸质签约时增加合同编号字段
      if (`${signType}` === `${SignContractType.paper}`) {
        formItems.push({
          label: '合同编号',
          key: 'contractNumber',
          form: getFieldDecorator('contractNumber')(
            <Input placeholder="请输入合同编号" />,
          ),
        });
      }
    // 档案类型为人员档案时
    } else if (`${fileType}` === `${FileType.staff}`) {
      formItems = [
        // 劳动者包括电子签约和纸质签约、人员档案只有纸质签约
        {
          label: '签约类型',
          key: 'signType',
          form: getFieldDecorator('signType', {
            rules: [{ required: true, message: '请选择内容' }],
            initialValue: signType ? `${signType}` : undefined,
          })(
            <Select style={{ width: '100%' }} placeholder="请选择签约类型">
              {
                (`${fileType}` === `${FileType.second}` || `${fileType}` === `${FileType.first}`)
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
          label: '合作/入职日期',
          key: 'entryDate',
          form: getFieldDecorator('entryDate', {
            rules: [{ required: true, message: '请选择日期' }],
            initialValue: initEntryDate ? moment(`${initEntryDate}`) : null,
          })(
            <DatePicker
              onChange={this.onChangeEntryDate}
              disabledDate={this.entryDateDisabledDateStaff}
            />,
          ),
        },
        {
          label: '合同生效日期',
          key: 'signedDate',
          form: getFieldDecorator('signedDate', {
            rules: [{ required: true, message: '请选择日期' }],
            initialValue: initSignedDate ? moment(`${initSignedDate}`) : null,
          })(
            <DatePicker
              onChange={`${fileType}` === `${FileType.staff}` ? this.onChangeSignedDate : () => {}}
              disabledDate={this.signedDateDisabledDate}
            />,
          ),
        },
        {
          label: '合同甲方',
          key: 'contractBelong',
          form: getFieldDecorator('contractBelong', {
            initialValue: contractBelongId,
            rules: [{ required: true, message: '请选择内容' }],
          })(
            <CommonSelectCompanies
              style={{ width: '100%' }}
              placeholder="请选择合同归属"
              state={ThirdCompanyState.on}
              initialCompanies={contractBelongInfo}
              type={ThirdCompanyType.staffProfile}
            />,
          ),
        },
        {
          label: '签约周期',
          layout: { labelCol: { span: 10 }, wrapperCol: { span: 14 } },
          span: 7,
          key: 'signCycle',
          form: getFieldDecorator('signCycle', {
            rules: [{ required: true, message: getFieldValue('timeCycle') === `${TimeCycle.day}` ? '请输入内容' : '请选择内容' }],
            initialValue: initSignCycle ? `${initSignCycle}` : '1',
          })(
            // 时间周期为天时使用InputNumber，为年或月时使用Select
            getFieldValue('timeCycle') === `${TimeCycle.day}`
            ? <InputNumber style={{ width: '100%' }} placeholder="请输入签约周期" precision={0} min={1} max={365} />
            : getFieldValue('timeCycle') === `${TimeCycle.year}`
              ? <Select
                style={{ width: '100%' }}
                onChange={`${fileType}` === `${FileType.staff}` ? this.onChangeSignCycle : () => {}}
                placeholder="请选择签约周期"
              >
                {
                  Array.from({ length: 15 }, (v, i) => {
                    return (<Option value={`${i + 1}`}>{i + 1}</Option>);
                  })
                }
              </Select>
              : <Select style={{ width: '100%' }} placeholder="请选择签约周期">
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
            initialValue: initTimeCycle === 'undefined' || initTimeCycle === 'null' || !initTimeCycle ? `${TimeCycle.year}` : initTimeCycle && `${initTimeCycle}`,
          })(
            <PopconfirmRadio
              timeCycleProps={getFieldValue('timeCycle') === 'undefined' || getFieldValue('timeCycle') === 'null' || !initTimeCycle ? `${TimeCycle.year}` : getFieldValue('timeCycle')}
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
            initialValue: initContractType ? `${initContractType}` : null,
          })(
            <Select style={{ width: '100%' }} placeholder="请选择合同类型">
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
        {
          label: '员工标签',
          key: 'tag',
          form: getFieldDecorator('staffTag', {
            initialValue: staffTag,
            getValueFromEvent: this.getValueFromEvent,
          })(
            <Select placeholder="请选择员工标签" showArrow mode="multiple" onSelect={this.onSelect}>
              <Option value={StaffTag.partTime}>{StaffTag.description(StaffTag.partTime)}</Option>
              <Option value={StaffTag.probation}>{StaffTag.description(StaffTag.probation)}</Option>
              <Option value={StaffTag.correct}>{StaffTag.description(StaffTag.correct)}</Option>
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
            form: getFieldDecorator('contractNumber', {
              initialValue: initContractNumber || '',
            })(
              <Input placeholder="请输入合同编号" />,
            ),
          },
        );
      }
      formItems.push(
        {
          label: '预计转正日期',
          key: 'formalDate',
          form: getFieldDecorator('formalDate', {
            initialValue: initFormalDate ? moment(`${initFormalDate}`) : this.calcFormalDate(getFieldValue('signedDate'), getFieldValue('timeCycle'), getFieldValue('signCycle')),
          })(
            <DatePicker
              disabledDate={this.formalDateDisabledDate}
            />,
          ),
        },
        {
          label: '实际转正日期',
          key: 'realFormalDate',
          form: getFieldDecorator('realFormalDate', {
            initialValue: initRealFormalDate ? moment(`${initRealFormalDate}`) : undefined,
          })(
            <DatePicker
              disabledDate={this.formalDateDisabledDate}
            />,
          ),
        },
      );
    } else {
      formItems = [
        {
          label: '签约类型',
          form: <span>{SignContractType.description(signType)}</span>,
        },
        {
          label: '合作日期',
          form: <span>{initEntryDate || '--'}</span>,
        },
        {
          label: '合同生效日期',
          form: <span>{initSignedDate || '--'}</span>,
        },
        {
          label: '合同甲方',
          form: <span>{contractBelongName || '--'}</span>,
        },
        {
          label: '签约周期',
          form: <span>{`${initSignCycle}  ${TimeCycle.description(initTimeCycle)}`}</span>,
        },
        {
          label: '合同类型',
          form: <span>{ContractType.description(initContractType)}</span>,
        },
      ];
      // 签约类型为纸质签约时
      if (`${signType}` === `${SignContractType.paper}`) {
        formItems.push(
          {
            label: '合同编号',
            form: <span>{initContractNumber || '--'}</span>,
          },
        );
      }
    }
    const layout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={3} layout={layout} />
    );
  }

  // 渲染合同照片信息
  renderContactPhotos = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const signTypeValue = getFieldValue('signType');
    const { newContractInfo } = this.props;
    const {
      _id: id,                                            // 人员id
      state,                                              // 签约状态
      sign_type: signType,                                // 签约类型
      profile_type: fileType,                             // 档案类型
      contract_photo_list: contractPhotoList = [],        // 合同照片
      contract_photo_list_url: contractPhotoListUrl = [], // 合同照片
    } = this.props.employeeDetail;
    const { sign_type: signTypeStaff } = newContractInfo;
    // 只有纸质签约才可以上传照片
    if ((`${signTypeValue || signType}` !== `${SignContractType.paper}`) && (`${fileType}` !== `${FileType.staff}`)) return;
    if ((`${signTypeValue || signTypeStaff}` !== `${SignContractType.paper}`) && (`${fileType}` === `${FileType.staff}`)) return;
    // 使用人员id，作为命名空间
    const namespace = `UpdataContractInfo-${id || '--'}`;
    const value = {
      keys: contractPhotoList,
      urls: contractPhotoListUrl,
    };
    let formItems = [];
    // 签约状态为已签约-待换签时，合同照片为可编辑状态
    if (`${state}` === `${SigningState.replace}`) {
      formItems = [
        {
          label: '合同照片',
          form: getFieldDecorator('contractPhotos', {
            initialValue: value,
          })(
            <CorePhotosAmazon domain="staff" multiple namespace={namespace} />,
          ),
        },
      ];
    // 档案类型为劳动者，且签约状态为待签约时，合同照片为可编辑状态
    } else if (`${fileType}` === `${FileType.second}` && `${state}` === `${SigningState.pending}`) {
      formItems = [
        {
          label: '合同照片',
          form: getFieldDecorator('contractPhotos', {
            rules: [{ required: true, message: '请选择合同照片' }],
            initialValue: value,
          })(
            <CorePhotosAmazon domain="staff" multiple namespace={namespace} />,
          ),
        },
      ];
    // 其余情况为不可编辑状态
    } else if (`${fileType}` === `${FileType.staff}`) {
      const valueStaff = {
        keys: newContractInfo.contract_photo_list,
        urls: newContractInfo.contract_photo_url_list,
      };
      formItems = [
        {
          label: '合同照片',
          form: getFieldDecorator('contractPhotos', {
            initialValue: valueStaff,
          })(
            <CorePhotosAmazon domain="staff" multiple namespace={namespace} />,
          ),
        },
      ];
    } else {
      formItems = [
        {
          label: '合同照片',
          form: <CorePhotosAmazon domain="staff" isDisplayMode value={value} namespace={namespace} />,
        },
      ];
    }
    const layout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
    return (
      <DeprecatedCoreForm items={formItems} cols={1} layout={layout} />
    );
  }

  render() {
    const { isShowModal } = this.state;
    const id = this.props.employeeDetail ? this.props.employeeDetail._id : undefined;
    const idCard = this.props.employeeDetail ? this.props.employeeDetail.identity_card_id : undefined;
    const name = this.props.employeeDetail ? this.props.employeeDetail.name : undefined;
    const phone = this.props.employeeDetail ? this.props.employeeDetail.phone : undefined;
    return (
      <CoreContent title="合同/协议信息">
        <Form layout="horizontal">
          {/* 渲染表单信息 */}
          {this.renderForm()}
          {/* 渲染合同照片信息(只有纸质签约才可以上传照片) */}
          {this.renderContactPhotos()}
          {/* 渲染新增合同弹窗 */}
          <CreateContract isShowModal={isShowModal} name={name} phone={phone} idCard={idCard} id={id} onCloseModal={this.onCloseModal} />
        </Form>
      </CoreContent>
    );
  }
}
function mapStateToProps({ fileChange }) {
  return { newContractInfo: fileChange.newContractInfo };
}

export default connect(mapStateToProps)(UpdataContractInfo);
