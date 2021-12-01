/**
 * 控件，界面
 */
import React, { Component } from 'react';
import { CoreContent, CorePreview } from '../../../../../components/core';
import styles from './style.less';

class DemoCoreContent extends Component {

  // 渲染内容
  renderCase = (title = '', description = '', content = '', code = '') => {
    return (
      <div className={styles['app-comp-admin-content-case-wrap']}>
        <div className={styles['app-comp-admin-content-case-content']}>{content}</div>
        <div className={styles['app-comp-admin-content-case-title-wrap']}>
          <span className={styles['app-comp-admin-content-case-title']}>{title}</span>
          <span>{ description }</span>
        </div>
        <CorePreview>{code}</CorePreview>
      </div>
    );
  }

  renderDescription = (description = '') => {
    return (
      <div>
        <p className={styles['app-comp-admin-content-desc']}>
          {description}
        </p>
        <p className={styles['app-comp-admin-content-desc-btm']} />
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderDescription('CoreContent 组件，封装内容的容器。为了统一管理功能，功能页面必须封装在CoreContent中使用。')}

        {this.renderCase(
          '基本',
          '无标题的，内容容器',
          <CoreContent> 内容 </CoreContent>,
          '<CoreContent> 内容 </CoreContent>',
        )}

        {this.renderCase(
          '标题',
          '带标题的，内容容器。 标题 为 可选参数 title, 标题提示 为 可选参数 titleTip。',
          <CoreContent title={'标题'} titleTip={'这里是标题提示'}> 内容 </CoreContent>,
          '<CoreContent title={\'标题\'} titleTip={\'这里是标题提示\'}> 内容 </CoreContent>',
        )}

        {this.renderCase(
          '标题扩展',
          '标题扩展 为 可选参数 titleExt, 可以使用纯文本或组件对象。',
          <CoreContent title={'标题'} titleExt={<span>添加 | 删除 | 操作</span>}> 内容 </CoreContent>,
          '<CoreContent title={\'标题\'} titleExt={<span>添加 | 删除 | 操作</span>}> 内容 </CoreContent>',
        )}

        {this.renderCase(
          '页脚',
          '页脚内容 为 可选参数 footer, 可以使用纯文本或组件对象。',
          <CoreContent title={'标题'} footer={<div style={{ fontSize: '10px' }}>这里是页脚内容</div>}> 内容 </CoreContent>,
          '<CoreContent title={\'标题\'} footer={<div style={{ fontSize:\'10px\' }}>这里是页脚内容</div>}> 内容 </CoreContent>',
        )}

      </div>
    );
  }
}
export default DemoCoreContent;
