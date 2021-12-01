/**
 * 人员管理相关接口模块
 * @module services/employee
 */
import request from '../application/utils/request';
import {
  list as contractList,
  detail as contractDetail,
} from './mock/employee/contract';

/**
 * 人员列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function getEmployeeListS(params) {
  return request('staff.staff.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

// NOTE: 重新封装
/**
 * 人员管理，获取用户列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployees(params) {
  return request('staff.staff_profile.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员管理，获取人员详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeDetail(params) {
  return request('staff.staff_profile.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员管理，添加人员
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createEmployee(params) {
  return request('staff.staff_profile.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员管理，更新人员
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateEmployee(params) {
  return request('staff.staff_profile.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员管理，添加人员（员工档案）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createEmployeeStaff(params) {
  return request('staff.employee.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员管理，更新人员（员工档案）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateEmployeeStaff(params) {
  return request('staff.employee.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员管理，获取用户列表（员工档案）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeesStaff(params) {
  return request('staff.employee.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员管理，获取人员详情（员工档案）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeDetailStaff(params) {
  return request('staff.employee.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员管理，导出人员（员工档案）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportEmployeesStaff(params) {
  return request('staff.employee.download_staff_list',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 办理离职
 */
export async function employeeOperateDeparture(params) {
  return request('staff.employee.operate_departure',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员解约
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function employeeRelease(params) {
  return request('staff.employee.staff_departure',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员管理，导出人员
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportEmployees(params) {
  return request('staff.staff_profile.download_staff_list',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 工号管理，获取运力工号骑士 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTransportData(params) {
  return request('/staff/gain_transport_knight',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 工号管理，更新运力工号骑士 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateTransportKnight(params) {
  return request('/staff/transport_knight',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 工号管理，替跑记录数据 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTransportRecords(params) {
  return request('/staff/gain_transport_record',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 工号管理，新建替跑记录 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createTransportRecord(params) {
  return request('/staff/transport_record',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 工号管理，更新替跑记录 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateTransportRecord(params) {
  return request('/staff/update_transport_record',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 工号管理，骑士数据 接口废弃了 @后端王悦
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTransportKnights(params) {
  return request('/staff/gain_actual_transport_knight',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员合同列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeContractData(params) {
  // TODO: 替换真实接口
  const {
    _meta: {
      page,
      limit,
    },
  } = params;
  return {
    meta: {
      ...contractList.meta,
      page,
      limit,
      hasMore: page * limit < contractList.meta.resultCount,
    },
    data: contractList.data.slice((page - 1) * limit, page * limit),
  };
}

/**
 * 人员合同列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeContractDetail(params) {
  // TODO: 替换真实接口
  return {
    ...contractDetail,
    employeeId: params.id,
  };
}

/**
 * 新增第三方id
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createEmployeeId(params) {
  return request('staff.staff_custom_id.add',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 编辑第三方id
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function editEmployeeId(params) {
  return request('staff.staff_custom_id.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 终止第三方id
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function stopEmployeeId(params) {
  return request('staff.staff_custom_id.stop',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 删除第三方id
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function removeEmployeeId(params) {
  return request('staff.staff_custom_id.delete',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 历史记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeHistoricalRecord(params) {
  return request('staff.staff_bank_card.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 获取劳动者个户记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeIndividualRegistration(params) {
  return request('staff.staff_profile.find_individual_change_log',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 获取劳动者历史三方id
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeHistoryTripartiteId(params) {
  return request('staff.staff_profile.find_custom_map_change_log',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}


/**
 * 银行卡识别信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchBankCardIdentification(params) {
  return request('staff.staff_profile.identify_bank_card_info',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 工作信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeWorkInfo(params) {
  return request('staff.staff_profile.find_work_info',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 合同信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeContractInfo(params) {
  return request('staff.staff_profile.get_contract_info',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 劳动者团队导出
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function downloadStaffContractTeam(params) {
  return request('staff.staff_profile.download_staff_contract_team',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员异动列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeTurnoverData(params) {
  return request('staff.staff_change_order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 团队
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeam(params) {
  return request('oa.oa_cost_center.find_owner_team',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员异动详情
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeTurnoverDetail(params) {
  return request('staff.staff_change_order.get',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员异动创建
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createEmployeeTurnover(params) {
  return request('staff.staff_change_order.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员异动编辑
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateEmployeeTurnover(params) {
  return request('staff.staff_change_order.update',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员异动删除
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function EmployeeTurnoverDelete(params) {
  return request('staff.staff_change_order.delete',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 人员异动审批
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function EmployeeTurnoverApproval(params) {
  return request('oa.staff_change_order.submit',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 档案类型变更
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function UpdateFileType(params) {
  return request('staff.staff_profile.change_profile',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 新增合同
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createContract(params) {
  return request('staff.staff_profile.create_work_contract',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 员工提交合同信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateStaffContract(params) {
  return request('staff.staff_profile.update_work_contract',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/**
 * 审批单（调岗单）
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchApprovalList(params) {
  return request('oa.staff_change_order.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 人员档案变更记录
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeChangeRecord(params) {
  return request('staff.staff_profile.find_change_logs',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
/**
 * 员工档案 -员工合同信息
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchNewContractInfo(params) {
  return request('staff.staff_profile.get_work_contract',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

 /* 团队
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchTeamMembers(params) {
  return request('oa.oa_cost_center.find_team_member',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

 /* 获取个户注册数据列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchEmployeeStatisticsData(params) {
  return request('individual.statistics.find',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

 /* 导出个户注册数据列表
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function exportEmployeeStatisticsData(params) {
  return request('individual.statistics.download',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}


 /* 归属team类型
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchGetTeamTypes(params) {
  return request('qcode.team.find_biz_team_type_list',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}
 /* 归属team
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function fetchGetTeams(params) {
  return request('qcode.team.find_biz_teams',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    }).then(data => data);
}

/* 创建员工档案
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function createEmployeeFile(params) {
  return request('staff.employee.create',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}
/* 变更员工team
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function changeStaffTeam(params) {
  return request('staff.employee.batch_update_cost',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}

/* 编辑员工档案
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateEmployeeFile(params) {
  return request('staff.employee.update_for_tab',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}

/* 变更劳动者team
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function changeProfileTeam(params) {
  return request('staff.staff_profile.batch_update_cost',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}

/* 编辑劳动者档案
 * @see {@link http://api.document/xxx 接口文档}
 */
export async function updateLaborerFile(params) {
  return request('staff.staff_profile.update_for_tab',
    {
      method: 'POST',
      apiVersion: 'v2',
      body: JSON.stringify(params),
    },
    undefined,
    true,
  ).then(data => data);
}
