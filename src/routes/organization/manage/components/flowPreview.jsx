/**
 * 组织架构 - 审批流节点预览
 */
import { connect } from 'dva';
import React, { useEffect } from 'react';
import {
  Timeline,
  Form,
} from 'antd';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const FlowPreview = ({
  dispatch,
  examineFlowInfo = [], // 审批流预览数据
  departmentId,
  specialDepartmentId,
  accountId,
  flowId, // 审批流id
}) => {
  useEffect(() => {
    flowId && dispatch({
      type: 'oaCommon/getExamineFlowInfo',
      payload: {
        flowId,
        specialDepartmentId,
        departmentId,
        accountId,
      },
    });

    return () => dispatch({
      type: 'oaCommon/resetExamineFlowInfo',
    });
  }, [dispatch, flowId, specialDepartmentId, departmentId, accountId]);

  if (!examineFlowInfo || !Array.isArray(examineFlowInfo) || examineFlowInfo.length < 1) return <div />;

  // 审批流节点信息
  const getFlowNodeInfo = () => {
    return (
      <Timeline>
        {
          examineFlowInfo.map((i, key) => {
            return (
              <Timeline.Item key={key}>
                {i.name}
                ({i.accounts_name ? i.accounts_name : '无'})
              </Timeline.Item>
            );
          })
        }
      </Timeline>
    );
  };

  return (
    <React.Fragment>
      <Form {...formLayout} className="organization-flow-preview">
        <Form.Item
          label="审批流预览"
          key="flow_preview"
        >
          {getFlowNodeInfo()}
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

const mapStateToProps = ({
  oaCommon: { examineFlowInfo },
}) => {
  return { examineFlowInfo };
};

export default connect(mapStateToProps)(FlowPreview);
