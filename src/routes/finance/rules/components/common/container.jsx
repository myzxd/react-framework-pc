/**
 * 抽象组件 - 遍历数据，回调渲染的容器
 */
import is from 'is_js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class CommonContainerComponent extends Component {
  static propTypes = {
    dataSource: PropTypes.array, // 数据源，遍历数据使用
    renderData: PropTypes.func,  // 内容的回调函数
  }
  static defaultProps = {
    dataSource: [],
    renderData: () => {},
  }

  // 渲染内容
  renderData = (data, index, dataSource) => {
    const { renderData } = this.props;
    const key = data.id || index;
    if (is.empty(renderData) || is.not.existy(renderData) || is.not.function(renderData)) {
      return <span key={key} />;
    }

    return (
      <span key={`${key}`}>
        {renderData(data, index, dataSource)}
      </span>
    );
  }

  render() {
    const { dataSource } = this.props;
    // 判断数据，为空则直接返回
    if (is.empty(dataSource) || is.not.array(dataSource)) {
      return <span />;
    }

    // 渲染子集数据
    const children = dataSource.map((item, index) => this.renderData(item, index, dataSource));
    return (
      <span>
        {children}
      </span>
    );
  }
}

export default CommonContainerComponent;
