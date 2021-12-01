/**
 * 财商类 - 注册公司申请 - 创建
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { DatePicker, Input, Radio, Select, Form, InputNumber } from 'antd';
import is from 'is_js';

import React, { useState, useEffect } from 'react';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { BusinessCompanyHandleType, BusinessCompanyType, Unit, ApprovalDefaultParams } from '../../../../../../application/define';
import { PageBaseInfo, PageFormButtons, PageUpload, FixedCopyGiveDisplay, ComponentRelatedApproval } from '../../../components/index';
import { PageCompanySelect } from '../common/index';

const { Option } = Select;
const { TextArea } = Input;
const customizeNamespace = 'companyhChange';

function RegisteredCompanyCreate(props) {
  const { dispatch, query, companySelectInfo } = props;
  const [form] = Form.useForm();
  const [type, setType] = useState(BusinessCompanyHandleType.registered);
  const [companyName, setCompanyName] = useState(undefined); // 获取公司名称
  const [companyInfo, setCompanyInfo] = useState({});  // 获取公司信息
  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);

  // 根据公司返回的过滤筛选出所对应的数据
  useEffect(() => {
    dot.get(companySelectInfo, `${customizeNamespace}.data`, []).map((company) => {
      if (company._id === companyName) {
        return setCompanyInfo(company);
      }
    });
  }, [companySelectInfo, companyName]);

  // 更改类型
  const onChangeType = function (value) {
    const values = value.target.value;
    const { setFieldsValue } = form;
    if (values === BusinessCompanyHandleType.registered) {
      setFieldsValue({ companyName: undefined, rcancellationDate: undefined, fileList: undefined, note: undefined });
      setCompanyName(undefined);
      setType(BusinessCompanyHandleType.registered);
    } else {
      setType(BusinessCompanyHandleType.cancellation);
      setCompanyName(undefined);
      setCompanyInfo(undefined);
      // 重置表单
      setFieldsValue({ fileList: undefined, note: undefined, companyName: undefined, companyType: undefined, guardianship: undefined, capital: undefined, registeredDate: undefined, address: undefined, shareholders: undefined });
    }
  };

  // 限制校验
  const disabledDate = function (current) {
    const day = Number(moment().format('YYYYMMDD'));
    return current && Number(moment(current).format('YYYYMMDD')) < day;
  };

  // 提交操作
  const onSubmit = (callbackObj) => {
    const dipType = orderId ? 'business/updateBusinessFirmModifyOrder' : 'business/createBusinessFirmModifyOrder';
    onSubmitTranOrder(
      dipType,
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
    const dispType = orderId ?
      'business/updateBusinessFirmModifyOrder'
      : 'business/createBusinessFirmModifyOrder';

    onSubmitTranOrder(
      dispType,
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
  const onSubmitTranOrder = async (dispType, callbackObj) => {
    const formValues = await form.validateFields();
    if (callbackObj.onLockHook) {
      callbackObj.onLockHook();
    }
    dispatch({
      type: dispType,
      payload: {
        ...companyInfo,
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
    const params = {
      _id: res.oa_application_order_id,
      onErrorCallback,
    };
    onErrorCallback();
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

  // 更改公司名称
  const onCompanySelect = (value) => {
    setCompanyName(value);
  };

  // 渲染表单
  const renderFrom = function () {
    const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
    const formLayoutC1 = { labelCol: { span: 3 }, wrapperCol: { span: 16 } };
    const formItems = [];
    const handleItems = [
      <Form.Item
        label="办理类型"
        name="type"
        initialValue={BusinessCompanyHandleType.registered}
        rules={[{ required: true, message: '请选择办理类型' }]}
        {...formLayoutC1}
      >
        <Radio.Group onChange={onChangeType}>
          <Radio value={BusinessCompanyHandleType.registered}>{BusinessCompanyHandleType.description(BusinessCompanyHandleType.registered)}</Radio>
          <Radio value={BusinessCompanyHandleType.cancellation}>{BusinessCompanyHandleType.description(BusinessCompanyHandleType.cancellation)}</Radio>
        </Radio.Group>
      </Form.Item >,
    ];

    const onChangeNumber = (val) => {
      form.setFieldsValue({
        capital: val,
      });
      return val;
    };
    // 判断类型是否添加注销时间
    if (type === BusinessCompanyHandleType.cancellation) {
      formItems.push(
        <Form.Item
          label="公司名称"
          name="companyName"
          rules={[{ required: true, message: '请选择公司名称' }]}
          {...formLayoutC3}
        >
          <PageCompanySelect onChange={onCompanySelect} placeholder="请选择公司名称" customizeNamespace={customizeNamespace} />
        </Form.Item >,
        <Form.Item
          label="公司性质"
          name="firm_types"
          {...formLayoutC3}
        >
          {dot.get(companyInfo, 'firm_type') ? BusinessCompanyType.description(dot.get(companyInfo, 'firm_type')) : '--'}
        </Form.Item >,
        <Form.Item
          label="法人代表"
          name="legal_names"
          {...formLayoutC3}
        >
          {dot.get(companyInfo, 'legal_name', '--')}
        </Form.Item >,
        <Form.Item
          label="注册资本"
          name="registered_capitasl"
          {...formLayoutC3}
        >
          {dot.get(companyInfo, 'registered_capital') >= 0 ? <span>{`${Unit.exchangePriceToWanYuan(dot.get(companyInfo, 'registered_capital'))}万元`}</span> : '--'}
        </Form.Item >,
        <Form.Item
          label="注册时间"
          name="registered_dates"
          {...formLayoutC3}
        >
          {dot.get(companyInfo, 'registered_date') ? moment(`${dot.get(companyInfo, 'registered_date')}`).format('YYYY-MM-DD') : '--'}
        </Form.Item >,
        <Form.Item
          label="注册地址"
          name="registered_addrs"
          {...formLayoutC3}
        >
          {dot.get(companyInfo, 'registered_addr', '--')}
        </Form.Item >,
        <Form.Item
          label="股东信息"
          name="share_holder_infos"
          {...formLayoutC3}
        >
          {dot.get(companyInfo, 'share_holder_info', '--')}
        </Form.Item >,
        <Form.Item
          label="注销时间"
          name="rcancellationDate"
          rules={[{ required: true, message: '请选择注销时间' }]}
          {...formLayoutC3}
        >
          <DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />
        </Form.Item>,
      );
    } else {
      formItems.push(
        <Form.Item
          label="公司名称"
          name="companyName"
          rules={[{ required: true, message: '请输入公司名称' }]}
          {...formLayoutC3}
        >
          <Input placeholder="请输入公司名称" />
        </Form.Item >,
        <Form.Item
          label="公司性质"
          name="companyType"
          rules={[{ required: true, message: '请选择公司性质' }]}
          {...formLayoutC3}
        >
          <Select placeholder="请选择公司性质" style={{ width: '100%' }} >
            <Option value={BusinessCompanyType.child}>{BusinessCompanyType.description(BusinessCompanyType.child)}</Option>
            <Option value={BusinessCompanyType.points}>{BusinessCompanyType.description(BusinessCompanyType.points)}</Option>
            <Option value={BusinessCompanyType.joint}>{BusinessCompanyType.description(BusinessCompanyType.joint)}</Option>
            <Option value={BusinessCompanyType.acquisition}>{BusinessCompanyType.description(BusinessCompanyType.acquisition)}</Option>
            <Option value={BusinessCompanyType.other}>{BusinessCompanyType.description(BusinessCompanyType.other)}</Option>
          </Select>
        </Form.Item >,
        <Form.Item
          label="法人代表"
          name="guardianship"
          rules={[{ required: true, message: '请输入法人代表' }]}
          {...formLayoutC3}
        >
          <Input placeholder="请输入法人代表" />
        </Form.Item >,
        <Form.Item
          label="注册资本"
          name="capital"
          rules={[{ required: true, message: '请输入注册资本' }]}
          {...formLayoutC3}
        >
          <div>
            <InputNumber onChange={onChangeNumber} style={{ width: '90%' }} precision={2} min={0} max={99999} step={0.01} />
            <span style={{ color: 'rgba(0, 0, 0, 0.65)', marginLeft: '5px', marginRight: '5px' }}>万元</span>
          </div>
        </Form.Item >,
        <Form.Item
          label="注册时间"
          name="registeredDate"
          rules={[{ required: true, message: '请选择注册时间' }]}
          {...formLayoutC3}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item >,
        <Form.Item
          label="注册地址"
          name="address"
          rules={[{ required: true, message: '请输入注册地址' }]}
          {...formLayoutC3}
        >
          <Input placeholder="请输入注册地址" />
        </Form.Item >,
        <Form.Item
          label="股东信息"
          name="shareholders"
          rules={[{ required: true, message: '请输入股东信息' }]}
          {...formLayoutC3}
        >
          <Input placeholder="请输入股东信息" />
        </Form.Item >,
      );
    }
    const publicItems = [
      <Form.Item
        label="申请原因及说明"
        name="note"
        rules={[{ required: true, message: '请输入申请原因及说明' }]}
        {...formLayoutC1}
      >
        <TextArea rows={4} placeholder="请输入申请原因及说明" />
      </Form.Item >,
      <Form.Item
        label="上传附件"
        name="fileList"
        rules={[{ required: type === BusinessCompanyHandleType.cancellation ? false : true, message: '请输入上传附件' }]}
        {...formLayoutC1}
      >
        <PageUpload domain="oa_approval" />
      </Form.Item >,
    ];
    return (
      <CoreContent title="注册/注销公司信息">
        <CoreForm items={handleItems} cols={1} />
        <CoreForm items={formItems} cols={2} />
        <CoreForm items={publicItems} cols={1} />
      </CoreContent>
    );
  };
  // 抄送人
  const renderCopyGive = () => {
    const formItems = [
      <Form.Item
        label="抄送人"
        name="copyGive"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
      >
        <CommonModalCopyGive flowId={flowVal} />
      </Form.Item>,
      <Form.Item
        label="固定抄送"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
      >
        <FixedCopyGiveDisplay flowId={flowVal} />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };
  return (
    <Form form={form} layout="horizontal">
      {/* 渲染基础信息 */}
      <PageBaseInfo
        is_self={query.is_self}
        form={form}
        flowId={query.flow_id}
        pageType={401}
        setFlowId={setFlowId}
        orderId={orderId}
      />
      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval setParentIds={setParentIds} />
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


const mapStateToProps = ({ business: { companySelectInfo } }) => {
  return { companySelectInfo };
};

export default connect(mapStateToProps)(RegisteredCompanyCreate);
