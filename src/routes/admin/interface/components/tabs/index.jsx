/**
 * 控件，界面
 */
import React, { Component } from 'react';
import { CoreTabs, CorePreview } from '../../../../../components/core';
import styles from './style.less';

class DemoCoreTabs extends Component {

  // 回调事件的key
  onChange = () => {
    // console.log(key);
  }

  // 渲染内容
  renderCase = (title = '', description = '', content = '', code = '') => {
    return (
      <div className={styles['app-comp-admin-tabs-case-wrap']}>
        <div className={styles['app-comp-admin-tabs-case-tabs']}>{content}</div>
        <div className={styles['app-comp-admin-tabs-case-title-wrap']}>
          <span className={styles['app-comp-admin-tabs-case-title']}>{title}</span>
          <span>{ description }</span>
        </div>
        <CorePreview>{code}</CorePreview>
      </div>
    );
  }

  renderDescription = (description = '') => {
    return (
      <div>
        <p className={styles['app-comp-admin-tabs-desc']}>
          {description}
        </p>
        <p className={styles['app-comp-admin-tabs-desc-btm']} />
      </div>
    );
  }

  render() {
    const items = [
      { title: '标签1', content: '内容1', key: 'aaa' },
      { title: '标签2', content: '内容2' },
      { title: '标签3', content: '内容3' },
    ];

    return (
      <div>
        {this.renderDescription('CoreTabs 组件，封装标签切换的容器。')}

        {this.renderCase(
          '基本',
          `
            多标签, 使用items参数传入数据, item的数据结构
            {
              key: '',          // 唯一标示
              title: '',        // 标题
              content: '',      // 内容
            };
            onChange 作为切换tab的回调函数使用
          `,
          <CoreTabs items={items} onChange={this.onChange} />,
          `
          onChange = (key) => {
            console.log(key);
          }

          const items = [
            { title: '标签1', content: '内容1', key: 'aaa' },
            { title: '标签2', content: '内容2' },
            { title: '标签3', content: '内容3' },
          ];
          <CoreTabs items={items} onChange={this.onChange} />,
          `,
        )}

        {this.renderCase(
          '其他样式',
          '样式参数 type，默认样式line，支持card',
          <CoreTabs items={items} type="card" onChange={this.onChange} />,
          `
          onChange = (key) => {
            console.log(key);
          }

          const items = [
            { title: '标签1', content: '内容1', key: 'aaa' },
            { title: '标签2', content: '内容2' },
            { title: '标签3', content: '内容3' },
          ];
          <CoreTabs items={items} type="card" onChange={this.onChange} />,
          `,
        )}
      </div>
    );
  }
}
export default DemoCoreTabs;
