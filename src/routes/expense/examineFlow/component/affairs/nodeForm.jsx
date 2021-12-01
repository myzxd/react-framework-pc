/**
 * 审批流设置，事务性审批流编辑页节点表单组件
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState } from 'react';
import {
  Row,
  Col,
  Button,
  message,
  Popconfirm,
  Select,
  Form,
} from 'antd';
import {
  RightOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import CcDrawer from './ccDrawer';
import NodeDrawer from './nodeDrawer';

import { CoreContent } from '../../../../../components/core';
import {
  OaApplicationFlowTemplateApproveMode,
  // OaApplicationFlowAssigned,
  AffairsFlowNodeRelation,
  AffairsFlowCooperationSpecify,
  AffairsFlowCooperationPerson,
  AffairsFlowSpecifyFieldDep,
  AffairsFlowSpecifyFieldPerson,
} from '../../../../../application/define';

import style from './style.less';

const { Option } = Select;

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

const NodeForm = ({
  formRef,
  flowId, // 审批流id
  dispatch,
  affairsNodeList = [],
  examineDetail = {},
  scenseType,
}) => {
  // 抄送抽屉visible
  const [ccVisble, setCcVisible] = useState(false);
  // 节点设置抽屉visible
  const [nodeVisble, setNodeVisible] = useState(false);
  // 当前节点标识符
  const [nodeIdentifier, setNodeIdentifier] = useState(undefined);
  // 适用类型
  const [scenseVal, setScenseVal] = useState(undefined);
  // 组织架构申请 - 调整子类型
  const [organizationSubType, setOrganizationSubType] = useState(undefined);

  // 获取节点列表
  const getAffairsFlowNodeList = () => {
    dispatch({
      type: 'expenseExamineFlow/getAffairsFlowNodeList',
      payload: { flowId },
    });
  };

  // 编辑节点规则
  const updateAffairsFlowNode = async (val, callback) => {
    const res = await dispatch({
      type: 'expenseExamineFlow/updateAffairsFlowNode',
      payload: {
        flow_id: flowId,
        ...val,
      },
    });
    if (res && res.ok) {
      message.success('请求成功');
      getAffairsFlowNodeList();
    }

    callback && callback();
  };

  // 新增节点操作
  const onCreate = () => {
    // 适用类型
    let typeVal;
    // 组织架构申请 - 调整子类型
    let ogtSubType;
    if (formRef) {
      typeVal = formRef.current.getFieldValue('scense');
      ogtSubType = formRef.current.getFieldValue('departmentSubtype');
    }
    setNodeIdentifier(undefined);
    setNodeVisible(true);
    setScenseVal(typeVal);
    setOrganizationSubType(ogtSubType);
  };

  // 修改节点
  const onShowNodeDrawer = (nodeId) => {
    // 适用类型
    let typeVal;
    // 组织架构申请 - 调整子类型
    let ogtSubType;
    if (formRef) {
      typeVal = formRef.current.getFieldValue('scense');
      ogtSubType = formRef.current.getFieldValue('departmentSubtype');
    }

    setNodeIdentifier(nodeId);
    setNodeVisible(true);
    setScenseVal(typeVal);
    setOrganizationSubType(ogtSubType);
  };

  // 删除审批流节点
  const onClickRemove = (nodeId) => {
    dispatch({
      type: 'expenseExamineFlow/deleteExamineFlowNode',
      payload: {
        flowId, // 审批流ID
        nodeId, // 节点id
        onSuccessRemoveCallback: () => getAffairsFlowNodeList(),  // 删除节点回调
      },
    });
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
        nodeList={affairsNodeList}
        getAffairsFlowNodeList={getAffairsFlowNodeList}
      />
    );
  };

  // 节点设置抽屉
  const renderNodeDrawer = () => {
    if (!nodeVisble) return <div />;
    return (
      <NodeDrawer
        visible={nodeVisble}
        onClose={() => setNodeVisible(false)}
        scenseVal={scenseVal}
        organizationSubType={organizationSubType}
        flowId={flowId}
        nodeId={nodeIdentifier}
        nodeList={affairsNodeList}
        updateAffairsFlowNode={updateAffairsFlowNode}
        getAffairsFlowNodeList={getAffairsFlowNodeList}
      />
    );
  };

  // 申请人节点
  const renderApplicant = () => {
    // 后端生成的提报节点数据
    const reportNode = affairsNodeList.find(i => (i.indexNum === 0 && i.name === '提报节点')) || {};

    return (
      <div
        className={style['app-comp-expense-examine-flow-applicant']}
      >
        <span
          className={style['affairs-flow-update-node-title']}
        >申请人</span>
        <div>
          {renderCcInfo(reportNode)}
        </div>
      </div>
    );
  };

  // 抄送详情
  const renderCcInfo = (data) => {
    // 抄送数据（提报节点直接获取抄送字段，正常节点需从cc_list中获取）
    const ccData = data.indexNum === 0 ? data : dot.get(data, 'ccList.0', {});
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

    return (
      <React.Fragment>
        <Row
          onClick={() => setNodeCC(data.id)}
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
        <Row
          onClick={() => setNodeCC(data.id)}
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
      </React.Fragment>
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

  const renderNodeInfo = (node) => {
    const {
      name,
      approveMode,
      id,
      // pickMode,
      indexNum,
    } = node;

    // 后端生成的提报节点不用在这儿显示
    if (indexNum === 0 && name === '提报节点') return;

    // 审批人name
    const {
      nodeApproveType,
      organizationApproveType,
      accountApproveType,
      approveDepartmentInfo, // 部门信息
      approveJobInfo, // 岗位信息
    } = node;

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
        const key = scenseType || dot.get(examineDetail, 'applyApplicationTypes.0');
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
        const key = scenseType || dot.get(examineDetail, 'applyApplicationTypes.0');
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
      <div className={style['affairs-flow-update-node-form']}>
        <div className={style['affairs-flow-update-node-title']}>
          <span className={style['app-comp-expense-round']} />
          {name}
        </div>
        <div className={style['affairs-flow-update-node-approve']}>
          {approveName}
        </div>
        <Form
          layout="vertical"
          className="affairs-flow-update-node"
        >
          <Form.Item
            label="审批规则"
          >
            <div className={style['affairs-flow-update-node-mode']}>
              <Form.Item>
                <Select
                  size="small"
                  placeholder="请选择审批规则"
                  value={approveMode}
                  onChange={arg => updateAffairsFlowNode({ approveMode: arg, nodeId: id })}
                  style={{ width: 76 }}
                >
                  {/*
                    Option value={OaApplicationFlowTemplateApproveMode.all}>{OaApplicationFlowTemplateApproveMode.description(OaApplicationFlowTemplateApproveMode.all)}</Option>
                  */}
                  <Option value={OaApplicationFlowTemplateApproveMode.any}>{OaApplicationFlowTemplateApproveMode.description(OaApplicationFlowTemplateApproveMode.any)}</Option>
                </Select>
              </Form.Item>
              {/*
                <Form.Item>
                  <Select
                    size="small"
                    placeholder="请选择"
                    style={{ width: 86, marginLeft: 10 }}
                    value={pickMode}
                    disabled
                  >
                    <Option value={OaApplicationFlowAssigned.automatic}>{OaApplicationFlowAssigned.description(OaApplicationFlowAssigned.automatic)}</Option>
                    <Option value={OaApplicationFlowAssigned.manual}>{OaApplicationFlowAssigned.description(OaApplicationFlowAssigned.manual)}</Option>
                  </Select>
                </Form.Item>
              */}
            </div>
          </Form.Item>
        </Form>
        <div>
          {renderCcInfo(node)}
        </div>
      </div>
    );
  };

  // 节点操作
  const renderNodeOperate = (node) => {
    return (
      <div className={style['affairs-flow-update-node-operate']}>
        <div
          className={style['affairs-flow-update-node-operate-modify']}
          onClick={() => onShowNodeDrawer(node.id)}
        >
          <EditOutlined /> 修改
        </div>
        <Popconfirm
          title="确认删除当前节点?"
          onConfirm={() => onClickRemove(node.id)}
          okText="删除"
          cancelText="取消"
        >
          <div
            className={style['affairs-flow-update-node-operate-delete']}
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
              className={style['affairs-flow-update-report-node']}
            >{renderApplicant()}</Col>
            <Col
              span={4}
              className={style['affairs-flow-update-node-arrow']}
            ><RightOutlined /></Col>
          </Row>
        </Col>
        <Col span={18}>
          <Row>
            {
              affairsNodeList.map((node) => {
                const { name, indexNum } = node;
                // 后端生成的提报节点不用在这儿显示
                if (indexNum === 0 && name === '提报节点') return;

                return (
                  <Col span={8} key={node.id}>
                    <Row>
                      <Col
                        span={20}
                        className={style['affairs-flow-update-node-wrap']}
                      >
                        {renderNodeInfo(node)}
                        {renderNodeOperate(node)}
                      </Col>
                      <Col
                        span={4}
                        className={style['affairs-flow-update-node-arrow']}
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
                  className={style['affairs-flow-update-node-create']}
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
  expenseExamineFlow: { affairsNodeList },
}) => {
  return { affairsNodeList };
};
export default connect(mapStateToProps)(NodeForm);
