/**
 * 卡片组件 - 卡片展开收起组件
 * 未使用
 */
import React, { Component } from 'react';
import { CheckCircleOutlined, DownOutlined, InfoCircleOutlined, UpOutlined } from '@ant-design/icons';
import { Row, Col, Tooltip, Progress } from 'antd';
import styles from './style/index.less';

class CommonCardCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: props.tag ? props.tag : '',                                      // 标示
      title: props.title ? props.title : '',                                // 标题
      titleTips: props.titleTips ? props.titleTips : '',                    // 提示信息
      expand: props.expand !== undefined ? props.expand : false,            // 是否展开内容
      content: props.content ? props.content : '',                          // 展开内容
      progress: props.progress ? props.progress : 0,                        // 进度条进度
      progressContent: props.progressContent ? props.progressContent : '',  // 进度条内容
      onChange: props.onChange ? props.onChange : undefined,                // 展开收起的回调函数
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      tag: nextProps.tag ? nextProps.tag : '',                                      // 标示
      title: nextProps.title ? nextProps.title : '',                                // 标题
      titleTips: nextProps.titleTips ? nextProps.titleTips : '',                    // 提示信息
      // expand: nextProps.expand !== undefined ? nextProps.expand : false,            // 是否展开内容
      content: nextProps.content ? nextProps.content : '',                          // 展开内容
      progress: nextProps.progress ? nextProps.progress : 0,                        // 进度条进度
      progressContent: nextProps.progressContent ? nextProps.progressContent : '',  // 进度条内容
      onChange: nextProps.onChange ? nextProps.onChange : undefined,                // 展开收起的回调函数
    });
  }

  // 点击展开操作的回调
  onChangeExpand = () => {
    const { tag, expand, onChange } = this.state;

    // 设置展开变折叠，折叠变展开
    this.setState({ expand: !expand });
    // 回调函数
    if (onChange) {
      onChange(tag, !expand);
    }
  }

  // 渲染标题
  renderTitle = () => {
    const { title, titleTips } = this.state;
    return (
      <Col span={20}>
        {title}
        {/* 如果有提示信息则显示 */}
        {
          titleTips !== '' ?
            <Tooltip title={titleTips}><InfoCircleOutlined className={styles['app-comp-common-card-collapse-title-icon']} /></Tooltip> : ''
        }
      </Col>
    );
  }

  // 渲染进度
  renderProgress = () => {
    const { progress, progressContent } = this.state;
    // 如果进度为100，则渲染对勾
    if (progress === 100) {
      return <Col span={2}> <CheckCircleOutlined className={styles['app-comp-common-card-collapse-progress-icon']} /></Col>;
    }

    // 进度
    const content = <span className={styles['app-comp-common-card-collapse-progress-content']}>{progressContent}</span>;
    return (
      <Col span={2}> <Progress width={24} type="circle" percent={progress} status="success" format={() => content} /></Col>
    );
  }

  // 渲染是否展开
  renderExpand = () => {
    const { expand } = this.state;
    if (expand) {
      return (
        <Col span={2}> <UpOutlined
          onClick={this.onChangeExpand}
          className={styles['app-comp-common-card-collapse-expand']}
        /> </Col>
      );
    }
    return (
      <Col span={2}> <DownOutlined
        onClick={this.onChangeExpand}
        className={styles['app-comp-common-card-collapse-expand']}
      /> </Col>
    );
  }

  render = () => {
    const { expand, content } = this.state;
    return (
      <div>
        <Row className={styles['app-comp-common-card-collapse-container']} style={expand ? { borderBottom: '1px solid #E4E4E4' } : {}} type="flex" justify="space-around" align="middle" >
          {/* 渲染标题 */}
          {this.renderTitle()}

          {/* 渲染进度 */}
          {this.renderProgress()}

          {/* 渲染是否展开 */}
          {this.renderExpand()}
        </Row>

        {/* 判断是否展开，展开则显示内容 */}
        {
          expand ? content : ''
        }
      </div>
    );
  }
}

export default CommonCardCollapse;
