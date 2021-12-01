/**
 * Code/Team审批管理 - 付款类型配置管理 - 内容
 */
import React from 'react';
import MatterBasic from './component/matterBasic';
import MatterLink from './component/matterLink';

const TypeContent = ({
  matterId, // 选中的事项
  tabKey, // 类型（code || team）
}) => {
  // 事项id
  const props = {
    matterId,
    tabKey,
  };

  return (
    <React.Fragment>
      {/* 事项详情 */}
      <MatterBasic {...props} />
      {/* 事项链接列表 */}
      <MatterLink {...props} />
    </React.Fragment>
  );
};

export default TypeContent;
