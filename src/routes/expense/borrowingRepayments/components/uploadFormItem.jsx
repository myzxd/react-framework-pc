/**
 * 费用管理 - 借还款管理 - 上传组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import dot from 'dot-prop';

import CoreUpload from '../../components/uploadAmazon';
import { CoreFinder } from '../../../../components/core';

const { CoreFinderList } = CoreFinder;

class UploadFormItem extends Component {

  static propTypes = {
    namespace: PropTypes.string,  // 命名空间
    domain: PropTypes.string,
  }

  static defaultProps = {
    namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    domain: 'deflateDomain',
  }

  static getDerivedStateFromProps(nextProps) {
    // 获取value中的文件列表放入state
    if ('value' in nextProps) {
      return {
        fileList: nextProps.value || [],
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || [];
    this.state = {
      fileList: value, // 文件列表
      domain: props.domain, // 上传的域名
    };
  }

  // 成功回调
  onUploadSuccess = (e) => {
    let fileList = this.state.fileList;
    fileList = [...fileList, e];
    if (!('value' in this.props)) {
      this.setState({ fileList });
    }
    this.triggerChange(fileList);
  }

  // 删除文件
  onDeleteFile = (index) => {
    const fileList = this.state.fileList;
    fileList.splice(index, 1);
    if (!('value' in this.props)) {
      this.setState({ fileList });
    }
    this.triggerChange(fileList);
  }

  // 触发表单onChange
  triggerChange = (value) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  }

  // 创建编辑渲染预览组件
  renderCorePreview=(value) => {
    if (Array.isArray(value) && dot.get(value, '0')) {
      const data = value.map((item) => {
        return { key: item };
      });

      return <CoreFinderList data={data} enableDownload={false} enableRemove onRemove={this.onDeleteFile} />;
    }

    return <React.Fragment />;
  }

  render = () => {
    const { fileList, domain } = this.state;
    const { namespace } = this.props;

    return (
      <div>
        {/* 渲染上传组件 */}
        <CoreUpload
          namespace={namespace}
          onSuccess={this.onUploadSuccess}
          onFailure={this.onUploadFailure}
          domain={domain}
        />
        {/* 渲染展示文件 */}
        {this.renderCorePreview(fileList)}

      </div>
    );
  }
}

export default connect()(UploadFormItem);
