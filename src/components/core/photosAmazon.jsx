/**
 * 上传照片组件
 */
import dot from 'dot-prop';
import is from 'is_js';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const noop = () => { };

const CoreAmazonPhotos = (props = {}) => {
  const {
    onChange,
    maximum,
    isDisplayMode,
    value,
    multiple,
    domain,
    id,
    onChangeUploadDisabled,
    onRemove,
  } = props;

  const { keys, urls } = value;


  // 预览对话框
  const [visible, setVisible] = useState(false);
  // 禁用上传
  const [disabled, setDisabled] = useState(false);
  // 预览对话框
  const [image, setImage] = useState('');
  // 上传文件列表
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (is.not.empty(keys) && is.not.empty(urls) && Array.isArray(keys) && Array.isArray(urls)) {
      const fileLists = keys.map((key, index) => {
        return {
          uid: key,
          name: key,
          url: urls[index],
        };
      });
      setFileList(fileLists);
    } else {
      setFileList([]);
    }
  }, [keys, urls]);

  // 预览图片
  const onPreview = (file) => {
    setVisible(true);
    setImage(file.url || file.thumbUrl);
  };

  // 上传文件到七牛
  const onUpload = () => {
    return false;
  };

  // 取消预览
  const onCancel = () => {
    setVisible(false);
  };

  // 判断文件是否已经上传了
  const onIsUploaded = (file) => {
    return fileList.filter(item => item.name === file.name).length >= 1;
  };

  const onUploadSuccessCallback = async (file, fileKey) => {
    // 获取的最新数据
    const newData = {
      uid: fileKey,
      name: file.name,
      url: await onGetBase64(file),
    };

    // 新旧数据合并
    let result = [];
    // 更新文件列表数据  注 因为闭包问题采用函数方式set
    setFileList((curFileList) => {
      result = [
        ...curFileList,
        newData,
      ];
      return result;
    });
    onUpdataFormValue(result);

    if (maximum === 1) {
      setDisabled(false);
    }

    // 禁用回调
    if (onChangeUploadDisabled) {
      onChangeUploadDisabled();
    }
  };

  const onFailureCallback = () => {
    if (maximum === 1) {
      setDisabled(false);
    }
  };

  // 更新表单数据
  const onUpdataFormValue = (files) => {
    const values = {
      keys: files.map(file => dot.get(file, 'uid', '')).filter(item => item !== ''),
      urls: files.map(file => dot.get(file, 'url', '')).filter(item => item !== ''),
    };
    if (onChange) {
      onChange(values);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const onCheckValue = (files, key) => {
    for (const k of files) {
      if (k.uid === key) {
        return true;
      }
    }
    return false;
  };

  const onGetBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const onChangeCallback = ({ file }) => {
    // 格式名称
    const name = file.name.slice(file.name.lastIndexOf('.') + 1);
    let fileKey = '';
    if (file.name) {
      fileKey = file.name.slice(0, file.name.lastIndexOf('.'));
    }
    // 删除图片时
    if (file && file.status === 'removed') {
      const fileLists = fileList.filter(item => item.uid !== file.uid);
      setFileList(fileLists);
      onUpdataFormValue(fileLists);
      return;
    }
    // 添加图片时
    // 验证上传文件是否为图片
    if (['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) === -1) {
      return message.error('只能上传图片');
    }

    // 如果上传的图片已经上传过，进行拦截
    if (onIsUploaded(file)) {
      return message.error('此图片已经上传过');
    }

    // 只能上传一张图片时，上传过程中，禁用
    if (maximum === 1) {
      setDisabled(true);
    }

    if (onChangeUploadDisabled) {
      onChangeUploadDisabled();
    }
    // 如果文件正确则创建任务
    props.dispatch({
      type: 'applicationFiles/uploadAmazonFile',
      payload: {
        file,
        domain,
        fileKey,
        fileType: name,
        onChangeUploadDisabled, // 禁用上传
        onSuccessCallback: onUploadSuccessCallback.bind(this, file),
        onFailureCallback,
      },
    });
  };

  // 上传按钮
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">上传图片</div>
    </div>
  );
  const params = {
    action: '',
    listType: 'picture-card',
    // file对象里的url需要是字符串, 如果是数组Upload组件会报错
    fileList,
    onPreview,    // 预览回调
    onChange: onChangeCallback,      // 文件变更回调（上传前调用）
    beforeUpload: onUpload,  // 上传文件的回调
    onRemove,      // 删除文件的回调
  };
  // 如果是displaymode,隐藏删除按钮
  if (isDisplayMode) {
    params.showUploadList = { showRemoveIcon: false };
  }
  return (
    <div className="clearfix" id={id}>

      {/* 上传文件 */}
      <Upload multiple={multiple} {...params} disabled={props.disabled || disabled}>
        {(fileList.length >= maximum || isDisplayMode) ? null : uploadButton}
      </Upload>

      {/* 预览图片 */}
      <Modal visible={visible} footer={null} onCancel={onCancel}>
        <img alt="preview" style={{ width: '100%', marginTop: 15 }} src={image} />
      </Modal>
    </div>
  );
};

CoreAmazonPhotos.propTypes = {
  onChange: PropTypes.func.isRequired, // 表单onChange
  maximum: PropTypes.number,           // 最大上传数量
  isDisplayMode: PropTypes.bool,       // 是否是编辑模式
  value: PropTypes.object,             // 表单默认值
  multiple: PropTypes.bool,            // 是否支持多选
  domain: PropTypes.string,            // s3上传命名空间
  disabled: PropTypes.bool,            // 禁用
  id: PropTypes.string, // 自定义表单绑定的id
};

CoreAmazonPhotos.defaultProps = {
  onChange: noop,
  maximum: 20,
  isDisplayMode: false,
  value: { keys: [], urls: [] },
  multiple: false,
  domain: 'defaultFileName',
  disabled: false,
  id: '',
};

export default connect()(CoreAmazonPhotos);
