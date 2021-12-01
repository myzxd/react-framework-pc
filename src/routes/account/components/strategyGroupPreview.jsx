/**
 * 我的账户 - 角色数据授权 - 策略组预览
 */
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Table,
  Tabs,
  Button,
} from 'antd';

const { TabPane } = Tabs;

const TabKey = {
  code: 'code',
  team: 'team_code',
  subject: 'ac_code',
};

const StrategyGroupPreview = ({
  visible,
  onCancel,
  strategyGroupId,
  dispatch,
  strategyGroupList = {}, // 策略组
}) => {
  // tab key
  const [tabKey, setTabKey] = useState(TabKey.code);
  // table loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    strategyGroupId && (
      dispatch({
        type: 'accountManage/getStrategyGroupList',
        payload: {
          strategyGroupId,
          onSuccessCallback: () => setLoading(false),
        },
      })
    );

    return () => {
      dispatch({
        type: 'accountManage/resetStrategyGroupList',
        payload: {},
      });
    };
  }, [dispatch, strategyGroupId]);

  // 隐藏弹窗
  const onCancelModal = () => {
    dispatch({
      type: 'accountManage/resetStrategyGroupList',
      payload: {},
    });
    setLoading(true);
    setTabKey(TabKey.code);
    onCancel && onCancel();
  };

  // table
  const renderContent = (dataSource = [], type = 'code') => {
    let codeFileds = TabKey.code;
    // code
    type === TabKey.code && (codeFileds = TabKey.code);
    // team
    type === TabKey.team && (codeFileds = TabKey.team);
    // subject
    type === TabKey.subject && (codeFileds = TabKey.subject);

    // columns
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: 120,
      },
      {
        title: '编码',
        dataIndex: codeFileds,
        width: 120,
        render: text => (text || '--'),
      },
    ];

    return (
      <Table
        rowKey={(_, key) => key}
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        pagination={false}
        bordered
        scroll={{ y: 300 }}
      />
    );
  };

  // tabs
  const renderTabs = () => {
    const {
      code_acl: codeList = [], // code
      team_acl: teamList = [], // team
      ac_acl: subjectList = [], // subject
    } = strategyGroupList;

    return (
      <Tabs activeKey={tabKey} onChange={val => setTabKey(val)}>
        <TabPane tab="code" key={TabKey.code}>
          {renderContent(codeList, TabKey.code)}
        </TabPane>
        <TabPane tab="team" key={TabKey.team}>
          {renderContent(teamList, TabKey.team)}
        </TabPane>
        <TabPane tab="科目" key={TabKey.subject}>
          {renderContent(subjectList, TabKey.subject)}
        </TabPane>
      </Tabs>
    );
  };

  const footer = (
    <Button
      onClick={onCancelModal}
    >关闭</Button>
  );

  return (
    <Modal
      title="策略组预览"
      visible={visible}
      // // onOk={onCancelModal}
      onCancel={onCancelModal}
      width={710}
      footer={footer}
    >
      {renderTabs()}
    </Modal>
  );
};

const mapStateToProps = ({
  accountManage: { strategyGroupList },
}) => ({
  strategyGroupList,
});

export default connect(mapStateToProps)(StrategyGroupPreview);
