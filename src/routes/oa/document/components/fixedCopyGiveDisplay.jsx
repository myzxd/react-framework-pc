/**
 * 固定抄送展示
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';

const FixedCopyGiveDisplay = ({
  flowId, fixedCopyGiveInfo, fetchFixedCopyGiveInfo, resetFixedCopyGiveInfo,
}) => {
  useEffect(
    () => {
      if (flowId) {
        // 获取固定抄送数据
        fetchFixedCopyGiveInfo(flowId);
        // 清空固定抄送数据
        return resetFixedCopyGiveInfo;
      }
    },
    [resetFixedCopyGiveInfo, fetchFixedCopyGiveInfo, flowId],
  );

  // 如果没数据，渲染‘无’
  if (!fixedCopyGiveInfo || Object.keys(fixedCopyGiveInfo).length < 1 || fixedCopyGiveInfo.length < 1) {
    return '无';
  }

  // 渲染固定抄送
  return (
    <span>
      {fixedCopyGiveInfo.reduce((acc, { name }, i) => {
        if (i === 0) return acc;
        return `${acc}, ${name}`;
      }, fixedCopyGiveInfo[0].name)}
    </span>
  );
};

const mapStateToProps = ({ oaCommon: { fixedCopyGiveInfo } }) => ({ fixedCopyGiveInfo });

const mapDispatchToProps = dispatch => ({
  fetchFixedCopyGiveInfo: flowId => dispatch({ type: 'oaCommon/fetchFixedCopyGiveInfo', payload: { flowId } }),
  resetFixedCopyGiveInfo: () => dispatch({ type: 'oaCommon/resetFixedCopyGiveInfo' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FixedCopyGiveDisplay);
