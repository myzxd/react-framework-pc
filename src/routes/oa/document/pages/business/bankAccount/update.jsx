/**
 * 财商类 - 银行开户 - 编辑
 */
import dot from 'dot-prop';
import moment from 'moment';
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
import React, { useEffect, useState } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import {
  BusinesBankAccountType,
  SharedBankCurrency,
  SharedBankOnlineBankType,
  SharedBankOpenAccountInfoType,
  SharedBankAccountSystem,
} from '../../../../../../application/define';
import { utils } from '../../../../../../application';
import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import { PageCompanySelect } from '../common/index';
import ExamineFlow from '../../../components/form/flow';
import Employee from '../../../../../shared/component/employee';

const { Option } = Select;
const { TextArea } = Input;

function BankAccountUpdate(props) {
  const { dispatch, form, businessBankDetail, query, bankOperator,
    examineFlowInfo = [] } = props;
  const flag = query.id;
  // 开户资料form value
  const [information, setInformation] = useState([]);
  // 网银
  const [onlineBanking, setOnlineBanking] = useState(SharedBankOnlineBankType.manage);

  // 接口请求
  useEffect(() => {
    const payload = {
      id: query.id,
    };
    // 请求接口
    dispatch({ type: 'business/fetchBusinessBankOrderDetail', payload });
  }, [dispatch, query.id]);

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

  // 更新网银类型
  useEffect(() => {
    if (businessBankDetail && Object.keys(businessBankDetail).length > 0) {
      setOnlineBanking(dot.get(businessBankDetail, 'online_banking', undefined));
      setInformation(dot.get(businessBankDetail, 'opened_data', []));
    }
  }, [businessBankDetail]);

  // 提交单据到服务器
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    onFinish({
      onSuccessCallback: onDoneHook,
      onErrorCallback: onUnlockHook,
      onLockHook,
    });
  };

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

      // 默认网银保管人
      const onlineApprovalId = dot.get(bankOperator, 'online_approval._id')
        ? [dot.get(bankOperator, 'online_approval._id')]
        : undefined;

      // 网银保管人
      // 经办网银：form中获取网银保管人
      // 审批网银：固定接口获取网银保管人
      const onlineCustodianEmployeeIds = onlineBanking === SharedBankOnlineBankType.approve
        ? onlineApprovalId
        : values.onlineBankCustodian;

      const payload = {
        id: query.id,
        ...values,
        ...params,
        onlineBankCustodian: onlineCustodianEmployeeIds, // 网银保管人
        openedId: dot.get(bankOperator, 'opened._id'), // 开户保管人（固定接口获取）
        flag,
        orderType: 10,
      };
      dispatch({ type: 'business/updateBusinessBankOrder', payload });
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

  const validatorBankWay = (rule, value, callback) => {
    const reg = /^[\d_()]+$/;
    if ((value && reg.test(value)) || !value) {
      callback();
      return;
    }
    callback('银行联系方式须为数字,下划线或圆括号');
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
          initialValue: dot.get(businessBankDetail, 'firm_info._id', undefined),
          rules: [{ required: true, message: '请选择公司名称' }],
        })(
          <PageCompanySelect
            placeholder="请选择公司名称"
            otherChild={utils.dotOptimal(businessBankDetail, 'firm_info', {})}
          />,
        ),
      },
      {
        label: '账户类型',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('type', {
          initialValue: dot.get(businessBankDetail, 'bank_card_type', undefined),
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
    ];
    formItems.push(
      {
        label: '开户银行支行全称',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 10 } },
        form: getFieldDecorator('branch', {
          initialValue: dot.get(businessBankDetail, 'bank_and_branch', undefined),
          rules: [{ required: true, message: '请输入开户银行支行全称' }],
        })(
          <Input placeholder="请输入开户银行支行全称" />,
        ),
      },
      {
        label: '开户时间',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 10 } },
        form: getFieldDecorator('date', {
          initialValue: dot.get(businessBankDetail, 'bank_opened_date') ? moment(`${dot.get(businessBankDetail, 'bank_opened_date')}`) : undefined,
          rules: [{ required: false, message: '请选择开户时间' }],
        })(
          <DatePicker allowClear={false} style={{ width: '100%' }} />,
        ),
      },
      {
        label: '币种',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('currency', {
          initialValue: dot.get(businessBankDetail, 'currency', undefined),
        })(
          <Select
            placeholder="请选择"
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
          initialValue: dot.get(businessBankDetail, 'online_banking', undefined),
        })(
          <Select
            placeholder="请选择"
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
            initialValue: dot.get(businessBankDetail, 'online_custodian_employee_ids', []),
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
          initialValue: dot.get(businessBankDetail, 'bank_user_contact_name', undefined),
        })(
          <Input placeholder="请输入" />,
        ),
      },
      {
        label: '银行联系方式',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('contactPhone', {
          initialValue: dot.get(businessBankDetail, 'bank_user_contact_way', undefined),
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
          initialValue: dot.get(businessBankDetail, 'account_system', undefined),
        })(
          <Select
            placeholder="请选择"
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
          initialValue: dot.get(businessBankDetail, 'opened_data', []),
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
      {
        label: '申请原因及说明',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 10 } },
        form: getFieldDecorator('note', {
          initialValue: dot.get(businessBankDetail, 'note', undefined),
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
          initialValue: PageUpload.getInitialValue(businessBankDetail, 'asset_infos'),
        })(
          <PageUpload domain="oa_approval" />,
        ),
      },
    );

    // 开户资料说明
    information.includes(SharedBankOpenAccountInfoType.other) && (formItems.splice(-2, 0, {
      label: '开户资料说明',
      span: 24,
      layout: { labelCol: { span: 3 }, wrapperCol: { span: 10 } },
      form: getFieldDecorator('openAccountNote', {
        initialValue: dot.get(businessBankDetail, 'opened_data_desc', undefined),
      })(
        <TextArea rows={4} placeholder="请输入" />,
      ),
    }));

    return (
      <CoreContent title="银行开户申请表">
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
          departmentId={dot.get(businessBankDetail, 'creator_department_info._id', undefined)}
          accountId={dot.get(businessBankDetail, 'creator_info._id', undefined)}
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


const mapStateToProps = ({
  business: { businessBankDetail },
  sharedBankAccount: { bankOperator },
  oaCommon: { examineFlowInfo },
}) => {
  return { businessBankDetail, bankOperator, examineFlowInfo };
};

export default connect(mapStateToProps)(Form.create()(BankAccountUpdate));
