/**
 * 卡片组件 - 文件上传和列表组件
 * 未使用
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { Component } from 'react';
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Row, Col, Tooltip, Upload, message } from 'antd';
import styles from './style/index.less';

const DefaultNamespace = 'CommonCardFilesNamespace';

class CommonCardFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: props.tag ? props.tag : '',
      title: props.title ? props.title : '',
      titleTips: props.titleTips ? props.titleTips : '',
      subtitle: props.subtitle ? props.subtitle : '',
      defaultFileList: props.defaultFileList ? props.defaultFileList : [],
      isUploaded: props.isUploaded ? props.isUploaded : false,
      onUploadingCallback: props.onUploadingCallback ? props.onUploadingCallback : undefined, // 文件开始上传之前回调
      onSuccessCallback: props.onSuccessCallback ? props.onSuccessCallback : undefined, // 文件上传成功回调
      onFailureCallback: props.onFailureCallback ? props.onFailureCallback : undefined, // 文件上传失败回调

      fileList: [],     // 上传文件的清单
      token: '',        // 上传文件参数 token
      path: '',         // 上传文件参数 path
      namespace: dot.get(props, 'tag', DefaultNamespace), // 命名空间
    };

    // 是否初始化容器
    this.private = {
      isInitStorage: false,
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      tag: nextProps.tag ? nextProps.tag : '',
      title: nextProps.title ? nextProps.title : '',
      titleTips: nextProps.titleTips ? nextProps.titleTips : '',
      subtitle: nextProps.subtitle ? nextProps.subtitle : '',
      defaultFileList: nextProps.defaultFileList ? nextProps.defaultFileList : [],
      isUploaded: nextProps.isUploaded ? nextProps.isUploaded : false,
      onUploadingCallback: nextProps.onUploadingCallback ? nextProps.onUploadingCallback : undefined, // 文件开始上传之前回调
      onSuccessCallback: nextProps.onSuccessCallback ? nextProps.onSuccessCallback : undefined,
      onFailureCallback: nextProps.onFailureCallback ? nextProps.onFailureCallback : undefined,

      token: dot.get(nextProps, 'applicationFiles.token', ''),  // 上传文件参数 token
      path: dot.get(nextProps, 'applicationFiles.path', ''),    // 上传文件参数 path
      namespace: dot.get(nextProps, 'tag', DefaultNamespace),   // 命名空间
    });
  }

  // 上传成功回调函数
  onSuccessCallback = (file) => {
    const { tag, onSuccessCallback } = this.state;

    // 设置上传成功的数据
    this.setState({
      fileList: [file],
    });

    // 上传成功的回调函数
    if (onSuccessCallback) {
      onSuccessCallback(tag, file);
    }
  }

  // 上传失败回调函数
  onFailureCallback = (errorMessage = '上传失败') => {
    const { tag, onFailureCallback } = this.state;
    if (onFailureCallback) {
      onFailureCallback(tag, errorMessage);
    }
  }

  // 上传文件到七牛
  onUpload = (file) => {
    this.startToUpload(file);
    return false;
  }

  onChange = (info) => {
    let fileList = info.fileList;
    fileList = fileList.slice(0, 1);

    // 过滤文件状态，过滤错误格式文件
    fileList = fileList.filter((file) => {
      if (file.name) {
        /* return ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].indexOf(file.type) !== -1; */
        return ['xls', 'xlsx', 'csv'].filter(v => file.name.indexOf(v) > -1).length > 0;
      }
      return true;
    });

    this.setState({ fileList });
  }

  startToUpload = (file) => {
    const { namespace, onUploadingCallback, tag } = this.state;

    // 验证上传文件是否为图片
    if (['xls', 'xlsx', 'csv'].filter(v => file.name.indexOf(v) > -1).length === 0) {
      message.error(<span style={{ fontSize: 18 }}>只能上传excel/csv格式文件</span>);
      return false;
    }
    const params = {
      file,
      namespace,
      onSuccessCallback: this.onSuccessCallback,
      onFailureCallback: this.onFailureCallback,
    };
    // 触发上传文件前的回调函数
    if (onUploadingCallback) {
      onUploadingCallback(tag);
    }
    // 如果文件正确则创建任务
    this.props.dispatch({ type: 'applicationFiles/uploadFileToServer', payload: params });
  }

  // 渲染标题栏目
  renderTitle = () => {
    const { title, titleTips, subtitle } = this.state;
    return (
      <Row>
        <Col>
          <Row className={styles['app-comp-common-card-upload-title']}>
            <Col>
              {title}
              {/* 判断提示信息是否显示 */}
              {
                titleTips !== '' ?
                  <Tooltip title={titleTips}><InfoCircleOutlined style={{ color: '#999999', marginLeft: '5px' }} /></Tooltip> : ''
              }
            </Col>
          </Row>

          {/* 判断副标题是否显示 */}
          {
            subtitle !== '' ?
              <Row className={styles['app-comp-common-card-upload-subtitle']}><Col>{subtitle}</Col></Row> : ''
          }
        </Col>
      </Row>
    );
  }

  // 渲染上传文件
  renderFiles = () => {
    const { defaultFileList, fileList, isUploaded, tag } = this.state;
    const props = {
      action: '',
      name: 'file',
      onChange: this.onChange,      // 文件变更回调（上传前调用）
      beforeUpload: this.onUpload,  // 上传文件的回调
      defaultFileList: fileList,    // 文件列表
      fileList: is.empty(fileList) ? defaultFileList : fileList,
      showUploadList: { showRemoveIcon: false },
    };

    return (
      <Row type="flex" justify="space-around" align="middle" className={styles['app-comp-common-card-upload-files-container']}>
        <Col span={22} className={styles['app-comp-common-card-upload-files']}><Upload {...props} ><span id={`uploadTask-${tag}`} style={{ display: 'none' }} /></Upload></Col>
        <Col span={2} className={styles['app-comp-common-card-upload-state']}>
          {/* 判断是否显示上传成功的绿色对勾 */}
          { isUploaded ? <CheckOutlined style={{ fontSize: 16, color: '#29AB5B' }} /> : '' }
        </Col>
      </Row>
    );
  }

  render = () => {
    return (
      <div className={styles['app-comp-common-card-upload-container']}>
        {/* 渲染标题栏目 */}
        {this.renderTitle()}

        {/* 渲染上传文件 */}
        {this.renderFiles()}
      </div>
    );
  }
}

function mapStateToProps({ applicationFiles }) {
  return { applicationFiles };
}

export default connect(mapStateToProps)(CommonCardFiles);
