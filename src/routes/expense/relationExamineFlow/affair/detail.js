/*
* 关联审批流 - 事务类审批流详情
*/
import is from 'is_js';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { Form, Button } from 'antd';
import { connect } from 'dva';

import { CoreContent, CoreForm } from '../../../../components/core';
import {
  RelationExamineFlowMerchantType,
  RelationExamineFlowTabType,
  ExpenseDepartmentSubtype,
  AffairsFlowHighestPostType,
  OaApplicationFlowTemplateState,
} from '../../../../application/define';
import {
  CommonStampType,
} from '../../../../components/common';
import TypeForm from '../component/type';
import NodeList from './nodeList.jsx';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 17 } };
const bizType = RelationExamineFlowTabType.affair;
const bu3Merchant = RelationExamineFlowMerchantType.bu3;
const merchant = RelationExamineFlowMerchantType.quhuo;
const bu3Namespace = `${bizType}${RelationExamineFlowMerchantType.bu3}`;
const namespace = `${bizType}${RelationExamineFlowMerchantType.quhuo}`;
const enumeratedType = 'affairs';

function Detail(props) {
  const { dispatch, location: { query = {} }, examineFlowInfo = {}, contractTypeData = {}, enumeratedValue } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch({ type: 'business/fetchContractType', payload: {} });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: 'applicationCommon/getEnumeratedValue',
      payload: { enumeratedType },
    });
    return () => dispatch({ type: 'applicationCommon/resetEnumeratedValue', payload: {} });
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
    const detail = dot.get(examineFlowInfo, namespace, {});
    const { apply_application_types } = detail;
    const {
      affairs = [], // 事务性审批流类型枚举值
    } = enumeratedValue;

    // 适用类型
    const applyType = (Array.isArray(apply_application_types) && apply_application_types.length > 0)
      ? affairs.find(en => en.value === apply_application_types[0]) || {}
      : {};
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
        {...layout}
      >
        {applyType.name || '--'}
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
            label="审批流名称"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 12 }}
          >
            {dot.get(detail, 'name', '--')}{detail.state ? `（${OaApplicationFlowTemplateState.description(detail.state)}）` : null}
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
            label="审批流名称"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 12 }}
          >
            {dot.get(detail, 'name', '--')}{detail.state ? `（${OaApplicationFlowTemplateState.description(detail.state)}）` : null}
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
      </div>
    </Form>
  );
}

const mapStateToProps = ({ relationExamineFlow: { examineFlowInfo },
  business: { contractTypeData },
  applicationCommon: { enumeratedValue },
}) => {
  return { examineFlowInfo, contractTypeData, enumeratedValue };
};

export default connect(mapStateToProps)(Detail);
