/**
 * 行政类 - 奖惩通知申请 - 编辑 /Oa/Document/Pages/Administration/Reward/Update
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import is from 'is_js';
import React, {
  useState,
  useEffect,
} from 'react';
import {
  Input,
  Checkbox,
  Row,
  Col,
  InputNumber,
  Form,
} from 'antd';

import { utils } from '../../../../../../application';
import { PageUpload, PageFormButtons, ComponentRenderFlowNames } from '../../../components/index';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { AdministrationRewardWay, Unit } from '../../../../../../application/define';
import ExamineFlow from '../../../components/form/flow';

const UpdateRewardSeal = ({ dispatch, query, rewardDetail, examineFlowInfo = [] }) => {
  const [personState, setPersonState] = useState(null);
  const [form] = Form.useForm();
  // 记录多选框上一次的长度
  let CheckboxLength = 0;
  // 请求详情数据
  useEffect(() => {
    dispatch({ type: 'administration/fetchRewardDetail', payload: { id: query.id } });
    return () => { dispatch({ type: 'administration/resetRewardDetail' }); };
  }, [dispatch]);
  // 赋默认值
  useEffect(() => {
    const obj = {
      departmentName: dot.get(rewardDetail, 'creator_department_info.name', '--'),
      departmentId: dot.get(rewardDetail, 'creator_department_info._id', '--'),
      jobName: dot.get(rewardDetail, 'job_info.name', '--'),
      jobId: dot.get(rewardDetail, 'job_info._id', '--'),
    };
    setPersonState(obj);
  }, [rewardDetail._id]);

  // 提交（编辑）
  const onUpdate = async (callbackObj = {}) => {
    const { id } = query;
    const res = await form.validateFields();
    // 禁用提交按钮
    if (callbackObj.onLockHook) {
      callbackObj.onLockHook();
    }
    dispatch({
      type: 'administration/updateReward',
      payload: {
        id,
        ...res,
        departmentId: personState.departmentId,
        jobId: personState.jobId,
        onSuccessCallback: callbackObj.onDoneHook,
        onErrorCallback: callbackObj.onUnlockHook,
      },
    });
  };

  const { TextArea } = Input;
  // layout
  const formLayoutC3 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
  const formLayoutC1 = { labelCol: { span: 2 }, wrapperCol: { span: 14 } };
  // 互斥处理
  const onCheckboxChange = (valArr) => {
    // 奖励的集合
    const reward = [AdministrationRewardWay.praise, AdministrationRewardWay.money];
    // 惩罚的集合
    const punishment = [AdministrationRewardWay.warning, AdministrationRewardWay.fire, AdministrationRewardWay.fine];
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
  // 奖惩金额 初始值处理
  const initValueMoney = () => {
    if (is.existy(rewardDetail.money)) {
      return Unit.exchangePriceToYuan(rewardDetail.money);
    }
    return '';
  };

  // 渲染奖惩信息
  const renderSeal = () => {
    if (!rewardDetail._id) {
      return null;
    }
    const formItems = [
      <Form.Item
        label="员工姓名"
        {...formLayoutC3}
      >
        {dot.get(rewardDetail, 'order_employee_info.name', '--')}
      </Form.Item>,
      <Form.Item
        label="所属部门"
        {...formLayoutC3}
      >
        {dot.get(personState, 'departmentName', '--')}
      </Form.Item>,
      <Form.Item
        label="岗位"
        {...formLayoutC3}
      >
        {dot.get(personState, 'jobName', '--')}
      </Form.Item>,
      <Form.Item
        label="职级"
        {...formLayoutC3}
      >
        {dot.get(rewardDetail, 'job_info.rank', '--')}
      </Form.Item>,
    ];
    const formItems2 = [
      <Form.Item
        label="奖惩措施"
        name="rewardWay"
        rules={[{ required: true, message: '请选择奖惩措施' }]}
        initialValue={dot.get(rewardDetail, 'prize_opt', [])}
        {...formLayoutC1}
      >
        <Checkbox.Group style={{ width: '100%' }} onChange={onCheckboxChange}>
          <Row>
            <Col span={24}>
              {utils.transOptions(AdministrationRewardWay, Checkbox, { lineHeight: '32px', marginRight: '20px' })}
            </Col>
          </Row>
        </Checkbox.Group>
      </Form.Item>,
    ];
    const formItems3 = [
      <Form.Item
        label="奖惩金额"
        name="money"
        initialValue={initValueMoney()}
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
        initialValue={dot.get(rewardDetail, 'integral', undefined)}
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
        initialValue={dot.get(rewardDetail, 'note', undefined)}
        rules={[{ required: true, message: '奖惩原因' }]}
        {...formLayoutC1}
      >
        <TextArea rows={4} placeholder="请输入" />
      </Form.Item>,
      <Form.Item
        label="上传附件"
        name="fileList"
        initialValue={PageUpload.getInitialValue(rewardDetail, 'asset_infos')}
        {...formLayoutC1}
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
    ];
    return (
      <CoreContent title="奖惩信息">
        <CoreForm items={formItems} />
        <CoreForm items={formItems2} cols={1} />
        <CoreForm items={formItems3} />
        <CoreForm items={formItems4} cols={1} />
      </CoreContent>
    );
  };

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  return (
    <Form form={form}>
      {/* 审批信息 */}
      <CoreContent title="审批信息" titleExt={renderFlowNames()}>
        <ExamineFlow
          flowId={query.flow_id}
          isDetail
          departmentId={dot.get(rewardDetail, 'creator_department_info._id', undefined)}
          accountId={dot.get(rewardDetail, 'creator_info._id', undefined)}
        />
      </CoreContent>

      {/* 渲染奖惩信息 */}
      {renderSeal()}
      {/* 渲染底部按钮 */}
      <PageFormButtons
        query={query}
        onUpdate={onUpdate}
        showUpdate={query.id ? true : false}
      />
    </Form>
  );
};
function mapPropsToState({ administration: { rewardDetail }, oaCommon: { examineFlowInfo } }) {
  return { rewardDetail, examineFlowInfo };
}
export default connect(mapPropsToState)(UpdateRewardSeal);
