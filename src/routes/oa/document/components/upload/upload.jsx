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
import { UploadOutlined } from '@ant-design/icons';
import { Unit } from '../../../../../application/define';
import { CoreFinder } from '../../../../../components/core';

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
      fileType: null, // 文件预览类型
      fileUrl: null, // 文件预览地址
      visible: false, // 是否显示预览弹窗
      fileName: '',             // 文件预览名称
      previewAdress: undefined, // 预览地址
      wpsVisible: false,       // 是否显示弹窗
      fileIndex: 0,            // 当前预览文件的索引
      enclosureType: null,     // 附件类型
      loading: false,          // 加载
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
    const maxSize = 30 * 1024 * 1024;
    // 最大上传文件大小
    if (file.size >= maxSize) {
      return message.error('单个文件最大限制为30兆，请重新上传');
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


  // 预览组件
  renderCorePreview=() => {
    const { value } = this.props;
    if (this.props.special && Array.isArray(value) && dot.get(value, '0.url')) {
      return (
        <CoreFinderList data={value} />
      );
    }

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
        {/* 3 预览 */}
        {this.renderCorePreview()}
      </div>
    );
  }
}

Upload.propTypes = {
  domain: PropTypes.string,             // s3上传命名空间
  value: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired, // 文件名
    url: PropTypes.string, // 文件url，用于下载
  })),
  onChange: PropTypes.func,
  displayMode: PropTypes.bool, // 只展示文件列表, 为true时，showFileList失效
};

Upload.defaultProps = {
  onChange: () => { },
  displayMode: false,
};

// 根据字段路径获取Upload所需的value
Upload.getInitialValue = (dataSource, path) => {
  const value = dot.get(dataSource, path);
  if (!value || !value.asset_maps || is.empty(value.asset_maps)) {
    return undefined;
  }
  const res = [];
  value.asset_maps.forEach((info) => {
    res.push({
      key: info.asset_key,
      url: info.asset_url,
    });
  });
  return res;
};

// 常量配置
Upload.UploadDomains = UploadDomains;

const mapStateToProps = ({ applicationFiles }) => ({ applicationFiles });
export default connect(mapStateToProps)(Upload);
