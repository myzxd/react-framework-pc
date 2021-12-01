/**
 * 核心组件，照片墙组件
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Modal, message } from 'antd';

import style from './style/index.less';

const noop = () => { };

const CorePhotos = (props = {}) => {
  const {
    onChange, // 表单onChange
    maximum,           // 最大上传数量
    isDisplayMode,       // 是否是编辑模式
    value,             // 表单默认值
    multiple,
    disableds,
  } = props;
  // 预览对话框
  const [visible, setVisible] = useState(false);
  // 预览对话框
  const [image, setImage] = useState('');
  // 上传文件列表
  const [fileList, setFileList] = useState([]);


  // 预览图片
  const onPreview = (file) => {
    setVisible(true);
    setImage(file.url || file.thumbUrl);
  };

  // 上传文件到七牛
  const onUpload = (file) => {
    // 验证上传文件是否为图片
    if (['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) === -1) {
      return message.error('只能上传图片');
    }

    // 如果上传的图片已经上传过，进行拦截
    if (isUploaded(file)) {
      return message.error('此图片已经上传过');
    }

    // 如果文件正确则创建任务
    props.dispatch({ type: 'applicationFiles/uploadPhotos', payload: { file, onSuccessCallback: uploadSuccessCallback } });
    return false;
  };

  // 删除文件
  const onRemove = (file) => {
    const fileLists = fileList.filter((item) => {
      return item.uid !== file.uid;
    });
    setFileList([...fileLists]);
    updataFormValue(fileList);
  };

  // 取消预览
  const onCancel = () => {
    setVisible(false);
  };

  // 判断文件是否已经上传了
  const isUploaded = (file) => {
    return fileList.filter(item => item.name === file.name).length >= 1;
  };

  const uploadSuccessCallback = (file) => {
    setFileList([...fileList, file]);
    updataFormValue(fileList);
  };

  // 更新表单数据
  const updataFormValue = (files) => {
    const values = {
      keys: files.map(file => dot.get(file, 'uid', '')).filter(item => item !== ''),
      urls: files.map(file => dot.get(file, 'url', '')).filter(item => item !== ''),
    };
    if (onChange) {
      onChange(values);
    }
  };

  const checkValue = (files, key) => {
    for (const k of files) {
      if (k.uid === key) {
        return true;
      }
    }
    return false;
  };

  const { keys, urls } = value;
  // 如果默认数据为空，表单数据不为空，则赋值表单到默认数据中
  if (is.not.empty(keys) && is.not.empty(urls) && is.array(keys) && keys[0] && is.array(urls)) {
    // 从表单的赋值中初始化
    keys.forEach((key, index) => {
      if (checkValue(fileList, key)) return;
      fileList.push({
        uid: key,
        status: 'done',
        name: key,
        url: urls[index],
      });
    });
  } else {
    setFileList([]);
  }
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
    fileList: fileList.map((values) => {
      const { url } = values;
      return { ...value, url: is.existy(url) && is.array(url) ? dot.get(value, 'url.0', '') : url };
    }),
    onPreview,    // 预览回调
    onChange,      // 文件变更回调（上传前调用）
    beforeUpload: onUpload,  // 上传文件的回调
    onRemove,      // 删除文件的回调
  };
  // 如果是displaymode,隐藏删除按钮
  if (isDisplayMode) {
    params.showUploadList = { showRemoveIcon: false };
  }
  return (
    <div className="clearfix">

      {/* 上传文件 */}
      <Upload multiple={multiple} {...props} disabled={disableds}>
        {(fileList.length >= maximum || isDisplayMode) ? null : uploadButton}
      </Upload>

      {/* 预览图片 */}
      <Modal visible={visible} footer={null} onCancel={onCancel}>
        <img alt="preview" className={style['app-comp-core-photo-width']} src={image} />
      </Modal>
    </div>
  );
};

CorePhotos.propTypes = {
  onChange: PropTypes.func.isRequired, // 表单onChange
  maximum: PropTypes.number,           // 最大上传数量
  isDisplayMode: PropTypes.bool,       // 是否是编辑模式
  value: PropTypes.object,             // 表单默认值
  multiple: PropTypes.bool,            // 是否支持多选
};

CorePhotos.defaultProps = {
  onChange: noop,
  maximum: 20,
  isDisplayMode: false,
  value: {},
  multiple: false,
};

export default connect()(CorePhotos);
