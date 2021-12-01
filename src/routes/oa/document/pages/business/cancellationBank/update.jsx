/**
 * 财商类 - 注销银行账户申请 - 编辑
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { BusinesBankAccountType } from '../../../../../../application/define';
import { utils } from '../../../../../../application';
import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import { PageCompanySelect, PageAccountTypeSelect } from '../common/index';
import ExamineFlow from '../../../components/form/flow';

const { TextArea } = Input;

function CancellationBankUpdate(props) {
  const { dispatch, form, businessBankDetail, companySelectInfo, accountSelectInfo, query,
    examineFlowInfo = [] } = props;
  const [companyName, setCompanyName] = useState(undefined);
  const [accountId, setAccountId] = useState(undefined);
  const flag = query.id;
  let companyInfo = {}; // 公司想信息
  // 根据id判断
  const companyId = companyName ? companyName : dot.get(businessBankDetail, 'firm_info._id', undefined);
  // 根据公司数据筛选出相对应的开户银行等数据
  dot.get(companySelectInfo, 'data', []).map((contract) => {
    if (contract._id === companyId) {
      companyInfo = contract;
      return companyInfo;
    }
  });
  // 当开户银行及支行只有一条选项时默认选中
  useEffect(() => {
    const { setFieldsValue } = form;
    if (accountSelectInfo.data && accountSelectInfo.data.length === 1) {
      setFieldsValue({ account: accountSelectInfo.data[0]._id });
      onAccountTypeSelect(accountSelectInfo.data[0]._id);
    }
    if (companyName === undefined && dot.get(businessBankDetail, 'bank_account_info._id')) {
      setFieldsValue({ account: dot.get(businessBankDetail, 'bank_account_info._id') });
    }
    if ((accountSelectInfo.data && accountSelectInfo.data.length === 0) || (!accountSelectInfo.data)) {
      setFieldsValue({ account: undefined });
    }
  }, [accountSelectInfo]);

  // 接口请求
  useEffect(() => {
    const payload = {
      id: query.id,
    };
    // 请求接口
    dispatch({ type: 'business/fetchBusinessBankOrderDetail', payload });
  }, [dispatch, query.id]);

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
      const payload = {
        id: query.id,
        ...values,
        ...params,
        flag,
        orderType: 20,
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

  // 更改公司名称
  const onCompanySelect = (value) => {
    const { setFieldsValue } = form;
    if (accountSelectInfo.data && accountSelectInfo.data.length > 1) {
      setFieldsValue({ account: undefined });
    }
    setCompanyName(value);
  };

  // 更改账户
  const onAccountTypeSelect = (value) => {
    setAccountId(value);
  };

  // 渲染表单
  const renderFrom = function () {
    const { getFieldDecorator, getFieldValue } = form;
    let accountInfo = {}; // 账户信息
    // 根据开户数据筛选出相对应的账户类型，账号的数据
    const accountIds = accountId ? accountId : dot.get(businessBankDetail, 'bank_account_info._id', undefined);
    dot.get(accountSelectInfo, 'data', []).map((contract) => {
      if (contract._id === accountIds) {
        accountInfo = contract;
        return accountInfo;
      }
    });
    const formItems = [
      {
        label: '公司名称',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('companyName', {
          initialValue: dot.get(businessBankDetail, 'firm_info._id', undefined),
          rules: [{ required: true, message: '请选择公司名称' }],
        })(
          <PageCompanySelect
            onChange={onCompanySelect}
            otherChild={utils.dotOptimal(businessBankDetail, 'firm_info', {})}
            placeholder="请选择公司名称"
          />,
        ),
      },
    ];
    formItems.push(
      {
        label: '银行账号',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('account', {
          initialValue: dot.get(businessBankDetail, 'bank_account_info._id', undefined),
          rules: [{ required: true, message: '请选择银行账号' }],
        })(
          <PageAccountTypeSelect onChange={onAccountTypeSelect} companyId={getFieldValue('companyName')} placeholder="请选择银行账号" />,
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
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('note', {
          initialValue: dot.get(businessBankDetail, 'note', undefined),
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
          initialValue: PageUpload.getInitialValue(businessBankDetail, 'asset_infos'),
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


const mapStateToProps = ({ business: { businessBankDetail, companySelectInfo, accountSelectInfo },
  oaCommon: { examineFlowInfo },
}) => {
  return {
    businessBankDetail,
    companySelectInfo,
    accountSelectInfo,
    examineFlowInfo,
  };
};

export default connect(mapStateToProps)(Form.create()(CancellationBankUpdate));
