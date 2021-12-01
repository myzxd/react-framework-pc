/**
 * wps
 * 预览弹窗
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Modal, Button, Spin, Result } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, CaretLeftOutlined, DownloadOutlined, CaretRightOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons';
import is from 'is_js';
import dot from 'dot-prop';
import FileViewer from 'react-file-viewer';
import { isImageTypeTool, isDocTypeTool } from './view';
import aoaoBossTools from '../../../utils/util';
import styles from './styles.modules.less';
// 公共样式
const styleCommon = {
  initial: { display: 'initial' },
  none: { display: 'none' },
  modelMaxWidth: '100%',
  modelMinWidth: 1000,
  modelMaxHeight: { height: '100%', overflowY: 'auto' },
  modelMinHeight: { height: 650, overflowY: 'auto' },
};
function ComponentPreviewModel(props) {
  const {
    dispatch, defaultLoading, enclosureLists, enclosureDefaultName, visible, setVisible,
    enclosureAdress, onChangePreview, enclosureDefaultIndex, onChangeDownPreview, showZoom,
    showOpenWindow, showDownLoad, showSwitch, showPreviewName, enclosureDefaultType } = props;

  // 预览弹窗的大小
  const [previewSize, setPreviewSize] = useState(false);
  // 切换附件的索引
  const [enclosureIndex, setEnclosureIndex] = useState();
  // 文件名称
  const [enclosureName, setEnclosureName] = useState();
  // 文件类型
  const [enclosureType, setEnclosureType] = useState();
  // loading
  const [loading, setLoading] = useState(false);
  // 放大预览
  const onSwitchEnlarge = () => setPreviewSize(true);
  // 默认大小预览
  const onSwitchDefaultSize = () => setPreviewSize(false);

  useEffect(() => {
    // 设置默认文件名称
    setEnclosureName(enclosureDefaultName);
    // 设置默认的文件类型
    setEnclosureType(enclosureDefaultType);
     // 设置默认加载
    setLoading(defaultLoading);
  }, [enclosureDefaultType, defaultLoading, enclosureDefaultName]);

  useEffect(() => {
   // 设置默认的索引
    setEnclosureIndex(enclosureDefaultIndex);
  }, [enclosureDefaultIndex]);
  // 点击预览上一个
  const onClickPrevious = () => {
    setLoading(true);
    const pNewIndex = enclosureIndex - 1;
    // 取出文件名称
    let newFileKey = '';
    if (dot.get(enclosureLists[pNewIndex], 'asset_key')) {
      newFileKey = dot.get(enclosureLists[pNewIndex], 'asset_key');
    }
    if (dot.get(enclosureLists[pNewIndex], 'file_name')) {
      newFileKey = dot.get(enclosureLists[pNewIndex], 'file_name');
    }
    if (dot.get(enclosureLists[pNewIndex], 'key')) {
      newFileKey = dot.get(enclosureLists[pNewIndex], 'key');
    }
    // 调用预览接口
    onChangePreview(newFileKey, (type) => {
      // 设置文件类型
      setEnclosureType(type);
      // 设置文件名称
      setEnclosureName(newFileKey);
      // 设置文件索引
      setEnclosureIndex(pNewIndex);
      // setLoading(false);
    });
  };
  // 点击预览下一个
  const onClickNext = () => {
    setLoading(true);
    // 索引
    const newIndex = enclosureIndex + 1;
    // 文件名称
    let newFileKey = '';
    if (dot.get(enclosureLists[newIndex], 'asset_key')) {
      newFileKey = dot.get(enclosureLists[newIndex], 'asset_key');
    }
    if (dot.get(enclosureLists[newIndex], 'file_name')) {
      newFileKey = dot.get(enclosureLists[newIndex], 'file_name');
    }
    if (dot.get(enclosureLists[newIndex], 'key')) {
      newFileKey = dot.get(enclosureLists[newIndex], 'key');
    }

    // 调用预览接口
    onChangePreview(newFileKey, (type) => {
      // 设置文件类型
      setEnclosureType(type);
     // 设置文件名称
      setEnclosureName(newFileKey);
     // 设置文件索引
      setEnclosureIndex(newIndex);

      // setLoading(false);
    });
  };
  // 在另一个窗口打开
  const onClickOpen = () => {
    aoaoBossTools.popUpCompatible(enclosureAdress);
  };

  // 渲染header
  const renderModalHeader = (datas, name, index) => {
    // 如果是多个文件预览 显示 切换
    if (is.existy(datas) && is.not.empty(datas) && is.array(datas)) {
      // 如果传文件名称则显示/否则取默认值
      const fileName = name ? name : '预览';

      // 是否展示文件名称
      const isShowPreviewName = showPreviewName ? styleCommon.initial : styleCommon.none;
      // 渲染header操作按钮
      const renderChild = () => {
        // 这里默认展示放大ico
        if (name) {
          //  展示默认ico
          let renderPreviewIco = <Button className={styles['page-preview-model-header-operation']} icon={<ZoomOutOutlined />} onClick={onSwitchDefaultSize} />;
          // 展示放大ico
          if (!previewSize) {
            renderPreviewIco = <Button className={styles['page-preview-model-header-operation']} icon={<ZoomInOutlined />} onClick={onSwitchEnlarge} />;
          }

          // 是否显示放大缩小的操作按钮
          const isShowZoomOperation = showZoom ? styleCommon.initial : styleCommon.none;
          // 是否显示在另一个窗口打开的操作按钮
          const isShowOpenWindowOperation = showOpenWindow ? styleCommon.initial : styleCommon.none;
          // 是否显示下载操作按钮
          const isShowDownloadOperation = showDownLoad ? styleCommon.initial : styleCommon.none;
          // 是否显示左右切换操作按钮
          const isShowSwitchOperation = showSwitch ? styleCommon.initial : styleCommon.none;

          return (
            <div>
              <span style={isShowZoomOperation}>
                {/* 显示放大缩小ico */}
                {renderPreviewIco}
              </span>
              <Button style={isShowOpenWindowOperation} className={styles['page-preview-model-header-operation']} icon={<SendOutlined />} onClick={onClickOpen} />
              <Button style={isShowSwitchOperation} disabled={index === 0} icon={<CaretLeftOutlined />} onClick={onClickPrevious} />
              <Button style={isShowSwitchOperation} className={styles['page-preview-model-header-operation']} disabled={index === (datas.length - 1)} icon={<CaretRightOutlined />} onClick={onClickNext} />
              <Button style={isShowDownloadOperation} type="primary" icon={<DownloadOutlined />} onClick={() => onChangeDownPreview(name, dispatch)} />
            </div>
          );
        }
        return <React.Fragment />;
      };

      return (
        <div className={styles.header}>
          <span style={isShowPreviewName} className={styles['header-file-name']}>{fileName}</span>
          {/* 渲染header操作按钮 */}
          {renderChild()}
        </div>
      );
    } else {
      // 如果是单个 只显示 文件名称
      return name ? name : '预览';
    }
  };
  // 关闭弹窗
  const oChangeCancel = () => setVisible(false);

  // 弹窗的宽度
  const modelWidth = previewSize ? styleCommon.modelMaxWidth : styleCommon.modelMinWidth;
  // 弹窗的高度
  const modelHeight = previewSize ? styleCommon.modelMaxHeight : styleCommon.modelMinHeight;

  const onError = (e) => {
    console.log(e, 'error in file-viewer');
  };

  // 文件类型： 大写 转 小写
  const fileType = enclosureType && enclosureType.toLowerCase();

  const renderDifferentChild = () => {
    let child = (<Result
      className={styles['component-preview-model-antd-result']}
      icon={<SmileOutlined />}
      title={`${enclosureType}格式不支持预览`}
    />);
    if (isImageTypeTool(enclosureType)) {
      child = (<div className={styles['file-box']}>
        <FileViewer
          key={enclosureName}
          fileType={fileType}
          filePath={enclosureAdress}
          onError={onError}
        />
      </div>);
    }
    if (isDocTypeTool(enclosureType)) {
      child = (<iframe width="100%" height="650px" src={enclosureAdress} title="暂无数据" />);
    }

    return child;
  };
  return (
    <Modal
      title={renderModalHeader(enclosureLists, enclosureName, enclosureIndex)}
      centered
      visible={visible}
      onCancel={oChangeCancel}
      width={modelWidth}
      destroyOnClose
      footer={null}
      bodyStyle={modelHeight}
    >
      {loading ? <Spin className={styles.loading} /> : renderDifferentChild()}
    </Modal>
  );
}

