/**
 * code - 基础设置 - 审批流配置 - 审批流编辑 - 节点设置
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Button,
  message,
  Popconfirm,
  Radio,
  Select,
  Form,
  Tooltip,
} from 'antd';
import {
  RightOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import CcDrawer from './ccDrawer/index';
import NodeDrawer from './nodeDrawer';

import { CoreContent } from '../../../../../components/core';
import {
  // OaApplicationFlowRegulation,
  OaApplicationFlowTemplateApproveMode,
  AffairsFlowNodeRelation,
  // ExpenseExamineFlowAmountAdjust,
  AffairsFlowSpecifyApplyType,
} from '../../../../../application/define';
import { dotOptimal } from '../../../../../application/utils';

import style from '../style.less';

const { Option } = Select;

const NodeForm = ({
  flowId, // 审批流id
  dispatch,
  flowNodeList = {},
  applicantNodeCcInfo, // 提报节点抄送数据
}) => {
  // 是否为提报节点state
  const [isReportNodeState, setIsReportNodeState] = useState(true);
  // 抄送抽屉visible
  const [ccVisble, setCcVisible] = useState(false);
  // 节点设置抽屉visible
  const [nodeVisble, setNodeVisible] = useState(false);
  // 当前节点标识符
  const [nodeIdentifier, setNodeIdentifier] = useState(undefined);

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

  // 审批流节点list
  const { data: nodeList = [] } = flowNodeList;

  // 获取节点列表
  const getFlowNodeList = () => {
    dispatch({
      type: 'codeFlow/getFlowNodeList',
      payload: { flowId },
    });
  };

  // 标记付款onChange
  const onChangeMarkPay = ({ isPaymentNode, nodeId }) => {
    // 当前操作的节点
    const curNode = nodeList.find(n => n._id === nodeId) || {};
    // 审批流节点标记付款list
    const nodePayList = nodeList.map(i => i.is_payment_node);
    // 当前操作节点的标记验票状态
    const isMarkTicket = dot.get(curNode, 'is_inspect_bill_node', false);

    // 审批流节点列表中只能存在一个标记付款节点
    if (nodePayList.includes(true) && isPaymentNode) {
      return message.error('同一个审批流，只能存在一个【标记付款】节点');
    }

    // 同一个节点，标记验票与标记付款互斥
    if (isMarkTicket && isPaymentNode) {
      return message.error('同一个节点，只能标记付款或标记验票');
    }

    updateFlowNode({ isPaymentNode, nodeId });
  };

  // 标记验票onChange
  const onChangeMarkTicket = ({ isInspectBillNode, nodeId }) => {
    // 当前操作的节点
    const curNode = nodeList.find(n => n._id === nodeId) || {};
    // 审批流节点标记验票list
    const nodeTicketList = nodeList.map(i => i.is_inspect_bill_node);
    // 当前操作节点的标记付款状态
    const isMarkPay = dot.get(curNode, 'is_payment_node', false);
    // 审批流节点列表中只能存在一个标记付款节点
    if (nodeTicketList.includes(true) && isInspectBillNode) {
      return message.error('同一个审批流，只能存在一个【标记验票】节点');
    }

    // 同一个节点，标记验票与标记付款互斥
    if (isMarkPay && isInspectBillNode) {
      return message.error('同一个节点，只能标记付款或标记验票');
    }

    updateFlowNode({ isInspectBillNode, nodeId });
  };

  // 编辑节点规则
  const updateFlowNode = async (val, type, onFailCallBack) => {
    const res = await dispatch({
      type: 'codeFlow/updateFlowNode',
      payload: {
        flowId,
        ...val,
      },
    });

    if (res && res._id) {
      // message.success('请求成功');
      getFlowNodeList();
      type === 'drawer' && val.setIsLoading && val.setIsLoading(res._id);
      type === 'drawer' && setNodeVisible(false);
    } else {
      res.zh_message && (message.error(res.zh_message));
      // 如果失败 也要处理失败后的loading加载
      if (onFailCallBack) {
        onFailCallBack();
      }
    }
  };

  // 新增节点操作
  const onCreate = () => {
    setNodeIdentifier(undefined);
    setNodeVisible(true);
  };

  // 修改节点
  const onShowNodeDrawer = (nodeId) => {
    setNodeIdentifier(nodeId);
    setNodeVisible(true);
  };

  // 删除审批流节点
  const onClickRemove = async (nodeId) => {
    const res = await dispatch({
      type: 'codeFlow/deleteFlowNode',
      payload: {
        nodeId, // 节点id
      },
    });

    if (res && res._id) {
      message.success('请求成功');
      getFlowNodeList();
    } else {
      res.zh_message && message.error(res.zh_message);
    }
  };

  // 节点设置抽屉
  const renderNodeDrawer = () => {
    if (!nodeVisble) return <div />;
    return (
      <NodeDrawer
        visible={nodeVisble}
        onClose={() => setNodeVisible(false)}
        flowId={flowId}
        nodeId={nodeIdentifier}
        nodeList={nodeList}
        updateFlowNode={updateFlowNode}
        getFlowNodeList={getFlowNodeList}
      />
    );
  };

  // 申请人节点
  const renderApplicant = () => {
    return (
      <div
        className={style['code-flow-applicant-node']}
      >
        <span
          className={style['code-flow-update-node-title']}
        >申请人</span>
        <div>
          {renderCcInfo(applicantNodeCcInfo, true)}
        </div>
      </div>
    );
  };

  // 抄送详情
  const renderCcInfo = (data, isReportNode) => {
    const ccInfo = isReportNode ? data : dotOptimal(data, 'carbon_copy_info', {});

    // 固定抄送，岗位关系list，处理数据
    const dealFixedRela = dotOptimal(ccInfo, 'fixed_department_job_list', []).map((i) => {
      if (!i._id) return;
      return { _id: i._id, name: i.job_info.name, jobId: i.job_info._id };
    });

    // 灵活抄送，岗位关系list，处理数据
    const dealFlexibleRela = dotOptimal(ccInfo, 'flexible_department_job_list', []).map((i) => {
      if (!i._id) return;
      return { _id: i._id, name: i.job_info.name, jobId: i.job_info._id };
    });

    // 固定抄送数据
    const fixedData = [
      ...dotOptimal(ccInfo, 'fixed_department_list', []),
      ...dealFixedRela,
      ...dotOptimal(ccInfo, 'fixed_account_list', []),
    ];

    // 灵活抄送数据
    const flexibleData = [
      ...dotOptimal(ccInfo, 'flexible_department_list', []),
      ...dealFlexibleRela,
      ...dotOptimal(ccInfo, 'flexible_account_list', []),
    ];

    return (
      <React.Fragment>
        <Row
          onClick={() => {
            setNodeCC(dotOptimal(data, '_id', undefined));
            setIsReportNodeState(isReportNode);
          }}
          className={style['affairs-flow-update-node-cc-wrap']}
        >
          <Col
            span={20}
            className={style['affairs-flow-update-node-cc-info']}
          >
            <div>
              固定抄送：
              <span>
                {
                  fixedData.slice(0, 3).map(i => i.name).join('、')
                }
                {fixedData.length > 3 ? <span>...</span> : ''}
              </span>
            </div>
          </Col>
          <Col
            span={4}
            className={style['affairs-flow-update-node-cc-info-arrow']}
          >
            <RightOutlined style={{ color: 'rgba(0, 0, 0, .4)' }} />
          </Col>
        </Row>
        {
          // 提报节点不显示灵活抄送
          isReportNode
          ? null
          : <Row
            onClick={() => {
              setNodeCC(dotOptimal(data, '_id', undefined));
              setIsReportNodeState(isReportNode);
            }}
            className={style['affairs-flow-update-node-cc-wrap']}
          >
            <Col
              span={20}
              className={style['affairs-flow-update-node-cc-info']}
            >
              <div>
            灵活抄送：
            <span>
              {
                flexibleData.slice(0, 3).map(i => i.name).join('、')
              }
              {flexibleData.length > 3 ? '...' : ''}
            </span>
              </div>
            </Col>
            <Col
              span={4}
              className={style['affairs-flow-update-node-cc-info-arrow']}
            >
              <RightOutlined style={{ color: 'rgba(0, 0, 0, .4)' }} />
            </Col>
          </Row>
        }
      </React.Fragment>
    );
  };

  // 节点设置抄送
  const setNodeCC = (nodeId) => {
    setNodeIdentifier(nodeId);
    setCcVisible(true);
  };

  // 抄送设置抽屉
  const renderCcDrawer = () => {
    if (!ccVisble) return <div />;
    return (
      <CcDrawer
        visible={ccVisble}
        onClose={() => setCcVisible(false)}
        flowId={flowId}
        nodeId={nodeIdentifier}
        nodeInfo={isReportNodeState ? applicantNodeCcInfo : nodeList.find(i => i._id === nodeIdentifier).carbon_copy_info}
        getAffairsFlowNodeList={getFlowNodeList}
        isReportNodeState={isReportNodeState}
      />
    );
  };

  // 新增节点
  const renderCreateNode = () => {
    return (
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => onCreate()}
      >新增节点</Button>
    );
  };

  // node info
  const renderNodeInfo = (node = {}) => {
    const {
      _id: nodeId, // 节点id
      node_approve_type: nodeApproveType, // 关系（回报或协作）
      // allow_update_money: isCanUpdateMoney, // 是否可调控
      approve_mode: approveMode, // 审批规则
      is_payment_node: isPaymentNode, // 标记付款
      is_inspect_bill_node: isInspectBillNode, // 标记验票
      name,
      approve_department_info: departmentInfo = {}, // 部门
      approve_department_job_info: approveDepartmentJobInfo = {}, // 岗位
      approve_department_account_type: approveDepartmentAccountType, // 指定部门下，审批人类型
      // cost_update_rule: costUpdateRule, // 金额调控规则
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

    return (
      <div className={style['code-flow-update-node-form']}>
        <Tooltip title={name}>
          <div className={style['code-flow-update-node-title']}>
            <span className={style['code-flow-node-round']} />
            {name}
          </div>
        </Tooltip>
        <Tooltip title={approveName}>
          <div className={style['code-flow-update-node-approve']}>
            {approveName}
          </div>
        </Tooltip>
        <Form
          layout="vertical"
          className="affairs-flow-update-node"
        >
          {/*
            <Form.Item
              label="调控"
            >
              <div className={style['code-flow-update-node-mode']}>
                <Form.Item>
                  <Radio.Group
                    size="small"
                    value={isCanUpdateMoney}
                    onChange={arg => updateFlowNode({ isCanUpdateMoney: arg.target.value, nodeId })}
                  >
                    <Radio.Button
                      value={OaApplicationFlowRegulation.no}
                    >
                      {OaApplicationFlowRegulation.description(OaApplicationFlowRegulation.no)}
                    </Radio.Button>
                    <Radio.Button
                      value={OaApplicationFlowRegulation.is}
                    >
                      {OaApplicationFlowRegulation.description(OaApplicationFlowRegulation.is)}
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item>
                  <Select
                    size="small"
                    placeholder="请选择金额调整"
                    value={costUpdateRule}
                    onChange={arg => updateFlowNode({ costUpdateRule: arg, nodeId })}
                    style={{ width: 100, marginLeft: 10 }}
                    disabled={!isCanUpdateMoney}
                  >
                    <Option
                      value={ExpenseExamineFlowAmountAdjust.upward}
                    >
                      {ExpenseExamineFlowAmountAdjust.description(ExpenseExamineFlowAmountAdjust.upward)}
                    </Option>
                    <Option
                      value={ExpenseExamineFlowAmountAdjust.down}
                    >
                      {ExpenseExamineFlowAmountAdjust.description(ExpenseExamineFlowAmountAdjust.down)}
                    </Option>
                    <Option
                      value={ExpenseExamineFlowAmountAdjust.any}
                    >
                      {ExpenseExamineFlowAmountAdjust.description(ExpenseExamineFlowAmountAdjust.any)}
                    </Option>
                  </Select>
                </Form.Item>
              </div>
            </Form.Item>
          */}
          <Form.Item
            label="审批规则"
          >
            <div className={style['code-flow-update-node-mode']}>
              <Form.Item>
                <Select
                  size="small"
                  placeholder="请选择审批规则"
                  value={approveMode}
                  onChange={arg => updateFlowNode({ approveMode: arg, nodeId })}
                  style={{ width: 76 }}
                >
                  <Option
                    value={OaApplicationFlowTemplateApproveMode.any}
                  >{OaApplicationFlowTemplateApproveMode.description(OaApplicationFlowTemplateApproveMode.any)}</Option>
                </Select>
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item label="标记付款">
            <Radio.Group
              size="small"
              value={isPaymentNode}
              disabled={nodeApproveType === AffairsFlowNodeRelation.report}
              onChange={arg => onChangeMarkPay({ isPaymentNode: arg.target.value, nodeId })}
            >
              <Radio.Button value={false}>否</Radio.Button>
              <Radio.Button value>是</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="标记验票">
            <Radio.Group
              size="small"
              value={isInspectBillNode}
              disabled={nodeApproveType === AffairsFlowNodeRelation.report}
              onChange={arg => onChangeMarkTicket({ isInspectBillNode: arg.target.value, nodeId })}
            >
              <Radio.Button value={false}>否</Radio.Button>
              <Radio.Button value>是</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
        <div>
          {renderCcInfo(node, false)}
        </div>
      </div>
    );
  };

  // 节点操作
  const renderNodeOperate = (node) => {
    return (
      <div className={style['code-flow-update-node-operate']}>
        <div
          className={style['code-flow-update-node-operate-modify']}
          onClick={() => onShowNodeDrawer(node._id)}
        >
          <EditOutlined /> 修改
        </div>
        <Popconfirm
          title="确认删除当前节点?"
          onConfirm={() => onClickRemove(node._id)}
          okText="删除"
          cancelText="取消"
        >
          <div
            className={style['code-flow-update-node-operate-delete']}
          >
            <DeleteOutlined /> 删除
          </div>
        </Popconfirm>
      </div>
    );
  };

  return (
    <CoreContent title="审批流节点设置">
      <Row>
        <Col
          span={6}
        >
          <Row>
            <Col
              span={20}
              className={style['code-flow-update-report-node']}
            >{renderApplicant()}</Col>
            <Col
              span={4}
              className={style['code-flow-update-node-arrow']}
            ><RightOutlined /></Col>
          </Row>
        </Col>
        <Col span={18}>
          <Row>
            {
              nodeList.map((node) => {
                return (
                  <Col span={8} key={node._id}>
                    <Row>
                      <Col
                        span={20}
                        className={style['code-flow-update-node-wrap']}
                      >
                        {renderNodeInfo(node)}
                        {renderNodeOperate(node)}
                      </Col>
                      <Col
                        span={4}
                        className={style['code-flow-update-node-arrow']}
                      ><RightOutlined /></Col>
                    </Row>
                  </Col>
                );
              })
            }
            <Col
              span={8}
            >
              <Row>
                <Col
                  span={20}
                  className={style['code-flow-update-node-create']}
                >
                  {renderCreateNode()}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 抄送抽屉 */}
      {renderCcDrawer()}
      {/* 节点设置抽屉 */}
      {renderNodeDrawer()}
    </CoreContent>
  );
};

const mapStateToProps = ({
  codeFlow: { flowNodeList, applicantNodeCcInfo },
}) => {
  return { flowNodeList, applicantNodeCcInfo };
};
export default connect(mapStateToProps)(NodeForm);
