/**
 * 文件预览弹窗
 */
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import dot from 'dot-prop';
import { Modal, message } from 'antd';
import PropTypes from 'prop-types';
import styles from './style.less';
import aoaoBossTools from '../../../../utils/util';
import { Unit } from '../../../../application/define';
import InnerComponentPreview from './preview';
import InnerComponentNavigateWidget from './widgets/navigate';
import InnerComponentFullScreenWidget from './widgets/fullscreen';
import InnerComponentNewTabWidget from './widgets/newTab';
import InnerComponentDownloadWidget from './widgets/download';
import InnerComponentReloadWidget from './widgets/reload';
// 弹窗显示的插件
const ModalWidgets = {
  reload: 'reload',         // 重新加载
  newOpen: 'newOpen',       // 新窗口打开
  navigate: 'navigate',     // 左右导航（上一个，下一个）
  download: 'download',     // 下载文件
  fullscreen: 'fullscreen', // 全屏
};

const CoreFinderModal = ({ files, widgets, onReload }, ref) => {
  // 预览文件是否可见
  const [visible, setVisible] = useState(false);
  // 当前预览的文件索引 (默认-1表示不展示文件)
  const [current, setCurrent] = useState(-1);
  // 全屏切换
  const [isFullScreen, setIsFullscreen] = useState(false);

  // 点击文件预览
  const onPreview = (index) => {
    setVisible(true);
    setCurrent(index);
  };

  // 隐藏弹窗
  const onCancel = () => {
    setVisible(false);
    // (默认-1表示不展示文件)
    setCurrent(-1);
    // 重置放大缩小按钮 默认状态
    setIsFullscreen(false);
  };

  // 下载文件
  const onDownload = () => {
    const preview = dot.get(files, `${current}`, undefined);

    /**
     * 图片下载处理
     * 原因：后端返回的连接是预览链接 图片不支持下载 只能在新窗口打开
     */
    if (preview && Unit.imageProcess(preview.type)) {
      Unit.downloadWithBlob(preview.name, preview.url);
      return;
    }
    // 如果download存在 执行download下载当前文件
    if (preview.download) {
      preview.download();
    }
  };

  // 弹窗 放大||缩小
  const onFullScreen = () => {
    setIsFullscreen(!isFullScreen);
  };

  // 新窗口打开
  const onChangeNewOpen = () => {
    const preview = dot.get(files, `${current}`, undefined);
    // 如果wps和type类型存在 就执行并在新窗口打开当前地址
    if (preview.wps && preview.type) {
      aoaoBossTools.popUpCompatible(preview.wps);
      return;
    }
    message.info('当前文件不支持新窗口预览');
  };

  // 暴露给上一级的回调函数
  useImperativeHandle(ref, () => ({
    onPreview,
    onCancel,
  }));

  // 渲染modal 操作按钮
  const renderWidgets = () => {
    // 操作按钮
    const operations = [];
    // 判断是否有重新加载按钮
    if (widgets.includes(ModalWidgets.reload)) {
      operations.push(
        <InnerComponentReloadWidget key="reload" onReload={onReload} />,
      );
    }
    // 判断是否有新窗口打开按钮
    if (widgets.includes(ModalWidgets.newOpen)) {
      operations.push(
        <InnerComponentNewTabWidget key="newOpen" onOpenNewTab={onChangeNewOpen} />,
      );
    }
    // 判断是否有全屏按钮
    if (widgets.includes(ModalWidgets.fullscreen)) {
      operations.push(
        <InnerComponentFullScreenWidget key="fullscreen" isFullScreen={isFullScreen} onFullScreen={onFullScreen} />,
      );
    }

    // 判断是否有上一个下一个导航
    if (widgets.includes(ModalWidgets.navigate)) {
      operations.push(
        <InnerComponentNavigateWidget key="navigate" current={current} onChange={setCurrent} total={files.length} />,
      );
    }

    // 判断是否有下载按钮
    if (widgets.includes(ModalWidgets.download)) {
      operations.push(
        <InnerComponentDownloadWidget key="download" onDownload={onDownload} />,
      );
    }

    return operations;
  };

  // 渲染标题
  const renderTitle = () => {
    // 当前预览的文件
    const preview = dot.get(files, `${current}`, undefined);
    return (
      <div className={styles['app-comp-core-modal-title-box']}>
        <p className={styles['app-comp-core-model-title']}>{dot.get(preview, 'name')}</p>
        <p className={styles['app-comp-core-model-switch']}>{renderWidgets()}</p>
      </div>
    );
  };

  // 渲染文件预览
  const renderPreview = () => {
    // 当前预览的文件
    const preview = dot.get(files, `${current}`, undefined);

    // 预览文件为空 TODO：需要进一步处理
    if (preview === undefined) {
      return (
        <React.Fragment />
      );
    }

    return (
      <React.Fragment>
        <InnerComponentPreview name={preview.name} state={preview.state} msg={preview.msg} type={preview.type} url={preview.url} wps={preview.wps} />
      </React.Fragment>
    );
  };

  // 默认的窗口尺寸
  let sizeProps = {
    width: 1000,                     // 默认展示modal的宽度为1000
    bodyStyle: { minHeight: 650 },   // 默认展示modal的最小高度为650
  };
  // 如果为true 就设置modal最大宽高为100%
  if (isFullScreen) {
    sizeProps = {
      width: '100%',
      bodyStyle: { minHeight: '100%' },
    };
  }

  return (
    <Modal {...sizeProps} centered title={renderTitle()} footer={null} visible={visible} onOk={onCancel} onCancel={onCancel}>
      {renderPreview()}
    </Modal>
  );
};
CoreFinderModal.propTypes = {
  // 文件列表
  files: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,

  // 插件显示的配置文件
  widgets: PropTypes.array,

  // 重新加载函数
  onReload: PropTypes.func,
};

CoreFinderModal.defaultProps = {
  files: [],
  widgets: [],
  onReload: () => { },
};

// 变量导出
const Component = forwardRef(CoreFinderModal);
Component.ModalWidgets = ModalWidgets;

export default Component;
