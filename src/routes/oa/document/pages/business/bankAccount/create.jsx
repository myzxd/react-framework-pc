/**
 * 财商类 - 银行开户 - 创建
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import {
  Input,
  Select,
  DatePicker,
  Checkbox,
  Row,
  Col,
} from 'antd';
import is from 'is_js';
import React, { useEffect, useState } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import {
  CommonModalCopyGive,
} from '../../../../../../components/common';
import {
  BusinesBankAccountType,
  SharedBankCurrency,
  SharedBankOnlineBankType,
  SharedBankOpenAccountInfoType,
  SharedBankAccountSystem,
  ApprovalDefaultParams,
} from '../../../../../../application/define';
import { PageFormButtons, PageUpload, FixedCopyGiveDisplay, ComponentRelatedApproval } from '../../../components/index';
import { PageCompanySelect } from '../common/index';
import BasisOrderForm from '../../../components/basisOrderForm';
import Employee from '../../../../../shared/component/employee';

const { Option } = Select;
const { TextArea } = Input;

function BankAccountCreate(props) {
  const { dispatch, form, query, bankOperator } = props;
  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 开户资料form value
  const [information, setInformation] = useState([]);

  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);

  // 网银
  const [onlineBanking, setOnlineBanking] = useState(SharedBankOnlineBankType.manage);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);
  // tagvalue
  const [themeTag, setThemeTag] = useState(undefined);

  // 接口请求
  useEffect(() => {
    const payload = {
      id: '',
    };
    // 请求接口
    dispatch({ type: 'business/fetchbusinessUpdateOwnerList', payload });
  }, [dispatch]);

  // 获取固定网银保管人，开户人
  useEffect(() => {
    dispatch({
      type: 'sharedBankAccount/getBankOperator',
      payload: {},
    });

    return () => dispatch({
      type: 'sharedBankAccount/resetBankOperator',
      payload: {},
    });
  }, [dispatch]);

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

  const validatorBankWay = (rule, value, callback) => {
    const reg = /^[\d_()]+$/;
    if ((value && reg.test(value)) || !value) {
      callback();
      return;
    }
    callback('银行联系方式须为数字,下划线或圆括号');
  };

  // 提交事务性单据
  const onSubmitTranOrder = async (type, callbackObj) => {
    const formValues = await form.validateFields();
    // 默认网银保管人
    const onlineApprovalId = dot.get(bankOperator, 'online_approval._id')
      ? [dot.get(bankOperator, 'online_approval._id')]
      : undefined;

    // 网银保管人
    // 经办网银：form中获取网银保管人
    // 审批网银：固定接口获取网银保管人
    const onlineCustodianEmployeeIds = onlineBanking === SharedBankOnlineBankType.approve
      ? onlineApprovalId
      : formValues.onlineBankCustodian;

    if (callbackObj.onLockHook) {
      callbackObj.onLockHook();
    }
    dispatch({
      type,
      payload: {
        ...formValues,  // 单据参数
        flowId: flowVal,
        themeTag,      // 主题标签内容
        id: transacId, // 单据id
        orderType: 10,
        onlineBankCustodian: onlineCustodianEmployeeIds, // 网银保管人
        openedId: dot.get(bankOperator, 'opened._id'), // 开户保管人（固定接口获取）
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

  // 渲染表单
  const renderFrom = function () {
    const { getFieldDecorator } = form;
    const formItems = [
      {
        label: '公司名称',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('companyName', {
          initialValue: undefined,
          rules: [{ required: true, message: '请选择公司名称' }],
        })(
          <PageCompanySelect placeholder="请选择公司名称" />,
        ),
      },
      {
        label: '账户类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('type', {
          initialValue: undefined,
          rules: [{ required: true, message: '请选择账户类型' }],
        })(
          <Select placeholder="请选择账户类型" style={{ width: '100%' }} >
            <Option value={BusinesBankAccountType.basic}>{BusinesBankAccountType.description(BusinesBankAccountType.basic)}</Option>
            <Option value={BusinesBankAccountType.general}>{BusinesBankAccountType.description(BusinesBankAccountType.general)}</Option>
            <Option value={BusinesBankAccountType.temporary}>{BusinesBankAccountType.description(BusinesBankAccountType.temporary)}</Option>
            <Option value={BusinesBankAccountType.special}>{BusinesBankAccountType.description(BusinesBankAccountType.special)}</Option>
            <Option value={BusinesBankAccountType.treasure}>{BusinesBankAccountType.description(BusinesBankAccountType.treasure)}</Option>
            <Option value={BusinesBankAccountType.dollar}>{BusinesBankAccountType.description(BusinesBankAccountType.dollar)}</Option>
          </Select>,
        ),
      },
      {
        label: '开户银行支行全称',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('branch', {
          initialValue: undefined,
          rules: [{ required: true, message: '请输入开户银行支行全称' }],
        })(
          <Input placeholder="请输入开户银行支行全称" />,
        ),
      },
      {
        label: '开户时间',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('date', {
          initialValue: undefined,
          rules: [{ required: false, message: '请选择开户时间' }],
        })(
          <DatePicker style={{ width: '100%' }} />,
        ),
      },
      {
        label: '币种',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('currency', {
          initialValue: undefined,
        })(
          <Select
            placeholder="请选择"
            allowClear
          >
            <Option value={SharedBankCurrency.rmb}>
              {SharedBankCurrency.description(SharedBankCurrency.rmb)}
            </Option>
            <Option value={SharedBankCurrency.dollar}>
              {SharedBankCurrency.description(SharedBankCurrency.dollar)}
            </Option>
            <Option value={SharedBankCurrency.hkdollar}>
              {SharedBankCurrency.description(SharedBankCurrency.hkdollar)}
            </Option>
            <Option value={SharedBankCurrency.other}>
              {SharedBankCurrency.description(SharedBankCurrency.other)}
            </Option>
          </Select>,
        ),
      },
      {
        label: '网银',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('onlineBank', {
          initialValue: undefined,
        })(
          <Select
            placeholder="请选择"
            allowClear
            onChange={val => setOnlineBanking(val)}
          >
            <Option value={SharedBankOnlineBankType.manage}>
              {SharedBankOnlineBankType.description(SharedBankOnlineBankType.manage)}
            </Option>
            <Option value={SharedBankOnlineBankType.approve}>
              {SharedBankOnlineBankType.description(SharedBankOnlineBankType.approve)}
            </Option>
          </Select>,
        ),
      },
      {
        label: '网银保管人',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: onlineBanking !== SharedBankOnlineBankType.approve ?
          getFieldDecorator('onlineBankCustodian', {
            initialValue: undefined,
          })(
            <Employee
              mode="multiple"
              showArrow
            />,
         ) : dot.get(bankOperator, 'online_approval.name', '--'),
      },
      {
        label: '银行联系人',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('contactPerson', {
          initialValue: undefined,
        })(
          <Input placeholder="请输入" />,
        ),
      },
      {
        label: '银行联系方式',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('contactPhone', {
          initialValue: undefined,
          rules: [{
            validator: validatorBankWay,
          }],
        })(
          <Input placeholder="请输入" />,
        ),
      },
      {
        label: '开户保管人',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: dot.get(bankOperator, 'opened.name', '--'),
      },
      {
        label: '账户体系',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('accountSystem', {
          initialValue: undefined,
        })(
          <Select
            placeholder="请选择"
            allowClear
          >
            <Option value={SharedBankAccountSystem.inside}>
              {SharedBankAccountSystem.description(SharedBankAccountSystem.inside)}
            </Option>
            <Option value={SharedBankAccountSystem.outside}>
              {SharedBankAccountSystem.description(SharedBankAccountSystem.outside)}
            </Option>
          </Select>,
        ),
      },
      {
        label: '开户资料',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 18 } },
        form: getFieldDecorator('openAccountInformation', {
          initialValue: undefined,
        })(
          <Checkbox.Group
            onChange={val => setInformation(val)}
            style={{ width: '100%' }}
          >
            <Row>
              <Col span={4}>
                <Checkbox
                  value={SharedBankOpenAccountInfoType.printCard}
                >
                  {SharedBankOpenAccountInfoType.description(SharedBankOpenAccountInfoType.printCard)}
                </Checkbox>
              </Col>
              <Col span={4}>
                <Checkbox
                  value={SharedBankOpenAccountInfoType.application}
                >
                  {SharedBankOpenAccountInfoType.description(SharedBankOpenAccountInfoType.application)}
                </Checkbox>
              </Col>
              <Col span={4}>
                <Checkbox
                  value={SharedBankOpenAccountInfoType.settlementCatd}
                >
                  {SharedBankOpenAccountInfoType.description(SharedBankOpenAccountInfoType.settlementCatd)}
                </Checkbox>
              </Col>
              <Col span={4}>
                <Checkbox
                  value={SharedBankOpenAccountInfoType.cipherLetter}
                >
                  {SharedBankOpenAccountInfoType.description(SharedBankOpenAccountInfoType.cipherLetter)}
                </Checkbox>
              </Col>
              <Col span={4}>
                <Checkbox
                  value={SharedBankOpenAccountInfoType.other}
                >
                  {SharedBankOpenAccountInfoType.description(SharedBankOpenAccountInfoType.other)}
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>,
        ),
      },
    ];

    // 开户资料说明
    information.includes(SharedBankOpenAccountInfoType.other) && (formItems[formItems.length] = {
      label: '开户资料说明',
      span: 24,
      layout: { labelCol: { span: 3 }, wrapperCol: { span: 10 } },
      form: getFieldDecorator('openAccountNote', {
        initialValue: undefined,
      })(
        <TextArea rows={4} placeholder="请输入" />,
      ),
    });

    formItems.push(
      {
        label: '申请原因及说明',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 10 } },
        form: getFieldDecorator('note', {
          initialValue: undefined,
          rules: [{ required: true, message: '请输入申请原因及说明' }],
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
        })(
          <PageUpload domain="oa_approval" />,
        ),
      },
    );
    return (
      <CoreContent title="银行开户信息">
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
      {/* 渲染基本信息 */}
      <BasisOrderForm
        is_self={query.is_self}
        form={form}
        pageType={403}
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


const mapStateToProps = ({
  business: { businessBankDetail },
  sharedBankAccount: { bankOperator },
}) => {
  return { businessBankDetail, bankOperator };
};

export default connect(mapStateToProps)(Form.create()(BankAccountCreate));
