/**
 * 上传文件的表单组件
 * **只能在表单中使用**
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dot from 'dot-prop';
import { connect } from 'dva';
import { Upload as AntdUpload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CoreFinder from './finder';

import { Unit } from '../../application/define';

const { CoreFinderList } = CoreFinder;

// domain常量配置
const UploadDomains = {
  OAUploadDomain: 'oa_approval',   // oa 单据使用的上传domain
};

class OaUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      fileType: null, // 文件预览类型
      fileUrl: null, // 文件预览地址
      visible: false, // 是否显示预览弹窗
      fileName: '', // 文件预览名称
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
    if (file.size >= 15200000) {
      return message.error('单个文件最大限制为15兆，请重新上传');
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
    } = this.props;
    if (!Array.isArray(value)) return;
    let nextValue = [...value];
    nextValue.splice(index, 1);
    // 如果没有文件，给value undefined保持字段无数据为undefined的约定
    if (nextValue.length === 0) {
      nextValue = undefined;
    }
    this.props.onChange(nextValue);
  };
  // 设置预览参数
  onUploadSuccess = (type, url, name) => {
    this.setState({ fileName: name, fileType: type, fileUrl: url, visible: true });
  }

  // 预览
  onChangePreview = (key, url) => {
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
  // 取消弹窗
  setVisible=() => { this.setState({ visible: false }); }
// 预览组件
  renderCorePreview=() => {
    const { value } = this.props;

  // displayMode为true代表是详情页面 并且 数据存在
    if (Array.isArray(value) && dot.get(value, '0.url') && this.props.displayMode) {
      return (
        <CoreFinderList data={value} enableTakeLatest={false} />
      );
    }

  // displayMode为false代表是创建编辑页面 并且数据存在
    if (Array.isArray(value) && dot.get(value, '0.key') && !this.props.displayMode) {
      return (
        <CoreFinderList data={value} enableDownload={false} enableRemove onRemove={this.onRemove} />
      );
    }

  // 如果是详情页 没数据 展示 --
    if (this.props.displayMode) {
      return '--';
    }
  // 如果是编辑创建页 返回空
    return <React.Fragment />;
  }

  // 渲染已上传文件列表
  renderFileList = () => {
    const {
      showFileList,
      value,
      displayMode,
    } = this.props;
    if (!Array.isArray(value) || value.length === 0) {
      if (displayMode) return '--';
      return null;
    }
    if (!showFileList && !displayMode) return null;

    // 预览组件
    return this.renderCorePreview();
  };

  render() {
    const {
      children,
      displayMode,
    } = this.props;
    return (
      <div>
        {
          !displayMode ?
            <AntdUpload
              name="file"
              onChange={this.onChangeUpload}
              beforeUpload={this.onUpload}
              showUploadList={false}
              multiple
            >
              {children || <Button><UploadOutlined />上传</Button>}
            </AntdUpload> :
            null
        }
        {/* 渲染文件列表*/}
        {this.renderFileList()}
      </div>
    );
  }
}

OaUpload.propTypes = {
  domain: PropTypes.string,     // s3上传命名空间
  showFileList: PropTypes.bool, // 是否展示已上传文件列表
  value: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired, // 文件名
    url: PropTypes.string, // 文件url，用于下载
  })),
  onChange: PropTypes.func,
  displayMode: PropTypes.bool, // 只展示文件列表, 为true时，showFileList失效
};

OaUpload.defaultProps = {
  showFileList: true, // 是否展示已上传文件列表
  onChange: () => { },
  displayMode: false,
};

// 根据字段路径获取Upload所需的value
OaUpload.getInitialValue = (dataSource, path) => {
  const value = dot.get(dataSource, path);
  if (!value || !Array.isArray(value)) {
    return undefined;
  }
  const res = [];
  value.forEach((info) => {
    res.push({
      key: info.file_name,
      url: info.file_url,
    });
  });
  return res;
};

// 常量配置
OaUpload.UploadDomains = UploadDomains;

const mapStateToProps = ({ applicationFiles }) => ({ applicationFiles });
export default connect(mapStateToProps)(OaUpload);


// /**
//  * 上传文件的表单组件
//  * **只能在表单中使用**
//  */
//  import React, { useState } from 'react';
//  import PropTypes from 'prop-types';
//  import dot from 'dot-prop';
//  import { connect } from 'dva';
//  import { Upload as AntdUpload, Button, message } from 'antd';
//  import { UploadOutlined } from '@ant-design/icons';
//  import { CoreFinderList } from './finder';

//  import { Unit } from '../../application/define';


//  // domain常量配置
//  const UploadDomains = {
//    OAUploadDomain: 'oa_approval',   // oa 单据使用的上传domain
//  };

//  const OaUpload = (props = {}) => {
//    const {
//      domain,     // s3上传命名空间
//      showFileList, // 是否展示已上传文件列表
//      value,
//      onChange,
//      displayMode, // 只展示文件列表, 为true时，showFileList失效
//      children,
//    } = props;

//    // 设置上传文件列表
//    const [fileList, setFileList] = useState([]);
//    // 文件预览类型
//    const [fileType, setFileType] = useState(null);
//    // 文件预览地址
//    const [fileUrl, setFileUrl] = useState(null);
//    // 是否显示预览弹窗
//    const [visible, setIsVisible] = useState(false);
//    // 文件预览名称
//    const [fileName, setFileName] = useState(null);

