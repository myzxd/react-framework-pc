/**
 * 财商类 - 资金调拨 - 创建
 */
import React, { useState, useEffect } from 'react';
import { InputNumber, Form, Input, Select, Button, Row, Col } from 'antd';
import { connect } from 'dva';
import dot from 'dot-prop';
import lodash from 'lodash';
import update from 'immutability-helper';
import is from 'is_js';

import {
  CoreContent,
  CoreForm,
} from '../../../../../../components/core';
import { CommonModalCopyGive } from '../../../../../../components/common';
import { PageFundTrasferCauseSelect, PageCompanySelect, PageAccountSelect } from '../common';
import { PageFormButtons, PageUpload, FixedCopyGiveDisplay, ComponentRelatedApproval, ComponentRenderFlowNames } from '../../../components';
import styles from './styles.less';
import { Unit, FundTransferOtherReasonEnum, ApprovalDefaultParams } from '../../../../../../application/define';
import ExamineFlow from '../../../components/form/flow';
import { authorize } from '../../../../../../application';

const FormLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;

// 调入/调出方最大个数
const MAX_ACCOUNT_COUNT = 6;
const pageType = 408;

function FundTransferCreate({ query = {},
  fetchExamineFlowsApplyFind,
  reduceExamineFlowsApplayFind,
  create,
  relation,
  updateForm,
  submitOrder,
  examineFlowInfo = [],
  examineApplayList = [] }) {
  const [form] = Form.useForm();
  // 审批单id
  const [orderId, setOrderId] = useState(undefined);
  // 审批流id
  const [flowId, setFlowId] = useState();
  // 事务性单据id
  const [transacId, setTransacId] = useState(undefined);
  // 查询搜索后要关联的审批单id
  const [parentIds, setParentIds] = useState([]);
  // tagvalue
  const [themeTag, setThemeTag] = useState(undefined);
  // 部门id
  const [departmentId, setDepartmentId] = useState();
  // 岗位id
  const [postId, setPostId] = useState();
  // 岗位id
  const [rank, setRank] = useState();

  // 部门列表,去重
  const departmentList = lodash.uniqBy(examineApplayList.map((v) => {
    return dot.get(v, 'department_info');
  }), '_id');
  const departmentItem = departmentList[0] || {};

  // 根据部门id过滤
  const filterPostList = examineApplayList.filter((v) => {
    return dot.get(v, 'department_info._id') === departmentId;
  });

  // 岗位列表
  const postList = filterPostList.map(v => dot.get(v, 'job_info'));

  useEffect(() => {
    const payload = {
      pageType,
    };
    fetchExamineFlowsApplyFind(payload);
    return () => {
      reduceExamineFlowsApplayFind();
    };
  }, [fetchExamineFlowsApplyFind, reduceExamineFlowsApplayFind]);
  useEffect(() => {
    // 部门第一项
    // const departmentItem = departmentList[0] || {};
    setDepartmentId(departmentItem._id);
  }, [departmentItem]);

  useEffect(() => {
    // 过滤部门对应的岗位
    const postItem = examineApplayList.filter(v => dot.get(v, 'department_info._id') === departmentId)[0] || {};
    setPostId(dot.get(postItem, 'job_info._id', undefined));
    setRank(dot.get(postItem, 'job_info.rank', undefined));
  }, [departmentId, examineApplayList]);

  // 部门
  const onChangeDepartment = (e) => {
    setDepartmentId(e);
    setPostId(undefined);
    setRank(undefined);
  };

  // 岗位
  const onChangePost = (e, options = {}) => {
    setPostId(e);
    setRank(options.rank);
  };

  const renderFiles = () => (
    <Form.Item name="files">
      <PageUpload domain={PageUpload.UploadDomains.OAUploadDomain} />
    </Form.Item>
  );

  const renderProvider = () => {
    return (
      <CoreContent title="调出方">
        {renderFormList('provider')}
      </CoreContent>
    );
  };

  const renderReceiver = () => {
    return (
      <CoreContent title="调入方">
        {renderFormList('receiver')}
      </CoreContent>
    );
  };

  const onChangeCompany = (listName, listFieldName) => {
    // 清空账户
    form.setFieldsValue(update(
      form.getFieldsValue(),
      {
        [listName]: {
          [listFieldName]: {
            account: {
              $set: undefined,
            },
          },
        },
      },
    ));
  };

  const getDisabledAccounts = (getFieldValue) => {
    return (getFieldValue('provider') || []).concat(getFieldValue('receiver') || []).map(({ account }) => account);
  };

  const renderFormList = listName => (
    <Form.List name={listName}>
      {(fields, { add, remove }) => {
        const otherListName = listName === 'provider' ? 'receiver' : 'provider';
        return (
          <React.Fragment>
            <Row gutter={[12, 12]}>
              {fields.map((field, index) => (
                <Col key={field.name} span={8}>
                  <CoreForm
                    className={styles['form-list-item']}
                    items={[
                      <Form.Item
                        rules={[{ required: true, message: '请选择公司' }]}
                        label="公司"
                        name={[field.name, 'company']}
                        fieldKey={[field.fieldKey, 'company']}
                      >
                        <PageCompanySelect placeholder="请选择" allowClear onChange={() => onChangeCompany(listName, field.name)} />
                      </Form.Item>,
                      <Form.Item
                        key="account"
                        noStyle
                        shouldUpdate
                      >
                        {
                          ({ getFieldValue }) => {
                            return (
                              <Form.Item
                                rules={[{ required: true, message: '请选择账号' }]}
                                label="账号"
                                name={[field.name, 'account']}
                                fieldKey={[field.fieldKey, 'account']}
                              >
                                <PageAccountSelect
                                  firmId={getFieldValue([listName, field.name, 'company'])}
                                  disabledList={getDisabledAccounts(getFieldValue)}
                                  showAccountInfo
                                  allowClear
                                />
                              </Form.Item>
                            );
                          }
                        }
                      </Form.Item>,
                      <Form.Item
                        rules={[
                          { required: true, validator: (_, value) => ((value !== undefined && value > 0) ? Promise.resolve() : Promise.reject('请输入大于0的金额')) },
                        ]}
                        label="金额(元)"
                        name={[field.name, 'amount']}
                        fieldKey={[field.fieldKey, 'amount']}
                      >
                        <InputNumber
                          className={styles['amount-input']}
                          min={0}
                          precision={2}
                          max={Unit.maxMoney}
                          formatter={Unit.maxMoneyLimitDecimalsFormatter}
                          parser={Unit.limitDecimalsParser}
                        />
                      </Form.Item>,
                      <Form.Item
                        label="调拨事由"
                        rules={[{ required: true, message: '请选择调拨事由' }]}
                        name={[field.name, 'reason']}
                        fieldKey={[field.fieldKey, 'reason']}
                      >
                        <PageFundTrasferCauseSelect placeholder="请选择" />
                      </Form.Item>,
                      <Form.Item
                        noStyle
                        key="otherReason"
                        shouldUpdate={(prevValues, curValues) =>
                          dot.get(prevValues, `${listName}.${field.name}.reason`) !== dot.get(curValues, `${listName}.${field.name}.reason`)
                      }
                      >
                        {
                          ({ getFieldValue }) => (
                            getFieldValue([listName, field.name, 'reason']) === FundTransferOtherReasonEnum ?
                              <Form.Item
                                label="其他事由"
                                rules={[{ required: true, message: '请填写调拨事由' }]}
                                name={[field.name, 'otherReason']}
                                fieldKey={[field.fieldKey, 'reason']}
                              >
                                <Input />
                              </Form.Item> :
                              null
                          )
                        }
                      </Form.Item>,
                      <Form.Item
                        label="备注"
                        name={[field.name, 'note']}
                        fieldKey={[field.fieldKey, 'note']}
                      >
                        <Input.TextArea />
                      </Form.Item>,
                    ]}
                    cols={1}
                  />
                  {
                    index > 0 ?
                      <Button
                        className={styles['remove-btn']}
                        type="dashed"
                        onClick={() => remove(field.name)}
                      >
                      删除
                    </Button> :
                    null
                  }
                </Col>
            ))}
            </Row>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, curValues) => prevValues[otherListName].length !== curValues[otherListName].length}
            >
              {() => {
                let showAddBtn = false;
                if (fields.length < MAX_ACCOUNT_COUNT &&
                  (!form.getFieldValue(otherListName) || form.getFieldValue(otherListName).length < 2)) {
                  showAddBtn = true;
                }
                return showAddBtn ?
                  <Button onClick={add}>{ listName === 'provider' ? '添加调出方' : '添加调入方' }</Button> :
                  null;
              }}
            </Form.Item>
          </React.Fragment>
        );
      }}
    </Form.List>
  );

  // 提交操作
  const onSubmit = ({ onDoneHook, onLockHook, onUnlockHook }) => {
    form.validateFields().then(async (values) => {
      onLockHook();
      // 单据已创建（提报审批单）
      if (orderId) {
        await updateForm({
          ...values,
          flowId,
          id: transacId, // 单据id
          themeTag,      // 主题标签内容
          onCreateSuccess: (id) => {
            const params = {
              _id: id,
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
        // 审批单未创建（先创建提交单据，再提交审批单）
        try {
          await create({
            ...values,
            flowId,
            themeTag,
            departmentId,
            postId,
            onCreateSuccess: (id) => {
              const params = {
                _id: id,
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
    relation({
      id: _id,
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
      try {
        // 保存单据（update）
        const res = orderId ? await updateForm({
          ...values,
          flowId,
          id: transacId, // 单据id
          themeTag,
          onCreateSuccess: (id) => {
            const params = {
              _id: id,
              onErrorCallback: onUnsaveHook,
            };
            onCreateSuccess(params);
          },
          onErrorCallback: onUnsaveHook,
          // 创建单据（create）
        }) : await create({
          ...values,
          flowId,
          themeTag,
          departmentId,
          postId,
          onCreateSuccess: (id) => {
            const params = {
              _id: id,
              onErrorCallback: onUnsaveHook,
            };
            onCreateSuccess(params);
          },
          onErrorCallback: onUnsaveHook,
        });

        if (res) {
          onUnsaveHook();
          res._id && (setTransacId(res._id));
          res.oa_application_order_id && (setOrderId(res.oa_application_order_id));
        } else {
          onUnsaveHook();
        }
      } catch (e) {
        onUnsaveHook();
      }
    });
  };

  // 基本信息
  const renderBaseInfo = () => {
    const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
    const formItems = [
      <Form.Item label="申请人" {...layout}>
        {
          authorize.account.name
        }
      </Form.Item>,
      <Form.Item label="部门" {...layout}>
        <Select
          value={departmentId}
          placeholder="请选择"
          onChange={onChangeDepartment}
        >
          {
            departmentList.map((v) => {
              return <Option value={v._id} key={v._id}>{v.name}</Option>;
            })
          }
        </Select>
      </Form.Item>,
      <Form.Item label="岗位" {...layout}>
        <Select
          value={postId}
          placeholder="请选择"
          onChange={onChangePost}
        >
          {
            postList.map((v) => {
              return <Option value={v._id} rank={v.rank} key={v._id}>{v.name}</Option>;
            })
          }
        </Select>
      </Form.Item>,
      <Form.Item label="职级" {...layout}>
        {rank || '--'}
      </Form.Item>,
    ];

    return (
      <CoreContent title="基本信息">
        <CoreForm items={formItems} cols={4} />
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
        <CommonModalCopyGive flowId={flowId} />
      </Form.Item>,
      <Form.Item
        label="固定抄送"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <FixedCopyGiveDisplay flowId={flowId} />
      </Form.Item>,
    ];
    return (
      <CoreForm items={formItems} cols={1} />
    );
  };

    // 渲染主题标签
  const initialValues = { provider: [{}], receiver: [{}] };

  // 渲染 流程名称
  const renderFlowNames = () => {
    return <ComponentRenderFlowNames examineFlowInfo={examineFlowInfo} />;
  };
  return (
    <div className="fund-transfer-container">
      <CoreContent title="流程预览" titleExt={renderFlowNames()}>
        <ExamineFlow
          accountId={authorize.account.id}
          pageType={pageType}
          departmentId={departmentId}
          postId={postId}
          rank={rank}
          setFlowId={setFlowId}
        />
      </CoreContent>
      {/* 基本信息 */}
      {renderBaseInfo()}

      {
        // 如果是创建页面显示 关联审批和主题标签
        // 如果是编辑页面    不显示关联审批和主题标签 *编辑的时候 关联审批和主题标签在外层编辑
        <ComponentRelatedApproval setThemeTag={setThemeTag} setParentIds={setParentIds} />
         }
      <Form
        form={form}
        size="small"
        {...FormLayout}
        initialValues={initialValues}
      >

        {renderProvider()}
        {renderReceiver()}
        {renderFiles()}
        {/* 渲染抄送 */}
        {renderCopyGive()}
      </Form>
      <PageFormButtons
        query={query}
        onSubmit={onSubmit}
        onSave={onSave}
      />
    </div>
  );
}

const mapStateToProps = ({
  oaCommon: { examineFlowInfo },
  expenseExamineFlow: { examineApplayList },
}) => ({
  examineFlowInfo, // 审批流列表
  examineApplayList,
});
const mapDispatchToProps = dispatch => ({
  create: payload => dispatch({
    type: 'business/createFundTransfer',
    payload,
  }),
  updateForm: payload => dispatch({
    type: 'business/updateFundTransfer',
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
  fetchExamineFlowsApplyFind: payload => dispatch({
    type: 'expenseExamineFlow/fetchExamineFlowsApplyFind',
    payload,
  }),
  reduceExamineFlowsApplayFind: () => dispatch({
    type: 'expenseExamineFlow/reduceExamineFlowsApplayFind',
    payload: {},
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FundTransferCreate);
