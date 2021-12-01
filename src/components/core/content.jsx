/**
 * 核心组件，内容容器
 */
import React from 'react';
import PropTypes from 'prop-types';
import is from 'is_js';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Row, Col, Tooltip } from 'antd';
import styles from './style/index.less';

// 转换16进制颜色到rgba
const hexToRGB = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
};

// 默认颜色
const DefaultColors = Object.freeze({
  color: '#FAFAFA',
  spinColor: '#E4E4E4',
});

const CoreContent = ({
  title, color, titleTip, titleExt, isShowIcon, children, footer,
  style, isLinear, className, ...restProps
}) => {
  const renderHeader = () => {
    // 判断是否显示标题
    if (is.not.existy(title) || is.empty(title)) {
      return null;
    }

    // 渲染的标题提示
    let tipContent = '';
    if (is.existy(titleTip) && is.not.empty(titleTip)) {
      tipContent = (
        <Tooltip title={titleTip} arrowPointAtCenter>
          <QuestionCircleOutlined className={styles['app-comp-core-tooltip']} />
        </Tooltip>
      );
    }

    // 判断如果color是默认颜色，则设置默认的spin颜色
    const spinColor = (color === DefaultColors.color ? DefaultColors.spinColor : color);

    return (
      <div className={styles['app-comp-core-title']}>
        <Row type="flex" justify="space-between" align="middle">
          <Col>
            {
              isShowIcon === false ?
                <span className={styles['app-comp-core-title-spin']} style={{ backgroundColor: spinColor }} /> :
                null
            }
            {title}{tipContent}
          </Col>
          <Col>{titleExt}</Col>
        </Row>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={styles['app-comp-core-content']}>
        {children}
      </div>
    );
  };

  const renderFooter = () => {
    if (is.not.existy(footer) || is.empty(footer)) {
      return null;
    }
    return (
      <div className={styles['app-comp-core-footer']}>{footer}</div>
    );
  };

  const ownStyle = { ...style };
  // 渲染背景标题的渐变颜色
  if (ownStyle.backgroundColor === undefined && color) {
    // 判断是否需要渐变色，如果不需要则直接渲染纯色
    if (isLinear && color !== DefaultColors.color) {
      ownStyle.backgroundColor = `${hexToRGB(color, 0.05)}`;
    } else {
      ownStyle.backgroundColor = `${hexToRGB(color)}`;
    }
  }

  return (
    <div
      className={`${styles['app-comp-core-container']} ${className}`}
      style={ownStyle}
      {...restProps}
    >
      {/* 渲染标题 */}
      { renderHeader() }
      {/* 渲染内容 */}
      { renderContent() }
      {/* 渲染页脚 */}
      { renderFooter() }
    </div>
  );
};

CoreContent.propTypes = {
  title: PropTypes.node,              // 标题
  color: PropTypes.string,       // 背景色
  isLinear: PropTypes.bool,   // 背景色是否需要渐变(默认渐变)
  titleTip: PropTypes.node,     // 标题提示
  isShowIcon: PropTypes.bool,  // 是否显示提示图标
  titleExt: PropTypes.node,     // 标题扩展栏
  children: PropTypes.node,     // 模块内容
  footer: PropTypes.node,           // 模块页脚
  style: PropTypes.object,              // 样式
  className: PropTypes.string,  // 类名
};

CoreContent.defaultProps = {
  title: null,              // 标题
  color: DefaultColors.color,       // 背景色
  isLinear: true,   // 背景色是否需要渐变(默认渐变)
  titleTip: null,     // 标题提示
  isShowIcon: false,  // 是否显示提示图标
  titleExt: null,     // 标题扩展栏
  children: null,     // 模块内容
  footer: null,           // 模块页脚
  style: {},              // 样式
  className: '',  // 类名
};

export default CoreContent;
