/**
 * 人员管理相关model
 * @module model/employee/manage
 */
import is from 'is_js';
import moment from 'moment';
import { message } from 'antd';

import {
  fetchEmployees, // 获取员工列表
  exportEmployees, // 导出
  fetchEmployeeDetail, // 获取员工详情
  createEmployee, // 创建员工
  updateEmployee, // 编辑员工
  employeeRelease,
  employeeOperateDeparture,
  createEmployeeId,
  editEmployeeId,
  stopEmployeeId,
  removeEmployeeId,
  fetchEmployeeHistoricalRecord,
  fetchEmployeeIndividualRegistration,
  fetchEmployeeHistoryTripartiteId,
  fetchBankCardIdentification,
  fetchEmployeeWorkInfo,
  fetchEmployeeContractInfo,
  downloadStaffContractTeam,
  updateStaffContract,            // 员工档案编辑-合同信息更改
  createContract,                 // 员工档案新增 -  合同信息新增
  fetchEmployeesStaff,
  createEmployeeStaff,
  updateEmployeeStaff,
  fetchEmployeeDetailStaff,
  exportEmployeesStaff,
  fetchGetTeamTypes,
  fetchGetTeams,
  createEmployeeFile,
  updateEmployeeFile,
  updateLaborerFile,
  changeStaffTeam,
  changeProfileTeam,
} from '../../services/employee';
import {
  uploadFileToQiNiu,
  getUploadToken,
  fetchFileURL,
} from '../../services/upload';

import { authorize, utils } from '../../application';
import Operate from '../../application/define/operate';
import {
  DutyState,
  AccountRecruitmentChannel,
  FileType,
  PaperworkType,
  SignContractType,
  Unit,
  StaffSate,
  PendingDepartureState,
  EmployeeUpdatePageSetp,
  StaffTabKey,
} from '../../application/define';
import { RequestMeta, ResponseMeta } from '../../application/object';
import Modules from '../../application/define/modules';

const strType = '[object String]';
const numType = '[object Number]';
const objType = '[object Object]';
const arrType = '[object Array]';
const boolType = '[object Boolean]';
const getObjType = obj => Object.prototype.toString.call(obj);

// 金额字段
const moneyField = [
  'big_medical_insurance_enterprise',
  'big_medical_insurance_person',
  'other_enterprise_fee',
  'other_person_fee',
  'old_age_insurance',
  'medical_insurance',
  'unemployment_insurance',
  'occupational_insurance',
  'birth_insurance',
  'provident_fund',
  'split_base',
];

// 时间，到月，number
const monthNumberField = [
  'provident_fund_began_month', // 公积金开始月份
  'insurance_began_month', // 社保缴费开始月份
];

// 时间：到日，numner
const dateNumberField = [
  'signed_date', // 首合同生效日期
  'current_start_at', // 当前合同生效日期
  'current_end_at', // 当前合同结束日期
  'entry_date', // 入职日期
  'regular_date', // 预计转正日期
  'born_in', // 出生日期
];

// 单图片
const singlePhotoField = [
  'bank_card_front', // 银行卡正面照
  'identity_card_front', // 身份证正面照
  'identity_card_back', // 身份证反面照
  'identity_card_in_hand', // 身份证半身照
  'health_certificate_type', // 健康证真面照
  'health_certificate', // 健康证证件正面照
  'health_certificate_back', // 健康证证件反面照
  'health_certificate_no', // 健康证反面照
  'health_certificate_in_hand', // 健康证半身照
  'drive_certificate_front', // 驾驶证正面照
  'drive_certificate_back', // 驾驶证反面照
  'drive_certificate_in_hand', // 驾驶证半身照
];

// 多照片
const manyPhotoField = [
  'collect_protocol', // 代收协议照片
  'contract_photo_list', // 合同照片
  'degree', // 毕业证
  'certificate_photo_list', // 从业资格证
  'other_certificate_photo_list', // 其他证件
  'candidates_photo_list', // 应聘人员登记表
];

// 数组（无需处理的引用类型）
const quoteField = [
  'department_job_relation_list',
];

// 数字转数组
const numberToArrayField = [
  'work_label',
];

// 省市
const proviceField = [
  'social_security_payment_plac',
  'provident_fund_payment_plac',
];

// 处理字段
const dealData = (data) => {
  const val = {};
  const objKeys = Object.keys(data);
  Object.values(data).map((i, index) => {
    // value值为字符串或数字，则直接赋值
    if (getObjType(i) === strType || getObjType(i) === numType || getObjType(i) === boolType) {
      val[objKeys[index]] = i;
    }

    // 金额字段处理
    moneyField.includes(objKeys[index]) && (i || i === 0) && (
      val[objKeys[index]] = Unit.exchangePriceToCent(i)
    );

    // 特殊处理字段 - 工作地
    if (getObjType(i) === objType && objKeys[index] === 'work_address') {
      // 省
      val.work_province_code = i.province;
      // 市
      val.work_city_code = i.city;
    }
    // 特殊处理字段 - 附件(数组)有数据的情况
    if (getObjType(i) === arrType && is.existy(i) && is.not.empty(i) && objKeys[index] === 'fileList') {
      val.enclosures = i.map(v => Object.values(v)[0]);
    }
    // 特殊处理字段 - 附件(数组)没数据的情况
    if ((is.not.existy(i) || is.empty(i)) && objKeys[index] === 'fileList') {
      val.enclosures = [];
    }

     // 政治面貌
    if (objKeys[index] === 'politics_status' && !i) {
      val[objKeys[index]] = '';
    }
    // 学历
    if (objKeys[index] === 'education' && !i) {
      val[objKeys[index]] = '';
    }

    // 星座
    if (objKeys[index] === 'constellation' && !i) {
      val[objKeys[index]] = '';
    }

    // 单张图片
    if (getObjType(i) === objType
      && singlePhotoField.includes(objKeys[index])) {
      val[objKeys[index]] = i.keys[0];
    }

    // 多张图片
    if (getObjType(i) === objType
      && manyPhotoField.includes(objKeys[index])) {
      val[objKeys[index]] = i.keys;
    }

    // 数组
    if (getObjType(i) === arrType
      && quoteField.includes(objKeys[index])) {
      val[objKeys[index]] = i;
    }

    // 数字转数组
    if (getObjType(i) === numType
      && numberToArrayField.includes(objKeys[index])) {
      val[objKeys[index]] = [i];
    }

    // 特殊处理字段 - 学习经历（数组）
    if (getObjType(i) === arrType && objKeys[index] === 'academy_list') {
      const academyList = i.map(a => ({
        institution_name: a.institution_name || '',
        education: a.education || '',
        profession: a.profession || '',
        start_time: Array.isArray(a.time) && a.time[0] ? a.time[0].format('YYYYMMDD') : '',
        end_time: Array.isArray(a.time) && a.time[1] ? a.time[1].format('YYYYMMDD') : '',
      }));
      val.academy_list = academyList.filter(a => (
        a.institution_name || a.education || a.profession || a.start_time || a.end_time
      ));
    }

    // 特殊处理字段 - 工作经历（数组）
    if (getObjType(i) === arrType && objKeys[index] === 'work_experience') {
      const workExperience = i.map(a => ({
        employer: a.employer || '',          // 工作单位
        position: a.position || '',      // 职位
        certifier_name: a.certifier_name || '',     // 证明人姓名
        proof_phone: a.proof_phone || '',   // 证明人电话
        work_start_time: Array.isArray(a.work_time) && a.work_time[0] ? a.work_time[0].format('YYYYMMDD') : '', // 工作开始时间
        work_end_time: Array.isArray(a.work_time) && a.work_time[1] ? a.work_time[1].format('YYYYMMDD') : '',   // 工作结束时间
      }));

      val.work_experience = workExperience.filter(w => (
        w.employer || w.position || w.certifier_name || w.proof_phone || w.work_time
      ));
    }

    // 处理时间
    if (getObjType(i) === objType
      && i._isAMomentObject
      && monthNumberField.includes(objKeys[index])
    ) {
      val[objKeys[index]] = Number(moment(i).format('YYYYMM'));
    }

    // 处理时间
    if (getObjType(i) === objType
      && i._isAMomentObject
      && dateNumberField.includes(objKeys[index])
    ) {
      val[objKeys[index]] = Number(moment(i).format('YYYYMMDD'));
    }

    // 特殊字段 - 银行开户行所在地
    if (getObjType(i) === objType && objKeys[index] === 'bank_location') {
      val.bank_location = [i.province, i.city];
    }

    // 省市
    if (getObjType(i) === objType && proviceField.includes(objKeys[index])) {
      val[objKeys[index]] = i.province && i.city ? {
        province: i.province ? String(i.province) : '',
        city: i.city ? String(i.city) : '',
      } : {};
    }
  });
  return val;
};

// 人员公用的请求参数
const commentPersonnelparams = (payload, type) => {
  // 公共文本参数
  const {
    page,
    limit,
    name,                        // 姓名
    phone,                       // 手机号
    identityCardId,              // 身份证号
    state,                       // 人员状态
    signType,                    // 签约类型
    referrerCompanyId,           // 推荐公司
    contractFirstPartyInfo,      // 合同甲方
    fileType,                    // 人员页面类型
    applicationCompanyName,       // 公司名称
    applicationChannelId,         // 应聘途径
    contractState,              //  合同状态
    bossMemberId,               // boss人员id
    isAll,                       // 是否是全部人员信息
    windControl, // 风控检测状态
    regularDate, // 预计转正日期
    currentEndAtDate, // 合同到期日期
    departureDate, // 离职日期
    tabKey, // 员工tabKey
    searchState, // 员工状态（新）
  } = payload;
  // 劳动者公共文本参数
  const {
    platforms,                   // 平台
    suppliers,                   // 供应商
    cities,                      // 城市
    districts,                   // 商圈
  } = payload;
  const {
    personalCompanyType,         // 个户类型
    customId,                    // 第三方平台账户ID
    healthCertificateDay,        // 健康证到期天数
  } = payload;
  // 人员
  const {
    // currentUnit,                 // 所在单位
    department,                  // 部门
    post,                        // 岗位
    boardDate,                   // 入职日期
  } = payload;

  // 默认参数
  const params = {};
  // 列表 默认参数
  if (type === 'find') {
    params._meta = RequestMeta.mapper({ page: page || 1, limit: limit || 30 });
  }
  // 下载 默认参数
  if (type === 'download') {
    params.profile_type = FileType[fileType];
    params.permission_id = Modules.OperateSystemAccountManageVerifyEmployee.id;
    params.account_id = authorize.account.id;
  }
  // 姓名
  if (is.existy(name) && is.not.empty(name)) {
    params.name = name;
  }
  // 手机号
  if (is.existy(phone) && is.not.empty(phone)) {
    params.phone = phone;
  }

  // boss人员id
  if (is.existy(bossMemberId) && is.not.empty(bossMemberId)) {
    // staff
    if (fileType === 'staff') {
      params._id = bossMemberId;
    } else {
      params.staff_id = bossMemberId;
    }
  }
  // 全部人员信息
  if (is.existy(isAll) && is.not.empty(isAll)) {
    params.is_all = isAll;
  }
  // 身份证号
  if (is.existy(identityCardId) && is.not.empty(identityCardId)) {
    params.identity_card_id = identityCardId;
  }
  // 签约状态
  if (is.existy(state) && is.not.empty(state) && is.array(state)) {
    // 档案类型为员工时，搜索条件为员工状态，此版本新增待离职状态，应后端要求需要增加pending_departure_state字段配合state字段传值
    if (fileType === 'staff' && state.some(item => Number(item) === StaffSate.willResign)) {
      if (state.length === 1) {
        params.state = [StaffSate.inService];
      } else {
        params.state = state.filter(item => Number(item) !== StaffSate.willResign).map(item => Number(item));
      }
    } else {
      params.state = state.map(item => Number(item));
    }
  }
  // 待离职员工状态
  if (fileType === 'staff' && is.existy(state) && is.not.empty(state) && is.array(state)) {
    params.pending_departure_state = state.map((item) => {
      if (Number(item) === StaffSate.inService) {
        return PendingDepartureState.inService;
      }
      if (Number(item) === StaffSate.departure) {
        return PendingDepartureState.departure;
      }
      return PendingDepartureState.willResign;
    });
  }

  // 员工状态
  if (!state || (Array.isArray(state) && state.length < 1)) params.state = [StaffSate.inService, StaffSate.departure, StaffSate.willResign];

  // 员工状态（新）（默认值）
  if (fileType === 'staff' && (!searchState || (Array.isArray(searchState) && searchState.length < 1))) {
    params.state = [
      StaffSate.inService,
      StaffSate.departure,
      StaffSate.willResign,
    ];
  }

  // 员工状态（新）（默认值）
  if (searchState && Array.isArray(searchState) && searchState.length > 0) {
    params.state = searchState;
  }
  // 员工状态（新）（选择参数）
  if (searchState && !Array.isArray(searchState)) {
    params.state = [searchState];
  }

  // 签约类型
  if (is.existy(signType) && is.not.empty(signType)) {
    params.sign_type = signType;
  }

  // 推荐公司
  if (is.existy(referrerCompanyId) && is.not.empty(referrerCompanyId)) {
    params.referrer_company_id = referrerCompanyId;
  }
  // 合同甲方
  if (is.existy(contractFirstPartyInfo) && is.not.empty(contractFirstPartyInfo)) {
    params.contract_belong_id = contractFirstPartyInfo;
  }
  // 平台
  if (is.existy(platforms) && is.not.empty(platforms) && is.array(platforms)) {
    params.work_platform_list = platforms;
  }
  // 供应商
  if (is.existy(suppliers) && is.not.empty(suppliers) && is.array(suppliers)) {
    params.work_supplier_list = suppliers;
  }
  // 城市
  if (is.existy(cities) && is.not.empty(cities)) {
    if (is.array(cities)) {
      params.work_city_codes = cities;
    }
    if (is.string(cities)) {
      params.work_city_codes = [cities];
    }
  }

  // 商圈
  if (is.existy(districts) && is.not.empty(districts)) {
    if (is.array(districts)) {
      params.work_biz_district_list = districts;
    }
    if (is.string(districts)) {
      params.work_biz_district_list = [districts];
    }
  }
  // 个户类型
  if (is.existy(personalCompanyType) && is.not.empty(personalCompanyType)) {
    params.individual_type = personalCompanyType;
  }
  // 第三方平台账户id
  if (is.existy(customId) && is.not.empty(customId)) {
    params.custom_id = customId;
  }
  // 健康证到期天数
  if (is.existy(healthCertificateDay) && is.not.empty(healthCertificateDay)) {
    params.health_certificate_days = Number(healthCertificateDay);
  }

  // 公司名称
  if (is.existy(applicationCompanyName) && is.not.empty(applicationCompanyName)) {
    params.application_company_name = applicationCompanyName;
  }

  // 应聘途径
  if (is.existy(applicationChannelId) && is.not.empty(applicationChannelId)) {
    params.application_channel_id = Number(applicationChannelId);
  }
  // 应聘途径
  if (is.existy(contractState) && is.not.empty(contractState)) {
    params.contract_state = contractState;
  }
  // 所在单位
  // if (is.existy(currentUnit) && is.not.empty(currentUnit)) {
  //   params.current_unit = currentUnit;
  // }
  // 部门
  if (is.existy(department) && is.not.empty(department)) {
    params.department_ids = Array.isArray(department) ? department : [department];
  }
  // 岗位
  if (is.existy(post) && is.not.empty(post)) {
    params.department_job_relation_id = post;
  }
  // 入职日期
  if (is.existy(boardDate) && is.not.empty(boardDate)) {
    params.entry_start_date = Number(moment(boardDate[0]).format('YYYYMMDD'));
    params.entry_end_date = Number(moment(boardDate[1]).format('YYYYMMDD'));
  }

  // 归属team类型
  if (is.existy(payload.codeTeamType) && is.not.empty(payload.codeTeamType)) {
    params.cost_team_type = payload.codeTeamType;
  }
  // 归属team
  if (is.existy(payload.codeTeam) && is.not.empty(payload.codeTeam)) {
    params.cost_team_id = payload.codeTeam;
  }

  // 风控检测状态
  windControl !== undefined && (params.within_blacklist = windControl);

  // 预计转正日期（员工 && 试用期）
  if (fileType === 'staff' && tabKey === StaffTabKey.probation) {
    params.regular_start_date = Number(moment().format('YYYYMMDD'));
    params.regular_end_date = Number(moment().add(91, 'days').format('YYYYMMDD'));
    // state
    params.state = [StaffSate.inService];
    // pending_departure_state
    params.pending_departure_state = [PendingDepartureState.inService];

    if (regularDate && Array.isArray(regularDate) && regularDate.length > 0) {
      // 预计转正开始日期
      params.regular_start_date = Number(moment(regularDate[0]).format('YYYYMMDD'));
      // 预计转正结束日期
      params.regular_end_date = Number(moment(regularDate[1]).format('YYYYMMDD'));
    }
  }

  // 全部（员工 && 全部）设置peding_departure_state
  if (fileType === 'staff' && tabKey === StaffTabKey.all) {
    let pendingDepartureState = [];

    // 员工状态不存在
    if (!searchState || (Array.isArray(searchState) && searchState.length < 1)) {
      pendingDepartureState = [
        PendingDepartureState.inService,
        PendingDepartureState.departure,
        PendingDepartureState.willResign,
      ];
    }

    // 员工状态存在
    if (searchState && Array.isArray(searchState)) {
      searchState.includes(StaffSate.inService) && (
        pendingDepartureState[pendingDepartureState.length] = PendingDepartureState.inService
      );
      searchState.includes(StaffSate.departure) && (
        pendingDepartureState[pendingDepartureState.length] = PendingDepartureState.departure
      );
      searchState.includes(StaffSate.willResign) && (
        pendingDepartureState[pendingDepartureState.length] = PendingDepartureState.willResign
      );
    }

    // 选择的状态有「待离职」时，接口参数需要为「待离职」「在职」
    Array.isArray(searchState) && searchState.includes(StaffSate.willResign) && (
      params.state = [
        ...new Set([
          ...searchState,
          StaffSate.willResign,
          StaffSate.inService,
        ]),
      ]
    );

    params.pending_departure_state = pendingDepartureState;
  }

  // 合同到期日期（员工 && 续签）
  if (fileType === 'staff' && tabKey === StaffTabKey.renew) {
    params.current_end_at_start_date = 19700101;
    params.current_end_at_end_date = Number(moment().add(60, 'days').format('YYYYMMDD'));
    // state
    params.state = [StaffSate.inService, StaffSate.willResign];

    // pending_departure_state
    params.pending_departure_state = [PendingDepartureState.inService, PendingDepartureState.willResign];

    if (currentEndAtDate && Array.isArray(currentEndAtDate) && currentEndAtDate.length > 0) {
      // 合同到期日期开始时间
      params.current_end_at_start_date = Number(moment(currentEndAtDate[0]).format('YYYYMMDD'));

      // 合同到期日期结束时间
      params.current_end_at_end_date = Number(moment(currentEndAtDate[1]).format('YYYYMMDD'));
    }
  }

    // 离职日期
  if (fileType === 'staff' && tabKey === StaffTabKey.resign) {
    // state
    params.state = [StaffSate.departure];
    // pending_departure_state
    params.pending_departure_state = [PendingDepartureState.departure];
    if (departureDate && Array.isArray(departureDate) && departureDate.length > 0) {
      // 离职日期开始时间
      params.departure_start_date = Number(moment(departureDate[0]).format('YYYYMMDD'));
      // 离职日期结束时间
      params.departure_end_date = Number(moment(departureDate[1]).format('YYYYMMDD'));
    }
  }

  // 是否有“包含裁撤部门”系统权限
  Operate.canOperateEmployeeAbolishDepartment() && fileType === 'staff' && (params.is_auth = true);
  return params;
};

