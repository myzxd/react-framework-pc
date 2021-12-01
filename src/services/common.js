/**
 * 公共数据服务接口模块
 * @module services/expense/costOrder
 */
import request from '../application/utils/request';

/**
 * 审批流列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExamineFlows(params) {
  return request('oa.application_flow.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批流查询数据
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSearchExamineFlows(params) {
  return request('oa.application_order.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取所有的账号
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAllAccountName(params) {
  return request('account.account.get_all_account',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 费用类型
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchExpenseTypes(params) {
  return request('oa.cost_group.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取职位信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPositions(params) {
  return request('permission.permission.current_position',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取供应商信息（公用的下拉选择的查询接口）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchSuppliers(params) {
  return request('platform.platform.get_supplier_list',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取平台信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPlatforms(params) {
  return request('platform.platform.get_platform_list',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取城市信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCities(params) {
  return request('platform.platform.get_city_list',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取区域信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDistricts(params) {
  return request('platform.platform.get_biz_district',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取三方公司信息(合同归属)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCompanies(params) {
  return request('third_part.third_part.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建三方公司(合同归属)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createCompany(params) {
  return request('third_part.third_part.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}

/**
 * 更新三方公司(合同归属)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateCompany(params) {
  return request('third_part.third_part_map.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取商圈列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDistrictList(params) {
  return request('biz_district.biz_district.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取商圈详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDistrictDetail(params) {
  return request('biz_district.biz_district.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 创建商圈
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createDistrict(params) {
  return request('biz_district.biz_district.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 编辑商圈
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateDistrict(params) {
  return request('biz_district.biz_district.update_record',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }, undefined, true).then(data => data);
}

/**
 * 获取推荐公司
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchRecommendCompany(params) {
  return request('recommend_company.recommend_company.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取审批岗位
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchRecommendApprovalJobs(params) {
  return request('post.post.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取成员信息 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchMembersInfo(params) {
  return request('/account/new_gain_account_list',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取平台列表(根据所属场景级联)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPlatformList(params) {
  return request('platform.platform.find',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 获取平台列表(根据所属场景级联)
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchContractBelong(params) {
  return request('third_part.third_part_map.get',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 开户行信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchBankName(params) {
  return request('staff.staff_bank_card.find_bank_branch',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 合同归属详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchContractDetail(params) {
  return request('third_part.third_part.get',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 合同归属配置列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchContractConfigurationList(params) {
  return request('third_part.third_part_map.find',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 合同归属编辑新增
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function contractUpdateCreate(params) {
  return request('third_part.third_part_map.create',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 合同归属启用禁用
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function disableCompany(params) {
  return request('third_part.third_part.update',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 合同归属启用禁用
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function deleteContractConfiguration(params) {
  return request('third_part.third_part_map.delete',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 获取部门树结构
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDepartments(params) {
  return request('organization.department.tree',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}

/**
 * 获取岗位结构
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchStaffs(params) {
  return request('organization.department_job.find',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }).then(data => data);
}
/**
 * 获取部门下职员列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchDepartmentEmployees(params) {
  return request('organization.department.subordinate',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    });
}

/**
 * 工作交接单下拉
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchJobHandovers(params) {
  return request('human_resource.handover_order.select',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    });
}

/**
 * 枚举值
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getEnumeratedValue(params) {
  return request('utils.utils.gain_all_enumeration', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}

/**
 * 商圈变更记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchAssetsChangLog(params) {
  return request('biz_district.biz_district.change_log_find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }).then(data => data);
}


/**
 * 抄送信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchCopyGiveInfo(params) {
  return request('oa.application_order_flow_record.get_current_node_cc_info', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  });
}

/**
 * 人员详情（获取人员所属所有部门及岗位）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getEmployeeDepAndPostInfo(params) {
  return request('staff.employee.get', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  });
}

/**
 * 部门及岗位树
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getDepAndPost(params) {
  return request('organization.department.department_job_tree', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  });
}

/**
 * 请求配置审批接口
 */
export async function fetchApproal(params) {
  return request('common_config.common_config.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  });
}

/**
 * 请求配置审批接口
 */
export async function updateApproal(params) {
  return request('common_config.common_config.oa_organization_order', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  });
}
/**
 * 意见反馈列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getFeedBackList(params) {
  return request('team.opinion_feedback.find', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }, undefined, true);
}

/**
 * 处理意见
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function setDealFeedBack(params) {
  return request('team.opinion_feedback.update', {
    method: 'POST',
    apiVersion: 'v2',
    body: JSON.stringify(params),
  }, undefined, true);
}

/**
 * 劳动者甲方- 预览合同
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchPreviewContract(params) {
  return request('third_part.third_part_map.preview_thirt_part_contract_images',
    {
      method: 'POST',
      body: JSON.stringify(params),
      apiVersion: 'v2',
    }, undefined, true).then(data => data);
}
