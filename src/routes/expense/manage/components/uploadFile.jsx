/**
 * TODO: 注释 @王晋
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input } from 'antd';

import CoreUpload from '../../components/upload';

import {
  DeprecatedCoreForm,
} from '../../../../components/core';

import style from './style.css';

class UploadFile extends Component {
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

  constructor(props) {
    super(props);
    this.state = {
      fileList: props.fileList,
      fileListUrl: props.fileListUrl,
      domain: props.domain,
    };
    // 上传文件的随机key
    this.private = {
      namespace: `namespace${Math.floor(Math.random() * 100000)}`,
    };
  }

  // 上传文件成功回调
  onUploadSuccess = (e) => {
    const {
      fileList,
    } = this.state;

    // TODO: 折行 @王晋
    const {
      form,
    } = this.props;

    const {
      setFieldsValue,
    } = form;

    const list = [...fileList, e];

    this.setState({
      fileList: list,
    });

    setFieldsValue({ fileList: list });
  }

  // 删除文件
  onDeleteFile = (index) => {
    const {
      fileList,
    } = this.state;

    const {
      form,
    } = this.props;

    const {
      setFieldsValue,
    } = form;
    const list = [...fileList];

    list.splice(index, 1);

    this.setState({
      fileList: list,
    });

    setFieldsValue({ fileList: list });
  }

  // 表单
  renderForm = () => {
    const {
      fileList,
      fileListUrl,
      domain,
    } = this.state;

    // 项
    const formItems = [
      {
        label: '上传附件',
        form: (
          <div>
            <CoreUpload
              namespace={this.private.namespace}
              isVerifyFileType
              onSuccess={this.onUploadSuccess}
              onFailure={this.onUploadFailure}
              domain={domain}
            />
            {
              fileList.map((item, index) => {
                // TODO: 注释。数组直接引用会不会crash。是否需要判断 @王晋
                const isDown = fileListUrl[index];
                // 附件可下载
                if (isDown) {
                  return (
                    <p>
                      <a
                        className={style['app-comp-expense-manage-template-refund-upload']}
                        rel="noopener noreferrer"
                        target="_blank"
                        key={index}
                        href={fileListUrl[index]}
                      >
                        {item}
                      </a>
                      <span
                        onClick={() => { this.onDeleteFile(index); }}
                        className={style['app-comp-expense-manage-form-upload']}
                      >
                        删除
                      </span>
                    </p>
                  );
                }

                return (
                  <p
                    key={index}
                  >
                    {item}
                    <span
                      onClick={() => { this.onDeleteFile(index); }}
                      className={style['app-comp-expense-manage-form-upload']}
                    >
                      删除
                    </span>
                  </p>
                );
              })
            }
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

export default UploadFile;
