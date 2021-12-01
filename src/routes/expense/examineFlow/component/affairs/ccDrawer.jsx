/**
 * 审批流设置，事务性审批流编辑页抄送抽屉
 */
import dot from 'dot-prop';
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Form, message } from 'antd';
import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';
import { utils } from '../../../../../application';

import DepAndPostTreeSelect from './depPostTreeSelect';
import User from './user';

import styles from './style.less';

const CcDrawer = ({
  visible,
  onClose,
  dispatch,
  flowId, // 审批流id
  nodeId, // 节点id
  nodeList = [], // 节点list
  getAffairsFlowNodeList, // 获取节点列表
}) => {
  const [form] = Form.useForm();
  // button loading
  const [isLoading, setIsLoading] = useState(false);
  // 固定抄送 - 部门/岗位
  const [fixedDep, setFixedDep] = useState(undefined);
  // 灵活抄送 - 部门/岗位
  const [flexibleDep, setFlexibledDep] = useState(undefined);

  // 当前节点信息
  const nodeInfo = nodeList.find(i => i.id === nodeId) || {};

  // 节点名称、节点index_num
  const { indexNum, name } = nodeInfo;

  // 是否是提报节点（提报节点抄送不需要传节点id）
  const isReportNode = indexNum === 0 && name === '提报节点';

  // 提报节点直接获取抄送字段，正常节点需从cc_list中获取
  const data = nodeInfo.indexNum === 0 ? nodeInfo : dot.get(nodeInfo, 'ccList.0', {});

  useEffect(() => {
    // 编辑时，设置默认值
    if (data && Object.keys(data).length > 0) {
      const {
        fixedCcDepartmentJobRelationInfoList = [],
        fixedCcDepartmentInfoList = [],
        flexibleCcDepartmentJobRelationInfoList = [],
        flexibleCcDepartmentInfoList = [],
      } = data;

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

  const {
      fixedCcAccountInfoList = [],
      fixedCcDepartmentJobRelationInfoList = [],
      fixedCcDepartmentInfoList = [],
      flexibleCcAccountInfoList = [],
      flexibleCcDepartmentJobRelationInfoList = [],
      flexibleCcDepartmentInfoList = [],
    } = data;

  // onOk
  const onOk = async () => {
    const values = await form.validateFields();

    setIsLoading(true);

    const res = await dispatch({
      type: 'expenseExamineFlow/setApplicationNodeCC',
      payload: {
        ...values,
        flowId,
        nodeId: isReportNode ? undefined : nodeId,
        fixedDep, // 固定抄送 - 部门/岗位
        flexibleDep, // 灵活抄送 - 部门/岗位
      },
    });

    if (res && res.ok) {
      message.success('请求成功');
      getAffairsFlowNodeList && getAffairsFlowNodeList();
    }

    if (res && res.zh_message) {
      message.error(res.zh_message);
    }

    setIsLoading(false);

    onClose();
  };

  // eslint-disable-next-line no-shadow
  const getCheckedNodes = (data = []) => {
    const res = [];
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((i) => {
        const assignment = (n) => {
          res[res.length] = {
            _id: n.node ?
              utils.dotOptimal(n, 'node.props.value')
              : utils.dotOptimal(n, 'props.value'),
            jobId: n.node ?
              utils.dotOptimal(n, 'node.props.jobId')
            : utils.dotOptimal(n, 'props.jobId'),
          };
          const leaf = n.node ?
            n.children
            : utils.dotOptimal(n, 'props.children', []);

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

  // 固定抄送 - 部门/岗位
  const onChangeFlexibleDep = (v, label, extra = {}) => {
    const { allCheckedNodes = [] } = extra;
    // 处理部门及岗位
    const flexibleDepVal = getCheckedNodes(allCheckedNodes);

    setFlexibledDep(flexibleDepVal);
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
    <Drawer
      title="抄送设置"
      visible={visible}
      onClose={onClose}
      getContainer={false}
      width={400}
      footer={renderFooter()}
    >
      <Form
        form={form}
        labelAlign="left"
        initialValues={initialValues}
        className="affairs-flow-basic"
      >
        <span
          className={styles['app-expense-examine-flow-cc-title']}
        >固定抄送</span>
        <Form.Item
          label="可抄送部门/岗位"
          name="fixedDep"
        >
          <DepAndPostTreeSelect
            onChange={onChangeFixedDep}
          />
        </Form.Item>
        <Form.Item
          label="可抄送成员"
          name="fixedUser"
        >
          <User />
        </Form.Item>
        <span
          className={styles['app-expense-examine-flow-cc-title']}
        >灵活抄送</span>
        <Form.Item
          label="可抄送部门/岗位"
          name="flexibleDep"
        >
          <DepAndPostTreeSelect
            onChange={onChangeFlexibleDep}
          />
        </Form.Item>
        <Form.Item
          label="可抄送成员"
          name="flexibleUser"
        >
          <User />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default connect()(CcDrawer);
