/**
 * 人事类 - 增编申请 - 创建/编辑
 */
import React, { useRef, useEffect, useState } from 'react';
import dot from 'dot-prop';
import moment from 'moment';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import is from 'is_js';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
} from 'antd';
import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive, CommonSelectDepartmentPost } from '../../../../../../components/common';
import {
  PageUpload,
  PageBaseInfo,
  PageFormButtons,
  DepartmentDisplay,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
  // OrganizationJobSelect,
} from '../../../components/index';
import { authorize } from '../../../../../../application';
import { ApprovalDefaultParams } from '../../../../../../application/define';

const { TextArea } = Input;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const textAreaLayout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 12,
  },
};
// 日期选择范围限制
const disabledDate = (current) => {
  // 创建日当日及以后
  return current && current < moment().endOf('day').subtract(1, 'days');
};

const AuthorizedStrengthForm = ({ query, authorizedStrengthDetail, departmentDetail, dispatch }) => {
  const [form] = Form.useForm();
  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);
  // 是否是编辑状态
  const isUpdate = useRef(Boolean(dot.get(query, 'id', false)));
  useEffect(() => {
    async function fetchDate() {
      if (isUpdate.current) {
        // 获取增编申请详情
        const res = await dispatch({
          type: 'humanResource/getAuthorizedStrengthDetail',
          payload: { id: query.id },
        });
        const {
          // department_id: initialDepartment = undefined,     // 部门id
          job_id: initialJob = undefined,                   // 岗位id
          work_address: initialAddress = '',                // 工作地点
          people_num: initialNumber = '',                   // 人数
          expect_entry_date: initialDate = null,            // 到职日期
          note: initialNote = '',                           // 增编原因
        } = res;
        // 设置表单值
        form.setFieldsValue({
          // department: initialDepartment,
          podepartmentJobRelationId: initialJob,
          address: initialAddress,
          number: initialNumber,
          endDate: initialDate && moment(`${initialDate}`),
          note: initialNote,
          uploadFiled: PageUpload.getInitialValue(res, 'asset_infos'), // 附件信息
        });
      }
    }
    fetchDate();
  }, []);

  // 设置表单默认值
  useEffect(() => {
    form.setFieldsValue({
      organizationNum: dot.get(departmentDetail, 'organization_num', ''),
      organizationCount: dot.get(departmentDetail, 'organization_count', ''),
    });
  }, [departmentDetail]);

  // 提交（创建）
  const onSubmit = async ({ onDoneHook, onLockHook, onUnlockHook }) => {
    const values = await form.validateFields();
    onLockHook();
    if (orderId) {
      // 表单单据已创建，先更新表单，再提交审批单
      await dispatch({
        type: 'humanResource/updateAuthorizedStrength',
        payload: {
          ...values,
          id: transacId,
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
        },
      });
    } else {
      // 先提交表单单据，再提交审批单
      await dispatch({
        type: 'humanResource/createAuthorizedStrength',
        payload: {
          ...values,
          flowId: flowVal,
          department: dot.get(query, 'department_id', ''),
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
        },
      });
    }
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
        isOa: orderId ? false : true,
        onSuccessCallback: onDoneHook,
        onErrorCallback,
      },
    });
  };
  // 创建成功后调用关联审批单接口
  const onCreateSuccess = ({ id, values, oId, onDoneHook, onErrorCallback }) => {
    // 如果没有点击关联审批或者是编辑页面 不请求 关联接口
    if ((is.empty(parentIds) || isUpdate.current)) {
      // 如果values存在 那就是直接提交并且没有填写关联的审批id 我们就直接创建 不需要走关联审批单接口
      if (values) {
        onApprovalIsSuccess(values, oId, onDoneHook, onErrorCallback);
      }
      return;
    }
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

  // 保存操作
  const onSave = async ({ onSaveHook, onUnsaveHook }) => {
    const values = await form.validateFields();
    onSaveHook();
    const res = orderId ? await dispatch({
      type: 'humanResource/updateAuthorizedStrength',
      payload: {
        ...values,
        id: transacId,
        onCreateSuccess: (id) => {
          const params = {
            id,
            onErrorCallback: onUnsaveHook,
          };
          onCreateSuccess(params);
        },
        onErrorCallback: onUnsaveHook,
      },
    }) : await dispatch({
      type: 'humanResource/createAuthorizedStrength',
      payload: {
        ...values,
        flowId: flowVal,
        department: dot.get(query, 'department_id', ''),
        onCreateSuccess: (id) => {
          const params = {
            id,
            onErrorCallback: onUnsaveHook,
          };
          onCreateSuccess(params);
        },
        onErrorCallback: onUnsaveHook,
      },
    });
    if (res) {
      res._id && (setTransacId(res._id));
      res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
      onUnsaveHook();
    }
  };

  // 提交（编辑）
  const onUpdate = async ({ onDoneHook, onLockHook, onUnlockHook }) => {
    const res = await form.validateFields();
    onLockHook();
    const isOk = await dispatch({
      type: 'humanResource/updateAuthorizedStrength',
      payload: {
        id: query.id,
        ...res,
        onCreateSuccess: (id) => {
          const params = {
            id,
            onErrorCallback: onUnlockHook,
          };
          onCreateSuccess(params);
        },
        onErrorCallback: onUnlockHook,
      },
    });
    if (isOk) {
      onDoneHook();
      // return message.success('保存成功');
    }
  };

  const renderAuthorizedDetail = () => {
    const formItems = [
      {
        col: 4,
        item: [
          <Form.Item
            key="department"
            label="招聘部门"
            rules={[{ required: true, message: '请选择' }]}
          >
            {
              isUpdate.current
              ? <span>{dot.get(authorizedStrengthDetail, 'department_info.name', '--')}</span>
              : <DepartmentDisplay departmentId={dot.get(query, 'department_id', '')} />
            }
          </Form.Item>,
          <Form.Item
            name="organizationNum"
            label="部门编制数"
          >
            {
              isUpdate.current
              ? <span>{dot.get(authorizedStrengthDetail, 'organization_num', '--')}</span>
              : <span>{dot.get(departmentDetail, 'organization_num', '--')}</span>
            }
          </Form.Item>,
          <Form.Item
            name="organizationCount"
            label="部门占编数"
          >
            {
              isUpdate.current
              ? <span>{dot.get(authorizedStrengthDetail, 'organization_count', '--')}</span>
              : <span>{dot.get(departmentDetail, 'organization_count', '--')}</span>
            }
          </Form.Item>,
        ],
      },
      {
        col: 4,
        item: [
          <Form.Item
            name="podepartmentJobRelationId"
            label="岗位名称"
            rules={[{ required: true, message: '请选择' }]}
          >
            <CommonSelectDepartmentPost
              showSearch
              optionFilterProp="children"
              placeholder="请选择"
              departmentId={isUpdate.current ? dot.get(authorizedStrengthDetail, 'department_info._id', '--') : dot.get(query, 'department_id', '')}
            />
          </Form.Item>,
          <Form.Item
            name="address"
            label="工作地"
          >
            <Input placeholder="请输入" />
          </Form.Item>,
          <Form.Item
            name="number"
            label="人数"
            rules={[{ required: true, message: '请输入' }]}
          >
            <InputNumber
              min={1}
              precision={0}
              placeholder="请输入"
            />
          </Form.Item>,
          <Form.Item
            name="endDate"
            label="期望到职日期"
            rules={[{ required: true, message: '请选择' }]}
          >
            <DatePicker
              showToday={false}
              placeholder="请选择"
              disabledDate={disabledDate}
            />
          </Form.Item>,
        ],
      },
      {
        col: 1,
        item: [
          <Form.Item
            name="note"
            label="增编原因"
            rules={[{ required: true, message: '请输入' }]}
            {...textAreaLayout}
          >
            <TextArea
              placeholder="1、请说明拟增编岗位，目前状况 2、请说明拟增编岗位，目前在岗员工的工作量情况（量化）3、请说明增编后的业绩目标，如部门无明确数据目标，则确认要完成的工作量（数据）"
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>,
        ],
      },
      {
        col: 1,
        item: [
          <Form.Item
            {...textAreaLayout}
            name="uploadFiled"
            label="上传附件"
          >
            <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
          </Form.Item>,
        ],
      },
    ];

    return (
      <React.Fragment>
        {
          formItems.map((cur, idx) => {
            return (
              <CoreForm key={idx} items={cur.item} cols={cur.col || 4} />
            );
          })
        }
      </React.Fragment>
    );
  };
  // 抄送人
  const renderCopyGive = () => {
    if (query.id) return null;
    const formItems = [
      <Form.Item
        label="抄送人"
        name="copyGive"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 20 }}
      >
        <CommonModalCopyGive flowId={flowVal} />
      </Form.Item>,
      <Form.Item
        label="固定抄送"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 20 }}
      >
        <FixedCopyGiveDisplay flowId={flowVal} />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };
  const detailTitle = <span>增编明细&emsp;<span style={{ color: '#ccc' }}>若岗位库中无申请增编岗位，请联系集团人力资源部</span></span>;

  // 部门id
  const useDepartmentId = isUpdate.current ?
    dot.get(authorizedStrengthDetail, 'creator_department_info._id', undefined)
  : dot.get(query, 'department_id', undefined);

  // 人员id
  const useAccountId = isUpdate.current ?
    dot.get(authorizedStrengthDetail, 'creator_info._id', undefined)
  : authorize.account.id;


  // 渲染关联审批组件
  const renderComponentRelatedApproval = () => {
     // 如果是创建页面显示 关联审批和主题标签
     // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
    if (dot.get(isUpdate, 'current') === true) {
      return (<React.Fragment />);
    }
    return <ComponentRelatedApproval setParentIds={setParentIds} />;
  };
  return (
    <Form form={form} {...layout}>
      {/* 渲染基础信息 */}
      <PageBaseInfo
        isDetail={isUpdate.current}
        detail={authorizedStrengthDetail}
        pageType={102}
        flowId={query.flow_id}
        isDepDetail
        isPostDetail
        form={form}
        setFlowId={setFlowId}
        departmentId={useDepartmentId}
        specialDepartmentId={useDepartmentId}
        accountId={useAccountId}
      />
      {/* 渲染关联审批组件 */}
      {renderComponentRelatedApproval()}

      <CoreContent title={detailTitle}>
        {/* 渲染编制概况 */}
        {renderAuthorizedDetail()}
      </CoreContent>
      {/* 渲染抄送 */}
      {renderCopyGive()}
      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={query}
        showUpdate={isUpdate.current}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        onSave={onSave}
      />
    </Form>
  );
};

AuthorizedStrengthForm.propTypes = {
  query: PropTypes.object,                    // 路由参数
  authorizedStrengthDetail: PropTypes.object, // 增编申请单详情数据
  departmentDetail: PropTypes.object,         // 部门详情数据
};
AuthorizedStrengthForm.defaultProps = {
  authorizedStrengthDetail: {},
  departmentDetail: {},
};

function mapStateToProps({ humanResource: { authorizedStrengthDetail }, department: { departmentDetail } }) {
  return { authorizedStrengthDetail, departmentDetail };
}

export default connect(mapStateToProps)(AuthorizedStrengthForm);
