/**
 * s3文件上传
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input } from 'antd';
import dot from 'dot-prop';
import CoreUpload from '../../components/uploadAmazon';

import { DeprecatedCoreForm, CoreFinder } from '../../../../components/core';


const { CoreFinderList } = CoreFinder;

// 判断两个数组内元素是否完全相等
const checkArrayEqual = (arr, otherArr) => {
  return arr.every((item, idx) => {
    return item === otherArr[idx];
  });
};

class uploadAmazon extends Component {
  static propTypes = {
    form: PropTypes.object,
    fileList: PropTypes.array,
    fileListUrl: PropTypes.array,
    domain: PropTypes.string,
  }

  static defaultProps = {
    form: {},
    fileList: [],
    fileListUrl: [],
    isDown: false,
    domain: 'deflateDomain',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { fileList, fileListUrl } = nextProps;
    if (prevState.prevProps && checkArrayEqual(prevState.prevProps.fileList, fileList) && checkArrayEqual(prevState.prevProps.fileListUrl, fileListUrl)) {
      return null;
    }

    // eslint-disable-next-line no-param-reassign
    prevState.prevProps = nextProps;
    if (fileList !== prevState.fileList && fileListUrl !== prevState.fileListUrl) {
      return {
        fileList,
        fileListUrl,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      fileListUrl: props.fileListUrl,
      domain: props.domain,
    };
    // 上传文件的随机key
    this.private = {
      fileList: props.fileList,
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    };
  }

  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const { fileList } = this.private;
    const { form } = this.props;
    const { setFieldsValue } = form;

    const list = [...fileList, e];
    this.private.fileList = list;

    setFieldsValue({ fileList: list });
  }

  // 删除文件
  onDeleteFile = (index) => {
    const { fileList } = this.private;
    const { form } = this.props;
    const { setFieldsValue } = form;
    const list = [...fileList];
    list.splice(index, 1);
    this.private.fileList = list;

    setFieldsValue({ fileList: list });
  }

  // 预览组件
  renderCorePreview = (value) => {
    if (Array.isArray(value) && dot.get(value, '0')) {
      const datas = value.map((item) => {
        return { key: item };
      });
      return (
        <CoreFinderList data={datas} enableDownload={false} enableRemove onRemove={this.onDeleteFile} />
      );
    }
  };

  // 表单
  renderForm = () => {
    const { domain } = this.state;

    const { fileList } = this.private;
    // 项
    const formItems = [
      {
        label: '上传附件',
        key: 'uploadFile',
        form: (
          <div>
            <CoreUpload
              namespace={this.private.namespace}
              onSuccess={this.onUploadSuccess}
              onFailure={this.onUploadFailure}
              domain={domain}
            />
            {this.renderCorePreview(fileList)}
          </div>
        ),
      },
    ];

    // 布局
    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
    return (
      <DeprecatedCoreForm
        cols={1}
        items={formItems}
        layout={layout}
      />
    );
  }

  // 渲染隐藏表单
  renderHiddenForm = () => {
    const { fileList } = this.state;
    const { form } = this.props;

    const formItems = [
      {
        label: '',
        form: form.getFieldDecorator('fileList', { initialValue: fileList })(<Input hidden />),
      },
    ];
    const layout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };
    return (
      <DeprecatedCoreForm
        items={formItems}
        cols={1}
        layout={layout}
      />
    );
  }

  // 内容
  renderContent = () => {
    return (
      <div>
        {/* 渲染表单 */}
        {this.renderForm()}
        {/* 隐藏表单 */}
        {this.renderHiddenForm()}
      </div>
    );
  }

  // TODO: 将renderContent修改问render，删除多余代码 @王晋
  render() {
    return this.renderContent();
  }
}

export default uploadAmazon;
