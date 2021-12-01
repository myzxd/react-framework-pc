/**
 * 核心组件，tab切换
 */
import is from 'is_js';
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import styles from './style/index.less';

const TabPane = Tabs.TabPane;

const TabKeyShape = PropTypes.oneOfType([
  PropTypes.string, PropTypes.number,
]);

const CoreTabs = (props = {}) => {
  const {
    items,                                 // 内容
    type,                              // 页签的基本样式, 默认使用
    operations,                          // tab的操作扩展
    style,                                 // 样式
    size,                           // 大小
    onChange,                        // 切换事件的回调
    defaultActiveKey,
    activeKey,
  } = props;

  // 切换tab的调用
  const onChangeCallback = (key) => {
    if (onChange) {
      onChange(key);
    }
  };

  // 渲染标签页
  const renderTabItems = () => {
    // 判断内容是否为空
    if (is.empty(items) || is.not.existy(items) || is.not.array(items)) {
      return <div />;
    }

    // 标签页的内部内容
    return items.map((item, index) => {
      let { title, key, forceRender } = item;
      const { content, disabled } = item;

      // 判断标题
      if (is.empty(title) || is.not.existy(title)) {
        title = `标签页 ${index}`;
      }

      // 判断key（如果默认的key没有传入，则根据标签页的顺序返回key）
      if (is.empty(key) || is.not.existy(key)) {
        key = index;
      }

      // 判断forceRender是否为true，如果是则开启被隐藏时渲染DOM结构
      if (is.empty(forceRender) || is.not.existy(forceRender)) {
        forceRender = false;
      }
      return <TabPane tab={title} key={key} disabled={disabled} forceRender={forceRender}>{content}</TabPane>;
    });
  };

  const params = {
    type,
    size,
    defaultActiveKey,
    animated: false,
    onChange: onChangeCallback,
    tabBarExtraContent: operations,
  };

  // 判断是否有已经激活的tab，如果已经激活了，则使用activeKey
  if (activeKey) {
    params.activeKey = activeKey;
  }

  return (
    <div className={styles['app-comp-core-tabs-container']} style={style}>
      <Tabs {...params}>
        {renderTabItems()}
      </Tabs>
    </div>
  );
};

CoreTabs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    key: TabKeyShape,                        // 唯一标示
    title: PropTypes.node,                   // 标题
    content: PropTypes.node,                 // 内容
  })),                                       // 内容
  style: PropTypes.object,                   // 样式
  type: PropTypes.string,                    // 页签的基本样式, 默认使用
  size: PropTypes.string,                    // 大小
  defaultActiveKey: TabKeyShape,             // 初始化选中面板的 key
  activeKey: TabKeyShape,                    // 当前激活 tab 面板的 key
  operations: PropTypes.node,                // tab的操作扩展
  onChange: PropTypes.func,
};

CoreTabs.defaultProps = {
  items: [],                                 // 内容
  type: 'line',                              // 页签的基本样式, 默认使用
  operations: null,                          // tab的操作扩展
  style: {},                                 // 样式
  size: 'default',                           // 大小
  onChange: () => { },
};

// 上一版 module.exports = CoreTabs;
export default CoreTabs;
