/*
* 关联审批流 - 节点预览
*/
import is from 'is_js';
import dot from 'dot-prop';
import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import {
  ArrowRightOutlined,
} from '@ant-design/icons';

import {
  AffairsFlowNodeRelation,
  AffairsFlowCooperationSpecify,
  AffairsFlowCooperationPerson,
  AffairsFlowSpecifyFieldDep,
  AffairsFlowSpecifyFieldPerson,
} from '../../../../application/define';

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

function NodeList(props) {
  const nodelist = dot.get(props, 'nodelist', []);
  const applyApplicationType = dot.get(props, 'applyApplicationType', undefined);
  // 节点每项
  const renderNodeItem = (node, i, isShowIcon = true) => {
    let textColor = false;
    const {
      node_approve_type: nodeApproveType, // 判断汇报关系和协作关系
      organization_approve_type: organizationApproveType,
      account_approve_type: accountApproveType, // 指定字段相关人
      approve_department_name: approveDepartmentName, // 部门名称
      approve_job_name: approveJobName, // 岗位名称
      current_node_apply_account_name: currentNodeApplyAccountName, // 当前节点审批人
    } = node;
    // 审批人name
    let approveName = '';
    // 按汇报关系
    if (nodeApproveType === AffairsFlowNodeRelation.report) {
      const reportNameData = affairsReportValue.find(item => item.value === organizationApproveType) || {};
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
        approveName = names[applyApplicationType] || AffairsFlowCooperationSpecify.description(organizationApproveType);
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
        approveName = names[applyApplicationType] || AffairsFlowCooperationPerson.description(accountApproveType);
      } else {
        accountApproveType && (
          approveName = AffairsFlowCooperationPerson.description(accountApproveType)
        );
      }
    }

    // 指定部门，显示部门&岗位名称
    if (organizationApproveType
      && organizationApproveType === AffairsFlowCooperationSpecify.department
      && approveDepartmentName
    ) {
      // 没有审批人，节点标红
      if (is.not.existy(currentNodeApplyAccountName) || is.empty(currentNodeApplyAccountName)) {
        textColor = true;
      }
      // 部门名称
      approveName = approveDepartmentName;
      // 部门负责人
      (!approveJobName) && (approveName = `${approveDepartmentName} - 部门负责人 - ${currentNodeApplyAccountName || '无'}`);
      // 岗位名称
      approveJobName && (
        approveName = `${approveDepartmentName} - ${approveJobName} - ${currentNodeApplyAccountName || '无'}`
      );
    }
    return (
      <Col key={i} style={{ marginLeft: 5 }}>
        <span style={{ color: textColor ? 'red' : '' }}>{node.node_name}（{approveName}）</span>
        {/* 最后一个节点不显示icon */}
        {isShowIcon ? null : (<ArrowRightOutlined />)}
      </Col>
    );
  };


  // 节点预览
  const renderNodeList = (data = []) => {
    // 判断是否为空
    if (is.not.existy(data) || is.empty(data)) {
      return '--';
    }
    return (
      <Row>
        <Col><span>申请人</span> <ArrowRightOutlined /></Col>
        {
          data.map((item, i) => {
            return renderNodeItem(item, i, i === data.length - 1);
          })
        }
      </Row>
    );
  };

  return (
    <React.Fragment>
      {renderNodeList(nodelist)}
    </React.Fragment>
  );
}

const mapStateToProps = ({ relationExamineFlow: { examineFlowInfo },
  business: { contractTypeData },
}) => {
  return { examineFlowInfo, contractTypeData };
};

export default connect(mapStateToProps)(NodeList);
