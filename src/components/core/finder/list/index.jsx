/**
 * 文件列表展示
 */
import is from 'is_js';
import dot from 'dot-prop';
import { connect } from 'dva';
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Upload } from 'antd';
import CoreFinderModal from '../modal';
import { FileObject } from '../define';
import { Unit } from '../../../../application/define';

// modal支持的插件
const { ModalWidgets } = CoreFinderModal;

function CoreFinderList({ width, data, fetchAssets, enableRequest, enableRemove, enableDownload, onRemove, enableTakeLatest }) {
  // 文件列表
  const [files, setFiles] = useState([]);
  // 弹窗元素的引用
  const elementRef = useRef();

  // 获取wps文件信息
  useEffect(() => {
    // 获取文件的id列表
    const ids = data.map((item) => {
      return item.key;
    });

    // 默认不加载数据
    if (enableRequest !== true) {
      onLoadFiles(data);
      return;
    }

    // 如果ids数据中存在null或则undefined 不请求接口
    if (ids.includes(null) || ids.includes(undefined)) return;

    // 获取信息, 如果ids不存在，则不进行请求
    if (is.not.empty(ids) && is.existy(ids) && enableRequest === true) {
      // 请求数据
      fetchAssets({ ids, onSuccessCallback: onLoadFiles, enableTakeLatest });
    }
  }, [data]);

  // 重新加载文件
  const onReload = () => {
    // 获取文件的id列表
    const ids = data.map((item) => {
      return item.key;
    });
    // 获取信息
    fetchAssets({ ids, onSuccessCallback: onLoadFiles, enableTakeLatest });
  };


  // 加载文件预览信息
  const onLoadFiles = (infos = []) => {
    // 预览的文件信息
    const previews = {};
    infos.forEach((info) => {
      dot.set(previews, info.key, info);
    });

    // 文件列表
    const list = data.map((item) => {
      // 当前文件的预览信息
      const info = dot.get(previews, item.key, {});
      // 文件对象
      return new FileObject({
        // 文件标识
        key: item.key,
        // 文件下载url
        url: dot.get(info, 'url'),
        // 文件类型
        type: dot.get(info, 'type'),
        // 文件模式（只读，预览）
        mode: dot.get(info, 'doc.mode'),
        // 文件预览/编辑地址
        wps: dot.get(info, 'doc.url'),
        // 文件原始信息
        data: item.data,
        // 文件状态
        state: dot.get(info, 'doc.state'),
        // 文件错误信息
        msg: dot.get(info, 'doc.msg'),

      });
    });
    setFiles(list);
  };

  // 文件预览的回调函数
  const onClick = (index) => {
    if (elementRef.current && elementRef.current.onPreview) {
      elementRef.current.onPreview(index);
    }
  };

  // 渲染文件列表
  // NOTE: 该部分可以写独立组件实现列表，九宫格效果等。目前暂时不拆分。
  const renderList = () => {
    // 上传组件的配置
    const props = {
      // 文件列表
      fileList: files.map((file, index) => {
        return {
          uid: file.key,
          status: 'done',
          name: file.name,
          url: file.url,
          type: file.type,
          index,
          file,
        };
      }),
      // 预览回调
      onPreview: (file) => {
        onClick(file.index);
      },
      // 文件下载回调
      onDownload: (file) => {
        // NOTE:当前antd版本太低 现已用原生js操作dom 后期升级antd 一定要注意一下是否有问题
        const fileIndex = file.index;
        // eslint-disable-next-line no-undef
        const currentEle = document.getElementsByClassName('ant-upload-list-item-name ant-upload-list-item-name-icon-count-1');
        if (currentEle && currentEle[fileIndex]) {
          const ele = currentEle[fileIndex];
          ele.style.color = '#8a8486';
        }

        /**
         * 图片下载处理
         * 原因：后端返回的连接是预览链接 图片不支持下载 只能在新窗口打开
         */
        if (Unit.imageProcess(file.type)) {
          Unit.downloadWithBlob(file.name, file.url);
          return;
        }

        // 非图片下载
        if (file.file && file.file.download) {
          file.file.download();
        }
      },
      // 文件删除回调
      onRemove: (file) => {
        onRemove(file.index);
      },
      // 配置参数
      showUploadList: {
        // 是否显示预览icon
        showPreviewIcon: true,
        // 是否显示删除icon，如启用删除功能则显示
        showRemoveIcon: enableRemove,
        // 是否显示下载icon，如启用下载功能则显示
        showDownloadIcon: enableDownload,
      },
    };
    return <Upload {...props} />;
  };

  // 渲染弹窗
  const renderModal = () => {
    // 弹窗支持的插件
    const widgets = [
      // 文件预览导航，上一个&下一个
      ModalWidgets.navigate,
      // 文件下载
      ModalWidgets.download,
      // 弹窗 放大||缩小
      ModalWidgets.fullscreen,
      // 新窗口打开
      ModalWidgets.newOpen,
      // 刷新数据
      ModalWidgets.reload,
    ];
    return (
      <CoreFinderModal ref={elementRef} files={files} widgets={widgets} onReload={onReload} />
    );
  };

  // 可配置列表的宽度
  const style = {
    width,
  };

  return (
    <React.Fragment>
      {/* 文件列表 */}
      <div style={style}>
        {renderList()}
      </div>

      {/* 预览弹窗 */}
      {renderModal()}
    </React.Fragment>
  );
}

CoreFinderList.propTypes = {
  // 文件列表
  data: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
  // 获取wps附件信息
  fetchAssets: PropTypes.func,
  // 删除文件的回调函数
  onRemove: PropTypes.func,
  // 是否默认请求附件数据，true启用，false禁用（默认启用）
  enableRequest: PropTypes.bool,
  // 是否启用删除功能，true启用，false禁用（默认禁用）
  enableRemove: PropTypes.bool,
  // 是否启用下载功能，true启用，false禁用（默认启用）
  enableDownload: PropTypes.bool,
  // 默认加载 sage takeLatest 钩子
  enableTakeLatest: PropTypes.bool,
  // 可配置列表的宽度
  width: PropTypes.string,
};

CoreFinderList.defaultProps = {
  data: [],
  fetchAssets: () => { },
  onRemove: () => { },
  enableRequest: true,
  enableRemove: false,
  enableDownload: true,
  enableTakeLatest: true,
  width: '80%',
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => (
  {
    // 获取wps附件数据
    fetchAssets: (params) => { dispatch({ type: 'applicationWPS/fetchAssets', payload: params }); },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(CoreFinderList);
