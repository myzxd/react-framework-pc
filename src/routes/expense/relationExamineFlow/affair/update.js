/*
* 关联审批流 - 事务类审批流编辑
*/
import is from 'is_js';
import dot from 'dot-prop';
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, message, Alert } from 'antd';
import { connect } from 'dva';

import { CoreContent, CoreForm } from '../../../../components/core';
import {
  RelationExamineFlowMerchantType,
  RelationExamineFlowTabType,
  ExpenseDepartmentSubtype,
  AffairsFlowHighestPostType,
  OaApplicationOrderType,
} from '../../../../application/define';
import {
  CommonSelectScene,
  CommonStampType,
} from '../../../../components/common';
import ExamineFlow from '../component/examineFlow';
import XDExamineFlow from '../component/xdExamineFlow';
import TypeForm from '../component/type';
import NodeList from './nodeList.jsx';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 17 } };
const bizType = RelationExamineFlowTabType.affair;
const bu3Merchant = RelationExamineFlowMerchantType.bu3;
const merchant = RelationExamineFlowMerchantType.quhuo;
const bu3Namespace = `${bizType}${RelationExamineFlowMerchantType.bu3}`;
const namespace = `${bizType}${RelationExamineFlowMerchantType.quhuo}`;

function Update(props) {
  const { dispatch, location: { query = {} }, examineFlowInfo = {}, contractTypeData = {} } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState();
  const noRepeatRef = useRef(true);
  useEffect(() => {
    dispatch({ type: 'business/fetchContractType', payload: {} });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'relationExamineFlow/fetchExamineFlowXDInfo',
      payload: {
        bizType,
        merchant: bu3Merchant,
        namespace: bu3Namespace,
        flowId: query.xdFlowId,
      },
    });
    dispatch({
      type: 'relationExamineFlow/fetchExamineFlowinfo',
      payload: {
        bizType,
        merchant,
        namespace,
        flowId: query.qhFlowId,
      },
    });
    return () => {
      dispatch({
        type: 'relationExamineFlow/reduceExamineFlowinfo',
        payload: {},
      });
    };
  }, [dispatch, query]);

  useEffect(() => {
    // 防止重复赋值
    if (noRepeatRef.current !== true) {
      return;
    }
    form.setFieldsValue({
      bu3ExamineFlow: dot.get(examineFlowInfo, `${bu3Namespace}._id`, undefined),
      examineFlow: dot.get(examineFlowInfo, `${namespace}._id`, undefined),
      applyApplicationType: dot.get(examineFlowInfo, `${namespace}.apply_application_types.0`, undefined),
    });
  }, [examineFlowInfo, form]);

  // bu3审批流
  const onChangeBu3ExamineFlow = (e) => {
    noRepeatRef.current = false;
    if (e) {
      dispatch({
        type: 'relationExamineFlow/fetchExamineFlowinfo',
        payload: {
          bizType,
          namespace: bu3Namespace,
          merchant: bu3Merchant,
          flowId: e,
        },
      });
    } else {
      dispatch({
        type: 'relationExamineFlow/reduceExamineFlowinfo',
        payload: {
          result: {},
          namespace: bu3Namespace,
        },
      });
    }
  };

  // 趣活
  const onChangeExamineFlow = (e) => {
    noRepeatRef.current = false;
    if (e) {
      dispatch({
        type: 'relationExamineFlow/fetchExamineFlowinfo',
        payload: {
          bizType,
          namespace,
          merchant,
          flowId: e,
        },
      });
    } else {
      dispatch({
        type: 'relationExamineFlow/reduceExamineFlowinfo',
        payload: {
          result: {},
          namespace,
        },
      });
    }
  };

  // 适用类型
  const onChangeApplyApplicationType = () => {
    noRepeatRef.current = false;
    dispatch({
      type: 'relationExamineFlow/reduceExamineFlowinfo',
      payload: {},
    });
    form.setFieldsValue({
      bu3ExamineFlow: undefined,
      examineFlow: undefined,
    });
  };

  // 成功回调
  const onSuccessCallback = () => {
    message.success('请求成功');
    window.location.href = `/#/Expense/RelationExamineFlow?activeKey=${bizType}`;
  };

  const onSubmit = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      const { bu3ExamineFlow, examineFlow } = values;
      const params = {
        xdFlowId: bu3ExamineFlow,
        qhFlowId: examineFlow,
        appWatchFlowId: query.appWatchFlowId,
        pluginId: query.pluginId,
        bizType,
        onLoading: () => {
          setLoading(false);
        },
        onSuccessCallback,
      };
      dispatch({ type: 'relationExamineFlow/updateRelationExamineFlow', payload: params });
    });
  };

      // 最高审批岗
  const renderJobTags = (detail = {}) => {
    const finalType = dot.get(detail, 'final_type', []); // 类型
    const finalApprovalJobs = dot.get(detail, 'final_approval_jobs', []); // 岗位
    const finalApprovalJobTags = dot.get(detail, 'final_approval_job_tags', []); // 标签
    let highestPost = '--';
            // 岗位
    if (Array.isArray(finalApprovalJobs) && finalApprovalJobs.length > 0) {
      highestPost = (
        <div>
          {AffairsFlowHighestPostType.description(finalType)}({finalApprovalJobs.join('、')})
          </div>
                );
    }
            // 标签
    if (Array.isArray(finalApprovalJobTags) && finalApprovalJobTags.length > 0) {
      highestPost = (
        <div>
          {AffairsFlowHighestPostType.description(finalType)}({finalApprovalJobTags.join('、')})
          </div>
                );
    }
    return highestPost;
  };

  // 类型
  const renderCommentType = (formItems, detail = {}) => {
    const {
      stamp_types: stampTypes = [],   // 会审类型
      seal_types: sealTypes = [], // 印章类型
      pact_borrow_types: pactBorrowTypes = [], // 合同借阅类型
      display_types: displayTypes = [], // 证照借用
      pact_apply_types: pactApplyTypes = [], // 合同类型
      pact_sub_types: pactSubTypes = [], // 合同子类型
      organization_sub_types: organizationSubTypes = [], // 调整子类型
    } = detail;
    const applyApplicationType = dot.get(detail, 'apply_application_types.0', undefined);
    const { pact_types_has_sub_types: data = [] } = contractTypeData;
    const contractTypeDataArray = [];
    const contractChildTypeDataArray = [];
    pactApplyTypes.map((item) => {
      const parentData = data[item] || {};
      contractTypeDataArray.push(parentData);
      const childData = parentData.sub_types || {};
      Object.keys(childData).map(() => {
        pactSubTypes.map((i) => {
          const childName = childData[i];
          if (is.existy(childName) && is.not.empty(childName)) {
            contractChildTypeDataArray.includes(childName) ? null : contractChildTypeDataArray.push(childName);
          }
        });
      });
    });
    // 用章申请 || 借章申请
    if (applyApplicationType === 303 || applyApplicationType === 309) {
      formItems.splice(2, 0, (
        <Form.Item
          label="印章类型"
          {...layout}
        >
          <TypeForm type="flowSealType" value={sealTypes} isDetail />
        </Form.Item>
      ));
    }

    // 证照借用
    if (applyApplicationType === 306) {
      formItems.splice(2, 0, (
        <Form.Item
          label="类型"
          {...layout}
        >
          <TypeForm type="license" value={displayTypes} isDetail />
        </Form.Item>
      ));
    }

    // 合同借阅
    if (applyApplicationType === 406) {
      formItems.splice(2, 0, (
        <Form.Item
          label="类型"
          {...layout}
        >
          <TypeForm type="contract" value={pactBorrowTypes} isDetail />
        </Form.Item>
      ));
    }

    // 合同会审类型
    if (applyApplicationType === 405) {
      formItems.splice(2, 0,
        <Form.Item
          label="会审类型"
          {...layout}
        >
          <CommonStampType
            isDetail
            showValue={stampTypes || stampTypes[0]}
          />
        </Form.Item>,
        <Form.Item
          label="合同类型"
          {...layout}
        >
          {
               is.empty(contractTypeDataArray) ? '--' : contractTypeDataArray.map((i, k) => {
                 if (contractTypeDataArray.length === k + 1) {
                   return i.name;
                 }
                 return `${i.name},`;
               },
               )
             }
        </Form.Item>,
        <Form.Item
          label="合同子类型"
          {...layout}
        >
          {
              is.empty(contractChildTypeDataArray) ? '--' : contractChildTypeDataArray.map((i, k) => {
                if (contractChildTypeDataArray.length === k + 1) {
                  return i;
                }
                return `${i},`;
              })
            }
        </Form.Item>,
      );
    }
    // 组织管理
    if (applyApplicationType === 701) {
      formItems.splice(2, 0, (
        <Form.Item
          label="调整子类型"
          {...layout}
        >
          {Array.isArray(organizationSubTypes) && organizationSubTypes.length > 0 ? organizationSubTypes.map((v) => {
            return (ExpenseDepartmentSubtype.description(v));
          }).join(', ') : '--'}
        </Form.Item>
      ));
    }
  };

  const renderHeader = () => {
    const formItems = [
      {
        span: 24,
        render: (
          <Form.Item
            labelCol={{ span: 3 }}
            colon={false}
            style={{ marginBottom: 0 }}
            label={(<h3>事务类审批流关联</h3>)}
          />
        ),
      },
      <Form.Item
        label="适用类型"
        name="applyApplicationType"
        {...layout}
        rules={[
          { required: true, message: '请选择适用类型' },
        ]}
      >
        <CommonSelectScene
          filterValues={[OaApplicationOrderType.oaBusiness]}
          enumeratedType="affairs"
          onChange={onChangeApplyApplicationType}
        />
      </Form.Item>,
    ];
    return (
      <React.Fragment>
        <CoreForm items={formItems} cols={3} />
      </React.Fragment>
    );
  };

  // BU3-事务类审批流
  const renderBu3 = () => {
    const detail = dot.get(examineFlowInfo, bu3Namespace, {});
    const nodeList = dot.get(detail, 'node_list', []);
    const formItems = [
      {
        span: 24,
        render: (
          <Form.Item
            labelCol={{ span: 3 }}
            colon={false}
            style={{ marginBottom: 0 }}
            label={(<h3>BU3-事务审批流：</h3>)}
          />
        ),
      },

      {
        span: 24,
        render: (
          <Form.Item
            noStyle
            key="applyApplicationType"
            shouldUpdate={
            (prevValues, curValues) => (
              prevValues.applyApplicationType !== curValues.applyApplicationType
            )
          }
          >
            {({ getFieldValue }) => (
              <Form.Item
                label="审批流名称"
                name="bu3ExamineFlow"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 12 }}
                rules={[
                { required: true, message: '请输入审批流名称' },
                ]}
              >
                <XDExamineFlow
                  applyApplicationType={getFieldValue('applyApplicationType')}
                  onChange={onChangeBu3ExamineFlow}
                  name={detail.name}
                  state={detail.state}
                  initItem={{ _id: detail._id, name: detail.name }}
                  bizType={bizType}
                  merchant={bu3Merchant}
                />
              </Form.Item>
          )}
          </Form.Item>
        ),
      },
      {
        span: 4,
        render: (
          <Form.Item
            label="是否有RS节点"
            labelCol={{ span: 14 }}
            wrapperCol={{ span: 8 }}
          >
            {dot.get(detail, 'is_rs') ? '是' : '否'}
          </Form.Item>
        ),
      },
      {
        span: 12,
        render: (
          <Form.Item
            label="最高审批岗"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <span className="noteWrap">
              {renderJobTags(detail)}
            </span>
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="审批流预览"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            {/* 节点预览 */}
            <NodeList nodelist={nodeList} applyApplicationType={dot.get(detail, 'apply_application_types.0', undefined)} />
          </Form.Item>
        ),
      },
    ];
    renderCommentType(formItems, detail);
    return (
      <CoreContent>
        <CoreForm items={formItems} cols={3} />
      </CoreContent>
    );
  };

  // 趣活-事务类审批流
  const renderQuhuo = () => {
    const detail = dot.get(examineFlowInfo, namespace, {});
    const nodeList = dot.get(detail, 'node_list', []);
    const formItems = [
      {
        span: 24,
        render: (
          <Form.Item
            labelCol={{ span: 3 }}
            colon={false}
            style={{ marginBottom: 0 }}
            label={(<h3>趣活-事务审批流：</h3>)}
          />
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            noStyle
            key="applyApplicationType"
            shouldUpdate={
            (prevValues, curValues) => (
              prevValues.applyApplicationType !== curValues.applyApplicationType
            )
          }
          >
            {({ getFieldValue }) => (
              <Form.Item
                label="审批流名称"
                name="examineFlow"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 12 }}
                rules={[
                { required: true, message: '请输入审批流名称' },
                ]}
              >
                <ExamineFlow
                  onChange={onChangeExamineFlow}
                  bizType={bizType}
                  name={detail.name}
                  state={detail.state}
                  initItem={{ _id: detail._id, name: detail.name }}
                  applyApplicationType={getFieldValue('applyApplicationType')}
                  merchant={merchant}
                />
              </Form.Item>
          )}
          </Form.Item>
        ),
      },
      {
        span: 12,
        render: (
          <Form.Item
            label="最高审批岗"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <span className="noteWrap">
              {renderJobTags(detail)}
            </span>
          </Form.Item>
        ),
      },
      {
        span: 24,
        render: (
          <Form.Item
            label="审批流预览"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            {/* 节点预览 */}
            <NodeList nodelist={nodeList} applyApplicationType={dot.get(detail, 'apply_application_types.0', undefined)} />
          </Form.Item>
        ),
      },
    ];
    renderCommentType(formItems, detail);
    return (
      <CoreContent>
        <CoreForm items={formItems} cols={3} />
      </CoreContent>
    );
  };

  return (
    <Form layout="horizontal" form={form} onFinish={() => { }}>
      <Alert
        showIcon
        message="提示：节点颜色显示红色为节点无审批人，关联关系不能创建成功！"
        type="error"
        style={{ margin: '10px 0' }}
      />
      {renderHeader()}
      {/* BU3-事务类审批流 */}
      {renderBu3()}
      {/* 趣活-事务类审批流 */}
      {renderQuhuo()}
      <div style={{ textAlign: 'center' }}>
        <Button
          style={{ marginRight: 15 }}
          onClick={() => {
            window.location.href = `/#/Expense/RelationExamineFlow?activeKey=${bizType}`;
          }}
        >返回</Button>
        <Button type="primary" loading={loading} onClick={onSubmit}>启用</Button>
      </div>
    </Form>
  );
}

const mapStateToProps = ({ relationExamineFlow: { examineFlowInfo },
  business: { contractTypeData },
}) => {
  return { examineFlowInfo, contractTypeData };
};

export default connect(mapStateToProps)(Update);