export default {
  /**
   * 命名空间
   * @default
   */
  namespace: 'employeeManage',
  /**
  * 状态树
  * @prop {object} employees 人员列表信息
  * @prop {object} employeeDetail 人员详情信息
  * @prop {object} employeeHistoryDetail 人员历史工作信息
  */
  state: {
    fileType: '',               // 员工页面类型
    employeesAll: {},           // 员工列表全部信息
    employeesSecond: {},        // 劳动者员工列表信息
    employees: {},              // 员工列表信息
    idCardEmployees: {},        // 根据身份证号查询人员列表
    employeeDetail: {},         // 员工详情信息
    employeeHistoryDetail: {},  // 员工历史工作信息
    historyRecord: {},          // 员工档案历史记录
    bankInfo: {},               // 员工档案银行卡信息
    staffProfile: [],           // 人员档案
    workData: {},               // 工作信息
    contractData: {},           // 合同数据
    individualRegistration: {},  // 获取劳动者个户记录
    historyTripartiteId: {},      // 劳动者历史三方id
    teamTypes: [],                // 归属team类型
    teams: {},                    // 归属team
    teamTypeList: [],
    teamList: [],
    staffList: {}, // 员工列表（区别于旧modal）
  },
  /**
   * @namespace employee/manage/effects
   */
  effects: {
    /**
     * 获取人员列表
     * @param {number}  state 状态
     * @param {string}  name  姓名
     * @param {string}  phone  手机号
     * @param {string}  identityCardId  身份证号
     * @param {string}  customId  第三方平台账户id
     * @param {string}  associatedIdentityCardId  第三方平台身份证号
     * @param {string}  workType   个户类型
     * @param {string}  contractBelongId  合同归属
     * @param {array}   referrerCompanyId  推荐公司
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @param {number}  staffState  人员状态
     * @param {string}  healthCertificateDay  健康证到期天数
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    fetchEmployees: [
      function*({ payload }, { call, put }) {
        const {
        fileType,                    // 人员页面类型
        onSuccessCallback,           // 请求成功回调
        onFailureCallback,           // 请求失败的回凋
      } = payload;
        const params = commentPersonnelparams(payload, 'find');
        let result;
      // 员工档案使用单独接口
        if (fileType === 'staff') {
          result = yield call(fetchEmployeesStaff, params);
        } else {
          result = yield call(fetchEmployees, params);
        }
      // 当数据为空的时候调取失败回凋函数
        if (is.empty(result.data)) {
          if (onFailureCallback) {
            onFailureCallback();
          }
        }

      // 判断数据是否为空
        if (is.existy(result.data)) {
          if (onSuccessCallback) {
            onSuccessCallback(result.data);
          }
          if (fileType === 'second') {
            yield put({ type: 'reduceEmployeesSecond', payload: result });
          } else if (fileType === 'staff') {
            yield put({ type: 'reduceEmployees', payload: result });
          } else {
            yield put({ type: 'reduceEmployeesAll', payload: result });
          }
        }
        return result;
      },
      { type: 'takeLatest' }],

    /**
     * 根据身份证号获取人员信息
     * @param {number}  state 状态
     * @param {string}  identityCardId  身份证号
     * @param {string}  fileType        档案类型
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *fetchEmployeesIdCard({ payload }, { call, put }) {
      const {
        identityCardId,
        state,
        fileType,
        onSuccessCallback,
      } = payload;
      // 默认参数
      const params = {
        permission_id: Modules.OperateSystemAccountManageVerifyEmployee.id,
        account_id: authorize.account.id,
        _meta: RequestMeta.mapper({ page: 1, limit: 30 }),
      };
      // 身份证号
      if (is.existy(identityCardId) && is.not.empty(identityCardId)) {
        params.identity_card_id = identityCardId;
      }
      // 签约状态
      if (is.existy(state) && is.not.empty(state) && is.array(state)) {
        params.state = state.map(item => Number(item));
      }
      let result;
      // 员工档案使用单独接口
      if (fileType === 'staff') {
        result = yield call(fetchEmployeesStaff, params);
      } else {
        result = yield call(fetchEmployees, params);
      }
      if (result && result.data) {
        if (onSuccessCallback) {
          onSuccessCallback(result.data);
        }
        yield put({ type: 'reduceIdCardEmployees', payload: result });
      } else if (result && result.zh_message) {
        return message.error(result.zh_message);
      } else {
        return message.error('请求失败');
      }
    },

    /**
     * 获取人员档案
     * @param {number}  state 状态
     * @param {string}  name  姓名
     * @param {string}  phone  手机号
     * @param {array}  signType  签约类型
     * @param {array}  signState  签约状态
     */
    *fetchStaffProfile({ payload }, { call, put }) {
      // 默认参数
      const params = {
        profile_type: 30,              //  人员 30
        account_id: authorize.account.id,
        permission_id: Modules.OperateSystemAccountManageVerifyEmployee.id,
        _meta: RequestMeta.mapper({ page: 1, limit: 30 }),
      };
      const { phone } = payload;
      //
      if (is.existy(phone) && is.not.empty(phone)) {
        params.phone = phone;
      }

      if (is.existy(payload.signState) && is.not.empty(payload.signState)) {
        params.state = payload.signState;
      }

      // 请求服务器
      const result = yield call(fetchEmployeesStaff, params);
      // 判断数据是否为空
      if (is.existy(result.data)) {
        yield put({ type: 'reduceStaffProfile', payload: result.data });
      }
    },

    /**
     * 重置人员档案
     */
    *resetStaffProfile({ payload }, { put }) {
      yield put({ type: 'reduceStaffProfile', payload: [] });
    },

    /**
    * 获取员工详情历史记录
    * @param {string}  id 状态
    * @memberof module:model/employee/manage~employee/manage/effects
    */
    *fetchEmployeeHistoricalRecord({ payload }, { call, put }) {
      // 公共文本参数
      const {
        page,
        id,
      } = payload;
      // 默认参数
      const params = {
        _meta: RequestMeta.mapper({ page: page || 1, limit: 5 }),
      };
      // 姓名
      if (is.existy(id) && is.not.empty(id)) {
        params.staff_id = id;
      }
      // 请求服务器
      const result = yield call(fetchEmployeeHistoricalRecord, params);
      // 判断数据是否为空
      if (is.existy(result.data)) {
        yield put({ type: 'reduceEmployeeHistoryRecord', payload: result });
      }
    },
    /**
    * 获取劳动者个户记录
    * @memberof module:model/employee/manage~employee/manage/effects
    */
    *fetchEmployeeIndividualRegistration({ payload }, { call, put }) {
        // 默认参数
      const params = {};
      // 分页
      if (is.existy(payload.meta) && is.not.empty(payload.meta)) {
        params._meta = payload.meta;
      }
      // 员工id
      if (is.existy(payload.staffId) && is.not.empty(payload.staffId)) {
        params._id = payload.staffId;
      }
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      // 请求服务器
      const result = yield call(fetchEmployeeIndividualRegistration, params);
      // 判断数据是否为空
      if (is.existy(result.data)) {
        yield put({ type: 'reduceEmployeeIndividualRegistration', payload: result });
      }
    },
    /**
    * 获取劳动者历史三方ID
    * @memberof module:model/employee/manage~employee/manage/effects
    */
    *fetchEmployeeHistoryTripartiteId({ payload }, { call, put }) {
        // 默认参数
      const params = {};
      if (is.existy(payload.meta) && is.not.empty(payload.meta)) {
        params._meta = payload.meta;
      }
      // 员工id
      if (is.existy(payload.staffId) && is.not.empty(payload.staffId)) {
        params._id = payload.staffId;
      }
      // 请求服务器
      const result = yield call(fetchEmployeeHistoryTripartiteId, params);
      // 判断数据是否为空
      if (is.existy(result.data)) {
        yield put({ type: 'reduceEmployeeHistoryTripartiteId', payload: result });
      }
    },

    /**
     * 创建人员
     * @param {number}  fileType                档案类型
     * @param {number}  industryType            所属场景
     * @param {string}  householdNumber         个户编号
     * @param {string}  unityNumber             个独编号
     * @param {string}  unityName               个独名称
     * @param {number}  householdType           个户类型
     * @param {string}  post                    职能
     * @param {string}  employeeId              员工编号
     * @param {string}  nowJob                  当前岗位
     * @param {string}  employeeLevel           级别
     * @param {string}  platformCode            平台
     * @param {string}   supplierIds            供应商
     * @param {string}   cityCodes              城市spelling
     * @param {string}   citys                  城市code
     * @param {array}   districts               商圈
     * @param {number}  isSplitWage             工资是否拆分
     * @param {number}  splitBase               拆分基数
     * @param {object}  securityPlace           社保缴纳地
     * @param {number}   signType               签约类型
     * @param {string}  entryDate               合作日期
     * @param {string}  signedDate              合同生效日期
     * @param {string}  contractBelong          合同甲方
     * @param {string}  signCycle               签约周期数
     * @param {number}  timeCycle               签约周期单位
     * @param {number}  contractType            合同类型
     * @param {string}  contractNumber          合同编号
     * @param {string}  formalDate              预计转正日期
     * @param {string}  realFormalDate          实际转正日期
     * @param {object}  contractPhotos          合同照片
     * @param {number}  idPaperworkType         证件类型（身份证件）
     * @param {string}  idPaperworkNumber       证件号码（身份证件）
     * @param {string}  platformIdCard          平台身份证号（身份证件）
     * @param {string}  customId                第三方平台ID（身份证件）
     * @param {object}  idFrontPhotos           证件正面照（身份证件）
     * @param {object}  idObversePhotos         证件反面照（身份证件）
     * @param {object}  idClosePhotos           手持证件半身照（身份证件）
     * @param {number}  healthPaperworkType     证件类型（健康证件）
     * @param {string}  healthPaperworkNumber   证件号码（健康证件）
     * @param {object}  healthFrontPhotos       证件正面照（健康证件）
     * @param {object}  healthObversePhotos     证件反面照（健康证件）
     * @param {object}  healthClosePhotos       手持证件半身照（健康证件）
     * @param {number}  drivePaperworkType      证件类型（驾驶证件）
     * @param {string}  drivePaperworkNumber    证件号码（驾驶证件）
     * @param {object}  driveFrontPhotos        证件正面照（驾驶证件）
     * @param {object}  driveObversePhotos      证件反面照（驾驶证件）
     * @param {object}  driveClosePhotos        手持证件半身照（驾驶证件）
     * @param {number}  recruitmentChannel      推荐渠道
     * @param {string}  referrerCompany         推荐公司
     * @param {string}  staffIdentityCard       推荐人身份证
     * @param {string}  staffIdentityName       推荐人姓名
     * @param {string}  staffIdentityPhone      推荐人手机号
     * @param {number}  referrerPlatform        推荐平台
     * @param {string}  name                    姓名
     * @param {number}  gender                  性别
     * @param {string}  birthday                出生日期
     * @param {string}  age                     年龄
     * @param {string}  national                民族
     * @param {number}  politicalStatus         政治面貌
     * @param {number}  maritalStatus           婚姻状况
     * @param {string}  birthplace              籍贯
     * @param {string}  accountLocation         户口所在地
     * @param {string}  oftenAddress            常居地
     * @param {string}  phone                   手机号
     * @param {string}  fixedTelephone          固定电话
     * @param {string}  email                   邮箱
     * @param {string}  education               学历
     * @param {string}  emergencyContact        紧急联系人
     * @param {string}  emergencyContactPhone   紧急联系人电话
     * @param {number}  height                  身高
     * @param {number}  weight                  体重
     * @param {string}  constellation           星座
     * @param {string}  hobby                   兴趣爱好
     * @param {string}  specialty               特长
     * @param {number}  highestEducation        最高学历
     * @param {string}  jobTitle                专业职称
     * @param {string}  foreignLanguage         外语及等级
     * @param {object}  degreeCertificatePhotos 学位证照片
     * @param {array}  learnExperience          学习经历
     * @param {array}  workExperience           工作经历
     * @param {number} collection               收款模式
     * @param {string} cardholder               代收人/持卡人姓名
     * @param {number} collectingGender         性别
     * @param {string} collectingPhone          代收人手机号
     * @param {string} identity                 代收人身份证号码
     * @param {string} account                  代收人银行卡账号
     * @param {string} bankName                 开户行
     * @param {string} branch                   支行名称
     * @param {object} address                  开户行所在地
     * @param {array} bankPositive              银行卡正面照
     * @param {array} prove                     代收证明
     * @param {array} agreement                 代收协议
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *createEmployee({ payload }, { call }) {
      const {
        fileType,                // 档案类型
        industryType,            // 所属场景
        householdNumber,         // 个户编号
        unityNumber,             // 个独编号
        unityName,               // 个独名称
        householdType,           // 个户类型
        post,                    // 职能
        employeeId,              // 员工编号
        nowJob,                  // 当前岗位
        employeeLevel,           // 级别
        staffDepartments,        // 所属部门及岗位列表
        platformCode,            // 平台
        supplierIds,             // 供应商
        cityCodes,               // 城市spelling
        citys,                   // 城市code
        districts,               // 商圈
        isSplitWage,             // 工资是否拆分
        splitBase,               // 拆分基数
        signType,                // 签约类型
        entryDate,               // 合作日期
        signedDate,              // 合同生效日期
        contractBelong,          // 合同甲方
        signCycle,               // 签约周期数
        timeCycle,               // 签约周期单位
        contractType,            // 合同类型
        contractNumber,          // 合同编号
        formalDate,              // 预计转正日期
        realFormalDate,          // 实际转正日期
        contractPhotos,          // 合同照片
        idPaperworkType,         // 证件类型（身份证件）
        idPaperworkNumber,       // 证件号码（身份证件）
        platformIdCard,          // 平台身份证号（身份证件）
        customId,                // 第三方平台ID（身份证件）
        idFrontPhotos,           // 证件正面照（身份证件）
        idObversePhotos,         // 证件反面照（身份证件）
        idClosePhotos,           // 手持证件半身照（身份证件）
        healthPaperworkType,     // 证件类型（健康证件）
        healthPaperworkNumber,   // 证件号码（健康证件）
        healthFrontPhotos = { keys: [] },       // 证件正面照（健康证件）
        healthObversePhotos = { keys: [] },     // 证件反面照（健康证件）
        healthClosePhotos,       // 手持证件半身照（健康证件）
        drivePaperworkType,      // 证件类型（驾驶证件）
        drivePaperworkNumber,    // 证件号码（驾驶证件）
        driveFrontPhotos = { keys: [] },        // 证件正面照（驾驶证件）
        driveObversePhotos = { keys: [] },      // 证件反面照（驾驶证件）
        driveClosePhotos,        // 手持证件半身照（驾驶证件）
        recruitmentChannel,      // 推荐渠道
        referrerCompany,         // 推荐公司
        staffIdentityCard,       // 推荐人身份证
        staffIdentityName,       // 推荐人姓名
        staffIdentityPhone,      // 推荐人手机号
        referrerPlatform,        // 推荐平台
        name,                    // 姓名
        gender,                  // 性别
        birthday,                // 出生日期
        age,                     // 年龄
        national,                // 民族
        politicalStatus,         // 政治面貌
        maritalStatus,           // 婚姻状况
        birthplace,              // 籍贯
        accountLocation,         // 户口所在地
        oftenAddress,            // 常居地
        phone,                   // 手机号
        fixedTelephone,          // 固定电话
        email,                   // 个人邮箱
        workEmail,               // 工作邮箱
        education,               // 学历
        emergencyContact,        // 紧急联系人
        emergencyContactPhone,   // 紧急联系人电话
        height,                  // 身高
        weight,                  // 体重
        constellation,           // 星座
        hobby,                   // 兴趣爱好
        specialty,               // 特长
        highestEducation,        // 最高学历
        jobTitle,                // 专业职称
        foreignLanguage,         // 外语及等级
        degreeCertificatePhotos, // 学位证照片
        learnExperience,         // 学习经历
        workExperience,          // 工作经历
        collection,              // 收款模式
        cardholder,              // 代收人/持卡人姓名
        collectingGender,        // 性别
        collectingPhone,         // 代收人手机号
        identity,                // 代收人身份证号码
        account,                 // 代收人银行卡账号
        bankName,                // 开户行
        branch,                  // 支行名称
        address,                 // 开户行所在地
        bankPositive,            // 银行卡正面照
        prove,                   // 代收证明
        agreement,               // 代收协议
        onLoading,                // loading
        // costCenter,               // 成本中心级别
        applicationChannelId,     //  应聘途径
        applicationCompanyName,   //  应聘公司名称
        applicationPlatform,      //  应聘渠道
        platformCodeStaff,        //  转签平台
        supplierIdsStaff,         //  转签供应商
        job,                      //  转签岗位
        departmentId, // 部门id
        onSuccessOrganCallback, // 组织架构成功回调
        securityPlace,           // 社保缴纳地
        oldAgeInsurance,          // 养老保险
        medicalInsurance,         // 医疗保险
        unemploymentInsurance,    // 失业保险
        occupationalInsurance,    // 工伤保险
        fertilityInsurance,       // 生育保险
        staffTag,
        societyStartMonth,
        fundPlace,
        fundPlanName,
        planName,
        fundStartMonth,
        fundInsurance,
        planNameSocietyList,
        planNameFundList,
        bigMedicalCompany,
        bigMedicalPerson,
        otherCostCompany,
        otherCostPerson,
      } = payload;
      // 社保缴纳地没填
      // 员工五险只要有值，但是没有社保地，则返回错误
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        // 员工
        payload.flag
        &&
        (oldAgeInsurance || medicalInsurance || unemploymentInsurance
          || occupationalInsurance || fertilityInsurance)
        &&
        // 社保地值未填写完整
        (is.empty(securityPlace)
          || !securityPlace.province || !securityPlace.city)
      ) {
        if (onLoading) {
          onLoading();
        }
        return message.error('社保缴纳地没填');
      }
      // 员工有一金，但是没有公积金缴纳地，则返回错误
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        // 员工
        payload.flag
        &&
        fundInsurance
        &&
        // 社保地值未填写完整
        (is.empty(fundPlace)
        || !fundPlace.province || !fundPlace.city)
      ) {
        if (onLoading) {
          onLoading();
        }
        return message.error('公积金缴纳地没填');
      }
      // 社保如果只填了一个，则未填写完整
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        // 员工
        payload.flag
        &&
        // 社保地值未填写完整
        is.not.empty(securityPlace)
        &&
        (!securityPlace.province || !securityPlace.city)
      ) {
        if (onLoading) {
          onLoading();
        }
        return message.error('社保缴纳地需填写完整');
      }
      // 档案类型
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one && (is.not.existy(fileType) || is.empty(fileType))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，档案类型不能为空');
      }
      // 所属场景
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${fileType}` !== `${FileType.staff}` && (is.not.existy(industryType) || is.empty(industryType))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，所属场景不能为空');
      }
      // 平台
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${fileType}` !== `${FileType.staff}` && (is.not.existy(platformCode) || is.empty(platformCode))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，所属平台不能为空');
      }
      // 主体（供应商）
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${fileType}` !== `${FileType.staff}` && (is.not.existy(supplierIds) || is.empty(supplierIds))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，所属主体不能为空');
      }
      // 城市
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${fileType}` !== `${FileType.staff}` && (is.not.existy(cityCodes) || is.empty(cityCodes))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，所属城市不能为空');
      }
      // 商圈
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${fileType}` !== `${FileType.staff}` && (is.not.existy(districts) || is.empty(districts))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，所属商圈不能为空');
      }
      // 签约类型
      if (payload.setpActiveKey === EmployeeUpdatePageSetp.one && (is.not.existy(signType) || is.empty(signType))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，签约类型不能为空');
      }
      // 合作日期
      if (payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(entryDate) || is.empty(entryDate))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，合作日期不能为空');
      }
      // 合同生效日期
      if (payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(signedDate) || is.empty(signedDate))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，合同生效日期不能为空');
      }
      // 合同甲方
      // if (is.not.existy(contractBelong) || is.empty(contractBelong)) {
      //   if (onSuccessCallback) {
      //     onSuccessCallback();
      //   }
      //   return message.error('操作失败，合同甲方不能为空');
      // }
      // 签约周期数
      if (payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(signCycle) || is.empty(signCycle))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，签约周期数不能为空');
      }
      // 签约周期单位
      if (payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(timeCycle) || is.empty(timeCycle))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，签约周期单位不能为空');
      }
      // 合同类型
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(contractType) || is.empty(contractType))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，合同类型不能为空');
      }
      // 证件类型（身份证件）
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(idPaperworkType) || is.empty(idPaperworkType))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，证件类型（身份证件）不能为空');
      }
      // 证件号码（身份证件）
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(idPaperworkNumber) || is.empty(idPaperworkNumber))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，证件号码（身份证件）不能为空');
      }

      // 推荐渠道
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${fileType}` !== `${FileType.staff}` && (is.not.existy(recruitmentChannel) || is.empty(recruitmentChannel))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，推荐渠道不能为空');
      }
      // 推荐公司
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${fileType}` !== `${FileType.staff}` && `${AccountRecruitmentChannel}` === `${AccountRecruitmentChannel.third}` && (is.not.existy(referrerCompany) || is.empty(referrerCompany))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，推荐公司不能为空');
      }
      // 推荐平台
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${fileType}` !== `${FileType.staff}` && `${AccountRecruitmentChannel}` === `${AccountRecruitmentChannel.thirdPlatform}` && (is.not.existy(referrerPlatform) || is.empty(referrerPlatform))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，推荐公司不能为空');
      }
      // 推荐人身份证
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${fileType}` !== `${FileType.staff}` && `${AccountRecruitmentChannel}` === `${AccountRecruitmentChannel.recommend}` && (is.not.existy(staffIdentityCard) || is.empty(staffIdentityCard))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，推荐人身份证不能为空');
      }
      // 姓名
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(name) || is.empty(name))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，姓名不能为空');
      }
      // 性别
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(gender) || is.empty(gender))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，性别不能为空');
      }
      // 出生日期
      // if (`${signType}` === `${SignContractType.paper}` && (is.not.existy(birthday) || is.empty(birthday))) {
      //   return message.error('操作失败，出生日期不能为空');
      // }
      // 民族
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(national) || is.empty(national))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，民族不能为空');
      }
      // 籍贯
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(birthplace) || is.empty(birthplace))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，籍贯不能为空');
      }
      // 学历
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(education) || is.empty(education))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，学历不能为空');
      }
      // 常居地
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(oftenAddress) || is.empty(oftenAddress))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，常居地不能为空');
      }
      // 手机号
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(phone) || is.empty(phone))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，手机号不能为空');
      }
      // 紧急联系人电话
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(emergencyContactPhone) || is.empty(emergencyContactPhone))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，紧急联系人电话不能为空');
      }
      // 合同生效日期必须等于或晚于合作日期
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        entryDate && entryDate.isAfter(signedDate)) {
        if (onLoading) {
          onLoading();
        }
        return message.error('合同生效日期必须等于或晚于合作日期', 5);
      }
      // 预计转正日期必须晚于合作日期
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        formalDate && (formalDate.isBefore(entryDate) || formalDate.isSame(entryDate, 'day'))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('预计转正日期必须晚于合作/入职日期', 5);
      }
      // 实际转正日期必须晚于合作日期
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        realFormalDate && (realFormalDate.isBefore(entryDate) || realFormalDate.isSame(entryDate, 'day'))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('实际转正日期必须晚于合作/入职日期', 5);
      }
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        ((healthFrontPhotos.keys[0] && !healthObversePhotos.keys[0])
        || (!healthFrontPhotos.keys[0] && healthObversePhotos.keys[0]))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('健康证件类型下的证件正反面均不能为空', 5);
      }
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        ((driveFrontPhotos.keys[0] && !driveObversePhotos.keys[0])
        || (!driveFrontPhotos.keys[0] && driveObversePhotos.keys[0]))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('驾驶证件类型下的证件正反面均不能为空', 5);
      }
      // 纸质签约且档案类型为劳动者时需上传合同照片
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${signType}` === `${SignContractType.paper}` && !(`${fileType}` === `${FileType.staff}`)
        && (is.not.existy(contractPhotos) || is.empty(contractPhotos) || is.not.existy(contractPhotos.keys) || is.empty(contractPhotos.keys))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('合同照片未上传', 5);
      }
      // 人员档案下纸质签约需上传身份证正面照
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${signType}` === `${SignContractType.paper}`
        && `${fileType}` === `${FileType.staff}`
        && (is.not.existy(idFrontPhotos) || is.empty(idFrontPhotos) || is.not.existy(idFrontPhotos.keys) || is.empty(idFrontPhotos.keys))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('身份证件正面照未上传', 5);
      }
      // 人员档案下纸质签约需上传身份证反面照
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${signType}` === `${SignContractType.paper}`
        && `${fileType}` === `${FileType.staff}`
        && (is.not.existy(idObversePhotos) || is.empty(idObversePhotos) || is.not.existy(idObversePhotos.keys) || is.empty(idObversePhotos.keys))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('身份证件反面照未上传', 5);
      }

      const params = {
        profile_type: Number(fileType),                     // 档案类型
        sign_type: Number(signType),                        // 签约类型
        entry_date: entryDate ? Number(entryDate.format('YYYYMMDD')) : '',    // 合作日期
        signed_date: signedDate ? Number(signedDate.format('YYYYMMDD')) : '', // 合同生效日期
        contract_belong_id: contractBelong,                 // 合同甲方ID
        sign_cycle: Number(signCycle),                      // 签约周期数
        sign_cycle_unit: Number(timeCycle),                 // 签约周期单位
        contract_type: Number(contractType),                // 合同类型
        identity_certificate_type: Number(idPaperworkType), // 身份证件类型
        identity_card_id: idPaperworkNumber,                // 身份证号
        health_certificate_type: PaperworkType.health,      // 健康证证件类型
        drive_certificate_type: PaperworkType.drive,        // 驾驶证证件类型
        recruitment_channel_id: Number(recruitmentChannel), // 推荐渠道
        name,                                               // 姓名
        gender_id: Number(gender),                          // 性别
        age,                                                // 年龄
        national,                                           // 名族
        birth_place: birthplace,                            // 籍贯
        education,                                          // 学历
        often_address: oftenAddress,                        // 常居地
        phone,                                              // 手机号
        emergency_contact_phone: emergencyContactPhone,     // 紧急联系人电话
        payment_type: collection,                           // 收款模式
        card_holder_name: cardholder,                       // 持卡人姓名
        collect_sex: Number(collectingGender),              // 性别
        collect_phone: collectingPhone,                     // 代收人手机号
        collect_id_card_no: identity,                       // 代收人身份证号码
        card_holder_bank_card_no: account,                  // 代收人银行卡账号
        bank_branch: bankName,                              // 开户行
        bank_branch_name: branch,                           // 支行名称
      };
      // 档案信息
      if (payload.setpActiveKey === EmployeeUpdatePageSetp.one) {
        params.storage_type = 3;
        params.bank_card_storage_type = 3;
      }
      const staffParams = {                             // 员工合同的新增需要增加一个请求
        name,
        phone,
        identity_card_id: idPaperworkNumber,
        sign_type: Number(signType),                        // 签约类型
        entry_date: entryDate ? Number(entryDate.format('YYYYMMDD')) : '',    // 合作日期
        signed_date: signedDate ? Number(signedDate.format('YYYYMMDD')) : '', // 合同生效日期
        contract_belong_id: contractBelong,                 // 合同甲方ID
        sign_cycle: Number(signCycle),                      // 签约周期数
        sign_cycle_unit: Number(timeCycle),                 // 签约周期单位
        contract_type: Number(contractType),                // 合同类型
        storage_type: 3,
        bank_card_storage_type: 3,
      };

      // 工作地
      if (is.existy(payload.workplace) && is.not.empty(payload.workplace)) {
        // 省份
        params.work_province_code = String(payload.workplace.province);
        // 城市
        params.work_city_code = String(payload.workplace.city);
      }

      // cityCode
      if (is.existy(citys) && is.not.empty(citys) && `${fileType}` === `${FileType.staff}`) {
        params.city_codes = Array.isArray(citys) ? citys : [citys];
      }
      // // 签约类型
      // if (is.existy(signType) && is.not.empty(signType) && `${fileType}` !== `${FileType.staff}`) {
      //   params.sign_type = Number(signType);
      // }
      // // 签约类型(员工)
      // if (is.existy(signType) && is.not.empty(signType) && `${fileType}` === `${FileType.staff}`) {
      //   staffParams.sign_type = Number(signType);
      // }
      // // 合作日期
      // if (is.existy(entryDate) && is.not.empty(entryDate) && `${fileType}` !== `${FileType.staff}`) {
      //   params.entry_date = Number(entryDate.format('YYYYMMDD'));
      // }
      // // 合作日期(员工)
      // if (is.existy(entryDate) && is.not.empty(entryDate) && `${fileType}` === `${FileType.staff}`) {
      //   staffParams.entry_date = Number(entryDate.format('YYYYMMDD'));
      // }
      // // 合作生效日期
      // if (is.existy(signedDate) && is.not.empty(signedDate) && `${fileType}` !== `${FileType.staff}`) {
      //   params.signed_date = Number(signedDate.format('YYYYMMDD'));
      // }
      // // 合作生效日期(员工)
      // if (is.existy(signedDate) && is.not.empty(signedDate) && `${fileType}` === `${FileType.staff}`) {
      //   staffParams.signed_date = Number(signedDate.format('YYYYMMDD'));
      // }
      // // 合同甲方
      // if (is.existy(contractBelong) && is.not.empty(contractBelong) && `${fileType}` !== `${FileType.staff}`) {
      //   params.contract_belong_id = contractBelong;
      // }
      // // 合同甲方(员工)
      // if (is.existy(contractBelong) && is.not.empty(contractBelong) && `${fileType}` === `${FileType.staff}`) {
      //   staffParams.contract_belong_id = contractBelong;
      // }
      // // 签约周期数
      // if (is.existy(signCycle) && is.not.empty(signCycle) && `${fileType}` !== `${FileType.staff}`) {
      //   params.sign_cycle = signCycle;
      // }
      // // 签约周期数(员工)
      // if (is.existy(signCycle) && is.not.empty(signCycle) && `${fileType}` === `${FileType.staff}`) {
      //   staffParams.sign_cycle = signCycle;
      // }
      // // 签约周期数单位
      // if (is.existy(timeCycle) && is.not.empty(timeCycle) && `${fileType}` !== `${FileType.staff}`) {
      //   params.sign_cycle_unit = timeCycle;
      // }
      // // 签约周期数单位(员工)
      // if (is.existy(timeCycle) && is.not.empty(timeCycle) && `${fileType}` === `${FileType.staff}`) {
      //   staffParams.sign_cycle_unit = timeCycle;
      // }
      // // 合同类型
      // if (is.existy(contractType) && is.not.empty(contractType) && `${fileType}` !== `${FileType.staff}`) {
      //   params.contract_type = contractType;
      // }
      // // 合同类型(员工)
      // if (is.existy(contractType) && is.not.empty(contractType) && `${fileType}` === `${FileType.staff}`) {
      //   staffParams.contract_type = contractType;
      // }

      // // 成本中心
      // if (is.existy(costCenter) && is.not.empty(costCenter)) {
      //   params.cost_center_type = Number(costCenter);
      // }

      // 平台
      if (is.existy(platformCode) && is.not.empty(platformCode)) {
        params.platform_list = Array.isArray(platformCode) ? platformCode : [platformCode];
      }
      // 供应商
      if (is.existy(supplierIds) && is.not.empty(supplierIds)) {
        params.supplier_list = Array.isArray(supplierIds) ? supplierIds : [supplierIds];
      }
      // 城市
      if (is.existy(cityCodes) && is.not.empty(cityCodes)) {
        params.city_spelling_list = Array.isArray(cityCodes) ? cityCodes : [cityCodes];
      }

      // 商圈
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_list = Array.isArray(districts) ? districts : [districts];
      }

      // 工资是否拆分
      if (is.existy(isSplitWage) && is.not.empty(isSplitWage)) {
        params.is_salary_split = Boolean(isSplitWage);
      }
      // 拆分基数
      if (is.existy(splitBase) && is.not.empty(splitBase)) {
        params.split_base = Number(splitBase) * 100;
      }
      // 社保缴纳地
      if (is.existy(securityPlace) && is.not.empty(securityPlace)) {
        params.social_security_payment_plac = securityPlace;
      }
      // 公积金缴纳地
      if (is.existy(fundPlace) && is.not.empty(fundPlace)) {
        params.provident_fund_payment_plac = fundPlace;
      }
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        payload.flag) {
        // 养老保险
        params.old_age_insurance = oldAgeInsurance ? Unit.exchangePriceToCent(oldAgeInsurance) : 0;
        // 医疗保险
        params.medical_insurance = medicalInsurance ? Unit.exchangePriceToCent(medicalInsurance) : 0;
        // 失业保险
        params.unemployment_insurance = unemploymentInsurance ? Unit.exchangePriceToCent(unemploymentInsurance) : 0;
        // 工伤保险
        params.occupational_insurance = occupationalInsurance ? Unit.exchangePriceToCent(occupationalInsurance) : 0;
        // 生育保险
        params.birth_insurance = fertilityInsurance ? Unit.exchangePriceToCent(fertilityInsurance) : 0;
        // 公积金
        params.provident_fund = fundInsurance ? Unit.exchangePriceToCent(fundInsurance) : 0;
        // 大额医疗公司
        params.big_medical_insurance_enterprise = bigMedicalCompany ? Unit.exchangePriceToCent(bigMedicalCompany) : 0;
        // 大额医疗个人
        params.big_medical_insurance_person = bigMedicalPerson ? Unit.exchangePriceToCent(bigMedicalPerson) : 0;
        // 其它费用公司
        params.other_enterprise_fee = otherCostCompany ? Unit.exchangePriceToCent(otherCostCompany) : 0;
        // 其它费用个人
        params.other_person_fee = otherCostPerson ? Unit.exchangePriceToCent(otherCostPerson) : 0;
        if (planNameSocietyList) {
          planNameSocietyList.map((item) => {
            if (item.name === planName) {
              params.insurance_program_id = item._id;
            }
          });
        }
        if (planNameFundList) {
          planNameFundList.map((item) => {
            if (item.name === fundPlanName) {
              params.provident_fund_program_id = item._id;
            }
          });
        }
      }
      if (is.existy(societyStartMonth) && is.not.empty(societyStartMonth)) {
        // 社保开始月份
        params.insurance_began_month = moment(societyStartMonth).format('YYYYMM');
      }
      if (is.existy(fundStartMonth) && is.not.empty(fundStartMonth)) {
        // 公积金开始月份
        params.provident_fund_began_month = moment(fundStartMonth).format('YYYYMM');
      }

      // 开户行所在地
      if (is.existy(address) && is.not.empty(address)) {
        const bankAddress = [];
        bankAddress.push(address.province, address.city);
        params.bank_location = bankAddress;
      }
      // 所属场景
      if (is.existy(industryType) && is.not.empty(industryType)) {
        params.industry_code = Number(industryType);
      }
      // 个户类型
      if (is.existy(householdType) && is.not.empty(householdType)) {
        params.individual_type = Number(householdType);
      }
      // 职能
      if (is.existy(post) && is.not.empty(post)) {
        params.office = post;
      }
      // 个户编号
      if (is.existy(householdNumber) && is.not.empty(householdNumber)) {
        params.personal_company_no = householdNumber;
      }
      // 个独编号
      if (is.existy(unityNumber) && is.not.empty(unityNumber)) {
        params.company_no = unityNumber;
      }
      // 个独名称
      if (is.existy(unityName) && is.not.empty(unityName)) {
        params.company_name = unityName;
      }
      // 员工编号
      if (is.existy(employeeId) && is.not.empty(employeeId)) {
        params.staff_no = employeeId;
      }
      // 当前岗位
      if (is.existy(nowJob) && is.not.empty(nowJob)) {
        params.station = nowJob;
      }
      // 级别
      if (is.existy(employeeLevel) && is.not.empty(employeeLevel)) {
        params.station_level = employeeLevel;
      }
      // 所属部门就岗位列表
      if (is.existy(staffDepartments) && is.not.empty(staffDepartments)) {
        const compareId = [];
        params.department_job_relation_list = staffDepartments.map((item) => {
          if (compareId.indexOf(item.podepartmentJobRelationId) === -1) {
            compareId.push(item.podepartmentJobRelationId);
          }
          return {
            department_id: item.department,
            major_job_id: item.post,
            department_job_relation_id: item.podepartmentJobRelationId,
            job_flag: Boolean(item.isSelected),
            is_organization: Boolean(item.isOrganization),
          };
        });
        if (staffDepartments.length !== compareId.length) {
          if (onLoading) {
            onLoading();
          }
          return message.error('选择的的部门和岗位不能重复');
        }
      }
      // 合同编号
      if (is.existy(contractNumber) && is.not.empty(contractNumber)) {
        params.contract_no = contractNumber;
        staffParams.contract_no = contractNumber;
      }
      // 转正日期
      if (is.existy(formalDate) && is.not.empty(formalDate)) {
        params.regular_date = formalDate ? Number(formalDate.format('YYYYMMDD')) : '';
        staffParams.regular_date = formalDate ? Number(formalDate.format('YYYYMMDD')) : '';
      }
      // 实际转正日期
      if (is.existy(realFormalDate) && is.not.empty(realFormalDate)) {
        params.actual_regular_date = realFormalDate ? Number(realFormalDate.format('YYYYMMDD')) : '';
        staffParams.actual_regular_date = realFormalDate ? Number(realFormalDate.format('YYYYMMDD')) : '';
      }
      // 平台身份证号（身份证件）
      if (is.existy(platformIdCard) && is.not.empty(platformIdCard)) {
        params.associated_identity_card_id = platformIdCard;
      }
      // 第三方平台ID（身份证件））
      if (is.existy(customId) && is.not.empty(customId)) {
        params.custom_id = customId;
      }
      // 合同照片
      if (is.existy(contractPhotos) && is.not.empty(contractPhotos)
        && is.existy(contractPhotos.keys) && is.not.empty(contractPhotos.keys)) {
        params.contract_photo_list = contractPhotos.keys;
        staffParams.contract_photo_list = contractPhotos.keys;
      }
      // 证件正面照（身份证件）
      if (is.existy(idFrontPhotos) && is.not.empty(idFrontPhotos)
        && is.existy(idFrontPhotos.keys) && is.not.empty(idFrontPhotos.keys)) {
        params.identity_card_front = idFrontPhotos.keys[0];
      }
      // 证件反面照（身份证件）
      if (is.existy(idObversePhotos) && is.not.empty(idObversePhotos)
        && is.existy(idObversePhotos.keys) && is.not.empty(idObversePhotos.keys)) {
        params.identity_card_back = idObversePhotos.keys[0];
      }
      // 手持证件半身照（身份证件）
      if (is.existy(idClosePhotos) && is.not.empty(idClosePhotos)
        && is.existy(idClosePhotos.keys) && is.not.empty(idClosePhotos.keys)) {
        params.identity_card_in_hand = idClosePhotos.keys[0];
      }
      // 银行卡正面照
      if (is.existy(bankPositive) && is.not.empty(bankPositive)
        && is.existy(bankPositive.keys) && is.not.empty(bankPositive.keys)) {
        params.bank_card_front = bankPositive.keys[0];
      }
      // 代收协议照片
      if (is.existy(agreement) && is.not.empty(agreement)
        && is.existy(agreement.keys) && is.not.empty(agreement.keys)) {
        params.collect_protocol = agreement.keys;
      }
      // 代收证明照片
      if (is.existy(prove) && is.not.empty(prove)
        && is.existy(prove.keys) && is.not.empty(prove.keys)) {
        params.collect_provement = prove.keys;
      }
      // 证件类型（健康证件）
      if (is.existy(healthPaperworkType) && is.not.empty(healthPaperworkType)) {
        params.health_certificate_type = healthPaperworkType ? Number(healthPaperworkType) : PaperworkType.health;
      }
      // 健康证件号码（健康证件）
      if (is.existy(healthPaperworkNumber) && is.not.empty(healthPaperworkNumber)) {
        params.health_certificate_no = healthPaperworkNumber;
      }
      // 证件正面照（健康证件）
      if (is.existy(healthFrontPhotos) && is.not.empty(healthFrontPhotos)
        && is.existy(healthFrontPhotos.keys) && is.not.empty(healthFrontPhotos.keys)) {
        params.health_certificate = healthFrontPhotos.keys[0];
      }
      // 证件反面照（健康证件）
      if (is.existy(healthObversePhotos) && is.not.empty(healthObversePhotos)
        && is.existy(healthObversePhotos.keys) && is.not.empty(healthObversePhotos.keys)) {
        params.health_certificate_back = healthObversePhotos.keys[0];
      }
      // 手持证件半身照（健康证件）
      if (is.existy(healthClosePhotos) && is.not.empty(healthClosePhotos)
        && is.existy(healthClosePhotos.keys) && is.not.empty(healthClosePhotos.keys)) {
        params.health_certificate_in_hand = healthClosePhotos.keys[0];
      }
      // 证件类型（驾驶证件）
      if (is.existy(drivePaperworkType) && is.not.empty(drivePaperworkType)) {
        params.drive_certificate_type = drivePaperworkType ? Number(drivePaperworkType) : PaperworkType.drive;
      }
      // 证件号码（驾驶证件）
      if (is.existy(drivePaperworkNumber) && is.not.empty(drivePaperworkNumber)) {
        params.drive_certificate_no = drivePaperworkNumber;
      }
      // 证件正面照（驾驶证件）
      if (is.existy(driveFrontPhotos) && is.not.empty(driveFrontPhotos)
        && is.existy(driveFrontPhotos.keys) && is.not.empty(driveFrontPhotos.keys)) {
        params.drive_certificate_front = driveFrontPhotos.keys[0];
      }
      // 证件反面照（驾驶证件）
      if (is.existy(driveObversePhotos) && is.not.empty(driveObversePhotos)
        && is.existy(driveObversePhotos.keys) && is.not.empty(driveObversePhotos.keys)) {
        params.drive_certificate_back = driveObversePhotos.keys[0];
      }
      // 手持证件半身照（驾驶证件）
      if (is.existy(driveClosePhotos) && is.not.empty(driveClosePhotos)
        && is.existy(driveClosePhotos.keys) && is.not.empty(driveClosePhotos.keys)) {
        params.drive_certificate_in_hand = driveClosePhotos.keys[0];
      }
      // 推荐公司
      if (is.existy(referrerCompany) && is.not.empty(referrerCompany)) {
        params.referrer_company_id = referrerCompany;
      }
      // 推荐平台
      if (is.existy(referrerPlatform) && is.not.empty(referrerPlatform)) {
        params.referrer_platform = Number(referrerPlatform);
      }
      // 推荐人姓名
      if (is.existy(staffIdentityName) && is.not.empty(staffIdentityName)) {
        params.referrer_name = staffIdentityName;
      }
      // 推荐人身份证
      if (is.existy(staffIdentityCard) && is.not.empty(staffIdentityCard)) {
        params.referrer_identity_no = staffIdentityCard;
      }
      // 推荐人手机号
      if (is.existy(staffIdentityPhone) && is.not.empty(staffIdentityPhone)) {
        params.referrer_phone = staffIdentityPhone;
      }
      // 出生日期
      if (is.existy(birthday) && is.not.empty(birthday)) {
        params.born_in = birthday ? Number(birthday.format('YYYYMMDD')) : '';
      }
      // 政治面貌
      if (is.existy(politicalStatus) && is.not.empty(politicalStatus)) {
        params.politics_status = Number(politicalStatus);
      }
      // 婚姻状况
      if (is.existy(maritalStatus) && is.not.empty(maritalStatus)) {
        params.marital_status = Number(maritalStatus);
      }
      // 户口所在地
      if (is.existy(accountLocation) && is.not.empty(accountLocation)) {
        params.native_place = accountLocation;
      }
      // 固定电话
      if (is.existy(fixedTelephone) && is.not.empty(fixedTelephone)) {
        params.telephone = fixedTelephone;
      }
      // 个人邮箱
      if (is.existy(email) && is.not.empty(email)) {
        params.email = email;
      }
      // 工作邮箱
      if (is.existy(workEmail) && is.not.empty(workEmail)) {
        params.work_email = workEmail;
      }

      // 紧急联系人
      if (is.existy(emergencyContact) && is.not.empty(emergencyContact)) {
        params.emergency_contact = emergencyContact;
      }
      // 身高
      if (is.existy(height) && is.not.empty(height)) {
        params.height = height;
      }
      // 体重
      if (is.existy(weight) && is.not.empty(weight)) {
        params.weight = weight;
      }
      // 星座
      if (is.existy(constellation) && is.not.empty(constellation)) {
        params.constellation = constellation;
      }
      // 兴趣爱好
      if (is.existy(hobby) && is.not.empty(hobby)) {
        params.interest = hobby;
      }
      // 特长
      if (is.existy(specialty) && is.not.empty(specialty)) {
        params.speciality = specialty;
      }
      // 最高学历
      if (is.existy(highestEducation) && is.not.empty(highestEducation)) {
        params.highest_education = Number(highestEducation);
      }
      // 专业职称
      if (is.existy(jobTitle) && is.not.empty(jobTitle)) {
        params.professional = jobTitle;
      }
      // 外语及等级
      if (is.existy(foreignLanguage) && is.not.empty(foreignLanguage)) {
        params.language_level = foreignLanguage;
      }
      // 学位证照片
      if (is.existy(degreeCertificatePhotos) && is.not.empty(degreeCertificatePhotos)
        && is.existy(degreeCertificatePhotos.keys) && is.not.empty(degreeCertificatePhotos.keys)) {
        params.degree = degreeCertificatePhotos.keys;
      }
      // 学习经历
      if (is.existy(learnExperience) && is.not.empty(learnExperience)) {
        params.academy_list = learnExperience.map((item) => {
          return {
            institution_name: item.institutionName || '', // 院校名称
            education: item.dynamicEducation || '',       // 学历
            profession: item.profession || '',            // 专业
            start_time: item.period && item.period[0] ? item.period[0].format('YYYYMMDD') : '',                // 开始时间
            end_time: item.period && item.period[1] ? item.period[1].format('YYYYMMDD') : '',                  // 结束时间
          };
        });
      }
      // 工作经历
      if (is.existy(workExperience) && is.not.empty(workExperience)) {
        for (let i = 0; i < workExperience.length; i += 1) {
          if (workExperience[i].witnessPhone && !/^\d{11}$/.test(workExperience[i].witnessPhone)) {
            if (onLoading) {
              onLoading();
            }
            return message.error(`工作经历中第${i + 1}条数据，证明人电话格式错误`);
          }
        }
        params.work_experience = workExperience.map((item) => {
          return {
            employer: item.employer || '',          // 工作单位
            position: item.workPosition || '',      // 职位
            certifier_name: item.witness || '',     // 证明人姓名
            proof_phone: item.witnessPhone || '',   // 证明人电话
            work_start_time: item.workPeriod && item.workPeriod[0] ? item.workPeriod[0].format('YYYYMMDD') : '', // 工作开始时间
            work_end_time: item.workPeriod && item.workPeriod[1] ? item.workPeriod[1].format('YYYYMMDD') : '',   // 工作结束时间
          };
        });
      }
      // 应聘途径
      if (is.existy(applicationChannelId) && is.not.empty(applicationChannelId)) {
        params.application_channel_id = Number(applicationChannelId);
      }
      // 应聘公司名称
      if (is.existy(applicationCompanyName) && is.not.empty(applicationCompanyName)) {
        params.application_company_name = applicationCompanyName;
      }
      // 应聘途径的应聘渠道
      if (is.existy(applicationPlatform) && is.not.empty(applicationPlatform)) {
        params.application_platform = applicationPlatform;
      }

      // 转签平台
      if (is.existy(platformCodeStaff) && is.not.empty(platformCodeStaff)) {
        params.transfer_sign_platform = platformCodeStaff;
      }
      // 转签供应商
      if (is.existy(supplierIdsStaff) && is.not.empty(supplierIdsStaff)) {
        params.transfer_sign_supplier = supplierIdsStaff;
      }
      // 转签岗位
      if (is.existy(job) && is.not.empty(job)) {
        params.transfer_sign_post = job;
      }
      // 员工标签
      if (is.existy(staffTag) && is.not.empty(staffTag)) {
        params.work_label = staffTag;
      }
      // 归属team类型
      if (is.existy(payload.codeTeamType) && is.not.empty(payload.codeTeamType)) {
        params.cost_team_type = payload.codeTeamType;
      }
      // 归属team
      if (is.existy(payload.codeTeam) && is.not.empty(payload.codeTeam)) {
        params.cost_team_id = payload.codeTeam;
      }
      let resultStaff = {};
      let result;
      // 员工档案使用单独接口
      if (Number(fileType) === FileType.staff) {
        result = yield call(createEmployeeStaff, params);
        // 判断档案信息编辑成功后调档案接口
        if (is.existy(result) && is.truthy(result.ok)) {
          resultStaff = yield call(createContract, staffParams);
        }
      } else {
        result = yield call(createEmployee, params);
      }
      // 报错信息
      if (result && result.zh_message) {
        if (onLoading) {
          onLoading();
        }
        return message.error(result.zh_message);
      }
      if (Number(fileType) === FileType.staff) {
        // 组织架构编辑员工成功调用@彭悦
        if (departmentId && onSuccessOrganCallback && is.truthy(result.ok)) {
          return onSuccessOrganCallback();
        }
        // 判断数据是否为空
        if ((is.existy(result) && is.truthy(result.ok)) && (is.existy(resultStaff) && is.truthy(resultStaff.ok))) {
          // 判断是否是code系统
          if (payload.codeFlag === true) {
            if (payload.onSuccessCreatePageCallback) {
              payload.onSuccessCreatePageCallback(result);
            }
          } else {
            message.success('创建成功，页面即将跳转');
            return setTimeout(() => {
              window.location.href = `/#/Employee/Manage?fileType=${Number(fileType) === FileType.staff ? 'staff' : 'second'}`;
            }, 2000);
          }
        } else if ((is.existy(result) && result.message) || (is.existy(resultStaff) && resultStaff.message)) {
          if (onLoading) {
            onLoading();
          }
        } else if (!is.existy(result)) {
          if (onLoading) {
            onLoading();
          }
          return message.error('请求失败');
        }
      }
      // 判断数据是否为空
      if (is.existy(result) && is.truthy(result.ok)) {
        if (payload.codeFlag === true) {
          if (payload.onSuccessCreatePageCallback) {
            payload.onSuccessCreatePageCallback(result);
          }
        } else {
          message.success('创建成功，页面即将跳转');
          return setTimeout(() => {
            window.location.href = `/#/Employee/Manage?fileType=${fileType === `${FileType.second}` ?
              'second' : 'staff'}`;
          }, 2000);
        }
      } else if (is.existy(result) && result.message) {
        if (onLoading) {
          onLoading();
        }
      } else if (!is.existy(result)) {
        if (onLoading) {
          onLoading();
        }
        return message.error('请求失败');
      }
    },
    /**
     * 更新人员信息
     * @param {string}  staffId                 人员id
     * @param {number}  fileType                档案类型
     * @param {number}  industryType            所属场景
     * @param {string}  householdNumber         个户编号
     * @param {string}  unityNumber             个独编号
     * @param {string}  unityName               个独名称
     * @param {number}  householdType           个户类型
     * @param {string}  post                    职能
     * @param {string}  employeeId              员工编号
     * @param {string}  nowJob                  当前岗位
     * @param {string}  employeeLevel           级别
     * @param {string}  platformCode            平台
     * @param {string}   supplierIds            供应商
     * @param {string}   cityCodes              城市spelling
     * @param {string}   citys                  城市code
     * @param {array}   districts               商圈
     * @param {number}  isSplitWage             工资是否拆分
     * @param {number}  splitBase               拆分基数
     * @param {object}  securityPlace           社保缴纳地
     * @param {number}   signType               签约类型
     * @param {string}  entryDate               合作日期
     * @param {string}  signedDate              合同生效日期
     * @param {string}  contractBelong          合同甲方
     * @param {string}  signCycle               签约周期数
     * @param {number}  timeCycle               签约周期单位
     * @param {number}  contractType            合同类型
     * @param {string}  contractNumber          合同编号
     * @param {string}  formalDate              预计转正日期
     * @param {string}  realFormalDate          实际转正日期
     * @param {object}  contractPhotos          合同照片
     * @param {number}  idPaperworkType         证件类型（身份证件）
     * @param {string}  idPaperworkNumber       证件号码（身份证件）
     * @param {string}  platformIdCard          平台身份证号（身份证件）
     * @param {string}  customId                第三方平台ID（身份证件）
     * @param {object}  idFrontPhotos           证件正面照（身份证件）
     * @param {object}  idObversePhotos         证件反面照（身份证件）
     * @param {object}  idClosePhotos           手持证件半身照（身份证件）
     * @param {number}  healthPaperworkType     证件类型（健康证件）
     * @param {string}  healthPaperworkNumber   证件号码（健康证件）
     * @param {object}  healthFrontPhotos       证件正面照（健康证件）
     * @param {object}  healthObversePhotos     证件反面照（健康证件）
     * @param {object}  healthClosePhotos       手持证件半身照（健康证件）
     * @param {number}  drivePaperworkType      证件类型（驾驶证件）
     * @param {string}  drivePaperworkNumber    证件号码（驾驶证件）
     * @param {object}  driveFrontPhotos        证件正面照（驾驶证件）
     * @param {object}  driveObversePhotos      证件反面照（驾驶证件）
     * @param {object}  driveClosePhotos        手持证件半身照（驾驶证件）
     * @param {number}  recruitmentChannel      推荐渠道
     * @param {string}  referrerCompany         推荐公司
     * @param {string}  staffIdentityCard       推荐人身份证
     * @param {string}  staffIdentityName       推荐人姓名
     * @param {string}  staffIdentityPhone      推荐人手机号
     * @param {number}  referrerPlatform        推荐平台
     * @param {string}  name                    姓名
     * @param {number}  gender                  性别
     * @param {string}  birthday                出生日期
     * @param {string}  age                     年龄
     * @param {string}  national                民族
     * @param {number}  politicalStatus         政治面貌
     * @param {number}  maritalStatus           婚姻状况
     * @param {string}  birthplace              籍贯
     * @param {string}  accountLocation         户口所在地
     * @param {string}  oftenAddress            常居地
     * @param {string}  phone                   手机号
     * @param {string}  fixedTelephone          固定电话
     * @param {string}  email                   邮箱
     * @param {string}  education               学历
     * @param {string}  emergencyContact        紧急联系人
     * @param {string}  emergencyContactPhone   紧急联系人电话
     * @param {number}  height                  身高
     * @param {number}  weight                  体重
     * @param {string}  constellation           星座
     * @param {string}  hobby                   兴趣爱好
     * @param {string}  specialty               特长
     * @param {number}  highestEducation        最高学历
     * @param {string}  jobTitle                专业职称
     * @param {string}  foreignLanguage         外语及等级
     * @param {object}  degreeCertificatePhotos 学位证照片
     * @param {array}  learnExperience          学习经历
     * @param {array}  workExperience           工作经历
     * @param {number} collection               收款模式
     * @param {string} cardholder               代收人/持卡人姓名
     * @param {number} collectingGender         性别
     * @param {string} collectingPhone          代收人手机号
     * @param {string} identity                 代收人身份证号码
     * @param {string} account                  代收人银行卡账号
     * @param {string} bankName                 开户行
     * @param {string} branch                   支行名称
     * @param {object} address                  开户行所在地
     * @param {array} bankPositive              银行卡正面照
     * @param {array} prove                     代收证明
     * @param {array} agreement                 代收协议
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *updateEmployee({ payload }, { call, select }) {
      // state中的profile_type（档案类型）
      const stateFileType = yield select(state => state.employeeManage.employeeDetail.profile_type);
      const {
        staffId,                 // 人员id
        fileType,                // 档案类型
        industryType,            // 所属场景
        householdNumber,         // 个户编号
        unityNumber,             // 个独编号
        unityName,               // 个独名称
        householdType,           // 个户类型
        post,                    // 职能
        employeeId,              // 员工编号
        nowJob,                  // 当前岗位
        employeeLevel,           // 级别
        staffDepartments,        // 所属部门及岗位列表
        signType,                // 签约类型     -
        entryDate,               // 合作日期      -
        signedDate,              // 合同生效日期   -
        contractBelong,          // 合同甲方      -
        signCycle,               // 签约周期数      -
        timeCycle,               // 签约周期单位    -
        contractType,            // 合同类型      -
        contractNumber,          // 合同编号      -
        formalDate,              // 预计转正日期  -
        realFormalDate,          // 实际转正日期  -
        contractPhotos,          // 合同照片      -
        idPaperworkType,         // 证件类型（身份证件）
        idPaperworkNumber,       // 证件号码（身份证件）  -
        platformIdCard,          // 平台身份证号（身份证件）
        customId,                // 第三方平台ID（身份证件）
        idFrontPhotos,           // 证件正面照（身份证件）
        idObversePhotos,         // 证件反面照（身份证件）
        idClosePhotos,           // 手持证件半身照（身份证件）
        healthPaperworkType,     // 证件类型（健康证件）
        healthPaperworkNumber,   // 证件号码（健康证件）
        healthFrontPhotos,       // 证件正面照（健康证件）
        healthObversePhotos,     // 证件反面照（健康证件）
        drivePaperworkType,      // 证件类型（驾驶证件）
        drivePaperworkNumber,    // 证件号码（驾驶证件）
        driveFrontPhotos,        // 证件正面照（驾驶证件）
        driveObversePhotos,      // 证件反面照（驾驶证件）
        recruitmentChannel,      // 推荐渠道
        referrerCompany,         // 推荐公司
        staffIdentityCard,       // 推荐人身份证
        staffIdentityName,       // 推荐人姓名
        staffIdentityPhone,      // 推荐人手机号
        referrerPlatform,        // 推荐平台
        name,                    // 姓名
        gender,                  // 性别
        birthday,                // 出生日期
        age,                     // 年龄
        national,                // 民族
        politicalStatus,         // 政治面貌
        maritalStatus,           // 婚姻状况
        birthplace,              // 籍贯
        accountLocation,         // 户口所在地
        oftenAddress,            // 常居地
        phone,                   // 手机号
        fixedTelephone,          // 固定电话
        email,                   // 个人邮箱
        workEmail,               // 工作邮箱
        education,               // 学历
        emergencyContact,        // 紧急联系人
        emergencyContactPhone,   // 紧急联系人电话
        height,                  // 身高
        weight,                  // 体重
        constellation,           // 星座
        hobby,                   // 兴趣爱好
        specialty,               // 特长
        highestEducation,        // 最高学历
        jobTitle,                // 专业职称
        foreignLanguage,         // 外语及等级
        degreeCertificatePhotos, // 学位证照片
        learnExperience,         // 学习经历
        workExperience,          // 工作经历
        collection,              // 收款模式
        cardholder,              // 代收人/持卡人姓名
        collectingGender,        // 性别
        collectingPhone,         // 代收人手机号
        identity,                // 代收人身份证号码
        account,                 // 代收人银行卡账号
        bankName,                // 开户行
        branch,                  // 支行名称
        address,                 // 开户行所在地
        bankPositive,            // 银行卡正面照
        prove,                   // 代收证明
        agreement,               // 代收协议
        onLoading,               // loading
        // costCenter,             // 成本中心
        platformCode,           // 平台
        supplierIds,            // 供应商
        cityCodes,              // 城市spelling
        citys,                  // 城市code
        districts,              // 商圈
        isSplitWage,             // 工资是否拆分
        splitBase,               // 拆分基数
        securityPlace,           // 社保缴纳地
        oldAgeInsurance,          // 养老保险
        medicalInsurance,         // 医疗保险
        unemploymentInsurance,    // 失业保险
        occupationalInsurance,    // 工伤保险
        fertilityInsurance,       // 生育保险
        applicationChannelId,     // 应聘途径
        applicationCompanyName,   //  应聘公司名称
        applicationPlatform,      //  应聘渠道
        platformCodeStaff,        //  转签平台
        supplierIdsStaff,         //  转签供应商
        job,                      //  转签岗位
        departmentId, // 部门id
        onSuccessOrganCallback, // 组织架构成功回调
        staffTag, // 员工标签
        societyStartMonth,
        fundPlace,
        fundPlanName,
        planName,
        fundStartMonth,
        fundInsurance,
        planNameSocietyList,
        planNameFundList,
        bigMedicalCompany,
        bigMedicalPerson,
        otherCostCompany,
        otherCostPerson,
      } = payload;
      // 社保缴纳地没填
      // 员工五险只要有值，但是没有社保地，则返回错误
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        // 员工
        payload.flag
        &&
        // 五险有值
        (oldAgeInsurance || medicalInsurance || unemploymentInsurance
          || occupationalInsurance || fertilityInsurance)
        &&
        // 社保地值未填写完整
        (is.empty(securityPlace)
          || !securityPlace.province || !securityPlace.city)
      ) {
        if (onLoading) {
          onLoading();
        }
        return message.error('社保缴纳地没填');
      }
      // 员工有一金，但是没有公积金缴纳地，则返回错误
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        // 员工
        payload.flag
        &&
        fundInsurance
        &&
        // 社保地值未填写完整
        (is.empty(fundPlace)
        || !fundPlace.province || !fundPlace.city)
      ) {
        if (onLoading) {
          onLoading();
        }
        return message.error('公积金缴纳地没填');
      }
      // 社保如果只填了一个，则未填写完整
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        // 员工
        payload.flag
        &&
        // 社保地值未填写完整
        is.not.empty(securityPlace)
        &&
        (!securityPlace.province || !securityPlace.city)
      ) {
        if (onLoading) {
          onLoading();
        }
        return message.error('社保缴纳地需填写完整');
      }
      // 人员id
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        (is.not.existy(staffId) || is.empty(staffId))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('操作失败，人员id不能为空');
      }
      const params = {
        _id: staffId,            // 人员id
      };

      // 档案信息
      if (payload.setpActiveKey === EmployeeUpdatePageSetp.one) {
        params.storage_type = 3; // 上传类型
        params.bank_card_storage_type = 3;
      }
      // 预计转正日期必须晚于合作日期
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        formalDate && (formalDate.isBefore(entryDate) || formalDate.isSame(entryDate, 'day'))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('预计转正日期必须晚于合作/入职日期', 5);
      }
      // 实际转正日期必须晚于合作日期
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        realFormalDate && (realFormalDate.isBefore(entryDate) || realFormalDate.isSame(entryDate, 'day'))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('实际转正日期必须晚于合作/入职日期', 5);
      }
      // 合同生效日期必须等于或晚于合作日期
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        entryDate && entryDate.isAfter(signedDate)) {
        if (onLoading) {
          onLoading();
        }
        return message.error('合同生效日期必须等于或晚于合作日期', 5);
      }
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        ((healthFrontPhotos && healthFrontPhotos.keys[0] && healthObversePhotos && !healthObversePhotos.keys[0])
        || (healthFrontPhotos && !healthFrontPhotos.keys[0] && healthObversePhotos && healthObversePhotos.keys[0]))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('健康证件类型下的证件正反面均不能为空', 5);
      }
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        ((driveFrontPhotos && driveFrontPhotos.keys[0] && driveObversePhotos && !driveObversePhotos.keys[0])
        || (driveFrontPhotos && !driveFrontPhotos.keys[0] && driveObversePhotos && driveObversePhotos.keys[0]))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('驾驶证件类型下的证件正反面均不能为空', 5);
      }
      // 人员档案下纸质签约需上传身份证正面照
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${signType}` === `${SignContractType.paper}`
        && `${fileType}` === `${FileType.staff}`
        && (is.not.existy(idFrontPhotos) || is.empty(idFrontPhotos) || is.not.existy(idFrontPhotos.keys) || is.empty(idFrontPhotos.keys))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('身份证件正面照未上传', 5);
      }
      // 人员档案下纸质签约需上传身份证反面照
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        `${signType}` === `${SignContractType.paper}`
        && `${fileType}` === `${FileType.staff}`
        && (is.not.existy(idObversePhotos) || is.empty(idObversePhotos) || is.not.existy(idObversePhotos.keys) || is.empty(idObversePhotos.keys))) {
        if (onLoading) {
          onLoading();
        }
        return message.error('身份证件反面照未上传', 5);
      }
      const staffParams = {
        storage_type: 3,
      };             // 人员档案编辑的参数（需要单独接口）
      // 工作地
      if (is.existy(payload.workplace) && is.not.empty(payload.workplace)) {
        // 省份
        params.work_province_code = String(payload.workplace.province);
        // 城市
        params.work_city_code = String(payload.workplace.city);
      }
      // 档案类型
      if (is.existy(stateFileType) && is.not.empty(stateFileType)) {
        params.profile_type = Number(stateFileType);
      }
      // 签约类型
      if (is.existy(signType) && is.not.empty(signType)) {
        params.sign_type = Number(signType);
        staffParams.sign_type = Number(signType);
      }
      // 合作日期
      if (is.existy(entryDate) && is.not.empty(entryDate)) {
        params.entry_date = entryDate ? Number(entryDate.format('YYYYMMDD')) : '';
        staffParams.entry_date = entryDate ? Number(entryDate.format('YYYYMMDD')) : '';
      }
      // 合同生效日期
      if (is.existy(signedDate) && is.not.empty(signedDate)) {
        params.signed_date = signedDate ? Number(signedDate.format('YYYYMMDD')) : '';
        staffParams.signed_date = signedDate ? Number(signedDate.format('YYYYMMDD')) : '';
      }

      // 平台
      if (is.existy(platformCode) && is.not.empty(platformCode)) {
        params.platform_list = Array.isArray(platformCode) ? platformCode : [platformCode];
      }
      // 供应商
      if (is.existy(supplierIds) && is.not.empty(supplierIds)) {
        params.supplier_list = Array.isArray(supplierIds) ? supplierIds : [supplierIds];
      }
      // 城市spelling
      if (is.existy(cityCodes) && is.not.empty(cityCodes)) {
        params.city_spelling_list = Array.isArray(cityCodes) ? cityCodes : [cityCodes];
      }
      // 城市code
      if (is.existy(citys) && is.not.empty(citys)) {
        params.city_codes = Array.isArray(citys) ? citys : [citys];
      }

      // 商圈
      if (is.existy(districts) && is.not.empty(districts)) {
        params.biz_district_list = Array.isArray(districts) ? districts : [districts];
      }

      // 工资是否拆分
      if (is.existy(isSplitWage) && is.not.empty(isSplitWage)) {
        params.is_salary_split = Boolean(isSplitWage);
      }
      // 拆分基数
      if (is.existy(splitBase) && is.not.empty(splitBase)) {
        params.split_base = Number(splitBase) * 100;
      }
      // 社保缴纳地
      if (is.existy(securityPlace) && is.not.empty(securityPlace)) {
        params.social_security_payment_plac = securityPlace;
      }
      // 公积金缴纳地
      if (is.existy(fundPlace) && is.not.empty(fundPlace)) {
        params.provident_fund_payment_plac = fundPlace;
      }
      if (
        // 档案信息
        payload.setpActiveKey === EmployeeUpdatePageSetp.one &&
        payload.flag) {
        // 养老保险
        params.old_age_insurance = oldAgeInsurance ? Unit.exchangePriceToCent(oldAgeInsurance) : 0;
        // 医疗保险
        params.medical_insurance = medicalInsurance ? Unit.exchangePriceToCent(medicalInsurance) : 0;
        // 失业保险
        params.unemployment_insurance = unemploymentInsurance ? Unit.exchangePriceToCent(unemploymentInsurance) : 0;
        // 工伤保险
        params.occupational_insurance = occupationalInsurance ? Unit.exchangePriceToCent(occupationalInsurance) : 0;
        // 生育保险
        params.birth_insurance = fertilityInsurance ? Unit.exchangePriceToCent(fertilityInsurance) : 0;
        // 公积金
        params.provident_fund = fundInsurance ? Unit.exchangePriceToCent(fundInsurance) : 0;
        // 大额医疗公司
        params.big_medical_insurance_enterprise = bigMedicalCompany ? Unit.exchangePriceToCent(bigMedicalCompany) : 0;
        // 大额医疗个人
        params.big_medical_insurance_person = bigMedicalPerson ? Unit.exchangePriceToCent(bigMedicalPerson) : 0;
        // 其它费用公司
        params.other_enterprise_fee = otherCostCompany ? Unit.exchangePriceToCent(otherCostCompany) : 0;
        // 其它费用个人
        params.other_person_fee = otherCostPerson ? Unit.exchangePriceToCent(otherCostPerson) : 0;

        if (planNameSocietyList) {
          planNameSocietyList.map((item) => {
            if (item.name === planName) {
              params.insurance_program_id = item._id;
            }
          });
        }
        if (planNameFundList) {
          planNameFundList.map((item) => {
            if (item.name === fundPlanName) {
              params.provident_fund_program_id = item._id;
            }
          });
        }
      }
      if (is.existy(societyStartMonth) && is.not.empty(societyStartMonth)) {
        // 社保开始月份
        params.insurance_began_month = moment(societyStartMonth).format('YYYYMM');
      }
      if (is.existy(fundStartMonth) && is.not.empty(fundStartMonth)) {
        // 公积金开始月份
        params.provident_fund_began_month = moment(fundStartMonth).format('YYYYMM');
      }
      // 合同甲方
      if (is.existy(contractBelong) && is.not.empty(contractBelong)) {
        params.contract_belong_id = contractBelong;
        staffParams.contract_belong_id = contractBelong;
      }
      // 签约周期数
      if (is.existy(signCycle) && is.not.empty(signCycle)) {
        params.sign_cycle = Number(signCycle);
        staffParams.sign_cycle = Number(signCycle);
      }
      // 签约周期单位
      if (is.existy(timeCycle) && is.not.empty(timeCycle)) {
        params.sign_cycle_unit = Number(timeCycle);
        staffParams.sign_cycle_unit = Number(timeCycle);
      }
      // 合同类型
      if (is.existy(contractType) && is.not.empty(contractType)) {
        params.contract_type = Number(contractType);
        staffParams.contract_type = Number(contractType);
      }
      // 证件类型（身份证件）
      if (is.existy(idPaperworkType) && is.not.empty(idPaperworkType)) {
        params.identity_certificate_type = Number(idPaperworkType);
      }
      // 证件号码（身份证件）
      if (is.existy(idPaperworkNumber) && is.not.empty(idPaperworkNumber)) {
        params.identity_card_id = idPaperworkNumber;
        staffParams.identity_card_id = idPaperworkNumber;
      }
      // 推荐渠道
      if (is.existy(recruitmentChannel) && is.not.empty(recruitmentChannel)) {
        params.recruitment_channel_id = Number(recruitmentChannel);
      }
      // 姓名
      if (is.existy(name) && is.not.empty(name)) {
        params.name = name;
      }
      // 性别
      if (is.existy(gender) && is.not.empty(gender)) {
        params.gender_id = Number(gender);
      }
      // 年龄
      if (is.existy(age) && is.not.empty(age)) {
        params.age = age;
      }
      // 民族
      if (is.existy(national) && is.not.empty(national)) {
        params.national = national;
      }
      // 籍贯
      if (is.existy(birthplace) && is.not.empty(birthplace)) {
        params.birth_place = birthplace;
      }
      // 常居地
      if (is.existy(oftenAddress) && is.not.empty(oftenAddress)) {
        params.often_address = oftenAddress;
      }
      // 手机号
      if (is.existy(phone) && is.not.empty(phone)) {
        params.phone = phone;
      }
      // 紧急联系人电话
      if (is.existy(emergencyContactPhone) && is.not.empty(emergencyContactPhone)) {
        params.emergency_contact_phone = emergencyContactPhone;
      }
      // 所属场景
      if (is.existy(industryType) && is.not.empty(industryType)) {
        params.industry_code = Number(industryType);
      }
      // 个户类型
      if (is.existy(householdType) && is.not.empty(householdType)) {
        params.individual_type = Number(householdType);
      }
      // 职能
      if (is.existy(post) && is.not.empty(post)) {
        params.office = post;
      }
      // 个户编号
      if (is.existy(householdNumber) && is.not.empty(householdNumber)) {
        params.personal_company_no = householdNumber;
      }
      // 个独编号
      if (is.existy(unityNumber) && is.not.empty(unityNumber)) {
        params.company_no = unityNumber;
      }
      // 个独名称
      if (is.existy(unityName) && is.not.empty(unityName)) {
        params.company_name = unityName;
      }
      // 员工编号
      if (is.existy(employeeId) && is.not.empty(employeeId)) {
        params.staff_no = employeeId;
      }
      // 当前岗位
      if (is.existy(nowJob) && is.not.empty(nowJob)) {
        params.station = nowJob;
      }
      // 级别
      if (is.existy(employeeLevel) && is.not.empty(employeeLevel)) {
        params.station_level = employeeLevel;
      }
      // 所属部门就岗位列表
      if (is.existy(staffDepartments) && is.not.empty(staffDepartments)) {
        const compareId = [];
        params.department_job_relation_list = staffDepartments.map((item) => {
          if (compareId.indexOf(item.podepartmentJobRelationId) === -1) {
            compareId.push(item.podepartmentJobRelationId);
          }
          return {
            department_id: item.department,
            major_job_id: item.post,
            department_job_relation_id: item.podepartmentJobRelationId,
            job_flag: Boolean(item.isSelected),
            is_organization: Boolean(item.isOrganization),
          };
        });
        if (staffDepartments.length !== compareId.length) {
          if (onLoading) {
            onLoading();
          }
          return message.error('选择的的部门和岗位不能重复');
        }
      }
      // 合同编号
      if (is.existy(contractNumber) && is.not.empty(contractNumber)) {
        params.contract_no = contractNumber;
        staffParams.contract_no = contractNumber;
      }
      // 转正日期
      if (is.existy(formalDate) && is.not.empty(formalDate)) {
        params.regular_date = formalDate ? Number(formalDate.format('YYYYMMDD')) : '';
        staffParams.regular_date = formalDate ? Number(formalDate.format('YYYYMMDD')) : '';
      }
      // 实际转正日期
      if (is.existy(realFormalDate) && is.not.empty(realFormalDate)) {
        params.actual_regular_date = realFormalDate ? Number(realFormalDate.format('YYYYMMDD')) : '';
        staffParams.actual_regular_date = realFormalDate ? Number(realFormalDate.format('YYYYMMDD')) : '';
      }
      // 平台身份证号（身份证件）
      if (is.existy(platformIdCard) && is.not.empty(platformIdCard)) {
        params.associated_identity_card_id = platformIdCard;
      }
      // 第三方平台ID（身份证件））
      if (is.existy(customId) && is.not.empty(customId)) {
        // 第三方平台ID 去掉空值情况
        params.custom_id = customId;
      }
      // 合同照片
      if (is.existy(contractPhotos) && is.not.empty(contractPhotos)
        && is.existy(contractPhotos.keys) && is.not.empty(contractPhotos.keys)) {
        params.contract_photo_list = contractPhotos.keys;
        staffParams.contract_photo_list = contractPhotos.keys;
      }
      // 证件正面照（身份证件）
      if (is.existy(idFrontPhotos) && is.not.empty(idFrontPhotos)
        && is.existy(idFrontPhotos.keys) && is.not.empty(idFrontPhotos.keys)) {
        params.identity_card_front = idFrontPhotos.keys[0];
      }
      // 证件反面照（身份证件）
      if (is.existy(idObversePhotos) && is.not.empty(idObversePhotos)
        && is.existy(idObversePhotos.keys) && is.not.empty(idObversePhotos.keys)) {
        params.identity_card_back = idObversePhotos.keys[0];
      }
      // 手持证件半身照（身份证件）
      if (is.existy(idClosePhotos) && is.not.empty(idClosePhotos)
        && is.existy(idClosePhotos.keys) && is.not.empty(idClosePhotos.keys)) {
        params.identity_card_in_hand = idClosePhotos.keys[0];
      }
      // 银行卡正面照
      if (is.existy(bankPositive) && is.not.empty(bankPositive)
        && is.existy(bankPositive.keys) && is.not.empty(bankPositive.keys)) {
        params.bank_card_front = bankPositive.keys[0];
      }
      // 代收协议照片
      if (is.existy(agreement) && is.not.empty(agreement)
        && is.existy(agreement.keys) && is.not.empty(agreement.keys)) {
        params.collect_protocol = agreement.keys;
      }
      // 代收证明照片
      if (is.existy(prove) && is.not.empty(prove)
        && is.existy(prove.keys) && is.not.empty(prove.keys)) {
        params.collect_provement = prove.keys;
      }
      // 证件类型（健康证件）
      if (is.existy(healthPaperworkType) && is.not.empty(healthPaperworkType)) {
        params.health_certificate_type = healthPaperworkType ? Number(healthPaperworkType) : PaperworkType.health;
      }
      // 健康证件号码（健康证件）
      if (is.existy(healthPaperworkNumber) && is.not.empty(healthPaperworkNumber)) {
        params.health_certificate_no = healthPaperworkNumber;
      }
      // 证件类型（驾驶证件）
      if (is.existy(drivePaperworkType) && is.not.empty(drivePaperworkType)) {
        params.drive_certificate_type = drivePaperworkType ? Number(drivePaperworkType) : PaperworkType.drive;
      }
      // 证件号码（驾驶证件）
      if (is.existy(drivePaperworkNumber) && is.not.empty(drivePaperworkNumber)) {
        params.drive_certificate_no = drivePaperworkNumber;
      }
      // 推荐公司
      if (is.existy(referrerCompany) && is.not.empty(referrerCompany)) {
        params.referrer_company_id = referrerCompany;
      }
      // 推荐平台
      if (is.existy(referrerPlatform) && is.not.empty(referrerPlatform)) {
        params.referrer_platform = Number(referrerPlatform);
      }
      // 推荐人姓名
      if (is.existy(staffIdentityName) && is.not.empty(staffIdentityName)) {
        params.referrer_name = staffIdentityName;
      }
      // 推荐人身份证
      if (is.existy(staffIdentityCard) && is.not.empty(staffIdentityCard)) {
        params.referrer_identity_no = staffIdentityCard;
      }
      // 推荐人手机号
      if (is.existy(staffIdentityPhone) && is.not.empty(staffIdentityPhone)) {
        params.referrer_phone = staffIdentityPhone;
      }
      // 出生日期
      if (is.existy(birthday) && is.not.empty(birthday)) {
        params.born_in = birthday ? Number(birthday.format('YYYYMMDD')) : '';
      }
      // 政治面貌
      if (is.existy(politicalStatus) && is.not.empty(politicalStatus)) {
        params.politics_status = Number(politicalStatus);
      }
      // 婚姻状况
      if (is.existy(maritalStatus) && is.not.empty(maritalStatus)) {
        params.marital_status = Number(maritalStatus);
      }
      // 户口所在地
      if (is.existy(accountLocation) && is.not.empty(accountLocation)) {
        params.native_place = accountLocation;
      }
      // 固定电话
      if (is.existy(fixedTelephone) && is.not.empty(fixedTelephone)) {
        params.telephone = fixedTelephone;
      }
      // 邮箱
      if (is.existy(email) && is.not.empty(email)) {
        params.email = email;
      }
      // 邮箱
      if (is.existy(workEmail) && is.not.empty(workEmail)) {
        params.work_email = workEmail;
      }

      // 学历
      if (is.existy(education) && is.not.empty(education)) {
        params.education = education;
      }
      // 紧急联系人
      if (is.existy(emergencyContact) && is.not.empty(emergencyContact)) {
        params.emergency_contact = emergencyContact;
      }
      // 身高
      if (is.existy(height) && is.not.empty(height)) {
        params.height = height;
      }
      // 体重
      if (is.existy(weight) && is.not.empty(weight)) {
        params.weight = weight;
      }
      // 星座
      if (is.existy(constellation) && is.not.empty(constellation)) {
        params.constellation = constellation;
      }
      // 兴趣爱好
      if (is.existy(hobby) && is.not.empty(hobby)) {
        params.interest = hobby;
      }
      // 特长
      if (is.existy(specialty) && is.not.empty(specialty)) {
        params.speciality = specialty;
      }
      // 最高学历
      if (is.existy(highestEducation) && is.not.empty(highestEducation)) {
        params.highest_education = Number(highestEducation);
      }
      // 专业职称
      if (is.existy(jobTitle) && is.not.empty(jobTitle)) {
        params.professional = jobTitle;
      }
      // 收款模式
      if (is.existy(collection) && is.not.empty(collection)) {
        params.payment_type = collection;
      }
      // 持卡人姓名
      if (is.existy(cardholder) && is.not.empty(cardholder)) {
        params.card_holder_name = cardholder;
      }
      // 性别
      if (is.existy(collectingGender) && is.not.empty(collectingGender)) {
        params.collect_sex = Number(collectingGender);
      }
      // 代收人手机号
      if (is.existy(collectingPhone) && is.not.empty(collectingPhone)) {
        params.collect_phone = collectingPhone;
      }
      // 代收人身份证号码
      if (is.existy(identity) && is.not.empty(identity)) {
        params.collect_id_card_no = identity;
      }
      // 代收人银行卡账号
      if (is.existy(account) && is.not.empty(account)) {
        params.card_holder_bank_card_no = account;
      }
      // 开户行
      if (is.existy(bankName) && is.not.empty(bankName)) {
        params.bank_branch = bankName;
      }
      // 支行名称
      if (is.existy(branch) && is.not.empty(branch)) {
        params.bank_branch_name = branch;
      }
      // 开户行所在地
      if (is.existy(address) && is.not.empty(address)) {
        const bankAddress = [];
        bankAddress.push(address.province, address.city);
        params.bank_location = bankAddress;
      }
      // 外语及等级
      if (is.existy(foreignLanguage) && is.not.empty(foreignLanguage)) {
        params.language_level = foreignLanguage;
      }

      // 学位证照片
      if (is.existy(degreeCertificatePhotos) && is.not.empty(degreeCertificatePhotos)
        && is.existy(degreeCertificatePhotos.keys) && is.not.empty(degreeCertificatePhotos.keys)) {
        params.degree = degreeCertificatePhotos.keys;
      }
      // 学习经历
      if (is.existy(learnExperience) && is.not.empty(learnExperience)) {
        params.academy_list = learnExperience.map((item) => {
          return {
            institution_name: item.institutionName || '', // 院校名称
            education: item.dynamicEducation || '',       // 学历
            profession: item.profession || '',            // 专业
            start_time: item.period && item.period[0] ? item.period[0].format('YYYYMMDD') : '', // 开始时间
            end_time: item.period && item.period[1] ? item.period[1].format('YYYYMMDD') : '',   // 结束时间
          };
        });
      }
      // 工作经历
      if (is.existy(workExperience) && is.not.empty(workExperience)) {
        for (let i = 0; i < workExperience.length; i += 1) {
          if (workExperience[i].witnessPhone && !/^\d{11}$/.test(workExperience[i].witnessPhone)) {
            if (onLoading) {
              onLoading();
            }
            return message.error(`工作经历中第${i + 1}条数据，证明人电话格式错误`);
          }
        }
        params.work_experience = workExperience.map((item) => {
          return {
            employer: item.employer || '',          // 工作单位
            position: item.workPosition || '',      // 职位
            certifier_name: item.witness || '',     // 证明人姓名
            proof_phone: item.witnessPhone || '',   // 证明人电话
            work_start_time: item.workPeriod && item.workPeriod[0] ? item.workPeriod[0].format('YYYYMMDD') : '', // 工作开始时间
            work_end_time: item.workPeriod && item.workPeriod[1] ? item.workPeriod[1].format('YYYYMMDD') : '',   // 工作结束时间
          };
        });
      }
      // 成本中心
      // if (is.existy(costCenter) && is.not.empty(costCenter)) {
      //   params.cost_center_type = Number(costCenter);
      // } else {
      //   params.cost_center_type = null;
      // }

      // 应聘途径
      if (is.existy(applicationChannelId) && is.not.empty(applicationChannelId)) {
        params.application_channel_id = Number(applicationChannelId);
      }
      // 应聘公司名称
      if (is.existy(applicationCompanyName) && is.not.empty(applicationCompanyName)) {
        params.application_company_name = applicationCompanyName;
      }
      // 应聘途径的应聘渠道
      if (is.existy(applicationPlatform) && is.not.empty(applicationPlatform)) {
        params.application_platform = applicationPlatform;
      }

      // 转签平台
      if (is.existy(platformCodeStaff) && is.not.empty(platformCodeStaff)) {
        params.transfer_sign_platform = platformCodeStaff;
      }
      // 转签供应商
      if (is.existy(supplierIdsStaff) && is.not.empty(supplierIdsStaff)) {
        params.transfer_sign_supplier = supplierIdsStaff;
      }
      // 转签岗位
      if (is.existy(job) && is.not.empty(job)) {
        params.transfer_sign_post = job;
      }
      // 员工标签
      if (is.existy(staffTag) && is.not.empty(staffTag)) {
        params.work_label = staffTag;
      }

      // 归属team类型
      if (is.existy(payload.codeTeamType) && is.not.empty(payload.codeTeamType)) {
        params.cost_team_type = payload.codeTeamType;
      }
      // 归属team
      if (is.existy(payload.codeTeam) && is.not.empty(payload.codeTeam)) {
        params.cost_team_id = payload.codeTeam;
      }
      let resultStaff = {};
      let result;
      // 员工档案使用单独接口
      if (`${stateFileType}` === `${FileType.staff}`) {
        result = yield call(updateEmployeeStaff, params);
        // 档案信息并且员工编辑成功后调档案接口
        if (payload.setpActiveKey === EmployeeUpdatePageSetp.one && is.existy(result) && is.truthy(result.ok)) {
          resultStaff = yield call(updateStaffContract, staffParams);
        }
      } else {
        result = yield call(updateEmployee, params);
      }
      // 报错信息
      if (result && result.zh_message) {
        if (onLoading) {
          onLoading();
        }
        return message.error(result.zh_message);
      }
      // 判断数据是否为空
      if (`${stateFileType}` === `${FileType.staff}`) {
        // 组织架构编辑员工成功调用@彭悦
        if (departmentId && onSuccessOrganCallback && is.truthy(result.ok)) {
          return onSuccessOrganCallback();
        }
        if ((is.existy(result) && is.truthy(result.ok)) && (is.existy(resultStaff) && is.truthy(resultStaff.ok))) {
          // 判断是否是创建页面并且还是档案信息
          if (payload.isCreate === true && payload.setpActiveKey === EmployeeUpdatePageSetp.one) {
            if (payload.onSuccessCreatePageCallback) {
              payload.onSuccessCreatePageCallback(result);
            }
          } else {
            message.success('更新成功，页面即将跳转');
            return setTimeout(() => {
              window.location.href = `/#/Employee/Manage?fileType=${(`${stateFileType}` === `${FileType.second}` || `${stateFileType}` === `${FileType.first}`) ? 'second' : 'staff'}`;
            }, 2000);
          }
        } else if ((is.existy(result) && result.message) || (is.existy(resultStaff) && resultStaff.message)) {
          if (onLoading) {
            onLoading();
          }
        } else if (!is.existy(result)) {
          if (onLoading) {
            onLoading();
          }
          return message.error('请求失败');
        }
      }
      if (is.existy(result) && is.truthy(result.ok)) {
        // 判断是否是创建页面并且还是档案信息
        if (payload.isCreate === true && payload.setpActiveKey === EmployeeUpdatePageSetp.one) {
          if (payload.onSuccessCreatePageCallback) {
            payload.onSuccessCreatePageCallback(result);
          }
        } else {
          message.success('更新成功，页面即将跳转');
          return setTimeout(() => {
            window.location.href = `/#/Employee/Manage?fileType=${(`${stateFileType}` === `${FileType.second}` || `${stateFileType}` === `${FileType.first}`) ? 'second' : 'staff'}`;
          }, 2000);
        }
      } else if (is.existy(result) && result.message) {
        if (onLoading) {
          onLoading();
        }
      } else if (!is.existy(result)) {
        if (onLoading) {
          onLoading();
        }
        return message.error('请求失败');
      }
    },

    /**
     * 获取归属team类型
     */
    *fetchGetTeamTypes({ payload }, { call, put }) {
      const params = {};
      const result = yield call(fetchGetTeamTypes, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      // 判断数据是否为空
      if (Array.isArray(result)) {
        yield put({ type: 'reduceGetTeamTypes', payload: result });
      }
    },
    /**
     * 获取归属team
     */
    *fetchGetTeams({ payload }, { call, put }) {
      const params = {};
      // 归属team类型[list]
      if (is.existy(payload.teamTypes) && is.not.empty(payload.teamTypes)) {
        params.team_type_list = Array.isArray(payload.teamTypes) ? payload.teamTypes : [payload.teamTypes];
      }
      const result = yield call(fetchGetTeams, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 判断数据是否为空
      if (Array.isArray(result)) {
        yield put({ type: 'reduceGetTeams', payload: { result, namespace: payload.namespace ? payload.namespace : 'default' } });
      }
    },
    /**
     * 导出人员数据
     * @param {number}  state 状态
     * @param {string}  name  姓名
     * @param {string}  phone  手机号
     * @param {string}  personIdCard  身份证号
     * @param {string}  platformId  第三方平台骑士id
     * @param {string}  platformIdCard  第三方平台身份证号
     * @param {string}  workType  工作性质
     * @param {string}  contracts  合同归属
     * @param {string}  positions  职位列表
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @param {number}  account_id 账户id
     * @param {string}  department  部门
     * @param {string}  post  岗位
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *exportEmployees({ payload }, { call }) {
      // 公共文本参数
      const {
        fileType,                    // 人员页面类型
      } = payload;
      // 默认参数
      const params = commentPersonnelparams(payload, 'download');
      let result;
      // 员工档案使用单独接口
      if (`${FileType[fileType]}` === `${FileType.staff}`) {
        result = yield call(exportEmployeesStaff, params);
      } else {
        result = yield call(exportEmployees, params);
      }
      if (result && is.existy(result.task_id)) {
        message.success(`创建下载任务成功，任务id：${result.task_id}`);
      } else {
        message.error(result.message);
      }
    },

    /**
     * 导出团队数据
     * @param {array}   suppliers  供应商
     * @param {array}   platforms  平台
     * @param {array}   cities     城市
     * @param {array}   districts  商圈
     * @param {array}   filterDistricts,      // 是否过滤禁用商圈数据
     * @param {array}   filterArchives,       // 是否过滤解约档案
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *downloadStaffContractTeam({ payload }, { call }) {
      // 劳动者公共文本参数
      const {
        platforms,                   // 平台
        suppliers,                   // 供应商
        cities,                      // 城市
        districts,                   // 商圈
        fileType,                    // 档案类型
        filterDistricts,      // 是否过滤禁用商圈数据
        filterArchives,       // 是否过滤解约档案
        staffTeamRank,        // 团队中的身份
      } = payload;

      // 默认参数
      const params = {
        profile_type: FileType[fileType],
      };

      // 团队中的身份
      if (is.existy(staffTeamRank) && is.not.empty(staffTeamRank) && is.array(staffTeamRank)) {
        params.role = staffTeamRank;
      }
      // 平台
      if (is.existy(platforms) && is.not.empty(platforms) && is.array(platforms)) {
        params.work_platform_list = platforms;
      }
      // 供应商
      if (is.existy(suppliers) && is.not.empty(suppliers) && is.array(suppliers)) {
        params.work_supplier_list = suppliers;
      }
      // 城市
      if (is.existy(cities) && is.not.empty(cities) && is.array(cities)) {
        params.work_city_codes = cities;
      }
      // 商圈
      if (is.existy(districts) && is.not.empty(districts) && is.array(districts)) {
        params.work_biz_district_list = districts;
      }
      // 过滤禁用商圈
      if (is.existy(filterDistricts) && is.not.empty(filterDistricts)) {
        params.is_filter_disable_district = filterDistricts;
      }
      // 过滤已退出成员
      if (is.existy(filterArchives) && is.not.empty(filterArchives)) {
        params.is_filter_departure_staff = filterArchives;
      }
      // 归属team类型
      if (is.existy(payload.codeTeamType) && is.not.empty(payload.codeTeamType)) {
        params.cost_team_type = payload.codeTeamType;
      }
      // 归属team
      if (is.existy(payload.codeTeam) && is.not.empty(payload.codeTeam)) {
        params.cost_team_id = payload.codeTeam;
      }

      const result = yield call(downloadStaffContractTeam, params);
      if (result && is.existy(result.task_id)) {
        message.success(`创建下载任务成功，任务id：${result.task_id}`);
      } else {
        message.error(result.message);
      }
    },
    /**
     * 办理离职
     */
    *employeeOperateDeparture({ payload = {} }, { call }) {
      const {
        staffId, // 员工id
        departureDate, // 离职日期
        jobRecipient, // 工作接收人
        onSuccessCallback,
      } = payload;

      if (is.not.existy(staffId) || is.empty(staffId)) {
        return message.error('操作失败，人员Id不能为空');
      }
      if (is.not.existy(departureDate) || is.empty(departureDate)) {
        return message.error('操作失败，离职日期不能为空');
      }
      if (is.not.existy(jobRecipient) || is.empty(jobRecipient)) {
        return message.error('操作失败，工作接收人不能为空');
      }

      const params = {
        employee_id: staffId,
        apply_departure_date: Number(departureDate),
        receiver_id: jobRecipient,
      };
      const result = yield call(employeeOperateDeparture, params);
      if (result && result.ok) {
        message.success('提交离职成功');
        onSuccessCallback && onSuccessCallback();
      }
    },

    /**
     * 完成离职
     * @param {string}  staff_id 人员id
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *employeeRelease({ payload }, { call }) {
      const {
        staffId,
        departureDate,
        staffName,
      } = payload;
      if (is.not.existy(staffId) || is.empty(staffId)) {
        return message.error('操作失败，人员Id不能为空');
      }
      if (is.not.existy(departureDate) || is.empty(departureDate)) {
        return message.error('操作失败，离职日期不能为空');
      }

      const params = {
        staff_id: staffId, // 人员id
        departure_date: Number(departureDate), // 离职日期
      };

      const result = yield call(employeeRelease, params);

      // 判断数据是否为空
      if (is.existy(result) && is.truthy(result.ok)) {
        // 回调函数
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
        if (staffName) {
          message.success('离职成功');
          return result;
        }
        message.success('离职成功');
        return result;
      } else if (result.zh_message) {
        message.error(result.zh_message);
        return result;
      }
    },
    /**
     * 拒绝人员离职
     * @param {string}  staff_id 人员id
     * @param {number}  state   在职
     * @param {boolean} option   离职批准
     * @param {string}  permission_id  许可证id
     * @param {string}  departure_date  离职时间
     * @param {string}  departure_approver_account_id  离职id
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *rejectEmployeeResign({ payload }, { call }) {
      if (is.not.existy(payload.employeeId) || is.empty(payload.employeeId)) {
        return message.error('操作失败，人员Id不能为空');
      }

      const params = {
        staff_id: payload.employeeId, // 人员id
        state: DutyState.onDuty,      // 在职
        option: false,                // false 为离职审批
        permission_id: Modules.OperateEmployeeResignVerifyButton.id,
        departure_approver_account_id: authorize.account.id,
      };

      const result = yield call(updateEmployee, params);

      // 判断数据是否为空
      if (is.existy(result) && is.truthy(result.ok)) {
        message.success('更新成功');
        // 回调函数
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
      }
    },
    /**
     * 根据姓名，手机号，职位，获取在职人员数据
     * @param {string}  name  姓名
     * @param {string}  phone  手机号
     * @param {string}  positions  职位
     * @param {number}  state   人员状态为在职
     * @param {number}  limit   一次性全部加载完成
     * @param {number}  page    默认页
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *fetchEmployeesByInfo({ payload }, { put }) {
      if (is.not.existy(payload.name) || is.empty(payload.name)) {
        return message.error('操作失败，用户名不能为空');
      }
      if (is.not.existy(payload.phone) || is.empty(payload.phone)) {
        return message.error('操作失败，手机号不能为空');
      }
      if (is.not.existy(payload.positions) || is.empty(payload.positions)) {
        return message.error('操作失败，职位信息错误');
      }

      const { name, phone, positions } = payload;
      const parmas = {
        name,         // 姓名
        phone,        // 手机
        positions,    // 职位
        state: DutyState.onDuty,      // 人员状态为在职
        limit: 500,   // 一次性全部加载完成
        page: 1,
      };
      yield put({ type: 'fetchEmployees', payload: parmas });
    },

    /**
     * 获取人员详情信息
     * @param {string}  permission_id  权限id
     * @param {string}  staff_id       人员id
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *fetchEmployeeDetail({ payload }, { call, put }) {
      const {
        employeeId,
        fileType,
        name,
        phone,
        identityCardId,
        onSuccessCallback,
      } = payload;

      const params = {};

      // 员工详情可以用_id获取，也可以用身份证号获取
      employeeId && (params._id = employeeId);
      fileType && (params.profile_type = FileType[fileType]);

      // 姓名
      name && (params.name = name.replace(/\s*/g, ''));
      // 手机号
      phone && (params.phone = phone);

      // 身份证号
      identityCardId && (params.identity_card_id = identityCardId);
      let result;
      // 员工档案使用单独接口
      if (`${FileType[fileType]}` === `${FileType.staff}`) {
        result = yield call(fetchEmployeeDetailStaff, params);
      } else {
        result = yield call(fetchEmployeeDetail, params);
      }

      // 二次入职查询回调，后端没有具体
      if (!result.zh_message) {
        onSuccessCallback && onSuccessCallback(result);
      }

      // 判断数据是否为空
      if (is.existy(result) && is.not.empty(result)) {
        yield put({ type: 'reduceEmployeeDetail', payload: result });
      }
    },
    /**
     * 重置人员数据
     * @param {number}  fileType 人员页面类型
     * @todo 接口需升级优化
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *resetEmployees({ payload }, { put }) {
      // 人员页面类型
      const { fileType } = payload;
      if (fileType === 'second') {
        yield put({ type: 'reduceEmployeesSecond', payload: {} });
      } else {
        yield put({ type: 'reduceEmployees', payload: {} });
      }
    },

    /**
     * 重置根据身份证号查询的人员数据
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *resetEmployeesIdCard({ payload }, { put }) {
      yield put({ type: 'reduceIdCardEmployees', payload: {} });
    },

    /**
     * 重置全部人员数据
     * @todo 接口需升级优化
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *resetEmployeesAll({ payload }, { put }) {
      yield put({ type: 'reduceEmployeesAll', payload: {} });
    },

    /**
     * 上传照片
     * @param {object} file 上传的文件
     * @param {function} onSuccessCallback 上传成功回调
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *uploadFile({ payload }, { call }) {
      const {
        file,
        onSuccessCallback,
      } = payload;
      if (is.not.existy(file) || is.empty(file)) {
        return message.error('上传文件不能为空');
      }
      // 获取上传的token
      const tokenResult = yield call(getUploadToken, { file_name: 'defaultFileName' });
      if (is.truthy(tokenResult.ok) && is.existy(tokenResult.token) && is.existy(tokenResult.path)) {
        // form形式上传文件
        const formdata = new window.FormData();
        formdata.append('key', tokenResult.path);
        formdata.append('token', tokenResult.token);
        formdata.append('file', payload.file);
        const result = yield call(uploadFileToQiNiu, formdata);
        if (is.not.existy(result.key) || is.empty(result.key)) {
          return message.error('上传文件失败');
        }
        // 文件名称
        const name = payload.file.name;
        // 文件唯一标示（页面显示使用）
        const uid = result.key;
        // 请求返回的hash
        const hash = result.hash;
        // 根据key获取相应的文件地址
        const fileURL = yield call(fetchFileURL, { target_id: result.key, name });
        if (is.not.truthy(fileURL.ok)) {
          return message.error('获取上传文件地址失败');
        }
        // 已经处理好的文件信息
        const meta = {
          uid,
          hash,
          status: 'done',
          name: fileURL.name,
          url: fileURL.url,
        };
        // 添加成功回调
        if (onSuccessCallback) {
          onSuccessCallback(meta);
        }
      } else {
        return message.error('上传文件失败，无法获取上传token');
      }
    },

    /**
     * 新增第三方id
     * @param {}
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *createEmployeeId({ payload }, { call, put }) {
      const result = yield call(createEmployeeId, payload);
      if (result.zh_message) {
        message.error(result.zh_message);
      } else {
        message.success('新增成功');
        yield put({ type: 'fetchEmployeeDetail', payload: { employeeId: payload._id } });
      }
    },

    /**
     * 编辑第三方id
     * @param {}
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *editEmployeeId({ payload }, { call, put }) {
      const params = {};
      if (payload.staff_id) {
        params.staff_id = payload.staff_id;
      }
      if (payload._id) {
        params._id = payload._id;
      }
      if (payload.custom_id) {
        params.custom_id = payload.custom_id;
      }
      if (payload.start_time) {
        params.start_time = payload.start_time;
      }
      if (payload.end_time) {
        params.end_time = payload.end_time;
      }
      const result = yield call(editEmployeeId, params);
      if (result.zh_message) {
        message.error(result.zh_message);
      } else {
        message.success('编辑成功');
        yield put({ type: 'fetchEmployeeDetail', payload: { employeeId: payload.employeeId } });
      }
    },

    /**
     * 银行卡信息识别
     * @param {}
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *fetchBankCardIdentification({ payload }, { call, put }) {
      const params = {
        bank_card_storage_type: 3,
      };
      // 银行卡正面照
      if (is.existy(payload.bankgPositive) && is.not.empty(payload.bankgPositive)
        && is.existy(payload.bankgPositive.keys) && is.not.empty(payload.bankgPositive.keys)) {
        params.bank_card_front = payload.bankgPositive.keys[0];
      }
      const result = yield call(fetchBankCardIdentification, params);

      if (result.ok) {
        yield put({ type: 'reduceBankCardIdentification', payload: result });
        // 回调函数
        if (payload.onSuccessCallback) {
          payload.onSuccessCallback(result);
        }
      }
      if (result.ok === false) {
        // 错误回调
        payload.onErrorCallback && payload.onErrorCallback();
      }
    },

    /**
      * 重置银行卡信息识别
      * @param {}
      * @memberof module:model/employee/manage~employee/manage/effects
      */
    *resetBankCardIdentification({ payload }, { put }) {
      yield put({ type: 'reduceBankCardIdentification', payload: {} });
    },

    /**
     * 终止第三方id
     * @param {}
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *stopEmployeeId({ payload }, { call, put }) {
      const params = {};
      if (payload.staff_id) {
        params.staff_id = payload.staff_id;
      }
      if (payload._id) {
        params._id = payload._id;
      }
      if (payload.end_time) {
        params.end_time = payload.end_time;
      }
      const result = yield call(stopEmployeeId, params);
      if (result.zh_message) {
        message.error(result.zh_message);
      } else {
        message.success('终止成功');
        yield put({ type: 'fetchEmployeeDetail', payload: { employeeId: payload.employeeId } });
      }
    },

    /**
     * 删除第三方id
     * @param {}
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *removeEmployeeId({ payload }, { call, put }) {
      const params = {};
      params.staff_id = payload.staff_id;
      params._id = payload._id;
      const result = yield call(removeEmployeeId, params);
      if (result.zh_message) {
        message.error(result.zh_message);
      } else {
        message.success('删除成功');
        yield put({ type: 'fetchEmployeeDetail', payload: { employeeId: payload.employeeId } });
      }
    },

    /**
     * 获取工作信息数据
     * @param {}
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *fetchWorkInfoData({ payload }, { call, put }) {
      const params = {
        _meta: {
          page: 1,
          limit: 999,
        },
      };
      // 员工id
      if (is.existy(payload.staffId) && is.not.empty(payload.staffId)) {
        params._id = payload.staffId;
      }
      // 分页
      if (is.existy(payload.meta) && is.not.empty(payload.meta)) {
        params._meta = payload.meta;
      }
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }
      const result = yield call(fetchEmployeeWorkInfo, params);
      if (result && result.zh_message) {
        return message.error(result.zh_message);
      }
      yield put({ type: 'reduceEmployeeWorkInfo', payload: result });
    },

    /**
     * 获取合同信息数据
     * @param {}
     * @memberof module:model/employee/manage~employee/manage/effects
     */
    *fetchContractInfoData({ payload }, { call, put }) {
      const params = {
        _meta: { page: 1, limit: 999 },
      };
      // 员工id
      if (is.existy(payload.id) && is.not.empty(payload.id)) {
        params.staff_id = payload.id;
      }
      // 身份证
      if (is.existy(payload.identity) && is.not.empty(payload.identity)) {
        params.identity_card_id = payload.identity;
      }
      // 状态
      if (is.existy(payload.state) && is.not.empty(payload.state)) {
        params.state = payload.state;
      }

      // 分页
      if (is.existy(payload.meta) && is.not.empty(payload.meta)) {
        params._meta = payload.meta;
      }
      // 签约完成时间
      if (is.existy(payload.date) && is.not.empty(payload.date)) {
        params.done_min_at = moment(payload.date[0]).format('YYYY-MM-DD 00:00:00');
        params.done_max_at = moment(payload.date[1]).format('YYYY-MM-DD 00:00:00');
      }
      const result = yield call(fetchEmployeeContractInfo, params);
      if (result && result.zh_message) {
        return message.error(result.zh_message);
      }
      yield put({ type: 'reduceEmployeeContractInfo', payload: result });
    },

    /**
     * 获取归属team类型
     */
    *getTeamTypeList({ payload }, { call, put }) {
      const params = {};
      const result = yield call(fetchGetTeamTypes, params);
      // 报错信息
      if (result.zh_message) {
        return message.error(result.zh_message);
      }
      // 判断数据是否为空
      if (Array.isArray(result)) {
        yield put({ type: 'reduceTeamTypeList', payload: result });
      }
    },

    /**
     * 获取归属team
     */
    *getTeamList({ payload }, { call, put }) {
      const params = {};
      if (payload.teamType) {
        params.team_type_list = Array.isArray(payload.teamTypes) ? payload.teamType : [payload.teamType];
      }
      const result = yield call(fetchGetTeams, params);
      // 报错信息
      if (result.zh_message) {
        if (payload.onsetFlagCallback) {
          payload.onsetFlagCallback();
        }
        return message.error(`请求错误：${result.zh_message}`);
      }
      // 判断数据是否为空
      if (Array.isArray(result)) {
        yield put({ type: 'reduceTeamList', payload: result });
        if (payload.onsetFlagCallback) {
          payload.onsetFlagCallback();
        }
      }
    },

    /**
     * 新建员工档案
     */
    *createEmployeeFile({ payload }, { call }) {
      const params = dealData(payload);
      const res = yield call(createEmployeeFile, params);
      return res;
    },

    /**
     * 新建员工合同
     */
    *createEmployeeContract({ payload }, { call }) {
      const params = dealData(payload);
      const res = yield call(createContract, params);
      return res;
    },

    /**
     * 新建员工档案
     */
    *updateEmployeeFile({ payload }, { call }) {
      const params = {
        _id: payload._id,
        tab_type: payload.tab_type,
        data: dealData(payload.data),
      };

      const res = yield call(updateEmployeeFile, params);
      return res;
    },

    /**
     * 新建员工档案
     */
    *updateEmployeeContract({ payload }, { call }) {
      const params = {
        ...dealData(payload),
      };
      const res = yield call(updateStaffContract, params);
      return res;
    },

    /**
     * 劳动者档案编辑
     */
    *updateLaborerFile({ payload }, { call }) {
      const params = {
        _id: payload._id,
        tab_type: payload.tab_type,
        data: dealData(payload.data),
      };
      const res = yield call(updateLaborerFile, params);

      return res;
    },

    /**
     * 变更team
     */
    *changeTeam({ payload = {} }, { call }) {
      const {
        type,
        name,
        fileType,
        ids,
      } = payload;

      const params = {
        cost_team_id: name,
        cost_team_type: type,
      };

      fileType === 'staff' && (params.employee_ids = ids);
      fileType !== 'staff' && (params.staff_ids = ids);

      const res = fileType === 'staff' ?
        yield call(changeStaffTeam, params)
        : yield call(changeProfileTeam, params);
      return res;
    },

    /**
     * 二次入职（获取员工详情）
     */
    *getTwiceBoard({ payload = {} }, { call }) {
      const params = {
        identity_card_id: payload.identityCardId,
        profile_type: FileType.staff,
      };

      const res = yield call(fetchEmployeeDetailStaff, params);
      return res;
    },

    /**
     * 获取员工列表（区别于旧modal）
     */
    getStaffList: [
      function*({ payload = {} }, { call, put }) {
        const {
          onSuccessCallback,
          tabKey,
        } = payload;
        // 处理查询参数
        const params = commentPersonnelparams(payload, 'find');

        const res = yield call(fetchEmployeesStaff, params);

        if (res && res.data) {
          yield put({ type: 'reduceStaffList', payload: { ...res, tabKey } });
          // 成功回调
          onSuccessCallback && onSuccessCallback();
        }
      },
      { type: 'takeLatest' },
    ],

    /**
     * 重置员工列表
     */
    *resetStafList({ payload = {} }, { put }) {
      yield put({ type: 'reduceStaffList' });
    },
  },
  /**
   * @namespace employee/manage/reducers
   */
  reducers: {
    changeFileType(state, action) {
      return { ...state, fileType: action.fileType };
    },
    /**
     * 人员档案
     * @returns {object} 更新 staffProfile
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceStaffProfile(state, action) {
      const staffProfile = action.payload;
      return { ...state, staffProfile };
    },
    /**
     * 账户列表
     * @returns {object} 更新 employeesSecond
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceEmployeesSecond(state, action) {
      const { _meta } = action.payload;
      const employeesSecond = {
        ...action.payload,
        meta: ResponseMeta.mapper(_meta),
      };
      return { ...state, employeesSecond };
    },
    /**
     * 账户列表
     * @returns {object} 更新 employees
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceEmployees(state, action) {
      const { _meta } = action.payload;
      const employees = {
        ...action.payload,
        meta: ResponseMeta.mapper(_meta),
      };
      return { ...state, employees };
    },
    /**
     * 根据身份证号查询人员列表
     * @returns {object} 更新 idCardEmployees
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceIdCardEmployees(state, action) {
      const { _meta } = action.payload;
      const idCardEmployees = {
        ...action.payload,
        meta: ResponseMeta.mapper(_meta),
      };
      return { ...state, idCardEmployees };
    },
    /**
     * 账户列表全部信息
     * @returns {object} 更新 employeesAll
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceEmployeesAll(state, action) {
      let employeesAll = {};
      // 判断人员列表是否返回数据
      if (is.not.empty(action.payload) && is.existy(action.payload)) {
        const { _meta } = action.payload;
        employeesAll = {
          ...action.payload,
          meta: ResponseMeta.mapper(_meta),
        };
      }
      return { ...state, employeesAll };
    },
    /**
    * 人员详情
    * @returns {object} 更新 employeeDetail
    * @memberof module:model/employee/manage~employee/manage/reducers
    */
    reduceEmployeeDetail(state, action) {
      return { ...state, employeeDetail: action.payload };
    },
    /**
     * 历史记录
     * @returns {object} 更新 historyRecord
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceEmployeeHistoryRecord(state, action) {
      const { _meta } = action.payload;
      const historyRecord = {
        ...action.payload,
        meta: ResponseMeta.mapper(_meta),
      };
      return { ...state, historyRecord };
    },

    /**
     * 获取劳动者个户记录
     * @returns {object} 更新 individualRegistration
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceEmployeeIndividualRegistration(state, action) {
      return {
        ...state,
        individualRegistration: action.payload,
      };
    },
    /**
     * 获取劳动者历史三方id
     * @returns {object} 更新 historyTripartiteId
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceEmployeeHistoryTripartiteId(state, action) {
      return {
        ...state,
        historyTripartiteId: action.payload,
      };
    },

    /**
    * 银行卡识别信息
    * @returns {object} 更新 bankInfo
    * @memberof module:model/employee/manage~employee/manage/reducers
    */
    reduceBankCardIdentification(state, action) {
      let bankInfo = {};
      if (is.existy(action.payload) && is.not.empty(action.payload)) {
        bankInfo = { ...action.payload.record };
      }
      return { ...state, bankInfo };
    },
    /**
    * 工作信息
    * @returns {object} 更新 workData
    * @memberof module:model/employee/manage~employee/manage/reducers
    */
    reduceEmployeeWorkInfo(state, action) {
      const workData = action.payload;
      return { ...state, workData };
    },
    /**
     * 合同信息
     * @returns {object} 更新 contractData
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceEmployeeContractInfo(state, action) {
      return { ...state, contractData: action.payload };
    },
    /**
     * 获取归属team类型
     * @returns {object} 更新 teamTypes
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceGetTeamTypes(state, action) {
      return { ...state, teamTypes: action.payload };
    },
    /**
     * 获取归属team
     * @returns {object} 更新 teams
     * @memberof module:model/employee/manage~employee/manage/reducers
     */
    reduceGetTeams(state, action) {
      const { result, namespace } = action.payload;
      return {
        ...state,
        teams: {
          ...state.teams,
          [namespace]: result,
        },
      };
    },

    /**
     * 更新team类型
     */
    reduceTeamTypeList(state, action) {
      let teamTypeList = [];
      if (Array.isArray(action.payload) && action.payload.length > 0) {
        teamTypeList = action.payload;
      }
      return { ...state, teamTypeList };
    },

    /**
     * 更新team
     */
    reduceTeamList(state, action) {
      let teamList = [];
      if (Array.isArray(action.payload) && action.payload.length > 0) {
        teamList = action.payload;
      }
      return { ...state, teamList };
    },

    /**
     * 重置员工列表（区别于旧modal）
     */
    reduceStaffList(state, action) {
      let { staffList = {} } = state;
      // tabKey 命名空间
      const tabKey = utils.dotOptimal(action, 'payload.tabKey', undefined);

      if (!tabKey) {
        staffList = {};
      } else {
        staffList[tabKey] = utils.dotOptimal(action, 'payload', {});
      }

      return { ...state, staffList };
    },
  },
};
