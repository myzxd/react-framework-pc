/**
 * 切换组件
 */
import React from 'react';
import { Button } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import styles from '../style.less';

const InnerComponentNavigateWidget = ({ total, current, onChange }) => {
  const onChangeIndex = (index) => {
    // 设置最新索引
    if (onChange) {
      onChange(index);
    }
  };

  // 上一个
  const onPrev = () => {
    // 返回前一个文件
    let index = current - 1;
    // 判断当前是否已经是第一个文件
    if (current === 0) {
      // 返回的文件列表中的最后一个文件（自动循环）
      index = total - 1;
    }
    // 如果小于0，则返回第一个
    if (current < 0) {
      index = 0;
    }
    onChangeIndex(index);
  };

  // 下一个
  const onNext = () => {
    let index = current + 1;
    // 判断当前是否已经是最后一个文件
    if (current === total - 1) {
      // 返回的文件列表中的第一个文件（自动循环）
      index = 0;
    }
    onChangeIndex(index);
  };


  // 默认渲染无数据页面
  return (
    <React.Fragment key="navigate">
      <Button className={styles['app-comp-core-model-widgets-navigate-prev']} icon={<CaretLeftOutlined />} onClick={onPrev} />
      <Button className={styles['app-comp-core-model-widgets-navigate-next']} icon={<CaretRightOutlined />} onClick={onNext} />
    </React.Fragment>
  );
};

InnerComponentNavigateWidget.propTypes = {
  total: PropTypes.number.isRequired,     // 文件总数
  current: PropTypes.number.isRequired,   // 当前文件索引
  onChange: PropTypes.func,               // 设置最新索引
};

InnerComponentNavigateWidget.defaultProps = {
  onChange: () => { },
};

export default InnerComponentNavigateWidget;
