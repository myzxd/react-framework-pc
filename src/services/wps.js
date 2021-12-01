/**
 * WPS相关服务模块
 * @module services/upload
 */
import request from '../application/utils/request';

// 获取wps相关文件预览，附件下载的信息
// 接口地址:boss.asset.asset.get
// 参数: keys 类型:list
// 参数: mode 类型:readonly 只读(默认) rewrite  读写
// 参数: type 类型:list image 图片; doc 文档
// 返回值:[
// {
//     "key": "",
//     "type": "", // 文件类型
//     "url": "",  // 文件下载链接
//     // 文档类字段
//     "doc": {
//         "mode": "", // 文件模式（只读，读写）
//         "url": "",  // 预览地址 || 编辑地址
//     }
// ]
export async function fetchAssets(params = {}) {
  return request('asset.asset.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}
