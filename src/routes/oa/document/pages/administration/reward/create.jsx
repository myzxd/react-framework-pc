/**
 * 行政类 - 奖惩通知申请 - 新增 /Oa/Document/Pages/Administration/Reward/Create
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, {
  useState,
} from 'react';
import {
  Input,
  Checkbox,
  Row,
  Col,
  InputNumber,
  Form,
} from 'antd';
import is from 'is_js';

import KeepingSelect from '../components/keepingSelect';
import { utils, authorize } from '../../../../../../application';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { Unit, AdministrationRewardWay, ApprovalDefaultParams } from '../../../../../../application/define';
import ExamineFlow from '../../../components/form/flow';

import {
  PageFormButtons,
  PageUpload,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
  ComponentRenderFlowNames,
} from '../../../components/index';

const CreateRewardSeal = ({ query = {}, dispatch, examineFlowInfo = [] }) => {
  const { department_id, department_name, post_id, post_name, is_self: isSelf } = query;
  const [personState, setPersonState] = useState({
    major_department_info: {
      _id: department_id,
      name: department_name,
    },
    major_job_info: {
      _id: post_id,
      name: post_name,
    },
  });
  const { id, name } = authorize.account || {};

  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  const [accountId, setAccountId] = useState();
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);

  const [form] = Form.useForm();
  // 记录多选框上一次的长度
  let CheckboxLength = 0;

  const { TextArea } = Input;

  const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
  const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };

  // 提交操作
  const onSubmit = (callbackObj) => {
    const type = orderId ? 'administration/updateReward' : 'administration/createReward';
    onSubmitTranOrder(
      type,
      {
        callback: onSubmitOrderRec,
        onErrorCallback: callbackObj.onUnlockHook,
        onSuccessCallback: callbackObj.onDoneHook,
        onLockHook: callbackObj.onLockHook,
      },
    );
  };

  // 保存操作
  const onSave = (callbackObj) => {
    // 根据单据提交状态调用对应接口
    const type = orderId ?
      'administration/updateReward'
      : 'administration/createReward';

    onSubmitTranOrder(
      type,
      {
        callback: (res) => {
          onSubmitTranRec(res, callbackObj.onUnsaveHook);
          callbackObj.onUnsaveHook && callbackObj.onUnsaveHook();
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
        departmentId: department_id,
        jobId: post_id,
        applyMan: isSelf === 'true' ? id : formValues.applyMan,
        onSuccessCallback: res => callbackObj.callback(res,
          callbackObj.onSuccessCallback,
          callbackObj.onErrorCallback),
        onErrorCallback: callbackObj.onErrorCallback,
      },
    });
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

  // 改变申请人
  const onChangeKeeping = (val, obj) => {
    setPersonState(obj);
    setAccountId(val);
  };

  // 互斥处理
  const onCheckboxChange = (valArr) => {
    // 奖励的集合
    const reward = [AdministrationRewardWay.praise, AdministrationRewardWay.money];
    // 惩罚的集合
    const punishment = [
      AdministrationRewardWay.warning,
      AdministrationRewardWay.fire,
      AdministrationRewardWay.fine,
    ];
    if (valArr.length > CheckboxLength) {
      let flagArr = [];
      if (reward.indexOf(valArr[valArr.length - 1]) !== -1) {
        flagArr = valArr.filter(item => punishment.indexOf(item) === -1);
        form.setFieldsValue({
          rewardWay: flagArr,
        });
      }
      if (punishment.indexOf(valArr[valArr.length - 1]) !== -1) {
        flagArr = valArr.filter(item => reward.indexOf(item) === -1);
        form.setFieldsValue({
          rewardWay: flagArr,
        });
      }
      CheckboxLength = flagArr.length;
    }
    if (valArr.length < CheckboxLength) {
      CheckboxLength -= 1;
    }
  };

  // 渲染奖惩信息
  const renderSeal = () => {
    const { post_id: postId, department_id: departmentId, rank_name: rankName } = query;
    const formItems = [
      <Form.Item
        label="部门"
        {...formLayoutC3}
      >
        {dot.get(personState, 'major_department_info.name', '--')}
      </Form.Item>,
      <Form.Item
        label="岗位"
        {...formLayoutC3}
      >
        {dot.get(personState, 'major_job_info.name', '--')}
      </Form.Item>,
      <Form.Item
        label="职级"
        {...formLayoutC3}
      >
        {rankName || '--'}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="奖惩措施"
        name="rewardWay"
        rules={[{ required: true, message: '请选择奖惩措施' }]}
        {...formLayoutC1}
      >
        <Checkbox.Group style={{ width: '100%' }} onChange={onCheckboxChange}>
          <Row>
            <Col span={24}>
              {utils.transOptions(AdministrationRewardWay, Checkbox,
                { lineHeight: '32px', marginRight: '20px' })}
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>,
    ];
    const formItems3 = [
      <Form.Item
        label="奖惩金额"
        name="money"
        {...formLayoutC3}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          step={0.01}
          max={Unit.maxMoney}
          formatter={Unit.maxMoneyLimitDecimals}
          parser={Unit.limitDecimalsParser}
          placeholder="请输入"
        />
      </Form.Item>,
      <Form.Item
        label="奖惩积分"
        name="score"
        {...formLayoutC3}
      >
        <InputNumber
          style={{ width: '100%' }}
          max={Unit.maxMoney}
          formatter={(e) => {
            // 判断是否大于最大值
            if (e > Unit.maxMoney) {
              return Unit.maxMoney;
            }
            return e;
          }}
          placeholder="请输入"
        />
      </Form.Item>,
    ];
    const formItems4 = [
      <Form.Item
        label="奖惩原因"
        name="reason"
        rules={[{ required: true, message: '奖惩原因' }]}
        {...formLayoutC1}
      >
        <TextArea rows={4} placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="上传附件"
        name="fileList"
        {...formLayoutC1}
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
    ];
    if (isSelf === 'true') {
      formItems.unshift(<Form.Item
        label="员工姓名"
        {...formLayoutC3}
      >
        {name}
      </Form.Item>);
    }
    if (isSelf === 'false') {
      formItems.unshift(
        <Form.Item
          label="员工姓名"
          name="applyMan"
          rules={[{ required: true, message: '请选择员工' }]}
          {...formLayoutC3}
        >
          <KeepingSelect
            onChange={onChangeKeeping}
            postId={postId}
            departmentId={departmentId}
          />
        </Form.Item>,
      );
    }
    return (
      <CoreContent title="奖惩信息">
        <CoreForm items={formItems} />
        <CoreForm items={formItems2} cols={1} />
        <CoreForm items={formItems3} />
        <CoreForm items={formItems4} cols={1} />
      </CoreContent>
    );
  };
  // 抄送人
  const renderCopyGive = () => {
    const formItems = [
      <Form.Item
        label="抄送人"
        name="copyGive"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <CommonModalCopyGive flowId={flowVal} />
      </Form.Item>,
      <Form.Item
        label="固定抄送"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <FixedCopyGiveDisplay flowId={flowVal} />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };


  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <Form form={form}>
      <CoreContent title="流程预览" titleExt={renderFlowNames()}>
        <ExamineFlow
          accountId={accountId}
          departmentId={dot.get(query, 'department_id', undefined)}
          flowId={query.flow_id}
          pageType={308}
          setFlowId={setFlowId}
          rank={dot.get(query, 'rank_name', undefined)}
        />
      </CoreContent>
      {/* 渲染关联审批组件 */}
      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval setParentIds={setParentIds} />
         }
      {renderSeal()}
      {/* 渲染抄送 */}
      {renderCopyGive()}
      {/* 渲染底部按钮 */}
      <PageFormButtons
        query={query}
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </Form>
  );
};

const mapStateToProps = ({ oaCommon: { examineFlowInfo } }) => ({
  examineFlowInfo, // 审批流列表
});
export default connect(mapStateToProps)(CreateRewardSeal);
