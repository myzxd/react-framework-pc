/**
 * 上传文件组件---用于费用管理中的所有上传功能
 */
// 解决了原上传组件只能上传excel文件，上传的文件名字不能自定义，不能多次上传的问题
// 上传流程:
// 1.向后端发送文件名，获得上传七牛需要的token。
// 2.带着后端返回的token和文件上传七牛，获得七牛返回的唯一key。
// 3.将七牛返回的key发送给后端保存
import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { UploadOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Upload, Button, message } from 'antd';
import styles from './upload.less';

import { Unit } from '../../../application/define';

 // 压缩文件格式
const verifyFileType = ['zip', 'rar'];

class ModalPage extends Component {

  static propTypes = {
    namespace: PropTypes.string,      // 命名空间
    isVerifyFileType: PropTypes.bool, // 是否不支持压缩文件上传
    onSuccess: PropTypes.func,        // 上传成功回调
  }

  static defaultProps = {
    namespace: 'default',
    isVerifyFileType: false,
  }

  // 上传七牛成功回调
  onSuccessUpload = ({ key }) => {
    const { onSuccess } = this.props;
    if (key && onSuccess) {
      onSuccess(key);
    }
  }

  // 获得七牛token
  getQINIUToken = (file) => {
    const { dispatch, namespace, isVerifyFileType } = this.props;
    const name = file.name.slice(file.name.lastIndexOf('.') + 1);
    // 不支持压缩文件上传 zip rar
    if (isVerifyFileType) {
      // 检测数组中的元素是否满足指定条件
      const flag = verifyFileType.some(item => item === name);
      if (flag === true) {
        message.error('不支持上传压缩文件');
        return;
      }
    }

    // 文件后缀
    const fileType = file.name.split('.').pop();
    // 判断上传文件的后缀名是否支持,后缀名大写转小写
    if (Unit.uploadFileSuffixs(fileType) === false) {
      return message.error(`您所上传的${file.name}格式不支持上传`);
    }
    dispatch({
      type: 'operationManage/getUploadTokenE',
      payload: {
        namespace,
        file,
        onSuccessUpload: this.onSuccessUpload,
      },
    });   // path token

    return false;
  };

  render() {
    // 上传文件
    const props = {
      action: '',
      name: 'file',
      beforeUpload: this.getQINIUToken,
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
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect()(Form.create()(ModalPage));
