/**
 * 列表头部功能按钮  --团队公共组件
 */
import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './style/index.less';

class ContainerTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonList: props.buttonList ? props.buttonList : [],
    };
  }

  // 渲染容器
  renderContainer = () => {
    const { buttonList } = this.state;
    return (<div>
      { buttonList.map((item, index) => {
        return <Button type={item.type} key={index} onClick={item.onCallback} className={styles['app-comp-team-container-margin']} >{item.name}</Button>;
      }) }
    </div>);
  }

  render = () => {
    return (
      <div>
        {/* 渲染容器 */}
        {this.renderContainer()}
      </div>
    );
  }
}

export default ContainerTop;
