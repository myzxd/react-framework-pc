/**
 * 弹窗第二版
 */
import React, { useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { styleCommon } from './view';

import renderDifferentChild from './previewChild';
import renderModalHeader from './previewHeader';

import styles from './styles.modules.less';

const ComponentPreview = (props) => {
  const {
    visible,
    setVisible,
    loading,
    enclosureAdress,
    enclosureName,
    enclosureType,
    showZoom,
    showOpenWindow,
    showDownLoad,
    showSwitch,
    enclosureDefaultIndex,
    setLoading,
    dataSource,
    onChangePreview,
    dispatch,
    onChangeDownPreview,
    appointListKey,
  } = props;

  // 预览弹窗的大小
  const [previewSize, setPreviewSize] = useState(false);
 // 切换附件的索引
  const [enclosureIndex, setEnclosureIndex] = useState();

  // 关闭弹窗
  const onCancel = () => setVisible(false);
  // 弹窗的宽度
  const modelWidth = previewSize ? styleCommon.modelMaxWidth : styleCommon.modelMinWidth;
  // 弹窗的高度
  const modelHeight = previewSize ? styleCommon.modelMaxHeight : styleCommon.modelMinHeight;

  useEffect(() => {
    // 设置默认的索引
    setEnclosureIndex(enclosureDefaultIndex);
  }, [enclosureDefaultIndex]);

  const headerProps = {
    enclosureName,
    showZoom,
    previewSize,
    setPreviewSize,
    showOpenWindow,
    showDownLoad,
    showSwitch,
    enclosureIndex,
    enclosureAdress,
    setLoading,
    dataSource,
    onChangePreview,
    setEnclosureIndex,
    onChangeDownPreview,
    dispatch,
    appointListKey,
  };

  const modalProps = {
    title: renderModalHeader({ ...headerProps }),
    centered: true,
    visible,
    onCancel,
    width: modelWidth,
    destroyOnClose: true,
    footer: null,
    bodyStyle: modelHeight,
  };

  const childProps = {
    enclosureType,
    enclosureName,
    enclosureAdress,
  };


  const children = loading ? <Spin className={styles.loading} /> : renderDifferentChild({ ...childProps });

  return (
    <Modal {...modalProps}>
      {children}
    </Modal>
  );
};


ComponentPreview.propTypes = {
  loading: PropTypes.bool,
  visible: PropTypes.bool,
  enclosureName: PropTypes.string,
  enclosureType: PropTypes.string,
  enclosureAdress: PropTypes.string,
  showZoom: PropTypes.bool,
  setVisible: PropTypes.func,
  showOpenWindow: PropTypes.bool,
  showDownLoad: PropTypes.bool,
  showSwitch: PropTypes.bool,
  dataSource: PropTypes.array,
  enclosureDefaultIndex: PropTypes.number,
  onChangePreview: PropTypes.func,
  appointListKey: PropTypes.string,
};
ComponentPreview.defaultProps = {
  visible: false,                // 是否显示弹窗
  enclosureAdress: '',           // 附件地址                      /*必传
  enclosureType: '',             // 附件类型                      /*必传
  appointListKey: '',            // 告诉组件你附件列表里面的对应key的字段名 /*传附件列表必须传对应的key
  dataSource: [],                // 附件列表                      /*可配置 不传就是单个预览
  loading: false,                // 加载                         /*可配置
  enclosureName: '',             // 附件名称                      /*可配置 不传就是默认显示预览
  showZoom: false,               // 默认不显示放大缩小的按钮         /*可配置
  showOpenWindow: false,         // 默认不显示在另一个窗口打开操作按钮 /*可配置
  showDownLoad: false,           // 默认不显示下载操作按钮           /*可配置
  showSwitch: false,             // 默认不显示左右切换操作按钮        /*可配置
  enclosureDefaultIndex: 0,      // 附件索引
  onChangePreview: () => {},     // 调用预览附件的接口函数
  setVisible: () => {},          // 设置是否展示弹窗的函数
  setLoading: () => {},          // 设置loading
};
export default connect()(ComponentPreview);
