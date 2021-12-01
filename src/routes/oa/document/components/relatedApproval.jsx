/**
 *
 * tab组件
 * tab1 关联审批列表
 * tab2 主题标签
 */
import React from 'react';
import PropTypes from 'prop-types';

import { CoreTabs } from '../../../../components/core';
import ComponentThemeTags from './themeTags';       // 主题标签
import ComponentApprovalInfo from './approvalInfo'; // 关联审批列表

function ComponentRelatedApproval(props) {
  const { isShowThemeTag, formItemsTags, isType, setParentIds, orderId, setThemeTag } = props;
  // tab: 渲染关联信息和主题标签tab
  const renderTab = () => {
    const tabItems = [
      // 关联审批
      {
        title: '关联审批',
        content: <ComponentApprovalInfo isType={isType} orderId={orderId} setParentIds={setParentIds} key="1" />,
        key: 'relateOrder',
      },
    ];

    // true 显示 false不显示
    if (isShowThemeTag) {
      tabItems.splice(1, 0, // 主题标签
        {
          title: '主题标签',
          content: <ComponentThemeTags setThemeTag={setThemeTag} formItemsTags={formItemsTags} />,
          key: 'themeLabel',
        });
    }


    return (
      <CoreTabs items={tabItems} />
    );
  };

  return (
    <div style={{ margin: '10px 0' }}>
      {/* 关联审批列表和主题标签切换tab */}
      {renderTab()}
    </div>
  );
}

ComponentRelatedApproval.propTypes = {
  isType: PropTypes.string,
  orderId: PropTypes.string,
  setParentIds: PropTypes.func,
  formItemsTags: PropTypes.array,
  isShowThemeTag: PropTypes.bool,
  setThemeTag: PropTypes.func,
};

ComponentRelatedApproval.defaultProps = {
  isType: '',             // 当前页面类型
  orderId: '',            // 当前审批单id
  setParentIds: () => {}, // 存储当前要关联的审批单id *上级组件传下来的 setState函数
  formItemsTags: [],      // 传过来的FormItem 表单
  isShowThemeTag: true,   // 默认显示主题标签tab
  setThemeTag: () => {},  // 设置主题标签内容
};
export default ComponentRelatedApproval;
