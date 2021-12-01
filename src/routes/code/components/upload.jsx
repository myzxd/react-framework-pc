/**
 * 上传文件的表单组件
 * **只能在表单中使用**
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Upload as AntdUpload, Button, message } from 'antd';
import { UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { Unit } from '../../../application/define';
import { CoreFinder } from '../../../components/core';
import styles from './style.less';
import { downLoadTool } from '../../../components/common/fileView/view';

const { CoreFinderList } = CoreFinder;


// domain常量配置
const UploadDomains = {
  OAUploadDomain: 'oa_approval',   // oa 单据使用的上传domain
};
class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      fileType: null,
      fileUrl: null,
      visible: false,
      fileName: null,
    };
  }

  // 上传成功回调
  onUploadSuccessCallback = (file, fileKey) => {
    const {
      value,
      onChange,
    } = this.props;
    const fileLists = [fileKey];
    const list = fileLists.map((item) => {
      return { key: item };
    });
    if (fileKey) {
      if (Array.isArray(value)) {
        onChange([...value, ...list]);
      } else {
        onChange(list);
      }
    }
    this.setState({
      fileList: fileLists,
    });
  }

  // 选择文件回调
  onChangeUpload = ({ file }) => {
    const {
      domain,
    } = this.props;
    // 获取文件后缀名
    let fileType = '';
    let fileKey = '';
    if (file.name) {
      fileType = file.name.split('.').pop();
      fileKey = file.name.slice(0, file.name.lastIndexOf('.'));
      // 判断上传文件的后缀名是否支持,后缀名大写转小写
      if (Unit.uploadFileSuffixs(fileType) === false) {
        return message.error(`您所上传的${file.name}格式不支持上传`);
      }
    }

    const maxSize = 60 * 1024 * 1024;
    // 最大上传为60M
    if (file.size >= maxSize) {
      return message.error('上传文件不能超过60M，超过的解决方案：①拆分多个文件，确保每个文件不超过60M;②压缩至60M以内上传');
    }

    this.props.dispatch({
      type: 'applicationFiles/uploadAmazonFile',
      payload: {
        file,
        domain,
        fileType,
        fileKey,
        onSuccessCallback: key => this.onUploadSuccessCallback(file, key),
      },
    });
  }

  onUpload = () => false;
  // 移除文件
  onRemove = (index) => {
    const {
      value,
      onChange,
    } = this.props;
    if (!Array.isArray(value)) return;
    let nextValue = [...value];
    nextValue.splice(index, 1);
    // 如果没有文件，给value undefined保持字段无数据为undefined的约定
    if (nextValue.length === 0) {
      nextValue = undefined;
    }
    onChange(nextValue);
  };

  // 设置预览参数
  onUploadSuccess = (type, url, name) => {
    this.setState({ fileType: type, fileUrl: url, visible: true, fileName: name });
  }

  setVisible = () => { this.setState({ visible: false }); }

  // 渲染已上传文件列表
  renderFileList = () => {
    const { showFileList, value, displayMode } = this.props;

    if (!Array.isArray(value) || value.length === 0) {
      if (displayMode) return '--';
      return null;
    }

    if (!showFileList && !displayMode) {
      return null;
    }

    // 预览
    const onChangePreview = (key, url) => {
      if (url && key) {
        let fileType = null;
        const reg = /\.(\w+)$/;
        fileType = key.match(reg)[1];
        this.onUploadSuccess(fileType, url, key);
        return;
      }

      this.props.dispatch({
        type: 'applicationFiles/fetchKeyUrl',
        payload: {
          key,
          onUploadSuccess: (type, adress) => this.onUploadSuccess(type, adress, key),
        },
      });
    };

    return value.map(({ key, url }, index) => {
      return (
        <div key={key} preview-file-box className={url ? null : styles['preview-file-box']}>
          {
            url ?
              <React.Fragment>
                <Button type="link" className={styles['preview-url']} onClick={() => onChangePreview(key, url)}>{key}</Button>
                <Button type="link" icon={<DownloadOutlined />} onClick={() => downLoadTool(url, key)} />
              </React.Fragment> :
              <React.Fragment>
                <Button type="link" style={{ marginLeft: 6, whiteSpace: 'inherit', textAlign: 'left' }} onClick={() => onChangePreview(key)}>{key}</Button>
              </React.Fragment>
          }
          {
            !displayMode ?
              <DeleteOutlined
                onClick={() => this.onRemove(index)}
                style={{ marginLeft: 5 }}
              /> :
              null
          }
        </div>
      );
    });
  };

  // 渲染详情
  renderPreviewDetail = (data) => {
    // 如果是详情页面没数据 返回--
    if (is.empty(data) || is.not.existy(data)) {
      return '--';
    }

    return (
      <CoreFinderList data={data} enableTakeLatest={false} enableRequest={false} />
    );
  }

  // 渲染编辑
  renderPreviewUpdate = (data) => {
    // 如果是编辑创建页面返回空
    if (is.empty(data) || is.not.existy(data)) {
      return <React.Fragment />;
    }

    return (
      <CoreFinderList data={data} enableDownload={false} enableRemove onRemove={this.onRemove} enableRequest={false} />
    );
  }

  // 预览组件
  renderCorePreview = () => {
    const { value, displayMode } = this.props;

    // 判断显示模式，true为详情
    if (displayMode) {
      return this.renderPreviewDetail(value);
    }

    // 显示编辑
    return this.renderPreviewUpdate(value);
  }

  render() {
    const {
      children,
      displayMode,
    } = this.props;

    return (
      <React.Fragment>
        {
          !displayMode ?
            <AntdUpload
              name="file"
              onChange={this.onChangeUpload}
              beforeUpload={this.onUpload}
              showUploadList={false}
              multiple
            >
              {children || <Button><UploadOutlined />点击上传</Button>}
            </AntdUpload>
            :
            null
        }
        {/* 预览组件 */}
        {this.renderCorePreview()}
      </React.Fragment>
    );
  }
}

Upload.propTypes = {
  domain: PropTypes.string,                   // s3上传命名空间
  showFileList: PropTypes.bool,               // 是否展示已上传文件列表
  value: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,         // 文件名
    url: PropTypes.string,                    // 文件url，用于下载
  })),
  onChange: PropTypes.func,
  displayMode: PropTypes.bool,                // 只展示文件列表, 为true时，showFileList失效 true为详情，false为编辑
};

Upload.defaultProps = {
  showFileList: true, // 是否展示已上传文件列表
  onChange: () => { },
  displayMode: false,
};

// 根据字段路径获取Upload所需的value
Upload.getInitialValue = (dataSource, path) => {
  const value = dot.get(dataSource, path);
  if (!value || is.empty(value)) {
    return undefined;
  }
  const res = value.map((info) => {
    return {
      key: info.file_name,
      url: info.file_url,
    };
  });
  return res;
};

// 常量配置
Upload.UploadDomains = UploadDomains;

const mapStateToProps = ({ applicationFiles }) => ({ applicationFiles });

export default connect(mapStateToProps)(Upload);
