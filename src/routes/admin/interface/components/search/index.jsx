/**
 * 控件，界面
 */
import React, { Component } from 'react';
import { CoreContent, CorePreview } from '../../../../../components/core';

class DemoDeprecatedCoreSearch extends Component {

  // 渲染内容
  renderContent = () => {
    const { title, content, isRenderMarkDown } = this.state;

    // 渲染markdown文件
    if (isRenderMarkDown) {
      return (<CoreContent title={title}> <CorePreview markdown={content} /></CoreContent>);
    }

    // 渲染正常的内容
    return (<CoreContent title={title}> {content} </CoreContent>);
  }

  render() {
    return (
      <span>DemoDeprecatedCoreSearch</span>
    );
  }
}
export default DemoDeprecatedCoreSearch;
