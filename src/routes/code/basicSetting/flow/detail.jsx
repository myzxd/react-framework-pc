/**
 * code - 基础设置 - 审批流管理 - 审批流详情页
 */
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Spin,
} from 'antd';

import BasicInfo from './component/basicInfo';
import NodeTimeLine from './component/nodeTimeLine';

const CodeDetail = ({
  dispatch,
  flowDetail = {}, // 审批流详情
  location = {},
  originCodeList = {},
  originTeamList = {},
}) => {
  // 审批流id
  const { flowId } = location.query;

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

  return (
    <React.Fragment>
      {/* 基本信息 */}
      <BasicInfo
        detail={flowDetail}
        originCodeList={originCodeList}
        originTeamList={originTeamList}
      />

      {/* 节点时间轴 */}
      <NodeTimeLine flowId={flowId} />

      <div style={{ textAlign: 'center' }}>
        <Button
          type="default"
          onClick={() => { window.location.href = '/#/Code/BasicSetting/Flow'; }}
        >返回</Button>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({
  codeFlow: { flowDetail, originTeamList, originCodeList },
}) => {
  return { flowDetail, originCodeList, originTeamList };
};

export default connect(mapStateToProps)(CodeDetail);
