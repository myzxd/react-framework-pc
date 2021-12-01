/**
 * 财商类 - 合同会审 - 编辑
 */
import is from 'is_js';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import { DatePicker, Input, Radio, Select, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { utils } from '../../../../../../application';
import ContractTypeComponent from './components/contractTypeComponent';
import ContractChildTypeComponet from './components/contractChildTypeComponent';

import {
  BusinesContractComeVersionType,
  BusinesContractComeInvoiceType,
  BusinesContractComeNatureType,
  Unit,
  OAContractStampType,
} from '../../../../../../application/define';
import ContractItems from './components/items';
import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import { PageEmployeesSelectOnly, PageEmployeesSelect, PageCompanySelect } from '../common/index';
import ExamineFlow from '../../../components/form/flow';
import ComponentSealType from './components/sealType';

const { Option } = Select;
const { TextArea } = Input;

function ContractComeUpdate(props) {
  const { dispatch, form, businessCameDetail, query, examineFlowInfo = [] } = props;
 // 所有枚举表
  const [enumerator, setEnumerator] = useState({});
   // 设置选中的合同类型
  const [contractTypeValueState, setContractTypeValueState] = useState('');
  const { oa_application_flow_info } = businessCameDetail;
  // 审批流配置的合同类型
  // eslint-disable-next-line camelcase
  const contractTypeDatas = (oa_application_flow_info || {}).pact_apply_types || {};
  // eslint-disable-next-line camelcase
  const pactSubTypes = (oa_application_flow_info || {}).pact_sub_types || {};
  const flag = query.id;
  // 接口请求
  useEffect(() => {
    const payload = {
      id: flag,
    };
    // 请求接口
    dispatch({ type: 'business/fetchBusinessPactApplyOrderDetail', payload });
  }, [dispatch, flag]);

  // 提交单据到服务器
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    onFinish({
      onSuccessCallback: onDoneHook,
      onErrorCallback: onUnlockHook,
      onLockHook,
    });
  };
  // 请求合同类型枚举列表{}
  useEffect(() => {
    if (query.contractChildType) {
      form.setFieldsValue({ contractChildType: query.contractChildType });
    }
  }, []);

  useEffect(() => {
    if (businessCameDetail.pact_type) {
      setContractTypeValueState(businessCameDetail.pact_type);
    }
  }, [businessCameDetail]);

  // 提交
  const onFinish = function (params = {}) {
    const { validateFields } = form;
    validateFields((err, values) => {
      if (err) {
        return;
      }
      // 锁定按钮
      if (params.onLockHook) {
        params.onLockHook();
      }
      const payload = {
        id: query.id,
        ...values,
        ...params,
        flag,
      };
      dispatch({ type: 'business/updateBusinessPactApplyOrder', payload });
    });
  };

  // 更新单据到服务器(编辑提交)
  const onUpdate = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    onFinish({
      onSuccessCallback: onDoneHook,
      onErrorCallback: onUnlockHook,
      onLockHook,
    });
  };

  // 校验合同分数
  const checkDetaileditems = function (rule, value, callback) {
    if (is.existy(value) && is.not.empty(value)) {
      // every()是对数组中每一项运行给定函数，如果该函数对每一项返回true,则返回true
      const flags = Object.values(value).every((v) => {
        return is.existy(v) && is.not.empty(v);
      });

      if (flags === true &&
        value.copies !== value.opposite_copies + value.our_copies
      ) {
        callback('我方合同份数与对方合同份数之和需和合同总份数保持一致');
        return;
      }

      if (flags === true && Object.values(value).length === 3) {
        callback();
        return;
      } else {
        callback('合同份数请填写完整');
      }
    }
    callback('请填写合同份数');
  };

  // 更改开始时间
  const onChangeStart = function () {
    const { setFieldsValue } = form;
    setFieldsValue({ end: null });
  };

  // 限制结束时间
  const onDisabledEndDate = function (endValue) {
    const { getFieldValue } = form;
    const start = getFieldValue('start');
    if (!endValue || !start) {
      return false;
    }

    const starts = moment(moment(start).format('YYYY-MM-DD')).valueOf();
    const end = moment(moment(endValue).format('YYYY-MM-DD')).valueOf();
    return end < starts;
  };

  // 设置选中的合同类型的值
  const onChangeContractTypeValue = (e) => {
    // 清除合同子类型的值
    form.setFieldsValue({ pact_sub_type: undefined });
    setContractTypeValueState(e);
  };

  // 签订单位
  const onChangeUnit = () => {
    // 清空盖章类型
    form.setFieldsValue({ seal: undefined });
  };

  // 渲染表单
  const renderFrom = function () {
    const { getFieldDecorator } = form;
    const defaultValue = {
      copies: undefined, // 合同份数
      our_copies: undefined, // 我方合同份数
      opposite_copies: undefined, // 对方合同份数
    };
    // 合同类型及合同子类型级联表
    const pactTypesHasSubTypes = (enumerator || {}).pact_types_has_sub_types || {};
    // 单个合同类型及合同子类型级联表
    const pactTypesSubTypes = pactTypesHasSubTypes[contractTypeValueState] || {};
    // 合同子类型
    const subTypes = pactTypesSubTypes.sub_types;
    // 份数集合
    const guardianships = {
      copies: dot.get(businessCameDetail, 'copies', 0), // 合同份数
      our_copies: dot.get(businessCameDetail, 'our_copies', 0), // 我方合同份数
      opposite_copies: dot.get(businessCameDetail, 'opposite_copies', 0), // 对方合同份数
    };

    const formItems = [
      {
        label: '会审类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('stampType', {
          initialValue: dot.get(businessCameDetail, 'stamp_type', undefined),
        })(
          <span>{OAContractStampType.description(businessCameDetail.stamp_type) || ''}</span>,
        ),
      },
      {
        label: '合同名称',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('name', {
          initialValue: dot.get(businessCameDetail, 'name', undefined),
          rules: [{ required: true, message: '请输入合同名称' }],
        })(
          <Input placeholder="请输入合同名称" />,
        ),
      },
      {
        label: '签订人',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('people', {
          initialValue: dot.get(businessCameDetail, 'singer', undefined),
          rules: [{ required: `${businessCameDetail.stamp_type}` !== `${OAContractStampType.unNeed}`, message: '请输入签订人' }],
        })(
          <Input placeholder="请输入签订人" />,
        ),
      },
      {
        label: '签订单位',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('unit', {
          initialValue: dot.get(businessCameDetail, 'firm_info._id', undefined),
          rules: [{ required: true, message: '请选择签订单位' }],
        })(
          <PageCompanySelect
            isUnit
            onChange={onChangeUnit}
            otherChild={utils.dotOptimal(businessCameDetail, 'firm_info', {})}
            allowClear
            placeholder="请选择签订单位"
          />,
        ),
      },
      {
        label: '盖章类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('seal', {
          initialValue: dot.get(businessCameDetail, 'seal_type', undefined),
          rules: [{ required: `${businessCameDetail.stamp_type}` !== `${OAContractStampType.unNeed}`, message: '请选择盖章类型' }],
        })(
          <ComponentSealType
            disabled={!form.getFieldValue('unit')}
            firmId={form.getFieldValue('unit')}
            placeholder="请选择盖章类型"
            allowClear
            style={{ width: '100%' }}
          />,
        ),
      },
      {
        label: '签订甲方',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('partyA', {
          initialValue: businessCameDetail.pact_part_a ? businessCameDetail.pact_part_a.split('、') : [],
          rules: [{
            required: `${businessCameDetail.stamp_type}` !== `${OAContractStampType.unNeed}`,
            message: '请输入签订甲方',
            // validator: (rule, val = [], callback) => {
            //   const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
            //   if (`${businessCameDetail.stamp_type}` !== `${OAContractStampType.unNeed}` &&
            //     (!val || (Array.isArray(val) && val.length < 1))) {
            //     callback('请输入签订甲方');
            //     return;
            //   }

            //   if (val.some(item => !reg.test(item))) {
            //     callback('请输入数字、字母或者汉字');
            //     return;
            //   }
            //   callback();
            // },
          }],
        })(
          <Select
            mode="tags"
            allowClear
            notFoundContent=""
            tokenSeparators={[',', '，']}
            placeholder="请输入签订甲方"
          />,
        ),
      },
      {
        label: '签订丙方',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('partyC', {
          initialValue: businessCameDetail.pact_part_c ? businessCameDetail.pact_part_c.split('、') : [],
          // rules: [{
          //   required: false,
          //   // message: '请输入签订丙方',
          //   validator: (rule, val = [], callback) => {
          //     const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
          //     if (val.some(item => !reg.test(item))) {
          //       callback('请输入数字、字母或者汉字');
          //       return;
          //     }
          //     callback();
          //   },
          // }],
        })(
          <Select
            mode="tags"
            allowClear
            notFoundContent=""
            tokenSeparators={[',', '，']}
            placeholder="请输入签订丙方"
          />,
        ),
      },
      {
        label: '签订乙方',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('partyB', {
          initialValue: businessCameDetail.pact_part_b ? businessCameDetail.pact_part_b.split('、') : [],
          rules: [{
            required: `${businessCameDetail.stamp_type}` !== `${OAContractStampType.unNeed}`,
            message: '请输入签订乙方',
            // validator: (rule, val = [], callback) => {
            //   const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
            //   if (`${businessCameDetail.stamp_type}` !== `${OAContractStampType.unNeed}` &&
            //     (!val || (Array.isArray(val) && val.length < 1))) {
            //     callback('请输入签订乙方');
            //     return;
            //   }

            //   if (val.some(item => !reg.test(item))) {
            //     callback('请输入数字、字母或者汉字');
            //     return;
            //   }
            //   callback();
            // },
          }],
        })(
          <Select
            mode="tags"
            allowClear
            notFoundContent=""
            tokenSeparators={[',', '，']}
            placeholder="请输入签订乙方"
          />,
        ),
      },
      {
        label: '签订丁方',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('partyD', {
          initialValue: businessCameDetail.pact_part_d ? businessCameDetail.pact_part_d.split('、') : [],
          // rules: [{
          //   required: false,
          //   // message: '请输入签订丁方',
          //   validator: (rule, val = [], callback) => {
          //     const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
          //     if (val.some(item => !reg.test(item))) {
          //       callback('请输入数字、字母或者汉字');
          //       return;
          //     }
          //     callback();
          //   },
          // }],
        })(
          <Select
            mode="tags"
            allowClear
            notFoundContent=""
            tokenSeparators={[',', '，']}
            placeholder="请输入签订丁方"
          />,
        ),
      },
      {
        label: '合同份数',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 18 } },
        form: getFieldDecorator('guardianship', {
          initialValue: { ...defaultValue, ...guardianships },
          rules: [{ required: true, validator: checkDetaileditems }],
        })(
          <ContractItems />,
        ),
      },
      {
        label: '合同起始日期',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('start', {
          initialValue: dot.get(businessCameDetail, 'from_date') ? moment(`${dot.get(businessCameDetail, 'from_date')}`) : undefined,
          rules: [{ required: `${businessCameDetail.stamp_type}` !== `${OAContractStampType.unNeed}`, message: '请选择合同起始日期' }],
        })(
          <DatePicker style={{ width: '100%' }} onChange={onChangeStart} />,
        ),
      },
      {
        label: '合同到期日期',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('end', {
          initialValue: dot.get(businessCameDetail, 'end_date') ? moment(`${dot.get(businessCameDetail, 'end_date')}`) : undefined,
          rules: [{ required: `${businessCameDetail.stamp_type}` !== `${OAContractStampType.unNeed}`, message: '请选择合同到期日期' }],
        })(
          <DatePicker showToday={false} style={{ width: '100%' }} disabledDate={onDisabledEndDate} />,
        ),
      },
      {
        label: '合同保管人',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('safekeeping', {
          initialValue: dot.get(businessCameDetail, 'preserver_id', undefined),
          rules: [{ required: false, message: '请选择合同保管人' }],
        })(
          <PageEmployeesSelectOnly setEnumerator={setEnumerator} placeholder="请选择合同保管人" />,
        ),
      },
      {
        label: '合同编号',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('code', {
          initialValue: dot.get(businessCameDetail, 'pact_no', undefined),
          rules: [{ required: false, message: '请输入合同编号' }],
        })(
          <Input placeholder="请输入合同编号" />,
        ),
      },
      {
        label: '合同性质',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('nature', {
          initialValue: dot.get(businessCameDetail, 'pact_property', undefined),
          rules: [{ required: false, message: '请选择合同性质' }],
        })(
          <Radio.Group>
            <Radio value={BusinesContractComeNatureType.main}>{BusinesContractComeNatureType.description(BusinesContractComeNatureType.main)}</Radio>
            <Radio value={BusinesContractComeNatureType.supplement}>{BusinesContractComeNatureType.description(BusinesContractComeNatureType.supplement)}</Radio>
            <Radio value={BusinesContractComeNatureType.business}>{BusinesContractComeNatureType.description(BusinesContractComeNatureType.business)}</Radio>
          </Radio.Group>,
        ),
      },
      {
        label: '合同类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('pact_type', {
          initialValue: businessCameDetail.pact_type || undefined,
          onChange: onChangeContractTypeValue,
          rules: [{
            required: businessCameDetail.stamp_type !== OAContractStampType.unNeed,
            message: '请选择合同类型',
          }],
        })(
          <ContractTypeComponent
            contractTypeDatas={contractTypeDatas}
            contractTypeData={enumerator}
            stampType={businessCameDetail.stamp_type ? `${businessCameDetail.stamp_type}` : ''}
            contractType={businessCameDetail.pact_type}
          />,
        ),
      },
      {
        label: '合同子类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('pact_sub_type', {
          initialValue: businessCameDetail.pact_sub_type || '',
          rules: [{
            required: businessCameDetail.stamp_type !== OAContractStampType.unNeed &&
              is.existy(subTypes) && is.not.empty(subTypes),
            validator: (rule, val) => {
                // 必填进行校验
              if (rule.required === true) {
                  // 判断合同子类型是否包含审批流的合同类型, 不包含返回false
                const isContain = pactSubTypes.some(item => subTypes[item]);
                if (isContain === false) {
                  return Promise.reject('审批流未配置合同子类型，请联系流程管理员');
                }
                  // 没选择报错
                if (is.not.existy(val) || is.empty(val)) {
                  return Promise.reject('请选择合同子类型');
                }
                return Promise.resolve();
              }
              return Promise.resolve();
            },
          }],
        })(
          <ContractChildTypeComponet
            pactSubTypes={pactSubTypes}
            stampType={businessCameDetail.stamp_type}
            contractTypeData={enumerator}
            contractChildType={businessCameDetail.pact_sub_type}
            contractTypeValueState={contractTypeValueState}
            contractType={businessCameDetail.pact_type}
          />,
        ),
      },
      {
        label: '签订电话',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('phone', {
          initialValue: dot.get(businessCameDetail, 'sign_phone', undefined),
          rules: [{ pattern: /^1[3456789]\d{9}$/, message: '请填写正确电话' }],
        })(
          <Input placeholder="请输入签订电话" />,
        ),
      },
      {
        label: '合同单价(元)',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('unitPrice', {
          initialValue: dot.get(businessCameDetail, 'unit_price') ? Unit.exchangePriceToYuan(dot.get(businessCameDetail, 'unit_price')) : undefined,
          rules: [{ required: false, message: '请输入合同单价' }],
        })(
          <InputNumber
            placeholder="请输入合同单价"
            min={0}
            step={0.01}
            max={Unit.maxMoney}
            formatter={Unit.maxMoneyLimitDecimals}
            parser={Unit.limitDecimalsParser}
            style={{ width: '100%' }}
          />,
        ),
      },
      {
        label: '发票类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('invoice', {
          initialValue: businessCameDetail.invoice_type ? businessCameDetail.invoice_type : undefined,
          rules: [{ required: false, message: '请选择发票类型' }],
        })(
          <Select placeholder="请选择发票类型" style={{ width: '100%' }} >
            <Option value={BusinesContractComeInvoiceType.special}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.special)}</Option>
            <Option value={BusinesContractComeInvoiceType.ordinary}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.ordinary)}</Option>
            <Option value={BusinesContractComeInvoiceType.volume}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.volume)}</Option>
            <Option value={BusinesContractComeInvoiceType.machine}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.machine)}</Option>
            <Option value={BusinesContractComeInvoiceType.building}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.building)}</Option>
            <Option value={BusinesContractComeInvoiceType.cargo}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.cargo)}</Option>
            <Option value={BusinesContractComeInvoiceType.highway}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.highway)}</Option>
            <Option value={BusinesContractComeInvoiceType.quota}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.quota)}</Option>
            <Option value={BusinesContractComeInvoiceType.place}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.place)}</Option>
            <Option value={BusinesContractComeInvoiceType.receipt}>{BusinesContractComeInvoiceType.description(BusinesContractComeInvoiceType.receipt)}</Option>
          </Select>,
        ),
      },
      {
        label: '票务负责人',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('responsibility', {
          initialValue: businessCameDetail.fare_manager_id || undefined,
          rules: [{ required: false, message: '请选择票务负责人' }],
        })(
          <PageEmployeesSelect placeholder="请选择票务负责人" />,
        ),
      },
      {
        label: '关联审批单',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('relationOrderIds', {
          initialValue: utils.showPlainText(businessCameDetail, 'relation_application_order_ids', []),
          rules: [{
            validator: (rule, val = [], callback) => {
              const reg = /^[0-9a-zA-Z]{1,}$/;
              if (val.some(item => !reg.test(item))) {
                callback('请输入数字、字母');
                return;
              }
              callback();
            },
          }],
        })(
          <Select
            mode="tags"
            allowClear
            notFoundContent=""
            tokenSeparators={[',', '，']}
            placeholder="请输入关联审批单"
          />,
        ),
      },
      {
        label: '合同版本是否已返回',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('version', {
          initialValue: dot.get(businessCameDetail, 'is_backed', undefined),
          rules: [{ required: false, message: '请输入合同版本是否已返回' }],
        })(
          <Radio.Group>
            <Radio value={BusinesContractComeVersionType.yes}>{BusinesContractComeVersionType.description(BusinesContractComeVersionType.yes)}</Radio>
            <Radio value={BusinesContractComeVersionType.no}>{BusinesContractComeVersionType.description(BusinesContractComeVersionType.no)}</Radio>
          </Radio.Group>,
        ),
      },
      {
        label: '合同主要内容及条款',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('note', {
          initialValue: dot.get(businessCameDetail, 'content', undefined),
          rules: [{ required: true, pattern: /\S+/, message: '请输入申请原因及说明' }],
        })(
          <TextArea rows={4} placeholder="请输入申请原因及说明" />,
        ),
      },
      {
        label: '上传附件',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('fileList', {
          initialValue: PageUpload.getInitialValue(businessCameDetail, 'asset_infos'),
          rules: [{ required: true, message: '请上传附件' }],
        })(
          <PageUpload domain="oa_approval" />,
        ),
      },
    ];
    return (
      <CoreContent title="合同信息">
        <DeprecatedCoreForm items={formItems} />
      </CoreContent>
    );
  };

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <Form layout="horizontal">
      {/* 审批信息 */}
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          flowId={query.flow_id}
          isDetail
          departmentId={dot.get(businessCameDetail, 'creator_department_info._id', undefined)}
          accountId={dot.get(businessCameDetail, 'creator_info._id', undefined)}
          specialAccountId={dot.get(businessCameDetail, 'preserver_id', undefined)}
        />
      </CoreContent>

      {/* 渲染表单 */}
      {renderFrom()}

      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={props.query}
        showUpdate={flag ? true : false}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
      />
    </Form>
  );
}


const mapStateToProps = ({ business: { businessCameDetail },
  oaCommon: { examineFlowInfo },
}) => {
  return { businessCameDetail, examineFlowInfo };
};

export default connect(mapStateToProps)(Form.create()(ContractComeUpdate));
