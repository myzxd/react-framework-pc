/**
 * 上传附件预览 *接口返回
 * 格式支持：jpg/jpeg/bmp/png/gif/xlsx/docx/pdf/xls/PDF
 * 不支持格式：txt/webp/rtf/ppt/tiff/csv/pptx
 */
import React, { useEffect, useState } from 'react';
import { message, Table, Modal, Button, Tabs } from 'antd';
import { DownloadOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import is from 'is_js';
import PropTypes from 'prop-types';
import FileViewer from 'react-file-viewer';
import styles from './styles.modules.less';
import { Unit } from '../../../application/define';


import { formatXlsxTool, annexEnumerationType, downLoadTool } from './view';

const { TabPane } = Tabs;

function ComponentFileView(props) {
  // 存储当前的预览的索引
  const [fileIndex, setFileIndex] = useState(null);
  // 文件地址
  const [fileUrlState, setFileUrlState] = useState('');
  // 文件类型
  const [fileTypeState, setFileTypeState] = useState(undefined);
  // 当前xlsx的数据
  const [excelData, setExcelData] = useState([]);
 // 文件名称
  const [fileName, setFileName] = useState('');

  const { fileUrl, visible, setVisible, fileType, fileKey, fileUrls } = props;


  useEffect(() => {
    // if (fileType === annexEnumerationType.xls || fileType === annexEnumerationType.XLS) {
    //   message.error('预览解析失败，建议直接下载查看');
    //   return;
    // }
    // 设置文件地址
    if (fileUrl && visible) {
      setFileUrlState(fileUrl);
    }
    // 设置文件类型
    if (fileType && visible) {
      setFileTypeState(fileType);
    }

    // 错误文件处理
    if (is.not.empty(fileType) && is.existy(fileType) && !Unit.uploadFileFormat(fileType)) {
      message.error(`您所上传的${fileType}格式不支持预览`);
      return;
    }
    /**
     * fileUrls
     * 只预览 传进来的是个数组
     * 点击其中一个预览 设置预览索引 标识当前点的是那个
     */
    if (is.existy(fileUrls) && is.not.empty(fileUrls) && is.array(fileUrls)) {
      fileUrls.find((item, index) => {
        const previewUrl = (item.asset_url || item.file_url || item.url);
        if (is.existy(previewUrl) && previewUrl === fileUrl) {
          setFileIndex(index);
        }
      });
    }
    // 单个文件预览 xlsx/xls
    if (is.empty(fileUrls) && visible && is.not.empty(fileUrl) && is.existy(fileType) && is.not.empty(fileType)
    &&
    (fileType === annexEnumerationType.XLSX || fileType === annexEnumerationType.xlsx || fileType === annexEnumerationType.XLS || fileType === annexEnumerationType.xls)) {
      formatXlsxTool(fileUrl, fileType, setExcelData);
    }
  }, [fileUrl, fileType, visible]);

  // 多个文件预览 xlsx/xls
  useEffect(() => {
    /**
     * 只有当是预览多个的时候 执行
     * fileTypeState 文件类型
     * fileUrlState  文件地址
     * 必须是xlsx/xls
     */
    if (!Array.isArray(fileUrls) || fileUrls.length < 1) {
      return;
    }
    if (!fileUrlState) {
      return;
    }
    if (is.existy(fileTypeState) && (fileTypeState === annexEnumerationType.XLSX || fileTypeState === annexEnumerationType.xlsx || fileTypeState === annexEnumerationType.XLS || fileTypeState === annexEnumerationType.xls)) {
      formatXlsxTool(fileUrlState, fileTypeState, setExcelData);
    }
  }, [fileTypeState, fileUrlState]);

  const onError = (e) => {
    console.log(e, 'error in file-viewer');
  };

  // 渲染 除xlsx xls以外的文件
  const renderOtherFile = () => {
    if (fileTypeState && fileTypeState !== annexEnumerationType.xlsx && fileTypeState !== annexEnumerationType.xls && fileTypeState !== annexEnumerationType.XLSX && fileTypeState !== annexEnumerationType.XLS) {
      // 文件地址 [如果是预览 显示fileUrlState 否则 显示 单个预览  fileUrl]
      const newUrl = fileUrlState ? fileUrlState : fileUrl;
      // 文件类型
      const newType = fileTypeState ? fileTypeState : fileType;
      // 文件类型： 大写 转 小写
      const newFileType = newType && newType.toLowerCase();

      return (
        <FileViewer
          key={fileUrlState}
          fileType={newFileType}
          filePath={newUrl}
          onError={onError}
        />
      );
    }

    return <React.Fragment />;
  };

  const onChangeTab = (item) => {
    const dataItem = excelData.filter(i => i.name === item)[0] || {};
    if (is.empty(dataItem.tableHeader)) message.error('预览解析失败，建议直接下载查看');
  };
  // 渲染 xlsx
  const renderXlsxFile = () => {
    if (is.existy(fileTypeState) && is.not.empty(fileTypeState) && (fileTypeState === annexEnumerationType.XLSX || fileTypeState === annexEnumerationType.xlsx || fileTypeState === annexEnumerationType.xls || fileTypeState === annexEnumerationType.XLS) && is.not.empty(excelData) && is.existy(excelData)) {
      const PreviewName = excelData[0].name || '';
      return (
        <Tabs defaultActiveKey={PreviewName} onChange={onChangeTab}>
          {
            excelData.map((item) => {
              return (
                <TabPane tab={item.name} key={item.name} >
                  <Table showHeader={false} bordered pagination={false} scroll={{ x: 1500, y: 350 }} columns={item.tableHeader} dataSource={item.tableData} />
                </TabPane>
              );
            })
          }
        </Tabs>
      );
    }
    // if (is.empty(excelData)) {
    //   return null;
    // }
  };

  // 关闭弹窗
  const onChangeCancel = () => {
    setVisible(false);
    setFileName('');
    setFileUrlState('');
  };

  // 点击预览下一个
  const onClickNext = () => {
    // 索引
    const newIndex = fileIndex + 1;
    // 文件地址
    const newFileUrl = fileUrls[newIndex].asset_url || fileUrls[newIndex].file_url || fileUrls[newIndex].url || '';
    // 文件类型
    let newFileKey = fileUrls[newIndex].asset_key || fileUrls[newIndex].file_name || fileUrls[newIndex].key || '';
    // 设置文件名称
    setFileName(newFileKey);

    const reg = /\.(\w+)$/;
    newFileKey = newFileKey.match(reg)[1];
    // 设置文件地址
    setFileUrlState(newFileUrl);
    // 设置文件类型
    setFileTypeState(newFileKey);
     // 设置文件索引
    setFileIndex(newIndex);
    // 错误文件处理
    if (is.not.empty(newFileKey) && is.existy(newFileKey) && !Unit.uploadFileFormat(newFileKey)) {
      message.error(`您所上传的${newFileKey}格式不支持预览`);
    }
  };

  // 点击预览上一个
  const onClickPrevious = () => {
    const pNewIndex = fileIndex - 1;
    const newFileUrl = fileUrls[pNewIndex].asset_url || fileUrls[pNewIndex].file_url || fileUrls[pNewIndex].url || '';
    let newFileKey = fileUrls[pNewIndex].asset_key || fileUrls[pNewIndex].file_name || fileUrls[pNewIndex].key || '';
    // 设置文件名称
    setFileName(newFileKey);

    const reg = /\.(\w+)$/;
    newFileKey = newFileKey.match(reg)[1];
    // 设置文件地址
    setFileUrlState(newFileUrl);
    // 设置文件类型
    setFileTypeState(newFileKey);
    // 设置文件索引
    setFileIndex(pNewIndex);

    // 错误文件处理
    if (is.not.empty(newFileKey) && is.existy(newFileKey) && !Unit.uploadFileFormat(newFileKey)) {
      message.error(`您所上传的${newFileKey}格式不支持预览`);
    }
  };

  // 渲染header
  const renderModalHeader = (datas, name, defaultName, index, url) => {
    // 如果是多个文件预览 显示 切换
    if (is.existy(datas) && is.not.empty(datas) && is.array(datas)) {
      // 如果传文件名称则显示/否则取默认值
      const newName = name ? name : defaultName;
      return (
        <div className={styles.header}>
          <span className={styles['header-file-name']}>{newName}</span>
          <div>
            <Button disabled={index === 0} icon={<CaretLeftOutlined />} onClick={onClickPrevious} />
            <Button style={{ marginRight: 10 }} disabled={index === (datas.length - 1)} icon={<CaretRightOutlined />} onClick={onClickNext} />
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => downLoadTool(url, name)} />
          </div>
        </div>
      );
    } else {
      // 如果是单个 只显示 文件名称
      return name ? name : defaultName;
    }
  };

  // 强制设置图片样式
  const processPreviewStyle = (type) => {
    // 如果预览的文件类型 是xlsx/xls/pdf/PDF 加类名
    if (type === annexEnumerationType.XLSX || type === annexEnumerationType.xlsx || type === annexEnumerationType.XLS || type === annexEnumerationType.xls || type === annexEnumerationType.pdf || type === annexEnumerationType.PDF) {
      return null;
    }
    return styles['file-box'];
  };

  // 如果不在支持的格式里 不用管 默认false
  const isVisible = is.existy(fileType) && !Unit.uploadFileFormat(fileType) ? false : visible;

  return (
    <Modal
      title={renderModalHeader(fileUrls, fileName, fileKey, fileIndex, fileUrlState)}
      centered
      visible={isVisible}
      onCancel={onChangeCancel}
      width={1000}
      destroyOnClose
      footer={null}
      bodyStyle={{ maxHeight: 650, overflowY: 'auto' }}
    >
      <div className={processPreviewStyle(fileTypeState ? fileTypeState : fileType)}>
        {/* 渲染xlsx/xlx处理函数 */}
        {renderXlsxFile()}
        {/* 渲染除xlsx/xlx文件以外的其他格式 */}
        {renderOtherFile()}
      </div>
    </Modal>

  );
}

ComponentFileView.PropTypes = {
  file: PropTypes.string,       // 后端返回的文件地址
  fileType: PropTypes.string,   // 文件类型
  fileKey: PropTypes.string,    // 文件预览名称
  visible: PropTypes.bool,      // 当前modal是否显示 默认不显示
  setVisible: PropTypes.func,   // 设置当前modal setState
  fileUrls: PropTypes.array,    // 多个：预览文件数组 (只是做预览 不涉及上传)[{key:文件名称,url:文件路径地址}]
  fileUrl: PropTypes.string,    // 单个：预览时 文件预览地址
};

ComponentFileView.defaultProps = {
  file: '',
  fileType: '',
  fileKey: '详情',
  setVisible: () => {},
  visible: false,
  fileUrls: [],
  fileUrl: '',
};

export default ComponentFileView;
