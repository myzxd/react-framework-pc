/**
 * 人事类 - 转正申请 - 创建/编辑
 **/
import is from 'is_js';
import _ from 'lodash';
import React, { useState, useRef, useEffect } from 'react';
import dot from 'dot-prop';
import { connect } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  DatePicker,
} from 'antd';

import { CoreContent, CoreForm } from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { showPlainText, showDate } from '../../../../../../application/utils';
import {
  PageFormButtons,
  PageUpload,
  FixedCopyGiveDisplay,
  ComponentRelatedApproval,
  ComponentRenderFlowNames,
} from '../../../components/index';
import { authorize } from '../../../../../../application';
import { ApprovalDefaultParams } from '../../../../../../application/define';
import DepartmentFlow from '../../../components/form/departmentFlow';
import PostFlow from '../../../components/form/postFlow';
import ExamineFlow from '../../../components/form/flow';
import { PagesHelper } from '../../../define';

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
    span: 3,
  },
  wrapperCol: {
    span: 10,
  },
};

const OfficialForm = ({
  query,
  officialDetail,
  departmentInformation,
  dispatch,
  accountDep = {},
  newOaExamineList = {},
  employeeDetail = {},
  examineFlowInfo = [], // 审批流列表
}) => {
  // 当前账户人员id
  const { staffProfileId } = authorize.account;
  const [form] = Form.useForm();
  // 是否为编辑页面
  const isUpdate = useRef(Boolean(dot.get(query, 'id', false)));
  // 当前人员转正申请信息
  const [currentJobInfo, setCurrentJobInfo] = useState({});
  // 部门表单id
  const [departmentFlowId, setDepartmentFlowId] = useState(undefined);
  // 岗位表单id
  const [rank, setRank] = useState(undefined);
  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 审批流id
  const [flowVal, setFlowId] = useState(query.flow_id);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);
  const showUpdate = Boolean(dot.get(query, 'id', false));
  const {
    is_self: isSelfStr,
  } = query;

  let isSelf = false; // 是否是本人提报
  if (isSelfStr === 'true') {
    isSelf = true;
  }

  useEffect(() => {
    async function fetchDate() {
      if (isUpdate.current) {
        // 获取转正申请详情
        const res = await dispatch({
          type: 'humanResource/getOfficialDetail',
          payload: { id: query.id },
        });
        // 根据转正人员自动带出字段展示
        setCurrentJobInfo({
          major_job_info: {
            name: showPlainText(res, 'job_info.name'),
            rank: showPlainText(res, 'job_info.rank'),
          },
          major_department_info: {
            name: showPlainText(res, 'department_info.name'),
          },
          entry_date: dot.get(res, 'entry_date'),
        });

        // 设置表单值
        form.setFieldsValue({
          officialDate: dot.get(res, 'apply_regular_date', undefined)      // 申请转正日期
                        ? moment(`${dot.get(res, 'apply_regular_date')}`)
                        : null,
          startDate: dot.get(res, 'entry_date', undefined),                // 入职日期
          work: dot.get(res, 'probation_work_content', ''),                // 试用期主要工作内容
          achievement: dot.get(res, 'probation_work_grade', ''),           // 试用期主要工作成绩
          fault: dot.get(res, 'probation_work_problem', ''),               // 试用期存在的问题
          opinion: dot.get(res, 'improve_vision', ''),                     // 改进设想
          uploadFiled: PageUpload.getInitialValue(res, 'asset_infos'),     // 附件信息
        });
      }
    }
    fetchDate();
  }, []);

  useEffect(() => {
    // 判断是否是详情，详情不需请求接口
    if (!isUpdate.current) {
      dispatch({ type: 'oaCommon/fetchDepartmentInformation', payload: {} });
    }
    return () => {
      dispatch({ type: 'oaCommon/reduceDepartmentInformation', payload: {} });
    };
  }, [dispatch, isUpdate.current]);

  useEffect(() => {
    if (showUpdate === false && isSelf) {
      dispatch({
        type: 'oaCommon/fetchEmployeeDetail',
        payload: { id: staffProfileId },
      });
    }
    return () => dispatch({ type: 'oaCommon/resetEmployeeDetail' });
  }, [dispatch, isSelf, showUpdate, staffProfileId]);

  useEffect(() => {
    if (isSelf && showUpdate === false && is.existy(employeeDetail) && is.not.empty(employeeDetail)
      && is.existy(accountDep) && is.not.empty(accountDep)
      && is.existy(newOaExamineList) && is.not.empty(newOaExamineList)) {
      // 当前人的主部门id
      const majorDepartmentId = dot.get(employeeDetail, 'major_department_info._id', undefined);
      // 主岗
      const majorJobRank = dot.get(employeeDetail, 'major_job_info.rank', undefined);
      const examineList = dot.get(newOaExamineList, 'data', []);
      // 过滤包含主部门的审批流
      const filterMajorDepartmentList = examineList.filter((item = {}) => {
        const arr = [...dot.get(item, 'applyDepartmentIds', []), ...dot.get(item, 'applyDepartmentSubIds', [])];
        const applyRanks = dot.get(item, 'applyRanks', []);
        // 判断部门集合是否包含主部门并且岗位集合为全部
        if (arr.includes(majorDepartmentId) && applyRanks[0] === 'all') {
          return true;
        }
        // 判断部门集合是否包含主部门并且岗位集合包含主岗
        return arr.includes(majorDepartmentId) && applyRanks.includes(majorJobRank);
      });
      // 判断主部门和主岗的审批流是否有数据
      if (is.existy(filterMajorDepartmentList) && is.not.empty(filterMajorDepartmentList)) {
        setDepartmentFlowId(majorDepartmentId);
        setRank(majorJobRank);
        form.setFieldsValue({
          department: majorDepartmentId,
          podepartmentJobRelationId: dot.get(employeeDetail, 'major_job_info._id', undefined),
        });
        return;
      }

      // 获取副部门数据，过滤主部门
      const deputyDepartmentList = dot.get(accountDep, 'postList', []).filter(item => dot.get(item, 'department_info._id', undefined) !== majorDepartmentId);
      // 副部门id集合
      const deputyDepartmentIds = deputyDepartmentList.map(item => dot.get(item, 'department_info._id', undefined));
      const examineItem = PagesHelper.pageCommonTerminateForEach(examineList, deputyDepartmentList, deputyDepartmentIds);
      if (is.existy(examineItem) && is.not.empty(examineItem)) {
        setDepartmentFlowId(examineItem.departmentId);
        setRank(examineItem.rank);
        form.setFieldsValue({
          department: examineItem.departmentId,
          podepartmentJobRelationId: examineItem.jobId,
        });
      }
    }
  }, [employeeDetail, isSelf, showUpdate, accountDep, newOaExamineList]);

  useEffect(() => {
    form.setFieldsValue({
      officialName: dot.get(departmentInformation, 'account_id', ''),
      // department: dot.get(departmentInformation, 'major_department_info._id', ''),
      // podepartmentJobRelationId: dot.get(departmentInformation, 'major_job_info._id', ''),
      startDate: dot.get(departmentInformation, 'entry_date', ''),
      officialDate: dot.get(departmentInformation, 'regular_date', undefined)
                    ? moment(`${dot.get(departmentInformation, 'regular_date')}`).subtract(1, 'days')
                    : null,
    });

    // 设置部门&岗位组件使用的id
    // setDepartmentFlowId(dot.get(departmentInformation, 'major_department_info._id', ''));
    // setRank(dot.get(departmentInformation, 'major_job_info.rank', ''));
  }, [departmentInformation]);

  // 人员所属所有部门及岗位
  useEffect(() => {
    if (!isUpdate.current) {
      dispatch({
        type: 'oaCommon/getEmployeeDepAndPostInfo',
        payload: { accountId: authorize.account.staffProfileId },
      });
    }
  }, []);

  // 日期选择范围限制
  const disabledDate = (current) => {
    const startDate = form.getFieldValue('startDate');
    // 小于入职日期的时间不可选
    return current && current < moment(`${startDate}`).endOf('day').subtract(1, 'days');
  };

  // 提交（创建）
  const onSubmit = async ({ onDoneHook, onLockHook, onUnlockHook }) => {
    const values = await form.validateFields();
    onLockHook();
    if (orderId) {
      await dispatch({
        type: 'humanResource/updateOfficial',
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
        type: 'humanResource/createOfficial',
        payload: {
          ...values,
          flowId: flowVal,
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
      type: 'humanResource/updateOfficial',
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
      type: 'humanResource/createOfficial',
      payload: {
        ...values,
        flowId: flowVal,
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
      return;
    }
    onUnsaveHook();
  };

  // 提交（编辑）
  const onUpdate = async ({ onDoneHook, onLockHook, onUnlockHook }) => {
    const res = await form.validateFields();
    onLockHook();
    const isOk = await dispatch({
      type: 'humanResource/updateOfficial',
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

  const renderInfo = () => {
    const examineList = dot.get(newOaExamineList, 'data', []);
    // 审批流部门id集合
    const filterDepartmentIds = examineList.map((item = {}) => {
      return [...dot.get(item, 'applyDepartmentIds', []), ...dot.get(item, 'applyDepartmentSubIds', [])];
    });
    // 将多维数组转为一维数组
    const departmentIds = _.flattenDeep(filterDepartmentIds);
    const formItem = [
      {
        item: [
          <Form.Item
            name="officialName"
            label="转正人员"
            // rules={[{ required: !isUpdate.current, message: '请选择' }]}
          >
            {
              isUpdate.current
              ? <span>{dot.get(officialDetail, 'order_employee_info.name', '--')}</span>
              : <span>{dot.get(departmentInformation, 'name', '--')}</span>
            }
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            name="department"
            label="部门"
            // rules={[{ required: !isUpdate.current, message: '请选择' }]}
          >
            {
              isUpdate.current
              ? <span>{showPlainText(currentJobInfo, 'major_department_info.name')}</span>
                : (<DepartmentFlow
                  examineFlowDepartmentIds={departmentIds}
                  setJobForm={() => form.setFieldsValue({ podepartmentJobRelationId: undefined })}
                  setDepartmentId={setDepartmentFlowId}
                  disabled={Boolean(orderId)}
                />)
            }
          </Form.Item>,
          <Form.Item
            name="podepartmentJobRelationId"
            label="岗位"
            // rules={[{ required: !isUpdate.current, message: '请选择' }]}
          >
            {
              isUpdate.current
              ? <span>{showPlainText(currentJobInfo, 'major_job_info.name')}</span>
                : (<PostFlow
                  departmentId={departmentFlowId}
                  setRank={setRank}
                  disabled={Boolean(orderId)}
                />)
            }
          </Form.Item>,
        ],
      },
      {
        item: [
          <Form.Item
            name="startDate"
            label="入职日期"
            // rules={[{ required: !isUpdate.current }]}
          >
            {
              isUpdate.current
              ? <span>{showDate(currentJobInfo, 'entry_date')}</span>
              : <span>{dot.get(departmentInformation, 'entry_date', '--')}</span>
            }
          </Form.Item>,
          <Form.Item
            name="officialDate"
            label="申请转正日期"
            rules={[{ required: true, message: '请选择' }]}
          >
            <DatePicker
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
            {...textAreaLayout}
            name="work"
            label="试用期主要工作内容"
          >
            <TextArea
              placeholder="请输入"
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
            name="achievement"
            label="试用期主要工作成绩"
          >
            <TextArea
              placeholder="请输入"
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
            name="fault"
            label="试用期存在的问题"
          >
            <TextArea
              placeholder="请输入"
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
            name="opinion"
            label="改进设想"
          >
            <TextArea
              placeholder="请输入"
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
          formItem.map((cur, idx) => {
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

  // 部门id
  const useDepartmentId = isUpdate.current ?
    dot.get(officialDetail, 'creator_department_info._id', undefined)
  : departmentFlowId;

  // 人员id
  const useAccountId = isUpdate.current ?
    dot.get(officialDetail, 'creator_info._id', undefined)
  : authorize.account.id;

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
        {/* 渲染基本信息 */}
        <ExamineFlow
          isSelf={isSelf}
          flowId={query.flow_id}
          isDetail={isUpdate.current}
          rank={rank}
          departmentId={useDepartmentId}
          pageType={103}
          setFlowId={setFlowId}
          accountId={useAccountId}
        />
      </CoreContent>

      {/* 渲染关联审批组件 */}
      {renderComponentRelatedApproval()}

      <CoreContent title="转正信息">
        {/* 渲染转正信息 */}
        {renderInfo()}
      </CoreContent>
      {/* 渲染抄送 */}
      {renderCopyGive()}
      {/* 渲染表单按钮 */}
      <PageFormButtons
        query={query}
        showUpdate={showUpdate}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        onSave={onSave}
      />
    </Form>
  );
};

OfficialForm.propTypes = {
  query: PropTypes.object,                 // 路由参数
  officialDetail: PropTypes.object,        // 转正申请单详情数据
  departmentInformation: PropTypes.object, // 部门信息
};
OfficialForm.defaultProps = {
  officialDetail: {},
  departmentInformation: {},
};

function mapStateToProps({ humanResource: { officialDetail },
  oaCommon: { employeeDetail, accountDep, departmentInformation, examineFlowInfo },
  expenseExamineFlow: { newOaExamineList } }) {
  return {
    officialDetail,
    departmentInformation,
    accountDep,
    newOaExamineList,
    employeeDetail,
    examineFlowInfo,
  };
}

export default connect(mapStateToProps)(OfficialForm);
