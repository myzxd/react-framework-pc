/**
 * 社保公积金 - model
 * @module model/employee/society
 */
import is from 'is_js';
import { message } from 'antd';
import { Unit } from '../../application/define';
import {
  fetchSocietyListApi,                           // 获取参保方案列表
  fetchSocietyPlanDetail,                     // 获取参保方案详情
  createSociety,                              // 新增参保方案
  updateSociety,                              // 编辑参保方案
} from '../../services/society';

export default {

  /**
   * 命名空间
   * @default
   */
  namespace: 'society',

  /**
   * 状态树
   * @prop {object} societyList
   * @prop {object} societyPlanArray
   * @prop {object} societyPlanDetail
   */
  state: {
    societyList: {},                    // 参保方案列表信息
    societyPlanList: {},               // 参保方案名称下拉列表
    staffSocietyPlanList: {},               // 人员社保方案名称下拉列表
    staffFundPlanList: {},               // 人员公积金名称下拉列表
    societyPlanDetail: {},               // 参保方案详情
    societyAnomalyList: {},               // 异常数据列表
  },

  /**
   * @namespace employee/society/effects
   */
  effects: {
    /**
     * 获取参保方案列表
     * @param {object} city 城市
     * @param {string} planName 参保方案名称
     * @param {number} page 页码
     * @param {number} limit 每页数量
     */
    *fetchSocietyList({ payload }, { call, put }) {
      const {
        city,                       // 城市
        planName,                   // 参保方案名称
        page,                       // 页码
        limit,                      // 每页条数
      } = payload;
      const params = {
        _meta: {
          page: 1,
          limit: 30,
        },
      };            // 请求参数
      // 城市
      if (is.not.empty(city) && is.existy(city)) {
        // 省
        if (city.province) {
          params.province_code = city.province;
        }
        // 市
        if (city.city) {
          params.city_code = city.city;
        }
      }
      // 参保方案名称
      if (is.not.empty(planName) && is.string(planName)) {
        params.name = planName;
      }

      // 页码
      if (is.existy(page) && is.number(page)) {
        params._meta.page = page;
      }

      // 每页条数
      if (is.existy(limit) && is.number(limit)) {
        params._meta.limit = limit;
      }

      // 请求接口
      const result = yield call(fetchSocietyListApi, params);

      // 判断数据是否为空
      if (is.not.existy(result) || is.empty(result)) {
        return message('获取参保方案列表失败');
      }

      yield put({
        type: 'reduceSocietyList',
        payload: result,
      });
    },
    /**
     * 获取参保方案名称列表
     * @param {array} city 城市
     */
    *fetchSocietyPlanList({ payload }, { call, put }) {
      const {
        city,                       // 城市
      } = payload;
      const params = {
        _meta: {
          page: 1,
          limit: 9999,
        },
      };            // 请求参数
      // 城市
      if (is.not.empty(city) && is.existy(city)) {
        // 省
        if (city.province) {
          params.province_code = city.province;
        }
        // 市
        if (city.city) {
          params.city_code = city.city;
        }
      }

      // 请求接口
      const result = yield call(fetchSocietyListApi, params);

      // 判断数据是否为空
      if (is.not.existy(result) || is.empty(result)) {
        return message('获取参保方案名称下拉列表失败');
      }

      yield put({
        type: 'reduceSocietyPlanList',
        payload: result,
      });
    },
    /**
     * 获取参保方案名称列表
     * @param {array} city 城市
     */
    *fetchStaffSocietyPlanList({ payload }, { call, put }) {
      const {
        city,                       // 城市
        type,                       // 类型
      } = payload;
      const params = {
        _meta: {
          page: 1,
          limit: 9999,
        },
      };            // 请求参数
      // 城市
      if (is.not.empty(city) && is.existy(city)) {
        // 省
        if (city.province) {
          params.province_code = city.province;
        }
        // 市
        if (city.city) {
          params.city_code = city.city;
        }
      }
      // 请求接口
      const result = yield call(fetchSocietyListApi, params);

      // 判断数据是否为空
      if (is.not.existy(result) || is.empty(result)) {
        return message('获取参保方案名称下拉列表失败');
      }
      if (type === 'society') {
        yield put({
          type: 'reduceStaffSocietyPlanList',
          payload: result,
        });
      }
      if (type === 'fund') {
        yield put({
          type: 'reduceStaffFundPlanList',
          payload: result,
        });
      }
    },
    /**
     * 获取参保方案详情
     * @param {string} id 参保方案id
     */
    *fetchSocietyPlanDetail({ payload }, { call, put }) {
      const {
        id,                      // 参保方案id
      } = payload;
      const params = {};            // 请求参数
      // 参保方案id
      if (is.not.empty(id) && is.existy(id)) {
        params._id = id;
      }

      // 请求接口
      const result = yield call(fetchSocietyPlanDetail, params);

      // 判断数据是否为空
      if (is.not.existy(result) || is.empty(result)) {
        return message('获取参保方案下拉列表失败');
      }

      yield put({
        type: 'reduceSocietyPlanDetail',
        payload: result,
      });
    },
    /**
     * 新建参保方案
     */
    *createSociety({ payload }, { call }) {
      const {
        onComplete,
        city,
        planName,
        pensionBaseUp,          // 养老
        pensionBaseDown,
        pensionCompany,
        pensionPerson,
        medicineBaseUp,         // 医疗
        medicineBaseDown,
        medicineCompany,
        medicinePerson,
        loseBaseUp,             // 失业
        loseBaseDown,
        loseCompany,
        losePerson,
        birthBaseUp,            // 生育
        birthBaseDown,
        birthCompany,
        birthPerson,
        injuryBaseUp,           // 工伤
        injuryBaseDown,
        injuryCompany,
        injuryPerson,
        fundBaseUp,           // 公积金
        fundBaseDown,
        fundCompany,
        fundPerson,
      } = payload;
      const params = {
        old_age_insurance: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
        medical_insurance: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
        unemployment_insurance: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
        birth_insurance: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
        occupational_insurance: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
        provident_fund: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
      };            // 请求参数
      // 城市
      if (is.not.empty(city) && is.existy(city)) {
        // 省
        if (city.province) {
          params.province_code = city.province;
        }
        // 市
        if (city.city) {
          params.city_code = city.city;
        }
      }
      // 参保方案名称
      if (is.not.empty(planName) && is.existy(planName)) {
        params.name = planName;
      }
      const transf = Unit.exchangePriceToCent;
      // 养老
      if (pensionBaseUp || pensionBaseUp === 0) {
        params.old_age_insurance.upper_limit = transf(pensionBaseUp);
      }
      if (pensionBaseDown || pensionBaseDown === 0) {
        params.old_age_insurance.lower_limit = transf(pensionBaseDown);
      }
      if (pensionCompany || pensionCompany === 0) {
        params.old_age_insurance.company_percent = pensionCompany;
      }
      if (pensionPerson || pensionPerson === 0) {
        params.old_age_insurance.person_percent = pensionPerson;
      }
      // 医疗
      if (medicineBaseUp || medicineBaseUp === 0) {
        params.medical_insurance.upper_limit = transf(medicineBaseUp);
      }
      if (medicineBaseDown || medicineBaseDown === 0) {
        params.medical_insurance.lower_limit = transf(medicineBaseDown);
      }
      if (medicineCompany || medicineCompany === 0) {
        params.medical_insurance.company_percent = medicineCompany;
      }
      if (medicinePerson || medicinePerson === 0) {
        params.medical_insurance.person_percent = medicinePerson;
      }
      // 失业
      if (loseBaseUp || loseBaseUp === 0) {
        params.unemployment_insurance.upper_limit = transf(loseBaseUp);
      }
      if (loseBaseDown || loseBaseDown === 0) {
        params.unemployment_insurance.lower_limit = transf(loseBaseDown);
      }
      if (loseCompany || loseCompany === 0) {
        params.unemployment_insurance.company_percent = loseCompany;
      }
      if (losePerson || losePerson === 0) {
        params.unemployment_insurance.person_percent = losePerson;
      }
      // 生育
      if (birthBaseUp || birthBaseUp === 0) {
        params.birth_insurance.upper_limit = transf(birthBaseUp);
      }
      if (birthBaseDown || birthBaseDown === 0) {
        params.birth_insurance.lower_limit = transf(birthBaseDown);
      }
      if (birthCompany || birthCompany === 0) {
        params.birth_insurance.company_percent = birthCompany;
      }
      if (birthPerson || birthPerson === 0) {
        params.birth_insurance.person_percent = birthPerson;
      }
      // 工伤
      if (injuryBaseUp || injuryBaseUp === 0) {
        params.occupational_insurance.upper_limit = transf(injuryBaseUp);
      }
      if (injuryBaseDown || injuryBaseDown === 0) {
        params.occupational_insurance.lower_limit = transf(injuryBaseDown);
      }
      if (injuryCompany || injuryCompany === 0) {
        params.occupational_insurance.company_percent = injuryCompany;
      }
      if (injuryPerson || injuryPerson === 0) {
        params.occupational_insurance.person_percent = injuryPerson;
      }
      // 公积金
      if (fundBaseUp || fundBaseUp === 0) {
        params.provident_fund.upper_limit = transf(fundBaseUp);
      }
      if (fundBaseDown || fundBaseDown === 0) {
        params.provident_fund.lower_limit = transf(fundBaseDown);
      }
      if (fundCompany || fundCompany === 0) {
        params.provident_fund.company_percent = fundCompany;
      }
      if (fundPerson || fundPerson === 0) {
        params.provident_fund.person_percent = fundPerson;
      }

      // 请求接口
      const result = yield call(createSociety, params);
      // 判断是否出错
      if (result.message) {
        return message(result.message);
      }
      // 如果已经完成了
      if (onComplete) {
        onComplete(result);
      }
    },
    /**
     * 编辑参保方案
     */
    *updateSociety({ payload }, { call }) {
      const {
        id,
        onComplete,
        city,
        planName,
        pensionBaseUp,          // 养老
        pensionBaseDown,
        pensionCompany,
        pensionPerson,
        medicineBaseUp,         // 医疗
        medicineBaseDown,
        medicineCompany,
        medicinePerson,
        loseBaseUp,             // 失业
        loseBaseDown,
        loseCompany,
        losePerson,
        birthBaseUp,            // 生育
        birthBaseDown,
        birthCompany,
        birthPerson,
        injuryBaseUp,           // 工伤
        injuryBaseDown,
        injuryCompany,
        injuryPerson,
        fundBaseUp,           // 公积金
        fundBaseDown,
        fundCompany,
        fundPerson,
      } = payload;
      const params = {
        old_age_insurance: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
        medical_insurance: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
        unemployment_insurance: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
        birth_insurance: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
        occupational_insurance: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
        provident_fund: {
          upper_limit: null,
          lower_limit: null,
          company_percent: null,
          person_percent: null,
        },
      };            // 请求参数
      // 城市
      if (is.not.empty(city) && is.existy(city)) {
        // 省
        if (city.province) {
          params.province_code = city.province;
        }
        // 市
        if (city.city) {
          params.city_code = city.city;
        }
      }
      // 参保方案id
      if (is.not.empty(id) && is.existy(id)) {
        params._id = id;
      }
      // 参保方案名称
      if (is.not.empty(planName) && is.existy(planName)) {
        params.name = planName;
      }
      const transf = Unit.exchangePriceToCent;
      // 养老
      if (pensionBaseUp || pensionBaseUp === 0) {
        params.old_age_insurance.upper_limit = transf(pensionBaseUp);
      }
      if (pensionBaseDown || pensionBaseDown === 0) {
        params.old_age_insurance.lower_limit = transf(pensionBaseDown);
      }
      if (pensionCompany || pensionCompany === 0) {
        params.old_age_insurance.company_percent = pensionCompany;
      }
      if (pensionPerson || pensionPerson === 0) {
        params.old_age_insurance.person_percent = pensionPerson;
      }
      // 医疗
      if (medicineBaseUp || medicineBaseUp === 0) {
        params.medical_insurance.upper_limit = transf(medicineBaseUp);
      }
      if (medicineBaseDown || medicineBaseDown === 0) {
        params.medical_insurance.lower_limit = transf(medicineBaseDown);
      }
      if (medicineCompany || medicineCompany === 0) {
        params.medical_insurance.company_percent = medicineCompany;
      }
      if (medicinePerson || medicinePerson === 0) {
        params.medical_insurance.person_percent = medicinePerson;
      }
      // 失业
      if (loseBaseUp || loseBaseUp === 0) {
        params.unemployment_insurance.upper_limit = transf(loseBaseUp);
      }
      if (loseBaseDown || loseBaseDown === 0) {
        params.unemployment_insurance.lower_limit = transf(loseBaseDown);
      }
      if (loseCompany || loseCompany === 0) {
        params.unemployment_insurance.company_percent = loseCompany;
      }
      if (losePerson || losePerson === 0) {
        params.unemployment_insurance.person_percent = losePerson;
      }
      // 生育
      if (birthBaseUp || birthBaseUp === 0) {
        params.birth_insurance.upper_limit = transf(birthBaseUp);
      }
      if (birthBaseDown || birthBaseDown === 0) {
        params.birth_insurance.lower_limit = transf(birthBaseDown);
      }
      if (birthCompany || birthCompany === 0) {
        params.birth_insurance.company_percent = birthCompany;
      }
      if (birthPerson || birthPerson === 0) {
        params.birth_insurance.person_percent = birthPerson;
      }
      // 工伤
      if (injuryBaseUp || injuryBaseUp === 0) {
        params.occupational_insurance.upper_limit = transf(injuryBaseUp);
      }
      if (injuryBaseDown || injuryBaseDown === 0) {
        params.occupational_insurance.lower_limit = transf(injuryBaseDown);
      }
      if (injuryCompany || injuryCompany === 0) {
        params.occupational_insurance.company_percent = injuryCompany;
      }
      if (injuryPerson || injuryPerson === 0) {
        params.occupational_insurance.person_percent = injuryPerson;
      }
      // 公积金
      if (fundBaseUp || fundBaseUp === 0) {
        params.provident_fund.upper_limit = transf(fundBaseUp);
      }
      if (fundBaseDown || fundBaseDown === 0) {
        params.provident_fund.lower_limit = transf(fundBaseDown);
      }
      if (fundCompany || fundCompany === 0) {
        params.provident_fund.company_percent = fundCompany;
      }
      if (fundPerson || fundPerson === 0) {
        params.provident_fund.person_percent = fundPerson;
      }
      // 请求接口
      const result = yield call(updateSociety, params);
      // 判断是否出错
      if (result.message) {
        return message(result.message);
      }
      // 如果已经完成了
      if (onComplete) {
        onComplete(result.exception_employee_num);
      }
    },
  },

  /**
   * @namespace employee/society/reducers
   */
  reducers: {

    /**
     * 参保方案列表
     * @returns {object} 更新 societyList
     */
    reduceSocietyList(state, action) {
      // 更新数据
      return { ...state, societyList: action.payload };
    },

    /**
     * 参保方案名称下拉列表
     * @returns {object} 更新 societyPlanList
     */
    reduceSocietyPlanList(state, action) {
      // 更新数据
      return { ...state, societyPlanList: action.payload };
    },

    /**
     * 参保方案详情
     * @returns {object} 更新 societyPlanDetail
     */
    reduceSocietyPlanDetail(state, action) {
      // 更新数据
      return { ...state, societyPlanDetail: action.payload };
    },

    /**
     * 参保异常数据列表
     * @returns {object} 更新 societyAnomalyList
     */
    reduceSocietyAnomalyList(state, action) {
      // 更新数据
      return { ...state, societyAnomalyList: action.payload };
    },

    /**
     * 人员社保方案名称下拉列表
     * @returns {object} 更新 staffSocietyPlanList
     */
    reduceStaffSocietyPlanList(state, action) {
      // 更新数据
      return { ...state, staffSocietyPlanList: action.payload };
    },
    /**
     * 人员公积金名称下拉列表
     * @returns {object} 更新 staffFundPlanList
     */
    reduceStaffFundPlanList(state, action) {
      // 更新数据
      return { ...state, staffFundPlanList: action.payload };
    },
  },
};
