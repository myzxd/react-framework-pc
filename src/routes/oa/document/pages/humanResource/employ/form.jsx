/**
 * 人事类 - 录用申请 - 创建/编辑
 **/
import React, { useRef, useEffect, useState } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Radio,
} from 'antd';
import is from 'is_js';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { OAentrySource, ApprovalDefaultParams } from '../../../../../../application/define';
import {
  PageFormButtons,
  PageUpload,
  OrganizationJobSelect,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
  ComponentRenderFlowNames,
} from '../../../components/index';
import ExamineFlow from '../../../components/form/flow';
import { authorize } from '../../../../../../application';

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
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
  // 今天及以后可选
  return current && current < moment().endOf('day').subtract(1, 'days');
};

const EmployForm = ({ query, employDetail, dispatch, examineFlowInfo = [] }) => {
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
        // 获取录用申请详情
        const res = await dispatch({
          type: 'humanResource/getEmployDetail',
          payload: { id: query.id },
        });
        const {
          name,                                               // 入职人姓名
          // department_id: initialDepartment = undefined,       // 部门id
          // job_id: initialJob = undefined,                     // 岗位id
          directly_job_id: initialBoss = undefined,           // 直接上级
          manage_subordinate: initialSubordinate = '',        // 管理下属
          entry_date: initialDate = null,                     // 入职日期
          entry_source: initialEmployType = undefined,        // 聘用方式
          expect_graduate_date: initialGraduationTime = null, // 毕业时间
        } = res;
        // 设置表单值
        form.setFieldsValue({
          name,
          // department: initialDepartment,
          // podepartmentJobRelationId: initialJob,
          boss: initialBoss,
          subordinate: initialSubordinate,
          date: initialDate && moment(`${initialDate}`),
          trialDate: dot.get(res, 'probation_period', ''),             // 试用期（月）
          employType: initialEmployType,
          graduationTime: initialGraduationTime && moment(`${initialGraduationTime}`),
          uploadFiled: PageUpload.getInitialValue(res, 'asset_infos'), // 附件信息
        });
      }
    }
    fetchDate();
  }, []);

  // 提交（创建）
  const onSubmit = async ({ onDoneHook, onLockHook, onUnlockHook }) => {
    const values = await form.validateFields();
    onLockHook();
    if (orderId) {
      await dispatch({
        type: 'humanResource/updateEmploy',
        payload: {
          id: transacId,
          ...values,
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
      await dispatch({
        type: 'humanResource/createEmploy',
        payload: {
          ...values,
          flowId: flowVal,
          department: dot.get(query, 'department_id', ''),
          podepartmentJobRelationId: dot.get(query, 'post_id', ''),
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
    if (is.empty(parentIds || isUpdate.current)) {
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
      type: 'humanResource/updateEmploy',
      payload: {
        id: transacId,
        ...values,
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
      type: 'humanResource/createEmploy',
      payload: {
        ...values,
        flowId: flowVal,
        department: dot.get(query, 'department_id', ''),
        podepartmentJobRelationId: dot.get(query, 'post_id', ''),
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

    if (res && res._id) {
      setTransacId(res._id);
      setOrderId(res.oa_application_order_id);
      onUnsaveHook();
    }
  };

  // 提交（编辑）
  const onUpdate = async ({ onDoneHook, onLockHook, onUnlockHook }) => {
    const values = await form.validateFields();
    onLockHook();
    const res = await dispatch({
      type: 'humanResource/updateEmploy',
      payload: {
        id: query.id,
        ...values,
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
    if (res && res._id) {
      onDoneHook();
      // return message.success('保存成功');
    }
  };

  const renderInfo = () => {
    const formItems = [
      {
        item: [
          <Form.Item
            name="name"
            label="入职者姓名"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            key="department"
            label="录用部门"
          >
            {
              isUpdate.current
              ? <span>{dot.get(employDetail, 'department_info.name', '--')}</span>
              : <span>{dot.get(query, 'department_name', '--')}</span>
            }
          </Form.Item>,
          <Form.Item
            key="podepartmentJobRelationId"
            label="岗位"
          >
            {
              isUpdate.current
              ? <span>{dot.get(employDetail, 'job_info.name', '--')}</span>
              : <span>{dot.get(query, 'post_name', '--')}</span>
            }
          </Form.Item>,
          <Form.Item
            key="level"
            label="职级"
          >
            {
              isUpdate.current
              ? <span>{dot.get(employDetail, 'job_info.rank', '--')}</span>
              : <span>{dot.get(query, 'rank_name', '--')}</span>
            }
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            name="boss"
            label="直接上级"
            rules={[{ required: true, message: '请选择' }]}
          >
            <OrganizationJobSelect
              showSearch
              optionFilterProp="children"
              placeholder="请选择"
            />
          </Form.Item>,
          <Form.Item
            name="subordinate"
            label="管理下属"
          >
            <Input placeholder="请输入" />
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            key="salary"
            label="薪资"
          >
            以offer为准
          </Form.Item>,
          <Form.Item
            key="trialSalary"
            label="试用期薪资"
          >
            以offer为准
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            key="trafficAllowance"
            label="交通补助"
          >
            以offer为准
          </Form.Item>,
          <Form.Item
            key="newsletterAllowance"
            label="通讯补助"
          >
            以offer为准
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            name="date"
            label="入职日期"
            rules={[{ required: true, message: '请选择' }]}
          >
            <DatePicker
              placeholder="请选择"
              disabledDate={disabledDate}
            />
          </Form.Item>,
          <Form.Item
            label="试用期"
            required
          >
            <Form.Item
              noStyle
              name="trialDate"
              rules={[{ required: true, message: '请输入' }]}
            >
              <InputNumber
                min={0}
                precision={0}
                placeholder="请输入"
              />
            </Form.Item>
            <span>  个月</span>
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            name="employType"
            label="聘用方式"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Radio.Group>
              <Radio value={OAentrySource.official}>{OAentrySource.description(OAentrySource.official)}</Radio>
              <Radio value={OAentrySource.service}>{OAentrySource.description(OAentrySource.service)}</Radio>
              <Radio value={OAentrySource.intern}>{OAentrySource.description(OAentrySource.intern)}</Radio>
            </Radio.Group>
          </Form.Item>,
          <Form.Item
            noStyle
            key="graduationTimeNoStyle"
            shouldUpdate={(prevValues, curValues) => prevValues.employType !== curValues.employType}
          >
            {
              ({ getFieldValue }) => {
                return (
                  getFieldValue('employType') === OAentrySource.intern
                    ? <Form.Item
                      name="graduationTime"
                      label="毕业时间"
                      rules={[{ required: true, message: '请选择' }]}
                    >
                      <DatePicker
                        placeholder="请选择"
                        disabledDate={disabledDate}
                      />
                    </Form.Item>
                    : null
                );
              }
            }
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
            rules={[{ required: true, message: '请选择' }]}
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
              <CoreForm key={idx} items={cur.item} cols={cur.col || 3} />
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

  // 部门id
  const useDepartmentId = isUpdate.current ?
    dot.get(employDetail, 'creator_department_info._id', undefined)
  : dot.get(query, 'department_id', undefined);

  // 人员id
  const useAccountId = isUpdate.current ?
    dot.get(employDetail, 'creator_info._id', undefined)
    : authorize.account.id;
  // rank
  const useRank = isUpdate.current ?
    dot.get(employDetail, 'job_info.rank', undefined)
  : dot.get(query, 'rank_name', undefined);


  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };

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
    <Form
      form={form}
      {...layout}
    >
      <CoreContent title="流程预览" titleExt={renderFlowNames()}>
        {/* 渲染主题标签 */}
        <ExamineFlow
          isDetail={isUpdate.current}
          departmentId={useDepartmentId}
          accountId={useAccountId}
          flowId={query.flow_id}
          pageType={108}
          setFlowId={setFlowId}
          specialDepartmentId={useDepartmentId}
          rank={useRank}
        />
      </CoreContent>

      {/* 渲染关联审批组件 */}
      {renderComponentRelatedApproval()}
      <CoreContent title="入职信息">
        {/* 渲染入职信息 */}
        {renderInfo()}
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

EmployForm.propTypes = {
  query: PropTypes.object,        // 路由参数
  employDetail: PropTypes.object, // 录用申请单详情数据
};
EmployForm.defaultProps = {
  employDetail: {},
};

function mapStateToProps({
  humanResource: { employDetail },
  oaCommon: { examineFlowInfo },
}) {
  return { employDetail, examineFlowInfo };
}

export default connect(mapStateToProps)(EmployForm);
