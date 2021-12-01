/* eslint-disable no-undef */
/* 格式支持：jpg/jpeg/bmp/png/gif/xlsx/docx/pdf/xls/PDF
/**
 * 上传附件处理工具函数
 */
import * as XLSX from 'xlsx';
import is from 'is_js';
import { message } from 'antd';
// 需要处理的文件类型
export const annexEnumerationType = {
  xlsx: 'xlsx',
  xls: 'xls',
  XLSX: 'XLSX',
  XLS: 'XLS',
  pdf: 'pdf',
  PDF: 'PDF',
};


/**
 * readWorkbookFromRemoteFileTool  [读取文件地址数据 转 arraybuffer类型 ]]
 * @param  {[type]}   url          [要预览的文件地址]
 * @param  {Function} callback     [读取成功后的回调函数]
 * @return {[type]}                [function]
 */
export function readWorkbookFromRemoteFileTool(url, setxlDatas, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = new Uint8Array(xhr.response);
      let workbook;
      try {
        workbook = XLSX.read(data, { type: 'array' });
      } catch (e) {
        message.error('预览解析失败，建议直接下载查看');
        setxlDatas([]);
        return;
      }
      if (callback) {
        callback(workbook);
      }
    }
  };
  xhr.send();
}

/**
 * formatXlsxTool              [处理xlsx/xls文件 这里一张表可能有多个sheet,遍历设置]
 * @param  {[type]} fileUrl    [文件预览的地址]
 * @param  {[type]} fileType   [文件预览的类型]
 * @param  {[type]} setxlDatas [把处理后的文件存储到state]
 * @return {[type]}            [function]
 */
export function formatXlsxTool(fileUrl, fileType, setxlDatas) {
  if (is.existy(fileUrl) && (fileType === annexEnumerationType.XLSX || fileType === annexEnumerationType.xlsx || fileType === annexEnumerationType.XLS || fileType === annexEnumerationType.xls)) {
    try {
      readWorkbookFromRemoteFileTool(fileUrl, setxlDatas, (workbook) => {
        const data = {};
        // 遍历每张工做表进行读取
        for (const sheet in workbook.Sheets) {
          if (Object.prototype.hasOwnProperty.call(workbook.Sheets, sheet)) {
            const tempData = [];
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data[sheet] = tempData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1, defval: '' }));
          }
        }

          // 遍历 存储xlsx每一张sheet数据
        const oneData = Object.keys(data).map(key => data[key]);

        const xlsxDatas = [];
        oneData.map((item, index) => {
          const newHeader = [];
          for (const headerAttr in item[index]) {
            if (Object.prototype.hasOwnProperty.call(item[index], headerAttr)) {
              const header = {
                title: headerAttr,
                dataIndex: headerAttr,
                key: headerAttr,
              };
              newHeader.push(header);
            }
          }
          xlsxDatas.push({ name: workbook.SheetNames[index], tableHeader: newHeader, tableData: item });
        });

        setxlDatas(xlsxDatas);
      });
    } catch (e) {
      message.error('文件类型不正确！');
    }
  }
}

/**
 * getBlobsTool               [获取blob流文件]
 * @param  {[type]} fileUrl   [文件的地址]
 * @param  {[type]} cb        [回调函数]
 * @return {[type]}           [function]
 */
export function getBlobsTool(fileUrl, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', fileUrl, true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    if (xhr.status === 200) {
      cb(xhr.response);
    }
  };
  xhr.send();
}
/**
 * saveAsTool                  [通过a标签实现下载]
 * @param  {[type]} blob       [blob流文件]
 * @param  {[type]} fileName   [自定义下载的文件名称]
 * @return {[type]}            [function]
 */
export function saveAsTool(blob, fileName) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, fileName);
  } else {
    const link = window.document.createElement('a');
    const body = window.document.querySelector('body');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.style.display = 'none';
    body.appendChild(link);
    link.click();
    body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
}

/**
 * downLoadTool              [支持所有格式文件下载]
 * @param  {[type]} url      [文件的地址]
 * @param  {[type]} filename [文件的名称]
 * @return {[type]}          [function]
 */
export const downLoadTool = (url, filename) => getBlobsTool(url, blob => saveAsTool(blob, filename));

/**
   * 解决window.open 浏览器阻止弹窗的问题
   *
   */
export const downloadFile = (url) => {
  try {
    const a = window.document.createElement('a');
    a.setAttribute('href', `${url}`);
    a.setAttribute('id', url);
    // 防止反复添加
    if (!window.document.getElementById(url)) window.document.body.appendChild(a);
    a.click();
  } catch (e) {
    console.error(e.message);
  }
};


/**
 * 下载当前文件
 * @param {string} key         传进来的文件key
 * @param {function} dispatch  dispatch
 */
export const onChangeDownPreview = (key, dispatch) => {
  dispatch({
    type: 'applicationFiles/fetchPriview',
    payload: {
      file_key: key,
      onSuccessDownload: (url) => {
        downloadFile(url);
      },
    },
  });
};


/**
 * 判断是否是图片类型
 */
export const isImageTypeTool = (type) => {
  const imageType = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF'];
  return imageType.includes(type);
};
/**
 * 判断是否是doc类型
 */
export const isDocTypeTool = (type) => {
  const imageType = ['doc', 'DOC', 'docx', 'DOCX', 'xls', 'XLS', 'xlsx', 'XLSX', 'pdf', 'PDF', 'ppt', 'PPT', 'PPTX', 'pptx', 'csv', 'CSV'];
  return imageType.includes(type);
};

/**
 * 目前支持的所有类型
 */
export const enclosureSupportTypeTool = (type) => {
  const supportType = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'xls', 'XLS', 'xlsx', 'XLSX', 'pdf', 'PDF', 'doc', 'DOC', 'docx', 'DOCX', 'pptx', 'PPTX', 'ppt', 'PPT'];
  return supportType.includes(type);
};

/**
 * 公共样式
 */

// 公共样式
export const styleCommon = {
  initial: { display: 'initial' },
  none: { display: 'none' },
  modelMaxWidth: '100%',
  modelMinWidth: 1000,
  modelMaxHeight: { height: '100%', overflowY: 'auto' },
  modelMinHeight: { height: 650, overflowY: 'auto' },
};
