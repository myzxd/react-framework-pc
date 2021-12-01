/**
 * 批量变更team
 */
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'dva';

import {
  Modal,
  Button,
  Form,
  message,
} from 'antd';

import Team from '../../components/form/updata/components/codeTeam';
import TeamType from '../../components/form/updata/components/codeTeamType';

import style from '../style.css';

// form layout
const formLayout = { labelCol: { span: 5 }, wrapperCol: { span: 16 } };

const ChangeTeam = ({
  dispatch,
  selectedRowKeys,
  disabled,
  onSuccessCallback,
  fileType,
}) => {
  const [form] = Form.useForm();
  // 变更team内容弹窗visible
  const [contentVis, setContentVis] = useState(false);
  // 变更team内容弹窗visible
  const [promptVis, setPromptVis] = useState(false);
  // 变更team内容弹窗visible
  const [promentContent, setPromptContent] = useState({});
  // team类型
  const [teamType, setTeamType] = useState(undefined);

  // 提交
  const onSave = async () => {
    const formVals = await form.validateFields();

    const res = await dispatch({
      type: 'employeeManage/changeTeam',
      payload: {
        ...formVals,
        ids: selectedRowKeys,
        fileType,
      },
    });

    if (res && Object.keys(res).length > 0 && !res.zh_message) {
      setContentVis(false);
      form.resetFields();
      setPromptContent(res);
      setPromptVis(true);
    }

    if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  };

  // 隐藏提示弹窗
  const onCancelPromptModal = () => {
    setPromptVis(false);
    setPromptContent({});
    onSuccessCallback && onSuccessCallback();
  };

  // 变更内容弹窗
  const renderContentModal = () => {
    return (
      <Modal
        title="变更TEAM"
        visible={contentVis}
        onOk={onSave}
        onCancel={() => setContentVis(false)}
      >
        <div
          className={style['employee-change-team-title']}
        >变更后TEAM</div>
        <Form form={form} className="affairs-flow-basic">
          <Form.Item
            label="变更月份"
            {...formLayout}
          >{moment().format('YYYY-MM')}</Form.Item>
          <Form.Item
            label="team类型"
            name="type"
            {...formLayout}
          >
            <TeamType
              placeholder="请选择"
              showSearch
              allowClear
              optionFilterProp="children"
              onChange={val => setTeamType(val)}
            />
          </Form.Item>
          <Form.Item
            label="team名称"
            name="name"
            {...formLayout}
          >
            <Team
              placeholder="请选择"
              codeTeamType={teamType}
              namespace="batchChangeTeam"
              showSearch
              allowClear
              optionFilterProp="children"
            />
          </Form.Item>
        </Form>
        <div
          className={style['employee-change-team-note']}
        >
          {
            fileType === 'staff' ?
              '变更team后即时生效，请慎重调整'
              : '仅对本月二线身份的TEAM归属变更生效'
          }
        </div>
      </Modal>
    );
  };

  // 提交后提示弹窗
  const renderPromptModal = () => {
    const {
      success_count: success = 0,
      fail_count: error = 0,
      fail_names: errorContent,
    } = promentContent;
    return (
      <Modal
        title="提示"
        visible={promptVis}
        onOk={() => onCancelPromptModal()}
        onCancel={() => onCancelPromptModal()}
      >
        <div>{`已成功替换${success}个`}</div>
        <div>
          {
            fileType === 'staff' ?
              `未成功替换${error}个`
              : `不符合变更规则共${error}个`
          }
          {
            Array.isArray(errorContent) && errorContent.length > 0 ?
              (
                <span>
                  ，包含：
                  {errorContent.map(i => i).join('、')}
                </span>
              )
              : ''
          }
        </div>
      </Modal>
    );
  };

  return (
    <React.Fragment>
      <Button
        style={{ marginRight: 5 }}
        type="primary"
        disabled={disabled}
        onClick={() => setContentVis(true)}
      >
        批量变更TEAM
      </Button>

      {/* 变更内容弹窗 */}
      {renderContentModal()}

      {/* 提交后提示弹窗 */}
      {renderPromptModal()}
    </React.Fragment>
  );
};

export default connect()(ChangeTeam);
