/**
 * Code/Team审批管理 - 付款类型配置管理 - 编辑链接弹窗
 */
/* eslint-disable import/no-dynamic-require */
import { connect } from 'dva';
import dot from 'dot-prop';
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  message,
  Button,
  Radio,
} from 'antd';

import Drawer from 'antd/lib/drawer';
import 'antd/lib/drawer/style/css.js';

import {
  CodeMatterType,
} from '../../../../../application/define';
import Flow from './flow';
import LinkIcon from './linkIcon';
import Subject from './subject';
import Team from './team';
import DepAndPost from './depAndPost';

const { TextArea } = Input;

// form layout
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const UpdateFlowLink = ({
  visible,
  onClose,
  dispatch,
  matterLinkDetail = {}, // 事项链接详情
  linkId, // 事项链接id
  tabKey, // 类型（code || team）
}) => {
  const [form] = Form.useForm();
  // 是否为编辑模式
  const [isUpdate, setIsUpdate] = useState(false);
  // 是否为初始状态
  const [isInitFlag, setIsInitFlag] = useState(true);
  // 部门与岗位的集合
  const [depAndPostVals, setDepAndPost] = useState([]);
  // flow id
  const [flowId, setFlowId] = useState(undefined);
  // subject list
  const [subject, setSubject] = useState(undefined);
  // 是否特定范围提报
  const [isAll, setIsAll] = useState(true);
  // button loading
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    linkId && dispatch({
      type: 'codeMatter/getMatterLinkDetail',
      payload: { linkId },
    });

    return () => {
      dispatch({ type: 'codeMatter/resetMatterLinkDetail' });
    };
  }, [dispatch, linkId]);

  useEffect(() => {
    if (Object.keys(matterLinkDetail).length > 0) {
      const {
        allow_department_list: depList = [], // 部门
        allow_department_job_list: depJobList = [], // 岗位
        flow_id: initFlowId, // 审批流
        allow_accouting_ids: allowAccoutingIds = [], // 科目
      } = matterLinkDetail;

      // 部门value
      const depVal = depList.map((d) => {
        return { value: d._id, name: d.name };
      });

      const depJobVal = depJobList.map((d) => {
        const { job_info: jobInfo = {} } = d;
        return { relaId: d._id, ...jobInfo };
      });

      const jobVal = depJobVal.map((j) => {
        return { value: j.relaId, name: j.name, jobId: j._id };
      });

      setDepAndPost([...depVal, ...jobVal]);

      initFlowId && setFlowId(initFlowId);
      allowAccoutingIds && setSubject(allowAccoutingIds);
    }
  }, [matterLinkDetail]);

  // onOk
  const onOk = async () => {
    // 编辑链接
    const vals = await form.validateFields();
    setIsLoading(true);
    const res = await dispatch({
      type: 'codeMatter/updateMatterLink',
      payload: { ...vals, linkId, depAndPostVals },
    });

    if (res && res._id) {
      message.success('请求成功');
      setIsUpdate(false);
      setDepAndPost([]);
      setIsLoading(false);
      onClose && onClose(res._id);
    } else if (res && res.zh_message) {
      message.error(res.zh_message);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  // onClose
  const onCloseDrawer = () => {
    setIsUpdate(false);
    onClose && onClose();
  };

  // onChangePage
  const onChangePage = () => {
    if (!isUpdate) {
      // 部门
      const depList = dot.get(matterLinkDetail, 'allow_department_ids', []) || [];
      // 岗位
      const jobList = dot.get(matterLinkDetail, 'allow_department_job_ids', []) || [];

      form.setFieldsValue({
        title: dot.get(matterLinkDetail, 'name', undefined),
        note: dot.get(matterLinkDetail, 'note', undefined),
        icon: dot.get(matterLinkDetail, 'icon', undefined),
        flowId: dot.get(matterLinkDetail, 'flow_id', undefined),
        subject: dot.get(matterLinkDetail, 'allow_accouting_ids', []),
        team: dot.get(matterLinkDetail, 'is_all_cost_center', false) ? ['*'] : dot.get(matterLinkDetail, 'allow_team_ids', []),
        code: dot.get(matterLinkDetail, 'is_all_cost_center', false) ? ['*'] : dot.get(matterLinkDetail, 'allow_code_ids', []),
        isAll: dot.get(matterLinkDetail, 'is_all', true),
        dep: [...depList, ...jobList],
      });
      setIsAll(dot.get(matterLinkDetail, 'is_all', undefined));
    }
    setIsUpdate(!isUpdate);
  };

  // flow onChange
  const onChangeFlowId = (val) => {
    setFlowId(val);
    // reset team
    form.setFieldsValue({ team: undefined, code: undefined });
  };

  // flow onChange
  const onChangeSubject = (val) => {
    setSubject(val);
    setIsInitFlag(false);
    // reset team
    form.setFieldsValue({ team: undefined, code: undefined });
  };

  // dep onChange
  const onChangeDep = (_, op, extra) => {
    const curVal = extra.triggerNode.props;
    setDepAndPost([...depAndPostVals, curVal]);
  };

  // 是否特定范围提报
  const onChangeIsAll = (val) => {
    setIsAll(val.target.value);
    setDepAndPost([]);
  };

  // detail
  const renderDetail = () => {
    const {
      allow_accouting_list: allowAccountingList = [],
    } = matterLinkDetail;

    // 科目name list
    let subjectVal = '--';
    if (Array.isArray(allowAccountingList) && allowAccountingList.length > 0) {
      subjectVal = allowAccountingList.map(info => info.name).join('，');
    }

    // 根据类型渲染对应字段
    const renderTypeInfo = () => {
      const {
        allow_code_list: codeList = [],
        allow_team_list: teamList = [],
      } = matterLinkDetail;
      // code
      if (Number(tabKey) === CodeMatterType.code) {
        const info = codeList.includes('*') ? '全部' : codeList.map(i => i.name).join('，');
        return (
          <Form.Item label="选择CODE" {...formLayout}>
            {info}
          </Form.Item>
        );
      }

      // team
      if (Number(tabKey) === CodeMatterType.team) {
        const info = teamList.includes('*') ? '全部' : teamList.map(i => i.name).join('，');
        return (
          <Form.Item label="选择TEAM" {...formLayout}>
            {info}
          </Form.Item>
        );
      }
    };

    // 部门或岗位
    const renderDepAndPost = () => {
      const {
        is_all: isDepAll,
        allow_department_list: depList = [], // 部门
        allow_department_job_list: depJobList = [], // 岗位
      } = matterLinkDetail;

      const jobList = Array.isArray(depJobList) ?
        depJobList.map(d => d.job_info) : [];

      // 是否特定范围提报为否，返回空
      if (isDepAll) return '';

      return (
        <Form.Item label="部门及岗位" {...formLayout}>
          {
            (Array.isArray(depList) && Array.isArray(jobList)) ?
              [...depList, ...jobList].map(i => i.name).join('，')
              : '--'
          }
        </Form.Item>
      );
    };

    return (
      <Form form={form} className="affairs-flow-node-time-line-form">
        <Form.Item label="标题" {...formLayout}>
          {dot.get(matterLinkDetail, 'name', '--')}
        </Form.Item>
        <Form.Item label="说明" {...formLayout}>
          {dot.get(matterLinkDetail, 'note', '--')}
        </Form.Item>
        <Form.Item label="icon" {...formLayout}>
          {
            dot.get(matterLinkDetail, 'icon', undefined)
            ? (
              <img
                role="presentation"
                src={require(`../../../static/${matterLinkDetail.icon}@1x.png`)}
              />
            ) : '--'
          }
        </Form.Item>
        <Form.Item label="请选择审批流" {...formLayout}>
          {dot.get(matterLinkDetail, 'flow_info.name', '--')}
        </Form.Item>
        <Form.Item label="启动选择科目" {...formLayout}>
          {subjectVal}
        </Form.Item>
        {/* 适用code或team */}
        {renderTypeInfo()}
        <Form.Item
          label="是否特定范围提报"
          {...formLayout}
        >
          {dot.get(matterLinkDetail, 'is_all') ? '否' : '是'}
        </Form.Item>
        {/* 部门或岗位 */}
        {renderDepAndPost()}
      </Form>
    );
  };

  // form
  const renderForm = () => {
    // 适用code或适用team
    const applicationType = Number(tabKey) === CodeMatterType.code ?
      (
        <Form.Item
          label="选择CODE"
          name="code"
          rules={[
            { required: true, message: '请选择' },
          ]}
          {...formLayout}
        >
          <Team
            flowId={flowId}
            subject={subject}
            tabKey={tabKey}
            initAllowCodeList={dot.get(matterLinkDetail, 'is_all_cost_center', false) ? [] : dot.get(matterLinkDetail, 'allow_code_list', [])}
            isInitFlag={isInitFlag}
          />
        </Form.Item>
      ) : (
        <Form.Item
          label="选择TEAM"
          name="team"
          rules={[
            { required: true, message: '请选择' },
          ]}
          {...formLayout}
        >
          <Team
            flowId={flowId}
            subject={subject}
            tabKey={tabKey}
            isInitFlag={isInitFlag}
            initAllowTeamList={dot.get(matterLinkDetail, 'is_all_cost_center', false) ? [] : dot.get(matterLinkDetail, 'allow_team_list', [])}
          />
        </Form.Item>
    );

    return (
      <Form
        form={form}
        className="affairs-flow-basic"
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[
            { required: true, message: '请输入' },
            { pattern: /^\S+$/, message: '标题不能包含空格' },
            { type: 'string', max: 20, message: '名称最多20字符' },
          ]}
          {...formLayout}
        >
          <Input placeholder="请输入" allowClear />
        </Form.Item>
        <Form.Item
          label="说明"
          name="note"
          rules={[
            { required: true, message: '请输入' },
          ]}
          className="code-flow-link-textArea"
          {...formLayout}
        >
          <TextArea allowClear placeholder="请输入" rows={4} />
        </Form.Item>
        <Form.Item
          label="icon"
          name="icon"
          rules={[
            { required: true, message: '请输入' },
          ]}
          {...formLayout}
        >
          <LinkIcon />
        </Form.Item>
        <Form.Item
          label="请选择审批流"
          name="flowId"
          rules={[
            { required: true, message: '请选择' },
          ]}
          {...formLayout}
        >
          <Flow
            type={tabKey}
            onChange={onChangeFlowId}
          />
        </Form.Item>
        <Form.Item
          label="启动选择科目"
          name="subject"
          rules={[
            { required: true, message: '请选择' },
          ]}
          {...formLayout}
        >
          <Subject
            type={tabKey}
            onChange={onChangeSubject}
          />
        </Form.Item>
        {applicationType}
        <Form.Item
          label="是否特定范围提报"
          name="isAll"
          {...formLayout}
        >
          <Radio.Group onChange={onChangeIsAll}>
            <Radio value={false}>是</Radio>
            <Radio value>否</Radio>
          </Radio.Group>
        </Form.Item>
        {
          !isAll && (
          <Form.Item
            label="部门及岗位"
            name="dep"
            rules={[
              { required: true, message: '请选择' },
            ]}
            {...formLayout}
          >
            <DepAndPost multiple onChange={onChangeDep} />
          </Form.Item>
          )
        }
      </Form>
    );
  };

  // title
  const title = isUpdate ? '编辑链接' : '查看链接';

  // button text
  const btnText = isUpdate ? '查看' : '修改';

  // footer
  const renderFooter = () => {
    // 编辑状态
    if (isUpdate) {
      return (
        <div style={{ textAlign: 'right' }}>
          <Button
            onClick={() => onCloseDrawer()}
          >取消</Button>
          <Button
            onClick={() => onOk()}
            type="primary"
            style={{ marginLeft: 10 }}
            loading={isLoading}
          >确定</Button>
        </div>
      );
      // 详情状态
    } else {
      return (
        <div style={{ textAlign: 'right' }}>
          <Button
            onClick={() => onCloseDrawer()}
          >取消</Button>
        </div>
      );
    }
  };

  return (
    <Drawer
      title={title}
      visible={visible}
      onClose={() => onCloseDrawer()}
      width={500}
      footer={renderFooter()}
    >
      <div style={{ textAlign: 'right', marginBottom: 10 }}>
        <Button type="primary" onClick={() => onChangePage()}>
          {btnText}
        </Button>
      </div>
      {isUpdate ? renderForm() : renderDetail()}
    </Drawer>
  );
};

const mapStateToProps = ({
  codeMatter: { matterLinkDetail },
}) => {
  return { matterLinkDetail };
};

export default connect(mapStateToProps)(UpdateFlowLink);
