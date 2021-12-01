/**
 * 审批流设置，事务性审批流编辑页入口
 */
import { connect } from 'dva';
import React, { useRef, useState } from 'react';
import is from 'is_js';
import {
  Button,
  Tabs,
  message,
} from 'antd';

import BasicForm from './basicForm';
import NodeForm from './nodeForm';
import style from './style.less';
import { utils } from '../../../../../application';

const { TabPane } = Tabs;

const AffairsFlowKey = {
  detail: '1',
  node: '2',
};

const AffairsFlow = ({
  examineDetail = {}, // 审批流详情
  flowId, // 审批流id
  dispatch,
}) => {
  const formRef = useRef();
  // 操作类型
  const isUpdate = Array.isArray(examineDetail.applyApplicationTypes) && examineDetail.applyApplicationTypes.length > 0;

  // button loading
  const [isLoading, setIsLoading] = useState(false);
  // button loading
  const [isEnableLoading, setIsEnableLoading] = useState(false);
  // 当前选中的tab key
  const [tabKey, setTabKey] = useState(AffairsFlowKey.detail);
  // 可操作tab key
  const [tabKeys, setTabKeys] = useState(isUpdate ? [AffairsFlowKey.detail, AffairsFlowKey.node] : [AffairsFlowKey.detail]);

  // 无数据
  if (Object.keys(examineDetail).length < 1) {
    return <div />;
  }

  // 保存
  const onSave = async () => {
    const values = await formRef.current.validateFields();

    await setIsLoading(true);

    const res = await dispatch({
      type: 'expenseExamineFlow/updateAffairsFlow',
      payload: { flowId, ...values },
    });

    if (res && res.ok) {
      message.success('请求成功');
      setIsLoading(false);
      // onJump();
    }

    if (res && res.zh_message) {
      setIsLoading(false);
      message.error(res.zh_message);
    }
  };

  // 确定并启用（两个接口，提交和启用接口）
  const onSubmitEnable = () => {
    const { flowNodes = [] } = examineDetail;
    formRef.current.validateFields().then(async (values) => {
      setIsEnableLoading(true);
      // 判断节点是否为空
      if (flowNodes.length === 0) {
        setIsEnableLoading(false);
        return message.error('无法启用:该审批流节点设置为空,请设置审批流节点');
      }
      // 提交审批流接口
      const res = await dispatch({
        type: 'expenseExamineFlow/updateAffairsFlow',
        payload: { flowId, ...values },
      });
      if (res && res.ok) {
        // 启用审批流接口
        dispatch({
          type: 'expenseExamineFlow/updateExamineFlowByEnable',
          payload: {
            flowId,
            // 成功回调
            onSuccessCallback: () => {
              setIsEnableLoading(false);
              // 返回列表
              onJump();
            },
            // 错误提示
            onFailureCallback: (result) => {
              setIsEnableLoading(false);
              if (result && result.zh_message) {
                message.error(res.zh_message);
              }
            },
          } });
        return;
      }
      if (res && res.zh_message) {
        setIsEnableLoading(false);
        message.error(res.zh_message);
        return;
      }
      setIsEnableLoading(false);
    }).catch((err) => {
      setIsEnableLoading(false);
      // 判断tab是否为审批流节点设置，并且form报错是否有值
      if (tabKey === AffairsFlowKey.node && is.existy(err) && is.not.empty(err)) {
        return message.error('审批流详情请填写完毕');
      }
    });
  };

  // 跳转页面
  const onJump = () => {
    window.location.href = '/#/Expense/ExamineFlow/Process?isSetStorageSearchValue=true';
  };

  // 下一步
  const onDownStep = async () => {
    const values = await formRef.current.validateFields();
    await setIsLoading(true);

    // 更新审批流基本信息
    const res = await dispatch({
      type: 'expenseExamineFlow/updateAffairsFlow',
      payload: { flowId, ...values },
    });

    setIsLoading(false);

    if (res && res.ok) {
      message.success('请求成功');

      // 获取审批流详情
      await dispatch({
        type: 'expenseExamineFlow/fetchExamineDetail',
        payload: { id: utils.dotOptimal(res, 'record._id') },
      });

      // 设置可操作tab key
      const curTabKeys = tabKeys.includes(AffairsFlowKey.node) ? tabKeys : [...tabKeys, AffairsFlowKey.node];
      setTabKeys(curTabKeys);
      setTabKey(AffairsFlowKey.node);
    }

    if (res && res.zh_message) {
      message.error(res.zh_message);
    }
  };

  // 操作
  const renderOperate = () => {
    // 新建审批流基本信息表单tab操作
    if (!isUpdate && tabKey === AffairsFlowKey.detail) {
      return (
        <div className={style['affairs-flow-tab-scroll-button']}>
          <Button
            onClick={() => onJump()}
            style={{ marginRight: 30 }}
          >取消</Button>
          <Button
            onClick={onDownStep}
            type="primary"
            loading={isLoading}
          >下一步</Button>
        </div>
      );
    }

    // 编辑审批流基本信息表单tab操作
    if (isUpdate && tabKey === AffairsFlowKey.detail) {
      return (
        <div className={style['affairs-flow-tab-scroll-button']}>
          <Button
            onClick={() => onJump()}
            style={{ marginRight: 30 }}
          >取消</Button>
          <Button
            onClick={onSave}
            type="primary"
            loading={isLoading}
          >确定</Button>
          <Button
            style={{ marginLeft: 30 }}
            onClick={onSubmitEnable}
            type="primary"
            loading={isEnableLoading}
          >确定并启用</Button>
        </div>
      );
    }

    // 审批流节点信息表单tab操作
    return (
      <div className={style['affairs-flow-tab-scroll-button']}>
        <Button
          onClick={() => onJump()}
          style={{ marginRight: 30 }}
        >取消</Button>
        <Button
          onClick={() => onJump()}
          type="primary"
        >确定</Button>
        <Button
          style={{ marginLeft: 30 }}
          onClick={onSubmitEnable}
          type="primary"
          loading={isEnableLoading}
        >确定并启用</Button>
      </div>
    );
  };
  return (
    <div
      className="contract-content-wrap"
      style={{ height: '100%' }}
    >
      {/* 基本信息表单 */}
      <div className="contract-content-wrap" style={{ height: '100%' }}>
        <Tabs
          activeKey={tabKey}
          onChange={key => setTabKey(key)}
          style={{ height: '100%' }}
        >
          <TabPane
            tab="审批流详情设置"
            key={AffairsFlowKey.detail}
          >
            <div
              className={style['affairs-flow-tab-content-wrap']}
            >
              <div className={style['affairs-flow-tab-scroll-content']}>
                <BasicForm
                  ref={formRef}
                  examineDetail={examineDetail}
                />
              </div>

              {/* 操作 */}
              {renderOperate()}
            </div>
          </TabPane>
          <TabPane
            tab="审批流节点设置"
            key={AffairsFlowKey.node}
            disabled={!tabKeys.includes(AffairsFlowKey.node)}
          >
            <div className={style['affairs-flow-tab-content-wrap']}>
              <div className={style['affairs-flow-tab-scroll-content']}>
                <NodeForm
                  formRef={formRef}
                  scenseType={formRef.current && formRef.current.getFieldValue('scense')}
                  flowId={flowId}
                  examineDetail={examineDetail}
                />
              </div>

              {/* 操作 */}
              {renderOperate()}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default connect()(AffairsFlow);
