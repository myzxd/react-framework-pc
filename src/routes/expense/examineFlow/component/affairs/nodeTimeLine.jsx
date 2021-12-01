/**
 * 审批流节点信息时间轴
 */
import dot from 'dot-prop';
import React from 'react';
import {
  Timeline,
  Row,
  Col,
  Form,
} from 'antd';

import { CoreContent } from '../../../../../components/core';
import {
  AffairsFlowNodeRelation,
  AffairsFlowCooperationPerson,
  AffairsFlowCooperationSpecify,
  OaApplicationFlowTemplateApproveMode,
  AffairsFlowSpecifyFieldDep,
  AffairsFlowSpecifyFieldPerson,
} from '../../../../../application/define';
import styles from './style.less';

// 事务性审批流节点设置按汇报关系获取organization_approve_type
const affairsReportValue = [
  {
    reportOne: 1,
    reportTwo: 1,
    value: AffairsFlowCooperationSpecify.actualPerson,
    name: '实际申请人本部门负责人',
  },
  {
    reportOne: 1,
    reportTwo: 2,
    value: AffairsFlowCooperationSpecify.actualPersonT,
    name: '实际申请人上级部门负责人',
  },
  {
    reportOne: 2,
    reportTwo: 1,
    value: AffairsFlowCooperationSpecify.supPerson,
    name: '上一节点审批人本部门负责人',
  },
  {
    reportOne: 2,
    reportTwo: 2,
    value: AffairsFlowCooperationSpecify.supPersonT,
    name: '上一节点审批人上级部门负责人',
  },
];

