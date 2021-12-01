/**
 * 财商类 - 合同会审 - 创建
 */
import moment from 'moment';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import { DatePicker, Input, Radio, Select, InputNumber } from 'antd';
import is from 'is_js';
import React, { useEffect, useState } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import {
  Unit,
  BusinesContractComeVersionType,
  BusinesContractComeInvoiceType,
  BusinesContractComeNatureType,
  OAContractStampType,
  ApprovalDefaultParams,
} from '../../../../../../application/define';
import { utils } from '../../../../../../application';
import ContractItems from './components/items';
import {
  PageFormButtons,
  PageUpload,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
} from '../../../components/index';
import { PageEmployeesSelectOnly, PageEmployeesSelect, PageCompanySelect } from '../common/index';
import BasisOrderForm from '../../../components/basisOrderForm';
import ContractTypeComponent from './components/contractTypeComponent';
import ContractChildTypeComponet from './components/contractChildTypeComponent';
import ComponentSealType from './components/sealType';

const { Option } = Select;
const { TextArea } = Input;

function ContractComeCreate(props) {
  const { dispatch, form, query, examineList } = props;

  const [start, setStart] = useState(undefined); // 获取开始时间

  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 合同保管人下拉信息
  const [employeesInfo, setEmployeesInfo] = useState({});
  // 所有枚举表
  const [enumerator, setEnumerator] = useState({});
 // 设置选中的合同类型
  const [contractTypeValueState, setContractTypeValueState] = useState('');
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);
  // tagvalue
  const [themeTag, setThemeTag] = useState(undefined);
  // 提交操作
  const onSubmit = (callbackObj) => {
    const type = orderId ? 'business/updateBusinessPactApplyOrder' : 'business/createBusinessPactApplyOrder';
    onSubmitTranOrder(
      type,
      {
        callback: (res, callback) => {
          onSubmitOrderRec(res, callback, callbackObj.onUnlockHook);
        },
        onErrorCallback: callbackObj.onUnlockHook,
        onSuccessCallback: callbackObj.onDoneHook,
        onLockHook: callbackObj.onLockHook,
      },
    );
  };

      // 审批单关联成功
  const onApprovalIsSuccess = (values, oId, onDoneHook, onErrorCallback) => {
        // 如果第二个参数不存在 就是保存操作 直接返回 否则是创建
    if (is.not.existy(values)) return;
    dispatch({ type: 'oaCommon/submitOrder',
      payload: {
        ...values,
        id: oId,
        // 判断是否是创建，创建提示提示语
        isOa: orderId ? false : true,
        onSuccessCallback: onDoneHook,
        onErrorCallback,
      } });
  };

      // 创建成功后调用关联审批单接口
  const onCreateSuccess = ({ _id, values, oId, onDoneHook, onErrorCallback }) => {
        // 如果没有点击关联审批或者是编辑页面 不请求 关联接口
    if (is.empty(parentIds)) {
          // 如果values存在 那就是直接提交并且没有填写关联的审批id 我们就直接创建 不需要走关联审批单接口
      if (values) {
        onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback);
      }
      return;
    }
        // 关联审批接口
    dispatch({ type: 'humanResource/fetchApproval',
      payload: {
        id: _id,
        ids: parentIds,        // 查询搜索后要关联的审批单id
        type: ApprovalDefaultParams.add, // 增加
        onApprovalIsSuccess: () => onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback),
        onErrorCallback,
      } });
  };

  // 保存操作
  const onSave = (callbackObj) => {
    // 根据单据提交状态调用对应接口
    const type = orderId ?
      'business/updateBusinessPactApplyOrder'
      : 'business/createBusinessPactApplyOrder';

    onSubmitTranOrder(
      type,
      {
        callback: (res) => {
          onSubmitTranRec(res, callbackObj.onUnsaveHook);
        },
        onErrorCallback: callbackObj.onUnsaveHook,
        onLockHook: callbackObj.onSaveHook,
      },
    );
  };

  // 提交事务性单据
  const onSubmitTranOrder = async (type, callbackObj) => {
    const formValues = await form.validateFields();
    if (callbackObj.onLockHook) {
      callbackObj.onLockHook();
    }
    dispatch({
      type,
      payload: {
        ...formValues,  // 单据参数
        flowId: flowVal,
        id: transacId, // 单据id
        themeTag,      // 主题标签内容
        stampType: query.stampType,
        onSuccessCallback: res => callbackObj.callback(res, callbackObj.onSuccessCallback),
        onErrorCallback: callbackObj.onErrorCallback,
      },
    });
  };

  // 提交事务性单据回调
  const onSubmitTranRec = (res, onErrorCallback) => {
    res._id && (setTransacId(res._id));
    res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
    onErrorCallback();
    const params = {
      _id: res.oa_application_order_id,
      onErrorCallback,
    };
    onCreateSuccess(params);
  };

  // 提交审批单回调
  const onSubmitOrderRec = async (res, callback, onErrorCallback) => {
    const formValues = await form.validateFields();
    const params = {
      _id: res.oa_application_order_id,
      values: formValues,
      oId: res.oa_application_order_id,
      onDoneHook: callback,
      onErrorCallback,
    };
    onCreateSuccess(params);
  };

  // 校验合同分数
  const checkDetaileditems = function (rule, value, callback) {
    const copies = value.copies;
    const ourCopies = value.our_copies;
    const oppositeCopies = value.opposite_copies;
    if (!copies || (!ourCopies && ourCopies !== 0) || (!oppositeCopies && oppositeCopies !== 0)) {
      callback('请输入合同份数');
      return;
    }
    if (ourCopies + oppositeCopies !== copies) {
      callback('我方合同份数与对方合同份数之和需和合同总份数保持一致');
      return;
    }
    callback();
  };

  // 设置选中的合同类型的值
  const onChangeContractTypeValue = (e) => {
    // 清除合同子类型的值
    form.setFieldsValue({ contractChildType: undefined });
    setContractTypeValueState(e);
  };

  // 更改开始时间
  const onChangeStart = function (date, dateString) {
    const { setFieldsValue } = form;
    setFieldsValue({ end: null });
    setStart(dateString);
  };

  // 限制结束时间
  const onDisabledEndDate = function (endValue) {
    if (!endValue || !start) {
      return false;
    }

    const starts = moment(moment(start).format('YYYY-MM-DD')).valueOf();
    const end = moment(moment(endValue).format('YYYY-MM-DD')).valueOf();
    return end < starts;
  };

  // 请求合同类型枚举列表{}
  useEffect(() => {
    if (query.contractType) {
      setContractTypeValueState(query.contractType);
    }
    if (query.contractChildType) {
      form.setFieldsValue({ contractChildType: query.contractChildType });
    }
  }, [query]);

  const approval = ((examineList.data || {})[0]) || {};
  // 审批流选中的合同类型
  const pactApplyTypes = approval.pactApplyTypes || [];
  // 审批流选中的合同子类型
  const pactSubTypes = approval.pactSubTypes || [];
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
    const formItems = [
      {
        label: '会审类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('xx', {
          initialValue: OAContractStampType.description(query.stampType) || '',
        })(
          <Input disabled />,
        ),
      },
      {
        label: '合同名称',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('name', {
          initialValue: undefined,
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
          rules: [{ required: `${query.stampType}` !== `${OAContractStampType.unNeed}`, message: '请输入签订人' }],
        })(
          <Input placeholder="请输入签订人" />,
        ),
      },
      {
        label: '签订单位',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('unit', {
          initialValue: undefined,
          rules: [{ required: true, message: '请选择签订单位' }],
        })(
          <PageCompanySelect
            onChange={onChangeUnit}
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
          initialValue: undefined,
          rules: [{ required: `${query.stampType}` !== `${OAContractStampType.unNeed}`, message: '请选择盖章类型' }],
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
          rules: [{
            required: `${query.stampType}` !== `${OAContractStampType.unNeed}`,
            message: '请输入签订甲方',
            // validator: (rule, val = [], callback) => {
            //   const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
            //   if (`${query.stampType}` !== `${OAContractStampType.unNeed}` &&
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
          rules: [{
            required: `${query.stampType}` !== `${OAContractStampType.unNeed}`,
            message: '请输入签订乙方',
            // validator: (rule, val = [], callback) => {
            //   const reg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,}$/;
            //   if (`${query.stampType}` !== `${OAContractStampType.unNeed}` &&
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
          initialValue: { ...defaultValue },
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
          rules: [{ required: `${query.stampType}` !== `${OAContractStampType.unNeed}`, message: '请选择合同起始日期' }],
        })(
          <DatePicker style={{ width: '100%' }} onChange={onChangeStart} />,
        ),
      },
      {
        label: '合同到期日期',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('end', {
          rules: [{ required: `${query.stampType}` !== `${OAContractStampType.unNeed}`, message: '请选择合同到期日期' }],
        })(
          <DatePicker showToday={false} style={{ width: '100%' }} disabledDate={onDisabledEndDate} />,
        ),
      },
      {
        label: '合同保管人',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('safekeeping', {
          initialValue: utils.dotOptimal(employeesInfo, '_id', undefined),
          rules: [{ required: true, message: '请选择合同保管人' }],
        })(
          <PageEmployeesSelectOnly
            placeholder="请选择合同保管人"
            setEmployeesInfo={setEmployeesInfo}
            setEnumerator={setEnumerator}
          />,
        ),
      },
      {
        label: '合同编号',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('code', {
          initialValue: undefined,
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
          initialValue: BusinesContractComeNatureType.main,
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
        name: 'contractType',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('contractType', {
          initialValue: query.contractType,
          onChange: onChangeContractTypeValue,
          rules: [{
            required: query.stampType !== `${OAContractStampType.unNeed}`,
            message: '请选择合同类型',
          }],
        })(
          <ContractTypeComponent
            contractTypeData={enumerator}
            stampType={query.stampType}
            contractTypeDatas={pactApplyTypes}
            contractType={query.contractType}
          />,
        ),
      },
      {
        label: '合同子类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('contractChildType', {
          initialValue: query.contractChildType,
          rules: [{
            required: query.stampType !== `${OAContractStampType.unNeed}` &&
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
            stampType={query.stampType}
            pactSubTypes={pactSubTypes}
            contractChildType={query.contractChildType}
            contractTypeData={enumerator}
            contractTypeValueState={contractTypeValueState}
            contractType={query.contractType}
          />,
          ),
      },
      {
        label: '签订电话',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('phone', {
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
          initialValue: undefined,
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
          initialValue: undefined,
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
          initialValue: [],
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
          initialValue: BusinesContractComeVersionType.yes,
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
          initialValue: undefined,
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
          initialValue: undefined,
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

  // 抄送人
  const renderCopyGive = () => {
    const formItems = [
      {
        label: '抄送人',
        form: form.getFieldDecorator('copyGive')(
          <CommonModalCopyGive flowId={flowVal} />,
        ),
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
      },
      {
        label: '固定抄送',
        form: <FixedCopyGiveDisplay flowId={flowVal} />,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 21 } },
      },
    ];
    return (
      <DeprecatedCoreForm items={formItems} cols={1} />
    );
  };
  return (
    <Form layout="horizontal">
      {/* 渲染基础信息 */}
      <BasisOrderForm
        is_self={query.is_self}
        specialAccountId={form.getFieldValue('safekeeping')}
        stampType={query.stampType}
        contractType={query.contractType}
        contractChildType={query.contractChildType}
        pageType={405}
        form={form}
        flowId={query.flow_id}
        setFlowId={setFlowId}
        orderId={orderId}
        isThemeTagRequired
      />

      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval setThemeTag={setThemeTag} setParentIds={setParentIds} />
         }
      {/* 渲染表单 */}
      {renderFrom()}

      {/* 渲染抄送 */}
      {renderCopyGive()}

      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={props.query}
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </Form>
  );
}

const mapStateToProps = ({ business: { businessUpdateOwnerList }, expenseExamineFlow: { examineList } }) => {
  return { businessUpdateOwnerList, examineList };
};

export default connect(mapStateToProps)(Form.create()(ContractComeCreate));
