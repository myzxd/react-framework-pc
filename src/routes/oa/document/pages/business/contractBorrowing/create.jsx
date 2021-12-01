/**
 * 财商类 - 合同借阅 - 创建
 */
import moment from 'moment';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import { DatePicker, Input, Select, InputNumber } from 'antd';
import is from 'is_js';
import React, { useState } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { OABorrowingType, ApprovalDefaultParams } from '../../../../../../application/define';
import { PageFormButtons, PageUpload, FixedCopyGiveDisplay, ComponentRelatedApproval } from '../../../components/index';
import ContractInfo from './component/contractInfo';
import BasisOrderForm from '../../../components/basisOrderForm';

const { Option } = Select;
const { TextArea } = Input;

function ContractBorrowingCreate(props) {
  const { dispatch, form, query } = props;
  const [start, setStart] = useState(undefined); // 获取开始信息

  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);
  // 合同保管人id集合
  const [preserverId, setPreserverId] = useState([]);
  // 合同名称错误提示状态
  const [mState, setMState] = useState(false);
  const borrowType = query.contract_borrow_type;

  // 提交操作
  const onSubmit = (callbackObj) => {
    const type = orderId ? 'business/updateBusinessPactBorrowOrder' : 'business/createBusinessPactBorrowOrder';
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
    dispatch({
      type: 'oaCommon/submitOrder',
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
    dispatch({
      type: 'humanResource/fetchApproval',
      payload: {
        id: _id,
        ids: parentIds,        // 查询搜索后要关联的审批单id
        type: ApprovalDefaultParams.add, // 增加
        onApprovalIsSuccess: () => onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback),
        onErrorCallback,
      } });
  };

  // 保存操作
  const onSave = async (callbackObj) => {
    // 根据单据提交状态调用对应接口
    const type = orderId ?
      'business/updateBusinessPactBorrowOrder'
      : 'business/createBusinessPactBorrowOrder';

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
    const contractInfo = formValues.contractInfo || [];
    // 合同报错
    if (contractInfo.length === 0 || (Array.isArray(contractInfo) &&
      contractInfo.some(item => !item))) {
      console.error('合同信息报错');
      return;
    }
    if (callbackObj.onLockHook) {
      callbackObj.onLockHook();
    }
    dispatch({
      type,
      payload: {
        ...formValues,  // 单据参数
        flowId: flowVal,
        id: transacId, // 单据id
        onSuccessCallback: res => callbackObj.callback(res, callbackObj.onSuccessCallback),
        onErrorCallback: callbackObj.onErrorCallback,
      },
    });
  };

  // 提交事务性单据回调
  const onSubmitTranRec = (res, onErrorCallback) => {
    res._id && (setTransacId(res._id));
    res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
    onErrorCallback && onErrorCallback();
    const params = {
      _id: res.oa_application_order_id,
      onErrorCallback,
    };
    onCreateSuccess(params);
  };

  // 提交审批单回调
  const onSubmitOrderRec = async (res, callback, onErrorCallback) => {
    const formValues = await form.validateFields();
    const contractInfo = formValues.contractInfo || [];
    // 合同报错
    if (contractInfo.length === 0 || (Array.isArray(contractInfo) &&
      contractInfo.some(item => !item))) {
      console.error('合同信息报错');
      return;
    }
    const params = {
      _id: res.oa_application_order_id,
      values: formValues,
      oId: res.oa_application_order_id,
      onDoneHook: callback,
      onErrorCallback,
    };
    onCreateSuccess(params);
  };

  // 更改开始时间
  const onChangeStart = function (date, dateString) {
    const { setFieldsValue } = form;
    setFieldsValue({ expect: null });
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

  // 限制借阅开始时间
  const onDisabledEndBorringDate = function (endValue) {
    const day = Number(moment().format('YYYYMMDD'));
    return endValue && Number(moment(endValue).format('YYYYMMDD')) < day;
  };

  // 渲染基础信息
  const renderBasisnfo = function () {
    const { getFieldDecorator } = form;
    const fromBorrowing = [
      {
        label: '借阅类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('type', {
          initialValue: borrowType !== 'undefined' ? Number(borrowType) : undefined,
          rules: [{ required: false, message: '请选择借阅类型' }],
        })(
          <Select placeholder="请选择借阅类型" style={{ width: '100%' }} disabled>
            <Option value={OABorrowingType.original}>{OABorrowingType.description(OABorrowingType.original)}</Option>
            <Option value={OABorrowingType.copy}>{OABorrowingType.description(OABorrowingType.copy)}</Option>
            <Option value={OABorrowingType.scanning}>{OABorrowingType.description(OABorrowingType.scanning)}</Option>
            <Option value={OABorrowingType.other}>{OABorrowingType.description(OABorrowingType.other)}</Option>
          </Select>,
        ),
      },
      {
        label: '借阅份数',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('additional', {
          rules: [{ required: true, message: '请输入借阅份数' }],
        })(
          <InputNumber min={1} max={10000} precision={0} style={{ width: '100%' }} placeholder="请输入借阅份数" />,
        ),
      },
      {
        label: '借阅时间',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('date', {
          initialValue: undefined,
          rules: [{ required: true, message: '请选择借阅时间' }],
        })(
          <DatePicker style={{ width: '100%' }} disabledDate={onDisabledEndBorringDate} onChange={onChangeStart} />,
        ),
      },
      {
        label: '预计归还时间',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('expect', {
          initialValue: undefined,
          rules: [{ required: true, message: '请选择预计归还时间' }],
        })(
          <DatePicker showToday={false} style={{ width: '100%' }} disabledDate={onDisabledEndDate} />,
        ),
      },
      {
        label: '借阅事由',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('why', {
          initialValue: undefined,
          rules: [{ required: false, message: '请输入借阅事由' }],
        })(
          <Input placeholder="请输入借阅事由" />,
        ),
      },
      {
        label: '使用城市',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('city', {
          initialValue: undefined,
          rules: [{ required: false, message: '请输入使用城市' }],
        })(
          <Input placeholder="请输入使用城市" />,
        ),
      },
      {
        label: '是否需要归还',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: <span>{`${borrowType}` === `${OABorrowingType.original}` ? '是' : '否'}</span>,
      },
      {
        label: '申请原因及说明',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 20 } },
        form: getFieldDecorator('note', {
          rules: [{ required: true, message: '请输入申请原因及说明' }],
        })(
          <TextArea rows={4} placeholder="请输入申请原因及说明" />,
        ),
      },
    ];

    return (
      <CoreContent title="基础信息">
        <DeprecatedCoreForm items={fromBorrowing} />
      </CoreContent>
    );
  };

  // 渲染表单
  const renderFrom = function () {
    const { getFieldDecorator } = form;
    const formItems = [
      {
        label: '',
        span: 24,
        layout: { labelCol: { span: 0 }, wrapperCol: { span: 24 } },
        form: getFieldDecorator('contractInfo', {
          initialValue: [''],
          rules: [{
            validator: (rule, val = [], callback) => {
              if (val.some(item => !item)) {
                // 设置错误消息状态true
                setMState(true);
                callback();
                return;
              }
              // 设置错误消息状态false
              setMState(false);
              callback();
            },
          }],
        })(
          <ContractInfo mState={mState} setPreserverId={setPreserverId} />,
        ),
      },
      {
        label: '上传附件',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('fileList', {
          initialValue: undefined,
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
      <BasisOrderForm
        specialAccountId={preserverId}
        is_self={query.is_self}
        isShowRequireTagTheme
        isThemeTagRequired
        istBorrowing
        form={form}
        flowId={query.flow_id}
        pageType={406}
        setFlowId={setFlowId}
        pactType={Number(query.contract_borrow_type)}
        orderId={orderId}
      />
      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval isShowThemeTag={false} setParentIds={setParentIds} />
      }
      {/* 渲染基础信息 */}
      {renderBasisnfo()}

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


const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Form.create()(ContractBorrowingCreate));
