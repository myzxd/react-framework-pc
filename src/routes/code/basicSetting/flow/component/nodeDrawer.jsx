/**
 * code - 基础设置 - 审批流配置 - 审批流编辑 - 节点设置抽屉
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
  InputNumber,
  message,
} from 'antd';
import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';

import {
  Unit,
  AffairsFlowSpecifyApplyType,
  AffairsFlowNodeRelation,
  CodeFlowNodeConditionMoneyType,
  CodeFlowNodeConditionSubjectType,
  CodeMatterType,
  CodeFlowNodeOrganizationApproveType,
} from '../../../../../application/define';
import { dotOptimal } from '../../../../../application/utils';
import { CoreForm } from '../../../../../components/core';

import DepAndPostTreeSelect from './ccDrawer/depPostTreeSelect';
import User from './ccDrawer/user';
import DepTreeSelect from '../../../../expense/examineFlow/component/affairs/depTreeSelect';
import Post from './post';
import Subject from './subject';
import styles from '../style.less';

const { Option } = Select;

const NodeDrawer = ({
  visible,
  onClose,
  nodeId, // 节点id
  nodeList = [],
  updateFlowNode, // 更新节点方法
  flowId, // 审批流id
  getFlowNodeList,
  dispatch,
}) => {
  const [form] = Form.useForm();

  // 当前节点信息
  const data = nodeList.find(i => i._id === nodeId) || {};

  // 金额条件
  const moneySkip = dot.get(data, 'skip_condition', []).find(i => i.field === 'total_money') || {};
  // 科目条件
  const subjectSkip = dot.get(data, 'skip_condition', []).find(i => i.field === 'cost_accounting_id') || {};
  const subjectData = subjectSkip.data || [];

  // 指定关系
  const [relation, setRelation] = useState(data.node_approve_type);
  // 协作关系，指定部门，部门id
  const [depId, setDepId] = useState(data.approve_department_id);
  // 部门审批人类型
  const [depAccountType, setDepAccountType] = useState(data.approve_department_account_type || AffairsFlowSpecifyApplyType.principal);

  // 是否显示条件表单
  const [isShowConditionForm, setIsShowConditionForm] = useState(data.is_skip);
  // 金额 InputNumber disabled
  const [moneyDisabled, setMoneyDisabled] = useState(!moneySkip.opt);
  // 科目 select disabled
  const [subjectDisabled, setSubjectDisabled] = useState(!subjectSkip.opt);

  // button loading
  const [loading, setIsLoading] = useState(false);
  // 固定抄送 - 部门/岗位
  const [fixedDep, setFixedDep] = useState(undefined);
  // 灵活抄送 - 部门/岗位
  const [flexibleDep, setFlexibledDep] = useState(undefined);

  useEffect(() => {
    // 编辑时，设置默认值
    if (data && Object.keys(data).length > 0) {
      // 抄送信息
      const ccInfo = dotOptimal(data, 'carbon_copy_info', {});

      setFixedDep([
        ...dotOptimal(ccInfo, 'fixed_department_list', []).map(d => (
          { _id: d._id, jobId: undefined }
        )),
        ...dotOptimal(ccInfo, 'fixed_department_job_list', []).map(d => (
          { _id: d._id, jobId: d.job_info._id }
        )),
      ]);

      setFlexibledDep([
        ...dotOptimal(ccInfo, 'flexible_department_list', []).map(d => (
          { _id: d._id, jobId: undefined }
        )),
        ...dotOptimal(ccInfo, 'flexible_department_job_list', []).map(d => (
          { _id: d._id, jobId: d.job_info._id }
        )),
      ]);
    }
  }, [data]);

  if (!visible) return <div />;

  // 确定
  const onOk = async () => {
    const values = await form.validateFields();

    // 设置确认button状态为loading
    setIsLoading(true);
    updateFlowNode && updateFlowNode({
      ...values,
      nodeId,
      flowId,
      // 更改Loading，可以当做请求成功回调使用
      setIsLoading: async (resId) => {
        const ccRes = await dispatch({
          type: 'codeFlow/setCodeNodeCC',
          payload: {
            ...values,
            flowId,
            nodeId: resId,
            fixedDep,
            flexibleDep,
          },
        });

        // 设置抄送成功
        if (ccRes && ccRes._id) {
          message.success('请求成功');
          getFlowNodeList();
        }
        setIsLoading(false);
      },
    }, 'drawer', () => {
      // 如果失败 也要处理失败后的loading加载
      setIsLoading(false);
    });
  };

  // 指定部门，部门onChange
  const onChangeDep = (val) => {
    setDepId(val);
    if (depId !== val) {
      dispatch({ type: 'organizationStaffs/resetDepartmentStaffs', payload: {} });
    }
    form.setFieldsValue({ approveJobId: undefined });
  };

  // 部门审批人类型onChange
  const onChangeDepType = (val) => {
    setDepAccountType(val);
    form.setFieldsValue({ approveJobId: undefined });
  };

  // 金额条件onChange
  const onChangeMoneyCond = (val) => {
    form.setFieldsValue({ money: undefined });
    if (val) {
      setMoneyDisabled(false);
    } else {
      setMoneyDisabled(true);
    }
  };

  // 科目条件onChange
  const onChangeSubCond = (val) => {
    form.setFieldsValue({ subject: undefined });
    if (val) {
      setSubjectDisabled(false);
    } else {
      setSubjectDisabled(true);
    }
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

  // eslint-disable-next-line no-shadow
  const getCheckedNodes = (data = []) => {
    const res = [];
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((i) => {
        const assignment = (n) => {
          res[res.length] = {
            _id: n.node ?
              dotOptimal(n, 'node.props.value')
              : dotOptimal(n, 'props.value'),
            jobId: n.node ?
              dotOptimal(n, 'node.props.jobId')
            : dotOptimal(n, 'props.jobId'),
          };
          const leaf = n.node ?
            n.children
            : dotOptimal(n, 'props.children', []);

          if (leaf && Array.isArray(leaf)) {
            leaf.forEach(l => assignment(l));
          }
        };

        assignment(i);
      });
    }
    return res;
  };

  // 固定抄送 - 部门/岗位
  const onChangeFixedDep = (v, label, extra = {}) => {
    const { allCheckedNodes = [] } = extra;
    // 处理部门及岗位
    const fixedDepVal = getCheckedNodes(allCheckedNodes);

    setFixedDep(fixedDepVal);
  };

  // 灵活定抄送 - 部门/岗位
  const onChangeFlexibleDep = (v, label, extra = {}) => {
    const { allCheckedNodes = [] } = extra;
    // 处理部门及岗位
    const flexibleDepVal = getCheckedNodes(allCheckedNodes);

    setFlexibledDep(flexibleDepVal);
  };

  // 指定部门表单
  const renderSpecifyDep = () => {
    return (
      <React.Fragment>
        <div>指定部门</div>
        <Form form={form} layout="vertical" className="affairs-flow-node">
          <Form.Item
            name="approveDepartmentId"
            label="部门"
            rules={[{ required: true, message: '请选择' }]}
          >
            <DepTreeSelect onChange={val => onChangeDep(val)} />
          </Form.Item>
          <Form.Item
            name="approveDepartmentAccountType"
            label="部门审批人类型"
            rules={[{ required: true, message: '请选择' }]}
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
                  name="approveJobId"
                  className={styles['flow-node-radio-form-item']}
                  rules={[{
                    required: depAccountType === AffairsFlowSpecifyApplyType.post,
                    message: '请选择',
                  }]}
                >
                  <Post
                    departmentId={depId}
                    initValue={dot.get(data, 'approve_department_job_info', {})}
                    disabled={depAccountType === AffairsFlowSpecifyApplyType.principal}
                  />
                </Form.Item>
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </React.Fragment>
    );
  };

  // 按协作关系form
  const renderCooperation = () => {
    if (relation !== AffairsFlowNodeRelation.coopera) return '';
    return (
      <React.Fragment>
        <Form form={form} className="affairs-flow-node">
          <Form.Item
            label=""
            name="specifyDep"
          >
            <Radio.Group>
              <Radio
                value={CodeFlowNodeOrganizationApproveType.specialPost}
                className={styles['flow-node-radio-form-coopera']}
              >
                {CodeFlowNodeOrganizationApproveType.description(CodeFlowNodeOrganizationApproveType.specialPost)}
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
        {renderSpecifyDep()}
      </React.Fragment>
    );
  };

  // 直接领导人
  const renderDirectLender = () => {
    return (
      <Form form={form}>
        <Form.Item
          name="directLeader"
          label="部门审批人类型"
          rules={[
            { required: true },
          ]}
        >
          <Radio.Group>
            <Radio value={CodeFlowNodeOrganizationApproveType.directLeader}>
              直接领导
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    );
  };

  // 按汇报关系form
  const renderReport = () => {
    if (relation !== AffairsFlowNodeRelation.report) return '';
    return (
      <React.Fragment>
        <Form.Item
          name="upNode"
        >
          <Radio.Group>
            <Radio value={1}>
              上一节点审批人
            </Radio>
          </Radio.Group>
        </Form.Item>
        {renderDirectLender()}
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
      >
        <Input placeholder="请输入" autoComplete="off" />
      </Form.Item>,
      <Form.Item
        label="节点审批人设置"
        name="nodeApproveType"
        rules={[
          { required: true, message: '请输入节点名称' },
        ]}
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
    const ccInfo = dotOptimal(data, 'carbon_copy_info', {});

    const initialValues = {
      fixedDep: [
        ...dotOptimal(ccInfo, 'fixed_department_list', []).map(d => d._id), // 部门
        ...dotOptimal(ccInfo, 'fixed_department_job_list', []).map(r => r._id), // 岗位关系
      ], // 固定抄送 - 可抄送部门/岗位
      fixedUser: [...dotOptimal(ccInfo, 'fixed_account_list', []).map(a => a._id)], // 固定抄送 - 可抄送成员
      flexibleDep: [
        ...dotOptimal(ccInfo, 'flexible_department_list', []).map(d => d._id), // 部门
        ...dotOptimal(ccInfo, 'flexible_department_job_list', []).map(r => r._id), // 岗位关系
      ], // 灵活抄送 - 可抄送部门\岗位
      flexibleUser: [...dotOptimal(ccInfo, 'flexible_account_list', []).map(a => a._id)], // 灵活抄送 - 可抄送成员
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

  // 条件form
  const renderCondition = () => {
    // 金额条件
    const moneyCondForm = (
      <React.Fragment>
        <Form.Item
          label="金额条件"
          className="code-flow-form-customize-form"
        >
          <Form.Item
            name="moneyPrefix"
            style={{ width: '50%' }}
            dependencies={['isSkip', 'subjectPrefix']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    (getFieldValue('isSkip') &&
                      (value
                        || getFieldValue('subjectPrefix')
                      )
                    )
                    || (!getFieldValue('isSkip'))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject('请选择');
                },
              }),
            ]}
          >
            <Select
              placeholder="请选择"
              allowClear
              onChange={onChangeMoneyCond}
            >
              <Option
                value={CodeFlowNodeConditionMoneyType.lessThan}
              >{CodeFlowNodeConditionMoneyType.description(CodeFlowNodeConditionMoneyType.lessThan)}</Option>
              <Option
                value={CodeFlowNodeConditionMoneyType.moreThan}
              >{CodeFlowNodeConditionMoneyType.description(CodeFlowNodeConditionMoneyType.moreThan)}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="money"
            style={{ width: '45%' }}
            dependencies={['isSkip', 'moneyPrefix', 'subjectPrefix']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    (getFieldValue('isSkip') &&
                      (value
                        || (getFieldValue('subjectPrefix')
                          && !getFieldValue('moneyPrefix')
                        )
                      )
                    )
                    || !getFieldValue('isSkip')
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject('请填写');
                },
              }),
            ]}
          >
            <InputNumber
              min={0}
              precision={2}
              formatter={Unit.limitDecimalsFormatter}
              parser={Unit.limitDecimalsParser}
              style={{ width: '100%' }}
              disabled={moneyDisabled}
            />
          </Form.Item>
        </Form.Item>
        <div style={{ marginLeft: 60, marginBottom: 10 }}>满足条件跳过本节点</div>
      </React.Fragment>
    );

    // 科目条件
    const subjectCondForm = (
      <React.Fragment>
        <Form.Item
          label="科目条件"
        >
          <Form.Item
            name="subjectPrefix"
            dependencies={['isSkip', 'moneyPrefix']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    (
                      getFieldValue('isSkip') &&
                      (value
                        || getFieldValue('moneyPrefix')
                      )
                    )
                    || !getFieldValue('isSkip')
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject('请选择');
                },
              }),
            ]}
          >
            <Select
              placeholder="请选择"
              allowClear
              onChange={onChangeSubCond}
            >
              <Option
                value={CodeFlowNodeConditionSubjectType.notContain}
              >{CodeFlowNodeConditionSubjectType.description(CodeFlowNodeConditionSubjectType.notContain)}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="subject"
            dependencies={['isSkip', 'moneyPrefix', 'subjectPrefix']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    (
                      getFieldValue('isSkip') &&
                        ((Array.isArray(value) && value.length > 0)
                          || (getFieldValue('moneyPrefix')
                            && !getFieldValue('subjectPrefix')
                          )
                        )
                    )
                    || !getFieldValue('isSkip')
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject('请选择');
                },
              }),
            ]}
          >
            <Subject selectDisabled={subjectDisabled} type={[CodeMatterType.code, CodeMatterType.team]} />
          </Form.Item>
        </Form.Item>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Form.Item
          name="isSkip"
          label="条件跳过"
        >
          <Radio.Group onChange={e => setIsShowConditionForm(e.target.value)}>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
        {
          isShowConditionForm ?
            (
              <React.Fragment>
                {moneyCondForm}
                {subjectCondForm}
              </React.Fragment>
            ) : ''
        }
      </React.Fragment>
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
          loading={loading}
          onClick={() => onOk()}
          type="primary"
          style={{ marginLeft: 10 }}
        >确定</Button>
      </div>
    );
  };

  // initialValues
  const initialValues = {
    name: data.name, // 审批流名称
    nodeApproveType: data.node_approve_type, // 关系
    isSkip: data.is_skip || false, // 条件跳过
    upNode: 1,
    directLeader: CodeFlowNodeOrganizationApproveType.directLeader, // 按汇报关系，直接领导人
    specifyDep: CodeFlowNodeOrganizationApproveType.specialPost, // 指定部门
    approveDepartmentId: data.approve_department_id, // 部门id
    approveDepartmentAccountType: data.approve_department_account_type, // 指定部门类型
    approveJobId: dot.get(data, 'approve_department_job_info._id', undefined), // 岗位
    moneyPrefix: moneySkip.opt, // 金额条件前置
    money: moneySkip.num !== undefined ? ((moneySkip.num) / 100) : undefined, // 金额条件金额
    subjectPrefix: subjectSkip.opt, // 科目条件前置
    subject: subjectData.length > 0 ? subjectData.map(s => `${s._id}=${s.ac_code}`) : undefined, // 科目条件科目
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
        initialValues={initialValues}
        className="affairs-flow-node"
      >
        {renderForm()}
      </Form>
      {renderCooperation()}
      <Form form={form} className="affairs-flow-node">
        {renderReport()}
        {renderCondition()}
      </Form>
      {/* 抄送 */}
      {renderCc()}
    </Drawer>
  );
};

export default connect()(NodeDrawer);
