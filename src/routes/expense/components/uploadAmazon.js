/**
 * 上传execel
 */
import PropTypes from 'prop-types';
import { connect } from 'dva';
import React, { Component } from 'react';
import { Upload, Button, message, Row, Col } from 'antd';
import '@ant-design/compatible/assets/index.css';
import { UploadOutlined } from '@ant-design/icons';
import styles from './upload.less';

class CoreUploadAmazon extends Component {

  static propTypes = {
    domain: PropTypes.string,
  }

  static defaultProps = {
    domain: 'deflateDomain',
  }
  constructor(props) {
    super(props);
    this.state = {
      isVerifyFileType: props.isVerifyFileType ? props.isVerifyFileType : false, // 是否不支持压缩文件上传
      verifyFileType: ['zip', 'rar', '7z', 'wim', 'cab', 'iso', 'jar', 'ace', 'tar', 'arj', 'lzh'], // 压缩文件格式
      onSuccess: props.onSuccess ? props.onSuccess : undefined, // 上传成功回调
      onFailure: props.onFailure ? props.onFailure : undefined, // 上传失败回调
      domain: props.domain,
    };
  }

  // 接受父级的 ModalInfo 信息对弹窗架子填充
  componentWillReceiveProps = (props) => {
    this.setState({
      isVerifyFileType: props.isVerifyFileType ? props.isVerifyFileType : false, // 是否不支持压缩文件上传
      onSuccess: props.onSuccess ? props.onSuccess : undefined, // 上传成功回调
      onFailure: props.onFailure ? props.onFailure : undefined, // 上传失败回调
    });
  };
  // 上传文件到七牛
  onUpload = () => {
    return false;
  }

  // 取消预览
  onCancel = () => {
    this.setState({
      ...this.state,
      visible: false, // 预览对话框
    });
  }

  onUploadSuccessCallback = (file, fileKey) => {
    const { onSuccess } = this.props;
    if (fileKey && onSuccess) {
      onSuccess(fileKey);
    }
  }

  onCheckValue = (files, key) => {
    for (const k of files) {
      if (k.uid === key) {
        return true;
      }
    }
    return false;
  }

  onChange = ({ file }) => {
    const { domain } = this.state;
    const { isVerifyFileType, verifyFileType } = this.state;
    const name = file.name.slice(file.name.lastIndexOf('.') + 1);
    let fileKey = '';
    if (file.name) {
      // 文件后缀
      // const fileType = file.name.split('.').pop();
      fileKey = file.name.slice(0, file.name.lastIndexOf('.'));
      // 判断上传文件的后缀名是否支持,后缀名大写转小写
      // if (Unit.uploadFileSuffixs(fileType) === false) {
      //   return message.error(`您所上传的${file.name}格式不支持上传`);
      // }
    }
    // 单个压缩包文件限制大小为20M
    // if (file.size >= 51200000) {
    //   return message.error('单个压缩包最大限制为50兆，请重新上传');
    // }
    if (file.size >= 15200000) {
      return message.error('单个压缩包最大限制为15兆，请重新上传');
    }
    // 不支持压缩文件上传
    if (isVerifyFileType) {
      // 是否为常见的压缩文件
      const flag = verifyFileType.some(item => item === name);
      if (flag) return message.error('不支持上传压缩文件');
    // 仅支持zip、rar格式的压缩文件上传
    } else {
      // 是否为常见的压缩文件
      const flag = verifyFileType.some(item => item === name);
      if (flag) {
        if (name !== 'zip') {
          return message.error('仅支持zip格式压缩包，请重新上传');
        }
      }
    }
    // 如果文件正确则创建任务
    this.props.dispatch({
      type: 'applicationFiles/uploadAmazonFile',
      payload: {
        file,
        domain,
        fileType: name,
        fileKey,
        onSuccessCallback: this.onUploadSuccessCallback.bind(this, file),
      },
    });
    return false;
  }

  render() {
    // 上传文件
    const props = {
      action: '',
      name: 'file',
      onChange: this.onChange,      // 文件变更回调（上传前调用）
      beforeUpload: this.onUpload,  // 上传文件的回调
      showUploadList: false,
      multiple: true, // 是否支持多选
    };
    return (
      <div className={styles['app-comp-expense-common-upload-box']}>
        <Row>
          <Col sm={17} id={styles['app-comp-expense-common-upload-btn ']}>
            <Upload {...props}>
              <Button className={styles['app-comp-expense-common-upload-reset-hover']}>
                <UploadOutlined />点击上传</Button>
            </Upload>
            <br />
            <span className={styles['upload-style']}>上传压缩包仅支持zip格式，单个压缩包限制15M</span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect()(CoreUploadAmazon);
