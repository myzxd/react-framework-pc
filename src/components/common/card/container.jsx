/**
 * 卡片组件 - 卡片组件的容器
 * 未使用
 */
import is from 'is_js';
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import styles from './style/index.less';

class CommonCardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: props.cols ? props.cols : 3,                            // 默认的布局列数
      dataSource: props.dataSource ? props.dataSource : [],         // 卡片的数据源，遍历数据使用
      renderCard: props.renderCard ? props.renderCard : undefined,  // 渲染卡片内容的回调函数
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      cols: nextProps.cols ? nextProps.cols : 3,                            // 默认的布局列数
      dataSource: nextProps.dataSource ? nextProps.dataSource : [],         // 卡片的数据源，遍历数据使用
      renderCard: nextProps.renderCard ? nextProps.renderCard : undefined,  // 渲染卡片内容的回调函数
    });
  }

  // 渲染卡片
  renderCard = (data, index, dataSource) => {
    const { renderCard } = this.state;
    if (is.empty(renderCard) || is.not.existy(renderCard) || is.not.function(renderCard)) {
      return <div key={index} />;
    }

    return (
      <div className={styles['app-comp-common-card-container']} key={`rendercard-${index}`}>
        {renderCard(data, index, dataSource)}
      </div>
    );
  }

  render() {
    const { cols, dataSource } = this.state;

    // 判断数据，为空则直接返回
    if (is.empty(dataSource) || is.not.array(dataSource)) {
      return <div />;
    }

    const children = [];
    // 计算布局
    const span = 24 / cols;
    const finalData = dataSource.reduce((acc, item, index) => {
      const preItem = acc;
      if (preItem[index % cols]) {
        preItem[index % cols].push(item);
      } else {
        preItem[index % cols] = [item];
      }
      return preItem;
    }, {});
    for (let i = 0; i < cols; i += 1) {
      const oneColData = finalData[i];
      // 渲染卡片
      children.push(
        <Col span={span} key={`card-${i}`}>
          <div className={styles['app-comp-common-waterfall-col']} key={`div-${i}`}>
            {oneColData && oneColData.map((item, index) => this.renderCard(item, index))}
          </div>
        </Col>,
      );
    }

    return (
      <Row gutter={16} type="flex" justify="start" align="top">
        {children}
      </Row>
    );
  }
}

export default CommonCardContainer;
