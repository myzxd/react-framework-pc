/**
 * 文件公共定义
 */
/**
 * 文件mime类型 所有文件类型对照表
 * https://www.iana.org/assignments/media-types/media-types.xhtml
 */

/**
 * 文件MIME信息
 */
const FileMIME = {
  // 图片类型
  png: 'image/png',
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',

  // wps文档
  xls: 'application/vnd.ms-excel',
  doc: 'application/msword',
  ppt: 'application/vnd.ms-powerpoint',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // 只读文档
  txt: 'text/plain',
  rtf: 'text/rtf',
  pdf: 'application/pdf',
  csv: 'text/csv',

  // 压缩类型
  zip: 'application/zip',
  rar: 'application/vnd.rar',

  // 不合法的文件类型
  illegal: undefined,
};

/**
 * 文件类型
 */
const FileType = {
  // 图片类型
  png: 'png',
  jpg: 'jpg',
  jpeg: 'jpeg',
  gif: 'gif',

  // wps文档
  xls: 'xls',
  doc: 'doc',
  ppt: 'ppt',
  xlsx: 'xlsx',
  docx: 'docx',
  pptx: 'pptx',

  // 只读文档
  txt: 'txt',
  rtf: 'rtf',
  pdf: 'pdf',
  csv: 'csv',

  // 压缩类型
  zip: 'zip',
  rar: 'rar',

  // 不合法的文件类型
  illegal: 'illegal',

  // 判断是否是图片
  isImage: (type) => {
    return [
      FileType.png,
      FileType.jpg,
      FileType.jpeg,
      FileType.gif,
    ].includes(type.toLowerCase());
  },

  // 判断是否是wps文档
  isWPS: (type) => {
    return [
      FileType.xls,
      FileType.doc,
      FileType.ppt,
      FileType.xlsx,
      FileType.docx,
      FileType.pptx,
    ].includes(type.toLowerCase());
  },

  // 判断是否是常规文档
  isDoc: (type) => {
    return [
      FileType.txt,
      FileType.rtf,
      FileType.pdf,
      FileType.csv,
    ].includes(type.toLowerCase());
  },

  // 判断是否是压缩文件
  isCompress: (type) => {
    return [
      FileType.zip,
      FileType.rar,
    ].includes(type.toLowerCase());
  },

  // 判断是否是非法文件 (非法true，不非法false)
  isIllegal: (type) => {
    // 校验文件格式
    if (!type || typeof (type) !== 'string') {
      return true;
    }
    // 判断是否是非法的文件类型
    if (type === FileType.illegal) {
      return true;
    }
    // 文件类型换小写
    const lowerCase = type.toLowerCase();
    // 遍历对象中的所有属性值，判断是否存在文件类型
    return Object.values(FileType).includes(lowerCase) ? false : true;
  },

  // 根据文件类型获取mime
  mimeByType: (type) => {
    const lowerCase = type.toLowerCase();
    return FileMIME[lowerCase] || undefined;
  },

  // 根据文件名后缀，获取文件类型
  typeByName: (filename) => {
    // 校验文件名称
    if (filename === undefined || typeof (filename) !== 'string') {
      return FileType.illegal;
    }
    try {
      // 获取文件后缀名字，转小写后截取后缀名
      const suffix = filename.toLowerCase().split('.').pop();
      // 判断是否存在文件类型
      if (Object.prototype.hasOwnProperty.call(FileType, suffix) === false) {
        // 不存在的类型，默认直接返回原始后缀
        return suffix;
      }

      // 判断获取到的文件类型是否是字符串格式
      if (typeof (FileType[suffix]) !== 'string') {
        // 不存在的类型，默认直接返回原始后缀
        return suffix;
      }
      // 返回文件类型
      return FileType[suffix];
    } catch (e) {
      console.error('文件类型获取错误', filename, e);
      return FileType.illegal;
    }
  },

  // 根据文件名，获取文件名后缀
  suffixByName: (filename = '') => {
    return filename.toLowerCase().split('.').pop();
  },
};

/**
 * 文件模式
 */
const FileMode = {
  readonly: 'readonly', // 只读
  rewrite: 'rewrite',   // 读写
};

/**
 * 基础文件类型
 */
class FileObject {
  /**
   *
   * @param {string} key  文件唯一标识 (后端的组合数据)
   * @param {string} type 文件类型
   * @param {string} url  文件储存地址
   * @param {object} data 原始信息（包含所有参数等）
   * @param {string} mode 文件模式（只读，读写）
   * @param {string} wps  wps在线地址
   */
  constructor(args) {
    this.init(args);
    // 初始化WPS属性信息
    this.initWPSProps(args);
  }

  init = (args) => {
    // 默认参数
    const { key, type, url, data } = args;

    // 文件唯一标识
    this.key = key;
    // 文件名称
    this.name = key.split('/').pop();

    // 文件储存地址
    this.url = url || '';
    // 原始信息
    this.data = data || {};

    // 默认文件类型，文件类型不合规
    this.type = FileType.illegal;
    // 文件的mime定义
    this.mime = undefined;

    // 判断，如果文件类型不存在，则根据文件名后缀获取
    if (type === undefined) {
      this.type = FileType.typeByName(this.name);
      this.mime = FileType.mimeByType(this.type);
    }

    // 判断文件类型是否非法，否则根据文件名后缀获取
    if (type !== undefined) {
      this.type = type.toLowerCase();
      this.mime = FileType.mimeByType(type);
    }
  }

  // 初始化WPS属性信息
  initWPSProps = (args) => {
    const { mode, wps, state, msg } = args;
    // 文件模式（只读，读写）
    this.mode = mode || FileMode.readonly;
    // wps在线地址
    this.wps = wps || '';
    // 文件状态
    this.state = state;
    // 文件错误信息
    this.msg = msg;
  }

  // 文件下载
  download = () => {
    if (!this.url) {
      console.error('下载文件的文件地址不存在');
      return false;
    }
    try {
      const a = window.document.createElement('a');
      a.setAttribute('href', `${this.url}`);
      a.setAttribute('id', this.url);
      // 防止反复添加
      if (!window.document.getElementById(this.url)) {
        window.document.body.appendChild(a);
      }
      a.click();
    } catch (e) {
      console.error(e.message);
    }
  }
}

export {
  FileType,
  FileMode,
  FileObject,
};
