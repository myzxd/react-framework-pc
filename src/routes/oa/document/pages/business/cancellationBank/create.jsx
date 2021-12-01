/**
 * 财商类 - 注销银行账户申请 - 创建
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import { Input } from 'antd';
import is from 'is_js';
import React, { useState, useEffect } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { BusinesBankAccountType, ApprovalDefaultParams } from '../../../../../../application/define';
import { PageFormButtons, PageUpload, FixedCopyGiveDisplay, ComponentRelatedApproval } from '../../../components/index';
import { PageCompanySelect, PageAccountTypeSelect } from '../common/index';
import BasisOrderForm from '../../../components/basisOrderForm';

const { TextArea } = Input;

function CancellationBankCreate(props) {
  const { dispatch, form, query, accountSelectInfo } = props;
  const [accountId, setAccountId] = useState(undefined); // 获取用户id
  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);
  // tagvalue
  const [themeTag, setThemeTag] = useState(undefined);
  // 当开户银行及支行只有一条选项时默认选中
  useEffect(() => {
    const { setFieldsValue } = form;
    if (accountSelectInfo.data && accountSelectInfo.data.length === 1) {
      setFieldsValue({ account: accountSelectInfo.data[0]._id });
      onAccountTypeSelect(accountSelectInfo.data[0]._id);
    }
    if ((accountSelectInfo.data && accountSelectInfo.data.length === 0) || (!accountSelectInfo.data)) {
      setFieldsValue({ account: undefined });
    }
  }, [accountSelectInfo]);

  // 提交操作
  const onSubmit = (callbackObj) => {
    const type = orderId ? 'business/updateBusinessBankOrder' : 'business/createBusinessBankOrder';
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
      'business/updateBusinessBankOrder'
      : 'business/createBusinessBankOrder';

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
        orderType: 20,
        themeTag,      // 主题标签内容
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
    const params = {
      _id: res.oa_application_order_id,
      values: formValues,
      oId: res.oa_application_order_id,
      onDoneHook: callback,
      onErrorCallback,
    };
    onCreateSuccess(params);
  };

  // 更改账户
  const onAccountTypeSelect = (value) => {
    setAccountId(value);
  };

  // 渲染表单
  const renderFrom = () => {
    const { getFieldDecorator, getFieldValue } = form;
    let accountInfo = {}; // 账户信息
    // 根据开户数据筛选出相对应的账户类型，账号的数据
    dot.get(accountSelectInfo, 'data', []).map((contract) => {
      if (contract._id === accountId) {
        accountInfo = contract;
        return accountInfo;
      }
    });
    const formItems = [
      {
        label: '公司名称',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 10 } },
        form: getFieldDecorator('companyName', {
          initialValue: undefined,
          rules: [{ required: true, message: '请选择公司名称' }],
        })(
          <PageCompanySelect placeholder="请选择公司名称" />,
        ),
      },
    ];
    formItems.push(
      {
        label: '银行账号',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 10 } },
        form: getFieldDecorator('account', {
          initialValue: undefined,
          rules: [{ required: true, message: '请选择银行账号' }],
        })(
          <PageAccountTypeSelect
            onChange={onAccountTypeSelect}
            companyId={getFieldValue('companyName')}
            placeholder="请选择银行账号"
          />,
        ),
      },
      {
        label: '账户类型',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: dot.get(accountInfo, 'bank_card_type') ? BusinesBankAccountType.description(dot.get(accountInfo, 'bank_card_type')) : '--',
      },
      {
        label: '开户银行及支行',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: dot.get(accountInfo, 'bank_and_branch', '--'),
      },
      {
        label: '注销原因及说明',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 10 } },
        form: getFieldDecorator('note', {
          initialValue: undefined,
          rules: [{ required: true, message: '请输入注销原因及说明' }],
        })(
          <TextArea rows={4} placeholder="请输入注销原因及说明" />,
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
    );

    return (
      <CoreContent title="注销银行账户信息">
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
        form={form}
        pageType={404}
        flowId={query.flow_id}
        setFlowId={setFlowId}
        orderId={orderId}
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


const mapStateToProps = ({ business: { accountSelectInfo } }) => {
  return { accountSelectInfo };
};

export default connect(mapStateToProps)(Form.create()(CancellationBankCreate));
