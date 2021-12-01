/**
 * 审批流设置，事务性审批流编辑页节点设置抽屉
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Radio,
  message,
} from 'antd';
import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';

import DepAndPostTreeSelect from './depPostTreeSelect';
import User from './user';

import {
  AffairsFlowCooperationSpecify,
  AffairsFlowSpecifyApplyType,
  AffairsFlowSpecifyFieldDep,
  AffairsFlowSpecifyFieldPerson,
  AffairsFlowNodeRelation,
  AffairsFlowCooperationPerson,
  ExpenseDepartmentSubtype,
} from '../../../../../application/define';
import { utils } from '../../../../../application';
import { CoreForm } from '../../../../../components/core';

import DepTreeSelect from './depTreeSelect';
import Post from './post';
import styles from './style.less';

// 指定字段部门key
const specifyDepKey = [101, 102, 105, 108, 109, 701];

// 指定字段相关人
const specifyPerKey = [107, 303, 301, 302, 306, 405, 406, 309];

const { Option } = Select;

const itemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 10 } };

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

const NodeDrawer = ({
  visible,
  onClose,
  scenseVal, // 审批流适用类型
  nodeId, // 节点id
  flowId, // 审批流id
  nodeList = [],
  // updateAffairsFlowNode, // 更新节点方法
  dispatch,
  getAffairsFlowNodeList, // 获取节点列表
  organizationSubType = [], // 组织架构申请 - 调整子类型
}) => {
  const [form] = Form.useForm();

  // 当前节点信息
  const data = nodeList.find(i => i.id === nodeId) || {};

  // 指定关系
  const [relation, setRelation] = useState(data.nodeApproveType);
  // 协作关系表单value
  const [approveType, setApproveType] = useState(data.organizationApproveType || data.accountApproveType);
  // 协作关系，指定部门，部门id
  const [depId, setDepId] = useState(data.approveDepartmentId);
  // 部门审批人类型
  const [depAccountType, setDepAccountType] = useState(data.approveDepartmentAccountType || AffairsFlowSpecifyApplyType.principal);
  // button loading
  const [isLoading, setIsLoading] = useState(false);
  // 固定抄送 - 部门/岗位
  const [fixedDep, setFixedDep] = useState(undefined);
  // 灵活抄送 - 部门/岗位
  const [flexibleDep, setFlexibledDep] = useState(undefined);

  // 判断是否是只有增编 true（不是）false（是）
  const flag = organizationSubType.some(v => v !== ExpenseDepartmentSubtype.addendum);

  useEffect(() => {
    // 编辑时，设置默认值
    if (data && Object.keys(data).length > 0) {
      // 抄送信息
      const ccInfo = utils.dotOptimal(data, 'ccList.0', {});

      const {
        fixedCcDepartmentJobRelationInfoList = [],
        fixedCcDepartmentInfoList = [],
        flexibleCcDepartmentJobRelationInfoList = [],
        flexibleCcDepartmentInfoList = [],
      } = ccInfo;

      setFixedDep([
        ...fixedCcDepartmentInfoList.map(d => (
          { _id: d._id, jobId: undefined }
        )),
        ...fixedCcDepartmentJobRelationInfoList.map(d => (
          { _id: d._id, jobId: d.job_info._id }
        )),
      ]);

      setFlexibledDep([
        ...flexibleCcDepartmentInfoList.map(d => (
          { _id: d._id, jobId: undefined }
        )),
        ...flexibleCcDepartmentJobRelationInfoList.map(d => (
          { _id: d._id, jobId: d.job_info._id }
        )),
      ]);
    }
  }, [data]);

  // 确定
  const onOk = async () => {
    const values = await form.validateFields();

    setIsLoading(true);
    // 指定字段
    const { organization_approve_type: specifyType } = values;
    if ((!scenseVal || !specifyDepKey.includes(Number(scenseVal)) || flag === true)
      && specifyType === AffairsFlowCooperationSpecify.fieldDep
    ) {
      setIsLoading(false);
      message.error('所选审批类型无指定字段特殊部门, 请重新选择');
      return;
    }

    if ((!scenseVal || !specifyPerKey.includes(Number(scenseVal)))
      && specifyType === AffairsFlowCooperationPerson.fieldAccount
    ) {
      setIsLoading(false);
      message.error('所选审批类型无指定字段相关人, 请重新选择');
      return;
    }

    // 新建/编辑节点
    const res = await dispatch({
      type: 'expenseExamineFlow/updateAffairsFlowNode',
      payload: {
        flow_id: flowId,
        nodeId,
        ...values,
      },
    });

    // 节点设置接口成功
    if (res && res.ok) {
      const ccRes = await dispatch({
        type: 'expenseExamineFlow/setApplicationNodeCC',
        payload: {
          ...values,
          flowId,
          nodeId: res.record._id,
          fixedDep,
          flexibleDep,
        },
      });

      // 设置抄送成功
      if (ccRes && ccRes.ok) {
        message.success('请求成功');
        getAffairsFlowNodeList();
      }

      // 设置抄送失败
      if (ccRes && ccRes.zh_message) {
        setIsLoading(false);
        return message.error(ccRes.zh_message);
      }
    }

    // 失败
    if (res && res.zh_message) {
      setIsLoading(false);
      return message.error(res.zh_message);
    }
    onClose();
  };

  // 按协作关系form
  const onChangeApproveType = (e) => {
    // 指定字段部门，部门审批人类型重置为部门负责人
    if (e.target.value === AffairsFlowCooperationSpecify.fieldDep) {
      form.setFieldsValue({
        approve_department_account_type: AffairsFlowSpecifyApplyType.principal,
      });
    }
    setApproveType(e.target.value);
  };

  // 指定部门，部门onChange
  const onChangeDep = (val) => {
    setDepId(val);
    form.setFieldsValue({ approve_job_id: undefined });
  };

  // 部门审批人类型onChange
  const onChangeDepType = (val) => {
    setDepAccountType(val);
    form.setFieldsValue({ approve_job_id: undefined });
  };

  // 固定抄送 - 部门/岗位
  const onChangeFixedDep = (v, label, extra = {}) => {
    const { allCheckedNodes = [] } = extra;
    // 处理部门及岗位
    const fixedDepVal = allCheckedNodes.map((n) => {
      return {
        _id: dot.get(n, 'node.props.value'),
        jobId: dot.get(n, 'node.props.jobId'),
      };
    });

    setFixedDep(fixedDepVal);
  };

  // 固定抄送 - 部门/岗位
  const onChangeFlexibleDep = (v, label, extra = {}) => {
    const { allCheckedNodes = [] } = extra;
    // 处理部门及岗位
    const flexibleDepVal = allCheckedNodes.map((n) => {
      return {
        _id: dot.get(n, 'node.props.value'),
        jobId: dot.get(n, 'node.props.jobId'),
      };
    });

    setFlexibledDep(flexibleDepVal);
  };

// 标签校验规则
  const onVerifyName = (rule, value, callback) => {
    const reg = /^\S+$/;
    if (value && !reg.test(value)) {
      callback('节点名称不能包含空格');
      return;
    }
    callback();
  };

  // 指定部门表单
  const renderSpecifyDep = () => {
    if (approveType !== AffairsFlowCooperationSpecify.department
      || relation !== AffairsFlowNodeRelation.coopera
    ) {
      return '';
    }

    return (
      <React.Fragment>
        <div>指定部门</div>
        <Form
          layout="vertical"
          className="affairs-flow-node"
          form={form}
        >
          <Form.Item
            name="approve_department_id"
            label="部门"
            initialValue={data.approveDepartmentId}
            rules={[{ required: true, message: '请选择' }]}
          >
            <DepTreeSelect onChange={val => onChangeDep(val)} />
          </Form.Item>
          <Form.Item
            name="approve_department_account_type"
            label="部门审批人类型"
            rules={[{ required: true, message: '请选择' }]}
            initialValue={data.approveDepartmentAccountType || AffairsFlowSpecifyApplyType.principal}
            className="affairs-flow-node-report-type"
          >
            <Radio.Group onChange={e => onChangeDepType(e.target.value)}>
              <Radio
                value={AffairsFlowSpecifyApplyType.principal}
                className={styles['flow-node-radio-form']}
              >
                {AffairsFlowSpecifyApplyType.description(AffairsFlowSpecifyApplyType.principal)}
              </Radio>
              <Radio
                value={AffairsFlowSpecifyApplyType.post}
                className={styles['flow-node-radio-form']}
              >
                {AffairsFlowSpecifyApplyType.description(AffairsFlowSpecifyApplyType.post)}
                <Form.Item
                  name="approve_job_id"
                  className={styles['flow-node-radio-form-item']}
                  initialValue={data.approveJobId}
                  rules={[{
                    required: depAccountType === AffairsFlowSpecifyApplyType.post,
                    message: '请选择',
                  }]}
                >
                  <Post departmentId={depId} disabled={depAccountType === AffairsFlowSpecifyApplyType.principal} />
                </Form.Item>
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  };

  // 指定字段部门表单
  const renderSpecifyFieldDep = () => {
    let fieldDepForm;
    // 人事异动
    scenseVal === 105 && (
      fieldDepForm = (
        <Radio.Group>
          {/*
            <Radio
              value={AffairsFlowSpecifyFieldDep.callOut}
            >
              {AffairsFlowSpecifyFieldDep.description(AffairsFlowSpecifyFieldDep.callOut)}
            </Radio>
          */}
          <Radio
            value={AffairsFlowSpecifyFieldDep.callIn}
          >
            {AffairsFlowSpecifyFieldDep.description(AffairsFlowSpecifyFieldDep.callIn)}
          </Radio>
        </Radio.Group>
      )
    );
    // 部门增编 子类型包含增编才显示
    (
      (scenseVal === 701 && organizationSubType.length > 0 && flag !== true)
      || scenseVal === 102
    ) && (
      fieldDepForm = (
        <Radio.Group>
          <Radio value={1}>增编部门</Radio>
        </Radio.Group>
      )
    );

    // 部门招聘
    scenseVal === 101 && (
      fieldDepForm = (
        <Radio.Group>
          <Radio value={1}>招聘部门</Radio>
        </Radio.Group>
      )
    );

    // 录用
    scenseVal === 108 && (
      fieldDepForm = (
        <Radio.Group>
          <Radio value={1}>录用部门</Radio>
        </Radio.Group>
      )
    );

    // 入职
    scenseVal === 109 && (
      fieldDepForm = (
        <Radio.Group>
          <Radio value={1}>入职部门</Radio>
        </Radio.Group>
      )
    );

    // 指定字段部门默认值
    const initDepVal = scenseVal === 105 ?
      AffairsFlowSpecifyFieldDep.callIn
      : 1;

    return (
      <React.Fragment>
        <Form.Item
          name="approve_department_account_type"
          label="部门审批人类型"
          required={[{ required: true, message: '请选择' }]}
          initialValue={data.approveDepartmentAccountType || AffairsFlowSpecifyApplyType.principal}
          {...itemLayout}
        >
          <Radio.Group disabled>
            <Radio
              value={AffairsFlowSpecifyApplyType.principal}
              className={styles['flow-node-radio-form']}
            >
              {AffairsFlowSpecifyApplyType.description(AffairsFlowSpecifyApplyType.principal)}
            </Radio>
            <Radio
              value={AffairsFlowSpecifyApplyType.post}
              className={styles['flow-node-radio-form']}
            >
              {AffairsFlowSpecifyApplyType.description(AffairsFlowSpecifyApplyType.post)}
            </Radio>
          </Radio.Group>
        </Form.Item>
        {
          fieldDepForm ?
            (
              <Form.Item
                name="specified_department_type"
                label="指定字段特殊部门"
                initialValue={data.specifiedDepartmentType || initDepVal}
                rules={[{ required: true, message: '请选择' }]}
              >
                {fieldDepForm}
              </Form.Item>
            ) : ''
        }
      </React.Fragment>
    );
  };

  // 指定字段相关人表单
  const renderSpecifyFieldReleUser = () => {
    let fieldReleUserForm;
    // 合同会审
    scenseVal === 405 && (
      fieldReleUserForm = (
        <Radio.Group>
          <Radio
            value={AffairsFlowSpecifyFieldPerson.contract}
          >
            {AffairsFlowSpecifyFieldPerson.description(AffairsFlowSpecifyFieldPerson.contract)}
          </Radio>
          {/*
              <Radio
                value={AffairsFlowSpecifyFieldPerson.fare}
              >
                {AffairsFlowSpecifyFieldPerson.description(AffairsFlowSpecifyFieldPerson.fare)}
             </Radio>
          */}
        </Radio.Group>
      )
    );

    // 工作交接
    scenseVal === 107 && (
      fieldReleUserForm = (
        <Radio.Group>
          <Radio value={1}>工作接收人</Radio>
        </Radio.Group>
      )
    );

    // 章
    (scenseVal === 303
      || scenseVal === 309
      || scenseVal === 301
      || scenseVal === 302) && (
      fieldReleUserForm = (
        <Radio.Group>
          <Radio value={1}>印章保管人</Radio>
        </Radio.Group>
      )
    );

    // 证照借用
    scenseVal === 306 && (
      fieldReleUserForm = (
        <Radio.Group>
          <Radio value={1}>证照保管人</Radio>
        </Radio.Group>
      )
    );

    // 证照借用
    scenseVal === 406 && (
      fieldReleUserForm = (
        <Radio.Group>
          <Radio value={1}>合同保管人</Radio>
        </Radio.Group>
      )
    );

    // 指定字段相关人默认值
    const initSoecFieldType = scenseVal === 405
      ? AffairsFlowSpecifyFieldPerson.contract
      : 1;

    if (fieldReleUserForm) {
      return (
        <Form.Item
          name="specified_field_type"
          label="指定字段相关人"
          initialValue={data.specifiedFieldType || initSoecFieldType}
        >
          {fieldReleUserForm}
        </Form.Item>
      );
    }

    return null;
  };

  // 指定字段表单
  const renderSpecify = () => {
   // 指定字段部门
    if (approveType === AffairsFlowCooperationSpecify.fieldDep) {
      return renderSpecifyFieldDep();
    }
    // 指定字段相关人
    if (approveType === AffairsFlowCooperationPerson.fieldAccount) {
      return renderSpecifyFieldReleUser();
    }
  };

  // 按协作关系form
  const renderCooperation = () => {
    if (relation !== AffairsFlowNodeRelation.coopera) return '';
    return (
      <React.Fragment>
        <Form.Item
          label=""
          name="organization_approve_type"
          rules={[
            { required: true, message: '请选择' },
          ]}
          initialValue={data.organizationApproveType || data.accountApproveType}
        >
          <Radio.Group
            onChange={onChangeApproveType}
          >
            <Radio
              value={AffairsFlowCooperationSpecify.department}
              className={styles['flow-node-radio-form-coopera']}
            >
              {AffairsFlowCooperationSpecify.description(AffairsFlowCooperationSpecify.department)}
            </Radio>
            {
              // 判断是否显示指定字段部门
              // 701（组织管理）子类型有数据，并且只有增编才显示
              ((scenseVal !== 701 && specifyDepKey.includes(Number(scenseVal)))
                || (scenseVal === 701 && organizationSubType.length > 0 && flag !== true)) ? (
                  <Radio
                    value={AffairsFlowCooperationSpecify.fieldDep}
                    className={styles['flow-node-radio-form-coopera']}
                  >
                    {AffairsFlowCooperationSpecify.description(AffairsFlowCooperationSpecify.fieldDep)}
                  </Radio>
              ) : null
            }
            {
              // 判断是否显示指定字段人员
              specifyPerKey.includes(Number(scenseVal)) ? (
                <Radio
                  value={AffairsFlowCooperationPerson.fieldAccount}
                  className={styles['flow-node-radio-form-coopera']}
                >
                  {AffairsFlowCooperationPerson.description(AffairsFlowCooperationPerson.fieldAccount)}
                </Radio>
              ) : null
            }
            <Radio
              value={AffairsFlowCooperationPerson.actualAccount}
              className={styles['flow-node-radio-form-coopera']}
            >
              {AffairsFlowCooperationPerson.description(AffairsFlowCooperationPerson.actualAccount)}
            </Radio>
          </Radio.Group>
        </Form.Item>
        {renderSpecify()}
      </React.Fragment>
    );
  };

  // 按汇报关系form
  const renderReport = () => {
    if (relation !== AffairsFlowNodeRelation.report) return '';
    // 指定上级（表单value与后段数据不对应，需要前端处理）
    const { organizationApproveType } = data;
    let reportData = {};
    if (organizationApproveType) {
      reportData = affairsReportValue.find(i => i.value === organizationApproveType) || {};
    }

    return (
      <React.Fragment>
        <Form.Item>
          <div
            className={styles['flow-node-customize-form']}
          >
            <Form.Item
              name="reportOne"
              style={{ width: '45%' }}
              rules={[{ required: true, message: '请选择' }]}
              initialValue={reportData.reportOne}
            >
              <Select
                placeholder="请选择"
              >
                <Option value={1}>实际申请人</Option>
                <Option value={2}>上一节点审批人</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="reportTwo"
              style={{ width: '45%' }}
              rules={[{ required: true, message: '请选择' }]}
              initialValue={reportData.reportTwo}
            >
              <Select
                placeholder="请选择"
              >
                <Option value={1}>本部门负责人</Option>
                <Option value={2}>上级部门负责人</Option>
              </Select>
            </Form.Item>
          </div>
        </Form.Item>
      </React.Fragment>
    );
  };

  // form
  const renderForm = () => {
    const formItems = [
      <Form.Item
        label="节点名称设置"
        name="name"
        rules={[
          { required: true, message: '请输入节点名称' },
          { validator: onVerifyName },
        ]}
        initialValue={data.name}
      >
        <Input placeholder="请输入" autoComplete="off" />
      </Form.Item>,
      <Form.Item
        label="节点审批人设置"
        name="node_approve_type"
        rules={[
          { required: true, message: '请输入节点名称' },
        ]}
        initialValue={data.nodeApproveType}
      >
        <Select
          placeholder="请选择"
          onChange={val => setRelation(val)}
        >
          <Option
            value={AffairsFlowNodeRelation.report}
          >
            {AffairsFlowNodeRelation.description(AffairsFlowNodeRelation.report)}
          </Option>
          <Option
            value={AffairsFlowNodeRelation.coopera}
          >
            {AffairsFlowNodeRelation.description(AffairsFlowNodeRelation.coopera)}
          </Option>
        </Select>
      </Form.Item>,
    ];

    return <CoreForm items={formItems} cols={1} />;
  };

  // 抄送
  const renderCc = () => {
    // 抄送信息
    const ccInfo = utils.dotOptimal(data, 'ccList.0', {});
    const {
      fixedCcAccountInfoList = [],
      fixedCcDepartmentJobRelationInfoList = [],
      fixedCcDepartmentInfoList = [],
      flexibleCcAccountInfoList = [],
      flexibleCcDepartmentJobRelationInfoList = [],
      flexibleCcDepartmentInfoList = [],
    } = ccInfo;

    const initialValues = {
      fixedDep: [
        ...fixedCcDepartmentInfoList.map(d => d._id), // 部门
        ...fixedCcDepartmentJobRelationInfoList.map(r => r._id), // 岗位关系
      ], // 固定抄送 - 可抄送部门/岗位
      fixedUser: [...fixedCcAccountInfoList.map(a => a._id)], // 固定抄送 - 可抄送成员
      flexibleDep: [
        ...flexibleCcDepartmentInfoList.map(d => d._id), // 部门
        ...flexibleCcDepartmentJobRelationInfoList.map(r => r._id), // 岗位关系
      ], // 灵活抄送 - 可抄送部门\岗位
      flexibleUser: [...flexibleCcAccountInfoList.map(a => a._id)], // 灵活抄送 - 可抄送成员
    };

    return (
      <Form
        form={form}
        labelAlign="left"
        // initialValues={initialValues}
        className="affairs-flow-basic"
      >
        <span
          className={styles['app-expense-examine-flow-cc-title']}
        >固定抄送</span>
        <Form.Item
          label="可抄送部门/岗位"
          name="fixedDep"
          initialValue={initialValues.fixedDep}
        >
          <DepAndPostTreeSelect
            onChange={onChangeFixedDep}
          />
        </Form.Item>
        <Form.Item
          label="可抄送成员"
          name="fixedUser"
          initialValue={initialValues.fixedUser}
        >
          <User />
        </Form.Item>
        <span
          className={styles['app-expense-examine-flow-cc-title']}
        >灵活抄送</span>
        <Form.Item
          label="可抄送部门/岗位"
          name="flexibleDep"
          initialValue={initialValues.flexibleDep}
        >
          <DepAndPostTreeSelect
            onChange={onChangeFlexibleDep}
          />
        </Form.Item>
        <Form.Item
          label="可抄送成员"
          name="flexibleUser"
          initialValue={initialValues.flexibleUser}
        >
          <User />
        </Form.Item>
      </Form>
    );
  };

  // footer
  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button
          onClick={() => onClose()}
        >取消</Button>
        <Button
          onClick={() => onOk()}
          type="primary"
          loading={isLoading}
          style={{ marginLeft: 10 }}
        >确定</Button>
      </div>
    );
  };

  return (
    <Drawer
      title="审批人节点设置"
      visible={visible}
      onClose={onClose}
      getContainer={false}
      width={400}
      footer={renderFooter()}
    >
      <Form
        layout="vertical"
        form={form}
        className="affairs-flow-node"
      >
        {renderForm()}
      </Form>
      <Form form={form} className="affairs-flow-node">
        {renderReport()}
        {renderCooperation()}
      </Form>
      {renderSpecifyDep()}

      {/* 抄送 */}
      {renderCc()}
    </Drawer>
  );
};

export default connect()(NodeDrawer);
