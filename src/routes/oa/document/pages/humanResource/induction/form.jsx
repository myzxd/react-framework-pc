/**
 * 人事类 - 入职申请 - 创建&编辑
 */
import dot from 'dot-prop';
import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Select } from 'antd';
import { connect } from 'dva';
import is from 'is_js';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { PageUpload, PageFormButtons, FixedCopyGiveDisplay, ComponentRelatedApproval, ComponentRenderFlowNames } from '../../../components/index';
import { Gender, ExpenseCostOrderBizType, ApprovalDefaultParams } from '../../../../../../application/define';
import ExamineFlow from '../../../components/form/flow';
import { authorize } from '../../../../../../application';

const { TextArea } = Input;
const { Option } = Select;

const FormLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

function InductionCreate({ dispatch, query = {}, inductionDetail, enumeratedValue = {}, examineFlowInfo = [] }) {
  // 是否是编辑
  const flag = query.id;
  const [form] = Form.useForm();
  // 审批单id
  const [orderId, setOrderId] = useState(flag);
  // 事务性单据id
  const [transacId, setTransacId] = useState(flag);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
// 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);


  useEffect(() => {
    if (query.id) {
      dispatch({
        type: 'humanResource/fetchInductionDetail',
        payload: {
          id: query.id,
        },
      });
    }
    dispatch({
      type: 'applicationCommon/getEnumeratedValue',
      payload: {
        enumeratedType: 'oaInductionApplyType',
        examineFlowBiz: ExpenseCostOrderBizType.transactional,
      },
    });
    return () => {
      dispatch({
        type: 'humanResource/reduceInductionDetail',
        payload: {},
      });
      dispatch({
        type: 'applicationCommon/resetEnumeratedValue',
        payload: {},
      });
    };
  }, [dispatch, query.id]);

  // 编辑时设置value值
  useEffect(() => {
    const formValues = {
      // 姓名
      name: dot.get(inductionDetail, 'name', undefined),
      // 性别
      gender: dot.get(inductionDetail, 'gender', undefined),
      // 入职方式
      enterPosition: {
        applyType: dot.get(inductionDetail, 'apply_type') ?
          `${dot.get(inductionDetail, 'apply_type')}` : undefined,
        otherType: dot.get(inductionDetail, 'other_type', undefined),
      },
      // 事由及说明
      note: dot.get(inductionDetail, 'note', undefined),
      // 附件
      fileList: PageUpload.getInitialValue(inductionDetail, 'asset_infos'),
    };
    form.setFieldsValue(formValues);
  }, [form, inductionDetail]);

  const { oaInductionApplyType: oaInductionApplyTypeEn = [] } = enumeratedValue;

  // 提交操作
  const onSubmit = (callbackObj) => {
    onSubmitTranOrder(
      'humanResource/updateInduction',
      {
        callback: onSubmitOrderRec,
        isNoMessage: false,
        onErrorCallback: callbackObj.onUnlockHook,
        onSuccessCallback: callbackObj.onDoneHook,
        onLockHook: callbackObj.onLockHook,
      },
    );
  };

  // 保存操作
  const onSave = (callbackObj) => {
    onSubmitTranOrder(
      'humanResource/updateInduction',
      {
        callback: (res) => {
          onSubmitTranRec(res, callbackObj.onUnsaveHook);
        },
        onErrorCallback: callbackObj.onUnsaveHook,
        onLockHook: callbackObj.onSaveHook,
      },
    );
  };

  // 保存操作（编辑页）
  const onUpdate = (callbackObj) => {
    onSubmitTranOrder(
      'humanResource/updateInduction',
      {
        callback: callbackObj.onDoneHook,
        onErrorCallback: callbackObj.onUnsaveHook,
        onLockHook: callbackObj.onSaveHook,
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
        isOa: (orderId || flag) ? false : true,
        onSuccessCallback: onDoneHook,
        onErrorCallback,
      },
    });
  };
  // 创建成功后调用关联审批单接口
  const onCreateSuccess = ({ id, values, oId, onDoneHook, onErrorCallback }) => {
    // 如果values存在 那就是直接提交并且没有填写关联的审批id 我们就直接创建 不需要走关联审批单接口
    if (is.empty(parentIds) || flag) {
      if (values) {
        onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback);
      }
      return;
    }
    // 如果关联审批存在 我们要走关联审批接口
    dispatch({
      type: 'humanResource/fetchApproval',
      payload: {
        id,
        ids: parentIds,        // 查询搜索后要关联的审批单id
        type: ApprovalDefaultParams.add, // 增加
        onApprovalIsSuccess: () => onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback),
        onErrorCallback,
      },
    });
  };


  // 提交事务性单据
  const onSubmitTranOrder = async (type, callbackObj) => {
    const formValues = await form.validateFields();
    if (callbackObj.onLockHook) {
      callbackObj.onLockHook();
    }
    const { enterPosition } = formValues;
    // 详情中部门id
    const detailDepId = dot.get(inductionDetail, 'employment_apply_department_info._id', undefined);
    // 详情中岗位id
    const detailPostId = dot.get(inductionDetail, 'employment_apply_job_info._id', undefined);

    dispatch({
      type,
      payload: {
        ...formValues,  // 单据参数
        ...enterPosition, // 入职类型
        isNoMessage: callbackObj.isNoMessage,
        flowId: (orderId || flag) ? undefined : flowVal,
        departmentId: flag ? detailDepId : query.department_id,
        postId: flag ? detailPostId : query.post_id,
        id: transacId, // 单据id
        flag: transacId ? transacId : flag,
        onSuccessCallback: res => callbackObj.callback(
          res,
          callbackObj.onSuccessCallback,
          callbackObj.onErrorCallback,
        ),
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
      id: res.oa_application_order_id,
      onErrorCallback,
    };
    onCreateSuccess(params);
  };

  // 提交审批单回调
  const onSubmitOrderRec = async (res, callback, onErrorCallback) => {
    const formValues = await form.validateFields();
    const params = {
      id: res.oa_application_order_id,
      values: formValues,
      oId: res.oa_application_order_id,
      onDoneHook: callback,
      onErrorCallback,
    };
    onCreateSuccess(params);
  };

  // 入司方式
  const onChangeenterPositionapplyType = () => {
    form.setFieldsValue({ enterPosition: { otherType: undefined } });
  };

  // 人员信息
  const renderPersonnelInformation = () => {
    const formItems = [
      <Form.Item
        label="姓名"
        name="name"
        rules={[{ required: true, message: '请输入姓名' }]}
      >
        <Input placeholder="请输入姓名" />
      </Form.Item>,
      <Form.Item
        label="性别"
        name="gender"
        rules={[{ required: true, message: '请选择' }]}
      >
        <Radio.Group>
          <Radio value={Gender.male}>{Gender.description(Gender.male)}</Radio>
          <Radio value={Gender.female}>{Gender.description(Gender.female)}</Radio>
        </Radio.Group>
      </Form.Item>,
      <Form.Item
        label="入职部门"
      >
        {flag ? dot.get(inductionDetail, 'employment_apply_department_info.name', '--') :
          dot.get(query, 'department_name', '--')}
      </Form.Item>,
      <Form.Item
        label="入职岗位"
      >
        {flag ? dot.get(inductionDetail, 'employment_apply_job_info.name', '--') : dot.get(query, 'post_name', '--')}
      </Form.Item>,
      <Form.Item
        label="入职职级"
      >
        {flag ? dot.get(inductionDetail, 'employment_apply_job_info.rank', '--') : dot.get(query, 'rank_name', '--')}
      </Form.Item>,
      <Form.Item
        label="入职类型"
        rules={[{ required: true, message: '请选择' }]}
        shouldUpdate={(prevValues, curValues) => prevValues.enterPosition !== curValues.enterPosition}
      >
        {({ getFieldValue }) => {
          const enterPosition = getFieldValue('enterPosition') || {};
          const applyType = enterPosition.applyType;
          return (<Input.Group compact>
            <Form.Item
              name={['enterPosition', 'applyType']}
              noStyle
              rules={[{ required: true, message: '请选择' }]}
            >
              <Select
                style={{ width: '50%' }}
                placeholder="请选择"
                onChange={onChangeenterPositionapplyType}
              >
                {
                  oaInductionApplyTypeEn.map((v) => {
                    return <Option key={v.value} value={`${v.value}`}>{v.name}</Option>;
                  })
                }
              </Select>
            </Form.Item>
            {
              applyType === '40' ? (
                <Form.Item
                  name={['enterPosition', 'otherType']}
                  noStyle
                  rules={[{ required: true, message: '请输入' }]}
                >
                  <Input
                    style={{
                      width: 'calc(50% - 10px)',
                      marginLeft: 10,
                    }}
                    placeholder="请输入"
                  />
                </Form.Item>
              ) : null
            }
          </Input.Group>);
        }}
      </Form.Item>,
      {
        span: 24,
        render: (
          <Form.Item
            label="备注"
            name="note"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            <TextArea rows={4} placeholder="请输入备注" />
          </Form.Item>
        ),
      },
    ];

    return (
      <CoreContent title="人员信息">
        <CoreForm items={formItems} cols={2} />
      </CoreContent>
    );
  };

  // 附件
  const renderPageUpload = () => {
    const formItems = [
      <Form.Item
        label="附件"
        name="fileList"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

  // 抄送人
  const renderCopyGive = () => {
    if (flag) return null;
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

  // 部门id
  const useDepartmentId = flag ?
    dot.get(inductionDetail, 'creator_department_info._id', undefined)
  : dot.get(query, 'department_id', undefined);

  // 人员id
  const useAccountId = flag ?
    dot.get(inductionDetail, 'creator_info._id', undefined)
  : authorize.account.id;

  // rank
  const useRank = flag ?
    dot.get(inductionDetail, 'job_info.rank', undefined)
  : dot.get(query, 'rank_name', undefined);


  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

  // 渲染关联审批组件
  const renderComponentRelatedApproval = () => {
    // 如果是创建页面显示 关联审批和主题标签
    // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
    if (flag) {
      return (<React.Fragment />);
    }
    return <ComponentRelatedApproval setParentIds={setParentIds} />;
  };

  return (
    <Form {...FormLayout} form={form}>
      <CoreContent title="流程预览" titleExt={renderFlowNames()}>
        <ExamineFlow
          departmentId={useDepartmentId}
          flowId={query.flow_id}
          isDetail
          accountId={useAccountId}
          pageType={109}
          specialDepartmentId={useDepartmentId}
          setFlowId={setFlowId}
          rank={useRank}
        />

        {/* 渲染关联审批组件 */}
        {renderComponentRelatedApproval()}

      </CoreContent>
      {/* 人员信息 */}
      {renderPersonnelInformation()}

      {/* 附件 */}
      {renderPageUpload()}

      {/* 渲染抄送 */}
      {renderCopyGive()}

      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={query}
        showUpdate={flag ? true : false}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        onSave={onSave}
      />
    </Form>
  );
}
const mapStateToProps = ({ humanResource: { inductionDetail }, applicationCommon: { enumeratedValue }, oaCommon: { examineFlowInfo } }) => {
  return {
    inductionDetail,
    enumeratedValue,
    examineFlowInfo, // 审批流列表
  };
};

export default connect(mapStateToProps)(InductionCreate);
