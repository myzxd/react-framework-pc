/**
 * 弹窗第二版 头部组件
 */
import React from 'react';
import { Button, message } from 'antd';
import is from 'is_js';
import { ZoomInOutlined, ZoomOutOutlined, CaretLeftOutlined, DownloadOutlined, CaretRightOutlined, SendOutlined } from '@ant-design/icons';
import { styleCommon, onChangeDownPreview } from './view';
import styles from './styles.modules.less';
import aoaoBossTools from '../../../utils/util';

const renderModalHeader = ({
   dispatch, setEnclosureIndex,
  onChangePreview, dataSource, setLoading, enclosureAdress,
  enclosureIndex, enclosureName, showZoom, previewSize, setPreviewSize,
  appointListKey,
  showOpenWindow, showDownLoad, showSwitch }) => {
  const fileName = enclosureName ? enclosureName : '预览';

  // 是否显示放大缩小的操作按钮
  const isShowZoomOperation = showZoom ? styleCommon.initial : styleCommon.none;
  // 是否显示在另一个窗口打开的操作按钮
  const isShowOpenWindowOperation = showOpenWindow ? styleCommon.initial : styleCommon.none;
  // 是否显示下载操作按钮
  const isShowDownloadOperation = showDownLoad ? styleCommon.initial : styleCommon.none;
  // 是否显示左右切换操作按钮 /*如果附件列表是空也不显示左右切换
  const isShowSwitchOperation = showSwitch && is.not.empty(dataSource) ? styleCommon.initial : styleCommon.none;
 // 放大预览
  const onSwitchEnlarge = () => setPreviewSize(true);
 // 默认大小预览
  const onSwitchDefaultSize = () => setPreviewSize(false);


  //  展示默认ico
  let renderPreviewIco = <Button className={styles['page-preview-model-header-operation']} icon={<ZoomOutOutlined />} onClick={onSwitchDefaultSize} />;
  // 展示放大ico
  if (!previewSize) {
    renderPreviewIco = <Button className={styles['page-preview-model-header-operation']} icon={<ZoomInOutlined />} onClick={onSwitchEnlarge} />;
  }

  // 在另一个窗口打开
  const onClickOpen = () => {
    aoaoBossTools.popUpCompatible(enclosureAdress);
  };

   // 点击预览上一个
  const onClickPrevious = () => {
    setLoading && setLoading(true);
    const pNewIndex = enclosureIndex - 1;

    // 取出文件名称
    let newFileKey = '';

    if (appointListKey && is.not.empty(dataSource)) {
      newFileKey = dataSource[pNewIndex][appointListKey];
    }

    if (is.empty(newFileKey) || is.not.existy(newFileKey)) {
      message.info('附件名称找不到，请传入appointListKey属性');
      setLoading && setLoading(false);
      return;
    }

    // 调用预览接口
    onChangePreview(newFileKey, () => {
      // 设置文件索引
      setEnclosureIndex(pNewIndex);
    });
  };

  // 点击预览下一个
  const onClickNext = () => {
    setLoading && setLoading(true);
    // 索引
    const newIndex = enclosureIndex + 1;
    // 文件名称
    let newFileKey = '';
    if (appointListKey && is.not.empty(dataSource)) {
      newFileKey = dataSource[newIndex][appointListKey];
    }

    if (is.empty(newFileKey) || is.not.existy(newFileKey)) {
      message.info('附件名称找不到，请传入appointListKey属性');
      setLoading && setLoading(false);
      return;
    }

    // 调用预览接口
    onChangePreview(newFileKey, () => {
     // 设置文件索引
      setEnclosureIndex(newIndex);
    });
  };

  const onClickDownLoad = () => {
    if (onChangeDownPreview) {
      onChangeDownPreview(enclosureName, dispatch);
      return;
    }
    message.info('onChangeDownPreview事件不存在');
  };

  const renderChild = () => {
    return (
      <div>
        <span style={isShowZoomOperation}>
          {/* 显示放大缩小ico */}
          {renderPreviewIco}
        </span>
        <Button style={isShowOpenWindowOperation} className={styles['page-preview-model-header-operation']} icon={<SendOutlined />} onClick={onClickOpen} />
        <Button style={isShowSwitchOperation} disabled={enclosureIndex === 0} icon={<CaretLeftOutlined />} onClick={onClickPrevious} />
        <Button style={isShowSwitchOperation} className={styles['page-preview-model-header-operation']} disabled={enclosureIndex === (dataSource.length - 1)} icon={<CaretRightOutlined />} onClick={onClickNext} />
        <Button style={isShowDownloadOperation} type="primary" icon={<DownloadOutlined />} onClick={onClickDownLoad} />
      </div>
    );
  };

  return (
    <div className={styles.header}>
      <span className={styles['header-file-name']}>{fileName}</span>
      {/* 渲染header操作按钮 */}
      {renderChild()}
    </div>
  );
};

export default renderModalHeader;
