/**
 * 上传照片组件
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Modal, message } from 'antd';

import style from './style.less';

const noop = () => {};

class CorePhotos extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired, // 表单onChange
    maximum: PropTypes.number,           // 最大上传数量
    isDisplayMode: PropTypes.bool,       // 是否是编辑模式
    value: PropTypes.object,             // 表单默认值
    multiple: PropTypes.bool,            // 是否支持多选
  }

  static defaultProps = {
    onChange: noop,
    maximum: 20,
    isDisplayMode: false,
    value: {},
    multiple: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,   // 预览对话框
      image: '',        // 预览照片地址
    };
    this.fileList = []; // 上传文件列表
  }

  // 预览图片
  onPreview = (file) => {
    this.setState({
      ...this.state,
      visible: true,                        // 预览对话框
      image: file.url || file.thumbUrl,     // 预览照片地址
    });
  }

  // 上传文件到七牛
  onUpload = (file) => {
    // 验证上传文件是否为图片
    if (['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) === -1) {
      return message.error('只能上传图片');
    }

    // 如果上传的图片已经上传过，进行拦截
    if (this.isUploaded(file)) {
      return message.error('此图片已经上传过');
    }

    // 如果文件正确则创建任务
    this.props.dispatch({ type: 'employeeManage/uploadFile', payload: { file, onSuccessCallback: this.uploadSuccessCallback } });
    return false;
  }

  // 删除文件
  onRemove = (file) => {
    this.fileList = this.fileList.filter((item) => {
      return item.uid !== file.uid;
    });
    this.updataFormValue(this.fileList);
  }

  // 取消预览
  onCancel = () => {
    this.setState({
      ...this.state,
      visible: false, // 预览对话框
    });
  }

  // 判断文件是否已经上传了
  isUploaded = (file) => {
    return this.fileList.filter(item => item.name === file.name).length >= 1;
  }

  uploadSuccessCallback = (file) => {
    this.fileList = [
      ...this.fileList,
      file,
    ];
    this.updataFormValue(this.fileList);
  }

  // 更新表单数据
  updataFormValue = (files) => {
    const { onChange } = this.props;
    const value = {
      keys: files.map(file => dot.get(file, 'uid', '')).filter(item => item !== ''),
      urls: files.map(file => dot.get(file, 'url', '')).filter(item => item !== ''),
    };
    if (onChange) {
      onChange(value);
    }
  }

  checkValue = (files, key) => {
    for (const k of files) {
      if (k.uid === key) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { visible, image } = this.state;
    const { maximum, isDisplayMode, multiple, disableds } = this.props;
    const { keys, urls } = this.props.value;
      // 如果默认数据为空，表单数据不为空，则赋值表单到默认数据中
    if (is.not.empty(keys) && is.not.empty(urls) && is.array(keys) && keys[0] && is.array(urls)) {
      // 从表单的赋值中初始化
      keys.forEach((key, index) => {
        if (this.checkValue(this.fileList, key)) return;
        this.fileList.push({
          uid: key,
          status: 'done',
          name: key,
          url: urls[index],
        });
      });
    } else {
      this.fileList = [];
    }
    // 上传按钮
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const props = {
      action: '',
      listType: 'picture-card',
      // file对象里的url需要是字符串, 如果是数组Upload组件会报错
      fileList: this.fileList.map((value) => {
        const { url } = value;
        return { ...value, url: is.existy(url) && is.array(url) ? dot.get(value, 'url.0', '') : url };
      }),
      onPreview: this.onPreview,    // 预览回调
      onChange: this.onChange,      // 文件变更回调（上传前调用）
      beforeUpload: this.onUpload,  // 上传文件的回调
      onRemove: this.onRemove,      // 删除文件的回调
    };
    // 如果是displaymode,隐藏删除按钮
    if (isDisplayMode) {
      props.showUploadList = { showRemoveIcon: false };
    }
    return (
      <div className="clearfix">

        {/* 上传文件 */}
        <Upload multiple={multiple} {...props} disabled={disableds}>
          {(this.fileList.length >= maximum || isDisplayMode) ? null : uploadButton}
        </Upload>

        {/* 预览图片 */}
        <Modal visible={visible} footer={null} onCancel={this.onCancel}>
          <img alt="preview" className={style['app-comp-employee-manage-form-components-core-photos']} src={image} />
        </Modal>
      </div>
    );
  }
}

export default connect()(CorePhotos);
