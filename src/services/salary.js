/**
 * 结算相关接口模块
 * @module services/salary
 */
import request from '../application/utils/request';

// NOTE: ------- 结算单，汇总 -----------
/**
 * 获取结算单汇总数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalaryStatement(params) {
  return request('payroll.payroll_statement.find',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 提交审核结算单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function submitSalaryStatement(params) {
  return request('payroll.payroll_statement.submit',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

// NOTE: ------- 结算单，城市 -----------

/**
 * 获取城市结算单列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalaryCityStatement(params) {
  return request('payroll.payroll.find',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 获取城市结算单列表, 汇总信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalaryCityStatementInfo(params) {
  return request('payroll.payroll_statement.get',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 结算缓发状态更新
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateSalaryMarkState(params) {
  return request('payroll.payroll.mark_pay_paused',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

// NOTE: ------- 结算单，骑士 -----------

/**
 * 结算明细
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalaryKnightStatement(params) {
  return request('payroll.payroll.get',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

// NOTE: ------- 下载上传结算单 张亮 -----------

/**
 * 下载结算单
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function downloadSalaryStatement(params) {
  return request('payroll.payroll_statement.download',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 下载结算单模版
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDownLoadSalaryStatementModal(params) {
  return request('payroll.payroll_statement.download',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 下载运营补扣款模版
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDownloadOperatingModal(params) {
  return request('payroll.payroll_statement.download',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

// NOTE: ------- 上传结算表格 张亮 -----------
/**
 * 上传结算表格
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchUploadSalaryExcel(params) {
  return request('payroll.payroll_statement.upload',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}
/**
 * 上传运营补扣款表格
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchUploadOperatingExcel(params) {
  return request('payroll.payroll_statement.upload',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 获取提升信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSalarySubmitAudit(params) {
  return request('oa.application_flow.get_salary_feature_options',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}
