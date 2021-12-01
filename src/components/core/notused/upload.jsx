/**
 * 核心组件，上传
 * s3上传二期完成后，组件将废弃
 */
import React from 'react';
import is from 'is_js';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button, message } from 'antd';
import dot from 'dot-prop';
import { connect } from 'dva';
import styles from '../style/index.less';

const DefaultNamespace = 'defaultNamespace';

class CoreUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      namespace: dot.get(props, 'namespace', DefaultNamespace), // 命名空间
      title: props.title ? props.title : '上传',               // 按钮标题
      token: dot.get(props, 'applicationFiles.token'),        // 上传的token
      path: dot.get(props, 'applicationFiles.path'),          // 文件地址
      customContent: dot.get(props, 'customContent', ''),     // 如果传递则取消按钮形态
      onSuccess: props.onSuccess ? props.onSuccess : undefined, // 上传成功回调
      onFailure: props.onFailure ? props.onFailure : undefined, // 上传失败回调
    };
  }

  // eslint-disable-next-line
  UNSAFE_componentWillMount = () => {
    this.props.dispatch({ type: 'applicationFiles/fetchToken' });
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      namespace: dot.get(props, 'namespace', DefaultNamespace), // 命名空间
      title: props.title ? props.title : '上传',               // 按钮标题
      token: dot.get(props, 'applicationFiles.token'),        // 上传的token
      path: dot.get(props, 'applicationFiles.path'),         // 文件地址
      customContent: dot.get(props, 'customContent', ''),     // 如果传递则取消按钮形态
      onSuccess: props.onSuccess ? props.onSuccess : undefined, // 上传成功回调
      onFailure: props.onFailure ? props.onFailure : undefined, // 上传失败回调
    });
  }

  componentWillUnmount = () => {
    const { namespace } = this.state;
    // 重置数据
    this.props.dispatch({ type: 'applicationFiles/clearNamespace', payload: { namespace } });
  }

  // 上传文件到七牛
  onUpload = (file) => {
    const { token, path, namespace } = this.state;

    // 获取文件后缀名
    let fileType = '';
    if (file.name) {
      fileType = file.name.split('.').pop();
    }

    // @TODO 物资模块上传文件校验（上传xls时,type返回为'');
    if (file.type === '' && ['xlsx', 'xls'].indexOf(fileType) === -1) {
      message.error('只能上传excel格式文件');
      return false;
    }

    // 判断文件格式
    if (['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].indexOf(file.type) === -1 && file.type !== '') {
      message.error('只能上传excel格式文件');
      return false;
    }
    const params = {
      file,
      token,
      path,
      namespace,
      onSuccessCallback: this.onSuccessCallback,
      onFailureCallback: this.onFailureCallback,
    };

    // 如果文件正确则创建任务
    this.props.dispatch({ type: 'applicationFiles/uploadFile', payload: params });
    return false;
  }

  // 上传成功回调函数
  onSuccessCallback = (file) => {
    const { onSuccess, namespace } = this.state;
    // 获取文件数据
    const hash = dot.get(file, 'hash');
    const key = dot.get(file, 'uid');

    // 请求成功的回调函数
    if (key && hash && onSuccess) {
      onSuccess(key, hash);
    } else {
      this.onFailureCallback('无法获取已上传文件信息');
    }

    // 回调成功后，清空容器
    this.props.dispatch({ type: 'applicationFiles/clearNamespace', payload: { namespace } });
  }

  // 上传失败回调函数
  onFailureCallback = (info) => {
    const { onFailure } = this.state;
    if (onFailure) {
      onFailure(info);
    }
  }

  render() {
    const { title, customContent } = this.state;
    // 设置上传地址
    const props = {
      action: '',
      name: 'file',
      beforeUpload: this.onUpload,
      showUploadList: false,
    };

    let content = (<Button><UploadOutlined />{title}</Button>);

    // 如果传递customContent 则不显示按钮形态
    if (is.not.empty(customContent) && is.existy(customContent)) {
      content = customContent;
    }

    return (
      <div className={styles['app-comp-core-upload-wrap']}>
        <Upload {...props}>
          {/* 判断是否传递自定义的按钮组件 */}
          {content}
        </Upload>
      </div>
    );
  }
}
function mapStateToProps({ applicationFiles }) {
  return { applicationFiles };
}
export default connect(mapStateToProps)(CoreUpload);
