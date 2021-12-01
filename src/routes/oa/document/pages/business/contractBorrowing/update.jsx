/**
 * 财商类 - 合同借阅 - 编辑
 */
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import { DatePicker, Input, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import { CoreContent, DeprecatedCoreForm } from '../../../../../../components/core';
import { utils } from '../../../../../../application';
import { OAContractBorrowingType } from '../../../../../../application/define';
import { PageFormButtons, PageUpload, ComponentRenderFlowNames } from '../../../components/index';
import ContractInfo from './component/contractInfo';
import ExamineFlow from '../../../components/form/flow';

const { TextArea } = Input;

function ContractBorrowingUpdate(props) {
  const { dispatch, form, businessBorrowDetail, query, examineFlowInfo = [] } = props;
  const flag = query.id;
  // 合同名称错误提示状态
  const [mState, setMState] = useState(false);

  // 接口请求
  useEffect(() => {
    const payload = {
      id: query.id,
    };
    // 请求接口
    dispatch({ type: 'business/fetchBusinessPactBorrowOrderDetail', payload });
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
      const contractInfo = values.contractInfo || [];
      console.log(contractInfo);
      // 合同报错
      if (contractInfo.length === 0 || (Array.isArray(contractInfo) &&
        contractInfo.some(item => !item))) {
        console.error('合同信息报错');
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
      dispatch({ type: 'business/updateBusinessPactBorrowOrder', payload });
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

  // 更改开始时间
  const onChangeStart = () => {
    const { setFieldsValue } = form;
    setFieldsValue({ expect: null });
  };

  // 限制结束时间
  const onDisabledEndDate = (endValue) => {
    const { getFieldValue } = form;
    const start = getFieldValue('date');
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
        form: dot.get(businessBorrowDetail, 'pact_borrow_type') ? OAContractBorrowingType.description(dot.get(businessBorrowDetail, 'pact_borrow_type')) : '--',
      },
      {
        label: '借阅份数',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('additional', {
          initialValue: dot.get(businessBorrowDetail, 'borrow_copies', undefined),
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
          initialValue: dot.get(businessBorrowDetail, 'from_date') ? moment(`${dot.get(businessBorrowDetail, 'from_date')}`) : undefined,
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
          initialValue: dot.get(businessBorrowDetail, 'expect_end_date') ? moment(`${dot.get(businessBorrowDetail, 'expect_end_date')}`) : undefined,
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
          initialValue: dot.get(businessBorrowDetail, 'cause', undefined),
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
          initialValue: dot.get(businessBorrowDetail, 'city_name', undefined),
          rules: [{ required: false, message: '请输入使用城市' }],
        })(
          <Input placeholder="请输入使用城市" />,
        ),
      },
      {
        label: '是否需要归还',
        span: 12,
        layout: { labelCol: { span: 6 }, wrapperCol: { span: 16 } },
        form: <span>{`${utils.showPlainText(businessBorrowDetail, 'pact_borrow_type', '')}` === `${OAContractBorrowingType.original}` ? '是' : '否'}</span>,
      },
      {
        label: '申请原因及说明',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 20 } },
        form: getFieldDecorator('note', {
          initialValue: dot.get(businessBorrowDetail, 'note', undefined),
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
          initialValue: utils.showPlainText(businessBorrowDetail, 'pact_list', [{}]).map(item => item._id || ''),
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
          <ContractInfo mState={mState} />,
        ),
      },
      {
        label: '上传附件',
        span: 24,
        layout: { labelCol: { span: 3 }, wrapperCol: { span: 16 } },
        form: getFieldDecorator('fileList', {
          initialValue: PageUpload.getInitialValue(businessBorrowDetail, 'asset_infos'),
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
          departmentId={dot.get(businessBorrowDetail, 'creator_department_info._id', undefined)}
          accountId={dot.get(businessBorrowDetail, 'creator_info._id', undefined)}
          specialAccountId={dot.get(businessBorrowDetail, 'pact_info.preserver_id', undefined)}
        />
      </CoreContent>

      {/* 渲染基础信息 */}
      {renderBasisnfo()}

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

const mapStateToProps = ({ business: { businessBorrowDetail, contractSelectInfo },
  oaCommon: { examineFlowInfo },
}) => {
  return { businessBorrowDetail, contractSelectInfo, examineFlowInfo };
};

export default connect(mapStateToProps)(Form.create()(ContractBorrowingUpdate));
