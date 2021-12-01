/**
 * code - 基础设置 - 审批流管理 - 审批流编辑页
 */
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Spin } from 'antd';

import BasicForm from './component/basicForm';
import NodeForm from './component/nodeForm';

const CodeFlowForm = ({
  flowDetail = {}, // 审批流详情
  dispatch,
  location,
  originCodeList = {},
  originTeamList = {},
}) => {
  // 审批流id
  const flowId = dot.get(location, 'query.flowId', undefined);
  const [flowLoading, onChangeFlowLoading] = useState(true);
  const [codeLoading, onChangeCodeLoading] = useState(true);
  const [teamLoading, onChangeTeamLoading] = useState(true);

  useEffect(() => {
    flowId && dispatch({
      type: 'codeFlow/getFlowDetail',
      payload: {
        id: flowId,
        // 成功回调
        onLoading: () => {
          onChangeFlowLoading(false);
        },
      },
    });

    dispatch({
      type: 'codeFlow/getFlowCodeList',
      payload: {
        // 成功回调
        onLoading: () => {
          onChangeCodeLoading(false);
        },
      },
    });

    dispatch({
      type: 'codeFlow/getFlowTeamList',
      payload: {
        // 成功回调
        onLoading: () => {
          onChangeTeamLoading(false);
        },
      },
    });

    return () => {
      dispatch({ type: 'codeFlow/resetFlowDetail' });
      dispatch({ type: 'codeFlow/resetFlowCodeList' });
      dispatch({ type: 'codeFlow/resetFlowTeamList' });
      onChangeFlowLoading(true);
      onChangeCodeLoading(true);
      onChangeTeamLoading(true);
    };
  }, [dispatch, flowId]);

  const formRef = useRef();
  // 无数据显示loading
  if (flowLoading || codeLoading || teamLoading) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      ><Spin /></div>
    );
  }

  // 保存
  const onSave = async () => {
    const values = await formRef.current.validateFields();
    const res = await dispatch({
      type: 'codeFlow/updateFlow',
      payload: { flowId, ...values, originCodeList, originTeamList },
    });
    if (res && res._id) {
      message.success('请求成功');
      onJump();
    } else {
      res.zh_message && message.error(res.zh_message);
    }
  };

  // 跳转页面
  const onJump = () => {
    window.location.href = '/#/Code/BasicSetting/Flow';
  };

  return (
    <div>
      {/* 基本信息表单 */}
      <BasicForm
        ref={formRef}
        flowDetail={flowDetail}
        isUpdate={Boolean(flowId)}
        originTeamList={originTeamList}
        originCodeList={originCodeList}
      />
      {/* 节点信息表单 */}
      <NodeForm
        formRef={formRef}
        flowId={flowId}
        flowDetail={flowDetail}
      />

      {/* 操作 */}
      <div style={{ textAlign: 'center' }}>
        <Button
          onClick={() => onJump()}
          style={{ marginRight: 30 }}
        >取消</Button>
        <Button
          onClick={onSave}
          type="primary"
        >确定</Button>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  codeFlow: { flowDetail, originCodeList, originTeamList },
}) => {
  return { flowDetail, originCodeList, originTeamList };
};

export default connect(mapStateToProps)(CodeFlowForm);
