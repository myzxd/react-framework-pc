/**
 * 审批流设置，费用审批流编辑页抄送抽屉
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Form, message } from 'antd';
import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';
import { dotOptimal } from '../../../../../../application/utils';

import DepAndPostTreeSelect from './depPostTreeSelect';
import User from './user';

import styles from '../../style.less';

const CcDrawer = ({
  visible,
  onClose,
  dispatch,
  flowId, // 审批流id
  nodeInfo, // 当前节点信息
  nodeId, // 节点id
  getAffairsFlowNodeList, // 获取节点列表
  isReportNodeState, // 当前节点是否是提报节点
}) => {
  const [form] = Form.useForm();
  // button loading
  const [isLoading, setIsLoading] = useState(false);
  // 固定抄送 - 部门/岗位
  const [fixedDep, setFixedDep] = useState(undefined);
  // 灵活抄送 - 部门/岗位
  const [flexibleDep, setFlexibledDep] = useState(undefined);

  useEffect(() => {
    // 编辑时，设置默认值
    if (nodeInfo && Object.keys(nodeInfo).length > 0) {
      setFixedDep([
        ...dotOptimal(nodeInfo, 'fixed_department_list', []).map(d => (
          { _id: d._id, jobId: undefined }
        )),
        ...dotOptimal(nodeInfo, 'fixed_department_job_list', []).map(d => (
          { _id: d._id, jobId: d.job_info._id }
        )),
      ]);

      setFlexibledDep([
        ...dotOptimal(nodeInfo, 'flexible_department_list', []).map(d => (
          { _id: d._id, jobId: undefined }
        )),
        ...dotOptimal(nodeInfo, 'flexible_department_job_list', []).map(d => (
          { _id: d._id, jobId: d.job_info._id }
        )),
      ]);
    }
  }, [nodeInfo]);

  // onOk
  const onOk = async () => {
    const values = await form.validateFields();

    setIsLoading(true);

    const res = await dispatch({
      type: 'codeFlow/setCodeNodeCC',
      payload: {
        ...values,
        flowId,
        nodeId: isReportNodeState ? undefined : nodeId,
        fixedDep, // 固定抄送 - 部门/岗位
        flexibleDep: isReportNodeState ? [] : flexibleDep, // 灵活抄送 - 部门/岗位
      },
    });

    if (res && res._id) {
      message.success('请求成功');
      getAffairsFlowNodeList && getAffairsFlowNodeList();
      dispatch({
        type: 'codeFlow/getApplicantNodeCc',
        payload: { flowId },
      });
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

  // 灵活抄送 - 部门/岗位
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
        className="affairs-flow-basic"
      >
        <span
          className={styles['app-expense-examine-flow-cc-title']}
        >固定抄送</span>
        <Form.Item
          label="可抄送部门/岗位"
          name="fixedDep"
          initialValue={[
            ...dotOptimal(nodeInfo, 'fixed_department_list', []).map(d => d._id), // 部门
            ...dotOptimal(nodeInfo, 'fixed_department_job_list', []).map(r => r._id), // 岗位关系
          ]}
        >
          <DepAndPostTreeSelect
            onChange={onChangeFixedDep}
          />
        </Form.Item>
        <Form.Item
          label="可抄送成员"
          name="fixedUser"
          initialValue={[...dotOptimal(nodeInfo, 'fixed_account_list', []).map(a => a._id)]}
        >
          <User />
        </Form.Item>
        {
          // 提报节点不显示灵活抄送
          isReportNodeState
          ? null
          : <React.Fragment>
            <span
              className={styles['app-expense-examine-flow-cc-title']}
            >灵活抄送</span>
            <Form.Item
              label="可抄送部门/岗位"
              name="flexibleDep"
              initialValue={[
                ...dotOptimal(nodeInfo, 'flexible_department_list', []).map(d => d._id), // 部门
                ...dotOptimal(nodeInfo, 'flexible_department_job_list', []).map(r => r._id), // 岗位关系
              ]}
            >
              <DepAndPostTreeSelect
                onChange={onChangeFlexibleDep}
              />
            </Form.Item>
            <Form.Item
              label="可抄送成员"
              name="flexibleUser"
              initialValue={[...dotOptimal(nodeInfo, 'flexible_account_list', []).map(a => a._id)]}
            >
              <User />
            </Form.Item>
          </React.Fragment>
        }
      </Form>
    </Drawer>
  );
};

export default connect()(CcDrawer);