const NodeTimeLine = ({
  nodeList = [],
  applyApplicationTypes,
}) => {
  // 获取抄送信息
  const getNodeCC = (node) => {
    // 抄送数据（提报节点直接获取抄送字段，正常节点需从cc_list中获取）
    const ccData = node.indexNum === 0 ? node : dot.get(node, 'ccList.0', {});

    const {
      fixedCcAccountInfoList = [],
      fixedCcDepartmentJobRelationInfoList = [],
      fixedCcDepartmentInfoList = [],
      flexibleCcAccountInfoList = [],
      flexibleCcDepartmentJobRelationInfoList = [],
      flexibleCcDepartmentInfoList = [],
    } = ccData;

    // 固定抄送，岗位关系list，处理数据
    const dealFixedRela = fixedCcDepartmentJobRelationInfoList.map((i) => {
      if (!i._id) return;
      return { _id: i._id, name: i.job_info.name, jobId: i.job_info._id };
    });

    // 灵活抄送，岗位关系list，处理数据
    const dealFlexibleRela = flexibleCcDepartmentJobRelationInfoList.map((i) => {
      if (!i._id) return;
      return { _id: i._id, name: i.job_info.name, jobId: i.job_info._id };
    });

    // 固定抄送数据
    const fixedData = [
      ...fixedCcDepartmentInfoList,
      ...dealFixedRela,
      ...fixedCcAccountInfoList,
    ];

    // 灵活抄送数据
    const flexibleData = [
      ...flexibleCcDepartmentInfoList,
      ...dealFlexibleRela,
      ...flexibleCcAccountInfoList,
    ];

    return { fixedData, flexibleData };
  };

  // time.item
  const renderTimeItem = (node) => {
    const {
      nodeApproveType,
      organizationApproveType,
      accountApproveType,
      approveMode, // 审批规则
      indexNum,
      name,
      approveDepartmentInfo, // 部门信息
      approveJobInfo, // 岗位信息
    } = node;

    // 后端生成的提报节点不渲染（事务性审批流设置了抄送后，后端会生成提报节点）
    if (name === '提报节点' && indexNum === 0) {
      return;
    }

    // 抄送信息
    const {
      fixedData = [],
      flexibleData = [],
    } = getNodeCC(node);

    // 审批人name
    let approveName = '';
    // 按汇报关系
    if (nodeApproveType === AffairsFlowNodeRelation.report) {
      const reportNameData = affairsReportValue.find(i => i.value === organizationApproveType) || {};
      approveName = reportNameData.name;
    }

    // 按协作关系
    if (nodeApproveType === AffairsFlowNodeRelation.coopera) {
      // 指定字段部门
      if (organizationApproveType === AffairsFlowCooperationSpecify.fieldDep) {
        const names = {
          105: AffairsFlowSpecifyFieldDep.description(AffairsFlowSpecifyFieldDep.callIn),
          102: '增编部门',
          101: '招聘部门',
          108: '录用部门',
          109: '入职部门',
        };
        const key = applyApplicationTypes;
        approveName = names[key] || AffairsFlowCooperationSpecify.description(organizationApproveType);
      } else {
        organizationApproveType && (
          approveName = AffairsFlowCooperationSpecify.description(organizationApproveType)
        );
      }
      // 指定字段相关人
      if (accountApproveType === AffairsFlowCooperationPerson.fieldAccount) {
        const names = {
          405: AffairsFlowSpecifyFieldPerson.description(AffairsFlowSpecifyFieldPerson.contract),
          107: '工作接收人',
          303: '印章保管人',
          309: '印章保管人',
          301: '印章保管人',
          302: '印章保管人',
          306: '证照保管人',
          406: '合同保管人',
        };
        const key = applyApplicationTypes;
        approveName = names[key] || AffairsFlowCooperationPerson.description(accountApproveType);
      } else {
        accountApproveType && (
          approveName = AffairsFlowCooperationPerson.description(accountApproveType)
        );
      }
    }

    // 指定部门，显示部门&岗位名称
    if (organizationApproveType
      && organizationApproveType === AffairsFlowCooperationSpecify.department
      && approveDepartmentInfo
      && approveDepartmentInfo.name
    ) {
      // 部门名称
      approveName = approveDepartmentInfo.name;
      // 部门负责人
      (!approveJobInfo || !approveJobInfo.name) && (approveName = `${approveDepartmentInfo.name} - 部门负责人`);
      // 岗位名称
      approveJobInfo && approveJobInfo.name && (
        approveName = `${approveDepartmentInfo.name} - ${approveJobInfo.name}`
      );
    }

    return (
      <Timeline.Item color="#FF7700">
        <div
          className={styles['affairs-flow-node-time-title-wrap']}
        >
          <span
            className={styles['affairs-flow-node-time-name']}
          >{name}</span>
          <span
            className={styles['affairs-flow-node-time-approve-name']}
          >{approveName}</span>
        </div>
        <Form className="affairs-flow-node-time-line-form">
          <Row>
            <Col span={8}>
              <Form.Item
                label="审批规则"
              >
                {
                  approveMode ?
                    OaApplicationFlowTemplateApproveMode.description(approveMode)
                    : '--'
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="固定抄送"
              >
                <div className={styles['affairs-flow-node-time-cc-wrap']}>
                  {
                    fixedData.length > 0 ?
                      fixedData.map(i => i.name).join('、')
                      : '--'
                  }
                </div>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="灵活抄送"
              >
                <div className={styles['affairs-flow-node-time-cc-wrap']}>
                  {
                    flexibleData.length > 0 ?
                      flexibleData.map(i => i.name).join('、')
                      : '--'
                  }
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Timeline.Item>
    );
  };

  // 提报节点
  const renderReport = () => {
    // 后端生成的提报节点
    const reportNode = nodeList.find(i => (i.name === '提报节点' && i.indexNum === 0)) || {};

    // 抄送信息
    const {
      fixedData = [],
      flexibleData = [],
    } = getNodeCC(reportNode);

    return (
      <Timeline.Item color="#FF7700">
        <div
          className={styles['affairs-flow-node-time-title-wrap']}
        >
          <span
            className={styles['affairs-flow-node-time-name']}
          >申请人</span>
        </div>
        <Form className="affairs-flow-node-time-line-form">
          <Row>
            <Col span={8}>
              <Form.Item
                label="固定抄送"
              >
                <div className={styles['affairs-flow-node-time-cc-wrap']}>
                  {
                    fixedData.length > 0 ?
                      fixedData.map(i => i.name).join('、')
                      : '--'
                  }
                </div>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="灵活抄送"
              >
                <div className={styles['affairs-flow-node-time-cc-wrap']}>
                  {
                    flexibleData.length > 0 ?
                      flexibleData.map(i => i.name).join('、')
                      : '--'
                  }
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Timeline.Item>
    );
  };

  if (nodeList.length < 1) return <div />;

  return (
    <CoreContent title="审批流节点详情">
      <Timeline className="affairs-flow-node-time-line">
        {renderReport()}
        {
          nodeList.map(i => renderTimeItem(i))
        }
      </Timeline>
    </CoreContent>
  );
};

export default NodeTimeLine;
