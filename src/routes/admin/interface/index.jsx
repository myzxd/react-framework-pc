/**
 * 控件，界面
 */
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { CoreContent, CorePreview } from '../../../components/core';
import { TransferLoaderForSalaryDocument } from '../../../application/utils/transfer/index';

import ExampleSelect from './examples/treeSelect';

// 动态显示的模块
import DemoApiDocument from './components/apiDocument';
import DemoCoreContent from './components/content';
import DemoCoreTabs from './components/tabs';
import DemoDeprecatedCoreForm from './components/search';
import DemoDeprecatedCoreSearch from './components/form';
import DemoCoreFinder from './components/finder';

// 文档
import Application from './document/application.md';
import Modules from './document/modules.md';
import Interfaces from './document/interface.md';
import Plan from './document/plan.md';

// 目录结构文档
import Admin from '../README.md';
import Employee from '../../employee/README.md';
import Account from '../../account/README.md';
import System from '../../system/README.md';
import styles from './style.less';

// 渲染显示的数据类型
const ContentType = {
  Markdown: 0,  // markdown文件
  Component: 1, // 组件
};

class Interface extends Component {
  constructor() {
    super();
    this.state = {
      title: '模块开发文档',                                                     // 渲染的标题
      content: <CorePreview markdown={Modules} />,  // 渲染的内容
      noWapper: false,  // 显示的内容是否进行外层封装
    };

    // 接口文档
    const apisConponents = TransferLoaderForSalaryDocument.transfer().map((item, index) => {
      return <DemoApiDocument item={item} key={`key${index}`} />;
    });

    this.private = {
      // 边栏
      sider: [
        {
          title: '模块实例',
          data: [
            { title: 'CoreFinder', type: ContentType.Component, component: <DemoCoreFinder /> },
            { title: 'CoreContent', type: ContentType.Component, noWapper: true, component: <DemoCoreContent /> },
            { title: 'DeprecatedCoreForm', type: ContentType.Component, component: <DemoDeprecatedCoreForm /> },
            { title: 'DeprecatedCoreSearch', type: ContentType.Component, component: <DemoDeprecatedCoreSearch /> },
            { title: 'CoreTabs', type: ContentType.Component, component: <DemoCoreTabs /> },
            { title: 'TreeSelect', type: ContentType.Component, component: <ExampleSelect /> },
          ],
        },
        {
          title: '接口文档',
          data: [].concat(
            { title: '全部接口', type: ContentType.Component, noWapper: true, component: <div>{apisConponents}</div> },
            TransferLoaderForSalaryDocument.transfer().map((item) => {
              return { title: item.name, type: ContentType.Component, noWapper: true, component: <DemoApiDocument item={item} /> };
            })),
        },
        {
          title: '说明文档',
          data: [
            { title: '项目开发文档', type: ContentType.Markdown, file: Application },
            { title: '模块开发文档', type: ContentType.Markdown, file: Modules },
            { title: '页面开发规范', type: ContentType.Markdown, file: Interfaces },
            { title: '项目开发计划', type: ContentType.Markdown, file: Plan },
          ],
        },
        {
          title: '模块说明',
          data: [
            { title: '超级管理', type: ContentType.Markdown, file: Admin },
            { title: '人员管理', type: ContentType.Markdown, file: Employee },
            { title: '我的账户', type: ContentType.Markdown, file: Account },
            { title: '系统管理', type: ContentType.Markdown, file: System },
          ],
        },
      ],
    };
  }

  // 边栏链接点击
  onClickSider = (item) => {
    const title = item.title;
    const noWapper = !!item.noWapper;
    let content = '';

    // 判断，如果是markdown，则显示markdown文件
    if (item.type === ContentType.Markdown) {
      if (item.file === undefined) {
        content = '未找到该文件';
      } else {
        // const markdown = require(`${item.file}`);
        content = <CorePreview markdown={item.file} />;
      }
    }

    // 判断如果是模块，则显示模块
    if (item.type === ContentType.Component) {
      content = item.component;
    }

    this.setState({ title, content, noWapper });
  }

  // 渲染边栏模块
  renderSider = ({ title, data }) => {
    const { onClickSider } = this;
    return (
      <CoreContent title={title} key={title}>
        {data.map((item) => {
          return (
            <Row span={24} className={styles['app-admin-interface-sider-row']} key={item.title}>
              <a onClick={() => onClickSider(item)}>{item.title}</a>
            </Row>
          );
        })}
      </CoreContent>
    );
  }

  // 渲染内容
  renderContent = () => {
    const { title, content, noWapper } = this.state;

    // 如果不需要外层的封装，则直接返回数据
    if (noWapper) {
      return content;
    }

    return (<CoreContent title={title}> {content} </CoreContent>);
  }

  render() {
    const { renderSider } = this;
    const { sider } = this.private;

    return (
      <Row span="24" gutter={16}>
        <Col span={5}>
          {/* 渲染边栏 */}
          {sider.map(item => renderSider(item))}
        </Col>
        <Col span="19">
          {this.renderContent()}
        </Col>
      </Row>
    );
  }
}
export default Interface;
