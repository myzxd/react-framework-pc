/**
 * 人事类 - 合同续签 - 创建
 */
import React, { useEffect, useState } from 'react';
import { Input, Form, message } from 'antd';
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import is from 'is_js';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import {
  CommonSelectContractCycle,
  CommonSelectCompanies,
  CommonSelectDepartmentEmployees,
  CommonModalCopyGive,
} from '../../../../../../components/common';
import {
  PageUpload,
  PageFormButtons,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
  ComponentRenderFlowNames,
} from '../../../components';
import {
  showPlainText,
  showDate,
  showDateAfter,
  dotOptimal,
} from '../../../../../../application/utils';
import ExamineFlow from '../../../components/form/flow';
import {
  ApprovalDefaultParams,
  ThirdCompanyState,
} from '../../../../../../application/define';
// 表单布局
const FormLayout = { labelCol: { span: 9 }, wrapperCol: { span: 15 } };

function RenewCreate({ query = {}, create, update, submitOrder, examineFlowInfo = [], relation }) {
  const {
    department_id: departmentId, // 部门ID
    department_name: departmentName, // 部门名称
    post_id: postId, // 岗位ID
    post_name: postName, // 岗位名称
    rank_name: rankName, // 职级
    flow_id: flowId, // 审批流ID
  } = query;

  // form的ref
  const [form] = Form.useForm();
  // 没有部门id或岗位id，报错
  useEffect(() => {
    if (!departmentId || !postId) {
      message.error('需提前选择部门和岗位');
    }
  }, [departmentId, postId]);

  // 当前选中人的信息
  const [currentJobInfo, setCurrentJobInfo] = useState({});
  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 实际申请人id
  const [employeeId, setEmployeeId] = useState();
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);


  // 续签人员变化回调
  const onChangeEmployee = (val, option) => {
    if (option && option.payload) {
      setCurrentJobInfo(option.payload);
      form.setFieldsValue({
        newPartA: dot.get(option.payload, 'contract_belong_info._id', undefined),
      });
    } else {
      setCurrentJobInfo({});
      form.setFieldsValue({ newPartA: undefined });
    }
    setEmployeeId(val);
  };

  // 基本信息
  const employeeInfoFormItems = [
    {
      key: '1',
      cols: 3,
      items: [
        <Form.Item
          label="续签人员"
          name="renewName"
          rules={[{ required: true, message: '请选择' }]}
        >
          <CommonSelectDepartmentEmployees
            departmentId={departmentId}
            postId={postId}
            onChange={onChangeEmployee}
            isCurrentDepartment
          />
        </Form.Item>,
      ],
    },
    {
      key: '2',
      cols: 3,
      items: [
        <Form.Item label="所在部门">{departmentName || '--'}</Form.Item>,
        <Form.Item label="岗位">{postName || '--'}</Form.Item>,
        <Form.Item label="职级">{rankName || '--'}</Form.Item>,
      ],
    },
    {
      key: '3',
      cols: 3,
      items: [
        <Form.Item label="入职日期">{showDate(currentJobInfo, 'entry_date')}</Form.Item>,
      ],
    },
  ];

  // 合同信息
  const contractInfoFormItems = [
    {
      key: '1',
      cols: 3,
      items: [
        <Form.Item label="现行合同开始时间">
          {showDate(currentJobInfo, 'signed_date')}
        </Form.Item>,
        <Form.Item label="现行合同结束时间">
          {showDate(currentJobInfo, 'expired_date')}
        </Form.Item>,
        <Form.Item label="现行合同甲方">
          {showPlainText(currentJobInfo, 'contract_belong_info.name')}
        </Form.Item>,
        <Form.Item label="新合同开始时间">
          {showDateAfter(currentJobInfo, 'expired_date')}
        </Form.Item>,
        <Form.Item
          label="新合同期限"
          name="newContractCycle"
          rules={[{ required: true, message: '请选择' }]}
        >
          <CommonSelectContractCycle />
        </Form.Item>,
        <Form.Item
          label="新合同结束时间"
          shouldUpdate={
            (prevValues, curValues) => prevValues.newContractCycle !== curValues.newContractCycle
          }
        >
          {
            ({ getFieldValue }) => {
              const cycle = getFieldValue('newContractCycle');
              const signAt = currentJobInfo.expired_date;
              if (!cycle || !signAt) return '--';
              return moment(signAt, 'YYYYMMDD').add(cycle, 'y')
                .format('YYYY-MM-DD');
            }
          }
        </Form.Item>,
        <Form.Item
          label="新合同甲方"
          name="newPartA"
          rules={[{ required: true, message: '请选择' }]}
        >
          <CommonSelectCompanies
            initialCompanies={dotOptimal(currentJobInfo, 'contract_belong_info', {})}
            isElectronicSign=""
            state={ThirdCompanyState.on}
            type={3}
          />
        </Form.Item>,
      ],
    },
    {
      key: '2',
      cols: 1,
      items: [
        <Form.Item
          name="note"
          label="备注"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 18 }}
        >
          <Input.TextArea />
        </Form.Item>,
      ],
    },
    {
      key: '3',
      cols: 1,
      items: [
        <Form.Item
          name="assets"
          label="上传附件"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 18 }}
        >
          <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
        </Form.Item>,
      ],
    },
  ];

  // 提交操作
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    form.validateFields().then(async (values) => {
      // 锁定按钮不可点击
      onLockHook();
      if (orderId) {
        await update({
          ...values,
          departmentId,
          postId,
          id: transacId, // 单据id
          entryDate: currentJobInfo.entry_date,
          signedDate: currentJobInfo.signed_date,
          expiredDate: currentJobInfo.expired_date,
          contractBelongId: (currentJobInfo.contract_belong_info || {})._id,
          onCreateSuccess: (id) => {
            const params = {
              id,
              values,
              oId: orderId,
              onDoneHook,
              onErrorCallback: onUnlockHook,
            };
            onCreateSuccess(params);
          },
          onErrorCallback: onUnlockHook,
        });
      } else {
        try {
          await create({
            ...values,
            flowId: flowVal,
            departmentId,
            postId,
            entryDate: currentJobInfo.entry_date,
            signedDate: currentJobInfo.signed_date,
            expiredDate: currentJobInfo.expired_date,
            contractBelongId: (currentJobInfo.contract_belong_info || {})._id,
            onCreateSuccess: (id) => {
              const params = {
                id,
                values,
                oId: id,
                onDoneHook,
                onErrorCallback: onUnlockHook,
              };
              onCreateSuccess(params);
            },
            onErrorCallback: onUnlockHook,
          });
        } catch (e) {
          onUnlockHook();
        }
      }
    });
  };

  // 审批单关联成功
  const onApprovalIsSuccess = (values, oId, onDoneHook, onErrorCallback) => {
    // 如果第二个参数不存在 就是保存操作 直接返回 否则是创建
    if (is.not.existy(values)) return;
    submitOrder({
      ...values,
      id: oId,
      // 判断是否是创建，创建提示提示语
      isOa: orderId ? false : true,
      onSuccessCallback: onDoneHook,
      onErrorCallback,
    });
  };
  // 创建成功后调用关联审批单接口
  const onCreateSuccess = ({ id, values, oId, onDoneHook, onErrorCallback }) => {
    // 如果没有点击关联审批或者是编辑页面 不请求 关联接口
    if (is.empty(parentIds)) {
      // 如果values存在 那就是直接提交并且没有填写关联的审批id 我们就直接创建 不需要走关联审批单接口
      if (values) {
        onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback);
      }
      return;
    }

    relation({
      id,
      ids: parentIds,        // 查询搜索后要关联的审批单id
      type: ApprovalDefaultParams.add, // 增加
      onApprovalIsSuccess: () => onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback),
      onErrorCallback,
    });
  };

  // 保存操作
  const onSave = ({ onSaveHook, onUnsaveHook }) => {
    form.validateFields().then(async (values) => {
      onSaveHook();
      const submitVal = {
        ...values,
        flowId: flowVal,
        departmentId,
        postId,
        id: transacId, // 单据id
        entryDate: currentJobInfo.entry_date,
        signedDate: currentJobInfo.signed_date,
        expiredDate: currentJobInfo.expired_date,
        contractBelongId: (currentJobInfo.contract_belong_info || {})._id,
        onCreateSuccess: (id) => {
          const params = {
            id,
            onErrorCallback: onUnsaveHook,
          };
          onCreateSuccess(params);
        },
        onErrorCallback: onUnsaveHook,
      };
      try {
        // 保存单据（update）
        const res = orderId ? await update({
          ...submitVal,
          // 创建单据（create）
        }) : await create({
          ...submitVal,
        });

        if (res) {
          onUnsaveHook();
          res._id && (setTransacId(res._id));
          res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
          return;
        } else {
          onUnsaveHook();
        }
      } catch (e) {
        // 解锁按钮
        onUnsaveHook();
      }
    });
  };

  // 抄送人
  const renderCopyGive = () => {
    const formItems = [
      <Form.Item
        label="抄送人"
        name="copyGive"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 20 }}
      >
        <CommonModalCopyGive flowId={flowVal} />
      </Form.Item>,
      <Form.Item
        label="固定抄送"
        labelCol={{ span: 3 }}
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
    <Form {...FormLayout} form={form}>
      <CoreContent title="流程预览" titleExt={renderFlowNames()}>
        {/* 渲染基本信息 */}
        <ExamineFlow
          isDetail
          departmentId={departmentId}
          accountId={employeeId}
          flowId={flowId}
          pageType={104}
          setFlowId={setFlowId}
          rank={rankName}
          specialAccountId={employeeId}
        />

        {/* 渲染关联审批组件 */}
        <ComponentRelatedApproval setParentIds={setParentIds} />


      </CoreContent>
      {/* 渲染续签人员信息 */}
      <CoreContent title="续签人员信息">
        {
          employeeInfoFormItems.map(({ key, cols, items }) => (
            <CoreForm key={key} cols={cols} items={items} />
          ))
        }
      </CoreContent>
      {/* 渲染合同信息 */}
      <CoreContent title="合同信息">
        {
          contractInfoFormItems.map(({ key, cols, items }) => (
            <CoreForm key={key} cols={cols} items={items} />
          ))
        }
      </CoreContent>
      {/* 渲染抄送 */}
      {renderCopyGive()}

      <PageFormButtons
        query={query}
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </Form>
  );
}

const mapStateToProps = ({ oaCommon: { examineFlowInfo } }) => ({
  examineFlowInfo, // 审批流列表
});

const mapDispatchToProps = dispatch => ({
  // 创建续签申请
  create: payload => dispatch({
    type: 'humanResource/createRenewOrder',
    payload,
  }),
  update: payload => dispatch({
    type: 'humanResource/updateRenewOrder',
    payload,
  }),
  submitOrder: payload => dispatch({
    type: 'oaCommon/submitOrder',
    payload,
  }),
  relation: payload => dispatch({
    type: 'humanResource/fetchApproval',
    payload,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RenewCreate);
