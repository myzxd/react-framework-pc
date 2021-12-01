/**
 * 渲染审批流预览流程名称组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import is from 'is_js';

function ComponentRenderFlowNames({ examineFlowInfo = [] }) {
  if (is.not.empty(examineFlowInfo) && Array.isArray(examineFlowInfo)) {
    return <span>流程名称：{dot.get(examineFlowInfo, '0.flow_name', '')}</span>;
  }
  return <React.Fragment />;
}

PropTypes.propTypes = {
  examineFlowInfo: PropTypes.array,
};
PropTypes.defaultProps = {
  examineFlowInfo: [], // 审批流列表数据
};

export default ComponentRenderFlowNames;
