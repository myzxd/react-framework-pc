/*
* 关联审批流 - code/team审批流创建
*/
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import { Form, Button } from 'antd';
import { connect } from 'dva';

import { CoreContent, CoreForm } from '../../../../components/core';
import {
  RelationExamineFlowMerchantType,
  RelationExamineFlowTabType,
  CodeCostCenterType,
  AffairsFlowHighestPostType,
  CodeFlowState,
} from '../../../../application/define';
import NodeList from './nodeList.jsx';

const bizType = RelationExamineFlowTabType.codeTeam;
const bu3Merchant = RelationExamineFlowMerchantType.bu3;
const merchant = RelationExamineFlowMerchantType.quhuo;
const bu3Namespace = `${bizType}${RelationExamineFlowMerchantType.bu3}`;
const namespace = `${bizType}${RelationExamineFlowMerchantType.quhuo}`;

function Detail(props) {
  const { dispatch, examineFlowInfo, location: { query = {} } } = props;
  const [form] = Form.useForm();
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
    const finalType = dot.get(detail, 'final_type', []);
    const finalApprovalJobs = dot.get(detail, 'final_approval_jobs', []);
    const finalApprovalJobTags = dot.get(detail, 'final_approval_job_tags', []);    // 最高审批岗位
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

  // BU3-code/team审批流
  const renderBu3 = () => {
    const detail = dot.get(examineFlowInfo, bu3Namespace, {});
    const nodeList = dot.get(detail, 'node_list', []);
    const costCenterTypes = dot.get(detail, 'cost_center_types', []);
    const formItems = [
      {
        span: 24,
        render: (
          <Form.Item
            labelCol={{ span: 4 }}
            colon={false}
            style={{ marginBottom: 0 }}
            label={(<h3>BU3-code/team审批流：</h3>)}
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
            {dot.get(detail, 'name', '--')}{detail.state ? `（${CodeFlowState.description(detail.state)}）` : null}
          </Form.Item>
        ),
      },
      {
        span: 6,
        render: (
          <Form.Item
            label="成本中心"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            {Array.isArray(costCenterTypes) && costCenterTypes.length > 0 ?
              costCenterTypes.map(item => CodeCostCenterType.description(item)).join('、')
              : '--'}
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
        span: 14,
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
            <NodeList nodelist={nodeList} applyApplicationType={dot.get(detail, 'applyApplicationTypes.0', undefined)} />
          </Form.Item>
        ),
      },
    ];
    return (
      <CoreContent>
        <CoreForm items={formItems} cols={3} />
      </CoreContent>
    );
  };

  // 趣活-code/team审批流
  const renderQuhuo = () => {
    const detail = dot.get(examineFlowInfo, namespace, {});
    const nodeList = dot.get(detail, 'node_list', []);
    const costCenterTypes = dot.get(detail, 'cost_center_types', []);
    const formItems = [
      {
        span: 24,
        render: (
          <Form.Item
            labelCol={{ span: 4 }}
            colon={false}
            style={{ marginBottom: 0 }}
            label={(<h3>趣活-code/team审批流：</h3>)}
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
            {dot.get(detail, 'name', '--')}{detail.state ? `（${CodeFlowState.description(detail.state)}）` : null}
          </Form.Item>
        ),
      },
      {
        span: 6,
        render: (
          <Form.Item
            label="成本中心"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            {Array.isArray(costCenterTypes) && costCenterTypes.length > 0
              ? costCenterTypes.map(item => CodeCostCenterType.description(item)).join('、')
              : '--'}
          </Form.Item>
        ),
      },
      {
        span: 18,
        render: (
          <Form.Item
            label="最高审批岗"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
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
            <NodeList nodelist={nodeList} applyApplicationType={dot.get(detail, 'applyApplicationTypes.0', undefined)} />
          </Form.Item>
        ),
      },
    ];
    return (
      <CoreContent>
        <CoreForm items={formItems} cols={3} />
      </CoreContent>
    );
  };

  return (
    <Form layout="horizontal" form={form} onFinish={() => { }}>
      <h2>code/team审批流关联</h2>
      {/* BU3-code/team审批流 */}
      {renderBu3()}
      {/* 趣活-code/team审批流 */}
      {renderQuhuo()}
      <div style={{ textAlign: 'center' }}>
        <Button
          onClick={() => {
            window.location.href = `/#/Expense/RelationExamineFlow?activeKey=${bizType}`;
          }}
        >返回</Button>
      </div>
    </Form>
  );
}

const mapStateToProps = ({ relationExamineFlow: { examineFlowInfo } }) => {
  return { examineFlowInfo };
};

export default connect(mapStateToProps)(Detail);
