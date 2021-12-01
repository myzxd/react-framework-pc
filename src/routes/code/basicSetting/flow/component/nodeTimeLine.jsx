/**
 * 审批流节点信息时间轴
 */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { useEffect } from 'react';
import {
  Timeline,
  Row,
  Col,
  Form,
  Empty,
  Tooltip,
} from 'antd';

import { CoreContent } from '../../../../../components/core';
import {
  Unit,
  AffairsFlowNodeRelation,
  OaApplicationFlowTemplateApproveMode,
  AffairsFlowSpecifyApplyType,
  ExpenseExamineFlowAmountAdjust,
  CodeFlowNodeConditionMoneyType,
} from '../../../../../application/define';
import { dotOptimal } from '../../../../../application/utils';
import styles from '../style.less';

const NodeTimeLine = ({
  flowId,
  dispatch,
  flowNodeList = {}, // 节点列表
  applicantNodeCcInfo, // 提报节点抄送数据
}) => {
  useEffect(() => {
    flowId && dispatch({
      type: 'codeFlow/getFlowNodeList',
      payload: { flowId },
    });

    return () => {
      dispatch({ type: 'codeFlow/resetFlowNodeList' });
    };
  }, [dispatch, flowId]);

  // 获取提报节点抄送数据
  useEffect(() => {
    flowId && dispatch({
      type: 'codeFlow/getApplicantNodeCc',
      payload: { flowId },
    });
  }, []);

  const { data: nodeList = [] } = flowNodeList;

  // 无数据
  if (!Array.isArray(nodeList) || nodeList.length < 1) {
    return (
      <CoreContent title="审批流节点详情">
        <Empty />
      </CoreContent>
    );
  }

  // 金额条件
  const renderMoneySkip = (node) => {
    const {
      is_skip: isSkip = false, // 是否条件跳过
      skip_condition: skipCondition = [], // 条件
    } = node;
    // 金额条件
    const skipVal = skipCondition.find(i => i.skip_type === 'money');

    // 条件跳过为否 || 金额条件值为空
    if (!isSkip || !skipVal || Object.keys(skipVal).length < 1) return '';

    const {
      opt,
      num,
    } = skipVal;

    let moneySkip = '';
    // 有条件
    if (opt !== CodeFlowNodeConditionMoneyType.no) {
      moneySkip = (
        <span>
          {CodeFlowNodeConditionMoneyType.description(opt)}
          {Unit.exchangePriceCentToMathFormat(num)}元
        </span>
      );
    } else {
      // 无条件
      moneySkip = CodeFlowNodeConditionMoneyType.description(opt);
    }

    return (
      <Col span={6}>
        <Form.Item
          label="金额条件"
        >
          {moneySkip}
        </Form.Item>
      </Col>
    );
  };

  // 科目条件
  const renderSubjectSkip = (node) => {
    const {
      is_skip: isSkip = false, // 是否条件跳过
      skip_condition: skipCondition = [], // 条件
    } = node;
    // 科目条件
    const skipVal = skipCondition.find(i => i.skip_type === 'subject');

    // 条件跳过为否 || 金额条件值为空
    if (!isSkip || !skipVal || Object.keys(skipVal).length < 1) return '';

    const {
      opt,
      data = [],
    } = skipVal;

    let subjectSkip = '';
    const subjectData = data.map(i => i.ac_code);

    if (opt === CodeFlowNodeConditionMoneyType.no) {
      subjectSkip = CodeFlowNodeConditionMoneyType.description(opt);
    }

    if (Array.isArray(subjectData) && subjectData.length <= 3) {
      subjectSkip = `${CodeFlowNodeConditionMoneyType.description(opt)}${subjectData.map(i => i)}`;
    }

    if (Array.isArray(subjectData) && subjectData.length > 3) {
      subjectSkip = (
        <Tooltip title={subjectData.map(i => i).join(',')}>
          {`${CodeFlowNodeConditionMoneyType.description(opt)}${subjectData.slice(0, 3).map(i => i)}`}
          <span style={{ color: '#E86000' }}>  更多</span>
        </Tooltip>
      );
    }

    return (
      <Col span={6}>
        <Form.Item
          label="科目条件"
        >
          {subjectSkip}
        </Form.Item>
      </Col>
    );
  };

  // time.item
  const renderTimeItem = (node) => {
    const {
      node_approve_type: nodeApproveType, // 关系（回报或协作）
      allow_update_money: isCanUpdateMoney, // 是否可调控
      approve_mode: approveMode, // 审批规则
      is_payment_node: isPaymentNode, // 标记付款
      is_inspect_bill_node: isInspectBillNode, // 标记验票
      name,
      approve_department_info: departmentInfo = {}, // 部门
      approve_department_job_info: approveDepartmentJobInfo = {}, // 岗位
      is_skip: isSkip, // 条件跳过
      approve_department_account_type: approveDepartmentAccountType, // 指定部门下，审批人类型
      cost_update_rule: costUpdateRule, // 金额调控规则
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
      approveDepartmentAccountType === AffairsFlowSpecifyApplyType.principal && (
        approveName = (
          <span>
            {dot.get(departmentInfo, 'name') ? `${dot.get(departmentInfo, 'name')}  -  ` : ''}
            {AffairsFlowSpecifyApplyType.description(approveDepartmentAccountType)}
          </span>
        )
      );

      // 指定部门，审批人类型为指定岗位时，显示对应的岗位name
      approveDepartmentAccountType === AffairsFlowSpecifyApplyType.post && (
        approveName = (
          <span>
            {dot.get(departmentInfo, 'name', '')}
            {
              dot.get(approveDepartmentJobInfo, 'job_info.name', undefined) ?
                `  -  ${dot.get(approveDepartmentJobInfo, 'job_info.name')}` : ''
            }
          </span>
        )
      );
    }

    // 固定抄送信息
    const fixedInfo = [
      ...dotOptimal(node, 'carbon_copy_info.fixed_department_list', []),
      ...dotOptimal(node, 'carbon_copy_info.fixed_department_job_list', []).map(item => ({ name: dotOptimal(item, 'job_info.name', '--') })),
      ...dotOptimal(node, 'carbon_copy_info.fixed_account_list', []),
    ];

    // 灵活抄送信息
    const flexibleInfo = [
      ...dotOptimal(node, 'carbon_copy_info.flexible_department_list', []),
      ...dotOptimal(node, 'carbon_copy_info.flexible_department_job_list', []).map(item => ({ name: dotOptimal(item, 'job_info.name', '--') })),
      ...dotOptimal(node, 'carbon_copy_info.flexible_account_list', []),
    ];

    return (
      <Timeline.Item color="#FF7700">
        <div
          className={styles['code-flow-node-time-title-wrap']}
        >
          <span
            className={styles['code-flow-node-time-name']}
          >{name}</span>
          <span
            className={styles['code-flow-node-time-approve-name']}
          >
            {approveName}
          </span>
        </div>
        <Form className="affairs-flow-node-time-line-form">
          <Row>
            <Col span={6}>
              <Form.Item
                label="调控"
              >
                {isCanUpdateMoney ? '是' : '否'}
                {/* 调控规则 */}
                {
                  (isCanUpdateMoney && costUpdateRule) ?
                    (ExpenseExamineFlowAmountAdjust.description(costUpdateRule))
                    : ''
                }
              </Form.Item>
            </Col>
            <Col span={6}>
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
            <Col span={6}>
              <Form.Item
                label="标记付款"
              >
                {
                  isPaymentNode ? '是' : '否'
                }
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="标记验票"
              >
                {
                  isInspectBillNode ? '是' : '否'
                }
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="条件跳过"
              >
                {
                  isSkip ? '是' : '否'
                }
              </Form.Item>
            </Col>
            {/* 金额条件 */}
            {renderMoneySkip(node)}
            {/* 科目条件 */}
            {renderSubjectSkip(node)}
            <Col span={6}>
              <Form.Item
                label="固定抄送"
              >
                {
                  fixedInfo.length > 0
                    ? fixedInfo.map(item => item.name).join('、')
                    : '--'
                }
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="灵活抄送"
              >
                {
                  flexibleInfo.length > 0
                    ? flexibleInfo.map(item => item.name).join('、')
                    : '--'
                }
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Timeline.Item>
    );
  };

  // 提报节点
  const renderReport = () => {
    // 固定抄送信息
    const fixedInfo = [
      ...dotOptimal(applicantNodeCcInfo, 'fixed_department_list', []),
      ...dotOptimal(applicantNodeCcInfo, 'fixed_department_job_list', []).map(item => ({ name: dotOptimal(item, 'job_info.name', '--') })),
      ...dotOptimal(applicantNodeCcInfo, 'fixed_account_list', []),
    ];
    return (
      <Timeline.Item color="#FF7700">
        <div
          className={styles['code-flow-node-time-title-wrap']}
        >
          <span
            className={styles['code-flow-node-time-name']}
          >申请人</span>
        </div>
        <Form className="affairs-flow-node-time-line-form">
          <Row>
            <Col span={6}>
              <Form.Item
                label="固定抄送"
              >
                {
                  fixedInfo.length > 0
                    ? fixedInfo.map(item => item.name).join('、')
                    : '--'
                }
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Timeline.Item>
    );
  };

  return (
    <CoreContent title="审批流节点详情">
      <Timeline className="code-flow-node-time-line">
        {renderReport()}
        {
          nodeList.map(i => renderTimeItem(i))
        }
      </Timeline>
    </CoreContent>
  );
};

const mapStateToProps = ({
  codeFlow: { flowNodeList, applicantNodeCcInfo },
}) => {
  return { flowNodeList, applicantNodeCcInfo };
};

export default connect(mapStateToProps)(NodeTimeLine);
