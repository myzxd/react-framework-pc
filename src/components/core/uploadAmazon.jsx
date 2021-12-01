/**
 * 上传文件到amazon
 */
import is from 'is_js';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { Unit } from '../../application/define';

const noop = () => { };

const CoreUploadAmazon = (props) => {
  const {
    isVerifyFileType,               // 是否校验文件类型
    domain,
    title,
    customContent,
    onSuccess,
  } = props;

  // 上传文件到七牛
  const onUpload = () => {
    return false;
  };

  const onUploadSuccessCallback = (file, fileKey) => {
    if (fileKey && onSuccess) {
      onSuccess(fileKey);
    }
  };

  // 校验文件类型
  const onVerifyFileType = (fileType) => {
    // 后缀名大写转小写
    if (['xlsx', 'xls'].includes(fileType.toLowerCase()) !== true) {
      return message.error('只能上传excel格式文件');
    }

    return true;
  };

  const onChangeCallback = ({ file }) => {
    // 获取文件后缀名
    let fileType = '';
    let fileKey = '';
    if (file.name) {
      fileType = file.name.split('.').pop();
      fileKey = file.name.slice(0, file.name.lastIndexOf('.'));
    }

    // 校验文件类型
    if (isVerifyFileType && onVerifyFileType(fileType) !== true) {
      return false;
    }
    // 判断上传文件的后缀名是否支持,后缀名大写转小写
    if (Unit.uploadFileSuffixs(fileType) === false) {
      return message.error(`您所上传的${file.name}格式不支持上传`);
    }

    // 如果文件正确则创建任务
    props.dispatch({
      type: 'applicationFiles/uploadAmazonFile',
      payload: {
        file,
        domain,
        fileType,
        fileKey,
        onSuccessCallback: onUploadSuccessCallback.bind(this, file),
      },
    });
  };
  const params = {
    action: '',
    name: 'file',
    onChange: onChangeCallback,      // 文件变更回调（上传前调用）
    beforeUpload: onUpload,  // 上传文件的回调
    showUploadList: false,
  };
  let content = (<Button><UploadOutlined />{title}</Button>);

  // 如果传递customContent 则不显示按钮形态
  if (is.not.empty(customContent) && is.existy(customContent)) {
    content = customContent;
  }
  return (
    <span>
      {/* 判断是否传递自定义的按钮组件 */}
      {/* 上传文件 */}
      <Upload {...params}>
        {content}
      </Upload>
    </span>
  );
};

CoreUploadAmazon.propTypes = {
  isVerifyFileType: PropTypes.boolean,  // 是否校验文件类型
  domain: PropTypes.string,             // s3上传命名空间
  onSuccess: PropTypes.func.isRequired, // 成功的回调函数
  title: PropTypes.string,              // 按钮标题
  customContent: PropTypes.object,      // 如果传递则取消按钮形态
};

CoreUploadAmazon.defaultProps = {
  isVerifyFileType: true,               // 是否校验文件类型
  onSuccess: noop,
  multiple: false,
  domain: 'defaultFileName',
  title: '上传',
  customContent: '',
};

function mapStateToProps({ applicationFiles }) {
  return { applicationFiles };
}
export default connect(mapStateToProps)(CoreUploadAmazon);