//    // 上传成功回调
//    const onUploadSuccessCallback = (file, fileKey) => {
//      const fileLists = [fileKey];
//      const list = fileLists.map((item) => {
//        return { key: item };
//      });
//      if (fileKey) {
//        if (Array.isArray(value)) {
//          onChange([...value, ...list]);
//        } else {
//          onChange(list);
//        }
//      }
//      setFileList(fileLists);
//    };

//    // 选择文件回调
//    const onChangeUpload = ({ file }) => {
//      // 获取文件后缀名
//      let fileTypes = '';
//      let fileKey = '';
//      if (file.name) {
//        fileTypes = file.name.split('.').pop();
//        fileKey = file.name.slice(0, file.name.lastIndexOf('.'));
//        // 判断上传文件的后缀名是否支持,后缀名大写转小写
//        if (Unit.uploadFileSuffixs(fileTypes) === false) {
//          return message.error(`您所上传的${file.name}格式不支持上传`);
//        }
//      }
//      if (file.size >= 15200000) {
//        return message.error('单个文件最大限制为15兆，请重新上传');
//      }

//      props.dispatch({
//        type: 'applicationFiles/uploadAmazonFile',
//        payload: {
//          file,
//          domain,
//          fileType: fileTypes,
//          fileKey,
//          onSuccessCallback: key => onUploadSuccessCallback(file, key),
//        },
//      });
//    };

//    const onUpload = () => false;

//    // 移除文件
//    const onRemove = (index) => {
//      if (!Array.isArray(value)) return;
//      let nextValue = [...value];
//      nextValue.splice(index, 1);
//      // 如果没有文件，给value undefined保持字段无数据为undefined的约定
//      if (nextValue.length === 0) {
//        nextValue = undefined;
//      }
//      onChange(nextValue);
//    };
//    // 设置预览参数
//    const onUploadSuccess = (type, url, name) => {
//      setFileName(name);
//      setFileType(type);
//      setIsVisible(true);
//      setFileUrl(url);
//    };

//    // 预览
//    const onChangePreview = (key, url) => {
//      if (url && key) {
//        let fileTypes = null;
//        const reg = /\.(\w+)$/;
//        fileTypes = key.match(reg)[1];
//        onUploadSuccess(fileTypes, url, key);
//        return;
//      }
//      props.dispatch({
//        type: 'applicationFiles/fetchKeyUrl',
//        payload: {
//          key,
//          onUploadSuccess: (type, adress) => onUploadSuccess(type, adress, key),
//        },
//      });
//    };

//    // 取消弹窗
//    const setVisible = () => { setIsVisible(false); };
//    // 预览组件
//    const renderCorePreview = () => {
//      // displayMode为true代表是详情页面 并且 数据存在
//      if (Array.isArray(value) && dot.get(value, '0.url') && displayMode) {
//        return (
//          <CoreFinderList data={value} enableTakeLatest={false} />
//        );
//      }

//      // displayMode为false代表是创建编辑页面 并且数据存在
//      if (Array.isArray(value) && dot.get(value, '0.key') && !displayMode) {
//        return (
//          <CoreFinderList data={value} enableDownload={false} enableRemove onRemove={onRemove} />
//        );
//      }

//      // 如果是详情页 没数据 展示 --
//      if (displayMode) {
//        return '--';
//      }
//      // 如果是编辑创建页 返回空
//      return <React.Fragment />;
//    };

//    // 渲染已上传文件列表
//    const renderFileList = () => {
//      if (!Array.isArray(value) || value.length === 0) {
//        if (displayMode) return '--';
//        return null;
//      }
//      if (!showFileList && !displayMode) return null;

//      // 预览组件
//      return renderCorePreview();
//    };
//    return (
//      <div>
//        {
//          !displayMode ?
//            <AntdUpload
//              name="file"
//              onChange={onChangeUpload}
//              beforeUpload={onUpload}
//              showUploadList={false}
//              multiple
//            >
//              {children || <Button><UploadOutlined />上传</Button>}
//            </AntdUpload> :
//            null
//        }
//        {/* 渲染文件列表*/}
//        {renderFileList()}
//      </div>
//    );
//  };

//  OaUpload.propTypes = {
//    domain: PropTypes.string,     // s3上传命名空间
//    showFileList: PropTypes.bool, // 是否展示已上传文件列表
//    value: PropTypes.arrayOf(PropTypes.shape({
//      key: PropTypes.string.isRequired, // 文件名
//      url: PropTypes.string, // 文件url，用于下载
//    })),
//    onChange: PropTypes.func,
//    displayMode: PropTypes.bool, // 只展示文件列表, 为true时，showFileList失效
//  };

//  OaUpload.defaultProps = {
//    showFileList: true, // 是否展示已上传文件列表
//    onChange: () => { },
//    displayMode: false,
//  };

//  // 根据字段路径获取Upload所需的value
//  OaUpload.getInitialValue = (dataSource, path) => {
//    const value = dot.get(dataSource, path);
//    if (!value || !Array.isArray(value)) {
//      return undefined;
//    }
//    const res = [];
//    value.forEach((info) => {
//      res.push({
//        key: info.file_name,
//        url: info.file_url,
//      });
//    });
//    return res;
//  };

//  // 常量配置
//  OaUpload.UploadDomains = UploadDomains;

//  const mapStateToProps = ({ applicationFiles }) => ({ applicationFiles });
//  export default connect(mapStateToProps)(OaUpload);

