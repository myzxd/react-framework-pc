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
  AffairsFlowSpecifyApplyType,
} from '../../../../application/define';

function NodeList(props) {
  const nodelist = dot.get(props, 'nodelist', []);
  // 节点每项
  const renderNodeItem = (node, key, isShowIcon = true) => {
    let textColor = false;
    const {
      node_approve_type: nodeApproveType, // 关系（汇报或协作）
      approve_department_name: approveDepartmentName, // 部门名称
      job_name: approveJobName, // 岗位名称
      now_approve: nowApprove, // 当前节点审批人
      approve_department_account_type: approveDepartmentAccountType, // 指定部门下，审批人类型
    } = node;

    // 审批人name
    let approveName = '';
    // 按汇报关系
    if (nodeApproveType === AffairsFlowNodeRelation.report) {
      approveName = '直接领导人';
    }

    // 按协作关系
    if (nodeApproveType === AffairsFlowNodeRelation.coopera) {
      // 指定部门，审批人类型为部门负责人时，直接展示【部门负责人】
      if (approveDepartmentAccountType === AffairsFlowSpecifyApplyType.principal) {
        // 没有审批人，节点标红
        if (is.not.existy(nowApprove) || is.empty(nowApprove)) {
          textColor = true;
        }
        approveName = (
          <span>
            {approveDepartmentName ? `${approveDepartmentName}  -  ` : ''}
            {AffairsFlowSpecifyApplyType.description(approveDepartmentAccountType)}
            {
              Array.isArray(nowApprove) && nowApprove.length > 0 ? `  -  ${nowApprove.join('、')}` : '-  无'
            }
          </span>
        );
      }

      // 指定部门，审批人类型为指定岗位时，显示对应的岗位name
      if (approveDepartmentAccountType === AffairsFlowSpecifyApplyType.post) {
        // 没有审批人，节点标红
        if (is.not.existy(nowApprove) || is.empty(nowApprove)) {
          textColor = true;
        }
        approveName = (
          <span>
            {approveDepartmentName}
            {
              approveJobName ? `  -  ${approveJobName}` : ''
            }
            {
              Array.isArray(nowApprove) && nowApprove.length > 0 ? `  -  ${nowApprove.join('、')}` : '-  无'
            }
          </span>
        );
      }
    }

    return (
      <Col style={{ marginLeft: 5 }} key={key}>
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
