/**
 * 物资管理相关接口模块
 * @module services/expense
 */
import request from '../application/utils/request';

/**
 * 物资设置
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSupplySet(params) {
  return request('material.material.find_material_item',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 采购入库明细
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSupplyProcurement(params) {
  return request('material.material.find_material_purchase_order', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 分发明细
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSupplyDistributionList(params) {
  return request('material.material.find_material_distribution_order',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 扣款汇总列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSupplyDeductSummarizeList(params) {
  return request('material.material.find_book_summary_total',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 扣款汇总详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDeductSummarizeDetail(params) {
  return request('material.material.find_book_summary_total_detail',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 扣款明细
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSupplyDeductionsList(params) {
  return request('material.material.find_material_deduction_order',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 物资台账
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSupplyDetailsList(params) {
  return request('material.material.find_biz_material_detail',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 模板下载
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function materialDownloadTemplate(params) {
  return request('material.material.download_template',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 物资文件上传
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function materialUploadFile(params) {
  return request('material.material.upload',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 模板更新的时间
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function materialTemplateUpdatedDate(params) {
  return request('material.material.material_template_updated_at',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 扣款汇总导出
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDeductSummarizeExport(params) {
  return request('material.material.export_book_summary_total',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 物资台账导出
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchStandingBookExport(params) {
  return request('material.material.export_biz_material_detail',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