ComponentPreviewModel.propTypes = {
  enclosureLists: PropTypes.array,
  enclosureDefaultName: PropTypes.string,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  enclosureAdress: PropTypes.string,
  onChangePreview: PropTypes.func,
  onChangeDownPreview: PropTypes.func,
  enclosureDefaultIndex: PropTypes.number,
  showZoom: PropTypes.bool,
  showOpenWindow: PropTypes.bool,
  showDownLoad: PropTypes.bool,
  showSwitch: PropTypes.bool,
  showPreviewName: PropTypes.bool,
};

ComponentPreviewModel.defaultProps = {
  enclosureLists: [],            // 附件列表
  enclosureDefaultName: '',      // 附件名称
  enclosureAdress: '',           // 附件地址
  visible: false,                // 是否显示弹窗
  enclosureDefaultIndex: 0,      // 附件索引
  showZoom: true,                // 默认显示放大缩小的按钮         /*可配置
  showOpenWindow: true,          // 默认显示在另一个窗口打开操作按钮 /*可配置
  showDownLoad: true,            // 默认显示下载操作按钮           /*可配置
  showSwitch: true,              // 默认显示左右切换操作按钮        /*可配置
  showPreviewName: true,         // 默认显示预览文件名称           /*可配置
  setVisible: () => {},          // 设置是否展示弹窗的函数
  onChangePreview: () => {},     // 调用预览附件的接口函数
  onChangeDownPreview: () => {}, // 调用附件下载接口函数
};

export default connect()(ComponentPreviewModel);
